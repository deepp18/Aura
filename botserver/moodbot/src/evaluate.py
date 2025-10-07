# evaluate.py
import os
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from preprocess import preprocess_dataset
from sklearn.metrics import f1_score, classification_report

# === Configuration ===
# Path where the model/tokenizer were saved during training.
# Adjust if your model is stored elsewhere.
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model_output")

# Device selection
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Module-level placeholders for lazy-loading model & tokenizer
_model = None
_tokenizer = None
_label_map = None  # id2label mapping

def _load_model_and_tokenizer():
    global _model, _tokenizer, _label_map
    if _model is not None and _tokenizer is not None:
        return _model, _tokenizer

    # Load tokenizer and model from the directory used during training
    if not os.path.isdir(MODEL_DIR):
        raise FileNotFoundError(f"MODEL_DIR not found: {MODEL_DIR}")

    _tokenizer = BertTokenizer.from_pretrained(MODEL_DIR)
    _model = BertForSequenceClassification.from_pretrained(MODEL_DIR)
    _model.to(DEVICE)
    _model.eval()

    # try to extract id2label mapping if present in model config
    try:
        cfg = _model.config.to_dict()
        if "id2label" in cfg and isinstance(cfg["id2label"], dict):
            # model.config.id2label may be a dict mapping str(index)->label
            # convert keys to int and sort by index
            raw_map = cfg["id2label"]
            # ensure keys are ints
            label_map = {}
            for k, v in raw_map.items():
                try:
                    label_map[int(k)] = v
                except Exception:
                    # fallback if keys are not ints
                    pass
            if label_map:
                # convert to list ordered by index
                max_idx = max(label_map.keys())
                _label_map = [label_map.get(i, f"label_{i}") for i in range(max_idx + 1)]
        else:
            # try model.config.id2label attribute (some HF versions)
            try:
                cfg_map = getattr(_model.config, "id2label", None)
                if isinstance(cfg_map, dict):
                    # convert possible integer keys
                    label_map = {}
                    for k, v in cfg_map.items():
                        try:
                            label_map[int(k)] = v
                        except Exception:
                            pass
                    if label_map:
                        max_idx = max(label_map.keys())
                        _label_map = [label_map.get(i, f"label_{i}") for i in range(max_idx + 1)]
            except Exception:
                _label_map = None
    except Exception:
        _label_map = None

    # If still None, make fallback based on model.config.num_labels
    if _label_map is None:
        try:
            n = int(getattr(_model.config, "num_labels", 0) or 0)
            if n > 0:
                _label_map = [f"label_{i}" for i in range(n)]
            else:
                _label_map = None
        except Exception:
            _label_map = None

    return _model, _tokenizer

# Your original evaluation routine (keeps working)
def evaluate():
    # Load saved model + tokenizer (via loader to reuse module-level objects)
    model, tokenizer = _load_model_and_tokenizer()

    _, _, val_texts, val_labels = preprocess_dataset()

    preds, trues = [], []

    for text, label in zip(val_texts[:200], val_labels[:200]):  # limit for speed
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
        inputs = {k: v.to(DEVICE) for k, v in inputs.items()}
        with torch.no_grad():
            outputs = model(**inputs)
            # This evaluates multi-label by sigmoid (original code)
            probs = torch.sigmoid(outputs.logits).cpu().numpy()[0]
            pred = (probs >= 0.5).astype(int)  # threshold
        preds.append(pred)
        trues.append(label)

    print("F1 Score (micro):", f1_score(trues, preds, average="micro"))
    print(classification_report(trues, preds))


# === New predict() function for single-sentence inference ===
def predict(text):
    """
    Predict labels for a single input text.
    Returns a list of label strings (could be empty if no label passes threshold).
    Works for both multi-label (sigmoid) and single-label (softmax) models.
    """
    if not text:
        return []

    model, tokenizer = _load_model_and_tokenizer()

    # Tokenize and move to device
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits.detach().cpu()

    # Heuristic: if num_labels > 1 and model was trained as multi-label, original code used sigmoid.
    num_labels = getattr(model.config, "num_labels", logits.shape[-1])
    labels_out = []

    # If the model was likely trained as multi-label (original evaluate used sigmoid threshold 0.5),
    # use sigmoid + threshold to return multiple labels.
    # Otherwise (common single-label classification), use softmax top-1.
    try:
        # We'll decide: if num_labels > 1 and model.config.problem_type indicates multilabel or original code used sigmoid.
        problem_type = getattr(model.config, "problem_type", None)
    except Exception:
        problem_type = None

    if problem_type == "multi_label_classification" or num_labels > 1:
        # Use sigmoid -> multi-label prediction
        probs = torch.sigmoid(logits).numpy()[0]
        # threshold
        idxs = [int(i) for i, p in enumerate(probs) if p >= 0.5]
        if not idxs:
            # if none exceed threshold, pick top-1 as fallback
            idxs = [int(probs.argmax())]
    else:
        # single-label classification (softmax + top1)
        probs = torch.nn.functional.softmax(logits, dim=-1).numpy()[0]
        idxs = [int(probs.argmax())]

    # Map indices to label names
    if _label_map:
        labels_out = [ _label_map[i] if i < len(_label_map) else f"label_{i}" for i in idxs ]
    else:
        labels_out = [ f"label_{i}" for i in idxs ]

    return labels_out


if __name__ == "__main__":
    evaluate()
