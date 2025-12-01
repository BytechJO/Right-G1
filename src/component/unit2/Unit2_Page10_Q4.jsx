import React, { useState } from "react";
import pizza2 from "../../assets/img_unit2/imgs/Pizza (2).jpg";
import boy from "../../assets/img_unit2/imgs/boy 02.png";
import paint from "../../assets/img_unit2/imgs/Paint.jpg";
import pincle from "../../assets/img_unit2/imgs/Pencel.jpg";
import ValidationAlert from "../Popup/ValidationAlert"; // تأكدي إنها موجودة
import "./Unit2_Page10_Q4.css";
const Unit2_Page10_Q4 = () => {
  const correctAnswers = ["p", "b", "p", "p"];
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const handleChange = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value.toLowerCase();
    setAnswers(newAnswers);
    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (showAnswer) return;
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
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowAnswer(false);
  };
  const handleShowAnswer = () => {
    setAnswers(correctAnswers); // نحط الإجابات الصحيحة كاملة
    setWrongInputs([]); // نخفي X
    setShowAnswer(true); // نمنع التعديل
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
        <div className="question-wrapper10">
          <h5 className="header-title-page8">G Look and write.</h5>
          <div className="row-content10-1">
            <div className="row2">
              <span style={{ position: "relative", display: "flex" }}>
                <span className="num-span">1</span>{" "}
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`q-input ${showAnswer ? "show-answer-red1" : ""}`}
                    onChange={(e) => handleChange(e.target.value, 0)}
                    value={answers[0]}
                    disabled={showAnswer} // يمنع الكتابة بعد Show Answer
                  />
                  {wrongInputs.includes(0) && (
                    <span className="error-mark-input">✕</span>
                  )}
                </div>
              </span>{" "}
              <img src={paint} alt="" className="q-img10" />
            </div>

            <div className="row2">
              <span style={{ position: "relative", display: "flex" }}>
                <span className="num-span">2</span>{" "}
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`q-input ${showAnswer ? "show-answer-red1" : ""}`}
                    onChange={(e) => handleChange(e.target.value, 1)}
                    value={answers[1]}
                    disabled={showAnswer} // يمنع الكتابة بعد Show Answer
                  />{" "}
                  {wrongInputs.includes(1) && (
                    <span className="error-mark-input">✕</span>
                  )}
                </div>
              </span>
              <img src={boy} alt="" className="q-img10" />
            </div>

            <div className="row2">
              <span style={{ position: "relative", display: "flex" }}>
                <span className="num-span">3</span>{" "}
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`q-input ${showAnswer ? "show-answer-red1" : ""}`}
                    onChange={(e) => handleChange(e.target.value, 2)}
                    value={answers[2]}
                    disabled={showAnswer} // يمنع الكتابة بعد Show Answer
                  />{" "}
                  {wrongInputs.includes(2) && (
                    <span className="error-mark-input">✕</span>
                  )}
                </div>
              </span>
              <img src={pizza2} alt="" className="q-img10" />
            </div>

            <div className="row2">
              <span style={{ position: "relative", display: "flex" }}>
                <span className="num-span">4</span>{" "}
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`q-input ${showAnswer ? "show-answer-red1" : ""}`}
                    onChange={(e) => handleChange(e.target.value, 3)}
                    value={answers[3]}
                    disabled={showAnswer} // يمنع الكتابة بعد Show Answer
                  />{" "}
                  {wrongInputs.includes(3) && (
                    <span className="error-mark-input">✕</span>
                  )}
                </div>
              </span>{" "}
              <img src={pincle} alt="" className="q-img10" />
            </div>
          </div>
        </div>
      </div>
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

export default Unit2_Page10_Q4;
