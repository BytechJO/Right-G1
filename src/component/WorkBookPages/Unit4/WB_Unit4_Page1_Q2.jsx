import React, { useEffect, useRef, useState } from "react";

import bat from "../../../assets/U1 WB/U4/U4P21EXEB-01.svg";
import cap from "../../../assets/U1 WB/U4/U4P21EXEB-02.svg";
import ant from "../../../assets/U1 WB/U4/U4P21EXEB-03.svg";
import dad from "../../../assets/U1 WB/U4/U4P21EXEB-04.svg";

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

import "./WB_Unit4_Page1_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import boatAudio from "../../../assets/U1 WB/U4/audio/page_21_qb/Item_001_boat.mp3";
import ballAudio from "../../../assets/U1 WB/U4/audio/page_21_qb/Item_002_ball.mp3";
import itsAAudio from "../../../assets/U1 WB/U4/audio/page_21_qb/Item_003_It'sa.mp3";
import cowAudio from "../../../assets/U1 WB/U4/audio/page_21_qb/Item_004_cow.mp3";
import itsABrownAudio from "../../../assets/U1 WB/U4/audio/page_21_qb/Item_005_It's_a_brown.mp3";
import yellowAudio from "../../../assets/U1 WB/U4/audio/page_21_qb/Item_006_yellow.mp3";
import blueBirdAudio from "../../../assets/U1 WB/U4/audio/page_21_qb/Item_007_blue_bird.mp3";
import redAudio from "../../../assets/U1 WB/U4/audio/page_21_qb/Item_008_red.mp3";

/* =====================================================
   QUESTIONS
===================================================== */

const questions = [
  {
    img: bat,

    ariaLabel: "A cow outline picture. Press Enter or Space to choose a color.",

    parts: [
      {
        type: "text",
        value: "It's a brown ",
        audio: itsABrownAudio,
      },

      {
        type: "input",
        answer: "cow",
        audio: cowAudio,
      },

      {
        type: "text",
        value: ".",
      },
    ],
  },

  {
    img: cap,

    ariaLabel:
      "A sailboat outline picture. Press Enter or Space to choose a color.",

    parts: [
      {
        type: "input",
        answer: "It's a",
        audio: itsAAudio,
      },

      {
        type: "text",
        value: " yellow ",
        audio: yellowAudio,
      },

      {
        type: "input",
        answer: "boat",
        audio: boatAudio,
      },

      {
        type: "text",
        value: ".",
      },
    ],
  },

  {
    img: ant,

    ariaLabel:
      "A bird outline picture. Press Enter or Space to choose a color.",

    parts: [
      {
        type: "input",
        answer: "It's a",
        audio: itsAAudio,
      },

      {
        type: "text",
        value: " blue bird.",
        audio: blueBirdAudio,
      },
    ],
  },

  {
    img: dad,

    ariaLabel:
      "A ball outline picture. Press Enter or Space to choose a color.",

    parts: [
      {
        type: "input",
        answer: "It's a",
        audio: itsAAudio,
      },

      {
        type: "text",
        value: " red ",
        audio: redAudio,
      },

      {
        type: "input",
        answer: "ball",
        audio: ballAudio,
      },

      {
        type: "text",
        value: ".",
      },
    ],
  },
];

/* =====================================================
   WORD BANK

   مهم:
   كل It's a إلها bankId مستقل
===================================================== */

const wordBank = questions.flatMap((q, qIndex) =>
  q.parts
    .map((part, pIndex) => ({
      part,
      pIndex,
    }))
    .filter(({ part }) => part.type === "input")
    .map(({ part, pIndex }) => ({
      word: part.answer,

      audio: part.audio,

      id: `bank-${qIndex}-${pIndex}`,
    })),
);

/* =====================================================
   COLOR OPTIONS
===================================================== */

const paletteColors = [
  {
    value: "brown",
    label: "Brown",
  },

  {
    value: "rgb(255, 187, 0)",
    label: "Yellow",
  },

  {
    value: "blue",
    label: "Blue",
  },

  {
    value: "red",
    label: "Red",
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
            ? `${word} selected. Choose an answer blank.`
            : `${word}. Press Enter or Space to hear and select it.`
        }
        onClick={() => {
          /*
            Mouse click بدون drag:
            صوت فقط
          */

          playAudio(id, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) {
            return;
          }

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
        className={`word-bank-item-wb-unit4-p1-q2 ${
          isPicked ? "keyboard-picked-word-wb-unit4-p1-q2" : ""
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
          className="audio-icon-wb-unit4-p1-q2"
        />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DroppableInputBlank = ({
  droppableId,
  qIndex,
  pIndex,

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

  /* =====================================================
     KEYBOARD DROP MODE
  ===================================================== */

  const keyboardDropActive =
    !!keyboardPickedItem && !locked && !showAnswer && !checkCompleted;

  /* =====================================================
     UPDATED DRAG PATTERN

     أي blank معبّى ولسا مش locked
     يضل reachable بالـTab
     حتى قبل Check
  ===================================================== */

  const canEditFilled =
    !!value && !keyboardPickedItem && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === droppableId;

  const displayValue = showPreview
    ? keyboardPickedItem.word
    : value?.word || "";

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleKeyDown = (e) => {
    /* =================================================
       FILLED SLOT → RETURN TO BANK
    ================================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(qIndex, pIndex, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

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

    /* =================================================
       ENTER / SPACE → PLACE / REPLACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(qIndex, pIndex);

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
    <span
      style={{
        position: "relative",
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
              ? `Blank currently contains ${value.word}. Press Enter or Space to replace it with ${keyboardPickedItem.word}.`
              : `Empty blank. Press Enter or Space to place ${keyboardPickedItem.word}.`
            : canEditFilled
              ? `Blank contains ${value.word}. Press Enter or Space to return it to the word bank.`
              : value
                ? `Blank contains ${value.word}.`
                : "Empty blank."
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
        className={`inline-input-wrapper-wb-unit4-p1-q2 ${
          showPreview ? "keyboard-drop-preview-wb-unit4-p1-q2" : ""
        }`}
      >
        <input
          type="text"
          className={`inline-input-wb-unit4-p1-q2 ${
            isOver && !locked ? "drag-over-cell" : ""
          }`}
          value={displayValue}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => {
            if (value && !locked && !showAnswer && !checkCompleted) {
              onRemove(droppableId);
            }
          }}
          style={{
            background: isOver && !locked ? "#e3f2fd" : "",

            cursor:
              !locked && value && !showAnswer && !checkCompleted
                ? "pointer"
                : "default",
          }}
        />
      </span>

      {isWrong && (
        <span className="error-mark-input-wb-unit2-page3-q2" aria-hidden="true">
          ✕
        </span>
      )}
    </span>
  );
};
/* =====================================================
   MAIN
===================================================== */

const WB_Unit4_Page1_Q2 = () => {
  const correctColors = ["brown", "rgb(255, 187, 0)", "blue", "red"];

  const [wrongColors, setWrongColors] = useState([]);
  const [lockedColors, setLockedColors] = useState([]);
  /* =================================================
       ANSWERS
    ================================================= */

  const emptyAnswers = () => questions.map((q) => q.parts.map(() => null));

  const [answers, setAnswers] = useState(emptyAnswers());

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

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
    ================================================= */

  const [selectedColors, setSelectedColors] = useState(
    questions.map(() => null),
  );

  const [activePaletteIndex, setActivePaletteIndex] = useState(null);

  const [svgContent, setSvgContent] = useState({});

  const svgRefs = useRef([]);

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
       LOAD SVG
    ================================================= */

  useEffect(() => {
    const loadSvgs = async () => {
      const files = [bat, cap, ant, dad];

      const contents = await Promise.all(
        files.map((file) =>
          fetch(file)
            .then((r) => r.text())
            .then((text) =>
              text
                .replaceAll('fill="none"', 'fill="currentColor"')
                .replaceAll(/stroke="[^"]*"/g, 'stroke="currentColor"'),
            ),
        ),
      );

      setSvgContent(contents);
    };

    loadSvgs();
  }, []);

  /* =================================================
       HELPERS
    ================================================= */

  const usedIds = answers
    .flat()
    .filter(Boolean)
    .map((item) => item.bankId);

  const isSlotLocked = (qIndex, pIndex) =>
    lockedSlots.includes(`${qIndex}-${pIndex}`);

  const getAvailableSlotIds = () => {
    const ids = [];

    questions.forEach((q, qIndex) => {
      q.parts.forEach((part, pIndex) => {
        if (
          part.type === "input" &&
          !isSlotLocked(qIndex, pIndex) &&
          !showAnswer &&
          !checkCompleted
        ) {
          ids.push(`blank-${qIndex}-${pIndex}`);
        }
      });
    });

    return ids;
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

    if (!bankItem) {
      return;
    }

    const parts = String(over.id).split("-");

    const qIndex = Number(parts[1]);

    const pIndex = Number(parts[2]);

    if (isSlotLocked(qIndex, pIndex)) {
      return;
    }

    let oldSlotKey = null;

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      /*
              نفس bankId ممكن يكون
              بمكان قديم
            */

      copy.forEach((row, qi) => {
        row.forEach((value, pi) => {
          if (value?.bankId === bankItem.id && !isSlotLocked(qi, pi)) {
            oldSlotKey = `${qi}-${pi}`;

            copy[qi][pi] = null;
          }
        });
      });

      /*
              Replace الهدف مباشرة.
              الكلمة القديمة ترجع للبنك
              لأنها لم تعد موجودة في answers.
            */

      copy[qIndex][pIndex] = {
        word: bankItem.word,

        bankId: bankItem.id,
      };

      return copy;
    });

    const currentKey = `${qIndex}-${pIndex}`;

    setWrongInputs((prev) =>
      prev.filter((key) => key !== currentKey && key !== oldSlotKey),
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

  const handleKeyboardDrop = (qIndex, pIndex) => {
    if (
      !keyboardPickedItem ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(qIndex, pIndex)
    ) {
      return;
    }

    const item = keyboardPickedItem;

    const updated = answers.map((row) => [...row]);

    let oldSlotKey = null;

    /*
          نفس bankId إذا موجود
          بمكان ثاني
        */

    updated.forEach((row, qi) => {
      row.forEach((value, pi) => {
        if (value?.bankId === item.id && !isSlotLocked(qi, pi)) {
          oldSlotKey = `${qi}-${pi}`;

          updated[qi][pi] = null;
        }
      });
    });

    updated[qIndex][pIndex] = {
      word: item.word,

      bankId: item.id,
    };

    setAnswers(updated);

    const currentKey = `${qIndex}-${pIndex}`;

    setWrongInputs((prev) =>
      prev.filter((key) => key !== currentKey && key !== oldSlotKey),
    );

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    /*
          بعد drop:
          روح لأول bank item متاح
        */

    window.setTimeout(() => {
      const currentUsed = updated
        .flat()
        .filter(Boolean)
        .map((a) => a.bankId);

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

  const handleKeyboardClearWrong = (qIndex, pIndex, value) => {
    if (showAnswer || checkCompleted || isSlotLocked(qIndex, pIndex)) {
      return;
    }

    const updated = answers.map((row) => [...row]);

    updated[qIndex][pIndex] = null;

    setAnswers(updated);

    setWrongInputs((prev) =>
      prev.filter((key) => key !== `${qIndex}-${pIndex}`),
    );

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    /*
          رجع لنفس bankId
          حتى لو النص It's a مكرر
        */

    window.setTimeout(() => {
      if (value?.bankId) {
        bankRefs.current[value.bankId]?.focus();
      }
    }, 0);
  };

  /* =================================================
       CANCEL
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

  const handleRemoveFromBlank = (droppableId) => {
    const parts = droppableId.split("-");

    const qIndex = Number(parts[1]);

    const pIndex = Number(parts[2]);

    if (showAnswer || checkCompleted || isSlotLocked(qIndex, pIndex)) {
      return;
    }

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      copy[qIndex][pIndex] = null;

      return copy;
    });

    setWrongInputs((prev) =>
      prev.filter((key) => key !== `${qIndex}-${pIndex}`),
    );
  };

  /* =================================================
       CHECK
    ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) return;

    // ==============================
    // تأكد من كل خانات الكلمات
    // ==============================
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      for (let pIndex = 0; pIndex < questions[qIndex].parts.length; pIndex++) {
        const part = questions[qIndex].parts[pIndex];

        if (part.type === "input" && !answers[qIndex][pIndex]) {
          ValidationAlert.info(`Please complete question ${qIndex + 1}.`);
          return;
        }
      }
    }

    // ==============================
    // تأكد من كل الصور متلونة
    // ==============================
    const missingColorIndex = selectedColors.findIndex((color) => !color);

    if (missingColorIndex !== -1) {
      ValidationAlert.info(
        `Please color picture ${missingColorIndex + 1} before checking.`,
      );
      return;
    }

    let score = 0;
    let total = 0;

    const wrongWords = [];
    const newlyLockedSlots = [];

    // ==============================
    // Check Words
    // ==============================
    questions.forEach((q, qIndex) => {
      q.parts.forEach((part, pIndex) => {
        if (part.type !== "input") return;

        total++;

        const slotKey = `${qIndex}-${pIndex}`;

        const isCorrect = answers[qIndex][pIndex]?.word?.trim() === part.answer;

        if (isCorrect) {
          score++;

          newlyLockedSlots.push(slotKey);
        } else {
          wrongWords.push(slotKey);
        }
      });
    });

    // ==============================
    // Check Colors
    // ==============================
    const newWrongColors = [];
    const newlyLockedColors = [];

    selectedColors.forEach((color, index) => {
      total++;

      const isCorrect = color === correctColors[index];

      if (isCorrect) {
        score++;

        newlyLockedColors.push(index);
      } else {
        newWrongColors.push(index);
      }
    });

    // ==============================
    // Progressive Lock
    // ==============================

    setLockedSlots((prev) =>
      Array.from(new Set([...prev, ...newlyLockedSlots])),
    );

    setLockedColors((prev) =>
      Array.from(new Set([...prev, ...newlyLockedColors])),
    );

    setWrongInputs(wrongWords);

    setWrongColors(newWrongColors);

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    setActivePaletteIndex(null);

    // ==============================
    // Score
    // ==============================

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    if (score === total) {
      setLockedSlots(newlyLockedSlots);

      setLockedColors(questions.map((_, index) => index));

      setWrongInputs([]);
      setWrongColors([]);

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
    ================================================= */

  const showAnswers = () => {
    stopAudio();

    const usedBankIds = new Set();

    const result = questions.map((q, qIndex) =>
      q.parts.map((part, pIndex) => {
        if (part.type !== "input") {
          return null;
        }

        const bankItem = wordBank.find(
          (item) => item.word === part.answer && !usedBankIds.has(item.id),
        );

        if (bankItem) {
          usedBankIds.add(bankItem.id);

          return {
            word: bankItem.word,

            bankId: bankItem.id,
          };
        }

        return null;
      }),
    );

    const allSlots = [];

    questions.forEach((q, qIndex) => {
      q.parts.forEach((part, pIndex) => {
        if (part.type === "input") {
          allSlots.push(`${qIndex}-${pIndex}`);
        }
      });
    });

    setAnswers(result);

    setWrongInputs([]);

    setLockedSlots(allSlots);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);
    setSelectedColors([...correctColors]);

    setWrongColors([]);

    setLockedColors(questions.map((_, index) => index));
  };

  /* =================================================
       RESET
    ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(emptyAnswers());

    setWrongInputs([]);

    setLockedSlots([]);
    setSelectedColors(questions.map(() => null));

    setWrongColors([]);

    setLockedColors([]);
    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    setSelectedColors(questions.map(() => null));

    setActivePaletteIndex(null);
  };

  /* =================================================
       COLOR PALETTE
    ================================================= */

  const openPalette = (qIndex) => {
    if (showAnswer || checkCompleted || lockedColors.includes(qIndex)) {
      return;
    }

    setActivePaletteIndex(qIndex);

    requestAnimationFrame(() => {
      paletteButtonRefs.current[`${qIndex}-0`]?.focus();
    });
  };

  const closePalette = (qIndex) => {
    setActivePaletteIndex(null);

    requestAnimationFrame(() => {
      svgRefs.current[qIndex]?.focus();
    });
  };

  const selectColor = (qIndex, color) => {
    if (showAnswer || checkCompleted || lockedColors.includes(qIndex)) {
      return;
    }

    setSelectedColors((prev) => {
      const copy = [...prev];
      copy[qIndex] = color;
      return copy;
    });

    // شيل X فقط عن نفس الصورة
    setWrongColors((prev) => prev.filter((index) => index !== qIndex));

    setActivePaletteIndex(null);

    requestAnimationFrame(() => {
      svgRefs.current[qIndex]?.focus();
    });
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
        className="question-wrapper-unit3-page6-q1"
        style={{
          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          padding: "30px",
        }}
      >
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="B"
            title="Look, write, and color."
            subTitle="Drag the missing words into each sentence, then color the picture to match."
          />

          {/* ===============================================
                WORD BANK
            =============================================== */}

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

          {/* ===============================================
                QUESTIONS
            =============================================== */}

          <div className="content-container-wb-unit4-p1-q2">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="row2-wb-unit4-p1-q2">
                {/* =======================================
                        NUMBER + COLORABLE SVG
                    ======================================= */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    position: "relative",
                  }}
                >
                  <span className="num-span">{qIndex + 1}</span>
                  {svgContent[qIndex] ? (
                    <div
                      ref={(el) => {
                        svgRefs.current[qIndex] = el;
                      }}
                      className={`svg-wrapper wb-svg-colorable ${
                        wrongColors.includes(qIndex)
                          ? "wrong-color-image-wb-unit4-p1-q2"
                          : ""
                      }`}
                      style={{
                        color: selectedColors[qIndex] || "transparent",

                        cursor:
                          lockedColors.includes(qIndex) ||
                          showAnswer ||
                          checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                      role="button"
                      tabIndex={
                        lockedColors.includes(qIndex) ||
                        showAnswer ||
                        checkCompleted
                          ? -1
                          : 0
                      }
                      aria-label={
                        wrongColors.includes(qIndex)
                          ? `${q.ariaLabel} The selected color is incorrect. Press Enter or Space to choose another color.`
                          : q.ariaLabel
                      }
                      aria-expanded={activePaletteIndex === qIndex}
                      onClick={() => openPalette(qIndex)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          openPalette(qIndex);
                        }
                      }}
                      dangerouslySetInnerHTML={{
                        __html: svgContent[qIndex],
                      }}
                    />
                  ) : (
                    <div className="svg-placeholder">Loading...</div>
                  )}
                  {wrongColors.includes(qIndex) && (
                    <span
                      className="wrong-color-x-wb-unit4-p1-q2"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}
                  {activePaletteIndex === qIndex && (
                    <div
                      className="color-palette-wb-unit4-p1-q2"
                      role="group"
                      aria-label={`Choose a color for picture ${qIndex + 1}`}
                    >
                      {paletteColors.map((color, colorIndex) => (
                        <button
                          key={color.label}
                          ref={(el) => {
                            paletteButtonRefs.current[
                              `${qIndex}-${colorIndex}`
                            ] = el;
                          }}
                          type="button"
                          className="color-circle"
                          style={{
                            backgroundColor: color.value,
                          }}
                          aria-label={color.label}
                          onClick={() => selectColor(qIndex, color.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              e.preventDefault();
                              e.stopPropagation();

                              closePalette(qIndex);
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}{" "}
                </div>

                {/* =======================================
                        SENTENCE
                    ======================================= */}

                <div className="sentence-wrapper-wb-unit4-p1-q2">
                  {q.parts.map((part, pIndex) => {
                    /* =================================
                             TEXT + AUDIO
                          ================================= */

                    if (part.type === "text") {
                      if (!part.audio) {
                        return (
                          <span key={pIndex} className="sentence-text">
                            {part.value}
                          </span>
                        );
                      }

                      const audioKey = `sentence-${qIndex}-${pIndex}`;

                      const isPlaying = playingKey === audioKey;

                      return (
                        <span
                          key={pIndex}
                          role="button"
                          tabIndex={0}
                          aria-label={`Play audio for ${part.value.trim()}`}
                          onClick={() => playAudio(audioKey, part.audio)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              playAudio(audioKey, part.audio);
                            }
                          }}
                          className="sentence-text sentence-audio-wb-unit4-p1-q2"
                          style={{
                            position: "relative",

                            cursor: "pointer",
                          }}
                        >
                          {part.value}

                          {isPlaying && (
                            <FaVolumeUp
                              size={15}
                              aria-hidden="true"
                              className="sentence-audio-icon-wb-unit4-p1-q2"
                            />
                          )}
                        </span>
                      );
                    }

                    /* =================================
                             DRAG INPUT
                          ================================= */

                    return (
                      <DroppableInputBlank
                        key={pIndex}
                        droppableId={`blank-${qIndex}-${pIndex}`}
                        qIndex={qIndex}
                        pIndex={pIndex}
                        value={answers[qIndex][pIndex]}
                        isWrong={wrongInputs.includes(`${qIndex}-${pIndex}`)}
                        locked={isSlotLocked(qIndex, pIndex)}
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
                        onRemove={handleRemoveFromBlank}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===============================================
              BUTTONS
          =============================================== */}

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

      {/* ===============================================
            DRAG OVERLAY
        =============================================== */}

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

export default WB_Unit4_Page1_Q2;
