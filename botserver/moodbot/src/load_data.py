# src/load_data.py
from datasets import load_dataset

def load_goemotions():
    dataset = load_dataset("go_emotions", "simplified")  # 20-label version
    print(dataset)
    return dataset

if __name__ == "__main__":
    load_goemotions()
