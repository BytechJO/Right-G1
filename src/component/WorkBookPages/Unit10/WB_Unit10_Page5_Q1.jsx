import React, { useState } from "react";
import bat from "../../../assets/U1 WB/U10/U10P61EXEI-01.svg";
import cap from "../../../assets/U1 WB/U10/U10P61EXEI-02.svg";
import ant from "../../../assets/U1 WB/U10/U10P61EXEI-03.svg";
import dad from "../../../assets/U1 WB/U10/U10P61EXEI-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit10Audio from "./useUnit10Audio";
import useUnit10TabDrag from "./useUnit10TabDrag";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import full1 from "../../../assets/U1 WB/U10/audio/page61- I/full1.mp3";
import full2 from "../../../assets/U1 WB/U10/audio/page61- I/full2.mp3";
import full3 from "../../../assets/U1 WB/U10/audio/page61- I/full3.mp3";
import full4 from "../../../assets/U1 WB/U10/audio/page61- I/full4.mp3";
import answer1 from "../../../assets/U1 WB/U10/audio/page61- I/Item_001_I_want_ice_cream.mp3";
import answer2 from "../../../assets/U1 WB/U10/audio/page61- I/Item_002_I_want_fruit.mp3";
import answer3 from "../../../assets/U1 WB/U10/audio/page61- I/Item_003_No,_I_want_milk.mp3";
import answer4 from "../../../assets/U1 WB/U10/audio/page61- I/Item_004_Yes,_I_want_chicken.mp3";
import question1 from "../../../assets/U1 WB/U10/audio/page61- I/Item_005_Do_you_want_ice_cream.mp3";
import question2 from "../../../assets/U1 WB/U10/audio/page61- I/Item_006_Do_you_want_bread.mp3";
import question3 from "../../../assets/U1 WB/U10/audio/page61- I/Item_007_Do_you_want_an_apple.mp3";
import question4 from "../../../assets/U1 WB/U10/audio/page61- I/Item_008_Do_you_want_chicken.mp3";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import "./WB_Unit10_Page5_Q1.css";

// ─── Word chip in the bank ────────────────────────────────────────────────────
const BankChip = ({ word, used, locked, playing, onPlay, tabDrag }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank::${word}`,
    disabled: used || locked,
  });

  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        tabDrag.registerItem(`bank::${word}`, element);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={used || locked ? -1 : 0}
      aria-label={`Play ${word}${!used && !locked ? " and drag it" : ""}`}
      className={`wb-unit10-audio-control ${tabDrag.keyboardItemId === `bank::${word}` ? "wb-unit10-keyboard-preview" : ""}`}
      onClick={onPlay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onPlay();
        tabDrag.handleItemKeyDown(event, `bank::${word}`);
      }}
      style={{
        padding: "6px 12px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: used ? "#e0e0e0" : "white",
        fontWeight: "600",
        cursor: used || locked ? "not-allowed" : "grab",
        opacity: isDragging ? 0.3 : used ? 0.45 : 1,
        userSelect: "none",
        transition: "opacity 0.2s, background 0.2s",
        color: used ? "#aaa" : "",
        // textDecoration: used ? "line-through" : "none",
        touchAction: "none",
      }}
    >
      {playing && <Unit10PlayingAudioIcon />}
      {word}
    </div>
  );
};

// ─── Drop zone inside a sentence ──────────────────────────────────────────────
const DropCell = ({
  id,
  value,
  isWrong,
  locked,
  onRemove,
  tabDrag,
  preview,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });

  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        tabDrag.registerTarget(id, element);
      }}
      role="button"
      tabIndex={!locked && (tabDrag.keyboardItemId || value) ? 0 : -1}
      onKeyDown={(event) => {
        if (tabDrag.keyboardItemId) tabDrag.handleTargetKeyDown(event, id);
        else if (
          (event.key === "Enter" || event.key === " ") &&
          value &&
          !locked
        ) {
          event.preventDefault();
          onRemove();
          tabDrag.focusItemById(`bank::${value}`);
        }
      }}
      onFocus={() => tabDrag.focusTarget(id)}
      className={`inline-input-wb-unit8-p1-q2 ${isOver ? "drag-over-cell" : ""}`}
      style={{
        minHeight: "40px",
        minWidth: "140px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 8px",
        // borderRadius: "8px",
        background: isOver ? "#e3f2fd" : "white",
        borderBottom: `2px solid black`,
        transition: "background 0.15s, border-color 0.15s",
        gap: "6px",
        width: "100%",
      }}
    >
      <span
        onClick={onRemove}
        style={{ fontWeight: 600, cursor: "pointer", flex: 1 }}
      >
        {value || ""}
        {preview && (
          <span className="wb-unit10-keyboard-preview">{preview}</span>
        )}
      </span>

      {/* ✕ علامة الخطأ بعد التصحيح */}
      {isWrong && locked && (
        <span className="error-mark-input-wb-unit2-page3-q2">✕</span>
      )}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const WB_Unit10_Page5_Q1 = () => {
  const questions = [
    {
      img: bat,
      alt: "A girl thinking about ice cream.",
      text: "Do you want ice cream?",
      questionAudio: question1,
      answerAudio: answer1,
      fullAudio: full1,
      parts: [
        { type: "text", value: "Yes, " },
        { type: "input", answer: "I want ice cream" },
        { type: "text", value: "." },
      ],
    },
    {
      img: cap,
      alt: "A girl thinking about fruit.",
      text: "Do you want bread?",
      questionAudio: question2,
      answerAudio: answer2,
      fullAudio: full2,
      parts: [
        { type: "text", value: "No, " },
        { type: "input", answer: "I want fruit" },
        { type: "text", value: "." },
      ],
    },
    {
      img: ant,
      alt: "A boy thinking about milk.",
      text: "Do you want an apple?",
      questionAudio: question3,
      answerAudio: answer3,
      fullAudio: full3,
      parts: [
        { type: "input", answer: "No, I want milk" },
        { type: "text", value: "." },
      ],
    },
    {
      img: dad,
      alt: "A girl thinking about chicken.",
      text: "Do you want chicken?",
      questionAudio: question4,
      answerAudio: answer4,
      fullAudio: full4,
      parts: [
        { type: "input", answer: "Yes, I want chicken" },
        { type: "text", value: "." },
      ],
    },
  ];

  const wordBank = [
    "I want ice cream",
    "I want fruit",
    "No, I want milk",
    "Yes, I want chicken",
  ];

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [lockedCells, setLockedCells] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [activeWord, setActiveWord] = useState(null);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();
  const locked = lockedCells.length === questions.length;
  const answerAudioMap = {
    "I want ice cream": answer1,
    "I want fruit": answer2,
    "No, I want milk": answer3,
    "Yes, I want chicken": answer4,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const usedWords = answers.flat().filter(Boolean);
  const targetIds = questions.flatMap((q, qIndex) =>
    q.parts
      .map((part, pIndex) =>
        part.type === "input" ? `drop-${qIndex}-${pIndex}` : null,
      )
      .filter(Boolean),
  );
  const tabDrag = useUnit10TabDrag({
    itemIds: wordBank.map((word) => `bank::${word}`),
    targetIds,
    isItemDisabled: (id) =>
      locked || usedWords.includes(id.replace("bank::", "")),
    isTargetDisabled: (id) => lockedCells.includes(id.replace("drop-", "")),
    onPlace: (itemId, targetId) => {
      const word = itemId.replace("bank::", "");
      const [, qString, pString] = targetId.split("-");
      const qIndex = Number(qString);
      const pIndex = Number(pString);
      setAnswers((prev) => {
        const copy = prev.map((row) => [...row]);
        copy.forEach((row, qi) =>
          row.forEach((value, pi) => {
            if (value === word) copy[qi][pi] = "";
          }),
        );
        copy[qIndex][pIndex] = word;
        return copy;
      });
      setWrongInputs((prev) =>
        prev.filter((key) => key !== `${qIndex}-${pIndex}`),
      );
    },
  });

  // ─── إرجاع كلمة للبنك ──────────────────────────────────────────────────────
  const removeWord = (qIndex, pIndex) => {
    if (lockedCells.includes(`${qIndex}-${pIndex}`)) return;
    setAnswers((prev) => {
      const copy = prev.map((r) => [...r]);
      copy[qIndex][pIndex] = "";
      return copy;
    });
    setWrongInputs((previous) =>
      previous.filter((key) => key !== `${qIndex}-${pIndex}`),
    );
  };

  // ─── Drag start ────────────────────────────────────────────────────────────
  const handleDragStart = (event) => {
    const rawId = event.active.id;
    const word = rawId.startsWith("bank::")
      ? rawId.replace("bank::", "")
      : null;
    setActiveWord(word);
  };

  // ─── Drag end ──────────────────────────────────────────────────────────────
  const handleDragEnd = (event) => {
    setActiveWord(null);
    if (locked) return;

    const { active, over } = event;
    if (!over) return;

    const rawId = active.id;
    const word = rawId.startsWith("bank::")
      ? rawId.replace("bank::", "")
      : null;
    if (!word) return;

    const dest = over.id;
    if (!dest.startsWith("drop-")) return;

    const [, qStr, pStr] = dest.split("-");
    const qIndex = Number(qStr);
    const pIndex = Number(pStr);
    if (lockedCells.includes(`${qIndex}-${pIndex}`)) return;

    setAnswers((prev) => {
      const copy = prev.map((r) => [...r]);

      // شيل الكلمة من أي مكان قديم
      copy.forEach((row, qi) =>
        row.forEach((val, pi) => {
          if (val === word) copy[qi][pi] = "";
        }),
      );

      copy[qIndex][pIndex] = word;
      return copy;
    });

    setWrongInputs((previous) =>
      previous.filter((key) => key !== `${qIndex}-${pIndex}`),
    );
  };

  // ─── Check ─────────────────────────────────────────────────────────────────
  const checkAnswers = () => {
    if (locked) return;

    for (let qi = 0; qi < questions.length; qi++) {
      for (let pi = 0; pi < questions[qi].parts.length; pi++) {
        if (questions[qi].parts[pi].type === "input" && !answers[qi][pi]) {
          ValidationAlert.info(`Please complete question ${qi + 1}.`);
          return;
        }
      }
    }

    let wrong = [],
      correctCells = [];
    let score = 0;
    let total = 0;

    questions.forEach((q, qi) =>
      q.parts.forEach((p, pi) => {
        if (p.type === "input") {
          total++;
          if (answers[qi][pi]?.trim() === p.answer) {
            score++;
            correctCells.push(`${qi}-${pi}`);
          } else wrong.push(`${qi}-${pi}`);
        }
      }),
    );

    setWrongInputs(wrong);
    const nextLocked = [...new Set([...lockedCells, ...correctCells])];
    setLockedCells(nextLocked);
    setCompletedRows(
      questions
        .map((_, index) =>
          nextLocked.some((key) => key.startsWith(`${index}-`)) ? index : null,
        )
        .filter((value) => value !== null),
    );
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const showAnswers = () => {
    setAnswers(
      questions.map((q) =>
        q.parts.map((p) => (p.type === "input" ? p.answer : null)),
      ),
    );
    setWrongInputs([]);
    setLockedCells(
      questions.map(
        (q, qi) =>
          `${qi}-${q.parts.findIndex((part) => part.type === "input")}`,
      ),
    );
    setCompletedRows(questions.map((_, index) => index));
    stopAudio();
  };

  const reset = () => {
    setAnswers(
      questions.map((q) =>
        q.parts.map((p) => (p.type === "input" ? "" : null)),
      ),
    );
    setWrongInputs([]);
    setLockedCells([]);
    setCompletedRows([]);
    stopAudio();
  };

  return (
    <DndContext
      sensors={sensors}
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
        <div className="div-forall mb-15">
          <ExerciseHeader
            sectionLetter="I"
            title="Read, look, and write."
            subTitle="Read each question and drag the complete answer that matches the picture."
          />

          {/* ─── Word Bank ──────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              width: "100%",
              padding: "12px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {wordBank.map((word) => (
              <BankChip
                key={word}
                word={word}
                used={usedWords.includes(word)}
                locked={locked}
                playing={activeAudioKey === `bank-${word}`}
                onPlay={() => playAudio(`bank-${word}`, answerAudioMap[word])}
                tabDrag={tabDrag}
              />
            ))}
          </div>

          {/* ─── Questions ──────────────────────────────────────────────── */}
          <div className="content-container-wb-unit4-p1-q2 w-full">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className={`row2-wb-unit10-p5-q1 wb-unit10-audio-control${completedRows.includes(qIndex) ? " wb-unit10-completed-audio" : ""}`}
                role={completedRows.includes(qIndex) ? "button" : undefined}
                tabIndex={completedRows.includes(qIndex) ? 0 : undefined}
                aria-label={
                  completedRows.includes(qIndex)
                    ? `Play complete question ${qIndex + 1}`
                    : undefined
                }
                onClick={
                  completedRows.includes(qIndex)
                    ? () => playAudio(`full-${qIndex}`, q.fullAudio)
                    : undefined
                }
                onKeyDown={
                  completedRows.includes(qIndex)
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          playAudio(`full-${qIndex}`, q.fullAudio);
                        }
                      }
                    : undefined
                }
              >
                {activeAudioKey === `full-${qIndex}` && (
                  <Unit10PlayingAudioIcon />
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span className="num-span">{qIndex + 1}</span>
                    <p
                      className="wb-unit10-audio-control"
                      role="button"
                      tabIndex={0}
                      aria-label={`Play audio: ${q.text}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        playAudio(`question-${qIndex}`, q.questionAudio);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          playAudio(`question-${qIndex}`, q.questionAudio);
                        }
                      }}
                      style={{ fontSize: "20px", fontWeight: "500" }}
                    >
                      {activeAudioKey === `question-${qIndex}` && (
                        <Unit10PlayingAudioIcon />
                      )}
                      {q.text}
                    </p>
                  </div>
                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q-img-wb-unit10-p5-q1"
                  />
                </div>

                <div className="sentence-wrapper-wb-unit10-p5-q1">
                  {q.parts.map((part, pIndex) => {
                    if (part.type === "text") {
                      return (
                        <span
                          key={pIndex}
                          className="sentence-text-wb-unit10-p5-q1"
                        >
                          {part.value}
                        </span>
                      );
                    }

                    const cellKey = `drop-${qIndex}-${pIndex}`;
                    return (
                      <span
                        key={pIndex}
                        style={{ position: "relative", width: "100%" }}
                      >
                        <DropCell
                          id={cellKey}
                          value={answers[qIndex][pIndex]}
                          isWrong={wrongInputs.includes(`${qIndex}-${pIndex}`)}
                          locked={lockedCells.includes(`${qIndex}-${pIndex}`)}
                          onRemove={() => removeWord(qIndex, pIndex)}
                          tabDrag={tabDrag}
                          preview={
                            tabDrag.keyboardTargetId === cellKey
                              ? tabDrag.keyboardItemId?.replace("bank::", "")
                              : ""
                          }
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Buttons ──────────────────────────────────────────────────── */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* ─── Drag Overlay ─────────────────────────────────────────────── */}
      <DragOverlay>
        {activeWord ? (
          <div
            style={{
              padding: "6px 12px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "white",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              cursor: "grabbing",
              color: "#2c5287",
            }}
          >
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit10_Page5_Q1;
