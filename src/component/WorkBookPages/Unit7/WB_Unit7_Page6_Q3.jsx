import "./WB_Unit7_Page6_Q3.css";

import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U7/U7P44EXEC-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P44EXEC-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P44EXEC-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P44EXEC-04.svg";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import waterAudio from "../../../assets/U1 WB/U7/audio/page 44- C/Item_001_water.mp3";
import windowAudio from "../../../assets/U1 WB/U7/audio/page 44- C/Item_002_window.mp3";
import hatAudio from "../../../assets/U1 WB/U7/audio/page 44- C/Item_003_hat.mp3";
import handAudio from "../../../assets/U1 WB/U7/audio/page 44- C/Item_004_hand.mp3";

import isOnMyAudio from "../../../assets/U1 WB/U7/audio/page 44- C/Item_005_a_is_on_my.mp3";
import myAudio from "../../../assets/U1 WB/U7/audio/page 44- C/Item_006_My.mp3";

import onTheAudio from "../../../assets/U1 WB/U7/audio/page 44- C/Item_008_on_the.mp3";
import thereIsAudio from "../../../assets/U1 WB/U7/audio/page 44- C/Item_009_There_is.mp3";
import full1 from "../../../assets/U1 WB/U7/audio/page 44- C/full1.mp3";
import full2 from "../../../assets/U1 WB/U7/audio/page 44- C/full2.mp3";

/* =====================================================
   WORD BANK
===================================================== */

const WORD_BANK = [
  {
    id: "w1",
    text: "hat",
    audio: hatAudio,
  },
  {
    id: "w2",
    text: "hand",
    audio: handAudio,
  },
  {
    id: "w3",
    text: "water",
    audio: waterAudio,
  },
  {
    id: "w4",
    text: "window",
    audio: windowAudio,
  },
];

/* =====================================================
   DATA
===================================================== */

const DATA = [
  {
    id: "sentence1",

    parts: [
      {
        before: "My",
        beforeAudio: myAudio,

        middleImg: img1,
        middleAlt: "A hat.",

        blankIndex: 0,

        after: "",
      },

      {
        before: "is on my",
        beforeAudio: isOnMyAudio,

        middleImg: img2,
        middleAlt: "An open hand.",

        blankIndex: 1,

        after: ".",
      },
    ],

    correct: ["hat", "hand"],

    fullAudio: [full1],

    fullText: "My hat is on my hand.",
  },

  {
    id: "sentence2",

    parts: [
      {
        before: "There is",
        beforeAudio: thereIsAudio,

        middleImg: img3,
        middleAlt: "A glass of water.",

        blankIndex: 0,

        after: "",
      },

      {
        before: "on the",
        beforeAudio: onTheAudio,

        middleImg: img4,
        middleAlt: "A window.",

        blankIndex: 1,

        after: ".",
      },
    ],

    correct: ["water", "window"],

    fullAudio: [full2],

    fullText: "There is water on the window.",
  },
];

/* =====================================================
   INITIAL ANSWERS
===================================================== */

const INITIAL_ANSWERS = DATA.reduce((acc, item, qIndex) => {
  item.correct.forEach((_, bIndex) => {
    acc[`${qIndex}-${bIndex}`] = null;
  });

  return acc;
}, {});

/* =====================================================
   HELPERS
===================================================== */

const getWordText = (id) =>
  WORD_BANK.find((word) => word.id === id)?.text || "";

/* =====================================================
   WORD CHIP
===================================================== */

const WordChip = ({
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
    id: item.id,

    data: {
      wordId: item.id,
    },

    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const keyboardSelected = keyboardPickedId === item.id;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(item.id, node);
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

      onPlayAudio(`bank-${item.id}`, item.audio);

      onKeyboardPick(item.id);
    }
  };

  return (
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
      aria-pressed={keyboardSelected}
      aria-label={
        keyboardSelected
          ? `${item.text} selected. Choose a blank and press Enter or Space.`
          : `${item.text}. Press Enter or Space to hear and select.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          صوت فقط

          Mouse drag:
          بدون صوت
        */

        onPlayAudio(`bank-${item.id}`, item.audio);
      }}
      style={{
        padding: "7px 14px",

        border: "2px solid #2c5287",

        borderRadius: 8,

        background: "white",

        fontWeight: "bold",

        fontSize: 15,

        cursor: unavailable ? "not-allowed" : isDragging ? "grabbing" : "grab",

        opacity: isUsed ? 0.35 : isDragging ? 0.5 : 1,

        userSelect: "none",

        touchAction: "none",

        transition: "opacity .2s",

        position: "relative",
      }}
    >
      {item.text}

      {playingKey === `bank-${item.id}` && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-wb-unit7-p6-q3" />
      )}
    </div>
  );
};

/* =====================================================
   FIXED AUDIO TEXT
===================================================== */

const FixedAudioText = ({
  text,

  audio,

  audioKey,

  playingKey,

  onPlay,

  disabled,
}) => {
  return (
    <span
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? -1 : 0}
      aria-label={disabled ? undefined : `Play audio: ${text}`}
      onClick={(e) => {
        if (disabled) return;

        e.stopPropagation();

        onPlay(audioKey, audio);
      }}
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onPlay(audioKey, audio);
        }
      }}
      className="fixed-audio-text-wb-unit7-p6-q3"
    >
      {text}

      {playingKey === audioKey && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-wb-unit7-p6-q3" />
      )}
    </span>
  );
};

/* =====================================================
   DROP BLANK
===================================================== */

const DropBlank = ({
  dropId,

  value,

  isWrong,

  isLocked,

  keyboardPickedId,

  keyboardFocusId,

  onKeyboardPlace,

  onKeyboardCancel,

  onMoveKeyboardFocus,

  onSlotFocus,

  onReturn,

  registerRef,

  forceTabIndex,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${dropId}`,

    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedId) && keyboardFocusId === dropId && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(dropId, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    /* =============================================
       TAB / SHIFT TAB
    ============================================== */

    if (keyboardPickedId && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(dropId, e.shiftKey);

      return;
    }

    /* =============================================
       ENTER / SPACE
    ============================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      if (keyboardPickedId) {
        onKeyboardPlace(dropId);

        return;
      }

      /*
        wrong/editable filled slot:
        رجعه للبنك
      */

      if (value) {
        onReturn(dropId);
      }

      return;
    }

    /* =============================================
       ESCAPE
    ============================================== */

    if (keyboardPickedId && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div className="input-wrapper-wb-unit7-p6-q3">
      <div
        ref={setRefs}
        role="button"
        tabIndex={
          forceTabIndex !== undefined
            ? forceTabIndex
            : isLocked
              ? -1
              : keyboardPickedId
                ? 0
                : value
                  ? 0
                  : -1
        }
        aria-disabled={isLocked}
        aria-label={
          isLocked
            ? `${value}. Correct answer. Locked.`
            : isKeyboardTarget
              ? "Blank. Press Enter or Space to place the selected word. Press Tab or Shift plus Tab to move between blanks."
              : value
                ? `${value}. Press Enter or Space to return this word to the word bank.`
                : "Empty blank. Select a word from the word bank first."
        }
        onFocus={() => {
          if (keyboardPickedId && !isLocked) {
            onSlotFocus(dropId);
          }
        }}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (isLocked) {
            return;
          }

          e.stopPropagation();

          if (value && !keyboardPickedId) {
            onReturn(dropId);
          }
        }}
        className={`
          missing-input-wb-unit7-p6-q3

          ${isOver ? "drag-over-cell" : ""}

          ${isKeyboardTarget ? "keyboard-drop-preview-wb-unit7-p6-q3" : ""}
        `}
        style={{
          display: "flex",

          alignItems: "center",

          cursor: value && !isLocked ? "pointer" : "default",

          transition: "background .15s",

          position: "relative",

          borderBottom: isWrong ? "2px solid #E24B4A" : undefined,
        }}
      >
        {/* REAL VALUE */}

        {value && !isKeyboardTarget && (
          <span className="drop-real-value-wb-unit7-p6-q3">{value}</span>
        )}

        {/* KEYBOARD PREVIEW */}

        {isKeyboardTarget && keyboardPickedId && (
          <span className="drop-preview-value-wb-unit7-p6-q3">
            {getWordText(keyboardPickedId)}
          </span>
        )}

        {/* WRONG X */}

        {isWrong && !isLocked && (
          <span className="wrong-icon-review4-p2-q1" aria-hidden="true">
            ✕
          </span>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit7_Page6_Q3 = () => {
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);

  const [wrongInputs, setWrongInputs] = useState([]);

  /*
    Progressive locking:
    الصحيح فقط
  */

  const [lockedInputs, setLockedInputs] = useState([]);

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

  const [keyboardFocusId, setKeyboardFocusId] = useState(null);

  const bankRefs = useRef({});

  const dropRefs = useRef({});

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

  const usedWordIds = new Set(Object.values(answers).filter(Boolean));

  const activeWord = WORD_BANK.find((word) => word.id === activeId);

  const isInputLocked = (dropKey) => lockedInputs.includes(dropKey);

  const editableDrops = () =>
    Object.keys(answers).filter((key) => !isInputLocked(key));

  const isDropCorrect = (qIndex, bIndex) => {
    const key = `${qIndex}-${bIndex}`;

    return getWordText(answers[key]) === DATA[qIndex].correct[bIndex];
  };

  const isSentenceCorrect = (qIndex) =>
    DATA[qIndex].correct.every((_, bIndex) => {
      const key = `${qIndex}-${bIndex}`;

      return isInputLocked(key) && isDropCorrect(qIndex, bIndex);
    });

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      if (typeof audioRef.current.pause === "function") {
        audioRef.current.pause();

        try {
          audioRef.current.currentTime = 0;
        } catch {
          // sequence controller
        }
      }

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playSingleAudio = (key, src) => {
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
     FULL SENTENCE AUDIO
  ===================================================== */

  const playSentenceAudio = (qIndex) => {
    const sentence = DATA[qIndex];

    if (!sentence) return;

    stopAudio();

    const key = `sentence-${qIndex}`;

    setPlayingKey(key);

    let cancelled = false;

    const controller = {
      currentAudio: null,

      pause() {
        cancelled = true;

        if (this.currentAudio) {
          this.currentAudio.pause();

          this.currentAudio.currentTime = 0;
        }
      },

      set currentTime(value) {
        if (this.currentAudio) {
          this.currentAudio.currentTime = value;
        }
      },
    };

    audioRef.current = controller;

    const playNext = (index) => {
      if (cancelled || index >= sentence.fullAudio.length) {
        if (audioRef.current === controller) {
          audioRef.current = null;

          setPlayingKey(null);
        }

        return;
      }

      const audio = new Audio(sentence.fullAudio[index]);

      controller.currentAudio = audio;

      audio.onended = () => playNext(index + 1);

      audio.onerror = () => playNext(index + 1);

      audio.play().catch(() => {
        playNext(index + 1);
      });
    };

    playNext(0);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current && typeof audioRef.current.pause === "function") {
        audioRef.current.pause();
      }
    };
  }, []);

  /* =====================================================
     REFS
  ===================================================== */

  const registerBankRef = (wordId, node) => {
    if (node) {
      bankRefs.current[wordId] = node;
    }
  };

  const registerDropRef = (dropId, node) => {
    if (node) {
      dropRefs.current[dropId] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (wordId) => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    setKeyboardPickedId(wordId);

    const available = editableDrops();

    if (!available.length) {
      return;
    }

    const firstDrop = available[0];

    setKeyboardFocusId(firstDrop);

    requestAnimationFrame(() => {
      dropRefs.current[firstDrop]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT TAB
  ===================================================== */

  const moveKeyboardFocus = (currentDrop, backwards = false) => {
    const available = editableDrops();

    if (!available.length) {
      return;
    }

    const currentIndex = available.indexOf(currentDrop);

    let nextIndex;

    if (backwards) {
      nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
    } else {
      nextIndex =
        currentIndex === -1 || currentIndex === available.length - 1
          ? 0
          : currentIndex + 1;
    }

    const nextDrop = available[nextIndex];

    setKeyboardFocusId(nextDrop);

    requestAnimationFrame(() => {
      dropRefs.current[nextDrop]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardWord = (dropKey) => {
    if (
      !keyboardPickedId ||
      isInputLocked(dropKey) ||
      showAnswerMode ||
      allCompleted
    ) {
      return;
    }

    const picked = keyboardPickedId;

    let updatedAnswers = null;

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      /*
          إذا الكلمة موجودة بمكان editable ثاني،
          انقلها.
        */

      Object.keys(updated).forEach((key) => {
        if (updated[key] === picked && key !== dropKey && !isInputLocked(key)) {
          updated[key] = null;
        }
      });

      updated[dropKey] = picked;

      updatedAnswers = updated;

      return updated;
    });

    /*
      تعديل نفس الفراغ:
      شيل X عنه فقط.
    */

    setWrongInputs((prev) => prev.filter((id) => id !== dropKey));

    setKeyboardPickedId(null);

    setKeyboardFocusId(null);

    requestAnimationFrame(() => {
      if (!updatedAnswers) {
        return;
      }

      const usedAfter = new Set(Object.values(updatedAnswers).filter(Boolean));

      const nextWord = WORD_BANK.find((word) => !usedAfter.has(word.id));

      if (nextWord) {
        bankRefs.current[nextWord.id]?.focus();
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

    setKeyboardFocusId(null);

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     RETURN TO BANK
  ===================================================== */

  const handleReturn = (dropKey) => {
    if (showAnswerMode || isInputLocked(dropKey)) {
      return;
    }

    const wordId = answers[dropKey];

    if (!wordId) return;

    setAnswers((prev) => ({
      ...prev,

      [dropKey]: null,
    }));

    setWrongInputs((prev) => prev.filter((id) => id !== dropKey));

    requestAnimationFrame(() => {
      bankRefs.current[wordId]?.focus();
    });
  };

  /* =====================================================
     DRAG START
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

    const destId = String(over.id);

    if (!destId.startsWith("drop-")) {
      return;
    }

    const dropKey = destId.replace("drop-", "");

    if (isInputLocked(dropKey)) {
      return;
    }

    const wordId = active.id;

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      const oldKey = Object.keys(updated).find(
        (key) => updated[key] === wordId,
      );

      if (oldKey && oldKey !== dropKey && !isInputLocked(oldKey)) {
        updated[oldKey] = null;
      }

      updated[dropKey] = wordId;

      return updated;
    });

    /*
      تعديل نفس الفراغ:
      شيل X عنه فقط
    */

    setWrongInputs((prev) => prev.filter((id) => id !== dropKey));
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    const hasEmpty = Object.keys(answers).some(
      (key) => !isInputLocked(key) && !answers[key],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    DATA.forEach((item, qIndex) => {
      item.correct.forEach((correctWord, bIndex) => {
        const key = `${qIndex}-${bIndex}`;

        if (isInputLocked(key)) {
          correctCount++;
          return;
        }

        const userText = getWordText(answers[key]);

        if (userText === correctWord) {
          correctCount++;

          newlyLocked.push(key);
        } else {
          wrong.push(key);
        }
      });
    });

    const nextLocked = [...new Set([...lockedInputs, ...newlyLocked])];

    setLockedInputs(nextLocked);

    setWrongInputs(wrong);

    setKeyboardPickedId(null);

    setKeyboardFocusId(null);

    const total = DATA.reduce((acc, item) => acc + item.correct.length, 0);

    const completed = correctCount === total;

    if (completed) {
      setLockedInputs(Object.keys(answers));

      setWrongInputs([]);

      setAllCompleted(true);
    }

    const color = completed ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
        <div style="font-size:20px;text-align:center">
          <span style="color:${color};font-weight:bold">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (completed) {
      ValidationAlert.success(msg);
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswer = () => {
    stopAudio();

    const filled = {};

    DATA.forEach((item, qIndex) => {
      item.correct.forEach((correctWord, bIndex) => {
        const word = WORD_BANK.find((w) => w.text === correctWord);

        filled[`${qIndex}-${bIndex}`] = word ? word.id : null;
      });
    });

    setAnswers(filled);

    setWrongInputs([]);

    setLockedInputs(Object.keys(filled));

    setShowAnswerMode(true);

    setAllCompleted(true);

    setKeyboardPickedId(null);

    setKeyboardFocusId(null);

    setActiveId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    stopAudio();

    setAnswers(INITIAL_ANSWERS);

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswerMode(false);

    setAllCompleted(false);

    setActiveId(null);

    setKeyboardPickedId(null);

    setKeyboardFocusId(null);
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
      <div className="page8-wrapper">
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="C"
            title="Look and write. Then say."
            subTitle="Use the pictures to place hat, hand, water, and window in the blanks."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: 12,

              padding: 12,

              border: "2px dashed #ccc",

              borderRadius: 10,

              marginBottom: 20,

              width: "100%",

              justifyContent: "center",
            }}
          >
            {WORD_BANK.map((word) => (
              <WordChip
                key={word.id}
                item={word}
                isUsed={usedWordIds.has(word.id)}
                disabled={showAnswerMode || allCompleted}
                keyboardPickedId={keyboardPickedId}
                onKeyboardPick={handleKeyboardPick}
                registerRef={registerBankRef}
                playingKey={playingKey}
                onPlayAudio={playSingleAudio}
              />
            ))}
          </div>

          {/* =================================================
              SENTENCES
          ================================================= */}

          {DATA.map((item, qIndex) => {
            const sentenceCorrect = isSentenceCorrect(qIndex);

            return (
              <div
                key={item.id}
                className={`
                    row-missing

                    ${
                      sentenceCorrect ? "completed-sentence-wb-unit7-p6-q3" : ""
                    }
                  `}
                role={sentenceCorrect ? "button" : undefined}
                tabIndex={sentenceCorrect ? 0 : undefined}
                aria-label={
                  sentenceCorrect
                    ? `Play complete sentence: ${item.fullText}`
                    : undefined
                }
                onClick={() => {
                  if (sentenceCorrect) {
                    playSentenceAudio(qIndex);
                  }
                }}
                onKeyDown={(e) => {
                  if (!sentenceCorrect) {
                    return;
                  }

                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();

                    playSentenceAudio(qIndex);
                  }
                }}
                style={{
                  position: "relative",
                }}
              >
                <span className="num">{qIndex + 1}.</span>

                <div className="sentence-review10-p2-q3">
                  {item.parts.map((part, bIndex) => {
                    const dropKey = `${qIndex}-${bIndex}`;

                    return (
                      <span
                        key={bIndex}
                        className="sentence-part"
                        style={{
                          display: "flex",

                          alignItems: "center",
                        }}
                      >
                        {/* FIXED TEXT AUDIO */}

                        <FixedAudioText
                          text={part.before}
                          audio={part.beforeAudio}
                          audioKey={`fixed-${qIndex}-${bIndex}`}
                          playingKey={playingKey}
                          onPlay={playSingleAudio}
                          disabled={sentenceCorrect}
                        />

                        {/* DROP */}

                        <DropBlank
                          dropId={dropKey}
                          value={getWordText(answers[dropKey])}
                          isWrong={wrongInputs.includes(dropKey)}
                          isLocked={isInputLocked(dropKey) || showAnswerMode}
                          keyboardPickedId={keyboardPickedId}
                          keyboardFocusId={keyboardFocusId}
                          onKeyboardPlace={placeKeyboardWord}
                          onKeyboardCancel={cancelKeyboardPick}
                          onMoveKeyboardFocus={moveKeyboardFocus}
                          onSlotFocus={setKeyboardFocusId}
                          onReturn={handleReturn}
                          registerRef={registerDropRef}
                          forceTabIndex={sentenceCorrect ? -1 : undefined}
                        />

                        {part.after}

                        {/* IMAGE */}

                        <img
                          src={part.middleImg}
                          className="middle-img"
                          alt={part.middleAlt}
                        />
                      </span>
                    );
                  })}
                </div>

                {/* FULL SENTENCE AUDIO ICON */}

                {sentenceCorrect && playingKey === `sentence-${qIndex}` && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="full-audio-icon-wb-unit7-p6-q3"
                  />
                )}
              </div>
            );
          })}
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
            onClick={showAnswer}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
          </button>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord && (
          <div className="mouse-drag-overlay-wb-unit7-p6-q3">
            {activeWord.text}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page6_Q3;
