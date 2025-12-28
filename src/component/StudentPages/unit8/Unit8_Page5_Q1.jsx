import React, { useState } from "react";
import "./Unit8_Page5_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/unit8/imgs/U8P68EXEA1-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P68EXEA1-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P68EXEA1-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P68EXEA1-04.svg";
const data = [
  {
    img: img1,
    scrambled: "perpzi",
    answer: "zipp",
    pattern: "er",
  },
  { img: img2, scrambled: "ksoc", answer: "so", pattern: "ck" },
  { img: img3, scrambled: "ozo", answer: "z", pattern: "oo" },
  { img: img4, scrambled: "beazr", answer: "ze", pattern: "bra" },
];

const Unit8_Page5_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false)
  );
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW

  const checkAnswers = () => {
    if (showAnswer) return; // ❌ ممنوع التعديل بعد Show Answer

    if (inputs.some((val) => val.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the answers before checking."
      );
      return;
    }

    let correctCount = 0;
    const wrongFlags = [];

    data.forEach((item, index) => {
      if (inputs[index].toLowerCase() === item.answer) {
        correctCount++;
        wrongFlags[index] = false;
      } else {
        wrongFlags[index] = true;
      }
    });

    setWrongInputs(wrongFlags);

    const total = data.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const handleChange = (value, index) => {
    if (showAnswer) return; // ❌ ممنوع التعديل بعد Show Answer

    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    setWrongInputs(Array(data.length).fill(false));
  };

  const handleShowAnswer = () => {
    const correct = data.map((item) => item.answer);
    setInputs(correct); // ⭐ تعبئة الإجابة الصحيحة
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(true);
  };

  const reset = () => {
    setInputs(Array(data.length).fill(""));
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(false);
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
       className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="unscramble-container">
          <h3 className="header-title-page8">
            <span className="ex-A">A</span>{" "}
            <span style={{ color: "purple" }}>1</span> Look, unscramble, and
            write.
          </h3>

          <div className="unscramble-row">
            {data.map((item, index) => (
              <div className="unscramble-box" key={index}>
                <div className="img-box">
                  <img src={item.img} alt="" />
                </div>

                <p className="scrambled-word" style={{ fontSize: "22px" }}>
                  {item.scrambled}
                </p>

                <div className="input-row">
                  <span className="num" style={{ fontSize: "22px" }}>
                    {index + 1}
                  </span>

                  <div className="input-wrapper">
                    <input
                      type="text"
                      style={{ fontSize: "22px" }}
                      value={inputs[index]}
                      onChange={(e) => handleChange(e.target.value, index)}
                      className="text-input"
                      disabled={showAnswer} // ⭐ NEW
                    />

                    {/* ❌ علامة الخطأ */}
                    {wrongInputs[index] && !showAnswer && (
                      <div className="error-icon">✕</div>
                    )}
                  </div>

                  <span className="pattern" style={{ fontSize: "22px" }}>
                    {item.pattern}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ⭐ BUTTONS */}
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit8_Page5_Q1;
