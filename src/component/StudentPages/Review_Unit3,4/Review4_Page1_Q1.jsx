import React, { useRef, useState } from "react";

import conversation from "../../../assets/unit4/imgs/U4P36EXEA-01.svg";
import conversation2 from "../../../assets/unit4/imgs/U4P36EXEA-02.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Review4_Page1_Q1.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DATA
===================================================== */

const clickableAreas = [
  { x: 73, y: 10.5, w: 23.8, h: 11 },
  { x: 72, y: 52.5, w: 24.8, h: 11 },
  { x: 45, y: 52.5, w: 15, h: 11 },
];

const correctAnswers = ["blue", "red", "is this"];

const wordBank = ["red", "blue", "is this"];

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  word,
  id,

  isUsed,
  disabled,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed || disabled,
  });

  const isDisabled = isUsed || disabled;

  const isPicked = keyboardPickedWord === word;

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[word] = el;
      }}
      {...(!isDisabled
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${word} selected. Press Tab to choose an answer box.`
          : `${word}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (isDisabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(word);
        }
      }}
      className={`review4-p1-q1-bank-chip ${
        isPicked ? "keyboard-picked-word-review4-p1-q1" : ""
      }`}
      style={{
        padding: "6px 12px",

        border: `2px solid ${isUsed ? "#b0b0b0" : "#2c5287"}`,

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        color: isUsed ? "#999" : undefined,

        cursor: isDisabled ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.35 : isUsed ? 0.45 : 1,

        transition: "all 0.2s ease",

        userSelect: "none",

        touchAction: "none",
      }}
    >
      {word}
    </div>
  );
};

/* =====================================================
   DROP ZONE
===================================================== */

const DropZone = ({
  id,
  index,
  area,
  value,

  isWrong,
  locked,

  showAnswer,
  checkCompleted,

  keyboardPickedWord,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,

  getAvailableSlotIndexes,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  /* =====================================================
     UPDATED DRAG PATTERN
     أي خانة معبّية ولسا مش locked
     تضل reachable بالـTab حتى قبل Check
  ===================================================== */

  const canEditFilled =
    !!value && !keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === id;

  const displayValue = showPreview ? keyboardPickedWord : value;

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT → RETURN TO BANK
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlotIndexes();

      if (!available.length) {
        return;
      }

      const currentPosition = available.indexOf(index);

      let nextPosition;

      if (e.shiftKey) {
        nextPosition =
          currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
      } else {
        nextPosition =
          currentPosition === -1 || currentPosition === available.length - 1
            ? 0
            : currentPosition + 1;
      }

      const nextIndex = available[nextPosition];

      slotRefs.current[nextIndex]?.focus();

      return;
    }

    /* =========================================
       ENTER / SPACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(index);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <>
      <div
        ref={(el) => {
          setNodeRef(el);

          slotRefs.current[index] = el;
        }}
        className={`review4-p1-q1-drop-zone ${
          isOver && !locked ? "drag-over-cell" : ""
        } ${showPreview ? "keyboard-drop-preview-review4-p1-q1" : ""}`}
        role="button"
        tabIndex={
          locked || showAnswer || checkCompleted
            ? -1
            : keyboardDropActive || canEditFilled
              ? 0
              : -1
        }
        aria-label={
          keyboardDropActive
            ? value
              ? `Answer box ${index + 1}. Current answer ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
              : `Answer box ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}.`
            : canEditFilled
              ? `Answer box ${index + 1} contains ${value}. Press Enter or Space to return it to the word bank.`
              : value
                ? `Answer box ${index + 1}: ${value}`
                : `Empty answer box ${index + 1}`
        }
        onFocus={() => {
          if (keyboardDropActive) {
            setFocusedSlotId(id);
          }
        }}
        onBlur={() => {
          setFocusedSlotId(null);
        }}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (value && !locked && !showAnswer && !checkCompleted) {
            onRemove(id);
          }
        }}
        style={{
          position: "absolute",

          top: `${area.y}%`,

          left: `${area.x}%`,

          width: `${area.w}%`,

          height: `${area.h}%`,

          fontSize: "1.3vw",

          borderRadius: "8px",

          border: "2px solid black",

          cursor:
            value && !locked && !showAnswer && !checkCompleted
              ? "pointer"
              : "default",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        {displayValue || ""}
      </div>

      {isWrong && (
        <div
          className="wrong-icon-review4-p1-q1"
          aria-hidden="true"
          style={{
            position: "absolute",

            top: `calc(${area.y}% - 1.5%)`,

            left: `calc(${area.x}% + ${area.w}% - 4%)`,

            color: "white",
          }}
        >
          ✕
        </div>
      )}
    </>
  );
};
/* =====================================================
   MAIN
===================================================== */

const Review4_Page1_Q1 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [inputs, setInputs] = useState(Array(clickableAreas.length).fill(null));

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedIndexes, setLockedIndexes] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD DRAG
  ===================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =====================================================
     HELPERS
  ===================================================== */

  const activeWord = activeId ? activeId.replace("bank-", "") : null;

  const isWordUsed = (word) => inputs.includes(word);

  const isLocked = (index) => lockedIndexes.includes(index);

  const getAvailableSlotIndexes = () =>
    inputs
      .map((_, index) => index)
      .filter((index) => !isLocked(index) && !showAnswer && !checkCompleted);

  const getFirstAvailableWord = (updatedInputs) => {
    const used = new Set(updatedInputs.filter(Boolean));

    return wordBank.find((word) => !used.has(word));
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
        tolerance: 5,
      },
    }),
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

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("drop-")) {
      return;
    }

    const word = active.id.replace("bank-", "");

    const destIndex = Number(String(over.id).replace("drop-", ""));

    if (isLocked(destIndex)) {
      return;
    }

    let oldIndex = -1;

    setInputs((prev) => {
      const copy = [...prev];

      oldIndex = copy.findIndex((value) => value === word);

      /*
        UNIQUE WORD
      */

      if (oldIndex !== -1 && oldIndex !== destIndex && !isLocked(oldIndex)) {
        copy[oldIndex] = null;
      }

      /*
        REPLACE
      */

      copy[destIndex] = word;

      return copy;
    });

    /*
      شيل X فقط عن
      الخانات اللي تغيرت
    */

    setWrongInputs((prev) =>
      prev.filter((index) => index !== destIndex && index !== oldIndex),
    );
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted || isWordUsed(word)) {
      return;
    }

    setKeyboardPickedWord(word);

    setFocusedSlotId(null);

    requestAnimationFrame(() => {
      const available = getAvailableSlotIndexes();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DROP
  ===================================================== */

  const handleKeyboardDrop = (index) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isLocked(index)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    const updated = [...inputs];

    const oldIndex = updated.findIndex((value) => value === word);

    if (oldIndex !== -1 && oldIndex !== index && !isLocked(oldIndex)) {
      updated[oldIndex] = null;
    }

    updated[index] = word;

    setInputs(updated);

    setWrongInputs((prev) =>
      prev.filter(
        (wrongIndex) => wrongIndex !== index && wrongIndex !== oldIndex,
      ),
    );

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      const nextWord = getFirstAvailableWord(updated);

      if (nextWord) {
        bankRefs.current[nextWord]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     WRONG SLOT AFTER CHECK
  ===================================================== */

  const handleKeyboardClearWrong = (index, currentWord) => {
    if (showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    const updated = [...inputs];

    updated[index] = null;

    setInputs(updated);

    setWrongInputs((prev) => prev.filter((wrongIndex) => wrongIndex !== index));

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (currentWord && bankRefs.current[currentWord]) {
        bankRefs.current[currentWord]?.focus();

        return;
      }

      const nextWord = getFirstAvailableWord(updated);

      if (nextWord) {
        bankRefs.current[nextWord]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     ESCAPE
  ===================================================== */

  const handleCancelKeyboardPick = () => {
    const word = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (word && bankRefs.current[word]) {
        bankRefs.current[word]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     REMOVE WITH MOUSE
  ===================================================== */

  const handleRemove = (dropId) => {
    const index = Number(dropId.replace("drop-", ""));

    if (showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    setInputs((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    /*
      X فقط عن نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((wrongIndex) => wrongIndex !== index));
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const handleCheck = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (inputs.some((value) => value === null)) {
      ValidationAlert.info("Please complete all answers.");

      return;
    }

    const results = inputs.map(
      (value, index) =>
        value?.toLowerCase() === correctAnswers[index].toLowerCase(),
    );

    const wrong = results
      .map((result, index) => (result ? null : index))
      .filter((value) => value !== null);

    const newlyLocked = results
      .map((result, index) => (result ? index : null))
      .filter((value) => value !== null);

    /*
      الصح فقط يقفل
    */

    setLockedIndexes((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      الغلط فقط عليه X
    */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    const correctCount = results.filter(Boolean).length;

    const total = results.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedIndexes(correctAnswers.map((_, index) => index));

      setWrongInputs([]);

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
     RESET
  ===================================================== */

  const handleReset = () => {
    setInputs(Array(clickableAreas.length).fill(null));

    setWrongInputs([]);

    setLockedIndexes([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    setInputs([...correctAnswers]);

    setWrongInputs([]);

    setLockedIndexes(correctAnswers.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div
        style={{
          display: "flex",

          justifyContent: "center",

          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            gap: "60px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="A"
            title="Look, read, and write."
            subTitle="Use the picture clues to drag the correct color words into the dialogue."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "40px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              justifyContent: "center",

              width: "100%",
            }}
          >
            {wordBank.map((word, index) => (
              <BankChip
                key={`${word}-${index}`}
                id={`bank-${word}`}
                word={word}
                isUsed={isWordUsed(word)}
                disabled={showAnswer || checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              IMAGES + DROP ZONES
          ================================================= */}

          <div
            style={{
              position: "relative",

              width: "100%",

              marginTop: "30px",

              maxWidth: "900px",

              aspectRatio: "3 / 1",
            }}
          >
            <img
              src={conversation}
              alt="A dialogue scene showing blue paint and the question What color is this?"
              style={{
                inset: 0,

                width: "auto",

                height: "auto",

                objectFit: "contain",
              }}
            />

            <img
              src={conversation2}
              alt="A dialogue scene showing red paint with incomplete color questions and answers."
              style={{
                inset: 0,

                width: "auto",

                height: "auto",

                objectFit: "contain",
              }}
            />

            {clickableAreas.map((area, index) => (
              <DropZone
                key={index}
                id={`drop-${index}`}
                index={index}
                area={area}
                value={inputs[index]}
                isWrong={wrongInputs.includes(index)}
                locked={isLocked(index)}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                focusedSlotId={focusedSlotId}
                setFocusedSlotId={setFocusedSlotId}
                slotRefs={slotRefs}
                getAvailableSlotIndexes={getAvailableSlotIndexes}
                onKeyboardDrop={handleKeyboardDrop}
                onKeyboardClearWrong={handleKeyboardClearWrong}
                onCancelKeyboardPick={handleCancelKeyboardPick}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button onClick={handleCheck} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord ? (
          <div
            style={{
              padding: "6px 12px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              cursor: "grabbing",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review4_Page1_Q1;
