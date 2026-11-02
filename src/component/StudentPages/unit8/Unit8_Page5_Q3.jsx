import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit8_Page5_Q3.css";

import img1 from "../../../assets/unit8/imgs/U8P68EXEB-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P68EXEB-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P68EXEB-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P68EXEB-04.svg";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import armAudio from "../../../assets/unit8/sound/Page 68 - B/arm.mp3";
import bendYourAudio from "../../../assets/unit8/sound/Page 68 - B/Bend your.mp3";
import eyeAudio from "../../../assets/unit8/sound/Page 68 - B/eye.mp3";
import handAudio from "../../../assets/unit8/sound/Page 68 - B/hand.mp3";
import kneeAudio from "../../../assets/unit8/sound/Page 68 - B/knee.mp3";
import legAudio from "../../../assets/unit8/sound/Page 68 - B/leg.mp3";
import mouthAudio from "../../../assets/unit8/sound/Page 68 - B/mouth.mp3";
import noseAudio from "../../../assets/unit8/sound/Page 68 - B/nose.mp3";
import openYourAudio from "../../../assets/unit8/sound/Page 68 - B/Open your.mp3";
import raiseYourAudio from "../../../assets/unit8/sound/Page 68 - B/Raise your.mp3";
import touchYourAudio from "../../../assets/unit8/sound/Page 68 - B/Touch your.mp3";
/* =====================================================
   Full AUDIO
===================================================== */
import bendYourKneeAudio from "../../../assets/unit8/sound/Page 68 - B/bend-your_knee.mp3";
import openYourMouthAudio from "../../../assets/unit8/sound/Page 68 - B/open-your_mouth.mp3";
import raiseYourHandAudio from "../../../assets/unit8/sound/Page 68 - B/raise-your_hand.mp3";
import touchYourArmAudio from "../../../assets/unit8/sound/Page 68 - B/touch-your_arm.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,
    alt: "A person touching their arm.",

    text: "Touch your",
    textAudio: touchYourAudio,

    options: [
      {
        text: "arm",
        audio: armAudio,
      },
      {
        text: "hand",
        audio: handAudio,
      },
    ],

    correctIndex: 0,

    fullAudio: [touchYourArmAudio],
    fullText: "Touch your arm.",
  },

  {
    img: img2,
    alt: "A person raising their hand.",

    text: "Raise your",
    textAudio: raiseYourAudio,

    options: [
      {
        text: "hand.",
        audio: handAudio,
      },
      {
        text: "leg.",
        audio: legAudio,
      },
    ],

    // ✅ الصحيح: Raise your hand.
    correctIndex: 0,

    fullAudio: [raiseYourHandAudio],
    fullText: "Raise your hand.",
  },

  {
    img: img3,
    alt: "A person bending their knee.",

    text: "Bend your",
    textAudio: bendYourAudio,

    options: [
      {
        text: "knee.",
        audio: kneeAudio,
      },
      {
        text: "eye.",
        audio: eyeAudio,
      },
    ],

    correctIndex: 0,

    fullAudio: [bendYourKneeAudio],
    fullText: "Bend your knee.",
  },

  {
    img: img4,
    alt: "A person opening their mouth.",

    text: "Open your",
    textAudio: openYourAudio,

    options: [
      {
        text: "nose.",
        audio: noseAudio,
      },
      {
        text: "mouth.",
        audio: mouthAudio,
      },
    ],

    correctIndex: 1,

    fullAudio: [openYourMouthAudio],
    fullText: "Open your mouth.",
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit8_Page5_Q3 = () => {
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

  /* =====================================================
     STOP ANY CURRENT AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      if (typeof audioRef.current.pause === "function") {
        audioRef.current.pause();

        try {
          audioRef.current.currentTime = 0;
        } catch {
          // sequence controller
        }
      }

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  /* =====================================================
     SINGLE AUDIO
  ===================================================== */

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
     FULL CORRECT QUESTION AUDIO
  ===================================================== */

  const playQuestionSequence = (questionIndex) => {
    const question = items[questionIndex];

    if (!question?.fullAudio?.length) return;

    stopAudio();

    const key = `full-question-${questionIndex}`;

    setPlayingKey(key);

    let cancelled = false;

    const controller = {
      currentAudio: null,

      pause() {
        cancelled = true;

        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }
      },

      set currentTime(value) {
        if (this.currentAudio) {
          this.currentAudio.currentTime = value;
        }
      },
    };

    audioRef.current = controller;

    const playNext = (index) => {
      if (cancelled || index >= question.fullAudio.length) {
        if (audioRef.current === controller) {
          audioRef.current = null;
          setPlayingKey(null);
        }

        return;
      }

      const audio = new Audio(question.fullAudio[index]);

      controller.currentAudio = audio;

      audio.onended = () => {
        playNext(index + 1);
      };

      audio.onerror = () => {
        playNext(index + 1);
      };

      audio.play().catch(() => {
        playNext(index + 1);
      });
    };

    playNext(0);
  };

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      if (audioRef.current && typeof audioRef.current.pause === "function") {
        audioRef.current.pause();
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
      Mouse / Keyboard:
      اختيار + صوت
    */

    playAudio(`option-${qIndex}-${optionIndex}`, option.audio);

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      تعديل نفس السؤال الغلط:
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
      بعد Show Answer أو بعد الكل صح:
      Check يظل طبيعي لكنه no-op
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
        السؤال الصح من Check سابق
        يظل correct وlocked
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
          gap: "90px",
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title="Read, look, and circle."
          subTitle="Read each command, then tap the body word that makes sense."
        />

        <div className="container-review6-unit8-p5-q3 w-full">
          {items.map((q, i) => {
            const locked = isQuestionLocked(i);

            const isQuestionWrong = results[i] === "wrong";

            const questionCorrect = results[i] === "correct" || showAnswerMode;

            const fullPlaying = playingKey === `full-question-${i}`;

            return (
              <div
                key={i}
                className={`
                  question-box-unit8-p5-q3

                  ${questionCorrect ? "completed-question-unit8-p5-q3" : ""}
                `}
                role={questionCorrect ? "button" : undefined}
                tabIndex={questionCorrect ? 0 : undefined}
                aria-label={
                  questionCorrect
                    ? `Play complete audio: ${q.fullText}`
                    : undefined
                }
                onClick={() => {
                  if (questionCorrect) {
                    playQuestionSequence(i);
                  }
                }}
                onKeyDown={(e) => {
                  if (!questionCorrect) return;

                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();

                    playQuestionSequence(i);
                  }
                }}
                style={{
                  position: "relative",
                }}
              >
                {/* =================================================
                    TITLE + NUMBER
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "center",
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

                  {/* =================================================
                      FIXED TEXT AUDIO
                  ================================================= */}

                  <div
                    role={questionCorrect ? undefined : "button"}
                    tabIndex={questionCorrect ? -1 : 0}
                    aria-label={
                      questionCorrect ? undefined : `Play audio: ${q.text}`
                    }
                    className="unit8-p5-q3-text-audio"
                    onClick={(e) => {
                      /*
                        بعد ما السؤال يصير صح:
                        الـwrapper الكامل هو المسؤول عن الصوت.
                      */

                      if (questionCorrect) return;

                      e.stopPropagation();

                      playAudio(`text-${i}`, q.textAudio);
                    }}
                    onKeyDown={(e) => {
                      if (questionCorrect) return;

                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();

                        playAudio(`text-${i}`, q.textAudio);
                      }
                    }}
                  >
                    <h6
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      {q.text}
                    </h6>

                    {playingKey === `text-${i}` && (
                      <FaVolumeUp
                        aria-hidden="true"
                        className="audio-icon-unit8-p5-q3"
                      />
                    )}
                  </div>
                </div>

                {/* =================================================
                    IMAGE + OPTIONS
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  {/* IMAGE */}

                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q3-image-unit8-p5-q3"
                  />

                  {/* OPTIONS */}

                  <div className="options-row-unit8-p5-q3">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[i] === optIndex;

                      const isWrongSelected = isQuestionWrong && isSelected;

                      const isPlaying =
                        playingKey === `option-${i}-${optIndex}`;

                      return (
                        <p
                          key={optIndex}
                          role={questionCorrect ? undefined : "button"}
                          tabIndex={questionCorrect || locked ? -1 : 0}
                          aria-disabled={locked}
                          aria-pressed={isSelected}
                          aria-label={
                            questionCorrect
                              ? undefined
                              : `${option.text}${
                                  isSelected ? ". Selected." : ""
                                }`
                          }
                          className={`
                              option-word-unit8-p5-q3

                              ${isSelected ? "selected3" : ""}

                              ${isWrongSelected ? "wrong" : ""}
                            `}
                          onClick={(e) => {
                            if (questionCorrect || locked) {
                              return;
                            }

                            e.stopPropagation();

                            handleSelect(i, optIndex);
                          }}
                          onKeyDown={(e) => {
                            if (questionCorrect || locked) {
                              return;
                            }

                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();

                              handleSelect(i, optIndex);
                            }
                          }}
                          style={{
                            position: "relative",
                          }}
                        >
                          {option.text}

                          {/* =================================================
                                SINGLE OPTION AUDIO ICON
                            ================================================= */}

                          {!questionCorrect && isPlaying && (
                            <FaVolumeUp
                              aria-hidden="true"
                              className="audio-icon-unit8-p5-q3"
                            />
                          )}

                          {/* =================================================
                                WRONG X
                            ================================================= */}

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

                {/* =================================================
                    FULL QUESTION AUDIO ICON

                    مرة واحدة فقط على الديف الكامل
                ================================================= */}

                {questionCorrect && fullPlaying && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="full-audio-icon-unit8-p5-q3"
                  />
                )}
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

export default Unit8_Page5_Q3;
