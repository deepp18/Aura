import { useState, useEffect } from "react";
import { combine } from "../utils/combine";

export default function Canvas({ elements, setElements, genre }) {
  const [placed, setPlaced] = useState([]);
  const [discovered, setDiscovered] = useState(null);

  // 🔥 Clear the board when genre changes
  useEffect(() => {
    setPlaced([]);
    setDiscovered(null);
  }, [genre]);

  function handleDrop(e) {
    e.preventDefault();
    const sourceIndex = e.dataTransfer.getData("sourceIndex");
    const name = e.dataTransfer.getData("text/plain");

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log("DROP:", name, x, y);

    // 🔥 prevent dropping on same spot repeatedly
    const existsNearby = placed.find((item) => {
      const dx = item.x - x;
      const dy = item.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 30;
    });

    if (existsNearby) return;

    // 🔥 if dragging from canvas → remove old position
if (sourceIndex !== "") {
  setPlaced((prev) =>
    prev.filter((_, i) => i !== Number(sourceIndex))
  );
}

//collision detection
    let collided = null;
let minDistance = Infinity;

placed.forEach((item) => {
  const dx = item.x - x;
  const dy = item.y - y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 120 && distance < minDistance) {
    minDistance = distance;
    collided = item;
  }
});

    if (collided) {
      console.log("COLLISION WITH:", collided.name);

      const result = combine(collided.name, name, genre);
      console.log("COMBINE RESULT:", result);

      if (result) {
        // 🔥 remove collided element
        setPlaced((prev) =>
          prev.filter(
            (item) =>
              !(item.x === collided.x && item.y === collided.y)
          )
        );

        // 🔥 add new element to sidebar + popup
        if (!elements.includes(result)) {
          setElements((prev) => [...prev, result]);
          setDiscovered(result);

          setTimeout(() => {
            setDiscovered(null);
          }, 2000);
        }

        // 🔥 place result at drop location (with slight delay for effect)
        setTimeout(() => {
          setPlaced((prev) => [
            ...prev,
            { name: result, x, y }
          ]);
        }, 150);

        return;
      }
    }

    // 🔹 normal placement (no collision)
    setPlaced((prev) => [...prev, { name, x, y }]);
  }

  return (
    <>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes floatUp {
          0% { transform: translate(-50%, 0); opacity: 0; }
          10% { transform: translate(-50%, 20px); opacity: 1; }
          90% { transform: translate(-50%, 20px); opacity: 1; }
          100% { transform: translate(-50%, 0); opacity: 0; }
        }
        .canvas-container {
          flex: 1;
          position: relative;
          background-color: var(--bg-primary);
          background-image: radial-gradient(var(--bg-dots) 1.5px, transparent 1.5px);
          background-size: 24px 24px;
          overflow: hidden;
          transition: background-color var(--transition-speed) ease;
        }
        .craft-item {
          position: absolute;
          background: var(--item-bg);
          border: 1px solid var(--item-border);
          padding: 8px 14px;
          border-radius: 8px;
          cursor: grab;
          user-select: none;
          box-shadow: var(--item-shadow-soft);
          font-family: var(--font-family);
          font-size: 16px;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.1s ease, box-shadow 0.2s ease, background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform-origin: center center;
        }
        .craft-item:active {
          cursor: grabbing;
          transform: scale(1.05);
          box-shadow: var(--item-shadow-active);
          z-index: 9999 !important;
        }
        .craft-item:hover .delete-btn {
          opacity: 1 !important;
          pointer-events: auto;
        }
        .delete-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ff4757;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 14px;
          line-height: 1;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.1s ease;
          border: 1px solid #ff4757;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 10;
        }
        .delete-btn:hover {
          transform: scale(1.15);
        }
        .discovery-popup {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, 0);
          background: linear-gradient(135deg, #1e90ff, #00bfff);
          color: white;
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-family: var(--font-family);
          font-size: 18px;
          z-index: 10000;
          box-shadow: 0 10px 25px rgba(0, 191, 255, 0.4);
          animation: floatUp 2.5s ease-in-out forwards;
          pointer-events: none;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
      `}</style>
      <div
        className="canvas-container"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* 🔥 DISCOVERY POPUP */}
        {discovered && (
          <div className="discovery-popup">
            ✨ You discovered {discovered}!
          </div>
        )}

        {/* 🔹 placed elements */}
        {placed.map((item, index) => (
          <div
            key={index}
            draggable
            className="craft-item"
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", item.name);
              e.dataTransfer.setData("sourceIndex", index);
            }}
            style={{
              left: item.x,
              top: item.y,
              zIndex: index
            }}
          >
            {/* ❌ delete button */}
            <span
              onClick={(e) => {
                 e.stopPropagation();
                 setPlaced((prev) => prev.filter((_, i) => i !== index));
              }}
              className="delete-btn"
            >
              ×
            </span>
            {item.name}
          </div>
        ))}
      </div>
    </>
  );
}