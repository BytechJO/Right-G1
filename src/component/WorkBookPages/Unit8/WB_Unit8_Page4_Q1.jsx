import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import bat from "../../../assets/U1 WB/U8/U8P48EXEG-01.svg";
import cap from "../../../assets/U1 WB/U8/U8P48EXEG-02.svg";
import ant from "../../../assets/U1 WB/U8/U8P48EXEG-03.svg";
import dad from "../../../assets/U1 WB/U8/U8P48EXEG-04.svg";

import pencilCursor from "../../../assets/unit1/imgs/pen_96740.png";
import eraserCursor from "../../../assets/unit1/imgs/gui_eraser_icon_157160.png";

import ValidationAlert from "../../Popup/ValidationAlert";
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

import "./WB_Unit8_Page4_Q1.css";

/* =====================================================
   AUDIO
===================================================== */

import armAudio from "../../../assets/U1 WB/U8/audio/page 48 - G/Item_001_is_my_arm.mp3";
import headAudio from "../../../assets/U1 WB/U8/audio/page 48 - G/Item_002_is_my_head.mp3";
import legAudio from "../../../assets/U1 WB/U8/audio/page 48 - G/Item_003_This_is_my_leg.mp3";
import noseAudio from "../../../assets/U1 WB/U8/audio/page 48 - G/Item_004_This_is_my_nose.mp3";

import thisAudio from "../../../assets/U1 WB/U8/audio/page 48 - G/Item_005_This.mp3";

import fullArmAudio from "../../../assets/U1 WB/U8/audio/page 48 - G/item-005-this_is_my_arm.mp3";
import fullHeadAudio from "../../../assets/U1 WB/U8/audio/page 48 - G/item-005-this_is_my_head.mp3";

/* =====================================================
   QUESTIONS
===================================================== */

const questions = [
  {
    id: 1,

    img: bat,

    alt: "Dotted tracing outline of an arm and hand with an arrow pointing to the arm.",

    parts: [
      {
        type: "text",
        value: "This",
        audio: thisAudio,
      },

      {
        type: "input",
        answer: "is my arm",
      },

      {
        type: "text",
        value: ".",
      },
    ],

    fullSentence: "This is my arm.",

    fullAudio: fullArmAudio,
  },

  {
    id: 2,

    img: cap,

    alt: "Dotted tracing outline of a child's head with an arrow pointing to the head.",

    parts: [
      {
        type: "text",
        value: "This",
        audio: thisAudio,
      },

      {
        type: "input",
        answer: "is my head",
      },

      {
        type: "text",
        value: ".",
      },
    ],

    fullSentence: "This is my head.",

    fullAudio: fullHeadAudio,
  },

  {
    id: 3,

    img: ant,

    alt: "Dotted tracing outline of a leg and foot with an arrow pointing to the leg.",

    parts: [
      {
        type: "input",
        answer: "This is my leg",
      },

      {
        type: "text",
        value: ".",
      },
    ],

    fullSentence: "This is my leg.",

    fullAudio: legAudio,
  },

  {
    id: 4,

    img: dad,

    alt: "Dotted tracing outline of a nose shown from the side.",

    parts: [
      {
        type: "input",
        answer: "This is my nose",
      },

      {
        type: "text",
        value: ".",
      },
    ],

    fullSentence: "This is my nose.",

    fullAudio: noseAudio,
  },
];

/* =====================================================
   WORD BANK
===================================================== */

const WORD_BANK = [
  {
    id: "w1",
    text: "is my arm",
    audio: armAudio,
  },

  {
    id: "w2",
    text: "is my head",
    audio: headAudio,
  },

  {
    id: "w3",
    text: "This is my leg",
    audio: legAudio,
  },

  {
    id: "w4",
    text: "This is my nose",
    audio: noseAudio,
  },
];

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  word,
  isUsed,
  selectedWordId,
  onKeyboardSelect,
  onPlayAudio,
  isPlaying,
  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: word.id,

    /*
      الكلمة المستخدمة لا تنسحب مرة ثانية،
      لكنها تظل Tab-able للصوت.
    */
    disabled: isUsed,
  });

  const selected = selectedWordId === word.id;

  /* =====================================================
     CLICK VS DRAG
  ===================================================== */

  const pointerStartRef = useRef(null);

  const pointerMovedRef = useRef(false);

  const setRefs = (node) => {
    setNodeRef(node);

    bankRefs.current[word.id] = node;
  };

  const handlePointerDownCapture = (e) => {
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    pointerMovedRef.current = false;
  };

  const handlePointerMoveCapture = (e) => {
    if (!pointerStartRef.current) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      pointerMovedRef.current = true;
    }
  };

  const handlePointerUpCapture = () => {
    requestAnimationFrame(() => {
      pointerStartRef.current = null;
    });
  };

  /* =====================================================
     MOUSE CLICK
     AUDIO ONLY
  ===================================================== */

  const handleClick = () => {
    /*
      إذا كان Drag:
      ممنوع الصوت.
    */

    if (pointerMovedRef.current || isDragging) {
      pointerMovedRef.current = false;

      return;
    }

    /*
      Mouse click فقط = Audio.
    */

    onPlayAudio(word.audio, `bank-${word.id}`);
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      Enter / Space يشغل الصوت.
    */

    onPlayAudio(word.audio, `bank-${word.id}`);

    /*
      المستخدمة = Audio replay فقط.
    */

    if (isUsed) return;

    /*
      Select for keyboard drag.
    */

    onKeyboardSelect(word.id);
  };

  return (
    <span
      ref={setRefs}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={
        isUsed
          ? `${word.text}. Used answer. Press Enter or Space to hear it again.`
          : selected
            ? `${word.text}. Selected. Tab between the answer blanks and press Enter or Space to place it.`
            : `${word.text}. Press Enter or Space to select and hear it.`
      }
      className={`wb-u8-p4-q1-drag-word ${
        selected ? "wb-u8-p4-q1-drag-word-selected" : ""
      }`}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMoveCapture={handlePointerMoveCapture}
      onPointerUpCapture={handlePointerUpCapture}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        opacity: isUsed ? 0.4 : isDragging ? 0.3 : 1,

        cursor: isUsed ? "pointer" : "grab",
      }}
    >
      {word.text}

      {isPlaying && (
        <FaVolumeUp className="audio-icon-wb-u8-p4-q1" aria-hidden="true" />
      )}
    </span>
  );
};

/* =====================================================
   WORD BANK
===================================================== */

const WordBank = ({
  usedIds,
  selectedWordId,
  onKeyboardSelect,
  onPlayAudio,
  playingAudioId,
  bankRefs,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "word-bank",
  });

  return (
    <div
      ref={setNodeRef}
      className={`wb-u8-p4-q1-word-bank ${
        isOver ? "wb-u8-p4-q1-word-bank-over" : ""
      }`}
    >
      {WORD_BANK.map((word) => (
        <DraggableWord
          key={word.id}
          word={word}
          isUsed={usedIds.has(word.id)}
          selectedWordId={selectedWordId}
          onKeyboardSelect={onKeyboardSelect}
          onPlayAudio={onPlayAudio}
          isPlaying={playingAudioId === `bank-${word.id}`}
          bankRefs={bankRefs}
        />
      ))}
    </div>
  );
};

/* =====================================================
   DROP CELL
===================================================== */

const DroppableCell = ({
  id,

  displayText,

  previewText,

  isWrong,

  locked,

  selectedWordId,

  onRemove,

  onKeyboardDrop,

  onCancelKeyboard,

  onCycleInputFocus,

  inputRefs,
}) => {
  const [focused, setFocused] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: locked,
  });

  const setRefs = (node) => {
    setNodeRef(node);

    inputRefs.current[id] = node;
  };

  /*
    Preview فقط على الخانة الحالية.
  */

  const showPreview = Boolean(selectedWordId) && focused && !locked;

  const visibleText = showPreview && previewText ? previewText : displayText;

  /* =====================================================
     MOUSE
  ===================================================== */

  const handleClick = (e) => {
    if (locked) return;

    if (displayText) {
      e.stopPropagation();

      onRemove();
    }
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleKeyDown = (e) => {
    if (locked) return;

    /* ==========================
       ESCAPE
    ========================== */

    if (e.key === "Escape" && selectedWordId) {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboard();

      return;
    }

    /* ==========================
       TAB TRAP
    ========================== */

    if (e.key === "Tab" && selectedWordId) {
      e.preventDefault();

      onCycleInputFocus(id, e.shiftKey);

      return;
    }

    /* ==========================
       ENTER / SPACE
    ========================== */

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      عند وجود selected option:
      place / replace.
    */

    if (selectedWordId) {
      onKeyboardDrop();

      return;
    }

    /*
      Input غلط / editable:
      رجّعه للبنك.
    */

    if (displayText) {
      onRemove();
    }
  };

  return (
    <span
      ref={setRefs}
      role="button"
      tabIndex={locked ? -1 : 0}
      aria-label={
        locked
          ? `${displayText}. Correct answer.`
          : showPreview
            ? `${previewText}. Preview. Press Enter or Space to place it.`
            : displayText
              ? `${displayText}. Press Enter or Space to remove this answer.`
              : "Empty answer blank."
      }
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        inline-input-wb-unit4-p1-q2

        ${isOver ? "drag-over-cell" : ""}

        ${showPreview ? "keyboard-preview-wb-u8-p4-q1" : ""}
      `}
    >
      <span className={showPreview ? "preview-text-wb-u8-p4-q1" : ""}>
        {visibleText}
      </span>

      {isWrong && <span className="error-mark-input-wb-unit2-page3-q2">✕</span>}
    </span>
  );
};

/* =====================================================
   DRAWING CANVAS
===================================================== */

const DrawingCanvas = ({
  imgSrc,

  alt,

  id,

  canvasRefs,

  canvasHistoryRefs,

  tool,

  penColor,

  keyboardCursor,

  keyboardDrawing,

  canvasFocused,

  onCanvasFocus,

  onCanvasBlur,

  onKeyboardCursorChange,

  onKeyboardDrawingChange,

  onActivateCanvas,
}) => {
  const pointerDrawingRef = useRef(false);

  const lastPointerPosRef = useRef({
    x: 0,
    y: 0,
  });

  const keyboardStep = 8;

  /* =====================================================
     GET POSITION
  ===================================================== */

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;

    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,

      y: (e.clientY - rect.top) * scaleY,
    };
  };

  /* =====================================================
     SAVE STATE
  ===================================================== */

  const saveCanvasState = () => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    if (!canvasHistoryRefs.current[id]) {
      canvasHistoryRefs.current[id] = [];
    }

    canvasHistoryRefs.current[id].push(canvas.toDataURL());

    if (canvasHistoryRefs.current[id].length > 30) {
      canvasHistoryRefs.current[id].shift();
    }
  };

  /* =====================================================
     CONFIGURE CONTEXT
  ===================================================== */

  const configureContext = (ctx) => {
    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";

      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";

      ctx.lineWidth = 3;

      ctx.strokeStyle = penColor;
    }
  };

  /* =====================================================
     POINTER START
  ===================================================== */

  const startDrawing = (e) => {
    e.preventDefault();

    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    onActivateCanvas(id);

    const ctx = canvas.getContext("2d");

    saveCanvasState();

    const pos = getPos(e, canvas);

    pointerDrawingRef.current = true;

    lastPointerPosRef.current = pos;

    canvas.setPointerCapture?.(e.pointerId);

    configureContext(ctx);

    ctx.beginPath();

    ctx.moveTo(pos.x, pos.y);
  };

  /* =====================================================
     POINTER DRAW
  ===================================================== */

  const draw = (e) => {
    e.preventDefault();

    if (!pointerDrawingRef.current) {
      return;
    }

    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const pos = getPos(e, canvas);

    configureContext(ctx);

    ctx.lineTo(pos.x, pos.y);

    ctx.stroke();

    lastPointerPosRef.current = pos;
  };

  /* =====================================================
     POINTER STOP
  ===================================================== */

  const stopDrawing = (e) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    if (!pointerDrawingRef.current) {
      return;
    }

    const ctx = canvas.getContext("2d");

    pointerDrawingRef.current = false;

    ctx.closePath();

    if (e?.pointerId !== undefined) {
      try {
        canvas.releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  /* =====================================================
     KEYBOARD SEGMENT
  ===================================================== */

  const drawKeyboardSegment = (from, to) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    configureContext(ctx);

    ctx.beginPath();

    ctx.moveTo(from.x, from.y);

    ctx.lineTo(to.x, to.y);

    ctx.stroke();

    ctx.closePath();
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleCanvasKeyDown = (e) => {
    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    /* ==========================
       ENTER / SPACE
    ========================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      if (!keyboardDrawing) {
        saveCanvasState();

        onKeyboardDrawingChange(id, true);
      } else {
        onKeyboardDrawingChange(id, false);
      }

      return;
    }

    /* ==========================
       ESCAPE
    ========================== */

    if (e.key === "Escape") {
      if (keyboardDrawing) {
        e.preventDefault();

        e.stopPropagation();

        onKeyboardDrawingChange(id, false);
      }

      return;
    }

    /* ==========================
       ARROWS
    ========================== */

    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    if (!arrowKeys.includes(e.key)) {
      return;
    }

    e.preventDefault();

    e.stopPropagation();

    const oldPosition = keyboardCursor;

    let newX = oldPosition.x;

    let newY = oldPosition.y;

    if (e.key === "ArrowLeft") {
      newX -= keyboardStep;
    }

    if (e.key === "ArrowRight") {
      newX += keyboardStep;
    }

    if (e.key === "ArrowUp") {
      newY -= keyboardStep;
    }

    if (e.key === "ArrowDown") {
      newY += keyboardStep;
    }

    newX = Math.max(0, Math.min(canvas.width, newX));

    newY = Math.max(0, Math.min(canvas.height, newY));

    const newPosition = {
      x: newX,
      y: newY,
    };

    if (keyboardDrawing) {
      drawKeyboardSegment(oldPosition, newPosition);
    }

    onKeyboardCursorChange(id, newPosition);
  };

  return (
    <div className="wb-u8-p4-canvas-wrapper">
      <canvas
        ref={(el) => {
          canvasRefs.current[id] = el;
        }}
        width={220}
        height={160}
        tabIndex={0}
        role="application"
        className="wb-unit8-p4-q1-canvas"
        aria-label={
          keyboardDrawing
            ? `${alt} Keyboard drawing is active using the ${tool}. Use arrow keys to draw. Press Enter or Space to stop drawing.`
            : `${alt} Use arrow keys to move the drawing cursor. Press Enter or Space to start drawing with the ${tool}.`
        }
        style={{
          backgroundImage: `url(${imgSrc})`,

          backgroundRepeat: "no-repeat",

          backgroundSize: "contain",

          backgroundPosition: "center",

          cursor:
            tool === "eraser"
              ? `url(${eraserCursor}) 12 12, auto`
              : `url(${pencilCursor}) 4 28, auto`,

          touchAction: "none",
        }}
        onFocus={() => {
          onCanvasFocus(id);

          onActivateCanvas(id);
        }}
        onBlur={() => {
          onCanvasBlur(id);

          onKeyboardDrawingChange(id, false);
        }}
        onKeyDown={handleCanvasKeyDown}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
      />

      {/* =================================================
          KEYBOARD CURSOR
      ================================================= */}

      {canvasFocused && (
        <span
          aria-hidden="true"
          className={`wb-u8-p4-keyboard-cursor ${
            keyboardDrawing ? "drawing-active" : ""
          }`}
          style={{
            left: `${(keyboardCursor.x / 220) * 100}%`,

            top: `${(keyboardCursor.y / 160) * 100}%`,

            background: tool === "eraser" ? "#ffffff" : penColor,
          }}
        />
      )}

      <div aria-live="polite" className="wb-u8-p4-sr-only">
        {keyboardDrawing
          ? `Keyboard drawing started with ${tool}. Use arrow keys to draw.`
          : "Keyboard drawing stopped."}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit8_Page4_Q1 = () => {
  /* =================================================
       ANSWERS
    ================================================= */

  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null))),
  );

  /*
      null | correct | wrong
    */

  const [questionResults, setQuestionResults] = useState(
    Array(questions.length).fill(null),
  );

  const [wrongInputs, setWrongInputs] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =================================================
       KEYBOARD DRAG
    ================================================= */

  const [selectedWordId, setSelectedWordId] = useState(null);

  const bankRefs = useRef({});

  const inputRefs = useRef({});

  /* =================================================
       DRAWING
    ================================================= */

  const [tool, setTool] = useState("pen");

  const [penColor, setPenColor] = useState("#ff0000");

  const canvasRefs = useRef({});

  const canvasHistoryRefs = useRef({});

  const [activeCanvasId, setActiveCanvasId] = useState(1);

  const [canvasFocusedId, setCanvasFocusedId] = useState(null);

  const [keyboardDrawingId, setKeyboardDrawingId] = useState(null);

  const [keyboardCursors, setKeyboardCursors] = useState(() => {
    const initial = {};

    questions.forEach((q) => {
      initial[q.id] = {
        x: 110,
        y: 80,
      };
    });

    return initial;
  });

  /* =================================================
       AUDIO
    ================================================= */

  const audioRef = useRef(null);

  const [playingAudioId, setPlayingAudioId] = useState(null);

  /* =================================================
       DND
    ================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  /* =================================================
       HELPERS
    ================================================= */

  const isQuestionCorrect = (qIndex) => questionResults[qIndex] === "correct";

  const isQuestionLocked = (qIndex) =>
    showAnswerMode || isQuestionCorrect(qIndex);

  const allCorrect = questionResults.every((result) => result === "correct");

  const usedIds = new Set(answers.flat().filter(Boolean));

  /* =================================================
       UNLOCKED INPUT IDS
    ================================================= */

  const getUnlockedInputIds = () => {
    const ids = [];

    questions.forEach((question, qIndex) => {
      if (isQuestionLocked(qIndex)) {
        return;
      }

      question.parts.forEach((part, pIndex) => {
        if (part.type === "input") {
          ids.push(`drop-${qIndex}-${pIndex}`);
        }
      });
    });

    return ids;
  };

  /* =================================================
       AUDIO
    ================================================= */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingAudioId(null);
  };

  const playAudio = (src, audioId = null) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingAudioId(audioId);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioId(null);
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =================================================
       DRAG START
       NO AUDIO
    ================================================= */

  const handleDragStart = ({ active }) => {
    setActiveId(String(active.id));
  };

  /* =================================================
       PLACE WORD
    ================================================= */

  const placeWord = (wordId, qIndex, pIndex) => {
    if (isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      copy.forEach((row, qi) => {
        if (isQuestionLocked(qi)) {
          return;
        }

        row.forEach((value, pi) => {
          if (value === wordId) {
            copy[qi][pi] = "";
          }
        });
      });

      copy[qIndex][pIndex] = wordId;

      return copy;
    });

    setWrongInputs((prev) => prev.filter((id) => !id.startsWith(`${qIndex}-`)));

    setQuestionResults((prev) => {
      const copy = [...prev];

      if (copy[qIndex] === "wrong") {
        copy[qIndex] = null;
      }

      return copy;
    });
  };

  /* =================================================
       DRAG END
    ================================================= */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over) return;

    const wordId = String(active.id);

    const destId = String(over.id);

    if (!destId.startsWith("drop-")) {
      return;
    }

    const [qIndex, pIndex] = destId.replace("drop-", "").split("-").map(Number);

    placeWord(wordId, qIndex, pIndex);
  };

  /* =================================================
       FIRST UNLOCKED INPUT
    ================================================= */

  const focusFirstUnlockedInput = () => {
    const ids = getUnlockedInputIds();

    if (!ids.length) return;

    requestAnimationFrame(() => {
      inputRefs.current[ids[0]]?.focus?.();
    });
  };

  /* =================================================
       KEYBOARD SELECT
    ================================================= */

  const handleKeyboardSelect = (wordId) => {
    if (selectedWordId === wordId) {
      setSelectedWordId(null);

      return;
    }

    setSelectedWordId(wordId);

    focusFirstUnlockedInput();
  };

  /* =================================================
       TAB CYCLE
    ================================================= */

  const cycleInputFocus = (currentId, reverse = false) => {
    const ids = getUnlockedInputIds();

    if (!ids.length) return;

    const currentIndex = ids.indexOf(currentId);

    let nextIndex;

    if (reverse) {
      nextIndex = currentIndex <= 0 ? ids.length - 1 : currentIndex - 1;
    } else {
      nextIndex =
        currentIndex === ids.length - 1 || currentIndex === -1
          ? 0
          : currentIndex + 1;
    }

    inputRefs.current[ids[nextIndex]]?.focus?.();
  };

  /* =================================================
       KEYBOARD DROP
    ================================================= */

  const handleKeyboardDrop = (qIndex, pIndex) => {
    if (!selectedWordId) {
      return;
    }

    const wordId = selectedWordId;

    /*
    نحسب answers كما ستكون بعد الـdrop
    حتى نعرف أول خيار غير مستخدم.
  */

    const nextAnswers = answers.map((row) => [...row]);

    /*
    شيل نفس الكلمة من أي input غير مقفل
  */
    nextAnswers.forEach((row, qi) => {
      if (isQuestionLocked(qi)) {
        return;
      }

      row.forEach((value, pi) => {
        if (value === wordId) {
          nextAnswers[qi][pi] = "";
        }
      });
    });

    /*
    حط الكلمة في الـinput المختار
  */
    nextAnswers[qIndex][pIndex] = wordId;

    /*
    نفذ الـplace الحقيقي
  */
    placeWord(wordId, qIndex, pIndex);

    /*
    خلص keyboard selection
  */
    setSelectedWordId(null);

    /*
    أول option غير مستخدم بعد الـdrop
  */
    const usedAfterDrop = new Set(nextAnswers.flat().filter(Boolean));

    const nextUnusedWord = WORD_BANK.find(
      (item) => !usedAfterDrop.has(item.id),
    );

    /*
    رجّع focus لأول خيار غير مستخدم
  */
    requestAnimationFrame(() => {
      if (nextUnusedWord) {
        bankRefs.current[nextUnusedWord.id]?.focus?.();
      }
    });
  };

  /* =================================================
       ESCAPE
    ================================================= */

  const cancelKeyboardSelection = () => {
    const wordId = selectedWordId;

    setSelectedWordId(null);

    requestAnimationFrame(() => {
      bankRefs.current[wordId]?.focus?.();
    });
  };

  /* =================================================
       REMOVE SLOT
    ================================================= */

  const handleClear = (qIndex, pIndex) => {
    if (isQuestionLocked(qIndex)) {
      return;
    }

    const oldWordId = answers[qIndex][pIndex];

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      copy[qIndex][pIndex] = "";

      return copy;
    });

    setWrongInputs((prev) => prev.filter((id) => !id.startsWith(`${qIndex}-`)));

    setQuestionResults((prev) => {
      const copy = [...prev];

      copy[qIndex] = null;

      return copy;
    });

    requestAnimationFrame(() => {
      bankRefs.current[oldWordId]?.focus?.();
    });
  };

  /* =================================================
       DRAWING HELPERS
    ================================================= */

  const handleCanvasFocus = (id) => {
    setCanvasFocusedId(id);
  };

  const handleCanvasBlur = (id) => {
    setCanvasFocusedId((current) => (current === id ? null : current));
  };

  const handleKeyboardDrawingChange = (id, value) => {
    if (value) {
      setKeyboardDrawingId(id);
    } else {
      setKeyboardDrawingId((current) => (current === id ? null : current));
    }
  };

  const handleKeyboardCursorChange = (id, position) => {
    setKeyboardCursors((prev) => ({
      ...prev,

      [id]: position,
    }));
  };

  /* =================================================
       UNDO ACTIVE CANVAS
    ================================================= */

  const undoCanvas = () => {
    const id = activeCanvasId;

    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const history = canvasHistoryRefs.current[id];

    if (!history || history.length === 0) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const lastState = history.pop();

    const image = new Image();

    image.onload = () => {
      ctx.globalCompositeOperation = "source-over";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    image.src = lastState;

    setKeyboardDrawingId(null);
  };

  /* =================================================
       CLEAR ACTIVE CANVAS
    ================================================= */

  const clearActiveCanvas = () => {
    const id = activeCanvasId;

    const canvas = canvasRefs.current[id];

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    /*
          نخزن قبل Clear
          عشان Undo يقدر يرجعه.
        */

    if (!canvasHistoryRefs.current[id]) {
      canvasHistoryRefs.current[id] = [];
    }

    canvasHistoryRefs.current[id].push(canvas.toDataURL());

    ctx.globalCompositeOperation = "source-over";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setKeyboardDrawingId(null);
  };

  /* =================================================
       CHECK ANSWERS
    ================================================= */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      if (isQuestionCorrect(qIndex)) {
        continue;
      }

      for (let pIndex = 0; pIndex < questions[qIndex].parts.length; pIndex++) {
        const part = questions[qIndex].parts[pIndex];

        if (part.type === "input" && !answers[qIndex][pIndex]) {
          ValidationAlert.info(
            "Oops!",
            `Please complete question ${qIndex + 1}.`,
          );

          return;
        }
      }
    }

    const nextResults = [...questionResults];

    const wrong = [];

    let score = 0;

    questions.forEach((question, qIndex) => {
      if (isQuestionCorrect(qIndex)) {
        nextResults[qIndex] = "correct";

        score++;

        return;
      }

      let questionCorrect = true;

      question.parts.forEach((part, pIndex) => {
        if (part.type !== "input") {
          return;
        }

        const wordId = answers[qIndex][pIndex];

        const text = WORD_BANK.find((item) => item.id === wordId)?.text || "";

        if (text !== part.answer) {
          questionCorrect = false;

          wrong.push(`${qIndex}-${pIndex}`);
        }
      });

      if (questionCorrect) {
        nextResults[qIndex] = "correct";

        score++;
      } else {
        nextResults[qIndex] = "wrong";
      }
    });

    setWrongInputs(wrong);

    setQuestionResults(nextResults);

    /*
        NO AUTO AUDIO.
      */

    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold">
            Score: ${score} / ${total}
          </span>
        </div>
      `;

    if (score === total) {
      ValidationAlert.success(msg);
    } else if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =================================================
       SHOW ANSWER
    ================================================= */

  const showAnswers = () => {
    const filled = questions.map((q) =>
      q.parts.map((part) => {
        if (part.type !== "input") {
          return null;
        }

        return WORD_BANK.find((item) => item.text === part.answer)?.id || "";
      }),
    );

    setAnswers(filled);

    setWrongInputs([]);

    setQuestionResults(Array(questions.length).fill("correct"));

    setShowAnswerMode(true);

    setSelectedWordId(null);
  };

  /* =================================================
       RESET EVERYTHING
    ================================================= */

  const reset = () => {
    stopAudio();

    questions.forEach((question) => {
      const canvas = canvasRefs.current[question.id];

      if (canvas) {
        const ctx = canvas.getContext("2d");

        ctx.globalCompositeOperation = "source-over";

        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      canvasHistoryRefs.current[question.id] = [];
    });

    setAnswers(
      questions.map((q) =>
        q.parts.map((p) => (p.type === "input" ? "" : null)),
      ),
    );

    setQuestionResults(Array(questions.length).fill(null));

    setWrongInputs([]);

    setShowAnswerMode(false);

    setSelectedWordId(null);

    setActiveId(null);

    setTool("pen");

    setPenColor("#ff0000");

    setActiveCanvasId(1);

    setCanvasFocusedId(null);

    setKeyboardDrawingId(null);

    const resetCursors = {};

    questions.forEach((q) => {
      resetCursors[q.id] = {
        x: 110,
        y: 80,
      };
    });

    setKeyboardCursors(resetCursors);
  };

  /* =================================================
       ACTIVE / SELECTED WORD
    ================================================= */

  const activeWord = WORD_BANK.find((item) => item.id === activeId);

  const selectedWord = WORD_BANK.find((item) => item.id === selectedWordId);

  /* =================================================
       RENDER
    ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="question-wrapper-unit3-page6-q1"
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
            marginBottom: "50px",

            gap: "30px",
          }}
        >
          <ExerciseHeader
            sectionLetter="G"
            title="Trace and write."
            subTitle="Trace each body part, then drag the matching sentence to the picture."
          />

          {/* =================================================
                WORD BANK
            ================================================= */}

          <WordBank
            usedIds={usedIds}
            selectedWordId={selectedWordId}
            onKeyboardSelect={handleKeyboardSelect}
            onPlayAudio={playAudio}
            playingAudioId={playingAudioId}
            bankRefs={bankRefs}
          />

          {/* =================================================
                DRAWING TOOLS
            ================================================= */}

          <div className="unit4-q2-p6-tools w-full">
            <button
              type="button"
              onClick={() => setTool("pen")}
              className={`unit4-q2-p6-tool-btn ${
                tool === "pen" ? "active-tool" : ""
              }`}
              aria-pressed={tool === "pen"}
            >
              ✏️ Pen
            </button>

            <button
              type="button"
              onClick={() => setTool("eraser")}
              className={`unit4-q2-p6-tool-btn ${
                tool === "eraser" ? "active-tool" : ""
              }`}
              aria-pressed={tool === "eraser"}
            >
              🧽 Eraser
            </button>

            <button
              type="button"
              onClick={undoCanvas}
              className="unit4-q2-p6-tool-btn"
            >
              ↶ Undo
            </button>

            <label className="unit4-q2-p6-tool-btn wb-u8-p4-color-label">
              🎨 Color
              <input
                type="color"
                value={penColor}
                onChange={(e) => {
                  setPenColor(e.target.value);

                  setTool("pen");
                }}
                aria-label="Choose pen color"
                className="wb-u8-p4-color-input"
              />
            </label>

            <button
              type="button"
              onClick={clearActiveCanvas}
              className="unit4-q2-p6-tool-btn"
            >
              🗑️ Clear
            </button>
          </div>

          {/* =================================================
                QUESTIONS
            ================================================= */}

          <div className="content-container-wb-unit8-p4-q1 w-full">
            {questions.map((question, qIndex) => {
              const locked = isQuestionLocked(qIndex);

              const correct = isQuestionCorrect(qIndex) || showAnswerMode;

              const fullAudioId = `full-${question.id}`;

              return (
                <div key={question.id} className="row2-wb-unit8-p4-q1">
                  {/* =========================================
                          CANVAS
                      ========================================= */}

                  <div className="wb-u8-p4-image-row">
                    <span className="num-span">{qIndex + 1}</span>

                    <DrawingCanvas
                      imgSrc={question.img}
                      alt={question.alt}
                      id={question.id}
                      canvasRefs={canvasRefs}
                      canvasHistoryRefs={canvasHistoryRefs}
                      tool={tool}
                      penColor={penColor}
                      keyboardCursor={keyboardCursors[question.id]}
                      keyboardDrawing={keyboardDrawingId === question.id}
                      canvasFocused={canvasFocusedId === question.id}
                      onCanvasFocus={handleCanvasFocus}
                      onCanvasBlur={handleCanvasBlur}
                      onKeyboardCursorChange={handleKeyboardCursorChange}
                      onKeyboardDrawingChange={handleKeyboardDrawingChange}
                      onActivateCanvas={setActiveCanvasId}
                    />
                  </div>

                  {/* =========================================
                          SENTENCE
                      ========================================= */}

                  <div
                    className={`sentence-wrapper-wb-unit8-p4-q1 ${
                      correct ? "completed-sentence-wb-u8-p4-q1" : ""
                    }`}
                    role={correct ? "button" : undefined}
                    tabIndex={correct ? 0 : undefined}
                    aria-label={
                      correct
                        ? `${question.fullSentence} Press Enter or Space to hear the complete sentence.`
                        : undefined
                    }
                    onClick={() => {
                      if (correct) {
                        playAudio(question.fullAudio, fullAudioId);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (!correct) {
                        return;
                      }

                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        playAudio(question.fullAudio, fullAudioId);
                      }
                    }}
                  >
                    {question.parts.map((part, pIndex) => {
                      /* =========================
                               TEXT
                            ========================= */

                      if (part.type === "text") {
                        if (!part.audio) {
                          return (
                            <span key={pIndex} className="sentence-text">
                              {part.value}
                            </span>
                          );
                        }

                        const fixedAudioId = `fixed-${question.id}-${pIndex}`;

                        /*
                                قبل الصح:
                                This له صوته الخاص.

                                بعد الصح:
                                نخليه جزء من الديف الكامل
                                وما يوقف propagation.
                              */

                        return (
                          <span
                            key={pIndex}
                            role={correct ? undefined : "button"}
                            tabIndex={correct ? -1 : 0}
                            className="sentence-text fixed-audio-wb-u8-p4-q1"
                            aria-label={
                              correct
                                ? undefined
                                : `${part.value}. Press Enter or Space to hear it.`
                            }
                            onClick={(e) => {
                              if (correct) {
                                return;
                              }

                              e.stopPropagation();

                              playAudio(part.audio, fixedAudioId);
                            }}
                            onKeyDown={(e) => {
                              if (correct) {
                                return;
                              }

                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                e.stopPropagation();

                                playAudio(part.audio, fixedAudioId);
                              }
                            }}
                          >
                            {part.value}

                            {!correct && playingAudioId === fixedAudioId && (
                              <FaVolumeUp
                                className="small-audio-icon-wb-u8-p4-q1"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        );
                      }

                      /* =========================
                               INPUT
                            ========================= */

                      const cellId = `drop-${qIndex}-${pIndex}`;

                      const placedId = answers[qIndex][pIndex];

                      const displayText =
                        WORD_BANK.find((item) => item.id === placedId)?.text ||
                        "";

                      return (
                        <span
                          key={pIndex}
                          className="drop-wrapper-wb-u8-p4-q1"
                          onClick={(e) => {
                            /*
                                    قبل الصح:
                                    input يتصرف لحاله.

                                    بعد الصح:
                                    نخلي click يطلع
                                    للsentence wrapper
                                    ويشغل full audio.
                                  */

                            if (!correct) {
                              e.stopPropagation();
                            }
                          }}
                        >
                          <DroppableCell
                            id={cellId}
                            displayText={displayText}
                            previewText={selectedWord?.text || ""}
                            isWrong={wrongInputs.includes(
                              `${qIndex}-${pIndex}`,
                            )}
                            locked={locked}
                            selectedWordId={selectedWordId}
                            onRemove={() => handleClear(qIndex, pIndex)}
                            onKeyboardDrop={() =>
                              handleKeyboardDrop(qIndex, pIndex)
                            }
                            onCancelKeyboard={cancelKeyboardSelection}
                            onCycleInputFocus={cycleInputFocus}
                            inputRefs={inputRefs}
                          />
                        </span>
                      );
                    })}

                    {correct && playingAudioId === fullAudioId && (
                      <FaVolumeUp
                        className="full-audio-icon-wb-u8-p4-q1"
                        aria-hidden="true"
                      />
                    )}
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
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={showAnswers}
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
          <span className="drag-overlay-wb-u8-p4-q1">{activeWord.text}</span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page4_Q1;
