import React, { useState, useEffect, useRef } from "react";
import "./Unit10_Page5_Q4.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/unit5/imgs/U5P44EXEC.svg";
const Unit10_Page5_Q4 = () => {
  const data = [
    { letter: "a", number: 1 },
    { letter: "b", number: 2 },
    { letter: "c", number: 3 },
    { letter: "d", number: 4 },
    { letter: "e", number: 5 },
    { letter: "f", number: 6 },
    { letter: "g", number: 7 },
    { letter: "h", number: 8 },
    { letter: "i", number: 9 },
    { letter: "j", number: 10 },
    { letter: "k", number: 11 },
    { letter: "l", number: 12 },
    { letter: "m", number: 13 },
    { letter: "n", number: 14 },
    { letter: "o", number: 15 },
    { letter: "p", number: 16 },
    { letter: "q", number: 17 },
    { letter: "r", number: 18 },
    { letter: "s", number: 19 },
    { letter: "t", number: 20 },
    { letter: "u", number: 21 },
    { letter: "v", number: 22 },
    { letter: "w", number: 23 },
    { letter: "x", number: 24 },
    { letter: "y", number: 25 },
    { letter: "z", number: 26 },
  ];

  const questionGroups = [
    [23, 8, 1, 20], // __what's_____
    [4, 15], // this
    [25, 15, 21],
    [23, 1, 14, 20],
  ];
  const [bigInput, setBigInput] = useState("");
  const [bigInputWrong, setBigInputWrong] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]); // ⭐ تم التعديل هون
  const [showAnswer, setShowAnswer] = useState(false);

  const [letters, setLetters] = useState(
    questionGroups.map((group) => group.map(() => ""))
  );
  const handleInputChange = (value, groupIndex, letterIndex) => {
    if (showAnswer) return;
    const updated = [...letters];
    updated[groupIndex][letterIndex] = value.toLowerCase();
    setLetters(updated);
  };

  const formedWords = letters.map((group) => group.join(""));
  const fullSentence = "This is a ruler";

  const handleCheckAnswers = () => {
    if (showAnswer) return;
    // 1️⃣ التحقق من وجود فراغات
    const hasEmpty = letters.some((group) =>
      group.some((letter) => letter === "")
    );
    if (hasEmpty || bigInput.length===0 ) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all fields before checking."
      );
      return;
    }

    // 2️⃣ حساب عدد الصحيحة
    let correctCount = 1;
    let total = letters.flat().length + 1; // +1 for big input
    let wrong = []; // ⭐ تم التعديل هون
    // const isBigCorrect =
    //   bigInput.trim().toLowerCase() === fullSentence.trim().toLowerCase();

    // setBigInputWrong(!isBigCorrect);

    // // 🔥 أضيفي هاي
    // if (isBigCorrect) {
    //   correctCount++; // add point for the big sentence
    // }
    for (let g = 0; g < letters.length; g++) {
      for (let l = 0; l < letters[g].length; l++) {
        const letter = letters[g][l];
        const correctNum = data.find((d) => d.letter === letter)?.number;

        if (correctNum === questionGroups[g][l]) {
          correctCount++;
        } else {
          wrong.push(`${g}-${l}`); // ⭐ تم التعديل هون
        }
      }
    }
    setWrongInputs(wrong); // ⭐ تم التعديل هون
    // 3️⃣ تحديد اللون حسب السكور
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    // 4️⃣ رسالة النتيجة
    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    // 🔹 3) التحقق من الجملة الكبيرة
    const correctSentence = fullSentence.trim().toLowerCase(); // from small inputs

    // الآن الشرط رح يكون صحيح
    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  const handleShowAnswer = () => {
    // 1) جهزي مصفوفة الحروف الصحيحة
    const correctLetters = questionGroups.map((group) =>
      group.map((num) => {
        const item = data.find((d) => d.number === num);
        return item ? item.letter : "";
      })
    );

    // 2) ضعي الإجابات الصحيحة
    setLetters(correctLetters);

    // 3) امسحي الأخطاء
    setWrongInputs([]);

    // 4) اتركي big input فاضي كما طلبتِ
    setBigInput("");
    setBigInputWrong(false);

    // 5) فعّلي وضع show answer
    setShowAnswer(true);
  };

  return (
    <div
      className="unit3-q4-container3"
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
        <h5 className="header-title-page8">
          <span className="ex-A"> C</span>Answer the question..
        </h5>

        <div className="unit3-q4-alphabet-box">
          <div className="unit3-q4-row">
            {data.map((c, i) => (
              <div className="unit3-q4-letter-char">
                <div className="unit3-q4-data">
                  <span key={i} className="unit3-q4-cell">
                    {c.letter}
                  </span>
                </div>
                <div className="unit3-q4-data">
                  <span key={i} className="unit3-q4-cell number2">
                    {c.number}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="unit3-q4-words">
            {questionGroups.map((group, groupIndex) => (
              <div className="unit3-q4-word-group" key={groupIndex}>
                {group.map((num, letterIndex) => (
                  <div className="unit3-q4-input-h6" key={letterIndex}>
                    <h6 style={{ fontSize: "20px" }}>{num}</h6>
                    <div className="unit3-q4-input-wrapper">
                      {" "}
                      {/* ⭐ تم التعديل هون */}
                      <input
                        className="unit3-q4-inputs"
                        maxLength={1}
                        value={letters[groupIndex][letterIndex]}
                        onChange={(e) =>
                          !showAnswer &&
                          handleInputChange(
                            e.target.value,
                            groupIndex,
                            letterIndex
                          )
                        }
                        disabled={showAnswer}
                      />
                      {!showAnswer &&
                        wrongInputs.includes(
                          `${groupIndex}-${letterIndex}`
                        ) && (
                          <span className="error-mark1-unit4-page5-q4">✕</span> // ⭐ تم التعديل هون
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
           
          </div>

          <div className="unit3-q4-sentence">
            <div
              className="big-answer-wrapper"
              style={{ position: "relative", marginTop: "30px" }}
            >
              <input
                type="text"
                className="big-answer-input"
                placeholder="Write the answer here..."
                value={bigInput}
                onChange={(e) => setBigInput(e.target.value.toLowerCase())}
              />

              {!showAnswer && bigInputWrong && (
                <span className="error-mark1-unit4-page5-q4">✕</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLetters(questionGroups.map((group) => group.map(() => "")));
            setWrongInputs([]);
            setBigInputWrong(false);
            setBigInput("");
            setShowAnswer(false);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>
        <button onClick={handleCheckAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit10_Page5_Q4;
