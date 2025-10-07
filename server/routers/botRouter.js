// server/routers/botRouter.js
import express from "express";
import { sendToBot } from "../botProcess.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ success: false, error: "Missing message" });
    const payload = { message, userId };
    const botResp = await sendToBot(payload, 15000); // 15s timeout
    return res.json({ success: true, reply: botResp.reply, emotions: botResp.emotions });
  } catch (err) {
    console.error("Bot error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
