import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U7/U7P44EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P44EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P44EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P44EXEB-04.svg";

import "./WB_Unit7_Page6_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import hatAudio from "../../../assets/U1 WB/U7/audio/page 44- B/Item_001_hat.mp3";
import handAudio from "../../../assets/U1 WB/U7/audio/page 44- B/Item_002_hand.mp3";
import waterAudio from "../../../assets/U1 WB/U7/audio/page 44- B/Item_003_water.mp3";
import windowAudio from "../../../assets/U1 WB/U7/audio/page 44- B/Item_004_window.mp3";
import womanAudio from "../../../assets/U1 WB/U7/audio/page 44- B/Item_005_woman.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,
    alt: "An open hand with the palm facing forward.",
    options: [
      {
        text: "hat",
        audio: hatAudio,
      },
      {
        text: "hand",
        audio: handAudio,
      },
    ],
    correctIndex: 1,
  },

  {
    img: img2,
    alt: "A window with an arched wooden frame.",
    options: [
      {
        text: "woman",
        audio: womanAudio,
      },
      {
        text: "window",
        audio: windowAudio,
      },
    ],
    correctIndex: 1,
  },

  {
    img: img3,
    alt: "A woman with dark hair wearing an orange shirt.",
    options: [
      {
        text: "window",
        audio: windowAudio,
      },
      {
        text: "woman",
        audio: womanAudio,
      },
    ],
    correctIndex: 1,
  },

  {
    img: img4,
    alt: "A glass filled with water.",
    options: [
      {
        text: "water",
        audio: waterAudio,
      },
      {
        text: "window",
        audio: windowAudio,
      },
    ],
    correctIndex: 0,
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit7_Page6_Q2 = () => {
  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  /*
    null | correct | wrong
  */
  const [results, setResults] = useState(Array(items.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const allCorrect = items.every((_, index) => results[index] === "correct");

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswerMode || results[qIndex] === "correct") {
      return;
    }

    const option = items[qIndex].options[optionIndex];

    /*
      Mouse / Keyboard:
      اختيار + صوت
    */

    playAudio(`option-${qIndex}-${optionIndex}`, option.audio);

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      تعديل نفس السؤال:
      يشيل X عنه فقط
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[qIndex] === "wrong") {
        updated[qIndex] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    const hasEmpty = items.some(
      (_, index) => results[index] !== "correct" && answers[index] === null,
    );

    if (hasEmpty) {
      ValidationAlert.info("Please choose an answer for all questions.");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    items.forEach((item, index) => {
      /*
          سؤال صح من Check سابق
        */

      if (results[index] === "correct") {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (answers[index] === item.correctIndex) {
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

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      ValidationAlert.success(msg);
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    setAnswers(items.map((item) => item.correctIndex));

    setResults(items.map(() => "correct"));

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

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
        className="div-forall"
        style={{
          gap: "60px",
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title="Look, read, and circle."
          subTitle="Say each picture name, then tap the matching h or w word."
        />

        <div className="container-wb-unit6-p6-q2">
          {items.map((q, i) => {
            const locked = isQuestionLocked(i);

            const isQuestionWrong = results[i] === "wrong";

            return (
              <div
                key={i}
                className="question-box-wb-unit7-p6-q2"
                style={{
                  width: "100%",
                }}
              >
                {/* =================================================
                    IMAGE
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    gap: "50px",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {i + 1}
                  </span>

                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q3-image-wb-unit7-p6-q2"
                  />
                </div>

                {/* =================================================
                    OPTIONS
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <div className="options-row-wb-unit7-p6-q2">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[i] === optIndex;

                      const isWrongSelected = isQuestionWrong && isSelected;

                      const isPlaying =
                        playingKey === `option-${i}-${optIndex}`;

                      return (
                        <p
                          key={optIndex}
                          role="button"
                          tabIndex={locked ? -1 : 0}
                          aria-disabled={locked}
                          aria-pressed={isSelected}
                          aria-label={`${option.text}${
                            isSelected ? ". Selected." : ""
                          }`}
                          className={`
                              option-word-review6-p1-q1

                              ${isSelected ? "selected3" : ""}

                              ${isWrongSelected ? "wrong" : ""}
                            `}
                          onClick={() => {
                            if (locked) {
                              return;
                            }

                            handleSelect(i, optIndex);
                          }}
                          onKeyDown={(e) => {
                            if (locked) {
                              return;
                            }

                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();

                              handleSelect(i, optIndex);
                            }
                          }}
                          style={{
                            display: "flex",

                            justifyContent: "center",

                            alignItems: "center",

                            position: "relative",
                          }}
                        >
                          {option.text}

                          {/* =================================================
                                AUDIO ICON
                            ================================================= */}

                          {isPlaying && (
                            <FaVolumeUp
                              aria-hidden="true"
                              className="audio-icon-wb-unit7-p6-q2"
                            />
                          )}

                          {/* =================================================
                                WRONG X
                            ================================================= */}

                          {isWrongSelected && (
                            <span
                              className="wrong-x-review4-p2-q3"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </p>
                      );
                    })}
                  </div>
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

export default WB_Unit7_Page6_Q2;
