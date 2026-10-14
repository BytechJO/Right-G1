import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review9_Page1_Q1.css";
import img1 from "../../../assets/unit10/imgs/U10P88EXEA-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P88EXEA-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P88EXEA-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P88EXEA-04.svg";
import chickenAudio from "../../../assets/Review_9,10/Page 88 - A/chicken.mp3";
import cowAudio from "../../../assets/Review_9,10/Page 88 - A/cow.mp3";
import dogAudio from "../../../assets/Review_9,10/Page 88 - A/dog.mp3";
import goatAudio from "../../../assets/Review_9,10/Page 88 - A/goat.mp3";
import horseAudio from "../../../assets/Review_9,10/Page 88 - A/horse.mp3";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";

const Review9_Page1_Q1 = () => {
  const [answers, setAnswers] = useState(Array(4).fill(null));
  const [lockedQuestions, setLockedQuestions] = useState(new Set());
  const [wrongQuestions, setWrongQuestions] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);

  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();
  const wordAudio = {
    chicken: chickenAudio,
    cow: cowAudio,
    dog: dogAudio,
    goat: goatAudio,
    horse: horseAudio,
  };
  const items = [
    { img: img1, alt: "A brown chicken.", options: ["horse", "chicken"], correctIndex: 1 },
    { img: img2, alt: "A black-and-white cow.", options: ["cow", "goat"], correctIndex: 0 },
    { img: img3, alt: "A brown horse.", options: ["dog", "horse"], correctIndex: 1 },
    { img: img4, alt: "A brown-and-white goat.", options: ["dog", "goat"], correctIndex: 1 },
  ];

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswer || lockedQuestions.has(qIndex)) return;

    const newAns = [...answers];
    newAns[qIndex] = optionIndex;
    setAnswers(newAns);
    setWrongQuestions((current) => {
      const next = new Set(current);
      next.delete(qIndex);
      return next;
    });
  };

  const checkAnswers = () => {
    if (showAnswer || lockedQuestions.size === items.length) return;

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");
      return;
    }

    const correctCount = answers.filter(
      (ans, i) => ans === items[i].correctIndex,
    ).length;

    const nextLocked = new Set(lockedQuestions);
    const nextWrong = new Set();
    items.forEach((item, index) => {
      if (answers[index] === item.correctIndex) nextLocked.add(index);
      else nextWrong.add(index);
    });
    setLockedQuestions(nextLocked);
    setWrongQuestions(nextWrong);

    const total = items.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

  };

  const reset = () => {
    setAnswers(Array(items.length).fill(null));
    setLockedQuestions(new Set());
    setWrongQuestions(new Set());
    setShowAnswer(false);
    stopAudio();
  };

  // =====================================================
  // ⭐⭐   SHOW ANSWER FUNCTION
  // =====================================================
  const handleShowAnswer = () => {
    const correct = items.map((q) => q.correctIndex);
    setAnswers(correct);
    setShowAnswer(true);
    setLockedQuestions(new Set(items.map((_, index) => index)));
    setWrongQuestions(new Set());
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
        <ExerciseHeaderReview
          sectionLetter="A"
          title="Look, read, and circle."
          subTitle="Look at each animal, then tap the correct word."
        />

        <div className="container-review9-p1-q1">
          {items.map((q, i) => (
            <div key={i} className="question-box-review9-p1-q1 ">
              <div>
                <span
                  style={{
                    color: "#2c5287",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  {i + 1}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <img
                  src={q.img}
                  alt={q.alt}
                  className="q3-image-review6-p1-q1"
                  style={{ height: "130px", width: "auto" }}
                />

                <div className="options-row-unit8-p5-q3">
                  {q.options.map((word, optIndex) => {
                    const isSelected = answers[i] === optIndex;
                    const isCorrect = optIndex === q.correctIndex;

                    return (
                      <p
                        key={optIndex}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        aria-label={`${isSelected ? "Selected. " : ""}Choose ${word} and play its audio.`}
                        className={`
                          option-word-review6-p1-q1
                          ${isSelected ? "selected3" : ""}
                          ${
                            wrongQuestions.has(i) && isSelected && !isCorrect
                              ? "wrong"
                              : ""
                          }
                        `}
                        onClick={() => {
                          playAudio(`word-${i}-${word}`, wordAudio[word]);
                          handleSelect(i, optIndex);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            playAudio(`word-${i}-${word}`, wordAudio[word]);
                            handleSelect(i, optIndex);
                          }
                        }}
                      >
                        {activeAudioKey === `word-${i}-${word}` && (
                          <ReviewPlayingAudioIcon />
                        )}
                        {word}

                        {wrongQuestions.has(i) && isSelected && !isCorrect && (
                          <span className="wrong-x-review4-p2-q3">✕</span>
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review9_Page1_Q1;
