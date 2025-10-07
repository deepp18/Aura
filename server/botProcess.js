// server/botProcess.js
// Persistent Python bot process manager.
// Exports: sendToBot(payload, timeoutMs) -> Promise<response>
//          shutdownBot() -> gracefully stops child process

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration (can be overridden via env)
const PY_CMD = process.env.PYTHON_CMD || "python"; // or "python3" or full path
const BOT_PY = process.env.BOT_PY_PATH || path.join(__dirname, "..", "botserver", "run_bot.py");
const BOT_CWD = process.env.BOT_CWD || path.join(__dirname, "..", "botserver");
const DEFAULT_TIMEOUT = Number(process.env.BOT_TIMEOUT_MS) || 15000;
const MAX_PENDING = Number(process.env.BOT_MAX_PENDING) || 50;
const RESTART_BACKOFF_MS = 2000;

let child = null;
let stdoutBuffer = "";
const responders = []; // queue of { resolve, reject, timeoutId }

function spawnBot() {
  if (!fs.existsSync(BOT_PY)) {
    console.error(`[botProcess] Bot python file not found at ${BOT_PY}`);
    return;
  }

  console.log(`[botProcess] Spawning bot: ${PY_CMD} ${BOT_PY} (cwd=${BOT_CWD})`);
  child = spawn(PY_CMD, [BOT_PY], {
    stdio: ["pipe", "pipe", "inherit"], // stdin, stdout, stderr
    cwd: BOT_CWD,
  });

  child.stdin.setDefaultEncoding("utf8");
  child.stdout.setEncoding("utf8");

  child.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk;
    let newlineIndex;
    while ((newlineIndex = stdoutBuffer.indexOf("\n")) !== -1) {
      const line = stdoutBuffer.slice(0, newlineIndex).trim();
      stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1);
      if (!line) continue;
      // handle next responder
      const r = responders.shift();
      if (!r) {
        // nothing waiting -> log it for debugging
        console.warn("[botProcess] Received unrequested bot output:", line);
        continue;
      }
      clearTimeout(r.timeoutId);
      try {
        const parsed = JSON.parse(line);
        r.resolve(parsed);
      } catch (err) {
        r.reject(new Error("Invalid JSON from bot: " + err.message + " -- raw: " + line));
      }
    }
  });

  child.on("exit", (code, signal) => {
    console.error(`[botProcess] Bot process exited (code=${code}, signal=${signal}).`);
    // reject all pending responders
    while (responders.length) {
      const r = responders.shift();
      clearTimeout(r.timeoutId);
      r.reject(new Error("Bot process exited unexpectedly"));
    }
    // attempt restart after backoff
    setTimeout(() => {
      console.log("[botProcess] Restarting bot process...");
      spawnBot();
    }, RESTART_BACKOFF_MS);
  });

  child.on("error", (err) => {
    console.error("[botProcess] Bot spawn error:", err);
  });
}

// Start on module load
spawnBot();

/**
 * Send a payload (object) to the bot. Returns Promise resolved with bot's JSON response.
 * If there are too many pending requests, rejects immediately.
 * @param {Object} payload
 * @param {number} timeoutMs
 * @returns {Promise<Object>}
 */
export function sendToBot(payload, timeoutMs = DEFAULT_TIMEOUT) {
  return new Promise((resolve, reject) => {
    if (!child || child.killed) {
      return reject(new Error("Bot process is not running"));
    }
    if (responders.length >= MAX_PENDING) {
      return reject(new Error("Too many pending bot requests"));
    }

    // push resolver to queue
    const timeoutId = setTimeout(() => {
      // remove this responder if still in queue
      const idx = responders.findIndex((r) => r.timeoutId === timeoutId);
      if (idx !== -1) responders.splice(idx, 1);
      reject(new Error("Bot request timed out"));
    }, timeoutMs);

    responders.push({ resolve, reject, timeoutId });

    // write JSON payload as one line
    try {
      child.stdin.write(JSON.stringify(payload) + "\n");
    } catch (err) {
      clearTimeout(timeoutId);
      // remove responder we just pushed
      const idx = responders.findIndex((r) => r.timeoutId === timeoutId);
      if (idx !== -1) responders.splice(idx, 1);
      reject(err);
    }
  });
}

/**
 * Graceful shutdown of the bot (call on server exit)
 */
export function shutdownBot() {
  return new Promise((resolve) => {
    if (!child) return resolve();
    try {
      child.kill();
      child = null;
      resolve();
    } catch (e) {
      console.warn("[botProcess] Error while shutting down bot:", e);
      resolve();
    }
  });
}

// Ensure we kill child on process exit
process.on("exit", async () => {
  await shutdownBot();
});
process.on("SIGINT", async () => {
  await shutdownBot();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await shutdownBot();
  process.exit(0);
});
