import React, { useState } from "react";
import bat from "../../../assets/U1 WB/U10/U10P60EXEH-01.svg";
import cap from "../../../assets/U1 WB/U10/U10P60EXEH-02.svg";
import ant from "../../../assets/U1 WB/U10/U10P60EXEH-03.svg";
import dad from "../../../assets/U1 WB/U10/U10P60EXEH-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import useUnit10Audio from "./useUnit10Audio";
import useUnit10TabDrag from "./useUnit10TabDrag";
import appleAudio from "../../../assets/U1 WB/U10/audio/page60- H/Item_001_apple.mp3";
import iceCreamAudio from "../../../assets/U1 WB/U10/audio/page60- H/Item_002_want_ice_cream.mp3";
import chickenAudio from "../../../assets/U1 WB/U10/audio/page60- H/Item_003_want_chicken.mp3";
import milkAudio from "../../../assets/U1 WB/U10/audio/page60- H/Item_004_want_milk.mp3";
import iWantAnAudio from "../../../assets/U1 WB/U10/audio/page60- H/Item_005_Il_want_an.mp3";
import I_want_an_appleAudio from "../../../assets/U1 WB/U10/audio/page60- H/Item_003_I_want_an_apple.mp3";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import "./WB_Unit10_Page4_Q2.css";

// ─── Word chip in the bank ───────────────────────────────────────────────────
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
      className={`wb-unit10-audio-control ${tabDrag.keyboardItemId === `bank::${word}` ? "wb-unit10-keyboard-preview" : ""}`}
      role="button"
      tabIndex={used || locked ? -1 : 0}
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
      {word}
      <PlayingAudioIcon active={playing} />
    </div>
  );
};

// ─── Drop zone inside a sentence ─────────────────────────────────────────────
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
        minWidth: "120px",
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
        style={{
          fontWeight: 600,
          cursor: "pointer",
          // color: "#2c5287",
          flex: 1,
        }}
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

// ─── Main component ───────────────────────────────────────────────────────────
const WB_Unit10_Page4_Q2 = () => {
  const questions = [
    {
      img: bat,
      alt: "An apple",
      fullAudio: [I_want_an_appleAudio],
      parts: [
        { type: "text", value: "I want an" },
        { type: "input", answer: "apple" },
      ],
    },
    {
      img: cap,
      alt: "A bowl of ice cream",
      fullAudio: [iceCreamAudio],
      parts: [
        { type: "input", answer: "I want ice cream" },
        { type: "text", value: "." },
      ],
    },
    {
      img: ant,
      alt: "A roast chicken",
      fullAudio: [chickenAudio],
      parts: [
        { type: "input", answer: "I want chicken" },
        { type: "text", value: "." },
      ],
    },
    {
      img: dad,
      alt: "A glass of milk",
      fullAudio: [milkAudio],
      parts: [
        { type: "input", answer: "I want milk" },
        { type: "text", value: "." },
      ],
    },
  ];

  const wordBank = [
    "apple",
    "I want ice cream",
    "I want chicken",
    "I want milk",
  ];

  // answers[qIndex][pIndex] = word string or ""
  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [lockedInputs, setLockedInputs] = useState(new Set());
  const [completedRows, setCompletedRows] = useState(new Set());
  const [activeWord, setActiveWord] = useState(null); // for DragOverlay

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const { activeAudioKey, playAudio, playAudioSequence, stopAudio } =
    useUnit10Audio();
  const audioByWord = {
    apple: appleAudio,
    "I want ice cream": iceCreamAudio,
    "I want chicken": chickenAudio,
    "I want milk": milkAudio,
  };

  // كل الكلمات المستخدمة حالياً
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
    isTargetDisabled: (id) => {
      const [, qIndex, pIndex] = id.split("-");
      return locked || lockedInputs.has(`${qIndex}-${pIndex}`);
    },
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

  // ─── حذف كلمة من الدروب زون وإرجاعها للبنك ──────────────────────────────
  const removeWord = (qIndex, pIndex) => {
    if (locked || lockedInputs.has(`${qIndex}-${pIndex}`)) return;
    setAnswers((prev) => {
      const copy = prev.map((r) => [...r]);
      copy[qIndex][pIndex] = "";
      return copy;
    });
    setWrongInputs([]);
  };

  // ─── Drag start ──────────────────────────────────────────────────────────
  const handleDragStart = (event) => {
    const rawId = event.active.id; // "bank::apple" or "drop-0-1"
    const word = rawId.startsWith("bank::")
      ? rawId.replace("bank::", "")
      : null;
    setActiveWord(word);
  };

  // ─── Drag end ────────────────────────────────────────────────────────────
  const handleDragEnd = (event) => {
    setActiveWord(null);
    if (locked) return;

    const { active, over } = event;
    if (!over) return;

    const rawId = active.id; // "bank::word"
    const word = rawId.startsWith("bank::")
      ? rawId.replace("bank::", "")
      : null;
    if (!word) return;

    const dest = over.id; // "drop-0-1"
    if (!dest.startsWith("drop-")) return;

    const [, qStr, pStr] = dest.split("-");
    const qIndex = Number(qStr);
    const pIndex = Number(pStr);
    if (lockedInputs.has(`${qIndex}-${pIndex}`)) return;

    setAnswers((prev) => {
      const copy = prev.map((r) => [...r]);

      // شيل الكلمة من أي مكان قديم
      copy.forEach((row, qi) =>
        row.forEach((val, pi) => {
          if (val === word) copy[qi][pi] = "";
        }),
      );

      // حط الكلمة في المكان الجديد (إزاحة القديمة للبنك تلقائياً لأنها تُمحى)
      copy[qIndex][pIndex] = word;
      return copy;
    });

    setWrongInputs([]);
  };
  const totalInputs = questions.reduce(
    (total, q) => total + q.parts.filter((p) => p.type === "input").length,
    0,
  );
  // ─── Check ───────────────────────────────────────────────────────────────
  const checkAnswers = () => {
    if (locked || (totalInputs > 0 && lockedInputs.size === totalInputs))
      return;
    for (let qi = 0; qi < questions.length; qi++) {
      for (let pi = 0; pi < questions[qi].parts.length; pi++) {
        if (questions[qi].parts[pi].type === "input" && !answers[qi][pi]) {
          ValidationAlert.info(`Please complete question ${qi + 1}.`);
          return;
        }
      }
    }

    let wrong = [];
    let score = 0;
    let total = 0;

    questions.forEach((q, qi) =>
      q.parts.forEach((p, pi) => {
        if (p.type === "input") {
          total++;
          if (answers[qi][pi]?.trim() === p.answer) score++;
          else wrong.push(`${qi}-${pi}`);
        }
      }),
    );

    setWrongInputs(wrong);
    setLockedInputs((old) => {
      const next = new Set(old);
      questions.forEach((q, qi) =>
        q.parts.forEach((p, pi) => {
          if (p.type === "input" && answers[qi][pi]?.trim() === p.answer)
            next.add(`${qi}-${pi}`);
        }),
      );
      return next;
    });
    setCompletedRows((old) => {
      const next = new Set(old);
      questions.forEach((q, qi) =>
        q.parts.forEach((part, pi) => {
          if (part.type === "input" && answers[qi][pi]?.trim() === part.answer)
            next.add(qi);
        }),
      );
      return next;
    });
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
    setLocked(true);
    setCompletedRows(new Set(questions.map((_, index) => index)));
  };

  const reset = () => {
    setAnswers(
      questions.map((q) =>
        q.parts.map((p) => (p.type === "input" ? "" : null)),
      ),
    );
    setWrongInputs([]);
    setLocked(false);
    setLockedInputs(new Set());
    setCompletedRows(new Set());
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
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="H"
            title="Look and write."
            subTitle="Look at each food picture and drag the correct sentence to the line."
          />

          {/* ─── Word Bank ─────────────────────────────────────────────── */}
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
                onPlay={() => playAudio(`bank-${word}`, audioByWord[word])}
                tabDrag={tabDrag}
              />
            ))}
          </div>

          {/* ─── Questions ─────────────────────────────────────────────── */}
          <div className="content-container-wb-unit8-p1-q2 w-full">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className={`row2-wb-unit10-p4-q2 ${completedRows.has(qIndex) ? "wb-unit10-audio-control wb-unit10-completed-audio" : ""}`}
                role={completedRows.has(qIndex) ? "button" : undefined}
                tabIndex={completedRows.has(qIndex) ? 0 : undefined}
                aria-label={
                  completedRows.has(qIndex)
                    ? `Play complete sentence ${qIndex + 1}`
                    : undefined
                }
                onClick={
                  completedRows.has(qIndex)
                    ? () => playAudioSequence(`full-${qIndex}`, q.fullAudio)
                    : undefined
                }
                onKeyDown={
                  completedRows.has(qIndex)
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          playAudioSequence(`full-${qIndex}`, q.fullAudio);
                        }
                      }
                    : undefined
                }
              >
                <PlayingAudioIcon
                  active={activeAudioKey === `full-${qIndex}`}
                />
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span className=" text-black text-[20px] font-bold">
                    {qIndex + 1}
                  </span>
                  <div className="sentence-wrapper-wb-unit10-p4-q2">
                    {q.parts.map((part, pIndex) => {
                      if (part.type === "text") {
                        const isIWant =
                          part.value.trim().toLowerCase() === "i want an";
                        return (
                          <p
                            key={pIndex}
                            className={`sentence-text-wb-unit10-p4-q2 ${isIWant ? "wb-unit10-audio-control" : ""}`}
                            role={isIWant ? "button" : undefined}
                            tabIndex={isIWant ? 0 : undefined}
                            aria-label={isIWant ? "Play I want an" : undefined}
                            onClick={
                              isIWant
                                ? (event) => {
                                    event.stopPropagation();
                                    playAudio("i-want-an", iWantAnAudio);
                                  }
                                : undefined
                            }
                            onKeyDown={
                              isIWant
                                ? (event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      playAudio("i-want-an", iWantAnAudio);
                                    }
                                  }
                                : undefined
                            }
                          >
                            <PlayingAudioIcon
                              active={isIWant && activeAudioKey === "i-want-an"}
                            />
                            {part.value}
                          </p>
                        );
                      }

                      const cellKey = `drop-${qIndex}-${pIndex}`;
                      return (
                        <span
                          key={pIndex}
                          style={{ position: "relative", width: "90%" }}
                        >
                          <DropCell
                            id={cellKey}
                            value={answers[qIndex][pIndex]}
                            isWrong={wrongInputs.includes(
                              `${qIndex}-${pIndex}`,
                            )}
                            locked={
                              locked || lockedInputs.has(`${qIndex}-${pIndex}`)
                            }
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
                <img src={q.img} alt={q.alt} className="q-img-wb-unit8-p1-q2" />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Buttons ───────────────────────────────────────────────────── */}
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

      {/* ─── Drag Overlay (الكلمة اللي بتطير تحت الإصبع) ─────────────── */}
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

export default WB_Unit10_Page4_Q2;
