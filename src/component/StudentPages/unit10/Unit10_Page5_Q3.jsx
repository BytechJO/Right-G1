import { useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import plate from "../../../assets/unit10/imgs/U10P86EXEB.svg";
import breadAudio from "../../../assets/unit10/sound/Page 86 - B/bread.mp3";
import chickenAudio from "../../../assets/unit10/sound/Page 86 - B/chicken.mp3";
import fruitAudio from "../../../assets/unit10/sound/Page 86 - B/fruit.mp3";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit10Audio from "./useUnit10Audio";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import "./Unit10_Page5_Q3.css";

const DATA = [
  { correct: "chicken", audio: chickenAudio },
  { correct: "bread", audio: breadAudio },
  { correct: "fruit", audio: fruitAudio },
];

const BankChip = ({ word, isUsed, complete, registerRef, onPlay, onPick, playing }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${word}`,
    disabled: isUsed || complete,
  });

  return (
    <span
      ref={(node) => {
        setNodeRef(node);
        registerRef(node);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-label={`${isUsed ? "Play" : "Pick"} ${word}`}
      className="unit10-audio-control"
      onClick={onPlay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPlay();
          if (!isUsed && !complete) onPick();
        }
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: isUsed ? "#e0e0e0" : "white",
        fontWeight: "bold",
        cursor: isUsed || complete ? "default" : "grab",
        opacity: isUsed ? 0.45 : isDragging ? 0.3 : 1,
        transition: "opacity 0.2s, background 0.2s",
        userSelect: "none",
        touchAction: "none",
        color: isUsed ? "#999" : "",
      }}
    >
      {playing && <Unit10PlayingAudioIcon />}
      {word}
    </span>
  );
};

const DropSlot = ({
  index,
  answer,
  isWrong,
  locked,
  previewWord,
  keyboardActive,
  registerRef,
  onFocus,
  onKeyDown,
  onRemove,
}) => {
  const id = `slot-${index}`;
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });
  const displayedWord = previewWord || answer;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        registerRef(node);
      }}
      role={!locked ? "button" : undefined}
      tabIndex={!locked && (keyboardActive || answer) ? 0 : -1}
      aria-label={!locked ? (displayedWord ? `${displayedWord} in answer ${index + 1}` : `Empty answer ${index + 1}`) : undefined}
      className={`q-input-unit10-p5-q3${isOver ? " drag-over-cell" : ""}`}
      style={{
        position: "relative",
        background: isOver ? "#e8f0fe" : "transparent",
        transition: "background 0.15s",
        cursor: answer && !locked ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
      }}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onClick={() => {
        if (answer && !locked && !previewWord) onRemove();
      }}
      title={answer && !locked ? "Click to remove" : ""}
    >
      {displayedWord && (
        <span className={previewWord ? "unit10-keyboard-preview" : ""}>
          {displayedWord}
        </span>
      )}
      {isWrong && !previewWord && <span className="wrong-icon-review6-p1-q3">✕</span>}
    </div>
  );
};

const Unit10_Page5_Q3 = () => {
  const [answers, setAnswers] = useState(Array(DATA.length).fill(null));
  const [wrongInputs, setWrongInputs] = useState([]);
  const [lockedInputs, setLockedInputs] = useState([]);
  const [audioReadyInputs, setAudioReadyInputs] = useState([]);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [keyboardWord, setKeyboardWord] = useState(null);
  const [focusedSlot, setFocusedSlot] = useState(null);
  const bankRefs = useRef(new Map());
  const slotRefs = useRef(new Map());
  const checkButtonRef = useRef(null);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const usedWords = new Set(answers.filter(Boolean));
  const activeWord = activeId ? activeId.replace("bank-", "") : null;
  const complete = lockedInputs.length === DATA.length;

  const availableSlots = () => DATA.map((_, index) => index).filter((index) => !lockedInputs.includes(index));
  const focusSlot = (index) => {
    setFocusedSlot(index);
    requestAnimationFrame(() => slotRefs.current.get(index)?.focus());
  };
  const pickWord = (word) => {
    const available = availableSlots();
    if (!available.length || usedWords.has(word)) return;
    setKeyboardWord(word);
    focusSlot(available[0]);
  };
  const cancelPick = () => {
    const word = keyboardWord;
    setKeyboardWord(null);
    setFocusedSlot(null);
    requestAnimationFrame(() => bankRefs.current.get(word)?.focus());
  };
  const focusNextBank = (word, updatedAnswers) => {
    const words = DATA.map((item) => item.correct);
    const start = words.indexOf(word);
    const ordered = [...words.slice(start + 1), ...words.slice(0, start)];
    const next = ordered.find((candidate) => !updatedAnswers.includes(candidate));
    requestAnimationFrame(() => {
      if (next) bankRefs.current.get(next)?.focus();
      else checkButtonRef.current?.focus();
    });
  };
  const placeWord = (word, index, returnToBank = false) => {
    if (lockedInputs.includes(index)) return;
    let nextAnswers;
    setAnswers((previous) => {
      const updated = [...previous];
      const oldIndex = updated.findIndex((answer) => answer === word);
      if (oldIndex !== -1) updated[oldIndex] = null;
      updated[index] = word;
      nextAnswers = updated;
      return updated;
    });
    setWrongInputs((previous) => previous.filter((wrongIndex) => wrongIndex !== index));
    setKeyboardWord(null);
    setFocusedSlot(null);
    if (returnToBank) setTimeout(() => focusNextBank(word, nextAnswers), 0);
  };
  const removeWord = (index, returnFocus = false) => {
    if (lockedInputs.includes(index)) return;
    const removed = answers[index];
    setAnswers((previous) => previous.map((answer, answerIndex) => answerIndex === index ? null : answer));
    setWrongInputs((previous) => previous.filter((wrongIndex) => wrongIndex !== index));
    if (returnFocus && removed) requestAnimationFrame(() => bankRefs.current.get(removed)?.focus());
  };
  const handleSlotKeyDown = (event, index) => {
    const available = availableSlots();
    if (keyboardWord) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelPick();
      } else if (event.key === "Tab") {
        event.preventDefault();
        const current = Math.max(0, available.indexOf(index));
        const direction = event.shiftKey ? -1 : 1;
        focusSlot(available[(current + direction + available.length) % available.length]);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        placeWord(keyboardWord, index, true);
      }
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && answers[index]) {
      event.preventDefault();
      removeWord(index, true);
    }
  };
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || complete) return;
    const word = active.id.replace("bank-", "");
    const id = String(over.id);
    if (!id.startsWith("slot-")) return;
    const index = Number(id.split("-")[1]);
    placeWord(word, index);
  };

  const checkAnswers = () => {
    if (complete) return;
    if (answers.some((answer) => !answer)) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }
    const correct = [];
    const wrong = [];
    answers.forEach((answer, index) => {
      if (answer === DATA[index].correct) correct.push(index);
      else wrong.push(index);
    });
    setLockedInputs((previous) => [...new Set([...previous, ...correct])]);
    setAudioReadyInputs((previous) => [...new Set([...previous, ...correct])]);
    setWrongInputs(wrong);
    setShowingAnswer(false);

    const correctCount = correct.length;
    const color = correctCount === DATA.length ? "green" : correctCount === 0 ? "red" : "orange";
    const scoreMessage = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${correctCount} / ${DATA.length}</span></div>`;
    if (correctCount === DATA.length) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const showCorrectAnswers = () => {
    setAnswers(DATA.map((item) => item.correct));
    setWrongInputs([]);
    setLockedInputs(DATA.map((_, index) => index));
    setAudioReadyInputs([]);
    setShowingAnswer(true);
    setKeyboardWord(null);
    stopAudio();
  };

  const reset = () => {
    setAnswers(Array(DATA.length).fill(null));
    setWrongInputs([]);
    setLockedInputs([]);
    setAudioReadyInputs([]);
    setShowingAnswer(false);
    setKeyboardWord(null);
    setFocusedSlot(null);
    stopAudio();
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={({ active }) => setActiveId(active.id)} onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "30px" }}>
        <div className="div-forall" style={{ gap: "50px" }}>
          <ExerciseHeader sectionLetter="B" title="Look and write." subTitle="Use the numbered plate to drag bread, chicken, and fruit into the correct lines." />
          <div style={{ display: "flex", gap: "10px", padding: "10px", width: "100%", border: "2px dashed #ccc", borderRadius: "10px", alignItems: "center", justifyContent: "center" }}>
            {DATA.map((item) => <BankChip key={item.correct} word={item.correct} isUsed={usedWords.has(item.correct)} complete={complete || showingAnswer} registerRef={(node) => bankRefs.current.set(item.correct, node)} onPlay={() => playAudio(`bank-${item.correct}`, item.audio)} onPick={() => pickWord(item.correct)} playing={activeAudioKey === `bank-${item.correct}`} />)}
          </div>
          <div className="content-unit5-p5-q3 w-full">
            <div className="group-input-unit5-p5-q3">
              {DATA.map((item, index) => (
                <div key={item.correct} className={`question-row unit10-audio-control${audioReadyInputs.includes(index) ? " unit10-completed-audio" : ""}`} role={audioReadyInputs.includes(index) ? "button" : undefined} tabIndex={audioReadyInputs.includes(index) ? 0 : undefined} aria-label={audioReadyInputs.includes(index) ? `Play audio: ${item.correct}` : undefined} onClick={audioReadyInputs.includes(index) ? () => playAudio(`correct-${index}`, item.audio) : undefined} onKeyDown={audioReadyInputs.includes(index) ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); playAudio(`correct-${index}`, item.audio); } } : undefined} style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px" }}>
                  {activeAudioKey === `correct-${index}` && <Unit10PlayingAudioIcon />}
                  <span className="q-number" style={{ color: "#0d47a1", fontWeight: "700", fontSize: "20px" }}>{index + 1}.</span>
                  <DropSlot index={index} answer={answers[index]} isWrong={wrongInputs.includes(index)} locked={lockedInputs.includes(index)} previewWord={keyboardWord && focusedSlot === index ? keyboardWord : null} keyboardActive={Boolean(keyboardWord)} registerRef={(node) => slotRefs.current.set(index, node)} onFocus={() => setFocusedSlot(index)} onKeyDown={(event) => handleSlotKeyDown(event, index)} onRemove={() => removeWord(index)} />
                </div>
              ))}
            </div>
            <img src={plate} className="shape-img-unit5-p5-q3" alt="A table with chicken labeled 1, bread labeled 2, and fruit labeled 3." style={{ height: "200px", width: "auto" }} />
          </div>
        </div>
        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>Start Again ↻</button>
          <button className="show-answer-btn swal-continue" onClick={showCorrectAnswers}>Show Answer</button>
          <button ref={checkButtonRef} className="check-button2" onClick={checkAnswers}>Check Answers ✓</button>
        </div>
      </div>
      <DragOverlay>{activeWord ? <span style={{ padding: "7px 14px", border: "2px solid #2c5287", borderRadius: "8px", background: "white", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", cursor: "grabbing", color: "#2c5287" }}>{activeWord}</span> : null}</DragOverlay>
    </DndContext>
  );
};

export default Unit10_Page5_Q3;
