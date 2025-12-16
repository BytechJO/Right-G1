import React, { useState } from "react";
import bat from "../../../assets/unit7/img/U7P62EXEB-01.svg";
import cap from "../../../assets/unit7/img/U7P62EXEB-02.svg";
import ant from "../../../assets/unit7/img/U7P62EXEB-03.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page5_Q3.css";

const Unit7_Page5_Q3 = () => {
  const correctAnswers = ["happy", "cold", "crawl"];

  const [answers, setAnswers] = useState(["", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW

  const handleChange = (value, index) => {
    if (showAnswer) return; // ❌ ممنوع التعديل أثناء Show Answer

    const newAnswers = [...answers];
    newAnswers[index] = value.toLowerCase();
    setAnswers(newAnswers);
    setWrongInputs([]);
  };

  const checkAnswers = () => {
        if (showAnswer) return; // ❌ ممنوع التعديل أثناء Show Answer

    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let correctCount = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        correctCount++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);

    const total = correctAnswers.length;
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

  const reset = () => {
    setAnswers(["", "", ""]);
    setWrongInputs([]);
    setShowAnswer(false); // ⭐ NEW → يرجع الحالة لطبيعية
  };

  const handleShowAnswer = () => {
    setAnswers([...correctAnswers]); // ⭐ عرض الإجابات الصحيحة
    setWrongInputs([]);
    setShowAnswer(true); // ⭐ منع التعديل
  };

  return (
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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">B</span>Look, and write.
        </h5>

        <div
          className="row-content10-unit3-page6-q1"
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          {/* 🔵 1 */}
          <div className="row2-unit3-page6-q1">
            <img src={bat} alt="" className="q-img-unit3-page6-q1" />
            <div className="input-wrapper-unit3-page6-q1">
              <input
                type="text"
                className="q-input-unit3-page6-q1"
                onChange={(e) => handleChange(e.target.value, 0)}
                value={answers[0]}
                disabled={showAnswer}
              />
              {wrongInputs.includes(0) && !showAnswer && (
                <span className="error-mark-input">✕</span>
              )}
            </div>
          </div>

          {/* 🔵 2 */}
          <div className="row2-unit3-page6-q1">
            <img src={cap} alt="" className="q-img-unit3-page6-q1" />
            <div className="input-wrapper-unit3-page6-q1">
              <input
                type="text"
                className="q-input-unit3-page6-q1"
                onChange={(e) => handleChange(e.target.value, 1)}
                value={answers[1]}
                disabled={showAnswer}
              />
              {wrongInputs.includes(1) && !showAnswer && (
                <span className="error-mark-input">✕</span>
              )}
            </div>
          </div>

          {/* 🔵 3 */}
          <div className="row2-unit3-page6-q1">
            <img src={ant} alt="" className="q-img-unit3-page6-q1" />
            <div className="input-wrapper-unit3-page6-q1">
              <input
                type="text"
                className="q-input-unit3-page6-q1"
                onChange={(e) => handleChange(e.target.value, 2)}
                value={answers[2]}
                disabled={showAnswer}
              />
              {wrongInputs.includes(2) && !showAnswer && (
                <span className="error-mark-input">✕</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ BUTTONS */}
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={handleShowAnswer} className="show-answer-btn swal-continue">
          Show Answer 
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit7_Page5_Q3;
