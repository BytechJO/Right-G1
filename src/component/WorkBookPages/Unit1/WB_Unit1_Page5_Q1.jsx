import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page5_Q1.css";

import img1 from "../../../assets/U1 WB/U1/SVG/U1P5EXEE-01.svg";
import img2 from "../../../assets/U1 WB/U1/SVG/U1P5EXEE-02.svg";
import img3 from "../../../assets/U1 WB/U1/SVG/U1P5EXEE-03.svg";
import img4 from "../../../assets/U1 WB/U1/SVG/U1P5EXEE-04.svg";

// ======================================================
// AUDIO
// عدل الاسم فقط إذا اسم الملف الفعلي مختلف حرفيًا
// ======================================================

import goodbyeAudio from "../../../assets/U1 WB/U1/page_5/Item_001_Goodbye!.mp3";
import helloAudio from "../../../assets/U1 WB/U1/page_5/Item_002_Hello!.mp3";
import goodAfternoonAudio from "../../../assets/U1 WB/U1/page_5/Item_003_Good_afternoon!.mp3";
import helloStellaAudio from "../../../assets/U1 WB/U1/page_5/Item_004_Hello!_I'm_Stella.mp3";
import goodMorningAudio from "../../../assets/U1 WB/U1/page_5/Item_005_Good_morning!.mp3";
import goodEveningAudio from "../../../assets/U1 WB/U1/page_5/Item_006_Good_evening!.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ======================================================
// AUDIO MAP
// ======================================================

const audioMap = {
  "Goodbye!": goodbyeAudio,
  "Hello!": helloAudio,
  "Good afternoon!": goodAfternoonAudio,
  "Hello! I’m Stella.": helloStellaAudio,
  "Hello! I'm Stella.": helloStellaAudio,
  "Good morning!": goodMorningAudio,
  "Good evening!": goodEveningAudio,
};

// ======================================================
// DATA
// ======================================================

const items = [
  {
    img: img1,

    alt: "A morning scene with people greeting each other.",

    options: ["Good morning!", "Good evening!"],

    correctIndex: 0,
  },

  {
    img: img2,

    alt: "A scene showing people saying goodbye.",

    options: ["Goodbye!", "Hello!"],

    correctIndex: 0,
  },

  {
    img: img3,

    alt: "People meeting outside during the afternoon.",

    options: ["Good afternoon!", "Good morning!"],

    correctIndex: 0,
  },

  {
    img: img4,

    alt: "A girl introducing herself to another person.",

    options: ["Hello! I’m Stella.", "Good evening!"],

    correctIndex: 0,
  },
];

// ======================================================
// COMPONENT
// ======================================================

const WB_Unit1_Page5_Q1 = () => {
  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  const [showResult, setShowResult] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  const [playingOption, setPlayingOption] = useState(null);

  const audioRef = useRef(null);

  // ====================================================
  // AUDIO
  // ====================================================

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingOption(null);
  };

  const playOptionAudio = (word, optionId) => {
    const src = audioMap[word];

    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    // ✅ نخزن الخيار نفسه مش اسم الكلمة
    setPlayingOption(optionId);

    audio.play().catch(() => {
      setPlayingOption(null);
    });

    audio.onended = () => {
      setPlayingOption(null);
      audioRef.current = null;
    };
  };

  // ====================================================
  // SELECT OPTION
  // ====================================================

  const handleSelect = (qIndex, optionIndex, word) => {
    if (showAnswer || showResult) {
      return;
    }

    const optionId = `${qIndex}-${optionIndex}`;

    // ✅ صوت نفس الخيار فقط
    playOptionAudio(word, optionId);

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });
  };

  // ====================================================
  // CHECK
  // ====================================================

  const checkAnswers = () => {
    if (showAnswer || showResult) {
      return;
    }

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");

      return;
    }

    const correctCount = answers.filter(
      (answer, index) => answer === items[index].correctIndex,
    ).length;

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

    if (correctCount === total) {
      ValidationAlert.success(msg);
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }

    setShowResult(true);
  };

  // ====================================================
  // SHOW ANSWER
  // ====================================================

  const showCorrectAnswers = () => {
    stopAudio();

    const correct = items.map((item) => item.correctIndex);

    setAnswers(correct);

    setShowAnswer(true);

    setShowResult(false);
  };

  // ====================================================
  // RESET
  // ====================================================

  const reset = () => {
    stopAudio();

    setAnswers(Array(items.length).fill(null));

    setShowAnswer(false);

    setShowResult(false);
  };

  // ====================================================
  // CLEANUP
  // ====================================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ====================================================
  // RENDER
  // ====================================================

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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title="Tap or click the correct greeting."
          subTitle="Look at the scene and tap the greeting people would say."
        />
        <div className="container-wb-u1-p5-q1">
          {items.map((question, qIndex) => (
            <div
              key={qIndex}
              className="question-box-wb-u1-p5-q1"
              style={{
                width: "100%",
              }}
            >
              {/* Question Number */}

              <span
                style={{
                  color: "#2c5287",

                  fontSize: "20px",

                  fontWeight: "700",
                }}
              >
                {qIndex + 1}
              </span>

              <div
                style={{
                  display: "flex",

                  gap: "10px",

                  flexDirection: "column",
                }}
              >
                {/* IMAGE */}

                <div className="img-div-unit7-p5-q1">
                  <img
                    src={question.img}
                    className="q3-image-wb-unit1-p5-q1"
                    alt={question.alt}
                  />
                </div>

                {/* OPTIONS */}

                <div className="options-row-unit7-p5-q1">
                  {question.options.map((word, optionIndex) => {
                    const optionId = `${qIndex}-${optionIndex}`;

                    const isSelected = answers[qIndex] === optionIndex;

                    const isCorrect = optionIndex === question.correctIndex;

                    const isWrong = showResult && isSelected && !isCorrect;

                    const isPlaying = playingOption === optionId;

                    return (
                      <button
                        key={optionId}
                        type="button"
                        className={`
          option-word-wb-u1-p5-q1
          ${isSelected && !showResult ? "selected3-wb-u1-p5-q1" : ""}
        `}
                        onClick={() => handleSelect(qIndex, optionIndex, word)}
                        disabled={showAnswer || showResult}
                        aria-pressed={isSelected}
                        aria-label={`${word}${
                          isSelected ? ". Selected." : ""
                        } Press Enter or Space to select and hear it.`}
                      >
                        <span>{word}</span>

                        {isPlaying && (
                          <span
                            aria-hidden="true"
                            className="playing-option-wb-u1-p5-q1"
                          >
                            🔊
                          </span>
                        )}

                        {isWrong && (
                          <span
                            className="wrong-x-wb-u1-p5-q1"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
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
          onClick={showCorrectAnswers}
          className="show-answer-btn swal-continue"
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

export default WB_Unit1_Page5_Q1;
