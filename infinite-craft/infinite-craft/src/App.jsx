import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";

export default function App() {
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
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setElements(baseElements[genre] || baseElements["nature"]);
  }, [genre]);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-main)",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        elements={elements}
        theme={theme}
        toggleTheme={toggleTheme}
        genre={genre}          // ✅ pass genre
        setGenre={setGenre}    // ✅ pass setter
      />

      {/* Canvas */}
      <Canvas
        elements={elements}
        setElements={setElements}
        genre={genre}          // ✅ important
      />
    </div>
  );
}