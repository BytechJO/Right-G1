import React, { useState } from "react";
import deer from "../../../assets/unit5/imgs/U5P44EXEB.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit5_Page5_Q3.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  {
    question: "",
    correct: "poster",
  },
  {
    question: "",
    correct: "board",
  },
  {
    question: "",
    correct: "book",
  },
  {
    question: "",
    correct: "desk",
  },
];

const Unit5_Page5_Q3 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(""));
  const [score, setScore] = useState(null);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    const word = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.replace("slot-", ""));

    setAnswers((prev) => {
      const updated = [...prev];

      // 🔒 منع التكرار
      const oldIndex = updated.findIndex((a) => a === word);
      if (oldIndex !== -1) updated[oldIndex] = "";

      updated[index] = word;
      return updated;
    });

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (showAnswer) return;
    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    const correctCount = answers.filter(
      (ans, i) => ans.trim().toLowerCase() === data[i].correct.toLowerCase(),
    ).length;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans.trim().toLowerCase() !== data[i].correct.toLowerCase()) {
        wrong.push(i); // خزن رقم السؤال الغلط
      }
    });

    setWrongInputs(wrong);
    setScore(correctCount);
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

    if (correctCount === data.length) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  const handleShowAnswer = () => {
    // املئي الإجابات الصحيحة كلها
    const correctAnswers = data.map((item) => item.correct);

    setAnswers(correctAnswers);
    setWrongInputs([]); // ما في غلط بعد show answer
    setShowAnswer(true);
  };

  const reset = () => {
    setAnswers(Array(data.length).fill(""));
    setScore(null);
    setWrongInputs([]);
    setShowAnswer(false); // 🔥 مهم
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
              <span className="ex-A">B</span>
              Label the things in the classroom..
            </h3>

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
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {data.map((item, i) => (
                    <Draggable
                      key={item.correct}
                      draggableId={`word-${item.correct}`}
                      index={i}
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
              <img
                src={deer}
                className="shape-img-unit5-p5-q3"
                alt=""
                style={{ height: "320px", width: "auto" }}
              />
              <div className="group-input-unit5-p5-q3">
                {data.map((item, index) => (
                  <div
                    className="question-row"
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      margin: "20px",
                    }}
                  >
                    <span
                      className="q-number"
                      style={{
                        color: "#0d47a1",
                        fontWeight: "600",
                        fontSize: "20px",
                      }}
                    >
                      {index + 1}
                    </span>

                    <div
                      className="question-text-unit5-p5-q3"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <Droppable droppableId={`slot-${index}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`q-input-unit5-p5-q3  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {answers[index] && (
                              <Draggable
                                draggableId={`filled-${answers[index]}`}
                                index={0}
                                isDragDisabled={showAnswer}
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

                      {/* ❌ علامة الخطأ */}
                      {wrongInputs.includes(index) && (
                        <span className="wrong-icon-review6-p1-q3">✕</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
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

export default Unit5_Page5_Q3;
