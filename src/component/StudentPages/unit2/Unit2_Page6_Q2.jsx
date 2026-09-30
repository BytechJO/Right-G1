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

import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import cake from "../../../assets/img_unit2/imgs/Cake1.jpg";
import balloon from "../../../assets/img_unit2/imgs/Baloon1.jpg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page6_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   ضعي هنا مسارات أصوات الجمل الحقيقية
===================================================== */

// عدّلي المسارات حسب أسماء الملفات عندك
import cakeSentenceSound from "../../../assets/unit2/Page 15 - E/Happy birthday! Here is a cake..mp3";
import balloonSentenceSound from "../../../assets/unit2/Page 15 - E/Happy birthday! Here is a ballon..mp3";
import presentSentenceSound from "../../../assets/unit2/Page 15 - E/Happy birthday! Here is a present..mp3";

/* =====================================================
   DATA
===================================================== */

const exerciseData = {
  pairs: [
    {
      id: "pair-1",
      letter: "1",
      content: "Happy birthday! Here is a cake",
      sound: cakeSentenceSound,
    },
    {
      id: "pair-2",
      letter: "2",
      content: "Happy birthday! Here is a balloon",
      sound: balloonSentenceSound,
    },
    {
      id: "pair-3",
      letter: "3",
      content: "Happy birthday! Here is a present",
      sound: presentSentenceSound,
    },
  ],

  images: [
    {
      src: cake,
      alt: "Birthday cake",
    },
    {
      src: present,
      alt: "Birthday present",
    },
    {
      src: balloon,
      alt: "Orange balloon",
    },
  ],
};

/* =====================================================
   CORRECT ANSWERS
===================================================== */

const correctAnswers = {
  "drop-1": "pair-1",
  "drop-2": "pair-3",
  "drop-3": "pair-2",
};

/* =====================================================
   INITIAL STATE
===================================================== */

const initialDroppedState = {
  "drop-1": null,
  "drop-2": null,
  "drop-3": null,
};

/* =====================================================
   WORD BANK ITEM
===================================================== */

const WordBankItem = ({
  pair,
  isUsed,
  showAnswer,
  activeSentenceAudio,
  onPlaySentence,
}) => {
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
    <div className="option-box2">
      {/* NUMBER */}
      <span
        ref={setNodeRef}
        style={style}
        className={`number-tag2 draggable-number${
          isDragging ? " dragging" : ""
        }`}
        {...(isUsed || showAnswer
          ? {}
          : {
              ...listeners,
              ...attributes,
            })}
      >
        {pair.letter}
      </span>

      {/* SENTENCE + AUDIO */}
      <span
        className="option-text2"
        onClick={() => onPlaySentence(pair.sound, pair.id)}
        style={{
          cursor: "pointer",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {pair.content}

        {activeSentenceAudio === pair.id && (
          <FaVolumeUp
            size={20}
            style={{
              flexShrink: 0,
              pointerEvents: "none",
            }}
          />
        )}
      </span>
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
      className="circle-number2"
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
  imageData,
  droppedPairId,
  isWrong,
  isLocked,
  showAnswer,
  onReturn,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,

    disabled: showAnswer || isLocked,
  });

  const droppedPair = droppedPairId
    ? exerciseData.pairs.find((pair) => pair.id === droppedPairId)
    : null;

  return (
    <div className="image-row2">
      {/* DROP CIRCLE */}

      <div
        ref={setNodeRef}
        className={`drop-circle2${isOver ? " drop2-hover" : ""}`}
        style={{
          position: "relative",
        }}
      >
        {isWrong && <div className="wrong-x3">✕</div>}

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

      {/* IMAGE */}

      <img src={imageData.src} alt={imageData.alt} className="person-img2" />
    </div>
  );
};

/* =====================================================
   WORD BANK
===================================================== */

const WordBank = ({
  pairs,
  usedPairIds,
  showAnswer,
  activeSentenceAudio,
  onPlaySentence,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "letters2",
  });

  return (
    <div
      ref={setNodeRef}
      className="right-side2"
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
          activeSentenceAudio={activeSentenceAudio}
          onPlaySentence={onPlaySentence}
        />
      ))}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit2_Page6_Q2 = () => {
  const [droppedLetters, setDroppedLetters] = useState({
    ...initialDroppedState,
  });

  const [wrongDrops, setWrongDrops] = useState([]);

  // الخانات الصح بعد Check
  const [lockedDrops, setLockedDrops] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // بعد أول Check كامل وصحيح
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeDrag, setActiveDrag] = useState(null);

  /* =====================================================
     SENTENCE AUDIO
  ===================================================== */

  const sentenceAudioRef = useRef(null);

  const [activeSentenceAudio, setActiveSentenceAudio] = useState(null);

  const playSentence = (src, pairId) => {
    if (!sentenceAudioRef.current) {
      return;
    }

    sentenceAudioRef.current.pause();

    sentenceAudioRef.current.currentTime = 0;

    sentenceAudioRef.current.src = src;

    setActiveSentenceAudio(pairId);

    sentenceAudioRef.current.play().catch((error) => {
      console.log("Sentence audio error:", error);

      setActiveSentenceAudio(null);
    });

    sentenceAudioRef.current.onended = () => {
      setActiveSentenceAudio(null);
    };
  };

  /* =====================================================
     USED PAIRS
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
       لا تحرك خانة صح مقفلة
    ============================= */

    if (source === "drop" && lockedDrops.includes(fromDropId)) {
      return;
    }

    /* =============================
       لا تحط فوق خانة صح
    ============================= */

    if (toId !== "letters2" && lockedDrops.includes(toId)) {
      return;
    }

    setDroppedLetters((prev) => {
      const next = {
        ...prev,
      };

      /* Drag from old drop */

      if (source === "drop") {
        next[fromDropId] = null;
      }

      /* Return to word bank */

      if (toId === "letters2") {
        return next;
      }

      /* Put in new target */

      next[toId] = pairId;

      return next;
    });

    /* =============================
       REMOVE X ONLY FROM EDITED DROP
    ============================= */

    setWrongDrops((prev) => {
      let updated = [...prev];

      if (source === "drop") {
        updated = updated.filter((id) => id !== fromDropId);
      }

      if (toId !== "letters2") {
        updated = updated.filter((id) => id !== toId);
      }

      return updated;
    });
  };

  /* =====================================================
     RETURN TO BANK
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

    if (sentenceAudioRef.current) {
      sentenceAudioRef.current.pause();

      sentenceAudioRef.current.currentTime = 0;
    }

    setActiveSentenceAudio(null);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const handleCheckAnswers = () => {
    /* بعد النجاح النهائي
         أي Check ثاني ما يعمل شيء */

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

    /* =============================
         LOCK CORRECT ONLY
      ============================= */

    setLockedDrops((prev) => Array.from(new Set([...prev, ...correctTemp])));

    /* =============================
         SHOW X ON WRONG ONLY
      ============================= */

    setWrongDrops(wrongTemp);

    /* =============================
         SCORE
      ============================= */

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    /* =============================
         ALL CORRECT
      ============================= */

    if (correctCount === total) {
      setLockedDrops(Object.keys(correctAnswers));

      setWrongDrops([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    /* =============================
         WRONG / PARTIAL
      ============================= */

    if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
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
        {/* SENTENCE AUDIO */}

        <audio
          ref={sentenceAudioRef}
          style={{
            display: "none",
          }}
        />

        <div
          className="div-forall"
          style={{
            gap: "30px",
          }}
        >
          <ExerciseHeader
            sectionLetter="E"
            title="Look, read, and choose."
            subTitle="Use the numbered birthday picture to complete each sentence."
          />

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="layout2 w-full">
              {/* =====================
                  LEFT — IMAGES
              ===================== */}

              <div className="left-side2">
                {exerciseData.images.map((imageData, index) => {
                  const dropId = `drop-${index + 1}`;

                  return (
                    <DropCircle
                      key={dropId}
                      dropId={dropId}
                      imageData={imageData}
                      droppedPairId={droppedLetters[dropId]}
                      isWrong={wrongDrops.includes(dropId)}
                      isLocked={lockedDrops.includes(dropId)}
                      showAnswer={showAnswer}
                      onReturn={handleReturnToBank}
                    />
                  );
                })}
              </div>

              {/* =====================
                  RIGHT — SENTENCES
              ===================== */}

              <WordBank
                pairs={exerciseData.pairs}
                usedPairIds={usedPairIds}
                showAnswer={showAnswer}
                activeSentenceAudio={activeSentenceAudio}
                onPlaySentence={playSentence}
              />
            </div>

            {/* =====================
                DRAG OVERLAY
            ===================== */}

            <DragOverlay>
              {activeDrag ? (
                <div
                  className="number-tag2 draggable-number dragging"
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
    </>
  );
};

export default Unit2_Page6_Q2;
