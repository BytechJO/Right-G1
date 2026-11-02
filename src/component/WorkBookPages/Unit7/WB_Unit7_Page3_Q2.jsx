import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit7_Page3_Q2.css";

import img1 from "../../../assets/U1 WB/U7/U7P41EXEF-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P41EXEF-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P41EXEF-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P41EXEF-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

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

import happyAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_001_happy.mp3";
import hungryAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_002_hungry.mp3";
import areYouBoredAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_003_Are_you_bored.mp3";
import iAmAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_004_lam.mp3";
import areYouScaredAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_005_Are_you_scared.mp3";
import areYouSadAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_006_Are_you_sad.mp3";
import yesAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_007_Yes.mp3";
import yesIamAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_003_a_Yes,lam.mp3";
import noImNotImAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_008_No,_I'm_not._I'm.mp3";
import areYouAudio from "../../../assets/U1 WB/U7/audio/page 41- F/Item_009_Are_you.mp3";

/* =====================================================
   WORD BANK
===================================================== */

const WORD_BANK = [
  {
    id: "w1",
    text: "I am.",
    audio: iAmAudio,
  },
  {
    id: "w2",
    text: "happy?",
    audio: happyAudio,
  },
  {
    id: "w3",
    text: "hungry?",
    audio: hungryAudio,
  },
  {
    id: "w4",
    text: "Yes, I am.",
    audio: yesIamAudio,
  },
  {
    id: "w5",
    text: "Are you bored?",
    audio: areYouBoredAudio,
  },
  {
    id: "w6",
    text: "Yes, I am.",
    audio: yesIamAudio,
  },
];

/* =====================================================
   CORRECT ANSWERS
===================================================== */

const CORRECT_MAP = {
  input1: "w1",
  input2: "w2",
  input3: "w3",
  input4: "w4",
  input5: "w5",
  input6: "w6",
};

const INITIAL_ANSWERS = {
  input1: null,
  input2: null,
  input3: null,
  input4: null,
  input5: null,
  input6: null,
};

/* =====================================================
   SECTION AUDIO
===================================================== */

const SECTION_DATA = {
  section1: {
    inputs: ["input1"],

    audios: [areYouScaredAudio, yesAudio, iAmAudio],

    ariaText: "Are you scared? Yes, I am.",
  },

  section2: {
    inputs: ["input2"],

    audios: [areYouSadAudio, noImNotImAudio, happyAudio],

    ariaText: "Are you sad? No, I'm not. I'm happy.",
  },

  section3: {
    inputs: ["input3", "input4"],

    audios: [areYouAudio, hungryAudio, yesIamAudio],

    ariaText: "Are you hungry? Yes, I am.",
  },

  section4: {
    inputs: ["input5", "input6"],

    audios: [areYouBoredAudio, yesIamAudio],

    ariaText: "Are you bored? Yes, I am.",
  },
};

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

  const isKeyboardPicked = keyboardPickedId === item.id;

  const setRefs = (node) => {
    setNodeRef(node);

    registerRef(item.id, node);
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
      aria-pressed={isKeyboardPicked}
      aria-label={`${item.text}. Press Enter or Space to hear and select.`}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click = صوت فقط.
          Drag ما يشغل صوت.
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

        transition: "opacity .2s",

        touchAction: "none",

        alignSelf: "center",

        position: "relative",
      }}
    >
      {item.text}

      {playingKey === `bank-${item.id}` && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-wb-unit7-p3-q2" />
      )}
    </div>
  );
};

/* =====================================================
   DROP INPUT
===================================================== */

const DropInput = ({
  id,

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
    id: `drop-${id}`,

    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedId) && keyboardFocusId === id && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    registerRef(id, node);
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    /* =============================================
       TAB / SHIFT + TAB
    ============================================== */

    if (keyboardPickedId && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(id, e.shiftKey);

      return;
    }

    /* =============================================
       ENTER / SPACE
    ============================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      if (keyboardPickedId) {
        onKeyboardPlace(id);

        return;
      }

      if (value) {
        onReturn(id);
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
        isKeyboardTarget
          ? "Blank. Press Enter or Space to place the selected answer. Use Tab or Shift plus Tab to move between blanks."
          : value
            ? `${value}. Press Enter or Space to return it to the word bank.`
            : "Empty blank. Select a word from the word bank first."
      }
      className={`
        answer-input-wb-unit7-p3-q2

        ${isOver ? "drag-over-cell" : ""}

        ${isKeyboardTarget ? "keyboard-drop-preview-wb-unit7-p3-q2" : ""}
      `}
      onFocus={() => {
        if (keyboardPickedId && !isLocked) {
          onSlotFocus(id);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isLocked) {
          return;
        }

        e.stopPropagation();

        if (value && !keyboardPickedId) {
          onReturn(id);
        }
      }}
    >
      {/* REAL VALUE */}

      {value && !isKeyboardTarget && (
        <span className="drop-real-value-wb-unit7-p3-q2">{value}</span>
      )}

      {/* KEYBOARD PREVIEW */}

      {isKeyboardTarget && keyboardPickedId && (
        <span className="drop-preview-value-wb-unit7-p3-q2">
          {WORD_BANK.find((word) => word.id === keyboardPickedId)?.text}
        </span>
      )}

      {/* WRONG */}

      {isWrong && !isLocked && (
        <span className="error-mark-input1" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   FIXED AUDIO TEXT
===================================================== */

const FixedAudioText = ({
  text,
  src,

  audioKey,
  playingKey,

  onPlay,

  disabled = false,

  className = "",

  style,
}) => {
  return (
    <div
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? -1 : 0}
      aria-label={disabled ? undefined : `Play audio: ${text}`}
      className={className}
      onClick={(e) => {
        if (disabled) {
          return;
        }

        e.stopPropagation();

        onPlay(audioKey, src);
      }}
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onPlay(audioKey, src);
        }
      }}
      style={{
        position: "relative",

        ...style,
      }}
    >
      {text}

      {playingKey === audioKey && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-wb-unit7-p3-q2" />
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit7_Page3_Q2 = () => {
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);

  const [wrongWords, setWrongWords] = useState([]);

  /*
    Progressive locking
  */

  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

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

  const getTextById = (id) => WORD_BANK.find((w) => w.id === id)?.text || "";

  const usedWordIds = new Set(Object.values(answers).filter(Boolean));

  const activeWord = WORD_BANK.find((w) => w.id === activeId);

  const isInputLocked = (inputId) => lockedInputs.includes(inputId);

  const editableInputs = () =>
    Object.keys(CORRECT_MAP).filter((id) => !isInputLocked(id));

  const isInputCorrect = (inputId) => {
    const value = answers[inputId];

    if (!value) return false;

    return (
      getTextById(value).trim().toLowerCase() ===
      getTextById(CORRECT_MAP[inputId]).trim().toLowerCase()
    );
  };

  const isSectionCorrect = (sectionId) => {
    const section = SECTION_DATA[sectionId];

    return section.inputs.every(
      (inputId) => isInputLocked(inputId) && isInputCorrect(inputId),
    );
  };

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
     FULL SECTION AUDIO
  ===================================================== */

  const playSectionAudio = (sectionId) => {
    const section = SECTION_DATA[sectionId];

    if (!section) return;

    stopAudio();

    const key = `section-${sectionId}`;

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
      if (cancelled || index >= section.audios.length) {
        if (audioRef.current === controller) {
          audioRef.current = null;

          setPlayingKey(null);
        }

        return;
      }

      const audio = new Audio(section.audios[index]);

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

  const registerBankRef = (id, node) => {
    if (node) {
      bankRefs.current[id] = node;
    }
  };

  const registerDropRef = (id, node) => {
    if (node) {
      dropRefs.current[id] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (wordId) => {
    if (showAnswer || allCompleted) {
      return;
    }

    setKeyboardPickedId(wordId);

    const available = editableInputs();

    if (!available.length) {
      return;
    }

    const firstId = available[0];

    setKeyboardFocusId(firstId);

    requestAnimationFrame(() => {
      dropRefs.current[firstId]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT+TAB
  ===================================================== */

  const moveKeyboardFocus = (currentId, backwards = false) => {
    const available = editableInputs();

    if (!available.length) {
      return;
    }

    const currentIndex = available.indexOf(currentId);

    let nextIndex;

    if (backwards) {
      nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
    } else {
      nextIndex =
        currentIndex === -1 || currentIndex === available.length - 1
          ? 0
          : currentIndex + 1;
    }

    const nextId = available[nextIndex];

    setKeyboardFocusId(nextId);

    requestAnimationFrame(() => {
      dropRefs.current[nextId]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardWord = (inputId) => {
    if (
      !keyboardPickedId ||
      isInputLocked(inputId) ||
      showAnswer ||
      allCompleted
    ) {
      return;
    }

    const picked = keyboardPickedId;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      Object.keys(updated).forEach((key) => {
        if (updated[key] === picked && key !== inputId && !isInputLocked(key)) {
          updated[key] = null;
        }
      });

      updated[inputId] = picked;

      nextAnswers = updated;

      return updated;
    });

    /*
      تعديل نفس السؤال
      يشيل X عنه فقط.
    */

    setWrongWords((prev) => prev.filter((id) => id !== inputId));

    setKeyboardPickedId(null);

    setKeyboardFocusId(null);

    requestAnimationFrame(() => {
      if (!nextAnswers) return;

      const usedAfter = new Set(Object.values(nextAnswers).filter(Boolean));

      const nextWord = WORD_BANK.find((word) => !usedAfter.has(word.id));

      if (nextWord) {
        bankRefs.current[nextWord.id]?.focus();
      }
    });
  };

  /* =====================================================
     CANCEL PICK
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

  const handleReturn = (inputId) => {
    if (isInputLocked(inputId) || showAnswer) {
      return;
    }

    const wordId = answers[inputId];

    if (!wordId) return;

    setAnswers((prev) => ({
      ...prev,

      [inputId]: null,
    }));

    setWrongWords((prev) => prev.filter((id) => id !== inputId));

    requestAnimationFrame(() => {
      bankRefs.current[wordId]?.focus();
    });
  };

  /* =====================================================
     DRAG START
     بدون صوت
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswer || allCompleted) {
      return;
    }

    setActiveId(active.id);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || allCompleted) {
      return;
    }

    const dropId = String(over.id);

    if (!dropId.startsWith("drop-")) {
      return;
    }

    const inputId = dropId.replace("drop-", "");

    if (isInputLocked(inputId)) {
      return;
    }

    const wordId = active.id;

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      const oldInput = Object.keys(updated).find(
        (key) => updated[key] === wordId,
      );

      if (oldInput && oldInput !== inputId && !isInputLocked(oldInput)) {
        updated[oldInput] = null;
      }

      updated[inputId] = wordId;

      return updated;
    });

    setWrongWords((prev) => prev.filter((id) => id !== inputId));
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || allCompleted) {
      return;
    }

    const hasEmpty = Object.keys(CORRECT_MAP).some(
      (inputId) => !isInputLocked(inputId) && !answers[inputId],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    Object.keys(CORRECT_MAP).forEach((inputId) => {
      if (isInputLocked(inputId)) {
        correctCount++;
        return;
      }

      if (isInputCorrect(inputId)) {
        correctCount++;

        newlyLocked.push(inputId);
      } else {
        wrong.push(inputId);
      }
    });

    const nextLocked = [...new Set([...lockedInputs, ...newlyLocked])];

    setLockedInputs(nextLocked);

    setWrongWords(wrong);

    setKeyboardPickedId(null);

    setKeyboardFocusId(null);

    const total = Object.keys(CORRECT_MAP).length;

    const completed = correctCount === total;

    if (completed) {
      setLockedInputs(Object.keys(CORRECT_MAP));

      setWrongWords([]);

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

  const showAnswers = () => {
    stopAudio();

    setAnswers({
      input1: "w1",
      input2: "w2",
      input3: "w3",
      input4: "w4",
      input5: "w5",
      input6: "w6",
    });

    setWrongWords([]);

    setLockedInputs(Object.keys(CORRECT_MAP));

    setShowAnswer(true);

    setAllCompleted(true);

    setKeyboardPickedId(null);

    setKeyboardFocusId(null);

    setActiveId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const startAgain = () => {
    stopAudio();

    setAnswers(INITIAL_ANSWERS);

    setWrongWords([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setAllCompleted(false);

    setActiveId(null);

    setKeyboardPickedId(null);

    setKeyboardFocusId(null);
  };

  /* =====================================================
     DROP HELPER
  ===================================================== */

  const dz = (id, sectionCorrect) => (
    <DropInput
      id={id}
      value={getTextById(answers[id])}
      isWrong={wrongWords.includes(id)}
      isLocked={isInputLocked(id) || showAnswer}
      keyboardPickedId={keyboardPickedId}
      keyboardFocusId={keyboardFocusId}
      onKeyboardPlace={placeKeyboardWord}
      onKeyboardCancel={cancelKeyboardPick}
      onMoveKeyboardFocus={moveKeyboardFocus}
      onSlotFocus={setKeyboardFocusId}
      onReturn={handleReturn}
      registerRef={registerDropRef}
      forceTabIndex={sectionCorrect ? -1 : undefined}
    />
  );

  /* =====================================================
     SECTION PROPS
  ===================================================== */

  const makeSectionProps = (sectionId) => {
    const correct = isSectionCorrect(sectionId);

    const section = SECTION_DATA[sectionId];

    return {
      correct,

      role: correct ? "button" : undefined,

      tabIndex: correct ? 0 : undefined,

      "aria-label": correct
        ? `Play complete audio: ${section.ariaText}`
        : undefined,

      onClick: correct ? () => playSectionAudio(sectionId) : undefined,

      onKeyDown: correct
        ? (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              playSectionAudio(sectionId);
            }
          }
        : undefined,
    };
  };

  const s1 = makeSectionProps("section1");

  const s2 = makeSectionProps("section2");

  const s3 = makeSectionProps("section3");

  const s4 = makeSectionProps("section4");

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
          alignItems: "center",
          padding: 30,
        }}
      >
        <div
          className="div-forall mb-20"
          style={{
            gap: 30,
          }}
        >
          <div className="unit2-page9-q1-container">
            <ExerciseHeader
              sectionLetter="F"
              title="Look, read, and write."
              subTitle="Use the picture to drag the missing feeling, question, or answer into place."
            />

            {/* =================================================
                WORD BANK
            ================================================= */}

            <div
              style={{
                display: "flex",
                gap: 12,
                padding: 12,
                height: 70,
                width: "100%",
                border: "2px dashed #ccc",
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              {WORD_BANK.map((item) => (
                <WordChip
                  key={item.id}
                  item={item}
                  isUsed={usedWordIds.has(item.id)}
                  disabled={showAnswer || allCompleted}
                  keyboardPickedId={keyboardPickedId}
                  onKeyboardPick={handleKeyboardPick}
                  registerRef={registerBankRef}
                  playingKey={playingKey}
                  onPlayAudio={playAudio}
                />
              ))}
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="content-container-wb-unit6-p4-q2">
              {/* =================================================
                  SECTION 1
              ================================================= */}

              <div
                className={`section-one-wb-unit6-p4-q2 ${
                  s1.correct ? "completed-section-wb-unit7-p3-q2" : ""
                }`}
                role={s1.role}
                tabIndex={s1.tabIndex}
                aria-label={s1["aria-label"]}
                onClick={s1.onClick}
                onKeyDown={s1.onKeyDown}
              >
                <div className="img-container-wb-unit6-p4-q2">
                  <span className="wb-unit7-p3-q2-number">1</span>

                  <FixedAudioText
                    text="Are you scared?"
                    src={areYouScaredAudio}
                    audioKey="fixed-scared"
                    playingKey={playingKey}
                    onPlay={playAudio}
                    disabled={s1.correct}
                    className="fixed-line-wb-unit7-p3-q2"
                  />
                </div>

                <div className="content-input-wb-unit7-p3-q2">
                  <img
                    src={img1}
                    alt="A frightened girl kneeling on the grass and looking at a spider."
                    className="img-wb-unit6-p4-q2"
                  />

                  <div className="answer-line-wb-unit7-p3-q2">
                    <FixedAudioText
                      text="Yes,"
                      src={yesAudio}
                      audioKey="fixed-yes"
                      playingKey={playingKey}
                      onPlay={playAudio}
                      disabled={s1.correct}
                      className="answer-prefix-wb-unit7-p3-q2"
                    />

                    {dz("input1", s1.correct)}
                  </div>
                </div>

                {s1.correct && playingKey === "section-section1" && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="full-audio-icon-wb-unit7-p3-q2"
                  />
                )}
              </div>

              {/* =================================================
                  SECTION 2
              ================================================= */}

              <div
                className={`section-two-wb-unit6-p4-q2 ${
                  s2.correct ? "completed-section-wb-unit7-p3-q2" : ""
                }`}
                role={s2.role}
                tabIndex={s2.tabIndex}
                aria-label={s2["aria-label"]}
                onClick={s2.onClick}
                onKeyDown={s2.onKeyDown}
              >
                <div className="img-container-wb-unit6-p4-q2">
                  <span className="wb-unit7-p3-q2-number">2</span>

                  <FixedAudioText
                    text="Are you sad?"
                    src={areYouSadAudio}
                    audioKey="fixed-sad"
                    playingKey={playingKey}
                    onPlay={playAudio}
                    disabled={s2.correct}
                    className="fixed-line-wb-unit7-p3-q2"
                  />
                </div>

                <div className="content-input-unit5-p6-q1">
                  <img
                    src={img2}
                    alt="A smiling boy reaching toward a colorful ball."
                    className="img-wb-unit6-p4-q2"
                  />

                  <div className="answer-line-wb-unit7-p3-q2">
                    <FixedAudioText
                      text="No, I'm not. I'm"
                      src={noImNotImAudio}
                      audioKey="fixed-no-im"
                      playingKey={playingKey}
                      onPlay={playAudio}
                      disabled={s2.correct}
                      className="answer-prefix-long-wb-unit7-p3-q2"
                    />

                    {dz("input2", s2.correct)}
                  </div>
                </div>

                {s2.correct && playingKey === "section-section2" && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="full-audio-icon-wb-unit7-p3-q2"
                  />
                )}
              </div>

              {/* =================================================
                  SECTION 3
              ================================================= */}

              <div
                className={`section-three-wb-unit6-p4-q2 ${
                  s3.correct ? "completed-section-wb-unit7-p3-q2" : ""
                }`}
                role={s3.role}
                tabIndex={s3.tabIndex}
                aria-label={s3["aria-label"]}
                onClick={s3.onClick}
                onKeyDown={s3.onKeyDown}
              >
                <div className="img-container-wb-unit6-p4-q2">
                  <span className="wb-unit7-p3-q2-number">3</span>

                  <div className="answer-line-wb-unit7-p3-q2">
                    <FixedAudioText
                      text="Are you"
                      src={areYouAudio}
                      audioKey="fixed-are-you"
                      playingKey={playingKey}
                      onPlay={playAudio}
                      disabled={s3.correct}
                      className="answer-prefix-wb-unit7-p3-q2"
                    />

                    {dz("input3", s3.correct)}
                  </div>
                </div>

                <div className="content-input-unit5-p6-q1">
                  <img
                    src={img3}
                    alt="A boy thinking about food and looking hungry."
                    className="img-wb-unit6-p4-q2"
                  />

                  <div className="standalone-drop-line-wb-unit7-p3-q2">
                    {dz("input4", s3.correct)}
                  </div>
                </div>

                {s3.correct && playingKey === "section-section3" && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="full-audio-icon-wb-unit7-p3-q2"
                  />
                )}
              </div>

              {/* =================================================
                  SECTION 4
              ================================================= */}

              <div
                className={`section-four-wb-unit6-p4-q2 ${
                  s4.correct ? "completed-section-wb-unit7-p3-q2" : ""
                }`}
                role={s4.role}
                tabIndex={s4.tabIndex}
                aria-label={s4["aria-label"]}
                onClick={s4.onClick}
                onKeyDown={s4.onKeyDown}
              >
                <div className="img-container-wb-unit6-p4-q2">
                  <span className="wb-unit7-p3-q2-number">4</span>

                  <div className="standalone-drop-line-wb-unit7-p3-q2">
                    {dz("input5", s4.correct)}
                  </div>
                </div>

                <div className="content-input-unit5-p6-q1">
                  <img
                    src={img4}
                    alt="A tired-looking boy sitting on a bench outdoors."
                    className="img-wb-unit6-p4-q2"
                  />

                  <div className="standalone-drop-line-wb-unit7-p3-q2">
                    {dz("input6", s4.correct)}
                  </div>
                </div>

                {s4.correct && playingKey === "section-section4" && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="full-audio-icon-wb-unit7-p3-q2"
                  />
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="action-buttons-container">
            <button onClick={startAgain} className="try-again-button">
              Start Again ↻
            </button>

            <button
              className="show-answer-btn swal-continue"
              onClick={showAnswers}
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
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
          <div className="mouse-drag-overlay-wb-unit7-p3-q2">
            {activeWord.text}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page3_Q2;
