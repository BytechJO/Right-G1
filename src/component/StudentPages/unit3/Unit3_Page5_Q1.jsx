import React, { useRef, useState } from "react";

import bat from "../../../assets/unit3/imgs3/P26exeA1-01.svg";
import cap from "../../../assets/unit3/imgs3/P26exeA1-02.svg";
import ant from "../../../assets/unit3/imgs3/P26exeA1-03.svg";
import dad from "../../../assets/unit3/imgs3/P26exeA1-04.svg";

import antAudio from "../../../assets/unit3/Page 26 - A/ant.mp3";
import batAudio from "../../../assets/unit3/Page 26 - A/bat.mp3";
import capAudio from "../../../assets/unit3/Page 26 - A/cap.mp3";
import dadAudio from "../../../assets/unit3/Page 26 - A/dad.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import "./Unit3_Page5_Q1.css";

import { FaVolumeUp } from "react-icons/fa";
import ExerciseHeader from "../../ExerciseHeader";

// ======================================================
// DRAGGABLE WORD
// ======================================================

const DraggableWord = ({
  id,
  word,
  audio,
  disabled,
  isUsed,
  playingWord,
  onPlayAudio,

  keyboardPickedWord,
  onKeyboardPick,

  registerBankRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const [isFocused, setIsFocused] = useState(false);

  const isPlaying = playingWord === word;
  const isKeyboardPicked = keyboardPickedWord === word;

  const handleKeyboardActivation = () => {
    if (disabled || isUsed) return;

    if (isKeyboardPicked) {
      onKeyboardPick(null);
    } else {
      onKeyboardPick(word);
    }
  };

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <span
        ref={(el) => {
          setNodeRef(el);
          registerBankRef(word, el);
        }}
        {...(disabled || isUsed
          ? {}
          : {
              ...listeners,
              ...attributes,
            })}
        role="button"
        tabIndex={disabled || isUsed ? -1 : 0}
        aria-pressed={isKeyboardPicked}
        aria-disabled={disabled || isUsed}
        aria-label={
          isUsed
            ? `${word}, already used`
            : isKeyboardPicked
              ? `${word} selected. Choose an answer box and press Enter to place it.`
              : `${word}. Press Enter or Space to pick it up.`
        }
        title={isUsed ? `${word} already used` : word}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            // شغل الصوت
            onPlayAudio(word, audio);

            // اختار الكلمة
            handleKeyboardActivation();
          }
        }}
        onClick={(e) => {
          e.stopPropagation();

          // Synthetic click من Screen Reader
          if (e.detail === 0) {
            e.preventDefault();

            onPlayAudio(word, audio);
            handleKeyboardActivation();

            return;
          }

          if (isDragging) return;

          // Mouse click = audio فقط
          onPlayAudio(word, audio);
        }}
        style={{
          padding: "7px 14px",
          border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,
          borderRadius: "8px",
          height: "40px",
          width: "100px",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          background: isUsed ? "#f0f2f5" : "white",

          fontWeight: "bold",

          cursor: disabled || isUsed ? "default" : "grab",

          opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

          color: isUsed ? "#9aa3b0" : "inherit",

          touchAction: "none",
          transition: "all 0.2s ease",
          userSelect: "none",

          ...(isKeyboardPicked
            ? {
                transform: "scale(1.15)",
                outline: "3px solid #2563eb",
                outlineOffset: "4px",
                boxShadow:
                  "0 0 0 5px rgba(37,99,235,0.18), 0 6px 14px rgba(0,0,0,0.22)",
                zIndex: 20,
              }
            : isFocused
              ? {
                  outline: "3px solid #2563eb",
                  outlineOffset: "3px",
                }
              : {}),
        }}
      >
        {word}
      </span>

      {isPlaying && (
        <FaVolumeUp
          size={16}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: "white",
            borderRadius: "50%",
            padding: "2px",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      )}
    </span>
  );
};

// ======================================================
// DROP SLOT
// ======================================================

const DropSlot = ({
  index,
  value,

  isWrong,
  showAnswer,
  locked,

  onRemove,

  keyboardPickedWord,
  onKeyboardDrop,

  focusedDropIndex,
  setFocusedDropIndex,

  registerDropRef,

  availableDropIndexes,
  onMoveDropFocus,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    disabled: showAnswer || locked,
  });

  const canKeyboardDrop = keyboardPickedWord && !showAnswer && !locked;

  const isCurrentDropFocused = focusedDropIndex === index;

  const showKeyboardPreview =
    canKeyboardDrop && isCurrentDropFocused && keyboardPickedWord;

  const canEditPlacedWord = value && !showAnswer && !locked;

  const activateDrop = () => {
    if (!keyboardPickedWord || showAnswer || locked) {
      return;
    }

    onKeyboardDrop(index);
  };

  const moveFocus = (backwards = false) => {
    if (availableDropIndexes.length === 0) {
      return;
    }

    const currentPosition = availableDropIndexes.indexOf(index);

    let nextPosition;

    if (backwards) {
      nextPosition =
        currentPosition <= 0
          ? availableDropIndexes.length - 1
          : currentPosition - 1;
    } else {
      nextPosition =
        currentPosition === -1 ||
        currentPosition === availableDropIndexes.length - 1
          ? 0
          : currentPosition + 1;
    }

    onMoveDropFocus(availableDropIndexes[nextPosition]);
  };

  return (
    <div className="input-wrapper-unit3-page6-q1">
      <div
        ref={(el) => {
          setNodeRef(el);
          registerDropRef(index, el);
        }}
        className={`q-input-unit3-page6-q1 ${
          showAnswer ? "show-answer-red" : ""
        } ${isOver && !showAnswer && !locked ? "drag-over-cell" : ""}`}
        role="button"
        aria-disabled={showAnswer || locked}
        tabIndex={!showAnswer && !locked && keyboardPickedWord ? 0 : -1}
        aria-label={
          locked
            ? `Answer ${index + 1}. ${value} is correct. Answer locked.`
            : keyboardPickedWord
              ? value
                ? `Answer ${
                    index + 1
                  }. Current word ${value}. Press Enter to replace it with ${keyboardPickedWord}.`
                : `Answer ${
                    index + 1
                  }. Press Enter to place ${keyboardPickedWord}.`
              : value
                ? `Answer ${index + 1}. ${value} is placed here.`
                : `Answer ${index + 1}. Empty. Select a word first.`
        }
        onFocus={() => {
          if (!locked) {
            setFocusedDropIndex(index);
          }
        }}
        onBlur={() => {
          setFocusedDropIndex((current) =>
            current === index ? null : current,
          );
        }}
        onKeyDown={(e) => {
          if (locked) return;

          // =========================================
          // TAB بين الخانات فقط
          // =========================================

          if (keyboardPickedWord && e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();

            moveFocus(e.shiftKey);

            return;
          }

          // =========================================
          // ENTER / SPACE
          // =========================================

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            activateDrop();
          }
        }}
        onClick={(e) => {
          if (e.detail === 0) {
            e.preventDefault();
            e.stopPropagation();

            activateDrop();
          }
        }}
        style={{
          cursor: showAnswer || locked ? "default" : "pointer",

          background: locked
            ? undefined
            : isOver
              ? "rgba(28,61,126,0.10)"
              : canKeyboardDrop && isCurrentDropFocused
                ? "#dbeafe"
                : undefined,

          outline:
            !locked && canKeyboardDrop && isCurrentDropFocused
              ? "3px solid #2563eb"
              : "none",

          outlineOffset: "4px",

          transform:
            !locked && canKeyboardDrop && isCurrentDropFocused
              ? "scale(1.06)"
              : "scale(1)",

          boxShadow:
            !locked && canKeyboardDrop && isCurrentDropFocused
              ? "0 0 0 4px rgba(37,99,235,0.15)"
              : "none",

          transition:
            "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        {/* =========================================
            PLACED WORD
        ========================================= */}

        {value && !showKeyboardPreview && (
          <span
            className={`word-item ${isWrong ? "word-item-wrong" : ""} ${
              locked ? "word-item-correct" : ""
            }`}
            role={canEditPlacedWord ? "button" : undefined}
            tabIndex={canEditPlacedWord && !keyboardPickedWord ? 0 : -1}
            aria-label={
              locked
                ? `${value}. Correct answer.`
                : `${value}. Press Enter or Space to return it to the word bank.`
            }
            onClick={(e) => {
              e.stopPropagation();

              if (canEditPlacedWord) {
                onRemove();
              }
            }}
            onKeyDown={(e) => {
              if (!canEditPlacedWord) {
                return;
              }

              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();

                onRemove();
              }
            }}
          >
            {value}
          </span>
        )}

        {/* =========================================
            KEYBOARD PREVIEW
        ========================================= */}

        {showKeyboardPreview && (
          <span
            aria-hidden="true"
            className="keyboard-preview-word-unit3-page5-q1"
          >
            {keyboardPickedWord}
          </span>
        )}
      </div>

      {isWrong && !showAnswer && <span className="error-mark-input">✕</span>}
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const Unit3_Page5_Q1 = () => {
  // ======================================================
  // DATA
  // ======================================================

  const correctAnswers = ["bat", "cap", "ant", "dad"];

  const wordBank = [
    {
      word: "cap",
      audio: capAudio,
    },
    {
      word: "bat",
      audio: batAudio,
    },
    {
      word: "dad",
      audio: dadAudio,
    },
    {
      word: "ant",
      audio: antAudio,
    },
  ];

 const images = [
  {
    src: bat,
    alt: "A baseball bat.",
  },
  {
    src: cap,
    alt: "A blue and red cap.",
  },
  {
    src: ant,
    alt: "A red ant.",
  },
  {
    src: dad,
    alt: "A father hugging his child.",
  },
];

  // ======================================================
  // REFS
  // ======================================================

  const bankRefs = useRef({});
  const dropRefs = useRef([]);

  // ======================================================
  // STATE
  // ======================================================

  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  // ======================================================
  // ACCESSIBILITY
  // ======================================================

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [keyboardMessage, setKeyboardMessage] = useState("");

  // مهم:
  // Input واحد فقط يقدر يكون current
  const [focusedDropIndex, setFocusedDropIndex] = useState(null);

  // ======================================================
  // AUDIO
  // ======================================================

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
      audio.currentTime = 0;

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

  // ======================================================
  // HELPERS
  // ======================================================

  const isInputLocked = (index) => lockedInputs.includes(index);

  const usedWords = new Set(answers.filter(Boolean));

  const availableDropIndexes = answers
    .map((_, index) => index)
    .filter((index) => !lockedInputs.includes(index));

  // ======================================================
  // KEYBOARD PICK
  // ======================================================

  const handleKeyboardPick = (word) => {
    if (!word) {
      setKeyboardPickedWord(null);

      setFocusedDropIndex(null);

      setKeyboardMessage("Word selection cancelled.");

      return;
    }

    if (showAnswer || checkCompleted || usedWords.has(word)) {
      return;
    }

    setKeyboardPickedWord(word);

    setKeyboardMessage(
      `${word} selected. Choose an answer box and press Enter.`,
    );

    setTimeout(() => {
      const firstUnlockedIndex = answers.findIndex(
        (_, index) => !lockedInputs.includes(index),
      );

      if (firstUnlockedIndex !== -1) {
        // مهم
        setFocusedDropIndex(firstUnlockedIndex);

        dropRefs.current[firstUnlockedIndex]?.focus();
      }
    }, 0);
  };

  // ======================================================
  // KEYBOARD DROP
  // ======================================================

  const handleKeyboardDrop = (index) => {
    if (!keyboardPickedWord || showAnswer || lockedInputs.includes(index)) {
      return;
    }

    const placedWord = keyboardPickedWord;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = [...prev];

      // =========================================
      // احذف نفس الكلمة من أي خانة قديمة
      // =========================================

      updated.forEach((item, i) => {
        if (item === placedWord && !lockedInputs.includes(i)) {
          updated[i] = "";
        }
      });

      // =========================================
      // ضعها في الخانة الجديدة
      // =========================================

      updated[index] = placedWord;

      nextAnswers = updated;

      return updated;
    });

    // امسح X عن المكان الجديد
    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardMessage(
      `${placedWord} placed in answer ${index + 1}. Choose another word.`,
    );

    setKeyboardPickedWord(null);

    // مهم جدًا
    setFocusedDropIndex(null);

    setTimeout(() => {
      if (!nextAnswers) {
        return;
      }

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const firstAvailable = wordBank.find((item) => !usedAfter.has(item.word));

      if (firstAvailable) {
        bankRefs.current[firstAvailable.word]?.focus();
      }
    }, 0);
  };

  // ======================================================
  // DRAG SENSOR
  // ======================================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // ======================================================
  // DRAG START
  // ======================================================

  const onDragStart = ({ active }) => {
    setActiveWord(active.id.replace("bank-", ""));
  };

  // ======================================================
  // DRAG END
  // ======================================================

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const word = active.id.replace("bank-", "");

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const index = Number(String(over.id).split("-")[1]);

    if (isInputLocked(index)) {
      return;
    }

    const oldIndex = answers.findIndex((answer) => answer === word);

    if (oldIndex !== -1 && isInputLocked(oldIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const sourceIndex = updated.findIndex((a) => a === word);

      if (sourceIndex === index) {
        return prev;
      }

      const targetWord = updated[index];

      updated[index] = word;

      if (sourceIndex !== -1) {
        updated[sourceIndex] = targetWord || "";
      }

      return updated;
    });

    setWrongInputs((prev) => prev.filter((i) => i !== index && i !== oldIndex));
  };

  const onDragCancel = () => {
    setActiveWord(null);
  };

  // ======================================================
  // REMOVE ANSWER
  // ======================================================

  const removeAnswer = (index) => {
    if (showAnswer || isInputLocked(index)) {
      return;
    }

    const returnedWord = answers[index];

    if (!returnedWord) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardPickedWord(null);

    setFocusedDropIndex(null);

    setKeyboardMessage(`${returnedWord} returned to the word bank.`);

    setTimeout(() => {
      bankRefs.current[returnedWord]?.focus();
    }, 0);
  };

  // ======================================================
  // CHECK ANSWERS
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((ans) => ans === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let score = 0;

    const wrong = [];

    const correctTemp = [];

    answers.forEach((ans, index) => {
      if (ans === correctAnswers[index]) {
        score++;

        correctTemp.push(index);
      } else {
        wrong.push(index);
      }
    });

    // Lock correct only
    setLockedInputs((prev) => Array.from(new Set([...prev, ...correctTemp])));

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setFocusedDropIndex(null);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedInputs(correctAnswers.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    // إذا في غلط
    // يظل قابل للتعديل
    setCheckCompleted(false);

    if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers([...correctAnswers]);

    setWrongInputs([]);

    setLockedInputs(correctAnswers.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedDropIndex(null);

    setKeyboardMessage("Correct answers are shown.");
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    stopAudio();

    setAnswers(["", "", "", ""]);

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedDropIndex(null);

    setKeyboardMessage("");

    setTimeout(() => {
      bankRefs.current[wordBank[0].word]?.focus();
    }, 0);
  };

  // ======================================================
  // RENDER
  // ======================================================

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
          position: "relative",
        }}
      >
        {/* =========================================
            SCREEN READER
        ========================================= */}

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
            clip: "rect(0, 0, 0, 0)",
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
            gap: "80px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            questionNumber="1"
            title="Look and write."
            subTitle="Drag cap, bat, dad, and ant to their matching pictures."
          />
          {/* =========================================
              WORD BANK
          ========================================= */}

          <div
            style={{
              display: "flex",
              gap: "40px",
              padding: "10px",
              width: "100%",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {wordBank.map((item) => (
              <DraggableWord
                key={item.word}
                id={`bank-${item.word}`}
                word={item.word}
                audio={item.audio}
                disabled={showAnswer || checkCompleted}
                isUsed={usedWords.has(item.word)}
                playingWord={playingWord}
                onPlayAudio={playAudio}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                registerBankRef={(word, el) => {
                  bankRefs.current[word] = el;
                }}
              />
            ))}
          </div>

          {/* =========================================
              SLOTS + IMAGES
          ========================================= */}

          <div className="row-content10-unit3-page6-q1">
            {answers.map((value, index) => {
              const locked = isInputLocked(index);

              return (
                <div className="row2-unit3-page6-q1" key={index}>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                    }}
                  >
                    <span className="num-span">{index + 1}</span>

                    <img
                      src={images[index].src}
                      alt={images[index].alt}
                      className="q-img-unit3-page6-q1"
                    />
                  </div>

                  <span
                    style={{
                      position: "relative",
                      display: "flex",
                    }}
                  >
                    <DropSlot
                      index={index}
                      value={value}
                      isWrong={wrongInputs.includes(index)}
                      showAnswer={showAnswer}
                      locked={locked}
                      onRemove={() => removeAnswer(index)}
                      keyboardPickedWord={keyboardPickedWord}
                      onKeyboardDrop={handleKeyboardDrop}
                      focusedDropIndex={focusedDropIndex}
                      setFocusedDropIndex={setFocusedDropIndex}
                      registerDropRef={(i, el) => {
                        dropRefs.current[i] = el;
                      }}
                      availableDropIndexes={availableDropIndexes}
                      onMoveDropFocus={(i) => {
                        setFocusedDropIndex(i);

                        dropRefs.current[i]?.focus();
                      }}
                    />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================
            BUTTONS
        ========================================= */}

        <div className="action-buttons-container">
          <button
            onClick={reset}
            className="try-again-button"
            aria-label="Start again"
            title="Start again"
          >
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
            className="show-answer-btn"
            aria-label="Show answer"
            title="Show answer"
          >
            Show Answer
          </button>

          <button
            onClick={checkAnswers}
            className="check-button2"
            aria-label="Check answer"
            title="Check answer"
          >
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

export default Unit3_Page5_Q1;
