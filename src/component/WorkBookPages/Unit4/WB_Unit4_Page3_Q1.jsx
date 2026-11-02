import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page3_Q1.css";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import circleQuestionAudio from "../../../assets/U1 WB/U4/audio/page_23_q_e/Item_001_Is_it_a_circle.mp3";
import triangleQuestionAudio from "../../../assets/U1 WB/U4/audio/page_23_q_e/Item_002_Is_it_a_triangle.mp3";
import squareQuestionAudio from "../../../assets/U1 WB/U4/audio/page_23_q_e/Item_003_Is_it_a_square.mp3";

import yesAudio from "../../../assets/U1 WB/U4/audio/page_23_q_e/Item_004_Yes,_it_is.mp3";
import noAudio from "../../../assets/U1 WB/U4/audio/page_23_q_e/Item_005_No,_it_isn't.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    id: 1,
    shape: "square",
    shapeLabel: "A square outline.",
    text: "Is it a circle?",
    questionAudio: circleQuestionAudio,
    options: [
      {
        text: "Yes, it is.",
        audio: yesAudio,
      },
      {
        text: "No, it isn’t.",
        audio: noAudio,
      },
    ],
    correctIndex: 1,
  },

  {
    id: 2,
    shape: "triangle",
    shapeLabel: "A triangle outline.",
    text: "Is it a triangle?",
    questionAudio: triangleQuestionAudio,
    options: [
      {
        text: "Yes, it is.",
        audio: yesAudio,
      },
      {
        text: "No, it isn’t.",
        audio: noAudio,
      },
    ],
    correctIndex: 0,
  },

  {
    id: 3,
    shape: "circle",
    shapeLabel: "A circle outline.",
    text: "Is it a triangle?",
    questionAudio: triangleQuestionAudio,
    options: [
      {
        text: "Yes, it is.",
        audio: yesAudio,
      },
      {
        text: "No, it isn’t.",
        audio: noAudio,
      },
    ],
    correctIndex: 1,
  },

  {
    id: 4,
    shape: "square",
    shapeLabel: "A square outline.",
    text: "Is it a square?",
    questionAudio: squareQuestionAudio,
    options: [
      {
        text: "Yes, it is.",
        audio: yesAudio,
      },
      {
        text: "No, it isn’t.",
        audio: noAudio,
      },
    ],
    correctIndex: 0,
  },
];

const WB_Unit4_Page3_Q1 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;
    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (index) => lockedQuestions.includes(index);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /* شيل X فقط من نفس السؤال */

    setWrongQuestions((prev) => prev.filter((index) => index !== qIndex));
  };

  /* =====================================================
     OPTION ACTION
     صوت + اختيار
  ===================================================== */

  const handleOptionAction = (qIndex, optionIndex, option) => {
    playAudio(`option-${qIndex}-${optionIndex}`, option.audio);

    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    handleSelect(qIndex, optionIndex);
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");

      return;
    }

    let correctCount = 0;

    const wrong = [];
    const newlyLocked = [];

    answers.forEach((answer, index) => {
      const isCorrect = answer === items[index].correctIndex;

      if (isCorrect) {
        correctCount++;
        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /* الصح فقط يقفل */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /* الغلط فقط عليه X */

    setWrongQuestions(wrong);

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedQuestions(items.map((_, index) => index));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(items.length).fill(null));

    setWrongQuestions([]);
    setLockedQuestions([]);

    setShowAnswer(false);
    setCheckCompleted(false);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    const filled = items.map((item) => item.correctIndex);

    setAnswers(filled);

    setWrongQuestions([]);

    setLockedQuestions(items.map((_, index) => index));

    setShowAnswer(true);
    setCheckCompleted(true);
  };

  /* =====================================================
     RENDER SHAPE
  ===================================================== */

  const renderShape = (q) => {
    if (q.shape === "triangle") {
      return (
        <svg width="120" height="120" role="img" aria-label={q.shapeLabel}>
          <polygon
            points="60,10 110,110 10,110"
            fill="white"
            stroke="#999"
            strokeWidth="4"
          />
        </svg>
      );
    }

    if (q.shape === "circle") {
      return (
        <svg width="120" height="120" role="img" aria-label={q.shapeLabel}>
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="white"
            stroke="#999"
            strokeWidth="4"
          />
        </svg>
      );
    }

    return (
      <svg width="120" height="120" role="img" aria-label={q.shapeLabel}>
        <rect
          x="10"
          y="10"
          width="100"
          height="100"
          fill="white"
          stroke="#999"
          strokeWidth="4"
        />
      </svg>
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

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
        <ExerciseHeader
          sectionLetter="E"
          title="Look, read, and circle."
          subTitle="Compare the picture with the question, then choose yes or no."
        />

        <div className="container-review6-p1-q1">
          {items.map((q, qIndex) => {
            const questionLocked = isQuestionLocked(qIndex);

            const questionWrong = wrongQuestions.includes(qIndex);

            const questionPlaying = playingKey === `question-${qIndex}`;

            return (
              <div
                key={q.id}
                className="question-box-wb-unit2-p4-q1"
                style={{
                  width: "100%",
                }}
              >
                {/* =================================================
                    QUESTION TEXT + AUDIO
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {qIndex + 1}
                  </span>

                  <h6
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio for ${q.text}`}
                    onClick={() =>
                      playAudio(`question-${qIndex}`, q.questionAudio)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();

                        playAudio(`question-${qIndex}`, q.questionAudio);
                      }
                    }}
                    className="question-audio-wb-unit4-p3-q1"
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    {q.text}

                    {questionPlaying && (
                      <FaVolumeUp
                        size={16}
                        aria-hidden="true"
                        className="audio-icon-wb-unit4-p3-q1"
                      />
                    )}
                  </h6>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  {/* =================================================
                      SHAPE
                  ================================================= */}

                  {renderShape(q)}

                  {/* =================================================
                      OPTIONS
                  ================================================= */}

                  <div className="options-row-wb-unit4-p3-q1">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[qIndex] === optIndex;

                      const isCorrect = optIndex === q.correctIndex;

                      const isWrong = questionWrong && isSelected && !isCorrect;

                      const isPlaying =
                        playingKey === `option-${qIndex}-${optIndex}`;

                      /*
                          السؤال الصح بعد Check:
                          خلي الخيار الصح بالـTab للصوت.

                          السؤال الغلط:
                          Yes و No يضلوا بالـTab.
                        */

                      const tabIndex =
                        questionLocked || showAnswer || checkCompleted
                          ? isCorrect
                            ? 0
                            : -1
                          : 0;

                      return (
                        <p
                          key={optIndex}
                          role="button"
                          tabIndex={tabIndex}
                          aria-pressed={isSelected}
                          aria-label={
                            questionLocked || showAnswer || checkCompleted
                              ? `${option.text}. Press Enter or Space to play the audio.`
                              : `${option.text}${
                                  isSelected ? ", selected" : ""
                                }. Press Enter or Space to hear and select this answer.`
                          }
                          className={`
                              option-word-wb-unit2-p4-q1
                              ${isSelected ? "selected3" : ""}
                              ${isWrong ? "wrong" : ""}
                              ${
                                (questionLocked ||
                                  showAnswer ||
                                  checkCompleted) &&
                                isCorrect
                                  ? "correct"
                                  : ""
                              }
                            `}
                          onClick={() =>
                            handleOptionAction(qIndex, optIndex, option)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              handleOptionAction(qIndex, optIndex, option);
                            }
                          }}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          {option.text}

                          {isPlaying && (
                            <FaVolumeUp
                              size={16}
                              aria-hidden="true"
                              className="audio-icon-wb-unit4-p3-q1"
                            />
                          )}

                          {isWrong && (
                            <span
                              className="wrong-x-review4-p2-q3"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit4_Page3_Q1;
