import React, { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const moodEmoji = {
  1: "😠",
  2: "🙁",
  3: "🤔",
  4: "❤️",
  5: "😄"
};

const MoodGraph = () => {

  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchMood = async () => {

      try {

        const res = await fetch("http://localhost:8000/api/mood");
        const moods = await res.json();

        const formatted = moods.map((m) => ({
          date: new Date(m.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          }),
          mood: m.mood
        }));

        setData(formatted);

      } catch (err) {
        console.log(err);
      }

    };

    fetchMood();

  }, []);

  return (

    <div className="bg-[#151525] p-6 rounded-2xl shadow-xl border border-purple-500/20">

      <h2 className="text-xl font-semibold text-white mb-5">
        😊 Daily Mood Trend
      </h2>

      <ResponsiveContainer width="100%" height={330}>

        <LineChart data={data}>

          <defs>

            {/* Gradient line */}
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">

              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#6366f1" />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#2f2f45"
          />

          <XAxis
            dataKey="date"
            stroke="#cbd5f5"
            tick={{ fill: "#cbd5f5", fontSize: 12 }}
          />

          <YAxis
            domain={[1,5]}
            ticks={[1,2,3,4,5]}
            stroke="#cbd5f5"
            tick={{ fill:"#cbd5f5", fontSize: 18 }}
            tickFormatter={(value)=>moodEmoji[value]}
          />

          <Tooltip
            formatter={(value)=>moodEmoji[value]}
            contentStyle={{
              backgroundColor:"#1e1e2f",
              border:"1px solid #8b5cf6",
              borderRadius:"12px",
              color:"white"
            }}
          />

          <Line
            type="monotone"
            dataKey="mood"
            stroke="url(#moodGradient)"
            strokeWidth={4}
            dot={{
              r:6,
              fill:"#a78bfa",
              stroke:"#fff",
              strokeWidth:2
            }}
            activeDot={{
              r:9,
              fill:"#c4b5fd"
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

};

export default MoodGraph;