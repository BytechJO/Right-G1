import React, { useEffect, useRef, useState } from "react";

import "./Unit8_Page5_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit8/imgs/U8P68EXEA1-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P68EXEA1-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P68EXEA1-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P68EXEA1-04.svg";

import ExerciseHeader from "../../ExerciseHeader";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import sockAudio from "../../../assets/unit8/sound/Page 68 - A 1/sock.mp3";
import zebraAudio from "../../../assets/unit8/sound/Page 68 - A 1/zebra.mp3";
import zipperAudio from "../../../assets/unit8/sound/Page 68 - A 1/zipper.mp3";
import zooAudio from "../../../assets/unit8/sound/Page 68 - A 1/zoo.mp3";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    img: img1,
    alt: "A close-up picture of a zipper.",
    scrambled: "perpzi",
    answer: "zipper",
    audio: zipperAudio,
  },
  {
    img: img2,
    alt: "A single blue and white sock.",
    scrambled: "ksoc",
    answer: "sock",
    audio: sockAudio,
  },
  {
    img: img3,
    alt: "A zoo entrance with animal enclosures and a zoo sign.",
    scrambled: "ozo",
    answer: "zoo",
    audio: zooAudio,
  },
  {
    img: img4,
    alt: "A black-and-white zebra.",
    scrambled: "beazr",
    answer: "zebra",
    audio: zebraAudio,
  },
];

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  item,

  isUsed,
  disabled,

  keyboardPickedId,
  onKeyboardPick,

  registerRef,

  playingKey,
  onPlayAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${item.answer}`,

    data: {
      word: item.answer,
    },

    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const isKeyboardPicked = keyboardPickedId === item.answer;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(item.answer, node);
    }
  };

  const handleKeyDown = (e) => {
    if (unavailable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      /*
        Keyboard:
        صوت + pick
      */

      onPlayAudio(`bank-${item.answer}`, item.audio);

      onKeyboardPick(item.answer);
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
      aria-pressed={isKeyboardPicked}
      aria-label={
        isKeyboardPicked
          ? `${item.answer} selected. Choose a blank and press Enter or Space.`
          : `${item.answer}. Press Enter or Space to hear and select.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          يشغل الصوت فقط.

          Mouse drag:
          ما يشغل صوت.
        */

        onPlayAudio(`bank-${item.answer}`, item.audio);
      }}
      style={{
        padding: "7px 14px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        cursor: unavailable ? "not-allowed" : isDragging ? "grabbing" : "grab",

        opacity: isUsed ? 0.45 : isDragging ? 0.3 : 1,

        transition: "opacity 0.2s, background 0.2s",

        userSelect: "none",

        color: isUsed ? "#999" : "",

        touchAction: "none",

        position: "relative",
      }}
    >
      {item.answer}

      {playingKey === `bank-${item.answer}` && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-unit8-p5-q1" />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  index,

  answer,

  isWrong,
  isLocked,

  keyboardPickedId,
  keyboardFocusIndex,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,

  onSlotFocus,

  onRemove,

  registerRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,

    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedId) && keyboardFocusIndex === index && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(index, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    /* =================================================
       TAB / SHIFT + TAB
    ================================================= */

    if (keyboardPickedId && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(index, e.shiftKey);

      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      /*
        في كلمة picked:
        حطها / استبدل الموجود
      */

      if (keyboardPickedId) {
        onKeyboardPlace(index);

        return;
      }

      /*
        filled wrong/editable slot:
        رجعها للبنك
      */

      if (answer) {
        onRemove(index);
      }

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (keyboardPickedId && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div className="input-wrapper">
      <div
        ref={setRefs}
        role="button"
        tabIndex={isLocked ? -1 : keyboardPickedId ? 0 : answer ? 0 : -1}
        aria-disabled={isLocked}
        aria-label={
          isLocked
            ? `${answer}. Correct answer. Locked.`
            : isKeyboardTarget
              ? `Blank ${index + 1}. Press Enter or Space to place ${keyboardPickedId}. Press Tab or Shift plus Tab to move between blanks.`
              : answer
                ? `${answer}. Press Enter or Space to return it to the word bank.`
                : `Blank ${index + 1}. Select a word from the word bank first.`
        }
        onFocus={() => {
          if (keyboardPickedId && !isLocked) {
            onSlotFocus(index);
          }
        }}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (isLocked) {
            return;
          }

          e.stopPropagation();

          if (answer && !keyboardPickedId) {
            onRemove(index);
          }
        }}
        className={`
          text-input

          ${isOver ? "drag-over-cell" : ""}

          ${isKeyboardTarget ? "keyboard-drop-preview-unit8-p5-q1" : ""}
        `}
        style={{
          fontSize: "22px",

          background: isOver ? "#e8f0fe" : "transparent",

          transition: "background 0.15s",

          cursor: answer && !isLocked ? "pointer" : "default",

          display: "flex",

          alignItems: "center",

          position: "relative",
        }}
      >
        {/* =================================================
            REAL VALUE
        ================================================= */}

        {answer && !isKeyboardTarget && (
          <span className="drop-real-value-unit8-p5-q1">{answer}</span>
        )}

        {/* =================================================
            KEYBOARD PREVIEW
        ================================================= */}

        {isKeyboardTarget && keyboardPickedId && (
          <span className="drop-preview-value-unit8-p5-q1">
            {keyboardPickedId}
          </span>
        )}

        {/* =================================================
            WRONG X
        ================================================= */}

        {isWrong && !isLocked && (
          <div className="error-icon" aria-hidden="true">
            ✕
          </div>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit8_Page5_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(null));

  /*
    null | correct | wrong
  */

  const [results, setResults] = useState(Array(data.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [allCompleted, setAllCompleted] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedId, setKeyboardPickedId] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const bankRefs = useRef({});

  const dropRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

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

  const usedWords = new Set(inputs.filter(Boolean));

  const activeWord = activeId ? String(activeId).replace("bank-", "") : null;

  const isSlotLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const editableIndexes = () =>
    data.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =====================================================
     AUDIO
  ===================================================== */

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

    audio.onerror = audio.onended;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     REFS
  ===================================================== */

  const registerBankRef = (word, node) => {
    if (node) {
      bankRefs.current[word] = node;
    }
  };

  const registerDropRef = (index, node) => {
    if (node) {
      dropRefs.current[index] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    setKeyboardPickedId(word);

    const available = editableIndexes();

    if (!available.length) {
      return;
    }

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      dropRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT TAB
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableIndexes();

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

    requestAnimationFrame(() => {
      dropRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardWord = (index) => {
    if (
      !keyboardPickedId ||
      isSlotLocked(index) ||
      showAnswerMode ||
      allCompleted
    ) {
      return;
    }

    const picked = keyboardPickedId;

    let nextInputs = null;

    setInputs((prev) => {
      const updated = [...prev];

      /*
          شيل نفس الكلمة من slot ثاني editable
        */

      const oldIndex = updated.findIndex((value) => value === picked);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      /*
          استبدل الموجود بالـtarget
        */

      updated[index] = picked;

      nextInputs = updated;

      return updated;
    });

    /*
      تعديل نفس السؤال:
      شيل X عنه فقط
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);

    /*
      رجع لأول bank option متاح
    */

    requestAnimationFrame(() => {
      if (!nextInputs) {
        return;
      }

      const usedAfter = new Set(nextInputs.filter(Boolean));

      const nextWord = data.find((item) => !usedAfter.has(item.answer));

      if (nextWord) {
        bankRefs.current[nextWord.answer]?.focus();
      }
    });
  };

  /* =====================================================
     CANCEL KEYBOARD PICK
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedId) {
      return;
    }

    const picked = keyboardPickedId;

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     RETURN TO BANK
  ===================================================== */

  const handleRemove = (index) => {
    if (showAnswerMode || isSlotLocked(index)) {
      return;
    }

    const word = inputs[index];

    if (!word) return;

    setInputs((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    /*
      يشيل X لنفس الخانة فقط
    */

    setResults((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    requestAnimationFrame(() => {
      bankRefs.current[word]?.focus();
    });
  };

  /* =====================================================
     DRAG START
     بدون صوت
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    setActiveId(active.id);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswerMode || allCompleted) {
      return;
    }

    const slotId = String(over.id);

    if (!slotId.startsWith("slot-")) {
      return;
    }

    const index = Number(slotId.replace("slot-", ""));

    if (isSlotLocked(index)) {
      return;
    }

    const word = String(active.id).replace("bank-", "");

    setInputs((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((value) => value === word);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      updated[index] = word;

      return updated;
    });

    /*
      تعديل نفس الخانة:
      شيل X عنها فقط
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    const hasEmpty = data.some(
      (_, index) => results[index] !== "correct" && !inputs[index],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all the answers before checking.");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    data.forEach((item, index) => {
      /*
            كان صح من Check سابق
          */

      if (results[index] === "correct") {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (inputs[index] === item.answer) {
        nextResults[index] = "correct";

        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    const total = data.length;

    const completed = correctCount === total;

    if (completed) {
      setAllCompleted(true);
    }

    const color = completed ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (completed) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setInputs(data.map((item) => item.answer));

    setResults(data.map(() => "correct"));

    setShowAnswerMode(true);

    setAllCompleted(true);

    setActiveId(null);

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setInputs(Array(data.length).fill(null));

    setResults(Array(data.length).fill(null));

    setShowAnswerMode(false);

    setAllCompleted(false);

    setActiveId(null);

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);
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
            gap: "60px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            questionNumber="1"
            title="Look, unscramble, and write."
            subTitle="Put the letters in order to make zipper, sock, zoo, and zebra."
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

              alignItems: "center",

              justifyContent: "center",

              width: "100%",
            }}
          >
            {data.map((item) => (
              <BankChip
                key={item.answer}
                item={item}
                isUsed={usedWords.has(item.answer)}
                disabled={showAnswerMode || allCompleted}
                keyboardPickedId={keyboardPickedId}
                onKeyboardPick={handleKeyboardPick}
                registerRef={registerBankRef}
                playingKey={playingKey}
                onPlayAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="unscramble-row">
            {data.map((item, index) => (
              <div className="unscramble-box" key={index}>
                <div className="img-box1-unit8-p5-q1">
                  <img src={item.img} alt={item.alt} />
                </div>

                <p
                  className="scrambled-word"
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {item.scrambled}
                </p>

                <div className="input-row">
                  <span
                    className="num"
                    style={{
                      fontSize: "22px",
                    }}
                  >
                    {index + 1}
                  </span>

                  <DropSlot
                    index={index}
                    answer={inputs[index]}
                    isWrong={results[index] === "wrong"}
                    isLocked={isSlotLocked(index)}
                    keyboardPickedId={keyboardPickedId}
                    keyboardFocusIndex={keyboardFocusIndex}
                    onKeyboardPlace={placeKeyboardWord}
                    onKeyboardCancel={cancelKeyboardPick}
                    onMoveKeyboardFocus={moveKeyboardFocus}
                    onSlotFocus={setKeyboardFocusIndex}
                    onRemove={handleRemove}
                    registerRef={registerDropRef}
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
          <span className="mouse-drag-overlay-unit8-p5-q1">{activeWord}</span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit8_Page5_Q1;
