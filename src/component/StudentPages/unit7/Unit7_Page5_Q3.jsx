import React, { useEffect, useRef, useState } from "react";

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

import { FaVolumeUp } from "react-icons/fa";

import bat from "../../../assets/unit7/img/U7P62EXEB-01.svg";
import cap from "../../../assets/unit7/img/U7P62EXEB-02.svg";
import ant from "../../../assets/unit7/img/U7P62EXEB-03.svg";

import happyAudio from "../../../assets/unit7/sound/Page 62 - B/happy.mp3";
import coldAudio from "../../../assets/unit7/sound/Page 62 - B/cold.mp3";
import crawlAudio from "../../../assets/unit7/sound/Page 62 - B/crawl.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page5_Q3.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const commandData = [
  {
    word: "happy",
    audio: happyAudio,
  },
  {
    word: "cold",
    audio: coldAudio,
  },
  {
    word: "crawl",
    audio: crawlAudio,
  },
];

const correctAnswers = ["happy", "cold", "crawl"];

const images = [
  {
    src: bat,
    alt: "A smiling girl who looks happy.",
  },
  {
    src: cap,
    alt: "A boy shivering and holding his arms because he feels cold.",
  },
  {
    src: ant,
    alt: "A boy crawling on his hands and knees.",
  },
];

const getAudioForWord = (word) =>
  commandData.find((item) => item.word === word)?.audio;

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  word,
  isUsed,
  disabled,

  keyboardPickedWord,
  onKeyboardPick,

  registerRef,

  isPlaying,
  onPlayAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${word}`,

    data: {
      word,
      source: "bank",
    },

    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const keyboardSelected = keyboardPickedWord === word;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(word, node);
    }
  };

  const handleKeyDown = (e) => {
    if (unavailable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      /*
        Keyboard:
        صوت + pick
        وبعدها الفوكس يروح لأول slot متاح.
      */

      onPlayAudio(word);

      onKeyboardPick(word);
    }
  };

  return (
    <span
      ref={setRefs}
      {...(!unavailable
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={unavailable ? -1 : 0}
      aria-disabled={unavailable}
      aria-pressed={keyboardSelected}
      aria-label={
        keyboardSelected
          ? `${word} selected. Choose an answer box and press Enter or Space.`
          : `${word}. Press Enter or Space to hear and select this word.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          صوت فقط.
          الـdrag هو اللي بحط الكلمة.
        */

        onPlayAudio(word);
      }}
      style={{
        padding: "7px 14px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: keyboardSelected ? "#dbeafe" : isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        cursor: unavailable ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.3 : isUsed ? 0.45 : 1,

        transition: "opacity 0.2s, background 0.2s, outline 0.15s",

        userSelect: "none",

        touchAction: "none",

        color: isUsed ? "#999" : "inherit",

        position: "relative",

        outline: keyboardSelected ? "3px solid #2563eb" : undefined,

        outlineOffset: "3px",
      }}
    >
      {word}

      {/* =================================================
          AUDIO ICON
          فوق يمين وما بتأثر على الكلمة
      ================================================= */}

      {isPlaying && (
        <FaVolumeUp
          size={14}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  index,

  answer,

  isWrong,
  locked,

  keyboardPickedWord,
  keyboardFocusIndex,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,

  onSlotFocus,

  onRemove,

  registerRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,

    disabled: locked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedWord) && keyboardFocusIndex === index && !locked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(index, node);
    }
  };

  const handleKeyDown = (e) => {
    if (locked) return;

    /* =====================================================
       TAB / SHIFT + TAB

       أثناء وجود كلمة picked:
       التنقل فقط بين الـunlocked slots.
    ===================================================== */

    if (keyboardPickedWord && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(index, e.shiftKey);

      return;
    }

    /* =====================================================
       ENTER / SPACE
    ===================================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      /*
        في كلمة picked:
        حطها أو استبدل الموجود.
      */

      if (keyboardPickedWord) {
        onKeyboardPlace(index);

        return;
      }

      /*
        ما في كلمة picked،
        والـslot فيه answer:
        رجعها للبنك.
      */

      if (answer) {
        onRemove(index);
      }

      return;
    }

    /* =====================================================
       ESCAPE
    ===================================================== */

    if (keyboardPickedWord && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div className="input-wrapper-unit7-page5-q3">
      <div
        ref={setRefs}
        className={`
          q-input-unit3-page6-q1
          ${isOver ? "drag-over-cell" : ""}
        `}
        role="button"
        tabIndex={locked ? -1 : keyboardPickedWord ? 0 : answer ? 0 : -1}
        aria-disabled={locked}
        aria-label={
          locked
            ? `Answer box ${index + 1}. Correct answer ${answer}. Locked.`
            : isKeyboardTarget
              ? `Answer box ${
                  index + 1
                }. Press Enter or Space to place ${keyboardPickedWord}. Press Tab or Shift plus Tab to move between answer boxes.`
              : answer
                ? `Answer box ${
                    index + 1
                  }. Current answer ${answer}. Press Enter or Space to return it to the word bank.`
                : `Empty answer box ${
                    index + 1
                  }. Select a word from the word bank first.`
        }
        onFocus={() => {
          if (keyboardPickedWord && !locked) {
            onSlotFocus(index);
          }
        }}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (locked) return;

          /*
            Mouse:
            إذا الخانة فيها كلمة
            وما في keyboard pick،
            رجعها للبنك.
          */

          if (answer && !keyboardPickedWord) {
            onRemove(index);
          }
        }}
        style={{
          background: isOver
            ? "#e8f0fe"
            : isKeyboardTarget
              ? "#eff6ff"
              : "transparent",

          justifyContent: "center",

          transition: "background 0.15s, outline 0.15s",

          borderColor: "#72d0f6",

          cursor: answer && !locked ? "pointer" : "default",

          fontSize: "22px",

          display: "inline-flex",

          alignItems: "center",

          position: "relative",

          outline: isKeyboardTarget ? "3px solid #2563eb" : undefined,

          outlineOffset: "3px",
        }}
      >
        {/* =================================================
            NORMAL VALUE
        ================================================= */}

        {answer && !isKeyboardTarget && (
          <span
            style={{
              fontWeight: "bold",

              color:  "#2c5287",

              pointerEvents: "none",

              userSelect: "none",
            }}
          >
            {answer}
          </span>
        )}

        {/* =================================================
            KEYBOARD PREVIEW
        ================================================= */}

        {isKeyboardTarget && keyboardPickedWord && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",

              alignItems: "center",

              padding: "2px 7px",

              border: "2px dashed #2563eb",

              borderRadius: "7px",

              color: "#2563eb",

              background: "rgba(219,234,254,0.45)",

              fontWeight: "600",

              pointerEvents: "none",

              animation:
                "unit7Q3KeyboardBlink 0.75s ease-in-out infinite alternate",
            }}
          >
            {keyboardPickedWord}
          </span>
        )}
      </div>

      {/* =================================================
          WRONG X
      ================================================= */}

      {isWrong && !locked && (
        <span className="error-mark-input" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const Unit7_Page5_Q3 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState([null, null, null]);

  const [wrongInputs, setWrongInputs] = useState([]);

  /*
    Progressive locking:
    الصحيح فقط يقفل.
  */

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     DND
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const [keyboardMessage, setKeyboardMessage] = useState("");

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =====================================================
     HELPERS
  ===================================================== */

  const usedWords = new Set(answers.filter(Boolean));

  const activeWord = activeId ? String(activeId).replace("bank-", "") : null;

  const isSlotLocked = (index) => lockedSlots.includes(index);

  const editableSlots = () => [0, 1, 2].filter((index) => !isSlotLocked(index));

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingWord(null);
  };

  const playWordAudio = (word) => {
    const src = getAudioForWord(word);

    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     REGISTER REFS
  ===================================================== */

  const registerBankRef = (word, node) => {
    if (node) {
      bankRefs.current[word] = node;
    }
  };

  const registerSlotRef = (index, node) => {
    if (node) {
      slotRefs.current[index] = node;
    }
  };

  /* =====================================================
     SLOT FOCUS
  ===================================================== */

  const handleSlotFocus = (index) => {
    if (keyboardPickedWord && !isSlotLocked(index)) {
      setKeyboardFocusIndex(index);
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedWord(word);

    setKeyboardMessage(
      `${word} selected. Choose an answer box and press Enter or Space.`,
    );

    const available = editableSlots();

    if (!available.length) return;

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    /*
      بعد Enter / Space على البنك:
      يروح لأول slot متاح.
    */

    requestAnimationFrame(() => {
      slotRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT+TAB BETWEEN SLOTS
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableSlots();

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
      slotRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardWord = (index) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(index)
    ) {
      return;
    }

    const picked = keyboardPickedWord;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        إذا نفس الكلمة موجودة بمكان ثاني غلط:
        انقلها.
      */

      const oldIndex = updated.findIndex((answer) => answer === picked);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      /*
        استبدل الموجود.
      */

      updated[index] = picked;

      nextAnswers = updated;

      return updated;
    });

    /*
      تعديل target:
      شيل X عنه فقط.
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage(`${picked} placed in answer box ${index + 1}.`);

    /*
      بعد placement:
      رجع الفوكس لأول كلمة متاحة بالبنك.
    */

    requestAnimationFrame(() => {
      if (!nextAnswers) return;

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const nextWord = correctAnswers.find((word) => !usedAfter.has(word));

      if (nextWord) {
        bankRefs.current[nextWord]?.focus();
      }
    });
  };

  /* =====================================================
     CANCEL KEYBOARD PICK
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedWord) {
      return;
    }

    const picked = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage("Selection cancelled.");

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswer || checkCompleted) {
      return;
    }

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

    const word =
      active.data.current?.word ?? String(active.id).replace("bank-", "");

    const slotId = String(over.id);

    if (!slotId.startsWith("slot-")) {
      return;
    }

    const index = Number(slotId.replace("slot-", ""));

    if (isSlotLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((answer) => answer === word);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      updated[index] = word;

      return updated;
    });

    /*
      تعديل target:
      يشيل X عنه فقط.
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* =====================================================
     REMOVE FROM SLOT
  ===================================================== */

  const handleRemove = (index) => {
    if (showAnswer || isSlotLocked(index)) {
      return;
    }

    const removedWord = answers[index];

    if (!removedWord) return;

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    /*
      شيل X عن نفس slot.
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    /*
      Wrong Slot Correction:
      بعد Enter / Space على wrong slot
      يرجع لنفس كلمة البنك.
    */

    requestAnimationFrame(() => {
      bankRefs.current[removedWord]?.focus();
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    /*
      Show Answer أو نجاح كامل:
      Check يظل ظاهر لكنه no-op.
    */

    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((answer) => !answer)) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        correctCount++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      Progressive lock:
      الصحيح فقط يقفل.
    */

    setLockedSlots((prev) => [...new Set([...prev, ...newlyLocked])]);

    /*
      X فقط على الغلط.
    */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    const total = correctAnswers.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedSlots([0, 1, 2]);

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
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers([...correctAnswers]);

    setWrongInputs([]);

    setLockedSlots([0, 1, 2]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setActiveId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers([null, null, null]);

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage("");
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <>
      <style>
        {`
          @keyframes unit7Q3KeyboardBlink {
            0% {
              opacity: 0.35;
              background: rgba(219,234,254,0.25);
            }

            100% {
              opacity: 1;
              background: rgba(219,234,254,0.85);
              box-shadow: 0 0 0 4px rgba(37,99,235,0.10);
            }
          }

          .q-input-unit3-page6-q1:focus {
            outline: none;
          }

          .q-input-unit3-page6-q1:focus-visible {
            outline: 3px solid #2563eb;
            outline-offset: 3px;
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
          className="question-wrapper-unit3-page6-q1"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >
          {/* =================================================
              SCREEN READER STATUS
          ================================================= */}

          <div
            role="status"
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
              clipPath: "inset(50%)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            {keyboardMessage}
          </div>

          <div
            className="div-forall"
            style={{
              gap: "60px",
            }}
          >
            <ExerciseHeader
              sectionLetter="B"
              title="Look and write."
              subTitle="Drag happy, cold, and crawl to the matching pictures."
            />

            {/* =================================================
                WORD BANK
            ================================================= */}

            <div
              style={{
                display: "flex",
                gap: "40px",
                padding: "10px",
                border: "2px dashed #ccc",
                borderRadius: "10px",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {correctAnswers.map((word) => (
                <BankChip
                  key={word}
                  word={word}
                  isUsed={usedWords.has(word)}
                  disabled={showAnswer || checkCompleted}
                  keyboardPickedWord={keyboardPickedWord}
                  onKeyboardPick={handleKeyboardPick}
                  registerRef={registerBankRef}
                  isPlaying={playingWord === word}
                  onPlayAudio={playWordAudio}
                />
              ))}
            </div>

            {/* =================================================
                QUESTIONS
            ================================================= */}

            <div
              className="row-content10-unit3-page6-q1"
              style={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {images.map((item, index) => {
                const locked = isSlotLocked(index);

                return (
                  <div key={index} className="row2-unit3-page6-q1 gap-10">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="q-img-unit3-page6-q1"
                    />

                    <DropSlot
                      index={index}
                      answer={answers[index]}
                      isWrong={wrongInputs.includes(index)}
                      locked={locked || showAnswer}
                      keyboardPickedWord={keyboardPickedWord}
                      keyboardFocusIndex={keyboardFocusIndex}
                      onKeyboardPlace={placeKeyboardWord}
                      onKeyboardCancel={cancelKeyboardPick}
                      onMoveKeyboardFocus={moveKeyboardFocus}
                      onSlotFocus={handleSlotFocus}
                      onRemove={handleRemove}
                      registerRef={registerSlotRef}
                    />
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
            Mouse / Touch فقط
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                cursor: "grabbing",
                color: "#2c5287",
              }}
            >
              {activeWord}
            </span>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Unit7_Page5_Q3;
