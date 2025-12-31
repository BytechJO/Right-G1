import React, { useState } from "react";
import "./WB_Unit3_Page2_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit3_Page2_Q1 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);

  const [disableInputs, setDisableInputs] = useState(false);
  const [inputs, setInputs] = useState({});
  const [wrong, setWrong] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [locked, setLocked] = useState(false);
  const questions = [
    {
      id: "q1",
      scramble: "your/book/close.",
      questionCorrect: "Close your book",
    },
    {
      id: "q2",
      scramble: "pencil/take/your/out",
      questionCorrect: "Take out your pencil",
    },
    {
      id: "q3",
      scramble: "line/a/make.",
      questionCorrect: "Make a line",
    },
    {
      id: "q4",
      scramble: "open/book/your.",
      questionCorrect: "Open your book",
    },
  ];

  const handleChange = (e) => {
    if (showAnswers || locked) return;

    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const checkAnswers = () => {
    if (showAnswers || locked) return;

    // ❌ فحص إذا في input فاضي
    const hasEmptyInput = questions.some(
      (q) =>
        !inputs[`${q.id}_question`] || inputs[`${q.id}_question`].trim() === ""
    );

    if (hasEmptyInput) {
      ValidationAlert.info(
        "Oops!",
        "Please answer all the questions before checking."
      );
      return;
    }
    let wrongTemp = {};
    let score = 0;
    const total = questions.length;

    questions.forEach((q) => {
      if (inputs[`${q.id}_question`] !== q.questionCorrect) {
        wrongTemp[`${q.id}_question`] = true;
      } else {
        score++;
      }
    });

    setWrong(wrongTemp);
    setLocked(true);
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
      </span>
    </div>
  `;
    if (total === score) {
      return ValidationAlert.success(msg);
    } else if (score === 0) {
      return ValidationAlert.error(msg);
    } else {
      return ValidationAlert.warning(msg);
    }
  };

  // ⭐ Show Correct Answers
  const showCorrectAnswers = () => {
    let filled = {};

    questions.forEach((q) => {
      filled[`${q.id}_question`] = q.questionCorrect;
    });

    setInputs(filled);
    setWrong({});
    setShowAnswers(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div style={{ width: "60%" }} className="div-forall">
        <h5 className="header-title-page8">
          <span className="ex-A">C</span>Unscramble and write.
        </h5>

        <div className="content-container-wb-unit3-p2-q1">
          {questions.map((q, index) => (
            <div style={{ display: "flex", width: "100%" }}>
              <div className="input-container-wb-unit3-p2-q1">
                <div style={{ display: "flex" }}>
                  <span className="num2">{index + 1}</span>
                  <input
                    readOnly
                    value={q.scramble}
                    className="answer-input-review10-p1-q3"
                  />
                </div>
                {/* Unscramble input */}
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    name={`${q.id}_question`}
                    value={inputs[`${q.id}_question`] || ""}
                    onChange={handleChange}
                    disabled={locked}
                    className="answer-input33-review10-p1-q3"
                  />
                  {wrong[`${q.id}_question`] && (
                    <span className="error-mark-input1">✕</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ⭐ Buttons */}
        <div className="action-buttons-container">
          <button
            className="try-again-button"
            onClick={() => {
              setAnswers([]);
              setInputs({});
              setWrong({});
              setWrongWords([]);
              setShowAnswers(false);
              setDisableInputs(false);
              setLocked(false)
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

export default WB_Unit3_Page2_Q1;
