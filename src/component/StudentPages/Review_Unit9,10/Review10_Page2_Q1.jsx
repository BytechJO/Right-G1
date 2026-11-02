import React, { useState } from "react";
import "./Review10_Page2_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound1 from "../../../assets/unit10/sound/cd84pg91-instruction1-adult-lady_DBgg7djJ.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";
const Review10_Page2_Q1 = () => {
  const stopAtSecond = 9;
  const [lockedIds, setLockedIds] = useState(new Set());
  const [showAnswer, setShowAnswer] = useState(false);
  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 2.46,
      text: "Page 91, exercise D.",
    },
    {
      start: 3.54,
      end: 8.88,
      text: "Do they both have a short e? Listen and write check or X.",
    },
    { start: 9.56, end: 12.5, text: "1. bet, beet." },
    { start: 12.94, end: 16, text: "2. net, set." },
    { start: 16.42, end: 19.4, text: "3. tea, leg." },
    { start: 20.06, end: 23.4, text: "4. web, pen." },
    { start: 23.86, end: 27, text: "5. bee, hen." },
    { start: 27.4, end: 30.9, text: "6. seal, pet." },
  ];

  const questions = [
    {
      id: 1,
      left: "bet",
      right: "beet",
      correct: "✗",
    },
    {
      id: 2,
      left: "net",
      right: "set",
      correct: "✓",
    },
    {
      id: 3,
      left: "tea",
      right: "leg",
      correct: "✗",
    },
    {
      id: 4,
      left: "web",
      right: "pen",
      correct: "✓",
    },
    {
      id: 5,
      left: "bee",
      right: "hen",
      correct: "✗",
    },
    {
      id: 6,
      left: "seal",
      right: "pet",
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
      <div className="div-forall" style={{}}>
        <ExerciseHeaderReview
          sectionLetter="D"
          title={
            <>
              Do they both have a <span style={{ color: "red" }}>short e</span>?
              Listen and write <span style={{ color: "red" }}>✓</span> or{" "}
              <span style={{ color: "red" }}>✗</span>.
            </>
          }
          subTitle="Listen to each word pair, then choose check or X."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="review10-page90-qD"
        />

        <div className="review10-p2-q1-container w-full">
          {questions.map((q) => (
            <div
              key={q.id}
              className="review10-p2-q1-question-box review-audio-control"
            >
              {activeAudioKey === `pair-${q.id}` && <ReviewPlayingAudioIcon />}
              <p
                className="unit6-p1-q1-question-text"
                style={{ fontSize: "20px" }}
              >
                <span style={{ color: "darkblue", fontWeight: "700" }}>
                  {q.id}
                </span>
              </p>

              <div className="review10-p2-q1-flex">
                <div
                  className="word-pair-box-review10-p2-q1"
                  onClick={() => playAudio(`pair-${q.id}`, q.audio)}
                >
                  <span className="word-text-review10-p2-q1">{q.left}</span>

                  <span className="word-text-review10-p2-q1">{q.right}</span>
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

export default Review10_Page2_Q1;
