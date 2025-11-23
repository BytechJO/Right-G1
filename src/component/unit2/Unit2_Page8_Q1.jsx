import React, { useState, useEffect, useRef } from "react";
import "./Unit2_Page8_Q1.css";
import table from "../../assets/unit1/imgs/table2.jpg";
import dish from "../../assets/unit1/imgs/dish3.jpg";
import tiger from "../../assets/unit1/imgs/tiger.svg";
import duck from "../../assets/unit1/imgs/duck.svg";
import ValidationAlert from "../Popup/ValidationAlert";
const Unit2_Page8_Q1 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongWords, setWrongWords] = useState([]); // ⭐ تم التعديل هون
  const correctMatches = [
    { word: "duck", image: "img3" },
    { word: "tiger", image: "img4" },
    { word: "dish", image: "img2" },
    { word: "table", image: "img1" },
  ];

  const handleDotDown = (e) => {
    startPoint = e.target;
    const rect = containerRef.current.getBoundingClientRect();
    const x = startPoint.getBoundingClientRect().left - rect.left + 8;
    const y = startPoint.getBoundingClientRect().top - rect.top + 8;

    setLines((prev) => [...prev, { x1: x, y1: y, x2: x, y2: y }]);
    window.addEventListener("mousemove", followMouse);
    window.addEventListener("mouseup", stopDrawingLine);
  };

  const followMouse = (e) => {
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

  const stopDrawingLine = (e) => {
    window.removeEventListener("mousemove", followMouse);
    window.removeEventListener("mouseup", stopDrawingLine);

    const endDot = document.elementFromPoint(e.clientX, e.clientY);

    if (!endDot || !endDot.classList.contains("end-dot2")) {
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
    // تأكد إنو الطالب وصل كل الأزواج
    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking."
      );
      return;
    }

    let correctCount = 0;
    const total = correctMatches.length;
    let wrong = []; // ⭐ تم التعديل هون
    // احسب كم وصلة صحيحة
    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image
      );
      if (isCorrect) correctCount++;
      else wrong.push(line.word); // ⭐ تم التعديل هون
    });
    setWrongWords(wrong); // ⭐ تم التعديل هون
    // تحديد اللون حسب النتيجة
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    // رسالة النتيجة منسقة بالألوان
    const scoreMessage = `
        <div style="font-size: 20px; margin-top: 10px; text-align:center;">
          <span style="color:${color}; font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    // الحالات الثلاث
    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
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
        <div className="page8-q1-container">
          <h5 className="header-title-page8">
           D Read, look, and match.
          </h5>

          <div className="container12" ref={containerRef}>
            {/* الصف الأول */}
            <div className="matching-row2">
              <div className="word-with-dot2">
                <span className="span-num2">1</span>
                <span className="word-text2">duck</span>
                {wrongWords.includes("duck") && ( // ⭐ تم التعديل هون
                  <span className="error-mark">✕</span>
                )}
                <div className="dot-wrapper2">
                  <div
                    className="dot2 start-dot2"
                    data-letter="duck"
                    onMouseDown={handleDotDown}
                  ></div>
                </div>
              </div>

              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div className="dot2 end-dot2" data-image="img1"></div>
                </div>
                <img
                  src={table}
                  className="matched-img2"
                  alt=""
                  style={{ height: "90px", width: "auto" }}
                />
              </div>
            </div>

            {/* الصف الثاني */}
            <div className="matching-row2">
              <div className="word-with-dot2">
                <span className="span-num2">2</span>
                <span className="word-text2">tiger</span>
                {wrongWords.includes("tiger") && ( // ⭐ تم التعديل هون
                  <span className="error-mark">✕</span>
                )}
                <div className="dot-wrapper2">
                  <div
                    className="dot2 start-dot2"
                    data-letter="tiger"
                    onMouseDown={handleDotDown}
                  ></div>
                </div>
              </div>

              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div className="dot2 end-dot2" data-image="img2"></div>
                </div>
                <img
                  src={dish}
                  className="matched-img2"
                  alt=""
                  style={{ height: "100px", width: "135px" }}
                />
              </div>
            </div>

            {/* الصف الثالث */}
            <div className="matching-row2">
              <div className="word-with-dot2">
                <span className="span-num2">3</span>
                <span className="word-text2">dish</span>
                {wrongWords.includes("dish") && ( // ⭐ تم التعديل هون
                  <span className="error-mark">✕</span>
                )}
                <div className="dot-wrapper2">
                  <div
                    className="dot2 start-dot2"
                    data-letter="dish"
                    onMouseDown={handleDotDown}
                  ></div>
                </div>
              </div>

              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div className="dot2 end-dot2" data-image="img3"></div>
                </div>
                <img
                  src={duck}
                  className="matched-img2"
                  alt=""
                  style={{ height: "100px", width: "auto" }}
                />
              </div>
            </div>

            {/* الصف الرابع */}
            <div className="matching-row2">
              <div className="word-with-dot2">
                <span className="span-num2">4</span>
                <span className="word-text2">table</span>
                {wrongWords.includes("table") && ( // ⭐ تم التعديل هون
                  <span className="error-mark">✕</span>
                )}
                <div className="dot-wrapper2">
                  <div
                    className="dot2 start-dot2"
                    data-letter="table"
                    onMouseDown={handleDotDown}
                  ></div>
                </div>
              </div>

              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div className="dot2 end-dot2" data-image="img4"></div>
                </div>
                <img
                  src={tiger}
                  className="matched-img2"
                  alt=""
                  style={{ height: "100px", width: "auto" }}
                />
              </div>
            </div>

            <svg className="lines-layer2">
              {lines.map((line, i) => (
                <line key={i} {...line} stroke="red" strokeWidth="3" />
              ))}
            </svg>
          </div>
        </div>
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
    </div>
  );
};

export default Unit2_Page8_Q1;
