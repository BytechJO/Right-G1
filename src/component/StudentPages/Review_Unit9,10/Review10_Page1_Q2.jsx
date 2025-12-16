import React, { useState } from "react";
import deer from "../../../assets/unit6/imgs/U6P54EXEC-01.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review10_Page1_Q2.css"
const data = [
  { question: "", correct: "fruit" },
  { question: "", correct: "ice cream" },
  { question: "", correct: "bread" },
  { question: "", correct: "milk" },
  { question: "", correct: "chicken" },
];

const Review10_Page1_Q2 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW

  const handleChange = (value, index) => {
    if (showAnswer) return; // ⭐ منع التعديل عند Show Answer

    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (showAnswer) return; // ⭐ منع التعديل عند Show Answer

    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    let correctCount = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans.trim().toLowerCase() === data[i].correct.toLowerCase()) {
        correctCount++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);

    let color =
      correctCount === data.length
        ? "green"
        : correctCount === 0
        ? "red"
        : "orange";

    const scoreMessage = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${data.length}
        </span>
      </div>
    `;

    if (correctCount === data.length) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setAnswers(Array(data.length).fill(""));
    setWrongInputs([]);
    setShowAnswer(false); // ⭐ إعادة التفعيل الطبيعي
  };

  // ⭐⭐⭐ SHOW ANSWER FUNCTION
  const showCorrectAnswers = () => {
    const correctList = data.map((item) => item.correct);
    setAnswers(correctList);
    setWrongInputs([]);
    setShowAnswer(true);
  };

  return (
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
        <div className="component-wrapper">
          <h3 className="header-title-page8">
           B Look and write.
          </h3>

          <div className="content-review10-p1-q2">
            <div className="group-input-unit5-p5-q3">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="question-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "10px",
                  }}
                >
                  <span
                    className="q-number"
                    style={{
                      color: "#0d47a1",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {index + 1}.
                  </span>

                  <div className="question-text" style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="q-input"
                      value={answers[index]}
                      onChange={(e) => handleChange(e.target.value, index)}
                    />

                    {wrongInputs.includes(index) && (
                      <span className="wrong-icon-review6-p1-q3">✕</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <img
              src={deer}
              className="shape-img-unit5-p5-q3"
              alt=""
              style={{ height: "200px", width: "auto" }}
            />
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        {/* ⭐ زر الشو أنسر */}
        <button className="show-answer-btn swal-continue" onClick={showCorrectAnswers}>
          Show Answer 
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answers ✓
        </button>
      </div>
    </div>
  );
};

export default Review10_Page1_Q2;
