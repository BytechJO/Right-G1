import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import cake from "../../../assets/unit3/imgs3/cap.svg";
const WB_Unit2_Page2_Q2 = () => {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(true); // مؤقت حتى ما يكسر التحقق
  const [isCorrect, setIsCorrect] = useState(null);
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const rect = canvas.getBoundingClientRect();
  //   const dpr = window.devicePixelRatio || 1;

  //   canvas.width = rect.width * dpr;
  //   canvas.height = rect.height * dpr;

  //   const ctx = canvas.getContext("2d");
  //   ctx.scale(dpr, dpr);
  // }, []);

  const canvasRef = useRef(null);
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

  // 🖌️ Start Drawing
  const startDrawing = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const { x, y } = getPos(e, canvas);

    ctx.isDrawing = true;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "purple";

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // ✏️ Drawing
  const draw = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx.isDrawing) return;

    const { x, y } = getPos(e, canvas);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.isDrawing = false;
    ctx.closePath();
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const checkAnswer = () => {
    if (answer.trim() === "") {
      ValidationAlert.info("Please write an answer!");
      return;
    }

    setChecked(true);
    setIsCorrect(true);

    ValidationAlert.success(`
      <div style="font-size:20px;text-align:center;">
        <span style="color:green;font-weight:bold">
          Score: 1 / 1
        </span>
      </div>
    `);
  };

  const reset = () => {
    setAnswer("");
    setChecked(false);
    setIsCorrect(null);
    resetCanvas();
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
      <div  className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8">
            <span className="ex-A">D</span> How old are you? Write and draw
            candles on the cake. and draw.
          </h5>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            value={answer}
            className="answer-input33-review10-p1-q3"
            onChange={(e) => setAnswer(e.target.value)}
            disabled={checked}
          />

          <span>.</span>
        </div >
        
        <div  style={{position:"relative"}}className="canvas-wrapper-wb-unit2-q2">
           <img src={cake} style={{ height: "150px", width: "auto" }} />
          <canvas
            ref={canvasRef}
            height={150}
            width={500}
            className="draw-canvas-wb-unit2-p2-q2"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
         
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button className="check-button2" onClick={checkAnswer}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit2_Page2_Q2;
