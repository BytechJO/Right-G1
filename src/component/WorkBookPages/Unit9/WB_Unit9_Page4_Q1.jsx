import React, { useState } from "react";
import "./WB_Unit9_Page4_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U9/U9P54EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U9/U9P54EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U9/U9P54EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U9/U9P54EXEH-04.svg";
const WB_Unit9_Page4_Q1 = () => {
  // ===============================
  // 🔵 1) الأسئلة (كلها داخل نفس الكومبونينت)
  // ===============================
  const questions = [
    {
      id: 1,
      parts: [
        { type: "text", value: "He likes" },
        { type: "blank", options: ["goats", "cows"] },
        { type: "text", value: "." },
      ],
      correct: ["cows"],
      image: img1,
    },

    {
      id: 2,
      parts: [
        { type: "text", value: "She likes" },
        { type: "blank", options: ["chickens", "horses"] },
        { type: "text", value: "." },
      ],
      correct: ["chickens"],
      image: img2,
    },
    {
      id: 3,
      parts: [
        { type: "text", value: "He likes" },
        { type: "blank", options: ["dogs", "cats"] },
        { type: "text", value: "." },
      ],
      correct: ["cats"],
      image: img3,
    },
    {
      id: 4,
      parts: [
        { type: "text", value: "He likes" },
        { type: "blank", options: ["horses", "goats"] },
        { type: "text", value: "." },
      ],
      correct: ["horses"],
      image: img4,
    },
  ];

  // ===============================
  // 🔵 2) حفظ اختيارات الطالب
  // ===============================
  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "blank" ? null : null)))
  );
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  // ===============================
  // 🔵 3) الضغط على خيار
  // ===============================
  const handleSelect = (qIndex, blankIndex, option) => {
    if (locked ||showResult) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    const updated = [...answers];
    updated[qIndex][blankIndex] = option;
    setAnswers(updated);
    setShowResult(false);
  };

  // ===============================
  // 🔵 4) فحص الإجابات
  // ===============================
  const checkAnswers = () => {
    if (locked ||showResult) return; // ❌ لا يسمح بالتعديل بعد Show Answer
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
  const showAnswers = () => {
    // اجابة كل سؤال = correct array
    const correctFilled = questions.map((q) => [...q.correct]);

    setAnswers(correctFilled);
    setShowResult(true);
    setLocked(true); // 🔒 قفل الإجابات
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
        padding: "30px",
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
        <h3 className="header-title-page8">
          <span className="ex-A">H</span>Look, read, and circle.
        </h3>
        <div
          className="content-container-wb-unit9-p4-q1 "
   
        >
          {questions.map((q, qIndex) => (
            <div className="question-row-wb-unit9-p4-q1" key={q.id}>
              <div className="sentence-wb-unit9-p4-q1">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    // gap: "30px",
                  }}
                >
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
                  <img
                    src={q.image}
                    className="question-img-review5-p2-q3"
                    style={{ width: "150px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
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
                          className="blank-options-wb-unit9-p4-q1"
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

                                {isWrongSelected && !locked && (
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
              </div>
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
            setLocked(false);
          }}
        >
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit9_Page4_Q1;
