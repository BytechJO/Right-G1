import React, { useState, useEffect, useRef } from "react";
import "./Review3_Page1_Q2.css";
import table from "../../../assets/unit4/imgs/U4P34EXEB-01.svg";
import dish from "../../../assets/unit4/imgs/U4P34EXEB-02.svg";
import tiger from "../../../assets/unit4/imgs/U4P34EXEB-03.svg";
import duck from "../../../assets/unit4/imgs/U4P34EXEB-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";

const Review3_Page1_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

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

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return;

    const rect = containerRef.current.getBoundingClientRect();

    const word = e.target.dataset.word || null;
    const image = e.target.dataset.image || null;

    const alreadyUsed = lines.some((line) => line.word === word);
    if (alreadyUsed) return;

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
    if (showAnswer || locked) return;
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

  const checkAnswers = () => {
    if (showAnswer || locked) return;

    if (!userInputs[2] || !userInputs[3] || !userInputs[4]) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    if (lines.length < 4) {
      ValidationAlert.info("Oops!", "Please match all pairs before checking.");
      return;
    }

    let sentenceCorrect = 0;
    let lineCorrect = 0;

    let wrongInputsTemp = [];

    Object.keys(correctSentences).forEach((key) => {
      if (key === "1") return;

      const userAnswer = userInputs[key].trim().toLowerCase();
      const correctAnswer = correctSentences[key];

      if (userAnswer === correctAnswer) sentenceCorrect++;
      else wrongInputsTemp.push(key);
    });

    setWrongInputs(wrongInputsTemp);

    let wrongLines = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image
      );

      if (isCorrect) lineCorrect++;
      else wrongLines.push(line.word);
    });

    const totalScore = 7;
    const userScore = sentenceCorrect + lineCorrect;

    setWrongWords([...wrongLines]);
    setLocked(true);

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
                  <span
                    className={`word-text2-review3-p1-q2 ${
                      locked || showAnswer ? "disabled-hover" : ""
                    }`}
                    onClick={() => document.getElementById("dot-open").click()}
                    style={{ cursor: "pointer" }}
                  >
                    your book open.
                  </span>
                  {wrongWords.includes("your book open.") && (
                    <span className="error-mark-review3-p1-q2">✕</span>
                  )}
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      id="dot-open"
                      data-word="your book open."
                      onClick={handleStartDotClick}
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
                  style={{ color: "red" }}
                  readOnly
                />
              </div>

              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div
                    className="dot2 end-dot2"
                    data-image="img1"
                    id="dot-img1"
                    onClick={handleEndDotClick}
                  ></div>
                </div>

                <img
                  src={table}
                   className={`matched-img2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  alt=""
                  onClick={() => document.getElementById("dot-img1").click()}
                  style={{ cursor: "pointer", height: "100px", width: "auto" }}
                />
              </div>
            </div>

            {/* الصف الثاني */}
            <div className="matching-row2">
              <div>
                <div className="word-with-dot2">
                  <span className="span-num2">2</span>
                  <span
                    className={`word-text2-review3-p1-q2 ${
                      locked || showAnswer ? "disabled-hover" : ""
                    }`}
                    onClick={() => document.getElementById("dot-line").click()}
                    style={{ cursor: "pointer" }}
                  >
                    a line make.
                  </span>
                  {wrongWords.includes("a line make.") && (
                    <span className="error-mark-review3-p1-q2">✕</span>
                  )}
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      data-word="a line make."
                      id="dot-line"
                      onClick={handleStartDotClick}
                    ></div>
                  </div>
                </div>

                <input
                  className="unscramble-input"
                  type="text"
                  value={userInputs[2]}
                  onChange={(e) => {
                    setUserInputs((prev) => ({ ...prev, 2: e.target.value }));
                    setWrongInputs([]);
                  }}
                />
                {wrongInputs.includes("2") && (
                  <span className="input-error-x">✕</span>
                )}
              </div>

              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div
                    className="dot2 end-dot2"
                    data-image="img2"
                    id="dot-img2"
                    onClick={handleEndDotClick}
                  ></div>
                </div>

                <img
                  src={dish}
                    className={`matched-img2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  alt=""
                  onClick={() => document.getElementById("dot-img2").click()}
                  style={{ cursor: "pointer", height: "100px", width: "auto" }}
                />
              </div>
            </div>

            {/* الصف الثالث */}
            <div className="matching-row2">
              <div>
                <div className="word-with-dot2">
                  <span className="span-num2">3</span>
                  <span
                    className={`word-text2-review3-p1-q2 ${
                      locked || showAnswer ? "disabled-hover" : ""
                    }`}
                    onClick={() => document.getElementById("dot-close").click()}
                    style={{ cursor: "pointer" }}
                  >
                    close book your.
                  </span>
                  {wrongWords.includes("close book your.") && (
                    <span className="error-mark-review3-p1-q2">✕</span>
                  )}

                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      id="dot-close"
                      data-word="close book your."
                      onClick={handleStartDotClick}
                    ></div>
                  </div>
                </div>

                <input
                  className="unscramble-input"
                  type="text"
                  value={userInputs[3]}
                  onChange={(e) => {
                    setUserInputs((prev) => ({ ...prev, 3: e.target.value }));
                    setWrongInputs([]);
                  }}
                />
                {wrongInputs.includes("3") && (
                  <span className="input-error-x">✕</span>
                )}
              </div>

              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div
                    className="dot2 end-dot2"
                    data-image="img3"
                    id="dot-img3"
                    onClick={handleEndDotClick}
                  ></div>
                </div>

                <img
                  src={duck}
                   className={`matched-img2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  alt=""
                  onClick={() => document.getElementById("dot-img3").click()}
                  style={{ cursor: "pointer", height: "100px", width: "auto" }}
                />
              </div>
            </div>

            {/* الصف الرابع */}
            <div className="matching-row2">
              <div>
                <div className="word-with-dot2">
                  <span className="span-num2">4</span>
                  <span
                    className={`word-text2-review3-p1-q2 ${
                      locked || showAnswer ? "disabled-hover" : ""
                    }`}
                    onClick={() =>
                      document.getElementById("dot-pencil").click()
                    }
                    style={{ cursor: "pointer" }}
                  >
                    pencil take your out.
                  </span>
                  {wrongWords.includes("pencil take your out.") && (
                    <span className="error-mark-review3-p1-q2">✕</span>
                  )}

                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      id="dot-pencil"
                      data-word="pencil take your out."
                      onClick={handleStartDotClick}
                    ></div>
                  </div>
                </div>

                <input
                  className="unscramble-input"
                  type="text"
                  value={userInputs[4]}
                  onChange={(e) => {
                    setUserInputs((prev) => ({ ...prev, 4: e.target.value }));
                    setWrongInputs([]);
                  }}
                />
                {wrongInputs.includes("4") && (
                  <span className="input-error-x">✕</span>
                )}
              </div>

              <div className="img-with-dot2">
                <div className="dot-wrapper2">
                  <div
                    className="dot2 end-dot2"
                    data-image="img4"
                    id="dot-img4"
                    onClick={handleEndDotClick}
                  ></div>
                </div>

                <img
                  src={tiger}
                    className={`matched-img2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  alt=""
                  onClick={() => document.getElementById("dot-img4").click()}
                  style={{ cursor: "pointer", height: "100px", width: "auto" }}
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
              setUserInputs({
                1: "Open your book.",
                2: "",
                3: "",
                4: "",
              });
              setWrongWords([]);
              setWrongInputs([]);
              setShowAnswer(false);
              setLocked(false);
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>

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

              // 1️⃣ إنشاء الخطوط الصحيحة
              const finalLines = correctMatches.map((line) => ({
                ...line,
                x1: getDotPosition(`[data-word="${line.word}"]`).x,
                y1: getDotPosition(`[data-word="${line.word}"]`).y,
                x2: getDotPosition(`[data-image="${line.image}"]`).x,
                y2: getDotPosition(`[data-image="${line.image}"]`).y,
              }));

              setLines(finalLines);

              // 2️⃣ تعبئة جميع الإجابات الصحيحة في inputs
              setUserInputs({
                1: "Open your book.",
                2: correctSentences["2"],
                3: correctSentences["3"],
                4: correctSentences["4"],
              });

              // 3️⃣ منع التعديل على كل شيء (قفل inputs + منع الرسم)
              setLocked(true);
              setShowAnswer(true);
              setWrongWords([]);
              setWrongInputs([]);
            }}
            className="show-answer-btn swal-continue"
          >
            Show Answer
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
