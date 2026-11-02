import React, { useRef, useState } from "react";
import "./Unit3_Page6_Q3.css";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

const Unit3_Page6_Q3 = () => {
  const questions = [
    { id: 1, text: "One", target: 1 },
    { id: 2, text: "Two", target: 2 },
    { id: 3, text: "Three", target: 3 },
    { id: 4, text: "Four", target: 4 },
    { id: 5, text: "Five", target: 5 },
  ];

  const [tool, setTool] = useState("pen");

  // عدد الدوائر المضافة بالكيبورد لكل سطر
  const [keyboardCircles, setKeyboardCircles] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  // هل صار تفاعل مع كل سطر

  const canvasRefs = useRef({});
  const historyRef = useRef([]);

  /* =====================================================
     SAVE HISTORY
  ===================================================== */

  const saveCanvasState = (id) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;

    historyRef.current.push({
      id,
      imageData: canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height),
      keyboardCount: keyboardCircles[id],
    });
  };

  /* =====================================================
     DRAW
  ===================================================== */

  const startDrawing = (e, id) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;

    saveCanvasState(id);

    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.isDrawing = true;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 3;
    }

    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;

    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    if (clientX == null || clientY == null) return;

    ctx.lastX = (clientX - rect.left) * (canvas.width / rect.width);

    ctx.lastY = (clientY - rect.top) * (canvas.height / rect.height);
  };

  const draw = (e, id) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx.isDrawing) return;

    e.preventDefault();

    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;

    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    if (clientX == null || clientY == null) return;

    const x = (clientX - rect.left) * (canvas.width / rect.width);

    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(ctx.lastX, ctx.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.lastX = x;
    ctx.lastY = y;
  };

  const stopDrawing = (id) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;

    canvas.getContext("2d").isDrawing = false;
  };

  /* =====================================================
     KEYBOARD CIRCLE
  ===================================================== */

  const drawKeyboardCircle = (id) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;

    const currentCount = keyboardCircles[id] || 0;

    const question = questions.find((q) => q.id === id);

    if (!question) return;

    // ما نضيف أكثر من المطلوب بالكيبورد
    if (currentCount >= question.target) {
      return;
    }

    saveCanvasState(id);

    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 3;

    const radius = 18;
    const spacing = 55;

    const x = 40 + currentCount * spacing;
    const y = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    setKeyboardCircles((prev) => ({
      ...prev,
      [id]: currentCount + 1,
    }));
  };

  /* =====================================================
     CANVAS KEYBOARD
  ===================================================== */

  const handleCanvasKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      drawKeyboardCircle(id);

      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();

      undoLastForRow(id);
    }
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const undo = () => {
    const last = historyRef.current.pop();

    if (!last) return;

    const canvas = canvasRefs.current[last.id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.putImageData(last.imageData, 0, 0);

    setKeyboardCircles((prev) => ({
      ...prev,
      [last.id]: last.keyboardCount,
    }));
  };

  const undoLastForRow = (id) => {
    let foundIndex = -1;

    for (let i = historyRef.current.length - 1; i >= 0; i--) {
      if (historyRef.current[i].id === id) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex === -1) return;

    const state = historyRef.current[foundIndex];

    historyRef.current.splice(foundIndex, 1);

    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.putImageData(state.imageData, 0, 0);

    setKeyboardCircles((prev) => ({
      ...prev,
      [id]: state.keyboardCount,
    }));
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const resetCanvas = () => {
    Object.values(canvasRefs.current).forEach((canvas) => {
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    setKeyboardCircles({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    });

    historyRef.current = [];
  };

  /* =====================================================
     DONE
     بدون تقييم شكل الرسم
  ===================================================== */

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div
      className="unit3-q6-container"
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
          sectionLetter="F"
          title="Read and draw circles."
          subTitle="Read each number, then draw exactly that many circles."
        />
        {/* =========================
            TOOLS
        ========================= */}

        <div className="unit4-q2-p6-tools w-full">
          <button
            type="button"
            onClick={() => setTool("pen")}
            className={`unit4-q2-p6-tool-btn ${
              tool === "pen" ? "active-tool" : ""
            }`}
            aria-pressed={tool === "pen"}
            aria-label="Select pen tool"
          >
            <span aria-hidden="true">✏️</span> Pen
          </button>

          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`unit4-q2-p6-tool-btn ${
              tool === "eraser" ? "active-tool" : ""
            }`}
            aria-pressed={tool === "eraser"}
            aria-label="Select eraser tool"
          >
            <span aria-hidden="true">🧽</span> Eraser
          </button>

          <button
            type="button"
            onClick={undo}
            className="unit4-q2-p6-tool-btn"
            aria-label="Undo last drawing action"
          >
            Undo ↶
          </button>
        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="unit3-q6-table w-full">
          {questions.map((q) => (
            <div key={q.id} className="unit3-q6-row">
              <div className="unit3-q6-text">
                <span
                  style={{
                    color: "darkblue",
                    fontWeight: "700",
                  }}
                >
                  {q.id}
                </span>

                {q.text}
              </div>

              <canvas
                ref={(el) => {
                  canvasRefs.current[q.id] = el;
                }}
                width={500}
                height={80}
                className="unit3-q6-canvas"
                tabIndex={0}
                role="application"
                aria-label={`${q.text}. Draw ${q.target} ${
                  q.target === 1 ? "circle" : "circles"
                }. Press Enter or Space to add a circle. Press Backspace or Delete to undo the last keyboard circle.`}
                style={{
                  cursor:
                    tool === "eraser"
                      ? `url(${eraserCursor}) 12 12, auto`
                      : `url(${pencilCursor}) 4 28, auto`,
                }}
                onKeyDown={(e) => handleCanvasKeyDown(e, q.id)}
                onMouseDown={(e) => startDrawing(e, q.id)}
                onMouseMove={(e) => draw(e, q.id)}
                onMouseUp={() => stopDrawing(q.id)}
                onMouseLeave={() => stopDrawing(q.id)}
                onTouchStart={(e) => startDrawing(e, q.id)}
                onTouchMove={(e) => draw(e, q.id)}
                onTouchEnd={() => stopDrawing(q.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          ACTION BUTTONS
      ========================= */}

      <div className="action-buttons-container">
        <button onClick={resetCanvas} className="try-again-button">
          Clear Drawings ↻
        </button>
      </div>
    </div>
  );
};

export default Unit3_Page6_Q3;
