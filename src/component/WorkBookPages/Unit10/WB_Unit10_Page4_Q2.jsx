import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/U1 WB/U10/U10P60EXEH-01.svg";
import cap from "../../../assets/U1 WB/U10/U10P60EXEH-02.svg";
import ant from "../../../assets/U1 WB/U10/U10P60EXEH-03.svg";
import dad from "../../../assets/U1 WB/U10/U10P60EXEH-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./WB_Unit10_Page4_Q2.css";
const WB_Unit10_Page4_Q2 = () => {
  const questions = [
    {
      img: bat,
      parts: [
        { type: "text", value: "I want an" },
        { type: "input", answer: "apple" },
      ],
    },
    {
      img: cap,
      parts: [
        { type: "input", answer: "I want ice cream" },
        { type: "text", value: "." },
      ],
    },
    {
      img: ant,
      parts: [
        { type: "input", answer: "I want chicken" },
        { type: "text", value: "." },
      ],
    },
    {
      img: dad,
      parts: [
        { type: "input", answer: "I want milk" },
        { type: "text", value: "." },
      ],
    },
  ];

  const wordBank = [
    "apple",
    "I want ice cream",
    "I want chicken",
    "I want milk",
  ];

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );

  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
  if (!result.destination || locked) return;

  const { draggableId, destination } = result;
  const word = draggableId;

  setAnswers((prev) => {
    const copy = prev.map((row) => [...row]);

    // 1️⃣ شيل الكلمة من أي مكان قديم
    copy.forEach((row, qi) => {
      row.forEach((val, pi) => {
        if (val === word) {
          copy[qi][pi] = "";
        }
      });
    });

    // 2️⃣ إذا نزلت على input
    if (destination.droppableId.startsWith("drop-")) {
      const [qIndex, pIndex] = destination.droppableId
        .replace("drop-", "")
        .split("-")
        .map(Number);

      copy[qIndex][pIndex] = word;
    }

    // 3️⃣ إذا نزلت على word-bank → بس تنشال من الجملة
    return copy;
  });

  setWrongInputs([]);
};


  const checkAnswers = () => {
    if (locked) return;

    // 🔴 1) فحص الانبوتات الفاضية
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      for (let pIndex = 0; pIndex < questions[qIndex].parts.length; pIndex++) {
        const part = questions[qIndex].parts[pIndex];

        if (part.type === "input") {
          const value = answers[qIndex][pIndex];

          if (!value || value.trim() === "") {
            ValidationAlert.info(`Please complete question ${qIndex + 1}.`);
            return; // ⛔ وقف التشييك
          }
        }
      }
    }

    let wrong = [];
    let score = 0;
    let total = 0;

    questions.forEach((q, qIndex) => {
      q.parts.forEach((p, pIndex) => {
        if (p.type === "input") {
          total++;
          if (answers[qIndex][pIndex]?.trim() === p.answer) {
            score++;
          } else {
            wrong.push(`${qIndex}-${pIndex}`);
          }
        }
      });
    });

    setWrongInputs(wrong);
    setLocked(true);
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  const showAnswers = () => {
    const filled = questions.map((q) =>
      q.parts.map((p) => (p.type === "input" ? p.answer : null)),
    );

    setAnswers(filled);
    setWrongInputs([]);
    setLocked(true); // 🔒 قفل التعديل
  };

  const reset = () => {
    setAnswers(
      questions.map((q) =>
        q.parts.map((p) => (p.type === "input" ? "" : null)),
      ),
    );
    setWrongInputs([]);
    setLocked(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="question-wrapper-unit3-page6-q1"
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
            <span className="ex-A">H</span>Look and write.
          </h5>

          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  justifyContent: "center",
                }}
              >
                {wordBank.map((word, i) => (
                  <Draggable
                    key={word}
                    draggableId={word}
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

          <div className="content-container-wb-unit8-p1-q2">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="row2-wb-unit10-p4-q2">
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span className="num-span">{qIndex + 1}</span>
                  <div className="sentence-wrapper-wb-unit10-p4-q2">
                    {q.parts.map((part, pIndex) => {
                      if (part.type === "text") {
                        return (
                          <p
                            key={pIndex}
                            className="sentence-text-wb-unit10-p4-q2"
                          >
                            {part.value}
                          </p>
                        );
                      }

                      return (
                        <span
                          key={pIndex}
                          style={{ position: "relative", width: "90%" }}
                        >
                          <Droppable
                            droppableId={`drop-${qIndex}-${pIndex}`}
                            isDropDisabled={locked}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`inline-input-wb-unit8-p1-q2 ${
                                  snapshot.isDraggingOver
                                    ? "drag-over-cell"
                                    : ""
                                }`}
                                style={{
                                  background: snapshot.isDraggingOver
                                    ? "#e3f2fd"
                                    : "white",
                                  minHeight: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "6px",
                                  width: "100%",
                                }}
                              >
                                {answers[qIndex][pIndex]}
                                {provided.placeholder}

                                {wrongInputs.includes(
                                  `${qIndex}-${pIndex}`,
                                ) && (
                                  <span className="error-mark-input-wb-unit2-page3-q2">
                                    ✕
                                  </span>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <img src={q.img} alt="" className="q-img-wb-unit8-p1-q2" />
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
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

export default WB_Unit10_Page4_Q2;
