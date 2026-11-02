import React, { useRef, useState } from "react";

import "./Writing_Page1_EX.css";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import img1 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream13.jpg";
import img2 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream14.jpg";
import img3 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream15.jpg";

import gifSrc from "../../../assets/Squirrel_GIF/Squirrel_1164_1433px.gif";

/* =====================================================
   PAGE DATA
===================================================== */

const questions = [
  {
    id: 1,
    img: img1,
    label: "Number word tracing page 1",
  },

  {
    id: 2,
    img: img2,
    label: "Number word tracing page 2",
  },

  {
    id: 3,
    img: img3,
    label: "Number word tracing page 3",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Writing_Page1_EX = () => {
  /* =====================================================
     PAGE
  ===================================================== */

  const [currentIndex, setCurrentIndex] = useState(0);

  /* =====================================================
     TOOL
  ===================================================== */

  const [tool, setTool] = useState("pen");

  /* =====================================================
     CANVAS REFS
  ===================================================== */

  const canvasRefs = useRef({});

  /* =====================================================
     HISTORY
     Separate history for every page
  ===================================================== */

  const historyRefs = useRef({
    1: [],
    2: [],
    3: [],
  });

  /* =====================================================
     KEYBOARD DRAWING
  ===================================================== */

  const [keyboardDrawingId, setKeyboardDrawingId] = useState(null);

  const [focusedCanvasId, setFocusedCanvasId] = useState(null);

  const [keyboardCursorPositions, setKeyboardCursorPositions] = useState({});

  const keyboardPositions = useRef({});

  /* =====================================================
     CURRENT PAGE
  ===================================================== */

  const currentQuestion = questions[currentIndex];

  /* =====================================================
     CONFIGURE CONTEXT
  ===================================================== */

  const configureContext = (context) => {
    context.lineCap = "round";

    context.lineJoin = "round";

    if (tool === "eraser") {
      context.globalCompositeOperation = "destination-out";

      context.lineWidth = 20;
    } else {
      context.globalCompositeOperation = "source-over";

      context.strokeStyle = "red";

      context.lineWidth = 2;
    }
  };

  /* =====================================================
     SAVE HISTORY
     Active page only
  ===================================================== */

  const saveHistory = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    if (!historyRefs.current[id]) {
      historyRefs.current[id] = [];
    }

    historyRefs.current[id].push(imageData);
  };

  /* =====================================================
     POINTER POSITION

     Scales correctly even if CSS size changes.
  ===================================================== */

  const getPointerPosition = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,

      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  /* =====================================================
     POINTER START

     Mouse + Touch + Stylus
  ===================================================== */

  const startDrawing = (event, id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    event.preventDefault();

    canvas.setPointerCapture?.(event.pointerId);

    const context = canvas.getContext("2d");

    /*
      Save only once at
      beginning of stroke.
    */

    saveHistory(id);

    configureContext(context);

    const point = getPointerPosition(event, canvas);

    context.isDrawing = true;

    context.lastX = point.x;

    context.lastY = point.y;
  };

  /* =====================================================
     POINTER DRAW
  ===================================================== */

  const draw = (event, id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context.isDrawing) {
      return;
    }

    event.preventDefault();

    const point = getPointerPosition(event, canvas);

    configureContext(context);

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
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    context.isDrawing = false;
  };

  /* =====================================================
     UNDO
     ACTIVE PAGE ONLY
  ===================================================== */

  const undo = () => {
    const id = currentQuestion.id;

    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const history = historyRefs.current[id] || [];

    const previous = history.pop();

    if (!previous) {
      return;
    }

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.putImageData(previous, 0, 0);
  };

  /* =====================================================
     CLEAR
     ACTIVE PAGE ONLY
  ===================================================== */

  const clearCurrentPage = () => {
    const id = currentQuestion.id;

    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    /*
        Save before Clear,
        so Undo can restore it.
      */

    saveHistory(id);

    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (keyboardDrawingId === id) {
      setKeyboardDrawingId(null);
    }
  };

  /* =====================================================
     INITIAL KEYBOARD CURSOR
  ===================================================== */

  const initializeKeyboardCursor = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

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

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    const position = keyboardPositions.current[id] || {
      x: canvas.width / 2,

      y: canvas.height / 2,
    };

    /* =============================================
       ENTER / SPACE

       Start or stop drawing
    ============================================= */

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (keyboardDrawingId === id) {
        setKeyboardDrawingId(null);
      } else {
        /*
          Save one history state
          when keyboard stroke begins.
        */

        saveHistory(id);

        configureContext(context);

        setKeyboardDrawingId(id);
      }

      return;
    }

    /* =============================================
       ESCAPE
    ============================================= */

    if (event.key === "Escape") {
      event.preventDefault();

      setKeyboardDrawingId(null);

      return;
    }

    /* =============================================
       ARROWS
    ============================================= */

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

    const distance = event.shiftKey ? 15 : 5;

    const [horizontal, vertical] = directions[event.key];

    const next = {
      x: Math.min(
        canvas.width,
        Math.max(0, position.x + horizontal * distance),
      ),

      y: Math.min(canvas.height, Math.max(0, position.y + vertical * distance)),
    };

    /* =============================================
       DRAW ONLY WHEN ACTIVE
    ============================================= */

    if (keyboardDrawingId === id) {
      configureContext(context);

      context.beginPath();

      context.moveTo(position.x, position.y);

      context.lineTo(next.x, next.y);

      context.stroke();
    }

    /* =============================================
       UPDATE CURSOR
    ============================================= */

    keyboardPositions.current[id] = next;

    setKeyboardCursorPositions((prev) => ({
      ...prev,

      [id]: next,
    }));
  };

  /* =====================================================
     PREVIOUS
  ===================================================== */

  const goPrevious = () => {
    if (currentIndex === 0) {
      return;
    }

    setKeyboardDrawingId(null);

    setFocusedCanvasId(null);

    setCurrentIndex((prev) => prev - 1);
  };

  /* =====================================================
     NEXT
  ===================================================== */

  const goNext = () => {
    if (currentIndex === questions.length - 1) {
      return;
    }

    setKeyboardDrawingId(null);

    setFocusedCanvasId(null);

    setCurrentIndex((prev) => prev + 1);
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="writing-page1-ex-wrapper">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="writing-page1-ex-header">
        <img
          src={gifSrc}
          alt="Animated squirrel"
          className="writing-page1-ex-squirrel"
        />

        <header className="header-title-page8 writing-page1-ex-title">
          Trace each number word carefully, then use Next to continue through
          all three pages.
        </header>
      </div>

      {/* =================================================
          PAGE COUNTER
      ================================================= */}

      <div className="writing-page1-ex-page-number" aria-live="polite">
        Page {currentIndex + 1}/{questions.length}
      </div>

      {/* =================================================
          TOOLS
      ================================================= */}

      <div className="unit4-q2-p6-tools writing-page1-ex-tools">
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

        <button type="button" onClick={undo} className="unit4-q2-p6-tool-btn">
          Undo
        </button>

        <button
          type="button"
          onClick={clearCurrentPage}
          className="unit4-q2-p6-tool-btn"
        >
          Clear
        </button>
      </div>

      {/* =================================================
          CANVAS PAGES

          Important:
          Render ALL three canvases.
          Only hide inactive ones.

          This preserves every page's strokes.
      ================================================= */}

      <div className="writing-page1-ex-canvas-area">
        {questions.map((question, index) => {
          const isActive = index === currentIndex;

          const cursorPosition = keyboardCursorPositions[question.id];

          const keyboardFocused = focusedCanvasId === question.id && isActive;

          const keyboardDrawing = keyboardDrawingId === question.id && isActive;

          const canvas = canvasRefs.current[question.id];

          const cursorLeft =
            canvas && cursorPosition
              ? `${(cursorPosition.x / canvas.width) * 100}%`
              : "50%";

          const cursorTop =
            canvas && cursorPosition
              ? `${(cursorPosition.y / canvas.height) * 100}%`
              : "50%";

          return (
            <div
              key={question.id}
              className={`writing-page1-ex-canvas-wrapper ${
                isActive ? "active" : "hidden-page"
              }`}
              aria-hidden={!isActive}
            >
              <canvas
                ref={(element) => {
                  canvasRefs.current[question.id] = element;
                }}
                width={600}
                height={600}
                tabIndex={isActive ? 0 : -1}
                role="application"
                aria-label={`${question.label}. Use arrow keys to move the drawing cursor. Press Enter or Space to start or stop drawing. Hold Shift with an arrow key to move faster. Press Escape to stop drawing.`}
                className={`writing-page1-ex-canvas ${
                  keyboardDrawing ? "keyboard-drawing-active" : ""
                }`}
                style={{
                  backgroundImage: `url(${question.img})`,

                  cursor:
                    tool === "eraser"
                      ? `url(${eraserCursor}) 12 12, auto`
                      : `url(${pencilCursor}) 4 28, auto`,
                }}
                onFocus={() => handleCanvasFocus(question.id)}
                onBlur={() => handleCanvasBlur(question.id)}
                onKeyDown={(event) => handleCanvasKeyDown(event, question.id)}
                onPointerDown={(event) => startDrawing(event, question.id)}
                onPointerMove={(event) => draw(event, question.id)}
                onPointerUp={() => stopDrawing(question.id)}
                onPointerCancel={() => stopDrawing(question.id)}
                onPointerLeave={() => stopDrawing(question.id)}
              />

              {/* =========================================
                    KEYBOARD CURSOR
                ========================================= */}

              {keyboardFocused && (
                <div
                  aria-hidden="true"
                  className={`writing-page1-ex-keyboard-cursor ${
                    keyboardDrawing ? "drawing" : "moving"
                  }`}
                  style={{
                    left: cursorLeft,

                    top: cursorTop,
                  }}
                >
                  <span className="writing-page1-ex-cursor-center" />

                  <span className="writing-page1-ex-cursor-status">
                    {keyboardDrawing
                      ? tool === "eraser"
                        ? "Erasing"
                        : "Drawing"
                      : "Move"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="action-buttons-container writing-page1-ex-navigation">
        <button
          type="button"
          className="show-answer-btn swal-continue"
          disabled={currentIndex === 0}
          onClick={goPrevious}
        >
          Previous
        </button>

        <button
          type="button"
          className="show-answer-btn swal-continue"
          disabled={currentIndex === questions.length - 1}
          onClick={goNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Writing_Page1_EX;
