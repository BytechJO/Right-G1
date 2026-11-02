import React, { useRef, useState } from "react";
import "./Unit3_Page6_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { FaVolumeUp } from "react-icons/fa";

import img1 from "../../../assets/unit3/imgs3/P27exeE-01.svg";
import img2 from "../../../assets/unit3/imgs3/P27exeE-02.svg";
import img3 from "../../../assets/unit3/imgs3/P27exeE-03.svg";
import img4 from "../../../assets/unit3/imgs3/P27exeE-04.svg";

// Audios
import sound1 from "../../../assets/unit3/Page 27 - E/Close your book..mp3";
import sound2 from "../../../assets/unit3/Page 27 - E/Quiet!.mp3";
import sound3 from "../../../assets/unit3/Page 27 - E/Take out your pencil..mp3";
import sound4 from "../../../assets/unit3/Page 27 - E/Make a line.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const Unit3_Page6_Q2 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const questions = [
    {
      id: 1,
      text: "Close your book.",
      image: img1,
      alt: "A child closing a book.",
      correct: "✓",
      sound: sound1,
    },
    {
      id: 2,
      text: "Quiet!",
      image: img2,
      alt: "A child making a quiet gesture with a finger over the lips.",
      correct: "✓",
      sound: sound2,
    },
    {
      id: 3,
      text: "Take out your pencil.",
      image: img3,
      alt: "A classroom picture that does not show taking out a pencil.",
      correct: "✗",
      sound: sound3,
    },
    {
      id: 4,
      text: "Make a line.",
      image: img4,
      alt: "Children standing in a line.",
      correct: "✓",
      sound: sound4,
    },
  ];
  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState({});

  const [showResult, setShowResult] = useState([]);

  // الأسئلة الصحيحة المقفلة
  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  // كل السؤال انتهى
  const [completed, setCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingQuestion, setPlayingQuestion] = useState(null);

  const playQuestionAudio = (question) => {
    if (!question.sound) return;

    // وقف الصوت السابق
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(question.sound);

    audioRef.current = audio;

    setPlayingQuestion(question.id);

    audio.play().catch(() => {
      setPlayingQuestion(null);
    });

    audio.onended = () => {
      setPlayingQuestion(null);
    };

    audio.onerror = () => {
      setPlayingQuestion(null);
    };
  };

  const handleSentenceKeyDown = (e, question) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      playQuestionAudio(question);
    }
  };

  /* =====================================================
     SELECT ANSWER
  ===================================================== */

  const selectAnswer = (id, value) => {
    if (showCorrectAnswers || completed || lockedQuestions.includes(id)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));

    // لما يعدل سؤال غلط، نشيل نتيجة الخطأ عنه فقط
    setShowResult((prev) => {
      const updated = [...prev];

      const questionIndex = questions.findIndex((q) => q.id === id);

      if (questionIndex !== -1) {
        updated[questionIndex] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     OPTION KEYBOARD
  ===================================================== */

  const handleOptionKeyDown = (e, id, value) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      selectAnswer(id, value);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswersFunc = () => {
    const correctMap = {};

    questions.forEach((q) => {
      correctMap[q.id] = q.correct;
    });

    setAnswers(correctMap);

    setShowResult(questions.map(() => "correct"));

    setLockedQuestions(questions.map((q) => q.id));

    setShowCorrectAnswers(true);

    setCompleted(true);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showCorrectAnswers || completed) {
      return;
    }

    // لازم كل سؤال يكون مجاوب
    const isEmpty = questions.some((q) => !answers[q.id]);

    if (isEmpty) {
      ValidationAlert.info("Oops!", "Please choose ✓ or ✗ for all questions!");

      return;
    }

    const results = questions.map((q) =>
      answers[q.id] === q.correct ? "correct" : "wrong",
    );

    setShowResult(results);

    /* =========================================
       اقفل الأسئلة الصحيحة فقط
    ========================================= */

    const newlyLocked = questions
      .filter((q, index) => results[index] === "correct")
      .map((q) => q.id);

    const allLocked = Array.from(new Set([...lockedQuestions, ...newlyLocked]));

    setLockedQuestions(allLocked);

    /* =========================================
       SCORE
    ========================================= */

    const correctCount = results.filter((r) => r === "correct").length;

    const total = questions.length;

    const scoreMsg = `${correctCount} / ${total}`;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div
        style="
          font-size:20px;
          text-align:center;
          margin-top:8px;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${scoreMsg}
        </span>
      </div>
    `;

    /* =========================================
       ALL CORRECT
    ========================================= */

    if (correctCount === total) {
      setCompleted(true);

      setLockedQuestions(questions.map((q) => q.id));

      ValidationAlert.success(resultHTML);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers({});

    setShowResult([]);

    setLockedQuestions([]);

    setShowCorrectAnswers(false);

    setCompleted(false);

    setPlayingQuestion(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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
          gap: "60px",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title={
            <>
              Read, look, and write{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                ✓{" "}
              </span>
              or{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                ✗{" "}
              </span>
              .
            </>
          }
          subTitle={
            <>
              Read each command, compare it with the picture, then choose
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                check{" "}
              </span>
              or{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                ✗{" "}
              </span>
              .
            </>
          }
        />
        <div className="unit3-q5-container">
          {questions.map((q, index) => {
            const isLocked = lockedQuestions.includes(q.id);

            const isPlaying = playingQuestion === q.id;

            const isWrong = showResult[index] === "wrong";

            return (
              <div
                key={q.id}
                className={`
                    unit3-q5-question-box

                    ${isLocked ? "question-locked" : ""}
                  `}
              >
                {/* =========================================
                      SENTENCE + AUDIO
                  ========================================= */}

                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`${q.text}. Press Enter or Space to hear the sentence.`}
                  onClick={() => playQuestionAudio(q)}
                  onKeyDown={(e) => handleSentenceKeyDown(e, q)}
                  className={`
                      unit3-q5-question-text
                      unit3-q5-audio-sentence

                      ${isPlaying ? "sentence-playing" : ""}
                    `}
                >
                  <span
                    style={{
                      color: "darkblue",
                      fontWeight: "700",
                    }}
                  >
                    {q.id}.
                  </span>

                  <span>{q.text}</span>

                  {isPlaying && (
                    <FaVolumeUp
                      className="unit3-q5-volume-icon"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="unit3-q5-flex">
                  <img
                    src={q.image}
                    alt={q.alt}
                    aria-hidden="true"
                    className="unit3-q5-question-img"
                  />

                  <div className="unit3-q5-options-box">
                    {/* =====================================
                          TRUE
                      ===================================== */}

                    <div className="option-wrapper">
                      <div
                        role="button"
                        tabIndex={
                          isLocked || showCorrectAnswers || completed ? -1 : 0
                        }
                        aria-label={`Question ${q.id}, true`}
                        aria-pressed={answers[q.id] === "✓"}
                        aria-disabled={
                          isLocked || showCorrectAnswers || completed
                        }
                        className={`
                            option-btn

                            ${answers[q.id] === "✓" ? "selected" : ""}

                            ${isLocked ? "option-locked" : ""}
                          `}
                        onClick={() => selectAnswer(q.id, "✓")}
                        onKeyDown={(e) => handleOptionKeyDown(e, q.id, "✓")}
                      >
                        ✓
                      </div>

                      {isWrong && answers[q.id] === "✓" && (
                        <div className="unit3-q5-wrong-icon" aria-hidden="true">
                          ✕
                        </div>
                      )}
                    </div>

                    {/* =====================================
                          FALSE
                      ===================================== */}

                    <div className="option-wrapper">
                      <div
                        role="button"
                        tabIndex={
                          isLocked || showCorrectAnswers || completed ? -1 : 0
                        }
                        aria-label={`Question ${q.id}, false`}
                        aria-pressed={answers[q.id] === "✗"}
                        aria-disabled={
                          isLocked || showCorrectAnswers || completed
                        }
                        className={`
                            option-btn

                            ${answers[q.id] === "✗" ? "selected" : ""}

                            ${isLocked ? "option-locked" : ""}
                          `}
                        onClick={() => selectAnswer(q.id, "✗")}
                        onKeyDown={(e) => handleOptionKeyDown(e, q.id, "✗")}
                      >
                        ✗
                      </div>

                      {isWrong && answers[q.id] === "✗" && (
                        <div className="unit3-q5-wrong-icon" aria-hidden="true">
                          ✕
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================
            BUTTONS
        ========================================= */}

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

export default Unit3_Page6_Q2;
