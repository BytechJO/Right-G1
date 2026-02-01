import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./WB_Unit4_Page4_Q1.css";
const WrongIcon = () => (
  <div
    style={{
      position: "absolute",
      top: -12,
      right: -12,
      width: 22,
      height: 22,
      borderRadius: "50%",
      backgroundColor: "red",
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid white",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    }}
  >
    ✕
  </div>
);

const WORDS = ["triangle", "circle", "square", "rectangle"];

const WB_Unit4_Page4_Q1 = () => {
  const [labels, setLabels] = useState({
    triangle: "",
    circle1: "",
    circle2: "",
    house: "",
    door: "",
  });

  const [colors, setColors] = useState({
    triangle: "#ffffff",
    circle1: "#ffffff",
    circle2: "#ffffff",
    house: "#ffffff",
    door: "#ffffff",
  });

  const [checked, setChecked] = useState(false);
  const [activeShape, setActiveShape] = useState(null);
  const [showPalette, setShowPalette] = useState(false);

  const BASIC_COLORS = [
    "#ff0000",
    "#0000ff",
    "#ffff00",
    "#00aa00",
    "#ffa200ff",
  ];

  /* ================== Drag & Drop ================== */
  const onDragEnd = (result) => {
    if (!result.destination || checked) return;

    const { draggableId, destination } = result;

    if (!destination.droppableId.startsWith("shape-")) return;

    const shapeKey = destination.droppableId.replace("shape-", "");
    const word = draggableId.replace("word-", "");

    setLabels((prev) => {
      const updated = { ...prev };

      updated[shapeKey] = word;
      return updated;
    });
  };

  /* ================== Color ================== */
  const openColorPicker = (shape) => {
    if (checked) return;
    setActiveShape(shape);
    setShowPalette(true);
  };

  const selectColor = (color) => {
    setColors((prev) => ({ ...prev, [activeShape]: color }));
    setShowPalette(false);
  };

  /* ================== Check ================== */
  const checkAnswer = () => {
    if (
      !labels.triangle ||
      !labels.circle1 ||
      !labels.circle2 ||
      !labels.house ||
      !labels.door
    ) {
      ValidationAlert.info("Please label all the shapes.");
      return;
    }

    let score = 0;
    if (labels.triangle === "triangle") score++;
    if (labels.circle1 === "circle") score++;
    if (labels.circle2 === "circle") score++;
    if (["square", "rectangle"].includes(labels.house)) score++;
    if (["square", "rectangle"].includes(labels.door)) score++;

    setChecked(true);

    const total = 5;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === total ? "success" : score === 0 ? "error" : "warning"
    ](`
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `);
  };
  const isCorrect = (shape) => {
    if (!checked) return null;

    switch (shape) {
      case "triangle":
        return labels.triangle === "triangle";
      case "circle1":
      case "circle2":
        return labels[shape] === "circle";
      case "house":
      case "door":
        return ["square", "rectangle"].includes(labels[shape]);
      default:
        return null;
    }
  };

  const reset = () => {
    setLabels({
      triangle: "",
      circle1: "",
      circle2: "",
      house: "",
      door: "",
    });
    setColors({
      triangle: "#ffffff",
      circle1: "#ffffff",
      circle2: "#ffffff",
      house: "#ffffff",
      door: "#ffffff",
    });
    setChecked(false);
  };

  const showAnswers = () => {
    setLabels({
      triangle: "triangle",
      circle1: "circle",
      circle2: "circle",
      house: "square",
      door: "square",
    });
    setColors({
      triangle: "blue",
      circle1: "red",
      circle2: "red",
      house: "#ffff00",
      door: "green",
    });
    setChecked(true);
  };

  /* ================== UI ================== */
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          padding: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="div-forall" style={{ width: "60%" }}>
          <h5 className="header-title-page8">
            <span className="ex-A">G</span> Look and label the shapes. Then
            color.
          </h5>

          {/* ===== Word Bank ===== */}
          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {WORDS.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={checked}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "7px 14px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {word}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* ===== SVG ===== */}
          <div
            style={{
              position: "relative",
              width: 300,
              height: 350,
              left: "20vw",
            }}
          >
            <svg
              width="300"
              height="350"
              className="all-svg-house-wb-unit4-p4-q1"
            >
              {/* Triangle */}
              <polygon
                points="150,20 50,120 250,120"
                fill={colors.triangle}
                stroke="black"
                onDoubleClick={() => openColorPicker("triangle")}
              />

              {/* House */}
              <rect
                x="50"
                y="120"
                width="200"
                height="180"
                fill={colors.house}
                stroke="black"
                onDoubleClick={() => openColorPicker("house")}
              />

              {/* Circles */}
              <circle
                cx="100"
                cy="170"
                r="30"
                fill={colors.circle1}
                stroke="black"
                onDoubleClick={() => openColorPicker("circle1")}
              />
              <circle
                cx="200"
                cy="170"
                r="30"
                fill={colors.circle2}
                stroke="black"
                onDoubleClick={() => openColorPicker("circle2")}
              />

              {/* Door */}
              <rect
                x="110"
                y="230"
                width="70"
                height="70"
                fill={colors.door}
                stroke="black"
                onDoubleClick={() => openColorPicker("door")}
              />
            </svg>
            <div
              style={{ position: "absolute", top: 120, left: 90, width: 120 }}
            >
              <Droppable droppableId="shape-triangle" isDropDisabled={checked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`drop-label-box ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #999",
                      borderRadius: 6,
                      position: "relative",
                      /* ✨ الأنيميشن */
                      backgroundColor: snapshot.isDraggingOver
                        ? "#e3f2fd"
                        : "#fff",
                      transform: snapshot.isDraggingOver
                        ? "scale(1.05)"
                        : "scale(1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {labels.triangle && <span>{labels.triangle}</span>}{" "}
                    {/* ❌ Wrong answer */}
                    {checked &&
                      labels.triangle &&
                      isCorrect("triangle") === false && <WrongIcon />}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div
              style={{ position: "absolute", top: 305, left: 90, width: 120 }}
            >
              <Droppable droppableId="shape-house" isDropDisabled={checked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`drop-label-box ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #999",
                      borderRadius: 6,
                      position: "relative",
                      /* ✨ الأنيميشن */
                      backgroundColor: snapshot.isDraggingOver
                        ? "#e3f2fd"
                        : "#fff",
                      transform: snapshot.isDraggingOver
                        ? "scale(1.05)"
                        : "scale(1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {labels.house && <span>{labels.house}</span>}
                    {/* ❌ Wrong answer */}
                    {checked &&
                      labels.triangle &&
                      isCorrect("triangle") === false && <WrongIcon />}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div
              style={{ position: "absolute", top: 240, left: 185, width: 80 }}
            >
              <Droppable droppableId="shape-circle1" isDropDisabled={checked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`drop-label-box ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #999",
                      borderRadius: 6,
                      position: "relative",
                      /* ✨ الأنيميشن */
                      backgroundColor: snapshot.isDraggingOver
                        ? "#e3f2fd"
                        : "#fff",
                      transform: snapshot.isDraggingOver
                        ? "scale(1.05)"
                        : "scale(1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {labels.circle1 && <span>{labels.circle1}</span>}
                    {/* ❌ Wrong answer */}
                    {checked &&
                      labels.triangle &&
                      isCorrect("circle1") === false && <WrongIcon />}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div
              style={{ position: "absolute", top: 240, left: 35, width: 80 }}
            >
              <Droppable droppableId="shape-circle2" isDropDisabled={checked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`drop-label-box ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #999",
                      borderRadius: 6,
                      position: "relative",
                      /* ✨ الأنيميشن */
                      backgroundColor: snapshot.isDraggingOver
                        ? "#e3f2fd"
                        : "#fff",
                      transform: snapshot.isDraggingOver
                        ? "scale(1.05)"
                        : "scale(1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {labels.circle2 && <span>{labels.circle2}</span>}
                    {/* ❌ Wrong answer */}
                    {checked &&
                      labels.triangle &&
                      isCorrect("circle2") === false && <WrongIcon />}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: -60,
                left: 92,
                width: 100,
              }}
            >
              <Droppable droppableId="shape-door" isDropDisabled={checked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`drop-label-box ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #999",
                      borderRadius: 6,
                      position: "relative",
                      /* ✨ الأنيميشن */
                      backgroundColor: snapshot.isDraggingOver
                        ? "#e3f2fd"
                        : "#fff",
                      transform: snapshot.isDraggingOver
                        ? "scale(1.05)"
                        : "scale(1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {labels.door && <span>{labels.door}</span>}
                    {/* ❌ Wrong answer */}
                    {checked &&
                      labels.triangle &&
                      isCorrect("door") === false && <WrongIcon />}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
          {showPalette && (
            <div className="color-palette-wb-u1-p7-q1">
              {BASIC_COLORS.map((c) => (
                <div
                  key={c}
                  className="color-circle"
                  style={{ backgroundColor: c }}
                  onClick={() => selectColor(c)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>
          <button className="show-answer-btn" onClick={showAnswers}>
            Show Answer
          </button>
          <button className="check-button2" onClick={checkAnswer}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit4_Page4_Q1;
