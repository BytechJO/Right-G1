import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit9_Page2_Q1.css";

const WB_Unit9_Page2_Q1 = () => {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [checked, setChecked] = useState(false);

  const canvasRefs = useRef([]);

  /* ================= CANVAS SETUP ================= */

  // useEffect(() => {
  //   canvasRefs.current.forEach((canvas) => {
  //     if (!canvas) return;

  //     const ctx = canvas.getContext("2d");
  //     const rect = canvas.getBoundingClientRect();
  //     const dpr = window.devicePixelRatio || 1;

  //     canvas.width = rect.width * dpr;
  //     canvas.height = rect.height * dpr;

  //     ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 🔥 الحل
  //   });
  // }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const isDrawing = useRef([]);

  const startDrawing = (e, index) => {
    e.preventDefault();
    const canvas = canvasRefs.current[index];
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);

    isDrawing.current[index] = true;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "purple";

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e, index) => {
    e.preventDefault();
    if (!isDrawing.current[index]) return;

    const canvas = canvasRefs.current[index];
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (index) => {
    isDrawing.current[index] = false;
  };

  const resetCanvas = () => {
    canvasRefs.current.forEach((canvas) => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  };

  /* ================= CHECK ================= */

  const checkAnswer = () => {
    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please complete all sentences!");
      return;
    }

    setChecked(true);

    ValidationAlert.success(`
      <div style="font-size:20px;text-align:center;">
        <b style="color:green">Score: 3 / 3</b>
      </div>
    `);
  };

  const reset = () => {
    setAnswers(["", "", ""]);
    setChecked(false);
    resetCanvas();
  };

  /* ================= JSX ================= */

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
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h4 className="header-title-page8">
          <span className="ex-A">C</span> Read and draw.
        </h4>

        <div className="exercise-container-wb-unit6-p5-q1">
          {[
            "How many horses are there? There are two horses.",
            "How many cows are there? There are four cows.",
            "How many goats are there? There is one goat.",
          ].map((item, i) => (
            <div key={i} className="row-container-wb-unit6-p5-q1">
              {/* LEFT */}
              <div className="sentence-area-wb-unit9-p2-q1">
                <span className="number-wb-unit6-p5-q1">{i + 1}</span>
                <span className="text">{item}</span>
              </div>

              {/* RIGHT */}
              <canvas
                ref={(el) => (canvasRefs.current[i] = el)}
                className="draw-box-wb-unit9-p2-q1"
                height={120}
                width={300}
                onMouseDown={(e) => startDrawing(e, i)}
                onMouseMove={(e) => draw(e, i)}
                onMouseUp={() => stopDrawing(i)}
                onMouseLeave={() => stopDrawing(i)}
                onTouchStart={(e) => startDrawing(e, i)}
                onTouchMove={(e) => draw(e, i)}
                onTouchEnd={() => stopDrawing(i)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
      </div>
    </div>
  );
};

export default WB_Unit9_Page2_Q1;
