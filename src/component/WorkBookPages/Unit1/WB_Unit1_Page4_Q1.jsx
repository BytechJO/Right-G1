import React, { useState } from "react";
import img1 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-01.svg";
import img2 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-03.svg";
import img3 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-02.svg";
import img4 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./WB_Unit1_Page4_Q1.css";

export default function WB_Unit1_Page4_Q1() {
  const data = [
    { img: img1, answer: "Goodbye!" },
    { img: img2, answer: "Good morning!" },
    { img: img3, answer: "Good afternoon!" },
    { img: img4, answer: "Hello! I'm Stella." },
  ];

  const [inputs, setInputs] = useState(["", "", "", ""]);
  const [wrong, setWrong] = useState([false, false, false, false]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [locked, setLocked] = useState(false);

  
  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;
    const newIndex = Number(destination.droppableId.replace("blank-", ""));

    const draggedWord = draggableId.split("-").slice(1, -1).join("-");

    const newInputs = [...inputs];

    // ⭐⭐ إذا الكلمة مستخدمة بمكان ثاني → امسحيها
    newInputs.forEach((val, i) => {
      if (val === draggedWord) {
        newInputs[i] = "";
      }
    });

    // ⭐⭐ حطيها بالمكان الجديد
    newInputs[newIndex] = draggedWord;

    setInputs(newInputs);
    setWrong([false, false, false, false]);
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    if (inputs.some((v) => v.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
      return;
    }

    let correct = 0;
    const wrongStatus = inputs.map((v, i) => {
      const ok = v.trim().toLowerCase() === data[i].answer.toLowerCase();
      if (ok) correct++;
      return !ok;
    });

    setWrong(wrongStatus);
    setLocked(true)
    let total = data.length;
    let color = correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const reset = () => {
    setInputs(["", "", "", ""]);
    setWrong([false, false, false, false]);
    setShowAnswer(false);
    setLocked(false)
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper" style={{ padding: "30px" }}>
        <div className="div-forall" style={{ width: "60%" }}>
          {/* العنوان */}
          <h3 className="header-title-page8">
            <span className="ex-A">C</span> Read, look, and write.
          </h3>
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
                          margin: "10px 0",
                          alignItems:"center",justifyContent:"center"
                        }}
              >
                {data.map((item, i) => (
                  <Draggable
                    key={`bank-${item.answer}-${i}`}
                    draggableId={`bank-${item.answer}-${i}`}
                    index={i}
                    isDragDisabled={showAnswer ||locked}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                                  padding: "2px 5px",
                                  border: "2px solid #2c5287",
                                  borderRadius: "8px",
                                  background: "white",
                                  fontWeight: "bold",
                                  cursor: "grab",
                                  ...provided.draggableProps.style,
                                }}
                      >
                        {item.answer}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="question-container-wb-u1-p4-q1">
            {/* الأسئلة */}
            {data.map((item, i) => (
              <div key={i} className="question-row-wb-u1-q4">
                <div className="img-box-wb-u1-q4" style={{ display: "flex" }}>
                  <span
                    style={{
                      color: "darkblue",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {i + 1}
                  </span>{" "}
                  <img className="img-wb-unit1-p4-q1" src={item.img} alt="" />
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Droppable droppableId={`blank-${i}`}>
                      {(provided, snapshot) => (
                        <input
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`missing-input-wb-unit1-p3-q1 ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            width: "100%",
                            height: "40px",
                            borderBottom: "2px solid black",
                            fontSize: "20px",
                            fontWeight: "600",
                          }}
                          value={showAnswer ? item.answer : inputs[i]}
                          readOnly
                          disabled={showAnswer || locked}
                        />
                      )}
                    </Droppable>

                    {!showAnswer && wrong[i] && (
                      <div className="wrong-icon-wb-u1-p4-q1">✕</div>
                    )}
                  </div>{" "}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* الأزرار */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            className="show-answer-btn swal-continue"
            onClick={() => setShowAnswer(true)}
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
}
