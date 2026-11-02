import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/U1 WB/U2/U2P9EXEA.svg";
import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

// عدلي المسارات حسب ملفات الصوت عندك
import happyBirthdaySound from "../../../assets/U1 WB/U2/page_9/Item_001_Happy_birthday,_Stella!.mp3";
import thankYouSound from "../../../assets/U1 WB/U2/page_9/Item_002_Thank_you.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const WB_Unit2_Page1_Q1 = () => {
  const [tool, setTool] = useState("pen");

  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const historyRef = useRef([]);
  const hasDrawnRef = useRef(false);
  const drawnPointsRef = useRef(0);

  /* =====================================================
     GET POSITION
  ===================================================== */

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  /* =====================================================
     SAVE STATE FOR UNDO
  ===================================================== */

  const saveCanvasState = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const snapshot = canvas.toDataURL();

    historyRef.current.push(snapshot);

    if (historyRef.current.length > 30) {
      historyRef.current.shift();
    }
  };

  /* =====================================================
     START DRAWING
  ===================================================== */

  const startDrawing = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    saveCanvasState();

    const { x, y } = getPos(e, canvas);

    canvas.setPointerCapture?.(e.pointerId);

    ctx.isDrawing = true;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 2;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  /* =====================================================
     DRAW
  ===================================================== */

  const draw = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx.isDrawing) return;

    const { x, y } = getPos(e, canvas);

    ctx.lineTo(x, y);
    ctx.stroke();

    hasDrawnRef.current = true;

    if (tool === "pen") {
      drawnPointsRef.current += 1;
    }
  };

  /* =====================================================
     STOP DRAWING
  ===================================================== */

  const stopDrawing = (e) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx.isDrawing) return;

    ctx.isDrawing = false;
    ctx.closePath();

    if (e?.pointerId !== undefined) {
      try {
        canvas.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const undoCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (historyRef.current.length === 0) return;

    const lastState = historyRef.current.pop();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const image = new Image();

    image.onload = () => {
      ctx.globalCompositeOperation = "source-over";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    image.src = lastState;
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    historyRef.current = [];

    hasDrawnRef.current = false;
    drawnPointsRef.current = 0;

    setTool("pen");
  };

  /* =====================================================
     AUDIO
  ===================================================== */

  const playSentenceAudio = (src) => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = src;

    audioRef.current.play();
  };

  /* =====================================================
     CHECK
  ===================================================== */

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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          title="Read and trace."
          subTitle="Trace the dotted sentences from left to right."
        />
        {/* Accessible text */}
        <div
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
          }}
        >
          Happy birthday, Stella! Thank you.
        </div>

        <audio ref={audioRef} />

        {/* =====================================================
            TOOLS
        ===================================================== */}

        <div className="unit4-q2-p6-tools w-full">
          <button
            onClick={() => setTool("pen")}
            className={`unit4-q2-p6-tool-btn ${
              tool === "pen" ? "active-tool" : ""
            }`}
          >
            ✏️ Pen
          </button>

          <button
            onClick={() => setTool("eraser")}
            className={`unit4-q2-p6-tool-btn ${
              tool === "eraser" ? "active-tool" : ""
            }`}
          >
            🧽 Eraser
          </button>

          <button onClick={undoCanvas} className="unit4-q2-p6-tool-btn">
            ↶ Undo
          </button>
        </div>

        {/* =====================================================
            CANVAS + AUDIO BUTTONS
        ===================================================== */}

        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <canvas
            ref={canvasRef}
            height={300}
            width={600}
            className="draw-canvas-wb-u2-q1 w-full"
            style={{
              backgroundImage: `url(${img})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",

              touchAction: "none",

              cursor:
                tool === "eraser"
                  ? `url(${eraserCursor}) 12 12, auto`
                  : `url(${pencilCursor}) 4 28, auto`,
            }}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
          />

          {/* =====================================================
              SOUND 1
              Happy birthday, Stella!
          ===================================================== */}

          <button
            type="button"
            onClick={() => playSentenceAudio(happyBirthdaySound)}
            aria-label="Play Happy birthday, Stella"
            style={{
              position: "absolute",
              top: "11%",
              left: "64%",

              width: "32px",
              height: "32px",

              borderRadius: "50%",
              border: "none",

              background: "white",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              cursor: "pointer",

              fontSize: "17px",

              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",

              zIndex: 20,
            }}
          >
            🔊
          </button>

          {/* =====================================================
              SOUND 2
              Thank you.
          ===================================================== */}

          <button
            type="button"
            onClick={() => playSentenceAudio(thankYouSound)}
            aria-label="Play Thank you"
            style={{
              position: "absolute",

              top: "69%",
              right: "2%",

              width: "32px",
              height: "32px",

              borderRadius: "50%",
              border: "none",

              background: "white",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              cursor: "pointer",

              fontSize: "17px",

              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",

              zIndex: 20,
            }}
          >
            🔊
          </button>
        </div>
      </div>

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="action-buttons-container">
        <button onClick={resetCanvas} className="try-again-button">
          Clear Drawings ↻
        </button>
      </div>
    </div>
  );
};

export default WB_Unit2_Page1_Q1;
