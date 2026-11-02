import React, { useRef, useState } from "react";
import "./WB_Unit9_Page2_Q1.css";
import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import horsesSentenceAudio from "../../../assets/U1 WB/U9/audio/page52- C/item-001-how-many-horses-are-there.mp3";
import cowsSentenceAudio from "../../../assets/U1 WB/U9/audio/page52- C/item-002-how-many-cowes-are-there.mp3";
import goatsSentenceAudio from "../../../assets/U1 WB/U9/audio/page52- C/item-003-how-many-goats-are-there.mp3";

const sentences = [
  "How many horses are there? There are two horses.",
  "How many cows are there? There are four cows.",
  "How many goats are there? There is one goat.",
];
const sentenceAudios = [
  horsesSentenceAudio,
  cowsSentenceAudio,
  goatsSentenceAudio,
];

const WB_Unit9_Page2_Q1 = () => {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#800080");
  const [keyboardDrawing, setKeyboardDrawing] = useState(null);
  const [focusedCanvas, setFocusedCanvas] = useState(null);
  const [cursorPositions, setCursorPositions] = useState({});
  const canvasRefs = useRef([]);
  const history = useRef([]);
  const keyboardPositions = useRef({});
  const { activeAudioKey, playAudio } = useUnit9Audio();

  const configureContext = (context) => {
    context.lineCap = "round";
    if (tool === "eraser") {
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = 20;
    } else {
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = color;
      context.lineWidth = 3;
    }
  };

  const saveHistory = (index) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    history.current.push([
      {
        index,
        imageData: canvas
          .getContext("2d")
          .getImageData(0, 0, canvas.width, canvas.height),
      },
    ]);
  };

  const pointerPosition = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (event, index) => {
    event.preventDefault();
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    canvas.setPointerCapture?.(event.pointerId);
    const context = canvas.getContext("2d");
    saveHistory(index);
    configureContext(context);
    context.isDrawing = true;
    const point = pointerPosition(event, canvas);
    context.lastX = point.x;
    context.lastY = point.y;
  };

  const draw = (event, index) => {
    const canvas = canvasRefs.current[index];
    const context = canvas?.getContext("2d");
    if (!context?.isDrawing) return;
    event.preventDefault();
    const point = pointerPosition(event, canvas);
    context.beginPath();
    context.moveTo(context.lastX, context.lastY);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.lastX = point.x;
    context.lastY = point.y;
  };

  const stopDrawing = (index) => {
    const context = canvasRefs.current[index]?.getContext("2d");
    if (context) context.isDrawing = false;
  };

  const undo = () => {
    const action = history.current.pop();
    action?.forEach(({ index, imageData }) => {
      const canvas = canvasRefs.current[index];
      if (!canvas) return;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(imageData, 0, 0);
    });
  };

  const clearCanvases = (save = true) => {
    const action = canvasRefs.current.filter(Boolean).map((canvas, index) => ({
      index,
      imageData: canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height),
    }));
    if (save && action.length) history.current.push(action);
    canvasRefs.current.forEach((canvas) =>
      canvas?.getContext("2d").clearRect(0, 0, canvas.width, canvas.height),
    );
    setKeyboardDrawing(null);
  };

  const initializeCursor = (index) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    const position = keyboardPositions.current[index] || {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };
    keyboardPositions.current[index] = position;
    setCursorPositions((current) => ({ ...current, [index]: position }));
  };

  const handleCanvasKeyDown = (event, index) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const position = keyboardPositions.current[index] || {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (keyboardDrawing === index) setKeyboardDrawing(null);
      else {
        saveHistory(index);
        configureContext(context);
        setKeyboardDrawing(index);
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setKeyboardDrawing(null);
      return;
    }
    const directions = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (!directions[event.key]) return;
    event.preventDefault();
    const distance = event.shiftKey ? 12 : 4;
    const [xDirection, yDirection] = directions[event.key];
    const next = {
      x: Math.min(
        canvas.width,
        Math.max(0, position.x + xDirection * distance),
      ),
      y: Math.min(
        canvas.height,
        Math.max(0, position.y + yDirection * distance),
      ),
    };
    if (keyboardDrawing === index) {
      configureContext(context);
      context.beginPath();
      context.moveTo(position.x, position.y);
      context.lineTo(next.x, next.y);
      context.stroke();
    }
    keyboardPositions.current[index] = next;
    setCursorPositions((current) => ({ ...current, [index]: next }));
  };

  const reset = () => {
    clearCanvases(false);
    history.current = [];
    keyboardPositions.current = {};
    setCursorPositions({});
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
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="C"
          title="Read and draw."
          subTitle="Read each sentence and draw exactly the stated number of animals."
        />
        <div className="unit4-q2-p6-tools w-full">
          <button
            type="button"
            onClick={() => setTool("pen")}
            aria-pressed={tool === "pen"}
            className={`unit4-q2-p6-tool-btn ${tool === "pen" ? "active-tool" : ""}`}
          >
            ✏️ Pen
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            aria-pressed={tool === "eraser"}
            className={`unit4-q2-p6-tool-btn ${tool === "eraser" ? "active-tool" : ""}`}
          >
            🧽 Eraser
          </button>

          <label
            className="unit4-q2-p6-tool-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            🎨 Color
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);

                setTool("pen");
              }}
              aria-label="Choose pen color"
              style={{
                width: "26px",
                height: "26px",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            />
          </label>
          <button type="button" onClick={undo} className="unit4-q2-p6-tool-btn">
            Undo
          </button>
          <button
            type="button"
            onClick={() => clearCanvases(true)}
            className="unit4-q2-p6-tool-btn"
          >
            Clear
          </button>
        </div>
        <div className="exercise-container-wb-unit6-p5-q1 w-full">
          {sentences.map((sentence, index) => {
            const position = cursorPositions[index];
            const canvas = canvasRefs.current[index];
            return (
              <div key={sentence} className="row-container-wb-unit6-p5-q1">
                <div
                  className="sentence-area-wb-unit9-p2-q1 wb-unit9-audio-control"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play sentence ${index + 1}`}
                  onClick={() =>
                    playAudio(`sentence-${index}`, sentenceAudios[index])
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      playAudio(`sentence-${index}`, sentenceAudios[index]);
                    }
                  }}
                >
                  {activeAudioKey === `sentence-${index}` && (
                    <Unit9PlayingAudioIcon />
                  )}
                  <span className="number-wb-unit6-p5-q1">{index + 1}</span>
                  <span className="text">{sentence}</span>
                </div>
                <div className="wb-unit9-p2-q1-canvas-wrapper">
                  <canvas
                    ref={(element) => {
                      canvasRefs.current[index] = element;
                    }}
                    className={`draw-box-wb-unit9-p2-q1 ${keyboardDrawing === index ? "keyboard-drawing-active" : ""}`}
                    height={120}
                    width={300}
                    tabIndex={0}
                    role="application"
                    aria-label={`Drawing area ${index + 1}. Arrow keys move the drawing cursor. Enter or Space starts or stops drawing. Shift plus an arrow moves faster. Escape stops drawing.`}
                    style={{
                      cursor:
                        tool === "eraser"
                          ? `url(${eraserCursor}) 12 12, auto`
                          : `url(${pencilCursor}) 4 28, auto`,
                    }}
                    onFocus={() => {
                      setFocusedCanvas(index);
                      initializeCursor(index);
                    }}
                    onBlur={() => {
                      stopDrawing(index);
                      setFocusedCanvas(null);
                      setKeyboardDrawing(null);
                    }}
                    onKeyDown={(event) => handleCanvasKeyDown(event, index)}
                    onPointerDown={(event) => startDrawing(event, index)}
                    onPointerMove={(event) => draw(event, index)}
                    onPointerUp={() => stopDrawing(index)}
                    onPointerCancel={() => stopDrawing(index)}
                    onPointerLeave={() => stopDrawing(index)}
                  />
                  {focusedCanvas === index && position && (
                    <span
                      className={`wb-unit9-p2-q1-keyboard-cursor ${keyboardDrawing === index ? "drawing" : "moving"}`}
                      style={{
                        left: canvas
                          ? `${(position.x / canvas.width) * 100}%`
                          : "50%",
                        top: canvas
                          ? `${(position.y / canvas.height) * 100}%`
                          : "50%",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="action-buttons-container">
        <button type="button" className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
      </div>
    </div>
  );
};

export default WB_Unit9_Page2_Q1;
