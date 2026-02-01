import "./WB_Unit8_Page5_Q1.css";
import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U8/U8P49EXEI-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P49EXEI-02.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// import img3 from "../../../assets/unit3/imgs3/P26exeB-03.svg";
// import img4 from "../../../assets/unit3/imgs3/P26exeB-04.svg";
const WB_Unit8_Page5_Q1 = () => {
  // الإجابات المدخلة من الطالب
  const [answers, setAnswers] = useState(["", "", "", "", ""]);

  // النتيجة لكل خانة (صح/غلط)
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // الإجابات الصحيحة
  const correctData = ["4", "5", "1", "3", "2"];
  const numberBank = ["1", "2", "3", "4", "5"];

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const number = result.draggableId;
    const targetIndex = Number(result.destination.droppableId);

    setAnswers((prev) => {
      const copy = [...prev];

      // إزالة الرقم من أي مكان سابق (منع التكرار)
      copy.forEach((v, i) => {
        if (v === number) copy[i] = "";
      });

      // وضعه بالمكان الجديد
      copy[targetIndex] = number;
      return copy;
    });

    setShowResult([]);
  };

  const words = [
    "This is my leg.",
    "This is my arm.",
    "This is my head.",
    "This is my eye.",
    "This is my nose.",
  ];

  // تحديث خانة الإدخال

  const handleShowAnswer = () => {
    setShowAnswer(true); // تفعيل وضع إظهار الإجابات
    setShowResult([]); // إخفاء إكسات
    setAnswers(correctData); // تعبئة كل الخانات بالإجابات الصحيحة
  };

  const checkAnswers = () => {
    if (showAnswer) return;
    // ❗ الخطوة 1: فحص الخانات الفارغة
    if (answers.includes("")) {
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
            gap: "15px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">I</span>Look and number.
          </h5>
          {/* الصور */}
          <div className="look-number-wrapper">
            <div className="image-area">
              <img src={img1} alt="boy" style={{ height: "300px" }} />

              {/* inputs فوق الصورة */}
              <Droppable droppableId="0" isDropDisabled={showAnswer}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`number-input ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      top: "14%",
                      left: "14%",
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {answers[0]}
                    {showResult[0] === "wrong" && (
                      <span className="wrong-circle">✕</span>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="1" isDropDisabled={showAnswer}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`number-input ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      top: "15%",
                      left: "77%",
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {answers[1]}{" "}
                    {showResult[1] === "wrong" && (
                      <span className="wrong-circle">✕</span>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="2" isDropDisabled={showAnswer}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`number-input ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      top: "61%",
                      left: "18%",
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {answers[2]}{" "}
                    {showResult[2] === "wrong" && (
                      <span className="wrong-circle">✕</span>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="image-area">
              <img src={img2} alt="boy" style={{ height: "300px" }} />
              {/* inputs فوق الصورة */}
              <Droppable droppableId="3">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`number-input ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      top: "5%",
                      left: "82%",
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {answers[3]}{" "}
                    {showResult[3] === "wrong" && (
                      <span className="wrong-circle">✕</span>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="4" isDropDisabled={showAnswer}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`number-input ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      top: "36%",
                      left: "82%",
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {answers[4]}{" "}
                    {showResult[4] === "wrong" && (
                      <span className="wrong-circle">✕</span>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
          <Droppable droppableId="numbers" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="word-container-wb-unit8-p5-q1"
              >
                {numberBank.map((n, i) => (
                  <Draggable
                    key={n}
                    draggableId={n}
                    index={i}
                    isDragDisabled={showAnswer}
                  >
                    {(provided) => (
                      <div className="sentence-container-wb-unit8-p5-q1">
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            width: 40,
                            height: 40,
                            border: "2px solid #2c5287",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            background: "white",
                            cursor: "grab",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {n}
                        </div>
                        <p className="sentence-wb-unit7-p5-q1">{words[i]}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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

export default WB_Unit8_Page5_Q1;
