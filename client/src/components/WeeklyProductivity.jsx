import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const WeeklyProductivity = ({ tasks = [] }) => {

  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const weekly = {
    Sun:0,
    Mon:0,
    Tue:0,
    Wed:0,
    Thu:0,
    Fri:0,
    Sat:0
  };

  tasks
    .filter((t) => t.isCompleted)
    .forEach((task) => {

      if (!task.date) return;

      const day = new Date(task.date).getDay();

      weekly[days[day]]++;

    });

  const data = days.map((d) => ({
    day: d,
    tasks: weekly[d]
  }));

  return (

    <div className="bg-[#151525] p-6 rounded-2xl shadow-xl border border-purple-500/20">

      <h2 className="text-xl font-semibold text-white mb-5">
        📊 Weekly Productivity
      </h2>

      <ResponsiveContainer width="100%" height={330}>

        <BarChart data={data}>

          <defs>

            {/* Gradient bars */}
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">

              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#6366f1" />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#2f2f45"
          />

          <XAxis
            dataKey="day"
            stroke="#cbd5f5"
            tick={{ fill:"#cbd5f5", fontSize:12 }}
          />

          <YAxis
            stroke="#cbd5f5"
            tick={{ fill:"#cbd5f5", fontSize:12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor:"#1e1e2f",
              border:"1px solid #8b5cf6",
              borderRadius:"12px",
              color:"white"
            }}
          />

          <Bar
            dataKey="tasks"
            fill="url(#barGradient)"
            radius={[8,8,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

};

export default WeeklyProductivity;