import React, { useState, useRef } from "react";
import img1 from "../../../assets/img_unit2/imgs/morning.jpg";
import img2 from "../../../assets/img_unit2/imgs/hey.jpg";
import img3 from "../../../assets/img_unit2/imgs/bey.jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page7_Q2.css";

const Unit2_Page7_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const [firstDot, setFirstDot] = useState(null);
  const [wrongImages, setWrongImages] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // ⭐⭐ NEW: قفل الرسم بعد Check Answer
  const [locked, setLocked] = useState(false); //  ← إضافة جديدة

  const correctMatches = [
    { word: "Hello! I’m Hansel.", image: "img2" },
    { word: "Good morning!", image: "img1" },
    { word: "Goodbye!", image: "img3" },
  ];

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل إذا مغلق

    const rect = containerRef.current.getBoundingClientRect();

    const word = e.target.dataset.word || null;
    const image = e.target.dataset.image || null;

    // ⭐⭐ NEW: منع رسم أكثر من خط من نفس الصورة (image)
    const alreadyUsed = lines.some((line) => line.image === image);
    if (alreadyUsed) return; // ← إضافة جديدة

    setFirstDot({
      word,
      image,
      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  // ============================
  // 2️⃣ الضغط على النقطة الثانية (end-dot)
  // ============================
  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل إذا مغلق
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const endWord = e.target.dataset.word || null;
    const endImage = e.target.dataset.image || null;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,

      word: firstDot.word || endWord,
      image: firstDot.image || endImage,
    };

    setLines((prev) => [...prev, newLine]);
    setFirstDot(null);
  };

  // ============================
  // 3️⃣ Check Answers
  // ============================
  const checkAnswers2 = () => {
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل بعد القفل

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
      else wrong.push(line.image);
    });

    setWrongImages(wrong);

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

    setLocked(true); // ⭐⭐ NEW: إغلاق الرسم بعد Check Answer
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
          justifyContent: "flex-start",
        }}
      >
        <div className="page7-q2-container2">
          <h5 className="header-title-page8">B Read, look, and match.</h5>

          <div className="match-wrapper2" ref={containerRef}>
            {/* الصور */}
            <div className="match-images-row2">
              {/* IMAGE 1 */}
              <div className="img-box2">
                <img
                  src={img1}
                  alt=""
                  className={`clickable-img-unit2-p7-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("img1-dot").click()}
                  style={{ cursor: "pointer" }}
                />
                {wrongImages.includes("img1") && (
                  <span className="error-mark-img">✕</span>
                )}

                <div
                  className="dot22-unit2-q7 start-dot22-unit2-q7"
                  data-image="img1"
                  id="img1-dot"
                  onClick={handleStartDotClick}
                ></div>
              </div>

              {/* IMAGE 2 */}
              <div className="img-box2">
                <img
                  src={img2}
                  alt=""
                  className={`clickable-img-unit2-p7-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("img2-dot").click()}
                  style={{ cursor: "pointer" }}
                />
                {wrongImages.includes("img2") && (
                  <span className="error-mark-img">✕</span>
                )}

                <div
                  className="dot22-unit2-q7 start-dot22-unit2-q7"
                  id="img2-dot"
                  data-image="img2"
                  onClick={handleStartDotClick}
                ></div>
              </div>

              {/* IMAGE 3 */}
              <div className="img-box2">
                <img
                  src={img3}
                  alt=""
                  className={`clickable-img-unit2-p7-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("img3-dot").click()}
                  style={{ cursor: "pointer" }}
                />
                {wrongImages.includes("img3") && (
                  <span className="error-mark-img">✕</span>
                )}

                <div
                  className="dot22-unit2-q7 start-dot22-unit2-q7"
                  id="img3-dot"
                  data-image="img3"
                  onClick={handleStartDotClick}
                ></div>
              </div>
            </div>

            {/* الجمل */}
            <div className="match-words-row2">
              <div className="word-box2">
                <h5
                  className={`clickable-word-unit2-p7-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("dot-hello").click()}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                >
                  <span style={{ color: "darkblue", fontWeight: "700" }}>
                    1{" "}
                  </span>
                  Hello! I’m Hansel.
                </h5>
                <div
                  className="dot22-unit2-q7 end-dot22-unit2-q7"
                  id="dot-hello"
                  data-word="Hello! I’m Hansel."
                  onClick={handleEndDotClick}
                ></div>
              </div>

              <div className="word-box2">
                <h5
                  className={`clickable-word-unit2-p7-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("dot-good").click()}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                >
                  <span style={{ color: "darkblue", fontWeight: "700" }}>
                    2{" "}
                  </span>
                  Good morning!
                </h5>
                <div
                  className="dot22-unit2-q7 end-dot22-unit2-q7"
                  id="dot-good"
                  data-word="Good morning!"
                  onClick={handleEndDotClick}
                ></div>
              </div>

              <div className="word-box2">
                <h5
                  className={`clickable-word-unit2-p7-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("dot-goodbye").click()}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                >
                  <span style={{ color: "darkblue", fontWeight: "700" }}>
                    3{" "}
                  </span>
                  Goodbye!
                </h5>
                <div
                  id="dot-goodbye"
                  className="dot22-unit2-q7 end-dot22-unit2-q7"
                  data-word="Goodbye!"
                  onClick={handleEndDotClick}
                ></div>
              </div>
            </div>

            {/* الخطوط */}
            <svg className="lines-layer2">
              {lines.map((l, i) => (
                <line
                  key={i}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="red"
                  strokeWidth="3"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        {/* Reset */}
        <button
          onClick={() => {
            setLines([]);
            setWrongImages([]);
            setFirstDot(null);
            setShowAnswer(false);
            setLocked(false); // ⭐⭐ NEW: السماح بالرسم مجدداً
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>

        {/* Show Answer */}
        <button
          onClick={() => {
            const rect = containerRef.current.getBoundingClientRect();

            const getDotPosition = (selector) => {
              const el = document.querySelector(selector);
              if (!el) return { x: 0, y: 0 };
              const r = el.getBoundingClientRect();
              return {
                x: r.left - rect.left + 8,
                y: r.top - rect.top + 8,
              };
            };

            const finalLines = correctMatches.map((line) => ({
              ...line,
              x1: getDotPosition(`[data-word="${line.word}"]`).x,
              y1: getDotPosition(`[data-word="${line.word}"]`).y,
              x2: getDotPosition(`[data-image="${line.image}"]`).x,
              y2: getDotPosition(`[data-image="${line.image}"]`).y,
            }));

            setLines(finalLines);
            setWrongImages([]);
            setShowAnswer(true);
            setLocked(true); // ⭐⭐ NEW: منع الرسم أثناء Show Answer
          }}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        {/* Check */}
        <button onClick={checkAnswers2} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page7_Q2;
