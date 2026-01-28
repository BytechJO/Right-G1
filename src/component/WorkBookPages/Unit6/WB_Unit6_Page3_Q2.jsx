import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/U1 WB/U6/U6P35EXEF-01.svg";
import cap from "../../../assets/U1 WB/U6/U6P35EXEF-02.svg";
import ant from "../../../assets/U1 WB/U6/U6P35EXEF-03.svg";
import dad from "../../../assets/unit6/imgs/U6P50EXEB-04.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page3_Q2.css";
const WB_Unit6_Page3_Q2 = () => {
  const questions = [
    {
      img: bat,
      parts: [
        { type: "text", value: "He" },
        { type: "input", answer: "can play the violin" },
        { type: "text", value: "." },
      ],
    },
    {
      img: cap,
      parts: [
        { type: "text", value: "She" },
        { type: "input", answer: "can fly a kite" },
        { type: "text", value: "." },
      ],
    },
    {
      img: ant,
      parts: [
        { type: "text", value: "He" },
        { type: "input", answer: "can't ride a bike" },
        { type: "text", value: "." },
      ],
    },
  ];

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );

  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const allSentences = questions
    .flatMap((q) => q.parts)
    .filter((p) => p.type === "input")
    .map((p) => p.answer);
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const sentence = result.draggableId;
    const dest = result.destination.droppableId;

    // dest مثال: blank-0-1
    if (!dest.startsWith("blank-")) return;

    const [, qIndex, pIndex] = dest.split("-").map(Number);

    const updated = answers.map((row) => [...row]);

    // ⭐ شيل الجملة من أي مكان سابق
    updated.forEach((row) =>
      row.forEach((val, i) => {
        if (val === sentence) row[i] = "";
      }),
    );

    updated[qIndex][pIndex] = sentence;
    setAnswers(updated);
    setWrongInputs([]);
  };

  const handleChange = (value, qIndex, pIndex) => {
    if (locked) return;

    const copy = [...answers];
    copy[qIndex][pIndex] = value.toLowerCase();
    setAnswers(copy);
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
            <span className="ex-A">F</span>Look and write.
          </h5>
          <Droppable droppableId="sentence-bank" direction="vertical">
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
                          alignItems:"center",justifyContent:"center"
                        }}
              >
                {allSentences.map((sentence, i) => {
                  const isUsed = answers.flat().includes(sentence);

                  return (
                    <Draggable
                      key={sentence}
                      draggableId={sentence}
                      index={i}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <div
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
                          {sentence}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="content-container-wb-unit6-p3-q2">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="row2-wb-unit6-p3-q2">
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <span className="num-span">{qIndex + 1}</span>
                  <img src={q.img} alt="" className="q-img-wb-unit6-p3-q2" />
                </div>

                <div className="sentence-wrapper-wb-unit6-p3-q2">
                  {q.parts.map((part, pIndex) => {
                    if (part.type === "text") {
                      return (
                        <span key={pIndex} className="sentence-text">
                          {part.value}
                        </span>
                      );
                    }

                    return (
                      <span
                        key={pIndex}
                        style={{ position: "relative", width: "90%" }}
                      >
                        <Droppable droppableId={`blank-${qIndex}-${pIndex}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`inline-input-wb-unit6-p3-q2  ${
                        snapshot.isDraggingOver ? "drag-over-cell" : ""
                      }`}
                              style={{
                                width: "100%",
                                background: snapshot.isDraggingOver
                                  ? "#e3f2fd"
                                  : "",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {answers[qIndex][pIndex]}

                              {wrongInputs.includes(`${qIndex}-${pIndex}`) && (
                                <span className="error-mark-input-wb-unit2-page3-q2">
                                  ✕
                                </span>
                              )}

                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        {wrongInputs.includes(`${qIndex}-${pIndex}`) && (
                          <span className="error-mark-input-wb-unit2-page3-q2">
                            ✕
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
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

export default WB_Unit6_Page3_Q2;
