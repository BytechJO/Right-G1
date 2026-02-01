import React, { useState } from "react";
import "./WB_Unit8_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U8/U8P50EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P50EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U8/U8P50EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U8/U8P50EXEA-04.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  { img: img1, scrambled: "beazr", answer: "z", pattern: "ebra" },
  { img: img2, scrambled: "ksoc", answer: "s", pattern: "ock" },
  {
    img: img3,
    scrambled: "perpzi",
    answer: "z",
    pattern: "ipper",
  },

  { img: img4, scrambled: "ozo", answer: "s", pattern: "un" },
];

const WB_Unit8_Page6_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false),
  );
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW
  const lettersBank = [...new Set(data.map((item) => item.answer))].map(
    (letter, i) => ({
      id: `l-${i}`,
      value: letter,
    }),
  );

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const letter = result.draggableId;
    const targetIndex = Number(result.destination.droppableId);

    setInputs((prev) => {
      const copy = [...prev];
      copy[targetIndex] = letter; // ✔ نفس الحرف مسموح يتكرر
      return copy;
    });

    setWrongInputs(Array(data.length).fill(false));
  };

  const checkAnswers = () => {
    if (showAnswer) return; // ❌ ممنوع التعديل بعد Show Answer

    if (inputs.some((val) => val.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the answers before checking.",
      );
      return;
    }

    let correctCount = 0;
    const wrongFlags = [];

    data.forEach((item, index) => {
      if (inputs[index].toLowerCase() === item.answer) {
        correctCount++;
        wrongFlags[index] = false;
      } else {
        wrongFlags[index] = true;
      }
    });

    setWrongInputs(wrongFlags);
    setShowAnswer(true)
    const total = data.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const handleShowAnswer = () => {
    const correct = data.map((item) => item.answer);
    setInputs(correct); // ⭐ تعبئة الإجابة الصحيحة
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(true);
  };

  const reset = () => {
    setInputs(Array(data.length).fill(""));
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(false);
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
            gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <div className="unscramble-container">
            <h3 className="header-title-page8">
              <span className="ex-A">A</span> Write the missing letters. Say the
              words.
            </h3>

            <Droppable droppableId="letters" direction="horizontal">
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
                    // marginBottom: "20px",
                    justifyContent: "center",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {lettersBank.map((l, i) => (
                    <Draggable key={l.id} draggableId={l.value} index={i} isDragDisabled={showAnswer}>
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
                            fontSize: "22px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {l.value}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="unscramble-row-wb-unit8-p6-q1 ">
              {data.map((item, index) => (
                <div className="unscramble-box" key={index}>
                  <div className="img-box">
                    <img src={item.img} alt="" />
                  </div>
                  <div className="input-row">
                    <span
                      className="num"
                      style={{ fontSize: "25px", fontWeight: "600" }}
                    >
                      {index + 1}
                    </span>

                    <div className="input-wrapper">
                      <Droppable droppableId={String(index)} isDropDisabled={showAnswer}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`text-input ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "white",
                              fontSize: "25px",
                              fontWeight: "600",
                            }}
                          >
                            {inputs[index]}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* ❌ علامة الخطأ */}
                      {wrongInputs[index] &&(
                        <div className="error-icon">✕</div>
                      )}
                    </div>

                    <span className="pattern" style={{ fontSize: "22px" }}>
                      {item.pattern}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ⭐ BUTTONS */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
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

export default WB_Unit8_Page6_Q1;
