import Draggable from "react-draggable";
import { useRef } from "react";

export default function ElementCard({ name, onDrop }) {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: 100, y: 100 }}
      onStop={(e, data) => {
        onDrop(name, data);
      }}
    >
      <div
        ref={nodeRef}
        style={{
          position: "absolute",
          background: "var(--item-bg)",
          border: "1px solid var(--item-border)",
          padding: "8px 14px",
          borderRadius: "8px",
          cursor: "grab",
          userSelect: "none",
          boxShadow: "var(--item-shadow-soft)",
          fontFamily: "var(--font-family)",
          fontSize: "16px",
          color: "var(--text-main)",
          transition: "box-shadow 0.2s ease, transform 0.1s ease, background 0.25s ease, border-color 0.25s ease, color 0.25s ease"
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.cursor = "grabbing";
          e.currentTarget.style.boxShadow = "var(--item-shadow-active)";
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.zIndex = 9999;
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.cursor = "grab";
          e.currentTarget.style.boxShadow = "var(--item-shadow-soft)";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.zIndex = "auto";
        }}
      >
        {name}
      </div>
    </Draggable>
  );
}