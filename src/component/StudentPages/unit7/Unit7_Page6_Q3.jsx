import React, { useState } from "react";
import conversation from "../../../assets/unit7/img/U7P63EXEF-01.svg";
import conversation2 from "../../../assets/unit7/img/U7P63EXEF-02.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Unit7_Page6_Q3.css";
const Unit7_Page6_Q3 = () => {
  const questions = [
    {
      id: 1,
      img: conversation,
      question: "Are you cold?",
      type: "full",
      correct: "Yes, I am.",
    },
    {
      id: 2,
      img: conversation2,
      question: "Are you scared?",
      type: "word",
      prefix: "No, I'm not. I'm",
      correct: "hungry",
    },
  ];
  const correctAnswers = {
    q1: "Yes, I am.",
    q2: "hungry",
  };

  const [inputs, setInputs] = useState(Array(2).fill(""));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
  });

  const [showAnswer, setShowAnswer] = useState(false);
  // const [wrong, setWrong] = useState([]);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    const value = draggableId.replace("word-", "");
    const key = destination.droppableId;

    setAnswers((prev) => {
      const updated = { ...prev };

      // منع التكرار
      Object.keys(updated).forEach((k) => {
        if (updated[k] === value) updated[k] = null;
      });

      updated[key] = value;
      return updated;
    });

    setWrongInputs([]);
  };

  const handleCheck = () => {
    if (showAnswer) return;

    const userValues = Object.values(answers);
    const correctValues = Object.values(correctAnswers);

    // 1️⃣ فحص الحقول الفارغة
    if (userValues.some((value) => (value || "").trim() === "")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    // 2️⃣ مقارنة الإجابات
    const results = userValues.map((value, index) => {
      return (
        (value || "").trim().toLowerCase() ===
        correctValues[index].toLowerCase()
      );
    });

    const wrong = results
      .map((r, i) => (r ? null : questions[i].id))
      .filter((v) => v !== null);

    setWrongInputs(wrong);

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
    });

    setShowAnswer(true); // 🔒 يقفل الكتابة
    setWrongInputs([]); // يشيل الإكسات
  };

  const handleReset = () => {
    setInputs(Array(2).fill(""));
    setWrongInputs([]);
    setAnswers({ q1: null, q2: null });

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
            justifyContent: "flex-start",
            alignItems: "flex-start",
            position: "relative",
            width: "60%",
          }}
        >
          <h5 className="header-title-page8" id="ex-d">
            <span className="ex-A">F</span> Look, read, and write.
          </h5>

          <Droppable droppableId="bank" isDropDisabled={showAnswer}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="word-bank-unit7-p2-q3 "
              >
                {Object.values(correctAnswers).map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={showAnswer}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="word-item-unit2-p8-q2"
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

                  <img src={q.img} className="avatar-img" />
                  <p className="question-text-unit7-p2-q3">{q.question}</p>
                </div>
                <div className="sentence-box-unit7-p2-q3">
                  {q.type === "full" && (
                    <Droppable droppableId="q1" isDropDisabled={showAnswer}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="answer-input-unit7-p2-q3"
                        >
                          {answers.q1 && (
                            <Draggable
                              draggableId={`filled-${answers.q1}-q1`}
                              index={0}
                              isDragDisabled={showAnswer}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {answers.q1}
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}

                  {q.type === "word" && (
                    <p className="answer-line-unit7-p2-q3">
                      {q.prefix}
                      <Droppable droppableId="q2" isDropDisabled={showAnswer}>
                        {(provided) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="answer-input-unit7-p2-q3 small"
                            style={{
                              display: "inline-flex",
                              minWidth: "80px",
                              minHeight: "32px",
                              alignItems: "center",
                            }}
                          >
                            {answers.q2 && (
                              <Draggable
                                draggableId={`filled-${answers.q2}-q2`}
                                index={0}
                                isDragDisabled={showAnswer}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {answers.q2}
                                  </span>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </span>
                        )}
                      </Droppable>
                      .
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

export default Unit7_Page6_Q3;
