import React, { useState } from "react";
import conversation from "../../../assets/unit7/img/U7P63EXEF-01.svg";
import conversation2 from "../../../assets/unit7/img/U7P63EXEF-02.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// import "./WB_Unit2_Page1_Q2.css";
const WB_Unit4_Page2_Q1 = () => {
  const [shapeColors, setShapeColors] = useState({
    1: "#ffffff",
    2: "#ffffff",
    3: "#ffffff",
  });

  const [selectedColor, setSelectedColor] = useState("#ff0000"); // اللون الحالي
  const [showPalette, setShowPalette] = useState(false);
  const [activeShape, setActiveShape] = useState(null);

  const questions = [
    {
      id: 1,
      img: conversation2,
      question: "What shape is it?",
      type: "full",
      correct: "t is a square.",
    },
    {
      id: 2,
      img: conversation,
      question: "What shape is it?",
      type: "full",
      correct: "It is a triangle",
    },
    {
      id: 3,
      img: conversation,
      question: "What shape is it?",
      type: "full",
      correct: "It is a circle",
    },
  ];
  const correctAnswers = {
    q1: "It is a square.",
    q2: "It is a triangle",
    q3: "It is a circle",
  };
  const wordBank = Object.values(correctAnswers);

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;

    if (!destination.droppableId.startsWith("blank-")) return;

    const qId = destination.droppableId.replace("blank-", "");

    const word = draggableId.replace("word-", "");

    setAnswers((prev) => ({
      ...prev,
      [qId]: word,
    }));

    setWrongInputs([]);
  };

  const [inputs, setInputs] = useState(Array(3).fill(""));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });
  const [showAnswer, setShowAnswer] = useState(false);
  // const [wrong, setWrong] = useState([]);

  const handleCheck = () => {
    if (showAnswer) return;

    const userValues = Object.values(answers);
    const correctValues = Object.values(correctAnswers);

    // 1️⃣ فحص الحقول الفارغة
    if (userValues.some((value) => value.trim() === "")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    // 2️⃣ مقارنة الإجابات
    const results = userValues.map((value, index) => {
      return value.trim().toLowerCase() === correctValues[index].toLowerCase();
    });

    const wrong = results
      .map((r, i) => (r ? null : questions[i].id))
      .filter((v) => v !== null);

    setWrongInputs(wrong);
setShowAnswer(true)
    const correctCount = results.filter(Boolean).length;
    const wrongCount = results.length - correctCount;

    const color =
      correctCount === results.length
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold">
        Score: ${correctCount}/${results.length}
      </span>
    </div>
  `;

    if (correctCount === results.length) {
      ValidationAlert.success(scoreMessage);
    } else if (wrongCount === results.length) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const handleShowAnswer = () => {
    setAnswers({
      q1: correctAnswers.q1,
      q2: correctAnswers.q2,
      q3: correctAnswers.q3,
    });

    setShowAnswer(true); // 🔒 يقفل الكتابة
    setWrongInputs([]); // يشيل الإكسات
    setShapeColors({
      1: "red",
      2: "red",
      3: "red",
    });
  };

  const handleReset = () => {
    setInputs(Array(2).fill(""));
    setWrongInputs([]);
    setAnswers({
      q1: "",
      q2: "",
      q3: "",
    });
    setShowPalette(false);

    setShowAnswer(false);
    setShapeColors({
      1: "#ffffff",
      2: "#ffffff",
      3: "#ffffff",
    });
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
            justifyContent: "flex-start",
            alignItems: "flex-start",
            position: "relative",
            width: "60%",
          }}
        >
          <h5 className="header-title-page8" id="ex-d">
            <span className="ex-A">C</span>Look, read, and write. Color.
          </h5>
          <span style={{ fontSize: "14px", color: "gray" }}>
            Hint: Double Click to Color Word
          </span>
          {showPalette && (
            <div
              className="color-pallet-wb-unit4-p2-q1"
              style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
              {["#ff0000", "#0000ff", "#ffff00", "#00aa00", "#ff9900"].map(
                (c) => (
                  <button
                    key={c}
                    onClick={() => {
                      if (activeShape) {
                        setShapeColors({
                          ...shapeColors,
                          [activeShape]: c,
                        });
                      }
                      setSelectedColor(c);
                      setShowPalette(false);
                      setActiveShape(null);
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: c,
                      border:
                        selectedColor === c
                          ? "3px solid black"
                          : "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  />
                ),
              )}
            </div>
          )}
          <Droppable
            droppableId="word-bank"
            direction="vertical"
            isDropDisabled
          >
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
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {wordBank.map((word, i) => (
                  <Draggable draggableId={`word-${word}`} index={i} key={word} isDragDisabled={showAnswer}>
                    {(provided) => (
                      <div
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
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* ✅ الصورة هي المرجع */}
          <div style={{ width: "100%" }}>
            {questions.map((q, index) => (
              <div key={q.id} className="question-row-unit7-p2-q3">
                <div
                  className="question-container-unit7-p6-q3"
                  style={{ gap: "20px" }}
                >
                  <span className="num2">{index + 1}</span>

                  <div className="shape-wrapper">
                    {q.id === 1 && (
                      <svg
                        width="120"
                        height="120"
                        onDoubleClick={() => {
                          setActiveShape(1);
                          setShapeColors({ ...shapeColors, 1: shapeColors[1] });
                          setShowPalette(true);
                        }}
                        onTouchStart={() => {
                          setActiveShape(1);
                          setShapeColors({ ...shapeColors, 1: shapeColors[1] });
                          setShowPalette(true);
                        }}
                      >
                        <rect
                          x="10"
                          y="10"
                          width="100"
                          height="100"
                          fill={shapeColors[1]}
                          stroke="#999"
                          strokeWidth="4"
                        />
                      </svg>
                    )}
                    {q.id === 2 && (
                      <svg
                        width="120"
                        height="120"
                        onDoubleClick={() => {
                          setActiveShape(2);
                          setShapeColors({ ...shapeColors, 2: shapeColors[2] });
                          setShowPalette(true);
                        }}
                        onTouchStart={() => {
                          setActiveShape(2);
                          setShapeColors({ ...shapeColors, 2: shapeColors[2] });
                          setShowPalette(true);
                        }}
                      >
                        <polygon
                          points="60,10 110,110 10,110"
                          fill={shapeColors[2]}
                          stroke="#999"
                          strokeWidth="4"
                        />
                      </svg>
                    )}
                    {q.id === 3 && (
                      <svg
                        width="120"
                        height="120"
                        onDoubleClick={() => {
                          setActiveShape(3);
                          setShapeColors({ ...shapeColors, 3: shapeColors[3] });
                          setShowPalette(true);
                        }}
                        onTouchStart={() => {
                          setActiveShape(3);
                          setShapeColors({ ...shapeColors, 3: shapeColors[3] });
                          setShowPalette(true);
                        }}
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill={shapeColors[3]}
                          stroke="#999"
                          strokeWidth="4"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="question-text-wb-unit4-p2-q1">{q.question}</p>
                </div>
                <div className="sentence-box-wb-unit4-p2-q1">
                  {q.type === "full" && (
                    <Droppable droppableId={`blank-q${q.id}`} isDropDisabled={showAnswer}>
                      {(provided, snapshot) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <Droppable droppableId={`blank-q${q.id}`}>
                            {(provided, snapshot) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                <input
                                  type="text"
                                  value={answers[`q${q.id}`]}
                                  readOnly
                                  disabled={showAnswer}
                                  className={`answer-input-wb-unit4-p2-q1 ${
                                    snapshot.isDraggingOver
                                      ? "drag-over-cell"
                                      : ""
                                  }`}
                                  style={{
                                    background: snapshot.isDraggingOver
                                      ? "#e3f2fd"
                                      : "",
                                  }}
                                />
                                {provided.placeholder}
                              </span>
                            )}
                          </Droppable>
                          {provided.placeholder}
                        </span>
                      )}
                    </Droppable>
                  )}

                  {q.type === "word" && (
                    <p className="answer-line-unit7-p2-q3">
                      <Droppable droppableId={`blank-q${q.id}`} isDropDisabled={showAnswer}>
                        {(provided, snapshot) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <input
                              type="text"
                              value={answers[`q${q.id}`]}
                              readOnly
                              disabled={showAnswer}
                            className={`answer-input-wb-unit4-p2-q1 ${
                                    snapshot.isDraggingOver
                                      ? "drag-over-cell"
                                      : ""
                                  }`}
                              style={{
                                background: snapshot.isDraggingOver
                                  ? "#e3f2fd"
                                  : "",
                              }}
                            />
                            {provided.placeholder}
                          </span>
                        )}
                      </Droppable>
                      {q.prefix} .
                    </p>
                  )}

                  {wrongInputs.includes(q.id) && (
                    <span className="wrong-mark">✕</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Buttons */}
        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            className="show-answer-btn swal-continue"
            onClick={handleShowAnswer}
          >
            Show Answer
          </button>
          <button onClick={handleCheck} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit4_Page2_Q1;
