import React, { useRef, useState } from "react";
import img1 from "../../../assets/unit10/imgs/U10P89EXEF-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P89EXEF-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P89EXEF-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P89EXEF-04.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Review9_Page2_Q3.css";
import ValidationAlert from "../../Popup/ValidationAlert";

export default function Review9_Page2_Q3() {
  // ============================
  // 🔹 CORRECT ANSWERS (المصدر الوحيد)
  // ============================
  const correctMatches = [
    { word: "nest", image: "img4" },
    { word: "nurse", image: "img2" },
    { word: "night", image: "img3" },
    { word: "man", image: "img1" },
  ];

  const imagesMap = [img1, img2, img3, img4];

  // ============================
  // 🔹 STATES
  // ============================
  const [lines, setLines] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [firstDot, setFirstDot] = useState(null);
  const [locked, setLocked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [letters, setLetters] = useState({});
  const [wrongLetters, setWrongLetters] = useState([]);
  const [wrongConnections, setWrongConnections] = useState([]);
  const containerRef = useRef(null);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked || showAnswer) return;

    const value = draggableId.replace("char-", "");
    const word = destination.droppableId.replace("letter-", "");

    setLetters((prev) => {
      const updated = { ...prev };
      updated[word] = value;
      return updated;
    });

    setWrongLetters([]);
  };

  // ============================
  // 1️⃣ Start dot
  // ============================
  const handleStartDotClick = (e) => {
    if (locked || showAnswer) return;

    const word = e.target.dataset.word;
    if (lines.some((l) => l.word === word)) return;

    const rect = containerRef.current.getBoundingClientRect();
    const r = e.target.getBoundingClientRect();

    setFirstDot({
      word,
      x: r.left - rect.left + 8,
      y: r.top - rect.top + 8,
    });
  };

  // ============================
  // 2️⃣ End dot
  // ============================
  const handleEndDotClick = (e) => {
    if (!firstDot || locked || showAnswer) return;

    const rect = containerRef.current.getBoundingClientRect();
    const r = e.target.getBoundingClientRect();

    setLines((prev) => [
      ...prev,
      {
        word: firstDot.word,
        image: e.target.dataset.image,
        x1: firstDot.x,
        y1: firstDot.y,
        x2: r.left - rect.left + 8,
        y2: r.top - rect.top + 8,
      },
    ]);

    setFirstDot(null);
  };

  // ============================
  // 3️⃣ Check Answers
  // ============================
  const checkAnswers = () => {
    if (locked) return;
    // =========================
    // 1️⃣ فحص الـ inputs (ولا واحد فاضي)
    // =========================
    for (const item of correctMatches) {
      if (!letters[item.word] || letters[item.word].trim() === "") {
        ValidationAlert.info("Please fill in all the letters.");
        return;
      }
    }

    // =========================
    // 2️⃣ فحص توصيل كل كلمة
    // =========================
    for (const item of correctMatches) {
      const hasLine = lines.some((l) => l.word === item.word);
      if (!hasLine) {
        ValidationAlert.info("Please connect all the words to pictures.");
        return;
      }
    }

    // =========================
    // 3️⃣ فحص توصيل كل صورة (ما في صورة مكررة)
    // =========================
    const usedImages = lines.map((l) => l.image);
    const uniqueImages = new Set(usedImages);

    if (uniqueImages.size < correctMatches.length) {
      ValidationAlert.info("Please connect each picture to only one word.");
      return;
    }

    // =========================
    // 4️⃣ التصحيح (8 نقاط)
    // =========================
    let score = 0;
    let wrongL = [];
    let wrongC = [];

    correctMatches.forEach((item) => {
      const line = lines.find((l) => l.word === item.word);

      const letterCorrect = letters[item.word] === item.word[0];
      const imageCorrect = line && line.image === item.image;

      // حساب السكور
      if (letterCorrect) score += 1;
      if (imageCorrect) score += 1;

      // تحديد أماكن الغلط
      if (!letterCorrect) wrongL.push(item.word);
      if (!imageCorrect) wrongC.push(item.word);
    });

    setWrongLetters(wrongL);
    setWrongConnections(wrongC);
    setLocked(true);

    const totalScore = correctMatches.length * 2;

    const color =
      score === totalScore ? "green" : score === 0 ? "red" : "orange";

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold">
        Score: ${score} / ${totalScore}
      </span>
    </div>
  `;

    score === totalScore
      ? ValidationAlert.success(msg)
      : score === 0
        ? ValidationAlert.error(msg)
        : ValidationAlert.warning(msg);
  };

  // ============================
  // 👁 Show Answer
  // ============================
  const showCorrectAnswer = () => {
    const rect = containerRef.current.getBoundingClientRect();

    const getPos = (id) => {
      const el = document.getElementById(id);
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - rect.left + 8,
        y: r.top - rect.top + 8,
      };
    };

    const finalLines = correctMatches.map((item) => ({
      word: item.word,
      image: item.image,
      x1: getPos(`${item.word}-dot`).x,
      y1: getPos(`${item.word}-dot`).y,
      x2: getPos(`${item.image}-dot`).x,
      y2: getPos(`${item.image}-dot`).y,
    }));

    setLines(finalLines);
    setWrongWords([]);
    const filledLetters = {};

    correctMatches.forEach((item) => {
      filledLetters[item.word] = item.word[0];
    });

    setLetters(filledLetters);

    setLocked(true);
    setShowAnswer(true);
    setResetKey((k) => k + 1);
  };

  // ============================
  // 🔄 Reset
  // ============================
  const reset = () => {
    setLines([]);
    setWrongWords([]);
    setFirstDot(null);
    setLetters({});
    setLocked(false);
    setShowAnswer(false);
    setResetKey((k) => k + 1);
  };

  // ============================
  // 🔹 JSX
  // ============================
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="matching-wrapper" style={{ padding: "30px" }}>
        <div className="matching-scale">
          <h5 className="header-title-page8">F Read, write, and match.</h5>
          <Droppable
            droppableId="letters-bank"
            isDropDisabled={locked || showAnswer}
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {["m", "n"].map((char, index) => (
                  <Draggable
                    key={char}
                    draggableId={`char-${char}`}
                    index={index}
                    isDragDisabled={locked || showAnswer}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "7px 14px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
                          cursor: "grab",
                          fontSize:"22px",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {char}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div key={resetKey} className="container1" ref={containerRef}>
            {correctMatches.map((item, index) => (
              <div className="matching-row-review9-p2-q3" key={item.word}>
                <div className={`word-with-dot `}>
                  <div
                    onClick={() =>
                      document.getElementById(`${item.word}-dot`).click()
                    }
                    className={`word-with-dot-review9-p2-q3  ${
                      locked || showAnswer ? "disabled-hover" : ""
                    }`}
                    style={{
                      position: "relative",
                      width: "90px",
                      display: "flex",
                    }}
                  >
                    <span className="span-num">{index + 1}</span>

                    <Droppable
                      droppableId={`letter-${item.word}`}
                      isDropDisabled={locked || showAnswer}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`letter-input-review9-p2-q3 ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                        >
                          {letters[item.word] && (
                            <Draggable
                              draggableId={`filled-${letters[item.word]}-${item.word}`}
                              index={0}
                              isDragDisabled
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {letters[item.word]}
                                </span>
                              )}
                            </Draggable>
                          )}

                          {provided.placeholder}

                          {!showAnswer &&
                            locked &&
                            wrongLetters.includes(item.word) && (
                              <span className="error-mark-review9-p2-q3">
                                ✕
                              </span>
                            )}
                        </div>
                      )}
                    </Droppable>

                    {!showAnswer &&
                      locked &&
                      wrongLetters.includes(item.word) && (
                        <span
                          className="error-mark-review9-p2-q3"
                          style={{ top: "-3px", left: "25%" }}
                        >
                          ✕
                        </span>
                      )}

                    <span style={{ fontSize: "20px", fontWeight: "500" }}>
                      {item.word.slice(1)}

                      {!showAnswer &&
                        locked &&
                        wrongConnections.includes(item.word) && (
                          <span className="error-mark-review9-p2-q3">✕</span>
                        )}
                    </span>
                  </div>
                  <div className="dot-wrapper">
                    <div
                      className="dot start-dot"
                      id={`${item.word}-dot`}
                      data-word={item.word}
                      onClick={handleStartDotClick}
                    />
                  </div>
                </div>

                <div className="img-with-dot">
                  <div className="dot-wrapper">
                    <div
                      className="dot end-dot"
                      id={`img${index + 1}-dot`}
                      data-image={`img${index + 1}`}
                      onClick={handleEndDotClick}
                    />
                  </div>
                  <img
                    src={imagesMap[index]}
                    className="matched-img"
                    style={{ height: "100px" }}
                    alt=""
                    onClick={() =>
                      document.getElementById(`img${index + 1}-dot`).click()
                    }
                  />
                </div>
              </div>
            ))}

            <svg className="lines-layer">
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
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={showCorrectAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
}
