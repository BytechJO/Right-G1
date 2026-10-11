import React, { useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review7_Page2_Q3.css";

import sound1 from "../../../assets/unit8/sound/U8P71EXEF.mp3";

import bat from "../../../assets/unit8/imgs/U8P71EXEF-01.svg";
import box from "../../../assets/unit8/imgs/U8P71EXEF-02.svg";
import bucket from "../../../assets/unit8/imgs/U8P71EXEF-03.svg";
import boat from "../../../assets/unit8/imgs/U8P71EXEF-04.svg";
import img5 from "../../../assets/unit8/imgs/U8P71EXEF-05.svg";
import img6 from "../../../assets/unit8/imgs/U8P71EXEF-06.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: bat,
    alt: "A pink wristwatch.",
    correct: "w",
  },
  {
    img: box,
    alt: "A small house with a roof, door, and windows.",
    correct: "h",
  },
  {
    img: bucket,
    alt: "A blue whale spraying water from its blowhole.",
    correct: "w",
  },
  {
    img: boat,
    alt: "A clothes hanger.",
    correct: "h",
  },
  {
    img: img5,
    alt: "A glass filled with water.",
    correct: "w",
  },
  {
    img: img6,
    alt: "A woman shown in profile with an arrow pointing to her hair.",
    correct: "h",
  },
];

/* =====================================================
   MAIN
===================================================== */

const Review7_Page2_Q3 = () => {
  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  /*
    null | correct | wrong
  */
  const [results, setResults] = useState(Array(items.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const stopAtSecond = 5.98;

  /* =====================================================
     CAPTIONS
  ===================================================== */

  const captions = [
    {
      start: 0,
      end: 6.06,
      text: "Page 71, exercise F. Listen and circle the beginning sound.",
    },
    {
      start: 6.09,
      end: 8.11,
      text: "1, watch.",
    },
    {
      start: 8.14,
      end: 10.17,
      text: "2, house.",
    },
    {
      start: 10.2,
      end: 12.15,
      text: "3, whale.",
    },
    {
      start: 12.19,
      end: 14.14,
      text: "4, hanger.",
    },
    {
      start: 14.18,
      end: 16.22,
      text: "5, water.",
    },
    {
      start: 16.25,
      end: 18.2,
      text: "6, hair.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const allCorrect = items.every((_, index) => results[index] === "correct");

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (index, value) => {
    if (isQuestionLocked(index)) return;

    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    /*
      تعديل نفس السؤال:
      يشيل X عنه فقط
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) return;

    const hasEmpty = items.some(
      (_, index) => results[index] !== "correct" && answers[index] === null,
    );

    if (hasEmpty) {
      ValidationAlert.info("Oops!", "Please answer all items first.");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    items.forEach((item, index) => {
      /*
        الصح من Check سابق يظل مقفول
      */

      if (results[index] === "correct") {
        nextResults[index] = "correct";
        correctCount++;
        return;
      }

      if (answers[index]?.toLowerCase() === item.correct.toLowerCase()) {
        nextResults[index] = "correct";
        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

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
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswer = () => {
    setAnswers(items.map((item) => item.correct));

    setResults(items.map(() => "correct"));

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));

    setResults(Array(items.length).fill(null));

    setShowAnswerMode(false);
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
        className="div-forall mb-20"
        style={{
          gap: "10px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="F"
          title={
            <>
              Listen and circle the{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                beginning sound
              </span>
              .
            </>
          }
          subTitle="Listen to each picture name, then tap h or w."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="Review7_Page2_QF"
        />

        <div
          className="imgFeild"
          style={{
            display: "flex",
            width: "100%",
            gap: "13px",
            flexDirection: "column",
          }}
        >
          <div className="wh-container-review7-p2-q3 w-full">
            {items.map((item, index) => {
              const locked = isQuestionLocked(index);

              const isWrong = results[index] === "wrong";

              return (
                <div className="gk-item" key={index}>
                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                    }}
                  >
                    <span
                      className="q-number"
                      style={{
                        color: "#2c5287",
                        fontSize: "20px",
                        fontWeight: "700",
                      }}
                    >
                      {index + 1}
                    </span>

                    <img src={item.img} alt={item.alt} className="gk-image" />
                  </div>

                  {/* =================================================
                      OPTIONS
                  ================================================= */}

                  <div className="gk-options">
                    {["h", "w"].map((letter) => {
                      const isSelected = answers[index] === letter;

                      const isWrongSelected = isWrong && isSelected;

                      return (
                        <span
                          key={letter}
                          role="button"
                          tabIndex={locked ? -1 : 0}
                          aria-disabled={locked}
                          aria-pressed={isSelected}
                          aria-label={`Letter ${letter}${
                            isSelected ? ". Selected." : ""
                          }`}
                          className={`
                            gk-option

                            ${isSelected ? "selected" : ""}

                            ${isWrongSelected ? "wrong-answer" : ""}
                          `}
                          onClick={() => {
                            if (locked) return;

                            handleSelect(index, letter);
                          }}
                          onKeyDown={(e) => {
                            if (locked) return;

                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              handleSelect(index, letter);
                            }
                          }}
                          style={{
                            position: "relative",
                          }}
                        >
                          {letter}

                          {isWrongSelected && (
                            <span className="wrong-x" aria-hidden="true">
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

export default Review7_Page2_Q3;
