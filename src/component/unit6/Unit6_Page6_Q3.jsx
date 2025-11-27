import React, { useState, useRef } from "react";
import img1 from "../../assets/unit6/imgs/U6P51EXEF-01.svg";
import img2 from "../../assets/unit6/imgs/U6P51EXEF-02.svg";
import img3 from "../../assets/unit6/imgs/U6P51EXEF-03.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit6_Page6_Q3.css";

const Unit6_Page6_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongImages, setWrongImages] = useState([]);

  const correctMatches = [
    { word: "Can it climb a tree? Yes, it can.", image: "img3" },
    { word: "Can she fly a kite? Yes, she can.", image: "img1" },
    { word: "Can he ride a bike? Yes, he can.", image: "img2" },
  ];

  const handleDotDown2 = (e) => {
    startPoint = e.target;

    const rect = containerRef.current.getBoundingClientRect();
    const x = startPoint.getBoundingClientRect().left - rect.left + 8;
    const y = startPoint.getBoundingClientRect().top - rect.top + 8;

    setLines((prev) => [...prev, { x1: x, y1: y, x2: x, y2: y }]);

    window.addEventListener("mousemove", followMouse2);
    window.addEventListener("mouseup", stopDrawingLine2);
  };

  const followMouse2 = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    setLines((prev) => [
      ...prev.slice(0, -1),
      {
        x1: startPoint.getBoundingClientRect().left - rect.left + 8,
        y1: startPoint.getBoundingClientRect().top - rect.top + 8,
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top,
      },
    ]);
  };

  const stopDrawingLine2 = (e) => {
    window.removeEventListener("mousemove", followMouse2);
    window.removeEventListener("mouseup", stopDrawingLine2);

    const endDot = document.elementFromPoint(e.clientX, e.clientY);

    // ✅ تصحيح اسم الكلاس
    if (!endDot || !endDot.classList.contains("end-dot22-unit6-q7")) {
      setLines((prev) => prev.slice(0, -1));
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const newLine = {
      x1: startPoint.getBoundingClientRect().left - rect.left + 8,
      y1: startPoint.getBoundingClientRect().top - rect.top + 8,
      x2: endDot.getBoundingClientRect().left - rect.left + 8,
      y2: endDot.getBoundingClientRect().top - rect.top + 8,

      // ✅ تصحيح تخزين البيانات
      image: endDot.dataset.image,
      word: startPoint.dataset.word,
    };

    setLines((prev) => [...prev.slice(0, -1), newLine]);
  };
  const checkAnswers2 = () => {
    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking."
      );
      return;
    }

    let correctCount = 0;
    let wrong = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.word); // ✅ خزّني اسم صورة الخطأ فقط
      }
    });

    setWrongImages(wrong); // ✅ حفظ الصور الغلط

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
        <div className="page7-q2-container2">
          <h5 className="header-title-page8">B Read, look, and match.</h5>

          <div className="match-wrapper2" ref={containerRef}>
            <div className="match-words-row2">
              <div className="word-box2">
                <h5>
                  <span style={{ color: "darkblue", fontWeight: "700" }}>
                    1{" "}
                  </span>
                  Can it climb a tree?
                  <br /> Yes, it can.
                  {wrongImages.includes(
                    "Can it climb a tree? Yes, it can."
                  ) && <span className="error-mark-img">✕</span>}
                </h5>
                <div
                  className="dot22-unit6-q7 start-dot22-unit6-q7"
                  data-word="Can it climb a tree? Yes, it can."
                  onMouseDown={handleDotDown2}
                ></div>
              </div>

              <div className="word-box2">
                <h5>
                  <span style={{ color: "darkblue", fontWeight: "700" }}>
                    2
                  </span>
                  Can she fly a kite?
                  <br />
                  Yes, she can.
                  {wrongImages.includes(
                    "Can she fly a kite? Yes, she can."
                  ) && <span className="error-mark-img">✕</span>}
                </h5>
                <div
                  className="dot22-unit6-q7 start-dot22-unit6-q7"
                  data-word="Can she fly a kite? Yes, she can."
                  onMouseDown={handleDotDown2}
                ></div>
              </div>

              <div className="word-box2">
                <h5>
                  <span style={{ color: "darkblue", fontWeight: "700" }}>
                    3
                  </span>
                  Can he ride a bike?
                  <br />
                  Yes, he can.
                  {wrongImages.includes("Can he ride a bike? Yes, he can.") && (
                    <span className="error-mark-img">✕</span>
                  )}
                </h5>
                <div
                  className="dot22-unit6-q7 start-dot22-unit6-q7"
                  data-word="Can he ride a bike? Yes, he can."
                  onMouseDown={handleDotDown2}
                ></div>
              </div>
            </div>
            {/* الصور */}
            <div className="match-images-row2">
              <div className="img-box2">
                <img src={img1} alt=""  className="img-box2-unit6-p6-q3"/>

                <div
                  className="dot22-unit6-q7 end-dot22-unit6-q7"
                  data-image="img1"
                ></div>
              </div>

              <div className="img-box2">
                <img src={img2} alt=""  className="img-box2-unit6-p6-q3"/>{" "}
                <div
                  className="dot22-unit6-q7 end-dot22-unit6-q7"
                  data-image="img2"
                ></div>
              </div>

              <div className="img-box2">
                <img src={img3} alt="" className="img-box2-unit6-p6-q3" />{" "}
                <div
                  className="dot22-unit6-q7 end-dot22-unit6-q7"
                  data-image="img3"
                ></div>
              </div>
            </div>

            {/* الجمل */}

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
        <button
          onClick={() => {
            setLines([]);
            setWrongImages([]);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        <button onClick={checkAnswers2} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page6_Q2;
