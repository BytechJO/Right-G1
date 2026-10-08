import React, { useRef, useState } from "react";

import bat from "../../../assets/U1 WB/U6/U6P35EXEF-01.svg";
import cap from "../../../assets/U1 WB/U6/U6P35EXEF-02.svg";
import ant from "../../../assets/U1 WB/U6/U6P35EXEF-03.svg";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page3_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import canPlayViolinAudio from "../../../assets/U1 WB/U6/audio/page 35 - F/Item_001_can_play_the_violin.mp3";
import canFlyKiteAudio from "../../../assets/U1 WB/U6/audio/page 35 - F/Item_002_can_fly_a_kite.mp3";
import cantRideBikeAudio from "../../../assets/U1 WB/U6/audio/page 35 - F/Item_003_can't_ride_a_bike.mp3";

import heAudio from "../../../assets/U1 WB/U6/audio/page 35 - F/Item_004_He.mp3";
import sheAudio from "../../../assets/U1 WB/U6/audio/page 35 - F/Item_005_She.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    img: bat,
    alt: "A boy playing the violin outdoors.",
    subject: "He",
    subjectAudio: heAudio,
    answer: "can play the violin",
    answerAudio: canPlayViolinAudio,
  },

  {
    img: cap,
    alt: "A girl flying a kite outdoors.",
    subject: "She",
    subjectAudio: sheAudio,
    answer: "can fly a kite",
    answerAudio: canFlyKiteAudio,
  },

  {
    img: ant,
    alt: "A boy riding a bicycle outdoors.",
    subject: "He",
    subjectAudio: heAudio,
    answer: "can't ride a bike",
    answerAudio: cantRideBikeAudio,
  },
];

const allSentences = questions.map((q) => q.answer);

/* =====================================================
   DRAGGABLE SENTENCE
===================================================== */

const DraggableSentence = ({
  sentence,
  locked,
  isUsed,

  keyboardPickedSentence,
  onKeyboardPick,

  bankRefs,

  audioSrc,
  playingKey,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sentence-${sentence}`,
    disabled: locked || isUsed,
  });

  const isPicked = keyboardPickedSentence === sentence;

  const audioKey = `bank-${sentence}`;

  const isPlaying = playingKey === audioKey;

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        bankRefs.current[sentence] = el;
      }}
      {...(!locked && !isUsed
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={locked || isUsed ? -1 : 0}
      aria-disabled={locked || isUsed}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${sentence} selected. Press Tab to choose an answer line.`
          : `${sentence}. Press Enter or Space to hear and select this phrase.`
      }
      onClick={() => {
        playAudio(audioKey, audioSrc);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          playAudio(audioKey, audioSrc);

          if (!locked && !isUsed) {
            onKeyboardPick(sentence);
          }
        }
      }}
      style={{
        padding: "2px 5px",
        border: `2px solid ${isUsed ? "#aaa" : "#2c5287"}`,
        borderRadius: "8px",
        background: isUsed ? "#e0e0e0" : "white",
        fontWeight: "bold",
        color: isUsed ? "#999" : "inherit",
        cursor: locked || isUsed ? "default" : "grab",
        opacity: isDragging ? 0.3 : 1,
        touchAction: "none",
        userSelect: "none",
        transition: "all 0.2s",
        position: "relative",
      }}
    >
      {sentence}

      {isPlaying && (
        <FaVolumeUp
          size={14}
          aria-hidden="true"
          className="audio-icon-wb-unit6-p3-q2"
        />
      )}
    </div>
  );
};

/* =====================================================
   DROPPABLE BLANK
===================================================== */

const DroppableBlank = ({
  id,
  value,

  isWrong,
  locked,

  showAnswerMode,
  checkCompleted,

  keyboardPickedSentence,

  focusedBlankId,
  setFocusedBlankId,

  blankRefs,
  getAvailableBlankIds,

  onKeyboardDrop,
  onKeyboardRemove,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: locked || showAnswerMode || checkCompleted,
  });

  const keyboardActive =
    !!keyboardPickedSentence && !locked && !showAnswerMode && !checkCompleted;

  const canEditFilled =
    !!value &&
    !keyboardPickedSentence &&
    !locked &&
    !showAnswerMode &&
    !checkCompleted;

  const showPreview = keyboardActive && focusedBlankId === id;

  const displayedValue = showPreview ? keyboardPickedSentence : value;

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT -> RETURN TO BANK
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardRemove(id, value);

      return;
    }

    if (!keyboardActive) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableBlankIds();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(id);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextId = available[nextIndex];

      blankRefs.current[nextId]?.focus();

      return;
    }

    /* =========================================
       PLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(id);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <span
      style={{
        position: "relative",
        width: "90%",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);
          blankRefs.current[id] = el;
        }}
        role="button"
        tabIndex={
          locked || showAnswerMode || checkCompleted
            ? -1
            : keyboardActive || canEditFilled
              ? 0
              : -1
        }
        aria-label={
          keyboardActive
            ? value
              ? `This line currently contains ${value}. Press Enter or Space to replace it with ${keyboardPickedSentence}.`
              : `Empty answer line. Press Enter or Space to place ${keyboardPickedSentence}.`
            : canEditFilled
              ? `This line contains ${value}. Press Enter or Space to return it to the phrase bank.`
              : "Answer line."
        }
        className={`inline-input-wb-unit6-p3-q2 ${
          isOver ? "drag-over-cell" : ""
        } ${showPreview ? "keyboard-drop-preview-wb-unit6-p3-q2" : ""}`}
        onFocus={() => {
          if (keyboardActive) {
            setFocusedBlankId(id);
          }
        }}
        onBlur={() => {
          setFocusedBlankId(null);
        }}
        onKeyDown={handleKeyDown}
        onClick={() =>
          !locked && !showAnswerMode && !checkCompleted && value && onRemove(id)
        }
        style={{
          width: "100%",
          background: isOver ? "#e3f2fd" : "",
          display: "flex",
          alignItems: "center",
          cursor:
            !locked && !showAnswerMode && !checkCompleted && value
              ? "pointer"
              : "default",
          transition: "background 0.15s ease",
          position: "relative",
        }}
        title={
          !locked && !showAnswerMode && !checkCompleted && value
            ? "Click to remove"
            : ""
        }
      >
        {displayedValue || ""}

        {isWrong && (
          <span
            className="error-mark-input-wb-unit2-page3-q2"
            aria-hidden="true"
          >
            ✕
          </span>
        )}
      </div>
    </span>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit6_Page3_Q2 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState(questions.map(() => ""));

  /* =================================================
     WRONG
  ================================================= */

  const [wrongInputs, setWrongInputs] = useState([]);

  /* =================================================
     PROGRESSIVE LOCK
  ================================================= */

  const [lockedQuestions, setLockedQuestions] = useState([]);

  /* =================================================
     FINAL STATES
  ================================================= */

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const [activeSentence, setActiveSentence] = useState(null);

  /* =================================================
     KEYBOARD DRAG
  ================================================= */

  const [keyboardPickedSentence, setKeyboardPickedSentence] = useState(null);

  const [focusedBlankId, setFocusedBlankId] = useState(null);

  const bankRefs = useRef({});
  const blankRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const sequenceIdRef = useRef(0);

  const stopAudio = () => {
    sequenceIdRef.current += 1;

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  /* =================================================
     FULL CORRECT AUDIO
  ================================================= */

  const playAudioSequence = (key, sources) => {
    const validSources = sources.filter(Boolean);

    if (!validSources.length) {
      return;
    }

    stopAudio();

    const currentSequenceId = sequenceIdRef.current;

    setPlayingKey(key);

    let index = 0;

    const playNext = () => {
      if (currentSequenceId !== sequenceIdRef.current) {
        return;
      }

      if (index >= validSources.length) {
        audioRef.current = null;

        setPlayingKey(null);

        return;
      }

      const audio = new Audio(validSources[index]);

      audioRef.current = audio;

      audio.play().catch(() => {
        if (currentSequenceId === sequenceIdRef.current) {
          audioRef.current = null;

          setPlayingKey(null);
        }
      });

      audio.onended = () => {
        if (currentSequenceId !== sequenceIdRef.current) {
          return;
        }

        index += 1;

        playNext();
      };

      audio.onerror = () => {
        if (currentSequenceId !== sequenceIdRef.current) {
          return;
        }

        audioRef.current = null;

        setPlayingKey(null);
      };
    };

    playNext();
  };

  /* =================================================
     SENSOR
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

  const isQuestionLocked = (qIndex) => lockedQuestions.includes(qIndex);

  const usedSentences = answers.filter(Boolean);

  const getQuestionAudio = (qIndex) => {
    const question = questions[qIndex];

    return [question.subjectAudio, question.answerAudio];
  };

  const getAvailableBlankIds = () =>
    questions
      .map((_, qIndex) => qIndex)
      .filter((qIndex) => !isQuestionLocked(qIndex))
      .map((qIndex) => `blank-${qIndex}`);

  /* =================================================
     PLACE SENTENCE
  ================================================= */

  const placeSentence = (qIndex, sentence) => {
    if (showAnswerMode || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      /*
        نفس phrase ما تكون بمكانين.
      */

      updated.forEach((value, index) => {
        if (value === sentence && index !== qIndex) {
          updated[index] = "";
        }
      });

      updated[qIndex] = sentence;

      return updated;
    });

    /*
      امسح X بس عن نفس السؤال.
    */

    setWrongInputs((prev) => prev.filter((item) => item !== qIndex));
  };

  /* =================================================
     MOUSE DRAG
  ================================================= */

  const handleDragStart = (event) => {
    setActiveSentence(String(event.active.id).replace("sentence-", ""));
  };

  const handleDragEnd = (event) => {
    setActiveSentence(null);

    if (showAnswerMode || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !String(over.id).startsWith("blank-")) {
      return;
    }

    const sentence = String(active.id).replace("sentence-", "");

    const qIndex = Number(String(over.id).replace("blank-", ""));

    placeSentence(qIndex, sentence);
  };

  /* =================================================
     KEYBOARD PICK
  ================================================= */

  const handleKeyboardPick = (sentence) => {
    if (showAnswerMode || checkCompleted || usedSentences.includes(sentence)) {
      return;
    }

    setKeyboardPickedSentence(sentence);

    setFocusedBlankId(null);

    requestAnimationFrame(() => {
      const available = getAvailableBlankIds();

      if (!available.length) {
        return;
      }

      blankRefs.current[available[0]]?.focus();
    });
  };

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (blankId) => {
    if (!keyboardPickedSentence || showAnswerMode || checkCompleted) {
      return;
    }

    const qIndex = Number(blankId.replace("blank-", ""));

    if (isQuestionLocked(qIndex)) {
      return;
    }

    const sentence = keyboardPickedSentence;

    placeSentence(qIndex, sentence);

    setKeyboardPickedSentence(null);

    setFocusedBlankId(null);

    window.setTimeout(() => {
      bankRefs.current[sentence]?.focus();
    }, 0);
  };

  /* =================================================
     FILLED SLOT -> BANK
  ================================================= */

  const handleKeyboardRemove = (blankId, sentence) => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    const qIndex = Number(blankId.replace("blank-", ""));

    if (isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = "";

      return updated;
    });

    setWrongInputs((prev) => prev.filter((item) => item !== qIndex));

    setKeyboardPickedSentence(null);

    setFocusedBlankId(null);

    window.setTimeout(() => {
      bankRefs.current[sentence]?.focus();
    }, 0);
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const cancelKeyboardPick = () => {
    const sentence = keyboardPickedSentence;

    setKeyboardPickedSentence(null);

    setFocusedBlankId(null);

    window.setTimeout(() => {
      if (sentence) {
        bankRefs.current[sentence]?.focus();
      }
    }, 0);
  };

  /* =================================================
     REMOVE WITH MOUSE
  ================================================= */

  const handleRemove = (blankId) => {
    const qIndex = Number(blankId.replace("blank-", ""));

    if (showAnswerMode || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = "";

      return updated;
    });

    setWrongInputs((prev) => prev.filter((item) => item !== qIndex));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    /* =============================================
       ALL FILLED
    ============================================= */

    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      if (isQuestionLocked(qIndex)) {
        continue;
      }

      if (!answers[qIndex]) {
        ValidationAlert.info(`Please complete question ${qIndex + 1}.`);

        return;
      }
    }

    let score = 0;

    const wrong = [];

    const newlyLocked = [];

    questions.forEach((question, qIndex) => {
      if (isQuestionLocked(qIndex)) {
        score++;

        return;
      }

      if (answers[qIndex] === question.answer) {
        score++;

        newlyLocked.push(qIndex);
      } else {
        wrong.push(qIndex);
      }
    });

    /* =============================================
       PROGRESSIVE LOCK
    ============================================= */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    setWrongInputs(wrong);

    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="
        font-size:20px;
        text-align:center;
      ">
        <b style="color:${color}">
          Score: ${score} / ${total}
        </b>
      </div>
    `;

    if (score === total) {
      setLockedQuestions(questions.map((_, index) => index));

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setAnswers(questions.map((question) => question.answer));

    setWrongInputs([]);

    setLockedQuestions(questions.map((_, index) => index));

    setShowAnswerMode(true);

    setCheckCompleted(true);

    setKeyboardPickedSentence(null);

    setFocusedBlankId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(questions.map(() => ""));

    setWrongInputs([]);

    setLockedQuestions([]);

    setShowAnswerMode(false);

    setCheckCompleted(false);

    setActiveSentence(null);

    setKeyboardPickedSentence(null);

    setFocusedBlankId(null);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveSentence(null)}
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
            title="Look and write."
            subTitle="Look at each picture and drag the correct can or can’t phrase into the sentence."
          />

          {/* =================================================
              SENTENCE BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              width: "100%",

              alignItems: "center",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {allSentences.map((sentence) => {
              const question = questions.find((q) => q.answer === sentence);

              return (
                <DraggableSentence
                  key={sentence}
                  sentence={sentence}
                  locked={showAnswerMode || checkCompleted}
                  isUsed={usedSentences.includes(sentence)}
                  keyboardPickedSentence={keyboardPickedSentence}
                  onKeyboardPick={handleKeyboardPick}
                  bankRefs={bankRefs}
                  audioSrc={question?.answerAudio}
                  playingKey={playingKey}
                  playAudio={playAudio}
                />
              );
            })}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="content-container-wb-unit6-p3-q2">
            {questions.map((question, qIndex) => {
              const locked = isQuestionLocked(qIndex);

              const fullAudioKey = `full-question-${qIndex}`;

              const fullAudioPlaying = playingKey === fullAudioKey;

              return (
                <div key={qIndex} className="row2-wb-unit6-p3-q2">
                  {/* =====================================
                        IMAGE
                    ===================================== */}

                  <div
                    style={{
                      display: "flex",

                      gap: "10px",

                      alignItems: "center",
                    }}
                  >
                    <span className="num-span">{qIndex + 1}</span>

                    <img
                      src={question.img}
                      alt={question.alt}
                      className="q-img-wb-unit6-p3-q2"
                    />
                  </div>

                  {/* =====================================
                        SENTENCE
                    ===================================== */}

                  <div
                    className={`sentence-wrapper-wb-unit6-p3-q2 ${
                      locked ? "completed-sentence-wb-unit6-p3-q2" : ""
                    }`}
                    role={locked ? "button" : undefined}
                    tabIndex={locked ? 0 : undefined}
                    aria-label={
                      locked
                        ? `Play complete correct sentence for question ${qIndex + 1}`
                        : undefined
                    }
                    onClick={
                      locked
                        ? () =>
                            playAudioSequence(
                              fullAudioKey,
                              getQuestionAudio(qIndex),
                            )
                        : undefined
                    }
                    onKeyDown={
                      locked
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              playAudioSequence(
                                fullAudioKey,
                                getQuestionAudio(qIndex),
                              );
                            }
                          }
                        : undefined
                    }
                    style={{
                      position: "relative",

                      cursor: locked ? "pointer" : undefined,
                    }}
                  >
                    {/* SUBJECT */}

                    <span className="sentence-text">{question.subject}</span>

                    {/* ANSWER */}

                    {locked ? (
                      <span
                        style={{
                          position: "relative",

                          width: "90%",
                        }}
                      >
                        <div
                          className="inline-input-wb-unit6-p3-q2"
                          style={{
                            width: "100%",

                            display: "flex",

                            alignItems: "center",

                            position: "relative",
                          }}
                        >
                          {answers[qIndex]}
                        </div>
                      </span>
                    ) : (
                      <DroppableBlank
                        id={`blank-${qIndex}`}
                        value={answers[qIndex]}
                        isWrong={wrongInputs.includes(qIndex)}
                        locked={locked}
                        showAnswerMode={showAnswerMode}
                        checkCompleted={checkCompleted}
                        keyboardPickedSentence={keyboardPickedSentence}
                        focusedBlankId={focusedBlankId}
                        setFocusedBlankId={setFocusedBlankId}
                        blankRefs={blankRefs}
                        getAvailableBlankIds={getAvailableBlankIds}
                        onKeyboardDrop={handleKeyboardDrop}
                        onKeyboardRemove={handleKeyboardRemove}
                        onCancelKeyboardPick={cancelKeyboardPick}
                        onRemove={handleRemove}
                      />
                    )}

                    {/* PERIOD */}

                    <span className="sentence-text">.</span>

                    {/* FULL AUDIO ICON */}

                    {locked && fullAudioPlaying && (
                      <FaVolumeUp
                        size={15}
                        aria-hidden="true"
                        className="full-audio-icon-wb-unit6-p3-q2"
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
        {activeSentence && (
          <div
            style={{
              padding: "2px 5px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

              cursor: "grabbing",
            }}
          >
            {activeSentence}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit6_Page3_Q2;
