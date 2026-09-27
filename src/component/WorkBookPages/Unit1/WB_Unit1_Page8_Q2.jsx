import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page8_Q2.css";
import tableAudio from "../../../assets/U1 WB/U1/page_8_2/Item_003_table.mp3";
import dishAudio from "../../../assets/U1 WB/U1/page_8_2/Item_004_dish.mp3";
import duckAudio from "../../../assets/U1 WB/U1/page_8_2/Item_005_duck.mp3";
import tigerAudio from "../../../assets/U1 WB/U1/page_8_2/Item_006_tiger.mp3";
import taxiAudio from "../../../assets/U1 WB/U1/page_8_2/Item_001_taxi.mp3";
import deerAudio from "../../../assets/U1 WB/U1/page_8_2/Item_002_deer.mp3";
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

// ======================================================
// DATA
// ======================================================

const wordOptions = [
  {
    word: "table",
    audio: tableAudio,
  },
  {
    word: "dish",
    audio: dishAudio,
  },
  {
    word: "duck",
    audio: duckAudio,
  },
  {
    word: "tiger",
    audio: tigerAudio,
  },
  {
    word: "taxi",
    audio: taxiAudio,
  },
  {
    word: "deer",
    audio: deerAudio,
  },
];

const correctWords = wordOptions.map((item) => item.word);
// ======================================================
// WORD BANK ITEM
// ======================================================

function BankWord({
  word,
  id,
  isUsed,
  disabled,
  selectedWordId,
  onSelect,
  registerRef,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed || disabled,
  });

  const isSelected = selectedWordId === id;

  const anotherWordSelected = selectedWordId && selectedWordId !== id;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isUsed || disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onSelect(id);
    }
  };

  return (
    <span
      ref={setRefs}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={isUsed || disabled || anotherWordSelected ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={
        isSelected
          ? `${word}. Selected. Use Tab to choose a box.`
          : `${word}. Press Enter or Space to select.`
      }
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isUsed || disabled || isDragging) {
          return;
        }

        e.stopPropagation();

        onSelect(id);
      }}
      className={`bank-word-wb-u1-p8-q2 ${
        isSelected ? "bank-word-selected-wb-u1-p8-q2" : ""
      } ${isUsed ? "bank-word-used-wb-u1-p8-q2" : ""}`}
    >
      {word}
    </span>
  );
}

// ======================================================
// DROP CELL
// ======================================================

function DroppableCell({
  id,
  value,
  isWrong,
  showAnswer,
  locked,

  selectedWord,
  selectedWordId,

  activeWord,

  onKeyboardDrop,
  onClear,

  registerDropRef,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const [isFocused, setIsFocused] = useState(false);

  const isKeyboardTarget = Boolean(selectedWordId) && isFocused;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerDropRef) {
      registerDropRef(id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (showAnswer || locked) {
      return;
    }

    // في كلمة مختارة
    if (selectedWordId && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(id);

      return;
    }

    // ما في كلمة مختارة
    // والخانة فيها كلمة
    if (!selectedWordId && value && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onClear(id, value);
    }
  };

  return (
    <div className="drop-cell-wrapper-wb-u1-p8-q2">
      <div
        ref={setRefs}
        role="button"
        tabIndex={
          showAnswer || locked ? -1 : selectedWordId ? 0 : value ? 0 : -1
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (value && !selectedWordId && !showAnswer && !locked) {
            onClear(id, value);
          }
        }}
        aria-label={
          selectedWordId
            ? `Answer box. Press Enter or Space to place ${selectedWord}.`
            : value
              ? `${value}. Press Enter or Space to return it to the word bank.`
              : "Empty answer box."
        }
        className={`
          missing-input-wb-unit1-p8-q2
          ${isOver ? "drag-over-cell" : ""}
          ${isKeyboardTarget ? "keyboard-target-wb-u1-p8-q2" : ""}
        `}
      >
        {/* القيمة الفعلية */}

        {value && <span>{value}</span>}

        {/* Keyboard preview */}

        {isKeyboardTarget && selectedWord && (
          <span className="keyboard-preview-wb-u1-p8-q2" aria-hidden="true">
            {selectedWord}
          </span>
        )}

        {/* Mouse drag preview */}

        {!selectedWordId && isOver && activeWord && !value && (
          <span className="mouse-preview-wb-u1-p8-q2">{activeWord}</span>
        )}
      </div>

      {isWrong && value.trim() !== "" && (
        <span className="wrong-x-circle-wb-u1-p8-q2">✕</span>
      )}
    </div>
  );
}

// ======================================================
// MAIN
// ======================================================

export default function WB_Unit1_Page8_Q2() {
  const [columnD, setColumnD] = useState(["", "", ""]);

  const [columnT, setColumnT] = useState(["", "", ""]);

  const [wrong, setWrong] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [locked, setLocked] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  const [selectedWordId, setSelectedWordId] = useState(null);

  const [announcement, setAnnouncement] = useState("");
  const audioRef = useRef(null);

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  };

  const playWordAudio = (word) => {
    const item = wordOptions.find((option) => option.word === word);

    if (!item?.audio) return;

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    audio.play().catch(() => {});

    audio.onended = () => {
      audioRef.current = null;
    };
  };
  // ======================================================
  // REFS
  // ======================================================

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  const registerBankRef = (id, node) => {
    if (node) {
      bankRefs.current[id] = node;
    } else {
      delete bankRefs.current[id];
    }
  };

  const registerDropRef = (id, node) => {
    if (node) {
      dropRefs.current[id] = node;
    } else {
      delete dropRefs.current[id];
    }
  };

  // ======================================================
  // USED WORDS
  // ======================================================

  const usedWords = [...columnD, ...columnT].filter((word) => word !== "");

  // ======================================================
  // DND SENSORS
  // ======================================================

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

  // ======================================================
  // PARSE WORD
  // ======================================================

  const parseWord = (id) => String(id).split("-").slice(1, -1).join("-");

  const selectedWord = selectedWordId ? parseWord(selectedWordId) : null;

  // ======================================================
  // DRAG START
  // ======================================================

  const handleDragStart = (event) => {
    const word = parseWord(event.active.id);

    setActiveWord(word);
  };

  // ======================================================
  // DRAG END
  // ======================================================

  const handleDragEnd = (event) => {
    setActiveWord(null);

    const { active, over } = event;

    if (!over || showAnswer || locked) {
      return;
    }

    const word = parseWord(active.id);

    const [col, idx] = String(over.id).split("-");

    const index = Number(idx);

    if (col !== "d" && col !== "t") {
      return;
    }

    let newColumnD = [...columnD];

    let newColumnT = [...columnT];

    // شيل الكلمة من مكانها القديم
    newColumnD = newColumnD.map((value) => (value === word ? "" : value));

    newColumnT = newColumnT.map((value) => (value === word ? "" : value));

    // ضعها بالمكان الجديد
    if (col === "d") {
      newColumnD[index] = word;
    }

    if (col === "t") {
      newColumnT[index] = word;
    }

    setColumnD(newColumnD);

    setColumnT(newColumnT);

    setWrong([]);
  };

  // ======================================================
  // SELECT WORD WITH KEYBOARD / CLICK
  // ======================================================

  const handleWordSelect = (id) => {
    if (locked || showAnswer) return;

    const word = parseWord(id);

    // 🔊 صوت الكلمة
    playWordAudio(word);

    setSelectedWordId(id);

    setAnnouncement(
      `${word} selected. Use Tab to choose a box, then press Enter.`,
    );
  };
  // ======================================================
  // KEYBOARD DROP
  // ======================================================

  const handleKeyboardDrop = (cellId) => {
    if (!selectedWordId || showAnswer || locked) {
      return;
    }

    const word = parseWord(selectedWordId);

    const [col, idx] = cellId.split("-");

    const index = Number(idx);

    let newColumnD = [...columnD];

    let newColumnT = [...columnT];

    // شيل نفس الكلمة من أي مكان قديم
    newColumnD = newColumnD.map((value) => (value === word ? "" : value));

    newColumnT = newColumnT.map((value) => (value === word ? "" : value));

    // ضعها
    if (col === "d") {
      newColumnD[index] = word;
    }

    if (col === "t") {
      newColumnT[index] = word;
    }

    setColumnD(newColumnD);

    setColumnT(newColumnT);

    setWrong([]);

    setSelectedWordId(null);

    setAnnouncement(`${word} placed in column ${col}.`);

    // =========================================
    // رجع لأول كلمة غير مستخدمة
    // =========================================

    window.setTimeout(() => {
      const currentUsed = [...newColumnD, ...newColumnT].filter(Boolean);

      for (let i = 0; i < correctWords.length; i++) {
        const nextWord = correctWords[i];

        if (currentUsed.includes(nextWord)) {
          continue;
        }

        const nextId = `bank-${nextWord}-${i}`;

        const element = bankRefs.current[nextId];

        if (element) {
          element.focus();

          return;
        }
      }
    }, 0);
  };

  // ======================================================
  // CLEAR CELL
  // ======================================================

  const handleClear = (cellId, word) => {
    if (locked || showAnswer) {
      return;
    }

    const [col, idx] = cellId.split("-");

    const index = Number(idx);

    if (col === "d") {
      const updated = [...columnD];

      updated[index] = "";

      setColumnD(updated);
    }

    if (col === "t") {
      const updated = [...columnT];

      updated[index] = "";

      setColumnT(updated);
    }

    setWrong((prev) => prev.filter((item) => item !== word));

    // رجع focus للكلمة بالبنك
    window.setTimeout(() => {
      const wordIndex = correctWords.findIndex((item) => item === word);

      if (wordIndex === -1) {
        return;
      }

      const id = `bank-${word}-${wordIndex}`;

      bankRefs.current[id]?.focus();
    }, 0);
  };

  // ======================================================
  // CHECK
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || locked) {
      return;
    }

    const allInputs = [...columnD, ...columnT];

    const hasEmpty = allInputs.some((word) => word.trim() === "");

    if (hasEmpty) {
      return ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
    }

    const wrongWords = [];

    // d column
    columnD.forEach((word) => {
      if (!correctWords.includes(word) || !word.startsWith("d")) {
        wrongWords.push(word);
      }
    });

    // t column
    columnT.forEach((word) => {
      if (!correctWords.includes(word) || !word.startsWith("t")) {
        wrongWords.push(word);
      }
    });

    setWrong(wrongWords);

    setLocked(true);

    setSelectedWordId(null);

    const total = correctWords.length;

    const correctCount = total - wrongWords.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      ValidationAlert.success(msg);
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const showCorrectAnswers = () => {
    setColumnD(correctWords.filter((word) => word.startsWith("d")));

    setColumnT(correctWords.filter((word) => word.startsWith("t")));

    setWrong([]);

    setShowAnswer(true);

    setLocked(true);

    setSelectedWordId(null);
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    setColumnD(["", "", ""]);

    setColumnT(["", "", ""]);

    setWrong([]);

    setShowAnswer(false);

    setLocked(false);

    setActiveWord(null);

    setSelectedWordId(null);

    setAnnouncement("Activity reset.");
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <>
      <style>
        {`
          @keyframes keyboardDropPulseP8 {
            0% {
              opacity: 0.4;
              transform: scale(0.96);
              border-color: #93c5fd;
            }

            100% {
              opacity: 1;
              transform: scale(1);
              border-color: #2563eb;
            }
          }
        `}
      </style>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="page8-wrapper"
          style={{
            padding: "30px",
          }}
        >
          {/* Screen reader */}

          <div className="sr-only" role="status" aria-live="polite">
            {announcement}
          </div>

          <div className="div-forall">
            <h3 className="header-title-page8">
              <span className="ex-A">B</span>
              Drag and drop the words.
            </h3>

            {/* ===================================
                WORD BANK
            =================================== */}

            <div className="word-bank-wb-u1-p8-q2">
              {correctWords.map((word, index) => {
                const id = `bank-${word}-${index}`;

                return (
                  <BankWord
                    key={id}
                    id={id}
                    word={word}
                    isUsed={usedWords.includes(word)}
                    disabled={locked || showAnswer}
                    selectedWordId={selectedWordId}
                    onSelect={handleWordSelect}
                    registerRef={registerBankRef}
                  />
                );
              })}
            </div>

            {/* ===================================
                TABLE
            =================================== */}

            <div className="table-div-wb-u1-p8-q2 w-full">
              <table className="sorting-table-wb-u1-p8-q2">
                <thead>
                  <tr>
                    <th>d</th>

                    <th>t</th>
                  </tr>
                </thead>

                <tbody>
                  {[0, 1, 2].map((row) => (
                    <tr key={row}>
                      <td>
                        <DroppableCell
                          id={`d-${row}`}
                          value={columnD[row]}
                          isWrong={
                            wrong.includes(columnD[row]) && columnD[row] !== ""
                          }
                          showAnswer={showAnswer}
                          locked={locked}
                          selectedWord={selectedWord}
                          selectedWordId={selectedWordId}
                          activeWord={activeWord}
                          onKeyboardDrop={handleKeyboardDrop}
                          onClear={handleClear}
                          registerDropRef={registerDropRef}
                        />
                      </td>

                      <td>
                        <DroppableCell
                          id={`t-${row}`}
                          value={columnT[row]}
                          isWrong={
                            wrong.includes(columnT[row]) && columnT[row] !== ""
                          }
                          showAnswer={showAnswer}
                          locked={locked}
                          selectedWord={selectedWord}
                          selectedWordId={selectedWordId}
                          activeWord={activeWord}
                          onKeyboardDrop={handleKeyboardDrop}
                          onClear={handleClear}
                          registerDropRef={registerDropRef}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================================
              BUTTONS
          =================================== */}

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
              Check Answer ✓
            </button>
          </div>
        </div>

        {/* ===================================
            DRAG OVERLAY
        =================================== */}

        <DragOverlay>
          {activeWord && (
            <span className="drag-overlay-word-wb-u1-p8-q2">{activeWord}</span>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}
