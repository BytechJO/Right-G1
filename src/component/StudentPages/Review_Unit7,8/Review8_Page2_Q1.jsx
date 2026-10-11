import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review8_Page2_Q1.css";

import img1 from "../../../assets/unit8/imgs/U8P73EXED-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P73EXED-02.svg";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   AUDIO
===================================================== */

import closeEyesAudio from "../../../assets/unit8/sound/Page 73 - D/Close your eyes..mp3";
import openMouthAudio from "../../../assets/unit8/sound/Page 73 - D/Open your mouth..mp3";
import raiseHandAudio from "../../../assets/unit8/sound/Page 73 - D/Raise your hand..mp3";
import touchHeadAudio from "../../../assets/unit8/sound/Page 73 - D/Touch your head..mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,

    alt: "Two boys facing each other; one boy is opening his mouth while the other looks at him.",

    options: [
      {
        text: "Open your mouth.",
        audio: openMouthAudio,
      },
      {
        text: "Close your eyes.",
        audio: closeEyesAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img2,

    alt: "A smiling boy raising one hand high above his head.",

    options: [
      {
        text: "Touch your head.",
        audio: touchHeadAudio,
      },
      {
        text: "Raise your hand.",
        audio: raiseHandAudio,
      },
    ],

    correctIndex: 1,
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review8_Page2_Q1 = () => {
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

    audio.onerror = audio.onended;
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

  const isQuestionCorrect = (index) =>
    results[index] === "correct" || showAnswerMode;

  const allCorrect = items.every((_, index) => results[index] === "correct");

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    const questionCorrect = isQuestionCorrect(qIndex);

    const option = items[qIndex].options[optionIndex];

    /*
      إذا السؤال صح:
      الخيار الصح للصوت فقط
    */

    if (questionCorrect) {
      if (optionIndex === items[qIndex].correctIndex) {
        playAudio(`option-${qIndex}-${optionIndex}`, option.audio);
      }

      return;
    }

    /*
      قبل الصح:
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
      شيل X عنه فقط
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
    if (showAnswerMode || allCorrect) return;

    const hasEmpty = items.some(
      (_, index) => results[index] !== "correct" && answers[index] === null,
    );

    if (hasEmpty) {
      ValidationAlert.info("Oops!", "Please circle all words first.");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    items.forEach((item, index) => {
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
          gap: "90px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="D"
          title="Look, read, and circle."
          subTitle="Look at each picture, then tap the sentence that describes it."
        />

        <div className="container-review8-p2-q1 w-full">
          {items.map((q, i) => {
            const questionCorrect = isQuestionCorrect(i);

            const isWrongQuestion = results[i] === "wrong";

            return (
              <div
                key={i}
                className="question-box-review6-p1-q1"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  {/* NUMBER */}

                  <span
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {i + 1}
                  </span>

                  {/* IMAGE */}

                  <div className="img-div-review6-p1-q1 w-full">
                    <img
                      src={q.img}
                      alt={q.alt}
                      className="q3-image-review6-p1-q1"
                      style={{
                        height: "200px",
                        width: "auto",
                      }}
                    />
                  </div>

                  {/* OPTIONS */}

                  <div className="options-row-review6-p1-q1">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[i] === optIndex;

                      const isCorrect = optIndex === q.correctIndex;

                      const isWrongSelected = isWrongQuestion && isSelected;

                      /*
                        بعد السؤال الصح:
                        الصحيح فقط يظل tabbable للصوت
                      */

                      const audioAccessible = questionCorrect && isCorrect;

                      const playing = playingKey === `option-${i}-${optIndex}`;

                      return (
                        <p
                          key={optIndex}
                          role="button"
                          tabIndex={
                            questionCorrect ? (audioAccessible ? 0 : -1) : 0
                          }
                          aria-disabled={questionCorrect && !audioAccessible}
                          aria-pressed={isSelected}
                          aria-label={
                            audioAccessible
                              ? `${option.text} Correct answer. Press Enter or Space to play audio.`
                              : `${option.text}${
                                  isSelected ? " Selected." : ""
                                }`
                          }
                          className={`
                            option-word-review6-p1-q1

                            ${isSelected ? "selected3" : ""}

                            ${isWrongSelected ? "wrong" : ""}

                            ${questionCorrect && isCorrect ? "correct" : ""}
                          `}
                          onClick={() => handleSelect(i, optIndex)}
                          onKeyDown={(e) => {
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

                          {/* AUDIO ICON */}

                          {playing && (
                            <FaVolumeUp
                              aria-hidden="true"
                              className="audio-icon-review8-p2-q1"
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

      {/* BUTTONS */}

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

export default Review8_Page2_Q1;
