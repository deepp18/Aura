# botserver/mood_adapter.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import evaluate as eval_mod   # assumes evaluate.py is in same folder or PYTHONPATH

# Flask app setup
app = Flask(__name__)
CORS(app)  # dev: allow frontend to call the adapter (tighten for production)

# Label mapping (GoEmotions 28-label version)
LABEL_MAP =  {
  "LABEL_0": "admiration",
  "LABEL_1": "amusement",
  "LABEL_2": "anger",
  "LABEL_3": "annoyance",
  "LABEL_4": "approval",
  "LABEL_5": "caring",
  "LABEL_6": "confusion",
  "LABEL_7": "curiosity",
  "LABEL_8": "desire",
  "LABEL_9": "disappointment",
  "LABEL_10": "disapproval",
  "LABEL_11": "disgust",
  "LABEL_12": "embarrassment",
  "LABEL_13": "excitement",
  "LABEL_14": "fear",
  "LABEL_15": "gratitude",
  "LABEL_16": "grief",
  "LABEL_17": "joy",
  "LABEL_18": "love",
  "LABEL_19": "nervousness",
  "LABEL_20": "optimism",
  "LABEL_21": "pride",
  "LABEL_22": "realization",
  "LABEL_23": "relief",
  "LABEL_24": "remorse",
  "LABEL_25": "sadness",
  "LABEL_26": "surprise",
  "LABEL_27": "neutral"
}




@app.route("/api/predict", methods=["GET"])
def health():
    """Simple health check."""
    return jsonify({"status": "ok", "backend": "evaluate.predict"})

@app.route("/api/predict", methods=["POST"])
def predict():
    """Receive text → run model → return readable emotion names."""
    data = request.get_json(force=True)
    text = data.get("text") or data.get("message") or ""
    if not text:
        return jsonify({"error": "no text provided"}), 400

    try:
        raw_output = eval_mod.predict(text)

        # Handle various possible return formats from evaluate.py
        readable = []
        if isinstance(raw_output, list):
            for item in raw_output:
                if isinstance(item, str):
                    # e.g., ["LABEL_19", "LABEL_25"]
                    readable.append(LABEL_MAP.get(item, item))
                elif isinstance(item, dict) and "label" in item:
                    # e.g., [{"label": "LABEL_19", "score": 0.85}]
                    readable.append(LABEL_MAP.get(item["label"], item["label"]))
                else:
                    readable.append(str(item))
        else:
            # fallback if single string or dict
            if isinstance(raw_output, str):
                readable = [LABEL_MAP.get(raw_output, raw_output)]
            elif isinstance(raw_output, dict) and "label" in raw_output:
                readable = [LABEL_MAP.get(raw_output["label"], raw_output["label"])]
            else:
                readable = [str(raw_output)]

        return jsonify({"emotions": readable})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # change port if you already use 8000
    app.run(host="0.0.0.0", port=8000)
