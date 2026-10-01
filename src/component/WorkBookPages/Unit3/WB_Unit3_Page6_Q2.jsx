import React, { useState, useRef } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U3/SVG/U3P20EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U3/SVG/U3P20EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U3/SVG/U3P20EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U3/SVG/U3P20EXEB-04.svg";
import img5 from "../../../assets/U1 WB/U3/SVG/U3P20EXEB-05.svg";
import img6 from "../../../assets/U1 WB/U3/SVG/U3P20EXEB-06.svg";
import img7 from "../../../assets/U1 WB/U3/SVG/U3P20EXEB-07.svg";
import img8 from "../../../assets/U1 WB/U3/SVG/U3P20EXEB-08.svg";

import sound1 from "../../../assets/U1 WB/U3/audio/cd5pg20-instruction2-adult-lady_JnX8npTM.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const questionsData = [
  {
    id: 1,
    image1: img1,
    image2: img2,
    alt1: "A mop.",
    alt2: "A cat.",
    correct: "✗",
  },

  {
    id: 2,
    image1: img3,
    image2: img4,
    alt1: "A boy running.",
    alt2: "A can.",
    correct: "✓",
  },

  {
    id: 3,
    image1: img5,
    image2: img6,
    alt1: "A mat.",
    alt2: "An ant.",
    correct: "✓",
  },

  {
    id: 4,
    image1: img7,
    image2: img8,
    alt1: "A hat.",
    alt2: "A bird nest.",
    correct: "✗",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit3_Page6_Q2 = () => {
  const stopAtSecond = 8.159;

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState({});

  /*
    نخزن IDs تبعون الأسئلة الغلط
  */

  const [wrongQuestions, setWrongQuestions] = useState([]);

  /*
    Progressive locking
  */

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /*
    Focus styling inline
  */

  const [focusedOption, setFocusedOption] = useState(null);

  const optionRefs = useRef({});

  /* =====================================================
     CAPTIONS
  ===================================================== */

  const captions = [
    {
      start: 0.219,
      end: 8.159,
      text: "Phonics Exercise B. Do they have the same vowel sound? Listen and write check or X.",
    },

    {
      start: 8.739,
      end: 11.039,
      text: "1-mop, cat.",
    },

    {
      start: 11.579,
      end: 14.239,
      text: "2-ran, can.",
    },

    {
      start: 14.819,
      end: 17.42,
      text: "3-mat, ant.",
    },

    {
      start: 18.239,
      end: 20.959,
      text: "4-hat, nest.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (id) => lockedQuestions.includes(id);

  /* =====================================================
     SELECT ANSWER
  ===================================================== */

  const selectAnswer = (id, value) => {
    if (showAnswerMode || checkCompleted || isQuestionLocked(id)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));

    /*
      إذا السؤال كان غلط وعدله:
      شيل X عنه فقط.
    */

    setWrongQuestions((prev) => prev.filter((questionId) => questionId !== id));
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    const corrects = {};

    questionsData.forEach((q) => {
      corrects[q.id] = q.correct;
    });

    setAnswers(corrects);

    setWrongQuestions([]);

    setLockedQuestions(questionsData.map((q) => q.id));

    setShowAnswerMode(true);

    setCheckCompleted(true);

    setFocusedOption(null);
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    /* ==============================
       Empty check
    ============================== */

    const isEmpty = questionsData.some((q) => !answers[q.id]);

    if (isEmpty) {
      ValidationAlert.info("Oops!", "Please choose ✓ or ✗ for all questions.");

      return;
    }

    /* ==============================
       Compare answers
    ============================== */

    let correctCount = 0;

    const wrong = [];
    const newlyLocked = [];

    questionsData.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;

        newlyLocked.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    /*
      الصح فقط يتقفل.
    */

    setLockedQuestions((prev) => [...new Set([...prev, ...newlyLocked])]);

    /*
      الغلط يضل editable.
    */

    setWrongQuestions(wrong);

    const total = questionsData.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    /* ==============================
       All correct
    ============================== */

    if (correctCount === total) {
      setLockedQuestions(questionsData.map((q) => q.id));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(resultHTML);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswerMode(false);

    setCheckCompleted(false);

    setFocusedOption(null);
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleOptionKeyDown = (e, id, value) => {
    if (showAnswerMode || checkCompleted || isQuestionLocked(id)) {
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      selectAnswer(id, value);
    }

    /*
      نخلي ArrowRight / ArrowLeft
      يتنقلوا بين ✓ و ✗ داخل نفس السؤال.
    */

    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();

      const nextValue = value === "✓" ? "✗" : "✓";

      optionRefs.current[`${id}-${nextValue}`]?.focus();
    }
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
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title={
            <>
              Do they have the same{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                vowel sound
              </span>{" "}
              ? Listen and write
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                ✓
              </span>
              or{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                ✗
              </span>
              .
            </>
          }
          subTitle={
            <>
              Listen to each pair and choose{" "}
              <span style={{ color: "red" }}>✓</span>if the{" "}
              <span style={{ color: "red" }}>vowel sounds</span> match or{" "}
              <span style={{ color: "red" }}>✗</span> if they do not.
            </>
          }
        />
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          pageId="unit2-page20-q2-WB"
          stopAtSecond={stopAtSecond}
        />

        <div className="wb-unit3-p6-q2-container">
          {questionsData.map((q) => {
            const locked = isQuestionLocked(q.id);

            const wrong = wrongQuestions.includes(q.id);

            const selectedAnswer = answers[q.id];

            return (
              <div
                key={q.id}
                className="review9-p2-q2-question-box"
                style={{
                  position: "relative",
                }}
              >
                {/* =========================
                    QUESTION NUMBER
                ========================= */}

                <p
                  className="unit6-p1-q1-question-text"
                  style={{
                    fontSize: "20px",
                  }}
                >
                  <span
                    style={{
                      color: "darkblue",
                      fontWeight: "700",
                    }}
                  >
                    {q.id}.
                  </span>
                </p>

                <div className="unit10-p1-q2-flex">
                  {/* =========================
                      IMAGES
                  ========================= */}

                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <img
                      src={q.image1}
                      alt={q.alt1}
                      className="wb-unit3-p6-q2-question-img"
                    />

                    <img
                      src={q.image2}
                      alt={q.alt2}
                      className="wb-unit3-p6-q2-question-img"
                    />
                  </div>

                  {/* =========================
                      OPTIONS
                  ========================= */}

                  <div
                    className="unit10-p1-q2-options-box"
                    role="group"
                    aria-label={`Question ${q.id}. Do the two words have the same vowel sound?`}
                  >
                    {["✓", "✗"].map((value) => {
                      const selected = selectedAnswer === value;

                      const focused = focusedOption === `${q.id}-${value}`;

                      const selectedWrong = wrong && selected;

                      return (
                        <div
                          key={value}
                          className="option-wrapper"
                          style={{
                            position: "relative",
                          }}
                        >
                          <div
                            ref={(node) => {
                              optionRefs.current[`${q.id}-${value}`] = node;
                            }}
                            className={`option-btn ${
                              selected ? "selected" : ""
                            }`}
                            role="button"
                            tabIndex={
                              locked || showAnswerMode || checkCompleted
                                ? -1
                                : 0
                            }
                            aria-pressed={selected}
                            aria-label={
                              value === "✓"
                                ? `Question ${q.id}: same vowel sound`
                                : `Question ${q.id}: different vowel sound`
                            }
                            onClick={() => selectAnswer(q.id, value)}
                            onKeyDown={(e) =>
                              handleOptionKeyDown(e, q.id, value)
                            }
                            onFocus={() => setFocusedOption(`${q.id}-${value}`)}
                            onBlur={() => setFocusedOption(null)}
                            style={{
                              /*
                                Inline accessibility styles
                              */

                              cursor:
                                locked || showAnswerMode || checkCompleted
                                  ? "default"
                                  : "pointer",

                              outline: focused ? "3px solid #2563eb" : "none",

                              outlineOffset: focused ? "4px" : "0",

                              boxShadow: focused
                                ? "0 0 0 4px rgba(37, 99, 235, 0.18), 0 0 10px rgba(37, 99, 235, 0.3)"
                                : "none",

                              borderRadius: "8px",

                              transition:
                                "outline 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",

                              /*
                                يخلي الاختيار نفسه
                                واضح حتى بعد ما يطلع focus
                              */

                              background: selected ? "#dbeafe" : undefined,

                              color: selected ? "#1d4ed8" : undefined,

                              fontWeight: selected ? "700" : undefined,
                            }}
                          >
                            {value}
                          </div>

                          {/* =========================
                              WRONG MARK
                          ========================= */}

                          {selectedWrong && (
                            <div className="unit6-p1-q1-wrong-icon">✕</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
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

export default WB_Unit3_Page6_Q2;
