import React, { useCallback, useEffect, useRef, useState } from "react";

import "./WB_Unit7_Page2_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import audio1 from "../../../assets/U1 WB/U7/audio/page 40- C/Item_001_you_happy_Are.mp3";
import audio2 from "../../../assets/U1 WB/U7/audio/page 40- C/Item_002_the_matter_What's.mp3";
import audio3 from "../../../assets/U1 WB/U7/audio/page 40- C/Item_003_bored_I'm.mp3";
import audio4 from "../../../assets/U1 WB/U7/audio/page 40- C/Item_004_sad_you_Are.mp3";
import audio5 from "../../../assets/U1 WB/U7/audio/page 40- C/Item_005_hungry_you_Are.mp3";

import imBoredAudio from "../../../assets/U1 WB/U7/audio/page 40- C/Item_006_I'm_bored.mp3";
import areYouHungryAudio from "../../../assets/U1 WB/U7/audio/page 40- C/Item_007_Are_you_hungry.mp3";
import imColdAudio from "../../../assets/U1 WB/U7/audio/page 40- C/Item_008_I'm_cold.mp3";
import whatsTheMatterAudio from "../../../assets/U1 WB/U7/audio/page 40- C/Item_009_What's_the_matter.mp3";
import areYouHappyAudio from "../../../assets/U1 WB/U7/audio/page 40- C/Item_010_Are_you_happy.mp3";

/* =====================================================
   DRAG DATA
===================================================== */

const SCRAMBLED_WORDS = {
  1: ["you", "happy", "Are", "?"],
  2: ["the", "matter", "What's", "?"],
  3: ["bored", "I'm", "."],
  4: ["sad", "you", "Are", "?"],
  5: ["hungry", "you", "Are", "?"],
  6: ["cold", "I'm", "."],
};

const CORRECT_ORDER = {
  1: ["Are", "you", "happy", "?"],
  2: ["What's", "the", "matter", "?"],
  3: ["I'm", "bored", "."],
  4: ["Are", "you", "sad", "?"],
  5: ["Are", "you", "hungry", "?"],
  6: ["I'm", "cold", "."],
};

const CORRECT_SENTENCES = {
  1: "Are you happy ?",
  2: "What's the matter ?",
  3: "I'm bored .",
  4: "Are you sad ?",
  5: "Are you hungry ?",
  6: "I'm cold .",
};

/* =====================================================
   AUDIO FOR LEFT / BUILT SENTENCES
===================================================== */

const LEFT_AUDIO = {
  1: audio1,
  2: audio2,
  3: audio3,
  4: audio4,
  5: audio5,
  6: imColdAudio,
};

/* =====================================================
   MATCHING DATA
===================================================== */

const CORRECT_MATCHES = [
  {
    word: "you/happy/Are ?",
    image: "Are you happy?",
  },
  {
    word: "the/matter/What's ?",
    image: "What's the matter?",
  },
  {
    word: "bored/I'm .",
    image: "I'm bored.",
  },
  {
    word: "sad/you/Are ?",
    image: "Are you sad?",
  },
  {
    word: "hungry/you/Are ?",
    image: "Are you hungry?",
  },
  {
    word: "cold/I'm .",
    image: "I'm cold.",
  },
];

const ROWS = [
  {
    id: 1,
    wordKey: "you/happy/Are ?",
    leftText: "Are you happy?",
    rightText: "I'm bored.",
    rightImage: "I'm bored.",
  },

  {
    id: 2,
    wordKey: "the/matter/What's ?",
    leftText: "What's the matter?",
    rightText: "Are you hungry?",
    rightImage: "Are you hungry?",
  },

  {
    id: 3,
    wordKey: "bored/I'm .",
    leftText: "I'm bored.",
    rightText: "I'm cold.",
    rightImage: "I'm cold.",
  },

  {
    id: 4,
    wordKey: "sad/you/Are ?",
    leftText: "Are you sad?",
    rightText: "What's the matter?",
    rightImage: "What's the matter?",
  },

  {
    id: 5,
    wordKey: "hungry/you/Are ?",
    leftText: "Are you hungry?",
    rightText: "Are you happy?",
    rightImage: "Are you happy?",
  },

  {
    id: 6,
    wordKey: "cold/I'm .",
    leftText: "I'm cold.",
    rightText: "Are you sad?",
    rightImage: "Are you sad?",
  },
];

/* =====================================================
   RIGHT AUDIO
===================================================== */

const RIGHT_AUDIO = {
  "I'm bored.": imBoredAudio,
  "Are you hungry?": areYouHungryAudio,
  "I'm cold.": imColdAudio,
  "What's the matter?": whatsTheMatterAudio,
  "Are you happy?": areYouHappyAudio,

  // نفس جملة row 4
  "Are you sad?": audio4,
};

const INITIAL_INPUTS = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
};

/* =====================================================
   GET CENTER
===================================================== */

const getCenter = (element, container) => {
  if (!element || !container) {
    return null;
  }

  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: elementRect.left - containerRect.left + elementRect.width / 2,

    y: elementRect.top - containerRect.top + elementRect.height / 2,
  };
};

/* =====================================================
   WORD CHIP
===================================================== */

const WordChip = ({
  id,
  rowId,
  text,

  isUsed,
  isDisabled,

  keyboardPickedWord,

  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed || isDisabled,
  });

  const picked =
    keyboardPickedWord?.rowId === rowId && keyboardPickedWord?.word === text;

  return (
    <div
      ref={(element) => {
        setNodeRef(element);

        bankRefs.current[`${rowId}-${text}`] = element;
      }}
      {...(!isUsed && !isDisabled
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={isUsed || isDisabled ? -1 : 0}
      aria-pressed={picked}
      aria-disabled={isUsed || isDisabled}
      aria-label={`${text}. Press Enter or Space to select this word.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          if (!isUsed && !isDisabled) {
            onKeyboardPick(rowId, text);
          }
        }
      }}
      className={`word-box-wb-unit7-p2-q1 ${
        picked ? "keyboard-picked-word-wb-unit7-p2-q1" : ""
      }`}
      style={{
        cursor: isUsed || isDisabled ? "default" : "grab",

        opacity: isUsed ? 0.35 : isDragging ? 0.5 : 1,

        pointerEvents: isUsed ? "none" : undefined,

        userSelect: "none",

        touchAction: "none",
      }}
    >
      {text}
    </div>
  );
};

/* =====================================================
   SENTENCE DROP ZONE
===================================================== */

const SentenceDropZone = ({
  rowId,
  words,

  isLocked,
  isWrong,

  keyboardPickedWord,
  focusedDropId,

  setFocusedDropId,

  dropRefs,

  onKeyboardDrop,
  onKeyboardRemove,

  onReturn,

  onCancel,

  playAudio,
  playingKey,
}) => {
  const dropId = `sentence-${rowId}`;

  const { setNodeRef, isOver } = useDroppable({
    id: dropId,

    disabled: isLocked,
  });

  const keyboardActive = keyboardPickedWord?.rowId === rowId && !isLocked;

  const hasWords = words.length > 0;

  const showPreview = keyboardActive && focusedDropId === dropId;

  const fullSentence = words.join(" ");

  const completed = isLocked;

  const audioKey = `left-${rowId}`;

  return (
    <div
      ref={(element) => {
        setNodeRef(element);

        dropRefs.current[dropId] = element;
      }}
      role="button"
      tabIndex={completed ? 0 : keyboardActive || hasWords ? 0 : -1}
      aria-label={
        completed
          ? `${fullSentence}. Press Enter or Space to hear the sentence.`
          : keyboardActive
            ? `Sentence ${rowId}. Press Enter or Space to place ${keyboardPickedWord.word}.`
            : hasWords
              ? `Sentence ${rowId}. Use Tab to reach placed words or press Enter to hear instructions.`
              : `Sentence ${rowId}.`
      }
      className={[
        "unscramble-input-wb-unit7-p2-q1",

        isOver ? "active-drop" : "",

        isWrong ? "wrong-unscramble-wb-unit7-p2-q1" : "",

        showPreview ? "keyboard-drop-preview-wb-unit7-p2-q1" : "",

        completed ? "completed-sentence-wb-unit7-p2-q1" : "",
      ]
        .join(" ")
        .trim()}
      onFocus={() => {
        if (keyboardActive) {
          setFocusedDropId(dropId);
        }
      }}
      onBlur={() => {
        setFocusedDropId(null);
      }}
      onClick={() => {
        if (completed) {
          playAudio(audioKey, LEFT_AUDIO[rowId]);
        }
      }}
      onKeyDown={(e) => {
        /* =========================================
           COMPLETED = AUDIO ONLY
        ========================================= */

        if (completed && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();

          playAudio(audioKey, LEFT_AUDIO[rowId]);

          return;
        }

        /* =========================================
           KEYBOARD PICK ACTIVE
        ========================================= */

        if (keyboardActive) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardDrop(rowId);

            return;
          }

          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();

            onCancel();

            return;
          }
        }
      }}
    >
      {/* =================================================
          REAL WORDS
      ================================================= */}

      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          role={isLocked ? undefined : "button"}
          tabIndex={isLocked ? -1 : 0}
          aria-label={
            isLocked
              ? undefined
              : `${word}. Press Enter or Space to return this word to the bank.`
          }
          onClick={(e) => {
            e.stopPropagation();

            if (!isLocked) {
              onReturn(rowId, word);
            }
          }}
          onKeyDown={(e) => {
            if (!isLocked && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              e.stopPropagation();

              onKeyboardRemove(rowId, word);
            }
          }}
          className="placed-word-wb-unit7-p2-q1"
        >
          {word}
        </span>
      ))}

      {/* =================================================
          KEYBOARD BLINK PREVIEW
      ================================================= */}

      {showPreview && (
        <span
          className="keyboard-preview-word-wb-unit7-p2-q1"
          aria-hidden="true"
        >
          {keyboardPickedWord.word}
        </span>
      )}

      {/* WRONG X */}

      {isWrong && (
        <span className="wrong-input-mark-wb-unit7-p2-q1" aria-hidden="true">
          ✕
        </span>
      )}

      {/* AUDIO ICON */}

      {completed && playingKey === audioKey && (
        <FaVolumeUp
          size={14}
          aria-hidden="true"
          className="audio-corner-wb-unit7-p2-q1"
        />
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit7_Page2_Q1 = () => {
  /* =====================================================
     DRAG
  ===================================================== */

  const [userInputs, setUserInputs] = useState(INITIAL_INPUTS);

  const [activeInfo, setActiveInfo] = useState(null);

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedDropId, setFocusedDropId] = useState(null);

  /* =====================================================
     DRAG CHECK
  ===================================================== */

  const [lockedSentenceRows, setLockedSentenceRows] = useState([]);

  const [wrongInputs, setWrongInputs] = useState([]);

  /* =====================================================
     MATCHING
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  /*
    {
      side: "left" | "right",
      id: ...
    }
  */

  const [lockedMatches, setLockedMatches] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  /* =====================================================
     KEYBOARD MATCHING
  ===================================================== */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  const [keyboardOrigin, setKeyboardOrigin] = useState(null);

  const [focusedMatchTarget, setFocusedMatchTarget] = useState(null);

  const [previewLine, setPreviewLine] = useState(null);

  /* =====================================================
     FINAL
  ===================================================== */

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  /* =====================================================
     REFS
  ===================================================== */

  const containerRef = useRef(null);

  const dotRefs = useRef({});

  const leftRefs = useRef({});

  const rightRefs = useRef({});

  const bankRefs = useRef({});

  const dropRefs = useRef({});

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

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const isSentenceLocked = (rowId) => lockedSentenceRows.includes(rowId);

  const isMatchLocked = (word) => lockedMatches.includes(word);

  const getLineByWord = (word) => lines.find((line) => line.word === word);

  const getLineByImage = (image) => lines.find((line) => line.image === image);

  const isRightLocked = (image) => {
    const line = getLineByImage(image);

    return !!line && isMatchLocked(line.word);
  };

  /* =====================================================
     USED WORDS
  ===================================================== */

  const usedWords = {};

  ROWS.forEach(({ id }) => {
    usedWords[id] = new Set(userInputs[id]);
  });

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
    const parts = active.id.split("-");

    const rowId = Number(parts[1]);

    const word = parts.slice(2).join("-");

    setActiveInfo({
      rowId,
      word,
    });
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveInfo(null);

      if (!over || showAnswer || checkCompleted) {
        return;
      }

      const parts = active.id.split("-");

      const rowId = Number(parts[1]);

      const word = parts.slice(2).join("-");

      const destRowId = Number(String(over.id).split("-")[1]);

      if (rowId !== destRowId || isSentenceLocked(rowId)) {
        return;
      }

      setUserInputs((prev) => ({
        ...prev,

        [rowId]: [...prev[rowId].filter((item) => item !== word), word],
      }));

      setWrongInputs((prev) => prev.filter((id) => Number(id) !== rowId));
    },
    [showAnswer, checkCompleted, lockedSentenceRows],
  );

  /* =====================================================
     RETURN WORD
  ===================================================== */

  const handleReturn = (rowId, word) => {
    if (showAnswer || checkCompleted || isSentenceLocked(rowId)) {
      return;
    }

    setUserInputs((prev) => ({
      ...prev,

      [rowId]: prev[rowId].filter((item) => item !== word),
    }));

    setWrongInputs((prev) => prev.filter((id) => Number(id) !== rowId));
  };

  /* =====================================================
     KEYBOARD DRAG PICK
  ===================================================== */

  const handleKeyboardPick = (rowId, word) => {
    if (showAnswer || checkCompleted || isSentenceLocked(rowId)) {
      return;
    }

    setKeyboardPickedWord({
      rowId,
      word,
    });

    setFocusedDropId(null);

    requestAnimationFrame(() => {
      dropRefs.current[`sentence-${rowId}`]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DROP
  ===================================================== */

  const handleKeyboardDrop = (rowId) => {
    if (!keyboardPickedWord || keyboardPickedWord.rowId !== rowId) {
      return;
    }

    const word = keyboardPickedWord.word;

    setUserInputs((prev) => ({
      ...prev,

      [rowId]: [...prev[rowId].filter((item) => item !== word), word],
    }));

    setWrongInputs((prev) => prev.filter((id) => Number(id) !== rowId));

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      bankRefs.current[`${rowId}-${word}`]?.focus();
    }, 0);
  };

  /* =====================================================
     KEYBOARD REMOVE
  ===================================================== */

  const handleKeyboardRemove = (rowId, word) => {
    handleReturn(rowId, word);

    window.setTimeout(() => {
      bankRefs.current[`${rowId}-${word}`]?.focus();
    }, 0);
  };

  /* =====================================================
     CANCEL KEYBOARD DRAG
  ===================================================== */

  const cancelKeyboardDrag = () => {
    const selected = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      if (selected) {
        bankRefs.current[`${selected.rowId}-${selected.word}`]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     REGISTER DOT
  ===================================================== */

  const registerDot = (key, element) => {
    if (element) {
      dotRefs.current[key] = element;
    }
  };

  /* =====================================================
     MATCH AVAILABLE TARGETS
  ===================================================== */

  const getAvailableOppositeTargets = (origin) => {
    if (!origin) {
      return [];
    }

    /* =============================================
         LEFT -> RIGHT
      ============================================= */

    if (origin.side === "left") {
      return ROWS.map((row) => row.rightImage).filter((image) => {
        const existing = getLineByImage(image);

        if (!existing) {
          return true;
        }

        if (existing.word === origin.id) {
          return true;
        }

        /*
              connected but WRONG / unlocked
              = still available
            */

        return !isMatchLocked(existing.word);
      });
    }

    /* =============================================
         RIGHT -> LEFT
      ============================================= */

    return ROWS.map((row) => row.wordKey).filter((word) => {
      const existing = getLineByWord(word);

      if (!existing) {
        return true;
      }

      if (existing.image === origin.id) {
        return true;
      }

      return !isMatchLocked(word);
    });
  };

  /* =====================================================
     COMMIT MATCH
  ===================================================== */

  const commitMatch = (word, image) => {
    if (
      !word ||
      !image ||
      showAnswer ||
      checkCompleted ||
      isMatchLocked(word)
    ) {
      return;
    }

    const existingTarget = getLineByImage(image);

    /*
      لو target مربوط بـcorrect locked connection
      ممنوع نستبدله.
    */

    if (
      existingTarget &&
      existingTarget.word !== word &&
      isMatchLocked(existingTarget.word)
    ) {
      return;
    }

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== image),

      {
        word,
        image,
      },
    ]);

    /* =============================================
       CLEAR X FROM CHANGED SOURCE
       + displaced wrong source
    ============================================= */

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== existingTarget?.word),
    );

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedMatchTarget(null);

    setPreviewLine(null);
  };

  /* =====================================================
     MOUSE MATCH FROM EITHER SIDE
  ===================================================== */

  const handleMatchClick = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /* =============================================
       LOCK CHECK
    ============================================= */

    if (side === "left" && isMatchLocked(id)) {
      return;
    }

    if (side === "right" && isRightLocked(id)) {
      return;
    }

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedMatchTarget(null);

    setPreviewLine(null);

    /* =============================================
       NOTHING SELECTED
    ============================================= */

    if (!selectedEndpoint) {
      setSelectedEndpoint({
        side,
        id,
      });

      return;
    }

    /* =============================================
       CLICK SAME SIDE
       => switch selected point
    ============================================= */

    if (selectedEndpoint.side === side) {
      if (selectedEndpoint.id === id) {
        setSelectedEndpoint(null);
      } else {
        setSelectedEndpoint({
          side,
          id,
        });
      }

      return;
    }

    /* =============================================
       COMPLETE CONNECTION
    ============================================= */

    const word = side === "left" ? id : selectedEndpoint.id;

    const image = side === "right" ? id : selectedEndpoint.id;

    commitMatch(word, image);
  };

  /* =====================================================
     START KEYBOARD MATCH FROM EITHER SIDE
  ===================================================== */

  const startKeyboardMatch = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "left" && isMatchLocked(id)) {
      return;
    }

    if (side === "right" && isRightLocked(id)) {
      return;
    }

    setSelectedEndpoint(null);

    setKeyboardMatching(true);

    const origin = {
      side,
      id,
    };

    setKeyboardOrigin(origin);

    setFocusedMatchTarget(null);

    const available = getAvailableOppositeTargets(origin);

    window.setTimeout(() => {
      if (!available.length) {
        return;
      }

      if (side === "left") {
        rightRefs.current[available[0]]?.focus();
      } else {
        leftRefs.current[available[0]]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     AUDIO FOR MATCH TEXT
  ===================================================== */

  const getLeftAudio = (wordKey) => {
    const row = ROWS.find((item) => item.wordKey === wordKey);

    return row ? LEFT_AUDIO[row.id] : null;
  };

  /* =====================================================
     MATCH TEXT KEYBOARD
  ===================================================== */

  const handleMatchKeyDown = (e, side, id, audioSrc) => {
    const audioKey = `match-${side}-${id}`;

    /* =============================================
         NO ACTIVE MATCH:
         AUDIO + START MATCH
      ============================================= */

    if (!keyboardMatching) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();

        playAudio(audioKey, audioSrc);

        const locked = side === "left" ? isMatchLocked(id) : isRightLocked(id);

        /*
            Correct locked:
            audio only.
          */

        if (!locked) {
          startKeyboardMatch(side, id);
        }
      }

      return;
    }

    /* =============================================
         ORIGIN SIDE ELEMENT WHILE MATCHING
      ============================================= */

    if (keyboardOrigin?.side === side) {
      return;
    }

    /* =============================================
         TAB / SHIFT TAB
      ============================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableOppositeTargets(keyboardOrigin);

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(id);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const next = available[nextIndex];

      if (keyboardOrigin.side === "left") {
        rightRefs.current[next]?.focus();
      } else {
        leftRefs.current[next]?.focus();
      }

      return;
    }

    /* =============================================
         ENTER / SPACE = COMMIT
      ============================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      playAudio(audioKey, audioSrc);

      const word = side === "left" ? id : keyboardOrigin.id;

      const image = side === "right" ? id : keyboardOrigin.id;

      const origin = keyboardOrigin;

      commitMatch(word, image);

      /*
          focus next available source
        */

      window.setTimeout(() => {
        if (origin.side === "left") {
          const next = ROWS.find(
            (row) => row.wordKey !== origin.id && !isMatchLocked(row.wordKey),
          );

          if (next) {
            leftRefs.current[next.wordKey]?.focus();
          }
        } else {
          const next = ROWS.find(
            (row) =>
              row.rightImage !== origin.id && !isRightLocked(row.rightImage),
          );

          if (next) {
            rightRefs.current[next.rightImage]?.focus();
          }
        }
      }, 0);

      return;
    }

    /* =============================================
         ESCAPE
      ============================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const origin = keyboardOrigin;

      setKeyboardMatching(false);

      setKeyboardOrigin(null);

      setFocusedMatchTarget(null);

      setPreviewLine(null);

      window.setTimeout(() => {
        if (origin.side === "left") {
          leftRefs.current[origin.id]?.focus();
        } else {
          rightRefs.current[origin.id]?.focus();
        }
      }, 0);
    }
  };

  /* =====================================================
     UPDATE KEYBOARD PREVIEW LINE
  ===================================================== */

  const updatePreviewLine = (targetSide, targetId) => {
    if (!keyboardMatching || !keyboardOrigin || !containerRef.current) {
      setPreviewLine(null);

      return;
    }

    const originKey =
      keyboardOrigin.side === "left"
        ? `left-${keyboardOrigin.id}`
        : `right-${keyboardOrigin.id}`;

    const targetKey =
      targetSide === "left" ? `left-${targetId}` : `right-${targetId}`;

    const originElement = dotRefs.current[originKey];

    const targetElement = dotRefs.current[targetKey];

    const p1 = getCenter(originElement, containerRef.current);

    const p2 = getCenter(targetElement, containerRef.current);

    if (!p1 || !p2) {
      return;
    }

    setPreviewLine({
      x1: p1.x,
      y1: p1.y,

      x2: p2.x,
      y2: p2.y,
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /* =============================================
         REQUIRE EVERYTHING FILLED
      ============================================= */

    const allSentencesFilled = Object.entries(userInputs).every(
      ([rowId, words]) =>
        isSentenceLocked(Number(rowId)) ||
        words.length === CORRECT_ORDER[Number(rowId)].length,
    );

    if (!allSentencesFilled || lines.length < ROWS.length) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all sentences and matches.",
      );

      return;
    }

    let sentenceCorrect = 0;

    let matchCorrect = 0;

    const newlyLockedSentences = [];

    const wrongSentenceRows = [];

    /* =============================================
         SENTENCES
      ============================================= */

    ROWS.forEach((row) => {
      if (isSentenceLocked(row.id)) {
        sentenceCorrect++;

        return;
      }

      const user = userInputs[row.id].join(" ");

      if (user === CORRECT_SENTENCES[row.id]) {
        sentenceCorrect++;

        newlyLockedSentences.push(row.id);
      } else {
        wrongSentenceRows.push(String(row.id));
      }
    });

    /* =============================================
         MATCHING
      ============================================= */

    const newlyLockedMatches = [];

    const wrongMatchSources = [];

    CORRECT_MATCHES.forEach((correct) => {
      if (isMatchLocked(correct.word)) {
        matchCorrect++;

        return;
      }

      const userLine = getLineByWord(correct.word);

      if (userLine?.image === correct.image) {
        matchCorrect++;

        newlyLockedMatches.push(correct.word);
      } else {
        wrongMatchSources.push(correct.word);
      }
    });

    /* =============================================
         PROGRESSIVE LOCK
      ============================================= */

    setLockedSentenceRows((prev) => [
      ...new Set([...prev, ...newlyLockedSentences]),
    ]);

    setLockedMatches((prev) => [...new Set([...prev, ...newlyLockedMatches])]);

    setWrongInputs(wrongSentenceRows);

    setWrongWords(wrongMatchSources);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setPreviewLine(null);

    const total = ROWS.length + CORRECT_MATCHES.length;

    const score = sentenceCorrect + matchCorrect;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
        <div style="font-size:20px;text-align:center">
          <span style="color:${color};font-weight:bold">
            Score: ${score} / ${total}
          </span>
        </div>
      `;

    if (score === total) {
      setLockedSentenceRows(ROWS.map((row) => row.id));

      setLockedMatches(CORRECT_MATCHES.map((item) => item.word));

      setWrongInputs([]);

      setWrongWords([]);

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const filled = {};

    Object.keys(CORRECT_ORDER).forEach((key) => {
      filled[key] = [...CORRECT_ORDER[key]];
    });

    setUserInputs(filled);

    setLines(
      CORRECT_MATCHES.map(({ word, image }) => ({
        word,
        image,
      })),
    );

    setLockedSentenceRows(ROWS.map((row) => row.id));

    setLockedMatches(CORRECT_MATCHES.map((item) => item.word));

    setWrongWords([]);

    setWrongInputs([]);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setPreviewLine(null);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    stopAudio();

    setLines([]);

    setUserInputs(INITIAL_INPUTS);

    setWrongWords([]);

    setWrongInputs([]);

    setLockedSentenceRows([]);

    setLockedMatches([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedMatchTarget(null);

    setPreviewLine(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);
  };

  /* =====================================================
     SVG LINES
  ===================================================== */

  const [svgLines, setSvgLines] = useState([]);

  const recomputeLines = () => {
    if (!containerRef.current) {
      return;
    }

    const calculated = lines
      .map((line) => {
        const left = dotRefs.current[`left-${line.word}`];

        const right = dotRefs.current[`right-${line.image}`];

        const p1 = getCenter(left, containerRef.current);

        const p2 = getCenter(right, containerRef.current);

        if (!p1 || !p2) {
          return null;
        }

        return {
          ...line,

          x1: p1.x,
          y1: p1.y,

          x2: p2.x,
          y2: p2.y,
        };
      })
      .filter(Boolean);

    setSvgLines(calculated);
  };

  useEffect(() => {
    recomputeLines();
  }, [lines, lockedMatches, wrongWords]);

  useEffect(() => {
    const resize = () => {
      recomputeLines();
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);

      stopAudio();
    };
  }, []);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveInfo(null)}
    >
      <div
        style={{
          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          padding: 30,
        }}
      >
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="C"
            title="Unscramble, write, and match."
            subTitle="Put each question or sentence in order, then connect it to the correct reply."
          />

          <div
            className="container12 w-full"
            ref={containerRef}
            style={{
              position: "relative",
            }}
          >
            {ROWS.map((row) => {
              const sentenceLocked = isSentenceLocked(row.id);

              const matchLocked = isMatchLocked(row.wordKey);

              const rightLocked = isRightLocked(row.rightImage);

              const leftSelected =
                selectedEndpoint?.side === "left" &&
                selectedEndpoint?.id === row.wordKey;

              const rightSelected =
                selectedEndpoint?.side === "right" &&
                selectedEndpoint?.id === row.rightImage;

              const keyboardLeftSelected =
                keyboardOrigin?.side === "left" &&
                keyboardOrigin?.id === row.wordKey;

              const keyboardRightSelected =
                keyboardOrigin?.side === "right" &&
                keyboardOrigin?.id === row.rightImage;

              return (
                <div
                  className="matching-row2"
                  style={{
                    alignItems: "flex-start",
                  }}
                  key={row.id}
                >
                  {/* =================================================
                        LEFT
                    ================================================= */}

                  <div className="flex flex-col justify-between h-[110px]">
                    {/* =============================================
                          MATCH LEFT SENTENCE
                      ============================================= */}

                    <div className="word-with-dot2">
                      <span className="span-num2-wb-unit7-p2-q1">{row.id}</span>

                      <span
                        ref={(element) => {
                          leftRefs.current[row.wordKey] = element;
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={
                          matchLocked
                            ? `${row.leftText}. Press Enter or Space to hear it.`
                            : `${row.leftText}. Press Enter or Space to hear it and start matching.`
                        }
                        className={[
                          "word-text2-wb-unit7-p2-q1",

                          leftSelected || keyboardLeftSelected
                            ? "match-selected-wb-unit7-p2-q1"
                            : "",

                          matchLocked ? "match-locked-wb-unit7-p2-q1" : "",
                        ]
                          .join(" ")
                          .trim()}
                        onClick={() => {
                          playAudio(`left-match-${row.id}`, LEFT_AUDIO[row.id]);

                          if (!matchLocked) {
                            handleMatchClick("left", row.wordKey);
                          }
                        }}
                        onKeyDown={(e) =>
                          handleMatchKeyDown(
                            e,
                            "left",
                            row.wordKey,
                            LEFT_AUDIO[row.id],
                          )
                        }
                      >
                        {row.leftText}

                        {playingKey === `left-match-${row.id}` && (
                          <FaVolumeUp
                            size={14}
                            aria-hidden="true"
                            className="audio-corner-wb-unit7-p2-q1"
                          />
                        )}
                      </span>

                      {wrongWords.includes(row.wordKey) && (
                        <span
                          className="error-mark-review3-p1-q2"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}

                      <div className="dot-wrapper2">
                        <div
                          ref={(element) =>
                            registerDot(`left-${row.wordKey}`, element)
                          }
                          className={[
                            "dot2",
                            "start-dot2",

                            leftSelected || keyboardLeftSelected
                              ? "dot-selected-wb-unit7-p2-q1"
                              : "",
                          ]
                            .join(" ")
                            .trim()}
                          data-word={row.wordKey}
                          tabIndex={-1}
                          aria-hidden="true"
                          onClick={() => {
                            if (!matchLocked) {
                              handleMatchClick("left", row.wordKey);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* =================================================
                          WORD BANK
                      ================================================= */}

                    <div className="word-bank-wb-unit7-p2-q1">
                      {SCRAMBLED_WORDS[row.id].map((word) => (
                        <WordChip
                          key={word}
                          id={`bank-${row.id}-${word}`}
                          rowId={row.id}
                          text={word}
                          isUsed={usedWords[row.id].has(word)}
                          isDisabled={
                            sentenceLocked || showAnswer || checkCompleted
                          }
                          keyboardPickedWord={keyboardPickedWord}
                          onKeyboardPick={handleKeyboardPick}
                          bankRefs={bankRefs}
                        />
                      ))}
                    </div>

                    {/* =================================================
                          SENTENCE DROP ZONE
                      ================================================= */}

                    <SentenceDropZone
                      rowId={row.id}
                      words={userInputs[row.id]}
                      isLocked={sentenceLocked || showAnswer}
                      isWrong={wrongInputs.includes(String(row.id))}
                      keyboardPickedWord={keyboardPickedWord}
                      focusedDropId={focusedDropId}
                      setFocusedDropId={setFocusedDropId}
                      dropRefs={dropRefs}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardRemove={handleKeyboardRemove}
                      onReturn={handleReturn}
                      onCancel={cancelKeyboardDrag}
                      playAudio={playAudio}
                      playingKey={playingKey}
                    />
                  </div>

                  {/* =================================================
                        RIGHT MATCH SENTENCE
                    ================================================= */}

                  <div className="img-with-dot2-wb-unit7-p2-q1">
                    <div className="dot-wrapper2">
                      <div
                        ref={(element) =>
                          registerDot(`right-${row.rightImage}`, element)
                        }
                        className={[
                          "dot2",
                          "end-dot2",

                          rightSelected || keyboardRightSelected
                            ? "dot-selected-wb-unit7-p2-q1"
                            : "",
                        ]
                          .join(" ")
                          .trim()}
                        data-image={row.rightImage}
                        tabIndex={-1}
                        aria-hidden="true"
                        onClick={() => {
                          if (!rightLocked) {
                            handleMatchClick("right", row.rightImage);
                          }
                        }}
                      />
                    </div>

                    <p
                      ref={(element) => {
                        rightRefs.current[row.rightImage] = element;
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        rightLocked
                          ? `${row.rightText}. Press Enter or Space to hear it.`
                          : `${row.rightText}. Press Enter or Space to hear it and start matching.`
                      }
                      className={[
                        "matched-word-wb-unit7-p2-q1",

                        rightSelected || keyboardRightSelected
                          ? "match-selected-wb-unit7-p2-q1"
                          : "",

                        rightLocked ? "match-locked-wb-unit7-p2-q1" : "",
                      ]
                        .join(" ")
                        .trim()}
                      onFocus={() => {
                        if (
                          keyboardMatching &&
                          keyboardOrigin?.side === "left"
                        ) {
                          setFocusedMatchTarget(row.rightImage);

                          updatePreviewLine("right", row.rightImage);
                        }
                      }}
                      onClick={() => {
                        playAudio(
                          `right-match-${row.rightImage}`,
                          RIGHT_AUDIO[row.rightImage],
                        );

                        if (!rightLocked) {
                          handleMatchClick("right", row.rightImage);
                        }
                      }}
                      onKeyDown={(e) =>
                        handleMatchKeyDown(
                          e,
                          "right",
                          row.rightImage,
                          RIGHT_AUDIO[row.rightImage],
                        )
                      }
                    >
                      {row.rightText}

                      {playingKey === `right-match-${row.rightImage}` && (
                        <FaVolumeUp
                          size={14}
                          aria-hidden="true"
                          className="audio-corner-wb-unit7-p2-q1"
                        />
                      )}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* =================================================
                EXTRA FOCUS FOR LEFT TARGET WHEN MATCH STARTED RIGHT
            ================================================= */}

            {/*
              left text already has ref/onKeyDown.
              We update preview on focus below using capture.
            */}

            {/* =================================================
                SVG
            ================================================= */}

            <svg
              className="lines-layer2"
              style={{
                pointerEvents: "none",
              }}
            >
              {/* PERMANENT */}

              {svgLines.map((line, index) => (
                <line
                  key={`${line.word}-${line.image}-${index}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="red"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}

              {/* KEYBOARD PREVIEW */}

              {keyboardMatching && previewLine && (
                <line
                  x1={previewLine.x1}
                  y1={previewLine.y1}
                  x2={previewLine.x2}
                  y2={previewLine.y2}
                  stroke="red"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="action-buttons-container">
            <button className="try-again-button" onClick={handleReset}>
              Start Again ↻
            </button>

            <button
              className="show-answer-btn swal-continue"
              onClick={handleShowAnswer}
            >
              Show Answer
            </button>

            <button className="check-button2" onClick={checkAnswers}>
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeInfo && (
          <div
            className="word-box-wb-unit7-p2-q1"
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,.2)",

              cursor: "grabbing",

              background: "white",
            }}
          >
            {activeInfo.word}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page2_Q1;
