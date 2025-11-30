import React, { useState } from "react";
import bat from "../../assets/unit6/imgs/U6P53EXED-01.svg";
import cap from "../../assets/unit6/imgs/U6P53EXED-02.svg";
import ant from "../../assets/unit6/imgs/U6P53EXED-03.svg";
import dad from "../../assets/unit6/imgs/U6P53EXED-04.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Review5_Page2_Q1.css";
const Review5_Page2_Q1 = () => {
  const items = [
    { img: bat, correct: "g", correctInput: "girl" },
    { img: cap, correct: "k", correctInput: "kitchen" },
    { img: ant, correct: "k", correctInput: "key" },
    { img: dad, correct: "g", correctInput: "garden" },
  ];

  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [selected, setSelected] = useState(["", "", "", ""]);

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
    setWrongInputs([]);
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
        answers[i].toLowerCase() === item.correctInput[0].toLowerCase();

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
          D Does it begin with <span style={{ color: "red" }}>g </span>or
          <span style={{ color: "red" }}>k </span> ? Circle and write.
        </h5>

        <div className="question-grid-unit4-page5-q1">
          {items.map((item, i) => (
            <div className="question-box-unit4-page5-q1" key={i}>
              <div style={{display:"flex"}}>
                <span
                  style={{
                    color: "#2c5287",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  {i + 1}
                </span>
                <img src={item.img} className="q-img-unit4-page5-q1" />
              </div>
              {/* g/ v choices */}
              <div className="choices-unit4-page5-q1">
                <div className="circle-wrapper">
                  <div
                    className={`circle-choice-review5-page2-q1 ${
                      selected[i] === "g" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("g", i)}
                  >
                    g
                  </div>

                  {/* X فوق دائرة f إذا كانت غلط */}
                  {showResult &&
                    selected[i] === "g" &&
                    selected[i] !== item.correct && (
                      <div className="wrong-mark">✕</div>
                    )}
                </div>

                <div className="circle-wrapper">
                  <div
                    className={`circle-choice-review5-page2-q1 ${
                      selected[i] === "k" ? "active" : ""
                    }`}
                    onClick={() => handleSelect("k", i)}
                  >
                    k
                  </div>

                  {/* X فوق دائرة v إذا كانت غلط */}
                  {showResult &&
                    selected[i] === "k" &&
                    selected[i] !== item.correct && (
                      <div className="wrong-mark">✕</div>
                    )}
                </div>
              </div>

              {/* writing input */}
              <div key={item.id} className="word-row-review5-p2-q1">
                <input
                  type="text"
                  maxLength={1}
                  value={answers[i]}
                  onChange={(e) => handleInput(e.target.value, i)}
                  className="first-letter-input-review5-p2-q1"
                />
                {showResult && (
                  <div className="wrong-mark-review5-p2-q1">✕</div>
                )}
                <span className="rest-word">{item.correctInput.slice(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
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

export default Review5_Page2_Q1;
