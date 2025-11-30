import React, { useState, useRef, useEffect } from "react";
import img1 from "../../assets/unit6/imgs/U6P52EXEC-01.svg";
import img2 from "../../assets/unit6/imgs/U6P52EXEC-02.svg";
import img3 from "../../assets/unit6/imgs/U6P52EXEC-03.svg";
import img4 from "../../assets/unit6/imgs/U6P52EXEC-04.svg";
import sound1 from "../../assets/unit1/sounds/P17QF.mp3";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Review5_Page1_Q3.css";
const Review5_Page1_Q3 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongImages, setWrongImages] = useState([]);
  const audioRef = useRef(null);
  const correctMatches = [
    { word: "Yes, it is.", image: [""] },
    { word: "No, it isn’t.", image: ["img1", "img2", "img3", "img4"] },
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
    if (!endDot || !endDot.classList.contains("end-dot2-unit2")) {
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
        (pair) => pair.word === line.word && pair.image.includes(line.image)
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.image); // ✅ خزّني اسم صورة الخطأ فقط
      }
    });

    setWrongImages(wrong); // ✅ حفظ الصور الغلط

    const total = 4;
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
          <h5 className="header-title-page8">C Look, read, and match.</h5>

          <div className="match-wrapper2" ref={containerRef}>
            {/* الصور */}
            <div className="match-images-row2">
              <div className="img-box2">
                <div style={{display:"flex",gap:"10px"}}>
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    1
                  </span>
                  <img src={img1} alt="" />
                </div>
                <h5
                  style={{
                    border: "2px solid #2effeaff",
                    borderRadius: "8px",
                    background: "#b7fff8ff",
                    padding: "0px 5px",
                    display: "flex",
                    fontSize: "18px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  Is this a pen?
                </h5>
                {wrongImages.includes("img1") && (
                  <span className="error-mark-img">✕</span>
                )}

                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img1"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>

              <div className="img-box2">
                <div style={{display:"flex",gap:"10px"}}>
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    2
                  </span>
                  <img src={img2} alt="img" />
                </div>
                <h5
                  style={{
                    border: "2px solid #2effeaff",
                    borderRadius: "8px",
                    background: "#b7fff8ff",
                    display: "flex",
                    padding: "0px 5px",
                    fontSize: "18px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  Is this an eraser?
                </h5>
                {wrongImages.includes("img2") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img2"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>

              <div className="img-box2">
                <div style={{display:"flex",gap:"10px"}}>
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    3
                  </span>
                  <img src={img3} alt="" />
                </div>
                <h5
                  style={{
                    border: "2px solid #2effeaff",
                    borderRadius: "8px",
                    background: "#b7fff8ff",
                    padding: "0px 5px",
                    display: "flex",
                    fontSize: "18px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  Is this a chair?
                </h5>
                {wrongImages.includes("img3") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img3"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>
              <div className="img-box2">
                <div style={{display:"flex",gap:"10px"}}>
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    4
                  </span>
                  <img src={img4} alt="" />
                </div>
                <h5
                  style={{
                    border: "2px solid #2effeaff",
                    borderRadius: "8px",
                    background: "#b7fff8ff",
                    padding: "0px 5px",
                    display: "flex",
                    fontSize: "18px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  Is this a desk?
                </h5>
                {wrongImages.includes("img4") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img4"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>
            </div>

            {/* الجمل */}
            <div className="match-words-row2">
              <div className="word-box2-review6-p1-q3">
                <h5
                  style={{
                    border: "2px solid #2effeaff",
                    borderRadius: "8px",
                    background: "#b7fff8ff",
                    fontSize: "18px",
                    display: "flex",
                    padding: "0px 5px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  Yes, it is.
                </h5>
                <div
                  className="dot2-unit2 end-dot2-unit2"
                  data-word="Yes, it is."
                ></div>
              </div>

              <div className="word-box2-review6-p1-q3">
                <h5
                  style={{
                    border: "2px solid #2effeaff",
                    borderRadius: "8px",
                    background: "#b7fff8ff",
                    fontSize: "18px",
                    display: "flex",
                    padding: "0px 5px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  No, it isn’t.
                </h5>
                <div
                  className="dot2-unit2 end-dot2-unit2"
                  data-word="No, it isn’t."
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
    </div>
  );
};

export default Review5_Page1_Q3;
