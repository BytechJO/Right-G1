import React, { useState } from "react";
import "./WB_Unit10_Page1_Q1.css";
import jello from "../../../assets/U1 WB/U10/U10P57EXEA-01.svg";
import present from "../../../assets/U1 WB/U10/U10P57EXEA-02.svg";
import balloons from "../../../assets/U1 WB/U10/U10P57EXEA-03.svg";
import balloons1 from "../../../assets/U1 WB/U10/U10P57EXEA-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit10_Page1_Q1 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);

  const [disableInputs, setDisableInputs] = useState(false);
  const [inputs, setInputs] = useState({});
  const [wrong, setWrong] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [locked, setLocked] = useState(false);
  const scrambledWords = {
    q1: ["I", "want", "an", "apple"],
    q2: ["I", "want", "bread"],
    q3: ["I", "want", "chicken"],
    q4: ["I", "want", "ice", "cream"],
  };

  const questions = [
    {
      id: "q1",
      img: jello,
      scramble: "I want an plepa.",
      questionCorrect: "I want an apple",
    },
    {
      id: "q2",
      img: present,
      scramble: "I want daerb.",
      questionCorrect: "I want bread",
    },
    {
      id: "q3",
      img: balloons,
      scramble: "I want ncckeih.",
      questionCorrect: "I want chicken",
    },
    {
      id: "q4",
      img: balloons1,
      scramble: "I want eic mreac.",
      questionCorrect: "I want ice cream",
    },
  ];

  const onDragEnd = (result) => {
    if (!result.destination || showAnswers || locked) return;

    const { destination } = result;
    const { draggableId } = result;
    const word = draggableId.split("-").slice(1, -1).join("-");

    const qId = destination.droppableId.replace("drop-", "");
    const key = `${qId}_question`;

    setInputs((prev) => {
      const current = prev[key] || [];

      // منع التكرار
      const filtered = current.filter((w) => w !== word);

      return {
        ...prev,
        [key]: [...filtered, word],
      };
    });

    setWrong({});
  };

 const checkAnswers = () => {
  if (showAnswers || locked) return;

  // 1️⃣ التأكد إنه كل سؤال متعبّي
  const hasEmptyInput = questions.some((q) => {
    const arr = inputs[`${q.id}_question`];
    return !arr || arr.length === 0;
  });

  if (hasEmptyInput) {
    ValidationAlert.info(
      "Oops!",
      "Please answer all the questions before checking."
    );
    return;
  }

  let wrongTemp = {};
  let score = 0;
  const total = questions.length;

  // 2️⃣ مقارنة الإجابات
  questions.forEach((q) => {
    const userAnswer = (inputs[`${q.id}_question`] || []).join(" ");

    if (userAnswer !== q.questionCorrect) {
      wrongTemp[`${q.id}_question`] = true;
    } else {
      score++;
    }
  });

  setWrong(wrongTemp);
  setLocked(true);

  // 3️⃣ عرض النتيجة
  const color =
    score === total ? "green" : score === 0 ? "red" : "orange";

  const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

  if (score === total) {
    ValidationAlert.success(msg);
  } else if (score === 0) {
    ValidationAlert.error(msg);
  } else {
    ValidationAlert.warning(msg);
  }
};

  // ⭐ Show Correct Answers
  const showCorrectAnswers = () => {
    let filled = {};

    questions.forEach((q) => {
      filled[`${q.id}_question`] = q.questionCorrect.split(" ");
    });

    setInputs(filled);
    setWrong({});
    setShowAnswers(true);
    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div style={{ width: "60%" }} className="div-forall">
          <h5 className="header-title-page8">
            <span className="ex-A">A</span>Look, read, unscramble, and write.
          </h5>

          <div className="content-container-wb-unit10-p1-q1">
            {questions.map((q, index) => (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <span className="num2">{index + 1}</span>
                <img src={q.img} className="img-wb-unit10-p1-q1" />
                <div className="input-container-wb-unit10-p1-q1">
                  <div style={{ display: "flex" }}>
                    <input
                      readOnly
                      value={q.scramble}
                      className="answer-input-review10-p1-q3"
                    />
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
                            marginBottom: "10px",
                          }}
                        >
                          {scrambledWords[q.id].map((word, i) => (
                            <Draggable
                              key={`${q.id}-${word}-${i}`}
                              draggableId={`${q.id}-${word}-${i}`}
                              index={i}
                              isDragDisabled={locked}
                            >
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
                                    fontWeight: "600",
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
                  </div>
                  {/* Unscramble input */}
                  <div style={{ position: "relative" }}>
                    <Droppable
                      droppableId={`drop-${q.id}`}
                      direction="horizontal"
                      isDropDisabled={locked}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input33-review10-p1-q3 ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "white",
                            display: "flex",
                            gap: "6px",
                            height: "40px",
                            alignItems: "center",
                            padding: "6px",
                          }}
                        >
                          {(inputs[`${q.id}_question`] || []).join(" ")}
                          {provided.placeholder}

                          {wrong[`${q.id}_question`] && (
                            <span className="error-mark-input1">✕</span>
                          )}
                        </div>
                      )}
                    </Droppable>
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

export default WB_Unit10_Page1_Q1;
