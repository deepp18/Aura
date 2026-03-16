import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { subDays } from "date-fns";

const ProductivityHeatmap = ({ tasks=[] }) => {

  const completed = tasks.filter(t=>t.isCompleted);

  const dataMap = {};

  completed.forEach(task=>{

    if(!task.date) return;

    const date = new Date(task.date)
      .toISOString()
      .slice(0,10);

    if(!dataMap[date]) dataMap[date] = 0;

    dataMap[date]++;

  });

  const heatmapData = Object.keys(dataMap).map(date=>({
    date,
    count:dataMap[date]
  }));

  return(

    <div>

      <h2 className="text-lg font-semibold mb-4">
        Task Completion Heatmap
      </h2>

      <CalendarHeatmap
        startDate={subDays(new Date(),365)}
        endDate={new Date()}
        values={heatmapData}
        classForValue={(value)=>{
          if(!value) return "color-empty";
          if(value.count>=4) return "color-github-4";
          if(value.count>=3) return "color-github-3";
          if(value.count>=2) return "color-github-2";
          return "color-github-1";
        }}
      />

    </div>

  )

}

export default ProductivityHeatmap