import React, { useRef, useState } from "react";

import bat from "../../../assets/unit6/imgs/U6P53EXED-01.svg";
import cap from "../../../assets/unit6/imgs/U6P53EXED-02.svg";
import ant from "../../../assets/unit6/imgs/U6P53EXED-03.svg";
import dad from "../../../assets/unit6/imgs/U6P53EXED-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review5_Page2_Q1.css";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import gardenAudio from "../../../assets/unit6/sounds/Page 53 - D/garden.mp3";
import girlAudio from "../../../assets/unit6/sounds/Page 53 - D/girl.mp3";
import keyAudio from "../../../assets/unit6/sounds/Page 53 - D/key.mp3";
import kitchenAudio from "../../../assets/unit6/sounds/Page 53 - D/kitchen.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: bat,
    correct: "g",
    correctInput: "girl",
    audio: girlAudio,
    alt: "A young girl standing and smiling.",
  },
  {
    img: cap,
    correct: "k",
    correctInput: "kitchen",
    audio: kitchenAudio,
    alt: "A kitchen with cabinets, counters, and a stove.",
  },
  {
    img: ant,
    correct: "k",
    correctInput: "key",
    audio: keyAudio,
    alt: "A metal key.",
  },
  {
    img: dad,
    correct: "g",
    correctInput: "garden",
    audio: gardenAudio,
    alt: "A garden with a house, trees, grass, and flowers.",
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review5_Page2_Q1 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [selected, setSelected] = useState(["", "", "", ""]);

  /*
    input value now follows the selected letter automatically
  */

  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongItems, setWrongItems] = useState([]);

  const [lockedItems, setLockedItems] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingIndex, setPlayingIndex] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingIndex(null);
  };

  const playWordAudio = (index) => {
    const src = items[index]?.audio;

    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingIndex(index);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const isLocked = (index) => lockedItems.includes(index);

  /* =================================================
     SELECT G / K
  ================================================= */

  const handleSelect = (value, index) => {
    if (showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    /*
      choose circle
    */

    setSelected((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });

    /*
      write SAME selected letter in input automatically
    */

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });

    /*
      clear X only for same question
    */

    setWrongItems((prev) => prev.filter((i) => i !== index));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (selected.some((value) => value === "")) {
      ValidationAlert.info("Oops!", "Please choose g or k for all items.");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const correctNow = [];

    items.forEach((item, index) => {
      /*
        Since input is automatic,
        circle and input are one answer now.
      */

      const isCorrect =
        selected[index] === item.correct && answers[index] === item.correct;

      if (isCorrect) {
        correctCount++;

        correctNow.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      progressive locking
    */

    setLockedItems((prev) => Array.from(new Set([...prev, ...correctNow])));

    setWrongItems(wrong);

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px; margin-top:10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedItems(items.map((_, index) => index));

      setWrongItems([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    const correctLetters = items.map((item) => item.correct);

    setSelected(correctLetters);

    setAnswers(correctLetters);

    setWrongItems([]);

    setLockedItems(items.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const resetAll = () => {
    stopAudio();

    setSelected(["", "", "", ""]);

    setAnswers(["", "", "", ""]);

    setWrongItems([]);

    setLockedItems([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  /* =================================================
     RENDER
  ================================================= */

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
          gap: "50px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="D"
          title={
            <>
              Does it begin with <span style={{ color: "red" }}>g</span> or{" "}
              <span style={{ color: "red" }}>k</span>? Circle and write.
            </>
          }
          subTitle={
            <>
              Look at each picture, then choose{" "}
              <span style={{ color: "red" }}>g</span> or{" "}
              <span style={{ color: "red" }}>k</span>. The selected letter will
              appear in the blank.
            </>
          }
        />

        {/* =================================================
            QUESTIONS GRID
        ================================================= */}

        <div className="question-grid-unit4-page5-q1 w-full">
          {items.map((item, index) => {
            const locked = isLocked(index);

            const wrong = wrongItems.includes(index);

            const wordAvailable = locked || showAnswer || checkCompleted;

            return (
              <div className="question-box-unit4-page5-q1" key={index}>
                {/* =====================================
                    IMAGE
                ===================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {index + 1}
                  </span>

                  <img
                    src={item.img}
                    alt={item.alt}
                    className="q-img-review5-p2-q1"
                  />
                </div>

                {/* =====================================
                    G / K SELECT
                ===================================== */}

                <div className="choices-unit4-page5-q1">
                  {["g", "k"].map((letter) => {
                    const isSelected = selected[index] === letter;

                    const isWrongSelected =
                      wrong && isSelected && letter !== item.correct;

                    return (
                      <div className="circle-wrapper" key={letter}>
                        <div
                          role="button"
                          tabIndex={locked ? -1 : 0}
                          aria-pressed={isSelected}
                          aria-label={`Choose ${letter} for item ${index + 1}`}
                          className={`circle-choice-review5-page2-q1 ${
                            isSelected ? "active" : ""
                          }`}
                          onClick={() => handleSelect(letter, index)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              handleSelect(letter, index);
                            }
                          }}
                        >
                          {letter}
                        </div>

                        {isWrongSelected && (
                          <div className="wrong-mark" aria-hidden="true">
                            ✕
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* =====================================
                    INPUT + REST OF WORD
                ===================================== */}

                <div className="word-row-review5-p2-q1">
                  <div
                    className="first-letter-input-review5-p2-q1"
                    aria-label={`Selected beginning letter: ${
                      answers[index] || "empty"
                    }`}
                  >
                    {answers[index]}
                  </div>

                  <span className="rest-word">
                    {item.correctInput.slice(1)}
                  </span>

                
                </div>

                {/* =====================================
                    FULL WORD AUDIO
                    available after correct/check/show
                ===================================== */}

                {wordAvailable && (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Play word: ${item.correctInput}`}
                    className="word-audio-review5-p2-q1"
                    onClick={() => playWordAudio(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        playWordAudio(index);
                      }
                    }}
                  >
                    {item.correctInput}

                    {playingIndex === index && (
                      <FaVolumeUp
                        size={14}
                        aria-hidden="true"
                        className="audio-icon-review5-p2-q1"
                      />
                    )}
                  </div>
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
        <button onClick={resetAll} className="try-again-button">
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

export default Review5_Page2_Q1;
