import React, { useRef, useState } from "react";

import bat from "../../../assets/U1 WB/U5/U5P29EXEE-01.svg";
import cap from "../../../assets/U1 WB/U5/U5P29EXEE-02.svg";
import ant from "../../../assets/U1 WB/U5/U5P29EXEE-03.svg";
import dad from "../../../assets/U1 WB/U5/U5P29EXEE-04.svg";

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

import { FaVolumeUp } from "react-icons/fa";

import "./WB_Unit5_Page3_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import bookAudio from "../../../assets/U1 WB/U5/audio/page_29_qE/Item_001_This_is_my_book.mp3";

import deskAudio from "../../../assets/U1 WB/U5/audio/page_29_qE/Item_002_This_is_my_desk.mp3";

import chairAudio from "../../../assets/U1 WB/U5/audio/page_29_qE/Item_003_This_is_my_chair.mp3";

import pencilAudio from "../../../assets/U1 WB/U5/audio/page_29_qE/Item_004_my_pencil.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    img: bat,

    alt: "A boy holding up a pencil.",

    parts: [
      {
        type: "text",
        value: "This is ",
      },

      {
        type: "input",
        answer: "my pencil",
      },

      {
        type: "text",
        value: ".",
      },
    ],
  },

  {
    img: cap,

    alt: "A girl and a boy standing together and talking.",

    parts: [
      {
        type: "input",
        answer: "This is my book",
      },

      {
        type: "text",
        value: ".",
      },
    ],
  },

  {
    img: ant,

    alt: "A girl pointing toward a school desk.",

    parts: [
      {
        type: "input",
        answer: "This is my desk",
      },

      {
        type: "text",
        value: ".",
      },
    ],
  },

  {
    img: dad,

    alt: "A woman standing next to a chair.",

    parts: [
      {
        type: "input",
        answer: "This is my chair",
      },

      {
        type: "text",
        value: ".",
      },
    ],
  },
];

/* =====================================================
   WORD OPTIONS + AUDIO
===================================================== */

const wordOptions = [
  {
    word: "my pencil",
    audio: pencilAudio,
  },

  {
    word: "This is my book",
    audio: bookAudio,
  },

  {
    word: "This is my desk",
    audio: deskAudio,
  },

  {
    word: "This is my chair",
    audio: chairAudio,
  },
];

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  word,
  audio,

  isUsed,
  showAnswer,

  keyboardPickedWord,
  onKeyboardPick,

  registerBankRef,

  onPlayAudio,
  playingWord,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,

    disabled: isUsed || showAnswer,
  });

  const isPicked = keyboardPickedWord === word;

  const disabled = isUsed || showAnswer;

  const activateKeyboard = () => {
    if (disabled) return;

    /*
      صوت الخيار
    */

    onPlayAudio(word, audio);

    /*
      Pick / Cancel
    */

    if (isPicked) {
      onKeyboardPick(null);
    } else {
      onKeyboardPick(word);
    }
  };

  return (
    <div
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
          ? `${word} selected. Press Tab to move to an answer blank, then press Enter or Space to place it.`
          : `${word}. Press Enter or Space to hear and select this option.`
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          activateKeyboard();
        }
      }}
      onClick={(e) => {
        if (disabled) return;

        /*
          Mouse click = صوت فقط
          حتى ما نخرب الـDrag
        */

        if (e.detail > 0) {
          onPlayAudio(word, audio);

          return;
        }

        e.preventDefault();
        e.stopPropagation();

        activateKeyboard();
      }}
      className="drag-word-wb-unit5-page2-q2"
      style={{
        position: "relative",

        padding: "7px 14px",

        border: `2px solid ${isUsed ? "#aaa" : "#2c5287"}`,

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        color: isUsed ? "#999" : "inherit",

        cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.3 : isUsed ? 0.45 : 1,

        transition: "all 0.2s",

        touchAction: "none",

        userSelect: "none",

        outline: isPicked ? "3px solid #2563eb" : undefined,

        outlineOffset: isPicked ? "4px" : undefined,
      }}
    >
      {word}

      {playingWord === word && (
        <FaVolumeUp
          size={16}
          aria-hidden="true"
          className="audio-icon-wb-unit5-page2-q2"
        />
      )}
    </div>
  );
};

/* =====================================================
   DROPPABLE BLANK
===================================================== */

const DroppableBlank = ({
  id,

  value,

  isWrong,
  isLocked,

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
    id,

    disabled: isLocked || showAnswer || checkCompleted,
  });

  const keyboardActive =
    !!keyboardPickedWord && !isLocked && !showAnswer && !checkCompleted;

  /*
    بعد Check:
    الـWrong slot يضل Tab reachable
  */

  const canFixWrong =
    !!value &&
    isWrong &&
    !keyboardPickedWord &&
    !isLocked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardActive && focusedDropId === id;

  const displayedValue = showPreview ? keyboardPickedWord : value;

  const handleKeyDown = (e) => {
    /* =========================================
       WRONG ITEM → RETURN TO BANK
    ========================================= */

    if (canFixWrong && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(id, value);

      return;
    }

    if (!keyboardActive) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableDropIds();

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

      dropRefs.current[nextId]?.focus();

      return;
    }

    /* =========================================
       PLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(id);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        dropRefs.current[id] = el;
      }}
      role="button"
      tabIndex={
        isLocked || showAnswer || checkCompleted
          ? -1
          : keyboardActive || canFixWrong
            ? 0
            : -1
      }
      aria-label={
        keyboardActive
          ? value
            ? `Answer blank contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
            : `Empty answer blank. Press Enter or Space to place ${keyboardPickedWord}.`
          : canFixWrong
            ? `${value} is incorrect. Press Enter or Space to return it to the word bank.`
            : value
              ? `Answer blank containing ${value}.`
              : "Empty answer blank."
      }
      className={`inline-input-wb-unit5-page2-q2 ${
        isOver ? "drag-over-cell" : ""
      } ${showPreview ? "keyboard-preview-wb-unit5-page2-q2" : ""}`}
      onFocus={() => {
        if (keyboardActive) {
          setFocusedDropId(id);
        }
      }}
      onBlur={() => {
        setFocusedDropId(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (value && !isLocked && !showAnswer && !checkCompleted) {
          onRemove(id);
        }
      }}
      style={{
        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        background: isOver ? "#e3f2fd" : "",

        position: "relative",

        cursor:
          value && !isLocked && !showAnswer && !checkCompleted
            ? "pointer"
            : "default",

        minWidth: "120px",
      }}
    >
      {displayedValue && (
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {displayedValue}
        </span>
      )}

      {isWrong && value && (
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

const WB_Unit5_Page3_Q1 = () => {
  /* =================================================
     INITIAL STATE
  ================================================= */

  const createEmptyAnswers = () =>
    questions.map((q) => q.parts.map((p) => (p.type === "input" ? "" : null)));

  const [answers, setAnswers] = useState(createEmptyAnswers());

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* =================================================
     KEYBOARD
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
        delay: 120,
        tolerance: 5,
      },
    }),
  );

  /* =================================================
     DROP IDS
  ================================================= */

  const dropIds = questions.flatMap((q, qIndex) =>
    q.parts.flatMap((part, pIndex) =>
      part.type === "input" ? [`blank-${qIndex}-${pIndex}`] : [],
    ),
  );

  /* =================================================
     USED WORDS
  ================================================= */

  const usedWords = new Set(answers.flat().filter(Boolean));

  /* =================================================
     HELPERS
  ================================================= */

  const parseDropId = (id) => {
    const parts = id.split("-");

    return {
      qIndex: Number(parts[1]),

      pIndex: Number(parts[2]),
    };
  };

  const isDropLocked = (id) => lockedInputs.includes(id);

  const getAvailableDropIds = () => dropIds.filter((id) => !isDropLocked(id));

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (word, dropId) => {
    if (showAnswer || checkCompleted || isDropLocked(dropId)) {
      return;
    }

    const { qIndex, pIndex } = parseDropId(dropId);

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      /*
        نفس الخيار ما يكون بمكانين
      */

      updated.forEach((row) => {
        row.forEach((value, index) => {
          if (value === word) {
            row[index] = "";
          }
        });
      });

      updated[qIndex][pIndex] = word;

      return updated;
    });

    /*
      امسح X فقط عن نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((id) => id !== dropId));
  };

  /* =================================================
     REMOVE
  ================================================= */

  const handleRemove = (dropId) => {
    if (showAnswer || checkCompleted || isDropLocked(dropId)) {
      return;
    }

    const { qIndex, pIndex } = parseDropId(dropId);

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][pIndex] = "";

      return updated;
    });

    setWrongInputs((prev) => prev.filter((id) => id !== dropId));
  };

  /* =================================================
     DRAG
  ================================================= */

  const handleDragStart = (event) => {
    const word = event.active.id.replace(/^word-/, "");

    setActiveWord(word);
  };

  const handleDragEnd = (event) => {
    setActiveWord(null);

    if (showAnswer || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over) return;

    const word = active.id.replace(/^word-/, "");

    const dropId = String(over.id);

    if (!dropId.startsWith("blank-")) {
      return;
    }

    if (isDropLocked(dropId)) {
      return;
    }

    placeWord(word, dropId);
  };

  const handleDragCancel = () => {
    setActiveWord(null);
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (word) => {
    if (!word || showAnswer || checkCompleted) {
      setKeyboardPickedWord(null);

      return;
    }

    setKeyboardPickedWord(word);

    setFocusedDropId(null);

    window.setTimeout(() => {
      const available = getAvailableDropIds();

      if (!available.length) {
        return;
      }

      dropRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (dropId) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isDropLocked(dropId)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    placeWord(word, dropId);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
      بعد الوضع يرجع لنفس الخيار بالبنك
    */

    window.setTimeout(() => {
      bankRefs.current[word]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG → BANK
  ================================================= */

  const handleKeyboardClearWrong = (dropId, currentWord) => {
    if (showAnswer || checkCompleted || isDropLocked(dropId)) {
      return;
    }

    handleRemove(dropId);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      bankRefs.current[currentWord]?.focus();
    }, 0);
  };

  /* =================================================
     ESCAPE
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
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      كل الخانات لازم معبية
    */

    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      for (let pIndex = 0; pIndex < questions[qIndex].parts.length; pIndex++) {
        const part = questions[qIndex].parts[pIndex];

        if (part.type === "input") {
          const value = answers[qIndex][pIndex];

          if (!value || value.trim() === "") {
            ValidationAlert.info(`Please complete question ${qIndex + 1}.`);

            return;
          }
        }
      }
    }

    let correctCount = 0;
    let total = 0;

    const wrong = [];
    const correct = [];

    questions.forEach((q, qIndex) => {
      q.parts.forEach((part, pIndex) => {
        if (part.type === "input") {
          total++;

          const dropId = `blank-${qIndex}-${pIndex}`;

          if (answers[qIndex][pIndex]?.trim() === part.answer) {
            correctCount++;

            correct.push(dropId);
          } else {
            wrong.push(dropId);
          }
        }
      });
    });

    /*
      الصح فقط يقفل
    */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...correct])));

    /*
      الغلط يظل editable
    */

    setWrongInputs(wrong);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedInputs(dropIds);

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (correctCount === 0) {
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

    const filled = questions.map((q) =>
      q.parts.map((p) => (p.type === "input" ? p.answer : null)),
    );

    setAnswers(filled);

    setWrongInputs([]);

    setLockedInputs(dropIds);

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

    setAnswers(createEmptyAnswers());

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
        <div
          className="div-forall"
          style={{
            gap: "30px",
          }}
        >
          <ExerciseHeader
            sectionLetter="E"
            title="Look, read, and write."
            subTitle="Look at each picture and drag the matching my phrase into the blank."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",

              width: "100%",

              flexWrap: "wrap",
            }}
          >
            {wordOptions.map((item) => (
              <DraggableWord
                key={item.word}
                word={item.word}
                audio={item.audio}
                isUsed={usedWords.has(item.word)}
                showAnswer={showAnswer}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                registerBankRef={(word, el) => {
                  bankRefs.current[word] = el;
                }}
                onPlayAudio={playAudio}
                playingWord={playingWord}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div
            className="content-container-wb-unit4-p1-q2"
            style={{
              width: "100%",
            }}
          >
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="row2-wb-unit4-p1-q2">
                {/* =========================
                      IMAGE
                  ========================= */}

                <div
                  style={{
                    display: "flex",

                    gap: "10px",
                  }}
                >
                  <span className="num-span">{qIndex + 1}</span>

                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q-img-wb-unit5-page2-q2"
                  />

                  <span className="word-box-wb-unit5-page2-q2">
                    What's this?
                  </span>
                </div>

                {/* =========================
                      ANSWER
                  ========================= */}

                <div className="sentence-wrapper-wb-unit5-page2-q2">
                  {q.parts.map((part, pIndex) => {
                    if (part.type === "text") {
                      return (
                        <span
                          key={pIndex}
                          className="sentence-text-wb-unit5-page2-q2"
                        >
                          {part.value}
                        </span>
                      );
                    }

                    const blankId = `blank-${qIndex}-${pIndex}`;

                    return (
                      <DroppableBlank
                        key={pIndex}
                        id={blankId}
                        value={answers[qIndex][pIndex]}
                        isWrong={wrongInputs.includes(blankId)}
                        isLocked={isDropLocked(blankId)}
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
                        onRemove={handleRemove}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
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
          <div
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              color: "#2c5287",

              cursor: "grabbing",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit5_Page3_Q1;
