import React, { useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Page8_Q2.css";

import img1 from "../../../assets/unit1/imgs/U1P8EXEA2-01.svg";
import img2 from "../../../assets/unit1/imgs/U1P8EXEA2-02.svg";
import img3 from "../../../assets/unit1/imgs/U1P8EXEA2-03.svg";
import img4 from "../../../assets/unit1/imgs/U1P8EXEA2-04.svg";

import tableSound from "../../../assets/unit1/Page 8 - A 2/Table.mp3";
import taxiSound from "../../../assets/unit1/Page 8 - A 2/Taxi.mp3";
import deerSound from "../../../assets/unit1/Page 8 - A 2/Deer.mp3";
import dishSound from "../../../assets/unit1/Page 8 - A 2/Dish.mp3";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const exerciseData = {
  pairs: [
    { id: "pair-1", letter: "Table" },
    { id: "pair-2", letter: "Taxi" },
    { id: "pair-3", letter: "Deer" },
    { id: "pair-4", letter: "Dish" },
  ],

  images: [
    { src: img1, sound: tableSound },
    { src: img2, sound: taxiSound },
    { src: img3, sound: deerSound },
    { src: img4, sound: dishSound },
  ],

  answers: {
    "drop-1": "Table",
    "drop-2": "Taxi",
    "drop-3": "Deer",
    "drop-4": "Dish",
  },
};

const getShuffledPairs = () =>
  [...exerciseData.pairs].sort(() => Math.random() - 0.5);

const initialDroppedState = {
  "drop-1": null,
  "drop-2": null,
  "drop-3": null,
  "drop-4": null,
};

// ─────────────────────────────────────────────
// WordBankItem
// ─────────────────────────────────────────────

const WordBankItem = ({
  letter,
  isUsed,
  showAnswer,
  keyboardPickedWord,
  onKeyboardPick,
  registerBankRef,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `bank-${letter}`,
      data: {
        letter,
        source: "bank",
      },
      disabled: isUsed || showAnswer,
    });

  const [isFocused, setIsFocused] = useState(false);

  const isKeyboardPicked = keyboardPickedWord === letter;

  const handleKeyboardActivation = () => {
    if (isUsed || showAnswer) return;

    if (isKeyboardPicked) {
      onKeyboardPick(null);
    } else {
      onKeyboardPick(letter);
    }
  };

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isDragging ? 0.4 : isUsed ? 0.35 : 1,

    cursor: isUsed || showAnswer ? "default" : "grab",

    userSelect: "none",

    filter: isUsed ? "grayscale(60%)" : "none",

    transition:
      "opacity 0.2s, filter 0.2s, transform 0.15s ease, box-shadow 0.15s ease",

    ...(isKeyboardPicked
      ? {
          transform: `${CSS.Translate.toString(transform) || ""} scale(1.15)`,

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
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        registerBankRef(letter, el);
      }}
      style={style}
      className={`letter-box${isDragging ? " dragging" : ""}${
        isUsed ? " letter-box--used" : ""
      }`}
      {...(isUsed || showAnswer
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role="button"
      tabIndex={isUsed || showAnswer ? -1 : 0}
      aria-pressed={isKeyboardPicked}
      aria-disabled={isUsed || showAnswer}
      aria-label={
        isUsed
          ? `${letter}, already used`
          : isKeyboardPicked
            ? `${letter} selected. Choose an answer box and press Enter to place it.`
            : `${letter}. Press Enter to pick it up.`
      }
      title={isUsed ? `${letter} already used` : letter}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          handleKeyboardActivation();
        }
      }}
      onClick={(e) => {
        // Narrator / Screen Reader activation
        if (e.detail === 0) {
          e.preventDefault();
          e.stopPropagation();

          handleKeyboardActivation();
        }
      }}
    >
      {letter}
    </div>
  );
};

// ─────────────────────────────────────────────
// PlacedWord
// ─────────────────────────────────────────────

const PlacedWord = ({ letter, dropId, showAnswer, onReturnToBank }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed-${dropId}`,

      data: {
        letter,
        source: "drop",
        dropId,
      },

      disabled: showAnswer,
    });

  const [isFocused, setIsFocused] = useState(false);

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isDragging ? 0.4 : 1,

    cursor: showAnswer ? "default" : "pointer",

    userSelect: "none",

    ...(isFocused
      ? {
          outline: "3px solid #2563eb",

          outlineOffset: "3px",
        }
      : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="dropped-letter"
      {...(showAnswer
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role="button"
      tabIndex={showAnswer ? -1 : 0}
      aria-label={`${letter}. Press Enter to return it to the word bank.`}
      title={`Return ${letter}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => !showAnswer && onReturnToBank(dropId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          if (!showAnswer) {
            onReturnToBank(dropId);
          }
        }
      }}
    >
      {letter}
    </div>
  );
};

// ─────────────────────────────────────────────
// DropZone
// ─────────────────────────────────────────────

const DropZone = ({
  dropId,
  imageSrc,
  sound,
  index,
  droppedLetter,
  isWrong,
  showAnswer,
  onReturnToBank,
  onPlaySound,

  keyboardPickedWord,
  onKeyboardDrop,

  registerDropRef,
  totalDrops,
  onMoveDropFocus,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
    disabled: showAnswer,
  });

  const [isFocused, setIsFocused] = useState(false);

  const [isImageFocused, setIsImageFocused] = useState(false);

  const canKeyboardDrop = keyboardPickedWord && !showAnswer;

  const activateDrop = () => {
    if (!keyboardPickedWord || showAnswer) {
      return;
    }

    onKeyboardDrop(dropId, index);
  };

  return (
    <div className="image-container">
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <span
          style={{
            color: "#1c3d7e",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          {index + 1}
        </span>
      </div>

      <div className="flex flex-col gap-5 items-center">
        {/* IMAGE */}
        <img
          src={imageSrc}
          alt={`Picture ${index + 1}`}
          role="button"
          tabIndex={0}
          aria-label={`Play audio for picture ${index + 1}`}
          title="Play audio"
          onClick={() => onPlaySound(sound)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              onPlaySound(sound);
            }
          }}
          onFocus={() => setIsImageFocused(true)}
          onBlur={() => setIsImageFocused(false)}
          style={{
            cursor: "pointer",

            outline: isImageFocused ? "3px solid #2563eb" : "none",

            outlineOffset: "4px",

            transform: isImageFocused ? "scale(1.05)" : "scale(1)",

            transition: "transform 0.15s ease",
          }}
        />

        {/* DROP BOX */}
        <div
          ref={(el) => {
            setNodeRef(el);

            registerDropRef(index, el);
          }}
          className={`drop-box${isOver ? " is-over" : ""}${
            isWrong ? " wrong-drop" : ""
          }`}
          role="button"
          tabIndex={showAnswer ? -1 : 0}
          aria-label={
            keyboardPickedWord
              ? droppedLetter
                ? `Answer ${
                    index + 1
                  }. Current word ${droppedLetter}. Press Enter to replace it with ${keyboardPickedWord}.`
                : `Answer ${
                    index + 1
                  }. Press Enter to place ${keyboardPickedWord}.`
              : droppedLetter
                ? `Answer ${index + 1}. ${droppedLetter} is placed here.`
                : `Answer ${index + 1}. Empty. Select a word first.`
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            // ==================================
            // طول ما في كلمة ممسوكة
            // Tab ينحصر بالـ Drop Boxes
            // ==================================
            if (keyboardPickedWord && e.key === "Tab") {
              e.preventDefault();
              e.stopPropagation();

              let nextIndex;

              if (e.shiftKey) {
                nextIndex = index === 0 ? totalDrops - 1 : index - 1;
              } else {
                nextIndex = index === totalDrops - 1 ? 0 : index + 1;
              }

              onMoveDropFocus(nextIndex);

              return;
            }

            // ==================================
            // Enter / Space
            // حط أو استبدل الكلمة
            // ==================================
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();

              activateDrop();
            }
          }}
          onClick={(e) => {
            // Narrator synthetic click
            if (e.detail === 0) {
              e.preventDefault();
              e.stopPropagation();

              activateDrop();
            }
          }}
          style={{
            background: isOver
              ? "rgba(28,61,126,0.10)"
              : canKeyboardDrop && isFocused
                ? "#dbeafe"
                : undefined,

            outline:
              canKeyboardDrop && isFocused ? "3px solid #2563eb" : "none",

            outlineOffset: "4px",

            transform:
              canKeyboardDrop && isFocused ? "scale(1.06)" : "scale(1)",

            boxShadow:
              canKeyboardDrop && isFocused
                ? "0 0 0 4px rgba(37,99,235,0.15)"
                : "none",

            transition:
              "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
          }}
        >
          {droppedLetter ? (
            <PlacedWord
              letter={droppedLetter}
              dropId={dropId}
              showAnswer={showAnswer}
              onReturnToBank={onReturnToBank}
            />
          ) : (
            <span className="placeholder" />
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// WordBank
// ─────────────────────────────────────────────

const WordBank = ({
  shuffledPairs,
  usedLetters,
  showAnswer,

  keyboardPickedWord,
  onKeyboardPick,

  registerBankRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "letters",
  });

  return (
    <div className="word-container">
      <div
        ref={setNodeRef}
        className="letters-section-horizontal"
        style={{
          background: isOver ? "rgba(28,61,126,0.06)" : undefined,

          transition: "background 0.2s",
        }}
      >
        {shuffledPairs.map((pair) => (
          <WordBankItem
            key={pair.id}
            letter={pair.letter}
            isUsed={usedLetters.has(pair.letter)}
            showAnswer={showAnswer}
            keyboardPickedWord={keyboardPickedWord}
            onKeyboardPick={onKeyboardPick}
            registerBankRef={registerBankRef}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const Page8_Q2 = () => {
  const clickAudioRef = useRef(null);

  // ========================================
  // ACCESSIBILITY REFS
  // ========================================

  const bankRefs = useRef({});

  const dropRefs = useRef([]);

  // ========================================
  // STATES
  // ========================================

  const [droppedLetters, setDroppedLetters] = useState({
    ...initialDroppedState,
  });

  const [shuffledPairs, setShuffledPairs] = useState(getShuffledPairs());

  const [wrongDrops, setWrongDrops] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [activeDrag, setActiveDrag] = useState(null);

  // ========================================
  // ACCESSIBILITY
  // ========================================

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [keyboardMessage, setKeyboardMessage] = useState("");

  const usedLetters = new Set(Object.values(droppedLetters).filter(Boolean));

  // ========================================
  // PLAY SOUND
  // ========================================

  const playSound = (sound) => {
    if (!sound) return;

    document.querySelectorAll("audio").forEach((audio) => {
      audio.pause();
    });

    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;

      clickAudioRef.current.src = sound;

      clickAudioRef.current.play();
    }
  };

  // ========================================
  // KEYBOARD PICK
  // ========================================

  const handleKeyboardPick = (letter) => {
    if (!letter) {
      setKeyboardPickedWord(null);

      setKeyboardMessage("Word selection cancelled.");

      return;
    }

    setKeyboardPickedWord(letter);

    setKeyboardMessage(
      `${letter} selected. Choose an answer box and press Enter.`,
    );

    // مباشرة لأول Drop Box
    setTimeout(() => {
      dropRefs.current[0]?.focus();
    }, 0);
  };

  // ========================================
  // KEYBOARD DROP
  // ========================================

  const handleKeyboardDrop = (dropId, index) => {
    if (!keyboardPickedWord || showAnswer) {
      return;
    }

    const placedWord = keyboardPickedWord;

    // نحسب الوضع الجديد قبل setState
    const nextDropped = {
      ...droppedLetters,

      // ==================================
      // إذا في كلمة موجودة
      // بتنستبدل عادي
      // ==================================
      [dropId]: placedWord,
    };

    setDroppedLetters(nextDropped);

    setWrongDrops([]);

    setKeyboardMessage(
      `${placedWord} placed in answer ${index + 1}. Choose another word.`,
    );

    // ==================================
    // فك الكلمة
    // ==================================
    setKeyboardPickedWord(null);

    // ==================================
    // رجع Focus فوق
    // لأول كلمة متاحة
    // ==================================
    const usedAfter = new Set(Object.values(nextDropped).filter(Boolean));

    const firstAvailable = shuffledPairs.find(
      (pair) => !usedAfter.has(pair.letter),
    );

    setTimeout(() => {
      if (firstAvailable) {
        bankRefs.current[firstAvailable.letter]?.focus();
      }
    }, 0);
  };

  // ========================================
  // Sensors
  // ========================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  // ─────────────────────────────────────────
  // Drag Start
  // ─────────────────────────────────────────

  const handleDragStart = (event) => {
    const { data } = event.active;

    setActiveDrag(data.current);
  };

  // ─────────────────────────────────────────
  // Drag End
  // ─────────────────────────────────────────

  const handleDragEnd = (event) => {
    setActiveDrag(null);

    if (showAnswer) return;

    const { active, over } = event;

    if (!over) return;

    const { letter, source, dropId: fromDropId } = active.data.current;

    const toId = over.id;

    setDroppedLetters((prev) => {
      const next = {
        ...prev,
      };

      // لو جاي من drop
      if (source === "drop") {
        next[fromDropId] = null;
      }

      // رجعه للبنك
      if (toId === "letters") {
        return next;
      }

      // ==================================
      // Drop / Replace
      // ==================================
      next[toId] = letter;

      return next;
    });

    setWrongDrops([]);
  };

  // ─────────────────────────────────────────
  // Return To Bank
  // ─────────────────────────────────────────

  const handleReturnToBank = (dropZoneId) => {
    if (showAnswer) return;

    setDroppedLetters((prev) => ({
      ...prev,
      [dropZoneId]: null,
    }));

    setWrongDrops((prev) => prev.filter((id) => id !== dropZoneId));
  };

  // ─────────────────────────────────────────
  // Reset
  // ─────────────────────────────────────────

  const resetExercise = () => {
    setDroppedLetters({
      ...initialDroppedState,
    });

    setWrongDrops([]);

    setShowAnswer(false);

    setKeyboardPickedWord(null);

    setKeyboardMessage("");
  };

  // ─────────────────────────────────────────
  // Check
  // ─────────────────────────────────────────

  const checkAnswers = () => {
    if (showAnswer) return;

    const allFilled = Object.values(droppedLetters).every((v) => v !== null);

    if (!allFilled) {
      ValidationAlert.info(
        "Incomplete!",
        "Please fill all the drop zones before checking your answers.",
      );

      return;
    }

    let correctCount = 0;

    const total = exerciseData.pairs.length;

    const wrongList = [];

    exerciseData.pairs.forEach((_, index) => {
      const dropZoneId = `drop-${index + 1}`;

      if (droppedLetters[dropZoneId] === exerciseData.answers[dropZoneId]) {
        correctCount++;
      } else {
        wrongList.push(dropZoneId);
      }
    });

    setWrongDrops(wrongList);

    setShowAnswer(true);

    setKeyboardPickedWord(null);

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
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ─────────────────────────────────────────
  // Show Answer
  // ─────────────────────────────────────────

  const handleShowAnswer = () => {
    setDroppedLetters({
      ...exerciseData.answers,
    });

    setWrongDrops([]);

    setShowAnswer(true);

    setKeyboardPickedWord(null);

    setKeyboardMessage("Correct answers are shown.");
  };

  return (
    <div
      className="page8-wrapper"
      style={{
        padding: "30px",
      }}
    >
      {/* ========================================
          Screen Reader Message
      ======================================== */}

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
          display: "flex",

          flexDirection: "column",

          justifyContent: "flex-start",

          alignItems: "flex-start",

          position: "relative",

          gap: "40px",
        }}
      >
        <h5 className="header-title-page8">
          <span className="number-of-q">2</span>
          Drag the words to the correct picture.
        </h5>

        <audio
          ref={clickAudioRef}
          style={{
            display: "none",
          }}
        />

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Word Bank */}

          <WordBank
            shuffledPairs={shuffledPairs}
            usedLetters={usedLetters}
            showAnswer={showAnswer}
            keyboardPickedWord={keyboardPickedWord}
            onKeyboardPick={handleKeyboardPick}
            registerBankRef={(letter, el) => {
              bankRefs.current[letter] = el;
            }}
          />

          {/* Drop Zones */}

          <div className="exercise-layout-vertical">
            <div className="image-section-horizontal">
              {exerciseData.images.map((image, index) => {
                const dropId = `drop-${index + 1}`;

                return (
                  <DropZone
                    key={dropId}
                    dropId={dropId}
                    imageSrc={image.src}
                    sound={image.sound}
                    index={index}
                    droppedLetter={droppedLetters[dropId]}
                    isWrong={wrongDrops.includes(dropId)}
                    showAnswer={showAnswer}
                    onReturnToBank={handleReturnToBank}
                    onPlaySound={playSound}
                    keyboardPickedWord={keyboardPickedWord}
                    onKeyboardDrop={handleKeyboardDrop}
                    registerDropRef={(i, el) => {
                      dropRefs.current[i] = el;
                    }}
                    totalDrops={exerciseData.images.length}
                    onMoveDropFocus={(i) => {
                      dropRefs.current[i]?.focus();
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Drag Overlay */}

          <DragOverlay>
            {activeDrag ? (
              <div
                className="letter-box dragging"
                style={{
                  cursor: "grabbing",

                  opacity: 0.9,

                  boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                }}
              >
                {activeDrag.letter}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* ========================================
          Action Buttons
      ======================================== */}

      <div className="action-buttons-container">
        <button
          onClick={resetExercise}
          className="try-again-button"
          aria-label="Start again"
          title="Start again"
        >
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
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
  );
};

export default Page8_Q2;
