/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState } from "react";
import "./WB_Unit9_Page2_Q2.css";
import table from "../../../assets/U1 WB/U9/U9P52EXED-01.svg";
import dish from "../../../assets/U1 WB/U9/U9P52EXED-02.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import sentenceOneAudio from "../../../assets/U1 WB/U9/audio/page52- D/Item_001_likes_she_chickens.mp3";
import sentenceTwoAudio from "../../../assets/U1 WB/U9/audio/page52- D/Item_002_cows_like_I.mp3";
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

const rows = [
  {
    id: "1",
    label: "likes/she/chickens",
    words: ["likes", "she", "chickens"],
    correct: ["she", "likes", "chickens"],
    audio: sentenceOneAudio,
  },
  {
    id: "2",
    label: "cows/like/I",
    words: ["cows", "like", "I"],
    correct: ["I", "like", "cows"],
    audio: sentenceTwoAudio,
  },
];

const images = [
  { id: "img1", src: table, alt: "A table" },
  { id: "img2", src: dish, alt: "A dish" },
];

const correctMatches = { 1: "img2", 2: "img1" };

const activateKey = (event, action) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

function BankWord({ id, word, disabled, onKeyboardPick, bankRef }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });
  return (
    <span
      ref={(element) => {
        setNodeRef(element);
        bankRef(element);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Pick ${word}`}
      onKeyDown={(event) => activateKey(event, onKeyboardPick)}
      style={{
        opacity: disabled ? 0.35 : isDragging ? 0.4 : 1,
        borderRadius: "8px",
        border: `2px solid ${disabled ? "#aaa" : "#2c5287"}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        cursor: disabled ? "default" : "grab",
        background: disabled ? "#e9e9e9" : "white",
        color: disabled ? "#999" : "",
        padding: "5px 10px",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {word}
    </span>
  );
}

function AnswerZone({
  id,
  words,
  disabled,
  wrong,
  preview,
  keyboardActive,
  onReturn,
  onKeyDown,
  zoneRef,
}) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        zoneRef(element);
      }}
      className={`unscramble-input-wb-unit9-p2-q1 ${isOver ? "drag-over-cell" : ""}`}
      role="button"
      tabIndex={!disabled && (keyboardActive || words.length) ? 0 : -1}
      aria-label={
        words.length
          ? `${words.join(" ")}. Press Enter on a word to remove it`
          : "Empty sentence answer area"
      }
      onKeyDown={onKeyDown}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        minHeight: "46px",
        borderBottom: "2px solid black",
        padding: "8px 12px",
        background: isOver ? "#eef4ff" : "transparent",
      }}
    >
      {words.map((word) => (
        <span
          key={word}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={`Return ${word} to the bank`}
          onClick={() => !disabled && onReturn(word, false)}
          onKeyDown={(event) => activateKey(event, () => onReturn(word, true))}
          style={{
            borderRadius: "8px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            cursor: disabled ? "default" : "pointer",
            background: "white",
          }}
        >
          {word}
        </span>
      ))}
      {preview && (
        <span className="keyboard-drag-preview-wb-unit9-p2-q2">{preview}</span>
      )}
      {wrong && <span className="input-error-x-wb-unit9-p2-q1">✕</span>}
    </div>
  );
}

const WB_Unit9_Page2_Q2 = () => {
  const [answer, setAnswer] = useState({ 1: [], 2: [] });
  const [lockedSentences, setLockedSentences] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [lines, setLines] = useState([]);
  const [lockedMatches, setLockedMatches] = useState([]);
  const [wrongMatches, setWrongMatches] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [keyboardWord, setKeyboardWord] = useState(null);
  const [keyboardZone, setKeyboardZone] = useState(null);
  const [firstEndpoint, setFirstEndpoint] = useState(null);
  const [focusedEndpoint, setFocusedEndpoint] = useState(null);
  const containerRef = useRef(null);
  const bankRefs = useRef({});
  const zoneRefs = useRef({});
  const controlRefs = useRef({ source: {}, target: {} });
  const dotRefs = useRef({ source: {}, target: {} });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const { activeAudioKey, playAudio } = useUnit9Audio();

  const findRow = (word) => rows.find((row) => row.words.includes(word));
  const wordUsed = (rowId, word) => answer[rowId].includes(word);
  const sentenceLocked = (rowId) =>
    showAnswer || lockedSentences.includes(rowId);
  const matchTargetLocked = (imageId) => {
    const line = lines.find((item) => item.target === imageId);
    return line ? lockedMatches.includes(line.source) : false;
  };

  const addWord = (word, rowId) => {
    if (sentenceLocked(rowId) || wordUsed(rowId, word)) return;
    setAnswer((current) => ({
      ...current,
      [rowId]: [...current[rowId], word],
    }));
    setWrongInputs((current) => current.filter((id) => id !== rowId));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const row = findRow(active.id);
    if (row && over.id === `drop-${row.id}`) addWord(active.id, row.id);
  };

  const focusNextBank = (row, word) => {
    const index = row.words.indexOf(word);
    for (let step = 1; step <= row.words.length; step += 1) {
      const next = row.words[(index + step) % row.words.length];
      if (!wordUsed(row.id, next) && next !== word) {
        requestAnimationFrame(() => bankRefs.current[next]?.focus());
        return;
      }
    }
    requestAnimationFrame(() => bankRefs.current[word]?.focus());
  };

  const pickWord = (word) => {
    const row = findRow(word);
    if (!row || wordUsed(row.id, word) || sentenceLocked(row.id)) return;
    setKeyboardWord(word);
    setKeyboardZone(row.id);
    requestAnimationFrame(() => zoneRefs.current[row.id]?.focus());
  };

  const handleZoneKeyDown = (event, rowId) => {
    if (!keyboardWord) return;
    const row = findRow(keyboardWord);
    if (event.key === "Escape") {
      event.preventDefault();
      const origin = keyboardWord;
      setKeyboardWord(null);
      setKeyboardZone(null);
      requestAnimationFrame(() => bankRefs.current[origin]?.focus());
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      zoneRefs.current[row.id]?.focus();
      return;
    }
    activateKey(event, () => {
      const word = keyboardWord;
      addWord(word, rowId);
      setKeyboardWord(null);
      setKeyboardZone(null);
      focusNextBank(row, word);
    });
  };

  const returnWord = (word, returnFocus) => {
    const row = findRow(word);
    if (!row || sentenceLocked(row.id)) return;
    setAnswer((current) => ({
      ...current,
      [row.id]: current[row.id].filter((item) => item !== word),
    }));
    setWrongInputs((current) => current.filter((id) => id !== row.id));
    if (returnFocus)
      requestAnimationFrame(() => bankRefs.current[word]?.focus());
  };

  const endpointAvailable = (side, id) =>
    side === "source" ? !lockedMatches.includes(id) : !matchTargetLocked(id);
  const oppositeItems = (side) =>
    side === "source"
      ? images.filter((image) => endpointAvailable("target", image.id))
      : rows.filter((row) => endpointAvailable("source", row.id));

  const focusNextOrigin = (side, id) => {
    const items = side === "source" ? rows : images;
    const index = items.findIndex((item) => item.id === id);
    for (let step = 1; step <= items.length; step += 1) {
      const next = items[(index + step) % items.length];
      if (endpointAvailable(side, next.id)) {
        requestAnimationFrame(() =>
          controlRefs.current[side][next.id]?.focus(),
        );
        return;
      }
    }
  };

  const commitMatch = (first, second) => {
    const source = first.side === "source" ? first.id : second.id;
    const target = first.side === "target" ? first.id : second.id;
    const displaced = lines.find((line) => line.target === target)?.source;
    setLines((current) =>
      current
        .filter((line) => line.source !== source && line.target !== target)
        .concat({ source, target }),
    );
    setWrongMatches((current) =>
      current.filter((id) => id !== source && id !== displaced),
    );
  };

  const activateEndpoint = (side, id, keyboard) => {
    if (showAnswer || !endpointAvailable(side, id)) return;
    if (!firstEndpoint) {
      setFirstEndpoint({ side, id, keyboard });
      if (keyboard) {
        const next = oppositeItems(side)[0];
        const oppositeSide = side === "source" ? "target" : "source";
        if (next) {
          setFocusedEndpoint({ side: oppositeSide, id: next.id });
          requestAnimationFrame(() =>
            controlRefs.current[oppositeSide][next.id]?.focus(),
          );
        }
      }
      return;
    }
    if (firstEndpoint.side === side) {
      setFirstEndpoint({ side, id, keyboard });
      return;
    }
    const origin = firstEndpoint;
    commitMatch(origin, { side, id });
    setFirstEndpoint(null);
    setFocusedEndpoint(null);
    if (origin.keyboard) focusNextOrigin(origin.side, origin.id);
  };

  const handleEndpointKeyDown = (event, side, id) => {
    if (event.key === "Escape" && firstEndpoint?.keyboard) {
      event.preventDefault();
      const origin = firstEndpoint;
      setFirstEndpoint(null);
      setFocusedEndpoint(null);
      requestAnimationFrame(() =>
        controlRefs.current[origin.side][origin.id]?.focus(),
      );
      return;
    }
    if (
      event.key === "Tab" &&
      firstEndpoint?.keyboard &&
      firstEndpoint.side !== side
    ) {
      event.preventDefault();
      const items = oppositeItems(firstEndpoint.side);
      const index = items.findIndex((item) => item.id === id);
      const direction = event.shiftKey ? -1 : 1;
      const next = items[(index + direction + items.length) % items.length];
      if (next) {
        setFocusedEndpoint({ side, id: next.id });
        controlRefs.current[side][next.id]?.focus();
      }
      return;
    }
    activateKey(event, () => activateEndpoint(side, id, true));
  };

  const getDotCenter = (side, id) => {
    const dot = dotRefs.current[side][id];
    const container = containerRef.current;
    if (!dot || !container) return { x: 0, y: 0 };
    const rect = dot.getBoundingClientRect();
    const parent = container.getBoundingClientRect();
    return {
      x: rect.left - parent.left + rect.width / 2,
      y: rect.top - parent.top + rect.height / 2,
    };
  };

  const checkAnswers = () => {
    if (
      showAnswer ||
      (lockedSentences.length === rows.length &&
        lockedMatches.length === rows.length)
    )
      return;
    if (rows.some((row) => answer[row.id].length !== row.words.length)) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }
    if (lines.length < rows.length) {
      ValidationAlert.info("Oops!", "Please match all pairs before checking.");
      return;
    }
    const correctSentenceIds = rows
      .filter(
        (row) =>
          answer[row.id].join(" ").toLowerCase() ===
          row.correct.join(" ").toLowerCase(),
      )
      .map((row) => row.id);
    const correctMatchIds = lines
      .filter((line) => correctMatches[line.source] === line.target)
      .map((line) => line.source);
    setLockedSentences(correctSentenceIds);
    setWrongInputs(
      rows
        .map((row) => row.id)
        .filter((id) => !correctSentenceIds.includes(id)),
    );
    setLockedMatches(correctMatchIds);
    setWrongMatches(
      rows.map((row) => row.id).filter((id) => !correctMatchIds.includes(id)),
    );
    const score = correctSentenceIds.length + correctMatchIds.length;
    const total = rows.length * 2;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const message = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  const handleShowAnswer = () => {
    setAnswer(Object.fromEntries(rows.map((row) => [row.id, row.correct])));
    setLines(
      rows.map((row) => ({ source: row.id, target: correctMatches[row.id] })),
    );
    setLockedSentences(rows.map((row) => row.id));
    setLockedMatches(rows.map((row) => row.id));
    setWrongInputs([]);
    setWrongMatches([]);
    setShowAnswer(true);
    setKeyboardWord(null);
    setFirstEndpoint(null);
    setFocusedEndpoint(null);
  };

  const handleReset = () => {
    setAnswer({ 1: [], 2: [] });
    setLines([]);
    setLockedSentences([]);
    setLockedMatches([]);
    setWrongInputs([]);
    setWrongMatches([]);
    setShowAnswer(false);
    setKeyboardWord(null);
    setKeyboardZone(null);
    setFirstEndpoint(null);
    setFocusedEndpoint(null);
  };

  const previewLine =
    firstEndpoint?.keyboard && focusedEndpoint
      ? {
          start: getDotCenter(firstEndpoint.side, firstEndpoint.id),
          end: getDotCenter(focusedEndpoint.side, focusedEndpoint.id),
        }
      : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
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
        <div className="div-forall" style={{ gap: "50px" }}>
          <ExerciseHeader
            sectionLetter="D"
            title="Unscramble, write, and match."
            subTitle="Arrange the words, then connect each sentence to the matching picture."
          />
          <div className="container12-wb-unit9-p2-q1 w-full" ref={containerRef}>
            {rows.map((row, rowIndex) => {
              const image = images[rowIndex];
              return (
                <div className="matching-row2" key={row.id}>
                  <div>
                    <div className="word-with-dot2">
                      <span className="span-num2-wb-unit7-p2-q1">{row.id}</span>
                      <div style={{ flex: 1 }}>
                        <span
                          ref={(element) => {
                            controlRefs.current.source[row.id] = element;
                          }}
                          className={`word-text2-review3-p1-q2 wb-unit9-audio-control ${firstEndpoint?.side === "source" && firstEndpoint.id === row.id ? "selected-item" : ""} ${lockedMatches.includes(row.id) || showAnswer ? "disabled-word" : ""}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`Match ${row.label}`}
                          onClick={() => {
                            playAudio(`main-${row.id}`, row.audio);
                            activateEndpoint("source", row.id, false);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ")
                              playAudio(`main-${row.id}`, row.audio);
                            handleEndpointKeyDown(event, "source", row.id);
                          }}
                        >
                          {activeAudioKey === `main-${row.id}` && (
                            <Unit9PlayingAudioIcon />
                          )}
                          {row.label}
                        </span>
                        {wrongMatches.includes(row.id) && (
                          <span className="error-mark-unit9-p2-q2">✕</span>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            padding: "10px",
                            border: "2px dashed #ccc",
                            borderRadius: "10px",
                            marginBottom: "12px",
                            justifyContent: "center",
                            minHeight: "48px",
                            flexWrap: "wrap",
                          }}
                        >
                          {row.words.map((word) => (
                            <BankWord
                              key={word}
                              id={word}
                              word={word}
                              disabled={
                                sentenceLocked(row.id) || wordUsed(row.id, word)
                              }
                              onKeyboardPick={() => pickWord(word)}
                              bankRef={(element) => {
                                bankRefs.current[word] = element;
                              }}
                            />
                          ))}
                        </div>
                        <AnswerZone
                          id={`drop-${row.id}`}
                          words={answer[row.id]}
                          disabled={sentenceLocked(row.id)}
                          wrong={wrongInputs.includes(row.id)}
                          preview={
                            keyboardWord && keyboardZone === row.id
                              ? keyboardWord
                              : ""
                          }
                          keyboardActive={Boolean(keyboardWord)}
                          onReturn={returnWord}
                          onKeyDown={(event) =>
                            handleZoneKeyDown(event, row.id)
                          }
                          zoneRef={(element) => {
                            zoneRefs.current[row.id] = element;
                          }}
                        />
                      </div>
                      <div className="dot-wrapper2">
                        <div
                          ref={(element) => {
                            dotRefs.current.source[row.id] = element;
                          }}
                          className="dot2 start-dot2"
                          data-word={row.label}
                          tabIndex={-1}
                          aria-hidden="true"
                          onClick={() =>
                            activateEndpoint("source", row.id, false)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="img-with-dot2-wb-unit7-p2-q1">
                    <div className="dot-wrapper2">
                      <div
                        ref={(element) => {
                          dotRefs.current.target[image.id] = element;
                        }}
                        className="dot2 end-dot2"
                        data-image={image.id}
                        tabIndex={-1}
                        aria-hidden="true"
                        onClick={() =>
                          activateEndpoint("target", image.id, false)
                        }
                      />
                    </div>
                    <img
                      ref={(element) => {
                        controlRefs.current.target[image.id] = element;
                      }}
                      src={image.src}
                      className={`matched-img2 ${firstEndpoint?.side === "target" && firstEndpoint.id === image.id ? "selected-item" : ""} ${matchTargetLocked(image.id) || showAnswer ? "disabled-hover" : ""}`}
                      alt={image.alt}
                      role="button"
                      tabIndex={
                        endpointAvailable("target", image.id) && !showAnswer
                          ? 0
                          : -1
                      }
                      aria-label={`Match ${image.alt}`}
                      onClick={() =>
                        activateEndpoint("target", image.id, false)
                      }
                      onKeyDown={(event) =>
                        handleEndpointKeyDown(event, "target", image.id)
                      }
                      style={{
                        cursor:
                          matchTargetLocked(image.id) || showAnswer
                            ? "default"
                            : "pointer",
                        height: "130px",
                        width: "auto",
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <svg className="lines-layer2" aria-hidden="true">
              {lines.map((line) => {
                const start = getDotCenter("source", line.source);
                const end = getDotCenter("target", line.target);
                return (
                  <line
                    key={line.source}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="red"
                    strokeWidth="3"
                  />
                );
              })}
              {previewLine && (
                <line
                  x1={previewLine.start.x}
                  y1={previewLine.start.y}
                  x2={previewLine.end.x}
                  y2={previewLine.end.y}
                  stroke="red"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              )}
            </svg>
          </div>

          <div className="action-buttons-container">
            <button
              type="button"
              onClick={handleReset}
              className="try-again-button"
            >
              Start Again ↻
            </button>
            <button
              type="button"
              onClick={handleShowAnswer}
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
      </div>
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
              padding: "5px 10px",
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

export default WB_Unit9_Page2_Q2;
