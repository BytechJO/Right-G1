import React, { useRef, useState } from "react";

import img1 from "../../../assets/unit5/imgs/U5P45EXEF-01.svg";
import img2 from "../../../assets/unit5/imgs/U5P45EXEF-02.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit5_Page6_Q3.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import rulerQuestionAudio from "../../../assets/unit5/sounds/Page 45 - F/Is this a ruler.mp3";
import chairQuestionAudio from "../../../assets/unit5/sounds/Page 45 - F/Is this a chair.mp3";

import noAudio from "../../../assets/unit5/sounds/Page 45 - F/No, it isn’t.mp3";
import yesAudio from "../../../assets/unit5/sounds/Page 45 - F/Yes, it is..mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: 1,

    image: img1,

    alt: "A blue and pink eraser.",

    text: "Is this a ruler?",

    questionAudio: rulerQuestionAudio,

    items: [
      {
        text: "Yes, it is.",
        correct: false,
        audio: yesAudio,
      },

      {
        text: "No, it isn’t.",
        correct: true,
        audio: noAudio,
      },
    ],
  },

  {
    id: 2,

    image: img2,

    alt: "A wooden chair.",

    text: "Is this a chair?",

    questionAudio: chairQuestionAudio,

    items: [
      {
        text: "Yes, it is.",
        correct: true,
        audio: yesAudio,
      },

      {
        text: "No, it isn’t.",
        correct: false,
        audio: noAudio,
      },
    ],
  },
];

/* =====================================================
   AUDIO TEXT
===================================================== */

const AudioText = ({
  text,
  audio,
  audioId,
  playingId,
  playAudio,
  className = "",
}) => {
  const playing = playingId === audioId;

  const activate = () => {
    playAudio(audioId, audio);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`Play audio: ${text}`}
      className={`audio-text-unit5-p6-q3 ${className}`}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          activate();
        }
      }}
    >
      {text}

      {playing && (
        <FaVolumeUp
          size={15}
          aria-hidden="true"
          className="audio-icon-unit5-p6-q3"
        />
      )}
    </span>
  );
};

/* =====================================================
   MAIN
===================================================== */

const Unit5_Page6_Q3 = () => {
  const [answers, setAnswers] = useState({});

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingId(null);
  };

  const playAudio = (id, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingId(id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const isLocked = (qId) => lockedQuestions.includes(qId);

  /* =================================================
     SELECT
  ================================================= */

  const handleSelect = (qId, index) => {
    if (showAnswer || checkCompleted || isLocked(qId)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [qId]: index,
    }));

    /*
      امسح X فقط عن نفس السؤال
    */

    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  /* =================================================
     CHECK
  ================================================= */

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

      const correct = q.items[chosenIndex]?.correct === true;

      if (correct) {
        correctCount++;

        newlyLocked.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    /*
      الصح فقط يقفل
    */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    const correctAnswers = {};

    questions.forEach((q) => {
      const correctIndex = q.items.findIndex((item) => item.correct);

      correctAnswers[q.id] = correctIndex;
    });

    setAnswers(correctAnswers);

    setWrongQuestions([]);

    setLockedQuestions(questions.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers({});

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
          gap: "50px",
        }}
      >
        <ExerciseHeader
          sectionLetter="F"
          title={
            <>
              Look, read, and write{" "}
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
          subTitle="Look at each picture, then choose the correct yes or no answer."
        />

        <div className="Unit5-P6-Q3-grid w-full">
          {questions.map((q) => {
            const questionLocked = isLocked(q.id);

            return (
              <div key={q.id} className="Unit5-P6-Q3-box">
                {/* =========================
                    IMAGE + QUESTION
                ========================= */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="Unit5-P6-Q3-text"
                    style={{
                      color: "darkblue",
                    }}
                  >
                    {q.id}
                  </span>

                  <img src={q.image} alt={q.alt} className="Unit5-P6-Q3-img" />

                  <AudioText
                    text={q.text}
                    audio={q.questionAudio}
                    audioId={`question-${q.id}`}
                    playingId={playingId}
                    playAudio={playAudio}
                    className="Unit5-P6-Q3-text"
                  />
                </div>

                {/* =========================
                    ANSWERS
                ========================= */}

                <div>
                  {q.items.map((item, idx) => {
                    const isSelected = answers[q.id] === idx;

                    const isWrong = wrongQuestions.includes(q.id) && isSelected;

                    const disabled =
                      questionLocked || showAnswer || checkCompleted;

                    return (
                      <div key={idx} className="review3-p1-q3-row">
                        {/* =========================
                              ANSWER AUDIO
                          ========================= */}

                        <AudioText
                          text={item.text}
                          audio={item.audio}
                          audioId={`answer-${q.id}-${idx}`}
                          playingId={playingId}
                          playAudio={playAudio}
                          className="Unit5-P6-Q3-text"
                        />

                        {/* =========================
                              SELECT BOX
                          ========================= */}

                        <div className="review3-p1-q3-input-box">
                          <div
                            role="button"
                            tabIndex={disabled ? -1 : 0}
                            aria-pressed={isSelected}
                            aria-label={`Select ${item.text} for question ${q.id}`}
                            className={`review3-p1-q3-input keyboard-choice-unit5-p6-q3 ${
                              isSelected ? "selected-choice-unit5-p6-q3" : ""
                            }`}
                            onClick={() => handleSelect(q.id, idx)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();

                                handleSelect(q.id, idx);
                              }
                            }}
                            style={{
                              cursor: disabled ? "default" : "pointer",
                            }}
                          >
                            {isSelected ? "✓" : ""}
                          </div>

                          {!showAnswer && isWrong && (
                            <span
                              className="review3-p1-q3-x"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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

export default Unit5_Page6_Q3;
