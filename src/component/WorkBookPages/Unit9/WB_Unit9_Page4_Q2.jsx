import React, { useState } from "react";
import deer from "../../../assets/U1 WB/U9/U9P54EXEI-01.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit9_Page4_Q2.css";
const data = [
  { question: "", correct: "There are three cows" },
  { question: "", correct: "There are two cats" },
  { question: "", correct: "There are one dog" },
];

const WB_Unit9_Page4_Q2 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW
  const wordBank = data.map((d, i) => ({
    id: `w-${i}`,
    text: d.correct,
  }));

  const handleChange = (value, index) => {
    if (showAnswer) return; // ⭐ منع التعديل عند Show Answer

    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setWrongInputs([]);
  };
  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const value = result.draggableId;
    const index = Number(result.destination.droppableId);

    setAnswers((prev) => {
      const copy = [...prev];

      // منع التكرار
      copy.forEach((v, i) => {
        if (v === value) copy[i] = "";
      });

      copy[index] = value;
      return copy;
    });

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (showAnswer) return; // ⭐ منع التعديل عند Show Answer

    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    let correctCount = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans.trim().toLowerCase() === data[i].correct.toLowerCase()) {
        correctCount++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowAnswer(true);
    let color =
      correctCount === data.length
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${data.length}
        </span>
      </div>
    `;

    if (correctCount === data.length) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setAnswers(Array(data.length).fill(""));
    setWrongInputs([]);
    setShowAnswer(false); // ⭐ إعادة التفعيل الطبيعي
  };

  // ⭐⭐⭐ SHOW ANSWER FUNCTION
  const showCorrectAnswers = () => {
    const correctList = data.map((item) => item.correct);
    setAnswers(correctList);
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
          <div className="component-wrapper">
            <h3 className="header-title-page8">
              <span className="ex-A">I</span>Count and write.
            </h3>
            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px",
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    justifyContent: "center",
                  }}
                >
                  {wordBank.map((w, i) => (
                    <Draggable
                      key={w.id}
                      draggableId={w.text}
                      index={i}
                      isDragDisabled={showAnswer}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: "8px 12px",
                            border: "2px solid #0d47a1",
                            borderRadius: "8px",
                            background: "white",
                            fontWeight: "600",
                            cursor: "grab",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {w.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="content-wb-unit9-p4-q2">
              <div className="group-input-unit5-p5-q3">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="question-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      margin: "10px",
                      width: "100%",
                    }}
                  >
                    <span
                      className="q-number"
                      style={{
                        color: "#0d47a1",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {index + 1}.
                    </span>

                    <div
                      className="question-text"
                      style={{ position: "relative", width: "100%" }}
                    >
                      <Droppable
                        droppableId={`${index}`}
                        isDropDisabled={showAnswer}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`q-input-wb-unit9-p4-q2 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "white",
                            }}
                          >
                            {answers[index]}
                            {provided.placeholder}

                            {wrongInputs.includes(index) && (
                              <span className="wrong-icon-review6-p1-q3">
                                ✕
                              </span>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                ))}
              </div>

              <img
                src={deer}
                className="shape-img-wb-unit9-p4-q2"
                alt=""
                style={{ height: "300px", width: "auto" }}
              />
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          {/* ⭐ زر الشو أنسر */}
          <button
            className="show-answer-btn swal-continue"
            onClick={showCorrectAnswers}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit9_Page4_Q2;
