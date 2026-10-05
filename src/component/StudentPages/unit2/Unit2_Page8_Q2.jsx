import React, { useRef, useState } from "react";

import deer from "../../../assets/unit1/imgs/deer flip.svg";
import taxi from "../../../assets/unit1/imgs/taxi_1.svg";
import table from "../../../assets/unit1/imgs/table2.jpg";
import dish from "../../../assets/unit1/imgs/dish3.jpg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Unit2_Page8_Q2.css";

import sentence1Audio from "../../../assets/unit2/Page 17 - E/The deer is brown.mp3";
import sentence2Audio from "../../../assets/unit2/Page 17 - E/My brother takes a taxi.mp3";
import sentence3Audio from "../../../assets/unit2/Page 17 - E/The table is round.mp3";
import sentence4Audio from "../../../assets/unit2/Page 17 - E/The dish is white.mp3";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DRAGGABLE WORD — BANK
===================================================== */

function DraggableWord({
  word,
  isUsed,
  disabled,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,

    data: {
      word,
      source: "bank",
    },

    disabled: isUsed || disabled,
  });

  const isDisabled = isUsed || disabled;

  const isPicked =
    keyboardPickedWord?.word === word && keyboardPickedWord?.source === "bank";

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[word] = el;
      }}
      {...(isDisabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      className={`word-item-unit2-p8-q2 ${isUsed ? "used" : ""} ${
        isPicked ? "keyboard-picked-word" : ""
      }`}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${word} selected. Choose a blank and press Enter.`
          : `${word}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (isDisabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(word);
          return;
        }

        listeners?.onKeyDown?.(e);
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: isPicked ? "#dbeafe" : "white",
        fontWeight: "bold",

        cursor: isDisabled ? "default" : "grab",

        opacity: isDragging ? 0.4 : 1,

        display: "inline-block",

        touchAction: "none",
      }}
    >
      {word}
    </span>
  );
}

/* =====================================================
   WORD ALREADY INSIDE SLOT
===================================================== */

function PlacedWord({
  word,
  slotIndex,

  locked,
  showAnswer,
  checkCompleted,

  onKeyboardPickPlaced,

  placedRefs,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${slotIndex}`,

    data: {
      word,
      source: "slot",
      sourceIndex: slotIndex,
    },

    disabled: locked || showAnswer || checkCompleted,
  });

  const disabled = locked || showAnswer || checkCompleted;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        placedRefs.current[slotIndex] = el;
      }}
      {...(disabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? -1 : 0}
      aria-label={
        disabled
          ? undefined
          : `${word}. Press Enter or Space to move this word.`
      }
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPickPlaced(word, slotIndex);
        }
      }}
      className="placed-word-unit2-p8-q2"
      style={{
        cursor: disabled ? "default" : "grab",

        opacity: isDragging ? 0.4 : 1,

        display: "inline-block",

        touchAction: "none",
      }}
    >
      {word}
    </span>
  );
}

/* =====================================================
   DROPPABLE INLINE SLOT
===================================================== */

function DroppableSlot({
  id,
  index,

  value,
  isWrong,

  locked,
  showAnswer,
  checkCompleted,

  keyboardPickedWord,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,
  placedRefs,

  getAvailableSlotIndexes,

  onKeyboardDrop,
  onKeyboardPickPlaced,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const showKeyboardPreview = keyboardActive && focusedSlotId === id;

  return (
    <span className="drop-slot-wrapper-unit2-p8-q2">
      <span
        ref={(el) => {
          setNodeRef(el);

          slotRefs.current[index] = el;
        }}
        className={[
          "drop-slot-inline-unit2-p8-q2",

          isWrong ? "wrong" : "",

          isOver && !locked && !showAnswer ? "drag-over-cell" : "",

          showKeyboardPreview ? "keyboard-slot-active-unit2-p8-q2" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role={keyboardActive ? "button" : undefined}
        tabIndex={keyboardActive ? 0 : -1}
        aria-label={
          keyboardActive
            ? value
              ? `Blank contains ${value}. Press Enter to place ${keyboardPickedWord.word}.`
              : `Empty blank. Press Enter to place ${keyboardPickedWord.word}.`
            : undefined
        }
        onFocus={(e) => {
          if (!keyboardActive) {
            e.currentTarget.blur();

            setFocusedSlotId(null);

            return;
          }

          setFocusedSlotId(id);
        }}
        onBlur={() => {
          setFocusedSlotId(null);
        }}
        onKeyDown={(e) => {
          if (!keyboardActive) {
            return;
          }

          /* =========================================
             TAB BETWEEN AVAILABLE SLOTS
          ========================================= */

          if (e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();

            const available = getAvailableSlotIndexes();

            if (available.length === 0) {
              return;
            }

            const currentPosition = available.indexOf(index);

            let nextPosition;

            if (e.shiftKey) {
              nextPosition =
                currentPosition <= 0
                  ? available.length - 1
                  : currentPosition - 1;
            } else {
              nextPosition =
                currentPosition === -1 ||
                currentPosition === available.length - 1
                  ? 0
                  : currentPosition + 1;
            }

            const nextIndex = available[nextPosition];

            slotRefs.current[nextIndex]?.focus();

            return;
          }

          /* =========================================
             ENTER / SPACE = PLACE
          ========================================= */

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardDrop(index);
          }
        }}
        style={{
          position: "relative",

          cursor: keyboardActive ? "pointer" : "default",
        }}
      >
        {/* =========================================
            BLINKING KEYBOARD PREVIEW
        ========================================= */}

        {showKeyboardPreview ? (
          <span
            className="keyboard-word-preview-unit2-p8-q2"
            aria-hidden="true"
          >
            {keyboardPickedWord.word}
          </span>
        ) : value ? (
          <PlacedWord
            word={value}
            slotIndex={index}
            locked={locked}
            showAnswer={showAnswer}
            checkCompleted={checkCompleted}
            onKeyboardPickPlaced={onKeyboardPickPlaced}
            placedRefs={placedRefs}
          />
        ) : (
          ""
        )}
      </span>

      {isWrong && <span className="error-mark-input">✕</span>}
    </span>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit2_Page8_Q2 = () => {
  const correctAnswers = ["deer", "taxi", "table", "dish"];

  const rows = [
    {
      before: "The",
      after: "is brown.",
      img: deer,
      alt: "deer",
      audio: sentence1Audio,
    },

    {
      before: "My brother takes a",
      after: ".",
      img: taxi,
      alt: "taxi",
      audio: sentence2Audio,
    },

    {
      before: "The",
      after: "is round.",
      img: table,
      alt: "table",
      audio: sentence3Audio,
    },

    {
      before: "The",
      after: "is white.",
      img: dish,
      alt: "dish",
      audio: sentence4Audio,
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([false, false, false, false]);

  const [lockedRows, setLockedRows] = useState([false, false, false, false]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  const placedRefs = useRef({});

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const [speakingRow, setSpeakingRow] = useState(null);

  const sentenceAudioRef = useRef(null);

  /* =====================================================
     SENTENCE AUDIO
  ===================================================== */

  const stopSentenceAudio = () => {
    if (!sentenceAudioRef.current) {
      setSpeakingRow(null);
      return;
    }

    sentenceAudioRef.current.pause();

    sentenceAudioRef.current.currentTime = 0;

    sentenceAudioRef.current = null;

    setSpeakingRow(null);
  };

  const playSentenceAudio = (index) => {
    /*
      نفس شرط الكود الأصلي:
      الصوت فقط لما الجملة صح ومقفلة
      أو Show Answer.
    */

    if (!lockedRows[index] && !showAnswer) {
      return;
    }

    const src = rows[index]?.audio;

    if (!src) {
      return;
    }

    stopSentenceAudio();

    const audio = new Audio(src);

    sentenceAudioRef.current = audio;

    setSpeakingRow(index);

    audio.play().catch(() => {
      setSpeakingRow(null);

      sentenceAudioRef.current = null;
    });

    audio.onended = () => {
      setSpeakingRow(null);

      sentenceAudioRef.current = null;
    };
  };

  /* =====================================================
     AVAILABLE SLOTS
  ===================================================== */

  const getAvailableSlotIndexes = () => {
    return answers
      .map((_, index) => index)
      .filter((index) => !lockedRows[index] && !showAnswer && !checkCompleted);
  };

  /* =====================================================
     KEYBOARD PICK FROM BANK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted || answers.includes(word)) {
      return;
    }

    setKeyboardPickedWord({
      word,
      source: "bank",
    });

    requestAnimationFrame(() => {
      const available = getAvailableSlotIndexes();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PICK FROM PLACED SLOT
  ===================================================== */

  const handleKeyboardPickPlaced = (word, sourceIndex) => {
    if (showAnswer || checkCompleted || lockedRows[sourceIndex]) {
      return;
    }

    setKeyboardPickedWord({
      word,
      source: "slot",
      sourceIndex,
    });

    requestAnimationFrame(() => {
      const available = getAvailableSlotIndexes();

      const firstOther = available.find((index) => index !== sourceIndex);

      const targetIndex = firstOther ?? available[0];

      if (targetIndex === undefined) {
        return;
      }

      slotRefs.current[targetIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DROP
     REPLACE / SWAP
  ===================================================== */

  const handleKeyboardDrop = (targetIndex) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      lockedRows[targetIndex]
    ) {
      return;
    }

    const picked = keyboardPickedWord;

    const updated = [...answers];

    const oldTargetWord = updated[targetIndex];

    /* =========================================
         FROM PLACED SLOT → SWAP
      ========================================= */

    if (picked.source === "slot" && picked.sourceIndex !== undefined) {
      const sourceIndex = picked.sourceIndex;

      if (sourceIndex === targetIndex) {
        setKeyboardPickedWord(null);

        setFocusedSlotId(null);

        return;
      }

      if (lockedRows[sourceIndex]) {
        return;
      }

      updated[sourceIndex] = oldTargetWord || "";
    }

    /*
        FROM BANK:
        إذا الهدف فيه كلمة،
        القديمة ترجع للـ bank تلقائيًا
        لأنها لن تكون داخل answers.
      */

    updated[targetIndex] = picked.word;

    setAnswers(updated);

    /* =========================================
         REMOVE X ONLY FROM CHANGED SLOTS
      ========================================= */

    setWrongInputs((prev) => {
      const next = [...prev];

      next[targetIndex] = false;

      if (picked.source === "slot" && picked.sourceIndex !== undefined) {
        next[picked.sourceIndex] = false;
      }

      return next;
    });

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    /*
        بعد drop:
        من slot → focus على الكلمة بالمكان الجديد.
        من bank → focus على نفس كلمة البنك.
      */

    setTimeout(() => {
      if (picked.source === "slot") {
        placedRefs.current[targetIndex]?.focus();
      } else {
        bankRefs.current[picked.word]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     SENSORS
  ===================================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
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

    const overId = String(over.id);

    if (!overId.startsWith("slot-")) {
      return;
    }

    const newIndex = Number(overId.split("-")[1]);

    if (lockedRows[newIndex]) {
      return;
    }

    const dragData = active.data.current;

    if (!dragData) {
      return;
    }

    const { word, source, sourceIndex } = dragData;

    if (!word) {
      return;
    }

    const updated = [...answers];

    const oldTargetWord = updated[newIndex];

    /* =========================================
         DRAG FROM PLACED SLOT
         → SWAP
      ========================================= */

    if (source === "slot" && sourceIndex !== undefined) {
      if (lockedRows[sourceIndex]) {
        return;
      }

      if (sourceIndex === newIndex) {
        return;
      }

      updated[sourceIndex] = oldTargetWord || "";
    }

    /* =========================================
         BANK → TARGET
         REPLACES TARGET WORD
      ========================================= */

    updated[newIndex] = word;

    setAnswers(updated);

    setWrongInputs((prev) => {
      const next = [...prev];

      next[newIndex] = false;

      if (source === "slot" && sourceIndex !== undefined) {
        next[sourceIndex] = false;
      }

      return next;
    });
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((ans) => ans === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the blanks before checking!",
      );

      return;
    }

    let score = 0;

    const newWrong = [false, false, false, false];

    const newlyLocked = [false, false, false, false];

    answers.forEach((ans, index) => {
      if (ans === correctAnswers[index]) {
        score++;

        newlyLocked[index] = true;
      } else {
        newWrong[index] = true;
      }
    });

    /* =========================================
       LOCK ONLY CORRECT
    ========================================= */

    setLockedRows((prev) =>
      prev.map((locked, index) => locked || newlyLocked[index]),
    );

    /* =========================================
       X ONLY WRONG
    ========================================= */

    setWrongInputs(newWrong);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    /* =========================================
       ALL CORRECT
    ========================================= */

    if (score === total) {
      setLockedRows([true, true, true, true]);

      setWrongInputs([false, false, false, false]);

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswerFun = () => {
    stopSentenceAudio();

    setAnswers([...correctAnswers]);

    setWrongInputs([false, false, false, false]);

    setLockedRows([true, true, true, true]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopSentenceAudio();

    setAnswers(["", "", "", ""]);

    setWrongInputs([false, false, false, false]);

    setLockedRows([false, false, false, false]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     ACTIVE WORD
  ===================================================== */

  let activeWord = null;

  if (activeId) {
    const id = String(activeId);

    if (id.startsWith("word-")) {
      activeWord = id.replace("word-", "");
    }

    if (id.startsWith("placed-")) {
      const index = Number(id.replace("placed-", ""));

      activeWord = answers[index];
    }
  }

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
            gap: "20px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="E"
            title="Read, look, and write."
            subTitle="Use each picture clue to drag the correct word into the sentence."
          />

          {/* =========================================
              WORD BANK
          ========================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              width: "100%",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {correctAnswers.map((word) => (
              <DraggableWord
                key={word}
                word={word}
                isUsed={answers.includes(word)}
                disabled={showAnswer || checkCompleted}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =========================================
              SENTENCES
          ========================================= */}

          <div className="row-content22">
            {rows.map((row, i) => {
              const isLocked = lockedRows[i];

              const canPlaySentence = isLocked || showAnswer;

              const isSpeaking = speakingRow === i;

              return (
                <div key={i} className="row2">
                  <span
                    className="text-[18px]"
                    style={{
                      display: "inline-flex",

                      alignItems: "center",

                      gap: "4px",
                    }}
                  >
                    <span className="num-span">{i + 1}</span>

                    {/* =================================
                          CLICKABLE SENTENCE AUDIO
                      ================================= */}

                    <span
                      onClick={() => {
                        if (canPlaySentence) {
                          playSentenceAudio(i);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!canPlaySentence) {
                          return;
                        }

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          playSentenceAudio(i);
                        }
                      }}
                      role={canPlaySentence ? "button" : undefined}
                      tabIndex={canPlaySentence ? 0 : undefined}
                      aria-label={
                        canPlaySentence ? `Play sentence ${i + 1}` : undefined
                      }
                      style={{
                        display: "inline-flex",

                        alignItems: "center",

                        gap: "4px",

                        cursor: canPlaySentence ? "pointer" : "default",
                      }}
                    >
                      <span>{row.before} </span>

                      <DroppableSlot
                        id={`slot-${i}`}
                        index={i}
                        value={answers[i]}
                        isWrong={wrongInputs[i]}
                        locked={isLocked}
                        showAnswer={showAnswer}
                        checkCompleted={checkCompleted}
                        keyboardPickedWord={keyboardPickedWord}
                        focusedSlotId={focusedSlotId}
                        setFocusedSlotId={setFocusedSlotId}
                        slotRefs={slotRefs}
                        placedRefs={placedRefs}
                        getAvailableSlotIndexes={getAvailableSlotIndexes}
                        onKeyboardDrop={handleKeyboardDrop}
                        onKeyboardPickPlaced={handleKeyboardPickPlaced}
                      />

                      <span>{row.after}</span>

                      {/* =================================
                            AUDIO ICON
                        ================================= */}

                      {canPlaySentence && (
                        <span
                          aria-hidden="true"
                          style={{
                            marginLeft: "7px",

                            fontSize: "18px",

                            transform: isSpeaking ? "scale(1.15)" : "scale(1)",

                            transition: "transform 0.15s ease",
                          }}
                        >
                          <FaVolumeUp
                            size={18}
                            style={{
                              pointerEvents: "none",

                              flexShrink: 0,
                            }}
                          />
                        </span>
                      )}
                    </span>
                  </span>

                  <img src={row.img} alt={row.alt} className="q-img" />
                </div>
              );
            })}
          </div>

          {/* =========================================
              BUTTONS
          ========================================= */}

          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              onClick={showAnswerFun}
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

      {/* =========================================
          DRAG OVERLAY
      ========================================= */}

      <DragOverlay>
        {activeWord ? (
          <span
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              fontSize: "16px",

              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",

              pointerEvents: "none",

              userSelect: "none",
            }}
          >
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit2_Page8_Q2;
