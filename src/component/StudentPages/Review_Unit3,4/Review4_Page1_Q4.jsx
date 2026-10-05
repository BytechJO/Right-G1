import React, { useRef, useState } from "react";

import deer from "../../../assets/unit4/imgs/U4P36EXED-01.svg";
import taxi from "../../../assets/unit4/imgs/U4P36EXED-02.svg";
import dish from "../../../assets/unit4/imgs/U4P36EXED-03.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review4_Page1_Q4.css";

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

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import blueQuestionAudio from "../../../assets/unit4/Page 36 - D/Is it a blue.mp3";
import greenTriangleAudio from "../../../assets/unit4/Page 36 - D/Is it a green triangle.mp3";
import redSquareAudio from "../../../assets/unit4/Page 36 - D/Is it a red square.mp3";

import itIsAudio from "../../../assets/unit4/Page 36 - D/it is.mp3";
import itIsntAudio from "../../../assets/unit4/Page 36 - D/it isn't.mp3";
import squareYesAudio from "../../../assets/unit4/Page 36 - D/square Yes, it is.mp3";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    img: deer,
    question: "Is it a green triangle? Yes,",
    correct: "it is",
    questionAudio: greenTriangleAudio,
    alt: "A green triangle.",
  },

  {
    img: taxi,
    question: "Is it a red square? No,",
    correct: "it isn't",
    questionAudio: redSquareAudio,
    alt: "A red circle.",
  },

  {
    img: dish,
    question: "Is it a blue ?",
    correct: "square Yes, it is",
    questionAudio: blueQuestionAudio,
    alt: "A blue square.",
  },
];

const wordBank = [
  {
    word: "it is",
    audio: itIsAudio,
  },

  {
    word: "it isn't",
    audio: itIsntAudio,
  },

  {
    word: "square Yes, it is",
    audio: squareYesAudio,
  },
];

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  word,
  audio,

  isUsed,
  disabled,

  keyboardPickedWord,
  onKeyboardPick,

  playingKey,
  playAudio,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${word}`,
    disabled: isUsed || disabled,
  });

  const isDisabled = isUsed || disabled;

  const isPicked = keyboardPickedWord === word;

  const isPlaying = playingKey === `bank-${word}`;

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
            : `${word}. Press Enter or Space to hear and select it.`
        }
        onClick={() => {
          playAudio(`bank-${word}`, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            playAudio(`bank-${word}`, audio);

            onKeyboardPick(word);
          }
        }}
        className={`review4-p1-q4-bank-chip ${
          isPicked ? "keyboard-picked-word-review4-p1-q4" : ""
        }`}
        style={{
          padding: "7px 14px",

          border: `2px solid ${isUsed ? "#b0b0b0" : "#2c5287"}`,

          borderRadius: "8px",

          background: isPicked ? "#dbeafe" : isUsed ? "#e0e0e0" : "white",

          fontWeight: "bold",

          color: isUsed ? "#999" : undefined,

          cursor: isDisabled ? "default" : isDragging ? "grabbing" : "grab",

          opacity: isDragging ? 0.35 : isUsed ? 0.45 : 1,

          transition: "all 0.2s ease",

          userSelect: "none",

          touchAction: "none",

          display: "inline-block",
        }}
      >
        {word}
      </span>

      {isPlaying && (
        <FaVolumeUp
          size={16}
          aria-hidden="true"
          className="audio-icon-review4-p1-q4"
        />
      )}
    </span>
  );
};

/* =====================================================
   SLOT
===================================================== */

const SlotDropZone = ({
  id,
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
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const canFixWrong =
    !!value &&
    isWrong &&
    !keyboardPickedWord &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === id;

  const displayValue = showPreview ? keyboardPickedWord : value;

  const handleKeyDown = (e) => {
    /* =========================================
       WRONG AFTER CHECK
    ========================================= */

    if (canFixWrong && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

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

    /* =========================================
       ENTER / SPACE
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
      className={`q-input-review4-p1-q4 ${
        isOver && !locked ? "drag-over-cell" : ""
      } ${showPreview ? "keyboard-drop-preview-review4-p1-q4" : ""}`}
      role="button"
      tabIndex={
        locked || showAnswer || checkCompleted
          ? -1
          : keyboardDropActive || canFixWrong
            ? 0
            : -1
      }
      aria-label={
        keyboardDropActive
          ? value
            ? `Answer box ${index + 1}. Current answer ${value}. Press Enter to replace it with ${keyboardPickedWord}.`
            : `Answer box ${index + 1}. Press Enter to place ${keyboardPickedWord}.`
          : canFixWrong
            ? `${value} is incorrect. Press Enter to return it to the word bank.`
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
      onClick={() => {
        if (value && !locked && !showAnswer && !checkCompleted) {
          onRemove(id);
        }
      }}
      style={{
        cursor:
          value && !locked && !showAnswer && !checkCompleted
            ? "pointer"
            : "default",

        transition: "background 0.15s",

        position: "relative",
      }}
    >
      {displayValue || ""}

      {isWrong && (
        <span className="wrong-icon-review4-p1-q4" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const Review4_Page1_Q4 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(Array(data.length).fill(""));

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedIndexes, setLockedIndexes] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD DRAG
  ===================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const activeWord = activeId ? activeId.replace("bank-", "") : null;

  const isLocked = (index) => lockedIndexes.includes(index);

  const isWordUsed = (word) => answers.includes(word);

  const getAvailableSlotIndexes = () =>
    answers
      .map((_, index) => index)
      .filter((index) => !isLocked(index) && !showAnswer && !checkCompleted);

  const getFirstAvailableWord = (updatedAnswers) => {
    const used = new Set(updatedAnswers.filter(Boolean));

    return wordBank.find((item) => !used.has(item.word))?.word;
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

  const handleDragStart = ({ active }) => {
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

    const word = active.id.replace("bank-", "");

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const destIndex = Number(String(over.id).replace("slot-", ""));

    if (isLocked(destIndex)) {
      return;
    }

    let oldIndex = -1;

    setAnswers((prev) => {
      const updated = [...prev];

      oldIndex = updated.findIndex((item) => item === word);

      if (oldIndex !== -1 && oldIndex !== destIndex && !isLocked(oldIndex)) {
        updated[oldIndex] = "";
      }

      updated[destIndex] = word;

      return updated;
    });

    /*
      X فقط عن الخانات المتغيرة
    */

    setWrongInputs((prev) =>
      prev.filter((index) => index !== destIndex && index !== oldIndex),
    );
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted || isWordUsed(word)) {
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

    updated[index] = word;

    setAnswers(updated);

    setWrongInputs((prev) => prev.filter((i) => i !== index && i !== oldIndex));

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      const nextWord = getFirstAvailableWord(updated);

      if (nextWord) {
        bankRefs.current[nextWord]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     WRONG AFTER CHECK
  ===================================================== */

  const handleKeyboardClearWrong = (index, currentWord) => {
    if (showAnswer || checkCompleted || isLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (currentWord && bankRefs.current[currentWord]) {
        bankRefs.current[currentWord]?.focus();
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
     REMOVE
  ===================================================== */

  const handleRemove = (slotId) => {
    const index = Number(slotId.replace("slot-", ""));

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
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((answer) => answer.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      return;
    }

    const wrong = [];

    const newlyLocked = [];

    let correctCount = 0;

    answers.forEach((answer, index) => {
      const correct =
        answer.trim().toLowerCase() === data[index].correct.toLowerCase();

      if (correct) {
        correctCount++;

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
      setLockedIndexes(data.map((_, index) => index));

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
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(data.length).fill(""));

    setWrongInputs([]);

    setLockedIndexes([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers(data.map((item) => item.correct));

    setWrongInputs([]);

    setLockedIndexes(data.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
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
          <ExerciseHeaderReview
            sectionLetter="D"
            title="Look, read, and write."
            subTitle="Drag the correct words into each question and answer about shapes."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              width: "100%",

              alignItems: "center",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {wordBank.map((item) => (
              <BankChip
                key={item.word}
                word={item.word}
                audio={item.audio}
                isUsed={isWordUsed(item.word)}
                disabled={showAnswer || checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                playingKey={playingKey}
                playAudio={playAudio}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          {data.map((item, index) => {
            const questionKey = `question-${index}`;

            const isQuestionPlaying = playingKey === questionKey;

            return (
              <div className="question-row-review4-p1-q4" key={index}>
                <span className="q-number">{index + 1}.</span>

                {/* =========================================
                      IMAGE
                  ========================================= */}

                <img
                  src={item.img}
                  className="shape-img"
                  alt={item.alt}
                  style={{
                    height: "100px",

                    width: "100px",
                  }}
                />

                <div className="question-text-review4-p1-q4">
                  {/* =========================================
                        QUESTION AUDIO
                    ========================================= */}

                  <h6
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio for ${item.question}`}
                    onClick={() => playAudio(questionKey, item.questionAudio)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        e.stopPropagation();

                        playAudio(questionKey, item.questionAudio);
                      }
                    }}
                    className="question-audio-review4-p1-q4"
                    style={{
                      position: "relative",

                      cursor: "pointer",
                    }}
                  >
                    {item.question}

                    {isQuestionPlaying && (
                      <FaVolumeUp
                        size={16}
                        aria-hidden="true"
                        className="question-audio-icon-review4-p1-q4"
                      />
                    )}
                  </h6>

                  {/* =========================================
                        DROP SLOT
                    ========================================= */}

                  <SlotDropZone
                    id={`slot-${index}`}
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
                    onRemove={handleRemove}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
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
  );
};

export default Review4_Page1_Q4;
