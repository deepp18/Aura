import React, { useState } from "react";

const MoodScan = () => {
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setEmotion("");

    try {
      const res = await fetch("http://localhost:5000/scan");
      const data = await res.json();
      setEmotion(data.emotion);
    } catch (err) {
      setEmotion("Something went wrong...");
    }

    setLoading(false);
  };

  const getMessage = () => {
    if (!emotion) return "";

    const messages = {
      Happy: "✨ You’re glowing today! Keep spreading positivity.",
      Sad: "💙 It's okay to slow down. Better days are coming.",
      Angry: "🔥 Take a breath. You’ve got control.",
      Surprise: "😲 Life just surprised you! Embrace it.",
      Neutral: "🌿 Calm and balanced. Stay centered.",
      Fear: "🌙 You’re stronger than your fears.",
      Disgust: "😶 Time to reset your vibe."
    };

    return messages[emotion] || "✨ Stay mindful and aware.";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✨ Aura Mood Scan</h1>

      <p style={styles.subtitle}>
        Discover your current emotional state in real-time
      </p>
      <button style={styles.button} onClick={handleScan}>
        {loading ? "Scanning..." : "Start Scan"}
      </button>

      {loading && (
        <p style={styles.info}>
          Opening camera... Press <b>Q</b> to finish
        </p>
      )}

      {emotion && (
        <div style={styles.resultBox}>
          <h2>Your Mood: {emotion}</h2>
          <p style={styles.message}>{getMessage()}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "10px",
  },
  subtitle: {
    marginBottom: "25px",
    color: "#cbd5f5",
  },
  button: {
    padding: "14px 35px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #7c3aed, #22c55e)",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  },
  info: {
    marginTop: "15px",
    color: "#aaa",
  },
  resultBox: {
    marginTop: "30px",
    padding: "25px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
  },
  message: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#e0e7ff",
  },
};

export default MoodScan;