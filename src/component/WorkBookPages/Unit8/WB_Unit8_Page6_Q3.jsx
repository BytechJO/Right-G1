import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import bat from "../../../assets/U1 WB/U8/U8P50EXEC-01.svg";
import cap from "../../../assets/U1 WB/U8/U8P50EXEC-02.svg";
import cap1 from "../../../assets/U1 WB/U8/U8P50EXEC-03.svg";
import cap2 from "../../../assets/U1 WB/U8/U8P50EXEC-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import "./WB_Unit8_Page6_Q3.css";

/* =====================================================
   AUDIO
===================================================== */

import zooAudio from "../../../assets/U1 WB/U8/audio/page 50 - C/Item_001_ZOO.mp3";
import sunAudio from "../../../assets/U1 WB/U8/audio/page 50 - C/Item_002_sun.mp3";
import zebraAudio from "../../../assets/U1 WB/U8/audio/page 50 - C/Item_003_zebra.mp3";
import seaAudio from "../../../assets/U1 WB/U8/audio/page 50 - C/Item_004_sea.mp3";
import sockAudio from "../../../assets/U1 WB/U8/audio/page 50 - C/Item_005_sock.mp3";
import zipperAudio from "../../../assets/U1 WB/U8/audio/page 50 - C/Item_006_zipper.mp3";

/* =====================================================
   AUDIO MAP
===================================================== */

const audioMap = {
  zoo: zooAudio,
  sun: sunAudio,
  zebra: zebraAudio,
  sea: seaAudio,
  sock: sockAudio,
  zipper: zipperAudio,
};

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: bat,

    alt: "A zebra.",

    correct: "zebra",

    options: ["zoo", "zebra"],
  },

  {
    img: cap,

    alt: "The sun.",

    correct: "sun",

    options: ["sun", "sea"],
  },

  {
    img: cap1,

    alt: "A sock.",

    correct: "sock",

    options: ["sock", "sun"],
  },

  {
    img: cap2,

    alt: "A zipper.",

    correct: "zipper",

    options: ["zebra", "zipper"],
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit8_Page6_Q3 = () => {
  const [selected, setSelected] = useState(Array(items.length).fill(""));

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
     HELPERS
  ===================================================== */

  const isQuestionCorrect = (index) => results[index] === "correct";

  const isQuestionLocked = (index) =>
    showAnswerMode || isQuestionCorrect(index);

  const allCorrect = results.every((result) => result === "correct");

  /* =====================================================
     AUDIO
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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (value, index) => {
    if (isQuestionLocked(index)) {
      return;
    }

    /*
      Select
    */

    setSelected((prev) => {
      const copy = [...prev];

      copy[index] = value;

      return copy;
    });

    /*
      إذا كان Wrong قبل:
      شيل حالة الخطأ لهذا السؤال فقط
    */

    setResults((prev) => {
      const copy = [...prev];

      if (copy[index] === "wrong") {
        copy[index] = null;
      }

      return copy;
    });

    /*
      الصوت على الكلمة المختارة
    */

    playAudio(`option-${index}-${value}`, audioMap[value]);
  };

  /* =====================================================
     KEYBOARD SELECT
  ===================================================== */

  const handleOptionKeyDown = (e, value, index) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    handleSelect(value, index);
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    /* =================================================
       REQUIRE ANSWERS
    ================================================= */

    for (let index = 0; index < items.length; index++) {
      if (isQuestionCorrect(index)) {
        continue;
      }

      if (!selected[index]) {
        ValidationAlert.info(
          `Please choose an answer for question ${index + 1}.`,
        );

        return;
      }
    }

    /* =================================================
       VALIDATE
    ================================================= */

    const nextResults = [...results];

    let score = 0;

    items.forEach((item, index) => {
      /*
          keep already correct
        */

      if (isQuestionCorrect(index)) {
        nextResults[index] = "correct";

        score++;

        return;
      }

      if (selected[index] === item.correct) {
        nextResults[index] = "correct";

        score++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    /*
      NO AUTO AUDIO
    */

    const total = items.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
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

    setSelected(items.map((item) => item.correct));

    setResults(Array(items.length).fill("correct"));

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAll = () => {
    stopAudio();

    setSelected(Array(items.length).fill(""));

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
      <div className="div-forall mb-10">
        <ExerciseHeader
          sectionLetter="C"
          title="Look, circle, and write."
          subTitle="Name each picture, then tap the word that matches it."
        />

        <div className="question-grid-wb-unit8-p6-q3">
          {items.map((item, index) => {
            const locked = isQuestionLocked(index);

            const wrong = results[index] === "wrong";

            return (
              <div className="question-box-wb-unit8-p6-q3" key={index}>
                <div
                  style={{
                    display: "flex",

                    gap: "20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "22px",

                      fontWeight: "600",

                      color: "#1d4f7b",
                    }}
                  >
                    {index + 1}
                  </span>

                  <div className="img-option-wb-unit8-p6-q3">
                    {/* =================================================
                          IMAGE
                      ================================================= */}

                    <img
                      src={item.img}
                      className="q-img-wb-unit8-p6-q3"
                      alt={item.alt}
                    />

                    {/* =================================================
                          OPTIONS
                      ================================================= */}

                    <div className="choices-wb-unit8-p6-q3">
                      {item.options.map((choice, optionIndex) => {
                        const isSelected = selected[index] === choice;

                        const showWrong =
                          wrong && isSelected && choice !== item.correct;

                        const audioKey = `option-${index}-${choice}`;

                        return (
                          <div className="circle-wrapper" key={optionIndex}>
                            <div
                              role="button"
                              tabIndex={locked ? -1 : 0}
                              aria-pressed={isSelected}
                              aria-label={`${choice}. ${
                                isSelected ? "Selected." : "Not selected."
                              } ${
                                locked
                                  ? "Question is correct and locked."
                                  : "Press Enter or Space to select and hear the word."
                              }`}
                              className={`
      circle-choice-unit6-page6-q2
      ${isSelected ? "active" : ""}
      ${showWrong ? "wrong-choice-wb-u8-p6-q3" : ""}
    `}
                              onClick={() => handleSelect(choice, index)}
                              onKeyDown={(e) =>
                                handleOptionKeyDown(e, choice, index)
                              }
                            >
                              {choice}
                            </div>

                            {playingKey === audioKey && (
                              <FaVolumeUp
                                className="audio-icon-wb-u8-p6-q3"
                                aria-hidden="true"
                              />
                            )}

                            {showWrong && (
                              <div className="wrong-mark" aria-hidden="true">
                                ✕
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* =================================================
                      READ ONLY WRITING INPUT
                  ================================================= */}

                <div className="input-wrapper-unit6-p6-q2">
                  <input
                    type="text"
                    className="write-input-wb-unit8-p6-q3"
                    value={selected[index]}
                    readOnly
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div className="action-buttons-container">
        <button onClick={resetAll} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit8_Page6_Q3;
