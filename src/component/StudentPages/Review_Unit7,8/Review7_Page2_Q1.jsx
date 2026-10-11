import React, { useEffect, useRef, useState } from "react";

import bat from "../../../assets/unit8/imgs/U8P71EXED-01.svg";
import cap from "../../../assets/unit8/imgs/U8P71EXED-02.svg";
import ant from "../../../assets/unit8/imgs/U8P71EXED-03.svg";

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

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review7_Page2_Q1.css";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   AUDIO
===================================================== */

import handAudio from "../../../assets/unit8/sound/Page 71 - D/hand.mp3";
import hatAudio from "../../../assets/unit8/sound/Page 71 - D/hat.mp3";
import windowAudio from "../../../assets/unit8/sound/Page 71 - D/window.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    img: bat,

    alt: "An arched window with glass panes and greenery visible outside.",

    correct: "w",
    correctInput: "window",

    audio: windowAudio,
  },

  {
    img: cap,

    alt: "A green hat decorated with yellow flowers.",

    correct: "h",
    correctInput: "hat",

    audio: hatAudio,
  },

  {
    img: ant,

    alt: "An open human hand with the palm facing forward.",

    correct: "h",
    correctInput: "hand",

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
    id: `word-${item.correctInput}`,

    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const isKeyboardPicked = keyboardPickedWord === item.correctInput;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(item.correctInput, node);
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

      onPlayAudio(`bank-${item.correctInput}`, item.audio);

      onKeyboardPick(item.correctInput);
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
          ? `${item.correctInput} selected. Choose a blank and press Enter or Space.`
          : `${item.correctInput}. Press Enter or Space to hear and select.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          صوت فقط.

          Mouse drag:
          بدون صوت.
        */

        onPlayAudio(`bank-${item.correctInput}`, item.audio);
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
      {item.correctInput}

      {playingKey === `bank-${item.correctInput}` && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-review7-p2-q1" />
      )}
    </span>
  );
}

/* =====================================================
   DROPPABLE SLOT
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
      className="input-wrapper"
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
            ? `${answer}. Correct answer. Locked.`
            : isKeyboardTarget
              ? `Blank ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}. Use Tab or Shift plus Tab to move between blanks.`
              : answer
                ? `${answer}. Press Enter or Space to return this word to the bank.`
                : `Empty blank ${index + 1}. Select a word from the word bank first.`
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
          write-input-unit4-page5-q1

          ${isOver ? "drag-over-cell" : ""}

          ${isKeyboardTarget ? "keyboard-drop-preview-review7-p2-q1" : ""}
        `}
        style={{
          position: "relative",
        }}
      >
        {/* REAL VALUE */}

        {answer && !isKeyboardTarget && (
          <span className="drop-real-value-review7-p2-q1">{answer}</span>
        )}

        {/* KEYBOARD PREVIEW */}

        {isKeyboardTarget && keyboardPickedWord && (
          <span className="drop-preview-value-review7-p2-q1">
            {keyboardPickedWord}
          </span>
        )}
      </div>

      {/* WRONG X */}

      {isWrong && !isLocked && (
        <div className="wrong-mark" aria-hidden="true">
          ✕
        </div>
      )}
    </div>
  );
}

/* =====================================================
   WORD BANK
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

const Review7_Page2_Q1 = () => {
  /* =====================================================
     SELECT ANSWERS
  ===================================================== */

  const [selected, setSelected] = useState(["", "", ""]);

  /*
    null | correct | wrong
  */

  const [selectResults, setSelectResults] = useState([null, null, null]);

  /* =====================================================
     DRAG ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState(["", "", ""]);

  /*
    null | correct | wrong
  */

  const [dragResults, setDragResults] = useState([null, null, null]);

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const [showCorrect, setShowCorrect] = useState(false);

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

  const isSelectLocked = (index) =>
    showCorrect || selectResults[index] === "correct";

  const isDragLocked = (index) =>
    showCorrect || dragResults[index] === "correct";

  const allCorrect = items.every(
    (_, index) =>
      selectResults[index] === "correct" && dragResults[index] === "correct",
  );

  const editableSlots = () =>
    items.map((_, index) => index).filter((index) => !isDragLocked(index));

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
     SELECT H / W
  ===================================================== */

  const handleSelect = (value, index) => {
    if (isSelectLocked(index)) {
      return;
    }

    setSelected((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });

    /*
      تعديل نفس الـselect:
      شيل X عنه فقط.
    */

    setSelectResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     REGISTER REFS
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
     KEYBOARD PICK WORD
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showCorrect || allCorrect) {
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
     TAB / SHIFT TAB BETWEEN DROP SLOTS
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
      isDragLocked(index) ||
      showCorrect ||
      allCorrect
    ) {
      return;
    }

    const picked = keyboardPickedWord;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = [...prev];

      /*
          الكلمة تستخدم مرة واحدة.
        */

      const oldIndex = updated.findIndex((answer) => answer === picked);

      if (oldIndex !== -1 && oldIndex !== index && !isDragLocked(oldIndex)) {
        updated[oldIndex] = "";
      }

      updated[index] = picked;

      nextAnswers = updated;

      return updated;
    });

    /*
      تعديل نفس الـdrop:
      شيل X عنه فقط.
    */

    setDragResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    /*
      رجع لأول word غير مستخدمة.
    */

    requestAnimationFrame(() => {
      if (!nextAnswers) {
        return;
      }

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const nextItem = items.find((item) => !usedAfter.has(item.correctInput));

      if (nextItem) {
        bankRefs.current[nextItem.correctInput]?.focus();
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
    if (isDragLocked(index) || showCorrect) {
      return;
    }

    const word = answers[index];

    if (!word) return;

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    setDragResults((prev) => {
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
    if (showCorrect || allCorrect) {
      return;
    }

    setActiveId(active.id);
  };

  /* =====================================================
     MOUSE DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showCorrect || allCorrect) {
      return;
    }

    const word = String(active.id).replace("word-", "");

    /*
      رجع للبنك
    */

    if (over.id === "bank") {
      const oldIndex = answers.findIndex((answer) => answer === word);

      if (oldIndex !== -1 && !isDragLocked(oldIndex)) {
        handleRemoveFromSlot(oldIndex);
      }

      return;
    }

    const overId = String(over.id);

    if (!overId.startsWith("slot-")) {
      return;
    }

    const index = Number(overId.replace("slot-", ""));

    if (isDragLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((answer) => answer === word);

      if (oldIndex !== -1 && oldIndex !== index && !isDragLocked(oldIndex)) {
        updated[oldIndex] = "";
      }

      updated[index] = word;

      return updated;
    });

    /*
      تعديل نفس slot:
      شيل X عنه فقط.
    */

    setDragResults((prev) => {
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
    if (showCorrect || allCorrect) {
      return;
    }

    /* =================================================
       EMPTY SELECT
    ================================================= */

    const missingSelect = items.some(
      (_, index) =>
        selectResults[index] !== "correct" && selected[index] === "",
    );

    if (missingSelect) {
      ValidationAlert.info("Please choose h or w for all items!");

      return;
    }

    /* =================================================
       EMPTY DRAG
    ================================================= */

    const missingDrag = items.some(
      (_, index) => dragResults[index] !== "correct" && answers[index] === "",
    );

    if (missingDrag) {
      ValidationAlert.info("Please fill in all the writing boxes!");

      return;
    }

    const nextSelectResults = [...selectResults];

    const nextDragResults = [...dragResults];

    let score = 0;

    items.forEach((item, index) => {
      /* =============================================
           SELECT
        ============================================== */

      if (selectResults[index] === "correct") {
        nextSelectResults[index] = "correct";

        score++;
      } else if (selected[index] === item.correct) {
        nextSelectResults[index] = "correct";

        score++;
      } else {
        nextSelectResults[index] = "wrong";
      }

      /* =============================================
           DRAG
        ============================================== */

      if (dragResults[index] === "correct") {
        nextDragResults[index] = "correct";

        score++;
      } else if (
        answers[index].trim().toLowerCase() === item.correctInput.toLowerCase()
      ) {
        nextDragResults[index] = "correct";

        score++;
      } else {
        nextDragResults[index] = "wrong";
      }
    });

    setSelectResults(nextSelectResults);

    setDragResults(nextDragResults);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    const total = items.length * 2;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    setSelected(items.map((item) => item.correct));

    setAnswers(items.map((item) => item.correctInput));

    setSelectResults(items.map(() => "correct"));

    setDragResults(items.map(() => "correct"));

    setShowCorrect(true);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAll = () => {
    stopAudio();

    setSelected(["", "", ""]);

    setAnswers(["", "", ""]);

    setSelectResults([null, null, null]);

    setDragResults([null, null, null]);

    setShowCorrect(false);

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
        <div className="div-forall">
          <ExerciseHeaderReview
            sectionLetter="D"
            title={
              <>
                Does it begin with{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  h
                </span>{" "}
                or{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  w
                </span>
                ? Look, circle, and write.
              </>
            }
            subTitle="Look at each picture, choose h or w, then drag the matching word into the blank."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <DroppableBank>
            {items.map((item) => {
              const isUsed = usedWords.has(item.correctInput);

              return (
                <DraggableWord
                  key={item.correctInput}
                  item={item}
                  isUsed={isUsed}
                  disabled={showCorrect || allCorrect}
                  keyboardPickedWord={keyboardPickedWord}
                  onKeyboardPick={handleKeyboardPick}
                  registerRef={registerBankRef}
                  playingKey={playingKey}
                  onPlayAudio={playAudio}
                />
              );
            })}
          </DroppableBank>

          {/* =================================================
              QUESTION GRID
          ================================================= */}

          <div className="question-grid-review7-p2-q1 w-full">
            {items.map((item, i) => {
              const selectLocked = isSelectLocked(i);

              const dragLocked = isDragLocked(i);

              return (
                <div className="question-box-unit4-page5-q1" key={i}>
                  {/* IMAGE */}

                  <img
                    src={item.img}
                    className="q-img-unit4-page5-q1"
                    alt={item.alt}
                  />

                  {/* =============================================
                        H / W SELECT
                    ============================================== */}

                  <div className="choices-unit4-page5-q1">
                    {["h", "w"].map((letter) => {
                      const isSelected = selected[i] === letter;

                      const isWrong =
                        selectResults[i] === "wrong" && isSelected;

                      return (
                        <div className="circle-wrapper" key={letter}>
                          <div
                            role="button"
                            tabIndex={selectLocked ? -1 : 0}
                            aria-disabled={selectLocked}
                            aria-pressed={isSelected}
                            aria-label={`Letter ${letter}${
                              isSelected ? ". Selected." : ""
                            }`}
                            className={`
                                  circle-choice-unit4-page5-q1

                                  ${isSelected ? "active" : ""}
                                `}
                            onClick={() => {
                              if (selectLocked) {
                                return;
                              }

                              handleSelect(letter, i);
                            }}
                            onKeyDown={(e) => {
                              if (selectLocked) {
                                return;
                              }

                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                handleSelect(letter, i);
                              }
                            }}
                          >
                            {letter}
                          </div>

                          {isWrong && (
                            <div className="wrong-mark" aria-hidden="true">
                              ✕
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* =============================================
                        DRAG DROP
                    ============================================== */}

                  <DroppableSlot
                    index={i}
                    answer={answers[i]}
                    isWrong={dragResults[i] === "wrong"}
                    isLocked={dragLocked}
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
              );
            })}
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

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
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {dragWord && (
          <span className="mouse-drag-overlay-review7-p2-q1">{dragWord}</span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Review7_Page2_Q1;
