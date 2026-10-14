import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review10_Page2_Q2.css";
import img1 from "../../../assets/unit10/imgs/U10P91EXEE-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P91EXEE-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P91EXEE-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P91EXEE-04.svg";
import img5 from "../../../assets/unit10/imgs/U10P91EXEE-05.svg";
import img6 from "../../../assets/unit10/imgs/U10P91EXEE-06.svg";
import bedAudio from "../../../assets/Review_9,10/Page 91 - E/bed.mp3";
import eggAudio from "../../../assets/Review_9,10/Page 91 - E/egg.mp3";
import henAudio from "../../../assets/Review_9,10/Page 91 - E/hen.mp3";
import jetAudio from "../../../assets/Review_9,10/Page 91 - E/jet.mp3";
import netAudio from "../../../assets/Review_9,10/Page 91 - E/net.mp3";
import tenAudio from "../../../assets/Review_9,10/Page 91 - E/ten.mp3";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";

const Review10_Page2_Q2 = () => {
  const [answers, setAnswers] = useState(Array(6).fill(null));
  const [lockedQuestions, setLockedQuestions] = useState(new Set());
  const [wrongQuestions, setWrongQuestions] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);

  const items = [
    { img: img1, alt: "A white egg.", options: ["egg", "bed"], correctIndex: 0 },
    { img: img2, alt: "A fishing net.", options: ["ten", "net"], correctIndex: 1 },
    { img: img3, alt: "A passenger jet.", options: ["jet", "hen"], correctIndex: 0 },
    { img: img4, alt: "The number ten.", options: ["ten", "egg"], correctIndex: 0 },
    { img: img5, alt: "A bed with a pillow and blanket.", options: ["jet", "bed"], correctIndex: 1 },
    { img: img6, alt: "A brown hen.", options: ["hen", "ten"], correctIndex: 0 },
  ];
  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();
  const wordAudio = { bed: bedAudio, egg: eggAudio, hen: henAudio, jet: jetAudio, net: netAudio, ten: tenAudio };

  const handleSelect = (qIndex, optionIndex) => {
    const word = items[qIndex].options[optionIndex];
    playAudio(`word-${qIndex}-${word}`, wordAudio[word]);
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
          gap: "50px",
         
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="E"
          title="Look, read, and circle."
          subTitle="Look at each picture, then tap the matching short-e word."
        />

        <div className="container-review10-p2-q2">
          {items.map((q, i) => (
            <div key={i} className="question-box-unit8-p5-q3">
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    width: "80%",
                  }}
                >
                  <span
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {i + 1}
                  </span>
                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q3-image-review6-p1-q1"
                    style={{ height: "130px", width: "auto" }}
                  />
                </div>

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
                        onClick={() => handleSelect(i, optIndex)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSelect(i, optIndex);
                          }
                        }}
                      >
                        {activeAudioKey === `word-${i}-${word}` && <ReviewPlayingAudioIcon />}
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

export default Review10_Page2_Q2;
