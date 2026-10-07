import React, { useRef, useState } from "react";
import "./Review6_Page1_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import img1 from "../../../assets/unit6/imgs/U6P54EXEA-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P54EXEA-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P54EXEA-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P54EXEA-04.svg";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import climbTreeAudio from "../../../assets/unit6/sounds/Page 54 - A/climb a tree..mp3";
import flyKiteAudio from "../../../assets/unit6/sounds/Page 54 - A/fly a kite..mp3";
import heCantAudio from "../../../assets/unit6/sounds/Page 54 - A/He can’t.mp3";
import itCanAudio from "../../../assets/unit6/sounds/Page 54 - A/It can.mp3";
import paintPictureAudio from "../../../assets/unit6/sounds/Page 54 - A/paint a picture..mp3";
import rideBikeAudio from "../../../assets/unit6/sounds/Page 54 - A/ride a bike..mp3";
import sailBoatAudio from "../../../assets/unit6/sounds/Page 54 - A/sail a boat..mp3";
import sheCanAudio from "../../../assets/unit6/sounds/Page 54 - A/She can.mp3";
import swimAudio from "../../../assets/unit6/sounds/Page 54 - A/swim..mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,

    alt: "A girl flying a colorful kite near a tree.",

    text: "She can",

    textAudio: sheCanAudio,

    options: [
      {
        label: "a",
        text: "fly a kite.",
        audio: flyKiteAudio,
      },

      {
        label: "b",
        text: "ride a bike.",
        audio: rideBikeAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img2,

    alt: "A boy painting a picture on an easel.",

    text: "He can’t",

    textAudio: heCantAudio,

    options: [
      {
        label: "a",
        text: "climb a tree.",
        audio: climbTreeAudio,
      },

      {
        label: "b",
        text: "paint a picture.",
        audio: paintPictureAudio,
      },
    ],

    correctIndex: 1,
  },

  {
    img: img3,

    alt: "An animal climbing up a tree trunk.",

    text: "It can",

    textAudio: itCanAudio,

    options: [
      {
        label: "a",
        text: "ride a bike.",
        audio: rideBikeAudio,
      },

      {
        label: "b",
        text: "climb a tree.",
        audio: climbTreeAudio,
      },
    ],

    correctIndex: 1,
  },

  {
    img: img4,

    alt: "A girl swimming in a pool.",

    text: "She can",

    textAudio: sheCanAudio,

    options: [
      {
        label: "a",
        text: "sail a boat.",
        audio: sailBoatAudio,
      },

      {
        label: "b",
        text: "swim.",
        audio: swimAudio,
      },
    ],

    correctIndex: 1,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Review6_Page1_Q1 = () => {
  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  /*
    الأسئلة الغلط بعد Check
  */
  const [wrongItems, setWrongItems] = useState([]);

  /*
    الصح فقط يقفل
  */
  const [lockedItems, setLockedItems] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

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

  /* =================================================
     HELPERS
  ================================================= */

  const isLocked = (index) => lockedItems.includes(index);

  /* =================================================
     SELECT
  ================================================= */

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswer || checkCompleted || isLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      clear wrong X only for same question
    */

    setWrongItems((prev) => prev.filter((index) => index !== qIndex));
  };

  /* =================================================
     OPTION ACTIVATE
     AUDIO + SELECT
  ================================================= */

  const handleOptionActivate = (qIndex, optionIndex) => {
    const option = items[qIndex].options[optionIndex];

    /*
      الصوت يشتغل دائمًا
    */

    playAudio(`option-${qIndex}-${optionIndex}`, option.audio);

    /*
      الاختيار فقط إذا السؤال مش مقفول
    */

    handleSelect(qIndex, optionIndex);
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((answer) => answer === null)) {
      ValidationAlert.info(
        "Oops!",
        "Please choose an answer for all items before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];
    const correctNow = [];

    items.forEach((item, index) => {
      if (answers[index] === item.correctIndex) {
        correctCount++;

        correctNow.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      progressive locking
    */

    setLockedItems((prev) => Array.from(new Set([...prev, ...correctNow])));

    /*
      wrong stays editable
    */

    setWrongItems(wrong);

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
      setLockedItems(items.map((_, index) => index));

      setWrongItems([]);

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

    setAnswers(items.map((item) => item.correctIndex));

    setLockedItems(items.map((_, index) => index));

    setWrongItems([]);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(Array(items.length).fill(null));

    setWrongItems([]);

    setLockedItems([]);

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
          gap: "50px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="A"
          title="Look, read, and choose."
          subTitle="Look at each picture, then choose the sentence that describes it."
        />

        <div className="container-review6-p1-q1">
          {items.map((q, i) => {
            const locked = isLocked(i);

            const wrong = wrongItems.includes(i);

            const prefixPlaying = playingKey === `prefix-${i}`;

            return (
              <div
                key={i}
                className="question-box-review6-p1-q1"
                style={{
                  width: "100%",
                }}
              >
                {/* =====================================
                    QUESTION HEADER
                ===================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "center",
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

                  {/* =====================================
                      PREFIX AUDIO
                  ===================================== */}

                  <h6
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio: ${q.text}`}
                    className="prefix-audio-review6-p1-q1"
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => playAudio(`prefix-${i}`, q.textAudio)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        playAudio(`prefix-${i}`, q.textAudio);
                      }
                    }}
                  >
                    {q.text}

                    {prefixPlaying && (
                      <FaVolumeUp
                        size={14}
                        aria-hidden="true"
                        className="audio-icon-review6-p1-q1"
                      />
                    )}
                  </h6>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  {/* =====================================
                      IMAGE
                  ===================================== */}

                  <div className="img-div-review6-p1-q1">
                    <img
                      src={q.img}
                      alt={q.alt}
                      className="q3-image-review6-p1-q1"
                      style={{
                        height: "150px",
                        width: "auto",
                      }}
                    />
                  </div>

                  {/* =====================================
                      OPTIONS
                  ===================================== */}

                  <div className="options-row-review6-p1-q1">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[i] === optIndex;

                      const isCorrect = optIndex === q.correctIndex;

                      const isWrongSelected = wrong && isSelected && !isCorrect;

                      const playing = playingKey === `option-${i}-${optIndex}`;

                      return (
                        <div
                          key={optIndex}
                          className="option-wrapper"
                          style={{
                            position: "relative",
                          }}
                        >
                          <p
                            role="button"
                            /*
                                حتى بعد الصح:
                                تضل Tab reachable عشان الصوت.
                              */

                            tabIndex={0}
                            aria-pressed={isSelected}
                            aria-label={
                              locked
                                ? `Play audio: ${option.text}`
                                : `Choose ${option.label}, ${option.text}`
                            }
                            className={`
                                option-word-review6-p1-q1
                                ${isSelected ? "selected3" : ""}
                                ${isWrongSelected ? "wrong" : ""}
                                ${locked ? "locked-option-review6-p1-q1" : ""}
                              `}
                            onClick={() => handleOptionActivate(i, optIndex)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                handleOptionActivate(i, optIndex);
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
                            <span
                              style={{
                                fontWeight: "700",
                                marginRight: "6px",
                              }}
                            >
                              {option.label}
                            </span>

                            {option.text}

                            {playing && (
                              <FaVolumeUp
                                size={14}
                                aria-hidden="true"
                                className="audio-icon-review6-p1-q1"
                              />
                            )}
                          </p>

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
                        </div>
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

export default Review6_Page1_Q1;
