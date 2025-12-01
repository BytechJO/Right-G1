import React, { useState } from "react";
import bat from "../../assets/unit3/imgs3/P26exeA1-01.svg";
import cap from "../../assets/unit3/imgs3/P26exeA1-02.svg";
import ant from "../../assets/unit3/imgs3/P26exeA1-03.svg";
import dad from "../../assets/unit3/imgs3/P26exeA1-04.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit3_Page5_Q1.css";

const Unit3_Page5_Q1 = () => {
  const correctAnswers = ["bat", "cap", "ant", "dad"];
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // ⬅ جديد

  const handleChange = (value, index) => {
    if (showAnswer) return; // ⛔ منع التعديل بعد Show Answer

    const newAnswers = [...answers];
    newAnswers[index] = value.toLowerCase();
    setAnswers(newAnswers);
    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) tempScore++;
      else wrong.push(i);
    });

    setWrongInputs(wrong);

    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${tempScore} / ${total}
        </span>
      </div>
    `;

    if (tempScore === total) ValidationAlert.success(scoreMessage);
    else if (tempScore === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowAnswer(false); // ⬅ إعادة تفعيل الإجابة
  };

  const handleShowAnswer = () => {
    setAnswers(correctAnswers); // عرض الإجابات
    setShowAnswer(true); // تفعيل اللون الأحمر + منع التعديل
    setWrongInputs([]); // إخفاء الإكس
  };

  return (
    <div
      className="question-wrapper-unit3-page6-q1"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
          <span className="ex-A">A</span>
          <span style={{ color: "purple" }}>1</span> Look and write.
        </h5>

        <div className="row-content10-unit3-page6-q1">
          {["bat", "cap", "ant", "dad"].map((_, i) => (
            <div className="row2-unit3-page6-q1" key={i}>
              <div style={{ display: "flex", gap: "15px" }}>
                <span className="num-span">{i + 1}</span>{" "}
                <img
                  src={[bat, cap, ant, dad][i]}
                  alt=""
                  className="q-img-unit3-page6-q1"
                />
              </div>

              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <input
                    type="text"
                    className={`q-input-unit3-page6-q1 ${
                      showAnswer ? "show-answer-red" : ""
                    }`}
                    value={answers[i]}
                    onChange={(e) => handleChange(e.target.value, i)}
                    disabled={showAnswer}
                  />

                  {wrongInputs.includes(i) && !showAnswer && (
                    <span className="error-mark-input">✕</span>
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
        <button onClick={handleShowAnswer} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit3_Page5_Q1;
