import React, { useRef, useState } from "react";

import "./WB_Unit4_Page2_Q2.css";

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

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
   الأصوات للجمل المشخبطة اللي فوق فقط
===================================================== */

import q1Audio from "../../../assets/U1 WB/U4/audio/page_22_qd/Item_001_blue_It's.mp3";

import q2Audio from "../../../assets/U1 WB/U4/audio/page_22_qd/Item_002_circle_It's_a.mp3";

import q3Audio from "../../../assets/U1 WB/U4/audio/page_22_qd/Item_003_brown_It's_a_boat.mp3";

import q4Audio from "../../../assets/U1 WB/U4/audio/page_22_qd/Item_004_square_red_a_It's.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: "1",

    scramble: "blue/It's",

    questionCorrect: "It's blue",

    audio: q1Audio,
  },

  {
    id: "2",

    scramble: "circle/It's/a",

    questionCorrect: "It's a circle",

    audio: q2Audio,
  },

  {
    id: "3",

    scramble: "brown/It's/a/boat",

    questionCorrect: "It's a brown boat",

    audio: q3Audio,
  },

  {
    id: "4",

    scramble: "square/red/a/It's",

    questionCorrect: "It's a red square",

    audio: q4Audio,
  },
];

const getWords = (scramble) => scramble.replace(/['']/g, "'").split("/");

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  id,
  word,

  locked,
  isUsed,

  keyboardPickedItem,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    disabled: locked || isUsed,
  });

  const disabled = locked || isUsed;

  const isPicked = keyboardPickedItem?.id === id;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[id] = el;
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
          ? `${word} selected. Press Enter or Space in the answer box to place it.`
          : `${word}. Press Enter or Space to select this word.`
      }
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          e.stopPropagation();

          onKeyboardPick({
            id,
            word,
          });
        }
      }}
      className={`drag-word-wb-unit4-p2-q2 ${
        isPicked ? "keyboard-picked-word-wb-unit4-p2-q2" : ""
      }`}
      style={{
        padding: "2px 5px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        cursor: disabled ? "default" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

        touchAction: "none",

        transition: "all 0.2s ease",

        color: isUsed ? "#999" : "inherit",

        userSelect: "none",
      }}
    >
      {word}
    </span>
  );
};

/* =====================================================
   DROP SENTENCE
===================================================== */

const DroppableInput = ({
  droppableId,
  qId,

  value,

  isWrong,
  locked,

  showAnswer,
  checkCompleted,

  keyboardPickedItem,

  dropRefs,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemoveWord,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,

    disabled: locked || showAnswer || checkCompleted,
  });

  /* =========================================
     KEYBOARD DROP MODE
  ========================================= */

  const keyboardDropActive =
    !!keyboardPickedItem &&
    keyboardPickedItem.qId === qId &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  /* =========================================
     UPDATED DRAG PATTERN

     أي row فيه كلمات ولسا editable
     يضل reachable بالـTab حتى قبل Check.
  ========================================= */

  const canEditFilled =
    value.length > 0 &&
    !keyboardPickedItem &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED ROW → RETURN ALL WORDS TO BANK
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();

      e.stopPropagation();

      onKeyboardClearWrong(qId);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =========================================
       ENTER / SPACE
       ADD WORD TO SENTENCE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      onKeyboardDrop(qId);

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
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);

          dropRefs.current[qId] = el;
        }}
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
            ? `Sentence answer for question ${qId}. Press Enter or Space to add ${keyboardPickedItem.word}.`
            : canEditFilled
              ? `Sentence answer for question ${qId} contains ${value
                  .map((item) => item.word)
                  .join(
                    " ",
                  )}. Press Enter or Space to return all words to this question's word bank.`
              : `Sentence answer for question ${qId}.`
        }
        onKeyDown={handleKeyDown}
        className={`answer-input33-review10-p1-q3 ${
          isOver ? "drag-over-cell" : ""
        } ${keyboardDropActive ? "keyboard-drop-preview-wb-unit4-p2-q2" : ""}`}
        style={{
          background: isOver ? "#e3f2fd" : "white",

          display: "flex",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "4px",

          minHeight: "36px",

          padding: "4px 8px",

          cursor: canEditFilled ? "pointer" : "default",
        }}
      >
        {/* =====================================
            PLACED WORDS
        ===================================== */}

        {value.map((item) => (
          <span
            key={item.bankId}
            onClick={() => {
              if (!locked && !showAnswer && !checkCompleted) {
                onRemoveWord(droppableId, item.bankId);
              }
            }}
            style={{
              cursor:
                locked || showAnswer || checkCompleted ? "default" : "pointer",

              padding: "1px 4px",

              fontSize: "inherit",
            }}
            title={
              locked || showAnswer || checkCompleted ? "" : "Click to remove"
            }
          >
            {item.word}
          </span>
        ))}

        {/* =====================================
            KEYBOARD PREVIEW
        ===================================== */}

        {keyboardDropActive && (
          <span className="keyboard-preview-word-wb-unit4-p2-q2">
            {keyboardPickedItem.word}
          </span>
        )}
      </div>

      {isWrong && (
        <span className="error-mark-input1" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};
/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit4_Page2_Q2 = () => {
  /* =================================================
       ANSWERS
    ================================================= */

  const emptyAnswers = () =>
    Object.fromEntries(questions.map((q) => [q.id, []]));

  const [answers, setAnswers] = useState(emptyAnswers());

  const [wrong, setWrong] = useState({});

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
       MOUSE DRAG
    ================================================= */

  const [activeItem, setActiveItem] = useState(null);

  /* =================================================
       KEYBOARD DRAG
    ================================================= */

  const [keyboardPickedItem, setKeyboardPickedItem] = useState(null);

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  /* =================================================
       AUDIO
    ================================================= */

  const audioRef = useRef(null);

  const [playingQuestion, setPlayingQuestion] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingQuestion(null);
  };

  const playQuestionAudio = (qId, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingQuestion(qId);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    };
  };

  /* =================================================
       HELPERS
    ================================================= */

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  /*
      كل كلمة إلها ID فريد:
      qId::word::index
    */

  const getWordId = (qId, word, index) => `${qId}::${word}::${index}`;

  const usedIdsFor = (qId) => answers[qId].map((answer) => answer.bankId);

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
       MOUSE DRAG START
    ================================================= */

  const handleDragStart = (event) => {
    const [qId, word] = event.active.id.split("::");

    setActiveItem({
      word,
      qId,
    });
  };

  /* =================================================
       MOUSE DRAG END
    ================================================= */

  const handleDragEnd = (event) => {
    setActiveItem(null);

    const { active, over } = event;

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("sentence-")) {
      return;
    }

    const [sourceQId, word] = active.id.split("::");

    const targetQId = String(over.id).replace("sentence-", "");

    /*
          كلمة كل سؤال
          تنزل فقط بسؤالها
        */

    if (sourceQId !== targetQId) {
      return;
    }

    if (isQuestionLocked(targetQId)) {
      return;
    }

    const bankId = active.id;

    setAnswers((prev) => {
      const current = prev[targetQId];

      if (current.some((item) => item.bankId === bankId)) {
        return prev;
      }

      return {
        ...prev,

        [targetQId]: [
          ...current,

          {
            word,
            bankId,
          },
        ],
      };
    });

    /*
          شيل X فقط عن نفس السؤال
        */

    setWrong((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[targetQId];

      return updated;
    });
  };

  /* =================================================
       KEYBOARD PICK
    ================================================= */

  const handleKeyboardPick = ({ id, word, qId }) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setKeyboardPickedItem({
      id,
      word,
      qId,
    });

    /*
          هاي row-based:
          الكلمة بتروح مباشرة
          لنفس answer box تبع السؤال.
        */

    requestAnimationFrame(() => {
      dropRefs.current[qId]?.focus();
    });
  };

  /* =================================================
       KEYBOARD DROP
    ================================================= */

  const handleKeyboardDrop = (qId) => {
    if (
      !keyboardPickedItem ||
      keyboardPickedItem.qId !== qId ||
      showAnswer ||
      checkCompleted ||
      isQuestionLocked(qId)
    ) {
      return;
    }

    const item = keyboardPickedItem;

    const updated = {
      ...answers,

      [qId]: [
        ...answers[qId],

        {
          word: item.word,

          bankId: item.id,
        },
      ],
    };

    setAnswers(updated);

    setWrong((prev) => {
      const copy = {
        ...prev,
      };

      delete copy[qId];

      return copy;
    });

    setKeyboardPickedItem(null);

    /*
          بعد وضع الكلمة:
          روح لأول كلمة غير مستخدمة
          بنفس السؤال.
        */

    window.setTimeout(() => {
      const words = getWords(questions.find((q) => q.id === qId).scramble);

      const usedIds = updated[qId].map((a) => a.bankId);

      const next = words
        .map((word, index) => ({
          id: getWordId(qId, word, index),

          word,
        }))
        .find((item) => !usedIds.includes(item.id));

      if (next) {
        bankRefs.current[next.id]?.focus();
      } else {
        /*
                إذا خلصت كلمات الصف
                اترك الفوكس على answer box.
              */

        dropRefs.current[qId]?.focus();
      }
    }, 0);
  };

  /* =================================================
       WRONG ROW AFTER CHECK

       Enter على الصف الغلط:
       رجع كل الكلمات للبنك.
    ================================================= */

  const handleKeyboardClearWrong = (qId) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,

      [qId]: [],
    }));

    setWrong((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[qId];

      return updated;
    });

    setKeyboardPickedItem(null);

    /*
          Focus أول كلمة
          من بنك نفس الصف
        */

    window.setTimeout(() => {
      const q = questions.find((item) => item.id === qId);

      const words = getWords(q.scramble);

      if (!words.length) {
        return;
      }

      const firstId = getWordId(qId, words[0], 0);

      bankRefs.current[firstId]?.focus();
    }, 0);
  };

  /* =================================================
       ESCAPE
    ================================================= */

  const handleCancelKeyboardPick = () => {
    const item = keyboardPickedItem;

    setKeyboardPickedItem(null);

    window.setTimeout(() => {
      if (item?.id) {
        bankRefs.current[item.id]?.focus();
      }
    }, 0);
  };

  /* =================================================
       REMOVE WORD WITH MOUSE
    ================================================= */

  const handleRemoveWord = (droppableId, bankId) => {
    const qId = droppableId.replace("sentence-", "");

    if (showAnswer || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,

      [qId]: prev[qId].filter((a) => a.bankId !== bankId),
    }));

    /*
          X فقط نفس السؤال
        */

    setWrong((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[qId];

      return updated;
    });
  };

  /* =================================================
       CHECK ANSWER
    ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
          لازم كل كلمات كل سؤال
          تكون مستخدمة.
        */

    const incomplete = questions.some(
      (q) => answers[q.id].length !== getWords(q.scramble).length,
    );

    if (incomplete) {
      ValidationAlert.info(
        "Please complete all the sentences before checking.",
      );

      return;
    }

    const wrongTemp = {};

    const newlyLocked = [];

    let score = 0;

    const total = questions.length;

    questions.forEach((q) => {
      const userSentence = answers[q.id].map((a) => a.word).join(" ");

      if (userSentence === q.questionCorrect) {
        score++;

        newlyLocked.push(q.id);
      } else {
        wrongTemp[q.id] = true;
      }
    });

    /*
          الصح فقط يقفل
        */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /*
          الغلط فقط عليه X
        */

    setWrong(wrongTemp);

    setKeyboardPickedItem(null);

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
          <div style="font-size:20px;text-align:center;">
            <span style="color:${color};font-weight:bold">
              Score: ${score} / ${total}
            </span>
          </div>
        `;

    if (score === total) {
      setLockedQuestions(questions.map((q) => q.id));

      setWrong({});

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

  const showCorrectAnswers = () => {
    stopAudio();

    const filled = {};

    questions.forEach((q) => {
      /*
              نستخدم الكلمات الأصلية
              من sentence الصحيحة
            */

      filled[q.id] = q.questionCorrect.split(" ").map((word, index) => {
        /*
                      دور على نفس الكلمة
                      في الـscramble عشان ID
                    */

        const originalWords = getWords(q.scramble);

        const originalIndex = originalWords.findIndex(
          (originalWord, i) =>
            originalWord === word &&
            !q.questionCorrect
              .split(" ")
              .slice(0, index)
              .some(
                (previousWord, previousIndex) =>
                  previousWord === word &&
                  originalWords[previousIndex] === word,
              ),
        );

        return {
          word,

          bankId: getWordId(
            q.id,

            word,

            originalIndex === -1 ? index : originalIndex,
          ),
        };
      });
    });

    setAnswers(filled);

    setWrong({});

    setLockedQuestions(questions.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedItem(null);
  };

  /* =================================================
       RESET
    ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(emptyAnswers());

    setWrong({});

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveItem(null);

    setKeyboardPickedItem(null);
  };

  /* =================================================
       RENDER
    ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveItem(null)}
    >
      <div
        style={{
          display: "flex",

          justifyContent: "center",

          padding: "30px",
        }}
      >
        <div
          style={{
            gap: "30px",
          }}
          className="div-forall"
        >
          <ExerciseHeader
            sectionLetter="D"
            title="Unscramble and write."
            subTitle="Start with It’s, then arrange the color and shape words in order."
          />

          <div className="content-container-wb-unit4-p2-q2">
            {questions.map((q) => {
              const words = getWords(q.scramble);

              const usedIds = usedIdsFor(q.id);

              const rowLocked = isQuestionLocked(q.id);

              const isPlaying = playingQuestion === q.id;

              return (
                <div
                  key={q.id}
                  style={{
                    display: "flex",

                    width: "100%",
                  }}
                >
                  <div className="input-container-wb-unit4-p2-q2">
                    <div
                      style={{
                        display: "flex",

                        flexDirection: "column",
                      }}
                    >
                      {/* =====================================
                              SCRAMBLED SENTENCE + AUDIO
                          ===================================== */}

                      <div
                        style={{
                          display: "flex",

                          alignItems: "center",
                        }}
                      >
                        <span className="num2">{q.id}</span>

                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`Play audio for ${q.scramble.replaceAll("/", " ")}`}
                          onClick={() => playQuestionAudio(q.id, q.audio)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              playQuestionAudio(q.id, q.audio);
                            }
                          }}
                          className="scramble-audio-wrapper-wb-unit4-p2-q2"
                          style={{
                            position: "relative",

                            cursor: "pointer",
                          }}
                        >
                          <input
                            readOnly
                            tabIndex={-1}
                            aria-hidden="true"
                            value={q.scramble}
                            className="answer-input-review10-p1-q3"
                            style={{
                              pointerEvents: "none",
                            }}
                          />

                          {isPlaying && (
                            <FaVolumeUp
                              size={16}
                              aria-hidden="true"
                              className="scramble-audio-icon-wb-unit4-p2-q2"
                            />
                          )}
                        </div>
                      </div>

                      {/* =====================================
                              WORD BANK
                          ===================================== */}

                      <div
                        style={{
                          display: "flex",

                          gap: "10px",

                          padding: "10px",

                          border: "2px dashed #ccc",

                          borderRadius: "10px",

                          alignItems: "center",

                          justifyContent: "center",

                          flexWrap: "wrap",
                        }}
                      >
                        {words.map((word, index) => {
                          const id = getWordId(q.id, word, index);

                          return (
                            <DraggableWord
                              key={id}
                              id={id}
                              word={word}
                              locked={rowLocked || showAnswer || checkCompleted}
                              isUsed={usedIds.includes(id)}
                              keyboardPickedItem={keyboardPickedItem}
                              onKeyboardPick={(item) =>
                                handleKeyboardPick({
                                  ...item,

                                  qId: q.id,
                                })
                              }
                              bankRefs={bankRefs}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* =====================================
                            ANSWER BOX
                        ===================================== */}

                    <DroppableInput
                      droppableId={`sentence-${q.id}`}
                      qId={q.id}
                      value={answers[q.id]}
                      isWrong={!!wrong[q.id]}
                      locked={rowLocked}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      keyboardPickedItem={keyboardPickedItem}
                      dropRefs={dropRefs}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardClearWrong={handleKeyboardClearWrong}
                      onCancelKeyboardPick={handleCancelKeyboardPick}
                      onRemoveWord={handleRemoveWord}
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
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* =============================================
            DRAG OVERLAY
        ============================================= */}

      <DragOverlay>
        {activeItem && (
          <span
            style={{
              padding: "2px 5px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

              cursor: "grabbing",
            }}
          >
            {activeItem.word}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit4_Page2_Q2;
