import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page8_Q2.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function WB_Unit1_Page8_Q2() {
  const correctWords = ["table", "dish", "duck", "tiger", "taxi", "deer"];

  const [columnD, setColumnD] = useState(["", "", ""]);
  const [columnT, setColumnT] = useState(["", "", ""]);
  const [wrong, setWrong] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [locked, setLocked] = useState(false);
  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;
    const word = draggableId.split("-").slice(1, -1).join("-");

    const [col, index] = destination.droppableId.split("-");

    let newColumnD = [...columnD];
    let newColumnT = [...columnT];

    // ⭐ إزالة الكلمة من أي مكان سابق
    newColumnD = newColumnD.map((v) => (v === word ? "" : v));
    newColumnT = newColumnT.map((v) => (v === word ? "" : v));

    if (col === "d") {
      newColumnD[index] = word;
    } else {
      newColumnT[index] = word;
    }

    setColumnD(newColumnD);
    setColumnT(newColumnT);
    setWrong([]);
  };

  const checkAnswers = () => {
    if (showAnswer ||locked) return;

    // 1️⃣ تأكد من عدم وجود خانات فارغة (عدا index 0)
    const allInputs = [...columnD, ...columnT];
    const hasEmpty = allInputs.some((w) => w.trim() === "");

    if (hasEmpty) {
      return ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
    }

    // 2️⃣ فحص الإجابات
    let wrongWords = [];
    setLocked(true);
    // عمود D (لكن بدون أول خانة)
    columnD.forEach((w) => {
      if (!correctWords.includes(w) || !w.startsWith("d")) wrongWords.push(w);
    });

    // عمود T
    columnT.forEach((w) => {
      if (!correctWords.includes(w) || !w.startsWith("t")) wrongWords.push(w);
    });

    setWrong(wrongWords);

    const total = correctWords.length; // حذف أول كلمة من السكور
    const correctCount = total - wrongWords.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const showCorrectAnswers = () => {
    setColumnD(correctWords.filter((w) => w.startsWith("d")));
    setColumnT(correctWords.filter((w) => w.startsWith("t")));
    setWrong([]);
    setShowAnswer(true);
  };

  const reset = () => {
    setColumnD(["", "", ""]);
    setColumnT(["", "", ""]);
    setWrong([]);
    setShowAnswer(false);
    setLocked(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper" style={{ padding: "30px" }}>
        <div className="div-forall" style={{ width: "60%" }}>
          <h3 className="header-title-page8">
            <span className="ex-A">B</span>
            Read and write the words in the correct column.
          </h3>

          <Droppable droppableId="word-bank" direction="horizontal">
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
                          margin: "10px 0",
                          alignItems:"center",
                          justifyContent:"center"
                        }}
              >
                {correctWords.map((w, i) => (
                  <Draggable
                    key={`bank-${w}-${i}`}
                    draggableId={`bank-${w}-${i}`}
                    index={i}
                    isDragDisabled={locked || showAnswer}
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
                        {w}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="table-div-wb-u1-p8-q2">
            <table className="sorting-table-wb-u1-p8-q2">
              <thead>
                <tr>
                  <th>d</th>
                  <th>t</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2].map((row, i) => (
                  <tr key={i}>
                    <td style={{ position: "relative" }}>
                      <Droppable droppableId={`d-${i}`}>
                        {(provided, snapshot) => (
                          <input
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`missing-input-wb-unit1-p8-q2 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            value={columnD[i]}
                            readOnly
                            disabled={showAnswer || locked}
                          />
                        )}
                      </Droppable>

                      {wrong.includes(columnD[i]) &&
                        columnD[i].trim() !== "" && (
                          <span className="wrong-x-circle-wb-u1-p8-q2">✕</span>
                        )}
                    </td>

                    <td style={{ position: "relative" }}>
                      <Droppable droppableId={`t-${i}`}>
                        {(provided, snapshot) => (
                          <input
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`missing-input-wb-unit1-p8-q2 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            value={columnT[i]}
                            readOnly
                            disabled={showAnswer || locked}
                          />
                        )}
                      </Droppable>

                      {wrong.includes(columnT[i]) &&
                        columnT[i].trim() !== "" && (
                          <span className="wrong-x-circle-wb-u1-p8-q2">✕</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={showCorrectAnswers}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
}
