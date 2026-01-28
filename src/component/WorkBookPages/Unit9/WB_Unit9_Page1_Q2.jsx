import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import farmImg from "../../../assets/U1 WB/U9/U9P51EXEB.svg"; // عدل المسار حسب مشروعك
import "./WB_Unit9_Page1_Q2.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit9_Page1_Q2 = () => {
  const questions = [
    {
      label: "goats",
      correctLeft: "How many",
      correctRight: "There are three",
    },
    { label: "cows", correctLeft: "How many", correctRight: "There are three" },
    { label: "dogs", correctLeft: "How many", correctRight: "There are one" },
    { label: "cats", correctLeft: "How many", correctRight: "There are two" },
  ];
  const leftBank = ["How many"];
  const rightBank = ["There are one", "There are two", "There are three"];

  const [answers, setAnswers] = useState(
    questions.map(() => ({ left: "", right: "" })),
  );

  const [locked, setLocked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const value = result.draggableId;
    const [qIndex, side] = result.destination.droppableId.split("-");

    setAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex][side] = value;
      return copy;
    });

    setShowResult(false);
  };

  const checkAnswers = () => {
    if (locked) return;

    // 🔴 check empty inputs
    const hasEmpty = answers.some(
      (ans) => ans.left.trim() === "" || ans.right.trim() === "",
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all the blanks!");
      return;
    }

    let score = 0;
    let wrongs = [];

    questions.forEach((q, i) => {
      const leftCorrect =
        answers[i].left.trim().toLowerCase() === q.correctLeft.toLowerCase();

      const rightCorrect =
        answers[i].right.trim().toLowerCase() === q.correctRight.toLowerCase();

      if (leftCorrect && rightCorrect) {
        score++;
      } else {
        wrongs.push({
          index: i,
          left: !leftCorrect,
          right: !rightCorrect,
        });
      }
    });

    setWrongInputs(wrongs);
    setShowResult(true);

    const total = questions.length;
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

  const showAnswers = () => {
    const filled = questions.map((q) => ({
      left: q.correctLeft,
      right: q.correctRight,
    }));

    setAnswers(filled);
    setWrongInputs([]);
    setShowResult(false);
    setLocked(true);
  };

  const resetAll = () => {
    setAnswers(questions.map(() => ({ left: "", right: "" })));
    setWrongInputs([]);
    setShowResult(false);
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
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">B</span> Look, read, and write.
          </h5>

          {/* LEFT BANK */}
          <div
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
            <Droppable droppableId="left-bank" direction="horizontal">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {leftBank.map((txt, i) => (
                    <Draggable
                      key={txt}
                      draggableId={txt}
                      index={i}
                      isDragDisabled={showResult}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            borderRadius: "8px",
                            border: "2px solid #2c5287",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            cursor: "grab",
                            background: "white",
                            padding: "5px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {txt}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* RIGHT BANK */}
            <Droppable droppableId="right-bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {rightBank.map((txt, i) => (
                    <Draggable
                      key={txt}
                      draggableId={txt}
                      index={i}
                      isDragDisabled={showResult}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            borderRadius: "8px",
                            border: "2px solid #2c5287",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            cursor: "grab",
                            background: "white",
                            padding: "5px",

                            ...provided.draggableProps.style,
                          }}
                        >
                          {txt}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <img src={farmImg} alt="farm" className="wb-unit9-p1-q2-image" />

          <div className="wb-unit9-p1-q2-questions">
            {questions.map((q, i) => (
              <div key={i} className="wb-unit9-p1-q2-row">
                <span className="wb-unit9-p1-q2-number">{i + 1}</span>
                <div style={{ width: "100%" }}>
                  <div className="wb-unit9-p1-q2-input-wrapper">
                    <Droppable
                      droppableId={`${i}-left`}
                      isDropDisabled={showResult}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`wb-unit9-p1-q2-input ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "white",
                          }}
                        >
                          {answers[i].left}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {!locked &&
                      showResult &&
                      wrongInputs.some((w) => w.index === i && w.left) && (
                        <div className="wb-unit9-p1-q2-wrong-mark">✕</div>
                      )}
                  </div>
                  <span className="wb-unit9-p1-q2-text">
                    {q.label} are there?
                  </span>
                </div>
                <div style={{ width: "100%" }}>
                  <div className="wb-unit9-p1-q2-input-wrapper">
                    <Droppable droppableId={`${i}-right`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                           className={`wb-unit9-p1-q2-input ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "white",
                          }}
                        >
                          {answers[i].right}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {!locked &&
                      showResult &&
                      wrongInputs.some((w) => w.index === i && w.right) && (
                        <div className="wb-unit9-p1-q2-wrong-mark">✕</div>
                      )}
                  </div>

                  <span className="wb-unit9-p1-q2-text">{q.label} </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
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

export default WB_Unit9_Page1_Q2;
