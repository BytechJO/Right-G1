import React, { useRef, useState } from "react";
import img1 from "../../assets/unit1/imgs/Read and match 01.png";
import img2 from "../../assets/unit1/imgs/Read and match 02.png";
import "./Unit8_Page6_Q3.css";
import ValidationAlert from "../Popup/ValidationAlert";
const Unit8_Page6_Q3 = () => {
  const [lines, setLines] = useState([]);
  const [wrongWords, setWrongWords] = useState([]); // ⭐ تم التعديل هون
  const containerRef = useRef(null);
  let startPoint = null;

  const correctMatches = [
    { word: "Touch your arm.", image: "img1" },
    { word: "Open your eye.", image: "img2" },
  ];

  const handleDotDown = (e) => {
    e.preventDefault(); // مهم لمنع التمرير على الموبايل

    const isTouch = e.type === "touchstart";
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    startPoint = e.target;

    const rect = containerRef.current.getBoundingClientRect();
    const x = startPoint.getBoundingClientRect().left - rect.left + 8;
    const y = startPoint.getBoundingClientRect().top - rect.top + 8;

    setLines((prev) => [...prev, { x1: x, y1: y, x2: x, y2: y }]);

    window.addEventListener("mousemove", followMouse);
    window.addEventListener("mouseup", stopDrawingLine);

    window.addEventListener("touchmove", followMouse);
    window.addEventListener("touchend", stopDrawingLine);
  };

  const followMouse = (e) => {
    const isTouch = e.type === "touchmove";
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const rect = containerRef.current.getBoundingClientRect();
    setLines((prev) => [
      ...prev.slice(0, -1),
      {
        x1: startPoint.getBoundingClientRect().left - rect.left + 8,
        y1: startPoint.getBoundingClientRect().top - rect.top + 8,
        x2: clientX - rect.left,
        y2: clientY - rect.top,
      },
    ]);
  };

  const stopDrawingLine = (e) => {
    const isTouch = e.type === "touchend";
    const clientX = isTouch ? e.changedTouches[0].clientX : e.clientX;
    const clientY = isTouch ? e.changedTouches[0].clientY : e.clientY;

    window.removeEventListener("mousemove", followMouse);
    window.removeEventListener("mouseup", stopDrawingLine);
    window.removeEventListener("touchmove", followMouse);
    window.removeEventListener("touchend", stopDrawingLine);

    const endDot = document.elementFromPoint(clientX, clientY);

    if (!endDot || !endDot.classList.contains("end-dot")) {
      setLines((prev) => prev.slice(0, -1));
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const newLine = {
      x1: startPoint.getBoundingClientRect().left - rect.left + 8,
      y1: startPoint.getBoundingClientRect().top - rect.top + 8,
      x2: endDot.getBoundingClientRect().left - rect.left + 8,
      y2: endDot.getBoundingClientRect().top - rect.top + 8,
      word: startPoint.dataset.letter,
      image: endDot.dataset.image,
    };

    setLines((prev) => [...prev.slice(0, -1), newLine]);
  };

  const checkAnswers = () => {
    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking."
      );
      return;
    }

    let wrong = []; // ⭐ تم التعديل هون
    let correctCount = 0;

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image
      );
      if (isCorrect) correctCount++;
      else wrong.push(line.word); // ⭐ تم التعديل هون
    });

    setWrongWords(wrong); // ⭐ تم التعديل هون

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
          <span className="ex-A">F</span>Read and match.
        </h5>

        <div className="container1" ref={containerRef}>
          {/* row 1 */}
          <div className="matching-row">
            <div className="word-with-dot">
              <span className="span-num">1</span>

              <span className="word-text">
                Touch your arm.
                {wrongWords.includes("Touch your arm.") && ( // ⭐ تم التعديل هون
                  <span className="error-mark">✕</span>
                )}
              </span>

              <div className="dot-wrapper">
                <div
                  className="dot start-dot"
                  data-letter="Touch your arm."
                  onMouseDown={handleDotDown}
                  onTouchStart={handleDotDown}
                ></div>
              </div>
            </div>

            <div className="img-with-dot">
              <div className="dot-wrapper">
                <div className="dot end-dot" data-image="img2"></div>
              </div>
              <img src={img2} className="matched-img" alt="" />
            </div>
          </div>

          {/* row 2 */}
          <div className="matching-row">
            <div className="word-with-dot">
              <span className="span-num">2</span>

              <span className="word-text">
               Open your eye.
                {wrongWords.includes("Open your eye.") && ( // ⭐ تم التعديل هون
                  <span className="error-mark">✕</span>
                )}
              </span>

              <div className="dot-wrapper">
                <div
                  className="dot start-dot"
                  data-letter="Open your eye."
                  onMouseDown={handleDotDown}
                  onTouchStart={handleDotDown}
                ></div>
              </div>
            </div>

            <div className="img-with-dot">
              <div className="dot-wrapper">
                <div className="dot end-dot" data-image="img1"></div>
              </div>
              <img src={img1} className="matched-img" alt="" />
            </div>
          </div>

          <svg className="lines-layer">
            {lines.map((line, i) => (
              <line key={i} {...line} stroke="red" strokeWidth="3" />
            ))}
          </svg>
        </div>
      </div>{" "}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLines([]);
            setWrongWords([]);
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
};

export default Unit8_Page6_Q3
