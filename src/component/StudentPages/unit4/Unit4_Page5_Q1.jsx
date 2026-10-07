import React, { useRef, useState } from "react";

import bat from "../../../assets/unit4/imgs/U4P32ExeA1-01.svg";
import cap from "../../../assets/unit4/imgs/U4P32ExeA1-02.svg";
import ant from "../../../assets/unit4/imgs/U4P32ExeA1-03.svg";
import dad from "../../../assets/unit4/imgs/U4P32ExeA1-04.svg";

import vetAudio from "../../../assets/unit4/Page 32 - A/Vet.mp3";
import feetAudio from "../../../assets/unit4/Page 32 - A/feet.mp3";
import fishAudio from "../../../assets/unit4/Page 32 - A/fish.mp3";
import forkAudio from "../../../assets/unit4/Page 32 - A/fork.mp3";

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

import { FaVolumeUp } from "react-icons/fa";

import "./Unit4_Page5_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

/* ======================================================
   DRAGGABLE WORD
====================================================== */

const DraggableWord = ({
  id,
  word,
  audio,
  disabled,
  isUsed,

  playingWord,
  playWordAudio,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPlaying = playingWord === word;

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
            ? `${word} selected. Press Tab to choose a writing box.`
            : `${word}. Press Enter or Space to select.`
        }
        onClick={(e) => {
          e.stopPropagation();

          if (isDragging) return;

          /*
            Mouse click = audio only
          */
          playWordAudio(word, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            /*
              Audio
            */
            playWordAudio(word, audio);

            /*
              Keyboard drag
            */
            onKeyboardPick(word);
          }
        }}
        className={isPicked ? "keyboard-picked-word-unit4-page5-q1" : ""}
        style={{
          padding: "7px 14px",

          border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

          borderRadius: "8px",

          background: isPicked ? "#dbeafe" : isUsed ? "#f0f2f5" : "white",

          fontWeight: "bold",

          cursor: isDisabled ? "default" : "grab",

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

      {/* AUDIO ICON */}

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
};

/* ======================================================
   DROP SLOT
====================================================== */

/* ======================================================
   DROP SLOT — UPDATED DRAG PATTERN
====================================================== */

const DropSlot = ({
  index,
  value,

  locked,
  isWrong,

  showAnswer,
  checkCompleted,

  keyboardPickedWord,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,

  getAvailableSlotIds,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const id = `slot-${index}`;

  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: locked || showAnswer || checkCompleted,
  });

  /* ======================================================
     PICKED WORD → TARGET MODE
  ====================================================== */

  const keyboardDropActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  /* ======================================================
     NEW DRAG PATTERN

     أي slot معبّى ولسا مش locked
     لازم يضل reachable بالـTab
     حتى قبل Check
  ====================================================== */

  const canEditFilled =
    !!value && !keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardDropActive && focusedSlotId === id;

  const displayValue = showPreview ? keyboardPickedWord.word : value;

  /* ======================================================
     KEYBOARD
  ====================================================== */

  const handleKeyDown = (e) => {
    /* ==================================================
       FILLED SLOT → RETURN WORD TO BANK
    ================================================== */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* ==================================================
       TAB / SHIFT TAB
    ================================================== */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlotIds();

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

      slotRefs.current[nextId]?.focus();

      return;
    }

    /* ==================================================
       ENTER / SPACE → PLACE / REPLACE
    ================================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(index);

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
    <div className="input-wrapper-unit4-page5-q1">
      <div
        ref={(el) => {
          setNodeRef(el);

          slotRefs.current[id] = el;
        }}
        className={`write-input-unit4-page5-q1 ${
          locked ? "correct-color" : ""
        } ${isOver ? "drag-over-cell" : ""} ${
          showPreview ? "keyboard-drop-preview-unit4-page5-q1" : ""
        }`}
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
              ? `${value} is currently in this box. Press Enter or Space to replace it with ${keyboardPickedWord.word}.`
              : `Empty writing box. Press Enter or Space to place ${keyboardPickedWord.word}.`
            : canEditFilled
              ? `${value} is in this writing box. Press Enter or Space to return it to the word bank.`
              : value
                ? `${value} writing box`
                : "Empty writing box"
        }
        onFocus={() => {
          if (keyboardDropActive) {
            setFocusedSlotId(id);
          }
        }}
        onBlur={() => {
          setFocusedSlotId(null);
        }}
        onKeyDown={handleKeyDown}
        style={{
          cursor:
            value && !locked && !showAnswer && !checkCompleted
              ? "pointer"
              : "default",
        }}
      >
        {displayValue && (
          <span
            className="word-item"
            onClick={
              !locked && !showAnswer && !checkCompleted ? onRemove : undefined
            }
            style={{
              cursor: locked ? "default" : "pointer",

              userSelect: "none",

              display: "inline-flex",

              alignItems: "center",

              gap: "3px",
            }}
          >
            {displayValue}
          </span>
        )}
      </div>

      {isWrong && <div className="wrong-mark-unit4-page5-q1">✕</div>}
    </div>
  );
};

/* ======================================================
   MAIN
====================================================== */

const Unit4_Page5_Q1 = () => {
  const items = [
    {
      img: bat,

      alt: "A vet",

      correct: "v",

      correctInput: "vet",

      audio: vetAudio,
    },

    {
      img: cap,

      alt: "Feet",

      correct: "f",

      correctInput: "feet",

      audio: feetAudio,
    },

    {
      img: ant,

      alt: "A fish",

      correct: "f",

      correctInput: "fish",

      audio: fishAudio,
    },

    {
      img: dad,

      alt: "A fork",

      correct: "f",

      correctInput: "fork",

      audio: forkAudio,
    },
  ];

  const wordBank = items.map((item) => ({
    word: item.correctInput,

    audio: item.audio,
  }));

  /* ======================================================
     ANSWERS
  ====================================================== */

  const [selected, setSelected] = useState(["", "", "", ""]);

  const [answers, setAnswers] = useState(["", "", "", ""]);

  /* ======================================================
     WRONG
  ====================================================== */

  const [wrongCircles, setWrongCircles] = useState([]);

  const [wrongInputs, setWrongInputs] = useState([]);

  /* ======================================================
     LOCK CORRECT INDIVIDUALLY
  ====================================================== */

  const [lockedCircles, setLockedCircles] = useState([]);

  const [lockedInputs, setLockedInputs] = useState([]);

  /* ======================================================
     FINAL STATES
  ====================================================== */

  const [showCorrect, setShowCorrect] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* ======================================================
     DRAG
  ====================================================== */

  const [activeWord, setActiveWord] = useState(null);

  /* ======================================================
     KEYBOARD DRAG
  ====================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

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

  const playWordAudio = (word, src) => {
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

  const isCircleLocked = (index) => lockedCircles.includes(index);

  const isInputLocked = (index) => lockedInputs.includes(index);

  const usedWords = new Set(answers.filter(Boolean));

  const getAvailableSlotIds = () =>
    answers
      .map((_, index) => index)
      .filter(
        (index) => !isInputLocked(index) && !showCorrect && !checkCompleted,
      )
      .map((index) => `slot-${index}`);

  const getFirstAvailableWord = (answersArray) => {
    const used = new Set(answersArray.filter(Boolean));

    return wordBank.find((item) => !used.has(item.word))?.word;
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
     MOUSE DRAG
  ====================================================== */

  const onDragStart = ({ active }) => {
    setActiveWord(active.id.replace("bank-", ""));
  };

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showCorrect || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const word = active.id.replace("bank-", "");

    const index = Number(String(over.id).replace("slot-", ""));

    if (isInputLocked(index)) {
      return;
    }

    const sourceIndex = answers.findIndex((item) => item === word);

    if (sourceIndex !== -1 && isInputLocked(sourceIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const source = updated.findIndex((item) => item === word);

      const targetWord = updated[index];

      updated[index] = word;

      /*
          لو الكلمة كانت بمكان ثاني:
          swap
        */

      if (source !== -1 && source !== index) {
        updated[source] = targetWord || "";
      }

      return updated;
    });

    /*
      X فقط عن الخانات
      اللي تغيرت
    */

    setWrongInputs((prev) =>
      prev.filter((i) => i !== index && i !== sourceIndex),
    );
  };

  const onDragCancel = () => {
    setActiveWord(null);
  };

  /* ======================================================
     KEYBOARD PICK
  ====================================================== */

  const handleKeyboardPick = (word) => {
    if (showCorrect || checkCompleted || usedWords.has(word)) {
      return;
    }

    setKeyboardPickedWord({
      word,
    });

    setFocusedSlotId(null);

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* ======================================================
     KEYBOARD DROP
  ====================================================== */

  const handleKeyboardDrop = (index) => {
    if (
      !keyboardPickedWord ||
      showCorrect ||
      checkCompleted ||
      isInputLocked(index)
    ) {
      return;
    }

    const word = keyboardPickedWord.word;

    const updated = [...answers];

    const sourceIndex = updated.findIndex((item) => item === word);

    if (sourceIndex !== -1 && isInputLocked(sourceIndex)) {
      return;
    }

    const targetWord = updated[index];

    updated[index] = word;

    if (sourceIndex !== -1 && sourceIndex !== index) {
      updated[sourceIndex] = targetWord || "";
    }

    setAnswers(updated);

    setWrongInputs((prev) =>
      prev.filter((i) => i !== index && i !== sourceIndex),
    );

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    /*
      بعد التثبيت:
      ارجع لأول كلمة متاحة
    */

    window.setTimeout(() => {
      const firstAvailable = getFirstAvailableWord(updated);

      if (firstAvailable) {
        bankRefs.current[firstAvailable]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     WRONG SLOT AFTER CHECK
  ====================================================== */

  const handleKeyboardClearWrong = (index, currentWord) => {
    if (showCorrect || checkCompleted || isInputLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    /*
      شيل X فقط
      عن نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    /*
      رجّع focus لنفس
      الكلمة بالبنك
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
     CANCEL KEYBOARD PICK
  ====================================================== */

  const handleCancelKeyboardPick = () => {
    const word = keyboardPickedWord?.word;

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (word && bankRefs.current[word]) {
        bankRefs.current[word]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     REMOVE WORD WITH MOUSE
  ====================================================== */

  const removeAnswer = (index) => {
    if (showCorrect || checkCompleted || isInputLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* ======================================================
     F / V SELECT
  ====================================================== */

  const handleSelect = (value, index) => {
    if (showCorrect || checkCompleted || isCircleLocked(index)) {
      return;
    }

    const newSel = [...selected];

    newSel[index] = value;

    setSelected(newSel);

    /*
      X فقط عن نفس
      سؤال الـcircle
    */

    setWrongCircles((prev) => prev.filter((i) => i !== index));
  };

  /* ======================================================
     CHECK
  ====================================================== */

  const checkAnswers = () => {
    if (showCorrect || checkCompleted) {
      return;
    }

    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose f or v for all items!");

      return;
    }

    if (answers.some((a) => a === "")) {
      ValidationAlert.info("Please fill in all the writing boxes!");

      return;
    }

    let score = 0;

    const newWrongCircles = [];

    const newWrongInputs = [];

    const correctCircles = [];

    const correctInputs = [];

    items.forEach((item, index) => {
      const circleCorrect = selected[index] === item.correct;

      const inputCorrect =
        answers[index].toLowerCase() === item.correctInput.toLowerCase();

      if (circleCorrect) {
        score++;

        correctCircles.push(index);
      } else {
        newWrongCircles.push(index);
      }

      if (inputCorrect) {
        score++;

        correctInputs.push(index);
      } else {
        newWrongInputs.push(index);
      }
    });

    /* ==================================================
       LOCK CORRECT CIRCLES ONLY
    ================================================== */

    setLockedCircles((prev) =>
      Array.from(new Set([...prev, ...correctCircles])),
    );

    /* ==================================================
       LOCK CORRECT INPUTS ONLY
    ================================================== */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...correctInputs])));

    /* ==================================================
       WRONG ONLY
    ================================================== */

    setWrongCircles(newWrongCircles);

    setWrongInputs(newWrongInputs);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    const total = items.length * 2;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    /* ==================================================
       ALL CORRECT
    ================================================== */

    if (score === total) {
      setLockedCircles(items.map((_, index) => index));

      setLockedInputs(items.map((_, index) => index));

      setWrongCircles([]);

      setWrongInputs([]);

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

  /* ======================================================
     SHOW ANSWER
  ====================================================== */

  const showAnswers = () => {
    stopAudio();

    setSelected(items.map((item) => item.correct));

    setAnswers(items.map((item) => item.correctInput));

    setWrongCircles([]);

    setWrongInputs([]);

    setLockedCircles(items.map((_, index) => index));

    setLockedInputs(items.map((_, index) => index));

    setShowCorrect(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* ======================================================
     RESET
  ====================================================== */

  const resetAll = () => {
    stopAudio();

    setSelected(["", "", "", ""]);

    setAnswers(["", "", "", ""]);

    setWrongCircles([]);

    setWrongInputs([]);

    setLockedCircles([]);

    setLockedInputs([]);

    setShowCorrect(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* ======================================================
     RENDER
  ====================================================== */

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
            gap: "30px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            questionNumber="1"
            title="Look, circle, and write."
            subTitle="Look at each picture, choose f or v, then drag the correct word to the writing box."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "50px",

              padding: "10px",

              width: "100%",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {wordBank.map((item) => (
              <DraggableWord
                key={item.word}
                id={`bank-${item.word}`}
                word={item.word}
                audio={item.audio}
                disabled={showCorrect || checkCompleted}
                isUsed={usedWords.has(item.word)}
                playingWord={playingWord}
                playWordAudio={playWordAudio}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="question-grid-unit4-page5-q1">
            {items.map((item, index) => {
              const circleLocked = isCircleLocked(index);

              const inputLocked = isInputLocked(index);

              return (
                <div className="question-box-unit4-page5-q1" key={index}>
                  <img
                    src={item.img}
                    className="q-img-unit4-page5-q1"
                    alt={item.alt}
                  />

                  {/* =========================
                        F / V OPTIONS
                    ========================= */}

                  <div className="choices-unit4-page5-q1">
                    {["f", "v"].map((letter) => {
                      const isSelected = selected[index] === letter;

                      const isWrong =
                        wrongCircles.includes(index) && isSelected;

                      const disabled =
                        circleLocked || showCorrect || checkCompleted;

                      return (
                        <div className="circle-wrapper" key={letter}>
                          <div
                            className={`circle-choice-unit4-page5-q1 ${
                              isSelected ? "active" : ""
                            } ${circleLocked ? "correct-color" : ""}`}
                            role="button"
                            tabIndex={disabled ? -1 : 0}
                            aria-disabled={disabled}
                            aria-pressed={isSelected}
                            aria-label={`Choose letter ${letter} for ${item.alt}${
                              isSelected ? ", selected" : ""
                            }`}
                            onClick={() => handleSelect(letter, index)}
                            onKeyDown={(e) => {
                              if (disabled) {
                                return;
                              }

                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                handleSelect(letter, index);
                              }
                            }}
                          >
                            {letter}
                          </div>

                          {isWrong && (
                            <div className="wrong-mark-unit4-page5-q1">✕</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* =========================
                        DROP SLOT
                    ========================= */}

                  <DropSlot
                    index={index}
                    value={answers[index]}
                    locked={inputLocked}
                    isWrong={wrongInputs.includes(index)}
                    showAnswer={showCorrect}
                    checkCompleted={checkCompleted}
                    keyboardPickedWord={keyboardPickedWord}
                    focusedSlotId={focusedSlotId}
                    setFocusedSlotId={setFocusedSlotId}
                    slotRefs={slotRefs}
                    getAvailableSlotIds={getAvailableSlotIds}
                    onKeyboardDrop={handleKeyboardDrop}
                    onKeyboardClearWrong={handleKeyboardClearWrong}
                    onCancelKeyboardPick={handleCancelKeyboardPick}
                    onRemove={() => removeAnswer(index)}
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
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
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

export default Unit4_Page5_Q1;
