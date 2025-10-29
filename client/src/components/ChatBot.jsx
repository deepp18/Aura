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

const BACKEND_URL = "http://localhost:8000/api/predict";

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
      const res = await axios.post(BACKEND_URL, { text: userMsg });
      const data = res.data;
      let reply = "";

      if (data?.emotions && Array.isArray(data.emotions)) {
        reply = ` ${data.emotions.join(", ")}`;
      } else if (data?.message) {
        reply = data.message;
      } else {
        reply = JSON.stringify(data);
      } 
      addMessage({ msg: reply, type: "bot" });
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
      {/* Controller: toggles between "closed" and "open" */}
      <motion.div
        initial="closed"
        animate={isBotOpen ? "open" : "closed"}
        className="pointer-events-none"
      >
        {/*
          PANEL
          - Final position: fixed at bottom-right (right-6 bottom-6)
          - closed state: starts off-screen (bottom-left area) and scales/ fades in to final
        */}
        <motion.ul
          variants={panelVariants}
          style={{ originY: 0.5, originX: 0.5 }}
          className="flex flex-col gap-2 p-2 rounded-2xl bg-white shadow-xl fixed right-1 bottom-6 w-[20rem] overflow-hidden pointer-events-auto"
        >
          <div className="w-full h-full flex flex-col gap-2">
            <Option
              Icon={<AiFillRobot style={{ fontSize: 25, color: "black"}} />}
              text="Chat Bot"
            />
            <Divider />
            <div className="h-[300px] overflow-y-auto" ref={scrollingRef}>
              <div className="flex flex-col gap-2 h-full p-2">
                {msgList.map((m, i) => (
                  <div
  key={i}
  className={`${
    m.type === "user" ? "self-end" : "self-start"
  } w-[70%]`}
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

        {/* Floating Icon (keeps its original left-bottom spot). */}
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
  <motion.li
    variants={itemVariants}
    className="flex items-center gap-2 w-full p-2 font-bold text-yello"
  >
    {Icon}
    <span className="text-xl">{text}</span>
  </motion.li>
);

export default StaggeredDropDown;

/* ==========================
   Animation / Variants
   ==========================
   We animate the panel from the bottom-left off-screen into the final
   bottom-right fixed position. Tweak CLOSED_X / CLOSED_Y if you want
   the start point closer/further from the screen corner.
*/


const CLOSED_Y = 200; // how far below screen it starts (increase for more distance)

const panelVariants = {
  closed: {
    scale: 0.8,
    y: CLOSED_Y,
    opacity: 0,
    transition: { type: "spring", stiffness: 500, damping: 40 },
  },
  open: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 140, damping: 22, mass: 0.8,delay:0.1 },
  },
};


const iconParentVariants = {
  closed: { scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
  open: {
    scale: 1.02,
    transition: { yoyo: Infinity, duration: 0.8 },
  }, // subtle pulse while open
};

const iconVariants = { open: { rotate: 180 }, closed: { rotate: 0 } };

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.06 },
  },
  closed: { opacity: 0, y: -10, transition: { when: "afterChildren" } },
};  