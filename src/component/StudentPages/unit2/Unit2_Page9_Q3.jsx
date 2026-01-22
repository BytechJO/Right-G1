import React, { useState } from "react";
import "./Unit2_Page9_Q3.css";
import jello from "../../../assets/img_unit2/imgs/jello.jpg";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import balloons from "../../../assets/img_unit2/imgs/balloons..jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit2_Page9_Q3 = () => {
  const [answers, setAnswers] = useState({});
  const [wrongWords, setWrongWords] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);

  const correctMatches = [
    { input: "It’s jello", num: "input1" },
    { input: "It’s a present", num: "input2" },
    { input: "These are balloons", num: "input3" },
  ];

  const wordBank = correctMatches.map((c) => c.input);
  const getValue = (id) => answers[id] || "";

  // 🧲 Drag logic
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswers) return;

    const word = draggableId
      .replace("bank-", "")
      .replace(/^slot-.*?-/, "");

    setAnswers((prev) => {
      const updated = { ...prev };

      // إزالة الكلمة من أي مكان سابق
      Object.keys(updated).forEach((k) => {
        if (updated[k] === word) delete updated[k];
      });

      // إذا انحطت داخل slot
      if (destination.droppableId.startsWith("slot-")) {
        const id = destination.droppableId.replace("slot-", "");
        updated[id] = word;
      }

      return updated;
    });

    setWrongWords([]);
  };

  const checkAnswers = () => {
    if (showAnswers) return;

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
    setShowAnswers(true);
  };

  const resetAll = () => {
    setAnswers({});
    setWrongWords([]);
    setShowAnswers(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
        <div className="div-forall" style={{ width: "60%" }}>
          <h5 className="header-title-page8">C Look and answer.</h5>

          {/* 🔤 Word Bank */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                className="word-bank-unit2-p8-q2"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {wordBank.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`bank-${word}`}
                    index={index}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="word-item-unit2-p8-q2"
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

          <div className="content-container-P9-Q3">
            {/* ===== Q1 ===== */}
            {[
              { id: "input1", img: jello, label: "What is it?" },
              { id: "input2", img: present, label: "What is it?" },
              { id: "input3", img: balloons, label: "What are these?" },
            ].map((q, i) => (
              <div key={q.id} className="section-q3">
                <div style={{ display: "flex" }}>
                  <span className="num2">{i + 1}</span>
                  <img src={q.img} className="p9-q1-img2" />
                </div>

                <div className="content-input">
                  <input readOnly value={q.label} />

                  <Droppable droppableId={`slot-${q.id}`}>
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="drop-slot-q3"
                      >
                        {getValue(q.id) && (
                          <Draggable
                            draggableId={`slot-${q.id}-${getValue(q.id)}`}
                            index={0}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="word-item"
                              >
                                {getValue(q.id)}
                              </span>
                            )}
                          </Draggable>
                        )}

                        {provided.placeholder}

                        {wrongWords.includes(q.id) && !showAnswers && (
                          <span className="error-badge">✕</span>
                        )}
                      </span>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>

          {/* 🔘 Buttons */}
          <div className="action-buttons-container">
            <button className="try-again-button" onClick={resetAll}>
              Start Again ↻
            </button>
            <button
              className="show-answer-btn swal-continue"
              onClick={showCorrectAnswers}
            >
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

export default Unit2_Page9_Q3;
