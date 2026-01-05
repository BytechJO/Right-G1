import React, { useState } from "react";
import "./WB_Unit3_Page4_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U3/SVG/U3P18EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U3/SVG/U3P18EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U3/SVG/U3P18EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U3/SVG/U3P18EXEH-04.svg";
const WB_Unit3_Page4_Q2 = () => {
  // ===============================
  // 🔵 1) الأسئلة (كلها داخل نفس الكومبونينت)
  // ===============================
  const questions = [
    {
      id: 1,
      parts: [
        { type: "text", value: "" },
        { type: "blank", options: ["Open", "Close"] },
        { type: "text", value: "your book." },
      ],
      correct: ["Close"],
      image: img1,
    },

    {
      id: 2,
      parts: [
        { type: "text", value: "" },
        { type: "blank", options: ["Listen", "Make"] },
        { type: "text", value: "a line." },
      ],
      correct: ["Make"],
      image: img2,
    },
    {
      id: 3,
      parts: [
        { type: "text", value: "" },
        { type: "blank", options: ["Listen!", "Quiet!"] },
        { type: "text", value: "" },
      ],
      correct: ["Listen!"],
      image: img3,
    },
    {
      id: 4,
      parts: [
        { type: "text", value: "" },
        { type: "blank", options: ["Open", "Close"] },
        { type: "text", value: "your book." },
      ],
      correct: ["Open"],
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
    if (locked) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    const updated = [...answers];
    updated[qIndex][blankIndex] = option;
    setAnswers(updated);
    setShowResult(false);
  };

  // ===============================
  // 🔵 4) فحص الإجابات
  // ===============================
  const checkAnswers = () => {
    if (locked) return; // ❌ لا يسمح بالتعديل بعد Show Answer
    // تحقق إذا الطالب ما اختار ولا شيء
    const selectedCount = answers.flat().filter((a) => a !== null).length;
    if (selectedCount < 4) {
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
setLocked(true); // 🔒 قفل الإجابات
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
          gap: "15px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
       <h5 className="header-title-page8">
            <span className="ex-A">H</span>Look, read, and circle.
          </h5>
        <div className="content-container-wb-unit3-p4-q2">
          {questions.map((q, qIndex) => (
            <div className="question-row-review8-p2-q4" key={q.id}>
              <div className="sentence-wb-unit3-p4-q2">
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
                  <img src={q.image} className="question-img-wb-unit3-p4-q2" />
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
                          className="blank-options-wb-unit3-p4-q2"
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

                                {isWrongSelected  && (
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

export default WB_Unit3_Page4_Q2;
