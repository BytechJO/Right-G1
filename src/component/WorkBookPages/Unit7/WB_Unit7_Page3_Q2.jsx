import React, { useMemo, useState } from "react";
import "./WB_Unit7_Page3_Q2.css";
import img1 from "../../../assets/U1 WB/U7/U7P41EXEF-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P41EXEF-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P41EXEF-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P41EXEF-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit7_Page3_Q2 = () => {
  const [wrongWords, setWrongWords] = useState([]);
  const [locked, setLocked] = useState(false);

  const correctMatches = useMemo(
    () => [
      { input: "I am", num: "input1" },
      { input: "happy", num: "input2" },
      { input: "hungry", num: "input3" },
      { input: "Yes, I am", num: "input4" },
      { input: "Are you bored", num: "input5" },
      { input: "Yes, I am", num: "input6" },
    ],
    [],
  );

  // ✅ answers as map (stable)
  const [answersMap, setAnswersMap] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });

  // ✅ word bank items (unique IDs حتى لو النص متكرر "Yes, I am")
  const wordBank = useMemo(
    () => [
      { id: "w1", text: "I am" },
      { id: "w2", text: "happy" },
      { id: "w3", text: "hungry" },
      { id: "w4", text: "Yes, I am" },
      { id: "w5", text: "Are you bored" },
      { id: "w6", text: "Yes, I am" }, // لازم id مختلف
    ],
    [],
  );

  const [bank, setBank] = useState(wordBank);
  const usedWordIds = new Set(Object.values(answersMap).filter(Boolean));

  // ✅ onDragEnd: drop word into input
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { draggableId, destination } = result;

    // لازم نسمح drop فقط على inputs
    if (!destination.droppableId.startsWith("drop-")) return;

    const targetInput = destination.droppableId.replace("drop-", "");

    setAnswersMap((prev) => {
      // ✅ إذا الكلمة مستخدمة بمكان ثاني → امنعيها (no change)
      const alreadyUsedInAnotherInput = Object.entries(prev).some(
        ([inpId, wordId]) => wordId === draggableId && inpId !== targetInput,
      );
      if (alreadyUsedInAnotherInput) return prev;

      // ✅ إذا كان في كلمة قديمة بنفس input → استبدليها (القديمة "ترجع للبنك" يعني تنمسح من input)
      // فعلياً: بس بنعمل overwrite
      return {
        ...prev,
        [targetInput]: draggableId,
      };
    });

    setWrongWords([]);
  };
  const getWordTextById = (id) => wordBank.find((w) => w.id === id)?.text || "";

  const showAnswers = () => {
    setAnswersMap({
      input1: "w1", // I am
      input2: "w2", // happy
      input3: "w3", // hungry
      input4: "w4", // Yes, I am
      input5: "w5", // Are you bored
      input6: "w6", // Yes, I am (الثانية)
    });
    setWrongWords([]);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const allFilled = Object.values(answersMap).every((v) => v);
    if (!allFilled) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let correctCount = 0;
    const wrong = [];

    correctMatches.forEach((ans) => {
      const userText = getWordTextById(answersMap[ans.num])
        .trim()
        .toLowerCase();
      const correctText = ans.input.trim().toLowerCase();

      if (userText === correctText) correctCount++;
      else wrong.push(ans.num);
    });

    setWrongWords(wrong);
    setLocked(true);

    console.log(correctCount);
    console.log(wrongWords);
    const total = correctMatches.length;
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

    if (total === correctCount) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const startAgain = () => {
    setAnswersMap({
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
    });
    setBank(wordBank);
    setWrongWords([]);
    setLocked(false);
  };

  // ✅ helper: droppable input box UI
  const DropInput = ({ id }) => (
    <Droppable droppableId={`drop-${id}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`answer-input-wb-unit6-p4-q2  ${
            snapshot.isDraggingOver ? "drag-over-cell" : ""
          }`}
          style={{
            height: 36,
            width:"80%",
            borderBottom: "2px solid black",
            fontSize: "22px",
            display: "flex",
            alignItems: "flex-end",
            background: snapshot.isDraggingOver ? "#e3f2fd" : "transparent",
          }}
        >
          {getWordTextById(answersMap[id])}

          {provided.placeholder}
          {wrongWords.includes(id) && (
            <span className="error-mark-input1">✕</span>
          )}
        </div>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
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
          }}
        >
          <div className="unit2-page9-q1-container">
            <h4 className="header-title-page8">
              <span className="ex-A">F</span> Look, read, and drag.
            </h4>

            {/* ✅ WORD BANK */}
            <Droppable droppableId="word-bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    padding: "12px",
                    height: "70px",
                    border: "2px dashed #ccc",
                    borderRadius: 10,
                    justifyContent: "center",
                  }}
                >
                  {wordBank.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <div
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
                            alignSelf: "center",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {item.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* ✅ ORIGINAL LAYOUT (نفس تصميمك بس inputs صارت Drop) */}
            <div className="content-container-wb-unit6-p4-q2">
              {/* 1 */}
              <div className="section-one-wb-unit6-p4-q2">
                <div className="img-container-wb-unit6-p4-q2">
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    1
                  </span>{" "}
                  <input
                    type="text"
                    value={"Are you scared?"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "75%",
                      fontSize: "22px",
                    }}
                  />
                </div>
                <div className="content-input-wb-unit7-p3-q2">
                  <img src={img1} className="img-wb-unit6-p4-q2" />
                  <div style={{ position: "relative", display: "flex" }}>
                    <input
                      type="text"
                      value={"Yes, "}
                      readOnly
                      style={{
                        pointerEvents: "none",
                        borderBottom: "2px solid black",
                        width: "20%",
                        fontSize: "22px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 6,
                        width: "100%",
                      }}
                    >
                      <DropInput id="input1" />.
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 */}
              <div className="section-two-wb-unit6-p4-q2">
                <div className="img-container-wb-unit6-p4-q2">
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    2
                  </span>{" "}
                  <input
                    type="text"
                    value={"Are you sad?"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "80%",
                      fontSize: "22px",
                    }}
                  />
                </div>
                <div className="content-input-unit5-p6-q1">
                  <img src={img2} className="img-wb-unit6-p4-q2" />
                  <div style={{ position: "relative", display: "flex" }}>
                    <input
                      type="text"
                      value={"No, I'm not. I'm "}
                      readOnly
                      style={{
                        pointerEvents: "none",
                        borderBottom: "2px solid black",
                        width: "70%",
                        fontSize: "22px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 6,
                        width: "100%",
                      }}
                    >
                      <DropInput id="input2" />.
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 */}
              <div className="section-three-wb-unit6-p4-q2">
                <div
                  className="img-container-wb-unit6-p4-q2"
                  style={{ position: "relative" }}
                >
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    3
                  </span>{" "}
                  <div
                    style={{ position: "relative", display: "flex" }}
                  >
                    <input
                      type="text"
                      value={"Are you"}
                      readOnly
                      style={{
                        pointerEvents: "none",
                        borderBottom: "2px solid black",
                        width: "30%",
                        fontSize: "22px",
                      }}
                    />
                    <DropInput id="input3" />?
                  </div>
                </div>
                <div className="content-input-unit5-p6-q1">
                  <img src={img3} className="img-wb-unit6-p4-q2" />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 6,
                      width: "100%",
                    }}
                  >
                    <DropInput id="input4" />.
                  </div>
                </div>
              </div>

              {/* 4 */}
              <div className="section-four-wb-unit6-p4-q2">
                <div className="img-container-wb-unit6-p4-q2">
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    4
                  </span>{" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 6,
                      width: "100%",
                    }}
                  >
                    <DropInput id="input5" />?
                  </div>
                </div>
                <div className="content-input-unit5-p6-q1">
                  <img src={img4} className="img-wb-unit6-p4-q2" />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 6,
                      width: "100%",
                    }}
                  >
                    <DropInput id="input6" />.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="action-buttons-container">
            <button onClick={startAgain} className="try-again-button">
              Start Again ↻
            </button>
            <button
              className="show-answer-btn swal-continue"
              onClick={showAnswers}
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

export default WB_Unit7_Page3_Q2;
