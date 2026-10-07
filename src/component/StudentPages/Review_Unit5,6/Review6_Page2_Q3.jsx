import React, { useRef, useState } from "react";

import "./Review6_Page2_Q3.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import pitAudio from "../../../assets/unit6/sounds/Page 55 - F/pit.mp3";
import chipAudio from "../../../assets/unit6/sounds/Page 55 - F/chip.mp3";
import topAudio from "../../../assets/unit6/sounds/Page 55 - F/top.mp3";

import bitAudio from "../../../assets/unit6/sounds/Page 55 - F/bit.mp3";
import sunAudio from "../../../assets/unit6/sounds/Page 55 - F/sun.mp3";
import fixAudio from "../../../assets/unit6/sounds/Page 55 - F/fix.mp3";

import cupAudio from "../../../assets/unit6/sounds/Page 55 - F/cup.mp3";
import pickAudio from "../../../assets/unit6/sounds/Page 55 - F/pick.mp3";
import fitAudio from "../../../assets/unit6/sounds/Page 55 - F/fit.mp3";

import boxAudio from "../../../assets/unit6/sounds/Page 55 - F/box.mp3";
import mixAudio from "../../../assets/unit6/sounds/Page 55 - F/mix.mp3";
import tipAudio from "../../../assets/unit6/sounds/Page 55 - F/tip.mp3";

import kickAudio from "../../../assets/unit6/sounds/Page 55 - F/kick.mp3";
import deskAudio from "../../../assets/unit6/sounds/Page 55 - F/desk.mp3";
import ripAudio from "../../../assets/unit6/sounds/Page 55 - F/rip.mp3";

import sipAudio from "../../../assets/unit6/sounds/Page 55 - F/sip.mp3";
import capAudio from "../../../assets/unit6/sounds/Page 55 - F/cap.mp3";
import pinAudio from "../../../assets/unit6/sounds/Page 55 - F/pin.mp3";

/* =====================================================
   DATA
===================================================== */

const sentences = [
  {
    num: 1,
    words: [
      {
        word: "pit",
        audio: pitAudio,
      },
      {
        word: "chip",
        audio: chipAudio,
      },
      {
        word: "top",
        audio: topAudio,
      },
    ],
  },

  {
    num: 2,
    words: [
      {
        word: "bit",
        audio: bitAudio,
      },
      {
        word: "sun",
        audio: sunAudio,
      },
      {
        word: "fix",
        audio: fixAudio,
      },
    ],
  },

  {
    num: 3,
    words: [
      {
        word: "cup",
        audio: cupAudio,
      },
      {
        word: "pick",
        audio: pickAudio,
      },
      {
        word: "fit",
        audio: fitAudio,
      },
    ],
  },

  {
    num: 4,
    words: [
      {
        word: "box",
        audio: boxAudio,
      },
      {
        word: "mix",
        audio: mixAudio,
      },
      {
        word: "tip",
        audio: tipAudio,
      },
    ],
  },

  {
    num: 5,
    words: [
      {
        word: "kick",
        audio: kickAudio,
      },
      {
        word: "desk",
        audio: deskAudio,
      },
      {
        word: "rip",
        audio: ripAudio,
      },
    ],
  },

  {
    num: 6,
    words: [
      {
        word: "sip",
        audio: sipAudio,
      },
      {
        word: "cap",
        audio: capAudio,
      },
      {
        word: "pin",
        audio: pinAudio,
      },
    ],
  },
];

/* =====================================================
   CORRECT ANSWERS
===================================================== */

const correct = {
  0: [0, 1],
  1: [0, 2],
  2: [1, 2],
  3: [1, 2],
  4: [0, 2],
  5: [0, 2],
};

/* =====================================================
   MAIN
===================================================== */

const Review6_Page2_Q3 = () => {
  /* =====================================================
     SELECTED WORDS
  ===================================================== */

  const [circledWords, setCircledWords] = useState({});

  /* =====================================================
     WRONG WORDS
  ===================================================== */

  const [wrongWords, setWrongWords] = useState({});

  /* =====================================================
     LOCKED CORRECT WORDS
  ===================================================== */

  const [lockedWords, setLockedWords] = useState({});

  /* =====================================================
     FINAL STATES
  ===================================================== */

  const [showAnswerMode, setShowAnswerMode] = useState(false);

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
    if (!src) {
      return;
    }

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

  const isWordLocked = (sIndex, wIndex) =>
    lockedWords[sIndex]?.includes(wIndex);

  const isWordWrong = (sIndex, wIndex) => wrongWords[sIndex]?.includes(wIndex);

  /* =====================================================
     SELECT / UNSELECT
  ===================================================== */

  const handleWordClick = (sIndex, wIndex) => {
    if (showAnswerMode || checkCompleted || isWordLocked(sIndex, wIndex)) {
      return;
    }

    setCircledWords((prev) => {
      const existing = prev[sIndex] || [];

      /* ===============================================
         UNSELECT
      =============================================== */

      if (existing.includes(wIndex)) {
        return {
          ...prev,

          [sIndex]: existing.filter((index) => index !== wIndex),
        };
      }

      /* ===============================================
         MAXIMUM TWO WORDS
      =============================================== */

      if (existing.length >= 2) {
        return prev;
      }

      /* ===============================================
         SELECT
      =============================================== */

      return {
        ...prev,

        [sIndex]: [...existing, wIndex],
      };
    });

    /* =================================================
       CLEAR X ONLY FROM SAME WORD
    ================================================= */

    setWrongWords((prev) => ({
      ...prev,

      [sIndex]: (prev[sIndex] || []).filter((index) => index !== wIndex),
    }));
  };

  /* =====================================================
     AUDIO + SELECT
  ===================================================== */

  const activateWord = (sIndex, wIndex, word, audio) => {
    playAudio(`word-${sIndex}-${wIndex}`, audio);

    /*
      حتى لو الكلمة locked:
      الصوت يضل شغال.

      الاختيار فقط إذا editable.
    */

    if (!showAnswerMode && !checkCompleted && !isWordLocked(sIndex, wIndex)) {
      handleWordClick(sIndex, wIndex);
    }
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    /* =================================================
       EACH ROW MUST HAVE TWO SELECTED WORDS
    ================================================= */

    const allAnswered = sentences.every(
      (_, sIndex) => (circledWords[sIndex] || []).length === 2,
    );

    if (!allAnswered) {
      ValidationAlert.info(
        "Oops!",
        "Please circle two words in each sentence!",
      );

      return;
    }

    let studentCorrect = 0;

    let totalCorrect = 0;

    const newWrongWords = {};

    const newLockedWords = {};

    /* =================================================
       CHECK EACH ROW
    ================================================= */

    Object.keys(correct).forEach((sIndex) => {
      const numericIndex = Number(sIndex);

      const correctIndexes = correct[numericIndex];

      const selectedIndexes = circledWords[numericIndex] || [];

      totalCorrect += correctIndexes.length;

      newWrongWords[numericIndex] = [];

      newLockedWords[numericIndex] = [...(lockedWords[numericIndex] || [])];

      selectedIndexes.forEach((wIndex) => {
        if (correctIndexes.includes(wIndex)) {
          studentCorrect++;

          /*
            LOCK CORRECT WORD
          */

          if (!newLockedWords[numericIndex].includes(wIndex)) {
            newLockedWords[numericIndex].push(wIndex);
          }
        } else {
          /*
            WRONG WORD
          */

          newWrongWords[numericIndex].push(wIndex);
        }
      });
    });

    /* =================================================
       APPLY PROGRESSIVE LOCKING
    ================================================= */

    setLockedWords(newLockedWords);

    /* =================================================
       APPLY WRONG X
    ================================================= */

    setWrongWords(newWrongWords);

    /* =================================================
       SCORE
    ================================================= */

    const color =
      studentCorrect === totalCorrect
        ? "green"
        : studentCorrect === 0
          ? "red"
          : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        margin-top:10px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${studentCorrect} / ${totalCorrect}
        </span>
      </div>
    `;

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (studentCorrect === totalCorrect) {
      const finalLocked = {};

      Object.keys(correct).forEach((sIndex) => {
        finalLocked[sIndex] = [...correct[sIndex]];
      });

      setLockedWords(finalLocked);

      setWrongWords({});

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =================================================
       PARTIAL / WRONG
    ================================================= */

    if (studentCorrect === 0) {
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

    const finalAnswers = {};

    const finalLocked = {};

    Object.keys(correct).forEach((sIndex) => {
      finalAnswers[sIndex] = [...correct[sIndex]];

      finalLocked[sIndex] = [...correct[sIndex]];
    });

    setCircledWords(finalAnswers);

    setLockedWords(finalLocked);

    setWrongWords({});

    setShowAnswerMode(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const reset = () => {
    stopAudio();

    setCircledWords({});

    setWrongWords({});

    setLockedWords({});

    setShowAnswerMode(false);

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
          gap: "120px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="F"
          title={
            <>
              Circle the{" "}
              <span
                style={{
                  color: "",
                }}
              >
                short i
              </span>{" "}
              words.
            </>
          }
          subTitle="Read each column and tap every short-i word."
        />

        {/* =================================================
            WORDS
        ================================================= */}

        <div className="review6-p2-q3-sentence-container2 w-full">
          {sentences.map((sentence, sIndex) => (
            <div className="review3-p2-q2-sentence-row" key={sIndex}>
              <span
                className="review3-p2-q2-num"
                style={{
                  color: "#2c5287",

                  fontWeight: "700",
                }}
              >
                {sentence.num}
              </span>

              <div className="review3-p2-q2-word-box">
                {sentence.words.map((item, wIndex) => {
                  const isCircled = circledWords[sIndex]?.includes(wIndex);

                  const isWrong = isWordWrong(sIndex, wIndex);

                  const isLocked = isWordLocked(sIndex, wIndex);

                  const audioKey = `word-${sIndex}-${wIndex}`;

                  const isPlaying = playingKey === audioKey;

                  return (
                    <span
                      key={wIndex}
                      className={`review3-p2-q2-word ${
                        isCircled ? "circled" : ""
                      }`}
                      role="button"
                      /*
                        كل الكلمات تظل بالـTab
                        حتى لو locked
                        عشان الصوت يضل قابل للإعادة.
                      */

                      tabIndex={0}
                      aria-pressed={isCircled}
                      aria-label={
                        isLocked || showAnswerMode || checkCompleted
                          ? `Play audio: ${item.word}`
                          : `${item.word}. Press Enter or Space to hear and ${
                              isCircled ? "unselect" : "select"
                            } this word.`
                      }
                      onClick={() =>
                        activateWord(sIndex, wIndex, item.word, item.audio)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          e.stopPropagation();

                          activateWord(sIndex, wIndex, item.word, item.audio);
                        }
                      }}
                      style={{
                        position: "relative",

                        cursor: "pointer",
                      }}
                    >
                      {item.word}

                      {/* =================================================
                          AUDIO ICON
                      ================================================= */}

                      {isPlaying && (
                        <FaVolumeUp
                          size={14}
                          aria-hidden="true"
                          style={{
                            position: "absolute",

                            right: "-18px",

                            top: "50%",

                            transform: "translateY(-50%)",

                            pointerEvents: "none",
                          }}
                        />
                      )}

                      {/* =================================================
                          WRONG X
                      ================================================= */}

                      {isWrong && !showAnswerMode && (
                        <span
                          className="review3-p2-q2-wrong-x"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
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

export default Review6_Page2_Q3;
