// src/components/MoodChat.jsx
import React, { useState } from 'react';
import Api from '../api';

const MoodChat = ({ userEmail }) => {
  const [input, setInput] = useState('');
  const [lastReply, setLastReply] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    // Ask mood bot for JSON
    const res = await fetch('/api/predict?format=json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        text: input,
        // (optional) if your backend can auto-create tasks, include these:
        // email: userEmail,
        // auto_create: true
      })
    });

    const data = await res.json();
    setLastReply(data?.reply || '');

    // Create tasks on this user (frontend-driven, works with your existing Api)
    const tasks = Array.isArray(data?.tasks) ? data.tasks : [];
    for (const task of tasks) {
      await Api.addTask({ email: userEmail, task });
    }

    // Tell TaskPages to refresh
    localStorage.setItem('tasksRefreshTick', String(Date.now()));
    setInput('');
  };

  return (
    <div className="p-4 rounded-xl glass-card">
      <h3 className="text-white font-semibold mb-2">Mood Check</h3>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded px-3 py-2 bg-white/10 text-white outline-none"
          placeholder="Tell me how you're feeling..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="px-4 py-2 rounded bg-white/20 text-white" onClick={handleSend}>
          Send
        </button>
      </div>
      {lastReply && <div className="text-white/80 mt-3">{lastReply}</div>}
    </div>
  );
};

export default MoodChat;
