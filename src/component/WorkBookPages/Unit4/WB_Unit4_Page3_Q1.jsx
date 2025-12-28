import React, { useState, useRef, useEffect } from "react";
import CD13_Pg14_Instruction1_AdultLady from "../../../assets/img_unit2/sounds-unit2/CD13.Pg14_Instruction1_Adult Lady.mp3";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page3_Q1.css";
import img1 from "../../../assets/unit6/imgs/U6P54EXEA-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P54EXEA-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P54EXEA-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P54EXEA-04.svg";
const WB_Unit4_Page3_Q1 = () => {
  const [answers, setAnswers] = useState(Array(4).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  // 🔥 الداتا المطابقة للصورة
  const items = [
    {
      id: 1,
      img: img1,
      text: "Is it a circle?",
      options: ["Yes, it is.", "No, it isn’t."],
      correctIndex: 1,
    },
    {
      id: 2,
      img: img2,
      text: "Is it a triangle?",
      options: ["Yes, it is.", "No, it isn’t."],
      correctIndex: 0,
    },
    {
      id: 3,
      img: img2,
      text: "Is it a triangle?",
      options: ["Yes, it is.", "No, it isn’t."],
      correctIndex: 1,
    },
    {
      id: 4,
      img: img2,
      text: "Is it a square?",
      options: ["Yes, it is.", "No, it isn’t."],
      correctIndex: 0,
    },
  ];

  const handleSelect = (qIndex, optionIndex) => {
    if (locked) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    const newAns = [...answers];
    newAns[qIndex] = optionIndex;
    setAnswers(newAns);
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (locked) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");
      return;
    }

    let correctCount = answers.filter(
      (ans, i) => ans === items[i].correctIndex
    ).length;

    const total = items.length;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setShowResult(true);
    setLocked(true)
  };

  const reset = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
    setLocked(false);
  };
  const showAnswers = () => {
    // كل سؤال → نضع correctIndex بدل null
    const filled = items.map((item) => item.correctIndex);

    setAnswers(filled);
    setShowResult(true);
    setLocked(true); // 🔒 قفل الإجابات
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
      <div  className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8">
            <span className="ex-A">E</span>Look, read, and circle.
          </h5>
        </div>
        <div className="container-review6-p1-q1">
          {items.map((q, i) => (
            <div
              key={i}
              className="question-box-wb-unit2-p4-q1"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "center",
             
                }}
              >
                <span
                  style={{
                    color: "#2c5287",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  {i + 1}
                </span>
                <h6 style={{ fontSize: "20px", fontWeight: "600" }}>
                  {q.text}
                </h6>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
               {(q.id === 1 || q.id === 4) && (
                    <svg
                      width="120"
                      height="120"
                      
                    >
                      <rect
                        x="10"
                        y="10"
                        width="100"
                        height="100"
                       fill="white"
                        stroke="#999"
                        strokeWidth="4"
                      />
                    </svg>
                  )}
                  {q.id === 2 && (
                    <svg
                      width="120"
                      height="120"
                      
                    >
                      <polygon
                        points="60,10 110,110 10,110"
                         fill="white"
                        stroke="#999"
                        strokeWidth="4"
                      />
                    </svg>
                  )}
                  {q.id === 3 && (
                    <svg
                      width="120"
                      height="120"
                     
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                         fill="white"
                        stroke="#999"
                        strokeWidth="4"
                      />
                    </svg>
                  )}
                <div className="options-row-wb-unit4-p3-q1">
                  {q.options.map((word, optIndex) => {
                    const isSelected = answers[i] === optIndex;
                    const isCorrect = optIndex === q.correctIndex;

                    return (
                      <p
                        key={optIndex}
                        className={`
                    option-word-wb-unit2-p4-q1
                    ${isSelected ? "selected3" : ""}
                    ${showResult && isSelected && !isCorrect ? "wrong" : ""}
                    ${showResult && isCorrect ? "correct" : ""}
                  `}
                        onClick={() => handleSelect(i, optIndex)}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        {word}
                        {showResult && isSelected && !isCorrect  && (
                          <span className="wrong-x-review4-p2-q3">✕</span>
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit4_Page3_Q1;
