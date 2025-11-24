import React, { useRef, useEffect } from "react";
import "./Unit4_Page6_Q2.css";

const Unit4_Page6_Q2 = () => {
  const questions = [
    { id: 1, text: "It’s a circle." },
    { id: 2, text: "t’s a square." },
    { id: 3, text: "It’s a triangle." },
  ];

  // نخزن Ref لكل Canvas
  const canvasRefs = useRef({});

  // دوال الرسم
  const startDrawing = (e, id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");

    ctx.isDrawing = true;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "purple";

    const rect = canvas.getBoundingClientRect();
    ctx.lastX = (e.clientX || e.touches[0].clientX) - rect.left;
    ctx.lastY = (e.clientY || e.touches[0].clientY) - rect.top;
  };

  const draw = (e, id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");
    if (!ctx.isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(ctx.lastX, ctx.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.lastX = x;
    ctx.lastY = y;
  };

  const stopDrawing = (id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");
    ctx.isDrawing = false;
  };

  // Reset Canvas
  const resetCanvas = () => {
    Object.values(canvasRefs.current).forEach((canvas) => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  };

  return (
    <div
      className="unit4-q2-p6-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="div-unit4-q2-p6-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span className="letter-of-Q">E</span>Read and draw.
        </h5>

        <div className="unit4-q2-p6-table">
          {questions.map((q) => (
            <div key={q.id} className="unit4-q2-p6-row ">
              <div className="unit4-q2-p6-text">
                <span style={{ color: "darkblue", fontWeight: "700" }}>
                  {q.id}
                </span>{" "}
                {q.text}
              </div>

              {/* Canvas Area */}
              <canvas
                ref={(el) => (canvasRefs.current[q.id] = el)}
                width={270}
                height={80}
                className="unit4-q2-p6-canvas"
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
      <div className="action-buttons-container">
        <button onClick={resetCanvas} className="try-again-button">
          Clear Drawings ↻
        </button>
      </div>
    </div>
  );
};

export default Unit4_Page6_Q2;
