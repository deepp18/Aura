import React, { useState, useEffect } from "react";

const ART_DB = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/400px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/400px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/400px-1665_Girl_with_a_Pearl_Earring.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century_classic_canvas_print.jpg/400px-Tsunami_by_hokusai_19th_century_classic_canvas_print.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/400px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/400px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg/400px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.png/400px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Vincent_van_Gogh_-_Caf%C3%A9_Terrace_at_Night_%28Kroller-Muller%29.jpg/400px-Vincent_van_Gogh_-_Caf%C3%A9_Terrace_at_Night_%28Kroller-Muller%29.jpg"
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function Masterpieces() {
  const [phase, setPhase] = useState("memorize"); // "memorize" | "reconstruct" | "result" | "fail"
  const [sequence, setSequence] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);

  const startRound = () => {
    const randomArts = shuffleArray(ART_DB).slice(0, 5);
    setSequence(randomArts);
    setSelected([]);
    setPhase("memorize");
  };

  useEffect(() => {
    startRound();
  }, []);

  const handleContinue = () => {
    setShuffled(shuffleArray([...sequence]));
    setPhase("reconstruct");
  };

  const handleSelect = (imgUrl) => {
    if (selected.includes(imgUrl) || phase !== "reconstruct") return;
    
    const newSel = [...selected, imgUrl];
    setSelected(newSel);

    if (newSel.length === 5) {
      if (newSel.every((val, index) => val === sequence[index])) {
        setScore(s => s + 10);
        setPhase("result");
      } else {
        setScore(0);
        setPhase("fail");
      }
    }
  };

  const undo = () => {
    setSelected(prev => prev.slice(0, -1));
  };

  return (
    <div style={{ background: "#f8f9fa", padding: "40px", borderRadius: 16, color: "black", border: "1px solid #dee2e6", width: "100%", maxWidth: 800, margin: "0 auto", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
      
      {/* HUD Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #ccc", paddingBottom: 15, marginBottom: 30 }}>
        <h2 style={{ fontFamily: "'Cinzel', 'Times New Roman', serif", fontSize: 24, margin: 0, letterSpacing: 2 }}>MASTERPIECES<span style={{color: "#aaa"}}>■■■■</span></h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 100, height: 8, background: "#ccc", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: "#064e3b", width: `${Math.min(score, 100)}%`, transition: "width 0.3s" }}/>
          </div>
          <span style={{ fontWeight: "bold", fontFamily: "sans-serif" }}>"IQ" Score: {score}</span>
        </div>
      </div>

      {/* PHASE: MEMORIZE */}
      {phase === "memorize" && (
        <div style={{ animation: "au-fadeUp .4s" }}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 30 }}>
            {sequence.map((url, i) => (
              <img key={i} src={url} alt="Masterpiece" style={{ width: 130, height: 130, objectFit: "cover", border: "4px solid #111", boxShadow: "2px 4px 10px rgba(0,0,0,0.3)" }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <h3 style={{ margin: 0, fontSize: 22, fontFamily: "sans-serif" }}>Memorize the image order.</h3>
            <button 
              onClick={handleContinue}
              style={{ padding: "8px 24px", fontSize: 16, fontWeight: "bold", background: "#f0f0f0", border: "1px solid #777", cursor: "pointer", borderRadius: 2 }}
              onMouseOver={e => e.target.style.background = "#e0e0e0"}
              onMouseOut={e => e.target.style.background = "#f0f0f0"}
            >
              Continue
            </button>
          </div>
          <p style={{ color: "#666", marginTop: 20, fontSize: 16, fontFamily: "sans-serif" }}>After you memorized the order of images, you need to rebuild them in the next screen.</p>
        </div>
      )}

      {/* PHASE: RECONSTRUCT */}
      {phase === "reconstruct" && (
        <div style={{ animation: "au-fadeUp .4s" }}>
          
          {/* Target Slots */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 130, height: 130, border: "2px dashed #aaa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {selected[i] ? (
                  <img src={selected[i]} alt="Selected" style={{ width: "100%", height: "100%", objectFit: "cover", border: "2px solid #111" }} />
                ) : (
                  <span style={{ color: "#aaa", fontSize: 24 }}>?</span>
                )}
              </div>
            ))}
          </div>

          {/* Undo Button */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
            <button onClick={undo} disabled={selected.length === 0} style={{ padding: "6px 16px", cursor: selected.length ? "pointer" : "not-allowed", opacity: selected.length ? 1 : 0.5, background: "white", border: "1px solid #ccc" }}>
              ↶ Undo Last Pick
            </button>
          </div>

          <h3 style={{ textAlign: "center", marginTop: 0, fontFamily: "sans-serif" }}>Click the paintings in the exact original order:</h3>
          
          {/* Shuffled Bank */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {shuffled.map((url, i) => (
              <button 
                key={i} 
                onClick={() => handleSelect(url)}
                disabled={selected.includes(url)}
                style={{ padding: 0, border: "none", background: "none", cursor: selected.includes(url) ? "default" : "pointer", opacity: selected.includes(url) ? 0.2 : 1, transition: "transform 0.1s" }}
                onMouseDown={e => { if(!selected.includes(url)) e.currentTarget.style.transform = "scale(0.95)" }}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <img src={url} alt="Shuffled" style={{ width: 100, height: 100, objectFit: "cover", border: "3px solid #333", boxShadow: "2px 4px 6px rgba(0,0,0,0.2)" }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PHASE: RESULT / WIN */}
      {phase === "result" && (
        <div style={{ textAlign: "center", animation: "au-scaleIn .4s" }}>
          <h2 style={{ color: "#064e3b", fontSize: 32, fontFamily: "sans-serif" }}>Perfect Memory! +10 IQ</h2>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0" }}>
            {sequence.map((url, i) => (
              <img key={i} src={url} alt="Correct" style={{ width: 90, height: 90, objectFit: "cover", border: "2px solid #064e3b", borderRadius: 8 }} />
            ))}
          </div>
          <button onClick={startRound} style={{ padding: "10px 30px", fontSize: 18, background: "#111", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Next Round →
          </button>
        </div>
      )}

      {/* PHASE: RESULT / FAIL */}
      {phase === "fail" && (
        <div style={{ textAlign: "center", animation: "au-scaleIn .4s" }}>
          <h2 style={{ color: "#b91c1c", fontSize: 32, fontFamily: "sans-serif" }}>Incorrect Order!</h2>
          <p style={{ color: "#555" }}>Your IQ score has been reset. The correct order was:</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0" }}>
            {sequence.map((url, i) => (
              <img key={i} src={url} alt="Correct" style={{ width: 90, height: 90, objectFit: "cover", border: "2px solid #b91c1c", opacity: 0.8 }} />
            ))}
          </div>
          <button onClick={startRound} style={{ padding: "10px 30px", fontSize: 18, background: "#111", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Try Again ↺
          </button>
        </div>
      )}

    </div>
  );
}
