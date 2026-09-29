import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

// ======================================================
// AUDIO
// ======================================================

import sentence1Audio from "../../../assets/U1 WB/U1/page_3/Item_001_morning_Good!.mp3";
import sentence2Audio from "../../../assets/U1 WB/U1/page_3/Item_002_you_How_are.mp3";
import sentence3Audio from "../../../assets/U1 WB/U1/page_3/Item_003_you_Fine,_thank.mp3";
import sentence4Audio from "../../../assets/U1 WB/U1/page_3/Item_005_evening_Good!.mp3";
import sentence5Audio from "../../../assets/U1 WB/U1/page_3/Item_009_I'm_John._Hello!.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ======================================================
// DATA
// ======================================================

const data = [
  {
    scrambled: "morning Good !",
    answer: "Good morning!",
    audio: sentence1Audio,
  },
  {
    scrambled: "you How are ?",
    answer: "How are you?",
    audio: sentence2Audio,
  },
  {
    scrambled: "you Fine , thank .",
    answer: "Fine, thank you.",
    audio: sentence3Audio,
  },
  {
    scrambled: "evening Good !",
    answer: "Good evening!",
    audio: sentence4Audio,
  },
  {
    scrambled: "I'm John . Hello !",
    answer: "Hello! I'm John.",
    audio: sentence5Audio,
  },
];

const PUNCTUATION = new Set([".", ",", "!", "?", ";", ":"]);

const joinWords = (words) => {
  if (!words.length) return "";

  return words.reduce((acc, word) => {
    if (!acc) return word;

    if (PUNCTUATION.has(word)) {
      return `${acc}${word}`;
    }

    return `${acc} ${word}`;
  });
};

// ======================================================
// WORD CHIP
// ======================================================

const WordChip = ({
  id,
  word,
  disabled,
  keyboardSelected,
  onKeyboardSelect,
  registerRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });

  const isKeyboardSelected = keyboardSelected === id;

  const anotherWordIsSelected = keyboardSelected && !isKeyboardSelected;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerRef) {
      registerRef(id, node);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardSelect(id);
    }
  };

  return (
    <span
      ref={setRefs}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={disabled || anotherWordIsSelected ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={isKeyboardSelected}
      aria-label={
        isKeyboardSelected
          ? `${word}. Selected. Press Enter again to place it.`
          : `${word}. Press Enter or Space to select.`
      }
      onKeyDown={handleKeyDown}
      style={{
        padding: "2px 5px",

        border: `2px solid ${
          isKeyboardSelected ? "#2563eb" : disabled ? "#b0b0b0" : "#2c5287"
        }`,

        borderRadius: "8px",

        background: isKeyboardSelected
          ? "#dbeafe"
          : disabled
            ? "#e0e0e0"
            : "white",

        fontWeight: "bold",

        color: disabled ? "#999" : undefined,

        cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",

        opacity: isDragging ? 0.35 : 1,

        transition: "all 0.2s",

        userSelect: "none",
        touchAction: "none",

        display: "inline-block",

        pointerEvents: disabled ? "none" : undefined,

        outline: isKeyboardSelected ? "3px solid #2563eb" : undefined,

        outlineOffset: "3px",
      }}
    >
      {word}
    </span>
  );
};

// ======================================================
// ANSWER DROP ZONE
// ======================================================

const AnswerDropZone = ({
  id,
  wordList,
  isWrong,
  showAnswer,
  answerText,
  locked,
  onRemove,

  keyboardSelected,
  selectedSentenceIndex,
  selectedWord,

  onKeyboardDrop,
  registerDropRef,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const dropSentenceIndex = Number(id.replace("blank-", ""));

  const isKeyboardTarget =
    Boolean(keyboardSelected) && selectedSentenceIndex === dropSentenceIndex;

  const setRefs = (node) => {
    setNodeRef(node);

    if (registerDropRef) {
      registerDropRef(id, node);
    }
  };

  if (showAnswer) {
    return (
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          className="missing-input-wb-unit1-p3-q1"
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0px",
          }}
        >
          {answerText}
        </div>
      </div>
    );
  }

  const handleDropKeyDown = (e) => {
    if (locked || !keyboardSelected || !isKeyboardTarget) {
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(id);
    }
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        ref={setRefs}
        role="button"
        tabIndex={
          locked ? -1 : keyboardSelected ? (isKeyboardTarget ? 0 : -1) : 0
        }
        aria-label={
          isKeyboardTarget
            ? `Answer box for sentence ${
                dropSentenceIndex + 1
              }. Press Enter or Space to place ${selectedWord}.`
            : wordList.length
              ? "Answer box. Contains selected words."
              : "Empty answer box."
        }
        onKeyDown={handleDropKeyDown}
        className={`missing-input-wb-unit1-p3-q1${
          isOver ? " drag-over-cell" : ""
        }`}
        style={{
          background: isKeyboardTarget
            ? "#eff6ff"
            : isOver
              ? "#e3f2fd"
              : undefined,

          outline: isKeyboardTarget ? "3px solid #2563eb" : undefined,

          outlineOffset: "3px",

          transition: "background 0.15s, outline 0.15s",

          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",

          gap: "4px",

          minHeight: "38px",

          cursor: isKeyboardTarget ? "pointer" : "default",

          position: "relative",
        }}
      >
        {/* الكلمات اللي انحطت */}

        {wordList.map((entry, idx) => {
          const isPunct = PUNCTUATION.has(entry.word);

          return (
            <span
              key={`${entry.wordIndex}-${idx}`}
              role={!locked ? "button" : undefined}
              tabIndex={!locked && !keyboardSelected ? 0 : -1}
              aria-label={
                !locked
                  ? `${entry.word}. Press Enter or Space to return this word.`
                  : undefined
              }
              title={!locked ? "Click to remove" : ""}
              onClick={(e) => {
                e.stopPropagation();

                if (!locked) {
                  onRemove(id, entry.wordIndex);
                }
              }}
              onKeyDown={(e) => {
                if (locked) return;

                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();

                  onRemove(id, entry.wordIndex);
                }
              }}
              style={{
                borderRadius: "6px",

                fontSize: "18px",

                cursor: locked ? "default" : "pointer",

                userSelect: "none",

                marginLeft: isPunct ? "-4px" : "0px",

                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!locked) {
                  e.currentTarget.style.background = "#ffe0e0";
                }
              }}
              onMouseLeave={(e) => {
                if (!locked) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {entry.word}
            </span>
          );
        })}

        {/* Preview للكلمة المختارة */}

        {isKeyboardTarget && selectedWord && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",

              alignItems: "center",

              justifyContent: "center",

              minWidth: `${Math.max(selectedWord.length * 10, 55)}px`,

              height: "32px",

              padding: "2px 10px",

              border: "2px dashed #2563eb",

              borderRadius: "7px",

              color: "#2563eb",

              background: "rgba(219,234,254,0.45)",

              fontWeight: "600",

              animation:
                "keyboardDropPulse 0.8s ease-in-out infinite alternate",

              pointerEvents: "none",
            }}
          >
            {selectedWord}
          </span>
        )}
      </div>

      {isWrong && <div className="wrong-icon-wb-unit1-p3-q1">✕</div>}
    </div>
  );
};

// ======================================================
// MAIN
// ======================================================

const WB_Unit1_Page3_Q1 = () => {
  const [wordLists, setWordLists] = useState(data.map(() => []));

  const [showAnswer, setShowAnswer] = useState(false);

  const [wrong, setWrong] = useState(data.map(() => false));

  const [activeId, setActiveId] = useState(null);

  const [keyboardSelected, setKeyboardSelected] = useState(null);

  const [locked, setLocked] = useState(false);

  const [announcement, setAnnouncement] = useState("");

  // ====================================================
  // AUDIO STATE
  // ====================================================

  const audioRef = useRef(null);

  const [playingSentence, setPlayingSentence] = useState(null);

  const playSentenceAudio = (index) => {
    const src = data[index]?.audio;

    if (!src) return;

    // وقف الصوت السابق
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingSentence(index);

    audio.play();

    audio.onended = () => {
      setPlayingSentence(null);
    };

    audio.onerror = () => {
      setPlayingSentence(null);
    };
  };

  // refs الكلمات
  const wordRefs = useRef({});

  // refs inputs
  const dropRefs = useRef({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // ====================================================
  // PARSE ID
  // ====================================================

  const parseId = (id) => {
    const parts = String(id).split("-");

    const sentenceIndex = Number(parts[0]);

    const wordIndex = Number(parts[parts.length - 1]);

    const word = parts.slice(1, -1).join("-");

    return {
      sentenceIndex,
      word,
      wordIndex,
    };
  };

  const activeWord = activeId ? parseId(activeId).word : null;

  const selectedData = keyboardSelected ? parseId(keyboardSelected) : null;

  const selectedSentenceIndex = selectedData?.sentenceIndex ?? null;

  const selectedWord = selectedData?.word ?? null;

  // ====================================================
  // USED WORDS
  // ====================================================

  const usedWordsPerSentence = data.map((item, i) =>
    wordLists[i].map((entry) => entry.wordIndex),
  );

  const isWordUsed = (sentenceIndex, wordIndex) =>
    usedWordsPerSentence[sentenceIndex].includes(wordIndex);

  // ====================================================
  // REFS
  // ====================================================

  const registerWordRef = (id, node) => {
    if (node) {
      wordRefs.current[id] = node;
    } else {
      delete wordRefs.current[id];
    }
  };

  const registerDropRef = (id, node) => {
    if (node) {
      dropRefs.current[id] = node;
    } else {
      delete dropRefs.current[id];
    }
  };

  // ====================================================
  // FOCUS NEXT WORD
  // ====================================================

  const focusNextAvailableWord = (
    currentSentence,
    currentWordIndex,
    updatedWordLists,
  ) => {
    window.setTimeout(() => {
      const currentWords = data[currentSentence].scrambled.split(/\s+/);

      // بعد الحالية بنفس السؤال
      for (
        let index = currentWordIndex + 1;
        index < currentWords.length;
        index++
      ) {
        const used = updatedWordLists[currentSentence].some(
          (entry) => entry.wordIndex === index,
        );

        if (!used) {
          const id = `${currentSentence}-${currentWords[index]}-${index}`;

          const element = wordRefs.current[id];

          if (element) {
            element.focus();
            return;
          }
        }
      }

      // ارجع لبداية نفس السؤال
      for (let index = 0; index < currentWordIndex; index++) {
        const used = updatedWordLists[currentSentence].some(
          (entry) => entry.wordIndex === index,
        );

        if (!used) {
          const id = `${currentSentence}-${currentWords[index]}-${index}`;

          const element = wordRefs.current[id];

          if (element) {
            element.focus();
            return;
          }
        }
      }

      // السؤال اللي بعده
      for (
        let sentenceIndex = currentSentence + 1;
        sentenceIndex < data.length;
        sentenceIndex++
      ) {
        const words = data[sentenceIndex].scrambled.split(/\s+/);

        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
          const used = updatedWordLists[sentenceIndex].some(
            (entry) => entry.wordIndex === wordIndex,
          );

          if (!used) {
            const id = `${sentenceIndex}-${words[wordIndex]}-${wordIndex}`;

            const element = wordRefs.current[id];

            if (element) {
              element.focus();
              return;
            }
          }
        }
      }
    }, 0);
  };

  // ====================================================
  // DRAG
  // ====================================================

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || locked) {
      return;
    }

    const { sentenceIndex, word, wordIndex } = parseId(active.id);

    const destId = String(over.id);

    if (!destId.startsWith("blank-")) {
      return;
    }

    const destSentence = Number(destId.replace("blank-", ""));

    if (sentenceIndex !== destSentence) {
      return;
    }

    if (isWordUsed(sentenceIndex, wordIndex)) {
      return;
    }

    setWordLists((prev) => {
      const updated = prev.map((list) => [...list]);

      updated[sentenceIndex] = [
        ...updated[sentenceIndex],

        {
          word,
          wordIndex,
        },
      ];

      return updated;
    });

    setWrong(data.map(() => false));
  };

  // ====================================================
  // KEYBOARD SELECT
  // ====================================================

  const handleKeyboardSelect = (id) => {
    if (showAnswer || locked) {
      return;
    }

    const { word, sentenceIndex } = parseId(id);

    setKeyboardSelected(id);

    setAnnouncement(`${word} selected. Press Enter again to place it.`);

    // مباشرة على input نفس السؤال
    window.setTimeout(() => {
      const dropId = `blank-${sentenceIndex}`;

      const dropElement = dropRefs.current[dropId];

      if (dropElement) {
        dropElement.focus();
      }
    }, 0);
  };

  // ====================================================
  // KEYBOARD DROP
  // ====================================================

  const handleKeyboardDrop = (dropId) => {
    if (!keyboardSelected || showAnswer || locked) {
      return;
    }

    const { sentenceIndex, word, wordIndex } = parseId(keyboardSelected);

    const destSentence = Number(dropId.replace("blank-", ""));

    if (sentenceIndex !== destSentence) {
      return;
    }

    if (isWordUsed(sentenceIndex, wordIndex)) {
      return;
    }

    let nextWordLists = null;

    setWordLists((prev) => {
      const updated = prev.map((list) => [...list]);

      updated[sentenceIndex] = [
        ...updated[sentenceIndex],

        {
          word,
          wordIndex,
        },
      ];

      nextWordLists = updated;

      return updated;
    });

    setWrong(data.map(() => false));

    setKeyboardSelected(null);

    setAnnouncement(`${word} placed in sentence ${sentenceIndex + 1}.`);

    window.setTimeout(() => {
      if (nextWordLists) {
        focusNextAvailableWord(sentenceIndex, wordIndex, nextWordLists);
      }
    }, 0);
  };

  // ====================================================
  // REMOVE
  // ====================================================

  const handleRemove = (blankId, wordIndex) => {
    if (locked) return;

    const sentenceIndex = Number(blankId.replace("blank-", ""));

    const removedEntry = wordLists[sentenceIndex].find(
      (entry) => entry.wordIndex === wordIndex,
    );

    setWordLists((prev) => {
      const updated = prev.map((list) => [...list]);

      updated[sentenceIndex] = updated[sentenceIndex].filter(
        (entry) => entry.wordIndex !== wordIndex,
      );

      return updated;
    });

    setWrong(data.map(() => false));

    setKeyboardSelected(null);

    if (removedEntry) {
      setAnnouncement(`${removedEntry.word} returned to word bank.`);
    }

    window.setTimeout(() => {
      if (!removedEntry) return;

      const id = `${sentenceIndex}-${removedEntry.word}-${wordIndex}`;

      const element = wordRefs.current[id];

      if (element) {
        element.focus();
      }
    }, 0);
  };

  // ====================================================
  // CHECK
  // ====================================================

  const checkAnswers = () => {
    if (showAnswer || locked) {
      return;
    }

    const inputs = wordLists.map((list) =>
      joinWords(list.map((entry) => entry.word)),
    );

    if (inputs.some((value) => value.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );

      return;
    }

    let correct = 0;

    const wrongStatus = inputs.map((value, index) => {
      const ok =
        value.trim().toLowerCase() === data[index].answer.toLowerCase();

      if (ok) {
        correct++;
      }

      return !ok;
    });

    setWrong(wrongStatus);

    setLocked(true);

    setKeyboardSelected(null);

    const total = data.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) {
      ValidationAlert.success(msg);
    } else if (correct === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  // ====================================================
  // SHOW ANSWER
  // ====================================================

  const handleShowAnswer = () => {
    setShowAnswer(true);

    setKeyboardSelected(null);

    setAnnouncement("Correct answers are displayed.");
  };

  // ====================================================
  // RESET
  // ====================================================

  const reset = () => {
    // وقف أي صوت
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingSentence(null);

    setWordLists(data.map(() => []));

    setWrong(data.map(() => false));

    setShowAnswer(false);

    setLocked(false);

    setKeyboardSelected(null);

    setActiveId(null);

    setAnnouncement("Activity reset.");

    window.setTimeout(() => {
      const firstWords = data[0].scrambled.split(/\s+/);

      if (!firstWords.length) {
        return;
      }

      const firstId = `0-${firstWords[0]}-0`;

      const element = wordRefs.current[firstId];

      if (element) {
        element.focus();
      }
    }, 0);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      <style>
        {`
          @keyframes keyboardDropPulse {
            0% {
              opacity: 0.35;
              transform: scale(0.96);
              border-color: #93c5fd;
              background: rgba(219, 234, 254, 0.25);
            }

            100% {
              opacity: 1;
              transform: scale(1);
              border-color: #2563eb;
              background: rgba(219, 234, 254, 0.75);
              box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
            }
          }
        `}
      </style>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="page8-wrapper"
          style={{
            padding: "30px",
          }}
        >
          {/* Screen Reader */}

          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: "absolute",

              width: "1px",
              height: "1px",

              padding: 0,

              margin: "-1px",

              overflow: "hidden",

              clip: "rect(0,0,0,0)",

              whiteSpace: "nowrap",

              border: 0,
            }}
          >
            {announcement}
          </div>

          <div
            className="div-forall mb-10"
            style={{
              gap: "20px",
            }}
          >
            <div className="page8-content w-full">
              <ExerciseHeader
                sectionLetter="A"
                title="Unscramble and write."
                subTitle="Start with the capitalized word, then finish each sentence with the correct punctuation."
              />
            </div>

            {data.map((item, i) => {
              const words = item.scrambled.split(/\s+/);

              const isPlaying = playingSentence === i;

              return (
                <div
                  key={i}
                  style={{
                    marginBottom: "5px",

                    width: "100%",
                  }}
                >
                  {/* ===============================
                        QUESTION + WORD BANK
                    =============================== */}

                  <div className="scrambled-wb-unit1-p3-q1">
                    {/* =============================
                          CLICKABLE SENTENCE AUDIO
                      ============================= */}

                    <div
                      style={{
                        display: "flex",

                        alignItems: "center",

                        gap: "7px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",

                          marginRight: "2px",
                        }}
                      >
                        {i + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => playSentenceAudio(i)}
                        aria-label={`Play sentence ${i + 1}: ${item.scrambled}`}
                        aria-pressed={isPlaying}
                        title="Play audio"
                        style={{
                          border: "none",

                          background: "transparent",

                          padding: "2px",

                          margin: 0,

                          fontSize: "18px",

                          fontFamily: "inherit",

                          color: "inherit",

                          cursor: "pointer",

                          borderRadius: "5px",

                          display: "inline-flex",

                          alignItems: "center",

                          gap: "6px",

                          outline: isPlaying ? "2px solid #2563eb" : undefined,

                          outlineOffset: "3px",

                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#2563eb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "";
                        }}
                      >
                        <span>{item.scrambled}</span>

                        {isPlaying && (
                          <span
                            aria-hidden="true"
                            style={{
                              fontSize: "15px",

                              color: "#2563eb",
                            }}
                          >
                            🔊
                          </span>
                        )}
                      </button>
                    </div>

                    {/* =============================
                          WORD BANK
                      ============================= */}

                    <div
                      style={{
                        display: "flex",

                        gap: "10px",

                        padding: "10px",

                        border: "2px dashed #ccc",

                        borderRadius: "10px",

                        alignItems: "center",

                        flexWrap: "wrap",
                      }}
                    >
                      {words.map((word, index) => {
                        const id = `${i}-${word}-${index}`;

                        const used = isWordUsed(i, index);

                        return (
                          <WordChip
                            key={id}
                            id={id}
                            word={word}
                            disabled={used || showAnswer || locked}
                            keyboardSelected={keyboardSelected}
                            onKeyboardSelect={handleKeyboardSelect}
                            registerRef={registerWordRef}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* ===============================
                        ANSWER
                    =============================== */}

                  <AnswerDropZone
                    id={`blank-${i}`}
                    wordList={wordLists[i]}
                    isWrong={wrong[i]}
                    showAnswer={showAnswer}
                    answerText={item.answer}
                    locked={locked}
                    onRemove={handleRemove}
                    keyboardSelected={keyboardSelected}
                    selectedSentenceIndex={selectedSentenceIndex}
                    selectedWord={selectedWord}
                    onKeyboardDrop={handleKeyboardDrop}
                    registerDropRef={registerDropRef}
                  />
                </div>
              );
            })}
          </div>

          {/* BUTTONS */}

          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              className="show-answer-btn swal-continue"
              onClick={handleShowAnswer}
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>

        {/* DRAG OVERLAY */}

        <DragOverlay>
          {activeWord ? (
            <span
              style={{
                padding: "2px 5px",

                border: "2px solid #2c5287",

                borderRadius: "8px",

                background: "white",

                fontWeight: "bold",

                cursor: "grabbing",

                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

                display: "inline-block",
              }}
            >
              {activeWord}
            </span>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default WB_Unit1_Page3_Q1;
