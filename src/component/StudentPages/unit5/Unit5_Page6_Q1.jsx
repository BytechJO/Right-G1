import React, { useState, useEffect, useRef } from "react";
import "./Unit5_Page6_Q1.css";
import img1 from "../../../assets/unit5/imgs/U5P45EXED-01.svg";
import img2 from "../../../assets/unit5/imgs/U5P45EXED-02.svg";
import img3 from "../../../assets/unit5/imgs/U5P45EXED-03.svg";
import img4 from "../../../assets/unit5/imgs/U5P45EXED-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit5_Page6_Q1 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]); // ⭐ تم التعديل هون
  const [showAnswer, setShowAnswer] = useState(false);

  const correctMatches = [
    { input: "book", num: "input1" },
    { input: "this", num: "input2" },
    { input: "this is a", num: "input3" },
    { input: "no, it isn’t", num: "input4" },
    { input: "is this a", num: "input5" },
    { input: "it is", num: "input6" },
  ];

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    const value = draggableId.replace("word-", "");
    const id = destination.droppableId;

    setAnswers((prev) => {
      const updated = [...prev];

      // منع التكرار
      const oldIndex = updated.findIndex((a) => a.input === value);
      if (oldIndex !== -1) updated.splice(oldIndex, 1);

      const existingIndex = updated.findIndex((a) => a.num === id);
      if (existingIndex !== -1) {
        updated[existingIndex] = { input: value, num: id };
      } else {
        updated.push({ input: value, num: id });
      }

      return updated;
    });

    setWrongWords([]);
  };

  const checkAnswers = () => {
    if (showAnswer) return; // منع التعديل عند show answer
    // تأكد إنو الطالب وصل كل الأزواج

    let correctCount = 0;

    let wrong = []; // ⭐ تم التعديل هون
    // احسب كم وصلة صحيحة

    if (answers.length === 0) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    correctMatches.forEach((correct) => {
      const userAnswer = answers.find((a) => a.num === correct.num);

      if (
        userAnswer &&
        userAnswer.input.toLowerCase() === correct.input.toLowerCase()
      ) {
        correctCount++;
      } else {
        wrong.push(correct.num);
      }
    });

    setWrongWords(wrong);
   setShowAnswer(true)
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
  const handleShowAnswer = () => {
    // بناء الإجابات الصحيحة بناءً على correctMatches
    const filled = correctMatches.map((item) => ({
      input: item.input,
      num: item.num,
    }));

    setAnswers(filled);
    setWrongWords([]); // الخطأ يختفي
    setShowAnswer(true);
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
            <h5 className="header-title-page8">
              <span className="ex-A"> D</span>Look and read. Complete the
              question and answer.
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
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    // margin: "10px 0",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {correctMatches.map((item, i) => (
                    <Draggable
                      key={item.input}
                      draggableId={`word-${item.input}`}
                      index={i}
                      isDragDisabled={showAnswer}
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
                  className="Unit5-P6-Q3-text"
                  style={{ color: "darkblue" }}
                >
                  1
                </span>{" "}
                <img src={img1} className="img-unit5-p6-q1" />
                <div
                  className="content-input-unit5-p6-q1"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  <input
                    type="text"
                    value={"What’s this?"}
                    readOnly
                    style={{ pointerEvents: "none" }}
                  />
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      value={"This is a"}
                      readOnly
                      style={{ pointerEvents: "none", width: "77px" }}
                    />
                    <div style={{ position: "relative" }}>
                      <Droppable droppableId="input1">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`answer-input-unit5-p6-q1 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {answers.find((a) => a.num === "input1") && (
                              <Draggable
                                draggableId={`filled-${
                                  answers.find((a) => a.num === "input1").input
                                }`}
                                index={0}
                                isDragDisabled={showAnswer}
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
                            {wrongWords.includes(answers[0]?.num) && (
                              <span className="error-mark-input1">✕</span>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-two-unit5-p6-q1">
                <span
                  className="Unit5-P6-Q3-text"
                  style={{ color: "darkblue" }}
                >
                  2
                </span>{" "}
                <img src={img2} className="img-unit5-p6-q1" />
                <div
                  className="content-input-unit5-p6-q1"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  <div style={{ position: "relative", display: "flex" }}>
                    <input
                      type="text"
                      value={"What‘s"}
                      readOnly
                      style={{ pointerEvents: "none", width: "70px" }}
                    />
                    <Droppable droppableId="input2">
                      {(provided ,snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-unit5-p6-q1 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                        >
                          {answers.find((a) => a.num === "input2") && (
                            <Draggable
                              draggableId={`filled-${
                                answers.find((a) => a.num === "input2").input
                              }`}
                              index={0}
                              isDragDisabled={showAnswer}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {
                                    answers.find((a) => a.num === "input2")
                                      .input
                                  }
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                          {wrongWords.includes(answers[1]?.num) && (
                            <span className="error-mark-input1">✕</span>
                          )}
                        </div>
                      )}
                    </Droppable>
                    ?
                  </div>
                  <div style={{ position: "relative", display: "flex" }}>
                    <Droppable droppableId="input3">
                      {(provided ,snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                           className={`answer-input-unit5-p6-q1 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                        >
                          {answers.find((a) => a.num === "input3") && (
                            <Draggable
                              draggableId={`filled-${
                                answers.find((a) => a.num === "input3").input
                              }`}
                              index={0}
                              isDragDisabled={showAnswer}
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
                          {wrongWords.includes(answers[2]?.num) && (
                            <span className="error-mark-input1">✕</span>
                          )}
                        </div>
                      )}
                    </Droppable>

                    <input
                      type="text"
                      value={"global"}
                      readOnly
                      style={{ pointerEvents: "none", width: "70px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="section-three-unit5-p6-q1">
                <span
                  className="Unit5-P6-Q3-text"
                  style={{ color: "darkblue" }}
                >
                  3
                </span>{" "}
                <img src={img3} className="img-unit5-p6-q1" />
                <div
                  className="content-input-unit5-p6-q1"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  <input
                    type="text"
                    value={"Is this a pencil?"}
                    readOnly
                    style={{ pointerEvents: "none" }}
                  />
                  <div style={{ position: "relative" }}>
                    <Droppable droppableId="input4">
                      {(provided ,snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-unit5-p6-q1 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                        >
                          {answers.find((a) => a.num === "input4") && (
                            <Draggable
                              draggableId={`filled-${
                                answers.find((a) => a.num === "input4").input
                              }`}
                              index={0}
                              isDragDisabled={showAnswer}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {
                                    answers.find((a) => a.num === "input4")
                                      .input
                                  }
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                          {wrongWords.includes(answers[3]?.num) && (
                            <span className="error-mark-input1">✕</span>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
              <div className="section-four-unit5-p6-q1">
                <span
                  className="Unit5-P6-Q3-text"
                  style={{ color: "darkblue" }}
                >
                  4
                </span>{" "}
                <img src={img4} className="img-unit5-p6-q1" />
                <div
                  className="content-input-unit5-p6-q1"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  <div style={{ position: "relative", display: "flex" }}>
                    <Droppable droppableId="input5">
                      {(provided ,snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-unit5-p6-q1 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                        >
                          {answers.find((a) => a.num === "input5") && (
                            <Draggable
                              draggableId={`filled-${
                                answers.find((a) => a.num === "input5").input
                              }`}
                              index={0}
                              isDragDisabled={showAnswer}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {
                                    answers.find((a) => a.num === "input5")
                                      .input
                                  }
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                          {wrongWords.includes(answers[4]?.num) && (
                            <span className="error-mark-input1">✕</span>
                          )}
                        </div>
                      )}
                    </Droppable>

                    <input
                      type="text"
                      value={"ruler?"}
                      readOnly
                      style={{ pointerEvents: "none" }}
                    />
                  </div>
                  <div style={{ position: "relative", display: "flex" }}>
                    <input
                      type="text"
                      value={"Yes,"}
                      readOnly
                      style={{ pointerEvents: "none", width: "70px" }}
                    />
                    <Droppable droppableId="input6">
                      {(provided ,snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`answer-input-unit5-p6-q1 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                        >
                          {answers.find((a) => a.num === "input6") && (
                            <Draggable
                              draggableId={`filled-${
                                answers.find((a) => a.num === "input6").input
                              }`}
                              index={0}
                              isDragDisabled={showAnswer}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {
                                    answers.find((a) => a.num === "input6")
                                      .input
                                  }
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                          {wrongWords.includes(answers[5]?.num) && (
                            <span className="error-mark-input1">✕</span>
                          )}
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
                setShowAnswer(false); // <<< مهم
              }}
              className="try-again-button"
            >
              Start Again ↻
            </button>
            {/* ⭐⭐⭐ NEW — زر Show Answer */}
            <button
              onClick={handleShowAnswer}
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

export default Unit5_Page6_Q1;
