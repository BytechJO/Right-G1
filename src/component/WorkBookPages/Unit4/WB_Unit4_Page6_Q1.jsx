import React, { useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page6_Q1.css";

import sound1 from "../../../assets/U1 WB/U4/audio/cd6pg26-instruction1-adult-lady_6zu0SVay.mp3";

import bat from "../../../assets/U1 WB/U4/U4P26EXEA-01.svg";
import box from "../../../assets/U1 WB/U4/U4P26EXEA-02.svg";
import bucket from "../../../assets/U1 WB/U4/U4P26EXEA-03.svg";
import boat from "../../../assets/U1 WB/U4/U4P26EXEA-04.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const WB_Unit4_Page6_Q1 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const items = [
    {
      img: bat,
      alt: "A red flag on a pole.",
      correct: "f",
    },
    {
      img: box,
      alt: "A violin with a bow.",
      correct: "v",
    },
    {
      img: bucket,
      alt: "A bowl filled with fruit.",
      correct: "f",
    },
    {
      img: boat,
      alt: "A group of vegetables.",
      correct: "v",
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  const [wrongItems, setWrongItems] = useState([]);

  const [lockedItems, setLockedItems] = useState([]);

  const [showAnswerState, setShowAnswerState] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO PLAYER DATA
  ===================================================== */

  const stopAtSecond = 4.86;

  const captions = [
    {
      start: 0,
      end: 4.86,
      text: "Phonics exercise A. Listen, look, and circle.",
    },
    {
      start: 5.66,
      end: 7.04,
      text: "1, flag.",
    },
    {
      start: 7.74,
      end: 9.42,
      text: "2, violin.",
    },
    {
      start: 9.96,
      end: 11.48,
      text: "3, fruit.",
    },
    {
      start: 11.98,
      end: 14.12,
      text: "4, vegetables.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isLocked = (index) => lockedItems.includes(index);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (index, value) => {
    if (showAnswerState || checkCompleted || isLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });

    /*
      شيل X فقط عن نفس السؤال
    */

    setWrongItems((prev) => prev.filter((itemIndex) => itemIndex !== index));
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerState || checkCompleted) {
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
        answer?.toLowerCase() === items[index].correct.toLowerCase();

      if (isCorrect) {
        correctCount++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      الصح فقط يقفل
    */

    setLockedItems((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      الغلط فقط عليه X
    */

    setWrongItems(wrong);

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
      setLockedItems(items.map((_, index) => index));

      setWrongItems([]);

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
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));

    setWrongItems([]);

    setLockedItems([]);

    setShowAnswerState(false);

    setCheckCompleted(false);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswer = () => {
    const correctFilled = items.map((item) => item.correct);

    setAnswers(correctFilled);

    setWrongItems([]);

    setLockedItems(items.map((_, index) => index));

    setShowAnswerState(true);

    setCheckCompleted(true);
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
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="A"
          title="Listen, look, and circle."
          subTitle="Listen to each word and tap f or v for its beginning sound."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit4-page26-q1-WB"
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
          <div className="fv-container-wb-unit4-p6-q1">
            {items.map((item, index) => {
              const locked = isLocked(index);

              return (
                <div className="fv-item-wb-unit4-p6-q1" key={index}>
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

                    <img
                      src={item.img}
                      alt={item.alt}
                      className="fv-image-wb-unit4-p6-q1"
                    />
                  </div>

                  <div className="fv-options-wb-unit4-p6-q1">
                    {/* =========================
                        F OPTION
                    ========================= */}

                    <span
                      role="button"
                      tabIndex={
                        locked || showAnswerState || checkCompleted ? -1 : 0
                      }
                      aria-pressed={answers[index] === "f"}
                      aria-label={`Choose f for item ${index + 1}`}
                      style={{
                        position: "relative",
                        cursor:
                          locked || showAnswerState || checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                      className={`fv-option
                        ${
                          answers[index] === "f" ? "selected-review4-p2-q2" : ""
                        }
                        ${
                          wrongItems.includes(index) && answers[index] === "f"
                            ? "wrong-answer"
                            : ""
                        }
                      `}
                      onClick={() => handleSelect(index, "f")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          handleSelect(index, "f");
                        }
                      }}
                    >
                      f
                      {wrongItems.includes(index) &&
                        answers[index] === "f" &&
                        answers[index] !== item.correct && (
                          <span className="wrong-x-fv" aria-hidden="true">
                            ✕
                          </span>
                        )}
                    </span>

                    {/* =========================
                        V OPTION
                    ========================= */}

                    <span
                      role="button"
                      tabIndex={
                        locked || showAnswerState || checkCompleted ? -1 : 0
                      }
                      aria-pressed={answers[index] === "v"}
                      aria-label={`Choose v for item ${index + 1}`}
                      style={{
                        position: "relative",
                        cursor:
                          locked || showAnswerState || checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                      className={`fv-option
                        ${
                          answers[index] === "v" ? "selected-review4-p2-q2" : ""
                        }
                        ${
                          wrongItems.includes(index) && answers[index] === "v"
                            ? "wrong-answer"
                            : ""
                        }
                      `}
                      onClick={() => handleSelect(index, "v")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          handleSelect(index, "v");
                        }
                      }}
                    >
                      v
                      {wrongItems.includes(index) &&
                        answers[index] === "v" &&
                        answers[index] !== item.correct && (
                          <span className="wrong-x-fv" aria-hidden="true">
                            ✕
                          </span>
                        )}
                    </span>
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

        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit4_Page6_Q1;
