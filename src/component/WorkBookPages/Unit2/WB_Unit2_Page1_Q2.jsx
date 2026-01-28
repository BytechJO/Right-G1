import { useState } from "react";
import conversation from "../../../assets/U1 WB/U2/U2P9EXEB-01.svg";
import conversation2 from "../../../assets/U1 WB/U2/U2P9EXEB-02.svg";
import img1 from "../../../assets/U1 WB/U2/U2P9EXEB-03.svg";
import img2 from "../../../assets/U1 WB/U2/U2P9EXEB-04.svg";
import img3 from "../../../assets/U1 WB/U2/U2P9EXEB-05.svg";
import img4 from "../../../assets/U1 WB/U2/U2P9EXEB-06.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./WB_Unit2_Page1_Q2.css";
const WB_Unit2_Page1_Q2 = () => {
  const questions = [
    {
      id: 1,
      img: conversation2,
      secImg: img2,
      question: "How old are you?",
      type: "word",
      prefix: "years old.",
      correct: "five",
    },
    {
      id: 2,
      img: conversation,
      secImg: img3,
      question: "How old are you?",
      type: "full",
      correct: "I'm four years old",
    },
    {
      id: 3,
      img: img1,
      secImg: img4,
      question: "How old are you?",
      type: "full",
      correct: "I'm seven years old",
    },
  ];
  const correctAnswers = {
    q1: "five",
    q2: "I'm four years old",
    q3: "I'm seven years old",
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
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;
    const key = destination.droppableId; // q1 | q2 | q3

    const draggedWord = draggableId.split("-").slice(1, -1).join("-");

    const newAnswers = { ...answers };

    // ⭐ منع التكرار + نقل الكلمة
    Object.keys(newAnswers).forEach((k) => {
      if (newAnswers[k] === draggedWord) {
        newAnswers[k] = "";
      }
    });

    newAnswers[key] = draggedWord;

    setAnswers(newAnswers);
    setWrongInputs([]);
  };

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
    setLocked(true);
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
  };

  const handleReset = () => {
    setInputs(Array(2).fill(""));
    setWrongInputs([]);
    setAnswers({
      q1: "",
      q2: "",
      q3: "",
    });
    setShowAnswer(false);
    setLocked(false);
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
            <span className="ex-A">B</span> Read, look, and answer.
          </h5>

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
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {Object.values(correctAnswers).map((word, i) => (
                  <Draggable
                    key={`bank-${word}-${i}`}
                    draggableId={`bank-${word}-${i}`}
                    index={i}
                    isDragDisabled={showAnswer || locked}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "2px 5px",
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

          {/* ✅ الصورة هي المرجع */}
          <div>
            {questions.map((q, index) => (
              <div key={q.id} className="question-row-unit7-p2-q3">
                <div className="question-container-unit7-p6-q3">
                  <span className="num2">{index + 1}</span>

                  <img src={q.img} className="avatar-img-wb-u2-q1" />
                  <p className="question-text-unit7-p2-q3">{q.question}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={q.secImg} className="avatar-img-wb-u2-q1" />
                  <div className="sentence-box-unit7-p2-q3">
                    {q.type === "full" && (
                      <Droppable droppableId={`q${q.id}`}>
                        {(provided, snapshot) => (
                          <input
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            type="text"
                            value={answers[`q${q.id}`]}
                            className={`answer-input-unit7-p2-q3 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            readOnly
                            disabled={showAnswer || locked}
                          />
                        )}
                      </Droppable>
                    )}

                    {q.type === "word" && (
                      <p className="answer-line-unit7-p2-q3">
                        I'm
                        <Droppable droppableId={`q${q.id}`}>
                          {(provided ,snapshot) => (
                            <input
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              type="text"
                              value={answers[`q${q.id}`]}
                              className={`answer-input-unit7-p2-q3 small ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                              readOnly
                              disabled={showAnswer || locked}
                            />
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

export default WB_Unit2_Page1_Q2;
