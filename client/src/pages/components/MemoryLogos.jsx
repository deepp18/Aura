import React, { useState, useRef, useEffect } from "react";

export default function MemoryLogos() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [opacity, setOpacity] = useState(0.5);

  const LOGOS = [
    { name: "Apple", icon: "🍎" },
    { name: "Target", icon: "🎯" },
    { name: "McDonald's", icon: "🍟" },
    { name: "Twitter", icon: "🐦" },
    { name: "Nike", icon: "✔️" } // Text fallback for nike
  ];
  
  const [target, setTarget] = useState(LOGOS[0]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e) => {
    if (revealed) return;
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const move = (e) => {
    if (!isDrawing || revealed) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stop = () => setIsDrawing(false);

  const newPrompt = () => {
    setTarget(LOGOS[Math.floor(Math.random() * LOGOS.length)]);
    setRevealed(false);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 400, 300);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h3 style={{ color: "#fca5a5" }}>Draw the "{target.name}" Logo</h3>
      
      <div style={{ position: "relative", width: 400, height: 300, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, marginTop: 10, overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
          style={{ cursor: revealed ? "default" : "crosshair", position: "absolute", zIndex: 10 }}
        />
        
        {revealed && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: opacity, fontSize: 180, pointerEvents: "none", zIndex: 5 }}>
            {target.icon}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 15, alignItems: "center" }}>
        {revealed ? (
          <>
            <span style={{ fontSize: 12, color: "#aaa" }}>Your Drawing</span>
            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(e.target.value)} style={{ width: 150 }} />
            <span style={{ fontSize: 12, color: "#aaa" }}>Actual Logo</span>
            <button onClick={newPrompt} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #aaa", color: "#aaa", padding: "6px 12px", borderRadius: 8, cursor: "pointer", marginLeft: 10 }}>Next Logo</button>
          </>
        ) : (
          <>
            <button onClick={() => setRevealed(true)} style={{ background: "rgba(252,165,165,0.15)", border: "1px solid #fca5a5", color: "#fca5a5", padding: "8px 24px", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>Reveal</button>
            <button onClick={() => canvasRef.current.getContext("2d").clearRect(0, 0, 400, 300)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>Clear</button>
          </>
        )}
      </div>
    </div>
  );
}
