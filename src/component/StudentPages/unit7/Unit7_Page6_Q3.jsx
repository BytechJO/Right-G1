import React, { useEffect, useRef, useState } from "react";

import conversation from "../../../assets/unit7/img/U7P63EXEF-01.svg";
import conversation2 from "../../../assets/unit7/img/U7P63EXEF-02.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page6_Q3.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import coldQuestionAudio from "../../../assets/unit7/sound/Page 63 - F/Are you cold.mp3";
import scaredQuestionAudio from "../../../assets/unit7/sound/Page 63 - F/Are you scared.mp3";

import hungryAudio from "../../../assets/unit7/sound/Page 63 - F/hungry.mp3";
import yesIAmAudio from "../../../assets/unit7/sound/Page 63 - F/Yes, I am..mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: "q1",

    img: conversation,

    alt: "A boy shivering and holding his arms because he feels cold.",

    question: "Are you cold?",

    questionAudio: coldQuestionAudio,

    type: "full",

    correct: "Yes, I am.",

    answerAudio: yesIAmAudio,
  },

  {
    id: "q2",

    img: conversation2,

    alt: "A boy looking hungry and thinking about a hamburger.",

    question: "Are you scared?",

    questionAudio: scaredQuestionAudio,

    type: "word",

    prefix: "No, I'm not. I'm",

    correct: "hungry",

    answerAudio: hungryAudio,
  },
];

const BANK_DATA = [
  {
    word: "Yes, I am.",
    audio: yesIAmAudio,
  },

  {
    word: "hungry",
    audio: hungryAudio,
  },
];

const BANK_WORDS = BANK_DATA.map((item) => item.word);

const getBankAudio = (word) =>
  BANK_DATA.find((item) => item.word === word)?.audio;

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  word,

  isUsed,
  disabled,

  keyboardPickedWord,
  onKeyboardPick,

  registerRef,

  isPlaying,
  onPlayAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${word}`,

    data: {
      word,
      source: "bank",
    },

    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const keyboardSelected = keyboardPickedWord === word;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(word, node);
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

      onPlayAudio(word);

      onKeyboardPick(word);
    }
  };

  return (
    <span
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
          ? `${word} selected. Choose an answer box and press Enter or Space.`
          : `${word}. Press Enter or Space to hear and select this answer.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          صوت فقط.

          السحب نفسه ما بشغل الصوت.
        */

        onPlayAudio(word);
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",

        background: isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        cursor: unavailable ? "not-allowed" : isDragging ? "grabbing" : "grab",

        opacity: isUsed ? 0.45 : isDragging ? 0.3 : 1,

        transition: "opacity 0.2s, background 0.2s",

        userSelect: "none",

        color: isUsed ? "#999" : "",

        /*
          فقط لأيقونة الصوت.
        */
        position: "relative",
      }}
    >
      {word}

      {/* =================================================
          AUDIO ICON
      ================================================= */}

      {isPlaying && (
        <FaVolumeUp
          size={14}
          aria-hidden="true"
          style={{
            position: "absolute",

            top: "-8px",
            right: "-8px",

            pointerEvents: "none",

            zIndex: 5,
          }}
        />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  id,

  index,

  answer,

  isWrong,
  locked,

  onRemove,

  inline,
  style,

  keyboardPickedWord,
  keyboardFocusIndex,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,

  onSlotFocus,

  registerRef,

  forceTabIndex,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: locked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedWord) && keyboardFocusIndex === index && !locked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(index, node);
    }
  };

  const handleKeyDown = (e) => {
    if (locked) return;

    /* =================================================
       TAB / SHIFT + TAB
    ================================================= */

    if (keyboardPickedWord && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(index, e.shiftKey);

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

      if (keyboardPickedWord) {
        onKeyboardPlace(index);

        return;
      }

      /*
        filled editable slot:
        رجعه للبنك.
      */

      if (answer) {
        onRemove(id, index);
      }

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (keyboardPickedWord && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  const base = {
    background: isOver
      ? "#e8f0fe"
      : isKeyboardTarget
        ? "#eff6ff"
        : "transparent",

    transition: "background 0.15s",

    cursor: answer && !locked ? "pointer" : "default",

    display: inline ? "inline-flex" : "flex",

    alignItems: "center",

    ...style,
  };

  return (
    <div
      ref={setRefs}
      className={`answer-input-unit7-p2-q3${inline ? " small" : ""}${
        isOver ? " drag-over-cell" : ""
      }`}
      role="button"
      tabIndex={
        forceTabIndex !== undefined
          ? forceTabIndex
          : locked
            ? -1
            : keyboardPickedWord
              ? 0
              : answer
                ? 0
                : -1
      }
      aria-disabled={locked}
      aria-label={
        locked
          ? `Answer box ${index + 1}. Correct answer ${answer}. Locked.`
          : isKeyboardTarget
            ? `Answer box ${
                index + 1
              }. Press Enter or Space to place ${keyboardPickedWord}. Press Tab or Shift plus Tab to move between answer boxes.`
            : answer
              ? `Answer box ${
                  index + 1
                }. Current answer ${answer}. Press Enter or Space to return it to the word bank.`
              : `Empty answer box ${index + 1}. Select an answer first.`
      }
      onFocus={() => {
        if (keyboardPickedWord && !locked) {
          onSlotFocus(index);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        /*
          بعد correct:
          wrapper الكبير هو اللي يتعامل مع click.
        */

        if (locked) {
          return;
        }

        e.stopPropagation();

        if (answer && !keyboardPickedWord) {
          onRemove(id, index);
        }
      }}
      title={answer && !locked ? "Click to remove" : ""}
      style={base}
    >
      {/* =================================================
          NORMAL ANSWER
      ================================================= */}

      {answer && !isKeyboardTarget && <span>{answer}</span>}

      {/* =================================================
          KEYBOARD PREVIEW
      ================================================= */}

      {isKeyboardTarget && keyboardPickedWord && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",

            alignItems: "center",

            padding: "2px 7px",

            border: "2px dashed #2563eb",

            borderRadius: "7px",

            color: "#2563eb",

            background: "rgba(219,234,254,0.45)",

            fontWeight: "600",

            pointerEvents: "none",

            animation:
              "unit7Q3KeyboardBlink 0.75s ease-in-out infinite alternate",
          }}
        >
          {keyboardPickedWord}
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const Unit7_Page6_Q3 = () => {
  /* =====================================================
     ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
  });

  const [wrongInputs, setWrongInputs] = useState([]);

  /* =====================================================
     PROGRESSIVE LOCK
  ===================================================== */

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const [keyboardMessage, setKeyboardMessage] = useState("");

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingAudioKey, setPlayingAudioKey] = useState(null);

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

  const usedWords = new Set(Object.values(answers).filter(Boolean));

  const activeWord = activeId ? String(activeId).replace("bank-", "") : null;

  const isSlotLocked = (slotId) => lockedSlots.includes(slotId);

  const editableIndexes = () =>
    questions
      .map((_, index) => index)
      .filter((index) => !isSlotLocked(questions[index].id));

  /* =====================================================
     STOP AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      /*
        Audio عادي أو
        dialogue controller.
      */

      if (typeof audioRef.current.pause === "function") {
        audioRef.current.pause();

        try {
          audioRef.current.currentTime = 0;
        } catch {
          // controller
        }
      }

      audioRef.current = null;
    }

    setPlayingAudioKey(null);
  };

  /* =====================================================
     PLAY SINGLE AUDIO
  ===================================================== */

  const playAudio = (key, src) => {
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

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioKey(null);
    };
  };

  /* =====================================================
     BANK AUDIO
  ===================================================== */

  const playBankAudio = (word) => {
    playAudio(
      `bank-${word}`,

      getBankAudio(word),
    );
  };

  /* =====================================================
     QUESTION AUDIO
  ===================================================== */

  const playQuestionAudio = (question) => {
    playAudio(
      `question-${question.id}`,

      question.questionAudio,
    );
  };

  /* =====================================================
     COMPLETE DIALOGUE AUDIO

     بعد السؤال يصير correct:
     السؤال + الجواب يصيروا control واحد.
  ===================================================== */

  const playDialogueAudio = (question) => {
    const answer = answers[question.id];

    if (!answer) return;

    stopAudio();

    const key = `dialogue-${question.id}`;

    setPlayingAudioKey(key);

    const clips = [question.questionAudio, question.answerAudio].filter(
      Boolean,
    );

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
      if (cancelled || index >= clips.length) {
        if (audioRef.current === controller) {
          audioRef.current = null;

          setPlayingAudioKey(null);
        }

        return;
      }

      const audio = new Audio(clips[index]);

      controller.currentAudio = audio;

      audio.onended = () => playNext(index + 1);

      audio.onerror = () => playNext(index + 1);

      audio.play().catch(() => {
        playNext(index + 1);
      });
    };

    playNext(0);
  };

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      if (audioRef.current && typeof audioRef.current.pause === "function") {
        audioRef.current.pause();
      }
    };
  }, []);

  /* =====================================================
     REGISTER REFS
  ===================================================== */

  const registerBankRef = (word, node) => {
    if (node) {
      bankRefs.current[word] = node;
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

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedWord(word);

    setKeyboardMessage(
      `${word} selected. Choose an answer box and press Enter or Space.`,
    );

    const available = editableIndexes();

    if (!available.length) {
      return;
    }

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      slotRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     SLOT FOCUS
  ===================================================== */

  const handleSlotFocus = (index) => {
    if (keyboardPickedWord && !isSlotLocked(questions[index].id)) {
      setKeyboardFocusIndex(index);
    }
  };

  /* =====================================================
     TAB / SHIFT + TAB BETWEEN SLOTS
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableIndexes();

    if (!available.length) {
      return;
    }

    const currentPosition = available.indexOf(currentIndex);

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

    const nextIndex = available[nextPosition];

    setKeyboardFocusIndex(nextIndex);

    requestAnimationFrame(() => {
      slotRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardWord = (index) => {
    if (!keyboardPickedWord) {
      return;
    }

    const question = questions[index];

    if (showAnswer || checkCompleted || isSlotLocked(question.id)) {
      return;
    }

    const picked = keyboardPickedWord;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      /*
          نفس الكلمة إذا موجودة
          بمكان ثاني غلط:
          انقلها.
        */

      Object.keys(updated).forEach((slotId) => {
        if (
          updated[slotId] === picked &&
          slotId !== question.id &&
          !isSlotLocked(slotId)
        ) {
          updated[slotId] = null;
        }
      });

      updated[question.id] = picked;

      nextAnswers = updated;

      return updated;
    });

    /*
      تعديل نفس السؤال:
      شيل X عنه فقط.
    */

    setWrongInputs((prev) => prev.filter((id) => id !== question.id));

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage(`${picked} placed in answer box ${index + 1}.`);

    /*
      رجع للبنك.
    */

    requestAnimationFrame(() => {
      if (!nextAnswers) {
        return;
      }

      const usedAfter = new Set(Object.values(nextAnswers).filter(Boolean));

      const nextWord = BANK_WORDS.find((word) => !usedAfter.has(word));

      if (nextWord) {
        bankRefs.current[nextWord]?.focus();
      }
    });
  };

  /* =====================================================
     CANCEL KEYBOARD PICK
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedWord) {
      return;
    }

    const picked = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage("Selection cancelled.");

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     DRAG START

     مهم:
     ما بنشغل صوت عند السحب.
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

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const word =
      active.data.current?.word ?? String(active.id).replace("bank-", "");

    const slotId = String(over.id);

    if (!["q1", "q2"].includes(slotId)) {
      return;
    }

    if (isSlotLocked(slotId)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      Object.keys(updated).forEach((key) => {
        if (updated[key] === word && key !== slotId && !isSlotLocked(key)) {
          updated[key] = null;
        }
      });

      updated[slotId] = word;

      return updated;
    });

    /*
      تعديل نفس السؤال:
      شيل X عنه فقط.
    */

    setWrongInputs((prev) => prev.filter((id) => id !== slotId));
  };

  /* =====================================================
     REMOVE
  ===================================================== */

  const handleRemove = (slotId) => {
    if (showAnswer || isSlotLocked(slotId)) {
      return;
    }

    const removedWord = answers[slotId];

    if (!removedWord) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,

      [slotId]: null,
    }));

    setWrongInputs((prev) => prev.filter((id) => id !== slotId));

    /*
      Wrong Slot Correction:
      focus يرجع لنفس كلمة البنك.
    */

    requestAnimationFrame(() => {
      bankRefs.current[removedWord]?.focus();
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const handleCheck = () => {
    /*
        بعد الكل صح:
        no-op.
      */

    if (showAnswer || checkCompleted) {
      return;
    }

    if (Object.values(answers).some((value) => !value || value.trim() === "")) {
      ValidationAlert.info("Please complete all answers.");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    questions.forEach((q) => {
      const given = (answers[q.id] || "").trim().toLowerCase();

      const expected = q.correct.trim().toLowerCase();

      if (given === expected) {
        correctCount++;

        newlyLocked.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    /*
        Progressive locking.
      */

    setLockedSlots((prev) => [...new Set([...prev, ...newlyLocked])]);

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    const total = questions.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount}/${total}
          </span>
        </div>
      `;

    if (correctCount === total) {
      setLockedSlots(questions.map((q) => q.id));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    const filled = {};

    questions.forEach((q) => {
      filled[q.id] = q.correct;
    });

    setAnswers(filled);

    setWrongInputs([]);

    setLockedSlots(questions.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setActiveId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    stopAudio();

    setAnswers({
      q1: null,
      q2: null,
    });

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    setKeyboardMessage("");
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <>
      <style>
        {`
          @keyframes unit7Q3KeyboardBlink {
            0% {
              opacity: 0.35;
            }

            100% {
              opacity: 1;
            }
          }

          /* =============================================
             FULL CORRECT DIALOGUE AUDIO GROUP
          ============================================= */

          .unit7-p6-q3-dialogue-audio-group {
            cursor: pointer;
            border-radius: 14px;
          }

          .unit7-p6-q3-dialogue-audio-group:hover {
            outline: 2px solid rgba(37, 99, 235, 0.45);
            outline-offset: 7px;
          }

          .unit7-p6-q3-dialogue-audio-group:focus {
            outline: none;
          }

          .unit7-p6-q3-dialogue-audio-group:focus-visible {
            outline: 3px solid #2563eb;
            outline-offset: 7px;
          }
        `}
      </style>

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

            justifyContent: "center",

            alignItems: "center",

            padding: "30px",
          }}
        >
          {/* =================================================
              SCREEN READER STATUS
          ================================================= */}

          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: "absolute",

              width: "1px",

              height: "1px",

              padding: 0,

              margin: "-1px",

              overflow: "hidden",

              clip: "rect(0,0,0,0)",

              clipPath: "inset(50%)",

              whiteSpace: "nowrap",

              border: 0,
            }}
          >
            {keyboardMessage}
          </div>

          <div className="div-forall">
            <ExerciseHeader
              sectionLetter="F"
              title="Look, read, and write."
              subTitle="Use each picture to drag the correct feeling words into the dialogue."
            />

            {/* =================================================
                WORD BANK
            ================================================= */}

            <div
              style={{
                display: "flex",

                gap: "40px",

                padding: "10px",

                border: "2px dashed #ccc",

                borderRadius: "10px",

                alignItems: "center",

                justifyContent: "center",

                width: "100%",
              }}
            >
              {BANK_WORDS.map((word) => (
                <BankChip
                  key={word}
                  word={word}
                  isUsed={usedWords.has(word)}
                  disabled={showAnswer || checkCompleted}
                  keyboardPickedWord={keyboardPickedWord}
                  onKeyboardPick={handleKeyboardPick}
                  registerRef={registerBankRef}
                  isPlaying={playingAudioKey === `bank-${word}`}
                  onPlayAudio={playBankAudio}
                />
              ))}
            </div>

            {/* =================================================
                QUESTIONS
            ================================================= */}

            <div>
              {questions.map((q, index) => {
                const isWrong = wrongInputs.includes(q.id);

                const locked = isSlotLocked(q.id) || showAnswer;

                /*
                    Full Correct Audio Group
                    فقط إذا السؤال نفسه صح.
                  */

                const isCompletedCorrect =
                  locked && answers[q.id] === q.correct;

                const questionPlaying = playingAudioKey === `question-${q.id}`;

                const dialoguePlaying = playingAudioKey === `dialogue-${q.id}`;

                return (
                  <div key={q.id} className="question-row-unit7-p2-q3">
                    {/* =========================================
                          IMAGE + NUMBER
                      ========================================== */}

                    <div className="question-container-unit7-p6-q3">
                      <span className="num2">{index + 1}</span>

                      <img src={q.img} alt={q.alt} className="avatar-img" />
                    </div>

                    {/* =========================================
                          QUESTION + ANSWER GROUP

                          هاي هي المنطقة اللي رسمتيها بالأزرق.
                      ========================================== */}

                    <div
                      className={
                        isCompletedCorrect
                          ? "unit7-p6-q3-dialogue-audio-group"
                          : ""
                      }
                      role={isCompletedCorrect ? "button" : undefined}
                      tabIndex={isCompletedCorrect ? 0 : undefined}
                      aria-label={
                        isCompletedCorrect
                          ? `Play dialogue. ${q.question} ${
                              q.type === "full"
                                ? q.correct
                                : `${q.prefix} ${q.correct}.`
                            }`
                          : undefined
                      }
                      onClick={() => {
                        if (isCompletedCorrect) {
                          playDialogueAudio(q);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!isCompletedCorrect) {
                          return;
                        }

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          playDialogueAudio(q);
                        }
                      }}
                      style={{
                        /*
                            مهم:
                            نفس المحتوى،
                            فقط wrapper حول السؤال والجواب.
                          */

                        display: "flex",

                        alignItems: "center",

                        gap: "18px",

                        position: "relative",
                      }}
                    >
                      {/* =====================================
                            QUESTION

                            قبل الصح:
                            control مستقل للصوت.

                            بعد الصح:
                            يطلع من tab
                            والwrapper كله يصير الصوت.
                        ====================================== */}

                      <div
                        role={isCompletedCorrect ? undefined : "button"}
                        tabIndex={isCompletedCorrect ? -1 : 0}
                        aria-label={
                          isCompletedCorrect
                            ? undefined
                            : `Play audio: ${q.question}`
                        }
                        onClick={(e) => {
                          if (isCompletedCorrect) {
                            return;
                          }

                          e.stopPropagation();

                          playQuestionAudio(q);
                        }}
                        onKeyDown={(e) => {
                          if (isCompletedCorrect) {
                            return;
                          }

                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();

                            playQuestionAudio(q);
                          }
                        }}
                        style={{
                          position: "relative",
                          width: "180px",
                          flexShrink: 0,
                        }}
                      >
                        <p className="question-text-unit7-p2-q3">
                          {q.question}
                        </p>

                        {/* QUESTION AUDIO ICON */}

                        {!isCompletedCorrect && questionPlaying && (
                          <FaVolumeUp
                            size={14}
                            aria-hidden="true"
                            style={{
                              position: "absolute",

                              top: "-8px",

                              right: "-8px",

                              pointerEvents: "none",

                              zIndex: 5,
                            }}
                          />
                        )}
                      </div>

                      {/* =====================================
                            ANSWER AREA
                        ====================================== */}

                      <div
                        className="sentence-box-unit7-p2-q3"
                        style={{
                          position: "relative",
                        }}
                      >
                        {/* FULL ANSWER */}

                        {q.type === "full" && (
                          <DropSlot
                            id={q.id}
                            index={index}
                            answer={answers[q.id]}
                            isWrong={isWrong}
                            locked={locked}
                            onRemove={handleRemove}
                            keyboardPickedWord={keyboardPickedWord}
                            keyboardFocusIndex={keyboardFocusIndex}
                            onKeyboardPlace={placeKeyboardWord}
                            onKeyboardCancel={cancelKeyboardPick}
                            onMoveKeyboardFocus={moveKeyboardFocus}
                            onSlotFocus={handleSlotFocus}
                            registerRef={registerSlotRef}
                            forceTabIndex={isCompletedCorrect ? -1 : undefined}
                          />
                        )}

                        {/* INLINE ANSWER */}

                        {q.type === "word" && (
                          <p className="answer-line-unit7-p2-q3">
                            {q.prefix}{" "}
                            <DropSlot
                              id={q.id}
                              index={index}
                              answer={answers[q.id]}
                              isWrong={isWrong}
                              locked={locked}
                              onRemove={handleRemove}
                              keyboardPickedWord={keyboardPickedWord}
                              keyboardFocusIndex={keyboardFocusIndex}
                              onKeyboardPlace={placeKeyboardWord}
                              onKeyboardCancel={cancelKeyboardPick}
                              onMoveKeyboardFocus={moveKeyboardFocus}
                              onSlotFocus={handleSlotFocus}
                              registerRef={registerSlotRef}
                              forceTabIndex={
                                isCompletedCorrect ? -1 : undefined
                              }
                              inline
                              style={{
                                minWidth: "80px",

                                minHeight: "32px",
                              }}
                            />
                            .
                          </p>
                        )}

                        {/* WRONG X */}

                        {isWrong && !locked && (
                          <span
                            className="wrong-mark-unit7-p2-q3"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}
                      </div>

                      {/* =====================================
                            COMPLETE DIALOGUE AUDIO ICON

                            فوق يمين المنطقة كلها.
                        ====================================== */}

                      {isCompletedCorrect && dialoguePlaying && (
                        <FaVolumeUp
                          size={15}
                          aria-hidden="true"
                          style={{
                            position: "absolute",

                            top: "-8px",

                            right: "-8px",

                            pointerEvents: "none",

                            zIndex: 10,
                          }}
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
            <button onClick={handleReset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              className="show-answer-btn swal-continue"
              onClick={handleShowAnswer}
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
            السحب صامت.
        ================================================= */}

        <DragOverlay>
          {activeWord ? (
            <span
              style={{
                padding: "7px 14px",

                border: "2px solid #2c5287",

                borderRadius: "8px",

                background: "white",

                fontWeight: "bold",

                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

                cursor: "grabbing",

                color: "#2c5287",
              }}
            >
              {activeWord}
            </span>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Unit7_Page6_Q3;
