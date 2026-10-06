import React, { useEffect, useRef, useState } from "react";

import "./Unit5_Page5_Q4.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import img from "../../../assets/unit5/imgs/U5P44EXEC.svg";

import whatsThisAudio from "../../../assets/unit5/sounds/Page 44/whats this.mp3";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   DATA
===================================================== */

const alphabetData = [
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
   WHAT IS THIS?
===================================================== */

const questionGroups = [
  [23, 8, 1, 20], // what
  [9, 19], // is
  [20, 8, 9, 19], // this
];

/* =====================================================
   HELPERS
===================================================== */

const createEmptySlots = () =>
  questionGroups.map((group) => group.map(() => null));

const getCorrectLetter = (groupIndex, letterIndex) => {
  const number = questionGroups[groupIndex][letterIndex];

  return alphabetData.find((item) => item.number === number)?.letter;
};

/* =====================================================
   COMPONENT
===================================================== */

const Unit5_Page5_Q4 = () => {
  /* =================================================
     ANSWERS
  ================================================= */
  const autoPlayedRef = useRef(false);
  const [slots, setSlots] = useState(createEmptySlots);

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     KEYBOARD PUZZLE
  ================================================= */

  const [pickedLetter, setPickedLetter] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [isSentencePlaying, setIsSentencePlaying] = useState(false);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setIsSentencePlaying(false);
  };

  const playSentenceAudio = () => {
    stopAudio();

    const audio = new Audio(whatsThisAudio);

    audioRef.current = audio;

    setIsSentencePlaying(true);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsSentencePlaying(false);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsSentencePlaying(false);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsSentencePlaying(false);
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
     SLOT HELPERS
  ================================================= */

  const slotId = (gIndex, lIndex) => `slot-${gIndex}-${lIndex}`;

  const wrongId = (gIndex, lIndex) => `${gIndex}-${lIndex}`;

  const isSlotLocked = (gIndex, lIndex) =>
    lockedSlots.includes(slotId(gIndex, lIndex));

  const getAvailableSlotIds = () => {
    const ids = [];

    questionGroups.forEach((group, gIndex) => {
      group.forEach((_, lIndex) => {
        if (!isSlotLocked(gIndex, lIndex)) {
          ids.push(slotId(gIndex, lIndex));
        }
      });
    });

    return ids;
  };

  /* =================================================
     PLACE LETTER
  ================================================= */

  const placeLetter = (gIndex, lIndex, letter) => {
    if (showAnswer || checkCompleted || isSlotLocked(gIndex, lIndex)) {
      return;
    }

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[gIndex][lIndex] = letter;

      return updated;
    });

    /* X فقط نفس الخانة */

    setWrongInputs((prev) =>
      prev.filter((id) => id !== wrongId(gIndex, lIndex)),
    );
  };

  /* =================================================
     MOUSE DRAG
  ================================================= */
  useEffect(() => {
    const correctSentence = "what is this";

    const isCorrect = sentence.toLowerCase() === correctSentence;

    if (isCorrect && !showAnswer && !checkCompleted && !autoPlayedRef.current) {
      autoPlayedRef.current = true;

      playSentenceAudio();
    }

    if (!isCorrect) {
      autoPlayedRef.current = false;
    }
  }, [sentence, showAnswer, checkCompleted]);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || showAnswer || checkCompleted) {
      return;
    }

    if (!destination.droppableId.startsWith("slot-")) {
      return;
    }

    const [, gString, lString] = destination.droppableId.split("-");

    const gIndex = Number(gString);
    const lIndex = Number(lString);

    if (isSlotLocked(gIndex, lIndex)) {
      return;
    }

    const letter = draggableId.replace("letter-", "");

    placeLetter(gIndex, lIndex, letter);
  };

  /* =================================================
     KEYBOARD PICK LETTER
  ================================================= */

  const handleKeyboardPick = (letter) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setPickedLetter(letter);

    setFocusedSlotId(null);

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (gIndex, lIndex) => {
    if (
      !pickedLetter ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(gIndex, lIndex)
    ) {
      return;
    }

    const letter = pickedLetter;

    placeLetter(gIndex, lIndex, letter);

    setPickedLetter(null);

    setFocusedSlotId(null);

    /*
      بعد الحط:
      رجع على نفس الحرف بالبنك
      عشان يقدر يستخدمه مرة ثانية.
    */

    window.setTimeout(() => {
      bankRefs.current[letter]?.focus();
    }, 0);
  };

  /* =================================================
     WRONG SLOT AFTER CHECK
  ================================================= */

  const handleWrongSlotKeyboard = (gIndex, lIndex) => {
    if (showAnswer || checkCompleted || isSlotLocked(gIndex, lIndex)) {
      return;
    }

    const currentLetter = slots[gIndex][lIndex];

    if (!currentLetter) return;

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[gIndex][lIndex] = null;

      return updated;
    });

    /*
      شيل X فقط من هاي الخانة
    */

    setWrongInputs((prev) =>
      prev.filter((id) => id !== wrongId(gIndex, lIndex)),
    );

    setPickedLetter(null);

    setFocusedSlotId(null);

    /*
      رجعه لنفس الحرف بالبنك
    */

    window.setTimeout(() => {
      bankRefs.current[currentLetter]?.focus();
    }, 0);
  };

  /* =================================================
     CANCEL KEYBOARD PICK
  ================================================= */

  const cancelKeyboardPick = () => {
    const letter = pickedLetter;

    setPickedLetter(null);

    setFocusedSlotId(null);

    window.setTimeout(() => {
      if (letter) {
        bankRefs.current[letter]?.focus();
      }
    }, 0);
  };

  /* =================================================
     SLOT KEYBOARD
  ================================================= */

  const handleSlotKeyDown = (e, gIndex, lIndex) => {
    const currentSlotId = slotId(gIndex, lIndex);

    const isWrong = wrongInputs.includes(wrongId(gIndex, lIndex));

    const value = slots[gIndex][lIndex];

    /*
      =========================================
      WRONG SLOT AFTER CHECK
      Enter => clear + return focus to bank
      =========================================
    */

    if (
      !pickedLetter &&
      value &&
      isWrong &&
      (e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      e.stopPropagation();

      handleWrongSlotKeyboard(gIndex, lIndex);

      return;
    }

    if (!pickedLetter) {
      return;
    }

    /*
      =========================================
      TAB / SHIFT TAB BETWEEN SLOTS
      =========================================
    */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(currentSlotId);

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

    /*
      =========================================
      PLACE
      =========================================
    */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      handleKeyboardDrop(gIndex, lIndex);

      return;
    }

    /*
      =========================================
      CANCEL
      =========================================
    */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      cancelKeyboardPick();
    }
  };

  /* =================================================
     REMOVE WITH MOUSE
  ================================================= */

  const removeSlotLetter = (gIndex, lIndex) => {
    if (showAnswer || checkCompleted || isSlotLocked(gIndex, lIndex)) {
      return;
    }

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[gIndex][lIndex] = null;

      return updated;
    });

    setWrongInputs((prev) =>
      prev.filter((id) => id !== wrongId(gIndex, lIndex)),
    );
  };

  /* =================================================
     CHECK ANSWER
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

    const wrong = [];

    const newlyLocked = [];

    let correctCount = 0;

    let total = 0;

    slots.forEach((group, gIndex) => {
      group.forEach((letter, lIndex) => {
        total++;

        const correctLetter = getCorrectLetter(gIndex, lIndex);

        if (letter === correctLetter) {
          correctCount++;

          newlyLocked.push(slotId(gIndex, lIndex));
        } else {
          wrong.push(wrongId(gIndex, lIndex));
        }
      });
    });

    /*
      Progressive locking:
      الصح فقط يقفل
    */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setWrongInputs(wrong);

    setPickedLetter(null);

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
      const allSlotIds = [];

      questionGroups.forEach((group, gIndex) => {
        group.forEach((_, lIndex) => {
          allSlotIds.push(slotId(gIndex, lIndex));
        });
      });

      setLockedSlots(allSlotIds);

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
    stopAudio();

    const correct = questionGroups.map((group) =>
      group.map(
        (number) => alphabetData.find((item) => item.number === number)?.letter,
      ),
    );

    setSlots(correct);

    setWrongInputs([]);

    const allSlotIds = [];

    questionGroups.forEach((group, gIndex) => {
      group.forEach((_, lIndex) => {
        allSlotIds.push(slotId(gIndex, lIndex));
      });
    });

    setLockedSlots(allSlotIds);

    setShowAnswer(true);

    setCheckCompleted(true);

    setPickedLetter(null);

    setFocusedSlotId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setSlots(createEmptySlots());

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setPickedLetter(null);

    setFocusedSlotId(null);
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
                    {alphabetData.map((item, index) => {
                      const isPicked = pickedLetter === item.letter;

                      return (
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

                                  bankRefs.current[item.letter] = el;
                                }}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                role="button"
                                tabIndex={showAnswer || checkCompleted ? -1 : 0}
                                aria-pressed={isPicked}
                                aria-label={
                                  isPicked
                                    ? `Letter ${item.letter} selected. Press Tab to move through the answer boxes.`
                                    : `Letter ${item.letter}, number ${item.number}. Press Enter or Space to select it.`
                                }
                                onKeyDown={(e) => {
                                  if (showAnswer || checkCompleted) {
                                    return;
                                  }

                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    handleKeyboardPick(item.letter);
                                  }
                                }}
                                className={`cell1 drag-letter ${
                                  isPicked
                                    ? "keyboard-picked-letter-unit5-p5-q4"
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
                      const currentSlotId = slotId(gIndex, lIndex);

                      const value = slots[gIndex][lIndex];

                      const wrong = wrongInputs.includes(
                        wrongId(gIndex, lIndex),
                      );

                      const locked = isSlotLocked(gIndex, lIndex);

                      const keyboardActive =
                        !!pickedLetter &&
                        !locked &&
                        !showAnswer &&
                        !checkCompleted;

                      const canFixWrong =
                        !!value &&
                        wrong &&
                        !pickedLetter &&
                        !locked &&
                        !showAnswer &&
                        !checkCompleted;

                      const showPreview =
                        keyboardActive && focusedSlotId === currentSlotId;

                      return (
                        <Droppable
                          key={currentSlotId}
                          droppableId={currentSlotId}
                          isDropDisabled={
                            showAnswer || checkCompleted || locked
                          }
                        >
                          {(provided, snapshot) => (
                            <div className="slot-wrapper">
                              {/* الرقم */}

                              <h6 className="slot-number">{num}</h6>

                              {/* الخانة */}

                              <div
                                ref={(el) => {
                                  provided.innerRef(el);

                                  slotRefs.current[currentSlotId] = el;
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
                                    ? `Number ${num}. Press Enter or Space to place letter ${pickedLetter}.`
                                    : canFixWrong
                                      ? `Letter ${value} is incorrect for number ${num}. Press Enter or Space to remove it and return to the letter bank.`
                                      : value
                                        ? `Number ${num}, letter ${value}.`
                                        : `Empty answer for number ${num}.`
                                }
                                onFocus={() => {
                                  if (keyboardActive) {
                                    setFocusedSlotId(currentSlotId);
                                  }
                                }}
                                onBlur={() => {
                                  setFocusedSlotId(null);
                                }}
                                onKeyDown={(e) =>
                                  handleSlotKeyDown(e, gIndex, lIndex)
                                }
                                onClick={() => {
                                  if (
                                    value &&
                                    !locked &&
                                    !showAnswer &&
                                    !checkCompleted
                                  ) {
                                    removeSlotLetter(gIndex, lIndex);
                                  }
                                }}
                                className={`drop-slot
                                      ${
                                        snapshot.isDraggingOver
                                          ? "drag-over"
                                          : ""
                                      }
                                      ${wrong ? "wrong" : ""}
                                      ${
                                        showPreview
                                          ? "keyboard-drop-preview-unit5-p5-q4"
                                          : ""
                                      }
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

                                {(showPreview ? pickedLetter : value) && (
                                  <div className="dropped-letter">
                                    {showPreview ? pickedLetter : value}
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
                  alt="A classroom illustration used as a clue for the question What is this?"
                  style={{
                    height: "100px",
                    width: "185px",
                  }}
                />
              </div>

              {/* =================================================
                  FINAL SENTENCE + FIXED QUESTION MARK
              ================================================= */}

              <div
                className="sentence-box sentence-audio-unit5-p5-q4"
                role="button"
                tabIndex={0}
                aria-label="Play audio for What is this?"
                onClick={playSentenceAudio}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();

                    playSentenceAudio();
                  }
                }}
                style={{
                  position: "relative",

                  cursor: "pointer",

                  userSelect: "none",
                }}
              >
                <span className="sentence-text">{sentence}</span>

                {/* ثابتة دائمًا */}

                <span className="sentence-question-mark-unit5-p5-q4">?</span>

                {isSentencePlaying && (
                  <FaVolumeUp
                    size={17}
                    aria-hidden="true"
                    className="sentence-audio-icon-unit5-p5-q4"
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

export default Unit5_Page5_Q4;
