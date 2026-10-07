import React, { useRef, useState } from "react";

import "./Unit5_Page6_Q1.css";

import img1 from "../../../assets/unit5/imgs/U5P45EXED-01.svg";
import img2 from "../../../assets/unit5/imgs/U5P45EXED-02.svg";
import img3 from "../../../assets/unit5/imgs/U5P45EXED-03.svg";
import img4 from "../../../assets/unit5/imgs/U5P45EXED-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
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

import bookAudio from "../../../assets/unit5/sounds/Page 45 - D/book.mp3";
import globalAudio from "../../../assets/unit5/sounds/Page 45 - D/global.mp3";
import isThisAPencilAudio from "../../../assets/unit5/sounds/Page 45 - D/Is this a pencil.mp3";
import isThisAAudio from "../../../assets/unit5/sounds/Page 45 - D/is this a.mp3";
import itIsAudio from "../../../assets/unit5/sounds/Page 45 - D/it is.mp3";
import noItIsntAudio from "../../../assets/unit5/sounds/Page 45 - D/no, it isn't.mp3";
import rulerAudio from "../../../assets/unit5/sounds/Page 45 - D/ruler.mp3";
import thisIsAAudio from "../../../assets/unit5/sounds/Page 45 - D/this is a.mp3";
import thisAudio from "../../../assets/unit5/sounds/Page 45 - D/this.mp3";
import whatsThisAudio from "../../../assets/unit5/sounds/Page 45 - D/What's this.mp3";
import whatsAudio from "../../../assets/unit5/sounds/Page 45 - D/What's.mp3";
import yesAudio from "../../../assets/unit5/sounds/Page 45 - D/Yes,.mp3";

/* =====================================================
   ANSWER DATA
===================================================== */

const correctMatches = [
  {
    input: "book",
    num: "input1",
    audio: bookAudio,
  },
  {
    input: "this",
    num: "input2",
    audio: thisAudio,
  },
  {
    input: "this is a",
    num: "input3",
    audio: thisIsAAudio,
  },
  {
    input: "no, it isn't",
    num: "input4",
    audio: noItIsntAudio,
  },
  {
    input: "is this a",
    num: "input5",
    audio: isThisAAudio,
  },
  {
    input: "it is",
    num: "input6",
    audio: itIsAudio,
  },
];

/* =====================================================
   STATIC AUDIO TEXT
===================================================== */

const AudioText = ({
  text,
  audio,
  playAudio,
  playingId,
  audioId,
  className = "",
  style = {},
}) => {
  const playing = playingId === audioId;

  const activate = () => {
    playAudio(audioId, audio);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={`Play audio: ${text}`}
      className={`audio-text-unit5-p6-q1 ${className}`}
      style={{
        position: "relative",
        cursor: "pointer",
        ...style,
      }}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          activate();
        }
      }}
    >
      {text}

      {playing && (
        <FaVolumeUp
          size={15}
          aria-hidden="true"
          className="audio-playing-icon-unit5-p6-q1"
        />
      )}
    </span>
  );
};

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  id,
  word,
  audio,

  disabled,
  isUsed,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,

  playingId,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked = keyboardPickedWord === word;

  const audioId = `bank-${word}`;

  const isPlaying = playingId === audioId;

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

          bankRefs.current[word] = el;
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
            ? `${word} selected. Press Tab to move through the answer boxes, then Enter or Space to place it.`
            : `${word}. Press Enter or Space to hear and select this option.`
        }
        className={`drag-word-unit5-p6-q1 ${
          isPicked ? "keyboard-picked-word-unit5-p6-q1" : ""
        }`}
        onClick={() => {
          if (isDisabled) return;

          /*
            Mouse click = audio فقط.
            السحب نفسه يضل عن طريق dnd-kit.
          */
          playAudio(audioId, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            playAudio(audioId, audio);

            onKeyboardPick(word);
          }
        }}
        style={{
          padding: "7px 14px",

          border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

          borderRadius: "8px",

          background: isPicked ? "#dbeafe" : isUsed ? "#f0f2f5" : "white",

          fontWeight: "bold",

          cursor: isDisabled ? "default" : isDragging ? "grabbing" : "grab",

          opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

          color: isUsed ? "#9aa3b0" : "inherit",

          display: "inline-block",

          transition: "all 0.2s ease",

          userSelect: "none",

          touchAction: "none",
        }}
      >
        {word}
      </span>

      {isPlaying && (
        <FaVolumeUp
          size={15}
          aria-hidden="true"
          className="audio-playing-icon-unit5-p6-q1"
        />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

/* =====================================================
   DROP SLOT — UPDATED DRAG PATTERN
===================================================== */

const DropSlot = ({
  slotId,
  value,

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
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,

    disabled: locked || showAnswer || checkCompleted,
  });

  /* =====================================================
     PICKED WORD → TARGET MODE
  ===================================================== */

  const keyboardActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  /* =====================================================
     NEW DRAG PATTERN

     أي slot معبّى ولسا مش locked
     يضل reachable بالـTab
     قبل Check وبعد Check إذا كان غلط
  ===================================================== */

  const canEditFilled =
    !!value && !keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardActive && focusedDropId === slotId;

  const displayedValue = showPreview ? keyboardPickedWord : value;

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

      onKeyboardClearWrong(slotId, value);

      return;
    }

    if (!keyboardActive) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableDropIds();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(slotId);

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
       PLACE / REPLACE WORD
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(slotId);

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

        dropRefs.current[slotId] = el;
      }}
      role="button"
      tabIndex={
        locked || showAnswer || checkCompleted
          ? -1
          : keyboardActive || canEditFilled
            ? 0
            : -1
      }
      aria-label={
        keyboardActive
          ? value
            ? `This answer box contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
            : `Empty answer box. Press Enter or Space to place ${keyboardPickedWord}.`
          : canEditFilled
            ? `This answer box contains ${value}. Press Enter or Space to return it to the word bank.`
            : value
              ? `Answer box containing ${value}.`
              : "Empty answer box."
      }
      className={`answer-input-unit5-p6-q1 ${isOver ? "drag-over-cell" : ""} ${
        showPreview ? "keyboard-drop-preview-unit5-p6-q1" : ""
      }`}
      onFocus={() => {
        if (keyboardActive) {
          setFocusedDropId(slotId);
        }
      }}
      onBlur={() => {
        setFocusedDropId(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (value && !locked && !showAnswer && !checkCompleted) {
          onRemove(slotId);
        }
      }}
      style={{
        position: "relative",

        background: isOver ? "#e3f2fd" : undefined,

        cursor:
          value && !locked && !showAnswer && !checkCompleted
            ? "pointer"
            : "default",
      }}
      title={
        value && !locked && !showAnswer && !checkCompleted
          ? "Click to remove"
          : ""
      }
    >
      {displayedValue}

      {isWrong && value && (
        <span className="error-mark-input1-unit5-p6-q1" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit5_Page6_Q1 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     DRAG
  ================================================= */

  const [activeWord, setActiveWord] = useState(null);

  /* =================================================
     KEYBOARD DRAG
  ================================================= */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedDropId, setFocusedDropId] = useState(null);

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingId(null);
  };

  const playAudio = (id, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingId(id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };
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
     HELPERS
  ================================================= */

  const getValue = (slotId) =>
    answers.find((answer) => answer.num === slotId)?.input || "";

  const usedWords = new Set(answers.map((answer) => answer.input));

  const isSlotLocked = (slotId) => lockedSlots.includes(slotId);

  const getAvailableDropIds = () =>
    correctMatches
      .map((item) => item.num)
      .filter((slotId) => !isSlotLocked(slotId));

  const getWordAudio = (word) =>
    correctMatches.find((item) => item.input === word)?.audio;

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (value, slotId) => {
    if (showAnswer || checkCompleted || isSlotLocked(slotId)) {
      return;
    }

    setAnswers((prev) => {
      /*
        شيل نفس الخيار من مكانه القديم.
      */

      const updated = prev.filter((answer) => answer.input !== value);

      const existingIndex = updated.findIndex(
        (answer) => answer.num === slotId,
      );

      /*
        إذا الخانة فيها خيار ثاني
        نستبدله، والقديم يرجع للبنك.
      */

      if (existingIndex !== -1) {
        updated[existingIndex] = {
          input: value,
          num: slotId,
        };
      } else {
        updated.push({
          input: value,
          num: slotId,
        });
      }

      return updated;
    });

    /*
      امسح X فقط عن الخانة المعدلة.
    */

    setWrongWords((prev) => prev.filter((id) => id !== slotId));
  };

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const onDragStart = ({ active }) => {
    setActiveWord(active.id.replace("word-", ""));
  };

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const slotId = String(over.id);

    if (!slotId.startsWith("input")) {
      return;
    }

    if (isSlotLocked(slotId)) {
      return;
    }

    const value = active.id.replace("word-", "");

    placeWord(value, slotId);
  };

  const onDragCancel = () => setActiveWord(null);

  /* =================================================
     KEYBOARD PICK
  ================================================= */

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

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (slotId) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(slotId)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    placeWord(word, slotId);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
      رجع للفوكس على الخيار بالبنك.
    */

    window.setTimeout(() => {
      bankRefs.current[word]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG SLOT KEYBOARD FIX
  ================================================= */

  const handleKeyboardClearWrong = (slotId, currentWord) => {
    if (showAnswer || checkCompleted || isSlotLocked(slotId)) {
      return;
    }

    setAnswers((prev) => prev.filter((answer) => answer.num !== slotId));

    setWrongWords((prev) => prev.filter((id) => id !== slotId));

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      bankRefs.current[currentWord]?.focus();
    }, 0);
  };

  /* =================================================
     CANCEL KEYBOARD PICK
  ================================================= */

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

  /* =================================================
     REMOVE WITH MOUSE
  ================================================= */

  const removeAnswer = (slotId) => {
    if (showAnswer || checkCompleted || isSlotLocked(slotId)) {
      return;
    }

    setAnswers((prev) => prev.filter((answer) => answer.num !== slotId));

    setWrongWords((prev) => prev.filter((id) => id !== slotId));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      لازم كل الـ6 خانات تكون معبّية.
    */

    const hasEmpty = correctMatches.some((item) => !getValue(item.num));

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    correctMatches.forEach((correct) => {
      const userAnswer = answers.find((answer) => answer.num === correct.num);

      if (
        userAnswer &&
        userAnswer.input.toLowerCase() === correct.input.toLowerCase()
      ) {
        correctCount++;

        newlyLocked.push(correct.num);
      } else {
        wrong.push(correct.num);
      }
    });

    /*
      Progressive locking:
      الصح فقط يقفل.
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setWrongWords(wrong);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedSlots(correctMatches.map((item) => item.num));

      setWrongWords([]);

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers(
      correctMatches.map((item) => ({
        input: item.input,
        num: item.num,
      })),
    );

    setWrongWords([]);

    setLockedSlots(correctMatches.map((item) => item.num));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers([]);

    setWrongWords([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);
  };

  /* =================================================
     REUSABLE SLOT PROPS
  ================================================= */

  const getSlotProps = (slotId) => ({
    slotId,

    value: getValue(slotId),

    isWrong: wrongWords.includes(slotId),

    locked: isSlotLocked(slotId),

    showAnswer,

    checkCompleted,

    keyboardPickedWord,

    focusedDropId,

    setFocusedDropId,

    dropRefs,

    getAvailableDropIds,

    onKeyboardDrop: handleKeyboardDrop,

    onKeyboardClearWrong: handleKeyboardClearWrong,

    onCancelKeyboardPick: handleCancelKeyboardPick,

    onRemove: removeAnswer,
  });

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
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
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "60px",
            justifyContent: "flex-start",
          }}
        >
          <ExerciseHeader
            sectionLetter="D"
            title="Look and read. Complete the question and answer."
            subTitle="Use the pictures to drag the correct words into each question and answer."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              width: "100%",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {correctMatches.map((item) => (
              <DraggableWord
                key={item.input}
                id={`word-${item.input}`}
                word={item.input}
                audio={item.audio}
                disabled={showAnswer || checkCompleted}
                isUsed={usedWords.has(item.input)}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
                playingId={playingId}
                playAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="content-container-unit5-p6-q1 w-full">
            {/* =================================================
                QUESTION 1
            ================================================= */}

            <div className="section-one-unit5-p6-q1">
              <span
                className="Unit5-P6-Q3-text"
                style={{
                  color: "darkblue",
                }}
              >
                1
              </span>

              <img src={img1} className="img-unit5-p6-q1" alt="A green book." />

              <div
                role="button"
                tabIndex={0}
                aria-label="Play audio: What's this? This is a book."
                className="sentence-audio-group-unit5-p6-q1"
                onClick={() => playAudio("question-1-sentence", whatsThisAudio)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();

                    playAudio("question-1-sentence", whatsThisAudio);
                  }
                }}
              >
                <div>What's this?</div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span>This is a</span>

                  <DropSlot {...getSlotProps("input1")} />
                </div>

                {playingId === "question-1-sentence" && (
                  <FaVolumeUp
                    size={15}
                    aria-hidden="true"
                    className="audio-playing-icon-unit5-p6-q1"
                  />
                )}
              </div>
            </div>

            {/* =================================================
                QUESTION 2
            ================================================= */}

            <div className="section-two-unit5-p6-q1">
              <span
                className="Unit5-P6-Q3-text"
                style={{
                  color: "darkblue",
                }}
              >
                2
              </span>

              <img
                src={img2}
                className="img-unit5-p6-q1"
                alt="A globe on a stand."
              />

              <div
                className="content-input-unit5-p6-q1"
                style={{
                  fontSize: "18px",
                }}
              >
                <div
                  style={{
                    position: "relative",

                    display: "flex",

                    alignItems: "center",
                  }}
                >
                  <AudioText
                    text="What's"
                    audio={whatsAudio}
                    audioId="text-whats"
                    playingId={playingId}
                    playAudio={playAudio}
                    style={{
                      width: "70px",
                    }}
                  />

                  <DropSlot {...getSlotProps("input2")} />

                  <span aria-hidden="true">?</span>
                </div>

                <div
                  style={{
                    position: "relative",

                    display: "flex",

                    alignItems: "center",
                  }}
                >
                  <DropSlot {...getSlotProps("input3")} />

                  <AudioText
                    text="global"
                    audio={globalAudio}
                    audioId="text-global"
                    playingId={playingId}
                    playAudio={playAudio}
                    style={{
                      width: "70px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                QUESTION 3
            ================================================= */}

            <div className="section-three-unit5-p6-q1">
              <span
                className="Unit5-P6-Q3-text"
                style={{
                  color: "darkblue",
                }}
              >
                3
              </span>

              <img src={img3} className="img-unit5-p6-q1" alt="A red pencil." />

              <div
                className="content-input-unit5-p6-q1"
                style={{
                  fontSize: "18px",
                }}
              >
                <AudioText
                  text="Is this a pencil?"
                  audio={isThisAPencilAudio}
                  audioId="text-is-this-a-pencil"
                  playingId={playingId}
                  playAudio={playAudio}
                />

                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <DropSlot {...getSlotProps("input4")} />
                </div>
              </div>
            </div>

            {/* =================================================
                QUESTION 4
            ================================================= */}

            <div className="section-four-unit5-p6-q1">
              <span
                className="Unit5-P6-Q3-text"
                style={{
                  color: "darkblue",
                }}
              >
                4
              </span>

              <img src={img4} className="img-unit5-p6-q1" alt="A blue ruler." />

              <div
                className="content-input-unit5-p6-q1"
                style={{
                  fontSize: "18px",
                }}
              >
                <div
                  style={{
                    position: "relative",

                    display: "flex",

                    alignItems: "center",
                  }}
                >
                  <DropSlot {...getSlotProps("input5")} />

                  <AudioText
                    text="ruler?"
                    audio={rulerAudio}
                    audioId="text-ruler"
                    playingId={playingId}
                    playAudio={playAudio}
                  />
                </div>

                <div
                  style={{
                    position: "relative",

                    display: "flex",

                    alignItems: "center",
                  }}
                >
                  <AudioText
                    text="Yes,"
                    audio={yesAudio}
                    audioId="text-yes"
                    playingId={playingId}
                    playAudio={playAudio}
                    style={{
                      width: "70px",
                    }}
                  />

                  <DropSlot {...getSlotProps("input6")} />
                </div>
              </div>
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
              onClick={handleShowAnswer}
              className="show-answer-btn swal-continue"
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
        {activeWord ? (
          <span
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "#fff",

              fontWeight: "bold",

              boxShadow: "0 5px 15px rgba(0,0,0,.2)",

              display: "inline-block",
            }}
          >
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit5_Page6_Q1;
