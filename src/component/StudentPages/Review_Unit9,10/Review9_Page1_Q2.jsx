import React, { useState } from "react";
import farmImg from "../../../assets/unit4/imgs/feet.svg"; // عدّل المسار حسب مشروعك
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review9_Page1_Q2.css";

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

  const [questionInputs, setQuestionInputs] = useState(
    items.map((item) => Array(item.blanksCount).fill(""))
  );

  const [answers, setAnswers] = useState(items.map(() => ""));
  const [showCorrect, setShowCorrect] = useState(false);

  // =========================
  // Show Answers
  // =========================
  const showAnswers = () => {
    setQuestionInputs(items.map((item) => item.questionAnswers || []));
    setAnswers(items.map((item) => item.answer));
    setShowCorrect(true);
  };

  // =========================
  // Reset
  // =========================
  const resetAll = () => {
    setQuestionInputs(items.map((item) => Array(item.blanksCount).fill("")));
    setAnswers(items.map(() => ""));
    setShowCorrect(false);
  };

  // =========================
  // Check Answers
  // =========================
  const checkAnswers = () => {
    if (showAnswers) return;
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

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          B Look and write.
        </h5>
        {/* 🔹 Image */}
        <div className="content-review9-p1-q2">
          <img
            src={farmImg}
            alt=""
            style={{ height: "270px", width: "auto" }}
          />
          <div>
            {items.map((item, i) => (
              <div key={i} className="question-box-review9-p1-q2">
                {/* 🔹 Question */}
                <p className="question-text">
                  {item.questionParts.map((part, idx) =>
                    part === "" ? (
                      <input
                        key={idx}
                        type="text"
                        className={`question-blank-review9-p1-q2 ${
                          showCorrect ? "correct-color" : ""
                        }`}
                        value={questionInputs[i][idx]}
                        onChange={(e) => {
                          if (showCorrect) return;
                          const newInputs = [...questionInputs];
                          newInputs[i][idx] = e.target.value;
                          setQuestionInputs(newInputs);
                        }}
                      />
                    ) : (
                      <span key={idx}> {part} </span>
                    )
                  )}
                </p>

                {/* 🔹 Answer input */}
                <input
                  type="text"
                  className={`answer-input-review9-p1-q2 ${
                    showCorrect ? "correct-color" : ""
                  }`}
                  value={answers[i]}
                  onChange={(e) => {
                    if (showCorrect) return;
                    const newAns = [...answers];
                    newAns[i] = e.target.value;
                    setAnswers(newAns);
                  }}
                />
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
  );
};

export default Review9_Page1_Q2;
