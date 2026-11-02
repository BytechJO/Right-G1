import { useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import sentenceAudio from "../../../assets/unit10/sound/Page 86 - C/what do you want.mp3";
import useUnit10Audio from "./useUnit10Audio";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import "./Unit10_Page5_Q4.css";

const DATA = "abcdefghijklmnopqrstuvwxyz".split("").map((letter, index) => ({
  letter,
  number: index + 1,
}));
const QUESTION_GROUPS = [
  [23, 8, 1, 20],
  [4, 15],
  [25, 15, 21],
  [23, 1, 14, 20],
];
const createEmptySlots = () => QUESTION_GROUPS.map((group) => group.map(() => null));
const slotId = (groupIndex, letterIndex) => `${groupIndex}-${letterIndex}`;

const Unit10_Page5_Q4 = () => {
  const [slots, setSlots] = useState(createEmptySlots);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [keyboardLetter, setKeyboardLetter] = useState(null);
  const [focusedSlot, setFocusedSlot] = useState(null);
  const bankRefs = useRef(new Map());
  const slotRefs = useRef(new Map());
  const previousCorrectRef = useRef(false);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();

  const correctLetter = (groupIndex, letterIndex) =>
    DATA.find((item) => item.number === QUESTION_GROUPS[groupIndex][letterIndex]).letter;
  const isSentenceCorrect = slots.every((group, groupIndex) =>
    group.every((letter, letterIndex) => letter === correctLetter(groupIndex, letterIndex)),
  );
  const formedWords = slots.map((group) => group.map((letter) => letter || "").join(""));
  const sentence = formedWords.join(" ").trim();
  const displayedSentence = sentence ? `${sentence}?` : "";
  const allLocked = lockedSlots.length === slots.flat().length;

  useEffect(() => {
    if (isSentenceCorrect && !previousCorrectRef.current && !showAnswer) {
      playAudio("completed-sentence", sentenceAudio);
    }
    previousCorrectRef.current = isSentenceCorrect;
  }, [isSentenceCorrect, playAudio, showAnswer]);

  const availableSlotIds = () =>
    QUESTION_GROUPS.flatMap((group, groupIndex) =>
      group.map((_, letterIndex) => slotId(groupIndex, letterIndex)),
    ).filter((id) => !lockedSlots.includes(id));

  const focusSlotById = (id) => {
    setFocusedSlot(id);
    requestAnimationFrame(() => slotRefs.current.get(id)?.focus());
  };

  const selectLetter = (letter) => {
    if (showAnswer || allLocked) return;
    const available = availableSlotIds();
    if (!available.length) return;
    setKeyboardLetter(letter);
    focusSlotById(available[0]);
  };

  const cancelLetter = () => {
    const letter = keyboardLetter;
    setKeyboardLetter(null);
    setFocusedSlot(null);
    requestAnimationFrame(() => bankRefs.current.get(letter)?.focus());
  };

  const placeLetter = (groupIndex, letterIndex, letter, returnToBank = false) => {
    const id = slotId(groupIndex, letterIndex);
    if (lockedSlots.includes(id)) return;
    setSlots((previous) => {
      const updated = previous.map((group) => [...group]);
      updated[groupIndex][letterIndex] = letter;
      return updated;
    });
    setWrongInputs((previous) => previous.filter((wrongId) => wrongId !== id));
    setKeyboardLetter(null);
    setFocusedSlot(null);
    if (returnToBank) requestAnimationFrame(() => bankRefs.current.get(letter)?.focus());
  };

  const removeLetter = (groupIndex, letterIndex, returnToBank = false) => {
    const id = slotId(groupIndex, letterIndex);
    if (lockedSlots.includes(id)) return;
    const removed = slots[groupIndex][letterIndex];
    setSlots((previous) => {
      const updated = previous.map((group) => [...group]);
      updated[groupIndex][letterIndex] = null;
      return updated;
    });
    setWrongInputs((previous) => previous.filter((wrongId) => wrongId !== id));
    if (returnToBank && removed) requestAnimationFrame(() => bankRefs.current.get(removed)?.focus());
  };

  const handleSlotKeyDown = (event, groupIndex, letterIndex) => {
    const id = slotId(groupIndex, letterIndex);
    const available = availableSlotIds();
    if (keyboardLetter) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelLetter();
      } else if (event.key === "Tab") {
        event.preventDefault();
        const current = Math.max(0, available.indexOf(id));
        const direction = event.shiftKey ? -1 : 1;
        focusSlotById(available[(current + direction + available.length) % available.length]);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        placeLetter(groupIndex, letterIndex, keyboardLetter, true);
      }
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && slots[groupIndex][letterIndex]) {
      event.preventDefault();
      removeLetter(groupIndex, letterIndex, true);
    }
  };

  const onDragEnd = ({ destination, draggableId }) => {
    if (!destination || showAnswer || allLocked) return;
    if (!destination.droppableId.startsWith("slot-")) return;
    const [groupIndex, letterIndex] = destination.droppableId.split("-").slice(1).map(Number);
    placeLetter(groupIndex, letterIndex, draggableId.replace("letter-", ""));
  };

  const handleShowAnswer = () => {
    previousCorrectRef.current = true;
    setSlots(QUESTION_GROUPS.map((group) => group.map((number) => DATA.find((item) => item.number === number).letter)));
    setWrongInputs([]);
    setLockedSlots(QUESTION_GROUPS.flatMap((group, groupIndex) => group.map((_, letterIndex) => slotId(groupIndex, letterIndex))));
    setShowAnswer(true);
    setKeyboardLetter(null);
    setFocusedSlot(null);
    stopAudio();
  };

  const handleCheckAnswers = () => {
    if (allLocked) return;
    if (slots.some((group) => group.some((letter) => !letter))) {
      ValidationAlert.info("Oops!", "Please complete all fields before checking.");
      return;
    }
    const correct = [];
    const wrong = [];
    slots.forEach((group, groupIndex) => {
      group.forEach((letter, letterIndex) => {
        const id = slotId(groupIndex, letterIndex);
        if (letter === correctLetter(groupIndex, letterIndex)) correct.push(id);
        else wrong.push(id);
      });
    });
    setLockedSlots((previous) => [...new Set([...previous, ...correct])]);
    setWrongInputs(wrong);
    setShowAnswer(false);

    const total = slots.flat().length;
    const correctCount = correct.length;
    const color = correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";
    const scoreMessage = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${correctCount} / ${total}</span></div>`;
    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setSlots(createEmptySlots());
    setWrongInputs([]);
    setLockedSlots([]);
    setShowAnswer(false);
    setKeyboardLetter(null);
    setFocusedSlot(null);
    previousCorrectRef.current = false;
    stopAudio();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall">
        <div className="container8">
          <ExerciseHeader sectionLetter="C" title="Answer the question." subTitle="Match each number to its letter, then build the hidden sentence." />
          <div className="alphabet-box">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="alphabet" direction="horizontal" isDropDisabled>
                {(provided) => (
                  <div className="row1-unit3-q4" ref={provided.innerRef} {...provided.droppableProps}>
                    {DATA.map((item, index) => (
                      <div className="letter-char1" key={item.letter}>
                        <Draggable draggableId={`letter-${item.letter}`} index={index} isDragDisabled={showAnswer || allLocked}>
                          {(dragProvided) => (
                            <div
                              ref={(node) => {
                                dragProvided.innerRef(node);
                                bankRefs.current.set(item.letter, node);
                              }}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              role="button"
                              tabIndex={0}
                              aria-label={`Pick letter ${item.letter}`}
                              className="cell1 drag-letter"
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  selectLetter(item.letter);
                                }
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

              <div className="words">
                {QUESTION_GROUPS.map((group, groupIndex) => (
                  <div className="word-group" key={groupIndex}>
                    {group.map((number, letterIndex) => {
                      const id = slotId(groupIndex, letterIndex);
                      const preview = keyboardLetter && focusedSlot === id ? keyboardLetter : null;
                      const displayedLetter = preview || slots[groupIndex][letterIndex];
                      const locked = lockedSlots.includes(id);
                      return (
                        <Droppable key={id} droppableId={`slot-${id}`} isDropDisabled={showAnswer || locked}>
                          {(provided, snapshot) => (
                            <div className="slot-wrapper">
                              <h6 className="slot-number">{number}</h6>
                              <div
                                ref={(node) => {
                                  provided.innerRef(node);
                                  slotRefs.current.set(id, node);
                                }}
                                {...provided.droppableProps}
                                role={!locked ? "button" : undefined}
                                tabIndex={!locked && (keyboardLetter || slots[groupIndex][letterIndex]) ? 0 : -1}
                                aria-label={!locked ? (displayedLetter ? `Letter ${displayedLetter} in position ${number}` : `Empty position ${number}`) : undefined}
                                onFocus={() => setFocusedSlot(id)}
                                onKeyDown={(event) => handleSlotKeyDown(event, groupIndex, letterIndex)}
                                className={`drop-slot ${snapshot.isDraggingOver ? "drag-over" : ""} ${wrongInputs.includes(id) ? "wrong" : ""}`}
                              >
                                {wrongInputs.includes(id) && !preview && <div className="error-mark1">✕</div>}
                                {displayedLetter && <div className={`dropped-letter${preview ? " unit10-keyboard-preview" : ""}`}>{displayedLetter}</div>}
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
                className={`sentence-box unit10-audio-control${isSentenceCorrect ? " unit10-completed-audio" : ""}`}
                role={isSentenceCorrect ? "button" : undefined}
                tabIndex={isSentenceCorrect ? 0 : undefined}
                aria-label={isSentenceCorrect ? "Play the completed question: What do you want?" : undefined}
                onClick={isSentenceCorrect ? () => playAudio("completed-sentence", sentenceAudio) : undefined}
                onKeyDown={isSentenceCorrect ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playAudio("completed-sentence", sentenceAudio);
                  }
                } : undefined}
              >
                {activeAudioKey === "completed-sentence" && <Unit10PlayingAudioIcon />}
                <span className="sentence-text">{displayedSentence}</span>
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">Start Again ↻</button>
        <button onClick={handleShowAnswer} className="show-answer-btn swal-continue">Show Answer</button>
        <button onClick={handleCheckAnswers} className="check-button2">Check Answer ✓</button>
      </div>
    </div>
  );
};

export default Unit10_Page5_Q4;
