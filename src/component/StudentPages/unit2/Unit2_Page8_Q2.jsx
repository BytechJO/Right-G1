import React, { useState } from "react";
import deer from "../../../assets/unit1/imgs/deer flip.svg";
import taxi from "../../../assets/unit1/imgs/taxi_1.svg";
import table from "../../../assets/unit1/imgs/table2.jpg";
import dish from "../../../assets/unit1/imgs/dish3.jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Unit2_Page8_Q2.css";

const Unit2_Page8_Q2 = () => {
  const correctAnswers = ["deer", "taxi", "table", "dish"];
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [usedWords, setUsedWords] = useState([]);
  const [wrongInput, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // 🧲 Drag logic
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    if (destination.droppableId.startsWith("slot-")) {
      const newIndex = Number(destination.droppableId.split("-")[1]);
      const word = draggableId.replace("word-", "");

      const updated = [...answers];

      // 🔍 نشوف إذا الكلمة موجودة بخانة ثانية
      const oldIndex = updated.findIndex((ans) => ans === word);

      // إذا كانت موجودة → نفرغ مكانها القديم
      if (oldIndex !== -1) {
        updated[oldIndex] = "";
      }

      // 🔁 نحطها بالمكان الجديد
      updated[newIndex] = word;

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
      else wrong.push(ans);
    });

    setWrongInputs(wrong);
    setUsedWords(correctAnswers);

    const color = score === 4 ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === 4 ? "success" : score === 0 ? "error" : "warning"
    ](`
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / 4
        </span>
      </div>
    `);
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setUsedWords([]);
    setWrongInputs([]);
    setShowAnswer(false);
  };

  const showAnswerFun = () => {
    setAnswers(correctAnswers);
    setUsedWords(correctAnswers);
    setWrongInputs([]);
    setShowAnswer(true);
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
        <div className="div-forall" style={{ width: "60%" }}>
          <div className="question-wrapper">
            <h5 className="header-title-page8">E Read, look, and write.</h5>

            {/* 🔤 الكلمات (فوق – نفس الكتاب) */}
            <Droppable
              droppableId="words"
              direction="horizontal"
              isDropDisabled
            >
              {(provided) => (
                <div
                  // className="word-bank-unit2-p8-q2"
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
                    justifyContent:"center"
                  }}
                >
                  {correctAnswers.map((word, index) => (
                    <Draggable
                      key={word}
                      draggableId={`word-${word}`}
                      index={index}
                      isDragDisabled={usedWords.includes(word)}
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`word-item-unit2-p8-q2 ${
                            usedWords.includes(word) ? "used" : ""
                          }`}
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

            {/* 🧩 الجمل – Inline 100% */}
            <div className="row-content22">
              {/* 1 */}
              <div className="row2">
                <span>
                  <span className="num-span">1</span> The{" "}
                  <Droppable droppableId="slot-0">
                    {(provided, snapshot) => (
                      <span className="drop-slot-wrapper-unit2-p8-q2">
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`drop-slot-inline-unit2-p8-q2 ${
                            wrongInput.includes(answers[0]) ? "wrong" : ""
                          } ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                        >
                          {answers[0]}
                          {provided.placeholder}
                        </span>

                        {wrongInput.includes(answers[0]) && (
                          <span className="error-mark-input">✕</span>
                        )}
                      </span>
                    )}
                  </Droppable>{" "}
                  is brown.
                </span>
                <img src={deer} alt="" className="q-img" />
              </div>

              {/* 2 */}
              <div className="row2">
                <span>
                  <span className="num-span">2</span> My brother takes a{" "}
                  <Droppable droppableId="slot-1">
                    {(provided ,snapshot) => (
                      <span className="drop-slot-wrapper-unit2-p8-q2">
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`drop-slot-inline-unit2-p8-q2 ${
                            wrongInput.includes(answers[0]) ? "wrong" : ""
                          } ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                        >
                          {answers[1]}
                          {provided.placeholder}
                        </span>

                        {wrongInput.includes(answers[1]) && (
                          <span className="error-mark-input">✕</span>
                        )}
                      </span>
                    )}
                  </Droppable>
                  .
                </span>
                <img src={taxi} alt="" className="q-img" />
              </div>

              {/* 3 */}
              <div className="row2">
                <span>
                  <span className="num-span">3</span> The{" "}
                  <Droppable droppableId="slot-2">
                    {(provided ,snapshot) => (
                      <span className="drop-slot-wrapper-unit2-p8-q2">
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`drop-slot-inline-unit2-p8-q2 ${
                            wrongInput.includes(answers[0]) ? "wrong" : ""
                          } ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                        >
                          {answers[2]}
                          {provided.placeholder}
                        </span>

                        {wrongInput.includes(answers[2]) && (
                          <span className="error-mark-input">✕</span>
                        )}
                      </span>
                    )}
                  </Droppable>{" "}
                  is round.
                </span>
                <img src={table} alt="" className="q-img" />
              </div>

              {/* 4 */}
              <div className="row2">
                <span>
                  <span className="num-span">4</span> The{" "}
                  <Droppable droppableId="slot-3">
                    {(provided ,snapshot) => (
                      <span className="drop-slot-wrapper-unit2-p8-q2">
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`drop-slot-inline-unit2-p8-q2 ${
                            wrongInput.includes(answers[0]) ? "wrong" : ""
                          } ${snapshot.isDraggingOver ? "drag-over-cell" : ""}`}
                        >
                          {answers[3]}
                          {provided.placeholder}
                        </span>

                        {wrongInput.includes(answers[3]) && (
                          <span className="error-mark-input">✕</span>
                        )}
                      </span>
                    )}
                  </Droppable>{" "}
                  is white.
                </span>
                <img src={dish} alt="" className="q-img" />
              </div>
            </div>
          </div>

          {/* 🔘 الأزرار نفسها */}
          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>
            <button
              onClick={showAnswerFun}
              className="show-answer-btn swal-continue"
            >
              Show Answer
            </button>
            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit2_Page8_Q2;
