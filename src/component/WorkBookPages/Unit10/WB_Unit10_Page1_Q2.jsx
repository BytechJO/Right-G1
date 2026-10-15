import React, { useState } from "react";
import bat from "../../../assets/U1 WB/U10/U10P57EXEB-01.svg";
import cap from "../../../assets/U1 WB/U10/U10P57EXEB-02.svg";
import ant from "../../../assets/U1 WB/U10/U10P57EXEB-03.svg";
import dad from "../../../assets/U1 WB/U10/U10P57EXEB-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import useUnit10Audio from "./useUnit10Audio";
import useUnit10TabDrag from "./useUnit10TabDrag";
import fruitAudio from "../../../assets/U1 WB/U10/audio/page57- B/Item_001_fruit.mp3";
import milkAudio from "../../../assets/U1 WB/U10/audio/page57- B/Item_002_I_want_milk.mp3";
import iceCreamAudio from "../../../assets/U1 WB/U10/audio/page57- B/Item_003_ice_cream.mp3";
import appleAudio from "../../../assets/U1 WB/U10/audio/page57- B/Item_004_want_an_apple.mp3";
import iWantAudio from "../../../assets/U1 WB/U10/audio/page57- B/Item_005_i_want.mp3";
import iceCreamFullAudio from "../../../assets/U1 WB/U10/audio/page57- B/Item_001_I_want_ice_cream.mp3";
import fruitFullAudio from "../../../assets/U1 WB/U10/audio/page57- B/Item_002_I_want_fruit.mp3";
import "./WB_Unit10_Page1_Q2.css";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

// ─── Draggable Word Chip ──────────────────────────────────────────────────────
const DraggableWord = ({
  id,
  text,
  disabled,
  isUsed,
  onKeyboardPick,
  bankRef,
  selected,
  onPlay,
  playing,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
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
      tabIndex={disabled || isUsed ? -1 : 0}
      onClick={onPlay}
      onKeyDown={(event) => {
        if (
          (event.key === "Enter" || event.key === " ") &&
          !disabled &&
          !isUsed
        ) {
          event.preventDefault();
          onPlay();
          onKeyboardPick();
        }
      }}
      className={`wb-unit10-audio-control ${selected ? "wb-unit10-keyboard-preview" : ""}`}
      style={{
        padding: "6px 12px",
        border: `2px solid ${isUsed ? "#c0c0c0" : "#2c5287"}`,
        borderRadius: "8px",
        background: isUsed ? "#f0f0f0" : "white",
        color: isUsed ? "#bbb" : "inherit",
        cursor: disabled || isUsed ? "default" : "grab",
        fontWeight: "600",
        opacity: isDragging ? 0.4 : 1,
        touchAction: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
      }}
    >
      {text}
      <PlayingAudioIcon active={playing} />
    </div>
  );
};

// ─── Word Bank ────────────────────────────────────────────────────────────────
const WordBank = ({
  wordBank,
  locked,
  usedValues,
  tabDrag,
  activeAudioKey,
  playAudio,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: "bank" });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        gap: "12px",
        padding: "10px",
        width: "100%",
        border: "2px dashed #ccc",
        borderRadius: "10px",
        marginBottom: "20px",
        justifyContent: "center",
        background: isOver ? "#f0f8ff" : "transparent",
        transition: "background 0.2s",
      }}
    >
      {wordBank.map((w) => (
        <DraggableWord
          key={w.id}
          id={w.id}
          text={w.value}
          disabled={locked}
          isUsed={usedValues.has(w.value.toLowerCase())}
          onKeyboardPick={() => tabDrag.pickItem(w.id)}
          bankRef={(element) => tabDrag.registerItem(w.id, element)}
          selected={tabDrag.keyboardItemId === w.id}
          onPlay={() => playAudio(`bank-${w.id}`, w.audio)}
          playing={activeAudioKey === `bank-${w.id}`}
        />
      ))}
    </div>
  );
};

// ─── Droppable Cell ───────────────────────────────────────────────────────────
const DroppableCell = ({
  id,
  value,
  isWrong,
  locked,
  onClear,
  tabDrag,
  preview,
  returnItemId,
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
          onClear();
          tabDrag.focusItemById(returnItemId);
        }
      }}
      onFocus={() => tabDrag.focusTarget(id)}
      className={`inline-input-wb-unit4-p1-q2 ${isOver ? "drag-over-cell" : ""}`}
      onClick={() => {
        if (!locked && value) onClear();
      }}
      style={{
        background: isOver && !locked ? "#e3f2fd" : "white",
        minWidth: "120px",
        minHeight: "35px",
        padding: "5px",
        position: "relative",
        cursor: !locked && value ? "pointer" : "default",
        transition: "background 0.2s",
      }}
      title={!locked && value ? "Click to return to bank" : ""}
    >
      {value}
      {preview && <span className="wb-unit10-keyboard-preview">{preview}</span>}
      {isWrong && <span className="error-mark-input-wb-unit2-page3-q2">✕</span>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const WB_Unit10_Page1_Q2 = () => {
  const questions = [
    {
      img: bat,
      alt: "A child thinking about ice cream",
      fullAudio: iceCreamFullAudio,
      parts: [
        { type: "text", value: "I want " },
        { type: "input", answer: "ice cream" },
        { type: "text", value: "." },
      ],
    },
    {
      img: cap,
      alt: "A child thinking about fruit",
      fullAudio: fruitFullAudio,
      parts: [
        { type: "text", value: "I want" },
        { type: "input", answer: "fruit" },
        { type: "text", value: "." },
      ],
    },
    {
      img: ant,
      alt: "A child thinking about milk",
      fullAudio: milkAudio,
      parts: [
        { type: "input", answer: "I want milk" },
        { type: "text", value: "." },
      ],
    },
    {
      img: dad,
      alt: "A child thinking about an apple",
      fullAudio: appleAudio,
      parts: [
        { type: "input", answer: "I want an apple" },
        { type: "text", value: "." },
      ],
    },
  ];

  // البانك ثابت دايماً — الكلمات تضل موجودة، بس نتتبع المستخدمة
  const wordBank = questions.flatMap((q, qIndex) =>
    q.parts
      .filter((p) => p.type === "input")
      .map((p, i) => ({
        id: `q${qIndex}-${i}`,
        value: p.answer,
        audio: {
          "ice cream": iceCreamAudio,
          fruit: fruitAudio,
          "I want milk": milkAudio,
          "I want an apple": appleAudio,
        }[p.answer],
      })),
  );

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [lockedInputs, setLockedInputs] = useState(new Set());
  const [completedRows, setCompletedRows] = useState(new Set());
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();

  // القيم الموجودة حالياً في خانات الإجابة (lowercase)
  const usedValues = new Set(
    answers
      .flat()
      .filter(Boolean)
      .map((v) => v.toLowerCase()),
  );
  const targetIds = questions.flatMap((q, qIndex) =>
    q.parts
      .map((part, pIndex) =>
        part.type === "input" ? `drop-${qIndex}-${pIndex}` : null,
      )
      .filter(Boolean),
  );
  const tabDrag = useUnit10TabDrag({
    itemIds: wordBank.map((word) => word.id),
    targetIds,
    isItemDisabled: (id) => {
      const word = wordBank.find((item) => item.id === id);
      return locked || !word || usedValues.has(word.value.toLowerCase());
    },
    isTargetDisabled: (id) => {
      const [qIndex, pIndex] = id.replace("drop-", "").split("-").map(Number);
      return locked || lockedInputs.has(`${qIndex}-${pIndex}`);
    },
    onPlace: (itemId, targetId) => {
      const word = wordBank.find((item) => item.id === itemId)?.value;
      const [qIndex, pIndex] = targetId
        .replace("drop-", "")
        .split("-")
        .map(Number);
      if (!word || lockedInputs.has(`${qIndex}-${pIndex}`)) return;
      setAnswers((prev) => {
        const copy = prev.map((row) => [...row]);
        copy.forEach((row, qi) =>
          row.forEach((value, pi) => {
            if (value?.toLowerCase() === word.toLowerCase()) copy[qi][pi] = "";
          }),
        );
        copy[qIndex][pIndex] = word.toLowerCase();
        return copy;
      });
      setWrongInputs((prev) =>
        prev.filter((key) => key !== `${qIndex}-${pIndex}`),
      );
    },
  });

  // ─── Drag Handlers ──────────────────────────────────────────────────────────
  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || locked) return;

    const destId = String(over.id);
    const word = active.data.current?.text;
    if (!word) return;

    if (destId === "bank") {
      // رجعت على البانك → شيلها من الخانة
      setAnswers((prev) => {
        const copy = prev.map((row) => [...row]);
        copy.forEach((row, qi) =>
          row.forEach((val, pi) => {
            if (val?.toLowerCase() === word.toLowerCase()) copy[qi][pi] = "";
          }),
        );
        return copy;
      });
      setWrongInputs([]);
      return;
    }

    if (destId.startsWith("drop-")) {
      const [qIndex, pIndex] = destId
        .replace("drop-", "")
        .split("-")
        .map(Number);
      if (lockedInputs.has(`${qIndex}-${pIndex}`)) return;

      // إذا الخانة مشغولة بنفس الكلمة → لا شي
      if (answers[qIndex][pIndex]?.toLowerCase() === word.toLowerCase()) return;

      setAnswers((prev) => {
        const copy = prev.map((row) => [...row]);
        // شيل الكلمة من مكانها القديم (إذا كانت بخانة ثانية)
        copy.forEach((row, qi) =>
          row.forEach((val, pi) => {
            if (val?.toLowerCase() === word.toLowerCase()) copy[qi][pi] = "";
          }),
        );
        copy[qIndex][pIndex] = word.toLowerCase();
        return copy;
      });
      setWrongInputs([]);
    }
  };

  // ─── Click على خانة مليانة → ارجع القيمة للبانك ────────────────────────────
  const handleClear = (qIndex, pIndex) => {
    if (locked || lockedInputs.has(`${qIndex}-${pIndex}`)) return;
    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[qIndex][pIndex] = "";
      return copy;
    });
    setWrongInputs([]);
  };

  // ─── Buttons ─────────────────────────────────────────────────────────────────
  const checkAnswers = () => {
    if (locked) return;
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      for (let pIndex = 0; pIndex < questions[qIndex].parts.length; pIndex++) {
        if (questions[qIndex].parts[pIndex].type === "input") {
          if (!answers[qIndex][pIndex]?.trim()) {
            ValidationAlert.info(`Please complete question ${qIndex + 1}.`);
            return;
          }
        }
      }
    }
    let wrong = [],
      score = 0,
      total = 0;
    questions.forEach((q, qIndex) => {
      q.parts.forEach((p, pIndex) => {
        if (p.type === "input") {
          total++;
          if (
            answers[qIndex][pIndex]?.trim().toLowerCase() ===
            p.answer.toLowerCase()
          )
            score++;
          else wrong.push(`${qIndex}-${pIndex}`);
        }
      });
    });
    setWrongInputs(wrong);
    setLockedInputs((old) => {
      const next = new Set(old);
      questions.forEach((q, qIndex) =>
        q.parts.forEach((p, pIndex) => {
          if (
            p.type === "input" &&
            answers[qIndex][pIndex]?.trim().toLowerCase() ===
              p.answer.toLowerCase()
          )
            next.add(`${qIndex}-${pIndex}`);
        }),
      );
      return next;
    });
    setCompletedRows((old) => {
      const next = new Set(old);
      questions.forEach((q, qIndex) =>
        q.parts.forEach((part, pIndex) => {
          if (
            part.type === "input" &&
            answers[qIndex][pIndex]?.trim().toLowerCase() ===
              part.answer.toLowerCase()
          )
            next.add(qIndex);
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
    setLockedInputs(
      new Set(wordBank.map((w) => w.id.replace("q", "").replace("-0", "-1"))),
    );
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

  const activeWord = wordBank.find((w) => w.id === activeId);

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
        <div style={{gap:"10px"}} className="div-forall">
          <ExerciseHeader
            sectionLetter="B"
            title="Look and write."
            subTitle="Look at each thought bubble and drag the matching food phrase into the blank."
          />

          {/* ── Word Bank ── */}
          <WordBank
            wordBank={wordBank}
            locked={locked}
            usedValues={usedValues}
            tabDrag={tabDrag}
            activeAudioKey={activeAudioKey}
            playAudio={playAudio}
          />

          {/* ── Questions ── */}
          <div className="content-container-wb-unit10-p1-q2 w-full mb-10">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className={`row2-wb-unit4-p1-q2 ${completedRows.has(qIndex) ? "wb-unit10-audio-control wb-unit10-completed-audio" : ""}`}
                role={completedRows.has(qIndex) ? "button" : undefined}
                tabIndex={completedRows.has(qIndex) ? 0 : undefined}
                aria-label={
                  completedRows.has(qIndex)
                    ? `Play complete sentence ${qIndex + 1}`
                    : undefined
                }
                onClick={
                  completedRows.has(qIndex)
                    ? () => playAudio(`full-${qIndex}`, q.fullAudio)
                    : undefined
                }
                onKeyDown={
                  completedRows.has(qIndex)
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          playAudio(`full-${qIndex}`, q.fullAudio);
                        }
                      }
                    : undefined
                }
              >
                <PlayingAudioIcon
                  active={activeAudioKey === `full-${qIndex}`}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <span className="num-span">{qIndex + 1}</span>
                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q-img-wb-unit2-page3-q2"
                  />
                </div>

                <div className="sentence-wrapper-wb-unit4-p1-q2">
                  {q.parts.map((part, pIndex) => {
                    if (part.type === "text") {
                      const isIWant =
                        part.value.trim().toLowerCase() === "i want";
                      return (
                        <span
                          key={pIndex}
                          className={`sentence-text ${isIWant ? "wb-unit10-audio-control" : ""}`}
                          role={isIWant ? "button" : undefined}
                          tabIndex={isIWant ? 0 : undefined}
                          aria-label={isIWant ? "Play I want" : undefined}
                          onClick={
                            isIWant
                              ? (event) => {
                                  event.stopPropagation();
                                  playAudio(`i-want-${qIndex}`, iWantAudio);
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
                                    playAudio(`i-want-${qIndex}`, iWantAudio);
                                  }
                                }
                              : undefined
                          }
                        >
                          <PlayingAudioIcon
                            active={activeAudioKey === `i-want-${qIndex}`}
                          />
                          {part.value}
                        </span>
                      );
                    }

                    return (
                      <span key={pIndex} style={{ position: "relative" }}>
                        <DroppableCell
                          id={`drop-${qIndex}-${pIndex}`}
                          value={answers[qIndex][pIndex]}
                          isWrong={wrongInputs.includes(`${qIndex}-${pIndex}`)}
                          locked={
                            locked || lockedInputs.has(`${qIndex}-${pIndex}`)
                          }
                          onClear={() => handleClear(qIndex, pIndex)}
                          tabDrag={tabDrag}
                          preview={
                            tabDrag.keyboardTargetId ===
                            `drop-${qIndex}-${pIndex}`
                              ? wordBank.find(
                                  (word) => word.id === tabDrag.keyboardItemId,
                                )?.value
                              : ""
                          }
                          returnItemId={
                            wordBank.find(
                              (word) =>
                                word.value.toLowerCase() ===
                                answers[qIndex][pIndex]?.toLowerCase(),
                            )?.id
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

      {/* ── Drag Overlay ── */}
      <DragOverlay>
        {activeWord ? (
          <div
            style={{
              padding: "6px 12px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "white",
              fontWeight: "600",
              cursor: "grabbing",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            {activeWord.value}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit10_Page1_Q2;
