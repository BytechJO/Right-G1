import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit3_Page1_Q1.css";

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

import sound2 from "../../../assets/U1 WB/U3/page_15/Item_002_two.mp3";
import sound4 from "../../../assets/U1 WB/U3/page_15/Item_001_four.mp3";
import sound6 from "../../../assets/U1 WB/U3/page_15/Item_003_six.mp3";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

const numberSounds = {
  2: sound2,
  4: sound4,
  6: sound6,
};

/* =====================================================
   DATA
===================================================== */

const numbers = ["2", "4", "6"];

const colors = ["red", "blue", "green", "orange", "purple", "yellow"];

const correctMatches = [
  { word: "six", image: "img1" },
  { word: "two", image: "img3" },
  { word: "four", image: "img2" },
];

const correctNumbers = {
  img1: "6",
  img2: "4",
  img3: "2",
};

const imgShapes = [
  {
    key: "img1",
    label: 1,
    count: 6,
    accessibleText: "Six squares",

    shape: (color, onActivate) => (
      <svg width="80" height="80" role="img" aria-label="Square">
        <rect
          x="10"
          y="10"
          width="60"
          height="60"
          fill={color}
          stroke="black"
          strokeWidth="2"
          onDoubleClick={onActivate}
          onTouchEnd={onActivate}
          style={{ cursor: "pointer" }}
        />
      </svg>
    ),

    containerClass: "square-container-wb-unit3-p1-q1",
  },

  {
    key: "img2",
    label: 2,
    count: 4,
    accessibleText: "Four triangles",

    shape: (color, onActivate) => (
      <svg width="80" height="80" role="img" aria-label="Triangle">
        <polygon
          points="30,7 60,60 7,60"
          fill={color}
          stroke="black"
          strokeWidth="2"
          onDoubleClick={onActivate}
          onTouchEnd={onActivate}
          style={{ cursor: "pointer" }}
        />
      </svg>
    ),

    containerClass: "polygon-container-wb-unit3-p1-q1",
  },

  {
    key: "img3",
    label: 3,
    count: 2,
    accessibleText: "Two circles",

    shape: (color, onActivate) => (
      <svg width="80" height="80" role="img" aria-label="Circle">
        <circle
          cx="40"
          cy="40"
          r="30"
          fill={color}
          stroke="black"
          strokeWidth="2"
          onDoubleClick={onActivate}
          onTouchEnd={onActivate}
          style={{ cursor: "pointer" }}
        />
      </svg>
    ),

    containerClass: "polygon-container-wb-unit3-p1-q1",
  },
];

const wordItems = [
  {
    word: "four",
    dotId: "bored-dot",
  },
  {
    word: "two",
    dotId: "cold-dot",
  },
  {
    word: "six",
    dotId: "scared-dot",
  },
];

/* =====================================================
   NUMBER BANK
===================================================== */

function BankNumber({
  id,
  num,
  isUsed,
  disabled,
  isKeyboardPicked,
  onKeyboardPick,
  registerRef,
  audio,
  isPlaying,
  onPlayAudio,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);
        registerRef(num, el);
      }}
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
        isUsed
          ? `Number ${num}, already used`
          : isKeyboardPicked
            ? `Number ${num} selected. Choose a number box and press Enter.`
            : `Number ${num}. Press Enter or Space to select it.`
      }
      className="number-bank-item-wb-u3-p1-q1"
      onKeyDown={(e) => {
        if (unavailable) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onPlayAudio(`number-${num}`, audio);

          onKeyboardPick(num);
        }
      }}
      onClick={() => {
        if (unavailable) return;

        // Mouse = صوت فقط
        onPlayAudio(`number-${num}`, audio);
      }}
      style={{
        position: "relative",

        padding: "7px 14px",

        border: `2px solid ${isUsed ? "#ccc" : "#2c5287"}`,

        borderRadius: "8px",

        background: isKeyboardPicked ? "#dbeafe" : "white",

        fontWeight: "bold",
        fontSize: "20px",

        cursor: unavailable ? "default" : "grab",

        opacity: isDragging ? 0.4 : isUsed ? 0.5 : 1,

        userSelect: "none",
        touchAction: "none",

        color: isUsed ? "#aaa" : "inherit",

        transition: "transform .2s ease, outline .2s ease, background .2s ease",

        outline: isKeyboardPicked ? "3px solid #2563eb" : "none",

        outlineOffset: "4px",

        transform: isKeyboardPicked ? "scale(1.08)" : "scale(1)",
      }}
    >
      {num}

      {isPlaying && (
        <FaVolumeUp
          aria-hidden="true"
          style={{
            position: "absolute",

            top: "-10px",
            right: "-10px",

            fontSize: "16px",

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
}

/* =====================================================
   NUMBER DROP INPUT
===================================================== */

function DroppableInput({
  id,
  value,
  isWrong,
  showAnswer,
  locked,

  keyboardPickedNumber,
  onKeyboardDrop,
  onClear,

  inputIndex,

  focusedNumberInput,
  setFocusedNumberInput,

  registerRef,

  availableIndexes,
  onMoveFocus,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: locked || showAnswer,
  });

  const canKeyboardDrop = keyboardPickedNumber && !locked && !showAnswer;

  const isFocused = focusedNumberInput === inputIndex;

  const moveFocus = (backwards = false) => {
    if (!availableIndexes.length) return;

    const current = availableIndexes.indexOf(inputIndex);

    let next;

    if (backwards) {
      next = current <= 0 ? availableIndexes.length - 1 : current - 1;
    } else {
      next =
        current === -1 || current === availableIndexes.length - 1
          ? 0
          : current + 1;
    }

    onMoveFocus(availableIndexes[next]);
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <input
        ref={(el) => {
          setNodeRef(el);

          registerRef(inputIndex, el);
        }}
        className={`unscramble-input-wb-unit3-p1-q1 ${
          isOver ? "drag-over-cell" : ""
        }`}
        value={canKeyboardDrop && isFocused ? keyboardPickedNumber : value}
        readOnly
        role="button"
        tabIndex={
          locked || showAnswer ? -1 : keyboardPickedNumber ? 0 : value ? 0 : -1
        }
        aria-disabled={locked || showAnswer}
        aria-label={
          locked
            ? `Number box ${inputIndex + 1}. Correct number ${value}. Locked.`
            : keyboardPickedNumber
              ? `Number box ${
                  inputIndex + 1
                }. Press Enter to place ${keyboardPickedNumber}.`
              : value
                ? `Number box ${
                    inputIndex + 1
                  }. Current number ${value}. Press Enter to remove it.`
                : `Empty number box ${inputIndex + 1}. Select a number first.`
        }
        onFocus={() => {
          if (!locked) {
            setFocusedNumberInput(inputIndex);
          }
        }}
        onBlur={() => {
          setFocusedNumberInput(null);
        }}
        onKeyDown={(e) => {
          if (locked || showAnswer) {
            return;
          }

          if (keyboardPickedNumber && e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();

            moveFocus(e.shiftKey);

            return;
          }

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            if (keyboardPickedNumber) {
              onKeyboardDrop();
            } else if (value) {
              onClear(id);
            }
          }
        }}
        onClick={() => {
          if (value && !locked && !showAnswer && !keyboardPickedNumber) {
            onClear(id);
          }
        }}
        style={{
          background: locked
            ? undefined
            : isOver
              ? "#e3f2fd"
              : canKeyboardDrop && isFocused
                ? "#dbeafe"
                : "white",

          cursor: value && !locked && !showAnswer ? "pointer" : "default",

          outline:
            !locked && canKeyboardDrop && isFocused
              ? "3px solid #2563eb"
              : "none",

          outlineOffset: "3px",
        }}
      />

      {!showAnswer && isWrong && !locked && (
        <span className="error-mark-img-unit7-p6-q2">✕</span>
      )}
    </div>
  );
}

/* =====================================================
   MAIN
===================================================== */

const WB_Unit3_Page1_Q1 = () => {
  /* =====================================================
     REFS
  ===================================================== */
  const linesSvgRef = useRef(null);
  const containerRef = useRef(null);

  const numberBankRefs = useRef({});

  const numberInputRefs = useRef([]);

  const imageDotRefs = useRef({});

  const wordDotRefs = useRef({});

  const colorButtonRefs = useRef([]);

  const shapeGroupRefs = useRef({});

  const audioRef = useRef(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const [playingItem, setPlayingItem] = useState(null);

  const playItemAudio = (id, src) => {
    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingItem(id);

    audio.play().catch(() => {
      setPlayingItem(null);
    });

    audio.onended = () => {
      setPlayingItem(null);
    };

    audio.onerror = () => {
      setPlayingItem(null);
    };
  };

  /* =====================================================
     STATES
  ===================================================== */

  const [lines, setLines] = useState([]);

  /* Mouse selected start point */
  const [firstDot, setFirstDot] = useState(null);

  /*
    Keyboard preview ONLY
    مافي Preview للماوس
  */
  const [keyboardPreviewLine, setKeyboardPreviewLine] = useState(null);

  const [keyboardPreviewWord, setKeyboardPreviewWord] = useState(null);

  const [wrongImages, setWrongImages] = useState([]);

  const [wrongNumbers, setWrongNumbers] = useState([]);

  const [lockedNumbers, setLockedNumbers] = useState([]);

  const [lockedMatches, setLockedMatches] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [numAnswers, setNumAnswers] = useState({
    img1: "",
    img2: "",
    img3: "",
  });

  const [wordColors, setWordColors] = useState([
    "transparent",
    "transparent",
    "transparent",
  ]);

  const [selectedWordIndex, setSelectedWordIndex] = useState(null);

  const [activeNum, setActiveNum] = useState(null);

  /* =====================================================
     KEYBOARD ACCESSIBILITY
  ===================================================== */

  const [keyboardPickedNumber, setKeyboardPickedNumber] = useState(null);

  const [focusedNumberInput, setFocusedNumberInput] = useState(null);

  const [keyboardSelectedImage, setKeyboardSelectedImage] = useState(null);

  const [keyboardMessage, setKeyboardMessage] = useState("");

  /* =====================================================
     HELPERS
  ===================================================== */

  const usedNums = Object.values(numAnswers).filter(Boolean);

  const isNumberLocked = (imageKey) => lockedNumbers.includes(imageKey);

  const isImageMatchLocked = (image) =>
    lockedMatches.some((match) => match.image === image);

  const isWordMatchLocked = (word) =>
    lockedMatches.some((match) => match.word === word);

  const imageKeys = ["img1", "img2", "img3"];

  const availableNumberIndexes = imageKeys
    .map((_, index) => index)
    .filter((index) => !lockedNumbers.includes(imageKeys[index]));

  /* =====================================================
     DND
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
     NUMBER KEYBOARD PICK
  ===================================================== */

  const handleKeyboardNumberPick = (num) => {
    if (showAnswer || checkCompleted || usedNums.includes(num)) {
      return;
    }

    setKeyboardPickedNumber(num);

    setKeyboardMessage(
      `Number ${num} selected. Choose a number box and press Enter.`,
    );

    const firstAvailable = availableNumberIndexes[0];

    if (firstAvailable !== undefined) {
      setFocusedNumberInput(firstAvailable);

      requestAnimationFrame(() => {
        numberInputRefs.current[firstAvailable]?.focus();
      });
    }
  };

  /* =====================================================
     NUMBER KEYBOARD DROP
  ===================================================== */

  const handleKeyboardNumberDrop = (imageKey) => {
    if (!keyboardPickedNumber || isNumberLocked(imageKey) || showAnswer) {
      return;
    }

    const picked = keyboardPickedNumber;

    let nextAnswers = null;

    setNumAnswers((prev) => {
      const updated = {
        ...prev,
      };

      Object.keys(updated).forEach((key) => {
        if (updated[key] === picked && !isNumberLocked(key)) {
          updated[key] = "";
        }
      });

      updated[imageKey] = picked;

      nextAnswers = updated;

      return updated;
    });

    setWrongNumbers((prev) => prev.filter((key) => key !== imageKey));

    setKeyboardPickedNumber(null);

    setFocusedNumberInput(null);

    setKeyboardMessage(`Number ${picked} placed.`);

    requestAnimationFrame(() => {
      if (!nextAnswers) return;

      const usedAfter = Object.values(nextAnswers).filter(Boolean);

      const nextAvailable = numbers.find((num) => !usedAfter.includes(num));

      if (nextAvailable) {
        numberBankRefs.current[nextAvailable]?.focus();
      }
    });
  };

  /* =====================================================
     NUMBER DRAG
  ===================================================== */

  const handleDragStart = (event) => {
    setActiveNum(event.active.id.replace("num-", ""));
  };

  const handleDragEnd = (event) => {
    setActiveNum(null);

    const { active, over } = event;

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("num-")) {
      return;
    }

    const value = active.id.replace("num-", "");

    const imgKey = String(over.id).replace("num-", "");

    if (isNumberLocked(imgKey)) {
      return;
    }

    setNumAnswers((prev) => {
      const updated = {
        ...prev,
      };

      Object.keys(updated).forEach((key) => {
        if (updated[key] === value && !isNumberLocked(key)) {
          updated[key] = "";
        }
      });

      updated[imgKey] = value;

      return updated;
    });

    setWrongNumbers((prev) => prev.filter((key) => key !== imgKey));
  };

  const handleClear = (cellId) => {
    const imgKey = cellId.replace("num-", "");

    if (isNumberLocked(imgKey)) {
      return;
    }

    setNumAnswers((prev) => ({
      ...prev,
      [imgKey]: "",
    }));

    setWrongNumbers((prev) => prev.filter((key) => key !== imgKey));
  };

  /* =====================================================
     DOT POSITION
  ===================================================== */

  const getDotPosition = (el) => {
    const svg = linesSvgRef.current;

    if (!el || !svg) {
      return {
        x: 0,
        y: 0,
      };
    }

    const dotRect = el.getBoundingClientRect();

    // مركز الدائرة الحقيقي على الشاشة
    const centerX = dotRect.left + dotRect.width / 2;

    const centerY = dotRect.top + dotRect.height / 2;

    // نحول Screen coordinates
    // إلى SVG coordinates
    const point = svg.createSVGPoint();

    point.x = centerX;
    point.y = centerY;

    const ctm = svg.getScreenCTM();

    if (!ctm) {
      return {
        x: 0,
        y: 0,
      };
    }

    const svgPoint = point.matrixTransform(ctm.inverse());

    return {
      x: svgPoint.x,
      y: svgPoint.y,
    };
  };
  /* =====================================================
     UPDATE KEYBOARD PREVIEW
  ===================================================== */

  const updateKeyboardPreview = (image, word) => {
    const startEl = imageDotRefs.current[image];

    const endEl = wordDotRefs.current[word];

    if (!startEl || !endEl) {
      return;
    }

    const start = getDotPosition(startEl);

    const end = getDotPosition(endEl);

    setKeyboardPreviewWord(word);

    setKeyboardPreviewLine({
      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,
    });
  };

  /* =====================================================
     CONNECT PAIR
  ===================================================== */

  const connectPair = (image, word) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (isImageMatchLocked(image) || isWordMatchLocked(word)) {
      return;
    }

    const imageEl = imageDotRefs.current[image];

    const wordEl = wordDotRefs.current[word];

    if (!imageEl || !wordEl) {
      return;
    }

    const start = getDotPosition(imageEl);

    const end = getDotPosition(wordEl);

    setLines((prev) => {
      /*
        One-to-one:
        remove old line with
        same image OR same word
      */
      const filtered = prev.filter(
        (line) => line.image !== image && line.word !== word,
      );

      return [
        ...filtered,

        {
          image,
          word,

          x1: start.x,
          y1: start.y,

          x2: end.x,
          y2: end.y,
        },
      ];
    });

    setWrongImages((prev) => prev.filter((img) => img !== image));

    /* Mouse */
    setFirstDot(null);

    /* Keyboard */
    setKeyboardSelectedImage(null);

    setKeyboardPreviewLine(null);

    setKeyboardPreviewWord(null);

    setKeyboardMessage(`${image} connected to ${word}.`);
  };

  /* =====================================================
     MOUSE MATCH

     مافي أي Preview line هون
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const image = e.currentTarget.dataset.image;

    if (isImageMatchLocked(image)) {
      return;
    }

    /*
      نفس النقطة مرة ثانية
      = Cancel
    */
    if (firstDot?.image === image) {
      setFirstDot(null);
      return;
    }

    /*
      Mouse فقط:
      نخزن الصورة المختارة
      بدون preview
    */
    setFirstDot({
      image,
    });
  };

  const handleEndDotClick = (e) => {
    if (showAnswer || checkCompleted || !firstDot) {
      return;
    }

    const word = e.currentTarget.dataset.word;

    if (isWordMatchLocked(word)) {
      return;
    }

    connectPair(firstDot.image, word);
  };

  /* =====================================================
     KEYBOARD MATCH START

     من هون فقط يبدأ الـ Preview
  ===================================================== */

  const selectImageForKeyboard = (image) => {
    if (showAnswer || checkCompleted || isImageMatchLocked(image)) {
      return;
    }

    /*
      لو كان في Mouse selection
      ألغيه
    */
    setFirstDot(null);

    setKeyboardSelectedImage(image);

    setKeyboardMessage("Picture selected. Choose a word and press Enter.");

    const availableWord = wordItems.find(
      (item) => !isWordMatchLocked(item.word),
    );

    if (!availableWord) {
      return;
    }

    /*
      Preview لأول كلمة
    */
    requestAnimationFrame(() => {
      updateKeyboardPreview(image, availableWord.word);

      wordDotRefs.current[availableWord.word]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD WORD
  ===================================================== */

  const handleWordKeyboard = (e, word) => {
    if (!keyboardSelectedImage || isWordMatchLocked(word)) {
      return;
    }

    const availableWords = wordItems
      .filter((item) => !isWordMatchLocked(item.word))
      .map((item) => item.word);

    /* TAB */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const current = availableWords.indexOf(word);

      let next;

      if (e.shiftKey) {
        next = current <= 0 ? availableWords.length - 1 : current - 1;
      } else {
        next =
          current === -1 || current === availableWords.length - 1
            ? 0
            : current + 1;
      }

      const nextWord = availableWords[next];

      /*
        حرك الـ Preview
        للنقطة الجديدة
      */
      updateKeyboardPreview(keyboardSelectedImage, nextWord);

      wordDotRefs.current[nextWord]?.focus();

      return;
    }

    /* ENTER / SPACE */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      connectPair(keyboardSelectedImage, word);

      return;
    }

    /* ESCAPE */

    if (e.key === "Escape") {
      e.preventDefault();

      const image = keyboardSelectedImage;

      setKeyboardSelectedImage(null);

      setKeyboardPreviewLine(null);

      setKeyboardPreviewWord(null);

      setKeyboardMessage("Matching cancelled.");

      requestAnimationFrame(() => {
        imageDotRefs.current[image]?.focus();
      });
    }
  };

  /* =====================================================
     WORD FOCUS

     لو الـfocus وصل للكلمة لأي سبب
     نحدث الـpreview
  ===================================================== */

  const handleWordFocus = (word) => {
    if (!keyboardSelectedImage || isWordMatchLocked(word)) {
      return;
    }

    updateKeyboardPreview(keyboardSelectedImage, word);
  };

  /* =====================================================
     COLOR
  ===================================================== */

  const openColorPalette = (index) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    colorButtonRefs.current = [];

    setSelectedWordIndex(index);

    setKeyboardMessage("Color palette opened. Choose a color.");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        colorButtonRefs.current[0]?.focus();
      });
    });
  };

  const closeColorPalette = (index) => {
    setSelectedWordIndex(null);

    setKeyboardMessage("Color palette closed.");

    requestAnimationFrame(() => {
      shapeGroupRefs.current[index]?.focus();
    });
  };

  const applyColor = (color, index) => {
    const updated = [...wordColors];

    updated[index] = color;

    setWordColors(updated);

    setSelectedWordIndex(null);

    setKeyboardMessage(`${color} color selected.`);

    requestAnimationFrame(() => {
      shapeGroupRefs.current[index]?.focus();
    });
  };

  const removeColor = (index) => {
    const updated = [...wordColors];

    updated[index] = "transparent";

    setWordColors(updated);

    setSelectedWordIndex(null);

    setKeyboardMessage("Color removed.");

    requestAnimationFrame(() => {
      shapeGroupRefs.current[index]?.focus();
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers2 = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );

      return;
    }

    if (Object.values(numAnswers).some((value) => value.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please write all the numbers before checking.",
      );

      return;
    }

    let correctNums = 0;
    let correctLines = 0;

    const wrongNums = [];
    const wrongImgs = [];

    const newLockedNumbers = [];

    const newLockedMatches = [];

    /* NUMBERS */

    Object.keys(correctNumbers).forEach((img) => {
      if (numAnswers[img] === correctNumbers[img]) {
        correctNums++;

        newLockedNumbers.push(img);
      } else {
        wrongNums.push(img);
      }
    });

    /* MATCHES */

    lines.forEach((line) => {
      const correct = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (correct) {
        correctLines++;

        newLockedMatches.push({
          image: line.image,
          word: line.word,
        });
      } else {
        wrongImgs.push(line.image);
      }
    });

    /* LOCK CORRECT NUMBERS */

    setLockedNumbers((prev) => [...new Set([...prev, ...newLockedNumbers])]);

    /* LOCK CORRECT MATCHES */

    setLockedMatches((prev) => {
      const combined = [...prev, ...newLockedMatches];

      return combined.filter(
        (item, index, arr) =>
          arr.findIndex(
            (x) => x.image === item.image && x.word === item.word,
          ) === index,
      );
    });

    setWrongNumbers(wrongNums);

    setWrongImages(wrongImgs);

    setKeyboardPickedNumber(null);

    setFocusedNumberInput(null);

    setKeyboardSelectedImage(null);

    setKeyboardPreviewLine(null);

    setKeyboardPreviewWord(null);

    setFirstDot(null);

    const total = correctMatches.length * 2;

    const score = correctNums + correctLines;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setCheckCompleted(true);

      setLockedNumbers(["img1", "img2", "img3"]);

      setLockedMatches(correctMatches);

      setWrongImages([]);
      setWrongNumbers([]);

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

  const handleShowAnswer = () => {
    const finalLines = correctMatches.map((match) => {
      const start = getDotPosition(imageDotRefs.current[match.image]);

      const end = getDotPosition(wordDotRefs.current[match.word]);

      return {
        ...match,

        x1: start.x,
        y1: start.y,

        x2: end.x,
        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongImages([]);
    setWrongNumbers([]);

    setShowAnswer(true);
    setCheckCompleted(true);

    setNumAnswers(correctNumbers);

    setLockedNumbers(["img1", "img2", "img3"]);

    setLockedMatches(correctMatches);

    setWordColors(["red", "red", "red"]);

    setKeyboardPickedNumber(null);
    setKeyboardSelectedImage(null);

    setKeyboardPreviewLine(null);
    setKeyboardPreviewWord(null);

    setFirstDot(null);
    setSelectedWordIndex(null);

    setKeyboardMessage("Correct answers are displayed.");
  };
  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    setPlayingItem(null);

    setLines([]);

    setWrongImages([]);
    setWrongNumbers([]);

    setShowAnswer(false);
    setCheckCompleted(false);

    setFirstDot(null);

    setKeyboardPreviewLine(null);

    setKeyboardPreviewWord(null);

    setLockedNumbers([]);
    setLockedMatches([]);

    setKeyboardPickedNumber(null);

    setFocusedNumberInput(null);

    setKeyboardSelectedImage(null);

    setKeyboardMessage("");

    setSelectedWordIndex(null);

    setNumAnswers({
      img1: "",
      img2: "",
      img3: "",
    });

    setWordColors(["transparent", "transparent", "transparent"]);

    colorButtonRefs.current = [];
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
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

          position: "relative",
        }}
      >
        {/* SCREEN READER */}

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only-wb-u3-p1-q1"
        >
          {keyboardMessage}
        </div>

        <div
          className="div-forall"
          style={{
            gap: "0px",
          }}
        >
          {/* HEADER */}

          <div className="w-full flex flex-col gap-2">
            <ExerciseHeader
              sectionLetter="A"
              title="Count, write, and match. Color."
              subTitle="Count the shapes, drag the number word, then color the group."
            />

            <span
              style={{
                fontSize: "14px",
                color: "gray",
              }}
            >
              Select a group to color it.
            </span>
          </div>

          {/* =================================================
              NUMBER BANK
          ================================================= */}

          <div className="number-bank-wb-u3-p1-q1">
            {numbers.map((num) => (
              <BankNumber
                key={num}
                id={`num-${num}`}
                num={num}
                audio={numberSounds[num]}
                isUsed={usedNums.includes(num)}
                disabled={showAnswer || checkCompleted}
                isKeyboardPicked={keyboardPickedNumber === num}
                isPlaying={playingItem === `number-${num}`}
                onPlayAudio={playItemAudio}
                onKeyboardPick={handleKeyboardNumberPick}
                registerRef={(value, el) => {
                  numberBankRefs.current[value] = el;
                }}
              />
            ))}
          </div>

          {/* =================================================
              MATCH AREA
          ================================================= */}

          <div
            className="match-wrapper2-wb-unit3-p1-q1"
            ref={containerRef}
            style={{
              margin: "0px",
            }}
          >
            {/* =================================================
                IMAGE GROUPS
            ================================================= */}

            <div className="match-images-row2-wb-unit3-p1-q1">
              {imgShapes.map((item, idx) => {
                const matchLocked = isImageMatchLocked(item.key);

                const numberLocked = isNumberLocked(item.key);

                /*
                    Mouse selected
                    أو Keyboard selected
                  */
                const selectedForMatch =
                  firstDot?.image === item.key ||
                  keyboardSelectedImage === item.key;

                return (
                  <div
                    key={item.key}
                    className={`img-box2-wb-unit3-p1-q1 ${
                      matchLocked || showAnswer ? "disabled-hover" : ""
                    }`}
                  >
                    <div
                      style={
                        idx === 2
                          ? {
                              display: "flex",

                              flexDirection: "column",

                              justifyContent: "space-between",

                              height: "90%",
                            }
                          : {}
                      }
                    >
                      <span
                        style={{
                          color: "darkblue",

                          fontWeight: "700",
                        }}
                      >
                        {item.label}
                      </span>

                      {/* SHAPES */}

                      <div
                        ref={(el) => {
                          shapeGroupRefs.current[idx] = el;
                        }}
                        className={`${item.containerClass} shape-color-trigger-wb-u3-p1-q1 ${
                          showAnswer || checkCompleted ? "disabled-hover" : ""
                        }`}
                        role="button"
                        tabIndex={showAnswer || checkCompleted ? -1 : 0}
                        aria-haspopup="true"
                        aria-expanded={selectedWordIndex === idx}
                        aria-label={`${item.accessibleText}. Press Enter or Space to choose a color.`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();

                            openColorPalette(idx);

                            return;
                          }

                          if (e.key === "Escape" && selectedWordIndex === idx) {
                            e.preventDefault();

                            closeColorPalette(idx);
                          }
                        }}
                        onClick={() => openColorPalette(idx)}
                      >
                        {Array(item.count)
                          .fill(null)
                          .map((_, i) => (
                            <React.Fragment key={i}>
                              {item.shape(wordColors[idx], () =>
                                openColorPalette(idx),
                              )}
                            </React.Fragment>
                          ))}
                      </div>

                      {/* COLOR PALETTE */}

                      {selectedWordIndex === idx && (
                        <div
                          className="color-palette-wb-u1-p7-q1 accessible-color-palette-wb-u3-p1-q1"
                          role="group"
                          aria-label={`Choose a color for ${item.accessibleText}`}
                        >
                          {colors.map((color, colorIndex) => (
                            <button
                              ref={(el) => {
                                colorButtonRefs.current[colorIndex] = el;
                              }}
                              type="button"
                              key={color}
                              className="color-circle accessible-color-btn-wb-u3-p1-q1"
                              aria-label={`Color ${color}`}
                              style={{
                                backgroundColor: color,
                              }}
                              onClick={() => applyColor(color, idx)}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  closeColorPalette(idx);
                                }
                              }}
                            />
                          ))}

                          <button
                            ref={(el) => {
                              colorButtonRefs.current[colors.length] = el;
                            }}
                            type="button"
                            className="color-circle erase accessible-color-btn-wb-u3-p1-q1"
                            aria-label="Remove color"
                            onClick={() => removeColor(idx)}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                e.preventDefault();
                                e.stopPropagation();

                                closeColorPalette(idx);
                              }
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* WRONG MATCH */}

                      {wrongImages.includes(item.key) && !matchLocked && (
                        <span className="error-mark-img-unit7-p6-q2">✕</span>
                      )}

                      {/* NUMBER DROP */}

                      <DroppableInput
                        id={`num-${item.key}`}
                        value={numAnswers[item.key]}
                        isWrong={wrongNumbers.includes(item.key)}
                        showAnswer={showAnswer}
                        locked={numberLocked}
                        keyboardPickedNumber={keyboardPickedNumber}
                        onKeyboardDrop={() =>
                          handleKeyboardNumberDrop(item.key)
                        }
                        onClear={handleClear}
                        inputIndex={idx}
                        focusedNumberInput={focusedNumberInput}
                        setFocusedNumberInput={setFocusedNumberInput}
                        registerRef={(i, el) => {
                          numberInputRefs.current[i] = el;
                        }}
                        availableIndexes={availableNumberIndexes}
                        onMoveFocus={(i) => {
                          setFocusedNumberInput(i);

                          numberInputRefs.current[i]?.focus();
                        }}
                      />
                    </div>

                    {/* =================================================
                          START MATCH DOT
                      ================================================= */}

                    <div
                      ref={(el) => {
                        imageDotRefs.current[item.key] = el;
                      }}
                      className={`dot22-unit7-p6-q2 start-dot22-wb-unit3-p1-q1 ${
                        selectedForMatch ? "active-start-dot-wb-u3-p1-q1" : ""
                      }`}
                      data-image={item.key}
                      id={`${item.key}-dot`}
                      role="button"
                      tabIndex={
                        matchLocked || showAnswer || checkCompleted ? -1 : 0
                      }
                      aria-disabled={
                        matchLocked || showAnswer || checkCompleted
                      }
                      aria-pressed={selectedForMatch}
                      aria-label={
                        matchLocked
                          ? `${item.accessibleText}. Matching is correct and locked.`
                          : selectedForMatch
                            ? `${item.accessibleText}. Selected for matching. Choose a word.`
                            : `${item.accessibleText}. Press Enter or Space to start matching.`
                      }
                      onClick={handleStartDotClick}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          selectImageForKeyboard(item.key);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* =================================================
                WORDS
            ================================================= */}

            <div className="match-words-row2">
              {wordItems.map((item) => {
                const wordLocked = isWordMatchLocked(item.word);

                const keyboardTarget =
                  keyboardSelectedImage && keyboardPreviewWord === item.word;

                return (
                  <div
                    key={item.word}
                    className="word-box2"
                    style={{
                      display: "flex",

                      gap: "10px",

                      flexDirection: "row",

                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h5
                        className={`h5-wb-unit3-p1-q1 ${
                          wordLocked || showAnswer ? "disabled-word" : ""
                        }`}
                        onClick={() => {
                          if (wordLocked || showAnswer) {
                            return;
                          }

                          wordDotRefs.current[item.word]?.click();
                        }}
                      >
                        {item.word}
                      </h5>

                      {/* END DOT */}

                      <div
                        ref={(el) => {
                          wordDotRefs.current[item.word] = el;
                        }}
                        className={`dot22-unit7-p6-q2 end-dot22-unit7-p6-q2 ${
                          keyboardTarget
                            ? "keyboard-preview-dot-wb-u3-p1-q1"
                            : ""
                        }`}
                        data-word={item.word}
                        id={item.dotId}
                        role="button"
                        tabIndex={
                          wordLocked ||
                          showAnswer ||
                          checkCompleted ||
                          !keyboardSelectedImage
                            ? -1
                            : 0
                        }
                        aria-disabled={
                          wordLocked || showAnswer || checkCompleted
                        }
                        aria-label={
                          wordLocked
                            ? `${item.word}. Correct match locked.`
                            : keyboardSelectedImage
                              ? `Word ${item.word}. Press Enter or Space to connect.`
                              : `Word ${item.word}. Select a picture first.`
                        }
                        onClick={handleEndDotClick}
                        onFocus={() => handleWordFocus(item.word)}
                        onKeyDown={(e) => handleWordKeyboard(e, item.word)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =================================================
                REAL LINES + KEYBOARD PREVIEW ONLY
            ================================================= */}

            <svg ref={linesSvgRef} className="lines-layer2" aria-hidden="true">
              {" "}
              {/* REAL LINES */}
              {lines.map((line, i) => (
                <line
                  key={`${line.image}-${line.word}-${i}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className="real-match-line-wb-u3-p1-q1"
                />
              ))}
              {/* KEYBOARD/TAB PREVIEW ONLY */}
              {keyboardSelectedImage && keyboardPreviewLine && (
                <line
                  x1={keyboardPreviewLine.x1}
                  y1={keyboardPreviewLine.y1}
                  x2={keyboardPreviewLine.x2}
                  y2={keyboardPreviewLine.y2}
                  className="keyboard-preview-line-wb-u3-p1-q1"
                />
              )}
            </svg>
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="action-buttons-container">
            <button onClick={handleReset} className="try-again-button">
              Start Again ↻
            </button>

            <button onClick={handleShowAnswer} className="show-answer-btn ">
              Show Answer
            </button>
            <button onClick={checkAnswers2} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeNum && (
          <span
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              fontSize: "20px",

              cursor: "grabbing",

              boxShadow: "0 4px 12px rgba(0,0,0,.15)",
            }}
          >
            {activeNum}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit3_Page1_Q1;
