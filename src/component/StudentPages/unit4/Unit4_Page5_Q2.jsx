import React, { useRef, useState } from "react";

import bat from "../../../assets/unit4/imgs/U4P32ExeA2-01.svg";
import cap from "../../../assets/unit4/imgs/U4P32ExeA2-02.svg";
import ant from "../../../assets/unit4/imgs/U4P32ExeA2-03.svg";
import dad from "../../../assets/unit4/imgs/U4P32ExeA2-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page5_Q2.css";

import sound from "../../../assets/unit4/sounds/U4P32EXEA2.mp3";

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

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* ======================================================
   DRAGGABLE LETTER
   f / v reusable
====================================================== */

const DraggableWord = ({
  id,
  letter,
  disabled,

  keyboardPickedLetter,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });

  const isPicked = keyboardPickedLetter === letter;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[letter] = el;
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
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${letter} selected. Press Tab to choose a blank.`
          : `${letter}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(letter);
        }
      }}
      className={isPicked ? "keyboard-picked-letter-unit4-page5-q2" : ""}
      style={{
        padding: "7px 14px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : "white",

        fontWeight: "bold",

        cursor: disabled ? "default" : "grab",

        fontSize: "22px",

        opacity: isDragging ? 0.4 : 1,

        display: "inline-block",

        userSelect: "none",

        transition: "all 0.2s ease",

        touchAction: "none",
      }}
    >
      {letter}
    </span>
  );
};

/* ======================================================
   DROP SLOT
====================================================== */

/* ======================================================
   DROP SLOT — UPDATED DRAG PATTERN
====================================================== */

const DropSlot = ({
  index,
  value,

  locked,
  isWrong,

  showAnswer,
  checkCompleted,

  keyboardPickedLetter,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,

  getAvailableSlotIds,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const id = `slot-${index}`;

  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: locked || showAnswer || checkCompleted,
  });

  /* ==================================================
     KEYBOARD DROP MODE
  ================================================== */

  const keyboardDropActive =
    !!keyboardPickedLetter && !locked && !showAnswer && !checkCompleted;

  /* ==================================================
     NEW DRAG PATTERN

     أي slot معبّى ولسا مش locked
     يضل reachable بالـTab
     قبل Check وبعده إذا كان غلط
  ================================================== */

  const canEditFilled =
    !!value &&
    !keyboardPickedLetter &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === id;

  const displayValue = showPreview ? keyboardPickedLetter : value;

  const handleKeyDown = (e) => {
    /* ==================================================
       FILLED SLOT → CLEAR → RETURN TO BANK
    ================================================== */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* ==================================================
       TAB / SHIFT TAB
    ================================================== */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(id);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextId = available[nextIndex];

      slotRefs.current[nextId]?.focus();

      return;
    }

    /* ==================================================
       ENTER / SPACE = PLACE / REPLACE
    ================================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(index);

      return;
    }

    /* ==================================================
       ESCAPE
    ================================================== */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <div className="input-wrapper-unit3-page6-q1">
      <div
        ref={(el) => {
          setNodeRef(el);

          slotRefs.current[id] = el;
        }}
        className={`q-input-unit3-page6-q1 ${
          isOver && !locked ? "drag-over-cell" : ""
        } ${locked ? "correct-color" : ""} ${
          showPreview ? "keyboard-drop-preview-unit4-page5-q2" : ""
        }`}
        role="button"
        tabIndex={
          locked || showAnswer || checkCompleted
            ? -1
            : keyboardDropActive || canEditFilled
              ? 0
              : -1
        }
        aria-label={
          keyboardDropActive
            ? value
              ? `${value} is in this blank. Press Enter or Space to replace it with ${keyboardPickedLetter}.`
              : `Empty blank. Press Enter or Space to place ${keyboardPickedLetter}.`
            : canEditFilled
              ? `${value} is in this blank. Press Enter or Space to remove it and return to the letter choices.`
              : value
                ? `${value} answer`
                : "Empty answer blank"
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
        style={{
          cursor:
            value && !locked && !showAnswer && !checkCompleted
              ? "pointer"
              : "default",
        }}
      >
        {displayValue && (
          <span
            onClick={
              !locked && !showAnswer && !checkCompleted ? onRemove : undefined
            }
            style={{
              cursor: locked ? "default" : "pointer",

              userSelect: "none",

              display: "inline-flex",

              alignItems: "center",

              gap: "3px",

              fontWeight: "bold",
            }}
          >
            {displayValue}
          </span>
        )}
      </div>

      {isWrong && <span className="error-mark-input">✕</span>}
    </div>
  );
};

/* ======================================================
   MAIN
====================================================== */

const Unit4_Page5_Q2 = () => {
  const correctAnswers = ["f", "v", "v", "f"];

  const images = [
    {
      src: bat,
      alt: "A frog",
    },

    {
      src: cap,
      alt: "A violin",
    },

    {
      src: ant,
      alt: "A vase",
    },

    {
      src: dad,
      alt: "A father",
    },
  ];

  /* ======================================================
     ANSWERS
  ====================================================== */

  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([]);

  /* ======================================================
     PROGRESSIVE LOCKING
  ====================================================== */

  const [lockedInputs, setLockedInputs] = useState([]);

  /* ======================================================
     FINAL STATES
  ====================================================== */

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* ======================================================
     DRAG
  ====================================================== */

  const [activeLetter, setActiveLetter] = useState(null);

  /* ======================================================
     KEYBOARD DRAG
  ====================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* ======================================================
     AUDIO PLAYER
  ====================================================== */

  const stopAtSecond = 11.13;

  const captions = [
    {
      start: 0,
      end: 11.13,
      text: "page 32 Right activities exercise A number 2 does it begin with f or v listen and write ",
    },

    {
      start: 11.15,
      end: 13.17,
      text: "1. frog",
    },

    {
      start: 13.19,
      end: 15.14,
      text: "2. violin",
    },

    {
      start: 15.16,
      end: 17.29,
      text: "3. vase",
    },

    {
      start: 17.31,
      end: 20.06,
      text: "4. father",
    },
  ];

  /* ======================================================
     HELPERS
  ====================================================== */

  const isInputLocked = (index) => lockedInputs.includes(index);

  const getAvailableSlotIds = () =>
    answers
      .map((_, index) => index)
      .filter(
        (index) => !isInputLocked(index) && !showAnswer && !checkCompleted,
      )
      .map((index) => `slot-${index}`);

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
     MOUSE / TOUCH DRAG START
  ====================================================== */

  const onDragStart = ({ active }) => {
    setActiveLetter(active.id.replace("bank-", ""));
  };

  /* ======================================================
     MOUSE / TOUCH DROP
  ====================================================== */

  const onDragEnd = ({ active, over }) => {
    setActiveLetter(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const value = active.id.replace("bank-", "");

    const index = Number(String(over.id).replace("slot-", ""));

    /*
      الصح المقفول ما بتعدل
    */

    if (isInputLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = value;

    setAnswers(updated);

    /*
      شيل X فقط من الخانة
      اللي تغيرت
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  const onDragCancel = () => {
    setActiveLetter(null);
  };

  /* ======================================================
     KEYBOARD PICK
  ====================================================== */

  const handleKeyboardPick = (letter) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedLetter(letter);

    setFocusedSlotId(null);

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

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
    if (
      !keyboardPickedLetter ||
      showAnswer ||
      checkCompleted ||
      isInputLocked(index)
    ) {
      return;
    }

    const updated = [...answers];

    updated[index] = keyboardPickedLetter;

    setAnswers(updated);

    /*
      شيل X فقط من نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    const placedLetter = keyboardPickedLetter;

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    /*
      بما إن f/v reusable:
      رجع على نفس الحرف بالبنك
    */

    window.setTimeout(() => {
      bankRefs.current[placedLetter]?.focus();
    }, 0);
  };

  /* ======================================================
     WRONG SLOT AFTER CHECK
  ====================================================== */

  const handleKeyboardClearWrong = (index, currentLetter) => {
    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    /*
      X فقط عن نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    /*
      رجع لنفس f أو v
    */

    window.setTimeout(() => {
      if (currentLetter && bankRefs.current[currentLetter]) {
        bankRefs.current[currentLetter]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     CANCEL KEYBOARD PICK
  ====================================================== */

  const handleCancelKeyboardPick = () => {
    const letter = keyboardPickedLetter;

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (letter && bankRefs.current[letter]) {
        bankRefs.current[letter]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     CLICK REMOVE
  ====================================================== */

  const removeAnswer = (index) => {
    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    /*
      X فقط عن نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* ======================================================
     CHECK ANSWER
  ====================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let score = 0;

    const wrong = [];

    const correctTemp = [];

    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        score++;

        correctTemp.push(index);
      } else {
        wrong.push(index);
      }
    });

    /* ==================================================
       LOCK CORRECT ONLY
    ================================================== */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...correctTemp])));

    /* ==================================================
       WRONG ONLY
    ================================================== */

    setWrongInputs(wrong);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="
        font-size:20px;
        margin-top:10px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    /* ==================================================
       ALL CORRECT
    ================================================== */

    if (score === total) {
      setLockedInputs(correctAnswers.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(message);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  /* ======================================================
     SHOW ANSWER
  ====================================================== */

  const handleShowAnswer = () => {
    setAnswers([...correctAnswers]);

    setWrongInputs([]);

    setLockedInputs(correctAnswers.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);
  };

  /* ======================================================
     RESET
  ====================================================== */

  const reset = () => {
    setAnswers(["", "", "", ""]);

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveLetter(null);

    setKeyboardPickedLetter(null);

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
        className="question-wrapper-unit3-page6-q1"
        style={{
          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          padding: "35px",
        }}
      >
        <div
          className="div-forall"
          style={{
            gap: "30px",
          }}
        >
          <ExerciseHeader
            questionNumber="2"
            title={
              <>
                Does it begin with{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  f
                </span>{" "}
                or{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  v
                </span>
                ? Listen and write.
              </>
            }
            subTitle={
              <>
                Listen to each picture name, then tap{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  f
                </span>{" "}
                or{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  v
                </span>
                .
              </>
            }
          />

          <QuestionAudioPlayer
            src={sound}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId="unit4-page32-Q2-SB"
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              width: "100%",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {["f", "v"].map((letter) => (
              <DraggableWord
                key={letter}
                id={`bank-${letter}`}
                letter={letter}
                disabled={showAnswer || checkCompleted}
                keyboardPickedLetter={keyboardPickedLetter}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              SLOTS + IMAGES
          ================================================= */}

          <div className="row-content10-unit4-page5-q2">
            {images.map((image, index) => {
              const locked = isInputLocked(index);

              return (
                <div className="row2-unit3-page6-q1" key={index}>
                  <div
                    style={{
                      display: "flex",

                      gap: "15px",
                    }}
                  >
                    <span className="num-span">{index + 1}</span>

                    <img
                      src={image.src}
                      alt={image.alt}
                      className="q-img-unit3-page6-q1"
                    />
                  </div>

                  <span
                    style={{
                      position: "relative",

                      display: "flex",
                    }}
                  >
                    <DropSlot
                      index={index}
                      value={answers[index]}
                      locked={locked}
                      isWrong={wrongInputs.includes(index)}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      keyboardPickedLetter={keyboardPickedLetter}
                      focusedSlotId={focusedSlotId}
                      setFocusedSlotId={setFocusedSlotId}
                      slotRefs={slotRefs}
                      getAvailableSlotIds={getAvailableSlotIds}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardClearWrong={handleKeyboardClearWrong}
                      onCancelKeyboardPick={handleCancelKeyboardPick}
                      onRemove={() => removeAnswer(index)}
                    />
                  </span>
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

          <button onClick={handleShowAnswer} className="show-answer-btn">
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
        {activeLetter ? (
          <span
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "#fff",

              fontWeight: "bold",

              fontSize: "22px",

              boxShadow: "0 5px 15px rgba(0,0,0,.2)",

              display: "inline-block",
            }}
          >
            {activeLetter}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit4_Page5_Q2;
