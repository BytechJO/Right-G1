import React, { useState, useRef, useEffect } from "react";

import img1 from "../../../assets/unit9/imgs/U9P81EXEE-01.svg";
import img2 from "../../../assets/unit9/imgs/U9P81EXEE-02.svg";
import "./Unit9_Page6_Q3.css";
const Unit9_Page6_Q3 = () => {
  const questions = [
    { id: 1, text: "I want chicken.", img: img2 },
    { id: 2, text: "I want bread.", img: img1 },
  ];

  // نخزن Ref لكل Canvas
  const canvasRefs = useRef({});

  useEffect(() => {
    questions.forEach((q) => {
      const canvas = canvasRefs.current[q.id];
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = q.img;

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    });
  }, []);

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

  const resetCanvas = () => {
    questions.forEach((q) => {
      const canvas = canvasRefs.current[q.id];
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.src = q.img;

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
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
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">E</span>Trace and color.
        </h5>

        <div className="wb-unit5-p4-q1-table">
          {questions.map((q) => (
            <div key={q.id} className="wb-unit5-p4-q1-row ">
              {/* Canvas Area */}
              <canvas
                ref={(el) => (canvasRefs.current[q.id] = el)}
                width={270}
                height={260}
                className="unit9-p3-q2-canvas"
                onMouseDown={(e) => startDrawing(e, q.id)}
                onMouseMove={(e) => draw(e, q.id)}
                onMouseUp={() => stopDrawing(q.id)}
                onMouseLeave={() => stopDrawing(q.id)}
                onTouchStart={(e) => startDrawing(e, q.id)}
                onTouchMove={(e) => {
                  e.preventDefault();
                  draw(e, q.id);
                }}
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

export default Unit9_Page6_Q3;
