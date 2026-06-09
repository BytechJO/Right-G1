import React, { useState, useEffect, useRef } from "react";
import "./Review5_Page1_Q1.css";
import img1 from "../../../assets/unit6/imgs/U6P52EXEA-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P52EXEA-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P52EXEA-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P52EXEA-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const Review5_Page1_Q1 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]); // ⭐ تم التعديل هون
  const [locked, setLocked] = useState(false);

  const correctMatches = [
    { id: "w1", input: "pen", num: "input1" },
    { id: "w2", input: "What’s this", num: "input2" },
    { id: "w3", input: "This is a map", num: "input3" },
    { id: "w4", input: "What’s this", num: "input4" },
    { id: "w5", input: "This is a globe", num: "input5" },
  ];

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const dragged = correctMatches.find(
      (w) => `word-${w.id}` === draggableId || `filled-${w.id}` === draggableId,
    );

    if (!dragged) return;

    const value = dragged.input; // النص
    const wordId = dragged.id; // الهوية
    const id = destination.droppableId;

    setAnswers((prev) => {
      const updated = [...prev];

      // امنع تكرار نفس الـ ID (مش النص)
      const oldIndex = updated.findIndex((a) => a.wordId === wordId);
      if (oldIndex !== -1) updated.splice(oldIndex, 1);

      const existingIndex = updated.findIndex((a) => a.num === id);
      if (existingIndex !== -1) {
        updated[existingIndex] = { input: value, num: id, wordId };
      } else {
        updated.push({ input: value, num: id, wordId });
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

    correctMatches.forEach((ans, i) => {
      if (
        ans.input.toLocaleLowerCase() === answers[i].input.toLocaleLowerCase()
      ) {
        correctCount++;
      } else {
        wrong.push(ans.num);
      }
    });

    setWrongWords(wrong);
    setLocked(true);

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
            gap: "50px",
          }}
        >
          <h5 className="header-title-page8">
            <span className="mr-2">A</span> Drag and drop the words to complete
            the sentences.
          </h5>
          <Droppable droppableId="bank" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  width: "100%",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {correctMatches.map((item, index) => (
                  <Draggable
                    key={item.input}
                    draggableId={`word-${item.id}`}
                    index={index}
                    isDragDisabled={locked}
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
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.input}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="content-container-unit5-p6-q1">
            <div className="section-one-unit5-p6-q1">
              <span
                style={{
                  color: "#2c5287",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                1
              </span>{" "}
              <img src={img1} className="img-review5-p1-q1 " />
              <div className="content-input-unit5-p6-q1">
                <input
                  type="text"
                  value={"What’s this?"}
                  readOnly
                  style={{
                    pointerEvents: "none",
                    borderBottom: "2px solid black",
                    width: "200px",
                    fontSize: "18px",
                  }}
                />

                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={"This is an eraser."}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "200px",
                      fontSize: "18px",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="section-two-unit5-p6-q1">
              <span
                style={{
                  color: "#2c5287",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                2
              </span>{" "}
              <img src={img2} className="img-review5-p1-q1 " />
              <div className="content-input-unit5-p6-q1">
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    value={"What’s this?"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "200px",
                      fontSize: "18px",
                    }}
                  />
                </div>
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    value={"This is a"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "90px",
                      fontSize: "18px",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      width: "100%",
                      alignItems: "flex-end",
                      fontSize: "18px",
                    }}
                  >
                    <Droppable droppableId="input1">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-unit5-p6-q1 w-full ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                        >
                          {answers.find((a) => a.num === "input1") && (
                            <Draggable
                              draggableId={`filled-${answers.find((a) => a.num === "input1").wordId}`}
                              index={0}
                              isDragDisabled={true}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {
                                    answers.find((a) => a.num === "input1")
                                      .input
                                  }
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    .
                    {!locked && wrongWords.includes(answers[0]?.num) && (
                      <span className="error-mark-input1">✕</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="section-three-unit5-p6-q1">
              <span
                style={{
                  color: "#2c5287",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                3
              </span>{" "}
              <img src={img3} className="img-review5-p1-q1 " />
              <div className="content-input-unit5-p6-q1">
                <div
                  style={{
                    position: "relative",
                    fontSize: "18px",
                  }}
                >
                  <Droppable droppableId="input2">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`answer-input-unit5-p6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers.find((a) => a.num === "input2") && (
                          <Draggable
                            draggableId={`filled-${answers.find((a) => a.num === "input2").wordId}`}
                            index={0}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers.find((a) => a.num === "input2").input}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {!locked && wrongWords.includes(answers[1]?.num) && (
                    <span className="error-mark-input1">✕</span>
                  )}
                  ?
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-end",
                      fontSize: "18px",
                    }}
                  >
                    <Droppable droppableId="input3">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-unit5-p6-q1 ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          }`}
                        >
                          {answers.find((a) => a.num === "input3") && (
                            <Draggable
                              draggableId={`filled-${answers.find((a) => a.num === "input3").wordId}`}
                              index={0}
                              isDragDisabled={true}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {
                                    answers.find((a) => a.num === "input3")
                                      .input
                                  }
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    .
                    {!locked && wrongWords.includes(answers[2]?.num) && (
                      <span className="error-mark-input1">✕</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="section-four-unit5-p6-q1">
              <span
                style={{
                  color: "#2c5287",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                4
              </span>{" "}
              <img src={img4} className="img-review5-p1-q1 " />
              <div className="content-input-unit5-p6-q1">
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "18px",
                  }}
                >
                  <Droppable droppableId="input4">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`answer-input-unit5-p6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers.find((a) => a.num === "input4") && (
                          <Draggable
                            draggableId={`filled-${answers.find((a) => a.num === "input4").wordId}`}
                            index={0}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers.find((a) => a.num === "input4").input}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  ?
                  {!locked && wrongWords.includes(answers[3]?.num) && (
                    <span className="error-mark-input1">✕</span>
                  )}
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "22px",
                  }}
                >
                  <Droppable droppableId="input5">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`answer-input-unit5-p6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers.find((a) => a.num === "input5") && (
                          <Draggable
                            draggableId={`filled-${answers.find((a) => a.num === "input5").wordId}`}
                            index={0}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers.find((a) => a.num === "input5").input}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  .
                  {!locked && wrongWords.includes(answers[4]?.num) && (
                    <span className="error-mark-input1">✕</span>
                  )}
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

export default Review5_Page1_Q1;
