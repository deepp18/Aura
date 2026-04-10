export default function Sidebar({ elements = [], theme, toggleTheme, genre, setGenre }) {
  return (
    <>
      <style>{`
        .sidebar-container {
          width: 320px;
          padding: 24px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          overflow-y: auto;
          box-shadow: 2px 0 12px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          z-index: 10;
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .sidebar-title {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 22px;
          font-weight: 700;
          color: var(--text-main);
          font-family: var(--font-family);
        }

        .genre-switch {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .genre-btn {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--item-bg);
          cursor: pointer;
          font-size: 13px;
          color: var(--text-main);
          transition: all 0.2s ease;
        }

        .genre-btn.active {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
        }

        .genre-btn:hover {
          transform: translateY(-1px);
        }

        .sidebar-elements {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-content: flex-start;
          flex-grow: 1;
        }

        .sidebar-item {
          background: var(--item-bg);
          border: 1px solid var(--item-border);
          padding: 8px 14px;
          border-radius: 8px;
          cursor: grab;
          user-select: none;
          box-shadow: var(--item-shadow-soft);
          font-family: var(--font-family);
          font-size: 15px;
          color: var(--text-main);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .sidebar-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--item-shadow-hover);
        }

        .theme-toggle-btn {
          margin-top: 24px;
          padding: 12px;
          border-radius: 12px;
          background: var(--item-bg);
          border: 1px solid var(--item-border);
          color: var(--text-main);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      <div className="sidebar-container">
        <h2 className="sidebar-title">
          Elements ({elements.length})
        </h2>

        {/* 🔥 GENRE SWITCH */}
        <div className="genre-switch">
          {["nature", "emotions", "student", "fun", "technology", "food"].map((g) => (
            <button
              key={g}
              className={`genre-btn ${genre === g ? "active" : ""}`}
              onClick={() => setGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* ELEMENTS */}
        <div className="sidebar-elements">
          {elements.map((el, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", el)
              }
              className="sidebar-item"
            >
              {el}
            </div>
          ))}
        </div>

        {/* THEME BUTTON */}
        {toggleTheme && (
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        )}
      </div>
    </>
  );
}