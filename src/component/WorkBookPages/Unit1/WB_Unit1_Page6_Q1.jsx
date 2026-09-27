import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U1/SVG/U1P6EXEG-01.svg";
import img2 from "../../../assets/U1 WB/U1/SVG/U1P6EXEG-02.svg";
import img3 from "../../../assets/U1 WB/U1/SVG/U1P6EXEG-03.svg";
import img4 from "../../../assets/U1 WB/U1/SVG/U1P6EXEG-04.svg";

// ======================================================
// AUDIO
// ======================================================

import goodbyeAudio from "../../../assets/U1 WB/U1/page_4/Item_002_Goodbye!.mp3";
import goodMorningAudio from "../../../assets/U1 WB/U1/page_4/Item_004_Good_morning!.mp3";
import goodAfternoonAudio from "../../../assets/U1 WB/U1/page_4/Item_003_Good_afternoon!.mp3";
import HowAreYouAudio from "../../../assets/U1 WB/U1/page_5/Item_001_How_are_you.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import "./WB_Unit1_Page6_Q1.css";

// ======================================================
// QUESTIONS
// الصور + الإجابات الصحيحة
// ======================================================

const data = [
  {
    img: img1,
    answer: "Good morning!",
    alt: "A girl waking up in bed while a man greets her.",
  },
  {
    img: img2,
    answer: "Good afternoon!",
    alt: "A person riding a bicycle outside during the day.",
  },
  {
    img: img3,
    answer: "How are you?",
    alt: "Two boys standing outside and greeting each other.",
  },
  {
    img: img4,
    answer: "Goodbye!",
    alt: "A girl waving to two people standing at the doorway.",
  },
];

// ======================================================
// WORD BANK
// الخيارات نفسها + الصوت تبع كل خيار
// ======================================================

const options = [
  {
    word: "Good morning!",
    audio: goodMorningAudio,
  },
  {
    word: "Good afternoon!",
    audio: goodAfternoonAudio,
  },
  {
    word: "Goodbye!",
    audio: goodbyeAudio,
  },
  {
    word: "How are you?",
    audio: HowAreYouAudio,
  },
];

// ======================================================
// BANK CHIP
// ======================================================

const BankChip = ({
  id,
  word,
  isUsed,
  locked,
  selectedWordId,
  onSelect,
  registerRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed || locked,
  });

  const isSelected = selectedWordId === id;

  const anotherWordSelected = selectedWordId && !isSelected;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isUsed || locked) {
      return;
    }

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
      tabIndex={isUsed || locked || anotherWordSelected ? -1 : 0}
      aria-disabled={isUsed || locked}
      aria-pressed={isSelected}
      aria-label={
        isSelected
          ? `${word}. Selected. Use Tab to choose an answer box.`
          : `${word}. Press Enter or Space to select and hear it.`
      }
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isUsed || locked || isDragging) {
          return;
        }

        e.stopPropagation();

        onSelect(id);
      }}
      style={{
        padding: "4px 8px",

        border: `2px solid ${
          isSelected ? "#2563eb" : isUsed ? "#b0b0b0" : "#2c5287"
        }`,

        borderRadius: "8px",

        background: isSelected ? "#dbeafe" : isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        color: isUsed ? "#999" : undefined,

        cursor:
          isUsed || locked ? "not-allowed" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.35 : 1,

        transition: "all 0.15s",

        userSelect: "none",

        touchAction: "none",

        display: "inline-block",

        pointerEvents: isUsed ? "none" : undefined,

        outline: isSelected ? "3px solid #2563eb" : undefined,

        outlineOffset: "3px",
      }}
    >
      {word}
    </span>
  );
};

// ======================================================
// DROP ZONE
// ======================================================

const SlotDropZone = ({
  id,
  value,
  activeWord,
  isWrong,
  showAnswer,
  answerText,
  locked,

  selectedWord,
  selectedWordId,

  onKeyboardDrop,
  onRemove,
  registerDropRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
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

    // إذا فيه كلمة بالـslot
    if (!selectedWordId && value && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();

      e.stopPropagation();

      onRemove(id);
    }
  };

  return (
    <div className="slot-wrapper-wb-u1-p4-q1">
      <div
        ref={setRefs}
        role="button"
        tabIndex={
          showAnswer || locked ? -1 : selectedWordId ? 0 : value ? 0 : -1
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label={
          selectedWordId
            ? `Answer box. Press Enter or Space to place ${selectedWord}.`
            : value
              ? `${value}. Press Enter or Space to return it to the word bank.`
              : "Empty answer box."
        }
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (value && !selectedWordId && !locked && !showAnswer) {
            onRemove(id);
          }
        }}
        className={`missing-input-wb-unit1-p3-q1${
          isOver && !showAnswer ? " drag-over-cell" : ""
        }`}
        style={{
          flex: 1,

          minWidth: "20px",

          height: "40px",

          borderBottom: "2px solid black",

          fontSize: "20px",

          fontWeight: "600",

          display: "flex",

          alignItems: "center",

          padding: "0 8px",

          background: isKeyboardTarget
            ? "#eff6ff"
            : isOver && !showAnswer
              ? "#e3f2fd"
              : undefined,

          outline: isKeyboardTarget ? "3px solid #2563eb" : undefined,

          outlineOffset: "3px",

          cursor: isKeyboardTarget
            ? "pointer"
            : value && !locked && !showAnswer
              ? "pointer"
              : "default",

          transition: "background 0.15s, outline 0.15s",

          position: "relative",
        }}
      >
        {showAnswer ? (
          answerText
        ) : (
          <>
            {/* القيمة الموجودة فعليًا */}

            {value && <span>{value}</span>}

            {/* Keyboard Preview */}

            {isKeyboardTarget && selectedWord && (
              <span
                aria-hidden="true"
                style={{
                  marginLeft: value ? "10px" : "0",

                  padding: "3px 10px",

                  border: "2px dashed #2563eb",

                  borderRadius: "7px",

                  color: "#2563eb",

                  background: "rgba(219,234,254,0.5)",

                  animation:
                    "keyboardDropPulse 0.8s ease-in-out infinite alternate",

                  pointerEvents: "none",

                  whiteSpace: "nowrap",
                }}
              >
                {selectedWord}
              </span>
            )}

            {/* Mouse Drag Preview */}

            {!selectedWordId && isOver && activeWord && !value && (
              <span
                style={{
                  color: "#2563eb",
                }}
              >
                {activeWord}
              </span>
            )}
          </>
        )}
      </div>

      {!showAnswer && isWrong && (
        <div className="wrong-icon-wb-u1-p4-q1">✕</div>
      )}
    </div>
  );
};

// ======================================================
// MAIN
// ======================================================

export default function WB_Unit1_Page6_Q1() {
  const [inputs, setInputs] = useState(["", "", "", ""]);

  const [wrong, setWrong] = useState([false, false, false, false]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [locked, setLocked] = useState(false);

  const [activeId, setActiveId] = useState(null);

  const [selectedWordId, setSelectedWordId] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  // ======================================================
  // AUDIO
  // ======================================================

  const audioRef = useRef(null);

  const stopAudio = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;
  };

  const playWordAudio = (word) => {
    const option = options.find((item) => item.word === word);

    if (!option?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(option.audio);

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
  // DND
  // ======================================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const parseWord = (id) => String(id).split("-").slice(1, -1).join("-");

  const activeWord = activeId ? parseWord(activeId) : null;

  const selectedWord = selectedWordId ? parseWord(selectedWordId) : null;

  const isWordUsed = (word) => inputs.includes(word);

  // ======================================================
  // DRAG START
  // ======================================================

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  // ======================================================
  // DRAG END
  // ======================================================

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || locked) {
      return;
    }

    const word = parseWord(active.id);

    const destination = String(over.id);

    if (!destination.startsWith("blank-")) {
      return;
    }

    const destIndex = Number(destination.replace("blank-", ""));

    setInputs((prev) => {
      const updated = [...prev];

      // شيل نفس الخيار من مكان قديم
      updated.forEach((currentValue, index) => {
        if (currentValue === word) {
          updated[index] = "";
        }
      });

      // إذا المكان فيه كلمة ثانية
      // بتترجع للبنك تلقائيًا لأنه ما عادت موجودة بالinputs
      updated[destIndex] = word;

      return updated;
    });

    setWrong([false, false, false, false]);
  };

  // ======================================================
  // SELECT WORD
  // ======================================================

  const handleWordSelect = (id) => {
    if (showAnswer || locked) {
      return;
    }

    const word = parseWord(id);

    // الصوت من options
    playWordAudio(word);

    setSelectedWordId(id);

    setAnnouncement(
      `${word} selected. Use Tab to choose an answer box, then press Enter.`,
    );
  };

  // ======================================================
  // KEYBOARD DROP
  // ======================================================

  const handleKeyboardDrop = (slotId) => {
    if (!selectedWordId || showAnswer || locked) {
      return;
    }

    const word = parseWord(selectedWordId);

    const destIndex = Number(slotId.replace("blank-", ""));

    let updatedInputs = null;

    setInputs((prev) => {
      const updated = [...prev];

      updated.forEach((currentValue, index) => {
        if (currentValue === word) {
          updated[index] = "";
        }
      });

      updated[destIndex] = word;

      updatedInputs = updated;

      return updated;
    });

    setWrong([false, false, false, false]);

    setSelectedWordId(null);

    setAnnouncement(`${word} placed in answer box ${destIndex + 1}.`);

    // رجع لأول option غير مستخدم
    window.setTimeout(() => {
      const currentInputs = updatedInputs || [];

      for (let i = 0; i < options.length; i++) {
        const option = options[i];

        if (currentInputs.includes(option.word)) {
          continue;
        }

        const id = `bank-${option.word}-${i}`;

        const element = bankRefs.current[id];

        if (element) {
          element.focus();

          return;
        }
      }
    }, 0);
  };

  // ======================================================
  // REMOVE
  // ======================================================

  const handleRemove = (slotId) => {
    if (locked) {
      return;
    }

    const index = Number(slotId.replace("blank-", ""));

    const removedWord = inputs[index];

    setInputs((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    setWrong([false, false, false, false]);

    window.setTimeout(() => {
      if (!removedWord) {
        return;
      }

      const optionIndex = options.findIndex(
        (option) => option.word === removedWord,
      );

      if (optionIndex === -1) {
        return;
      }

      const id = `bank-${removedWord}-${optionIndex}`;

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

    if (inputs.some((value) => value.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );

      return;
    }

    let correct = 0;

    const wrongStatus = inputs.map((value, index) => {
      const ok =
        value.trim().toLowerCase() === data[index].answer.toLowerCase();

      if (ok) {
        correct++;
      }

      return !ok;
    });

    setWrong(wrongStatus);

    setLocked(true);

    setSelectedWordId(null);

    const total = data.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) {
      ValidationAlert.success(msg);
    } else if (correct === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const handleShowAnswer = () => {
    setSelectedWordId(null);

    setShowAnswer(true);
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    stopAudio();

    setInputs(["", "", "", ""]);

    setWrong([false, false, false, false]);

    setShowAnswer(false);

    setLocked(false);

    setActiveId(null);

    setSelectedWordId(null);

    setAnnouncement("Activity reset.");
  };

  // ======================================================
  // CLEANUP
  // ======================================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <>
      <style>
        {`
          @keyframes keyboardDropPulse {
            0% {
              opacity: 0.35;
              transform: scale(0.96);
              border-color: #93c5fd;
              background: rgba(219,234,254,0.25);
            }

            100% {
              opacity: 1;
              transform: scale(1);
              border-color: #2563eb;
              background: rgba(219,234,254,0.75);
              box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
            }
          }
        `}
      </style>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="page8-wrapper"
          style={{
            padding: "30px",
          }}
        >
          {/* Screen Reader */}

          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: "absolute",

              width: "1px",

              height: "1px",

              padding: 0,

              margin: "-1px",

              overflow: "hidden",

              clip: "rect(0,0,0,0)",

              whiteSpace: "nowrap",

              border: 0,
            }}
          >
            {announcement}
          </div>

          <div className="div-forall">
            <h3 className="header-title-page8">
              <span className="ex-A">G</span>
              Drag and drop the greetings.
            </h3>

            {/* =================================
                WORD BANK
            ================================= */}

            <div className="word-bank-accessible-wb-u1-p4-q1">
              {options.map((option, i) => {
                const id = `bank-${option.word}-${i}`;

                return (
                  <BankChip
                    key={id}
                    id={id}
                    word={option.word}
                    isUsed={isWordUsed(option.word)}
                    locked={locked || showAnswer}
                    selectedWordId={selectedWordId}
                    onSelect={handleWordSelect}
                    registerRef={registerBankRef}
                  />
                );
              })}
            </div>

            {/* =================================
                QUESTIONS
            ================================= */}

            <div className="question-container-wb-u1-p4-q1">
              {data.map((item, i) => (
                <div key={i} className="question-row-wb-u1-q4">
                  <div className="img-box-wb-u1-q4">
                    <span className="question-number-wb-u1-p4-q1">{i + 1}</span>

                    <img
                      className="img-wb-unit1-p4-q1"
                      src={item.img}
                      alt={item.alt}
                    />

                    <SlotDropZone
                      id={`blank-${i}`}
                      value={inputs[i]}
                      activeWord={activeWord}
                      isWrong={wrong[i]}
                      showAnswer={showAnswer}
                      answerText={item.answer}
                      locked={locked}
                      selectedWord={selectedWord}
                      selectedWordId={selectedWordId}
                      onKeyboardDrop={handleKeyboardDrop}
                      onRemove={handleRemove}
                      registerDropRef={registerDropRef}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =================================
              BUTTONS
          ================================= */}

          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              className="show-answer-btn swal-continue"
              onClick={handleShowAnswer}
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>

        {/* =================================
            DRAG OVERLAY
        ================================= */}

        <DragOverlay>
          {activeWord ? (
            <span
              style={{
                padding: "4px 8px",

                border: "2px solid #2c5287",

                borderRadius: "8px",

                background: "white",

                fontWeight: "bold",

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
    </>
  );
}
