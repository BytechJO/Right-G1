import React, { useState, useRef, useEffect } from "react";
import "./Review6_Page2_Q3.css";
import ValidationAlert from "../Popup/ValidationAlert";
const Review6_Page2_Q3 = () => {
  const sentences = [
    { word1: "pit", word2: "chip", word3: "top", num: 1 },
    { word1: "bit", word2: "sun", word3: "fix", num: 2 },
    { word1: "cup", word2: "pick", word3: "fit", num: 3 },
    { word1: "box", word2: "mix", word3: "tip", num: 4 },
    { word1: "kick", word2: "desk", word3: "rip", num: 5 },
    { word1: "sip", word2: "cap", word3: "pin", num: 6 },
  ];

  const correct = {
    0: [0, 1],
    1: [0, 2],
    2: [1, 2],
    3: [1, 2],
    4: [0, 2],
    5: [0, 2],
  };

  const [circledWords, setCircledWords] = useState({});
  const [checked, setChecked] = useState(false);

  const handleWordClick = (sIndex, wIndex) => {
    setCircledWords((prev) => {
      const existing = prev[sIndex] || [];

      // إذا الطالب اخترها قبل → احذفها
      if (existing.includes(wIndex)) {
        return {
          ...prev,
          [sIndex]: existing.filter((i) => i !== wIndex),
        };
      }

      // 🚫 ممنوع يختار أكثر من خيارين
      if (existing.length >= 2) {
        return {
          ...prev,
          [sIndex]: existing.filter((i) => i !== wIndex),
        }; // لا تضيف أي شيء
      }

      // إذا لسا ما اختارها → أضفها (ومسموح <=2)
      return {
        ...prev,
        [sIndex]: [...existing, wIndex],
      };
    });
    setChecked(false)
  };

  const checkAnswers = () => {
    if (Object.keys(circledWords).length < sentences.length) {
      ValidationAlert.info("Oops!", "Please circle at least one mistake.");
      return;
    }
    if (
      Object.keys(circledWords).length < sentences.length ||
      Object.values(circledWords).some((arr) => arr.length < 2)
    ) {
      ValidationAlert.info(
        "Oops!",
        "Please circle two words in each sentence!"
      );
      return;
    }
    let totalCorrect = 0;
    let studentCorrect = 0;

    for (let sIndex in correct) totalCorrect += correct[sIndex].length;

    for (let sIndex in circledWords) {
      circledWords[sIndex].forEach((wIndex) => {
        if (correct[sIndex]?.includes(wIndex)) studentCorrect++;
      });
    }

    setChecked(true);

    const scoreMessage = `Score: ${studentCorrect} / ${totalCorrect}`;
    if (studentCorrect === totalCorrect) ValidationAlert.success(scoreMessage);
    else if (studentCorrect === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

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
        className="review3-p2-q2-div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="review3-p2-q2-content-container">
          <h5 className="header-title-page8">
            F Circle <span style={{ color: "red" }}>the short i</span> words.
          </h5>

          <div className="review3-p2-q2-sentence-container2">
            {sentences.map((sentence, sIndex) => (
              <div className="review3-p2-q2-sentence-row" key={sIndex}>
                <span className="review3-p2-q2-num" style={{ color: "#2c5287", fontWeight: "700" }}>{sIndex + 1}</span>

                <div className="review3-p2-q2-word-box">
                  {[sentence.word1, sentence.word2, sentence.word3].map(
                    (word, wIndex) => {
                      const isCircled = circledWords[sIndex]?.includes(wIndex);
                      const isWrong =
                        checked &&
                        isCircled &&
                        !correct[sIndex]?.includes(wIndex);

                      return (
                        <span
                          key={wIndex}
                          className={`review3-p2-q2-word ${
                            isCircled ? "circled" : ""
                          }`}
                          onClick={() => handleWordClick(sIndex, wIndex)}
                        >
                          {word}
                          {isWrong && (
                            <span className="review3-p2-q2-wrong-x">✕</span>
                          )}
                        </span>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button
            onClick={() => {
              setCircledWords({});
              setChecked(false);
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review6_Page2_Q3;
