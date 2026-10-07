import React, { useRef, useState } from "react";

import deer from "../../../assets/unit6/imgs/U6P54EXEC-01.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page1_Q3.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import cantFlyKiteAudio from "../../../assets/unit6/sounds/Page 54 - C/He can't fly a kite.mp3";
import climbTreeAudio from "../../../assets/unit6/sounds/Page 54 - C/It can climb a tree.mp3";
import rideBikeAudio from "../../../assets/unit6/sounds/Page 54 - C/She can ride a bike.mp3";

/* =====================================================
   DATA
===================================================== */

const DATA = [
  {
    correct: "She can ride a bike",
    audio: rideBikeAudio,
  },
  {
    correct: "It can climb a tree",
    audio: climbTreeAudio,
  },
  {
    correct: "He can't fly a kite",
    audio: cantFlyKiteAudio,
  },
];

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  item,
  isUsed,
  disabled,
  keyboardPickedValue,
  onKeyboardPick,
  registerBankRef,
  playingValue,
  onPlayAudio,
}) => {
  const value = item.correct;

  const picked = keyboardPickedValue === value;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${value}`,
    disabled: disabled || isUsed,
  });

  const unavailable = disabled || isUsed;

  const handleKeyboardActivate = () => {
    if (unavailable) return;

    onPlayAudio(value, item.audio);

    onKeyboardPick(picked ? null : value);
  };

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        registerBankRef(value, el);
      }}
      {...(!unavailable
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={unavailable ? -1 : 0}
      aria-disabled={unavailable}
      aria-pressed={picked}
      aria-label={
        picked
          ? `${value} selected. Press Tab to move to an answer blank, then press Enter or Space to place it.`
          : `${value}. Press Enter or Space to hear and select this sentence.`
      }
      className={`bank-chip-review6-p1-q3 ${
        picked ? "keyboard-picked-review6-p1-q3" : ""
      }`}
      onClick={() => {
        /*
          Mouse click = audio.
          Drag remains available normally.
        */
        if (unavailable) return;

        onPlayAudio(value, item.audio);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          handleKeyboardActivate();
        }
      }}
      style={{
        padding: "2px 5px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isUsed ? "#e0e0e0" : picked ? "#dbeafe" : "white",

        fontWeight: "bold",

        cursor: unavailable ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isUsed ? 0.45 : isDragging ? 0.3 : 1,

        transition: "opacity 0.2s, background 0.2s",

        userSelect: "none",

        color: isUsed ? "#999" : "",

        position: "relative",
      }}
    >
      {value}

      {playingValue === value && (
        <FaVolumeUp
          size={14}
          aria-hidden="true"
          className="audio-icon-review6-p1-q3"
        />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  index,
  answer,
  isWrong,
  isLocked,

  showAnswer,
  checkCompleted,

  keyboardPickedValue,

  focusedSlot,
  setFocusedSlot,

  slotRefs,

  getAvailableSlots,

  onKeyboardPlace,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const slotId = `slot-${index}`;

  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    disabled: isLocked || showAnswer || checkCompleted,
  });

  /* =====================================================
     PICKED WORD → SLOT TARGET MODE
  ===================================================== */

  const keyboardActive =
    !!keyboardPickedValue && !isLocked && !showAnswer && !checkCompleted;

  /* =====================================================
     FILLED SLOT CAN ALWAYS BE EDITED
     قبل Check أو إذا كان غلط بعد Check
  ===================================================== */

  const canEditFilled =
    !!answer &&
    !keyboardPickedValue &&
    !isLocked &&
    !showAnswer &&
    !checkCompleted;

  const preview = keyboardActive && focusedSlot === index;

  const displayedValue = preview ? keyboardPickedValue : answer;

  const handleKeyDown = (e) => {
    /* =================================================
       FILLED SLOT → RETURN SENTENCE TO BANK
       شغال قبل وبعد Check طالما مش locked
    ================================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, answer);

      return;
    }

    if (!keyboardActive) return;

    /* =================================================
       TAB / SHIFT+TAB BETWEEN AVAILABLE SLOTS
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlots();

      if (!available.length) return;

      const currentIndex = available.indexOf(index);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextSlot = available[nextIndex];

      slotRefs.current[nextSlot]?.focus();

      return;
    }

    /* =================================================
       PLACE PICKED WORD
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardPlace(index);

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);
          slotRefs.current[index] = el;
        }}
        role="button"
        /* =================================================
           مهم:
           - filled editable slot → Tab
           - picked sentence → slots → Tab
           - correct locked → no Tab
        ================================================= */

        tabIndex={
          isLocked || showAnswer || checkCompleted
            ? -1
            : keyboardActive || canEditFilled
              ? 0
              : -1
        }
        aria-label={
          keyboardActive
            ? answer
              ? `Blank contains ${answer}. Press Enter or Space to replace it with ${keyboardPickedValue}.`
              : `Empty answer blank. Press Enter or Space to place ${keyboardPickedValue}.`
            : canEditFilled
              ? `Blank contains ${answer}. Press Enter or Space to return it to the sentence bank.`
              : answer
                ? `Blank contains ${answer}.`
                : "Empty answer blank."
        }
        className={`q-input-review6-p1-q3 ${isOver ? "drag-over-cell" : ""} ${
          preview ? "keyboard-preview-review6-p1-q3" : ""
        }`}
        onFocus={() => {
          if (keyboardActive) {
            setFocusedSlot(index);
          }
        }}
        onBlur={() => {
          setFocusedSlot(null);
        }}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (answer && !isLocked && !showAnswer && !checkCompleted) {
            onRemove(index);
          }
        }}
        style={{
          background: isOver ? "#e8f0fe" : "transparent",

          transition: "background 0.15s",

          cursor:
            answer && !isLocked && !showAnswer && !checkCompleted
              ? "pointer"
              : "default",

          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {displayedValue && (
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {displayedValue}
          </span>
        )}
      </div>

      {isWrong && (
        <span className="wrong-icon-review6-p1-q3" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review6_Page1_Q3 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState(Array(DATA.length).fill(null));

  const [wrongInputs, setWrongInputs] = useState([]);

  /*
    Progressive locking:
    only correct slots lock after Check
  */

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     DRAG
  ================================================= */

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    }),
  );

  /* =================================================
     KEYBOARD
  ================================================= */

  const [keyboardPickedValue, setKeyboardPickedValue] = useState(null);

  const [focusedSlot, setFocusedSlot] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingValue, setPlayingValue] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingValue(null);
  };

  const playAudio = (value, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingValue(value);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingValue(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingValue(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingValue(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const usedValues = new Set(answers.filter(Boolean));

  const activeValue = activeId ? String(activeId).replace("bank-", "") : null;

  const isSlotLocked = (index) => lockedSlots.includes(index);

  const getAvailableSlots = () =>
    DATA.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =================================================
     PLACE ANSWER
  ================================================= */

  const placeAnswer = (value, targetIndex) => {
    if (!value || showAnswer || checkCompleted || isSlotLocked(targetIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        sentence is unique:
        remove it from its old slot
      */

      const oldIndex = updated.findIndex((answer) => answer === value);

      if (oldIndex !== -1 && oldIndex !== targetIndex) {
        updated[oldIndex] = null;
      }

      /*
        replace target
      */

      updated[targetIndex] = value;

      return updated;
    });

    /*
      Clear X only from same slot
    */

    setWrongInputs((prev) => prev.filter((index) => index !== targetIndex));
  };

  /* =================================================
     DRAG
  ================================================= */

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);

    const value = String(active.id).replace("bank-", "");

    const item = DATA.find((entry) => entry.correct === value);

    if (item) {
      playAudio(value, item.audio);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const value = String(active.id).replace("bank-", "");

    const match = String(over.id).match(/^slot-(\d+)$/);

    if (!match) return;

    const targetIndex = Number(match[1]);

    placeAnswer(value, targetIndex);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  /* =================================================
     REMOVE FROM SLOT
  ================================================= */

  const handleRemove = (index) => {
    if (showAnswer || checkCompleted || isSlotLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    setWrongInputs((prev) => prev.filter((item) => item !== index));
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (value) => {
    if (!value || showAnswer || checkCompleted || usedValues.has(value)) {
      setKeyboardPickedValue(null);

      return;
    }

    setKeyboardPickedValue(value);

    setFocusedSlot(null);

    window.setTimeout(() => {
      const available = getAvailableSlots();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     KEYBOARD PLACE
  ================================================= */

  const handleKeyboardPlace = (targetIndex) => {
    if (
      !keyboardPickedValue ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(targetIndex)
    ) {
      return;
    }

    const value = keyboardPickedValue;

    placeAnswer(value, targetIndex);

    setKeyboardPickedValue(null);

    setFocusedSlot(null);

    /*
      Return focus to same bank sentence
    */

    window.setTimeout(() => {
      bankRefs.current[value]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG SLOT → BANK
  ================================================= */

  const handleKeyboardClearWrong = (index, value) => {
    if (!value) return;

    handleRemove(index);

    setKeyboardPickedValue(null);

    setFocusedSlot(null);

    window.setTimeout(() => {
      bankRefs.current[value]?.focus();
    }, 0);
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const handleCancelKeyboardPick = () => {
    const value = keyboardPickedValue;

    setKeyboardPickedValue(null);

    setFocusedSlot(null);

    if (value) {
      window.setTimeout(() => {
        bankRefs.current[value]?.focus();
      }, 0);
    }
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((answer) => !answer)) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all blanks before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];
    const correctNow = [];

    answers.forEach((answer, index) => {
      if (answer.toLowerCase() === DATA[index].correct.toLowerCase()) {
        correctCount++;

        correctNow.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      correct slots lock
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...correctNow])));

    /*
      wrong slots stay editable
    */

    setWrongInputs(wrong);

    setKeyboardPickedValue(null);

    setFocusedSlot(null);

    const total = DATA.length;

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
      setLockedSlots(DATA.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setAnswers(DATA.map((item) => item.correct));

    setWrongInputs([]);

    setLockedSlots(DATA.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedValue(null);

    setFocusedSlot(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(Array(DATA.length).fill(null));

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedValue(null);

    setFocusedSlot(null);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
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
            gap: "30px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="C"
            title="Look and write."
            subTitle="Use the numbered park picture to drag each sentence into the correct place."
          />

          {/* =================================================
              SENTENCE BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              width: "100%",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {DATA.map((item) => (
              <BankChip
                key={item.correct}
                item={item}
                isUsed={usedValues.has(item.correct)}
                disabled={showAnswer || checkCompleted}
                keyboardPickedValue={keyboardPickedValue}
                onKeyboardPick={handleKeyboardPick}
                registerBankRef={(value, el) => {
                  bankRefs.current[value] = el;
                }}
                playingValue={playingValue}
                onPlayAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              IMAGE + SLOTS
          ================================================= */}

          <div className="content-unit5-p5-q3 w-full">
            <img
              src={deer}
              className="shape-img-review6-p1-q3"
              alt="Park scene with a girl riding a bicycle, an animal climbing a tree, and a boy trying to fly a kite. The actions are labeled with numbers 1, 2, and 3."
            />

            <div className="group-input-unit5-p5-q3">
              {DATA.map((item, index) => (
                <div
                  className="question-row"
                  key={index}
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "10px",

                    margin: "20px",

                    width: "100%",
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

                  <DropSlot
                    index={index}
                    answer={answers[index]}
                    isWrong={wrongInputs.includes(index)}
                    isLocked={isSlotLocked(index)}
                    showAnswer={showAnswer}
                    checkCompleted={checkCompleted}
                    keyboardPickedValue={keyboardPickedValue}
                    focusedSlot={focusedSlot}
                    setFocusedSlot={setFocusedSlot}
                    slotRefs={slotRefs}
                    getAvailableSlots={getAvailableSlots}
                    onKeyboardPlace={handleKeyboardPlace}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onRemove={handleRemove}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
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
        {activeValue ? (
          <span
            style={{
              padding: "2px 5px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

              cursor: "grabbing",

              color: "#2c5287",
            }}
          >
            {activeValue}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review6_Page1_Q3;
