# train_model.py
# Face Emotion Recognition Model Training Script
# -------------------------------------------------
# Author: (Your Name)
# Description: CNN model training for emotion classification using FER-2013 dataset
# -------------------------------------------------

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.model_selection import train_test_split

# -------------------------------------------------------------------
# 1. Load FER2013 dataset
# -------------------------------------------------------------------
# You can download it from: https://www.kaggle.com/datasets/msambare/fer2013
# Place the CSV file as 'fer2013.csv' in your project folder

print("[INFO] Loading dataset...")

data = pd.read_csv("fer2013.csv")
print("Dataset loaded successfully!")
print(data.head())

# -------------------------------------------------------------------
# 2. Preprocess data
# -------------------------------------------------------------------
print("[INFO] Preprocessing data...")

# Convert pixels to numpy arrays
pixels = data['pixels'].tolist()
X = []
for pixel_sequence in pixels:
    face = [int(pixel) for pixel in pixel_sequence.split(' ')]
    face = np.asarray(face).reshape(48, 48)
    X.append(face.astype('float32'))

X = np.asarray(X)
X = np.expand_dims(X, -1)  # (n, 48, 48, 1)
X = X / 255.0  # Normalize to [0,1]

# Convert emotion labels
emotion_labels = sorted(data['emotion'].unique())
y = to_categorical(data['emotion'])

# Train-test split
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print(f"Training samples: {X_train.shape[0]}")
print(f"Validation samples: {X_val.shape[0]}")

# -------------------------------------------------------------------
# 3. Image Augmentation
# -------------------------------------------------------------------
datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True,
    fill_mode="nearest"
)
datagen.fit(X_train)

# -------------------------------------------------------------------
# 4. Build CNN model
# -------------------------------------------------------------------
print("[INFO] Building model...")

model = Sequential([
    Conv2D(64, (3,3), activation='relu', input_shape=(48,48,1)),
    BatchNormalization(),
    MaxPooling2D(2,2),
    Dropout(0.25),

    Conv2D(128, (3,3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(2,2),
    Dropout(0.25),

    Conv2D(256, (3,3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(2,2),
    Dropout(0.25),

    Flatten(),
    Dense(256, activation='relu'),
    Dropout(0.5),
    Dense(7, activation='softmax')  # 7 emotion classes
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# -------------------------------------------------------------------
# 5. Training
# -------------------------------------------------------------------
print("[INFO] Starting training...")

checkpoint = ModelCheckpoint("Final_model.h5", monitor='val_accuracy', save_best_only=True, verbose=1)
earlystop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

history = model.fit(
    datagen.flow(X_train, y_train, batch_size=64),
    validation_data=(X_val, y_val),
    epochs=50,
    callbacks=[checkpoint, earlystop],
    verbose=1
)

# -------------------------------------------------------------------
# 6. Evaluation
# -------------------------------------------------------------------
print("[INFO] Evaluating model...")
val_loss, val_acc = model.evaluate(X_val, y_val)
print(f"Validation Accuracy: {val_acc*100:.2f}%")

# -------------------------------------------------------------------
# 7. Save training graphs
# -------------------------------------------------------------------
plt.figure(figsize=(10,5))
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title("Model Accuracy over Epochs")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend()
plt.savefig("accuracy_plot.png")

plt.figure(figsize=(10,5))
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title("Model Loss over Epochs")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.legend()
plt.savefig("loss_plot.png")

print("[INFO] Training complete! Model saved as 'Final_model.h5'")
