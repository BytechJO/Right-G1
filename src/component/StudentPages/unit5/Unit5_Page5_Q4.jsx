import React, { useState } from "react";
import "./Unit5_Page5_Q4.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import img from "../../../assets/unit5/imgs/U5P44EXEC.svg";
const Unit5_Page5_Q4 = () => {
  const data = [
    { letter: "a", number: 1 },
    { letter: "b", number: 2 },
    { letter: "c", number: 3 },
    { letter: "d", number: 4 },
    { letter: "e", number: 5 },
    { letter: "f", number: 6 },
    { letter: "g", number: 7 },
    { letter: "h", number: 8 },
    { letter: "i", number: 9 },
    { letter: "j", number: 10 },
    { letter: "k", number: 11 },
    { letter: "l", number: 12 },
    { letter: "m", number: 13 },
    { letter: "n", number: 14 },
    { letter: "o", number: 15 },
    { letter: "p", number: 16 },
    { letter: "q", number: 17 },
    { letter: "r", number: 18 },
    { letter: "s", number: 19 },
    { letter: "t", number: 20 },
    { letter: "u", number: 21 },
    { letter: "v", number: 22 },
    { letter: "w", number: 23 },
    { letter: "x", number: 24 },
    { letter: "y", number: 25 },
    { letter: "z", number: 26 },
  ];

const questionGroups = [
    [23, 8, 1, 20, 19], // __what's_____
    [20, 8, 9, 19], // this
  ];
  const [slots, setSlots] = useState(
    questionGroups.map((g) => g.map(() => null)),
  );
  const [isChecked, setIsChecked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  // تكوين الكلمات من الخانات
  const formedWords = slots.map((group) =>
    group.map((letter) => letter || "").join(""),
  );
  const sentence = formedWords.join(" ");

  // ========================
  // Drag Logic
  // ========================
const onDragEnd = (result) => {
  const { destination, draggableId } = result;
  if (!destination || showAnswer || isChecked) return;

  if (destination.droppableId.startsWith("slot-")) {
    const [g, l] = destination.droppableId.split("-").slice(1).map(Number);

    const letter = draggableId.replace("letter-", "");

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);



      // ✅ استبدال الحرف مباشرة
      updated[g][l] = letter;

      return updated;
    });
  }
};


  // ========================
  // Show Answer
  // ========================
  const handleShowAnswer = () => {
    const correct = questionGroups.map((group) =>
      group.map((num) => data.find((d) => d.number === num).letter),
    );

    setSlots(correct);
    setWrongInputs([]);
    setShowAnswer(true);
  };

  // ========================
  // Check Answer
  // ========================
  const handleCheckAnswers = () => {
    if (showAnswer) return;
    setIsChecked(true);

    const hasEmpty = slots.some((g) => g.some((l) => !l));
    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all fields before checking.",
      );
      return;
    }

    let wrong = [];
    let correctCount = 0;
    let total = slots.flat().length;

    for (let g = 0; g < slots.length; g++) {
      for (let l = 0; l < slots[g].length; l++) {
        const correctLetter = data.find(
          (d) => d.number === questionGroups[g][l],
        ).letter;

        if (slots[g][l] === correctLetter) correctCount++;
        else wrong.push(`${g}-${l}`);
      }
    }

    setWrongInputs(wrong);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <div className="container8">
          <h5 className="header-title-page8">
            <span className="ex-A">C</span> Answer the question.
          </h5>

          <div className="alphabet-box">
            <DragDropContext onDragEnd={onDragEnd}>
              {/* 🔤 الحروف فوق الأرقام */}
              <Droppable
                droppableId="alphabet"
                direction="horizontal"
                isDropDisabled
              >
                {(provided) => (
                  <div
                    className="row1"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {data.map((item, index) => (
                      <div className="letter-char1" key={index}>
                        <Draggable
                          draggableId={`letter-${item.letter}`}
                          index={index}
                          isDragDisabled={showAnswer || isChecked}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="cell1 drag-letter"
                            >
                              {item.letter}
                            </div>
                          )}
                        </Draggable>

                        <div className="cell1 number1">{item.number}</div>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* 🧩 خانات الإجابة */}
              <div className="words">
                {questionGroups.map((group, gIndex) => (
                  <div className="word-group-unit3-p5-q4" key={gIndex}>
                    {group.map((num, lIndex) => (
                      <Droppable
                        droppableId={`slot-${gIndex}-${lIndex}`}
                        isDropDisabled={showAnswer || isChecked}
                      >
                        {(provided, snapshot) => (
                          <div className="slot-wrapper">
                            {/* 🔢 الرقم فوق المربع */}
                            <h6 className="slot-number">{num}</h6>

                            {/* ⬜ مربع الدروب */}
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`drop-slot
                              ${snapshot.isDraggingOver ? "drag-over" : ""}
                              ${wrongInputs.includes(`${gIndex}-${lIndex}`) ? "wrong" : ""}`}
                            >
                              {wrongInputs.includes(`${gIndex}-${lIndex}`) && (
                                <div className="error-mark1">✕</div>
                              )}
                              {slots[gIndex][lIndex] && (
                                <div className="dropped-letter">
                                  {slots[gIndex][lIndex]}
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    ))}
                
                  </div>
                ))}
                    <img src={img} style={{height:"150px" ,width:"185px"}}/>
              </div>
              <div className="sentence-box">
                <span className="sentence-text">{sentence}</span>
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* 🔘 Buttons */}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setSlots(questionGroups.map((g) => g.map(() => null)));
            setWrongInputs([]);
            setShowAnswer(false);
            setIsChecked(false);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={handleCheckAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit5_Page5_Q4;
