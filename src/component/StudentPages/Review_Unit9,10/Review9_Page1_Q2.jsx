import React, { useState } from "react";
import farmImg from "../../../assets/unit10/imgs/U10P88EXEB.svg"; // عدّل المسار حسب مشروعك
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review9_Page1_Q2.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Review9_Page1_Q2 = () => {
  const items = [
    {
      image: farmImg,
      questionParts: ["How many cows are there?"],
      blanksCount: 0,
      questionAnswers: [],
      answer: "There are five cows.",
    },
    {
      image: farmImg,
      questionParts: ["", "goats are there?"],
      blanksCount: 2,
      questionAnswers: ["How many"],
      answer: "There are four goats.",
    },
    {
      image: farmImg,
      questionParts: ["", "cats are there?"],
      blanksCount: 2,
      questionAnswers: ["How many"],
      answer: "There are three cats.",
    },
  ];
  const wordBank = [
    "How many",
    "There are five cows.",
    "There are four goats.",
    "There are three cats.",
  ];

  const [questionInputs, setQuestionInputs] = useState(
    items.map((item) => Array(item.blanksCount).fill("")),
  );

  const [answers, setAnswers] = useState(items.map(() => ""));
  const [showCorrect, setShowCorrect] = useState(false);
  const [wrongMarks, setWrongMarks] = useState([]);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showCorrect) return;

    const value = draggableId.replace("word-", "");
    const [type, i, j] = destination.droppableId.split("-");

    if (type === "q") {
      const updated = [...questionInputs];
      updated[i][j] = value;
      setQuestionInputs(updated);
    }

    if (type === "a") {
      const updated = [...answers];
      updated[i] = value;
      setAnswers(updated);
    }
  };
  // =========================
  // Show Answers
  // =========================
  const showAnswers = () => {
    setQuestionInputs(items.map((item) => item.questionAnswers || []));
    setAnswers(items.map((item) => item.answer));
    setShowCorrect(true);
     setWrongMarks([])
  };

  // =========================
  // Reset
  // =========================
  const resetAll = () => {
    setQuestionInputs(items.map((item) => Array(item.blanksCount).fill("")));
    setAnswers(items.map(() => ""));
    setShowCorrect(false);
    setWrongMarks([])
  };

  // =========================
  // Check Answers
  // =========================
  const checkAnswers = () => {
    if (showCorrect) return;


  // 🔴 1) فحص الفراغات في السؤال
  for (let i = 0; i < items.length; i++) {
   for (let j = 0; j < items[i].questionAnswers.length; j++) {
      if (!questionInputs[i][j] || questionInputs[i][j].trim() === "") {
        ValidationAlert.info(
          "Oops!",
          "Please complete all question blanks before checking."
        );
        return;
      }
    }

    // 🔴 2) فحص جواب الجملة
    if (!answers[i] || answers[i].trim() === "") {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking."
      );
      return;
    }
  }
    let score = 0;
    let total = 0;

    items.forEach((item, i) => {
      // تحقق من فراغات السؤال
      item.questionAnswers.forEach((correctWord, idx) => {
        total++;
        if (
          questionInputs[i][idx]?.trim().toLowerCase() ===
          correctWord.toLowerCase()
        ) {
          score++;
        }
      });

      // تحقق من الجواب
      total++;
      if (answers[i].trim().toLowerCase() === item.answer.toLowerCase()) {
        score++;
      }
    });
    let wrong = [];

    items.forEach((item, i) => {
      item.questionAnswers.forEach((correctWord, idx) => {
        if (
          questionInputs[i][idx]?.trim().toLowerCase() !==
          correctWord.toLowerCase()
        ) {
          wrong.push({ type: "question", qIndex: i, idx });
        }
      });

      if (answers[i].trim().toLowerCase() !== item.answer.toLowerCase()) {
        wrong.push({ type: "answer", qIndex: i });
      }
    });

    setWrongMarks(wrong);

    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    setShowCorrect(true);
    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
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
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">B Look and write.</h5>

          <Droppable droppableId="bank" isDropDisabled={showCorrect}>
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
                          alignItems:"center",justifyContent:"center"
                        }}
              >
                {wordBank.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={showCorrect}
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

          {/* 🔹 Image */}
          <div className="content-review9-p1-q2">
            <img
              src={farmImg}
              alt=""
              style={{ height: "270px", width: "auto" }}
            />
            <div style={{ width: "100%" }}>
              {items.map((item, i) => (
                <div key={i} className="question-box-review9-p1-q2">
                  {/* 🔹 Question */}
                  <p className="question-text">
                    {item.questionParts.map((part, idx) =>
                      part === "" ? (
                        <Droppable
                          droppableId={`q-${i}-${idx}`}
                          isDropDisabled={showCorrect}
                        >
                          {(provided, snapshot) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`question-blank-review9-p1-q2 ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                            >
                              {questionInputs[i][idx]}
                              {provided.placeholder}
                              {wrongMarks.some(
                                (w) =>
                                  w.type === "question" &&
                                  w.qIndex === i &&
                                  w.idx === idx,
                              ) && (
                                <div className="wrong-x-circle-review9-p1-q2">
                                  ✕
                                </div>
                              )}
                            </span>
                          )}
                        </Droppable>
                      ) : (
                        <span key={idx} style={{ width: "100%" }}>
                          {" "}
                          {part}{" "}
                        </span>
                      ),
                    )}
                  </p>

                  {/* 🔹 Answer input */}
                  <Droppable
                    droppableId={`a-${i}`}
                    isDropDisabled={showCorrect}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`answer-input-review9-p1-q2 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[i]}
                        {provided.placeholder}
                        {wrongMarks.some(
                          (w) => w.type === "answer" && w.qIndex === i,
                        ) && (
                          <div className="wrong-x-circle-review9-p1-q2">✕</div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 🔹 Buttons */}
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={showAnswers} className="show-answer-btn">
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

export default Review9_Page1_Q2;
