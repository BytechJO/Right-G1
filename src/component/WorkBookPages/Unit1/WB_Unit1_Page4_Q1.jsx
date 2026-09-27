import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-01.svg";
import img2 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-03.svg";
import img3 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-02.svg";
import img4 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-04.svg";

// AUDIO
import goodbyeAudio from "../../../assets/U1 WB/U1/page_4/Item_002_Goodbye!.mp3";
import goodMorningAudio from "../../../assets/U1 WB/U1/page_4/Item_004_Good_morning!.mp3";
import goodAfternoonAudio from "../../../assets/U1 WB/U1/page_4/Item_003_Good_afternoon!.mp3";
import helloStellaAudio from "../../../assets/U1 WB/U1/page_4/Item_001_Hello!_I'm_Stella.mp3";

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

import "./WB_Unit1_Page4_Q1.css";

// ======================================================
// DATA
// ======================================================

const data = [
  {
    img: img1,
    answer: "Goodbye!",
    audio: goodbyeAudio,
    alt: "A girl waving goodbye to two people standing at the door.",
  },
  {
    img: img2,
    answer: "Good morning!",
    audio: goodMorningAudio,
    alt: "A girl waking up in bed while a man greets her.",
  },
  {
    img: img3,
    answer: "Good afternoon!",
    audio: goodAfternoonAudio,
    alt: "A person riding a bicycle outside during the day.",
  },
  {
    img: img4,
    answer: "Hello! I'm Stella.",
    audio: helloStellaAudio,
    alt: "Two girls standing and talking to each other.",
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

  // لما كلمة تكون مختارة، باقي الخيارات تطلع من Tab
  const anotherWordSelected = selectedWordId && !isSelected;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isUsed || locked) return;

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

  // فقط الـinput اللي عليه focus
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
    // Enter / Space يحطها هون
    if (selectedWordId && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(id);

      return;
    }

    // ما في كلمة مختارة
    // إذا الـinput فيه كلمة، Enter يرجعها للبنك
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
        // بدون كلمة مختارة:
        // فقط الـinput اللي فيه قيمة يدخل بالـTab
        //
        // مع كلمة مختارة:
        // كل الـinputs تدخل بالـTab
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

          minWidth: "220px",

          height: "40px",

          borderBottom: "2px solid black",

          fontSize: "20px",

          fontWeight: "600",

          display: "flex",

          alignItems: "center",

          padding: "0 8px",

          // فقط الـinput الحالي بالـTab
          background: isKeyboardTarget
            ? "#eff6ff"
            : isOver && !showAnswer
              ? "#e3f2fd"
              : undefined,

          // فقط الـinput الحالي
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

            {/* ==================================
                KEYBOARD PREVIEW
                فقط بالـinput اللي عليه focus
            ================================== */}

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

            {/* ==================================
                MOUSE DRAG PREVIEW
            ================================== */}

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
// MAIN COMPONENT
// ======================================================

export default function WB_Unit1_Page4_Q1() {
  const [inputs, setInputs] = useState(["", "", "", ""]);

  const [wrong, setWrong] = useState([false, false, false, false]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [locked, setLocked] = useState(false);

  const [activeId, setActiveId] = useState(null);

  const [selectedWordId, setSelectedWordId] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  // ====================================================
  // AUDIO
  // ====================================================

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
    const item = data.find((item) => item.answer === word);

    if (!item?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    audio.play().catch(() => {});

    audio.onended = () => {
      audioRef.current = null;
    };
  };

  // ====================================================
  // REFS
  // ====================================================

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

  // ====================================================
  // DND
  // ====================================================

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

  // ====================================================
  // DRAG START
  // ====================================================

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  // ====================================================
  // DRAG END
  // ====================================================

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

      // لو الكلمة كانت موجودة بمكان ثاني
      // شيلها أول
      updated.forEach((currentValue, index) => {
        if (currentValue === word) {
          updated[index] = "";
        }
      });

      // حطها بالمكان الجديد
      updated[destIndex] = word;

      return updated;
    });

    setWrong([false, false, false, false]);
  };

  // ====================================================
  // SELECT WORD
  // Mouse Click / Enter / Space
  // ====================================================

  const handleWordSelect = (id) => {
    if (showAnswer || locked) {
      return;
    }

    const word = parseWord(id);

    // شغل صوت الخيار
    playWordAudio(word);

    // حدد الكلمة
    setSelectedWordId(id);

    setAnnouncement(
      `${word} selected. Use Tab to choose an answer box, then press Enter.`,
    );

    // مهم:
    // ما بننقل focus لأول input هون
    // المستخدم يكبس Tab بنفسه
  };

  // ====================================================
  // KEYBOARD DROP
  // ====================================================

  const handleKeyboardDrop = (slotId) => {
    if (!selectedWordId || showAnswer || locked) {
      return;
    }

    const word = parseWord(selectedWordId);

    const destIndex = Number(slotId.replace("blank-", ""));

    let updatedInputs = null;

    setInputs((prev) => {
      const updated = [...prev];

      // شيل نفس الكلمة من مكان قديم
      updated.forEach((currentValue, index) => {
        if (currentValue === word) {
          updated[index] = "";
        }
      });

      // ضع الكلمة
      updated[destIndex] = word;

      updatedInputs = updated;

      return updated;
    });

    setWrong([false, false, false, false]);

    setSelectedWordId(null);

    setAnnouncement(`${word} placed in answer box ${destIndex + 1}.`);

    // بعد وضع الكلمة
    // ارجع لأول خيار غير مستخدم
    window.setTimeout(() => {
      const currentInputs = updatedInputs || [];

      for (let i = 0; i < data.length; i++) {
        const item = data[i];

        if (currentInputs.includes(item.answer)) {
          continue;
        }

        const id = `bank-${item.answer}-${i}`;

        const element = bankRefs.current[id];

        if (element) {
          element.focus();

          return;
        }
      }
    }, 0);
  };

  // ====================================================
  // REMOVE FROM SLOT
  // ====================================================

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

    // رجع focus للخيار نفسه
    window.setTimeout(() => {
      if (!removedWord) {
        return;
      }

      const itemIndex = data.findIndex((item) => item.answer === removedWord);

      if (itemIndex === -1) {
        return;
      }

      const id = `bank-${removedWord}-${itemIndex}`;

      bankRefs.current[id]?.focus();
    }, 0);
  };

  // ====================================================
  // CHECK ANSWERS
  // ====================================================

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

  // ====================================================
  // SHOW ANSWER
  // ====================================================

  const handleShowAnswer = () => {
    setSelectedWordId(null);

    setShowAnswer(true);
  };

  // ====================================================
  // RESET
  // ====================================================

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

  // ====================================================
  // AUDIO CLEANUP
  // ====================================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ====================================================
  // RENDER
  // ====================================================

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
              <span className="ex-A">C</span>
              Drag and drop.
            </h3>

            {/* =================================
                WORD BANK
            ================================= */}

            <div className="word-bank-accessible-wb-u1-p4-q1">
              {data.map((item, i) => {
                const id = `bank-${item.answer}-${i}`;

                return (
                  <BankChip
                    key={id}
                    id={id}
                    word={item.answer}
                    isUsed={isWordUsed(item.answer)}
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
