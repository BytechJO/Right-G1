import React, { useState, useEffect, useRef } from "react";
import "./WB_Unit7_Page2_Q1.css";
import table from "../../../assets/unit4/imgs/U4P34EXEB-01.svg";
import dish from "../../../assets/unit4/imgs/U4P34EXEB-02.svg";
import tiger from "../../../assets/unit4/imgs/U4P34EXEB-03.svg";
import duck from "../../../assets/unit4/imgs/U4P34EXEB-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit7_Page2_Q1 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination || locked || showAnswer) return;

    const [qId, word] = result.draggableId.split("-");
    const dest = result.destination.droppableId;

    if (!dest.startsWith("sentence-")) return;

    setUserInputs((prev) => ({
      ...prev,
      [qId]: [...prev[qId].filter((w) => w !== word), word],
    }));
  };

  const [userInputs, setUserInputs] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });
  const correctMatches = [
    { word: "you/happy/Are ?", image: "Are you happy?" },
    { word: "the/matter/What’s ?", image: "What’s the matter?" },
    { word: "bored/I’m .", image: "I’m bored." },
    { word: "sad/you/Are ?", image: "Are you sad?" },
    { word: "hungry/you/Are ?", image: "Are you hungry?" },
    { word: "cold/I’m .", image: "I’m cold." },
  ];
  const correctSentences = {
    1: "Are you happy?",
    2: "What’s the matter?",
    3: "I’m bored.",
    4: "Are you sad?",
    5: "Are you hungry?",
    6: "I’m cold.",
  };

  const scrambledWords = {
    1: ["you", "happy", "Are", "?"],
    2: ["the", "matter", "What’s", "?"],
    3: ["bored", "I’m", "."],
    4: ["sad", "you", "Are", "?"],
    5: ["hungry", "you", "Are", "?"],
    6: ["cold", "I’m", "."],
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
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <div className="page8-q1-container">
            <h4 className="header-title-page8">
              <span className="ex-A">C</span> Unscramble, write, and match.
            </h4>

            <div
              className="container12"
              ref={containerRef}
              // style={{ margin: "30px" }}
            >
              {/* الصف الأول */}
              <div className="matching-row2">
                <div>
                  <div className="word-with-dot2">
                    <span className="span-num2-wb-unit7-p2-q1">1</span>
                    <span
                      className={`word-text2-wb-unit7-p2-q1 ${
                        locked || showAnswer ? "disabled-word" : ""
                      }`}
                      onClick={() =>
                        document.getElementById("dot-open").click()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      you/happy/Are ?
                    </span>
                    {wrongWords.includes("you/happy/Are ?") && (
                      <span className="error-mark-review3-p1-q2">✕</span>
                    )}
                    <div className="dot-wrapper2">
                      <div
                        className="dot2 start-dot2"
                        id="dot-open"
                        data-word="you/happy/Are ?"
                        onClick={handleStartDotClick}
                      ></div>
                    </div>
                  </div>
                  <Droppable droppableId="bank-1" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="word-bank-wb-unit7-p2-q1"
                      >
                        {scrambledWords[1]
                          .filter((w) => !userInputs[1].includes(w))
                          .map((word, i) => (
                            <Draggable
                              key={word}
                              draggableId={`1-${word}`}
                              index={i}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="word-box-wb-unit7-p2-q1"
                                  style={{
                                    textAlign: "center",
                                    cursor: "grab",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {word}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="sentence-1" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`unscramble-input-wb-unit7-p2-q1 ${
                          snapshot.isDraggingOver ? "active-drop" : ""
                        }`}
                      >
                        {userInputs[1].join(" ")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="img-with-dot2-wb-unit7-p2-q1">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      data-image="I’m bored."
                      id="dot-img1"
                      onClick={handleEndDotClick}
                    ></div>
                  </div>

                  <p
                    className={`matched-word-wb-unit7-p2-q1 ${
                      locked || showAnswer ? "disabled-word" : ""
                    }`}
                    onClick={() => document.getElementById("dot-img1").click()}
                  >
                    I’m bored.
                  </p>
                </div>
              </div>

              {/* الصف الثاني */}
              <div className="matching-row2">
                <div>
                  <div className="word-with-dot2">
                    <span className="span-num2-wb-unit7-p2-q1">2</span>
                    <span
                      className={`word-text2-wb-unit7-p2-q1 ${
                        locked || showAnswer ? "disabled-word" : ""
                      }`}
                      onClick={() =>
                        document.getElementById("dot-line").click()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      the/matter/What’s ?
                    </span>
                    {wrongWords.includes("the/matter/What’s ?") && (
                      <span className="error-mark-review3-p1-q2">✕</span>
                    )}
                    <div className="dot-wrapper2">
                      <div
                        className="dot2 start-dot2"
                        data-word="the/matter/What’s ?"
                        id="dot-line"
                        onClick={handleStartDotClick}
                      ></div>
                    </div>
                  </div>
                  <Droppable droppableId="bank-2" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="word-bank-wb-unit7-p2-q1"
                      >
                        {scrambledWords[2]
                          .filter((w) => !userInputs[2].includes(w))
                          .map((word, i) => (
                            <Draggable
                              key={word}
                              draggableId={`2-${word}`}
                              index={i}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="word-box-wb-unit7-p2-q1"
                                  style={{
                                    textAlign: "center",
                                    cursor: "grab",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {word}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="sentence-2" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`unscramble-input-wb-unit7-p2-q1 ${
                          snapshot.isDraggingOver ? "active-drop" : ""
                        }`}
                      >
                        {userInputs[2].join(" ")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="img-with-dot2-wb-unit7-p2-q1">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      data-image="Are you hungry?"
                      id="dot-img2"
                      onClick={handleEndDotClick}
                    ></div>
                  </div>

                  <p
                    className={`matched-word-wb-unit7-p2-q1 ${
                      locked || showAnswer ? "disabled-word" : ""
                    }`}
                    onClick={() => document.getElementById("dot-img2").click()}
                  >
                    Are you hungry?
                  </p>
                </div>
              </div>

              {/* الصف الثالث */}
              <div className="matching-row2">
                <div>
                  <div className="word-with-dot2">
                    <span className="span-num2-wb-unit7-p2-q1">3</span>
                    <span
                      className={`word-text2-wb-unit7-p2-q1 ${
                        locked || showAnswer ? "disabled-word" : ""
                      }`}
                      onClick={() =>
                        document.getElementById("dot-close").click()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      bored/I’m .
                    </span>
                    {wrongWords.includes("bored/I’m .") && (
                      <span className="error-mark-review3-p1-q2">✕</span>
                    )}

                    <div className="dot-wrapper2">
                      <div
                        className="dot2 start-dot2"
                        id="dot-close"
                        data-word="bored/I’m ."
                        onClick={handleStartDotClick}
                      ></div>
                    </div>
                  </div>
                  <Droppable droppableId="bank-3" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="word-bank-wb-unit7-p2-q1"
                      >
                        {scrambledWords[3]
                          .filter((w) => !userInputs[3].includes(w))
                          .map((word, i) => (
                            <Draggable
                              key={word}
                              draggableId={`3-${word}`}
                              index={i}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="word-box-wb-unit7-p2-q1"
                                  style={{
                                    textAlign: "center",
                                    cursor: "grab",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {word}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="sentence-3" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`unscramble-input-wb-unit7-p2-q1 ${
                          snapshot.isDraggingOver ? "active-drop" : ""
                        }`}
                      >
                        {userInputs[3].join(" ")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="img-with-dot2-wb-unit7-p2-q1">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      data-image="I’m cold."
                      id="dot-img3"
                      onClick={handleEndDotClick}
                    ></div>
                  </div>

                  <p
                    className={`matched-word-wb-unit7-p2-q1 ${
                      locked || showAnswer ? "disabled-word" : ""
                    }`}
                    onClick={() => document.getElementById("dot-img3").click()}
                  >
                    I’m cold.
                  </p>
                </div>
              </div>

              {/* الصف الرابع */}
              <div className="matching-row2">
                <div>
                  <div className="word-with-dot2">
                    <span className="span-num2-wb-unit7-p2-q1">4</span>
                    <span
                      className={`word-text2-wb-unit7-p2-q1 ${
                        locked || showAnswer ? "disabled-word" : ""
                      }`}
                      onClick={() =>
                        document.getElementById("dot-pencil").click()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      sad/you/Are ?
                    </span>
                    {wrongWords.includes("sad/you/Are ?") && (
                      <span className="error-mark-review3-p1-q2">✕</span>
                    )}

                    <div className="dot-wrapper2">
                      <div
                        className="dot2 start-dot2"
                        id="dot-pencil"
                        data-word="sad/you/Are ?"
                        onClick={handleStartDotClick}
                      ></div>
                    </div>
                  </div>
                  <Droppable droppableId="bank-4" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="word-bank-wb-unit7-p2-q1"
                      >
                        {scrambledWords[4]
                          .filter((w) => !userInputs[4].includes(w))
                          .map((word, i) => (
                            <Draggable
                              key={word}
                              draggableId={`4-${word}`}
                              index={i}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="word-box-wb-unit7-p2-q1"
                                  style={{
                                    textAlign: "center",
                                    cursor: "grab",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {word}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="sentence-4" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`unscramble-input-wb-unit7-p2-q1 ${
                          snapshot.isDraggingOver ? "active-drop" : ""
                        }`}
                      >
                        {userInputs[4].join(" ")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="img-with-dot2-wb-unit7-p2-q1">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      data-image="What’s the matter?"
                      id="dot-img4"
                      onClick={handleEndDotClick}
                    ></div>
                  </div>

                  <p
                    src={tiger}
                    className={`matched-word-wb-unit7-p2-q1 ${
                      locked || showAnswer ? "disabled-word" : ""
                    }`}
                    alt=""
                    onClick={() => document.getElementById("dot-img4").click()}
                  >
                    What’s the matter?
                  </p>
                </div>
              </div>

              {/* الصف الخامس */}
              <div className="matching-row2">
                <div>
                  <div className="word-with-dot2">
                    <span className="span-num2-wb-unit7-p2-q1">5</span>
                    <span
                      className={`word-text2-wb-unit7-p2-q1 ${
                        locked || showAnswer ? "disabled-word" : ""
                      }`}
                      onClick={() =>
                        document.getElementById("dot-hungry").click()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      hungry/you/Are ?
                    </span>
                    {wrongWords.includes("hungry/you/Are ?") && (
                      <span className="error-mark-review3-p1-q2">✕</span>
                    )}

                    <div className="dot-wrapper2">
                      <div
                        className="dot2 start-dot2"
                        id="dot-hungry"
                        data-word="hungry/you/Are ?"
                        onClick={handleStartDotClick}
                      ></div>
                    </div>
                  </div>
                  <Droppable droppableId="bank-5" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="word-bank-wb-unit7-p2-q1"
                      >
                        {scrambledWords[5]
                          .filter((w) => !userInputs[5].includes(w))
                          .map((word, i) => (
                            <Draggable
                              key={word}
                              draggableId={`5-${word}`}
                              index={i}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="word-box-wb-unit7-p2-q1"
                                  style={{
                                    textAlign: "center",
                                    cursor: "grab",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {word}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="sentence-5" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`unscramble-input-wb-unit7-p2-q1 ${
                          snapshot.isDraggingOver ? "active-drop" : ""
                        }`}
                      >
                        {userInputs[5].join(" ")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="img-with-dot2-wb-unit7-p2-q1">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      data-image="Are you happy?"
                      id="dot-img5"
                      onClick={handleEndDotClick}
                    ></div>
                  </div>

                  <p
                    src={tiger}
                    className={`matched-word-wb-unit7-p2-q1 ${
                      locked || showAnswer ? "disabled-word" : ""
                    }`}
                    alt=""
                    onClick={() => document.getElementById("dot-img5").click()}
                  >
                    Are you happy?
                  </p>
                </div>
              </div>

              {/* الصف السادس */}
              <div className="matching-row2">
                <div>
                  <div className="word-with-dot2">
                    <span className="span-num2-wb-unit7-p2-q1">6</span>
                    <span
                      className={`word-text2-wb-unit7-p2-q1 ${
                        locked || showAnswer ? "disabled-word" : ""
                      }`}
                      onClick={() =>
                        document.getElementById("dot-cold").click()
                      }
                      style={{ cursor: "pointer" }}
                    >
                      cold/I’m .
                    </span>
                    {wrongWords.includes("cold/I’m .") && (
                      <span className="error-mark-review3-p1-q2">✕</span>
                    )}

                    <div className="dot-wrapper2">
                      <div
                        className="dot2 start-dot2"
                        id="dot-cold"
                        data-word="cold/I’m ."
                        onClick={handleStartDotClick}
                      ></div>
                    </div>
                  </div>
                  <Droppable droppableId="bank-6" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="word-bank-wb-unit7-p2-q1"
                      >
                        {scrambledWords[6]
                          .filter((w) => !userInputs[6].includes(w))
                          .map((word, i) => (
                            <Draggable
                              key={word}
                              draggableId={`6-${word}`}
                              index={i}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="word-box-wb-unit7-p2-q1"
                                  style={{
                                    textAlign: "center",
                                    cursor: "grab",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {word}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="sentence-6" direction="horizontal">
                    {(provided ,snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`unscramble-input-wb-unit7-p2-q1 ${
                          snapshot.isDraggingOver ? "active-drop" : ""
                        }`}
                      >
                        {userInputs[6].join(" ")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="img-with-dot2-wb-unit7-p2-q1">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      data-image="Are you sad?"
                      id="dot-img6"
                      onClick={handleEndDotClick}
                    ></div>
                  </div>

                  <p
                    src={tiger}
                    className={`matched-word-wb-unit7-p2-q1 ${
                      locked || showAnswer ? "disabled-word" : ""
                    }`}
                    alt=""
                    onClick={() => document.getElementById("dot-img6").click()}
                  >
                    Are you sad?
                  </p>
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
                  1: [],
                  2: [],
                  3: [],
                  4: [],
                  5: [],
                  6: [],
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
                  1: correctSentences["1"].split(" "),
                  2: correctSentences["2"].split(" "),
                  3: correctSentences["3"].split(" "),
                  4: correctSentences["4"].split(" "),
                  5: correctSentences["5"].split(" "),
                  6: correctSentences["6"].split(" "),
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

export default WB_Unit7_Page2_Q1;
