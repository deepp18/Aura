import React, { useState, useRef, useEffect } from "react";

export default function DrawCircle() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [score, setScore] = useState(null);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e) => {
    setPoints([getPos(e)]);
    setIsDrawing(true);
    setScore(null);
  };

  const move = (e) => {
    if (!isDrawing) return;
    setPoints((p) => [...p, getPos(e)]);
  };

  const calculateScore = () => {
    if (points.length < 10) return 0;
    
    // Check loop closure distance
    const startPt = points[0];
    const endPt = points[points.length - 1];
    const closureGap = Math.hypot(endPt.x - startPt.x, endPt.y - startPt.y);
    if (closureGap > 100) return "Not Closed";

    let sumX = 0, sumY = 0;
    points.forEach(p => { sumX += p.x; sumY += p.y; });
    const cx = sumX / points.length;
    const cy = sumY / points.length;

    let radiiSum = 0;
    const radii = points.map(p => {
      const r = Math.hypot(p.x - cx, p.y - cy);
      radiiSum += r;
      return r;
    });

    const avgRadius = radiiSum / radii.length;
    let variance = 0;
    radii.forEach(r => { variance += Math.abs(r - avgRadius); });
    
    const avgDeviation = variance / radii.length;
    const percentage = Math.max(0, 100 - ((avgDeviation / avgRadius) * 100 * 2.5));

    return percentage.toFixed(1) + "%";
  };

  const stop = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setScore(calculateScore());
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 500, 400);
    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }, [points]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ color: "#a78bfa", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {score === null ? "Draw a single continuous circle" : score === "Not Closed" ? "Make sure to connect the ends!" : `Perfection: ${score}`}
      </p>
      
      {score && score !== "Not Closed" && (
        <h1 style={{ color: "white", fontSize: 48, margin: "10px 0", fontFamily: "'DM Serif Display',serif" }}>{score}</h1>
      )}

      <div style={{ position: "relative", marginTop: 10, borderRadius: 16, border: "2px dashed rgba(167,139,250,.3)", overflow: "hidden", background: "rgba(10,10,30,.4)" }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
          style={{ touchAction: "none", cursor: "crosshair" }}
        />
        {points.length === 0 && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "rgba(167,139,250,.2)", pointerEvents: "none" }}>
            <span style={{ fontSize: 40 }}>⭕</span>
          </div>
        )}
      </div>
      <button onClick={() => { setPoints([]); setScore(null); }} style={{ marginTop: 20, padding: "8px 20px", borderRadius: 99, background: "rgba(167,139,250,.15)", color: "#a78bfa", border: "1px solid #a78bfa", cursor: "pointer" }}>Retry</button>
    </div>
  );
}
