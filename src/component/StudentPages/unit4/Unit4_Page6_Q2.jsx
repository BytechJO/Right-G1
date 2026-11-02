import React, { useRef, useState } from "react";
import "./Unit4_Page6_Q2.css";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import ExerciseHeader from "../../ExerciseHeader";

const Unit4_Page6_Q2 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const questions = [
    {
      id: 1,
      text: "It’s a circle.",
      shape: "circle",
    },
    {
      id: 2,
      text: "It’s a square.",
      shape: "square",
    },
    {
      id: 3,
      text: "It’s a triangle.",
      shape: "triangle",
    },
  ];

  const shapeOptions = ["circle", "square", "triangle"];

  /* =====================================================
     STATE
  ===================================================== */

  const [tool, setTool] = useState("pen");

  const [keyboardShapes, setKeyboardShapes] = useState({});

  /*
    أي canvas فاتح عليه
    keyboard alternatives
  */
  const [openKeyboardOptions, setOpenKeyboardOptions] = useState(null);

  /* =====================================================
     REFS
  ===================================================== */

  const canvasRefs = useRef({});

  const optionRefs = useRef({});

  const drawingRef = useRef({
    drawing: false,
    canvasId: null,
    lastX: 0,
    lastY: 0,
  });

  const historyRef = useRef([]);

  /* =====================================================
     GET CANVAS POINT
  ===================================================== */

  const getCanvasPoint = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  /* =====================================================
     SAVE HISTORY
  ===================================================== */

  const saveCanvasHistory = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    historyRef.current.push({
      type: "canvas",
      id,
      imageData,
      keyboardShape: keyboardShapes[id] || null,
    });
  };

  /* =====================================================
     START DRAWING
  ===================================================== */

  const startDrawing = (e, id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    e.preventDefault();

    /*
      إذا رسم بالماوس/تتش:
      سكر keyboard options
    */
    setOpenKeyboardOptions(null);

    saveCanvasHistory(id);

    const ctx = canvas.getContext("2d");

    const { x, y } = getCanvasPoint(e, canvas);

    drawingRef.current = {
      drawing: true,
      canvasId: id,
      lastX: x,
      lastY: y,
    };

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 22;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 3;
    }

    /*
      manual drawing يلغي
      keyboard shape indicator
    */
    setKeyboardShapes((prev) => ({
      ...prev,
      [id]: null,
    }));

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  /* =====================================================
     DRAW
  ===================================================== */

  const draw = (e, id) => {
    const drawing = drawingRef.current;

    if (!drawing.drawing || drawing.canvasId !== id) {
      return;
    }

    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    e.preventDefault();

    const ctx = canvas.getContext("2d");

    const { x, y } = getCanvasPoint(e, canvas);

    ctx.beginPath();

    ctx.moveTo(drawing.lastX, drawing.lastY);

    ctx.lineTo(x, y);

    ctx.stroke();

    drawingRef.current.lastX = x;
    drawingRef.current.lastY = y;
  };

  /* =====================================================
     STOP DRAWING
  ===================================================== */

  const stopDrawing = (e, id) => {
    if (drawingRef.current.canvasId !== id) {
      return;
    }

    const canvas = canvasRefs.current[id];

    drawingRef.current = {
      drawing: false,
      canvasId: null,
      lastX: 0,
      lastY: 0,
    };

    if (canvas && e?.pointerId !== undefined) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  /* =====================================================
     DRAW SHAPE
     KEYBOARD ALTERNATIVE
  ===================================================== */

  const drawShape = (id, shape) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) {
      return;
    }

    saveCanvasHistory(id);

    const ctx = canvas.getContext("2d");

    /*
      الشكل الجاهز يستبدل
      الرسم الموجود في نفس البوكس
    */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";

    ctx.strokeStyle = "purple";

    ctx.lineWidth = 4;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    /* =========================
       CIRCLE
    ========================= */

    if (shape === "circle") {
      ctx.beginPath();

      ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);

      ctx.stroke();
    }

    /* =========================
       SQUARE
    ========================= */

    if (shape === "square") {
      const size = 62;

      ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size);
    }

    /* =========================
       TRIANGLE
    ========================= */

    if (shape === "triangle") {
      const size = 70;

      ctx.beginPath();

      ctx.moveTo(centerX, centerY - size / 2);

      ctx.lineTo(centerX - size / 2, centerY + size / 2);

      ctx.lineTo(centerX + size / 2, centerY + size / 2);

      ctx.closePath();

      ctx.stroke();
    }

    setKeyboardShapes((prev) => ({
      ...prev,
      [id]: shape,
    }));

    /*
      بعد الاختيار:
      سكر الخيارات
      ورجع focus للـcanvas
    */

    setOpenKeyboardOptions(null);

    requestAnimationFrame(() => {
      canvasRefs.current[id]?.focus();
    });
  };

  /* =====================================================
     OPEN KEYBOARD OPTIONS
  ===================================================== */

  const openOptionsForCanvas = (id) => {
    setOpenKeyboardOptions(id);

    requestAnimationFrame(() => {
      optionRefs.current[`${id}-circle`]?.focus();
    });
  };

  /* =====================================================
     CANVAS KEYBOARD
  ===================================================== */

  const handleCanvasKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      openOptionsForCanvas(id);

      return;
    }

    if (e.key === "Escape" && openKeyboardOptions === id) {
      e.preventDefault();

      setOpenKeyboardOptions(null);
    }
  };

  /* =====================================================
     SHAPE OPTION KEYBOARD
  ===================================================== */

  const handleShapeKeyDown = (e, id, shape, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      drawShape(id, shape);

      return;
    }

    /*
      Tab / Shift+Tab
      يلف بين الثلاث خيارات فقط
    */

    if (e.key === "Tab") {
      e.preventDefault();

      e.stopPropagation();

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = index === 0 ? shapeOptions.length - 1 : index - 1;
      } else {
        nextIndex = index === shapeOptions.length - 1 ? 0 : index + 1;
      }

      const nextShape = shapeOptions[nextIndex];

      optionRefs.current[`${id}-${nextShape}`]?.focus();

      return;
    }

    /*
      Escape:
      سكر الخيارات
      وارجع للـcanvas
    */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      setOpenKeyboardOptions(null);

      requestAnimationFrame(() => {
        canvasRefs.current[id]?.focus();
      });
    }
  };

  /* =====================================================
     CLEAR ONE CANVAS
  ===================================================== */

  const clearSingleCanvas = (id) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const undoLastAction = () => {
    const last = historyRef.current.pop();

    if (!last) {
      return;
    }

    if (last.type === "canvas") {
      const canvas = canvasRefs.current[last.id];

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.putImageData(last.imageData, 0, 0);

      setKeyboardShapes((prev) => ({
        ...prev,
        [last.id]: last.keyboardShape,
      }));
    }

    if (last.type === "all") {
      last.snapshots.forEach(({ id, imageData, keyboardShape }) => {
        const canvas = canvasRefs.current[id];

        if (!canvas) {
          return;
        }

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.putImageData(imageData, 0, 0);

        setKeyboardShapes((prev) => ({
          ...prev,
          [id]: keyboardShape,
        }));
      });
    }

    setOpenKeyboardOptions(null);
  };

  /* =====================================================
     CLEAR ALL
  ===================================================== */

  const resetCanvas = () => {
    const snapshots = [];

    questions.forEach((q) => {
      const canvas = canvasRefs.current[q.id];

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");

      snapshots.push({
        id: q.id,

        imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),

        keyboardShape: keyboardShapes[q.id] || null,
      });
    });

    if (snapshots.length) {
      historyRef.current.push({
        type: "all",
        snapshots,
      });
    }

    questions.forEach((q) => {
      clearSingleCanvas(q.id);
    });

    setKeyboardShapes({});

    setOpenKeyboardOptions(null);
  };

  /* =====================================================
     TOOL KEYBOARD
  ===================================================== */

  const handleToolKeyDown = (e, selectedTool) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      setTool(selectedTool);
    }
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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title="Read and draw."
          subTitle="Read the clue, then draw the correct circle, square, or triangle."
        />

        <div className="unit4-q2-p6-table w-full">
          {/* =================================================
              TOOLS
          ================================================= */}

          <div className="unit4-q2-p6-tools">
            <button
              type="button"
              onClick={() => setTool("pen")}
              onKeyDown={(e) => handleToolKeyDown(e, "pen")}
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
              onKeyDown={(e) => handleToolKeyDown(e, "eraser")}
              aria-pressed={tool === "eraser"}
              className={`unit4-q2-p6-tool-btn ${
                tool === "eraser" ? "active-tool" : ""
              }`}
            >
              🧽 Eraser
            </button>

            <button
              type="button"
              onClick={undoLastAction}
              className="unit4-q2-p6-tool-btn"
            >
              ↶ Undo
            </button>
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          {questions.map((q) => {
            const optionsOpen = openKeyboardOptions === q.id;

            return (
              <div key={q.id} className="unit4-q2-p6-row">
                {/* =========================
                    CLUE
                ========================= */}

                <div className="unit4-q2-p6-text">
                  <span
                    style={{
                      color: "darkblue",
                      fontWeight: "700",
                    }}
                  >
                    {q.id}
                  </span>{" "}
                  {q.text}
                </div>

                {/* =========================
                    CANVAS + KEYBOARD
                ========================= */}

                <div className="unit4-q2-p6-answer-area">
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[q.id] = el;
                    }}
                    width={270}
                    height={100}
                    className="unit4-q2-p6-canvas"
                    tabIndex={0}
                    role="button"
                    aria-label={`Drawing area for question ${q.id}. ${q.text} Draw with mouse, touch, or stylus. Keyboard users can press Enter to choose a shape.`}
                    aria-expanded={optionsOpen}
                    style={{
                      cursor:
                        tool === "eraser"
                          ? `url(${eraserCursor}) 12 12, auto`
                          : `url(${pencilCursor}) 4 28, auto`,
                    }}
                    onKeyDown={(e) => handleCanvasKeyDown(e, q.id)}
                    onPointerDown={(e) => startDrawing(e, q.id)}
                    onPointerMove={(e) => draw(e, q.id)}
                    onPointerUp={(e) => stopDrawing(e, q.id)}
                    onPointerCancel={(e) => stopDrawing(e, q.id)}
                    onLostPointerCapture={(e) => stopDrawing(e, q.id)}
                  />

                  {/* =========================
                      KEYBOARD OPTIONS
                      تظهر فقط بعد Enter
                  ========================= */}

                  {optionsOpen && (
                    <div
                      className="unit4-q2-p6-keyboard-options"
                      role="group"
                      aria-label={`Choose a shape for question ${q.id}`}
                    >
                      {shapeOptions.map((shape, index) => {
                        const selected = keyboardShapes[q.id] === shape;

                        return (
                          <button
                            type="button"
                            key={shape}
                            ref={(el) => {
                              optionRefs.current[`${q.id}-${shape}`] = el;
                            }}
                            className={`unit4-q2-p6-shape-btn ${
                              selected ? "selected-shape" : ""
                            }`}
                            aria-pressed={selected}
                            aria-label={`Draw a ${shape} for question ${q.id}`}
                            onClick={() => drawShape(q.id, shape)}
                            onKeyDown={(e) =>
                              handleShapeKeyDown(e, q.id, shape, index)
                            }
                          >
                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          CLEAR
      ================================================= */}

      <div className="action-buttons-container">
        <button
          type="button"
          onClick={resetCanvas}
          className="try-again-button"
        >
          Clear Drawings ↻
        </button>
      </div>
    </div>
  );
};

export default Unit4_Page6_Q2;
