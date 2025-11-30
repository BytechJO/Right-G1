import React, { useRef, useState } from "react";
import img1 from "../../assets/unit1/imgs/Read and match 01.png";
import img2 from "../../assets/unit1/imgs/Read and match 02.png";

import "./Page8_Q3.css";
import ValidationAlert from "../Popup/ValidationAlert";

export default function Page8_Q3() {
  const [lines, setLines] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [firstDot, setFirstDot] = useState(null); // ⭐ أول نقطة
  const containerRef = useRef(null);

  const correctMatches = [
    { word: "Hello! I’m John.", image: "img1" },
    { word: "Goodbye!", image: "img2" },
  ];

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    setFirstDot({
      word: e.target.dataset.letter,
      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  // ============================
  // 2️⃣ الضغط على النقطة الثانية (end-dot)
  // ============================
  const handleEndDotClick = (e) => {
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,
      word: firstDot.word,
      image: e.target.dataset.image,
    };

    setLines((prev) => [...prev, newLine]);

    // تفريغ النقطة الأولى
    setFirstDot(null);
  };

  // ============================
  // 3️⃣ Check Answers
  // ============================
  const checkAnswers = () => {
    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking."
      );
      return;
    }

    let wrong = [];
    let correctCount = 0;

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image
      );
      if (isCorrect) correctCount++;
      else wrong.push(line.word);
    });

    setWrongWords(wrong);

    const total = correctMatches.length;
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

  return (
    <div className="matching-wrapper">
      <div className="matching-scale">
        <h5 className="header-title-page8">
          <span className="ex-A">B</span>Read and match.
        </h5>

        <div className="container1" ref={containerRef}>
          {/* Row 1 */}
          <div className="matching-row">
            <div className="word-with-dot">
              <span className="span-num">1</span>

              <span className="word-text">
                Hello! I’m John.
                {wrongWords.includes("Hello! I’m John.") && (
                  <span className="error-mark">✕</span>
                )}
              </span>

              <div className="dot-wrapper">
                <div
                  className="dot start-dot"
                  data-letter="Hello! I’m John."
                  onClick={handleStartDotClick}
                ></div>
              </div>
            </div>

            <div className="img-with-dot">
              <div className="dot-wrapper">
                <div
                  className="dot end-dot"
                  data-image="img2"
                  onClick={handleEndDotClick}
                ></div>
              </div>
              <img src={img2} className="matched-img" alt="" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="matching-row">
            <div className="word-with-dot">
              <span className="span-num">2</span>

              <span className="word-text">
                Goodbye!
                {wrongWords.includes("Goodbye!") && (
                  <span className="error-mark">✕</span>
                )}
              </span>

              <div className="dot-wrapper">
                <div
                  className="dot start-dot"
                  data-letter="Goodbye!"
                  onClick={handleStartDotClick}
                ></div>
              </div>
            </div>

            <div className="img-with-dot">
              <div className="dot-wrapper">
                <div
                  className="dot end-dot"
                  data-image="img1"
                  onClick={handleEndDotClick}
                ></div>
              </div>

              <img src={img1} className="matched-img" alt="" />
            </div>
          </div>

          {/* SVG lines */}
          <svg className="lines-layer">
            {lines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLines([]);
            setWrongWords([]);
            setFirstDot(null);
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
  );
}
