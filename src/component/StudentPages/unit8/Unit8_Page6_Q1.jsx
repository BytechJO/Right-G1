import React, { useEffect, useRef, useState } from "react";

import deer from "../../../assets/unit8/imgs/U8P69EXED.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit8_Page6_Q1.css"
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

import { FaVolumeUp } from "react-icons/fa";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import armAudio from "../../../assets/unit8/sound/Page 69 - D/arm.mp3";
import eyeAudio from "../../../assets/unit8/sound/Page 69 - D/eye.mp3";
import headAudio from "../../../assets/unit8/sound/Page 69 - D/head.mp3";
import legAudio from "../../../assets/unit8/sound/Page 69 - D/leg.mp3";
import noseAudio from "../../../assets/unit8/sound/Page 69 - D/nose.mp3";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    correct: "head",
    audio: headAudio,
  },
  {
    correct: "eye",
    audio: eyeAudio,
  },
  {
    correct: "nose",
    audio: noseAudio,
  },
  {
    correct: "arm",
    audio: armAudio,
  },
  {
    correct: "leg",
    audio: legAudio,
  },
];

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  item,

  isUsed,
  disabled,

  keyboardPickedWord,
  onKeyboardPick,

  registerRef,

  playingKey,
  onPlayAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${item.correct}`,

    data: {
      word: item.correct,
    },

    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const isKeyboardPicked = keyboardPickedWord === item.correct;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(item.correct, node);
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

      onPlayAudio(`bank-${item.correct}`, item.audio);

      onKeyboardPick(item.correct);
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
      aria-pressed={isKeyboardPicked}
      aria-label={
        isKeyboardPicked
          ? `${item.correct} selected. Choose a numbered blank and press Enter or Space.`
          : `${item.correct}. Press Enter or Space to hear and select.`
      }
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (unavailable) return;

        /*
          Mouse click:
          صوت فقط.

          Mouse drag:
          ما بيشغل صوت.
        */

        onPlayAudio(`bank-${item.correct}`, item.audio);
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

        touchAction: "none",

        position: "relative",
      }}
    >
      {item.correct}

      {playingKey === `bank-${item.correct}` && (
        <FaVolumeUp aria-hidden="true" className="audio-icon-unit8-page6-q1" />
      )}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  index,

  answer,

  isWrong,
  isLocked,

  keyboardPickedWord,
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

  const isKeyboardTarget =
    Boolean(keyboardPickedWord) && keyboardFocusIndex === index && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(index, node);
    }
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

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
        حط أو استبدل
      */

      if (keyboardPickedWord) {
        onKeyboardPlace(index);

        return;
      }

      /*
        filled editable/wrong:
        رجعه للبنك
      */

      if (answer) {
        onRemove(index);
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

  return (
    <div
      className="question-text-unit8-page6-q1"
      style={{
        position: "relative",
      }}
    >
      <div
        ref={setRefs}
        role="button"
        tabIndex={isLocked ? -1 : keyboardPickedWord ? 0 : answer ? 0 : -1}
        aria-disabled={isLocked}
        aria-label={
          isLocked
            ? `Blank ${index + 1}. ${answer}. Correct and locked.`
            : isKeyboardTarget
              ? `Blank ${index + 1}. Press Enter or Space to place ${keyboardPickedWord}. Press Tab or Shift plus Tab to move between blanks.`
              : answer
                ? `Blank ${index + 1}. Current answer ${answer}. Press Enter or Space to return it to the word bank.`
                : `Blank ${index + 1}. Empty. Select a body-part word first.`
        }
        onFocus={() => {
          if (keyboardPickedWord && !isLocked) {
            onSlotFocus(index);
          }
        }}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (isLocked) return;

          e.stopPropagation();

          if (answer && !keyboardPickedWord) {
            onRemove(index);
          }
        }}
        className={`
          q-input-unit8-page6-q1

          ${isOver ? "drag-over-cell" : ""}

          ${isKeyboardTarget ? "keyboard-drop-preview-unit8-page6-q1" : ""}
        `}
        style={{
          background: isOver ? "#e8f0fe" : "transparent",

          transition: "background 0.15s",

          cursor: answer && !isLocked ? "pointer" : "default",

          display: "flex",

          alignItems: "center",

          position: "relative",
        }}
      >
        {/* =================================================
            REAL ANSWER
        ================================================= */}

        {answer && !isKeyboardTarget && (
          <span className="drop-real-value-unit8-page6-q1">{answer}</span>
        )}

        {/* =================================================
            KEYBOARD PREVIEW
        ================================================= */}

        {isKeyboardTarget && keyboardPickedWord && (
          <span className="drop-preview-value-unit8-page6-q1">
            {keyboardPickedWord}
          </span>
        )}

        {/* =================================================
            WRONG X
        ================================================= */}

        {isWrong && !isLocked && (
          <span className="wrong-icon-review6-p1-q3" aria-hidden="true">
            ✕
          </span>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit8_Page6_Q1 = () => {
  const [answers, setAnswers] = useState(Array(data.length).fill(null));

  /*
    null | correct | wrong
  */

  const [results, setResults] = useState(Array(data.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [allCompleted, setAllCompleted] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const bankRefs = useRef({});

  const dropRefs = useRef([]);

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

  const usedWords = new Set(answers.filter(Boolean));

  const activeWord = activeId ? String(activeId).replace("bank-", "") : null;

  const isSlotLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const editableIndexes = () =>
    data.map((_, index) => index).filter((index) => !isSlotLocked(index));

  /* =====================================================
     AUDIO
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

  const registerBankRef = (word, node) => {
    if (node) {
      bankRefs.current[word] = node;
    }
  };

  const registerDropRef = (index, node) => {
    if (node) {
      dropRefs.current[index] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    setKeyboardPickedWord(word);

    const available = editableIndexes();

    if (!available.length) {
      return;
    }

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      dropRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT + TAB
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
      dropRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardWord = (index) => {
    if (
      !keyboardPickedWord ||
      isSlotLocked(index) ||
      showAnswerMode ||
      allCompleted
    ) {
      return;
    }

    const picked = keyboardPickedWord;

    let nextAnswers = null;

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((value) => value === picked);

      /*
        الكلمة الواحدة تستخدم مرة واحدة فقط.
      */

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      /*
        استبدال الموجود.
      */

      updated[index] = picked;

      nextAnswers = updated;

      return updated;
    });

    /*
      تعديل نفس الخانة:
      شيل X عنها فقط.
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      if (!nextAnswers) {
        return;
      }

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const nextWord = data.find((item) => !usedAfter.has(item.correct));

      if (nextWord) {
        bankRefs.current[nextWord.correct]?.focus();
      }
    });
  };

  /* =====================================================
     ESCAPE
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedWord) {
      return;
    }

    const picked = keyboardPickedWord;

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      bankRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     RETURN TO BANK
  ===================================================== */

  const handleRemove = (index) => {
    if (showAnswerMode || isSlotLocked(index)) {
      return;
    }

    const word = answers[index];

    if (!word) return;

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    /*
      شيل wrong state لنفس الخانة فقط.
    */

    setResults((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    requestAnimationFrame(() => {
      bankRefs.current[word]?.focus();
    });
  };

  /* =====================================================
     DRAG START
     بدون صوت
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

    const slotId = String(over.id);

    if (!slotId.startsWith("slot-")) {
      return;
    }

    const index = Number(slotId.replace("slot-", ""));

    if (isSlotLocked(index)) {
      return;
    }

    const word = String(active.id).replace("bank-", "");

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((value) => value === word);

      if (oldIndex !== -1 && oldIndex !== index && !isSlotLocked(oldIndex)) {
        updated[oldIndex] = null;
      }

      updated[index] = word;

      return updated;
    });

    /*
      تعديل نفس الخانة:
      شيل X عنها فقط.
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    const hasEmpty = data.some(
      (_, index) => results[index] !== "correct" && !answers[index],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    data.forEach((item, index) => {
      /*
          الصحيح من Check سابق:
          يظل locked.
        */

      if (results[index] === "correct") {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (answers[index] === item.correct) {
        nextResults[index] = "correct";

        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    const total = data.length;

    const completed = correctCount === total;

    if (completed) {
      setAllCompleted(true);
    }

    const color = completed ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (completed) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showCorrectAnswers = () => {
    stopAudio();

    setAnswers(data.map((item) => item.correct));

    setResults(data.map(() => "correct"));

    setShowAnswerMode(true);

    setAllCompleted(true);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(data.length).fill(null));

    setResults(Array(data.length).fill(null));

    setShowAnswerMode(false);

    setAllCompleted(false);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setKeyboardFocusIndex(null);
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
            gap: "40px",
          }}
        >
          <ExerciseHeader
            sectionLetter="D"
            title="Look and write."
            subTitle="Drag head, eye, nose, arm, and leg to the matching numbered body parts."
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
              <BankChip
                key={item.correct}
                item={item}
                isUsed={usedWords.has(item.correct)}
                disabled={showAnswerMode || allCompleted}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                registerRef={registerBankRef}
                playingKey={playingKey}
                onPlayAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS + IMAGE
          ================================================= */}

          <div className="content-unit5-p5-q3 w-full">
            <div className="group-input-unit5-p5-q3">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="question-row"
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "10px",

                    margin: "10px",
                  }}
                >
                  <span
                    className="q-number"
                    style={{
                      color: "#0d47a1",

                      fontWeight: "700",

                      fontSize: "20px",
                    }}
                  >
                    {index + 1}.
                  </span>

                  <DropSlot
                    index={index}
                    answer={answers[index]}
                    isWrong={results[index] === "wrong"}
                    isLocked={isSlotLocked(index)}
                    keyboardPickedWord={keyboardPickedWord}
                    keyboardFocusIndex={keyboardFocusIndex}
                    onKeyboardPlace={placeKeyboardWord}
                    onKeyboardCancel={cancelKeyboardPick}
                    onMoveKeyboardFocus={moveKeyboardFocus}
                    onSlotFocus={setKeyboardFocusIndex}
                    onRemove={handleRemove}
                    registerRef={registerDropRef}
                  />
                </div>
              ))}
            </div>

            {/* =================================================
                MEANINGFUL INSTRUCTIONAL IMAGE

                مهم:
                الـalt يشرح الأرقام واتجاه الأسهم،
                لأنها المعلومة المطلوبة لحل السؤال.
            ================================================= */}

            <img
              src={deer}
              className="shape-img-unit5-p5-q3"
              alt="A boy standing with numbered arrows pointing to body parts: number 1 points to his head, number 2 points to his eye, number 3 points to his nose, number 4 points to his arm, and number 5 points to his leg."
              style={{
                height: "325px",
                width: "auto",
              }}
            />
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
            className="show-answer-btn swal-continue"
            onClick={showCorrectAnswers}
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
  );
};

export default Unit8_Page6_Q1;
