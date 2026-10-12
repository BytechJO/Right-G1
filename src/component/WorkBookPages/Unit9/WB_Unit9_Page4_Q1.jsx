import React, { useState } from "react";
import "./WB_Unit9_Page4_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U9/U9P54EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U9/U9P54EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U9/U9P54EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U9/U9P54EXEH-04.svg";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import chickensAudio from "../../../assets/U1 WB/U9/audio/page54- H/Item_001_chickens.mp3";
import goatsAudio from "../../../assets/U1 WB/U9/audio/page54- H/Item_002_goats.mp3";
import heLikesAudio from "../../../assets/U1 WB/U9/audio/page54- H/Item_003_He_likes.mp3";
import horsesAudio from "../../../assets/U1 WB/U9/audio/page54- H/Item_004_horses.mp3";
import cowsAudio from "../../../assets/U1 WB/U9/audio/page54- H/Item_005_cows.mp3";
import dogsAudio from "../../../assets/U1 WB/U9/audio/page54- H/Item_006_dogs.mp3";
import catsAudio from "../../../assets/U1 WB/U9/audio/page54- H/Item_007_cats.mp3";
import sheLikesAudio from "../../../assets/unit9/sound/Page 81 - D/She likes.mp3";
const WB_Unit9_Page4_Q1 = () => {
  // ===============================
  // 🔵 1) الأسئلة (كلها داخل نفس الكومبونينت)
  // ===============================
  const questions = [
    {
      id: 1,
      parts: [
        { type: "text", value: "He likes" },
        { type: "blank", options: ["goats", "cows"] },
        { type: "text", value: "." },
      ],
      correct: ["cows"],
      image: img1,
    },

    {
      id: 2,
      parts: [
        { type: "text", value: "She likes" },
        { type: "blank", options: ["chickens", "horses"] },
        { type: "text", value: "." },
      ],
      correct: ["chickens"],
      image: img2,
    },
    {
      id: 3,
      parts: [
        { type: "text", value: "He likes" },
        { type: "blank", options: ["dogs", "cats"] },
        { type: "text", value: "." },
      ],
      correct: ["cats"],
      image: img3,
    },
    {
      id: 4,
      parts: [
        { type: "text", value: "He likes" },
        { type: "blank", options: ["horses", "goats"] },
        { type: "text", value: "." },
      ],
      correct: ["horses"],
      image: img4,
    },
  ];

  // ===============================
  // 🔵 2) حفظ اختيارات الطالب
  // ===============================
  const [answers, setAnswers] = useState(
    questions.map((q) => q.parts.map((p) => (p.type === "blank" ? null : null)))
  );
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [lockedQuestions, setLockedQuestions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const { activeAudioKey, playAudio, playAudioSequence } = useUnit9Audio();
  const animalAudios = {
    chickens: chickensAudio,
    goats: goatsAudio,
    horses: horsesAudio,
    cows: cowsAudio,
    dogs: dogsAudio,
    cats: catsAudio,
  };
  const prefixAudios = [heLikesAudio, sheLikesAudio, heLikesAudio, heLikesAudio];

  const playCompleteQuestion = (questionIndex) => {
    playAudioSequence(`full-${questionIndex}`, [
      prefixAudios[questionIndex],
      animalAudios[questions[questionIndex].correct[0]],
    ]);
  };

  // ===============================
  // 🔵 3) الضغط على خيار
  // ===============================
  const handleSelect = (qIndex, blankIndex, option) => {
    if (showAnswer || lockedQuestions.includes(qIndex)) return;
    const updated = [...answers];
    updated[qIndex][blankIndex] = option;
    setAnswers(updated);
    setWrongQuestions((current) => current.filter((index) => index !== qIndex));
  };

  // ===============================
  // 🔵 4) فحص الإجابات
  // ===============================
  const checkAnswers = () => {
    if (showAnswer || lockedQuestions.length === questions.length) return;
    // تحقق إذا الطالب ما اختار ولا شيء
    const selectedCount = questions.filter((_, index) => answers[index][0] !== null).length;
    if (selectedCount !== questions.length) {
      ValidationAlert.info("Please answer every question before checking.");
      return;
    }

    let correct = 0;
    let total = 0;

    questions.forEach((q, qIndex) => {
      q.correct.forEach((correctAns, blankIndex) => {
        total++;
        if (answers[qIndex][blankIndex] === correctAns) {
          correct++;
        }
      });
    });

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correct} / ${total}
      </span>
    </div>
  `;

    if (correct === total) ValidationAlert.success(scoreMessage);
    else if (correct === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    const correctQuestions = questions
      .map((question, index) => (answers[index][0] === question.correct[0] ? index : null))
      .filter((index) => index !== null);
    setLockedQuestions(correctQuestions);
    setWrongQuestions(questions.map((_, index) => index).filter((index) => !correctQuestions.includes(index)));
  };
  const showAnswers = () => {
    // اجابة كل سؤال = correct array
    const correctFilled = questions.map((q) => [...q.correct]);

    setAnswers(correctFilled);
    setWrongQuestions([]);
    setLockedQuestions(questions.map((_, index) => index));
    setShowAnswer(true);
  };

  // ===============================
  // 🔵 JSX
  // ===============================
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
          gap: "60px",
          
        }}
      >
        <ExerciseHeader sectionLetter="H" title="Look, read, and circle." subTitle="Look at the person and picture, then tap the animal they like." />
        <div
          className="content-container-wb-unit9-p4-q1 w-full"
   
        >
          {questions.map((q, qIndex) => (
            <div
              className={`question-row-wb-unit9-p4-q1 wb-unit9-audio-control ${lockedQuestions.includes(qIndex) ? "wb-unit9-completed-audio" : ""}`}
              key={q.id}
              role={lockedQuestions.includes(qIndex) ? "button" : undefined}
              tabIndex={lockedQuestions.includes(qIndex) ? 0 : undefined}
              aria-label={lockedQuestions.includes(qIndex) ? `Play complete sentence ${q.id}` : undefined}
              onClick={() => {
                if (lockedQuestions.includes(qIndex)) playCompleteQuestion(qIndex);
              }}
              onKeyDown={(event) => {
                if (lockedQuestions.includes(qIndex) && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  playCompleteQuestion(qIndex);
                }
              }}
            >
              {activeAudioKey === `full-${qIndex}` && <Unit9PlayingAudioIcon />}
              <div className="sentence-wb-unit9-p4-q1">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    // gap: "30px",
                  }}
                >
                  <span
                    className="header-title-page8"
                    style={{
                      color: "#2c5287",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {q.id}
                  </span>
                  <img
                    src={q.image}
                    alt={`Picture for sentence ${q.id}`}
                    className="question-img-review5-p2-q3"
                    style={{ width: "150px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {q.parts.map((part, pIndex) => {
                    if (part.type === "text") {
                      return (
                        <span
                          key={pIndex}
                          className="sentence-text-review5-p2-q3 wb-unit9-audio-control cursor-pointer"
                          role={part.value === "." || lockedQuestions.includes(qIndex) ? undefined : "button"}
                          tabIndex={part.value === "." || lockedQuestions.includes(qIndex) ? -1 : 0}
                          aria-label={part.value === "." ? undefined : `Play ${part.value}`}
                          onClick={(event) => {
                            if (part.value === ".") return;
                            event.stopPropagation();
                            if (lockedQuestions.includes(qIndex)) playCompleteQuestion(qIndex);
                            else playAudio(`prefix-${qIndex}`, prefixAudios[qIndex]);
                          }}
                          onKeyDown={(event) => {
                            if (part.value !== "." && (event.key === "Enter" || event.key === " ")) {
                              event.preventDefault();
                              event.stopPropagation();
                              playAudio(`prefix-${qIndex}`, prefixAudios[qIndex]);
                            }
                          }}
                        >
                          {activeAudioKey === `prefix-${qIndex}` && <Unit9PlayingAudioIcon />}
                          {part.value}
                        </span>
                      );
                    }

                    if (part.type === "blank") {
                      // blank index == ترتيب هذا الفراغ بين باقي الفراغات
                      const actualBlankIndex = q.parts
                        .filter((p) => p.type === "blank")
                        .indexOf(part);

                      return (
                        <span
                          key={pIndex}
                          className="blank-options-wb-unit9-p4-q1"
                        >
                          {part.options.map((opt, optIndex) => {
                            const isSelected =
                              answers[qIndex][actualBlankIndex] === opt;
                            const isWrongSelected =
                              wrongQuestions.includes(qIndex) &&
                              isSelected &&
                              opt !== q.correct[actualBlankIndex];

                            return (
                              <div key={optIndex} className="option-wrapper">
                                <span
                                  className={`option-word-review5-p2-q3 wb-unit9-audio-control ${
                                    isSelected ? "selected2" : ""
                                  }`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    if (lockedQuestions.includes(qIndex)) playCompleteQuestion(qIndex);
                                    else {
                                      playAudio(`option-${qIndex}-${opt}`, animalAudios[opt]);
                                      handleSelect(qIndex, actualBlankIndex, opt);
                                    }
                                  }}
                                  role="button"
                                  tabIndex={lockedQuestions.includes(qIndex) ? -1 : 0}
                                  aria-label={`Question ${q.id}: ${opt}`}
                                  aria-pressed={isSelected}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      playAudio(`option-${qIndex}-${opt}`, animalAudios[opt]);
                                      handleSelect(qIndex, actualBlankIndex, opt);
                                    }
                                  }}
                                >
                                  {activeAudioKey === `option-${qIndex}-${opt}` && <Unit9PlayingAudioIcon />}
                                  {opt}
                                </span>

                                {isWrongSelected && (
                                  <div className="wrong-mark">✕</div>
                                )}
                              </div>
                            );
                          })}
                        </span>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setAnswers(
              questions.map((q) =>
                q.parts.map((p) => (p.type === "blank" ? null : null))
              )
            );
            setWrongQuestions([]);
            setLockedQuestions([]);
            setShowAnswer(false);
          }}
        >
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit9_Page4_Q1;
