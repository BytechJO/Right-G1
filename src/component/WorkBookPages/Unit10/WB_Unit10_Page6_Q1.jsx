import React, { useState } from "react";
import "./WB_Unit10_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U10/U10P62EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U10/U10P62EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U10/U10P62EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U10/U10P62EXEA-04.svg";
import img5 from "../../../assets/U1 WB/U10/U10P62EXEA-05.svg";
import img6 from "../../../assets/U1 WB/U10/U10P62EXEA-06.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  { img: img1, scrambled: "geg", answer: "egg", pattern: "geg" },
  { img: img2, scrambled: "ent", answer: "net", pattern: "ent" },
  {
    img: img3,
    scrambled: "tej",
    answer: "jet",
    pattern: "tej",
  },

  { img: img4, scrambled: "ebd", answer: "bed", pattern: "ebd" },
  { img: img5, scrambled: "neh", answer: "hen", pattern: "neh" },
  { img: img6, scrambled: "nte", answer: "ten", pattern: "nte" },
];

const WB_Unit10_Page6_Q1 = () => {
  const [inputs, setInputs] = useState(
    Array.from({ length: data.length }, () => []),
  );

  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false),
  );
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;

    // لازم يكون الدروب على drop-* فقط
    if (!destination.droppableId.startsWith("drop-")) return;

    const qIndex = Number(destination.droppableId.replace("drop-", ""));
    if (Number.isNaN(qIndex) || qIndex < 0 || qIndex >= data.length) return;

    setInputs((prev) => {
      const copy = prev.map((arr) => (Array.isArray(arr) ? [...arr] : []));

      // تأكيد وجود مصفوفة لهذا السؤال
      if (!Array.isArray(copy[qIndex])) copy[qIndex] = [];

      // ✅ منع إضافة نفس النسخة مرتين داخل نفس الكلمة
      if (copy[qIndex].includes(draggableId)) return copy;

      // ✅ دايمًا ضيفه آخر الكلمة
      copy[qIndex].push(draggableId);

      return copy;
    });

    setWrongInputs(Array(data.length).fill(false));
  };

  const checkAnswers = () => {
    if (showAnswer) return; // ❌ ممنوع التعديل بعد Show Answer

    if (inputs.some((arr) => arr.length === 0)) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the answers before checking.",
      );
      return;
    }

    let correctCount = 0;
    const wrongFlags = [];

    data.forEach((item, index) => {
      const word = inputs[index]
        .map((id) => id.split("-")[1]) // خذ الحرف فقط
        .join("")
        .toLowerCase();

      if (word === item.answer) {
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
  const correct = data.map((item, qIndex) =>
    item.answer.split("").map((ch, i) => `${qIndex}-${ch}-${i}`),
  );

  setInputs(correct);
  setWrongInputs(Array(data.length).fill(false));
  setShowAnswer(true);
};

  const reset = () => {
    setInputs(Array.from({ length: data.length }, () => []));
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
              <span className="ex-A">A</span>Look, unscramble, and write. words.
            </h3>

            <div className="unscramble-row-wb-unit10-p6-q1 ">
              {data.map((item, index) => (
                <div className="unscramble-box-wb-unit10-p6-q1" key={index}>
                  <div className="img-box-wb-unit10-p6-q1">
                    <span
                      className="num"
                      style={{ fontSize: "25px", fontWeight: "600" }}
                    >
                      {index + 1}
                    </span>{" "}
                    <img
                      src={item.img}
                      alt=""
                      className="img-wb-unit10-p6-q1"
                    />
                  </div>
                  <div className="input-row">
                    <span className="pattern" style={{ fontSize: "22px" }}>
                      <Droppable
                        droppableId={`bank-${index}`}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ display: "flex", gap: "8px" }}
                          >
                            {item.scrambled.split("").map((ch, i) => (
                              <Draggable
                                key={`${index}-${ch}-${i}`}
                                draggableId={`${index}-${ch}-${i}`}
                                index={i}
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
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "bold",
                                      cursor: "grab",
                                      background: "white",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {ch}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </span>
                    <div className="input-wrapper">
                      <Droppable
                        droppableId={`drop-${index}`}
                        direction="horizontal"
                        isDropDisabled={showAnswer}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`text-input ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              display: "flex",
                              gap: "6px",
                              minHeight: "40px",
                              alignItems: "center",
                              fontSize:"20px",
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "white",
                            }}
                          >
                            {inputs[index]
                              .map((id) => id.split("-")[1])
                              .join("")}
                            {provided.placeholder}
                            {wrongInputs[index] && (
                              <div className="error-icon">✕</div>
                            )}
                          </div>
                        )}
                      </Droppable>

                      {/* ❌ علامة الخطأ */}
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

export default WB_Unit10_Page6_Q1;
