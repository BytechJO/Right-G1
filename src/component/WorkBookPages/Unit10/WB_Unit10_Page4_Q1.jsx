import React, { useState } from "react";
import img1 from "../../../assets/U1 WB/U10/U10P60EXEG-01.svg";
import img2 from "../../../assets/U1 WB/U10/U10P60EXEG-02.svg";
import img3 from "../../../assets/U1 WB/U10/U10P60EXEG-03.svg";
import img4 from "../../../assets/U1 WB/U10/U10P60EXEG-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit10Audio from "./useUnit10Audio";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import full1 from "../../../assets/U1 WB/U10/audio/page60- G/full1.mp3";
import full2 from "../../../assets/U1 WB/U10/audio/page60- G/full2.mp3";
import full3 from "../../../assets/U1 WB/U10/audio/page60- G/full3.mp3";
import full4 from "../../../assets/U1 WB/U10/audio/page60- G/full4.mp3";
import question1 from "../../../assets/U1 WB/U10/audio/page60- G/Item_001_Do_you_want_bread.mp3";
import question2 from "../../../assets/U1 WB/U10/audio/page60- G/Item_002_Do_you_want_an_apple.mp3";
import question3 from "../../../assets/U1 WB/U10/audio/page60- G/Item_003_Do_you_want_fruit.mp3";
import question4 from "../../../assets/U1 WB/U10/audio/page60- G/Item_004_Do_you_want_milk.mp3";
import yesAudio from "../../../assets/U1 WB/U10/audio/page60- G/Item_005_Yes,_I_do.mp3";
import noMilkAudio from "../../../assets/U1 WB/U10/audio/page60- G/Item_006_No,_I_don't._I_want_milk.mp3";
import noSteakAudio from "../../../assets/U1 WB/U10/audio/page60- G/Item_007_No,_I_don't._I_want_a_steak.mp3";
import noChickenAudio from "../../../assets/U1 WB/U10/audio/page60- G/Item_008_No,_I_don't._I_want_chicken.mp3";
import noIceCreamAudio from "../../../assets/U1 WB/U10/audio/page60- G/Item_009_No,_I_don't._I_want_ice_cream.mp3";
import "./WB_Unit10_Page4_Q1.css";

const WB_Unit10_Page4_Q1 = () => {
  const questions = [
    {
      id: 1,
      image: img1,
      alt: "A girl thinking about bread.",
      text: "Do you want bread?",
      questionAudio: question1,
      fullAudio: full1,
      items: [
        { text: "Yes, I do.", correct: "✓", audio: yesAudio },
        { text: "No, I don’t. I want milk", correct: "x", audio: noMilkAudio },
      ],
    },
    {
      id: 2,
      image: img2,
      alt: "A girl thinking about an apple.",
      text: "Do you want an apple?",
      questionAudio: question2,
      fullAudio: full2,
      items: [
        { text: "Yes, I do.", correct: "✓", audio: yesAudio },
        {
          text: "No, I don’t. I want a steak.",
          correct: "x",
          audio: noSteakAudio,
        },
      ],
    },
    {
      id: 3,
      image: img3,
      alt: "A boy thinking about chicken.",
      text: "Do you want fruit?",
      questionAudio: question3,
      fullAudio: full3,
      items: [
        { text: "Yes, I do.", correct: "x", audio: yesAudio },
        {
          text: "No, I don’t. I want chicken.",
          correct: "✓",
          audio: noChickenAudio,
        },
      ],
    },
    {
      id: 4,
      image: img4,
      alt: "A boy thinking about ice cream.",
      text: "Do you want milk?",
      questionAudio: question4,
      fullAudio: full4,
      items: [
        { text: "Yes, I do.", correct: "x", audio: yesAudio },
        {
          text: "No, I don’t. I want ice cream.",
          correct: "✓",
          audio: noIceCreamAudio,
        },
      ],
    },
  ];

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [lockedIds, setLockedIds] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();

  // -------------------------
  // اختيار جواب واحد فقط لكل سؤال
  // -------------------------
  const handleSelect = (qId, idx) => {
    if (showAnswer || lockedIds.includes(qId)) return;
    setAnswers({
      ...answers,
      [qId]: idx, // نخزن رقم الخيار المختار
    });
    setResults((previous) => ({ ...previous, [qId]: undefined }));
  };

  const checkAnswers = () => {
    if (showAnswer || lockedIds.length === questions.length) return;
    if (questions.some((q) => answers[q.id] === undefined)) {
      ValidationAlert.info("Please answer all questions!");
      return;
    }
    const temp = {};
    let correctCount = 0;
    let total = questions.length;

    questions.forEach((q) => {
      const chosenIndex = answers[q.id];

      if (chosenIndex === undefined) {
        temp[q.id] = "empty";
        return;
      }

      const isCorrect = q.items[chosenIndex].correct.toLowerCase() === "✓";

      temp[q.id] = isCorrect ? "correct" : "wrong";

      if (isCorrect) correctCount++;
    });

    setResults(temp);
    const correctIds = questions
      .filter((q) => temp[q.id] === "correct")
      .map((q) => q.id);
    setLockedIds((previous) => [...new Set([...previous, ...correctIds])]);
    setCompletedIds((previous) => [...new Set([...previous, ...correctIds])]);

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;
    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };
  const reset = () => {
    setAnswers({});
    setResults({});
    setShowAnswer(false); // ← مهم جداً
    setLockedIds([]);
    setCompletedIds([]);
    stopAudio();
  };
  const handleShowAnswer = () => {
    const correctAnswers = {};

    questions.forEach((q) => {
      const correctIndex = q.items.findIndex(
        (item) => item.correct.toLowerCase() === "✓",
      );
      correctAnswers[q.id] = correctIndex;
    });

    setAnswers(correctAnswers);
    setResults({});
    setShowAnswer(true);
    setLockedIds(questions.map((q) => q.id));
    setCompletedIds(questions.map((q) => q.id));
    stopAudio();
  };

  return (
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
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <ExerciseHeader
          sectionLetter="G"
          title="Look, read, and write ✓."
          subTitle="Compare the picture with the question and tap the response that matches."
        />

        <div className="wb-unit10-p4-q1-grid w-full">
          {questions.map((q) => (
            <div
              key={q.id}
              className={`wb-unit10-p4-q1-box wb-unit10-audio-control${completedIds.includes(q.id) ? " wb-unit10-completed-audio" : ""}`}
              role={completedIds.includes(q.id) ? "button" : undefined}
              tabIndex={completedIds.includes(q.id) ? 0 : undefined}
              aria-label={
                completedIds.includes(q.id)
                  ? `Play complete question ${q.id}`
                  : undefined
              }
              onClick={
                completedIds.includes(q.id)
                  ? () => playAudio(`full-${q.id}`, q.fullAudio)
                  : undefined
              }
              onKeyDown={
                completedIds.includes(q.id)
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        playAudio(`full-${q.id}`, q.fullAudio);
                      }
                    }
                  : undefined
              }
            >
              {activeAudioKey === `full-${q.id}` && <Unit10PlayingAudioIcon />}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <img
                  src={q.image}
                  alt={q.alt}
                  className="wb-unit10-p4-q1-img"
                />
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="wb-unit10-p4-q1-text"
                    style={{
                      color: "#1d4f7b",
                      fontSize: "22px",
                      fontWeight: "700",
                    }}
                  >
                    {q.id}
                  </span>
                  <span
                    className="wb-unit10-p4-q1-text wb-unit10-audio-control"
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio: ${q.text}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      playAudio(`question-${q.id}`, q.questionAudio);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        playAudio(`question-${q.id}`, q.questionAudio);
                      }
                    }}
                  >
                    {activeAudioKey === `question-${q.id}` && (
                      <Unit10PlayingAudioIcon />
                    )}
                    {q.text}
                  </span>
                </div>
              </div>
              <div>
                {q.items.map((item, idx) => {
                  const isSelected = answers[q.id] === idx;
                  const isWrong = results[q.id] === "wrong" && isSelected;

                  return (
                    <div
                      key={idx}
                      className="wb-unit10-p4-q1-row wb-unit10-audio-control"
                      role="button"
                      tabIndex={0}
                      aria-label={`${isSelected ? "Selected. " : ""}${item.text}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        playAudio(`option-${q.id}-${idx}`, item.audio);
                        if (!lockedIds.includes(q.id) && !showAnswer)
                          handleSelect(q.id, idx);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          playAudio(`option-${q.id}-${idx}`, item.audio);
                          if (!lockedIds.includes(q.id) && !showAnswer)
                            handleSelect(q.id, idx);
                        }
                      }}
                    >
                      {activeAudioKey === `option-${q.id}-${idx}` && (
                        <Unit10PlayingAudioIcon />
                      )}
                      <div className="review3-p1-q3-input-box">
                        <input
                          type="text"
                          readOnly
                          value={isSelected ? "✓" : ""}
                          tabIndex={-1}
                          className={`wb-unit10-p4-q1-input`}
                          disabled={showAnswer || lockedIds.includes(q.id)}
                          style={{
                            cursor:
                              showAnswer || lockedIds.includes(q.id)
                                ? "default"
                                : "pointer",
                          }}
                        />

                        {isWrong && <span className="review3-p1-q3-x">✕</span>}
                      </div>{" "}
                      <span className="wb-unit10-p4-q1-text">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
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
  );
};

export default WB_Unit10_Page4_Q1;
