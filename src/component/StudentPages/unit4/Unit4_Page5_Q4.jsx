import React, { useRef, useState } from "react";
import "./Unit4_Page5_Q4.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import img from "../../../assets/unit4/imgs/U4P32EXEC.svg";

import sentenceAudio from "../../../assets/unit4/Page 32 - C/what shape is it.mp3";

import ExerciseHeader from "../../ExerciseHeader";

const Unit4_Page5_Q4 = () => {
  /* ======================================================
     REFS
  ====================================================== */

  const sentenceAudioRef = useRef(null);

  const bankRefs = useRef({});

  const slotRefs = useRef([]);

  /* ======================================================
     ACCESSIBILITY
  ====================================================== */

  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);

  const [keyboardMessage, setKeyboardMessage] = useState("");

  const [focusedLetter, setFocusedLetter] = useState(null);

  const [focusedSlot, setFocusedSlot] = useState(null);

  /* ======================================================
     DATA
  ====================================================== */

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

  /* ======================================================
     QUESTION
     WHAT SHAPE IS IT
  ====================================================== */

  const questionGroups = [
    [23, 8, 1, 20], // what
    [19, 8, 1, 16, 5], // shape
    [9, 19], // is
    [9, 20], // it
  ];

  /* ======================================================
     STATES
  ====================================================== */

  const createEmptySlots = () =>
    questionGroups.map((group) => group.map(() => null));

  const [slots, setSlots] = useState(createEmptySlots());

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* ======================================================
     GET CORRECT LETTER
  ====================================================== */

  const getCorrectLetter = (groupIndex, letterIndex) => {
    const number = questionGroups[groupIndex][letterIndex];

    return data.find((item) => item.number === number)?.letter;
  };

  /* ======================================================
     CHECK IF ALL CORRECT
  ====================================================== */

  const checkIfAllCorrect = (updatedSlots) => {
    for (let g = 0; g < updatedSlots.length; g++) {
      for (let l = 0; l < updatedSlots[g].length; l++) {
        const correctLetter = getCorrectLetter(g, l);

        if (!updatedSlots[g][l] || updatedSlots[g][l] !== correctLetter) {
          return false;
        }
      }
    }

    return true;
  };

  /* ======================================================
     SENTENCE
  ====================================================== */

  const formedWords = slots.map((group) =>
    group.map((letter) => letter || "").join(""),
  );

  const sentence = formedWords.join(" ");

  const correctSentence = "what shape is it";

  const isSentenceCorrect = sentence.trim().toLowerCase() === correctSentence;

  /* ======================================================
     AUDIO
  ====================================================== */

  const playSentenceAudio = () => {
    if (!sentenceAudio) {
      return;
    }

    const audio = sentenceAudioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();

    audio.currentTime = 0;

    audio.src = sentenceAudio;

    audio.play().catch(() => {});
  };

  /* ======================================================
     FLAT SLOT INDEX
  ====================================================== */

  const getFlatSlotIndex = (groupIndex, letterIndex) => {
    let index = 0;

    for (let g = 0; g < groupIndex; g++) {
      index += questionGroups[g].length;
    }

    return index + letterIndex;
  };

  /* ======================================================
     AVAILABLE SLOTS
  ====================================================== */

  const getAvailableSlotIndexes = () => {
    const result = [];

    questionGroups.forEach((group, gIndex) => {
      group.forEach((_, lIndex) => {
        const slotId = `${gIndex}-${lIndex}`;

        if (!lockedSlots.includes(slotId)) {
          result.push(getFlatSlotIndex(gIndex, lIndex));
        }
      });
    });

    return result;
  };

  /* ======================================================
     LOCK ALL
  ====================================================== */

  const lockAllSlots = () => {
    const all = [];

    questionGroups.forEach((group, gIndex) => {
      group.forEach((_, lIndex) => {
        all.push(`${gIndex}-${lIndex}`);
      });
    });

    setLockedSlots(all);
  };

  /* ======================================================
     KEYBOARD PICK
  ====================================================== */

  const handleKeyboardPick = (letter) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedLetter(letter);

    setKeyboardMessage(
      `Letter ${letter} selected. Choose a box and press Enter.`,
    );

    /*
      بعد اختيار الحرف
      روح لأول خانة غير مقفلة
    */

    setTimeout(() => {
      const available = getAvailableSlotIndexes();

      if (available.length > 0) {
        slotRefs.current[available[0]]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     KEYBOARD DROP
  ====================================================== */

  const handleKeyboardDrop = (gIndex, lIndex, flatIndex) => {
    if (!keyboardPickedLetter || showAnswer || checkCompleted) {
      return;
    }

    const slotId = `${gIndex}-${lIndex}`;

    if (lockedSlots.includes(slotId)) {
      return;
    }

    const placedLetter = keyboardPickedLetter;

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      /*
        REPLACE مباشرة
      */

      updated[gIndex][lIndex] = placedLetter;

      /*
        إذا صار الحل كله صح
        شغل صوت الجملة
      */

      const completedCorrectly = checkIfAllCorrect(updated);

      if (completedCorrectly) {
        setWrongInputs([]);

        setTimeout(() => {
          playSentenceAudio();
        }, 0);
      }

      return updated;
    });

    /*
      شيل X فقط
      من نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((id) => id !== slotId));

    setKeyboardMessage(`Letter ${placedLetter} placed. Choose another letter.`);

    setKeyboardPickedLetter(null);

    /*
      رجع لنفس الحرف
      بعد التثبيت
    */

    setTimeout(() => {
      bankRefs.current[placedLetter]?.focus();
    }, 0);
  };

  /* ======================================================
     DRAG END
  ====================================================== */

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || showAnswer || checkCompleted) {
      return;
    }

    if (!destination.droppableId.startsWith("slot-")) {
      return;
    }

    const [g, l] = destination.droppableId.split("-").slice(1).map(Number);

    const slotId = `${g}-${l}`;

    /*
      الصح المقفول ممنوع
      يتعدل
    */

    if (lockedSlots.includes(slotId)) {
      return;
    }

    const letter = draggableId.replace("letter-", "");

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[g][l] = letter;

      const completedCorrectly = checkIfAllCorrect(updated);

      if (completedCorrectly) {
        setWrongInputs([]);

        setTimeout(() => {
          playSentenceAudio();
        }, 0);
      }

      return updated;
    });

    /*
      شيل X فقط
      من نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((id) => id !== slotId));
  };

  /* ======================================================
     SHOW ANSWER
  ====================================================== */

  const handleShowAnswer = () => {
    const correct = questionGroups.map((group) =>
      group.map((num) => data.find((item) => item.number === num)?.letter),
    );

    setSlots(correct);

    setWrongInputs([]);

    lockAllSlots();

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedLetter(null);

    setKeyboardMessage("Correct answer is shown.");
  };

  /* ======================================================
     CHECK ANSWER
  ====================================================== */

  const handleCheckAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
        لازم كل الخانات
        تكون معبّاية
      */

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

    const total = slots.flat().length;

    for (let g = 0; g < slots.length; g++) {
      for (let l = 0; l < slots[g].length; l++) {
        const slotId = `${g}-${l}`;

        const correctLetter = getCorrectLetter(g, l);

        if (slots[g][l] === correctLetter) {
          correctCount++;

          newlyLocked.push(slotId);
        } else {
          wrong.push(slotId);
        }
      }
    }

    /*
        الصح فقط يتقفل
      */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
        الغلط فقط عليه X
      */

    setWrongInputs(wrong);

    setKeyboardPickedLetter(null);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    /* ==================================================
         ALL CORRECT
      ================================================== */

    if (correctCount === total) {
      lockAllSlots();

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

  /* ======================================================
     RESET
  ====================================================== */

  const handleReset = () => {
    setSlots(createEmptySlots());

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setKeyboardPickedLetter(null);

    setKeyboardMessage("");

    setFocusedLetter(null);

    setFocusedSlot(null);

    if (sentenceAudioRef.current) {
      sentenceAudioRef.current.pause();

      sentenceAudioRef.current.currentTime = 0;
    }
  };

  /* ======================================================
     JSX
  ====================================================== */

  return (
    <div
      style={{
        display: "flex",

        justifyContent: "center",

        padding: "30px",
      }}
    >
      <div className="div-forall mb-10">
        <ExerciseHeader
          sectionLetter="C"
          title="Answer the question."
          subTitle="Match each number to its letter, then build the hidden sentence."
        />

        {/* =================================================
            AUDIO
        ================================================= */}

        <audio
          ref={sentenceAudioRef}
          style={{
            display: "none",
          }}
        />

        {/* =================================================
            SCREEN READER STATUS
        ================================================= */}

        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {keyboardMessage}
        </div>

        <div className="alphabet-box">
          <DragDropContext onDragEnd={onDragEnd}>
            {/* =================================================
                ALPHABET
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

                              bankRefs.current[item.letter] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cell1 drag-letter"
                            role="button"
                            tabIndex={showAnswer || checkCompleted ? -1 : 0}
                            aria-pressed={keyboardPickedLetter === item.letter}
                            aria-disabled={showAnswer || checkCompleted}
                            aria-label={
                              keyboardPickedLetter === item.letter
                                ? `Letter ${item.letter} selected. Choose a box and press Enter.`
                                : `Letter ${item.letter}. Press Enter to select it.`
                            }
                            onFocus={() => setFocusedLetter(item.letter)}
                            onBlur={() => setFocusedLetter(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                e.stopPropagation();

                                handleKeyboardPick(item.letter);

                                return;
                              }

                              provided.dragHandleProps?.onKeyDown?.(e);
                            }}
                            onClick={(e) => {
                              /*
                                  click ناتج من
                                  keyboard فقط

                                  الماوس يظل للـdrag
                                */

                              if (e.detail === 0) {
                                e.preventDefault();

                                e.stopPropagation();

                                handleKeyboardPick(item.letter);
                              }
                            }}
                            style={{
                              transform:
                                keyboardPickedLetter === item.letter
                                  ? "scale(1.15)"
                                  : focusedLetter === item.letter
                                    ? "scale(1.06)"
                                    : "scale(1)",

                              outline:
                                keyboardPickedLetter === item.letter
                                  ? "3px solid #2563eb"
                                  : focusedLetter === item.letter
                                    ? "2px solid #2563eb"
                                    : "none",

                              outlineOffset: "3px",

                              background:
                                keyboardPickedLetter === item.letter
                                  ? "#dbeafe"
                                  : undefined,

                              boxShadow:
                                keyboardPickedLetter === item.letter
                                  ? "0 0 0 5px rgba(37,99,235,0.18), 0 6px 14px rgba(0,0,0,0.22)"
                                  : "none",

                              transition:
                                "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",

                              zIndex:
                                keyboardPickedLetter === item.letter ? 20 : 1,

                              ...provided.draggableProps.style,
                            }}
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
              {questionGroups.map((group, gIndex) => (
                <div className="word-group-unit3-p5-q4" key={gIndex}>
                  {group.map((num, lIndex) => {
                    const slotId = `${gIndex}-${lIndex}`;

                    const isLocked = lockedSlots.includes(slotId);

                    const isWrong = wrongInputs.includes(slotId);

                    const flatIndex = getFlatSlotIndex(gIndex, lIndex);

                    return (
                      <Droppable
                        key={slotId}
                        droppableId={`slot-${gIndex}-${lIndex}`}
                        isDropDisabled={
                          showAnswer || isLocked || checkCompleted
                        }
                      >
                        {(provided, snapshot) => (
                          <div className="slot-wrapper">
                            <h6 className="slot-number">{num}</h6>

                            <div
                              ref={(el) => {
                                provided.innerRef(el);

                                slotRefs.current[flatIndex] = el;
                              }}
                              {...provided.droppableProps}
                              className={`drop-slot
                                    ${
                                      snapshot.isDraggingOver && !isLocked
                                        ? "drag-over"
                                        : ""
                                    }
                                    ${isWrong ? "wrong" : ""}
                                  `}
                              role={
                                keyboardPickedLetter &&
                                !isLocked &&
                                !showAnswer &&
                                !checkCompleted
                                  ? "button"
                                  : undefined
                              }
                              aria-disabled={
                                keyboardPickedLetter
                                  ? showAnswer || isLocked || checkCompleted
                                  : undefined
                              }
                              tabIndex={
                                keyboardPickedLetter &&
                                !showAnswer &&
                                !isLocked &&
                                !checkCompleted
                                  ? 0
                                  : -1
                              }
                              aria-label={
                                keyboardPickedLetter
                                  ? slots[gIndex][lIndex]
                                    ? `Box ${flatIndex + 1}. Current letter ${
                                        slots[gIndex][lIndex]
                                      }. Press Enter to replace it with ${keyboardPickedLetter}.`
                                    : `Box ${
                                        flatIndex + 1
                                      }. Press Enter to place ${keyboardPickedLetter}.`
                                  : undefined
                              }
                              onFocus={(e) => {
                                if (
                                  !keyboardPickedLetter ||
                                  isLocked ||
                                  showAnswer ||
                                  checkCompleted
                                ) {
                                  e.currentTarget.blur();

                                  setFocusedSlot(null);

                                  return;
                                }

                                setFocusedSlot(slotId);
                              }}
                              onBlur={() => setFocusedSlot(null)}
                              onKeyDown={(e) => {
                                if (isLocked) {
                                  return;
                                }

                                /* =================================
                                       TAB BETWEEN AVAILABLE SLOTS
                                    ================================= */

                                if (keyboardPickedLetter && e.key === "Tab") {
                                  e.preventDefault();

                                  e.stopPropagation();

                                  const available = getAvailableSlotIndexes();

                                  if (available.length === 0) {
                                    return;
                                  }

                                  const currentPosition =
                                    available.indexOf(flatIndex);

                                  let nextPosition;

                                  if (e.shiftKey) {
                                    nextPosition =
                                      currentPosition <= 0
                                        ? available.length - 1
                                        : currentPosition - 1;
                                  } else {
                                    nextPosition =
                                      currentPosition === -1 ||
                                      currentPosition === available.length - 1
                                        ? 0
                                        : currentPosition + 1;
                                  }

                                  const nextIndex = available[nextPosition];

                                  slotRefs.current[nextIndex]?.focus();

                                  return;
                                }

                                /* =================================
                                       ENTER / SPACE
                                    ================================= */

                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();

                                  e.stopPropagation();

                                  if (keyboardPickedLetter) {
                                    handleKeyboardDrop(
                                      gIndex,
                                      lIndex,
                                      flatIndex,
                                    );
                                  }
                                }
                              }}
                              onClick={(e) => {
                                if (
                                  e.detail === 0 &&
                                  keyboardPickedLetter &&
                                  !isLocked
                                ) {
                                  e.preventDefault();

                                  e.stopPropagation();

                                  handleKeyboardDrop(gIndex, lIndex, flatIndex);
                                }
                              }}
                              style={{
                                background: isLocked
                                  ? undefined
                                  : snapshot.isDraggingOver
                                    ? "#c4e5fc"
                                    : keyboardPickedLetter &&
                                        focusedSlot === slotId
                                      ? "#dbeafe"
                                      : undefined,

                                outline:
                                  !isLocked &&
                                  keyboardPickedLetter &&
                                  focusedSlot === slotId
                                    ? "3px solid #2563eb"
                                    : "none",

                                outlineOffset: "3px",

                                transform:
                                  !isLocked &&
                                  keyboardPickedLetter &&
                                  focusedSlot === slotId
                                    ? "scale(1.08)"
                                    : "scale(1)",

                                boxShadow:
                                  !isLocked &&
                                  keyboardPickedLetter &&
                                  focusedSlot === slotId
                                    ? "0 0 0 4px rgba(37,99,235,0.15)"
                                    : "none",

                                cursor: isLocked ? "default" : undefined,

                                transition:
                                  "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
                              }}
                            >
                              {isWrong && (
                                <div className="error-mark1" aria-hidden="true">
                                  ✕
                                </div>
                              )}

                              {slots[gIndex][lIndex] && (
                                <div className="dropped-letter">
                                  {slots[gIndex][lIndex]}
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

              <div className="text-[40px] text-center font-semibold mt-5">
                ?
              </div>

              <img
                src={img}
                alt="Illustration for the question: What shape is it?"
                style={{
                  height: "150px",

                  width: "185px",
                }}
              />
            </div>

            {/* =================================================
                SENTENCE
            ================================================= */}

            <div
              className={`sentence-box ${
                isSentenceCorrect ? "sentence-clickable" : ""
              }`}
              role={isSentenceCorrect ? "button" : undefined}
              tabIndex={isSentenceCorrect ? 0 : -1}
              aria-label={
                isSentenceCorrect
                  ? `Correct sentence: ${sentence}. Press Enter to hear it.`
                  : undefined
              }
              title={isSentenceCorrect ? "Play sentence audio" : undefined}
              onClick={isSentenceCorrect ? playSentenceAudio : undefined}
              onKeyDown={(e) => {
                if (isSentenceCorrect && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();

                  e.stopPropagation();

                  playSentenceAudio();
                }
              }}
              style={{
                cursor: isSentenceCorrect ? "pointer" : "default",
              }}
            >
              <span className="sentence-text">{sentence}</span>

              <div className="text-[40px] text-center font-semibold">?</div>
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

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

        <button onClick={handleCheckAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit4_Page5_Q4;
