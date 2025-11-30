import React, { useState } from "react";
import "./Review5_Page2_Q3.css";
import ValidationAlert from "../Popup/ValidationAlert";
import img1 from "../../assets/unit6/imgs/U6P53EXEF-01.svg";
import img2 from "../../assets/unit6/imgs/U6P53EXEF-02.svg";
const Review5_Page2_Q3 = () => {
  // ===============================
  // 🔵 1) الأسئلة (كلها داخل نفس الكومبونينت)
  // ===============================
  const questions = [
    {
      id: 1,
      parts: [
        { type: "text", value: "The" },
        { type: "blank", options: ["girl", "key"] },
        { type: "text", value: "is in the" },
        { type: "blank", options: ["kitchen", "garden"] },
        { type: "text", value: "." },
      ],
      correct: ["girl", "garden"],
      image: img1,
    },

    {
      id: 2,
      parts: [
        { type: "text", value: "The" },
        { type: "blank", options: ["key", "kite"] },
        { type: "text", value: "is" },
        { type: "blank", options: ["girl", "green"] },
        { type: "text", value: "." },
      ],
      correct: ["kite", "green"],
      image: img2,
    },
  ];

  // ===============================
  // 🔵 2) حفظ اختيارات الطالب
  // ===============================
  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "blank" ? null : null)))
  );
  const [showResult, setShowResult] = useState(false);
  // ===============================
  // 🔵 3) الضغط على خيار
  // ===============================
  const handleSelect = (qIndex, blankIndex, option) => {
    const updated = [...answers];
    updated[qIndex][blankIndex] = option;
    setAnswers(updated);
    setShowResult(false);
  };

  // ===============================
  // 🔵 4) فحص الإجابات
  // ===============================
  const checkAnswers = () => {
    // تحقق إذا الطالب ما اختار ولا شيء
    const selectedCount = answers.flat().filter((a) => a !== null).length;
    if (selectedCount === 0) {
      ValidationAlert.info("");
      return;
    }

    let correct = 0;
    let total = 0;

    questions.forEach((q, qIndex) => {
      q.correct.forEach((correctAns, blankIndex) => {
        total++;
        if (answers[qIndex][blankIndex] === correctAns) {
          correct++;
        }
      });
    });

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correct} / ${total}
      </span>
    </div>
  `;

    if (correct === total) ValidationAlert.success(scoreMessage);
    else if (correct === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setShowResult(true);
  };

  // ===============================
  // 🔵 JSX
  // ===============================
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
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h3 className="header-title-page8">F Look, read, and circle.</h3>
        <div>
          {questions.map((q, qIndex) => (
            <div className="question-row-review5-p2-q3" key={q.id}>
              <div className="sentence-review5-p2-q3">
                <span
                  className="header-title-page8"
                  style={{
                    color: "#2c5287",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  {q.id}
                </span>
                {q.parts.map((part, pIndex) => {
                  if (part.type === "text") {
                    return (
                      <span
                        key={pIndex}
                        className="sentence-text-review5-p2-q3"
                      >
                        {part.value}
                      </span>
                    );
                  }

                  if (part.type === "blank") {
                    // blank index == ترتيب هذا الفراغ بين باقي الفراغات
                    const actualBlankIndex = q.parts
                      .filter((p) => p.type === "blank")
                      .indexOf(part);

                    return (
                      <span
                        key={pIndex}
                        className="blank-options-review5-p2-q3"
                      >
                        {part.options.map((opt, optIndex) => {
                          const isSelected =
                            answers[qIndex][actualBlankIndex] === opt;
                          const isWrongSelected =
                            showResult &&
                            isSelected &&
                            opt !== q.correct[actualBlankIndex];

                          return (
                            <div key={optIndex} className="option-wrapper">
                              <span
                                className={`option-word-review5-p2-q3 ${
                                  isSelected ? "selected2" : ""
                                }`}
                                onClick={() =>
                                  handleSelect(qIndex, actualBlankIndex, opt)
                                }
                              >
                                {opt}
                              </span>

                              {isWrongSelected && (
                                <div className="wrong-mark">✕</div>
                              )}
                            </div>
                          );
                        })}
                      </span>
                    );
                  }
                })}
              </div>

              <img src={q.image} className="question-img-review5-p2-q3" />
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setAnswers(
              questions.map((q) =>
                q.parts.map((p) => (p.type === "blank" ? null : null))
              )
            );
            setShowResult(false);
          }}
        >
          Start Again ↻
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review5_Page2_Q3;
