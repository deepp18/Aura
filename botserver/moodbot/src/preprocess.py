import numpy as np

def preprocess_dataset(dataset):
    """
    Preprocess GoEmotions dataset into train/val texts and multi-hot label arrays.
    """

    # Splits
    train_data = dataset["train"]
    val_data = dataset["validation"]

    # Texts
    train_texts = train_data["text"]
    val_texts = val_data["text"]

    # Number of emotion classes in GoEmotions
    num_labels = 28  # (27 emotions + neutral)

    # Convert list of label indices -> multi-hot vectors
    def to_multi_hot(label_list, num_classes=num_labels):
        multi_hot = np.zeros(num_classes, dtype=int)
        for idx in label_list:
            multi_hot[idx] = 1
        return multi_hot

    train_labels = np.array([to_multi_hot(labels) for labels in train_data["labels"]])
    val_labels = np.array([to_multi_hot(labels) for labels in val_data["labels"]])

    return train_texts, train_labels, val_texts, val_labels
