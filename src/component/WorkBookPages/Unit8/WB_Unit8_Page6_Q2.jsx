import React, { useState } from "react";
import "./WB_Unit8_Page6_Q2.css";

import sound1 from "../../../assets/U1 WB/U8/audio/cd10pg50-instruction1-adult-lady_1N1yIVsG.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U8/U8P50EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P50EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U8/U8P50EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U8/U8P50EXEB-04.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    id: 1,

    src: img1,

    alt: "Three pictures showing a zebra, a zipper, and a seal.",

    options: [
      {
        label: "Zebra",
        answer: false,
      },
      {
        label: "Zipper",
        answer: false,
      },
      {
        label: "Seal",
        answer: true,
      },
    ],
  },

  {
    id: 2,

    src: img2,

    alt: "Three pictures showing soup, a zoo, and the sea.",

    options: [
      {
        label: "Soup",
        answer: false,
      },
      {
        label: "Zoo",
        answer: true,
      },
      {
        label: "Sea",
        answer: false,
      },
    ],
  },

  {
    id: 3,

    src: img3,

    alt: "Three pictures showing the sun, a sponge, and a zebra.",

    options: [
      {
        label: "Sun",
        answer: false,
      },
      {
        label: "Sponge",
        answer: false,
      },
      {
        label: "Zebra",
        answer: true,
      },
    ],
  },

  {
    id: 4,

    src: img4,

    alt: "Three pictures showing a zoo, a zipper, and a sponge.",

    options: [
      {
        label: "Zoo",
        answer: false,
      },
      {
        label: "Zipper",
        answer: false,
      },
      {
        label: "Sponge",
        answer: true,
      },
    ],
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit8_Page6_Q2 = () => {
  const [selected, setSelected] = useState({});

  /*
    null | correct | wrong
  */

  const [results, setResults] = useState(Array(data.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const stopAtSecond = 7.34;

  /* =====================================================
     CAPTIONS
  ===================================================== */

  const captions = [
    {
      start: 0,
      end: 7.34,
      text: "Phonics exercise B. Which picture begins with a different sound? Listen and write X.",
    },

    {
      start: 8.05,
      end: 12.0,
      text: "1, zebra, zipper, seal.",
    },

    {
      start: 12.58,
      end: 16.76,
      text: "2, soup, zoo, sea.",
    },

    {
      start: 17.47,
      end: 21.94,
      text: "3, sun, sponge, zebra.",
    },

    {
      start: 22.71,
      end: 26.88,
      text: "4, zoo, zipper, sponge.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionCorrect = (qIndex) => results[qIndex] === "correct";

  const isQuestionLocked = (qIndex) =>
    showAnswerMode || isQuestionCorrect(qIndex);

  const allCorrect = results.every((result) => result === "correct");

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    if (isQuestionLocked(qIndex)) {
      return;
    }

    const question = data[qIndex];

    /*
      Single select
    */

    setSelected((prev) => ({
      ...prev,

      [question.id]: optionIndex,
    }));

    /*
      إذا كان السؤال Wrong
      وشغّلنا تعديل جديد:
      نشيل wrong لهذا السؤال فقط.
    */

    setResults((prev) => {
      const copy = [...prev];

      if (copy[qIndex] === "wrong") {
        copy[qIndex] = null;
      }

      return copy;
    });
  };

  /* =====================================================
     KEYBOARD SELECT
  ===================================================== */

  const handleOptionKeyDown = (e, qIndex, optionIndex) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    handleSelect(qIndex, optionIndex);
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    /* =================================================
       REQUIRE ALL UNLOCKED QUESTIONS
    ================================================= */

    for (let qIndex = 0; qIndex < data.length; qIndex++) {
      if (isQuestionCorrect(qIndex)) {
        continue;
      }

      const question = data[qIndex];

      if (selected[question.id] === undefined) {
        ValidationAlert.info(
          `Please select an answer for question ${qIndex + 1}.`,
        );

        return;
      }
    }

    /* =================================================
       VALIDATE
    ================================================= */

    const nextResults = [...results];

    let correctCount = 0;

    data.forEach((question, qIndex) => {
      /*
          Keep already correct
        */

      if (isQuestionCorrect(qIndex)) {
        nextResults[qIndex] = "correct";

        correctCount++;

        return;
      }

      const chosenIndex = selected[question.id];

      const selectedOption = question.options[chosenIndex];

      if (selectedOption?.answer === true) {
        nextResults[qIndex] = "correct";

        correctCount++;
      } else {
        nextResults[qIndex] = "wrong";
      }
    });

    setResults(nextResults);

    const total = data.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div
        style="
          font-size:20px;
          margin-top:10px;
          text-align:center;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
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

  const showAnswers = () => {
    const correctSelection = {};

    data.forEach((question) => {
      const correctIndex = question.options.findIndex(
        (option) => option.answer === true,
      );

      correctSelection[question.id] = correctIndex;
    });

    setSelected(correctSelection);

    setResults(Array(data.length).fill("correct"));

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setSelected({});

    setResults(Array(data.length).fill(null));

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
        className="div-forall"
        style={{
          gap: "5px",
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title={
            <>
              Which picture begins with a{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                different sound
              </span>
              ? Listen and write{" "}
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
          subTitle="Listen to each group and tap the picture with the different first sound."
        />

        <QuestionAudioPlayer
          src={sound1}
          stopAtSecond={stopAtSecond}
          captions={captions}
          pageId="unit8-page50-qA-WB"
        />

        <div className="shorti-container-wb-unit8-p6-q2">
          {data.map((question, qIndex) => {
            const locked = isQuestionLocked(qIndex);

            const wrong = results[qIndex] === "wrong";

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
                  {/* =================================================
                        IMAGE
                    ================================================= */}

                  <img
                    src={question.src}
                    className="main-img-wb-unit8-p6-q2"
                    alt={question.alt}
                  />

                  {/* =================================================
                        OPTIONS
                    ================================================= */}

                  <div className="options-review6-p2-q1">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selected[question.id] === optionIndex;

                      const showWrong = wrong && isSelected && !option.answer;

                      return (
                        <div
                          key={optionIndex}
                          role="button"
                          tabIndex={locked ? -1 : 0}
                          aria-pressed={isSelected}
                          aria-label={`${option.label}. ${
                            isSelected ? "Selected." : "Not selected."
                          } ${
                            locked
                              ? "Question is correct and locked."
                              : "Press Enter or Space to select."
                          }`}
                          className={`
                                option-review6-p2-q1

                                ${isSelected ? "selected-review6-p2-q1" : ""}

                                ${showWrong ? "wrong-option-wb-u8-p6-q2" : ""}
                              `}
                          onClick={() => handleSelect(qIndex, optionIndex)}
                          onKeyDown={(e) =>
                            handleOptionKeyDown(e, qIndex, optionIndex)
                          }
                        >
                          {/* =============================
                                  WRONG X
                              ============================= */}

                          {showWrong && (
                            <span
                              className="wrong-x-circle-wb-unit8-p6-q2"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}

                          {/* =============================
                                  SELECTION MARK
                              ============================= */}

                          <span
                            className="check-box-review6-p2-q1"
                            aria-hidden="true"
                          >
                            {isSelected ? "✕" : ""}
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

      {/* =====================================================
          BUTTONS
      ===================================================== */}

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

export default WB_Unit8_Page6_Q2;
