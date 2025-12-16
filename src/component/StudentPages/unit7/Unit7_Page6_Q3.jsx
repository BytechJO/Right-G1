import React, { useState } from "react";
import conversation from "../../../assets/unit7/img/U7P63EXEF-01.svg";
import conversation2 from "../../../assets/unit7/img/U7P63EXEF-02.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page6_Q3.css";
const Unit7_Page6_Q3 = () => {
  const questions = [
    {
      id: 1,
      img: conversation,
      question: "Are you cold?",
      type: "full",
      correct: "Yes, I am.",
    },
    {
      id: 2,
      img: conversation2,
      question: "Are you scared?",
      type: "word",
      prefix: "No, I'm not. I'm",
      correct: "hungry",
    },
  ];
  const correctAnswers = {
    q1: "Yes, I am.",
    q2: "hungry",
  };

  const [inputs, setInputs] = useState(Array(2).fill(""));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
  });
  const [showAnswer, setShowAnswer] = useState(false);
  // const [wrong, setWrong] = useState([]);

 const handleCheck = () => {
  if (showAnswer) return;

  const userValues = Object.values(answers);
  const correctValues = Object.values(correctAnswers);

  // 1️⃣ فحص الحقول الفارغة
  if (userValues.some((value) => value.trim() === "")) {
    ValidationAlert.info("Please complete all answers.");
    return;
  }

  // 2️⃣ مقارنة الإجابات
  const results = userValues.map((value, index) => {
    return (
      value.trim().toLowerCase() ===
      correctValues[index].toLowerCase()
    );
  });

const wrong = results
  .map((r, i) => (r ? null : questions[i].id))
  .filter((v) => v !== null);

setWrongInputs(wrong);

  const correctCount = results.filter(Boolean).length;
  const wrongCount = results.length - correctCount;

  const color =
    correctCount === results.length
      ? "green"
      : correctCount === 0
      ? "red"
      : "orange";

  const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold">
        Score: ${correctCount}/${results.length}
      </span>
    </div>
  `;

  if (correctCount === results.length) {
    ValidationAlert.success(scoreMessage);
  } else if (wrongCount === results.length) {
    ValidationAlert.error(scoreMessage);
  } else {
    ValidationAlert.warning(scoreMessage);
  }
};


  const handleShowAnswer = () => {
    setAnswers({
      q1: correctAnswers.q1,
      q2: correctAnswers.q2,
    });

    setShowAnswer(true); // 🔒 يقفل الكتابة
    setWrongInputs([]); // يشيل الإكسات
  };

  const handleReset = () => {
    setInputs(Array(2).fill(""));
    setWrongInputs([]);
    setAnswers({
      q1: "",
      q2: "",
    });
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
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "relative",
          width: "60%",
        }}
      >
        <h5 className="header-title-page8" id="ex-d">
          <span className="ex-A">F</span> Look, read, and write.
        </h5>

        {/* ✅ الصورة هي المرجع */}
        <div>
          {questions.map((q, index) => (
            <div key={q.id} className="question-row-unit7-p2-q3">
              <div className="question-container-unit7-p6-q3">
                <span className="num2">{index + 1}</span>

                <img src={q.img} className="avatar-img" />
                <p className="question-text-unit7-p2-q3">{q.question}</p>
              </div>
              <div className="sentence-box-unit7-p2-q3">
                {q.type === "full" && (
                  <input
                    type="text"
                    value={answers.q1}
                    disabled={showAnswer}
                    onChange={(e) =>
                      setAnswers({ ...answers, q1: e.target.value })
                    }
                    className="answer-input-unit7-p2-q3"
                  />
                )}

                {q.type === "word" && (
                  <p className="answer-line-unit7-p2-q3">
                    {q.prefix}
                    <input
                      type="text"
                      value={answers.q2}
                      disabled={showAnswer}
                      onChange={(e) =>
                        setAnswers({ ...answers, q2: e.target.value })
                      }
                      className="answer-input-unit7-p2-q3 small"
                    />
                    .
                   
                  </p>
                )}

                {wrongInputs.includes(q.id) && <span className="wrong-mark">✕</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Buttons */}
      <div className="action-buttons-container">
        <button onClick={handleReset} className="try-again-button">
          Start Again ↻
        </button>
        <button
          className="show-answer-btn swal-continue"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>
        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit7_Page6_Q3;
