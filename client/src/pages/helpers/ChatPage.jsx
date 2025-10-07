import React, { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";

function ChatPage({ endpoint, title }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "You", text: userInput },
    ]);

    try {
      // Send request to specified endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });
      const data = await response.json();

      // Add response to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Bot", text: data.response },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Bot", text: "Sorry, an error occurred." },
      ]);
    }
    setUserInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Paper className="w-full max-w-2xl p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          {title}
        </h2>
        <div className="flex flex-col h-80 overflow-y-auto bg-gray-50 rounded-md p-4 shadow-inner mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-2 rounded-lg ${
                msg.user === "You"
                  ? "self-end bg-blue-500 text-white text-right"
                  : "self-start bg-gray-300 text-gray-800 text-left"
              }`}
            >
              <strong className="block text-sm font-semibold">
                {msg.user}:
              </strong>
              <span className="block">{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <TextField
            variant="outlined"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow"
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            className="ml-2"
          >
            Send
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default ChatPage;
