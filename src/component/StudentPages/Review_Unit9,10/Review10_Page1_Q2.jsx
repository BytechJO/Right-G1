import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import deer from "../../../assets/unit10/imgs/U10P90EXEB.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review10_Page1_Q2.css";

const data = [
  { question: "", correct: "fruit" },
  { question: "", correct: "ice cream" },
  { question: "", correct: "bread" },
  { question: "", correct: "milk" },
  { question: "", correct: "chicken" },
];

const Review10_Page1_Q2 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const [words, setWords] = useState(data.map((d) => d.correct));

  // ⭐⭐ DRAG & DROP ONLY
const onDragEnd = (result) => {
  if (!result.destination || showAnswer) return;

  const { source, destination } = result;

  if (
    source.droppableId === "words" &&
    destination.droppableId.startsWith("answer-")
  ) {
    const newIndex = Number(destination.droppableId.split("-")[1]);
    const draggedWord = words[source.index];

    const newAnswers = [...answers];

    // ⭐⭐ إذا الكلمة موجودة بمكان ثاني → انقلها
    const oldIndex = newAnswers.indexOf(draggedWord);
    if (oldIndex !== -1) {
      newAnswers[oldIndex] = "";
    }

    newAnswers[newIndex] = draggedWord;

    setAnswers(newAnswers);
    setWrongInputs([]);
  }
};



  const checkAnswers = () => {
    if (showAnswer) return;

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
setShowAnswer(true)
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
    setWords(data.map((d) => d.correct));
    setWrongInputs([]);
    setShowAnswer(false);
  };

  const showCorrectAnswers = () => {
    setAnswers(data.map((d) => d.correct));
    setWords([]);
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
            <h3 className="header-title-page8">B Look and write.</h3>

            {/* WORD BANK */}
            <Droppable droppableId="words" direction="horizontal">
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
                          alignItems:"center" ,justifyContent:"center"
                        }}
                  // style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
                >
                  {words.map((word, index) => (
                    <Draggable key={word} draggableId={word} index={index} isDragDisabled={showAnswer}>
                      {(provided) => (
                        <div
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
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="content-review10-p1-q2">
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

                    <Droppable droppableId={`answer-${index}`} isDropDisabled={showAnswer}>
                      {(provided ,snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                   className={`letter-input-review10-p1-q2 ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{ position: "relative" }}
                        >
                          {answers[index]}
                          {wrongInputs.includes(index) && (
                            <span className="wrong-icon-review6-p1-q3">✕</span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>

              <img
                src={deer}
                className="shape-img-unit5-p5-q3"
                alt=""
                style={{ height: "200px", width: "auto" }}
              />
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

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

export default Review10_Page1_Q2;
