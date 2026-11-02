import React, { useRef, useState } from "react";

import conversation from "../../../assets/unit7/img/U7P63EXEF-01.svg";
import conversation2 from "../../../assets/unit7/img/U7P63EXEF-02.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

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

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

import "./WB_Unit4_Page2_Q1.css";

/* =====================================================
   AUDIO - OPTIONS
===================================================== */

import squareAudio from "../../../assets/U1 WB/U4/audio/page_22_qc/Item_002_It_is_a_square.mp3";
import triangleAudio from "../../../assets/U1 WB/U4/audio/page_22_qc/Item_003_It_is_a_triangle.mp3";
import circleAudio from "../../../assets/U1 WB/U4/audio/page_22_qc/Item_004_It_is_a_circle.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: 1,
    question: "What shape is it?",
    shape: "square",
  },
  {
    id: 2,
    question: "What shape is it?",
    shape: "triangle",
  },
  {
    id: 3,
    question: "What shape is it?",
    shape: "circle",
  },
];

const correctAnswers = {
  q1: "It is a square.",
  q2: "It is a triangle",
  q3: "It is a circle",
};

const wordBank = [
  {
    id: "bank-0",
    word: "It is a square.",
    audio: squareAudio,
  },
  {
    id: "bank-1",
    word: "It is a triangle",
    audio: triangleAudio,
  },
  {
    id: "bank-2",
    word: "It is a circle",
    audio: circleAudio,
  },
];

const paletteColors = [
  {
    value: "#ff0000",
    label: "Red",
  },
  {
    value: "#0000ff",
    label: "Blue",
  },
  {
    value: "#ffff00",
    label: "Yellow",
  },
  {
    value: "#00aa00",
    label: "Green",
  },
  {
    value: "#ff9900",
    label: "Orange",
  },
];

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  id,
  word,
  audio,

  disabled,
  isUsed,

  keyboardPickedItem,
  onKeyboardPick,

  bankRefs,

  playingKey,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked = keyboardPickedItem?.id === id;

  const isPlaying = playingKey === id;

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
          bankRefs.current[id] = el;
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
            ? `${word} selected. Press Tab to choose an answer blank.`
            : `${word}. Press Enter or Space to hear and select it.`
        }
        onClick={() => {
          // Mouse click = صوت
          playAudio(id, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            playAudio(id, audio);

            onKeyboardPick({
              id,
              word,
            });
          }
        }}
        className={`word-bank-item-wb-unit4-p2-q1 ${
          isPicked ? "keyboard-picked-word-wb-unit4-p2-q1" : ""
        }`}
        style={{
          padding: "7px 14px",

          border: "2px solid #2c5287",

          borderRadius: "8px",

          background: isPicked ? "#dbeafe" : isUsed ? "#e0e0e0" : "white",

          fontWeight: "bold",

          cursor: isDisabled ? "default" : isDragging ? "grabbing" : "grab",

          opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

          touchAction: "none",

          transition: "all 0.2s ease",

          color: isUsed ? "#999" : "inherit",

          userSelect: "none",
        }}
      >
        {word}
      </span>

      {isPlaying && (
        <FaVolumeUp
          size={15}
          aria-hidden="true"
          className="audio-icon-wb-unit4-p2-q1"
        />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DroppableInput = ({
  droppableId,
  qKey,

  value,

  isWrong,
  locked,

  showAnswer,
  checkCompleted,

  keyboardPickedItem,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,
  getAvailableSlotIds,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedItem && !locked && !showAnswer && !checkCompleted;

  /* =========================================
     UPDATED DRAG PATTERN
     أي answer معبّى ولسا editable
     يضل reachable بالـTab حتى قبل Check
  ========================================= */

  const canEditFilled =
    !!value && !keyboardPickedItem && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === droppableId;

  const displayValue = showPreview
    ? keyboardPickedItem.word
    : value?.word || "";

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT → RETURN TO BANK
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(qKey, value);

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

      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(droppableId);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextId = available[nextIndex];

      slotRefs.current[nextId]?.focus();

      return;
    }

    /* =========================================
       ENTER / SPACE → PLACE / REPLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(qKey);

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
    <span
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <span
        ref={(el) => {
          setNodeRef(el);

          slotRefs.current[droppableId] = el;
        }}
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
              ? `Answer contains ${value.word}. Press Enter or Space to replace it with ${keyboardPickedItem.word}.`
              : `Empty answer. Press Enter or Space to place ${keyboardPickedItem.word}.`
            : canEditFilled
              ? `Answer contains ${value.word}. Press Enter or Space to return it to the word bank.`
              : value
                ? `Answer contains ${value.word}.`
                : "Empty answer."
        }
        onFocus={() => {
          if (keyboardDropActive) {
            setFocusedSlotId(droppableId);
          }
        }}
        onBlur={() => {
          setFocusedSlotId(null);
        }}
        onKeyDown={handleKeyDown}
        className={`answer-input-wrapper-wb-unit4-p2-q1 ${
          showPreview ? "keyboard-drop-preview-wb-unit4-p2-q1" : ""
        }`}
      >
        <input
          type="text"
          value={displayValue}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          className={`answer-input-wb-unit4-p2-q1 ${
            isOver && !locked ? "drag-over-cell" : ""
          }`}
          onClick={() => {
            if (value && !locked && !showAnswer && !checkCompleted) {
              onRemove(droppableId);
            }
          }}
          style={{
            background: isOver && !locked ? "#e3f2fd" : "",

            cursor:
              value && !locked && !showAnswer && !checkCompleted
                ? "pointer"
                : "default",
          }}
        />
      </span>

      {isWrong && (
        <span className="wrong-mark" aria-hidden="true">
          ✕
        </span>
      )}
    </span>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit4_Page2_Q1 = () => {
  const emptyAnswers = () => ({
    q1: null,
    q2: null,
    q3: null,
  });

  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState(emptyAnswers());

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* =================================================
     KEYBOARD DRAG
  ================================================= */

  const bankRefs = useRef({});
  const slotRefs = useRef({});

  const [keyboardPickedItem, setKeyboardPickedItem] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =================================================
     COLORING
     لا يوجد Validation عليها
  ================================================= */

  const [shapeColors, setShapeColors] = useState({
    1: "#ffffff",
    2: "#ffffff",
    3: "#ffffff",
  });

  const [selectedColor, setSelectedColor] = useState("#ff0000");

  const [activeShape, setActiveShape] = useState(null);

  const shapeRefs = useRef({});

  const paletteButtonRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

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

  /* =================================================
     HELPERS
  ================================================= */

  const isQuestionLocked = (qKey) => lockedQuestions.includes(qKey);

  const usedIds = Object.values(answers)
    .filter(Boolean)
    .map((item) => item.bankId);

  const getAvailableSlotIds = () =>
    questions
      .map((q) => `blank-q${q.id}`)
      .filter((id) => {
        const qKey = id.replace("blank-", "");

        return !isQuestionLocked(qKey) && !showAnswer && !checkCompleted;
      });

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
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const handleDragStart = (event) => {
    const item = wordBank.find((bankItem) => bankItem.id === event.active.id);

    setActiveWord(item?.word ?? null);
  };

  const handleDragEnd = (event) => {
    setActiveWord(null);

    if (showAnswer || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !String(over.id).startsWith("blank-")) {
      return;
    }

    const bankItem = wordBank.find((item) => item.id === active.id);

    if (!bankItem) return;

    const qKey = String(over.id).replace("blank-", "");

    if (isQuestionLocked(qKey)) {
      return;
    }

    let oldQKey = null;

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      /*
        إذا نفس bank item كان بمكان قديم
      */

      Object.keys(updated).forEach((key) => {
        if (updated[key]?.bankId === bankItem.id && !isQuestionLocked(key)) {
          oldQKey = key;

          updated[key] = null;
        }
      });

      /*
        Replace
      */

      updated[qKey] = {
        word: bankItem.word,

        bankId: bankItem.id,
      };

      return updated;
    });

    setWrongInputs((prev) =>
      prev.filter((key) => key !== qKey && key !== oldQKey),
    );
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (item) => {
    if (showAnswer || checkCompleted || usedIds.includes(item.id)) {
      return;
    }

    setKeyboardPickedItem(item);

    setFocusedSlotId(null);

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (qKey) => {
    if (
      !keyboardPickedItem ||
      showAnswer ||
      checkCompleted ||
      isQuestionLocked(qKey)
    ) {
      return;
    }

    const item = keyboardPickedItem;

    const updated = {
      ...answers,
    };

    let oldQKey = null;

    Object.keys(updated).forEach((key) => {
      if (updated[key]?.bankId === item.id && !isQuestionLocked(key)) {
        oldQKey = key;

        updated[key] = null;
      }
    });

    updated[qKey] = {
      word: item.word,
      bankId: item.id,
    };

    setAnswers(updated);

    setWrongInputs((prev) =>
      prev.filter((key) => key !== qKey && key !== oldQKey),
    );

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      const currentUsed = Object.values(updated)
        .filter(Boolean)
        .map((answer) => answer.bankId);

      const nextItem = wordBank.find(
        (bankItem) => !currentUsed.includes(bankItem.id),
      );

      if (nextItem) {
        bankRefs.current[nextItem.id]?.focus();
      }
    }, 0);
  };

  /* =================================================
     WRONG SLOT AFTER CHECK
  ================================================= */

  const handleKeyboardClearWrong = (qKey, value) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qKey)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [qKey]: null,
    }));

    /*
      X فقط عن نفس السؤال
    */

    setWrongInputs((prev) => prev.filter((key) => key !== qKey));

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (value?.bankId) {
        bankRefs.current[value.bankId]?.focus();
      }
    }, 0);
  };

  /* =================================================
     CANCEL KEYBOARD DRAG
  ================================================= */

  const handleCancelKeyboardPick = () => {
    const item = keyboardPickedItem;

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (item?.id) {
        bankRefs.current[item.id]?.focus();
      }
    }, 0);
  };

  /* =================================================
     REMOVE WITH MOUSE
  ================================================= */

  const handleRemove = (droppableId) => {
    const qKey = droppableId.replace("blank-", "");

    if (showAnswer || checkCompleted || isQuestionLocked(qKey)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [qKey]: null,
    }));

    setWrongInputs((prev) => prev.filter((key) => key !== qKey));
  };

  /* =================================================
     CHECK
     التلوين مش داخل بالـValidation
  ================================================= */

  const handleCheck = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const keys = ["q1", "q2", "q3"];

    if (keys.some((key) => !answers[key])) {
      ValidationAlert.info("Please complete all answers.");

      return;
    }

    const wrong = [];

    const newlyLocked = [];

    let score = 0;

    keys.forEach((key) => {
      const correct =
        answers[key]?.word?.trim().toLowerCase() ===
        correctAnswers[key].trim().toLowerCase();

      if (correct) {
        score++;

        newlyLocked.push(key);
      } else {
        wrong.push(key);
      }
    });

    /*
      الصح فقط يقفل
    */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /*
      الغلط فقط عليه X
    */

    setWrongInputs(wrong);

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    const total = keys.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedQuestions(keys);

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
     ما بنغير الألوان
  ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    const filled = {};

    Object.keys(correctAnswers).forEach((qKey) => {
      const bankItem = wordBank.find(
        (item) =>
          item.word.trim().toLowerCase() ===
          correctAnswers[qKey].trim().toLowerCase(),
      );

      filled[qKey] = bankItem
        ? {
            word: bankItem.word,

            bankId: bankItem.id,
          }
        : null;
    });

    setAnswers(filled);

    setWrongInputs([]);

    setLockedQuestions(["q1", "q2", "q3"]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const handleReset = () => {
    stopAudio();

    setAnswers(emptyAnswers());

    setWrongInputs([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    setShapeColors({
      1: "#ffffff",
      2: "#ffffff",
      3: "#ffffff",
    });

    setSelectedColor("#ff0000");

    setActiveShape(null);
  };

  /* =================================================
     COLORING
  ================================================= */

  const openPalette = (shapeId) => {
    setActiveShape(shapeId);

    requestAnimationFrame(() => {
      paletteButtonRefs.current[`${shapeId}-0`]?.focus();
    });
  };

  const closePalette = (shapeId) => {
    setActiveShape(null);

    requestAnimationFrame(() => {
      shapeRefs.current[shapeId]?.focus();
    });
  };

  const chooseColor = (shapeId, color) => {
    setShapeColors((prev) => ({
      ...prev,
      [shapeId]: color,
    }));

    setSelectedColor(color);

    setActiveShape(null);

    requestAnimationFrame(() => {
      shapeRefs.current[shapeId]?.focus();
    });
  };

  /* =================================================
     RENDER SHAPE
  ================================================= */

  const renderShape = (id) => {
    const fill = shapeColors[id];

    const stroke = "#999";

    const sw = 4;

    const shapeName = id === 1 ? "square" : id === 2 ? "triangle" : "circle";

    const commonProps = {
      width: 120,
      height: 120,

      role: "button",

      tabIndex: 0,

      "aria-label": `${shapeName}. Press Enter or Space to choose a color.`,

      ref: (el) => {
        shapeRefs.current[id] = el;
      },

      className: "colorable-shape-wb-unit4-p2-q1",

      onClick: () => openPalette(id),

      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          e.stopPropagation();

          openPalette(id);
        }
      },
    };

    if (id === 1) {
      return (
        <svg {...commonProps}>
          <rect
            x="10"
            y="10"
            width="100"
            height="100"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );
    }

    if (id === 2) {
      return (
        <svg {...commonProps}>
          <polygon
            points="60,10 110,110 10,110"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );
    }

    return (
      <svg {...commonProps}>
        <circle
          cx="60"
          cy="60"
          r="50"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      </svg>
    );
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveWord(null)}
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
            gap: "20px",
          }}
        >
          <ExerciseHeader
            sectionLetter="C"
            title="Look, read, and write. Color."
            subTitle="Match each shape sentence to its picture, then color the shape."
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

              width: "100%",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {wordBank.map((item) => (
              <DraggableWord
                key={item.id}
                id={item.id}
                word={item.word}
                audio={item.audio}
                disabled={showAnswer || checkCompleted}
                isUsed={usedIds.includes(item.id)}
                keyboardPickedItem={keyboardPickedItem}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
                playingKey={playingKey}
                playAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div
            style={{
              width: "100%",
            }}
          >
            {questions.map((q, index) => {
              const qKey = `q${q.id}`;

              return (
                <div key={q.id} className="question-row-unit7-p2-q3">
                  <div
                    className="question-container-unit7-p6-q3"
                    style={{
                      gap: "20px",
                    }}
                  >
                    <span className="num2">{index + 1}</span>

                    {/* =====================================
                          SHAPE + PALETTE
                      ===================================== */}

                    <div className="shape-wrapper shape-color-container-wb-unit4-p2-q1">
                      {renderShape(q.id)}

                      {activeShape === q.id && (
                        <div
                          className="color-pallet-wb-unit4-p2-q1"
                          role="group"
                          aria-label={`Choose a color for ${q.shape}`}
                        >
                          {paletteColors.map((color, colorIndex) => (
                            <button
                              key={color.value}
                              ref={(el) => {
                                paletteButtonRefs.current[
                                  `${q.id}-${colorIndex}`
                                ] = el;
                              }}
                              type="button"
                              className="color-option-wb-unit4-p2-q1"
                              aria-label={color.label}
                              style={{
                                backgroundColor: color.value,

                                border:
                                  selectedColor === color.value
                                    ? "3px solid black"
                                    : "1px solid #ccc",
                              }}
                              onClick={() => chooseColor(q.id, color.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                  e.preventDefault();

                                  e.stopPropagation();

                                  closePalette(q.id);
                                }
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="question-text-wb-unit4-p2-q1">{q.question}</p>
                  </div>

                  {/* =====================================
                        DROP SLOT
                    ===================================== */}

                  <div className="sentence-box-wb-unit4-p2-q1">
                    <DroppableInput
                      droppableId={`blank-${qKey}`}
                      qKey={qKey}
                      value={answers[qKey]}
                      isWrong={wrongInputs.includes(qKey)}
                      locked={isQuestionLocked(qKey)}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      keyboardPickedItem={keyboardPickedItem}
                      focusedSlotId={focusedSlotId}
                      setFocusedSlotId={setFocusedSlotId}
                      slotRefs={slotRefs}
                      getAvailableSlotIds={getAvailableSlotIds}
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
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button onClick={handleCheck} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord && (
          <div
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
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit4_Page2_Q1;
