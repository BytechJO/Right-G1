import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page2_Q1.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

/* ================= DATA ================= */

const questions = [
  {
    id: 1,
    words: ["bike", "I", "ride", "can’t", "a"],
    correct: ["I", "can’t", "ride", "a", "bike"],
  },
  {
    id: 2,
    words: ["sail", "They", "a", "boat", "can"],
    correct: ["They", "can", "sail", "a", "boat"],
  },
  {
    id: 3,
    words: ["a", "kite", "can", "He", "fly"],
    correct: ["He", "can", "fly", "a", "kite"],
  },
  {
    id: 4,
    words: ["picture", "I", "can", "a", "paint"],
    correct: ["I", "can", "paint", "a", "picture"],
  },
];

/* ================= COMPONENT ================= */

const WB_Unit6_Page2_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState({});

  const onDragEnd = (result) => {
    if (!result.destination || locked || checked) return;

    const num = result.draggableId.replace("num-", "");
    const dest = result.destination.droppableId;

    // dest مثال: q-1-bike
    const [, qId, word] = dest.split("-");

    setAnswers((prev) => {
      const updated = { ...prev };
      const row = { ...(updated[qId] || {}) };

      // ⭐ امسح الرقم من أي كلمة ثانية بنفس السؤال
      Object.keys(row).forEach((w) => {
        if (row[w] === num) delete row[w];
      });

      row[word] = num;
      updated[qId] = row;
      return updated;
    });
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (qId, word, value) => {
    if (locked || checked) return;

    if (!/^[1-5]?$/.test(value)) return;

    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [word]: value,
      },
    }));
  };
  const TOTAL_WORDS = questions.reduce((sum, q) => sum + q.words.length, 0);
  /* ================= CHECK ANSWER ================= */
  const checkAnswer = () => {
    if (locked || checked) return;
    // ✅ 1. تأكد إنو كل الانبوتات معبّاية
    for (const q of questions) {
      const row = answers[q.id];

      if (!row || Object.keys(row).length !== q.words.length) {
        ValidationAlert.info(
          "Pay attention!",
          "Please number all the words before checking.",
        );
        return;
      }

      for (const word of q.words) {
        if (!row[word]) {
          ValidationAlert.info(
            "Pay attention!",
            "Please number all the words before checking.",
          );
          return;
        }
      }
    }

    let score = 0;
    const wrongMap = {};

    questions.forEach((q) => {
      const row = answers[q.id];
      wrongMap[q.id] = [];

      q.words.forEach((word) => {
        const userPos = Number(row[word]) - 1; // ترتيب الطالب
        const correctWord = q.correct[userPos]; // الكلمة الصح بهالترتيب

        if (correctWord === word) {
          score++; // ✅ كلمة صح
        } else {
          wrongMap[q.id].push(word); // ❌ كلمة غلط
        }
      });
    });

    setWrongInputs(wrongMap);
    setChecked(true);
    setLocked(true);

    const color =
      score === TOTAL_WORDS ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
           Score: ${score} / ${TOTAL_WORDS}
        </span>
      </div>
    `;
    if (score === TOTAL_WORDS) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswer = () => {
    const filled = {};

    questions.forEach((q) => {
      const row = {};
      q.correct.forEach((word, i) => {
        row[word] = String(i + 1);
      });
      filled[q.id] = row;
    });

    setAnswers(filled);
    setWrongInputs({});
    setLocked(true);
  };

  /* ================= RESET ================= */

  const reset = () => {
    setAnswers({});
    setWrongInputs({});
    setChecked(false);
    setLocked(false);
  };

  /* ================= RENDER ================= */

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
            width: "60%",
            display: "flex",
            flexDirection: "column",
            // gap: "20px",
          }}
        >
          <h4 className="header-title-page8">
            <span className="ex-A">C</span> Unscramble and number.
          </h4>
          <Droppable droppableId="number-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
               className="word-bank-wb-unit3-p6-q1"
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  margin: "20px 0",
                }}
              >
                {[1, 2, 3, 4, 5].map((num, i) => (
                  <Draggable draggableId={`num-${num}`} index={i} key={num}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="word-box-wb-unit4-p4-q1"
                        style={{
                          width: 50,
                          textAlign: "center",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {num}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          <div className="wb-unit6-p2-q1-questions">
            {questions.map((q) => (
              <div key={q.id} className="wb-unit6-p2-q1-row">
                <div className="wb-unit6-p2-q1-number">{q.id}</div>

                <div className="wb-unit6-p2-q1-words">
                  {q.words.map((word) => (
                    <div key={word} className="wb-unit6-p2-q1-word-box">
                      <span className="wb-unit6-p2-q1-word-text">{word}</span>
                      <Droppable droppableId={`q-${q.id}-${word}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="wb-unit6-p2-q1-input"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: snapshot.isDraggingOver
                                ? "#e3f2fd"
                                : "",
                            }}
                          >
                            {answers[q.id]?.[word] || ""}

                            {checked && wrongInputs[q.id]?.includes(word) && (
                              <div className="wb-unit6-p2-q1-wrong-mark">✕</div>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ACTION BUTTONS */}
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswer}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit6_Page2_Q1;
