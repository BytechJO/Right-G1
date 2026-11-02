import React, { useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./WB_Unit5_Page6_Q1.css";

import img1 from "../../../assets/U1 WB/U5/U5P32EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U5/U5P32EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U5/U5P32EXEA-03.svg";
import img6 from "../../../assets/U1 WB/U5/U5P32EXEA-04.svg";
import img7 from "../../../assets/U1 WB/U5/U5P32EXEA-05.svg";
import img8 from "../../../assets/U1 WB/U5/U5P32EXEA-06.svg";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    id: 1,
    letter: "k",

    images: [
      {
        id: 1,
        src: img1,
        value: 1,
        alt: "A key.",
      },

      {
        id: 2,
        src: img2,
        value: 2,
        alt: "A garden with plants and a fence.",
      },

      {
        id: 3,
        src: img3,
        value: 3,
        alt: "A kite.",
      },
    ],

    correct: [1, 3],
  },

  {
    id: 2,
    letter: "g",

    images: [
      {
        id: 1,
        src: img6,
        value: 1,
        alt: "A girl.",
      },

      {
        id: 2,
        src: img7,
        value: 2,
        alt: "A goat.",
      },

      {
        id: 3,
        src: img8,
        value: 3,
        alt: "A kitchen.",
      },
    ],

    correct: [1, 2],
  },
];

/* =====================================================
   COMPONENT
===================================================== */

export default function WB_Unit5_Page6_Q1() {
  const [answers, setAnswers] = useState({});

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     HELPERS
  ================================================= */

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  /* =================================================
     SELECT
  ================================================= */

  const handleSelect = (qId, value) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setAnswers((prev) => {
      const current = prev[qId] || [];

      /*
        Toggle selected image
      */

      if (current.includes(value)) {
        return {
          ...prev,

          [qId]: current.filter((v) => v !== value),
        };
      }

      /*
        Max 2 selections
      */

      if (current.length >= 2) {
        return prev;
      }

      return {
        ...prev,

        [qId]: [...current, value],
      };
    });

    /*
      أي تعديل بنفس السؤال
      يمسح X تبعه فقط
    */

    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  /* =================================================
     CHECK
  ================================================= */

  const handleCheck = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      لازم كل سؤال يكون مختار فيه خيارين
    */

    const incompleteQuestion = data.find((q) => {
      const selected = answers[q.id] || [];

      return selected.length < q.correct.length;
    });

    if (incompleteQuestion) {
      ValidationAlert.info(
        "Oops!",
        `Please select all required pictures in the ${incompleteQuestion.letter} row first.`,
      );

      return;
    }

    let correctCount = 0;

    const total = data.reduce((sum, q) => sum + q.correct.length, 0);

    const wrong = [];

    const newlyLocked = [];

    data.forEach((q) => {
      const studentAnswers = answers[q.id] || [];

      const sortedStudent = [...studentAnswers].sort();

      const sortedCorrect = [...q.correct].sort();

      const questionCorrect =
        sortedStudent.length === sortedCorrect.length &&
        sortedStudent.every((value, index) => value === sortedCorrect[index]);

      q.correct.forEach((correctValue) => {
        if (studentAnswers.includes(correctValue)) {
          correctCount++;
        }
      });

      if (questionCorrect) {
        newlyLocked.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    /*
      الصح فقط يقفل
    */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /*
      الغلط يظل editable
    */

    setWrongQuestions(wrong);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;margin-top:8px">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedQuestions(data.map((q) => q.id));

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    const correctAnswers = {};

    data.forEach((q) => {
      correctAnswers[q.id] = [...q.correct];
    });

    setAnswers(correctAnswers);

    setWrongQuestions([]);

    setLockedQuestions(data.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const handleReset = () => {
    setAnswers({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  /* =================================================
     RENDER
  ================================================= */

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
          title="Which pictures begin with the letter? Circle."
          subTitle="Say each picture name and tap it in the correct k or g row."
        />

        {data.map((q) => {
          const locked = isQuestionLocked(q.id);

          const wrong = wrongQuestions.includes(q.id);

          return (
            <div
              key={q.id}
              className="question-row-Unit5_Page5_Q2 w-full"
              style={{
                marginTop: "15px",
              }}
            >
              {/* =============================
                  LETTER
              ============================= */}

              <span
                style={{
                  color: "#2c5287",

                  fontSize: "40px",

                  fontWeight: "700",

                  marginLeft: "5px",
                }}
              >
                {q.letter}
              </span>

              {/* =============================
                  IMAGES
              ============================= */}

              <div className="images-row-wb-unit5-p6-q1">
                {q.images.map((img) => {
                  const isSelected = answers[q.id]?.includes(img.value);

                  const isWrongSelected =
                    wrong && isSelected && !q.correct.includes(img.value);

                  const disabled = locked || showAnswer || checkCompleted;

                  return (
                    <div
                      key={img.id}
                      role="button"
                      tabIndex={disabled ? -1 : 0}
                      aria-pressed={!!isSelected}
                      aria-label={`${img.alt} ${
                        isSelected ? "Selected." : ""
                      } Press Enter or Space to ${
                        isSelected ? "unselect" : "select"
                      } this picture for the letter ${q.letter}.`}
                      className={`img-box-Unit5_Page5_Q2
                          ${isSelected ? "selected-Unit5_Page5_Q2" : ""}
                          ${isWrongSelected ? "wrong" : ""}
                        `}
                      onClick={() => handleSelect(q.id, img.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          handleSelect(q.id, img.value);
                        }
                      }}
                      style={{
                        cursor: disabled ? "default" : "pointer",

                        position: "relative",
                      }}
                    >
                      <img src={img.src} alt={img.alt} />

                      {/* =============================
                            WRONG X
                        ============================= */}

                      {isWrongSelected && (
                        <div
                          className="wrong-mark-Unit5_Page5_Q2"
                          aria-hidden="true"
                        >
                          ✕
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>

        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
