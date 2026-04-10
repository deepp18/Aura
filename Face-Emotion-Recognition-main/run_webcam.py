import argparse
import time
import cv2
import numpy as np
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

EMOTION_LABELS = ["Angry","Disgust","Fear","Happy","Neutral","Sad","Surprise"]

# 🔥 Get correct path automatically
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "Final_model.h5")

def load_assets(model_path: str):
    print("[INFO] loading model and face detector...")
    model = load_model(model_path)

    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    if cascade.empty():
        raise RuntimeError("Failed to load Haar cascade.")

    return model, cascade

def predict_face(model, gray_frame, face_box):
    (x, y, w, h) = face_box

    roi = gray_frame[y:y+h, x:x+w]
    roi = cv2.resize(roi, (48, 48))
    roi = roi.astype("float32") / 255.0
    roi = img_to_array(roi)
    roi = np.expand_dims(roi, axis=0)

    probs = model.predict(roi, verbose=0)[0]
    idx = int(np.argmax(probs))

    return EMOTION_LABELS[idx], probs

def draw_label(frame, box, label):
    (x, y, w, h) = box

    cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,0), 2)

    cv2.putText(
        frame,
        label,
        (x, max(0, y-10)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0,255,0),
        2,
        cv2.LINE_AA
    )

    return frame

def main():
    ap = argparse.ArgumentParser()

    # ✅ FIXED: no indentation issue + correct path
    ap.add_argument("--model", default=MODEL_PATH)
    ap.add_argument("--camera", type=int, default=0)
    ap.add_argument("--min-neighbors", type=int, default=5)
    ap.add_argument("--scale", type=float, default=1.3)

    args = ap.parse_args()

    model, face_cascade = load_assets(args.model)

    cap = cv2.VideoCapture(args.camera, cv2.CAP_DSHOW)

    if not cap.isOpened():
        raise RuntimeError("Could not open webcam.")

    print("[INFO] Press 'q' to quit.")

    fps_time = time.time()
    frames = 0
    final_emotion = "No face detected"

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                print("[WARN] frame grab failed")
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            faces = face_cascade.detectMultiScale(
                gray,
                scaleFactor=args.scale,
                minNeighbors=args.min_neighbors
            )

            if len(faces) > 0:
                faces = sorted(faces, key=lambda b: b[2]*b[3], reverse=True)
                label, _ = predict_face(model, gray, faces[0])
                final_emotion = label   # 🔥 store latest emotion
                frame = draw_label(frame, faces[0], label)

            frames += 1
            if frames >= 10:
                now = time.time()
                fps = frames / (now - fps_time)
                fps_time, frames = now, 0

                cv2.putText(
                    frame,
                    f"FPS: {fps:.1f}",
                    (10, 25),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (255,255,255),
                    2
                )

            cv2.imshow("Aura Mood Scan", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()
        print(final_emotion)

if __name__ == "__main__":
    main()
