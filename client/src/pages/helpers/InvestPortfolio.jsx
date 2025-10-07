import React, { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import DotLoader from "../../components/DotLoader";
import axios from "axios";
import Markdown from "https://esm.sh/react-markdown@9";

function App() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "You", text: userInput },
    ]);
    setUserInput("");
    setChatLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5002/chat-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "FinaBot", text: data.response },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "FinaBot", text: "Sorry, an error occurred." },
      ]);
    }
    setChatLoading(false);
  };

  return (
    <div className="flex flex-col h-[90vh] overflow-y-scroll items-center pb-24">
      {messages.length > 0 ? (
        <div className="w-[80%] flex flex-col items-start">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-2 rounded-lg min-w-40 max-w-[50%] w-fit text-justify ${
                msg.user === "You"
                  ? "!self-end bg-blue-500 text-white text-right"
                  : "!self-start bg-gray-300 text-gray-800 text-left"
              }`}
            >
              <strong className="block text-sm font-semibold">
                {msg.user}:
              </strong>
              <span className="block">
                <Markdown>{msg.text}</Markdown>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full select-none absolute z-0 text-center top-[40%] font-black text-6xl text-black text-opacity-50">
          WHAT'S ON YOUR MIND?
        </div>
      )}
      <div className="w-[80%] bg-white flex items-end justify-center absolute bottom-10 !rounded-md">
        <div className="absolute top-[-30px] left-6">
          {chatLoading && <DotLoader />}
          {/* <DotLoader /> */}
        </div>
        <Textarea
          variant="plain"
          // type="text"
          className="w-full z-10 font-black !text-2xl !p-2 text-black relative !rounded-md"
          sx={{
            maxHeight: "250px",
            width: "100%",
            outline: "none",
            backgroundColor: "#ffffff",
            // color: "white" : "dark-purple",
            border: "none",
            resize: "none",
            outline: "none !important",
            "&::before": {
              border: "1.5px solid #eeeeee",
              transform: "scaleX(0)",
              left: "2.5px",
              right: "2.5px",
              bottom: 0,
              top: "unset",
              transition: "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
              borderRadius: 0,
              borderBottomLeftRadius: "64px 20px",
              borderBottomRightRadius: "64px 20px",
            },
            "&:focus-within::before": {
              transform: "scaleX(1)",
            },
            "&::placeholder": {
              color: "#c43ff8",
            },
          }}
          placeholder="Type here..."
          minRows={1}
          maxRows={6}
          size="md"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <IconButton
          disabled={!userInput.trim() || chatLoading}
          onClick={sendMessage}
          className="absolute !h-12 !bg-blue-500 w-16 !text-white hover:!bg-blue-600 !rounded-md"
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default App;
