import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
// import "./Review10_Page2_Q3.css";
import img1 from "../../../assets/U1 WB/U4/U4P26EXEBC-01.svg";
import img2 from "../../../assets/U1 WB/U4/U4P26EXEBC-02.svg";
import img3 from "../../../assets/U1 WB/U4/U4P26EXEBC-03.svg";
import img4 from "../../../assets/U1 WB/U4/U4P26EXEBC-04.svg";
import img5 from "../../../assets/U1 WB/U4/U4P26EXEBC-05.svg";
import img6 from "../../../assets/U1 WB/U4/U4P26EXEBC-06.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  {
    parts: [
      {
        before: "A",
        middleImg: img1,
        blank: 1,
        after: "",
      },
      {
        before: "is driving a",
        middleImg: img4,
        blank: 2,
        after: ".",
      },
    ],
    correct: ["fish", "van"],
  },
  {
    parts: [
      {
        before: "A",
        middleImg: img2,
        blank: 1,
        after: "",
      },
      {
        before: "wearing a ",
        middleImg: img5,
        blank: 2,
        after: "",
      },
      {
        before: "is running on his bare",
        middleImg: img3,
        blank: 3,
        after: "",
      },
      {
        before: "after the van with a",
        middleImg: img6,
        blank: 4,
        after: "in his hand. ",
      },
    ],
    correct: ["vet", "vest", "feet", "fork"],
  },
];

const WB_Unit4_Page6_Q3 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill("")),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const word = result.draggableId;
    const dest = result.destination.droppableId;

    // blank-qIndex-blankIndex
    const [, qIndex, blankIndex] = dest.split("-").map(Number);

    const updated = answers.map((arr) => [...arr]);

    // ⭐ امسح الكلمة من أي مكان قديم
    updated.forEach((row) => {
      row.forEach((val, i) => {
        if (val === word) row[i] = "";
      });
    });

    // ⭐ حط الكلمة بالمكان الجديد
    updated[qIndex][blankIndex] = word;

    setAnswers(updated);

    setWrongInputs((prev) =>
      prev.filter((w) => w !== `${qIndex}-${blankIndex}`),
    );
  };

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
        if (val.trim() === data[qIndex].correct[blankIndex]) {
          correctCount++; // صح
        } else {
          wrong.push(`${qIndex}-${blankIndex}`); // غلط
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
    const correctFilled = data.map((d) => [...d.correct]);

    setAnswers(correctFilled); // ضع الإجابات الصحيحة
    setWrongInputs([]); // إزالة الأخطاء
    setLocked(true); // قفل الحقول
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
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                  width:"100%"
                }}
              >
                {data
                  .flatMap((d) => d.correct)
                  .map((word, i) => (
                    <Draggable
                      draggableId={word}
                      index={i}
                      key={word}
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
                          {word}
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

              <div className="sentence-wb-unit4-p6-q3">
                {item.parts.map((p, blankIndex) => (
                  <span
                    key={blankIndex}
                    className="sentence-part"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {p.before}

                    <div className="input-wrapper-wb-unit4-p6-q3 ">
                      <Droppable
                        droppableId={`blank-${qIndex}-${blankIndex}`}
                        isDropDisabled={locked}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`missing-input-wb-unit4-p6-q3 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "",
                              position: "relative",
                            }}
                          >
                            {answers[qIndex][blankIndex]}

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

export default WB_Unit4_Page6_Q3;
