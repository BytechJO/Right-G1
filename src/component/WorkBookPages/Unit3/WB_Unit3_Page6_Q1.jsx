import React, { useRef, useState } from "react";

import bat from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-01.svg";
import cap from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-02.svg";
import ant from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-03.svg";
import dad from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-04.svg";
import ant2 from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-05.svg";
import dad2 from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-06.svg";
import "./WB_Unit3_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

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

import sound1 from "../../../assets/U1 WB/U3/audio/cd4pg20-instruction1-adult-lady_r3mB3ZZz.mp3";

import capAudio from "../../../assets/U1 WB/U3/page_20/Item_001_cap.mp3";
import batAudio from "../../../assets/U1 WB/U3/page_20/Item_002_bat.mp3";
import ratAudio from "../../../assets/U1 WB/U3/page_20/Item_003_rat.mp3";
import dadAudio from "../../../assets/U1 WB/U3/page_20/Item_004_dad.mp3";
import panAudio from "../../../assets/U1 WB/U3/page_20/Item_005_pan.mp3";
import antAudio from "../../../assets/U1 WB/U3/page_20/Item_006_ant.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const wordData = [
  {
    word: "cap",
    audio: capAudio,
  },
  {
    word: "bat",
    audio: batAudio,
  },
  {
    word: "rat",
    audio: ratAudio,
  },
  {
    word: "dad",
    audio: dadAudio,
  },
  {
    word: "pan",
    audio: panAudio,
  },
  {
    word: "ant",
    audio: antAudio,
  },
];

const imageData = [
  {
    src: bat,
    alt: "A brown rat.",
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
    alt: "A wooden baseball bat.",
  },
  {
    src: ant2,
    alt: "A father hugging his child.",
  },
  {
    src: dad2,
    alt: "A frying pan.",
  },
];

const correctAnswers = ["rat", "cap", "ant", "bat", "dad", "pan"];

const wordBank = ["cap", "bat", "rat", "dad", "pan", "ant"];

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
      className={`draggable-word-unit3-page6-q1 ${
        keyboardPicked ? "keyboard-picked-word-unit3-page6-q1" : ""
      }`}
      role="button"
      tabIndex={disabled || isUsed ? -1 : 0}
      aria-pressed={keyboardPicked}
      aria-label={`${word}. Press Enter or Space to hear and select this word.`}
      onClick={(e) => {
        /*
          Mouse click:
          صوت فقط.
          Drag يظل مسؤول عنه dnd-kit.
        */

        e.stopPropagation();

        if (disabled || isUsed) {
          return;
        }

        onAudio(word);
      }}
      onKeyDown={(e) => {
        if (disabled || isUsed) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

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

        display: "flex",
      }}
    >
      <div className="input-wrapper-unit3-page6-q1">
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
          className={`${isOver ? "drag-over-cell" : ""} ${
            isKeyboardFocus ? "keyboard-target-unit3-page6-q1" : ""
          }`}
          onFocus={() => {
            if (keyboardPickedWord && !locked) {
              onSlotFocus(index);
            }
          }}
          onKeyDown={(e) => {
            if (locked) return;

            /*
              أثناء حمل كلمة:
              Tab يضل داخل الـslots
            */

            if (keyboardPickedWord && e.key === "Tab") {
              e.preventDefault();
              e.stopPropagation();

              onMoveKeyboardFocus(index, e.shiftKey);

              return;
            }

            /*
              Enter / Space
            */

            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();

              if (keyboardPickedWord) {
                onPlaceKeyboard(index);
              } else if (value) {
                onRemove(index);
              }

              return;
            }

            /*
              Escape:
              handled from parent through
              onPlace system? 
              هنا ما نحتاجه.
            */
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

            minWidth: "120px",

            minHeight: "36px",

            display: "flex",

            alignItems: "center",

            borderRadius: "0px",

            justifyContent: "center",

            borderBottom: "1px solid #72d0f6",

            cursor: !locked && value ? "pointer" : "default",

            transition: "background 0.15s ease",

            position: "relative",
          }}
          title={!locked && value ? "Click to remove" : ""}
        >
          {/* =========================================
              REAL VALUE
          ========================================= */}

          {value && <span>{value}</span>}

          {/* =========================================
              KEYBOARD PREVIEW
          ========================================= */}

          {!value && isKeyboardFocus && keyboardPickedWord && (
            <span className="keyboard-word-preview-unit3-page6-q1">
              {keyboardPickedWord}
            </span>
          )}

          {/* لو فيه value غلط،
              وإجا keyboard word جديد:
              اعرض preview فوقه بدل ما يخبي
              إنه رح يستبدله */}

          {value && isKeyboardFocus && keyboardPickedWord && (
            <span className="keyboard-replace-preview-unit3-page6-q1">
              {keyboardPickedWord}
            </span>
          )}
        </div>

        {isWrong && <span className="error-mark-input-review3-p2-q1">✕</span>}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit3_Page6_Q1 = () => {
  /* =====================================================
     STATE
  ===================================================== */
  const [forceStopQuestionAudio, setForceStopQuestionAudio] = useState(false);
  const stopQuestionAudio = () => {
    /*
    نخليها true للحظة حتى useEffect
    داخل QuestionAudioPlayer يلتقطها.
  */
    setForceStopQuestionAudio(true);

    requestAnimationFrame(() => {
      setForceStopQuestionAudio(false);
    });
  };
  const [slots, setSlots] = useState(Array(6).fill(null));

  const [wrongInputs, setWrongInputs] = useState([]);

  /*
    Progressive locking:
    فقط الـslots الصح.
  */

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

  /* =====================================================
     REFS
  ===================================================== */

  const wordRefs = useRef({});

  const slotRefs = useRef([]);

  /* =====================================================
     DND SENSORS
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
    [0, 1, 2, 3, 4, 5].filter((index) => !isSlotLocked(index));

  const stopAtSecond = 5.179;

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopWordAudio = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingWord(null);
  };

  const playWordAudio = (word) => {
    stopQuestionAudio();

    const item = wordData.find((item) => item.word === word);

    if (!item?.audio) return;

    stopWordAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingWord(word);

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

  /* =====================================================
     PLACE WORD
  ===================================================== */

  const placeWord = (word, targetIndex) => {
    if (showAnswerMode || checkCompleted || isSlotLocked(targetIndex)) {
      return;
    }

    setSlots((prev) => {
      const copy = [...prev];

      /*
        إذا الكلمة كانت
        بمكان ثاني غلط،
        شيلها منه.
      */

      const existingIndex = copy.findIndex((item) => item === word);

      if (
        existingIndex !== -1 &&
        existingIndex !== targetIndex &&
        !isSlotLocked(existingIndex)
      ) {
        copy[existingIndex] = null;
      }

      /*
        استبدل الموجود بالهدف.
        الكلمة القديمة ترجع
        تلقائيًا للـword bank.
      */

      copy[targetIndex] = word;

      return copy;
    });

    /*
      شيل X عن الهدف
      اللي تعدل فقط.
    */

    setWrongInputs((prev) => prev.filter((index) => index !== targetIndex));
  };

  /* =====================================================
     DRAG HANDLERS
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
     REMOVE FROM SLOT
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

    stopQuestionAudio();

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

     مهم:
     ما نحرك focus من هون.
     بس نحدث الـpreview.
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

    /*
        بعد placement
        رجع لأول كلمة متاحة
      */

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
     GLOBAL ESCAPE FOR KEYBOARD PICK
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
     CHECK ANSWERS
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

    /*
        اقفل الصح فقط.
      */

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
      setLockedSlots([0, 1, 2, 3, 4, 5]);

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
    stopWordAudio();

    setSlots(Array(6).fill(null));

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

    setLockedSlots([0, 1, 2, 3, 4, 5]);

    setShowAnswerMode(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setAnnouncement("Correct answers are displayed.");
  };

  /* =====================================================
     CAPTIONS
  ===================================================== */

  const captions = [
    {
      start: 0.34,
      end: 5.179,
      text: "Phonics. Exercise A. Listen, look, and write.",
    },
    {
      start: 5.859,
      end: 7.299,
      text: "1-rat.",
    },
    {
      start: 7.96,
      end: 9.279,
      text: "2-cap.",
    },
    {
      start: 9.899,
      end: 11.599,
      text: "3-ant.",
    },
    {
      start: 12.34,
      end: 13.859,
      text: "4-bat.",
    },
    {
      start: 14.479,
      end: 15.879,
      text: "5-dad.",
    },
    {
      start: 16.539,
      end: 18.2,
      text: "6-pan.",
    },
  ];

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
        className="question-wrapper-unit3-page6-q1"
        onKeyDown={handleWrapperKeyDown}
        style={{
          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          padding: "30px",
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
            gap: "15px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            title="Listen, look, and write."
            subTitle="Listen, then drag each short-a word to the matching picture."
          />
          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId="unit2-page20-q1-WB"
            forceStop={forceStopQuestionAudio}
            onInteract={() => {
              /*
      لما المستخدم يرجع يتعامل
      مع صوت السؤال، وقف صوت الخيار.
    */
              stopWordAudio();
            }}
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "30px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              width: "100%",

              justifyContent: "center",

              flexWrap: "wrap",
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
              IMAGE + SLOT GRID
          ================================================= */}

          <div className="row-content10-review3-p2-q1">
            {imageData.map((item, index) => (
              <div className="row2-review3-p2-q1" key={index}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="q-img-wb-unit3-p6-q1"
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

export default WB_Unit3_Page6_Q1;
