import "./WB_Unit8_Page5_Q1.css";

import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U8/U8P49EXEI-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P49EXEI-02.svg";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIOS
===================================================== */

import legAudio from "../../../assets/U1 WB/U8/audio/page 49 - I/Item_001_This_is_my_leg.mp3";
import armAudio from "../../../assets/U1 WB/U8/audio/page 49 - I/Item_002_This_is_my_arm.mp3";
import headAudio from "../../../assets/U1 WB/U8/audio/page 49 - I/Item_003_This_is_my_head.mp3";
import eyeAudio from "../../../assets/U1 WB/U8/audio/page 49 - I/Item_004_This_is_my_eye.mp3";
import noseAudio from "../../../assets/U1 WB/U8/audio/page 49 - I/Item_005_This_is_my_nose.mp3";

/* =====================================================
   BANK DATA
===================================================== */

const NUMBER_BANK = [
  {
    num: "1",
    word: "This is my leg.",
    audio: legAudio,
  },
  {
    num: "2",
    word: "This is my arm.",
    audio: armAudio,
  },
  {
    num: "3",
    word: "This is my head.",
    audio: headAudio,
  },
  {
    num: "4",
    word: "This is my eye.",
    audio: eyeAudio,
  },
  {
    num: "5",
    word: "This is my nose.",
    audio: noseAudio,
  },
];

/* =====================================================
   CORRECT DATA

   index:
   0 = boy head
   1 = boy nose
   2 = boy leg
   3 = girl head
   4 = girl arm
===================================================== */

const CORRECT_DATA = ["4", "5", "1", "3", "2"];

/* =====================================================
   CELL POSITIONS
===================================================== */

const CELL_POSITIONS = [
  { top: "17%", left: "19%" },
  { top: "19%", left: "75%" },
  { top: "69%", left: "22%" },
  { top: "8%", left: "80%" },
  { top: "42%", left: "79%" },
];

/* =====================================================
   DRAGGABLE NUMBER + SENTENCE
===================================================== */

const DraggableNumber = ({
  item,
  isUsed,
  selectedNumber,
  onKeyboardSelect,
  onPlayAudio,
  playingAudioId,
  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.num,
    disabled: isUsed,
  });

  const isSelected = selectedNumber === item.num;

  const pointerStartRef = useRef(null);
  const pointerMovedRef = useRef(false);

  const setRefs = (node) => {
    setNodeRef(node);

    bankRefs.current[item.num] = node;
  };

  /* =================================================
     DETECT CLICK VS DRAG
  ================================================= */

  const handlePointerDownCapture = (e) => {
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    pointerMovedRef.current = false;
  };

  const handlePointerMoveCapture = (e) => {
    if (!pointerStartRef.current) {
      return;
    }

    const dx = e.clientX - pointerStartRef.current.x;

    const dy = e.clientY - pointerStartRef.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      pointerMovedRef.current = true;
    }
  };

  const handlePointerUpCapture = () => {
    requestAnimationFrame(() => {
      pointerStartRef.current = null;
    });
  };

  /* =================================================
     MOUSE CLICK = AUDIO ONLY
  ================================================= */

  const handleClick = () => {
    if (pointerMovedRef.current || isDragging) {
      pointerMovedRef.current = false;

      return;
    }

    onPlayAudio(item.audio, `bank-${item.num}`);
  };

  /* =================================================
     KEYBOARD
  ================================================= */

  const handleKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      Enter/Space = audio
    */

    onPlayAudio(item.audio, `bank-${item.num}`);

    /*
      إذا الرقم مستخدم:
      audio replay فقط
    */

    if (isUsed) {
      return;
    }

    /*
      Select for keyboard drag
    */

    onKeyboardSelect(item.num);
  };

  return (
    <div className="sentence-container-wb-unit8-p5-q1">
      <div
        ref={setRefs}
        {...listeners}
        {...attributes}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-label={
          isUsed
            ? `Number ${item.num}. ${item.word} Used answer. Press Enter or Space to hear the sentence again.`
            : isSelected
              ? `Number ${item.num}. ${item.word} Selected. Tab between the answer boxes and press Enter or Space to place it.`
              : `Number ${item.num}. ${item.word} Press Enter or Space to select and hear it.`
        }
        onPointerDownCapture={handlePointerDownCapture}
        onPointerMoveCapture={handlePointerMoveCapture}
        onPointerUpCapture={handlePointerUpCapture}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          number-drag-wb-u8-p5-q1

          ${isSelected ? "number-drag-selected-wb-u8-p5-q1" : ""}
        `}
        style={{
          opacity: isUsed ? 0.4 : isDragging ? 0.3 : 1,

          cursor: isUsed ? "pointer" : "grab",
        }}
      >
        {item.num}

        {playingAudioId === `bank-${item.num}` && (
          <FaVolumeUp className="audio-icon-wb-u8-p5-q1" aria-hidden="true" />
        )}
      </div>

      <p
        className="sentence-wb-unit7-p5-q1"
        role="button"
        tabIndex={0}
        aria-label={`${item.word} Press Enter or Space to hear the sentence.`}
        onClick={() => onPlayAudio(item.audio, `sentence-${item.num}`)}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") {
            return;
          }

          e.preventDefault();

          onPlayAudio(item.audio, `sentence-${item.num}`);
        }}
      >
        {item.word}

        {playingAudioId === `sentence-${item.num}` && (
          <FaVolumeUp
            className="sentence-audio-icon-wb-u8-p5-q1"
            aria-hidden="true"
          />
        )}
      </p>
    </div>
  );
};

/* =====================================================
   NUMBER BANK
===================================================== */

const NumberBank = ({
  usedNumbers,
  selectedNumber,
  onKeyboardSelect,
  onPlayAudio,
  playingAudioId,
  bankRefs,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "numbers",
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        word-container-wb-unit8-p5-q1

        ${isOver ? "number-bank-over-wb-u8-p5-q1" : ""}
      `}
    >
      {NUMBER_BANK.map((item) => (
        <DraggableNumber
          key={item.num}
          item={item}
          isUsed={usedNumbers.has(item.num)}
          selectedNumber={selectedNumber}
          onKeyboardSelect={onKeyboardSelect}
          onPlayAudio={onPlayAudio}
          playingAudioId={playingAudioId}
          bankRefs={bankRefs}
        />
      ))}
    </div>
  );
};

/* =====================================================
   DROP CELL
===================================================== */

const DropCell = ({
  id,

  value,

  previewValue,

  result,

  disabled,

  style,

  selectedNumber,

  onClear,

  onKeyboardDrop,

  onCancelKeyboard,

  onCycleFocus,

  inputRefs,
}) => {
  const [focused, setFocused] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled,
  });

  const setRefs = (node) => {
    setNodeRef(node);

    inputRefs.current[id] = node;
  };

  const showPreview = Boolean(selectedNumber) && focused && !disabled;

  const visibleValue = showPreview ? previewValue : value;

  /* =================================================
     MOUSE
  ================================================= */

  const handleClick = () => {
    if (!disabled && value) {
      onClear();
    }
  };

  /* =================================================
     KEYBOARD
  ================================================= */

  const handleKeyDown = (e) => {
    if (disabled) return;

    /* =========================
       ESCAPE
    ========================= */

    if (e.key === "Escape" && selectedNumber) {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboard();

      return;
    }

    /* =========================
       TAB CYCLE
    ========================= */

    if (e.key === "Tab" && selectedNumber) {
      e.preventDefault();

      onCycleFocus(id, e.shiftKey);

      return;
    }

    /* =========================
       ENTER / SPACE
    ========================= */

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      Selected number:
      place / replace
    */

    if (selectedNumber) {
      onKeyboardDrop();

      return;
    }

    /*
      Wrong / editable filled cell:
      return to bank
    */

    if (value) {
      onClear();
    }
  };

  return (
    <div
      ref={setRefs}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={
        disabled
          ? `Number ${value}. Correct answer.`
          : showPreview
            ? `Number ${previewValue} preview. Press Enter or Space to place it.`
            : value
              ? `Number ${value}. Press Enter or Space to remove this answer.`
              : "Empty answer box."
      }
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        number-input

        ${isOver && !disabled ? "drag-over-cell" : ""}

        ${showPreview ? "keyboard-preview-wb-u8-p5-q1" : ""}
      `}
      style={{
        ...style,

        background: isOver && !disabled ? "#e3f2fd" : "white",

        cursor: disabled ? "default" : "pointer",

        position: "absolute",
      }}
    >
      <span className={showPreview ? "preview-number-wb-u8-p5-q1" : ""}>
        {visibleValue}
      </span>

      {result === "wrong" && <span className="wrong-circle">✕</span>}
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit8_Page5_Q1 = () => {
  /* =================================================
       ANSWERS
    ================================================= */

  const [answers, setAnswers] = useState(["", "", "", "", ""]);

  /*
      null | correct | wrong
    */

  const [results, setResults] = useState([null, null, null, null, null]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =================================================
       KEYBOARD DRAG
    ================================================= */

  const [selectedNumber, setSelectedNumber] = useState(null);

  const bankRefs = useRef({});

  const inputRefs = useRef({});

  /* =================================================
       AUDIO
    ================================================= */

  const audioRef = useRef(null);

  const [playingAudioId, setPlayingAudioId] = useState(null);

  /* =================================================
       DND
    ================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  /* =================================================
       HELPERS
    ================================================= */

  const isCellCorrect = (index) => results[index] === "correct";

  const isCellLocked = (index) => showAnswerMode || isCellCorrect(index);

  const allCorrect = results.every((result) => result === "correct");

  const usedNumbers = new Set(answers.filter(Boolean));

  /* =================================================
       AUDIO
    ================================================= */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingAudioId(null);
  };

  const playAudio = (src, audioId = null) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingAudioId(audioId);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioId(null);
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =================================================
       UNLOCKED CELLS
    ================================================= */

  const getUnlockedCellIds = () => {
    const ids = [];

    answers.forEach((_, index) => {
      if (!isCellLocked(index)) {
        ids.push(String(index));
      }
    });

    return ids;
  };

  /* =================================================
       MOUSE DRAG START
       NO AUDIO
    ================================================= */

  const handleDragStart = ({ active }) => {
    setActiveId(String(active.id));
  };

  /* =================================================
       PLACE NUMBER
    ================================================= */

  const placeNumber = (number, targetIndex) => {
    if (isCellLocked(targetIndex)) {
      return;
    }

    setAnswers((prev) => {
      const copy = [...prev];

      /*
          شيل نفس الرقم من أي
          cell غير مقفولة.
        */

      copy.forEach((value, index) => {
        if (isCellLocked(index)) {
          return;
        }

        if (value === number) {
          copy[index] = "";
        }
      });

      /*
          Replace
        */

      copy[targetIndex] = number;

      return copy;
    });

    /*
        تعديل الخانة الغلط:
        شيل wrong عنها فقط.
      */

    setResults((prev) => {
      const copy = [...prev];

      if (copy[targetIndex] === "wrong") {
        copy[targetIndex] = null;
      }

      return copy;
    });
  };

  /* =================================================
       MOUSE DRAG END
    ================================================= */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over) return;

    const number = String(active.id);

    const destId = String(over.id);

    /*
        رجوع للبنك
      */

    if (destId === "numbers") {
      setAnswers((prev) => {
        const copy = [...prev];

        copy.forEach((value, index) => {
          if (isCellLocked(index)) {
            return;
          }

          if (value === number) {
            copy[index] = "";

            setResults((old) => {
              const r = [...old];

              r[index] = null;

              return r;
            });
          }
        });

        return copy;
      });

      return;
    }

    const targetIndex = Number(destId);

    if (Number.isNaN(targetIndex)) {
      return;
    }

    placeNumber(number, targetIndex);
  };

  /* =================================================
       FOCUS FIRST UNLOCKED CELL
    ================================================= */

  const focusFirstUnlockedCell = () => {
    const ids = getUnlockedCellIds();

    if (!ids.length) {
      return;
    }

    requestAnimationFrame(() => {
      inputRefs.current[ids[0]]?.focus?.();
    });
  };

  /* =================================================
       KEYBOARD SELECT
    ================================================= */

  const handleKeyboardSelect = (number) => {
    if (selectedNumber === number) {
      setSelectedNumber(null);

      return;
    }

    setSelectedNumber(number);

    focusFirstUnlockedCell();
  };

  /* =================================================
       TAB CYCLE
    ================================================= */

  const cycleCellFocus = (currentId, reverse = false) => {
    const ids = getUnlockedCellIds();

    if (!ids.length) {
      return;
    }

    const currentIndex = ids.indexOf(currentId);

    let nextIndex;

    if (reverse) {
      nextIndex = currentIndex <= 0 ? ids.length - 1 : currentIndex - 1;
    } else {
      nextIndex =
        currentIndex === ids.length - 1 || currentIndex === -1
          ? 0
          : currentIndex + 1;
    }

    inputRefs.current[ids[nextIndex]]?.focus?.();
  };

  /* =================================================
       KEYBOARD DROP
    ================================================= */

  const handleKeyboardDrop = (index) => {
    if (!selectedNumber) return;

    const number = selectedNumber;

    /*
    نحسب شكل answers بعد الـdrop
    قبل ما نغير الـstate،
    عشان نعرف مين أول خيار لسا مش مستخدم.
  */
    const nextAnswers = [...answers];

    /*
    شيل نفس الرقم من أي خانة غير مقفولة
  */
    nextAnswers.forEach((value, i) => {
      if (isCellLocked(i)) return;

      if (value === number) {
        nextAnswers[i] = "";
      }
    });

    /*
    حط الرقم بالخانة الجديدة
  */
    nextAnswers[index] = number;

    /*
    نفذ الـplace الحقيقي
  */
    placeNumber(number, index);

    /*
    خلصنا keyboard selection
  */
    setSelectedNumber(null);

    /*
    أول رقم غير مستخدم بعد الـdrop
  */
    const nextUnused = NUMBER_BANK.find(
      (item) => !nextAnswers.includes(item.num),
    );

    /*
    رجع focus لأول خيار غير مستخدم
  */
    requestAnimationFrame(() => {
      if (nextUnused) {
        bankRefs.current[nextUnused.num]?.focus?.();
      }
    });
  };

  /* =================================================
       ESCAPE
    ================================================= */

  const cancelKeyboardSelection = () => {
    const number = selectedNumber;

    setSelectedNumber(null);

    requestAnimationFrame(() => {
      bankRefs.current[number]?.focus?.();
    });
  };

  /* =================================================
       CLEAR CELL
    ================================================= */

  const handleClear = (index) => {
    if (isCellLocked(index)) {
      return;
    }

    const oldNumber = answers[index];

    setAnswers((prev) => {
      const copy = [...prev];

      copy[index] = "";

      return copy;
    });

    setResults((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    /*
        Wrong cell:
        رجع focus لنفس الرقم بالبنك.
      */

    requestAnimationFrame(() => {
      bankRefs.current[oldNumber]?.focus?.();
    });
  };

  /* =================================================
       SHOW ANSWER
    ================================================= */

  const handleShowAnswer = () => {
    setAnswers(CORRECT_DATA);

    setResults(Array(CORRECT_DATA.length).fill("correct"));

    setShowAnswerMode(true);

    setSelectedNumber(null);

    stopAudio();
  };

  /* =================================================
       CHECK
    ================================================= */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    /*
          Require unlocked cells
        */

    for (let i = 0; i < answers.length; i++) {
      if (isCellCorrect(i)) {
        continue;
      }

      if (!answers[i]) {
        ValidationAlert.info("Please fill all answer boxes before checking!");

        return;
      }
    }

    const nextResults = [...results];

    let correctCount = 0;

    answers.forEach((value, index) => {
      /*
              keep already correct
            */

      if (isCellCorrect(index)) {
        nextResults[index] = "correct";

        correctCount++;

        return;
      }

      if (value === CORRECT_DATA[index]) {
        nextResults[index] = "correct";

        correctCount++;
      } else {
        nextResults[index] = "wrong";
      }
    });

    setResults(nextResults);

    /*
          NO AUTO AUDIO
        */

    const total = CORRECT_DATA.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
          <div style="font-size:20px;text-align:center;margin-top:8px;">
            <span style="color:${color};font-weight:bold;">
              Score: ${correctCount} / ${total}
            </span>
          </div>
        `;

    if (correctCount === total) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  /* =================================================
       RESET
    ================================================= */

  const resetAnswers = () => {
    stopAudio();

    setAnswers(["", "", "", "", ""]);

    setResults([null, null, null, null, null]);

    setShowAnswerMode(false);

    setSelectedNumber(null);

    setActiveId(null);
  };

  /* =================================================
       ACTIVE / SELECTED ITEM
    ================================================= */

  const activeItem = NUMBER_BANK.find((item) => item.num === activeId);

  const selectedItem = NUMBER_BANK.find((item) => item.num === selectedNumber);

  /* =================================================
       RENDER
    ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="unit3-q3-wrapper"
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
            gap: "15px",
          }}
        >
          <ExerciseHeader
            sectionLetter="I"
            title="Look and number."
            subTitle="Drag each numbered sentence to the matching body part."
          />

          {/* =================================================
                IMAGES + DROP CELLS
            ================================================= */}

          <div className="look-number-wrapper">
            {/* =============================
                  BOY
              ============================= */}

            <div className="image-area">
              <img
                src={img1}
                alt="A boy standing and smiling, with arrows pointing to his eye, nose, and leg."
                style={{
                  width: "100%",
                  height: "300px",
                }}
              />

              {[0, 1, 2].map((idx) => (
                <DropCell
                  key={idx}
                  id={String(idx)}
                  value={answers[idx]}
                  previewValue={selectedItem?.num || ""}
                  result={results[idx]}
                  disabled={isCellLocked(idx)}
                  selectedNumber={selectedNumber}
                  onClear={() => handleClear(idx)}
                  onKeyboardDrop={() => handleKeyboardDrop(idx)}
                  onCancelKeyboard={cancelKeyboardSelection}
                  onCycleFocus={cycleCellFocus}
                  inputRefs={inputRefs}
                  style={{
                    top: CELL_POSITIONS[idx].top,

                    left: CELL_POSITIONS[idx].left,
                  }}
                />
              ))}
            </div>

            {/* =============================
                  GIRL
              ============================= */}

            <div className="image-area">
              <img
                src={img2}
                alt="A girl standing and smiling, with arrows pointing to her head and arm."
                style={{
                  height: "300px",
                }}
              />

              {[3, 4].map((idx) => (
                <DropCell
                  key={idx}
                  id={String(idx)}
                  value={answers[idx]}
                  previewValue={selectedItem?.num || ""}
                  result={results[idx]}
                  disabled={isCellLocked(idx)}
                  selectedNumber={selectedNumber}
                  onClear={() => handleClear(idx)}
                  onKeyboardDrop={() => handleKeyboardDrop(idx)}
                  onCancelKeyboard={cancelKeyboardSelection}
                  onCycleFocus={cycleCellFocus}
                  inputRefs={inputRefs}
                  style={{
                    top: CELL_POSITIONS[idx].top,

                    left: CELL_POSITIONS[idx].left,
                  }}
                />
              ))}
            </div>
          </div>

          {/* =================================================
                NUMBER BANK
            ================================================= */}

          <NumberBank
            usedNumbers={usedNumbers}
            selectedNumber={selectedNumber}
            onKeyboardSelect={handleKeyboardSelect}
            onPlayAudio={playAudio}
            playingAudioId={playingAudioId}
            bankRefs={bankRefs}
          />
        </div>

        {/* =================================================
              BUTTONS
          ================================================= */}

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
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
        {activeItem ? (
          <div className="drag-overlay-number-wb-u8-p5-q1">
            {activeItem.num}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page5_Q1;
