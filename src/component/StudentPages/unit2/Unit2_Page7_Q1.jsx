import React, { useState } from "react";
import "./Unit2_Page7_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";

import { useDraggable, useDroppable } from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DRAGGABLE NUMBER
===================================================== */

function DraggableNumber({ item, isDragDisabled }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `num-${item.num}`,
    disabled: isDragDisabled,
  });

  return (
    <div className="word-number-unit2-p7-q1">
      <span
        ref={setNodeRef}
        className="num-word"
        style={{
          opacity: isDragging ? 0.4 : 1,
          cursor: isDragDisabled ? "default" : "grab",
          touchAction: "none",
        }}
        {...listeners}
        {...attributes}
      >
        {item.num}
      </span>

      <span className="word-label">{item.word}</span>
    </div>
  );
}

/* =====================================================
   DROPPABLE SLOT
===================================================== */

function DroppableSlot({ id, value, isWrong, isChecked, isLocked }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: isLocked,
  });

  return (
    <div ref={setNodeRef} className="input-wrapper1">
      <div
        className={[
          "input-sentence",

          isChecked && isWrong ? "wrong-input1" : "",

          isOver && !isLocked ? "drag-over-cell" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value || ""}
      </div>

      {isChecked && isWrong && <span className="wrong-icon">✕</span>}
    </div>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit2_Page7_Q1 = () => {
  const words = [
    { word: "Good", num: 1 },
    { word: "evening", num: 2 },
    { word: "Goodbye", num: 3 },
    { word: "afternoon", num: 4 },
    { word: "!", num: 5 },
    { word: "Hello", num: 6 },
    { word: "How", num: 7 },
    { word: "morning", num: 8 },
    { word: "Fine", num: 9 },
    { word: "?", num: 10 },
    { word: "are", num: 11 },
    { word: "thank", num: 12 },
    { word: ",", num: 13 },
    { word: "I'm Helen", num: 14 },
    { word: "you", num: 15 },
    { word: ".", num: 16 },
  ];

  const correctAnswers2 = {
    a: ["How", "are", "you", "?"],
    b: ["Good", "morning", "!"],
    c: ["Fine", ",", "thank", "you", "."],
    d: ["Goodbye", "!"],
    e: ["Hello", "!", "I'm Helen", "."],
    f: ["Good", "afternoon", "!"],
  };

  const sentences = {
    a: [7, 11, 15, 10],
    b: [1, 8, 5],
    c: [9, 13, 12, 15, 16],
    d: [3, 5],
    e: [6, 5, 14, 16],
    f: [1, 4, 5],
  };

  /* =====================================================
     STATES
  ===================================================== */

  const [userAnswers, setUserAnswers] = useState({});

  const [checked, setChecked] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  const [wrongInputs, setWrongInputs] = useState({});

  // slots الصح اللي تنقفل بعد Check
  const [lockedInputs, setLockedInputs] = useState({});

  // بعد Check كامل وصحيح
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     SENSORS
  ===================================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),

    useSensor(KeyboardSensor),
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer) {
      return;
    }

    const overId = over.id;

    if (!overId.startsWith("slot-")) {
      return;
    }

    const [, key, indexStr] = overId.split("-");

    const index = Number(indexStr);

    /* =============================
       لو الخانة صح ومقفلة
    ============================= */

    if (lockedInputs[key]?.[index]) {
      return;
    }

    const num = Number(active.id.replace("num-", ""));

    const draggedWord = words.find((word) => word.num === num)?.word;

    if (!draggedWord) {
      return;
    }

    /* =============================
       SET ANSWER
    ============================= */

    setUserAnswers((prev) => {
      const updated = {
        ...prev,
      };

      if (!updated[key]) {
        updated[key] = [];
      } else {
        updated[key] = [...updated[key]];
      }

      updated[key][index] = draggedWord;

      return updated;
    });

    /* =============================
       REMOVE WRONG ONLY FROM
       EDITED SLOT
    ============================= */

    setWrongInputs((prev) => {
      const updated = {
        ...prev,
      };

      if (updated[key]) {
        updated[key] = [...updated[key]];

        updated[key][index] = false;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    // بعد النجاح النهائي
    // Check ما يعمل شيء
    if (showAnswer || checkCompleted) {
      return;
    }

    /* =============================
       CHECK ALL FILLED
    ============================= */

    for (const key in sentences) {
      const expectedLength = sentences[key].length;

      if (!userAnswers[key]) {
        ValidationAlert.info(
          "Oops!",
          "Please fill all fields before checking.",
        );

        return;
      }

      for (let i = 0; i < expectedLength; i++) {
        if (!userAnswers[key][i]) {
          ValidationAlert.info(
            "Oops!",
            "Please fill all fields before checking.",
          );

          return;
        }
      }
    }

    /* =============================
       CHECK VALUES
    ============================= */

    let tempScore = 0;

    let totalInputs = 0;

    const newWrongInputs = {};

    const newLockedInputs = {};

    for (const key in sentences) {
      totalInputs += sentences[key].length;

      newWrongInputs[key] = [];

      newLockedInputs[key] = [];

      sentences[key].forEach((_, index) => {
        const entered = userAnswers[key][index]?.toLowerCase();

        const correct = correctAnswers2[key][index].toLowerCase();

        if (entered !== correct) {
          newWrongInputs[key][index] = true;

          newLockedInputs[key][index] = false;
        } else {
          newWrongInputs[key][index] = false;

          newLockedInputs[key][index] = true;

          tempScore++;
        }
      });
    }

    /* =============================
       KEEP OLD LOCKED +
       ADD NEW CORRECT
    ============================= */

    setLockedInputs((prev) => {
      const updated = {
        ...prev,
      };

      for (const key in newLockedInputs) {
        const oldRow = updated[key] ? [...updated[key]] : [];

        const newRow = newLockedInputs[key];

        updated[key] = newRow.map((value, index) => oldRow[index] || value);
      }

      return updated;
    });

    setWrongInputs(newWrongInputs);

    setChecked(true);

    /* =============================
       SCORE
    ============================= */

    const color =
      tempScore === totalInputs ? "green" : tempScore === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${tempScore} / ${totalInputs}
        </span>
      </div>
    `;

    /* =============================
       ALL CORRECT
    ============================= */

    if (tempScore === totalInputs) {
      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    /* =============================
       WRONG / PARTIAL
    ============================= */

    if (tempScore === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    setUserAnswers(correctAnswers2);

    setShowAnswer(true);

    setChecked(false);

    setWrongInputs({});

    /* lock all */

    const allLocked = {};

    for (const key in sentences) {
      allLocked[key] = sentences[key].map(() => true);
    }

    setLockedInputs(allLocked);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setUserAnswers({});

    setChecked(false);

    setShowAnswer(false);

    setWrongInputs({});

    setLockedInputs({});

    setCheckCompleted(false);

    setActiveId(null);
  };

  /* =====================================================
     ACTIVE WORD
  ===================================================== */

  const activeWord = activeId
    ? words.find((word) => word.num === Number(activeId.replace("num-", "")))
        ?.word
    : null;

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
            gap: "20px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            title="Read and write."
            subTitle="Match each number to its letter to reveal the hidden words."
          />

          {/* ============================================
              WORD BANK
          ============================================ */}

          <div className="number-word-section">
            {words.map((item) => (
              <DraggableNumber
                key={item.num}
                item={item}
                // المصدر يضل draggable
                // إلا بعد Show Answer فقط
                isDragDisabled={showAnswer}
              />
            ))}
          </div>

          {/* ============================================
              SENTENCE SLOTS
          ============================================ */}

          <div className="num-input-section">
            {Object.entries(sentences).map(([key, correctArray]) => (
              <div key={key} className="sentence-row">
                <span className="sentence-label">{key}</span>

                {/* NUMBERS */}

                <div className="num-container">
                  {correctArray.map((num, index) => (
                    <span key={index} className="sentence-preview">
                      {num}
                    </span>
                  ))}
                </div>

                {/* ANSWERS */}

                <div className="sentence-line">
                  {correctArray.map((_, index) => (
                    <DroppableSlot
                      key={index}
                      id={`slot-${key}-${index}`}
                      value={userAnswers[key]?.[index]}
                      isWrong={!!wrongInputs[key]?.[index]}
                      isChecked={checked}
                      isLocked={!!lockedInputs[key]?.[index]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================
            BUTTONS
        ============================================ */}

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* ============================================
          DRAG OVERLAY
      ============================================ */}

      <DragOverlay>
        {activeWord ? (
          <div
            style={{
              padding: "6px 14px",

              background: "#fff",

              border: "2px solid #4a90e2",

              borderRadius: "8px",

              fontWeight: "bold",

              fontSize: "16px",

              width: "110px",

              textAlign: "center",

              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",

              pointerEvents: "none",

              userSelect: "none",
            }}
          >
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit2_Page7_Q1;
