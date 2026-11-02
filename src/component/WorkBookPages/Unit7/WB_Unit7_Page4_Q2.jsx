import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U7/U7P42EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P42EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P42EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P42EXEH-04.svg";
import "./WB_Unit7_Page4_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

// import "./WB_Unit7_Page4_Q2.css";

/* =====================================================
   AUDIO
===================================================== */

import listenAudio from "../../../assets/U1 WB/U7/audio/page 42- H/Item_002_listen.mp3";
import hungryAudio from "../../../assets/U1 WB/U7/audio/page 42- H/Item_003_hungry.mp3";
import shiverAudio from "../../../assets/U1 WB/U7/audio/page 42- H/Item_004_shiver.mp3";
import crawlAudio from "../../../assets/U1 WB/U7/audio/page 42- H/Item_005_crawl.mp3";
import boredAudio from "../../../assets/U1 WB/U7/audio/page 42- H/Item_006_bored.mp3";
import coldAudio from "../../../assets/U1 WB/U7/audio/page 42- H/Item_007_cold.mp3";
import brokenAudio from "../../../assets/U1 WB/U7/audio/page 42- H/Item_008_broken.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: img1,

    alt: "A girl wearing headphones and listening to music.",

    options: [
      {
        text: "listen",
        audio: listenAudio,
      },
      {
        text: "hungry",
        audio: hungryAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img2,

    alt: "A boy shivering and holding his arms because he feels cold.",

    options: [
      {
        text: "broken",
        audio: brokenAudio,
      },
      {
        text: "shiver",
        audio: shiverAudio,
      },
    ],

    correctIndex: 1,
  },

  {
    img: img3,

    alt: "A child crawling forward on hands and knees.",

    options: [
      {
        text: "crawl",
        audio: crawlAudio,
      },
      {
        text: "cold",
        audio: coldAudio,
      },
    ],

    correctIndex: 0,
  },

  {
    img: img4,

    alt: "A broken toy lying on the ground with separated pieces.",

    options: [
      {
        text: "bored",
        audio: boredAudio,
      },
      {
        text: "broken",
        audio: brokenAudio,
      },
    ],

    correctIndex: 1,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit7_Page4_Q2 = () => {
  /* =====================================================
     ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  /*
    null
    "correct"
    "wrong"
  */

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
    showAnswerMode || results[index] === "correct";

  const allCorrect = items.every((_, index) => results[index] === "correct");

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    /*
      الصحيح المقفول ما بيتعدل.
    */

    if (showAnswerMode || results[qIndex] === "correct") {
      return;
    }

    const option = items[qIndex].options[optionIndex];

    /*
      Mouse / Keyboard:
      شغل صوت الخيار.
    */

    playAudio(`option-${qIndex}-${optionIndex}`, option.audio);

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      إذا كان السؤال غلط:
      تعديل نفس السؤال يشيل X عنه فقط.
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
      Show Answer أو كل النشاط صار صح:
      Check يظل ظاهر بس no-op.
    */

    if (showAnswerMode || allCorrect) {
      return;
    }

    /*
      نفحص فقط الأسئلة اللي لسا مش locked.
    */

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
          سؤال صح من Check سابق:
          يظل صح.
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
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
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
          gap: "70px",
        }}
      >
        <ExerciseHeader
          sectionLetter="H"
          title="Look, read, and circle."
          subTitle="Name the action or condition, then tap the matching word."
        />

        <div className="container-wb-unit6-p6-q2 w-full">
          {items.map((q, i) => {
            const locked = isQuestionLocked(i);

            const isQuestionWrong = results[i] === "wrong";

            return (
              <div
                key={i}
                className="question-box-wb-unit6-p6-q2"
                style={{
                  width: "100%",
                }}
              >
                {/* =========================================
                      IMAGE
                  ========================================== */}

                <div
                  style={{
                    display: "flex",

                    gap: "50px",

                    flexDirection: "row",

                    alignItems: "flex-start",
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

                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q3-image-review6-p1-q1"
                    style={{
                      height: "120px",

                      width: "auto",
                    }}
                  />
                </div>

                {/* =========================================
                      OPTIONS
                  ========================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <div className="options-row-wb-unit5-p6-q3">
                    {q.options.map((option, optIndex) => {
                      const isSelected = answers[i] === optIndex;

                      const isWrongSelected = isQuestionWrong && isSelected;

                      const isPlaying =
                        playingKey === `option-${i}-${optIndex}`;

                      return (
                        <p
                          key={optIndex}
                          role="button"
                          tabIndex={locked ? -1 : 0}
                          aria-disabled={locked}
                          aria-pressed={isSelected}
                          aria-label={`${option.text}${
                            isSelected ? ". Selected." : ""
                          }`}
                          className={`
                                option-word-review6-p1-q1

                                ${isSelected ? "selected3" : ""}

                                ${isWrongSelected ? "wrong" : ""}
                              `}
                          onClick={() => {
                            if (locked) {
                              return;
                            }

                            handleSelect(i, optIndex);
                          }}
                          onKeyDown={(e) => {
                            if (locked) {
                              return;
                            }

                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();

                              handleSelect(i, optIndex);
                            }
                          }}
                          style={{
                            display: "flex",

                            justifyContent: "center",

                            alignItems: "center",

                            position: "relative",
                          }}
                        >
                          {/* OPTION TEXT */}

                          {option.text}

                          {/* =================================
                                  AUDIO ICON
                                  فوق يمين
                              ================================== */}

                          {isPlaying && (
                            <FaVolumeUp
                              aria-hidden="true"
                              className="audio-icon-wb-unit7-p4-q2"
                            />
                          )}

                          {/* =================================
                                  WRONG X
                              ================================== */}

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

export default WB_Unit7_Page4_Q2;
