/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import horsesAudio from "../../../assets/U1 WB/U9/audio/page52- E/item-001-how-many-horses-are-there.mp3";
import chickensAudio from "../../../assets/U1 WB/U9/audio/page52- E/item-002-how-many_chikens.mp3";
import catsAudio from "../../../assets/U1 WB/U9/audio/page52- E/item-003-how-many-cats-are-there-there-is.mp3";
import img1 from "../../../assets/U1 WB/U9/U9P52EXEE-01.svg";
import img2 from "../../../assets/U1 WB/U9/U9P52EXEE-02.svg";
import img3 from "../../../assets/U1 WB/U9/U9P52EXEE-03.svg";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import "./WB_Unit9_Page2_Q3.css";

// ─────────────────────────────────────────────
const correctData = ["2", "3", "1"];

const numberBank = [
  { id: "n1", text: "1" },
  { id: "n2", text: "2" },
  { id: "n3", text: "3" },
];

const options = [{ img: img1 }, { img: img2 }, { img: img3 }];

const sentences = [
  "How many horses are there? There are two horses.",
  "How many chickens are there? There are five chickens.",
  "How many cats are there? There is one cat.",
];
const sentenceAudios = [horsesAudio, chickensAudio, catsAudio];

const getNumberText = (id) => numberBank.find((n) => n.id === id)?.text || "";

// ── Draggable number chip ─────────────────────
function DraggableNumber({ id, text, disabled, onKeyboardPick, bankRef }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
    data: { text },
  });

  return (
    <div
      ref={(element) => { setNodeRef(element); bankRef(element); }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Pick number ${text}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onKeyboardPick();
        }
      }}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "2px solid #2c5287",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        background: "#fff",
        cursor: disabled ? "default" : "grab",
        opacity: isDragging || disabled ? 0.4 : 1,
        touchAction: "none",
      }}
    >
      {text}
    </div>
  );
}

// ── Droppable cell ────────────────────────────
function DroppableCell({
  id,
  displayText,
  isOver,
  isWrong,
  disabled,
  onClear,
  preview,
  keyboardActive,
  onKeyDown,
  targetRef,
}) {
  const { setNodeRef } = useDroppable({ id, disabled });

  return (
    <div
      ref={(element) => { setNodeRef(element); targetRef(element); }}
      className={`wb-unit9-p2-q3-input ${isOver ? "drag-over-cell" : ""}`}
      style={{
        background: isOver ? "#e3f2fd" : "transparent",
        cursor: !disabled && displayText ? "pointer" : "default",
      }}
      onClick={() => !disabled && displayText && onClear(id)}
      role="button"
      tabIndex={!disabled && (keyboardActive || displayText) ? 0 : -1}
      aria-label={displayText ? `Number ${displayText}. Press Enter to remove` : "Empty number box"}
      onKeyDown={onKeyDown}
    >
      {preview ? <span className="keyboard-drag-preview-wb-unit9-p2-q3">{preview}</span> : displayText}
      {isWrong && <div className="unit3-q3-wrong">✕</div>}
    </div>
  );
}

// ── Main component ────────────────────────────
const WB_Unit9_Page2_Q3 = () => {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [keyboardItem, setKeyboardItem] = useState(null);
  const [keyboardTarget, setKeyboardTarget] = useState(null);
  const bankRefs = useRef({});
  const targetRefs = useRef({});
  const { activeAudioKey, playAudio } = useUnit9Audio();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const activeText = activeId
    ? (numberBank.find((n) => n.id === activeId)?.text ?? null)
    : null;

  // ── Drag handlers ──
  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragOver = ({ over }) => setOverId(over ? over.id : null);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setOverId(null);
    if (!over || showAnswer) return;

    const draggableId = active.id;
    const dest = over.id;

    if (!dest.startsWith("drop-")) return;

    const index = Number(dest.replace("drop-", ""));
    if (isNaN(index) || lockedSlots.includes(index)) return;

    setAnswers((prev) => {
      const copy = [...prev];
      copy.forEach((val, i) => {
        if (val === draggableId) copy[i] = "";
      });
      copy[index] = draggableId;
      return copy;
    });

    setShowResult((current) => current.map((result, resultIndex) => resultIndex === index ? undefined : result));
  };

  // ── Click to clear ──
  const handleClear = (cellId, returnFocus = false) => {
    const index = Number(cellId.replace("drop-", ""));
    if (isNaN(index) || lockedSlots.includes(index) || showAnswer) return;
    const returnedId = answers[index];
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = "";
      return copy;
    });
    setShowResult((current) => current.map((result, resultIndex) => resultIndex === index ? undefined : result));
    if (returnFocus) requestAnimationFrame(() => bankRefs.current[returnedId]?.focus());
  };

  const availableTargets = options.map((_, index) => index).filter((index) => !lockedSlots.includes(index));

  const pickWithKeyboard = (id) => {
    if (showAnswer || answers.includes(id)) return;
    const first = availableTargets[0];
    if (first === undefined) return;
    setKeyboardItem(id);
    setKeyboardTarget(first);
    requestAnimationFrame(() => targetRefs.current[first]?.focus());
  };

  const focusNextBank = (id) => {
    const currentIndex = numberBank.findIndex((number) => number.id === id);
    for (let step = 1; step <= numberBank.length; step += 1) {
      const next = numberBank[(currentIndex + step) % numberBank.length];
      if (!answers.includes(next.id) && next.id !== id) {
        requestAnimationFrame(() => bankRefs.current[next.id]?.focus());
        return;
      }
    }
    requestAnimationFrame(() => bankRefs.current[id]?.focus());
  };

  const handleTargetKeyDown = (event, index) => {
    if (!keyboardItem) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClear(`drop-${index}`, true);
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      const origin = keyboardItem;
      setKeyboardItem(null);
      setKeyboardTarget(null);
      requestAnimationFrame(() => bankRefs.current[origin]?.focus());
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const currentIndex = availableTargets.indexOf(index);
      const direction = event.shiftKey ? -1 : 1;
      const next = availableTargets[(currentIndex + direction + availableTargets.length) % availableTargets.length];
      setKeyboardTarget(next);
      targetRefs.current[next]?.focus();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = keyboardItem;
      setAnswers((current) => {
        const next = current.map((value) => value === item ? "" : value);
        next[index] = item;
        return next;
      });
      setShowResult((current) => current.map((result, resultIndex) => resultIndex === index ? undefined : result));
      setKeyboardItem(null);
      setKeyboardTarget(null);
      focusNextBank(item);
    }
  };

  // ── Buttons ──
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setLockedSlots(options.map((_, index) => index));
    setShowResult([]);
    setAnswers(
      correctData.map(
        (num) => numberBank.find((n) => n.text === num)?.id || "",
      ),
    );
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    if (answers.includes("")) {
      ValidationAlert.info("Please fill all answer boxes before checking!");
      return;
    }

    const results = answers.map((val, i) =>
      getNumberText(val) === correctData[i] ? "correct" : "wrong",
    );

    setShowResult(results);
    setLockedSlots(results.map((result, index) => result === "correct" ? index : null).filter((index) => index !== null));

    const correctCount = results.filter((r) => r === "correct").length;
    const total = correctData.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>`;

    if (correctCount === total) ValidationAlert.success(resultHTML);
    else if (correctCount === 0) ValidationAlert.error(resultHTML);
    else ValidationAlert.warning(resultHTML);
  };

  const resetAnswers = () => {
    setAnswers(["", "", ""]);
    setShowResult([]);
    setShowAnswer(false);
    setLockedSlots([]);
    setKeyboardItem(null);
    setKeyboardTarget(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="unit3-q3-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall" style={{ gap: "15px" }}>
          <ExerciseHeader sectionLetter="E" title="Read and number the pictures." subTitle="Read each animal-count sentence and drag its number to the matching picture." />

          {/* ── Number bank ── */}
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: 12,
              border: "2px dashed #ccc",
              borderRadius: 10,
              marginBottom: 20,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {numberBank.map((num) => (
              <DraggableNumber
                key={num.id}
                id={num.id}
                text={num.text}
                disabled={showAnswer || answers.includes(num.id)} // ← هون التعديل
                onKeyboardPick={() => pickWithKeyboard(num.id)}
                bankRef={(element) => { bankRefs.current[num.id] = element; }}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Sentences */}
            <div className="word-container-wb-unit9-p2-q3">
              {sentences.map((item, index) => (
                <div
                  key={index}
                  className="sentence-container-wb-unit7-p5-q1 wb-unit9-audio-control"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play sentence ${index + 1}`}
                  onClick={() => playAudio(`sentence-${index}`, sentenceAudios[index])}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      playAudio(`sentence-${index}`, sentenceAudios[index]);
                    }
                  }}
                >
                  {activeAudioKey === `sentence-${index}` && <Unit9PlayingAudioIcon />}
                  <span className="number-wb-unit7-p5-q1">{index + 1}</span>
                  <p className="sentence-wb-unit8-p1-q1">{item}</p>
                </div>
              ))}
            </div>

            {/* Images + drop cells */}
            <div className="wb-unit9-p2-q3-grid">
              {options.map((item, index) => (
                <div key={index} className="wb-unit9-p2-q3-box">
                  <img src={item.img} alt={`Farm animal picture ${index + 1}`} />

                  <div className="wb-unit9-p2-q3-input-wrapper">
                    <DroppableCell
                      id={`drop-${index}`}
                      displayText={getNumberText(answers[index])}
                      isOver={overId === `drop-${index}`}
                      isWrong={showResult[index] === "wrong"}
                      disabled={showAnswer || lockedSlots.includes(index)}
                      onClear={handleClear}
                      preview={keyboardItem && keyboardTarget === index ? getNumberText(keyboardItem) : ""}
                      keyboardActive={Boolean(keyboardItem)}
                      onKeyDown={(event) => handleTargetKeyDown(event, index)}
                      targetRef={(element) => { targetRefs.current[index] = element; }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
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
        {activeText ? (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #2c5287",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              cursor: "grabbing",
            }}
          >
            {activeText}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit9_Page2_Q3;
