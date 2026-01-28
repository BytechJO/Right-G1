import React, { useState } from "react";
import bat from "../../../assets/unit6/imgs/U6P51EXEE-01.svg";
import cap from "../../../assets/unit6/imgs/U6P51EXEE-02.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page6_Q2.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit6_Page6_Q2 = () => {
  const items = [
    { img: bat, correct: "can", correctInput: "can swim.", input: "She" },
    {
      img: cap,
      correct: "can't",
      correctInput: "He can’t fly a kite.",
      input: "",
    },
  ];

  const [selected, setSelected] = useState(["", ""]);
  const [answers, setAnswers] = useState(["", ""]);
  const [locked, setLocked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const value = draggableId.replace("word-", "").replace("filled-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      // منع التكرار
      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = "";

      updated[index] = value;
      return updated;
    });

    setShowResult(false);
  };

  const handleSelect = (value, index) => {
    if (locked) return; // 🔒 لا تعديل بعد show answer
    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);
    setShowResult(false);
  };

  const resetAll = () => {
    setSelected(["", ""]);
    setAnswers(["", ""]);
    setWrongInputs([]);
    setShowResult(false);
    setLocked(false); // 🔒 قفل كل شيء
  };
  const showAnswers = () => {
    // حط الدوائر الصح
    const correctCircles = items.map((item) => item.correct);

    // حط الكتابة الصحيحة
    const correctTexts = items.map((item) => item.correctInput);

    setSelected(correctCircles);
    setAnswers(correctTexts);
    setWrongInputs([]);
    setShowResult(false);

    setLocked(true); // 🔒 قفل كل شيء
  };

  const checkAnswers = () => {
    if (locked) return;
    // 1) التشييك إذا في دائرة مش مختارة
    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose a circle (f or v) for all items!");
      return;
    }

    // 2) التشييك إذا في input فاضي
    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all the writing boxes!");
      return;
    }

    let wrong = [];
    let score = 0;
    setLocked(true);
    items.forEach((item, i) => {
      const circleCorrect = selected[i] === item.correct;
      const inputCorrect =
        answers[i].trim().toLowerCase() === item.correctInput.toLowerCase();

      // نقطة للدائرة + نقطة للكتابة
      if (circleCorrect) score++;
      if (inputCorrect) score++;

      if (!circleCorrect || !inputCorrect) {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowResult(true);

    const total = items.length * 2; // 8 نقاط
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
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
            <span className="ex-A">E</span> Look, circle, and write.
          </h5>

          <Droppable droppableId="bank" isDropDisabled>
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
                  alignItems: "center",justifyContent:"center"
                }}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.correctInput}
                    draggableId={`word-${item.correctInput}`}
                    index={index}
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
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.correctInput}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="question-grid-unit6-page6-q2">
            {items.map((item, i) => (
              <div className="question-box-unit4-page5-q1" key={i}>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                    color: "#1d4f7b",
                  }}
                >
                  {i + 1}
                </span>
                <div className="img-option-unit6-p6-q2">
                  <img
                    src={item.img}
                    className="q-img-unit4-page5-q1"
                    style={{ height: "auto", width: "200px" }}
                  />

                  {/* f / v choices */}
                  <div className="choices-unit6-page6-q2 ">
                    <div className="circle-wrapper">
                      <div
                        className={`circle-choice-unit6-page6-q2  ${
                          selected[i] === "can" ? "active" : ""
                        }`}
                        onClick={() => !locked && handleSelect("can", i)}
                      >
                        can
                      </div>

                      {/* X فوق دائرة f إذا كانت غلط */}
                      {showResult &&
                        selected[i] === "can" &&
                        selected[i] !== item.correct && (
                          <div className="wrong-mark">✕</div>
                        )}
                    </div>

                    <div className="circle-wrapper">
                      <div
                        className={`circle-choice-unit6-page6-q2 ${
                          selected[i] === "can't" ? "active" : ""
                        }`}
                        onClick={() => !locked && handleSelect("can't", i)}
                      >
                        can't
                      </div>

                      {/* X فوق دائرة v إذا كانت غلط */}
                      {showResult &&
                        selected[i] === "can't" &&
                        selected[i] !== item.correct && (
                          <div className="wrong-mark">✕</div>
                        )}
                    </div>
                  </div>
                </div>
                {/* writing input */}
                <div className="input-wrapper-unit6-p6-q2">
                  {item.input}
                  <Droppable droppableId={`slot-${i}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`write-input-unit4-page5-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[i] && (
                          <Draggable
                            draggableId={`filled-${answers[i]}`}
                            index={0}
                            isDragDisabled={locked}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[i]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* X فوق الإنبت إذا كانت الكلمة غلط */}
                  {showResult &&
                    answers[i].trim() !== "" &&
                    answers[i].trim().toLowerCase() !==
                      item.correctInput.toLowerCase() &&
                    wrongInputs.includes(i) && (
                      <div className="wrong-mark">✕</div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
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

export default Unit6_Page6_Q2;
