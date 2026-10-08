import React, { useRef, useState } from "react";

import bat from "../../../assets/U1 WB/U5/U5P32EXEB-01.svg";
import cap from "../../../assets/U1 WB/U5/U5P32EXEB-02.svg";
import ant from "../../../assets/U1 WB/U5/U5P32EXEB-03.svg";
import dad from "../../../assets/U1 WB/U5/U5P32EXEB-04.svg";
import dad1 from "../../../assets/U1 WB/U5/U5P32EXEB-05.svg";
import dad2 from "../../../assets/U1 WB/U5/U5P32EXEB-06.svg";
import "./WB_Unit5_Page6_Q2.css";

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
} from "@dnd-kit/core";

import sound1 from "../../../assets/U1 WB/U5/audio/cd7pg32-instruction1-adult-lady_PVAFxGJz.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const correctAnswers = ["g", "g", "k", "k", "g", "k"];

const wordBank = ["g", "k"];

const images = [
  {
    src: bat,
    alt: "A goat.",
  },
  {
    src: cap,
    alt: "A bottle of glue.",
  },
  {
    src: ant,
    alt: "A kite.",
  },
  {
    src: dad,
    alt: "A kitchen.",
  },
  {
    src: dad1,
    alt: "A gift.",
  },
  {
    src: dad2,
    alt: "A key.",
  },
];

/* =====================================================
   DRAGGABLE LETTER
===================================================== */

const DraggableWord = ({
  word,

  showAnswer,
  checkCompleted,

  keyboardPickedWord,
  onKeyboardPick,

  registerBankRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,

    disabled: showAnswer || checkCompleted,
  });

  const isPicked = keyboardPickedWord === word;

  const disabled = showAnswer || checkCompleted;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        registerBankRef(word, el);
      }}
      {...(!disabled
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isPicked}
      aria-disabled={disabled}
      aria-label={
        isPicked
          ? `${word} selected. Press Tab to move to an answer blank, then press Enter or Space to place it.`
          : `${word}. Press Enter or Space to select this letter.`
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          if (disabled) return;

          onKeyboardPick(isPicked ? null : word);
        }
      }}
      className="drag-letter-wb-u5-p6-q2"
      style={{
        padding: "7px 18px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : "white",

        fontWeight: "bold",

        fontSize: "20px",

        cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.4 : 1,

        touchAction: "none",

        transition: "all 0.2s ease",

        userSelect: "none",

        outline: isPicked ? "3px solid #2563eb" : undefined,

        outlineOffset: isPicked ? "4px" : undefined,
      }}
    >
      {word}
    </span>
  );
};

/* =====================================================
   DROPPABLE SLOT
===================================================== */

const DroppableSlot = ({
  index,
  value,

  isWrong,
  isLocked,

  showAnswer,
  checkCompleted,

  keyboardPickedWord,

  focusedSlot,
  setFocusedSlot,

  slotRefs,

  getAvailableSlots,

  onKeyboardPlace,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,

    disabled: isLocked || showAnswer || checkCompleted,
  });

  const keyboardActive =
    !!keyboardPickedWord && !isLocked && !showAnswer && !checkCompleted;

  /* =========================================
     UPDATED DRAG PATTERN

     أي slot فيه value ولسا editable
     يضل reachable بالـTab حتى قبل Check
  ========================================= */

  const canEditFilled =
    !!value &&
    !keyboardPickedWord &&
    !isLocked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardActive && focusedSlot === index;

  const displayedValue = showPreview ? keyboardPickedWord : value;

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT → RETURN TO BANK
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardActive) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB BETWEEN AVAILABLE SLOTS
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlots();

      if (!available.length) {
        return;
      }

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

    /* =========================================
       PLACE / REPLACE LETTER
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardPlace(index);

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
      style={{
        position: "relative",
        display: "flex",
      }}
    >
      <div className="input-wrapper-unit3-page6-q1">
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
              ? value
                ? `Blank ${index + 1} contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
                : `Blank ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}.`
              : canEditFilled
                ? `Blank ${index + 1} contains ${value}. Press Enter or Space to return it to the letter bank.`
                : value
                  ? `Blank ${index + 1} contains ${value}.`
                  : `Empty blank ${index + 1}.`
          }
          className={`drop-slot-wb-u5-p6-q2 ${isOver ? "drag-over-cell" : ""} ${
            showPreview ? "keyboard-preview-wb-u5-p6-q2" : ""
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
            if (!isLocked && !showAnswer && !checkCompleted && value) {
              onRemove(index);
            }
          }}
          style={{
            background: isOver ? "#e3f2fd" : "white",

            minWidth: "120px",

            minHeight: "36px",

            display: "flex",

            alignItems: "center",

            borderRadius: "0px",

            justifyContent: "center",

            borderBottom: "1px solid #72d0f6",

            cursor:
              !isLocked && !showAnswer && !checkCompleted && value
                ? "pointer"
                : "default",

            transition: "background 0.15s ease",

            position: "relative",
          }}
          title={
            !isLocked && !showAnswer && !checkCompleted && value
              ? "Click to remove"
              : ""
          }
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
          <span className="error-mark-input-review3-p2-q1" aria-hidden="true">
            ✕
          </span>
        )}
      </div>
    </div>
  );
};
/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit3_Page6_Q1 = () => {
  /* =================================================
     STATE
  ================================================= */

  const [slots, setSlots] = useState(Array(6).fill(null));

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswerState, setShowAnswerState] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* =================================================
     KEYBOARD STATE
  ================================================= */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlot, setFocusedSlot] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  /* =================================================
     SENSORS
  ================================================= */

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
     QUESTION AUDIO
  ================================================= */

  const stopAtSecond = 8.179;

  const captions = [
    {
      start: 0,
      end: 7.88,
      text: "Phonics exercise B. Does it begin with G or K? Listen, look, and write.",
    },
    {
      start: 8.68,
      end: 9.98,
      text: "1, goat.",
    },
    {
      start: 10.5,
      end: 12.08,
      text: "2, glue.",
    },
    {
      start: 12.6,
      end: 14.3,
      text: "3, kite.",
    },
    {
      start: 14.78,
      end: 16.38,
      text: "4, kitchen.",
    },
    {
      start: 16.9,
      end: 18.52,
      text: "5, gift.",
    },
    {
      start: 19.02,
      end: 20.62,
      text: "6, key.",
    },
  ];

  /* =================================================
     HELPERS
  ================================================= */

  const isSlotLocked = (index) => lockedSlots.includes(index);

  const getAvailableSlots = () =>
    correctAnswers
      .map((_, index) => index)
      .filter((index) => !isSlotLocked(index));

  /* =================================================
     PLACE LETTER
  ================================================= */

  const placeLetter = (index, word) => {
    if (showAnswerState || checkCompleted || isSlotLocked(index)) {
      return;
    }

    setSlots((prev) => {
      const copy = [...prev];

      copy[index] = word;

      return copy;
    });

    /*
      Clear X only for this slot
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* =================================================
     DRAG
  ================================================= */

  const handleDragStart = (event) => {
    setActiveWord(event.active.id.replace("word-", ""));
  };

  const handleDragEnd = (event) => {
    setActiveWord(null);

    if (showAnswerState || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !String(over.id).startsWith("slot-")) {
      return;
    }

    const draggedWord = String(active.id).replace("word-", "");

    const targetIndex = Number(String(over.id).replace("slot-", ""));

    if (isSlotLocked(targetIndex)) {
      return;
    }

    placeLetter(targetIndex, draggedWord);
  };

  const handleDragCancel = () => {
    setActiveWord(null);
  };

  /* =================================================
     REMOVE FROM SLOT
  ================================================= */

  const handleRemoveFromSlot = (index) => {
    if (showAnswerState || checkCompleted || isSlotLocked(index)) {
      return;
    }

    setSlots((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (word) => {
    if (!word || showAnswerState || checkCompleted) {
      setKeyboardPickedWord(null);

      return;
    }

    setKeyboardPickedWord(word);

    setFocusedSlot(null);

    /*
      Focus first unlocked slot
    */

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

  const handleKeyboardPlace = (index) => {
    if (
      !keyboardPickedWord ||
      showAnswerState ||
      checkCompleted ||
      isSlotLocked(index)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    placeLetter(index, word);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    /*
      يرجع لنفس g/k
    */

    window.setTimeout(() => {
      bankRefs.current[word]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG SLOT → BANK
  ================================================= */

  const handleKeyboardClearWrong = (index, currentWord) => {
    if (showAnswerState || checkCompleted || isSlotLocked(index)) {
      return;
    }

    handleRemoveFromSlot(index);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    /*
      يرجع لنفس الحرف بالبنك
    */

    window.setTimeout(() => {
      bankRefs.current[currentWord]?.focus();
    }, 0);
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const handleCancelKeyboardPick = () => {
    const word = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    if (word) {
      window.setTimeout(() => {
        bankRefs.current[word]?.focus();
      }, 0);
    }
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswerState || checkCompleted) {
      return;
    }

    if (slots.some((slot) => !slot)) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let tempScore = 0;

    const wrong = [];

    const newlyLocked = [];

    slots.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        tempScore++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      Correct slots lock
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      Wrong slots remain editable
    */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    const total = correctAnswers.length;

    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${tempScore} / ${total}
        </span>
      </div>
    `;

    if (tempScore === total) {
      setLockedSlots(correctAnswers.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (tempScore === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    setSlots(Array(6).fill(null));

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswerState(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswer = () => {
    setSlots([...correctAnswers]);

    setWrongInputs([]);

    setLockedSlots(correctAnswers.map((_, index) => index));

    setShowAnswerState(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
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
            gap: "15px",
          }}
        >
          <ExerciseHeader
            sectionLetter="B"
            title={
              <>
                Does it begin with{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  g
                </span>{" "}
                or{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  k
                </span>
                ? Listen, look, and write.
              </>
            }
            subTitle={
              <>
                Listen to each word and drag{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  g
                </span>{" "}
                or{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  k
                </span>{" "}
                below the picture.
              </>
            }
          />

          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId="page32-Q2-WB"
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "30px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              width: "100%",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {wordBank.map((word) => (
              <DraggableWord
                key={word}
                word={word}
                showAnswer={showAnswerState}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                registerBankRef={(letter, el) => {
                  bankRefs.current[letter] = el;
                }}
              />
            ))}
          </div>

          {/* =================================================
              IMAGE + SLOT GRID
          ================================================= */}

          <div className="row-content10-review3-p2-q1">
            {images.map((item, index) => (
              <div className="row2-review3-p2-q1" key={index}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="q-img-wb-unit3-p6-q1"
                />

                <DroppableSlot
                  index={index}
                  value={slots[index]}
                  isWrong={wrongInputs.includes(index)}
                  isLocked={isSlotLocked(index)}
                  showAnswer={showAnswerState}
                  checkCompleted={checkCompleted}
                  keyboardPickedWord={keyboardPickedWord}
                  focusedSlot={focusedSlot}
                  setFocusedSlot={setFocusedSlot}
                  slotRefs={slotRefs}
                  getAvailableSlots={getAvailableSlots}
                  onKeyboardPlace={handleKeyboardPlace}
                  onKeyboardClearWrong={handleKeyboardClearWrong}
                  onCancelKeyboardPick={handleCancelKeyboardPick}
                  onRemove={handleRemoveFromSlot}
                />
              </div>
            ))}
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
            onClick={showAnswer}
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
        {activeWord && (
          <span
            style={{
              padding: "7px 18px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              fontSize: "20px",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

              cursor: "grabbing",
            }}
          >
            {activeWord}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit3_Page6_Q1;
