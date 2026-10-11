import React, { useRef, useState } from "react";

import "./Review7_Page1_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import imgDown1 from "../../../assets/unit8/imgs/U8P70EXEA-01.svg";
import imgAcross1 from "../../../assets/unit8/imgs/U8P70EXEA-02.svg";
import imgDown2 from "../../../assets/unit8/imgs/U8P70EXEA-03.svg";
import imgAcross2 from "../../../assets/unit8/imgs/U8P70EXEA-04.svg";
import imgDown3 from "../../../assets/unit8/imgs/U8P70EXEA-05.svg";
import imgAcross3 from "../../../assets/unit8/imgs/U8P70EXEA-06.svg";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

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

/* =====================================================
   CROSSWORD STRUCTURE
===================================================== */

const crosswordStructure = [
  ["B", "B", "B", "B", "B", "B", "B", "B", "B", "1"],

  ["B", "B", "2", "W", "W", "W", "W", "B", "B", "W"],

  ["B", "B", "W", "B", "B", "B", "B", "B", "B", "W"],

  ["B", "B", "W", "B", "3", "W", "W", "W", "W", "W"],

  ["B", "B", "W", "B", "W"],

  ["4", "W", "W", "W", "W"],

  ["B", "B", "W"],
];

/* =====================================================
   SOLUTIONS
===================================================== */

const solution = [
  {
    num: 1,
    direction: "Down",
    answer: "cold",
  },
  {
    num: 2,
    direction: "Down",
    answer: "hungry",
  },
  {
    num: 3,
    direction: "Down",
    answer: "sad",
  },
  {
    num: 2,
    direction: "Across",
    answer: "happy",
  },
  {
    num: 3,
    direction: "Across",
    answer: "scared",
  },
  {
    num: 4,
    direction: "Across",
    answer: "bored",
  },
];

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

/* =====================================================
   IMAGE DATA
===================================================== */

const DOWN_IMAGES = [
  {
    number: 1,
    src: imgDown1,
    alt: "A boy shivering because he is cold.",
  },
  {
    number: 2,
    src: imgDown2,
    alt: "A boy thinking about a hamburger because he is hungry.",
  },
  {
    number: 3,
    src: imgDown3,
    alt: "A sad boy with a worried expression.",
  },
];

const ACROSS_IMAGES = [
  {
    number: 2,
    src: imgAcross1,
    alt: "A happy girl smiling.",
  },
  {
    number: 3,
    src: imgAcross2,
    alt: "A scared person reacting to a spider.",
  },
  {
    number: 4,
    src: imgAcross3,
    alt: "A bored boy sitting with a tired expression.",
  },
];

/* =====================================================
   INITIAL GRID
===================================================== */

const createInitialGrid = () =>
  crosswordStructure.map((row) =>
    row.map((cell) => (cell === "W" || /[1-9]/.test(cell) ? "" : null)),
  );

/* =====================================================
   LETTER CHIP
   الحروف تظل متاحة لأنها ممكن تتكرر
===================================================== */

const LetterChip = ({
  letter,

  keyboardPickedLetter,

  onKeyboardPick,

  registerRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `letter-${letter}`,

    data: {
      letter,
    },
  });

  const isPicked = keyboardPickedLetter === letter;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(letter, node);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardPick(letter);
    }
  };

  return (
    <span
      ref={setRefs}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `Letter ${letter} selected. Choose a crossword cell and press Enter or Space.`
          : `Letter ${letter}. Press Enter or Space to select.`
      }
      onKeyDown={handleKeyDown}
      style={{
        padding: "7px 14px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: "white",

        fontWeight: "bold",

        cursor: isDragging ? "grabbing" : "grab",

        fontSize: "18px",

        touchAction: "none",

        userSelect: "none",

        opacity: isDragging ? 0.4 : 1,

        outline: isPicked ? "3px solid #2563eb" : undefined,

        outlineOffset: isPicked ? "3px" : undefined,

        position: "relative",
      }}
    >
      {letter}
    </span>
  );
};

/* =====================================================
   CROSSWORD CELL
===================================================== */

const CrosswordCell = ({
  r,
  c,

  value,

  isNumber,
  numberValue,

  isWrong,
  isLocked,

  keyboardPickedLetter,
  keyboardFocusKey,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,

  onSlotFocus,

  onRemove,

  registerRef,
}) => {
  const id = `${r}-${c}`;

  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedLetter) && keyboardFocusKey === id && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (keyboardPickedLetter && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(id, e.shiftKey);

      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      if (keyboardPickedLetter) {
        onKeyboardPlace(id);

        return;
      }

      if (value) {
        onRemove(id);
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
      className="cell2 white"
      style={{
        position: "relative",
      }}
    >
      {isNumber && <span className="number">{numberValue}</span>}

      <div
        ref={setRefs}
        role="button"
        tabIndex={isLocked ? -1 : keyboardPickedLetter ? 0 : value ? 0 : -1}
        aria-disabled={isLocked}
        aria-label={
          isLocked
            ? `Crossword cell ${r + 1}, ${c + 1}. Letter ${value}. Correct and locked.`
            : isKeyboardTarget
              ? `Crossword cell ${r + 1}, ${c + 1}. Press Enter or Space to place letter ${keyboardPickedLetter}. Press Tab or Shift plus Tab to move between cells.`
              : value
                ? `Crossword cell ${r + 1}, ${c + 1}. Current letter ${value}. Press Enter or Space to clear this cell.`
                : `Empty crossword cell ${r + 1}, ${c + 1}. Select a letter first.`
        }
        onFocus={() => {
          if (keyboardPickedLetter && !isLocked) {
            onSlotFocus(id);
          }
        }}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (isLocked) return;

          e.stopPropagation();

          if (value && !keyboardPickedLetter) {
            onRemove(id);
          }
        }}
        className={`
          letter22

          ${isOver ? "drag-over-cell" : ""}

          ${isKeyboardTarget ? "keyboard-drop-preview-review7-p1-q1" : ""}
        `}
        style={{
          position: "relative",
        }}
      >
        {/* REAL LETTER */}

        {value && !isKeyboardTarget && (
          <span className="filled-letter">{value}</span>
        )}

        {/* KEYBOARD PREVIEW */}

        {isKeyboardTarget && keyboardPickedLetter && (
          <span className="keyboard-letter-preview-review7-p1-q1">
            {keyboardPickedLetter}
          </span>
        )}
      </div>

      {isWrong && !isLocked && (
        <span className="error-badge-review7-p1-q1" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

export default function Review7_Page1_Q1() {
  const [userGrid, setUserGrid] = useState(createInitialGrid());

  /*
    Set of "r-c"
  */
  const [wrongCells, setWrongCells] = useState([]);

  /*
    correct cells from Check
  */
  const [lockedCells, setLockedCells] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [allCompleted, setAllCompleted] = useState(false);

  /* =====================================================
     MOUSE DRAG
  ===================================================== */

  const [activeLetter, setActiveLetter] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);

  const [keyboardFocusKey, setKeyboardFocusKey] = useState(null);

  const letterRefs = useRef({});

  const cellRefs = useRef({});

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

  const findCellPosition = (num) => {
    for (let r = 0; r < crosswordStructure.length; r++) {
      for (let c = 0; c < crosswordStructure[r].length; c++) {
        if (crosswordStructure[r][c] === String(num)) {
          return {
            r,
            c,
          };
        }
      }
    }

    return null;
  };

  const isPlayableCell = (r, c) => {
    const cell = crosswordStructure[r]?.[c];

    return cell === "W" || /[1-9]/.test(cell);
  };

  const isCellLocked = (key) => showAnswerMode || lockedCells.includes(key);

  const getEditableCellKeys = () => {
    const keys = [];

    crosswordStructure.forEach((row, r) => {
      row.forEach((_, c) => {
        if (!isPlayableCell(r, c)) {
          return;
        }

        const key = `${r}-${c}`;

        if (!isCellLocked(key)) {
          keys.push(key);
        }
      });
    });

    return keys;
  };

  /* =====================================================
     BUILD CORRECT CELL MAP
  ===================================================== */

  const buildCorrectMap = () => {
    const correctMap = {};

    solution.forEach((item) => {
      const start = findCellPosition(item.num);

      if (!start) return;

      for (let i = 0; i < item.answer.length; i++) {
        const r = item.direction === "Down" ? start.r + i : start.r;

        const c = item.direction === "Across" ? start.c + i : start.c;

        correctMap[`${r}-${c}`] = item.answer[i];
      }
    });

    return correctMap;
  };

  const correctMap = buildCorrectMap();

  /* =====================================================
     REFS
  ===================================================== */

  const registerLetterRef = (letter, node) => {
    if (node) {
      letterRefs.current[letter] = node;
    }
  };

  const registerCellRef = (key, node) => {
    if (node) {
      cellRefs.current[key] = node;
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

    const available = getEditableCellKeys();

    if (!available.length) {
      return;
    }

    const firstKey = available[0];

    setKeyboardFocusKey(firstKey);

    requestAnimationFrame(() => {
      cellRefs.current[firstKey]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT TAB
  ===================================================== */

  const moveKeyboardFocus = (currentKey, backwards = false) => {
    const available = getEditableCellKeys();

    if (!available.length) {
      return;
    }

    const currentIndex = available.indexOf(currentKey);

    let nextIndex;

    if (backwards) {
      nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
    } else {
      nextIndex =
        currentIndex === -1 || currentIndex === available.length - 1
          ? 0
          : currentIndex + 1;
    }

    const nextKey = available[nextIndex];

    setKeyboardFocusKey(nextKey);

    requestAnimationFrame(() => {
      cellRefs.current[nextKey]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardLetter = (key) => {
    if (
      !keyboardPickedLetter ||
      isCellLocked(key) ||
      showAnswerMode ||
      allCompleted
    ) {
      return;
    }

    const [r, c] = key.split("-").map(Number);

    const picked = keyboardPickedLetter;

    setUserGrid((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[r][c] = picked;

      return updated;
    });

    /*
      تعديل نفس الخلية:
      شيل X عنها فقط
    */

    setWrongCells((prev) => prev.filter((cellKey) => cellKey !== key));

    setKeyboardPickedLetter(null);

    setKeyboardFocusKey(null);

    /*
      رجع لنفس الحرف بالبنك
      لأن الحروف تظل متاحة
    */

    requestAnimationFrame(() => {
      letterRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     ESCAPE
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedLetter) {
      return;
    }

    const picked = keyboardPickedLetter;

    setKeyboardPickedLetter(null);

    setKeyboardFocusKey(null);

    requestAnimationFrame(() => {
      letterRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     CLEAR CELL
  ===================================================== */

  const handleRemove = (key) => {
    if (showAnswerMode || isCellLocked(key)) {
      return;
    }

    const [r, c] = key.split("-").map(Number);

    setUserGrid((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[r][c] = "";

      return updated;
    });

    setWrongCells((prev) => prev.filter((cellKey) => cellKey !== key));
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

    const key = String(over.id);

    if (!cellRefs.current[key] || isCellLocked(key)) {
      return;
    }

    const [r, c] = key.split("-").map(Number);

    if (!isPlayableCell(r, c)) {
      return;
    }

    const letter = String(active.id).replace("letter-", "");

    setUserGrid((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[r][c] = letter;

      return updated;
    });

    /*
      تعديل نفس الخلية:
      شيل X عنها فقط
    */

    setWrongCells((prev) => prev.filter((cellKey) => cellKey !== key));
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    const playableKeys = Object.keys(correctMap);

    const hasEmpty = playableKeys.some((key) => {
      if (lockedCells.includes(key)) {
        return false;
      }

      const [r, c] = key.split("-").map(Number);

      return !userGrid[r][c];
    });

    if (hasEmpty) {
      ValidationAlert.info(
        `<div style="font-size:20px;text-align:center;">
          Please fill all cells before checking.
        </div>`,
      );

      return;
    }

    const nextLocked = [...lockedCells];

    const wrong = [];

    let correctCount = 0;

    playableKeys.forEach((key) => {
      const [r, c] = key.split("-").map(Number);

      /*
          صح من Check سابق
        */

      if (lockedCells.includes(key)) {
        correctCount++;

        return;
      }

      if (userGrid[r][c] === correctMap[key]) {
        correctCount++;

        if (!nextLocked.includes(key)) {
          nextLocked.push(key);
        }
      } else {
        wrong.push(key);
      }
    });

    setLockedCells(nextLocked);

    setWrongCells(wrong);

    setKeyboardPickedLetter(null);

    setKeyboardFocusKey(null);

    const total = playableKeys.length;

    const completed = correctCount === total;

    if (completed) {
      setLockedCells(playableKeys);

      setWrongCells([]);

      setAllCompleted(true);
    }

    const color = completed ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (completed) {
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

  const handleShowAnswers = () => {
    const updated = createInitialGrid();

    Object.entries(correctMap).forEach(([key, letter]) => {
      const [r, c] = key.split("-").map(Number);

      updated[r][c] = letter;
    });

    setUserGrid(updated);

    setLockedCells(Object.keys(correctMap));

    setWrongCells([]);

    setShowAnswerMode(true);

    setAllCompleted(true);

    setKeyboardPickedLetter(null);

    setKeyboardFocusKey(null);

    setActiveLetter(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setUserGrid(createInitialGrid());

    setWrongCells([]);

    setLockedCells([]);

    setShowAnswerMode(false);

    setAllCompleted(false);

    setKeyboardPickedLetter(null);

    setKeyboardFocusKey(null);

    setActiveLetter(null);
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
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall mb-10"
          style={{
            gap: "10px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="A"
            title="Look and complete the puzzle."
            subTitle="Use each picture clue to complete the feeling words in the puzzle."
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

              flexWrap: "wrap",

              justifyContent: "center",
            }}
          >
            {LETTERS.map((letter) => (
              <LetterChip
                key={letter}
                letter={letter}
                keyboardPickedLetter={keyboardPickedLetter}
                onKeyboardPick={handleKeyboardPick}
                registerRef={registerLetterRef}
              />
            ))}
          </div>

          {/* =================================================
              IMAGES + CROSSWORD
          ================================================= */}

          <div className="grid-container-review7-p1-q1">
            {/* =================================================
                IMAGE CLUES
            ================================================= */}

            <div className="puzzle-images-box-review7-p1-q1">
              {/* DOWN */}

              <div className="column-box-review7-p1-q1">
                <h4 className="label">Down</h4>

                {DOWN_IMAGES.map((item) => (
                  <div key={item.number} className="img-item-review7-p1-q1">
                    <span className="num">{item.number}</span>

                    <img src={item.src} alt={item.alt} />
                  </div>
                ))}
              </div>

              {/* ACROSS */}

              <div className="column-box-review7-p1-q1">
                <h4 className="label">Across</h4>

                {ACROSS_IMAGES.map((item) => (
                  <div key={item.number} className="img-item-review7-p1-q1">
                    <span className="num">{item.number}</span>

                    <img src={item.src} alt={item.alt} />
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                CROSSWORD GRID
            ================================================= */}

            <div className="crossword-grid">
              {crosswordStructure.map((row, r) => (
                <div key={r} className="row-review7-p1-q1">
                  {row.map((cell, c) => {
                    const isBlock = cell === "B";

                    const isNumber = /[1-9]/.test(cell);

                    const key = `${r}-${c}`;

                    if (isBlock) {
                      return (
                        <div
                          key={key}
                          className="cell2 block"
                          aria-hidden="true"
                        />
                      );
                    }

                    return (
                      <CrosswordCell
                        key={key}
                        r={r}
                        c={c}
                        value={userGrid[r][c]}
                        isNumber={isNumber}
                        numberValue={isNumber ? cell : null}
                        isWrong={wrongCells.includes(key)}
                        isLocked={isCellLocked(key)}
                        keyboardPickedLetter={keyboardPickedLetter}
                        keyboardFocusKey={keyboardFocusKey}
                        onKeyboardPlace={placeKeyboardLetter}
                        onKeyboardCancel={cancelKeyboardPick}
                        onMoveKeyboardFocus={moveKeyboardFocus}
                        onSlotFocus={setKeyboardFocusKey}
                        onRemove={handleRemove}
                        registerRef={registerCellRef}
                      />
                    );
                  })}
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

          <button
            className="show-answer-btn swal-continue"
            onClick={handleShowAnswers}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* =================================================
          MOUSE DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeLetter && (
          <span className="mouse-drag-overlay-review7-p1-q1">
            {activeLetter}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
}
