import React, { useRef, useState } from "react";

import deer from "../../../assets/unit6/imgs/U6P52EXEB-01.svg";
import duck from "../../../assets/unit6/imgs/U6P52EXEB-02.svg";
import taxi from "../../../assets/unit6/imgs/U6P52EXEB-03.svg";
import tiger from "../../../assets/unit6/imgs/U6P52EXEB-04.svg";

import chairAudio from "../../../assets/unit6/sounds/Page 52 - B/This is your chair..mp3";
import bookAudio from "../../../assets/unit6/sounds/Page 52 - B/This is my book..mp3";
import penAudio from "../../../assets/unit6/sounds/Page 52 - B/This is my pen..mp3";
import rulerAudio from "../../../assets/unit6/sounds/Page 52 - B/This is your ruler..mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review5_Page1_Q2.css";

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

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    word: "This is your chair.",
    src: deer,
    num: "3",
    audio: chairAudio,
    alt: "A boy holding a book.",
  },
  {
    word: "This is my book.",
    src: duck,
    num: "1",
    audio: bookAudio,
    alt: "A boy holding up a pen.",
  },
  {
    word: "This is my pen.",
    src: taxi,
    num: "2",
    audio: penAudio,
    alt: "A boy showing a seated girl an object.",
  },
  {
    word: "This is your ruler.",
    src: tiger,
    num: "4",
    audio: rulerAudio,
    alt: "A girl and a boy holding classroom objects.",
  },
];

const numbers = ["1", "2", "3", "4"];

/* =====================================================
   BANK NUMBER
===================================================== */

const BankNumber = ({
  value,
  isUsed,
  showAnswer,
  checkCompleted,
  keyboardPickedValue,
  onKeyboardPick,
  registerBankRef,
}) => {
  const disabled = isUsed || showAnswer || checkCompleted;

  const picked = keyboardPickedValue === value;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${value}`,
    disabled,
  });

  return (
    <span
      ref={(el) => {
        setNodeRef(el);
        registerBankRef(value, el);
      }}
      {...(!disabled
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={picked}
      aria-label={
        picked
          ? `Number ${value} selected. Press Tab to move to an answer area, then press Enter or Space to place it.`
          : `Number ${value}. Press Enter or Space to select it.`
      }
      className={`number-chip-review5-p1-q2 ${
        picked ? "keyboard-picked-review5-p1-q2" : ""
      }`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          if (disabled) return;

          onKeyboardPick(picked ? null : value);
        }
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        fontSize: "18px",
        background: isUsed ? "#e0e0e0" : picked ? "#dbeafe" : "white",
        fontWeight: "bold",
        cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",
        opacity: isUsed ? 0.45 : isDragging ? 0.3 : 1,
        transition: "opacity 0.2s, background 0.2s",
        userSelect: "none",
        color: isUsed ? "#999" : "",
      }}
    >
      {value}
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

  /* =================================================
     PICKED NUMBER → SLOT TARGET MODE
  ================================================= */

  const keyboardActive =
    !!keyboardPickedValue && !isLocked && !showAnswer && !checkCompleted;

  /* =================================================
     NEW DRAG PATTERN

     أي slot معبّى ولسا مش locked
     لازم يضل reachable بالـTab حتى قبل Check
  ================================================= */

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
       FILLED SLOT → RETURN NUMBER TO BANK
    ================================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, answer);

      return;
    }

    if (!keyboardActive) return;

    /* =================================================
       TAB / SHIFT TAB
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
       PLACE / REPLACE
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
      ref={(el) => {
        setNodeRef(el);
        slotRefs.current[index] = el;
      }}
      role="button"
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
            ? `Answer area contains number ${answer}. Press Enter or Space to replace it with number ${keyboardPickedValue}.`
            : `Empty answer area. Press Enter or Space to place number ${keyboardPickedValue}.`
          : canEditFilled
            ? `Answer area contains number ${answer}. Press Enter or Space to return it to the number bank.`
            : answer
              ? `Answer area contains number ${answer}.`
              : "Empty number answer area."
      }
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
      className={`missing-input-review5-p1-q2
        ${isOver ? "drag-over-cell" : ""}
        ${preview ? "keyboard-preview-review5-p1-q2" : ""}
      `}
      style={{
        position: "relative",

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

      {isWrong && (
        <div
          style={{
            position: "absolute",
            right: "-17px",
            top: "5%",
            transform: "translateY(-50%)",
            width: "22px",
            height: "22px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: "bold",
            border: "2px solid white",
          }}
          aria-hidden="true"
        >
          ✕
        </div>
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review5_Page1_Q2 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState(Array(data.length).fill(null));

  const [wrongNumbers, setWrongNumbers] = useState(data.map(() => false));

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

  const [playingIndex, setPlayingIndex] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingIndex(null);
  };

  const playSentenceAudio = (index) => {
    const src = data[index]?.audio;

    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingIndex(index);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const usedValues = new Set(answers.filter(Boolean));

  const activeValue = activeId ? String(activeId).replace("bank-", "") : null;

  const isSlotLocked = (index) => lockedSlots.includes(index);

  const getAvailableSlots = () =>
    data.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =================================================
     PLACE NUMBER
  ================================================= */

  const placeNumber = (value, targetIndex) => {
    if (!value || showAnswer || checkCompleted || isSlotLocked(targetIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        Number is unique.
        Remove it from old slot.
      */

      const oldIndex = updated.findIndex((answer) => answer === value);

      if (oldIndex !== -1 && oldIndex !== targetIndex) {
        updated[oldIndex] = null;
      }

      /*
        Replace target
      */

      updated[targetIndex] = value;

      return updated;
    });

    /*
      Clear X only same slot
    */

    setWrongNumbers((prev) => {
      const updated = [...prev];

      updated[targetIndex] = false;

      return updated;
    });
  };

  /* =================================================
     DRAG
  ================================================= */

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
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

    placeNumber(value, targetIndex);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  /* =================================================
     REMOVE
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

    setWrongNumbers((prev) => {
      const updated = [...prev];

      updated[index] = false;

      return updated;
    });
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

    placeNumber(value, targetIndex);

    setKeyboardPickedValue(null);

    setFocusedSlot(null);

    window.setTimeout(() => {
      bankRefs.current[value]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG SLOT → BANK
  ================================================= */

  const handleKeyboardClearWrong = (index, value) => {
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
     SHOW ANSWERS
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setAnswers(data.map((item) => item.num));

    setWrongNumbers(data.map(() => false));

    setLockedSlots(data.map((_, index) => index));

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

    setAnswers(Array(data.length).fill(null));

    setWrongNumbers(data.map(() => false));

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedValue(null);

    setFocusedSlot(null);
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((answer) => answer === null)) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );

      return;
    }

    let score = 0;

    const wrong = data.map(() => false);

    const correctSlots = [];

    answers.forEach((answer, index) => {
      const correct = answer === data[index].num;

      if (correct) {
        score++;

        correctSlots.push(index);
      } else {
        wrong[index] = true;
      }
    });

    /*
      Progressive locking
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...correctSlots])));

    /*
      Wrong stay editable
    */

    setWrongNumbers(wrong);

    setKeyboardPickedValue(null);

    setFocusedSlot(null);

    const totalPoints = data.length;

    const color =
      score === totalPoints ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${totalPoints}
        </span>
      </div>
    `;

    if (score === totalPoints) {
      setLockedSlots(data.map((_, index) => index));

      setWrongNumbers(data.map(() => false));

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
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
            sectionLetter="B"
            title="Look, read, and number the sentences."
            subTitle="Use the numbered pictures to complete each my or your sentence."
          />

          {/* =================================================
              NUMBER BANK
          ================================================= */}

          <div
            style={{
              display: "flex",
              gap: "40px",
              padding: "10px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {numbers.map((value) => (
              <BankNumber
                key={value}
                value={value}
                isUsed={usedValues.has(value)}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedValue={keyboardPickedValue}
                onKeyboardPick={handleKeyboardPick}
                registerBankRef={(value, el) => {
                  bankRefs.current[value] = el;
                }}
              />
            ))}
          </div>

          {/* =================================================
              IMAGES
          ================================================= */}

          <div className="exercise-image-div-review5-p1-q2 w-full">
            {data.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                }}
              >
                <span
                  style={{
                    color: "#2c5287",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  {index + 1}
                </span>

                <img
                  src={item.src}
                  alt={item.alt}
                  className="exercise-image-review5-p1-q2"
                />
              </div>
            ))}
          </div>

          {/* =================================================
              SENTENCES + SLOTS
          ================================================= */}

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="exercise-container-review5-p1-q2"
              style={{
                marginTop: "20px",
              }}
            >
              {data.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "22px",
                  }}
                >
                  {/* =====================================
                        SENTENCE AUDIO
                    ===================================== */}

                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio: ${item.word}`}
                    onClick={() => playSentenceAudio(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        playSentenceAudio(index);
                      }
                    }}
                    className="sentence-audio-review5-p1-q2"
                    style={{
                      width: "200px",
                      position: "relative",
                      cursor: "pointer",
                    }}
                  >
                    {item.word}

                    {playingIndex === index && (
                      <FaVolumeUp
                        size={15}
                        aria-hidden="true"
                        className="audio-icon-review5-p1-q2"
                      />
                    )}
                  </span>

                  {/* =====================================
                        NUMBER SLOT
                    ===================================== */}

                  <DropSlot
                    index={index}
                    answer={answers[index]}
                    isWrong={wrongNumbers[index]}
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
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={showAnswers}
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
        {activeValue ? (
          <span
            style={{
              padding: "7px 14px",
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

export default Review5_Page1_Q2;
