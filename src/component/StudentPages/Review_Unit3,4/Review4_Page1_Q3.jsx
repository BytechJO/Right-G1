import React, { useRef, useState } from "react";
import "./Review4_Page1_Q3.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit4/imgs/U4P36EXEC-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P36EXEC-02.svg";
import img3 from "../../../assets/unit4/imgs/U4P36EXEC-03.svg";
import img4 from "../../../assets/unit4/imgs/U4P36EXEC-04.svg";

import circleAudio from "../../../assets/unit4/Page 36 - C/Circle.mp3";
import squareAudio from "../../../assets/unit4/Page 36 - C/Square.mp3";
import triangleAudio from "../../../assets/unit4/Page 36 - C/Triangle.mp3";
import rectangleAudio from "../../../assets/unit4/Page 36 - C/Rectangle.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DATA
===================================================== */

const shapesData = [
  {
    id: 1,
    shape: "circle",
    img: img1,
    alt: "A red circle.",
    audio: circleAudio,
  },

  {
    id: 2,
    shape: "square",
    img: img2,
    alt: "An orange square.",
    audio: squareAudio,
  },

  {
    id: 3,
    shape: "triangle",
    img: img3,
    alt: "A green triangle.",
    audio: triangleAudio,
  },

  {
    id: 4,
    shape: "rectangle",
    img: img4,
    alt: "A purple rectangle.",
    audio: rectangleAudio,
  },
];

const options = ["triangle", "circle", "square", "rectangle"];

const Review4_Page1_Q3 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState({});

  const [wrongRows, setWrongRows] = useState([]);

  const [lockedRows, setLockedRows] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingShape, setPlayingShape] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingShape(null);
  };

  const playShapeAudio = (shape, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingShape(shape);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingShape(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingShape(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingShape(null);
    };
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const isRowLocked = (rowId) => lockedRows.includes(rowId);

  const getRowData = (rowId) => shapesData.find((row) => row.id === rowId);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (rowId, option) => {
    if (showAnswer || checkCompleted || isRowLocked(rowId)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [rowId]: option,
    }));

    /*
      شيل X فقط عن نفس الصف
    */

    setWrongRows((prev) => prev.filter((id) => id !== rowId));
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const hasEmpty = shapesData.some((row) => !answers[row.id]);

    if (hasEmpty) {
      ValidationAlert.info("Please choose an answer for each shape.");

      return;
    }

    let score = 0;

    const wrong = [];

    const newlyLocked = [];

    shapesData.forEach((row) => {
      const isCorrect = answers[row.id] === row.shape;

      if (isCorrect) {
        score++;

        newlyLocked.push(row.id);
      } else {
        wrong.push(row.id);
      }
    });

    /*
      الصح فقط يقفل
    */

    setLockedRows((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      الغلط فقط عليه X
    */

    setWrongRows(wrong);

    const total = shapesData.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedRows(shapesData.map((row) => row.id));

      setWrongRows([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    const correctSelections = {};

    shapesData.forEach((row) => {
      correctSelections[row.id] = row.shape;
    });

    setAnswers(correctSelections);

    setWrongRows([]);

    setLockedRows(shapesData.map((row) => row.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongRows([]);

    setLockedRows([]);

    setShowAnswer(false);

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
          gap: "50px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="C"
          title={
            <>
              Look and write{" "}
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
          subTitle="Read the clue, then tap the matching shape cell."
        />

        <table className="shapes-table-wrapper-review4-p1-q3 w-full">
          <thead>
            <tr>
              <th>What shape is it?</th>

              {options.map((opt) => (
                <th key={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {shapesData.map((row) => {
              const rowLocked = isRowLocked(row.id);

              const rowWrong = wrongRows.includes(row.id);

              return (
                <tr key={row.id}>
                  {/* =========================================
                      IMAGE
                  ========================================= */}

                  <td className="img-cell-wrapper-review4-p1-q3">
                    <img
                      src={row.img}
                      alt={row.alt}
                      className="shape-img-wrapper-review4-p1-q3"
                      style={{
                        height: "50px",
                        width: "auto",
                      }}
                    />
                  </td>

                  {/* =========================================
                      OPTIONS
                  ========================================= */}

                  {options.map((opt) => {
                    const selected = answers[row.id] === opt;

                    const correctOption = opt === row.shape;

                    const isWrong = rowWrong && selected && !correctOption;

                    /*
                      الصوت يتفعّل فقط
                      لما الصف يكون صح ومقفول
                    */

                    const audioEnabled = rowLocked && correctOption;

                    const isPlaying = playingShape === row.shape;

                    return (
                      <td
                        key={opt}
                        className={`cell-wrapper-review4-p1-q3 ${
                          selected ? "selected" : ""
                        } ${isWrong ? "wrong-cell-review4-p1-q3" : ""} ${
                          audioEnabled ? "audio-enabled-review4-p1-q3" : ""
                        }`}
                        role="button"
                        tabIndex={
                          showAnswer
                            ? audioEnabled
                              ? 0
                              : -1
                            : rowLocked
                              ? correctOption
                                ? 0
                                : -1
                              : 0
                        }
                        aria-pressed={selected}
                        aria-label={
                          audioEnabled
                            ? `${opt}. Correct. Press Enter or Space to play the audio.`
                            : `${opt}${
                                selected ? ", selected" : ""
                              }. Press Enter or Space to select this answer.`
                        }
                        onClick={() => {
                          if (audioEnabled) {
                            playShapeAudio(row.shape, row.audio);

                            return;
                          }

                          handleSelect(row.id, opt);
                        }}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter" && e.key !== " ") {
                            return;
                          }

                          e.preventDefault();

                          e.stopPropagation();

                          if (audioEnabled) {
                            playShapeAudio(row.shape, row.audio);

                            return;
                          }

                          handleSelect(row.id, opt);
                        }}
                        style={{
                          position: "relative",

                          cursor: "pointer",
                        }}
                      >
                        {/* =================================
                            CHECK MARK
                        ================================= */}

                        {selected && <span className="correct-mark">✓</span>}

                        {/* =================================
                            AUDIO ICON
                        ================================= */}

                        {audioEnabled && isPlaying && (
                          <FaVolumeUp
                            size={16}
                            aria-hidden="true"
                            className="audio-icon-review4-p1-q3"
                          />
                        )}

                        {/* =================================
                            WRONG X
                        ================================= */}

                        {isWrong && (
                          <div className="wrong-badge" aria-hidden="true">
                            ✕
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
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

export default Review4_Page1_Q3;
