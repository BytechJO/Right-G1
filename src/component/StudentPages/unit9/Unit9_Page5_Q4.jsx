import React, { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { FaVolumeUp } from "react-icons/fa";
import sentenceAudio from "../../../assets/unit9/sound/Page 80 - C/what do you like.mp3";
import "./Unit9_Page5_Q4.css";

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
  [23, 8, 1, 20],
  [4, 15],
  [25, 15, 21],
  [12, 9, 11, 5],
];

const Unit9_Page5_Q4 = () => {
  const [slots, setSlots] = useState(
    questionGroups.map((group) => group.map(() => null)),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [focusedSlotId, setFocusedSlotId] = useState(null);
  const letterRefs = useRef({});
  const slotRefs = useRef({});
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayedComplete, setAutoPlayedComplete] = useState(false);

  const keyFor = (groupIndex, letterIndex) =>
    `${groupIndex}-${letterIndex}`;
  const slotIdFor = (groupIndex, letterIndex) =>
    `slot-${groupIndex}-${letterIndex}`;
  const correctLetter = (groupIndex, letterIndex) =>
    data.find(
      (item) => item.number === questionGroups[groupIndex][letterIndex],
    ).letter;
  const isLocked = (groupIndex, letterIndex) =>
    showAnswer || lockedSlots.includes(keyFor(groupIndex, letterIndex));
  const allSlotsFilled = slots.every((group) => group.every(Boolean));
  const allSlotsCorrect = slots.every((group, groupIndex) =>
    group.every(
      (letter, letterIndex) =>
        letter === correctLetter(groupIndex, letterIndex),
    ),
  );

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playSentenceAudio = useCallback(() => {
    stopAudio();
    const audio = new Audio(sentenceAudio);
    audioRef.current = audio;
    setIsPlaying(true);
    audio.play().catch(() => {
      if (audioRef.current === audio) audioRef.current = null;
      setIsPlaying(false);
    });
    audio.onended = () => {
      if (audioRef.current === audio) audioRef.current = null;
      setIsPlaying(false);
    };
    audio.onerror = audio.onended;
  }, [stopAudio]);

  useEffect(() => {
    if (
      allSlotsFilled &&
      allSlotsCorrect &&
      !autoPlayedComplete &&
      !showAnswer
    ) {
      setAutoPlayedComplete(true);
      playSentenceAudio();
    }
    if (!allSlotsCorrect) setAutoPlayedComplete(false);
  }, [
    allSlotsCorrect,
    allSlotsFilled,
    autoPlayedComplete,
    playSentenceAudio,
    showAnswer,
  ]);

  useEffect(() => stopAudio, [stopAudio]);

  const availableSlotIds = () => {
    const ids = [];
    questionGroups.forEach((group, groupIndex) => {
      group.forEach((_, letterIndex) => {
        if (!isLocked(groupIndex, letterIndex)) {
          ids.push(slotIdFor(groupIndex, letterIndex));
        }
      });
    });
    return ids;
  };

  const placeLetter = (groupIndex, letterIndex, letter) => {
    if (isLocked(groupIndex, letterIndex)) return;
    setSlots((previous) => {
      const updated = previous.map((group) => [...group]);
      updated[groupIndex][letterIndex] = letter;
      return updated;
    });
    setWrongInputs((previous) =>
      previous.filter((key) => key !== keyFor(groupIndex, letterIndex)),
    );
  };

  const onDragEnd = ({ destination, draggableId }) => {
    if (!destination || showAnswer || allCompleted) return;
    if (!destination.droppableId.startsWith("slot-")) return;
    const [groupIndex, letterIndex] = destination.droppableId
      .split("-")
      .slice(1)
      .map(Number);
    placeLetter(
      groupIndex,
      letterIndex,
      draggableId.replace("letter-", ""),
    );
  };

  const selectLetter = (letter) => {
    if (showAnswer || allCompleted) return;
    setSelectedLetter(letter);
    const firstSlot = availableSlotIds()[0];
    if (firstSlot) requestAnimationFrame(() => slotRefs.current[firstSlot]?.focus());
  };

  const placeSelectedLetter = (groupIndex, letterIndex) => {
    if (!selectedLetter) return;
    const letter = selectedLetter;
    placeLetter(groupIndex, letterIndex, letter);
    setSelectedLetter(null);
    setFocusedSlotId(null);
    const currentIndex = data.findIndex((item) => item.letter === letter);
    const nextLetter = data[(currentIndex + 1) % data.length].letter;
    requestAnimationFrame(() => letterRefs.current[nextLetter]?.focus());
  };

  const removeLetter = (groupIndex, letterIndex) => {
    if (isLocked(groupIndex, letterIndex)) return;
    const letter = slots[groupIndex][letterIndex];
    if (!letter) return;
    setSlots((previous) => {
      const updated = previous.map((group) => [...group]);
      updated[groupIndex][letterIndex] = null;
      return updated;
    });
    setWrongInputs((previous) =>
      previous.filter((key) => key !== keyFor(groupIndex, letterIndex)),
    );
    requestAnimationFrame(() => letterRefs.current[letter]?.focus());
  };

  const cancelSelection = () => {
    const letter = selectedLetter;
    setSelectedLetter(null);
    setFocusedSlotId(null);
    if (letter) requestAnimationFrame(() => letterRefs.current[letter]?.focus());
  };

  const moveSlotFocus = (currentId, backwards) => {
    const available = availableSlotIds();
    const currentIndex = available.indexOf(currentId);
    const nextIndex = backwards
      ? currentIndex <= 0
        ? available.length - 1
        : currentIndex - 1
      : currentIndex === available.length - 1
        ? 0
        : currentIndex + 1;
    requestAnimationFrame(() => slotRefs.current[available[nextIndex]]?.focus());
  };

  const handleSlotKeyDown = (event, groupIndex, letterIndex) => {
    if (isLocked(groupIndex, letterIndex)) return;
    const slotId = slotIdFor(groupIndex, letterIndex);
    if (selectedLetter && event.key === "Tab") {
      event.preventDefault();
      moveSlotFocus(slotId, event.shiftKey);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (selectedLetter) placeSelectedLetter(groupIndex, letterIndex);
      else removeLetter(groupIndex, letterIndex);
    } else if (selectedLetter && event.key === "Escape") {
      event.preventDefault();
      cancelSelection();
    }
  };

  const handleShowAnswer = () => {
    stopAudio();
    setSlots(
      questionGroups.map((group) =>
        group.map((number) => data.find((item) => item.number === number).letter),
      ),
    );
    const allKeys = [];
    questionGroups.forEach((group, groupIndex) =>
      group.forEach((_, letterIndex) =>
        allKeys.push(keyFor(groupIndex, letterIndex)),
      ),
    );
    setLockedSlots(allKeys);
    setWrongInputs([]);
    setShowAnswer(true);
    setAllCompleted(true);
    setSelectedLetter(null);
    setFocusedSlotId(null);
    setAutoPlayedComplete(true);
  };

  const handleCheckAnswers = () => {
    if (showAnswer || allCompleted) return;
    if (slots.some((group) => group.some((letter) => !letter))) {
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

    slots.forEach((group, groupIndex) => {
      group.forEach((letter, letterIndex) => {
        const key = keyFor(groupIndex, letterIndex);
        if (
          lockedSlots.includes(key) ||
          letter === correctLetter(groupIndex, letterIndex)
        ) {
          correctCount += 1;
          newlyLocked.push(key);
        } else {
          wrong.push(key);
        }
      });
    });

    setLockedSlots((previous) => [...new Set([...previous, ...newlyLocked])]);
    setWrongInputs(wrong);
    setSelectedLetter(null);
    setFocusedSlotId(null);
    if (correctCount === total) setAllCompleted(true);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";
    const scoreMessage = `<div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold;">Score: ${correctCount} / ${total}</span>
    </div>`;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const handleReset = () => {
    stopAudio();
    setSlots(questionGroups.map((group) => group.map(() => null)));
    setWrongInputs([]);
    setLockedSlots([]);
    setShowAnswer(false);
    setAllCompleted(false);
    setSelectedLetter(null);
    setFocusedSlotId(null);
    setAutoPlayedComplete(false);
  };

 const sentence = `${slots
  .map((group) => group.map((letter) => letter || "").join(""))
  .join(" ")}?`;
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall">
        <div className="container8">
          <ExerciseHeader
            sectionLetter="C"
            title="Answer the question."
            subTitle="Match each number to its letter, then build the hidden sentence."
          />

          <div className="alphabet-box">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="alphabet" direction="horizontal" isDropDisabled>
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
                          isDragDisabled={showAnswer || allCompleted}
                        >
                          {(dragProvided) => (
                            <div
                              ref={(node) => {
                                dragProvided.innerRef(node);
                                letterRefs.current[item.letter] = node;
                              }}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              role="button"
                              tabIndex={showAnswer || allCompleted ? -1 : 0}
                              aria-pressed={selectedLetter === item.letter}
                              aria-label={`Letter ${item.letter}, number ${item.number}. Press Enter or Space to select it.`}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  selectLetter(item.letter);
                                }
                              }}
                              className="cell1 drag-letter"
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

              <div className="words">
                {questionGroups.map((group, groupIndex) => (
                  <div className="word-group" key={groupIndex}>
                    {group.map((number, letterIndex) => {
                      const slotId = slotIdFor(groupIndex, letterIndex);
                      const key = keyFor(groupIndex, letterIndex);
                      const locked = isLocked(groupIndex, letterIndex);
                      const value = slots[groupIndex][letterIndex];
                      return (
                        <Droppable
                          key={slotId}
                          droppableId={slotId}
                          isDropDisabled={locked || allCompleted}
                        >
                          {(provided, snapshot) => (
                            <div className="slot-wrapper">
                              <h6 className="slot-number">{number}</h6>
                              <div
                                ref={(node) => {
                                  provided.innerRef(node);
                                  slotRefs.current[slotId] = node;
                                }}
                                {...provided.droppableProps}
                                role="button"
                                tabIndex={
                                  locked || allCompleted
                                    ? -1
                                    : selectedLetter || value
                                      ? 0
                                      : -1
                                }
                                aria-disabled={locked}
                                onFocus={() => setFocusedSlotId(slotId)}
                                aria-label={
                                  locked
                                    ? `Letter ${value} is correct and locked.`
                                    : selectedLetter
                                      ? `Answer slot for number ${number}. Press Enter or Space to place ${selectedLetter}.`
                                      : value
                                        ? `Answer slot contains ${value}. Press Enter or Space to remove it.`
                                        : `Answer slot for number ${number}.`
                                }
                                onKeyDown={(event) =>
                                  handleSlotKeyDown(
                                    event,
                                    groupIndex,
                                    letterIndex,
                                  )
                                }
                                className={`drop-slot
                                  ${snapshot.isDraggingOver ? "drag-over" : ""}
                                  ${wrongInputs.includes(key) ? "wrong" : ""}`}
                              >
                                {wrongInputs.includes(key) && (
                                  <div className="error-mark1" aria-hidden="true">
                                    ✕
                                  </div>
                                )}
                                {value && (
                                  <div className="dropped-letter">{value}</div>
                                )}
                                {selectedLetter &&
                                  focusedSlotId === slotId && (
                                    <span
                                      className="keyboard-drop-preview"
                                      aria-hidden="true"
                                    >
                                      {selectedLetter}
                                    </span>
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
              </div>

              <div
                className="sentence-box"
                aria-live="polite"
                role={allSlotsCorrect ? "button" : undefined}
                tabIndex={allSlotsCorrect ? 0 : -1}
                aria-label={
                  allSlotsCorrect
                    ? "What do you like? Press Enter or Space to hear the sentence."
                    : undefined
                }
                onClick={() => {
                  if (allSlotsCorrect) playSentenceAudio();
                }}
                onKeyDown={(e) => {
                  if (
                    allSlotsCorrect &&
                    (e.key === "Enter" || e.key === " ")
                  ) {
                    e.preventDefault();
                    playSentenceAudio();
                  }
                }}
                style={{ position: "relative" }}
              >
                <span className="sentence-text">{sentence}</span>
                {allSlotsCorrect && isPlaying && (
                  <FaVolumeUp
                    aria-hidden="true"
                    style={{ position: "absolute", top: 4, right: 4, pointerEvents: "none", zIndex: 5 }}
                  />
                )}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>

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

export default Unit9_Page5_Q4;
