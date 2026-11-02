import { useRef, useState } from "react";
import "./WB_Unit10_Page3_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit10Audio from "./useUnit10Audio";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import bookImg from "../../../assets/U1 WB/U10/U10P59EXEF-01.svg";
import bookImg2 from "../../../assets/U1 WB/U10/U10P59EXEF-02.svg";
import bookImg3 from "../../../assets/U1 WB/U10/U10P59EXEF-03.svg";
import bookImg4 from "../../../assets/U1 WB/U10/U10P59EXEF-04.svg";
import chickenAudio from "../../../assets/U1 WB/U10/audio/page59- F/Item_001_I_want_chicken.mp3";
import breadAudio from "../../../assets/U1 WB/U10/audio/page59- F/Item_002_I_want_bread.mp3";
import appleAudio from "../../../assets/U1 WB/U10/audio/page59- F/Item_003_I_want_an_apple.mp3";
import sweetAudio from "../../../assets/U1 WB/U10/audio/page59- F/Item_004_want_a_sweet.mp3";
import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

const QUESTIONS = [
  {
    id: 1,
    text: "I want chicken.",
    img: bookImg,
    audio: chickenAudio,
    alt: "A girl with an empty thought bubble for drawing chicken.",
  },
  {
    id: 2,
    text: "I want bread.",
    img: bookImg2,
    audio: breadAudio,
    alt: "A boy with an empty thought bubble for drawing bread.",
  },
  {
    id: 3,
    text: "I want a sweet.",
    img: bookImg3,
    audio: sweetAudio,
    alt: "A boy with an empty thought bubble for drawing a sweet.",
  },
  {
    id: 4,
    text: "I want an apple.",
    img: bookImg4,
    audio: appleAudio,
    alt: "A girl with an empty thought bubble for drawing an apple.",
  },
];

export default function WB_Unit10_Page3_Q2() {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#800080");
  const [activeCanvasId, setActiveCanvasId] = useState(null);
  const [, setHistoryVersion] = useState(0);
  const canvasRefs = useRef({});
  const historyRef = useRef([]);
  const cursorRef = useRef({});
  const keyboardDrawingRef = useRef({});
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();
  const [focusedCanvasId, setFocusedCanvasId] = useState(null);
  const [cursorPositions, setCursorPositions] = useState({});
  const saveHistory = (id) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;
    historyRef.current.push({
      id,
      image: canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height),
    });
    setHistoryVersion((value) => value + 1);
  };

  const configure = (context) => {
    context.lineCap = "round";
    context.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";
    context.lineWidth = tool === "eraser" ? 20 : 3;
    context.strokeStyle = color;
  };

  const pointFromEvent = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const point = event.touches?.[0] || event;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const startDrawing = (event, id) => {
    event.preventDefault();
    const canvas = canvasRefs.current[id];
    const context = canvas.getContext("2d");
    saveHistory(id);
    configure(context);
    context.isDrawing = true;
    const point = pointFromEvent(event, canvas);
    context.lastX = point.x;
    context.lastY = point.y;
    setActiveCanvasId(id);
  };

  const draw = (event, id) => {
    const canvas = canvasRefs.current[id];
    const context = canvas.getContext("2d");
    if (!context.isDrawing) return;
    event.preventDefault();
    const point = pointFromEvent(event, canvas);
    context.beginPath();
    context.moveTo(context.lastX, context.lastY);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.lastX = point.x;
    context.lastY = point.y;
  };

  const stopDrawing = (id) => {
    const canvas = canvasRefs.current[id];
    if (canvas) canvas.getContext("2d").isDrawing = false;
    setActiveCanvasId((current) => (current === id ? null : current));
  };

  const handleCanvasKeyDown = (event, id) => {
    const canvas = canvasRefs.current[id];
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const step = event.shiftKey ? 10 : 3;

    const cursor = cursorRef.current[id] || {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      keyboardDrawingRef.current[id] = !keyboardDrawingRef.current[id];

      if (keyboardDrawingRef.current[id]) saveHistory(id);

      setActiveCanvasId(keyboardDrawingRef.current[id] ? id : null);

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      keyboardDrawingRef.current[id] = false;
      setActiveCanvasId(null);
      return;
    }

    const movement = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }[event.key];

    if (!movement) return;

    event.preventDefault();

    const next = {
      x: Math.max(0, Math.min(canvas.width, cursor.x + movement[0])),
      y: Math.max(0, Math.min(canvas.height, cursor.y + movement[1])),
    };

    if (keyboardDrawingRef.current[id]) {
      configure(context);

      context.beginPath();
      context.moveTo(cursor.x, cursor.y);
      context.lineTo(next.x, next.y);
      context.stroke();
    }

    cursorRef.current[id] = next;

    // Update visible cursor position
    setCursorPositions((prev) => ({
      ...prev,
      [id]: next,
    }));
  };

  const undo = () => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    canvasRefs.current[previous.id]
      ?.getContext("2d")
      .putImageData(previous.image, 0, 0);
    setHistoryVersion((value) => value + 1);
  };

  const clearCanvases = () => {
    QUESTIONS.forEach((question) => {
      const canvas = canvasRefs.current[question.id];
      if (canvas)
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    });
    historyRef.current = [];
    keyboardDrawingRef.current = {};
    cursorRef.current = {};
    setActiveCanvasId(null);
    stopAudio();
    setHistoryVersion((value) => value + 1);
  };

  return (
    <div
      className="unit4-q2-p6-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <div className="div-forall" style={{ gap: 30 }}>
        <ExerciseHeader
          sectionLetter="F"
          title="Read and draw."
          subTitle="Draw the food item each person wants."
        />
        <div className="unit4-q2-p6-tools w-full">
          <button
            onClick={() => setTool("pen")}
            aria-pressed={tool === "pen"}
            className={`unit4-q2-p6-tool-btn ${tool === "pen" ? "active-tool" : ""}`}
          >
            ✏️ Pen
          </button>
          <button
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
          <button onClick={undo} className="unit4-q2-p6-tool-btn">
            Undo
          </button>
        </div>
        <div className="wb-unit5-p4-q1-table w-full">
          {QUESTIONS.map((question) => (
            <div key={question.id} className="wb-unit5-p4-q1-row">
              <div className="wb-unit5-p4-q1-text">
                <span style={{ color: "darkblue", fontWeight: 700 }}>
                  {question.id}
                </span>{" "}
                <span
                  className="wb-unit10-audio-control"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play audio: ${question.text}`}
                  onClick={() =>
                    playAudio(`sentence-${question.id}`, question.audio)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      playAudio(`sentence-${question.id}`, question.audio);
                    }
                  }}
                >
                  {activeAudioKey === `sentence-${question.id}` && (
                    <Unit10PlayingAudioIcon />
                  )}
                  {question.text}
                </span>
              </div>
              <div
                className={`wb-unit10-p3-q2-drawing-area ${
                  activeCanvasId === question.id ? "is-drawing" : ""
                }`}
              >
                <canvas
                  ref={(element) => {
                    canvasRefs.current[question.id] = element;
                  }}
                  width={270}
                  height={190}
                  className="wb-unit10-p3-q2-canvas"
                  tabIndex={0}
                  role="application"
                  aria-label={`${question.alt} Use arrow keys to move the drawing cursor. Press Enter or Space to start or stop drawing. Shift plus an arrow moves faster. Escape stops drawing.`}
                  style={{
                    backgroundImage: `url(${question.img})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    touchAction: "none",
                    cursor:
                      tool === "eraser"
                        ? `url(${eraserCursor}) 12 12, auto`
                        : `url(${pencilCursor}) 4 28, auto`,
                  }}
                  onFocus={() => {
                    const canvas = canvasRefs.current[question.id];

                    const cursor = cursorRef.current[question.id] || {
                      x: canvas.width / 2,
                      y: canvas.height / 2,
                    };

                    cursorRef.current[question.id] = cursor;

                    setCursorPositions((prev) => ({
                      ...prev,
                      [question.id]: cursor,
                    }));

                    setFocusedCanvasId(question.id);
                  }}
                  onPointerDown={(event) => {
                    setFocusedCanvasId(null);
                    startDrawing(event, question.id);
                  }}
                  onPointerMove={(event) => draw(event, question.id)}
                  onPointerUp={() => stopDrawing(question.id)}
                  onPointerCancel={() => stopDrawing(question.id)}
                  onPointerLeave={() => stopDrawing(question.id)}
                  onKeyDown={(event) => handleCanvasKeyDown(event, question.id)}
                  onBlur={() => {
                    keyboardDrawingRef.current[question.id] = false;
                    setFocusedCanvasId(null);
                    stopDrawing(question.id);
                  }}
                />

                {focusedCanvasId === question.id && (
                  <span
                    className={`wb-unit10-p3-q2-keyboard-cursor ${
                      activeCanvasId === question.id ? "drawing" : ""
                    }`}
                    style={{
                      left: `${
                        ((cursorPositions[question.id]?.x ?? 135) / 270) * 100
                      }%`,
                      top: `${
                        ((cursorPositions[question.id]?.y ?? 95) / 190) * 100
                      }%`,
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={clearCanvases} className="try-again-button">
          Clear Drawings ↻
        </button>
      </div>
    </div>
  );
}
