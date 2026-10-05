import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page5_Q1.css";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import circleAudio from "../../../assets/U1 WB/U4/audio/page_23_q_i/Item_001_It's_a_circle.mp3";
import squareAudio from "../../../assets/U1 WB/U4/audio/page_23_q_i/Item_002_It's_a_square.mp3";
import triangleAudio from "../../../assets/U1 WB/U4/audio/page_23_q_i/Item_003_It's_a_triangle.mp3";
import rectangleAudio from "../../../assets/U1 WB/U4/audio/page_23_q_i/Item_004_It's_a_rectangle.mp3";

/* =====================================================
   DATA
===================================================== */

const shapes = [
  { key: "square", label: "square" },
  { key: "triangle", label: "triangle" },
  { key: "circle", label: "circle" },
  { key: "rectangle", label: "rectangle" },
];

const rows = [
  {
    id: 1,
    text: "It’s a circle.",
    answer: "circle",
    audio: circleAudio,
  },
  {
    id: 2,
    text: "It’s a square.",
    answer: "square",
    audio: squareAudio,
  },
  {
    id: 3,
    text: "It’s a triangle.",
    answer: "triangle",
    audio: triangleAudio,
  },
  {
    id: 4,
    text: "It’s a rectangle.",
    answer: "rectangle",
    audio: rectangleAudio,
  },
];

/* =====================================================
   COLORS
===================================================== */

const BASIC_COLORS = [
  { value: "#ff0000", label: "Red" },
  { value: "#0000ff", label: "Blue" },
  { value: "#ffff00", label: "Yellow" },
  { value: "#00aa00", label: "Green" },
  { value: "#ff8c08", label: "Orange" },
];

/* =====================================================
   SVG SHAPE
===================================================== */

const ShapeSVG = ({
  type,
  color,

  shapeRef,

  onOpenPalette,

  paletteOpen,
}) => {
  const size = 100;

  const commonProps = {
    width: size,
    height: size,

    ref: shapeRef,

    role: "button",

    tabIndex: 0,

    "aria-label": `${type}. Press Enter or Space to choose a color.`,

    "aria-expanded": paletteOpen,

    onClick: onOpenPalette,

    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();

        onOpenPalette();
      }
    },

    className: "shape-svg shape-svg-accessible-wb-unit4-p5-q1",
  };

  switch (type) {
    case "square":
      return (
        <svg {...commonProps}>
          <rect
            x="10"
            y="10"
            width="70"
            height="70"
            fill={color}
            stroke="gray"
          />
        </svg>
      );

    case "triangle":
      return (
        <svg {...commonProps}>
          <polygon points="45,10 80,80 10,80" fill={color} stroke="gray" />
        </svg>
      );

    case "circle":
      return (
        <svg {...commonProps}>
          <circle cx="45" cy="45" r="35" fill={color} stroke="gray" />
        </svg>
      );

    case "rectangle":
      return (
        <svg {...commonProps}>
          <rect
            x="10"
            y="30"
            width="80"
            height="50"
            fill={color}
            stroke="gray"
          />
        </svg>
      );

    default:
      return null;
  }
};

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit4_Page5_Q1 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState({});

  const [wrongRows, setWrongRows] = useState([]);

  const [lockedRows, setLockedRows] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     COLORS
  ================================================= */

  const [colors, setColors] = useState({
    square: "#ffffff",
    triangle: "#ffffff",
    circle: "#ffffff",
    rectangle: "#ffffff",
  });

  const [activeShape, setActiveShape] = useState(null);

  const [showPalette, setShowPalette] = useState(false);

  const [palettePosition, setPalettePosition] = useState({
    left: 0,
    top: 0,
  });

  /* =================================================
     REFS
  ================================================= */

  const shapeRefs = useRef({});

  const paletteButtonRefs = useRef({});

  const tableWrapperRef = useRef(null);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingRow, setPlayingRow] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingRow(null);
  };

  const playAudio = (rowId, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingRow(rowId);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const isRowLocked = (rowId) => lockedRows.includes(rowId);

  /* =================================================
     COLORING
  ================================================= */

  const openPalette = (shapeKey, element = null) => {
    if (showAnswer) return;

    const shapeElement = element || shapeRefs.current[shapeKey];

    const wrapper = tableWrapperRef.current;

    if (shapeElement && wrapper) {
      const shapeRect = shapeElement.getBoundingClientRect();

      const wrapperRect = wrapper.getBoundingClientRect();

      setPalettePosition({
        left: shapeRect.left - wrapperRect.left + shapeRect.width / 2,

        top: shapeRect.top - wrapperRect.top - 10,
      });
    }

    setActiveShape(shapeKey);

    setShowPalette(true);

    requestAnimationFrame(() => {
      paletteButtonRefs.current[`${shapeKey}-0`]?.focus();
    });
  };

  const closePalette = (shapeKey) => {
    setShowPalette(false);

    setActiveShape(null);

    requestAnimationFrame(() => {
      shapeRefs.current[shapeKey]?.focus();
    });
  };

  const selectColor = (color) => {
    const currentShape = activeShape;

    if (!currentShape) return;

    setColors((prev) => ({
      ...prev,

      [currentShape]: color,
    }));

    setShowPalette(false);

    setActiveShape(null);

    requestAnimationFrame(() => {
      shapeRefs.current[currentShape]?.focus();
    });
  };

  /* =================================================
     SELECT ANSWER
  ================================================= */

  const handleSelect = (rowId, shapeKey) => {
    if (showAnswer || checkCompleted || isRowLocked(rowId)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,

      [rowId]: shapeKey,
    }));

    /* شيل X فقط من نفس الصف */

    setWrongRows((prev) => prev.filter((id) => id !== rowId));
  };

  /* =================================================
     CHECK ANSWER
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (rows.some((row) => answers[row.id] === undefined)) {
      ValidationAlert.info("Please choose an answer for each sentence.");

      return;
    }

    let score = 0;

    const wrong = [];

    const newlyLocked = [];

    rows.forEach((row) => {
      if (answers[row.id] === row.answer) {
        score++;

        newlyLocked.push(row.id);
      } else {
        wrong.push(row.id);
      }
    });

    /* =============================
       Progressive locking
    ============================= */

    setLockedRows((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setWrongRows(wrong);

    const total = rows.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedRows(rows.map((row) => row.id));

      setWrongRows([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    const correct = {};

    rows.forEach((row) => {
      correct[row.id] = row.answer;
    });

    setAnswers(correct);

    setWrongRows([]);

    setLockedRows(rows.map((row) => row.id));

    setShowAnswer(true);

    setCheckCompleted(true);

    setColors({
      square: "red",
      triangle: "red",
      circle: "red",
      rectangle: "red",
    });

    setShowPalette(false);

    setActiveShape(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongRows([]);

    setLockedRows([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setShowPalette(false);

    setActiveShape(null);

    setColors({
      square: "#ffffff",
      triangle: "#ffffff",
      circle: "#ffffff",
      rectangle: "#ffffff",
    });
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
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="I"
          title={
            <>
              Look, read, and write{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                ✓
              </span>
              . Color.
            </>
          }
          subTitle="Match each sentence row to the correct shape column, then color the selected shapes."
        />

        <div
          ref={tableWrapperRef}
          style={{
            width: "100%",
            position: "relative",
            overflow: "visible",
          }}
        >
          <table className="shapes-table-wrapper-wb-unit4-p5-q1 w-full">
            <thead>
              <tr>
                <th></th>

                {shapes.map((shape) => (
                  <th key={shape.key}>
                    <ShapeSVG
                      type={shape.key}
                      color={colors[shape.key]}
                      shapeRef={(el) => {
                        shapeRefs.current[shape.key] = el;
                      }}
                      paletteOpen={showPalette && activeShape === shape.key}
                      onOpenPalette={(e) => {
                        openPalette(
                          shape.key,
                          e?.currentTarget || shapeRefs.current[shape.key],
                        );
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const rowLocked = isRowLocked(row.id);

                const rowWrong = wrongRows.includes(row.id);

                const rowPlaying = playingRow === row.id;

                return (
                  <tr key={row.id}>
                    {/* =================================
                        SENTENCE + AUDIO
                    ================================= */}

                    <td className="sentence-cell">
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Play audio for ${row.text}`}
                        onClick={() => {
                          playAudio(row.id, row.audio);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();

                            playAudio(row.id, row.audio);
                          }
                        }}
                        className="sentence-audio-wb-unit4-p5-q1"
                        style={{
                          position: "relative",
                          cursor: "pointer",
                          userSelect: "none",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {row.text}

                        {rowPlaying && (
                          <FaVolumeUp
                            size={16}
                            aria-hidden="true"
                            className="sentence-audio-icon-wb-unit4-p5-q1"
                          />
                        )}
                      </span>
                    </td>

                    {/* =================================
                        ANSWER CELLS
                    ================================= */}

                    {shapes.map((shape) => {
                      const selected = answers[row.id] === shape.key;

                      const isCorrect = selected && shape.key === row.answer;

                      const isWrong = rowWrong && selected && !isCorrect;

                      return (
                        <td
                          key={shape.key}
                          role="button"
                          tabIndex={
                            rowLocked || showAnswer || checkCompleted ? -1 : 0
                          }
                          aria-pressed={selected}
                          aria-label={`${shape.label}${
                            selected ? ", selected" : ""
                          }. Press Enter or Space to choose this shape for ${row.text}`}
                          className={`cell-wrapper-review4-p1-q3 ${
                            selected ? "selected" : ""
                          }`}
                          onClick={() => handleSelect(row.id, shape.key)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              handleSelect(row.id, shape.key);
                            }
                          }}
                        >
                          {selected && (
                            <span className="correct-mark-wb-unit4-p5-q1">
                              ✓
                            </span>
                          )}

                          {isWrong && <span className="wrong-badge">✕</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* =================================================
              COLOR PALETTE
          ================================================= */}

          {showPalette && activeShape && (
            <div
              className="color-palette-wb-unit4-p5-q1"
              role="group"
              aria-label={`Choose a color for ${activeShape}`}
              style={{
                left: palettePosition.left,

                top: palettePosition.top,
              }}
            >
              {BASIC_COLORS.map((color, index) => (
                <button
                  key={color.value}
                  ref={(el) => {
                    paletteButtonRefs.current[`${activeShape}-${index}`] = el;
                  }}
                  type="button"
                  className="color-circle-wb-unit4-p5-q1"
                  style={{
                    backgroundColor: color.value,
                  }}
                  aria-label={color.label}
                  onClick={() => selectColor(color.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault();

                      e.stopPropagation();

                      closePalette(activeShape);
                    }
                  }}
                />
              ))}
            </div>
          )}
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

export default WB_Unit4_Page5_Q1;
