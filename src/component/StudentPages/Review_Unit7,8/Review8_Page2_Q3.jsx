import React, { useState } from "react";
import bat from "../../../assets/unit8/imgs/U8P73EXEF-01.svg";
import cap from "../../../assets/unit8/imgs/U8P73EXEF-02.svg";
import ant from "../../../assets/unit8/imgs/U8P73EXEF-03.svg";
import img3 from "../../../assets/unit8/imgs/U8P73EXEF-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Review8_Page2_Q3.css";

const Review8_Page2_Q3 = () => {
  const correctAnswers = ["sun", "sock", "zebra", "zipper"];
  const [answers, setAnswers] = useState([null, null, null, null]);

  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    const value = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      // منع تكرار الكلمة
      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = null;

      updated[index] = value;
      return updated;
    });

    setWrongInputs([]);
  };

  const handleChange = (value, index) => {
    if (showAnswer) return; // ❌ ممنوع التعديل أثناء Show Answer

    const newAnswers = [...answers];
    newAnswers[index] = value.toLowerCase();
    setAnswers(newAnswers);
    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (showAnswer) return; // ❌ ممنوع التعديل أثناء Show Answer

    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let correctCount = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        correctCount++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowAnswer(true);
    const total = correctAnswers.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowAnswer(false); // ⭐ NEW → يرجع الحالة لطبيعية
  };

  const handleShowAnswer = () => {
    setAnswers([...correctAnswers]); // ⭐ عرض الإجابات الصحيحة
    setWrongInputs([]);
    setShowAnswer(true); // ⭐ منع التعديل
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
          <h5 className="header-title-page8">F Look and write.</h5>
          <Droppable droppableId="bank" isDropDisabled={showAnswer}>
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
                {correctAnswers.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={showAnswer}
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
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            {/* 🔵 1 */}
            <div className="row2-review8-p1-q2">
              <span
                style={{
                  color: "#2c5287",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                1
              </span>
              <img src={bat} alt="" className="q-img-unit3-page6-q1" />

              <div className="input-wrapper-review8-p1-q2">
                <Droppable droppableId="slot-0" isDropDisabled={showAnswer}>
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
                          draggableId={`filled-${answers[0]}-0`}
                          index={0}
                          isDragDisabled={showAnswer}
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
                    </div>
                  )}
                </Droppable>

                {wrongInputs.includes(0) && (
                  <span className="error-mark-input-review8-p1-q2">✕</span>
                )}
              </div>
            </div>

            {/* 🔵 2 */}
            <div className="row2-review8-p1-q2">
              <span
                style={{
                  color: "#2c5287",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                2
              </span>
              <img src={cap} alt="" className="q-img-unit3-page6-q1" />

              <div className="input-wrapper-review8-p1-q2">
                <Droppable droppableId="slot-1" isDropDisabled={showAnswer}>
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
                          draggableId={`filled-${answers[1]}-1`}
                          index={0}
                          isDragDisabled={showAnswer}
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
                    </div>
                  )}
                </Droppable>

                {wrongInputs.includes(1) && (
                  <span className="error-mark-input-review8-p1-q2">✕</span>
                )}
              </div>
            </div>

            {/* 🔵 3 */}
            <div className="row2-review8-p1-q2">
              <span
                style={{
                  color: "#2c5287",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                3
              </span>
              <img src={ant} alt="" className="q-img-unit3-page6-q1" />

              <div className="input-wrapper-review8-p1-q2">
                <Droppable droppableId="slot-2" isDropDisabled={showAnswer}>
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
                          draggableId={`filled-${answers[2]}-2`}
                          index={0}
                          isDragDisabled={showAnswer}
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
                    </div>
                  )}
                </Droppable>

                {wrongInputs.includes(2) && (
                  <span className="error-mark-input-review8-p1-q2">✕</span>
                )}
              </div>
            </div>
            {/* 🔵 4 */}
            <div className="row2-review8-p1-q2">
              <span
                style={{
                  color: "#2c5287",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                4
              </span>
              <img src={img3} alt="" className="q-img-unit3-page6-q1" />

              <div className="input-wrapper-review8-p1-q2">
                <Droppable droppableId="slot-3" isDropDisabled={showAnswer}>
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
                          draggableId={`filled-${answers[3]}-3`}
                          index={0}
                          isDragDisabled={showAnswer}
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
                    </div>
                  )}
                </Droppable>

                {wrongInputs.includes(3) && (
                  <span className="error-mark-input-review8-p1-q2">✕</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ⭐ BUTTONS */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
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

export default Review8_Page2_Q3;
