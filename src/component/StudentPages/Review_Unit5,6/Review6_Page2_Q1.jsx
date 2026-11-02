import React, { useState } from "react";
import "./Review6_Page2_Q1.css";

import sound1 from "../../../assets/unit6/sounds/U6P55EXED.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit6/imgs/U6P55EXED-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P55EXED-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P55EXED-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P55EXED-04.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    id: 1,

    src: img1,

    alt: "Two pictures side by side: a fish swimming in water on the left and a colorful kite on the right.",

    options: [
      {
        label: "Fish",
        answer: true,
      },
      {
        label: "Kite",
        answer: false,
      },
    ],
  },

  {
    id: 2,

    src: img2,

    alt: "Two pictures side by side: a baby crib on the left and a nighttime city scene representing knight on the right.",

    options: [
      {
        label: "Crib",
        answer: true,
      },
      {
        label: "Knight",
        answer: false,
      },
    ],
  },

  {
    id: 3,

    src: img3,

    alt: "Two pictures side by side: the number five on the left and a pair of lips on the right.",

    options: [
      {
        label: "Five",
        answer: false,
      },
      {
        label: "Lips",
        answer: true,
      },
    ],
  },

  {
    id: 4,

    src: img4,

    alt: "Two pictures side by side: an ice cube on the left and figs on the right.",

    options: [
      {
        label: "Ice",
        answer: false,
      },
      {
        label: "Figs",
        answer: true,
      },
    ],
  },
];

/* =====================================================
   MAIN
===================================================== */

const Review6_Page2_Q1 = () => {
  /* =====================================================
     ANSWERS
  ===================================================== */

  const [selected, setSelected] = useState({});

  /* =====================================================
     WRONG QUESTIONS
  ===================================================== */

  const [wrongQuestions, setWrongQuestions] = useState([]);

  /* =====================================================
     PROGRESSIVE LOCKING
  ===================================================== */

  const [lockedQuestions, setLockedQuestions] = useState([]);

  /* =====================================================
     FINAL STATES
  ===================================================== */

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     QUESTION AUDIO
  ===================================================== */

  const stopAtSecond = 7.9;

  const captions = [
    {
      start: 0,
      end: 8.1,
      text: "Page 55, exercise D, which picture has the short I sound? Listen and write check.",
    },

    {
      start: 8.12,
      end: 11.17,
      text: "1. Fish, kite.",
    },

    {
      start: 11.19,
      end: 14.23,
      text: "2. Crib, knight.",
    },

    {
      start: 14.25,
      end: 18.03,
      text: "3. Five, lips.",
    },

    {
      start: 18.05,
      end: 21.2,
      text: "4. Ice, figs.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (id) => lockedQuestions.includes(id);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qId, optionIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setSelected((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));

    /*
      لو السؤال كان عليه X
      وشو غيّر اختياره:
      نشيل X عن نفس السؤال فقط.
    */

    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /* =================================================
       لازم كل الأسئلة تكون مجاوبة
    ================================================= */

    const hasEmpty = data.some(
      (question) => selected[question.id] === undefined,
    );

    if (hasEmpty) {
      ValidationAlert.info("Please answer all questions before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    data.forEach((question) => {
      const selectedIndex = selected[question.id];

      const selectedOption = question.options[selectedIndex];

      if (selectedOption?.answer === true) {
        correctCount++;

        newlyLocked.push(question.id);
      } else {
        wrong.push(question.id);
      }
    });

    /* =================================================
       PROGRESSIVE LOCKING
       الصح فقط يقفل
    ================================================= */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /* =================================================
       WRONG ONLY
    ================================================= */

    setWrongQuestions(wrong);

    const total = data.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        margin-top:10px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (correctCount === total) {
      setLockedQuestions(data.map((question) => question.id));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =================================================
       PARTIAL / WRONG
    ================================================= */

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    const correctSelection = {};

    data.forEach((question) => {
      const correctIndex = question.options.findIndex(
        (option) => option.answer === true,
      );

      correctSelection[question.id] = correctIndex;
    });

    setSelected(correctSelection);

    setWrongQuestions([]);

    setLockedQuestions(data.map((question) => question.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const reset = () => {
    setSelected({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
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
          gap: "20px",

          marginBottom: "40px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="D"
          title={
            <>
              Which picture has the{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                short i
              </span>{" "}
              sound? Listen and write{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                ✓
              </span>
              .
            </>
          }
          subTitle="Listen to each pair, then tap the picture with the short-i sound."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="Review6_Page2_QD"
        />

        <div className="shorti-container-review6-p2-q1 w-full">
          {data.map((question) => {
            const locked = isQuestionLocked(question.id);

            return (
              <div key={question.id} className="question-box-review6-p2-q1">
                <span
                  style={{
                    color: "darkblue",

                    fontWeight: "700",

                    fontSize: "20px",
                  }}
                >
                  {question.id}
                </span>

                <div className="question-box2-review6-p2-q1">
                  {/* =========================
                        IMAGE
                    ========================= */}

                  <img
                    src={question.src}
                    className="main-img-review6-p2-q1"
                    alt={question.alt}
                  />

                  {/* =========================
                        OPTIONS
                    ========================= */}

                  <div className="options-review6-p2-q1">
                    {question.options.map((option, index) => {
                      const isSelected = selected[question.id] === index;

                      const isWrong =
                        wrongQuestions.includes(question.id) &&
                        isSelected &&
                        !option.answer;

                      const disabled = locked || showAnswer || checkCompleted;

                      const activate = () => {
                        if (disabled) {
                          return;
                        }

                        handleSelect(question.id, index);
                      };

                      return (
                        <div
                          key={index}
                          className={`option-review6-p2-q1 ${
                            isSelected ? "selected-review6-p2-q1" : ""
                          }`}
                          role="button"
                          tabIndex={disabled ? -1 : 0}
                          aria-disabled={disabled}
                          aria-pressed={isSelected}
                          aria-label={`${option.label}. ${
                            isSelected ? "Selected." : "Not selected."
                          } Press Enter or Space to choose this picture.`}
                          onClick={activate}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              activate();
                            }
                          }}
                        >
                          {/* =========================
                                  WRONG X
                              ========================= */}

                          {isWrong && (
                            <span
                              className="wrong-x-circle-review6-p2-q1"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}

                          {/* =========================
                                  CHECK BOX
                              ========================= */}

                          <span
                            className="check-box-review6-p2-q1"
                            aria-hidden="true"
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                        </div>
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

export default Review6_Page2_Q1;
