import React, { useState, useRef } from "react";

import cake from "../../../assets/U1 WB/U2/U2P10EXED.svg";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import ExerciseHeader from "../../ExerciseHeader";

const WB_Unit2_Page2_Q2 = () => {
  const [answer, setAnswer] = useState("");

  const [tool, setTool] = useState("pen"); // pen | eraser

  const [penColor, setPenColor] = useState("#ff0000");

  const canvasRef = useRef(null);

  const historyRef = useRef([]);

  /* =====================================================
     KEYBOARD DRAWING
  ===================================================== */

  const [canvasFocused, setCanvasFocused] = useState(false);

  const [keyboardDrawing, setKeyboardDrawing] = useState(false);

  const [keyboardCursor, setKeyboardCursor] = useState({
    x: 250,
    y: 75,
  });

  const keyboardStep = 8;

  /* =====================================================
     GET POINTER POSITION
  ===================================================== */

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;

    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,

      y: (e.clientY - rect.top) * scaleY,
    };
  };

  /* =====================================================
     SAVE CANVAS STATE
  ===================================================== */

  const saveCanvasState = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    historyRef.current.push(canvas.toDataURL());

    if (historyRef.current.length > 30) {
      historyRef.current.shift();
    }
  };

  /* =====================================================
     CONFIGURE TOOL
  ===================================================== */

  const configureContext = (ctx) => {
    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";

      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";

      ctx.lineWidth = 3;

      ctx.strokeStyle = penColor;
    }
  };

  /* =====================================================
     START DRAWING - MOUSE / TOUCH
  ===================================================== */

  const startDrawing = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    saveCanvasState();

    const { x, y } = getPos(e, canvas);

    canvas.setPointerCapture?.(e.pointerId);

    ctx.isDrawing = true;

    configureContext(ctx);

    ctx.beginPath();

    ctx.moveTo(x, y);
  };

  /* =====================================================
     DRAW - MOUSE / TOUCH
  ===================================================== */

  const draw = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx.isDrawing) return;

    const { x, y } = getPos(e, canvas);

    ctx.lineTo(x, y);

    ctx.stroke();
  };

  /* =====================================================
     STOP DRAWING - MOUSE / TOUCH
  ===================================================== */

  const stopDrawing = (e) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx.isDrawing) return;

    ctx.isDrawing = false;

    ctx.closePath();

    if (e?.pointerId !== undefined) {
      try {
        canvas.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  /* =====================================================
     DRAW KEYBOARD SEGMENT
  ===================================================== */

  const drawKeyboardSegment = (from, to) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    configureContext(ctx);

    ctx.beginPath();

    ctx.moveTo(from.x, from.y);

    ctx.lineTo(to.x, to.y);

    ctx.stroke();

    ctx.closePath();
  };

  /* =====================================================
     KEYBOARD DRAWING
  ===================================================== */

  const handleCanvasKeyDown = (e) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    /* =========================
       START / STOP DRAWING
    ========================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      if (!keyboardDrawing) {
        /*
          نخزن الحالة مرة واحدة
          ببداية الـstroke
        */

        saveCanvasState();

        setKeyboardDrawing(true);
      } else {
        setKeyboardDrawing(false);
      }

      return;
    }

    /* =========================
       ESCAPE
    ========================= */

    if (e.key === "Escape") {
      if (keyboardDrawing) {
        e.preventDefault();

        e.stopPropagation();

        setKeyboardDrawing(false);
      }

      return;
    }

    /* =========================
       ARROWS
    ========================= */

    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    if (!arrowKeys.includes(e.key)) {
      return;
    }

    e.preventDefault();

    e.stopPropagation();

    /*
      Shift + Arrow أسرع
    */

    const step = e.shiftKey ? 18 : keyboardStep;

    const oldPosition = keyboardCursor;

    let newX = oldPosition.x;

    let newY = oldPosition.y;

    if (e.key === "ArrowLeft") {
      newX -= step;
    }

    if (e.key === "ArrowRight") {
      newX += step;
    }

    if (e.key === "ArrowUp") {
      newY -= step;
    }

    if (e.key === "ArrowDown") {
      newY += step;
    }

    /*
      منع المؤشر من الخروج
      عن حدود الـCanvas
    */

    newX = Math.max(0, Math.min(canvas.width, newX));

    newY = Math.max(0, Math.min(canvas.height, newY));

    const newPosition = {
      x: newX,
      y: newY,
    };

    /*
      إذا وضع الرسم شغال:
      ارسم من النقطة القديمة للجديدة
    */

    if (keyboardDrawing) {
      drawKeyboardSegment(oldPosition, newPosition);
    }

    setKeyboardCursor(newPosition);
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const undoCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (historyRef.current.length === 0) return;

    const lastState = historyRef.current.pop();

    const image = new Image();

    image.onload = () => {
      ctx.globalCompositeOperation = "source-over";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    image.src = lastState;

    setKeyboardDrawing(false);
  };

  /* =====================================================
     CLEAR DRAWING
  ===================================================== */

  const clearCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "source-over";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    historyRef.current = [];

    setKeyboardDrawing(false);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setAnswer("");

    setTool("pen");

    setPenColor("#ff0000");

    setKeyboardDrawing(false);

    setKeyboardCursor({
      x: 250,
      y: 75,
    });

    clearCanvas();
  };

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
          sectionLetter="D"
          title="How old are you? Write and draw candles on the cake."
          subTitle="Type your age, then draw that many candles on the cake."
        />

        {/* =========================
            AGE INPUT
        ========================= */}

        <div
          style={{
            display: "flex",

            width: "100%",

            alignItems: "center",

            gap: "10px",
          }}
        >
          <label
            htmlFor="age-input"
            style={{
              position: "absolute",

              width: "1px",

              height: "1px",

              overflow: "hidden",

              clip: "rect(0, 0, 0, 0)",

              whiteSpace: "nowrap",
            }}
          >
            Your age
          </label>

          <input
            id="age-input"
            type="text"
            value={answer}
            className="answer-input33-review10-p1-q3"
            onChange={(e) => setAnswer(e.target.value)}
            aria-label="Type your age"
          />
        </div>

        {/* =========================
            DRAWING TOOLS
        ========================= */}

        <div className="unit4-q2-p6-tools w-full">
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

          <button
            type="button"
            onClick={undoCanvas}
            className="unit4-q2-p6-tool-btn"
          >
            ↶ Undo
          </button>

          <label
            className="unit4-q2-p6-tool-btn"
            style={{
              display: "inline-flex",

              alignItems: "center",

              gap: "6px",

              cursor: "pointer",
            }}
          >
            🎨 Color
            <input
              type="color"
              value={penColor}
              onChange={(e) => {
                setPenColor(e.target.value);

                setTool("pen");
              }}
              aria-label="Choose pen color"
              style={{
                width: "26px",

                height: "26px",

                padding: 0,

                border: "none",

                background: "transparent",

                cursor: "pointer",
              }}
            />
          </label>

          <button
            type="button"
            onClick={clearCanvas}
            className="unit4-q2-p6-tool-btn"
          >
            🗑️ Clear
          </button>
        </div>

        {/* =========================
            CANVAS
        ========================= */}

        <div
          style={{
            display: "flex",

            justifyContent: "center",

            alignContent: "center",

            position: "relative",

            width: "100%",
          }}
        >
          <canvas
            ref={canvasRef}
            height={150}
            width={500}
            className="draw-canvas-wb-unit2-p2-q2 w-full"
            /* =========================
               KEYBOARD ACCESSIBILITY
            ========================= */

            tabIndex={0}
            role="application"
            aria-label={
              keyboardDrawing
                ? `Cake drawing area. Keyboard drawing is active using the ${tool}. Use the arrow keys to draw candles. Press Enter or Space to stop drawing.`
                : `Cake drawing area. Use arrow keys to move the drawing cursor. Press Enter or Space to start drawing with the ${tool}.`
            }
            onFocus={() => {
              setCanvasFocused(true);
            }}
            onBlur={() => {
              setCanvasFocused(false);

              setKeyboardDrawing(false);
            }}
            onKeyDown={handleCanvasKeyDown}
            /* =========================
               CURRENT STYLE
            ========================= */

            style={{
              backgroundImage: `url(${cake})`,

              backgroundRepeat: "no-repeat",

              backgroundSize: "contain",

              backgroundPosition: "center",

              touchAction: "none",

              cursor:
                tool === "eraser"
                  ? `url(${eraserCursor}) 12 12, auto`
                  : `url(${pencilCursor}) 4 28, auto`,
            }}
            /* =========================
               MOUSE / TOUCH
            ========================= */

            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
          />

          {/* =========================
              KEYBOARD CURSOR
          ========================= */}

          {canvasFocused && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",

                left: `${(keyboardCursor.x / 500) * 100}%`,

                top: `${(keyboardCursor.y / 150) * 100}%`,

                transform: "translate(-50%, -50%)",

                width: keyboardDrawing ? "12px" : "10px",

                height: keyboardDrawing ? "12px" : "10px",

                borderRadius: "50%",

                background: tool === "eraser" ? "white" : penColor,

                border: keyboardDrawing
                  ? "3px solid #2563eb"
                  : "2px solid #2563eb",

                boxShadow: "0 0 0 1px white",

                pointerEvents: "none",

                zIndex: 20,
              }}
            />
          )}
        </div>

        {/* =========================
            SCREEN READER STATUS
        ========================= */}

        <div
          aria-live="polite"
          style={{
            position: "absolute",

            width: "1px",

            height: "1px",

            overflow: "hidden",

            clip: "rect(0, 0, 0, 0)",

            whiteSpace: "nowrap",
          }}
        >
          {keyboardDrawing
            ? `Keyboard drawing started with ${tool}. Use arrow keys to draw.`
            : "Keyboard drawing stopped."}
        </div>
      </div>

      {/* =========================
          START AGAIN
      ========================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
      </div>
    </div>
  );
};

export default WB_Unit2_Page2_Q2;
