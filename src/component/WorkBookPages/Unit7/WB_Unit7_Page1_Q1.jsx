import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";

import img1 from "../../../assets/U1 WB/U7/U7P39EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P39EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P39EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P39EXEA-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import IAmAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_001_I_am.mp3";
import IAmNotAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_002_I_am_not.mp3";
import YouColdAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_003_you_cold.mp3";
import YesIAmAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_004_Yes,_I_am.mp3";
import AreYouScaredAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_005_Are_you_scared.mp3";
import AreYouBoredAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_006_Are_you_bored.mp3";
import AreYouColdAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_007_Are_you_cold.mp3";
import NoAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_008_No,.mp3";
import AreAudio from "../../../assets/U1 WB/U7/audio/page 39 - A/Item_009_Are.mp3";
import "./WB_Unit7_Page1_Q1.css";

/* =====================================================
   DATA
===================================================== */

const words = [
  {
    id: "w0",
    text: "I am",
    audio: IAmAudio,
  },
  {
    id: "w1",
    text: "I am not",
    audio: IAmNotAudio,
  },
  {
    id: "w2",
    text: "you cold?",
    audio: YouColdAudio,
  },
  {
    id: "w3",
    text: "Yes, I am",
    audio: YesIAmAudio,
  },
  {
    id: "w4",
    text: "Are you scared?",
    audio: AreYouScaredAudio,
  },
  {
    id: "w5",
    text: "Yes, I am",
    audio: YesIAmAudio,
  },
];

const correctAnswers = {
  input1: "I am",
  input2: "I am not",
  input3: "you cold?",
  input4: "Yes, I am",
  input5: "Are you scared?",
  input6: "Yes, I am",
};

/* =====================================================
   SECTIONS
===================================================== */

const sections = {
  section1: {
    inputs: ["input1"],

    audios: [AreYouBoredAudio, YesIAmAudio],
  },

  section2: {
    inputs: ["input2"],

    audios: [AreYouColdAudio, NoAudio, IAmNotAudio],
  },

  section3: {
    inputs: ["input3", "input4"],

    audios: [AreAudio, YouColdAudio, YesIAmAudio],
  },

  section4: {
    inputs: ["input5", "input6"],

    audios: [AreYouScaredAudio, YesIAmAudio],
  },
};

/* =====================================================
   WORD CHIP
===================================================== */

const WordChip = ({
  id,
  text,
  audio,

  isUsed,
  isDisabled,

  keyboardPickedId,
  onKeyboardPick,

  registerRef,

  isPlaying,
  onPlayAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    data: {
      wordId: id,
    },

    disabled: isUsed || isDisabled,
  });

  const unavailable = isUsed || isDisabled;

  const keyboardSelected = keyboardPickedId === id;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(id, node);
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

      onPlayAudio(`bank-${id}`, audio);

      onKeyboardPick(id);
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
          ? `${text} selected. Choose a blank and press Enter or Space.`
          : `${text}. Press Enter or Space to hear and select.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          صوت فقط.

          السحب ما يشغل صوت.
        */

        onPlayAudio(`bank-${id}`, audio);
      }}
      style={{
        padding: "2px 10px",

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

        position: "relative",
      }}
    >
      {text}

      {isPlaying && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-wb-unit6-p4-q2" />
      )}
    </div>
  );
};

/* =====================================================
   DROP ZONE
===================================================== */

const DropZone = ({
  id,

  inputId,

  value,

  isWrong,
  isLocked,

  keyboardPickedId,
  keyboardFocusInput,

  onKeyboardPlace,
  onKeyboardCancel,

  onMoveKeyboardFocus,

  onFocusSlot,

  onReturn,

  registerRef,

  forceTabIndex,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedId) && keyboardFocusInput === inputId && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(inputId, node);
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

      onMoveKeyboardFocus(inputId, e.shiftKey);

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
        حطها أو استبدل الموجود.
      */

      if (keyboardPickedId) {
        onKeyboardPlace(inputId);

        return;
      }

      /*
        filled editable slot:
        رجعه للبنك.
      */

      if (value) {
        onReturn(inputId);
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
            ? `Blank. Press Enter or Space to place the selected answer. Press Tab or Shift plus Tab to move between blanks.`
            : value
              ? `${value}. Press Enter or Space to return this answer to the word bank.`
              : "Empty blank. Select an answer from the word bank first."
      }
      className={`
        answer-input-wb-unit6-p4-q2

        ${isOver ? "drag-over-cell" : ""}

        ${isKeyboardTarget ? "keyboard-drop-preview-wb-unit6-p4-q2" : ""}
      `}
      onFocus={() => {
        if (keyboardPickedId && !isLocked) {
          onFocusSlot(inputId);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isLocked) {
          return;
        }

        e.stopPropagation();

        if (value && !keyboardPickedId) {
          onReturn(inputId);
        }
      }}
      style={{
        /*
          مهم:
          منطقة الـdrop أكبر من الخط نفسه
          عشان dnd-kit يمسكها بسهولة.
        */

        minWidth: "80%",

        width: "100%",

        minHeight: 38,

        borderBottom: "2px solid #333",

        display: "inline-flex",

        alignItems: "center",

        padding: "5px 8px",

        boxSizing: "border-box",

        fontSize: 18,

        borderRadius: "4px 4px 0 0",

        cursor: value && !isLocked ? "pointer" : "default",

        position: "relative",

        transition: "background .15s",

        pointerEvents: "auto",
      }}
    >
      {/* =================================================
          REAL VALUE
      ================================================= */}

      {value && !isKeyboardTarget && (
        <span className="drop-real-value-wb-unit6-p4-q2">{value}</span>
      )}

      {/* =================================================
          KEYBOARD PREVIEW
      ================================================= */}

      {isKeyboardTarget && keyboardPickedId && (
        <span className="drop-preview-value-wb-unit6-p4-q2">
          {words.find((w) => w.id === keyboardPickedId)?.text}
        </span>
      )}

      {/* =================================================
          WRONG X
      ================================================= */}

      {isWrong && !isLocked && (
        <span
          className="unit6-p1-q1-wrong-icon error-mark-input1"
          aria-hidden="true"
          style={{
            right: -18,
          }}
        >
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

  audio,

  audioKey,

  isPlaying,

  onPlay,

  disabled = false,

  style,
}) => {
  return (
    <div
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? -1 : 0}
      aria-label={disabled ? undefined : `Play audio: ${text}`}
      onClick={(e) => {
        if (disabled) {
          return;
        }

        e.stopPropagation();

        onPlay(audioKey, audio);
      }}
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onPlay(audioKey, audio);
        }
      }}
      style={{
        position: "relative",

        width: "100%",

        ...style,
      }}
    >
      <input
        type="text"
        value={text}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        style={{
          borderBottom: "2px solid black",

          width: "100%",

          fontSize: 20,

          pointerEvents: "none",
        }}
      />

      {isPlaying && (
        <FaVolumeUp
          aria-hidden="true"
          style={{
            position: "absolute",

            top: "-8px",

            right: "-8px",

            width: "14px",

            height: "14px",

            pointerEvents: "none",

            zIndex: 5,
          }}
        />
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit7_Page1_Q1 = () => {
  /* =====================================================
     ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState({});

  const [wrongIds, setWrongIds] = useState([]);

  /* =====================================================
     PROGRESSIVE LOCKING
  ===================================================== */

  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedId, setKeyboardPickedId] = useState(null);

  const [keyboardFocusInput, setKeyboardFocusInput] = useState(null);

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingAudioKey, setPlayingAudioKey] = useState(null);

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

  const usedWordIds = new Set(Object.values(answers).filter(Boolean));

  const activeWord = words.find((w) => w.id === activeId);

  const isInputLocked = (inputId) => lockedInputs.includes(inputId);

  const editableInputs = () =>
    Object.keys(correctAnswers).filter((inputId) => !isInputLocked(inputId));

  const getWordText = (wordId) =>
    words.find((w) => w.id === wordId)?.text || "";

  const isInputCorrect = (inputId) => {
    const wordId = answers[inputId];

    const text = getWordText(wordId);

    return (
      text.trim().toLowerCase() === correctAnswers[inputId].trim().toLowerCase()
    );
  };

  const isSectionComplete = (sectionId) => {
    const section = sections[sectionId];

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

    setPlayingAudioKey(null);
  };

  const playSingleAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingAudioKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioKey(null);
    };

    audio.onerror = audio.onended;
  };

  /* =====================================================
     FULL SECTION AUDIO
  ===================================================== */

  const playSectionAudio = (sectionId) => {
    const section = sections[sectionId];

    if (!section) return;

    stopAudio();

    const key = `section-${sectionId}`;

    setPlayingAudioKey(key);

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

          setPlayingAudioKey(null);
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

  const registerBankRef = (wordId, node) => {
    if (node) {
      bankRefs.current[wordId] = node;
    }
  };

  const registerDropRef = (inputId, node) => {
    if (node) {
      dropRefs.current[inputId] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (wordId) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedId(wordId);

    const available = editableInputs();

    if (!available.length) {
      return;
    }

    const firstInput = available[0];

    setKeyboardFocusInput(firstInput);

    requestAnimationFrame(() => {
      dropRefs.current[firstInput]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT+TAB BETWEEN DROPS
  ===================================================== */

  const moveKeyboardFocus = (currentInput, backwards = false) => {
    const available = editableInputs();

    if (!available.length) {
      return;
    }

    const currentPosition = available.indexOf(currentInput);

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

    const nextInput = available[nextPosition];

    setKeyboardFocusInput(nextInput);

    requestAnimationFrame(() => {
      dropRefs.current[nextInput]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardWord = (inputId) => {
    if (
      !keyboardPickedId ||
      showAnswer ||
      checkCompleted ||
      isInputLocked(inputId)
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
          لو نفس word id موجود
          بdrop ثاني editable:
          انقله.
        */

      Object.keys(updated).forEach((key) => {
        if (updated[key] === picked && key !== inputId && !isInputLocked(key)) {
          updated[key] = null;
        }
      });

      updated[inputId] = picked;

      updatedAnswers = updated;

      return updated;
    });

    /*
      تعديل نفس الخانة:
      شيل X عنها فقط.
    */

    setWrongIds((prev) => prev.filter((id) => id !== inputId));

    setKeyboardPickedId(null);

    setKeyboardFocusInput(null);

    /*
      رجع لأول bank option متاح.
    */

    requestAnimationFrame(() => {
      if (!updatedAnswers) {
        return;
      }

      const usedAfter = new Set(Object.values(updatedAnswers).filter(Boolean));

      const nextWord = words.find((word) => !usedAfter.has(word.id));

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

    setKeyboardFocusInput(null);

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     RETURN TO BANK
  ===================================================== */

  const returnToBank = (inputId) => {
    if (showAnswer || isInputLocked(inputId)) {
      return;
    }

    const wordId = answers[inputId];

    if (!wordId) return;

    setAnswers((prev) => ({
      ...prev,

      [inputId]: null,
    }));

    setWrongIds((prev) => prev.filter((id) => id !== inputId));

    requestAnimationFrame(() => {
      bankRefs.current[wordId]?.focus();
    });
  };

  /* =====================================================
     DRAG START
     السحب ما يشغل صوت
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setActiveId(active.id);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveId(null);

      if (!over || showAnswer || checkCompleted) {
        return;
      }

      const droppableId = String(over.id);

      if (!droppableId.startsWith("drop-")) {
        return;
      }

      const inputId = droppableId.replace("drop-", "");

      if (isInputLocked(inputId)) {
        return;
      }

      const wordId = active.id;

      setAnswers((prev) => {
        const updated = {
          ...prev,
        };

        /*
              لو الكلمة موجودة
              بdrop ثاني:
              شيلها من هناك.
            */

        const oldDrop = Object.keys(updated).find(
          (key) => updated[key] === wordId,
        );

        if (oldDrop && oldDrop !== inputId && !isInputLocked(oldDrop)) {
          updated[oldDrop] = null;
        }

        /*
              استبدل الموجود بالtarget.
            */

        updated[inputId] = wordId;

        return updated;
      });

      /*
          تعديل نفس target:
          يشيل X عنه فقط.
        */

      setWrongIds((prev) => prev.filter((id) => id !== inputId));
    },
    [showAnswer, checkCompleted, lockedInputs],
  );

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const hasEmpty = Object.keys(correctAnswers).some(
      (inputId) => !answers[inputId],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    Object.entries(correctAnswers).forEach(([inputId, correctText]) => {
      const wordId = answers[inputId];

      const word = words.find((w) => w.id === wordId);

      const correct =
        word &&
        word.text.trim().toLowerCase() === correctText.trim().toLowerCase();

      if (correct) {
        correctCount++;

        newlyLocked.push(inputId);
      } else {
        wrong.push(inputId);
      }
    });

    setLockedInputs((prev) => [...new Set([...prev, ...newlyLocked])]);

    setWrongIds(wrong);

    setKeyboardPickedId(null);

    setKeyboardFocusInput(null);

    const total = Object.keys(correctAnswers).length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center">
          <span style="color:${color};font-weight:bold">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (correctCount === total) {
      setLockedInputs(Object.keys(correctAnswers));

      setWrongIds([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWERS
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    const filled = {};

    const wordPool = [...words];

    Object.entries(correctAnswers).forEach(([inputId, text]) => {
      const word = wordPool.find(
        (w) => w.text === text && !Object.values(filled).includes(w.id),
      );

      if (word) {
        filled[inputId] = word.id;
      }
    });

    setAnswers(filled);

    setWrongIds([]);

    setLockedInputs(Object.keys(correctAnswers));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedId(null);

    setKeyboardFocusInput(null);

    setActiveId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongIds([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedId(null);

    setKeyboardFocusInput(null);
  };

  /* =====================================================
     DROP HELPER
  ===================================================== */

  const dz = (inputId, sectionComplete) => (
    <DropZone
      id={`drop-${inputId}`}
      inputId={inputId}
      value={getWordText(answers[inputId])}
      isWrong={wrongIds.includes(inputId)}
      isLocked={isInputLocked(inputId) || showAnswer}
      keyboardPickedId={keyboardPickedId}
      keyboardFocusInput={keyboardFocusInput}
      onKeyboardPlace={placeKeyboardWord}
      onKeyboardCancel={cancelKeyboardPick}
      onMoveKeyboardFocus={moveKeyboardFocus}
      onFocusSlot={(id) => setKeyboardFocusInput(id)}
      onReturn={returnToBank}
      registerRef={registerDropRef}
      forceTabIndex={sectionComplete ? -1 : undefined}
    />
  );

  /* =====================================================
     SECTION PROPS
  ===================================================== */

  const sectionProps = (sectionId) => {
    const complete = isSectionComplete(sectionId);

    return {
      complete,

      props: {
        role: complete ? "button" : undefined,

        tabIndex: complete ? 0 : undefined,

        "aria-label": complete
          ? `Play complete dialogue for ${sectionId}`
          : undefined,

        onClick: complete ? () => playSectionAudio(sectionId) : undefined,

        onKeyDown: complete
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();

                playSectionAudio(sectionId);
              }
            }
          : undefined,

        style: {
          position: "relative",
        },
      },
    };
  };

  const s1 = sectionProps("section1");

  const s2 = sectionProps("section2");

  const s3 = sectionProps("section3");

  const s4 = sectionProps("section4");

  /* =====================================================
     JSX
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
            gap: 20,
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            title="Look and write."
            subTitle="Look at each feeling and drag the missing question or answer into place."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              flexWrap: "wrap",

              gap: 10,

              padding: 10,

              border: "2px dashed #ccc",

              borderRadius: 10,

              width: "100%",

              justifyContent: "center",

              marginBottom: 16,
            }}
          >
            {words.map((word) => (
              <WordChip
                key={word.id}
                id={word.id}
                text={word.text}
                audio={word.audio}
                isUsed={usedWordIds.has(word.id)}
                isDisabled={showAnswer || checkCompleted}
                keyboardPickedId={keyboardPickedId}
                onKeyboardPick={handleKeyboardPick}
                registerRef={registerBankRef}
                isPlaying={playingAudioKey === `bank-${word.id}`}
                onPlayAudio={playSingleAudio}
              />
            ))}
          </div>

          {/* =================================================
              SECTIONS
          ================================================= */}

          <div
            className="content-container-wb-unit6-p4-q2"
            style={{
              width: "100%",
            }}
          >
            {/* =================================================
                SECTION 1
            ================================================= */}

            <div
              className={`section-one-wb-unit6-p4-q2 ${
                s1.complete ? "completed-section-wb-unit6-p4-q2" : ""
              }`}
              {...s1.props}
            >
              <div className="img-container-wb-unit6-p4-q2">
                <span
                  style={{
                    color: "#2c5287",

                    fontWeight: 700,

                    fontSize: 20,
                  }}
                >
                  1
                </span>

                <img
                  src={img1}
                  alt="A boy sitting on a bench outdoors with a tired and bored expression."
                  className="img-wb-unit6-p4-q2"
                />
              </div>

              <div className="content-input-unit5-p6-q1">
                <FixedAudioText
                  text="Are you bored?"
                  audio={AreYouBoredAudio}
                  audioKey="fixed-are-you-bored"
                  isPlaying={playingAudioKey === "fixed-are-you-bored"}
                  onPlay={playSingleAudio}
                  disabled={s1.complete}
                />

                <div
                  style={{
                    display: "flex",

                    alignItems: "flex-end",
                  }}
                >
                  <input
                    type="text"
                    value="Yes,"
                    readOnly
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      borderBottom: "2px solid black",

                      width: "10%",

                      fontSize: 20,

                      pointerEvents: "none",
                    }}
                  />

                  {dz("input1", s1.complete)}
                </div>
              </div>

              {s1.complete && playingAudioKey === "section-section1" && (
                <FaVolumeUp
                  aria-hidden="true"
                  className="full-audio-icon-wb-unit6-p4-q2"
                />
              )}
            </div>

            {/* =================================================
                SECTION 2
            ================================================= */}

            <div
              className={`section-two-wb-unit6-p4-q2 ${
                s2.complete ? "completed-section-wb-unit6-p4-q2" : ""
              }`}
              {...s2.props}
            >
              <div className="img-container-wb-unit6-p4-q2">
                <span
                  style={{
                    color: "#2c5287",

                    fontWeight: 700,

                    fontSize: 20,
                  }}
                >
                  2
                </span>

                <img
                  src={img2}
                  alt="A boy outdoors on a sunny day thinking about a hamburger."
                  className="img-wb-unit6-p4-q2"
                />
              </div>

              <div className="content-input-unit5-p6-q1">
                <FixedAudioText
                  text="Are you cold?"
                  audio={AreYouColdAudio}
                  audioKey="fixed-are-you-cold"
                  isPlaying={playingAudioKey === "fixed-are-you-cold"}
                  onPlay={playSingleAudio}
                  disabled={s2.complete}
                />

                <div
                  style={{
                    display: "flex",

                    alignItems: "flex-end",
                  }}
                >
                  <FixedAudioText
                    text="No,"
                    audio={NoAudio}
                    audioKey="fixed-no"
                    isPlaying={playingAudioKey === "fixed-no"}
                    onPlay={playSingleAudio}
                    disabled={s2.complete}
                    style={{
                      width: "20%",
                    }}
                  />

                  {dz("input2", s2.complete)}
                </div>
              </div>

              {s2.complete && playingAudioKey === "section-section2" && (
                <FaVolumeUp
                  aria-hidden="true"
                  className="full-audio-icon-wb-unit6-p4-q2"
                />
              )}
            </div>

            {/* =================================================
                SECTION 3
            ================================================= */}

            <div
              className={`section-three-wb-unit6-p4-q2 ${
                s3.complete ? "completed-section-wb-unit6-p4-q2" : ""
              }`}
              {...s3.props}
            >
              <div className="img-container-wb-unit6-p4-q2">
                <span
                  style={{
                    color: "#2c5287",

                    fontWeight: 700,

                    fontSize: 20,
                  }}
                >
                  3
                </span>

                <img
                  src={img3}
                  alt="A boy outdoors shivering and holding his arms because he feels cold."
                  className="img-wb-unit6-p4-q2"
                />
              </div>

              <div className="content-input-unit5-p6-q1">
                <div
                  style={{
                    display: "flex",

                    alignItems: "flex-end",
                  }}
                >
                  <FixedAudioText
                    text="Are"
                    audio={AreAudio}
                    audioKey="fixed-are"
                    isPlaying={playingAudioKey === "fixed-are"}
                    onPlay={playSingleAudio}
                    disabled={s3.complete}
                    style={{
                      width: "20%",
                    }}
                  />

                  {dz("input3", s3.complete)}
                </div>

                {dz("input4", s3.complete)}
              </div>

              {s3.complete && playingAudioKey === "section-section3" && (
                <FaVolumeUp
                  aria-hidden="true"
                  className="full-audio-icon-wb-unit6-p4-q2"
                />
              )}
            </div>

            {/* =================================================
                SECTION 4
            ================================================= */}

            <div
              className={`section-four-wb-unit6-p4-q2 ${
                s4.complete ? "completed-section-wb-unit6-p4-q2" : ""
              }`}
              {...s4.props}
            >
              <div className="img-container-wb-unit6-p4-q2">
                <span
                  style={{
                    color: "#2c5287",

                    fontWeight: 700,

                    fontSize: 20,
                  }}
                >
                  4
                </span>

                <img
                  src={img4}
                  alt="A girl kneeling on the grass and looking at a spider."
                  className="img-wb-unit6-p4-q2"
                />
              </div>

              <div className="content-input-unit5-p6-q1">
                {dz("input5", s4.complete)}

                {dz("input6", s4.complete)}
              </div>

              {s4.complete && playingAudioKey === "section-section4" && (
                <FaVolumeUp
                  aria-hidden="true"
                  className="full-audio-icon-wb-unit6-p4-q2"
                />
              )}
            </div>
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="action-buttons-container">
            <button className="try-again-button" onClick={reset}>
              Start Again ↻
            </button>

            <button
              className="show-answer-btn swal-continue"
              onClick={showAnswers}
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
        {activeWord && (
          <div className="mouse-drag-overlay-wb-unit6-p4-q2">
            {activeWord.text}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page1_Q1;
