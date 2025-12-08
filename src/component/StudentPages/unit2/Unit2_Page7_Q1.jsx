import React, { useState } from "react";
import "./Unit2_Page7_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

const Unit2_Page7_Q1 = () => {
  const words = [
    { word: "Good", num: 1 },
    { word: "evening", num: 2 },
    { word: "Goodbye", num: 3 },
    { word: "afternoon", num: 4 },
    { word: "!", num: 5 },
    { word: "Hello", num: 6 },
    { word: "How", num: 7 },
    { word: "morning", num: 8 },
    { word: "Fine", num: 9 },
    { word: "?", num: 10 },
    { word: "are", num: 11 },
    { word: "thank", num: 12 },
    { word: ",", num: 13 },
    { word: "I'm Helen", num: 14 },
    { word: "you", num: 15 },
    { word: ".", num: 16 },
  ];

  const correctAnswers2 = {
    a: ["How", "are", "you", "?"],
    b: ["Good", "morning", "!"],
    c: ["Fine", ",", "thank", "you", "."],
    d: ["Goodbye", "!"],
    e: ["Hello", "!", "I'm Helen", "."],
    f: ["Good", "afternoon", "!"],
  };

  const sentences = {
    a: [7, 11, 15, 10],
    b: [1, 8, 5],
    c: [9, 13, 12, 15, 16],
    d: [3, 5],
    e: [6, 5, 14, 16],
    f: [1, 4, 5],
  };

  const [userAnswers, setUserAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState("");
  const [wrongInputs, setWrongInputs] = useState({});

  const handleChange = (key, index, value) => {
    setUserAnswers((prev) => {
      const updated = { ...prev };
      if (!updated[key]) updated[key] = []; // ✅ نعمل Array إذا مش موجودة
      updated[key][index] = value; // ✅ نخزن القيمة
      return updated;
    });
    setWrongInputs({});
  };

  const checkAnswers = () => {
    if (showAnswer) return;
    let tempScore = 0;
    let totalInputs = 0;

    const sentenceEntries = Object.entries(sentences);

    // ✅ نتجاهل الجملة الأولى (sentenceEntries[0])
    for (let s = 0; s < sentenceEntries.length; s++) {
      const [key, correctNums] = sentenceEntries[s];

      totalInputs += correctNums.length;

      // ✅ التأكد من تعبئة المدخلات قبل التصحيح
      if (
        !userAnswers[key] ||
        Object.keys(userAnswers[key]).length !== correctNums.length
      ) {
        ValidationAlert.info(
          "Oops!",
          "Please fill all fields before checking."
        );
        return;
      }

      for (let i = 0; i < correctNums.length; i++) {
        if (!userAnswers[key][i]) {
          ValidationAlert.info(
            "Oops!",
            "Please fill all fields before checking."
          );
          return;
        }
      }
    }

    let newWrongInputs = {};

    // ✅ التصحيح بدون الجملة الأولى
    for (let s = 0; s < sentenceEntries.length; s++) {
      const [key, correctNums] = sentenceEntries[s];
      newWrongInputs[key] = [];

      correctNums.forEach((_, index) => {
        const enteredWord = userAnswers[key][index]?.trim().toLowerCase();
        const correctWord = correctAnswers2[key][index].trim().toLowerCase();

        if (enteredWord !== correctWord) {
          newWrongInputs[key][index] = true;
        } else {
          newWrongInputs[key][index] = false;
          tempScore++;
        }
      });
    }

    setWrongInputs(newWrongInputs);

    const color =
      tempScore === totalInputs ? "green" : tempScore === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${tempScore} / ${totalInputs}
      </span>
    </div>
  `;

    if (tempScore === totalInputs) ValidationAlert.success(scoreMessage);
    else if (tempScore === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setChecked(true);
  };

  const reset = () => {
    setUserAnswers({});
    setChecked(false);
    setError("");
    setShowAnswer(false);
    setWrongInputs({});
  };
  const handleShowAnswer = () => {
    let filled = {};

    Object.entries(sentences).forEach(([key, arr], index) => {
      if (index === 0) return; // نتجاهل الجملة الأولى

      filled[key] = arr.map((num, i) => correctAnswers2[key][i]);
    });

    setUserAnswers(filled);
    setShowAnswer(true);
    setChecked(false);
    setWrongInputs({});
  };

  return (
    <>
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
          <div className="unit7-container">
            <h5 className="header-title-page8">A Read and write.</h5>

            <div className="number-word-section">
              {words.map((item) => (
                <div className="word-number" key={item.num}>
                  <span className="num-word">{item.num}</span>
                  <span className="word-num">{item.word}</span>
                </div>
              ))}
            </div>

            <div className="num-input-section">
              {Object.entries(sentences).map(
                ([key, correctArray], sentenceIndex) => (
                  <div key={key} className="sentence-row">
                    <span className="sentence-label">{key}</span>
                    <div className="num-container">
                      {correctArray.map((num, i) => (
                        <span key={i} className="sentence-preview">
                          {num}
                        </span>
                      ))}
                    </div>
                    <div className="sentence-line">
                      {correctArray.map((num, index) => {
                        const correctWord =
                          words.find((w) => w.num === num)?.word || "";

                        return (
                          <div className="input-wrapper1" key={index}>
                            <input
                              className={`input-sentence 
                                 ${
                                   checked && wrongInputs[key]?.[index]
                                     ? "wrong-input1"
                                     : ""
                                 } 
                                 ${showAnswer ? "show-red" : ""}`}
                              value={userAnswers[key]?.[index] || ""}
                              onChange={(e) =>
                               showAnswer
                                  ? null
                                  : handleChange(key, index, e.target.value)
                              }
                              readOnly={showAnswer}
                            />

                            {checked && wrongInputs[key]?.[index] && (
                              <span className="wrong-icon">✕</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
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
    </>
  );
};

export default Unit2_Page7_Q1;
