import React, { useRef, useState } from "react";

import "./WB_Unit2_Page2_Q1.css";

import table from "../../../assets/U1 WB/U2/U2P10EXEC-01.svg";
import dish from "../../../assets/U1 WB/U2/U2P10EXEC-02.svg";
import tiger from "../../../assets/U1 WB/U2/U2P10EXEC-03.svg";
import duck from "../../../assets/U1 WB/U2/U2P10EXEC-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// ======================================================
// AUDIO
// ======================================================

import audio1 from "../../../assets/U1 WB/U2/page_10/Item_001_birthday_Happy!.mp3";
import audio2 from "../../../assets/U1 WB/U2/page_10/Item_002_a_hat_party_It's.mp3";
import audio3 from "../../../assets/U1 WB/U2/page_10/Item_003_are_How_you_old.mp3";
import audio4 from "../../../assets/U1 WB/U2/page_10/Item_004_seven_I'm_years_old.mp3";

// ======================================================
// DATA
// ======================================================

const rows = [
  {
    id: 1,
    img: table,

    scrambled: ["birthday", "Happy", "!"],

    audio: audio1,
  },

  {
    id: 2,
    img: dish,

    scrambled: ["a", "hat", "party", "It's", "."],

    audio: audio2,
  },

  {
    id: 3,
    img: duck,

    scrambled: ["are", "How", "you", "old", "?"],

    audio: audio3,
  },

  {
    id: 4,
    img: tiger,

    scrambled: ["seven", "I'm", "years", "old", "."],

    audio: audio4,
  },
];

// ======================================================
// CORRECT SENTENCES
// ======================================================

const correctSentences = {
  1: ["Happy", "birthday", "!"],

  2: ["It's", "a", "party", "hat", "."],

  3: ["How", "old", "are", "you", "?"],

  4: ["I'm", "seven", "years", "old", "."],
};

// ======================================================
// EMPTY
// ======================================================

const createEmptyAnswers = () => ({
  1: [],
  2: [],
  3: [],
  4: [],
});

// ======================================================
// BUILD SENTENCE
// ======================================================

const buildSentence = (words) => {
  let sentence = "";

  words.forEach((word) => {
    if (/^[!?.،,;:]$/.test(word)) {
      sentence += word;
    } else {
      if (sentence) {
        sentence += " ";
      }

      sentence += word;
    }
  });

  return sentence;
};

// ======================================================
// DRAGGABLE WORD
// ======================================================

function DraggableWord({ id, word, disabled, isUsed }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    disabled: disabled || isUsed,
  });

  return (
    <span
      ref={setNodeRef}
      {...(!disabled && !isUsed
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      style={{
        padding: "2px 5px",

        border: "2px solid #2c5287",

        borderRadius: "8px",

        background: "white",

        fontWeight: "bold",

        cursor: disabled || isUsed ? "default" : "grab",

        opacity: isDragging ? 0.4 : isUsed || disabled ? 0.45 : 1,
        userSelect: "none",

        touchAction: "none",

        ...(isUsed || disabled
          ? {
              borderColor: "#ccc",
              color: "#aaa",
              background: "#f5f5f5",
            }
          : {}),
      }}
    >
      {word}
    </span>
  );
}

// ======================================================
// DROPPABLE INPUT
// ======================================================

function DroppableInput({ id, words, isWrong, showAnswer, locked, onRemove }) {
  const { isOver, setNodeRef } = useDroppable({
    id,

    disabled: showAnswer || locked,
  });

  return (
    <div
      style={{
        position: "relative",

        width: "100%",
      }}
    >
      <div
        ref={setNodeRef}
        className={`unscramble-input ${
          isOver && !showAnswer && !locked ? "drag-over-cell" : ""
        }`}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          alignItems: "center",
          minHeight: "46px",

          // ✅ هون
          padding: "6px 10px",

          cursor: "default",
          boxSizing: "border-box",
        }}
      >
        {words.map((item, index) => {
          const canReturn = !showAnswer && !locked;

          return (
            <span
              key={`${item.sourceIndex}-${index}`}
              onClick={() => {
                if (canReturn) {
                  onRemove(id, index);
                }
              }}
              title={canReturn ? "Click to return" : ""}
              style={{
                cursor: canReturn ? "pointer" : "default",

                borderRadius: "6px",

                padding: "2px 5px",

                border: canReturn
                  ? "1px solid #2c5287"
                  : "1px solid transparent",

                background: canReturn ? "#f4f8ff" : "transparent",

                transition: "all 0.2s ease",

                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (canReturn) {
                  e.currentTarget.style.background = "#e7f0ff";

                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (canReturn) {
                  e.currentTarget.style.background = "#f4f8ff";

                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>

      {isWrong && <span className="input-error-x-wb-u2-p2-q1">✕</span>}
    </div>
  );
}

// ======================================================
// MAIN
// ======================================================

const WB_Unit2_Page2_Q1 = () => {
  // ======================================================
  // STATE
  // ======================================================

  const [userInputs, setUserInputs] = useState(createEmptyAnswers());

  const [wrongInputs, setWrongInputs] = useState([]);

  // الصح فقط يتقفل
  const [lockedRows, setLockedRows] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // true فقط لما كل شيء صح
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  // ======================================================
  // AUDIO
  // ======================================================

  const audioRef = useRef(null);

  const [playingRow, setPlayingRow] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingRow(null);
  };

  const playRowAudio = (row) => {
    if (!row?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(row.audio);

    audioRef.current = audio;

    setPlayingRow(row.id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingRow(null);
    };
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const isRowLocked = (rowId) => lockedRows.includes(Number(rowId));

  // ======================================================
  // SENSORS
  // ======================================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,

        tolerance: 5,
      },
    }),
  );

  // ======================================================
  // PARSE DRAG ID
  // id format:
  // row-1-word-0
  // ======================================================

  const parseId = (id) => {
    const parts = String(id).split("-");

    return {
      sentenceId: Number(parts[1]),

      sourceIndex: Number(parts[parts.length - 1]),
    };
  };

  // ======================================================
  // DRAG START
  // ======================================================

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // ======================================================
  // DRAG END
  // ======================================================

  const handleDragEnd = (event) => {
    setActiveId(null);

    const { active, over } = event;

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("blank-")) {
      return;
    }

    const { sentenceId, sourceIndex } = parseId(active.id);

    const targetSentence = Number(String(over.id).replace("blank-", ""));

    /*
      كل كلمات السؤال تروح
      فقط لنفس السؤال.
    */

    if (sentenceId !== targetSentence) {
      return;
    }

    if (isRowLocked(targetSentence)) {
      return;
    }

    const row = rows.find((item) => item.id === sentenceId);

    if (!row) {
      return;
    }

    const word = row.scrambled[sourceIndex];

    /*
      نمنع استخدام نفس token مرتين.
      مش حسب نص الكلمة،
      حسب index تبعها.
    */

    const alreadyUsed = userInputs[targetSentence].some(
      (item) => item.sourceIndex === sourceIndex,
    );

    if (alreadyUsed) {
      return;
    }

    setUserInputs((prev) => ({
      ...prev,

      [targetSentence]: [
        ...prev[targetSentence],

        {
          word,
          sourceIndex,
        },
      ],
    }));

    /*
      شيل X فقط عن نفس السؤال.
    */

    setWrongInputs((prev) => prev.filter((id) => id !== targetSentence));
  };

  // ======================================================
  // CLEAR ONE WORD
  // ======================================================

  const handleClear = (cellId, answerIndex) => {
    const sentenceId = Number(String(cellId).replace("blank-", ""));

    if (showAnswer || checkCompleted || isRowLocked(sentenceId)) {
      return;
    }

    setUserInputs((prev) => {
      const updated = [...prev[sentenceId]];

      updated.splice(answerIndex, 1);

      return {
        ...prev,

        [sentenceId]: updated,
      };
    });

    setWrongInputs((prev) => prev.filter((id) => id !== sentenceId));
  };

  // ======================================================
  // CHECK
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
        لازم كل جملة تحتوي كل الكلمات.
      */

    const allCompleted = rows.every(
      (row) => userInputs[row.id].length === row.scrambled.length,
    );

    if (!allCompleted) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");

      return;
    }

    let correctCount = 0;

    const wrongTemp = [];

    const correctTemp = [];

    rows.forEach((row) => {
      const userSentence = userInputs[row.id].map((item) => item.word);

      const correct = correctSentences[row.id];

      const isCorrect =
        userSentence.length === correct.length &&
        userSentence.every((word, index) => word === correct[index]);

      if (isCorrect) {
        correctCount++;

        correctTemp.push(row.id);
      } else {
        wrongTemp.push(row.id);
      }
    });

    // ====================================================
    // LOCK CORRECT ONLY
    // ====================================================

    setLockedRows((prev) => Array.from(new Set([...prev, ...correctTemp])));

    // ====================================================
    // WRONG ONLY
    // ====================================================

    setWrongInputs(wrongTemp);

    const total = rows.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    // ====================================================
    // ALL CORRECT
    // ====================================================

    if (correctCount === total) {
      setLockedRows(rows.map((row) => row.id));

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

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const handleShowAnswer = () => {
    stopAudio();

    const finalAnswers = {};

    rows.forEach((row) => {
      finalAnswers[row.id] = correctSentences[row.id].map((word, index) => ({
        word,

        /*
                  sourceIndex مش مهم فعليًا
                  في Show Answer،
                  بس نعطيه قيمة unique.
                */
        sourceIndex: 100 + index,
      }));
    });

    setUserInputs(finalAnswers);

    setWrongInputs([]);

    setLockedRows(rows.map((row) => row.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ======================================================
  // RESET
  // ======================================================

  const handleReset = () => {
    stopAudio();

    setUserInputs(createEmptyAnswers());

    setWrongInputs([]);

    setLockedRows([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveId(null);
  };

  // ======================================================
  // ACTIVE WORD
  // ======================================================

  let activeWord = null;

  if (activeId) {
    const { sentenceId, sourceIndex } = parseId(activeId);

    const row = rows.find((item) => item.id === sentenceId);

    activeWord = row?.scrambled[sourceIndex] ?? null;
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <DndContext
      sensors={sensors}
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
            gap: "30px",
          }}
        >
          <ExerciseHeader
            sectionLetter="C"
            title="Unscramble and write."
            subTitle="Start with the capital word and finish with the correct punctuation."
          />

          <div className="container12 w-full">
            {rows.map((row, index) => {
              const rowLocked = isRowLocked(row.id);

              const isPlaying = playingRow === row.id;

              const usedIndexes = new Set(
                userInputs[row.id].map((item) => item.sourceIndex),
              );

              return (
                <div key={row.id} className="matching-row2 w-full">
                  <div
                    style={{
                      display: "flex",

                      width: "100%",

                      justifyContent: "space-between",
                    }}
                  >
                    {/* ======================================
                          IMAGE
                      ====================================== */}

                    <div className="img-with-dot2">
                      <span className="span-num2">{index + 1}</span>

                      <img
                        src={row.img}
                        alt=""
                        style={{
                          height: "100px",

                          width: "auto",
                        }}
                      />
                    </div>

                    {/* ======================================
                          SCRAMBLED + BANK
                      ====================================== */}

                    <div className="word-with-dot2-wb-u2-p2-q1">
                      <div className="word-bank-container-wb-u2-p2-q1">
                        {/* ==================================
                              SCRAMBLED SENTENCE AUDIO
                          ================================== */}

                        <div
                          onClick={() => playRowAudio(row)}
                          style={{
                            position: "relative",

                            display: "inline-block",

                            cursor: "pointer",

                            border: "2px solid transparent",

                            borderRadius: "8px",

                            padding: "4px 6px",

                            transition: "border-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#2c5287";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "transparent";
                          }}
                        >
                          <span className="word-text2-wb-u2-p2-q1">
                            {row.scrambled.join(" ")}
                          </span>

                          {isPlaying && (
                            <FaVolumeUp
                              size={17}
                              aria-hidden="true"
                              style={{
                                position: "absolute",

                                top: "-8px",

                                right: "-8px",

                                background: "white",

                                borderRadius: "50%",

                                padding: "2px",

                                zIndex: 5,

                                pointerEvents: "none",
                              }}
                            />
                          )}
                        </div>

                        {/* ==================================
                              DRAGGABLE BANK
                          ================================== */}

                        <div
                          style={{
                            display: "flex",

                            gap: "10px",

                            padding: "10px",

                            border: "2px dashed #ccc",

                            borderRadius: "10px",

                            alignItems: "center",

                            width: "300px",

                            justifyContent: "center",

                            flexWrap: "wrap",
                          }}
                        >
                          {row.scrambled.map((word, i) => (
                            <DraggableWord
                              key={`${row.id}-${word}-${i}`}
                              id={`row-${row.id}-word-${i}`}
                              word={word}
                              disabled={
                                showAnswer || checkCompleted || rowLocked
                              }
                              isUsed={usedIndexes.has(i)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* ======================================
                            DROP ANSWER
                        ====================================== */}

                      <DroppableInput
                        id={`blank-${row.id}`}
                        words={userInputs[row.id]}
                        isWrong={wrongInputs.includes(row.id)}
                        showAnswer={showAnswer}
                        locked={rowLocked}
                        onRemove={handleClear}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord && (
          <span
            style={{
              padding: "2px 5px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              cursor: "grabbing",

              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {activeWord}
          </span>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit2_Page2_Q1;
