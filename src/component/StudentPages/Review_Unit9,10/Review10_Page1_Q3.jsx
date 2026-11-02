import React, { useRef, useState } from "react";
import "./Review10_Page1_Q3.css";
import jello from "../../../assets/unit10/imgs/U10P90EXEC-01.svg";
import present from "../../../assets/unit10/imgs/U10P90EXEC-02.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

const Review10_Page1_Q3 = () => {
  const [inputs, setInputs] = useState({});
  const [wrong, setWrong] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [lockedKeys, setLockedKeys] = useState(new Set());
  const [picked, setPicked] = useState(null);
  const [focusedTarget, setFocusedTarget] = useState(null);
  const bankRefs = useRef(new Map());
  const targetRefs = useRef(new Map());
  const buildQuestionWordBank = (q) => {
    const text = `${q.questionCorrect} ${q.answerCorrect}`;

    return Array.from(
      new Set(
        text
          .replace(/[?.!,]/g, "")
          .split(/\s+/)
          .filter(Boolean),
      ),
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination || showAnswers) return;

    const { draggableId, destination } = result;

    // 🧠 qId تبع الكلمة
    const draggedQId = draggableId.split("-")[0]; // q1 أو q2

    // 🧠 qId تبع الانبوت
    const targetQId = destination.droppableId.split("_")[0];

    // ❌ منع الإسقاط إذا مش نفس السؤال
    if (draggedQId !== targetQId) return;

    const key = destination.droppableId;
    if (lockedKeys.has(key)) return;
    const draggedWord = draggableId.split("-").slice(1, -1).join(" ");

    // 🧠 اجمع كل الكلمات المستخدمة بهالسؤال
    // // ❌ إذا الكلمة مستخدمة → امنعي التكرار
    // if (usedWords.includes(draggedWord)) return;

    appendWord(key, draggedWord);
  };

  const questions = [
    {
      id: "q1",
      scramble: "w a n t / d o / a p p l e / y o u / a n ?",
      questionCorrect: "Do you want an apple",
      answerCorrect: "Yes I do",
      img: jello,
      alt: "A girl thinking about an apple.",
    },
    {
      id: "q2",
      scramble: "d o / i c e / c r e a m / w a n t / y o u ?",
      questionCorrect: "Do you want ice cream",
      answerCorrect: "No I don't I want a milkshake",
      img: present,
      alt: "A boy thinking about ice cream.",
    },
  ];

  const focusSoon = (node) => window.requestAnimationFrame(() => node?.focus());

  const appendWord = (key, word) => {
    if (showAnswers || lockedKeys.has(key)) return;
    setInputs((currentInputs) => {
      const current = currentInputs[key] || "";
      return {
        ...currentInputs,
        [key]: current ? `${current} ${word}` : word,
      };
    });
    setWrong((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const removeLastWord = (key) => {
    if (showAnswers || lockedKeys.has(key) || !inputs[key]) return;
    const words = inputs[key].split(" ");
    const returnedWord = words.pop();
    setInputs((current) => ({ ...current, [key]: words.join(" ") }));
    setWrong((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    focusSoon(bankRefs.current.get(`${key.split("_")[0]}-${returnedWord}`));
  };

  const startKeyboardPick = (qId, word, originId) => {
    const targets = [`${qId}_question`, `${qId}_answer`].filter(
      (key) => !lockedKeys.has(key),
    );
    if (!targets.length) return;
    setPicked({ qId, word, originId });
    setFocusedTarget(targets[0]);
    focusSoon(targetRefs.current.get(targets[0]));
  };

  const handleTargetKeyDown = (event, key) => {
    if (lockedKeys.has(key)) return;
    if (picked) {
      const targets = [`${picked.qId}_question`, `${picked.qId}_answer`].filter(
        (target) => !lockedKeys.has(target),
      );
      if (event.key === "Escape") {
        event.preventDefault();
        const origin = picked.originId;
        setPicked(null);
        setFocusedTarget(null);
        focusSoon(bankRefs.current.get(origin));
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const { word, originId } = picked;
        appendWord(key, word);
        setPicked(null);
        setFocusedTarget(null);
        focusSoon(bankRefs.current.get(originId));
      } else if (event.key === "Tab" && targets.length) {
        event.preventDefault();
        const currentIndex = Math.max(0, targets.indexOf(key));
        const direction = event.shiftKey ? -1 : 1;
        const next = targets[(currentIndex + direction + targets.length) % targets.length];
        setFocusedTarget(next);
        focusSoon(targetRefs.current.get(next));
      }
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && inputs[key]) {
      event.preventDefault();
      removeLastWord(key);
    }
  };

  const checkAnswers = () => {
    if (showAnswers || lockedKeys.size === questions.length * 2) return;
    // ❌ فحص إذا في input فاضي
    const hasEmptyInput = questions.some(
      (q) =>
        !inputs[`${q.id}_question`]?.trim() ||
        !inputs[`${q.id}_answer`]?.trim(),
    );

    if (hasEmptyInput) {
      ValidationAlert.info(
        "Oops!",
        "Please answer all the questions before checking.",
      );
      return;
    }

    let wrongTemp = {};
    const nextLocked = new Set(lockedKeys);
    let score = 0;
    const total = questions.length * 2;

    questions.forEach((q) => {
      if (inputs[`${q.id}_question`] !== q.questionCorrect) {
        wrongTemp[`${q.id}_question`] = true;
      } else {
        score++;
        nextLocked.add(`${q.id}_question`);
      }

      if (inputs[`${q.id}_answer`] !== q.answerCorrect) {
        wrongTemp[`${q.id}_answer`] = true;
      } else {
        score++;
        nextLocked.add(`${q.id}_answer`);
      }
    });

    setWrong(wrongTemp);
    setLockedKeys(nextLocked);
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
      </span>
    </div>
  `;
    if (total === score) {
      return ValidationAlert.success(msg);
    } else if (score === 0) {
      return ValidationAlert.error(msg);
    } else {
      return ValidationAlert.warning(msg);
    }
  };

  // ⭐ Show Correct Answers
  const showCorrectAnswers = () => {
    let filled = {};

    questions.forEach((q) => {
      filled[`${q.id}_question`] = q.questionCorrect;
      filled[`${q.id}_answer`] = q.answerCorrect;
    });

    setInputs(filled);
    setWrong({});
    setShowAnswers(true);
    setLockedKeys(
      new Set(questions.flatMap((q) => [`${q.id}_question`, `${q.id}_answer`])),
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div style={{ gap: "20px" }} className="div-forall">
          <ExerciseHeaderReview
            sectionLetter="C"
            title="Unscramble and write."
            subTitle="Put the words in order to make the question and yes or no answer."
          />
          {/* <Droppable droppableId="global-bank" direction="horizontal">
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
                  flexWrap: "wrap",
                }}
              >
                {buildGlobalWordBank().map((word, i) => (
                  <Draggable
                    key={`global-${word}-${i}`}
                    draggableId={`global-${word}-${i}`}
                    index={i}
                    isDragDisabled={showAnswers}
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
          </Droppable> */}

          <div className="content-container-review10-p1-q3">
            {questions.map((q, index) => (
              <div key={q.id} className="section-one11-review10-p1-q3">
                <div style={{ display: "flex", width: "100%", height: "100%" }}>
                  <div className="input-container-review10-p1-q3">
                    <div style={{ display: "flex" }}>
                      <span className="num2">{index + 1}</span>
                      <input
                        readOnly
                        value={q.scramble}
                        className="answer-input-review10-p1-q3"
                      />
                    </div>
                    {/* 🔹 Word Bank خاص بالسؤال */}
                    <Droppable
                      droppableId={`bank-${q.id}`}
                      direction="horizontal"
                    >
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
                            marginBottom: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          {buildQuestionWordBank(q).map((word, i) => (
                            <Draggable
                              key={`${q.id}-${word}-${i}`}
                              draggableId={`${q.id}-${word}-${i}`}
                              index={i}
                              isDragDisabled={
                                showAnswers ||
                                ([`${q.id}_question`, `${q.id}_answer`].every((key) =>
                                  lockedKeys.has(key),
                                ))
                              }
                            >
                              {(provided) => (
                                <div
                                  ref={(node) => {
                                    provided.innerRef(node);
                                    if (node) bankRefs.current.set(`${q.id}-${word}`, node);
                                    else bankRefs.current.delete(`${q.id}-${word}`);
                                  }}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  role="button"
                                  tabIndex={picked ? -1 : 0}
                                  aria-label={`Pick up ${word} for item ${index + 1}.`}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      startKeyboardPick(q.id, word, `${q.id}-${word}`);
                                    }
                                  }}
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
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {/* Unscramble input */}
                    <div style={{ position: "relative" }}>
                      <Droppable
                        droppableId={`${q.id}_question`}
                        isDropDisabled={showAnswers || lockedKeys.has(`${q.id}_question`)}
                      >
                        {(provided, snapshot) => {
                          const key = `${q.id}_question`;
                          const preview = picked?.qId === q.id && focusedTarget === key;
                          const value = inputs[key] || "";
                          return (
                            <input
                            ref={(node) => {
                              provided.innerRef(node);
                              if (node) targetRefs.current.set(key, node);
                              else targetRefs.current.delete(key);
                            }}
                            {...provided.droppableProps}
                            readOnly
                            role="button"
                            tabIndex={lockedKeys.has(key) ? -1 : picked?.qId === q.id || value ? 0 : -1}
                            aria-label={preview ? `Place ${picked.word} in the question line.` : value ? `${value}. Press Enter or Space to remove the last word.` : "Empty question line."}
                            onClick={() => value && removeLastWord(key)}
                            onKeyDown={(event) => handleTargetKeyDown(event, key)}
                            value={preview ? `${value}${value ? " " : ""}${picked.word}` : value}
                            className={`answer-input33-review10-p1-q3 ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            } ${preview ? "review-keyboard-drop-preview" : ""}`}
                          />
                          );
                        }}
                      </Droppable>

                      {wrong[`${q.id}_question`] && (
                        <span className="error-mark-input1">✕</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="content-input-review10-p1-q3">
                  {/* Scramble */}
                  <img
                    src={q.img}
                    alt={q.alt}
                    className="p9-q1-img2"
                    style={{ height: "160px", width: "auto" }}
                  />
                  {/* Answer input */}
                  <div style={{ position: "relative", width: "100%" }}>
                    <Droppable
                      droppableId={`${q.id}_answer`}
                      isDropDisabled={showAnswers || lockedKeys.has(`${q.id}_answer`)}
                    >
                      {(provided, snapshot) => {
                        const key = `${q.id}_answer`;
                        const preview = picked?.qId === q.id && focusedTarget === key;
                        const value = inputs[key] || "";
                        return (
                          <input
                          ref={(node) => {
                            provided.innerRef(node);
                            if (node) targetRefs.current.set(key, node);
                            else targetRefs.current.delete(key);
                          }}
                          {...provided.droppableProps}
                          readOnly
                          role="button"
                          tabIndex={lockedKeys.has(key) ? -1 : picked?.qId === q.id || value ? 0 : -1}
                          aria-label={preview ? `Place ${picked.word} in the answer line.` : value ? `${value}. Press Enter or Space to remove the last word.` : "Empty answer line."}
                          onClick={() => value && removeLastWord(key)}
                          onKeyDown={(event) => handleTargetKeyDown(event, key)}
                          value={preview ? `${value}${value ? " " : ""}${picked.word}` : value}
                          className={`answer-input3-review10-p1-q3 ${
                            snapshot.isDraggingOver ? "drag-over-cell" : ""
                          } ${preview ? "review-keyboard-drop-preview" : ""}`}
                        />
                        );
                      }}
                    </Droppable>

                    {wrong[`${q.id}_answer`] && (
                      <span className="error-mark-input1">✕</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ⭐ Buttons */}
          <div className="action-buttons-container">
            <button
              className="try-again-button"
              onClick={() => {
                setInputs({});
                setWrong({});
                setShowAnswers(false);
                setLockedKeys(new Set());
                setPicked(null);
                setFocusedTarget(null);
              }}
            >
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

export default Review10_Page1_Q3;
