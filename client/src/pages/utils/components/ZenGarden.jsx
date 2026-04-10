import React, { useState, useEffect } from "react";

// Stages: 0=Dirt, 1=Watered, 2=Growing, 3=Flower
export default function ZenGarden() {
  const [grid, setGrid] = useState(Array(9).fill({ stage: 0, progress: 0, type: "" }));
  const [tool, setTool] = useState("water"); // 'water', 'harvest'
  
  const FLOWERS = ["🌷","🌻","🌹","🌼","🌸","🌺"];

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prev => prev.map(tile => {
        if (tile.stage === 1) {
          const nextProg = tile.progress + 2; // +2% per tick (about 50 ticks = 5 seconds)
          if (nextProg >= 100) return { ...tile, stage: 2, progress: 100, type: FLOWERS[Math.floor(Math.random() * FLOWERS.length)] };
          return { ...tile, progress: nextProg };
        }
        return tile;
      }));
    }, 200); // Super fast growth for demo! 10 seconds total.
    return () => clearInterval(interval);
  }, []);

  const interact = (index) => {
    setGrid(prev => {
      const next = [...prev];
      const tile = { ...next[index] };
      
      if (tool === "water" && tile.stage === 0) {
        tile.stage = 1;
        tile.progress = 0;
      } else if (tool === "harvest" && tile.stage === 2) {
        tile.stage = 0; // reset to dirt
      }
      
      next[index] = tile;
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTool("water")} style={{ padding: "8px 16px", borderRadius: 8, background: tool === "water" ? "#34d399" : "rgba(255,255,255,0.05)", color: tool === "water" ? "#000" : "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>💧 Water (Plant)</button>
        <button onClick={() => setTool("harvest")} style={{ padding: "8px 16px", borderRadius: 8, background: tool === "harvest" ? "#fcd34d" : "rgba(255,255,255,0.05)", color: tool === "harvest" ? "#000" : "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>✂️ Harvest</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, background: "#451a03", padding: 15, borderRadius: 16, border: "4px solid #78350f" }}>
        {grid.map((t, i) => (
          <div 
            key={i} 
            onClick={() => interact(i)}
            style={{
              width: 80, height: 80, 
              background: t.stage === 0 ? "#78350f" : t.stage === 1 ? "#3f1b04" : "#78350f",
              borderRadius: 8,
              border: "2px solid rgba(0,0,0,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.5s"
            }}
          >
            {t.stage === 1 && (
              <div style={{ position: "absolute", bottom: 0, left: 0, height: "10%", background: "#34d399", width: `${t.progress}%`, transition: "width 0.2s linear", borderBottomLeftRadius: 8, borderBottomRightRadius: t.progress > 95 ? 8 : 0 }} />
            )}
            <span style={{ fontSize: 32, zIndex: 2, transform: t.stage === 2 ? "scale(1.2)" : "scale(1)", transition: "transform 0.4s" }}>
              {t.stage === 1 ? "🌱" : t.stage === 2 ? t.type : ""}
            </span>
          </div>
        ))}
      </div>
      <p style={{ color: "#d4d4d8", fontSize: 13, marginTop: 15 }}>The seeds grow when you step away. Breathe deeply.</p>
    </div>
  );
}
