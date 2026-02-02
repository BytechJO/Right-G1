import React, { useState } from "react";
import "./Unit8_Page5_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/unit8/imgs/U8P68EXEA1-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P68EXEA1-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P68EXEA1-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P68EXEA1-04.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  {
    img: img1,
    scrambled: "perpzi",
    answer: "zipper",
    pattern: "er",
  },
  { img: img2, scrambled: "ksoc", answer: "sock", pattern: "ck" },
  { img: img3, scrambled: "ozo", answer: "zoo", pattern: "oo" },
  { img: img4, scrambled: "beazr", answer: "zebra", pattern: "bra" },
];

const Unit8_Page5_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(null));

  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false),
  );
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    const value = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setInputs((prev) => {
      const updated = [...prev];

      // منع التكرار
      const oldIndex = updated.findIndex((v) => v === value);
      if (oldIndex !== -1) updated[oldIndex] = null;

      updated[index] = value;
      return updated;
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
      if (inputs[index] === item.answer) {
        correctCount++;
        wrongFlags[index] = false;
      } else {
        wrongFlags[index] = true;
      }
    });

    setWrongInputs(wrongFlags);
    setShowAnswer(true);
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
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <div className="unscramble-container">
            <h3 className="header-title-page8">
              <span className="ex-A">A</span>{" "}
              <span style={{ color: "purple" }}>1</span> Look, unscramble, and
              write.
            </h3>
            <Droppable droppableId="bank" isDropDisabled={showAnswer}>
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
                    width: "100%",
                  }}
                >
                  {data.map((item, index) => (
                    <Draggable
                      key={item.answer}
                      draggableId={`word-${item.answer}`}
                      index={index}
                      isDragDisabled={showAnswer}
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
                          {item.answer}
                        </span>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="unscramble-row">
              {data.map((item, index) => (
                <div className="unscramble-box" key={index}>
                  <div className="img-box1-unit8-p5-q1">
                    <img src={item.img} alt="" />
                  </div>

                  <p className="scrambled-word" style={{ fontSize: "22px" }}>
                    {item.scrambled}
                  </p>

                  <div className="input-row">
                    <span className="num" style={{ fontSize: "22px" }}>
                      {index + 1}
                    </span>

                    <div className="input-wrapper">
                      <Droppable
                        droppableId={`slot-${index}`}
                        isDropDisabled={showAnswer}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`text-input ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{ fontSize: "22px" }}
                          >
                            {inputs[index] && (
                              <Draggable
                                draggableId={`filled-${inputs[index]}-${index}`}
                                index={0}
                                isDragDisabled={true}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {inputs[index]}
                                  </span>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* ❌ علامة الخطأ */}
                      {wrongInputs[index] && (
                        <div className="error-icon">✕</div>
                      )}
                    </div>
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

export default Unit8_Page5_Q1;
