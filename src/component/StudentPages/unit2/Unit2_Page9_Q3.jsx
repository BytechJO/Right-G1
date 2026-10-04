import React, { useRef, useState } from "react";

import "./Unit2_Page9_Q3.css";

import jello from "../../../assets/img_unit2/imgs/jello.jpg";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import balloons from "../../../assets/img_unit2/imgs/balloons..jpg";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  id,
  word,
  disabled,
  isUsed,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    data: {
      word,
      source: "bank",
    },

    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked =
    keyboardPickedWord?.word === word && keyboardPickedWord?.source === "bank";

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[word] = el;
      }}
      {...(isDisabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${word} selected. Choose a blank and press Enter.`
          : `${word}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (isDisabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(word);

          return;
        }

        listeners?.onKeyDown?.(e);
      }}
      style={{
        padding: "7px 14px",

        border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : isUsed ? "#f0f2f5" : "white",

        fontWeight: "bold",

        cursor: isDisabled ? "default" : "grab",

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

/* =====================================================
   PLACED WORD
===================================================== */

const PlacedWord = ({
  word,
  slotId,

  locked,
  showAnswers,
  checkCompleted,

  onKeyboardPickPlaced,

  placedRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${slotId}`,

    data: {
      word,
      source: "slot",
      sourceSlotId: slotId,
    },

    disabled: locked || showAnswers || checkCompleted,
  });

  const disabled = locked || showAnswers || checkCompleted;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        placedRefs.current[slotId] = el;
      }}
      {...(disabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? -1 : 0}
      aria-label={
        disabled
          ? undefined
          : `${word}. Press Enter or Space to move this word.`
      }
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPickPlaced(word, slotId);
        }
      }}
      className="placed-word-unit2-p9-q3"
      style={{
        cursor: disabled ? "default" : "grab",

        opacity: isDragging ? 0.4 : 1,

        userSelect: "none",

        display: "inline-flex",

        alignItems: "center",

        touchAction: "none",
      }}
    >
      {word}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DroppableSlot = ({
  id,
  slotId,

  value,
  isWrong,

  showAnswers,
  locked,
  checkCompleted,

  keyboardPickedWord,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,
  placedRefs,

  getAvailableSlotIds,

  onKeyboardDrop,
  onKeyboardPickPlaced,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: showAnswers || locked || checkCompleted,
  });

  const keyboardActive =
    !!keyboardPickedWord && !locked && !showAnswers && !checkCompleted;

  const showKeyboardPreview = keyboardActive && focusedSlotId === id;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        slotRefs.current[slotId] = el;
      }}
      className={`drop-slot-q3 ${
        isOver && !locked && !showAnswers ? "drag-over-cell" : ""
      } ${showKeyboardPreview ? "keyboard-slot-active-p9-q3" : ""}`}
      role={keyboardActive ? "button" : undefined}
      tabIndex={keyboardActive ? 0 : -1}
      aria-label={
        keyboardActive
          ? value
            ? `Blank contains ${value}. Press Enter to place ${keyboardPickedWord.word}.`
            : `Empty blank. Press Enter to place ${keyboardPickedWord.word}.`
          : undefined
      }
      onFocus={(e) => {
        if (!keyboardActive) {
          e.currentTarget.blur();

          setFocusedSlotId(null);

          return;
        }

        setFocusedSlotId(id);
      }}
      onBlur={() => {
        setFocusedSlotId(null);
      }}
      onKeyDown={(e) => {
        if (!keyboardActive) {
          return;
        }

        /* =========================================
           TAB BETWEEN AVAILABLE SLOTS
        ========================================= */

        if (e.key === "Tab") {
          e.preventDefault();
          e.stopPropagation();

          const available = getAvailableSlotIds();

          if (available.length === 0) {
            return;
          }

          const currentIndex = available.indexOf(slotId);

          let nextIndex;

          if (e.shiftKey) {
            nextIndex =
              currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
          } else {
            nextIndex =
              currentIndex === -1 || currentIndex === available.length - 1
                ? 0
                : currentIndex + 1;
          }

          const nextSlotId = available[nextIndex];

          slotRefs.current[nextSlotId]?.focus();

          return;
        }

        /* =========================================
           ENTER / SPACE = PLACE
        ========================================= */

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardDrop(slotId);
        }
      }}
    >
      {showKeyboardPreview ? (
        <span className="keyboard-word-preview-p9-q3" aria-hidden="true">
          {keyboardPickedWord.word}
        </span>
      ) : value ? (
        <PlacedWord
          word={value}
          slotId={slotId}
          locked={locked}
          showAnswers={showAnswers}
          checkCompleted={checkCompleted}
          onKeyboardPickPlaced={onKeyboardPickPlaced}
          placedRefs={placedRefs}
        />
      ) : null}

      {isWrong && !showAnswers && <span className="error-badge-P9-Q3">✕</span>}
    </span>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit2_Page9_Q3 = () => {
  const [answers, setAnswers] = useState({});

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswers, setShowAnswers] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  const placedRefs = useRef({});

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =====================================================
     CORRECT ANSWERS
  ===================================================== */

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

  const slotOrder = ["input1", "input2", "input3"];

  const getAvailableSlotIds = () =>
    slotOrder.filter(
      (slotId) => !isSlotLocked(slotId) && !showAnswers && !checkCompleted,
    );

  /* =====================================================
     KEYBOARD PICK FROM BANK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswers || checkCompleted || usedWords.has(word)) {
      return;
    }

    setKeyboardPickedWord({
      word,
      source: "bank",
    });

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PICK FROM PLACED SLOT
  ===================================================== */

  const handleKeyboardPickPlaced = (word, sourceSlotId) => {
    if (showAnswers || checkCompleted || isSlotLocked(sourceSlotId)) {
      return;
    }

    setKeyboardPickedWord({
      word,

      source: "slot",

      sourceSlotId,
    });

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

      const firstOther = available.find((id) => id !== sourceSlotId);

      const target = firstOther ?? available[0];

      if (!target) {
        return;
      }

      slotRefs.current[target]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DROP
     SWAP / REPLACE
  ===================================================== */

  const handleKeyboardDrop = (targetSlotId) => {
    if (
      !keyboardPickedWord ||
      showAnswers ||
      checkCompleted ||
      isSlotLocked(targetSlotId)
    ) {
      return;
    }

    const picked = keyboardPickedWord;

    const updated = {
      ...answers,
    };

    const oldTargetWord = updated[targetSlotId];

    /* =========================================
         FROM SLOT -> SWAP
      ========================================= */

    if (picked.source === "slot" && picked.sourceSlotId) {
      const sourceSlotId = picked.sourceSlotId;

      if (sourceSlotId === targetSlotId) {
        setKeyboardPickedWord(null);

        setFocusedSlotId(null);

        return;
      }

      if (isSlotLocked(sourceSlotId)) {
        return;
      }

      if (oldTargetWord) {
        updated[sourceSlotId] = oldTargetWord;
      } else {
        delete updated[sourceSlotId];
      }
    }

    updated[targetSlotId] = picked.word;

    setAnswers(updated);

    /* =========================================
         REMOVE X ONLY FROM CHANGED SLOTS
      ========================================= */

    setWrongWords((prev) =>
      prev.filter((id) => id !== targetSlotId && id !== picked.sourceSlotId),
    );

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    setTimeout(() => {
      if (picked.source === "slot") {
        placedRefs.current[targetSlotId]?.focus();
      } else {
        bankRefs.current[picked.word]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     REMOVE ANSWER
  ===================================================== */

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

    setWrongWords((prev) => prev.filter((id) => id !== slotId));
  };

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
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const onDragStart = ({ active }) => {
    const data = active.data.current;

    if (data?.word) {
      setActiveWord(data.word);

      return;
    }

    setActiveWord(null);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswers || checkCompleted) {
      return;
    }

    const overId = String(over.id);

    if (!overId.startsWith("slot-")) {
      return;
    }

    const slotId = overId.replace("slot-", "");

    if (isSlotLocked(slotId)) {
      return;
    }

    const data = active.data.current;

    if (!data?.word) {
      return;
    }

    const { word, source, sourceSlotId } = data;

    const updated = {
      ...answers,
    };

    const oldTargetWord = updated[slotId];

    /* =========================================
       FROM SLOT -> SWAP
    ========================================= */

    if (source === "slot" && sourceSlotId) {
      if (isSlotLocked(sourceSlotId)) {
        return;
      }

      if (sourceSlotId === slotId) {
        return;
      }

      if (oldTargetWord) {
        updated[sourceSlotId] = oldTargetWord;
      } else {
        delete updated[sourceSlotId];
      }
    } else {
      /*
        BANK:
        remove same word from any old slot
      */

      Object.keys(updated).forEach((key) => {
        if (updated[key] === word) {
          delete updated[key];
        }
      });
    }

    updated[slotId] = word;

    setAnswers(updated);

    setWrongWords((prev) =>
      prev.filter((id) => id !== slotId && id !== sourceSlotId),
    );
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswers || checkCompleted) {
      return;
    }

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

    /* ====================================================
       LOCK CORRECT ONLY
    ==================================================== */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...correctSlots])));

    /* ====================================================
       WRONG ONLY
    ==================================================== */

    setWrongWords(wrong);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

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

    /* ====================================================
       ALL CORRECT
    ==================================================== */

    if (correctCount === total) {
      setLockedSlots(correctMatches.map((item) => item.num));

      setWrongWords([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

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

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAll = () => {
    setAnswers({});

    setWrongWords([]);

    setLockedSlots([]);

    setShowAnswers(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     QUESTIONS
  ===================================================== */

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

  /* =====================================================
     RENDER
  ===================================================== */

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
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
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
                      slotId={q.id}
                      value={getValue(q.id)}
                      isWrong={wrongWords.includes(q.id)}
                      locked={locked}
                      showAnswers={showAnswers}
                      checkCompleted={checkCompleted}
                      keyboardPickedWord={keyboardPickedWord}
                      focusedSlotId={focusedSlotId}
                      setFocusedSlotId={setFocusedSlotId}
                      slotRefs={slotRefs}
                      placedRefs={placedRefs}
                      getAvailableSlotIds={getAvailableSlotIds}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardPickPlaced={handleKeyboardPickPlaced}
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
