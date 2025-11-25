import React, { useState } from "react";
import "./Unit6_Page5_Q2.css";
import ValidationAlert from "../Popup/ValidationAlert";
const data = [
  {
    id: 1,
    images: [
      { id: 1, src: "/img/kite.png", value: "kite" },
      { id: 2, src: "/img/girl.png", value: "girl" },
      { id: 3, src: "/img/key.png", value: "key" },
    ],
    correct: ["kite", "key"],
  },
  {
    id: 2,
    images: [
      { id: 1, src: "/img/grass.png", value: "grass" },
      { id: 2, src: "/img/kitchen.png", value: "kitchen" },
      { id: 3, src: "/img/garden.png", value: "garden" },
    ],
    correct: ["grass", "garden"],
  },
];

export default function Unit6_Page5_Q2() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId, value) => {
    setAnswers((prev) => {
      const current = prev[qId] || [];

      // 1️⃣ إذا كانت الصورة مختارة → نشيلها (Toggle)
      if (current.includes(value)) {
        return { ...prev, [qId]: current.filter((v) => v !== value) };
      }

      // 2️⃣ إذا حاول يختار أكثر من 2 → نمنعه
      if (current.length >= 2) {
        return prev;
      }

      // 3️⃣ إضافة اختيار جديد
      return { ...prev, [qId]: [...current, value] };
    });
  };

  const handleCheck = () => {
    // فحص إذا الطالب مختار على الأقل إجابة من السؤال الأول
    if (!answers[data[0].id] || answers[data[0].id].length === 0) {
      ValidationAlert.info("Please select at least one picture in question 1.");
      return;
    }

    // فحص إذا الطالب مختار على الأقل إجابة من السؤال الثاني
    if (!answers[data[1].id] || answers[data[1].id].length === 0) {
      ValidationAlert.info("Please select at least one picture in question 2.");
      return;
    }

    let correctCount = 0;

    // نحسب total = مجموع كل الإجابات الصحيحة
    const total = data.reduce((sum, q) => sum + q.correct.length, 0);

    // حساب عدد الصح
    data.forEach((q) => {
      const studentAnswers = answers[q.id] || [];

      q.correct.forEach((correctValue) => {
        if (studentAnswers.includes(correctValue)) {
          correctCount++;
        }
      });
    });

    // اختيار اللون حسب النتيجة
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    // إظهار نوع النتيجة
    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
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
        <div className="circle-wrapper-Unit5_Page5_Q2">
          <h5 className="header-title-page8">
            <span style={{ color: "purple" }}>2</span> Which pictures begin with
            the same sound? Circle.
          </h5>

          {data.map((q) => (
            <div key={q.id} className="question-row-Unit5_Page5_Q2">
              <span className="q-number">{q.id}.</span>

              <div className="images-row-Unit5_Page5_Q2">
                {q.images.map((img) => {
                  const isSelected = answers[q.id]?.includes(img.value);
                  const isWrong =
                    submitted && isSelected && !q.correct.includes(img.value);

                  return (
                    <div
                      key={img.id}
                      className={`img-box-Unit5_Page5_Q2 
                    ${isSelected ? "selected" : ""} 
                
                    ${isWrong ? "wrong" : ""}`}
                      onClick={() => handleSelect(q.id, img.value)}
                    >
                      <img src={img.src} alt="" />
                      {/* علامة X تظهر فقط عند الغلط */}
                      {isWrong && (
                        <div className="wrong-mark-Unit5_Page5_Q2 ">✕</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>
        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
