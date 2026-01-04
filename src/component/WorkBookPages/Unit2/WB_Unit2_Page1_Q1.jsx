import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/U1 WB/U2/U2P9EXEA.svg"
const WB_Unit2_Page1_Q1 = () => {

useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.src = img;

  image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
}, []);

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

  const image = new Image();
  image.src = img;
  image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
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
            <span className="ex-A">A</span> Read and trace.
          </h5>
        </div>

        <canvas
          ref={canvasRef}
          height={500}
          width={600}
          className="draw-canvas-wb-u2-q1"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="action-buttons-container">
        <button onClick={resetCanvas} className="try-again-button">
          Clear Drawings ↻
        </button>
      </div>
    </div>
  );
};

export default WB_Unit2_Page1_Q1;
