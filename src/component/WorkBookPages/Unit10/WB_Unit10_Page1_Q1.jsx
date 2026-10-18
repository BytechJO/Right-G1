import React, { useState, useMemo } from "react";
import "./WB_Unit10_Page1_Q1.css";
import jello from "../../../assets/U1 WB/U10/U10P57EXEA-01.svg";
import present from "../../../assets/U1 WB/U10/U10P57EXEA-02.svg";
import balloons from "../../../assets/U1 WB/U10/U10P57EXEA-03.svg";
import balloons1 from "../../../assets/U1 WB/U10/U10P57EXEA-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import useUnit10Audio from "./useUnit10Audio";
import useUnit10TabDrag from "./useUnit10TabDrag";
import a1 from "../../../assets/U1 WB/U10/audio/page57- A/Item_001_I_want_an_plepa.mp3";
import a3 from "../../../assets/U1 WB/U10/audio/page57- A/Item_003_I_want_darb.mp3";
import a5 from "../../../assets/U1 WB/U10/audio/page57- A/Item_005_I_want_ncikeh.mp3";
import a7 from "../../../assets/U1 WB/U10/audio/page57- A/Item_007_I_want_ice_mreac.mp3";

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
const questions = [
  {
    id: "q1",
    img: jello,
    alt: "An apple",
    scramble: "I want an plepa.",
    correct: "I want an apple",
    words: ["I", "want", "an", "apple"],
    scrambleAudio: a1,
  },
  {
    id: "q2",
    img: present,
    alt: "A loaf of bread",
    scramble: "I want daerb.",
    correct: "I want bread",
    words: ["I", "want", "bread"],
    scrambleAudio: a3,
  },
  {
    id: "q3",
    img: balloons,
    alt: "A roast chicken",
    scramble: "I want ncckeih.",
    correct: "I want chicken",
    words: ["I", "want", "chicken"],
    scrambleAudio: a5,
  },
  {
    id: "q4",
    img: balloons1,
    alt: "A bowl of ice cream",
    scramble: "I want eic mreac.",
    correct: "I want ice cream",
    words: ["I", "want", "ice", "cream"],
    scrambleAudio: a7,
  },
];

// ── shuffle — البانك دايماً عنده كل الكلمات، ما نشيل منه أبداً ──
const shuffle = (qId, arr) => {
  const a = arr.map((text, i) => ({ id: `${qId}-chip-${i}`, text }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildBank = () => {
  const bank = {};
  questions.forEach((q) => {
    bank[q.id] = shuffle(q.id, q.words);
  });
  return bank;
};

// ── Draggable word chip ───────────────────────
// isUsed = موجودة بالإجابة حالياً → disabled + فاتحة
function DraggableWord({
  id,
  text,
  qId,
  disabled,
  isUsed,
  onKeyboardPick,
  bankRef,
  selected,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
    data: { text, qId },
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
      aria-label={`${text}. Press Enter to place.`}
      onKeyDown={(event) => {
        if (
          (event.key === "Enter" || event.key === " ") &&
          !disabled &&
          !isUsed
        ) {
          event.preventDefault();
          onKeyboardPick();
        }
      }}
      className={selected ? "wb-unit10-keyboard-preview" : ""}
      style={{
        padding: "6px 12px",
        border: `2px solid ${isUsed ? "#c0c0c0" : "#2c5287"}`,
        borderRadius: "8px",
        background: isUsed ? "#f0f0f0" : "#fff",
        color: isUsed ? "#bbb" : "inherit",
        fontWeight: "600",
        cursor: disabled || isUsed ? "default" : "grab",
        opacity: isDragging ? 0.4 : 1,
        touchAction: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        transition: "background 0.2s, color 0.2s, border-color 0.2s",
      }}
    >
      {text}
    </div>
  );
}

// ── Word bank droppable zone ──────────────────
function WordBankZone({
  id,
  qId,
  words,
  isOver,
  disabled,
  usedIds,
  onKeyboardPick,
  registerItem,
  selectedId,
}) {
  const { setNodeRef } = useDroppable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        gap: "8px",
        minHeight: "40px",
        padding: "4px 6px",
        borderRadius: "8px",
        border: isOver ? "2px dashed #2c5287" : "2px dashed transparent",
        background: isOver ? "#e8f0fe" : "transparent",
        alignItems: "center",
        transition: "background 0.15s",
      }}
    >
      {words.map((w) => (
        <DraggableWord
          key={w.id}
          id={w.id}
          text={w.text}
          qId={qId}
          disabled={disabled}
          isUsed={usedIds.has(w.id)}
          onKeyboardPick={() => onKeyboardPick(w)}
          bankRef={(element) => registerItem(w.id, element)}
          selected={selectedId === w.id}
        />
      ))}
    </div>
  );
}

// ── Droppable answer box ──────────────────────
function DroppableAnswer({
  id,
  words,
  isOver,
  isWrong,
  disabled,
  onRemoveWord,
  preview,
  registerTarget,
  onKeyDown,
  keyboardActive,
  focusItemById,
}) {
  const { setNodeRef } = useDroppable({ id, disabled });
  const value = words.map((word) => word.text).join(" ");
  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        registerTarget(id, element);
      }}
      role="button"
      tabIndex={!disabled && keyboardActive ? 0 : -1}
      onKeyDown={keyboardActive ? onKeyDown : undefined}
      className={`answer-input33-review10-p1-q3 ${isOver ? "drag-over-cell" : ""}`}
      style={{
        cursor: "default",
        background: isOver ? "#e3f2fd" : "white",
        display: "flex",
        gap: "6px",
        height: "40px",
        alignItems: "center",
        padding: "6px",
        position: "relative",
      }}
      aria-label={value ? `Answer: ${value}` : "Empty answer area"}
    >
      {words.map((word) => (
        <span
          key={word.id}
          role="button"
          tabIndex={disabled || keyboardActive ? -1 : 0}
          aria-label={`Return ${word.text} to the word bank`}
          onClick={(event) => {
            event.stopPropagation();
            if (!disabled) onRemoveWord(word.id);
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && !disabled) {
              event.preventDefault();
              event.stopPropagation();
              onRemoveWord(word.id);
              focusItemById(word.id);
            }
          }}
          style={{ cursor: disabled ? "default" : "pointer" }}
        >
          {word.text}
        </span>
      ))}
      {preview && <span className="wb-unit10-keyboard-preview">{preview}</span>}
      {isWrong && <span className="error-mark-input1">✕</span>}
    </div>
  );
}

// ── Main component ────────────────────────────
const WB_Unit10_Page1_Q1 = () => {
  // bank[qId] = [{id, text}]  — كل الكلمات دايماً موجودة، ما نشيل منها
  // filled[qId] = [{id, text}]  — الكلمات الموضوعة في خانة الإجابة
  const [bank, setBank] = useState(buildBank);
  const [filled, setFilled] = useState({ q1: [], q2: [], q3: [], q4: [] });
  const [wrong, setWrong] = useState({});
  const [locked, setLocked] = useState(false);
  const [lockedRows, setLockedRows] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // IDs المستخدمة حالياً في كل سؤال
  const usedIdsMap = useMemo(() => {
    const map = {};
    questions.forEach((q) => {
      map[q.id] = new Set((filled[q.id] || []).map((w) => w.id));
    });
    return map;
  }, [filled]);

  const itemIds = useMemo(
    () => questions.flatMap((q) => (bank[q.id] || []).map((word) => word.id)),
    [bank],
  );
  const targetIds = useMemo(() => questions.map((q) => `answer-${q.id}`), []);
  const tabDrag = useUnit10TabDrag({
    itemIds,
    targetIds,
    getTargetIds: (id) => {
      const row = questions.find((q) => id?.startsWith(`${q.id}-chip-`));
      return row ? [`answer-${row.id}`] : [];
    },
    getItemIdsForItem: (id) => {
      const row = questions.find((q) => id?.startsWith(`${q.id}-chip-`));
      return row ? (bank[row.id] || []).map((word) => word.id) : [];
    },
    isItemDisabled: (id) => {
      const row = questions.find((q) => id.startsWith(`${q.id}-chip-`));
      return (
        !row || locked || lockedRows.has(row.id) || usedIdsMap[row.id]?.has(id)
      );
    },
    isTargetDisabled: (id) =>
      locked || lockedRows.has(id.replace("answer-", "")),
    onPlace: (wordId, targetId) => {
      const qId = targetId.replace("answer-", "");
      const word = bank[qId]?.find((item) => item.id === wordId);
      if (
        !word ||
        !wordId.startsWith(`${qId}-chip-`) ||
        usedIdsMap[qId]?.has(wordId)
      )
        return;
      setFilled((prev) => ({ ...prev, [qId]: [...prev[qId], word] }));
      setWrong((prev) => ({ ...prev, [qId]: false }));
    },
  });

  const activeChip = useMemo(() => {
    if (!activeId) return null;
    for (const q of questions) {
      const found = bank[q.id]?.find((w) => w.id === activeId);
      if (found) return found;
      const inFill = filled[q.id]?.find((w) => w.id === activeId);
      if (inFill) return inFill;
    }
    return null;
  }, [activeId, bank, filled]);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragOver = ({ over }) => setOverId(over ? over.id : null);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setOverId(null);
    if (!over || locked) return;

    const wordId = active.id;
    const dest = String(over.id);
    const srcQid = active.data.current?.qId;
    if (!srcQid) return;
    if (lockedRows.has(srcQid)) return;

    const isBankDest = dest.startsWith("bank-");
    const isAnswerDest = dest.startsWith("answer-");
    if (!isBankDest && !isAnswerDest) return;

    const destQid = dest.replace("bank-", "").replace("answer-", "");
    if (srcQid !== destQid) return;

    // هل الكلمة مستخدمة (موجودة بـ filled) أم لا؟
    const inFilled = filled[srcQid]?.find((w) => w.id === wordId);
    const inBank = bank[srcQid]?.find((w) => w.id === wordId);
    const chip = inFilled || inBank;
    if (!chip) return;

    const srcZone = inFilled ? "answer" : "bank";

    // البانك ما بنعدّل عليه أبداً (الكلمات تضل موجودة)
    // بس نعدّل على filled

    if (srcZone === "bank" && isAnswerDest) {
      // من البانك → خانة الإجابة: أضف للـ filled (إذا مش مستخدمة)
      const alreadyUsed = filled[destQid]?.some((w) => w.id === wordId);
      if (alreadyUsed) return;
      setFilled((prev) => ({
        ...prev,
        [destQid]: [...(prev[destQid] || []), chip],
      }));
    } else if (srcZone === "answer" && isBankDest) {
      // من خانة الإجابة → البانك: شيلها من filled فقط
      setFilled((prev) => ({
        ...prev,
        [srcQid]: prev[srcQid].filter((w) => w.id !== wordId),
      }));
    } else if (srcZone === "answer" && isAnswerDest) {
      // من answer → answer نفسها: لا شي
      return;
    }

    setWrong({});
  };

  // ── Click على خانة الإجابة → ارجع آخر كلمة للبانك (= شيلها من filled) ──
  const removeWord = (qId, wordId) => {
    if (locked || lockedRows.has(qId)) return;
    setFilled((prev) => ({
      ...prev,
      [qId]: prev[qId].filter((word) => word.id !== wordId),
    }));
    setWrong({});
  };

  // ── Check ──────────────────────────────────────────────────────────────────
  const checkAnswers = () => {
    if (locked || lockedRows.size === questions.length) return;
    const hasEmpty = questions.some(
      (q) => !filled[q.id] || filled[q.id].length === 0,
    );
    if (hasEmpty) {
      ValidationAlert.info("Please answer all the questions before checking.");
      return;
    }
    let score = 0;
    const wrongTemp = {};
    questions.forEach((q) => {
      const userAnswer = filled[q.id].map((w) => w.text).join(" ");
      if (userAnswer === q.correct) score++;
      else wrongTemp[q.id] = true;
    });
    setWrong(wrongTemp);
    setLockedRows((old) => {
      const next = new Set(old);
      questions.forEach((q) => {
        if (filled[q.id].map((w) => w.text).join(" ") === q.correct)
          next.add(q.id);
      });
      return next;
    });
    const total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  // ── Show Answer ────────────────────────────────────────────────────────────
  const showCorrectAnswers = () => {
    const newFilled = {};
    questions.forEach((q) => {
      newFilled[q.id] = q.correct
        .split(" ")
        .map((t, i) => ({ id: `correct-${q.id}-${i}`, text: t }));
    });
    setFilled(newFilled);
    setWrong({});
    setLocked(true);
    setLockedRows(new Set(questions.map((q) => q.id)));
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = () => {
    setBank(buildBank());
    setFilled({ q1: [], q2: [], q3: [], q4: [] });
    setWrong({});
    setLocked(false);
    setLockedRows(new Set());
    stopAudio();
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div style={{ gap: "0px" }} className="div-forall mb-10">
          <ExerciseHeader
            sectionLetter="A"
            title="Look, read, unscramble, and write."
            subTitle="Unscramble the food word, then arrange the full I want sentence."
          />

          <div className="content-container-wb-unit10-p1-q1">
            {questions.map((q, index) => {
              const bankDropId = `bank-${q.id}`;
              const answerDropId = `answer-${q.id}`;
              const usedIds = usedIdsMap[q.id];

              return (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <span className="num2">{index + 1}</span>
                  <img
                    src={q.img}
                    className="img-wb-unit10-p1-q1"
                    alt={q.alt}
                  />

                  <div className="input-container-wb-unit10-p1-q1">
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        className="wb-unit10-audio-control"
                        role="button"
                        tabIndex={0}
                        aria-label={`Play ${q.scramble}`}
                        onClick={() =>
                          playAudio(`scramble-${q.id}`, q.scrambleAudio)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            playAudio(`scramble-${q.id}`, q.scrambleAudio);
                          }
                        }}
                      >
                        <input
                          readOnly
                          value={q.scramble}
                          className="answer-input-review10-p1-q3"
                          tabIndex={-1}
                        />
                        <PlayingAudioIcon
                          active={activeAudioKey === `scramble-${q.id}`}
                        />
                      </div>

                      <WordBankZone
                        id={bankDropId}
                        qId={q.id}
                        words={bank[q.id] || []}
                        isOver={overId === bankDropId}
                        disabled={locked || lockedRows.has(q.id)}
                        usedIds={usedIds}
                        onKeyboardPick={(word) => tabDrag.pickItem(word.id)}
                        registerItem={tabDrag.registerItem}
                        selectedId={tabDrag.keyboardItemId}
                      />
                    </div>

                    <DroppableAnswer
                      id={answerDropId}
                      words={filled[q.id] || []}
                      isOver={overId === answerDropId}
                      isWrong={!!wrong[q.id]}
                      disabled={locked || lockedRows.has(q.id)}
                      onRemoveWord={(wordId) => removeWord(q.id, wordId)}
                      preview={
                        tabDrag.keyboardTargetId === answerDropId
                          ? bank[q.id]?.find(
                              (item) => item.id === tabDrag.keyboardItemId,
                            )?.text
                          : ""
                      }
                      registerTarget={tabDrag.registerTarget}
                      onKeyDown={(event) =>
                        tabDrag.handleTargetKeyDown(event, answerDropId)
                      }
                      keyboardActive={Boolean(tabDrag.keyboardItemId)}
                      focusItemById={tabDrag.focusItemById}
                    />
                  </div>
                </div>
              );
            })}
          </div>

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
      </div>

      <DragOverlay>
        {activeChip ? (
          <div
            style={{
              padding: "6px 12px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "#fff",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              cursor: "grabbing",
              whiteSpace: "nowrap",
            }}
          >
            {activeChip.text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit10_Page1_Q1;
