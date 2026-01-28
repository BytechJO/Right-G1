import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/U1 WB/U8/U8P45EXEB-01.svg";
import cap from "../../../assets/U1 WB/U8/U8P45EXEB-02.svg";
import ant from "../../../assets/U1 WB/U8/U8P45EXEB-03.svg";
import dad from "../../../assets/U1 WB/U8/U8P45EXEB-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./WB_Unit8_Page1_Q2.css";
const WB_Unit8_Page1_Q2 = () => {
  const questions = [
    {
      img: bat,
      parts: [
        { type: "text", value: "Open" },
        { type: "input", answer: "your eye" },
        { type: "text", value: "." },
      ],
    },
    {
      img: cap,
      parts: [
        { type: "text", value: "Bend" },
        { type: "input", answer: "your knee" },
        { type: "text", value: "." },
      ],
    },
    {
      img: ant,
      parts: [
        { type: "input", answer: "Raise your hand" },
        { type: "text", value: "." },
      ],
    },
    {
      img: dad,
      parts: [
        { type: "input", answer: "Open your mouth" },
        { type: "text", value: "." },
      ],
    },
  ];

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const wordBank = [
    { id: "w1", text: "your eye" },
    { id: "w2", text: "your knee" },
    { id: "w3", text: "Raise your hand" },
    { id: "w4", text: "Open your mouth" },
  ];

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { draggableId, destination } = result;

    // 🟡 إذا رجعنا الكلمة على الـ word bank
    if (destination.droppableId === "word-bank") {
      setAnswers((prev) => {
        const copy = prev.map((row) => [...row]);

        // شيل الكلمة من أي مكان كانت فيه
        copy.forEach((row, qi) =>
          row.forEach((val, pi) => {
            if (val === draggableId) copy[qi][pi] = "";
          }),
        );

        return copy;
      });

      setWrongInputs([]);
      return;
    }

    // 🟢 إذا نزلت داخل سؤال
    if (destination.droppableId.startsWith("drop-")) {
      const [qIndex, pIndex] = destination.droppableId
        .replace("drop-", "")
        .split("-")
        .map(Number);

      setAnswers((prev) => {
        const copy = prev.map((row) => [...row]);

        // إزالة الكلمة من مكانها القديم
        copy.forEach((row, qi) =>
          row.forEach((val, pi) => {
            if (val === draggableId) copy[qi][pi] = "";
          }),
        );

        // وضعها بالمكان الجديد
        copy[qIndex][pIndex] = draggableId;
        return copy;
      });

      setWrongInputs([]);
    }
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
          const word =
            wordBank.find((w) => w.id === answers[qIndex][pIndex])?.text || "";
          if (word === p.answer) {
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
            <span className="ex-A">B</span>Look and write.
          </h5>
          <Droppable droppableId="word-bank" direction="horizontal">
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
                  <Draggable
                    key={w.id}
                    draggableId={w.id}
                    index={i}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
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
                          padding: "5px",
                          background: "white",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {w.text}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="content-container-wb-unit8-p1-q2">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="row2-wb-unit6-p3-q2">
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <span className="num-span">{qIndex + 1}</span>
                  <img src={q.img} alt="" className="q-img-wb-unit8-p1-q2" />
                </div>

                <div className="sentence-wrapper-wb-unit8-p1-q2">
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
                        <Droppable
                          droppableId={`drop-${qIndex}-${pIndex}`}
                          isDropDisabled={locked}
                        >
                          {(provided, snapshot) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`inline-input-wb-unit8-p1-q2 ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                              style={{
                                background: snapshot.isDraggingOver
                                  ? "#c4e5fcff"
                                  : "transparent",
                                width: "100%",
                              }}
                            >
                              {wordBank.find(
                                (w) => w.id === answers[qIndex][pIndex],
                              )?.text || ""}
                              {provided.placeholder}

                              {wrongInputs.includes(`${qIndex}-${pIndex}`) && (
                                <span className="error-mark-input-wb-unit2-page3-q2">
                                  ✕
                                </span>
                              )}
                            </span>
                          )}
                        </Droppable>
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

export default WB_Unit8_Page1_Q2;
