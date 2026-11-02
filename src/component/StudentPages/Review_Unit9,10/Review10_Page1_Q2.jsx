/* eslint-disable react-refresh/only-export-components */
import React, { useState } from "react";

import deer from "../../../assets/unit10/imgs/U10P90EXEB.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review10_Page1_Q2.css";
import breadAudio from "../../../assets/Review_9,10/Page 90 - B/bread.mp3";
import chickenAudio from "../../../assets/Review_9,10/Page 90 - B/chicken.mp3";
import fruitAudio from "../../../assets/Review_9,10/Page 90 - B/fruit.mp3";
import iceCreamAudio from "../../../assets/Review_9,10/Page 90 - B/ice cream.mp3";
import milkAudio from "../../../assets/Review_9,10/Page 90 - B/milk.mp3";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";
import useReviewDragKeyboard from "./useReviewDragKeyboard";

const data = [
  { question: "", correct: "fruit" },
  { question: "", correct: "ice cream" },
  { question: "", correct: "bread" },
  { question: "", correct: "milk" },
  { question: "", correct: "chicken" },
];
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

// ─── Bank chip ────────────────────────────────────────────────────────────────
const BankChip = ({ word, isUsed, locked, onPlay, playing, keyboard }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${word}`,
    disabled: isUsed || locked,
  });

  return (
    <span
      ref={(node) => {
        setNodeRef(node);
        keyboard.registerBank(`bank-${word}`, node);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={keyboard.picked ? -1 : 0}
      aria-label={`${isUsed || locked ? "Play audio" : "Pick up"}: ${word}`}
      className="review-audio-control"
      onClick={onPlay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPlay();
          keyboard.handleBankKeyDown(event, word, `bank-${word}`, !isUsed && !locked);
        }
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: isUsed ? "#e0e0e0" : "white",
        fontWeight: "bold",
        cursor: isUsed || locked ? "not-allowed" : "grab",
        opacity: isUsed ? 0.45 : isDragging ? 0.3 : 1,
        transition: "opacity 0.2s, background 0.2s",
        userSelect: "none",
        color: isUsed ? "#999" : "",
      }}
    >
      {playing && <ReviewPlayingAudioIcon />}
      {word}
    </span>
  );
};

// ─── Drop slot ────────────────────────────────────────────────────────────────
const DropSlot = ({ index, answer, isWrong, locked, onRemove, keyboard }) => {
  const id = `slot-${index}`;
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });
  const preview = keyboard.previewFor(id);

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        keyboard.registerTarget(id, node);
      }}
      role="button"
      tabIndex={keyboard.targetTabIndex(id)}
      aria-label={preview ? `Place ${preview} in blank ${index + 1}.` : answer ? `${answer} in blank ${index + 1}. Press Enter or Space to return it.` : `Blank ${index + 1}.`}
      className={`q-input-unit10-p5-q3${isOver ? " drag-over-cell" : ""}`}
      style={{
        position: "relative",
        background: isOver ? "#e8f0fe" : "transparent",
        transition: "background 0.15s",
        cursor: answer && !locked ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => {
        if (answer && !locked) onRemove(index);
      }}
      onKeyDown={(event) => keyboard.handleTargetKeyDown(event, id)}
      title={answer && !locked ? "Click to remove" : ""}
    >
      {(preview || answer) && (
        <span className={preview ? "review-keyboard-drop-preview" : ""}>
          {preview || answer}
        </span>
      )}

      {isWrong && <span className="wrong-icon-review6-p1-q3">✕</span>}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const Review10_Page1_Q2 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(null));
  const [wrongInputs, setWrongInputs] = useState(new Set());
  const [lockedInputs, setLockedInputs] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();
  const wordAudio = {
    bread: breadAudio,
    chicken: chickenAudio,
    fruit: fruitAudio,
    "ice cream": iceCreamAudio,
    milk: milkAudio,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const usedWords = new Set(answers.filter(Boolean));
  const activeWord = activeId ? activeId.replace("bank-", "") : null;

  const placeWord = (targetId, word) => {
    const index = Number(targetId.replace("slot-", ""));
    if (lockedInputs.has(targetId) || showAnswer) return;
    setAnswers((prev) => {
      const updated = [...prev];
      const oldIndex = updated.findIndex((value) => value === word);
      if (oldIndex !== -1 && !lockedInputs.has(`slot-${oldIndex}`)) updated[oldIndex] = null;
      updated[index] = word;
      return updated;
    });
    setWrongInputs((current) => {
      const next = new Set(current);
      next.delete(index);
      return next;
    });
  };

  const removeByTargetId = (targetId) => {
    const index = Number(targetId.replace("slot-", ""));
    if (lockedInputs.has(targetId) || showAnswer) return;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
    setWrongInputs((current) => {
      const next = new Set(current);
      next.delete(index);
      return next;
    });
  };

  const keyboard = useReviewDragKeyboard({
    targetIds: data.map((_, index) => `slot-${index}`),
    lockedIds: lockedInputs,
    getValue: (targetId) => answers[Number(targetId.replace("slot-", ""))],
    onPlace: placeWord,
    onRemove: removeByTargetId,
  });

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || showAnswer || lockedInputs.has(String(over.id))) return;

    const word = active.id.replace("bank-", "");
    const slotId = over.id;
    if (!slotId.startsWith("slot-")) return;

    placeWord(slotId, word);
  };

  const handleRemove = (index) => {
    removeByTargetId(`slot-${index}`);
  };

  const checkAnswers = () => {
    if (showAnswer || lockedInputs.size === data.length) return;

    if (answers.some((a) => !a)) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    let correctCount = 0;
    const wrong = new Set();
    const nextLocked = new Set(lockedInputs);

    answers.forEach((ans, i) => {
      if (ans === data[i].correct) {
        correctCount++;
        nextLocked.add(`slot-${i}`);
      } else wrong.add(i);
    });

    setWrongInputs(wrong);
    setLockedInputs(nextLocked);

    const color =
      correctCount === data.length
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";
    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">Score: ${correctCount} / ${data.length}</span>
      </div>`;

    if (correctCount === data.length) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const showCorrectAnswers = () => {
    setAnswers(data.map((d) => d.correct));
    setWrongInputs(new Set());
    setLockedInputs(new Set(data.map((_, index) => `slot-${index}`)));
    setShowAnswer(true);
  };

  const reset = () => {
    setAnswers(Array(data.length).fill(null));
    setWrongInputs(new Set());
    setLockedInputs(new Set());
    setShowAnswer(false);
    stopAudio();
  };

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
        <div className="div-forall" style={{ gap: "50px" }}>
          <ExerciseHeaderReview
            sectionLetter="B"
            title="Look and write."
            subTitle="Use the numbered table to drag fruit, ice cream, bread, milk, and chicken into the lines."
          />

          {/* ── Word Bank ── */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "10px",
              width: "100%",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {data.map((item) => (
              <BankChip
                key={item.correct}
                word={item.correct}
                isUsed={usedWords.has(item.correct)}
                locked={showAnswer}
                onPlay={() => playAudio(`bank-${item.correct}`, wordAudio[item.correct])}
                playing={activeAudioKey === `bank-${item.correct}`}
                keyboard={keyboard}
              />
            ))}
          </div>

          {/* ── Questions ── */}
          <div
            className="content-unit5-p5-q3 w-full"
            style={{ flexDirection: "row-reverse" }}
          >
            <div className="group-input-unit5-p5-q3">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="question-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "10px",
                  }}
                >
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

                  <DropSlot
                    index={index}
                    answer={answers[index]}
                    isWrong={wrongInputs.has(index)}
                    locked={lockedInputs.has(`slot-${index}`) || showAnswer}
                    onRemove={handleRemove}
                    keyboard={keyboard}
                  />
                </div>
              ))}
            </div>

            <img
              src={deer}
              className="shape-img-unit5-p5-q3"
              alt="A numbered party table showing fruit, ice cream, bread, milk, and chicken."
              style={{ height: "200px", width: "auto" }}
            />
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>
          <button
            className="show-answer-btn swal-continue"
            onClick={showCorrectAnswers}
          >
            Show Answer
          </button>
          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
          </button>
        </div>
      </div>

      {/* ── Drag Overlay ── */}
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
              color: "#2c5287",
            }}
          >
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review10_Page1_Q2;
