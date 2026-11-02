import { useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit5_Page5_Q1.css";

import sound1 from "../../../assets/unit5/sounds/U5P44EXEA1.mp3";

import bat from "../../../assets/unit5/imgs/U5P44EXEA1-01.svg";
import box from "../../../assets/unit5/imgs/U5P44EXEA1-02.svg";
import bucket from "../../../assets/unit5/imgs/U5P44EXEA1-03.svg";
import boat from "../../../assets/unit5/imgs/U5P44EXEA1-04.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const Unit5_Page5_Q1 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const items = [
    {
      img: bat,
      alt: "A goat standing.",
      correct: "g",
    },
    {
      img: box,
      alt: "A kangaroo standing upright.",
      correct: "k",
    },
    {
      img: bucket,
      alt: "A colorful kite with a tail.",
      correct: "k",
    },
    {
      img: boat,
      alt: "A bunch of purple grapes.",
      correct: "g",
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
     AUDIO
  ===================================================== */

  const stopAtSecond = 10.8;

  const captions = [
    {
      start: 0,
      end: 5.13,
      text: "Page 44, Right Activities, Exercise A, Number 1.",
    },
    {
      start: 5.15,
      end: 10.25,
      text: "Does it begin with G or K? Listen and circle.",
    },
    {
      start: 10.27,
      end: 13.04,
      text: "1. Goat",
    },
    {
      start: 13.07,
      end: 15.1,
      text: "2. Kangaroo",
    },
    {
      start: 15.12,
      end: 17.18,
      text: "3. Kite",
    },
    {
      start: 17.2,
      end: 20.04,
      text: "4. Grapes",
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
      شيل الـ X فقط من نفس السؤال
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
      const correct =
        answer?.toLowerCase() === items[index].correct.toLowerCase();

      if (correct) {
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
      الغلط فقط يظل عليه X
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
    setAnswers(items.map((item) => item.correct));

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
      <div
        className="div-forall"
        style={{
          gap: "60px",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          questionNumber="1"
          title={
            <>
              Does it begin with <span style={{ color: "red" }}>g</span> or{" "}
              <span style={{ color: "red" }}>k</span>? Listen and circle.
            </>
          }
          subTitle={
            <>
              Look at each picture, then tap{" "}
              <span style={{ color: "red" }}>g</span> or{" "}
              <span style={{ color: "red" }}>k</span>.
            </>
          }
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit5-page44-Q-A-SB"
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
          <div className="gk-container-unit5-pg5-q1">
            {items.map((item, index) => {
              const locked = isLocked(index);

              return (
                <div className="gk-item" key={index}>
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

                  <div className="gk-options">
                    {/* =========================
                        G OPTION
                    ========================= */}

                    <span
                      role="button"
                      tabIndex={
                        locked || showAnswerState || checkCompleted ? -1 : 0
                      }
                      aria-pressed={answers[index] === "g"}
                      aria-label={`Choose g for item ${index + 1}`}
                      className={`gk-option
                        ${answers[index] === "g" ? "selected3" : ""}
                        ${
                          wrongItems.includes(index) && answers[index] === "g"
                            ? "wrong-answer"
                            : ""
                        }
                      `}
                      style={{
                        position: "relative",
                        cursor:
                          locked || showAnswerState || checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                      onClick={() => handleSelect(index, "g")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          handleSelect(index, "g");
                        }
                      }}
                    >
                      g
                      {wrongItems.includes(index) &&
                        answers[index] === "g" &&
                        answers[index] !== item.correct && (
                          <span
                            className="wrong-mark-Unit5_Page5_Q1"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}
                    </span>

                    {/* =========================
                        K OPTION
                    ========================= */}

                    <span
                      role="button"
                      tabIndex={
                        locked || showAnswerState || checkCompleted ? -1 : 0
                      }
                      aria-pressed={answers[index] === "k"}
                      aria-label={`Choose k for item ${index + 1}`}
                      className={`gk-option
                        ${answers[index] === "k" ? "selected3" : ""}
                        ${
                          wrongItems.includes(index) && answers[index] === "k"
                            ? "wrong-answer"
                            : ""
                        }
                      `}
                      style={{
                        position: "relative",
                        cursor:
                          locked || showAnswerState || checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                      onClick={() => handleSelect(index, "k")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          handleSelect(index, "k");
                        }
                      }}
                    >
                      k
                      {wrongItems.includes(index) &&
                        answers[index] === "k" &&
                        answers[index] !== item.correct && (
                          <span
                            className="wrong-mark-Unit5_Page5_Q1"
                            aria-hidden="true"
                          >
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

export default Unit5_Page5_Q1;
