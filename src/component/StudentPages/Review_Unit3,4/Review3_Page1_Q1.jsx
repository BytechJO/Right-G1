import React, { useRef, useState } from "react";

import deer from "../../../assets/unit4/imgs/U4P34EXEA-01.svg";
import duck from "../../../assets/unit4/imgs/U4P34EXEA-02.svg";
import taxi from "../../../assets/unit4/imgs/U4P34EXEA-03.svg";
import tiger from "../../../assets/unit4/imgs/U4P34EXEA-04.svg";

import { FaVolumeUp } from "react-icons/fa";

import quietAudio from "../../../assets/unit4/Page 34 - A/Quiet!.mp3";
import closeBookAudio from "../../../assets/unit4/Page 34 - A/Close your book.mp3";
import makeLineAudio from "../../../assets/unit4/Page 34 - A/Make a line.mp3";
import listenAudio from "../../../assets/unit4/Page 34 - A/Listen!.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review3_Page1_Q1.css";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* ======================================================
   DRAGGABLE NUMBER
====================================================== */

const DraggableNum = ({
  id,
  num,
  disabled,
  isUsed,

  keyboardPickedNum,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked = keyboardPickedNum === num;

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[num] = el;
      }}
      {...(!isDisabled
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `Number ${num} selected. Press Tab to choose an answer box.`
          : `Number ${num}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (isDisabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(num);
        }
      }}
      className={`missing-input ${
        isPicked ? "keyboard-picked-num-review3-p1-q1" : ""
      }`}
      style={{
        padding: "2px 5px",

        border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : isUsed ? "#f0f2f5" : "white",

        fontWeight: "bold",

        cursor: isDisabled ? "default" : "grab",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

        color: isUsed ? "#9aa3b0" : "inherit",

        transition: "all 0.2s ease",

        userSelect: "none",

        touchAction: "none",
      }}
    >
      {num}
    </div>
  );
};

/* ======================================================
   DROP SLOT
====================================================== */

const DropSlot = ({
  index,
  value,

  isWrong,
  locked,

  showAnswer,
  checkCompleted,

  keyboardPickedNum,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,

  getAvailableSlotIndexes,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const id = `drop-${index}`;

  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedNum && !locked && !showAnswer && !checkCompleted;

  const canFixWrong =
    !!value &&
    isWrong &&
    !keyboardPickedNum &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === id;

  const displayValue = showPreview ? keyboardPickedNum : value;

  const handleKeyDown = (e) => {
    /* =========================================
       WRONG SLOT AFTER CHECK
    ========================================= */

    if (canFixWrong && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlotIndexes();

      if (!available.length) {
        return;
      }

      const currentPosition = available.indexOf(index);

      let nextPosition;

      if (e.shiftKey) {
        nextPosition =
          currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
      } else {
        nextPosition =
          currentPosition === -1 || currentPosition === available.length - 1
            ? 0
            : currentPosition + 1;
      }

      const nextIndex = available[nextPosition];

      slotRefs.current[nextIndex]?.focus();

      return;
    }

    /* =========================================
       ENTER / SPACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(index);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        slotRefs.current[index] = el;
      }}
      className={`number-input-review3-p1-q1 ${
        isOver && !locked ? "drag-over-cell" : ""
      } ${showPreview ? "keyboard-drop-preview-review3-p1-q1" : ""}`}
      role="button"
      tabIndex={
        locked || showAnswer || checkCompleted
          ? -1
          : keyboardDropActive || canFixWrong
            ? 0
            : -1
      }
      aria-label={
        keyboardDropActive
          ? value
            ? `Answer box ${index + 1}. Current number ${value}. Press Enter or Space to replace it with ${keyboardPickedNum}.`
            : `Answer box ${index + 1}. Press Enter or Space to place number ${keyboardPickedNum}.`
          : canFixWrong
            ? `Answer box ${index + 1}. Number ${value} is incorrect. Press Enter or Space to return it to the number bank.`
            : value
              ? `Answer box ${index + 1}. Number ${value}.`
              : `Empty answer box ${index + 1}.`
      }
      onFocus={() => {
        if (keyboardDropActive) {
          setFocusedSlotId(id);
        }
      }}
      onBlur={() => {
        setFocusedSlotId(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={
        value && !locked && !showAnswer && !checkCompleted
          ? onRemove
          : undefined
      }
      style={{
        background: isOver ? "#e3f2fd" : "white",

        position: "relative",

        cursor:
          value && !locked && !showAnswer && !checkCompleted
            ? "pointer"
            : "default",

        userSelect: "none",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",
      }}
    >
      {displayValue && (
        <span
          style={{
            display: "inline-flex",

            alignItems: "center",

            gap: "2px",
          }}
        >
          {displayValue}
        </span>
      )}

      {isWrong && (
        <div className="error-circle" aria-hidden="true">
          ✕
        </div>
      )}
    </div>
  );
};

/* ======================================================
   MAIN
====================================================== */

const Review3_Page1_Q1 = () => {
  const data = [
    {
      word: "Quiet!",
      src: deer,
      num: "3",
      audio: quietAudio,
      alt: "A teacher holding a finger to her lips while speaking to students.",
    },

    {
      word: "Close your book.",
      src: duck,
      num: "4",
      audio: closeBookAudio,
      alt: "A teacher giving a classroom instruction to students seated nearby.",
    },

    {
      word: "Make a line.",
      src: taxi,
      num: "1",
      audio: makeLineAudio,
      alt: "A teacher guiding several students who are standing in a line.",
    },

    {
      word: "Listen!",
      src: tiger,
      num: "2",
      audio: listenAudio,
      alt: "A teacher showing a book to a student at a desk.",
    },
  ];

  const numberBank = ["1", "2", "3", "4"];

  /* ======================================================
     ANSWERS
  ====================================================== */

  const [answers, setAnswers] = useState(Array(data.length).fill(null));

  const [wrongNumbers, setWrongNumbers] = useState(data.map(() => false));

  /* ======================================================
     PROGRESSIVE LOCK
  ====================================================== */

  const [lockedIndexes, setLockedIndexes] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* ======================================================
     DRAG
  ====================================================== */

  const [activeNum, setActiveNum] = useState(null);

  /* ======================================================
     KEYBOARD DRAG
  ====================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  const [keyboardPickedNum, setKeyboardPickedNum] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* ======================================================
     AUDIO
  ====================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingWord(null);
  };

  const playWordAudio = (word, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };
  };

  /* ======================================================
     HELPERS
  ====================================================== */

  const isLocked = (index) => lockedIndexes.includes(index);

  const usedNums = new Set(answers.filter(Boolean));

  const getAvailableSlotIndexes = () =>
    answers
      .map((_, index) => index)
      .filter((index) => !isLocked(index) && !showAnswer && !checkCompleted);

  const getFirstAvailableNumber = (answerArray) => {
    const used = new Set(answerArray.filter(Boolean));

    return numberBank.find((num) => !used.has(num));
  };

  /* ======================================================
     SENSORS
  ====================================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  /* ======================================================
     DRAG START
  ====================================================== */

  const onDragStart = ({ active }) => {
    setActiveNum(active.id.replace("num-", ""));
  };

  /* ======================================================
     DRAG END
  ====================================================== */

  const onDragEnd = ({ active, over }) => {
    setActiveNum(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("drop-")) {
      return;
    }

    const value = active.id.replace("num-", "");

    const index = Number(String(over.id).replace("drop-", ""));

    if (isLocked(index)) {
      return;
    }

    let oldIndex = -1;

    setAnswers((prev) => {
      const updated = [...prev];

      oldIndex = updated.findIndex((item) => item === value);

      if (oldIndex !== -1 && oldIndex !== index) {
        updated[oldIndex] = null;
      }

      updated[index] = value;

      return updated;
    });

    /*
      شيل X فقط عن الأماكن
      اللي تغيرت
    */

    setWrongNumbers((prev) =>
      prev.map((wrong, i) => (i === index || i === oldIndex ? false : wrong)),
    );
  };

  const onDragCancel = () => {
    setActiveNum(null);
  };

  /* ======================================================
     KEYBOARD PICK
  ====================================================== */

  const handleKeyboardPick = (num) => {
    if (showAnswer || checkCompleted || usedNums.has(num)) {
      return;
    }

    setKeyboardPickedNum(num);

    setFocusedSlotId(null);

    requestAnimationFrame(() => {
      const available = getAvailableSlotIndexes();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* ======================================================
     KEYBOARD DROP
  ====================================================== */

  const handleKeyboardDrop = (index) => {
    if (!keyboardPickedNum || showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    const num = keyboardPickedNum;

    const updated = [...answers];

    const oldIndex = updated.findIndex((item) => item === num);

    if (oldIndex !== -1 && oldIndex !== index && !isLocked(oldIndex)) {
      updated[oldIndex] = null;
    }

    updated[index] = num;

    setAnswers(updated);

    setWrongNumbers((prev) =>
      prev.map((wrong, i) => (i === index || i === oldIndex ? false : wrong)),
    );

    setKeyboardPickedNum(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      const firstAvailable = getFirstAvailableNumber(updated);

      if (firstAvailable) {
        bankRefs.current[firstAvailable]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     WRONG SLOT AFTER CHECK
  ====================================================== */

  const handleKeyboardClearWrong = (index, currentNum) => {
    if (showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = null;

    setAnswers(updated);

    setWrongNumbers((prev) =>
      prev.map((wrong, i) => (i === index ? false : wrong)),
    );

    setKeyboardPickedNum(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (currentNum && bankRefs.current[currentNum]) {
        bankRefs.current[currentNum]?.focus();

        return;
      }

      const firstAvailable = getFirstAvailableNumber(updated);

      if (firstAvailable) {
        bankRefs.current[firstAvailable]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     ESCAPE
  ====================================================== */

  const handleCancelKeyboardPick = () => {
    const num = keyboardPickedNum;

    setKeyboardPickedNum(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (num && bankRefs.current[num]) {
        bankRefs.current[num]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     MOUSE REMOVE
  ====================================================== */

  const removeAnswer = (index) => {
    if (showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    setWrongNumbers((prev) =>
      prev.map((wrong, i) => (i === index ? false : wrong)),
    );
  };

  /* ======================================================
     CHECK ANSWERS
  ====================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((value) => value === null)) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );

      return;
    }

    const newWrong = data.map((item, index) => answers[index] !== item.num);

    const newlyLocked = [];

    let correctCount = 0;

    answers.forEach((value, index) => {
      if (value === data[index].num) {
        correctCount++;

        newlyLocked.push(index);
      }
    });

    setLockedIndexes((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setWrongNumbers(newWrong);

    setKeyboardPickedNum(null);

    setFocusedSlotId(null);

    const total = data.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedIndexes(data.map((_, index) => index));

      setWrongNumbers(data.map(() => false));

      setCheckCompleted(true);

      ValidationAlert.success(message);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  /* ======================================================
     SHOW ANSWER
  ====================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers(data.map((item) => item.num));

    setWrongNumbers(data.map(() => false));

    setLockedIndexes(data.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedNum(null);

    setFocusedSlotId(null);
  };

  /* ======================================================
     RESET
  ====================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(data.length).fill(null));

    setWrongNumbers(data.map(() => false));

    setLockedIndexes([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveNum(null);

    setKeyboardPickedNum(null);

    setFocusedSlotId(null);
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
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
            gap: "60px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="A"
            title="Look and number."
            subTitle="Drag each number to the classroom-command picture it describes."
          />

          {/* =================================================
              NUMBER BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "30px",

              padding: "10px",

              width: "100%",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              justifyContent: "center",
            }}
          >
            {numberBank.map((num) => (
              <DraggableNum
                key={num}
                id={`num-${num}`}
                num={num}
                disabled={showAnswer || checkCompleted}
                isUsed={usedNums.has(num)}
                keyboardPickedNum={keyboardPickedNum}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              IMAGES + INPUTS + AUDIO
          ================================================= */}

          <div className="exercise-image-div-review3-p1-q1 w-full">
            {data.map((item, index) => {
              const locked = isLocked(index);

              const isPlaying = playingWord === item.word;

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",

                    flexDirection: "column",

                    alignItems: "center",

                    gap: "30px",
                  }}
                >
                  <img
                    src={item.src}
                    className="exercise-image-review3-p1-q1"
                    alt={item.alt}
                  />

                  <div className="flex gap-2 items-center">
                    <DropSlot
                      index={index}
                      value={answers[index]}
                      isWrong={wrongNumbers[index]}
                      locked={locked}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      keyboardPickedNum={keyboardPickedNum}
                      focusedSlotId={focusedSlotId}
                      setFocusedSlotId={setFocusedSlotId}
                      slotRefs={slotRefs}
                      getAvailableSlotIndexes={getAvailableSlotIndexes}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardClearWrong={handleKeyboardClearWrong}
                      onCancelKeyboardPick={handleCancelKeyboardPick}
                      onRemove={() => removeAnswer(index)}
                    />

                    {/* =========================================
                          AUDIO SENTENCE
                      ========================================= */}

                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Play audio for ${item.word}`}
                      onClick={() => playWordAudio(item.word, item.audio)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          e.stopPropagation();

                          playWordAudio(item.word, item.audio);
                        }
                      }}
                      className="sentence-audio-review3-p1-q1"
                      style={{
                        textAlign: "center",

                        fontSize: "18px",

                        position: "relative",

                        display: "inline-flex",

                        alignItems: "center",

                        cursor: "pointer",
                      }}
                    >
                      {item.word}

                      {isPlaying && (
                        <FaVolumeUp
                          size={16}
                          aria-hidden="true"
                          className="sentence-audio-icon-review3-p1-q1"
                        />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

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

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeNum ? (
          <div
            className="missing-input"
            style={{
              padding: "2px 5px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              boxShadow: "0 5px 15px rgba(0,0,0,.2)",

              minWidth: "36px",

              minHeight: "36px",
            }}
          >
            {activeNum}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review3_Page1_Q1;
