import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review4_Page2_Q1.css";

import sound1 from "../../../assets/unit4/sounds/U4P37EXEE.mp3";
import img1 from "../../../assets/unit4/imgs/U4P37EEXEE-01-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P37EEXEE-01-02.svg";
import img3 from "../../../assets/unit4/imgs/U4P37EEXEE-02-01.svg";
import img4 from "../../../assets/unit4/imgs/U4P37EEXEE-02-02.svg";
import img5 from "../../../assets/unit4/imgs/U4P37EEXEE-03-01.svg";
import img6 from "../../../assets/unit4/imgs/U4P37EEXEE-03-02.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const data = [
  {
    parts: [
      {
        before: "The ",
        middleImg: img1,
        blank: 1,
        after: "ork",
      },
      {
        before: " is on the ",
        middleImg: img2,
        blank: 2,
        after: "et.",
      },
    ],
    correct: ["f", "b"],
  },
  {
    parts: [
      {
        before: "The ",
        middleImg: img3,
        blank: 1,
        after: "ish",
      },
      {
        before: " is in the ",
        middleImg: img4,
        blank: 2,
        after: "an.",
      },
    ],
    correct: ["f", "v"],
  },
  {
    parts: [
      {
        before: "The ",
        middleImg: img5,
        blank: 1,
        after: "est",
      },
      {
        before: " is on my",
        middleImg: img6,
        blank: 2,
        after: "eet",
      },
    ],
    correct: ["v", "f"],
  },
];

const Review4_Page2_Q1 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill("")),
  );
  const [wrongInputs, setWrongInputs] = useState([]);

  const stopAtSecond = 5.23;

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const letter = draggableId.replace("letter-", "");
    const [qIndex, blankIndex] = destination.droppableId
      .replace("slot-", "")
      .split("-")
      .map(Number);

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = letter;
      return updated;
    });

    setWrongInputs([]);
  };

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 5.23,
      text: "Page 37, Exercise E. Listen and write the missing letters.",
    },
    {
      start: 5.25,
      end: 9.05,
      text: "1. The fork is on the vet. ",
    },
    { start: 9.07, end: 12.2, text: "2. The fish is in the van. " },
    { start: 12.22, end: 16.16, text: "3. The vest is on my feet." },
  ];

  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

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
            gsp: "20px",
          }}
        >
          <h3 className="header-title-page8">
            <span className="mr-2">E</span> Listen and drag the missing letters.
          </h3>
          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
          />

          <Droppable droppableId="letters" isDropDisabled>
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
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {["f", "b", "v"].map((l, i) => (
                  <Draggable
                    key={l}
                    draggableId={`letter-${l}`}
                    index={i}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
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
                          fontSize: "20px",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {l}
                      </span>
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

              <div className="sentence-review4-p2-q1">
                {item.parts.map((p, blankIndex) => (
                  <span
                    key={blankIndex}
                    className="sentence-part"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {p.before}

                    <div className={`input-wrapper-review4-p2-q1`}>
                      <Droppable droppableId={`slot-${qIndex}-${blankIndex}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`missing-input-review4-p2-q1  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {answers[qIndex][blankIndex] && (
                              <Draggable
                                draggableId={`filled-${answers[qIndex][blankIndex]}`}
                                index={0}
                                isDragDisabled={true}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {answers[qIndex][blankIndex]}
                                  </span>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {wrongInputs.includes(`${qIndex}-${blankIndex}`) && (
                        <span className="wrong-icon-review4-p2-q1">✕</span>
                      )}
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

export default Review4_Page2_Q1;
