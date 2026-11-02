import React, { useState } from "react";

import "./Unit6_Page5_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit6/imgs/U6P50EXEA1-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P50EXEA1-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P50EXEA1-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P50EXEA1-04.svg";

import ExerciseHeader from "../../ExerciseHeader";

import sound1 from "../../../assets/unit6/sounds/U6P50EXEA1.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const questions = [
  {
    id: 1,
    image: img1,
    alt: "Two hands tearing a sheet of paper.",
    correct: "✓",
  },
  {
    id: 2,
    image: img2,
    alt: "A melting ice cube.",
    correct: "✗",
  },
  {
    id: 3,
    image: img3,
    alt: "A whole fig and a sliced fig.",
    correct: "✓",
  },
  {
    id: 4,
    image: img4,
    alt: "A colorful kite.",
    correct: "✗",
  },
];

const Unit6_Page5_Q1 = () => {
  const stopAtSecond = 11;

  /* =====================================================
     CAPTIONS
  ===================================================== */

  const captions = [
    {
      start: 0,
      end: 5.36,
      text: "Page 50. Right Activities. Exercise A, number 1.",
    },
    {
      start: 6,
      end: 10.28,
      text: "Does it have a short I? Listen and write check or X",
    },
    {
      start: 11.7,
      end: 12.84,
      text: "1-rip.",
    },
    {
      start: 13.7,
      end: 14.74,
      text: "2-ice.",
    },
    {
      start: 15.56,
      end: 16.56,
      text: "3-figs.",
    },
    {
      start: 17.6,
      end: 18.6,
      text: "4-kite.",
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState({});

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (id) => lockedQuestions.includes(id);

  /* =====================================================
     SELECT
  ===================================================== */

  const selectAnswer = (id, value) => {
    if (showAnswer || checkCompleted || isQuestionLocked(id)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));

    /*
      Clear X only for this question
    */

    setWrongQuestions((prev) => prev.filter((qId) => qId !== id));
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    const corrects = {};

    questions.forEach((q) => {
      corrects[q.id] = q.correct;
    });

    setAnswers(corrects);

    setWrongQuestions([]);

    setLockedQuestions(questions.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const isEmpty = questions.some((q) => !answers[q.id]);

    if (isEmpty) {
      ValidationAlert.info("Please choose ✓ or ✗ for all questions!");

      return;
    }

    let correctCount = 0;

    const wrong = [];
    const newlyLocked = [];

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;

        newlyLocked.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    /*
      Correct questions lock
    */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /*
      Wrong questions remain editable
    */

    setWrongQuestions(wrong);

    const total = questions.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedQuestions(questions.map((q) => q.id));

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
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          questionNumber="1"
          title={
            <>
              Does it have a short i? Listen and write{" "}
              <span style={{ color: "red" }}>✓</span> or{" "}
              <span style={{ color: "red" }}>✗</span>.
            </>
          }
          subTitle="Listen to each word, then choose check or X for the short-i sound."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="page50-unit6-QA-1"
        />

        <div className="unit6-p1-q1-container">
          {questions.map((q) => {
            const locked = isQuestionLocked(q.id);

            const wrong = wrongQuestions.includes(q.id);

            const disabled = locked || showAnswer || checkCompleted;

            return (
              <div key={q.id} className="unit6-p1-q1-question-box">
                {/* =====================================
                    NUMBER
                ===================================== */}

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

                <div className="unit6-p1-q1-flex">
                  {/* =====================================
                      IMAGE
                  ===================================== */}

                  <img
                    src={q.image}
                    alt={q.alt}
                    className="unit6-p1-q1-question-img"
                  />

                  {/* =====================================
                      OPTIONS
                  ===================================== */}

                  <div className="unit6-p1-q1-options-box">
                    {/* =============================
                        ✓ OPTION
                    ============================= */}

                    <div className="option-wrapper">
                      <div
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        aria-pressed={answers[q.id] === "✓"}
                        aria-label={`Choose check mark for question ${q.id}`}
                        className={`option-btn ${
                          answers[q.id] === "✓" ? "selected" : ""
                        }`}
                        onClick={() => selectAnswer(q.id, "✓")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();

                            selectAnswer(q.id, "✓");
                          }
                        }}
                        style={{
                          cursor: disabled ? "default" : "pointer",
                        }}
                      >
                        ✓
                      </div>

                      {wrong && answers[q.id] === "✓" && (
                        <div
                          className="unit6-p1-q1-wrong-icon"
                          aria-hidden="true"
                        >
                          ✕
                        </div>
                      )}
                    </div>

                    {/* =============================
                        ✗ OPTION
                    ============================= */}

                    <div className="option-wrapper">
                      <div
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        aria-pressed={answers[q.id] === "✗"}
                        aria-label={`Choose cross mark for question ${q.id}`}
                        className={`option-btn ${
                          answers[q.id] === "✗" ? "selected" : ""
                        }`}
                        onClick={() => selectAnswer(q.id, "✗")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();

                            selectAnswer(q.id, "✗");
                          }
                        }}
                        style={{
                          cursor: disabled ? "default" : "pointer",
                        }}
                      >
                        ✗
                      </div>

                      {wrong && answers[q.id] === "✗" && (
                        <div
                          className="unit6-p1-q1-wrong-icon"
                          aria-hidden="true"
                        >
                          ✕
                        </div>
                      )}
                    </div>
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

export default Unit6_Page5_Q1;
