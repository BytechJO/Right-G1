import React, { useEffect, useRef, useState } from "react";

import { FaVolumeUp } from "react-icons/fa";

import "./Review8_Page2_Q4.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit8/imgs/U8P73EXEG-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P73EXEG-02.svg";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   AUDIO
===================================================== */

import full1Audio from "../../../assets/unit8/sound/Page 73 - G/full1.mp3";
import full2Audio from "../../../assets/unit8/sound/Page 73 - G/full2.mp3";

import isInTheAudio from "../../../assets/unit8/sound/Page 73 - G/is in the.mp3";
import isOverTheAudio from "../../../assets/unit8/sound/Page 73 - G/is over the.mp3";

import seaAudio from "../../../assets/unit8/sound/Page 73 - G/sea.mp3";
import sockAudio from "../../../assets/unit8/sound/Page 73 - G/Sock.mp3";
import sunAudio from "../../../assets/unit8/sound/Page 73 - G/sun.mp3";
import theAudio from "../../../assets/unit8/sound/Page 73 - G/The.mp3";
import zebraAudio from "../../../assets/unit8/sound/Page 73 - G/zebra.mp3";
import zooAudio from "../../../assets/unit8/sound/Page 73 - G/zoo.mp3";

/* =====================================================
   WORD AUDIO MAP
===================================================== */

const wordAudioMap = {
  sock: sockAudio,
  sun: sunAudio,
  sea: seaAudio,
  zoo: zooAudio,
  zebra: zebraAudio,
};

/* =====================================================
   QUESTIONS
===================================================== */

const questions = [
  {
    id: 1,

    image: img1,

    alt: "A sunny seaside scene with the sun above the sea.",

    fullAudio: full1Audio,

    parts: [
      {
        type: "text",
        value: "The",
        audio: theAudio,
      },

      {
        type: "blank",
        options: ["sock", "sun"],
      },

      {
        type: "text",
        value: "is over the",
        audio: isOverTheAudio,
      },

      {
        type: "blank",
        options: ["sea", "zoo"],
      },

      {
        type: "text",
        value: ".",
      },
    ],

    correct: ["sun", "sea"],
  },

  {
    id: 2,

    image: img2,

    alt: "A zoo scene with a zebra inside an animal enclosure.",

    fullAudio: full2Audio,

    parts: [
      {
        type: "text",
        value: "The",
        audio: theAudio,
      },

      {
        type: "blank",
        options: ["sun", "zebra"],
      },

      {
        type: "text",
        value: "is in the",
        audio: isInTheAudio,
      },

      {
        type: "blank",
        options: ["sea", "zoo"],
      },

      {
        type: "text",
        value: ".",
      },
    ],

    correct: ["zebra", "zoo"],
  },
];

/* =====================================================
   MAIN
===================================================== */

const Review8_Page2_Q4 = () => {
  /* =====================================================
     ANSWERS

     [
       [null, null],
       [null, null]
     ]
  ===================================================== */

  const [answers, setAnswers] = useState(
    questions.map((q) => q.correct.map(() => null)),
  );

  /*
    null | correct | wrong
  */

  const [results, setResults] = useState(
    questions.map((q) => q.correct.map(() => null)),
  );

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const [playingQuestion, setPlayingQuestion] = useState(null);

  /* =====================================================
     AUDIO FUNCTIONS
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);

    setPlayingQuestion(null);
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

  const playFullQuestionAudio = (qIndex) => {
    if (!isQuestionComplete(qIndex)) {
      return;
    }

    const src = questions[qIndex].fullAudio;

    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingQuestion(qIndex);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
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

  const isBlankLocked = (qIndex, blankIndex) =>
    showAnswerMode || results[qIndex][blankIndex] === "correct";

  const isQuestionComplete = (qIndex) =>
    questions[qIndex].correct.every(
      (_, blankIndex) => results[qIndex][blankIndex] === "correct",
    ) || showAnswerMode;

  const allCorrect = questions.every((_, qIndex) => isQuestionComplete(qIndex));

  /* =====================================================
     OPTION SELECT
  ===================================================== */

  const handleSelect = (qIndex, blankIndex, option) => {
    if (isBlankLocked(qIndex, blankIndex)) {
      return;
    }

    /* play option audio */

    playAudio(`option-${qIndex}-${blankIndex}-${option}`, wordAudioMap[option]);

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = option;

      return updated;
    });

    /*
      editing wrong answer:
      remove wrong state only here
    */

    setResults((prev) => {
      const updated = prev.map((row) => [...row]);

      if (updated[qIndex][blankIndex] === "wrong") {
        updated[qIndex][blankIndex] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     FIXED TEXT AUDIO
  ===================================================== */

  const handleFixedTextAudio = (qIndex, pIndex, part) => {
    if (!part.audio) return;

    playAudio(`text-${qIndex}-${pIndex}`, part.audio);
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    const hasEmpty = questions.some((q, qIndex) =>
      q.correct.some(
        (_, blankIndex) =>
          results[qIndex][blankIndex] !== "correct" &&
          !answers[qIndex][blankIndex],
      ),
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all the blanks before checking.",
      );

      return;
    }

    const nextResults = results.map((row) => [...row]);

    let correctCount = 0;

    let total = 0;

    questions.forEach((q, qIndex) => {
      q.correct.forEach((correctAnswer, blankIndex) => {
        total++;

        /*
              already correct
            */

        if (results[qIndex][blankIndex] === "correct") {
          nextResults[qIndex][blankIndex] = "correct";

          correctCount++;

          return;
        }

        if (answers[qIndex][blankIndex] === correctAnswer) {
          nextResults[qIndex][blankIndex] = "correct";

          correctCount++;
        } else {
          nextResults[qIndex][blankIndex] = "wrong";
        }
      });
    });

    setResults(nextResults);

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
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    setAnswers(questions.map((q) => [...q.correct]));

    setResults(questions.map((q) => q.correct.map(() => "correct")));

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(questions.map((q) => q.correct.map(() => null)));

    setResults(questions.map((q) => q.correct.map(() => null)));

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
          sectionLetter="G"
          title="Read, look, and circle."
          subTitle="Use the pictures to complete the sentences about the sun, sea, zebra, and zoo."
        />

        <div
          className="all-content-review8-p2-q4"
          style={{
            display: "flex",

            width: "100%",
          }}
        >
          {questions.map((q, qIndex) => {
            const questionComplete = isQuestionComplete(qIndex);

            return (
              <div
                key={q.id}
                className={`
                    question-row-review8-p2-q4
                    w-full

                    ${
                      questionComplete ? "completed-question-review8-p2-q4" : ""
                    }
                  `}
                role={questionComplete ? "button" : undefined}
                tabIndex={questionComplete ? 0 : undefined}
                aria-label={
                  questionComplete
                    ? `Question ${q.id} is correct. Press Enter or Space to hear the full sentence.`
                    : undefined
                }
                onClick={() => {
                  if (questionComplete) {
                    playFullQuestionAudio(qIndex);
                  }
                }}
                onKeyDown={(e) => {
                  if (!questionComplete) {
                    return;
                  }

                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();

                    e.stopPropagation();

                    playFullQuestionAudio(qIndex);
                  }
                }}
                style={{
                  position: "relative",
                }}
              >
                <div className="sentence-review8-p2-q4">
                  {/* =================================================
                        IMAGE
                    ================================================= */}

                  <div
                    style={{
                      display: "flex",

                      width: "100%",

                      justifyContent: "center",

                      alignItems: "flex-start",

                      gap: "30px",
                    }}
                  >
                    <span
                      style={{
                        color: "#2c5287",

                        fontWeight: "700",

                        fontSize: "20px",
                      }}
                    >
                      {q.id}
                    </span>

                    <img
                      src={q.image}
                      alt={q.alt}
                      className="question-img-review8-p2-q4"
                    />
                  </div>

                  {/* =================================================
                        SENTENCE
                    ================================================= */}

                  <div
                    style={{
                      display: "flex",

                      width: "100%",

                      justifyContent: "space-around",

                      alignItems: "center",
                    }}
                  >
                    {q.parts.map((part, pIndex) => {
                      /* ============================================
                             FIXED TEXT
                          ============================================ */

                      if (part.type === "text") {
                        const hasAudio = Boolean(part.audio);

                        const playing =
                          playingKey === `text-${qIndex}-${pIndex}`;

                        return (
                          <span
                            key={pIndex}
                            role={
                              hasAudio && !questionComplete
                                ? "button"
                                : undefined
                            }
                            tabIndex={hasAudio && !questionComplete ? 0 : -1}
                            aria-label={
                              hasAudio && !questionComplete
                                ? `${part.value}. Press Enter or Space to hear.`
                                : undefined
                            }
                            className={`
                                  sentence-text-review5-p2-q3

                                  ${
                                    hasAudio && !questionComplete
                                      ? "fixed-text-audio-review8-p2-q4"
                                      : ""
                                  }
                                `}
                            onClick={(e) => {
                              if (questionComplete || !hasAudio) {
                                return;
                              }

                              e.stopPropagation();

                              handleFixedTextAudio(qIndex, pIndex, part);
                            }}
                            onKeyDown={(e) => {
                              if (questionComplete || !hasAudio) {
                                return;
                              }

                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                e.stopPropagation();

                                handleFixedTextAudio(qIndex, pIndex, part);
                              }
                            }}
                            style={{
                              position: "relative",
                            }}
                          >
                            {part.value}

                            {playing && (
                              <FaVolumeUp
                                aria-hidden="true"
                                className="audio-icon-review8-p2-q4"
                              />
                            )}
                          </span>
                        );
                      }

                      /* ============================================
                             BLANK
                          ============================================ */

                      const blankParts = q.parts.filter(
                        (p) => p.type === "blank",
                      );

                      const actualBlankIndex = blankParts.indexOf(part);

                      const blankLocked = isBlankLocked(
                        qIndex,
                        actualBlankIndex,
                      );

                      return (
                        <span
                          key={pIndex}
                          className="blank-options-review5-p2-q3"
                        >
                          {part.options.map((opt, optIndex) => {
                            const isSelected =
                              answers[qIndex][actualBlankIndex] === opt;

                            const isWrongSelected =
                              results[qIndex][actualBlankIndex] === "wrong" &&
                              isSelected;

                            const optionPlaying =
                              playingKey ===
                              `option-${qIndex}-${actualBlankIndex}-${opt}`;

                            return (
                              <div key={optIndex} className="option-wrapper">
                                <span
                                  role="button"
                                  tabIndex={blankLocked ? -1 : 0}
                                  aria-disabled={blankLocked}
                                  aria-pressed={isSelected}
                                  aria-label={`${opt}${
                                    isSelected ? ". Selected." : ""
                                  }`}
                                  className={`
                                          option-word-review5-p2-q3

                                          ${isSelected ? "selected2" : ""}

                                          ${isWrongSelected ? "wrong" : ""}
                                        `}
                                  onClick={(e) => {
                                    if (blankLocked) {
                                      return;
                                    }

                                    e.stopPropagation();

                                    handleSelect(qIndex, actualBlankIndex, opt);
                                  }}
                                  onKeyDown={(e) => {
                                    if (blankLocked) {
                                      return;
                                    }

                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();

                                      e.stopPropagation();

                                      handleSelect(
                                        qIndex,
                                        actualBlankIndex,
                                        opt,
                                      );
                                    }
                                  }}
                                  style={{
                                    position: "relative",
                                  }}
                                >
                                  {opt}

                                  {optionPlaying && (
                                    <FaVolumeUp
                                      aria-hidden="true"
                                      className="audio-icon-review8-p2-q4"
                                    />
                                  )}
                                </span>

                                {isWrongSelected && (
                                  <div
                                    className="wrong-mark"
                                    aria-hidden="true"
                                  >
                                    ✕
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* =================================================
                      FULL SENTENCE AUDIO ICON
                  ================================================= */}

                {questionComplete && playingQuestion === qIndex && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="full-audio-icon-review8-p2-q4"
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

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review8_Page2_Q4;
