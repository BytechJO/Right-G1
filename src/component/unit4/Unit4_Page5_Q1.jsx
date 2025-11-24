import React, { useState } from "react";
import bat from "../../assets/unit4/imgs/U4P32ExeA1-01.svg";
import cap from "../../assets/unit4/imgs/U4P32ExeA1-02.svg";
import ant from "../../assets/unit4/imgs/U4P32ExeA1-03.svg";
import dad from "../../assets/unit4/imgs/U4P32ExeA1-04.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit4_Page5_Q1.css";
const Unit4_Page5_Q1 = () => {
  const items = [
    { img: bat, correct: "v", correctInput: "vet" },
    { img: cap, correct: "f", correctInput: "feet" },
    { img: ant, correct: "f", correctInput: "fish" },
    { img: dad, correct: "f", correctInput: "fork" },
  ];

  const [selected, setSelected] = useState(["", "", "", ""]);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const handleSelect = (value, index) => {
    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);
     setShowResult(false);
  };

  const handleInput = (value, index) => {
    const newAns = [...answers];
    newAns[index] = value;
    setAnswers(newAns);
     setShowResult(false);
  };

  const resetAll = () => {
    setSelected(["", "", "", ""]);
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowResult(false);
  };

  const checkAnswers = () => {
    // 1) التشييك إذا في دائرة مش مختارة
    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose a circle (f or v) for all items!");
      return;
    }

    // 2) التشييك إذا في input فاضي
    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all the writing boxes!");
      return;
    }

    let wrong = [];
    let score = 0;

    items.forEach((item, i) => {
      const circleCorrect = selected[i] === item.correct;
      const inputCorrect =
        answers[i].trim().toLowerCase() === item.correctInput.toLowerCase();

      // نقطة للدائرة + نقطة للكتابة
      if (circleCorrect) score++;
      if (inputCorrect) score++;

      if (!circleCorrect || !inputCorrect) {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowResult(true);

    const total = items.length * 2; // 8 نقاط
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
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
        <h5 className="header-title-page8">
          <span className="letter-of-Q">A</span>{" "}
          <span style={{ color: "purple" }}>1</span> Look, circle, and write.
        </h5>

        <div className="question-grid-unit4-page5-q1">
          {items.map((item, i) => (
            <div className="question-box-unit4-page5-q1" key={i}>
              <img src={item.img} className="q-img-unit4-page5-q1" />

              {/* f / v choices */}
              <div className="choices-unit4-page5-q1">
                <div className="circle-wrapper">
                  <div
                    className={`circle-choice-unit4-page5-q1 ${
                      selected[i] === "f" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("f", i)}
                  >
                    f
                  </div>

                  {/* X فوق دائرة f إذا كانت غلط */}
                  {showResult &&
                    selected[i] === "f" &&
                    selected[i] !== item.correct && (
                      <div className="wrong-mark">✕</div>
                    )}
                </div>

                <div className="circle-wrapper">
                  <div
                    className={`circle-choice-unit4-page5-q1 ${
                      selected[i] === "v" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("v", i)}
                  >
                    v
                  </div>

                  {/* X فوق دائرة v إذا كانت غلط */}
                  {showResult &&
                    selected[i] === "v" &&
                    selected[i] !== item.correct && (
                      <div className="wrong-mark">✕</div>
                    )}
                </div>
              </div>

              {/* writing input */}
              <div className="input-wrapper">
                <input
                  type="text"
                  className="write-input-unit4-page5-q1"
                  value={answers[i]}
                  onChange={(e) => handleInput(e.target.value, i)}
                />

                {/* X فوق الإنبت إذا كانت الكلمة غلط */}
                {showResult &&
                  answers[i].trim() !== "" &&
                  answers[i].trim().toLowerCase() !==
                    item.correctInput.toLowerCase() &&
                  wrongInputs.includes(i) && (
                    <div className="wrong-mark">✕</div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
      <div className="action-buttons-container">
        <button onClick={resetAll} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit4_Page5_Q1;
