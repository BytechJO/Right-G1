import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page2_Q1.css";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

/* ================= AUDIO ================= */

import bikeAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_001_bike.mp3";
import rideAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_002_ride.mp3";
import cantAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_003_can't.mp3";
import sailAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_004_sail.mp3";
import theyAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_005_They,.mp3";
import boatAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_006_boat.mp3";
import canAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_007_can.mp3";
import kiteAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_008_kite.mp3";
import flyAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_009_fly.mp3";
import heAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_010_He.mp3";
import pictureAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_011_picture.mp3";
import paintAudio from "../../../assets/U1 WB/U6/audio/page 34 - C/Item_012_paint.mp3";

/* ================= WORD AUDIO ================= */

const wordAudio = {
  bike: bikeAudio,
  ride: rideAudio,
  "can't": cantAudio,
  sail: sailAudio,
  They: theyAudio,
  boat: boatAudio,
  can: canAudio,
  kite: kiteAudio,
  fly: flyAudio,
  He: heAudio,
  picture: pictureAudio,
  paint: paintAudio,
};

/* ================= DATA ================= */

const questions = [
  {
    id: 1,
    words: ["bike", "I", "ride", "can't", "a"],
    correct: ["I", "can't", "ride", "a", "bike"],
  },
  {
    id: 2,
    words: ["sail", "They", "a", "boat", "can"],
    correct: ["They", "can", "sail", "a", "boat"],
  },
  {
    id: 3,
    words: ["a", "kite", "can", "He", "fly"],
    correct: ["He", "can", "fly", "a", "kite"],
  },
  {
    id: 4,
    words: ["picture", "I", "can", "a", "paint"],
    correct: ["I", "can", "paint", "a", "picture"],
  },
];

/* =====================================================
   DRAGGABLE NUMBER
===================================================== */

const DraggableNumber = ({
  qId,
  num,

  disabled,

  keyboardPickedNum,
  onKeyboardPick,

  bankRefs,
}) => {
  const dragId = `num-${qId}-${num}`;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    disabled,
  });

  const picked =
    keyboardPickedNum?.qId === qId && keyboardPickedNum?.num === String(num);

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[`${qId}-${num}`] = el;
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
      aria-pressed={picked}
      aria-label={
        picked
          ? `Number ${num} selected for question ${qId}. Press Tab to choose a word.`
          : disabled
            ? `Number ${num} is already used in question ${qId}.`
            : `Number ${num}. Press Enter or Space to select it for question ${qId}.`
      }
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(qId, String(num));
        }
      }}
      /* =========================================
         نفس ستايل المربع القديم بدون تغيير
      ========================================= */

      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: "white",
        fontWeight: "bold",
        cursor: disabled ? "default" : "grab",
        opacity: isDragging ? 0.4 : disabled ? 0.45 : 1,
        touchAction: "none",
        userSelect: "none",
        transition: "opacity 0.2s",
      }}
    >
      {num}
    </div>
  );
};

/* =====================================================
   DROPPABLE WORD BOX
===================================================== */

const DroppableWordBox = ({
  qId,
  word,
  value,

  isWrong,
  locked,

  showAnswer,
  checkCompleted,

  keyboardPickedNum,

  focusedDropId,
  setFocusedDropId,

  dropRefs,
  getAvailableDropIds,

  onKeyboardDrop,
  onKeyboardRemovePlaced,
  onCancelKeyboardPick,

  onRemove,

  playingKey,
  playAudio,
}) => {
  const droppableId = `q-${qId}-${word}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    keyboardPickedNum?.qId === qId &&
    !!keyboardPickedNum?.num &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  /* =================================================
     الخانة المعبية تبقى Tab reachable
  ================================================= */

  const canEditFilled =
    !!value && !keyboardPickedNum && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardDropActive && focusedDropId === droppableId;

  const displayedValue = showPreview ? keyboardPickedNum.num : value;

  const audioSrc = wordAudio[word];

  const audioKey = `word-${qId}-${word}`;

  const isPlaying = playingKey === audioKey;

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED → RETURN NUMBER
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardRemovePlaced(qId, droppableId, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB
       فقط بين كلمات نفس السؤال
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableDropIds(qId);

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

    /* =========================================
       PLACE / REPLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(droppableId);

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
    <div className="wb-unit6-p2-q1-word-box">
      {/* ================= WORD ================= */}

      {audioSrc ? (
        <span
          className="wb-unit6-p2-q1-word-text"
          role="button"
          tabIndex={0}
          aria-label={`Play audio for ${word}`}
          onClick={() => playAudio(audioKey, audioSrc)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();

              playAudio(audioKey, audioSrc);
            }
          }}
        >
          {word}

          {isPlaying && <FaVolumeUp size={14} aria-hidden="true" />}
        </span>
      ) : (
        <span className="wb-unit6-p2-q1-word-text">{word}</span>
      )}

      {/* ================= INPUT ================= */}

      <div
        ref={(el) => {
          setNodeRef(el);

          dropRefs.current[droppableId] = el;
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
            ? value
              ? `${word} currently contains number ${value}. Press Enter or Space to replace it with ${keyboardPickedNum.num}.`
              : `${word}. Press Enter or Space to place number ${keyboardPickedNum.num}.`
            : canEditFilled
              ? `${word} contains number ${value}. Press Enter or Space to return it to question ${qId}'s number bank.`
              : `${word} number box.`
        }
        className={`wb-unit6-p2-q1-input ${isOver ? "drag-over-cell" : ""}`}
        onFocus={() => {
          if (keyboardDropActive) {
            setFocusedDropId(droppableId);
          }
        }}
        onBlur={() => {
          setFocusedDropId(null);
        }}
        onKeyDown={handleKeyDown}
        onClick={() =>
          !locked &&
          !showAnswer &&
          !checkCompleted &&
          value &&
          onRemove(qId, word)
        }
        /* =========================================
           نفس ستايلك السابق
        ========================================= */

        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // background: isOver ? "#e3f2fd" : "",
          cursor:
            !locked && !showAnswer && !checkCompleted && value
              ? "pointer"
              : "default",
          transition: "background 0.15s ease",
          // position: "relative",
        }}
        title={
          !locked && !showAnswer && !checkCompleted && value
            ? "Click to remove"
            : ""
        }
      >
        {displayedValue || ""}

        {isWrong && (
          <div className="wb-unit6-p2-q1-wrong-mark" aria-hidden="true">
            ✕
          </div>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit6_Page2_Q1 = () => {
  const [answers, setAnswers] = useState({});

  const [wrongInputs, setWrongInputs] = useState({});

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* ================= MOUSE DRAG ================= */

  const [activeNum, setActiveNum] = useState(null);

  const [activeQId, setActiveQId] = useState(null);

  /* ================= KEYBOARD ================= */

  const [keyboardPickedNum, setKeyboardPickedNum] = useState(null);

  const [focusedDropId, setFocusedDropId] = useState(null);

  const bankRefs = useRef({});
  const dropRefs = useRef({});

  /* ================= AUDIO ================= */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

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

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const TOTAL_WORDS = questions.reduce((sum, q) => sum + q.words.length, 0);

  /* =================================================
     HELPERS
  ================================================= */

  const getSlotKey = (qId, word) => `${qId}-${word}`;

  const isSlotLocked = (qId, word) =>
    lockedSlots.includes(getSlotKey(qId, word));

  const getUsedNumbers = (qId) => Object.values(answers[qId] || {});

  const isNumberUsed = (qId, num) => getUsedNumbers(qId).includes(String(num));

  /* =================================================
     AVAILABLE TARGETS
     نفس السؤال فقط
  ================================================= */

  const getAvailableDropIds = (qId) => {
    const question = questions.find((q) => q.id === qId);

    if (!question) {
      return [];
    }

    return question.words
      .filter((word) => !isSlotLocked(qId, word))
      .map((word) => `q-${qId}-${word}`);
  };

  /* =================================================
     PLACE NUMBER
  ================================================= */

  const placeNumber = (qId, word, num) => {
    if (showAnswerMode || checkCompleted || isSlotLocked(qId, word)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      const row = {
        ...(updated[qId] || {}),
      };

      /* =============================================
         الرقم نفسه ما يتكرر بنفس السؤال
      ============================================= */

      Object.keys(row).forEach((currentWord) => {
        if (row[currentWord] === num && currentWord !== word) {
          delete row[currentWord];
        }
      });

      row[word] = num;

      updated[qId] = row;

      return updated;
    });

    /* X نفس الخانة فقط */

    setWrongInputs((prev) => ({
      ...prev,

      [qId]: (prev[qId] || []).filter((item) => item !== word),
    }));
  };

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const handleDragStart = (event) => {
    const parts = String(event.active.id).split("-");

    const qId = Number(parts[1]);

    const num = parts[2];

    setActiveQId(qId);

    setActiveNum(num);
  };

  const handleDragEnd = (event) => {
    setActiveNum(null);
    setActiveQId(null);

    if (showAnswerMode || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !String(over.id).startsWith("q-")) {
      return;
    }

    /* num-{qId}-{num} */

    const activeParts = String(active.id).split("-");

    const sourceQId = Number(activeParts[1]);

    const num = activeParts[2];

    /* q-{qId}-{word} */

    const dropParts = String(over.id).split("-");

    const targetQId = Number(dropParts[1]);

    const word = dropParts.slice(2).join("-");

    /* =============================================
       ما بنسمح رقم من سؤال يروح لسؤال ثاني
    ============================================= */

    if (sourceQId !== targetQId) {
      return;
    }

    placeNumber(targetQId, word, num);
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (qId, num) => {
    if (showAnswerMode || checkCompleted || isNumberUsed(qId, num)) {
      return;
    }

    setKeyboardPickedNum({
      qId,
      num,
    });

    setFocusedDropId(null);

    requestAnimationFrame(() => {
      const available = getAvailableDropIds(qId);

      if (!available.length) {
        return;
      }

      dropRefs.current[available[0]]?.focus();
    });
  };

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (droppableId) => {
    if (!keyboardPickedNum || showAnswerMode || checkCompleted) {
      return;
    }

    const parts = droppableId.split("-");

    const qId = Number(parts[1]);

    const word = parts.slice(2).join("-");

    if (qId !== keyboardPickedNum.qId) {
      return;
    }

    if (isSlotLocked(qId, word)) {
      return;
    }

    const num = keyboardPickedNum.num;

    placeNumber(qId, word, num);

    setKeyboardPickedNum(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      bankRefs.current[`${qId}-${num}`]?.focus();
    }, 0);
  };

  /* =================================================
     FILLED SLOT → RETURN NUMBER
  ================================================= */

  const handleKeyboardRemovePlaced = (qId, droppableId, currentNum) => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    const parts = droppableId.split("-");

    const word = parts.slice(2).join("-");

    if (isSlotLocked(qId, word)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      const row = {
        ...(updated[qId] || {}),
      };

      delete row[word];

      updated[qId] = row;

      return updated;
    });

    setWrongInputs((prev) => ({
      ...prev,

      [qId]: (prev[qId] || []).filter((item) => item !== word),
    }));

    setKeyboardPickedNum(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      bankRefs.current[`${qId}-${currentNum}`]?.focus();
    }, 0);
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const handleCancelKeyboardPick = () => {
    const picked = keyboardPickedNum;

    setKeyboardPickedNum(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      if (picked) {
        bankRefs.current[`${picked.qId}-${picked.num}`]?.focus();
      }
    }, 0);
  };

  /* =================================================
     MOUSE REMOVE
  ================================================= */

  const handleRemove = (qId, word) => {
    if (showAnswerMode || checkCompleted || isSlotLocked(qId, word)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      const row = {
        ...(updated[qId] || {}),
      };

      delete row[word];

      updated[qId] = row;

      return updated;
    });

    setWrongInputs((prev) => ({
      ...prev,

      [qId]: (prev[qId] || []).filter((item) => item !== word),
    }));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswer = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    for (const q of questions) {
      const row = answers[q.id];

      if (!row || Object.keys(row).length !== q.words.length) {
        ValidationAlert.info(
          "Pay attention!",
          "Please number all the words before checking.",
        );

        return;
      }

      for (const word of q.words) {
        if (!row[word]) {
          ValidationAlert.info(
            "Pay attention!",
            "Please number all the words before checking.",
          );

          return;
        }
      }
    }

    let score = 0;

    const wrongMap = {};

    const newlyLocked = [];

    questions.forEach((q) => {
      const row = answers[q.id];

      wrongMap[q.id] = [];

      q.words.forEach((word) => {
        const userPos = Number(row[word]) - 1;

        const correctWord = q.correct[userPos];

        if (correctWord === word) {
          score++;

          newlyLocked.push(getSlotKey(q.id, word));
        } else {
          wrongMap[q.id].push(word);
        }
      });
    });

    /* الصح فقط يقفل */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /* الغلط يضل editable */

    setWrongInputs(wrongMap);

    setKeyboardPickedNum(null);

    setFocusedDropId(null);

    const color =
      score === TOTAL_WORDS ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${score} / ${TOTAL_WORDS}
        </span>
      </div>
    `;

    if (score === TOTAL_WORDS) {
      const allSlots = [];

      questions.forEach((q) => {
        q.words.forEach((word) => {
          allSlots.push(getSlotKey(q.id, word));
        });
      });

      setLockedSlots(allSlots);

      setWrongInputs({});

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswer = () => {
    stopAudio();

    const filled = {};

    const allSlots = [];

    questions.forEach((q) => {
      const row = {};

      q.correct.forEach((word, i) => {
        row[word] = String(i + 1);

        allSlots.push(getSlotKey(q.id, word));
      });

      filled[q.id] = row;
    });

    setAnswers(filled);

    setWrongInputs({});

    setLockedSlots(allSlots);

    setShowAnswerMode(true);

    setCheckCompleted(true);

    setKeyboardPickedNum(null);

    setFocusedDropId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongInputs({});

    setLockedSlots([]);

    setShowAnswerMode(false);

    setCheckCompleted(false);

    setActiveNum(null);

    setActiveQId(null);

    setKeyboardPickedNum(null);

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
      onDragCancel={() => {
        setActiveNum(null);
        setActiveQId(null);
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="C"
            title="Unscramble and number."
            subTitle="Drag 1–5 to put the words in the correct sentence order."
          />

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="wb-unit6-p2-q1-questions">
            {questions.map((q) => {
              const usedNumbers = getUsedNumbers(q.id);

              return (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* =========================================
                        NUMBER BANK FOR THIS QUESTION
                    ========================================= */}

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
                      marginBottom: "10px",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <DraggableNumber
                        key={`${q.id}-${num}`}
                        qId={q.id}
                        num={num}
                        disabled={
                          showAnswerMode ||
                          checkCompleted ||
                          usedNumbers.includes(String(num))
                        }
                        keyboardPickedNum={keyboardPickedNum}
                        onKeyboardPick={handleKeyboardPick}
                        bankRefs={bankRefs}
                      />
                    ))}
                  </div>

                  {/* =========================================
                        ORIGINAL QUESTION ROW
                    ========================================= */}

                  <div className="wb-unit6-p2-q1-row">
                    <div className="wb-unit6-p2-q1-number">{q.id}</div>

                    <div className="wb-unit6-p2-q1-words">
                      {q.words.map((word) => (
                        <DroppableWordBox
                          key={word}
                          qId={q.id}
                          word={word}
                          value={answers[q.id]?.[word] || ""}
                          isWrong={wrongInputs[q.id]?.includes(word)}
                          locked={isSlotLocked(q.id, word)}
                          showAnswer={showAnswerMode}
                          checkCompleted={checkCompleted}
                          keyboardPickedNum={keyboardPickedNum}
                          focusedDropId={focusedDropId}
                          setFocusedDropId={setFocusedDropId}
                          dropRefs={dropRefs}
                          getAvailableDropIds={getAvailableDropIds}
                          onKeyboardDrop={handleKeyboardDrop}
                          onKeyboardRemovePlaced={handleKeyboardRemovePlaced}
                          onCancelKeyboardPick={handleCancelKeyboardPick}
                          onRemove={handleRemove}
                          playingKey={playingKey}
                          playAudio={playAudio}
                        />
                      ))}
                    </div>
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
          <button className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>

          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswer}>
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
          نفس الستايل القديم
      ================================================= */}

      <DragOverlay>
        {activeNum && (
          <div
            style={{
              padding: "7px 14px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              cursor: "grabbing",
            }}
          >
            {activeNum}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit6_Page2_Q1;
