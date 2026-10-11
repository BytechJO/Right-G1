import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import deer from "../../../assets/unit8/imgs/U8P71EXEE.svg";
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

import "./Review7_Page2_Q2.css";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   AUDIO
===================================================== */

import handAudio from "../../../assets/unit8/sound/Page 71 - E/hand.mp3";
import hatAudio from "../../../assets/unit8/sound/Page 71 - E/hat.mp3";
import houseAudio from "../../../assets/unit8/sound/Page 71 - E/house.mp3";
import windowAudio from "../../../assets/unit8/sound/Page 71 - E/window.mp3";
import womanAudio from "../../../assets/unit8/sound/Page 71 - E/woman.mp3";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    correct: "house",
    audio: houseAudio,
  },
  {
    correct: "hat",
    audio: hatAudio,
  },
  {
    correct: "window",
    audio: windowAudio,
  },
  {
    correct: "woman",
    audio: womanAudio,
  },
  {
    correct: "hand",
    audio: handAudio,
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

      /*
        Keyboard:
        صوت + pick
      */

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
          ? `${item.correct} selected. Choose a numbered blank and press Enter or Space.`
          : `${item.correct}. Press Enter or Space to hear and select.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          صوت فقط.

          Drag:
          ما يشغل صوت.
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

        transition: "opacity 0.2s, background 0.2s",

        userSelect: "none",

        position: "relative",
      }}
    >
      {item.correct}

      {playingKey === `bank-${item.correct}` && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-review7-p2-q2" />
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
       TAB / SHIFT + TAB
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

      /*
        في كلمة picked:
        حط أو استبدل
      */

      if (keyboardPickedWord) {
        onKeyboardPlace(index);
        return;
      }

      /*
        filled editable slot:
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
      className="question-text-review7-p2-q2"
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
            ? `Number ${index + 1}. ${answer}. Correct and locked.`
            : isKeyboardTarget
              ? `Number ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}. Use Tab or Shift plus Tab to move between blanks.`
              : answer
                ? `Number ${index + 1}. Current answer ${answer}. Press Enter or Space to return it to the word bank.`
                : `Number ${index + 1}. Empty. Select a word from the word bank first.`
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
          q-input-review7-p2-q2

          ${isOver ? "drag-over-cell" : ""}

          ${isKeyboardTarget ? "keyboard-drop-preview-review7-p2-q2" : ""}
        `}
        style={{
          position: "relative",
        }}
      >
        {/* REAL VALUE */}

        {answer && !isKeyboardTarget && (
          <span className="drop-real-value-review7-p2-q2">{answer}</span>
        )}

        {/* KEYBOARD PREVIEW */}

        {isKeyboardTarget && keyboardPickedWord && (
          <span className="drop-preview-value-review7-p2-q2">
            {keyboardPickedWord}
          </span>
        )}
      </div>

      {/* WRONG X */}

      {isWrong && !isLocked && (
        <span className="wrong-icon-review6-p1-q3" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
}

/* =====================================================
   DROPPABLE BANK
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

        width: "100%",

        border: `2px dashed ${isOver ? "#2c5287" : "#ccc"}`,

        borderRadius: "10px",

        alignItems: "center",

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

const Review7_Page2_Q2 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(null));

  /*
    null | correct | wrong
  */
  const [results, setResults] = useState(Array(data.length).fill(null));

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

  const allCorrect = data.every((_, index) => results[index] === "correct");

  const editableSlots = () =>
    data.map((_, index) => index).filter((index) => !isSlotLocked(index));

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

    const currentPosition = available.indexOf(currentIndex);

    let nextPosition;

    if (backwards) {
      nextPosition =
        currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
    } else {
      nextPosition =
        currentPosition === -1 || currentPosition === available.length - 1
          ? 0
          : currentPosition + 1;
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

      /*
        الكلمة الواحدة تستخدم مرة واحدة.
      */

      const oldIndex = updated.findIndex((answer) => answer === picked);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      /*
        replace الموجود بالخانة
      */

      updated[index] = picked;

      nextAnswers = updated;

      return updated;
    });

    /*
      تعديل نفس السؤال الغلط:
      شيل X عنه فقط.
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    /*
      focus لأول كلمة غير مستخدمة
    */

    requestAnimationFrame(() => {
      if (!nextAnswers) {
        return;
      }

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const nextItem = data.find((item) => !usedAfter.has(item.correct));

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
     REMOVE FROM SLOT
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

    /*
        شيل wrong state لنفس الخانة فقط.
      */

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
     MOUSE DRAG START
     بدون صوت
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setActiveId(active.id);
  };

  /* =====================================================
     MOUSE DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswerMode || allCorrect) {
      return;
    }

    const word = String(active.id).replace("word-", "");

    /* =================================================
       رجع للبنك
    ================================================= */

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

    /*
      تعديل نفس الخانة:
      شيل X عنها فقط.
    */

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

    const hasEmpty = data.some(
      (_, index) => results[index] !== "correct" && !answers[index],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    data.forEach((item, index) => {
      /*
          الصحيح من Check سابق يظل locked
        */

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

    const total = data.length;

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

  const showCorrectAnswers = () => {
    stopAudio();

    setAnswers(data.map((item) => item.correct));

    setResults(data.map(() => "correct"));

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

    setAnswers(Array(data.length).fill(null));

    setResults(Array(data.length).fill(null));

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
            gap: "40px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="E"
            title="Look and write."
            subTitle="Drag house, hat, window, woman, and hand to the matching numbers."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <DroppableBank>
            {data.map((item) => (
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

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="content-review7-p2-q2">
            {/* LEFT IMAGE */}

            {/* RIGHT ANSWERS */}

            <div className="group-input-unit5-p5-q3">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="question-row"
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "10px",

                    margin: "10px",
                  }}
                >
                  <span
                    className="q-number"
                    style={{
                      color: "#0d47a1",

                      fontWeight: "700",

                      fontSize: "20px",
                    }}
                  >
                    {index + 1}.
                  </span>

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
            <img
              src={deer}
              className="shape-img-unit5-p5-q3"
              alt="A house scene with five numbered labels: number 1 points to the house, number 2 points to a hat, number 3 points to a window, number 4 points to a woman standing in the doorway, and number 5 points to a hand."
              style={{
                height: "240px",
                width: "auto",
              }}
            />
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={showCorrectAnswers}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
          </button>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {dragWord && (
          <span className="mouse-drag-overlay-review7-p2-q2">{dragWord}</span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Review7_Page2_Q2;
