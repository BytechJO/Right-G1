import React, { useRef, useState } from "react";

import "./Review5_Page1_Q1.css";

import img1 from "../../../assets/unit6/imgs/U6P52EXEA-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P52EXEA-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P52EXEA-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P52EXEA-04.svg";

import penAudio from "../../../assets/unit6/sounds/Page 52 - A/pen.mp3";
import globeAudio from "../../../assets/unit6/sounds/Page 52 - A/This is a globe.mp3";
import mapAudio from "../../../assets/unit6/sounds/Page 52 - A/This is a map.mp3";
import eraserExampleAudio from "../../../assets/unit6/sounds/Page 52 - A/What's this This is an eraser..mp3";
import whatsThisAudio from "../../../assets/unit6/sounds/Page 52 - A/What's this.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

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

/* =====================================================
   DATA
===================================================== */

const CORRECT_MATCHES = [
  {
    id: "w1",
    input: "pen",
    num: "input1",
    audio: penAudio,
  },
  {
    id: "w2",
    input: "What's this",
    num: "input2",
    audio: whatsThisAudio,
  },
  {
    id: "w3",
    input: "This is a map",
    num: "input3",
    audio: mapAudio,
  },
  {
    id: "w4",
    input: "What's this",
    num: "input4",
    audio: whatsThisAudio,
  },
  {
    id: "w5",
    input: "This is a globe",
    num: "input5",
    audio: globeAudio,
  },
];

const SLOT_IDS = ["input1", "input2", "input3", "input4", "input5"];

/* =====================================================
   BANK WORD
===================================================== */

const BankWord = ({
  item,

  isUsed,

  showAnswer,
  checkCompleted,

  keyboardPickedId,
  onKeyboardPick,

  registerBankRef,

  playingId,
  onPlayAudio,
}) => {
  const disabled = isUsed || showAnswer || checkCompleted;

  const picked = keyboardPickedId === item.id;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${item.id}`,
    disabled,
  });

  const handleKeyboardActivate = () => {
    if (disabled) return;

    onPlayAudio(item.id, item.audio);

    onKeyboardPick(picked ? null : item.id);
  };

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        registerBankRef(item.id, el);
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
      aria-pressed={picked}
      aria-label={
        picked
          ? `${item.input} selected. Press Tab to move to an answer blank, then press Enter or Space to place it.`
          : `${item.input}. Press Enter or Space to hear and select this phrase.`
      }
      className={`drag-bank-review5-p1-q1 ${
        picked ? "keyboard-picked-review5-p1-q1" : ""
      }`}
      onClick={() => {
        if (disabled) return;

        /*
          Mouse click = audio
          Drag remains normal
        */

        onPlayAudio(item.id, item.audio);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          handleKeyboardActivate();
        }
      }}
      style={{
        padding: "7px 14px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isUsed ? "#e0e0e0" : picked ? "#dbeafe" : "white",

        fontWeight: "bold",

        cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isUsed ? 0.45 : isDragging ? 0.3 : 1,

        transition: "opacity 0.2s, background 0.2s",

        userSelect: "none",

        color: isUsed ? "#999" : "",

        position: "relative",
      }}
    >
      {item.input}

      {playingId === item.id && (
        <FaVolumeUp
          size={14}
          aria-hidden="true"
          className="audio-icon-review5-p1-q1"
        />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  id,

  answer,

  isWrong,
  isLocked,

  showAnswer,
  checkCompleted,

  keyboardPickedItem,

  focusedSlot,
  setFocusedSlot,

  slotRefs,

  getAvailableSlots,

  onKeyboardPlace,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: isLocked || showAnswer || checkCompleted,
  });

  /* =================================================
     PICKED ITEM → SLOT TARGET MODE
  ================================================= */

  const keyboardActive =
    !!keyboardPickedItem && !isLocked && !showAnswer && !checkCompleted;

  /* =================================================
     NEW DRAG PATTERN

     أي slot معبّى ولسا مش locked
     لازم يضل reachable بالـ Tab
     سواء قبل Check أو بعد Check إذا كان غلط.
  ================================================= */

  const canEditFilled =
    !!answer &&
    !keyboardPickedItem &&
    !isLocked &&
    !showAnswer &&
    !checkCompleted;

  const preview = keyboardActive && focusedSlot === id;

  const displayedAnswer = preview ? keyboardPickedItem : answer;

  /* =================================================
     KEYBOARD
  ================================================= */

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT → RETURN TO BANK

       قبل Check:
       أي جواب موجود قابل للإزالة.

       بعد Check:
       فقط الغلط يظل غير locked وبالتالي
       يظل قابل للإزالة.
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(id, answer);

      return;
    }

    if (!keyboardActive) return;

    /* =========================================
       TAB / SHIFT TAB BETWEEN UNLOCKED SLOTS
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlots();

      if (!available.length) return;

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

    /* =========================================
       PLACE / REPLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardPlace(id);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        slotRefs.current[id] = el;
      }}
      role="button"
      /* =================================================
         NEW:
         - picked word → slot reachable
         - filled editable slot → reachable
         - correct locked → removed from Tab
      ================================================= */

      tabIndex={
        isLocked || showAnswer || checkCompleted
          ? -1
          : keyboardActive || canEditFilled
            ? 0
            : -1
      }
      aria-label={
        keyboardActive
          ? answer
            ? `Blank contains ${answer.input}. Press Enter or Space to replace it with ${keyboardPickedItem.input}.`
            : `Empty blank. Press Enter or Space to place ${keyboardPickedItem.input}.`
          : canEditFilled
            ? `Blank contains ${answer.input}. Press Enter or Space to return it to the word bank.`
            : answer
              ? `Blank contains ${answer.input}.`
              : "Empty answer blank."
      }
      onFocus={() => {
        if (keyboardActive) {
          setFocusedSlot(id);
        }
      }}
      onBlur={() => {
        setFocusedSlot(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (answer && !isLocked && !showAnswer && !checkCompleted) {
          onRemove(id);
        }
      }}
      className={`answer-input-unit5-p6-q1
        ${isOver ? "drag-over-cell" : ""}
        ${preview ? "keyboard-preview-review5-p1-q1" : ""}
      `}
      style={{
        minWidth: "150px",

        minHeight: "32px",

        borderBottom: "2px solid black",

        background: isOver ? "#e8f0fe" : "transparent",

        transition: "background 0.15s",

        position: "relative",

        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        cursor:
          answer && !isLocked && !showAnswer && !checkCompleted
            ? "pointer"
            : "default",
      }}
    >
      {displayedAnswer && (
        <span
          style={{
            fontSize: "18px",
            padding: "2px 4px",
          }}
        >
          {displayedAnswer.input}
        </span>
      )}

      {isWrong && (
        <span className="error-circle-review5-p1-q1" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review5_Page1_Q1 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState({});

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     DRAG
  ================================================= */

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    }),
  );

  /* =================================================
     KEYBOARD
  ================================================= */

  const [keyboardPickedId, setKeyboardPickedId] = useState(null);

  const [focusedSlot, setFocusedSlot] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingId(null);
  };

  const playAudio = (id, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingId(id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };
  };

  /* =================================================
     USED WORDS
  ================================================= */

  const usedWordIds = new Set(
    Object.values(answers).map((answer) => answer.wordId),
  );

  /* =================================================
     ACTIVE OVERLAY
  ================================================= */

  const activeItem = activeId
    ? CORRECT_MATCHES.find((item) => `bank-${item.id}` === activeId)
    : null;

  /* =================================================
     HELPERS
  ================================================= */

  const isSlotLocked = (id) => lockedSlots.includes(id);

  const getAvailableSlots = () => SLOT_IDS.filter((id) => !isSlotLocked(id));

  const getPickedItem = () =>
    CORRECT_MATCHES.find((item) => item.id === keyboardPickedId) || null;

  /* =================================================
     PLACE ANSWER
  ================================================= */

  const placeAnswer = (item, slotId) => {
    if (!item || showAnswer || checkCompleted || isSlotLocked(slotId)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      /*
        Unique item:
        remove same ID from old slot
      */

      Object.keys(updated).forEach((key) => {
        if (updated[key]?.wordId === item.id) {
          delete updated[key];
        }
      });

      /*
        Replace target slot
      */

      updated[slotId] = {
        input: item.input,

        wordId: item.id,
      };

      return updated;
    });

    /*
      X removed only from changed slot
    */

    setWrongWords((prev) => prev.filter((id) => id !== slotId));
  };

  /* =================================================
     DRAG
  ================================================= */

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);

    const wordId = String(active.id).replace("bank-", "");

    const item = CORRECT_MATCHES.find((word) => word.id === wordId);

    if (item) {
      playAudio(item.id, item.audio);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const wordId = String(active.id).replace("bank-", "");

    const slotId = String(over.id);

    if (!SLOT_IDS.includes(slotId) || isSlotLocked(slotId)) {
      return;
    }

    const item = CORRECT_MATCHES.find((word) => word.id === wordId);

    placeAnswer(item, slotId);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  /* =================================================
     REMOVE
  ================================================= */

  const handleRemove = (slotId) => {
    if (showAnswer || checkCompleted || isSlotLocked(slotId)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[slotId];

      return updated;
    });

    setWrongWords((prev) => prev.filter((id) => id !== slotId));
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (wordId) => {
    if (!wordId || showAnswer || checkCompleted || usedWordIds.has(wordId)) {
      setKeyboardPickedId(null);

      return;
    }

    setKeyboardPickedId(wordId);

    setFocusedSlot(null);

    window.setTimeout(() => {
      const available = getAvailableSlots();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     KEYBOARD PLACE
  ================================================= */

  const handleKeyboardPlace = (slotId) => {
    const item = getPickedItem();

    if (!item || showAnswer || checkCompleted || isSlotLocked(slotId)) {
      return;
    }

    placeAnswer(item, slotId);

    const wordId = item.id;

    setKeyboardPickedId(null);

    setFocusedSlot(null);

    window.setTimeout(() => {
      bankRefs.current[wordId]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG SLOT → BANK
  ================================================= */

  const handleKeyboardClearWrong = (slotId, answer) => {
    if (!answer) return;

    const wordId = answer.wordId;

    handleRemove(slotId);

    setKeyboardPickedId(null);

    setFocusedSlot(null);

    window.setTimeout(() => {
      bankRefs.current[wordId]?.focus();
    }, 0);
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const handleCancelKeyboardPick = () => {
    const wordId = keyboardPickedId;

    setKeyboardPickedId(null);

    setFocusedSlot(null);

    if (wordId) {
      window.setTimeout(() => {
        bankRefs.current[wordId]?.focus();
      }, 0);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    const filled = {};

    CORRECT_MATCHES.forEach((item) => {
      filled[item.num] = {
        input: item.input,

        wordId: item.id,
      };
    });

    setAnswers(filled);

    setWrongWords([]);

    setLockedSlots([...SLOT_IDS]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedId(null);

    setFocusedSlot(null);
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      all 5 blanks required
    */

    const hasEmpty = SLOT_IDS.some((slotId) => !answers[slotId]);

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    CORRECT_MATCHES.forEach((correctItem) => {
      const given = answers[correctItem.num];

      /*
          compare by unique wordId,
          important because What's this appears twice
        */

      if (given?.wordId === correctItem.id) {
        correctCount++;

        newlyLocked.push(correctItem.num);
      } else {
        wrong.push(correctItem.num);
      }
    });

    /*
      correct only locks
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      wrong remains editable
    */

    setWrongWords(wrong);

    setKeyboardPickedId(null);

    setFocusedSlot(null);

    const total = CORRECT_MATCHES.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedSlots([...SLOT_IDS]);

      setWrongWords([]);

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

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongWords([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedId(null);

    setFocusedSlot(null);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
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
            gap: "50px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="A"
            title="Look, read, and write."
            subTitle="Use each object picture to drag the correct word into the sentence."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              width: "100%",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {CORRECT_MATCHES.map((item) => (
              <BankWord
                key={item.id}
                item={item}
                isUsed={usedWordIds.has(item.id)}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedId={keyboardPickedId}
                onKeyboardPick={handleKeyboardPick}
                registerBankRef={(id, el) => {
                  bankRefs.current[id] = el;
                }}
                playingId={playingId}
                onPlayAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="content-container-unit5-p6-q1">
            {/* ===============================================
                Q1 STATIC EXAMPLE
            =============================================== */}

            <div className="section-one-unit5-p6-q1">
              <span
                style={{
                  color: "#2c5287",

                  fontWeight: "700",

                  fontSize: "20px",
                }}
              >
                1
              </span>

              <img
                src={img1}
                alt="A blue and pink eraser."
                className="img-review5-p1-q1"
              />

              <div
                className="content-input-unit5-p6-q1"
                role="button"
                tabIndex={0}
                aria-label="Play example audio: What's this? This is an eraser."
                onClick={() => playAudio("example", eraserExampleAudio)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();

                    playAudio("example", eraserExampleAudio);
                  }
                }}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <input
                  type="text"
                  value="What's this?"
                  readOnly
                  tabIndex={-1}
                  style={{
                    pointerEvents: "none",

                    borderBottom: "2px solid black",

                    width: "200px",

                    fontSize: "18px",
                  }}
                />

                <input
                  type="text"
                  value="This is an eraser."
                  readOnly
                  tabIndex={-1}
                  style={{
                    pointerEvents: "none",

                    borderBottom: "2px solid black",

                    width: "200px",

                    fontSize: "18px",
                  }}
                />

                {playingId === "example" && (
                  <FaVolumeUp
                    size={15}
                    aria-hidden="true"
                    className="audio-icon-example-review5-p1-q1"
                  />
                )}
              </div>
            </div>

            {/* ===============================================
                Q2
            =============================================== */}

            <div className="section-two-unit5-p6-q1">
              <span
                style={{
                  color: "#2c5287",

                  fontWeight: "700",

                  fontSize: "20px",
                }}
              >
                2
              </span>

              <img src={img2} alt="A red pen." className="img-review5-p1-q1" />

              <div className="content-input-unit5-p6-q1">
                <input
                  type="text"
                  value="What's this?"
                  readOnly
                  tabIndex={-1}
                  style={{
                    pointerEvents: "none",

                    borderBottom: "2px solid black",

                    width: "200px",

                    fontSize: "18px",
                  }}
                />

                <div
                  style={{
                    display: "flex",

                    alignItems: "flex-end",

                    gap: "4px",

                    fontSize: "18px",
                  }}
                >
                  <input
                    type="text"
                    value="This is a"
                    readOnly
                    tabIndex={-1}
                    style={{
                      pointerEvents: "none",

                      borderBottom: "2px solid black",

                      width: "90px",

                      fontSize: "18px",
                    }}
                  />
                  <DropSlot
                    id="input1"
                    answer={answers["input1"]}
                    isWrong={wrongWords.includes("input1")}
                    isLocked={isSlotLocked("input1")}
                    showAnswer={showAnswer}
                    checkCompleted={checkCompleted}
                    keyboardPickedItem={getPickedItem()}
                    focusedSlot={focusedSlot}
                    setFocusedSlot={setFocusedSlot}
                    slotRefs={slotRefs}
                    getAvailableSlots={getAvailableSlots}
                    onKeyboardPlace={handleKeyboardPlace}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onRemove={handleRemove}
                  />
                  .
                </div>
              </div>
            </div>

            {/* ===============================================
                Q3
            =============================================== */}

            <div className="section-three-unit5-p6-q1">
              <span
                style={{
                  color: "#2c5287",

                  fontWeight: "700",

                  fontSize: "20px",
                }}
              >
                3
              </span>

              <img
                src={img3}
                alt="A colorful world map."
                className="img-review5-p1-q1"
              />

              <div className="content-input-unit5-p6-q1">
                <div
                  style={{
                    display: "flex",

                    alignItems: "flex-end",

                    gap: "4px",

                    fontSize: "18px",
                  }}
                >
                  <DropSlot
                    id="input2"
                    answer={answers["input2"]}
                    isWrong={wrongWords.includes("input2")}
                    isLocked={isSlotLocked("input2")}
                    showAnswer={showAnswer}
                    checkCompleted={checkCompleted}
                    keyboardPickedItem={getPickedItem()}
                    focusedSlot={focusedSlot}
                    setFocusedSlot={setFocusedSlot}
                    slotRefs={slotRefs}
                    getAvailableSlots={getAvailableSlots}
                    onKeyboardPlace={handleKeyboardPlace}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onRemove={handleRemove}
                  />
                  ?
                </div>

                <div
                  style={{
                    display: "flex",

                    alignItems: "flex-end",

                    gap: "4px",

                    fontSize: "18px",
                  }}
                >
                  <DropSlot
                    id="input3"
                    answer={answers["input3"]}
                    isWrong={wrongWords.includes("input3")}
                    isLocked={isSlotLocked("input3")}
                    showAnswer={showAnswer}
                    checkCompleted={checkCompleted}
                    keyboardPickedItem={getPickedItem()}
                    focusedSlot={focusedSlot}
                    setFocusedSlot={setFocusedSlot}
                    slotRefs={slotRefs}
                    getAvailableSlots={getAvailableSlots}
                    onKeyboardPlace={handleKeyboardPlace}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onRemove={handleRemove}
                  />
                  .
                </div>
              </div>
            </div>

            {/* ===============================================
                Q4
            =============================================== */}

            <div className="section-four-unit5-p6-q1">
              <span
                style={{
                  color: "#2c5287",

                  fontWeight: "700",

                  fontSize: "20px",
                }}
              >
                4
              </span>

              <img
                src={img4}
                alt="A globe on a stand."
                className="img-review5-p1-q1"
              />

              <div className="content-input-unit5-p6-q1">
                <div
                  style={{
                    display: "flex",

                    alignItems: "flex-end",

                    gap: "4px",

                    fontSize: "18px",
                  }}
                >
                  <DropSlot
                    id="input4"
                    answer={answers["input4"]}
                    isWrong={wrongWords.includes("input4")}
                    isLocked={isSlotLocked("input4")}
                    showAnswer={showAnswer}
                    checkCompleted={checkCompleted}
                    keyboardPickedItem={getPickedItem()}
                    focusedSlot={focusedSlot}
                    setFocusedSlot={setFocusedSlot}
                    slotRefs={slotRefs}
                    getAvailableSlots={getAvailableSlots}
                    onKeyboardPlace={handleKeyboardPlace}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onRemove={handleRemove}
                  />
                  ?
                </div>

                <div
                  style={{
                    display: "flex",

                    alignItems: "flex-end",

                    gap: "4px",

                    fontSize: "22px",
                  }}
                >
                  <DropSlot
                    id="input5"
                    answer={answers["input5"]}
                    isWrong={wrongWords.includes("input5")}
                    isLocked={isSlotLocked("input5")}
                    showAnswer={showAnswer}
                    checkCompleted={checkCompleted}
                    keyboardPickedItem={getPickedItem()}
                    focusedSlot={focusedSlot}
                    setFocusedSlot={setFocusedSlot}
                    slotRefs={slotRefs}
                    getAvailableSlots={getAvailableSlots}
                    onKeyboardPlace={handleKeyboardPlace}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onRemove={handleRemove}
                  />
                  .
                </div>
              </div>
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
              className="show-answer-btn swal-continue"
              onClick={showAnswers}
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeItem ? (
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
            {activeItem.input}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review5_Page1_Q1;
