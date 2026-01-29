import React, { useState } from "react";
import pizza2 from "../../../assets/img_unit2/imgs/Pizza (2).jpg";
import boy from "../../../assets/img_unit2/imgs/boy 02.png";
import paint from "../../../assets/img_unit2/imgs/Paint.jpg";
import pincle from "../../../assets/img_unit2/imgs/Pencel.jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Unit2_Page10_Q4.css";

const Unit2_Page10_Q4 = () => {
  const correctAnswers = ["p", "b", "p", "p"];
  const wordBank = ["p", "b"];

  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [checked, setChecked] = useState(false);

  // 🧲 Drag & Drop logic (مع swap)
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer || checked) return;

    if (destination.droppableId.startsWith("slot-")) {
      const index = Number(destination.droppableId.split("-")[1]);
      const letter = draggableId.replace("bank-", "").replace(/^slot-.*?-/, "");

      const updated = [...answers];

      // 🔹 نسمح بتكرار نفس الحرف
      updated[index] = letter;

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
    setChecked(true); // 🔓
  };
  const reset = () => {
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowAnswer(false);
    setChecked(false); // 🔓
  };

  const images = [paint, boy, pizza2, pincle];

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
          <div className="question-wrapper10">
            <h5 className="header-title-page8">G Look and write.</h5>

            {/* 🔤 Word Bank */}
            <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
              {(provided) => (
                <div
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
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {wordBank.map((letter, index) => (
                    <Draggable
                      key={`${letter}-${index}`}
                      draggableId={`bank-${letter}`}
                      index={index}
                      isDragDisabled={checked || showAnswer}
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
                          {letter}
                        </span>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="row-content10-1">
              {answers.map((value, index) => (
                <div key={index} className="row2">
                  <span
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span className="num-span">{index + 1}</span>
                    <div className="input-wrapper">
                      <Droppable droppableId={`slot-${index}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`q-input10-unit2-p10-q4 ${
                              showAnswer ? "show-answer-red1" : ""
                            } ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {value && (
                              <Draggable
                                draggableId={`slot-${index}-${value}`}
                                index={0}
                                isDragDisabled={checked || showAnswer}
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

                      {wrongInputs.includes(index) && (
                        <span className="error-mark-input">✕</span>
                      )}
                    </div>
                  </span>
                  <img src={images[index]} alt="" className="q-img10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔘 Buttons */}
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

export default Unit2_Page10_Q4;
