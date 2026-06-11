import React, { useState, useEffect, useRef } from "react";
import bat from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-01.svg";
import cap from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-02.svg";
import ant from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-03.svg";
import dad from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-04.svg";
import ant2 from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-05.svg";
import dad2 from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-06.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// import "./Review3_Page2_Q1.css";
import sound1 from "../../../assets/U1 WB/U3/audio/cd4pg20-instruction1-adult-lady_r3mB3ZZz.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const WB_Unit3_Page6_Q1 = () => {
  const correctAnswers = ["rat", "cap", "ant", "bat", "dad", "pan"];
  const wordBank = ["cap", "bat","rat","dad",   "pan", "ant"];
  // const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل الإدخال بعد Show Answer

  const [slots, setSlots] = useState(Array(6).fill(null));

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { source, destination } = result;

    if (!destination.droppableId.startsWith("slot-")) return;

    const targetIndex = Number(destination.droppableId.replace("slot-", ""));
    const draggedWord = bank[source.index];

    setSlots((prev) => {
      const copy = [...prev];

      // ❌ منع تكرار نفس الكلمة
      const existingIndex = copy.findIndex((w) => w === draggedWord);
      if (existingIndex !== -1) {
        copy[existingIndex] = null;
      }

      copy[targetIndex] = draggedWord;
      return copy;
    });

    setWrongInputs([]);
  };

  const stopAtSecond =5.179;

  const checkAnswers = () => {
    if (locked) return;

    // ✅ فحص الخانات الفاضية (الصح)
    if (slots.some((slot) => !slot)) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];

    slots.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        tempScore++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setLocked(true);

    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${tempScore} / ${total}
      </span>
    </div>
  `;

    tempScore === total
      ? ValidationAlert.success(msg)
      : tempScore === 0
        ? ValidationAlert.error(msg)
        : ValidationAlert.warning(msg);
  };

  const reset = () => {
    setSlots(Array(6).fill(null));

    setWrongInputs([]);
    setLocked(false); // ⭐ إعادة فتح التعديل
  };

  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    setSlots([...correctAnswers]); // ✅ هذا الصح
    setWrongInputs([]);
    setLocked(true);
  };

  // ================================
  // ✔ Captions Array
  // ================================
const captions = [
  {
    start: 0.34,
    end: 5.179,
    text: "Phonics. Exercise A. Listen, look, and write.",
  },
  {
    start: 5.859,
    end: 7.299,
    text: "1-rat.",
  },
  {
    start: 7.96,
    end: 9.279,
    text: "2-cap.",
  },
  {
    start: 9.899,
    end: 11.599,
    text: "3-ant.",
  },
  {
    start: 12.34,
    end: 13.859,
    text: "4-bat.",
  },
  {
    start: 14.479,
    end: 15.879,
    text: "5-dad.",
  },
  {
    start: 16.539,
    end: 18.2,
    text: "6-pan.",
  },
];
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
          style={
            {
              //   gap: "30px",
            }
          }
        >
          <h5 className="header-title-page8">
            {" "}
            <span className="ex-A">A</span> Drag and drop.
          </h5>

          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
          />
          {/* AUDIO PLAYER — unchanged */}
          {/* -------------------------------------------------- */}
          {/* ... audio code remains as-is ... */}
        

          <Droppable droppableId="bank" direction="horizontal">
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
                }}
              >
                {wordBank.map((word, i) => (
                  <Draggable
                    key={word}
                    draggableId={word}
                    index={i}
                    isDragDisabled={locked}
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
                        {word}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* -------------------------------------------------- */}
          <div className="row-content10-review3-p2-q1">
            {[bat, cap, ant, dad, ant2, dad2].map((item, index) => (
              <div className="row2-review3-p2-q1" key={index}>
                <img src={item} alt="" className="q-img-wb-unit3-p6-q1" />

                <span style={{ position: "relative", display: "flex" }}>
                  <div className="input-wrapper-unit3-page6-q1">
                    <Droppable
                      droppableId={`slot-${index}`}
                      isDropDisabled={locked}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`q-input-review3-p2-q1 ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "white",
                          }}
                        >
                          {slots[index] && <span>{slots[index]}</span>}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {wrongInputs.includes(index) && (
                      <span className="error-mark-input-review3-p2-q1">✕</span>
                    )}
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ NEW BUTTON */}
          <button
            onClick={showAnswer}
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

export default WB_Unit3_Page6_Q1;
