import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page5_Q3.css";
import img from "../../../assets/unit4/imgs/U4P32ExeB.svg";
export default function Unit4_Page5_Q3() {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const [wrongWords, setWrongWords] = useState([]);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  // ⭐⭐⭐ NEW: منع الرسم بعد Check Answer
  const [locked, setLocked] = useState(false);
  const correctMatches = [
    { word1: "It’s a red", word2: "square." },
    { word1: "It’s a blue", word2: "triangle." },
    { word1: "It’s a brown", word2: "circle." },
  ];

  // ==========================
  // ⭐ Click to Connect Logic
  // ==========================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return; // ⭐ NEW: لا تسمح بالرسم عند القفل

    const rect = containerRef.current.getBoundingClientRect();
    const word = e.target.dataset.letter;

    // ⭐⭐⭐ NEW: منع رسم أكثر من خط من نفس الصورة
    const alreadyUsed = lines.some((line) => line.word === word);
    if (alreadyUsed) return;
    // -----------------------------------------------------
    setFirstDot({
      word: e.target.dataset.letter,
      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return; // ⭐ NEW
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

    setFirstDot(null);
  };

  const checkAnswers = () => {
    if (showAnswer || locked) return; // ⭐ NEW: لا يمكن إعادة التحقق
    // 1️⃣ إذا في خطوط ناقصة
    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all pairs before checking."
      );
      return;
    }

    // 2️⃣ حساب عدد التوصيلات الصحيحة
    let correctCount = 0;
    const total = correctMatches.length;
    let wrong = []; // ⭐ تم التعديل هون
    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word1 === line.word && pair.word2 === line.image
      );
      if (isCorrect) correctCount++;
      else wrong.push(line.word); // ⭐ تم التعديل هون
    });

    setWrongWords(wrong); // ⭐ تم التعديل هون
    setLocked(true); // ⭐⭐⭐ NEW: أقفل الرسم بعد الضغط على Check Answer
    // 3️⃣ تحديد اللون حسب النتيجة
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    // 4️⃣ رسالة النتيجة بشكل HTML
    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
       Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    // 5️⃣ اختيار نوع الرسالة
    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ⭐ Show Correct Answers
  const showCorrectAnswers = () => {
    const rect = containerRef.current.getBoundingClientRect();

    // 1️⃣ تجهيز خطوط الإجابة الصحيحة
    const correctLines = correctMatches.map((pair) => {
      const startEl = document.querySelector(
        `.start-dot5[data-letter="${pair.word1}"]`
      );
      const endEl = document.querySelector(
        `.end-dot5[data-image="${pair.word2}"]`
      );

      return {
        x1: startEl.getBoundingClientRect().left - rect.left + 8,
        y1: startEl.getBoundingClientRect().top - rect.top + 8,
        x2: endEl.getBoundingClientRect().left - rect.left + 8,
        y2: endEl.getBoundingClientRect().top - rect.top + 8,
        word: pair.word1,
        image: pair.word2,
      };
    });

    // 2️⃣ وضع الخطوط
    setLines(correctLines);
    setShowAnswer(true);
    setLocked(true); // ⭐ NEW: ممنوع الرسم بعد Show Answer
    // 3️⃣ إخفاء علامات الإكس
    setWrongWords([]);
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
        <h5 className="header-title-page8">
          {" "}
          <span className="ex-A">B</span> Read, look, and match.
        </h5>

        <div className="matching-wrapper2-unit4-p5-q3" ref={containerRef}>
          <img src={img} className="img-unit4-p5-q3" />
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div className="column2 left-column">
              {["It’s a red", "It’s a blue", "It’s a brown"].map((word, i) => (
                <div className="word-row2" key={i}>
                  <span className="num2">{i + 1}</span>
                  <span
                    className={`word-text3 ${
                      locked || showAnswer ? "disabled-hover" : ""
                    }`}
                    onClick={() =>
                      document.getElementById(`dot-${word}`).click()
                    }
                    style={{ width: "160px", cursor: "pointer" }}
                  >
                    {word}
                  </span>
                  <div
                    className="dot5 start-dot5"
                    data-letter={word}
                    id={`dot-${word}`}
                    onClick={handleStartDotClick}
                  ></div>
                  {wrongWords.includes(word) && (
                    <span className="error-mark4-unit4-p5-q3">✕</span>
                  )}
                </div>
              ))}
            </div>

            <div className="column2 right-column">
              {["circle.", "square.", "triangle."].map((word, i) => (
                <div className="word-row2" key={i}>
                  <div
                    className="dot5 end-dot5"
                    data-image={word}
                    id={`dot-${word}`}
                    onClick={handleEndDotClick}
                  ></div>
                  <span
                    className={`word-text3 ${
                      locked || showAnswer ? "disabled-hover" : ""
                    }`}
                    onClick={() =>
                      document.getElementById(`dot-${word}`).click()
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <svg className="lines-layer5">
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
            setLocked(false); // ⭐⭐⭐ NEW: إعادة فتح الرسم
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        <button
          onClick={showCorrectAnswers}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
