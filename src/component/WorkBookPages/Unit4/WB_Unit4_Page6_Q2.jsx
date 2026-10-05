import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page6_Q2.css";

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

import img1 from "../../../assets/U1 WB/U4/U4P26EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U4/U4P26EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U4/U4P26EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U4/U4P26EXEB-04.svg";
import img5 from "../../../assets/U1 WB/U4/U4P26EXEB-05.svg";
import img6 from "../../../assets/U1 WB/U4/U4P26EXEB-06.svg";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import feetAudio from "../../../assets/U1 WB/U4/audio/page_26/Item_001_feet.mp3";
import forkAudio from "../../../assets/U1 WB/U4/audio/page_26/Item_002_fork.mp3";
import fishAudio from "../../../assets/U1 WB/U4/audio/page_26/Item_003_fish.mp3";
import vetAudio from "../../../assets/U1 WB/U4/audio/page_26/Item_004_vet.mp3";
import vestAudio from "../../../assets/U1 WB/U4/audio/page_26/Item_005_vest.mp3";
import vanAudio from "../../../assets/U1 WB/U4/audio/page_26/Item_006_van.mp3";

/* =====================================================
   WORD DATA
===================================================== */

const wordData = [
  {
    word: "fish",
    audio: fishAudio,
  },
  {
    word: "feet",
    audio: feetAudio,
  },
  {
    word: "fork",
    audio: forkAudio,
  },
  {
    word: "vet",
    audio: vetAudio,
  },
  {
    word: "van",
    audio: vanAudio,
  },
  {
    word: "vest",
    audio: vestAudio,
  },
];

/* =====================================================
   IMAGE DATA + ALT
===================================================== */

const imageData = [
  {
    src: img1,
    alt: "A veterinarian holding a small animal.",
  },
  {
    src: img2,
    alt: "A blue vest.",
  },
  {
    src: img3,
    alt: "A pair of feet.",
  },
  {
    src: img4,
    alt: "A colorful fish.",
  },
  {
    src: img5,
    alt: "A fork.",
  },
  {
    src: img6,
    alt: "A yellow van.",
  },
];

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  word,
  audio,

  isUsed,
  locked,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,

  playingWord,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,
    disabled: isUsed || locked,
  });

  const disabled = isUsed || locked;

  const isPicked = keyboardPickedWord === word;

  const isPlaying = playingWord === word;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);

          bankRefs.current[word] = el;
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
            ? `${word} selected. Press Tab to choose a box, then Enter or Space to place it.`
            : `${word}. Press Enter or Space to hear and select this word.`
        }
        onClick={() => {
          if (disabled) return;

          playAudio(word, audio);
        }}
        onKeyDown={(e) => {
          if (disabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            playAudio(word, audio);

            onKeyboardPick(word);
          }
        }}
        className={`word-box-wb-unit4-p4-q1 drag-word-wb-unit4-p6-q2 ${
          isPicked ? "keyboard-picked-word-wb-unit4-p6-q2" : ""
        }`}
        style={{
          padding: "7px 14px",

          border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

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
      </div>

      {isPlaying && (
        <FaVolumeUp
          size={15}
          aria-hidden="true"
          className="audio-icon-wb-unit4-p6-q2"
        />
      )}
    </div>
  );
};

/* =====================================================
   DROP CELL
===================================================== */

const DroppableCell = ({
  droppableId,
  value,

  isWrong,
  locked,

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
    id: droppableId,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const canFixWrong =
    !!value &&
    isWrong &&
    !keyboardPickedWord &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardDropActive && focusedDropId === droppableId;

  const displayedValue = showPreview ? keyboardPickedWord : value;

  const handleKeyDown = (e) => {
    /* =========================================
       WRONG SLOT AFTER CHECK
       Enter => return word to bank
    ========================================= */

    if (canFixWrong && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(droppableId, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =========================================
       TAB BETWEEN DROP TARGETS
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableDropIds();

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
       PLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(droppableId);

      return;
    }

    /* =========================================
       CANCEL
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

        dropRefs.current[droppableId] = el;
      }}
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
            ? `This box currently contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
            : `Empty answer box. Press Enter or Space to place ${keyboardPickedWord}.`
          : canFixWrong
            ? `${value} is incorrect. Press Enter or Space to return it to the word bank.`
            : value
              ? `Answer box containing ${value}.`
              : "Empty answer box."
      }
      className={`input-cell-wb-unit4-p6-q2 ${isOver ? "drag-over-cell" : ""} ${
        showPreview ? "keyboard-drop-preview-wb-unit4-p6-q2" : ""
      }`}
      onFocus={() => {
        if (keyboardDropActive) {
          setFocusedDropId(droppableId);
        }
      }}
      onBlur={() => {
        setFocusedDropId(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (value && !locked && !showAnswer && !checkCompleted) {
          onRemove(droppableId);
        }
      }}
      style={{
        position: "relative",

        background: isOver ? "#e3f2fd" : "",

        cursor:
          value && !locked && !showAnswer && !checkCompleted
            ? "pointer"
            : "default",

        transition: "background 0.15s ease",
      }}
      title={
        value && !locked && !showAnswer && !checkCompleted
          ? "Click to remove"
          : ""
      }
    >
      {displayedValue}

      {isWrong && value && (
        <span className="wrong-x-circle-wb-u1-p8-q2" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

export default function WB_Unit4_Page6_Q2() {
  /* =================================================
     ANSWERS
  ================================================= */

  const [columnF, setColumnF] = useState(["", "", ""]);

  const [columnV, setColumnV] = useState(["", "", ""]);

  /* =================================================
     CHECK STATE
  ================================================= */

  const [wrongSlots, setWrongSlots] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     DND
  ================================================= */

  const [activeWord, setActiveWord] = useState(null);

  /* =================================================
     KEYBOARD DND
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
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  /* =================================================
     HELPERS
  ================================================= */

  const usedWords = [...columnF, ...columnV].filter(Boolean);

  const isSlotLocked = (id) => lockedSlots.includes(id);

  const getSlotValue = (droppableId) => {
    const [column, indexString] = droppableId.split("-");

    const index = Number(indexString);

    return column === "f" ? columnF[index] : columnV[index];
  };

  const isCorrectSlot = (droppableId, value) => {
    if (!value) return false;

    if (droppableId.startsWith("f-")) {
      return value.startsWith("f");
    }

    return value.startsWith("v");
  };

  const getAvailableDropIds = () => {
    const ids = [];

    [0, 1, 2].forEach((index) => {
      const fId = `f-${index}`;

      const vId = `v-${index}`;

      if (!isSlotLocked(fId)) {
        ids.push(fId);
      }

      if (!isSlotLocked(vId)) {
        ids.push(vId);
      }
    });

    return ids;
  };

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (word, dest) => {
    if (showAnswer || checkCompleted || isSlotLocked(dest)) {
      return;
    }

    const [column, indexString] = dest.split("-");

    const index = Number(indexString);

    /*
      شيل الكلمة من مكانها القديم أولًا
    */

    const newF = [...columnF];

    const newV = [...columnV];

    newF.forEach((value, i) => {
      if (value === word) {
        newF[i] = "";
      }
    });

    newV.forEach((value, i) => {
      if (value === word) {
        newV[i] = "";
      }
    });

    /*
      REPLACE:
      إذا الخانة فيها كلمة ثانية
      مجرد نستبدلها.
      القديمة ترجع للبنك تلقائيًا.
    */

    if (column === "f") {
      newF[index] = word;
    } else {
      newV[index] = word;
    }

    setColumnF(newF);

    setColumnV(newV);

    /*
      شيل X فقط عن الخانة المعدّلة
    */

    setWrongSlots((prev) => prev.filter((id) => id !== dest));
  };

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const handleDragStart = (event) => {
    setActiveWord(event.active.id.replace("word-", ""));
  };

  const handleDragEnd = (event) => {
    setActiveWord(null);

    if (showAnswer || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over) return;

    const word = active.id.replace("word-", "");

    const dest = String(over.id);

    if (!dest.startsWith("f-") && !dest.startsWith("v-")) {
      return;
    }

    placeWord(word, dest);
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedWord(word);

    setFocusedDropId(null);

    requestAnimationFrame(() => {
      const available = getAvailableDropIds();

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
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(droppableId)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    placeWord(word, droppableId);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
      رجّع للفوكس على البنك
      لأول كلمة متاحة بعدها
    */

    window.setTimeout(() => {
      const currentUsed = [...columnF, ...columnV, word].filter(Boolean);

      const next = wordData.find((item) => !currentUsed.includes(item.word));

      if (next) {
        bankRefs.current[next.word]?.focus();
      }
    }, 0);
  };

  /* =================================================
     WRONG SLOT AFTER CHECK
  ================================================= */

  const handleKeyboardClearWrong = (droppableId, currentWord) => {
    if (showAnswer || checkCompleted || isSlotLocked(droppableId)) {
      return;
    }

    const [column, indexString] = droppableId.split("-");

    const index = Number(indexString);

    if (column === "f") {
      setColumnF((prev) => {
        const copy = [...prev];

        copy[index] = "";

        return copy;
      });
    } else {
      setColumnV((prev) => {
        const copy = [...prev];

        copy[index] = "";

        return copy;
      });
    }

    /*
        X فقط نفس الخانة
      */

    setWrongSlots((prev) => prev.filter((id) => id !== droppableId));

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
        رجع لنفس الكلمة بالبنك
      */

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

    setFocusedDropId(null);

    window.setTimeout(() => {
      if (word) {
        bankRefs.current[word]?.focus();
      }
    }, 0);
  };

  /* =================================================
     REMOVE WITH MOUSE
  ================================================= */

  const handleRemove = (droppableId) => {
    if (showAnswer || checkCompleted || isSlotLocked(droppableId)) {
      return;
    }

    const [column, indexString] = droppableId.split("-");

    const index = Number(indexString);

    if (column === "f") {
      setColumnF((prev) => {
        const copy = [...prev];

        copy[index] = "";

        return copy;
      });
    } else {
      setColumnV((prev) => {
        const copy = [...prev];

        copy[index] = "";

        return copy;
      });
    }

    setWrongSlots((prev) => prev.filter((id) => id !== droppableId));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const allInputs = [...columnF, ...columnV];

    if (allInputs.some((word) => !word || word.trim() === "")) {
      ValidationAlert.info("Please complete all answers before checking.");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    [0, 1, 2].forEach((index) => {
      const fId = `f-${index}`;

      const vId = `v-${index}`;

      if (columnF[index]?.startsWith("f")) {
        correctCount++;

        newlyLocked.push(fId);
      } else {
        wrong.push(fId);
      }

      if (columnV[index]?.startsWith("v")) {
        correctCount++;

        newlyLocked.push(vId);
      } else {
        wrong.push(vId);
      }
    });

    /*
      الصح فقط يقفل
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      الغلط يضل editable
    */

    setWrongSlots(wrong);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    const total = wordData.length;

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
      setLockedSlots(["f-0", "f-1", "f-2", "v-0", "v-1", "v-2"]);

      setWrongSlots([]);

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

  const showCorrectAnswers = () => {
    stopAudio();

    setColumnF(["fish", "feet", "fork"]);

    setColumnV(["vet", "van", "vest"]);

    setWrongSlots([]);

    setLockedSlots(["f-0", "f-1", "f-2", "v-0", "v-1", "v-2"]);

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

    setColumnF(["", "", ""]);

    setColumnV(["", "", ""]);

    setWrongSlots([]);

    setLockedSlots([]);

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
      onDragCancel={() => setActiveWord(null)}
    >
      <div
        className="page8-wrapper"
        style={{
          padding: "30px",
        }}
      >
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="B"
            title="Look and write the words in the correct column."
            subTitle="Say each word, then place it under f or v."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "35px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              width: "100%",

              alignItems: "center",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {wordData.map((item) => (
              <DraggableWord
                key={item.word}
                word={item.word}
                audio={item.audio}
                locked={showAnswer || checkCompleted}
                isUsed={usedWords.includes(item.word)}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
                playingWord={playingWord}
                playAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              IMAGE BANK + TABLE
          ================================================= */}

          <div className="content-container-wb-unit4-p6-q2">
            {/* IMAGE BANK */}

            <div className="img-bank-wb-unit4-p6-q2">
              {imageData.map((item, index) => (
                <img
                  key={index}
                  src={item.src}
                  alt={item.alt}
                  style={{
                    height: "100px",

                    width: "auto",
                  }}
                />
              ))}
            </div>

            {/* TABLE */}

            <div className="table-div-wb-unit4-p6-q2">
              <table className="sorting-table-wb-unit4-p6-q2">
                <thead>
                  <tr>
                    <th scope="col">f</th>

                    <th scope="col">v</th>
                  </tr>
                </thead>

                <tbody>
                  {[0, 1, 2].map((index) => (
                    <tr key={index}>
                      <td
                        style={{
                          position: "relative",
                        }}
                      >
                        <DroppableCell
                          droppableId={`f-${index}`}
                          value={columnF[index]}
                          isWrong={wrongSlots.includes(`f-${index}`)}
                          locked={isSlotLocked(`f-${index}`)}
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
                      </td>

                      <td
                        style={{
                          position: "relative",
                        }}
                      >
                        <DroppableCell
                          droppableId={`v-${index}`}
                          value={columnV[index]}
                          isWrong={wrongSlots.includes(`v-${index}`)}
                          locked={isSlotLocked(`v-${index}`)}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord && (
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
            {activeWord}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
