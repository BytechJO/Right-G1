import React, { useState } from "react";
import bat from "../../../assets/unit10/imgs/U10P87EXEE-01.svg";
import cap from "../../../assets/unit10/imgs/U10P87EXEE-02.svg";
import ant from "../../../assets/unit10/imgs/U10P87EXEE-02.svg";
import dad from "../../../assets/unit10/imgs/U10P87EXEE-01.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit10_Page6_Q2.css";

const Unit10_Page6_Q2 = () => {
  const items = [
    {
      question: "What do you want?",
      images: [
        { img: bat, value: "chicken" },
        { img: cap, value: "apple" },
      ],
      correct: "chicken",
      correctInput: "I want",
      afterAnswer: "chicken.",
      inputsCount: 1,
    },
    {
      question: "",
      images: [
        { img: ant, value: "cake" },
        { img: dad, value: "orange" },
      ],
      correct: "orange",
      correctInput: "I want an",
      correctQuestion: "What do you want",
      afterAnswer: "orange.",
      inputsCount: 2,
    },
  ];

  const [selected, setSelected] = useState(["", ""]);
  const [answers, setAnswers] = useState([[""], ["", ""]]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  const handleSelect = (value, index) => {
    if (showCorrect) return;
    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);
    setShowResult(false);
  };

  const handleInput = (value, qIndex, inputIndex = 0) => {
    if (showCorrect) return;
    const newAns = [...answers];
    newAns[qIndex][inputIndex] = value;
    setAnswers(newAns);
    setShowResult(false);
  };

 const showAnswers = () => {
  // اختيار الصور الصحيحة
  setSelected(items.map((item) => item.correct));

  // تعبئة الـ inputs حسب نوع السؤال
  const filledAnswers = items.map((item) => {
    let arr = [];

    if (item.correctQuestion) {
      // 🔹 السؤال الثاني
      arr.push(item.correctQuestion); // input السؤال

      for (let i = 1; i < item.inputsCount; i++) {
        arr.push(item.correctInput); // inputs الجواب
      }
    } else {
      // 🔹 السؤال الأول
      for (let i = 0; i < item.inputsCount; i++) {
        arr.push(item.correctInput);
      }
    }

    return arr;
  });

  setAnswers(filledAnswers);
  setWrongInputs([]);
  setShowResult(true);
  setShowCorrect(true);
};

  const resetAll = () => {
    setSelected(["", ""]);
    setAnswers([[""], ["", ""]]);
    setWrongInputs([]);
    setShowResult(false);
    setShowCorrect(false);
  };

  const checkAnswers = () => {
  if (showCorrect) return;

  // 1️⃣ لازم يكون في اختيار صورة لكل سؤال
  if (selected.some((s) => s === "")) {
    ValidationAlert.info("Please circle one picture in each question!");
    return;
  }

  // 2️⃣ لازم كل الـ inputs المطلوبة تكون معبّاية
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[i].inputsCount; j++) {
      if (!answers[i][j] || answers[i][j].trim() === "") {
        ValidationAlert.info("Please write all answers!");
        return;
      }
    }
  }

  let wrong = [];
  let score = 0;

  items.forEach((item, i) => {
    // 🔹 تشييك الصورة
    if (selected[i] === item.correct) {
      score++;
    } else {
      wrong.push({ qIndex: i, type: "image" });
    }

    // 🔹 تشييك الـ inputs
    if (item.correctQuestion) {
      // input السؤال
      if (
        answers[i][0].trim().toLowerCase() ===
        item.correctQuestion.trim().toLowerCase()
      ) {
        score++;
      } else {
        wrong.push({ qIndex: i, inputIndex: 0 });
      }

      // inputs الجواب
      for (let j = 1; j < item.inputsCount; j++) {
        if (
          answers[i][j].trim().toLowerCase() ===
          item.correctInput.trim().toLowerCase()
        ) {
          score++;
        } else {
          wrong.push({ qIndex: i, inputIndex: j });
        }
      }
    } else {
      // السؤال الأول
      for (let j = 0; j < item.inputsCount; j++) {
        if (
          answers[i][j].trim().toLowerCase() ===
          item.correctInput.trim().toLowerCase()
        ) {
          score++;
        } else {
          wrong.push({ qIndex: i, inputIndex: j });
        }
      }
    }
  });

  setWrongInputs(wrong);
  setShowResult(true);

  const total =
    items.reduce((sum, item) => sum + item.inputsCount + 1, 0);

  const color =
    score === total ? "green" : score === 0 ? "red" : "orange";

  const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

  if (score === total) ValidationAlert.success(msg);
  else if (score === 0) ValidationAlert.error(msg);
  else ValidationAlert.warning(msg);
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
          gap: "30px",
          width: "60%",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">E</span> Look, read, circle, and write.
        </h5>

        <div className="question-grid-unit10-page6-q2">
          {items.map((item, i) => (
            <div className="question-box-unit4-page5-q1" key={i}>
              <div className="choices-unit4-page5-q1">
                {item.images.map((imgObj, idx) => (
                  <div
                    key={idx}
                    className={`circle-wrapper-unit10-page6-q2 ${
                      selected[i] === imgObj.value ? "active" : ""
                    }`}
                    onClick={() => handleSelect(imgObj.value, i)}
                  >
                    <img
                      src={imgObj.img}
                      className="q-img-unit10-page6-q2"
                      alt=""
                    />

                    {showResult &&
                      selected[i] === imgObj.value &&
                      imgObj.value !== item.correct && (
                        <div className="wrong-mark">✕</div>
                      )}
                  </div>
                ))}
              </div>

              {item.question.length ? (
                <p className="question-text">{item.question}</p>
              ) : null}

              <div className="input-wrapper-unit10-page6-q2">
                {/* 🔹 input السؤال (بسطر لحاله) */}
                {item.correctQuestion && (
                  <div style={{ width: "100%", position: "relative" }}>
                    <input
                      type="text"
                      className={`write-input-unit4-page5-q1 question-input-unit10-p6-q2 ${
                        showCorrect ? "correct-color" : ""
                      }`}
                      value={answers[i][0]}
                      onChange={(e) => handleInput(e.target.value, i, 0)}
                    />
                    {showResult && wrongInputs.includes(i) && (
                      <div className="wrong-mark-unit10-p6-q2">✕</div>
                    )}
                  </div>
                )}

                {/* 🔹 input/inputs الإجابة */}
                {Array.from({
                  length: item.correctQuestion
                    ? item.inputsCount - 1
                    : item.inputsCount,
                }).map((_, idx) => {
                  const inputIndex = item.correctQuestion ? idx + 1 : idx;

                  return (
                    <div
                      key={inputIndex}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <input
                        type="text"
                        className={`write-input-unit4-page5-q1 ${
                          showCorrect ? "correct-color" : ""
                        }`}
                        value={answers[i][inputIndex]}
                        onChange={(e) =>
                          handleInput(e.target.value, i, inputIndex)
                        }
                      />

                      {showResult && wrongInputs.includes(i) && (
                        <div className="wrong-mark-unit10-p6-q2">✕</div>
                      )}
                      <span>{item.afterAnswer}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={resetAll} className="try-again-button">
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

export default Unit10_Page6_Q2;
