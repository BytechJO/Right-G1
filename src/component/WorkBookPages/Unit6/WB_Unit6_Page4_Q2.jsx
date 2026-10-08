import React, { useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U6/U6P36EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P36EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P36EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P36EXEH-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

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

import "./WB_Unit6_Page4_Q2.css";

/* =====================================================
   AUDIO
===================================================== */

import sheCanAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_001_she_can.mp3";
import sheFlyKiteAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_002_she_fly_a_kite.mp3";
import cantAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_003_can't.mp3";
import noHeCantAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_004_No,_he_can't.mp3";
import canHeRideBikeAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_005_Can_he_ride_a_bike.mp3";
import canHeSailBoatAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_006_Can_he_sail_a_boat.mp3";
import canItSwimAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_007_Can_it_swim.mp3";
import noItAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_008_No,_it.mp3";
import canAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_009_Can.mp3";
import yesAudio from "../../../assets/U1 WB/U6/audio/page 36 - H/Item_010_Yes,.mp3";

/* =====================================================
   DATA
===================================================== */

const wordBank = [
  "she can",
  "she fly a kite",
  "can't",
  "No, he can't",
  "Can he ride a bike",
  "Can he sail a boat",
];

const wordAudio = {
  "she can": sheCanAudio,
  "she fly a kite": sheFlyKiteAudio,
  "can't": cantAudio,
  "No, he can't": noHeCantAudio,
  "Can he ride a bike": canHeRideBikeAudio,
  "Can he sail a boat": canHeSailBoatAudio,
};

const correctMatches = [
  {
    input: "can't",
    num: "input1",
  },

  {
    input: "she fly a kite",
    num: "input2",
  },

  {
    input: "she can",
    num: "input3",
  },

  {
    input: "Can he sail a boat",
    num: "input4",
  },

  {
    input: "No, he can't",
    num: "input5",
  },

  {
    input: "Can he ride a bike",
    num: "input6",
  },

  {
    input: "No, he can't",
    num: "input7",
  },
];

/* =====================================================
   SECTION CONFIG

   كل section إذا كل inputs تبعته صح
   بصير هو نفسه audio button واحد.
===================================================== */

const sectionInputMap = {
  1: ["input1"],
  2: ["input2", "input3"],
  3: ["input4", "input5"],
  4: ["input6", "input7"],
};

const sectionAudioMap = {
  1: [canItSwimAudio, noItAudio, cantAudio],

  2: [canAudio, sheFlyKiteAudio, yesAudio, sheCanAudio],

  3: [canHeSailBoatAudio, noHeCantAudio],

  4: [canHeRideBikeAudio, noHeCantAudio],
};

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  text,

  locked,
  isUsed,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,

  playingKey,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${text}`,

    disabled: locked || isUsed,
  });

  const isPicked = keyboardPickedWord === text;

  const audioKey = `bank-${text}`;

  const isPlaying = playingKey === audioKey;

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[text] = el;
      }}
      {...(!locked && !isUsed
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={locked || isUsed ? -1 : 0}
      aria-disabled={locked || isUsed}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${text} selected. Press Tab to choose an answer blank.`
          : `${text}. Press Enter or Space to hear and select this phrase.`
      }
      onClick={() => {
        playAudio(audioKey, wordAudio[text]);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          playAudio(audioKey, wordAudio[text]);

          if (!locked && !isUsed) {
            onKeyboardPick(text);
          }
        }
      }}
      style={{
        padding: "2px 24px 2px 5px",

        border: `2px solid ${isUsed ? "#aaa" : "#2c5287"}`,

        borderRadius: "8px",

        background: isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        color: isUsed ? "#999" : "inherit",

        cursor: locked || isUsed ? "default" : "grab",

        opacity: isDragging ? 0.3 : 1,

        touchAction: "none",

        userSelect: "none",

        transition: "all 0.2s",

        position: "relative",
      }}
    >
      {text}

      {isPlaying && (
        <FaVolumeUp
          size={14}
          aria-hidden="true"
          className="audio-icon-wb-unit6-p4-q2"
        />
      )}
    </div>
  );
};

/* =====================================================
   DROPPABLE INPUT
===================================================== */

const DroppableInput = ({
  inputId,

  answers,
  wrongWords,

  locked,

  showAnswerMode,
  checkCompleted,

  keyboardPickedWord,

  focusedDropId,
  setFocusedDropId,

  dropRefs,
  getAvailableDropIds,

  onKeyboardDrop,
  onKeyboardRemove,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const droppableId = `drop-${inputId}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,

    disabled: locked || showAnswerMode || checkCompleted,
  });

  const value = answers.find((answer) => answer.num === inputId)?.input || "";

  /* =================================================
     KEYBOARD DRAG ACTIVE
  ================================================= */

  const keyboardActive =
    !!keyboardPickedWord && !locked && !showAnswerMode && !checkCompleted;

  /* =================================================
     FILLED SLOT EDITABLE

     حتى قبل Check.
  ================================================= */

  const canEditFilled =
    !!value &&
    !keyboardPickedWord &&
    !locked &&
    !showAnswerMode &&
    !checkCompleted;

  /* =================================================
     PREVIEW
  ================================================= */

  const showPreview = keyboardActive && focusedDropId === droppableId;

  const displayedValue = showPreview ? keyboardPickedWord : value;

  /* =================================================
     KEYBOARD
  ================================================= */

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT -> RETURN TO BANK
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardRemove(inputId, value);

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
       DROP / REPLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(inputId);

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
      ref={(el) => {
        setNodeRef(el);

        dropRefs.current[droppableId] = el;
      }}
      role="button"
      tabIndex={
        locked || showAnswerMode || checkCompleted
          ? -1
          : keyboardActive || canEditFilled
            ? 0
            : -1
      }
      aria-label={
        keyboardActive
          ? value
            ? `This blank currently contains ${value}. Press Enter or Space to replace it with ${keyboardPickedWord}.`
            : `Empty answer blank. Press Enter or Space to place ${keyboardPickedWord}.`
          : canEditFilled
            ? `This blank contains ${value}. Press Enter or Space to return it to the word bank.`
            : "Answer blank."
      }
      className={`answer-input-wb-unit6-p4-q2 ${
        isOver ? "drag-over-cell" : ""
      } ${showPreview ? "keyboard-drop-preview-wb-unit6-p4-q2" : ""}`}
      onFocus={() => {
        if (keyboardActive) {
          setFocusedDropId(droppableId);
        }
      }}
      onBlur={() => {
        setFocusedDropId(null);
      }}
      onKeyDown={handleKeyDown}
      onClick={() =>
        !locked &&
        !showAnswerMode &&
        !checkCompleted &&
        value &&
        onRemove(inputId)
      }
      style={{
        background: isOver ? "#e3f2fd" : "",

        cursor:
          !locked && !showAnswerMode && !checkCompleted && value
            ? "pointer"
            : "default",

        transition: "background 0.15s ease",

        position: "relative",
      }}
      title={
        !locked && !showAnswerMode && !checkCompleted && value
          ? "Click to remove"
          : ""
      }
    >
      {displayedValue}

      {wrongWords.includes(inputId) && (
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

const WB_Unit6_Page4_Q2 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState([]);

  /* =================================================
     WRONG INPUTS
  ================================================= */

  const [wrongWords, setWrongWords] = useState([]);

  /* =================================================
     PROGRESSIVE LOCKING
  ================================================= */

  const [lockedInputs, setLockedInputs] = useState([]);

  /* =================================================
     FINAL STATES
  ================================================= */

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const [activeWord, setActiveWord] = useState(null);

  /* =================================================
     KEYBOARD DRAG
  ================================================= */

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedDropId, setFocusedDropId] = useState(null);

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const sequenceIdRef = useRef(0);

  /* =================================================
     STOP AUDIO
  ================================================= */

  const stopAudio = () => {
    sequenceIdRef.current += 1;

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  /* =================================================
     SINGLE AUDIO
  ================================================= */

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

  /* =================================================
     FULL AUDIO SEQUENCE
  ================================================= */

  const playAudioSequence = (key, sources) => {
    const validSources = sources.filter(Boolean);

    if (!validSources.length) {
      return;
    }

    stopAudio();

    const currentSequenceId = sequenceIdRef.current;

    setPlayingKey(key);

    let currentIndex = 0;

    const playNext = () => {
      if (currentSequenceId !== sequenceIdRef.current) {
        return;
      }

      if (currentIndex >= validSources.length) {
        audioRef.current = null;

        setPlayingKey(null);

        return;
      }

      const audio = new Audio(validSources[currentIndex]);

      audioRef.current = audio;

      audio.play().catch(() => {
        if (currentSequenceId === sequenceIdRef.current) {
          audioRef.current = null;

          setPlayingKey(null);
        }
      });

      audio.onended = () => {
        if (currentSequenceId !== sequenceIdRef.current) {
          return;
        }

        currentIndex += 1;

        playNext();
      };

      audio.onerror = () => {
        if (currentSequenceId !== sequenceIdRef.current) {
          return;
        }

        audioRef.current = null;

        setPlayingKey(null);
      };
    };

    playNext();
  };

  /* =================================================
     SENSOR
  ================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  /* =================================================
     HELPERS
  ================================================= */

  const isInputLocked = (inputId) => lockedInputs.includes(inputId);

  /* =================================================
     USED WORD COUNT

     "No, he can't" مطلوب مرتين،
     لذلك ما يتعطل إلا بعد استخدامه مرتين.
  ================================================= */

  const usedWords = answers.map((answer) => answer.input);

  const isWordUsed = (text) => {
    const requiredCount = correctMatches.filter(
      (item) => item.input === text,
    ).length;

    const usedCount = usedWords.filter((word) => word === text).length;

    return usedCount >= requiredCount;
  };

  /* =================================================
     SECTION COMPLETE
  ================================================= */

  const isSectionComplete = (sectionId) =>
    sectionInputMap[sectionId].every((inputId) => isInputLocked(inputId));

  /* =================================================
     AVAILABLE DROP IDS
  ================================================= */

  const getAvailableDropIds = () =>
    correctMatches
      .filter((item) => !isInputLocked(item.num))
      .map((item) => `drop-${item.num}`);

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (inputId, text) => {
    if (showAnswerMode || checkCompleted || isInputLocked(inputId)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const existingIndex = updated.findIndex(
        (answer) => answer.num === inputId,
      );

      if (existingIndex !== -1) {
        updated[existingIndex] = {
          input: text,
          num: inputId,
        };
      } else {
        updated.push({
          input: text,
          num: inputId,
        });
      }

      return updated;
    });

    /*
      امسح X فقط عن الخانة المعدلة.
    */

    setWrongWords((prev) => prev.filter((id) => id !== inputId));
  };

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const handleDragStart = (event) => {
    setActiveWord(String(event.active.id).replace("word-", ""));
  };

  const handleDragEnd = (event) => {
    setActiveWord(null);

    if (showAnswerMode || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !String(over.id).startsWith("drop-")) {
      return;
    }

    const text = String(active.id).replace("word-", "");

    const inputId = String(over.id).replace("drop-", "");

    placeWord(inputId, text);
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (text) => {
    if (showAnswerMode || checkCompleted || isWordUsed(text)) {
      return;
    }

    setKeyboardPickedWord(text);

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

  const handleKeyboardDrop = (inputId) => {
    if (
      !keyboardPickedWord ||
      showAnswerMode ||
      checkCompleted ||
      isInputLocked(inputId)
    ) {
      return;
    }

    const word = keyboardPickedWord;

    placeWord(inputId, word);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      bankRefs.current[word]?.focus();
    }, 0);
  };

  /* =================================================
     FILLED SLOT -> BANK
  ================================================= */

  const handleKeyboardRemove = (inputId, word) => {
    if (showAnswerMode || checkCompleted || isInputLocked(inputId)) {
      return;
    }

    setAnswers((prev) => prev.filter((answer) => answer.num !== inputId));

    setWrongWords((prev) => prev.filter((id) => id !== inputId));

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    window.setTimeout(() => {
      bankRefs.current[word]?.focus();
    }, 0);
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const cancelKeyboardPick = () => {
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

  const handleRemove = (inputId) => {
    if (showAnswerMode || checkCompleted || isInputLocked(inputId)) {
      return;
    }

    setAnswers((prev) => prev.filter((answer) => answer.num !== inputId));

    setWrongWords((prev) => prev.filter((id) => id !== inputId));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    /* =============================================
       ALL UNLOCKED INPUTS MUST BE FILLED
    ============================================= */

    const incomplete = correctMatches.some((correct) => {
      if (isInputLocked(correct.num)) {
        return false;
      }

      return !answers.some((answer) => answer.num === correct.num);
    });

    if (incomplete) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    correctMatches.forEach((correct) => {
      /*
          locked سابقًا = صح.
        */

      if (isInputLocked(correct.num)) {
        correctCount++;

        return;
      }

      const userAnswer = answers.find((answer) => answer.num === correct.num);

      const isCorrect =
        userAnswer &&
        userAnswer.input.toLowerCase() === correct.input.toLowerCase();

      if (isCorrect) {
        correctCount++;

        newlyLocked.push(correct.num);
      } else {
        wrong.push(correct.num);
      }
    });

    /* =============================================
       LOCK ONLY CORRECT
    ============================================= */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /* =============================================
       WRONG STAYS EDITABLE
    ============================================= */

    setWrongWords(wrong);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);

    /* =============================================
       SCORE
    ============================================= */

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        margin-top:10px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedInputs(correctMatches.map((item) => item.num));

      setWrongWords([]);

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

  const showAnswers = () => {
    stopAudio();

    setAnswers(
      correctMatches.map((item) => ({
        input: item.input,
        num: item.num,
      })),
    );

    setWrongWords([]);

    setLockedInputs(correctMatches.map((item) => item.num));

    setShowAnswerMode(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers([]);

    setWrongWords([]);

    setLockedInputs([]);

    setShowAnswerMode(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedDropId(null);
  };

  /* =================================================
     SHARED DROP PROPS
  ================================================= */

  const dropProps = {
    answers,

    wrongWords,

    showAnswerMode,

    checkCompleted,

    keyboardPickedWord,

    focusedDropId,

    setFocusedDropId,

    dropRefs,

    getAvailableDropIds,

    onKeyboardDrop: handleKeyboardDrop,

    onKeyboardRemove: handleKeyboardRemove,

    onCancelKeyboardPick: cancelKeyboardPick,

    onRemove: handleRemove,
  };

  /* =================================================
     SECTION AUDIO PROPS
  ================================================= */

  const getSectionProps = (sectionId) => {
    const completed = isSectionComplete(sectionId);

    const audioKey = `section-${sectionId}`;

    return {
      completed,
      audioKey,

      playing: playingKey === audioKey,

      role: completed ? "button" : undefined,

      tabIndex: completed ? 0 : undefined,

      "aria-label": completed
        ? `Play complete correct audio for question ${sectionId}`
        : undefined,

      onClick: completed
        ? () => playAudioSequence(audioKey, sectionAudioMap[sectionId])
        : undefined,

      onKeyDown: completed
        ? (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              e.stopPropagation();

              playAudioSequence(audioKey, sectionAudioMap[sectionId]);
            }
          }
        : undefined,
    };
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

            marginBottom: "50px",
          }}
        >
          <ExerciseHeader
            sectionLetter="H"
            title="Look and write."
            subTitle="Read each picture and drag the missing question or answer into place."
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

              width: "100%",

              alignItems: "center",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {wordBank.map((text) => (
              <DraggableWord
                key={text}
                text={text}
                locked={showAnswerMode || checkCompleted}
                isUsed={isWordUsed(text)}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
                playingKey={playingKey}
                playAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="content-container-wb-unit6-p4-q2 w-full">
            {/* =================================================
                SECTION 1
            ================================================= */}

            {(() => {
              const section = getSectionProps(1);

              return (
                <div
                  className={`section-one-wb-unit6-p4-q2 ${
                    section.completed ? "completed-section-wb-unit6-p4-q2" : ""
                  }`}
                  role={section.role}
                  tabIndex={section.tabIndex}
                  aria-label={section["aria-label"]}
                  onClick={section.onClick}
                  onKeyDown={section.onKeyDown}
                >
                  <div className="img-container-wb-unit6-p4-q2">
                    <span
                      style={{
                        color: "#2c5287",

                        fontWeight: "700",

                        fontSize: "20px",
                      }}
                    >
                      1
                    </span>

                    <img
                      src={img1}
                      alt="A cat swimming in a pool."
                      className="img-wb-unit6-p4-q2"
                    />
                  </div>

                  <div className="content-input-unit5-p6-q1">
                    <input
                      type="text"
                      value="Can it swim ?"
                      readOnly
                      style={{
                        pointerEvents: "none",

                        borderBottom: "2px solid black",

                        width: "100%",

                        fontSize: "20px",
                      }}
                    />

                    <div
                      style={{
                        position: "relative",

                        display: "flex",
                      }}
                    >
                      <input
                        type="text"
                        value="No, it"
                        readOnly
                        style={{
                          pointerEvents: "none",

                          borderBottom: "2px solid black",

                          width: "15%",

                          fontSize: "20px",
                        }}
                      />

                      <div
                        style={{
                          position: "relative",

                          display: "flex",

                          alignItems: "flex-end",

                          width: "100%",
                        }}
                      >
                        <DroppableInput
                          inputId="input1"
                          locked={isInputLocked("input1")}
                          {...dropProps}
                        />
                      </div>
                    </div>
                  </div>

                  {section.completed && section.playing && (
                    <FaVolumeUp
                      size={15}
                      aria-hidden="true"
                      className="full-audio-icon-wb-unit6-p4-q2"
                    />
                  )}
                </div>
              );
            })()}

            {/* =================================================
                SECTION 2
            ================================================= */}

            {(() => {
              const section = getSectionProps(2);

              return (
                <div
                  className={`section-two-wb-unit6-p4-q2 ${
                    section.completed ? "completed-section-wb-unit6-p4-q2" : ""
                  }`}
                  role={section.role}
                  tabIndex={section.tabIndex}
                  aria-label={section["aria-label"]}
                  onClick={section.onClick}
                  onKeyDown={section.onKeyDown}
                >
                  <div className="img-container-wb-unit6-p4-q2">
                    <span
                      style={{
                        color: "#2c5287",

                        fontWeight: "700",

                        fontSize: "20px",
                      }}
                    >
                      2
                    </span>

                    <img
                      src={img2}
                      alt="A girl flying a kite outdoors."
                      className="img-wb-unit6-p4-q2"
                    />
                  </div>

                  <div className="content-input-unit5-p6-q1">
                    <div
                      style={{
                        position: "relative",

                        display: "flex",
                      }}
                    >
                      <input
                        type="text"
                        value="Can"
                        readOnly
                        style={{
                          pointerEvents: "none",

                          borderBottom: "2px solid black",

                          width: "10%",

                          fontSize: "20px",
                        }}
                      />

                      <div
                        style={{
                          position: "relative",

                          display: "flex",

                          alignItems: "flex-end",

                          width: "100%",
                        }}
                      >
                        <DroppableInput
                          inputId="input2"
                          locked={isInputLocked("input2")}
                          {...dropProps}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        position: "relative",

                        display: "flex",
                      }}
                    >
                      <input
                        type="text"
                        value="Yes,"
                        readOnly
                        style={{
                          pointerEvents: "none",

                          borderBottom: "2px solid black",

                          width: "10%",

                          fontSize: "20px",
                        }}
                      />

                      <div
                        style={{
                          position: "relative",

                          display: "flex",

                          alignItems: "flex-end",

                          width: "100%",
                        }}
                      >
                        <DroppableInput
                          inputId="input3"
                          locked={isInputLocked("input3")}
                          {...dropProps}
                        />
                      </div>
                    </div>
                  </div>

                  {section.completed && section.playing && (
                    <FaVolumeUp
                      size={15}
                      aria-hidden="true"
                      className="full-audio-icon-wb-unit6-p4-q2"
                    />
                  )}
                </div>
              );
            })()}

            {/* =================================================
                SECTION 3
            ================================================= */}

            {(() => {
              const section = getSectionProps(3);

              return (
                <div
                  className={`section-three-wb-unit6-p4-q2 ${
                    section.completed ? "completed-section-wb-unit6-p4-q2" : ""
                  }`}
                  role={section.role}
                  tabIndex={section.tabIndex}
                  aria-label={section["aria-label"]}
                  onClick={section.onClick}
                  onKeyDown={section.onKeyDown}
                >
                  <div className="img-container-wb-unit6-p4-q2">
                    <span
                      style={{
                        color: "#2c5287",

                        fontWeight: "700",

                        fontSize: "20px",
                      }}
                    >
                      3
                    </span>

                    <img
                      src={img3}
                      alt="A boy sailing a boat on the water."
                      className="img-wb-unit6-p4-q2"
                    />
                  </div>

                  <div className="content-input-unit5-p6-q1">
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <DroppableInput
                        inputId="input4"
                        locked={isInputLocked("input4")}
                        {...dropProps}
                      />

                      <div
                        style={{
                          position: "relative",

                          display: "flex",

                          alignItems: "flex-end",

                          width: "100%",
                        }}
                      >
                        <DroppableInput
                          inputId="input5"
                          locked={isInputLocked("input5")}
                          {...dropProps}
                        />
                      </div>
                    </div>
                  </div>

                  {section.completed && section.playing && (
                    <FaVolumeUp
                      size={15}
                      aria-hidden="true"
                      className="full-audio-icon-wb-unit6-p4-q2"
                    />
                  )}
                </div>
              );
            })()}

            {/* =================================================
                SECTION 4
            ================================================= */}

            {(() => {
              const section = getSectionProps(4);

              return (
                <div
                  className={`section-four-wb-unit6-p4-q2 ${
                    section.completed ? "completed-section-wb-unit6-p4-q2" : ""
                  }`}
                  role={section.role}
                  tabIndex={section.tabIndex}
                  aria-label={section["aria-label"]}
                  onClick={section.onClick}
                  onKeyDown={section.onKeyDown}
                >
                  <div className="img-container-wb-unit6-p4-q2">
                    <span
                      style={{
                        color: "#2c5287",

                        fontWeight: "700",

                        fontSize: "20px",
                      }}
                    >
                      4
                    </span>

                    <img
                      src={img4}
                      alt="A boy riding a bicycle outdoors."
                      className="img-wb-unit6-p4-q2"
                    />
                  </div>

                  <div className="content-input-unit5-p6-q1">
                    <div
                      style={{
                        position: "relative",

                        display: "flex",

                        alignItems: "flex-end",

                        width: "100%",
                      }}
                    >
                      <DroppableInput
                        inputId="input6"
                        locked={isInputLocked("input6")}
                        {...dropProps}
                      />
                    </div>

                    <div
                      style={{
                        position: "relative",

                        display: "flex",

                        alignItems: "flex-end",

                        width: "100%",
                      }}
                    >
                      <DroppableInput
                        inputId="input7"
                        locked={isInputLocked("input7")}
                        {...dropProps}
                      />
                    </div>
                  </div>

                  {section.completed && section.playing && (
                    <FaVolumeUp
                      size={15}
                      aria-hidden="true"
                      className="full-audio-icon-wb-unit6-p4-q2"
                    />
                  )}
                </div>
              );
            })()}
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              className="show-answer-btn swal-continue"
              onClick={showAnswers}
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord && (
          <div
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
            {activeWord}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit6_Page4_Q2;
