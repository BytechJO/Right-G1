import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review8_Page1_Q1.css";

import img1 from "../../../assets/unit8/imgs/U8P72EXEA-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P72EXEA-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P72EXEA-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P72EXEA-04.svg";
import img5 from "../../../assets/unit8/imgs/U8P72EXEA-05.svg";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   AUDIO
===================================================== */

import armAudio from "../../../assets/unit8/sound/Page 72 - A/arm.mp3";
import eyeAudio from "../../../assets/unit8/sound/Page 72 - A/eye.mp3";
import headAudio from "../../../assets/unit8/sound/Page 72 - A/head.mp3";
import legAudio from "../../../assets/unit8/sound/Page 72 - A/leg.mp3";
import noseAudio from "../../../assets/unit8/sound/Page 72 - A/nose.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,
    alt: "An illustrated human arm and hand.",
    options: ["leg", "arm", "head"],
    correctIndex: 1,
    correctAudio: armAudio,
  },

  {
    img: img2,
    alt: "An illustrated human leg and foot.",
    options: ["eye", "leg", "nose"],
    correctIndex: 1,
    correctAudio: legAudio,
  },

  {
    img: img3,
    alt: "A boy's face with an arrow pointing to his head.",
    options: ["head", "nose", "leg"],
    correctIndex: 0,
    correctAudio: headAudio,
  },

  {
    img: img4,
    alt: "A close-up illustration of an open eye.",
    options: ["arm", "eye", "head"],
    correctIndex: 1,
    correctAudio: eyeAudio,
  },

  {
    img: img5,
    alt: "A close-up illustration of a human nose.",
    options: ["nose", "arm", "eye"],
    correctIndex: 0,
    correctAudio: noseAudio,
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review8_Page1_Q1 = () => {
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

  const [playingIndex, setPlayingIndex] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingIndex(null);
  };

  const playCorrectAudio = (questionIndex) => {
    const item = items[questionIndex];

    if (!item?.correctAudio) return;

    stopAudio();

    const audio = new Audio(item.correctAudio);

    audioRef.current = audio;

    setPlayingIndex(questionIndex);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
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

  const isQuestionLocked = (index) => isQuestionCorrect(index);

  const allCorrect = items.every((_, index) => results[index] === "correct");

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    if (isQuestionLocked(qIndex)) return;

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
      بعد Show Answer أو لما الكل صح:
      Check يظل طبيعي لكنه no-op
    */

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
      /*
        السؤال الصح من Check سابق يظل correct
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
      <div className="div-forall mb-10">
        <ExerciseHeaderReview
          sectionLetter="A"
          title="Look, read, and circle."
          subTitle="Look at each picture, then tap the correct body-part word."
        />

        <div className="container-review8-p1-q1 w-full">
          {items.map((q, i) => {
            const questionCorrect = isQuestionCorrect(i);

            const isWrongQuestion = results[i] === "wrong";

            const correctWord = q.options[q.correctIndex];

            return (
              <div key={i} className="question-box-review8-p1-q1">
                {/* =================================================
                    NUMBER
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
                </div>

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

                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q3-image-review8-p1-q1"
                  />

                  {/* =================================================
                      OPTIONS
                  ================================================= */}

                  <div className="options-row-review8-p1-q1">
                    {q.options.map((word, optIndex) => {
                      const isSelected = answers[i] === optIndex;

                      const isCorrectOption = optIndex === q.correctIndex;

                      const isWrongSelected = isWrongQuestion && isSelected;

                      /*
                        بعد السؤال ما يصير صح:
                        الخيار الصحيح فقط يظل tabbable للصوت.
                      */

                      const audioAccessible =
                        questionCorrect && isCorrectOption;

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
                              ? `${correctWord}. Correct answer. Press Enter or Space to play audio.`
                              : `${word}${isSelected ? ". Selected." : ""}`
                          }
                          className={`
                            option-word-review8-p1-q1

                            ${isSelected ? "selected3" : ""}

                            ${isWrongSelected ? "wrong" : ""}
                          `}
                          id={`option-word-${i}-${optIndex}`}
                          onClick={(e) => {
                            /*
                              السؤال صار صح:
                              الصح يشغل الصوت فقط
                            */

                            if (questionCorrect) {
                              if (isCorrectOption) {
                                e.stopPropagation();

                                playCorrectAudio(i);
                              }

                              return;
                            }

                            handleSelect(i, optIndex);
                          }}
                          onKeyDown={(e) => {
                            if (e.key !== "Enter" && e.key !== " ") {
                              return;
                            }

                            e.preventDefault();
                            e.stopPropagation();

                            /*
                              بعد الصح:
                              الخيار الصح للصوت فقط
                            */

                            if (questionCorrect) {
                              if (isCorrectOption) {
                                playCorrectAudio(i);
                              }

                              return;
                            }

                            handleSelect(i, optIndex);
                          }}
                          style={{
                            position: "relative",
                          }}
                        >
                          {word}

                          {/* =================================================
                              AUDIO ICON
                              فقط أثناء تشغيل جواب السؤال الصح
                          ================================================= */}

                          {audioAccessible && playingIndex === i && (
                            <FaVolumeUp
                              aria-hidden="true"
                              className="audio-icon-review8-p1-q1"
                            />
                          )}

                          {/* =================================================
                              WRONG X
                          ================================================= */}

                          {isWrongSelected && (
                            <span
                              className="wrong-x-review8-p1-q1"
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

export default Review8_Page1_Q1;
