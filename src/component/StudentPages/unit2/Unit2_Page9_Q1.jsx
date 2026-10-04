import React, { useRef, useState } from "react";
import "./Unit2_Page9_Q1.css";

import partyhats from "../../../assets/img_unit2/imgs/party hats..jpg";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";

import presentAudio from "../../../assets/unit2/Page 18 - A/It's a present.mp3";
import partyHatsAudio from "../../../assets/unit2/Page 18 - A/These are party hats.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  useDraggable,
  DragOverlay,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   DRAGGABLE WORD
===================================================== */

const DraggableWord = ({
  id,
  word,
  disabled,
  isUsed,

  keyboardPickedWord,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    data: {
      word,
      source: "bank",
    },

    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked =
    keyboardPickedWord?.word === word && keyboardPickedWord?.source === "bank";

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        bankRefs.current[word] = el;
      }}
      {...(isDisabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${word} selected. Choose a blank and press Enter.`
          : `${word}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (isDisabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(word);
          return;
        }

        listeners?.onKeyDown?.(e);
      }}
      style={{
        padding: "7px 14px",

        border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : isUsed ? "#f0f2f5" : "white",

        fontWeight: "bold",

        cursor: isDisabled ? "default" : "grab",

        opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

        color: isUsed ? "#9aa3b0" : "inherit",

        display: "inline-block",

        transition: "all 0.2s ease",

        userSelect: "none",

        touchAction: "none",
      }}
    >
      {word}
    </span>
  );
};

/* =====================================================
   PLACED WORD
===================================================== */

const PlacedWord = ({
  word,
  slotId,

  locked,
  showAnswer,
  checkCompleted,

  onKeyboardPickPlaced,

  placedRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${slotId}`,

    data: {
      word,
      source: "slot",
      sourceSlotId: slotId,
    },

    disabled: locked || showAnswer || checkCompleted,
  });

  const disabled = locked || showAnswer || checkCompleted;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        placedRefs.current[slotId] = el;
      }}
      {...(disabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? -1 : 0}
      aria-label={
        disabled
          ? undefined
          : `${word}. Press Enter or Space to move this word.`
      }
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPickPlaced(word, slotId);
        }
      }}
      className="placed-word-unit2-p9-q1"
      style={{
        cursor: disabled ? "default" : "grab",

        opacity: isDragging ? 0.4 : 1,

        userSelect: "none",

        display: "inline-flex",

        alignItems: "center",

        gap: "4px",

        touchAction: "none",
      }}
    >
      {word}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  id,
  slotId,

  value,
  wrong,

  showAnswer,
  locked,
  checkCompleted,

  keyboardPickedWord,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,
  placedRefs,

  getAvailableSlotIds,

  onKeyboardDrop,
  onKeyboardPickPlaced,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: showAnswer || locked || checkCompleted,
  });

  const keyboardActive =
    !!keyboardPickedWord && !locked && !showAnswer && !checkCompleted;

  const showKeyboardPreview = keyboardActive && focusedSlotId === id;

  return (
    <div className="flex items-center">
      <span
        ref={(el) => {
          setNodeRef(el);

          slotRefs.current[slotId] = el;
        }}
        className={`drop-slot-inline-unit2-p9-q1 ${
          isOver && !locked && !showAnswer ? "drag-over-cell" : ""
        } ${showKeyboardPreview ? "keyboard-slot-active-p9-q1" : ""}`}
        role={keyboardActive ? "button" : undefined}
        tabIndex={keyboardActive ? 0 : -1}
        aria-label={
          keyboardActive
            ? value
              ? `Blank contains ${value}. Press Enter to place ${keyboardPickedWord.word}.`
              : `Empty blank. Press Enter to place ${keyboardPickedWord.word}.`
            : undefined
        }
        onFocus={(e) => {
          if (!keyboardActive) {
            e.currentTarget.blur();

            setFocusedSlotId(null);

            return;
          }

          setFocusedSlotId(id);
        }}
        onBlur={() => {
          setFocusedSlotId(null);
        }}
        onKeyDown={(e) => {
          if (!keyboardActive) {
            return;
          }

          /* =========================================
             TAB BETWEEN AVAILABLE SLOTS
          ========================================= */

          if (e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();

            const available = getAvailableSlotIds();

            if (available.length === 0) {
              return;
            }

            const currentIndex = available.indexOf(slotId);

            let nextIndex;

            if (e.shiftKey) {
              nextIndex =
                currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
            } else {
              nextIndex =
                currentIndex === -1 || currentIndex === available.length - 1
                  ? 0
                  : currentIndex + 1;
            }

            const nextSlotId = available[nextIndex];

            slotRefs.current[nextSlotId]?.focus();

            return;
          }

          /* =========================================
             ENTER / SPACE = PLACE
          ========================================= */

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardDrop(slotId);
          }
        }}
        style={{
          position: "relative",
        }}
      >
        {showKeyboardPreview ? (
          <span className="keyboard-word-preview-p9-q1" aria-hidden="true">
            {keyboardPickedWord.word}
          </span>
        ) : value ? (
          <PlacedWord
            word={value}
            slotId={slotId}
            locked={locked}
            showAnswer={showAnswer}
            checkCompleted={checkCompleted}
            onKeyboardPickPlaced={onKeyboardPickPlaced}
            placedRefs={placedRefs}
          />
        ) : null}

        {wrong && <span className="error-mark-input1">✕</span>}
      </span>

      <span>{id === "slot-input2" && " ? "}</span>

      <span>{id === "slot-input3" && " a "}</span>
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const Unit2_Page9_Q1 = () => {
  const [answers, setAnswers] = useState({});

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  const placedRefs = useRef({});

  const [keyboardPickedWord, setKeyboardPickedWord] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioMapRef = useRef({});

  const activeAudioRef = useRef(null);

  const [playingSection, setPlayingSection] = useState(null);

  const getSectionAudio = (sectionId, src) => {
    if (!audioMapRef.current[sectionId]) {
      const audio = new Audio(src);

      audioMapRef.current[sectionId] = audio;
    }

    return audioMapRef.current[sectionId];
  };

  const stopCurrentAudio = () => {
    if (activeAudioRef.current) {
      /*
        PAUSE فقط
        ما بنعمل currentTime = 0
      */

      activeAudioRef.current.pause();

      activeAudioRef.current = null;
    }

    setPlayingSection(null);
  };

  const playSectionAudio = (sectionId, src) => {
    const audio = getSectionAudio(sectionId, src);

    if (activeAudioRef.current && activeAudioRef.current !== audio) {
      activeAudioRef.current.pause();

      activeAudioRef.current.currentTime = 0;
    }

    activeAudioRef.current = audio;

    audio.currentTime = 0;

    setPlayingSection(sectionId);

    audio.play().catch((error) => {
      console.log("Audio error:", error);

      if (activeAudioRef.current === audio) {
        activeAudioRef.current = null;
      }

      setPlayingSection(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (activeAudioRef.current === audio) {
        activeAudioRef.current = null;
      }

      setPlayingSection(null);
    };
  };

  /* =====================================================
     ANSWERS
  ===================================================== */

  const correctMatches = [
    {
      input: "party hats",
      num: "input1",
    },
    {
      input: "What is it",
      num: "input2",
    },
    {
      input: "It's",
      num: "input3",
    },
    {
      input: "present",
      num: "input4",
    },
  ];

  const wordBank = correctMatches.map((c) => c.input);

  const getValue = (id) => answers[id] || "";

  const usedWords = new Set(Object.values(answers));

  const isSlotLocked = (slotId) => lockedSlots.includes(slotId);

  /* =====================================================
     SLOT ORDER
  ===================================================== */

  const slotOrder = ["input1", "input2", "input3", "input4"];

  const getAvailableSlotIds = () =>
    slotOrder.filter(
      (slotId) => !isSlotLocked(slotId) && !showAnswer && !checkCompleted,
    );

  /* =====================================================
     SECTION CORRECT STATE
  ===================================================== */

  const section1Correct =
    isSlotLocked("input1") && answers.input1 === "party hats";

  const section2Correct =
    ["input2", "input3", "input4"].every((id) => isSlotLocked(id)) &&
    answers.input2 === "What is it" &&
    answers.input3 === "It's" &&
    answers.input4 === "present";

  /* =====================================================
     KEYBOARD PICK FROM BANK
  ===================================================== */

  const handleKeyboardPick = (word) => {
    if (showAnswer || checkCompleted || usedWords.has(word)) {
      return;
    }

    setKeyboardPickedWord({
      word,
      source: "bank",
    });

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD PICK FROM PLACED SLOT
  ===================================================== */

  const handleKeyboardPickPlaced = (word, sourceSlotId) => {
    if (showAnswer || checkCompleted || isSlotLocked(sourceSlotId)) {
      return;
    }

    setKeyboardPickedWord({
      word,

      source: "slot",

      sourceSlotId,
    });

    requestAnimationFrame(() => {
      const available = getAvailableSlotIds();

      const firstOther = available.find((id) => id !== sourceSlotId);

      const target = firstOther ?? available[0];

      if (!target) {
        return;
      }

      slotRefs.current[target]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DROP
     SWAP / REPLACE
  ===================================================== */

  const handleKeyboardDrop = (targetSlotId) => {
    if (
      !keyboardPickedWord ||
      showAnswer ||
      checkCompleted ||
      isSlotLocked(targetSlotId)
    ) {
      return;
    }

    const picked = keyboardPickedWord;

    const updated = {
      ...answers,
    };

    const oldTargetWord = updated[targetSlotId];

    /* =========================================
         FROM SLOT -> SWAP
      ========================================= */

    if (picked.source === "slot" && picked.sourceSlotId) {
      const sourceSlotId = picked.sourceSlotId;

      if (sourceSlotId === targetSlotId) {
        setKeyboardPickedWord(null);

        setFocusedSlotId(null);

        return;
      }

      if (isSlotLocked(sourceSlotId)) {
        return;
      }

      if (oldTargetWord) {
        updated[sourceSlotId] = oldTargetWord;
      } else {
        delete updated[sourceSlotId];
      }
    }

    /* =========================================
         BANK -> TARGET
         old target returns to bank automatically
      ========================================= */

    updated[targetSlotId] = picked.word;

    setAnswers(updated);

    /* =========================================
         REMOVE X ONLY FROM CHANGED SLOTS
      ========================================= */

    setWrongWords((prev) =>
      prev.filter((id) => id !== targetSlotId && id !== picked.sourceSlotId),
    );

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    setTimeout(() => {
      if (picked.source === "slot") {
        placedRefs.current[targetSlotId]?.focus();
      } else {
        bankRefs.current[picked.word]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     DND SENSORS
  ===================================================== */

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
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const onDragStart = ({ active }) => {
    const data = active.data.current;

    if (data?.word) {
      setActiveWord(data.word);
      return;
    }

    setActiveWord(String(active.id).replace("bank-", ""));
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const overId = String(over.id);

    if (!overId.startsWith("slot-")) {
      return;
    }

    const inputId = overId.replace("slot-", "");

    if (isSlotLocked(inputId)) {
      return;
    }

    const data = active.data.current;

    if (!data?.word) {
      return;
    }

    const { word, source, sourceSlotId } = data;

    const updated = {
      ...answers,
    };

    const oldTargetWord = updated[inputId];

    /* =========================================
       FROM SLOT -> SWAP
    ========================================= */

    if (source === "slot" && sourceSlotId) {
      if (isSlotLocked(sourceSlotId)) {
        return;
      }

      if (sourceSlotId === inputId) {
        return;
      }

      if (oldTargetWord) {
        updated[sourceSlotId] = oldTargetWord;
      } else {
        delete updated[sourceSlotId];
      }
    } else {
      /*
        BANK:
        remove same word from any previous slot
        just in case.
      */

      Object.keys(updated).forEach((key) => {
        if (updated[key] === word) {
          delete updated[key];
        }
      });
    }

    updated[inputId] = word;

    setAnswers(updated);

    setWrongWords((prev) =>
      prev.filter((id) => id !== inputId && id !== sourceSlotId),
    );
  };

  const onDragCancel = () => {
    setActiveWord(null);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const allFilled = correctMatches.every(({ num }) => Boolean(answers[num]));

    if (!allFilled) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    const wrong = [];

    const correct = [];

    let correctCount = 0;

    correctMatches.forEach((ans) => {
      if (answers[ans.num] === ans.input) {
        correctCount++;

        correct.push(ans.num);
      } else {
        wrong.push(ans.num);
      }
    });

    /* =========================================
         LOCK CORRECT ONLY
      ========================================= */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...correct])));

    /* =========================================
         X WRONG ONLY
      ========================================= */

    setWrongWords(wrong);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);

    const total = correctMatches.length;

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
      setLockedSlots(correctMatches.map((item) => item.num));

      setWrongWords([]);

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showCorrectAnswers = () => {
    const filled = {};

    correctMatches.forEach((c) => {
      filled[c.num] = c.input;
    });

    setAnswers(filled);

    setWrongWords([]);

    setLockedSlots(correctMatches.map((item) => item.num));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAll = () => {
    stopCurrentAudio();

    Object.values(audioMapRef.current).forEach((audio) => {
      audio.pause();

      audio.currentTime = 0;
    });

    setAnswers({});

    setWrongWords([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedWord(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            gap: "88px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            title="Look and write."
            subTitle="Drag the correct words into each birthday sentence."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              width: "100%",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {wordBank.map((word) => (
              <DraggableWord
                key={word}
                id={`bank-${word}`}
                word={word}
                disabled={showAnswer || checkCompleted}
                isUsed={usedWords.has(word)}
                keyboardPickedWord={keyboardPickedWord}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          <div className="content-container-P90-Q1">
            {/* =================================================
                SECTION 1
            ================================================= */}

            <div
              className={`section-one ${
                section1Correct ? "audio-ready-section-p9-q1" : ""
              }`}
              role={section1Correct ? "button" : undefined}
              tabIndex={section1Correct ? 0 : undefined}
              onClick={() => {
                if (section1Correct) {
                  playSectionAudio("section1", partyHatsAudio);
                }
              }}
              onKeyDown={(e) => {
                if (!section1Correct) {
                  return;
                }

                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();

                  playSectionAudio("section1", partyHatsAudio);
                }
              }}
            >
              <span>1</span>

              <div
                style={{
                  position: "relative",
                }}
              >
                <img
                  src={partyhats}
                  className="p9-q1-img"
                  alt="Colorful party hats."
                />

                {section1Correct && (
                  <FaVolumeUp
                    className="section-audio-icon-p9-q1"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="content-input">
                <input type="text" value="What are these?" readOnly />

                <input type="text" value="These are" readOnly />

                <DropSlot
                  id="slot-input1"
                  slotId="input1"
                  value={getValue("input1")}
                  wrong={wrongWords.includes("input1") && !showAnswer}
                  locked={isSlotLocked("input1")}
                  showAnswer={showAnswer}
                  checkCompleted={checkCompleted}
                  keyboardPickedWord={keyboardPickedWord}
                  focusedSlotId={focusedSlotId}
                  setFocusedSlotId={setFocusedSlotId}
                  slotRefs={slotRefs}
                  placedRefs={placedRefs}
                  getAvailableSlotIds={getAvailableSlotIds}
                  onKeyboardDrop={handleKeyboardDrop}
                  onKeyboardPickPlaced={handleKeyboardPickPlaced}
                />
              </div>
            </div>

            {/* =================================================
                SECTION 2
            ================================================= */}

            <div
              className={`section-two ${
                section2Correct ? "audio-ready-section-p9-q1" : ""
              }`}
              role={section2Correct ? "button" : undefined}
              tabIndex={section2Correct ? 0 : undefined}
              onClick={() => {
                if (section2Correct) {
                  playSectionAudio("section2", presentAudio);
                }
              }}
              onKeyDown={(e) => {
                if (!section2Correct) {
                  return;
                }

                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();

                  playSectionAudio("section2", presentAudio);
                }
              }}
            >
              <span>2</span>

              <div
                style={{
                  position: "relative",
                }}
              >
                <img
                  src={present}
                  className="p9-q1-img"
                  alt="A wrapped present."
                />

                {section2Correct && (
                  <FaVolumeUp
                    className="section-audio-icon-p9-q1"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="content-input">
                {["input2", "input3", "input4"].map((slotId) => (
                  <React.Fragment key={slotId}>
                    <DropSlot
                      id={`slot-${slotId}`}
                      slotId={slotId}
                      value={getValue(slotId)}
                      wrong={wrongWords.includes(slotId) && !showAnswer}
                      locked={isSlotLocked(slotId)}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      keyboardPickedWord={keyboardPickedWord}
                      focusedSlotId={focusedSlotId}
                      setFocusedSlotId={setFocusedSlotId}
                      slotRefs={slotRefs}
                      placedRefs={placedRefs}
                      getAvailableSlotIds={getAvailableSlotIds}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardPickPlaced={handleKeyboardPickPlaced}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="action-buttons-container">
            <button className="try-again-button" onClick={resetAll}>
              Start Again ↻
            </button>

            <button className="show-answer-btn" onClick={showCorrectAnswers}>
              Show Answer
            </button>

            <button className="check-button2" onClick={checkAnswers}>
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord ? (
          <span
            style={{
              padding: "7px 14px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "#fff",

              fontWeight: "bold",

              boxShadow: "0 5px 15px rgba(0,0,0,.2)",

              display: "inline-block",
            }}
          >
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit2_Page9_Q1;
