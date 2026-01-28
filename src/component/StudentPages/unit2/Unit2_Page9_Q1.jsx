import React, { useState } from "react";
import "./Unit2_Page9_Q1.css";
import partyhats from "../../../assets/img_unit2/imgs/party hats..jpg";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit2_Page9_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [wrongWords, setWrongWords] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [checked, setChecked] = useState(false);

  const correctMatches = [
    { input: "party hats", num: "input1" },
    { input: "What is it", num: "input2" },
    { input: "It’s", num: "input3" },
    { input: "present", num: "input4" },
  ];

  const wordBank = correctMatches.map((c) => c.input);

  const getValue = (id) => answers[id] || "";

  // 🧲 Drag logic (ثابت + قابل للتعديل دائمًا)
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer || checked) return;

    // استخرج الكلمة من أي draggableId
    const word = draggableId.replace("bank-", "").replace(/^slot-.*?-/, "");

    setAnswers((prev) => {
      const updated = { ...prev };

      // إزالة الكلمة من أي slot سابق
      Object.keys(updated).forEach((k) => {
        if (updated[k] === word) delete updated[k];
      });

      // إذا انحطت داخل slot
      if (destination.droppableId.startsWith("slot-")) {
        const id = destination.droppableId.replace("slot-", "");
        updated[id] = word;
      }

      // إذا رجعت للبنك → لا نضيفها لأي slot
      return updated;
    });

    setWrongWords([]);
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    if (Object.keys(answers).length < correctMatches.length) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let wrong = [];
    let correctCount = 0;

    correctMatches.forEach((ans) => {
      if (answers[ans.num] === ans.input) correctCount++;
      else wrong.push(ans.num);
    });

    setWrongWords(wrong);
    setChecked(true);

    const total = correctMatches.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    ValidationAlert[
      correctCount === total
        ? "success"
        : correctCount === 0
          ? "error"
          : "warning"
    ](`
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `);
  };

  const showCorrectAnswers = () => {
    const filled = {};
    correctMatches.forEach((c) => (filled[c.num] = c.input));
    setAnswers(filled);
    setWrongWords([]);
    setShowAnswer(true);
    setChecked(true); // 🔒
  };

  const resetAll = () => {
    setAnswers({});
    setWrongWords([]);
    setShowAnswer(false);
    setChecked(false); // 🔓 رجّع التفاعل
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div className="div-forall" style={{ width: "60%" }}>
          <div className="unit2-page9-q1-container">
            <h5 className="header-title-page8">A Look and write.</h5>

            {/* 🔤 Word Bank */}
            <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
              {(provided) => (
                <div
                  // className="word-bank-unit2-p8-q2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px",
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    // margin: "10px 0",
                    alignItems: "center",justifyContent:"center"
                  }}
                >
                  {wordBank.map((word, index) => (
                    <Draggable
                      key={word}
                      draggableId={`bank-${word}`}
                      index={index}
                      isDragDisabled={checked || showAnswer}
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
                          {word}
                        </span>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="content-container-P90-Q1">
              {/* SECTION 1 */}
              <div className="section-one">
                <span>1</span>
                <img src={partyhats} className="p9-q1-img" />
                <div className="content-input">
                  <input type="text" value="What are these?" readOnly />
                  <input type="text" value="These are" readOnly />

                  <Droppable droppableId="slot-input1">
                    {(provided,snapshot) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`drop-slot-inline-unit2-p8-q2  ${
                                      snapshot.isDraggingOver
                                        ? "drag-over-cell"
                                        : ""
                                    }`}
                      >
                        {getValue("input1") && (
                          <Draggable
                            draggableId={`slot-input1-${getValue("input1")}`}
                            index={0}
                            isDragDisabled={checked || showAnswer}
                          >
                            {(provided, snapshot) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`word-item`}
                              >
                                {getValue("input1")}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                        {wrongWords.includes("input1") && !showAnswer && (
                          <span className="error-mark-input1">✕</span>
                        )}
                      </span>
                    )}
                  </Droppable>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="section-two">
                <span>2</span>
                <img src={present} className="p9-q1-img" />
                <div className="content-input">
                  {["input2", "input3", "input4"].map((id, idx) => (
                    <React.Fragment key={id}>
                      <Droppable droppableId={`slot-${id}`}>
                        {(provided ,snapshot) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`drop-slot-inline-unit2-p8-q2  ${
                                      snapshot.isDraggingOver
                                        ? "drag-over-cell"
                                        : ""
                                    }`}
                          >
                            {getValue(id) && (
                              <Draggable
                                draggableId={`slot-${id}-${getValue(id)}`}
                                index={0}
                                isDragDisabled={checked || showAnswer}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`word-item`}
                                  >
                                    {getValue(id)}
                                  </span>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                            {wrongWords.includes(id) && !showAnswer && (
                              <span className="error-mark-input1">✕</span>
                            )}
                          </span>
                        )}
                      </Droppable>
                      {idx === 0 && " ? "}
                      {idx === 1 && " a "}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="action-buttons-container">
            <button className="try-again-button" onClick={resetAll}>
              Start Again ↻
            </button>
            <button className="show-answer-btn" onClick={showCorrectAnswers}>
              Show Answer
            </button>
            <button className="check-button2" onClick={checkAnswers}>
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit2_Page9_Q1;
