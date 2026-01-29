import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/U1 WB/U8/U8P48EXEG-01.svg";
import cap from "../../../assets/U1 WB/U8/U8P48EXEG-02.svg";
import ant from "../../../assets/U1 WB/U8/U8P48EXEG-03.svg";
import dad from "../../../assets/U1 WB/U8/U8P48EXEG-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./WB_Unit8_Page4_Q1.css";
const WB_Unit8_Page4_Q1 = () => {
  const questions = [
    {
      id: 1,
      img: bat,
      parts: [
        { type: "text", value: "This" },
        { type: "input", answer: "is my arm" },
        { type: "text", value: "." },
      ],
    },
    {
      id: 2,
      img: cap,
      parts: [
        { type: "text", value: "This" },
        { type: "input", answer: "is my head" },
        { type: "text", value: "." },
      ],
    },
    {
      id: 3,
      img: ant,
      parts: [
        { type: "input", answer: "This is my leg" },
        { type: "text", value: "." },
      ],
    },
    {
      id: 4,
      img: dad,
      parts: [
        { type: "input", answer: "This is my nose" },
        { type: "text", value: "." },
      ],
    },
  ];
  const wordBank = [
    { id: "w1", text: "is my arm" },
    { id: "w2", text: "is my head" },
    { id: "w3", text: "This is my leg" },
    { id: "w4", text: "This is my nose" },
  ];

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

 const onDragEnd = (result) => {
  const { destination, draggableId } = result;
  if (!destination || locked) return;

  // ✅ إذا انرمَت على البنك: بس فضّي مكانها القديم
  if (destination.droppableId === "word-bank") {
    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);
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

  // ✅ فقط اسمح بالدروب على الخانات
  if (!destination.droppableId.startsWith("drop-")) return;

  const [qIndex, pIndex] = destination.droppableId
    .replace("drop-", "")
    .split("-")
    .map(Number);

  setAnswers((prev) => {
    const copy = prev.map((row) => [...row]);

    // إزالة الكلمة من أي مكان سابق (منع التكرار)
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
    resetCanvas();
    setAnswers(
      questions.map((q) =>
        q.parts.map((p) => (p.type === "input" ? "" : null)),
      ),
    );
    setWrongInputs([]);
    setLocked(false);
  };

  // نخزن Ref لكل Canvas
  const canvasRefs = useRef({});

  useEffect(() => {
    questions.forEach((q) => {
      const canvas = canvasRefs.current[q.id];
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = q.img;

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    });
  }, []);

  // دوال الرسم
  const startDrawing = (e, id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");

    ctx.isDrawing = true;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "purple";

    const rect = canvas.getBoundingClientRect();
    ctx.lastX = (e.clientX || e.touches[0].clientX) - rect.left;
    ctx.lastY = (e.clientY || e.touches[0].clientY) - rect.top;
  };

  const draw = (e, id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");
    if (!ctx.isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(ctx.lastX, ctx.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.lastX = x;
    ctx.lastY = y;
  };

  const stopDrawing = (id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");
    ctx.isDrawing = false;
  };

  const resetCanvas = () => {
    questions.forEach((q) => {
      const canvas = canvasRefs.current[q.id];
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.src = q.img;

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    });
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
            gap: "10px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">G</span>Trace and write.
          </h5>

          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 12,
                  border: "2px dashed #ccc",
                  borderRadius: 10,
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
                          background: "white",
                          padding: "8px",
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

          <div className="content-container-wb-unit8-p4-q1">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="row2-wb-unit8-p4-q1">
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <span className="num-span">{qIndex + 1}</span>
                  <canvas
                    ref={(el) => (canvasRefs.current[q.id] = el)}
                    width={290}
                    height={160}
                    className="wb-unit8-p4-q1-canvas"
                    onMouseDown={(e) => startDrawing(e, q.id)}
                    onMouseMove={(e) => draw(e, q.id)}
                    onMouseUp={() => stopDrawing(q.id)}
                    onMouseLeave={() => stopDrawing(q.id)}
                    onTouchStart={(e) => startDrawing(e, q.id)}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      draw(e, q.id);
                    }}
                    onTouchEnd={() => stopDrawing(q.id)}
                  />
                </div>

                <div className="sentence-wrapper-wb-unit8-p4-q1">
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
                              className={`inline-input-wb-unit4-p1-q2 ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                              style={{
                                background: snapshot.isDraggingOver
                                  ? "#e3f2fd"
                                  : "transparent",
                                display: "inline-block",
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

export default WB_Unit8_Page4_Q1;
