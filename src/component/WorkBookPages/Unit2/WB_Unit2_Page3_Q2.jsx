import React, { useRef, useState } from "react";

import bat from "../../../assets/U1 WB/U2/U2P11EXEF-01.svg";
import cap from "../../../assets/U1 WB/U2/U2P11EXEF-02.svg";
import ant from "../../../assets/U1 WB/U2/U2P11EXEF-03.svg";
import dad from "../../../assets/U1 WB/U2/U2P11EXEF-04.svg";

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

import "./WB_Unit2_Page3_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* ======================================================
   AUDIOS
====================================================== */

import tuesdayAudio from "../../../assets/U1 WB/U2/page_11/Item_001_Tuesday.mp3";
import saturdayAudio from "../../../assets/U1 WB/U2/page_11/Item_002_Saturday.mp3";
import sundayAudio from "../../../assets/U1 WB/U2/page_11/Item_003_Sunday.mp3";
import thursdayAudio from "../../../assets/U1 WB/U2/page_11/Item_004_Thursday.mp3";

/* ======================================================
   DATA
====================================================== */

const correctAnswers = ["Saturday", "Tuesday", "Thursday", "Sunday"];

const wordBank = [
  {
    word: "Tuesday",
    audio: tuesdayAudio,
  },
  {
    word: "Saturday",
    audio: saturdayAudio,
  },
  {
    word: "Sunday",
    audio: sundayAudio,
  },
  {
    word: "Thursday",
    audio: thursdayAudio,
  },
];

const images = [
  {
    src: bat,
    alt: "Calendar clue for Saturday.",
  },
  {
    src: cap,
    alt: "Calendar clue for Tuesday.",
  },
  {
    src: ant,
    alt: "Calendar clue for Thursday.",
  },
  {
    src: dad,
    alt: "Calendar clue for Sunday.",
  },
];

/* ======================================================
   BANK WORD
====================================================== */

function BankWord({
  id,
  word,
  audio,

  isUsed,
  disabled,

  playingWord,
  onPlayAudio,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    data: {
      word,
      source: "bank",
    },

    disabled: isUsed || disabled,
  });

  const isPlaying = playingWord === word;

  const isDisabled = isUsed || disabled;

  const isPicked = keyboardPickedWord?.word === word;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
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
            ? `${word} selected. Use Tab to choose an answer blank, then press Enter or Space.`
            : `${word}. Press Enter or Space to select.`
        }
        onClick={(e) => {
          e.stopPropagation();

          if (isDragging) {
            return;
          }

          /*
            Mouse click:
            الصوت فقط.
          */

          onPlayAudio(word, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) {
            return;
          }

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            /*
              شغل الصوت.
            */

            onPlayAudio(word, audio);

            /*
              امسك الخيار بالكيبورد.
            */

            onKeyboardPick(word);
          }
        }}
        className={isPicked ? "keyboard-picked-word-wb-u2-p3-q2" : ""}
        style={{
          padding: "7px 14px",

          border: "2px solid #2c5287",

          borderRadius: "8px",

          background: isPicked ? "#dbeafe" : "white",

          fontWeight: "bold",

          cursor: isDisabled ? "pointer" : "grab",

          opacity: isDragging ? 0.4 : isUsed ? 0.5 : 1,

          userSelect: "none",

          touchAction: "none",

          display: "inline-block",

          transition: "all 0.2s ease",

          ...(isUsed
            ? {
                borderColor: "#ccc",
                color: "#aaa",
              }
            : {}),
        }}
      >
        {word}
      </span>

      {isPlaying && (
        <FaVolumeUp
          size={16}
          aria-hidden="true"
          style={{
            position: "absolute",

            top: "-8px",

            right: "-8px",

            background: "white",

            borderRadius: "50%",

            padding: "2px",

            pointerEvents: "none",

            zIndex: 10,
          }}
        />
      )}
    </span>
  );
}

/* ======================================================
   DROPPABLE INPUT
====================================================== */

function DroppableInput({
  id,

  value,

  errorClass,

  isWrong,

  locked,

  showAnswer,

  checkCompleted,

  keyboardPickedWord,

  focusedInputId,

  setFocusedInputId,

  inputRefs,

  getAvailableInputIds,

  onKeyboardDrop,

  onKeyboardClearWrong,

  onCancelKeyboardPick,

  onClear,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: locked || showAnswer || checkCompleted,
  });

  /* ======================================================
     KEYBOARD DROP ACTIVE
  ====================================================== */

  const keyboardDropActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  /* ======================================================
     WRONG FILLED INPUT
  ====================================================== */

  const canFixWrong =
    !!value &&
    isWrong &&
    !keyboardPickedWord &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const showKeyboardPreview = keyboardDropActive && focusedInputId === id;

  const displayValue = showKeyboardPreview ? keyboardPickedWord.word : value;

  const handleKeyDown = (e) => {
    /* ==================================================
       WRONG INPUT AFTER CHECK
       ENTER -> CLEAR -> RETURN TO BANK
    ================================================== */

    if (canFixWrong && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(id, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* ==================================================
       TAB / SHIFT TAB
       بين الـinputs المفتوحة فقط
    ================================================== */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableInputIds();

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

      const nextId = available[nextIndex];

      inputRefs.current[nextId]?.focus();

      return;
    }

    /* ==================================================
       ENTER / SPACE = DROP
    ================================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(id);

      return;
    }

    /* ==================================================
       ESCAPE
    ================================================== */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <div
      className="input-wrapper-unit3-page6-q1"
      style={{
        position: "relative",
      }}
    >
      <input
        ref={(el) => {
          setNodeRef(el);

          inputRefs.current[id] = el;
        }}
        type="text"
        className={`q-input-wb-unit2-page3-q2 ${
          isOver && !locked && !showAnswer ? "drag-over-cell" : ""
        } ${showKeyboardPreview ? "keyboard-preview-input-wb-u2-p3-q2" : ""}`}
        value={displayValue}
        readOnly
        disabled={locked || showAnswer || checkCompleted}
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
              ? `Answer blank currently contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord.word}.`
              : `Empty answer blank. Press Enter or Space to place ${keyboardPickedWord.word}.`
            : canFixWrong
              ? `${value}. Incorrect answer. Press Enter or Space to remove it and return to the word choices.`
              : "Answer blank"
        }
        onFocus={() => {
          if (keyboardDropActive) {
            setFocusedInputId(id);
          }
        }}
        onBlur={() => {
          setFocusedInputId(null);
        }}
        onClick={() => {
          /*
            Mouse:
            نفس سلوكك القديم.
          */

          if (value && !locked && !showAnswer && !checkCompleted) {
            onClear(id);
          }
        }}
        onKeyDown={handleKeyDown}
        style={{
          background: isOver && !locked && !showAnswer ? "#e3f2fd" : "white",

          cursor:
            value && !locked && !showAnswer && !checkCompleted
              ? "pointer"
              : "default",
        }}
      />

      {isWrong && <span className={errorClass}>✕</span>}
    </div>
  );
}

/* ======================================================
   MAIN
====================================================== */

const WB_Unit2_Page3_Q2 = () => {
  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([]);

  /*
    الصح يتقفل لحاله.
  */

  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  /*
    true فقط عند النجاح الكامل.
  */

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* ======================================================
     KEYBOARD DRAG
  ====================================================== */

  const bankRefs = useRef({});

  const inputRefs = useRef({});

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedInputId, setFocusedInputId] = useState(null);

  /* ======================================================
     AUDIO
  ====================================================== */

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
    if (!src) {
      return;
    }

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
      audio.currentTime = 0;

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

  /* ======================================================
     HELPERS
  ====================================================== */

  const isInputLocked = (index) => lockedInputs.includes(index);

  const usedWords = answers.filter((word) => word !== "");

  const getAvailableInputIds = () =>
    answers
      .map((_, index) => index)
      .filter(
        (index) => !isInputLocked(index) && !showAnswer && !checkCompleted,
      )
      .map((index) => `input-${index}`);

  const getFirstAvailableWord = (answersArray) => {
    const used = answersArray.filter(Boolean);

    return wordBank.find((item) => !used.includes(item.word))?.word;
  };

  /* ======================================================
     KEYBOARD PICK FROM BANK
  ====================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted || usedWords.includes(word)) {
      return;
    }

    setKeyboardPickedWord({
      word,
      source: "bank",
    });

    setFocusedInputId(null);

    requestAnimationFrame(() => {
      const available = getAvailableInputIds();

      if (!available.length) {
        return;
      }

      inputRefs.current[available[0]]?.focus();
    });
  };

  /* ======================================================
     NEW DRAG PATTERN:
     WRONG INPUT -> ENTER
     CLEAR IT -> RETURN TO BANK
  ====================================================== */

  const handleKeyboardClearWrong = (cellId, currentWord) => {
    const index = Number(cellId.replace("input-", ""));

    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    /*
      شيل X فقط
      عن نفس الخانة.
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardPickedWord(null);

    setFocusedInputId(null);

    /*
      رجع على نفس الخيار
      اللي انشال من الخانة.
    */

    window.setTimeout(() => {
      if (currentWord && bankRefs.current[currentWord]) {
        bankRefs.current[currentWord]?.focus();

        return;
      }

      const firstAvailable = getFirstAvailableWord(updated);

      if (firstAvailable) {
        bankRefs.current[firstAvailable]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     KEYBOARD DROP
  ====================================================== */

  const handleKeyboardDrop = (inputId) => {
    if (!keyboardPickedWord || showAnswer || checkCompleted) {
      return;
    }

    const targetIndex = Number(inputId.replace("input-", ""));

    if (isInputLocked(targetIndex)) {
      return;
    }

    const word = keyboardPickedWord.word;

    const updated = [...answers];

    /*
      الكلمة تستخدم مرة واحدة.
    */

    const sourceIndex = updated.findIndex((item) => item === word);

    if (sourceIndex !== -1 && isInputLocked(sourceIndex)) {
      return;
    }

    /*
      لو الهدف فيه كلمة،
      بتصير هاي الكلمة ترجع للبنك.
    */

    if (sourceIndex !== -1) {
      updated[sourceIndex] = updated[targetIndex] || "";
    }

    updated[targetIndex] = word;

    setAnswers(updated);

    /*
      X فقط عن الأماكن
      اللي تغيرت.
    */

    setWrongInputs((prev) =>
      prev.filter((index) => index !== targetIndex && index !== sourceIndex),
    );

    setKeyboardPickedWord(null);

    setFocusedInputId(null);

    /*
      بعد التثبيت:
      رجع لأول خيار متاح.
    */

    window.setTimeout(() => {
      const firstAvailable = getFirstAvailableWord(updated);

      if (firstAvailable) {
        bankRefs.current[firstAvailable]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     CANCEL KEYBOARD PICK
  ====================================================== */

  const handleCancelKeyboardPick = () => {
    const pickedWord = keyboardPickedWord?.word;

    setKeyboardPickedWord(null);

    setFocusedInputId(null);

    window.setTimeout(() => {
      if (pickedWord && bankRefs.current[pickedWord]) {
        bankRefs.current[pickedWord]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     SENSORS
  ====================================================== */

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

  /* ======================================================
     DRAG START
  ====================================================== */

  const handleDragStart = (event) => {
    const word = event.active.data.current?.word;

    if (word) {
      setActiveWord(word);
      return;
    }

    setActiveWord(event.active.id.replace("word-", ""));
  };

  /* ======================================================
     DRAG END
  ====================================================== */

  const handleDragEnd = (event) => {
    setActiveWord(null);

    const { active, over } = event;

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("input-")) {
      return;
    }

    const word = active.data.current?.word ?? active.id.replace("word-", "");

    const targetIndex = Number(String(over.id).replace("input-", ""));

    /*
      الخانة الصح المقفلة
      ما بتتعدل.
    */

    if (isInputLocked(targetIndex)) {
      return;
    }

    /*
      مكان الكلمة القديم.
    */

    const sourceIndex = answers.findIndex((item) => item === word);

    /*
      لو الكلمة بخانة صح
      مقفلة ممنوع نقلها.
    */

    if (sourceIndex !== -1 && isInputLocked(sourceIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const source = updated.findIndex((w) => w === word);

      if (source === targetIndex) {
        return prev;
      }

      const targetWord = updated[targetIndex];

      updated[targetIndex] = word;

      /*
          Swap
        */

      if (source !== -1) {
        updated[source] = targetWord || "";
      }

      return updated;
    });

    /*
      شيل X فقط عن
      الخانات المتغيرة.
    */

    setWrongInputs((prev) =>
      prev.filter((i) => i !== targetIndex && i !== sourceIndex),
    );
  };

  const handleDragCancel = () => {
    setActiveWord(null);
  };

  /* ======================================================
     CLEAR WITH MOUSE
  ====================================================== */

  const handleClear = (cellId) => {
    const index = Number(cellId.replace("input-", ""));

    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    /*
      شيل X فقط عن نفس الخانة.
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* ======================================================
     CHECK
  ====================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let score = 0;

    const wrong = [];

    const correctTemp = [];

    answers.forEach((ans, index) => {
      if (ans === correctAnswers[index]) {
        score++;

        correctTemp.push(index);
      } else {
        wrong.push(index);
      }
    });

    /* ====================================================
       LOCK CORRECT ONLY
    ==================================================== */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...correctTemp])));

    /* ====================================================
       WRONG ONLY
    ==================================================== */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setFocusedInputId(null);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    /* ====================================================
       ALL CORRECT
    ==================================================== */

    if (score === total) {
      setLockedInputs(correctAnswers.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* ======================================================
     SHOW ANSWER
  ====================================================== */

  const showAnswers = () => {
    stopAudio();

    setAnswers([...correctAnswers]);

    setWrongInputs([]);

    setLockedInputs(correctAnswers.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedInputId(null);
  };

  /* ======================================================
     RESET
  ====================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(["", "", "", ""]);

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedInputId(null);
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
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
            sectionLetter="F"
            title="Look, read, and write."
            subTitle="Find the highlighted date pattern, then drag the correct day name to the calendar."
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
            }}
          >
            {wordBank.map((item) => (
              <BankWord
                key={item.word}
                id={`word-${item.word}`}
                word={item.word}
                audio={item.audio}
                isUsed={usedWords.includes(item.word)}
                disabled={showAnswer || checkCompleted}
                playingWord={playingWord}
                onPlayAudio={playAudio}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              ROWS
          ================================================= */}

          <div className="row-content10-wb-unit2-page3-q2 w-full">
            {images.map((image, index) => {
              const locked = isInputLocked(index);

              return (
                <div
                  key={index}
                  className="row2-unit3-page6-q1"
                  style={{
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",

                      gap: "10px",
                    }}
                  >
                    <span className="num-span">{index + 1}</span>

                    <img
                      src={image.src}
                      alt={image.alt}
                      className="q-img-wb-unit2-page3-q2"
                    />
                  </div>

                  <DroppableInput
                    id={`input-${index}`}
                    value={answers[index]}
                    errorClass="error-mark-input-wb-unit2-page3-q2"
                    isWrong={wrongInputs.includes(index)}
                    locked={locked}
                    showAnswer={showAnswer}
                    checkCompleted={checkCompleted}
                    keyboardPickedWord={keyboardPickedWord}
                    focusedInputId={focusedInputId}
                    setFocusedInputId={setFocusedInputId}
                    inputRefs={inputRefs}
                    getAvailableInputIds={getAvailableInputIds}
                    onKeyboardDrop={handleKeyboardDrop}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onClear={handleClear}
                  />
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
        {activeWord && (
          <span
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              cursor: "grabbing",

              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {activeWord}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit2_Page3_Q2;
