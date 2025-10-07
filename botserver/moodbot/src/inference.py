# src/inference.py
from transformers import pipeline

def predict(text):
    classifier = pipeline("text-classification", model="./model", tokenizer="./model", return_all_scores=True)
    preds = classifier(text)
    return preds

if __name__ == "__main__":
    test_text = "I am feeling very happy today!"
    predictions = predict(test_text)
    print(predictions)
