import React, { useState } from "react";
import deer from "../../../assets/unit6/imgs/U6P52EXEB-01.svg";
import duck from "../../../assets/unit6/imgs/U6P52EXEB-02.svg";
import taxi from "../../../assets/unit6/imgs/U6P52EXEB-03.svg";
import tiger from "../../../assets/unit6/imgs/U6P52EXEB-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Review5_Page1_Q2.css";
const data = [
  {
    word: "This is your chair.",
    src: deer,
    num: "3",
  },
  {
    word: "This is my book.",
    src: duck,
    num: "1",
  },
  {
    word: "This is my pen.",
    src: taxi,
    num: "2",
  },
  {
    word: "This is your ruler.",
    src: tiger,
    num: "4",
  },
];

const numbers = ["1", "2", "3", "4"];
const Review5_Page1_Q2 = () => {
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState(Array(data.length).fill(null));
  const [wrongNumbers, setWrongNumbers] = useState(data.map(() => false));

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const value = draggableId.replace("num-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      // منع تكرار الرقم
      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = null;

      updated[index] = value;
      return updated;
    });

    setWrongNumbers(data.map(() => false));
  };

  const showAnswers = () => {
    const correctFilled = data.map((item) => item.num);
    setAnswers(correctFilled);
    setWrongNumbers(data.map(() => false));
    setLocked(true); // 🔒 يمنع التعديل
  };

  const reset = () => {
    setAnswers(Array(data.length).fill(null));
    setWrongNumbers(data.map(() => false));
    setLocked(false); // ← فتح التعديل من جديد
  };

  const checkAnswers = () => {
    if (locked) return; // 🔒 منع التعديل بعد Show Answer

    if (answers.some((a) => a === null)) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
      return;
    }

    let correctLetters = 0;
    let correctNumbers = 0;

    answers.forEach((a, i) => {
      if (i === 0) return; // تجاهل أول إجابة تمامًا
      if (answers[i] === data[i].num) correctNumbers++;
    });
    let totalPoints = data.length - 1;
    let score = correctNumbers;

    const numberWrongs = answers.map((a, i) => a !== data[i].num);

    setWrongNumbers(numberWrongs);
    setLocked(true);
    let color =
      score === totalPoints ? "green" : score === 0 ? "red" : "orange";

    let scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">Score: ${score} / ${totalPoints}</span>
      </div>
    `;

    if (score === totalPoints) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
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
          <div className="page8-content">
            <header className="header-title-page8">
              B Look, read, and number the sentences.
            </header>
            <Droppable droppableId="numbers-bank" isDropDisabled={locked}>
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
                  {numbers.map((item, index) => (
                    <Draggable
                      key={item}
                      draggableId={`num-${item}`}
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
                          {item}
                        </span>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* ✅ الصور */}
            <div className="exercise-image-div-review5-p1-q2">
              {data.map((item, index) => (
                <div style={{ display: "flex" }}>
                  <span
                    style={{
                      color: "#2c5287",
                      fontSize: "22px",
                      fontWeight: "700",
                    }}
                  >
                    {index + 1}
                  </span>
                  <img
                    key={index}
                    src={item.src}
                    className="exercise-image-review5-p1-q2"
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* ✅ مربعات الأرقام + علامة الخطأ  */}
              <div
                className="exercise-container-review5-p1-q2"
                style={{
                  marginTop: "20px",
                }}
              >
                {data.map((item, index) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "22px",
                    }}
                  >
                    <span style={{ width: "200px" }}>{item.word}</span>{" "}
                    <div
                      key={index}
                      className="exercise-item-review3-p1-q1"
                      style={{ position: "relative" }}
                    >
                      <Droppable
                        droppableId={`slot-${index}`}
                        isDropDisabled={locked}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`missing-input-review5-p1-q2 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {answers[index] && (
                              <Draggable
                                draggableId={`filled-${answers[index]}`}
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

                      {wrongNumbers[index] && (
                        <div
                          style={{
                            position: "absolute",
                            right: "-17px",
                            top: "5%",
                            transform: "translateY(-50%)",
                            width: "25px",
                            height: "25px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "14px",
                            fontWeight: "bold",
                            border: "2px solid white",
                          }}
                        >
                          ✕
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            className="show-answer-btn swal-continue"
            onClick={showAnswers}
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

export default Review5_Page1_Q2;
