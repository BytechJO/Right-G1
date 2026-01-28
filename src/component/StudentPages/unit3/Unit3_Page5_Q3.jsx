import "./Unit3_Page5_Q3.css";
import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/unit3/imgs3/P26exeB-01.svg";
import img2 from "../../../assets/unit3/imgs3/P26exeB-02.svg";
import img3 from "../../../assets/unit3/imgs3/P26exeB-03.svg";
import img4 from "../../../assets/unit3/imgs3/P26exeB-04.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit3_Page5_Q3 = () => {
  // الإجابات المدخلة من الطالب
  const [answers, setAnswers] = useState([null, null, null, null]);

  // النتيجة لكل خانة (صح/غلط)
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // الإجابات الصحيحة
  const correctData = ["5", "3", "2", "8"];
  const numberBank = ["2", "3", "5", "8"];

  // البيانات
  const options = [{ img: img1 }, { img: img2 }, { img: img3 }, { img: img4 }];

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;

    // اسحب الرقم
    const value = draggableId.replace("num-", "");

    // رقم الخانة
    const index = Number(destination.droppableId.replace("drop-", ""));

    setAnswers((prev) => {
      const copy = [...prev];

      // شيل الرقم من مكانه القديم
      const oldIndex = copy.findIndex((v) => v === value);
      if (oldIndex !== -1) copy[oldIndex] = null;

      copy[index] = value;
      return copy;
    });

    setShowResult([]);
  };


  const handleShowAnswer = () => {
    setShowAnswer(true);
    setShowResult([]);
    setAnswers(correctData);
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    // 👈 انسخي الإجابات
    const filledAnswers = [...answers];

    // 👈 أول خانة محسوبة تلقائيًا
    filledAnswers[0] = correctData[0];

    // ❗ فحص الخانات الفارغة
    if (filledAnswers.some((v) => v === null)) {
      ValidationAlert.info("Please fill all answer boxes before checking!");
      return;
    }

    // ❗ مقارنة الإجابات
    const results = filledAnswers.map((value, index) =>
      value === correctData[index] ? "correct" : "wrong",
    );

    setShowResult(results);
setShowAnswer(true)
    // ❗ حساب السكور
    const correctCount = results.filter((r) => r === "correct").length;
    const total = correctData.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total) ValidationAlert.success(resultHTML);
    else if (correctCount === 0) ValidationAlert.error(resultHTML);
    else ValidationAlert.warning(resultHTML);
  };

  // زر الريست
  const resetAnswers = () => {
    setAnswers([null, null, null, null]);
    setShowResult([]);
    setShowAnswer(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="unit3-q3-wrapper"
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
            <span className="ex-A">B</span> Count and write.
          </h5>
          <Droppable droppableId="number-bank" direction="horizontal">
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
                  justifyContent: "center",
                }}
              >
                {numberBank.map((num, i) => (
                  <Draggable
                    key={num}
                    draggableId={`num-${num}`}
                    index={i}
                    isDragDisabled={showAnswer}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          background: "white",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {num}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* الصور */}
          <div className="unit3-q3-grid">
            {options.map((item, index) => (
              <div key={index} className="unit3-q3-box">
                <img src={item.img} className="unit3-q3-image" alt="" />

                {/* إدخال الإجابة */}
                <div className="unit3-q3-input-wrapper">
                  <Droppable
                    droppableId={`drop-${index}`}
                    isDropDisabled={showAnswer}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`unit3-q3-input  ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#e3f2fd"
                            : "white",
                        }}
                      >
                        {answers[index] || ""}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* إشارة X */}
                  {showResult[index] === "wrong" && (
                    <div className="unit3-q3-wrong">✕</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={handleShowAnswer} className="show-answer-btn">
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

export default Unit3_Page5_Q3;
