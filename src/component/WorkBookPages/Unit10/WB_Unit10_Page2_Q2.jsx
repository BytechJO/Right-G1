import React, { useState } from "react";
import "./WB_Unit10_Page2_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import mainImg from "../../../assets/U1 WB/U10/U10P58EXED.svg";
import img1 from "../../../assets/U1 WB/U10/U10P58EXED01-01.svg";
import img2 from "../../../assets/U1 WB/U10/U10P58EXED01-02.svg";
import img3 from "../../../assets/U1 WB/U10/U10P58EXED01-03.svg";
import img4 from "../../../assets/U1 WB/U10/U10P58EXED01-04.svg";
import img5 from "../../../assets/U1 WB/U10/U10P58EXED02-01.svg";
import img6 from "../../../assets/U1 WB/U10/U10P58EXED02-02.svg";
import img7 from "../../../assets/U1 WB/U10/U10P58EXED02-03.svg";
import img8 from "../../../assets/U1 WB/U10/U10P58EXED02-04.svg";
import img9 from "../../../assets/U1 WB/U10/U10P58EXED03-01.svg";
import img10 from "../../../assets/U1 WB/U10/U10P58EXED03-02.svg";
import img11 from "../../../assets/U1 WB/U10/U10P58EXED03-03.svg";
import img12 from "../../../assets/U1 WB/U10/U10P58EXED03-04.svg";
import img13 from "../../../assets/U1 WB/U10/U10P58EXED04-01.svg";
import img14 from "../../../assets/U1 WB/U10/U10P58EXED04-02.svg";
import img15 from "../../../assets/U1 WB/U10/U10P58EXED04-03.svg";
import img16 from "../../../assets/U1 WB/U10/U10P58EXED04-04.svg";
const data = [
  {
    id: 1,
    mainImg: img1,
    images: [
      { id: 1, src: img2, value: "kite" },
      { id: 2, src: img3, value: "girl" },
      { id: 3, src: img4, value: "key" },
    ],
    correct: ["girl"],
  },
  {
    id: 2,
    mainImg: img5,
    images: [
      { id: 1, src: img6, value: "grass" },
      { id: 2, src: img7, value: "kitchen" },
      { id: 3, src: img8, value: "fruit" },
    ],
    correct: ["fruit"],
  },
  {
    id: 3,
    mainImg: img9,
    images: [
      { id: 1, src: img10, value: "kitchen" },
      { id: 2, src: img11, value: "grass" },
      { id: 3, src: img12, value: "garden" },
    ],
    correct: ["kitchen"],
  },
  {
    id: 4,
    mainImg: img13,
    images: [
      { id: 1, src: img14, value: "grass" },
      { id: 2, src: img15, value: "kitchen" },
      { id: 3, src: img16, value: "milk" },
    ],
    correct: ["milk"],
  },
];

export default function WB_Unit10_Page2_Q2() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSelect = (qId, value) => {
    if (showAnswer || submitted) return;

    setAnswers((prev) => {
      const current = prev[qId]?.[0];

      if (current === value) {
        return { ...prev, [qId]: [] }; // إلغاء الاختيار
      }

      return { ...prev, [qId]: [value] }; // استبدال
    });
  };

  const handleCheck = () => {
    if (showAnswer) return; // 🔥 يمنع الضغط بعد إظهار الحل
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
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          // gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">D</span> Read, look, and circle.
        </h5>
        <div className="img-options-container-wb-unit10-p2-q2">
          <div className="img-container-wb-unit10-p2-q2">
            <img src={mainImg} style={{ height: "160px", width: "auto" }} />
          </div>
          <div>
            {data.map((q) => (
              <div key={q.id} className="question-row-wb-unit10-p2-q2">
                <div style={{ display: "flex" }}>
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
                  <img
                    src={q.mainImg}
                    style={{ height: "95px", width: "auto" }}
                  />
                </div>
                <div className="images-row-Unit5_Page5_Q2">
                  {q.images.map((img) => {
                    const isSelected = answers[q.id]?.includes(img.value);

                    const isWrong =
                      isSelected &&
                      !q.correct.includes(img.value) &&
                      !showAnswer;

                    return (
                      <div
                        key={img.id}
                        style={{ position: "relative" }}
                        className={`img-box-wb-unit10-p2-q2 
                    ${isSelected ? "selected-wb-unit10-p2-q2" : ""} 
                
                    ${isWrong ? "wrong" : ""}`}
                        onClick={() => handleSelect(q.id, img.value)}
                      >
                        <img src={img.src} alt="" />
                        {/* علامة X تظهر فقط عند الغلط */}
                        {isWrong && submitted && (
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
