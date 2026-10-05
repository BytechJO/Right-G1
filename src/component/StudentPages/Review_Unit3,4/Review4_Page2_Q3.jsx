import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review4_Page2_Q3.css";

import img1 from "../../../assets/unit4/imgs/U4P37EXEG-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P37EXEG-02.svg";
import img3 from "../../../assets/unit4/imgs/U4P37EXEG-03.svg";
import img4 from "../../../assets/unit4/imgs/U4P37EXEG-04.svg";

/* =====================================================
   AUDIO
===================================================== */

import feetAudio from "../../../assets/unit4/Page 37 - G/feet.mp3";
import fishAudio from "../../../assets/unit4/Page 37 - G/fish.mp3";
import forkAudio from "../../../assets/unit4/Page 37 - G/fork.mp3";
import vanAudio from "../../../assets/unit4/Page 37 - G/van.mp3";
import vestAudio from "../../../assets/unit4/Page 37 - G/vest.mp3";
import vetAudio from "../../../assets/unit4/Page 37 - G/vet.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

const Review4_Page2_Q3 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const items = [
    {
      img: img1,

      alt: "A blue vest.",

      options: [
        {
          word: "vest",
          audio: vestAudio,
        },
        {
          word: "van",
          audio: vanAudio,
        },
      ],

      correctIndex: 0,
    },

    {
      img: img2,

      alt: "A fork.",

      options: [
        {
          word: "feet",
          audio: feetAudio,
        },
        {
          word: "fork",
          audio: forkAudio,
        },
      ],

      correctIndex: 1,
    },

    {
      img: img3,

      alt: "A yellow van.",

      options: [
        {
          word: "fish",
          audio: fishAudio,
        },
        {
          word: "van",
          audio: vanAudio,
        },
      ],

      correctIndex: 1,
    },

    {
      img: img4,

      alt: "A veterinarian.",

      options: [
        {
          word: "vet",
          audio: vetAudio,
        },
        {
          word: "vest",
          audio: vestAudio,
        },
      ],

      correctIndex: 0,
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

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

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (index) => lockedQuestions.includes(index);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    const updated = [...answers];

    updated[qIndex] = optionIndex;

    setAnswers(updated);

    /*
      شيل X فقط من نفس السؤال
    */

    setWrongQuestions((prev) => prev.filter((index) => index !== qIndex));
  };

  /* =====================================================
     OPTION ACTION
     صوت + اختيار
  ===================================================== */

  const handleOptionAction = (qIndex, optionIndex, word, audio) => {
    /*
      الصوت يشتغل دائمًا
    */

    playAudio(`${qIndex}-${optionIndex}`, audio);

    /*
      إذا السؤال مقفول:
      صوت فقط، بدون تغيير الإجابة
    */

    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    handleSelect(qIndex, optionIndex);
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    answers.forEach((answer, index) => {
      if (answer === items[index].correctIndex) {
        correctCount++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
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

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (correctCount === total) {
      setLockedQuestions(items.map((_, index) => index));

      setWrongQuestions([]);

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    const correct = items.map((item) => item.correctIndex);

    setAnswers(correct);

    setWrongQuestions([]);

    setLockedQuestions(items.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(items.length).fill(null));

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
          gap: "70px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="G"
          title="Look, read, and circle."
          subTitle="Look at each picture, then tap the correct word beneath it."
        />

        <div className="container-review3-p2-q3 w-full gap-10">
          {items.map((q, qIndex) => {
            const questionLocked = isQuestionLocked(qIndex);

            const questionWrong = wrongQuestions.includes(qIndex);

            return (
              <div
                key={qIndex}
                className="question-box-review3-p2-q3"
                style={{
                  width: "100%",
                }}
              >
                {/* =================================================
                      IMAGE
                  ================================================= */}

                <div
                  style={{
                    display: "flex",

                    gap: "13px",

                    flexDirection: "row",

                    alignItems: "flex-start",

                    width: "100%",

                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "25px",

                      color: "darkblue",

                      fontWeight: "600",
                    }}
                  >
                    {qIndex + 1}
                  </span>

                  <div className="img-div-review3-p2-q3">
                    <img
                      src={q.img}
                      className="q3-image-review4-p2-q3"
                      alt={q.alt}
                    />
                  </div>
                </div>

                {/* =================================================
                      OPTIONS
                  ================================================= */}

                <div className="options-row-review3-p2-q3">
                  {q.options.map((option, optionIndex) => {
                    const isSelected = answers[qIndex] === optionIndex;

                    const isCorrect = optionIndex === q.correctIndex;

                    const isWrong = questionWrong && isSelected && !isCorrect;

                    const isPlaying = playingKey === `${qIndex}-${optionIndex}`;

                    /*
                          السؤال الصح بعد Check:
                          نخلي فقط الكلمة الصح بالـTab
                          حتى يقدر يشغل صوتها.

                          السؤال الغلط:
                          الخيارين يظلوا بالـTab.
                        */

                    const tabIndex =
                      questionLocked || showAnswer || checkCompleted
                        ? isCorrect
                          ? 0
                          : -1
                        : 0;

                    return (
                      <p
                        key={optionIndex}
                        role="button"
                        tabIndex={tabIndex}
                        aria-pressed={isSelected}
                        aria-label={
                          questionLocked || showAnswer || checkCompleted
                            ? `${option.word}. Press Enter or Space to play the audio.`
                            : `${option.word}${
                                isSelected ? ", selected" : ""
                              }. Press Enter or Space to hear and select this word.`
                        }
                        className={`
                              option-word-review3-p2-q3
                              ${isSelected ? "selected" : ""}
                              ${isWrong ? "wrong" : ""}
                              ${
                                (questionLocked ||
                                  showAnswer ||
                                  checkCompleted) &&
                                isCorrect
                                  ? "correct"
                                  : ""
                              }
                            `}
                        onClick={() =>
                          handleOptionAction(
                            qIndex,
                            optionIndex,
                            option.word,
                            option.audio,
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();

                            e.stopPropagation();

                            handleOptionAction(
                              qIndex,
                              optionIndex,
                              option.word,
                              option.audio,
                            );
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
                        {option.word}

                        {/* =========================================
                                AUDIO ICON
                            ========================================= */}

                        {isPlaying && (
                          <FaVolumeUp
                            size={16}
                            aria-hidden="true"
                            className="audio-icon-review4-p2-q3"
                          />
                        )}

                        {/* =========================================
                                WRONG X
                            ========================================= */}

                        {isWrong && (
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

export default Review4_Page2_Q3;
