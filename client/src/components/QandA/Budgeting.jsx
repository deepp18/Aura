import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import Api from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLLMInference,
  selectInferenceResult,
  BotOpen,
  isbotOpen,
} from "../../redux/features/llmslice";

const QuestionsForm_Emotions = () => {
  var total = 0;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(""));
  const [showAnswers, setShowAnswers] = useState(false);
  const [viewedSolutions, setViewedSolutions] = useState(Array(15).fill(false));
  const [cursubmitted, setCurrSubmitted] = useState(Array(15).fill(false));
  const [score, setScore] = useState(null);
  const [showcurr, setShowcurr] = useState(false);
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [can, setCan] = useState(true);
  const dispatch = useDispatch();
  const inferenceResult = useSelector(selectInferenceResult);
  const isBotOpen = useSelector(isbotOpen);

  const toggleBot = () => {
    dispatch(BotOpen.actions.togglebot());
  };
  const setOpen = () => {
    dispatch(BotOpen.actions.setBot({ payload: true }));
  };
  const setClose = () => {
    dispatch(BotOpen.actions.setBot({ payload: false }));
  };
  const sendMessage = (msg) => {
    dispatch(fetchLLMInference(msg));
  };

  const removeselection = () => {
    const updated = [...answers];
    updated[currentQuestion] = "";
    setAnswers(updated);
  };

  const seeSol = () => {
    setShowcurr(currentQuestion);
    const updated = [...viewedSolutions];
    updated[currentQuestion] = true;
    setViewedSolutions(updated);
  };

  const handleAnswerChange = (event) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = event.target.value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    if (!can) {
      toast.error(
        "You have attempted this quiz earlier but you can still see solutions"
      );
      return;
    }
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === correctChoices[index]) {
        correctAnswers += 4;
      } else if (answer !== "") {
        correctAnswers--;
      }
    });
    const fscore = correctAnswers > 0 ? correctAnswers : 0;

    const quizSubmissionData = {
      score: fscore,
      questions: answers.map((answer, index) => ({
        index,
        answer,
      })),
    };
    toast.success("sending");
    await Api.quizSubmission({
      email: userInfo.email,
      lessonType: "emotions", // changed from "business"
      quizSubmissionData,
    })
      .then(() =>
        toast.success("Successfully submitted Quiz, keep on going ✨✨")
      )
      .catch((err) =>
        toast.error(`Failed to submit quiz. Please try again later, err: ${err}`)
      );
    setShowAnswers(true);
    setScore(fscore);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === correctChoices[index]) correctAnswers += 4;
      else if (answer !== "") correctAnswers--;
    });
    setScore(correctAnswers > 0 ? correctAnswers : 0);
  };

  const handleNextQuestion = () => {
    setShowAnswers(false);
    setShowcurr(false);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handlesubmitwithNext = () => {
    if (!can) return;

    if (answers[currentQuestion] === "") {
      toast.error("Please select an option to submit");
      return;
    }
    if (
      answers[currentQuestion] === correctChoices[currentQuestion] &&
      !cursubmitted[currentQuestion]
    ) {
      total += 4;
      toast.success("Correct answer +4 coins");
    } else {
      total -= 1;
      toast.error("Nice try but have to bear penalty of -1 coin");
    }
    const updated = [...cursubmitted];
    updated[currentQuestion] = true;
    setCurrSubmitted(updated);

    setShowAnswers(false);
    setShowcurr(false);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handlePreviousQuestion = () => {
    setShowAnswers(false);
    setCurrentQuestion((prev) => prev - 1);
  };

  const handleViewSolution = () => {
    setShowAnswers(true);
  };

  // ----------------- EMOTIONAL LITERACY QUIZ -----------------

  const questions = [
    "What does the term 'affect labeling' mean?",
    "What is a primary benefit of naming your emotions?",
    "Which statement best distinguishes emotions from moods?",
    "Which option is the most emotionally granular label?",
    "In the RAIN mindfulness technique, what does the 'R' stand for?",
    "Which body cue commonly signals anxiety?",
    "Which question best supports accurate emotion labeling?",
    "Which statement about guilt and shame is accurate?",
    "How do you typically use an Emotion Wheel effectively?",
    "Which of the following is most likely an emotional trigger?",
    "After labeling an emotion, which regulation strategy is most helpful?",
    "When journaling for 5 minutes to track mood, what should you record?",
    "What is cognitive reappraisal?",
    "What does 'window of tolerance' refer to?",
    "If you’re unsure which emotion you’re feeling, what’s the best next step?",
  ];

  const choices = [
    [
      "a) Suppressing feelings so they go away",
      "b) Putting feelings into words",
      "c) Acting out emotions to release them",
      "d) Ignoring feelings until they pass",
    ],
    [
      "a) It makes emotions last longer",
      "b) It increases heart rate",
      "c) It gives you a sense of control and can reduce intensity",
      "d) It makes other people fix your feelings",
    ],
    [
      "a) Emotions are longer and vaguer; moods are brief and specific",
      "b) Emotions are brief and tied to a specific trigger; moods are longer and more diffuse",
      "c) Emotions and moods are the same thing",
      "d) Moods are always positive; emotions are negative",
    ],
    [
      "a) “Bad”",
      "b) “Upset”",
      "c) “Irritated”",
      "d) “Not good”",
    ],
    [
      "a) React",
      "b) Recognize",
      "c) Redefine",
      "d) Resist",
    ],
    [
      "a) Relaxed muscles and steady breath",
      "b) Tight chest and fast breathing",
      "c) Yawning after a big meal",
      "d) Stable heartbeat and warmth",
    ],
    [
      "a) Why am I like this?",
      "b) What am I feeling right now and where do I sense it in my body?",
      "c) Who caused this feeling?",
      "d) How can I hide this quickly?",
    ],
    [
      "a) They are identical concepts",
      "b) Guilt = I am bad; Shame = I did something bad",
      "c) Guilt = I did something bad; Shame = I am bad",
      "d) Shame only happens with positive emotions",
    ],
    [
      "a) Avoid choosing any words so you don’t overthink",
      "b) Start with a core emotion in the center and move outward to find a more precise word",
      "c) Pick a random word from the outer ring",
      "d) Only use words connected to anger",
    ],
    [
      "a) Sunlight at noon",
      "b) Your favorite coffee mug",
      "c) A critical email from your boss",
      "d) Tying your shoes",
    ],
    [
      "a) Catastrophizing about worst-case scenarios",
      "b) Slow diaphragmatic breathing and reframing the situation",
      "c) Doomscrolling to distract yourself",
      "d) Forcing yourself to feel nothing",
    ],
    [
      "a) Exact stock prices and weather",
      "b) The emotion label, intensity (0–10), trigger, and body sensations",
      "c) Your horoscope of the day",
      "d) Anything except feelings",
    ],
    [
      "a) Ignoring facts to feel better",
      "b) Choosing a different, reasonable interpretation to shift how you feel",
      "c) Venting loudly to friends",
      "d) Exercising without reflection",
    ],
    [
      "a) The perfect mood we should always be in",
      "b) The range where we can think and feel without being overwhelmed",
      "c) A state that eliminates all negative emotions",
      "d) Something that applies only to children",
    ],
    [
      "a) Pick any label and move on quickly",
      "b) Use a tentative label and stay curious (e.g., “Noticing tightness and worry—maybe anxiety”)",
      "c) Ask someone else to decide your feeling",
      "d) Scroll social media for ideas",
    ],
  ];

  const correctChoices = [
    "b) Putting feelings into words",
    "c) It gives you a sense of control and can reduce intensity",
    "b) Emotions are brief and tied to a specific trigger; moods are longer and more diffuse",
    "c) “Irritated”",
    "b) Recognize",
    "b) Tight chest and fast breathing",
    "b) What am I feeling right now and where do I sense it in my body?",
    "c) Guilt = I did something bad; Shame = I am bad",
    "b) Start with a core emotion in the center and move outward to find a more precise word",
    "c) A critical email from your boss",
    "b) Slow diaphragmatic breathing and reframing the situation",
    "b) The emotion label, intensity (0–10), trigger, and body sensations",
    "b) Choosing a different, reasonable interpretation to shift how you feel",
    "b) The range where we can think and feel without being overwhelmed",
    "b) Use a tentative label and stay curious (e.g., “Noticing tightness and worry—maybe anxiety”)",
  ];

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-100 min-h-[600px] flex flex-col justify-center items-center p-6"
    >
      <FormControl
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{ width: 600, margin: "auto" }}
        className="w-4/5 h-[400px] flex flex-col justify-between items-center bg-white p-6 rounded-xl shadow-md"
      >
        <div className="p-8">
          <p className="mb-2 font-medium">
            Q{currentQuestion + 1}: {questions[currentQuestion]}
          </p>
          <RadioGroup
            value={answers[currentQuestion]}
            onChange={handleAnswerChange}
          >
            {choices[currentQuestion].map((choice, index) => (
              <FormControlLabel
                key={index}
                value={choice}
                control={<Radio />}
                label={choice}
                disabled={showAnswers}
              />
            ))}
          </RadioGroup>
        </div>
        <div className="flex items-center justify-between m-4">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            variant="outlined"
            size="small"
            color="primary"
          >
            Previous
          </Button>

          {currentQuestion < questions.length - 1 && (
            <Button
              onClick={
                showcurr ||
                viewedSolutions[currentQuestion] ||
                cursubmitted[currentQuestion]
                  ? handleNextQuestion
                  : handlesubmitwithNext
              }
              size="small"
              color="primary"
            >
              {showcurr ||
              viewedSolutions[currentQuestion] ||
              cursubmitted[currentQuestion]
                ? "Next"
                : "Submit and Next"}
            </Button>
          )}

          <Button
            onClick={removeselection}
            variant="outlined"
            size="small"
            color="secondary"
          >
            Clear
          </Button>

          {!cursubmitted[currentQuestion] && (
            <Button
              onClick={handleNextQuestion}
              size="small"
              variant="outlined"
              color="primary"
            >
              Skip
            </Button>
          )}

          {showcurr ? null : (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={seeSol}
            >
              View solution
            </Button>
          )}

          {currentQuestion === questions.length - 1 && (
            <Button
              type="submit"
              variant="outlined"
              size="small"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}

          {showAnswers && <p className="mt-4">Your score: {score}</p>}
          {showAnswers && (
            <Button
              onClick={handleViewSolution}
              variant="outlined"
              color="primary"
              className="mt-4"
              size="small"
            >
              View all Solution
            </Button>
          )}
        </div>
      </FormControl>

      {showcurr ? (
        <motion.div className="flex flex-col justify-evenly items-center w-100 min-h-[200px]">
          <motion.h3>
            Correct option is: {correctChoices[currentQuestion]}
          </motion.h3>

          {!isBotOpen ? (
            <motion.button
              onClick={() => {
                setOpen();
                sendMessage(
                  `I need help with emotional literacy. Explain the correct answer for the question: ${
                    questions[currentQuestion]
                  } from options: ${choices[currentQuestion].toString()}`
                );
              }}
              className="bg-green-500 p-2 rounded-lg text-white"
            >
              Ask for help
            </motion.button>
          ) : (
            <motion.button
              onClick={() => {
                toggleBot();
              }}
              className="bg-red-500 rounded-lg w-3/4 text-center font-bold shadow-lg m-4 p-4 text-white"
            >
              Window on right side will pop up. Please wait for the answer, then
              you can ask for help again in the same window.
            </motion.button>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default QuestionsForm_Emotions;
