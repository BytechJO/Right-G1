import React, { useRef, useState } from "react";

import "./WB_Unit2_Page2_Q1.css";

import table from "../../../assets/U1 WB/U2/U2P10EXEC-01.svg";
import dish from "../../../assets/U1 WB/U2/U2P10EXEC-02.svg";
import tiger from "../../../assets/U1 WB/U2/U2P10EXEC-03.svg";
import duck from "../../../assets/U1 WB/U2/U2P10EXEC-04.svg";

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

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

/* ======================================================
   AUDIO
====================================================== */

import audio1 from "../../../assets/U1 WB/U2/page_10/Item_001_birthday_Happy!.mp3";
import audio2 from "../../../assets/U1 WB/U2/page_10/Item_002_a_hat_party_It's.mp3";
import audio3 from "../../../assets/U1 WB/U2/page_10/Item_003_are_How_you_old.mp3";
import audio4 from "../../../assets/U1 WB/U2/page_10/Item_004_seven_I'm_years_old.mp3";

/* ======================================================
   DATA
====================================================== */

const rows = [
  {
    id: 1,
    img: table,
    alt: "A table.",
    scrambled: ["birthday", "Happy", "!"],
    audio: audio1,
  },

  {
    id: 2,
    img: dish,
    alt: "A dish.",
    scrambled: ["a", "hat", "party", "It's", "."],
    audio: audio2,
  },

  {
    id: 3,
    img: duck,
    alt: "A duck.",
    scrambled: ["are", "How", "you", "old", "?"],
    audio: audio3,
  },

  {
    id: 4,
    img: tiger,
    alt: "A tiger.",
    scrambled: ["seven", "I'm", "years", "old", "."],
    audio: audio4,
  },
];

/* ======================================================
   CORRECT SENTENCES
====================================================== */

const correctSentences = {
  1: ["Happy", "birthday", "!"],
  2: ["It's", "a", "party", "hat", "."],
  3: ["How", "old", "are", "you", "?"],
  4: ["I'm", "seven", "years", "old", "."],
};

/* ======================================================
   EMPTY
====================================================== */

const createEmptyAnswers = () => ({
  1: [],
  2: [],
  3: [],
  4: [],
});

/* ======================================================
   DRAGGABLE WORD
====================================================== */

function DraggableWord({
  id,
  word,
  disabled,
  isUsed,

  rowId,
  sourceIndex,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    data: {
      word,
      rowId,
      sourceIndex,
    },

    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked =
    keyboardPickedWord?.rowId === rowId &&
    keyboardPickedWord?.sourceIndex === sourceIndex;

  const refKey = `${rowId}-${sourceIndex}`;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);
        bankRefs.current[refKey] = el;
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
          ? `${word} selected. Press Tab to move to the answer area, then press Enter.`
          : `${word}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (isDisabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick({
            word,
            rowId,
            sourceIndex,
          });
        }
      }}
      className={isPicked ? "keyboard-picked-word-wb-u2-p2-q1" : ""}
      style={{
        padding: "2px 5px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : "white",

        fontWeight: "bold",

        cursor: isDisabled ? "default" : "grab",

        opacity: isDragging ? 0.4 : isUsed || disabled ? 0.45 : 1,

        userSelect: "none",

        touchAction: "none",

        ...(isUsed || disabled
          ? {
              borderColor: "#ccc",
              color: "#aaa",
              background: "#f5f5f5",
            }
          : {}),
      }}
    >
      {word}
    </span>
  );
}

/* ======================================================
   DROPPABLE INPUT
====================================================== */

function DroppableInput({
  id,
  rowId,

  words,

  isWrong,

  showAnswer,
  locked,
  checkCompleted,

  onRemove,

  keyboardPickedWord,

  focusedRowId,
  setFocusedRowId,

  dropRefs,

  onKeyboardDrop,

  onKeyboardClearWrong,

  onCancelKeyboardPick,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,

    disabled: showAnswer || locked || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedWord &&
    keyboardPickedWord.rowId === rowId &&
    !showAnswer &&
    !locked &&
    !checkCompleted;

  const canFixWrongRow =
    isWrong &&
    words.length > 0 &&
    !keyboardPickedWord &&
    !showAnswer &&
    !locked &&
    !checkCompleted;

  const showKeyboardPreview = keyboardDropActive && focusedRowId === rowId;

  const handleKeyDown = (e) => {
    /* ==================================================
       WRONG ROW AFTER CHECK
       ENTER -> CLEAR ROW -> RETURN TO ITS BANK
    ================================================== */

    if (canFixWrongRow && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(rowId);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* ==================================================
       ENTER = ADD PICKED WORD
    ================================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(rowId);

      return;
    }

    /* ==================================================
       ESCAPE = CANCEL PICK
    ================================================== */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();

      return;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);

          dropRefs.current[rowId] = el;
        }}
        className={`unscramble-input ${
          isOver && !showAnswer && !locked ? "drag-over-cell" : ""
        } ${showKeyboardPreview ? "keyboard-drop-active-wb-u2-p2-q1" : ""}`}
        role="button"
        tabIndex={keyboardDropActive || canFixWrongRow ? 0 : -1}
        aria-label={
          keyboardDropActive
            ? `Answer area. Press Enter or Space to add ${keyboardPickedWord.word}.`
            : canFixWrongRow
              ? "Incorrect sentence. Press Enter or Space to clear this sentence and return to the word choices."
              : "Sentence answer area"
        }
        onFocus={() => {
          if (keyboardDropActive) {
            setFocusedRowId(rowId);
          }
        }}
        onBlur={() => {
          setFocusedRowId(null);
        }}
        onKeyDown={handleKeyDown}
        style={{
          display: "flex",

          flexWrap: "wrap",

          gap: "6px",

          alignItems: "center",

          minHeight: "46px",

          padding: "6px 10px",

          cursor: canFixWrongRow ? "pointer" : "default",

          boxSizing: "border-box",
        }}
      >
        {words.map((item, index) => {
          const canReturn = !showAnswer && !locked && !checkCompleted;

          return (
            <span
              key={`${item.sourceIndex}-${index}`}
              onClick={() => {
                if (canReturn) {
                  onRemove(id, index);
                }
              }}
              title={canReturn ? "Click to return" : ""}
              style={{
                cursor: canReturn ? "pointer" : "default",

                borderRadius: "6px",

                padding: "2px 5px",

                border: canReturn
                  ? "1px solid #2c5287"
                  : "1px solid transparent",

                background: canReturn ? "#f4f8ff" : "transparent",

                transition: "all 0.2s ease",

                userSelect: "none",
              }}
            >
              {item.word}
            </span>
          );
        })}

        {/* =========================================
            KEYBOARD PREVIEW
        ========================================= */}

        {showKeyboardPreview && (
          <span
            className="keyboard-word-preview-wb-u2-p2-q1"
            aria-hidden="true"
          >
            {keyboardPickedWord.word}
          </span>
        )}
      </div>

      {isWrong && <span className="input-error-x-wb-u2-p2-q1">✕</span>}
    </div>
  );
}

/* ======================================================
   MAIN
====================================================== */

const WB_Unit2_Page2_Q1 = () => {
  /* ======================================================
     STATE
  ====================================================== */

  const [userInputs, setUserInputs] = useState(createEmptyAnswers());

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedRows, setLockedRows] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* ======================================================
     KEYBOARD DRAG
  ====================================================== */

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedRowId, setFocusedRowId] = useState(null);

  /* ======================================================
     AUDIO
  ====================================================== */

  const audioRef = useRef(null);

  const [playingRow, setPlayingRow] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingRow(null);
  };

  const playRowAudio = (row) => {
    if (!row?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(row.audio);

    audioRef.current = audio;

    setPlayingRow(row.id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    };
  };

  /* ======================================================
     HELPERS
  ====================================================== */

  const isRowLocked = (rowId) => lockedRows.includes(Number(rowId));

  /* ======================================================
     KEYBOARD PICK
  ====================================================== */

  const handleKeyboardPick = ({ word, rowId, sourceIndex }) => {
    if (showAnswer || checkCompleted || isRowLocked(rowId)) {
      return;
    }

    const alreadyUsed = userInputs[rowId].some(
      (item) => item.sourceIndex === sourceIndex,
    );

    if (alreadyUsed) {
      return;
    }

    setKeyboardPickedWord({
      word,
      rowId,
      sourceIndex,
    });

    setFocusedRowId(null);

    requestAnimationFrame(() => {
      dropRefs.current[rowId]?.focus();
    });
  };

  /* ======================================================
     KEYBOARD DROP
  ====================================================== */

  const handleKeyboardDrop = (rowId) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isRowLocked(rowId)
    ) {
      return;
    }

    if (keyboardPickedWord.rowId !== rowId) {
      return;
    }

    const { word, sourceIndex } = keyboardPickedWord;

    const alreadyUsed = userInputs[rowId].some(
      (item) => item.sourceIndex === sourceIndex,
    );

    if (alreadyUsed) {
      return;
    }

    const updatedRow = [
      ...userInputs[rowId],

      {
        word,
        sourceIndex,
      },
    ];

    const updated = {
      ...userInputs,

      [rowId]: updatedRow,
    };

    setUserInputs(updated);

    /*
      X تنشال فقط عن نفس الصف.
    */

    setWrongInputs((prev) => prev.filter((id) => id !== rowId));

    setKeyboardPickedWord(null);

    setFocusedRowId(null);

    /*
      بعد التثبيت:
      ارجع لأول كلمة غير مستخدمة
      بنفس البنك.
    */

    window.setTimeout(() => {
      const row = rows.find((item) => item.id === rowId);

      if (!row) return;

      const used = new Set(updated[rowId].map((item) => item.sourceIndex));

      const nextIndex = row.scrambled.findIndex((_, index) => !used.has(index));

      if (nextIndex !== -1) {
        bankRefs.current[`${rowId}-${nextIndex}`]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     NEW FIX PATTERN
     WRONG ROW -> ENTER -> CLEAR ROW -> RETURN BANK
  ====================================================== */

  const handleKeyboardClearWrong = (rowId) => {
    if (showAnswer || checkCompleted || isRowLocked(rowId)) {
      return;
    }

    /*
      رجع كل الكلمات للبنك.
    */

    setUserInputs((prev) => ({
      ...prev,

      [rowId]: [],
    }));

    /*
      شيل X فقط عن نفس الصف.
    */

    setWrongInputs((prev) => prev.filter((id) => id !== rowId));

    setKeyboardPickedWord(null);

    setFocusedRowId(null);

    /*
      focus لأول خيار بنفس الصف.
    */

    window.setTimeout(() => {
      bankRefs.current[`${rowId}-0`]?.focus();
    }, 0);
  };

  /* ======================================================
     CANCEL KEYBOARD PICK
  ====================================================== */

  const handleCancelKeyboardPick = () => {
    const picked = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setFocusedRowId(null);

    if (!picked) return;

    window.setTimeout(() => {
      bankRefs.current[`${picked.rowId}-${picked.sourceIndex}`]?.focus();
    }, 0);
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
     PARSE DRAG ID
  ====================================================== */

  const parseId = (id) => {
    const parts = String(id).split("-");

    return {
      sentenceId: Number(parts[1]),

      sourceIndex: Number(parts[parts.length - 1]),
    };
  };

  /* ======================================================
     DRAG START
  ====================================================== */

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  /* ======================================================
     DRAG END
  ====================================================== */

  const handleDragEnd = (event) => {
    setActiveId(null);

    const { active, over } = event;

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("blank-")) {
      return;
    }

    const { sentenceId, sourceIndex } = parseId(active.id);

    const targetSentence = Number(String(over.id).replace("blank-", ""));

    /*
      كلمات كل row تروح
      لنفس row فقط.
    */

    if (sentenceId !== targetSentence) {
      return;
    }

    if (isRowLocked(targetSentence)) {
      return;
    }

    const row = rows.find((item) => item.id === sentenceId);

    if (!row) return;

    const word = row.scrambled[sourceIndex];

    const alreadyUsed = userInputs[targetSentence].some(
      (item) => item.sourceIndex === sourceIndex,
    );

    if (alreadyUsed) {
      return;
    }

    setUserInputs((prev) => ({
      ...prev,

      [targetSentence]: [
        ...prev[targetSentence],

        {
          word,
          sourceIndex,
        },
      ],
    }));

    setWrongInputs((prev) => prev.filter((id) => id !== targetSentence));
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  /* ======================================================
     CLEAR ONE WORD WITH MOUSE
  ====================================================== */

  const handleClear = (cellId, answerIndex) => {
    const sentenceId = Number(String(cellId).replace("blank-", ""));

    if (showAnswer || checkCompleted || isRowLocked(sentenceId)) {
      return;
    }

    setUserInputs((prev) => {
      const updated = [...prev[sentenceId]];

      updated.splice(answerIndex, 1);

      return {
        ...prev,

        [sentenceId]: updated,
      };
    });

    setWrongInputs((prev) => prev.filter((id) => id !== sentenceId));
  };

  /* ======================================================
     CHECK
  ====================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const allCompleted = rows.every(
      (row) => userInputs[row.id].length === row.scrambled.length,
    );

    if (!allCompleted) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");

      return;
    }

    let correctCount = 0;

    const wrongTemp = [];

    const correctTemp = [];

    rows.forEach((row) => {
      const userSentence = userInputs[row.id].map((item) => item.word);

      const correct = correctSentences[row.id];

      const isCorrect =
        userSentence.length === correct.length &&
        userSentence.every((word, index) => word === correct[index]);

      if (isCorrect) {
        correctCount++;

        correctTemp.push(row.id);
      } else {
        wrongTemp.push(row.id);
      }
    });

    /* LOCK CORRECT ONLY */

    setLockedRows((prev) => Array.from(new Set([...prev, ...correctTemp])));

    /* WRONG ONLY */

    setWrongInputs(wrongTemp);

    setKeyboardPickedWord(null);

    setFocusedRowId(null);

    const total = rows.length;

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
      setLockedRows(rows.map((row) => row.id));

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

  /* ======================================================
     SHOW ANSWER
  ====================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    const finalAnswers = {};

    rows.forEach((row) => {
      finalAnswers[row.id] = correctSentences[row.id].map((word, index) => ({
        word,

        sourceIndex: 100 + index,
      }));
    });

    setUserInputs(finalAnswers);

    setWrongInputs([]);

    setLockedRows(rows.map((row) => row.id));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedRowId(null);
  };

  /* ======================================================
     RESET
  ====================================================== */

  const handleReset = () => {
    stopAudio();

    setUserInputs(createEmptyAnswers());

    setWrongInputs([]);

    setLockedRows([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setFocusedRowId(null);
  };

  /* ======================================================
     ACTIVE WORD
  ====================================================== */

  let activeWord = null;

  if (activeId) {
    const { sentenceId, sourceIndex } = parseId(activeId);

    const row = rows.find((item) => item.id === sentenceId);

    activeWord = row?.scrambled[sourceIndex] ?? null;
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <DndContext
      sensors={sensors}
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
          <ExerciseHeader
            sectionLetter="C"
            title="Unscramble and write."
            subTitle="Start with the capital word and finish with the correct punctuation."
          />

          <div className="container12 w-full">
            {rows.map((row, index) => {
              const rowLocked = isRowLocked(row.id);

              const isPlaying = playingRow === row.id;

              const usedIndexes = new Set(
                userInputs[row.id].map((item) => item.sourceIndex),
              );

              return (
                <div key={row.id} className="matching-row2 w-full">
                  <div
                    style={{
                      display: "flex",

                      width: "100%",

                      justifyContent: "space-between",
                    }}
                  >
                    {/* IMAGE */}

                    <div className="img-with-dot2">
                      <span className="span-num2">{index + 1}</span>

                      <img
                        src={row.img}
                        alt={row.alt}
                        style={{
                          height: "100px",

                          width: "auto",
                        }}
                      />
                    </div>

                    {/* SCRAMBLED + BANK */}

                    <div className="word-with-dot2-wb-u2-p2-q1">
                      <div className="word-bank-container-wb-u2-p2-q1">
                        {/* AUDIO */}

                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`Play scrambled words for sentence ${row.id}`}
                          onClick={() => playRowAudio(row)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              playRowAudio(row);
                            }
                          }}
                          style={{
                            position: "relative",

                            display: "inline-block",

                            cursor: "pointer",

                            border: "2px solid transparent",

                            borderRadius: "8px",

                            padding: "4px 6px",
                          }}
                        >
                          <span className="word-text2-wb-u2-p2-q1">
                            {row.scrambled.join(" ")}
                          </span>

                          {isPlaying && (
                            <FaVolumeUp
                              size={17}
                              aria-hidden="true"
                              style={{
                                position: "absolute",

                                top: "-8px",

                                right: "-8px",

                                background: "white",

                                borderRadius: "50%",

                                padding: "2px",

                                zIndex: 5,

                                pointerEvents: "none",
                              }}
                            />
                          )}
                        </div>

                        {/* BANK */}

                        <div
                          style={{
                            display: "flex",

                            gap: "10px",

                            padding: "10px",

                            border: "2px dashed #ccc",

                            borderRadius: "10px",

                            alignItems: "center",

                            width: "300px",

                            justifyContent: "center",

                            flexWrap: "wrap",
                          }}
                        >
                          {row.scrambled.map((word, i) => (
                            <DraggableWord
                              key={`${row.id}-${word}-${i}`}
                              id={`row-${row.id}-word-${i}`}
                              word={word}
                              rowId={row.id}
                              sourceIndex={i}
                              disabled={
                                showAnswer || checkCompleted || rowLocked
                              }
                              isUsed={usedIndexes.has(i)}
                              keyboardPickedWord={keyboardPickedWord}
                              onKeyboardPick={handleKeyboardPick}
                              bankRefs={bankRefs}
                            />
                          ))}
                        </div>
                      </div>

                      {/* DROP ANSWER */}

                      <DroppableInput
                        id={`blank-${row.id}`}
                        rowId={row.id}
                        words={userInputs[row.id]}
                        isWrong={wrongInputs.includes(row.id)}
                        showAnswer={showAnswer}
                        locked={rowLocked}
                        checkCompleted={checkCompleted}
                        onRemove={handleClear}
                        keyboardPickedWord={keyboardPickedWord}
                        focusedRowId={focusedRowId}
                        setFocusedRowId={setFocusedRowId}
                        dropRefs={dropRefs}
                        onKeyboardDrop={handleKeyboardDrop}
                        onKeyboardClearWrong={handleKeyboardClearWrong}
                        onCancelKeyboardPick={handleCancelKeyboardPick}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BUTTONS */}

        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
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

      {/* DRAG OVERLAY */}

      <DragOverlay>
        {activeWord && (
          <span
            style={{
              padding: "2px 5px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              cursor: "grabbing",

              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {activeWord}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit2_Page2_Q1;
