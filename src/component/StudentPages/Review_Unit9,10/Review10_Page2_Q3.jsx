import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review10_Page2_Q3.css";
import img1 from "../../../assets/unit10/imgs/U10P91EXEF-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P91EXEF-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P91EXEF-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P91EXEF-04.svg";
import img5 from "../../../assets/unit10/imgs/U10P91EXEF-05.svg";
import img6 from "../../../assets/unit10/imgs/U10P91EXEF-06.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const data = [
  {
    parts: [
      {
        before: "The little",
        middleImg: img1,
        blank: 1,
        after: "",
      },
      {
        before: "is in",
        middleImg: img2,
        blank: 2,
        after: "",
      },
      {
        before: "with",
        middleImg: img3,
        blank: 3,
        after: "",
      },
      {
        before: "",
        middleImg: img4,
        blank: 4,
        after: "s.",
      },
    ],
    correct: ["hen", "bed", "ten", "egg"],
  },
  {
    parts: [
      {
        before: "The",
        middleImg: img5,
        blank: 1,
        after: "",
      },
      {
        before: " is in the ",
        middleImg: img6,
        blank: 2,
        after: ".",
      },
    ],
    correct: ["net", "jet"],
  },
];

const Review10_Page2_Q3 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill("")),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

  const onDragEnd = (result) => {
  if (!result.destination || locked) return;

  const { draggableId, destination } = result;

  const [newQ, newBlank] = destination.droppableId
    .replace("blank-", "")
    .split("-")
    .map(Number);

  const draggedWord = draggableId.split("-").slice(1, -1).join("-");

  const newAnswers = answers.map((row) => [...row]);

  // ⭐⭐ دور على الكلمة القديمة واحذفها
  newAnswers.forEach((row, qIndex) => {
    row.forEach((val, bIndex) => {
      if (val === draggedWord) {
        newAnswers[qIndex][bIndex] = "";
      }
    });
  });

  // ⭐⭐ حط الكلمة بالمكان الجديد
  newAnswers[newQ][newBlank] = draggedWord;

  setAnswers(newAnswers);
  setWrongInputs([]);
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
setLocked(true)
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
          F Read, look, and write. Then, say.
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
                          alignItems:"center",justifyContent:"center",width:"100%"
                        }}
            >
              {Array.from(new Set(data.flatMap((d) => d.correct))).map(
                (word, i) => (
                  <Draggable
                    key={`bank-${word}-${i}`}
                    draggableId={`bank-${word}-${i}`}
                    index={i}
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
                ),
              )}
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

                  <div className="input-wrapper-review10-p2-q3">
                    <Droppable droppableId={`blank-${qIndex}-${blankIndex}`} isDropDisabled={locked}>
                      {(provided ,snapshot) => (
                        <input
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                       className={`letter-input-review10-p2-q3 ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          value={answers[qIndex][blankIndex]}
                          readOnly
                        />
                      )}
                    </Droppable>

                    {wrongInputs.includes(`${qIndex}-${blankIndex}`) && (
                      <span className="wrong-icon-review4-p2-q1">✕</span>
                    )}
                  </div>

                  {p.after}
                  <img src={p.middleImg} className="middle-img-review10-p2-q3 " alt="" />
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
        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answers ✓
        </button>
      </div>
    </div></DragDropContext>
  );
};

export default Review10_Page2_Q3;
