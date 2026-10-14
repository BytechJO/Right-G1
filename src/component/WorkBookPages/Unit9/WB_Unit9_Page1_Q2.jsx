/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import farmImg from "../../../assets/U1 WB/U9/U9P51EXEB.svg";
import howManyAudio from "../../../assets/U1 WB/U9/audio/page51- B/Item_003_How_many.mp3";
import thereAreOneAudio from "../../../assets/U1 WB/U9/audio/page51- B/Item_001_There_are_one.mp3";
import thereAreTwoAudio from "../../../assets/U1 WB/U9/audio/page51- B/Item_002_There_are_two.mp3";
import thereAreThreeAudio from "../../../assets/U1 WB/U9/audio/page51- B/Item_002_There_are_three.mp3";
import goatsAudio from "../../../assets/U1 WB/U9/audio/page51- B/Item_004_goats.mp3";
import cowsAudio from "../../../assets/U1 WB/U9/audio/page51- B/Item_006_COWS.mp3";
import dogsAudio from "../../../assets/U1 WB/U9/audio/page51- B/Item_008_dogs.mp3";
import catsAudio from "../../../assets/U1 WB/U9/audio/page51- B/Item_010_cats.mp3";
import full1Audio from "../../../assets/U1 WB/U9/audio/page51- B/full1.mp3";
import full2Audio from "../../../assets/U1 WB/U9/audio/page51- B/full2.mp3";
import full3Audio from "../../../assets/U1 WB/U9/audio/page51- B/full3.mp3";
import full4Audio from "../../../assets/U1 WB/U9/audio/page51- B/full4.mp3";
import "./WB_Unit9_Page1_Q2.css";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

const questions = [
  {
    label: "goats",
    correctLeft: "How many",
    correctRight: "There are three",
    labelAudio: goatsAudio,
    fullAudio: full1Audio,
  },
  {
    label: "cows",
    correctLeft: "How many",
    correctRight: "There are three",
    labelAudio: cowsAudio,
    fullAudio: full2Audio,
  },
  {
    label: "dogs",
    correctLeft: "How many",
    correctRight: "There are one",
    labelAudio: dogsAudio,
    fullAudio: full3Audio,
  },
  {
    label: "cats",
    correctLeft: "How many",
    correctRight: "There are two",
    labelAudio: catsAudio,
    fullAudio: full4Audio,
  },
];

const allPhrases = [
  "How many",
  "There are one",
  "There are two",
  "There are three",
];
const phraseAudios = {
  "How many": howManyAudio,
  "There are one": thereAreOneAudio,
  "There are two": thereAreTwoAudio,
  "There are three": thereAreThreeAudio,
};
const targetIds = questions.flatMap((_, index) => [
  `${index}-left`,
  `${index}-right`,
]);

const activateWithKeyboard = (event, action) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

function DraggableChip({
  id,
  disabled,
  onKeyboardPick,
  onPlay,
  playing,
  bankRef,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });
  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        bankRef(element);
      }}
      {...listeners}
      {...attributes}
      className="wb-unit9-audio-control"
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Pick ${id}`}
      onKeyDown={(event) => activateWithKeyboard(event, onKeyboardPick)}
      onClick={onPlay}
      style={{
        borderRadius: "8px",
        border: "2px solid #2c5287",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        cursor: disabled ? "default" : "grab",
        background: "white",
        padding: "5px",
        opacity: isDragging ? 0.4 : 1,
        touchAction: "none",
      }}
    >
      {playing && <Unit9PlayingAudioIcon />}
      {id}
    </div>
  );
}

function DroppableCell({
  id,
  value,
  preview,
  isOver,
  disabled,
  keyboardActive,
  onClear,
  onKeyDown,
  targetRef,
}) {
  const { setNodeRef } = useDroppable({ id, disabled });
  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        targetRef(element);
      }}
      className={`wb-unit9-p1-q2-input ${isOver ? "drag-over-cell" : ""}`}
      role="button"
      tabIndex={!disabled && (keyboardActive || value) ? 0 : -1}
      aria-label={
        value ? `${value}. Press Enter to remove` : "Empty answer box"
      }
      style={{
        cursor: !disabled && value ? "pointer" : "default",
        background: isOver ? "#e3f2fd" : "white",
      }}
      onClick={() => !disabled && value && onClear(id, true)}
      onKeyDown={onKeyDown}
    >
      {preview ? (
        <span className="keyboard-drag-preview-wb-unit9">{preview}</span>
      ) : (
        value
      )}
    </div>
  );
}

const WB_Unit9_Page1_Q2 = () => {
  const [answers, setAnswers] = useState(
    questions.map(() => ({ left: "", right: "" })),
  );
  const [lockedCells, setLockedCells] = useState([]);
  const [wrongCells, setWrongCells] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [keyboardItem, setKeyboardItem] = useState(null);
  const [keyboardTarget, setKeyboardTarget] = useState(null);
  const bankRefs = useRef({});
  const { activeAudioKey, playAudio } = useUnit9Audio();
  const targetRefs = useRef({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const isCellLocked = (id) => showAnswer || lockedCells.includes(id);
  const availableTargets = targetIds.filter((id) => !isCellLocked(id));

  const clearWrongCell = (id) =>
    setWrongCells((current) => current.filter((cellId) => cellId !== id));

  const placeValue = (dest, value) => {
    if (isCellLocked(dest)) return;
    const [questionIndex, side] = dest.split("-");
    setAnswers((current) => {
      const next = current.map((answer) => ({ ...answer }));
      next[Number(questionIndex)][side] = value;
      return next;
    });
    clearWrongCell(dest);
  };

  const focusNextBankItem = (value) => {
    const index = allPhrases.indexOf(value);
    const nextValue = allPhrases[(index + 1) % allPhrases.length];
    requestAnimationFrame(() => bankRefs.current[nextValue]?.focus());
  };

  const pickWithKeyboard = (value) => {
    if (showAnswer) return;
    const firstTarget = availableTargets[0];
    if (!firstTarget) return;
    setKeyboardItem(value);
    setKeyboardTarget(firstTarget);
    requestAnimationFrame(() => targetRefs.current[firstTarget]?.focus());
  };

  const cancelKeyboardDrag = () => {
    const origin = keyboardItem;
    setKeyboardItem(null);
    setKeyboardTarget(null);
    requestAnimationFrame(() => bankRefs.current[origin]?.focus());
  };

  const handleClear = (cellId, fromPointer) => {
    if (isCellLocked(cellId)) return;
    const [questionIndex, side] = cellId.split("-");
    const returnedValue = answers[Number(questionIndex)][side];
    setAnswers((current) => {
      const next = current.map((answer) => ({ ...answer }));
      next[Number(questionIndex)][side] = "";
      return next;
    });
    clearWrongCell(cellId);
    if (!fromPointer)
      requestAnimationFrame(() => bankRefs.current[returnedValue]?.focus());
  };

  const handleTargetKeyDown = (event, id) => {
    if (keyboardItem) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelKeyboardDrag();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        const index = availableTargets.indexOf(id);
        const direction = event.shiftKey ? -1 : 1;
        const nextId =
          availableTargets[
            (index + direction + availableTargets.length) %
              availableTargets.length
          ];
        setKeyboardTarget(nextId);
        targetRefs.current[nextId]?.focus();
        return;
      }
      activateWithKeyboard(event, () => {
        const placedItem = keyboardItem;
        placeValue(id, placedItem);
        setKeyboardItem(null);
        setKeyboardTarget(null);
        focusNextBankItem(placedItem);
      });
      return;
    }
    activateWithKeyboard(event, () => handleClear(id, false));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setOverId(null);
    if (!over || showAnswer || !targetIds.includes(over.id)) return;
    placeValue(over.id, active.id);
  };

  const checkAnswers = () => {
    if (showAnswer || lockedCells.length === targetIds.length) return;
    if (answers.some((answer) => !answer.left || !answer.right)) {
      ValidationAlert.info("Please fill in all the blanks!");
      return;
    }
    const correctCells = [];
    const incorrectCells = [];
    questions.forEach((question, index) => {
      ["left", "right"].forEach((side) => {
        const id = `${index}-${side}`;
        const expected =
          side === "left" ? question.correctLeft : question.correctRight;
        if (
          answers[index][side].trim().toLowerCase() === expected.toLowerCase()
        )
          correctCells.push(id);
        else incorrectCells.push(id);
      });
    });
    setLockedCells(correctCells);
    setWrongCells(incorrectCells);
    const score = questions.filter(
      (question, index) =>
        answers[index].left.toLowerCase() ===
          question.correctLeft.toLowerCase() &&
        answers[index].right.toLowerCase() ===
          question.correctRight.toLowerCase(),
    ).length;
    const color =
      score === questions.length ? "green" : score === 0 ? "red" : "orange";
    const message = `<div style="font-size:20px;margin-top:10px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${questions.length}</span></div>`;
    if (score === questions.length) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  const showAnswers = () => {
    setAnswers(
      questions.map((question) => ({
        left: question.correctLeft,
        right: question.correctRight,
      })),
    );
    setLockedCells(targetIds);
    setWrongCells([]);
    setShowAnswer(true);
    setKeyboardItem(null);
    setKeyboardTarget(null);
  };

  const resetAll = () => {
    setAnswers(questions.map(() => ({ left: "", right: "" })));
    setLockedCells([]);
    setWrongCells([]);
    setShowAnswer(false);
    setKeyboardItem(null);
    setKeyboardTarget(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragOver={({ over }) => setOverId(over ? over.id : null)}
      onDragEnd={handleDragEnd}
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
        <div className="div-forall mb-10" style={{ gap: "10px" }}>
          <ExerciseHeader
            sectionLetter="B"
            title="Look, read, and write."
            subTitle="Count each animal group, then drag the question and number words into the blanks."
          />
          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "10px",
              width: "100%",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {allPhrases.map((text) => (
              <DraggableChip
                key={text}
                id={text}
                disabled={showAnswer}
                onKeyboardPick={() => {
                  playAudio(`phrase-${text}`, phraseAudios[text]);
                  pickWithKeyboard(text);
                }}
                onPlay={() => playAudio(`phrase-${text}`, phraseAudios[text])}
                playing={activeAudioKey === `phrase-${text}`}
                bankRef={(element) => {
                  bankRefs.current[text] = element;
                }}
              />
            ))}
          </div>
          <img
            src={farmImg}
            alt="Farm animals including goats, cows, dogs, and cats"
            className="wb-unit9-p1-q2-image"
          />
          <div className="wb-unit9-p1-q2-questions w-full">
            {questions.map((question, index) => (
              <div
                key={question.label}
                className={`wb-unit9-p1-q2-row wb-unit9-audio-control ${lockedCells.includes(`${index}-left`) && lockedCells.includes(`${index}-right`) ? "wb-unit9-completed-audio" : ""}`}
                role={
                  lockedCells.includes(`${index}-left`) &&
                  lockedCells.includes(`${index}-right`)
                    ? "button"
                    : undefined
                }
                tabIndex={
                  lockedCells.includes(`${index}-left`) &&
                  lockedCells.includes(`${index}-right`)
                    ? 0
                    : undefined
                }
                aria-label={
                  lockedCells.includes(`${index}-left`) &&
                  lockedCells.includes(`${index}-right`)
                    ? `Play complete answer for ${question.label}`
                    : undefined
                }
                onClick={() => {
                  if (
                    lockedCells.includes(`${index}-left`) &&
                    lockedCells.includes(`${index}-right`)
                  )
                    playAudio(`full-${index}`, question.fullAudio);
                }}
                onKeyDown={(event) => {
                  if (
                    lockedCells.includes(`${index}-left`) &&
                    lockedCells.includes(`${index}-right`) &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    playAudio(`full-${index}`, question.fullAudio);
                  }
                }}
              >
                {activeAudioKey === `full-${index}` && (
                  <Unit9PlayingAudioIcon />
                )}
                <span className="wb-unit9-p1-q2-number">{index + 1}</span>
                {["left", "right"].map((side) => {
                  const id = `${index}-${side}`;
                  return (
                    <div key={side} style={{ width: "100%" }}>
                      <div className="wb-unit9-p1-q2-input-wrapper">
                        <DroppableCell
                          id={id}
                          value={answers[index][side]}
                          preview={
                            keyboardItem && keyboardTarget === id
                              ? keyboardItem
                              : ""
                          }
                          isOver={overId === id}
                          disabled={isCellLocked(id)}
                          keyboardActive={Boolean(keyboardItem)}
                          onClear={handleClear}
                          onKeyDown={(event) => handleTargetKeyDown(event, id)}
                          targetRef={(element) => {
                            targetRefs.current[id] = element;
                          }}
                        />
                        {wrongCells.includes(id) && (
                          <div className="wb-unit9-p1-q2-wrong-mark">✕</div>
                        )}
                      </div>
                      <span
                        className="wb-unit9-p1-q2-text wb-unit9-audio-control cursor-pointer"
                        role={
                          lockedCells.includes(`${index}-left`) &&
                          lockedCells.includes(`${index}-right`)
                            ? undefined
                            : "button"
                        }
                        tabIndex={
                          lockedCells.includes(`${index}-left`) &&
                          lockedCells.includes(`${index}-right`)
                            ? -1
                            : 0
                        }
                        aria-label={`Play ${question.label}`}
                        onClick={(event) => {
                          if (
                            lockedCells.includes(`${index}-left`) &&
                            lockedCells.includes(`${index}-right`)
                          )
                            return;
                          event.stopPropagation();
                          playAudio(
                            `label-${index}-${side}`,
                            question.labelAudio,
                          );
                        }}
                        onKeyDown={(event) => {
                          if (
                            !lockedCells.includes(`${index}-left`) ||
                            !lockedCells.includes(`${index}-right`)
                          ) {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              playAudio(
                                `label-${index}-${side}`,
                                question.labelAudio,
                              );
                            }
                          }
                        }}
                      >
                        {activeAudioKey === `label-${index}-${side}` && (
                          <Unit9PlayingAudioIcon />
                        )}
                        {side === "left"
                          ? `${question.label} are there?`
                          : question.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button type="button" onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>
          <button
            type="button"
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button
            type="button"
            onClick={checkAnswers}
            className="check-button2"
          >
            Check Answer ✓
          </button>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div
            style={{
              borderRadius: "8px",
              border: "2px solid #2c5287",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              background: "white",
              padding: "5px 10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              cursor: "grabbing",
              whiteSpace: "nowrap",
            }}
          >
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit9_Page1_Q2;
