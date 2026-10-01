import React, { useRef, useState } from "react";
import "./WB_Unit3_Page2_Q1.css";

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

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import sound1 from "../../../assets/U1 WB/U3/page_16/Item_001_your_book_close.mp3";
import sound2 from "../../../assets/U1 WB/U3/page_16/Item_002_pencil_take_your_out.mp3";
import sound3 from "../../../assets/U1 WB/U3/page_16/Item_003_line_a_make.mp3";
import sound4 from "../../../assets/U1 WB/U3/page_16/Item_004_open_book_your.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: "q1",
    scramble: "your/book/close",
    questionCorrect: "close your book",
    audio: sound1,
  },

  {
    id: "q2",
    scramble: "pencil/take/your/out",
    questionCorrect: "take out your pencil",
    audio: sound2,
  },

  {
    id: "q3",
    scramble: "line/a/make",
    questionCorrect: "make a line",
    audio: sound3,
  },

  {
    id: "q4",
    scramble: "open/book/your",
    questionCorrect: "open your book",
    audio: sound4,
  },
];

const getScrambledWords = (scramble) => scramble.split("/");

/* =====================================================
   DRAGGABLE WORD
===================================================== */

function DraggableWord({
  id,
  word,
  isUsed,
  disabled,

  keyboardSelected,
  onKeyboardSelect,

  registerRef,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const isKeyboardSelected = keyboardSelected === id;

  const setRefs = (node) => {
    setNodeRef(node);

    if (node) {
      registerRef(id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (unavailable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardSelect(id);
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
      aria-pressed={isKeyboardSelected}
      aria-label={
        isKeyboardSelected
          ? `${word}. Selected. Press Enter in the answer box to place it.`
          : `${word}. Press Enter or Space to select.`
      }
      className={`word-item-wb-unit3-p2-q1 ${
        isKeyboardSelected ? "keyboard-selected-word-wb-u3-p2-q1" : ""
      }`}
      onKeyDown={handleKeyDown}
      style={{
        opacity: isDragging ? 0.4 : isUsed ? 0.5 : 1,

        cursor: unavailable ? "default" : isDragging ? "grabbing" : "grab",

        pointerEvents: isUsed ? "none" : undefined,
      }}
    >
      {word}
    </span>
  );
}

/* =====================================================
   DROP INPUT
===================================================== */

function DroppableInput({
  id,
  value,
  isWrong,
  locked,

  keyboardSelected,
  selectedWord,

  onKeyboardDrop,
  onClear,
  onCancelKeyboard,

  registerRef,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: locked,
  });

  const words = value ? value.split(" ") : [];

  const isKeyboardTarget = Boolean(keyboardSelected) && !locked;

  const setRefs = (node) => {
    setNodeRef(node);

    if (node) {
      registerRef(id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (locked) return;

    if (isKeyboardTarget && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(id);

      return;
    }

    if (isKeyboardTarget && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboard();

      return;
    }
  };

  return (
    <div className="input-wrapper-wb-u3-p2-q1">
      <div
        ref={setRefs}
        role="button"
        tabIndex={locked ? -1 : isKeyboardTarget ? 0 : value ? 0 : -1}
        aria-disabled={locked}
        aria-label={
          locked
            ? `Correct answer ${value}. Answer locked.`
            : isKeyboardTarget
              ? `Answer box. Press Enter or Space to place ${selectedWord}.`
              : value
                ? `Answer box. Current answer ${value}.`
                : "Empty answer box. Select a word first."
        }
        onKeyDown={handleKeyDown}
        className={`
          answer-input33-review10-p1-q3
          ${isOver ? "drag-over-cell" : ""}
          ${isKeyboardTarget ? "keyboard-input-target-wb-u3-p2-q1" : ""}
          ${locked ? "locked-input-wb-u3-p2-q1" : ""}
        `}
      >
        {/* الكلمات المثبتة */}

        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            role={!locked ? "button" : undefined}
            tabIndex={!locked && !keyboardSelected ? 0 : -1}
            aria-label={
              !locked
                ? `${word}. Press Enter or Space to return this word.`
                : undefined
            }
            className="placed-word-wb-u3-p2-q1"
            onClick={() => {
              if (!locked) {
                onClear(id, word);
              }
            }}
            onKeyDown={(e) => {
              if (locked) return;

              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();

                onClear(id, word);
              }
            }}
          >
            {word}
          </span>
        ))}

        {/* =========================================
            KEYBOARD PREVIEW
            الكلمة ترمش داخل الـinput
        ========================================= */}

        {isKeyboardTarget && selectedWord && (
          <span
            className="keyboard-preview-word-wb-u3-p2-q1"
            aria-hidden="true"
          >
            {selectedWord}
          </span>
        )}
      </div>

      {isWrong && !locked && (
        <span className="error-mark-input1" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
}

/* =====================================================
   MAIN
===================================================== */

const WB_Unit3_Page2_Q1 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [inputs, setInputs] = useState({});

  const [wrong, setWrong] = useState({});

  const [showAnswers, setShowAnswers] = useState(false);

  /*
    Progressive lock:
    q1 / q2 / ...
  */
  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD ACCESSIBILITY
  ===================================================== */

  const [keyboardSelected, setKeyboardSelected] = useState(null);

  const [keyboardMessage, setKeyboardMessage] = useState("");

  const wordRefs = useRef({});

  const inputRefs = useRef({});

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingQuestion, setPlayingQuestion] = useState(null);

  /* =====================================================
     DND
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
        tolerance: 5,
      },
    }),
  );

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  const usedWordsPerQ = (qId) => {
    const value = inputs[`${qId}_question`];

    return value ? value.split(" ") : [];
  };

  const parseId = (id) => {
    const parts = String(id).split("-");

    const qId = parts[0];

    const wordIndex = Number(parts[parts.length - 1]);

    const word = parts.slice(1, -1).join("-");

    return {
      qId,
      word,
      wordIndex,
    };
  };

  const selectedData = keyboardSelected ? parseId(keyboardSelected) : null;

  const selectedWord = selectedData?.word ?? null;

  const selectedQId = selectedData?.qId ?? null;

  /* =====================================================
     REGISTER REFS
  ===================================================== */

  const registerWordRef = (id, node) => {
    if (node) {
      wordRefs.current[id] = node;
    }
  };

  const registerInputRef = (id, node) => {
    if (node) {
      inputRefs.current[id] = node;
    }
  };

  /* =====================================================
     AUDIO
  ===================================================== */

  const playQuestionAudio = (question) => {
    if (!question.audio) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(question.audio);

    audioRef.current = audio;

    setPlayingQuestion(question.id);

    audio.play().catch(() => {
      setPlayingQuestion(null);
    });

    audio.onended = () => {
      setPlayingQuestion(null);
    };

    audio.onerror = () => {
      setPlayingQuestion(null);
    };
  };

  /* =====================================================
     KEYBOARD WORD PICK
  ===================================================== */

  const handleKeyboardSelect = (id) => {
    if (showAnswers || checkCompleted) {
      return;
    }

    const { qId, word } = parseId(id);

    if (isQuestionLocked(qId)) {
      return;
    }

    setKeyboardSelected(id);

    setKeyboardMessage(
      `${word} selected. Press Enter or Space in the answer box to place it.`,
    );

    /*
      أهم نقطة:
      أول ما يختار الكلمة
      روح مباشرة للـinput الخاص فيها
    */

    requestAnimationFrame(() => {
      const inputId = `blank-${qId}_question`;

      inputRefs.current[inputId]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DROP
  ===================================================== */

  const handleKeyboardDrop = (inputId) => {
    if (!keyboardSelected || showAnswers || checkCompleted) {
      return;
    }

    const { qId, word } = parseId(keyboardSelected);

    if (isQuestionLocked(qId)) {
      return;
    }

    const targetQId = inputId.replace("blank-", "").split("_")[0];

    /*
      الكلمة فقط للـinput تبع سؤالها
    */

    if (qId !== targetQId) {
      return;
    }

    const inputKey = `${qId}_question`;

    setInputs((prev) => {
      const existing = prev[inputKey] ? prev[inputKey].split(" ") : [];

      if (existing.includes(word)) {
        return prev;
      }

      return {
        ...prev,

        [inputKey]: existing.length ? `${prev[inputKey]} ${word}` : word,
      };
    });

    /*
      شيل X عن نفس السؤال فقط
    */

    setWrong((prev) => ({
      ...prev,

      [inputKey]: false,
    }));

    const oldSelected = keyboardSelected;

    setKeyboardSelected(null);

    setKeyboardMessage(`${word} placed.`);

    /*
      رجع لأول كلمة متاحة
      بنفس السؤال
    */

    requestAnimationFrame(() => {
      const words = getScrambledWords(
        questions.find((q) => q.id === qId)?.scramble || "",
      );

      const currentInput = inputs[inputKey] ? inputs[inputKey].split(" ") : [];

      const nextWordIndex = words.findIndex(
        (candidate) => candidate !== word && !currentInput.includes(candidate),
      );

      if (nextWordIndex !== -1) {
        const nextId = `${qId}-${words[nextWordIndex]}-${nextWordIndex}`;

        wordRefs.current[nextId]?.focus();

        return;
      }

      /*
        إذا ما في كلمة ثانية
        ما بنجبر focus
      */

      wordRefs.current[oldSelected]?.blur?.();
    });
  };

  /* =====================================================
     CANCEL KEYBOARD
  ===================================================== */

  const cancelKeyboardSelection = () => {
    if (!keyboardSelected) {
      return;
    }

    const selected = keyboardSelected;

    setKeyboardSelected(null);

    setKeyboardMessage("Selection cancelled.");

    requestAnimationFrame(() => {
      wordRefs.current[selected]?.focus();
    });
  };

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = (event) => {
    setActiveId(null);

    const { active, over } = event;

    if (!over || showAnswers || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("blank-")) {
      return;
    }

    const { qId: draggedQId, word } = parseId(active.id);

    if (isQuestionLocked(draggedQId)) {
      return;
    }

    const targetQId = String(over.id).replace("blank-", "").split("_")[0];

    if (draggedQId !== targetQId) {
      return;
    }

    const inputKey = `${targetQId}_question`;

    setInputs((prev) => {
      const existing = prev[inputKey] ? prev[inputKey].split(" ") : [];

      if (existing.includes(word)) {
        return prev;
      }

      return {
        ...prev,

        [inputKey]: existing.length ? `${prev[inputKey]} ${word}` : word,
      };
    });

    /*
      شيل الخطأ عن الجملة المعدلة فقط
    */

    setWrong((prev) => ({
      ...prev,

      [inputKey]: false,
    }));
  };

  /* =====================================================
     CLEAR WORD
  ===================================================== */

  const handleClear = (cellId, word) => {
    const inputKey = cellId.replace("blank-", "");

    const qId = inputKey.split("_")[0];

    if (isQuestionLocked(qId) || showAnswers) {
      return;
    }

    setInputs((prev) => {
      const words = prev[inputKey] ? prev[inputKey].split(" ") : [];

      const index = words.lastIndexOf(word);

      if (index === -1) {
        return prev;
      }

      words.splice(index, 1);

      return {
        ...prev,

        [inputKey]: words.join(" "),
      };
    });

    setWrong((prev) => ({
      ...prev,

      [inputKey]: false,
    }));

    /*
      رجع focus للكلمة بالبنك
    */

    const question = questions.find((q) => q.id === qId);

    const wordIndex = getScrambledWords(question?.scramble || "").indexOf(word);

    if (wordIndex !== -1) {
      const id = `${qId}-${word}-${wordIndex}`;

      requestAnimationFrame(() => {
        wordRefs.current[id]?.focus();
      });
    }
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    /*
      بعد Show Answer
      أو النجاح الكامل:
      No-op
    */

    if (showAnswers || checkCompleted) {
      return;
    }

    const hasEmpty = questions.some(
      (q) =>
        !inputs[`${q.id}_question`] || inputs[`${q.id}_question`].trim() === "",
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please answer all the questions before checking.",
      );

      return;
    }

    const wrongTemp = {};

    const newlyLocked = [];

    let score = 0;

    const total = questions.length;

    questions.forEach((q) => {
      const inputKey = `${q.id}_question`;

      const value = inputs[inputKey]?.trim().toLowerCase();

      const correct = q.questionCorrect.trim().toLowerCase();

      if (value === correct) {
        score++;

        newlyLocked.push(q.id);
      } else {
        wrongTemp[inputKey] = true;
      }
    });

    /*
      اقفل الصح فقط
    */

    setLockedQuestions((prev) => [...new Set([...prev, ...newlyLocked])]);

    /*
      الغلط فقط عليه X
    */

    setWrong(wrongTemp);

    setKeyboardSelected(null);

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedQuestions(questions.map((q) => q.id));

      setCheckCompleted(true);

      setWrong({});

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

  const showCorrectAnswers = () => {
    const filled = {};

    questions.forEach((q) => {
      filled[`${q.id}_question`] = q.questionCorrect;
    });

    setInputs(filled);

    setWrong({});

    setShowAnswers(true);

    setCheckCompleted(true);

    setLockedQuestions(questions.map((q) => q.id));

    setKeyboardSelected(null);

    setKeyboardMessage("Correct answers are displayed.");
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    setPlayingQuestion(null);

    setInputs({});

    setWrong({});

    setShowAnswers(false);

    setLockedQuestions([]);

    setCheckCompleted(false);

    setKeyboardSelected(null);

    setKeyboardMessage("");
  };

  /* =====================================================
     ACTIVE WORD
  ===================================================== */

  const activeWord = activeId ? parseId(activeId).word : null;

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="wb-u3-p2-q1-main">
        {/* SCREEN READER */}

        <div
          className="sr-only-wb-u3-p2-q1"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {keyboardMessage}
        </div>

        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="C"
            title="Unscramble and write."
            subTitle="Arrange the words to make each command, starting with the action word."
          />

          <div className="content-container-wb-unit3-p2-q1 w-full">
            {questions.map((q, index) => {
              const qLocked = isQuestionLocked(q.id);

              const isPlaying = playingQuestion === q.id;

              return (
                <div
                  key={q.id}
                  className={`question-row-wb-u3-p2-q1 ${
                    qLocked ? "question-locked-wb-u3-p2-q1" : ""
                  }`}
                >
                  <div className="input-container-wb-unit3-p2-q1">
                    {/* LEFT */}

                    <div className="question-left-wb-u3-p2-q1">
                      {/* =========================================
                            SENTENCE + AUDIO
                        ========================================= */}

                      <div className="sentence-row-wb-u3-p2-q1">
                        <span className="num2">{index + 1}</span>

                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`${q.scramble.replaceAll("/", " ")}. Press Enter or Space to hear the sentence.`}
                          aria-pressed={isPlaying}
                          className={`answer-input-review10-p1-q3 scramble-text sentence-audio-wb-u3-p2-q1 ${
                            isPlaying ? "sentence-playing-wb-u3-p2-q1" : ""
                          }`}
                          onClick={() => playQuestionAudio(q)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              playQuestionAudio(q);
                            }
                          }}
                        >
                          <span>{q.scramble}</span>

                          {isPlaying && (
                            <FaVolumeUp
                              aria-hidden="true"
                              className="sentence-volume-wb-u3-p2-q1"
                            />
                          )}
                        </div>
                      </div>

                      {/* =========================================
                            WORD BANK
                        ========================================= */}

                      <div className="word-bank-accessible-wb-u3-p2-q1">
                        {getScrambledWords(q.scramble).map((word, i) => {
                          const id = `${q.id}-${word}-${i}`;

                          return (
                            <DraggableWord
                              key={id}
                              id={id}
                              word={word}
                              isUsed={usedWordsPerQ(q.id).includes(word)}
                              disabled={
                                qLocked || showAnswers || checkCompleted
                              }
                              keyboardSelected={keyboardSelected}
                              onKeyboardSelect={handleKeyboardSelect}
                              registerRef={registerWordRef}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* =========================================
                          ANSWER
                      ========================================= */}

                    <DroppableInput
                      id={`blank-${q.id}_question`}
                      value={inputs[`${q.id}_question`] || ""}
                      isWrong={!!wrong[`${q.id}_question`]}
                      locked={qLocked || showAnswers || checkCompleted}
                      keyboardSelected={
                        selectedQId === q.id ? keyboardSelected : null
                      }
                      selectedWord={selectedQId === q.id ? selectedWord : null}
                      onKeyboardDrop={handleKeyboardDrop}
                      onClear={handleClear}
                      onCancelKeyboard={cancelKeyboardSelection}
                      registerRef={registerInputRef}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================
              BUTTONS
          ========================================= */}

          <div className="action-buttons-container">
            <button className="try-again-button" onClick={handleReset}>
              Start Again ↻
            </button>

            <button
              className="show-answer-btn swal-continue"
              onClick={showCorrectAnswers}
            >
              Show Answer
            </button>

            <button className="check-button2" onClick={checkAnswers}>
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* DRAG OVERLAY */}

      <DragOverlay>
        {activeWord && (
          <span className="drag-overlay-word-wb-u3-p2-q1">{activeWord}</span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit3_Page2_Q1;
