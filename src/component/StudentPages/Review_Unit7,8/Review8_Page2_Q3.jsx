import React, { useEffect, useRef, useState } from "react";

import { FaVolumeUp } from "react-icons/fa";

import bat from "../../../assets/unit8/imgs/U8P73EXEF-01.svg";
import cap from "../../../assets/unit8/imgs/U8P73EXEF-02.svg";
import ant from "../../../assets/unit8/imgs/U8P73EXEF-03.svg";
import img3 from "../../../assets/unit8/imgs/U8P73EXEF-04.svg";

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

import "./Review8_Page2_Q3.css";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   AUDIO
===================================================== */

import sockAudio from "../../../assets/unit8/sound/Page 73 - F/Sock.mp3";
import sunAudio from "../../../assets/unit8/sound/Page 73 - F/sun.mp3";
import zebraAudio from "../../../assets/unit8/sound/Page 73 - F/zebra.mp3";
import zipperAudio from "../../../assets/unit8/sound/Page 73 - F/zipper.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: bat,
    alt: "A bright yellow sun.",
    correct: "sun",
    audio: sunAudio,
  },
  {
    img: cap,
    alt: "A light blue sock.",
    correct: "sock",
    audio: sockAudio,
  },
  {
    img: ant,
    alt: "A black-and-white zebra.",
    correct: "zebra",
    audio: zebraAudio,
  },
  {
    img: img3,
    alt: "A close-up illustration of a zipper.",
    correct: "zipper",
    audio: zipperAudio,
  },
];

/* =====================================================
   DRAGGABLE WORD
===================================================== */

function DraggableWord({
  item,
  isUsed,
  disabled,

  keyboardPickedWord,
  onKeyboardPick,

  registerRef,

  playingKey,
  onPlayAudio,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${item.correct}`,
    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const isKeyboardPicked = keyboardPickedWord === item.correct;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(item.correct, node);
    }
  };

  const handleKeyDown = (e) => {
    if (unavailable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onPlayAudio(`bank-${item.correct}`, item.audio);

      onKeyboardPick(item.correct);
    }
  };

  return (
    <span
      ref={setRefs}
      {...(!unavailable
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={unavailable ? -1 : 0}
      aria-disabled={unavailable}
      aria-pressed={isKeyboardPicked}
      aria-label={
        isKeyboardPicked
          ? `${item.correct} selected. Choose a blank and press Enter or Space.`
          : `${item.correct}. Press Enter or Space to hear and select.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          صوت فقط
        */

        onPlayAudio(`bank-${item.correct}`, item.audio);
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: isUsed ? "#e0e0e0" : "white",
        fontWeight: "bold",

        cursor: unavailable ? "not-allowed" : isDragging ? "grabbing" : "grab",

        touchAction: "none",

        opacity: isUsed ? 0.4 : isDragging ? 0.35 : 1,

        color: isUsed ? "#999" : "",

        userSelect: "none",

        transition: "opacity 0.2s, background 0.2s",

        position: "relative",
      }}
    >
      {item.correct}

      {playingKey === `bank-${item.correct}` && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-review8-p2-q3" />
      )}
    </span>
  );
}

/* =====================================================
   DROP SLOT
===================================================== */

function DroppableSlot({
  index,
  answer,

  isWrong,
  isLocked,

  keyboardPickedWord,
  keyboardFocusIndex,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,

  onSlotFocus,
  onRemove,

  registerRef,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${index}`,
    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedWord) && keyboardFocusIndex === index && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(index, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (keyboardPickedWord && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(index, e.shiftKey);

      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      if (keyboardPickedWord) {
        onKeyboardPlace(index);
        return;
      }

      /*
        Filled editable slot:
        رجع الكلمة للبنك
      */

      if (answer) {
        onRemove(index);
      }

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (keyboardPickedWord && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div
      className="input-wrapper-review8-p2-q3"
      style={{
        position: "relative",
      }}
    >
      <div
        ref={setRefs}
        role="button"
        tabIndex={isLocked ? -1 : keyboardPickedWord ? 0 : answer ? 0 : -1}
        aria-disabled={isLocked}
        aria-label={
          isLocked
            ? `${answer}. Correct and locked.`
            : isKeyboardTarget
              ? `Blank ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}. Use Tab or Shift plus Tab to move between blanks.`
              : answer
                ? `${answer}. Press Enter or Space to return this word to the bank.`
                : `Empty blank ${index + 1}. Select a word first.`
        }
        onFocus={() => {
          if (keyboardPickedWord && !isLocked) {
            onSlotFocus(index);
          }
        }}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (isLocked) return;

          e.stopPropagation();

          if (answer && !keyboardPickedWord) {
            onRemove(index);
          }
        }}
        className={`
          q-input-review8-p2-q3

          ${isOver ? "drag-over-cell" : ""}

          ${isKeyboardTarget ? "keyboard-drop-preview-review8-p2-q3" : ""}
        `}
        style={{
          position: "relative",
        }}
      >
        {answer && !isKeyboardTarget && (
          <span className="drop-real-value-review8-p2-q3">{answer}</span>
        )}

        {isKeyboardTarget && keyboardPickedWord && (
          <span className="drop-preview-value-review8-p2-q3">
            {keyboardPickedWord}
          </span>
        )}
      </div>

      {isWrong && !isLocked && (
        <span className="error-mark-input-review8-p1-q2" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
}

/* =====================================================
   BANK
===================================================== */

function DroppableBank({ children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "bank",
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

        alignItems: "center",
        width: "100%",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review8_Page2_Q3 = () => {
  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  /*
    null | correct | wrong
  */
  const [results, setResults] = useState(Array(items.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD DRAG
  ===================================================== */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  /* =====================================================
     SENSORS
  ===================================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
  );

  /* =====================================================
     HELPERS
  ===================================================== */

  const usedWords = new Set(answers.filter(Boolean));

  const dragWord = activeId ? String(activeId).replace("word-", "") : null;

  const isSlotLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const allCorrect = items.every((_, index) => results[index] === "correct");

  const editableSlots = () =>
    items.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = audio.onended;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     REFS
  ===================================================== */

  const registerBankRef = (word, node) => {
    if (node) {
      bankRefs.current[word] = node;
    }
  };

  const registerSlotRef = (index, node) => {
    if (node) {
      slotRefs.current[index] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setKeyboardPickedWord(word);

    const available = editableSlots();

    if (!available.length) {
      return;
    }

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      slotRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT TAB
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableSlots();

    if (!available.length) {
      return;
    }

    const position = available.indexOf(currentIndex);

    let nextPosition;

    if (backwards) {
      nextPosition = position <= 0 ? available.length - 1 : position - 1;
    } else {
      nextPosition =
        position === -1 || position === available.length - 1 ? 0 : position + 1;
    }

    const nextIndex = available[nextPosition];

    setKeyboardFocusIndex(nextIndex);

    requestAnimationFrame(() => {
      slotRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardWord = (index) => {
    if (
      !keyboardPickedWord ||
      isSlotLocked(index) ||
      showAnswerMode ||
      allCorrect
    ) {
      return;
    }

    const picked = keyboardPickedWord;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((answer) => answer === picked);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      updated[index] = picked;

      nextAnswers = updated;

      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      if (!nextAnswers) return;

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const nextItem = items.find((item) => !usedAfter.has(item.correct));

      if (nextItem) {
        bankRefs.current[nextItem.correct]?.focus();
      }
    });
  };

  /* =====================================================
     ESCAPE
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedWord) {
      return;
    }

    const picked = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     REMOVE
  ===================================================== */

  const handleRemoveFromSlot = (index) => {
    if (showAnswerMode || isSlotLocked(index)) {
      return;
    }

    const word = answers[index];

    if (!word) return;

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    requestAnimationFrame(() => {
      bankRefs.current[word]?.focus();
    });
  };

  /* =====================================================
     MOUSE DRAG
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswerMode || allCorrect) {
      return;
    }

    const word = String(active.id).replace("word-", "");

    if (over.id === "bank") {
      const oldIndex = answers.findIndex((answer) => answer === word);

      if (oldIndex !== -1 && !isSlotLocked(oldIndex)) {
        handleRemoveFromSlot(oldIndex);
      }

      return;
    }

    const overId = String(over.id);

    if (!overId.startsWith("slot-")) {
      return;
    }

    const index = Number(overId.replace("slot-", ""));

    if (isSlotLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((answer) => answer === word);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      updated[index] = word;

      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    const hasEmpty = items.some(
      (_, index) => results[index] !== "correct" && !answers[index],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    items.forEach((item, index) => {
      if (results[index] === "correct") {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (answers[index] === item.correct) {
        nextResults[index] = "correct";

        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers(items.map((item) => item.correct));

    setResults(items.map(() => "correct"));

    setShowAnswerMode(true);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(items.length).fill(null));

    setResults(Array(items.length).fill(null));

    setShowAnswerMode(false);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RENDER
  ===================================================== */

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
        <div
          className="div-forall"
          style={{
            gap: "60px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="F"
            title="Look and write."
            subTitle="Drag sun, sock, zebra, and zipper to the correct pictures."
          />

          {/* WORD BANK */}

          <DroppableBank>
            {items.map((item) => (
              <DraggableWord
                key={item.correct}
                item={item}
                isUsed={usedWords.has(item.correct)}
                disabled={showAnswerMode || allCorrect}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                registerRef={registerBankRef}
                playingKey={playingKey}
                onPlayAudio={playAudio}
              />
            ))}
          </DroppableBank>

          {/* QUESTIONS */}

          <div
            className="row-content10-unit3-page6-q1 w-full"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {items.map((item, index) => (
              <div className="row2-review8-p1-q2" key={index}>
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
                  src={item.img}
                  alt={item.alt}
                  className="q-img-unit3-page6-q1"
                />

                <DroppableSlot
                  index={index}
                  answer={answers[index]}
                  isWrong={results[index] === "wrong"}
                  isLocked={isSlotLocked(index)}
                  keyboardPickedWord={keyboardPickedWord}
                  keyboardFocusIndex={keyboardFocusIndex}
                  onKeyboardPlace={placeKeyboardWord}
                  onKeyboardCancel={cancelKeyboardPick}
                  onMoveKeyboardFocus={moveKeyboardFocus}
                  onSlotFocus={setKeyboardFocusIndex}
                  onRemove={handleRemoveFromSlot}
                  registerRef={registerSlotRef}
                />
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}

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

      {/* DRAG OVERLAY */}

      <DragOverlay>
        {dragWord && (
          <span className="mouse-drag-overlay-review8-p2-q3">{dragWord}</span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Review8_Page2_Q3;
