import React, { useState, useRef } from "react";

import boy from "../../../assets/img_unit2/imgs/Boy.jpg";
import pen from "../../../assets/img_unit2/imgs/Pincl.jpg";
import ball from "../../../assets/img_unit2/imgs/Football.jpg";
import paint from "../../../assets/img_unit2/imgs/Paint.jpg";
import bird from "../../../assets/img_unit2/imgs/bird.jpg";
import pizza from "../../../assets/img_unit2/imgs/Pizza.jpg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page5.css";
import ExerciseHeader from "../../ExerciseHeader";

import ballSound from "../../../assets/unit2/Page 14 - A 1/ball.mp3";
import birdSound from "../../../assets/unit2/Page 14 - A 1/bird.mp3";
import boySound from "../../../assets/unit2/Page 14 - A 1/boy.mp3";
import paintSound from "../../../assets/unit2/Page 14 - A 1/paint.mp3";
import pencilSound from "../../../assets/unit2/Page 14 - A 1/pencil.mp3";
import pizzaSound from "../../../assets/unit2/Page 14 - A 1/pizza.mp3";

import { FaVolumeUp } from "react-icons/fa";

const Unit2_Page5_Q1 = () => {
  const audioRef = useRef(null);

  const [activeAudio, setActiveAudio] = useState(null);

  const exerciseData = [
    {
      letter: "b",
      options: [
        {
          word: "bird",
          src: bird,
          sound: birdSound,
        },
        {
          word: "pizza",
          src: pizza,
          sound: pizzaSound,
        },
      ],
    },

    {
      letter: "b",
      options: [
        {
          word: "Paint",
          src: paint,
          sound: paintSound,
        },
        {
          word: "ball",
          src: ball,
          sound: ballSound,
        },
      ],
    },

    {
      letter: "p",
      options: [
        {
          word: "pen",
          src: pen,
          sound: pencilSound,
        },
        {
          word: "boy",
          src: boy,
          sound: boySound,
        },
      ],
    },
  ];

  /* =====================================================
     STATES
  ===================================================== */

  const [answers, setAnswers] = useState(Array(exerciseData.length).fill(null));

  const [results, setResults] = useState(Array(exerciseData.length).fill(null));

  // الصفوف الصح اللي اتقفلت بعد Check
  const [lockedRows, setLockedRows] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // بعد ما يعمل Check وكلهم صح
  // أي Check ثاني ما يعمل شيء
  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers(Array(exerciseData.length).fill(null));

    setResults(Array(exerciseData.length).fill(null));

    setLockedRows([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setActiveAudio(null);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    // Show Answer أو خلص Check النهائي
    if (showAnswer || checkCompleted) {
      return;
    }

    /* -----------------------------
       تأكد إن كل الصفوف مختارة
    ----------------------------- */

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please choose for all rows first.");

      return;
    }

    const newResults = [...results];

    const newlyLocked = [];

    let correct = 0;

    const total = exerciseData.length;

    /* -----------------------------
       افحص كل صف
    ----------------------------- */

    exerciseData.forEach((row, i) => {
      const selectedIndex = answers[i];

      const selectedWord = row.options[selectedIndex].word;

      const isCorrect = selectedWord
        .toLowerCase()
        .startsWith(row.letter.toLowerCase());

      newResults[i] = isCorrect;

      if (isCorrect) {
        correct++;

        newlyLocked.push(i);
      }
    });

    /* -----------------------------
       الصح ينقفل
    ----------------------------- */

    setLockedRows((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setResults(newResults);

    /* -----------------------------
       SCORE
    ----------------------------- */

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    /* -----------------------------
       ALL CORRECT
    ----------------------------- */

    if (correct === total) {
      setCheckCompleted(true);

      setLockedRows(exerciseData.map((_, index) => index));

      setResults(Array(exerciseData.length).fill(true));

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* -----------------------------
       WRONG / PARTIAL
    ----------------------------- */

    if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const correctAnswers = exerciseData.map((row) => {
      return row.options.findIndex((opt) =>
        opt.word.toLowerCase().startsWith(row.letter.toLowerCase()),
      );
    });

    setAnswers(correctAnswers);

    setResults(Array(exerciseData.length).fill(true));

    setLockedRows(exerciseData.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     AUDIO
  ===================================================== */

  const playAudio = (sound, rowIndex, optIndex) => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current.src = sound;

    setActiveAudio(`${rowIndex}-${optIndex}`);

    audioRef.current.play();

    audioRef.current.onended = () => {
      setActiveAudio(null);
    };
  };

  /* =====================================================
     OPTION SELECT
  ===================================================== */

  const handleOptionSelect = (rowIndex, optIndex) => {
    // Show Answer → ممنوع تغيير الإجابة
    if (showAnswer) return;

    // الصف الصح بعد Check → ممنوع تعديله
    if (lockedRows.includes(rowIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[rowIndex] = optIndex;

      return updated;
    });

    // إذا كان الصف غلط من Check سابق
    // أول ما الطالب يعدله نشيل الـ X
    setResults((prev) => {
      const updated = [...prev];

      updated[rowIndex] = null;

      return updated;
    });
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
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "flex-start",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          questionNumber="1"
          title={
            <>
              Which picture begins with the letter? Write{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                ✓
              </span>
              .
            </>
          }
          subTitle="Look at the letter, then tap the picture that begins with that sound."
        />

        <div
          className="imgFeild"
          style={{
            display: "flex",
            margin: "80px 0px",
            gap: "13px",
            justifyContent: "space-around",
          }}
        >
          {exerciseData.map((item, rowIndex) => {
            const isLocked = lockedRows.includes(rowIndex);

            return (
              <div
                key={rowIndex}
                className="row11"
                style={{
                  display: "flex",
                  position: "relative",
                }}
              >
                <span className="letter-Q1-Pag5-Unit2">{item.letter}</span>

                {item.options.map((opt, optIndex) => (
                  <div
                    key={optIndex}
                    className="img-option"
                    style={{
                      display: "flex",

                      flexDirection: "column",

                      alignItems: "center",

                      justifyContent: "space-around",

                      cursor: isLocked || showAnswer ? "default" : "pointer",
                    }}
                    onClick={() => {
                      // الصوت يظل شغال
                      // حتى لو الصف مقفول
                      playAudio(opt.sound, rowIndex, optIndex);

                      // الاختيار نفسه
                      handleOptionSelect(rowIndex, optIndex);
                    }}
                  >
                    <div
                      style={{
                        position: "relative",

                        display: "inline-block",
                      }}
                    >
                      <img
                        src={opt.src}
                        alt={opt.word}
                        style={{
                          width: "130px",

                          height: "130px",

                          objectFit: "contain",

                          border: "1px solid #72d0f6",

                          borderRadius: "8px",

                          marginLeft: "0px",

                          cursor: "pointer",
                        }}
                      />

                      {activeAudio === `${rowIndex}-${optIndex}` && (
                        <FaVolumeUp
                          size={24}
                          style={{
                            position: "absolute",

                            top: "6px",

                            right: "6px",

                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </div>

                    <div
                      className={`check-box1 ${
                        answers[rowIndex] === optIndex ? "selected1" : ""
                      }`}
                      style={{
                        border: "1px solid #72d0f6",

                        borderRadius: "7px",

                        height: "40px",

                        width: "40px",

                        fontSize: "25px",

                        fontWeight: "500",

                        marginTop: "10px",

                        position: "relative",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        // فقط توضيح إن الصف صح
                      }}
                    >
                      {answers[rowIndex] === optIndex && (
                        <span
                          style={{
                            color: "red",

                            fontWeight: "700",
                          }}
                        >
                          ✓
                        </span>
                      )}

                      {results[rowIndex] === false &&
                        answers[rowIndex] === optIndex && (
                          <span className="wrong-x2">✕</span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

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

export default Unit2_Page5_Q1;
