import React, { useState, useEffect } from "react";
import Center from "../../animated-components/Center";

import {
  CircularProgress,
  Divider,
  IconButton
} from "@mui/material";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import Api from "../../api";

const Tracker = () => {

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [change, setChange] = useState(false);


  /* -------------------------------------------
     FETCH TASKS (Same data used in TaskPages)
  --------------------------------------------*/

  useEffect(() => {

    const fetchTasks = async () => {

      try {

        const res = await Api.getUser({
          email: user.email
        });

        const allTasks = res.data.user.tasks;

        const completed = allTasks.filter(
          (task) => task.isCompleted
        );

        setTasks(allTasks);
        setCompletedTasks(completed);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    fetchTasks();

  }, [change]);


  /* -------------------------------------------
     FORMAT DATE
  --------------------------------------------*/

  const formatDate = (date) => {

    return dayjs(date).format("DD MMM YYYY");

  };


  /* -------------------------------------------
     GET TASKS COMPLETED ON SELECTED DAY
  --------------------------------------------*/

  const getTasksByDate = () => {

    if (!completedTasks) return [];

    return completedTasks.filter((task) => {

      const taskDate = dayjs(task.date).format("YYYY-MM-DD");
      const selected = dayjs(selectedDate).format("YYYY-MM-DD");

      return taskDate === selected;

    });

  };

  const dailyTasks = getTasksByDate();


  /* -------------------------------------------
     HANDLE DATE CHANGE
  --------------------------------------------*/

  const handleDateChange = (date) => {

    setSelectedDate(date);

  };


  /* -------------------------------------------
     LOADING SCREEN
  --------------------------------------------*/

  if (loading) {

    return (

      <Center>
        <div className="flex justify-center items-center h-[80vh]">
          <CircularProgress />
        </div>
      </Center>

    );

  }


  /* -------------------------------------------
     MAIN UI
  --------------------------------------------*/

/* -------------------------------------------
MAIN UI
--------------------------------------------*/

return (

  <Center>

```
<div className="w-full flex items-start justify-start gap-8 min-h-[80vh] p-6">

  {/* LEFT PANEL */}

  <div className="w-[25%] flex flex-col gap-6">

    <div>

      <h1 className="text-3xl font-bold text-white">
        Tasks Tracker
      </h1>

      <p className="text-sm  text-white">
        Track completed well-being tasks
      </p>

    </div>

    {/* CALENDAR */}

   <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DateCalendar
    value={selectedDate}
    onChange={(date) => handleDateChange(date)}
    sx={{
      backgroundColor: "white",
      borderRadius: "10px",

      "& .MuiPickersDay-root": {
        color: "black"
      },

      "& .MuiPickersDay-root.Mui-selected": {
        backgroundColor: "#8b5cf6",
        color: "white"
      },

      "& .MuiPickersDay-root:hover": {
        backgroundColor: "#6366f1"
      },

      "& .MuiPickersCalendarHeader-label": {
        color: "black"
      },

      "& .MuiSvgIcon-root": {
        color: "black"
      },

        /* YEAR BUTTONS */
      "& .MuiPickersYear-yearButton": {
        color: "black"
      },

      /* SELECTED YEAR (dark purple) */
      "& .MuiPickersYear-yearButton.Mui-selected": {
        backgroundColor: "#5b21b6",
        color: "purple  "
      },

      /* Hover year */
      "& .MuiPickersYear-yearButton:hover": {
        backgroundColor: "#6d28d9"
      }
    }}
  />
</LocalizationProvider>

  </div>


  {/* DIVIDER */}

  <div className="w-[1px] bg-gray-300 min-h-[75vh]" />


  {/* RIGHT PANEL */}

  <div className="w-full flex flex-col gap-8">

    {/* HEADER */}

    <div className="flex items-center justify-between">

      <h2 className="text-xl font-semibold text-white">

        Tasks completed on {formatDate(selectedDate)}

      </h2>

      <h2 className="text-lg font-bold text-green-600">

        {dailyTasks.length} Completed

      </h2>

    </div>


    {/* TASK CARDS */}

  <div className="flex flex-wrap gap-4">

  {dailyTasks.length > 0 ? (

    dailyTasks.map((task) => (

      <div
        key={task._id}
        className="bg-white flex flex-col justify-between p-3 border rounded-lg shadow-md w-[220px] min-h-[140px]"
      >

        {/* TOP CONTENT */}
        <div className="flex items-start justify-between">

          <h2 className="text-base font-semibold text-black pr-2">
            {task.title}
          </h2>

          <IconButton size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>

        </div>


        {/* BOTTOM SECTION */}
        <div>

          <Divider className="my-2" />

          <div className="flex items-center justify-between mt-4">

            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <CalendarMonthIcon fontSize="small" />
              <span>{formatDate(task.date)}</span>
            </div>

            <span className="text-green-600 font-semibold text-xs">
              ✔ Completed
            </span>

          </div>

        </div>

      </div>

    ))

  ) : (

    <div className="text-gray-600">
      No tasks completed on this day.
    </div>

  )}

</div>
  </div>

</div>
```

  </Center>

);


};

export default Tracker;













