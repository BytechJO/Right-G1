import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ExerciseHeader from "../../ExerciseHeader";

import sentenceSound from "../../../assets/unit2/Page 14 - C/how old are you.mp3";

const Unit2_Page5_Q4 = () => {
  const data = [
    { letter: "a", number: 1 },
    { letter: "b", number: 2 },
    { letter: "c", number: 3 },
    { letter: "d", number: 4 },
    { letter: "e", number: 5 },
    { letter: "f", number: 6 },
    { letter: "g", number: 7 },
    { letter: "h", number: 8 },
    { letter: "i", number: 9 },
    { letter: "j", number: 10 },
    { letter: "k", number: 11 },
    { letter: "l", number: 12 },
    { letter: "m", number: 13 },
    { letter: "n", number: 14 },
    { letter: "o", number: 15 },
    { letter: "p", number: 16 },
    { letter: "q", number: 17 },
    { letter: "r", number: 18 },
    { letter: "s", number: 19 },
    { letter: "t", number: 20 },
    { letter: "u", number: 21 },
    { letter: "v", number: 22 },
    { letter: "w", number: 23 },
    { letter: "x", number: 24 },
    { letter: "y", number: 25 },
    { letter: "z", number: 26 },
  ];

  const questionGroups = [
    [8, 15, 23], // how
    [15, 12, 4], // old
    [1, 18, 5], // are
    [25, 15, 21], // you
  ];

  const createEmptySlots = () =>
    questionGroups.map((group) => group.map(() => null));

  const [slots, setSlots] = useState(createEmptySlots());

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedSlots, setLockedSlots] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // الجملة الحالية كلها صح
  const [allCorrect, setAllCorrect] = useState(false);

  // بعد أول Check ناجح نقفل Function التشيك فقط
  const [checkCompleted, setCheckCompleted] = useState(false);

  const sentenceAudioRef = useRef(null);

  /* =====================================================
     FORM SENTENCE
  ===================================================== */

  const formedWords = slots.map((group) =>
    group.map((letter) => letter || "").join(""),
  );

  const sentence = formedWords.join(" ");

  /* =====================================================
     GET CORRECT LETTER
  ===================================================== */

  const getCorrectLetter = (groupIndex, letterIndex) => {
    const number = questionGroups[groupIndex][letterIndex];

    return data.find((item) => item.number === number)?.letter;
  };

  /* =====================================================
     CHECK IF FULL SENTENCE IS CORRECT
  ===================================================== */

  const checkIfAllCorrect = (updatedSlots) => {
    for (let g = 0; g < updatedSlots.length; g++) {
      for (let l = 0; l < updatedSlots[g].length; l++) {
        const correctLetter = getCorrectLetter(g, l);

        if (!updatedSlots[g][l] || updatedSlots[g][l] !== correctLetter) {
          return false;
        }
      }
    }

    return true;
  };

  /* =====================================================
     PLAY SENTENCE
  ===================================================== */

  const playSentence = () => {
    if (!sentenceAudioRef.current) return;

    sentenceAudioRef.current.pause();

    sentenceAudioRef.current.currentTime = 0;

    sentenceAudioRef.current.play().catch((error) => {
      console.log("Sentence audio error:", error);
    });
  };

  /* =====================================================
     LOCK ALL SLOTS
  ===================================================== */

  const lockAllSlots = () => {
    const allSlotIds = [];

    questionGroups.forEach((group, gIndex) => {
      group.forEach((_, lIndex) => {
        allSlotIds.push(`${gIndex}-${lIndex}`);
      });
    });

    setLockedSlots(allSlotIds);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || showAnswer) {
      return;
    }

    if (!destination.droppableId.startsWith("slot-")) {
      return;
    }

    const [g, l] = destination.droppableId.split("-").slice(1).map(Number);

    const slotId = `${g}-${l}`;

    // الصح اللي اتقفل بعد Check
    // ما بنقدر نغيره
    if (lockedSlots.includes(slotId)) {
      return;
    }

    const letter = draggableId.replace("letter-", "");

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      updated[g][l] = letter;

      // =============================
      // افحص إذا صار الحل كله صح
      // =============================

      const completedCorrectly = checkIfAllCorrect(updated);

      if (completedCorrectly) {
        // فقط نعرف إن الجملة صح
        setAllCorrect(true);

        setWrongInputs([]);

        // مهم:
        // لا نقفل الـ Check هون
        // ولا نعمل Success popup هون

        // الصوت يشتغل لحظة
        // إكمال آخر حرف صح
        setTimeout(() => {
          playSentence();
        }, 0);
      } else {
        setAllCorrect(false);
      }

      return updated;
    });

    // لو كانت الخانة عليها X
    // نشيله بمجرد تعديلها
    setWrongInputs((prev) => prev.filter((id) => id !== slotId));
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const correct = questionGroups.map((group) =>
      group.map((num) => data.find((item) => item.number === num)?.letter),
    );

    setSlots(correct);

    setWrongInputs([]);

    lockAllSlots();

    setShowAnswer(true);

    setAllCorrect(true);

    // إذا Show Answer
    // Check ما عاد يعمل شيء
    setCheckCompleted(true);
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const handleCheckAnswers = () => {
    // بعد أول Check ناجح
    // أي ضغط ثاني ما يعمل شيء
    if (showAnswer || checkCompleted) {
      return;
    }

    const hasEmpty = slots.some((group) => group.some((letter) => !letter));

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all fields before checking.",
      );

      return;
    }

    const wrong = [];

    const newlyLocked = [];

    let correctCount = 0;

    const total = slots.flat().length;

    for (let g = 0; g < slots.length; g++) {
      for (let l = 0; l < slots[g].length; l++) {
        const slotId = `${g}-${l}`;

        const correctLetter = getCorrectLetter(g, l);

        if (slots[g][l] === correctLetter) {
          correctCount++;

          newlyLocked.push(slotId);
        } else {
          wrong.push(slotId);
        }
      }
    }

    /* =========================================
       LOCK ONLY CORRECT SLOTS
    ========================================= */

    setLockedSlots((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setWrongInputs(wrong);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    /* =========================================
       ALL CORRECT
    ========================================= */

    if (correctCount === total) {
      setAllCorrect(true);

      lockAllSlots();

      setWrongInputs([]);

      // من هون وطالع
      // Check ما عاد يعمل شيء
      setCheckCompleted(true);

      // مهم:
      // ما في صوت هون
      // الصوت صار من الـ drag
      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =========================================
       WRONG / PARTIALLY CORRECT
    ========================================= */

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setSlots(createEmptySlots());

    setWrongInputs([]);

    setLockedSlots([]);

    setShowAnswer(false);

    setAllCorrect(false);

    setCheckCompleted(false);

    if (sentenceAudioRef.current) {
      sentenceAudioRef.current.pause();

      sentenceAudioRef.current.currentTime = 0;
    }
  };

  /* =====================================================
     CURRENT SENTENCE IS CORRECT
  ===================================================== */

  const sentenceIsCorrect = checkIfAllCorrect(slots);

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div
      className="mb-10"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      {/* AUDIO */}
      <audio ref={sentenceAudioRef} src={sentenceSound} />

      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="C"
          title="Answer the question."
          subTitle="Match each number to its letter, then build the hidden sentence."
        />

        <div className="alphabet-box">
          <DragDropContext onDragEnd={onDragEnd}>
            {/* ============================================
                ALPHABET
            ============================================ */}

            <Droppable
              droppableId="alphabet"
              direction="horizontal"
              isDropDisabled
            >
              {(provided) => (
                <div
                  className="row1"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {data.map((item, index) => (
                    <div className="letter-char1" key={item.letter}>
                      <Draggable
                        draggableId={`letter-${item.letter}`}
                        index={index}
                        isDragDisabled={false}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cell1 drag-letter"
                            style={{
                              ...provided.draggableProps.style,

                              cursor: "grab",
                            }}
                          >
                            {item.letter}
                          </div>
                        )}
                      </Draggable>

                      <div className="cell1 number1">{item.number}</div>
                    </div>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* ============================================
                ANSWER SLOTS
            ============================================ */}

            <div className="words">
              {questionGroups.map((group, gIndex) => (
                <div className="word-group" key={gIndex}>
                  {group.map((num, lIndex) => {
                    const slotId = `${gIndex}-${lIndex}`;

                    const isLocked = lockedSlots.includes(slotId);

                    const isWrong = wrongInputs.includes(slotId);

                    return (
                      <Droppable
                        key={slotId}
                        droppableId={`slot-${gIndex}-${lIndex}`}
                        isDropDisabled={showAnswer || isLocked}
                      >
                        {(provided, snapshot) => (
                          <div className="slot-wrapper">
                            <h6 className="slot-number">{num}</h6>

                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`drop-slot
                                    ${
                                      snapshot.isDraggingOver ? "drag-over" : ""
                                    }
                                    ${isWrong ? "wrong" : ""}
                                  `}
                              style={{
                                position: "relative",

                                borderColor: isLocked ? "#28a745" : undefined,

                                backgroundColor: isLocked
                                  ? "rgba(40, 167, 69, 0.08)"
                                  : undefined,

                                cursor: isLocked ? "default" : undefined,
                              }}
                            >
                              {/* WRONG */}

                              {isWrong && <div className="error-mark1">✕</div>}

                              {/* LETTER */}

                              {slots[gIndex][lIndex] && (
                                <div
                                  className="dropped-letter"
                                  style={{
                                    color: isLocked ? "#16843a" : undefined,

                                    fontWeight: isLocked ? "700" : undefined,
                                  }}
                                >
                                  {slots[gIndex][lIndex]}
                                </div>
                              )}

                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </div>
              ))}

              <div className="text-[40px] text-center font-semibold mt-5">
                ?
              </div>
            </div>

            {/* ============================================
                SENTENCE
            ============================================ */}

            <div
              className="sentence-box"
              onClick={() => {
                if (sentenceIsCorrect) {
                  playSentence();
                }
              }}
              style={{
                cursor: sentenceIsCorrect ? "pointer" : "default",
              }}
              title={sentenceIsCorrect ? "Click to listen" : ""}
            >
              <span className="sentence-text">{sentence}</span>

              <div className="text-[30px] text-center font-semibold">?</div>
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* ================================================
          BUTTONS
      ================================================ */}

      <div className="action-buttons-container">
        <button onClick={handleReset} className="try-again-button">
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={handleCheckAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page5_Q4;
