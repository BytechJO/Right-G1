import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/unit6/imgs/U6P50EXEB-01.svg";
import cap from "../../../assets/unit6/imgs/U6P50EXEB-02.svg";
import ant from "../../../assets/unit6/imgs/U6P50EXEB-03.svg";
import dad from "../../../assets/unit6/imgs/U6P50EXEB-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q3.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const Unit6_Page5_Q3 = () => {
  const correctAnswers = ["fly a kite", "fish", "ride a bike", "climb a tree"];
  const words = ["climb a tree", "fly a kite", "fish", "ride a bike"];
  const [answers, setAnswers] = useState([null, null, null, null]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const value = draggableId.replace("word-", "").replace("filled-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      // منع التكرار
      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = null;

      updated[index] = value;
      return updated;
    });

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (locked) return;
    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];
    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        tempScore++;
      } else {
        wrong.push(i); // خزن رقم السؤال الغلط بدل الكلمة
      }
    });
    setWrongInputs(wrong);
setLocked(true)
    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${tempScore} / ${total}
      </span>
    </div>
  `;

    if (tempScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (tempScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  const showAnswers = () => {
    setAnswers(correctAnswers); // ضع كل الإجابات الصحيحة
    setWrongInputs([]); // اخفاء الأخطاء
    setLocked(true); // 🔒 قفل التعديل
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setLocked(false); // ⬅ مهم
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="question-wrapper-unit3-page6-q1"
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
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">B</span>Read, look, and write.
          </h5>
          <Droppable droppableId="bank" isDropDisabled>
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
                  alignItems: "center",justifyContent:"center"
                }}
              >
                {words.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
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
                        <strong style={{ marginRight: "6px" }}>
                          {index + 1}.
                        </strong>
                        {word}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div
            className="row-content10-unit3-page6-q1"
            style={{ alignItems: "flex-start" }}
          >
            <div className="row2-unit3-page6-q1">
              <img src={bat} alt="" className="q-img-unit6-page5-q3" />
              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <Droppable droppableId="slot-0">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-unit3-page6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[0] && (
                          <Draggable
                            draggableId={`filled-${answers[0]}`}
                            index={0}
                            isDragDisabled={locked}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[0]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                        { wrongInputs.includes(0) && (
                          <span className="error-mark-input">✕</span>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </span>
            </div>

            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <img src={cap} alt="" className="q-img-unit6-page5-q3" />
              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <Droppable droppableId="slot-1">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-unit3-page6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[1] && (
                          <Draggable
                            draggableId={`filled-${answers[1]}`}
                            index={0}
                            isDragDisabled={locked}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[1]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                        { wrongInputs.includes(1) && (
                          <span className="error-mark-input">✕</span>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </span>
            </div>

            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <img src={ant} alt="" className="q-img-unit6-page5-q3" />
              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <Droppable droppableId="slot-2">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-unit3-page6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[2] && (
                          <Draggable
                            draggableId={`filled-${answers[2]}`}
                            index={0}
                            isDragDisabled={locked}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[2]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                        {wrongInputs.includes(2) && (
                          <span className="error-mark-input">✕</span>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </span>
            </div>

            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <img src={dad} alt="" className="q-img-unit6-page5-q3" />
              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <Droppable droppableId="slot-3">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-unit3-page6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[3] && (
                          <Draggable
                            draggableId={`filled-${answers[3]}`}
                            index={0}
                            isDragDisabled={locked}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[3]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                        {wrongInputs.includes(3) && (
                          <span className="error-mark-input">✕</span>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            onClick={showAnswers}
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

export default Unit6_Page5_Q3;
