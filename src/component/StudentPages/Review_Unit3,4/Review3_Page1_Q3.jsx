import React, { useRef, useState } from "react";

import img1 from "../../../assets/unit4/imgs/U4P34EXEC-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P34EXEC-02.svg";
import img3 from "../../../assets/unit4/imgs/U4P34EXEC-03.svg";

import closeBookAudio from "../../../assets/unit4/Page 34 - C/Close your book..mp3";
import listenAudio from "../../../assets/unit4/Page 34 - C/Listen!.mp3";
import makeLineAudio from "../../../assets/unit4/Page 34 - C/Make a line.mp3";
import openBookAudio from "../../../assets/unit4/Page 34 - C/Open your book..mp3";
import quietAudio from "../../../assets/unit4/Page 34 - C/Quiet!.mp3";
import takePencilAudio from "../../../assets/unit4/Page 34 - C/take out your pencil..mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review3_Page1_Q3.css";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

const Review3_Page1_Q3 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const questions = [
    {
      id: 1,

      image: img1,

      alt: "A teacher showing an open book to a student.",

      items: [
        {
          text: "Close your book.",
          correct: false,
          audio: closeBookAudio,
        },
        {
          text: "Open your book.",
          correct: true,
          audio: openBookAudio,
        },
      ],
    },

    {
      id: 2,

      image: img2,

      alt: "Students standing together in a line.",

      items: [
        {
          text: "Take out your pencil.",
          correct: false,
          audio: takePencilAudio,
        },
        {
          text: "Make a line.",
          correct: true,
          audio: makeLineAudio,
        },
      ],
    },

    {
      id: 3,

      image: img3,

      alt: "A teacher speaking beside a radio while students listen.",

      items: [
        {
          text: "Listen!",
          correct: true,
          audio: listenAudio,
        },
        {
          text: "Quiet!",
          correct: false,
          audio: quietAudio,
        },
      ],
    },
  ];

  /* =====================================================
     ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState({});

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingText, setPlayingText] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingText(null);
  };

  const playAudio = (text, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingText(text);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingText(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingText(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingText(null);
    };
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  /* =====================================================
     SELECT ANSWER
  ===================================================== */

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

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const hasEmpty = questions.some((q) => answers[q.id] === undefined);

    if (hasEmpty) {
      ValidationAlert.info("Please answer all questions!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    questions.forEach((q) => {
      const chosenIndex = answers[q.id];

      const isCorrect = q.items[chosenIndex]?.correct === true;

      if (isCorrect) {
        correctCount++;

        newlyLocked.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    /*
      الصح فقط يتقفل
    */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /*
      الغلط فقط عليه X
    */

    setWrongQuestions(wrong);

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

    /* ==================================================
       ALL CORRECT
    ================================================== */

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
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

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
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
          sectionLetter="C"
          title={
            <>
              Read and write{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                ✓
              </span>
              .
            </>
          }
          subTitle="Look at each picture, then tap the matching classroom command."
        />

        <div className="review3-p1-q3-grid">
          {questions.map((q) => {
            const questionLocked = isQuestionLocked(q.id);

            const questionWrong = wrongQuestions.includes(q.id);

            return (
              <div key={q.id} className="review3-p1-q3-box">
                {/* ======================================
                    IMAGE
                ====================================== */}

                <img src={q.image} alt={q.alt} className="review3-p1-q3-img" />

                {/* ======================================
                    OPTIONS
                ====================================== */}

                {q.items.map((item, idx) => {
                  const isSelected = answers[q.id] === idx;

                  const isWrong = questionWrong && isSelected;

                  const disabled =
                    questionLocked || showAnswer || checkCompleted;

                  const isPlaying = playingText === item.text;

                  return (
                    <div key={idx} className="review3-p1-q3-row">
                      {/* =================================
                            AUDIO TEXT
                        ================================= */}

                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Play audio for ${item.text}`}
                        onClick={() => playAudio(item.text, item.audio)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();

                            e.stopPropagation();

                            playAudio(item.text, item.audio);
                          }
                        }}
                        className="review3-p1-q3-text review3-p1-q3-audio-text"
                        style={{
                          position: "relative",

                          display: "inline-flex",

                          alignItems: "center",

                          cursor: "pointer",
                        }}
                      >
                        {item.text}

                        {isPlaying && (
                          <FaVolumeUp
                            size={16}
                            aria-hidden="true"
                            className="review3-p1-q3-audio-icon"
                          />
                        )}
                      </span>

                      {/* =================================
                            ANSWER INPUT
                        ================================= */}

                      <div className="review3-p1-q3-input-box">
                        <input
                          type="text"
                          readOnly
                          value={isSelected ? "✓" : ""}
                          role="button"
                          tabIndex={disabled ? -1 : 0}
                          aria-disabled={disabled}
                          aria-pressed={isSelected}
                          aria-label={`${item.text}${
                            isSelected ? ", selected" : ""
                          }. Press Enter or Space to select this answer.`}
                          /*
                              Mouse فقط
                            */
                          onClick={() => {
                            if (disabled) {
                              return;
                            }

                            handleSelect(q.id, idx);
                          }}
                          /*
                              مهم:
                              ما في onFocus هون.
                              Tab لحاله ما بختار.
                            */

                          onKeyDown={(e) => {
                            if (disabled) {
                              return;
                            }

                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              handleSelect(q.id, idx);
                            }
                          }}
                          className="review3-p1-q3-input"
                        />

                        {isWrong && (
                          <span className="review3-p1-q3-x" aria-hidden="true">
                            ✕
                          </span>
                        )}
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

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review3_Page1_Q3;
