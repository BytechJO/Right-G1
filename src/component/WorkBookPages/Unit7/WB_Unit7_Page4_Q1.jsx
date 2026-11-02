import React, { useEffect, useRef, useState } from "react";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import img1 from "../../../assets/U1 WB/U7/U7P42EXEG-01.svg";

import "./WB_Unit7_Page4_Q1.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import sadAudio from "../../../assets/U1 WB/U7/audio/page 42- G/Item_001_I'm_sad.mp3";
import happyAudio from "../../../assets/U1 WB/U7/audio/page 42- G/Item_002_I'm_happy.mp3";
import boredAudio from "../../../assets/U1 WB/U7/audio/page 42- G/Item_004_I'm_bored.mp3";
import scaredAudio from "../../../assets/U1 WB/U7/audio/page 42- G/Item_005_I'm_scared.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: 1,
    text: "I’m sad.",
    img: img1,
    audio: sadAudio,
  },

  {
    id: 2,
    text: "I’m happy.",
    img: img1,
    audio: happyAudio,
  },

  {
    id: 3,
    text: "I’m bored.",
    img: img1,
    audio: boredAudio,
  },

  {
    id: 4,
    text: "I’m scared.",
    img: img1,
    audio: scaredAudio,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit7_Page4_Q1 = () => {
  /* =====================================================
     TOOLS
  ===================================================== */

  const [tool, setTool] = useState("pen");

  const [strokeColor, setStrokeColor] = useState("#800080");

  /* =====================================================
     CANVAS REFS
  ===================================================== */

  const canvasRefs = useRef({});

  /* =====================================================
     MOUSE DRAWING STATE
  ===================================================== */

  const drawingRef = useRef({});

  /* =====================================================
     HISTORY
  ===================================================== */

  const historyRef = useRef({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  const activeCanvasRef = useRef(1);

  /* =====================================================
     KEYBOARD DRAWING
  ===================================================== */

  const keyboardDrawingRef = useRef({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const keyboardCursorRef = useRef({
    1: {
      x: 110,
      y: 90,
    },

    2: {
      x: 110,
      y: 90,
    },

    3: {
      x: 110,
      y: 90,
    },

    4: {
      x: 110,
      y: 90,
    },
  });

  const [keyboardCursor, setKeyboardCursor] = useState({
    1: {
      x: 110,
      y: 90,
    },

    2: {
      x: 110,
      y: 90,
    },

    3: {
      x: 110,
      y: 90,
    },

    4: {
      x: 110,
      y: 90,
    },
  });

  const [keyboardDrawing, setKeyboardDrawing] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);

  /* =====================================================
     AUDIO HELPERS
  ===================================================== */

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
    if (!src) {
      return;
    }

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

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  /* =====================================================
     DRAW STYLE
  ===================================================== */

  const applyDrawingStyle = (ctx) => {
    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";

      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";

      ctx.strokeStyle = strokeColor;

      ctx.lineWidth = 3;
    }
  };

  /* =====================================================
     GET POSITION
  ===================================================== */

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();

    let clientX;
    let clientY;

    if (e.touches && e.touches.length) {
      clientX = e.touches[0].clientX;

      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length) {
      clientX = e.changedTouches[0].clientX;

      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;

      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;

    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,

      y: (clientY - rect.top) * scaleY,
    };
  };

  /* =====================================================
     SAVE HISTORY
  ===================================================== */

  const saveCanvasState = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    historyRef.current[id].push(imageData);
  };

  /* =====================================================
     START DRAWING
  ===================================================== */

  const startDrawing = (e, id) => {
    e.preventDefault();

    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    activeCanvasRef.current = id;

    saveCanvasState(id);

    const ctx = canvas.getContext("2d");

    const { x, y } = getPos(e, canvas);

    drawingRef.current[id] = true;

    applyDrawingStyle(ctx);

    ctx.beginPath();

    ctx.moveTo(x, y);
  };

  /* =====================================================
     DRAW
  ===================================================== */

  const draw = (e, id) => {
    e.preventDefault();

    if (!drawingRef.current[id]) {
      return;
    }

    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const { x, y } = getPos(e, canvas);

    applyDrawingStyle(ctx);

    ctx.lineTo(x, y);

    ctx.stroke();
  };

  /* =====================================================
     STOP DRAWING
  ===================================================== */

  const stopDrawing = (id) => {
    drawingRef.current[id] = false;

    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    ctx.closePath();
  };

  /* =====================================================
     KEYBOARD CURSOR UPDATE
  ===================================================== */

  const updateKeyboardCursor = (id, position) => {
    keyboardCursorRef.current[id] = position;

    setKeyboardCursor((prev) => ({
      ...prev,

      [id]: position,
    }));
  };

  /* =====================================================
     KEYBOARD DRAW LINE
  ===================================================== */

  const drawKeyboardLine = (id, from, to) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    applyDrawingStyle(ctx);

    ctx.beginPath();

    ctx.moveTo(from.x, from.y);

    ctx.lineTo(to.x, to.y);

    ctx.stroke();

    ctx.closePath();
  };

  /* =====================================================
     TOGGLE KEYBOARD DRAW
  ===================================================== */

  const toggleKeyboardDrawing = (id) => {
    const next = !keyboardDrawingRef.current[id];

    /*
        إذا بدأ stroke جديد:
        احفظ history مرة وحدة.
      */

    if (next) {
      activeCanvasRef.current = id;

      saveCanvasState(id);
    }

    keyboardDrawingRef.current[id] = next;

    setKeyboardDrawing((prev) => ({
      ...prev,

      [id]: next,
    }));
  };

  /* =====================================================
     STOP KEYBOARD DRAW
  ===================================================== */

  const stopKeyboardDrawing = (id) => {
    keyboardDrawingRef.current[id] = false;

    setKeyboardDrawing((prev) => ({
      ...prev,

      [id]: false,
    }));
  };

  /* =====================================================
     KEYBOARD CANVAS
  ===================================================== */

  const handleCanvasKeyDown = (e, id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    activeCanvasRef.current = id;

    /* =============================================
         ENTER / SPACE
      ============================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      toggleKeyboardDrawing(id);

      return;
    }

    /* =============================================
         ESCAPE
      ============================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      stopKeyboardDrawing(id);

      return;
    }

    /* =============================================
         ARROWS
      ============================================= */

    const isArrow =
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight";

    if (!isArrow) {
      return;
    }

    e.preventDefault();

    const step = e.shiftKey ? 10 : 4;

    const oldPosition = keyboardCursorRef.current[id];

    let newX = oldPosition.x;

    let newY = oldPosition.y;

    if (e.key === "ArrowUp") {
      newY -= step;
    }

    if (e.key === "ArrowDown") {
      newY += step;
    }

    if (e.key === "ArrowLeft") {
      newX -= step;
    }

    if (e.key === "ArrowRight") {
      newX += step;
    }

    newX = Math.max(2, Math.min(canvas.width - 2, newX));

    newY = Math.max(2, Math.min(canvas.height - 2, newY));

    const newPosition = {
      x: newX,
      y: newY,
    };

    if (keyboardDrawingRef.current[id]) {
      drawKeyboardLine(id, oldPosition, newPosition);
    }

    updateKeyboardCursor(id, newPosition);
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const undoLast = () => {
    const id = activeCanvasRef.current;

    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const history = historyRef.current[id];

    if (!history?.length) {
      return;
    }

    const previous = history.pop();

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.putImageData(previous, 0, 0);
  };

  /* =====================================================
     CLEAR ALL
  ===================================================== */

  const clearAllCanvases = () => {
    questions.forEach((question) => {
      const canvas = canvasRefs.current[question.id];

      if (!canvas) {
        return;
      }

      saveCanvasState(question.id);

      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  };

  /* =====================================================
     FULL RESET
  ===================================================== */

  const resetCanvas = () => {
    stopAudio();

    questions.forEach((question) => {
      const canvas = canvasRefs.current[question.id];

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    historyRef.current = {
      1: [],
      2: [],
      3: [],
      4: [],
    };

    keyboardDrawingRef.current = {
      1: false,
      2: false,
      3: false,
      4: false,
    };

    const initial = {
      1: {
        x: 110,
        y: 90,
      },

      2: {
        x: 110,
        y: 90,
      },

      3: {
        x: 110,
        y: 90,
      },

      4: {
        x: 110,
        y: 90,
      },
    };

    keyboardCursorRef.current = initial;

    setKeyboardCursor(initial);

    setKeyboardDrawing({
      1: false,
      2: false,
      3: false,
      4: false,
    });

    setTool("pen");

    setStrokeColor("#800080");

    activeCanvasRef.current = 1;
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="unit4-q2-p6-container"
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
          gap: 15,
        }}
      >
        <ExerciseHeader
          sectionLetter="G"
          title="Read and draw."
          subTitle="Draw a face showing sad, happy, bored, and scared."
        />

        {/* =================================================
            TOOLS
        ================================================= */}

        <div className="unit4-q2-p6-tools w-full">
          {/* PEN */}

          <button
            type="button"
            onClick={() => setTool("pen")}
            className={`unit4-q2-p6-tool-btn ${
              tool === "pen" ? "active-tool" : ""
            }`}
            aria-pressed={tool === "pen"}
            aria-label="Use pen tool"
          >
            ✏️ Pen
          </button>

          {/* ERASER */}

          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`unit4-q2-p6-tool-btn ${
              tool === "eraser" ? "active-tool" : ""
            }`}
            aria-pressed={tool === "eraser"}
            aria-label="Use eraser tool"
          >
            🧽 Eraser
          </button>

          {/* UNDO */}

          <button
            type="button"
            onClick={undoLast}
            className="unit4-q2-p6-tool-btn"
            aria-label="Undo last drawing action"
          >
            ↶ Undo
          </button>

          {/* CLEAR */}

          <button
            type="button"
            onClick={clearAllCanvases}
            className="unit4-q2-p6-tool-btn"
            aria-label="Clear all drawings"
          >
            🗑 Clear
          </button>

          {/* COLOR */}

          <div
            className="unit4-q2-p6-tool-btn"
            style={{
              display: "flex",

              alignItems: "center",

              gap: "8px",
            }}
          >
            <label htmlFor="wb-unit7-p4-q1-color">🎨 Color:</label>

            <input
              id="wb-unit7-p4-q1-color"
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              aria-label="Choose drawing color"
              style={{
                width: "23px",

                height: "23px",

                border: "none",

                cursor: "pointer",

                background: "transparent",
              }}
            />
          </div>
        </div>

        {/* =================================================
            QUESTIONS
        ================================================= */}

        <div className="wb-unit5-p4-q1-table w-full">
          {questions.map((question) => (
            <div key={question.id} className="wb-unit5-p4-q1-row">
              {/* =================================================
                    SENTENCE + AUDIO
                ================================================= */}

              <div className="wb-unit5-p4-q1-text">
                <span
                  style={{
                    color: "darkblue",

                    fontWeight: "700",
                  }}
                >
                  {question.id}
                </span>{" "}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Play audio: ${question.text}`}
                  className="drawing-sentence-audio-wb-unit7-p4-q1"
                  onClick={() => playAudio(question.id, question.audio)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      playAudio(question.id, question.audio);
                    }
                  }}
                >
                  {question.text}

                  {playingId === question.id && (
                    <FaVolumeUp
                      size={14}
                      aria-hidden="true"
                      className="drawing-sentence-audio-icon-wb-unit7-p4-q1"
                    />
                  )}
                </span>
              </div>

              {/* =================================================
                    CANVAS
                ================================================= */}

              <div className="canvas-wrapper-wb-unit7-p4-q1">
                <canvas
                  ref={(element) => {
                    canvasRefs.current[question.id] = element;
                  }}
                  width={220}
                  height={180}
                  className="wb-unit7-p4-q1-canvas"
                  tabIndex={0}
                  role="application"
                  aria-label={`Drawing area ${question.id} for ${question.text}. Use arrow keys to move the drawing cursor. Press Enter or Space to start or stop drawing. Hold Shift with an arrow key to move faster. Press Escape to stop drawing.`}
                  style={{
                    backgroundImage: `url(${question.img})`,

                    backgroundRepeat: "no-repeat",

                    backgroundSize: "contain",

                    backgroundPosition: "center",

                    cursor:
                      tool === "eraser"
                        ? `url(${eraserCursor}) 12 12, auto`
                        : `url(${pencilCursor}) 4 28, auto`,
                  }}
                  onFocus={() => {
                    activeCanvasRef.current = question.id;
                  }}
                  onMouseDown={(e) => startDrawing(e, question.id)}
                  onMouseMove={(e) => draw(e, question.id)}
                  onMouseUp={() => stopDrawing(question.id)}
                  onMouseLeave={() => stopDrawing(question.id)}
                  onTouchStart={(e) => startDrawing(e, question.id)}
                  onTouchMove={(e) => {
                    e.preventDefault();

                    draw(e, question.id);
                  }}
                  onTouchEnd={() => stopDrawing(question.id)}
                  onKeyDown={(e) => handleCanvasKeyDown(e, question.id)}
                  onBlur={() => stopKeyboardDrawing(question.id)}
                />

                {/* =================================================
                      KEYBOARD CURSOR
                  ================================================= */}

                <span
                  aria-hidden="true"
                  className={`keyboard-cursor-wb-unit7-p4-q1 ${
                    keyboardDrawing[question.id] ? "drawing" : ""
                  }`}
                  style={{
                    left: `${(keyboardCursor[question.id].x / 220) * 100}%`,

                    top: `${(keyboardCursor[question.id].y / 180) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          BUTTON
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={resetCanvas} className="try-again-button">
          Clear Drawings ↻
        </button>
      </div>
    </div>
  );
};

export default WB_Unit7_Page4_Q1;
