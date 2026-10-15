import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit10Audio from "./useUnit10Audio";
import useUnit10TabDrag from "./useUnit10TabDrag";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import full1Audio from "../../../assets/U1 WB/U10/audio/page58- C/full1.mp3";
import full2Audio from "../../../assets/U1 WB/U10/audio/page58- C/full2.mp3";
import full3Audio from "../../../assets/U1 WB/U10/audio/page58- C/full3.mp3";
import q1QuestionAudio from "../../../assets/U1 WB/U10/audio/page58- C/Item_005_Do_you_want_chicken.mp3";
import q1AnswerAudio from "../../../assets/U1 WB/U10/audio/page58- C/Item_006_Yes,_I_do.mp3";
import q2QuestionAudio from "../../../assets/U1 WB/U10/audio/page58- C/Item_001_you_want_ice_cream_[cut_1sec].mp3";
import q2AnswerAudio from "../../../assets/U1 WB/U10/audio/page58- C/Item_003_Ido.mp3";
import q3QuestionAudio from "../../../assets/U1 WB/U10/audio/page58- C/Item_004_Do_you_want.mp3";
import q3AnswerAudio from "../../../assets/U1 WB/U10/audio/page58- C/Item_002_I_don't.mp3";
import q1Img from "../../../assets/U1 WB/U10/U10P58EXEC-01.svg";
import q2Img from "../../../assets/U1 WB/U10/U10P58EXEC-02.svg";
import q3Img from "../../../assets/U1 WB/U10/U10P58EXEC-03.svg";
import "./WB_Unit10_Page2_Q1.css";

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
const DraggableWord = ({ id, text, disabled, isUsed, audio, playing, onPlay, tabDrag }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
    data: { text },
  });

  return (
    <div
      ref={(element) => { setNodeRef(element); tabDrag.registerItem(id, element); }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={disabled || isUsed ? -1 : 0}
      aria-label={`Play ${text}${!disabled && !isUsed ? " and drag it" : ""}`}
      className={`wb-unit10-audio-control ${tabDrag.keyboardItemId === id ? "wb-unit10-keyboard-preview" : ""}`}
      onClick={onPlay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onPlay();
        tabDrag.handleItemKeyDown(event, id);
      }}
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
      {playing && audio && <Unit10PlayingAudioIcon />}{text}
    </div>
  );
};

// ─── Word Bank ────────────────────────────────────────────────────────────────
const WordBank = ({ wordBank, locked, usedValues, audioMap, activeAudioKey, playAudio, tabDrag }) => {
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
          key={w}
          id={w}
          text={w}
          disabled={locked}
          isUsed={usedValues.has(w)}
          audio={audioMap[w]}
          playing={activeAudioKey === `bank-${w}`}
          onPlay={() => playAudio(`bank-${w}`, audioMap[w])}
          tabDrag={tabDrag}
        />
      ))}
    </div>
  );
};

// ─── Inline Droppable Cell ────────────────────────────────────────────────────
const DroppableCell = ({ id, value, isWrong, locked, onClear, tabDrag, preview }) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <span
        ref={(element) => { setNodeRef(element); tabDrag.registerTarget(id, element); }}
        role="button"
        tabIndex={!locked && (tabDrag.keyboardItemId || value) ? 0 : -1}
        onKeyDown={(event) => {
          if (tabDrag.keyboardItemId) tabDrag.handleTargetKeyDown(event, id);
          else if ((event.key === "Enter" || event.key === " ") && value && !locked) {
            event.preventDefault();
            onClear();
            tabDrag.focusItemById(value);
          }
        }}
        onFocus={() => tabDrag.focusTarget(id)}
        className={`line-input-wb-unit10-p2-q1 ${isOver ? "drag-over-cell" : ""}`}
        onClick={() => {
          if (!locked && value) onClear();
        }}
        style={{
          background: isOver && !locked ? "#e3f2fd" : "white",
          display: "inline-block",
          minWidth: "120px",
          padding: "4px",
          cursor: !locked && value ? "pointer" : "default",
          transition: "background 0.2s",
        }}
        title={!locked && value ? "Click to return to bank" : ""}
      >
        {value}
        {preview && <span className="wb-unit10-keyboard-preview">{preview}</span>}
      </span>
      {isWrong && <span className="wrong-circle-x-wb-unit10-p2-q1">✕</span>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const WB_Unit10_Page2_Q1 = () => {
  const correctAnswers = {
    q2_question: "you want ice cream",
    q2_answer: "I do",
    q3_question: "Do you want",
    q3_answer: "I don't",
  };

  const wordBank = ["you want ice cream", "I do", "Do you want", "I don't"];
  const bankAudio = { "you want ice cream": q2QuestionAudio, "I do": q2AnswerAudio, "Do you want": q3QuestionAudio, "I don't": q3AnswerAudio };

  const emptyAnswers = {
    q2_question: "",
    q2_answer: "",
    q3_question: "",
    q3_answer: "",
  };

  const [answers, setAnswers] = useState(emptyAnswers);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [lockedInputs, setLockedInputs] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();
  const locked = lockedInputs.length === Object.keys(correctAnswers).length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // القيم الموجودة حالياً في الخانات
  const usedValues = new Set(Object.values(answers).filter(Boolean));
  const targetIds = Object.keys(correctAnswers);
  const tabDrag = useUnit10TabDrag({
    itemIds: wordBank,
    targetIds,
    isItemDisabled: (id) => locked || usedValues.has(id),
    isTargetDisabled: (id) => lockedInputs.includes(id),
    onPlace: (word, targetId) => {
      setAnswers((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((key) => { if (copy[key] === word) copy[key] = ""; });
        copy[targetId] = word;
        return copy;
      });
      setWrongInputs((prev) => prev.filter((key) => key !== targetId));
    },
  });

  // ─── Drag Handlers ──────────────────────────────────────────────────────────
  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || locked) return;

    const word = active.id;
    const destId = String(over.id);

    if (destId === "bank") {
      // رجع على البانك → شيله من خانته
      setAnswers((prev) => {
        const copy = { ...prev };
        Object.keys(copy).forEach((k) => {
          if (copy[k] === word) copy[k] = "";
        });
        return copy;
      });
      setWrongInputs([]);
      return;
    }

    // نزل على خانة → ضعه فيها وشيله من أي خانة ثانية
    if (Object.keys(correctAnswers).includes(destId) && !lockedInputs.includes(destId)) {
      setAnswers((prev) => {
        const copy = { ...prev };
        // شيل الكلمة من مكانها القديم
        Object.keys(copy).forEach((k) => {
          if (copy[k] === word) copy[k] = "";
        });
        copy[destId] = word;
        return copy;
      });
      setWrongInputs([]);
    }
  };

  // ─── Click على خانة مليانة → ارجع للبانك ───────────────────────────────────
  const handleClear = (key) => {
    if (lockedInputs.includes(key)) return;
    setAnswers((prev) => ({ ...prev, [key]: "" }));
    setWrongInputs((previous) => previous.filter((item) => item !== key));
  };

  // ─── Buttons ─────────────────────────────────────────────────────────────────
  const checkAnswers = () => {
    if (locked) return;
    if (Object.values(answers).some((v) => v.trim() === "")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }
    let wrong = [], correctKeys = [],
      score = 0;
    Object.keys(correctAnswers).forEach((key) => {
      if (
        answers[key].trim().toLowerCase() === correctAnswers[key].toLowerCase()
      )
        { score++; correctKeys.push(key); }
      else wrong.push(key);
    });
    setWrongInputs(wrong);
    const nextLocked = [...new Set([...lockedInputs, ...correctKeys])];
    setLockedInputs(nextLocked);
    setCompletedRows([
      1,
      ...(nextLocked.includes("q2_question") && nextLocked.includes("q2_answer") ? [2] : []),
      ...(nextLocked.includes("q3_question") && nextLocked.includes("q3_answer") ? [3] : []),
    ]);
    const total = Object.keys(correctAnswers).length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center"><b style="color:${color}">Score: ${score}/${total}</b></div>`;
    score === total
      ? ValidationAlert.success(msg)
      : score === 0
        ? ValidationAlert.error(msg)
        : ValidationAlert.warning(msg);
  };

  const showAnswers = () => {
    setAnswers(correctAnswers);
    setWrongInputs([]);
    setLockedInputs(Object.keys(correctAnswers));
    setCompletedRows([1, 2, 3]);
    stopAudio();
  };

  const resetAll = () => {
    setAnswers(emptyAnswers);
    setWrongInputs([]);
    setLockedInputs([]);
    setCompletedRows([]);
    stopAudio();
  };

  const audioBubble = (key, source, children) => (
    <span className="wb-unit10-audio-control" role="button" tabIndex={0} aria-label="Play this sentence" onClick={(event) => { event.stopPropagation(); playAudio(key, source); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); playAudio(key, source); } }}>
      {activeAudioKey === key && <Unit10PlayingAudioIcon />}{children}
    </span>
  );

  const rowAudioProps = (row, source) => completedRows.includes(row) ? {
    role: "button", tabIndex: 0, className: "conversation-row-wb-unit10-p2-q1 w-full wb-unit10-audio-control wb-unit10-completed-audio",
    "aria-label": `Play complete dialogue ${row}`,
    onClick: () => playAudio(`full-${row}`, source),
    onKeyDown: (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); playAudio(`full-${row}`, source); } },
  } : { className: "conversation-row-wb-unit10-p2-q1 w-full" };

  return (
    <DndContext
      sensors={sensors}
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
        <div className="div-forall" style={{ gap: "10px" }}>
          <ExerciseHeader sectionLetter="C" title="Look, read, and write." subTitle="Use the pictures to complete the questions and answers about food." />

          {/* ── Word Bank ── */}
          <WordBank
            wordBank={wordBank}
            locked={locked}
            usedValues={usedValues}
            audioMap={bankAudio}
            activeAudioKey={activeAudioKey}
            playAudio={playAudio}
            tabDrag={tabDrag}
          />

          {/* ── ROW 1 (example) ── */}
          <div {...rowAudioProps(1, full1Audio)}>
            {activeAudioKey === "full-1" && <Unit10PlayingAudioIcon />}
            <span className="num-wb-unit10-p2-q1">1</span>
            <div className="bubble question-bubble-wb-unit10-p2-q1">
              {audioBubble("q1-question", q1QuestionAudio, "Do you want chicken?")}
            </div>
            <img
              src={q1Img}
              alt="A girl who wants chicken."
              className="person-img-wb-unit10-p2-q1"
            />
            <div className="bubble answer-bubble-wb-unit10-p2-q1">
              {audioBubble("q1-answer", q1AnswerAudio, "Yes, I do.")}
            </div>
          </div>

          {/* ── ROW 2 ── */}
          <div {...rowAudioProps(2, full2Audio)}>
            {activeAudioKey === "full-2" && <Unit10PlayingAudioIcon />}
            <span className="num-wb-unit10-p2-q1">2</span>

            <div className="bubble question-bubble-wb-unit10-p2-q1">
              Do{" "}
              <DroppableCell
                id="q2_question"
                value={answers.q2_question}
                isWrong={wrongInputs.includes("q2_question")}
                locked={lockedInputs.includes("q2_question")}
                onClear={() => handleClear("q2_question")}
                tabDrag={tabDrag}
                preview={tabDrag.keyboardTargetId === "q2_question" ? tabDrag.keyboardItemId : ""}
              />
              ?
            </div>

            <img
              src={q2Img}
              alt="A girl who wants ice cream."
              className="person-img-wb-unit10-p2-q1"
            />

            <div className="bubble answer-bubble-wb-unit10-p2-q1">
              Yes,{" "}
              <DroppableCell
                id="q2_answer"
                value={answers.q2_answer}
                isWrong={wrongInputs.includes("q2_answer")}
                locked={lockedInputs.includes("q2_answer")}
                onClear={() => handleClear("q2_answer")}
                tabDrag={tabDrag}
                preview={tabDrag.keyboardTargetId === "q2_answer" ? tabDrag.keyboardItemId : ""}
              />
              .
            </div>
          </div>

          {/* ── ROW 3 ── */}
          <div {...rowAudioProps(3, full3Audio)}>
            {activeAudioKey === "full-3" && <Unit10PlayingAudioIcon />}
            <span className="num-wb-unit10-p2-q1">3</span>

            <div className="bubble question-bubble-wb-unit10-p2-q1">
              <DroppableCell
                id="q3_question"
                value={answers.q3_question}
                isWrong={wrongInputs.includes("q3_question")}
                locked={lockedInputs.includes("q3_question")}
                onClear={() => handleClear("q3_question")}
                tabDrag={tabDrag}
                preview={tabDrag.keyboardTargetId === "q3_question" ? tabDrag.keyboardItemId : ""}
              />{" "}
              bread?
            </div>

            <img src={q3Img} alt="A boy who wants milk instead of bread." className="person-img-wb-unit10-p2-q1" />

            <div className="bubble answer-bubble-wb-unit10-p2-q1">
              No,{" "}
              <DroppableCell
                id="q3_answer"
                value={answers.q3_answer}
                isWrong={wrongInputs.includes("q3_answer")}
                locked={lockedInputs.includes("q3_answer")}
                onClear={() => handleClear("q3_answer")}
                tabDrag={tabDrag}
                preview={tabDrag.keyboardTargetId === "q3_answer" ? tabDrag.keyboardItemId : ""}
              />
              .
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
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

      {/* ── Drag Overlay ── */}
      <DragOverlay>
        {activeId ? (
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
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit10_Page2_Q1;
