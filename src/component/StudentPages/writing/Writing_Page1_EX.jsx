import React, { useState, useRef, useEffect } from "react";

import img1 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream13.jpg";
import img2 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream14.jpg";
import img3 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream15.jpg";

const Writing_Page1_EX = () => {
  const questions = [
    { id: 1, img: img1 },
    { id: 2, img: img2 },
    { id: 3, img: img3 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRefs = useRef({});

useEffect(() => {
  const q = questions[currentIndex];
  const canvas = canvasRefs.current[q.id];
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = q.img;

  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}, [currentIndex]);

  const startDrawing = (e, id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");

    ctx.isDrawing = true;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "red";

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    ctx.lastX = clientX - rect.left;
    ctx.lastY = clientY - rect.top;
  };

  const draw = (e, id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");
    if (!ctx.isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

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
    const q = questions[currentIndex];
    const canvas = canvasRefs.current[q.id];
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = q.img;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // padding: "30px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>
        Page {currentIndex + 1} / {questions.length}
      </div>

      <canvas
        ref={(el) => (canvasRefs.current[currentQuestion.id] = el)}
        width={600}
        height={600}
        // className="unit9-p3-q2-canvas"
        onMouseDown={(e) => startDrawing(e, currentQuestion.id)}
        onMouseMove={(e) => draw(e, currentQuestion.id)}
        onMouseUp={() => stopDrawing(currentQuestion.id)}
        onMouseLeave={() => stopDrawing(currentQuestion.id)}
        onTouchStart={(e) => startDrawing(e, currentQuestion.id)}
        onTouchMove={(e) => {
          e.preventDefault();
          draw(e, currentQuestion.id);
        }}
        onTouchEnd={() => stopDrawing(currentQuestion.id)}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          cursor:"crosshair"
        }}
      />

      <div
      className="action-buttons-container"
      >
        {currentIndex >0 &&
        <button  className="show-answer-btn swal-continue"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
        >
          Previous
        </button> 
        }
       

        <button className="try-again-button" onClick={resetCanvas}>Clear ↻</button>

        <button className="show-answer-btn swal-continue"
          disabled={currentIndex === questions.length - 1}
          onClick={() => setCurrentIndex((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Writing_Page1_EX;
