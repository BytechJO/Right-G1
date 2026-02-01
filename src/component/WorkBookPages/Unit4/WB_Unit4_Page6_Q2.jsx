import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page6_Q2.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import img1 from "../../../assets/U1 WB/U4/U4P26EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U4/U4P26EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U4/U4P26EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U4/U4P26EXEB-04.svg";
import img5 from "../../../assets/U1 WB/U4/U4P26EXEB-05.svg";
import img6 from "../../../assets/U1 WB/U4/U4P26EXEB-06.svg";

export default function WB_Unit4_Page6_Q2() {
  const correctWords = ["fish", "feet", "fork", "vet", "van", "vest"];

  const images = [img1, img2, img3, img4, img5, img6];

  const [columnD, setColumnD] = useState(["", "", ""]);
  const [columnT, setColumnT] = useState(["", "", ""]);
  const [wrong, setWrong] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const word = result.draggableId;
    const dest = result.destination.droppableId;

    if (dest.startsWith("f-")) {
      const index = Number(dest.split("-")[1]);
      const updated = [...columnD];
      updated[index] = word;
      setColumnD(updated);
    }

    if (dest.startsWith("v-")) {
      const index = Number(dest.split("-")[1]);
      const updated = [...columnT];
      updated[index] = word;
      setColumnT(updated);
    }

    setWrong((prev) => prev.filter((w) => w !== word));
  };


  const checkAnswers = () => {
    if (showAnswer) return;

    const allInputs = [...columnD, ...columnT];
    const hasEmpty = allInputs.some((w) => w.trim() === "");

    if (hasEmpty) {
      return ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
    }

    let wrongWords = [];

    columnD.forEach((w) => {
      if (!correctWords.includes(w) || !w.startsWith("f")) wrongWords.push(w);
    });

    columnT.forEach((w) => {
      if (!correctWords.includes(w) || !w.startsWith("v")) wrongWords.push(w);
    });

    setWrong(wrongWords);
setShowAnswer(true)
    const total = correctWords.length;
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
    setColumnD(correctWords.filter((w) => w.startsWith("f")));
    setColumnT(correctWords.filter((w) => w.startsWith("v")));
    setWrong([]);
    setShowAnswer(true);
  };

  const reset = () => {
    setColumnD(["", "", ""]);
    setColumnT(["", "", ""]);
    setWrong([]);
    setShowAnswer(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper" style={{ padding: "30px" }}>
        <div className="div-forall" style={{ width: "60%" }}>
          <h3 className="header-title-page8">
            <span className="ex-A">B</span>
            Look and write the words in the correct column.
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
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent:"center"
                }}
              >
                {correctWords.map((word, i) => (
                  <Draggable draggableId={word} index={i} key={word} isDragDisabled={showAnswer}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="word-box-wb-unit4-p4-q1"
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
                        {word}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="content-container-wb-unit4-p6-q2">
            {/* IMAGE BANK */}
            <div className="img-bank-wb-unit4-p6-q2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={correctWords[i]}
                  style={{ height: "100px", width: "auto" }}
                />
              ))}
            </div>

            {/* TABLE */}
            <div className="table-div-wb-unit4-p6-q2">
              <table className="sorting-table-wb-unit4-p6-q2">
                <thead>
                  <tr>
                    <th>f</th>
                    <th>v</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map((row, i) => (
                    <tr key={i}>
                      <td style={{ position: "relative" }}>
                        <Droppable droppableId={`f-${i}`} isDropDisabled={showAnswer}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`input-cell-wb-unit4-p6-q2 ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                              style={{
                                position: "relative",
                                background: snapshot.isDraggingOver
                                  ? "#e3f2fd"
                                  : "",
                              }}
                            >
                              {columnD[i]}
                              {wrong.includes(columnD[i]) && columnD[i] && (
                                <span className="wrong-x-circle-wb-u1-p8-q2">
                                  ✕
                                </span>
                              )}
                              {provided.placeholder && (
                                <div style={{ display: "none" }}>
                                  {provided.placeholder}
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>

                       
                      </td>

                      <td style={{ position: "relative" }}>
                        <Droppable droppableId={`v-${i}`} isDropDisabled={showAnswer}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                             className={`input-cell-wb-unit4-p6-q2 ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                              style={{
                                position: "relative",
                                background: snapshot.isDraggingOver
                                  ? "#e3f2fd"
                                  : "",
                              }}
                            >
                              {columnT[i]}
                              {wrong.includes(columnT[i]) && columnT[i] && (
                                <span className="wrong-x-circle-wb-u1-p8-q2">
                                  ✕
                                </span>
                              )}
                              {provided.placeholder && (
                                <div style={{ display: "none" }}>
                                  {provided.placeholder}
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>

                      
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
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
