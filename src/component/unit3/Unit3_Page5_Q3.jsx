import "./Unit3_Page5_Q3.css";
import React, { useState } from "react";
import ValidationAlert from "../Popup/ValidationAlert";
import img1 from "../../assets/unit3/imgs3/P26exeB-01.svg";
import img2 from "../../assets/unit3/imgs3/P26exeB-02.svg";
import img3 from "../../assets/unit3/imgs3/P26exeB-03.svg";
import img4 from "../../assets/unit3/imgs3/P26exeB-04.svg";
const Unit3_Page5_Q3 = () => {
  // الإجابات المدخلة من الطالب
  const [answers, setAnswers] = useState(["5", "", "", ""]);

  // النتيجة لكل خانة (صح/غلط)
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // الإجابات الصحيحة
  const correctData = ["5", "3", "2", "8"];

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
    setAnswers(["5", "", "", ""]);
    setShowResult([]);
    setShowAnswer(false)
  };

  return (
    <div
      className="unit3-q3-wrapper"
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
        <h5 className="header-title-page8">
          <span className="ex-A">B</span> Count and write.
        </h5>

        {/* الصور */}
        <div className="unit3-q3-grid">
          {options.map((item, index) => (
            <div key={index} className="unit3-q3-box">
              <img src={item.img} className="unit3-q3-image" alt="" />

              {/* إدخال الإجابة */}
              <div className="unit3-q3-input-wrapper">
                <input
                  type="text"
                  maxLength="1"
                  value={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className={`unit3-q3-input ${
                    index === 0 ? "first-input" : ""
                  }`}
                  readOnly={index === 0 || showAnswer} // ← new 👈 منع التعديل بعد Show Answer
                />

                {/* إشارة X */}
                {showResult[index] === "wrong" && (
                  <div className="unit3-q3-wrong">X</div>
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

export default Unit3_Page5_Q3;
