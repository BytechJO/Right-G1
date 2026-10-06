import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U5/U5P32EXEC-01.svg";
import img2 from "../../../assets/U1 WB/U5/U5P32EXEC-02.svg";
import img3 from "../../../assets/U1 WB/U5/U5P32EXEC-03.svg";

import "./WB_Unit5_Page6_Q3.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import kiteAudio from "../../../assets/U1 WB/U5/audio/page_32_qC/Item_001_kite.mp3";
import goatAudio from "../../../assets/U1 WB/U5/audio/page_32_qC/Item_002_goat.mp3";
import girlAudio from "../../../assets/U1 WB/U5/audio/page_32_qC/Item_004_girl.mp3";
import kitchenAudio from "../../../assets/U1 WB/U5/audio/page_32_qC/Item_005_kitchen.mp3";
import gardenAudio from "../../../assets/U1 WB/U5/audio/page_32_qC/Item_006_garden.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,

    alt: "A girl.",

    options: [
      {
        word: "garden",
        audio: gardenAudio,
      },
      {
        word: "girl",
        audio: girlAudio,
      },
    ],

    correctIndex: 1,
  },

  {
    img: img2,

    alt: "A colorful kite.",

    options: [
      {
        word: "kite",
        audio: kiteAudio,
      },
      {
        word: "kitchen",
        audio: kitchenAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img3,

    alt: "A garden with plants, vegetables, and a fence.",

    options: [
      {
        word: "goat",
        audio: goatAudio,
      },
      {
        word: "garden",
        audio: gardenAudio,
      },
    ],

    correctIndex: 1,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit5_Page6_Q3 = () => {
  /* =================================================
     ANSWER STATE
  ================================================= */

  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     AUDIO STATE
  ================================================= */

  const audioRef = useRef(null);

  const [playingOption, setPlayingOption] = useState(null);

  /* =================================================
     AUDIO
  ================================================= */

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

  const playAudio = (audioId, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingOption(audioId);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingOption(null);
    });

    audio.onended = () => {
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

  /* =================================================
     HELPERS
  ================================================= */

  const isQuestionLocked = (index) => lockedQuestions.includes(index);

  /* =================================================
     SELECT OPTION
  ================================================= */

  const handleSelect = (qIndex, optionIndex, audioId, audioSrc) => {
    /*
      الصوت يشتغل أول
    */

    playAudio(audioId, audioSrc);

    /*
      إذا السؤال صار صح ومقفول:
      صوت فقط، بدون تغيير الجواب
    */

    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      أي تعديل بنفس السؤال
      يشيل X تبعه فقط
    */

    setWrongQuestions((prev) => prev.filter((index) => index !== qIndex));
  };

  /* =================================================
     CHECK ANSWERS
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    answers.forEach((answer, index) => {
      if (answer === items[index].correctIndex) {
        correctCount++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /* =========================================
       الصح فقط يقفل
    ========================================= */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /* =========================================
       الغلط يظل editable
    ========================================= */

    setWrongQuestions(wrong);

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
      setLockedQuestions(items.map((_, index) => index));

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

  const showAnswers = () => {
    stopAudio();

    const filled = items.map((item) => item.correctIndex);

    setAnswers(filled);

    setWrongQuestions([]);

    setLockedQuestions(items.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(Array(items.length).fill(null));

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
      <div
        className="div-forall"
        style={{
          gap: "80px",
        }}
      >
        <ExerciseHeader
          sectionLetter="C"
          title="Look, read, and circle."
          subTitle="Listen to each word and choose the word that matches the picture."
        />

        <div className="container-wb-unit5-p6-q3">
          {items.map((q, qIndex) => {
            const locked = isQuestionLocked(qIndex);

            const wrong = wrongQuestions.includes(qIndex);

            return (
              <div
                key={qIndex}
                className="question-box-wb-unit5-p6-q3"
                style={{
                  width: "100%",
                }}
              >
                {/* =====================================
                      IMAGE
                  ===================================== */}

                <div
                  style={{
                    display: "flex",

                    gap: "10px",

                    flexDirection: "row",

                    alignItems: "flex-start",

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
                    {qIndex + 1}
                  </span>

                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q3-image-review6-p1-q1"
                    style={{
                      height: "120px",

                      width: "auto",
                    }}
                  />
                </div>

                {/* =====================================
                      OPTIONS
                  ===================================== */}

                <div
                  style={{
                    display: "flex",

                    gap: "10px",
                  }}
                >
                  <div className="options-row-wb-unit5-p6-q3">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[qIndex] === optIndex;

                      const isCorrect = optIndex === q.correctIndex;

                      const isWrongSelected = wrong && isSelected && !isCorrect;

                      const audioId = `${qIndex}-${optIndex}`;

                      /*
                            بعد الصح:
                            نخليه Tab reachable
                            عشان يقدر يسمع الصوت،
                            بس ما يغير الجواب.
                          */

                      return (
                        <p
                          key={optIndex}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          aria-label={
                            locked || showAnswer || checkCompleted
                              ? `Play audio: ${option.word}`
                              : `${option.word}. Press Enter or Space to hear and select this word.`
                          }
                          className={`
                                option-word-review6-p1-q1
                                ${isSelected ? "selected3" : ""}
                                ${isWrongSelected ? "wrong" : ""}
                              `}
                          onClick={() =>
                            handleSelect(
                              qIndex,
                              optIndex,
                              audioId,
                              option.audio,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();

                              handleSelect(
                                qIndex,
                                optIndex,
                                audioId,
                                option.audio,
                              );
                            }
                          }}
                          style={{
                            display: "flex",

                            justifyContent: "center",

                            alignItems: "center",

                            position: "relative",

                            cursor: "pointer",
                          }}
                        >
                          {option.word}

                          {/* =================================
                                  AUDIO ICON
                              ================================= */}

                          {playingOption === audioId && (
                            <FaVolumeUp
                              size={15}
                              aria-hidden="true"
                              className="audio-icon-wb-u5-p6-q3"
                            />
                          )}

                          {/* =================================
                                  WRONG X
                              ================================= */}

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

export default WB_Unit5_Page6_Q3;
