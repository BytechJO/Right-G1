import React, { useState } from "react";
import img1 from "../../../assets/unit10/imgs/U10P88EXEC-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P88EXEC-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P88EXEC-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P88EXEC-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review9_Page1_Q3.css";
import whatSheLikesAudio from "../../../assets/Review_9,10/Page 88 - C/What does she like.mp3";
import whatHeLikesAudio from "../../../assets/Review_9,10/Page 88 - C/What does he like.mp3";
import horsesAudio from "../../../assets/Review_9,10/Page 88 - C/She likes horses..mp3";
import chickensAudio from "../../../assets/Review_9,10/Page 88 - C/She likes chickens..mp3";
import dogsAudio from "../../../assets/Review_9,10/Page 88 - C/He likes dogs..mp3";
import catsAudio from "../../../assets/Review_9,10/Page 88 - C/He likes cats..mp3";
import full1Audio from "../../../assets/Review_9,10/Page 88 - C/full1.mp3";
import full2Audio from "../../../assets/Review_9,10/Page 88 - C/full2.mp3";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";

const Review9_Page1_Q3 = () => {
  const questions = [
    {
      id: 1,
      image: img3,
      mainImg: img1,
      mainAlt: "A girl asking a question.",
      imageAlt: "A girl standing near chickens on a farm.",
      text: "What does she like?",
      questionAudio: whatSheLikesAudio,
      fullAudio: full1Audio,
      items: [
        { text: "She likes horses.", correct: "x", audio: horsesAudio },
        { text: "She likes chickens.", correct: "✓", audio: chickensAudio },
      ],
    },
    {
      id: 2,
      image: img4,
      mainImg: img2,
      mainAlt: "A boy asking a question.",
      imageAlt: "A boy standing near cats on a farm.",
      text: "What does he like?",
      questionAudio: whatHeLikesAudio,
      fullAudio: full2Audio,
      items: [
        { text: "He likes dogs.", correct: "x", audio: dogsAudio },
        { text: "He likes cats.", correct: "✓", audio: catsAudio },
      ],
    },
  ];

  const [answers, setAnswers] = useState({});
  const [lockedIds, setLockedIds] = useState(new Set());
  const [wrongIds, setWrongIds] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const [fullAudioQuestions, setFullAudioQuestions] = useState([]);
  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();

  // -------------------------
  // اختيار جواب واحد فقط لكل سؤال
  // -------------------------
  const handleSelect = (qId, idx) => {
    if (showAnswer || lockedIds.has(qId)) return;
    setAnswers({
      ...answers,
      [qId]: idx, // نخزن رقم الخيار المختار
    });
    setWrongIds((current) => {
      const next = new Set(current);
      next.delete(qId);
      return next;
    });
  };

  const checkAnswers = () => {
    if (showAnswer || lockedIds.size === questions.length) return;
    const tempLocked = new Set(lockedIds);
    const tempWrong = new Set();
    let correctCount = 0;
    let total = questions.length;

    questions.forEach((q) => {
      const chosenIndex = answers[q.id];

      if (chosenIndex === undefined) {
        return;
      }

      const isCorrect = q.items[chosenIndex].correct.toLowerCase() === "✓";

      if (isCorrect) {
        correctCount++;
        tempLocked.add(q.id);
      } else {
        tempWrong.add(q.id);
      }
    });

    if (questions.some((q) => answers[q.id] === undefined)) {
      ValidationAlert.info("Please answer all questions!");
      return;
    }
    setLockedIds(tempLocked);
    setWrongIds(tempWrong);
    setFullAudioQuestions(Array.from(tempLocked));

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
    setLockedIds(new Set());
    setWrongIds(new Set());
    setShowAnswer(false);
    setFullAudioQuestions([]);
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

    setLockedIds(new Set(questions.map((q) => q.id)));

    setWrongIds(new Set());

    setShowAnswer(true);

    /*
    ✅ بعد Show Answer
    خلي كل سؤال كامل clickable / tabbable
    لتشغيل full audio
  */
    setFullAudioQuestions(questions.map((q) => q.id));

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
          gap: "60px",
        }}
      >
        <div className="review3-p1-q3-wrapper">
          <ExerciseHeaderReview
            sectionLetter="C"
            title={
              <>
                Look, read, and write <span style={{ color: "red" }}>✓</span>.
              </>
            }
            subTitle="Look at each picture, then tap the correct likes sentence."
          />

          <div className="review9-p1-q3-grid">
            <div className="flex flex-col gap-20">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className={`review9-p1-q3-box review-audio-control${
                    fullAudioQuestions.includes(q.id)
                      ? " review-full-audio-ready"
                      : ""
                  }`}
                  role={
                    fullAudioQuestions.includes(q.id) ? "button" : undefined
                  }
                  tabIndex={fullAudioQuestions.includes(q.id) ? 0 : undefined}
                  aria-label={
                    fullAudioQuestions.includes(q.id)
                      ? `Play the complete correct exchange for item ${q.id}.`
                      : undefined
                  }
                  onClick={
                    fullAudioQuestions.includes(q.id)
                      ? () => playAudio(`full-${q.id}`, q.fullAudio)
                      : undefined
                  }
                  onKeyDown={
                    fullAudioQuestions.includes(q.id)
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            playAudio(`full-${q.id}`, q.fullAudio);
                          }
                        }
                      : undefined
                  }
                >
                  {activeAudioKey === `full-${q.id}` && (
                    <ReviewPlayingAudioIcon />
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // width:"100%",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={q.mainImg}
                        alt={q.mainAlt}
                        className="review9-p1-q3-img"
                      />{" "}
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          className="input-text-field"
                          style={{
                            border: "2px solid black",
                            fontSize: "18px",
                            borderRadius: "8px",
                          }}
                          value={q.text}
                          readOnly
                          aria-label={`Play audio: ${q.text}`}
                          role="button"
                          tabIndex={0}
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
                        />
                      </div>{" "}
                    </div>

                    {/* <span className="Unit5-P6-Q3-text">{q.text}</span> */}
                  </div>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={q.image}
                      alt={q.imageAlt}
                      className="review9-p1-q3-img"
                    />
                    <div>
                      {q.items.map((item, idx) => {
                        const isSelected = answers[q.id] === idx;
                        const isWrong = wrongIds.has(q.id) && isSelected;
                        const isLocked = lockedIds.has(q.id) || showAnswer;

                        return (
                          <div key={idx} className="review3-p1-q3-row">
                            <span
                              className="review9-p1-q3-text review-audio-control"
                              role="button"
                              tabIndex={0}
                              aria-label={`Play audio: ${item.text}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                playAudio(`option-${q.id}-${idx}`, item.audio);
                              }}
                              onKeyDown={(event) => {
                                if (
                                  event.key === "Enter" ||
                                  event.key === " "
                                ) {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  playAudio(
                                    `option-${q.id}-${idx}`,
                                    item.audio,
                                  );
                                }
                              }}
                            >
                              {activeAudioKey === `option-${q.id}-${idx}` && (
                                <ReviewPlayingAudioIcon />
                              )}
                              {item.text}
                            </span>

                            <div className="review3-p1-q3-input-box">
                              <input
                                type="text"
                                readOnly
                                value={isSelected ? "✓" : ""}
                                role="button"
                                tabIndex={isLocked ? -1 : 0}
                                aria-label={`Select ${item.text} for item ${q.id}.`}
                                aria-pressed={isSelected}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleSelect(q.id, idx);
                                }}
                                onKeyDown={(event) => {
                                  if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                  ) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleSelect(q.id, idx);
                                  }
                                }}
                                className={`review3-p1-q3-input`}
                                disabled={isLocked}
                                style={{
                                  cursor: isLocked ? "not-allowed" : "pointer",
                                }}
                              />

                              {isWrong && (
                                <span className="review3-p1-q3-x">✕</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default Review9_Page1_Q3;
