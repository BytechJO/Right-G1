import "./Unit3_Page5_Q3.css";

import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit3/imgs3/P26exeB-01.svg";
import img2 from "../../../assets/unit3/imgs3/P26exeB-02.svg";
import img3 from "../../../assets/unit3/imgs3/P26exeB-03.svg";
import img4 from "../../../assets/unit3/imgs3/P26exeB-04.svg";

// Audios
import sound2 from "../../../assets/unit3/Page 26 - B/two.mp3";
import sound3 from "../../../assets/unit3/Page 26 - B/three.mp3";
import sound5 from "../../../assets/unit3/Page 26 - B/five.mp3";
import sound8 from "../../../assets/unit3/Page 26 - B/eight.mp3";

import { FaVolumeUp } from "react-icons/fa";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

// =====================================================
// DRAGGABLE NUMBER
// =====================================================
const DraggableNum = ({
  id,
  num,
  disabled,
  isUsed,
  isPlaying,
  onKeyboardActivate,
  onMouseClick,
  bankRef,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const setRefs = (node) => {
    setNodeRef(node);
    bankRef.current[num] = node;
  };

  const unavailable = disabled || isUsed;

  const handleKeyDown = (e) => {
    if (unavailable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      // keyboard فقط:
      // صوت + اختيار الرقم + الانتقال للـ inputs
      onKeyboardActivate(num);
    }
  };

  const handleClick = () => {
    if (unavailable) return;

    // mouse click:
    // صوت فقط
    onMouseClick(num);
  };

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={unavailable ? -1 : 0}
      aria-label={`Number ${num}`}
      aria-disabled={unavailable}
      className={`
        unit3-q3-bank-number
        ${isUsed ? "used" : ""}
      `}
      style={{
        opacity: isDragging ? 0.4 : undefined,
      }}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <span>{num}</span>

      {isPlaying && (
        <FaVolumeUp className="unit3-q3-volume-icon" aria-hidden="true" />
      )}
    </div>
  );
};
// =====================================================
// DROP SLOT
// =====================================================
const DropSlot = ({
  index,
  value,
  isWrong,
  isCorrect,
  locked,
  showAnswer,

  keyboardPicked,
  keyboardFocusIndex,

  onRemove,
  onPlaceKeyboard,
  onSlotFocus,
  onSlotKeyDown,

  slotRefs,
}) => {
  const disabled = showAnswer || locked;

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${index}`,
    disabled,
  });

  const setRefs = (node) => {
    setNodeRef(node);
    slotRefs.current[index] = node;
  };

  const isKeyboardPreview =
    keyboardPicked && keyboardFocusIndex === index && !disabled;

  return (
    <div className="unit3-q3-input-wrapper">
      <div
        ref={setRefs}
        role="button"
        tabIndex={
          keyboardPicked ? (disabled ? -1 : 0) : value && !disabled ? 0 : -1
        }
        aria-label={
          isKeyboardPreview
            ? `Place number ${keyboardPicked} in answer box ${index + 1}`
            : value
              ? `Answer box ${index + 1}, number ${value}`
              : `Empty answer box ${index + 1}`
        }
        aria-disabled={disabled}
        className={`
          unit3-q3-input
          ${isOver ? "drag-over-cell" : ""}
          ${isWrong ? "wrong-input" : ""}
          ${isCorrect ? "correct-input" : ""}
          ${locked ? "locked-input" : ""}
          ${isKeyboardPreview ? "keyboard-target" : ""}
        `}
        onFocus={() => {
          if (!disabled) {
            onSlotFocus(index);
          }
        }}
        onKeyDown={(e) => onSlotKeyDown(e, index)}
        onClick={() => {
          if (disabled) return;

          if (keyboardPicked) {
            onPlaceKeyboard(index);
            return;
          }

          if (value) {
            onRemove(index);
          }
        }}
      >
        {/* القيمة الموجودة بالفعل */}
        {value && !isKeyboardPreview && (
          <span className="unit3-q3-value">{value}</span>
        )}

        {/* Preview للرقم المختار من الكيبورد */}
        {isKeyboardPreview && (
          <span className="unit3-q3-keyboard-preview">{keyboardPicked}</span>
        )}
      </div>

      {isWrong && !locked && (
        <div className="unit3-q3-wrong" aria-hidden="true">
          ✕
        </div>
      )}
    </div>
  );
};

// =====================================================
// MAIN
// =====================================================
const Unit3_Page5_Q3 = () => {
  const correctData = ["5", "3", "2", "8"];

  const numberBank = ["2", "3", "5", "8"];

  const options = [
    {
      img: img1,
      alt: "Five books.",
    },
    {
      img: img2,
      alt: "Three pens.",
    },
    {
      img: img3,
      alt: "Two cats.",
    },
    {
      img: img4,
      alt: "Eight caps.",
    },
  ];
  const numberSounds = {
    2: sound2,
    3: sound3,
    5: sound5,
    8: sound8,
  };

  // =====================================================
  // STATE
  // =====================================================
  const [answers, setAnswers] = useState([null, null, null, null]);

  const [showResult, setShowResult] = useState([null, null, null, null]);

  // الإجابات التي أصبحت صح ومقفلة
  const [lockedCorrect, setLockedCorrect] = useState([
    false,
    false,
    false,
    false,
  ]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [completed, setCompleted] = useState(false);

  // Drag
  const [activeNum, setActiveNum] = useState(null);

  // Keyboard picked number
  const [keyboardPicked, setKeyboardPicked] = useState(null);

  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(null);

  // Audio
  const audioRef = useRef(null);

  const [playingNum, setPlayingNum] = useState(null);

  // Focus refs
  const bankRefs = useRef({});
  const slotRefs = useRef([]);

  // =====================================================
  // DND
  // =====================================================
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // أي أرقام موجودة حاليًا داخل الخانات
  const usedNums = new Set(answers.filter(Boolean));

  // =====================================================
  // AUDIO
  // =====================================================
  const playNumberAudio = (num) => {
    const src = numberSounds[num];

    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingNum(num);

    audio.play().catch(() => {});

    audio.onended = () => {
      setPlayingNum(null);
    };

    audio.onerror = () => {
      setPlayingNum(null);
    };
  };

  // =====================================================
  // GET EDITABLE SLOTS
  // =====================================================
  const getEditableSlots = () => {
    return [0, 1, 2, 3].filter((index) => !lockedCorrect[index] && !showAnswer);
  };

  // =====================================================
  // GET AVAILABLE BANK NUMBERS
  // =====================================================
  const getAvailableNumbers = (currentAnswers = answers) => {
    return numberBank.filter((num) => !currentAnswers.includes(num));
  };

  // =====================================================
  // RETURN FOCUS TO BANK
  // =====================================================
  const focusBank = (currentAnswers = answers, previousNum = null) => {
    const available = getAvailableNumbers(currentAnswers);

    if (available.length === 0) return;

    let targetNum = available[0];

    // نحاول نروح للخيار اللي بعد الرقم المستخدم
    if (previousNum) {
      const oldIndex = numberBank.indexOf(previousNum);

      for (let step = 1; step <= numberBank.length; step++) {
        const candidate = numberBank[(oldIndex + step) % numberBank.length];

        if (available.includes(candidate)) {
          targetNum = candidate;
          break;
        }
      }
    }

    requestAnimationFrame(() => {
      bankRefs.current[targetNum]?.focus();
    });
  };

  // =====================================================
  // KEYBOARD: PICK NUMBER
  // =====================================================
  const activateKeyboardNumber = (num) => {
    if (showAnswer || completed || usedNums.has(num)) {
      return;
    }

    // صوت
    playNumberAudio(num);

    // من هون يبدأ نظام الـ keyboard فقط
    setKeyboardPicked(num);

    const editable = getEditableSlots();

    if (editable.length === 0) return;

    const firstIndex = editable[0];

    setKeyboardFocusIndex(firstIndex);

    requestAnimationFrame(() => {
      slotRefs.current[firstIndex]?.focus();
    });
  };

  // =====================================================
  // PLACE WITH KEYBOARD
  // =====================================================
  const placeKeyboardNumber = (index) => {
    if (!keyboardPicked || showAnswer || lockedCorrect[index]) {
      return;
    }

    const picked = keyboardPicked;

    let nextAnswers = [];

    setAnswers((prev) => {
      const copy = [...prev];

      // إذا الرقم موجود بمكان ثاني
      const oldIndex = copy.findIndex((v) => v === picked);

      if (oldIndex !== -1 && oldIndex !== index && !lockedCorrect[oldIndex]) {
        copy[oldIndex] = null;
      }

      // إذا الخانة فيها جواب غلط، الرقم القديم يرجع للبنك
      copy[index] = picked;

      nextAnswers = copy;

      return copy;
    });

    // نمسح نتيجة هذه الخانة بعد التعديل
    setShowResult((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    setKeyboardPicked(null);
    setKeyboardFocusIndex(null);

    requestAnimationFrame(() => {
      focusBank(nextAnswers, picked);
    });
  };
  const handleMouseNumberClick = (num) => {
    if (showAnswer || completed || usedNums.has(num)) {
      return;
    }

    // فقط شغّل الصوت
    playNumberAudio(num);

    // مهم:
    // ما في setKeyboardPicked
    // ما في focus على inputs
    // ما في preview
  };
  // =====================================================
  // SLOT KEYBOARD
  // =====================================================
  const handleSlotKeyDown = (e, index) => {
    if (lockedCorrect[index] || showAnswer) {
      return;
    }

    // -------------------------------------
    // إذا حامل رقم
    // Tab محصور بين الـ inputs
    // -------------------------------------
    if (keyboardPicked) {
      if (e.key === "Tab") {
        e.preventDefault();

        const editable = getEditableSlots();

        if (editable.length === 0) return;

        const currentPosition = editable.indexOf(index);

        let nextPosition;

        if (e.shiftKey) {
          nextPosition =
            currentPosition <= 0 ? editable.length - 1 : currentPosition - 1;
        } else {
          nextPosition =
            currentPosition === editable.length - 1 ? 0 : currentPosition + 1;
        }

        const nextIndex = editable[nextPosition];

        setKeyboardFocusIndex(nextIndex);

        slotRefs.current[nextIndex]?.focus();

        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        placeKeyboardNumber(index);

        return;
      }

      // Escape يلغي مسك الرقم
      if (e.key === "Escape") {
        e.preventDefault();

        const picked = keyboardPicked;

        setKeyboardPicked(null);
        setKeyboardFocusIndex(null);

        requestAnimationFrame(() => {
          bankRefs.current[picked]?.focus();
        });
      }

      return;
    }

    // -------------------------------------
    // إذا مش حامل رقم
    // Enter على جواب غلط/موجود يرجعه للبنك
    // -------------------------------------
    if ((e.key === "Enter" || e.key === " ") && answers[index]) {
      e.preventDefault();

      removeAnswer(index);
    }
  };

  // =====================================================
  // SLOT FOCUS
  // =====================================================
  const handleSlotFocus = (index) => {
    if (keyboardPicked) {
      setKeyboardFocusIndex(index);
    }
  };

  // =====================================================
  // DRAG START
  // =====================================================
  const onDragStart = ({ active }) => {
    if (showAnswer || completed) return;

    const num = active.id.replace("num-", "");

    setActiveNum(num);

    playNumberAudio(num);
  };

  // =====================================================
  // DRAG END
  // =====================================================
  const onDragEnd = ({ active, over }) => {
    setActiveNum(null);

    if (!over || showAnswer || completed) {
      return;
    }

    const value = active.id.replace("num-", "");

    if (!over.id.startsWith("drop-")) {
      return;
    }

    const index = Number(over.id.replace("drop-", ""));

    // الصح المقفل ممنوع يتغير
    if (lockedCorrect[index]) return;

    setAnswers((prev) => {
      const copy = [...prev];

      // الرقم لو موجود في مكان ثاني
      const oldIndex = copy.findIndex((v) => v === value);

      if (oldIndex !== -1 && oldIndex !== index && !lockedCorrect[oldIndex]) {
        copy[oldIndex] = null;
      }

      copy[index] = value;

      return copy;
    });

    setShowResult((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });
  };

  const onDragCancel = () => {
    setActiveNum(null);
  };

  // =====================================================
  // REMOVE ANSWER
  // =====================================================
  const removeAnswer = (index) => {
    if (showAnswer || lockedCorrect[index]) {
      return;
    }

    const removedNum = answers[index];

    if (!removedNum) return;

    let nextAnswers = [];

    setAnswers((prev) => {
      const copy = [...prev];

      copy[index] = null;

      nextAnswers = copy;

      return copy;
    });

    setShowResult((prev) => {
      const copy = [...prev];

      copy[index] = null;

      return copy;
    });

    requestAnimationFrame(() => {
      bankRefs.current[removedNum]?.focus();
    });
  };

  // =====================================================
  // CHECK ANSWERS
  // =====================================================
  const checkAnswers = () => {
    if (showAnswer || completed) return;

    if (answers.some((v) => v === null)) {
      ValidationAlert.info(
        "Oops!",
        "Please fill all answer boxes before checking!",
      );

      return;
    }

    const results = answers.map((value, index) =>
      value === correctData[index] ? "correct" : "wrong",
    );

    setShowResult(results);

    // الصح الجديد يصير Locked
    const newLocked = results.map(
      (result, index) => lockedCorrect[index] || result === "correct",
    );

    setLockedCorrect(newLocked);

    const correctCount = results.filter((r) => r === "correct").length;

    const total = correctData.length;

    const allCorrect = correctCount === total;

    if (allCorrect) {
      setCompleted(true);

      setKeyboardPicked(null);

      setKeyboardFocusIndex(null);
    }

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div
        style="
          font-size:20px;
          text-align:center;
          margin-top:8px;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (allCorrect) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  // =====================================================
  // SHOW ANSWER
  // =====================================================
  const handleShowAnswer = () => {
    setShowAnswer(true);

    setAnswers([...correctData]);

    setShowResult([null, null, null, null]);

    setLockedCorrect([true, true, true, true]);

    setKeyboardPicked(null);

    setKeyboardFocusIndex(null);

    setCompleted(true);
  };

  // =====================================================
  // RESET
  // =====================================================
  const resetAnswers = () => {
    setAnswers([null, null, null, null]);

    setShowResult([null, null, null, null]);

    setLockedCorrect([false, false, false, false]);

    setShowAnswer(false);

    setCompleted(false);

    setActiveNum(null);

    setKeyboardPicked(null);

    setKeyboardFocusIndex(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingNum(null);
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
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
        <div className="div-forall" style={{ gap: "30px" }}>
          <ExerciseHeader
            sectionLetter="B"
            title="Count and write."
            subTitle="Count each group, then drag the matching number to it."
          />

          {/* =========================================
              NUMBER BANK
          ========================================= */}
          <div className="unit3-q3-number-bank">
            {numberBank.map((num) => (
              <DraggableNum
                key={num}
                id={`num-${num}`}
                num={num}
                disabled={showAnswer || completed}
                isUsed={usedNums.has(num)}
                isPlaying={playingNum === num}
                onKeyboardActivate={activateKeyboardNumber}
                onMouseClick={handleMouseNumberClick}
                bankRef={bankRefs}
              />
            ))}
          </div>

          {/* =========================================
              IMAGES + INPUTS
          ========================================= */}
          <div className="unit3-q3-grid">
            {options.map((item, index) => (
              <div key={index} className="unit3-q3-box">
                <img src={item.img} className="unit3-q3-image" alt={item.alt} />

                <DropSlot
                  index={index}
                  value={answers[index]}
                  isWrong={showResult[index] === "wrong"}
                  isCorrect={lockedCorrect[index]}
                  locked={lockedCorrect[index]}
                  showAnswer={showAnswer}
                  keyboardPicked={keyboardPicked}
                  keyboardFocusIndex={keyboardFocusIndex}
                  onRemove={() => removeAnswer(index)}
                  onPlaceKeyboard={placeKeyboardNumber}
                  onSlotFocus={handleSlotFocus}
                  onSlotKeyDown={handleSlotKeyDown}
                  slotRefs={slotRefs}
                />
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            BUTTONS
        ========================================= */}
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

      {/* =========================================
          DRAG OVERLAY
      ========================================= */}
      <DragOverlay>
        {activeNum ? (
          <div className="unit3-q3-drag-overlay">{activeNum}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit3_Page5_Q3;
