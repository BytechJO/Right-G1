import React, { useEffect, useRef, useState } from "react";

import "./Unit6_Page5_Q4.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

import sentenceAudio from "../../../assets/unit6/sounds/Page 50 - C/can you ride a bike.mp3";

/* =====================================================
   DATA
===================================================== */

const data = [
  { letter: "a", number: 1 },
  { letter: "b", number: 2 },
  { letter: "c", number: 3 },
  { letter: "d", number: 4 },
  { letter: "e", number: 5 },
  { letter: "f", number: 6 },
  { letter: "g", number: 7 },
  { letter: "h", number: 8 },
  { letter: "i", number: 9 },
  { letter: "j", number: 10 },
  { letter: "k", number: 11 },
  { letter: "l", number: 12 },
  { letter: "m", number: 13 },
  { letter: "n", number: 14 },
  { letter: "o", number: 15 },
  { letter: "p", number: 16 },
  { letter: "q", number: 17 },
  { letter: "r", number: 18 },
  { letter: "s", number: 19 },
  { letter: "t", number: 20 },
  { letter: "u", number: 21 },
  { letter: "v", number: 22 },
  { letter: "w", number: 23 },
  { letter: "x", number: 24 },
  { letter: "y", number: 25 },
  { letter: "z", number: 26 },
];

const questionGroups = [
  [3, 1, 14], // can
  [25, 15, 21], // you
  [18, 9, 4, 5], // ride
  [1], // a
  [2, 9, 11, 5], // bike
];

/* =====================================================
   CORRECT LETTERS
===================================================== */

const correctSlots = questionGroups.map((group) =>
  group.map((num) => data.find((item) => item.number === num)?.letter),
);

/* =====================================================
   COMPONENT
===================================================== */

const Unit6_Page5_Q4 = () => {
  /* =================================================
     STATE
  ================================================= */

  const [slots, setSlots] = useState(
    questionGroups.map((group) => group.map(() => null)),
  );

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const [keyboardLetter, setKeyboardLetter] = useState(null);

  const [focusedSlot, setFocusedSlot] = useState(null);

  const letterRefs = useRef({});

  const slotRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingSentence, setPlayingSentence] = useState(false);

  const [autoPlayedComplete, setAutoPlayedComplete] = useState(false);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingSentence(false);
  };

  const playSentenceAudio = () => {
    stopAudio();

    const audio = new Audio(sentenceAudio);

    audioRef.current = audio;

    setPlayingSentence(true);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingSentence(false);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingSentence(false);
    };
  };

  /* =================================================
     FORMED SENTENCE
  ================================================= */

  const formedWords = slots.map((group) =>
    group.map((letter) => letter || "").join(""),
  );

  const sentence = formedWords.join(" ");

  /* =================================================
     HELPERS
  ================================================= */

  const getSlotId = (groupIndex, letterIndex) => `${groupIndex}-${letterIndex}`;

  const isSlotLocked = (groupIndex, letterIndex) =>
    lockedSlots.includes(getSlotId(groupIndex, letterIndex));

  const getAvailableSlots = () => {
    const result = [];

    questionGroups.forEach((group, groupIndex) => {
      group.forEach((_, letterIndex) => {
        if (!isSlotLocked(groupIndex, letterIndex)) {
          result.push(getSlotId(groupIndex, letterIndex));
        }
      });
    });

    return result;
  };

  const isAllCorrect = () =>
    slots.every((group, groupIndex) =>
      group.every(
        (letter, letterIndex) =>
          letter === correctSlots[groupIndex][letterIndex],
      ),
    );

  /* =================================================
     AUTO PLAY WHEN COMPLETE CORRECT
  ================================================= */

  useEffect(() => {
    const complete = slots.every((group) => group.every(Boolean));

    if (complete && isAllCorrect() && !autoPlayedComplete) {
      setAutoPlayedComplete(true);

      playSentenceAudio();
    }

    if (!isAllCorrect()) {
      setAutoPlayedComplete(false);
    }
  }, [slots]);

  /* =================================================
     PLACE LETTER
  ================================================= */

  const placeLetter = (groupIndex, letterIndex, letter) => {
    if (showAnswer || checkCompleted || isSlotLocked(groupIndex, letterIndex)) {
      return;
    }

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[groupIndex][letterIndex] = letter;

      return updated;
    });

    /*
      Clear wrong only same slot
    */

    setWrongInputs((prev) =>
      prev.filter((id) => id !== getSlotId(groupIndex, letterIndex)),
    );
  };

  /* =================================================
     REMOVE WRONG SLOT
  ================================================= */

  const clearSlot = (groupIndex, letterIndex) => {
    if (showAnswer || checkCompleted || isSlotLocked(groupIndex, letterIndex)) {
      return;
    }

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[groupIndex][letterIndex] = null;

      return updated;
    });

    setWrongInputs((prev) =>
      prev.filter((id) => id !== getSlotId(groupIndex, letterIndex)),
    );
  };

  /* =================================================
     DRAG
  ================================================= */

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || showAnswer || checkCompleted) {
      return;
    }

    if (!destination.droppableId.startsWith("slot-")) {
      return;
    }

    const [groupIndex, letterIndex] = destination.droppableId
      .split("-")
      .slice(1)
      .map(Number);

    if (isSlotLocked(groupIndex, letterIndex)) {
      return;
    }

    const letter = draggableId.replace("letter-", "");

    placeLetter(groupIndex, letterIndex, letter);
  };

  /* =================================================
     KEYBOARD PICK LETTER
  ================================================= */

  const handleLetterKeyboard = (e, letter) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (showAnswer || checkCompleted) {
      return;
    }

    if (keyboardLetter === letter) {
      setKeyboardLetter(null);

      return;
    }

    setKeyboardLetter(letter);

    setFocusedSlot(null);

    window.setTimeout(() => {
      const available = getAvailableSlots();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     SLOT KEYBOARD
  ================================================= */

  const handleSlotKeyboard = (e, groupIndex, letterIndex) => {
    const slotId = getSlotId(groupIndex, letterIndex);

    const value = slots[groupIndex][letterIndex];

    const isWrong = wrongInputs.includes(slotId);

    /* =========================================
       WRONG SLOT → RETURN TO BANK
    ========================================= */

    if (
      isWrong &&
      value &&
      !keyboardLetter &&
      (e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      e.stopPropagation();

      const oldLetter = value;

      clearSlot(groupIndex, letterIndex);

      window.setTimeout(() => {
        letterRefs.current[oldLetter]?.focus();
      }, 0);

      return;
    }

    if (!keyboardLetter) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlots();

      const currentIndex = available.indexOf(slotId);

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

      slotRefs.current[nextId]?.focus();

      return;
    }

    /* =========================================
       PLACE / REPLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      const letter = keyboardLetter;

      placeLetter(groupIndex, letterIndex, letter);

      setKeyboardLetter(null);

      setFocusedSlot(null);

      window.setTimeout(() => {
        letterRefs.current[letter]?.focus();
      }, 0);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const letter = keyboardLetter;

      setKeyboardLetter(null);

      setFocusedSlot(null);

      window.setTimeout(() => {
        letterRefs.current[letter]?.focus();
      }, 0);
    }
  };

  /* =================================================
     CHECK
  ================================================= */

  const handleCheckAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const hasEmpty = slots.some((group) => group.some((letter) => !letter));

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all fields before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const correct = [];

    for (let groupIndex = 0; groupIndex < slots.length; groupIndex++) {
      for (
        let letterIndex = 0;
        letterIndex < slots[groupIndex].length;
        letterIndex++
      ) {
        const id = getSlotId(groupIndex, letterIndex);

        const correctLetter = correctSlots[groupIndex][letterIndex];

        if (slots[groupIndex][letterIndex] === correctLetter) {
          correctCount++;

          correct.push(id);
        } else {
          wrong.push(id);
        }
      }
    }

    /*
        Correct only locks
      */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...correct])));

    /*
        Wrong remain editable
      */

    setWrongInputs(wrong);

    setKeyboardLetter(null);

    setFocusedSlot(null);

    const total = slots.flat().length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (correctCount === total) {
      setLockedSlots(
        questionGroups.flatMap((group, groupIndex) =>
          group.map((_, letterIndex) => getSlotId(groupIndex, letterIndex)),
        ),
      );

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

  const handleShowAnswer = () => {
    setSlots(correctSlots.map((group) => [...group]));

    setWrongInputs([]);

    setLockedSlots(
      questionGroups.flatMap((group, groupIndex) =>
        group.map((_, letterIndex) => getSlotId(groupIndex, letterIndex)),
      ),
    );

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardLetter(null);

    setFocusedSlot(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setSlots(questionGroups.map((group) => group.map(() => null)));

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setKeyboardLetter(null);

    setFocusedSlot(null);

    setAutoPlayedComplete(false);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <div
      style={{
        display: "flex",

        justifyContent: "center",

        padding: "30px",
      }}
    >
      <div className="div-forall">
        <div className="container8">
          <ExerciseHeader
            sectionLetter="C"
            title="Answer the question."
            subTitle="Match each number to its letter, then build the hidden sentence."
          />

          <div className="alphabet-box">
            <DragDropContext onDragEnd={onDragEnd}>
              {/* =================================================
                  LETTER BANK
              ================================================= */}

              <Droppable
                droppableId="alphabet"
                direction="horizontal"
                isDropDisabled
              >
                {(provided) => (
                  <div
                    className="row1-unit3-q4"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {data.map((item, index) => (
                      <div className="letter-char1" key={item.letter}>
                        <Draggable
                          draggableId={`letter-${item.letter}`}
                          index={index}
                          isDragDisabled={showAnswer || checkCompleted}
                        >
                          {(provided) => (
                            <div
                              ref={(el) => {
                                provided.innerRef(el);

                                letterRefs.current[item.letter] = el;
                              }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              role="button"
                              tabIndex={showAnswer || checkCompleted ? -1 : 0}
                              aria-pressed={keyboardLetter === item.letter}
                              aria-label={`Letter ${item.letter}, number ${item.number}. Press Enter or Space to select this letter.`}
                              onKeyDown={(e) =>
                                handleLetterKeyboard(e, item.letter)
                              }
                              className={`cell1 drag-letter ${
                                keyboardLetter === item.letter
                                  ? "keyboard-letter-selected"
                                  : ""
                              }`}
                            >
                              {item.letter}
                            </div>
                          )}
                        </Draggable>

                        <div className="cell1 number1">{item.number}</div>
                      </div>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* =================================================
                  ANSWER SLOTS
              ================================================= */}

              <div className="words">
                {questionGroups.map((group, groupIndex) => (
                  <div className="word-group-unit3-p5-q4" key={groupIndex}>
                    {group.map((num, letterIndex) => {
                      const slotId = getSlotId(groupIndex, letterIndex);

                      const locked = isSlotLocked(groupIndex, letterIndex);

                      const wrong = wrongInputs.includes(slotId);

                      const keyboardActive =
                        !!keyboardLetter &&
                        !locked &&
                        !showAnswer &&
                        !checkCompleted;

                      const canFixWrong =
                        !!slots[groupIndex][letterIndex] &&
                        wrong &&
                        !keyboardLetter &&
                        !locked &&
                        !showAnswer &&
                        !checkCompleted;

                      const preview = keyboardActive && focusedSlot === slotId;

                      const displayedLetter = preview
                        ? keyboardLetter
                        : slots[groupIndex][letterIndex];

                      return (
                        <Droppable
                          key={slotId}
                          droppableId={`slot-${groupIndex}-${letterIndex}`}
                          isDropDisabled={
                            locked || showAnswer || checkCompleted
                          }
                        >
                          {(provided, snapshot) => (
                            <div className="slot-wrapper">
                              <h6 className="slot-number">{num}</h6>

                              <div
                                ref={(el) => {
                                  provided.innerRef(el);

                                  slotRefs.current[slotId] = el;
                                }}
                                {...provided.droppableProps}
                                role="button"
                                tabIndex={
                                  locked || showAnswer || checkCompleted
                                    ? -1
                                    : keyboardActive || canFixWrong
                                      ? 0
                                      : -1
                                }
                                aria-label={
                                  keyboardActive
                                    ? `Slot for number ${num}. Press Enter or Space to place letter ${keyboardLetter}.`
                                    : canFixWrong
                                      ? `${displayedLetter} is incorrect. Press Enter or Space to return it to the letter bank.`
                                      : `Slot for number ${num}.`
                                }
                                onFocus={() => {
                                  if (keyboardActive) {
                                    setFocusedSlot(slotId);
                                  }
                                }}
                                onBlur={() => setFocusedSlot(null)}
                                onKeyDown={(e) =>
                                  handleSlotKeyboard(e, groupIndex, letterIndex)
                                }
                                className={`drop-slot
                                      ${
                                        snapshot.isDraggingOver
                                          ? "drag-over"
                                          : ""
                                      }
                                      ${wrong ? "wrong" : ""}
                                      ${preview ? "keyboard-slot-preview" : ""}
                                    `}
                              >
                                {wrong && (
                                  <div
                                    className="error-mark1"
                                    aria-hidden="true"
                                  >
                                    ✕
                                  </div>
                                )}

                                {displayedLetter && (
                                  <div className="dropped-letter">
                                    {displayedLetter}
                                  </div>
                                )}

                                {provided.placeholder}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      );
                    })}
                  </div>
                ))}

                {/* QUESTION MARK FIXED */}

                <div className="text-[40px] text-center font-semibold mt-5">
                  ?
                </div>
              </div>

              {/* =================================================
                  COMPLETE SENTENCE
              ================================================= */}

              <div className="sentence-box">
                <span
                  className="sentence-text"
                  role={isAllCorrect() ? "button" : undefined}
                  tabIndex={isAllCorrect() ? 0 : -1}
                  aria-label={
                    isAllCorrect()
                      ? "Can you ride a bike? Play sentence audio."
                      : undefined
                  }
                  onClick={() => {
                    if (isAllCorrect()) {
                      playSentenceAudio();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      isAllCorrect() &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();

                      playSentenceAudio();
                    }
                  }}
                  style={{
                    position: "relative",

                    cursor: isAllCorrect() ? "pointer" : "default",
                  }}
                >
                  {sentence}

                  {playingSentence && (
                    <FaVolumeUp
                      size={18}
                      aria-hidden="true"
                      className="audio-icon-unit6-p5-q4"
                    />
                  )}
                </span>

                <div className="text-[40px] text-center font-semibold">?</div>
              </div>
            </DragDropContext>
          </div>
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
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={handleCheckAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page5_Q4;
