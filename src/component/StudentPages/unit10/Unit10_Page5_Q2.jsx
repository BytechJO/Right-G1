import { useState } from "react";
import "./Unit10_Page5_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/unit10/imgs/U10P86EXEA2-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P86EXEA2-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P86EXEA2-03.svg";
import sound1 from "../../../assets/unit10/sound/cd80pg86-instruction1-adult-lady_uiAasTyt.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";
const Unit10_Page5_Q2 = () => {
  const stopAtSecond = 3.5;
  const [lockedQuestions, setLockedQuestions] = useState([]);

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.519,
      end: 5.799,
      text: "Page 85, Right Activities. Exercise A, Number 2.",
    },
    {
      start: 6.759,
      end: 11.819,
      text: "Do they both have a short E? Listen and write check or X.",
    },

    {
      start: 12.539,
      end: 13.819,
      text: "1.",
    },
    {
      start: 13.819,
      end: 15.839,
      text: "Sled, cup.",
    },

    {
      start: 15.839,
      end: 17.02,
      text: "2.",
    },
    {
      start: 17.02,
      end: 19.299,
      text: "Nest, bee.",
    },

    {
      start: 19.299,
      end: 20.379,
      text: "3.",
    },
    {
      start: 20.379,
      end: 22.18,
      text: "Ten, jet.",
    },
  ];
  const questions = [
    {
      id: 1,
      image: img1,
      alt: "A sled and a cup of tea.",
      correct: "✗",
    },
    {
      id: 2,
      image: img2,
      alt: "A bird's nest and a bee.",
      correct: "✗",
    },
    {
      id: 3,
      image: img3,
      alt: "The number ten and a passenger jet.",
      correct: "✓",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState([]);

  const selectAnswer = (id, value) => {
    if (lockedQuestions.includes(id)) return;
    setAnswers((previous) => ({ ...previous, [id]: value }));
    setShowResult((previous) =>
      Array.isArray(previous)
        ? previous.map((result, index) =>
            questions[index].id === id ? undefined : result,
          )
        : [],
    );
  };
  const showAnswers = () => {
    const corrects = {};
    questions.forEach((q) => {
      corrects[q.id] = q.correct; // ✓ أو ✗
    });

    setAnswers(corrects);
    setShowResult([]);
    setLockedQuestions(questions.map((question) => question.id));
  };

  const checkAnswers = () => {
    if (lockedQuestions.length === questions.length) return;
    // 1) فحص الخانات الفارغة
    const isEmpty = questions.some((q) => !answers[q.id]);
    if (isEmpty) {
      ValidationAlert.info("Please choose ✓ or ✗ for all questions!");
      return;
    }

    // 2) مقارنة الإجابات
    const results = questions.map((q) =>
      answers[q.id] === q.correct ? "correct" : "wrong",
    );

    setShowResult(results);
    setLockedQuestions((previous) => [
      ...new Set([
        ...previous,
        ...questions
          .filter((question) => answers[question.id] === question.correct)
          .map((question) => question.id),
      ]),
    ]);
    // 3) حساب السكور
    const correctCount = results.filter((r) => r === "correct").length;
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
    setShowResult([]);
    setLockedQuestions([]);
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
        <ExerciseHeader
          questionNumber="2"
          title={
            <>
              Do they both have <span style={{ color: "red" }}>short e</span>?
              Listen and write <span style={{ color: "red" }}>✓</span> or{" "}
              <span style={{ color: "red" }}>✗</span>.
            </>
          }
          subTitle="Listen to each pair, then choose check or X."
        />
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit10-page86-q2"
        />

        <div className="unit10-p1-q2-container">
          {questions.map((q, index) => (
            <div key={q.id} className="unit10-p1-q2-question-box">
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
                  />
                </div>

                <div className="unit10-p1-q2-options-box">
                  {/* خيار الصح */}
                  <div className="option-wrapper">
                    <div
                      role="button"
                      tabIndex={lockedQuestions.includes(q.id) ? -1 : 0}
                      aria-label={`Choose check for question ${q.id}`}
                      className={`option-btn-unit10-p5-q2 ${
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

                    {showResult[index] === "wrong" && answers[q.id] === "✓" && (
                      <div className="unit6-p1-q1-wrong-icon">✕</div>
                    )}
                  </div>

                  {/* خيار الخطأ */}
                  <div className="option-wrapper">
                    <div
                      role="button"
                      tabIndex={lockedQuestions.includes(q.id) ? -1 : 0}
                      aria-label={`Choose X for question ${q.id}`}
                      className={`option-btn-unit10-p5-q2 ${
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

                    {showResult[index] === "wrong" && answers[q.id] === "✗" && (
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

export default Unit10_Page5_Q2;
