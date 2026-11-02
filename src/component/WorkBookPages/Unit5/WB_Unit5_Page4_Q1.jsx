import React, { useRef, useState } from "react";

import "./WB_Unit5_Page4_Q1.css";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import bookAudio from "../../../assets/U1 WB/U5/audio/page_30_qG/Item_001_This_is_my_book.mp3";
import penAudio from "../../../assets/U1 WB/U5/audio/page_30_qG/Item_002_This_is_my_pen.mp3";
import rulerAudio from "../../../assets/U1 WB/U5/audio/page_30_qG/Item_003_This_is_my_ruler.mp3";
import eraserAudio from "../../../assets/U1 WB/U5/audio/page_30_qG/Item_004_This_is_my_eraser.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: 1,
    text: "This is my book.",
    audio: bookAudio,
  },
  {
    id: 2,
    text: "This is my pen.",
    audio: penAudio,
  },
  {
    id: 3,
    text: "This is my ruler.",
    audio: rulerAudio,
  },
  {
    id: 4,
    text: "This is my eraser.",
    audio: eraserAudio,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit5_Page4_Q1 = () => {
  /* =================================================
     TOOL STATE
  ================================================= */

  const [tool, setTool] = useState("pen");

  const [penColor, setPenColor] = useState("#7e22ce");

  /* =================================================
     CANVAS REFS
  ================================================= */

  const canvasRefs = useRef({});

  const historyRefs = useRef({});

  /* =================================================
     INPUT METHOD
     keyboard | mouse
  ================================================= */

  const inputMethodRef = useRef("mouse");

  /* =================================================
     KEYBOARD CURSOR
  ================================================= */

  const [keyboardState, setKeyboardState] = useState({});

  /*
    keyboardState[id] = {
      x,
      y,
      drawing,
      focused,
    }
  */

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);

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
    if (!src) return;

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

  /* =================================================
     CANVAS CONFIG
  ================================================= */

  const setupContext = (ctx) => {
    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";

      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";

      ctx.strokeStyle = penColor;

      ctx.lineWidth = 3;
    }
  };

  /* =================================================
     SAVE HISTORY
  ================================================= */

  const saveHistory = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (!historyRefs.current[id]) {
      historyRefs.current[id] = [];
    }

    historyRefs.current[id].push(imageData);
  };

  /* =================================================
     UNDO
  ================================================= */

  const handleUndo = (id = null) => {
    if (id) {
      undoCanvas(id);

      return;
    }

    /*
      لو ضغط Undo العام:
      يرجع آخر canvas فيه history
    */

    const ids = Object.keys(historyRefs.current).reverse();

    const targetId = ids.find(
      (canvasId) => historyRefs.current[canvasId]?.length > 0,
    );

    if (targetId) {
      undoCanvas(targetId);
    }
  };

  const undoCanvas = (id) => {
    const canvas = canvasRefs.current[id];

    const history = historyRefs.current[id];

    if (!canvas || !history || history.length === 0) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const previous = history.pop();

    ctx.putImageData(previous, 0, 0);
  };

  /* =================================================
     POINTER POSITION
  ================================================= */

  const getPointerPosition = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;

    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    const scaleX = canvas.width / rect.width;

    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,

      y: (clientY - rect.top) * scaleY,
    };
  };

  /* =================================================
     HIDE KEYBOARD CURSOR
  ================================================= */

  const hideKeyboardCursor = (id) => {
    setKeyboardState((prev) => ({
      ...prev,

      [id]: {
        ...(prev[id] || {}),

        drawing: false,

        focused: false,
      },
    }));
  };

  /* =================================================
     MOUSE / TOUCH DRAWING
  ================================================= */

  const startDrawing = (e, id) => {
    /*
      مهم:
      لما المستخدم يستخدم الماوس / التاتش
      نخفي Keyboard Cursor
    */

    inputMethodRef.current = "mouse";

    hideKeyboardCursor(id);

    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    saveHistory(id);

    setupContext(ctx);

    const pos = getPointerPosition(e, canvas);

    ctx.isDrawing = true;

    ctx.lastX = pos.x;

    ctx.lastY = pos.y;
  };

  const draw = (e, id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx.isDrawing) return;

    const pos = getPointerPosition(e, canvas);

    setupContext(ctx);

    ctx.beginPath();

    ctx.moveTo(ctx.lastX, ctx.lastY);

    ctx.lineTo(pos.x, pos.y);

    ctx.stroke();

    ctx.lastX = pos.x;

    ctx.lastY = pos.y;
  };

  const stopDrawing = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.isDrawing = false;
  };

  /* =================================================
     KEYBOARD DRAWING
  ================================================= */

  const ensureKeyboardState = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    setKeyboardState((prev) => {
      if (prev[id]) {
        return prev;
      }

      return {
        ...prev,

        [id]: {
          x: canvas.width / 2,

          y: canvas.height / 2,

          drawing: false,

          focused: false,
        },
      };
    });
  };

  /* =================================================
     CANVAS FOCUS
  ================================================= */

  const handleCanvasFocus = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    /*
      إذا الـ focus جاء من Tab:
      أظهر Keyboard Cursor.

      إذا focus جاء من Mouse:
      لا تظهره.
    */

    const isKeyboardFocus = inputMethodRef.current === "keyboard";

    setKeyboardState((prev) => ({
      ...prev,

      [id]: {
        x: prev[id]?.x ?? canvas.width / 2,

        y: prev[id]?.y ?? canvas.height / 2,

        drawing: prev[id]?.drawing ?? false,

        focused: isKeyboardFocus,
      },
    }));
  };

  /* =================================================
     CANVAS BLUR
  ================================================= */

  const handleCanvasBlur = (id) => {
    setKeyboardState((prev) => ({
      ...prev,

      [id]: {
        ...(prev[id] || {}),

        drawing: false,

        focused: false,
      },
    }));
  };

  /* =================================================
     CANVAS KEYBOARD
  ================================================= */

  const handleCanvasKeyDown = (e, id) => {
    /*
      بمجرد استخدام الكيبورد داخل canvas
      اعتبر الوضع Keyboard Mode
    */

    inputMethodRef.current = "keyboard";

    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const state = keyboardState[id] || {
      x: canvas.width / 2,

      y: canvas.height / 2,

      drawing: false,

      focused: true,
    };

    /* =========================================
       ENTER / SPACE
       Toggle drawing
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      const nextDrawing = !state.drawing;

      /*
        أول ما يبدأ keyboard stroke
        خزّن history مرة واحدة
      */

      if (nextDrawing) {
        saveHistory(id);
      }

      setKeyboardState((prev) => ({
        ...prev,

        [id]: {
          ...state,

          drawing: nextDrawing,

          focused: true,
        },
      }));

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      setKeyboardState((prev) => ({
        ...prev,

        [id]: {
          ...state,

          drawing: false,

          focused: true,
        },
      }));

      return;
    }

    /* =========================================
       ARROWS
    ========================================= */

    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    if (!arrowKeys.includes(e.key)) {
      return;
    }

    e.preventDefault();

    const step = e.shiftKey ? 10 : 4;

    let nextX = state.x;

    let nextY = state.y;

    if (e.key === "ArrowLeft") {
      nextX -= step;
    }

    if (e.key === "ArrowRight") {
      nextX += step;
    }

    if (e.key === "ArrowUp") {
      nextY -= step;
    }

    if (e.key === "ArrowDown") {
      nextY += step;
    }

    nextX = Math.max(0, Math.min(canvas.width, nextX));

    nextY = Math.max(0, Math.min(canvas.height, nextY));

    /* =========================================
       DRAW SEGMENT
    ========================================= */

    if (state.drawing) {
      const ctx = canvas.getContext("2d");

      setupContext(ctx);

      ctx.beginPath();

      ctx.moveTo(state.x, state.y);

      ctx.lineTo(nextX, nextY);

      ctx.stroke();
    }

    setKeyboardState((prev) => ({
      ...prev,

      [id]: {
        ...state,

        x: nextX,

        y: nextY,

        focused: true,
      },
    }));
  };

  /* =================================================
     CLEAR
  ================================================= */

  const resetCanvas = () => {
    stopAudio();

    Object.entries(canvasRefs.current).forEach(([id, canvas]) => {
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      historyRefs.current[id] = [];
    });

    setKeyboardState({});

    inputMethodRef.current = "mouse";
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <div
      className="unit4-q2-p6-container"
      /* ===============================================
         نعرف إذا آخر استخدام كان Tab أو Mouse
      =============================================== */
      onKeyDownCapture={(e) => {
        if (e.key === "Tab") {
          inputMethodRef.current = "keyboard";
        }
      }}
      onPointerDownCapture={() => {
        inputMethodRef.current = "mouse";
      }}
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
          sectionLetter="G"
          title="Read and draw."
          subTitle="Draw each named school item in its box."
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
          >
            🧽 Eraser
          </button>

          {/* COLOR */}

          <label className="unit4-q2-p6-color-control">
            <span>🎨 Color</span>

            <input
              type="color"
              value={penColor}
              onChange={(e) => {
                setPenColor(e.target.value);

                setTool("pen");
              }}
              aria-label="Choose drawing color"
            />
          </label>

          {/* UNDO */}

          <button
            type="button"
            onClick={() => handleUndo()}
            className="unit4-q2-p6-tool-btn"
          >
            ↶ Undo
          </button>

          {/* CLEAR */}

          <button
            type="button"
            onClick={resetCanvas}
            className="unit4-q2-p6-tool-btn"
          >
            🗑 Clear
          </button>
        </div>

        {/* =================================================
            QUESTIONS
        ================================================= */}

        <div className="wb-unit5-p4-q1-table w-full">
          {questions.map((q) => {
            const keyboard = keyboardState[q.id];

            return (
              <div key={q.id} className="wb-unit5-p4-q1-row">
                {/* =========================================
                    SENTENCE AUDIO
                ========================================= */}

                <div
                  className="wb-unit5-p4-q1-text"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play audio: ${q.text}`}
                  onClick={() => playAudio(q.id, q.audio)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      playAudio(q.id, q.audio);
                    }
                  }}
                  style={{
                    position: "relative",

                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      color: "darkblue",

                      fontWeight: "700",
                    }}
                  >
                    {q.id}
                  </span>{" "}
                  {q.text}
                  {playingId === q.id && (
                    <FaVolumeUp
                      size={16}
                      aria-hidden="true"
                      className="audio-icon-wb-unit5-p4-q1"
                    />
                  )}
                </div>

                {/* =========================================
                    CANVAS AREA
                ========================================= */}

                <div className="wb-unit5-p4-q1-canvas-wrapper">
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[q.id] = el;

                      if (el) {
                        ensureKeyboardState(q.id);
                      }
                    }}
                    width={270}
                    height={150}
                    className="wb-unit5-p4-q1-canvas"
                    tabIndex={0}
                    role="application"
                    aria-label={`${q.text} drawing area. Use arrow keys to move the drawing cursor. Press Enter or Space to start or stop drawing. Press Escape to stop drawing.`}
                    style={{
                      cursor:
                        tool === "eraser"
                          ? `url(${eraserCursor}) 12 12, auto`
                          : `url(${pencilCursor}) 4 28, auto`,
                    }}
                    /* =====================================
                       FOCUS
                    ===================================== */
                    onFocus={() => handleCanvasFocus(q.id)}
                    onBlur={() => handleCanvasBlur(q.id)}
                    /* =====================================
                       KEYBOARD
                    ===================================== */
                    onKeyDown={(e) => handleCanvasKeyDown(e, q.id)}
                    /* =====================================
                       MOUSE
                    ===================================== */
                    onMouseDown={(e) => startDrawing(e, q.id)}
                    onMouseMove={(e) => draw(e, q.id)}
                    onMouseUp={() => stopDrawing(q.id)}
                    onMouseLeave={() => stopDrawing(q.id)}
                    /* =====================================
                       TOUCH
                    ===================================== */
                    onTouchStart={(e) => startDrawing(e, q.id)}
                    onTouchMove={(e) => draw(e, q.id)}
                    onTouchEnd={() => stopDrawing(q.id)}
                  />

                  {/* =========================================
                      KEYBOARD CURSOR
                  ========================================= */}

                  {keyboard?.focused && (
                    <div
                      aria-hidden="true"
                      className={`keyboard-drawing-cursor ${
                        keyboard.drawing ? "drawing-active" : ""
                      }`}
                      style={{
                        left: `${(keyboard.x / 270) * 100}%`,

                        top: `${(keyboard.y / 150) * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          START AGAIN
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={resetCanvas} className="try-again-button">
          Start Again ↻
        </button>
      </div>
    </div>
  );
};

export default WB_Unit5_Page4_Q1;
