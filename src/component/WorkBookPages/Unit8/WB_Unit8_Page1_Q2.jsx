import React, { useEffect, useRef, useState } from "react";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U8/U8P45EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P45EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U8/U8P45EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U8/U8P45EXEB-04.svg";

import "./WB_Unit8_Page1_Q2.css";

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

/* =====================================================
   AUDIO
===================================================== */

import yourKneeAudio from "../../../assets/U1 WB/U8/audio/page 45 - B/Item_001_your_knee.mp3";

import raiseHandAudio from "../../../assets/U1 WB/U8/audio/page 45 - B/Item_002_Raise_your_hand.mp3";

import openMouthAudio from "../../../assets/U1 WB/U8/audio/page 45 - B/Item_003_Open_your_mouth.mp3";

import yourEyeAudio from "../../../assets/U1 WB/U8/audio/page 45 - B/Item_004_your_eye.mp3";

import openAudio from "../../../assets/U1 WB/U8/audio/page 45 - B/Item_005_Open.mp3";

import bendAudio from "../../../assets/U1 WB/U8/audio/page 45 - B/Item_006_Bend.mp3";

/* =====================================================
   Full AUDIO
===================================================== */
import bendYourKneeAudio from "../../../assets/U1 WB/U8/audio/page 45 - B/bend_your_knee.mp3";
import openYourEyeAudio from "../../../assets/U1 WB/U8/audio/page 45 - B/open_your_eye.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    img: img1,

    alt: "A close-up illustration of an eye, matching the command Open your eye.",

    prefix: "Open",

    prefixAudio: openAudio,

    answer: "your eye",

    answerAudio: yourEyeAudio,

    fullAudio: openYourEyeAudio,
  },

  {
    img: img2,

    alt: "A bent leg with an arrow pointing to the knee, matching the command Bend your knee.",

    prefix: "Bend",

    prefixAudio: bendAudio,

    answer: "your knee",

    answerAudio: yourKneeAudio,

    fullAudio: bendYourKneeAudio,
  },

  {
    img: img3,

    alt: "A raised hand, matching the command Raise your hand.",

    prefix: "",

    prefixAudio: null,

    answer: "Raise your hand",

    answerAudio: raiseHandAudio,

    fullAudio: raiseHandAudio,
  },

  {
    img: img4,

    alt: "An open smiling mouth, matching the command Open your mouth.",

    prefix: "",

    prefixAudio: null,

    answer: "Open your mouth",

    answerAudio: openMouthAudio,

    fullAudio: openMouthAudio,
  },
];

/* =====================================================
   WORD BANK
===================================================== */

const wordBank = [
  {
    id: "eye",
    text: "your eye",
    audio: yourEyeAudio,
  },

  {
    id: "knee",
    text: "your knee",
    audio: yourKneeAudio,
  },

  {
    id: "raise-hand",
    text: "Raise your hand",
    audio: raiseHandAudio,
  },

  {
    id: "open-mouth",
    text: "Open your mouth",
    audio: openMouthAudio,
  },
];

/* =====================================================
   GET WORD BY ID
===================================================== */

const getWordById = (id) => wordBank.find((item) => item.id === id);

/* =====================================================
   GET ID BY TEXT
===================================================== */

const getWordIdByText = (text) =>
  wordBank.find((item) => item.text === text)?.id || "";

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
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

    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const isPicked = keyboardPickedId === item.id;

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
        audio + pick
      */

      onPlayAudio(`bank-${item.id}`, item.audio);

      onKeyboardPick(item.id);
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
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${item.text} selected. Tab through the blanks, then press Enter or Space to place it.`
          : `${item.text}. Press Enter or Space to hear and select it.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          AUDIO ONLY
        */

        onPlayAudio(`bank-${item.id}`, item.audio);
      }}
      style={{
        padding: "7px 14px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        cursor: unavailable ? "not-allowed" : isDragging ? "grabbing" : "grab",

        opacity: isUsed ? 0.4 : isDragging ? 0.3 : 1,

        color: isUsed ? "#999" : "",

        transition: "opacity 0.2s, background 0.2s",

        userSelect: "none",

        touchAction: "none",

        position: "relative",
      }}
    >
      {item.text}

      {playingKey === `bank-${item.id}` && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-wb-unit8-p1-q2" />
      )}
    </span>
  );
};

/* =====================================================
   WORD BANK
===================================================== */

const WordBank = ({
  usedIds,

  disabled,

  keyboardPickedId,

  onKeyboardPick,

  registerRef,

  playingKey,

  onPlayAudio,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "word-bank",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",

        gap: "12px",

        padding: "10px",

        width: "100%",

        border: `2px dashed ${isOver ? "#2c5287" : "#ccc"}`,

        borderRadius: "10px",

        justifyContent: "center",

        alignItems: "center",
      }}
    >
      {wordBank.map((item) => (
        <DraggableWord
          key={item.id}
          item={item}
          isUsed={usedIds.has(item.id)}
          disabled={disabled}
          keyboardPickedId={keyboardPickedId}
          onKeyboardPick={onKeyboardPick}
          registerRef={registerRef}
          playingKey={playingKey}
          onPlayAudio={onPlayAudio}
        />
      ))}
    </div>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  index,

  placedId,

  isWrong,

  isLocked,

  keyboardPickedId,

  keyboardFocusIndex,

  onKeyboardPlace,

  onKeyboardCancel,

  onMoveKeyboardFocus,

  onSlotFocus,

  onRemove,

  registerRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,

    disabled: isLocked,
  });

  const word = getWordById(placedId);

  const pickedWord = getWordById(keyboardPickedId);

  const isKeyboardTarget =
    Boolean(keyboardPickedId) && keyboardFocusIndex === index && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(index, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (keyboardPickedId && e.key === "Tab") {
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
        Selected word:
        place / replace
      */

      if (keyboardPickedId) {
        onKeyboardPlace(index);

        return;
      }

      /*
        Wrong filled slot:
        return word to bank
      */

      if (placedId) {
        onRemove(index);
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
    <span
      ref={setRefs}
      role="button"
      tabIndex={isLocked ? -1 : keyboardPickedId ? 0 : placedId ? 0 : -1}
      aria-disabled={isLocked}
      aria-label={
        isLocked
          ? `${word?.text || ""}. Correct and locked.`
          : isKeyboardTarget
            ? `Blank ${index + 1}. Press Enter or Space to place ${pickedWord?.text || "the selected answer"}.`
            : placedId
              ? `${word?.text}. Press Enter or Space to return it to the bank.`
              : `Empty blank ${index + 1}. Select an answer first.`
      }
      onFocus={() => {
        if (keyboardPickedId && !isLocked) {
          onSlotFocus(index);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isLocked) return;

        e.stopPropagation();

        /*
          Mouse click on filled editable slot:
          return it to bank
        */

        if (placedId && !keyboardPickedId) {
          onRemove(index);
        }
      }}
      className={`
        inline-input-wb-unit8-p1-q2

        ${isOver ? "drag-over-cell" : ""}

        ${isKeyboardTarget ? "keyboard-drop-preview-wb-unit8-p1-q2" : ""}
      `}
      style={{
        width: "100%",

        minHeight: "42px",

        display: "inline-flex",

        alignItems: "center",

        position: "relative",

        background: isOver ? "#e3f2fd" : "transparent",

        cursor: !isLocked && placedId ? "pointer" : "default",

        transition: "background 0.15s",
      }}
    >
      {word && !isKeyboardTarget && (
        <span className="drop-real-value-wb-unit8-p1-q2">{word.text}</span>
      )}

      {isKeyboardTarget && pickedWord && (
        <span className="drop-preview-value-wb-unit8-p1-q2">
          {pickedWord.text}
        </span>
      )}

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

const WB_Unit8_Page1_Q2 = () => {
  /*
    One answer for each question.
  */

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  /*
    null | correct | wrong
  */

  const [results, setResults] = useState(Array(questions.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     MOUSE DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD DRAG
  ===================================================== */

  const [keyboardPickedId, setKeyboardPickedId] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const [playingQuestionIndex, setPlayingQuestionIndex] = useState(null);

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

  const usedIds = new Set(answers.filter(Boolean));

  const activeWord = getWordById(activeId);

  const isSlotLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const isQuestionCorrect = (index) =>
    showAnswerMode || results[index] === "correct";

  const allCorrect = questions.every(
    (_, index) => results[index] === "correct",
  );

  const getEditableSlots = () =>
    questions.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =====================================================
     STOP AUDIO
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

    setPlayingQuestionIndex(null);
  };

  /* =====================================================
     SINGLE AUDIO
  ===================================================== */

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
     FULL CORRECT QUESTION AUDIO
  ===================================================== */

  const playQuestionAudio = (qIndex) => {
    if (!isQuestionCorrect(qIndex)) {
      return;
    }

    const question = questions[qIndex];

    if (!question.fullAudio) return;

    stopAudio();

    setPlayingQuestionIndex(qIndex);

    const audio = new Audio(question.fullAudio);

    audioRef.current = audio;

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestionIndex(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestionIndex(null);
    };

    audio.onerror = audio.onended;
  };
  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
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

  const registerSlotRef = (index, node) => {
    if (node) {
      slotRefs.current[index] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (id) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setKeyboardPickedId(id);

    const available = getEditableSlots();

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
     TAB BETWEEN UNLOCKED SLOTS
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = getEditableSlots();

    if (!available.length) {
      return;
    }

    const position = available.indexOf(currentIndex);

    let nextPosition;

    if (backwards) {
      nextPosition = position <= 0 ? available.length - 1 : position - 1;
    } else {
      nextPosition =
        position === -1 || position === available.length - 1 ? 0 : position + 1;
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
    if (
      !keyboardPickedId ||
      isSlotLocked(index) ||
      showAnswerMode ||
      allCorrect
    ) {
      return;
    }

    const picked = keyboardPickedId;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((value) => value === picked);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = "";
      }

      updated[index] = picked;

      nextAnswers = updated;

      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      if (!nextAnswers) {
        return;
      }

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const nextWord = wordBank.find((item) => !usedAfter.has(item.id));

      if (nextWord) {
        bankRefs.current[nextWord.id]?.focus();
      }
    });
  };
  /* =====================================================
     ESCAPE
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedId) {
      return;
    }

    const picked = keyboardPickedId;

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     REMOVE WRONG / EDITABLE ANSWER
  ===================================================== */

  const handleRemove = (index) => {
    if (showAnswerMode || isSlotLocked(index)) {
      return;
    }

    const id = answers[index];

    if (!id) return;

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    requestAnimationFrame(() => {
      bankRefs.current[id]?.focus();
    });
  };

  /* =====================================================
     MOUSE DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    setActiveId(String(active.id));
  };

  /* =====================================================
     MOUSE DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswerMode || allCorrect) {
      return;
    }

    const draggedId = String(active.id);

    const destination = String(over.id);

    /* =================================================
       DROP BACK INTO BANK
    ================================================= */

    if (destination === "word-bank") {
      const oldIndex = answers.findIndex((value) => value === draggedId);

      if (oldIndex !== -1 && !isSlotLocked(oldIndex)) {
        handleRemove(oldIndex);
      }

      return;
    }

    /* =================================================
       ONLY SLOTS
    ================================================= */

    if (!destination.startsWith("slot-")) {
      return;
    }

    const targetIndex = Number(destination.replace("slot-", ""));

    if (isSlotLocked(targetIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((value) => value === draggedId);

      if (
        oldIndex !== -1 &&
        oldIndex !== targetIndex &&
        !isSlotLocked(oldIndex)
      ) {
        updated[oldIndex] = "";
      }

      updated[targetIndex] = draggedId;

      return updated;
    });

    setResults((prev) => {
      const updated = [...prev];

      if (updated[targetIndex] === "wrong") {
        updated[targetIndex] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    const hasEmpty = questions.some(
      (_, index) => results[index] !== "correct" && !answers[index],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please complete all the answers before checking!");

      return;
    }

    const nextResults = [...results];

    let score = 0;

    questions.forEach((question, index) => {
      /*
          Already correct:
          keep locked
        */

      if (results[index] === "correct") {
        nextResults[index] = "correct";

        score++;

        return;
      }

      const answerText = getWordById(answers[index])?.text || "";

      if (answerText === question.answer) {
        nextResults[index] = "correct";

        score++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);

    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      ValidationAlert.success(message);
    } else if (score === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    setAnswers(questions.map((question) => getWordIdByText(question.answer)));

    setResults(questions.map(() => "correct"));

    setShowAnswerMode(true);

    setActiveId(null);

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(questions.length).fill(""));

    setResults(Array(questions.length).fill(null));

    setShowAnswerMode(false);

    setActiveId(null);

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RENDER
  ===================================================== */

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
            gap: "20px",
          }}
        >
          <ExerciseHeader
            sectionLetter="B"
            title="Look and write."
            subTitle="Look at each picture, then drag the words to complete the command."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <WordBank
            usedIds={usedIds}
            disabled={showAnswerMode || allCorrect}
            keyboardPickedId={keyboardPickedId}
            onKeyboardPick={handleKeyboardPick}
            registerRef={registerBankRef}
            playingKey={playingKey}
            onPlayAudio={playAudio}
          />

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="content-container-wb-unit8-p1-q2 w-full">
            {questions.map((question, index) => {
              const questionCorrect = isQuestionCorrect(index);

              const placedWord = getWordById(answers[index]);

              return (
                <div
                  key={index}
                  className={`
                      row2-wb-unit6-p3-q2

                      ${
                        questionCorrect
                          ? "completed-question-wb-unit8-p1-q2"
                          : ""
                      }
                    `}
                  role={questionCorrect ? "button" : undefined}
                  tabIndex={questionCorrect ? 0 : undefined}
                  aria-label={
                    questionCorrect
                      ? `Question ${index + 1} is correct. Press Enter or Space to hear the full command.`
                      : undefined
                  }
                  onClick={() => {
                    if (questionCorrect) {
                      playQuestionAudio(index);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!questionCorrect) {
                      return;
                    }

                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      e.stopPropagation();

                      playQuestionAudio(index);
                    }
                  }}
                  style={{
                    position: "relative",
                  }}
                >
                  {/* =================================================
                        IMAGE
                    ================================================= */}

                  <div
                    style={{
                      display: "flex",

                      gap: "10px",

                      alignItems: "center",
                    }}
                  >
                    <span className="num-span">{index + 1}</span>

                    <img
                      src={question.img}
                      alt={question.alt}
                      className="q-img-wb-unit8-p1-q2"
                    />
                  </div>

                  {/* =================================================
                        SENTENCE
                    ================================================= */}

                  <div className="sentence-wrapper-wb-unit8-p1-q2">
                    {/* PREFIX */}

                    {question.prefix && (
                      <span
                        role={
                          !questionCorrect && question.prefixAudio
                            ? "button"
                            : undefined
                        }
                        tabIndex={
                          !questionCorrect && question.prefixAudio ? 0 : -1
                        }
                        aria-label={
                          !questionCorrect && question.prefixAudio
                            ? `${question.prefix}. Press Enter or Space to hear.`
                            : undefined
                        }
                        className={`
                            sentence-text

                            ${
                              !questionCorrect && question.prefixAudio
                                ? "fixed-audio-text-wb-unit8-p1-q2"
                                : ""
                            }
                          `}
                        onClick={(e) => {
                          if (questionCorrect || !question.prefixAudio) {
                            return;
                          }

                          e.stopPropagation();

                          playAudio(`prefix-${index}`, question.prefixAudio);
                        }}
                        onKeyDown={(e) => {
                          if (questionCorrect || !question.prefixAudio) {
                            return;
                          }

                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();

                            e.stopPropagation();

                            playAudio(`prefix-${index}`, question.prefixAudio);
                          }
                        }}
                        style={{
                          position: "relative",
                        }}
                      >
                        {question.prefix}

                        {playingKey === `prefix-${index}` && (
                          <FaVolumeUp
                            aria-hidden="true"
                            className="audio-icon-wb-unit8-p1-q2"
                          />
                        )}
                      </span>
                    )}

                    {/* DROP */}

                    <DropSlot
                      index={index}
                      placedId={answers[index]}
                      isWrong={results[index] === "wrong"}
                      isLocked={isSlotLocked(index)}
                      keyboardPickedId={keyboardPickedId}
                      keyboardFocusIndex={keyboardFocusIndex}
                      onKeyboardPlace={placeKeyboardWord}
                      onKeyboardCancel={cancelKeyboardPick}
                      onMoveKeyboardFocus={moveKeyboardFocus}
                      onSlotFocus={setKeyboardFocusIndex}
                      onRemove={handleRemove}
                      registerRef={registerSlotRef}
                    />

                    <span className="sentence-text">.</span>
                  </div>

                  {/* =================================================
                        FULL AUDIO ICON
                    ================================================= */}

                  {questionCorrect && playingQuestionIndex === index && (
                    <FaVolumeUp
                      aria-hidden="true"
                      className="full-audio-icon-wb-unit8-p1-q2"
                    />
                  )}
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
          <span className="mouse-drag-overlay-wb-unit8-p1-q2">
            {activeWord.text}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page1_Q2;
