import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U3/SVG/U3P20EXEC-01.svg";
import img2 from "../../../assets/U1 WB/U3/SVG/U3P20EXEC-02.svg";
import img3 from "../../../assets/U1 WB/U3/SVG/U3P20EXEC-03.svg";
import img4 from "../../../assets/U1 WB/U3/SVG/U3P20EXEC-04.svg";
import img5 from "../../../assets/U1 WB/U3/SVG/U3P20EXEC-05.svg";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import AntAudio from "../../../assets/U1 WB/U3/page_20_3/Item_001_Ant.mp3";
import ratAudio from "../../../assets/U1 WB/U3/page_20_3/Item_002_rat.mp3";
import batAudio from "../../../assets/U1 WB/U3/page_20_3/Item_003_bat.mp3";
import dadAudio from "../../../assets/U1 WB/U3/page_20_3/Item_004_dad.mp3";
import panAudio from "../../../assets/U1 WB/U3/page_20_3/Item_005_pan.mp3";

import stayAwayAudio from "../../../assets/U1 WB/U3/page_20_3/Item_006_Stay_away_from_the.mp3";
import withAAudio from "../../../assets/U1 WB/U3/page_20_3/Item_007_with_a.mp3";
import lookOutAudio from "../../../assets/U1 WB/U3/page_20_3/Item_008_Look_out_ant!_Here_comes.mp3";
import withHisAudio from "../../../assets/U1 WB/U3/page_20_3/Item_009_with_his.mp3";

/* =====================================================
   DATA
===================================================== */

const wordData = [
  {
    word: "Ant",
    audio: AntAudio,
  },
  {
    word: "rat",
    audio: ratAudio,
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
    word: "pan",
    audio: panAudio,
  },
];

const wordBank = ["Ant", "rat", "bat", "dad", "pan"];

const correctAnswers = ["Ant", "rat", "bat", "dad", "pan"];

const sentenceData = [
  {
    img: img1,
    alt: "An ant.",
    after: "! Stay away from the",
    audio: stayAwayAudio,
    audioLabel: "Stay away from the",
  },
  {
    img: img2,
    alt: "A rat.",
    after: "with a",
    audio: withAAudio,
    audioLabel: "with a",
  },
  {
    img: img3,
    alt: "A baseball bat.",
    after: ". Look out ant! Here comes",
    audio: lookOutAudio,
    audioLabel: "Look out ant! Here comes",
  },
  {
    img: img4,
    alt: "A father.",
    after: "with his",
    audio: withHisAudio,
    audioLabel: "with his",
  },
  {
    img: img5,
    alt: "A frying pan.",
    after: ".",
    audio: null,
    audioLabel: "",
  },
];

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  word,
  disabled,
  isUsed,
  keyboardPicked,
  playing,
  onAudio,
  onKeyboardPick,
  setWordRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,
    disabled: disabled || isUsed,
  });

  const handleRef = (node) => {
    setNodeRef(node);

    if (setWordRef) {
      setWordRef(node);
    }
  };

  return (
    <span
      ref={handleRef}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={disabled || isUsed ? -1 : 0}
      aria-pressed={keyboardPicked}
      aria-label={`${word}. Press Enter or Space to hear and select this word.`}
      onClick={(e) => {
        e.stopPropagation();

        if (disabled || isUsed) {
          return;
        }

        // Mouse click = صوت فقط
        onAudio(word);
      }}
      onKeyDown={(e) => {
        if (disabled || isUsed) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          // Keyboard = صوت + اختيار
          onAudio(word);
          onKeyboardPick(word);
        }
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: keyboardPicked ? "#dbeafe" : isUsed ? "#e0e0e0" : "white",
        fontWeight: "bold",
        fontSize: "20px",
        cursor: disabled || isUsed ? "default" : "grab",
        opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,
        touchAction: "none",
        transition: "all 0.2s ease",
        color: isUsed ? "#999" : "inherit",
        userSelect: "none",
        outline: keyboardPicked ? "3px solid #2563eb" : "none",
        outlineOffset: keyboardPicked ? "3px" : "0",
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      {word}

      {playing && (
        <FaVolumeUp
          aria-hidden="true"
          style={{
            color: "#2563eb",
          }}
        />
      )}
    </span>
  );
};

/* =====================================================
   DROPPABLE SLOT
===================================================== */

const DroppableSlot = ({
  index,
  value,
  isWrong,
  locked,
  keyboardPickedWord,
  keyboardFocusIndex,
  onRemove,
  onPlaceKeyboard,
  onMoveKeyboardFocus,
  onSlotFocus,
  setSlotRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    disabled: locked,
  });

  const keyboardActive = !!keyboardPickedWord;
  const isKeyboardFocus = keyboardActive && keyboardFocusIndex === index;

  const handleRef = (node) => {
    setNodeRef(node);

    if (setSlotRef) {
      setSlotRef(node);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <div
        ref={handleRef}
        role="button"
        tabIndex={locked ? -1 : keyboardActive ? 0 : value ? 0 : -1}
        aria-label={
          locked
            ? `Answer ${value} is correct and locked.`
            : keyboardActive
              ? `Blank ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}.`
              : value
                ? `Blank ${index + 1}, ${value}. Press Enter or Space to remove it.`
                : `Blank ${index + 1}.`
        }
        onFocus={() => {
          if (keyboardPickedWord && !locked) {
            onSlotFocus(index);
          }
        }}
        onKeyDown={(e) => {
          if (locked) return;

          // أثناء حمل كلمة، Tab يبقى بين الـslots
          if (keyboardPickedWord && e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();

            onMoveKeyboardFocus(index, e.shiftKey);

            return;
          }

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            if (keyboardPickedWord) {
              onPlaceKeyboard(index);
            } else if (value) {
              onRemove(index);
            }
          }
        }}
        onClick={() => {
          if (!locked && value && !keyboardPickedWord) {
            onRemove(index);
          }
        }}
        style={{
          background: isKeyboardFocus
            ? "#eff6ff"
            : isOver
              ? "#e3f2fd"
              : "white",

          width: "125px",
          minWidth: "125px",
          minHeight: "40px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "0px",
          border: "none",
          borderBottom: "2px solid #111",

          cursor: !locked && value ? "pointer" : "default",
          transition: "background 0.15s ease",
          position: "relative",

          fontSize: "22px",
          fontWeight: "600",
          outline: isKeyboardFocus ? "3px solid #2563eb" : "none",
          outlineOffset: "3px",
        }}
        title={!locked && value ? "Click to remove" : ""}
      >
        {value && <span>{value}</span>}

        {!value && isKeyboardFocus && keyboardPickedWord && (
          <span
            style={{
              opacity: 0.45,
            }}
          >
            {keyboardPickedWord}
          </span>
        )}

        {value && isKeyboardFocus && keyboardPickedWord && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(239,246,255,0.95)",
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            {keyboardPickedWord}
          </span>
        )}
      </div>

      {isWrong && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-24px",
            top: "-8px",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "red",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   SENTENCE AUDIO
===================================================== */

const SentenceAudio = ({ audio, label, playing, onPlay }) => {
  if (!audio) return null;

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`Play audio: ${label}`}
      onClick={(e) => {
        e.stopPropagation();
        onPlay(audio);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onPlay(audio);
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "7px",
        cursor: "pointer",
        color: playing ? "#2563eb" : "#333",
        fontSize: "22px",
        outlineOffset: "3px",
      }}
    >
      <FaVolumeUp aria-hidden="true" />
    </span>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit3_Page6_Q3 = () => {
  const [slots, setSlots] = useState(Array(5).fill(null));

  const [wrongInputs, setWrongInputs] = useState([]);

  // progressive locking
  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeWord, setActiveWord] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  const [playingSentenceAudio, setPlayingSentenceAudio] = useState(null);

  /* =====================================================
     REFS
  ===================================================== */

  const wordRefs = useRef({});
  const slotRefs = useRef([]);

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
     HELPERS
  ===================================================== */

  const isSlotLocked = (index) => lockedSlots.includes(index);

  const usedWords = slots.filter(Boolean);

  const editableSlots = () =>
    [0, 1, 2, 3, 4].filter((index) => !isSlotLocked(index));

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;

    setPlayingWord(null);
    setPlayingSentenceAudio(null);
  };

  const playWordAudio = (word) => {
    const item = wordData.find((item) => item.word === word);

    if (!item?.audio) return;

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingWord(word);
    setPlayingSentenceAudio(null);

    audio.play().catch(() => {
      setPlayingWord(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    });

    audio.onended = () => {
      setPlayingWord(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };

    audio.onerror = () => {
      setPlayingWord(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  };

  const playSentenceAudio = (src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingWord(null);
    setPlayingSentenceAudio(src);

    audio.play().catch(() => {
      setPlayingSentenceAudio(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    });

    audio.onended = () => {
      setPlayingSentenceAudio(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };

    audio.onerror = () => {
      setPlayingSentenceAudio(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  };

  /* =====================================================
     PLACE WORD
  ===================================================== */

  const placeWord = (word, targetIndex) => {
    if (showAnswerMode || checkCompleted || isSlotLocked(targetIndex)) {
      return;
    }

    setSlots((prev) => {
      const copy = [...prev];

      const existingIndex = copy.findIndex((item) => item === word);

      if (
        existingIndex !== -1 &&
        existingIndex !== targetIndex &&
        !isSlotLocked(existingIndex)
      ) {
        copy[existingIndex] = null;
      }

      copy[targetIndex] = word;

      return copy;
    });

    setWrongInputs((prev) => prev.filter((index) => index !== targetIndex));
  };

  /* =====================================================
     DRAG
  ===================================================== */

  const handleDragStart = (event) => {
    const word = event.active.id.replace("word-", "");

    setActiveWord(word);
  };

  const handleDragEnd = (event) => {
    setActiveWord(null);

    if (showAnswerMode || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !over.id.startsWith("slot-")) {
      return;
    }

    const draggedWord = active.id.replace("word-", "");

    const targetIndex = Number(over.id.replace("slot-", ""));

    if (isSlotLocked(targetIndex)) {
      return;
    }

    placeWord(draggedWord, targetIndex);
  };

  /* =====================================================
     REMOVE
  ===================================================== */

  const handleRemoveFromSlot = (index) => {
    if (showAnswerMode || checkCompleted || isSlotLocked(index)) {
      return;
    }

    setSlots((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    setWrongInputs((prev) => prev.filter((wrongIndex) => wrongIndex !== index));
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswerMode || checkCompleted || usedWords.includes(word)) {
      return;
    }

    setKeyboardPickedWord(word);

    const available = editableSlots();

    if (!available.length) return;

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    setAnnouncement(
      `${word} selected. Choose a blank and press Enter or Space.`,
    );

    requestAnimationFrame(() => {
      slotRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     SLOT FOCUS
  ===================================================== */

  const handleSlotFocus = (index) => {
    if (keyboardPickedWord) {
      setKeyboardFocusIndex(index);
    }
  };

  /* =====================================================
     MOVE BETWEEN SLOTS
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

  const handleKeyboardPlace = (index) => {
    if (!keyboardPickedWord || isSlotLocked(index)) {
      return;
    }

    const word = keyboardPickedWord;

    placeWord(word, index);

    setKeyboardPickedWord(null);
    setKeyboardFocusIndex(null);

    setAnnouncement(`${word} placed in blank ${index + 1}.`);

    requestAnimationFrame(() => {
      const nextWord = wordBank.find(
        (item) => item !== word && !slots.includes(item),
      );

      if (nextWord && wordRefs.current[nextWord]) {
        wordRefs.current[nextWord].focus();
      }
    });
  };

  /* =====================================================
     ESCAPE
  ===================================================== */

  const handleWrapperKeyDown = (e) => {
    if (e.key !== "Escape" || !keyboardPickedWord) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const word = keyboardPickedWord;

    setKeyboardPickedWord(null);
    setKeyboardFocusIndex(null);

    setAnnouncement("Selection cancelled.");

    requestAnimationFrame(() => {
      wordRefs.current[word]?.focus();
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    if (slots.some((slot) => !slot)) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the blanks before checking.",
      );

      return;
    }

    let tempScore = 0;

    const wrong = [];
    const newlyLocked = [];

    slots.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        tempScore++;
        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    // الصح فقط ينقفل
    setLockedSlots((prev) => [...new Set([...prev, ...newlyLocked])]);

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);
    setKeyboardFocusIndex(null);

    const total = correctAnswers.length;

    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${tempScore} / ${total}
        </span>
      </div>
    `;

    if (tempScore === total) {
      setLockedSlots([0, 1, 2, 3, 4]);

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (tempScore === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setSlots(Array(5).fill(null));

    setWrongInputs([]);
    setLockedSlots([]);

    setShowAnswerMode(false);
    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);
    setKeyboardFocusIndex(null);

    setAnnouncement("");
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswer = () => {
    setSlots([...correctAnswers]);

    setWrongInputs([]);

    setLockedSlots([0, 1, 2, 3, 4]);

    setShowAnswerMode(true);
    setCheckCompleted(true);

    setKeyboardPickedWord(null);
    setKeyboardFocusIndex(null);

    setAnnouncement("Correct answers are displayed.");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        onKeyDown={handleWrapperKeyDown}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          width: "100%",
        }}
      >
        {/* Screen reader */}
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
          {announcement}
        </div>

        <div
          className="div-forall"
          style={{
            gap: "20px",
          }}
        >
          <ExerciseHeader
            sectionLetter="C"
            title="Look, write, and say."
            subTitle="Use the pictures to drag ant, rat, bat, dad, and pan into the blanks."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",
              gap: "14px",
              padding: "12px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "35px",
            }}
          >
            {wordBank.map((word) => (
              <DraggableWord
                key={word}
                word={word}
                disabled={showAnswerMode || checkCompleted}
                isUsed={usedWords.includes(word)}
                keyboardPicked={keyboardPickedWord === word}
                playing={playingWord === word}
                onAudio={playWordAudio}
                onKeyboardPick={handleKeyboardPick}
                setWordRef={(node) => {
                  wordRefs.current[word] = node;
                }}
              />
            ))}
          </div>

          {/* =================================================
              SENTENCES
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              
              width: "100%",
              alignItems: "center",
            }}
          >
            {sentenceData.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",

                  gridColumn: index === 4 ? "1 / 2" : "auto",
                }}
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  style={{
                    width: "120px",
                    height: "95px",
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />

                <DroppableSlot
                  index={index}
                  value={slots[index]}
                  isWrong={wrongInputs.includes(index)}
                  locked={isSlotLocked(index) || showAnswerMode}
                  keyboardPickedWord={keyboardPickedWord}
                  keyboardFocusIndex={keyboardFocusIndex}
                  onRemove={handleRemoveFromSlot}
                  onPlaceKeyboard={handleKeyboardPlace}
                  onMoveKeyboardFocus={moveKeyboardFocus}
                  onSlotFocus={handleSlotFocus}
                  setSlotRef={(node) => {
                    slotRefs.current[index] = node;
                  }}
                />

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "24px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{item.after}</span>

                  <SentenceAudio
                    audio={item.audio}
                    label={item.audioLabel}
                    playing={playingSentenceAudio === item.audio}
                    onPlay={playSentenceAudio}
                  />
                </div>
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
            onClick={showAnswer}
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
          <span
            style={{
              padding: "7px 14px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "white",
              fontWeight: "bold",
              fontSize: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              cursor: "grabbing",
            }}
          >
            {activeWord}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit3_Page6_Q3;
