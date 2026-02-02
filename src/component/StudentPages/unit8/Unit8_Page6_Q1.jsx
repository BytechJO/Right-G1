import React, { useState } from "react";
import deer from "../../../assets/unit8/imgs/U8P69EXED.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  { question: "", correct: "head" },
  { question: "", correct: "eye" },
  { question: "", correct: "nose" },
  { question: "", correct: "arm" },
  { question: "", correct: "leg" },
];

const Unit8_Page6_Q1 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(null));

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

  const checkAnswers = () => {
    if (showAnswer) return; // ⭐ منع التعديل عند Show Answer

    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    let correctCount = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === data[i].correct) {
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
              <span className="ex-A"> D</span> Look and write.
            </h3>
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
                  {data.map((item, index) => (
                    <Draggable
                      key={item.correct}
                      draggableId={`word-${item.correct}`}
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
                          {item.correct}
                        </span>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="content-unit5-p5-q3">
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
                      className="question-text-unit8-page6-q1"
                      style={{ position: "relative" }}
                    >
                      <Droppable
                        droppableId={`slot-${index}`}
                        isDropDisabled={showAnswer}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`q-input-unit8-page6-q1 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {answers[index] && (
                              <Draggable
                                draggableId={`filled-${answers[index]}-${index}`}
                                index={0}
                                isDragDisabled={true}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {answers[index]}
                                  </span>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {wrongInputs.includes(index) && (
                        <span className="wrong-icon-review6-p1-q3">✕</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <img
                src={deer}
                className="shape-img-unit5-p5-q3"
                alt=""
                style={{ height: "325px", width: "auto" }}
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
            Check Answers ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit8_Page6_Q1;
