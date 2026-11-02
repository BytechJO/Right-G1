import React, { useRef, useState } from "react";

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

import { FaVolumeUp } from "react-icons/fa";

import "./WB_Unit4_Page4_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import circleAudio from "../../../assets/U1 WB/U4/audio/page_23_q_g/Item_001_circle.mp3";
import squareAudio from "../../../assets/U1 WB/U4/audio/page_23_q_g/Item_002_square.mp3";
import rectangleAudio from "../../../assets/U1 WB/U4/audio/page_23_q_g/Item_003_rectangle.mp3";
import triangleAudio from "../../../assets/U1 WB/U4/audio/page_23_q_g/Item_004_triangle.mp3";

/* =====================================================
   WORD BANK
===================================================== */

const WORDS = [
  {
    word: "triangle",
    audio: triangleAudio,
  },
  {
    word: "circle",
    audio: circleAudio,
  },
  {
    word: "square",
    audio: squareAudio,
  },
  {
    word: "rectangle",
    audio: rectangleAudio,
  },
];

/* =====================================================
   COLORS
===================================================== */

const BASIC_COLORS = [
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
    value: "#ffa200",
    label: "Orange",
  },
];

/* =====================================================
   EMPTY VALUES
===================================================== */

const emptyLabels = () => ({
  triangle: "",
  circle1: "",
  circle2: "",
  house: "",
  door: "",
});

const emptyColors = () => ({
  triangle: "#ffffff",
  circle1: "#ffffff",
  circle2: "#ffffff",
  house: "#ffffff",
  door: "#ffffff",
});

/* =====================================================
   HELPERS
===================================================== */

const SHAPE_KEYS = ["triangle", "circle1", "circle2", "house", "door"];

const shapeNames = {
  triangle: "triangle roof",
  circle1: "left circle window",
  circle2: "right circle window",
  house: "square house body",
  door: "rectangle door",
};

/* =====================================================
   WRONG ICON
===================================================== */

const WrongIcon = () => (
  <div
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -12,
      right: -12,

      width: 22,
      height: 22,

      borderRadius: "50%",

      backgroundColor: "red",
      color: "#fff",

      fontSize: 14,
      fontWeight: "bold",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      border: "2px solid white",

      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",

      zIndex: 20,
    }}
  >
    ✕
  </div>
);

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  word,
  audio,

  dragDisabled,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,

  playingWord,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,
    disabled: dragDisabled,
  });

  const isPicked = keyboardPickedWord === word;

  const isPlaying = playingWord === word;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);

          bankRefs.current[word] = el;
        }}
        {...(!dragDisabled
          ? {
              ...listeners,
              ...attributes,
            }
          : {})}
        role="button"
        tabIndex={0}
        aria-pressed={isPicked}
        aria-label={
          dragDisabled
            ? `${word}. Press Enter or Space to hear the word.`
            : isPicked
              ? `${word} selected. Press Tab to choose a shape label box.`
              : `${word}. Press Enter or Space to hear and select this word.`
        }
        onClick={() => {
          playAudio(word, audio);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            playAudio(word, audio);

            if (!dragDisabled) {
              onKeyboardPick(word);
            }
          }
        }}
        className={`drag-word-wb-unit4-p4-q1 ${
          isPicked ? "keyboard-picked-word-wb-unit4-p4-q1" : ""
        }`}
        style={{
          padding: "7px 14px",

          border: "2px solid #2c5287",

          borderRadius: "8px",

          background: isPicked ? "#dbeafe" : "white",

          fontWeight: "bold",

          cursor: dragDisabled ? "pointer" : isDragging ? "grabbing" : "grab",

          opacity: isDragging ? 0.4 : 1,

          touchAction: "none",

          transition: "all 0.2s ease",

          userSelect: "none",
        }}
      >
        {word}
      </div>

      {isPlaying && (
        <FaVolumeUp
          size={15}
          aria-hidden="true"
          className="audio-icon-wb-unit4-p4-q1"
        />
      )}
    </div>
  );
};

/* =====================================================
   DROPPABLE LABEL BOX
===================================================== */

const DroppableLabelBox = ({
  shapeKey,
  label,

  isWrong,
  locked,

  showAnswer,
  checkCompleted,

  keyboardPickedWord,

  focusedDropId,
  setFocusedDropId,

  dropRefs,
  getAvailableDropIds,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,

  style,
}) => {
  const droppableId = `shape-${shapeKey}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    disabled: locked || showAnswer || checkCompleted,
  });

  /* =================================================
     KEYBOARD DROP MODE
  ================================================= */

  const keyboardDropActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  /* =================================================
     UPDATED DRAG PATTERN
     أي label box معبّى ولسا مش locked
     يضل reachable بالـTab حتى قبل Check
  ================================================= */

  const canEditFilled =
    !!label && !keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardDropActive && focusedDropId === droppableId;

  const displayedLabel = showPreview ? keyboardPickedWord : label;

  const handleKeyDown = (e) => {
    /* =================================================
       FILLED BOX → RETURN WORD TO BANK
    ================================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(shapeKey, label);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB BETWEEN TARGETS
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableDropIds();

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

      dropRefs.current[nextId]?.focus();

      return;
    }

    /* =================================================
       ENTER / SPACE → DROP / REPLACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(shapeKey);

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

        dropRefs.current[droppableId] = el;
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
          ? label
            ? `${shapeNames[shapeKey]} currently contains ${label}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
            : `${shapeNames[shapeKey]} label box. Press Enter or Space to place ${keyboardPickedWord}.`
          : canEditFilled
            ? `${shapeNames[shapeKey]} currently contains ${label}. Press Enter or Space to return ${label} to the word bank.`
            : label
              ? `${shapeNames[shapeKey]} labeled ${label}.`
              : `${shapeNames[shapeKey]} label box.`
      }
      className={`drop-label-box ${isOver ? "drag-over-cell" : ""} ${
        showPreview ? "keyboard-drop-preview-wb-unit4-p4-q1" : ""
      }`}
      onFocus={() => {
        if (keyboardDropActive) {
          setFocusedDropId(droppableId);
        }
      }}
      onBlur={() => {
        setFocusedDropId(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (label && !locked && !showAnswer && !checkCompleted) {
          onRemove(shapeKey);
        }
      }}
      style={{
        height: 30,

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        border: "2px dashed #999",

        borderRadius: 6,

        position: "relative",

        backgroundColor: isOver ? "#e3f2fd" : "#fff",

        transform: isOver ? "scale(1.05)" : "scale(1)",

        transition: "all 0.2s ease",

        cursor:
          !locked && label && !showAnswer && !checkCompleted
            ? "pointer"
            : "default",

        ...style,
      }}
    >
      {displayedLabel && <span>{displayedLabel}</span>}

      {isWrong && <WrongIcon />}
    </div>
  );
};
/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit4_Page4_Q1 = () => {
  /* =====================================================
     LABELS / CHECK
  ===================================================== */

  const [labels, setLabels] = useState(emptyLabels());

  const [wrongShapes, setWrongShapes] = useState([]);

  const [lockedShapes, setLockedShapes] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     COLORS
     مش داخلة بالـValidation
  ===================================================== */

  const [colors, setColors] = useState(emptyColors());

  const [activeShape, setActiveShape] = useState(null);

  const [showPalette, setShowPalette] = useState(false);

  const [palettePosition, setPalettePosition] = useState({
    left: 0,
    top: 0,
  });

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeWord, setActiveWord] = useState(null);

  /* =====================================================
     KEYBOARD DRAG
  ===================================================== */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedDropId, setFocusedDropId] = useState(null);

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  /* =====================================================
     COLOR REFS
  ===================================================== */

  const shapeRefs = useRef({});

  const paletteButtonRefs = useRef({});

  const houseContainerRef = useRef(null);

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
     HELPERS
  ===================================================== */

  const isShapeLocked = (shapeKey) => lockedShapes.includes(shapeKey);

  const isCorrectValue = (shapeKey, value) => {
    if (shapeKey === "triangle") {
      return value === "triangle";
    }

    if (shapeKey === "circle1" || shapeKey === "circle2") {
      return value === "circle";
    }

    if (shapeKey === "house" || shapeKey === "door") {
      return ["square", "rectangle"].includes(value);
    }

    return false;
  };

  const getAvailableDropIds = () =>
    SHAPE_KEYS.filter((shapeKey) => !isShapeLocked(shapeKey)).map(
      (shapeKey) => `shape-${shapeKey}`,
    );

  /* =====================================================
     MOUSE DRAG START
  ===================================================== */

  const handleDragStart = (event) => {
    const word = event.active.id.replace("word-", "");

    setActiveWord(word);
  };

  /* =====================================================
     MOUSE DRAG END
  ===================================================== */

  const handleDragEnd = (event) => {
    setActiveWord(null);

    if (showAnswer || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !String(over.id).startsWith("shape-")) {
      return;
    }

    const shapeKey = String(over.id).replace("shape-", "");

    if (isShapeLocked(shapeKey)) {
      return;
    }

    const word = active.id.replace("word-", "");

    /*
      الكلمات reusable.
      circle ممكن تنحط مرتين.
    */

    setLabels((prev) => ({
      ...prev,

      [shapeKey]: word,
    }));

    /*
      شيل X فقط عن نفس الهدف
    */

    setWrongShapes((prev) => prev.filter((shape) => shape !== shapeKey));
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedWord(word);

    setFocusedDropId(null);

    requestAnimationFrame(() => {
      const available = getAvailableDropIds();

      if (!available.length) {
        return;
      }

      dropRefs.current[available[0]]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DROP
  ===================================================== */

  const handleKeyboardDrop = (shapeKey) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isShapeLocked(shapeKey)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    setLabels((prev) => ({
      ...prev,

      [shapeKey]: word,
    }));

    setWrongShapes((prev) => prev.filter((shape) => shape !== shapeKey));

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
      الكلمات قابلة لإعادة الاستخدام،
      فرجّع focus لنفس الكلمة.
    */

    window.setTimeout(() => {
      bankRefs.current[word]?.focus();
    }, 0);
  };

  /* =====================================================
     WRONG TARGET AFTER CHECK
  ===================================================== */

  const handleKeyboardClearWrong = (shapeKey, currentWord) => {
    if (showAnswer || checkCompleted || isShapeLocked(shapeKey)) {
      return;
    }

    setLabels((prev) => ({
      ...prev,

      [shapeKey]: "",
    }));

    setWrongShapes((prev) => prev.filter((shape) => shape !== shapeKey));

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      if (currentWord) {
        bankRefs.current[currentWord]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     CANCEL KEYBOARD DRAG
  ===================================================== */

  const handleCancelKeyboardPick = () => {
    const word = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      if (word) {
        bankRefs.current[word]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     REMOVE LABEL WITH MOUSE
  ===================================================== */

  const handleRemove = (shapeKey) => {
    if (showAnswer || checkCompleted || isShapeLocked(shapeKey)) {
      return;
    }

    setLabels((prev) => ({
      ...prev,

      [shapeKey]: "",
    }));

    setWrongShapes((prev) => prev.filter((shape) => shape !== shapeKey));
  };

  /* =====================================================
     COLORS
     SINGLE CLICK + KEYBOARD
  ===================================================== */

  const openColorPicker = (shapeKey, element = null) => {
    /*
      التلوين مش عليه Validation.
      بعد Show Answer بس منقفل تغيير الألوان.
    */

    if (showAnswer) {
      return;
    }

    const shapeElement = element || shapeRefs.current[shapeKey];

    const container = houseContainerRef.current;

    if (shapeElement && container) {
      const shapeRect = shapeElement.getBoundingClientRect();

      const containerRect = container.getBoundingClientRect();

      setPalettePosition({
        left: shapeRect.left - containerRect.left + shapeRect.width / 2,

        top: shapeRect.top - containerRect.top - 10,
      });
    }

    setActiveShape(shapeKey);

    setShowPalette(true);

    /*
      Enter / Click على الجزء:
      افتح الـpalette
      وروح دغري لأول لون.
    */

    requestAnimationFrame(() => {
      paletteButtonRefs.current[`${shapeKey}-0`]?.focus();
    });
  };

  const closeColorPicker = (shapeKey) => {
    setShowPalette(false);

    setActiveShape(null);

    requestAnimationFrame(() => {
      shapeRefs.current[shapeKey]?.focus();
    });
  };

  const selectColor = (color) => {
    const shapeKey = activeShape;

    if (!shapeKey) return;

    setColors((prev) => ({
      ...prev,

      [shapeKey]: color,
    }));

    setShowPalette(false);

    setActiveShape(null);

    requestAnimationFrame(() => {
      shapeRefs.current[shapeKey]?.focus();
    });
  };

  /* =====================================================
     CHECK ANSWER
     التلوين مش داخل بالـValidation
  ===================================================== */

  const checkAnswer = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const allFilled = Object.values(labels).every(Boolean);

    if (!allFilled) {
      ValidationAlert.info("Please label all the shapes.");

      return;
    }

    const wrong = [];

    const newlyLocked = [];

    let score = 0;

    SHAPE_KEYS.forEach((shapeKey) => {
      const correct = isCorrectValue(shapeKey, labels[shapeKey]);

      if (correct) {
        score++;

        newlyLocked.push(shapeKey);
      } else {
        wrong.push(shapeKey);
      }
    });

    /*
      Progressive Lock
    */

    setLockedShapes((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setWrongShapes(wrong);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    const total = 5;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedShapes([...SHAPE_KEYS]);

      setWrongShapes([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    setLabels({
      triangle: "triangle",

      circle1: "circle",

      circle2: "circle",

      house: "square",

      door: "rectangle",
    });

    setColors({
      triangle: "blue",

      circle1: "red",

      circle2: "red",

      house: "#ffff00",

      door: "green",
    });

    setWrongShapes([]);

    setLockedShapes([...SHAPE_KEYS]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    setShowPalette(false);

    setActiveShape(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setLabels(emptyLabels());

    setColors(emptyColors());

    setWrongShapes([]);

    setLockedShapes([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setShowPalette(false);

    setActiveShape(null);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);
  };

  /* =====================================================
     SHARED DROP STYLE
  ===================================================== */

  const boxStyle = {
    height: 30,
    width: "100%",
  };

  /* =====================================================
     SHAPE KEYBOARD HANDLER
  ===================================================== */

  const handleShapeKeyDown = (e, shapeKey) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      openColorPicker(shapeKey, e.currentTarget);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveWord(null)}
    >
      <div
        style={{
          padding: 30,

          display: "flex",

          flexDirection: "column",

          alignItems: "center",
        }}
      >
        <div
          className="div-forall"
          style={{
            gap: "20px",
          }}
        >
          <ExerciseHeader
            sectionLetter="G"
            title="Look and label the shapes. Then color."
            subTitle="Drag the shape names to the house parts, then color them."
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
            {WORDS.map((item) => (
              <DraggableWord
                key={item.word}
                word={item.word}
                audio={item.audio}
                /*
                    Drag يقفل بعد النهاية،
                    بس الكلمة تضل بالـTab للصوت.
                  */

                dragDisabled={showAnswer || checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
                playingWord={playingWord}
                playAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              HOUSE
          ================================================= */}

          <div
            ref={houseContainerRef}
            style={{
              position: "relative",

              width: 300,

              height: 350,

              left: "20vw",

              overflow: "visible",
            }}
          >
            <svg
              width="300"
              height="350"
              className="all-svg-house-wb-unit4-p4-q1"
              aria-label="A house made from a triangle roof, square body, two circle windows, and a rectangle door."
            >
              {/* =============================================
                  TRIANGLE
              ============================================= */}

              <polygon
                ref={(el) => {
                  shapeRefs.current.triangle = el;
                }}
                points="150,20 50,120 250,120"
                fill={colors.triangle}
                stroke="black"
                role="button"
                tabIndex={0}
                aria-label="Triangle roof. Press Enter or Space to choose a color."
                onClick={(e) => openColorPicker("triangle", e.currentTarget)}
                onKeyDown={(e) => handleShapeKeyDown(e, "triangle")}
                className="colorable-house-shape-wb-unit4-p4-q1"
              />

              {/* =============================================
                  HOUSE BODY
              ============================================= */}

              <rect
                ref={(el) => {
                  shapeRefs.current.house = el;
                }}
                x="50"
                y="120"
                width="200"
                height="180"
                fill={colors.house}
                stroke="black"
                role="button"
                tabIndex={0}
                aria-label="Square house body. Press Enter or Space to choose a color."
                onClick={(e) => openColorPicker("house", e.currentTarget)}
                onKeyDown={(e) => handleShapeKeyDown(e, "house")}
                className="colorable-house-shape-wb-unit4-p4-q1"
              />

              {/* =============================================
                  LEFT CIRCLE
              ============================================= */}

              <circle
                ref={(el) => {
                  shapeRefs.current.circle1 = el;
                }}
                cx="100"
                cy="170"
                r="30"
                fill={colors.circle1}
                stroke="black"
                role="button"
                tabIndex={0}
                aria-label="Left circle window. Press Enter or Space to choose a color."
                onClick={(e) => openColorPicker("circle1", e.currentTarget)}
                onKeyDown={(e) => handleShapeKeyDown(e, "circle1")}
                className="colorable-house-shape-wb-unit4-p4-q1"
              />

              {/* =============================================
                  RIGHT CIRCLE
              ============================================= */}

              <circle
                ref={(el) => {
                  shapeRefs.current.circle2 = el;
                }}
                cx="200"
                cy="170"
                r="30"
                fill={colors.circle2}
                stroke="black"
                role="button"
                tabIndex={0}
                aria-label="Right circle window. Press Enter or Space to choose a color."
                onClick={(e) => openColorPicker("circle2", e.currentTarget)}
                onKeyDown={(e) => handleShapeKeyDown(e, "circle2")}
                className="colorable-house-shape-wb-unit4-p4-q1"
              />

              {/* =============================================
                  DOOR
              ============================================= */}

              <rect
                ref={(el) => {
                  shapeRefs.current.door = el;
                }}
                x="110"
                y="230"
                width="70"
                height="70"
                fill={colors.door}
                stroke="black"
                role="button"
                tabIndex={0}
                aria-label="Rectangle door. Press Enter or Space to choose a color."
                onClick={(e) => openColorPicker("door", e.currentTarget)}
                onKeyDown={(e) => handleShapeKeyDown(e, "door")}
                className="colorable-house-shape-wb-unit4-p4-q1"
              />
            </svg>

            {/* =================================================
                TRIANGLE DROP
            ================================================= */}

            <div
              style={{
                position: "absolute",
                top: 120,
                left: 90,
                width: 120,
              }}
            >
              <DroppableLabelBox
                shapeKey="triangle"
                label={labels.triangle}
                isWrong={wrongShapes.includes("triangle")}
                locked={isShapeLocked("triangle")}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                focusedDropId={focusedDropId}
                setFocusedDropId={setFocusedDropId}
                dropRefs={dropRefs}
                getAvailableDropIds={getAvailableDropIds}
                onKeyboardDrop={handleKeyboardDrop}
                onKeyboardClearWrong={handleKeyboardClearWrong}
                onCancelKeyboardPick={handleCancelKeyboardPick}
                onRemove={handleRemove}
                style={boxStyle}
              />
            </div>

            {/* =================================================
                HOUSE DROP
            ================================================= */}

            <div
              style={{
                position: "absolute",
                top: 305,
                left: 90,
                width: 120,
              }}
            >
              <DroppableLabelBox
                shapeKey="house"
                label={labels.house}
                isWrong={wrongShapes.includes("house")}
                locked={isShapeLocked("house")}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                focusedDropId={focusedDropId}
                setFocusedDropId={setFocusedDropId}
                dropRefs={dropRefs}
                getAvailableDropIds={getAvailableDropIds}
                onKeyboardDrop={handleKeyboardDrop}
                onKeyboardClearWrong={handleKeyboardClearWrong}
                onCancelKeyboardPick={handleCancelKeyboardPick}
                onRemove={handleRemove}
                style={boxStyle}
              />
            </div>

            {/* =================================================
                CIRCLE 1 DROP
            ================================================= */}

            <div
              style={{
                position: "absolute",
                top: 240,
                left: 185,
                width: 80,
              }}
            >
              <DroppableLabelBox
                shapeKey="circle1"
                label={labels.circle1}
                isWrong={wrongShapes.includes("circle1")}
                locked={isShapeLocked("circle1")}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                focusedDropId={focusedDropId}
                setFocusedDropId={setFocusedDropId}
                dropRefs={dropRefs}
                getAvailableDropIds={getAvailableDropIds}
                onKeyboardDrop={handleKeyboardDrop}
                onKeyboardClearWrong={handleKeyboardClearWrong}
                onCancelKeyboardPick={handleCancelKeyboardPick}
                onRemove={handleRemove}
                style={boxStyle}
              />
            </div>

            {/* =================================================
                CIRCLE 2 DROP
            ================================================= */}

            <div
              style={{
                position: "absolute",
                top: 240,
                left: 35,
                width: 80,
              }}
            >
              <DroppableLabelBox
                shapeKey="circle2"
                label={labels.circle2}
                isWrong={wrongShapes.includes("circle2")}
                locked={isShapeLocked("circle2")}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                focusedDropId={focusedDropId}
                setFocusedDropId={setFocusedDropId}
                dropRefs={dropRefs}
                getAvailableDropIds={getAvailableDropIds}
                onKeyboardDrop={handleKeyboardDrop}
                onKeyboardClearWrong={handleKeyboardClearWrong}
                onCancelKeyboardPick={handleCancelKeyboardPick}
                onRemove={handleRemove}
                style={boxStyle}
              />
            </div>

            {/* =================================================
                DOOR DROP
            ================================================= */}

            <div
              style={{
                position: "absolute",

                bottom: -60,

                left: 92,

                width: 100,
              }}
            >
              <DroppableLabelBox
                shapeKey="door"
                label={labels.door}
                isWrong={wrongShapes.includes("door")}
                locked={isShapeLocked("door")}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                focusedDropId={focusedDropId}
                setFocusedDropId={setFocusedDropId}
                dropRefs={dropRefs}
                getAvailableDropIds={getAvailableDropIds}
                onKeyboardDrop={handleKeyboardDrop}
                onKeyboardClearWrong={handleKeyboardClearWrong}
                onCancelKeyboardPick={handleCancelKeyboardPick}
                onRemove={handleRemove}
                style={boxStyle}
              />
            </div>

            {/* =================================================
                COLOR PALETTE
                فوق نفس العنصر
            ================================================= */}

            {showPalette && activeShape && (
              <div
                className="color-palette-wb-unit4-p4-q1"
                role="group"
                aria-label={`Choose a color for ${shapeNames[activeShape]}`}
                style={{
                  left: palettePosition.left,

                  top: palettePosition.top,
                }}
              >
                {BASIC_COLORS.map((color, index) => (
                  <button
                    key={color.value}
                    ref={(el) => {
                      paletteButtonRefs.current[`${activeShape}-${index}`] = el;
                    }}
                    type="button"
                    className="color-circle-wb-unit4-p4-q1"
                    style={{
                      backgroundColor: color.value,
                    }}
                    aria-label={color.label}
                    onClick={() => selectColor(color.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.preventDefault();

                        e.stopPropagation();

                        closeColorPicker(activeShape);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="action-buttons-container">
            <button className="try-again-button" onClick={reset}>
              Start Again ↻
            </button>

            <button className="show-answer-btn" onClick={showAnswers}>
              Show Answer
            </button>

            <button className="check-button2" onClick={checkAnswer}>
              Check Answer ✓
            </button>
          </div>
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

export default WB_Unit4_Page4_Q1;
