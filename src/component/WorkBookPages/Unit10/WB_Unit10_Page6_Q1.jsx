import React, { useState } from "react";
import "./WB_Unit10_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/unit8/imgs/U8P68EXEA1-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P68EXEA1-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P68EXEA1-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P68EXEA1-04.svg";
const data = [
  { img: img4, scrambled: "geg", answer: "egg", pattern: "geg" },
  { img: img2, scrambled: "ent", answer: "net", pattern: "ent" },
  {
    img: img1,
    scrambled: "tej",
    answer: "jet",
    pattern: "tej",
  },

  { img: img3, scrambled: "ebd", answer: "bed", pattern: "ebd" },
  { img: img4, scrambled: "neh", answer: "hen", pattern: "neh" },
  { img: img3, scrambled: "nte", answer: "ten", pattern: "nte" },
];

const WB_Unit10_Page6_Q1 = () => {
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
    setShowAnswer(true);
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
            <span className="ex-A">A</span>Look, unscramble, and write. words.
          </h3>

          <div className="unscramble-row-wb-unit9-p6-q1 ">
            {data.map((item, index) => (
              <div className="unscramble-box-wb-unit9-p6-q1" key={index}>
                <div className="img-box-wb-unit10-p6-q1">
                  <span
                    className="num"
                    style={{ fontSize: "25px", fontWeight: "600" }}
                  >
                    {index + 1}
                  </span>{" "}
                  <img src={item.img} alt="" style={{ height: "130px" }} />
                </div>
                <div className="input-row">
                  <span className="pattern" style={{ fontSize: "22px" }}>
                    {item.pattern}
                  </span>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      style={{ fontSize: "25px", fontWeight: "600" }}
                      value={inputs[index]}
                      onChange={(e) => handleChange(e.target.value, index)}
                      className="text-input"
                      disabled={showAnswer} // ⭐ NEW
                    />

                    {/* ❌ علامة الخطأ */}
                    {wrongInputs[index] && (
                      <div className="error-icon">✕</div>
                    )}
                  </div>
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

export default WB_Unit10_Page6_Q1;
