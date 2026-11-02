import React, { useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review4_Page2_Q2.css";

import sound1 from "../../../assets/unit4/sounds/U4P37EXEF.mp3";

import bat from "../../../assets/unit4/imgs/U4P37EXEF-01.svg";
import box from "../../../assets/unit4/imgs/U4P37EXEF-02.svg";
import bucket from "../../../assets/unit4/imgs/U4P37EXEF-03.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

const Review4_Page2_Q2 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const items = [
    {
      img: bat,
      correct: "f",
      alt: "A farmer working in a field.",
    },

    {
      img: box,
      correct: "f",
      alt: "A sick boy lying in bed with a fever.",
    },

    {
      img: bucket,
      correct: "v",
      alt: "A valley with houses between green hills.",
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState([null, null, null]);

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO PLAYER
     الموجود أصلًا فقط
  ===================================================== */

  const stopAtSecond = 9.02;

  const captions = [
    {
      start: 0,
      end: 9.02,
      text: "Page 37, Exercise F. What is the beginning sound or the word? Listen and circle.",
    },

    {
      start: 9.04,
      end: 10.14,
      text: "Farm.",
    },

    {
      start: 10.16,
      end: 11.08,
      text: "Fever.",
    },

    {
      start: 11.1,
      end: 12.19,
      text: "Valley.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (index) => lockedQuestions.includes(index);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (index, value) => {
    if (showAnswer || checkCompleted || isQuestionLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = value;

    setAnswers(updated);

    /*
      شيل X فقط عن نفس السؤال
    */

    setWrongQuestions((prev) => prev.filter((qIndex) => qIndex !== index));
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please answer all items first.");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    answers.forEach((answer, index) => {
      const isCorrect =
        answer?.toLowerCase() === items[index].correct?.toLowerCase();

      if (isCorrect) {
        correctCount++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      الصح فقط يتقفل
    */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /*
      الغلط فقط عليه X
    */

    setWrongQuestions(wrong);

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedQuestions(items.map((_, index) => index));

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

  const handleShowAnswer = () => {
    const correctFilled = items.map((item) => item.correct);

    setAnswers(correctFilled);

    setWrongQuestions([]);

    setLockedQuestions(items.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers([null, null, null]);

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
          gap: "40px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="F"
          title={
            <>
              What is the{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                beginning sound{" "}
              </span>
              of the word? Listen and circle.
            </>
          }
          subTitle="Listen to each picture name, then tap f or v."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="Review4_Page2_Q2"
        />

        <div
          className="imgFeild"
          style={{
            display: "flex",
            gap: "13px",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <div className="fv-container">
            {items.map((item, index) => {
              const questionLocked = isQuestionLocked(index);

              const questionWrong = wrongQuestions.includes(index);

              return (
                <div className="fv-item" key={index}>
                  <div
                    style={{
                      display: "flex",

                      gap: "13px",

                      flexDirection: "row",

                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",

                        color: "darkblue",

                        fontWeight: "600",
                      }}
                    >
                      {index + 1}
                    </span>

                    <img src={item.img} className="fv-image" alt={item.alt} />
                  </div>

                  <div className="fv-options">
                    {/* =================================================
                          F OPTION
                      ================================================= */}

                    {["f", "v"].map((value) => {
                      const selected = answers[index] === value;

                      const isWrong =
                        questionWrong && selected && value !== item.correct;

                      const disabled =
                        questionLocked || showAnswer || checkCompleted;

                      return (
                        <span
                          key={value}
                          role="button"
                          tabIndex={disabled ? -1 : 0}
                          aria-disabled={disabled}
                          aria-pressed={selected}
                          aria-label={`Letter ${value}${
                            selected ? ", selected" : ""
                          }. Press Enter or Space to select.`}
                          style={{
                            position: "relative",

                            cursor: disabled ? "default" : "pointer",
                          }}
                          className={`fv-option ${
                            selected ? "selected-review4-p2-q2" : ""
                          } ${isWrong ? "wrong-answer" : ""}`}
                          onClick={() => {
                            if (disabled) {
                              return;
                            }

                            handleSelect(index, value);
                          }}
                          onKeyDown={(e) => {
                            if (disabled) {
                              return;
                            }

                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              handleSelect(index, value);
                            }
                          }}
                        >
                          {value}

                          {isWrong && (
                            <span className="wrong-x-fv" aria-hidden="true">
                              ✕
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review4_Page2_Q2;
