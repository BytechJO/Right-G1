import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit7_Page2_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import happyAudio from "../../../assets/U1 WB/U7/audio/page 40- D/Item_001_Are_you_happy.mp3";
import sadAudio from "../../../assets/U1 WB/U7/audio/page 40- D/Item_002_Are_you_sad.mp3";
import boredAudio from "../../../assets/U1 WB/U7/audio/page 40- D/Item_003_Are_you_bored.mp3";
import hungryAudio from "../../../assets/U1 WB/U7/audio/page 40- D/Item_004_Are_you_hungry.mp3";
import coldAudio from "../../../assets/U1 WB/U7/audio/page 40- D/Item_005_Are_you_cold.mp3";

import yesAudio from "../../../assets/U1 WB/U7/audio/page 40- D/Item_007_Yes,_I_am.mp3";
import noAudio from "../../../assets/U1 WB/U7/audio/page 40- D/item-006-no_I’m not.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: "q1",
    text: "Are you happy?",
    audio: happyAudio,
  },
  {
    id: "q2",
    text: "Are you sad?",
    audio: sadAudio,
  },
  {
    id: "q3",
    text: "Are you bored?",
    audio: boredAudio,
  },
  {
    id: "q4",
    text: "Are you hungry?",
    audio: hungryAudio,
  },
  {
    id: "q5",
    text: "Are you cold?",
    audio: coldAudio,
  },
];

const answerOptions = [
  {
    id: "yes",
    text: "Yes, I am.",
    audio: yesAudio,
  },
  {
    id: "no",
    text: "No, I’m not.",
    audio: noAudio,
  },
];

/* =====================================================
   ANSWER CHIP
===================================================== */

const AnswerChip = ({
  option,
  keyboardPickedId,
  onKeyboardPick,
  registerRef,
  isPlaying,
  onPlayAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${option.id}`,

    data: {
      optionId: option.id,
      text: option.text,
    },

    /*
      مهم:
      الخيارات هون ما بتتعطل بعد الاستخدام
      لأنه نفس الجواب ممكن ينحط بأكثر من سؤال.
    */
    disabled: false,
  });

  const isKeyboardPicked = keyboardPickedId === option.id;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(option.id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      /*
        Keyboard:
        صوت + pick
      */

      onPlayAudio(`bank-${option.id}`, option.audio);

      onKeyboardPick(option.id);
    }
  };

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-pressed={isKeyboardPicked}
      aria-label={`${option.text}. Press Enter or Space to hear and select this answer.`}
      onKeyDown={handleKeyDown}
      onClick={() => {
        /*
          Mouse click = صوت فقط.
          Drag نفسه ما بشغل صوت.
        */

        onPlayAudio(`bank-${option.id}`, option.audio);
      }}
      className="wb-unit7-p2-q2-bank-option"
      style={{
        position: "relative",

        opacity: isDragging ? 0.4 : 1,

        cursor: isDragging ? "grabbing" : "grab",

        outline: isKeyboardPicked ? "3px solid #2563eb" : undefined,

        outlineOffset: isKeyboardPicked ? "3px" : undefined,

        touchAction: "none",
      }}
    >
      {option.text}

      {isPlaying && (
        <FaVolumeUp aria-hidden="true" className="wb-unit7-p2-q2-audio-icon" />
      )}
    </div>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const AnswerSlot = ({
  questionId,
  index,

  value,

  keyboardPickedId,
  keyboardFocusIndex,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,

  onSlotFocus,

  onRemove,

  registerRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${questionId}`,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedId) && keyboardFocusIndex === index;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(index, node);
    }
  };

  const handleKeyDown = (e) => {
    /* =================================================
       TAB / SHIFT + TAB
       أثناء pick
    ================================================= */

    if (keyboardPickedId && e.key === "Tab") {
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
        في option picked:
        ضع أو استبدل.
      */

      if (keyboardPickedId) {
        onKeyboardPlace(index);
        return;
      }

      /*
        slot فيه جواب:
        رجعه فاضي.
      */

      if (value) {
        onRemove(index);
      }

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (keyboardPickedId && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div
      ref={setRefs}
      role="button"
      tabIndex={keyboardPickedId ? 0 : value ? 0 : -1}
      aria-label={
        isKeyboardTarget
          ? `Answer box ${
              index + 1
            }. Press Enter or Space to place the selected answer. Press Tab or Shift plus Tab to move between answer boxes.`
          : value
            ? `Answer box ${
                index + 1
              }. Current answer ${value}. Press Enter or Space to clear it.`
            : `Empty answer box ${
                index + 1
              }. Select an answer from the word bank first.`
      }
      onFocus={() => {
        if (keyboardPickedId) {
          onSlotFocus(index);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        /*
          Mouse:
          click على جواب موجود يشيله.
        */

        if (value && !keyboardPickedId) {
          onRemove(index);
        }
      }}
      className={`
        wb-unit7-p2-q2-drop
        ${isOver ? "wb-unit7-p2-q2-drop-over" : ""}
        ${isKeyboardTarget ? "wb-unit7-p2-q2-keyboard-target" : ""}
      `}
    >
      {/* =============================================
          NORMAL VALUE
      ============================================== */}

      {value && !isKeyboardTarget && (
        <span className="wb-unit7-p2-q2-drop-value">{value}</span>
      )}

      {/* =============================================
          KEYBOARD PREVIEW
      ============================================== */}

      {isKeyboardTarget && keyboardPickedId && (
        <span className="wb-unit7-p2-q2-preview">
          {answerOptions.find((option) => option.id === keyboardPickedId)?.text}
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit7_Page2_Q2 = () => {
  /* =====================================================
     ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  /* =====================================================
     MOUSE DRAG
  ===================================================== */

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedId, setKeyboardPickedId] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const bankRefs = useRef({});
  const slotRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingAudioKey, setPlayingAudioKey] = useState(null);

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
     ACTIVE OPTION
  ===================================================== */

  const activeOption = activeId
    ? answerOptions.find((option) => `bank-${option.id}` === activeId)
    : null;

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

    setPlayingAudioKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingAudioKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioKey(null);
    };
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

  const registerBankRef = (optionId, node) => {
    if (node) {
      bankRefs.current[optionId] = node;
    }
  };

  const registerSlotRef = (index, node) => {
    if (node) {
      slotRefs.current[index] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (optionId) => {
    setKeyboardPickedId(optionId);

    /*
      أول slot.
    */

    setKeyboardFocusIndex(0);

    requestAnimationFrame(() => {
      slotRefs.current[0]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT+TAB BETWEEN SLOTS
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const total = questions.length;

    let nextIndex;

    if (backwards) {
      nextIndex = currentIndex <= 0 ? total - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex >= total - 1 ? 0 : currentIndex + 1;
    }

    setKeyboardFocusIndex(nextIndex);

    requestAnimationFrame(() => {
      slotRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardAnswer = (index) => {
    if (!keyboardPickedId) return;

    const option = answerOptions.find((item) => item.id === keyboardPickedId);

    if (!option) return;

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        نفس الخيار ممكن يتكرر بأكثر من سؤال.
      */

      updated[index] = option.text;

      return updated;
    });

    const pickedId = keyboardPickedId;

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);

    /*
      بعد placement:
      رجع لنفس خيار البنك.
    */

    requestAnimationFrame(() => {
      bankRefs.current[pickedId]?.focus();
    });
  };

  /* =====================================================
     CANCEL KEYBOARD PICK
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedId) return;

    const pickedId = keyboardPickedId;

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      bankRefs.current[pickedId]?.focus();
    });
  };

  /* =====================================================
     REMOVE
  ===================================================== */

  const removeAnswer = (index) => {
    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });
  };

  /* =====================================================
     DRAG START
     مهم: بدون صوت
  ===================================================== */

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over) return;

    const overId = String(over.id);

    if (!overId.startsWith("drop-")) {
      return;
    }

    const questionId = overId.replace("drop-", "");

    const questionIndex = questions.findIndex((q) => q.id === questionId);

    if (questionIndex === -1) {
      return;
    }

    const optionId =
      active.data.current?.optionId ?? String(active.id).replace("bank-", "");

    const option = answerOptions.find((item) => item.id === optionId);

    if (!option) return;

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        يسمح باستخدام نفس الإجابة أكثر من مرة.
      */

      updated[questionIndex] = option.text;

      return updated;
    });
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(questions.length).fill(null));

    setActiveId(null);

    setKeyboardPickedId(null);

    setKeyboardFocusIndex(null);
  };

  /* =====================================================
     JSX
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
            gap: "50px",
          }}
        >
          <ExerciseHeader
            sectionLetter="D"
            title="What about you? Read and answer the questions."
            subTitle="Answer each question with Yes, I am or No, I’m not."
          />

          {/* =================================================
              ANSWER BANK
          ================================================= */}

          <div className="wb-unit7-p2-q2-bank">
            {answerOptions.map((option) => (
              <AnswerChip
                key={option.id}
                option={option}
                keyboardPickedId={keyboardPickedId}
                onKeyboardPick={handleKeyboardPick}
                registerRef={registerBankRef}
                isPlaying={playingAudioKey === `bank-${option.id}`}
                onPlayAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="wb-unit7-p2-q2-questions">
            {questions.map((q, index) => (
              <div key={q.id} className="wb-unit7-p2-q2-row">
                <span className="wb-unit7-p2-q2-number">{index + 1}</span>

                {/* =========================================
                      QUESTION AUDIO
                  ========================================== */}

                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Play audio: ${q.text}`}
                  onClick={() => {
                    playAudio(`question-${q.id}`, q.audio);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();

                      playAudio(`question-${q.id}`, q.audio);
                    }
                  }}
                  className="wb-unit7-p2-q2-question-audio"
                >
                  <span className="wb-unit7-p2-q2-question">{q.text}</span>

                  {playingAudioKey === `question-${q.id}` && (
                    <FaVolumeUp
                      aria-hidden="true"
                      className="wb-unit7-p2-q2-audio-icon"
                    />
                  )}
                </div>

                {/* =========================================
                      DROP
                  ========================================== */}

                <AnswerSlot
                  questionId={q.id}
                  index={index}
                  value={answers[index]}
                  keyboardPickedId={keyboardPickedId}
                  keyboardFocusIndex={keyboardFocusIndex}
                  onKeyboardPlace={placeKeyboardAnswer}
                  onKeyboardCancel={cancelKeyboardPick}
                  onMoveKeyboardFocus={moveKeyboardFocus}
                  onSlotFocus={setKeyboardFocusIndex}
                  onRemove={removeAnswer}
                  registerRef={registerSlotRef}
                />
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            ONLY START AGAIN
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>
        </div>
      </div>

      {/* =================================================
          MOUSE DRAG OVERLAY
          بدون صوت
      ================================================= */}

      <DragOverlay>
        {activeOption && (
          <div className="wb-unit7-p2-q2-drag-overlay">{activeOption.text}</div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page2_Q2;
