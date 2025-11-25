import React, { useState } from "react";
import deer from "../../assets/unit4/imgs/U4P34EXEA-01.svg"
import duck from "../../assets/unit4/imgs/U4P34EXEA-02.svg";
import taxi from "../../assets/unit4/imgs/U4P34EXEA-03.svg";
import tiger from "../../assets/unit4/imgs/U4P34EXEA-04.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Review3_Page1_Q1.css"
const Review3_Page1_Q1 = () => {


  const data = [
    {
      word: "Quiet!",
      src: deer,
      num: "3",
    },
    {
      word: "Close your book.",
      src: duck,
      num: "4",
    },
    {
      word: "Make a line.",
      src: taxi,
      num: "1",
    },
    {
      word: "Listen!",
      src: tiger,
      num: "2",
    },
  ];

  const [answers, setAnswers] = useState(data.map(() => ({ number: "" })));

  const [wrongNumbers, setWrongNumbers] = useState(data.map(() => false));

  const updateAnswer = (index, field, value) => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === index ? { ...a, [field]: value.toLowerCase() } : a
      )
    );
  };

  const reset = () => {
    setAnswers(data.map(() => ({ number: "" })));
    setWrongNumbers(data.map(() => false));
  };

  const checkAnswers = () => {
    if (answers.some((a) => a.number === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking."
      );
      return;
    }

    let correctLetters = 0;
    let correctNumbers = 0;

    answers.forEach((a, i) => {
      if (a.number === data[i].num) correctNumbers++;
    });

    let totalPoints = data.length;
    let score = correctNumbers;

    const numberWrongs = answers.map((a, i) => a.number !== data[i].num);

    setWrongNumbers(numberWrongs);

    let color =
      score === totalPoints ? "green" : score === 0 ? "red" : "orange";

    let scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">Score: ${score} / ${totalPoints}</span>
      </div>
    `;

    if (score === totalPoints) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  return (
    <div className="page8-wrapper">
      <div className="page8-content">
        <header className="header-title-page8">
          A Look and number.
        </header>

        {/* ✅ الصور */}
        <div
          className="exercise-image-div-review3-p1-q1"
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "20px",
            marginTop: "40px",
          }}
        >
          {data.map((item, index) => (
            <>
              <img key={index} src={item.src} className="exercise-image-review3-p1-q1" />
            </>
          ))}
        </div>

        {/* ✅ مربعات الأرقام + علامة الخطأ  */}
        <div
          className="exercise-container"
          style={{
            marginTop: "20px",
          }}
        >
          {data.map((item, index) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                key={index}
                className="exercise-item-review3-p1-q1"
                style={{ position: "relative" }}
              >
                <input
                  type="text"
                  maxLength="1"
                  className="missing-input"
                  value={answers[index].number}
                  onChange={(e) =>
                    updateAnswer(index, "number", e.target.value)
                  }
                />

                {wrongNumbers[index] && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-17px",
                      top: "5%",
                      transform: "translateY(-50%)",
                      width: "25px",
                      height: "25px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      border: "2px solid white",
                    }}
                  >
                    X
                  </div>
                )}
              </div>
              <span>{item.word}</span>
            </div>
          ))}
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

export default Review3_Page1_Q1;
