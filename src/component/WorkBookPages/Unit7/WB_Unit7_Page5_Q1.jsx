import "./WB_Unit7_Page5_Q1.css";

import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U7/U7P43EXEI-01.svg";
import img2 from "../../../assets/U1 WB/U7/U7P43EXEI-02.svg";
import img3 from "../../../assets/U1 WB/U7/U7P43EXEI-03.svg";
import img4 from "../../../assets/U1 WB/U7/U7P43EXEI-04.svg";
import img5 from "../../../assets/U1 WB/U7/U7P43EXEI-05.svg";

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

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIO
===================================================== */

import sentence1Audio from "../../../assets/U1 WB/U7/audio/page 43- I/Item_001-are-you-happy-yes.mp3";
import sentence2Audio from "../../../assets/U1 WB/U7/audio/page 43- I/Item_002-whats-the-matter-im-bored.mp3";
import sentence3Audio from "../../../assets/U1 WB/U7/audio/page 43- I/Item_003_Are_you_sad_No,_I'm_not._I'm_hungry.mp3";
import sentence4Audio from "../../../assets/U1 WB/U7/audio/page 43- I/Item_004_What's_the_matter_I'm_cold.mp3";
import sentence5Audio from "../../../assets/U1 WB/U7/audio/page 43- I/Item_005_Are_you_scared.mp3";

/* =====================================================
   DATA
===================================================== */

const NUMBER_BANK = ["1", "2", "3", "4", "5"];

const CORRECT_DATA = ["2", "5", "3", "4", "1"];

const SENTENCES = [
  {
    number: "1",
    text: "Are you happy? Yes, I am.",
    audio: sentence1Audio,
  },
  {
    number: "2",
    text: "What's the matter? I'm bored.",
    audio: sentence2Audio,
  },
  {
    number: "3",
    text: "Are you sad? No, I'm not. I'm hungry.",
    audio: sentence3Audio,
  },
  {
    number: "4",
    text: "What's the matter? I'm cold",
    audio: sentence4Audio,
  },
  {
    number: "5",
    text: "Are you scared? Yes, I am.",
    audio: sentence5Audio,
  },
];

const IMAGE_DATA = [
  {
    src: img1,

    alt: "A tired boy sitting on a bench outdoors.",

    correctNumber: "2",
  },

  {
    src: img2,

    alt: "A frightened girl kneeling on the grass and looking at a spider.",

    correctNumber: "5",
  },

  {
    src: img3,

    alt: "A girl thinking about food and looking hungry.",

    correctNumber: "3",
  },

  {
    src: img4,

    alt: "A boy shivering and holding his arms because he feels cold.",

    correctNumber: "4",
  },

  {
    src: img5,

    alt: "A smiling boy reaching toward a colorful ball.",

    correctNumber: "1",
  },
];

/* =====================================================
   NUMBER CHIP
===================================================== */

const NumberChip = ({
  num,

  isUsed,
  disabled,

  keyboardPickedNum,
  onKeyboardPick,

  registerRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `num-${num}`,

    data: {
      num,
    },

    disabled: isUsed || disabled,
  });

  const unavailable = isUsed || disabled;

  const isKeyboardPicked = keyboardPickedNum === num;

  const setRefs = (node) => {
    setNodeRef(node);

    registerRef(num, node);
  };

  const handleKeyDown = (e) => {
    if (unavailable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardPick(num);
    }
  };

  return (
    <div
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
      aria-pressed={isKeyboardPicked}
      aria-label={
        isKeyboardPicked
          ? `Number ${num} selected. Choose a picture answer box and press Enter or Space.`
          : `Number ${num}. Press Enter or Space to select.`
      }
      onKeyDown={handleKeyDown}
      style={{
        width: 30,

        height: 30,

        border: "2px solid #2c5287",

        borderRadius: 8,

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontWeight: "bold",

        background: "white",

        cursor: unavailable ? "not-allowed" : isDragging ? "grabbing" : "grab",

        opacity: isUsed ? 0.35 : isDragging ? 0.5 : 1,

        userSelect: "none",

        touchAction: "none",

        transition: "opacity .2s",

        outline: isKeyboardPicked ? "3px solid #2563eb" : undefined,

        outlineOffset: isKeyboardPicked ? "3px" : undefined,
      }}
    >
      {num}
    </div>
  );
};

/* =====================================================
   DROP BOX
===================================================== */

const DropBox = ({
  index,

  value,

  isWrong,
  isLocked,

  keyboardPickedNum,
  keyboardFocusIndex,

  onKeyboardPlace,
  onKeyboardCancel,
  onMoveKeyboardFocus,

  onFocusSlot,

  onReturn,

  registerRef,

  forceTabIndex,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${index}`,

    disabled: isLocked,
  });

  const isKeyboardTarget =
    Boolean(keyboardPickedNum) && keyboardFocusIndex === index && !isLocked;

  const setRefs = (node) => {
    setNodeRef(node);

    registerRef(index, node);
  };

  const handleKeyDown = (e) => {
    if (isLocked) return;

    /* =============================================
       TAB / SHIFT + TAB
    ============================================== */

    if (keyboardPickedNum && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      onMoveKeyboardFocus(index, e.shiftKey);

      return;
    }

    /* =============================================
       ENTER / SPACE
    ============================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      if (keyboardPickedNum) {
        onKeyboardPlace(index);

        return;
      }

      if (value) {
        onReturn(index);
      }

      return;
    }

    /* =============================================
       ESCAPE
    ============================================== */

    if (keyboardPickedNum && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();
    }
  };

  return (
    <div
      ref={setRefs}
      role="button"
      tabIndex={
        forceTabIndex !== undefined
          ? forceTabIndex
          : isLocked
            ? -1
            : keyboardPickedNum
              ? 0
              : value
                ? 0
                : -1
      }
      aria-disabled={isLocked}
      aria-label={
        isKeyboardTarget
          ? `Picture ${index + 1} answer box. Press Enter or Space to place number ${keyboardPickedNum}. Press Tab or Shift plus Tab to move between answer boxes.`
          : value
            ? `Picture ${index + 1}. Current number ${value}. Press Enter or Space to return it to the number bank.`
            : `Picture ${index + 1}. Empty answer box. Select a number first.`
      }
      onFocus={() => {
        if (keyboardPickedNum && !isLocked) {
          onFocusSlot(index);
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (isLocked) return;

        e.stopPropagation();

        if (value && !keyboardPickedNum) {
          onReturn(index);
        }
      }}
      className={`
        wb-unit7-p5-q1-input

        ${isOver ? "wb-unit7-p5-q1-drop-over" : ""}

        ${isKeyboardTarget ? "wb-unit7-p5-q1-keyboard-target" : ""}
      `}
      style={{
        cursor: value && !isLocked ? "pointer" : "default",
      }}
    >
      {/* NORMAL VALUE */}

      {value && !isKeyboardTarget && <span>{value}</span>}

      {/* KEYBOARD PREVIEW */}

      {isKeyboardTarget && keyboardPickedNum && (
        <span className="wb-unit7-p5-q1-number-preview">
          {keyboardPickedNum}
        </span>
      )}

      {/* WRONG */}

      {isWrong && !isLocked && (
        <span className="unit3-q3-wrong" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit7_Page5_Q1 = () => {
  const [answers, setAnswers] = useState(Array(5).fill(null));

  /*
    null | correct | wrong
  */

  const [results, setResults] = useState(Array(5).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [allCompleted, setAllCompleted] = useState(false);

  /* =====================================================
     DRAG
  ===================================================== */

  const [activeNum, setActiveNum] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [keyboardPickedNum, setKeyboardPickedNum] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  const numberRefs = useRef({});

  const dropRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingImageIndex, setPlayingImageIndex] = useState(null);
  const [playingSentenceNumber, setPlayingSentenceNumber] = useState(null);
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
     HELPERS
  ===================================================== */

  const usedNums = new Set(answers.filter(Boolean));

  const isPictureLocked = (index) =>
    showAnswerMode || results[index] === "correct";

  const editableIndexes = () =>
    IMAGE_DATA.map((_, index) => index).filter(
      (index) => !isPictureLocked(index),
    );

  const isPictureCorrect = (index) =>
    answers[index] === IMAGE_DATA[index].correctNumber;

  const getSentenceByNumber = (number) =>
    SENTENCES.find((item) => item.number === number);

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

    setPlayingImageIndex(null);
    setPlayingSentenceNumber(null);
  };
  /* =====================================================
   SENTENCE AUDIO
===================================================== */

  const playSentenceAudio = (sentence) => {
    if (!sentence?.audio) return;

    stopAudio();

    const audio = new Audio(sentence.audio);

    audioRef.current = audio;

    setPlayingSentenceNumber(sentence.number);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingSentenceNumber(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingSentenceNumber(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingSentenceNumber(null);
    };
  };
  const playPictureAudio = (index) => {
    /*
      الصوت فقط إذا الصورة صح.
    */

    if (!isPictureCorrect(index)) {
      return;
    }

    const number = IMAGE_DATA[index].correctNumber;

    const sentence = getSentenceByNumber(number);

    if (!sentence?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(sentence.audio);

    audioRef.current = audio;

    setPlayingImageIndex(index);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingImageIndex(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingImageIndex(null);
    };

    audio.onerror = audio.onended;
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

  const registerNumberRef = (num, node) => {
    if (node) {
      numberRefs.current[num] = node;
    }
  };

  const registerDropRef = (index, node) => {
    if (node) {
      dropRefs.current[index] = node;
    }
  };

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const handleKeyboardPick = (num) => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    setKeyboardPickedNum(num);

    const available = editableIndexes();

    if (!available.length) {
      return;
    }

    const firstIndex = available[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      dropRefs.current[firstIndex]?.focus();
    });
  };

  /* =====================================================
     TAB / SHIFT + TAB
  ===================================================== */

  const moveKeyboardFocus = (currentIndex, backwards = false) => {
    const available = editableIndexes();

    if (!available.length) {
      return;
    }

    const position = available.indexOf(currentIndex);

    let nextPosition;

    if (backwards) {
      nextPosition = position <= 0 ? available.length - 1 : position - 1;
    } else {
      nextPosition =
        position === -1 || position === available.length - 1 ? 0 : position + 1;
    }

    const nextIndex = available[nextPosition];

    setKeyboardFocusIndex(nextIndex);

    requestAnimationFrame(() => {
      dropRefs.current[nextIndex]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const placeKeyboardNumber = (index) => {
    if (
      !keyboardPickedNum ||
      isPictureLocked(index) ||
      showAnswerMode ||
      allCompleted
    ) {
      return;
    }

    const picked = keyboardPickedNum;

    let nextAnswers = null;

    setAnswers((prev) => {
      const copy = [...prev];

      const oldIndex = copy.findIndex((value) => value === picked);

      if (oldIndex !== -1 && oldIndex !== index && !isPictureLocked(oldIndex)) {
        copy[oldIndex] = null;
      }

      copy[index] = picked;

      nextAnswers = copy;

      return copy;
    });

    /*
      تعديل نفس الصورة:
      شيل X عنها فقط.
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });

    setKeyboardPickedNum(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      if (!nextAnswers) {
        return;
      }

      const usedAfter = new Set(nextAnswers.filter(Boolean));

      const nextNum = NUMBER_BANK.find((num) => !usedAfter.has(num));

      if (nextNum) {
        numberRefs.current[nextNum]?.focus();
      }
    });
  };

  /* =====================================================
     CANCEL PICK
  ===================================================== */

  const cancelKeyboardPick = () => {
    if (!keyboardPickedNum) {
      return;
    }

    const picked = keyboardPickedNum;

    setKeyboardPickedNum(null);

    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      numberRefs.current[picked]?.focus();
    });
  };

  /* =====================================================
     RETURN TO BANK
  ===================================================== */

  const handleReturn = (index) => {
    if (showAnswerMode || isPictureLocked(index)) {
      return;
    }

    const num = answers[index];

    if (!num) return;

    setAnswers((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    setResults((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    requestAnimationFrame(() => {
      numberRefs.current[num]?.focus();
    });
  };

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    setActiveNum(String(active.id).replace("num-", ""));
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveNum(null);

    if (!over || showAnswerMode || allCompleted) {
      return;
    }

    const destId = String(over.id);

    if (!destId.startsWith("drop-")) {
      return;
    }

    const index = Number(destId.replace("drop-", ""));

    if (isPictureLocked(index)) {
      return;
    }

    const value = String(active.id).replace("num-", "");

    setAnswers((prev) => {
      const copy = [...prev];

      const oldIndex = copy.findIndex((v) => v === value);

      if (oldIndex !== -1 && oldIndex !== index && !isPictureLocked(oldIndex)) {
        copy[oldIndex] = null;
      }

      copy[index] = value;

      return copy;
    });

    setResults((prev) => {
      const updated = [...prev];

      if (updated[index] === "wrong") {
        updated[index] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || allCompleted) {
      return;
    }

    const hasEmpty = IMAGE_DATA.some(
      (_, index) => results[index] !== "correct" && !answers[index],
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill all answer boxes before checking!");

      return;
    }

    const nextResults = [...results];

    let correctCount = 0;

    IMAGE_DATA.forEach((item, index) => {
      if (results[index] === "correct") {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (answers[index] === item.correctNumber) {
        nextResults[index] = "correct";

        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    const total = IMAGE_DATA.length;

    const completed = correctCount === total;

    if (completed) {
      setAllCompleted(true);
    }

    const color = completed ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
        <div style="font-size:20px;text-align:center;margin-top:8px">
          <span style="color:${color};font-weight:bold">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (completed) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers([...CORRECT_DATA]);

    setResults(IMAGE_DATA.map(() => "correct"));

    setShowAnswerMode(true);

    setAllCompleted(true);

    setKeyboardPickedNum(null);

    setKeyboardFocusIndex(null);

    setActiveNum(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAnswers = () => {
    stopAudio();

    setAnswers(Array(5).fill(null));

    setResults(Array(5).fill(null));

    setShowAnswerMode(false);

    setAllCompleted(false);

    setActiveNum(null);

    setKeyboardPickedNum(null);

    setKeyboardFocusIndex(null);
  };

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
        className="unit3-q3-wrapper"
        style={{
          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          padding: 30,
        }}
      >
        <div
          className="div-forall"
          style={{
            gap: 5,
          }}
        >
          <ExerciseHeader
            sectionLetter="I"
            title="Read and number the pictures."
            subTitle="Read each sentence pair, then drag its number to the matching picture."
          />

          <div
            className="word-container-wb-unit7-p5-q1 w-full"
            style={{
              display: "flex",

              padding: 5,

              border: "2px dashed #ccc",

              borderRadius: 10,

              justifyContent: "center",

              flexDirection: "column",
            }}
          >
            {/* =================================================
                NUMBER BANK
            ================================================= */}

            <div
              style={{
                display: "flex",

                gap: 10,

                padding: 10,

                border: "2px dashed #ccc",

                borderRadius: 10,

                justifyContent: "center",
              }}
            >
              {NUMBER_BANK.map((num) => (
                <NumberChip
                  key={num}
                  num={num}
                  isUsed={usedNums.has(num)}
                  disabled={showAnswerMode || allCompleted}
                  keyboardPickedNum={keyboardPickedNum}
                  onKeyboardPick={handleKeyboardPick}
                  registerRef={registerNumberRef}
                />
              ))}
            </div>

            {/* =================================================
                SENTENCES
            ================================================= */}

            {/* =================================================
    SENTENCES WITH AUDIO
================================================= */}

            {SENTENCES.map((sentence, index) => {
              const isPlayingSentence =
                playingSentenceNumber === sentence.number;

              return (
                <div
                  key={sentence.number}
                  className="sentence-container-wb-unit7-p5-q1"
                >
                  <span className="num">{index + 1}</span>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio: ${sentence.text}`}
                    className="sentence-audio-wb-unit7-p5-q1"
                    onClick={() => playSentenceAudio(sentence)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        playSentenceAudio(sentence);
                      }
                    }}
                  >
                    <p>{sentence.text}</p>

                    {isPlayingSentence && (
                      <FaVolumeUp
                        aria-hidden="true"
                        className="sentence-audio-icon-wb-unit7-p5-q1"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              IMAGES + DROPS
          ================================================= */}

          <div className="wb-unit7-p5-q1-grid w-full">
            {IMAGE_DATA.map((item, index) => {
              const correct = results[index] === "correct";

              const wrong = results[index] === "wrong";

              const playing = playingImageIndex === index;

              return (
                <div
                  key={index}
                  className={`
                      wb-unit7-p5-q1-box

                      ${correct ? "wb-unit7-p5-q1-correct-audio-box" : ""}
                    `}
                  role={correct ? "button" : undefined}
                  tabIndex={correct ? 0 : undefined}
                  aria-label={
                    correct
                      ? `Play audio for the correct sentence: ${
                          getSentenceByNumber(item.correctNumber)?.text
                        }`
                      : undefined
                  }
                  onClick={() => {
                    if (correct) {
                      playPictureAudio(index);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!correct) {
                      return;
                    }

                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      playPictureAudio(index);
                    }
                  }}
                  style={{
                    position: "relative",
                  }}
                >
                  <img
                    src={item.src}
                    className="unit3-q3-image"
                    alt={item.alt}
                  />

                  <div className="wb-unit7-p5-q1-input-wrapper">
                    <DropBox
                      index={index}
                      value={answers[index]}
                      isWrong={wrong}
                      isLocked={correct || showAnswerMode}
                      keyboardPickedNum={keyboardPickedNum}
                      keyboardFocusIndex={keyboardFocusIndex}
                      onKeyboardPlace={placeKeyboardNumber}
                      onKeyboardCancel={cancelKeyboardPick}
                      onMoveKeyboardFocus={moveKeyboardFocus}
                      onFocusSlot={setKeyboardFocusIndex}
                      onReturn={handleReturn}
                      registerRef={registerDropRef}
                      forceTabIndex={correct ? -1 : undefined}
                    />
                  </div>

                  {/* =========================================
                        AUDIO ICON
                    ========================================== */}

                  {correct && playing && (
                    <FaVolumeUp
                      aria-hidden="true"
                      className="wb-unit7-p5-q1-full-audio-icon"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
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
        {activeNum && (
          <div
            style={{
              width: 30,

              height: 30,

              border: "2px solid #2c5287",

              borderRadius: 8,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontWeight: "bold",

              background: "white",

              boxShadow: "0 4px 12px rgba(0,0,0,.2)",

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

export default WB_Unit7_Page5_Q1;
