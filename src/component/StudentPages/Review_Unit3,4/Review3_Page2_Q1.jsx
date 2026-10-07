import React, { useRef, useState } from "react";

import bat from "../../../assets/unit4/imgs/U4P35EXED-01.svg";
import cap from "../../../assets/unit4/imgs/U4P35EXED-02.svg";
import ant from "../../../assets/unit4/imgs/U4P35EXED-03.svg";
import dad from "../../../assets/unit4/imgs/U4P35EXED-04.svg";
import ant2 from "../../../assets/unit4/imgs/U4P35EXED-05.svg";
import dad2 from "../../../assets/unit4/imgs/U4P35EXED-06.svg";

import ratAudio from "../../../assets/unit4/Page 35 - D/rat.mp3";
import capAudio from "../../../assets/unit4/Page 35 - D/cap.mp3";
import antAudio from "../../../assets/unit4/Page 35 - D/ant.mp3";
import batAudio from "../../../assets/unit4/Page 35 - D/bat.mp3";
import dadAudio from "../../../assets/unit4/Page 35 - D/dad.mp3";
import panAudio from "../../../assets/unit4/Page 35 - D/pan.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import "./Review3_Page2_Q1.css";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* ======================================================
   DRAGGABLE WORD
====================================================== */

const DraggableWord = ({
  id,
  word,
  audio,

  disabled,
  isUsed,

  keyboardPickedWord,
  onKeyboardPick,

  playingWord,
  playWordAudio,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked = keyboardPickedWord === word;

  const isPlaying = playingWord === word;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <span
        ref={(el) => {
          setNodeRef(el);

          bankRefs.current[word] = el;
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
            ? `${word} selected. Press Tab to choose an answer box.`
            : `${word}. Press Enter or Space to select.`
        }
        onClick={(e) => {
          e.stopPropagation();

          if (isDragging) return;

          /*
            Mouse click = audio
          */
          playWordAudio(word, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            /*
              play audio
            */
            playWordAudio(word, audio);

            /*
              keyboard drag
            */
            onKeyboardPick(word);
          }
        }}
        className={`review3-p2-q1-bank-word ${
          isPicked ? "keyboard-picked-word-review3-p2-q1" : ""
        }`}
        style={{
          padding: "7px 14px",

          border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

          borderRadius: "8px",

          background: isPicked ? "#dbeafe" : isUsed ? "#f0f2f5" : "white",

          fontWeight: "bold",

          cursor: isDisabled ? "default" : "grab",

          opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

          color: isUsed ? "#9aa3b0" : "inherit",

          display: "inline-block",

          transition: "all 0.2s ease",

          userSelect: "none",

          touchAction: "none",
        }}
      >
        {word}
      </span>

      {isPlaying && (
        <FaVolumeUp
          size={16}
          aria-hidden="true"
          className="audio-icon-review3-p2-q1"
        />
      )}
    </span>
  );
};

/* ======================================================
   DROP SLOT
====================================================== */

const DropSlot = ({
  index,
  value,

  isWrong,
  locked,

  showAnswer,
  checkCompleted,

  keyboardPickedWord,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,

  getAvailableSlotIndexes,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const id = `slot-${index}`;

  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const canEditFilled =
    !!value && !keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === id;

  const displayValue = showPreview ? keyboardPickedWord : value;

  const handleKeyDown = (e) => {
    /* =================================================
       FILLED SLOT → RETURN TO BANK
    ================================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlotIndexes();

      if (!available.length) {
        return;
      }

      const currentPosition = available.indexOf(index);

      let nextPosition;

      if (e.shiftKey) {
        nextPosition =
          currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
      } else {
        nextPosition =
          currentPosition === -1 || currentPosition === available.length - 1
            ? 0
            : currentPosition + 1;
      }

      const nextIndex = available[nextPosition];

      slotRefs.current[nextIndex]?.focus();

      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(index);

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

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
      className={`q-input-review3-p2-q1 ${
        isOver && !locked ? "drag-over-cell" : ""
      } ${showPreview ? "keyboard-drop-preview-review3-p2-q1" : ""}`}
      role="button"
      tabIndex={
        locked || showAnswer || checkCompleted
          ? -1
          : keyboardDropActive || canEditFilled
            ? 0
            : -1
      }
      aria-label={
        keyboardDropActive
          ? value
            ? `Answer box ${index + 1}. Current word ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
            : `Answer box ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}.`
          : canEditFilled
            ? `Answer box ${index + 1} contains ${value}. Press Enter or Space to return it to the word bank.`
            : value
              ? `Answer box ${index + 1}: ${value}`
              : `Empty answer box ${index + 1}`
      }
      onFocus={() => {
        if (keyboardDropActive) {
          setFocusedSlotId(id);
        }
      }}
      onBlur={() => {
        setFocusedSlotId(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={
        value && !locked && !showAnswer && !checkCompleted
          ? onRemove
          : undefined
      }
      style={{
        position: "relative",

        cursor:
          value && !locked && !showAnswer && !checkCompleted
            ? "pointer"
            : "default",
      }}
    >
      {displayValue && (
        <span
          style={{
            cursor: locked ? "default" : "pointer",

            userSelect: "none",

            display: "inline-flex",

            alignItems: "center",

            gap: "3px",
          }}
        >
          {displayValue}
        </span>
      )}

      {isWrong && (
        <span className="error-mark-input-review3-p2-q1" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* ======================================================
   MAIN
====================================================== */

const Review3_Page2_Q1 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const items = [
    {
      word: "rat",
      image: bat,
      audio: ratAudio,
      alt: "A brown rat with a long tail.",
    },

    {
      word: "cap",
      image: cap,
      audio: capAudio,
      alt: "A blue and red baseball cap.",
    },

    {
      word: "ant",
      image: ant,
      audio: antAudio,
      alt: "A red ant.",
    },

    {
      word: "bat",
      image: dad,
      audio: batAudio,
      alt: "A baseball bat.",
    },

    {
      word: "dad",
      image: ant2,
      audio: dadAudio,
      alt: "A father hugging his child.",
    },

    {
      word: "pan",
      image: dad2,
      audio: panAudio,
      alt: "A frying pan with a handle.",
    },
  ];

  const correctAnswers = items.map((item) => item.word);

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(["", "", "", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedIndexes, setLockedIndexes] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =====================================================
     AUDIO
  ===================================================== */

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

  const playWordAudio = (word, src) => {
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

  /* =====================================================
     HELPERS
  ===================================================== */

  const isLocked = (index) => lockedIndexes.includes(index);

  const usedWords = new Set(answers.filter(Boolean));

  const getAvailableSlotIndexes = () =>
    answers
      .map((_, index) => index)
      .filter((index) => !isLocked(index) && !showAnswer && !checkCompleted);

  const getFirstAvailableWord = (updatedAnswers) => {
    const used = new Set(updatedAnswers.filter(Boolean));

    return correctAnswers.find((word) => !used.has(word));
  };

  /* =====================================================
     SENSORS
  ===================================================== */

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

  /* =====================================================
     DRAG START
  ===================================================== */

  const onDragStart = ({ active }) => {
    setActiveWord(active.id.replace("word-", ""));
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const word = active.id.replace("word-", "");

    const index = Number(String(over.id).replace("slot-", ""));

    if (isLocked(index)) {
      return;
    }

    let oldIndex = -1;

    setAnswers((prev) => {
      const updated = [...prev];

      oldIndex = updated.findIndex((item) => item === word);

      if (oldIndex !== -1 && oldIndex !== index && !isLocked(oldIndex)) {
        updated[oldIndex] = "";
      }

      /*
        replace مباشرة
      */
      updated[index] = word;

      return updated;
    });

    /*
      X فقط عن الخانات
      المتغيرة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index && i !== oldIndex));
  };

  const onDragCancel = () => {
    setActiveWord(null);
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted || usedWords.has(word)) {
      return;
    }

    setKeyboardPickedWord(word);

    setFocusedSlotId(null);

    requestAnimationFrame(() => {
      const available = getAvailableSlotIndexes();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DROP
  ===================================================== */

  const handleKeyboardDrop = (index) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isLocked(index)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    const updated = [...answers];

    const oldIndex = updated.findIndex((item) => item === word);

    if (oldIndex !== -1 && oldIndex !== index && !isLocked(oldIndex)) {
      updated[oldIndex] = "";
    }

    /*
      REPLACE:
      إذا الهدف فيه كلمة ثانية
      ترجع هي تلقائيًا للبنك
    */

    updated[index] = word;

    setAnswers(updated);

    setWrongInputs((prev) => prev.filter((i) => i !== index && i !== oldIndex));

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    /*
      بعد التثبيت
      روح لأول كلمة متاحة
    */

    window.setTimeout(() => {
      const nextWord = getFirstAvailableWord(updated);

      if (nextWord) {
        bankRefs.current[nextWord]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     WRONG SLOT AFTER CHECK
  ===================================================== */

  const handleKeyboardClearWrong = (index, currentWord) => {
    if (showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    /*
      X فقط نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    /*
      رجع focus لنفس
      الكلمة بالبنك
    */

    window.setTimeout(() => {
      if (currentWord && bankRefs.current[currentWord]) {
        bankRefs.current[currentWord]?.focus();

        return;
      }

      const nextWord = getFirstAvailableWord(updated);

      if (nextWord) {
        bankRefs.current[nextWord]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     ESCAPE
  ===================================================== */

  const handleCancelKeyboardPick = () => {
    const word = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (word && bankRefs.current[word]) {
        bankRefs.current[word]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     MOUSE REMOVE
  ===================================================== */

  const removeAnswer = (index) => {
    if (showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((answer) => answer === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let score = 0;

    const wrong = [];

    const newlyLocked = [];

    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        score++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      الصح فقط يقفل
    */

    setLockedIndexes((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      الغلط فقط
    */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (score === total) {
      setLockedIndexes(correctAnswers.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(message);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers([...correctAnswers]);

    setWrongInputs([]);

    setLockedIndexes(correctAnswers.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(["", "", "", "", "", ""]);

    setWrongInputs([]);

    setLockedIndexes([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
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
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="D"
            title="Look and write."
            subTitle="Match rat, cap, ant, bat, dad, and pan to their pictures."
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

              width: "100%",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {items.map((item) => (
              <DraggableWord
                key={item.word}
                id={`word-${item.word}`}
                word={item.word}
                audio={item.audio}
                disabled={showAnswer || checkCompleted}
                isUsed={usedWords.has(item.word)}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                playingWord={playingWord}
                playWordAudio={playWordAudio}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              IMAGES + SLOTS
          ================================================= */}

          <div className="row-content10-review3-p2-q1">
            {items.map((item, index) => (
              <div className="row2-review3-p2-q1" key={item.word}>
                <img
                  src={item.image}
                  className="q-img-review3-p2-q1"
                  alt={item.alt}
                />

                <DropSlot
                  index={index}
                  value={answers[index]}
                  isWrong={wrongInputs.includes(index)}
                  locked={isLocked(index)}
                  showAnswer={showAnswer}
                  checkCompleted={checkCompleted}
                  keyboardPickedWord={keyboardPickedWord}
                  focusedSlotId={focusedSlotId}
                  setFocusedSlotId={setFocusedSlotId}
                  slotRefs={slotRefs}
                  getAvailableSlotIndexes={getAvailableSlotIndexes}
                  onKeyboardDrop={handleKeyboardDrop}
                  onKeyboardClearWrong={handleKeyboardClearWrong}
                  onCancelKeyboardPick={handleCancelKeyboardPick}
                  onRemove={() => removeAnswer(index)}
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
        {activeWord ? (
          <span
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "#fff",

              fontWeight: "bold",

              boxShadow: "0 5px 15px rgba(0,0,0,.2)",

              display: "inline-block",
            }}
          >
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review3_Page2_Q1;
