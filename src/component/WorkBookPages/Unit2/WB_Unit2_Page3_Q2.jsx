import React, { useRef, useState } from "react";

import bat from "../../../assets/U1 WB/U2/U2P11EXEF-01.svg";
import cap from "../../../assets/U1 WB/U2/U2P11EXEF-02.svg";
import ant from "../../../assets/U1 WB/U2/U2P11EXEF-03.svg";
import dad from "../../../assets/U1 WB/U2/U2P11EXEF-04.svg";

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

import "./WB_Unit2_Page3_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// ======================================================
// AUDIOS
// ======================================================

import tuesdayAudio from "../../../assets/U1 WB/U2/page_11/Item_001_Tuesday.mp3";
import saturdayAudio from "../../../assets/U1 WB/U2/page_11/Item_002_Saturday.mp3";
import sundayAudio from "../../../assets/U1 WB/U2/page_11/Item_003_Sunday.mp3";
import thursdayAudio from "../../../assets/U1 WB/U2/page_11/Item_004_Thursday.mp3";

// ======================================================
// DATA
// ======================================================

const correctAnswers = ["Saturday", "Tuesday", "Thursday", "Sunday"];

const wordBank = [
  {
    word: "Tuesday",
    audio: tuesdayAudio,
  },
  {
    word: "Saturday",
    audio: saturdayAudio,
  },
  {
    word: "Sunday",
    audio: sundayAudio,
  },
  {
    word: "Thursday",
    audio: thursdayAudio,
  },
];

const images = [bat, cap, ant, dad];

// ======================================================
// BANK WORD
// ======================================================

function BankWord({
  id,
  word,
  audio,
  isUsed,
  disabled,
  playingWord,
  onPlayAudio,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed || disabled,
  });

  const isPlaying = playingWord === word;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <span
        ref={setNodeRef}
        {...(!isUsed && !disabled
          ? {
              ...listeners,
              ...attributes,
            }
          : {})}
        onClick={(e) => {
          e.stopPropagation();

          if (isDragging) {
            return;
          }

          onPlayAudio(word, audio);
        }}
        style={{
          padding: "7px 14px",

          border: "2px solid #2c5287",

          borderRadius: "8px",

          background: "white",

          fontWeight: "bold",

          cursor: isUsed || disabled ? "pointer" : "grab",

          opacity: isDragging ? 0.4 : isUsed ? 0.5 : 1,

          userSelect: "none",

          touchAction: "none",

          display: "inline-block",

          ...(isUsed
            ? {
                borderColor: "#ccc",

                color: "#aaa",
              }
            : {}),
        }}
      >
        {word}
      </span>

      {/* =================================================
          AUDIO ICON
          تظهر فقط أثناء تشغيل الصوت
      ================================================= */}

      {isPlaying && (
        <FaVolumeUp
          size={16}
          aria-hidden="true"
          style={{
            position: "absolute",

            top: "-8px",

            right: "-8px",

            background: "white",

            borderRadius: "50%",

            padding: "2px",

            pointerEvents: "none",

            zIndex: 10,
          }}
        />
      )}
    </span>
  );
}

// ======================================================
// DROPPABLE INPUT
// ======================================================

function DroppableInput({
  id,
  value,
  errorClass,
  isWrong,
  locked,
  showAnswer,
  onClear,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: locked || showAnswer,
  });

  return (
    <div
      className="input-wrapper-unit3-page6-q1"
      style={{
        position: "relative",
      }}
    >
      <input
        ref={setNodeRef}
        type="text"
        className={`q-input-wb-unit2-page3-q2 ${
          isOver && !locked && !showAnswer ? "drag-over-cell" : ""
        }`}
        value={value}
        readOnly
        disabled={locked || showAnswer}
        onClick={() => {
          if (value && !locked && !showAnswer) {
            onClear(id);
          }
        }}
        style={{
          background: isOver && !locked && !showAnswer ? "#e3f2fd" : "white",

          cursor: value && !locked && !showAnswer ? "pointer" : "default",
        }}
      />

      {isWrong && <span className={errorClass}>✕</span>}
    </div>
  );
}

// ======================================================
// MAIN
// ======================================================

const WB_Unit2_Page3_Q2 = () => {
  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [wrongInputs, setWrongInputs] = useState([]);

  // الصح يتقفل لحاله
  const [lockedInputs, setLockedInputs] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // true فقط عند النجاح الكامل
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  // ======================================================
  // AUDIO
  // ======================================================

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      // أي صوت يتوقف يرجع للبداية
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingWord(null);
  };

  const playAudio = (word, src) => {
    if (!src) {
      return;
    }

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const isInputLocked = (index) => lockedInputs.includes(index);

  const usedWords = answers.filter((w) => w !== "");

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
  // DRAG START
  // ======================================================

  const handleDragStart = (event) => {
    setActiveWord(event.active.id.replace("word-", ""));
  };

  // ======================================================
  // DRAG END
  // ======================================================

  const handleDragEnd = (event) => {
    setActiveWord(null);

    const { active, over } = event;

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("input-")) {
      return;
    }

    const word = active.id.replace("word-", "");

    const targetIndex = Number(String(over.id).replace("input-", ""));

    /*
      الخانة الصح المقفلة ما بتتعدل
    */

    if (isInputLocked(targetIndex)) {
      return;
    }

    /*
      نحدد مكان الكلمة القديم
      قبل setState
    */

    const sourceIndex = answers.findIndex((item) => item === word);

    /*
      لو الكلمة موجودة بخانة صح مقفلة
      ممنوع نقلها
    */

    if (sourceIndex !== -1 && isInputLocked(sourceIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      const source = updated.findIndex((w) => w === word);

      if (source === targetIndex) {
        return prev;
      }

      const targetWord = updated[targetIndex];

      updated[targetIndex] = word;

      /*
          لو الكلمة كانت بخانة ثانية
          نعمل swap
        */

      if (source !== -1) {
        updated[source] = targetWord || "";
      }

      return updated;
    });

    /*
      شيل X فقط عن الخانات اللي تغيرت
    */

    setWrongInputs((prev) =>
      prev.filter((i) => i !== targetIndex && i !== sourceIndex),
    );
  };

  // ======================================================
  // CLEAR
  // ======================================================

  const handleClear = (cellId) => {
    const index = Number(cellId.replace("input-", ""));

    if (showAnswer || checkCompleted || isInputLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = "";

      return updated;
    });

    /*
      شيل X فقط عن نفس الخانة
    */

    setWrongInputs((prev) => prev.filter((i) => i !== index));
  };

  // ======================================================
  // CHECK
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.some((ans) => ans.trim() === "")) {
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
        <div style="font-size:20px;margin-top:10px;text-align:center;">
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

    if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const showAnswers = () => {
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

    setActiveWord(null);
  };

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
        className="question-wrapper-unit3-page6-q1"
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
            sectionLetter="F"
            title="Look, read, and write."
            subTitle="Find the highlighted date pattern, then drag the correct day name to the calendar."
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
            {wordBank.map((item) => (
              <BankWord
                key={item.word}
                id={`word-${item.word}`}
                word={item.word}
                audio={item.audio}
                isUsed={usedWords.includes(item.word)}
                disabled={showAnswer || checkCompleted}
                playingWord={playingWord}
                onPlayAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              ROWS
          ================================================= */}

          <div className="row-content10-wb-unit2-page3-q2 w-full">
            {images.map((img, index) => {
              const locked = isInputLocked(index);

              return (
                <div
                  key={index}
                  className="row2-unit3-page6-q1"
                  style={{
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",

                      gap: "10px",
                    }}
                  >
                    <span className="num-span">{index + 1}</span>

                    <img src={img} alt="" className="q-img-wb-unit2-page3-q2" />
                  </div>

                  <DroppableInput
                    id={`input-${index}`}
                    value={answers[index]}
                    errorClass="error-mark-input-wb-unit2-page3-q2"
                    isWrong={wrongInputs.includes(index)}
                    locked={locked}
                    showAnswer={showAnswer}
                    onClear={handleClear}
                  />
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
            onClick={showAnswers}
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
              padding: "7px 14px",

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

export default WB_Unit2_Page3_Q2;
