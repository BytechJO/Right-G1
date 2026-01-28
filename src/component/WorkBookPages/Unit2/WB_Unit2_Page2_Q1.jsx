import React, { useState, useEffect, useRef } from "react";
import "./WB_Unit2_Page2_Q1.css";
import table from "../../../assets/U1 WB/U2/U2P10EXEC-01.svg";
import dish from "../../../assets/U1 WB/U2/U2P10EXEC-02.svg";
import tiger from "../../../assets/U1 WB/U2/U2P10EXEC-03.svg";
import duck from "../../../assets/U1 WB/U2/U2P10EXEC-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit2_Page2_Q1 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [userInputs, setUserInputs] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const scrambledWords = {
    1: ["birthday", "Happy", "!"],
    2: ["a", "hat", "party", "It's", "."],
    3: ["are", "How", "you", "old", "?"],
    4: ["seven", "I'm", "years", "old", "."],
  };

  const onDragEnd = (result) => {
    if (!result.destination || locked || showAnswer) return;

    const { draggableId, destination } = result;

    // ✅ نسمح بالدروب فقط على الإنبت
    if (!destination.droppableId.startsWith("blank-")) return;

    const draggedSentence = draggableId.split("-")[0];
    const targetSentence = destination.droppableId.replace("blank-", "");

    // ❌ منع النقل بين جمل مختلفة
    if (draggedSentence !== targetSentence) return;

    const word = draggableId.split("-").slice(1, -1).join("-");

    setUserInputs((prev) => {
      const updated = { ...prev };

      const wordsInSentence = updated[targetSentence]
        ? updated[targetSentence].split(" ")
        : [];

      // ❌ منع تكرار الكلمة بنفس الجملة
      if (wordsInSentence.includes(word)) return prev;

      updated[targetSentence] = wordsInSentence.length
        ? `${updated[targetSentence]} ${word}`
        : word;

      return updated;
    });

    setWrongInputs([]);
  };

  const correctSentences = {
    1: "Happy birthday",
    2: "It's a party hat",
    3: "How old are you",
    4: "I'm seven years old",
  };

  const checkAnswers = () => {
    if (showAnswer || locked) return;

    if (!userInputs[1] || !userInputs[2] || !userInputs[3] || !userInputs[4]) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    let sentenceCorrect = 0;
    // let lineCorrect = 0;

    let wrongInputsTemp = [];

    Object.keys(correctSentences).forEach((key) => {
      const userAnswer = userInputs[key].trim().toLowerCase();
      const correctAnswer = correctSentences[key].toLowerCase();

      if (userAnswer === correctAnswer) sentenceCorrect++;
      else wrongInputsTemp.push(key);
    });

    setWrongInputs(wrongInputsTemp);

    const totalScore = Object.keys(correctSentences).length;

    const userScore = sentenceCorrect;

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
            <h5 className="header-title-page8">
              {" "}
              <span className="ex-A">C</span> Unscramble and write.
            </h5>

            <div className="container12" ref={containerRef}>
              {/* الصف الأول */}
              <div className="matching-row2">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  {" "}
                  <div className="img-with-dot2">
                    {" "}
                    <span className="span-num2">1</span>
                    <img
                      src={table}
                      alt=""
                      style={{
                        cursor: "pointer",
                        height: "100px",
                        width: "auto",
                      }}
                    />
                  </div>
                  <div className="word-with-dot2-wb-u2-p2-q1">
                    <div className="word-bank-container-wb-u2-p2-q1">
                      <span className="word-text2-wb-u2-p2-q1">
                        birthday Happy !
                      </span>

                      <Droppable droppableId="bank-1" direction="horizontal">
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
                              alignItems: "center", width:"300px",
                              justifyContent:"center"
                            }}
                          >
                            {scrambledWords[1].map((word, i) => (
                              <Draggable
                                key={`1-${word}-${i}`}
                                draggableId={`1-${word}-${i}`}
                                index={i}
                                isDragDisabled={showAnswer || locked}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      padding: "2px 5px",
                                      border: "2px solid #2c5287",
                                      borderRadius: "8px",
                                      background: "white",
                                      fontWeight: "bold",
                                      cursor: "grab",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {word}
                                  </span>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                    <Droppable droppableId="blank-1">
                      {(provided, snapshot) => (
                        <input
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`unscramble-input ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          value={userInputs[1]}
                          disabled={showAnswer || locked}
                        />
                      )}
                    </Droppable>

                    {wrongInputs.includes("1") && (
                      <span className="input-error-x-wb-u2-p2-q1">✕</span>
                    )}
                  </div>
                </div>
              </div>
              {/* الصف الثاني */}
              <div className="matching-row2">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  {" "}
                  <div className="img-with-dot2">
                    {" "}
                    <span className="span-num2">2</span>
                    <img
                      src={dish}
                      alt=""
                      style={{
                        cursor: "pointer",
                        height: "100px",
                        width: "auto",
                      }}
                    />
                  </div>
                  <div className="word-with-dot2-wb-u2-p2-q1">
                    <div className="word-bank-container-wb-u2-p2-q1">
                      <span
                        className="word-text2-wb-u2-p2-q1"
                        style={{ cursor: "pointer" }}
                      >
                        a hat party It’s .
                      </span>{" "}
                      <Droppable droppableId="bank-2" direction="horizontal">
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
                              alignItems: "center", width:"300px",
                              justifyContent:"center"
                            }}
                          >
                            {scrambledWords[2].map((word, i) => (
                              <Draggable
                                key={`2-${word}-${i}`}
                                draggableId={`2-${word}-${i}`}
                                index={i}
                                isDragDisabled={showAnswer || locked}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      padding: "2px 5px",
                                      border: "2px solid #2c5287",
                                      borderRadius: "8px",
                                      background: "white",
                                      fontWeight: "bold",
                                      cursor: "grab",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {word}
                                  </span>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                    <Droppable droppableId="blank-2">
                      {(provided, snapshot) => (
                        <input
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`unscramble-input ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          value={userInputs[2]}
                          disabled={showAnswer || locked}
                        />
                      )}
                    </Droppable>
                    {wrongInputs.includes("2") && (
                      <span className="input-error-x-wb-u2-p2-q1">✕</span>
                    )}
                  </div>
                </div>
              </div>
              {/* الصف الثالث */}
              <div className="matching-row2">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="img-with-dot2">
                    <span className="span-num2">3</span>
                    <img
                      src={duck}
                      alt=""
                      style={{
                        cursor: "pointer",
                        height: "100px",
                        width: "auto",
                      }}
                    />
                  </div>

                  <div className="word-with-dot2-wb-u2-p2-q1">
                    <div className="word-bank-container-wb-u2-p2-q1">
                      <span
                        className="word-text2-wb-u2-p2-q1"
                        style={{ cursor: "pointer" }}
                      >
                        are How you old ?
                      </span>

                      <Droppable droppableId="bank-3" direction="horizontal">
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
                              alignItems: "center", width:"300px",
                              justifyContent:"center"
                            }}
                          >
                            {scrambledWords[3].map((word, i) => (
                              <Draggable
                                key={`3-${word}-${i}`}
                                draggableId={`3-${word}-${i}`}
                                index={i}
                                isDragDisabled={showAnswer || locked}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      padding: "2px 5px",
                                      border: "2px solid #2c5287",
                                      borderRadius: "8px",
                                      background: "white",
                                      fontWeight: "bold",
                                      cursor: "grab",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {word}
                                  </span>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                    <Droppable droppableId="blank-3">
                      {(provided, snapshot) => (
                        <input
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`unscramble-input ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          value={userInputs[3]}
                          disabled={showAnswer || locked}
                        />
                      )}
                    </Droppable>

                    {wrongInputs.includes("3") && (
                      <span className="input-error-x-wb-u2-p2-q1">✕</span>
                    )}
                  </div>
                </div>
              </div>{" "}
              {/* الصف الرابع */}
              <div className="matching-row2">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  {" "}
                  <div className="img-with-dot2">
                    <span className="span-num2">4</span>
                    <img
                      src={tiger}
                      alt=""
                      style={{
                        cursor: "pointer",
                        height: "100px",
                        width: "auto",
                      }}
                    />
                  </div>
                  <div className="word-with-dot2-wb-u2-p2-q1">
                    <div className="word-bank-container-wb-u2-p2-q1">
                      <span
                        className="word-text2-wb-u2-p2-q1"
                        style={{ cursor: "pointer" }}
                      >
                        seven I’m old years .
                      </span>

                      <Droppable droppableId="bank-4" direction="horizontal">
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
                              width:"300px",
                              justifyContent:"center"
                            }}
                          >
                            {scrambledWords[4].map((word, i) => (
                              <Draggable
                                key={`4-${word}-${i}`}
                                draggableId={`4-${word}-${i}`}
                                index={i}
                                isDragDisabled={showAnswer || locked}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      padding: "2px 5px",
                                      border: "2px solid #2c5287",
                                      borderRadius: "8px",
                                      background: "white",
                                      fontWeight: "bold",
                                      cursor: "grab",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {word}
                                  </span>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                    <Droppable droppableId="blank-4">
                      {(provided, snapshot) => (
                        <input
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`unscramble-input ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          value={userInputs[4]}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "white",
                          }}
                          disabled={showAnswer || locked}
                        />
                      )}
                    </Droppable>

                    {wrongInputs.includes("4") && (
                      <span className="input-error-x-wb-u2-p2-q1">✕</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="action-buttons-container">
          <button
            onClick={() => {
              setLines([]);
              setUserInputs({
                1: "",
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
              // 2️⃣ تعبئة جميع الإجابات الصحيحة في inputs
              setUserInputs({
                1: correctSentences["1"],
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
    </DragDropContext>
  );
};

export default WB_Unit2_Page2_Q1;
