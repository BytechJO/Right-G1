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

import { FaVolumeUp } from "react-icons/fa";

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

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const exerciseData = {
  pairs: [
    {
      id: "pair-1",
      letter: "Table",
      sound: tableSound,
    },
    {
      id: "pair-2",
      letter: "Taxi",
      sound: taxiSound,
    },
    {
      id: "pair-3",
      letter: "Deer",
      sound: deerSound,
    },
    {
      id: "pair-4",
      letter: "Dish",
      sound: dishSound,
    },
  ],

  images: [
    {
      src: img1,
      alt: "A wooden round table.",
    },
    {
      src: img2,
      alt: "A yellow taxi.",
    },
    {
      src: img3,
      alt: "A young deer standing.",
    },
    {
      src: img4,
      alt: "A pink dish.",
    },
  ],

  answers: {
    "drop-1": "Table",
    "drop-2": "Taxi",
    "drop-3": "Deer",
    "drop-4": "Dish",
  },
};

/* =====================================================
   SHUFFLE
===================================================== */

const getShuffledPairs = () =>
  [...exerciseData.pairs].sort(() => Math.random() - 0.5);

/* =====================================================
   INITIAL STATE
===================================================== */

const initialDroppedState = {
  "drop-1": null,
  "drop-2": null,
  "drop-3": null,
  "drop-4": null,
};

/* =====================================================
   WORD BANK ITEM
===================================================== */

const WordBankItem = ({
  letter,
  sound,

  isUsed,
  showAnswer,

  keyboardPickedWord,
  onKeyboardPick,

  registerBankRef,

  onPlaySound,
  playingWord,
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

  /* =================================================
     KEYBOARD ACTIVATION
  ================================================= */

  const handleKeyboardActivation = () => {
    if (isUsed || showAnswer) return;

    /*
      شغّل صوت الخيار
    */

    onPlaySound(sound, letter);

    /*
      Pick / Cancel
    */

    if (isKeyboardPicked) {
      onKeyboardPick(null);
    } else {
      onKeyboardPick(letter);
    }
  };

  const style = {
    position: "relative",

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
            ? `${letter} selected. Choose an answer box and press Enter or Space to place it.`
            : `${letter}. Press Enter or Space to hear and select it.`
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
        if (isUsed || showAnswer) return;

        /*
          Mouse click = صوت فقط
          حتى ما نخرب drag بالماوس
        */

        if (e.detail > 0) {
          onPlaySound(sound, letter);
          return;
        }

        /*
          Screen reader synthetic click
        */

        e.preventDefault();
        e.stopPropagation();

        handleKeyboardActivation();
      }}
    >
      {letter}

      {playingWord === letter && (
        <FaVolumeUp
          size={17}
          aria-hidden="true"
          className="audio-icon-page8-q2"
        />
      )}
    </div>
  );
};

/* =====================================================
   PLACED WORD
===================================================== */

const PlacedWord = ({
  letter,
  dropId,

  showAnswer,
  isLocked,

  onReturnToBank,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed-${dropId}`,

      data: {
        letter,
        source: "drop",
        dropId,
      },

      disabled: showAnswer || isLocked,
    });

  const [isFocused, setIsFocused] = useState(false);

  const disabled = showAnswer || isLocked;

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isDragging ? 0.4 : 1,

    cursor: disabled ? "default" : "pointer",

    userSelect: "none",

    ...(isFocused && !disabled
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
      {...(disabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={
        isLocked
          ? `${letter}. Correct answer. Answer locked.`
          : `${letter}. Press Enter or Space to return it to the word bank.`
      }
      title={isLocked ? `${letter} correct` : `Return ${letter}`}
      onFocus={() => {
        if (!disabled) {
          setIsFocused(true);
        }
      }}
      onBlur={() => setIsFocused(false)}
      onClick={() => {
        if (!disabled) {
          onReturnToBank(dropId);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          if (!disabled) {
            onReturnToBank(dropId);
          }
        }
      }}
    >
      {letter}
    </div>
  );
};

/* =====================================================
   DROP ZONE
===================================================== */

const DropZone = ({
  dropId,

  imageSrc,
  imageAlt,

  index,

  droppedLetter,

  isWrong,
  isLocked,

  showAnswer,

  onReturnToBank,

  keyboardPickedWord,
  onKeyboardDrop,

  registerDropRef,

  availableDropIndexes,

  onMoveDropFocus,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,

    disabled: showAnswer || isLocked,
  });

  const [isFocused, setIsFocused] = useState(false);

  const canKeyboardDrop = keyboardPickedWord && !showAnswer && !isLocked;

  /* =================================================
     ACTIVATE DROP
  ================================================= */

  const activateDrop = () => {
    if (!keyboardPickedWord || showAnswer || isLocked) {
      return;
    }

    onKeyboardDrop(dropId, index);
  };

  /* =================================================
     MOVE DROP FOCUS
  ================================================= */

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
    <div className="image-container">
      {/* =================================================
          NUMBER
      ================================================= */}

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
        {/* =================================================
            IMAGE
            No audio
            No Tab
        ================================================= */}

        <img src={imageSrc} alt={imageAlt} />

        {/* =================================================
            DROP BOX
        ================================================= */}

        <div
          ref={(el) => {
            setNodeRef(el);

            registerDropRef(index, el);
          }}
          className={`drop-box${isOver && !isLocked ? " is-over" : ""}${
            isWrong ? " wrong-drop" : ""
          }`}
          role="button"
          aria-disabled={showAnswer || isLocked}
          tabIndex={showAnswer || isLocked ? -1 : 0}
          aria-label={
            isLocked
              ? `Answer ${
                  index + 1
                }. ${droppedLetter} is correct. Answer locked.`
              : keyboardPickedWord
                ? droppedLetter
                  ? `Answer ${
                      index + 1
                    }. Current word ${droppedLetter}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
                  : `Answer ${
                      index + 1
                    }. Press Enter or Space to place ${keyboardPickedWord}.`
                : droppedLetter
                  ? `Answer ${index + 1}. ${droppedLetter} is placed here.`
                  : `Answer ${index + 1}. Empty. Select a word first.`
          }
          onFocus={() => {
            if (!isLocked) {
              setIsFocused(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (isLocked) return;

            /* =========================================
               TAB BETWEEN TARGETS
            ========================================= */

            if (keyboardPickedWord && e.key === "Tab") {
              e.preventDefault();
              e.stopPropagation();

              moveFocus(e.shiftKey);

              return;
            }

            /* =========================================
               ENTER / SPACE
            ========================================= */

            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();

              /*
                إذا في كلمة picked
              */

              if (keyboardPickedWord) {
                activateDrop();

                return;
              }

              /*
                إذا الجواب غلط
                رجعه للبنك
              */

              if (droppedLetter && isWrong) {
                onReturnToBank(dropId);
              }
            }

            /* =========================================
               ESCAPE
            ========================================= */

            if (e.key === "Escape") {
              e.preventDefault();
            }
          }}
          onClick={(e) => {
            /*
              synthetic click فقط
            */

            if (e.detail === 0) {
              e.preventDefault();
              e.stopPropagation();

              activateDrop();
            }
          }}
          style={{
            cursor: showAnswer || isLocked ? "default" : "pointer",

            background: isLocked
              ? undefined
              : isOver
                ? "rgba(28,61,126,0.10)"
                : canKeyboardDrop && isFocused
                  ? "#dbeafe"
                  : undefined,

            outline:
              !isLocked && canKeyboardDrop && isFocused
                ? "3px solid #2563eb"
                : "none",

            outlineOffset: "4px",

            transform:
              !isLocked && canKeyboardDrop && isFocused
                ? "scale(1.06)"
                : "scale(1)",

            boxShadow:
              !isLocked && canKeyboardDrop && isFocused
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
              isLocked={isLocked}
              onReturnToBank={onReturnToBank}
            />
          ) : (
            <span className="placeholder" />
          )}

          {isWrong && droppedLetter && (
            <span className="wrong-x" aria-hidden="true">
              ✕
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   WORD BANK
===================================================== */

const WordBank = ({
  shuffledPairs,

  usedLetters,

  showAnswer,

  keyboardPickedWord,

  onKeyboardPick,

  registerBankRef,

  onPlaySound,

  playingWord,
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
            sound={pair.sound}
            isUsed={usedLetters.has(pair.letter)}
            showAnswer={showAnswer}
            keyboardPickedWord={keyboardPickedWord}
            onKeyboardPick={onKeyboardPick}
            registerBankRef={registerBankRef}
            onPlaySound={onPlaySound}
            playingWord={playingWord}
          />
        ))}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Page8_Q2 = () => {
  /* =================================================
     AUDIO
  ================================================= */

  const clickAudioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =================================================
     ACCESSIBILITY REFS
  ================================================= */

  const bankRefs = useRef({});

  const dropRefs = useRef([]);

  /* =================================================
     STATES
  ================================================= */

  const [droppedLetters, setDroppedLetters] = useState({
    ...initialDroppedState,
  });

  const [shuffledPairs] = useState(getShuffledPairs());

  const [wrongDrops, setWrongDrops] = useState([]);

  const [lockedDrops, setLockedDrops] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeDrag, setActiveDrag] = useState(null);

  /* =================================================
     KEYBOARD
  ================================================= */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [keyboardMessage, setKeyboardMessage] = useState("");

  /* =================================================
     USED WORDS
  ================================================= */

  const usedLetters = new Set(Object.values(droppedLetters).filter(Boolean));

  /* =================================================
     AVAILABLE DROP INDEXES
  ================================================= */

  const availableDropIndexes = exerciseData.images
    .map((_, index) => index)
    .filter((index) => !lockedDrops.includes(`drop-${index + 1}`));

  /* =================================================
     PLAY SOUND
  ================================================= */

  const playSound = (sound, word) => {
    if (!sound) return;

    /*
      وقف أي صوت ثاني
    */

    document.querySelectorAll("audio").forEach((audio) => {
      audio.pause();
    });

    if (clickAudioRef.current) {
      clickAudioRef.current.pause();

      clickAudioRef.current.currentTime = 0;

      clickAudioRef.current.src = sound;

      setPlayingWord(word);

      clickAudioRef.current.play().catch(() => {
        setPlayingWord(null);
      });

      clickAudioRef.current.onended = () => {
        setPlayingWord(null);
      };

      clickAudioRef.current.onerror = () => {
        setPlayingWord(null);
      };
    }
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (letter) => {
    if (!letter) {
      setKeyboardPickedWord(null);

      setKeyboardMessage("Word selection cancelled.");

      return;
    }

    setKeyboardPickedWord(letter);

    setKeyboardMessage(
      `${letter} selected. Choose an answer box and press Enter or Space.`,
    );

    setTimeout(() => {
      const firstUnlockedIndex = exerciseData.images.findIndex(
        (_, index) => !lockedDrops.includes(`drop-${index + 1}`),
      );

      if (firstUnlockedIndex !== -1) {
        dropRefs.current[firstUnlockedIndex]?.focus();
      }
    }, 0);
  };

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (dropId, index) => {
    if (!keyboardPickedWord || showAnswer || lockedDrops.includes(dropId)) {
      return;
    }

    const placedWord = keyboardPickedWord;

    const nextDropped = {
      ...droppedLetters,
    };

    /*
      شيل نفس الكلمة إذا كانت بمكان ثاني
    */

    Object.keys(nextDropped).forEach((id) => {
      if (nextDropped[id] === placedWord) {
        nextDropped[id] = null;
      }
    });

    nextDropped[dropId] = placedWord;

    setDroppedLetters(nextDropped);

    setWrongDrops((prev) => prev.filter((id) => id !== dropId));

    setKeyboardMessage(
      `${placedWord} placed in answer ${index + 1}. Choose another word.`,
    );

    setKeyboardPickedWord(null);

    /*
      رجع لأول كلمة متاحة بالبنك
    */

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
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  /* =================================================
     DRAG START
  ================================================= */

  const handleDragStart = (event) => {
    const { data } = event.active;

    setActiveDrag(data.current);
  };

  /* =================================================
     DRAG END
  ================================================= */

  const handleDragEnd = (event) => {
    setActiveDrag(null);

    if (showAnswer || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over) return;

    const { letter, source, dropId: fromDropId } = active.data.current;

    const toId = String(over.id);

    if (lockedDrops.includes(toId)) {
      return;
    }

    if (source === "drop" && lockedDrops.includes(fromDropId)) {
      return;
    }

    setDroppedLetters((prev) => {
      const next = {
        ...prev,
      };

      if (source === "drop") {
        next[fromDropId] = null;
      }

      if (toId === "letters") {
        return next;
      }

      Object.keys(next).forEach((id) => {
        if (next[id] === letter && id !== toId) {
          next[id] = null;
        }
      });

      next[toId] = letter;

      return next;
    });

    setWrongDrops((prev) =>
      prev.filter((id) => id !== toId && id !== fromDropId),
    );
  };

  /* =================================================
     RETURN TO BANK
  ================================================= */

  const handleReturnToBank = (dropZoneId) => {
    if (showAnswer || checkCompleted || lockedDrops.includes(dropZoneId)) {
      return;
    }

    const returnedWord = droppedLetters[dropZoneId];

    setDroppedLetters((prev) => ({
      ...prev,

      [dropZoneId]: null,
    }));

    setWrongDrops((prev) => prev.filter((id) => id !== dropZoneId));

    if (returnedWord) {
      setTimeout(() => {
        bankRefs.current[returnedWord]?.focus();
      }, 0);
    }
  };

  /* =================================================
     RESET
  ================================================= */

  const resetExercise = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.pause();

      clickAudioRef.current.currentTime = 0;
    }

    setPlayingWord(null);

    setDroppedLetters({
      ...initialDroppedState,
    });

    setWrongDrops([]);

    setLockedDrops([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setKeyboardPickedWord(null);

    setKeyboardMessage("");

    setActiveDrag(null);
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const allFilled = Object.values(droppedLetters).every(
      (value) => value !== null,
    );

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

    const correctList = [];

    exerciseData.pairs.forEach((_, index) => {
      const dropZoneId = `drop-${index + 1}`;

      const isCorrect =
        droppedLetters[dropZoneId] === exerciseData.answers[dropZoneId];

      if (isCorrect) {
        correctCount++;

        correctList.push(dropZoneId);
      } else {
        wrongList.push(dropZoneId);
      }
    });

    setLockedDrops((prev) => Array.from(new Set([...prev, ...correctList])));

    setWrongDrops(wrongList);

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
      setLockedDrops(Object.keys(exerciseData.answers));

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
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.pause();

      clickAudioRef.current.currentTime = 0;
    }

    setPlayingWord(null);

    setDroppedLetters({
      ...exerciseData.answers,
    });

    setWrongDrops([]);

    setLockedDrops(Object.keys(exerciseData.answers));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setKeyboardMessage("Correct answers are shown.");
  };

  /* =================================================
     JSX
  ================================================= */

  return (
    <div
      className="page8-wrapper"
      style={{
        padding: "30px",
      }}
    >
      {/* =================================================
          SCREEN READER MESSAGE
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
        <ExerciseHeader
          questionNumber="2"
          title="Look and write."
          subTitle="Drag table, taxi, dish, and deer to their matching pictures. Tap each card to hear it again."
        />

        {/* =================================================
            AUDIO
        ================================================= */}

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
          onDragCancel={() => setActiveDrag(null)}
        >
          {/* =================================================
              WORD BANK
          ================================================= */}

          <WordBank
            shuffledPairs={shuffledPairs}
            usedLetters={usedLetters}
            showAnswer={showAnswer}
            keyboardPickedWord={keyboardPickedWord}
            onKeyboardPick={handleKeyboardPick}
            registerBankRef={(letter, el) => {
              bankRefs.current[letter] = el;
            }}
            onPlaySound={playSound}
            playingWord={playingWord}
          />

          {/* =================================================
              DROP ZONES
          ================================================= */}

          <div className="exercise-layout-vertical">
            <div className="image-section-horizontal">
              {exerciseData.images.map((image, index) => {
                const dropId = `drop-${index + 1}`;

                const isLocked = lockedDrops.includes(dropId);

                return (
                  <DropZone
                    key={dropId}
                    dropId={dropId}
                    imageSrc={image.src}
                    imageAlt={image.alt}
                    index={index}
                    droppedLetter={droppedLetters[dropId]}
                    isWrong={wrongDrops.includes(dropId)}
                    isLocked={isLocked}
                    showAnswer={showAnswer}
                    onReturnToBank={handleReturnToBank}
                    keyboardPickedWord={keyboardPickedWord}
                    onKeyboardDrop={handleKeyboardDrop}
                    registerDropRef={(i, el) => {
                      dropRefs.current[i] = el;
                    }}
                    availableDropIndexes={availableDropIndexes}
                    onMoveDropFocus={(i) => {
                      dropRefs.current[i]?.focus();
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* =================================================
              DRAG OVERLAY
          ================================================= */}

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

      {/* =================================================
          BUTTONS
      ================================================= */}

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
