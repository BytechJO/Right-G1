import "./WB_Unit8_Page5_Q1.css";
import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U8/U8P49EXEI-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P49EXEI-02.svg";
// import img3 from "../../../assets/unit3/imgs3/P26exeB-03.svg";
// import img4 from "../../../assets/unit3/imgs3/P26exeB-04.svg";
const WB_Unit8_Page5_Q1 = () => {
  // الإجابات المدخلة من الطالب
  const [answers, setAnswers] = useState(["", "", "", "", ""]);

  // النتيجة لكل خانة (صح/غلط)
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // الإجابات الصحيحة
  const correctData = ["4", "5", "1", "3", "2"];

  // البيانات
  const options = [{ img: img1 }, { img: img2 }];

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
    setAnswers(["", "", "", "", ""]);
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
          <span className="ex-A">I</span>Look and number.
        </h5>
        {/* الصور */}
        <div className="look-number-wrapper">
          <div className="image-area">
            <img src={img1} alt="boy" style={{height:"300px"}} />

            {/* inputs فوق الصورة */}
            <input
              className="number-input"
              style={{ top: "14%", left: "14%" }}
              value={answers[0]}
              onChange={(e) => handleChange(0, e.target.value)}
              maxLength="1"
              readOnly={showAnswer}
            />

            <input
              className="number-input"
              style={{ top: "16%", left: "78%" }}
              value={answers[1]}
              onChange={(e) => handleChange(1, e.target.value)}
              maxLength="1"
              readOnly={showAnswer}
            />

            <input
              className="number-input"
              style={{ top: "66%", left: "18%" }}
              value={answers[2]}
              onChange={(e) => handleChange(2, e.target.value)}
              maxLength="1"
              readOnly={showAnswer}
            />
          </div>
          <div className="image-area">
            <img src={img2} alt="boy" style={{height:"300px"}}/>

            {/* inputs فوق الصورة */}
            <input
              className="number-input"
              style={{ top: "5%", left: "83%" }}
              value={answers[3]}
              onChange={(e) => handleChange(3, e.target.value)}
              maxLength="1"
              readOnly={showAnswer}
            />

            <input
              className="number-input"
              style={{ top: "39%", left: "83%" }}
              value={answers[4]}
              onChange={(e) => handleChange(4, e.target.value)}
              maxLength="1"
              readOnly={showAnswer}
            />

         
          </div>
        </div>

        <div className="word-container-wb-unit8-p5-q1">
          {[
            "This is my leg.",
            "This is my arm.",
            "This is my head.",
            "This is my eye.",
            "This is my nose.",
          ].map((item, index) => {
            return (
              <div className="sentence-container-wb-unit8-p5-q1">
                <span className="number-wb-unit7-p5-q1">{index + 1}</span>{" "}
                <p className="sentence-wb-unit7-p5-q1">{item}</p>
              </div>
            );
          })}
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

export default WB_Unit8_Page5_Q1;
