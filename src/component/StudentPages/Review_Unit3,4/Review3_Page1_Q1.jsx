import React, { useState } from "react";
import deer from "../../../assets/unit4/imgs/U4P34EXEA-01.svg";
import duck from "../../../assets/unit4/imgs/U4P34EXEA-02.svg";
import taxi from "../../../assets/unit4/imgs/U4P34EXEA-03.svg";
import tiger from "../../../assets/unit4/imgs/U4P34EXEA-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review3_Page1_Q1.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Review3_Page1_Q1 = () => {
  const data = [
    { word: "Quiet!", src: deer, num: "3" },
    { word: "Close your book.", src: duck, num: "4" },
    { word: "Make a line.", src: taxi, num: "1" },
    { word: "Listen!", src: tiger, num: "2" },
  ];

  const [answers, setAnswers] = useState(Array(data.length).fill(null));
  const numberBank = ["1", "2", "3", "4"];
  const [wrongNumbers, setWrongNumbers] = useState(data.map(() => false));
  const [locked, setLocked] = useState(false); // ⭐ يمنع الإدخال بعد show answer
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { draggableId, destination } = result;
    const value = draggableId.replace("num-", "");

    // لازم يكون دروب على خانة
    if (!destination.droppableId.startsWith("drop-")) return;

    const index = Number(destination.droppableId.replace("drop-", ""));

    setAnswers((prev) => {
      const copy = [...prev];

      // شيل الرقم من أي مكان قديم
      const oldIndex = copy.findIndex((v) => v === value);
      if (oldIndex !== -1) copy[oldIndex] = null;

      copy[index] = value;
      return copy;
    });

    setWrongNumbers(data.map(() => false));
  };

  const checkAnswers = () => {
    if (locked) return;
    if (answers.some((v) => v === null)) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
      return;
    }

    const numberWrongs = answers.map((val, i) => val !== data[i].num);

    const correctNumbers = answers.filter(
      (val, i) => val === data[i].num,
    ).length;

    answers.forEach((a, i) => {
      if (a.number === data[i].num) correctNumbers++;
    });

    let totalPoints = data.length;
    let score = correctNumbers;

    setWrongNumbers(numberWrongs);

    let color =
      score === totalPoints ? "green" : score === 0 ? "red" : "orange";

    let scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">Score: ${score} / ${totalPoints}</span>
      </div>
    `;

    if (score === totalPoints) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setLocked(true); // ⭐ يمنع التعديل بعد check answer
  };

  // ⭐⭐⭐ NEW: Show Answer
  const showAnswer = () => {
    setAnswers(data.map((item) => item.num));
    setWrongNumbers(data.map(() => false));
    setLocked(true);
  };

  const reset = () => {
    setAnswers(Array(data.length).fill(null));
    setWrongNumbers(data.map(() => false));
    setLocked(false);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
          <h5 className="header-title-page8">A Look and number.</h5>

          <Droppable droppableId="number-bank" direction="horizontal">
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
                }}
              >
                {numberBank.map((num, i) => (
                  <Draggable
                    key={num}
                    draggableId={`num-${num}`}
                    index={i}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="missing-input"
                        style={{
                          padding: "2px 5px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
                          cursor: "grab",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {num}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* الصور */}
          <div className="exercise-image-div-review3-p1-q1">
            {data.map((item, index) => (
              <img
                key={index}
                src={item.src}
                className="exercise-image-review3-p1-q1"
              />
            ))}
          </div>

          {/* مربعات الإدخال */}
          <div className="exercise-container" style={{ marginTop: "20px" }}>
            {data.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  className="exercise-item-review3-p1-q1"
                  style={{ position: "relative" }}
                >
                  <Droppable droppableId={`drop-${index}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`number-input-review3-p1-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#e3f2fd"
                            : "white",
                          position: "relative",
                        }}
                      >
                        {answers[index] || ""}
                        {provided.placeholder}

                        {wrongNumbers[index] && (
                          <div className="error-circle">✕</div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>

                <span>{item.word}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review3_Page1_Q1;
