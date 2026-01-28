import React, { useState, useEffect, useRef } from "react";
// import "./Unit5_Page6_Q1.css";
import img1 from "../../../assets/U1 WB/U6/U6P36EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P36EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P36EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P36EXEH-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit6_Page4_Q2 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]); // ⭐ تم التعديل هون
  const [locked, setLocked] = useState(false);

  const correctMatches = [
    { input: "can't", num: "input1", id: "w1" },
    { input: "she fly a kite", num: "input2", id: "w2" },
    { input: "she can", num: "input3", id: "w3" },
    { input: "Can he sail a boat", num: "input4", id: "w4" },
    { input: "No, he can't", num: "input5", id: "w5" },
    { input: "Can he ride a bike", num: "input6", id: "w6" },
    { input: "No, he can't", num: "input7", id: "w7" },
  ];
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const wordIndex = Number(result.draggableId.replace("word-", ""));
    const sentence = [
      "can't",
      "she fly a kite",
      "she can",
      "Can he sail a boat",
      "No, he can't",
      "Can he ride a bike",
    ][wordIndex];

    const dest = result.destination.droppableId;
    if (!dest.startsWith("drop-")) return;

    const inputId = dest.replace("drop-", "");

    setAnswers((prev) => {
      const updated = [...prev];
      const existingIndex = updated.findIndex((a) => a.num === inputId);

      if (existingIndex !== -1) {
        updated[existingIndex] = { input: sentence, num: inputId };
      } else {
        updated.push({ input: sentence, num: inputId });
      }

      return updated;
    });

    setWrongWords([]);
  };

  const showAnswers = () => {
    const filled = correctMatches.map((item) => ({
      input: item.input,
      num: item.num,
    }));

    setAnswers(filled);
    setWrongWords([]);
    setLocked(true); // 🔒 قفل التعديل
  };

  const checkAnswers = () => {
    if (locked) return; // 🔒 يمنع التعديل بعد Show Answer

    // تأكد إنو الطالب وصل كل الأزواج

    let correctCount = 0;

    let wrong = []; // ⭐ تم التعديل هون
    // احسب كم وصلة صحيحة

    if (answers.length === 0) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    correctMatches.forEach((ans) => {
      const userAnswer = answers.find((a) => a.num === ans.num);

      if (
        userAnswer &&
        userAnswer.input.toLowerCase() === ans.input.toLowerCase()
      ) {
        correctCount++;
      } else {
        wrong.push(ans.num);
      }
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
          <div className="unit2-page9-q1-container">
            <h4 className="header-title-page8">
              <span className="ex-A"> H</span> Look and write.
            </h4>
            <Droppable droppableId="word-bank" direction="vertical">
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
                  {[
                    "can't",
                    "she fly a kite",
                    "she can",
                    "Can he sail a boat",
                    "No, he can't",
                    "Can he ride a bike",
                  ].map((text, i) => (
                    <Draggable
                      key={`word-${i}`}
                      draggableId={`word-${i}`}
                      index={i}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <div
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
                          {text}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="content-container-wb-unit6-p4-q2">
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
                  <img src={img1} className="img-wb-unit6-p4-q2 " />
                </div>
                <div className="content-input-unit5-p6-q1">
                  <input
                    type="text"
                    value={"Can it swim ?"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "100%",
                      fontSize: "22px",
                    }}
                  />

                  <div style={{ position: "relative", display: "flex" }}>
                    <input
                      type="text"
                      value={"No, it"}
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
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Droppable droppableId={`drop-input1`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`answer-input-wb-unit6-p4-q2  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "",
                            }}
                          >
                            {answers.find((a) => a.num === "input1")?.input ||
                              ""}

                            {wrongWords.includes("input1") && (
                              <span className="error-mark-input1">✕</span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              </div>

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
                  <img src={img2} className="img-wb-unit6-p4-q2" />
                </div>
                <div className="content-input-unit5-p6-q1">
                  <div style={{ position: "relative", display: "flex" }}>
                    <input
                      type="text"
                      value={"Can"}
                      readOnly
                      style={{
                        pointerEvents: "none",
                        borderBottom: "2px solid black",
                        width: "25%",
                        fontSize: "22px",
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Droppable droppableId={`drop-input2`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`answer-input-wb-unit6-p4-q2  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "",
                              // minWidth: 120,
                            }}
                          >
                            {answers.find((a) => a.num === "input2")?.input ||
                              ""}

                            {wrongWords.includes("input2") && (
                              <span className="error-mark-input1">✕</span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                  <div style={{ position: "relative", display: "flex" }}>
                    <input
                      type="text"
                      value={"Yes,"}
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
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Droppable droppableId={`drop-input3`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`answer-input-wb-unit6-p4-q2  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "",
                              // minWidth: 120,
                            }}
                          >
                            {answers.find((a) => a.num === "input3")?.input ||
                              ""}

                            {wrongWords.includes("input3") && (
                              <span className="error-mark-input1">✕</span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-three-wb-unit6-p4-q2">
                <div className="img-container-wb-unit6-p4-q2">
                  <span
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    3
                  </span>{" "}
                  <img src={img3} className="img-wb-unit6-p4-q2" />
                </div>
                <div className="content-input-unit5-p6-q1">
                  <div style={{ position: "relative" }}>
                    <Droppable droppableId={`drop-input4`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-wb-unit6-p4-q2  ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "",
                            // minWidth: 120,
                          }}
                        >
                          {answers.find((a) => a.num === "input4")?.input || ""}

                          {wrongWords.includes("input4") && (
                            <span className="error-mark-input1">✕</span>
                          )}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Droppable droppableId={`drop-input5`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`answer-input-wb-unit6-p4-q2  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "",
                              // minWidth: 120,
                            }}
                          >
                            {answers.find((a) => a.num === "input5")?.input ||
                              ""}

                            {wrongWords.includes("input5") && (
                              <span className="error-mark-input1">✕</span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              </div>
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
                  <img src={img4} className="img-wb-unit6-p4-q2" />
                </div>
                <div className="content-input-unit5-p6-q1">
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-end",
                      width: "100%",
                    }}
                  >
                    <Droppable droppableId={`drop-input6`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-wb-unit6-p4-q2  ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "",
                            // minWidth: 120,
                          }}
                        >
                          {answers.find((a) => a.num === "input6")?.input || ""}

                          {wrongWords.includes("input6") && (
                            <span className="error-mark-input1">✕</span>
                          )}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-end",
                      width: "100%",
                    }}
                  >
                    <Droppable droppableId={`drop-input7`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-wb-unit6-p4-q2  ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "",
                            // minWidth: 120,
                          }}
                        >
                          {answers.find((a) => a.num === "input7")?.input || ""}

                          {wrongWords.includes("input7") && (
                            <span className="error-mark-input1">✕</span>
                          )}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="action-buttons-container">
            <button
              onClick={() => {
                setAnswers([]);
                setWrongWords([]);
                setLocked(false); // ⬅ رجّع التعديل
              }}
              className="try-again-button"
            >
              Start Again ↻
            </button>
            {/* ⭐⭐⭐ NEW — زر Show Answer */}
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

export default WB_Unit6_Page4_Q2;
