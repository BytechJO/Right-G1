import React, { useState } from "react";
import deer from "../../assets/unit4/imgs/U4P36EXED-01.svg";
import taxi from "../../assets/unit4/imgs/U4P36EXED-02.svg";
import table from "../../assets/unit1/imgs/table2.jpg";
import dish from "../../assets/unit4/imgs/U4P36EXED-03.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Review4_Page1_Q4.css";

const data = [
  {
    img: deer,
    question: "Is it a green triangle? Yes,",
    correct: "it is",
  },
  {
    img: taxi,
    question: "Is it a red square? No,",
    correct: "it isn't",
  },
  {
    img: dish,
    question: "Is it a blue",
    correct: "square Yes, it is",
  },
];

const Review4_Page1_Q4 = () => {
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
          <h3 className="header-title-page8">D Look, read, and write.</h3>

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
              <span className="q-number">{index + 1}.</span>
              <img
                src={item.img}
                className="shape-img"
                alt=""
                style={{ height: "100px", width: "100px" }}
              />

              <div
                className="question-text"
                style={{ display: "flex", alignItems: "center" ,position:"relative"}}
              >
                <h6>{item.question}</h6>
                <input
                  type="text"
                  className="q-input"
                  placeholder="Write your answer..."
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

export default Review4_Page1_Q4;
