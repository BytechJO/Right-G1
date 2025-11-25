import React, { useState } from "react";
import img1 from "../../assets/unit4/imgs/U4P36EXEB-01.svg";
import img2 from "../../assets/unit4/imgs/U4P36EXEB-02.svg";
import img3 from "../../assets/unit3/imgs3/P27exeE-03.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit6_Page6_Q3.css";

const Unit5_Page6_Q3 = () => {
  const questions = [
    {
      id: 1,
      image: img1,
      text: "Is this a ruler?",
      items: [
        { text: "Yes, it is.", correct: "x" },
        { text: "No, it isn’t.", correct: "✓" },
      ],
    },
    {
      id: 2,
      image: img2,
      text: "Is this a chair?",
      items: [
        { text: "Yes, it is.", correct: "✓" },
        { text: "No, it isn’t.", correct: "x" },
      ],
    },
  ];

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  // -------------------------
  // اختيار جواب واحد فقط لكل سؤال
  // -------------------------
  const handleSelect = (qId, idx) => {
    setAnswers({
      ...answers,
      [qId]: idx, // نخزن رقم الخيار المختار
    });
  };

  const checkAnswers = () => {
    const temp = {};
    let correctCount = 0;
    let total = questions.length;

    questions.forEach((q) => {
      const chosenIndex = answers[q.id];

      if (chosenIndex === undefined) {
        temp[q.id] = "empty";
        return;
      }

      const isCorrect = q.items[chosenIndex].correct.toLowerCase() === "✓";

      temp[q.id] = isCorrect ? "correct" : "wrong";

      if (isCorrect) correctCount++;
    });

    setResults(temp);

    if (Object.values(temp).includes("empty")) {
      ValidationAlert.info("Please answer all questions!");
      return;
    }

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;
    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };
  const reset = () => {
    setAnswers({});
    setResults({});
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
        <div className="review3-p1-q3-wrapper">
          <h4 className="header-title-page8">
            <span className="letter-of-Q"> F</span> Look, read, and write
            <span style={{ color: "red" }}>✓</span>.{" "}
          </h4>

          <div className="Unit5-P6-Q3-grid">
            {questions.map((q) => (
              <div key={q.id} className="Unit5-P6-Q3-box">
                <img src={q.image} alt="" className="Unit5-P6-Q3-img" />
                <div>
                  {q.items.map((item, idx) => {
                    const isSelected = answers[q.id] === idx;
                    const isWrong = results[q.id] === "wrong" && isSelected;

                    return (
                      <div key={idx} className="review3-p1-q3-row">
                        <span className="Unit5-P6-Q3-text">{item.text}</span>

                        <div className="review3-p1-q3-input-box">
                          <input
                            type="text"
                            readOnly
                            value={isSelected ? "✓" : ""}
                            onFocus={() => handleSelect(q.id, idx)}
                            className={`review3-p1-q3-input`}
                          />

                          {isWrong && (
                            <span className="review3-p1-q3-x">X</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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

export default Unit5_Page6_Q3;
