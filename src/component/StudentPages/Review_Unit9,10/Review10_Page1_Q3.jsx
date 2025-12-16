import React, { useState } from "react";
import "./Review10_Page1_Q3.css";
import jello from "../../../assets/img_unit2/imgs/jello.jpg";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import balloons from "../../../assets/img_unit2/imgs/balloons..jpg";
import ValidationAlert from "../../Popup/ValidationAlert";

const Review10_Page1_Q3 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);

  const [disableInputs, setDisableInputs] = useState(false);
  const [inputs, setInputs] = useState({});
  const [wrong, setWrong] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  const questions = [
    {
      id: "q1",
      scramble: "w a n t / d o / a p p l e / y o u / a n ?",
      questionCorrect: "Do you want an apple?",
      answerCorrect: "Yes, I do.",
      img: jello,
    },
    {
      id: "q2",
      scramble: "d o / i c e / c r e a m / w a n t / y o u ?",
      questionCorrect: "Do you want ice cream?",
      answerCorrect: "No, I don’t. I want a milkshake.",
      img: present,
    },
  ];

  const handleChange = (e) => {
    if (showAnswers) return;

    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const checkAnswers = () => {
    let wrongTemp = {};
    let score = 0;
    const total = questions.length * 2;

    questions.forEach((q) => {
      if (inputs[`${q.id}_question`] !== q.questionCorrect) {
        wrongTemp[`${q.id}_question`] = true;
      } else {
        score++;
      }

      if (inputs[`${q.id}_answer`] !== q.answerCorrect) {
        wrongTemp[`${q.id}_answer`] = true;
      } else {
        score++;
      }
    });

    setWrong(wrongTemp);

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert.info(`
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
      </span>
    </div>
  `);
  };

  // ⭐ Show Correct Answers
  const showCorrectAnswers = () => {
    let filled = {};

    questions.forEach((q) => {
      filled[`${q.id}_question`] = q.questionCorrect;
      filled[`${q.id}_answer`] = q.answerCorrect;
    });

    setInputs(filled);
    setWrong({});
    setShowAnswers(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div style={{ width: "60%" }} className="div-forall">
        <h5 className="header-title-page8">C Unscramble and write.</h5>

        <div className="content-container-P9-Q3">
          {questions.map((q, index) => (
            <div key={q.id} className="section-one11-review10-p1-q3">
              <div style={{ display: "flex",width:"100%" ,height:"100%"}}>
                
                <div className="input-container-review10-p1-q3" >
                  <div style={{ display: "flex" }}>
                  <span className="num2">{index + 1}</span>
                  <input readOnly value={q.scramble} className="answer-input-review10-p1-q3"/>
</div>
                  {/* Unscramble input */}
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      name={`${q.id}_question`}
                      value={inputs[`${q.id}_question`] || ""}
                      onChange={handleChange}
                      className="answer-input33-review10-p1-q3"
                    />
                    {wrong[`${q.id}_question`] && (
                      <span className="error-mark-input1">✕</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="content-input-review10-p1-q3">
                {/* Scramble */}
                <img src={q.img} className="p9-q1-img2" />
                {/* Answer input */}
                <div style={{ position: "relative" ,width:"100%"}}>
                  <input
                    type="text"
                    name={`${q.id}_answer`}
                    value={inputs[`${q.id}_answer`] || ""}
                    onChange={handleChange}
                    className="answer-input3-review10-p1-q3"
                  />
                  {wrong[`${q.id}_answer`] && (
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

export default Review10_Page1_Q3;
