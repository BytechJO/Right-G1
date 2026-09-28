import React, { useState, useRef, useEffect } from "react";
import CD6_Pg8_Instruction1_AdultLady from "../../../assets/unit1/sounds/pg8-instruction1-all.mp3";
import Pg8_1_1_AdultLady from "../../../assets/unit1/Page 8 - A 1/tiger.mp3";
import Pg8_1_2_AdultLady from "../../../assets/unit1/Page 8 - A 1/taxi.mp3";
import Pg8_1_3_AdultLady from "../../../assets/unit1/Page 8 - A 1/duck.mp3";
import Pg8_1_4_AdultLady from "../../../assets/unit1/Page 8 - A 1/deer.mp3";
import deer from "../../../assets/unit1/imgs/deer flip.svg";
import duck from "../../../assets/unit1/imgs/duck.svg";
import taxi from "../../../assets/unit1/imgs/taxi_1.svg";
import tiger from "../../../assets/unit1/imgs/tiger.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SquirrelGif from "../../../assets/Squirrel_GIF/Squirrel_1164_1433px.gif";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

const Page8_Q1 = () => {
  const clickAudioRef = useRef(null);

  const dropRefs = useRef([]);
  const bankRefs = useRef([]);

  const lastPickedBankIndexRef = useRef(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAutoAnswer, setIsAutoAnswer] = useState(false);
  const [forceStopAudio, setForceStopAudio] = useState(0);

  // ========================================
  // ACCESSIBILITY
  // ========================================
  const [keyboardPickedLetter, setKeyboardPickedLetter] = useState(null);
  const [keyboardMessage, setKeyboardMessage] = useState("");

  // فقط لعرض الـ focus بالـ inline style
  const [focusedBankItem, setFocusedBankItem] = useState(null);
  const [focusedDrop, setFocusedDrop] = useState(null);

  const data = [
    {
      word: "deer",
      missing: "d",
      sound: Pg8_1_4_AdultLady,
      src: deer,
      num: "4",
    },
    {
      word: "duck",
      missing: "d",
      sound: Pg8_1_3_AdultLady,
      src: duck,
      num: "3",
    },
    {
      word: "tiger",
      missing: "t",
      sound: Pg8_1_1_AdultLady,
      src: tiger,
      num: "1",
    },
    {
      word: "taxi",
      missing: "t",
      sound: Pg8_1_2_AdultLady,
      src: taxi,
      num: "2",
    },
  ];

  const displayOrder = [2, 3, 1, 0]; // ترتيب الكلمات

  const [answers, setAnswers] = useState({
    letters: Array(data.length).fill(null),
  });

  const [wrongLetters, setWrongLetters] = useState(data.map(() => false));

  const stopAtSecond = 7.6;

  const lettersBank = [
    { id: "l-d", value: "d" },
    { id: "l-t", value: "t" },
  ];

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 4.23,
      text: "Page 8. Right Activities. Exercise A, number 1. ",
    },
    {
      start: 4.25,
      end: 7.4,
      text: "Listen and write the missing letters.",
    },
    { start: 7.8, end: 9.6, text: "1-tiger." },
    { start: 9.8, end: 11.6, text: "2-taxi." },
    { start: 11.8, end: 13.7, text: "3-duck." },
    { start: 13.8, end: 15.8, text: "4-deer." },
  ];

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;

    // 1) Letter drop zones
    if (
      draggableId.startsWith("l-") &&
      destination.droppableId.startsWith("letter-drop-")
    ) {
      const index = Number(destination.droppableId.replace("letter-drop-", ""));

      const value = draggableId.replace("l-", "");

      setAnswers((prev) => {
        const letters = [...prev.letters];

        letters[index] = value;

        return {
          ...prev,
          letters,
        };
      });

      setWrongLetters(data.map(() => false));

      return;
    }

    // 2) Number drop zones
  };

  // ========================================
  // ACCESSIBILITY
  // وضع الحرف بالكيبورد
  // ========================================
  const placeLetterWithKeyboard = (dataIndex, displayIndex) => {
    if (!keyboardPickedLetter || showAnswer) return;

    const placedLetter = keyboardPickedLetter.value;

    setAnswers((prev) => {
      const letters = [...prev.letters];

      letters[dataIndex] = placedLetter;

      return {
        ...prev,
        letters,
      };
    });

    setWrongLetters(data.map(() => false));

    setKeyboardMessage(
      `Letter ${placedLetter} placed in answer ${
        displayIndex + 1
      }. Choose another letter.`,
    );

    // ============================
    // خلصنا من الحرف
    // ============================
    setKeyboardPickedLetter(null);

    // ============================
    // رجع الـ focus فوق للخيارات
    // ============================
    setTimeout(() => {
      bankRefs.current[lastPickedBankIndexRef.current]?.focus();
    }, 0);
  };
  const reset = () => {
    setAnswers({
      letters: Array(data.length).fill(null),
    });

    setWrongLetters(data.map(() => false));

    setShowAnswer(false);
    setIsAutoAnswer(false);

    // Accessibility reset
    setKeyboardPickedLetter(null);
    setKeyboardMessage("");
    setFocusedBankItem(null);
    setFocusedDrop(null);
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    // 1️⃣ فحص الفراغ
    if (answers.letters.some((v) => !v)) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );

      return;
    }

    let correctLetters = 0;
    let correctNumbers = 0;

    // 2️⃣ الحساب
    data.forEach((item, i) => {
      const pickedLetter = answers.letters[i];

      if (pickedLetter === item.missing) correctLetters++;
    });

    const totalPoints = data.length;
    const score = correctLetters;

    // 3️⃣ تحديد الغلط
    const letterWrongs = data.map(
      (item, i) => answers.letters[i] !== item.missing,
    );

    setWrongLetters(letterWrongs);

    setShowAnswer(true);

    // 4️⃣ الرسالة
    const color =
      score === totalPoints ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${score} / ${totalPoints}
        </span>
      </div>
    `;

    if (score === totalPoints) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const playSound = (sound) => {
    if (!sound) return;

    // خبر الـ QuestionAudioPlayer إنه يوقف ويغير الأيقونة
    setForceStopAudio((prev) => prev + 1);

    // وقف صوت الصورة السابق
    if (clickAudioRef.current) {
      clickAudioRef.current.pause();
      clickAudioRef.current.currentTime = 0;

      clickAudioRef.current.src = sound;
      clickAudioRef.current.play();
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper" style={{ padding: "30px" }}>
        {/* ========================================
            ACCESSIBILITY - Screen reader messages
        ======================================== */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            clipPath: "inset(50%)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          {keyboardMessage}
        </div>

        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            position: "relative",
            gap: "30px",
          }}
        >
          <ExerciseHeader
            sectionLetter="A"
            questionNumber="1"
            title="Listen and write the missing letters."
            subTitle="Listen, then drag d or t into each blank. Tap each card to hear it again."
          />
          <audio ref={clickAudioRef} style={{ display: "none" }} />

          <QuestionAudioPlayer
            src={CD6_Pg8_Instruction1_AdultLady}
            captions={captions}
            pageId="unit1-page8-q1"
            stopAtSecond={stopAtSecond}
            forceStop={forceStopAudio}
          />

          <Droppable droppableId="letters-bank" direction="horizontal">
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
                  width: "100%",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {lettersBank.map((l, i) => (
                  <Draggable
                    key={l.id}
                    draggableId={l.id}
                    index={i}
                    isDragDisabled={showAnswer}
                  >
                    {(provided) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          bankRefs.current[i] = el;
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        // ==========================
                        // ACCESSIBILITY
                        // ==========================
                        role="button"
                        tabIndex={showAnswer ? -1 : 0}
                        aria-pressed={keyboardPickedLetter?.id === l.id}
                        aria-label={
                          keyboardPickedLetter?.id === l.id
                            ? `Letter ${l.value} selected. Use Tab to move to an answer box and press Enter to place it.`
                            : `Letter ${l.value}. Press Enter to pick it up.`
                        }
                        onFocus={() => setFocusedBankItem(l.id)}
                        onBlur={() => setFocusedBankItem(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();

                            if (keyboardPickedLetter?.id === l.id) {
                              setKeyboardPickedLetter(null);

                              setKeyboardMessage(
                                `Letter ${l.value} selection cancelled.`,
                              );
                            } else {
                              // احفظ أي حرف اخترناه
                              lastPickedBankIndexRef.current = i;

                              setKeyboardPickedLetter(l);

                              setKeyboardMessage(
                                `Letter ${l.value} selected. Use Tab to choose an answer box, then press Enter.`,
                              );

                              // مباشرة لأول input
                              setTimeout(() => {
                                dropRefs.current[0]?.focus();
                              }, 0);
                            }

                            return;
                          }

                          // باقي مفاتيح الـ drag الأصلية
                          provided.dragHandleProps?.onKeyDown?.(e);
                        }}
                        className="bank-item"
                        style={{
                          width: keyboardPickedLetter?.id === l.id ? 48 : 40,

                          height: keyboardPickedLetter?.id === l.id ? 48 : 40,

                          borderRadius: "50%",
                          border:
                            keyboardPickedLetter?.id === l.id
                              ? "3px solid #2563eb"
                              : "2px solid #2c5287",

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",

                          background:
                            keyboardPickedLetter?.id === l.id
                              ? "#dbeafe"
                              : "white",

                          transform:
                            keyboardPickedLetter?.id === l.id
                              ? "scale(1.15)"
                              : focusedBankItem === l.id
                                ? "scale(1.05)"
                                : "scale(1)",

                          boxShadow:
                            keyboardPickedLetter?.id === l.id
                              ? "0 0 0 5px rgba(37, 99, 235, 0.20), 0 6px 14px rgba(0,0,0,0.22)"
                              : focusedBankItem === l.id
                                ? "0 0 0 3px rgba(37, 99, 235, 0.18)"
                                : "none",

                          outline:
                            focusedBankItem === l.id
                              ? "2px solid #2563eb"
                              : "none",

                          outlineOffset: "3px",

                          transition:
                            "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, width 0.15s ease, height 0.15s ease",

                          zIndex: keyboardPickedLetter?.id === l.id ? 20 : 1,

                          ...provided.draggableProps.style,
                        }}
                      >
                        {l.value}
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* ✅ الكلمات */}
          <div
            className="div-input"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px",
              // marginLeft:"40px",
              width: "100%",
            }}
          >
            {displayOrder.map((dataIndex, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: "40px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <span className="number-of-q">{index + 1}</span>

                  <Droppable droppableId={`letter-drop-${dataIndex}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          dropRefs.current[index] = el;
                        }}
                        {...provided.droppableProps}
                        role="button"
                        tabIndex={showAnswer ? -1 : 0}
                        aria-label={
                          keyboardPickedLetter
                            ? answers.letters[dataIndex]
                              ? `Answer ${index + 1}. Current letter ${
                                  answers.letters[dataIndex]
                                }. Press Enter to replace it with ${
                                  keyboardPickedLetter.value
                                }.`
                              : `Answer ${index + 1}. Press Enter to place letter ${
                                  keyboardPickedLetter.value
                                }.`
                            : answers.letters[dataIndex]
                              ? `Answer ${index + 1}. Current letter ${
                                  answers.letters[dataIndex]
                                }.`
                              : `Answer ${index + 1} is empty. Select a letter first.`
                        }
                        onFocus={() => setFocusedDrop(dataIndex)}
                        onBlur={() => setFocusedDrop(null)}
                        onKeyDown={(e) => {
                          // Tab محصور بين الـ inputs
                          if (keyboardPickedLetter && e.key === "Tab") {
                            e.preventDefault();
                            e.stopPropagation();

                            const totalDrops = dropRefs.current.length;

                            let nextIndex;

                            if (e.shiftKey) {
                              nextIndex =
                                index === 0 ? totalDrops - 1 : index - 1;
                            } else {
                              nextIndex =
                                index === totalDrops - 1 ? 0 : index + 1;
                            }

                            dropRefs.current[nextIndex]?.focus();

                            return;
                          }

                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();

                            if (keyboardPickedLetter) {
                              placeLetterWithKeyboard(dataIndex, index);
                            } else {
                              setKeyboardMessage(
                                "Select a letter first, then use Tab to choose an answer box.",
                              );
                            }
                          }
                        }}
                        className={`char-drop ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        style={{
                          width: "40px",
                          height: "45px",
                          borderBottom: "2px solid #2c5287",

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "30px",

                          background: snapshot.isDraggingOver
                            ? "#c4e5fcff"
                            : keyboardPickedLetter && focusedDrop === dataIndex
                              ? "#dbeafe"
                              : "white",

                          color: isAutoAnswer ? "red" : "black",

                          outline:
                            keyboardPickedLetter && focusedDrop === dataIndex
                              ? "3px solid #2563eb"
                              : "none",

                          outlineOffset: "3px",

                          transform:
                            keyboardPickedLetter && focusedDrop === dataIndex
                              ? "scale(1.12)"
                              : "scale(1)",

                          boxShadow:
                            keyboardPickedLetter && focusedDrop === dataIndex
                              ? "0 0 0 4px rgba(37, 99, 235, 0.15)"
                              : "none",

                          transition:
                            "transform 0.15s ease, background 0.15s ease, outline 0.15s ease, box-shadow 0.15s ease",
                        }}
                      >
                        {answers.letters[dataIndex] || ""}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                    }}
                  >
                    {data[dataIndex].word.slice(1)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexDirection: "column",
                  }}
                >
                  <img
                    key={data[dataIndex].num}
                    src={data[dataIndex].src}
                    className="exercise-image"
                    role="button"
                    tabIndex={0}
                    alt={`${data[dataIndex].word} image`}
                    aria-label={`Play audio for ${data[dataIndex].word}`}
                    onClick={(e) => {
                      // mouse click عادي
                      if (e.detail > 0) {
                        playSound(data[dataIndex].sound);
                        return;
                      }

                      // Narrator / keyboard synthetic click
                      playSound(data[dataIndex].sound);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();

                        playSound(data[dataIndex].sound);
                      }
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = "3px solid #2563eb";
                      e.currentTarget.style.outlineOffset = "4px";
                      e.currentTarget.style.borderRadius = "8px";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = "none";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.15s ease",
                    }}
                    forceStop={forceStopAudio}
                  />
                </div>

                {wrongLetters[dataIndex] && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "0%",
                      transform: "translateY(-50%)",
                      width: "22px",
                      height: "22px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      border: "2px solid white",
                    }}
                  >
                    ✕
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button
            onClick={reset}
            className="try-again-button"
            aria-label="Start again"
            title="Start again"
          >
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            aria-label="Show answer"
            title="Show answer"
            onClick={() => {
              setShowAnswer(true);
              setIsAutoAnswer(true);

              setAnswers({
                letters: data.map((item) => item.missing),

                numbers: data.map((item) => `n-${item.num}`),
              });

              setWrongLetters(data.map(() => false));

              // Accessibility
              setKeyboardPickedLetter(null);
              setKeyboardMessage("Correct answers are shown.");
            }}
          >
            Show Answer
          </button>

          <button
            onClick={checkAnswers}
            className="check-button2"
            aria-label="Check answer"
            title="Check answer"
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Page8_Q1;
