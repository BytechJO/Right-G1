import React, { useState } from "react";
import bat from "../../../assets/unit3/imgs3/P26exeA1-01.svg";
import cap from "../../../assets/unit3/imgs3/P26exeA1-02.svg";
import ant from "../../../assets/unit3/imgs3/P26exeA1-03.svg";
import dad from "../../../assets/unit3/imgs3/P26exeA1-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Unit3_Page5_Q1.css";

const Unit3_Page5_Q1 = () => {
  const correctAnswers = ["bat", "cap", "ant", "dad"];
  const wordBank = ["bat", "cap", "ant", "dad"];

  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [checked, setChecked] = useState(false);

  // 🧲 Drag & Drop logic (يسمح بالتكرار)
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer || checked) return;

    if (destination.droppableId.startsWith("slot-")) {
      const index = Number(destination.droppableId.split("-")[1]);
      const word = draggableId.replace("bank-", "").replace(/^slot-.*?-/, "");

      const updated = [...answers];

      // 🔒 منع التكرار: شيل الكلمة من أي مكان سابق
      const oldIndex = updated.findIndex((a) => a === word);
      if (oldIndex !== -1) {
        updated[oldIndex] = "";
      }

      // حطها بالمكان الجديد
      updated[index] = word;

      setAnswers(updated);
      setWrongInputs([]);
    }
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    if (answers.some((ans) => ans === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let score = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) score++;
      else wrong.push(i);
    });

    setWrongInputs(wrong);
    setChecked(true);

    const total = correctAnswers.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === total ? "success" : score === 0 ? "error" : "warning"
    ](`
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `);
  };

  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setWrongInputs([]);
    setShowAnswer(true);
    setChecked(true);
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowAnswer(false);
    setChecked(false);
  };

  const images = [bat, cap, ant, dad];

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
            gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">A</span>
            <span style={{ color: "purple" }}>1</span> Look and write.
          </h5>

          {/* 🔤 Word Bank */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
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
                {wordBank.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`bank-${word}`}
                    index={index}
                    isDragDisabled={showAnswer || checked}
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

          <div className="row-content10-unit3-page6-q1">
            {answers.map((value, i) => (
              <div className="row2-unit3-page6-q1" key={i}>
                <div style={{ display: "flex", gap: "15px" }}>
                  <span className="num-span">{i + 1}</span>
                  <img
                    src={images[i]}
                    alt=""
                    className="q-img-unit3-page6-q1"
                  />
                </div>

                <span style={{ position: "relative", display: "flex" }}>
                  <div className="input-wrapper-unit3-page6-q1">
                    <Droppable droppableId={`slot-${i}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`q-input-unit3-page6-q1 ${
                            showAnswer ? "show-answer-red" : ""
                          }  ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                        >
                          {value && (
                            <Draggable
                              draggableId={`slot-${i}-${value}`}
                              index={0}
                              isDragDisabled={showAnswer || checked}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="word-item"
                                >
                                  {value}
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {wrongInputs.includes(i) && !showAnswer && (
                      <span className="error-mark-input">✕</span>
                    )}
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={handleShowAnswer} className="show-answer-btn">
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

export default Unit3_Page5_Q1;
