import React, { useState } from "react";
import deer from "../../../assets/unit4/imgs/U4P36EXED-01.svg";
import taxi from "../../../assets/unit4/imgs/U4P36EXED-02.svg";
import dish from "../../../assets/unit4/imgs/U4P36EXED-03.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Review4_Page1_Q4.css";

const data = [
  {
    img: deer,
    question: "Is it a green triangle? Yes,",
    correct: "it is",
  },
  {
    img: taxi,
    question: "Is it a red square? No,",
    correct: "it isn't",
  },
  {
    img: dish,
    question: "Is it a blue ?",
    correct: "square Yes, it is",
  },
];

const Review4_Page1_Q4 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  /* ================= Drag Logic ================= */
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    if (destination.droppableId.startsWith("slot-")) {
      const index = Number(destination.droppableId.split("-")[1]);
      const value = draggableId.replace("word-", "");

      setAnswers((prev) => {
        const updated = [...prev];

        // 🔒 منع التكرار
        const oldIndex = updated.findIndex((a) => a === value);
        if (oldIndex !== -1) updated[oldIndex] = "";

        updated[index] = value;
        return updated;
      });

      setWrongInputs([]);
    }
  };

  /* ================= Check (كما هو) ================= */
  const checkAnswers = () => {
    if (locked) return;

    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    let wrong = [];
    let correctCount = 0;

    answers.forEach((ans, i) => {
      if (ans.trim().toLowerCase() === data[i].correct.toLowerCase())
        correctCount++;
      else wrong.push(i);
    });

    setWrongInputs(wrong);

    let color =
      correctCount === data.length
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    ValidationAlert[
      correctCount === data.length
        ? "success"
        : correctCount === 0
          ? "error"
          : "warning"
    ](`
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${data.length}
        </span>
      </div>
    `);

    setLocked(true);
  };

  const reset = () => {
    setAnswers(Array(data.length).fill(""));
    setWrongInputs([]);
    setLocked(false);
  };

  const showAnswer = () => {
    setAnswers(data.map((q) => q.correct));
    setWrongInputs([]);
    setLocked(true);
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
          }}
        >
          <div className="component-wrapper">
            <h3 className="header-title-page8">D Look, read, and write.</h3>

            {/* 🔤 Word Bank */}
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

            {data.map((item, index) => (
              <div className="question-row-review4-p1-q4" key={index}>
                <span className="q-number">{index + 1}.</span>

                <img
                  src={item.img}
                  className="shape-img"
                  alt=""
                  style={{ height: "100px", width: "100px" }}
                />

                <div className="question-text-review4-p1-q4">
                  <h6>{item.question}</h6>

                  <Droppable droppableId={`slot-${index}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-review4-p1-q4 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[index] && (
                          <Draggable
                            draggableId={`slot-${index}-${answers[index]}`}
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

                        {wrongInputs.includes(index) && (
                          <span className="wrong-icon-review4-p1-q4">✕</span>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button
            onClick={showAnswer}
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

export default Review4_Page1_Q4;
