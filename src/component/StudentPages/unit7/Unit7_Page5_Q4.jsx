import React, { useEffect, useRef, useState } from "react";

import "./Unit7_Page5_Q4.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import img from "../../../assets/unit7/img/U7P63EXEC.svg";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import areYouHappyAudio from "../../../assets/unit7/sound/Page 62 - C/are you happy.mp3";

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

/* =====================================================
   QUESTION

   1 18 5       = are
   25 15 21     = you
   8 1 16 16 25 = happy
===================================================== */

const questionGroups = [
  [1, 18, 5],
  [25, 15, 21],
  [8, 1, 16, 16, 25],
];

/* =====================================================
   CORRECT LETTERS
===================================================== */

const correctGroups = questionGroups.map((group) =>
  group.map((num) => data.find((item) => item.number === num)?.letter || ""),
);

/* =====================================================
   COMPONENT
===================================================== */

const Unit7_Page5_Q4 = () => {
  /* =====================================================
     SLOTS
  ===================================================== */

  const [slots, setSlots] = useState(
    questionGroups.map((group) => group.map(() => null)),
  );

  /* =====================================================
     AUTO PLAY
  ===================================================== */

  const [autoPlayedComplete, setAutoPlayedComplete] = useState(false);

  /* =====================================================
     PROGRESSIVE LOCK
  ===================================================== */

  const [lockedSlots, setLockedSlots] = useState([]);

  /* =====================================================
     WRONG
  ===================================================== */

  const [wrongInputs, setWrongInputs] = useState([]);

  /* =====================================================
     FINAL STATES
  ===================================================== */

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     KEYBOARD PICK
  ===================================================== */

  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  const letterRefs = useRef({});

  const slotRefs = useRef({});

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  /* =====================================================
     STOP AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setIsPlaying(false);
  };

  /* =====================================================
     PLAY FULL SENTENCE AUDIO
  ===================================================== */

  const playSentenceAudio = () => {
    stopAudio();

    const audio = new Audio(areYouHappyAudio);

    audioRef.current = audio;

    setIsPlaying(true);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsPlaying(false);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsPlaying(false);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsPlaying(false);
    };
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const getSlotKey = (gIndex, lIndex) => `${gIndex}-${lIndex}`;

  const getSlotId = (gIndex, lIndex) => `slot-${gIndex}-${lIndex}`;

  const isSlotLocked = (gIndex, lIndex) =>
    lockedSlots.includes(getSlotKey(gIndex, lIndex));

  const isAllCorrect = () =>
    slots.every((group, gIndex) =>
      group.every((letter, lIndex) => letter === correctGroups[gIndex][lIndex]),
    );

  const allSlotsFilled = slots.every((group) => group.every(Boolean));

  const allSlotsCorrect = isAllCorrect();

  /* =====================================================
     AUTO PLAY WHEN CORRECT
  ===================================================== */

  useEffect(() => {
    if (allSlotsFilled && allSlotsCorrect && !autoPlayedComplete) {
      setAutoPlayedComplete(true);

      playSentenceAudio();
    }

    if (!allSlotsCorrect) {
      setAutoPlayedComplete(false);
    }
  }, [slots]);

  /* =====================================================
     FORMED SENTENCE
  ===================================================== */

  const formedWords = slots.map((group) =>
    group.map((letter) => letter || "").join(""),
  );

  const sentence = formedWords.join(" ");

  /* =====================================================
     AVAILABLE SLOTS
  ===================================================== */

  const getAvailableSlotIds = () => {
    const ids = [];

    questionGroups.forEach((group, gIndex) => {
      group.forEach((_, lIndex) => {
        if (!isSlotLocked(gIndex, lIndex)) {
          ids.push(getSlotId(gIndex, lIndex));
        }
      });
    });

    return ids;
  };

  /* =====================================================
     PLACE LETTER
  ===================================================== */

  const placeLetter = (gIndex, lIndex, letter) => {
    if (showAnswer || checkCompleted || isSlotLocked(gIndex, lIndex)) {
      return;
    }

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[gIndex][lIndex] = letter;

      return updated;
    });

    /* =============================================
       CLEAR X FOR SAME SLOT ONLY
    ============================================= */

    setWrongInputs((prev) =>
      prev.filter((key) => key !== getSlotKey(gIndex, lIndex)),
    );
  };

  /* =====================================================
     MOUSE DRAG
  ===================================================== */

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || showAnswer || checkCompleted) {
      return;
    }

    if (!destination.droppableId.startsWith("slot-")) {
      return;
    }

    const [, gRaw, lRaw] = destination.droppableId.split("-");

    const gIndex = Number(gRaw);

    const lIndex = Number(lRaw);

    if (isSlotLocked(gIndex, lIndex)) {
      return;
    }

    const letter = draggableId.replace("letter-", "");

    placeLetter(gIndex, lIndex, letter);
  };

  /* =====================================================
     KEYBOARD PICK LETTER
  ===================================================== */

  const handleKeyboardPick = (letter) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedLetter(letter);

    setFocusedSlotId(null);

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PLACE
  ===================================================== */

  const handleKeyboardPlace = (gIndex, lIndex) => {
    if (
      !keyboardPickedLetter ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(gIndex, lIndex)
    ) {
      return;
    }

    const letter = keyboardPickedLetter;

    placeLetter(gIndex, lIndex, letter);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      letterRefs.current[letter]?.focus();
    }, 0);
  };

  /* =====================================================
     REMOVE SLOT BY KEYBOARD
  ===================================================== */

  const handleKeyboardRemove = (gIndex, lIndex, currentLetter) => {
    if (
      !currentLetter ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(gIndex, lIndex)
    ) {
      return;
    }

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[gIndex][lIndex] = null;

      return updated;
    });

    setWrongInputs((prev) =>
      prev.filter((key) => key !== getSlotKey(gIndex, lIndex)),
    );

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      letterRefs.current[currentLetter]?.focus();
    }, 0);
  };

  /* =====================================================
     CANCEL KEYBOARD PICK
  ===================================================== */

  const cancelKeyboardPick = () => {
    const letter = keyboardPickedLetter;

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (letter) {
        letterRefs.current[letter]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     SLOT KEYBOARD
  ===================================================== */

  const handleSlotKeyDown = (e, gIndex, lIndex) => {
    const slotId = getSlotId(gIndex, lIndex);

    const currentLetter = slots[gIndex][lIndex];

    const locked = isSlotLocked(gIndex, lIndex);

    /* =============================================
       FILLED EDITABLE SLOT
    ============================================= */

    if (
      currentLetter &&
      !keyboardPickedLetter &&
      !locked &&
      !showAnswer &&
      !checkCompleted &&
      (e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();

      e.stopPropagation();

      handleKeyboardRemove(gIndex, lIndex, currentLetter);

      return;
    }

    if (!keyboardPickedLetter) {
      return;
    }

    /* =============================================
       TAB / SHIFT TAB
    ============================================= */

    if (e.key === "Tab") {
      e.preventDefault();

      e.stopPropagation();

      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

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

    /* =============================================
       PLACE / REPLACE
    ============================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      handleKeyboardPlace(gIndex, lIndex);

      return;
    }

    /* =============================================
       ESCAPE
    ============================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      cancelKeyboardPick();
    }
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

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

    const newlyLocked = [];

    const total = slots.flat().length;

    for (let gIndex = 0; gIndex < slots.length; gIndex++) {
      for (let lIndex = 0; lIndex < slots[gIndex].length; lIndex++) {
        const key = getSlotKey(gIndex, lIndex);

        if (lockedSlots.includes(key)) {
          correctCount++;

          continue;
        }

        const correctLetter = correctGroups[gIndex][lIndex];

        if (slots[gIndex][lIndex] === correctLetter) {
          correctCount++;

          newlyLocked.push(key);
        } else {
          wrong.push(key);
        }
      }
    }

    /* =============================================
       LOCK CORRECT ONLY
    ============================================= */

    const nextLocked = [...new Set([...lockedSlots, ...newlyLocked])];

    setLockedSlots(nextLocked);

    setWrongInputs(wrong);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

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
      const allKeys = [];

      questionGroups.forEach((group, gIndex) => {
        group.forEach((_, lIndex) => {
          allKeys.push(getSlotKey(gIndex, lIndex));
        });
      });

      setLockedSlots(allKeys);

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      /*
        ما بنشغل الصوت هون،
        لأنه already اشتغل تلقائي
        لما الجملة صارت صح.
      */

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setSlots(correctGroups.map((group) => [...group]));

    const allKeys = [];

    questionGroups.forEach((group, gIndex) => {
      group.forEach((_, lIndex) => {
        allKeys.push(getSlotKey(gIndex, lIndex));
      });
    });

    setLockedSlots(allKeys);

    setWrongInputs([]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    /*
      نخليه true حتى ما يعمل autoplay
      بسبب setSlots تبع Show Answer
    */

    setAutoPlayedComplete(true);
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const handleStartAgain = () => {
    stopAudio();

    setSlots(questionGroups.map((group) => group.map(() => null)));

    setLockedSlots([]);

    setWrongInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setKeyboardPickedLetter(null);

    setFocusedSlotId(null);

    setAutoPlayedComplete(false);
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div
      style={{
        display: "flex",

        justifyContent: "center",

        padding: "30px",
      }}
    >
      <div className="div-forall mb-10">
        <div className="container8">
          <ExerciseHeader
            sectionLetter="C"
            title="Answer the question."
            subTitle="Match each number to its letter, then build the hidden sentence."
          />

          <div className="alphabet-box">
            <DragDropContext onDragEnd={onDragEnd}>
              {/* =================================================
                  ALPHABET BANK
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
                    {data.map((item, index) => {
                      const picked = keyboardPickedLetter === item.letter;

                      return (
                        <div className="letter-char1" key={item.letter}>
                          <Draggable
                            draggableId={`letter-${item.letter}`}
                            index={index}
                            isDragDisabled={showAnswer || checkCompleted}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={(el) => {
                                  provided.innerRef(el);

                                  letterRefs.current[item.letter] = el;
                                }}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                role="button"
                                tabIndex={showAnswer || checkCompleted ? -1 : 0}
                                aria-pressed={picked}
                                aria-label={`Letter ${item.letter}, number ${item.number}. Press Enter or Space to select it.`}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();

                                    e.stopPropagation();

                                    handleKeyboardPick(item.letter);
                                  }
                                }}
                                className={`cell1 drag-letter ${
                                  picked
                                    ? "keyboard-picked-letter-unit7-p5-q4"
                                    : ""
                                } ${
                                  snapshot.isDragging
                                    ? "mouse-dragging-letter-unit7-p5-q4"
                                    : ""
                                }`}
                              >
                                {item.letter}
                              </div>
                            )}
                          </Draggable>

                          <div className="cell1 number1">{item.number}</div>
                        </div>
                      );
                    })}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* =================================================
                  ANSWER SLOTS
              ================================================= */}

              <div className="words">
                {questionGroups.map((group, gIndex) => (
                  <div className="word-group-unit3-p5-q4" key={gIndex}>
                    {group.map((num, lIndex) => {
                      const slotId = getSlotId(gIndex, lIndex);

                      const key = getSlotKey(gIndex, lIndex);

                      const locked = isSlotLocked(gIndex, lIndex);

                      const currentLetter = slots[gIndex][lIndex];

                      const keyboardActive =
                        !!keyboardPickedLetter &&
                        !locked &&
                        !showAnswer &&
                        !checkCompleted;

                      const canEditFilled =
                        !!currentLetter &&
                        !keyboardPickedLetter &&
                        !locked &&
                        !showAnswer &&
                        !checkCompleted;

                      const showKeyboardPreview =
                        keyboardActive && focusedSlotId === slotId;

                      return (
                        <Droppable
                          key={slotId}
                          droppableId={slotId}
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
                                    : keyboardActive || canEditFilled
                                      ? 0
                                      : -1
                                }
                                aria-label={
                                  keyboardActive
                                    ? `Answer slot. Press Enter or Space to place letter ${keyboardPickedLetter}.`
                                    : canEditFilled
                                      ? `Answer slot contains ${currentLetter}. Press Enter or Space to remove it.`
                                      : `Answer slot for number ${num}.`
                                }
                                onFocus={() => {
                                  if (keyboardActive) {
                                    setFocusedSlotId(slotId);
                                  }
                                }}
                                onBlur={() => {
                                  setFocusedSlotId(null);
                                }}
                                onKeyDown={(e) =>
                                  handleSlotKeyDown(e, gIndex, lIndex)
                                }
                                className={[
                                  "drop-slot",

                                  snapshot.isDraggingOver ? "drag-over" : "",

                                  wrongInputs.includes(key) ? "wrong" : "",

                                  locked ? "locked-slot-unit7-p5-q4" : "",

                                  showKeyboardPreview
                                    ? "keyboard-slot-preview-unit7-p5-q4"
                                    : "",
                                ]
                                  .join(" ")
                                  .trim()}
                              >
                                {wrongInputs.includes(key) && (
                                  <div
                                    className="error-mark1"
                                    aria-hidden="true"
                                  >
                                    ✕
                                  </div>
                                )}

                                {currentLetter && (
                                  <div className="dropped-letter">
                                    {currentLetter}
                                  </div>
                                )}

                                {showKeyboardPreview && (
                                  <div
                                    className="keyboard-preview-letter-unit7-p5-q4"
                                    aria-hidden="true"
                                  >
                                    {keyboardPickedLetter}
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

                {/* =================================================
                    IMAGE
                ================================================= */}

                <img
                  src={img}
                  alt="A young boy standing and looking worried."
                  style={{
                    height: "150px",

                    width: "185px",
                  }}
                />
              </div>

              {/* =================================================
                  SENTENCE + AUDIO
              ================================================= */}

              <div
                className={`sentence-box ${
                  allSlotsCorrect ? "completed-sentence-unit7-p5-q4" : ""
                }`}
                role={allSlotsCorrect ? "button" : undefined}
                tabIndex={allSlotsCorrect ? 0 : -1}
                aria-label={
                  allSlotsCorrect
                    ? "Are you happy? Press Enter or Space to hear the sentence."
                    : undefined
                }
                onClick={() => {
                  if (allSlotsCorrect) {
                    playSentenceAudio();
                  }
                }}
                onKeyDown={(e) => {
                  if (allSlotsCorrect && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();

                    playSentenceAudio();
                  }
                }}
              >
                <span className="sentence-text">{sentence}</span>

                {allSlotsCorrect && isPlaying && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="sentence-audio-icon-unit7-p5-q4"
                  />
                )}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={handleStartAgain} className="try-again-button">
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

export default Unit7_Page5_Q4;
