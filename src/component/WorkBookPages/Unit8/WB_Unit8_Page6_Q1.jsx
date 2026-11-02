import React, { useEffect, useRef, useState } from "react";
import "./WB_Unit8_Page6_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import img1 from "../../../assets/U1 WB/U8/U8P50EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P50EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U8/U8P50EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U8/U8P50EXEA-04.svg";
import sunAudio from "../../../assets/U1 WB/U8/audio/page 50 - A/Item_002_sun.mp3";
import zebraAudio from "../../../assets/U1 WB/U8/audio/page 50 - A/Item_003_zebra.mp3";
import sockAudio from "../../../assets/U1 WB/U8/audio/page 50 - A/Item_005_sock.mp3";
import zipperAudio from "../../../assets/U1 WB/U8/audio/page 50 - A/Item_006_zipper.mp3";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    img: img1,
    alt: "A zebra.",
    scrambled: "beazr",
    answer: "z",
    pattern: "ebra",
    word: "zebra",
    audio: zebraAudio,
  },
  {
    img: img2,
    alt: "A sock.",
    scrambled: "ksoc",
    answer: "s",
    pattern: "ock",
    word: "sock",
    audio: sockAudio,
  },
  {
    img: img3,
    alt: "A zipper.",
    scrambled: "perpzi",
    answer: "z",
    pattern: "ipper",
    word: "zipper",
    audio: zipperAudio,
  },
  {
    img: img4,
    alt: "The sun.",
    scrambled: "ozo",
    answer: "s",
    pattern: "un",
    word: "sun",
    audio: sunAudio,
  },
];

const lettersBank = [
  { id: "letter-z", value: "z" },
  { id: "letter-s", value: "s" },
];

/* =====================================================
   DRAGGABLE LETTER
===================================================== */

function DraggableLetter({
  item,
  selectedLetterId,
  onKeyboardSelect,
  bankRefs,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: {
      value: item.value,
    },
  });

  const selected = selectedLetterId === item.id;

  const setRefs = (node) => {
    setNodeRef(node);

    bankRefs.current[item.id] = node;
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    onKeyboardSelect(item.id);
  };

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={
        selected
          ? `Letter ${item.value} selected. Tab through the answer blanks and press Enter or Space to place it.`
          : `Letter ${item.value}. Press Enter or Space to select it.`
      }
      onKeyDown={handleKeyDown}
      className={`
        wb-u8-p6-q1-letter
        ${selected ? "wb-u8-p6-q1-letter-selected" : ""}
      `}
      style={{
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {item.value}
    </div>
  );
}

/* =====================================================
   DROPPABLE CELL
===================================================== */

function DroppableCell({
  index,
  value,
  isWrong,
  isLocked,
  selectedLetterId,
  selectedLetterValue,
  keyboardFocusIndex,
  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,
  onSlotFocus,
  onClear,
  slotRefs,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${index}`,
    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(selectedLetterId) && keyboardFocusIndex === index && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    slotRefs.current[index] = node;
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    /* =========================
       TAB / SHIFT+TAB
    ========================= */

    if (selectedLetterId && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(index, e.shiftKey);

      return;
    }

    /* =========================
       ENTER / SPACE
    ========================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      if (selectedLetterId) {
        onKeyboardPlace(index);

        return;
      }

      if (value) {
        onClear(index);
      }

      return;
    }

    /* =========================
       ESCAPE
    ========================= */

    if (selectedLetterId && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div
      ref={setRefs}
      role="button"
      tabIndex={isLocked ? -1 : selectedLetterId ? 0 : value ? 0 : -1}
      aria-disabled={isLocked}
      aria-label={
        isLocked
          ? `Letter ${value}. Correct and locked.`
          : isKeyboardTarget
            ? `Blank ${index + 1}. Letter ${selectedLetterValue} preview. Press Enter or Space to place it.`
            : value
              ? `Letter ${value}. Press Enter or Space to remove it.`
              : `Empty blank ${index + 1}. Select a letter first.`
      }
      onFocus={() => {
        if (selectedLetterId && !isLocked) {
          onSlotFocus(index);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (!isLocked && value && !selectedLetterId) {
          onClear(index);
        }
      }}
      className={`
        text-input

        ${isOver ? "drag-over-cell" : ""}

        ${isKeyboardTarget ? "keyboard-preview-wb-u8-p6-q1" : ""}
      `}
      style={{
        background: isOver && !isLocked ? "#e3f2fd" : "white",

        fontSize: "25px",

        fontWeight: "600",

        position: "relative",

        cursor: !isLocked && value ? "pointer" : "default",
      }}
    >
      {isKeyboardTarget ? selectedLetterValue : value}

      {isWrong && (
        <span className="error-icon" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
}

/* =====================================================
   MAIN
===================================================== */

const WB_Unit8_Page6_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(""));
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

  const playCorrectAudio = (index) => {
    const isCorrect = showAnswerMode || results[index] === "correct";

    if (!isCorrect) return;

    const item = data[index];

    if (!item.audio) return;

    stopAudio();

    const audio = new Audio(item.audio);

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

    audio.onerror = audio.onended;
  };
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  /*
    null | correct | wrong
  */
  const [results, setResults] = useState(Array(data.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =================================================
     KEYBOARD DRAG
  ================================================= */

  const [selectedLetterId, setSelectedLetterId] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  /* =================================================
     DND
  ================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  /* =================================================
     HELPERS
  ================================================= */

  const isCellLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const allCorrect = results.every((result) => result === "correct");

  const editableSlots = () =>
    data.map((_, index) => index).filter((index) => !isCellLocked(index));

  const selectedLetter = lettersBank.find(
    (item) => item.id === selectedLetterId,
  );

  const activeValue = activeId
    ? lettersBank.find((item) => item.id === activeId)?.value
    : null;

  /* =================================================
     KEYBOARD SELECT
  ================================================= */

  const handleKeyboardSelect = (id) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setSelectedLetterId(id);

    const available = editableSlots();

    if (!available.length) {
      return;
    }

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      slotRefs.current[firstIndex]?.focus?.();
    });
  };

  /* =================================================
     TAB BETWEEN UNLOCKED INPUTS
  ================================================= */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableSlots();

    if (!available.length) {
      return;
    }

    const position = available.indexOf(currentIndex);

    let nextPosition;

    if (backwards) {
      nextPosition = position <= 0 ? available.length - 1 : position - 1;
    } else {
      nextPosition =
        position === -1 || position === available.length - 1 ? 0 : position + 1;
    }

    const nextIndex = available[nextPosition];

    setKeyboardFocusIndex(nextIndex);

    requestAnimationFrame(() => {
      slotRefs.current[nextIndex]?.focus?.();
    });
  };

  /* =================================================
     KEYBOARD PLACE
  ================================================= */

  const handleKeyboardPlace = (index) => {
    if (!selectedLetterId || isCellLocked(index)) {
      return;
    }

    const selected = lettersBank.find((item) => item.id === selectedLetterId);

    if (!selected) return;

    setInputs((prev) => {
      const copy = [...prev];

      copy[index] = selected.value;

      return copy;
    });

    setResults((prev) => {
      const copy = [...prev];

      if (copy[index] === "wrong") {
        copy[index] = null;
      }

      return copy;
    });

    const previousLetterId = selectedLetterId;

    setSelectedLetterId(null);

    setKeyboardFocusIndex(null);

    /*
      لأن z و s قابلين لإعادة الاستخدام،
      نرجع لأول حرف بالبنك دائمًا.
    */

    requestAnimationFrame(() => {
      bankRefs.current[lettersBank[0].id]?.focus?.();
    });
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const handleKeyboardCancel = () => {
    if (!selectedLetterId) {
      return;
    }

    const oldId = selectedLetterId;

    setSelectedLetterId(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      bankRefs.current[oldId]?.focus?.();
    });
  };

  /* =================================================
     CLEAR CELL
  ================================================= */

  const handleClearCell = (index) => {
    if (isCellLocked(index)) {
      return;
    }

    setInputs((prev) => {
      const copy = [...prev];

      copy[index] = "";

      return copy;
    });

    setResults((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });
  };

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const handleDragStart = ({ active }) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setActiveId(String(active.id));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswerMode || allCorrect) {
      return;
    }

    const destId = String(over.id);

    if (!destId.startsWith("drop-")) {
      return;
    }

    const targetIndex = Number(destId.replace("drop-", ""));

    if (Number.isNaN(targetIndex) || isCellLocked(targetIndex)) {
      return;
    }

    const letter = active.data.current?.value ?? "";

    setInputs((prev) => {
      const copy = [...prev];

      copy[targetIndex] = letter;

      return copy;
    });

    setResults((prev) => {
      const copy = [...prev];

      if (copy[targetIndex] === "wrong") {
        copy[targetIndex] = null;
      }

      return copy;
    });
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    const hasEmpty = data.some(
      (_, index) => results[index] !== "correct" && !inputs[index],
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the answers before checking.",
      );

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    data.forEach((item, index) => {
      /*
          already correct stays locked
        */

      if (results[index] === "correct") {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (inputs[index].toLowerCase() === item.answer) {
        nextResults[index] = "correct";

        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    setSelectedLetterId(null);

    setKeyboardFocusIndex(null);

    const total = data.length;

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
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    setInputs(data.map((item) => item.answer));

    setResults(Array(data.length).fill("correct"));

    setShowAnswerMode(true);

    setSelectedLetterId(null);

    setKeyboardFocusIndex(null);

    setActiveId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    setInputs(Array(data.length).fill(""));

    setResults(Array(data.length).fill(null));

    setShowAnswerMode(false);

    setSelectedLetterId(null);

    setKeyboardFocusIndex(null);

    setActiveId(null);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
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
          className="div-forall"
          style={{
            gap: "10px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            title="Write the missing letters. Say the words."
            subTitle="Say each word and drag z or s into the blank."
          />

          {/* =================================================
              LETTER BANK
          ================================================= */}

          <div className="wb-u8-p6-q1-letter-bank">
            {lettersBank.map((item) => (
              <DraggableLetter
                key={item.id}
                item={item}
                selectedLetterId={selectedLetterId}
                onKeyboardSelect={handleKeyboardSelect}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="unscramble-row-wb-unit8-p6-q1">
            {data.map((item, index) => (
              <div
                className={`unscramble-box ${
                  isCellLocked(index) ? "correct-audio-card-wb-u8-p6-q1" : ""
                }`}
                key={index}
                role={isCellLocked(index) ? "button" : undefined}
                tabIndex={isCellLocked(index) ? 0 : undefined}
                aria-label={
                  isCellLocked(index)
                    ? `${item.word}. Correct answer. Press Enter or Space to hear the word.`
                    : undefined
                }
                onClick={() => {
                  if (isCellLocked(index)) {
                    playCorrectAudio(index);
                  }
                }}
                onKeyDown={(e) => {
                  if (!isCellLocked(index)) return;

                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();

                    playCorrectAudio(index);
                  }
                }}
              >
                {" "}
                <div className="img-box">
                  <img src={item.img} alt={item.alt} />
                </div>
                <div className="input-row">
                  <span
                    className="num"
                    style={{
                      fontSize: "25px",

                      fontWeight: "600",
                    }}
                  >
                    {index + 1}
                  </span>

                  <div className="input-wrapper">
                    <DroppableCell
                      index={index}
                      value={inputs[index]}
                      isWrong={results[index] === "wrong"}
                      isLocked={isCellLocked(index)}
                      selectedLetterId={selectedLetterId}
                      selectedLetterValue={selectedLetter?.value || ""}
                      keyboardFocusIndex={keyboardFocusIndex}
                      onKeyboardPlace={handleKeyboardPlace}
                      onKeyboardCancel={handleKeyboardCancel}
                      onMoveKeyboardFocus={moveKeyboardFocus}
                      onSlotFocus={setKeyboardFocusIndex}
                      onClear={handleClearCell}
                      slotRefs={slotRefs}
                    />
                  </div>

                  <span
                    className="pattern"
                    style={{
                      fontSize: "22px",
                    }}
                  >
                    {item.pattern}
                  </span>
                </div>
                {isCellLocked(index) && playingIndex === index && (
                  <FaVolumeUp
                    className="correct-audio-icon-wb-u8-p6-q1"
                    aria-hidden="true"
                  />
                )}
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
        {activeValue ? (
          <div className="wb-u8-p6-q1-drag-overlay">{activeValue}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page6_Q1;
