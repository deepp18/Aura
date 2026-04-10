import React, { useState, useEffect, useRef } from "react";

export default function BubbleWrap() {
  const [bubbles, setBubbles] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const requestRef = useRef(null);
  const containerRef = useRef(null);

  // Add random floating bubbles
  const addBubbles = () => {
    const newBubbles = Array.from({ length: 15 }).map((_, i) => {
      const size = 40 + Math.random() * 60; // 40 to 100px
      return {
        id: Date.now() + i + Math.random(),
        x: Math.random() * (500 - size),
        y: Math.random() * (350 - size),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size,
        popped: false
      };
    });
    setBubbles(prev => [...prev, ...newBubbles]);
  };

  useEffect(() => {
    addBubbles();
  }, []);

  const updateBubbles = () => {
    setBubbles(prevBubbles => {
      return prevBubbles.map(b => {
        if (b.popped) return b;
        let newX = b.x + b.vx;
        let newY = b.y + b.vy;
        let newVx = b.vx;
        let newVy = b.vy;

        // Bounce off walls (assuming 600x400 container)
        if (newX <= 0 || newX >= 600 - b.size) {
          newVx *= -1;
          newX = newX <= 0 ? 0 : 600 - b.size;
        }
        if (newY <= 0 || newY >= 400 - b.size) {
          newVy *= -1;
          newY = newY <= 0 ? 0 : 400 - b.size;
        }

        return { ...b, x: newX, y: newY, vx: newVx, vy: newVy };
      });
    });
    requestRef.current = requestAnimationFrame(updateBubbles);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateBubbles);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const playPopSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!window.audioCtx) window.audioCtx = new AudioContext();
      if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
      
      const osc = window.audioCtx.createOscillator();
      const gain = window.audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(800 + Math.random() * 400, window.audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(100, window.audioCtx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.3, window.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, window.audioCtx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(window.audioCtx.destination);
      osc.start();
      osc.stop(window.audioCtx.currentTime + 0.05);
    } catch(e) {}
  };

  const triggerHaptics = () => {
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const pop = (id) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(c => c + 1);
    playPopSound();
    triggerHaptics();
    
    // Remove bubble completely after pop animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
    }, 200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 600, marginBottom: 15 }}>
        <div style={{ color: "#60a5fa", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em" }}>Popped: {poppedCount}</div>
        <button onClick={addBubbles} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "4px 12px", color: "#ccc", cursor: "pointer", fontSize: 12 }}>+ Add Bubbles</button>
      </div>

      <div 
        ref={containerRef}
        style={{ 
          position: "relative", 
          width: 600, 
          height: 400, 
          background: "transparent", 
          borderRadius: 24, 
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden" 
        }}
      >
        {bubbles.map((b) => (
          <div
            key={b.id}
            onMouseDown={() => !b.popped && pop(b.id)}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              // Iconic glassy iridescent bubble look
              background: b.popped ? "transparent" : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(96,165,250,0.1) 60%, rgba(255,255,255,0.3) 100%)",
              boxShadow: b.popped ? "none" : "inset 0 0 20px rgba(255,255,255,0.4), inset 10px 0 30px rgba(255,0,255,0.1), inset -10px 0 30px rgba(0,255,255,0.1), 0 10px 20px rgba(0,0,0,0.1)",
              border: b.popped ? "none" : "1px solid rgba(255,255,255,0.4)",
              transform: b.popped ? "scale(1.5)" : "scale(1)",
              opacity: b.popped ? 0 : 0.85,
              transition: b.popped ? "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none",
              cursor: "crosshair",
              userSelect: "none"
            }}
          />
        ))}

        {bubbles.filter(b => !b.popped).length === 0 && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "rgba(96,165,250,0.3)", pointerEvents: "none", animation: "au-fadeUp .5s" }}>
            <h2>All clear!</h2>
          </div>
        )}
      </div>
    </div>
  );
}
