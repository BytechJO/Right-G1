import React, { useRef, useState } from "react";
import "./Page8_Q4.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import sentenceAudio from "../../../assets/unit1/Page 8 - C/How are you.mp3";
import ExerciseHeader from "../../ExerciseHeader";
const Page8_Q4 = () => {
  const sentenceAudioRef = useRef(null);
  const bankRefs = useRef({});
  const slotRefs = useRef([]);

  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);
  const [keyboardMessage, setKeyboardMessage] = useState("");
  const [focusedLetter, setFocusedLetter] = useState(null);
  const [focusedSlot, setFocusedSlot] = useState(null);
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
    [1, 18, 5], // are
    [25, 15, 21], // you
  ];

  const [slots, setSlots] = useState(
    questionGroups.map((g) => g.map(() => null)),
  );
  const [isChecked, setIsChecked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  // تكوين الكلمات من الخانات
  const formedWords = slots.map((group) =>
    group.map((letter) => letter || "").join(""),
  );
  const sentence = formedWords.join(" ");
  const correctSentence = "how are you";

  const isSentenceCorrect = sentence.trim().toLowerCase() === correctSentence;
  const playSentenceAudio = () => {
    if (!isSentenceCorrect || !sentenceAudio) return;

    const audio = sentenceAudioRef.current;
    if (!audio) return;

    // وقف أي تشغيل سابق
    audio.pause();
    audio.currentTime = 0;

    audio.src = sentenceAudio;
    audio.play();
  };
  const handleKeyboardPick = (letter) => {
    if (showAnswer || isChecked) return;

    setKeyboardPickedLetter(letter);

    setKeyboardMessage(
      `Letter ${letter} selected. Choose a box and press Enter.`,
    );

    // مباشرة لأول خانة
    setTimeout(() => {
      slotRefs.current[0]?.focus();
    }, 0);
  };
  const handleKeyboardDrop = (gIndex, lIndex, flatIndex) => {
    if (!keyboardPickedLetter || showAnswer || isChecked) {
      return;
    }

    const placedLetter = keyboardPickedLetter;

    setSlots((prev) => {
      const updated = prev.map((group) => [...group]);

      // الحرف الموجود ينستبدل عادي
      updated[gIndex][lIndex] = placedLetter;

      return updated;
    });

    setWrongInputs((prev) => prev.filter((id) => id !== `${gIndex}-${lIndex}`));

    setKeyboardMessage(`Letter ${placedLetter} placed. Choose another letter.`);

    // فك الحرف
    setKeyboardPickedLetter(null);

    // رجع لنفس الحرف فوق
    setTimeout(() => {
      bankRefs.current[placedLetter]?.focus();
    }, 0);
  };
  // ========================
  // Drag Logic
  // ========================
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer || isChecked) return;

    if (destination.droppableId.startsWith("slot-")) {
      const [g, l] = destination.droppableId.split("-").slice(1).map(Number);

      const letter = draggableId.replace("letter-", "");

      setSlots((prev) => {
        const updated = prev.map((group) => [...group]);

        // ✅ استبدال الحرف مباشرة
        updated[g][l] = letter;

        return updated;
      });
    }
  };

  // ========================
  // Show Answer
  // ========================
  const handleShowAnswer = () => {
    const correct = questionGroups.map((group) =>
      group.map((num) => data.find((d) => d.number === num).letter),
    );

    setSlots(correct);
    setWrongInputs([]);
    setShowAnswer(true);
    setKeyboardPickedLetter(null);
    setKeyboardMessage("Correct answer is shown.");
  };

  // ========================
  // Check Answer
  // ========================
  const handleCheckAnswers = () => {
    if (showAnswer) return;
    setIsChecked(true);

    const hasEmpty = slots.some((g) => g.some((l) => !l));
    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all fields before checking.",
      );
      return;
    }

    let wrong = [];
    let correctCount = 0;
    let total = slots.flat().length;

    for (let g = 0; g < slots.length; g++) {
      for (let l = 0; l < slots[g].length; l++) {
        const correctLetter = data.find(
          (d) => d.number === questionGroups[g][l],
        ).letter;

        if (slots[g][l] === correctLetter) correctCount++;
        else wrong.push(`${g}-${l}`);
      }
    }

    setWrongInputs(wrong);
    setKeyboardPickedLetter(null);
    setKeyboardMessage("Correct answer is shown.");

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };
  const getFlatSlotIndex = (groupIndex, letterIndex) => {
    let index = 0;

    for (let g = 0; g < groupIndex; g++) {
      index += questionGroups[g].length;
    }

    return index + letterIndex;
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
      <div className="div-forall" style={{}}>
        <ExerciseHeader
          sectionLetter="C"
          title="Answer the question."
          subTitle="Match each number to its letter, then build the hidden sentence."
        />
        <audio ref={sentenceAudioRef} style={{ display: "none" }} />
        <div className="alphabet-box">
          <DragDropContext onDragEnd={onDragEnd}>
            {/* 🔤 الحروف فوق الأرقام */}
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
                    <div className="letter-char1" key={index}>
                      <Draggable
                        draggableId={`letter-${item.letter}`}
                        index={index}
                        isDragDisabled={showAnswer || isChecked}
                      >
                        {(provided) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);

                              bankRefs.current[item.letter] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cell1 drag-letter"
                            role="button"
                            tabIndex={showAnswer || isChecked ? -1 : 0}
                            aria-pressed={keyboardPickedLetter === item.letter}
                            aria-label={
                              keyboardPickedLetter === item.letter
                                ? `Letter ${item.letter} selected. Choose a box and press Enter.`
                                : `Letter ${item.letter}. Press Enter to select it.`
                            }
                            onFocus={() => setFocusedLetter(item.letter)}
                            onBlur={() => setFocusedLetter(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();

                                handleKeyboardPick(item.letter);

                                return;
                              }

                              provided.dragHandleProps?.onKeyDown?.(e);
                            }}
                            onClick={(e) => {
                              // Narrator synthetic click فقط
                              if (e.detail === 0) {
                                e.preventDefault();
                                e.stopPropagation();

                                handleKeyboardPick(item.letter);
                              }
                            }}
                            style={{
                              transform:
                                keyboardPickedLetter === item.letter
                                  ? "scale(1.15)"
                                  : focusedLetter === item.letter
                                    ? "scale(1.06)"
                                    : "scale(1)",

                              outline:
                                keyboardPickedLetter === item.letter
                                  ? "3px solid #2563eb"
                                  : focusedLetter === item.letter
                                    ? "2px solid #2563eb"
                                    : "none",

                              outlineOffset: "3px",

                              background:
                                keyboardPickedLetter === item.letter
                                  ? "#dbeafe"
                                  : undefined,

                              boxShadow:
                                keyboardPickedLetter === item.letter
                                  ? "0 0 0 5px rgba(37,99,235,0.18), 0 6px 14px rgba(0,0,0,0.22)"
                                  : "none",

                              transition:
                                "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",

                              zIndex:
                                keyboardPickedLetter === item.letter ? 20 : 1,

                              ...provided.draggableProps.style,
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

            {/* 🧩 خانات الإجابة */}
            <div className="words">
              {questionGroups.map((group, gIndex) => (
                <div className="word-group" key={gIndex}>
                  {group.map((num, lIndex) => (
                    <Droppable
                      droppableId={`slot-${gIndex}-${lIndex}`}
                      isDropDisabled={showAnswer || isChecked}
                    >
                      {(provided, snapshot) => (
                        <div className="slot-wrapper">
                          {/* 🔢 الرقم فوق المربع */}
                          <h6 className="slot-number">{num}</h6>

                          {/* ⬜ مربع الدروب */}
                          <div
                            ref={(el) => {
                              provided.innerRef(el);

                              const flatIndex = getFlatSlotIndex(
                                gIndex,
                                lIndex,
                              );

                              slotRefs.current[flatIndex] = el;
                            }}
                            {...provided.droppableProps}
                            className={`drop-slot 
    ${snapshot.isDraggingOver ? "drag-over" : ""}
    ${wrongInputs.includes(`${gIndex}-${lIndex}`) ? "wrong" : ""}`}
                            role="button"
                            tabIndex={showAnswer || isChecked ? -1 : 0}
                            aria-label={
                              keyboardPickedLetter
                                ? slots[gIndex][lIndex]
                                  ? `Box ${
                                      getFlatSlotIndex(gIndex, lIndex) + 1
                                    }. Current letter ${
                                      slots[gIndex][lIndex]
                                    }. Press Enter to replace it with ${keyboardPickedLetter}.`
                                  : `Box ${
                                      getFlatSlotIndex(gIndex, lIndex) + 1
                                    }. Press Enter to place ${keyboardPickedLetter}.`
                                : slots[gIndex][lIndex]
                                  ? `Box ${
                                      getFlatSlotIndex(gIndex, lIndex) + 1
                                    }. Current letter ${slots[gIndex][lIndex]}.`
                                  : `Box ${
                                      getFlatSlotIndex(gIndex, lIndex) + 1
                                    } is empty. Select a letter first.`
                            }
                            onFocus={() =>
                              setFocusedSlot(`${gIndex}-${lIndex}`)
                            }
                            onBlur={() => setFocusedSlot(null)}
                            onKeyDown={(e) => {
                              const flatIndex = getFlatSlotIndex(
                                gIndex,
                                lIndex,
                              );

                              // ==================================
                              // Tab محصور بالخانات فقط
                              // طول ما في حرف ممسوك
                              // ==================================
                              if (keyboardPickedLetter && e.key === "Tab") {
                                e.preventDefault();
                                e.stopPropagation();

                                const totalSlots = questionGroups.flat().length;

                                let nextIndex;

                                if (e.shiftKey) {
                                  nextIndex =
                                    flatIndex === 0
                                      ? totalSlots - 1
                                      : flatIndex - 1;
                                } else {
                                  nextIndex =
                                    flatIndex === totalSlots - 1
                                      ? 0
                                      : flatIndex + 1;
                                }

                                slotRefs.current[nextIndex]?.focus();

                                return;
                              }

                              // ==================================
                              // Enter = حط أو استبدل الحرف
                              // ==================================
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();

                                if (keyboardPickedLetter) {
                                  handleKeyboardDrop(gIndex, lIndex, flatIndex);
                                }
                              }
                            }}
                            onClick={(e) => {
                              if (e.detail === 0 && keyboardPickedLetter) {
                                e.preventDefault();
                                e.stopPropagation();

                                handleKeyboardDrop(
                                  gIndex,
                                  lIndex,
                                  getFlatSlotIndex(gIndex, lIndex),
                                );
                              }
                            }}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#c4e5fc"
                                : keyboardPickedLetter &&
                                    focusedSlot === `${gIndex}-${lIndex}`
                                  ? "#dbeafe"
                                  : undefined,

                              outline:
                                keyboardPickedLetter &&
                                focusedSlot === `${gIndex}-${lIndex}`
                                  ? "3px solid #2563eb"
                                  : "none",

                              outlineOffset: "3px",

                              transform:
                                keyboardPickedLetter &&
                                focusedSlot === `${gIndex}-${lIndex}`
                                  ? "scale(1.08)"
                                  : "scale(1)",

                              boxShadow:
                                keyboardPickedLetter &&
                                focusedSlot === `${gIndex}-${lIndex}`
                                  ? "0 0 0 4px rgba(37,99,235,0.15)"
                                  : "none",

                              transition:
                                "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
                            }}
                          >
                            {wrongInputs.includes(`${gIndex}-${lIndex}`) && (
                              <div className="error-mark1" aria-hidden="true">
                                ✕
                              </div>
                            )}

                            {slots[gIndex][lIndex] && (
                              <div className="dropped-letter">
                                {slots[gIndex][lIndex]}
                              </div>
                            )}

                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              ))}
              <div className="text-[40px] text-center font-semibold mt-5">
                ?
              </div>
            </div>
            <div
              className={`sentence-box ${
                isSentenceCorrect ? "sentence-clickable" : ""
              }`}
              role={isSentenceCorrect ? "button" : undefined}
              tabIndex={isSentenceCorrect ? 0 : -1}
              aria-label={
                isSentenceCorrect
                  ? `Correct sentence: ${sentence}. Press Enter to hear it.`
                  : undefined
              }
              title={isSentenceCorrect ? "Play sentence audio" : undefined}
              onClick={isSentenceCorrect ? playSentenceAudio : undefined}
              onKeyDown={(e) => {
                if (isSentenceCorrect && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  e.stopPropagation();

                  playSentenceAudio();
                }
              }}
              onFocus={(e) => {
                if (!isSentenceCorrect) return;

                e.currentTarget.style.outline = "3px solid #2563eb";

                e.currentTarget.style.outlineOffset = "4px";
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
              style={{
                cursor: isSentenceCorrect ? "pointer" : "default",
              }}
            >
              <span className="sentence-text">{sentence}</span>

              <div className="text-[30px] font-semibold">?</div>
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* 🔘 Buttons */}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setSlots(questionGroups.map((g) => g.map(() => null)));
            setWrongInputs([]);
            setShowAnswer(false);
            setIsChecked(false);
            setKeyboardPickedLetter(null);
            setKeyboardMessage("");
            setFocusedLetter(null);
            setFocusedSlot(null);
          }}
          className="try-again-button"
          title="Start again"
        >
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
          title="Show answer"
        >
          Show Answer
        </button>

        <button
          onClick={handleCheckAnswers}
          className="check-button2"
          title="Check answer"
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Page8_Q4;
