import React, { useEffect, useRef, useState } from "react";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U8/U8P45EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P45EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U8/U8P45EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U8/U8P45EXEA-04.svg";

import "./WB_Unit8_Page1_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

/* =====================================================
   AUDIO
===================================================== */

import closeEyesAudio from "../../../assets/U1 WB/U8/audio/page 45 - A/Item_001_Close_my_eyes.mp3";
import raiseHandAudio from "../../../assets/U1 WB/U8/audio/page 45 - A/Item_002_Raise_your_hand.mp3";
import openMouthAudio from "../../../assets/U1 WB/U8/audio/page 45 - A/Item_003_Open_your_mouth.mp3";
import touchNoseAudio from "../../../assets/U1 WB/U8/audio/page 45 - A/Item_004_Touch_your_nose.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    num: "1",
    sentence: "Close my eyes.",
    audio: closeEyesAudio,
  },
  {
    num: "2",
    sentence: "Raise your hand.",
    audio: raiseHandAudio,
  },
  {
    num: "3",
    sentence: "Open your mouth.",
    audio: openMouthAudio,
  },
  {
    num: "4",
    sentence: "Touch your nose.",
    audio: touchNoseAudio,
  },
];

const pictures = [
  {
    img: img1,
    alt: "A child with eyes closed, matching the command Close my eyes.",
    correct: "1",
  },
  {
    img: img2,
    alt: "A child opening his mouth, matching the command Open your mouth.",
    correct: "3",
  },
  {
    img: img3,
    alt: "A child raising one hand above his head, matching the command Raise your hand.",
    correct: "2",
  },
  {
    img: img4,
    alt: "A child touching his nose, matching the command Touch your nose.",
    correct: "4",
  },
];

/* =====================================================
   DRAGGABLE ITEM
===================================================== */

const DraggableItem = ({
  item,
  disabled,
  isUsed,
  keyboardPickedNum,
  onKeyboardPick,
  registerRef,
  playingKey,
  onPlayAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `num-${item.num}`,
    disabled: disabled || isUsed,
  });

  const unavailable = disabled || isUsed;

  const isPicked = keyboardPickedNum === item.num;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(item.num, node);
    }
  };

  const handleKeyDown = (e) => {
    if (unavailable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onPlayAudio(`bank-${item.num}`, item.audio);

      onKeyboardPick(item.num);
    }
  };

  return (
    <div className="sentence-container-wb-unit8-p1-q1">
      <div
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
        aria-pressed={isPicked}
        aria-label={
          isPicked
            ? `Number ${item.num}, ${item.sentence}. Selected. Choose a picture and press Enter or Space.`
            : `Number ${item.num}, ${item.sentence}. Press Enter or Space to hear and select.`
        }
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (unavailable) return;

          /*
            Mouse click:
            صوت فقط
          */
          onPlayAudio(`bank-${item.num}`, item.audio);
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid #2c5287",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",

          cursor: unavailable
            ? "not-allowed"
            : isDragging
              ? "grabbing"
              : "grab",

          background: isUsed ? "#e0e0e0" : "white",

          opacity: isUsed ? 0.35 : isDragging ? 0.3 : 1,

          color: isUsed ? "#999" : "",

          touchAction: "none",
          userSelect: "none",
          transition: "opacity 0.2s",
          position: "relative",
        }}
      >
        {item.num}

        {playingKey === `bank-${item.num}` && (
          <FaVolumeUp
            aria-hidden="true"
            className="audio-icon-wb-unit8-p1-q1"
          />
        )}
      </div>

      <span className="sentence-wb-unit8-p1-q1">{item.sentence}</span>
    </div>
  );
};

/* =====================================================
   NUMBER BANK
===================================================== */

const NumberBank = ({
  usedNumbers,
  showAnswerMode,
  keyboardPickedNum,
  onKeyboardPick,
  registerRef,
  playingKey,
  onPlayAudio,
}) => {
  const { setNodeRef } = useDroppable({
    id: "number-bank",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "grid",
        gap: "12px",
        padding: "10px",
        width: "100%",
        border: "2px dashed #ccc",
        borderRadius: "10px",
        marginBottom: "20px",
        justifyContent: "center",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "150px",
      }}
    >
      {items.map((item) => (
        <DraggableItem
          key={item.num}
          item={item}
          disabled={showAnswerMode}
          isUsed={usedNumbers.has(item.num)}
          keyboardPickedNum={keyboardPickedNum}
          onKeyboardPick={onKeyboardPick}
          registerRef={registerRef}
          playingKey={playingKey}
          onPlayAudio={onPlayAudio}
        />
      ))}
    </div>
  );
};

/* =====================================================
   DROP CELL
===================================================== */

const DroppableCell = ({
  index,
  value,
  isWrong,
  isLocked,

  keyboardPickedNum,
  keyboardFocusIndex,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,
  onSlotFocus,

  onClear,
  registerRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${index}`,
    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedNum) && keyboardFocusIndex === index && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(index, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    if (keyboardPickedNum && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(index, e.shiftKey);

      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      if (keyboardPickedNum) {
        onKeyboardPlace(index);
        return;
      }

      if (value) {
        onClear(index);
      }

      return;
    }

    if (keyboardPickedNum && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div
      ref={setRefs}
      role="button"
      tabIndex={isLocked ? -1 : keyboardPickedNum ? 0 : value ? 0 : -1}
      aria-disabled={isLocked}
      aria-label={
        isLocked
          ? `Number ${value}. Correct and locked.`
          : isKeyboardTarget
            ? `Picture ${index + 1}. Press Enter or Space to place number ${keyboardPickedNum}.`
            : value
              ? `Number ${value}. Press Enter or Space to return it to the bank.`
              : `Empty answer box for picture ${index + 1}. Select a number first.`
      }
      onFocus={() => {
        if (keyboardPickedNum && !isLocked) {
          onSlotFocus(index);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isLocked) return;

        e.stopPropagation();

        if (value && !keyboardPickedNum) {
          onClear(index);
        }
      }}
      className={`
        wb-unit7-p5-q1-input

        ${isOver ? "drag-over-cell" : ""}

        ${isKeyboardTarget ? "keyboard-drop-preview-wb-unit8-p1-q1" : ""}
      `}
      style={{
        background: isOver && !isLocked ? "#e3f2fd" : "white",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        position: "relative",

        cursor: !isLocked && value ? "pointer" : "default",

        transition: "background 0.2s",
      }}
    >
      {value && !isKeyboardTarget && (
        <span className="drop-real-value-wb-unit8-p1-q1">{value}</span>
      )}

      {isKeyboardTarget && keyboardPickedNum && (
        <span className="drop-preview-value-wb-unit8-p1-q1">
          {keyboardPickedNum}
        </span>
      )}

      {isWrong && (
        <div className="unit3-q3-wrong" aria-hidden="true">
          ✕
        </div>
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit8_Page1_Q1 = () => {
  const [answers, setAnswers] = useState(["", "", "", ""]);

  /*
    null | correct | wrong
  */
  const [results, setResults] = useState(Array(pictures.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedNum, setKeyboardPickedNum] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const bankRefs = useRef({});
  const slotRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const [playingPictureIndex, setPlayingPictureIndex] = useState(null);

  /* =====================================================
     SENSORS
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

  const usedNumbers = new Set(answers.filter(Boolean));

  const dragNum = activeId ? String(activeId).replace("num-", "") : null;

  const isSlotLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const isPictureCorrect = (index) =>
    showAnswerMode || results[index] === "correct";

  const allCorrect = pictures.every((_, index) => results[index] === "correct");

  const editableSlots = () =>
    pictures.map((_, index) => index).filter((index) => !isSlotLocked(index));

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
    setPlayingPictureIndex(null);
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

  /* =====================================================
     FULL CORRECT PICTURE AUDIO
     uses the sentence that belongs
     to the correct number
  ===================================================== */

  const playPictureAudio = (index) => {
    if (!isPictureCorrect(index)) {
      return;
    }

    const correctNum = pictures[index].correct;

    const item = items.find((item) => item.num === correctNum);

    if (!item?.audio) return;

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingPictureIndex(index);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingPictureIndex(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingPictureIndex(null);
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

  const registerBankRef = (num, node) => {
    if (node) {
      bankRefs.current[num] = node;
    }
  };

  const registerSlotRef = (index, node) => {
    if (node) {
      slotRefs.current[index] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (num) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setKeyboardPickedNum(num);

    const available = editableSlots();

    if (!available.length) return;

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      slotRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     TAB BETWEEN UNLOCKED SLOTS
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableSlots();

    if (!available.length) return;

    const position = available.indexOf(currentIndex);

    let nextPosition;

    if (backwards) {
      nextPosition = position <= 0 ? available.length - 1 : position - 1;
    } else {
      nextPosition =
        position === -1 || position === available.length - 1 ? 0 : position + 1;
    }

    const nextIndex = available[nextPosition];

    setKeyboardFocusIndex(nextIndex);

    requestAnimationFrame(() => {
      slotRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardNumber = (index) => {
    if (
      !keyboardPickedNum ||
      isSlotLocked(index) ||
      showAnswerMode ||
      allCorrect
    ) {
      return;
    }

    const picked = keyboardPickedNum;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((value) => value === picked);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = "";
      }

      updated[index] = picked;

      nextAnswers = updated;

      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedNum(null);
    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      if (!nextAnswers) return;

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const nextItem = items.find((item) => !usedAfter.has(item.num));

      if (nextItem) {
        bankRefs.current[nextItem.num]?.focus();
      }
    });
  };

  /* =====================================================
     ESCAPE
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedNum) return;

    const picked = keyboardPickedNum;

    setKeyboardPickedNum(null);
    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const handleClear = (index) => {
    if (showAnswerMode || isSlotLocked(index)) {
      return;
    }

    const num = answers[index];

    if (!num) return;

    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });

    requestAnimationFrame(() => {
      bankRefs.current[num]?.focus();
    });
  };

  /* =====================================================
     MOUSE DRAG
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswerMode || allCorrect) {
      return;
    }

    const num = String(active.id).replace("num-", "");

    const destId = String(over.id);

    if (destId === "number-bank") {
      const oldIndex = answers.findIndex((value) => value === num);

      if (oldIndex !== -1 && !isSlotLocked(oldIndex)) {
        handleClear(oldIndex);
      }

      return;
    }

    if (!destId.startsWith("drop-")) {
      return;
    }

    const targetIndex = Number(destId.replace("drop-", ""));

    if (isSlotLocked(targetIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((value) => value === num);

      if (
        oldIndex !== -1 &&
        oldIndex !== targetIndex &&
        !isSlotLocked(oldIndex)
      ) {
        updated[oldIndex] = "";
      }

      updated[targetIndex] = num;

      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];

      if (updated[targetIndex] === "wrong") {
        updated[targetIndex] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    const hasEmpty = pictures.some(
      (_, index) => results[index] !== "correct" && !answers[index],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill all answer boxes before checking!");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    pictures.forEach((item, index) => {
      if (results[index] === "correct") {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (answers[index] === item.correct) {
        nextResults[index] = "correct";

        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    setKeyboardPickedNum(null);
    setKeyboardFocusIndex(null);

    const total = pictures.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers(pictures.map((item) => item.correct));

    setResults(pictures.map(() => "correct"));

    setShowAnswerMode(true);

    setActiveId(null);

    setKeyboardPickedNum(null);
    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    stopAudio();

    setAnswers(Array(pictures.length).fill(""));

    setResults(Array(pictures.length).fill(null));

    setShowAnswerMode(false);

    setActiveId(null);

    setKeyboardPickedNum(null);
    setKeyboardFocusIndex(null);
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
        className="unit3-q3-wrapper"
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
          <ExerciseHeader
            sectionLetter="A"
            title="Read and number."
            subTitle="Read each command and drag its number to the matching picture."
          />

          {/* =================================================
              NUMBER BANK
          ================================================= */}

          <NumberBank
            usedNumbers={usedNumbers}
            showAnswerMode={showAnswerMode || allCorrect}
            keyboardPickedNum={keyboardPickedNum}
            onKeyboardPick={handleKeyboardPick}
            registerRef={registerBankRef}
            playingKey={playingKey}
            onPlayAudio={playAudio}
          />

          {/* =================================================
              PICTURES
          ================================================= */}

          <div className="wb-unit8-p1-q1-grid">
            {pictures.map((item, index) => {
              const pictureCorrect = isPictureCorrect(index);

              return (
                <div
                  key={index}
                  className={`
                      wb-unit8-p1-q1-box

                      ${
                        pictureCorrect ? "completed-picture-wb-unit8-p1-q1" : ""
                      }
                    `}
                  role={pictureCorrect ? "button" : undefined}
                  tabIndex={pictureCorrect ? 0 : undefined}
                  aria-label={
                    pictureCorrect
                      ? `Picture ${index + 1}. Correct answer number ${item.correct}. Press Enter or Space to hear the matching command.`
                      : undefined
                  }
                  onClick={() => {
                    if (pictureCorrect) {
                      playPictureAudio(index);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!pictureCorrect) {
                      return;
                    }

                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();

                      playPictureAudio(index);
                    }
                  }}
                  style={{
                    position: "relative",
                  }}
                >
                  <img
                    src={item.img}
                    className="unit3-q3-image"
                    alt={item.alt}
                  />

                  <div className="wb-unit8-p1-q1-input-wrapper">
                    <DroppableCell
                      index={index}
                      value={answers[index]}
                      isWrong={results[index] === "wrong"}
                      isLocked={isSlotLocked(index)}
                      keyboardPickedNum={keyboardPickedNum}
                      keyboardFocusIndex={keyboardFocusIndex}
                      onKeyboardPlace={placeKeyboardNumber}
                      onKeyboardCancel={cancelKeyboardPick}
                      onMoveKeyboardFocus={moveKeyboardFocus}
                      onSlotFocus={setKeyboardFocusIndex}
                      onClear={handleClear}
                      registerRef={registerSlotRef}
                    />
                  </div>

                  {pictureCorrect && playingPictureIndex === index && (
                    <FaVolumeUp
                      aria-hidden="true"
                      className="full-audio-icon-wb-unit8-p1-q1"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
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
        {dragNum ? (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #2c5287",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              background: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              cursor: "grabbing",
            }}
          >
            {dragNum}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page1_Q1;
