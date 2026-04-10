import React, { useState, useEffect, useRef } from "react";

const SHOP_ITEMS = [
  { id: "sps", icon: "⏱️", name: "SPS Counter", cost: 25, type: "ui", desc: "See your stimulation per second." },
  { id: "dvd", icon: "💿", name: "DVD Bounce Sound", cost: 75, type: "active", desc: "+5 stimulation per wall bounce." },
  { id: "news", icon: "📢", name: "Breaking News", cost: 100, type: "passive", sps: 4, desc: "Stay up to date with the latest news. +4 stimulation/sec." },
  { id: "subway", icon: "🏃", name: "Gameplay Video", cost: 250, type: "passive", sps: 15, desc: "A guy running on trains underneath. +15 stimulation/sec." },
  { id: "cat", icon: "🐈", name: "Pop Cat", cost: 500, type: "passive", sps: 35, desc: "Pops its mouth rhythmically. +35 stimulation/sec." },
  { id: "asmr", icon: "🎧", name: "ASMR Audio", cost: 1200, type: "passive", sps: 80, desc: "Crunchy microphone tapping. +80 stimulation/sec." },
  { id: "slime", icon: "🧪", name: "Slime Mixing", cost: 3000, type: "passive", sps: 200, desc: "Crunchy kinetic sand and slime. +200 stimulation/sec." },
  { id: "soap", icon: "🔪", name: "Soap Cutting", cost: 8000, type: "passive", sps: 600, desc: "Slicing through grid soap blocks. +600 stimulation/sec." },
  { id: "factory", icon: "🏭", name: "Dopamine Factory", cost: 25000, type: "passive", sps: 2500, desc: "Industrial scale stimulation production. +2,500/sec." }
];

const COLORS = ["#ff3b30", "#34c759", "#007aff", "#ff9500", "#af52de", "#ffcc00"];

export default function StimulationClicker() {
  const [count, setCount] = useState(0);
  const [unlocked, setUnlocked] = useState([]);
  
  const [cps, setCps] = useState(0); 
  const clickTimes = useRef([]);

  const [dvd, setDvd] = useState({ x: 100, y: 100, vx: 2.5, vy: 2, col: COLORS[0] });
  const requestRef = useRef(null);

  const [floats, setFloats] = useState([]);
  const [particles, setParticles] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  const passiveSPS = SHOP_ITEMS.reduce((sum, item) => {
    return unlocked.includes(item.id) && item.type === "passive" ? sum + item.sps : sum;
  }, 0);

  // Passive Accumulator loop (Every 100ms)
  useEffect(() => {
    if (passiveSPS === 0) return;
    const interval = setInterval(() => {
      setCount(prev => prev + (passiveSPS / 10)); // Divide by 10 for 100ms tick
    }, 100);
    return () => clearInterval(interval);
  }, [passiveSPS]);

  // Click Speed Tracker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      clickTimes.current = clickTimes.current.filter(t => now - t < 1000);
      setCps(clickTimes.current.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const playThudSound普及 = (baseFreq) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!window.audioCtxThud) window.audioCtxThud = new AudioContext();
      if (window.audioCtxThud.state === 'suspended') window.audioCtxThud.resume();
      
      const osc = window.audioCtxThud.createOscillator();
      const gain = window.audioCtxThud.createGain();
      
      osc.type = "square";
      osc.frequency.setValueAtTime(baseFreq, window.audioCtxThud.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(40, window.audioCtxThud.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.3, window.audioCtxThud.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, window.audioCtxThud.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(window.audioCtxThud.destination);
      osc.start();
      osc.stop(window.audioCtxThud.currentTime + 0.1);
    } catch(e) {}
  };

  const triggerHaptics = (val = 20) => {
    if (navigator.vibrate) navigator.vibrate(val);
  };

  // DVD Physics
  const updateDVD = () => {
    setDvd(prev => {
      let bX = prev.x + prev.vx;
      let bY = prev.y + prev.vy;
      let bVx = prev.vx;
      let bVy = prev.vy;
      let bCol = prev.col;

      let bounced = false;
      if (bX <= 0 || bX >= 520) { bVx *= -1; bX = bX <= 0 ? 0 : 520; bounced = true; } // 600 box width - 80 dvd width = 520
      if (bY <= 0 || bY >= 360) { bVy *= -1; bY = bY <= 0 ? 0 : 360; bounced = true; } // 400 box height - 40 dvd height = 360

      if (bounced) {
        setCount(c => c + 5);
        bCol = COLORS[Math.floor(Math.random() * COLORS.length)];
        playThudSound普及(600);
        triggerHaptics(30);
      }

      return { x: bX, y: bY, vx: bVx, vy: bVy, col: bCol };
    });
    requestRef.current = requestAnimationFrame(updateDVD);
  };

  useEffect(() => {
    if (unlocked.includes("dvd")) {
      requestRef.current = requestAnimationFrame(updateDVD);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [unlocked]);

  const handleClick = (e) => {
    setCount(prev => prev + 1);
    clickTimes.current.push(Date.now());
    playThudSound普及(150 + cps * 10);
    triggerHaptics(20);

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const emojis = ['✨', '💥', '🎇', '🎉', '🌟'];
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x, y,
      vx: (Math.random() - 0.5) * 120,
      vy: (Math.random() - 0.5) * 120 - 20, 
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      rot: Math.random() * 360
    }));

    setParticles(p => [...p, ...newParticles]);
    setTimeout(() => {
      setParticles(p => p.filter(pt => !newParticles.find(n => n.id === pt.id)));
    }, 800);

    const floatId = Date.now() + Math.random();
    setFloats(f => [...f, { id: floatId, x: e.clientX, y: e.clientY }]);
    setTimeout(() => { setFloats(f => f.filter(fl => fl.id !== floatId)); }, 1000);
  };

  const buy = (item) => {
    if (count >= item.cost && !unlocked.includes(item.id)) {
      setCount(prev => prev - item.cost);
      setUnlocked(prev => [...prev, item.id]);
      playThudSound普及(800);
      triggerHaptics(50);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: 450, position: "relative", overflow: "hidden" }}>
      
      {/* ─── VISUAL CHAOS LAYER ─── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        
        {/* DVD Physics */}
        {unlocked.includes("dvd") && (
          <div style={{
            position: "absolute", left: dvd.x, top: dvd.y, width: 80, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontStyle: "italic", fontSize: 28, color: dvd.col, 
            fontFamily: "sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.5)"
          }}>
            DVD
          </div>
        )}

        {/* 📢 Breaking News Marquee */}
        {unlocked.includes("news") && (
          <div style={{ position: "absolute", bottom: -22, left: -22, right: -22, height: 35, background: "#dc2626", color: "white", display: "flex", alignItems: "center", overflow: "hidden", fontWeight: "bold", borderTop: "2px solid #991b1b" }}>
            <div style={{ background: "white", color: "#dc2626", padding: "0 15px", height: "100%", display: "flex", alignItems: "center", zIndex: 2, flexShrink: 0 }}>BREAKING NEWS</div>
            <div style={{ animation: "au-marquee 15s linear infinite", whiteSpace: "nowrap", flexShrink: 0 }}>
              Experts warn: Do not stop clicking! • Local man reaches 1,000,000 stimulation! • Dopamine reserves at all time high! • Subways running late due to surfing! • Factory emissions critical •
            </div>
          </div>
        )}

        {/* 🏃 Subway Surfer Visual */}
        {unlocked.includes("subway") && (
          <div style={{ position: "absolute", right: 20, top: "20%", width: 90, height: 160, background: "#222", borderRadius: 16, overflow: "hidden", border: "2px solid #444", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{height: 25, width: "100%", background: "#444", color: "white", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold"}}>GAMEPLAY</div>
              <div style={{ fontSize: 50, animation: "au-bounce .3s infinite alternate", zIndex: 2 }}>🏃</div>
              <div style={{ position: "absolute", bottom: 40, fontSize: 35, animation: "au-slideDown .8s infinite linear" }}>🚆</div>
              <div style={{ position: "absolute", bottom: 40, fontSize: 35, animation: "au-slideDown .8s infinite linear", animationDelay: "0.4s" }}>🚆</div>
          </div>
        )}

        {/* 🐈 Pop Cat Visual */}
        {unlocked.includes("cat") && (
          <div style={{ position: "absolute", left: 30, top: "25%", fontSize: 80, animation: "au-popCat 0.3s infinite alternate" }}>
            🙀
          </div>
        )}

        {/* 🎧 ASMR Visual */}
        {unlocked.includes("asmr") && (
          <div style={{ position: "absolute", right: 40, top: "65%", fontSize: 60, animation: "au-wiggle 3s infinite" }}>
            🎙️
          </div>
        )}

        {/* 🧪 Slime Visual */}
        {unlocked.includes("slime") && (
          <div style={{ position: "absolute", left: 140, bottom: 60, width: 90, height: 90, background: "linear-gradient(135deg, #a855f7, #ec4899)", animation: "au-blob 4s infinite alternate", opacity: 0.8 }} />
        )}

        {/* 🔪 Soap Cutting Visual */}
        {unlocked.includes("soap") && (
          <div style={{ position: "absolute", left: 40, bottom: 80, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
              {Array.from({length: 9}).map((_, i) => (
                  <div key={i} style={{ width: 18, height: 18, background: "#6ee7b7", borderRadius: 3, animation: "au-slice 2s infinite", animationDelay: `${i * 0.15}s` }} />
              ))}
          </div>
        )}

        {/* 🏭 Dopamine Factory Visual */}
        {unlocked.includes("factory") && (
          <div style={{ position: "absolute", left: 30, top: -10, fontSize: 130, animation: "au-shake .2s infinite" }}>
            🏭
            <div style={{ position: "absolute", right: -30, top: -20, fontSize: 40, animation: "au-floatUpSmoke 2s infinite" }}>💨</div>
            <div style={{ position: "absolute", right: 0, top: -40, fontSize: 50, animation: "au-floatUpSmoke 2s infinite", animationDelay: ".5s" }}>💨</div>
          </div>
        )}
      </div>
      {/* ─── END VISUAL CHAOS LAYER ─── */}


      {/* Main UI */}
      <div style={{ textAlign: "center", marginBottom: 20, zIndex: 10 }}>
        <h1 style={{ fontSize: 56, color: "white", margin: 0, fontFamily: "'DM Serif Display',serif" }}>
          {Math.floor(count).toLocaleString()}
        </h1>
        {unlocked.includes("sps") && (
          <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: 16 }}>
            {passiveSPS > 0 ? `${passiveSPS.toLocaleString()} stimulation / second` : '0 stimulation / second'}
          </p>
        )}
      </div>

      {/* Main Clicker */}
      <div style={{ position: "relative", width: 140, height: 140, marginBottom: 40, zIndex: 10 }}>
        <button
          onClick={handleClick}
          style={{
            width: "100%", height: "100%",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e11d48, #9f1239)",
            boxShadow: `0 10px 40px rgba(225,29,72,0.4), inset 0 5px 15px rgba(255,255,255,0.2), 0 0 ${Math.min(cps*2, 40)}px #e11d48`,
            border: "none", cursor: "pointer", outline: "none",
            transition: "transform 0.05s ease"
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.92)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: 44, userSelect: "none" }}>👆</span>
        </button>

        {particles.map(p => (
          <div key={p.id} style={{
              position: "absolute", left: p.x, top: p.y, fontSize: 24, pointerEvents: "none",
              animation: "au-explode 0.8s cubic-bezier(0,1,0,1) forwards",
              "--vx": `${p.vx}px`, "--vy": `${p.vy}px`, "--r": `${p.rot}deg`
            }}>{p.emoji}</div>
        ))}
      </div>

      {/* The Shop */}
      <div style={{ position: "relative", width: "100%", zIndex: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {SHOP_ITEMS.map((item) => {
            const isOwned = unlocked.includes(item.id);
            const canAfford = count >= item.cost;
            return (
              <div 
                key={item.id} 
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ position: "relative" }}
              >
                <button
                  onClick={() => buy(item)}
                  disabled={isOwned || !canAfford}
                  style={{
                    width: 70, height: 70,
                    borderRadius: 14,
                    background: isOwned ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.08)",
                    border: `1px solid ${isOwned ? "rgba(255,255,255,0.05)" : canAfford ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                    color: "white", fontSize: 32,
                    cursor: isOwned ? "default" : canAfford ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: isOwned ? 0.3 : 1,
                    transition: "all 0.2s"
                  }}
                >
                  {item.icon}
                </button>
                
                {/* Tooltip Hover */}
                {hoveredItem?.id === item.id && (
                  <div style={{
                    position: "absolute", bottom: "100%", left: "50%", transform: "translate(-50%, -10px)",
                    background: "white", color: "black", padding: "12px 16px", borderRadius: 12,
                    width: 220, textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    pointerEvents: "none", zIndex: 50, animation: "au-fadeUp .2s"
                  }}>
                    <h4 style={{ margin: "0 0 6px", fontSize: 18, color: "#111" }}>{item.name}</h4>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>{item.desc}</p>
                    {isOwned ? (
                      <span style={{ color: "#34c759", fontWeight: 700, fontSize: 14 }}>Owned</span>
                    ) : (
                      <span style={{ color: canAfford ? "#34c759" : "#ff3b30", fontWeight: 700, fontSize: 14 }}>
                        Cost: {item.cost.toLocaleString()} stimulation
                      </span>
                    )}
                    <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid white" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {floats.map(f => (
        <div key={f.id} style={{
            position: "fixed", left: f.x - 10, top: f.y - 20, color: "white", fontSize: 28, fontWeight: 900,
            pointerEvents: "none", zIndex: 9999, textShadow: "0 2px 10px rgba(0,0,0,0.5)", animation: "au-floatUp 1s ease-out forwards"
          }}>+1</div>
      ))}

      <style>{`
        @keyframes au-explode { 0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; } 100% { transform: translate(var(--vx), var(--vy)) scale(0) rotate(var(--r)); opacity: 0; } }
        @keyframes au-floatUp { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-100px) scale(1.5); opacity: 0; } }
        
        @keyframes au-marquee { 0% { transform: translateX(600px); } 100% { transform: translateX(-1500px); } }
        @keyframes au-bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-20px); } }
        @keyframes au-slideDown { 0% { transform: translateY(-50px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(80px); opacity: 0; } }
        @keyframes au-popCat { 0% { transform: scale(1); } 100% { transform: scale(1.2); } }
        @keyframes au-wiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes au-blob { 
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; } 
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(1.1); } 
        }
        @keyframes au-slice { 
          0% { transform: translate(0,0) rotate(0deg); opacity: 1; } 
          100% { transform: translate(15px, 25px) rotate(45deg); opacity: 0; } 
        }
        @keyframes au-floatUpSmoke { 
          0% { transform: translateY(0) scale(1); opacity: 1; } 
          100% { transform: translateY(-60px) scale(1.5); opacity: 0; } 
        }
        @keyframes au-shake { 0% { transform: translateX(-2px); } 100% { transform: translateX(2px); } }
      `}</style>
    </div>
  );
}
