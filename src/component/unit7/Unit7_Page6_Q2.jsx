import React, { useState, useRef } from "react";
import img1 from "../../assets/img_unit2/imgs/morning.jpg";
import img2 from "../../assets/img_unit2/imgs/hey.jpg";
import img3 from "../../assets/img_unit2/imgs/bey.jpg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit7_Page6_Q2.css";

const Unit7_Page6_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongImages, setWrongImages] = useState([]);

  const correctMatches = [
    { word: "I’m bored.", image: "img3" },
    { word: "I’m cold.", image: "img1" },
    { word: "I’m scared.", image: "img4" },
    { word: "I’m hungry.", image: "img2" },
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
    if (!endDot || !endDot.classList.contains("end-dot22-unit7-p6-q2")) {
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
      image: startPoint.dataset.image,
      word: endDot.dataset.word,
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
        wrong.push(line.image); // ✅ خزّني اسم صورة الخطأ فقط
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
        <div className="container2-unit7-p6-q2">
          <h5 className="header-title-page8">
            {" "}
            <span className="letter-of-Q">E</span>Look, read, and match..
          </h5>

          <div className="match-wrapper2" ref={containerRef}>
            {/* الجمل */}

            {/* الصور */}
            <div className="match-images-row2">
              <div
                className="img-box2"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                <span style={{ color: "darkblue", fontWeight: "700" }}>1 </span>
                <img src={img1} alt="" />
                {wrongImages.includes("img1") && (
                  <span className="error-mark-img-unit7-p6-q2">✕</span>
                )}
                <div
                  className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                  data-image="img1"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>

              <div
                className="img-box2"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                <span style={{ color: "darkblue", fontWeight: "700" }}>2 </span>
                <img src={img2} alt="" />{" "}
                {wrongImages.includes("img2") && (
                  <span className="error-mark-img-unit7-p6-q2">✕</span>
                )}
                <div
                  className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                  data-image="img2"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>

              <div
                className="img-box2"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                <span style={{ color: "darkblue", fontWeight: "700" }}>3 </span>
                <img src={img3} alt="" />{" "}
                {wrongImages.includes("img3") && (
                  <span className="error-mark-img-unit7-p6-q2">✕</span>
                )}
                <div
                  className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                  data-image="img3"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>
              <div
                className="img-box2"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                <span style={{ color: "darkblue", fontWeight: "700" }}>4 </span>
                <img src={img3} alt="" />{" "}
                {wrongImages.includes("img4") && (
                  <span className="error-mark-img-unit7-p6-q2">✕</span>
                )}
                <div
                  className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                  data-image="img4"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>
            </div>
            <div className="match-words-row2">
              <div
                className="word-box2"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h5 className="h5-unit6-p5-q2">I’m bored.</h5>
                  <div
                    className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                    data-word="I’m bored."
                  ></div>
                </div>
              </div>

              <div className="word-box2">
                <div>
                  <h5 className="h5-unit6-p5-q2">I’m cold.</h5>
                  <div
                    className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                    data-word="I’m cold."
                  ></div>
                </div>
              </div>

              <div className="word-box2">
                {" "}
                <div>
                  <h5 className="h5-unit6-p5-q2">I’m scared.</h5>
                  <div
                    className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                    data-word="I’m scared."
                  ></div>
                </div>
              </div>
              <div className="word-box2">
                <div>
                  <h5 className="h5-unit6-p5-q2">I’m hungry.</h5>
                  <div
                    className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                    data-word="I’m hungry."
                  ></div>
                </div>
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

export default Unit7_Page6_Q2;
