import React, { useState } from "react";
import img1 from "../../assets/unit4/imgs/U4P34EXEC-01.svg";
import img2 from "../../assets/unit4/imgs/U4P34EXEC-02.svg";
import img3 from "../../assets/unit4/imgs/U4P34EXEC-03.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Review3_Page1_Q3.css";

const Review3_Page1_Q3 = () => {
  const questions = [
    {
      id: 1,
      image: img1,
      items: [
        { text: "Close your book.", correct: "x" },
        { text: "Open your book.", correct: "✓" },
      ],
    },
    {
      id: 2,
      image: img2,
      items: [
        { text: "Take out your pencil.", correct: "x" },
        { text: "Make a line.", correct: "✓" },
      ],
    },
    {
      id: 3,
      image: img3,
      items: [
        { text: "Listen!", correct: "✓" },
        { text: "Quiet!", correct: "x" },
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

      const isCorrect =
        q.items[chosenIndex].correct.toLowerCase() === "✓";

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
  }
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
          <h4 className="header-title-page8">C Read and write <span style={{color:"red"}}>✓</span> </h4>

          <div className="review3-p1-q3-grid">
            {questions.map((q) => (
              <div key={q.id} className="review3-p1-q3-box">
                <img src={q.image} alt="" className="review3-p1-q3-img" />

                {q.items.map((item, idx) => {
                  const isSelected = answers[q.id] === idx;
                  const isWrong = results[q.id] === "wrong" && isSelected;

                  return (
                    <div key={idx} className="review3-p1-q3-row">
                      <span className="review3-p1-q3-text">{item.text}</span>

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

export default Review3_Page1_Q3;
