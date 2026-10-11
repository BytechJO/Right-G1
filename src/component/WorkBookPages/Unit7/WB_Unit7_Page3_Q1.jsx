import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit7_Page3_Q1.css";

import img1 from "../../../assets/U1 WB/U7/U7P41EXEE-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P41EXEE-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P41EXEE-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P41EXEE-04.svg";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import sadQuestionAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_001_Are_you_sad.mp3";
import boredQuestionAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_002_Are_you_bored.mp3";
import yesIAmAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_003_a_Yes,lam.mp3";
import noHappyAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_004_b_No,_I'm_not._I'm_happy.mp3";
import noColdAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_005_b_No,_I'm_not._I'm_cold.mp3";
import hungryQuestionAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_006_Are_you_hungry.mp3";
import happyQuestionAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_007_Are_you_happy.mp3";
import noSadAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_008_No,_I'm_sad.mp3";
import noScaredAudio from "../../../assets/U1 WB/U7/audio/page 41- E/Item_009_No,_I'm_not._I'm_scared.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,

    alt: "A smiling boy reaching toward a colorful ball.",

    text: "Are you sad?",

    questionAudio: sadQuestionAudio,

    options: [
      {
        label: "a",
        text: "Yes, I am.",
        audio: yesIAmAudio,
      },
      {
        label: "b",
        text: "No, I’m not. I’m happy.",
        audio: noHappyAudio,
      },
    ],

    correctIndex: 1,
  },

  {
    img: img2,

    alt: "A boy sitting on a bench outdoors with a bored expression.",

    text: "Are you bored?",

    questionAudio: boredQuestionAudio,

    options: [
      {
        label: "a",
        text: "Yes, I am.",
        audio: yesIAmAudio,
      },
      {
        label: "b",
        text: "No, I’m not. I’m cold.",
        audio: noColdAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img3,

    alt: "A boy outdoors thinking about a hamburger and looking hungry.",

    text: "Are you hungry?",

    questionAudio: hungryQuestionAudio,

    options: [
      {
        label: "a",
        text: "Yes, I am.",
        audio: yesIAmAudio,
      },
      {
        label: "b",
        text: "No, I’m not. I’m sad.",
        audio: noSadAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img4,

    alt: "A girl kneeling on the grass and looking frightened by a spider.",

    text: "Are you happy?",

    questionAudio: happyQuestionAudio,

    options: [
      {
        label: "a",
        text: "Yes, I am.",
        audio: yesIAmAudio,
      },
      {
        label: "b",
        text: "No, I’m not. I’m scared.",
        audio: noScaredAudio,
      },
    ],

    correctIndex: 1,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit7_Page3_Q1 = () => {
  /* =====================================================
     STATE
  ===================================================== */

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
     SELECT ANSWER
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswerMode || results[qIndex] === "correct") {
      return;
    }

    const option = items[qIndex].options[optionIndex];

    /*
      Mouse/Keyboard select:
      يشغل صوت الخيار.
    */

    playAudio(`option-${qIndex}-${optionIndex}`, option.audio);

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      تعديل نفس السؤال:
      يشيل wrong state عنه فقط.
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
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    /*
      بعد الكل صح:
      Check يظل ظاهر لكن no-op.
    */

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
        سؤال كان صح من Check سابق.
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
     JSX
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
          gap: "15px",
        }}
      >
          <ExerciseHeader
            sectionLetter="E"
            title="Read and circle."
            subTitle="Look at the expression and tap the answer that matches it."
          />

        <div className="container-review6-p1-q1">
          {items.map((q, i) => {
            const locked = isQuestionLocked(i);

            const isQuestionWrong = results[i] === "wrong";

            return (
              <div
                key={i}
                className="question-box-review6-p1-q1"
                style={{
                  width: "100%",
                }}
              >
                {/* =================================================
                      QUESTION TEXT + AUDIO
                  ================================================= */}

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

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio: ${q.text}`}
                    onClick={() => {
                      playAudio(`question-${i}`, q.questionAudio);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();

                        playAudio(`question-${i}`, q.questionAudio);
                      }
                    }}
                    className="wb-unit7-p3-q1-question-audio"
                  >
                    <h6
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      {q.text}
                    </h6>

                    {playingKey === `question-${i}` && (
                      <FaVolumeUp
                        aria-hidden="true"
                        className="wb-unit7-p3-q1-audio-icon"
                      />
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* =================================================
                        IMAGE
                    ================================================= */}

                  <div className="img-div-wb-unit7-p3-q1">
                    <img
                      src={q.img}
                      alt={q.alt}
                      className="q3-image-wb-unit7-p3-q1"
                    />
                  </div>

                  {/* =================================================
                        OPTIONS
                    ================================================= */}

                  <div className="options-row-review6-p1-q1">
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
                          aria-label={`${option.label}. ${option.text}${
                            isSelected ? ". Selected." : ""
                          }`}
                          className={`
                                option-word-wb-unit7-p3-q1

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
                            gap: "20px",
                          }}
                        >
                          {/* LETTER */}

                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "20px",
                            }}
                          >
                            {option.label}
                          </span>

                          {/* OPTION TEXT */}

                          <span>{option.text}</span>

                          {/* AUDIO ICON */}

                          {isPlaying && (
                            <FaVolumeUp
                              aria-hidden="true"
                              className="wb-unit7-p3-q1-audio-icon"
                            />
                          )}

                          {/* WRONG X */}

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

export default WB_Unit7_Page3_Q1;
