import React, { useState } from "react";
import conversation from "../../../assets/unit4/imgs/U4P36EXEA-01.svg";
import conversation2 from "../../../assets/unit4/imgs/U4P36EXEA-02.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review4_Page1_Q1.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Review4_Page1_Q1 = () => {
  const clickableAreas = [
    { x: 73, y: 10.5, w: 24.8, h: 11 },
    { x: 72, y: 52.5, w: 25.8, h: 11 },
    { x: 45, y: 52.5, w: 13.8, h: 11 },
  ];

  const correctAnswers = ["blue", "red", "is this"];
  const wordBank = ["red", "blue", "is this"];

  const [inputs, setInputs] = useState(Array(clickableAreas.length).fill(null));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false); // ⭐ NEW — يمنع التعديل بعد Show Answer
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { draggableId, destination } = result;
    const value = draggableId.replace("word-", "");

    if (!destination.droppableId.startsWith("drop-")) return;

    const index = Number(destination.droppableId.replace("drop-", ""));

    setInputs((prev) => {
      const copy = [...prev];

      // شيل الكلمة من أي مكان قديم
      const oldIndex = copy.findIndex((v) => v === value);
      if (oldIndex !== -1) copy[oldIndex] = null;

      copy[index] = value;
      return copy;
    });

    setWrongInputs([]);
  };

  const handleCheck = () => {
    if (locked) return; // ⭐ NEW — قفل الإدخال
    if (inputs.some((v) => v === null)) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    const results = inputs.map(
      (value, index) =>
        value?.toLowerCase() === correctAnswers[index].toLowerCase(),
    );

    const wrong = results
      .map((r, i) => (r ? null : i))
      .filter((v) => v !== null);

    setWrongInputs(wrong);

    const correctCount = results.filter((r) => r === true).length;
    const wrongCount = results.length - correctCount;

    let color =
      correctCount === results.length
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score:${correctCount}/${results.length}
      </span>
    </div>
  `;

    if (correctCount === results.length) {
      ValidationAlert.success(scoreMessage);
    } else if (wrongCount === results.length) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    setLocked(true); // ⭐ NEW — بعد الفحص يمنع الكتابة
  };

  const handleReset = () => {
    setInputs(Array(clickableAreas.length).fill(null));
    setWrongInputs([]);
    setLocked(false);
  };

  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    setInputs(correctAnswers);
    setWrongInputs([]);
    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            position: "relative",
            width: "60%",
          }}
        >
          <h5 className="header-title-page8" id="ex-d">
            A Look, read, and write.
          </h5>
          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  justifyContent: "center",
                  justifyItems: "center",
                  width: "100%",
                }}
              >
                {wordBank.map((word, i) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={i}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "6px 12px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
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

          <div
            style={{
              position: "relative",
              width: "100%",
              marginTop: "30px",
              maxWidth: "900px",
              aspectRatio: "3 / 1",
            }}
          >
            <img
              src={conversation}
              style={{
                inset: 0,
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />
            <img
              src={conversation2}
              style={{
                inset: 0,
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />

            {clickableAreas.map((area, index) => (
              <>
                <Droppable droppableId={`drop-${index}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        position: "absolute",
                        top: `${area.y}%`,
                        left: `${area.x}%`,
                        width: `${area.w}%`,
                        height: `${area.h}%`,
                        fontSize: "1.3vw",
                        borderBottom: "2px solid black",
                        background: snapshot.isDraggingOver
                          ? "#e3f2fd"
                          : "transparent",
                      }}
                      className={`${
                        snapshot.isDraggingOver ? "drag-over-cell" : ""
                      }`}
                    >
                      {inputs[index] || ""}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {wrongInputs.includes(index) && (
                  <div
                    className="wrong-icon-review4-p1-q1"
                    style={{
                      position: "absolute",
                      top: `calc(${area.y}% - 1.5%)`,
                      left: `calc(${area.x}% + ${area.w}% - 4%)`,
                      color: "white",
                    }}
                  >
                    ✕
                  </div>
                )}
              </>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ NEW BUTTON */}
          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button onClick={handleCheck} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review4_Page1_Q1;
