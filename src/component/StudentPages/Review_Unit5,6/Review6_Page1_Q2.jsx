import React, { useRef, useState } from "react";

import img1 from "../../../assets/unit6/imgs/U6P54EXEB-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P54EXEB-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P54EXEB-03.svg";

import flyKiteAudio from "../../../assets/unit6/sounds/Page 54 - B/Can you fly a kite.mp3";
import violinAudio from "../../../assets/unit6/sounds/Page 54 - B/Can you play the violin.mp3";
import rideBikeAudio from "../../../assets/unit6/sounds/Page 54 - B/Can you ride a bike.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page1_Q2.css";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   QUESTIONS
===================================================== */

const QUESTIONS = [
  {
    id: "img1",
    number: 1,
    image: img1,
    text: "Can you fly a kite?",
    audio: flyKiteAudio,
    alt: "A boy holding the string of a kite that has fallen near a tree.",
    correct: "No, I can’t.",
  },

  {
    id: "img2",
    number: 2,
    image: img2,
    text: "Can you play the violin?",
    audio: violinAudio,
    alt: "A boy playing a violin with a bow.",
    correct: "Yes, I can.",
  },

  {
    id: "img3",
    number: 3,
    image: img3,
    text: "Can you ride a bike?",
    audio: rideBikeAudio,
    alt: "A child riding a bicycle outdoors.",
    correct: "No, I can’t.",
  },
];

/* =====================================================
   ANSWERS
===================================================== */

const ANSWERS = [
  {
    id: "yes",
    text: "Yes, I can.",
  },

  {
    id: "no",
    text: "No, I can’t.",
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review6_Page1_Q2 = () => {
  /* =================================================
     REFS
  ================================================= */

  const containerRef = useRef(null);

  const questionRefs = useRef({});
  const answerRefs = useRef({});

  const questionDotRefs = useRef({});
  const answerDotRefs = useRef({});

  const audioRef = useRef(null);

  /* =================================================
     MATCHING STATE
  ================================================= */

  const [lines, setLines] = useState([]);

  const [firstPoint, setFirstPoint] = useState(null);

  const [previewLine, setPreviewLine] = useState(null);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

  const [playingQuestion, setPlayingQuestion] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingQuestion(null);
  };

  const playQuestionAudio = (question) => {
    if (!question?.audio) return;

    stopAudio();

    const audio = new Audio(question.audio);

    audioRef.current = audio;

    setPlayingQuestion(question.id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const isQuestionLocked = (questionId) => lockedQuestions.includes(questionId);

  const getQuestionById = (id) =>
    QUESTIONS.find((question) => question.id === id);

  const getAnswerById = (id) => ANSWERS.find((answer) => answer.id === id);

  const getCenter = (element) => {
    if (!element || !containerRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const rect = element.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,

      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  const getAvailableAnswers = () => ANSWERS.map((answer) => answer.id);

  const getAvailableQuestions = () =>
    QUESTIONS.map((question) => question.id).filter(
      (questionId) => !isQuestionLocked(questionId),
    );

  const clearWrongQuestion = (questionId) => {
    setWrongQuestions((prev) => prev.filter((id) => id !== questionId));
  };

  /* =================================================
     FOCUS NEXT QUESTION
  ================================================= */

  const focusNextAvailableQuestion = (currentQuestionId) => {
    const available = getAvailableQuestions().filter(
      (id) => id !== currentQuestionId,
    );

    if (!available.length) return;

    window.setTimeout(() => {
      questionRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     COMMIT CONNECTION

     MANY TO ONE:
     نحذف الخط القديم لنفس السؤال فقط.
     ما بنحذف باقي الخطوط على نفس Yes / No.
  ================================================= */

  const commitConnection = ({ questionId, answerId, returnFocus = false }) => {
    if (showAnswer || checkCompleted || isQuestionLocked(questionId)) {
      return;
    }

    const start = getCenter(questionDotRefs.current[questionId]);

    const end = getCenter(answerDotRefs.current[answerId]);

    const newLine = {
      questionId,
      answerId,

      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,
    };

    setLines((prev) => [
      ...prev.filter((line) => line.questionId !== questionId),
      newLine,
    ]);

    clearWrongQuestion(questionId);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedQuestion(null);

    setSelectedAnswer(null);

    setKeyboardMatching(false);

    if (returnFocus) {
      focusNextAvailableQuestion(questionId);
    }
  };

  /* =================================================
     START FROM QUESTION
  ================================================= */

  const startFromQuestion = (questionId) => {
    if (showAnswer || checkCompleted || isQuestionLocked(questionId)) {
      return;
    }

    const point = getCenter(questionDotRefs.current[questionId]);

    setFirstPoint({
      side: "question",
      questionId,

      x: point.x,
      y: point.y,
    });

    setSelectedQuestion(questionId);

    setSelectedAnswer(null);

    setPreviewLine(null);
  };

  /* =================================================
     START FROM ANSWER
     MOUSE ONLY
  ================================================= */

  const startFromAnswer = (answerId) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const point = getCenter(answerDotRefs.current[answerId]);

    setFirstPoint({
      side: "answer",
      answerId,

      x: point.x,
      y: point.y,
    });

    setSelectedAnswer(answerId);

    setSelectedQuestion(null);

    setPreviewLine(null);

    setKeyboardMatching(false);
  };

  /* =================================================
     QUESTION CLICK
     text + image + dot = same matching action
  ================================================= */

  const handleQuestionClick = (question) => {
    /*
      Audio always works
    */

    playQuestionAudio(question);

    /*
      correct locked:
      audio only
    */

    if (showAnswer || checkCompleted || isQuestionLocked(question.id)) {
      return;
    }

    setKeyboardMatching(false);

    setPreviewLine(null);

    /*
      إذا مختار Answer من تحت:
      وصل مباشرة
    */

    if (firstPoint?.side === "answer") {
      commitConnection({
        questionId: question.id,
        answerId: firstPoint.answerId,
      });

      return;
    }

    /*
      otherwise start question
    */

    startFromQuestion(question.id);
  };

  /* =================================================
     QUESTION KEYBOARD
  ================================================= */

  const handleQuestionKeyDown = (e, question) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      audio
    */

    playQuestionAudio(question);

    /*
      correct locked => audio only
    */

    if (showAnswer || checkCompleted || isQuestionLocked(question.id)) {
      return;
    }

    setKeyboardMatching(true);

    startFromQuestion(question.id);

    window.setTimeout(() => {
      const available = getAvailableAnswers();

      if (!available.length) return;

      answerRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     ANSWER FOCUS
     PREVIEW KEYBOARD ONLY
  ================================================= */

  const handleAnswerFocus = (answerId) => {
    if (!keyboardMatching || firstPoint?.side !== "question") {
      return;
    }

    const end = getCenter(answerDotRefs.current[answerId]);

    setPreviewLine({
      x1: firstPoint.x,
      y1: firstPoint.y,

      x2: end.x,
      y2: end.y,
    });
  };

  /* =================================================
     ANSWER CLICK
     text + dot = same action
  ================================================= */

  const handleAnswerClick = (answer) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      Mouse => no preview
    */

    setKeyboardMatching(false);

    setPreviewLine(null);

    /*
      question selected above:
      connect immediately
    */

    if (firstPoint?.side === "question") {
      commitConnection({
        questionId: firstPoint.questionId,
        answerId: answer.id,
      });

      return;
    }

    /*
      nothing selected:
      start reverse mouse connection
    */

    if (!firstPoint) {
      startFromAnswer(answer.id);

      return;
    }

    /*
      change selected answer
    */

    if (firstPoint?.side === "answer") {
      startFromAnswer(answer.id);
    }
  };

  /* =================================================
     ANSWER KEYBOARD
  ================================================= */

  const handleAnswerKeyDown = (e, answer) => {
    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape" && firstPoint?.side === "question") {
      e.preventDefault();
      e.stopPropagation();

      const originalQuestion = firstPoint.questionId;

      setFirstPoint(null);

      setPreviewLine(null);

      setSelectedQuestion(null);

      setSelectedAnswer(null);

      setKeyboardMatching(false);

      window.setTimeout(() => {
        questionRefs.current[originalQuestion]?.focus();
      }, 0);

      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (
      keyboardMatching &&
      firstPoint?.side === "question" &&
      e.key === "Tab"
    ) {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableAnswers();

      if (!available.length) return;

      const currentIndex = available.indexOf(answer.id);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextAnswer = available[nextIndex];

      answerRefs.current[nextAnswer]?.focus();

      return;
    }

    /* =========================================
       ENTER / SPACE
    ========================================= */

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (keyboardMatching && firstPoint?.side === "question") {
      commitConnection({
        questionId: firstPoint.questionId,

        answerId: answer.id,

        returnFocus: true,
      });
    }
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      لازم الثلاث أسئلة يكون إلهم lines
    */

    const connectedQuestionIds = new Set(lines.map((line) => line.questionId));

    if (connectedQuestionIds.size < QUESTIONS.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the questions before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];
    const correctNow = [];

    QUESTIONS.forEach((question) => {
      const line = lines.find((item) => item.questionId === question.id);

      const answer = getAnswerById(line?.answerId);

      const isCorrect = answer?.text === question.correct;

      if (isCorrect) {
        correctCount++;

        correctNow.push(question.id);
      } else {
        wrong.push(question.id);
      }
    });

    /*
      Progressive locking
    */

    setLockedQuestions((prev) => Array.from(new Set([...prev, ...correctNow])));

    /*
      Wrong stay editable
    */

    setWrongQuestions(wrong);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedQuestion(null);

    setSelectedAnswer(null);

    setKeyboardMatching(false);

    const total = QUESTIONS.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedQuestions(QUESTIONS.map((question) => question.id));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    const finalLines = QUESTIONS.map((question) => {
      const answer = ANSWERS.find((item) => item.text === question.correct);

      const start = getCenter(questionDotRefs.current[question.id]);

      const end = getCenter(answerDotRefs.current[answer.id]);

      return {
        questionId: question.id,

        answerId: answer.id,

        x1: start.x,
        y1: start.y,

        x2: end.x,
        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongQuestions([]);

    setLockedQuestions(QUESTIONS.map((question) => question.id));

    setShowAnswer(true);

    setCheckCompleted(true);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedQuestion(null);

    setSelectedAnswer(null);

    setKeyboardMatching(false);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setLines([]);

    setWrongQuestions([]);

    setLockedQuestions([]);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedQuestion(null);

    setSelectedAnswer(null);

    setShowAnswer(false);

    setCheckCompleted(false);

    setKeyboardMatching(false);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="B"
          title="Read, look, and match."
          subTitle="Connect each Can you...? question to the correct Yes or No answer."
        />

        {/* =================================================
            MATCH AREA
        ================================================= */}

        <div
          className="match-wrapper2"
          ref={containerRef}
          style={{
            position: "relative",
          }}
        >
          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="match-images-row2">
            {QUESTIONS.map((question) => {
              const locked = isQuestionLocked(question.id);

              const wrong = wrongQuestions.includes(question.id);

              const playing = playingQuestion === question.id;

              return (
                <div className="img-box2" key={question.id}>
                  {/* =====================================
                      QUESTION TEXT
                  ===================================== */}

                  <h5
                    ref={(el) => {
                      questionRefs.current[question.id] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      locked || showAnswer || checkCompleted
                        ? `Play audio: ${question.text}`
                        : `${question.text}. Press Enter or Space to start matching.`
                    }
                    className={`clickable-word-unit2-p7-q2 question-audio-review6-p1-q2 ${
                      selectedQuestion === question.id ? "selected-item" : ""
                    }`}
                    onClick={() => handleQuestionClick(question)}
                    onKeyDown={(e) => handleQuestionKeyDown(e, question)}
                    style={{
                      padding: "0px 5px",

                      display: "flex",

                      gap: "5px",

                      fontSize: "18px",

                      justifyContent: "center",

                      marginTop: "10px",

                      cursor: "pointer",

                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        color: "#2c5287",

                        fontSize: "20px",

                        fontWeight: "700",
                      }}
                    >
                      {question.number}
                    </span>

                    {question.text}

                    {playing && (
                      <FaVolumeUp
                        size={14}
                        aria-hidden="true"
                        className="audio-icon-review6-p1-q2"
                      />
                    )}
                  </h5>

                  {/* =====================================
                      IMAGE
                  ===================================== */}

                  <img
                    src={question.image}
                    alt={question.alt}
                    className={`clickable-img-unit2-p7-q2 ${
                      selectedQuestion === question.id ? "selected-item" : ""
                    }`}
                    onClick={() => handleQuestionClick(question)}
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                  />

                  {/* WRONG X */}

                  {wrong && (
                    <span className="error-mark-img" aria-hidden="true">
                      ✕
                    </span>
                  )}

                  {/* =====================================
                      QUESTION DOT
                  ===================================== */}

                  <div
                    ref={(el) => {
                      questionDotRefs.current[question.id] = el;
                    }}
                    className="dot2-unit2 start-dot2-unit2"
                    onClick={() => handleQuestionClick(question)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              ANSWERS
          ================================================= */}

          <div className="match-words-row2">
            {ANSWERS.map((answer) => {
              const activeTarget =
                keyboardMatching && firstPoint?.side === "question";

              return (
                <div className="word-box2-review6-p1-q3" key={answer.id}>
                  {/* =====================================
                      ANSWER DOT
                      فوق الكلمة
                  ===================================== */}

                  <div
                    ref={(el) => {
                      answerDotRefs.current[answer.id] = el;
                    }}
                    className="answer-dot-review6-p1-q2"
                    onClick={() => handleAnswerClick(answer)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {/* =====================================
                      ANSWER TEXT
                  ===================================== */}

                  <h5
                    ref={(el) => {
                      answerRefs.current[answer.id] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      activeTarget
                        ? `${answer.text}. Press Enter or Space to connect to this answer.`
                        : answer.text
                    }
                    className={`answer-text-review6-p1-q2 ${
                      selectedAnswer === answer.id ? "selected-item" : ""
                    }`}
                    onFocus={() => handleAnswerFocus(answer.id)}
                    onClick={() => handleAnswerClick(answer)}
                    onKeyDown={(e) => handleAnswerKeyDown(e, answer)}
                  >
                    {answer.text}
                  </h5>
                </div>
              );
            })}
          </div>

          {/* =================================================
              LINES
          ================================================= */}

          <svg className="lines-layer2">
            {lines.map((line, index) => (
              <line
                key={`${line.questionId}-${line.answerId}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}

            {/* keyboard preview */}

            {keyboardMatching && previewLine && (
              <line
                x1={previewLine.x1}
                y1={previewLine.y1}
                x2={previewLine.x2}
                y2={previewLine.y2}
                stroke="red"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            )}
          </svg>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review6_Page1_Q2;
