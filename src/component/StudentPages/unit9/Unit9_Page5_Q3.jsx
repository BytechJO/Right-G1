/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useRef, useState } from "react";

import conversation from "../../../assets/unit9/imgs/Asset 11.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Unit9_Page5_Q3.css";

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import cowsAudio from "../../../assets/unit9/sound/Page 80 - B/cows.mp3";

import threeAudio from "../../../assets/unit9/sound/Page 80 - B/three.mp3";

import howManyDogsAudio from "../../../assets/unit9/sound/Page 80 - B/How many dogs are there.mp3";

import thereIsOneDogAudio from "../../../assets/unit9/sound/Page 80 - B/There is one dog..mp3";

import howManyCowsAudio from "../../../assets/unit9/sound/Page 80 - B/How many [ _____ ] are there.mp3";

import thereAreThreeCowsAudio from "../../../assets/unit9/sound/Page 80 - B/There are [ _____ ] cows..mp3";

/* =====================================================
   FULL CORRECT AUDIO
===================================================== */

import full1Audio from "../../../assets/unit9/sound/Page 80 - B/full1.mp3";

import full2Audio from "../../../assets/unit9/sound/Page 80 - B/full2.mp3";

/* =====================================================
   BANK WORD
===================================================== */

function BankWord({
  id,
  word,
  isUsed,
  globalDisabled,
  isSelected,
  onKeyboardPick,
  playing,
  onPlayAudio,
  registerRef,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: isUsed || globalDisabled,
    });

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isUsed ? 0.35 : isDragging ? 0.4 : 1,

    borderRadius: "8px",

    border: `2px solid ${isUsed ? "#aaa" : "#2c5287"}`,

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    fontWeight: "bold",

    cursor: isUsed || globalDisabled ? "pointer" : "grab",

    background: isUsed ? "#e9e9e9" : "white",

    color: isUsed ? "#999" : "inherit",

    padding: "4px 28px 4px 12px",

    fontSize: "1rem",

    userSelect: "none",

    touchAction: "none",

    transition: "opacity 0.2s, background 0.2s, border-color 0.2s",

    pointerEvents: "auto",

    whiteSpace: "nowrap",

    position: "relative",
  };

  return (
    <span
      ref={(node) => {
        setNodeRef(node);

        registerRef(word, node);
      }}
      style={style}
      {...(isUsed
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role="button"
      tabIndex={0}
      aria-disabled={isUsed || globalDisabled}
      aria-pressed={isSelected}
      aria-label={`${word}. Press Enter or Space to hear it${
        isUsed || globalDisabled ? "." : " and select it."
      }`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          onPlayAudio();

          if (!isUsed && !globalDisabled) {
            onKeyboardPick(word);
          }
        }
      }}
      onClick={(e) => {
        e.stopPropagation();

        onPlayAudio();
      }}
    >
      {word}

      {playing && (
        <FaVolumeUp
          aria-hidden="true"
          className="unit9-p5-q3-bank-audio-icon"
        />
      )}
    </span>
  );
}

/* =====================================================
   DROP ZONE
===================================================== */

function InputDropZone({
  id,
  index,
  value,
  area,
  isWrong,
  disabled,
  selectedWord,
  onReturn,
  onPlace,
  onCancel,
  onMove,
  onFocus,
  showPreview,
  registerRef,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled,
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);

        registerRef(index, node);
      }}
      role="button"
      tabIndex={disabled ? -1 : selectedWord || value ? 0 : -1}
      aria-disabled={disabled}
      onFocus={onFocus}
      aria-label={
        disabled
          ? `Blank ${index + 1} is correct and locked.`
          : selectedWord
            ? `Blank ${index + 1}. Press Enter or Space to place ${selectedWord}.`
            : value
              ? `Blank ${index + 1} contains ${value}. Press Enter or Space to return it to the word bank.`
              : `Blank ${index + 1}. Select a word first.`
      }
      onClick={() => {
        if (!disabled && value) {
          onReturn(id);
        }
      }}
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }

        if (selectedWord && e.key === "Tab") {
          e.preventDefault();

          onMove(index, e.shiftKey);

          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          if (selectedWord) {
            onPlace(index);
          } else if (value) {
            onReturn(id);
          }

          return;
        }

        if (selectedWord && e.key === "Escape") {
          e.preventDefault();

          onCancel();
        }
      }}
      title={!disabled && value ? "Click to return" : ""}
      style={{
        position: "absolute",

        top: `${area.y}%`,

        left: `${area.x}%`,

        width: `${area.w}%`,

        height: `${area.h}%`,

        border: isWrong
          ? "2px solid red"
          : isOver
            ? "2px solid #2c5287"
            : "2px solid black",

        borderRadius: "8px",

        background: isOver ? "#eef4ff" : "white",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        cursor: !disabled && value ? "pointer" : "default",

        transition: "background 0.15s, border-color 0.15s",

        boxSizing: "border-box",

        overflow: "hidden",

        zIndex: 3,
      }}
    >
      {value && (
        <span
          style={{
            fontWeight: "bold",

            fontSize: "1.2vw",

            color: "#2c5287",

            userSelect: "none",
          }}
        >
          {value}
        </span>
      )}

      {showPreview && (
        <span className="keyboard-drop-preview" aria-hidden="true">
          {selectedWord}
        </span>
      )}
    </div>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit9_Page5_Q3 = () => {
  /* =================================================
       DROP AREAS

       IMPORTANT:
       drop-0 = RIGHT answer:
       There are [ three ] cows.

       drop-1 = LEFT question:
       How many [ cows ] are there?
    ================================================= */

  const clickableAreas = [
    {
      x: 83,
      y: 65.5,
      w: 8.8,
      h: 11,
    },

    {
      x: 52,
      y: 65.5,
      w: 9.8,
      h: 12,
    },
  ];

  /* =================================================
       BANK
    ================================================= */

  const bankWords = ["cows", "three"];

  /*
      FIXED ANSWER ORDER:

      drop-0 => three
      drop-1 => cows
    */

  const correctAnswers = ["three", "cows"];

  const wordAudios = {
    cows: cowsAudio,

    three: threeAudio,
  };

  /* =================================================
       NORMAL SENTENCE AUDIO

       These are used before the related blank
       becomes correct/locked.
    ================================================= */

  const sentenceAudios = [
    {
      key: "sentence-dog-question",

      label: "How many dogs are there?",

      src: howManyDogsAudio,

      area: {
        x: 33,
        y: 0,
        w: 29,
        h: 35,
      },

      zoneIndex: null,
    },

    {
      key: "sentence-dog-answer",

      label: "There is one dog.",

      src: thereIsOneDogAudio,

      area: {
        x: 70,
        y: 0,
        w: 29,
        h: 31,
      },

      zoneIndex: null,
    },

    {
      key: "sentence-cow-question-partial",

      label: "How many blank are there?",

      src: howManyCowsAudio,

      area: {
        x: 37,
        y: 65,
        w: 15,
        h: 34,
      },

      /*
            Question blank = drop-1.
          */

      zoneIndex: 1,
    },

    {
      key: "sentence-cow-answer-partial",

      label: "There are blank cows.",

      src: thereAreThreeCowsAudio,

      area: {
        x: 69,
        y: 65,
        w: 14,
        h: 34,
      },

      /*
            Answer blank = drop-0.
          */

      zoneIndex: 0,
    },
  ];

  /* =================================================
       FULL CORRECT SENTENCE AUDIO

       Once Check locks the correct blank,
       the WHOLE sentence becomes one audio control.
    ================================================= */

  const completedSentences = [
    {
      key: "full-cow-question",

      zoneIndex: 1,

      label: "How many cows are there?",

      src: full1Audio,

      /*
            Covers sentence + blank together.
          */

      area: {
        x: 37,
        y: 65,
        w: 25,
        h: 34,
      },
    },

    {
      key: "full-cow-answer",

      zoneIndex: 0,

      label: "There are three cows.",

      src: full2Audio,

      /*
            Covers the whole answer bubble.
          */

      area: {
        x: 69,
        y: 65,
        w: 30,
        h: 34,
      },
    },
  ];

  /* =================================================
       STATE
    ================================================= */

  const [placed, setPlaced] = useState({});

  const [usedWords, setUsedWords] = useState(new Set());

  const [wrongZones, setWrongZones] = useState([]);

  const [locked, setLocked] = useState(false);

  const [activeId, setActiveId] = useState(null);

  const [lockedZones, setLockedZones] = useState([]);

  const [selectedWord, setSelectedWord] = useState(null);

  const [focusedZoneIndex, setFocusedZoneIndex] = useState(null);

  /* =================================================
       REFS
    ================================================= */

  const bankRefs = useRef({});

  const zoneRefs = useRef([]);

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  /* =================================================
       AUDIO
    ================================================= */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      try {
        audioRef.current.currentTime = 0;
      } catch {
        // Ignore currentTime errors.
      }

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) {
      return;
    }

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
      }
    };
  }, []);

  /* =================================================
       DND SENSORS
    ================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,

        tolerance: 8,
      },
    }),
  );

  /* =================================================
       DRAG
    ================================================= */

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || locked) {
      return;
    }

    const wordId = active.id;

    const zoneId = over.id;

    if (!zoneId.startsWith("drop-")) {
      return;
    }

    const zoneIndex = Number(zoneId.replace("drop-", ""));

    if (lockedZones.includes(zoneIndex)) {
      return;
    }

    const previousWord = placed[zoneId];

    setPlaced((prev) => {
      const next = {
        ...prev,
      };

      Object.keys(next).forEach((key) => {
        if (next[key] === wordId) {
          delete next[key];
        }
      });

      next[zoneId] = wordId;

      return next;
    });

    setUsedWords((prev) => {
      const next = new Set(prev);

      if (previousWord) {
        next.delete(previousWord);
      }

      next.add(wordId);

      return next;
    });

    /*
          Editing this zone clears
          only this zone's X.
        */

    setWrongZones((prev) => prev.filter((item) => item !== zoneIndex));
  };

  /* =================================================
       RETURN FILLED SLOT TO BANK
    ================================================= */

  const handleReturn = (zoneId) => {
    const zoneIndex = Number(zoneId.replace("drop-", ""));

    if (locked || lockedZones.includes(zoneIndex)) {
      return;
    }

    const word = placed[zoneId];

    if (!word) {
      return;
    }

    setPlaced((prev) => {
      const next = {
        ...prev,
      };

      delete next[zoneId];

      return next;
    });

    setUsedWords((prev) => {
      const next = new Set(prev);

      next.delete(word);

      return next;
    });

    setWrongZones((prev) => prev.filter((item) => item !== zoneIndex));

    requestAnimationFrame(() => bankRefs.current[word]?.focus());
  };

  /* =================================================
       KEYBOARD DRAG
    ================================================= */

  const availableZones = () =>
    clickableAreas
      .map((_, index) => index)
      .filter((index) => !lockedZones.includes(index));

  const handleKeyboardPick = (word) => {
    if (locked) {
      return;
    }

    setSelectedWord(word);

    const first = availableZones()[0];

    if (first !== undefined) {
      requestAnimationFrame(() => zoneRefs.current[first]?.focus());
    }
  };

  const placeSelectedWord = (index) => {
    if (!selectedWord || lockedZones.includes(index)) {
      return;
    }

    const zoneId = `drop-${index}`;

    const word = selectedWord;

    const previousWord = placed[zoneId];

    const futureUsedWords = new Set(usedWords);

    if (previousWord) {
      futureUsedWords.delete(previousWord);
    }

    futureUsedWords.add(word);

    setPlaced((prev) => {
      const next = {
        ...prev,
      };

      Object.keys(next).forEach((key) => {
        const keyIndex = Number(key.replace("drop-", ""));

        if (next[key] === word && !lockedZones.includes(keyIndex)) {
          delete next[key];
        }
      });

      next[zoneId] = word;

      return next;
    });

    setUsedWords((prev) => {
      const next = new Set(prev);

      if (previousWord) {
        next.delete(previousWord);
      }

      next.add(word);

      return next;
    });

    setWrongZones((prev) => prev.filter((item) => item !== index));

    setSelectedWord(null);

    setFocusedZoneIndex(null);

    const currentWordIndex = bankWords.indexOf(word);

    const orderedNextWords = [
      ...bankWords.slice(currentWordIndex + 1),

      ...bankWords.slice(0, currentWordIndex),
    ];

    const nextWord =
      orderedNextWords.find((candidate) => !futureUsedWords.has(candidate)) ||
      orderedNextWords[0] ||
      word;

    requestAnimationFrame(() => bankRefs.current[nextWord]?.focus());
  };

  const cancelSelection = () => {
    const word = selectedWord;

    setSelectedWord(null);

    setFocusedZoneIndex(null);

    requestAnimationFrame(() => bankRefs.current[word]?.focus());
  };

  const moveZoneFocus = (current, backwards) => {
    const zones = availableZones();

    if (!zones.length) {
      return;
    }

    const position = zones.indexOf(current);

    const next = backwards
      ? zones[(position <= 0 ? zones.length : position) - 1]
      : zones[(position + 1) % zones.length];

    requestAnimationFrame(() => zoneRefs.current[next]?.focus());
  };

  /* =================================================
       CHECK
    ================================================= */

  const handleCheck = () => {
    if (locked) {
      return;
    }

    const allFilled = clickableAreas.every(
      (_, index) => placed[`drop-${index}`],
    );

    if (!allFilled) {
      ValidationAlert.info("Oops!", "Please fill all answers.");

      return;
    }

    const wrong = [];

    let correct = 0;

    clickableAreas.forEach((_, index) => {
      const userWord = placed[`drop-${index}`] || "";

      if (userWord.toLowerCase() === correctAnswers[index].toLowerCase()) {
        correct++;
      } else {
        wrong.push(index);
      }
    });

    setWrongZones(wrong);

    const newlyLocked = clickableAreas
      .map((_, index) =>
        placed[`drop-${index}`]?.toLowerCase() ===
        correctAnswers[index].toLowerCase()
          ? index
          : null,
      )
      .filter((index) => index !== null);

    setLockedZones((prev) => [...new Set([...prev, ...newlyLocked])]);

    if (correct === correctAnswers.length) {
      setLocked(true);
    }

    setSelectedWord(null);

    setFocusedZoneIndex(null);

    const total = correctAnswers.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
          <div style="font-size:20px;text-align:center;">
            <span style="color:${color};font-weight:bold;">
              Score: ${correct}/${total}
            </span>
          </div>
        `;

    if (correct === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =================================================
       RESET
    ================================================= */

  const handleReset = () => {
    stopAudio();

    setPlaced({});

    setUsedWords(new Set());

    setWrongZones([]);

    setLocked(false);

    setLockedZones([]);

    setSelectedWord(null);

    setFocusedZoneIndex(null);
  };

  /* =================================================
       SHOW ANSWER
    ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    const correctPlaced = {};

    const correctUsed = new Set();

    correctAnswers.forEach((word, index) => {
      correctPlaced[`drop-${index}`] = word;

      correctUsed.add(word);
    });

    setPlaced(correctPlaced);

    setUsedWords(correctUsed);

    setWrongZones([]);

    setLocked(true);

    setLockedZones(clickableAreas.map((_, index) => index));

    setSelectedWord(null);

    setFocusedZoneIndex(null);
  };

  /* =================================================
       HELPERS
    ================================================= */

  const isDisabled = locked;

  const isZoneCorrect = (zoneIndex) =>
    lockedZones.includes(zoneIndex) &&
    placed[`drop-${zoneIndex}`] === correctAnswers[zoneIndex];

  /* =================================================
       RENDER
    ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: "flex",

          justifyContent: "center",

          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            display: "flex",

            flexDirection: "column",

            justifyContent: "flex-start",

            alignItems: "flex-start",

            position: "relative",
          }}
        >
          <ExerciseHeader
            sectionLetter="B"
            title="Ask and answer."
            subTitle="Count the animals, then complete the question and answer with the correct words."
          />

          {/* =============================================
                WORD BANK
            ============================================= */}

          <div
            style={{
              display: "flex",

              gap: "30px",

              padding: "10px 16px",

              border: "2px dashed #ccc",

              borderRadius: "12px",

              marginTop: "16px",

              width: "100%",

              alignItems: "center",

              justifyContent: "center",

              marginBottom: "8px",

              flexWrap: "wrap",

              minHeight: "48px",
            }}
          >
            {bankWords.map((word) => (
              <BankWord
                key={word}
                id={word}
                word={word}
                isUsed={usedWords.has(word)}
                globalDisabled={isDisabled}
                isSelected={selectedWord === word}
                playing={playingKey === `word-${word}`}
                onPlayAudio={() => playAudio(`word-${word}`, wordAudios[word])}
                onKeyboardPick={handleKeyboardPick}
                registerRef={(bankWord, node) => {
                  if (node) {
                    bankRefs.current[bankWord] = node;
                  }
                }}
              />
            ))}
          </div>

          {/* =============================================
                IMAGE + AUDIO + DROP ZONES
            ============================================= */}

          <div
            style={{
              position: "relative",

              width: "100%",

              marginTop: "16px",

              aspectRatio: "3 / 1",
            }}
          >
            <img
              src={conversation}
              style={{
                width: "auto",

                height: "auto",

                objectFit: "contain",

                display: "block",
              }}
              alt="A counting activity showing one dog and three cows, with a girl asking and answering how many animals there are."
            />

            {/* =========================================
                  NORMAL / PARTIAL SENTENCE AUDIO

                  Cow partial audio disappears once
                  its own blank is correct and locked.
              ========================================= */}

            {sentenceAudios.map((sentence) => {
              const relatedZoneCorrect =
                sentence.zoneIndex !== null &&
                isZoneCorrect(sentence.zoneIndex);

              if (relatedZoneCorrect) {
                return null;
              }

              return (
                <button
                  key={sentence.key}
                  type="button"
                  aria-label={`Play sentence: ${sentence.label}`}
                  onClick={(e) => {
                    e.stopPropagation();

                    playAudio(sentence.key, sentence.src);
                  }}
                  style={{
                    position: "absolute",

                    left: `${sentence.area.x}%`,

                    top: `${sentence.area.y}%`,

                    width: `${sentence.area.w}%`,

                    height: `${sentence.area.h}%`,

                    padding: 0,

                    border: 0,

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 2,
                  }}
                >
                  {playingKey === sentence.key && (
                    <FaVolumeUp
                      aria-hidden="true"
                      className="unit9-p5-q3-sentence-audio-icon"
                    />
                  )}
                </button>
              );
            })}

            {/* =========================================
                  DROP ZONES
              ========================================= */}

            {clickableAreas.map((area, index) => (
              <React.Fragment key={index}>
                <InputDropZone
                  id={`drop-${index}`}
                  index={index}
                  value={placed[`drop-${index}`] || ""}
                  area={area}
                  isWrong={wrongZones.includes(index)}
                  disabled={isDisabled || lockedZones.includes(index)}
                  selectedWord={selectedWord}
                  onReturn={handleReturn}
                  onPlace={placeSelectedWord}
                  onCancel={cancelSelection}
                  onMove={moveZoneFocus}
                  onFocus={() => setFocusedZoneIndex(index)}
                  showPreview={
                    Boolean(selectedWord) && focusedZoneIndex === index
                  }
                  registerRef={(zoneIndex, node) => {
                    if (node) {
                      zoneRefs.current[zoneIndex] = node;
                    }
                  }}
                />

                {wrongZones.includes(index) && (
                  <div
                    className="wrong-icon-review4-p1-q1"
                    style={{
                      position: "absolute",

                      top: `calc(${area.y}% - 1.5%)`,

                      left: `calc(${area.x}% + ${area.w}% - 4%)`,

                      color: "white",
                    }}
                    aria-hidden="true"
                  >
                    ✕
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* =========================================
                  FULL CORRECT SENTENCE AUDIO

                  Only appears AFTER the related zone
                  has been checked and locked correct.

                  Whole sentence + blank = one control.
              ========================================= */}

            {completedSentences.map((sentence) => {
              if (!isZoneCorrect(sentence.zoneIndex)) {
                return null;
              }

              return (
                <button
                  key={sentence.key}
                  type="button"
                  className="completed-sentence-audio"
                  aria-label={`Play complete sentence: ${sentence.label}`}
                  onClick={(e) => {
                    e.stopPropagation();

                    playAudio(sentence.key, sentence.src);
                  }}
                  style={{
                    position: "absolute",

                    left: `${sentence.area.x}%`,

                    top: `${sentence.area.y}%`,

                    width: `${sentence.area.w}%`,

                    height: `${sentence.area.h}%`,

                    padding: 0,

                    border: 0,

                    background: "transparent",

                    cursor: "pointer",

                    zIndex: 7,

                    borderRadius: "10px",
                  }}
                >
                  {playingKey === sentence.key && (
                    <FaVolumeUp
                      aria-hidden="true"
                      className="unit9-p5-q3-full-audio-icon"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =============================================
            BUTTONS
        ============================================= */}

      <div className="action-buttons-container">
        <button onClick={handleReset} className="try-again-button">
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>

      {/* =============================================
            DRAG OVERLAY
        ============================================= */}

      <DragOverlay>
        {activeId ? (
          <span
            style={{
              borderRadius: "8px",

              border: "2px solid #2c5287",

              display: "inline-flex",

              alignItems: "center",

              justifyContent: "center",

              fontWeight: "bold",

              background: "white",

              padding: "4px 12px",

              fontSize: "1rem",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

              pointerEvents: "none",
            }}
          >
            {activeId}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit9_Page5_Q3;
