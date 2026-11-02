/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import bat from "../../../assets/unit9/imgs/U9P81EXED-01.svg";
import cap from "../../../assets/unit9/imgs/U9P81EXED-02.svg";
import ant from "../../../assets/unit9/imgs/U9P81EXED-03.svg";
import img4 from "../../../assets/unit9/imgs/U9P81EXED-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  pointerWithin,
} from "@dnd-kit/core";
import "./Unit9_Page6_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";
import horsesAudio from "../../../assets/unit9/sound/Page 81 - D/horses.mp3";
import catsAudio from "../../../assets/unit9/sound/Page 81 - D/cats.mp3";
import goatsAudio from "../../../assets/unit9/sound/Page 81 - D/goats.mp3";
import heLikesChickensAudio from "../../../assets/unit9/sound/Page 81 - D/He likes chickens.mp3";
import iLikeAudio from "../../../assets/unit9/sound/Page 81 - D/I like.mp3";
import heLikesAudio from "../../../assets/unit9/sound/Page 81 - D/He likes.mp3";
import sheLikesAudio from "../../../assets/unit9/sound/Page 81 - D/She likes.mp3";

// ── Draggable word chip ───────────────────────────────────────────────────────
function DraggableWord({
  word,
  disabled,
  isFaded,
  isSelected,
  playing,
  onPlayAudio,
  onKeyboardPick,
  registerRef,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,
    disabled,
  });

  return (
    <span
      ref={(node) => {
        setNodeRef(node);
        registerRef(word, node);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`${word}. Press Enter or Space to hear it${disabled ? "." : " and select it."}`}
      onClick={() => onPlayAudio(word)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPlayAudio(word);
          if (!disabled) onKeyboardPick(word);
        }
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: "white",
        fontWeight: "bold",
        cursor: disabled ? "pointer" : "grab",
        touchAction: "none",
        opacity: isDragging || isFaded ? 0.35 : disabled ? 0.4 : 1,
        pointerEvents: "auto",
        position: "relative",
      }}
    >
      {word}
      {playing && (
        <FaVolumeUp
          aria-hidden="true"
          style={{ position: "absolute", top: "-8px", right: "-8px" }}
        />
      )}
    </span>
  );
}

// ── Droppable slot ────────────────────────────────────────────────────────────
function DroppableSlot({
  slotId,
  index,
  answer,
  children,
  isDropDisabled,
  selectedWord,
  onPlace,
  onRemove,
  onCancel,
  onMove,
  onFocus,
  showPreview,
  registerRef,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
    disabled: isDropDisabled,
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        registerRef(index, node);
      }}
      role="button"
      tabIndex={isDropDisabled ? -1 : selectedWord || answer ? 0 : -1}
      aria-disabled={isDropDisabled}
      onFocus={onFocus}
      aria-label={
        isDropDisabled
          ? `Blank ${index + 1} is correct and locked.`
          : selectedWord
            ? `Blank ${index + 1}. Press Enter or Space to place ${selectedWord}.`
            : answer
              ? `Blank ${index + 1} contains ${answer}. Press Enter or Space to return it to the word bank.`
              : `Blank ${index + 1}. Select a word first.`
      }
      onKeyDown={(e) => {
        if (isDropDisabled) return;
        if (selectedWord && e.key === "Tab") {
          e.preventDefault();
          onMove(index, e.shiftKey);
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (selectedWord) onPlace(index);
          else if (answer) onRemove(index);
        } else if (selectedWord && e.key === "Escape") {
          e.preventDefault();
          onCancel();
        }
      }}
      className={`q-input-unit9-page6-q1 ${isOver ? "drag-over-cell" : ""}`}
      style={{ position: "relative" }}
    >
      {showPreview && (
        <span className="keyboard-drop-preview" aria-hidden="true">
          {selectedWord}
        </span>
      )}
      {children}
    </div>
  );
}

// ── Droppable bank ────────────────────────────────────────────────────────────
function DroppableBank({ children, isDropDisabled }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "bank",
    disabled: isDropDisabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        gap: "10px",
        padding: "10px",
        border: `2px dashed ${isOver ? "#2c5287" : "#ccc"}`,
        borderRadius: "10px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

// ── المكوّن الرئيسي ───────────────────────────────────────────────────────────
const Unit9_Page6_Q1 = () => {
  const correctAnswers = ["horses", "cats", "goats", "He likes chickens"];

  const wordAudios = {
    horses: horsesAudio,
    cats: catsAudio,
    goats: goatsAudio,
    "He likes chickens": heLikesChickensAudio,
  };

  const labelAudios = [iLikeAudio, heLikesAudio, sheLikesAudio, null];
  const sentenceAudios = [
    [iLikeAudio, horsesAudio],
    [heLikesAudio, catsAudio],
    [sheLikesAudio, goatsAudio],
    [heLikesChickensAudio],
  ];
  const completeSentences = [
    "I like horses.",
    "He likes cats.",
    "She likes goats.",
    "He likes chickens.",
  ];

  const rows = [
    {
      img: bat,
      label: "I like",
      alt: "A boy feeding horses at a stable.",
    },

    {
      img: cap,
      label: "He likes",
      alt: "A boy playing with cats outdoors.",
    },

    {
      img: ant,
      label: "She likes",
      alt: "A girl standing beside goats in a farm pen.",
    },

    {
      img: img4,
      label: null,
      alt: "A farmer standing with chickens outdoors.",
    },
  ];
  const [answers, setAnswers] = useState([null, null, null, null]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [lockedInputs, setLockedInputs] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [allCompleted, setAllCompleted] = useState(false);
  const [focusedSlotIndex, setFocusedSlotIndex] = useState(null);
  const wordRefs = useRef({});
  const slotRefs = useRef([]);
  const audioRef = useRef(null);
  const [playingKey, setPlayingKey] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingKey(null);
  };

  const playAudio = (key, source) => {
    stopAudio();
    const audio = new Audio(source);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setPlayingKey(null);
      }
    };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(finish);
  };

  const playAudioSequence = (key, sources) => {
    stopAudio();
    let index = 0;
    setPlayingKey(key);

    const playNext = () => {
      if (index >= sources.length) {
        audioRef.current = null;
        setPlayingKey(null);
        return;
      }
      const audio = new Audio(sources[index]);
      index += 1;
      audioRef.current = audio;
      audio.onended = playNext;
      audio.onerror = playNext;
      audio.play().catch(() => {
        if (audioRef.current === audio) playNext();
      });
    };

    playNext();
  };

  useEffect(
    () => () => {
      if (audioRef.current) audioRef.current.pause();
    },
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 8 },
    }),
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || showAnswer || allCompleted) return;
    if (over.id === "bank") return;

    const word = active.id.replace("word-", "");

    if (over.id.startsWith("slot-")) {
      const index = Number(over.id.split("-")[1]);
      if (lockedInputs.includes(index)) return;
      setAnswers((prev) => {
        const updated = [...prev];
        const oldIndex = updated.findIndex((a) => a === word);
        if (oldIndex !== -1) updated[oldIndex] = null;
        updated[index] = word;
        return updated;
      });
      setWrongInputs((prev) => prev.filter((item) => item !== index));
    }
  };

  // كبس على الكلمة داخل الـ slot → ترجع للبنك
  const handleRemoveFromSlot = (index) => {
    if (showAnswer || lockedInputs.includes(index)) return;
    const word = answers[index];
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
    setWrongInputs((prev) => prev.filter((item) => item !== index));
    if (word) requestAnimationFrame(() => wordRefs.current[word]?.focus());
  };

  const availableSlots = () =>
    rows
      .map((_, index) => index)
      .filter((index) => !lockedInputs.includes(index));

  const handleKeyboardPick = (word) => {
    if (showAnswer || allCompleted) return;
    setSelectedWord(word);
    const first = availableSlots()[0];
    if (first !== undefined)
      requestAnimationFrame(() => slotRefs.current[first]?.focus());
  };

  const placeSelectedWord = (index) => {
    if (!selectedWord || lockedInputs.includes(index)) return;
    const word = selectedWord;
    const futureAnswers = [...answers];
    const futureOldIndex = futureAnswers.findIndex((value) => value === word);
    if (futureOldIndex !== -1 && !lockedInputs.includes(futureOldIndex)) {
      futureAnswers[futureOldIndex] = null;
    }
    futureAnswers[index] = word;
    setAnswers((prev) => {
      const updated = [...prev];
      const oldIndex = updated.findIndex((value) => value === word);
      if (oldIndex !== -1 && !lockedInputs.includes(oldIndex))
        updated[oldIndex] = null;
      updated[index] = word;
      return updated;
    });
    setWrongInputs((prev) => prev.filter((item) => item !== index));
    setSelectedWord(null);
    setFocusedSlotIndex(null);
    const currentWordIndex = correctAnswers.indexOf(word);
    const orderedNextWords = [
      ...correctAnswers.slice(currentWordIndex + 1),
      ...correctAnswers.slice(0, currentWordIndex),
    ];
    const nextWord =
      orderedNextWords.find(
        (candidate) => !futureAnswers.includes(candidate),
      ) ||
      orderedNextWords[0] ||
      word;
    requestAnimationFrame(() => wordRefs.current[nextWord]?.focus());
  };

  const cancelSelection = () => {
    const word = selectedWord;
    setSelectedWord(null);
    setFocusedSlotIndex(null);
    requestAnimationFrame(() => wordRefs.current[word]?.focus());
  };

  const moveSlotFocus = (current, backwards) => {
    const slots = availableSlots();
    const position = slots.indexOf(current);
    const next = backwards
      ? slots[(position <= 0 ? slots.length : position) - 1]
      : slots[(position + 1) % slots.length];
    requestAnimationFrame(() => slotRefs.current[next]?.focus());
  };

  const checkAnswers = () => {
    if (showAnswer || allCompleted) return;

    if (answers.some((ans) => !ans)) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let correctCount = 0;
    let wrong = [];

    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        correctCount++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    const newlyLocked = answers
      .map((answer, index) => (answer === correctAnswers[index] ? index : null))
      .filter((index) => index !== null);
    setLockedInputs((prev) => [...new Set([...prev, ...newlyLocked])]);
    setSelectedWord(null);
    setFocusedSlotIndex(null);
    if (correctCount === correctAnswers.length) {
      setAllCompleted(true);
    }

    const total = correctAnswers.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    stopAudio();
    setAnswers([null, null, null, null]);
    setWrongInputs([]);
    setShowAnswer(false);
    setActiveId(null);
    setLockedInputs([]);
    setSelectedWord(null);
    setFocusedSlotIndex(null);
    setAllCompleted(false);
  };

  const handleShowAnswer = () => {
    stopAudio();
    setAnswers([...correctAnswers]);
    setWrongInputs([]);
    setShowAnswer(true);
    setLockedInputs(rows.map((_, index) => index));
    setSelectedWord(null);
    setFocusedSlotIndex(null);
    setAllCompleted(true);
  };

  const dragWord = activeId ? activeId.replace("word-", "") : null;
  const isRowAudioReady = (index) =>
    answers[index] === correctAnswers[index] &&
    (lockedInputs.includes(index) || showAnswer || allCompleted);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
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
            sectionLetter="D"
            title="Look, read, and write."
            subTitle="Use the pictures to drag horses, cats, goats, and He likes chickens into place."
          />

          {/* ── Word bank: كل الكلمات دايماً موجودة، المستخدمة disabled ── */}
          <DroppableBank isDropDisabled={showAnswer || allCompleted}>
            {correctAnswers.map((word) => {
              const isUsed = answers.includes(word);
              return (
                <DraggableWord
                  key={word}
                  word={word}
                  disabled={showAnswer || allCompleted || isUsed}
                  isFaded={activeId === `word-${word}`}
                  isSelected={selectedWord === word}
                  playing={playingKey === `word-${word}`}
                  onPlayAudio={(value) =>
                    playAudio(`word-${value}`, wordAudios[value])
                  }
                  onKeyboardPick={handleKeyboardPick}
                  registerRef={(value, node) => {
                    if (node) wordRefs.current[value] = node;
                  }}
                />
              );
            })}
          </DroppableBank>

          <div
            className="row-content10-unit9-page6-q1 w-full"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {rows.map((row, index) => (
              <div
                className={`row2-review8-p1-q2 ${
                  isRowAudioReady(index) ? "completed-audio-row" : ""
                }`}
                role={isRowAudioReady(index) ? "button" : undefined}
                tabIndex={isRowAudioReady(index) ? 0 : undefined}
                aria-label={
                  isRowAudioReady(index)
                    ? `Play: ${completeSentences[index]}`
                    : undefined
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (isRowAudioReady(index)) {
                    playAudioSequence(
                      `sentence-${index}`,
                      sentenceAudios[index],
                    );
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    (e.key === "Enter" || e.key === " ") &&
                    isRowAudioReady(index)
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                    playAudioSequence(
                      `sentence-${index}`,
                      sentenceAudios[index],
                    );
                  }
                }}
                style={{
                  width: "100%",
                  position: "relative",
                  cursor: isRowAudioReady(index) ? "pointer" : undefined,
                }}
                key={index}
              >
                {playingKey === `sentence-${index}` && (
                  <FaVolumeUp
                    aria-hidden="true"
                    style={{ position: "absolute", top: "4px", right: "4px" }}
                  />
                )}
                <div style={{ display: "flex" }}>
                  <span
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {index + 1}
                  </span>
                  <img
                    src={row.img}
                    alt={row.alt}
                    className="q-img-unit3-page6-q1"
                    style={{ height: "130px" }}
                  />
                </div>

                <div className="input-wrapper-unit9-page6-q1">
                  {row.label && (
                    <span
                      role={isRowAudioReady(index) ? undefined : "button"}
                      tabIndex={isRowAudioReady(index) ? -1 : 0}
                      aria-label={
                        isRowAudioReady(index)
                          ? undefined
                          : `Play: ${row.label}`
                      }
                      onClick={(e) => {
                        if (isRowAudioReady(index)) return;
                        e.stopPropagation();
                        playAudio(`label-${index}`, labelAudios[index]);
                      }}
                      onKeyDown={(e) => {
                        if (
                          !isRowAudioReady(index) &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          e.stopPropagation();
                          playAudio(`label-${index}`, labelAudios[index]);
                        }
                      }}
                      style={{
                        textAlign: "center",
                        fontSize: "20px",
                        alignSelf: "center",
                        whiteSpace: "nowrap",
                        width: "fit-content",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      {row.label}
                      {playingKey === `label-${index}` && (
                        <FaVolumeUp
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-12px",
                          }}
                        />
                      )}
                    </span>
                  )}
                  <DroppableSlot
                    slotId={`slot-${index}`}
                    index={index}
                    answer={answers[index]}
                    isDropDisabled={showAnswer || lockedInputs.includes(index)}
                    selectedWord={selectedWord}
                    onPlace={placeSelectedWord}
                    onRemove={handleRemoveFromSlot}
                    onCancel={cancelSelection}
                    onMove={moveSlotFocus}
                    onFocus={() => setFocusedSlotIndex(index)}
                    showPreview={
                      Boolean(selectedWord) && focusedSlotIndex === index
                    }
                    registerRef={(slotIndex, node) => {
                      if (node) slotRefs.current[slotIndex] = node;
                    }}
                  >
                    {answers[index] && (
                      <span
                        onClick={() => handleRemoveFromSlot(index)}
                        aria-hidden="true"
                        style={{ cursor: showAnswer ? "default" : "pointer" }}
                      >
                        {answers[index]}
                      </span>
                    )}
                  </DroppableSlot>

                  {wrongInputs.includes(index) && (
                    <span
                      className="error-mark-input-review8-p1-q2"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* ── Drag overlay ── */}
      <DragOverlay>
        {dragWord && (
          <span
            style={{
              padding: "7px 14px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "white",
              fontWeight: "bold",
              cursor: "grabbing",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {dragWord}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit9_Page6_Q1;
