import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page5.css";

import sound1 from "../../../assets/unit1/sounds/P14Q2.mp3";

import bat from "../../../assets/img_unit2/imgs/bat.jpg";
import box from "../../../assets/img_unit2/imgs/box.jpg";
import bucket from "../../../assets/img_unit2/imgs/bucket.jpg";
import boat from "../../../assets/img_unit2/imgs/boat.jpg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

import batSound from "../../../assets/unit2/Page 14 - A 2/bat.mp3";
import boatSound from "../../../assets/unit2/Page 14 - A 2/boat.mp3";
import boxSound from "../../../assets/unit2/Page 14 - A 2/box.mp3";
import pailSound from "../../../assets/unit2/Page 14 - A 2/pail.mp3";

import { FaVolumeUp } from "react-icons/fa";

const Unit2_Page5_Q2 = () => {
  const [answers, setAnswers] = useState([null, null, null, null]);

  const [showResult, setShowResult] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  // العناصر الصحيحة اللي اتقفلت بعد Check
  const [lockedItems, setLockedItems] = useState([]);

  // بعد أول Check ناجح بالكامل
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeAudioIndex, setActiveAudioIndex] = useState(null);

  const audioRef = useRef(null);

  const stopAtSecond = 11.18;

  const items = [
    {
      img: bat,
      correct: "b",
      sound: batSound,
      alt: "Bat",
    },
    {
      img: box,
      correct: "p",
      sound: boxSound,
      alt: "Box",
    },
    {
      img: bucket,
      correct: "b",
      sound: pailSound,
      alt: "Bucket",
    },
    {
      img: boat,
      correct: "b",
      sound: boatSound,
      alt: "Boat",
    },
  ];

  /* =====================================================
     ITEM AUDIO
  ===================================================== */

  const playItemSound = (sound, index) => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = sound;

    setActiveAudioIndex(index);

    audioRef.current.play();

    audioRef.current.onended = () => {
      setActiveAudioIndex(null);
    };
  };

  /* =====================================================
     CAPTIONS
  ===================================================== */

  const captions = [
    {
      start: 0,
      end: 5.16,
      text: "Page 14, Right activities. Exercise A, number two. ",
    },
    {
      start: 5.18,
      end: 11.18,
      text: "Does it begin with a B or P? Listen and circle. ",
    },
    {
      start: 11.2,
      end: 12.28,
      text: "Bat.",
    },
    {
      start: 12.3,
      end: 13.22,
      text: "Pail.",
    },
    {
      start: 13.24,
      end: 14.19,
      text: "Box. ",
    },
    {
      start: 14.21,
      end: 15.13,
      text: "Boat.",
    },
  ];

  /* =====================================================
     SELECT ANSWER
  ===================================================== */

  const handleSelect = (index, value) => {
    // Show Answer يقفل النشاط
    if (showAnswer) return;

    // العنصر الصح بعد Check ما يتغير
    if (lockedItems.includes(index)) return;

    const newAnswers = [...answers];

    newAnswers[index] = value;

    setAnswers(newAnswers);

    // إذا كان غلط من Check سابق
    // أول ما يعدله نشيل X عنه
    setShowResult(false);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    // بعد Show Answer أو Check النهائي
    // أي ضغط ثاني ما يعمل شيء
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please answer all items first.");

      return;
    }

    let correctCount = 0;

    const newlyLocked = [];

    answers.forEach((answer, index) => {
      const isCorrect =
        answer?.toLowerCase() === items[index].correct?.toLowerCase();

      if (isCorrect) {
        correctCount++;

        newlyLocked.push(index);
      }
    });

    // اقفل الصح فقط
    setLockedItems((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    setShowResult(true);

    /* =============================
       ALL CORRECT
    ============================= */

    if (correctCount === total) {
      setLockedItems(items.map((_, index) => index));

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =============================
       WRONG / PARTIAL
    ============================= */

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const correctAnswers = items.map((item) => item.correct);

    setAnswers(correctAnswers);

    setShowResult(true);

    setShowAnswer(true);

    setLockedItems(items.map((_, index) => index));

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));

    setShowResult(false);

    setShowAnswer(false);

    setLockedItems([]);

    setCheckCompleted(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setActiveAudioIndex(null);
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
      <audio ref={audioRef} />

      <div
        className="div-forall"
        style={{
          gap: "60px",
        }}
      >
        <ExerciseHeader
          questionNumber="2"
          title={
            <>
              Does it begin with
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                b{" "}
              </span>
              or
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                p{" "}
              </span>
              ? Listen and circle.
            </>
          }
          subTitle="Listen to each word, then tap b or p."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit2-page14"
        />

        <div
          className="imgFeild"
          style={{
            display: "flex",
            gap: "13px",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <div className="bp-container">
            {items.map((item, index) => {
              const isLocked = lockedItems.includes(index);

              return (
                <div className="bp-item" key={index}>
                  {/* =====================
                        IMAGE
                    ===================== */}

                  <div
                    style={{
                      position: "relative",

                      display: "inline-block",
                    }}
                  >
                    <img
                      src={item.img}
                      className="bp-image"
                      role="button"
                      tabIndex={0}
                      alt={item.alt}
                      aria-label={`Play audio for ${item.alt}`}
                      onClick={() => playItemSound(item.sound, index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          playItemSound(item.sound, index);
                        }
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    />

                    {activeAudioIndex === index && (
                      <FaVolumeUp
                        size={24}
                        style={{
                          position: "absolute",

                          top: "5px",

                          right: "5px",

                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>

                  {/* =====================
                        B / P OPTIONS
                    ===================== */}

                  <div className="bp-options">
                    {/* B */}

                    <span
                      style={{
                        position: "relative",

                        cursor: isLocked || showAnswer ? "default" : "pointer",
                      }}
                      className={`bp-option
                          ${answers[index] === "b" ? "selected" : ""}
                          ${
                            showResult &&
                            answers[index] === "b" &&
                            answers[index] !== item.correct
                              ? "wrong-answer"
                              : ""
                          }
                        `}
                      onClick={() => handleSelect(index, "b")}
                    >
                      b
                      {showResult &&
                        answers[index] === "b" &&
                        answers[index] !== item.correct && (
                          <span className="wrong-x-u2-p5-q2">✕</span>
                        )}
                    </span>

                    {/* P */}

                    <span
                      style={{
                        position: "relative",

                        cursor: isLocked || showAnswer ? "default" : "pointer",
                      }}
                      className={`bp-option
                          ${answers[index] === "p" ? "selected" : ""}
                          ${
                            showResult &&
                            answers[index] === "p" &&
                            answers[index] !== item.correct
                              ? "wrong-answer"
                              : ""
                          }
                        `}
                      onClick={() => handleSelect(index, "p")}
                    >
                      p
                      {showResult &&
                        answers[index] === "p" &&
                        answers[index] !== item.correct && (
                          <span className="wrong-x-u2-p5-q2">✕</span>
                        )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =============================
          BUTTONS
      ============================= */}

      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={handleShowAnswer} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page5_Q2;
