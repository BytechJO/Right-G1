/* eslint-disable react-refresh/only-export-components */
import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review10_Page2_Q3.css";
import img1 from "../../../assets/unit10/imgs/U10P91EXEF-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P91EXEF-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P91EXEF-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P91EXEF-04.svg";
import img5 from "../../../assets/unit10/imgs/U10P91EXEF-05.svg";
import img6 from "../../../assets/unit10/imgs/U10P91EXEF-06.svg";
import bedAudio from "../../../assets/Review_9,10/Page 91 - F/bed.mp3";
import eggAudio from "../../../assets/Review_9,10/Page 91 - F/egg.mp3";
import eggsAudio from "../../../assets/Review_9,10/Page 91 - F/eggs.mp3";
import henAudio from "../../../assets/Review_9,10/Page 91 - F/hen.mp3";
import isInAudio from "../../../assets/Review_9,10/Page 91 - F/is in.mp3";
import isInTheAudio from "../../../assets/Review_9,10/Page 91 - F/is in the.mp3";
import jetAudio from "../../../assets/Review_9,10/Page 91 - F/jet.mp3";
import netAudio from "../../../assets/Review_9,10/Page 91 - F/net.mp3";
import tenAudio from "../../../assets/Review_9,10/Page 91 - F/ten.mp3";
import theAudio from "../../../assets/Review_9,10/Page 91 - F/The.mp3";
import theLittleAudio from "../../../assets/Review_9,10/Page 91 - F/The little.mp3";
import withAudio from "../../../assets/Review_9,10/Page 91 - F/with.mp3";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";
import useReviewDragKeyboard from "./useReviewDragKeyboard";
import full1 from "../../../assets/Review_9,10/Page 91 - F/full1.mp3";
import full2 from "../../../assets/Review_9,10/Page 91 - F/full2.mp3";
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const data = [
  {
    parts: [
      {
        before: "The little",
        beforeAudio: theLittleAudio,
        middleImg: img1,
        imageAlt: "A small hen.",
        imageAudio: henAudio,
        after: "",
      },
      {
        before: "is in",
        beforeAudio: isInAudio,
        middleImg: img2,
        imageAlt: "A bed.",
        imageAudio: bedAudio,
        after: "",
      },
      {
        before: "with",
        beforeAudio: withAudio,
        middleImg: img3,
        imageAlt: "The number ten.",
        imageAudio: tenAudio,
        after: "",
      },
      {
        before: "",
        middleImg: img4,
        imageAlt: "An egg.",
        imageAudio: eggsAudio,
        after: "s.",
      },
    ],

    correct: ["hen", "bed", "ten", "egg"],

    fullAudio: full1,
  },

  {
    parts: [
      {
        before: "The",
        beforeAudio: theAudio,
        middleImg: img5,
        imageAlt: "A fishing net.",
        imageAudio: netAudio,
        after: "",
      },
      {
        before: " is in the ",
        beforeAudio: isInTheAudio,
        middleImg: img6,
        imageAlt: "A passenger jet.",
        imageAudio: jetAudio,
        after: ".",
      },
    ],

    correct: ["net", "jet"],

    fullAudio: full2,
  },
];

const bankWords = Array.from(new Set(data.flatMap((d) => d.correct)));

// ─── Bank Chip (Draggable) ─────────────────────────────────────────────────────

const BankChip = ({
  word,
  index,
  isUsed,
  locked,
  onPlay,
  playing,
  keyboard,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${word}-${index}`,
    disabled: isUsed || locked,
  });

  return (
    <div
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
          keyboard.handleBankKeyDown(
            event,
            word,
            `bank-${word}`,
            !isUsed && !locked,
          );
        }
      }}
      style={{
        padding: "7px 14px",
        border: `2px solid ${isUsed ? "#b0b0b0" : "#2c5287"}`,
        borderRadius: "8px",
        background: isUsed ? "#e0e0e0" : "white",
        fontWeight: "bold",
        color: isUsed ? "#999" : undefined,
        cursor:
          isUsed || locked ? "not-allowed" : isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.35 : 1,
        transition:
          "opacity 0.2s, background 0.2s, border-color 0.2s, color 0.2s",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {playing && <ReviewPlayingAudioIcon />}
      {word}
    </div>
  );
};

// ─── Slot Drop Zone (Droppable) ───────────────────────────────────────────────

const SlotDropZone = ({ id, value, isWrong, locked, onRemove, keyboard }) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });
  const preview = keyboard.previewFor(id);

  return (
    <div className="input-wrapper-review10-p2-q3">
      <input
        ref={(node) => {
          setNodeRef(node);
          keyboard.registerTarget(id, node);
        }}
        className={`letter-input-review10-p2-q3 ${isOver ? "drag-over-cell" : ""} ${preview ? "review-keyboard-drop-preview" : ""}`}
        value={preview || value || ""}
        readOnly
        role="button"
        tabIndex={keyboard.targetTabIndex(id)}
        aria-label={
          preview
            ? `Place ${preview} here.`
            : value
              ? `${value}. Press Enter or Space to return it.`
              : "Empty word blank."
        }
        onKeyDown={(event) => keyboard.handleTargetKeyDown(event, id)}
        onClick={() => {
          if (value && !locked) onRemove(id);
        }}
        style={{
          // background: isOver ? "#e3f2fd" : undefined,
          cursor: value && !locked ? "pointer" : "default",
          // color: isPlaceholder ? "#90a4ae" : undefined,
          transition: "background 0.15s, color 0.15s",
        }}
        title={value && !locked ? "Click to remove" : ""}
      />
      {isWrong && <span className="wrong-icon-review4-p2-q1">✕</span>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Review10_Page2_Q3 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill("")),
  );
  const [wrongInputs, setWrongInputs] = useState(new Set());
  const [lockedInputs, setLockedInputs] = useState(new Set());
  const [showAnswers, setShowAnswers] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [correctRows, setCorrectRows] = useState(new Set());
  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();
  const wordAudio = {
    bed: bedAudio,
    egg: eggAudio,
    hen: henAudio,
    jet: jetAudio,
    net: netAudio,
    ten: tenAudio,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // استخرج الكلمة من الـ id (bank-hen-0 → "hen")
  const activeWord = activeId
    ? activeId.split("-").slice(1, -1).join("-")
    : null;

  const usedWords = answers.flat().filter(Boolean);

  const targetIds = data.flatMap((item, qIndex) =>
    item.correct.map((_, blankIndex) => `blank-${qIndex}-${blankIndex}`),
  );

  const parseTarget = (targetId) =>
    targetId.replace("blank-", "").split("-").map(Number);

  const placeWord = (targetId, word) => {
    if (showAnswers || lockedInputs.has(targetId)) return;
    const [newQ, newBlank] = parseTarget(targetId);
    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);
      updated.forEach((row, rowIndex) =>
        row.forEach((value, columnIndex) => {
          if (
            value === word &&
            !lockedInputs.has(`blank-${rowIndex}-${columnIndex}`)
          ) {
            updated[rowIndex][columnIndex] = "";
          }
        }),
      );
      updated[newQ][newBlank] = word;
      return updated;
    });
    setWrongInputs((current) => {
      const next = new Set(current);
      next.delete(`${newQ}-${newBlank}`);
      return next;
    });
  };

  const removeByTargetId = (targetId) => {
    if (showAnswers || lockedInputs.has(targetId)) return;
    const [qIndex, blankIndex] = parseTarget(targetId);
    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);
      updated[qIndex][blankIndex] = "";
      return updated;
    });
    setWrongInputs((current) => {
      const next = new Set(current);
      next.delete(`${qIndex}-${blankIndex}`);
      return next;
    });
  };

  const keyboard = useReviewDragKeyboard({
    targetIds,
    lockedIds: lockedInputs,
    getValue: (targetId) => {
      const [qIndex, blankIndex] = parseTarget(targetId);
      return answers[qIndex][blankIndex];
    },
    onPlace: placeWord,
    onRemove: removeByTargetId,
  });

  // ─── Drag Handlers ────────────────────────────────────────────────────────

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || showAnswers || lockedInputs.has(String(over.id))) return;

    if (!over.id.startsWith("blank-")) return;

    const draggedWord = active.id.split("-").slice(1, -1).join("-");
    placeWord(String(over.id), draggedWord);
  };

  // ─── Remove on Click ──────────────────────────────────────────────────────

  const handleRemove = (slotId) => {
    removeByTargetId(slotId);
  };

  // ─── Check ────────────────────────────────────────────────────────────────

  const checkAnswers = () => {
    if (showAnswers || lockedInputs.size === targetIds.length) return;

    const hasEmpty = answers.some((arr) =>
      arr.some((val) => val.trim() === ""),
    );
    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    const wrong = new Set();
    const nextLocked = new Set(lockedInputs);
    let correctCount = 0;

    const nextCorrectRows = new Set(correctRows);

    answers.forEach((arr, qIndex) => {
      let rowCorrect = true;

      arr.forEach((val, blankIndex) => {
        if (val.trim() === data[qIndex].correct[blankIndex]) {
          correctCount++;

          nextLocked.add(`blank-${qIndex}-${blankIndex}`);
        } else {
          wrong.add(`${qIndex}-${blankIndex}`);

          rowCorrect = false;
        }
      });

      /*
    إذا السؤال كامل صح
    فعّل full audio عليه
  */
      if (rowCorrect) {
        nextCorrectRows.add(qIndex);
      }
    });

    setWrongInputs(wrong);
    setLockedInputs(nextLocked);
    setCorrectRows(nextCorrectRows);
    setWrongInputs(wrong);
    setLockedInputs(nextLocked);

    const totalInputs = data.reduce(
      (acc, item) => acc + item.correct.length,
      0,
    );
    const color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";
    const scoreMessage = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${totalInputs}
        </span>
      </div>`;

    if (correctCount === totalInputs) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  // ─── Reset ────────────────────────────────────────────────────────────────

  const reset = () => {
    setAnswers(data.map((d) => Array(d.correct.length).fill("")));

    setWrongInputs(new Set());

    setLockedInputs(new Set());

    setCorrectRows(new Set());

    setShowAnswers(false);

    stopAudio();
  };
  // ─── Show Answer ──────────────────────────────────────────────────────────

  const showAnswer = () => {
    setAnswers(data.map((d) => [...d.correct]));

    setWrongInputs(new Set());

    setLockedInputs(new Set(targetIds));

    setShowAnswers(true);

    /*
    Show Answer:
    كل الأسئلة تصير full-audio ready
  */
    setCorrectRows(new Set(data.map((_, index) => index)));

    stopAudio();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="page8-wrapper">
        <div className="div-forall" style={{ gap: "20px" }}>
          <ExerciseHeaderReview
            sectionLetter="F"
            title="Read, look, and write. Then, say."
            subTitle="Drag hen, bed, ten, egg, net, and jet to complete the two picture sentences."
          />

          {/* ── Word Bank ── */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "10px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {bankWords.map((word, i) => (
              <BankChip
                key={`bank-${word}-${i}`}
                word={word}
                index={i}
                isUsed={usedWords.includes(word)}
                locked={showAnswers}
                onPlay={() => playAudio(`bank-${word}`, wordAudio[word])}
                playing={activeAudioKey === `bank-${word}`}
                keyboard={keyboard}
              />
            ))}
          </div>

          {/* ── Questions ── */}
          {data.map((item, qIndex) => (
            <div className="row-missing" key={qIndex}>
              <span className="num">{qIndex + 1}.</span>
              <div
                className={`sentence-review10-p2-q3 ${
                  correctRows.has(qIndex)
                    ? "full-audio-ready-review10-p2-q3"
                    : ""
                }`}
                role={correctRows.has(qIndex) ? "button" : undefined}
                tabIndex={correctRows.has(qIndex) ? 0 : undefined}
                aria-label={
                  correctRows.has(qIndex)
                    ? `Play the complete sentence ${qIndex + 1}.`
                    : undefined
                }
                onClick={
                  correctRows.has(qIndex)
                    ? () => playAudio(`full-${qIndex}`, item.fullAudio)
                    : undefined
                }
                onKeyDown={
                  correctRows.has(qIndex)
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();

                          playAudio(`full-${qIndex}`, item.fullAudio);
                        }
                      }
                    : undefined
                }
              >
                {activeAudioKey === `full-${qIndex}` && (
                  <ReviewPlayingAudioIcon />
                )}

                {item.parts.map((p, blankIndex) => (
                  <span
                    key={blankIndex}
                    className="sentence-part"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {p.before && (
                      <span
                        className="review-audio-control"
                        role="button"
                        tabIndex={0}
                        aria-label={`Play audio: ${p.before.trim()}`}
                        onClick={() =>
                          playAudio(
                            `before-${qIndex}-${blankIndex}`,
                            p.beforeAudio,
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            playAudio(
                              `before-${qIndex}-${blankIndex}`,
                              p.beforeAudio,
                            );
                          }
                        }}
                      >
                        {activeAudioKey ===
                          `before-${qIndex}-${blankIndex}` && (
                          <ReviewPlayingAudioIcon />
                        )}
                        {p.before}
                      </span>
                    )}

                    <SlotDropZone
                      id={`blank-${qIndex}-${blankIndex}`}
                      value={answers[qIndex][blankIndex]}
                      isWrong={wrongInputs.has(`${qIndex}-${blankIndex}`)}
                      locked={
                        lockedInputs.has(`blank-${qIndex}-${blankIndex}`) ||
                        showAnswers
                      }
                      onRemove={handleRemove}
                      keyboard={keyboard}
                    />

                    {p.after}
                    <img
                      src={p.middleImg}
                      className="middle-img-review10-p2-q3"
                      alt={p.imageAlt}
                    />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Buttons ── */}
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>
          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
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
          <div
            style={{
              padding: "7px 14px",
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

export default Review10_Page2_Q3;
