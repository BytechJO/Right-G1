import React, { useState, useEffect, useRef } from "react";
import "./WB_Unit9_Page2_Q2.css";
import table from "../../../assets/U1 WB/U9/U9P52EXED-01.svg";
import dish from "../../../assets/U1 WB/U9/U9P52EXED-02.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit9_Page2_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const correctMatches = [
    { word: "likes/she/chickens", image: "img2" },
    { word: "cows/like/I", image: "img1" },
  ];

  const [userInputs, setUserInputs] = useState({
    1: [], // كلمات مرتبة
    2: [],
  });

  const correctSentences = {
    1: "She likes chickens",
    2: "I like cows",
  };

  const scrambledWords = {
    1: ["likes", "she", "chickens"],
    2: ["cows", "like", "I"],
  };

  const onDragEnd = (result) => {
    if (!result.destination || locked || showAnswer) return;

    const { source, destination, draggableId } = result;

    const qId = source.droppableId.replace("bank-", "");

    // فقط داخل نفس الجملة
    if (destination.droppableId !== `drop-${qId}`) return;

    setUserInputs((prev) => {
      const copy = [...prev[qId]];

      const existingIndex = copy.indexOf(draggableId);
      if (existingIndex !== -1) copy.splice(existingIndex, 1);

      // ⬅️ دايمًا أضف في النهاية
      copy.push(draggableId);

      return { ...prev, [qId]: copy };
    });

    setWrongInputs([]);
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

    if (!userInputs[1] || !userInputs[2]) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    if (lines.length < 2) {
      ValidationAlert.info("Oops!", "Please match all pairs before checking.");
      return;
    }

    let sentenceCorrect = 0;
    let lineCorrect = 0;

    let wrongInputsTemp = [];

    Object.keys(correctSentences).forEach((key) => {
      const userAnswer = userInputs[key].join(" ").toLowerCase();

      const correctAnswer = correctSentences[key];

      if (userAnswer === correctAnswer) sentenceCorrect++;
      else wrongInputsTemp.push(key);
    });

    setWrongInputs(wrongInputsTemp);

    let wrongLines = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) lineCorrect++;
      else wrongLines.push(line.word);
    });

    const totalScore = 4;
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
    <DragDropContext onDragEnd={onDragEnd}>
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
            <h4 className="header-title-page8">
              <span className="ex-A">D</span> Unscramble, write, and match.
            </h4>

            <div className="container12-wb-unit9-p2-q1" ref={containerRef}>
              {/* الصف الأول */}
              <div className="matching-row2">
                <div>
                  <div className="word-with-dot2">
                    <span className="span-num2-wb-unit7-p2-q1">1</span>
                    <div>
                      <span
                        className={`word-text2-review3-p1-q2 ${
                          locked || showAnswer ? "disabled-word" : ""
                        }`}
                        onClick={() =>
                          document.getElementById("dot-open").click()
                        }
                        style={{ cursor: "pointer" }}
                      >
                        likes/she/chickens
                      </span>
                      {wrongWords.includes("likes/she/chickens") && (
                        <span className="error-mark-review3-p1-q2">✕</span>
                      )}
                      <Droppable droppableId="bank-1" direction="horizontal">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              display: "flex",
                              gap: "12px",
                              padding: "10px",
                              border: "2px dashed #ccc",
                              borderRadius: "10px",
                              marginBottom: "20px",
                              justifyContent: "center",
                            }}
                          >
                            {scrambledWords[1].map((w, i) => (
                              <Draggable key={w} draggableId={w} index={i} isDragDisabled={locked}>
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      borderRadius: "8px",
                                      border: "2px solid #2c5287",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "bold",
                                      cursor: "grab",
                                      background: "white",
                                      padding: "5px",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {w}
                                  </span>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                    <div className="dot-wrapper2">
                      <div
                        className="dot2 start-dot2"
                        id="dot-open"
                        data-word="likes/she/chickens"
                        onClick={handleStartDotClick}
                      ></div>
                    </div>
                  </div>

                  <Droppable droppableId="drop-1" direction="horizontal" isDropDisabled={locked}>
                    {(provided ,snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      className={`unscramble-input-wb-unit9-p2-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {userInputs[1].join(" ")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {wrongInputs.includes("1") && (
                    <span className="input-error-x-wb-unit9-p2-q1">✕</span>
                  )}
                </div>

                <div className="img-with-dot2-wb-unit7-p2-q1">
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
                    style={{
                      cursor: "pointer",
                      height: "130px",
                      width: "auto",
                    }}
                  />
                </div>
              </div>

              {/* الصف الثاني */}
              <div className="matching-row2">
                <div>
                  <div className="word-with-dot2">
                    <span className="span-num2-wb-unit7-p2-q1">2</span>
                    <div>
                      <span
                        className={`word-text2-review3-p1-q2 ${
                          locked || showAnswer ? "disabled-word" : ""
                        }`}
                        onClick={() =>
                          document.getElementById("dot-line").click()
                        }
                        style={{ cursor: "pointer" }}
                      >
                        cows/like/I
                      </span>
                      {wrongWords.includes("cows/like/I") && (
                        <span className="error-mark-review3-p1-q2">✕</span>
                      )}

                      <Droppable droppableId="bank-2" direction="horizontal" isDropDisabled={locked}>
                        {(provided ,snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              display: "flex",
                              gap: "12px",
                              padding: "10px",
                              border: "2px dashed #ccc",
                              borderRadius: "10px",
                              marginBottom: "20px",
                              justifyContent: "center",
                            }}
                          >
                            {scrambledWords[2].map((w, i) => (
                              <Draggable key={w} draggableId={w} index={i}>
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      borderRadius: "8px",
                                      border: "2px solid #2c5287",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "bold",
                                      cursor: "grab",
                                      background: "white",
                                      padding: "5px",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {w}
                                  </span>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                    <div className="dot-wrapper2">
                      <div
                        className="dot2 start-dot2"
                        data-word="cows/like/I"
                        id="dot-line"
                        onClick={handleStartDotClick}
                      ></div>
                    </div>
                  </div>

                  <Droppable droppableId="drop-2" direction="horizontal">
                    {(provided ,snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`unscramble-input-wb-unit9-p2-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {userInputs[2].join(" ")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {wrongInputs.includes("2") && (
                    <span className="input-error-x-wb-unit9-p2-q1">✕</span>
                  )}
                </div>

                <div className="img-with-dot2-wb-unit7-p2-q1">
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
                    style={{
                      cursor: "pointer",
                      height: "130px",
                      width: "auto",
                    }}
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
                  1: [], // كلمات مرتبة
                  2: [],
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
                  1: ["She", "likes", "chickens"],
                  2: ["I", "like", "cows"],
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
    </DragDropContext>
  );
};

export default WB_Unit9_Page2_Q2;
