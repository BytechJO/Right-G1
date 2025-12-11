import React, { useState } from "react";
import deer from "../../../assets/unit6/imgs/U6P54EXEC-01.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page1_Q3.css";

const data = [
  {
    question: "",
    correct: "She can ride a bike",
  },
  {
    question: "",
    correct: "It can climb a tree",
  },
  {
    question: "",
    correct: "He can’t fly a kite",
  },
];

const Review6_Page1_Q3 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(""));
  const [score, setScore] = useState(null);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  const handleChange = (value, index) => {
    if (locked) return; // 🔒 منع التعديل بعد إظهار الإجابات

    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setWrongInputs([]);
  };
  const showAnswers = () => {
    const correctOnly = data.map((d) => d.correct); // يجيب كل الإجابات الصحيحة

    setAnswers(correctOnly); // نعرضهم
    setWrongInputs([]); // نخفي كل الأخطاء
    setLocked(true); // 🔒 منع أي تعديل
  };

  const checkAnswers = () => {
    if (locked) return; // 🔒 منع التعديل بعد إظهار الإجابات

    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    const correctCount = answers.filter(
      (ans, i) => ans.trim().toLowerCase() === data[i].correct.toLowerCase()
    ).length;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans.trim().toLowerCase() !== data[i].correct.toLowerCase()) {
        wrong.push(i); // خزن رقم السؤال الغلط
      }
    });

    setWrongInputs(wrong);
    setScore(correctCount);
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

    if (correctCount === data.length) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const reset = () => {
    setAnswers(Array(data.length).fill(""));
    setWrongInputs([]);
    setLocked(false)
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
          <h3 className="header-title-page8">C Look and write.</h3>
          <div className="content-unit5-p5-q3">
            <img
              src={deer}
              className="shape-img-unit5-p5-q3"
              alt=""
              style={{ height: "320px", width: "auto" }}
            />
            <div className="group-input-unit5-p5-q3">
              {data.map((item, index) => (
                <div
                  className="question-row"
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "20px",
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

                  <div
                    className="question-text"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <input
                      type="text"
                      className="q-input"
                      value={answers[index]}
                      disabled={locked}
                      onChange={(e) => handleChange(e.target.value, index)}
                    />
                    {/* ❌ علامة الخطأ */}
                    {!locked && wrongInputs.includes(index) && (
                      <span className="wrong-icon-review6-p1-q3">✕</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answers ✓
        </button>
      </div>
    </div>
  );
};

export default Review6_Page1_Q3;
