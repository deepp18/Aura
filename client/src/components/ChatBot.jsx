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

const BACKEND_URL = "http://localhost:8000/api/predict"; // your Flask backend

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
        reply = `Detected: ${data.emotions.join(", ")}`;
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
    <div className="flex items-center justify-center">
      <motion.div animate={isBotOpen ? "open" : "closed"} className="relative">
        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "bottom", translateX: "-50%" }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute bottom-[120%] left-[-100px] w-[20rem] overflow-hidden"
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
                    <div className="border rounded-xl flex flex-col items-start justify-center p-2.5 break-words">
                      <div
                        className={`${
                          m.type === "user" ? "text-blue-700" : "text-slate-700"
                        } font-bold text-xs`}
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
              className="flex items-center justify-between gap-2 w-full p-2 font-bold rounded-md text-slate-700"
            >
              <TextField
                variant="outlined"
                label="Type a message"
                fullWidth
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <IconButton onClick={sendMessage} disabled={loading}>
                <SendIcon style={{ fontSize: 25, color: "black" }} />
              </IconButton>
            </motion.li>
          </div>
        </motion.ul>
        <button
          onClick={toggleBot}
          className="flex items-center gap-2 w-16 h-16 justify-center p-4 rounded-full text-indigo-50 bg-indigo-500 hover:bg-indigo-600 transition-colors fixed left-6 bottom-6 shadow-lg"
        >
          <motion.span variants={iconVariants}>
            <RiRobot2Fill style={{ fontSize: 30, color: "white" }} />
          </motion.span>
        </button>
      </motion.div>
    </div>
  );
};

const Option = ({ text, Icon }) => (
  <motion.li
    variants={itemVariants}
    className="flex items-center gap-2 w-full p-2 font-bold text-slate-700"
  >
    {Icon}
    <span className="text-xl">{text}</span>
  </motion.li>
);

export default StaggeredDropDown;

const wrapperVariants = {
  open: { scaleY: 1, transition: { when: "beforeChildren", staggerChildren: 0.1 } },
  closed: { scaleY: 0, transition: { when: "afterChildren", staggerChildren: 0.1 } },
};
const iconVariants = { open: { rotate: 180 }, closed: { rotate: 0 } };
const itemVariants = {
  open: { opacity: 1, y: 0, transition: { when: "beforeChildren" } },
  closed: { opacity: 0, y: -15, transition: { when: "afterChildren" } },
};
