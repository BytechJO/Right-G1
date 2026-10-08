import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit6_Page5_Q1.css";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import iCanAudio from "../../../assets/U1 WB/U6/audio/page 37 - I/Item_001_I_can.mp3";

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit6_Page5_Q1 = () => {
  /* =====================================================
     TEXT ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState(["", "", ""]);

  /* =====================================================
     DRAWING TOOLS
  ===================================================== */

  const [strokeColor, setStrokeColor] = useState("#800080");

  const [tool, setTool] = useState("pen");

  /* =====================================================
     CANVAS REFS
  ===================================================== */

  const canvasRefs = useRef([]);

  /* =====================================================
     DRAWING STATE
  ===================================================== */

  const drawingRef = useRef([false, false, false]);

  /* =====================================================
     HISTORY
     كل canvas إله history لحاله
  ===================================================== */

  const historyRef = useRef([[], [], []]);

  /* =====================================================
     KEYBOARD DRAWING STATE
  ===================================================== */

  const keyboardDrawingRef = useRef([false, false, false]);

  const keyboardCursorRef = useRef([
    { x: 135, y: 60 },
    { x: 135, y: 60 },
    { x: 135, y: 60 },
  ]);

  const [keyboardCursor, setKeyboardCursor] = useState([
    { x: 135, y: 60 },
    { x: 135, y: 60 },
    { x: 135, y: 60 },
  ]);

  const [keyboardDrawing, setKeyboardDrawing] = useState([false, false, false]);

  /* =====================================================
     CURRENT CANVAS
     آخر canvas تم الرسم عليه
  ===================================================== */

  const activeCanvasRef = useRef(0);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingRow, setPlayingRow] = useState(null);

  /* =====================================================
     STOP AUDIO
  ===================================================== */

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

  /* =====================================================
     PLAY I CAN
  ===================================================== */

  const playICanAudio = (index) => {
    stopAudio();

    const audio = new Audio(iCanAudio);

    audioRef.current = audio;

    setPlayingRow(index);

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

  /* =====================================================
     CLEANUP AUDIO
  ===================================================== */

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  /* =====================================================
     GET POINTER POSITION
  ===================================================== */

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();

    let clientX;
    let clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
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
     APPLY DRAWING STYLE
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
     SAVE CANVAS STATE
     قبل كل stroke
  ===================================================== */

  const saveCanvasState = (index) => {
    const canvas = canvasRefs.current[index];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    historyRef.current[index].push(imageData);
  };

  /* =====================================================
     START DRAWING
  ===================================================== */

  const startDrawing = (e, index) => {
    e.preventDefault();

    const canvas = canvasRefs.current[index];

    if (!canvas) return;

    activeCanvasRef.current = index;

    saveCanvasState(index);

    const ctx = canvas.getContext("2d");

    const { x, y } = getPos(e, canvas);

    drawingRef.current[index] = true;

    applyDrawingStyle(ctx);

    ctx.beginPath();

    ctx.moveTo(x, y);
  };

  /* =====================================================
     DRAW
  ===================================================== */

  const draw = (e, index) => {
    e.preventDefault();

    if (!drawingRef.current[index]) {
      return;
    }

    const canvas = canvasRefs.current[index];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const { x, y } = getPos(e, canvas);

    applyDrawingStyle(ctx);

    ctx.lineTo(x, y);

    ctx.stroke();
  };

  /* =====================================================
     STOP DRAWING
  ===================================================== */

  const stopDrawing = (index) => {
    drawingRef.current[index] = false;

    const canvas = canvasRefs.current[index];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.closePath();
  };

  /* =====================================================
     KEYBOARD CURSOR UPDATE
  ===================================================== */

  const updateKeyboardCursor = (index, newPosition) => {
    keyboardCursorRef.current[index] = newPosition;

    setKeyboardCursor((prev) => {
      const updated = [...prev];

      updated[index] = newPosition;

      return updated;
    });
  };

  /* =====================================================
     KEYBOARD DRAW LINE
  ===================================================== */

  const drawKeyboardLine = (index, from, to) => {
    const canvas = canvasRefs.current[index];

    if (!canvas) return;

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

  const toggleKeyboardDrawing = (index) => {
    const newValue = !keyboardDrawingRef.current[index];

    /*
      إذا بدنا نبدأ stroke جديد بالكيبورد
      نحفظ history مرة واحدة
    */

    if (newValue) {
      activeCanvasRef.current = index;

      saveCanvasState(index);
    }

    keyboardDrawingRef.current[index] = newValue;

    setKeyboardDrawing((prev) => {
      const updated = [...prev];

      updated[index] = newValue;

      return updated;
    });
  };

  /* =====================================================
     STOP KEYBOARD DRAW
  ===================================================== */

  const stopKeyboardDrawing = (index) => {
    keyboardDrawingRef.current[index] = false;

    setKeyboardDrawing((prev) => {
      const updated = [...prev];

      updated[index] = false;

      return updated;
    });
  };

  /* =====================================================
     KEYBOARD CANVAS
  ===================================================== */

  const handleCanvasKeyDown = (e, index) => {
    const canvas = canvasRefs.current[index];

    if (!canvas) return;

    activeCanvasRef.current = index;

    /* =============================================
       ENTER / SPACE
    ============================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      toggleKeyboardDrawing(index);

      return;
    }

    /* =============================================
       ESCAPE
    ============================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      stopKeyboardDrawing(index);

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

    const oldPosition = keyboardCursorRef.current[index];

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

    /* =============================================
       KEEP INSIDE CANVAS
    ============================================= */

    newX = Math.max(2, Math.min(canvas.width - 2, newX));

    newY = Math.max(2, Math.min(canvas.height - 2, newY));

    const newPosition = {
      x: newX,
      y: newY,
    };

    /* =============================================
       DRAW IF ACTIVE
    ============================================= */

    if (keyboardDrawingRef.current[index]) {
      drawKeyboardLine(index, oldPosition, newPosition);
    }

    updateKeyboardCursor(index, newPosition);
  };

  /* =====================================================
     UNDO
     يرجع آخر stroke على آخر canvas تم استخدامه
  ===================================================== */

  const undoLast = () => {
    const index = activeCanvasRef.current;

    const canvas = canvasRefs.current[index];

    if (!canvas) return;

    const history = historyRef.current[index];

    if (!history.length) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const previousState = history.pop();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.putImageData(previousState, 0, 0);
  };

  /* =====================================================
     CLEAR SINGLE CANVAS
     مع حفظ history عشان Undo يرجعه
  ===================================================== */

  const clearCanvas = (index) => {
    const canvas = canvasRefs.current[index];

    if (!canvas) return;

    activeCanvasRef.current = index;

    saveCanvasState(index);

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  /* =====================================================
     CLEAR ALL
  ===================================================== */

  const clearAllCanvases = () => {
    canvasRefs.current.forEach((canvas, index) => {
      if (!canvas) return;

      /*
        نحفظ حالة كل canvas
        عشان Undo يقدر يرجع آخر Canvas نشط
      */

      saveCanvasState(index);

      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  };

  /* =====================================================
     FULL RESET CANVAS
     بدون حفظ history
  ===================================================== */

  const resetCanvas = () => {
    canvasRefs.current.forEach((canvas) => {
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    historyRef.current = [[], [], []];

    keyboardDrawingRef.current = [false, false, false];

    const initialCursor = [
      { x: 135, y: 60 },
      { x: 135, y: 60 },
      { x: 135, y: 60 },
    ];

    keyboardCursorRef.current = initialCursor;

    setKeyboardCursor(initialCursor);

    setKeyboardDrawing([false, false, false]);

    activeCanvasRef.current = 0;
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(["", "", ""]);

    setTool("pen");

    setStrokeColor("#800080");

    resetCanvas();
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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="I"
          title="What can you do? Write and draw."
          subTitle="Write three things you can do, then draw each one."
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
            <label htmlFor="wb-unit6-p5-q1-color">🎨 Color:</label>

            <input
              id="wb-unit6-p5-q1-color"
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
            EXERCISE
        ================================================= */}

        <div className="exercise-container-wb-unit6-p5-q1 w-full">
          {[0, 1, 2].map((i) => (
            <div key={i} className="row-container-wb-unit6-p5-q1">
              {/* =================================================
                  LEFT
              ================================================= */}

              <div className="sentence-area-wb-unit6-p5-q1">
                <span className="number-wb-unit6-p5-q1">{i + 1}</span>

                {/* I CAN AUDIO */}

                <span
                  className="i-can-audio-wb-unit6-p5-q1"
                  role="button"
                  tabIndex={0}
                  aria-label="Play: I can"
                  onClick={() => playICanAudio(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      playICanAudio(i);
                    }
                  }}
                >
                  I can
                  {playingRow === i && (
                    <FaVolumeUp
                      size={13}
                      aria-hidden="true"
                      className="i-can-audio-icon-wb-unit6-p5-q1"
                    />
                  )}
                </span>

                <input
                  type="text"
                  value={answers[i]}
                  aria-label={`Write something you can do for item ${i + 1}`}
                  onChange={(e) => {
                    const updated = [...answers];

                    updated[i] = e.target.value;

                    setAnswers(updated);
                  }}
                />
              </div>

              {/* =================================================
                  RIGHT
              ================================================= */}

              <div className="canvas-wrapper-wb-unit6-p5-q1">
                <canvas
                  ref={(el) => {
                    canvasRefs.current[i] = el;
                  }}
                  className="draw-box-wb-unit6-p5-q1"
                  width={270}
                  height={120}
                  tabIndex={0}
                  role="application"
                  aria-label={`Drawing area ${
                    i + 1
                  }. Use arrow keys to move the drawing cursor. Press Enter or Space to start or stop drawing. Hold Shift with an arrow key to move faster. Press Escape to stop drawing.`}
                  style={{
                    cursor:
                      tool === "eraser"
                        ? `url(${eraserCursor}) 12 12, auto`
                        : `url(${pencilCursor}) 4 28, auto`,
                  }}
                  onFocus={() => {
                    activeCanvasRef.current = i;
                  }}
                  onMouseDown={(e) => startDrawing(e, i)}
                  onMouseMove={(e) => draw(e, i)}
                  onMouseUp={() => stopDrawing(i)}
                  onMouseLeave={() => stopDrawing(i)}
                  onTouchStart={(e) => startDrawing(e, i)}
                  onTouchMove={(e) => draw(e, i)}
                  onTouchEnd={() => stopDrawing(i)}
                  onKeyDown={(e) => handleCanvasKeyDown(e, i)}
                  onBlur={() => stopKeyboardDrawing(i)}
                />

                {/* =================================================
                    KEYBOARD CURSOR
                ================================================= */}

                <span
                  aria-hidden="true"
                  className={`keyboard-cursor-wb-unit6-p5-q1 ${
                    keyboardDrawing[i] ? "drawing" : ""
                  }`}
                  style={{
                    left: `${(keyboardCursor[i].x / 270) * 100}%`,

                    top: `${(keyboardCursor[i].y / 120) * 100}%`,
                  }}
                />
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
      </div>
    </div>
  );
};

export default WB_Unit6_Page5_Q1;
