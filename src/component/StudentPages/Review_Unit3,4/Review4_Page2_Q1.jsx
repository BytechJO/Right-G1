import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Review4_Page2_Q1.css";

import sound1 from "../../../assets/unit4/sounds/U4P37EXEE.mp3";

import img1 from "../../../assets/unit4/imgs/U4P37EEXEE-01-01.svg";
import img2 from "../../../assets/unit4/imgs/U4P37EEXEE-01-02.svg";
import img3 from "../../../assets/unit4/imgs/U4P37EEXEE-02-01.svg";
import img4 from "../../../assets/unit4/imgs/U4P37EEXEE-02-02.svg";
import img5 from "../../../assets/unit4/imgs/U4P37EEXEE-03-01.svg";
import img6 from "../../../assets/unit4/imgs/U4P37EEXEE-03-02.svg";

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

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    parts: [
      {
        before: "The ",
        middleImg: img1,
        imgAlt: "A fork.",
        blank: 1,
        after: "ork",
      },
      {
        before: " is on the ",
        middleImg: img2,
        imgAlt: "A veterinarian.",
        blank: 2,
        after: "et.",
      },
    ],
    correct: ["f", "v"],
  },

  {
    parts: [
      {
        before: "The ",
        middleImg: img3,
        imgAlt: "A fish.",
        blank: 1,
        after: "ish",
      },
      {
        before: " is in the ",
        middleImg: img4,
        imgAlt: "A yellow van.",
        blank: 2,
        after: "an.",
      },
    ],
    correct: ["f", "v"],
  },

  {
    parts: [
      {
        before: "The ",
        middleImg: img5,
        imgAlt: "A blue vest.",
        blank: 1,
        after: "est",
      },
      {
        before: " is on my ",
        middleImg: img6,
        imgAlt: "A pair of feet.",
        blank: 2,
        after: "eet.",
      },
    ],
    correct: ["v", "f"],
  },
];

const letters = ["f", "b", "v"];

/* =====================================================
   CAPTIONS
===================================================== */

const captions = [
  {
    start: 0,
    end: 5.23,
    text: "Page 37, Exercise E. Listen and write the missing letters.",
  },
  {
    start: 5.25,
    end: 9.05,
    text: "1. The fork is on the vet.",
  },
  {
    start: 9.07,
    end: 12.2,
    text: "2. The fish is in the van.",
  },
  {
    start: 12.22,
    end: 16.16,
    text: "3. The vest is on my feet.",
  },
];

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  letter,
  disabled,

  keyboardPickedLetter,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `letter-${letter}`,
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
          ? `Letter ${letter} selected. Press Tab to choose a blank.`
          : `Letter ${letter}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(letter);
        }
      }}
      className={`review4-p2-q1-bank-letter ${
        isPicked ? "keyboard-picked-letter-review4-p2-q1" : ""
      }`}
      style={{
        padding: "7px 14px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : "white",

        fontWeight: "bold",

        fontSize: "20px",

        cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.35 : 1,

        transition: "all 0.2s ease",

        userSelect: "none",

        touchAction: "none",

        display: "inline-block",
      }}
    >
      {letter}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const SlotDropZone = ({
  id,
  qIndex,
  blankIndex,

  value,

  isWrong,
  locked,

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
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedLetter && !locked && !showAnswer && !checkCompleted;

  /* =================================================
     UPDATED DRAG PATTERN
     أي blank معبّى ولسا مش locked
     يضل reachable بالـTab حتى قبل Check
  ================================================= */

  const canEditFilled =
    !!value &&
    !keyboardPickedLetter &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === id;

  const displayValue = showPreview ? keyboardPickedLetter : value;

  const handleKeyDown = (e) => {
    /* =================================================
       FILLED SLOT → RETURN TO LETTER BANK
    ================================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(qIndex, blankIndex, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =================================================
       TAB / SHIFT + TAB
    ================================================= */

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

    /* =================================================
       ENTER / SPACE → PLACE / REPLACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(qIndex, blankIndex);

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
    <div className="input-wrapper-review4-p2-q1">
      <div
        ref={(el) => {
          setNodeRef(el);

          slotRefs.current[id] = el;
        }}
        className={`missing-input-review4-p2-q1 ${
          isOver && !locked ? "drag-over-cell" : ""
        } ${showPreview ? "keyboard-drop-preview-review4-p2-q1" : ""}`}
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
              ? `Blank. Current letter ${value}. Press Enter or Space to replace it with ${keyboardPickedLetter}.`
              : `Empty blank. Press Enter or Space to place letter ${keyboardPickedLetter}.`
            : canEditFilled
              ? `Blank contains letter ${value}. Press Enter or Space to return it to the letter bank.`
              : value
                ? `Blank contains letter ${value}.`
                : "Empty blank."
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
        onClick={() => {
          if (value && !locked && !showAnswer && !checkCompleted) {
            onRemove(id);
          }
        }}
        style={{
          cursor:
            value && !locked && !showAnswer && !checkCompleted
              ? "pointer"
              : "default",

          transition: "background 0.15s, color 0.15s",
        }}
      >
        {displayValue}
      </div>

      {isWrong && (
        <span className="wrong-icon-review4-p2-q1" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review4_Page2_Q1 = () => {
  /* =====================================================
     ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState(
    data.map((item) => Array(item.correct.length).fill("")),
  );

  const [wrongInputs, setWrongInputs] = useState([]);

  /* =====================================================
     PROGRESSIVE LOCKING
  ===================================================== */

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD DRAG
  ===================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =====================================================
     HELPERS
  ===================================================== */

  const activeWord = activeId ? activeId.replace("letter-", "") : null;

  const makeSlotId = (qIndex, blankIndex) => `slot-${qIndex}-${blankIndex}`;

  const isSlotLocked = (qIndex, blankIndex) =>
    lockedSlots.includes(`${qIndex}-${blankIndex}`);

  const getAvailableSlotIds = () => {
    const ids = [];

    data.forEach((item, qIndex) => {
      item.correct.forEach((_, blankIndex) => {
        if (
          !isSlotLocked(qIndex, blankIndex) &&
          !showAnswer &&
          !checkCompleted
        ) {
          ids.push(makeSlotId(qIndex, blankIndex));
        }
      });
    });

    return ids;
  };

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
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const letter = active.id.replace("letter-", "");

    const [qIndex, blankIndex] = String(over.id)
      .replace("slot-", "")
      .split("-")
      .map(Number);

    if (isSlotLocked(qIndex, blankIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      /*
        f / b / v reusable.
        لذلك ما منشيل الحرف من أي خانة ثانية.
      */

      updated[qIndex][blankIndex] = letter;

      return updated;
    });

    /*
      شيل X فقط عن نفس الخانة
    */

    setWrongInputs((prev) =>
      prev.filter((id) => id !== `${qIndex}-${blankIndex}`),
    );
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

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

  /* =====================================================
     KEYBOARD DROP
  ===================================================== */

  const handleKeyboardDrop = (qIndex, blankIndex) => {
    if (
      !keyboardPickedLetter ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(qIndex, blankIndex)
    ) {
      return;
    }

    const letter = keyboardPickedLetter;

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = letter;

      return updated;
    });

    setWrongInputs((prev) =>
      prev.filter((id) => id !== `${qIndex}-${blankIndex}`),
    );

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    /*
      بعد التثبيت رجع لنفس الحرف،
      لأنه الحروف reusable.
    */

    window.setTimeout(() => {
      bankRefs.current[letter]?.focus();
    }, 0);
  };

  /* =====================================================
     WRONG SLOT AFTER CHECK
  ===================================================== */

  const handleKeyboardClearWrong = (qIndex, blankIndex, currentLetter) => {
    if (showAnswer || checkCompleted || isSlotLocked(qIndex, blankIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = "";

      return updated;
    });

    /*
      شيل X فقط عن نفس الخانة
    */

    setWrongInputs((prev) =>
      prev.filter((id) => id !== `${qIndex}-${blankIndex}`),
    );

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    /*
      رجع لنفس الحرف بالبنك
    */

    window.setTimeout(() => {
      if (currentLetter && bankRefs.current[currentLetter]) {
        bankRefs.current[currentLetter]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     ESCAPE
  ===================================================== */

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

  /* =====================================================
     REMOVE WITH MOUSE
  ===================================================== */

  const handleRemove = (slotId) => {
    const [qIndex, blankIndex] = slotId
      .replace("slot-", "")
      .split("-")
      .map(Number);

    if (showAnswer || checkCompleted || isSlotLocked(qIndex, blankIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = "";

      return updated;
    });

    setWrongInputs((prev) =>
      prev.filter((id) => id !== `${qIndex}-${blankIndex}`),
    );
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const hasEmpty = answers.some((row) =>
      row.some((value) => value.trim() === ""),
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      return;
    }

    const wrong = [];

    const newlyLocked = [];

    let correctCount = 0;

    answers.forEach((row, qIndex) => {
      row.forEach((value, blankIndex) => {
        const slotKey = `${qIndex}-${blankIndex}`;

        if (value.trim() === data[qIndex].correct[blankIndex]) {
          correctCount++;

          newlyLocked.push(slotKey);
        } else {
          wrong.push(slotKey);
        }
      });
    });

    /*
      الصح فقط يقفل
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      الغلط فقط عليه X
    */

    setWrongInputs(wrong);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    const totalInputs = data.reduce(
      (total, item) => total + item.correct.length,
      0,
    );

    const color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${totalInputs}
        </span>
      </div>
    `;

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (correctCount === totalInputs) {
      const allSlots = [];

      data.forEach((item, qIndex) => {
        item.correct.forEach((_, blankIndex) => {
          allSlots.push(`${qIndex}-${blankIndex}`);
        });
      });

      setLockedSlots(allSlots);

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

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setAnswers(data.map((item) => Array(item.correct.length).fill("")));

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    setAnswers(data.map((item) => [...item.correct]));

    setWrongInputs([]);

    const allSlots = [];

    data.forEach((item, qIndex) => {
      item.correct.forEach((_, blankIndex) => {
        allSlots.push(`${qIndex}-${blankIndex}`);
      });
    });

    setLockedSlots(allSlots);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="page8-wrapper">
        <div
          className="div-forall"
          style={{
            gap: "20px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="E"
            title="Listen and write the missing letters."
            subTitle="Listen to each sentence, then drag f, b, or v into the blank."
          />

          {/* موجود أصلًا بالسؤال - ما أضفنا أصوات جديدة */}
          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={5.23}
            pageId="Review4_Page2_Q1"
          />

          {/* =================================================
              LETTER BANK
          ================================================= */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "10px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {letters.map((letter) => (
              <BankChip
                key={letter}
                letter={letter}
                disabled={showAnswer || checkCompleted}
                keyboardPickedLetter={keyboardPickedLetter}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          {data.map((item, qIndex) => (
            <div className="row-missing" key={qIndex}>
              <span className="num">{qIndex + 1}.</span>

              <div className="sentence-review4-p2-q1">
                {item.parts.map((part, blankIndex) => {
                  const slotKey = `${qIndex}-${blankIndex}`;

                  return (
                    <span
                      key={blankIndex}
                      className="sentence-part"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {part.before}

                      <SlotDropZone
                        id={makeSlotId(qIndex, blankIndex)}
                        qIndex={qIndex}
                        blankIndex={blankIndex}
                        value={answers[qIndex][blankIndex]}
                        isWrong={wrongInputs.includes(slotKey)}
                        locked={isSlotLocked(qIndex, blankIndex)}
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
                        onRemove={handleRemove}
                      />

                      {part.after}

                      <img
                        src={part.middleImg}
                        className="middle-img"
                        alt={part.imgAlt}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
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
        {activeWord ? (
          <span
            style={{
              padding: "7px 14px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "white",
              fontWeight: "bold",
              fontSize: "20px",
              cursor: "grabbing",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              display: "inline-block",
            }}
          >
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review4_Page2_Q1;
