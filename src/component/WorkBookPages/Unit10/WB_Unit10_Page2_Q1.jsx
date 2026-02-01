import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import q1Img from "../../../assets/U1 WB/U10/U10P58EXEC-01.svg";
import q2Img from "../../../assets/U1 WB/U10/U10P58EXEC-02.svg";
import q3Img from "../../../assets/U1 WB/U10/U10P58EXEC-03.svg";
import "./WB_Unit10_Page2_Q1.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit10_Page2_Q1 = () => {
  const correctAnswers = {
    q2_question: "want ice cream",
    q2_answer: "I do",
    q3_question: "Do you want",
    q3_answer: "I don't",
  };

  const [answers, setAnswers] = useState({
    q2_question: "",
    q2_answer: "",
    q3_question: "",
    q3_answer: "",
  });

  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const wordBank = ["want ice cream", "I do", "Do you want", "I don't"];

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const word = result.draggableId;
    const key = result.destination.droppableId;

    setAnswers((prev) => ({
      ...prev,
      [key]: word,
    }));

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (locked) return;

    const values = Object.values(answers);
    if (values.some((v) => v.trim() === "")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let wrong = [];
    let score = 0;

    Object.keys(correctAnswers).forEach((key) => {
      if (
        answers[key].trim().toLowerCase() === correctAnswers[key].toLowerCase()
      ) {
        score++;
      } else {
        wrong.push(key);
      }
    });

    setWrongInputs(wrong);
   setLocked(true)
    const total = Object.keys(correctAnswers).length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${score}/${total}</b>
      </div>
    `;

    score === total
      ? ValidationAlert.success(msg)
      : score === 0
        ? ValidationAlert.error(msg)
        : ValidationAlert.warning(msg);
  };

  const showAnswers = () => {
    setAnswers(correctAnswers);
    setWrongInputs([]);
    setLocked(true);
  };

  const resetAll = () => {
    setAnswers({
      q2_question: "",
      q2_answer: "",
      q3_question: "",
      q3_answer: "",
    });
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
            gap: "20px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <div className="exercise-wrapper-wb-unit10-p2-q1">
            <h5 className="header-title-page8">
              <span className="ex-A">C</span> Look, read, and write.
            </h5>
            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "10px",
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    justifyContent: "center",
                  }}
                >
                  {wordBank.map((w, i) => (
                    <Draggable key={w} draggableId={w} index={i} isDragDisabled={locked}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: "6px 12px",
                            border: "2px solid #2c5287",
                            borderRadius: "8px",
                            background: "white",
                            cursor: "grab",
                            fontWeight: "600",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {w}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* ========== ROW 1 (EXAMPLE) ========== */}
            <div className="conversation-row-wb-unit10-p2-q1">
              <span className="num-wb-unit10-p2-q1">1</span>

              {/* Question bubble */}
              <div className="bubble question-bubble-wb-unit10-p2-q1">
                Do you want chicken?
              </div>

              {/* Person */}
              <img
                src={q1Img}
                alt="girl"
                className="person-img-wb-unit10-p2-q1"
              />

              {/* Answer bubble */}
              <div className="bubble answer-bubble-wb-unit10-p2-q1">
                Yes, I do.
              </div>
            </div>

            {/* ========== ROW 2 ========== */}
            <div className="conversation-row-wb-unit10-p2-q1">
              <span className="num-wb-unit10-p2-q1">2</span>

              <div className="bubble question-bubble-wb-unit10-p2-q1">
                Do{" "}
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Droppable droppableId="q2_question" isDropDisabled={locked}>
                    {(provided, snapshot) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`line-input-wb-unit10-p2-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#e3f2fd"
                            : "white",
                          display: "inline-block",
                          minWidth: "120px",
                          padding: "4px",
                        }}
                      >
                        {answers.q2_question}
                        {provided.placeholder}
                      </span>
                    )}
                  </Droppable>
                  {wrongInputs.includes("q2_question") && (
                    <span className="wrong-circle-x-wb-unit10-p2-q1">✕</span>
                  )}
                </div>
                ?
              </div>

              <img
                src={q2Img}
                alt="girl"
                className="person-img-wb-unit10-p2-q1"
              />

              <div className="bubble answer-bubble-wb-unit10-p2-q1">
                Yes,{" "}
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Droppable droppableId="q2_answer" isDropDisabled={locked}>
                    {(provided, snapshot) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`line-input-wb-unit10-p2-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#e3f2fd"
                            : "white",
                          display: "inline-block",
                          minWidth: "120px",
                          padding: "4px",
                        }}
                      >
                        {answers.q2_answer}
                        {provided.placeholder}
                      </span>
                    )}
                  </Droppable>
                  {wrongInputs.includes("q2_answer") && (
                    <span className="wrong-circle-x-wb-unit10-p2-q1">✕</span>
                  )}
                </div>
                .
              </div>
            </div>

            {/* ========== ROW 3 ========== */}
            <div className="conversation-row-wb-unit10-p2-q1">
              <span className="num-wb-unit10-p2-q1">3</span>

              <div className="bubble question-bubble-wb-unit10-p2-q1">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Droppable droppableId="q3_question" isDropDisabled={locked}>
                    {(provided, snapshot) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                         className={`line-input-wb-unit10-p2-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#e3f2fd"
                            : "white",
                          display: "inline-block",
                          minWidth: "120px",
                          padding: "4px",
                        }}
                      >
                        {answers.q3_question}
                        {provided.placeholder}
                      </span>
                    )}
                  </Droppable>
                  {wrongInputs.includes("q3_question") && (
                    <span className="wrong-circle-x-wb-unit10-p2-q1">✕</span>
                  )}
                </div>
                bread?
              </div>

              <img
                src={q3Img}
                alt="boy"
                className="person-img-wb-unit10-p2-q1"
              />

              <div className="bubble answer-bubble-wb-unit10-p2-q1">
                No,{" "}
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Droppable droppableId="q3_answer" isDropDisabled={locked}>
                    {(provided, snapshot) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`line-input-wb-unit10-p2-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#e3f2fd"
                            : "white",
                          display: "inline-block",
                          minWidth: "120px",
                          padding: "4px",
                        }}
                      >
                        {answers.q3_answer}
                        {provided.placeholder}
                      </span>
                    )}
                  </Droppable>
                  {wrongInputs.includes("q3_answer") && (
                    <span className="wrong-circle-x-wb-unit10-p2-q1">✕</span>
                  )}
                </div>
                .
              </div>
            </div>
          </div>
        </div>
        {/* ========== ACTION BUTTONS ========== */}
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

export default WB_Unit10_Page2_Q1;
