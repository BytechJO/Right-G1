import React, { useState, useRef, useEffect } from "react";
import CD13_Pg14_Instruction1_AdultLady from "../../../assets/img_unit2/sounds-unit2/CD13.Pg14_Instruction1_Adult Lady.mp3";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review4_Page2_Q3.css";
import img1 from "../../../assets/unit4/imgs/U4P37EXEG-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P37EXEG-02.svg";
import img3 from "../../../assets/unit4/imgs/U4P37EXEG-03.svg";
import img4 from "../../../assets/unit4/imgs/U4P37EXEG-04.svg";
const Review4_Page2_Q3 = () => {
  const [answers, setAnswers] = useState(Array(4).fill(null));
  const [showResult, setShowResult] = useState(false);
  // ⭐ NEW — لمنع الطالب من التعديل بعد Show Answer
  const [locked, setLocked] = useState(false);
  // 🔥 الداتا المطابقة للصورة
  const items = [
    {
      img: img1,
      options: ["vest", "van"],
      correctIndex: 0,
    },
    {
      img: img2,
      options: ["feet", "fork"],
      correctIndex: 1,
    },
    {
      img: img3,
      options: ["fish", "van"],
      correctIndex: 1,
    },
    {
      img: img4,
      options: ["vet", "vest"],
      correctIndex: 0,
    },
  ];

  const handleSelect = (qIndex, optionIndex) => {
    if (locked) return; // ⭐ NEW — يمنع التعديل بعد Show Answer
    const newAns = [...answers];
    newAns[qIndex] = optionIndex;
    setAnswers(newAns);
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — يمنع التعديل بعد Show Answer
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
    setLocked(true); // ⭐ NEW — قفل التعديل بعد Check Answer
  };

  const reset = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
    setLocked(false); // ⭐ NEW — فتح التعديل من جديد
  };

  // ⭐⭐⭐ NEW — showAnswer function
  const showAnswer = () => {
    const correct = items.map((q) => q.correctIndex);

    setAnswers(correct); // ضع الإجابات الصحيحة
    setShowResult(true); // فعّل حالة ظهور ✓ و X
    setLocked(true); // امنع التعديل بعد Show Answer
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",padding:"30px"
      }}
    >
      <div className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8">G Look, read, and circle.</h5>
        </div>
        <div className="container-review3-p2-q3">
          {items.map((q, i) => (
            <div
              key={i}
              className="question-box-review3-p2-q3"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "13px",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  width:"100%",
                  justifyContent:"center"
                }}
              >
                <span
                  style={{
                    fontSize: "25px",
                    color: "darkblue",
                    fontWeight: "600",
                  }}
                >
                  {i + 1}
                </span>
                <div className="img-div-review3-p2-q3">
                  <img
                    src={q.img}
                    className="q3-image-review4-p2-q3"
              
                  />
                </div>
              </div>
              <div className="options-row-review3-p2-q3">
                {q.options.map((word, optIndex) => {
                  const isSelected = answers[i] === optIndex;
                  const isCorrect = optIndex === q.correctIndex;

                  return (
                    <p
                      key={optIndex}
                      className={`
                    option-word-review3-p2-q3
                    ${isSelected ? "selected" : ""}
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
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
        <button className="show-answer-btn swal-continue" onClick={showAnswer}>
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review4_Page2_Q3;
