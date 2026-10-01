import { useRef, useState } from "react";

import conversation from "../../../assets/U1 WB/U2/U2P9EXEB-01.svg";
import conversation2 from "../../../assets/U1 WB/U2/U2P9EXEB-02.svg";

import img1 from "../../../assets/U1 WB/U2/U2P9EXEB-03.svg";
import img2 from "../../../assets/U1 WB/U2/U2P9EXEB-04.svg";
import img3 from "../../../assets/U1 WB/U2/U2P9EXEB-05.svg";
import img4 from "../../../assets/U1 WB/U2/U2P9EXEB-06.svg";

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

import "./WB_Unit2_Page1_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// ======================================================
// AUDIOS
// ======================================================

import fiveAudio from "../../../assets/U1 WB/U2/page_9/Item_001_five.mp3";

import fiveYearsAudio from "../../../assets/U1 WB/U2/page_9/Item_002_I'm_five_years_old.mp3";

import fourYearsAudio from "../../../assets/U1 WB/U2/page_9/Item_002_I'm_four_years_old.mp3";

import sevenYearsAudio from "../../../assets/U1 WB/U2/page_9/Item_003_I'm_seven_years_old.mp3";

import howOldAreYouAudio from "../../../assets/U1 WB/U2/page_9/Item_004_How_old_are_you.mp3";

// ======================================================
// BANK WORD
// ======================================================

function BankWord({
  word,
  id,
  isUsed,
  disabled,
  audio,
  playingId,
  onPlayAudio,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed || disabled,
  });

  const audioId = `bank-${word}`;

  const isPlaying = playingId === audioId;

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

          if (isDragging) return;

          onPlayAudio(audioId, audio);
        }}
        style={{
          padding: "4px 8px",

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
  extraClass,
  showAnswer,
  locked,
  onClear,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,

    disabled: showAnswer || locked,
  });

  return (
    <input
      ref={setNodeRef}
      type="text"
      value={value}
      className={`answer-input-unit7-p2-q3 ${extraClass ?? ""} ${
        isOver && !showAnswer && !locked ? "drag-over-cell" : ""
      }`}
      readOnly
      disabled={showAnswer || locked}
      onClick={() => {
        if (value && !showAnswer && !locked) {
          onClear(id);
        }
      }}
      style={{
        textAlign: "center",

        cursor: value && !showAnswer && !locked ? "pointer" : "default",
      }}
    />
  );
}

// ======================================================
// MAIN
// ======================================================

const WB_Unit2_Page1_Q2 = () => {
  // ======================================================
  // QUESTIONS
  // ======================================================

  const questions = [
    {
      id: 1,

      img: conversation2,

      secImg: img2,

      question: "How old are you?",

      questionAudio: howOldAreYouAudio,

      type: "word",

      prefix: "years old",

      correct: "five",

      optionAudio: fiveAudio,

      fullSentence: "I'm five years old.",

      fullAudio: fiveYearsAudio,
    },

    {
      id: 2,

      img: conversation,

      secImg: img3,

      question: "How old are you?",

      questionAudio: howOldAreYouAudio,

      type: "full",

      correct: "I'm four years old",

      optionAudio: fourYearsAudio,

      fullSentence: "I'm four years old.",

      fullAudio: fourYearsAudio,
    },

    {
      id: 3,

      img: img1,

      secImg: img4,

      question: "How old are you?",

      questionAudio: howOldAreYouAudio,

      type: "full",

      correct: "I'm seven years old",

      optionAudio: sevenYearsAudio,

      fullSentence: "I'm seven years old.",

      fullAudio: sevenYearsAudio,
    },
  ];

  const correctAnswers = {
    q1: "five",

    q2: "I'm four years old",

    q3: "I'm seven years old",
  };

  // ======================================================
  // ANSWERS
  // ======================================================

  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });

  const [wrongInputs, setWrongInputs] = useState([]);

  // الصح فقط يتقفل
  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // true فقط بعد النجاح الكامل
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  // ======================================================
  // AUDIO
  // ======================================================

  const audioRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      // أي صوت يتوقف يرجع للبداية
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingId(null);
  };

  const playAudio = (id, src) => {
    if (!src) {
      return;
    }

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingId(id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const isQuestionLocked = (id) => lockedQuestions.includes(id);

  const usedWords = Object.values(answers).filter((word) => word !== "");

  const getOptionAudio = (word) => {
    if (word === "five") {
      return fiveAudio;
    }

    if (word === "I'm four years old") {
      return fourYearsAudio;
    }

    if (word === "I'm seven years old") {
      return sevenYearsAudio;
    }

    return null;
  };

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
    const parts = event.active.id.split("-");

    const word = parts.slice(1, parts.length - 1).join("-");

    setActiveWord(word);
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

    const parts = active.id.split("-");

    const draggedWord = parts.slice(1, parts.length - 1).join("-");

    const key = String(over.id);

    if (!Object.prototype.hasOwnProperty.call(answers, key)) {
      return;
    }

    const questionId = Number(key.replace("q", ""));

    /*
      الخانة الصح المقفلة ممنوع تتغير.
    */

    if (isQuestionLocked(questionId)) {
      return;
    }

    /*
      لو الخيار نفسه موجود في سؤال صح مقفول
      ما بنسمح نسحبه منه.
    */

    const oldKey = Object.keys(answers).find(
      (answerKey) => answers[answerKey] === draggedWord,
    );

    if (oldKey) {
      const oldQuestionId = Number(oldKey.replace("q", ""));

      if (isQuestionLocked(oldQuestionId)) {
        return;
      }
    }

    const newAnswers = {
      ...answers,
    };

    Object.keys(newAnswers).forEach((k) => {
      if (newAnswers[k] === draggedWord) {
        newAnswers[k] = "";
      }
    });

    newAnswers[key] = draggedWord;

    setAnswers(newAnswers);

    /*
      شيل X فقط عن السؤال/الأسئلة
      اللي تغيرت.
    */

    setWrongInputs((prev) =>
      prev.filter(
        (id) =>
          id !== questionId &&
          id !== (oldKey ? Number(oldKey.replace("q", "")) : null),
      ),
    );
  };

  // ======================================================
  // CLEAR
  // ======================================================

  const handleClear = (cellId) => {
    const qIndex = Number(cellId.replace("q", ""));

    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,

      [cellId]: "",
    }));

    /*
      X تنشال فقط من نفس السؤال.
    */

    setWrongInputs((prev) => prev.filter((id) => id !== qIndex));
  };

  // ======================================================
  // CHECK
  // ======================================================

  const handleCheck = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const userValues = Object.values(answers);

    if (userValues.some((value) => value.trim() === "")) {
      ValidationAlert.info("Please complete all answers.");

      return;
    }

    const correctQuestions = [];

    const wrong = [];

    let correctCount = 0;

    questions.forEach((q) => {
      const key = `q${q.id}`;

      const studentAnswer = answers[key]?.trim().toLowerCase();

      const correctAnswer = correctAnswers[key].trim().toLowerCase();

      if (studentAnswer === correctAnswer) {
        correctCount++;

        correctQuestions.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    // ====================================================
    // LOCK CORRECT ONLY
    // ====================================================

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...correctQuestions])),
    );

    // ====================================================
    // WRONG ONLY
    // ====================================================

    setWrongInputs(wrong);

    const total = questions.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount}/${total}
        </span>
      </div>
    `;

    // ====================================================
    // ALL CORRECT
    // ====================================================

    if (correctCount === total) {
      setLockedQuestions(questions.map((q) => q.id));

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

    setAnswers({
      q1: correctAnswers.q1,

      q2: correctAnswers.q2,

      q3: correctAnswers.q3,
    });

    setWrongInputs([]);

    setLockedQuestions(questions.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ======================================================
  // RESET
  // ======================================================

  const handleReset = () => {
    stopAudio();

    setWrongInputs([]);

    setAnswers({
      q1: "",
      q2: "",
      q3: "",
    });

    setLockedQuestions([]);

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
            gap: "5px",
          }}
        >
          <ExerciseHeader
            sectionLetter="B"
            title="Read, look, and answer."
            subTitle="Count the candles and drag the matching age sentence to the child."
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

              margin: "10px 0",

              alignItems: "center",

              width: "100%",

              justifyContent: "center",
            }}
          >
            {Object.values(correctAnswers).map((word, i) => (
              <BankWord
                key={`bank-${word}-${i}`}
                id={`bank-${word}-${i}`}
                word={word}
                audio={getOptionAudio(word)}
                playingId={playingId}
                onPlayAudio={playAudio}
                isUsed={usedWords.includes(word)}
                disabled={showAnswer || checkCompleted}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div>
            {questions.map((q, index) => {
              const questionLocked = isQuestionLocked(q.id);

              const canPlayFullSentence = questionLocked || showAnswer;

              const questionAudioPlaying = playingId === `question-${q.id}`;

              const fullAudioPlaying = playingId === `full-${q.id}`;

              return (
                <div key={q.id} className="question-row-unit7-p2-q3">
                  {/* ======================================
                        LEFT FIXED QUESTION
                    ====================================== */}

                  <div className="question-container-unit7-p6-q3">
                    <span className="num2">{index + 1}</span>

                    <img src={q.img} className="avatar-img-wb-u2-q1" alt="" />

                    <div
                      onClick={() =>
                        playAudio(`question-${q.id}`, q.questionAudio)
                      }
                      style={{
                        display: "inline-flex",

                        alignItems: "center",

                        gap: "7px",

                        cursor: "pointer",

                        border: "2px solid transparent",

                        borderRadius: "8px",

                        padding: "3px 6px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#2c5287";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                    >
                      <p className="question-text-unit7-p2-q3">{q.question}</p>

                      {questionAudioPlaying && (
                        <FaVolumeUp size={18} aria-hidden="true" />
                      )}
                    </div>
                  </div>

                  {/* ======================================
                        RIGHT ANSWER SIDE
                    ====================================== */}

                  <div
                    style={{
                      display: "flex",

                      alignItems: "center",
                    }}
                  >
                    <img
                      src={q.secImg}
                      className="avatar-img-wb-u2-q1"
                      alt=""
                    />

                    <div
                      className="sentence-box-unit7-p2-q3"
                      style={{
                        position: "relative",
                      }}
                    >
                      {/* ================================
                            FULL ANSWER
                        ================================ */}

                      {q.type === "full" && (
                        <DroppableInput
                          id={`q${q.id}`}
                          value={answers[`q${q.id}`]}
                          showAnswer={showAnswer}
                          locked={questionLocked}
                          onClear={handleClear}
                        />
                      )}

                      {/* ================================
                            WORD ANSWER
                        ================================ */}

                      {q.type === "word" && (
                        <p className="answer-line-unit7-p2-q3">
                          I'm{" "}
                          <DroppableInput
                            id={`q${q.id}`}
                            value={answers[`q${q.id}`]}
                            extraClass="small"
                            showAnswer={showAnswer}
                            locked={questionLocked}
                            onClear={handleClear}
                          />{" "}
                          {q.prefix}.
                        </p>
                      )}

                      {/* ================================
                            WRONG X
                        ================================ */}

                      {wrongInputs.includes(q.id) && (
                        <span className="wrong-mark">✕</span>
                      )}

                      {/* ================================
                            FULL SENTENCE AUDIO
                            تظهر بعد Check الصح فقط
                        ================================ */}

                      {canPlayFullSentence && (
                        <button
                          type="button"
                          onClick={() => playAudio(`full-${q.id}`, q.fullAudio)}
                          aria-label={`Play ${q.fullSentence}`}
                          style={{
                            marginLeft: "8px",

                            border: "2px solid transparent",

                            borderRadius: "8px",

                            background: "transparent",

                            cursor: "pointer",

                            padding: "4px 6px",

                            display: "inline-flex",

                            alignItems: "center",

                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#2c5287";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "transparent";
                          }}
                        >
                          <FaVolumeUp size={fullAudioPlaying ? 20 : 18} />
                        </button>
                      )}
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
            className="show-answer-btn swal-continue"
            onClick={handleShowAnswer}
          >
            Show Answer
          </button>

          <button onClick={handleCheck} className="check-button2">
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

export default WB_Unit2_Page1_Q2;
