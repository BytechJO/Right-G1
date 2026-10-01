import React, { useState } from "react";

import "./Unit2_Page9_Q3.css";

import jello from "../../../assets/img_unit2/imgs/jello.jpg";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import balloons from "../../../assets/img_unit2/imgs/balloons..jpg";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

// ─────────────────────────────────────────────────────────────
// DRAGGABLE WORD
// ─────────────────────────────────────────────────────────────

const DraggableWord = ({ id, word, disabled, isUsed }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    disabled: disabled || isUsed,
  });

  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: "7px 14px",

        border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

        borderRadius: "8px",

        background: isUsed ? "#f0f2f5" : "white",

        fontWeight: "bold",

        cursor: disabled || isUsed ? "default" : "grab",

        opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

        color: isUsed ? "#9aa3b0" : "inherit",

        display: "inline-block",

        transition: "all 0.2s ease",

        userSelect: "none",

        touchAction: "none",
      }}
    >
      {word}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// DROP SLOT
// ─────────────────────────────────────────────────────────────

const DroppableSlot = ({
  id,
  value,
  isWrong,
  showAnswers,
  locked,
  onRemove,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: showAnswers || locked,
  });

  return (
    <span
      ref={setNodeRef}
      className={`drop-slot-q3 ${
        isOver && !locked && !showAnswers ? "drag-over-cell" : ""
      }`}
    >
      {value && (
        <span
          className="word-item"
          onClick={!showAnswers && !locked ? onRemove : undefined}
          style={{
            cursor: showAnswers || locked ? "default" : "pointer",

            userSelect: "none",
          }}
          title={showAnswers || locked ? "" : "Click to remove"}
        >
          {value}
        </span>
      )}

      {isWrong && !showAnswers && <span className="error-badge-P9-Q3">✕</span>}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const Unit2_Page9_Q3 = () => {
  const [answers, setAnswers] = useState({});

  const [wrongWords, setWrongWords] = useState([]);

  // الصح فقط يتقفل بعد Check
  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswers, setShowAnswers] = useState(false);

  // يصير true فقط لما كل السؤال ينجح
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  // ─────────────────────────────────────────────────────────
  // CORRECT ANSWERS
  // ─────────────────────────────────────────────────────────

  const correctMatches = [
    {
      input: "It's jello",
      num: "input1",
    },
    {
      input: "It's a present",
      num: "input2",
    },
    {
      input: "These are balloons",
      num: "input3",
    },
  ];

  const wordBank = correctMatches.map((c) => c.input);

  const getValue = (id) => answers[id] || "";

  const usedWords = new Set(Object.values(answers));

  const isSlotLocked = (slotId) => lockedSlots.includes(slotId);

  // ─────────────────────────────────────────────────────────
  // REMOVE ANSWER
  // ─────────────────────────────────────────────────────────

  const removeAnswer = (slotId) => {
    if (showAnswers || checkCompleted || isSlotLocked(slotId)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[slotId];

      return updated;
    });

    /*
      شيل X فقط عن نفس الخانة
    */

    setWrongWords((prev) => prev.filter((id) => id !== slotId));
  };

  // ─────────────────────────────────────────────────────────
  // SENSORS
  // ─────────────────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // ─────────────────────────────────────────────────────────
  // EXTRACT WORD
  // ─────────────────────────────────────────────────────────

  const extractWord = (draggableId) => {
    if (draggableId.startsWith("bank-")) {
      return draggableId.slice("bank-".length);
    }

    if (draggableId.startsWith("placed-")) {
      const parts = draggableId.split("-");

      return parts.slice(2).join("-");
    }

    return null;
  };

  // ─────────────────────────────────────────────────────────
  // DRAG START
  // ─────────────────────────────────────────────────────────

  const onDragStart = ({ active }) => {
    const word = extractWord(active.id);

    setActiveWord(word);
  };

  // ─────────────────────────────────────────────────────────
  // DRAG END
  // ─────────────────────────────────────────────────────────

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswers || checkCompleted) {
      return;
    }

    const word = extractWord(active.id);

    if (!word) {
      return;
    }

    const overId = String(over.id);

    if (!overId.startsWith("slot-")) {
      return;
    }

    const slotId = overId.replace("slot-", "");

    /*
      لو الهدف صح ومقفل
      ممنوع التعديل عليه
    */

    if (isSlotLocked(slotId)) {
      return;
    }

    /*
      نعرف مكان الكلمة القديم قبل setState
    */

    const oldSlotId = Object.keys(answers).find((key) => answers[key] === word);

    /*
      لو الكلمة موجودة بخانة صح مقفلة
      ممنوع نحركها
    */

    if (oldSlotId && isSlotLocked(oldSlotId)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      /*
          Remove word from previous slot
        */

      Object.keys(updated).forEach((key) => {
        if (updated[key] === word) {
          delete updated[key];
        }
      });

      /*
          Place into target
        */

      updated[slotId] = word;

      return updated;
    });

    /*
      X تنشال فقط عن الأماكن اللي تغيرت
    */

    setWrongWords((prev) =>
      prev.filter((id) => id !== slotId && id !== oldSlotId),
    );
  };

  // ─────────────────────────────────────────────────────────
  // CHECK ANSWERS
  // ─────────────────────────────────────────────────────────

  const checkAnswers = () => {
    if (showAnswers || checkCompleted) {
      return;
    }

    /*
        لازم كل الخانات تكون معبّاية
      */

    const allFilled = correctMatches.every(({ num }) => Boolean(answers[num]));

    if (!allFilled) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const correctSlots = [];

    correctMatches.forEach((ans) => {
      if (answers[ans.num] === ans.input) {
        correctCount++;

        correctSlots.push(ans.num);
      } else {
        wrong.push(ans.num);
      }
    });

    // ====================================================
    // LOCK CORRECT ONLY
    // ====================================================

    setLockedSlots((prev) => Array.from(new Set([...prev, ...correctSlots])));

    // ====================================================
    // WRONG ONLY
    // ====================================================

    setWrongWords(wrong);

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    // ====================================================
    // ALL CORRECT
    // ====================================================

    if (correctCount === total) {
      setLockedSlots(correctMatches.map((item) => item.num));

      setWrongWords([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    // ====================================================
    // WRONG / PARTIAL
    // ====================================================

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ─────────────────────────────────────────────────────────
  // SHOW ANSWER
  // ─────────────────────────────────────────────────────────

  const showCorrectAnswers = () => {
    const filled = {};

    correctMatches.forEach((c) => {
      filled[c.num] = c.input;
    });

    setAnswers(filled);

    setWrongWords([]);

    setLockedSlots(correctMatches.map((item) => item.num));

    setShowAnswers(true);

    setCheckCompleted(true);

    setActiveWord(null);
  };

  // ─────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────

  const resetAll = () => {
    setAnswers({});

    setWrongWords([]);

    setLockedSlots([]);

    setShowAnswers(false);

    setCheckCompleted(false);

    setActiveWord(null);
  };

  // ─────────────────────────────────────────────────────────
  // QUESTIONS
  // ─────────────────────────────────────────────────────────

  const questions = [
    {
      id: "input1",

      img: jello,

      label: "What is it?",

      alt: "Jello",
    },

    {
      id: "input2",

      img: present,

      label: "What is it?",

      alt: "A present",
    },

    {
      id: "input3",

      img: balloons,

      label: "What are these?",

      alt: "Balloons",
    },
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div
        style={{
          display: "flex",

          justifyContent: "center",

          padding: "30px",
        }}
      >
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="C"
            title="Look and answer."
            subTitle="Use the picture clues to complete the sentences about jello, a present, and balloons."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              width: "100%",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {wordBank.map((word) => (
              <DraggableWord
                key={word}
                id={`bank-${word}`}
                word={word}
                disabled={showAnswers || checkCompleted}
                isUsed={usedWords.has(word)}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="content-container-P9-Q3">
            {questions.map((q, i) => {
              const locked = isSlotLocked(q.id);

              return (
                <div key={q.id} className="section-q3">
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <span className="num2">{i + 1}</span>

                    <img src={q.img} className="p9-q1-img2" alt={q.alt} />
                  </div>

                  <div className="content-input">
                    <input readOnly value={q.label} />

                    <DroppableSlot
                      id={`slot-${q.id}`}
                      value={getValue(q.id)}
                      isWrong={wrongWords.includes(q.id)}
                      locked={locked}
                      showAnswers={showAnswers}
                      onRemove={() => removeAnswer(q.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

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

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord ? (
          <span
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

              cursor: "grabbing",

              display: "inline-block",
            }}
          >
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit2_Page9_Q3;
