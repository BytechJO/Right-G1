import React, { useState } from "react";
import "./Unit9_Page5_Q4.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/unit5/imgs/U5P44EXEC.svg";
const Unit9_Page5_Q4 = () => {
  const data = [
    { letter: "a", number: 1 }, { letter: "b", number: 2 }, { letter: "c", number: 3 },
    { letter: "d", number: 4 }, { letter: "e", number: 5 }, { letter: "f", number: 6 },
    { letter: "g", number: 7 }, { letter: "h", number: 8 }, { letter: "i", number: 9 },
    { letter: "j", number: 10 }, { letter: "k", number: 11 }, { letter: "l", number: 12 },
    { letter: "m", number: 13 }, { letter: "n", number: 14 }, { letter: "o", number: 15 },
    { letter: "p", number: 16 }, { letter: "q", number: 17 }, { letter: "r", number: 18 },
    { letter: "s", number: 19 }, { letter: "t", number: 20 }, { letter: "u", number: 21 },
    { letter: "v", number: 22 }, { letter: "w", number: 23 }, { letter: "x", number: 24 },
    { letter: "y", number: 25 }, { letter: "z", number: 26 },
  ];

  const questionGroups = [
     [23, 8, 1, 20], // __what's_____
    [4, 15], // this
    [25, 15, 21],
    [12, 9, 11, 5],
  ];

  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW
  const [letters, setLetters] = useState(
    questionGroups.map((group) => group.map(() => ""))
  );

  const handleInputChange = (value, g, l) => {
    if (showAnswer) return; // ⭐ منع الكتابة في وضع Show Answer

    const updated = [...letters];
    updated[g][l] = value.toLowerCase();
    setLetters(updated);
    setWrongInputs([]);
  };

  const formedWords = letters.map((group) => group.join(""));

  const handleCheckAnswers = () => {
        if (showAnswer) return; // ⭐ منع الكتابة في وضع Show Answer

    const hasEmpty = letters.some((group) =>
      group.some((letter) => letter === "")
    );

    if (hasEmpty) {
      ValidationAlert.info("Oops!", "Please complete all fields before checking.");
      return;
    }

    let correctCount = 0;
    let total = letters.flat().length;
    let wrong = [];

    for (let g = 0; g < letters.length; g++) {
      for (let l = 0; l < letters[g].length; l++) {
        const letter = letters[g][l];
        const correctNum = data.find((d) => d.letter === letter)?.number;

        if (correctNum === questionGroups[g][l]) {
          correctCount++;
        } else {
          wrong.push(`${g}-${l}`);
        }
      }
    }

    setWrongInputs(wrong);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  // ⭐⭐⭐ SHOW ANSWER FUNCTION
  const handleShowAnswer = () => {
    const filled = questionGroups.map((group) =>
      group.map((num) => {
        const match = data.find((d) => d.number === num);
        return match ? match.letter : "";
      })
    );

    setLetters(filled);
    setWrongInputs([]);
    setShowAnswer(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>

        <h5 className="header-title-page8">
          <span className="ex-A"> C</span>Write the sentence.
        </h5>

   

          {/* Alphabet Table */}
      
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
                  <span key={i} className="unit3-q4-cell number1">
                    {c.number}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Inputs */}
          <div className="words">
            {questionGroups.map((group, g) => (
              <div className="word-group" key={g}>
                {group.map((num, l) => (
                  <div className="input-h6" key={l}>
                    <h6 className="unit1-page8-q4-nums"style={{ fontSize: "20px" }}>{num}</h6>

                    <div className="input-wrapper">
                      <input
                        className="inputs"
                        maxLength={1}
                        value={letters[g][l]}
                        onChange={(e) => handleInputChange(e.target.value, g, l)}
                      />

                      {wrongInputs.includes(`${g}-${l}`) && (
                        <span className="error-mark1">✕</span>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            ))}

          </div>

          {/* Sentence */}
          <div className="sentence">
            {formedWords.map((word, i) => (
              <span key={i} className="sentence-word">{word}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLetters(questionGroups.map((g) => g.map(() => "")));
            setWrongInputs([]);
            setShowAnswer(false);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>

        <button onClick={handleShowAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={handleCheckAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>

    </div>
  );
};

export default Unit9_Page5_Q4;
