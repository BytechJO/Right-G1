import React, { useRef, useState } from "react";

import deer from "../../../assets/unit1/imgs/deer flip.svg";
import taxi from "../../../assets/unit1/imgs/taxi_1.svg";
import table from "../../../assets/unit1/imgs/table2.jpg";
import dish from "../../../assets/unit1/imgs/dish3.jpg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Unit2_Page8_Q2.css";

// ===========================================
// SENTENCE AUDIOS
// بدلي الروابط حسب ملفاتك
// ===========================================

import sentence1Audio from "../../../assets/unit2/Page 17 - E/The deer is brown.mp3";
import sentence2Audio from "../../../assets/unit2/Page 17 - E/My brother takes a taxi.mp3";
import sentence3Audio from "../../../assets/unit2/Page 17 - E/The table is round.mp3";
import sentence4Audio from "../../../assets/unit2/Page 17 - E/The dish is white.mp3";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

// ─────────────────────────────────────────────
// Draggable word chip
// ─────────────────────────────────────────────

function DraggableWord({ word, isUsed, disabled }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `word-${word}`,
    disabled: isUsed || disabled,
  });

  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`word-item-unit2-p8-q2 ${isUsed ? "used" : ""}`}
      tabIndex={isUsed || disabled ? -1 : 0}
      aria-disabled={isUsed || disabled}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: "white",
        fontWeight: "bold",
        cursor: isUsed || disabled ? "default" : "grab",
        opacity: isDragging ? 0.4 : 1,
        display: "inline-block",
        touchAction: "none",
      }}
    >
      {word}
    </span>
  );
}

// ─────────────────────────────────────────────
// Droppable inline slot
// ─────────────────────────────────────────────

function DroppableSlot({ id, value, isWrong, locked, showAnswer, onClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: locked || showAnswer,
  });

  return (
    <span className="drop-slot-wrapper-unit2-p8-q2">
      <span
        ref={setNodeRef}
        onClick={value && !locked && !showAnswer ? onClick : undefined}
        className={[
          "drop-slot-inline-unit2-p8-q2",
          isWrong ? "wrong" : "",
          isOver && !locked && !showAnswer ? "drag-over-cell" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          cursor: value && !locked && !showAnswer ? "pointer" : "default",
        }}
      >
        {value}
      </span>

      {isWrong && <span className="error-mark-input">✕</span>}
    </span>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

const Unit2_Page8_Q2 = () => {
  const correctAnswers = ["deer", "taxi", "table", "dish"];

  const rows = [
    {
      before: "The",
      after: "is brown.",
      img: deer,
      alt: "deer",
      audio: sentence1Audio,
    },
    {
      before: "My brother takes a",
      after: ".",
      img: taxi,
      alt: "taxi",
      audio: sentence2Audio,
    },
    {
      before: "The",
      after: "is round.",
      img: table,
      alt: "table",
      audio: sentence3Audio,
    },
    {
      before: "The",
      after: "is white.",
      img: dish,
      alt: "dish",
      audio: sentence4Audio,
    },
  ];

  // ===========================================
  // STATE
  // ===========================================

  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([false, false, false, false]);

  const [lockedRows, setLockedRows] = useState([false, false, false, false]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  const [speakingRow, setSpeakingRow] = useState(null);

  const sentenceAudioRef = useRef(null);

  // ===========================================
  // SENTENCE AUDIO
  // ===========================================

  const stopSentenceAudio = () => {
    if (!sentenceAudioRef.current) {
      setSpeakingRow(null);
      return;
    }

    sentenceAudioRef.current.pause();
    sentenceAudioRef.current.currentTime = 0;

    sentenceAudioRef.current = null;

    setSpeakingRow(null);
  };

  const playSentenceAudio = (index) => {
    if (!lockedRows[index] && !showAnswer) {
      return;
    }

    const src = rows[index]?.audio;

    if (!src) {
      return;
    }

    stopSentenceAudio();

    const audio = new Audio(src);

    sentenceAudioRef.current = audio;

    setSpeakingRow(index);

    audio.play().catch(() => {
      setSpeakingRow(null);
      sentenceAudioRef.current = null;
    });

    audio.onended = () => {
      setSpeakingRow(null);
      sentenceAudioRef.current = null;
    };
  };

  // ===========================================
  // SENSORS
  // ===========================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),

    useSensor(KeyboardSensor),
  );

  // ===========================================
  // DRAG START
  // ===========================================

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  // ===========================================
  // DRAG END
  // ===========================================

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const overId = String(over.id);

    if (!overId.startsWith("slot-")) {
      return;
    }

    const newIndex = Number(overId.split("-")[1]);

    if (lockedRows[newIndex]) {
      return;
    }

    const word = String(active.id).replace("word-", "");

    const updated = [...answers];

    const oldIndex = updated.findIndex((ans) => ans === word);

    if (oldIndex !== -1) {
      if (lockedRows[oldIndex]) {
        return;
      }

      updated[oldIndex] = "";
    }

    updated[newIndex] = word;

    setAnswers(updated);

    setWrongInputs((prev) => {
      const next = [...prev];

      next[newIndex] = false;

      if (oldIndex !== -1) {
        next[oldIndex] = false;
      }

      return next;
    });
  };

  // ===========================================
  // CHECK ANSWERS
  // ===========================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((ans) => ans === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the blanks before checking!",
      );

      return;
    }

    let score = 0;

    const newWrong = [false, false, false, false];

    const newlyLocked = [false, false, false, false];

    answers.forEach((ans, index) => {
      if (ans === correctAnswers[index]) {
        score++;

        newlyLocked[index] = true;
      } else {
        newWrong[index] = true;
      }
    });

    // =========================================
    // LOCK ONLY CORRECT ROWS
    // =========================================

    setLockedRows((prev) =>
      prev.map((locked, index) => locked || newlyLocked[index]),
    );

    // =========================================
    // WRONG X ONLY ON WRONG ROWS
    // =========================================

    setWrongInputs(newWrong);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    // =========================================
    // ALL CORRECT
    // =========================================

    if (score === total) {
      setLockedRows([true, true, true, true]);

      setWrongInputs([false, false, false, false]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  // ===========================================
  // SHOW ANSWER
  // ===========================================

  const showAnswerFun = () => {
    stopSentenceAudio();

    setAnswers([...correctAnswers]);

    setWrongInputs([false, false, false, false]);

    setLockedRows([true, true, true, true]);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ===========================================
  // RESET
  // ===========================================

  const reset = () => {
    stopSentenceAudio();

    setAnswers(["", "", "", ""]);

    setWrongInputs([false, false, false, false]);

    setLockedRows([false, false, false, false]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);
  };

  // ===========================================
  // REMOVE WORD FROM SLOT
  // ===========================================

  const removeWordFromSlot = (index) => {
    if (showAnswer || checkCompleted || lockedRows[index]) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    setWrongInputs((prev) => {
      const next = [...prev];

      next[index] = false;

      return next;
    });
  };

  // ===========================================
  // DRAG OVERLAY WORD
  // ===========================================

  const activeWord = activeId ? String(activeId).replace("word-", "") : null;

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
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
        <div
          className="div-forall"
          style={{
            gap: "20px",
          }}
        >
          <ExerciseHeader
            sectionLetter="E"
            title="Read, look, and write."
            subTitle="Use each picture clue to drag the correct word into the sentence."
          />

          {/* =========================================
              WORD BANK
          ========================================= */}

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
            }}
          >
            {correctAnswers.map((word) => (
              <DraggableWord
                key={word}
                word={word}
                isUsed={answers.includes(word)}
                disabled={showAnswer || checkCompleted}
              />
            ))}
          </div>

          {/* =========================================
              SENTENCES
          ========================================= */}

          <div className="row-content22">
            {rows.map((row, i) => {
              const isLocked = lockedRows[i];

              const canPlaySentence = isLocked || showAnswer;

              const isSpeaking = speakingRow === i;

              return (
                <div key={i} className="row2">
                  <span
                    className="text-[18px]"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span className="num-span">{i + 1}</span>

                    {/* =================================
                        CLICKABLE SENTENCE AUDIO AREA
                    ================================= */}

                    <span
                      onClick={() => {
                        if (canPlaySentence) {
                          playSentenceAudio(i);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!canPlaySentence) {
                          return;
                        }

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          playSentenceAudio(i);
                        }
                      }}
                      role={canPlaySentence ? "button" : undefined}
                      tabIndex={canPlaySentence ? 0 : undefined}
                      aria-label={
                        canPlaySentence ? `Play sentence ${i + 1}` : undefined
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",

                        cursor: canPlaySentence ? "pointer" : "default",
                      }}
                    >
                      <span>{row.before} </span>

                      <DroppableSlot
                        id={`slot-${i}`}
                        value={answers[i]}
                        isWrong={wrongInputs[i]}
                        locked={isLocked || checkCompleted}
                        showAnswer={showAnswer}
                        onClick={() => removeWordFromSlot(i)}
                      />

                      <span>{row.after}</span>

                      {/* =================================
                          AUDIO ICON
                      ================================= */}

                      {canPlaySentence && (
                        <span
                          aria-hidden="true"
                          style={{
                            marginLeft: "7px",
                            fontSize: "18px",

                            transform: isSpeaking ? "scale(1.15)" : "scale(1)",

                            transition: "transform 0.15s ease",
                          }}
                        >
                          <FaVolumeUp
                            size={18}
                            style={{
                              pointerEvents: "none",
                              flexShrink: 0,
                            }}
                          />
                        </span>
                      )}
                    </span>
                  </span>

                  <img src={row.img} alt={row.alt} className="q-img" />
                </div>
              );
            })}
          </div>

          {/* =========================================
              BUTTONS
          ========================================= */}

          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              onClick={showAnswerFun}
              className="show-answer-btn swal-continue"
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          DRAG OVERLAY
      ========================================= */}

      <DragOverlay>
        {activeWord ? (
          <span
            style={{
              padding: "7px 14px",
              border: "2px solid #2c5287",
              borderRadius: "8px",
              background: "white",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit2_Page8_Q2;
