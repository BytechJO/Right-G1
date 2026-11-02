import React, { useState } from "react";

import "./WB_Unit5_Page1_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U5/U5P27EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U5/U5P27EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U5/U5P27EXEB-03.svg";

import ExerciseHeader from "../../ExerciseHeader";

const WB_Unit5_Page1_Q2 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const questions = [
    {
      id: 1,

      parts: [
        {
          type: "text",
          value: "This is",
        },
        {
          type: "blank",
          options: ["my", "your"],
        },
        {
          type: "text",
          value: "pen.",
        },
      ],

      correct: ["my"],

      image: img1,

      alt: "A girl pointing while speaking.",
    },

    {
      id: 2,

      parts: [
        {
          type: "text",
          value: "This is",
        },
        {
          type: "blank",
          options: ["my", "your"],
        },
        {
          type: "text",
          value: "book.",
        },
      ],

      correct: ["my"],

      image: img2,

      alt: "A boy holding a book.",
    },

    {
      id: 3,

      parts: [
        {
          type: "text",
          value: "This is",
        },
        {
          type: "blank",
          options: ["my", "your"],
        },
        {
          type: "text",
          value: "ruler.",
        },
      ],

      correct: ["your"],

      image: img3,

      alt: "A girl and a boy standing together while one holds a ruler.",
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(
    questions.map((q) =>
      q.parts.filter((part) => part.type === "blank").map(() => null),
    ),
  );

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (qIndex) => lockedQuestions.includes(qIndex);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, blankIndex, option) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = option;

      return updated;
    });

    /*
      شيل X فقط من نفس السؤال
    */

    setWrongQuestions((prev) => prev.filter((index) => index !== qIndex));
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const hasEmpty = answers.some((row) =>
      row.some((answer) => answer === null),
    );

    if (hasEmpty) {
      ValidationAlert.info("Oops!", "Please answer all questions first.");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    questions.forEach((q, qIndex) => {
      const userAnswer = answers[qIndex][0];

      const correctAnswer = q.correct[0];

      if (userAnswer === correctAnswer) {
        correctCount++;

        newlyLocked.push(qIndex);
      } else {
        wrong.push(qIndex);
      }
    });

    /*
      الصح فقط يقفل
    */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /*
      الغلط يضل editable
    */

    setWrongQuestions(wrong);

    const total = questions.length;

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
      setLockedQuestions(questions.map((_, index) => index));

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    const correctFilled = questions.map((q) => [...q.correct]);

    setAnswers(correctFilled);

    setWrongQuestions([]);

    setLockedQuestions(questions.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setAnswers(
      questions.map((q) =>
        q.parts.filter((part) => part.type === "blank").map(() => null),
      ),
    );

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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title="Look, read, and circle."
          subTitle="Look at the speaker and choose my or your to complete each sentence."
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {questions.map((q, qIndex) => {
            const locked = isQuestionLocked(qIndex);

            const wrong = wrongQuestions.includes(qIndex);

            return (
              <div className="question-row-review8-p2-q4" key={q.id}>
                <div className="sentence-wb-unit5-p1-q2">
                  {/* =============================
                      IMAGE
                  ============================= */}

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      gap: "30px",
                    }}
                  >
                    <span
                      className="header-title-page8"
                      style={{
                        color: "#2c5287",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {q.id}
                    </span>

                    <img
                      src={q.image}
                      alt={q.alt}
                      className="question-img-wb-unit5-p1-q2"
                    />
                  </div>

                  {/* =============================
                      SENTENCE
                  ============================= */}

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    {q.parts.map((part, pIndex) => {
                      if (part.type === "text") {
                        return (
                          <span
                            key={pIndex}
                            className="sentence-text-review5-p2-q3"
                          >
                            {part.value}
                          </span>
                        );
                      }

                      if (part.type === "blank") {
                        const actualBlankIndex = q.parts
                          .filter((p) => p.type === "blank")
                          .indexOf(part);

                        return (
                          <span
                            key={pIndex}
                            className="blank-options-review5-p2-q3"
                          >
                            {part.options.map((opt, optIndex) => {
                              const isSelected =
                                answers[qIndex][actualBlankIndex] === opt;

                              const isWrongSelected =
                                wrong &&
                                isSelected &&
                                opt !== q.correct[actualBlankIndex];

                              const disabled =
                                locked || showAnswer || checkCompleted;

                              return (
                                <div
                                  key={optIndex}
                                  className="option-wrapper"
                                  style={{
                                    position: "relative",
                                  }}
                                >
                                  <span
                                    role="button"
                                    tabIndex={disabled ? -1 : 0}
                                    aria-pressed={isSelected}
                                    aria-label={`Choose ${opt} for question ${q.id}`}
                                    className={`option-word-review5-p2-q3 ${
                                      isSelected ? "selected2" : ""
                                    }`}
                                    onClick={() =>
                                      handleSelect(
                                        qIndex,
                                        actualBlankIndex,
                                        opt,
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        handleSelect(
                                          qIndex,
                                          actualBlankIndex,
                                          opt,
                                        );
                                      }
                                    }}
                                    style={{
                                      cursor: disabled ? "default" : "pointer",
                                    }}
                                  >
                                    {opt}
                                  </span>

                                  {isWrongSelected && !showAnswer && (
                                    <div
                                      className="wrong-mark"
                                      aria-hidden="true"
                                    >
                                      ✕
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </span>
                        );
                      }

                      return null;
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

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit5_Page1_Q2;
