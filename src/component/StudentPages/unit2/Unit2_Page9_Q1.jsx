import React, { useRef, useState } from "react";
import "./Unit2_Page9_Q1.css";

import partyhats from "../../../assets/img_unit2/imgs/party hats..jpg";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";

import presentAudio from "../../../assets/unit2/Page 18 - A/It's a present.mp3";
import partyHatsAudio from "../../../assets/unit2/Page 18 - A/These are party hats.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  useDraggable,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// ─────────────────────────────────────────────────────────────
// DRAGGABLE WORD
// ─────────────────────────────────────────────────────────────

const DraggableWord = ({ id, word, disabled, isUsed }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  return (
    <span
      ref={setNodeRef}
      style={{
        padding: "7px 14px",

        border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

        borderRadius: "8px",

        background: isUsed ? "#f0f2f5" : "white",

        fontWeight: "bold",

        cursor: disabled || isUsed ? "default" : "grab",

        opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

        color: isUsed ? "#9aa3b0" : "inherit",

        display: "inline-block",

        transition: "all 0.2s ease",

        userSelect: "none",
      }}
      {...listeners}
      {...attributes}
    >
      {word}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// DROP SLOT
// ─────────────────────────────────────────────────────────────

const DropSlot = ({ id, value, wrong, showAnswer, locked, onRemove }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: showAnswer || locked,
  });

  return (
    <div className="flex items-center">
      <span
        ref={setNodeRef}
        className={`drop-slot-inline-unit2-p9-q1 ${
          isOver && !locked && !showAnswer ? "drag-over-cell" : ""
        }`}
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

              gap: "4px",
            }}
            title={showAnswer || locked ? "" : "Click to remove"}
          >
            {value}
          </span>
        )}

        {wrong && <span className="error-mark-input1">✕</span>}
      </span>

      <span>{id === "slot-input2" && " ? "}</span>

      <span>{id === "slot-input3" && " a "}</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

const Unit2_Page9_Q1 = () => {
  const [answers, setAnswers] = useState({});

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeWord, setActiveWord] = useState(null);

  // ─────────────────────────────────────────────────────────
  // AUDIO
  // ─────────────────────────────────────────────────────────

  const audioMapRef = useRef({});

  const activeAudioRef = useRef(null);

  const [playingSection, setPlayingSection] = useState(null);

  const getSectionAudio = (sectionId, src) => {
    if (!audioMapRef.current[sectionId]) {
      const audio = new Audio(src);

      audioMapRef.current[sectionId] = audio;
    }

    return audioMapRef.current[sectionId];
  };

  const stopCurrentAudio = () => {
    if (activeAudioRef.current) {
      /*
          PAUSE فقط
          ما بنعمل currentTime = 0
        */
      activeAudioRef.current.pause();

      activeAudioRef.current = null;
    }

    setPlayingSection(null);
  };

  const playSectionAudio = (sectionId, src) => {
    const audio = getSectionAudio(sectionId, src);

    // إذا فيه صوت ثاني شغال
    // وقفه ورجعه للبداية
    if (activeAudioRef.current && activeAudioRef.current !== audio) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }

    activeAudioRef.current = audio;

    // كل كبسة تبدأ الصوت من البداية
    audio.currentTime = 0;

    setPlayingSection(sectionId);

    audio.play().catch((error) => {
      console.log("Audio error:", error);

      if (activeAudioRef.current === audio) {
        activeAudioRef.current = null;
      }

      setPlayingSection(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (activeAudioRef.current === audio) {
        activeAudioRef.current = null;
      }

      setPlayingSection(null);
    };
  };

  // ─────────────────────────────────────────────────────────
  // ANSWERS
  // ─────────────────────────────────────────────────────────

  const correctMatches = [
    {
      input: "party hats",
      num: "input1",
    },
    {
      input: "What is it",
      num: "input2",
    },
    {
      input: "It's",
      num: "input3",
    },
    {
      input: "present",
      num: "input4",
    },
  ];

  const wordBank = correctMatches.map((c) => c.input);

  const getValue = (id) => answers[id] || "";

  const usedWords = new Set(Object.values(answers));

  const isSlotLocked = (slotId) => lockedSlots.includes(slotId);

  // ─────────────────────────────────────────────────────────
  // SECTION CORRECT STATE
  // ─────────────────────────────────────────────────────────

  /*
    Section 1:
    فقط input1
  */

  const section1Correct =
    isSlotLocked("input1") && answers.input1 === "party hats";

  /*
    Section 2:
    لازم الثلاثة كلهم صح
  */

  const section2Correct =
    ["input2", "input3", "input4"].every((id) => isSlotLocked(id)) &&
    answers.input2 === "What is it" &&
    answers.input3 === "It's" &&
    answers.input4 === "present";

  // ─────────────────────────────────────────────────────────
  // REMOVE
  // ─────────────────────────────────────────────────────────

  const removeAnswer = (slotId) => {
    if (showAnswer || checkCompleted || isSlotLocked(slotId)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[slotId];

      return updated;
    });

    /*
      شيل X من نفس الخانة فقط.
    */

    setWrongWords((prev) => prev.filter((id) => id !== slotId));
  };

  // ─────────────────────────────────────────────────────────
  // DRAG START
  // ─────────────────────────────────────────────────────────

  const onDragStart = ({ active }) => {
    setActiveWord(active.id.replace("bank-", ""));
  };

  // ─────────────────────────────────────────────────────────
  // DRAG END
  // ─────────────────────────────────────────────────────────

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const word = active.id.replace("bank-", "");

    if (!String(over.id).startsWith("slot-")) {
      return;
    }

    const inputId = String(over.id).replace("slot-", "");

    /*
      ما نعدل خانة صحيحة مقفلة.
    */

    if (isSlotLocked(inputId)) {
      return;
    }

    /*
      جيبي مكان الكلمة القديم
      BEFORE setState.
    */

    const oldSlotId = Object.keys(answers).find((key) => answers[key] === word);

    /*
      إذا الكلمة موجودة بخانة صح مقفلة
      ممنوع نحركها.
    */

    if (oldSlotId && isSlotLocked(oldSlotId)) {
      return;
    }

    setAnswers((prev) => {
      const updated = {
        ...prev,
      };

      /*
          Remove from previous slot
        */

      Object.keys(updated).forEach((key) => {
        if (updated[key] === word) {
          delete updated[key];
        }
      });

      /*
          Place in target
        */

      updated[inputId] = word;

      return updated;
    });

    /*
      شيل X فقط عن الأماكن المتغيرة.
    */

    setWrongWords((prev) =>
      prev.filter((id) => id !== inputId && id !== oldSlotId),
    );
  };

  const onDragCancel = () => {
    setActiveWord(null);
  };

  // ─────────────────────────────────────────────────────────
  // CHECK ANSWERS
  // ─────────────────────────────────────────────────────────

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const allFilled = correctMatches.every(({ num }) => Boolean(answers[num]));

    if (!allFilled) {
      ValidationAlert.info("Please fill in all the blanks before checking!");

      return;
    }

    const wrong = [];

    const correct = [];

    let correctCount = 0;

    correctMatches.forEach((ans) => {
      if (answers[ans.num] === ans.input) {
        correctCount++;

        correct.push(ans.num);
      } else {
        wrong.push(ans.num);
      }
    });

    /*
        اقفل الصح فقط.
      */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...correct])));

    /*
        X للغلط فقط.
      */

    setWrongWords(wrong);

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (correctCount === total) {
      setLockedSlots(correctMatches.map((item) => item.num));

      setWrongWords([]);

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

  // ─────────────────────────────────────────────────────────
  // SHOW ANSWER
  // ─────────────────────────────────────────────────────────

  const showCorrectAnswers = () => {
    const filled = {};

    correctMatches.forEach((c) => {
      filled[c.num] = c.input;
    });

    setAnswers(filled);

    setWrongWords([]);

    setLockedSlots(correctMatches.map((item) => item.num));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ─────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────

  const resetAll = () => {
    stopCurrentAudio();

    /*
      Reset audio positions only with Start Again.
    */

    Object.values(audioMapRef.current).forEach((audio) => {
      audio.pause();

      audio.currentTime = 0;
    });

    setAnswers({});

    setWrongWords([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div
        style={{
          display: "flex",

          justifyContent: "center",

          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            gap: "88px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            title="Look and write."
            subTitle="Drag the correct words into each birthday sentence."
          />

          {/* ─────────────────────────────────────
              WORD BANK
          ───────────────────────────────────── */}

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
            {wordBank.map((word) => (
              <DraggableWord
                key={word}
                id={`bank-${word}`}
                word={word}
                disabled={showAnswer || checkCompleted}
                isUsed={usedWords.has(word)}
              />
            ))}
          </div>

          <div className="content-container-P90-Q1">
            {/* =================================================
                SECTION 1
            ================================================= */}

            <div
              className={`section-one ${
                section1Correct ? "audio-ready-section-p9-q1" : ""
              }`}
              role={section1Correct ? "button" : undefined}
              tabIndex={section1Correct ? 0 : undefined}
              onClick={() => {
                if (section1Correct) {
                  playSectionAudio("section1", partyHatsAudio);
                }
              }}
              onKeyDown={(e) => {
                if (!section1Correct) {
                  return;
                }

                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();

                  playSectionAudio("section1", partyHatsAudio);
                }
              }}
            >
              <span>1</span>

              <div
                style={{
                  position: "relative",
                }}
              >
                <img
                  src={partyhats}
                  className="p9-q1-img"
                  alt="Colorful party hats."
                />

                {section1Correct && (
                  <FaVolumeUp
                    className="section-audio-icon-p9-q1"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="content-input">
                <input type="text" value="What are these?" readOnly />

                <input type="text" value="These are" readOnly />

                <DropSlot
                  id="slot-input1"
                  value={getValue("input1")}
                  wrong={wrongWords.includes("input1") && !showAnswer}
                  locked={isSlotLocked("input1")}
                  showAnswer={showAnswer}
                  onRemove={() => removeAnswer("input1")}
                />
              </div>
            </div>

            {/* =================================================
                SECTION 2
            ================================================= */}

            <div
              className={`section-two ${
                section2Correct ? "audio-ready-section-p9-q1" : ""
              }`}
              role={section2Correct ? "button" : undefined}
              tabIndex={section2Correct ? 0 : undefined}
              onClick={() => {
                if (section2Correct) {
                  playSectionAudio("section2", presentAudio);
                }
              }}
              onKeyDown={(e) => {
                if (!section2Correct) {
                  return;
                }

                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();

                  playSectionAudio("section2", presentAudio);
                }
              }}
            >
              <span>2</span>

              <div
                style={{
                  position: "relative",
                }}
              >
                <img
                  src={present}
                  className="p9-q1-img"
                  alt="A wrapped present."
                />

                {section2Correct && (
                  <FaVolumeUp
                    className="section-audio-icon-p9-q1"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="content-input">
                {["input2", "input3", "input4"].map((id) => (
                  <React.Fragment key={id}>
                    <DropSlot
                      id={`slot-${id}`}
                      value={getValue(id)}
                      wrong={wrongWords.includes(id) && !showAnswer}
                      locked={isSlotLocked(id)}
                      showAnswer={showAnswer}
                      onRemove={() => removeAnswer(id)}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────
              BUTTONS
          ───────────────────────────────────── */}

          <div className="action-buttons-container">
            <button className="try-again-button" onClick={resetAll}>
              Start Again ↻
            </button>

            <button className="show-answer-btn" onClick={showCorrectAnswers}>
              Show Answer
            </button>

            <button className="check-button2" onClick={checkAnswers}>
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────
          DRAG OVERLAY
      ───────────────────────────────────── */}

      <DragOverlay>
        {activeWord ? (
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
            {activeWord}
          </span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit2_Page9_Q1;
