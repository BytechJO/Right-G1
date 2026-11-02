import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit3_Page1_Q2.css";

import bat from "../../../assets/U1 WB/U3/SVG/U3P15EXEB-01.svg";
import box from "../../../assets/U1 WB/U3/SVG/U3P15EXEB-02.svg";
import bucket from "../../../assets/U1 WB/U3/SVG/U3P15EXEB-03.svg";
import boat from "../../../assets/U1 WB/U3/SVG/U3P15EXEB-04.svg";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const QUESTIONS = [
  {
    id: 1,
    correct: 2,
    options: [1, 2],
    image: bat,
    alt: "A group of bats.",
  },
  {
    id: 2,
    correct: 2,
    options: [4, 2],
    image: box,
    alt: "A group of boxes.",
  },
  {
    id: 3,
    correct: 7,
    options: [7, 3],
    image: bucket,
    alt: "A group of buckets.",
  },
  {
    id: 4,
    correct: 6,
    options: [6, 8],
    image: boat,
    alt: "A group of boats.",
  },
];

const COLORS = ["red", "blue", "green", "orange", "purple", "yellow"];

export default function WB_Unit3_Page1_Q2() {
  /* =====================================================
     REFS
  ===================================================== */

  const numberRefs = useRef({});

  const colorButtonRefs = useRef([]);

  /* =====================================================
     STATES
  ===================================================== */

  /*
    selectedNumber:
    {
      qIndex,
      value,
      optionIndex
    }
  */
  const [selectedNumber, setSelectedNumber] = useState(null);

  /*
    answers:
    {
      0: {
        value: 2,
        color: "red"
      }
    }
  */
  const [answers, setAnswers] = useState({});

  const [wrongAnswers, setWrongAnswers] = useState([]);

  /*
    الأسئلة الصحيحة فقط
    هي اللي تتقفل
  */
  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [liveMessage, setLiveMessage] = useState("");

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (qIndex) => lockedQuestions.includes(qIndex);

  /* =====================================================
     OPEN COLOR PALETTE
  ===================================================== */

  const openColorPalette = (qIndex, value, optionIndex) => {
    if (showAnswerMode || completed || isQuestionLocked(qIndex)) {
      return;
    }

    colorButtonRefs.current = [];

    setSelectedNumber({
      qIndex,
      value,
      optionIndex,
    });

    setLiveMessage(`Number ${value} selected. Choose a color.`);

    /*
      لازم نستنى الـpalette تنرسم
      وبعدين نودي focus لأول لون
    */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        colorButtonRefs.current[0]?.focus();
      });
    });
  };

  /* =====================================================
     CLOSE PALETTE
  ===================================================== */

  const closeColorPalette = () => {
    if (!selectedNumber) {
      return;
    }

    const { qIndex, value } = selectedNumber;

    setSelectedNumber(null);

    setLiveMessage("Color palette closed.");

    requestAnimationFrame(() => {
      numberRefs.current[`${qIndex}-${value}`]?.focus();
    });
  };

  /* =====================================================
     APPLY COLOR
  ===================================================== */

  const applyColor = (color) => {
    if (!selectedNumber) {
      return;
    }

    const { qIndex, value } = selectedNumber;

    setAnswers((prev) => ({
      ...prev,

      [qIndex]: {
        value,
        color,
      },
    }));

    /*
      لو كان السؤال غلط من Check سابق
      أول ما المستخدم يعدله نشيل X
    */
    setWrongAnswers((prev) => prev.filter((index) => index !== qIndex));

    setSelectedNumber(null);

    setLiveMessage(`Number ${value} colored ${color}.`);

    /*
      نرجع focus لنفس الرقم
    */
    requestAnimationFrame(() => {
      numberRefs.current[`${qIndex}-${value}`]?.focus();
    });
  };

  /* =====================================================
     REMOVE / CANCEL COLOR
  ===================================================== */

  const removeColor = () => {
    if (!selectedNumber) {
      return;
    }

    const { qIndex, value } = selectedNumber;

    /*
      لو هذا الرقم هو الإجابة الحالية
      نشيله
    */
    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      if (updated[qIndex]?.value === value) {
        delete updated[qIndex];
      }

      return updated;
    });

    setWrongAnswers((prev) => prev.filter((index) => index !== qIndex));

    setSelectedNumber(null);

    setLiveMessage("Selection removed.");

    requestAnimationFrame(() => {
      numberRefs.current[`${qIndex}-${value}`]?.focus();
    });
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers2 = () => {
    if (showAnswerMode || completed) {
      return;
    }

    const notAnswered = QUESTIONS.some((_, index) => !answers[index]);

    if (notAnswered) {
      ValidationAlert.info(
        "Oops!",
        "Please choose and color a number for all pictures before checking.",
      );

      return;
    }

    let correct = 0;

    const wrong = [];

    const newlyLocked = [];

    QUESTIONS.forEach((q, index) => {
      if (answers[index]?.value === q.correct) {
        correct++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      Lock فقط للإجابات الصحيحة
    */
    setLockedQuestions((prev) => [...new Set([...prev, ...newlyLocked])]);

    setWrongAnswers(wrong);

    setSelectedNumber(null);

    if (correct === QUESTIONS.length) {
      setCompleted(true);

      setLockedQuestions(QUESTIONS.map((_, index) => index));

      setWrongAnswers([]);

      ValidationAlert.success(`Score: ${correct}/${QUESTIONS.length}`);

      return;
    }

    if (correct === 0) {
      ValidationAlert.error(`Score: ${correct}/${QUESTIONS.length}`);
    } else {
      ValidationAlert.warning(`Score: ${correct}/${QUESTIONS.length}`);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswer = () => {
    if (showAnswerMode || completed) {
      return;
    }

    const correctAnswers = {};

    QUESTIONS.forEach((q, index) => {
      correctAnswers[index] = {
        value: q.correct,
        color: "red",
      };
    });

    setAnswers(correctAnswers);

    setLockedQuestions(QUESTIONS.map((_, index) => index));

    setWrongAnswers([]);
    setSelectedNumber(null);
    setShowAnswerMode(true);
    setCompleted(true);
  };
  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setAnswers({});

    setSelectedNumber(null);

    setWrongAnswers([]);

    setLockedQuestions([]);

    setShowAnswerMode(false);

    setCompleted(false);

    setLiveMessage("");
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="wb-u3-p1-q2-main">
      {/* SCREEN READER LIVE MESSAGE */}

      <div
        className="sr-only-wb-u3-p1-q2"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveMessage}
      </div>

      <div className="div-forall">
        {/* HEADER */}

        <ExerciseHeader
          sectionLetter="B"
          title="Look, count, and color."
          subTitle="Count the objects, then color the numeral that matches."
        />

        {/* QUESTIONS */}

        <div className="word-section1-wb-u3-p1-q2 w-full">
          {QUESTIONS.map((q, qIndex) => {
            const locked = isQuestionLocked(qIndex);

            return (
              <div
                key={q.id}
                className={`question-box-wb-u3-p1-q2 ${
                  locked ? "question-locked-wb-u3-p1-q2" : ""
                }`}
              >
                {/* IMAGE */}

                <img src={q.image} alt={q.alt} className="img-wb-unit3-p1-q2" />

                {/* NUMBERS */}

                <div className="numbers-row-wb-u3-p1-q2">
                  {q.options.map((num, optionIndex) => {
                    const selected = answers[qIndex]?.value === num;

                    const paletteOpen =
                      selectedNumber?.qIndex === qIndex &&
                      selectedNumber?.value === num;

                    const wrong = wrongAnswers.includes(qIndex) && selected;

                    return (
                      <div
                        key={num}
                        className="number-choice-wrapper-wb-u3-p1-q2"
                      >
                        {/* NUMBER */}

                        <span
                          ref={(el) => {
                            numberRefs.current[`${qIndex}-${num}`] = el;
                          }}
                          className={`number-option-wb-u3-p1-q2 ${
                            selected ? "selected-number-wb-u3-p1-q2" : ""
                          } ${locked ? "locked-number-wb-u3-p1-q2" : ""}`}
                          style={{
                            color: selected
                              ? answers[qIndex]?.color
                              : "transparent",

                            WebkitTextStrokeColor: selected
                              ? answers[qIndex]?.color
                              : "#333",
                          }}
                          role="button"
                          tabIndex={locked ? -1 : 0}
                          aria-disabled={locked}
                          aria-pressed={selected}
                          aria-haspopup="true"
                          aria-expanded={paletteOpen}
                          aria-label={
                            locked
                              ? `Number ${num}. ${
                                  selected
                                    ? "Correct answer. Locked."
                                    : "Unavailable."
                                }`
                              : selected
                                ? `Number ${num}, selected and colored ${answers[qIndex]?.color}. Press Enter or Space to change the color.`
                                : `Number ${num}. Press Enter or Space to select and color it.`
                          }
                          onClick={() =>
                            openColorPalette(qIndex, num, optionIndex)
                          }
                          onKeyDown={(e) => {
                            if (locked) {
                              return;
                            }

                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              openColorPalette(qIndex, num, optionIndex);
                            }
                          }}
                        >
                          {num}
                        </span>

                        {/* WRONG X */}

                        {wrong && (
                          <span
                            className="wrong-mark-circle"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}

                        {/* =========================================
                                INLINE COLOR PALETTE

                                جنب الرقم نفسه
                            ========================================= */}

                        {paletteOpen && (
                          <div
                            className={`inline-color-palette-wb-u3-p1-q2 ${
                              optionIndex === 0
                                ? "palette-right-wb-u3-p1-q2"
                                : "palette-left-wb-u3-p1-q2"
                            }`}
                            role="group"
                            aria-label={`Choose a color for number ${num}`}
                          >
                            {COLORS.map((color, colorIndex) => (
                              <button
                                key={color}
                                ref={(el) => {
                                  colorButtonRefs.current[colorIndex] = el;
                                }}
                                type="button"
                                className="color-circle-wb-u3-p1-q2"
                                style={{
                                  backgroundColor: color,
                                }}
                                aria-label={`Color ${color}`}
                                onClick={() => applyColor(color)}
                                onKeyDown={(e) => {
                                  if (e.key === "Escape") {
                                    e.preventDefault();

                                    closeColorPalette();
                                  }
                                }}
                              />
                            ))}

                            {/* ERASE */}

                            <button
                              ref={(el) => {
                                colorButtonRefs.current[COLORS.length] = el;
                              }}
                              type="button"
                              className="color-circle-wb-u3-p1-q2 erase-color-wb-u3-p1-q2"
                              aria-label="Remove selection"
                              onClick={removeColor}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                  e.preventDefault();

                                  closeColorPalette();
                                }
                              }}
                            >
                              ✕
                            </button>
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
      </div>

      {/* ACTION BUTTONS */}

      <div className="action-buttons-container">
        <button onClick={handleReset} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={showAnswer} className="show-answer-btn ">
          Show Answer
        </button>
        <button onClick={checkAnswers2} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
