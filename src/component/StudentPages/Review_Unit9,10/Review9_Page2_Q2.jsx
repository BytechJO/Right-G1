import React, { useState } from "react";
import "./Review9_Page2_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/unit10/imgs/U10P89EXEE-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P89EXEE-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P89EXEE-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P89EXEE-04.svg";
import sound1 from "../../../assets/unit10/sound/cd83pg89-instruction2-adult-lady_yZ9Nr14f.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";
const Review9_Page2_Q2 = () => {
  const stopAtSecond = 8.38;
  const [lockedIds, setLockedIds] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 2.3,
      text: "Page 89, exercise E.",
    },
    {
      start: 3.32,
      end: 8.38,
      text: "Do they have the same beginning sound? Listen and write check or X.",
    },
    { start: 9.36, end: 12.4, text: "1.mat, nail." },
    { start: 13.2, end: 15.76, text: "2.mop, night." },
    { start: 16.9, end: 19.6, text: "3.nurse, net." },
    { start: 20.66, end: 23.63, text: "4.notebook, magazine." },
  ];

  const questions = [
    {
      id: 1,
      image: img1,
      alt: "A map and a fingernail.",
      correct: "✗",
    },
    {
      id: 2,
      image: img2,
      alt: "A nurse and a net.",
      correct: "✓",
    },
    {
      id: 3,
      image: img3,
      alt: "A mop and the night sky.",
      correct: "✗",
    },
    {
      id: 4,
      image: img4,
      alt: "A book and a magazine.",
      correct: "✗",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [wrongIds, setWrongIds] = useState(new Set());

  const selectAnswer = (id, value) => {
    if (showAnswer || lockedIds.has(id)) return;
    setAnswers({ ...answers, [id]: value });
    setWrongIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  };
  const showAnswers = () => {
    const corrects = {};
    questions.forEach((q) => {
      corrects[q.id] = q.correct; // ✓ أو ✗
    });

    setAnswers(corrects);
    setWrongIds(new Set());
    setLockedIds(new Set(questions.map((q) => q.id)));
    setShowAnswer(true);
  };

  const checkAnswers = () => {
    if (showAnswer || lockedIds.size === questions.length) return;
    // 1) فحص الخانات الفارغة
    const isEmpty = questions.some((q) => !answers[q.id]);
    if (isEmpty) {
      ValidationAlert.info("Please choose ✓ or ✗ for all questions!");
      return;
    }

    // 2) مقارنة الإجابات
    const nextLocked = new Set(lockedIds);
    const nextWrong = new Set();
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) nextLocked.add(q.id);
      else nextWrong.add(q.id);
    });

    setLockedIds(nextLocked);
    setWrongIds(nextWrong);
    // 3) حساب السكور
    const correctCount = questions.filter(
      (q) => answers[q.id] === q.correct,
    ).length;
    const total = questions.length;
    const scoreMsg = `${correctCount} / ${total}`;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${scoreMsg}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(resultHTML);
    else if (correctCount === 0) ValidationAlert.error(resultHTML);
    else ValidationAlert.warning(resultHTML);
  };

  const resetAnswers = () => {
    setAnswers({});
    setWrongIds(new Set());
    setLockedIds(new Set());
    setShowAnswer(false);
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
          gap: "20px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="E"
          title={
            <>
              Do they have the same{" "}
              <span style={{ color: "red" }}>beginning sound</span>? Listen and
              write <span style={{ color: "red" }}>✓</span> or{" "}
              <span style={{ color: "red" }}>✗</span>.
            </>
          }
          subTitle="Listen to each pair, then choose check or X."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="review9-page89-qE"
        />

        <div className="review9-p2-q2-container w-full">
          {questions.map((q) => (
            <div
              key={q.id}
              className="review9-p2-q2-question-box review-audio-control"
            >
              {activeAudioKey === `pair-${q.id}` && <ReviewPlayingAudioIcon />}
              <p
                className="unit6-p1-q1-question-text"
                style={{ fontSize: "20px" }}
              >
                <span style={{ color: "darkblue", fontWeight: "700" }}>
                  {q.id}.
                </span>
              </p>

              <div className="unit10-p1-q2-flex">
                <div style={{ display: "flex" }}>
                  <img
                    src={q.image}
                    alt={q.alt}
                    className="unit10-p5-q2-question-img"
                    role="button"
                    tabIndex={0}
                    aria-label={`${q.alt} Play this word pair.`}
                    onClick={() => playAudio(`pair-${q.id}`, q.audio)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        playAudio(`pair-${q.id}`, q.audio);
                      }
                    }}
                  />
                </div>

                <div className="unit10-p1-q2-options-box">
                  {/* خيار الصح */}
                  <div className="option-wrapper">
                    <div
                      role="button"
                      tabIndex={lockedIds.has(q.id) || showAnswer ? -1 : 0}
                      aria-label={`Choose check for item ${q.id}.`}
                      className={`option-btn ${
                        answers[q.id] === "✓" ? "selected" : ""
                      }`}
                      onClick={() => selectAnswer(q.id, "✓")}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectAnswer(q.id, "✓");
                        }
                      }}
                    >
                      ✓
                    </div>

                    {wrongIds.has(q.id) && answers[q.id] === "✓" && (
                      <div className="unit6-p1-q1-wrong-icon">✕</div>
                    )}
                  </div>

                  {/* خيار الخطأ */}
                  <div className="option-wrapper">
                    <div
                      role="button"
                      tabIndex={lockedIds.has(q.id) || showAnswer ? -1 : 0}
                      aria-label={`Choose X for item ${q.id}.`}
                      className={`option-btn ${
                        answers[q.id] === "✗" ? "selected" : ""
                      }`}
                      onClick={() => selectAnswer(q.id, "✗")}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectAnswer(q.id, "✗");
                        }
                      }}
                    >
                      ✗
                    </div>

                    {wrongIds.has(q.id) && answers[q.id] === "✗" && (
                      <div className="unit6-p1-q1-wrong-icon">✕</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review9_Page2_Q2;
