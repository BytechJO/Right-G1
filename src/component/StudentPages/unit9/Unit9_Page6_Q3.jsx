import React, { useRef, useState } from "react";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import img1 from "../../../assets/unit9/imgs/U9P81EXEE-01.svg";
import img2 from "../../../assets/unit9/imgs/U9P81EXEE-02.svg";

import ExerciseHeader from "../../ExerciseHeader";

import "./Unit9_Page6_Q3.css";

const questions = [
  {
    id: 1,
    img: img2,
    label: "Rabbit tracing and coloring guide",
  },

  {
    id: 2,
    img: img1,
    label: "Cat tracing and coloring guide",
  },
];

const Unit9_Page6_Q3 = () => {
  const [tool, setTool] = useState("pen");

  const [color, setColor] = useState("#800080");

  /* =====================================================
     KEYBOARD DRAWING STATE
  ===================================================== */

  const [keyboardDrawingId, setKeyboardDrawingId] = useState(null);

  const [focusedCanvasId, setFocusedCanvasId] = useState(null);

  /*
    لازم state عشان حركة المؤشر تظهر بصرياً.
  */

  const [keyboardCursorPositions, setKeyboardCursorPositions] = useState({});

  /* =====================================================
     REFS
  ===================================================== */

  const canvasRefs = useRef({});

  const historyActions = useRef([]);

  const keyboardPositions = useRef({});

  /* =====================================================
     CONFIGURE CONTEXT
  ===================================================== */

  const configureContext = (context) => {
    context.lineCap = "round";

    if (tool === "eraser") {
      context.globalCompositeOperation = "destination-out";

      context.lineWidth = 20;
    } else {
      context.globalCompositeOperation = "source-over";

      context.strokeStyle = color;

      context.lineWidth = 3;
    }
  };

  /* =====================================================
     SAVE HISTORY
  ===================================================== */

  const saveHistory = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const context = canvas.getContext("2d");

    historyActions.current.push([
      {
        id,

        imageData: context.getImageData(0, 0, canvas.width, canvas.height),
      },
    ]);
  };

  /* =====================================================
     POINTER POSITION
  ===================================================== */

  const pointerPosition = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,

      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  /* =====================================================
     POINTER DRAW START
  ===================================================== */

  const startDrawing = (event, id) => {
    event.preventDefault();

    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    canvas.setPointerCapture?.(event.pointerId);

    const context = canvas.getContext("2d");

    saveHistory(id);

    configureContext(context);

    context.isDrawing = true;

    const point = pointerPosition(event, canvas);

    context.lastX = point.x;

    context.lastY = point.y;
  };

  /* =====================================================
     POINTER DRAW
  ===================================================== */

  const draw = (event, id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context.isDrawing) return;

    event.preventDefault();

    const point = pointerPosition(event, canvas);

    context.beginPath();

    context.moveTo(context.lastX, context.lastY);

    context.lineTo(point.x, point.y);

    context.stroke();

    context.lastX = point.x;

    context.lastY = point.y;
  };

  /* =====================================================
     POINTER STOP
  ===================================================== */

  const stopDrawing = (id) => {
    const context = canvasRefs.current[id]?.getContext("2d");

    if (context) {
      context.isDrawing = false;
    }
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const undo = () => {
    const action = historyActions.current.pop();

    if (!action) return;

    action.forEach(({ id, imageData }) => {
      const canvas = canvasRefs.current[id];

      if (!canvas) return;

      const context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.putImageData(imageData, 0, 0);
    });
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const clearCanvases = () => {
    const action = questions
      .map(({ id }) => {
        const canvas = canvasRefs.current[id];

        if (!canvas) return null;

        return {
          id,

          imageData: canvas
            .getContext("2d")
            .getImageData(0, 0, canvas.width, canvas.height),
        };
      })
      .filter(Boolean);

    if (action.length) {
      historyActions.current.push(action);
    }

    questions.forEach(({ id }) => {
      const canvas = canvasRefs.current[id];

      if (!canvas) return;

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    });

    setKeyboardDrawingId(null);
  };

  /* =====================================================
     INITIALIZE KEYBOARD CURSOR
  ===================================================== */

  const initializeKeyboardCursor = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const existing = keyboardPositions.current[id];

    const position = existing || {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };

    keyboardPositions.current[id] = position;

    setKeyboardCursorPositions((prev) => ({
      ...prev,

      [id]: position,
    }));
  };

  /* =====================================================
     CANVAS FOCUS
  ===================================================== */

  const handleCanvasFocus = (id) => {
    setFocusedCanvasId(id);

    initializeKeyboardCursor(id);
  };

  /* =====================================================
     CANVAS BLUR
  ===================================================== */

  const handleCanvasBlur = (id) => {
    stopDrawing(id);

    setKeyboardDrawingId((current) => (current === id ? null : current));

    setFocusedCanvasId((current) => (current === id ? null : current));
  };

  /* =====================================================
     KEYBOARD DRAWING
  ===================================================== */

  const handleCanvasKeyDown = (event, id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const context = canvas.getContext("2d");

    const position = keyboardPositions.current[id] || {
      x: canvas.width / 2,

      y: canvas.height / 2,
    };

    /* =================================================
       ENTER / SPACE
       Toggle drawing
    ================================================= */

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (keyboardDrawingId === id) {
        setKeyboardDrawingId(null);
      } else {
        /*
          History ينحفظ مرة واحدة فقط
          عند بداية stroke.
        */

        saveHistory(id);

        configureContext(context);

        setKeyboardDrawingId(id);
      }

      return;
    }

    /* =================================================
       ESCAPE
       Stop drawing
    ================================================= */

    if (event.key === "Escape") {
      event.preventDefault();

      setKeyboardDrawingId(null);

      return;
    }

    /* =================================================
       ARROW DIRECTIONS
    ================================================= */

    const directions = {
      ArrowLeft: [-1, 0],

      ArrowRight: [1, 0],

      ArrowUp: [0, -1],

      ArrowDown: [0, 1],
    };

    if (!directions[event.key]) {
      return;
    }

    event.preventDefault();

    /* =================================================
       SHIFT = faster movement
    ================================================= */

    const distance = event.shiftKey ? 12 : 4;

    const [horizontal, vertical] = directions[event.key];

    const next = {
      x: Math.min(
        canvas.width,
        Math.max(0, position.x + horizontal * distance),
      ),

      y: Math.min(canvas.height, Math.max(0, position.y + vertical * distance)),
    };

    /* =================================================
       DRAW IF ACTIVE
    ================================================= */

    if (keyboardDrawingId === id) {
      configureContext(context);

      context.beginPath();

      context.moveTo(position.x, position.y);

      context.lineTo(next.x, next.y);

      context.stroke();
    }

    /* =================================================
       UPDATE INTERNAL POSITION
    ================================================= */

    keyboardPositions.current[id] = next;

    /* =================================================
       UPDATE VISIBLE CURSOR
    ================================================= */

    setKeyboardCursorPositions((prev) => ({
      ...prev,

      [id]: next,
    }));
  };

  /* =====================================================
     JSX
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
          gap: "70px",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title="Trace and color."
          subTitle="Trace the rabbit and cat, then color them with the drawing tools."
        />

        {/* =================================================
            TOOLS
        ================================================= */}

        <div className="unit4-q2-p6-tools w-full">
          <button
            type="button"
            onClick={() => setTool("pen")}
            aria-pressed={tool === "pen"}
            className={`unit4-q2-p6-tool-btn ${
              tool === "pen" ? "active-tool" : ""
            }`}
          >
            ✏️ Pen
          </button>

          <button
            type="button"
            onClick={() => setTool("eraser")}
            aria-pressed={tool === "eraser"}
            className={`unit4-q2-p6-tool-btn ${
              tool === "eraser" ? "active-tool" : ""
            }`}
          >
            🧽 Eraser
          </button>

          <label className="unit4-q2-p6-color-control">
            Color
            <input
              type="color"
              value={color}
              onChange={(event) => {
                setColor(event.target.value);

                setTool("pen");
              }}
              aria-label="Choose drawing color"
            />
          </label>

          <button type="button" onClick={undo} className="unit4-q2-p6-tool-btn">
            Undo
          </button>

          <button
            type="button"
            onClick={clearCanvases}
            className="unit4-q2-p6-tool-btn"
          >
            Clear
          </button>
        </div>

        {/* =================================================
            CANVASES
        ================================================= */}

        <div className="wb-unit5-p4-q1-table w-full">
          {questions.map((question) => {
            const cursorPosition = keyboardCursorPositions[question.id];

            const keyboardFocused = focusedCanvasId === question.id;

            const keyboardDrawing = keyboardDrawingId === question.id;

            const canvas = canvasRefs.current[question.id];

            const left =
              canvas && cursorPosition
                ? `${(cursorPosition.x / canvas.width) * 100}%`
                : "50%";

            const top =
              canvas && cursorPosition
                ? `${(cursorPosition.y / canvas.height) * 100}%`
                : "50%";

            return (
              <div key={question.id} className="wb-unit5-p4-q1-row">
                {/* =============================================
                    CANVAS WRAPPER
                ============================================= */}

                <div className="unit9-p6-q3-canvas-wrapper">
                  <canvas
                    ref={(element) => {
                      canvasRefs.current[question.id] = element;
                    }}
                    width={270}
                    height={260}
                    tabIndex={0}
                    role="application"
                    aria-label={`${question.label}. Use arrow keys to move the drawing cursor. Press Enter or Space to start or stop drawing. Hold Shift with an arrow key to move faster. Press Escape to stop drawing.`}
                    className={`unit9-p3-q2-canvas ${
                      keyboardDrawing ? "keyboard-drawing-active" : ""
                    }`}
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
                    onFocus={() => handleCanvasFocus(question.id)}
                    onKeyDown={(event) =>
                      handleCanvasKeyDown(event, question.id)
                    }
                    onPointerDown={(event) => startDrawing(event, question.id)}
                    onPointerMove={(event) => draw(event, question.id)}
                    onPointerUp={() => stopDrawing(question.id)}
                    onPointerCancel={() => stopDrawing(question.id)}
                    onPointerLeave={() => stopDrawing(question.id)}
                    onBlur={() => handleCanvasBlur(question.id)}
                  />

                  {/* =============================================
                      KEYBOARD CURSOR
                  ============================================= */}

                  {keyboardFocused && (
                    <div
                      className={`unit9-p6-q3-keyboard-cursor ${
                        keyboardDrawing ? "drawing" : "moving"
                      }`}
                      style={{
                        left,

                        top,
                      }}
                      aria-hidden="true"
                    >
                      <span className="unit9-p6-q3-keyboard-cursor-center" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Unit9_Page6_Q3;
