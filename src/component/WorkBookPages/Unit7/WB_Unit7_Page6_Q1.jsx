import "./WB_Unit7_Page6_Q1.css";

import { useRef, useState } from "react";

import sound1 from "../../../assets/U1 WB/U7/audio/cd9pg44-instruction1-adult-lady_LXsZ0C5j.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U7/U7P44EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P44EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P44EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P44EXEA-04.svg";
import img5 from "../../../assets/U1 WB/U7/U7P44EXEA-05.svg";
import img6 from "../../../assets/U1 WB/U7/U7P44EXEA-06.svg";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const CORRECT_DATA = ["w", "w", "h", "h", "h", "w"];

const LETTER_BANK = ["h", "w"];

const IMAGE_DATA = [
  {
    src: img1,
    alt: "A waffle on a plate.",
  },
  {
    src: img2,
    alt: "A waitress holding a notepad and pen.",
  },
  {
    src: img3,
    alt: "A house with a red roof.",
  },
  {
    src: img4,
    alt: "A water hose with water dripping from it.",
  },
  {
    src: img5,
    alt: "A hat resting on a green surface.",
  },
  {
    src: img6,
    alt: "A green cartoon worm.",
  },
];

const CAPTIONS = [
  {
    start: 0,
    end: 7.18,
    text: "Phonics exercise A. Does it begin with H or W? Listen and write.",
  },
  {
    start: 7.82,
    end: 9.74,
    text: "One, waffle.",
  },
  {
    start: 10.3,
    end: 11.98,
    text: "Two, waitress.",
  },
  {
    start: 12.7,
    end: 14.52,
    text: "Three, house.",
  },
  {
    start: 15.08,
    end: 16.86,
    text: "Four, hose.",
  },
  {
    start: 17.52,
    end: 19.14,
    text: "Five, hat.",
  },
  {
    start: 19.82,
    end: 21.48,
    text: "Six, worm.",
  },
];

/* =====================================================
   LETTER CHIP
   نفس الحرف ممكن يتكرر
===================================================== */

const LetterChip = ({
  letter,

  disabled,

  keyboardPickedLetter,

  onKeyboardPick,

  registerRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `letter-${letter}`,

    data: {
      letter,
    },

    disabled,
  });

  const isKeyboardPicked = keyboardPickedLetter === letter;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(letter, node);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardPick(letter);
    }
  };

  return (
    <div
      ref={setRefs}
      {...(!disabled
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={isKeyboardPicked}
      aria-label={
        isKeyboardPicked
          ? `Letter ${letter} selected. Choose an answer box and press Enter or Space.`
          : `Letter ${letter}. Press Enter or Space to select.`
      }
      onKeyDown={handleKeyDown}
      style={{
        width: 40,

        height: 40,

        border: "2px solid #2c5287",

        borderRadius: 8,

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontWeight: "bold",

        fontSize: 20,

        background: "white",

        cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.5 : 1,

        touchAction: "none",

        userSelect: "none",

        transition: "opacity .2s",

        outline: isKeyboardPicked ? "3px solid #2563eb" : undefined,

        outlineOffset: isKeyboardPicked ? "3px" : undefined,
      }}
    >
      {letter}
    </div>
  );
};

/* =====================================================
   DROP BOX
===================================================== */

const DropBox = ({
  index,

  value,

  isWrong,

  isLocked,

  keyboardPickedLetter,

  keyboardFocusIndex,

  onKeyboardPlace,

  onKeyboardCancel,

  onMoveKeyboardFocus,

  onSlotFocus,

  onReturn,

  registerRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${index}`,

    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedLetter) && keyboardFocusIndex === index && !isLocked;

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

    if (keyboardPickedLetter && e.key === "Tab") {
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

      if (keyboardPickedLetter) {
        onKeyboardPlace(index);

        return;
      }

      /*
        wrong / editable filled slot:
        رجعه للبنك
      */

      if (value) {
        onReturn(index);
      }

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (keyboardPickedLetter && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div
      ref={setRefs}
      role="button"
      tabIndex={isLocked ? -1 : keyboardPickedLetter ? 0 : value ? 0 : -1}
      aria-disabled={isLocked}
      aria-label={
        isLocked
          ? `Answer box ${index + 1}. Letter ${value}. Correct and locked.`
          : isKeyboardTarget
            ? `Answer box ${index + 1}. Press Enter or Space to place letter ${keyboardPickedLetter}. Press Tab or Shift plus Tab to move between answer boxes.`
            : value
              ? `Answer box ${index + 1}. Current letter ${value}. Press Enter or Space to return it to the letter bank.`
              : `Answer box ${index + 1}. Empty. Select a letter first.`
      }
      onFocus={() => {
        if (keyboardPickedLetter && !isLocked) {
          onSlotFocus(index);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isLocked) return;

        e.stopPropagation();

        if (value && !keyboardPickedLetter) {
          onReturn(index);
        }
      }}
      className={`
        wb-unit7-p5-q1-input

        ${isOver ? "drag-over-cell" : ""}

        ${isKeyboardTarget ? "keyboard-drop-preview-wb-unit7-p6-q1" : ""}
      `}
      style={{
        cursor: value && !isLocked ? "pointer" : "default",

        transition: "background .15s",

        position: "relative",
      }}
    >
      {/* NORMAL VALUE */}

      {value && !isKeyboardTarget && <span>{value}</span>}

      {/* KEYBOARD PREVIEW */}

      {isKeyboardTarget && keyboardPickedLetter && (
        <span className="drop-preview-value-wb-unit7-p6-q1">
          {keyboardPickedLetter}
        </span>
      )}

      {/* WRONG X */}

      {isWrong && !isLocked && (
        <span className="unit3-q3-wrong" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit7_Page6_Q1 = () => {
  const [answers, setAnswers] = useState(Array(6).fill(null));

  /*
    null | correct | wrong
  */

  const [results, setResults] = useState(Array(6).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [allCompleted, setAllCompleted] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeLetter, setActiveLetter] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const letterRefs = useRef({});

  const dropRefs = useRef([]);

  /* =====================================================
     DND
  ===================================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  /* =====================================================
     HELPERS
  ===================================================== */

  const isSlotLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const editableIndexes = () =>
    answers.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =====================================================
     REFS
  ===================================================== */

  const registerLetterRef = (letter, node) => {
    if (node) {
      letterRefs.current[letter] = node;
    }
  };

  const registerDropRef = (index, node) => {
    if (node) {
      dropRefs.current[index] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (letter) => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    setKeyboardPickedLetter(letter);

    const available = editableIndexes();

    if (!available.length) {
      return;
    }

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      dropRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT + TAB
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableIndexes();

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
      dropRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardLetter = (index) => {
    if (
      !keyboardPickedLetter ||
      isSlotLocked(index) ||
      showAnswerMode ||
      allCompleted
    ) {
      return;
    }

    const picked = keyboardPickedLetter;

    setAnswers((prev) => {
      const copy = [...prev];

      /*
          نفس الحرف مسموح يتكرر،
          فما بنشيله من slots ثانية.
        */

      copy[index] = picked;

      return copy;
    });

    /*
      تعديل نفس الخانة:
      شيل X عنها فقط
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedLetter(null);

    setKeyboardFocusIndex(null);

    /*
      بعد placement:
      رجع لنفس الحرف بالبنك
    */

    requestAnimationFrame(() => {
      letterRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     CANCEL PICK
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedLetter) {
      return;
    }

    const picked = keyboardPickedLetter;

    setKeyboardPickedLetter(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      letterRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     RETURN
  ===================================================== */

  const handleReturn = (index) => {
    if (showAnswerMode || isSlotLocked(index)) {
      return;
    }

    const letter = answers[index];

    if (!letter) return;

    setAnswers((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    setResults((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    requestAnimationFrame(() => {
      letterRefs.current[letter]?.focus();
    });
  };

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    setActiveLetter(String(active.id).replace("letter-", ""));
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveLetter(null);

    if (!over || showAnswerMode || allCompleted) {
      return;
    }

    const destId = String(over.id);

    if (!destId.startsWith("drop-")) {
      return;
    }

    const index = Number(destId.replace("drop-", ""));

    if (isSlotLocked(index)) {
      return;
    }

    const value = String(active.id).replace("letter-", "");

    setAnswers((prev) => {
      const copy = [...prev];

      /*
          نفس الحرف ممكن يتكرر.
        */

      copy[index] = value;

      return copy;
    });

    /*
      تعديل نفس الخانة:
      شيل X عنها فقط
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
    if (showAnswerMode || allCompleted) {
      return;
    }

    const hasEmpty = answers.some(
      (value, index) => results[index] !== "correct" && !value,
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill all answer boxes before checking!");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    answers.forEach((value, index) => {
      /*
            صح من Check سابق
          */

      if (results[index] === "correct") {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (value === CORRECT_DATA[index]) {
        nextResults[index] = "correct";

        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    const total = CORRECT_DATA.length;

    const completed = correctCount === total;

    if (completed) {
      setAllCompleted(true);
    }

    const color = completed ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
        <div style="font-size:20px;text-align:center;margin-top:8px">
          <span style="color:${color};font-weight:bold">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (completed) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    setAnswers([...CORRECT_DATA]);

    setResults(CORRECT_DATA.map(() => "correct"));

    setShowAnswerMode(true);

    setAllCompleted(true);

    setActiveLetter(null);

    setKeyboardPickedLetter(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    setAnswers(Array(6).fill(null));

    setResults(Array(6).fill(null));

    setShowAnswerMode(false);

    setAllCompleted(false);

    setActiveLetter(null);

    setKeyboardPickedLetter(null);

    setKeyboardFocusIndex(null);
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
    >
      <div
        className="unit3-q3-wrapper"
        style={{
          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          padding: 30,
        }}
      >
        <div
          className="div-forall mb-10"
          style={{
            gap: 15,
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            title={
              <>
                Does it begin with <span style={{ color: "red" }}>h</span> or{" "}
                <span style={{ color: "red" }}>w</span>? Listen and write.
              </>
            }
            subTitle={
              <>
                Listen to each word and drag{" "}
                <span style={{ color: "red" }}>h</span> or{" "}
                <span style={{ color: "red" }}>w</span> below the picture.
              </>
            }
          />

          <QuestionAudioPlayer
            src={sound1}
            captions={CAPTIONS}
            stopAtSecond={7.18}
            pageId="unit7-page44-qA-WB"
          />

          {/* =================================================
              LETTER BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: 12,

              padding: 10,

              width: "100%",

              border: "2px dashed #ccc",

              borderRadius: 10,

              justifyContent: "center",

              marginBottom: 20,
            }}
          >
            {LETTER_BANK.map((letter) => (
              <LetterChip
                key={letter}
                letter={letter}
                disabled={showAnswerMode || allCompleted}
                keyboardPickedLetter={keyboardPickedLetter}
                onKeyboardPick={handleKeyboardPick}
                registerRef={registerLetterRef}
              />
            ))}
          </div>

          {/* =================================================
              IMAGES + DROP BOXES
          ================================================= */}

          <div className="wb-unit7-p5-q1-grid w-full">
            {IMAGE_DATA.map((item, index) => (
              <div key={index} className="wb-unit7-p5-q1-box">
                <img src={item.src} className="unit3-q3-image" alt={item.alt} />

                <div className="wb-unit7-p5-q1-input-wrapper">
                  <DropBox
                    index={index}
                    value={answers[index]}
                    isWrong={results[index] === "wrong"}
                    isLocked={isSlotLocked(index)}
                    keyboardPickedLetter={keyboardPickedLetter}
                    keyboardFocusIndex={keyboardFocusIndex}
                    onKeyboardPlace={placeKeyboardLetter}
                    onKeyboardCancel={cancelKeyboardPick}
                    onMoveKeyboardFocus={moveKeyboardFocus}
                    onSlotFocus={setKeyboardFocusIndex}
                    onReturn={handleReturn}
                    registerRef={registerDropRef}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
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
        {activeLetter && (
          <div
            style={{
              width: 40,

              height: 40,

              border: "2px solid #2c5287",

              borderRadius: 8,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontWeight: "bold",

              fontSize: 20,

              background: "white",

              boxShadow: "0 4px 12px rgba(0,0,0,.2)",

              cursor: "grabbing",
            }}
          >
            {activeLetter}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page6_Q1;
