import React, { useRef, useState } from "react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";

import bat from "../../../assets/unit6/imgs/U6P51EXEE-01.svg";
import cap from "../../../assets/unit6/imgs/U6P51EXEE-02.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page6_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import canSwimAudio from "../../../assets/unit6/sounds/Page 51 - E/Can swim.mp3";
import canAudio from "../../../assets/unit6/sounds/Page 51 - E/Can.mp3";
import cantAudio from "../../../assets/unit6/sounds/Page 51 - E/Can't.mp3";
import cantFlyKiteAudio from "../../../assets/unit6/sounds/Page 51 - E/He can't fly a kite.mp3";

/* =====================================================
   DATA
===================================================== */

const ITEMS = [
  {
    img: bat,
    alt: "A girl swimming in a swimming pool.",
    correct: "can",
    correctInput: "can swim.",
    prefix: "She",
  },
  {
    img: cap,
    alt: "A boy standing beside a kite that he cannot fly.",
    correct: "can't",
    correctInput: "He can't fly a kite.",
    prefix: "",
  },
];

const WORD_OPTIONS = [
  {
    word: "can swim.",
    audio: canSwimAudio,
  },
  {
    word: "He can't fly a kite.",
    audio: cantFlyKiteAudio,
  },
];

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const WordChip = ({
  word,
  audio,
  used,
  showAnswer,
  checkCompleted,

  keyboardPickedWord,
  onKeyboardPick,

  registerBankRef,

  playingId,
  onPlayAudio,
}) => {
  const disabled = used || showAnswer || checkCompleted;

  const isPicked = keyboardPickedWord === word;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,
    disabled,
  });

  const handleKeyboardActivate = () => {
    if (disabled) return;

    onPlayAudio(`word-${word}`, audio);

    onKeyboardPick(isPicked ? null : word);
  };

  return (
    <span
      ref={(el) => {
        setNodeRef(el);
        registerBankRef(word, el);
      }}
      {...(!disabled
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${word} selected. Press Tab to move to an answer area, then press Enter or Space to place it.`
          : `${word}. Press Enter or Space to hear and select this phrase.`
      }
      className={[
        "word-chip",
        "word-chip-accessible-unit6-p6-q2",
        isDragging ? "is-dragging" : "",
        disabled ? "chip-disabled" : "",
        used ? "chip-used" : "",
        isPicked ? "keyboard-picked-unit6-p6-q2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => {
        if (disabled) return;

        // Mouse click يشغل الصوت فقط
        // والـdrag يظل طبيعي
        onPlayAudio(`word-${word}`, audio);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          handleKeyboardActivate();
        }
      }}
      style={{
        position: "relative",
      }}
    >
      {word}

      {playingId === `word-${word}` && (
        <FaVolumeUp
          size={15}
          aria-hidden="true"
          className="audio-icon-unit6-p6-q2"
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
  index,
  value,
  isWrong,
  isLocked,
  showAnswer,
  checkCompleted,
  keyboardPickedWord,
  focusedSlot,
  setFocusedSlot,
  slotRefs,
  getAvailableSlots,
  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,
  onReturn,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    disabled: isLocked || showAnswer || checkCompleted,
  });

  /* =====================================================
     PICKED WORD → TARGET MODE
  ===================================================== */

  const keyboardActive =
    !!keyboardPickedWord && !isLocked && !showAnswer && !checkCompleted;

  /* =====================================================
     NEW PATTERN:
     أي Slot معبّى وغير مقفول يظل داخل Tab
     قبل Check وبعده إذا كان غلط
  ===================================================== */

  const canEditFilled =
    !!value &&
    !keyboardPickedWord &&
    !isLocked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardActive && focusedSlot === index;

  const displayedValue = showPreview ? keyboardPickedWord : value;

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT → RETURN TO BANK
       BEFORE OR AFTER CHECK
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(index, value);
      return;
    }

    if (!keyboardActive) return;

    /* =========================================
       TAB / SHIFT + TAB
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlots();

      if (!available.length) return;

      const currentIndex = available.indexOf(index);

      const nextIndex = e.shiftKey
        ? currentIndex <= 0
          ? available.length - 1
          : currentIndex - 1
        : currentIndex === -1 || currentIndex === available.length - 1
          ? 0
          : currentIndex + 1;

      slotRefs.current[available[nextIndex]]?.focus();

      return;
    }

    /* =========================================
       ENTER / SPACE → PLACE OR REPLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(index);
      return;
    }

    /* =========================================
       ESCAPE → CANCEL
    ========================================= */

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
        slotRefs.current[index] = el;
      }}
      role="button"
      tabIndex={
        isLocked || showAnswer || checkCompleted
          ? -1
          : keyboardActive || canEditFilled
            ? 0
            : -1
      }
      aria-label={
        keyboardActive
          ? value
            ? `Answer area contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
            : `Empty answer area. Press Enter or Space to place ${keyboardPickedWord}.`
          : canEditFilled
            ? `Answer area contains ${value}. Press Enter or Space to return it to the word bank.`
            : value
              ? `Answer area contains ${value}.`
              : "Empty answer area."
      }
      onFocus={() => {
        if (keyboardActive) {
          setFocusedSlot(index);
        }
      }}
      onBlur={() => {
        setFocusedSlot(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (value && !isLocked && !showAnswer && !checkCompleted) {
          onReturn();
        }
      }}
      className={[
        "write-input-unit6-page6-q2",
        isOver ? "slot-over" : "",
        value ? "slot-filled" : "slot-empty",
        isLocked ? "slot-locked" : "",
        !isLocked && value ? "slot-returnable" : "",
        showPreview ? "keyboard-preview-unit6-p6-q2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="slot-value">{displayedValue}</span>

      {isWrong && value && (
        <span className="error-mark" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};
/* =====================================================
   CIRCLE OPTION
===================================================== */

const CircleChoice = ({
  label,
  selected,
  wrong,
  locked,

  audio,
  audioId,

  playingId,
  onPlayAudio,

  onSelect,
}) => {
  const activate = () => {
    /*
      الصوت يظل يشتغل حتى لو الجواب صح ومقفول
    */
    onPlayAudio(audioId, audio);

    if (!locked) {
      onSelect();
    }
  };

  return (
    <div className="circle-wrapper">
      <div
        role="button"
        /*
          خليته tabbable حتى لو locked
          عشان يقدر يسمع الصوت بعد الصح
        */
        tabIndex={0}
        aria-pressed={selected}
        aria-label={
          locked
            ? `Play audio: ${label}`
            : `${label}. Press Enter or Space to hear and choose this option.`
        }
        className={[
          "circle-choice-unit6-page6-q2",
          "circle-choice-accessible-unit6-p6-q2",
          selected ? "active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={activate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            activate();
          }
        }}
        style={{
          position: "relative",
          cursor: "pointer",
        }}
      >
        {label}

        {playingId === audioId && (
          <FaVolumeUp
            size={14}
            aria-hidden="true"
            className="audio-icon-circle-unit6-p6-q2"
          />
        )}
      </div>

      {wrong && (
        <div className="wrong-mark-unit6-page6-q2" aria-hidden="true">
          ✕
        </div>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const Unit6_Page6_Q2 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [selected, setSelected] = useState(["", ""]);

  const [answers, setAnswers] = useState([null, null]);

  /* =================================================
     WRONG STATE
  ================================================= */

  const [wrongCircles, setWrongCircles] = useState([]);

  const [wrongInputs, setWrongInputs] = useState([]);

  /* =================================================
     LOCKS
  ================================================= */

  const [lockedCircles, setLockedCircles] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     DRAG
  ================================================= */

  const [activeWord, setActiveWord] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 5,
      },
    }),
  );

  /* =================================================
     KEYBOARD
  ================================================= */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlot, setFocusedSlot] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef({});

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
     HELPERS
  ================================================= */

  const usedWords = new Set(answers.filter(Boolean));

  const isCircleLocked = (index) => lockedCircles.includes(index);

  const isSlotLocked = (index) => lockedSlots.includes(index);

  const getAvailableSlots = () =>
    ITEMS.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (word, targetIndex) => {
    if (showAnswer || checkCompleted || isSlotLocked(targetIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        unique option:
        remove old occurrence
      */

      const oldIndex = updated.indexOf(word);

      if (oldIndex !== -1 && oldIndex !== targetIndex) {
        updated[oldIndex] = null;
      }

      updated[targetIndex] = word;

      return updated;
    });

    /*
      Clear only same slot X
    */

    setWrongInputs((prev) => prev.filter((index) => index !== targetIndex));
  };

  /* =================================================
     DRAG
  ================================================= */

  const handleDragStart = ({ active }) => {
    const word = String(active.id).replace(/^word-/, "");

    setActiveWord(word);

    const option = WORD_OPTIONS.find((item) => item.word === word);

    if (option) {
      playAudio(`word-${word}`, option.audio);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const word = String(active.id).replace(/^word-/, "");

    const match = String(over.id).match(/^slot-(\d+)$/);

    if (!match) return;

    const targetIndex = Number(match[1]);

    placeWord(word, targetIndex);
  };

  const handleDragCancel = () => {
    setActiveWord(null);
  };

  /* =================================================
     RETURN FROM SLOT
  ================================================= */

  const handleReturn = (index) => {
    if (showAnswer || checkCompleted || isSlotLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (word) => {
    if (!word || showAnswer || checkCompleted || usedWords.has(word)) {
      setKeyboardPickedWord(null);

      return;
    }

    setKeyboardPickedWord(word);

    setFocusedSlot(null);

    window.setTimeout(() => {
      const available = getAvailableSlots();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (targetIndex) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(targetIndex)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    placeWord(word, targetIndex);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    window.setTimeout(() => {
      bankRefs.current[word]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG SLOT → BANK
  ================================================= */

  const handleKeyboardClearWrong = (index, currentWord) => {
    handleReturn(index);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

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

    setFocusedSlot(null);

    if (word) {
      window.setTimeout(() => {
        bankRefs.current[word]?.focus();
      }, 0);
    }
  };

  /* =================================================
     CIRCLE SELECT
  ================================================= */

  const handleSelect = (value, index) => {
    if (showAnswer || checkCompleted || isCircleLocked(index)) {
      return;
    }

    setSelected((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });

    /*
      Clear only same circle X
    */

    setWrongCircles((prev) => prev.filter((i) => i !== index));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (selected.some((value) => value === "")) {
      ValidationAlert.info("Please choose can or can't for all items!");

      return;
    }

    if (answers.some((answer) => !answer)) {
      ValidationAlert.info("Please fill in all the drop boxes!");

      return;
    }

    let score = 0;

    const wrongCircleList = [];

    const wrongInputList = [];

    const correctCircleList = [];

    const correctInputList = [];

    ITEMS.forEach((item, index) => {
      const circleOk = selected[index] === item.correct;

      const inputOk =
        answers[index]?.trim().toLowerCase() ===
        item.correctInput.toLowerCase();

      if (circleOk) {
        score++;

        correctCircleList.push(index);
      } else {
        wrongCircleList.push(index);
      }

      if (inputOk) {
        score++;

        correctInputList.push(index);
      } else {
        wrongInputList.push(index);
      }
    });

    /*
      Progressive lock separately
    */

    setLockedCircles((prev) =>
      Array.from(new Set([...prev, ...correctCircleList])),
    );

    setLockedSlots((prev) =>
      Array.from(new Set([...prev, ...correctInputList])),
    );

    setWrongCircles(wrongCircleList);

    setWrongInputs(wrongInputList);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);

    const total = ITEMS.length * 2;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedCircles(ITEMS.map((_, index) => index));

      setLockedSlots(ITEMS.map((_, index) => index));

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setSelected(ITEMS.map((item) => item.correct));

    setAnswers(ITEMS.map((item) => item.correctInput));

    setWrongCircles([]);

    setWrongInputs([]);

    setLockedCircles(ITEMS.map((_, index) => index));

    setLockedSlots(ITEMS.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setSelected(["", ""]);

    setAnswers([null, null]);

    setWrongCircles([]);

    setWrongInputs([]);

    setLockedCircles([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedSlot(null);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="E"
            title="Look, circle, and write."
            subTitle="Use each picture to complete the sentence with the correct action phrase."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div className="word-bank">
            {WORD_OPTIONS.map((item) => (
              <WordChip
                key={item.word}
                word={item.word}
                audio={item.audio}
                used={usedWords.has(item.word)}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                registerBankRef={(word, el) => {
                  bankRefs.current[word] = el;
                }}
                playingId={playingId}
                onPlayAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              QUESTION CARDS
          ================================================= */}

          <div className="question-grid-unit6-page6-q2">
            {ITEMS.map((item, index) => {
              const circleLocked = isCircleLocked(index);

              const slotLocked = isSlotLocked(index);

              return (
                <div className="question-box-unit4-page5-q1" key={index}>
                  <span className="q-number">{index + 1}</span>

                  <div className="img-option-unit6-p6-q2">
                    {/* IMAGE */}

                    <img
                      src={item.img}
                      alt={item.alt}
                      className="q-img-unit4-page5-q1"
                      style={{
                        height: "auto",
                        width: "200px",
                      }}
                    />

                    {/* =====================================
                          CAN / CAN'T
                      ===================================== */}

                    <div className="choices-unit6-page6-q2">
                      <CircleChoice
                        label="can"
                        selected={selected[index] === "can"}
                        wrong={
                          wrongCircles.includes(index) &&
                          selected[index] === "can"
                        }
                        locked={circleLocked || showAnswer || checkCompleted}
                        audio={canAudio}
                        audioId={`circle-can-${index}`}
                        playingId={playingId}
                        onPlayAudio={playAudio}
                        onSelect={() => handleSelect("can", index)}
                      />

                      <CircleChoice
                        label="can't"
                        selected={selected[index] === "can't"}
                        wrong={
                          wrongCircles.includes(index) &&
                          selected[index] === "can't"
                        }
                        locked={circleLocked || showAnswer || checkCompleted}
                        audio={cantAudio}
                        audioId={`circle-cant-${index}`}
                        playingId={playingId}
                        onPlayAudio={playAudio}
                        onSelect={() => handleSelect("can't", index)}
                      />
                    </div>
                  </div>

                  {/* =====================================
                        DROP ROW
                    ===================================== */}

                  <div className="input-wrapper-unit6-p6-q2">
                    {item.prefix && (
                      <span className="prefix-text">{item.prefix}</span>
                    )}

                    <DropSlot
                      index={index}
                      value={answers[index]}
                      isWrong={wrongInputs.includes(index)}
                      isLocked={slotLocked}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      keyboardPickedWord={keyboardPickedWord}
                      focusedSlot={focusedSlot}
                      setFocusedSlot={setFocusedSlot}
                      slotRefs={slotRefs}
                      getAvailableSlots={getAvailableSlots}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardClearWrong={handleKeyboardClearWrong}
                      onCancelKeyboardPick={handleCancelKeyboardPick}
                      onReturn={() => handleReturn(index)}
                    />
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
          <span className="word-chip overlay-chip">{activeWord}</span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit6_Page6_Q2;
