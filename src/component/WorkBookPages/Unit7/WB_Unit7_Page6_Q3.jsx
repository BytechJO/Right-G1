import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit7_Page6_Q3.css";
import img1 from "../../../assets/U1 WB/U7/U7P44EXEC-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P44EXEC-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P44EXEC-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P44EXEC-04.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  {
    parts: [
      {
        before: "My",
        middleImg: img1,
        blank: 1,
        after: "",
      },
      {
        before: "is on my",
        middleImg: img2,
        blank: 2,
        after: ".",
      },
    ],
    correct: ["hat", "hand"],
  },
  {
    parts: [
      {
        before: "There is",
        middleImg: img3,
        blank: 1,
        after: "",
      },
      {
        before: "on the",
        middleImg: img4,
        blank: 2,
        after: ".",
      },
    ],
    correct: ["water", "window"],
  },
];

const WB_Unit7_Page6_Q3 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill("")),
  );

  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

  const wordBank = [
    { id: "w1", text: "hat" },
    { id: "w2", text: "hand" },
    { id: "w3", text: "water" },
    { id: "w4", text: "window" },
  ];

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { draggableId, destination } = result;

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      // 1️⃣ شيل الكلمة من أي مكان قديم
      copy.forEach((row, qi) => {
        row.forEach((val, bi) => {
          if (val === draggableId) {
            copy[qi][bi] = "";
          }
        });
      });

      // 2️⃣ إذا نزلت على خانة
      if (destination.droppableId.startsWith("drop-")) {
        const [qIndex, blankIndex] = destination.droppableId
          .replace("drop-", "")
          .split("-")
          .map(Number);

        copy[qIndex][blankIndex] = draggableId;
      }

      // 3️⃣ إذا رجعت للـ word-bank → ما نعمل شي (بس تنشال من الخانة)
      return copy;
    });

    setWrongInputs([]);
  };

  const getWordText = (id) => wordBank.find((w) => w.id === id)?.text || "";

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — لا تعديل بعد Show Answer
    // 1) افحص إذا في أي خانة فاضية
    const hasEmpty = answers.some((arr) =>
      arr.some((val) => val.trim() === ""),
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    // 2) اجمع كل الأخطاء
    let wrong = [];
    let correctCount = 0;

    answers.forEach((arr, qIndex) => {
      arr.forEach((val, blankIndex) => {
        const userWord = getWordText(val); // حوّلي ID → نص

        if (userWord === data[qIndex].correct[blankIndex]) {
          correctCount++;
        } else {
          wrong.push(`${qIndex}-${blankIndex}`);
        }
      });
    });

    setWrongInputs(wrong);

    // 3) احسب العدد الكلي للحقول
    const totalInputs = data.reduce(
      (acc, item) => acc + item.correct.length,
      0,
    );

    // 4) اختر اللون حسب السكور
    let color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${totalInputs}
      </span>
    </div>
  `;
    setLocked(true); // ⭐ NEW — قفل التعديل بعد Check
    // 5) طباعة النتيجة
    if (correctCount === totalInputs) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    const filled = data.map((item) =>
      item.correct.map((correctWord) => {
        const found = wordBank.find((w) => w.text === correctWord);
        return found ? found.id : "";
      }),
    );

    setAnswers(filled);
    setWrongInputs([]);
    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper">
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            position: "relative",
            width: "60%",
          }}
        >
          <h3 className="header-title-page8">
            <span className="ex-A">C</span> Look and write. Then say.
          </h3>

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
                  marginBottom: 20,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {wordBank.map((word, index) => (
                  <Draggable
                    key={word.id}
                    draggableId={word.id}
                    index={index}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <div
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
                        {word.text}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {data.map((item, qIndex) => (
            <div className="row-missing" key={qIndex}>
              <span className="num">{qIndex + 1}.</span>

              <div className="sentence-review10-p2-q3">
                {item.parts.map((p, blankIndex) => (
                  <span
                    key={blankIndex}
                    className="sentence-part"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {p.before}

                    <div className="input-wrapper-wb-unit7-p6-q3">
                      <Droppable droppableId={`drop-${qIndex}-${blankIndex}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`missing-input-wb-unit7-p6-q3  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "transparent",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {getWordText(answers[qIndex][blankIndex])}
                            {wrongInputs.includes(
                              `${qIndex}-${blankIndex}`,
                            ) && (
                              <span className="wrong-icon-review4-p2-q1">
                                ✕
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    {p.after}
                    <img src={p.middleImg} className="middle-img" alt="" />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="action-buttons-container">
          <button
            className="try-again-button"
            onClick={() => {
              setAnswers(data.map((d) => Array(d.correct.length).fill("")));
              setWrongInputs([]);
              setLocked(false); // ⭐ NEW — فتح التعديل من جديد
            }}
          >
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ NEW BUTTON */}
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

export default WB_Unit7_Page6_Q3;
