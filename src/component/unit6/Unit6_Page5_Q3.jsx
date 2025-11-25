import React, { useState } from "react";
import deer from "../../assets/unit4/imgs/U4P36EXED-01.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit6_Page5_Q3.css";

const data = [
  {
    question: "",
    correct: "poster",
  },
  {
    question: "",
    correct: "board",
  },
  {
    question: "",
    correct: "book",
  },
  {
    question: "",
    correct: "desk",
  },
];

const Unit6_Page5_Q3 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(""));
  const [score, setScore] = useState(null);
  const [wrongInputs, setWrongInputs] = useState([]);
  const handleChange = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
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
    setScore(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
             <span className="ex-A">B</span>
            Label the things in the classroom..</h3>
          <div className="content-unit5-p5-q3">
            <img
              src={deer}
              className="shape-img-unit5-p5-q3"
              alt=""
              style={{ height: "250px", width: "auto" }}
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
                  <span className="q-number" style={{color:"#0d47a1" ,fontWeight:"600"}}>{index + 1}.</span>

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
                      onChange={(e) => handleChange(e.target.value, index)}
                    />
                    {/* ❌ علامة الخطأ */}
                    {wrongInputs.includes(index) && (
                      <span className="wrong-icon">✕</span>
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
        <button className="check-button2" onClick={checkAnswers}>
          Check Answers ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page5_Q3;
