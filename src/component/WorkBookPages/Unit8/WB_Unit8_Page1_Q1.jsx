import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U8/U8P45EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P45EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U8/U8P45EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U8/U8P45EXEA-04.svg";
import "./WB_Unit8_Page1_Q1.css"
const WB_Unit8_Page1_Q1 = () => {
  // الإجابات المدخلة من الطالب
  const [answers, setAnswers] = useState(["", "", "", ""]);

  // النتيجة لكل خانة (صح/غلط)
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // الإجابات الصحيحة
  const correctData = ["1", "3", "2", "4"];

  // البيانات
  const options = [{ img: img1 }, { img: img2 }, { img: img3 }, { img: img4 }];

  // تحديث خانة الإدخال
  const handleChange = (index, value) => {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
    setShowResult([]);
    setShowAnswer(false);
  };
  const handleShowAnswer = () => {
    setShowAnswer(true); // تفعيل وضع إظهار الإجابات
    setShowResult([]); // إخفاء إكسات
    setAnswers(correctData); // تعبئة كل الخانات بالإجابات الصحيحة
  };

  const checkAnswers = () => {
    if (showAnswer) return;
    // ❗ الخطوة 1: فحص الخانات الفارغة
    if (answers.includes("")) {
      ValidationAlert.info("Please fill all answer boxes before checking!");
      return; // وقف التشييك
    }

    // ❗ الخطوة 2: مقارنة كل خانة
    const results = answers.map((value, index) => {
      return value === correctData[index] ? "correct" : "wrong";
    });

    setShowResult(results);

    // ❗ الخطوة 3: حساب السكور
    const correctCount = results.filter((r) => r === "correct").length;
    const total = correctData.length;
    const scoreMsg = `${correctCount} / ${total}`;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${scoreMsg}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(resultHTML);
    else if (correctCount === 0) ValidationAlert.error(resultHTML);
    else ValidationAlert.warning(resultHTML);
  };
  // زر الريست
  const resetAnswers = () => {
    setAnswers(["", "", "", ""]);
    setShowResult([]);
    setShowAnswer(false);
  };

  return (
    <div
      className="unit3-q3-wrapper"
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
          gap: "15px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">A</span>Read and number.
        </h5>
        <div className="word-container-wb-unit8-p1-q1">
          {[
            "Close my eyes.",
            "Raise your hand.",
            "Open your mouth.",
            "Touch your nose.",
          ].map((item, index) => {
            return (
              <div className="sentence-container-wb-unit7-p5-q1">
                <span className="number-wb-unit7-p5-q1">{index + 1}</span>{" "}
                <p className="sentence-wb-unit8-p1-q1">{item}</p>
              </div>
            );
          })}
        </div>
        {/* الصور */}
        <div className="wb-unit8-p1-q1-grid ">
          {options.map((item, index) => (
            <div key={index} className="wb-unit7-p5-q1-box">
              <img src={item.img} className="unit3-q3-image" alt="" />

              {/* إدخال الإجابة */}
              <div className="wb-unit7-p5-q1-input-wrapper">
                <input
                  type="text"
                  maxLength="1"
                  value={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className={`wb-unit7-p5-q1-input `}
                  readOnly={showAnswer} // ← new 👈 منع التعديل بعد Show Answer
                />

                {/* إشارة X */}
                {showResult[index] === "wrong" && (
                  <div className="unit3-q3-wrong">✕</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={handleShowAnswer} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit8_Page1_Q1;
