import React, { useState } from "react";
import deer from "../../../assets/unit6/imgs/U6P54EXEC-01.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page1_Q3.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  {
    question: "",
    correct: "She can ride a bike",
  },
  {
    question: "",
    correct: "It can climb a tree",
  },
  {
    question: "",
    correct: "He can’t fly a kite",
  },
];

const Review6_Page1_Q3 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(null));
  const [score, setScore] = useState(null);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const value = draggableId.replace("word-", "");
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

  const handleChange = (value, index) => {
    if (locked) return; // 🔒 منع التعديل بعد إظهار الإجابات

    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setWrongInputs([]);
  };
  const showAnswers = () => {
    const correctOnly = data.map((d) => d.correct);
    setAnswers(correctOnly);
    setLocked(true);
    setWrongInputs([]); // نخفي كل الأخطاء
  };

  const checkAnswers = () => {
    if (locked) return; // 🔒 منع التعديل بعد إظهار الإجابات

    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    const correctCount = answers.filter(
      (ans, i) => (ans || "").toLowerCase() === data[i].correct.toLowerCase(),
    ).length;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans.trim().toLowerCase() !== data[i].correct.toLowerCase()) {
        wrong.push(i); // خزن رقم السؤال الغلط
      }
    });

    setWrongInputs(wrong);
    setScore(correctCount);
    setLocked(true);
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

  const reset = () => {
    setAnswers(Array(data.length).fill(null));

    setWrongInputs([]);
    setLocked(false);
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
            <h3 className="header-title-page8">C Look and write.</h3>

            <Droppable droppableId="bank" isDropDisabled={locked}>
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
                  {data.map((item, index) => (
                    <Draggable
                      key={item.correct}
                      draggableId={`word-${item.correct}`}
                      index={index}
                      isDragDisabled={locked}
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
              <img src={deer} className="shape-img-review6-p1-q3" alt="" />
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      <Droppable
                        droppableId={`slot-${index}`}
                        isDropDisabled={locked}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`q-input-review6-p1-q3 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {answers[index] && (
                              <Draggable
                                draggableId={`filled-${answers[index]}-${index}`}
                                index={0}
                                isDragDisabled={locked}
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
          <button onClick={showAnswers} className="show-answer-btn">
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

export default Review6_Page1_Q3;
