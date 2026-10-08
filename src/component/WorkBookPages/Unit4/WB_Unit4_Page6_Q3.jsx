import React, { useMemo, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page6_Q3.css";

import img1 from "../../../assets/U1 WB/U4/U4P26EXEBC-01.svg";
import img2 from "../../../assets/U1 WB/U4/U4P26EXEBC-02.svg";
import img3 from "../../../assets/U1 WB/U4/U4P26EXEBC-03.svg";
import img4 from "../../../assets/U1 WB/U4/U4P26EXEBC-04.svg";
import img5 from "../../../assets/U1 WB/U4/U4P26EXEBC-05.svg";
import img6 from "../../../assets/U1 WB/U4/U4P26EXEBC-06.svg";

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
   DATA
===================================================== */

const data = [
  {
    parts: [
      {
        before: "A",
        middleImg: img1,
        imageAlt: "A colorful fish.",
        blank: 0,
        after: "",
      },
      {
        before: "is driving a",
        middleImg: img4,
        imageAlt: "A yellow van.",
        blank: 1,
        after: ".",
      },
    ],

    correct: ["fish", "van"],
  },

  {
    parts: [
      {
        before: "A",
        middleImg: img2,
        imageAlt: "A veterinarian.",
        blank: 0,
        after: "",
      },

      {
        before: "wearing a",
        middleImg: img5,
        imageAlt: "A blue vest.",
        blank: 1,
        after: "",
      },

      {
        before: "is running on his bare",
        middleImg: img3,
        imageAlt: "A pair of bare feet.",
        blank: 2,
        after: "",
      },

      {
        before: "after the van with a",
        middleImg: img6,
        imageAlt: "A fork.",
        blank: 3,
        after: "in his hand.",
      },
    ],

    correct: ["vet", "vest", "feet", "fork"],
  },
];

/* =====================================================
   AUDIO MAP
===================================================== */

const AUDIO_MAP = {
  fish: fishAudio,
  feet: feetAudio,
  fork: forkAudio,
  vet: vetAudio,
  vest: vestAudio,
  van: vanAudio,
};

/* =====================================================
   SHUFFLE
===================================================== */

const shuffle = (arr) => {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  id,
  word,

  locked,
  isUsed,

  keyboardPickedId,
  onKeyboardPick,

  bankRefs,

  playingWord,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    disabled: locked || isUsed,
  });

  const disabled = locked || isUsed;

  const isPicked = keyboardPickedId === id;

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
            ? `${word} selected. Press Tab to move through the blanks, then Enter or Space to place it.`
            : `${word}. Press Enter or Space to hear and select this word.`
        }
        onClick={() => {
          if (disabled) return;

          playAudio(word, AUDIO_MAP[word]);
        }}
        onKeyDown={(e) => {
          if (disabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            playAudio(word, AUDIO_MAP[word]);

            onKeyboardPick(id, word);
          }
        }}
        className={`drag-word-wb-unit4-p6-q3 ${
          isPicked ? "keyboard-picked-word-wb-unit4-p6-q3" : ""
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
          className="audio-icon-wb-unit4-p6-q3"
        />
      )}
    </div>
  );
};

/* =====================================================
   DROP BLANK
===================================================== */
const DroppableBlank = ({
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

  /* =================================================
     UPDATED DRAG PATTERN
     أي blank معبّى ولسا editable
     يضل reachable بالـTab حتى قبل Check
  ================================================= */

  const canEditFilled =
    !!value && !keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const showPreview = keyboardDropActive && focusedDropId === droppableId;

  const displayValue = showPreview ? keyboardPickedWord : value;

  const handleKeyDown = (e) => {
    /* =================================================
       FILLED ANSWER → RETURN TO BANK
    ================================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(droppableId);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB BETWEEN TARGETS
    ================================================= */

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

    /* =================================================
       DROP / REPLACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(droppableId);

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <div className="input-wrapper-wb-unit4-p6-q3">
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
              ? `Blank currently contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
              : `Empty blank. Press Enter or Space to place ${keyboardPickedWord}.`
            : canEditFilled
              ? `Blank containing ${value}. Press Enter or Space to return it to the word bank.`
              : value
                ? `Blank containing ${value}.`
                : "Empty blank."
        }
        className={`missing-input-wb-unit4-p6-q3 ${
          isOver ? "drag-over-cell" : ""
        } ${showPreview ? "keyboard-drop-preview-wb-unit4-p6-q3" : ""}`}
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
          background: isOver ? "#e3f2fd" : "",

          position: "relative",

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
        {displayValue}

        {isWrong && value && (
          <span className="wrong-icon-review4-p2-q1" aria-hidden="true">
            ✕
          </span>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit4_Page6_Q3 = () => {
  /* =================================================
     SHUFFLED BANK
  ================================================= */

  const shuffledBank = useMemo(
    () =>
      shuffle(
        data.flatMap((item, qi) =>
          item.correct.map((word, bi) => ({
            word,

            id: `bank-${qi}-${bi}`,
          })),
        ),
      ),

    [],
  );

  /* =================================================
     EMPTY ANSWERS
  ================================================= */

  const emptyAnswers = () =>
    data.map((item) => Array(item.correct.length).fill(null));

  /* =================================================
     STATE
  ================================================= */

  const [answers, setAnswers] = useState(emptyAnswers());

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswerState, setShowAnswerState] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* =================================================
     KEYBOARD DND
  ================================================= */

  const [keyboardPickedId, setKeyboardPickedId] = useState(null);

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
     USED BANK ITEMS
  ================================================= */

  const usedIds = answers
    .flat()
    .filter(Boolean)
    .map((answer) => answer.bankId);

  /* =================================================
     HELPERS
  ================================================= */

  const isInputLocked = (id) => lockedInputs.includes(id);

  const getAvailableDropIds = () => {
    const result = [];

    data.forEach((item, qi) => {
      item.correct.forEach((_, bi) => {
        const id = `blank-${qi}-${bi}`;

        if (!isInputLocked(id)) {
          result.push(id);
        }
      });
    });

    return result;
  };

  const findAnswerByDropId = (droppableId) => {
    const parts = droppableId.split("-");

    const qi = Number(parts[1]);

    const bi = Number(parts[2]);

    return {
      qi,
      bi,
      value: answers[qi][bi],
    };
  };

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (bankId, word, droppableId) => {
    if (showAnswerState || checkCompleted || isInputLocked(droppableId)) {
      return;
    }

    const parts = droppableId.split("-");

    const qi = Number(parts[1]);

    const bi = Number(parts[2]);

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      /*
        شيل نفس bankId إذا كان بمكان ثاني
      */

      copy.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value?.bankId === bankId) {
            copy[r][c] = null;
          }
        });
      });

      /*
        إذا الهدف فيه كلمة:
        القديمة ترجع للبنك تلقائيًا
        لأنه بنكها ما عاد مستخدم.
      */

      copy[qi][bi] = {
        word,
        bankId,
      };

      return copy;
    });

    /*
      X فقط نفس blank
    */

    setWrongInputs((prev) => prev.filter((id) => id !== `${qi}-${bi}`));
  };

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const handleDragStart = (event) => {
    const item = shuffledBank.find(
      (bankItem) => bankItem.id === event.active.id,
    );

    setActiveWord(item?.word ?? null);
  };

  const handleDragEnd = (event) => {
    setActiveWord(null);

    if (showAnswerState || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !String(over.id).startsWith("blank-")) {
      return;
    }

    const bankItem = shuffledBank.find((item) => item.id === active.id);

    if (!bankItem) return;

    placeWord(bankItem.id, bankItem.word, String(over.id));
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (id, word) => {
    if (showAnswerState || checkCompleted) {
      return;
    }

    setKeyboardPickedId(id);

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
      !keyboardPickedId ||
      !keyboardPickedWord ||
      showAnswerState ||
      checkCompleted ||
      isInputLocked(droppableId)
    ) {
      return;
    }

    const currentBankId = keyboardPickedId;

    placeWord(keyboardPickedId, keyboardPickedWord, droppableId);

    setKeyboardPickedId(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
      روح لأول كلمة بعدها متاحة
    */

    window.setTimeout(() => {
      const next = shuffledBank.find(
        (item) => item.id !== currentBankId && !usedIds.includes(item.id),
      );

      if (next) {
        bankRefs.current[next.id]?.focus();
      }
    }, 0);
  };

  /* =================================================
     WRONG ANSWER AFTER CHECK
  ================================================= */

  const handleKeyboardClearWrong = (droppableId) => {
    const { qi, bi, value } = findAnswerByDropId(droppableId);

    if (
      !value ||
      showAnswerState ||
      checkCompleted ||
      isInputLocked(droppableId)
    ) {
      return;
    }

    const bankId = value.bankId;

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      copy[qi][bi] = null;

      return copy;
    });

    setWrongInputs((prev) => prev.filter((id) => id !== `${qi}-${bi}`));

    setKeyboardPickedId(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /*
        رجع لنفس الخيار بالبنك
      */

    window.setTimeout(() => {
      bankRefs.current[bankId]?.focus();
    }, 0);
  };

  /* =================================================
     CANCEL
  ================================================= */

  const handleCancelKeyboardPick = () => {
    const id = keyboardPickedId;

    setKeyboardPickedId(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      if (id) {
        bankRefs.current[id]?.focus();
      }
    }, 0);
  };

  /* =================================================
     REMOVE WITH MOUSE
  ================================================= */

  const handleRemove = (droppableId) => {
    const parts = droppableId.split("-");

    const qi = Number(parts[1]);

    const bi = Number(parts[2]);

    if (showAnswerState || checkCompleted || isInputLocked(droppableId)) {
      return;
    }

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      copy[qi][bi] = null;

      return copy;
    });

    setWrongInputs((prev) => prev.filter((id) => id !== `${qi}-${bi}`));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswerState || checkCompleted) {
      return;
    }

    const hasEmpty = answers.some((row) => row.some((value) => !value));

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      return;
    }

    const wrong = [];

    const newlyLocked = [];

    let correctCount = 0;

    answers.forEach((row, qi) => {
      row.forEach((value, bi) => {
        const dropId = `blank-${qi}-${bi}`;

        if (value?.word === data[qi].correct[bi]) {
          correctCount++;

          newlyLocked.push(dropId);
        } else {
          wrong.push(`${qi}-${bi}`);
        }
      });
    });

    /*
      الصح يقفل فقط
    */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setWrongInputs(wrong);

    setKeyboardPickedId(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    const totalInputs = data.reduce(
      (total, item) => total + item.correct.length,

      0,
    );

    const color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${totalInputs}
        </span>
      </div>
    `;

    if (correctCount === totalInputs) {
      const allIds = [];

      data.forEach((item, qi) => {
        item.correct.forEach((_, bi) => {
          allIds.push(`blank-${qi}-${bi}`);
        });
      });

      setLockedInputs(allIds);

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
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

    const usedBankIds = new Set();

    const filled = data.map((item) =>
      item.correct.map((word) => {
        const bankItem = shuffledBank.find(
          (bank) => bank.word === word && !usedBankIds.has(bank.id),
        );

        if (bankItem) {
          usedBankIds.add(bankItem.id);

          return {
            word: bankItem.word,

            bankId: bankItem.id,
          };
        }

        return null;
      }),
    );

    setAnswers(filled);

    setWrongInputs([]);

    const allIds = [];

    data.forEach((item, qi) => {
      item.correct.forEach((_, bi) => {
        allIds.push(`blank-${qi}-${bi}`);
      });
    });

    setLockedInputs(allIds);

    setShowAnswerState(true);

    setCheckCompleted(true);

    setKeyboardPickedId(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(emptyAnswers());

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswerState(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedId(null);

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
      <div className="page8-wrapper">
        <div
          className="div-forall"
          style={{
            gap: "50px",
          }}
        >
          <ExerciseHeader
            sectionLetter="C"
            title="Look and write. Then say."
            subTitle="Use the pictures to drag feet, vet, vest, fish, van, and fork into the blanks."
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
            {shuffledBank.map(({ id, word }) => (
              <DraggableWord
                key={id}
                id={id}
                word={word}
                locked={showAnswerState || checkCompleted}
                isUsed={usedIds.includes(id)}
                keyboardPickedId={keyboardPickedId}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
                playingWord={playingWord}
                playAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              SENTENCES
          ================================================= */}

          {data.map((item, qi) => (
            <div className="row-missing" key={qi}>
              <span className="num">{qi + 1}.</span>

              <div className="sentence-wb-unit4-p6-q3">
                {item.parts.map((part, bi) => {
                  const dropId = `blank-${qi}-${bi}`;

                  return (
                    <span
                      key={bi}
                      className="sentence-part"
                      style={{
                        display: "flex",

                        alignItems: "center",
                      }}
                    >
                      {part.before}

                      <DroppableBlank
                        droppableId={dropId}
                        value={answers[qi][bi]?.word || ""}
                        isWrong={wrongInputs.includes(`${qi}-${bi}`)}
                        locked={isInputLocked(dropId)}
                        showAnswer={showAnswerState}
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

                      {part.after}

                      <img
                        src={part.middleImg}
                        alt={part.imageAlt}
                        className="middle-img"
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
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

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
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
};

export default WB_Unit4_Page6_Q3;
