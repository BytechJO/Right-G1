import React, { useRef, useState } from "react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";

import bat from "../../../assets/unit6/imgs/U6P50EXEB-01.svg";
import cap from "../../../assets/unit6/imgs/U6P50EXEB-02.svg";
import ant from "../../../assets/unit6/imgs/U6P50EXEB-03.svg";
import dad from "../../../assets/unit6/imgs/U6P50EXEB-04.svg";

import climbAudio from "../../../assets/unit6/sounds/Page 50 - B/climb a tree.mp3";
import fishAudio from "../../../assets/unit6/sounds/Page 50 - B/fish.mp3";
import flyKiteAudio from "../../../assets/unit6/sounds/Page 50 - B/fly a kite.mp3";
import rideBikeAudio from "../../../assets/unit6/sounds/Page 50 - B/ride a bike.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import "./Unit6_Page5_Q3.css";

/* =====================================================
   DATA
===================================================== */

const WORDS = [
  {
    word: "climb a tree",
    audio: climbAudio,
  },
  {
    word: "fly a kite",
    audio: flyKiteAudio,
  },
  {
    word: "fish",
    audio: fishAudio,
  },
  {
    word: "ride a bike",
    audio: rideBikeAudio,
  },
];

const CORRECT = ["fly a kite", "fish", "ride a bike", "climb a tree"];

const IMAGES = [
  {
    src: bat,
    alt: "A girl flying a kite near a tree.",
  },
  {
    src: cap,
    alt: "A boy fishing from a small boat.",
  },
  {
    src: ant,
    alt: "A child riding a bicycle outdoors.",
  },
  {
    src: dad,
    alt: "An animal climbing a tree trunk.",
  },
];

/* =====================================================
   WORD CHIP
===================================================== */

const WordChip = ({
  word,
  audio,
  index,

  used,
  showAnswer,
  checkCompleted,

  keyboardPickedWord,
  onKeyboardPick,

  registerBankRef,

  playingWord,
  onPlayAudio,
}) => {
  const disabled = used || showAnswer || checkCompleted;

  const isPicked = keyboardPickedWord === word;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,
    disabled,
  });

  const handleKeyboardActivate = () => {
    if (disabled) return;

    onPlayAudio(word, audio);

    onKeyboardPick(isPicked ? null : word);
  };

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        registerBankRef(word, el);
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
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${word} selected. Press Tab to choose a picture, then press Enter or Space to place it.`
          : `${word}. Press Enter or Space to hear and select this phrase.`
      }
      className={[
        "word-chip",
        "word-chip-accessible-u6-p5-q3",
        isDragging ? "is-dragging" : "",
        disabled ? "chip-disabled" : "",
        used ? "chip-used" : "",
        isPicked ? "keyboard-picked-u6-p5-q3" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => {
        if (disabled) return;

        /*
          Mouse click = audio only.
          Drag stays normal.
        */
        onPlayAudio(word, audio);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          handleKeyboardActivate();
        }
      }}
      style={{
        position: "relative",
      }}
    >
      <strong className="chip-number">{index + 1}.</strong> {word}
      {playingWord === word && (
        <FaVolumeUp
          size={15}
          aria-hidden="true"
          className="audio-icon-u6-p5-q3"
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
  value,

  isWrong,
  isLocked,

  showAnswer,
  checkCompleted,

  keyboardPickedWord,

  focusedSlot,
  setFocusedSlot,

  slotRefs,

  getAvailableSlots,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onReturn,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,

    disabled: isLocked || showAnswer || checkCompleted,
  });

  /* =================================================
     PICKED WORD → SLOT TARGET MODE
  ================================================= */

  const keyboardActive =
    !!keyboardPickedWord && !isLocked && !showAnswer && !checkCompleted;

  /* =================================================
     NEW DRAG PATTERN

     أي slot معبّى ولسا مش locked
     لازم يضل reachable بالـTab
     حتى قبل Check
  ================================================= */

  const canEditFilled =
    !!value &&
    !keyboardPickedWord &&
    !isLocked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardActive && focusedSlot === index;

  const displayedValue = showPreview ? keyboardPickedWord : value;

  /* =================================================
     KEYBOARD
  ================================================= */

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT → RETURN TO BANK
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardActive) return;

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlots();

      if (!available.length) return;

      const currentIndex = available.indexOf(index);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextSlot = available[nextIndex];

      slotRefs.current[nextSlot]?.focus();

      return;
    }

    /* =========================================
       PLACE / REPLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(index);

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

        slotRefs.current[index] = el;
      }}
      role="button"
      tabIndex={
        isLocked || showAnswer || checkCompleted
          ? -1
          : keyboardActive || canEditFilled
            ? 0
            : -1
      }
      aria-label={
        keyboardActive
          ? value
            ? `Answer area contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
            : `Empty answer area. Press Enter or Space to place ${keyboardPickedWord}.`
          : canEditFilled
            ? `Answer area contains ${value}. Press Enter or Space to return it to the word bank.`
            : value
              ? `Answer area contains ${value}.`
              : "Empty answer area."
      }
      onFocus={() => {
        if (keyboardActive) {
          setFocusedSlot(index);
        }
      }}
      onBlur={() => {
        setFocusedSlot(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (!isLocked && !showAnswer && !checkCompleted && value) {
          onReturn();
        }
      }}
      className={[
        "drop-slot-unit6-pg5-q3",

        isOver ? "slot-over" : "",

        value ? "slot-filled" : "slot-empty",

        isLocked ? "slot-locked" : "",

        !isLocked && value ? "slot-returnable" : "",

        showPreview ? "keyboard-preview-u6-p5-q3" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="slot-value">{displayedValue}</span>

      {isWrong && value && (
        <span className="error-mark" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};
/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit6_Page5_Q3 = () => {
  const [answers, setAnswers] = useState([null, null, null, null]);

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* =================================================
     KEYBOARD
  ================================================= */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlot, setFocusedSlot] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

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

  const playAudio = (word, src) => {
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

  /* =================================================
     SENSORS
  ================================================= */

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
     HELPERS
  ================================================= */

  const usedWords = new Set(answers.filter(Boolean));

  const isSlotLocked = (index) => lockedSlots.includes(index);

  const getAvailableSlots = () =>
    CORRECT.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (word, targetIndex) => {
    if (showAnswer || checkCompleted || isSlotLocked(targetIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        Unique word:
        remove from old slot first
      */

      const oldIndex = updated.indexOf(word);

      if (oldIndex !== -1) {
        updated[oldIndex] = null;
      }

      /*
        Replace target
      */

      updated[targetIndex] = word;

      return updated;
    });

    /*
      Clear X only from changed target
    */

    setWrongInputs((prev) => prev.filter((index) => index !== targetIndex));
  };

  /* =================================================
     DRAG
  ================================================= */

  const handleDragStart = ({ active }) => {
    const word = String(active.id).replace(/^word-/, "");

    setActiveWord(word);

    /*
      Sound on drag start too
    */

    const option = WORDS.find((item) => item.word === word);

    if (option) {
      playAudio(option.word, option.audio);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (showAnswer || checkCompleted || !over) {
      return;
    }

    const word = String(active.id).replace(/^word-/, "");

    const match = String(over.id).match(/^slot-(\d+)$/);

    if (!match) return;

    const targetIndex = Number(match[1]);

    if (isSlotLocked(targetIndex)) {
      return;
    }

    placeWord(word, targetIndex);
  };

  const handleDragCancel = () => {
    setActiveWord(null);
  };

  /* =================================================
     RETURN FROM SLOT
  ================================================= */

  const handleReturn = (slotIndex) => {
    if (showAnswer || checkCompleted || isSlotLocked(slotIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[slotIndex] = null;

      return updated;
    });

    setWrongInputs((prev) => prev.filter((index) => index !== slotIndex));
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (word) => {
    if (!word || showAnswer || checkCompleted || usedWords.has(word)) {
      setKeyboardPickedWord(null);

      return;
    }

    setKeyboardPickedWord(word);

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
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (targetIndex) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(targetIndex)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    placeWord(word, targetIndex);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    /*
      Return to same bank item.
      If it became used, focus will simply
      move naturally on next Tab.
    */

    window.setTimeout(() => {
      bankRefs.current[word]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG SLOT → BANK
  ================================================= */

  const handleKeyboardClearWrong = (slotIndex, currentWord) => {
    if (showAnswer || checkCompleted || isSlotLocked(slotIndex)) {
      return;
    }

    handleReturn(slotIndex);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    /*
      Required correction pattern:
      return focus to same word in bank
    */

    window.setTimeout(() => {
      bankRefs.current[currentWord]?.focus();
    }, 0);
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const handleCancelKeyboardPick = () => {
    const word = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    if (word) {
      window.setTimeout(() => {
        bankRefs.current[word]?.focus();
      }, 0);
    }
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((answer) => !answer)) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let score = 0;

    const wrong = [];

    const newlyLocked = [];

    answers.forEach((answer, index) => {
      if (answer === CORRECT[index]) {
        score++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      Correct slots lock
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      Wrong stay editable
    */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    const total = CORRECT.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedSlots(CORRECT.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setAnswers([...CORRECT]);

    setWrongInputs([]);

    setLockedSlots(CORRECT.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers([null, null, null, null]);

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

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
      <div className="q3-wrapper">
        <div
          className="div-forall"
          style={{
            gap: "80px",
          }}
        >
          <ExerciseHeader
            sectionLetter="B"
            title="Read, look, and write."
            subTitle="Drag climb a tree, fly a kite, fish, and ride a bike to the correct pictures."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div className="word-bank">
            {WORDS.map((item, index) => (
              <WordChip
                key={item.word}
                word={item.word}
                audio={item.audio}
                index={index}
                used={usedWords.has(item.word)}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                registerBankRef={(word, el) => {
                  bankRefs.current[word] = el;
                }}
                playingWord={playingWord}
                onPlayAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              IMAGE + SLOT GRID
          ================================================= */}

          <div className="slots-grid">
            {IMAGES.map((item, index) => (
              <div key={index} className="slot-card">
                <img src={item.src} alt={item.alt} className="slot-img" />

                <DropSlot
                  index={index}
                  value={answers[index]}
                  isWrong={wrongInputs.includes(index)}
                  isLocked={isSlotLocked(index)}
                  showAnswer={showAnswer}
                  checkCompleted={checkCompleted}
                  keyboardPickedWord={keyboardPickedWord}
                  focusedSlot={focusedSlot}
                  setFocusedSlot={setFocusedSlot}
                  slotRefs={slotRefs}
                  getAvailableSlots={getAvailableSlots}
                  onKeyboardDrop={handleKeyboardDrop}
                  onKeyboardClearWrong={handleKeyboardClearWrong}
                  onCancelKeyboardPick={handleCancelKeyboardPick}
                  onReturn={() => handleReturn(index)}
                />
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

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord && (
          <span className="word-chip is-dragging overlay-chip">
            {activeWord}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit6_Page5_Q3;
