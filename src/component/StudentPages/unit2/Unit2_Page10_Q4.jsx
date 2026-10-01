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
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import "./Unit2_Page10_Q4.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// ─────────────────────────────────────────────────────────────
// DRAGGABLE LETTER
// ─────────────────────────────────────────────────────────────

const DraggableWord = ({ id, letter, disabled }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });

  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: "7px 14px",
        border: "2px solid #2c5287",
        borderRadius: "8px",
        background: "white",
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

// ─────────────────────────────────────────────────────────────
// DROP SLOT
// ─────────────────────────────────────────────────────────────

const DropSlot = ({ index, value, isWrong, showAnswer, locked, onRemove }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,

    disabled: showAnswer || locked,
  });

  return (
    <div
      ref={setNodeRef}
      className={`q-input10-unit2-p10-q4 ${
        showAnswer ? "show-answer-red1" : ""
      } ${isOver && !locked && !showAnswer ? "drag-over-cell" : ""}`}
    >
      {value && (
        <span
          className="word-item"
          onClick={!showAnswer && !locked ? onRemove : undefined}
          style={{
            cursor: showAnswer || locked ? "default" : "pointer",

            userSelect: "none",

            display: "inline-flex",

            alignItems: "center",

            gap: "3px",
          }}
          title={showAnswer || locked ? "" : "Click to remove"}
        >
          {value}
        </span>
      )}

      {isWrong && !showAnswer && <span className="error-mark-input">✕</span>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const Unit2_Page10_Q4 = () => {
  // ======================================================
  // DATA
  // ======================================================

  const correctAnswers = ["p", "b", "p", "p"];

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

  // ======================================================
  // STATE
  // ======================================================

  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeLetter, setActiveLetter] = useState(null);

  // ======================================================
  // AUDIO
  // ======================================================

  const audioRef = useRef(null);

  const [playingIndex, setPlayingIndex] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      // لما يشتغل صوت ثاني
      // رجع السابق للبداية
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

  // ======================================================
  // HELPERS
  // ======================================================

  const isInputLocked = (index) => lockedInputs.includes(index);

  // ======================================================
  // SENSORS
  // ======================================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // ======================================================
  // DRAG START
  // ======================================================

  const onDragStart = ({ active }) => {
    setActiveLetter(active.id.replace("bank-", ""));
  };

  // ======================================================
  // DRAG END
  // ======================================================

  const onDragEnd = ({ active, over }) => {
    setActiveLetter(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const letter = active.id.replace("bank-", "");

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const index = Number(String(over.id).split("-")[1]);

    /*
      إذا الخانة صح ومقفلة
      ممنوع نعدلها
    */

    if (isInputLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = letter;

    setAnswers(updated);

    /*
      شيل X فقط عن نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  const onDragCancel = () => {
    setActiveLetter(null);
  };

  // ======================================================
  // REMOVE ANSWER
  // ======================================================

  const removeAnswer = (index) => {
    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    const updated = [...answers];

    updated[index] = "";

    setAnswers(updated);

    /*
      شيل X فقط عن نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  // ======================================================
  // CHECK ANSWERS
  // ======================================================

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

    // ====================================================
    // LOCK CORRECT ONLY
    // ====================================================

    setLockedInputs((prev) => Array.from(new Set([...prev, ...correctTemp])));

    // ====================================================
    // WRONG ONLY
    // ====================================================

    setWrongInputs(wrong);

    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${score} / ${total}
          </span>
        </div>
      `;

    // ====================================================
    // ALL CORRECT
    // ====================================================

    if (score === total) {
      setLockedInputs(correctAnswers.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    // ====================================================
    // WRONG / PARTIAL
    // ====================================================

    if (score === 0) {
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

    setAnswers([...correctAnswers]);

    setWrongInputs([]);

    setLockedInputs(correctAnswers.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    stopAudio();

    setAnswers(["", "", "", ""]);

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveLetter(null);
  };

  // ======================================================
  // RENDER
  // ======================================================

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
                        onRemove={() => removeAnswer(index)}
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
                  >
                    <img
                      src={items[index].image}
                      alt={items[index].alt}
                      className="q-img10"
                    />

                    {/* ==================================
                          ICON
                          تظهر فقط للإجابة الصح
                      ================================== */}

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
