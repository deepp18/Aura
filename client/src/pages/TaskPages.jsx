import React, { useState, useEffect } from 'react';
import Center from '../animated-components/Center';
import { CircularProgress, IconButton, Tooltip, Button } from "@mui/material";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Api from "../api";
import AddTaskModal from '../components/AddTaskModal';
import { toast } from 'react-toastify';
import Checkbox from '@mui/material/Checkbox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskPages = () => {
  const storedUserInfo = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch(e){ return null; }
  })();

  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState(storedUserInfo);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [change, setChange] = useState(false);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [moodDetected, setMoodDetected] = useState(null); // { emotion, createdOn, savedTaskId, localId, status }

  useEffect(() => {
    if (!userInfo || !userInfo.email) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchUser = async () => {
      if (!Api || !Api.getUser) {
        setPending([]);
        setCompleted([]);
        setLoading(false);
        return;
      }
      try {
        const res = await Api.getUser({ email: userInfo.email });
        const serverUser = res?.data?.user;
        if (!serverUser) {
          setPending([]);
          setCompleted([]);
          setUser(null);
          setLoading(false);
          return;
        }
        localStorage.setItem('level', serverUser.gaming?.level ?? "");
        setPending((serverUser.tasks || []).filter(t => !t.isCompleted));
        setCompleted((serverUser.tasks || []).filter(t => t.isCompleted));
        setUser(serverUser);
        setLoading(false);
      } catch (err) {
        console.error("getUser failed:", err);
        toast.error("Failed to fetch user");
        setLoading(false);
      }
    };

    fetchUser();

    // request mood from global predictor and auto-add if found
    (async () => {
      try {
        if (typeof window.predictMood === "function") {
          const emotion = await window.predictMood(); // uses app-level wrapper -> calls your Flask adapter
          if (emotion) {
            const normalized = String(emotion).toUpperCase().trim();
            // check duplicates: server tasks and local lists
            const existsInPending = (pending || []).some(t => String(t.title).toUpperCase() === normalized);
            const existsInCompleted = (completed || []).some(t => String(t.title).toUpperCase() === normalized);

            // Also check last auto-added mood in localStorage to avoid repeated auto-adds
            const lastAutoRaw = localStorage.getItem('lastAutoMoodAdded');
            let lastAuto = null;
            try { lastAuto = lastAutoRaw ? JSON.parse(lastAutoRaw) : null; } catch(e){ lastAuto = null; }

            const sameAsLast = lastAuto && lastAuto.emotion === normalized;

            if (!existsInPending && !existsInCompleted && !sameAsLast) {
              // create moodDetected state and auto-add
              const detected = {
                emotion: normalized,
                createdOn: new Date().toISOString(),
                savedTaskId: null,
                localId: `mood-local-${Date.now()}`,
                status: "ready"
              };
              setMoodDetected(detected);
              // auto-add to tasks
              await addMoodTaskAuto(detected);
              // store last added
              localStorage.setItem('lastAutoMoodAdded', JSON.stringify({ emotion: normalized, at: Date.now() }));
            } else {
              // if it already exists, still set moodDetected visually (but not add)
              setMoodDetected({ emotion: normalized, createdOn: new Date().toISOString(), status: existsInPending ? "added" : "completed" });
            }
          }
        } else {
          console.warn("window.predictMood not available.");
        }
      } catch (err) {
        console.error("predictMood failed:", err);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change]);

  const formatDate = (dt) => {
    try { return new Date(dt).toLocaleDateString(); } catch(e){ return dt; }
  };

  const updateTask = async (task) => {
    if (!Api || !Api.setTaskStatus) {
      setPending(prev => prev.filter(t => t._id !== task._id));
      setCompleted(prev => [{ ...task, isCompleted: !task.isCompleted }, ...prev]);
      setChange(c => !c);
      return;
    }
    try {
      await Api.setTaskStatus({ email: user.email, id: task._id });
      setChange(c => !c);
    } catch (err) {
      console.error("setTaskStatus failed:", err);
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (task) => {
    if (!Api || !Api.deleteTask) {
      setPending(prev => prev.filter(t => t._id !== task._id));
      setCompleted(prev => prev.filter(t => t._id !== task._id));
      setChange(c => !c);
      return;
    }
    try {
      await Api.deleteTask({ email: user.email, id: task._id });
      setChange(c => !c);
    } catch (err) {
      console.error("deleteTask failed:", err);
      toast.error("Failed to delete task");
    }
  };

  // Auto-add mood task (used by the effect above). Will try server create, fall back to local.
  const addMoodTaskAuto = async (detected) => {
    const payload = {
      title: detected.emotion,
      desc: "", // intentionally empty as requested
      date: new Date().toISOString(),
      isAdminGenerated: false,
      isCompleted: false
    };

    // If Api.createTask exists and user logged, call it
    try {
      if (Api && Api.createTask && user && user.email) {
        const resp = await Api.createTask({ email: user.email, task: payload });
        // rely on refetch via setChange for fresh view
        setChange(c => !c);
        setMoodDetected(prev => prev ? { ...prev, savedTaskId: "saved-server", status: "added" } : prev);
        toast.success("Mood added to tasks (server).");
        return;
      }
    } catch (err) {
      console.warn("Api.createTask failed during auto-add:", err);
    }

    // local fallback
    const localTask = {
      _id: detected.localId,
      title: payload.title,
      desc: payload.desc,
      date: payload.date,
      isAdminGenerated: false,
      isCompleted: false
    };
    setPending(prev => [localTask, ...prev]);
    setMoodDetected(prev => prev ? { ...prev, savedTaskId: localTask._id, status: "added" } : prev);
    toast.info("Mood added locally (not synced).");
  };

  // user-triggered add (keeps parity with UI buttons; not usually used because of auto-add)
  const addMoodTask = async () => {
    if (!moodDetected) {
      toast.warn("");
      return;
    }
    await addMoodTaskAuto(moodDetected);
  };

  const completeMoodTask = async () => {
    if (!moodDetected) return;
    const savedId = moodDetected.savedTaskId;

    if (savedId && savedId !== moodDetected.localId && savedId !== "saved-server" && Api && Api.setTaskStatus && user) {
      try {
        await Api.setTaskStatus({ email: user.email, id: savedId });
        setChange(c => !c);
        setMoodDetected(prev => prev ? { ...prev, status: "completed" } : prev);
        toast.success("Mood task completed (server).");
        return;
      } catch (err) {
        console.warn("complete server mood task failed:", err);
      }
    }

    // local fallback
    setPending(prev => {
      const remaining = prev.filter(t => t._id !== savedId);
      const completedTask = prev.find(t => t._id === savedId);
      if (completedTask) {
        completedTask.isCompleted = true;
        setCompleted(prevC => [completedTask, ...prevC]);
      } else {
        const ct = {
          _id: savedId || moodDetected.localId,
          title: moodDetected.emotion,
          desc: "",
          date: new Date().toISOString(),
          isCompleted: true,
          isAdminGenerated: false
        };
        setCompleted(prevC => [ct, ...prevC]);
      }
      return remaining;
    });
    setMoodDetected(prev => prev ? { ...prev, status: "completed" } : prev);
    toast.success("Mood task marked completed (local).");
  };

  const renderMoodCard = () => {
    if (!moodDetected) {
      return (
        <div className='w-[30%] min-h-[145px] rounded-xl p-4 flex items-center justify-center opacity-60'>
          
        </div>
      );
    }
    const { emotion, status } = moodDetected;
    return (
      <div style={{ boxShadow: "-8px 7px 71px 25px rgba(0,0,0,0.08)" }} className='w-[30%] min-h-[145px] relative rounded-xl text-black p-4 text-xl font-semibold flex flex-col gap-2 bg-white'>
        <div className='w-full text-left'>
          <div className='text-lg font-bold'>Mood-detected task</div>
          <div className='text-2xl mt-2'>{emotion}</div>
          <p className='text-sm font-medium opacity-60 mt-2'>{status === "added" ? "Added to tasks" : "Detected by model"}</p>
        </div>

        <div className='absolute bottom-4 left-4 !text-sm flex items-center gap-2'>
          <Button variant="contained" onClick={addMoodTask} disabled={status === "added" || status === "completed"}>
            {status === "added" ? "Added" : "Add as task"}
          </Button>
          <Button variant="outlined" onClick={completeMoodTask} disabled={status === "completed"}>
            {status === "completed" ? "Completed" : "Mark done"}
          </Button>
        </div>

        <div className='absolute bottom-4 right-4 !text-sm flex items-center justify-center gap-1 opacity-60'>
          <span><CalendarMonthIcon className='!text-[22px]' /></span>
          <span>{formatDate(moodDetected.createdOn)}</span>
        </div>
      </div>
    );
  };

  if (!userInfo || !userInfo.email) {
    return (
      <Center>
        <div className='p-6 text-center'>
          <h2 className='text-2xl font-bold'>No user logged in</h2>
          <p className='mt-2'>Please login so the task page can fetch your tasks.</p>
        </div>
      </Center>
    );
  }

  return (
    <Center>
      {loading ? (
        <div className='w-full h-screen flex items-center justify-center'>
          <CircularProgress />
        </div>
      ) : (
        <div className={`w-full ${completed.length > 0 ? "h-full" : "h-screen"} flex flex-col gap-6 p-4`}>
          <div className='w-full max-h-1/2'>
            <div className='w-full p-2 text-2xl font-bold tracking-wide flex items-center'>
              Pending Tasks <span><IconButton onClick={()=>setOpen(true)}><AddCircleRoundedIcon className='!text-3xl' /></IconButton></span>
            </div>

            <div className='mt-4 p-2 w-full h-auto flex flex-wrap items-start justify-start gap-8'>
              {renderMoodCard()}
            </div>

            {pending.length > 0 ? (
              <div className='mt-4 p-2 w-full h-[70%] overscroll-y-auto flex flex-wrap items-start justify-start gap-8'>
                {pending.map((task) => (
                  <div key={task._id} style={{ boxShadow: "-8px 7px 71px 25px rgba(0,0,0,0.1)", transition: "box-shadow 0.3s ease-in-out" }}
                    className='w-[30%] min-h-[145px] relative rounded-xl text-black p-4 text-xl font-semibold flex flex-col gap-2 cursor-pointer'>
                    <div className='w-full'>
                      {task.title}
                      <p className='text-base font-medium opacity-50'>{task.desc}</p>
                    </div>
                    {task.isAdminGenerated ? (
                      <div className='absolute bottom-0 left-0'>
                        <Tooltip arrow title="These are admin generated tasks. Failing to do these tasks will lead to decrease in your avatars health!">
                          <IconButton>
                            <InfoOutlinedIcon className='!text-3xl text-cobalt' />
                          </IconButton>
                        </Tooltip>
                      </div>) : (
                      <div className='absolute bottom-0 left-0'>
                        <Tooltip arrow title="Delete this task">
                          <IconButton onClick={() => handleDelete(task)}>
                            <DeleteIcon className='!text-3xl text-d-red' />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                    <div className='absolute top-[-35px] right-0'>
                      <Checkbox onClick={() => updateTask(task)} sx={{ '& .MuiSvgIcon-root': { fontSize: 50 } }} />
                    </div>
                    <div className='absolute bottom-4 right-4 !text-sm flex items-center justify-center gap-1 opacity-60'>
                      <span><CalendarMonthIcon className='!text-[22px]' /></span>
                      <span>{formatDate(task.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='w-full text-center mt-8 font-semibold text-lg'>No Pending Task Yet :)</div>
            )}
          </div>

          {open && <AddTaskModal open={open} handleClose={()=>setOpen(false)} user={user} setChange={setChange} change={change} />}

          <div className='w-full max-h-1/2'>
            <div className='w-full p-2 text-2xl font-bold tracking-wide flex items-center'>Completed Tasks</div>
            {completed.length > 0 ? (
              <div className='mt-4 p-2 w-full h-[70%] overscroll-y-auto flex flex-wrap items-start justify-start gap-8'>
                {completed.map((task) => (
                  <div key={task._id} style={{ boxShadow: "-8px 7px 71px 25px rgba(0,0,0,0.1)" }}
                    className='w-[30%] min-h-[145px] relative rounded-xl text-black p-4 text-xl font-semibold flex flex-col gap-2'>
                    <div className='w-full'>
                      {task.title}
                      <p className='text-base font-medium opacity-50'>{task.desc}</p>
                    </div>
                    {task.isAdminGenerated ? (
                      <div className='absolute bottom-0 left-0'>
                        <Tooltip arrow title="These are admin generated tasks. Failing to do these tasks will lead to decrease in your avatars health!">
                          <IconButton>
                            <InfoOutlinedIcon className='!text-3xl text-cobalt' />
                          </IconButton>
                        </Tooltip>
                      </div>
                    ) : (
                      <div className='absolute bottom-0 left-0'>
                        <Tooltip arrow title="Delete this task">
                          <IconButton onClick={() => handleDelete(task)}>
                            <DeleteIcon className='!text-3xl text-d-red' />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                    <div className='absolute top-[-35px] right-0'>
                      <Checkbox onClick={() => updateTask(task)} checked sx={{ '& .MuiSvgIcon-root': { fontSize: 50 } }} />
                    </div>
                    <div className='absolute bottom-4 right-4 !text-sm flex items-center justify-center gap-1 opacity-60'>
                      <span><CalendarMonthIcon className='!text-[22px]' /></span>
                      <span>{formatDate(task.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='w-full text-center mt-8 font-semibold text-lg'>No Completed Tasks :(</div>
            )}
          </div>
        </div>
      )}
    </Center>
  );
};

export default TaskPages;
