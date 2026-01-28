import React, { useState } from "react";
import "./Unit2_Page7_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit2_Page7_Q1 = () => {
  const words = [
    { word: "Good", num: 1 },
    { word: "evening", num: 2 },
    { word: "Goodbye", num: 3 },
    { word: "afternoon", num: 4 },
    { word: "!", num: 5 },
    { word: "Hello", num: 6 },
    { word: "How", num: 7 },
    { word: "morning", num: 8 },
    { word: "Fine", num: 9 },
    { word: "?", num: 10 },
    { word: "are", num: 11 },
    { word: "thank", num: 12 },
    { word: ",", num: 13 },
    { word: "I'm Helen", num: 14 },
    { word: "you", num: 15 },
    { word: ".", num: 16 },
  ];

  const correctAnswers2 = {
    a: ["How", "are", "you", "?"],
    b: ["Good", "morning", "!"],
    c: ["Fine", ",", "thank", "you", "."],
    d: ["Goodbye", "!"],
    e: ["Hello", "!", "I'm Helen", "."],
    f: ["Good", "afternoon", "!"],
  };

  const sentences = {
    a: [7, 11, 15, 10],
    b: [1, 8, 5],
    c: [9, 13, 12, 15, 16],
    d: [3, 5],
    e: [6, 5, 14, 16],
    f: [1, 4, 5],
  };

  const [userAnswers, setUserAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrongInputs, setWrongInputs] = useState({});
  const [usedNumbers, setUsedNumbers] = useState([]); // ⭐ الجديد

  // نفس handleChange
  const handleChange = (key, index, value) => {
    setUserAnswers((prev) => {
      const updated = { ...prev };
      if (!updated[key]) updated[key] = [];
      updated[key][index] = value;
      return updated;
    });
    setWrongInputs({});
  };

  // 🧲 Drag logic مع تعطيل الرقم بعد الاستخدام
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    if (destination.droppableId.startsWith("slot-")) {
      const [, key, index] = destination.droppableId.split("-");
      const num = Number(draggableId.replace("num-", ""));

      const draggedWord = words.find((w) => w.num === num)?.word || "";

      handleChange(key, Number(index), draggedWord);
    }
  };

  // نفس checkAnswers
  const checkAnswers = () => {
    if (showAnswer) return;

    let tempScore = 0;
    let totalInputs = 0;
    let newWrongInputs = {};

    for (const key in sentences) {
      totalInputs += sentences[key].length;

      if (
        !userAnswers[key] ||
        userAnswers[key].length !== sentences[key].length
      ) {
        ValidationAlert.info(
          "Oops!",
          "Please fill all fields before checking.",
        );
        return;
      }

      newWrongInputs[key] = [];

      sentences[key].forEach((_, index) => {
        const entered = userAnswers[key][index]?.toLowerCase();
        const correct = correctAnswers2[key][index].toLowerCase();

        if (entered !== correct) {
          newWrongInputs[key][index] = true;
        } else {
          newWrongInputs[key][index] = false;
          tempScore++;
        }
      });
    }

    setWrongInputs(newWrongInputs);
    setChecked(true);
    setUsedNumbers(words.map((w) => w.num));

    const color =
      tempScore === totalInputs ? "green" : tempScore === 0 ? "red" : "orange";

    ValidationAlert[
      tempScore === totalInputs
        ? "success"
        : tempScore === 0
          ? "error"
          : "warning"
    ](`
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${tempScore} / ${totalInputs}
        </span>
      </div>
    `);
  };

  // نفس Show Answer
  const handleShowAnswer = () => {
    setUserAnswers(correctAnswers2);
    setShowAnswer(true);
    setChecked(false);
    setWrongInputs({});
    setUsedNumbers(words.map((w) => w.num)); // 🔒 كل الأرقام تُعتبر مستخدمة
  };

  const reset = () => {
    setUserAnswers({});
    setChecked(false);
    setShowAnswer(false);
    setWrongInputs({});
    setUsedNumbers([]); // ⭐ مهم
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
          <div className="unit7-container">
            <h5 className="header-title-page8">A Read and write.</h5>

            {/* 🔤 الأرقام (Draggable + تعطيل بعد الاستخدام) */}
            <Droppable droppableId="words" isDropDisabled>
              {(provided) => (
                <div
                  className="number-word-section"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {words.map((item, index) => (
                    <Draggable
                      key={item.num}
                      draggableId={`num-${item.num}`}
                      index={index}
                      isDragDisabled={usedNumbers.includes(item.num)}
                    >
                      {(provided) => (
                        <div className="word-number-unit2-p7-q1">
                          {/* 🔢 الرقم ثابت */}
                          <span className="num-word">{item.num}</span>

                          {/* 🔤 فقط الكلمة draggable */}
                          <span
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`word-num ${
                              usedNumbers.includes(item.num) ? "used" : ""
                            }`}
                          >
                            {item.word}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* 🧩 الدروب للكلمة فقط */}
            <div className="num-input-section">
              {Object.entries(sentences).map(([key, correctArray]) => (
                <div key={key} className="sentence-row">
                  <span className="sentence-label">{key}</span>

                  <div className="num-container">
                    {correctArray.map((num, i) => (
                      <span key={i} className="sentence-preview">
                        {num}
                      </span>
                    ))}
                  </div>

                  <div className="sentence-line">
                    {correctArray.map((_, index) => (
                      <Droppable
                        key={index}
                        droppableId={`slot-${key}-${index}`}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="input-wrapper1"
                          >
                            <div
                              className={`input-sentence
                                ${
                                  checked && wrongInputs[key]?.[index]
                                    ? "wrong-input1"
                                    : ""
                                }
                              ${snapshot.isDraggingOver ? "drag-over-cell" : ""}
                              `}
                            >
                              {userAnswers[key]?.[index] || ""}
                            </div>

                            {checked && wrongInputs[key]?.[index] && (
                              <span className="wrong-icon">✕</span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔘 الأزرار نفسها */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
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

export default Unit2_Page7_Q1;
