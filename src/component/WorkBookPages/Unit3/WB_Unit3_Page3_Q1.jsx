import React, { useEffect, useRef, useState } from "react";

import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";

import bat from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-01.svg";
import cap from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-02.svg";
import ant from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-03.svg";
import dad from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-04.svg";
import dad2 from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-05.svg";
import dad3 from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-06.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit3_Page3_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import makeLineSound from "../../../assets/U1 WB/U3/page_17/Item_001_Make_a_line.mp3";
import openBookSound from "../../../assets/U1 WB/U3/page_17/Item_002_Open_your_book.mp3";
import closeBookSound from "../../../assets/U1 WB/U3/page_17/Item_003_Close_your_book.mp3";
import quietSound from "../../../assets/U1 WB/U3/page_17/Item_004_Quiet!.mp3";
import takePencilSound from "../../../assets/U1 WB/U3/page_17/Item_005_Take_out_your_pencil.mp3";
import listenSound from "../../../assets/U1 WB/U3/page_17/Item_006_Listen!.mp3";

/* =====================================================
   DATA
===================================================== */

const images = [
  {
    src: bat,
    alt: "A boy taking out his pencil case and pencil.",
  },
  {
    src: cap,
    alt: "Students listening carefully to music with their teacher.",
  },
  {
    src: ant,
    alt: "Children standing in a line.",
  },
  {
    src: dad,
    alt: "A boy opening his book.",
  },
  {
    src: dad2,
    alt: "A teacher asking the students to be quiet.",
  },
  {
    src: dad3,
    alt: "A boy closing his book.",
  },
];

const commandData = [
  {
    word: "Take out your pencil.",
    audio: takePencilSound,
  },
  {
    word: "Listen!",
    audio: listenSound,
  },
  {
    word: "Make a line.",
    audio: makeLineSound,
  },
  {
    word: "Open your book.",
    audio: openBookSound,
  },
  {
    word: "Quiet!",
    audio: quietSound,
  },
  {
    word: "Close your book.",
    audio: closeBookSound,
  },
];

const correctAnswers = commandData.map((item) => item.word);

const getAudioForWord = (word) =>
  commandData.find((item) => item.word === word)?.audio;

/* =====================================================
   SHUFFLE
===================================================== */

const shuffleArray = (arr) => {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

/* =====================================================
   BANK ITEM
===================================================== */

const BankItem = ({
  word,
  disabled,
  isUsed,

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

    disabled: disabled || isUsed,
  });

  const unavailable = disabled || isUsed;

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
        صوت + اختيار + انتقال للـinput
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
          : `${word}. Press Enter or Space to select.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click = صوت فقط
        */
        onPlayAudio(word);
      }}
      style={{
        padding: "7px 7px",

        border: "2px solid",

        borderColor: unavailable
          ? "#ccc"
          : keyboardSelected
            ? "#2563eb"
            : "#2c5287",

        borderRadius: "8px",

        background: keyboardSelected
          ? "#dbeafe"
          : unavailable
            ? "#f0f0f0"
            : "white",

        fontWeight: "bold",

        cursor: unavailable ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.3 : isUsed ? 0.45 : 1,

        transition:
          "opacity 0.15s, border-color 0.15s, background 0.15s, box-shadow 0.15s",

        userSelect: "none",

        touchAction: "none",

        color: unavailable ? "#aaa" : "inherit",

        position: "relative",

        outline: keyboardSelected ? "3px solid #2563eb" : undefined,

        outlineOffset: "3px",

        boxShadow: keyboardSelected
          ? "0 0 0 4px rgba(37,99,235,0.15)"
          : undefined,
      }}
    >
      {word}

      {isPlaying && (
        <FaVolumeUp
          aria-hidden="true"
          style={{
            marginLeft: "7px",
            color: "#2563eb",
            fontSize: "15px",
          }}
        />
      )}
    </span>
  );
};

/* =====================================================
   SLOT
===================================================== */

const SlotDroppable = ({
  index,
  value,
  locked,
  isWrong,

  keyboardPickedWord,
  keyboardFocusIndex,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,
  onSlotFocus, // ✅ أضيفي هاي

  onClear,
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

  return (
    <div
      ref={setRefs}
      className={`q-input-wb-unit3-page3-q1 ${isOver ? "drag-over-cell" : ""}`}
      role="button"
      tabIndex={locked ? -1 : keyboardPickedWord ? 0 : value ? 0 : -1}
      aria-disabled={locked}
      aria-label={
        locked
          ? `Answer box ${index + 1}. Correct answer ${value}. Locked.`
          : isKeyboardTarget
            ? `Answer box ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}.`
            : value
              ? `Answer box ${index + 1}. Current answer ${value}. Press Enter or Space to return it.`
              : `Empty answer box ${index + 1}. Select a command first.`
      }
      onFocus={() => {
        if (keyboardPickedWord && !locked) {
          onSlotFocus(index);
        }
      }}
      onKeyDown={(e) => {
        if (locked) return;

        /* =========================================
           أثناء مسك كلمة:
           Tab بين الـinputs فقط
        ========================================= */

        if (keyboardPickedWord && e.key === "Tab") {
          e.preventDefault();
          e.stopPropagation();

          onMoveKeyboardFocus(index, e.shiftKey);

          return;
        }

        /* ENTER / SPACE */

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          if (keyboardPickedWord) {
            onKeyboardPlace(index);

            return;
          }

          if (value) {
            onClear(index);
          }

          return;
        }

        /* ESCAPE */

        if (keyboardPickedWord && e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardCancel();
        }
      }}
      onClick={() => {
        if (locked) return;

        /*
          Mouse:
          إذا الخانة فيها جواب
          نرجعه للبنك.
        */
        if (value && !keyboardPickedWord) {
          onClear(index);
        }
      }}
      style={{
        background: isOver ? "#e3f2fd" : isKeyboardTarget ? "#eff6ff" : "white",

        position: "relative",

        cursor: value && !locked ? "pointer" : "default",

        display: "flex",

        alignItems: "center",

        outline: isKeyboardTarget ? "3px solid #2563eb" : undefined,

        outlineOffset: "3px",

        transition: "background 0.15s, outline 0.15s",
      }}
    >
      {/* =========================================
          NORMAL VALUE
      ========================================= */}

      {value && !isKeyboardTarget && (
        <span
          style={{
            pointerEvents: "none",

            userSelect: "none",
          }}
        >
          {value}
        </span>
      )}

      {/* =========================================
          KEYBOARD PREVIEW

          الكلمة ترمش داخل الـinput
      ========================================= */}

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
              "wbU3P3KeyboardBlink 0.75s ease-in-out infinite alternate",
          }}
        >
          {keyboardPickedWord}
        </span>
      )}

      {isWrong && !locked && (
        <span className="error-mark-input-wb-unit2-page3-q2">✕</span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit3_Page3_Q1 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [bank, setBank] = useState([]);

  const [slots, setSlots] = useState(Array(6).fill(null));

  const [wrongInputs, setWrongInputs] = useState([]);

  /*
    Progressive lock:
    بس الخانات الصحيحة تتقفل
  */
  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

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
     INITIAL
  ===================================================== */

  useEffect(() => {
    setBank(shuffleArray(correctAnswers));

    setSlots(Array(6).fill(null));
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const usedWords = new Set(slots.filter(Boolean));

  const isSlotLocked = (index) => lockedSlots.includes(index);

  const editableSlots = () =>
    [0, 1, 2, 3, 4, 5].filter((index) => !isSlotLocked(index));

  /* =====================================================
     AUDIO
  ===================================================== */

  const playWordAudio = (word) => {
    const src = getAudioForWord(word);

    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      setPlayingWord(null);
    });

    audio.onended = () => {
      setPlayingWord(null);
    };

    audio.onerror = () => {
      setPlayingWord(null);
    };
  };
  const handleSlotFocus = (index) => {
    if (keyboardPickedWord) {
      setKeyboardFocusIndex(index);
    }
  };
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

    if (!available.length) {
      return;
    }

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    /*
      بعد Enter على الخيار:
      روح لأول input متاح
    */

    requestAnimationFrame(() => {
      slotRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     MOVE BETWEEN INPUTS
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableSlots();

    if (!available.length) return;

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

    slotRefs.current[nextIndex]?.focus();
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

    let nextSlots = null;

    setSlots((prev) => {
      const copy = [...prev];

      /*
        إذا الكلمة موجودة بمكان غلط ثاني
        انقلها للمكان الجديد
      */

      const oldIndex = copy.indexOf(picked);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        copy[oldIndex] = null;
      }

      /*
        إذا الخانة فيها كلمة غلط
        استبدلها مباشرة
      */

      copy[index] = picked;

      nextSlots = copy;

      return copy;
    });

    /*
      شيل X عن الخانة المعدلة فقط
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage(`${picked} placed in answer box ${index + 1}.`);

    /*
      رجع focus لأول خيار متاح بالبنك
    */

    requestAnimationFrame(() => {
      if (!nextSlots) return;

      const usedAfter = new Set(nextSlots.filter(Boolean));

      const nextWord = bank.find((word) => !usedAfter.has(word));

      if (nextWord) {
        bankRefs.current[nextWord]?.focus();
      }
    });
  };

  /* =====================================================
     CANCEL KEYBOARD PICK
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedWord) return;

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

  const handleDragStart = (event) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const { data } = event.active;

    const word = data.current?.word ?? null;

    setActiveWord(word);

    /*
      Drag يبدأ → شغل صوت الخيار
    */

    if (word) {
      playWordAudio(word);
    }
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = (event) => {
    setActiveWord(null);

    const { active, over } = event;

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const overId = String(over.id);

    const word = active.data.current?.word;

    if (!overId.startsWith("slot-") || !word) {
      return;
    }

    const targetIndex = Number(overId.replace("slot-", ""));

    if (isSlotLocked(targetIndex)) {
      return;
    }

    setSlots((prev) => {
      const copy = [...prev];

      /*
        إذا الكلمة موجودة بمكان ثاني
        انقلها
      */

      const oldIndex = copy.indexOf(word);

      if (
        oldIndex !== -1 &&
        oldIndex !== targetIndex &&
        !isSlotLocked(oldIndex)
      ) {
        copy[oldIndex] = null;
      }

      /*
        استبدل الموجود داخل target
      */

      copy[targetIndex] = word;

      return copy;
    });

    /*
      تعديل الخانة يشيل X عنها
    */

    setWrongInputs((prev) => prev.filter((index) => index !== targetIndex));
  };

  /* =====================================================
     CLEAR SLOT
  ===================================================== */

  const clearSlot = (index) => {
    if (showAnswer || isSlotLocked(index)) {
      return;
    }

    const removedWord = slots[index];

    if (!removedWord) return;

    setSlots((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    requestAnimationFrame(() => {
      bankRefs.current[removedWord]?.focus();
    });
  };

  /* =====================================================
     NORMALIZE
  ===================================================== */

  const normalizeText = (text) =>
    text.toLowerCase().replace(/[.!?]/g, "").replace(/\s+/g, " ").trim();

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    /*
      بعد Show Answer
      أو نجاح كامل:
      الزر طبيعي بس No-op
    */

    if (showAnswer || checkCompleted) {
      return;
    }

    if (slots.some((slot) => !slot)) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the blanks before checking.",
      );

      return;
    }

    let correct = 0;

    const wrong = [];

    const newlyLocked = [];

    slots.forEach((slot, index) => {
      const ok = normalizeText(slot) === normalizeText(correctAnswers[index]);

      if (ok) {
        correct++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      اقفل الصح فقط
    */

    setLockedSlots((prev) => [...new Set([...prev, ...newlyLocked])]);

    /*
      الغلط فقط عليه X
    */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    const total = correctAnswers.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) {
      setLockedSlots([0, 1, 2, 3, 4, 5]);

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(message);

      return;
    }

    if (correct === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    setSlots([...correctAnswers]);

    setWrongInputs([]);

    setLockedSlots([0, 1, 2, 3, 4, 5]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage("Correct answers are displayed.");
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    setPlayingWord(null);

    setBank(shuffleArray(correctAnswers));

    setSlots(Array(6).fill(null));

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage("");

    setActiveWord(null);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* فقط للـpreview blink
          ما غيّرنا CSS الأساسي الموجود عندك */}

      <style>
        {`
          @keyframes wbU3P3KeyboardBlink {
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
        `}
      </style>

      <DndContext
        sensors={sensors}
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
          {/* SCREEN READER */}

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
              gap: "20px",
            }}
          >
            <ExerciseHeader
              sectionLetter="E"
              title="Look, read, and write."
              subTitle="Look at each action and drag the matching classroom command to it."
            />

            {/* =========================================
                WORD BANK
            ========================================= */}

            <div
              style={{
                display: "grid",

                gap: "10px",

                padding: "10px",

                width: "100%",

                border: "2px dashed #ccc",

                borderRadius: "10px",

                alignItems: "center",

                gridTemplateColumns: "1fr 1fr 1fr",
              }}
            >
              {bank.map((word) => (
                <BankItem
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

            {/* =========================================
                IMAGES + SLOTS
            ========================================= */}

            <div className="row-content10-wb-unit3-page3-q1">
              {images.map((item, index) => {
                const locked = isSlotLocked(index);

                return (
                  <div
                    key={index}
                    className="row2-unit3-page6-q1"
                    style={{
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        gap: "10px",
                      }}
                    >
                      <span className="num-span">{index + 1}</span>

                      <img
                        src={item.src}
                        alt={item.alt}
                        className="q-img-wb-unit3-page3-q2"
                      />
                    </div>

                    <SlotDroppable
                      index={index}
                      value={slots[index]}
                      locked={locked || showAnswer}
                      isWrong={wrongInputs.includes(index)}
                      keyboardPickedWord={keyboardPickedWord}
                      keyboardFocusIndex={keyboardFocusIndex}
                      onKeyboardPlace={placeKeyboardWord}
                      onKeyboardCancel={cancelKeyboardPick}
                      onMoveKeyboardFocus={moveKeyboardFocus}
                      onSlotFocus={handleSlotFocus} // ✅ هاي
                      onClear={clearSlot}
                      registerRef={registerSlotRef}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================
              BUTTONS
          ========================================= */}

          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              onClick={showAnswers}
              className="show-answer-btn swal-continue"
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>

        {/* =========================================
            DRAG OVERLAY
        ========================================= */}

        <DragOverlay>
          {activeWord ? (
            <span
              style={{
                padding: "7px 10px",

                border: "2px solid #2c5287",

                borderRadius: "8px",

                background: "white",

                fontWeight: "bold",

                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",

                cursor: "grabbing",
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

export default WB_Unit3_Page3_Q1;
