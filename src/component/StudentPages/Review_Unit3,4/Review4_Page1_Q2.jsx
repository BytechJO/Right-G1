import React, { useRef, useState } from "react";

import img1 from "../../../assets/unit4/imgs/U4P36EXEB-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P36EXEB-02.svg";

import redBoatAudio from "../../../assets/unit4/Page 36 - B/It’s a red boat.mp3";
import blueBoatAudio from "../../../assets/unit4/Page 36 - B/It’s a blue boat.mp3";
import brownGoatAudio from "../../../assets/unit4/Page 36 - B/It’s a brown goat.mp3";
import redGoatAudio from "../../../assets/unit4/Page 36 - B/It’s a red goat.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review4_Page1_Q2.css";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

const Review4_Page1_Q2 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const questions = [
    {
      id: 1,

      image: img1,

      alt: "A blue sailboat.",

      items: [
        {
          text: "It’s a red boat.",
          correct: false,
          audio: redBoatAudio,
        },

        {
          text: "It’s a blue boat.",
          correct: true,
          audio: blueBoatAudio,
        },
      ],
    },

    {
      id: 2,

      image: img2,

      alt: "A brown goat.",

      items: [
        {
          text: "It’s a brown goat.",
          correct: true,
          audio: brownGoatAudio,
        },

        {
          text: "It’s a red goat.",
          correct: false,
          audio: redGoatAudio,
        },
      ],
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState({});

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingText, setPlayingText] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingText(null);
  };

  const playAudio = (text, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingText(text);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingText(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingText(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingText(null);
    };
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qId, idx) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,

      [qId]: idx,
    }));

    /*
      شيل X فقط عن نفس السؤال
    */

    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /* =========================
       لازم كل سؤال يكون مجاوب
    ========================= */

    const hasEmpty = questions.some((q) => answers[q.id] === undefined);

    if (hasEmpty) {
      ValidationAlert.info("Please answer all questions!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    questions.forEach((q) => {
      const chosenIndex = answers[q.id];

      const isCorrect = q.items[chosenIndex]?.correct === true;

      if (isCorrect) {
        correctCount++;

        newlyLocked.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    /* =========================
       الصح فقط يقفل
    ========================= */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /* =========================
       الغلط فقط عليه X
    ========================= */

    setWrongQuestions(wrong);

    const total = questions.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    /* =========================
       ALL CORRECT
    ========================= */

    if (correctCount === total) {
      setLockedQuestions(questions.map((q) => q.id));

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
    stopAudio();

    const correctSelections = {};

    questions.forEach((q) => {
      const correctIndex = q.items.findIndex((item) => item.correct === true);

      correctSelections[q.id] = correctIndex;
    });

    setAnswers(correctSelections);

    setWrongQuestions([]);

    setLockedQuestions(questions.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers({});

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
          gap: "100px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="B"
          title={
            <>
              Look, read, and write{" "}
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
          subTitle="Compare each picture with the two sentences, then tap the correct one."
        />

        <div className="review4-p1-q2-grid">
          {questions.map((q) => {
            const questionLocked = isQuestionLocked(q.id);

            const questionWrong = wrongQuestions.includes(q.id);

            return (
              <div key={q.id} className="review4-p1-q2-box">
                {/* =================================================
                    IMAGE
                ================================================= */}

                <img src={q.image} alt={q.alt} className="review4-p1-q2-img" />

                {/* =================================================
                    OPTIONS
                ================================================= */}

                <div className="flex flex-col h-full justify-around">
                  {q.items.map((item, idx) => {
                    const isSelected = answers[q.id] === idx;

                    const isWrong = questionWrong && isSelected;

                    const answerDisabled =
                      questionLocked || showAnswer || checkCompleted;

                    const isPlaying = playingText === item.text;

                    return (
                      <div key={idx} className="review3-p1-q3-row">
                        {/* =========================================
                              SENTENCE AUDIO
                          ========================================= */}

                        <span
                          role="button"
                          tabIndex={0}
                          aria-label={`Play audio for ${item.text}`}
                          onClick={() => playAudio(item.text, item.audio)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              playAudio(item.text, item.audio);
                            }
                          }}
                          className="text-[20px] review4-p1-q2-audio-text"
                          style={{
                            position: "relative",

                            display: "inline-flex",

                            alignItems: "center",

                            cursor: "pointer",
                          }}
                        >
                          {item.text}

                          {/* =========================================
                                AUDIO ICON
                            ========================================= */}

                          {isPlaying && (
                            <FaVolumeUp
                              size={16}
                              aria-hidden="true"
                              className="review4-p1-q2-audio-icon"
                            />
                          )}
                        </span>

                        {/* =========================================
                              ANSWER INPUT
                          ========================================= */}

                        <div className="review3-p1-q3-input-box">
                          <input
                            type="text"
                            readOnly
                            value={isSelected ? "✓" : ""}
                            role="button"
                            /*
                                الصح المقفول يطلع من Tab.
                                الغلط يضل قابل للTab.
                              */

                            tabIndex={answerDisabled ? -1 : 0}
                            aria-disabled={answerDisabled}
                            aria-pressed={isSelected}
                            aria-label={`${item.text}${
                              isSelected ? ", selected" : ""
                            }. Press Enter or Space to select this answer.`}
                            /*
                                Mouse select
                              */

                            onClick={() => {
                              if (answerDisabled) {
                                return;
                              }

                              handleSelect(q.id, idx);
                            }}
                            /*
                                مهم:
                                ما في onFocus.
                                Tab لحاله ما بحدد.
                              */

                            onKeyDown={(e) => {
                              if (answerDisabled) {
                                return;
                              }

                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                e.stopPropagation();

                                handleSelect(q.id, idx);
                              }
                            }}
                            className="review3-p1-q3-input"
                          />

                          {/* =========================================
                                WRONG X
                            ========================================= */}

                          {isWrong && (
                            <span
                              className="review3-p1-q3-x"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
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

export default Review4_Page1_Q2;
