/* eslint-disable react-refresh/only-export-components */
import React, { useState } from "react";
import farmImg from "../../../assets/unit10/imgs/U10P88EXEB.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review9_Page1_Q2.css";
import howManyAudio from "../../../assets/Review_9,10/Page 88 - B/How many.mp3";
import cowsQuestionAudio from "../../../assets/Review_9,10/Page 88 - B/How many cows are there.mp3";
import goatsQuestionEndAudio from "../../../assets/Review_9,10/Page 88 - B/goats are there.mp3";
import catsQuestionEndAudio from "../../../assets/Review_9,10/Page 88 - B/cats are there.mp3";
import cowsAnswerAudio from "../../../assets/Review_9,10/Page 88 - B/There are five cows..mp3";
import goatsAnswerAudio from "../../../assets/Review_9,10/Page 88 - B/There are four goats..mp3";
import catsAnswerAudio from "../../../assets/Review_9,10/Page 88 - B/There are three cats..mp3";
import full1Audio from "../../../assets/Review_9,10/Page 88 - B/full1.mp3";
import full2Audio from "../../../assets/Review_9,10/Page 88 - B/full2.mp3";
import full3Audio from "../../../assets/Review_9,10/Page 88 - B/full3.mp3";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";
import useReviewDragKeyboard from "./useReviewDragKeyboard";

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

const items = [
  {
    image: farmImg,
    questionParts: ["How many cows are there?"],
    blanksCount: 0,
    questionAnswers: [],
    answer: "There are five cows.",
    questionAudio: cowsQuestionAudio,
    answerAudio: cowsAnswerAudio,
    fullAudio: full1Audio,
  },
  {
    image: farmImg,
    questionParts: ["", "goats are there?"],
    blanksCount: 2,
    questionAnswers: ["How many"],
    answer: "There are four goats.",
    suffixAudio: goatsQuestionEndAudio,
    answerAudio: goatsAnswerAudio,
    fullAudio: full2Audio,
  },
  {
    image: farmImg,
    questionParts: ["", "cats are there?"],
    blanksCount: 2,
    questionAnswers: ["How many"],
    answer: "There are three cats.",
    suffixAudio: catsQuestionEndAudio,
    answerAudio: catsAnswerAudio,
    fullAudio: full3Audio,
  },
];

const wordBank = [
  { word: "How many", maxUses: 2 }, // مسموح مرتين
  { word: "There are five cows.", maxUses: 1 },
  { word: "There are four goats.", maxUses: 1 },
  { word: "There are three cats.", maxUses: 1 },
];

// ─── Bank Chip (Draggable) ─────────────────────────────────────────────────────

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
        display: "inline-block",
      }}
    >
      {playing && <ReviewPlayingAudioIcon />}
      {word}
    </span>
  );
};

// ─── Drop Zone (Droppable) ────────────────────────────────────────────────────

const DropZone = ({
  id,
  value,
  isWrong,
  locked,
  onRemove,
  className,
  keyboard,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });
  const preview = keyboard.previewFor(id);

  return (
    <span
      ref={(node) => {
        setNodeRef(node);
        keyboard.registerTarget(id, node);
      }}
      role="button"
      tabIndex={keyboard.targetTabIndex(id)}
      aria-label={
        preview
          ? `Place ${preview} here.`
          : value
            ? `${value}. Press Enter or Space to return it.`
            : "Empty question blank."
      }
      onKeyDown={(event) => keyboard.handleTargetKeyDown(event, id)}
      className={`${className || ""} ${isOver ? "drag-over-cell" : ""}`}
      style={{
        // background: isOver ? "#e8f0fe" : undefined,
        cursor: value && !locked ? "pointer" : "default",
        transition: "background 0.15s",
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "100px",
      }}
      onClick={() => {
        if (value && !locked) onRemove(id);
      }}
      title={value && !locked ? "Click to remove" : ""}
    >
      <span className={preview ? "review-keyboard-drop-preview" : ""}>
        {preview || value || ""}
      </span>
      {isWrong && <div className="wrong-x-circle-review9-p1-q2">✕</div>}
    </span>
  );
};

// ─── Answer Drop Zone ─────────────────────────────────────────────────────────

const AnswerDropZone = ({ id, value, isWrong, locked, onRemove, keyboard }) => {
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
      aria-label={
        preview
          ? `Place ${preview} here.`
          : value
            ? `${value}. Press Enter or Space to return it.`
            : "Empty answer blank."
      }
      onKeyDown={(event) => keyboard.handleTargetKeyDown(event, id)}
      className={`answer-input-review9-p1-q2 ${isOver ? "drag-over-cell" : ""}`}
      style={{
        // background: isOver ? "#e8f0fe" : undefined,
        cursor: value && !locked ? "pointer" : "default",
        transition: "background 0.15s",
        position: "relative",
      }}
      onClick={() => {
        if (value && !locked) onRemove(id);
      }}
      title={value && !locked ? "Click to remove" : ""}
    >
      <span className={preview ? "review-keyboard-drop-preview" : ""}>
        {preview || value || ""}
      </span>
      {isWrong && <div className="wrong-x-circle-review9-p1-q2">✕</div>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Review9_Page1_Q2 = () => {
  const [questionInputs, setQuestionInputs] = useState(
    items.map((item) => Array(item.blanksCount).fill("")),
  );
  const [answers, setAnswers] = useState(items.map(() => ""));
  const [showCorrect, setShowCorrect] = useState(false);
  const [wrongMarks, setWrongMarks] = useState(new Set());
  const [lockedInputs, setLockedInputs] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [correctRows, setCorrectRows] = useState([]);
  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();

  const wordAudio = {
    "How many": howManyAudio,
    "There are five cows.": cowsAnswerAudio,
    "There are four goats.": goatsAnswerAudio,
    "There are three cats.": catsAnswerAudio,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const activeWord = activeId ? activeId.replace("bank-", "") : null;

  // كم مرة كل كلمة موجودة بالبنك الأصلي
  const bankCount = wordBank.reduce((acc, { word, maxUses }) => {
    acc[word] = maxUses;
    return acc;
  }, {});

  // كم مرة كل كلمة محطوطة بالفراغات حالياً
  const usedCount = [...questionInputs.flat(), ...answers]
    .filter(Boolean)
    .reduce((acc, w) => {
      acc[w] = (acc[w] || 0) + 1;
      return acc;
    }, {});

  // الكلمة disabled لما استُخدمت بنفس عدد نسخها بالبنك
  const isWordUsedUp = (word) =>
    (usedCount[word] || 0) >= (bankCount[word] || 1);

  const targetIds = [
    ...items.flatMap((item, i) =>
      item.questionAnswers.map((_, j) => `q-${i}-${j}`),
    ),
    ...items.map((_, i) => `a-${i}`),
  ];

  const getValue = (id) => {
    const [type, row, column] = id.split("-");
    return type === "q"
      ? questionInputs[Number(row)][Number(column)]
      : answers[Number(row)];
  };

  const placeWord = (id, word) => {
    if (showCorrect || lockedInputs.has(id)) return;
    const [type, row, column] = id.split("-");
    if (type === "q") {
      setQuestionInputs((current) => {
        const next = current.map((values) => [...values]);
        next[Number(row)][Number(column)] = word;
        return next;
      });
    } else {
      setAnswers((current) => {
        const next = [...current];
        next[Number(row)] = word;
        return next;
      });
    }
    setWrongMarks((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  };

  const removeValue = (id) => {
    if (showCorrect || lockedInputs.has(id)) return;
    placeWord(id, "");
  };

  const keyboard = useReviewDragKeyboard({
    targetIds,
    lockedIds: lockedInputs,
    getValue,
    onPlace: placeWord,
    onRemove: removeValue,
  });

  // ─── Drag Handlers ────────────────────────────────────────────────────────

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || showCorrect || lockedInputs.has(String(over.id))) return;

    const word = active.id.replace("bank-", "");
    const destId = over.id; // e.g. "q-1-0" or "a-1"

    placeWord(destId, word);
  };

  // ─── Remove (click to clear) ──────────────────────────────────────────────

  const handleRemove = (id) => {
    removeValue(id);
  };

  // ─── Show Answers ─────────────────────────────────────────────────────────

  const showAnswers = () => {
    setQuestionInputs(items.map((item) => item.questionAnswers || []));

    setAnswers(items.map((item) => item.answer));

    setShowCorrect(true);

    setWrongMarks(new Set());

    setLockedInputs(new Set(targetIds));

    /*
    ✅ بعد Show Answer
    اعتبر كل الصفوف مكتملة وصحيحة
    حتى يصير كل div clickable/tabbable للصوت الكامل
  */
    setCorrectRows(items.map((_, index) => index));

    stopAudio();
  };

  // ─── Reset ────────────────────────────────────────────────────────────────

  const resetAll = () => {
    setQuestionInputs(items.map((item) => Array(item.blanksCount).fill("")));
    setAnswers(items.map(() => ""));
    setShowCorrect(false);
    setWrongMarks(new Set());
    setLockedInputs(new Set());
    setCorrectRows([]);
    stopAudio();
  };

  // ─── Check Answers ────────────────────────────────────────────────────────

  const checkAnswers = () => {
    if (showCorrect || lockedInputs.size === targetIds.length) return;

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].questionAnswers.length; j++) {
        if (!questionInputs[i][j] || questionInputs[i][j].trim() === "") {
          ValidationAlert.info(
            "Oops!",
            "Please complete all question blanks before checking.",
          );
          return;
        }
      }
      if (!answers[i] || answers[i].trim() === "") {
        ValidationAlert.info(
          "Oops!",
          "Please complete all answers before checking.",
        );
        return;
      }
    }

    let score = 0;
    let total = 0;
    const wrong = new Set();
    const nextLocked = new Set(lockedInputs);

    const correctRowIndexes = [];
    items.forEach((item, i) => {
      let rowCorrect = true;
      item.questionAnswers.forEach((correctWord, idx) => {
        total++;
        if (
          questionInputs[i][idx]?.trim().toLowerCase() ===
          correctWord.toLowerCase()
        ) {
          score++;
        } else {
          wrong.add(`q-${i}-${idx}`);
          rowCorrect = false;
        }
        if (
          questionInputs[i][idx]?.trim().toLowerCase() ===
          correctWord.toLowerCase()
        ) {
          nextLocked.add(`q-${i}-${idx}`);
        }
      });

      total++;
      if (answers[i].trim().toLowerCase() === item.answer.toLowerCase()) {
        score++;
        nextLocked.add(`a-${i}`);
      } else {
        wrong.add(`a-${i}`);
        rowCorrect = false;
      }
      if (rowCorrect) correctRowIndexes.push(i);
    });

    setWrongMarks(wrong);
    setLockedInputs(nextLocked);
    setCorrectRows((current) =>
      Array.from(new Set([...current, ...correctRowIndexes])),
    );

    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">Score: ${score} / ${total}</span>
      </div>`;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

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
            display: "flex",
            flexDirection: "column",
            // width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="B"
            title="Look and write."
            subTitle="Count the cows, goats, and cats, then drag the correct question and answers into place."
          />

          {/* ── Word Bank ── */}
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
              flexWrap: "wrap",
            }}
          >
            {wordBank.map(({ word }, index) => (
              <BankChip
                key={`${word}-${index}`}
                word={word}
                isUsed={isWordUsedUp(word)}
                locked={showCorrect}
                onPlay={() => playAudio(`bank-${word}`, wordAudio[word])}
                playing={activeAudioKey === `bank-${word}`}
                keyboard={keyboard}
              />
            ))}
          </div>

          {/* ── Content ── */}
          <div className="content-review9-p1-q2 w-full">
            <img
              src={farmImg}
              alt="A farm scene with five cows, four goats, and three cats."
              style={{ height: "270px", width: "auto" }}
            />

            <div style={{ width: "100%" }}>
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`question-box-review9-p1-q2 review-audio-control${
                    correctRows.includes(i) ? " review-full-audio-ready" : ""
                  }`}
                  role={correctRows.includes(i) ? "button" : undefined}
                  tabIndex={correctRows.includes(i) ? 0 : undefined}
                  aria-label={
                    correctRows.includes(i)
                      ? `Play the complete correct exchange for item ${i + 1}.`
                      : undefined
                  }
                  onClick={
                    correctRows.includes(i)
                      ? () => playAudio(`full-${i}`, item.fullAudio)
                      : undefined
                  }
                  onKeyDown={
                    correctRows.includes(i)
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            playAudio(`full-${i}`, item.fullAudio);
                          }
                        }
                      : undefined
                  }
                >
                  {activeAudioKey === `full-${i}` && <ReviewPlayingAudioIcon />}
                  {/* ── Question ── */}
                  <p className="question-text question-text-review9-p1-q2">
                    {" "}
                    {item.questionParts.map((part, idx) =>
                      part === "" ? (
                        <DropZone
                          key={`q-${i}-${idx}`}
                          id={`q-${i}-${idx}`}
                          value={questionInputs[i][idx]}
                          isWrong={wrongMarks.has(`q-${i}-${idx}`)}
                          locked={
                            showCorrect || lockedInputs.has(`q-${i}-${idx}`)
                          }
                          onRemove={handleRemove}
                          className="question-blank-review9-p1-q2"
                          keyboard={keyboard}
                        />
                      ) : (
                        <span
                          key={idx}
                          className="question-part-review9-p1-q2 review-audio-control"
                          role={
                            !correctRows.includes(i) &&
                            (item.questionAudio || item.suffixAudio)
                              ? "button"
                              : undefined
                          }
                          tabIndex={
                            !correctRows.includes(i) &&
                            (item.questionAudio || item.suffixAudio)
                              ? 0
                              : undefined
                          }
                          aria-label={
                            !correctRows.includes(i) &&
                            (item.questionAudio || item.suffixAudio)
                              ? `Play audio: ${part}`
                              : undefined
                          }
                          onClick={
                            !correctRows.includes(i) &&
                            (item.questionAudio || item.suffixAudio)
                              ? (event) => {
                                  event.stopPropagation();
                                  playAudio(
                                    `question-${i}-${idx}`,
                                    item.questionAudio || item.suffixAudio,
                                  );
                                }
                              : undefined
                          }
                          onKeyDown={
                            !correctRows.includes(i) &&
                            (item.questionAudio || item.suffixAudio)
                              ? (event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    playAudio(
                                      `question-${i}-${idx}`,
                                      item.questionAudio || item.suffixAudio,
                                    );
                                  }
                                }
                              : undefined
                          }
                        >
                          {activeAudioKey === `question-${i}-${idx}` && (
                            <ReviewPlayingAudioIcon />
                          )}
                          {part}
                        </span>
                      ),
                    )}
                  </p>

                  {/* ── Answer ── */}
                  <AnswerDropZone
                    id={`a-${i}`}
                    value={answers[i]}
                    isWrong={wrongMarks.has(`a-${i}`)}
                    locked={showCorrect || lockedInputs.has(`a-${i}`)}
                    onRemove={handleRemove}
                    keyboard={keyboard}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
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
              cursor: "grabbing",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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

export default Review9_Page1_Q2;
