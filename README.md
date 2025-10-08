AURA: An Intelligent, Gamified System for Mood Tracking and Dream-Based Emotional Analysis
Problem Statement

“Mental wellness begins with understanding one’s own emotions.”

Mental health has become a significant concern in today’s fast-paced, digitally connected society, particularly among younger populations. Existing mental wellness platforms and apps often lack personalization, interactivity, and emotional engagement, leading to reduced user retention and limited impact. Traditional mood tracking and journaling tools are mostly passive, failing to provide intelligent feedback or meaningful emotional insights.

There is a growing need for an AI-powered, gamified wellness platform that can help users track their moods, analyze dreams, and receive personalized emotional insights while keeping them engaged through interactive, game-based environments.

The proposed system, AURA, aims to fill this gap by combining AI-driven emotion detection, dream interpretation, and gamified visualization to make emotional self-care interactive, reflective, and sustainable.

Description

AURA is an innovative mental wellness platform that integrates AI, gamification, and emotional intelligence to help users build better awareness of their emotions through mood tracking, journaling, and dream analysis.

The platform features a Minecraft-style visual world, where the environment dynamically evolves based on the user’s emotional state — for example, a calm mood generates serene environments, while anxiety may create cloudy or foggy visuals. Users can complete daily wellness quests, log their mood entries, and record their dream narratives, which are analyzed by an AI model trained using the GoEmotions dataset (28 emotional categories).

Unlike static wellness trackers, AURA transforms emotional reflection into an interactive experience. Users earn rewards such as MoodBlocks and LucidPoints for consistent journaling and task completion. They can also form 2-player mood parties to face symbolic “Stress Monsters” — representations of internal struggles like anxiety or procrastination — in cooperative gameplay that promotes emotional resilience.

The application includes AI-driven dream interpretation, mood-based journaling insights, and emotion-specific community villages (e.g., Sadland, JoyJump, Anxityria) that connect users with others experiencing similar emotions, fostering empathy and shared healing.

AURA leverages React.js for the frontend, Node.js and Express.js for backend APIs, and FastAPI/Python for mood and dream analysis. Instead of Flask, the AI botserver uses a custom-trained GoEmotions model to classify emotions from journal text. Databases such as Firebase Firestore and MongoDB Atlas handle mood logs, chat history, and user progress data.

By merging emotional intelligence, storytelling, and gamified interaction, AURA offers a holistic, AI-assisted approach to emotional self-care, encouraging reflection, self-discovery, and consistent mental wellness engagement.

Application Flowchart

Below is the flow of operations within the AURA system:

             ┌──────────────────────────────┐
             │        User Interface         │
             │  (React.js, Tailwind, MUI)   │
             └──────────────┬───────────────┘
                            │
              ┌─────────────┴─────────────┐
              │     Authentication        │
              │   (Firebase Auth System)  │
              └─────────────┬─────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │        Core Backend (Node.js)         │
        │  Handles user APIs, tasks, rewards    │
        └───────────────────┬───────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │         AI Engine (FastAPI)           │
        │  → Mood Detection (GoEmotions - 28)   │
        │  → Dream Interpretation (RAG + NLP)   │
        │  → Emotional Feedback Generation       │
        └───────────────────┬───────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │          Database Layer               │
        │ Firebase Firestore + MongoDB Atlas    │
        │ Store user data, moods, dreams, chats │
        └───────────────────┬───────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │     Visualization Engine (MoodWorld)  │
        │  Minecraft-style environment updates  │
        │  Reflects mood states in real time    │
        └───────────────────┬───────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │ Multiplayer & Community System        │
        │  2-Player Parties, Chat Villages      │
        │  (Socket.io + Firebase Realtime DB)   │
        └───────────────────────────────────────┘

Key Highlights

AI Mood Detection – Emotion classification model trained on the GoEmotions dataset (28 moods).

Gamified Wellness – Emotional states represented through a dynamic world with quests and symbolic gameplay.

Dream Analysis – RAG-based dream interpretation provides personalized emotional insights.

Community Healing – Emotion-based chat villages encourage social connection and empathy.

Reward System – Earn XP, MoodBlocks, and LucidPoints for maintaining consistent wellness habits.

Data Security – Firebase and MongoDB ensure encrypted, structured data management.
