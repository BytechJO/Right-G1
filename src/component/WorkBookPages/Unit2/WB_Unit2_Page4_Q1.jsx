import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U2/U2P12EXEG-01.svg";
import img2 from "../../../assets/U1 WB/U2/U2P12EXEG-02.svg";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// ======================================================
// AUDIOS
// ======================================================

import cakeQuestionAudio from "../../../assets/U1 WB/U2/page_12/Item_001_Is_it_a_cake.mp3";

import presentQuestionAudio from "../../../assets/U1 WB/U2/page_12/Item_002_Is_it_a_present.mp3";

import yesAudio from "../../../assets/U1 WB/U2/page_12/Item_003_Yes,_it_is.mp3";

import noAudio from "../../../assets/U1 WB/U2/page_12/Item_004_No,_it_isn't.mp3";

// ======================================================
// MAIN
// ======================================================

const WB_Unit2_Page4_Q1 = () => {
  const [answers, setAnswers] = useState(Array(2).fill(null));

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  // ======================================================
  // AUDIO
  // ======================================================

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
      audio.currentTime = 0;

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

  // ======================================================
  // DATA
  // ======================================================

  const items = [
    {
      img: img1,
      alt: "A blue cone-shaped party hat with red decorations.",
      text: "Is it a cake?",
      questionAudio: cakeQuestionAudio,

      options: [
        {
          text: "Yes, it is.",
          audio: yesAudio,
        },
        {
          text: "No, it isn’t.",
          audio: noAudio,
        },
      ],

      correctIndex: 1,
    },

    {
      img: img2,
      alt: "A colorful box with a green bow on top.",
      text: "Is it a present?",
      questionAudio: presentQuestionAudio,

      options: [
        {
          text: "Yes, it is.",
          audio: yesAudio,
        },
        {
          text: "No, it isn’t.",
          audio: noAudio,
        },
      ],

      correctIndex: 0,
    },
  ];

  // ======================================================
  // HELPERS
  // ======================================================

  const isQuestionLocked = (index) => lockedQuestions.includes(index);

  // ======================================================
  // SELECT
  // ======================================================

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    const newAns = [...answers];

    newAns[qIndex] = optionIndex;

    setAnswers(newAns);

    /*
      شيل X فقط عن نفس السؤال
    */

    setWrongQuestions((prev) => prev.filter((index) => index !== qIndex));
  };

  // ======================================================
  // CHECK
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");

      return;
    }

    let correctCount = 0;

    const correctTemp = [];

    const wrongTemp = [];

    answers.forEach((answer, index) => {
      if (answer === items[index].correctIndex) {
        correctCount++;

        correctTemp.push(index);
      } else {
        wrongTemp.push(index);
      }
    });

    // ====================================================
    // LOCK CORRECT ONLY
    // ====================================================

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...correctTemp])),
    );

    // ====================================================
    // WRONG ONLY
    // ====================================================

    setWrongQuestions(wrongTemp);

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

    // ====================================================
    // ALL CORRECT
    // ====================================================

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

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const showAnswers = () => {
    stopAudio();

    const filled = items.map((item) => item.correctIndex);

    setAnswers(filled);

    setWrongQuestions([]);

    setLockedQuestions(items.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    stopAudio();

    setAnswers(Array(items.length).fill(null));

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

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
          sectionLetter="G"
          title="Read, look, and circle."
          subTitle="Look at the picture and choose Yes, it is or No, it isn’t."
        />

        <div className="container-review6-p1-q1">
          {items.map((q, i) => {
            const questionLocked = isQuestionLocked(i);

            const questionPlaying = playingId === `question-${i}`;

            return (
              <div
                key={i}
                className="question-box-wb-unit2-p4-q1"
                style={{
                  width: "100%",
                }}
              >
                {/* =================================================
                      QUESTION TEXT
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

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Play ${q.text}`}
                    onClick={() => playAudio(`question-${i}`, q.questionAudio)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        playAudio(`question-${i}`, q.questionAudio);
                      }
                    }}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                      border: "2px solid transparent",
                      borderRadius: "8px",
                      padding: "3px 6px",
                      transition: "border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2c5287";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "transparent";
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

                    {questionPlaying && (
                      <FaVolumeUp
                        size={16}
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          background: "white",
                          borderRadius: "50%",
                          padding: "2px",
                          pointerEvents: "none",
                          zIndex: 10,
                        }}
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
                  }}
                >
                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q3-image-review6-p1-q1"
                    style={{
                      height: "150px",
                      width: "auto",
                    }}
                  />

                  <div className="options-row-review6-p1-q1">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[i] === optIndex;
                      const isDisabled =
                        questionLocked || showAnswer || checkCompleted;
                      const isCorrect = optIndex === q.correctIndex;

                      const isWrong =
                        wrongQuestions.includes(i) && isSelected && !isCorrect;

                      const optionPlaying =
                        playingId === `option-${i}-${optIndex}`;

                      /*
                            Show Answer:
                            correct class على الصح فقط.

                            Check:
                            ما بنحط correct على كل الصح
                            إلا إذا بدك CSS موجود أصلًا.
                          */

                      const showCorrect = showAnswer && isCorrect;

                      return (
                        <div
                          key={optIndex}
                          style={{
                            position: "relative",

                            display: "inline-block",
                          }}
                        >
                          <p
                            role="button"
                            tabIndex={isDisabled ? -1 : 0}
                            aria-disabled={isDisabled}
                            aria-pressed={isSelected}
                            aria-label={`${option.text}${
                              isSelected ? ", selected" : ""
                            }`}
                            className={`
    option-word-wb-unit2-p4-q1
    ${isSelected ? "selected3" : ""}
    ${isWrong ? "wrong" : ""}
    ${showCorrect ? "correct" : ""}
  `}
                            onClick={() => {
                              /*
      الصوت يشتغل دائمًا
    */

                              playAudio(
                                `option-${i}-${optIndex}`,
                                option.audio,
                              );

                              /*
      الاختيار يتوقف فقط عند القفل
    */

                              if (isDisabled) {
                                return;
                              }

                              handleSelect(i, optIndex);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                /*
        الصوت يشتغل
      */

                                playAudio(
                                  `option-${i}-${optIndex}`,
                                  option.audio,
                                );

                                /*
        لو السؤال مقفول،
        ما نغيّر الاختيار
      */

                                if (isDisabled) {
                                  return;
                                }

                                handleSelect(i, optIndex);
                              }
                            }}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "relative",

                              cursor: isDisabled ? "default" : "pointer",
                            }}
                          >
                            {option.text}

                            {isWrong && (
                              <span className="wrong-x-review4-p2-q3">✕</span>
                            )}
                          </p>

                          {/* =========================================
                                  AUDIO ICON
                                  فوق الزاوية بدون ما تاخذ حيز
                              ========================================= */}

                          {optionPlaying && (
                            <FaVolumeUp
                              size={16}
                              aria-hidden="true"
                              style={{
                                position: "absolute",

                                top: "-8px",

                                right: "-8px",

                                background: "white",

                                borderRadius: "50%",

                                padding: "2px",

                                pointerEvents: "none",

                                zIndex: 10,
                              }}
                            />
                          )}
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

export default WB_Unit2_Page4_Q1;
