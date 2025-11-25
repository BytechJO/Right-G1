import React, { useState, useEffect, useRef } from "react";
import "./Review3_Page1_Q2.css";
import table from "../../assets/unit4/imgs/U4P34EXEB-01.svg";
import dish from "../../assets/unit4/imgs/U4P34EXEB-02.svg";
import tiger from "../../assets/unit4/imgs/U4P34EXEB-03.svg";
import duck from "../../assets/unit4/imgs/U4P34EXEB-04.svg";
import ValidationAlert from "../Popup/ValidationAlert";
const Review3_Page1_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongWords, setWrongWords] = useState([]); // ⭐ تم التعديل هون
  const [wrongInputs, setWrongInputs] = useState([]);
  const correctMatches = [
    { word: "your book open.", image: "img2" },
    { word: "a line make.", image: "img3" },
    { word: "close book your.", image: "img4" },
    { word: "pencil take your out.", image: "img1" },
  ];
  const [userInputs, setUserInputs] = useState({
    1: "Open your book.",
    2: "",
    3: "",
    4: "",
  });
  const correctSentences = {
    1: "open your book.",
    2: "make a line.",
    3: "close your book.",
    4: "take out your pencil.",
  };

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
    // يجب أن يكون الطالب كاتب الثلاث جمل
    if (!userInputs[2] || !userInputs[3] || !userInputs[4]) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    // يجب أن تكون كل الخطوط الأربعة مرسومة
    if (lines.length < 4) {
      ValidationAlert.info("Oops!", "Please match all pairs before checking.");
      return;
    }

    let sentenceCorrect = 0;
    let lineCorrect = 0;

    // فحص الجمل (ما عدا رقم 1)
    let wrongInputs = [];

    Object.keys(correctSentences).forEach((key) => {
      if (key === "1") return;

      const userAnswer = userInputs[key].trim().toLowerCase();
      const correctAnswer = correctSentences[key];

      if (userAnswer === correctAnswer) sentenceCorrect++;
      else wrongInputs.push(key);
    });
    setWrongInputs(wrongInputs);

    // فحص الخطوط
    let wrongLines = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image
      );

      if (isCorrect) lineCorrect++;
      else wrongLines.push(line.word);
    });

    // إجمالي النقاط (كل سؤال 2 نقاط × 4)
    const totalScore = 7;
    const userScore = sentenceCorrect + lineCorrect;

    // لتحديد العلامات الحمراء
    setWrongWords([
      ...wrongLines,
    ]);

    let color =
      userScore === totalScore ? "green" : userScore === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${userScore} / ${totalScore}
      </span>
    </div>
  `;

    if (userScore === totalScore) ValidationAlert.success(scoreMessage);
    else if (userScore === 0) ValidationAlert.error(scoreMessage);
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
        <div className="page8-q1-container">
          <h5 className="header-title-page8">
            {" "}
            B Unscramble, write, and match.
          </h5>

          <div className="container12" ref={containerRef}>
            {/* الصف الأول */}
            <div className="matching-row2">
              <div>
                <div className="word-with-dot2">
                  <span className="span-num2">1</span>
                  <span className="word-text2-review3-p1-q2">
                    your book open.
                  </span>
                  {wrongWords.includes("your book open.") && ( // ⭐ تم التعديل هون
                    <span className="error-mark-review3-p1-q2">✕</span>
                  )}
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      data-letter="your book open."
                      onMouseDown={handleDotDown}
                    ></div>
                  </div>
                </div>
                <input
                  className="unscramble-input"
                  type="text"
                  value={userInputs[1]}
                  onChange={(e) =>
                    setUserInputs((prev) => ({ ...prev, 1: e.target.value }))
                  }
                  style={{color:"red"}}
                  readOnly
                />
              </div>
              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div className="dot2 end-dot2" data-image="img1"></div>
                </div>
                <img
                  src={table}
                  className="matched-img2"
                  alt=""
                  style={{ height: "100px", width: "auto" }}
                />
              </div>
            </div>

            {/* الصف الثاني */}
            <div className="matching-row2">
              <div>
                <div className="word-with-dot2">
                  <span className="span-num2">2</span>
                  <span className="word-text2-review3-p1-q2">a line make.</span>
                  {wrongWords.includes("a line make.") && ( // ⭐ تم التعديل هون
                    <span className="error-mark-review3-p1-q2">✕</span>
                  )}
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      data-letter="a line make."
                      onMouseDown={handleDotDown}
                    ></div>
                  </div>
                </div>
                <input
                  className="unscramble-input"
                  type="text"
                  value={userInputs[2]}
                  onChange={(e) =>
                    setUserInputs((prev) => ({ ...prev, 2: e.target.value }))
                  }
                />
                {wrongInputs.includes("2") && (
                  <span className="input-error-x">✕</span>
                )}
              </div>
              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div className="dot2 end-dot2" data-image="img2"></div>
                </div>
                <img
                  src={dish}
                  className="matched-img2"
                  alt=""
                  style={{ height: "100px",width: "auto" }}
                />
              </div>
            </div>

            {/* الصف الثالث */}
            <div className="matching-row2">
              <div>
                <div className="word-with-dot2">
                  <span className="span-num2">3</span>
                  <span className="word-text2-review3-p1-q2">
                    close book your.
                  </span>
                  {wrongWords.includes("close book your.") && ( // ⭐ تم التعديل هون
                    <span className="error-mark-review3-p1-q2">✕</span>
                  )}
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      data-letter="close book your."
                      onMouseDown={handleDotDown}
                    ></div>
                  </div>
                </div>
                <input
                  className="unscramble-input"
                  type="text"
                  value={userInputs[3]}
                  onChange={(e) =>
                    setUserInputs((prev) => ({ ...prev, 3: e.target.value }))
                  }
                />
                {wrongInputs.includes("3") && (
                  <span className="input-error-x">✕</span>
                )}
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
              <div>
                <div className="word-with-dot2">
                  <span className="span-num2">4</span>
                  <span className="word-text2-review3-p1-q2">
                    pencil take your out.
                  </span>
                  {wrongWords.includes("pencil take your out.") && ( // ⭐ تم التعديل هون
                    <span className="error-mark-review3-p1-q2">✕</span>
                  )}
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      data-letter="pencil take your out."
                      onMouseDown={handleDotDown}
                    ></div>
                  </div>
                </div>
                <input
                  className="unscramble-input"
                  type="text"
                  value={userInputs[4]}
                  onChange={(e) =>
                    setUserInputs((prev) => ({ ...prev, 4: e.target.value }))
                  }
                />
                {wrongInputs.includes("4") && (
                  <span className="input-error-x">✕</span>
                )}
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

export default Review3_Page1_Q2;
