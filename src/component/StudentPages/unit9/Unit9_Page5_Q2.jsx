/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState } from "react";
import bat from "../../../assets/unit9/imgs/U9P80EXEA2-01.svg";
import cap from "../../../assets/unit9/imgs/U9P80EXEA2-02.svg";
import ant from "../../../assets/unit9/imgs/U9P80EXEA2-03.svg";
import dad from "../../../assets/unit9/imgs/U9P80EXEA2-04.svg";
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
  pointerWithin,
} from "@dnd-kit/core";
import "./Unit9_Page5_Q2.css";
import sound from "../../../assets/unit9/sound/cd73pg80-instruction1-adult-lady_f0VzTUFD.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

// ── Draggable letter chip ─────────────────────────────────────────────────────
function DraggableLetter({
  letter,
  disabled,
  isFaded,
  isSelected,
  onKeyboardPick,
  registerRef,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `letter-${letter}`,
    disabled,
  });

  return (
    <span
      ref={(node) => {
        setNodeRef(node);
        registerRef(letter, node);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`Letter ${letter}. Press Enter or Space to select it.`}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onKeyboardPick(letter);
        }
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: "white",
        fontWeight: "bold",
        cursor: disabled ? "default" : "grab",
        fontSize: "22px",
        touchAction: "none",
        opacity: isDragging || isFaded ? 0.35 : disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      {letter}
    </span>
  );
}

// ── Droppable slot ────────────────────────────────────────────────────────────
function DroppableSlot({
  slotId,
  index,
  answer,
  children,
  isDropDisabled,
  selectedLetter,
  onPlace,
  onRemove,
  onCancel,
  onMove,
  onFocus,
  showPreview,
  registerRef,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
    disabled: isDropDisabled,
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        registerRef(index, node);
      }}
      role="button"
      tabIndex={isDropDisabled ? -1 : selectedLetter || answer ? 0 : -1}
      aria-disabled={isDropDisabled}
      onFocus={onFocus}
      aria-label={
        isDropDisabled
          ? `Blank ${index + 1} is correct and locked.`
          : selectedLetter
            ? `Blank ${index + 1}. Press Enter or Space to place ${selectedLetter}.`
            : answer
              ? `Blank ${index + 1} contains ${answer}. Press Enter or Space to remove it.`
              : `Blank ${index + 1}. Select a letter first.`
      }
      onKeyDown={(e) => {
        if (isDropDisabled) return;
        if (selectedLetter && e.key === "Tab") {
          e.preventDefault();
          onMove(index, e.shiftKey);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (selectedLetter) onPlace(index);
          else if (answer) onRemove(index);
        } else if (selectedLetter && e.key === "Escape") {
          e.preventDefault();
          onCancel();
        }
      }}
      className={`q-input-unit9-p5-q2 ${isOver ? "drag-over-cell" : ""}`}
      style={{ position: "relative" }}
    >
      {showPreview && (
        <span className="keyboard-drop-preview" aria-hidden="true">
          {selectedLetter}
        </span>
      )}
      {children}
    </div>
  );
}

// ── Droppable bank ────────────────────────────────────────────────────────────
function DroppableBank({ children, isDropDisabled }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "bank",
    disabled: isDropDisabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        gap: "10px",
        padding: "10px",
        border: `2px dashed ${isOver ? "#2c5287" : "#ccc"}`,
        borderRadius: "10px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

// ── المكوّن الرئيسي ───────────────────────────────────────────────────────────
const Unit9_Page5_Q2 = () => {
  const correctAnswers = ["m", "n", "n", "m"];
  const letters = ["m", "n"];

  const rows = [{ img: bat }, { img: cap }, { img: ant }, { img: dad }];
  const captions = [
    {
      start: 0.219,
      end: 2.44,
      text: "Page 80, Right Activities.",
    },
    {
      start: 2.779,
      end: 4.88,
      text: "Exercise A, number 2.",
    },
    {
      start: 5.639,
      end: 8.059,
      text: "Does it begin with M or N?",
    },
    {
      start: 8.72,
      end: 9.979,
      text: "Listen and write.",
    },
    {
      start: 10.899,
      end: 12.34,
      text: "One, mouse.",
    },
    {
      start: 12.92,
      end: 14.5,
      text: "Two, net.",
    },
    {
      start: 14.979,
      end: 16.639,
      text: "Three, nail.",
    },
    {
      start: 17.359,
      end: 19.179,
      text: "Four, men.",
    },
  ];

  const [answers, setAnswers] = useState([null, null, null, null]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [lockedInputs, setLockedInputs] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [allCompleted, setAllCompleted] = useState(false);
  const [focusedSlotIndex, setFocusedSlotIndex] = useState(null);
  const letterRefs = useRef({});
  const slotRefs = useRef([]);

  const stopAtSecond = 9.979;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 8 },
    }),
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || showAnswer || allCompleted) return;

    const value = active.id.replace("letter-", "");

    if (over.id === "bank") return; // الحروف قابلة للتكرار، ما نعمل شي

    if (over.id.startsWith("slot-")) {
      const index = Number(over.id.split("-")[1]);
      if (lockedInputs.includes(index)) return;
      setAnswers((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
      setWrongInputs((prev) => prev.filter((item) => item !== index));
    }
  };

  // كبس على الحرف داخل الـ slot → يُمسح
  const handleRemoveFromSlot = (index) => {
    if (showAnswer || lockedInputs.includes(index)) return;
    const letter = answers[index];
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
    setWrongInputs((prev) => prev.filter((item) => item !== index));
    if (letter) {
      requestAnimationFrame(() => letterRefs.current[letter]?.focus());
    }
  };

  const availableSlots = () =>
    rows
      .map((_, index) => index)
      .filter((index) => !lockedInputs.includes(index));

  const handleKeyboardPick = (letter) => {
    if (showAnswer || allCompleted) return;
    setSelectedLetter(letter);
    const first = availableSlots()[0];
    if (first !== undefined)
      requestAnimationFrame(() => slotRefs.current[first]?.focus());
  };

  const placeSelectedLetter = (index) => {
    if (!selectedLetter || lockedInputs.includes(index)) return;
    const letter = selectedLetter;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = letter;
      return updated;
    });
    setWrongInputs((prev) => prev.filter((item) => item !== index));
    setSelectedLetter(null);
    setFocusedSlotIndex(null);
    const currentIndex = letters.indexOf(letter);
    const nextLetter = letters[(currentIndex + 1) % letters.length];
    requestAnimationFrame(() => letterRefs.current[nextLetter]?.focus());
  };

  const cancelSelection = () => {
    const letter = selectedLetter;
    setSelectedLetter(null);
    setFocusedSlotIndex(null);
    requestAnimationFrame(() => letterRefs.current[letter]?.focus());
  };

  const moveSlotFocus = (current, backwards) => {
    const slots = availableSlots();
    const position = slots.indexOf(current);
    const next = backwards
      ? slots[(position <= 0 ? slots.length : position) - 1]
      : slots[(position + 1) % slots.length];
    requestAnimationFrame(() => slotRefs.current[next]?.focus());
  };

  const handleShowAnswer = () => {
    setAnswers([...correctAnswers]);
    setWrongInputs([]);
    setShowAnswer(true);
    setLockedInputs(rows.map((_, index) => index));
    setAllCompleted(true);
    setSelectedLetter(null);
    setFocusedSlotIndex(null);
  };

  const checkAnswers = () => {
    if (showAnswer || allCompleted) return;

    if (answers.some((ans) => !ans || ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        tempScore++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    const newlyLocked = answers
      .map((answer, index) => (answer === correctAnswers[index] ? index : null))
      .filter((index) => index !== null);
    setLockedInputs((prev) => [...new Set([...prev, ...newlyLocked])]);
    if (tempScore === correctAnswers.length) setAllCompleted(true);
    setSelectedLetter(null);
    setFocusedSlotIndex(null);

    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${tempScore} / ${total}
        </span>
      </div>
    `;

    if (tempScore === total) ValidationAlert.success(scoreMessage);
    else if (tempScore === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setAnswers([null, null, null, null]);
    setWrongInputs([]);
    setShowAnswer(false);
    setActiveId(null);
    setLockedInputs([]);
    setSelectedLetter(null);
    setFocusedSlotIndex(null);
    setAllCompleted(false);
  };

  const dragLetter = activeId ? activeId.replace("letter-", "") : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="question-wrapper-unit3-page6-q1"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall" style={{ gap: "40px" }}>
          <ExerciseHeader
            sectionLetter="A"
            questionNumber="2"
            title={
              <>
                Does it begin with <span style={{ color: "red" }}>m</span> or{" "}
                <span style={{ color: "red" }}>n</span>? Listen and write.
              </>
            }
            subTitle="Listen to each picture name, then drag m or n into the blank."
          />

          <QuestionAudioPlayer
            src={sound}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId="unit9-page80-QA2"
          />

          {/* ── Letter bank: الحروف دايماً موجودة (قابلة للتكرار) ── */}
          <DroppableBank isDropDisabled={showAnswer || allCompleted}>
            {letters.map((letter) => (
              <DraggableLetter
                key={letter}
                letter={letter}
                disabled={showAnswer || allCompleted}
                isFaded={activeId === `letter-${letter}`}
                isSelected={selectedLetter === letter}
                onKeyboardPick={handleKeyboardPick}
                registerRef={(value, node) => {
                  if (node) letterRefs.current[value] = node;
                }}
              />
            ))}
          </DroppableBank>

          <div className="row-content10-unit3-page6-q1 w-full">
            {rows.map((row, index) => (
              <div className="row2-unit3-page6-q1" key={index}>
                <div style={{ display: "flex", gap: "15px" }}>
                  <span className="num-span">{index + 1}</span>
                  <img
                    src={row.img}
                    alt={`Picture ${index + 1} for choosing its beginning letter.`}
                    className="q-img-unit3-page6-q1"
                  />
                </div>
                <span style={{ position: "relative", display: "flex" }}>
                  <div className="input-wrapper-unit3-page6-q1">
                    <DroppableSlot
                      slotId={`slot-${index}`}
                      index={index}
                      answer={answers[index]}
                      isDropDisabled={
                        showAnswer || lockedInputs.includes(index)
                      }
                      selectedLetter={selectedLetter}
                      onPlace={placeSelectedLetter}
                      onRemove={handleRemoveFromSlot}
                      onCancel={cancelSelection}
                      onMove={moveSlotFocus}
                      onFocus={() => setFocusedSlotIndex(index)}
                      showPreview={
                        Boolean(selectedLetter) && focusedSlotIndex === index
                      }
                      registerRef={(slotIndex, node) => {
                        if (node) slotRefs.current[slotIndex] = node;
                      }}
                    >
                      {answers[index] && (
                        <span
                          onClick={() => handleRemoveFromSlot(index)}
                          aria-hidden="true"
                          style={{ cursor: showAnswer ? "default" : "pointer" }}
                        >
                          {answers[index]}
                        </span>
                      )}
                    </DroppableSlot>

                    {wrongInputs.includes(index) && (
                      <span className="error-mark-input" aria-hidden="true">
                        ✕
                      </span>
                    )}
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

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

      {/* ── Drag overlay ── */}
      <DragOverlay>
        {dragLetter && (
          <span
            style={{
              padding: "7px 14px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "white",
              fontWeight: "bold",
              fontSize: "22px",
              cursor: "grabbing",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {dragLetter}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit9_Page5_Q2;
