import React, { useState, useEffect } from 'react';
import Center from '../animated-components/Center';
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Api from "../api";
import AddTaskModal from '../components/AddTaskModal';
import Checkbox from '@mui/material/Checkbox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * TaskPages (Aura theme) — refactored from "financial habits" to "mood & dream" tasks.
 * - Strings, tooltips, aria labels and empty-state messages updated
 * - Functional behavior unchanged
 */

const TaskPages = () => {
  const [user, setUser] = useState();
  const [userInfo] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [change, setChange] = useState(false);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const res = await Api.getUser({ email: userInfo.email });
        localStorage.setItem('level', res.data.user.gaming.level);
        const pen = res.data.user.tasks.filter((task) => !task.isCompleted);
        const comp = res.data.user.tasks.filter((task) => task.isCompleted);
        setPending(pen);
        setCompleted(comp);
        setUser(res.data.user);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change]);

  const updateTask = async (task) => {
    try {
      await Api.setTaskStatus({ email: user.email, id: task._id });
      setChange(!change);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const formatDate = (dt) => {
    const date = new Date(dt);
    return date.toLocaleDateString();
  };

  const handleDelete = async (task) => {
    try {
      await Api.deleteTask({ email: user.email, id: task._id });
      setChange(!change);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  if (loading) {
    return (
      <Center>
        <div className='w-full h-screen flex items-center justify-center'>
          <CircularProgress color="inherit" />
        </div>
      </Center>
    );
  }

  return (
    <Center>
      <div className="w-full flex flex-col gap-8 p-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Pending Well-being Tasks</h2>
          <IconButton onClick={handleClickOpen} aria-label="Add wellbeing task" sx={{ color: "white", background: "transparent" }}>
            <AddCircleRoundedIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </div>

        {pending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.map((task) => (
              <article
                key={task._id}
                className="glass-card relative p-4 rounded-xl flex flex-col justify-between min-h-[150px] hover:shadow-2xl"
                role="article"
                aria-labelledby={`task-${task._id}`}
              >
                <div>
                  <h3 id={`task-${task._id}`} className="text-lg font-semibold text-white">{task.title}</h3>
                  <p className="text-sm text-white/80 mt-2">{task.desc}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tooltip title={`Due: ${formatDate(task.date)}`}>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <CalendarMonthIcon fontSize="small" />
                        <span>{formatDate(task.date)}</span>
                      </div>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-3">
                    {task.isAdminGenerated ? (
                      <Tooltip arrow title="System task — completing this helps your avatar and MoodWorld adapt.">
                        <IconButton aria-label="system-task" size="small" sx={{ color: "white" }}>
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip arrow title="Delete this wellbeing task">
                        <IconButton onClick={() => handleDelete(task)} aria-label="delete-task" size="small" sx={{ color: "white" }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Checkbox
                      onChange={() => updateTask(task)}
                      sx={{
                        color: "white",
                        '& .MuiSvgIcon-root': { fontSize: 34 },
                        '&.Mui-checked': { color: '#8b5cf6' }
                      }}
                      inputProps={{ 'aria-label': `complete-wellbeing-${task._id}` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/80">No pending wellbeing tasks yet — try adding a dream journal entry or a short mood check-in 🙂</div>
        )}

        {open && <AddTaskModal open={open} handleClose={handleClose} user={user} setChange={setChange} change={change} />}

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-white">Completed Well-being Tasks</h2>

          {completed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {completed.map((task) => (
                <article key={task._id} className="glass-card p-4 rounded-xl min-h-[140px]">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    <p className="text-sm text-white/80 mt-2">{task.desc}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <CalendarMonthIcon fontSize="small" />
                      <span>{formatDate(task.date)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {task.isAdminGenerated ? (
                        <Tooltip title="System task">
                          <IconButton size="small" sx={{ color: "white" }}>
                            <InfoOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Delete this task">
                          <IconButton onClick={() => handleDelete(task)} size="small" sx={{ color: "white" }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Checkbox
                        checked
                        onChange={() => updateTask(task)}
                        sx={{
                          color: '#8b5cf6',
                          '& .MuiSvgIcon-root': { fontSize: 34 }
                        }}
                        inputProps={{ 'aria-label': `completed-wellbeing-${task._id}` }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/80 mt-4">No completed wellbeing tasks yet — complete a mood check or dream note to earn LucidPoints!</div>
          )}
        </div>
      </div>
    </Center>
  );
};

export default TaskPages;

