import React, { useState, useRef } from "react";

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

import { CSS } from "@dnd-kit/utilities";

import girl1 from "../../../assets/img_unit2/imgs/girl1.jpg";
import girl2 from "../../../assets/img_unit2/imgs/girl2.jpg";
import boy1 from "../../../assets/img_unit2/imgs/boy1.jpg";
import boy2 from "../../../assets/img_unit2/imgs/boy2.jpg";

import sound1 from "../../../assets/unit1/sounds/P15QD.mp3";

import stella from "../../../assets/img_unit2/sounds-unit2/Pg15_1.1_Stella.mp3";
import tom from "../../../assets/img_unit2/sounds-unit2/Pg15_1.2_Tom.mp3";
import harley from "../../../assets/img_unit2/sounds-unit2/Pg15_1.3_Harley.mp3";
import helen from "../../../assets/img_unit2/sounds-unit2/Pg15_1.4_Helen.mp3";

import "./Unit2_Page6_Q1.css";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   DATA
===================================================== */

const exerciseData = {
  pairs: [
    {
      id: "pair-1",
      letter: "1",
      content: "January",
    },
    {
      id: "pair-2",
      letter: "2",
      content: "November",
    },
    {
      id: "pair-3",
      letter: "3",
      content: "May",
    },
    {
      id: "pair-4",
      letter: "4",
      content: "August",
    },
  ],

  images: [
    {
      img: girl1,
      sound: stella,
    },
    {
      img: girl2,
      sound: helen,
    },
    {
      img: boy1,
      sound: tom,
    },
    {
      img: boy2,
      sound: harley,
    },
  ],
};

/* =====================================================
   CORRECT ANSWERS
===================================================== */

const correctAnswers = {
  "drop-1": "pair-1",
  "drop-2": "pair-4",
  "drop-3": "pair-2",
  "drop-4": "pair-3",
};

/* =====================================================
   INITIAL STATE
===================================================== */

const initialDroppedState = {
  "drop-1": null,
  "drop-2": null,
  "drop-3": null,
  "drop-4": null,
};

/* =====================================================
   AUDIO
===================================================== */

const stopAtSecond = 4.5;

const captions = [
  {
    start: 0,
    end: 4.27,
    text: "Page 15, Exercise D. Listen and choose.",
  },
  {
    start: 4.29,
    end: 6.24,
    text: "1-January",
  },
  {
    start: 6.26,
    end: 8.28,
    text: "2-November",
  },
  {
    start: 8.3,
    end: 10.12,
    text: "3-May",
  },
  {
    start: 10.14,
    end: 12.07,
    text: "4-August",
  },
];

/* =====================================================
   WORD BANK ITEM
===================================================== */

const WordBankItem = ({ pair, isUsed, showAnswer }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `bank-${pair.id}`,

      data: {
        pairId: pair.id,
        letter: pair.letter,
        source: "bank",
      },

      disabled: isUsed || showAnswer,
    });

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isDragging ? 0.35 : isUsed ? 0.35 : 1,

    cursor: isUsed || showAnswer ? "default" : "grab",

    filter: isUsed ? "grayscale(60%)" : "none",

    transition: "opacity 0.2s, filter 0.2s",

    userSelect: "none",
  };

  return (
    <div className="option-box">
      <span
        ref={setNodeRef}
        style={style}
        className={`number-tag draggable-number${
          isUsed ? " number-tag--used" : ""
        }${isDragging ? " dragging" : ""}`}
        {...(isUsed || showAnswer
          ? {}
          : {
              ...listeners,
              ...attributes,
            })}
      >
        {pair.letter}
      </span>

      <span className="month-label">{pair.content}</span>
    </div>
  );
};

/* =====================================================
   PLACED NUMBER
===================================================== */

const PlacedNumber = ({
  pairId,
  letter,
  dropId,
  showAnswer,
  isLocked,
  onReturn,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed-${dropId}`,

      data: {
        pairId,
        letter,
        source: "drop",
        dropId,
      },

      disabled: showAnswer || isLocked,
    });

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isDragging ? 0.35 : 1,

    cursor: showAnswer || isLocked ? "default" : "pointer",

    userSelect: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="circle-number"
      {...(showAnswer || isLocked
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      onClick={() => {
        if (showAnswer || isLocked) {
          return;
        }

        onReturn(dropId);
      }}
    >
      {letter}
    </div>
  );
};

/* =====================================================
   DROP CIRCLE
===================================================== */

const DropCircle = ({
  dropId,
  imgData,
  droppedPairId,
  isWrong,
  isLocked,
  showAnswer,
  onReturn,
  onPlaySound,
  imageIndex,
  activeAudioIndex,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,

    disabled: showAnswer || isLocked,
  });

  const droppedPair = droppedPairId
    ? exerciseData.pairs.find((pair) => pair.id === droppedPairId)
    : null;

  return (
    <div className="image-row">
      {/* =========================
          IMAGE + AUDIO ICON
      ========================= */}

      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <img
          src={imgData.img}
          alt=""
          className="person-img"
          style={{
            cursor: "pointer",
          }}
          onClick={() => onPlaySound(imgData.sound, imageIndex)}
        />

        {activeAudioIndex === imageIndex && (
          <FaVolumeUp
            size={24}
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* =========================
          DROP
      ========================= */}

      <div
        ref={setNodeRef}
        className={`drop-circle${isOver ? " drop-hover" : ""}`}
        style={{
          position: "relative",
        }}
      >
        {/* WRONG */}

        {isWrong && <div className="wrong-x3">✕</div>}

        {/* NUMBER */}

        {droppedPair && (
          <PlacedNumber
            pairId={droppedPair.id}
            letter={droppedPair.letter}
            dropId={dropId}
            showAnswer={showAnswer}
            isLocked={isLocked}
            onReturn={onReturn}
          />
        )}
      </div>
    </div>
  );
};

/* =====================================================
   WORD BANK
===================================================== */

const WordBank = ({ pairs, usedPairIds, showAnswer }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "letters",
  });

  return (
    <div
      ref={setNodeRef}
      className="right-side"
      style={{
        background: isOver ? "rgba(28,61,126,0.06)" : undefined,

        transition: "background 0.2s",
      }}
    >
      {pairs.map((pair) => (
        <WordBankItem
          key={pair.id}
          pair={pair}
          isUsed={usedPairIds.has(pair.id)}
          showAnswer={showAnswer}
        />
      ))}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit2_Page6_Q1 = () => {
  const [droppedLetters, setDroppedLetters] = useState({
    ...initialDroppedState,
  });

  const [wrongDrops, setWrongDrops] = useState([]);

  // الخانات الصح بعد Check
  const [lockedDrops, setLockedDrops] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // بعد Check ناجح بالكامل
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeDrag, setActiveDrag] = useState(null);

  /* =====================================================
     CLICK AUDIO
  ===================================================== */

  const clickAudioRef = useRef(null);

  const [activeAudioIndex, setActiveAudioIndex] = useState(null);

  const playSound = (src, index) => {
    if (!clickAudioRef.current) {
      return;
    }

    clickAudioRef.current.pause();

    clickAudioRef.current.currentTime = 0;

    clickAudioRef.current.src = src;

    setActiveAudioIndex(index);

    clickAudioRef.current.play().catch((error) => {
      console.log("Audio error:", error);

      setActiveAudioIndex(null);
    });

    clickAudioRef.current.onended = () => {
      setActiveAudioIndex(null);
    };
  };

  /* =====================================================
     USED NUMBERS
  ===================================================== */

  const usedPairIds = new Set(Object.values(droppedLetters).filter(Boolean));

  /* =====================================================
     SENSORS
  ===================================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = (event) => {
    setActiveDrag(event.active.data.current);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = (event) => {
    setActiveDrag(null);

    if (showAnswer) return;

    const { active, over } = event;

    if (!over) return;

    const { pairId, source, dropId: fromDropId } = active.data.current;

    const toId = over.id;

    /* =============================
       لو المصدر خانة صح مقفلة
    ============================= */

    if (source === "drop" && lockedDrops.includes(fromDropId)) {
      return;
    }

    /* =============================
       لو الهدف خانة صح مقفلة
    ============================= */

    if (toId !== "letters" && lockedDrops.includes(toId)) {
      return;
    }

    setDroppedLetters((prev) => {
      const next = {
        ...prev,
      };

      /* -------------------------
           Drag from old drop
        ------------------------- */

      if (source === "drop") {
        next[fromDropId] = null;
      }

      /* -------------------------
           Return to bank
        ------------------------- */

      if (toId === "letters") {
        return next;
      }

      /* -------------------------
           Put in target
        ------------------------- */

      next[toId] = pairId;

      return next;
    });

    /* =============================
       REMOVE WRONG X
    ============================= */

    setWrongDrops((prev) => {
      let updated = [...prev];

      if (source === "drop") {
        updated = updated.filter((id) => id !== fromDropId);
      }

      if (toId !== "letters") {
        updated = updated.filter((id) => id !== toId);
      }

      return updated;
    });
  };

  /* =====================================================
     CLICK TO RETURN
  ===================================================== */

  const handleReturnToBank = (dropZoneId) => {
    if (showAnswer || lockedDrops.includes(dropZoneId)) {
      return;
    }

    setDroppedLetters((prev) => ({
      ...prev,

      [dropZoneId]: null,
    }));

    setWrongDrops((prev) => prev.filter((id) => id !== dropZoneId));
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setDroppedLetters({
      ...initialDroppedState,
    });

    setWrongDrops([]);

    setLockedDrops([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveDrag(null);

    if (clickAudioRef.current) {
      clickAudioRef.current.pause();

      clickAudioRef.current.currentTime = 0;
    }

    setActiveAudioIndex(null);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const handleCheckAnswers = () => {
    // بعد النجاح النهائي
    // أي Check ثاني ما يعمل شيء
    if (showAnswer || checkCompleted) {
      return;
    }

    const allFilled = Object.values(droppedLetters).every(
      (value) => value !== null,
    );

    if (!allFilled) {
      ValidationAlert.info("Incomplete!", "Please complete all drop zones.");

      return;
    }

    let correctCount = 0;

    const total = exerciseData.pairs.length;

    const wrongTemp = [];

    const correctTemp = [];

    Object.keys(droppedLetters).forEach((dropId) => {
      if (droppedLetters[dropId] === correctAnswers[dropId]) {
        correctCount++;

        correctTemp.push(dropId);
      } else {
        wrongTemp.push(dropId);
      }
    });

    /* =========================
         LOCK CORRECT ONLY
      ========================= */

    setLockedDrops((prev) => Array.from(new Set([...prev, ...correctTemp])));

    /* =========================
         WRONG ONLY
      ========================= */

    setWrongDrops(wrongTemp);

    /* =========================
         SCORE
      ========================= */

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;margin-top:10px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    /* =========================
         ALL CORRECT
      ========================= */

    if (correctCount === total) {
      setLockedDrops(Object.keys(correctAnswers));

      setWrongDrops([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =========================
         WRONG / PARTIAL
      ========================= */

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    setDroppedLetters({
      ...correctAnswers,
    });

    setWrongDrops([]);

    setLockedDrops(Object.keys(correctAnswers));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <>
      <div
        style={{
          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          padding: "30px",
        }}
      >
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="D"
            title="Listen and choose."
            subTitle="Listen to each person, then drag the matching month to the correct picture."
          />

          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId="unit2-page15-1"
          />

          <div className="u2-container">
            <audio
              ref={clickAudioRef}
              style={{
                display: "none",
              }}
            />

            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="layout">
                {/* =====================
                    LEFT SIDE
                ===================== */}

                <div className="left-side">
                  {exerciseData.images.map((imgData, index) => {
                    const dropId = `drop-${index + 1}`;

                    return (
                      <DropCircle
                        key={dropId}
                        dropId={dropId}
                        imgData={imgData}
                        droppedPairId={droppedLetters[dropId]}
                        isWrong={wrongDrops.includes(dropId)}
                        isLocked={lockedDrops.includes(dropId)}
                        showAnswer={showAnswer}
                        onReturn={handleReturnToBank}
                        onPlaySound={playSound}
                        imageIndex={index}
                        activeAudioIndex={activeAudioIndex}
                      />
                    );
                  })}
                </div>

                {/* =====================
                    RIGHT SIDE
                ===================== */}

                <WordBank
                  pairs={exerciseData.pairs}
                  usedPairIds={usedPairIds}
                  showAnswer={showAnswer}
                />
              </div>

              {/* =====================
                  DRAG OVERLAY
              ===================== */}

              <DragOverlay>
                {activeDrag ? (
                  <div
                    className="number-tag draggable-number dragging"
                    style={{
                      cursor: "grabbing",

                      opacity: 0.9,

                      boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                    }}
                  >
                    {activeDrag.letter}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={handleCheckAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </>
  );
};

export default Unit2_Page6_Q1;
