import React, { useState } from "react";
import deer from "../../assets/unit6/imgs/U6P52EXEB-01.svg";
import duck from "../../assets/unit6/imgs/U6P52EXEB-02.svg";
import taxi from "../../assets/unit6/imgs/U6P52EXEB-03.svg";
import tiger from "../../assets/unit6/imgs/U6P52EXEB-04.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Review5_Page1_Q2.css";
const Review5_Page1_Q2 = () => {
  const data = [
    {
      word: "This is your chair.",
      src: deer,
      num: "3",
    },
    {
      word: "This is my book.",
      src: duck,
      num: "1",
    },
    {
      word: "This is my pen.",
      src: taxi,
      num: "2",
    },
    {
      word: "This is your ruler.",
      src: tiger,
      num: "4",
    },
  ];

  const [answers, setAnswers] = useState(
    data.map((item, index) =>
      index === 0 ? { number: item.num } : { number: "" }
    )
  );

  const [wrongNumbers, setWrongNumbers] = useState(data.map(() => false));

  const updateAnswer = (index, field, value) => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === index ? { ...a, [field]: value.toLowerCase() } : a
      )
    );
     setWrongNumbers(data.map(() => false));
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
  if (i === 0) return; // تجاهل أول إجابة تمامًا
  if (a.number === data[i].num) correctNumbers++;
});
    let totalPoints = data.length - 1;
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
        <div className="page8-content">
          <header className="header-title-page8">
            B Look, read, and number the sentences.
          </header>

          {/* ✅ الصور */}
          <div
            className="exercise-image-div-review3-p1-q1"
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "20px",
              marginTop: "40px",
              justifyContent:"space-between"
            }}
          >
            {data.map((item, index) => (
              <>
              <span style={{color:"#2c5287" ,fontSize:"22px",fontWeight:"700"}}>{index+1}</span>
                <img
                  key={index}
                  src={item.src}
                  className="exercise-image-review5-p1-q2"
                />
              </>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* ✅ مربعات الأرقام + علامة الخطأ  */}
            <div
              className="exercise-container-review5-p1-q2"
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
                  <span style={{ width: "200px" }}>{item.word}</span>{" "}
                  <div
                    key={index}
                    className="exercise-item-review3-p1-q1"
                    style={{ position: "relative" }}
                  >
                    <input
                      type="text"
                      maxLength="1"
                      className="missing-input-review5-p1-q2"
                      value={answers[index].number}
                      onChange={(e) =>
                        index !== 0 &&
                        updateAnswer(index, "number", e.target.value)
                      }
                      readOnly={index === 0}
                    />

              {index !== 0 && wrongNumbers[index] && (
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
                        ✕
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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

export default Review5_Page1_Q2;
