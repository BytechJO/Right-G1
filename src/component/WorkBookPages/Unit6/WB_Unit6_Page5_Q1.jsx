import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page5_Q1.css";

const WB_Unit6_Page5_Q1 = () => {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [checked, setChecked] = useState(false);

  const canvasRefs = useRef([]);

  /* ================= CANVAS SETUP ================= */

  useEffect(() => {
    canvasRefs.current.forEach((canvas) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
    });
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e, index) => {
    e.preventDefault();
    const canvas = canvasRefs.current[index];
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);

    ctx.isDrawing = true;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "purple";

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e, index) => {
    e.preventDefault();
    const canvas = canvasRefs.current[index];
    const ctx = canvas.getContext("2d");
    if (!ctx.isDrawing) return;

    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (index) => {
    const ctx = canvasRefs.current[index].getContext("2d");
    ctx.isDrawing = false;
    ctx.closePath();
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
          <span className="ex-A">I</span> What can you do? Write and draw.
        </h4>

        <div className="exercise-container-wb-unit6-p5-q1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="row-container-wb-unit6-p5-q1">
              {/* LEFT */}
              <div className="sentence-area-wb-unit6-p5-q1">
                <span className="number-wb-unit6-p5-q1">{i + 1}</span>
                <span className="text">I can</span>
                <input
                  type="text"
                  value={answers[i]}
                  disabled={checked}
                  onChange={(e) => {
                    const updated = [...answers];
                    updated[i] = e.target.value;
                    setAnswers(updated);
                  }}
                />
              </div>

              {/* RIGHT */}
              <canvas
              style={{width:"220px" ,height:"120px"}}
                ref={(el) => (canvasRefs.current[i] = el)}
                className="draw-box-wb-unit6-p5-q1"
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
        {/* <button className="check-button2" onClick={checkAnswer}>
          Check Answer ✓
        </button> */}
      </div>
    </div>
  );
};

export default WB_Unit6_Page5_Q1;
