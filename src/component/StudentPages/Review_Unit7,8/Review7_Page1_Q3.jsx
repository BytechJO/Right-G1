import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review7_Page1_Q3.css";

import img1 from "../../../assets/unit8/imgs/U8P70EXEC-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P70EXEC-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P70EXEC-03.svg";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   AUDIO
===================================================== */

import boredAudio from "../../../assets/unit8/sound/Page 70 - C/Are you bored.mp3";
import coldAudio from "../../../assets/unit8/sound/Page 70 - C/Are you cold.mp3";
import happyAudio from "../../../assets/unit8/sound/Page 70 - C/Are you happy.mp3";
import hungryAudio from "../../../assets/unit8/sound/Page 70 - C/Are you hungry.mp3";
import sadAudio from "../../../assets/unit8/sound/Page 70 - C/Are you sad.mp3";
import scaredAudio from "../../../assets/unit8/sound/Page 70 - C/Are you scared.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,

    alt: "Two children sitting together under a shelter on a rainy day, looking cold.",

    options: [
      {
        label: "a",
        text: "Are you cold?",
        audio: coldAudio,
      },
      {
        label: "b",
        text: "Are you bored?",
        audio: boredAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img2,

    alt: "A boy standing near a tiger enclosure at the zoo, looking frightened by the tiger.",

    options: [
      {
        label: "a",
        text: "Are you hungry?",
        audio: hungryAudio,
      },
      {
        label: "b",
        text: "Are you scared?",
        audio: scaredAudio,
      },
    ],

    correctIndex: 1,
  },

  {
    img: img3,

    alt: "A smiling girl with a cheerful expression, looking happy.",

    options: [
      {
        label: "a",
        text: "Are you happy?",
        audio: happyAudio,
      },
      {
        label: "b",
        text: "Are you sad?",
        audio: sadAudio,
      },
    ],

    correctIndex: 0,
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review7_Page1_Q3 = () => {
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
      Click / Enter / Space:
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
    /*
      بعد Show Answer أو بعد اكتمال الكل:
      الزر يظل طبيعي لكنه no-op
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
        صح من Check سابق:
        يظل correct ومقفول
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
        <span style="color:${color};font-weight:bold;">
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

  const handleShowAnswer = () => {
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
          gap: "80px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="C"
          title="Look, read, and choose."
          subTitle="Look at each scene, then tap the question that matches it."
        />

        <div className="container-unit7-p5-q1">
          {items.map((q, i) => {
            const locked = isQuestionLocked(i);

            const isQuestionWrong = results[i] === "wrong";

            return (
              <div key={i} className="question-box-unit7-p5-q1">
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
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="img-div-unit7-p5-q1">
                    <img
                      src={q.img}
                      alt={q.alt}
                      className="q3-image-review7-p1-q3"
                    />
                  </div>

                  {/* =================================================
                      OPTIONS
                  ================================================= */}

                  <div className="options-row-review7-p1-q3">
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
                              option-word-unit7-p5-q1

                              ${isSelected ? "selected3" : ""}

                              ${isWrongSelected ? "wrong" : ""}
                            `}
                          onClick={() => {
                            if (locked) return;

                            handleSelect(i, optIndex);
                          }}
                          onKeyDown={(e) => {
                            if (locked) return;

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
                          {/* OPTION LETTER */}

                          <span
                            style={{
                              fontWeight: "900",
                              fontSize: "20px",
                              marginRight: "7px",
                            }}
                          >
                            {option.label}
                          </span>

                          {option.text}

                          {/* AUDIO ICON */}

                          {isPlaying && (
                            <FaVolumeUp
                              aria-hidden="true"
                              className="audio-icon-review7-p1-q3"
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

        <button
          className="show-answer-btn swal-continue"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review7_Page1_Q3;
