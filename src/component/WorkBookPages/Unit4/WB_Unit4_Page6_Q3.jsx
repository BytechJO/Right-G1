import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
// import "./Review10_Page2_Q3.css";
import img1 from "../../../assets/unit4/imgs/U4P37EEXEE-01-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P37EEXEE-01-02.svg";
import img3 from "../../../assets/unit4/imgs/U4P37EEXEE-02-01.svg";
import img4 from "../../../assets/unit4/imgs/U4P37EEXEE-02-02.svg";

const data = [
  {
    parts: [
      {
        before: "A",
        middleImg: img1,
        blank: 1,
        after: "is driving a",
      },
      {
        before: "",
        middleImg: img2,
        blank: 2,
        after: ".",
      },
    ],
    correct: ["fish", "van"],
  },
  {
    parts: [
      {
        before: "A",
        middleImg: img3,
        blank: 1,
        after: "wearing",
      },
      {
        before: "a ",
        middleImg: img4,
        blank: 2,
        after: "is running on his",
      },
      {
        before: "bare",
        middleImg: img4,
        blank: 3,
        after: "after the van with",
      },
      {
        before: "a",
        middleImg: img4,
        blank: 4,
        after: "in his hand.",
      },
    ],
    correct: ["vet", "vest", "feet", "fork"],
  },
];

const WB_Unit4_Page6_Q3 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill(""))
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

  const handleChange = (value, qIndex, blankIndex) => {
    if (locked) return; // ⭐ NEW — لا تعديل بعد Show Answer

    const newAnswers = [...answers];
    newAnswers[qIndex][blankIndex] = value;
    setAnswers(newAnswers);
    setWrongInputs([]);
  };
  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — لا تعديل بعد Show Answer
    // 1) افحص إذا في أي خانة فاضية
    const hasEmpty = answers.some((arr) =>
      arr.some((val) => val.trim() === "")
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    // 2) اجمع كل الأخطاء
    let wrong = [];
    let correctCount = 0;

    answers.forEach((arr, qIndex) => {
      arr.forEach((val, blankIndex) => {
        if (val.trim() === data[qIndex].correct[blankIndex]) {
          correctCount++; // صح
        } else {
          wrong.push(`${qIndex}-${blankIndex}`); // غلط
        }
      });
    });

    setWrongInputs(wrong);

    // 3) احسب العدد الكلي للحقول
    const totalInputs = data.reduce(
      (acc, item) => acc + item.correct.length,
      0
    );

    // 4) اختر اللون حسب السكور
    let color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
        ? "red"
        : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${totalInputs}
      </span>
    </div>
  `;
    setLocked(true); // ⭐ NEW — قفل التعديل بعد Check
    // 5) طباعة النتيجة
    if (correctCount === totalInputs) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    const correctFilled = data.map((d) => [...d.correct]);

    setAnswers(correctFilled); // ضع الإجابات الصحيحة
    setWrongInputs([]); // إزالة الأخطاء
    setLocked(true); // قفل الحقول
  };

  return (
    <div className="page8-wrapper">
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "relative",
          width: "60%",
        }}
      >
        <h3 className="header-title-page8">
       <span className="ex-A">C</span> Look and write. Then say.
        </h3>

        {data.map((item, qIndex) => (
          <div className="row-missing" key={qIndex}>
            <span className="num">{qIndex + 1}.</span>

            <div className="sentence-review10-p2-q3">
              {item.parts.map((p, blankIndex) => (
                <span
                  key={blankIndex}
                  className="sentence-part"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {p.before}

                  <div className="input-wrapper">
                    <input
                      className="missing-input-review10-p2-q3"
                      value={answers[qIndex][blankIndex]}
                      onChange={(e) =>
                        handleChange(e.target.value, qIndex, blankIndex)
                      }
                      readOnly={locked} // ⭐ NEW — منع التعديل بعد Show Answer
                    />
                    {wrongInputs.includes(`${qIndex}-${blankIndex}`) && (
                      <span className="wrong-icon-review4-p2-q1">✕</span>
                    )}
                  </div>

                  {p.after}
                  <img src={p.middleImg} className="middle-img" alt="" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setAnswers(data.map((d) => Array(d.correct.length).fill("")));
            setWrongInputs([]);
            setLocked(false); // ⭐ NEW — فتح التعديل من جديد
          }}
        >
          Start Again ↻
        </button>

        {/* ⭐⭐⭐ NEW BUTTON */}
        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answers ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit4_Page6_Q3;
