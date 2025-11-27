import React, { useState, useRef, useEffect } from "react";
import bat from "../../assets/unit4/imgs/U4P32ExeA2-01.svg";
import cap from "../../assets/unit4/imgs/U4P32ExeA2-02.svg";
import ant from "../../assets/unit4/imgs/U4P32ExeA2-03.svg";
import dad from "../../assets/unit4/imgs/U4P32ExeA2-04.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit7_Page5_Q3.css";
const Unit7_Page5_Q3 = () => {
  const correctAnswers = ["happy", "cold", "crawl"];
  const [answers, setAnswers] = useState(["", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);

  const handleChange = (value, index) => {
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
      if (ans === correctAnswers[i]) {
        tempScore++;
      } else {
        wrong.push(i); // خزن رقم السؤال الغلط بدل الكلمة
      }
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

    if (tempScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (tempScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const reset = () => {
    setAnswers(["", "", ""]);
    setWrongInputs([]);
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
          <span className="letter-of-Q">B</span>Look, and write.
        </h5>
        <div
          className="row-content10-unit3-page6-q1"
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <div className="row2-unit3-page6-q1">
            <img src={bat} alt="" className="q-img-unit3-page6-q1" />
            <span style={{ position: "relative", display: "flex" }}>
              <div className="input-wrapper-unit3-page6-q1">
                <input
                  type="text"
                  className="q-input-unit3-page6-q1"
                  onChange={(e) => handleChange(e.target.value, 0)}
                  value={answers[0]}
                />
                {wrongInputs.includes(0) && (
                  <span className="error-mark-input">✕</span>
                )}
              </div>
            </span>
          </div>

          <div className="row2-unit3-page6-q1">
            <img src={cap} alt="" className="q-img-unit3-page6-q1" />
            <span style={{ position: "relative", display: "flex" }}>
              <div className="input-wrapper-unit3-page6-q1">
                <input
                  type="text"
                  className="q-input-unit3-page6-q1"
                  onChange={(e) => handleChange(e.target.value, 1)}
                  value={answers[1]}
                />{" "}
                {wrongInputs.includes(1) && (
                  <span className="error-mark-input">✕</span>
                )}
              </div>
            </span>
          </div>

          <div className="row2-unit3-page6-q1">
            <img src={ant} alt="" className="q-img-unit3-page6-q1" />
            <span style={{ position: "relative", display: "flex" }}>
              <div className="input-wrapper-unit3-page6-q1">
                <input
                  type="text"
                  className="q-input-unit3-page6-q1"
                  onChange={(e) => handleChange(e.target.value, 2)}
                  value={answers[2]}
                />{" "}
                {wrongInputs.includes(2) && (
                  <span className="error-mark-input">✕</span>
                )}
              </div>
            </span>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit7_Page5_Q3;
