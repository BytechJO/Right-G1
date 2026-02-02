import React, { useState } from "react";
import "./WB_Unit8_Page4_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U8/U8P48EXEH01-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P48EXEH01-02.svg";
import img3 from "../../../assets/U1 WB/U8/U8P48EXEH02-01.svg";
import img4 from "../../../assets/U1 WB/U8/U8P48EXEH02-02.svg";
import img5 from "../../../assets/U1 WB/U8/U8P48EXEH03-01.svg";
import img6 from "../../../assets/U1 WB/U8/U8P48EXEH03-02.svg";
import img7 from "../../../assets/U1 WB/U8/U8P48EXEH04-01.svg";
import img8 from "../../../assets/U1 WB/U8/U8P48EXEH04-02.svg";
const data = [
  {
    id: 1,
    text: "Touch your nose.",
    images: [
      { id: 1, src: img1, value: "nose" },
      { id: 2, src: img2, value: "eye" },
    ],
    correct: ["nose"],
  },
  {
    id: 2,
    text: "Touch your eye.",
    images: [
      { id: 1, src: img3, value: "nose" },
      { id: 2, src: img4, value: "eye" },
    ],
    correct: ["eye"],
  },
  {
    id: 3,
    text: "Touch your leg.",
    images: [
      { id: 1, src: img5, value: "arm" },
      { id: 2, src: img6, value: "leg" },
    ],
    correct: ["leg"],
  },
  {
    id: 4,
    text: "Touch your arm.",
    images: [
      { id: 1, src: img7, value: "arm" },
      { id: 2, src: img8, value: "feet" },
    ],
    correct: ["arm"],
  },
];

export default function WB_Unit8_Page4_Q2() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSelect = (qId, value) => {
    if (showAnswer ||submitted) return; // 🔥 يمنع الضغط بعد إظهار الحل
    setAnswers((prev) => {
      const current = prev[qId] || [];

      // 1️⃣ إذا كانت الصورة مختارة → نشيلها (Toggle)
      if (current.includes(value)) {
        return { ...prev, [qId]: current.filter((v) => v !== value) };
      }

      // 2️⃣ إذا حاول يختار أكثر من 2 → نمنعه
      if (current.length >= 1) {
        return prev;
      }

      // 3️⃣ إضافة اختيار جديد
      return { ...prev, [qId]: [...current, value] };
    });
  };

  const handleCheck = () => {
    if (showAnswer||submitted) return; // 🔥 يمنع الضغط بعد إظهار الحل
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
  const handleShowAnswer = () => {
    const correctAnswersObj = {};

    data.forEach((q) => {
      correctAnswersObj[q.id] = [...q.correct]; // نضع كل الإجابات الصحيحة
    });

    setAnswers(correctAnswersObj);
    setShowAnswer(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setShowAnswer(false); // 🔥 إلغاء وضع Show Answer
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
      <div   className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="circle-wrapper-Unit5_Page5_Q2" style={{margin:"0px"}}>
          <h5 className="header-title-page8">
            <span className="ex-A">H</span> Look, read, and circle.
          </h5>
          <div className="content-container-wb-unit8-p4-q1">
            {data.map((q) => (
              <div key={q.id} className="question-row-wb-unit8-p4-q2">
                <div className="img-container-wb-unit8-p4-q2">
                  <span
                    className="q-number"
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {q.id}.
                  </span>
                  <p>{q.text}</p>
                </div>
                <div className="images-row-Unit5_Page5_Q2">
                  {q.images.map((img) => {
                    const isSelected = answers[q.id]?.includes(img.value);
                    const isWrong =
                      submitted && isSelected && !q.correct.includes(img.value);

                    return (
                      <div
                        key={img.id}
                        className={`img-box-Unit5_Page5_Q2 
                    ${isSelected ? "selected-Unit5_Page5_Q2" : ""} 
                
                    ${isWrong ? "wrong" : ""}`}
                        onClick={() => handleSelect(q.id, img.value)}
                      >
                        <img src={img.src} alt="" />
                        {/* علامة X تظهر فقط عند الغلط */}
                        {!showAnswer && isWrong && (
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
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>
        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
