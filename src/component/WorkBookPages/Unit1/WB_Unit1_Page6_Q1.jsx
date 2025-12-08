import React, { useState } from "react";
import img1 from "../../../assets/U1 WB/U1/SVG/U1P6EXEG-01.svg";
import img2 from "../../../assets/U1 WB/U1/SVG/U1P6EXEG-02.svg";
import img3 from "../../../assets/U1 WB/U1/SVG/U1P6EXEG-03.svg";
import img4 from "../../../assets/U1 WB/U1/SVG/U1P6EXEG-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page6_Q1.css";

export default function WB_Unit1_Page6_Q1() {
  const data = [
    { img: img1, answer: "Good morning!" },
    { img: img2, answer: "Good afternoon!" },
    { img: img3, answer: "How are you?" },
    { img: img4, answer: "Goodbye!" },
  ];

  const [inputs, setInputs] = useState(["", "", "", ""]);
  const [wrong, setWrong] = useState([false, false, false, false]);
  const [showAnswer, setShowAnswer] = useState(false);

  const updateInput = (index, value) => {
    if (showAnswer) return;
    setInputs((prev) => prev.map((v, i) => (i === index ? value : v)));
    setWrong([false, false, false, false]);
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    if (inputs.some((v) => v.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking."
      );
      return;
    }

    let correct = 0;
    const wrongStatus = inputs.map((v, i) => {
      const ok = v.trim().toLowerCase() === data[i].answer.toLowerCase();
      if (ok) correct++;
      return !ok;
    });

    setWrong(wrongStatus);

    let total = data.length;
    let color = correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const reset = () => {
    setInputs(["", "", "", ""]);
    setWrong([false, false, false, false]);
    setShowAnswer(false);
  };

  return (
    <div className="page8-wrapper">
      <div className="div-forall" style={{ width: "60%" }}>
        {/* العنوان */}
        <h3 className="header-title-page8">
          <span className="ex-A">G</span> Read, look, and write. Say.
        </h3>

        {/* الكلمات فوق */}
        <div className="word-bank-wb-u1-q4">
          <span className="word-wb-u1-p2-q1">Good morning!</span>
          <span className="word-wb-u1-p2-q1">Good afternoon!</span>
          <span className="word-wb-u1-p2-q1">Goodbye!</span>
          <span className="word-wb-u1-p2-q1">How are you?</span>
        </div>

        <div className="question-container-wb-u1-p4-q1">
          {/* الأسئلة */}
          {data.map((item, i) => (
            <div key={i} className="question-row-wb-u1-q4">
              <div className="img-box-wb-u1-q4">
                <div style={{ display: "flex", gap: "20px" }}>
                  <span
                    style={{
                      color: "darkblue",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {i + 1}
                  </span>{" "}
                  <img
                    src={item.img}
                    alt=""
                    style={{ height: "150px", width: "auto" }}
                  />
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="input-text-field"
                    style={{
                      width: "70%",
                      height: "40px",
                      borderBottom: "2px solid black",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                    value={showAnswer ? item.answer : inputs[i]}
                    onChange={(e) => updateInput(i, e.target.value)}
                    disabled={ showAnswer}
                  />

                  {wrong[i] && (
                    <div className="wrong-icon-wb-unit1-p6-q1">✕</div>
                  )}
                </div>{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* الأزرار */}
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button
          className="show-answer-btn swal-continue"
          onClick={() => setShowAnswer(true)}
        >
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
