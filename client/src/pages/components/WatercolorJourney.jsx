import React, { useState, useRef } from "react";

export default function WatercolorJourney() {
  const [drops, setDrops] = useState([]);
  const count = useRef(0);

  const handleMove = (e) => {
    count.current++;
    if (count.current % 3 !== 0) return; // Throttle to prevent too many divs

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ["#fca5a5", "#fbcfe8", "#c4b5fd", "#93c5fd", "#6ee7b7", "#fef08a"];
    const col = colors[Math.floor(Math.random() * colors.length)];
    const size = 60 + Math.random() * 100;

    const newDrop = { id: Date.now() + Math.random(), x, y, col, size };
    setDrops(prev => [...prev.slice(-40), newDrop]); // Keep max 40 blobs
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ color: "#a78bfa", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 15 }}>
        Move your cursor to bring color back to the world.
      </p>
      
      <div 
        onMouseMove={handleMove}
        style={{
          width: "100%", maxWidth: 600, height: 400,
          background: "#1e1e1e", // Dark greyscale base
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          overflow: "hidden",
          cursor: "crosshair",
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.5)"
        }}
      >
        {drops.map(d => (
          <div
            key={d.id}
            style={{
              position: "absolute",
              left: d.x - d.size / 2,
              top: d.y - d.size / 2,
              width: d.size, height: d.size,
              background: d.col,
              borderRadius: "50%",
              filter: "blur(25px)",
              opacity: 0.6,
              mixBlendMode: "screen",
              animation: "bloom 4s ease-out forwards",
              pointerEvents: "none"
            }}
          />
        ))}

        {drops.length > 15 && (
          <div style={{ position: "absolute", top: "40%", width: "100%", textAlign: "center", pointerEvents: "none", animation: "au-fadeUp 2s" }}>
            <h2 style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'DM Serif Display',serif", fontSize: 28, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>Breathe...</h2>
          </div>
        )}
        
        <style>{`
          @keyframes bloom {
            0% { transform: scale(0.2); opacity: 0; }
            20% { opacity: 0.7; }
            100% { transform: scale(1.5); opacity: 0.4; }
          }
        `}</style>
      </div>
    </div>
  );
}
