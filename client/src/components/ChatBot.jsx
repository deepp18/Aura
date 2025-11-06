// src/components/StaggeredDropDown.jsx
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BotOpen, isbotOpen } from "../redux/features/llmslice";
import { motion } from "framer-motion";
import { Divider, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AiFillRobot } from "react-icons/ai";
import { RiRobot2Fill } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import Markdown from "react-markdown";
import Api from "../api";

// ✅ Ask backend for JSON (so we can read emotion + tasks)
const BACKEND_URL = "http://localhost:8000/api/predict?format=json";

const StaggeredDropDown = () => {
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isBotOpen = useSelector(isbotOpen);
  const scrollingRef = useRef(null);

  const toggleBot = () => dispatch(BotOpen.actions.togglebot());

  useEffect(() => {
    if (scrollingRef.current)
      scrollingRef.current.scrollTop = scrollingRef.current.scrollHeight;
  }, [msgList, isBotOpen]);

  const addMessage = (msgObj) => setMsgList((prev) => [...prev, msgObj]);

  // --- helpers: user + emotion utils ---
  const getUserEmail = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.email || "";
    } catch {
      return "";
    }
  };

  const titleCase = (s) => {
    if (!s || typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  // Fallback: infer emotion from bot reply if backend didn't include it
  const inferEmotionFromReply = (reply = "") => {
    const r = reply.toLowerCase();
    if (r.includes("angry")) return "anger";
    if (r.includes("annoy")) return "annoyance";
    if (r.includes("afraid") || r.includes("fear")) return "fear";
    if (r.includes("nervous")) return "nervousness";
    if (r.includes("grateful") || r.includes("gratitude")) return "gratitude";
    if (r.includes("sad")) return "sadness";
    if (r.includes("joy") || r.includes("happy")) return "joy";
    if (r.includes("love")) return "love";
    if (r.includes("curious")) return "curiosity";
    if (r.includes("excite")) return "excitement";
    if (r.includes("approve")) return "approval";
    if (r.includes("remorse") || r.includes("sorry for")) return "remorse";
    if (r.includes("relief") || r.includes("relieved")) return "relief";
    if (r.includes("optimistic") || r.includes("hopeful")) return "optimism";
    if (r.includes("proud")) return "pride";
    if (r.includes("admire")) return "admiration";
    if (r.includes("disgust")) return "disgust";
    if (r.includes("disappoint")) return "disappointment";
    if (r.includes("confus")) return "confusion";
    if (r.includes("realiz")) return "realization";
    if (r.includes("surprise") || r.includes("surprised")) return "surprise";
    if (r.includes("desire") || r.includes("want")) return "desire";
    if (r.includes("care") || r.includes("kind")) return "caring";
    return "neutral";
  };

  // Parse bullets from legacy single-line bot text (if needed)
  const parseTasksFromPlain = (text, emotion = "neutral") => {
    const matches = Array.from(text.matchAll(/•\s+([^•]+)/g))
      .map((m) => (m[1] || "").trim())
      .filter(Boolean);
    const now = new Date().toISOString();
    const emo = titleCase(emotion);
    return matches.map((title) => ({
      title,
      desc: `Auto from mood: ${emo}`,
      isCompleted: false,
      isAdminGenerated: true,
      date: now,
    }));
  };

  const sendMessage = async () => {
    if (!msg.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    const userMsg = msg.trim();
    addMessage({ msg: userMsg, type: "user" });
    setMsg("");
    setLoading(true);

    try {
      // 1) call mood backend (JSON)
      const res = await axios.post(
        BACKEND_URL,
        { text: userMsg },
        { headers: { Accept: "application/json" } }
      );
      const data = res.data;

      const reply =
        data?.reply ||
        data?.message ||
        (typeof data === "string" ? data : JSON.stringify(data));

      addMessage({ msg: reply, type: "bot" });

      // 2) decide emotion (prefer backend, else infer)
      const emotionRaw = data?.emotion || inferEmotionFromReply(reply);
      const emotionPretty = titleCase(emotionRaw || "neutral");

      // 3) pick up tasks (prefer JSON tasks; else parse bullets)
      let tasks = Array.isArray(data?.tasks) ? data.tasks : [];
      if (!tasks.length && typeof reply === "string") {
        tasks = parseTasksFromPlain(reply, emotionRaw);
      }

      // 4) save tasks for current user (force desc = "Auto from mood: X")
      const email = getUserEmail();
      if (!email) {
        console.warn("No user email found; cannot save tasks.");
      } else {
        for (const task of tasks) {
          const safeTask = {
            title: task.title || task.task || "Suggested task",
            desc: `Complete your task today itself for maximum reward `, 
            mood: emotionPretty, // << always from here
            isCompleted: false,
            isAdminGenerated:
              typeof task.isAdminGenerated === "boolean"
                ? task.isAdminGenerated
                : true,
            date: task.date || new Date().toISOString(),
          };
          await Api.addTask({ email, task: safeTask });
        }

        if (tasks.length) {
          // 5) notify Tasks page to refresh
          localStorage.setItem("tasksRefreshTick", String(Date.now()));
        }
      }
    } catch (err) {
      console.error(err);
      addMessage({
        msg: `Error: ${err?.response?.data?.error || err.message}`,
        type: "bot",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <motion.div
        initial="closed"
        animate={isBotOpen ? "open" : "closed"}
        className="pointer-events-none"
      >
        <motion.ul
          variants={panelVariants}
          style={{ originY: 0.5, originX: 0.5 }}
          className="flex flex-col gap-2 p-2 rounded-2xl bg-white shadow-xl fixed right-1 bottom-6 w-[20rem] overflow-hidden pointer-events-auto"
        >
          <div className="w-full h-full flex flex-col gap-2">
            <Option
              Icon={<AiFillRobot style={{ fontSize: 25, color: "black" }} />}
              text="Chat Bot"
            />
            <Divider />
            <div className="h-[300px] overflow-y-auto" ref={scrollingRef}>
              <div className="flex flex-col gap-2 h-full p-2">
                {msgList.map((m, i) => (
                  <div
                    key={i}
                    className={`${m.type === "user" ? "self-end" : "self-start"} w-[70%]`}
                  >
                    <div
                      className={`border rounded-2xl flex flex-col items-start justify-center p-2.5 break-words ${
                        m.type === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      <div
                        className={`font-bold text-xs ${
                          m.type === "user" ? "text-indigo-100" : "text-teal-300"
                        }`}
                      >
                        {m.type === "user" ? "You" : "Chatbot"}
                      </div>
                      <Markdown>{m.msg}</Markdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Divider />
            <motion.li
              variants={itemVariants}
              className="flex items-center justify-between gap-2 w-full p-2 font-bold rounded-2xl text-slate-700"
            >
              <TextField
                variant="outlined"
                label="Type a message"
                fullWidth
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                InputProps={{ style: { borderRadius: 16 } }}
              />
              <IconButton onClick={sendMessage} disabled={loading} className="rounded-2xl">
                <SendIcon style={{ fontSize: 25, color: "black" }} />
              </IconButton>
            </motion.li>
          </div>
        </motion.ul>

        <motion.button
          onClick={toggleBot}
          variants={iconParentVariants}
          animate={isBotOpen ? "open" : "closed"}
          className="flex items-center gap-2 w-16 h-16 justify-center p-4 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-colors fixed left-6 bottom-6 shadow-lg pointer-events-auto"
        >
          <motion.span variants={iconVariants}>
            <RiRobot2Fill style={{ fontSize: 30, color: "white" }} />
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
};

const Option = ({ text, Icon }) => (
  <motion.li variants={itemVariants} className="flex items-center gap-2 w-full p-2 font-bold text-yello">
    {Icon}
    <span className="text-xl">{text}</span>
  </motion.li>
);

export default StaggeredDropDown;

/* ==========================
   Animation / Variants
   ========================== */
const CLOSED_Y = 200;

const panelVariants = {
  closed: { scale: 0.8, y: CLOSED_Y, opacity: 0, transition: { type: "spring", stiffness: 500, damping: 40 } },
  open: { scale: 1, y: 0, opacity: 1, transition: { type: "spring", stiffness: 140, damping: 22, mass: 0.8, delay: 0.1 } },
};

const iconParentVariants = {
  closed: { scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
  open: { scale: 1.02, transition: { yoyo: Infinity, duration: 0.8 } },
};

const iconVariants = { open: { rotate: 180 }, closed: { rotate: 0 } };

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
  closed: { opacity: 0, y: -10, transition: { when: "afterChildren" } },
};
