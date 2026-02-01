import "./WB_Unit7_Page5_Q1.css";
import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U7/U7P43EXEI-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P43EXEI-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P43EXEI-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P43EXEI-04.svg";
import img5 from "../../../assets/U1 WB/U7/U7P43EXEI-05.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit7_Page5_Q1 = () => {
  // الإجابات المدخلة من الطالب
  const [answers, setAnswers] = useState([null, null, null, null, null]);

  // النتيجة لكل خانة (صح/غلط)
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // الإجابات الصحيحة
  const correctData = ["2", "5", "3", "4", "1"];
  const numberBank = ["1", "2", "3", "4", "5"];

  // البيانات
  const options = [
    { img: img1 },
    { img: img2 },
    { img: img3 },
    { img: img4 },
    { img: img5 },
  ];
  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;
    const value = draggableId.replace("num-", "");

    // لازم يكون إسقاط على input
    if (!destination.droppableId.startsWith("drop-")) return;

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

  // تحديث خانة الإدخال
  const handleChange = (index, value) => {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    setShowResult([]);
    setShowAnswer(false);
  };
  const handleShowAnswer = () => {
    setShowAnswer(true); // تفعيل وضع إظهار الإجابات
    setShowResult([]); // إخفاء إكسات
    setAnswers(correctData); // تعبئة كل الخانات بالإجابات الصحيحة
  };

  const checkAnswers = () => {
    if (showAnswer) return;
    // ❗ الخطوة 1: فحص الخانات الفارغة
    if (answers.some((v) => v === null)) {
      ValidationAlert.info("Please fill all answer boxes before checking!");
      return; // وقف التشييك
    }

    // ❗ الخطوة 2: مقارنة كل خانة
    const results = answers.map((value, index) => {
      return value === correctData[index] ? "correct" : "wrong";
    });

    setShowResult(results);
    setShowAnswer(true);
    // ❗ الخطوة 3: حساب السكور
    const correctCount = results.filter((r) => r === "correct").length;
    const total = correctData.length;
    const scoreMsg = `${correctCount} / ${total}`;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${scoreMsg}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(resultHTML);
    else if (correctCount === 0) ValidationAlert.error(resultHTML);
    else ValidationAlert.warning(resultHTML);
  };
  // زر الريست
  const resetAnswers = () => {
    setAnswers(["", "", "", "", ""]);
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
            gap: "5px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">I</span>Read and number the pictures.
          </h5>
          <div
            className="word-container-wb-unit7-p5-q1"
            style={{
              display: "flex",
              // gap: "5px",
              padding: "5px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Droppable droppableId="number-bank" direction="horizontal">
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
                    justifyContent: "center",
                    // marginBottom: "20px",
                  }}
                >
                  {numberBank.map((num, index) => (
                    <Draggable
                      key={num}
                      draggableId={`num-${num}`}
                      index={index}
                      isDragDisabled={showAnswer}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            width: "30px",
                            height: "30px",
                            border: "2px solid #2c5287",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            background: "white",
                            cursor: "grab",
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

            {[
              "Are you happy? Yes, I am.",
              "What’s the matter? I’m bored.",
              "Are you sad? No, I’m not. I’m hungry.",
              "What’s the matter? I’m cold",
              "Are you scared? Yes, I am.",
            ].map((item, index) => {
              return (
                <div className="sentence-container-wb-unit7-p5-q1">
                  {/* <Droppable droppableId="number-bank" direction="horizontal">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Draggable
                          key={index + 1}
                          draggableId={`num-${index + 1}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                width: "25px",
                                height: "25px",
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
                              {index + 1}
                            </div>
                          )}
                        </Draggable>

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable> */}

                  <span className="num">{index + 1}</span>
                  <p>{item}</p>
                </div>
              );
            })}
          </div>
          {/* الصور */}
          <div className="wb-unit7-p5-q1-grid">
            {options.map((item, index) => (
              <div key={index} className="wb-unit7-p5-q1-box">
                <img src={item.img} className="unit3-q3-image" alt="" />

                {/* إدخال الإجابة */}
                <div className="wb-unit7-p5-q1-input-wrapper">
                  <Droppable droppableId={`drop-${index}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`wb-unit7-p5-q1-input ${
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
                    <div className="unit3-q3-wrong"> ✕</div>
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

export default WB_Unit7_Page5_Q1;
