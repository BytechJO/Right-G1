import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit8_Page2_Q1 = () => {
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
          // gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8" style={{alignItems:"baseline"}}> 
            <span className="ex-A">C</span> Draw a picture of yourself. Label the parts of your body. Use the words below.
          </h5>
        </div>

        <div className="word-bank-wb-u4-p5-q1">
          {["head", "nose", "leg", "eye", "arm"].map((w, i) => (
            <span
              key={i}
              className="word-box-wb-u1-p8-q2"
              style={{ position: "relative" }}
            >
              {w}
            </span>
          ))}
        </div>
        <canvas
          ref={canvasRef}
          className="draw-canvas"
          height={300}
          width={600}
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

export default WB_Unit8_Page2_Q1;
