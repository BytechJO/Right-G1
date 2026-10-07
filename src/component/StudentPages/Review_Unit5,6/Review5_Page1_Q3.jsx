import React, { useRef, useState } from "react";

import img1 from "../../../assets/unit6/imgs/U6P52EXEC-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P52EXEC-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P52EXEC-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P52EXEC-04.svg";

import penAudio from "../../../assets/unit6/sounds/Page 52 - C/Is this a pen.mp3";
import eraserAudio from "../../../assets/unit6/sounds/Page 52 - C/Is this an eraser.mp3";
import chairAudio from "../../../assets/unit6/sounds/Page 52 - C/Is this a chair.mp3";
import deskAudio from "../../../assets/unit6/sounds/Page 52 - C/Is this a desk.mp3";

import yesAudio from "../../../assets/unit6/sounds/Page 52 - C/Yes, it is..mp3";
import noAudio from "../../../assets/unit6/sounds/Page 52 - C/No, it isn’t..mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review5_Page1_Q3.css";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   QUESTIONS
===================================================== */

const QUESTIONS = [
  {
    id: "img1",
    number: 1,
    image: img1,
    text: "Is this a pen?",
    audio: penAudio,
    alt: "A green book.",
    correct: "No, it isn’t.",
  },
  {
    id: "img2",
    number: 2,
    image: img2,
    text: "Is this an eraser?",
    audio: eraserAudio,
    alt: "A wooden student desk and chair.",
    correct: "No, it isn’t.",
  },
  {
    id: "img3",
    number: 3,
    image: img3,
    text: "Is this a chair?",
    audio: chairAudio,
    alt: "A blue ruler.",
    correct: "No, it isn’t.",
  },
  {
    id: "img4",
    number: 4,
    image: img4,
    text: "Is this a desk?",
    audio: deskAudio,
    alt: "A blue and pink eraser.",
    correct: "No, it isn’t.",
  },
];

/* =====================================================
   ANSWERS
===================================================== */

const ANSWERS = [
  {
    id: "yes",
    text: "Yes, it is.",
    audio: yesAudio,
  },
  {
    id: "no",
    text: "No, it isn’t.",
    audio: noAudio,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Review5_Page1_Q3 = () => {
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
     CONNECTION STATE
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

  /* =================================================
     KEYBOARD MODE
  ================================================= */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

  const [playingId, setPlayingId] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingId(null);
  };

  const playAudio = (id, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;
    setPlayingId(id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const isQuestionLocked = (questionId) => lockedQuestions.includes(questionId);

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
      (id) => !isQuestionLocked(id),
    );

  const getQuestionById = (id) =>
    QUESTIONS.find((question) => question.id === id);

  const getAnswerById = (id) => ANSWERS.find((answer) => answer.id === id);

  const clearWrongQuestion = (questionId) => {
    setWrongQuestions((prev) => prev.filter((id) => id !== questionId));
  };

  /* =================================================
     NEXT QUESTION FOCUS
  ================================================= */

  const focusNextAvailableQuestion = (currentId) => {
    const available = getAvailableQuestions().filter((id) => id !== currentId);

    if (!available.length) return;

    window.setTimeout(() => {
      questionRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     COMMIT CONNECTION

     IMPORTANT:
     MANY-TO-ONE
     We filter ONLY by question/source.
     We DO NOT filter by answer.
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

    /*
      MANY TO ONE:
      Remove old line only for this question.
      Keep other lines even if they use same answer.
    */

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
     START FROM ANSWER - MOUSE
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
     QUESTION MOUSE CLICK

     IMAGE + QUESTION + DOT
     ALL SAME ACTION
  ================================================= */

  const handleQuestionClick = (question) => {
    /*
      Question audio always available
    */

    playAudio(`question-${question.id}`, question.audio);

    if (showAnswer || checkCompleted || isQuestionLocked(question.id)) {
      return;
    }

    setKeyboardMatching(false);

    setPreviewLine(null);

    /*
      Started from answer → connect
    */

    if (firstPoint?.side === "answer") {
      commitConnection({
        questionId: question.id,

        answerId: firstPoint.answerId,
      });

      return;
    }

    /*
      Otherwise select question
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
      Audio always
    */

    playAudio(`question-${question.id}`, question.audio);

    /*
      Locked correct question:
      audio only
    */

    if (showAnswer || checkCompleted || isQuestionLocked(question.id)) {
      return;
    }

    setKeyboardMatching(true);

    startFromQuestion(question.id);

    /*
      Focus first answer
    */

    window.setTimeout(() => {
      const available = getAvailableAnswers();

      if (!available.length) return;

      answerRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     ANSWER FOCUS → PREVIEW
     KEYBOARD ONLY
  ================================================= */

  const handleAnswerFocus = (answerId) => {
    if (!keyboardMatching || !firstPoint || firstPoint.side !== "question") {
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
     ANSWER MOUSE CLICK

     ANSWER TEXT + DOT = SAME ACTION
  ================================================= */

  const handleAnswerClick = (answer) => {
    /*
      Answer audio always works
    */

    playAudio(`answer-${answer.id}`, answer.audio);

    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardMatching(false);

    setPreviewLine(null);

    /*
      Question already selected:
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
      Nothing selected:
      start reverse mouse matching
    */

    if (!firstPoint) {
      startFromAnswer(answer.id);

      return;
    }

    /*
      Another answer selected:
      switch answer
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
       TAB / SHIFT TAB BETWEEN ANSWERS
    ========================================= */

    if (
      keyboardMatching &&
      firstPoint?.side === "question" &&
      e.key === "Tab"
    ) {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableAnswers();

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

    /*
      If currently matching via keyboard
      → commit connection
    */

    if (keyboardMatching && firstPoint?.side === "question") {
      commitConnection({
        questionId: firstPoint.questionId,

        answerId: answer.id,

        returnFocus: true,
      });

      /*
        Also play target answer
      */

      playAudio(`answer-${answer.id}`, answer.audio);

      return;
    }

    /*
      No active matching:
      answer acts as audio control
    */

    playAudio(`answer-${answer.id}`, answer.audio);
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (lines.length < QUESTIONS.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the questions before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const correct = [];

    QUESTIONS.forEach((question) => {
      const line = lines.find((item) => item.questionId === question.id);

      const answer = getAnswerById(line?.answerId);

      const isCorrect = answer?.text === question.correct;

      if (isCorrect) {
        correctCount++;

        correct.push(question.id);
      } else {
        wrong.push(question.id);
      }
    });

    /*
      Progressive locking:
      correct questions only
    */

    setLockedQuestions((prev) => Array.from(new Set([...prev, ...correct])));

    /*
      Wrong remain editable
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

     Duplicate answer is allowed.
     All four can connect to same "No".
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
          sectionLetter="C"
          title="Look, read, and match."
          subTitle="Read each question, then connect it to Yes, it is or No, it is not."
        />

        {/* =================================================
            MATCH AREA
        ================================================= */}

        <div
          className="match-wrapper2 w-full"
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

              const playing = playingId === `question-${question.id}`;

              return (
                <div className="img-box2" key={question.id}>
                  {/* =====================================
                        IMAGE + NUMBER
                    ===================================== */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "#2c5287",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {question.number}
                    </span>

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
                  </div>

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
                    style={{
                      border: "2px solid #2effeaff",

                      borderRadius: "8px",

                      background: "#b7fff8ff",

                      padding: "0px 5px",

                      display: "flex",

                      fontSize: "18px",

                      justifyContent: "center",

                      marginTop: "10px",

                      position: "relative",

                      cursor: "pointer",
                    }}
                    className={`clickable-word-unit2-p7-q2 question-audio-review5-p1-q3 ${
                      selectedQuestion === question.id ? "selected-item" : ""
                    }`}
                    onClick={() => handleQuestionClick(question)}
                    onKeyDown={(e) => handleQuestionKeyDown(e, question)}
                  >
                    {question.text}

                    {playing && (
                      <FaVolumeUp
                        size={14}
                        aria-hidden="true"
                        className="audio-icon-review5-p1-q3"
                      />
                    )}
                  </h5>

                  {wrong && (
                    <span className="error-mark-img" aria-hidden="true">
                      ✕
                    </span>
                  )}

                  {/* =====================================
                        QUESTION DOT
                        SAME AS IMAGE + TEXT
                    ===================================== */}

                  <div
                    ref={(el) => {
                      questionDotRefs.current[question.id] = el;
                    }}
                    className="dot2-unit2 start-dot2-unit2"
                    data-image={question.id}
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

              const playing = playingId === `answer-${answer.id}`;

              return (
                <div className="word-box2-review6-p1-q3" key={answer.id}>
                  {/* الدوت فوق الكلمة */}
                  <div
                    ref={(el) => {
                      answerDotRefs.current[answer.id] = el;
                    }}
                    className="answer-dot-review5-p1-q3"
                    onClick={() => handleAnswerClick(answer)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {/* الكلمة */}
                  <h5
                    ref={(el) => {
                      answerRefs.current[answer.id] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      activeTarget
                        ? `${answer.text}. Press Enter or Space to connect to this answer.`
                        : `Play audio: ${answer.text}`
                    }
                    className={`answer-audio-review5-p1-q3 ${
                      selectedAnswer === answer.id ? "selected-item" : ""
                    }`}
                    onFocus={() => handleAnswerFocus(answer.id)}
                    onClick={() => handleAnswerClick(answer)}
                    onKeyDown={(e) => handleAnswerKeyDown(e, answer)}
                  >
                    {answer.text}

                    {playing && (
                      <FaVolumeUp
                        size={14}
                        aria-hidden="true"
                        className="audio-icon-review5-p1-q3"
                      />
                    )}
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

            {/* =============================================
                KEYBOARD PREVIEW ONLY
            ============================================= */}

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

export default Review5_Page1_Q3;
