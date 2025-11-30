import React, { useState, useRef, useEffect } from "react";
import CD13_Pg14_Instruction1_AdultLady from "../../assets/img_unit2/sounds-unit2/CD13.Pg14_Instruction1_Adult Lady.mp3";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit8_Page5_Q3.css";
import img1 from "../../assets/unit6/imgs/U6P54EXEA-01.svg";
import img2 from "../../assets/unit6/imgs/U6P54EXEA-02.svg";
import img3 from "../../assets/unit6/imgs/U6P54EXEA-03.svg";
import img4 from "../../assets/unit6/imgs/U6P54EXEA-04.svg";
const Unit8_Page5_Q3 = () => {
  const [answers, setAnswers] = useState(Array(4).fill(null));
  const [showResult, setShowResult] = useState(false);

  // 🔥 الداتا المطابقة للصورة
  const items = [
    {
      img: img1,
      text: "Touch your",
      options: ["arm", "hand"],
      correctIndex: 0,
    },
    {
      img: img2,
      text: "Raise your",
      options: ["hand.", "leg."],
      correctIndex: 1,
    },
    {
      img: img3,
      text: "Bend your",
      options: ["knee.", "eye."],
      correctIndex: 0,
    },
    {
      img: img4,
      text: "Open your",
      options: ["nose.", "mouth."],
      correctIndex: 1,
    },
  ];

  const handleSelect = (qIndex, optionIndex) => {
    const newAns = [...answers];
    newAns[qIndex] = optionIndex;
    setAnswers(newAns);
    setShowResult(false);
  };

  const checkAnswers = () => {
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
  };

  const reset = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8"><span className="letter-of-Q"> B</span> Read, look, and circle.</h5>
        </div>
        <div className="container-review6-p1-q1">
          {items.map((q, i) => (
            <div
              key={i}
              className="question-box-unit8-p5-q3"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "80%",
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

              <div style={{ display: "flex", gap: "10px" ,flexDirection:"column"}}>
                
                  <img
                    src={q.img}
                    className="q3-image-review6-p1-q1"
                    style={{ height: "130px", width: "auto" }}
                  />
                

                <div className="options-row-unit8-p5-q3">
                  {q.options.map((word, optIndex) => {
                    const isSelected = answers[i] === optIndex;
                    const isCorrect = optIndex === q.correctIndex;

                    return (
                      <p
                        key={optIndex}
                        className={`
                    option-word-review6-p1-q1
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
                        {showResult && isSelected && !isCorrect && (
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

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit8_Page5_Q3;
