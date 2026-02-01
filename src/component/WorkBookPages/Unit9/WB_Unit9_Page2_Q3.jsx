import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U9/U9P52EXEE-01.svg";
import img2 from "../../../assets/U1 WB/U9/U9P52EXEE-02.svg";
import img3 from "../../../assets/U1 WB/U9/U9P52EXEE-03.svg";
import img4 from "../../../assets/unit3/imgs3/P26exeB-04.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./WB_Unit9_Page2_Q3.css";
const WB_Unit9_Page2_Q3 = () => {
  // الإجابات المدخلة من الطالب
  const [answers, setAnswers] = useState(["", "", ""]);

  // النتيجة لكل خانة (صح/غلط)
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // الإجابات الصحيحة
  const correctData = ["2", "3", "1"];
  const numberBank = [
    { id: "n1", text: "1" },
    { id: "n2", text: "2" },
    { id: "n3", text: "3" },
  ];

  // البيانات
  const options = [{ img: img1 }, { img: img2 }, { img: img3 }];
  const getNumberText = (id) => numberBank.find((n) => n.id === id)?.text || "";

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;

    setAnswers((prev) => {
      const copy = [...prev];

      // شيل الرقم من أي مكان قديم
      copy.forEach((val, i) => {
        if (val === draggableId) copy[i] = "";
      });

      // إذا نزل على صورة
      if (destination.droppableId.startsWith("drop-")) {
        const index = Number(destination.droppableId.replace("drop-", ""));
        copy[index] = draggableId;
      }

      return copy;
    });

    setShowResult([]);
  };

  // تحديث خانة الإدخال

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setShowResult([]);

    setAnswers(
      correctData.map(
        (num) => numberBank.find((n) => n.text === num)?.id || "",
      ),
    );
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
      const userValue = getNumberText(answers[index]);
      return userValue === correctData[index] ? "correct" : "wrong";
    });

    setShowResult(results);
setShowAnswer(true)
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
    setAnswers(["", "", ""]);
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
            <span className="ex-A">E</span>Read and number the pictures.
          </h5>

          <Droppable droppableId="number-bank" direction="horizontal">
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
                  justifyContent: "center",
                }}
              >
                {numberBank.map((num, index) => (
                  <Draggable
                    key={num.id}
                    draggableId={num.id}
                    index={index}
                    isDragDisabled={showAnswer}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: "2px solid #2c5287",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: "bold",
                          background: "#fff",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {num.text}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div style={{ display: "flex" }}>
            <div className="word-container-wb-unit9-p2-q3">
              {[
                "How many horses are there? There are two horses.",
                "How many chickens are there? There are five chickens.",
                "How many cats are there? There is one cat.",
              ].map((item, index) => {
                return (
                  <div className="sentence-container-wb-unit7-p5-q1">
                    <span className="number-wb-unit7-p5-q1">{index + 1}</span>{" "}
                    <p className="sentence-wb-unit8-p1-q1">{item}</p>
                  </div>
                );
              })}
            </div>
            {/* الصور */}
            <div className="wb-unit9-p2-q3-grid">
              {options.map((item, index) => (
                <div key={index} className="wb-unit9-p2-q3-box">
                  <img src={item.img} alt="" />

                  {/* إدخال الإجابة */}
                  <div className="wb-unit9-p2-q3-input-wrapper">
                    <Droppable droppableId={`drop-${index}`} isDropDisabled={showAnswer}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`wb-unit9-p2-q3-input ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "transparent",
                          }}
                        >
                          {getNumberText(answers[index])}

                          {showResult[index] === "wrong" && (
                            <div className="unit3-q3-wrong">✕</div>
                          )}

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

export default WB_Unit9_Page2_Q3;
