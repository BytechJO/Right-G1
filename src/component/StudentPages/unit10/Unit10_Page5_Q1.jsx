import { useMemo, useRef, useState } from "react";
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
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import img1 from "../../../assets/unit10/imgs/U10P86EXEA1-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P86EXEA1-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P86EXEA1-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P86EXEA1-04.svg";
import bedAudio from "../../../assets/unit10/sound/Page 86 - A 1/bed.mp3";
import eggAudio from "../../../assets/unit10/sound/Page 86 - A 1/egg.mp3";
import henAudio from "../../../assets/unit10/sound/Page 86 - A 1/hen.mp3";
import jetAudio from "../../../assets/unit10/sound/Page 86 - A 1/jet.mp3";
import useUnit10Audio from "./useUnit10Audio";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import "./Unit10_Page5_Q1.css";

const PAIRS = [
  { id: "pair-1", letter: "jet", img: img1, alt: "A passenger jet.", audio: jetAudio },
  { id: "pair-2", letter: "egg", img: img2, alt: "A white egg.", audio: eggAudio },
  { id: "pair-3", letter: "bed", img: img3, alt: "A bed with a blue sheet and a purple blanket.", audio: bedAudio },
  { id: "pair-4", letter: "hen", img: img4, alt: "A brown hen.", audio: henAudio },
];

const EMPTY_DROPS = { "drop-1": null, "drop-2": null, "drop-3": null, "drop-4": null };
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const BankChip = ({ word, isUsed, allComplete, onPlay, onKeyboardPick, playing, registerRef }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${word}`,
    disabled: isUsed || allComplete,
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        registerRef(node);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-label={`${isUsed ? "Play" : "Pick"} ${word}`}
      className={`letter-box unit10-audio-control${isDragging ? " dragging" : ""}`}
      onClick={onPlay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPlay();
          if (!isUsed && !allComplete) onKeyboardPick();
        }
      }}
      style={{
        background: isUsed ? "#e0e0e0" : "white",
        cursor: isUsed || allComplete ? "default" : "grab",
        opacity: isUsed ? 0.45 : isDragging ? 0.3 : 1,
        transition: "opacity 0.2s, background 0.2s",
        userSelect: "none",
        touchAction: "none",
        color: isUsed ? "#999" : undefined,
      }}
    >
      {playing && <Unit10PlayingAudioIcon />}
      {word}
    </div>
  );
};

const DropZone = ({
  id,
  answer,
  isWrong,
  locked,
  index,
  imgSrc,
  alt,
  previewWord,
  isKeyboardActive,
  registerRef,
  onFocus,
  onKeyDown,
  onRemove,
  audioReady,
  onPlay,
  playing,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });
  const displayedWord = previewWord || answer;

  return (
    <div
      className={`image-container-unit10-p5-q1 unit10-audio-control${audioReady ? " unit10-completed-audio" : ""}`}
      role={audioReady ? "button" : undefined}
      tabIndex={audioReady ? 0 : undefined}
      aria-label={audioReady ? `Play audio: ${answer}` : undefined}
      onClick={audioReady ? onPlay : undefined}
      onKeyDown={audioReady ? (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPlay();
        }
      } : undefined}
    >
      {playing && <Unit10PlayingAudioIcon />}
      <div style={{ display: "flex", gap: "10px" }}>
        <span style={{ color: "#1c3d7e", fontSize: "20px", fontWeight: "600" }}>{index + 1}</span>
        <img src={imgSrc} style={{ height: "150px" }} alt={alt} />
      </div>

      <div
        ref={(node) => {
          setNodeRef(node);
          registerRef(node);
        }}
        role={!locked ? "button" : undefined}
        tabIndex={!locked && (isKeyboardActive || answer) ? 0 : -1}
        aria-label={!locked ? (displayedWord ? `${displayedWord} in answer ${index + 1}. Press Enter or Space to ${previewWord ? "place" : "remove"}.` : `Empty answer ${index + 1}`) : undefined}
        className={["drop-box", isOver ? "is-over" : "", isWrong ? "wrong-drop" : ""].join(" ")}
        style={{
          background: isOver ? "#e8f0fe" : undefined,
          transition: "background 0.15s",
          cursor: answer && !locked ? "pointer" : "default",
        }}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (answer && !locked && !previewWord) {
            event.stopPropagation();
            onRemove();
          }
        }}
        title={answer && !locked ? "Click to remove" : ""}
      >
        {displayedWord ? (
          <div className={`dropped-letter${previewWord ? " unit10-keyboard-preview" : ""}`} style={{ color: isWrong && !previewWord ? "red" : undefined }}>
            {displayedWord}
          </div>
        ) : <span className="placeholder" />}
      </div>
    </div>
  );
};

const Unit10_Page5_Q1 = () => {
  const [dropped, setDropped] = useState(EMPTY_DROPS);
  const [wrongDrops, setWrongDrops] = useState([]);
  const [lockedDrops, setLockedDrops] = useState([]);
  const [correctAudioDrops, setCorrectAudioDrops] = useState([]);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [keyboardWord, setKeyboardWord] = useState(null);
  const [focusedDrop, setFocusedDrop] = useState(null);
  const bankRefs = useRef(new Map());
  const dropRefs = useRef(new Map());
  const checkButtonRef = useRef(null);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();

  const shuffledLetters = useMemo(() => shuffle(PAIRS.map((pair) => pair.letter)), []);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const usedWords = new Set(Object.values(dropped).filter(Boolean));
  const activeWord = activeId ? activeId.replace("bank-", "") : null;
  const allComplete = lockedDrops.length === PAIRS.length;

  const getAvailableDropIds = () => PAIRS.map((_, index) => `drop-${index + 1}`).filter((id) => !lockedDrops.includes(id));
  const focusDrop = (id) => {
    setFocusedDrop(id);
    requestAnimationFrame(() => dropRefs.current.get(id)?.focus());
  };
  const cancelKeyboardPick = () => {
    const originWord = keyboardWord;
    setKeyboardWord(null);
    setFocusedDrop(null);
    requestAnimationFrame(() => bankRefs.current.get(originWord)?.focus());
  };
  const pickWithKeyboard = (word) => {
    const available = getAvailableDropIds();
    if (!available.length || usedWords.has(word)) return;
    setKeyboardWord(word);
    focusDrop(available[0]);
  };
  const focusNextBankWord = (placedWord, nextDropped) => {
    const startIndex = shuffledLetters.indexOf(placedWord);
    const ordered = [...shuffledLetters.slice(startIndex + 1), ...shuffledLetters.slice(0, startIndex)];
    const nextWord = ordered.find((word) => !Object.values(nextDropped).includes(word));
    requestAnimationFrame(() => {
      if (nextWord) bankRefs.current.get(nextWord)?.focus();
      else checkButtonRef.current?.focus();
    });
  };
  const placeWord = (word, slotId, returnToNextBank = false) => {
    if (lockedDrops.includes(slotId)) return;
    let nextDropped;
    setDropped((previous) => {
      const updated = { ...previous };
      Object.keys(updated).forEach((key) => {
        if (updated[key] === word) updated[key] = null;
      });
      updated[slotId] = word;
      nextDropped = updated;
      return updated;
    });
    setWrongDrops((previous) => previous.filter((id) => id !== slotId));
    setKeyboardWord(null);
    setFocusedDrop(null);
    if (returnToNextBank) setTimeout(() => focusNextBankWord(word, nextDropped), 0);
  };
  const removeFromSlot = (slotId, returnFocus = false) => {
    if (lockedDrops.includes(slotId)) return;
    const removedWord = dropped[slotId];
    setDropped((previous) => ({ ...previous, [slotId]: null }));
    setWrongDrops((previous) => previous.filter((id) => id !== slotId));
    if (returnFocus && removedWord) requestAnimationFrame(() => bankRefs.current.get(removedWord)?.focus());
  };
  const handleDropKeyDown = (event, slotId) => {
    const available = getAvailableDropIds();
    if (keyboardWord) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelKeyboardPick();
      } else if (event.key === "Tab") {
        event.preventDefault();
        const currentIndex = Math.max(0, available.indexOf(slotId));
        const direction = event.shiftKey ? -1 : 1;
        focusDrop(available[(currentIndex + direction + available.length) % available.length]);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        placeWord(keyboardWord, slotId, true);
      }
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && dropped[slotId]) {
      event.preventDefault();
      removeFromSlot(slotId, true);
    }
  };
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || allComplete) return;
    const word = active.id.replace("bank-", "");
    const slotId = String(over.id);
    if (slotId.startsWith("drop-") && !lockedDrops.includes(slotId)) placeWord(word, slotId);
  };

  const checkAnswers = () => {
    if (allComplete) return;
    if (Object.values(dropped).some((value) => !value)) {
      ValidationAlert.info("Incomplete!", "Please fill all the drop zones before checking.");
      return;
    }
    const correctList = [];
    const wrongList = [];
    PAIRS.forEach((pair, index) => {
      const slotId = `drop-${index + 1}`;
      if (dropped[slotId] === pair.letter) correctList.push(slotId);
      else wrongList.push(slotId);
    });
    setLockedDrops((previous) => [...new Set([...previous, ...correctList])]);
    setCorrectAudioDrops((previous) => [...new Set([...previous, ...correctList])]);
    setWrongDrops(wrongList);
    setShowingAnswer(false);

    const correctCount = correctList.length;
    const total = PAIRS.length;
    const color = correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";
    const scoreMessage = `<div style="font-size:20px;margin-top:10px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${correctCount} / ${total}</span></div>`;
    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const handleShowAnswer = () => {
    const correct = {};
    PAIRS.forEach((pair, index) => { correct[`drop-${index + 1}`] = pair.letter; });
    setDropped(correct);
    setWrongDrops([]);
    setLockedDrops(Object.keys(correct));
    setCorrectAudioDrops([]);
    setShowingAnswer(true);
    setKeyboardWord(null);
    setFocusedDrop(null);
    stopAudio();
  };

  const reset = () => {
    setDropped(EMPTY_DROPS);
    setWrongDrops([]);
    setLockedDrops([]);
    setCorrectAudioDrops([]);
    setShowingAnswer(false);
    setKeyboardWord(null);
    setFocusedDrop(null);
    stopAudio();
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={({ active }) => setActiveId(active.id)} onDragEnd={handleDragEnd}>
      <div className="page8-wrapper" style={{ padding: "30px" }}>
        <div className="div-forall" style={{ gap: "50px" }}>
          <ExerciseHeader sectionLetter="A" questionNumber="1" title="Look, read, and write. Use the words below." subTitle="Drag bed, egg, hen, and jet to the matching pictures." />
          <div className="word-container">
            <div className="letters-section-horizontal">
              {shuffledLetters.map((word) => {
                const pair = PAIRS.find((item) => item.letter === word);
                return <BankChip key={word} word={word} isUsed={usedWords.has(word)} allComplete={allComplete || showingAnswer} registerRef={(node) => bankRefs.current.set(word, node)} onPlay={() => playAudio(`bank-${word}`, pair?.audio)} onKeyboardPick={() => pickWithKeyboard(word)} playing={activeAudioKey === `bank-${word}`} />;
              })}
            </div>
          </div>
          <div className="exercise-layout-vertical">
            <div className="image-section-horizontal">
              {PAIRS.map((pair, index) => {
                const slotId = `drop-${index + 1}`;
                return <DropZone key={slotId} id={slotId} index={index} imgSrc={pair.img} alt={pair.alt} answer={dropped[slotId]} isWrong={wrongDrops.includes(slotId)} locked={lockedDrops.includes(slotId)} previewWord={keyboardWord && focusedDrop === slotId ? keyboardWord : null} isKeyboardActive={Boolean(keyboardWord)} registerRef={(node) => dropRefs.current.set(slotId, node)} onFocus={() => setFocusedDrop(slotId)} onKeyDown={(event) => handleDropKeyDown(event, slotId)} onRemove={() => removeFromSlot(slotId)} audioReady={correctAudioDrops.includes(slotId)} onPlay={() => playAudio(`correct-${slotId}`, pair.audio)} playing={activeAudioKey === `correct-${slotId}`} />;
              })}
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">Start Again ↻</button>
          <button onClick={handleShowAnswer} className="show-answer-btn swal-continue">Show Answer</button>
          <button ref={checkButtonRef} onClick={checkAnswers} className="check-button2">Check Answer ✓</button>
        </div>
      </div>
      <DragOverlay>{activeWord ? <div className="letter-box dragging" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)", cursor: "grabbing" }}>{activeWord}</div> : null}</DragOverlay>
    </DndContext>
  );
};

export default Unit10_Page5_Q1;
