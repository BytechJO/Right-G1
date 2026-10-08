import React, { useState } from "react";
import "./WB_Unit6_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U6/U6P38EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P38EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P38EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P38EXEA-04.svg";
import img5 from "../../../assets/U1 WB/U6/U6P38EXEA-05.svg";
import img6 from "../../../assets/U1 WB/U6/U6P38EXEA-06.svg";

import sound1 from "../../../assets/U1 WB/U6/audio/cd8pg38-instruction1-adult-lady_19BTUJxp.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const WB_Unit6_Page6_Q1 = () => {
  const stopAtSecond = 7.66;

  /* =====================================================
     CAPTIONS
  ===================================================== */

  const captions = [
    {
      start: 0,
      end: 7.66,
      text: "Phonics exercise A. Does it have short I? Listen and write check or X.",
    },
    {
      start: 8.46,
      end: 9.62,
      text: "1, figs.",
    },
    {
      start: 10.08,
      end: 11.56,
      text: "2, nine.",
    },
    {
      start: 12.16,
      end: 13.74,
      text: "3, ship.",
    },
    {
      start: 14.32,
      end: 15.78,
      text: "4, kite.",
    },
    {
      start: 16.46,
      end: 17.96,
      text: "5, sit.",
    },
    {
      start: 18.72,
      end: 20.2,
      text: "6, pie.",
    },
  ];

  /* =====================================================
     QUESTIONS
  ===================================================== */

  const questions = [
    {
      id: 1,
      image: img1,
      alt: "Two figs, one whole fig and one fig cut open.",
      word: "figs",
      correct: "✓",
    },
    {
      id: 2,
      image: img2,
      alt: "The yellow number nine.",
      word: "nine",
      correct: "✗",
    },
    {
      id: 3,
      image: img3,
      alt: "A passenger ship sailing on the water.",
      word: "ship",
      correct: "✓",
    },
    {
      id: 4,
      image: img4,
      alt: "A colorful kite flying with a green tail.",
      word: "kite",
      correct: "✗",
    },
    {
      id: 5,
      image: img5,
      alt: "A boy sitting in a chair.",
      word: "sit",
      correct: "✓",
    },
    {
      id: 6,
      image: img6,
      alt: "A baked pie in a round pie dish.",
      word: "pie",
      correct: "✗",
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState({});

  // يحتوي فقط على العناصر التي تم فحصها
  // correct | wrong
  const [results, setResults] = useState({});

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     HELPERS
  ===================================================== */

  const isCorrectLocked = (id) => results[id] === "correct" || showAnswerMode;

  const allCorrect = questions.every(
    (q) =>
      answers[q.id] === q.correct &&
      (results[q.id] === "correct" || showAnswerMode),
  );

  /* =====================================================
     SELECT ANSWER
  ===================================================== */

  const selectAnswer = (id, value) => {
    // Show Answer يقفل الكل
    if (showAnswerMode) return;

    // الصحيح المقفول ما بنعدله
    if (results[id] === "correct") return;

    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));

    // تعديل نفس السؤال يشيل الـ wrong state عنه فقط
    setResults((prev) => {
      if (!prev[id]) return prev;

      const updated = { ...prev };
      delete updated[id];

      return updated;
    });
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    const correctAnswers = {};
    const correctResults = {};

    questions.forEach((q) => {
      correctAnswers[q.id] = q.correct;
      correctResults[q.id] = "correct";
    });

    setAnswers(correctAnswers);
    setResults(correctResults);
    setShowAnswerMode(true);
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    // بعد ما الكل صح، Check يضل ظاهر لكن no-op
    if (allCorrect || showAnswerMode) return;

    const hasEmpty = questions.some(
      (q) => results[q.id] !== "correct" && !answers[q.id],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please choose ✓ or ✗ for all questions!");
      return;
    }

    const updatedResults = { ...results };

    let correctCount = 0;

    questions.forEach((q) => {
      // السؤال الصحيح والمقفول يظل كما هو
      if (results[q.id] === "correct") {
        updatedResults[q.id] = "correct";
        correctCount += 1;
        return;
      }

      if (answers[q.id] === q.correct) {
        updatedResults[q.id] = "correct";
        correctCount += 1;
      } else {
        updatedResults[q.id] = "wrong";
      }
    });

    setResults(updatedResults);

    const total = questions.length;

    const scoreMsg = `${correctCount} / ${total}`;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size:20px; text-align:center; margin-top:8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${scoreMsg}
        </span>
      </div>
    `;

    if (correctCount === total) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
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
    setResults({});
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
          gap: "20px",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          title={
            <>
              Does it have a <span style={{ color: "red" }}>short i</span>?
              Listen and write <span style={{ color: "red" }}>✓</span> or{" "}
              <span style={{ color: "red" }}>✗</span>.
            </>
          }
          subTitle={
            <>
              Listen and choose <span style={{ color: "red" }}>✓</span> if the
              word has <span style={{ color: "red" }}>short i</span> or{" "}
              <span style={{ color: "red" }}>✗</span> if it does not.
            </>
          }
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit6-page38-qA-WB"
        />

        <div className="wb-unit6-p6-q1-container">
          {questions.map((q) => {
            const locked = isCorrectLocked(q.id);
            const wrong = results[q.id] === "wrong";

            return (
              <div key={q.id} className="unit6-p1-q1-question-box">
                <p
                  className="unit6-p1-q1-question-text"
                  style={{ fontSize: "20px" }}
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

                <div className="wb-unit6-p6-q1-flex">
                  <img
                    src={q.image}
                    alt={q.alt}
                    className="unit6-p1-q1-question-img"
                  />

                  <div className="wb-unit6-p6-q1-options-box">
                    {/* =========================
                        ✓ OPTION
                    ========================== */}

                    <div className="option-wrapper">
                      <div
                        className={`option-btn ${
                          answers[q.id] === "✓" ? "selected" : ""
                        }`}
                        role="button"
                        tabIndex={locked ? -1 : 0}
                        aria-label={`Question ${q.id}, ${q.word}: choose yes, it has short i`}
                        aria-pressed={answers[q.id] === "✓"}
                        onClick={() => {
                          if (!locked) {
                            selectAnswer(q.id, "✓");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (locked) return;

                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectAnswer(q.id, "✓");
                          }
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

                    {/* =========================
                        ✗ OPTION
                    ========================== */}

                    <div className="option-wrapper">
                      <div
                        className={`option-btn ${
                          answers[q.id] === "✗" ? "selected" : ""
                        }`}
                        role="button"
                        tabIndex={locked ? -1 : 0}
                        aria-label={`Question ${q.id}, ${q.word}: choose no, it does not have short i`}
                        aria-pressed={answers[q.id] === "✗"}
                        onClick={() => {
                          if (!locked) {
                            selectAnswer(q.id, "✗");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (locked) return;

                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectAnswer(q.id, "✗");
                          }
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

export default WB_Unit6_Page6_Q1;
