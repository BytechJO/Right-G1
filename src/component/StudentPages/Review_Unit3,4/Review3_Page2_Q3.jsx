import React, { useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Review3_Page2_Q3.css";

import sound1 from "../../../assets/unit4/sounds/U4P35EXEF.mp3";

import img1 from "../../../assets/unit4/imgs/U4P35EXEF-01-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P35EXEF-01-02.svg";
import img3 from "../../../assets/unit4/imgs/U4P35EXEF-02-01.svg";
import img4 from "../../../assets/unit4/imgs/U4P35EXEF-02-02.svg";
import img5 from "../../../assets/unit4/imgs/U4P35EXEF-03-01.svg";
import img6 from "../../../assets/unit4/imgs/U4P35EXEF-03-02.svg";
import img7 from "../../../assets/unit4/imgs/U4P35EXEF-04-01.svg";
import img8 from "../../../assets/unit4/imgs/U4P35EXEF-04-02.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

const Review3_Page2_Q3 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const items = [
    {
      id: 1,

      items: [
        {
          img: img1,

          word: "dates",

          isShortA: false,

          alt: "A bunch of dates hanging from a branch.",
        },

        {
          img: img2,

          word: "bag",

          isShortA: true,

          alt: "A blue school bag.",
        },
      ],
    },

    {
      id: 2,

      items: [
        {
          img: img3,

          word: "lake",

          isShortA: false,

          alt: "A small lake surrounded by land and plants.",
        },

        {
          img: img4,

          word: "hat",

          isShortA: true,

          alt: "A colorful hat with a flower decoration.",
        },
      ],
    },

    {
      id: 3,

      items: [
        {
          img: img5,

          word: "flag",

          isShortA: true,

          alt: "A red flag on a pole.",
        },

        {
          img: img6,

          word: "shape",

          isShortA: false,

          alt: "A red triangle shape.",
        },
      ],
    },

    {
      id: 4,

      items: [
        {
          img: img7,

          word: "cape",

          isShortA: false,

          alt: "A boy wearing a red cape.",
        },

        {
          img: img8,

          word: "fan",

          isShortA: true,

          alt: "A small electric fan.",
        },
      ],
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState([null, null, null, null]);

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO PLAYER DATA
  ===================================================== */

  const stopAtSecond = 6.45;

  const captions = [
    {
      start: 0,
      end: 6.26,
      text: "Page 35, Exercise F. Which word has a short A? Listen and circle.",
    },

    {
      start: 6.28,
      end: 10.03,
      text: "1. Dates. Bag.",
    },

    {
      start: 10.05,
      end: 12.19,
      text: "2. Lake. Hat.",
    },

    {
      start: 12.21,
      end: 15.24,
      text: "3. Flag. Shape.",
    },

    {
      start: 15.26,
      end: 19.09,
      text: "4. Cape. Fan.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (index) => lockedQuestions.includes(index);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (index, choiceIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(index)) {
      return;
    }

    const newAnswers = [...answers];

    newAnswers[index] = choiceIndex;

    setAnswers(newAnswers);

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

    answers.forEach((selected, index) => {
      const isCorrect = items[index].items[selected]?.isShortA === true;

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

    /* =================================================
       ALL CORRECT
    ================================================= */

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
    const correctSelections = items.map((item) =>
      item.items.findIndex((choice) => choice.isShortA),
    );

    setAnswers(correctSelections);

    setWrongQuestions([]);

    setLockedQuestions(items.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));

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
              Which word has{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                short a{" "}
              </span>
              ? Listen and circle.
            </>
          }
          subTitle={
            <>
              Listen to each pair, then tap the word with the{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                short-a
              </span>{" "}
              sound.
            </>
          }
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="Review3_Page2_Q3"
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
          <div className="container-review3-p2-q3">
            {items.map((item, index) => {
              const questionLocked = isQuestionLocked(index);

              return (
                <div className="shortA-options" key={item.id}>
                  {item.items.map((choice, chIndex) => {
                    const isSelected = answers[index] === chIndex;

                    const isWrong =
                      wrongQuestions.includes(index) &&
                      isSelected &&
                      !choice.isShortA;

                    const disabled =
                      questionLocked || showAnswer || checkCompleted;

                    return (
                      <div
                        key={chIndex}
                        style={{
                          display: "flex",

                          flexDirection: "column",

                          alignItems: "center",
                        }}
                      >
                        {/* =========================
                                IMAGE
                            ========================= */}

                        <img
                          src={choice.img}
                          className="shortA-img"
                          alt={choice.alt}
                        />

                        {/* =========================
                                WORD
                            ========================= */}

                        <p
                          className={`shortA-word ${
                            isSelected ? "selected" : ""
                          } ${showAnswer && choice.isShortA ? "correct" : ""} ${
                            isWrong ? "wrong" : ""
                          }`}
                          role="button"
                          tabIndex={disabled ? -1 : 0}
                          aria-disabled={disabled}
                          aria-pressed={isSelected}
                          aria-label={`${choice.word}${
                            isSelected ? ", selected" : ""
                          }. Press Enter or Space to select.`}
                          onClick={() => {
                            if (disabled) {
                              return;
                            }

                            handleSelect(index, chIndex);
                          }}
                          onKeyDown={(e) => {
                            if (disabled) {
                              return;
                            }

                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              handleSelect(index, chIndex);
                            }
                          }}
                        >
                          {choice.word}

                          {isWrong && (
                            <span
                              className="review3-p2-q3-wrong-x"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })}
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

export default Review3_Page2_Q3;
