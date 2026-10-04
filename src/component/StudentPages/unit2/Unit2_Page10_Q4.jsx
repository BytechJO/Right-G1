import React, { useRef, useState } from "react";

import pizza2 from "../../../assets/img_unit2/imgs/Pizza (2).jpg";
import boy from "../../../assets/img_unit2/imgs/boy 02.png";
import paint from "../../../assets/img_unit2/imgs/Paint.jpg";
import pincle from "../../../assets/img_unit2/imgs/Pencel.jpg";

import paintAudio from "../../../assets/unit2/Page 19 - G/paint.mp3";
import boyAudio from "../../../assets/unit2/Page 19 - G/boy.mp3";
import pizzaAudio from "../../../assets/unit2/Page 19 - G/pizza.mp3";
import pencilAudio from "../../../assets/unit2/Page 19 - G/pencil.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import "./Unit2_Page10_Q4.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   DRAGGABLE LETTER — BANK
===================================================== */

const DraggableWord = ({
  id,
  letter,
  disabled,

  keyboardPickedLetter,
  onKeyboardPick,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,

    data: {
      letter,
      source: "bank",
    },

    disabled,
  });

  const isPicked =
    keyboardPickedLetter?.letter === letter &&
    keyboardPickedLetter?.source === "bank";

  return (
    <span
      ref={(el) => {
        setNodeRef(el);
        bankRefs.current[letter] = el;
      }}
      {...(disabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${letter} selected. Choose a blank and press Enter.`
          : `${letter}. Press Enter or Space to select.`
      }
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPick(letter);
        }
      }}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",

        background: isPicked ? "#dbeafe" : "white",

        fontWeight: "bold",

        cursor: disabled ? "default" : "grab",

        opacity: isDragging ? 0.4 : 1,

        display: "inline-block",

        userSelect: "none",
        touchAction: "none",

        transition: "opacity 0.2s ease",
      }}
    >
      {letter}
    </span>
  );
};

/* =====================================================
   PLACED LETTER
===================================================== */

const PlacedLetter = ({
  letter,
  index,

  locked,
  showAnswer,
  checkCompleted,

  placedRefs,
  onKeyboardPickPlaced,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${index}`,

    data: {
      letter,
      source: "slot",
      sourceIndex: index,
    },

    disabled: locked || showAnswer || checkCompleted,
  });

  const disabled = locked || showAnswer || checkCompleted;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        placedRefs.current[index] = el;
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
          : `${letter}. Press Enter or Space to move this letter.`
      }
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPickPlaced(letter, index);
        }
      }}
      className="placed-letter-unit2-p10-q4"
      style={{
        cursor: disabled ? "default" : "grab",

        opacity: isDragging ? 0.4 : 1,

        display: "inline-block",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {letter}
    </span>
  );
};

/* =====================================================
   DROP SLOT
===================================================== */

const DropSlot = ({
  index,
  value,

  isWrong,
  showAnswer,
  locked,
  checkCompleted,

  keyboardPickedLetter,

  focusedSlotIndex,
  setFocusedSlotIndex,

  slotRefs,
  placedRefs,

  getAvailableSlotIndexes,

  onKeyboardDrop,
  onKeyboardPickPlaced,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,

    disabled: showAnswer || locked || checkCompleted,
  });

  const keyboardActive =
    !!keyboardPickedLetter && !locked && !showAnswer && !checkCompleted;

  const showKeyboardPreview = keyboardActive && focusedSlotIndex === index;

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        slotRefs.current[index] = el;
      }}
      className={`q-input10-unit2-p10-q4 ${
        showAnswer ? "show-answer-red1" : ""
      } ${isOver && !locked && !showAnswer ? "drag-over-cell" : ""} ${
        showKeyboardPreview ? "keyboard-slot-active-u2-p10-q4" : ""
      }`}
      role={keyboardActive ? "button" : undefined}
      tabIndex={keyboardActive ? 0 : -1}
      aria-label={
        keyboardActive
          ? value
            ? `Blank contains ${value}. Press Enter to place ${keyboardPickedLetter.letter}.`
            : `Empty blank. Press Enter to place ${keyboardPickedLetter.letter}.`
          : undefined
      }
      onFocus={(e) => {
        if (!keyboardActive) {
          e.currentTarget.blur();

          setFocusedSlotIndex(null);

          return;
        }

        setFocusedSlotIndex(index);
      }}
      onBlur={() => {
        setFocusedSlotIndex(null);
      }}
      onKeyDown={(e) => {
        if (!keyboardActive) {
          return;
        }

        /* =====================================
           TAB / SHIFT+TAB BETWEEN OPEN SLOTS
        ===================================== */

        if (e.key === "Tab") {
          e.preventDefault();
          e.stopPropagation();

          const available = getAvailableSlotIndexes();

          if (available.length === 0) {
            return;
          }

          const currentPosition = available.indexOf(index);

          let nextPosition;

          if (e.shiftKey) {
            nextPosition =
              currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
          } else {
            nextPosition =
              currentPosition === -1 || currentPosition === available.length - 1
                ? 0
                : currentPosition + 1;
          }

          const nextIndex = available[nextPosition];

          slotRefs.current[nextIndex]?.focus();

          return;
        }

        /* =====================================
           ENTER / SPACE = DROP
        ===================================== */

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardDrop(index);
        }
      }}
    >
      {/* =====================================
          BLINKING PREVIEW
      ===================================== */}

      {showKeyboardPreview ? (
        <span className="keyboard-letter-preview-u2-p10-q4" aria-hidden="true">
          {keyboardPickedLetter.letter}
        </span>
      ) : value ? (
        <PlacedLetter
          letter={value}
          index={index}
          locked={locked}
          showAnswer={showAnswer}
          checkCompleted={checkCompleted}
          placedRefs={placedRefs}
          onKeyboardPickPlaced={onKeyboardPickPlaced}
        />
      ) : null}

      {isWrong && !showAnswer && <span className="error-mark-input">✕</span>}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit2_Page10_Q4 = () => {
  /* ======================================================
     DATA
  ====================================================== */

  const correctAnswers = ["p", "b", "p", "p"];

  /*
    مهم:
    p و b قابلين لإعادة الاستخدام.
  */
  const wordBank = ["p", "b"];

  const items = [
    {
      image: paint,
      alt: "Paint",
      audio: paintAudio,
      word: "paint",
    },
    {
      image: boy,
      alt: "Boy",
      audio: boyAudio,
      word: "boy",
    },
    {
      image: pizza2,
      alt: "Pizza",
      audio: pizzaAudio,
      word: "pizza",
    },
    {
      image: pincle,
      alt: "Pencil",
      audio: pencilAudio,
      word: "pencil",
    },
  ];

  /* ======================================================
     STATE
  ====================================================== */

  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeLetter, setActiveLetter] = useState(null);

  /* ======================================================
     KEYBOARD
  ====================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  const placedRefs = useRef({});

  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);

  const [focusedSlotIndex, setFocusedSlotIndex] = useState(null);

  /* ======================================================
     AUDIO
  ====================================================== */

  const audioRef = useRef(null);

  const [playingIndex, setPlayingIndex] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingIndex(null);
  };

  const playAudio = (index) => {
    const item = items[index];

    if (!item?.audio) {
      return;
    }

    /*
      الصوت متاح فقط
      إذا الخانة صح ومقفلة
      أو Show Answer
    */

    if (!lockedInputs.includes(index) && !showAnswer) {
      return;
    }

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingIndex(index);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingIndex(null);
    };
  };

  /* ======================================================
     HELPERS
  ====================================================== */

  const isInputLocked = (index) => lockedInputs.includes(index);

  const getAvailableSlotIndexes = () =>
    answers
      .map((_, index) => index)
      .filter(
        (index) => !isInputLocked(index) && !showAnswer && !checkCompleted,
      );

  /* ======================================================
     KEYBOARD PICK FROM BANK
  ====================================================== */

  const handleKeyboardPick = (letter) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
        ما في isUsed هون.
        p ممكن نستخدمها بأكثر من خانة.
      */

    setKeyboardPickedLetter({
      letter,
      source: "bank",
    });

    requestAnimationFrame(() => {
      const available = getAvailableSlotIndexes();

      if (!available.length) {
        return;
      }

      slotRefs.current[available[0]]?.focus();
    });
  };

  /* ======================================================
     PICK PLACED LETTER
  ====================================================== */

  const handleKeyboardPickPlaced = (letter, sourceIndex) => {
    if (showAnswer || checkCompleted || isInputLocked(sourceIndex)) {
      return;
    }

    setKeyboardPickedLetter({
      letter,
      source: "slot",
      sourceIndex,
    });

    requestAnimationFrame(() => {
      const available = getAvailableSlotIndexes();

      const firstOther = available.find((index) => index !== sourceIndex);

      const target = firstOther ?? available[0];

      if (target === undefined) {
        return;
      }

      slotRefs.current[target]?.focus();
    });
  };

  /* ======================================================
     KEYBOARD DROP
  ====================================================== */

  const handleKeyboardDrop = (targetIndex) => {
    if (
      !keyboardPickedLetter ||
      showAnswer ||
      checkCompleted ||
      isInputLocked(targetIndex)
    ) {
      return;
    }

    const picked = keyboardPickedLetter;

    const updated = [...answers];

    const oldTargetValue = updated[targetIndex];

    /* =====================================
         FROM SLOT -> SWAP
      ===================================== */

    if (picked.source === "slot" && picked.sourceIndex !== undefined) {
      const sourceIndex = picked.sourceIndex;

      if (sourceIndex === targetIndex) {
        setKeyboardPickedLetter(null);

        setFocusedSlotIndex(null);

        return;
      }

      if (isInputLocked(sourceIndex)) {
        return;
      }

      updated[sourceIndex] = oldTargetValue || "";
    }

    /*
        FROM BANK:
        فقط حط الحرف بالهدف.
        ما بنشيله من أي slot ثاني لأن
        الحروف قابلة لإعادة الاستخدام.
      */

    updated[targetIndex] = picked.letter;

    setAnswers(updated);

    /* =====================================
         CLEAR X ONLY CHANGED SLOTS
      ===================================== */

    setWrongInputs((prev) =>
      prev.filter(
        (index) => index !== targetIndex && index !== picked.sourceIndex,
      ),
    );

    setKeyboardPickedLetter(null);

    setFocusedSlotIndex(null);

    setTimeout(() => {
      if (picked.source === "slot") {
        placedRefs.current[targetIndex]?.focus();
      } else {
        /*
            حرف البنك ما اختفى،
            لأنه reusable.
          */

        bankRefs.current[picked.letter]?.focus();
      }
    }, 0);
  };

  /* ======================================================
     SENSORS
  ====================================================== */

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

  /* ======================================================
     DRAG START
  ====================================================== */

  const onDragStart = ({ active }) => {
    const data = active.data.current;

    if (data?.letter) {
      setActiveLetter(data.letter);

      return;
    }

    setActiveLetter(null);
  };

  /* ======================================================
     DRAG END
  ====================================================== */

  const onDragEnd = ({ active, over }) => {
    setActiveLetter(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const overId = String(over.id);

    if (!overId.startsWith("slot-")) {
      return;
    }

    const targetIndex = Number(overId.split("-")[1]);

    if (isInputLocked(targetIndex)) {
      return;
    }

    const data = active.data.current;

    if (!data?.letter) {
      return;
    }

    const { letter, source, sourceIndex } = data;

    const updated = [...answers];

    const oldTargetValue = updated[targetIndex];

    /* =====================================
       SLOT -> SLOT = SWAP
    ===================================== */

    if (source === "slot" && sourceIndex !== undefined) {
      if (isInputLocked(sourceIndex)) {
        return;
      }

      if (sourceIndex === targetIndex) {
        return;
      }

      updated[sourceIndex] = oldTargetValue || "";
    }

    /*
      BANK -> SLOT

      ما بنحذف نفس الحرف من slots ثانية
      لأن p مسموح تتكرر.
    */

    updated[targetIndex] = letter;

    setAnswers(updated);

    setWrongInputs((prev) =>
      prev.filter((index) => index !== targetIndex && index !== sourceIndex),
    );
  };

  const onDragCancel = () => {
    setActiveLetter(null);
  };

  /* ======================================================
     REMOVE ANSWER
  ====================================================== */

  const removeAnswer = (index) => {
    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  /* ======================================================
     CHECK ANSWERS
  ====================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((ans) => ans === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    let score = 0;

    const wrong = [];

    const correctTemp = [];

    answers.forEach((ans, index) => {
      if (ans === correctAnswers[index]) {
        score++;

        correctTemp.push(index);
      } else {
        wrong.push(index);
      }
    });

    /* ====================================================
       LOCK CORRECT ONLY
    ==================================================== */

    setLockedInputs((prev) => Array.from(new Set([...prev, ...correctTemp])));

    /* ====================================================
       WRONG ONLY
    ==================================================== */

    setWrongInputs(wrong);

    setKeyboardPickedLetter(null);

    setFocusedSlotIndex(null);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    /* ====================================================
       ALL CORRECT
    ==================================================== */

    if (score === total) {
      setLockedInputs(correctAnswers.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* ======================================================
     SHOW ANSWER
  ====================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    setAnswers([...correctAnswers]);

    setWrongInputs([]);

    setLockedInputs(correctAnswers.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedLetter(null);

    setFocusedSlotIndex(null);
  };

  /* ======================================================
     RESET
  ====================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(["", "", "", ""]);

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveLetter(null);

    setKeyboardPickedLetter(null);

    setFocusedSlotIndex(null);
  };

  /* ======================================================
     RENDER
  ====================================================== */

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

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            gap: "50px",
          }}
        >
          <ExerciseHeader
            sectionLetter="G"
            title="Look and write."
            subTitle="Drag b or p to complete each picture word."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              width: "90%",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {wordBank.map((letter, index) => (
              <DraggableWord
                key={`${letter}-${index}`}
                id={`bank-${letter}`}
                letter={letter}
                disabled={showAnswer || checkCompleted}
                keyboardPickedLetter={keyboardPickedLetter}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              SLOTS + IMAGES
          ================================================= */}

          <div className="row-content10-1">
            {answers.map((value, index) => {
              const locked = isInputLocked(index);

              const canPlayAudio = locked || showAnswer;

              const isPlaying = playingIndex === index;

              return (
                <div key={index} className="row2">
                  <span
                    style={{
                      position: "relative",

                      display: "flex",

                      alignItems: "center",

                      gap: "5px",
                    }}
                  >
                    <span className="num-span">{index + 1}</span>

                    <div className="input-wrapper">
                      <DropSlot
                        index={index}
                        value={value}
                        isWrong={wrongInputs.includes(index)}
                        showAnswer={showAnswer}
                        locked={locked}
                        checkCompleted={checkCompleted}
                        keyboardPickedLetter={keyboardPickedLetter}
                        focusedSlotIndex={focusedSlotIndex}
                        setFocusedSlotIndex={setFocusedSlotIndex}
                        slotRefs={slotRefs}
                        placedRefs={placedRefs}
                        getAvailableSlotIndexes={getAvailableSlotIndexes}
                        onKeyboardDrop={handleKeyboardDrop}
                        onKeyboardPickPlaced={handleKeyboardPickPlaced}
                      />
                    </div>
                  </span>

                  {/* ======================================
                        IMAGE + AUDIO
                    ====================================== */}

                  <div
                    className={
                      canPlayAudio ? "correct-audio-image-wrapper" : ""
                    }
                    style={{
                      position: "relative",

                      display: "inline-block",

                      cursor: canPlayAudio ? "pointer" : "default",
                    }}
                    onClick={() => {
                      if (canPlayAudio) {
                        playAudio(index);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (!canPlayAudio) {
                        return;
                      }

                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        playAudio(index);
                      }
                    }}
                    role={canPlayAudio ? "button" : undefined}
                    tabIndex={canPlayAudio ? 0 : undefined}
                    aria-label={
                      canPlayAudio ? `Play ${items[index].word}` : undefined
                    }
                  >
                    <img
                      src={items[index].image}
                      alt={items[index].alt}
                      className="q-img10"
                    />

                    {canPlayAudio && (
                      <FaVolumeUp
                        aria-hidden="true"
                        className={`correct-word-audio-icon ${
                          isPlaying ? "audio-playing" : ""
                        }`}
                      />
                    )}
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
          <button onClick={reset} className="try-again-button">
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
        {activeLetter ? (
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
            {activeLetter}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit2_Page10_Q4;
