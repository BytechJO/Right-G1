import React, { useRef, useState } from "react";
import "./Review5_Page2_Q3.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import img1 from "../../../assets/unit6/imgs/U6P53EXEF-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P53EXEF-02.svg";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import gardenAudio from "../../../assets/unit6/sounds/Page 53 - F/garden.mp3";
import girlAudio from "../../../assets/unit6/sounds/Page 53 - F/girl.mp3";
import greenAudio from "../../../assets/unit6/sounds/Page 53 - F/green.mp3";
import isInTheAudio from "../../../assets/unit6/sounds/Page 53 - F/is in the.mp3";
import isAudio from "../../../assets/unit6/sounds/Page 53 - F/is.mp3";
import keyAudio from "../../../assets/unit6/sounds/Page 53 - F/key.mp3";
import kitchenAudio from "../../../assets/unit6/sounds/Page 53 - F/kitchen.mp3";
import kiteAudio from "../../../assets/unit6/sounds/Page 53 - F/Kite.mp3";
import theAudio from "../../../assets/unit6/sounds/Page 53 - F/The.mp3";

/* =====================================================
   AUDIO MAP
===================================================== */

const AUDIO_MAP = {
  The: theAudio,
  girl: girlAudio,
  key: keyAudio,
  "is in the": isInTheAudio,
  kitchen: kitchenAudio,
  garden: gardenAudio,
  is: isAudio,
  kite: kiteAudio,
  green: greenAudio,
};

/* =====================================================
   QUESTIONS
===================================================== */

const QUESTIONS = [
  {
    id: 1,

    image: img1,

    alt: "A girl planting a small green plant in a garden.",

    parts: [
      {
        type: "text",
        value: "The",
      },

      {
        type: "blank",
        options: ["girl", "key"],
      },

      {
        type: "text",
        value: "is in the",
      },

      {
        type: "blank",
        options: ["kitchen", "garden"],
      },

      {
        type: "text",
        value: ".",
      },
    ],

    correct: ["girl", "garden"],
  },

  {
    id: 2,

    image: img2,

    alt: "A green kite with a colorful tail.",

    parts: [
      {
        type: "text",
        value: "The",
      },

      {
        type: "blank",
        options: ["key", "kite"],
      },

      {
        type: "text",
        value: "is",
      },

      {
        type: "blank",
        options: ["girl", "green"],
      },

      {
        type: "text",
        value: ".",
      },
    ],

    correct: ["kite", "green"],
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review5_Page2_Q3 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState(
    QUESTIONS.map((q) => q.correct.map(() => null)),
  );

  /*
    wrong blank IDs:
    "0-0"
    "0-1"
    "1-0"
    "1-1"
  */

  const [wrongInputs, setWrongInputs] = useState([]);

  /*
    correct locked blanks only
  */

  const [lockedInputs, setLockedInputs] = useState([]);

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

  const getBlankId = (qIndex, blankIndex) => `${qIndex}-${blankIndex}`;

  const isBlankLocked = (qIndex, blankIndex) =>
    lockedInputs.includes(getBlankId(qIndex, blankIndex));

  /* =================================================
     SELECT OPTION
  ================================================= */

  const handleSelect = (qIndex, blankIndex, option) => {
    if (showAnswer || checkCompleted || isBlankLocked(qIndex, blankIndex)) {
      return;
    }

    const updated = answers.map((row) => [...row]);

    updated[qIndex][blankIndex] = option;

    setAnswers(updated);

    /*
      remove X only from same blank
    */

    const id = getBlankId(qIndex, blankIndex);

    setWrongInputs((prev) => prev.filter((item) => item !== id));
  };

  /* =================================================
     OPTION CLICK
  ================================================= */

  const handleOptionActivate = (qIndex, blankIndex, option) => {
    /*
      audio always
    */

    playAudio(`option-${qIndex}-${blankIndex}-${option}`, AUDIO_MAP[option]);

    /*
      selection only if editable
    */

    handleSelect(qIndex, blankIndex, option);
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const hasEmpty = answers.some((question) =>
      question.some((answer) => answer === null),
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please choose an answer for every blank before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];
    const correctNow = [];

    QUESTIONS.forEach((question, qIndex) => {
      question.correct.forEach((correctAnswer, blankIndex) => {
        const id = getBlankId(qIndex, blankIndex);

        if (answers[qIndex][blankIndex] === correctAnswer) {
          correctCount++;

          correctNow.push(id);
        } else {
          wrong.push(id);
        }
      });
    });

    /*
      progressive locking
    */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...correctNow])));

    /*
      only wrong blanks show X
    */

    setWrongInputs(wrong);

    const total = QUESTIONS.reduce(
      (sum, question) => sum + question.correct.length,
      0,
    );

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      const allIds = [];

      QUESTIONS.forEach((q, qIndex) => {
        q.correct.forEach((_, blankIndex) => {
          allIds.push(getBlankId(qIndex, blankIndex));
        });
      });

      setLockedInputs(allIds);

      setWrongInputs([]);

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setAnswers(QUESTIONS.map((question) => [...question.correct]));

    const allIds = [];

    QUESTIONS.forEach((q, qIndex) => {
      q.correct.forEach((_, blankIndex) => {
        allIds.push(getBlankId(qIndex, blankIndex));
      });
    });

    setWrongInputs([]);

    setLockedInputs(allIds);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(QUESTIONS.map((q) => q.correct.map(() => null)));

    setWrongInputs([]);

    setLockedInputs([]);

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
          gap: "30px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="F"
          title="Look, read, and circle."
          subTitle="Use each picture to choose the correct words and complete the sentence."
        />

        <div className="w-full">
          {QUESTIONS.map((q, qIndex) => (
            <div className="question-row-review5-p2-q3" key={q.id}>
              {/* =====================================
                  SENTENCE
              ===================================== */}

              <div className="sentence-review5-p2-q3">
                <span
                  className="header-title-page8"
                  style={{
                    color: "#2c5287",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  {q.id}
                </span>

                {q.parts.map((part, pIndex) => {
                  /* =====================================
                     STATIC TEXT
                  ===================================== */

                  if (part.type === "text") {
                    /*
                      punctuation has no audio
                    */

                    if (part.value === ".") {
                      return (
                        <span
                          key={pIndex}
                          className="sentence-text-review5-p2-q3"
                        >
                          .
                        </span>
                      );
                    }

                    const audio = AUDIO_MAP[part.value];

                    const playing = playingKey === `text-${qIndex}-${pIndex}`;

                    return (
                      <span
                        key={pIndex}
                        role="button"
                        tabIndex={0}
                        aria-label={`Play audio: ${part.value}`}
                        className="sentence-text-review5-p2-q3 audio-text-review5-p2-q3"
                        onClick={() =>
                          playAudio(`text-${qIndex}-${pIndex}`, audio)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();

                            playAudio(`text-${qIndex}-${pIndex}`, audio);
                          }
                        }}
                      >
                        {part.value}

                        {playing && (
                          <FaVolumeUp
                            size={13}
                            aria-hidden="true"
                            className="audio-icon-review5-p2-q3"
                          />
                        )}
                      </span>
                    );
                  }

                  /* =====================================
                     BLANK OPTIONS
                  ===================================== */

                  if (part.type === "blank") {
                    const blanksBefore = q.parts
                      .slice(0, pIndex)
                      .filter((p) => p.type === "blank").length;

                    const blankIndex = blanksBefore;

                    const blankId = getBlankId(qIndex, blankIndex);

                    const locked = isBlankLocked(qIndex, blankIndex);

                    return (
                      <span
                        key={pIndex}
                        className="blank-options-review5-p2-q3"
                      >
                        {part.options.map((opt, optIndex) => {
                          const isSelected =
                            answers[qIndex][blankIndex] === opt;

                          const isWrongSelected =
                            wrongInputs.includes(blankId) && isSelected;

                          const playing =
                            playingKey ===
                            `option-${qIndex}-${blankIndex}-${opt}`;

                          return (
                            <div key={optIndex} className="option-wrapper">
                              <span
                                role="button"
                                /*
                                    correct locked option still tabbable
                                    because its audio stays available
                                  */

                                tabIndex={0}
                                aria-pressed={isSelected}
                                aria-label={
                                  locked
                                    ? `Play audio: ${opt}`
                                    : `Choose ${opt}`
                                }
                                className={`option-word-review5-p2-q3 ${
                                  isSelected ? "selected2" : ""
                                } ${
                                  locked ? "locked-option-review5-p2-q3" : ""
                                }`}
                                onClick={() =>
                                  handleOptionActivate(qIndex, blankIndex, opt)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();

                                    handleOptionActivate(
                                      qIndex,
                                      blankIndex,
                                      opt,
                                    );
                                  }
                                }}
                              >
                                {opt}

                                {playing && (
                                  <FaVolumeUp
                                    size={13}
                                    aria-hidden="true"
                                    className="audio-icon-review5-p2-q3"
                                  />
                                )}
                              </span>

                              {/* WRONG X */}

                              {isWrongSelected && (
                                <div className="wrong-mark" aria-hidden="true">
                                  ✕
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </span>
                    );
                  }

                  return null;
                })}
              </div>

              {/* =====================================
                  IMAGE
              ===================================== */}

              <img
                src={q.image}
                alt={q.alt}
                className="question-img-review5-p2-q3"
              />
            </div>
          ))}
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

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review5_Page2_Q3;
