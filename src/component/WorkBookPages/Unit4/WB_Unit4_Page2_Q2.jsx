import React, { useState } from "react";
import "./WB_Unit4_Page2_Q2.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit4_Page2_Q2 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);

  const [disableInputs, setDisableInputs] = useState(false);
  const [inputs, setInputs] = useState({});
  const [wrong, setWrong] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [locked, setLocked] = useState(false);
  const getWords = (scramble) => scramble.replace(/[’']/g, "'").split("/");

  const questions = [
    {
      id: "1",
      scramble: "blue/It's",
      questionCorrect: "It's blue",
    },
    {
      id: "2",
      scramble: "circle/It's/a",
      questionCorrect: "It's a circle",
    },
    {
      id: "3",
      scramble: "brown/It's/a/boat",
      questionCorrect: "It's a brown boat",
    },
    {
      id: "4",
      scramble: "square/red/a/It's",
      questionCorrect: "It's a red square",
    },
  ];

const onDragEnd = (result) => {
  if (!result.destination || locked || showAnswers) return;

  const { draggableId, destination } = result;

  // لازم يكون الدروب على input
  if (!destination.droppableId.startsWith("blank-")) return;

  // مثال: blank-1_question → 1
  const targetQuestionId = destination.droppableId
    .replace("blank-", "")
    .split("_")[0];

  // مثال: 1::It's
  const [sourceQuestionId, word] = draggableId.split("::");

  // ❌ إذا الكلمة مش من نفس السؤال → امنع
  if (sourceQuestionId !== targetQuestionId) {
    return;
  }

  setInputs((prev) => {
    const updated = { ...prev };

    // ❌ منع تكرار الكلمة داخل نفس الجملة
    if (updated[`${targetQuestionId}_question`]?.includes(word)) {
      return prev;
    }

    updated[`${targetQuestionId}_question`] =
      updated[`${targetQuestionId}_question`]
        ? `${updated[`${targetQuestionId}_question`]} ${word}`
        : word;

    return updated;
  });

  setWrong({});
};


  const checkAnswers = () => {
    if (showAnswers || locked) return;

    // ❌ فحص إذا في input فاضي
    const hasEmptyInput = questions.some(
      (q) =>
        !inputs[`${q.id}_question`] || inputs[`${q.id}_question`].trim() === "",
    );

    if (hasEmptyInput) {
      ValidationAlert.info(
        "Oops!",
        "Please answer all the questions before checking.",
      );
      return;
    }
    let wrongTemp = {};
    let score = 0;
    const total = questions.length;

    questions.forEach((q) => {
      if (inputs[`${q.id}_question`] !== q.questionCorrect) {
        wrongTemp[`${q.id}_question`] = true;
      } else {
        score++;
      }
    });

    setWrong(wrongTemp);
    setLocked(true);
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
      </span>
    </div>
  `;
    if (total === score) {
      return ValidationAlert.success(msg);
    } else if (score === 0) {
      return ValidationAlert.error(msg);
    } else {
      return ValidationAlert.warning(msg);
    }
  };

  // ⭐ Show Correct Answers
  const showCorrectAnswers = () => {
    let filled = {};

    questions.forEach((q) => {
      filled[`${q.id}_question`] = q.questionCorrect;
    });

    setInputs(filled);
    setWrong({});
    setShowAnswers(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div style={{ width: "60%" }} className="div-forall">
          <h5 className="header-title-page8">
            <span className="ex-A">D</span>Unscramble and write.
          </h5>

          <div className="content-container-wb-unit4-p2-q2 ">
            {questions.map((q, index) => (
              <div style={{ display: "flex", width: "100%" }}>
                <div className="input-container-wb-unit4-p2-q2 ">
                  <div style={{ display: "flex" ,flexDirection:"column" }}>
                    <div style={{ display: "flex" }}>
                    <span className="num2">{q.id}</span>
                    <input
                      readOnly
                      value={q.scramble}
                      className="answer-input-review10-p1-q3"
                    />
                    </div>
                    <Droppable
                      droppableId={`bank-${q.id}`}
                      direction="horizontal"
                    >
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
                          alignItems:"center",
                          justifyContent:"center"
                        }}
                        >
                          {getWords(q.scramble).map((word, i) => (
                            <Draggable
                              key={`${q.id}-${word}-${i}`}
                              draggableId={`${q.id}::${word}`}
                              index={i}
                              isDragDisabled={locked ||showAnswers}
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
                                  {word}
                                </span>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  {/* Unscramble input */}
                  <div style={{ position: "relative" }}>
                    <Droppable droppableId={`blank-${q.id}_question`}>
                      {(provided, snapshot) => (
                        <input
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          value={inputs[`${q.id}_question`] || ""}
                          readOnly
                          disabled={locked || showAnswers}
                          className={`answer-input33-review10-p1-q3 ${
                        snapshot.isDraggingOver ? "drag-over-cell" : ""
                      }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "white",
                          }}
                        />
                      )}
                    </Droppable>

                    {wrong[`${q.id}_question`] && (
                      <span className="error-mark-input1">✕</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ⭐ Buttons */}
          <div className="action-buttons-container">
            <button
              className="try-again-button"
              onClick={() => {
                setAnswers([]);
                setInputs({});
                setWrong({});
                setWrongWords([]);
                setShowAnswers(false);
                setDisableInputs(false);
                setLocked(false);
              }}
            >
              Start Again ↻
            </button>

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
      </div>
    </DragDropContext>
  );
};

export default WB_Unit4_Page2_Q2;
