import React, { useState } from "react";
import "./WB_Unit3_Page2_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit3_Page2_Q1 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);

  const [disableInputs, setDisableInputs] = useState(false);
  const [inputs, setInputs] = useState({});
  const [wrong, setWrong] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [locked, setLocked] = useState(false);
  const questions = [
    {
      id: "q1",
      scramble: "your/book/close",
      questionCorrect: "close your book",
    },
    {
      id: "q2",
      scramble: "pencil/take/your/out",
      questionCorrect: "take out your pencil",
    },
    {
      id: "q3",
      scramble: "line/a/make",
      questionCorrect: "make a line",
    },
    {
      id: "q4",
      scramble: "open/book/your",
      questionCorrect: "open your book",
    },
  ];
  const onDragEnd = (result) => {
    if (!result.destination || locked || showAnswers) return;

    const { draggableId, destination } = result;

    // draggableId مثال: q1-your-0
    const draggedQuestionId = draggableId.split("-")[0]; // q1

    // droppableId مثال: blank-q1_question
    const targetQuestionId = destination.droppableId
      .replace("blank-", "")
      .split("_")[0]; // q1

    // ❌ منع إسقاط الكلمة في غير جملتها
    if (draggedQuestionId !== targetQuestionId) return;

    const parts = draggableId.split("-");
    const word = parts.slice(1, parts.length - 1).join("-");

    const inputKey = `${targetQuestionId}_question`; // ⭐⭐ المفتاح الصح

    setInputs((prev) => {
      const updated = { ...prev };

      // ❌ منع تكرار نفس الكلمة في نفس الجملة
      if (updated[inputKey]?.split(" ").includes(word)) {
        return prev;
      }

      // ➕ إضافة الكلمة
      updated[inputKey] = updated[inputKey]
        ? `${updated[inputKey]} ${word}`
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
  const getScrambledWords = (scramble) => scramble.split("/");

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
            <span className="ex-A">C</span>Unscramble and write.
          </h5>

          <div className="content-container-wb-unit3-p2-q1">
            {questions.map((q, index) => (
              <div style={{ display: "flex", width: "100%" }}>
                <div className="input-container-wb-unit3-p2-q1">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <span className="num2">{index + 1}</span>
                      <div className="answer-input-review10-p1-q3 scramble-text">
                        {q.scramble}
                      </div>
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
                            alignItems: "center",
                            width:"70%",
                            justifyContent:"center"
                          }}
                        >
                          {getScrambledWords(q.scramble).map((word, i) => (
                            <Draggable
                              key={`${q.id}-${word}-${i}`}
                              draggableId={`${q.id}-${word}-${i}`}
                              index={i}
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
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      width: "45%",
                    }}
                  >
                    <Droppable droppableId={`blank-${q.id}_question`} isDropDisabled={locked}>
                      {(provided, snapshot) => (
                        <input
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          value={inputs[`${q.id}_question`] || ""}
                          readOnly
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

export default WB_Unit3_Page2_Q1;
