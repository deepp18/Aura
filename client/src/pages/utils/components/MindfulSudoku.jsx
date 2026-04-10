import React, { useState } from "react";

export default function MindfulSudoku() {
  // A static, peaceful, pre-filled puzzle block with missing spots. (Not a full generator for simplicity).
  const initialGrid = [
    [5, 3, "", "", 7, "", "", "", ""],
    [6, "", "", 1, 9, 5, "", "", ""],
    ["", 9, 8, "", "", "", "", 6, ""],
    [8, "", "", "", 6, "", "", "", 3],
    [4, "", "", 8, "", 3, "", "", 1],
    [7, "", "", "", 2, "", "", "", 6],
    ["", 6, "", "", "", "", 2, 8, ""],
    ["", "", "", 4, 1, 9, "", "", 5],
    ["", "", "", "", 8, "", "", 7, 9]
  ];

  const [grid, setGrid] = useState(initialGrid);

  const handleChange = (r, c, val) => {
    if (!/^[1-9]?$/.test(val)) return;
    setGrid(prev => {
      const next = [...prev];
      next[r] = [...next[r]];
      next[r][c] = val;
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ color: "#60a5fa", fontSize: 13, letterSpacing: "0.05em", marginBottom: 20 }}>Find the flow state. There is no timer.</p>
      
      <div style={{ 
        display: "grid", gridTemplateColumns: "repeat(9, 1fr)", 
        border: "2px solid #3b82f6", background: "rgba(59,130,246,0.05)",
        width: "fit-content", borderRadius: 8, overflow: "hidden" 
      }}>
        {grid.map((row, r) => (
          row.map((cell, c) => {
            const isStatic = initialGrid[r][c] !== "";
            return (
              <input
                key={`${r}-${c}`}
                type="text"
                value={cell}
                onChange={e => handleChange(r, c, e.target.value)}
                readOnly={isStatic}
                maxLength={1}
                style={{
                  width: 36, height: 36, textAlign: "center", fontSize: 18,
                  fontWeight: isStatic ? 700 : 400,
                  color: isStatic ? "#93c5fd" : "white",
                  background: "transparent",
                  borderTop: "none", borderLeft: "none",
                  borderRight: c % 3 === 2 && c !== 8 ? "2px solid #3b82f6" : "1px solid rgba(59,130,246,0.2)",
                  borderBottom: r % 3 === 2 && r !== 8 ? "2px solid #3b82f6" : "1px solid rgba(59,130,246,0.2)",
                  outline: "none", cursor: isStatic ? "default" : "text"
                }}
              />
            );
          })
        ))}
      </div>
    </div>
  );
}
