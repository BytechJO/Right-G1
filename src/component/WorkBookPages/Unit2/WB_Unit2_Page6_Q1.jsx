import React, { useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U2/U2P14EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U2/U2P14EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U2/U2P14EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U2/U2P14EXEA-04.svg";
import img5 from "../../../assets/U1 WB/U2/U2P14EXEA-05.svg";
import img6 from "../../../assets/U1 WB/U2/U2P14EXEA-06.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./WB_Unit2_Page6_Q1.css";

import { FaVolumeUp } from "react-icons/fa";

// ======================================================
// AUDIOS
// ======================================================

import birdAudio from "../../../assets/U1 WB/U2/page_14/Item_001_bird.mp3";
import pinkAudio from "../../../assets/U1 WB/U2/page_14/Item_002_pink.mp3";
import ballAudio from "../../../assets/U1 WB/U2/page_14/Item_003_ball.mp3";
import pizzaAudio from "../../../assets/U1 WB/U2/page_14/Item_004_pizza.mp3";
import boyAudio from "../../../assets/U1 WB/U2/page_14/Item_005_boy.mp3";
import pencilAudio from "../../../assets/U1 WB/U2/page_14/Item_006_pencil.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ======================================================
// MAIN
// ======================================================

const WB_Unit2_Page6_Q1 = () => {
  // ======================================================
  // QUESTIONS
  // ======================================================

  const questions = [
    {
      id: 1,

      image: img1,

      alt: "A pencil",

      items: [
        {
          text: "pencil",
          correct: true,
          audio: pencilAudio,
        },

        {
          text: "pizza",
          correct: false,
          audio: pizzaAudio,
        },
      ],
    },

    {
      id: 2,

      image: img2,

      alt: "A bird",

      items: [
        {
          text: "bird",
          correct: true,
          audio: birdAudio,
        },

        {
          text: "ball",
          correct: false,
          audio: ballAudio,
        },
      ],
    },

    {
      id: 3,

      image: img3,

      alt: "A boy",

      items: [
        {
          text: "boy",
          correct: true,
          audio: boyAudio,
        },

        {
          text: "ball",
          correct: false,
          audio: ballAudio,
        },
      ],
    },

    {
      id: 4,

      image: img4,

      alt: "A pizza",

      items: [
        {
          text: "pink",
          correct: false,
          audio: pinkAudio,
        },

        {
          text: "pizza",
          correct: true,
          audio: pizzaAudio,
        },
      ],
    },

    {
      id: 5,

      image: img5,

      alt: "A ball",

      items: [
        {
          text: "ball",
          correct: true,
          audio: ballAudio,
        },

        {
          text: "boy",
          correct: false,
          audio: boyAudio,
        },
      ],
    },

    {
      id: 6,

      image: img6,

      alt: "The color pink",

      items: [
        {
          text: "pink",
          correct: true,
          audio: pinkAudio,
        },

        {
          text: "pencil",
          correct: false,
          audio: pencilAudio,
        },
      ],
    },
  ];

  // ======================================================
  // ANSWERS
  // ======================================================

  const [answers, setAnswers] = useState({});

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  // ======================================================
  // AUDIO
  // ======================================================

  const audioRef = useRef(null);

  const [playingOption, setPlayingOption] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingOption(null);
  };

  const playOptionAudio = (questionId, optionIndex, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    const audioId = `${questionId}-${optionIndex}`;

    setPlayingOption(audioId);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingOption(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingOption(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingOption(null);
    };
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  // ======================================================
  // SELECT ANSWER
  // مهم:
  // هذا فقط من الـ input
  // الكلمة نفسها لا تختار
  // ======================================================

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

  // ======================================================
  // CHECK ANSWERS
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const allAnswered = questions.every((q) => answers[q.id] !== undefined);

    if (!allAnswered) {
      ValidationAlert.info("Oops!", "Please answer all questions!");

      return;
    }

    let correctCount = 0;

    const correctTemp = [];
    const wrongTemp = [];

    questions.forEach((q) => {
      const chosenIndex = answers[q.id];

      const isCorrect = q.items[chosenIndex]?.correct === true;

      if (isCorrect) {
        correctCount++;

        correctTemp.push(q.id);
      } else {
        wrongTemp.push(q.id);
      }
    });

    // ====================================================
    // LOCK CORRECT ONLY
    // ====================================================

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...correctTemp])),
    );

    // ====================================================
    // WRONG ONLY
    // ====================================================

    setWrongQuestions(wrongTemp);

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

    // ====================================================
    // ALL CORRECT
    // ====================================================

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

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const showAnswers = () => {
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

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

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
          gap: "10px",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          title="Look, read, and write."
          subTitle="Say the picture name, then tap the word that matches it."
        />
        <div className="wb-unit2-p6-q1-grid w-full">
          {questions.map((q) => {
            const questionLocked = isQuestionLocked(q.id);

            const questionWrong = wrongQuestions.includes(q.id);

            return (
              <div key={q.id} className="review3-p1-q3-box">
                <img src={q.image} alt={q.alt} className="wb-unit2-p6-q1-img" />

                {q.items.map((item, idx) => {
                  const isSelected = answers[q.id] === idx;

                  const isWrong = questionWrong && isSelected && !item.correct;

                  const audioId = `${q.id}-${idx}`;

                  const isPlaying = playingOption === audioId;

                  return (
                    <div key={idx} className="wb-unit2-p6-q1-row">
                      {/* =================================================
                            WORD
                            فقط صوت
                            لا تعمل select
                        ================================================= */}

                      <span
                        className="wb-unit2-p6-q1-text"
                        role="button"
                        tabIndex={
                          questionLocked || showAnswer || checkCompleted
                            ? -1
                            : 0
                        }
                        aria-label={`Play audio for ${item.text}`}
                        onClick={() => playOptionAudio(q.id, idx, item.audio)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();

                            playOptionAudio(q.id, idx, item.audio);
                          }
                        }}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                          display: "inline-block",
                          padding: "2px 4px",
                          border: "2px solid transparent",
                          borderRadius: "6px",
                          transition: "border-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#2c5287";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "transparent";
                        }}
                      >
                        {item.text}

                        {isPlaying && (
                          <FaVolumeUp
                            size={15}
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              top: "-9px",
                              right: "-9px",
                              background: "white",
                              borderRadius: "50%",
                              padding: "2px",
                              pointerEvents: "none",
                              zIndex: 10,
                            }}
                          />
                        )}
                      </span>
                      {/* =================================================
                            INPUT
                            فقط هذا يحدد الإجابة
                        ================================================= */}

                      <div className="review3-p1-q3-input-box">
                        <input
                          type="text"
                          readOnly
                          value={isSelected ? "✓" : ""}
                          tabIndex={
                            questionLocked || showAnswer || checkCompleted
                              ? -1
                              : 0
                          }
                          role="button"
                          aria-label={`${item.text}${
                            isSelected ? ", selected" : ""
                          }. Press Enter or Space to select.`}
                          aria-pressed={isSelected}
                          onClick={() => handleSelect(q.id, idx)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              handleSelect(q.id, idx);
                            }
                          }}
                          className="review3-p1-q3-input"
                          style={{
                            cursor:
                              questionLocked || showAnswer || checkCompleted
                                ? "default"
                                : "pointer",
                          }}
                        />

                        {isWrong && <span className="review3-p1-q3-x">✕</span>}
                      </div>
                    </div>
                  );
                })}
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

        <button onClick={showAnswers} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit2_Page6_Q1;
