import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit8_Page3_Q2.css";

import img1 from "../../../assets/U1 WB/U8/U8P47EXEF-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P47EXEF-02.svg";
import img3 from "../../../assets/U1 WB/U8/U8P47EXEF-03.svg";
import img4 from "../../../assets/U1 WB/U8/U8P47EXEF-04.svg";

import closeEyesAudio from "../../../assets/U1 WB/U8/audio/page 47 - F/Item_001_Close_my_eyes.mp3";
import touchHeadAudio from "../../../assets/U1 WB/U8/audio/page 47 - F/Item_002_Touch_your_head.mp3";
import openMouthAudio from "../../../assets/U1 WB/U8/audio/page 47 - F/Item_003_Open_your_mouth.mp3";
import raiseHandAudio from "../../../assets/U1 WB/U8/audio/page 47 - F/Item_004_Raise_your_hand.mp3";
import bendKneeAudio from "../../../assets/U1 WB/U8/audio/page 47 - F/Item_005_Bend_my_knee.mp3";
import touchNoseAudio from "../../../assets/U1 WB/U8/audio/page 47 - F/Item_006_Touch_my_nose.mp3";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   ITEMS
===================================================== */

const items = [
  {
    img: img1,

    alt: "Two boys facing each other; one boy is showing the other how to open his mouth.",

    options: [
      {
        text: "Close my eyes.",
        audio: closeEyesAudio,
      },
      {
        text: "Open your mouth.",
        audio: openMouthAudio,
      },
    ],

    correctIndex: 1,
  },

  {
    img: img2,

    alt: "A teacher in front of a class touching her head while students watch.",

    options: [
      {
        text: "Touch your head.",
        audio: touchHeadAudio,
      },
      {
        text: "Touch my nose.",
        audio: touchNoseAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img3,

    alt: "A woman outdoors bending one leg at the knee.",

    options: [
      {
        text: "Raise your hand.",
        audio: raiseHandAudio,
      },
      {
        text: "Bend my knee.",
        audio: bendKneeAudio,
      },
    ],

    correctIndex: 1,
  },

  {
    img: img4,

    alt: "A boy sitting in a chair and touching his nose with one finger.",

    options: [
      {
        text: "Bend my knee.",
        audio: bendKneeAudio,
      },
      {
        text: "Touch my nose.",
        audio: touchNoseAudio,
      },
    ],

    correctIndex: 1,
  },
];

/* =====================================================
   MAIN
===================================================== */

const WB_Unit8_Page3_Q2 = () => {
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

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (qIndex) =>
    showAnswerMode || results[qIndex] === "correct";

  const allCorrect = items.every((_, index) => results[index] === "correct");

  /* =====================================================
     STOP AUDIO
  ===================================================== */

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

  /* =====================================================
     PLAY AUDIO
  ===================================================== */

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

    audio.onerror = audio.onended;
  };

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     SELECT OPTION
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    const option = items[qIndex].options[optionIndex];

    /*
      الصوت يشتغل دائمًا:
      حتى بعد ما السؤال يصير correct/locked.
    */
    playAudio(`q-${qIndex}-option-${optionIndex}`, option.audio);

    /*
      السؤال الصح:
      click/keyboard = audio only.
    */
    if (isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      تعديل السؤال الغلط يمسح wrong
      لهذا السؤال فقط.
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
     OPTION KEYBOARD
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
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    /*
      فقط الأسئلة غير المقفلة
      لازم تكون مجاوبة.
    */
    const hasEmpty = items.some(
      (_, index) => !isQuestionLocked(index) && answers[index] === null,
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please choose an answer for each picture.",
      );

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    items.forEach((item, index) => {
      /*
          الصح القديم يظل صح ومقفل.
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
        className="div-forall mb-10"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="F"
          title="Look, read, and circle."
          subTitle="Look at the action and tap the sentence that describes it."
        />

        <div className="container-wb-unit8-p3-q2">
          {items.map((q, i) => {
            const locked = isQuestionLocked(i);

            return (
              <div
                key={i}
                className="question-box-review6-p1-q1"
                style={{
                  width: "100%",
                }}
              >
                {/* =================================================
                    IMAGE + NUMBER
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    width: "80%",
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

                  <div className="img-div-review6-p1-q1">
                    <img
                      src={q.img}
                      alt={q.alt}
                      className="q3-image-wb-unit8-p3-q2"
                    />
                  </div>
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
                  <div className="options-row-review6-p1-q1">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[i] === optIndex;

                      const isCorrect = optIndex === q.correctIndex;

                      const isWrongSelected =
                        results[i] === "wrong" && isSelected;

                      const isPlaying =
                        playingKey === `q-${i}-option-${optIndex}`;

                      /*
                          بعد الصح:
                          فقط الخيار الصح يظل بالـTab
                          لإعادة الصوت.

                          السؤال الغلط:
                          كل الخيارات تبقى بالـTab.
                        */
                      const optionTabIndex = locked ? (isCorrect ? 0 : -1) : 0;

                      return (
                        <p
                          key={optIndex}
                          role="button"
                          tabIndex={optionTabIndex}
                          aria-pressed={isSelected}
                          aria-label={
                            locked && isCorrect
                              ? `${option.text} Correct answer. Press Enter or Space to hear it again.`
                              : `${option.text}. Press Enter or Space to select and hear it.`
                          }
                          className={`
                              option-word-review6-p1-q1

                              ${isSelected ? "selected3" : ""}

                              ${isWrongSelected ? "wrong" : ""}

                              ${
                                results[i] === "correct" && isCorrect
                                  ? "correct"
                                  : ""
                              }
                            `}
                          onClick={() => handleSelect(i, optIndex)}
                          onKeyDown={(e) => handleOptionKeyDown(e, i, optIndex)}
                          style={{
                            display: "flex",

                            justifyContent: "center",

                            alignItems: "center",

                            position: "relative",

                            gap: "20px",

                            outline: "none",

                            cursor: "pointer",
                          }}
                        >
                          {option.text}

                          {/* AUDIO INDICATOR */}

                          {isPlaying && (
                            <FaVolumeUp
                              size={14}
                              aria-hidden="true"
                              style={{
                                position: "absolute",

                                top: "-6px",

                                right: "-8px",

                                pointerEvents: "none",
                              }}
                            />
                          )}

                          {/* WRONG X */}

                          {isWrongSelected && !showAnswerMode && (
                            <span className="wrong-x-review4-p2-q3">✕</span>
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

export default WB_Unit8_Page3_Q2;
