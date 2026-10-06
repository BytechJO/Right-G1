import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U5/U5P29EXEF-01.svg";
import img2 from "../../../assets/U1 WB/U5/U5P29EXEF-02.svg";
import img3 from "../../../assets/U1 WB/U5/U5P29EXEF-03.svg";
import img4 from "../../../assets/U1 WB/U5/U5P29EXEF-04.svg";

import ExerciseHeader from "../../ExerciseHeader";
import "./WB_Unit5_Page3_Q2.css";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import q1Audio from "../../../assets/U1 WB/U5/audio/page_29_qF/Item_001_Is_this_a_book.mp3";
import yesAudio from "../../../assets/U1 WB/U5/audio/page_29_qF/Item_002_Yes,_it_is.mp3";
import q2Audio from "../../../assets/U1 WB/U5/audio/page_29_qF/Item_003_Is_this_a_pen.mp3";
import noAudio from "../../../assets/U1 WB/U5/audio/page_29_qF/Item_004_No,_it_isn't.mp3";
import q3Audio from "../../../assets/U1 WB/U5/audio/page_29_qF/Item_005_Is_this_a_chair.mp3";
import q4Audio from "../../../assets/U1 WB/U5/audio/page_29_qF/Item_006_Is_this_an_eraser.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: 1,
    text1: "Is this a book?",
    text2: "Yes, it is.",
    image: img1,
    alt: "A boy holding a book while a girl stands beside him.",
    correct: "✓",
    audio1: q1Audio,
    audio2: yesAudio,
  },

  {
    id: 2,
    text1: "Is this a pen?",
    text2: "No, it isn’t.",
    image: img2,
    alt: "A girl and a boy standing together while the boy holds up an object.",
    correct: "✓",
    audio1: q2Audio,
    audio2: noAudio,
  },

  {
    id: 3,
    text1: "Is this a chair?",
    text2: "No, it isn’t.",
    image: img3,
    alt: "A teacher standing beside a child holding a classroom object.",
    correct: "✗",
    audio1: q3Audio,
    audio2: noAudio,
  },

  {
    id: 4,
    text1: "Is this an eraser?",
    text2: "Yes, it is.",
    image: img4,
    alt: "A teacher standing beside a boy near a school desk.",
    correct: "✗",
    audio1: q4Audio,
    audio2: yesAudio,
  },
];

/* =====================================================
   AUDIO TEXT
===================================================== */

const AudioText = ({ text, audio, audioId, playingId, playAudio }) => {
  const playing = playingId === audioId;

  const activate = () => {
    playAudio(audioId, audio);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`Play audio: ${text}`}
      className="audio-text-wb-u5-p3-q2"
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
          className="audio-icon-wb-u5-p3-q2"
        />
      )}
    </span>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit5_Page3_Q2 = () => {
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

  const isQuestionLocked = (id) => lockedQuestions.includes(id);

  /* =================================================
     SELECT
  ================================================= */

  const selectAnswer = (id, value) => {
    if (showAnswer || checkCompleted || isQuestionLocked(id)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));

    setWrongQuestions((prev) => prev.filter((qId) => qId !== id));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const isEmpty = questions.some((q) => !answers[q.id]);

    if (isEmpty) {
      ValidationAlert.info("Please choose ✓ or ✗ for all questions!");
      return;
    }

    let correctCount = 0;

    const wrong = [];
    const correct = [];

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
        correct.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    setLockedQuestions((prev) => Array.from(new Set([...prev, ...correct])));

    setWrongQuestions(wrong);

    const total = questions.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedQuestions(questions.map((q) => q.id));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(resultHTML);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswersFunc = () => {
    stopAudio();

    const correctMap = {};

    questions.forEach((q) => {
      correctMap[q.id] = q.correct;
    });

    setAnswers(correctMap);

    setWrongQuestions([]);

    setLockedQuestions(questions.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const resetAnswers = () => {
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
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="F"
          title={
            <>
              Look, read, and write <span style={{ color: "red" }}>✓</span> or{" "}
              <span style={{ color: "red" }}>✗</span>.
            </>
          }
          subTitle={
            <>
              Compare the picture and sentence, then tap{" "}
              <span style={{ color: "red" }}>✓</span> if it is correct or{" "}
              <span style={{ color: "red" }}>✗</span> if it is not.
            </>
          }
        />

        <div
          className="wb-unit5-p3-q2-container"
          style={{
            gap: "70px",
          }}
        >
          {questions.map((q) => {
            const locked = isQuestionLocked(q.id);

            const wrong = wrongQuestions.includes(q.id);

            const disabled = locked || showAnswer || checkCompleted;

            return (
              <div key={q.id} className="unit3-q5-question-box">
                <div>
                  {/* =========================
                      SENTENCE AUDIO
                  ========================= */}

                  <p
                    className="unit3-q5-question-text"
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    <span
                      style={{
                        color: "darkblue",
                        fontWeight: "700",
                      }}
                    >
                      {q.id}.
                    </span>

                    <AudioText
                      text={q.text1}
                      audio={q.audio1}
                      audioId={`q-${q.id}-1`}
                      playingId={playingId}
                      playAudio={playAudio}
                    />

                    <br />

                    <AudioText
                      text={q.text2}
                      audio={q.audio2}
                      audioId={`q-${q.id}-2`}
                      playingId={playingId}
                      playAudio={playAudio}
                    />
                  </p>

                  {/* =========================
                      OPTIONS
                  ========================= */}

                  <div className="wb-unit5-p3-q2-options-box">
                    {/* YES / CHECK */}

                    <div className="option-wrapper">
                      <div
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        aria-pressed={answers[q.id] === "✓"}
                        aria-label={`Choose check mark for question ${q.id}`}
                        className={`option-btn ${
                          answers[q.id] === "✓" ? "selected" : ""
                        }`}
                        onClick={() => selectAnswer(q.id, "✓")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();

                            selectAnswer(q.id, "✓");
                          }
                        }}
                        style={{
                          cursor: disabled ? "default" : "pointer",
                        }}
                      >
                        ✓
                      </div>

                      {wrong && answers[q.id] === "✓" && (
                        <div className="unit3-q5-wrong-icon" aria-hidden="true">
                          ✕
                        </div>
                      )}
                    </div>

                    {/* NO / X */}

                    <div className="option-wrapper">
                      <div
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        aria-pressed={answers[q.id] === "✗"}
                        aria-label={`Choose cross mark for question ${q.id}`}
                        className={`option-btn ${
                          answers[q.id] === "✗" ? "selected" : ""
                        }`}
                        onClick={() => selectAnswer(q.id, "✗")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();

                            selectAnswer(q.id, "✗");
                          }
                        }}
                        style={{
                          cursor: disabled ? "default" : "pointer",
                        }}
                      >
                        ✗
                      </div>

                      {wrong && answers[q.id] === "✗" && (
                        <div className="unit3-q5-wrong-icon" aria-hidden="true">
                          ✕
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* =========================
                    IMAGE
                ========================= */}

                <div className="unit3-q5-flex">
                  <img
                    src={q.image}
                    alt={q.alt}
                    className="unit3-q5-question-img"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswersFunc} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit5_Page3_Q2;
