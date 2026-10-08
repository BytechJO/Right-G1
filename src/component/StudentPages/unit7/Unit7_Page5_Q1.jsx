import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page5_Q1.css";

import img1 from "../../../assets/unit7/img/U7P62EXEA1-01.svg";
import img2 from "../../../assets/unit7/img/U7P62EXEA1-02.svg";
import img3 from "../../../assets/unit7/img/U7P62EXEA1-03.svg";
import img4 from "../../../assets/unit7/img/U7P62EXEA1-04.svg";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import handAudio from "../../../assets/unit7/sound/Page 62 - A 1/hand.mp3";
import hatAudio from "../../../assets/unit7/sound/Page 62 - A 1/hat.mp3";
import houseAudio from "../../../assets/unit7/sound/Page 62 - A 1/house.mp3";
import waterAudio from "../../../assets/unit7/sound/Page 62 - A 1/water.mp3";
import windowAudio from "../../../assets/unit7/sound/Page 62 - A 1/window.mp3";
import womanAudio from "../../../assets/unit7/sound/Page 62 - A 1/Woman.mp3";

/* =====================================================
   ITEMS
===================================================== */

const items = [
  {
    img: img1,
    alt: "An open human hand with the palm facing forward.",
    options: [
      {
        word: "house",
        audio: houseAudio,
      },
      {
        word: "hand",
        audio: handAudio,
      },
    ],
    correctIndex: 1,
  },

  {
    img: img2,
    alt: "A wooden arched window with glass panes.",
    options: [
      {
        word: "water",
        audio: waterAudio,
      },
      {
        word: "window",
        audio: windowAudio,
      },
    ],
    correctIndex: 1,
  },

  {
    img: img3,
    alt: "A woman with dark hair wearing an orange shirt.",
    options: [
      {
        word: "woman",
        audio: womanAudio,
      },
      {
        word: "water",
        audio: waterAudio,
      },
    ],
    correctIndex: 0,
  },

  {
    img: img4,
    alt: "A small pink house with a red roof and a chimney.",
    options: [
      {
        word: "house",
        audio: houseAudio,
      },
      {
        word: "hat",
        audio: hatAudio,
      },
    ],
    correctIndex: 0,
  },
];

const Unit7_Page5_Q1 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  // null | correct | wrong
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
    results[index] === "correct" || showAnswerMode;

  const allCorrect = items.every(
    (item, index) =>
      answers[index] === item.correctIndex &&
      (results[index] === "correct" || showAnswerMode),
  );

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswerMode) return;

    /*
      الصحيح المقفول ما بيتغير.
    */

    if (results[qIndex] === "correct") {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      تعديل نفس السؤال الغلط:
      يشيل الـX عنه فقط.
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
     OPTION AUDIO + SELECT
  ===================================================== */

  const activateOption = (qIndex, optionIndex) => {
    const option = items[qIndex].options[optionIndex];

    const audioKey = `option-${qIndex}-${optionIndex}`;

    /*
      الصوت يشتغل أول.
    */

    playAudio(audioKey, option.audio);

    /*
      إذا السؤال correct locked:
      صوت فقط، بدون تغيير الاختيار.
    */

    if (showAnswerMode || results[qIndex] === "correct") {
      return;
    }

    handleSelect(qIndex, optionIndex);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    /*
      لما الكل صح:
      Check يضل ظاهر وطبيعي
      لكنه no-op.
    */

    if (allCorrect || showAnswerMode) {
      return;
    }

    const hasEmpty = items.some(
      (_, index) => results[index] !== "correct" && answers[index] === null,
    );

    if (hasEmpty) {
      ValidationAlert.info("Oops!", "Please circle all words first.");

      return;
    }

    const updatedResults = [...results];

    let correctCount = 0;

    items.forEach((item, index) => {
      /*
          سؤال كان correct من Check سابق.
        */

      if (results[index] === "correct") {
        updatedResults[index] = "correct";

        correctCount++;

        return;
      }

      /*
          فحص السؤال الحالي.
        */

      if (answers[index] === item.correctIndex) {
        updatedResults[index] = "correct";

        correctCount++;
      } else {
        updatedResults[index] = "wrong";
      }
    });

    setResults(updatedResults);

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="
        font-size:20px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
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

    const correct = items.map((q) => q.correctIndex);

    const correctResults = items.map(() => "correct");

    setAnswers(correct);

    setResults(correctResults);

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
          gap: "120px",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          questionNumber="1"
          title="Look, read, and circle."
          subTitle="Look at each picture, then tap the correct word."
        />

        <div className="container-unit7-p5-q1">
          {items.map((q, i) => {
            const questionLocked = isQuestionLocked(i);

            const questionWrong = results[i] === "wrong";

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
                  {/* =========================
                        IMAGE
                    ========================== */}

                  <div className="img-div-unit7-p5-q1">
                    <img
                      src={q.img}
                      alt={q.alt}
                      className="q3-image-unit7-p5-q1"
                    />
                  </div>

                  {/* =========================
                        OPTIONS
                    ========================== */}

                  <div className="options-row-unit7-p5-q1">
                    {q.options.map((option, optIndex) => {
                      const word = option.word;

                      const isSelected = answers[i] === optIndex;

                      const isCorrect = optIndex === q.correctIndex;

                      const isCorrectLocked =
                        questionLocked && isSelected && isCorrect;

                      const showWrongX =
                        questionWrong && isSelected && !isCorrect;

                      const audioKey = `option-${i}-${optIndex}`;

                      const isPlaying = playingKey === audioKey;

                      /*
                            بعد Check:
                            الصحيح المختار يظل
                            Audio accessible فقط.

                            الخيار الثاني داخل السؤال
                            يطلع من الـTab.
                          */

                      const canReplayLockedAudio = isCorrectLocked;

                      return (
                        <div key={optIndex} className="option-wrapper">
                          <p
                            className={`
                                  option-word-unit7-p5-q1

                                  ${isSelected ? "selected3" : ""}

                                  ${
                                    results[i] === "correct" && isSelected
                                      ? "correct"
                                      : ""
                                  }

                                  ${showWrongX ? "wrong" : ""}
                                `}
                            role="button"
                            tabIndex={
                              questionLocked
                                ? canReplayLockedAudio
                                  ? 0
                                  : -1
                                : 0
                            }
                            aria-pressed={isSelected}
                            aria-label={
                              canReplayLockedAudio
                                ? `${word}. Correct answer. Play audio.`
                                : `Question ${i + 1}: ${word}. ${
                                    isSelected ? "Selected." : "Not selected."
                                  } Press Enter or Space to hear and select this answer.`
                            }
                            onClick={() => {
                              /*
                                    Locked correct:
                                    صوت فقط.
                                  */

                              if (questionLocked) {
                                if (canReplayLockedAudio) {
                                  playAudio(audioKey, option.audio);
                                }

                                return;
                              }

                              /*
                                    Editable:
                                    صوت + اختيار.
                                  */

                              activateOption(i, optIndex);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();

                                /*
                                      Locked correct:
                                      صوت فقط.
                                    */

                                if (questionLocked) {
                                  if (canReplayLockedAudio) {
                                    playAudio(audioKey, option.audio);
                                  }

                                  return;
                                }

                                /*
                                      Editable:
                                      صوت + اختيار.
                                    */

                                activateOption(i, optIndex);
                              }
                            }}
                            style={{
                              display: "flex",

                              justifyContent: "center",

                              alignItems: "center",

                              /*
                                    مهم لأيقونة الصوت.
                                  */

                              position: "relative",

                              cursor:
                                questionLocked && !canReplayLockedAudio
                                  ? "default"
                                  : "pointer",
                            }}
                          >
                            {word}

                            {/* =========================
                                    AUDIO ICON

                                    فوق يمين
                                    absolute
                                    ما بتأثر على الكلمة.
                                ========================== */}

                            {isPlaying && (
                              <FaVolumeUp
                                size={14}
                                aria-hidden="true"
                                style={{
                                  position: "absolute",

                                  top: "-8px",

                                  right: "-8px",

                                  pointerEvents: "none",

                                  zIndex: 3,
                                }}
                              />
                            )}

                            {/* =========================
                                    WRONG X
                                ========================== */}

                            {showWrongX && (
                              <span
                                className="wrong-x-review4-p2-q3"
                                aria-hidden="true"
                              >
                                ✕
                              </span>
                            )}
                          </p>
                        </div>
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

export default Unit7_Page5_Q1;
