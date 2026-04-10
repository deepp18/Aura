import React, { useState, useEffect, useRef } from "react";
import DrawCircle from "./components/DrawCircle";
import BubbleWrap from "./components/BubbleWrap";
import StimulationClicker from "./components/StimulationClicker";
import MemoryLogos from "./components/MemoryLogos";
import ZenGarden from "./components/ZenGarden";
import MindfulSudoku from "./components/MindfulSudoku";
import WatercolorJourney from "./components/WatercolorJourney";
import Masterpieces from "./components/Masterpieces";
/* ═══════════════════════════════════════════════════════════════
   AURA — VILLAGES · MOOD THERAPY GAMES
   7 clinically-inspired interactive games mapped to emotional states
   4th Year Psychology Wellness Project
═══════════════════════════════════════════════════════════════ */

/* ── Mood taxonomy ── */
const MOODS = [
  { id: "all",     label: "All Games", emoji: "✦",  color: "#e2e8f0", desc: "Browse everything" },
  { id: "anxious", label: "Anxious",   emoji: "🌀",  color: "#6ee7b7", desc: "Calm your nervous system" },
  { id: "angry",   label: "Angry",     emoji: "🔥",  color: "#fca5a5", desc: "Release & redirect energy" },
  { id: "sad",     label: "Sad",       emoji: "🌧",  color: "#a78bfa", desc: "Gentle uplift & comfort" },
  { id: "tired",   label: "Tired",     emoji: "🌙",  color: "#fbbf24", desc: "Rest & restore gently" },
  { id: "numb",    label: "Numb",      emoji: "❄",  color: "#60a5fa", desc: "Reconnect with sensation" },
  { id: "happy",   label: "Happy",     emoji: "☀",  color: "#34d399", desc: "Amplify & express joy" },
];

/* ── 7 curated therapeutic games ── */
const GAMES = [
  { id:"breathe",   name:"Breathe Hold",   emoji:"🫧", tagline:"Regulate your nervous system",        desc:"Hold the orb. Match your breath to the pulse. 4-7-8 rhythm.",                     color:"#a78bfa", moods:["anxious","angry","tired"],   tag:"Calm",    science:"Parasympathetic activation · Vagus nerve · Reduces cortisol" },
  { id:"wordstorm", name:"Word Storm",      emoji:"💢", tagline:"Release what you're holding",         desc:"Smash emotion tiles before they fill the screen. Type your own.",                  color:"#f87171", moods:["angry","anxious","numb"],    tag:"Release", science:"Affect labeling · Cathartic release · Amygdala regulation" },
  { id:"balloon",   name:"Let It Float",    emoji:"🎈", tagline:"Let go of what weighs you down",      desc:"Write a worry. Watch it rise into the sky. Pop to release it.",                   color:"#a78bfa", moods:["sad","anxious","numb"],     tag:"Let Go",  science:"Externalization · Cognitive defusion · Rumination reduction" },
  { id:"spark",     name:"Spark Catcher",   emoji:"✨", tagline:"Collect tiny moments of light",       desc:"Catch falling sparks of joy before they disappear. Rebuild your energy.",         color:"#fbbf24", moods:["tired","sad","numb"],      tag:"Restore", science:"Behavioral activation · Micro-wins · Positive reinforcement" },
  { id:"flood",     name:"Color Flood",     emoji:"🌊", tagline:"Flood your world with feeling",       desc:"Flood a greyscale world with color in the fewest clicks possible.",                color:"#60a5fa", moods:["numb","sad","happy"],      tag:"Awaken",  science:"Sensory engagement · Present-moment focus · Mindfulness" },
  { id:"sort",      name:"Sort It Out",     emoji:"🧠", tagline:"Separate what you can and can't control", desc:"Sort falling worries: In your control vs. Not your control.",              color:"#34d399", moods:["anxious","sad","angry"],    tag:"ACT",     science:"ACT Therapy · Control vs. acceptance · Values clarity" },
  { id:"match",     name:"Feel & Match",    emoji:"🃏", tagline:"Recognize and name your feelings",    desc:"Match emotion pairs. Each card shows a feeling — find its twin.",                  color:"#34d399", moods:["happy","tired","numb"],    tag:"Focus",   science:"Emotion recognition · DBT skills · Emotional intelligence" },
  {
  id: "craft",
  name: "Mind Craft",
  emoji: "🧩",
  tagline: "Mix thoughts, discover patterns",
  desc: "Combine elements and emotions to create something new.",
  color: "#6366f1",
  moods: ["anxious", "sad", "numb", "happy"],
  tag: "Creative",
  science: "Cognitive flexibility · Pattern recognition · Dopamine reward loop"
},
  { id: "circle", name: "Perfect Circle", emoji: "⭕", tagline: "Find your center", desc: "Draw as perfect of a circle as you can. Focus on smooth, continuous motion.", color: "#a78bfa", moods: ["anxious", "tired"], tag: "Focus", science: "Sensorimotor alignment · Distracts racing thoughts" },
  { id: "bubble", name: "Bubble Wrap", emoji: "🫧", tagline: "Pop the stress away", desc: "A grid of glassy bubbles. Pop them to release nervous energy.", color: "#60a5fa", moods: ["anxious", "angry"], tag: "Fidget", science: "Tactile simulation · Anxiety reduction" },
  { id: "clicker", name: "Dopamine Button", emoji: "👆", tagline: "Endless visual stimulation", desc: "Click for an explosion of particles and shockwaves.", color: "#f43f5e", moods: ["numb", "angry", "tired"], tag: "Stimulate", science: "Positive reinforcement · Dopamine loop" },
  { id: "logos", name: "Memory Logos", emoji: "🍎", tagline: "How good is your memory?", desc: "Draw famous brand logos from memory, then reveal the real one overlayed.", color: "#fca5a5", moods: ["happy", "sad"], tag: "Fun", science: "Cognitive recall · Lighthearted distraction" },
  { id: "garden", name: "Zen Garden", emoji: "🌻", tagline: "Mindfully cultivate life", desc: "Plant seeds, water them, and calmly wait for them to grow.", color: "#34d399", moods: ["anxious", "tired", "sad"], tag: "Cozy", science: "Delayed gratification · Patience · Virtual pet therapy" },
  { id: "sudoku", name: "Mindful Sudoku", emoji: "🔢", tagline: "Enter the flow state", desc: "A clean, timer-free puzzle grid. No stress, just logic.", color: "#3b82f6", moods: ["anxious", "numb"], tag: "Logic", science: "Flow state · Prefrontal cortex engagement" },
  { id: "watercolor", name: "Watercolor Journey", emoji: "🖌️", tagline: "Return color to the world", desc: "Drag your cursor to paint vibrant watercolor blooms into the grey.", color: "#fbbf24", moods: ["numb", "sad"], tag: "Journey", science: "Art therapy · Somatic experiencing metaphor" },
  { id: "memory", name: "Masterpieces", emoji: "🖼️", tagline: "Memorize the art order", desc: "Rebuild the order of 5 classic paintings.", color: "#eab308", moods: ["numb", "tired", "sad"], tag: "Memory", science: "Working memory · Visual recall" }
];

/* ══════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════ */
export default function Villages() {
  const [mood, setMood] = useState("all");
  const [activeGame, setActiveGame] = useState(null);

  const filtered = mood === "all" ? GAMES : GAMES.filter(g => g.moods.includes(mood));
  const activeGameDef = GAMES.find(g => g.id === activeGame);

  return (
    <div style={S.root} className="au-village-page">
      <style>{`
        /* Gorgeous Glossy 3D Gradient Cartoon Pointer */
        .au-village-page, .au-village-page * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><defs><linearGradient id="au-cur-grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2338bdf8"/><stop offset="100%" stop-color="%23818cf8"/></linearGradient><filter id="au-cur-shadow"><feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/></filter></defs><path d="M6 4 L28 15 L18 18 L22 30 L16 32 L12 19 L5 24 Z" fill="url(%23au-cur-grad1)" stroke="%23FFFFFF" stroke-width="3.5" stroke-linejoin="round" filter="url(%23au-cur-shadow)"/></svg>') 6 4, auto !important;
        }

        /* Hover Interactive Elements get a Hot Pink Colorway! */
        .au-village-page button, .au-village-page button *, .au-village-page a, .au-village-page a *, .au-village-page .au-card {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><defs><linearGradient id="au-cur-grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f43f5e"/><stop offset="100%" stop-color="%23f97316"/></linearGradient><filter id="au-cur-shadow"><feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/></filter></defs><path d="M6 4 L28 15 L18 18 L22 30 L16 32 L12 19 L5 24 Z" fill="url(%23au-cur-grad2)" stroke="%23FFFFFF" stroke-width="3.5" stroke-linejoin="round" filter="url(%23au-cur-shadow)"/></svg>') 6 4, pointer !important;
        }
      `}</style>
      <style>{GLOBAL_CSS}</style>
      {/* ── HEADER ── */}
      <div style={S.header}>
        <div style={{ animation: "au-fadeUp .5s ease" }}>
          <p style={S.eyebrow}>AURA · Wellness Games</p>
          <h1 style={S.title}>Villages</h1>
          <p style={S.subtitle}>
            {activeGameDef ? activeGameDef.tagline : "Therapy-inspired games curated for your emotional state"}
          </p>
        </div>
        {activeGame && (
          <button className="au-back" onClick={() => setActiveGame(null)}>← Back to games</button>
        )}
      </div>

      {/* ── MOOD FILTER ── */}
      {!activeGame && (
        <div style={{ marginBottom: 28, animation: "au-fadeUp .5s .08s ease both" }}>
          <p style={S.sectionLabel}>How are you feeling right now?</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MOODS.map((m, i) => (
              <button
                key={m.id}
                className="au-chip"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  background: mood === m.id ? `${m.color}22` : "rgba(255,255,255,.04)",
                  borderColor: mood === m.id ? m.color : "rgba(255,255,255,.1)",
                  color: mood === m.id ? m.color : "#94a3b8",
                  boxShadow: mood === m.id ? `0 0 18px ${m.color}22` : "none",
                }}
                onClick={() => setMood(m.id)}
              >
                <span style={{ fontSize: 14 }}>{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>
          {mood !== "all" && (
            <div style={S.moodBanner}>
              <span style={{ fontSize: 22 }}>{MOODS.find(m => m.id === mood)?.emoji}</span>
              <div>
                <p style={{ color: MOODS.find(m => m.id === mood)?.color, fontWeight: 600, fontSize: 14, margin: 0 }}>
                  {MOODS.find(m => m.id === mood)?.desc}
                </p>
                <p style={{ color: "#475569", fontSize: 12, margin: "2px 0 0" }}>
                  {filtered.length} game{filtered.length !== 1 ? "s" : ""} recommended for you
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── GAME GRID / ACTIVE GAME ── */}
      {!activeGame ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              style={{
                position: "relative",
                height: 130,
                borderRadius: 12,
                overflow: "hidden",
                border: g.id === "craft" ? "2px solid #ccc" : `2px solid ${g.color}44`,
                background: g.id === "clicker" ? "#e11d48" : 
                            g.id === "circle" ? "#000" :
                            g.id === "craft" ? "#f8fafc" :
                            g.id === "sudoku" ? "#eff6ff" :
                            g.id === "garden" ? "#422006" :
                            g.id === "wordstorm" ? "#450a0a" :
                            g.id === "memory" ? "#fef08a" :
                            `linear-gradient(135deg, ${g.color}22, ${g.color}11)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                animation: `au-fadeUp .5s ease both ${i * 0.05}s`,
                transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {/* Giant abstract faded emoji background graphic */}
              <div style={{ position: "absolute", right: -15, bottom: -30, fontSize: 130, opacity: g.id === "craft" ? 0.05 : 0.2, transform: "rotate(-15deg)", pointerEvents: "none" }}>
                {g.emoji}
              </div>
              
              {/* Graphic Text Treatment */}
              <h3 style={{ 
                fontFamily: g.id === "circle" ? "'Comic Sans MS', cursive" : 
                            g.id === "clicker" ? "'Impact', sans-serif" :
                            g.id === "garden" ? "monospace" :
                            g.id === "craft" ? "'Arial', sans-serif" :
                            "'DM Serif Display', serif", 
                fontSize: g.id === "clicker" ? 32 : 30, 
                color: g.id === "clicker" ? "white" : 
                       g.id === "craft" ? "black" : 
                       g.color, 
                zIndex: 2, 
                textShadow: g.id === "craft" ? "none" : "0 2px 10px rgba(0,0,0,0.5)",
                margin: 0,
                letterSpacing: g.id === "clicker" ? "1px" : "normal",
                textTransform: g.id === "clicker" ? "uppercase" : "none"
              }}>
                {g.name}
              </h3>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ animation: "au-scaleIn .3s ease" }}>
          {activeGame === "breathe"   && <BreatheHold />}
          {activeGame === "wordstorm" && <WordStorm />}
          {activeGame === "balloon"   && <LetItFloat />}
          {activeGame === "spark"     && <SparkCatcher />}
          {activeGame === "flood"     && <ColorFlood />}
          {activeGame === "sort"      && <SortItOut />}
          {activeGame === "match"     && <FeelAndMatch />}
          {activeGame === "circle"    && <Shell title="Perfect Circle" emoji="⭕" color="#a78bfa" science="Sensorimotor alignment"><DrawCircle /></Shell>}
          {activeGame === "bubble"    && <Shell title="Bubble Wrap" emoji="🫧" color="#60a5fa" science="Tactile simulation"><BubbleWrap /></Shell>}
          {activeGame === "clicker"   && <Shell title="Dopamine Button" emoji="👆" color="#f43f5e" science="Positive reinforcement"><StimulationClicker /></Shell>}
          {activeGame === "logos"     && <Shell title="Memory Logos" emoji="🍎" color="#fca5a5" science="Cognitive recall"><MemoryLogos /></Shell>}
          {activeGame === "garden"    && <Shell title="Zen Garden" emoji="🌻" color="#34d399" science="Delayed gratification"><ZenGarden /></Shell>}
          {activeGame === "sudoku"    && <Shell title="Mindful Sudoku" emoji="🔢" color="#3b82f6" science="Flow state"><MindfulSudoku /></Shell>}
          {activeGame === "watercolor"&& <Shell title="Watercolor Journey" emoji="🖌️" color="#fbbf24" science="Art therapy"><WatercolorJourney /></Shell>}
          {activeGame === "memory"    && <Masterpieces />}
          {activeGame === "craft"     && <MindCraftWrapper mood={mood} />}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED SHELL + INSIGHT
══════════════════════════════════════════════════════════════ */
function Shell({ title, emoji, color, science, children }) {
  return (
    <div>
      <div style={{ background: `${color}10`, border: `1px solid ${color}22`, borderRadius: 18, padding: "18px 22px", marginBottom: 22 }}>
        <h2 style={{ color: "white", fontFamily: "'DM Serif Display',serif", fontSize: 26, fontWeight: 400, margin: "0 0 4px" }}>
          <span style={{ marginRight: 10 }}>{emoji}</span>{title}
        </h2>
        <p style={{ color: "#475569", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>
          🧠 {science}
        </p>
      </div>
      {children}
    </div>
  );
}

function Insight({ color, bg, border, text }) {
  return (
    <p style={{ color, background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "11px 16px", fontSize: 12, marginTop: 18, lineHeight: 1.65 }}>
      {text}
    </p>
  );
}

function PillBtn({ onClick, style, children }) {
  return <button className="au-pill" onClick={onClick} style={style}>{children}</button>;
}

/* ══════════════════════════════════════════════════════════════
   GAME 1 — BREATHE HOLD (4-7-8)
══════════════════════════════════════════════════════════════ */
const BPHASES = [
  { name: "Inhale",  dur: 4, color: "#a78bfa", hint: "Breathe in slowly through your nose...",   cls: "inhale" },
  { name: "Hold",    dur: 7, color: "#fbbf24", hint: "Hold your breath gently...",                cls: "hold"   },
  { name: "Exhale",  dur: 8, color: "#60a5fa", hint: "Breathe out slowly through your mouth...", cls: "exhale" },
  { name: "Rest",    dur: 1, color: "#4a5568", hint: "Pause...",                                  cls: "rest"   },
];

function BreatheHold() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTick(tk => {
        const ph = BPHASES[phaseIdx];
        if (tk + 1 >= ph.dur) {
          const next = (phaseIdx + 1) % BPHASES.length;
          setPhaseIdx(next);
          if (next === 0) setCycles(c => c + 1);
          return 0;
        }
        return tk + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, phaseIdx]);

  const reset = () => { clearInterval(timerRef.current); setRunning(false); setPhaseIdx(0); setTick(0); setCycles(0); };
  const ph = BPHASES[phaseIdx];
  const barPct = (tick / ph.dur) * 100;

  const orbStyle = {
    width: 160, height: 160, borderRadius: "50%",
    background: `radial-gradient(circle at 35% 35%, ${ph.color}88, ${ph.color}22)`,
    border: `2px solid ${ph.color}`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    cursor: "pointer", userSelect: "none",
    boxShadow: running ? `0 0 60px ${ph.color}44, 0 0 120px ${ph.color}18` : "none",
    transition: "border-color .6s, box-shadow .6s",
    transform: running
      ? ph.cls === "inhale" ? "scale(1.5)" : ph.cls === "hold" ? "scale(1.5)" : "scale(0.7)"
      : "scale(0.85)",
    transitionDuration: ph.cls === "inhale" ? "4s" : ph.cls === "exhale" ? "8s" : "0.5s",
    transitionTimingFunction: "ease-in-out",
    transitionProperty: "transform, border-color, box-shadow",
  };

  return (
    <Shell title="Breathe Hold" emoji="🫧" color="#a78bfa" science="Parasympathetic activation · Vagus nerve · Reduces cortisol · 4-7-8 method">
      {/* Stats row */}
      <div style={{ display: "flex", gap: 36, justifyContent: "center", marginBottom: 22 }}>
        {[["Cycles", cycles, "#a78bfa"], ["Phase", ph.name, ph.color], ["Left", `${ph.dur - tick}s`, "#fbbf24"]].map(([k, v, c]) => (
          <div key={k} style={{ textAlign: "center" }}>
            <div style={{ color: c, fontSize: 24, fontFamily: "'DM Serif Display',serif" }}>{v}</div>
            <div style={{ color: "#475569", fontSize: 10, letterSpacing: "0.09em", textTransform: "uppercase", marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Orb */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 20px" }}>
        <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[2.6, 1.9, 1.4].map((m, i) => (
            <div key={i} style={{
              position: "absolute", width: 160 * m, height: 160 * m, borderRadius: "50%",
              border: `1px solid ${ph.color}${["12", "22", "38"][i]}`,
              transform: running ? (ph.cls === "inhale" || ph.cls === "hold" ? `scale(${1 - i * 0.1})` : `scale(${0.65 + i * 0.04})`) : "scale(0.6)",
              transition: `transform ${ph.cls === "inhale" ? "4s" : ph.cls === "exhale" ? "8s" : "0.5s"} ease-in-out`,
            }} />
          ))}
          <div style={orbStyle}>
            <span style={{ fontSize: 28 }}>🫧</span>
            <span style={{ color: "white", fontSize: 26, fontWeight: 700 }}>{ph.dur - tick}</span>
          </div>
        </div>

        <p style={{ color: ph.color, fontSize: 22, fontFamily: "'DM Serif Display',serif", margin: "0 0 5px" }}>{ph.name}</p>
        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 18px" }}>{ph.hint}</p>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,.07)", borderRadius: 99, width: 300, marginBottom: 22 }}>
          <div style={{ height: "100%", width: `${barPct}%`, background: ph.color, borderRadius: 99, transition: "width 1s linear" }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <PillBtn
            onClick={() => { setRunning(r => !r); if (running) clearInterval(timerRef.current); }}
            style={{ background: running ? "rgba(248,113,113,.15)" : `${ph.color}22`, border: `1.5px solid ${running ? "#f87171" : ph.color}`, color: running ? "#f87171" : ph.color }}
          >
            {running ? "⏸ Pause" : "▶ Begin Session"}
          </PillBtn>
          <PillBtn onClick={reset} style={{ background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.1)", color: "#64748b" }}>↺ Reset</PillBtn>
        </div>
      </div>

      <Insight color="#3b1f6e" bg="#a78bfa22" border="#a78bfa33"
        text="💡 Why it works: The 4-7-8 pattern reduces sympathetic stress response by extending exhalation, activating the vagus nerve and lowering cortisol within 2–3 cycles." />
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════
   GAME 2 — WORD STORM
══════════════════════════════════════════════════════════════ */
const EMOTION_WORDS = [
  { word: "ANXIETY",   col: "#f87171" }, { word: "ANGER",    col: "#fb923c" },
  { word: "WORRY",     col: "#fbbf24" }, { word: "SADNESS",  col: "#93c5fd" },
  { word: "DOUBT",     col: "#c4b5fd" }, { word: "FEAR",     col: "#f9a8d4" },
  { word: "GUILT",     col: "#6ee7b7" }, { word: "REGRET",   col: "#67e8f9" },
  { word: "SHAME",     col: "#a5b4fc" }, { word: "PANIC",    col: "#f87171" },
  { word: "HURT",      col: "#fb7185" }, { word: "RAGE",     col: "#ef4444" },
  { word: "DREAD",     col: "#fbbf24" }, { word: "LONELY",   col: "#60a5fa" },
  { word: "STRESS",    col: "#f472b6" },
];

function WordStorm() {
  const makeTiles = () => EMOTION_WORDS.map((l, i) => ({
    ...l, id: i,
    hits: 0, dead: false, shake: false,
    x: 5 + Math.random() * 70,
    y: 8 + Math.random() * 78,
  }));
  const [tiles, setTiles] = useState(makeTiles);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState("");
  const [customInput, setCustomInput] = useState("");
  const nextId = useRef(100);

  const smash = id => {
    setTiles(prev => {
      const next = prev.map(t => {
        if (t.id !== id || t.dead) return t;
        const h = t.hits + 1;
        if (h >= 2) {
          setScore(s => s + 1);
          setCombo(c => {
            const nc = c + 1;
            if (nc > 2) { setShowCombo(`🔥 ${nc}x COMBO!`); setTimeout(() => setShowCombo(""), 900); }
            return nc;
          });
          return { ...t, hits: h, dead: true };
        }
        return { ...t, hits: h, shake: true };
      });
      setTimeout(() => setTiles(p => p.map(t => t.id === id ? { ...t, shake: false } : t)), 350);
      return next;
    });
  };

  const addCustom = () => {
    const val = customInput.trim().toUpperCase();
    if (!val) return;
    const cols = ["#f87171", "#fb923c", "#fbbf24", "#60a5fa", "#a78bfa", "#34d399"];
    const col = cols[Math.floor(Math.random() * cols.length)];
    setTiles(p => [...p, { word: val, col, id: nextId.current++, hits: 0, dead: false, shake: false, x: 20 + Math.random() * 55, y: 20 + Math.random() * 55 }]);
    setCustomInput(""); setCombo(0);
  };

  const reset = () => { setTiles(makeTiles()); setScore(0); setCombo(0); setShowCombo(""); };

  const alive = tiles.filter(t => !t.dead);
  const allDone = alive.length === 0;

  return (
    <Shell title="Word Storm" emoji="💢" color="#f87171" science="Affect labeling · Cathartic release · Amygdala regulation (fMRI verified)">
      {allDone ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 60, marginBottom: 14 }}>🎉</div>
          <h3 style={{ color: "#6ee7b7", fontFamily: "'DM Serif Display',serif", fontSize: 28, margin: "0 0 8px" }}>Every weight released.</h3>
          <p style={{ color: "#64748b", fontSize: 15, marginBottom: 24, lineHeight: 1.65 }}>You smashed {score} emotions. That takes real courage. 💪</p>
          <PillBtn onClick={reset} style={{ background: "rgba(110,231,183,.15)", border: "1.5px solid #6ee7b7", color: "#6ee7b7" }}>Begin Again</PillBtn>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ color: "#fca5a5", fontFamily: "'DM Serif Display',serif", fontSize: 20 }}>
              {score} <span style={{ color: "#475569", fontSize: 13 }}>smashed</span>
            </span>
            {showCombo && <span style={{ color: "#f87171", fontSize: 13, fontWeight: 700, animation: "au-fadeUp .2s ease" }}>{showCombo}</span>}
            <PillBtn onClick={reset} style={{ background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.1)", color: "#64748b", fontSize: 13 }}>↺ Reset</PillBtn>
          </div>

          {/* Arena */}
          <div style={{ position: "relative", width: "100%", height: 320, background: "#030716", borderRadius: 16, border: "1px solid rgba(248,113,113,0.15)", overflow: "hidden", marginBottom: 12 }}>
            <div style={{ position: "absolute", top: 12, right: 14, color: "#fca5a5", fontSize: 22, fontFamily: "'DM Serif Display',serif", fontWeight: 700 }}>{score}</div>
            {tiles.map(t => (
              <button
                key={t.id}
                onClick={() => smash(t.id)}
                disabled={t.dead}
                style={{
                  position: "absolute",
                  left: `${t.x}%`, top: `${t.y}%`,
                  minWidth: 72, padding: "8px 14px", borderRadius: 10,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                  background: t.dead ? "rgba(255,255,255,.02)" : `${t.col}18`,
                  border: t.dead ? "1.5px dashed rgba(255,255,255,.06)" : `1.5px solid ${t.col}55`,
                  color: t.dead ? "rgba(255,255,255,.1)" : t.col,
                  cursor: t.dead ? "default" : "pointer",
                  animation: t.shake ? "au-shake .32s ease" : "none",
                  transition: "all .25s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1,
                }}
              >
                {t.dead ? <span style={{ fontSize: 18 }}>💨</span> : (
                  <>
                    {t.word}
                    {t.hits > 0 && <span style={{ position: "absolute", top: 3, right: 5, fontSize: 11 }}>💢</span>}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Add custom word */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustom()}
              placeholder="Type your own emotion & press Enter..."
              maxLength={18}
              style={{ flex: 1, padding: "10px 14px", borderRadius: 12, background: "rgba(248,113,113,.08)", border: "1.5px solid rgba(248,113,113,.25)", color: "#e2e8f0", fontSize: 13, outline: "none" }}
            />
            <PillBtn onClick={addCustom} style={{ background: "rgba(248,113,113,.15)", border: "1.5px solid #f87171", color: "#f87171" }}>Add</PillBtn>
          </div>
        </>
      )}
      <Insight color="#7f1d1d" bg="#fca5a522" border="#fca5a533"
        text="💡 Why it works: Naming emotions ('affect labeling') reduces their intensity by engaging the prefrontal cortex and dampening the amygdala's stress response. Smashing = cathartic release." />
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════
   GAME 3 — LET IT FLOAT (Balloon Release)
══════════════════════════════════════════════════════════════ */
const BALLOON_COLORS = ["#a78bfa", "#f9a8d4", "#60a5fa", "#6ee7b7", "#fbbf24", "#f87171", "#67e8f9"];

function LetItFloat() {
  const [balloons, setBalloons] = useState([]);
  const [input, setInput] = useState("");
  const [released, setReleased] = useState(0);
  const countRef = useRef(0);

  const launch = () => {
    const val = input.trim();
    if (!val) return;
    const col = BALLOON_COLORS[countRef.current % BALLOON_COLORS.length];
    const id = Date.now();
    const dur = 12 + Math.random() * 8;
    const left = 10 + Math.random() * 75;
    setBalloons(p => [...p, { id, text: val.length > 18 ? val.slice(0, 18) + "…" : val, col, dur, left }]);
    setInput("");
    countRef.current++;
    // Auto-remove after animation
    setTimeout(() => setBalloons(p => p.filter(b => b.id !== id)), (dur + 1) * 1000);
  };

  const pop = id => {
    setBalloons(p => p.map(b => b.id === id ? { ...b, popped: true } : b));
    setReleased(r => r + 1);
    setTimeout(() => setBalloons(p => p.filter(b => b.id !== id)), 400);
  };

  const clearAll = () => { setBalloons([]); setReleased(0); countRef.current = 0; };

  // Generate static stars once
  const stars = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      left: `${(i * 1987 + 37) % 97}%`,
      top: `${(i * 1123 + 11) % 95}%`,
      size: (i % 3) + 1,
      opacity: 0.15 + (i % 7) * 0.08,
      animDur: 1.2 + (i % 5) * 0.4,
      animDel: (i % 10) * 0.2,
    }))
  ).current;

  return (
    <Shell title="Let It Float" emoji="🎈" color="#a78bfa" science="Externalization · Cognitive defusion · Symbolic letting go reduces rumination">
      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && launch()}
          placeholder="Write a worry or burden to release..."
          maxLength={30}
          style={{ flex: 1, padding: "11px 15px", borderRadius: 12, background: "rgba(167,139,250,.08)", border: "1.5px solid rgba(167,139,250,.25)", color: "#e2e8f0", fontSize: 13, outline: "none" }}
        />
        <PillBtn onClick={launch} style={{ background: "rgba(167,139,250,.2)", border: "1.5px solid #a78bfa", color: "#a78bfa" }}>🎈 Release</PillBtn>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: released > 0 ? "#a78bfa" : "#5c3a9a" }}>
          {released > 0 ? `✦ ${released} released — you let it go` : "Pop a balloon to release the feeling"}
        </span>
        {balloons.length > 0 && (
          <PillBtn onClick={clearAll} style={{ background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.1)", color: "#64748b", fontSize: 12, padding: "6px 14px" }}>Clear sky</PillBtn>
        )}
      </div>

      {/* Sky */}
      <div style={{ position: "relative", width: "100%", height: 340, borderRadius: 16, overflow: "hidden", background: "linear-gradient(180deg,#0a0a2e 0%,#1a0533 60%,#0d1a3a 100%)", border: "1px solid rgba(167,139,250,.1)" }}>
        {/* Stars */}
        {stars.map((s, i) => (
          <div key={i} style={{
            position: "absolute", left: s.left, top: s.top,
            width: s.size, height: s.size, borderRadius: "50%",
            background: `rgba(255,255,255,${s.opacity})`,
            animation: `au-shimmer ${s.animDur}s ease-in-out ${s.animDel}s infinite`,
          }} />
        ))}

        {/* Balloons */}
        {balloons.map(b => (
          <div
            key={b.id}
            onClick={() => !b.popped && pop(b.id)}
            style={{
              position: "absolute",
              left: `${b.left}%`,
              bottom: b.popped ? undefined : "-80px",
              display: "flex", flexDirection: "column", alignItems: "center",
              cursor: "pointer",
              animation: b.popped
                ? "au-balloonPop .35s ease forwards"
                : `au-rise ${b.dur}s linear forwards`,
              zIndex: 2,
            }}
          >
            <div style={{
              width: 50, height: 60,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: `${b.col}55`,
              border: `2px solid ${b.col}99`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, textAlign: "center", padding: 6, lineHeight: 1.3,
              color: b.col, transition: "transform .15s",
            }}>
              {b.text}
            </div>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,.3)" }} />
          </div>
        ))}

        {balloons.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 36, opacity: .25 }}>🎈</span>
            <p style={{ color: "rgba(255,255,255,.15)", fontSize: 13 }}>Your sky is waiting...</p>
          </div>
        )}
      </div>

      <Insight color="#4a1d96" bg="#a78bfa22" border="#a78bfa33"
        text="💡 Why it works: Externalization — writing a worry and symbolically releasing it — creates psychological distance and reduces rumination. The act of 'letting go' activates prefrontal regulation." />
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════
   GAME 4 — SPARK CATCHER
══════════════════════════════════════════════════════════════ */
const SPARK_WORDS = ["Joy", "Hope", "Peace", "Light", "Love", "Calm", "Strength", "Grace", "Warmth", "Spark", "Life", "Glow", "Rise", "Flow"];
const SPARK_COLORS = ["#fbbf24", "#f59e0b", "#fde68a", "#ef4444", "#f97316", "#34d399", "#60a5fa", "#a78bfa"];

function SparkCatcher() {
  const [sparks, setSparks] = useState([]);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [level, setLevel] = useState(1);
  const [energy, setEnergy] = useState(0);
  const [msg, setMsg] = useState("Click sparks before they vanish ✦");
  const [running, setRunning] = useState(false);
  const spawnerRef = useRef(null);
  const nextId = useRef(0);
  const caughtRef = useRef(0);
  const levelRef = useRef(1);

  const startGame = () => {
    setRunning(true);
    setSparks([]); setCaught(0); setMissed(0); setLevel(1); setEnergy(0);
    caughtRef.current = 0; levelRef.current = 1;
    setMsg("Catch the sparks! ✦");
  };

  useEffect(() => {
    if (!running) { clearInterval(spawnerRef.current); return; }
    const spawn = () => {
      const col = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      const word = SPARK_WORDS[Math.floor(Math.random() * SPARK_WORDS.length)];
      const size = 32 + Math.floor(Math.random() * 24);
      const dur = Math.max(1400, 4200 - levelRef.current * 400);
      const id = nextId.current++;
      const leftPct = 5 + Math.random() * 88;
      setSparks(p => [...p, { id, col, word, size, dur, leftPct, caught: false, missed: false }]);
      // Auto-miss
      setTimeout(() => {
        setSparks(p => {
          const s = p.find(x => x.id === id);
          if (s && !s.caught) {
            setMissed(m => m + 1);
            setEnergy(e => Math.max(0, e - 5));
            return p.map(x => x.id === id ? { ...x, missed: true } : x);
          }
          return p;
        });
        setTimeout(() => setSparks(p => p.filter(x => x.id !== id)), 600);
      }, dur);
    };
    const interval = Math.max(700, 1500 - levelRef.current * 80);
    spawnerRef.current = setInterval(spawn, interval);
    return () => clearInterval(spawnerRef.current);
  }, [running, level]);

  const catchSpark = id => {
    setSparks(p => {
      const s = p.find(x => x.id === id);
      if (!s || s.caught || s.missed) return p;
      caughtRef.current++;
      const nc = caughtRef.current;
      setCaught(nc);
      setEnergy(e => Math.min(100, e + 8));
      const msgs = ["Nice! ✦", "Keep going!", "Beautiful!", "You got it!", "Light caught!"];
      setMsg(msgs[Math.floor(Math.random() * msgs.length)]);
      if (nc > 0 && nc % 8 === 0) {
        levelRef.current = Math.min(8, levelRef.current + 1);
        setLevel(levelRef.current);
        clearInterval(spawnerRef.current);
        setMsg(`⬆ Level ${levelRef.current}! Getting faster...`);
      }
      return p.map(x => x.id === id ? { ...x, caught: true } : x);
    });
    setTimeout(() => setSparks(p => p.filter(x => x.id !== id)), 450);
  };

  const reset = () => { clearInterval(spawnerRef.current); setRunning(false); setSparks([]); setCaught(0); setMissed(0); setLevel(1); setEnergy(0); setMsg("Click sparks before they vanish ✦"); caughtRef.current = 0; levelRef.current = 1; };

  return (
    <Shell title="Spark Catcher" emoji="✨" color="#fbbf24" science="Behavioral activation · Micro-wins · Positive reinforcement for low mood">
      {/* Stats */}
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 12 }}>
        {[["Caught", caught, "#fbbf24"], ["Missed", missed, "#f87171"], ["Level", level, "#34d399"]].map(([k, v, c]) => (
          <div key={k} style={{ textAlign: "center" }}>
            <div style={{ color: c, fontSize: 28, fontWeight: 700, fontFamily: "'DM Serif Display',serif" }}>{v}</div>
            <div style={{ color: "#3d4a8a", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Energy bar */}
      <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,.06)", borderRadius: 99, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${energy}%`, background: "linear-gradient(90deg,#fbbf24,#f59e0b)", borderRadius: 99, transition: "width .4s ease" }} />
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#fbbf24", minHeight: 20, fontFamily: "'DM Serif Display',serif", fontStyle: "italic", marginBottom: 10 }}>{msg}</p>

      {/* Field */}
      <div style={{ position: "relative", width: "100%", height: 300, background: "radial-gradient(ellipse at 50% 40%,#0f0820 0%,#030510 70%)", borderRadius: 16, border: "1px solid rgba(251,191,36,.08)", overflow: "hidden", marginBottom: 12 }}>
        {sparks.map(s => (
          <div
            key={s.id}
            onClick={() => catchSpark(s.id)}
            style={{
              position: "absolute",
              left: `${s.leftPct}%`,
              top: s.caught ? "50%" : "-40px",
              width: s.size, height: s.size,
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 40%,${s.col}55,${s.col}22)`,
              border: `1.5px solid ${s.col}88`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, fontWeight: 700, color: s.col,
              cursor: s.caught || s.missed ? "default" : "pointer",
              userSelect: "none",
              animation: s.caught
                ? "au-sparkCatch .45s ease-out forwards"
                : s.missed
                  ? "au-sparkMiss .5s ease forwards"
                  : `au-sparkFall ${s.dur}ms linear forwards`,
              zIndex: 2,
            }}
          >
            {s.word}
          </div>
        ))}
        {!running && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "rgba(251,191,36,.25)", fontSize: 14 }}>Press Start to begin catching sparks ✦</p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <PillBtn onClick={running ? () => { clearInterval(spawnerRef.current); setRunning(false); } : startGame}
          style={{ background: running ? "rgba(248,113,113,.15)" : "rgba(251,191,36,.15)", border: `1.5px solid ${running ? "#f87171" : "#fbbf24"}`, color: running ? "#f87171" : "#fbbf24" }}>
          {running ? "⏸ Pause" : "▶ Start"}
        </PillBtn>
        <PillBtn onClick={reset} style={{ background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.1)", color: "#64748b" }}>↺ Reset</PillBtn>
      </div>

      <Insight color="#78350f" bg="#fbbf2422" border="#fbbf2433"
        text="💡 Why it works: Behavioral activation — engaging in small rewarding actions — is a frontline treatment for low mood and depression. Each spark caught is a micro-win that builds upward momentum." />
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════
   GAME 5 — COLOR FLOOD
══════════════════════════════════════════════════════════════ */
const FLOOD_COLORS = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f9a8d4"];
const GRID_N = 9;
const MAX_MOVES = 22;

function makeFloodGrid() {
  return Array.from({ length: GRID_N * GRID_N }, () => Math.floor(Math.random() * FLOOD_COLORS.length));
}

function floodFill(grid, newCol) {
  const startCol = grid[0];
  if (newCol === startCol) return grid;
  const next = [...grid];
  const visited = new Set();
  const queue = [0];
  while (queue.length) {
    const idx = queue.shift();
    if (visited.has(idx) || next[idx] !== startCol) continue;
    visited.add(idx);
    next[idx] = newCol;
    const row = Math.floor(idx / GRID_N), col = idx % GRID_N;
    if (row > 0) queue.push(idx - GRID_N);
    if (row < GRID_N - 1) queue.push(idx + GRID_N);
    if (col > 0) queue.push(idx - 1);
    if (col < GRID_N - 1) queue.push(idx + 1);
  }
  return next;
}

function ColorFlood() {
  const [grid, setGrid] = useState(makeFloodGrid);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [won, setWon] = useState(false);

  const doFlood = colIdx => {
    if (done) return;
    const next = floodFill(grid, colIdx);
    if (next === grid) return;
    const nm = moves + 1;
    setGrid(next); setMoves(nm);
    if (next.every(c => c === colIdx)) { setDone(true); setWon(true); }
    else if (nm >= MAX_MOVES) { setDone(true); setWon(false); }
  };

  const newGame = () => { setGrid(makeFloodGrid()); setMoves(0); setDone(false); setWon(false); };

  const cellSize = 34;
  const left = MAX_MOVES - moves;

  return (
    <Shell title="Color Flood" emoji="🌊" color="#60a5fa" science="Sensory engagement · Present-moment focus · Strategic thinking as mindfulness">
      {/* Move bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "#60a5fa" }}>Moves: {moves}</span>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.07)", borderRadius: 99, margin: "0 12px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(left / MAX_MOVES) * 100}%`, background: left > 8 ? "#60a5fa" : left > 4 ? "#fbbf24" : "#f87171", borderRadius: 99, transition: "width .3s, background .3s" }} />
        </div>
        <span style={{ fontSize: 13, color: left > 5 ? "#60a5fa" : "#f87171" }}>{left} left</span>
      </div>

      {/* Status */}
      <p style={{ textAlign: "center", fontSize: 13, color: won ? "#34d399" : done ? "#f87171" : "#60a5fa", marginBottom: 14, minHeight: 18 }}>
        {won ? `🎉 Flooded in ${moves} moves! ${moves <= 15 ? "★ Excellent!" : "✓ Good!"}` : done ? "Out of moves! Try again." : "Flood the entire grid with one color!"}
      </p>

      {/* Color palette */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
        {FLOOD_COLORS.map((col, idx) => (
          <div
            key={col}
            onClick={() => doFlood(idx)}
            style={{
              width: 36, height: 36, borderRadius: "50%", cursor: "pointer",
              background: col,
              border: grid[0] === idx ? "3px solid white" : "2px solid rgba(255,255,255,.15)",
              transform: grid[0] === idx ? "scale(1.15)" : "scale(1)",
              transition: "all .15s",
            }}
          />
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_N}, ${cellSize}px)`, gap: 2, margin: "0 auto 14px", width: "fit-content", borderRadius: 10, overflow: "hidden" }}>
        {grid.map((c, i) => (
          <div
            key={i}
            onClick={() => doFlood(c)}
            style={{ width: cellSize, height: cellSize, background: FLOOD_COLORS[c], borderRadius: 2, cursor: "pointer", transition: "background .3s ease" }}
          />
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <PillBtn onClick={newGame} style={{ background: "rgba(96,165,250,.15)", border: "1.5px solid #60a5fa", color: "#60a5fa" }}>New Puzzle</PillBtn>
      </div>

      <Insight color="#1e3a5f" bg="#60a5fa22" border="#60a5fa33"
        text="💡 Why it works: Color engagement activates sensory processing pathways. Strategic present-moment thinking is natural mindfulness that interrupts numbing dissociation and reawakens engagement." />
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════
   GAME 6 — SORT IT OUT (ACT)
══════════════════════════════════════════════════════════════ */
const SORT_THOUGHTS = [
  { text: "What people think of me",  ctrl: false },
  { text: "My response to criticism", ctrl: true  },
  { text: "The weather",              ctrl: false },
  { text: "How I treat myself",       ctrl: true  },
  { text: "Other people's moods",     ctrl: false },
  { text: "My daily habits",          ctrl: true  },
  { text: "Economic uncertainty",     ctrl: false },
  { text: "How I spend my time",      ctrl: true  },
  { text: "Traffic and delays",       ctrl: false },
  { text: "My breathing pace",        ctrl: true  },
  { text: "Being liked by everyone",  ctrl: false },
  { text: "My words and tone",        ctrl: true  },
  { text: "The past",                 ctrl: false },
  { text: "My reaction to the past",  ctrl: true  },
  { text: "Getting sick randomly",    ctrl: false },
  { text: "Exercising regularly",     ctrl: true  },
  { text: "The news cycle",           ctrl: false },
  { text: "My boundaries",            ctrl: true  },
];

function SortItOut() {
  const [queue, setQueue] = useState(() => [...SORT_THOUGHTS].sort(() => Math.random() - 0.5));
  const [inCtrl, setInCtrl] = useState(0);
  const [notCtrl, setNotCtrl] = useState(0);
  const [total, setTotal] = useState(0);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 30 });
  const [dragging, setDragging] = useState(false);
  const [litLeft, setLitLeft] = useState(false);
  const [litRight, setLitRight] = useState(false);
  const arenaRef = useRef(null);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const current = queue[0];

  const onMouseDown = e => {
    if (!running || !current) return;
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = e => {
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      const nx = dragStart.current.ox + dx;
      const ny = dragStart.current.oy + dy;
      setPos({ x: nx, y: ny });
      setLitLeft(nx < -80);
      setLitRight(nx > 80);
    };
    const onUp = () => {
      setDragging(false);
      setLitLeft(false); setLitRight(false);
      if (pos.x < -80) sortThought("left");
      else if (pos.x > 80) sortThought("right");
      else setPos({ x: 0, y: 30 });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, pos]);

  const sortThought = dir => {
    if (!current) return;
    const isCtrl = dir === "left"; // left bin = In my control
    setTotal(t => t + 1);
    if (isCtrl) setInCtrl(c => c + 1); else setNotCtrl(c => c + 1);
    setPos({ x: 0, y: 30 });
    setQueue(q => q.slice(1));
  };

  const reset = () => { setQueue([...SORT_THOUGHTS].sort(() => Math.random() - 0.5)); setInCtrl(0); setNotCtrl(0); setTotal(0); setRunning(false); setPos({ x: 0, y: 30 }); };

  const allDone = queue.length === 0 && running;

  return (
    <Shell title="Sort It Out" emoji="🧠" color="#34d399" science="ACT Therapy · Separating controllable from uncontrollable reduces anxiety & rumination">
      {/* Score row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
        <div style={{ background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.2)", borderRadius: 12, padding: "8px 18px", textAlign: "center" }}>
          <div style={{ color: "#34d399", fontSize: 24, fontWeight: 700, fontFamily: "'DM Serif Display',serif" }}>{inCtrl}</div>
          <div style={{ color: "#3d4a8a", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em" }}>In my control</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#475569", fontSize: 11, marginBottom: 4 }}>SORTED</div>
          <div style={{ color: "white", fontSize: 30, fontWeight: 700, fontFamily: "'DM Serif Display',serif" }}>{total}</div>
        </div>
        <div style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 12, padding: "8px 18px", textAlign: "center" }}>
          <div style={{ color: "#f87171", fontSize: 24, fontWeight: 700, fontFamily: "'DM Serif Display',serif" }}>{notCtrl}</div>
          <div style={{ color: "#3d4a8a", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em" }}>Not in control</div>
        </div>
      </div>

      {/* Arena */}
      <div ref={arenaRef} style={{ position: "relative", width: "100%", height: 280, marginBottom: 12, userSelect: "none" }}>
        {/* Bins */}
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "46%", height: 80, borderRadius: 14, border: `2px dashed #34d399`, background: litLeft ? "rgba(52,211,153,.12)" : "rgba(52,211,153,.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "all .2s", transform: litLeft ? "scale(1.04)" : "scale(1)" }}>
          <div style={{ color: "#34d399", fontSize: 22, fontWeight: 700, fontFamily: "'DM Serif Display',serif" }}>{inCtrl}</div>
          <div style={{ color: "#34d399", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>← In my control</div>
        </div>
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "46%", height: 80, borderRadius: 14, border: `2px dashed #f87171`, background: litRight ? "rgba(248,113,113,.12)" : "rgba(248,113,113,.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "all .2s", transform: litRight ? "scale(1.04)" : "scale(1)" }}>
          <div style={{ color: "#f87171", fontSize: 22, fontWeight: 700, fontFamily: "'DM Serif Display',serif" }}>{notCtrl}</div>
          <div style={{ color: "#f87171", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Not in control →</div>
        </div>

        {/* Current thought card */}
        {running && current && !allDone && (
          <div
            onMouseDown={onMouseDown}
            style={{
              position: "absolute",
              left: "50%", top: pos.y,
              transform: `translateX(calc(-50% + ${pos.x}px)) rotate(${pos.x * 0.04}deg)`,
              background: "rgba(13,16,48,1)", border: "1.5px solid rgba(255,255,255,.12)",
              borderRadius: 16, padding: "14px 20px",
              fontSize: 14, color: "#c7d2fe", textAlign: "center",
              width: 220, cursor: dragging ? "grabbing" : "grab",
              boxShadow: "0 8px 30px rgba(0,0,0,.4)",
              transition: dragging ? "none" : "transform .3s cubic-bezier(.34,1.56,.64,1)",
              zIndex: 10,
            }}
          >
            {current.text}
            <div style={{ fontSize: 10, color: "#3d4a8a", marginTop: 6 }}>drag left or right</div>
          </div>
        )}

        {allDone && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 44 }}>🎉</div>
            <p style={{ color: "#34d399", fontFamily: "'DM Serif Display',serif", fontSize: 20 }}>All sorted!</p>
            <p style={{ color: "#475569", fontSize: 13 }}>{inCtrl} in control · {notCtrl} not in control</p>
          </div>
        )}

        {!running && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "rgba(255,255,255,.2)", fontSize: 14 }}>Press Start to begin sorting your thoughts</p>
          </div>
        )}
      </div>

      {/* Hint arrows */}
      {running && current && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, padding: "0 10px" }}>
          <span style={{ color: "rgba(52,211,153,.4)", fontSize: 12 }}>← In my control</span>
          <span style={{ color: "rgba(248,113,113,.4)", fontSize: 12 }}>Not in control →</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <PillBtn
          onClick={() => setRunning(r => !r)}
          style={{ background: running ? "rgba(248,113,113,.15)" : "rgba(52,211,153,.15)", border: `1.5px solid ${running ? "#f87171" : "#34d399"}`, color: running ? "#f87171" : "#34d399" }}
        >
          {running ? "⏸ Pause" : "▶ Start"}
        </PillBtn>
        <PillBtn onClick={reset} style={{ background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.1)", color: "#64748b" }}>↺ Reset</PillBtn>
      </div>

      <Insight color="#064e3b" bg="#34d39922" border="#34d39933"
        text="💡 Why it works: ACT therapy teaches separating worries into 'controllable' vs 'uncontrollable' — you can only act on what's in your control. Acknowledging the rest is liberating and reduces anxiety." />
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════
   GAME 7 — FEEL & MATCH
══════════════════════════════════════════════════════════════ */
const MATCH_EMOTIONS = [
  { emoji: "😊", name: "Joy",         color: "#fbbf24" },
  { emoji: "😢", name: "Sadness",     color: "#60a5fa" },
  { emoji: "😡", name: "Anger",       color: "#f87171" },
  { emoji: "😰", name: "Fear",        color: "#a78bfa" },
  { emoji: "🥰", name: "Love",        color: "#f9a8d4" },
  { emoji: "😌", name: "Peace",       color: "#6ee7b7" },
  { emoji: "😤", name: "Frustration", color: "#fb923c" },
  { emoji: "🤗", name: "Warmth",      color: "#34d399" },
];

function FeelAndMatch() {
  const makeCards = () =>
    [...MATCH_EMOTIONS, ...MATCH_EMOTIONS]
      .sort(() => Math.random() - 0.5)
      .map((e, i) => ({ ...e, uid: i, flipped: false, matched: false }));

  const [cards, setCards] = useState(makeCards);
  const [flipped, setFlipped] = useState([]);
  const [pairs, setPairs] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [time, setTime] = useState(0);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    if (started.current) return;
    started.current = true;
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const flip = uid => {
    if (locked) return;
    const card = cards.find(c => c.uid === uid);
    if (!card || card.flipped || card.matched) return;
    startTimer();

    const newCards = cards.map(c => c.uid === uid ? { ...c, flipped: true } : c);
    const newFlipped = [...flipped, uid];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMovesCount(m => m + 1);
      setLocked(true);
      const [aUid, bUid] = newFlipped;
      const a = newCards.find(c => c.uid === aUid);
      const b = newCards.find(c => c.uid === bUid);
      if (a.name === b.name) {
        setTimeout(() => {
          setCards(p => p.map(c => (c.uid === aUid || c.uid === bUid) ? { ...c, matched: true } : c));
          setPairs(p => {
            const np = p + 1;
            if (np === MATCH_EMOTIONS.length) clearInterval(timerRef.current);
            return np;
          });
          setFlipped([]); setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(p => p.map(c => (c.uid === aUid || c.uid === bUid) ? { ...c, flipped: false } : c));
          setFlipped([]); setLocked(false);
        }, 1100);
      }
    }
  };

  const newGame = () => {
    clearInterval(timerRef.current); started.current = false;
    setCards(makeCards()); setFlipped([]); setPairs(0); setMovesCount(0); setTime(0); setLocked(false);
  };

  const allMatched = pairs === MATCH_EMOTIONS.length;

  return (
    <Shell title="Feel & Match" emoji="🃏" color="#34d399" science="Emotion recognition · DBT emotional intelligence · Mindful identification">
      {/* Stats */}
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 14 }}>
        {[["Pairs", pairs, "#34d399"], ["Moves", movesCount, "#60a5fa"], ["Time", `${time}s`, "#fbbf24"]].map(([k, v, c]) => (
          <div key={k} style={{ textAlign: "center" }}>
            <div style={{ color: c, fontSize: 26, fontWeight: 700, fontFamily: "'DM Serif Display',serif" }}>{v}</div>
            <div style={{ color: "#3d4a8a", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Win message */}
      {allMatched && (
        <div style={{ textAlign: "center", padding: "12px 0 16px", animation: "au-fadeUp .4s ease" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <p style={{ color: "#34d399", fontFamily: "'DM Serif Display',serif", fontSize: 20, marginBottom: 4 }}>All {pairs} pairs matched!</p>
          <p style={{ color: "#475569", fontSize: 13 }}>Completed in {movesCount} moves · {time}s</p>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {cards.map(card => (
          <div
            key={card.uid}
            onClick={() => flip(card.uid)}
            style={{ height: 72, borderRadius: 14, cursor: card.matched ? "default" : "pointer", perspective: 600 }}
          >
            <div style={{
              width: "100%", height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
              transition: "transform .4s cubic-bezier(.4,0,.2,1)",
              transform: card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0deg)",
              borderRadius: 14,
            }}>
              {/* Front */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 14,
                background: "rgba(19,22,64,1)", border: "1.5px solid rgba(255,255,255,.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backfaceVisibility: "hidden",
                fontSize: 22, color: "#1e2a6a", fontWeight: 900,
              }}>?</div>
              {/* Back */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 14,
                background: card.matched ? `${card.color}18` : "rgba(13,16,48,1)",
                border: `1.5px solid ${card.matched ? card.color : card.color + "55"}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                boxShadow: card.matched ? `0 0 16px ${card.color}33` : "none",
                transition: "box-shadow .3s",
              }}>
                <span style={{ fontSize: 24 }}>{card.emoji}</span>
                <span style={{ fontSize: 9, color: card.color, fontWeight: 700 }}>{card.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <PillBtn onClick={newGame} style={{ background: "rgba(52,211,153,.15)", border: "1.5px solid #34d399", color: "#34d399" }}>New Game</PillBtn>
      </div>

      <Insight color="#064e3b" bg="#34d39922" border="#34d39933"
        text="💡 Why it works: Emotion recognition exercises (identifying and naming emotional states) are a core DBT skill that builds emotional intelligence and reduces reactivity over time." />
    </Shell>
  );
}
import Sidebar from "./components/Sidebar";


function MindCraftWrapper({ mood }) {
  const baseElements = {
    nature: ["Fire", "Water", "Earth", "Air", "Time"],
    emotions: ["Stress", "Anxiety", "Sadness", "Loneliness", "Anger", "Sleep", "Music", "Friend", "Time", "Breathing", "Night", "Work", "Effort", "Journaling", "Nature", "Therapy", "Pet", "Rest", "Action"],
    student: ["Assignment", "Deadline", "Coffee", "Exam", "Luck", "Lecture", "Sleep", "Notes", "Friend", "Time", "Job"],
    fun: ["Water", "Bollywood", "Fire", "Drama", "Tea", "Gossip", "Sleep", "Alarm", "Internet", "Down", "Phone", "Battery", "Popcorn"],
    technology: ["Hardware", "Software", "Electricity", "Internet", "User", "Data", "Coffee"],
    food: ["Dough", "Tomato", "Cheese", "Water", "Fire", "Meat", "Potato", "Oil", "Milk"]
  };

  const [genre, setGenre] = useState("nature");
  const [elements, setElements] = useState(baseElements["nature"]);

  // Swap elements payload when genre changes
  useEffect(() => {
    if (baseElements[genre]) {
      setElements(baseElements[genre]);
    }
  }, [genre]);

  // 🔥 AUTO SWITCH BASED ON MOOD
  useEffect(() => {
    const moodToGenre = {
      anxious: "emotions",
      sad: "emotions",
      angry: "fun",
      tired: "nature",
      numb: "nature",
      happy: "fun",
    };

    if (moodToGenre[mood]) {
      setGenre(moodToGenre[mood]);
    }
  }, [mood]);

  return (
    <Shell
      title="Mind Craft"
      emoji="🧩"
      color="#6366f1"
      science="Creative expression · Cognitive exploration"
    >
      <p style={{ marginBottom: 10 }}>
        Combine elements based on your mood.
      </p>

      {/* GENRE SWITCH */}
      <div style={{ marginBottom: 15 }}>
        {["nature", "emotions", "student", "fun", "technology", "food"].map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            style={{
              marginRight: 8,
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #444",
              background: genre === g ? "#6366f1" : "transparent",
              color: genre === g ? "white" : "#aaa",
              cursor: "pointer"
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <style>{`
        .mindcraft-theme-container {
          --bg-primary: #121212;
          --bg-secondary: #1e1e1e;
          --bg-dots: #333333;
          --text-main: #f0f0f0;
          --text-muted: #a0a0a0;
          --border-color: #333333;
          --item-bg: #222222;
          --item-border: #444444;
          --item-shadow-soft: 0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.4);
          --item-shadow-hover: 0 6px 12px rgba(0,0,0,0.45);
          --item-shadow-active: 0 10px 20px rgba(0,0,0,0.6);
          --font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* GAME UI */}
      <div className="mindcraft-theme-container" style={{ display: "flex", height: "450px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", overflow: "hidden", background: "var(--bg-primary)" }}>
        <Sidebar
          elements={elements}
          genre={genre}
          setGenre={setGenre}
        />

        <Canvas
          elements={elements}
          setElements={setElements}
          genre={genre}
        />
      </div>
    </Shell>
  );
}
/* ══════════════════════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes au-fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes au-scaleIn  { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
  @keyframes au-shake    { 0%,100%{transform:translateX(0) rotate(0)} 25%{transform:translateX(-6px) rotate(-2deg)} 75%{transform:translateX(6px) rotate(2deg)} }
  @keyframes au-shimmer  { 0%,100%{opacity:.15} 50%{opacity:.75} }
  @keyframes au-growIn   { from{transform:scale(0) rotate(-20deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }

  @keyframes au-rise        { from{bottom:-80px} to{bottom:110%} }
  @keyframes au-balloonPop  { 0%{opacity:1;transform:scale(1)} 40%{opacity:1;transform:scale(1.4)} 100%{opacity:0;transform:scale(0)} }
  @keyframes au-sparkFall   { from{top:-40px} to{top:110%} }
  @keyframes au-sparkCatch  { 0%{transform:scale(1);opacity:1} 60%{transform:scale(2);opacity:.6} 100%{transform:scale(0);opacity:0} }
  @keyframes au-sparkMiss   { to{opacity:0} }

  .au-card {
    background: rgba(255,255,255,.03);
    border: 1.5px solid rgba(255,255,255,.07);
    border-radius: 22px;
    padding: 18px 16px 16px;
    cursor: pointer;
    display: flex; flex-direction: column; align-items: flex-start;
    gap: 7px; text-align: left; position: relative; overflow: hidden;
    animation: au-fadeUp .45s ease both;
    transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s, border-color .25s;
  }
  .au-card::before {
    content:''; position:absolute; inset:0;
    background: linear-gradient(135deg, var(--gc) 0%, transparent 55%);
    opacity:0; transition:opacity .3s;
  }
  .au-card:hover { transform:translateY(-8px) scale(1.02); box-shadow:0 26px 64px rgba(0,0,0,.55); border-color:var(--gc) !important; }
  .au-card:hover::before { opacity:.07; }
  .au-card:hover .au-cta { opacity:1 !important; transform:translateX(0) !important; }

  .au-cta { opacity:0; transform:translateX(-6px); transition:all .2s; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; margin-top:2px; }

  .au-chip {
    padding:8px 16px; border-radius:999px;
    border:1.5px solid rgba(255,255,255,.1);
    cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    display:flex; align-items:center; gap:6px;
    transition:all .2s cubic-bezier(.34,1.56,.64,1);
    white-space:nowrap; animation:au-fadeUp .4s ease both;
  }
  .au-chip:hover { transform:translateY(-2px); }

  .au-pill {
    padding:9px 20px; border-radius:999px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600;
    cursor:pointer; transition:all .18s;
    display:inline-flex; align-items:center; gap:6px;
    background:transparent;
  }
  .au-pill:hover { transform:translateY(-1px); filter:brightness(1.08); }

  .au-back {
    padding:9px 18px; border-radius:999px;
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
    color:#64748b; font-family:'DM Sans',sans-serif; font-size:13px;
    cursor:pointer; transition:all .18s; display:flex; align-items:center; gap:6px;
  }
  .au-back:hover { background:rgba(255,255,255,.1); color:#e2e8f0; }

  input[type=range] { accent-color:#6ee7b7; cursor:pointer; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:99px; }
`;

/* ── Shared Styles ── */
const S = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#080c1a 0%,#0d0b1f 50%,#090e18 100%)",
    padding: "32px 28px",
    fontFamily: "'DM Sans',sans-serif",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 },
  eyebrow: { color: "#334155", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 },
  title: {
    color: "white", fontSize: 34, fontFamily: "'DM Serif Display',serif", fontWeight: 400,
    background: "linear-gradient(90deg,#6ee7b7,#93c5fd,#c4b5fd)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 6px",
  },
  subtitle: { color: "#475569", fontSize: 15 },
  sectionLabel: { color: "#475569", fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 14 },
  sciTag: { fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 999, position: "absolute", top: 14, right: 14 },
  tagPill: { fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 999, border: "1px solid" },
  cardTitle: { color: "white", fontFamily: "'DM Serif Display',serif", fontSize: 18, fontWeight: 400, margin: 0 },
  cardDesc: { color: "#64748b", fontSize: 12, lineHeight: 1.6, margin: 0 },
  moodBanner: {
    display: "flex", alignItems: "center", gap: 14, marginTop: 14,
    padding: "12px 18px", background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.07)", borderRadius: 14,
    animation: "au-fadeUp .25s ease",
  },
};