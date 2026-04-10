from flask import Flask, request, jsonify
from flask_cors import CORS
import evaluate as eval_mod
from datetime import datetime
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# -------------------------
# MongoDB Connection
# -------------------------

client = MongoClient("mongodb+srv://shreyashir32_db_user:FQVBJ3YMMhS9X3fM@cluster0.x4cqic5.mongodb.net/?appName=Cluster0")

db = client["aura"]
mood_collection = db["moods"]

# -------------------------
# Mood Map (Emotion → Score)
# -------------------------

MOOD_MAP ={
  "admiration": 5,
  "amusement": 5,
  "anger": 1,
  "annoyance": 1,
  "approval": 5,
  "caring": 4,
  "confusion": 3,
  "curiosity": 4,
  "desire": 4,
  "disappointment": 1,
  "disapproval": 1,
  "disgust": 1,
  "embarrassment": 2,
  "excitement": 5,
  "fear": 2,
  "gratitude": 5,
  "grief": 2,
  "joy": 5,
  "love": 5,
  "nervousness": 2,
  "optimism": 5,
  "pride": 5,
  "realization": 3,
  "relief": 5,
  "remorse": 2,
  "sadness": 2,
  "surprise": 3,
  "neutral": 3
}

# -------------------------
# LABEL MAP
# -------------------------

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

# -------------------------
# Templates
# -------------------------

TEMPLATES = {
    "joy":"That's wonderful — enjoy it and maybe try:",
    "sadness":"I'm sorry you're sad. A comforting small step:",
    "anger":"I'm sorry you're feeling angry. Here's something small you can try:",
    "neutral":"That's okay. Try a tiny mood boost:"
}

# -------------------------
# Helper
# -------------------------

def _get_label_entry(raw_label):

    if raw_label in LABEL_MAP:
        return raw_label, LABEL_MAP[raw_label]

    lower = raw_label.lower()

    for code, entry in LABEL_MAP.items():
        if entry["emotion"] == lower:
            return code, entry

    return "LABEL_27", LABEL_MAP["LABEL_27"]

# -------------------------
# Health Check
# -------------------------

@app.route("/api/predict", methods=["GET"])
def health():
    return jsonify({"status":"ok"})

# -------------------------
# Chatbot Endpoint
# -------------------------

@app.route("/api/predict", methods=["POST"])
def predict():

    data = request.get_json(force=True) or {}
    text = data.get("text") or ""

    if not text:
        return ("Please tell me how you feel.",200,
        {"Content-Type":"text/plain; charset=utf-8"})

    raw_output = eval_mod.predict(text)

    labels = [str(x) for x in raw_output]

    code, entry = _get_label_entry(labels[0])

    emotion = entry["emotion"]

    mood_score = MOOD_MAP.get(emotion,3)

    # Save mood to MongoDB
    mood_collection.insert_one({
        "date": datetime.now().strftime("%Y-%m-%d"),
        "emotion": emotion,
        "mood": mood_score
    })

    reply = TEMPLATES.get(emotion,"I hear you. Try this:")

    tasks = entry["tasks"][:2]

    lines = [reply]

    for t in tasks:
        lines.append(f"• {t['task']}")

    body = " ".join(lines)

    return (body,200,{"Content-Type":"text/plain; charset=utf-8"})

# -------------------------
# Mood API for Dashboard
# -------------------------

@app.route("/api/mood", methods=["GET"])
def get_mood():

    moods = list(mood_collection.find({}, {"_id":0}))

    return jsonify(moods)

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8000)