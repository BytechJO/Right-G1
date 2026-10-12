/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState } from "react";
import deer from "../../../assets/U1 WB/U9/U9P54EXEI-01.svg";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import oneAudio from "../../../assets/U1 WB/U9/audio/page54 - I/Item_001_one.mp3";
import twoAudio from "../../../assets/U1 WB/U9/audio/page54 - I/Item_002_two.mp3";
import threeAudio from "../../../assets/U1 WB/U9/audio/page54 - I/Item_003_three.mp3";
import thereAreAudio from "../../../assets/U1 WB/U9/audio/page54 - I/There are.mp3";
import cowsAudio from "../../../assets/U1 WB/U9/audio/page54 - I/cows.mp3";
import catsAudio from "../../../assets/U1 WB/U9/audio/page54 - I/cats.mp3";
import dogAudio from "../../../assets/U1 WB/U9/audio/page54 - I/dog.mp3";
import full1Audio from "../../../assets/U1 WB/U9/audio/page54 - I/full1.mp3";
import full2Audio from "../../../assets/U1 WB/U9/audio/page54 - I/full2.mp3";
import full3Audio from "../../../assets/U1 WB/U9/audio/page54 - I/full3.mp3";
import "./WB_Unit9_Page4_Q2.css";

// ─────────────────────────────────────────────
const correctData = ["one", "two", "three"];

const wordBank = [
  { id: "w1", text: "one" },
  { id: "w2", text: "two" },
  { id: "w3", text: "three" },
];

const questions = [
  { prefix: "There are", blank: true, suffix: "cows.", useIs: false },
  { prefix: "There are", blank: true, suffix: "cats.", useIs: false },
  { prefix: "There is", blank: true, suffix: "dog.", useIs: true },
];

const getWordText = (id) => wordBank.find((w) => w.id === id)?.text || "";

// ── Draggable word chip ───────────────────────
function DraggableWord({
  id,
  text,
  disabled,
  onKeyboardPick,
  onPlay,
  playing,
  bankRef,
}) {
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
      className="wb-unit9-audio-control"
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Pick ${text}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onKeyboardPick();
        }
      }}
      onClick={onPlay}
      style={{
        padding: "8px 16px",
        border: "2px solid #0d47a1",
        borderRadius: "8px",
        background: "#fff",
        fontWeight: "600",
        cursor: disabled ? "default" : "grab",
        opacity: isDragging || disabled ? 0.4 : 1,
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {playing && <Unit9PlayingAudioIcon />}
      {text}
    </div>
  );
}

// ── Droppable answer cell ─────────────────────
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
      className={`q-input-wb-unit9-p4-q2 ${isOver ? "drag-over-cell" : ""}`}
      style={{
        background: isOver ? "#e3f2fd" : "white",
        cursor: !disabled && displayText ? "pointer" : "default",
        display: "flex",
        flex: "1 1 0",
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => !disabled && displayText && onClear(id)}
      role="button"
      tabIndex={!disabled && (keyboardActive || displayText) ? 0 : -1}
      aria-label={
        displayText
          ? `${displayText}. Press Enter to remove`
          : "Empty answer box"
      }
      onKeyDown={onKeyDown}
    >
      {preview ? (
        <span className="keyboard-drag-preview-wb-unit9-p4-q2">{preview}</span>
      ) : (
        displayText
      )}
      {isWrong && <span className="wrong-icon-review6-p1-q3">✕</span>}
    </div>
  );
}

// ── Main component ────────────────────────────
const WB_Unit9_Page4_Q2 = () => {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [showResult, setShowResult] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [keyboardItem, setKeyboardItem] = useState(null);
  const [keyboardTarget, setKeyboardTarget] = useState(null);
  const bankRefs = useRef({});
  const targetRefs = useRef({});
  const { activeAudioKey, playAudio } = useUnit9Audio();
  const wordAudios = { w1: oneAudio, w2: twoAudio, w3: threeAudio };
  const nounAudios = [cowsAudio, catsAudio, dogAudio];
  const fullAudios = [full1Audio, full2Audio, full3Audio];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const activeText = activeId
    ? (wordBank.find((w) => w.id === activeId)?.text ?? null)
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
      // إزالة الكلمة من أي خلية ثانية
      copy.forEach((val, i) => {
        if (val === draggableId) copy[i] = "";
      });
      copy[index] = draggableId;
      return copy;
    });

    setShowResult((current) =>
      current.map((result, resultIndex) =>
        resultIndex === index ? undefined : result,
      ),
    );
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
    setShowResult((current) =>
      current.map((result, resultIndex) =>
        resultIndex === index ? undefined : result,
      ),
    );
    if (returnFocus)
      requestAnimationFrame(() => bankRefs.current[returnedId]?.focus());
  };

  const availableTargets = questions
    .map((_, index) => index)
    .filter((index) => !lockedSlots.includes(index));

  const pickWithKeyboard = (id) => {
    if (showAnswer || answers.includes(id)) return;
    const first = availableTargets[0];
    if (first === undefined) return;
    setKeyboardItem(id);
    setKeyboardTarget(first);
    requestAnimationFrame(() => targetRefs.current[first]?.focus());
  };

  const focusNextBank = (id) => {
    const index = wordBank.findIndex((word) => word.id === id);
    for (let step = 1; step <= wordBank.length; step += 1) {
      const next = wordBank[(index + step) % wordBank.length];
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
      setAnswers((current) => {
        const next = current.map((value) => (value === item ? "" : value));
        next[index] = item;
        return next;
      });
      setShowResult((current) =>
        current.map((result, resultIndex) =>
          resultIndex === index ? undefined : result,
        ),
      );
      setKeyboardItem(null);
      setKeyboardTarget(null);
      focusNextBank(item);
    }
  };

  // ── Buttons ──
  const showCorrectAnswers = () => {
    setShowAnswer(true);
    setLockedSlots(questions.map((_, index) => index));
    setShowResult([]);
    setAnswers(
      correctData.map(
        (word) => wordBank.find((w) => w.text === word)?.id || "",
      ),
    );
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    if (answers.includes("")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    const results = answers.map((val, i) =>
      getWordText(val) === correctData[i] ? "correct" : "wrong",
    );

    setShowResult(results);
    setLockedSlots(
      results
        .map((result, index) => (result === "correct" ? index : null))
        .filter((index) => index !== null),
    );

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

  const reset = () => {
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
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall" style={{ gap: "10px" }}>
          <ExerciseHeader
            sectionLetter="I"
            title="Count and write."
            subTitle="Count the cows, cats, and dog, then place the correct number word in each sentence."
          />

          {/* ── Word bank ── */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "12px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {wordBank.map((w) => (
              <DraggableWord
                key={w.id}
                id={w.id}
                text={w.text}
                disabled={showAnswer || answers.includes(w.id)}
                onKeyboardPick={() => {
                  playAudio(`number-${w.id}`, wordAudios[w.id]);
                  pickWithKeyboard(w.id);
                }}
                onPlay={() => playAudio(`number-${w.id}`, wordAudios[w.id])}
                playing={activeAudioKey === `number-${w.id}`}
                bankRef={(element) => {
                  bankRefs.current[w.id] = element;
                }}
              />
            ))}
          </div>

          {/* ── Questions + image ── */}
          <div className="content-wb-unit9-p4-q2 w-full">
            <div className="group-input-unit5-p5-q3">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className={`wb-unit9-audio-control ${lockedSlots.includes(index) ? "wb-unit9-completed-audio" : ""}`}
                  role={lockedSlots.includes(index) ? "button" : undefined}
                  tabIndex={lockedSlots.includes(index) ? 0 : undefined}
                  aria-label={
                    lockedSlots.includes(index)
                      ? `Play complete sentence ${index + 1}`
                      : undefined
                  }
                  onClick={() => {
                    if (lockedSlots.includes(index))
                      playAudio(`full-${index}`, fullAudios[index]);
                  }}
                  onKeyDown={(event) => {
                    if (
                      lockedSlots.includes(index) &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      playAudio(`full-${index}`, fullAudios[index]);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "10px",
                    width: "100%",
                    // flexWrap: "wrap",
                  }}
                >
                  {activeAudioKey === `full-${index}` && (
                    <Unit9PlayingAudioIcon />
                  )}
                  {/* رقم السؤال */}
                  <span
                    className="q-number"
                    style={{
                      color: "#0d47a1",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {index + 1}.
                  </span>

                  {/* نص البداية */}
                  <span
                    className="wb-unit9-audio-control cursor-pointer"
                    role={lockedSlots.includes(index) ? undefined : "button"}
                    tabIndex={lockedSlots.includes(index) ? -1 : 0}
                    aria-label={`Play ${q.prefix}`}
                    onClick={(event) => {
                      if (lockedSlots.includes(index)) return;
                      event.stopPropagation();
                      playAudio(
                        `prefix-${index}`,
                        index === 2 ? full3Audio : thereAreAudio,
                      );
                    }}
                    onKeyDown={(event) => {
                      if (
                        !lockedSlots.includes(index) &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        event.stopPropagation();
                        playAudio(
                          `prefix-${index}`,
                          index === 2 ? full3Audio : thereAreAudio,
                        );
                      }
                    }}
                    style={{
                      fontWeight: "500",
                      width: "100px",
                      fontSize: "17px",
                    }}
                  >
                    {activeAudioKey === `prefix-${index}` && (
                      <Unit9PlayingAudioIcon />
                    )}
                    {q.prefix}
                  </span>

                  {/* خلية الإجابة */}
                  <DroppableCell
                    id={`drop-${index}`}
                    displayText={getWordText(answers[index])}
                    isOver={overId === `drop-${index}`}
                    isWrong={showResult[index] === "wrong"}
                    disabled={showAnswer || lockedSlots.includes(index)}
                    onClear={handleClear}
                    preview={
                      keyboardItem && keyboardTarget === index
                        ? getWordText(keyboardItem)
                        : ""
                    }
                    keyboardActive={Boolean(keyboardItem)}
                    onKeyDown={(event) => handleTargetKeyDown(event, index)}
                    targetRef={(element) => {
                      targetRefs.current[index] = element;
                    }}
                  />

                  {/* نص النهاية */}
                  <span
                    className="wb-unit9-audio-control cursor-pointer"
                    role={lockedSlots.includes(index) ? undefined : "button"}
                    tabIndex={lockedSlots.includes(index) ? -1 : 0}
                    aria-label={`Play ${q.suffix}`}
                    onClick={(event) => {
                      if (lockedSlots.includes(index)) return;
                      event.stopPropagation();
                      playAudio(`noun-${index}`, nounAudios[index]);
                    }}
                    onKeyDown={(event) => {
                      if (
                        !lockedSlots.includes(index) &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        event.stopPropagation();
                        playAudio(`noun-${index}`, nounAudios[index]);
                      }
                    }}
                    style={{ fontWeight: "500", fontSize: "17px" }}
                  >
                    {activeAudioKey === `noun-${index}` && (
                      <Unit9PlayingAudioIcon />
                    )}
                    {q.suffix}
                  </span>
                </div>
              ))}
            </div>

            <img
              src={deer}
              className="shape-img-wb-unit9-p4-q2"
              alt="Farm scene with animals to count"
              style={{ height: "300px", width: "auto" }}
            />
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>
          <button className="show-answer-btn" onClick={showCorrectAnswers}>
            Show Answer
          </button>
          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* ── Drag overlay ── */}
      <DragOverlay>
        {activeText ? (
          <div
            style={{
              padding: "8px 16px",
              border: "2px solid #0d47a1",
              borderRadius: "8px",
              background: "#fff",
              fontWeight: "600",
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

export default WB_Unit9_Page4_Q2;
