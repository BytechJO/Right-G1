import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/unit6/imgs/U6P50EXEB-01.svg";
import cap from "../../../assets/unit6/imgs/U6P50EXEB-02.svg";
import ant from "../../../assets/unit6/imgs/U6P50EXEB-03.svg";
import dad from "../../../assets/unit6/imgs/U6P50EXEB-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit8_Page1_Q2.css"
const WB_Unit8_Page1_Q2 = () => {
  const questions = [
    {
      img: bat,
      parts: [
        { type: "text", value: "Open" },
        { type: "input", answer: "your eye" },
        { type: "text", value: "." },
      ],
    },
    {
      img: cap,
      parts: [
        { type: "text", value: "Bend" },
        { type: "input", answer: "your knee" },
        { type: "text", value: "." },
      ],
    },
    {
      img: ant,
      parts: [
         
        { type: "input", answer: "Raise your hand" },
        { type: "text", value: "." },
      ],
    },
     {
      img: ant,
      parts: [
         
        { type: "input", answer: "Open your mouth" },
        { type: "text", value: "." },
      ],
    },
 
  ];

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null)))
  );

  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  const handleChange = (value, qIndex, pIndex) => {
    if (locked) return;

    const copy = [...answers];
    copy[qIndex][pIndex] = value.toLowerCase();
    setAnswers(copy);
    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (locked) return;

    // 🔴 1) فحص الانبوتات الفاضية
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      for (let pIndex = 0; pIndex < questions[qIndex].parts.length; pIndex++) {
        const part = questions[qIndex].parts[pIndex];

        if (part.type === "input") {
          const value = answers[qIndex][pIndex];

          if (!value || value.trim() === "") {
            ValidationAlert.info(`Please complete question ${qIndex + 1}.`);
            return; // ⛔ وقف التشييك
          }
        }
      }
    }

    let wrong = [];
    let score = 0;
    let total = 0;

    questions.forEach((q, qIndex) => {
      q.parts.forEach((p, pIndex) => {
        if (p.type === "input") {
          total++;
          if (answers[qIndex][pIndex]?.trim() === p.answer) {
            score++;
          } else {
            wrong.push(`${qIndex}-${pIndex}`);
          }
        }
      });
    });

    setWrongInputs(wrong);
    setLocked(true);
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  const showAnswers = () => {
    const filled = questions.map((q) =>
      q.parts.map((p) => (p.type === "input" ? p.answer : null))
    );

    setAnswers(filled);
    setWrongInputs([]);
    setLocked(true); // 🔒 قفل التعديل
  };

  const reset = () => {
    setAnswers(
      questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null)))
    );
    setWrongInputs([]);
    setLocked(false);
  };

  return (
    <div
      className="question-wrapper-unit3-page6-q1"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
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
        <h5 className="header-title-page8">
          <span className="ex-A">B</span>Look and write.
        </h5>
        <div className="content-container-wb-unit8-p1-q2">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="row2-wb-unit6-p3-q2">
              <div style={{ display: "flex", gap: "10px" ,alignItems:"center"}}>
                <span className="num-span">{qIndex + 1}</span>
                <img src={q.img} alt="" className="q-img-wb-unit8-p1-q2" />
              </div>

              <div className="sentence-wrapper-wb-unit8-p1-q2">
                {q.parts.map((part, pIndex) => {
                  if (part.type === "text") {
                    return (
                      <span key={pIndex} className="sentence-text">
                        {part.value}
                      </span>
                    );
                  }

                  return (
                    <span key={pIndex} style={{ position: "relative" ,width:"90%"}}>
                      <input
                        type="text"
                          style={{width:"100%"}}
                        className="inline-input-wb-unit8-p1-q2"
                        value={answers[qIndex][pIndex] || ""}
                        onChange={(e) =>
                          handleChange(e.target.value, qIndex, pIndex)
                        }
                        disabled={locked}
                      />

                      {wrongInputs.includes(`${qIndex}-${pIndex}`) && (
                        <span className="error-mark-input-wb-unit2-page3-q2">
                          ✕
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
        <button onClick={showAnswers} className="show-answer-btn swal-continue">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit8_Page1_Q2;
