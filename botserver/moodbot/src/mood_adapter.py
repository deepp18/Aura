
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import evaluate as eval_mod   # assumes evaluate.py is in same folder or PYTHONPATH

# Flask app setup
app = Flask(__name__)
CORS(app)

# --- LABEL_MAP (unchanged) ---
LABEL_MAP = {
  "LABEL_0": {"emotion": "admiration", "tasks": [{"task": "Write one thing or person you admire and why.", "points": 5}, {"task": "Send a quick compliment or appreciation message.", "points": 4}]},
  "LABEL_1": {"emotion": "amusement", "tasks": [{"task": "Watch a short funny clip or meme.", "points": 3}, {"task": "Share a light-hearted joke with a friend.", "points": 2}]},
  "LABEL_2": {"emotion": "anger", "tasks": [{"task": "Take 3 deep breaths and count slowly to 10.", "points": 3}, {"task": "Go for a 5-minute walk to cool down.", "points": 4}]},
  "LABEL_3": {"emotion": "annoyance", "tasks": [{"task": "Take a short break and stretch for 2 minutes.", "points": 2}, {"task": "Identify what’s annoying you and fix one small thing.", "points": 3}]},
  "LABEL_4": {"emotion": "approval", "tasks": [{"task": "Give positive feedback to someone you agree with.", "points": 3}, {"task": "Note one reason why you approve of this thing.", "points": 2}]},
  "LABEL_5": {"emotion": "caring", "tasks": [{"task": "Send a kind check-in message to someone.", "points": 4}, {"task": "Do one small act of kindness today.", "points": 5}]},
  "LABEL_6": {"emotion": "confusion", "tasks": [{"task": "Write down one question that could clear your confusion.", "points": 3}, {"task": "Look up or ask someone for a quick answer.", "points": 4}]},
  "LABEL_7": {"emotion": "curiosity", "tasks": [{"task": "Spend 5 minutes reading about the topic that interests you.", "points": 5}, {"task": "Write two new questions to explore later.", "points": 4}]},
  "LABEL_8": {"emotion": "desire", "tasks": [{"task": "Write what you want in one clear sentence.", "points": 4}, {"task": "Decide one small step you can take toward it today.", "points": 5}]},
  "LABEL_9": {"emotion": "disappointment", "tasks": [{"task": "Write one thing that didn’t go as planned and what you learned.", "points": 4}, {"task": "Do one comforting thing for yourself (tea, rest, or walk).", "points": 5}]},
  "LABEL_10": {"emotion": "disapproval", "tasks": [{"task": "Write a calm and respectful version of your opinion.", "points": 3}, {"task": "Pause for 5 minutes before reacting to someone.", "points": 3}]},
  "LABEL_11": {"emotion": "disgust", "tasks": [{"task": "Step away and take a deep breath for 1 minute.", "points": 2}, {"task": "Do a quick physical reset (wash hands or open window).", "points": 3}]},
  "LABEL_12": {"emotion": "embarrassment", "tasks": [{"task": "Write what happened and how you’d tell it kindly to a friend.", "points": 4}, {"task": "Distract yourself with a 5-minute break or music.", "points": 3}]},
  "LABEL_13": {"emotion": "excitement", "tasks": [{"task": "Write one next step to use your excitement productively.", "points": 5}, {"task": "Celebrate your good mood for a minute.", "points": 3}]},
  "LABEL_14": {"emotion": "fear", "tasks": [{"task": "Write one fact you know that makes you feel safer.", "points": 4}, {"task": "Try a 2-minute slow breathing exercise (inhale 4s, exhale 6s).", "points": 4}]},
  "LABEL_15": {"emotion": "gratitude", "tasks": [{"task": "List three things you’re grateful for right now.", "points": 4}, {"task": "Send a thank-you message to someone who helped you.", "points": 5}]},
  "LABEL_16": {"emotion": "grief", "tasks": [{"task": "Take 5 minutes to sit with your feelings and write one sentence about it.", "points": 4}, {"task": "Reach out to someone you trust and share how you feel.", "points": 6}]},
  "LABEL_17": {"emotion": "joy", "tasks": [{"task": "Write one line about what made you happy today.", "points": 4}, {"task": "Share that moment with someone close to you.", "points": 3}]},
  "LABEL_18": {"emotion": "love", "tasks": [{"task": "Send one kind or loving message to someone special.", "points": 5}, {"task": "Plan one small thoughtful gesture for someone you care about.", "points": 5}]},
  "LABEL_19": {"emotion": "nervousness", "tasks": [{"task": "Do a 2-minute grounding exercise (focus on your senses).", "points": 3}, {"task": "Prepare or practice the thing you’re nervous about for 5 minutes.", "points": 5}]},
  "LABEL_20": {"emotion": "optimism", "tasks": [{"task": "Write one goal you’re excited to work toward.", "points": 4}, {"task": "List two reasons you believe it will go well.", "points": 4}]},
  "LABEL_21": {"emotion": "pride", "tasks": [{"task": "Write down what you accomplished and how you feel about it.", "points": 5}, {"task": "Share your win with someone who supported you.", "points": 4}]},
  "LABEL_22": {"emotion": "realization", "tasks": [{"task": "Summarize your insight in one sentence.", "points": 4}, {"task": "Write one small action you’ll take because of it.", "points": 4}]},
  "LABEL_23": {"emotion": "relief", "tasks": [{"task": "Write one line about what changed or improved.", "points": 3}, {"task": "Take a short break or stretch to relax fully.", "points": 3}]},
  "LABEL_24": {"emotion": "remorse", "tasks": [{"task": "If possible, plan a sincere way to make things right.", "points": 5}, {"task": "Write one kind line to forgive yourself and move forward.", "points": 5}]},
  "LABEL_25": {"emotion": "sadness", "tasks": [{"task": "Do something comforting (rest, tea, calm music).", "points": 5}, {"task": "Reach out to a trusted person and share how you feel.", "points": 6}]},
  "LABEL_26": {"emotion": "surprise", "tasks": [{"task": "Write one sentence about what surprised you.", "points": 3}, {"task": "Think if there’s any action or lesson to take from it.", "points": 4}]},
  "LABEL_27": {"emotion": "neutral", "tasks": [{"task": "Pick one simple activity you enjoy and do it for 10 minutes.", "points": 4}, {"task": "Write one line about how you’d like to feel today.", "points": 3}]}
}

# --- TEMPLATES (unchanged) ---
TEMPLATES = {
    "admiration": "That's lovely — sounds inspiring. Here's something small you can try:",
    "amusement": "Haha — nice! Keep that lightness going with:",
    "anger": "I'm sorry you're feeling angry. Here's something small you can try right now:",
    "annoyance": "That sounds annoying. Try one of these small fixes:",
    "approval": "Nice — you approve. To reinforce that, you could:",
    "caring": "That's kind — a small caring action you can do now:",
    "confusion": "I get that — confusion is frustrating. These might help:",
    "curiosity": "Great — curious minds are powerful. Try this:",
    "desire": "That's a clear want — here are two small steps you can take:",
    "disappointment": "Sorry that happened. A small comfort or reflection you can try:",
    "disapproval": "I hear you. If you want to respond calmly, try:",
    "disgust": "That sounds unpleasant. A short reset you could do:",
    "embarrassment": "Awkward moments happen. These tiny moves help:",
    "excitement": "Love the energy — use it with a quick step:",
    "fear": "I'm sorry you feel afraid. A short grounding step:",
    "gratitude": "That's wonderful. You could strengthen it by:",
    "grief": "I'm really sorry — gentle care might help right now:",
    "joy": "That's wonderful — enjoy it and maybe try:",
    "love": "That's warm. A small gesture you could make:",
    "nervousness": "Nervousness is normal. Try this quick prep or grounding:",
    "optimism": "Great to feel hopeful. One small planning step:",
    "pride": "Well done — celebrate this with:",
    "realization": "Nice insight. A small action to lock it in:",
    "relief": "I'm glad that's eased. Something small to consolidate it:",
    "remorse": "I hear you. A careful repair step you can take:",
    "sadness": "I'm sorry you're sad. A comforting small step:",
    "surprise": "Oh — that surprised you. A quick note and decision:",
    "neutral": "Feeling neutral is fine. Try a tiny mood boost:"
}

# Helper
def _get_label_entry(raw_label):
    if isinstance(raw_label, str) and raw_label.startswith("LABEL_") and raw_label in LABEL_MAP:
        return raw_label, LABEL_MAP[raw_label]
    if isinstance(raw_label, str):
        lower = raw_label.lower()
        for code, entry in LABEL_MAP.items():
            if entry.get("emotion") == lower:
                return code, entry
    return None, None

@app.route("/api/predict", methods=["GET"])
def health():
    # keep JSON for the health check
    return jsonify({"status": "ok", "backend": "evaluate.predict"})

@app.route("/api/predict", methods=["POST"])
def predict():
    # ALWAYS return plain text (chat-friendly)
    data = request.get_json(force=True) or {}
    text = data.get("text") or data.get("message") or ""

    if not text:
        return ("Please tell me how you feel.", 200, {"Content-Type": "text/plain; charset=utf-8"})

    try:
        raw_output = eval_mod.predict(text)

        # Normalize to a list of labels/strings
        if isinstance(raw_output, list):
            labels = [(it["label"] if isinstance(it, dict) and "label" in it else str(it)) for it in raw_output]
        elif isinstance(raw_output, dict) and "label" in raw_output:
            labels = [raw_output["label"]]
        else:
            labels = [str(raw_output)]

        # Find first matching entry
        primary_code, primary_entry = None, None
        for lbl in labels:
            primary_code, primary_entry = _get_label_entry(lbl)
            if primary_entry: break
        if not primary_entry:
            for lbl in labels:
                primary_code, primary_entry = _get_label_entry(lbl.lower())
                if primary_entry: break
        if not primary_entry:
            primary_code, primary_entry = "LABEL_27", LABEL_MAP["LABEL_27"]

        emotion = primary_entry.get("emotion", "neutral")
        reply = TEMPLATES.get(emotion, "I hear you. Here are a couple of small things you can try:")
        tasks = primary_entry.get("tasks", [])[:2]

        # Compose plain, human-friendly text
                # Compose plain, human-friendly text with real newlines
        lines = [reply]
        for t in tasks:
            lines.append(f"• {t['task']}")

        # Join lines using real newline characters, but user asked to avoid \n output;
        # we will join with a single space so text appears as one line in frontends that render literally.
        body = " ".join(lines)

        # Ensure Flask sends plain text without JSON escaping
        return (body, 200, {"Content-Type": "text/plain; charset=utf-8"})


    except Exception as e:
        return (f"Sorry, something went wrong: {e}", 500, {"Content-Type": "text/plain; charset=utf-8"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)