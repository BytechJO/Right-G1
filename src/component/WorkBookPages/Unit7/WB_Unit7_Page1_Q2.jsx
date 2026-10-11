import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./WB_Unit7_Page1_Q2.css";

import bat from "../../../assets/U1 WB/U7/U7P39EXEB-01.svg";
import box from "../../../assets/U1 WB/U7/U7P39EXEB-02.svg";
import bucket from "../../../assets/U1 WB/U7/U7P39EXEB-03.svg";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: 1,
    correct: "hungry",
    options: ["sad", "hungry"],
    image: bat,
    alt: "A hungry boy thinking about a bowl of food.",
  },

  {
    id: 2,
    correct: "scared",
    options: ["scared", "hungry"],
    image: box,
    alt: "A girl looking scared while a spider is near her.",
  },

  {
    id: 3,
    correct: "happy",
    options: ["happy", "bored"],
    image: bucket,
    alt: "A happy boy playing with a colorful ball.",
  },
];

const colors = ["red", "blue", "green", "orange", "purple", "yellow"];

/* =====================================================
   COMPONENT
===================================================== */

export default function WB_Unit7_Page1_Q2() {
  /* =====================================================
     ANSWERS

     {
       0: {
         value: "hungry",
         color: "red"
       }
     }
  ===================================================== */

  const [answers, setAnswers] = useState({});

  /* =====================================================
     WRONG QUESTIONS
  ===================================================== */

  const [wrongAnswers, setWrongAnswers] = useState([]);

  /* =====================================================
     PROGRESSIVE LOCK
  ===================================================== */

  const [lockedQuestions, setLockedQuestions] = useState([]);

  /* =====================================================
     FINAL COMPLETE
  ===================================================== */

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     SELECTED OPTION FOR PALETTE

     {
       qIndex: 0,
       value: "hungry"
     }
  ===================================================== */

  const [selectedOption, setSelectedOption] = useState(null);

  /* =====================================================
     REFS
  ===================================================== */

  const wordRefs = useRef({});

  const colorRefs = useRef({});

  /* =====================================================
     HELPERS
  ===================================================== */

  const getOptionKey = (qIndex, word) => `${qIndex}-${word}`;

  const isQuestionLocked = (qIndex) => lockedQuestions.includes(qIndex);

  /* =====================================================
     OPEN PALETTE
  ===================================================== */

  const openPalette = (qIndex, word, moveFocusToFirstColor = false) => {
    if (checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setSelectedOption({
      qIndex,
      value: word,
    });

    /*
      Keyboard:
      أول ما تنفتح الـpalette
      الفوكس يروح لأول لون مباشرة.
    */

    if (moveFocusToFirstColor) {
      window.setTimeout(() => {
        colorRefs.current[`${qIndex}-${word}-${colors[0]}`]?.focus();
      }, 0);
    }
  };

  /* =====================================================
     MOUSE WORD CLICK
  ===================================================== */

  const handleOptionClick = (qIndex, word) => {
    if (checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    const sameOption =
      selectedOption?.qIndex === qIndex && selectedOption?.value === word;

    /*
      إذا ضغط Mouse مرة ثانية
      على نفس الكلمة، نسكر الـpalette.
    */

    if (sameOption) {
      setSelectedOption(null);

      return;
    }

    openPalette(qIndex, word, false);
  };

  /* =====================================================
     KEYBOARD WORD
  ===================================================== */

  const handleOptionKeyDown = (e, qIndex, word) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();

    e.stopPropagation();

    if (checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    openPalette(qIndex, word, true);
  };

  /* =====================================================
     APPLY COLOR
  ===================================================== */

  const applyColor = (color) => {
    if (!selectedOption) {
      return;
    }

    const { qIndex, value } = selectedOption;

    if (checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,

      [qIndex]: {
        value,
        color,
      },
    }));

    /*
      تعديل نفس السؤال
      يشيل X عنه فقط.
    */

    setWrongAnswers((prev) => prev.filter((index) => index !== qIndex));

    setSelectedOption(null);

    /*
      بعد اختيار اللون
      رجع الفوكس لنفس الكلمة.
    */

    window.setTimeout(() => {
      wordRefs.current[getOptionKey(qIndex, value)]?.focus();
    }, 0);
  };

  /* =====================================================
     COLOR KEYBOARD
  ===================================================== */

  const handleColorKeyDown = (e, color) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      applyColor(color);

      return;
    }

    /* =============================================
       ESCAPE
    ============================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      if (!selectedOption) {
        return;
      }

      const { qIndex, value } = selectedOption;

      setSelectedOption(null);

      window.setTimeout(() => {
        wordRefs.current[getOptionKey(qIndex, value)]?.focus();
      }, 0);
    }
  };

  /* =====================================================
     CLOSE PALETTE
  ===================================================== */

  const closePalette = () => {
    if (!selectedOption) {
      return;
    }

    const { qIndex, value } = selectedOption;

    setSelectedOption(null);

    window.setTimeout(() => {
      wordRefs.current[getOptionKey(qIndex, value)]?.focus();
    }, 0);
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers2 = () => {
    if (checkCompleted) {
      return;
    }

    /* =============================================
       لازم كل الأسئلة الغير مقفولة يكون إلها جواب
    ============================================= */

    const notAnswered = questions.some((_, index) => {
      if (isQuestionLocked(index)) {
        return false;
      }

      return !answers[index];
    });

    if (notAnswered) {
      ValidationAlert.info(
        "Oops!",
        "Please choose a word for all pictures before checking.",
      );

      return;
    }

    let correct = 0;

    const wrong = [];

    const newlyLocked = [];

    questions.forEach((question, index) => {
      /*
          سؤال صح من Check سابق.
        */

      if (isQuestionLocked(index)) {
        correct++;

        return;
      }

      if (answers[index]?.value === question.correct) {
        correct++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /* =============================================
       LOCK CORRECT ONLY
    ============================================= */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /* =============================================
       WRONG REMAIN EDITABLE
    ============================================= */

    setWrongAnswers(wrong);

    setSelectedOption(null);

    const total = questions.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    /* =============================================
       ALL CORRECT
    ============================================= */

    if (correct === total) {
      setLockedQuestions(questions.map((_, index) => index));

      setWrongAnswers([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswer = () => {
    const correctAnswers = {};

    questions.forEach((question, index) => {
      correctAnswers[index] = {
        value: question.correct,

        color: "red",
      };
    });

    setAnswers(correctAnswers);

    setLockedQuestions(questions.map((_, index) => index));

    setWrongAnswers([]);

    setSelectedOption(null);

    setCheckCompleted(true);
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const startAgain = () => {
    setAnswers({});

    setWrongAnswers([]);

    setLockedQuestions([]);

    setSelectedOption(null);

    setCheckCompleted(false);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      style={{
        display: "flex",

        justifyContent: "center",

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
          title="Look, read, and color."
          subTitle="Look at the picture and color the word that names the feeling."
        />

        {/* =================================================
            QUESTIONS
        ================================================= */}

        <div className="word-section1-wb-u7-p1-q2">
          {questions.map((question, qIndex) => (
            <div key={question.id} className="question-box-wb-u3-p1-q2">
              {/* =================================================
                    IMAGE
                ================================================= */}

              <img
                src={question.image}
                alt={question.alt}
                style={{
                  height: "170px",

                  width: "auto",
                }}
              />

              {/* =================================================
                    WORD OPTIONS
                ================================================= */}

              <div className="numbers-row-wb-u7-p1-q2">
                {question.options.map((word) => {
                  const optionKey = getOptionKey(qIndex, word);

                  const questionLocked = isQuestionLocked(qIndex);

                  const isPaletteOpen =
                    selectedOption?.qIndex === qIndex &&
                    selectedOption?.value === word;

                  const isSelected = answers[qIndex]?.value === word;

                  const isWrong = wrongAnswers.includes(qIndex) && isSelected;

                  return (
                    <div
                      key={word}
                      className="color-option-wrapper-wb-u7-p1-q2"
                    >
                      {/* =====================================
                              WORD
                          ===================================== */}

                      <span
                        ref={(el) => {
                          wordRefs.current[optionKey] = el;
                        }}
                        role="button"
                        tabIndex={questionLocked || checkCompleted ? -1 : 0}
                        aria-disabled={questionLocked || checkCompleted}
                        aria-pressed={isSelected}
                        aria-label={`${word}. Press Enter or Space to choose a color.`}
                        className="number-option-wb-u7-p1-q2"
                        style={{
                          color: isSelected
                            ? answers[qIndex]?.color
                            : "transparent",

                          WebkitTextStrokeColor: isSelected
                            ? answers[qIndex]?.color
                            : "#333",

                          cursor:
                            questionLocked || checkCompleted
                              ? "default"
                              : "pointer",
                        }}
                        onClick={() => handleOptionClick(qIndex, word)}
                        onKeyDown={(e) => handleOptionKeyDown(e, qIndex, word)}
                      >
                        {word}
                      </span>

                      {/* =====================================
                              WRONG X
                          ===================================== */}

                      {isWrong && (
                        <span className="wrong-mark-circle" aria-hidden="true">
                          ✕
                        </span>
                      )}

                      {/* =====================================
                              COLOR PALETTE
                          ===================================== */}

                      {isPaletteOpen && (
                        <div
                          className="color-palette-inline-wb-u7-p1-q2"
                          role="group"
                          aria-label={`Choose a color for ${word}`}
                        >
                          {colors.map((color) => (
                            <div
                              key={color}
                              ref={(el) => {
                                colorRefs.current[
                                  `${qIndex}-${word}-${color}`
                                ] = el;
                              }}
                              role="button"
                              tabIndex={0}
                              aria-label={`Color ${color}`}
                              className="color-circle"
                              style={{
                                backgroundColor: color,
                              }}
                              onClick={() => applyColor(color)}
                              onKeyDown={(e) => handleColorKeyDown(e, color)}
                            />
                          ))}

                          {/* =====================================
                                  CLOSE
                              ===================================== */}

                          <div
                            role="button"
                            tabIndex={0}
                            aria-label="Close color choices"
                            className="color-circle erase"
                            onClick={closePalette}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" ||
                                e.key === " " ||
                                e.key === "Escape"
                              ) {
                                e.preventDefault();

                                e.stopPropagation();

                                closePalette();
                              }
                            }}
                          >
                            ✕
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={startAgain} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={checkAnswers2} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
