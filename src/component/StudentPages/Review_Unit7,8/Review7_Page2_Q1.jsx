import React, { useState } from "react";
import bat from "../../../assets/unit8/imgs/U8P71EXED-01.svg";
import cap from "../../../assets/unit8/imgs/U8P71EXED-02.svg";
import ant from "../../../assets/unit8/imgs/U8P71EXED-03.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review7_Page2_Q1.css";
const Review7_Page2_Q1 = () => {
  const items = [
    { img: bat, correct: "w", correctInput: "window" },
    { img: cap, correct: "h", correctInput: "hat" },
    { img: ant, correct: "h", correctInput: "hand" },
  ];

  const [selected, setSelected] = useState(["", "", ""]);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showCorrect) return;

    const value = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      // منع التكرار
      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = "";

      updated[index] = value;
      return updated;
    });

    setShowResult(false);
  };

  const handleSelect = (value, index) => {
    if (showCorrect) return;
    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);
    setShowResult(false);
  };
  const showAnswers = () => {
    const correctCircles = items.map((item) => item.correct);
    const correctInputs = items.map((item) => item.correctInput);

    setSelected(correctCircles);
    setAnswers(correctInputs);

    setWrongInputs([]);
    setShowResult(true);
    setShowCorrect(true);
  };

  const resetAll = () => {
    setSelected(["", "", ""]);
    setAnswers(["", "", ""]);
    setWrongInputs([]);
    setShowResult(false);
    setShowCorrect(false);
  };

  const checkAnswers = () => {
    if (showCorrect) return;
    // 1) التشييك إذا في دائرة مش مختارة
    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose a circle (w or h) for all items!");
      return;
    }

    // 2) التشييك إذا في input فاضي
    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all the writing boxes!");
      return;
    }

    let wrong = [];
    let score = 0;

    items.forEach((item, i) => {
      const circleCorrect = selected[i] === item.correct;
      const inputCorrect =
        answers[i].trim().toLowerCase() === item.correctInput.toLowerCase();

      // نقطة للدائرة + نقطة للكتابة
      if (circleCorrect) score++;
      if (inputCorrect) score++;

      if (!circleCorrect || !inputCorrect) {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowResult(true);

    const total = items.length * 2; // 8 نقاط
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
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
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            D Does it begin with <span style={{ color: "red" }}>h </span>or{" "}
            <span style={{ color: "red" }}>w</span>? Look, circle, and write.
          </h5>
          <Droppable droppableId="bank" isDropDisabled={showResult}>
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
                          alignItems:"center",justifyContent:"center"
                        }}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.correctInput}
                    draggableId={`word-${item.correctInput}`}
                    index={index}
                    isDragDisabled={showResult}
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
                        {item.correctInput}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="question-grid-review7-p2-q1">
            {items.map((item, i) => (
              <div className="question-box-unit4-page5-q1" key={i}>
                <img src={item.img} className="q-img-unit4-page5-q1" />

                {/* f / v choices */}
                <div className="choices-unit4-page5-q1">
                  <div className="circle-wrapper">
                    <div
                      className={`circle-choice-unit4-page5-q1 ${
                        selected[i] === "h" ? "active" : ""
                      } ${showCorrect ? "correct-color" : ""}`}
                      onClick={() => handleSelect("h", i)}
                    >
                      h
                    </div>

                    {/* X فوق دائرة f إذا كانت غلط */}
                    {showResult &&
                      selected[i] === "h" &&
                      selected[i] !== item.correct && (
                        <div className="wrong-mark">✕</div>
                      )}
                  </div>

                  <div className="circle-wrapper">
                    <div
                      className={`circle-choice-unit4-page5-q1 ${
                        selected[i] === "w" ? "active" : ""
                      } ${showCorrect ? "correct-color" : ""}`}
                      onClick={() => handleSelect("w", i)}
                    >
                      w
                    </div>

                    {/* X فوق دائرة v إذا كانت غلط */}
                    {showResult &&
                      selected[i] === "w" &&
                      selected[i] !== item.correct && (
                        <div className="wrong-mark">✕</div>
                      )}
                  </div>
                </div>

                {/* writing input */}
                <div className="input-wrapper">
                  <Droppable
                    droppableId={`slot-${i}`}
                    isDropDisabled={showResult}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`write-input-unit4-page5-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        } ${showCorrect ? "correct-color" : ""}`}
                      >
                        {answers[i] && (
                          <Draggable
                            draggableId={`filled-${answers[i]}-${i}`}
                            index={0}
                            isDragDisabled={showCorrect}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[i]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}{" "}
                      </div>
                    )}
                  </Droppable>
                  {/* X فوق الإنبت إذا كانت الكلمة غلط */}
                  {
                    answers[i].trim() !== "" &&
                    answers[i].trim().toLowerCase() !==
                      item.correctInput.toLowerCase() &&
                    wrongInputs.includes(i) && (
                      <div className="wrong-mark">✕</div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={showAnswers} className="show-answer-btn">
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

export default Review7_Page2_Q1;
