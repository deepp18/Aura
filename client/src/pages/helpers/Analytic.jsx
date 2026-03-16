import React, { useState, useEffect } from "react";
import Api from "../../api";
import Center from "../../animated-components/Center";

import WeeklyProductivity from "../../components/WeeklyProductivity";
import MoodGraph from "../../components/MoodGraph";

import {
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";

const Analytic = () => {

  const [user] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [tasks, setTasks] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("mood");

  /* ---------------- FETCH TASKS ---------------- */

  useEffect(() => {

    const fetchTasks = async () => {

      try {

        const res = await Api.getUser({
          email: user.email
        });

        const allTasks = res.data.user.tasks || [];

        setTasks(allTasks);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    if(user?.email) fetchTasks();

  }, [user]);

  /* ---------------- FETCH MOODS ---------------- */

  useEffect(() => {

    const fetchMoods = async () => {

      try {

        const res = await fetch("http://localhost:8000/api/mood");

        const data = await res.json();

        setMoods(data);

      } catch(err) {

        console.log(err);

      }

    };

    fetchMoods();

  }, []);

  const handleChange = (e,newView)=>{
    if(newView!==null) setView(newView);
  };

  /* ---------- ANALYTICS ---------- */

  const completed = tasks.filter(t=>t.isCompleted);

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round((completed.length / tasks.length) * 100);

  const totalCompleted = completed.length;

  /* Most productive day */

  const dayMap = {};

  completed.forEach(task=>{

    if(!task.date) return;

    const day = new Date(task.date).getDay();

    dayMap[day] = (dayMap[day] || 0) + 1;

  });

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  let mostProductive = "-";

  if(Object.keys(dayMap).length){

    const best = Object.keys(dayMap)
      .reduce((a,b)=> dayMap[a] > dayMap[b] ? a : b);

    mostProductive = days[best];

  }

  /* ---------- STREAK ---------- */

  const dates = completed
    .map(t=>new Date(t.date).toISOString().slice(0,10))
    .sort();

  let streak = 0;
  let prev=null;

  dates.forEach(d=>{

    if(!prev){
      streak=1;
      prev=new Date(d);
      return;
    }

    const curr=new Date(d);
    const diff=(curr-prev)/(1000*60*60*24);

    if(diff===1) streak++;
    else streak=1;

    prev=curr;

  });

  /* ---------- AVERAGE MOOD ---------- */

  const avgMood =
    moods.length === 0
      ? "-"
      : (
          moods.reduce((sum,m)=> sum + m.mood ,0) / moods.length
        ).toFixed(1);

  const moodEmoji = {
     1: "😠",
     2: "🙁",
     3: "🤔",
     4: "❤️",
     5: "😄"
  };

  const moodDisplay =
    avgMood === "-"
      ? "-"
      : moodEmoji[Math.round(avgMood)];

  if(loading){

    return(
      <Center>
        <CircularProgress/>
      </Center>
    )

  }

  return(

    <Center>

      <div className="w-full max-w-6xl flex flex-col gap-10 p-8">

        <h1 className="text-4xl font-bold text-white">
          Productivity Analytics
        </h1>

        {/* STAT CARDS */}

        <div className="grid grid-cols-5 gap-6">

  <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-xl">
    <h3 className="text-sm opacity-80">🔥 Current Streak</h3>
    <p className="text-2xl font-bold">{streak} days</p>
  </div>

  <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 rounded-xl shadow-xl">
    <h3 className="text-sm opacity-80">📅 Most Productive Day</h3>
    <p className="text-2xl font-bold">{mostProductive}</p>
  </div>

  <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white p-6 rounded-xl shadow-xl">
    <h3 className="text-sm opacity-80">📊 Completion Rate</h3>
    <p className="text-2xl font-bold">{completionRate}%</p>
  </div>

  <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white p-6 rounded-xl shadow-xl">
    <h3 className="text-sm opacity-80">✅ Tasks Completed</h3>
    <p className="text-2xl font-bold">{totalCompleted}</p>
  </div>

  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-xl">
    <h3 className="text-sm opacity-80">😊 Average Mood</h3>
    <p className="text-2xl font-bold">{moodDisplay}</p>
  </div>

</div>

        {/* CHART SWITCH */}

        <ToggleButtonGroup
  
  value={view}
  exclusive
  onChange={handleChange}
  sx={{
    backgroundColor: "#070739",
    borderRadius: "12px",
    padding: "4px",

    "& .MuiToggleButton-root": {
      color: "WHITE",
      border: "none",
      padding: "8px 18px",
      borderRadius: "10px",
      fontWeight: 500,
      transition: "all 0.2s ease"
    },

    "& .MuiToggleButton-root:hover": {
      backgroundColor: "#6d28d9"
    },

    "& .Mui-selected": {
      backgroundColor: "#8b5cf6",
      color: "white"
    },

    "& .Mui-selected:hover": {
      backgroundColor: "#7c3aed"
    }
  }}
>
  <ToggleButton value="mood">
    Mood Graph
  </ToggleButton>

  <ToggleButton value="weekly">
    Weekly Graph
  </ToggleButton>
</ToggleButtonGroup>

        <div className="bg-white p-6 rounded-xl shadow-xl">

          {view==="mood" && <MoodGraph tasks={tasks}/>}

          {view==="weekly" && <WeeklyProductivity tasks={tasks}/>}

        </div>

      </div>

    </Center>

  )

}

export default Analytic;