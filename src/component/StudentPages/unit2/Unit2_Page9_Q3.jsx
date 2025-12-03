import React, { useState } from "react";
import "./Unit2_Page9_Q3.css";
import jello from "../../../assets/img_unit2/imgs/jello.jpg";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import balloons from "../../../assets/img_unit2/imgs/balloons..jpg";
import ValidationAlert from "../../Popup/ValidationAlert";

const Unit2_Page9_Q3 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);

  const correctMatches = [
    { input: "It’s jello", num: "input1" },
    { input: "It’s a present", num: "input2" },
    { input: "These are balloons", num: "input3" },
  ];

  const handleChange = (e) => {
    if (disableInputs) return; // 🔥 يمنع التعديل عند Show Answer

    const { id, value } = e.target;

    setAnswers((prev) => {
      const updated = [...prev];
      const existingIndex = updated.findIndex((ans) => ans.num === id);

      if (existingIndex !== -1) {
        updated[existingIndex] = { input: value, num: id };
      } else {
        updated.push({ input: value, num: id });
      }
      return updated;
    });

    setWrongWords([]);
  };

  const checkAnswers = () => {
    if (showAnswers) return;
    if (answers.length === 0) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let correctCount = 0;
    let wrong = [];

    correctMatches.forEach((ans, i) => {
      const userAns = answers.find((a) => a.num === ans.num)?.input || "";
      if (ans.input === userAns) {
        correctCount++;
      } else {
        wrong.push(ans.num);
      }
    });

    setWrongWords(wrong);

    const total = correctMatches.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (total === correctCount) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  // ⭐ Show Correct Answers
  const showCorrectAnswers = () => {
    const correctFilled = correctMatches.map((item) => ({
      input: item.input,
      num: item.num,
    }));

    setAnswers(correctFilled);
    setDisableInputs(true);
    setShowAnswers(true);
    setWrongWords([]);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "60%" }}  className="div-forall">
        <h5 className="header-title-page8">C Look and answer.</h5>

        <div className="content-container-P9-Q3">
          {/* ========== Q1 ========== */}
          <div className="section-one11">
            <div style={{ display: "flex" }}>
              <span className="num2">1</span>
              <img src={jello} className="p9-q1-img2" />
            </div>

            <div className="content-input">
              <input readOnly value="What is it?" />

              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  id="input1"
                  className={`answer-input33 ${showAnswers ? "red-text" : ""}`}
                  value={answers.find((a) => a.num === "input1")?.input || ""}
                  onChange={handleChange}
                />

                {wrongWords.includes("input1") && (
                  <span className="error-mark-input1">✕</span>
                )}
              </div>
            </div>
          </div>

          {/* ========== Q2 ========== */}
          <div className="section-two22">
            <div style={{ display: "flex" }}>
              <span className="num2">2</span>
              <img src={present} className="p9-q1-img2" />
            </div>

            <div className="content-input">
              <input readOnly value="What is it?" />

              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  id="input2"
                  className={`answer-input33 ${showAnswers ? "red-text" : ""}`}
                  value={answers.find((a) => a.num === "input2")?.input || ""}
                  onChange={handleChange}
                />

                {wrongWords.includes("input2") && (
                  <span className="error-mark-input1">✕</span>
                )}
              </div>
            </div>
          </div>

          {/* ========== Q3 ========== */}
          <div className="section-three33">
            <div style={{ display: "flex" }}>
              <span className="num2">3</span>
              <img src={balloons} className="p9-q1-img2" />
            </div>

            <div className="content-input">
              <input readOnly value="What are these?" />

              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  id="input3"
                  className={`answer-input33 ${showAnswers ? "red-text" : ""}`}
                  value={answers.find((a) => a.num === "input3")?.input || ""}
                  onChange={handleChange}
                />

                {wrongWords.includes("input3") && (
                  <span className="error-mark-input1">✕</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ⭐ Buttons */}
        <div className="action-buttons-container">
          <button
            className="try-again-button"
            onClick={() => {
              setAnswers([]);
              setWrongWords([]);
              setShowAnswers(false);
              setDisableInputs(false);
            }}
          >
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={showCorrectAnswers}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit2_Page9_Q3;
