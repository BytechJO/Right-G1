import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/U1 WB/U2/U2P11EXEF-01.svg";
import cap from "../../../assets/U1 WB/U2/U2P11EXEF-02.svg";
import ant from "../../../assets/U1 WB/U2/U2P11EXEF-03.svg";
import dad from "../../../assets/U1 WB/U2/U2P11EXEF-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./WB_Unit2_Page3_Q2.css";
const WB_Unit2_Page3_Q2 = () => {
  const correctAnswers = ["Thursday", "Sunday", "Tuesday", "Saturday"];
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { draggableId, destination } = result;

    // نسمح فقط بالدروب على inputs
    if (!destination.droppableId.startsWith("input-")) return;

    const targetIndex = Number(destination.droppableId.replace("input-", ""));
    const word = draggableId.replace("word-", "");

    setAnswers((prev) => {
      const updated = [...prev];

      // 🔍 نعرف وين الكلمة موجودة حاليًا (إذا كانت موجودة)
      const sourceIndex = updated.findIndex((w) => w === word);

      // إذا نفس المكان → لا نعمل شي
      if (sourceIndex === targetIndex) return prev;

      const targetWord = updated[targetIndex];

      // 🔁 swap
      updated[targetIndex] = word;

      if (sourceIndex !== -1) {
        updated[sourceIndex] = targetWord || "";
      }

      return updated;
    });

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (locked) return;
    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];
    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        tempScore++;
      } else {
        wrong.push(i); // خزن رقم السؤال الغلط بدل الكلمة
      }
    });
    setWrongInputs(wrong);
    setLocked(true);
    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${tempScore} / ${total}
      </span>
    </div>
  `;

    if (tempScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (tempScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  const showAnswers = () => {
    setAnswers(correctAnswers); // ضع كل الإجابات الصحيحة
    setWrongInputs([]); // اخفاء الأخطاء
    setLocked(true); // 🔒 قفل التعديل
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setLocked(false); // ⬅ مهم
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="question-wrapper-unit3-page6-q1"
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
            //   gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">F</span>Read, look, and write.
          </h5>

          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="word-bank-wb-unit2-page3-q2"
              >
                {correctAnswers.map((w, i) => (
                  <Draggable
                    key={w}
                    draggableId={`word-${w}`}
                    index={i}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="word-box-wb-u1-p8-q2"
                      >
                        {w}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="row-content10-wb-unit2-page3-q2">
            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">1</span>
                <img src={bat} alt="" className="q-img-wb-unit2-page3-q2" />
              </div>
              <div
                className="input-wrapper-unit3-page6-q1"
                style={{ position: "relative" }}
              >
                <Droppable droppableId="input-0">
                  {(provided, snapshot) => (
                    <input
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      type="text"
                      className="q-input-unit3-page6-q1"
                      value={answers[0]}
                      readOnly
                      style={{
                        background: snapshot.isDraggingOver
                          ? "#e3f2fd"
                          : "white",
                      }}
                      disabled={locked}
                    />
                  )}
                </Droppable>

                { wrongInputs.includes(0) && (
                  <span className="error-mark-input-wb-unit2-page3-q2">✕</span>
                )}
              </div>
            </div>

            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">2</span>{" "}
                <img src={cap} alt="" className="q-img-wb-unit2-page3-q2" />
              </div>
              <div
                className="input-wrapper-unit3-page6-q1"
                style={{ position: "relative" }}
              >
                <Droppable droppableId="input-1">
                  {(provided, snapshot) => (
                    <input
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      type="text"
                      className="q-input-unit3-page6-q1"
                      value={answers[1]}
                      readOnly
                      style={{
                        background: snapshot.isDraggingOver
                          ? "#e3f2fd"
                          : "white",
                      }}
                      disabled={locked}
                    />
                  )}
                </Droppable>

                {wrongInputs.includes(1) && (
                  <span className="error-mark-input">✕</span>
                )}
              </div>
            </div>

            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">3</span>{" "}
                <img src={ant} alt="" className="q-img-wb-unit2-page3-q2" />
              </div>
              <div
                className="input-wrapper-unit3-page6-q1"
                style={{ position: "relative" }}
              >
                <Droppable droppableId="input-2">
                  {(provided, snapshot) => (
                    <input
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      type="text"
                      className="q-input-unit3-page6-q1"
                      value={answers[2]}
                      readOnly
                      style={{
                        background: snapshot.isDraggingOver
                          ? "#e3f2fd"
                          : "white",
                      }}
                      disabled={locked}
                    />
                  )}
                </Droppable>

                { wrongInputs.includes(2) && (
                  <span className="error-mark-input-wb-unit2-page3-q2">✕</span>
                )}
              </div>
            </div>

            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">4</span>

                <img src={dad} alt="" className="q-img-wb-unit2-page3-q2" />
              </div>

              <div
                className="input-wrapper-unit3-page6-q1"
                style={{ position: "relative" }}
              >
                <Droppable droppableId="input-3">
                  {(provided, snapshot) => (
                    <input
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      type="text"
                      className="q-input-unit3-page6-q1"
                      value={answers[3]}
                      readOnly
                      style={{
                        background: snapshot.isDraggingOver
                          ? "#e3f2fd"
                          : "white",
                      }}
                      disabled={locked}
                    />
                  )}
                </Droppable>

                { wrongInputs.includes(3) && (
                  <span className="error-mark-input-wb-unit2-page3-q2">✕</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
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

export default WB_Unit2_Page3_Q2;
