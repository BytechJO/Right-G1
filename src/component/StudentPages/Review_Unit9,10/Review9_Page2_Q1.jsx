import React, { useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Review9_Page2_Q1.css";

import sound1 from "../../../assets/unit10/sound/cd82pg89-instruction1-adult-lady_HJ6dZOlG.mp3";

import img2 from "../../../assets/unit10/imgs/U10P89EXED-01.svg";
import img3 from "../../../assets/unit10/imgs/U10P89EXED-02.svg";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";

import item1Audio from "../../../assets/unit10/sound/Pg89_1.1_Adult Lady.mp3";
import item2Audio from "../../../assets/unit10/sound/Pg89_1.2_Adult Lady.mp3";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";

import useReviewAudio from "./useReviewAudio";

import useReviewDragKeyboard from "./useReviewDragKeyboard";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    parts: [
      {
        before: "The ",
        blank: 1,
        after: "an walks at",
      },
      {
        before: " ",
        blank: 2,
        after: "ight.",
      },
    ],

    correct: ["m", "n"],

    img: img2,

    alt: "A man walking outside at night.",

    audio: item1Audio,
  },

  {
    parts: [
      {
        before: "My",
        blank: 1,
        after: "om is a",
      },
      {
        before: " ",
        blank: 2,
        after: "urse",
      },
    ],

    correct: ["m", "n"],

    img: img3,

    alt: "A woman working as a nurse.",

    audio: item2Audio,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Review9_Page2_Q1 = () => {
  /* =====================================================
     ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState(
    data.map((item) => Array(item.correct.length).fill("")),
  );

  /* =====================================================
     WRONG INPUTS
  ===================================================== */

  const [wrongInputs, setWrongInputs] = useState(new Set());

  /* =====================================================
     LOCKED CORRECT INPUTS
  ===================================================== */

  const [lockedInputs, setLockedInputs] = useState(new Set());

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     ROWS THAT BECAME FULLY CORRECT AFTER CHECK
     فقط هاي الجمل بصير إلها صوت
  ===================================================== */

  const [correctRows, setCorrectRows] = useState(new Set());

  /* =====================================================
     AUDIO
  ===================================================== */

  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();

  /* =====================================================
     TARGET IDS
  ===================================================== */

  const targetIds = data.flatMap((item, qIndex) =>
    item.correct.map((_, blankIndex) => `slot-${qIndex}-${blankIndex}`),
  );

  /* =====================================================
     PARSE TARGET
  ===================================================== */

  const parseTarget = (targetId) =>
    targetId.replace("slot-", "").split("-").map(Number);

  /* =====================================================
     PLACE LETTER
     IMPORTANT:
     NO AUDIO HERE
  ===================================================== */

  const placeLetter = (targetId, value) => {
    if (showAnswerMode || lockedInputs.has(targetId)) {
      return;
    }

    const [qIndex, blankIndex] = parseTarget(targetId);

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = value;

      return updated;
    });

    /*
      تعديل خانة غلط:
      امسح الغلط لهذه الخانة فقط
    */

    setWrongInputs((current) => {
      const next = new Set(current);

      next.delete(`${qIndex}-${blankIndex}`);

      return next;
    });
  };

  /* =====================================================
     REMOVE LETTER
  ===================================================== */

  const removeLetter = (targetId) => {
    if (showAnswerMode || lockedInputs.has(targetId)) {
      return;
    }

    placeLetter(targetId, "");
  };

  /* =====================================================
     KEYBOARD DRAG PATTERN
  ===================================================== */

  const keyboard = useReviewDragKeyboard({
    targetIds,

    lockedIds: lockedInputs,

    getValue: (targetId) => {
      const [qIndex, blankIndex] = parseTarget(targetId);

      return answers[qIndex][blankIndex];
    },

    onPlace: placeLetter,

    onRemove: removeLetter,
  });

  /* =====================================================
     DRAG END
  ===================================================== */

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || showAnswerMode) {
      return;
    }

    const value = draggableId.replace("char-", "");

    /* =================================================
       RETURNED TO BANK
    ================================================= */

    if (destination.droppableId === "char-bank") {
      return;
    }

    /* =================================================
       DROP ON SLOT
    ================================================= */

    if (destination.droppableId.startsWith("slot-")) {
      placeLetter(destination.droppableId, value);
    }
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswerMode || lockedInputs.size === targetIds.length) {
      return;
    }

    /* =================================================
       REQUIRE ALL BLANKS
    ================================================= */

    const hasEmpty = answers.some((row) =>
      row.some((value) => value.trim() === ""),
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");

      return;
    }

    /* =================================================
       VALIDATE
    ================================================= */

    const wrong = new Set();

    const nextLocked = new Set(lockedInputs);

    /*
      Preserve rows that were already
      fully correct after previous Check
    */

    const nextCorrectRows = new Set(correctRows);

    let correctCount = 0;

    answers.forEach((row, qIndex) => {
      let rowCorrect = true;

      row.forEach((value, blankIndex) => {
        const isCorrect = value.trim() === data[qIndex].correct[blankIndex];

        if (isCorrect) {
          correctCount++;

          /*
                Progressive lock:
                كل خانة صح تنقفل
              */

          nextLocked.add(`slot-${qIndex}-${blankIndex}`);
        } else {
          wrong.add(`${qIndex}-${blankIndex}`);

          rowCorrect = false;
        }
      });

      /*
          فقط بعد Check:
          إذا كل الجملة صح
          فعل full sentence audio
        */

      if (rowCorrect) {
        nextCorrectRows.add(qIndex);
      }
    });

    setWrongInputs(wrong);

    setLockedInputs(nextLocked);

    setCorrectRows(nextCorrectRows);

    /* =================================================
       SCORE
    ================================================= */

    const totalInputs = data.reduce(
      (total, item) => total + item.correct.length,

      0,
    );

    const color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
      <div
        style="
          font-size:20px;
          text-align:center;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${correctCount} / ${totalInputs}
        </span>
      </div>
    `;

    if (correctCount === totalInputs) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
     IMPORTANT:
     لا نفعل صوت الجملة هنا
  ===================================================== */

  const showAnswer = () => {
    const correctFilled = data.map((item) => [...item.correct]);

    setAnswers(correctFilled);

    setWrongInputs(new Set());

    setLockedInputs(new Set(targetIds));

    setShowAnswerMode(true);

    /*
    Show Answer:
    كل الجمل تصير كاملة وصحيحة
    وتدخل وضع full sentence audio
  */
    setCorrectRows(new Set(data.map((_, index) => index)));

    stopAudio();
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetAll = () => {
    setAnswers(data.map((item) => Array(item.correct.length).fill("")));

    setWrongInputs(new Set());

    setLockedInputs(new Set());

    setShowAnswerMode(false);

    setCorrectRows(new Set());

    stopAudio();
  };

  /* =====================================================
     QUESTION AUDIO
  ===================================================== */

  const stopAtSecond = 4.7;

  const captions = [
    {
      start: 0.479,
      end: 4.639,

      text: "Page 89, exercise D. Listen and write.",
    },

    {
      start: 5.44,
      end: 8.019,

      text: "1, the man walks at night.",
    },

    {
      start: 8.72,
      end: 11.1,

      text: "2, my mom is a nurse.",
    },
  ];

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper">
        <div
          className="div-forall"
          style={{
            gap: "30px",
          }}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <ExerciseHeaderReview
            sectionLetter="D"
            title="Listen and write."
            subTitle="Listen to each sentence, then drag m or n into every blank."
          />

          {/* =================================================
              INSTRUCTION AUDIO
          ================================================= */}

          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId="review9-page89-qD"
          />

          {/* =================================================
              LETTER BANK
          ================================================= */}

          <Droppable droppableId="char-bank" isDropDisabled={showAnswerMode}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",

                  gap: "10px",

                  padding: "10px",

                  border: "2px dashed #ccc",

                  borderRadius: "10px",

                  alignItems: "center",

                  width: "100%",

                  justifyContent: "center",
                }}
              >
                {["m", "n"].map((char, index) => (
                  <Draggable
                    key={char}
                    draggableId={`char-${char}`}
                    index={index}
                    isDragDisabled={
                      showAnswerMode || lockedInputs.size === targetIds.length
                    }
                  >
                    {(provided) => (
                      <span
                        ref={(node) => {
                          provided.innerRef(node);

                          keyboard.registerBank(`bank-${char}`, node);
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        role="button"
                        tabIndex={
                          keyboard.picked ||
                          lockedInputs.size === targetIds.length
                            ? -1
                            : 0
                        }
                        aria-label={`Pick up the letter ${char}.`}
                        onKeyDown={(event) =>
                          keyboard.handleBankKeyDown(
                            event,
                            char,
                            `bank-${char}`,
                          )
                        }
                        style={{
                          padding: "7px 14px",

                          border: "2px solid #2c5287",

                          borderRadius: "8px",

                          background: "white",

                          fontWeight: "bold",

                          fontSize: "22px",

                          cursor: "grab",

                          ...provided.draggableProps.style,
                        }}
                      >
                        {char}
                      </span>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          {data.map((item, qIndex) => {
            /*
                الجملة Audio Control
                فقط إذا أصبحت كاملة صح
                عن طريق Check Answer
              */

            const sentenceCorrect = correctRows.has(qIndex);

            const sentenceAudioKey = `item-${qIndex}`;

            return (
              <div className="row-missing" key={qIndex}>
                <span className="num">{qIndex + 1}.</span>

                <div
                  style={{
                    display: "flex",

                    width: "100%",

                    justifyContent: "space-between",
                  }}
                >
                  {/* =========================================
                        SENTENCE
                    ========================================= */}

                  <div
                    className={`
                        sentence-review4-p2-q1

                        ${
                          sentenceCorrect
                            ? "correct-sentence-audio-review9-p2-q1"
                            : ""
                        }
                      `}
                    role={sentenceCorrect ? "button" : undefined}
                    tabIndex={sentenceCorrect ? 0 : undefined}
                    aria-label={
                      sentenceCorrect
                        ? `Correct sentence ${qIndex + 1}. Press Enter or Space to hear it.`
                        : undefined
                    }
                    onClick={
                      sentenceCorrect
                        ? (event) => {
                            event.stopPropagation();

                            playAudio(sentenceAudioKey, item.audio);
                          }
                        : undefined
                    }
                    onKeyDown={
                      sentenceCorrect
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();

                              event.stopPropagation();

                              playAudio(sentenceAudioKey, item.audio);
                            }
                          }
                        : undefined
                    }
                  >
                    {/* =====================================
                          AUDIO ICON
                      ===================================== */}

                    {sentenceCorrect && activeAudioKey === sentenceAudioKey && (
                      <ReviewPlayingAudioIcon />
                    )}

                    {/* =====================================
                          SENTENCE PARTS
                      ===================================== */}

                    {item.parts.map((part, blankIndex) => {
                      const targetId = `slot-${qIndex}-${blankIndex}`;

                      return (
                        <span
                          key={blankIndex}
                          className="sentence-part"
                          style={{
                            display: "flex",

                            alignItems: "center",
                          }}
                        >
                          {part.before}

                          <div className="input-wrapper-review9-p2-q2">
                            <Droppable
                              droppableId={targetId}
                              isDropDisabled={
                                showAnswerMode || lockedInputs.has(targetId)
                              }
                            >
                              {(provided, snapshot) => {
                                const preview = keyboard.previewFor(targetId);

                                return (
                                  <div
                                    ref={(node) => {
                                      provided.innerRef(node);

                                      keyboard.registerTarget(targetId, node);
                                    }}
                                    {...provided.droppableProps}
                                    role="button"
                                    tabIndex={keyboard.targetTabIndex(targetId)}
                                    aria-label={
                                      preview
                                        ? `Place ${preview} here.`
                                        : answers[qIndex][blankIndex]
                                          ? `${answers[qIndex][blankIndex]}. Press Enter or Space to return it.`
                                          : "Empty letter blank."
                                    }
                                    onClick={(event) => {
                                      /*
                                            فقط إذا الخانة
                                            ما زالت editable
                                          */

                                      if (
                                        answers[qIndex][blankIndex] &&
                                        !lockedInputs.has(targetId)
                                      ) {
                                        event.stopPropagation();

                                        removeLetter(targetId);
                                      }
                                    }}
                                    onKeyDown={(event) =>
                                      keyboard.handleTargetKeyDown(
                                        event,
                                        targetId,
                                      )
                                    }
                                    className={`
                                          missing-input-review4-p2-q1

                                          ${
                                            snapshot.isDraggingOver
                                              ? "drag-over-cell"
                                              : ""
                                          }

                                          ${
                                            preview
                                              ? "review-keyboard-drop-preview"
                                              : ""
                                          }
                                        `}
                                  >
                                    {(preview ||
                                      answers[qIndex][blankIndex]) && (
                                      <Draggable
                                        draggableId={`filled-${
                                          preview || answers[qIndex][blankIndex]
                                        }-${qIndex}-${blankIndex}`}
                                        index={0}
                                        isDragDisabled
                                      >
                                        {(provided) => (
                                          <span
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            {preview ||
                                              answers[qIndex][blankIndex]}
                                          </span>
                                        )}
                                      </Draggable>
                                    )}

                                    {provided.placeholder}

                                    {wrongInputs.has(
                                      `${qIndex}-${blankIndex}`,
                                    ) && (
                                      <span
                                        className="wrong-icon-review4-p2-q1"
                                        aria-hidden="true"
                                      >
                                        ✕
                                      </span>
                                    )}
                                  </div>
                                );
                              }}
                            </Droppable>
                          </div>

                          {part.after}
                        </span>
                      );
                    })}
                  </div>

                  {/* =========================================
                        IMAGE
                        مجرد صورة
                        NO AUDIO
                        NO TAB
                    ========================================= */}

                  <img
                    src={item.img}
                    className="middle-img-review9-p2-q2"
                    alt={item.alt}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={resetAll}>
            Start Again ↻
          </button>

          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review9_Page2_Q1;
