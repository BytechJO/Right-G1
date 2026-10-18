/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState } from "react";
import "./WB_Unit9_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U9/U9P56EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U9/U9P56EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U9/U9P56EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U9/U9P56EXEA-04.svg";
import img5 from "../../../assets/U1 WB/U9/U9P56EXEA-05.svg";
import img6 from "../../../assets/U1 WB/U9/U9P56EXEA-06.svg";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import nightAudio from "../../../assets/unit9/sound/Page 80 - A 1/night.mp3";
import momAudio from "../../../assets/unit9/sound/Page 80 - A 1/mom.mp3";
import nurseAudio from "../../../assets/unit9/sound/Page 80 - A 1/nurse.mp3";
import milkAudio from "../../../assets/unit9/sound/Page 80 - A 1/milk.mp3";
import nestAudio from "../../../assets/U1 WB/U9/audio/page56- A/Item_014_nest.mp3";
import manAudio from "../../../assets/U1 WB/U9/audio/page56- A/Item_002_man.mp3";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

// ─────────────────────────────────────────────
const data = [
  { img: img1, answer: "n", pattern: "ight", audio: nightAudio },
  { img: img2, answer: "m", pattern: "an", audio: manAudio },
  { img: img3, answer: "m", pattern: "om", audio: momAudio },
  { img: img4, answer: "n", pattern: "urse", audio: nurseAudio },
  { img: img5, answer: "m", pattern: "ilk", audio: milkAudio },
  { img: img6, answer: "n", pattern: "est", audio: nestAudio },
];

const letterBank = [
  { id: "l-m", text: "m" },
  { id: "l-n", text: "n" },
];

const getLetterText = (id) => letterBank.find((l) => l.id === id)?.text || "";

// ── Draggable letter chip ─────────────────────
function DraggableLetter({ id, text, disabled, onKeyboardPick, bankRef }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
    data: { text },
  });

  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        bankRef(element);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Pick letter ${text}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onKeyboardPick();
        }
      }}
      style={{
        width: "45px",
        height: "45px",
        fontSize: "24px",
        fontWeight: "700",
        border: "2px solid #0d47a1",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        cursor: disabled ? "default" : "grab",
        opacity: isDragging || disabled ? 0.4 : 1,
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {text}
    </div>
  );
}

// ── Droppable letter cell ─────────────────────
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
      ref={(element) => {
        setNodeRef(element);
        targetRef(element);
      }}
      className={`text-input ${isOver ? "drag-over-cell" : ""}`}
      style={{
        background: isOver ? "#e3f2fd" : "white",
        fontSize: "25px",
        width: "30px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: !disabled && displayText ? "pointer" : "default",
        position: "relative",
      }}
      onClick={() => !disabled && displayText && onClear(id)}
      role="button"
      tabIndex={!disabled && (keyboardActive || displayText) ? 0 : -1}
      aria-label={
        displayText
          ? `Letter ${displayText}. Press Enter to remove`
          : "Empty letter box"
      }
      onKeyDown={onKeyDown}
    >
      {preview ? (
        <span className="keyboard-drag-preview-wb-unit9-p6-q1">{preview}</span>
      ) : (
        displayText
      )}
      {isWrong && <div className="error-icon">✕</div>}
    </div>
  );
}

// ── Main component ────────────────────────────
const WB_Unit9_Page6_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false),
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [keyboardItem, setKeyboardItem] = useState(null);
  const [keyboardTarget, setKeyboardTarget] = useState(null);
  const bankRefs = useRef({});
  const targetRefs = useRef({});
  const { activeAudioKey, playAudio } = useUnit9Audio();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const activeText = activeId
    ? (letterBank.find((l) => l.id === activeId)?.text ?? null)
    : null;

  // ── Drag handlers ──
  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragOver = ({ over }) => setOverId(over ? over.id : null);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setOverId(null);
    if (!over || showAnswer) return;

    const dest = over.id;
    if (!dest.startsWith("drop-")) return;

    const index = Number(dest.replace("drop-", ""));
    if (isNaN(index) || lockedSlots.includes(index)) return;

    setInputs((prev) => {
      const copy = [...prev];
      copy[index] = active.id;
      return copy;
    });

    setWrongInputs((current) =>
      current.map((wrong, wrongIndex) =>
        wrongIndex === index ? false : wrong,
      ),
    );
  };

  // ── Click to clear ──
  const handleClear = (cellId, returnFocus = false) => {
    const index = Number(cellId.replace("drop-", ""));
    if (isNaN(index) || lockedSlots.includes(index) || showAnswer) return;
    const returnedId = inputs[index];
    setInputs((prev) => {
      const copy = [...prev];
      copy[index] = "";
      return copy;
    });
    setWrongInputs((current) =>
      current.map((wrong, wrongIndex) =>
        wrongIndex === index ? false : wrong,
      ),
    );
    if (returnFocus)
      requestAnimationFrame(() => bankRefs.current[returnedId]?.focus());
  };

  const availableTargets = data
    .map((_, index) => index)
    .filter((index) => !lockedSlots.includes(index));

  const pickWithKeyboard = (id) => {
    if (showAnswer) return;
    const first = availableTargets[0];
    if (first === undefined) return;
    setKeyboardItem(id);
    setKeyboardTarget(first);
    requestAnimationFrame(() => targetRefs.current[first]?.focus());
  };

  const focusNextBank = (id) => {
    const index = letterBank.findIndex((letter) => letter.id === id);
    const next = letterBank[(index + 1) % letterBank.length];
    requestAnimationFrame(() => bankRefs.current[next.id]?.focus());
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
      const current = availableTargets.indexOf(index);
      const direction = event.shiftKey ? -1 : 1;
      const next =
        availableTargets[
          (current + direction + availableTargets.length) %
            availableTargets.length
        ];
      setKeyboardTarget(next);
      targetRefs.current[next]?.focus();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = keyboardItem;
      setInputs((current) =>
        current.map((value, valueIndex) =>
          valueIndex === index ? item : value,
        ),
      );
      setWrongInputs((current) =>
        current.map((wrong, wrongIndex) =>
          wrongIndex === index ? false : wrong,
        ),
      );
      setKeyboardItem(null);
      setKeyboardTarget(null);
      focusNextBank(item);
    }
  };

  // ── Buttons ──
  const handleShowAnswer = () => {
    setInputs(
      data.map(
        (item) => letterBank.find((l) => l.text === item.answer)?.id || "",
      ),
    );
    setWrongInputs(Array(data.length).fill(false));
    setShowAnswer(true);
    setLockedSlots(data.map((_, index) => index));
  };

  const checkAnswers = () => {
    if (showAnswer || lockedSlots.length === data.length) return;

    if (inputs.some((val) => val === "")) {
      ValidationAlert.info("Please fill in all the answers before checking.");
      return;
    }

    let correctCount = 0;
    const wrongFlags = data.map((item, i) => {
      const isCorrect = getLetterText(inputs[i]) === item.answer;
      if (isCorrect) correctCount++;
      return !isCorrect;
    });

    setWrongInputs(wrongFlags);
    setLockedSlots(
      wrongFlags
        .map((wrong, index) => (!wrong ? index : null))
        .filter((index) => index !== null),
    );

    const total = data.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>`;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setInputs(Array(data.length).fill(""));
    setWrongInputs(Array(data.length).fill(false));
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
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            // width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            title="Write the missing letters. Say the words."
            subTitle="Say each word and drag m or n into the blank."
          />

          {/* ── Letter bank ── */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "12px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              justifyContent: "center",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            {letterBank.map((l) => (
              <DraggableLetter
                key={l.id}
                id={l.id}
                text={l.text}
                disabled={showAnswer}
                onKeyboardPick={() => pickWithKeyboard(l.id)}
                bankRef={(element) => {
                  bankRefs.current[l.id] = element;
                }}
              />
            ))}
          </div>

          {/* ── Cards grid ── */}
          <div className="unscramble-row-wb-unit9-p6-q1">
            {data.map((item, index) => (
              <div
                className={`unscramble-box-wb-unit9-p6-q1 wb-unit9-audio-control ${lockedSlots.includes(index) && item.audio ? "wb-unit9-completed-audio" : ""}`}
                key={index}
                role={
                  lockedSlots.includes(index) && item.audio
                    ? "button"
                    : undefined
                }
                tabIndex={
                  lockedSlots.includes(index) && item.audio ? 0 : undefined
                }
                aria-label={
                  lockedSlots.includes(index) && item.audio
                    ? `Play ${item.answer}${item.pattern}`
                    : undefined
                }
                onClick={() => {
                  if (lockedSlots.includes(index) && item.audio)
                    playAudio(`word-${index}`, item.audio);
                }}
                onKeyDown={(event) => {
                  if (
                    lockedSlots.includes(index) &&
                    item.audio &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    playAudio(`word-${index}`, item.audio);
                  }
                }}
              >
                {activeAudioKey === `word-${index}` && (
                  <Unit9PlayingAudioIcon />
                )}
                <div className="img-box-wb-unit9-p6-q1">
                  <img
                    src={item.img}
                    alt={`${item.answer}${item.pattern}`}
                    style={{ height: "110px" }}
                  />
                </div>

                <div className="input-row">
                  <span
                    style={{ fontSize: "25px", fontWeight: "600" }}
                    className="num"
                  >
                    {index + 1}
                  </span>

                  <div
                    className="input-wrapper"
                    style={{ width: "fit-content" }}
                  >
                    <DroppableCell
                      id={`drop-${index}`}
                      displayText={getLetterText(inputs[index])}
                      isOver={overId === `drop-${index}`}
                      isWrong={wrongInputs[index]}
                      disabled={showAnswer || lockedSlots.includes(index)}
                      onClear={handleClear}
                      preview={
                        keyboardItem && keyboardTarget === index
                          ? getLetterText(keyboardItem)
                          : ""
                      }
                      keyboardActive={Boolean(keyboardItem)}
                      onKeyDown={(event) => handleTargetKeyDown(event, index)}
                      targetRef={(element) => {
                        targetRefs.current[index] = element;
                      }}
                    />
                  </div>

                  <span className="pattern" style={{ fontSize: "22px" }}>
                    {item.pattern}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Action buttons ── */}
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
        {activeText ? (
          <div
            style={{
              width: "45px",
              height: "45px",
              fontSize: "24px",
              fontWeight: "700",
              border: "2px solid #0d47a1",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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

export default WB_Unit9_Page6_Q1;
