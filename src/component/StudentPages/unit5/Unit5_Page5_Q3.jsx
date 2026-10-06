import React, { useRef, useState } from "react";

import deer from "../../../assets/unit5/imgs/U5P44EXEB.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit5_Page5_Q3.css";

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

import { FaVolumeUp } from "react-icons/fa";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import boardAudio from "../../../assets/unit5/sounds/Page 44 - B/Board.mp3";
import bookAudio from "../../../assets/unit5/sounds/Page 44 - B/Book.mp3";
import deskAudio from "../../../assets/unit5/sounds/Page 44 - B/Desk.mp3";
import posterAudio from "../../../assets/unit5/sounds/Page 44 - B/Poster.mp3";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    correct: "poster",
    audio: posterAudio,
  },
  {
    correct: "board",
    audio: boardAudio,
  },
  {
    correct: "book",
    audio: bookAudio,
  },
  {
    correct: "desk",
    audio: deskAudio,
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

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,

  playingWord,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked = keyboardPickedWord === word;

  const isPlaying = playingWord === word;

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
            : `${word}. Press Enter or Space to hear and select this word.`
        }
        onClick={() => {
          if (isDisabled) return;

          playAudio(word, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            playAudio(word, audio);

            onKeyboardPick(word);
          }
        }}
        className={`drag-word-unit5-p5-q3 ${
          isPicked ? "keyboard-picked-word-unit5-p5-q3" : ""
        }`}
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
          className="audio-icon-unit5-p5-q3"
        />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  index,
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
  const droppableId = `slot-${index}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const canFixWrong =
    !!value &&
    isWrong &&
    !keyboardPickedWord &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardDropActive && focusedDropId === droppableId;

  const displayedValue = showPreview ? keyboardPickedWord : value;

  const handleKeyDown = (e) => {
    /* =================================================
       WRONG ANSWER AFTER CHECK
       يرجع للبنك
    ================================================= */

    if (canFixWrong && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =================================================
       TAB BETWEEN TARGETS
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableDropIds();

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

      dropRefs.current[nextId]?.focus();

      return;
    }

    /* =================================================
       DROP
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(index);

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
      className="question-text-unit5-p5-q3"
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);

          dropRefs.current[droppableId] = el;
        }}
        role="button"
        tabIndex={
          locked || showAnswer || checkCompleted
            ? -1
            : keyboardDropActive || canFixWrong
              ? 0
              : -1
        }
        aria-label={
          keyboardDropActive
            ? value
              ? `Answer box ${index + 1} currently contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
              : `Answer box ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}.`
            : canFixWrong
              ? `${value} is incorrect in answer box ${index + 1}. Press Enter or Space to return it to the word bank.`
              : value
                ? `Answer box ${index + 1} contains ${value}.`
                : `Empty answer box ${index + 1}.`
        }
        className={`q-input-unit5-p5-q3 ${isOver ? "drag-over-cell" : ""} ${
          showPreview ? "keyboard-drop-preview-unit5-p5-q3" : ""
        }`}
        onFocus={() => {
          if (keyboardDropActive) {
            setFocusedDropId(droppableId);
          }
        }}
        onBlur={() => setFocusedDropId(null)}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (value && !locked && !showAnswer && !checkCompleted) {
            onRemove(index);
          }
        }}
        style={{
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
      </div>

      {isWrong && (
        <span className="wrong-icon-unit5-p5-q3" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit5_Page5_Q3 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState(Array(data.length).fill(""));

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedInputs, setLockedInputs] = useState([]);

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

  const [playingWord, setPlayingWord] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingWord(null);
  };

  const playAudio = (word, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
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

  const usedWords = new Set(answers.filter(Boolean));

  const isInputLocked = (index) => lockedInputs.includes(index);

  const getAvailableDropIds = () =>
    data
      .map((_, index) => `slot-${index}`)
      .filter((_, index) => !isInputLocked(index));

  const getAudio = (word) => data.find((item) => item.correct === word)?.audio;

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (word, index) => {
    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        إذا نفس الكلمة بمكان ثاني
        شيلها أولًا.
      */

      const oldIndex = updated.findIndex((answer) => answer === word);

      if (oldIndex !== -1 && oldIndex !== index) {
        updated[oldIndex] = "";
      }

      /*
        REPLACE:
        إذا الهدف فيه كلمة ثانية
        بتنرجع للبنك تلقائيًا.
      */

      updated[index] = word;

      return updated;
    });

    /*
      شيل X فقط عن الخانة المعدلة
    */

    setWrongInputs((prev) => prev.filter((wrongIndex) => wrongIndex !== index));
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

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const word = active.id.replace("word-", "");

    const index = Number(String(over.id).replace("slot-", ""));

    placeWord(word, index);
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

  const handleKeyboardDrop = (index) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isInputLocked(index)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    placeWord(word, index);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
      روح لأول كلمة بعدها متاحة
    */

    window.setTimeout(() => {
      const next = data.find(
        (item) => item.correct !== word && !answers.includes(item.correct),
      );

      if (next) {
        bankRefs.current[next.correct]?.focus();
      }
    }, 0);
  };

  /* =================================================
     WRONG SLOT AFTER CHECK
  ================================================= */

  const handleKeyboardClearWrong = (index, currentWord) => {
    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    setWrongInputs((prev) => prev.filter((wrongIndex) => wrongIndex !== index));

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
      رجع لنفس الكلمة بالبنك
    */

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

  const removeAnswer = (index) => {
    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    setWrongInputs((prev) => prev.filter((wrongIndex) => wrongIndex !== index));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((answer) => answer.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    answers.forEach((answer, index) => {
      if (answer.trim().toLowerCase() === data[index].correct.toLowerCase()) {
        correctCount++;

        newlyLocked.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      الصحيح فقط يقفل
    */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      الخطأ يظل editable
    */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    const total = data.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedInputs(data.map((_, index) => index));

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers(data.map((item) => item.correct));

    setWrongInputs([]);

    setLockedInputs(data.map((_, index) => index));

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

    setAnswers(Array(data.length).fill(""));

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);
  };

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
            gap: "50px",
          }}
        >
          <ExerciseHeader
            sectionLetter="B"
            title="Label the things in the classroom."
            subTitle="Drag poster, board, book, and desk to the matching numbered objects."
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

              width: "100%",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {data.map((item) => (
              <DraggableWord
                key={item.correct}
                id={`word-${item.correct}`}
                word={item.correct}
                audio={item.audio}
                disabled={showAnswer || checkCompleted}
                isUsed={usedWords.has(item.correct)}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
                playingWord={playingWord}
                playAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              IMAGE + SLOTS
          ================================================= */}

          <div className="content-unit5-p5-q3">
            <img
              src={deer}
              className="shape-img-unit5-p5-q3"
              alt="A classroom with numbered objects: number 1 is a poster on the wall, number 2 is the board, number 3 is a book on a desk, and number 4 is a desk."
              style={{
                height: "320px",
                width: "auto",
              }}
            />

            <div className="group-input-unit5-p5-q3">
              {data.map((item, index) => (
                <div
                  className="question-row"
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "20px",
                  }}
                >
                  <span
                    className="q-number"
                    style={{
                      color: "#0d47a1",
                      fontWeight: "600",
                      fontSize: "20px",
                    }}
                  >
                    {index + 1}
                  </span>

                  <DropSlot
                    index={index}
                    value={answers[index]}
                    isWrong={wrongInputs.includes(index)}
                    locked={isInputLocked(index)}
                    showAnswer={showAnswer}
                    checkCompleted={checkCompleted}
                    keyboardPickedWord={keyboardPickedWord}
                    focusedDropId={focusedDropId}
                    setFocusedDropId={setFocusedDropId}
                    dropRefs={dropRefs}
                    getAvailableDropIds={getAvailableDropIds}
                    onKeyboardDrop={handleKeyboardDrop}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onRemove={removeAnswer}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
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

export default Unit5_Page5_Q3;
