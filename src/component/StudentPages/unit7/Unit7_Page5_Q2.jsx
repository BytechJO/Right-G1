import React, { useState } from "react";
import "./Unit7_Page5_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit7/img/U7P62EXEA2-01.svg";
import img2 from "../../../assets/unit7/img/U7P62EXEA2-02.svg";
import img3 from "../../../assets/unit7/img/U7P62EXEA2-03.svg";
import img4 from "../../../assets/unit7/img/U7P62EXEA2-04.svg";
import img5 from "../../../assets/unit7/img/U7P62EXEA2-05.svg";
import img6 from "../../../assets/unit7/img/U7P62EXEA2-06.svg";
import img7 from "../../../assets/unit7/img/U7P62EXEA2-07.svg";
import img8 from "../../../assets/unit7/img/U7P62EXEA2-08.svg";
import img9 from "../../../assets/unit7/img/U7P62EXEA2-09.svg";
import img10 from "../../../assets/unit7/img/U7P62EXEA2-10.svg";

import sound1 from "../../../assets/unit7/sound/U7P62EXEA2.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    id: 1,
    letter: "w",

    images: [
      {
        id: 1,
        src: img1,
        value: 1,
        alt: "A green watermelon.",
      },
      {
        id: 2,
        src: img2,
        value: 2,
        alt: "A hamburger with a bun, meat, cheese, and vegetables.",
      },
      {
        id: 3,
        src: img3,
        value: 3,
        alt: "A blue whale spraying water from its blowhole.",
      },
      {
        id: 4,
        src: img4,
        value: 4,
        alt: "A red wagon with four wheels and a handle.",
      },
      {
        id: 5,
        src: img5,
        value: 5,
        alt: "An open human hand with the palm facing forward.",
      },
    ],

    correct: [1, 3, 4],
  },

  {
    id: 2,
    letter: "h",

    images: [
      {
        id: 1,
        src: img6,
        value: 1,
        alt: "A pink wristwatch.",
      },
      {
        id: 2,
        src: img7,
        value: 2,
        alt: "A small pink house with a red roof and a chimney.",
      },
      {
        id: 3,
        src: img8,
        value: 3,
        alt: "A green hat decorated with flowers.",
      },
      {
        id: 4,
        src: img9,
        value: 4,
        alt: "A hammer with a wooden handle.",
      },
      {
        id: 5,
        src: img10,
        value: 5,
        alt: "A spider web.",
      },
    ],

    correct: [2, 3, 4],
  },
];

/* =====================================================
   COMPONENT
===================================================== */

export default function Unit7_Page5_Q2() {
  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState({});

  /*
    null | correct | wrong

    على مستوى كل سؤال.
  */

  const [results, setResults] = useState({});

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     AUDIO PLAYER
  ===================================================== */

  const stopAtSecond = 10.8;

  const captions = [
    {
      start: 0,
      end: 5.44,
      text: "Page 62, Right activities. Exercise A, number two.",
    },
    {
      start: 5.55,
      end: 10.82,
      text: "Which pictures begin with the same sound? Listen and circle.",
    },
    {
      start: 10.9,
      end: 20.32,
      text: "1, W. Watermelon, burger, whale, wagon, hand.",
    },
    {
      start: 20.4,
      end: 29.58,
      text: "2, H. Watch, house, hat, hammer, web.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (qId) =>
    results[qId] === "correct" || showAnswerMode;

  const arraysMatch = (first, second) => {
    if (first.length !== second.length) {
      return false;
    }

    const a = [...first].sort((x, y) => x - y);

    const b = [...second].sort((x, y) => x - y);

    return a.every((value, index) => value === b[index]);
  };

  const allCorrect = data.every(
    (q) =>
      arraysMatch(answers[q.id] || [], q.correct) &&
      (results[q.id] === "correct" || showAnswerMode),
  );

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qId, value) => {
    /*
      Show Answer:
      كل شيء مقفول.
    */

    if (showAnswerMode) {
      return;
    }

    /*
      السؤال الصح المقفول:
      ممنوع تعديله.
    */

    if (results[qId] === "correct") {
      return;
    }

    setAnswers((prev) => {
      const current = prev[qId] || [];

      /*
        لو مختارة:
        unselect.
      */

      if (current.includes(value)) {
        return {
          ...prev,

          [qId]: current.filter((item) => item !== value),
        };
      }

      /*
        الحد الأقصى 3 صور.
      */

      if (current.length >= 3) {
        return prev;
      }

      return {
        ...prev,

        [qId]: [...current, value],
      };
    });

    /*
      تعديل نفس السؤال
      يشيل wrong state عنه فقط.
    */

    setResults((prev) => {
      if (prev[qId] !== "wrong") {
        return prev;
      }

      const updated = {
        ...prev,
      };

      delete updated[qId];

      return updated;
    });
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const handleCheck = () => {
    /*
      لما الكل صح:
      Check يظل ظاهر
      لكنه no-op.
    */

    if (allCorrect || showAnswerMode) {
      return;
    }

    /*
      كل سؤال غير locked
      لازم يكون فيه اختيار واحد على الأقل.
    */

    const emptyQuestion = data.find(
      (q) => results[q.id] !== "correct" && !answers[q.id]?.length,
    );

    if (emptyQuestion) {
      ValidationAlert.info(
        `Please select at least one picture in question ${emptyQuestion.id}.`,
      );

      return;
    }

    const updatedResults = {
      ...results,
    };

    let correctCount = 0;

    const total = data.reduce((sum, q) => sum + q.correct.length, 0);

    data.forEach((q) => {
      /*
        سؤال صحيح ومقفول
        من Check سابق.
      */

      if (results[q.id] === "correct") {
        updatedResults[q.id] = "correct";

        correctCount += q.correct.length;

        return;
      }

      const studentAnswers = answers[q.id] || [];

      /*
        السكور:
        كل correct picture
        محسوبة لوحدها.
      */

      q.correct.forEach((correctValue) => {
        if (studentAnswers.includes(correctValue)) {
          correctCount++;
        }
      });

      /*
        السؤال يقفل فقط
        لما الثلاث صور المختارة
        مطابقة تمامًا للصح.
      */

      if (arraysMatch(studentAnswers, q.correct)) {
        updatedResults[q.id] = "correct";
      } else {
        updatedResults[q.id] = "wrong";
      }
    });

    setResults(updatedResults);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div
        style="
          font-size:20px;
          text-align:center;
          margin-top:8px;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      ValidationAlert.success(msg);
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const correctAnswers = {};

    const correctResults = {};

    data.forEach((q) => {
      correctAnswers[q.id] = [...q.correct];

      correctResults[q.id] = "correct";
    });

    setAnswers(correctAnswers);

    setResults(correctResults);

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setAnswers({});

    setResults({});

    setShowAnswerMode(false);
  };

  /* =====================================================
     JSX
  ===================================================== */

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
          display: "flex",

          flexDirection: "column",

          justifyContent: "flex-start",
        }}
      >
        <ExerciseHeader
          questionNumber="2"
          title={
            <>
              Which pictures begin with the{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                same sound
              </span>
              ? Listen and circle.
            </>
          }
          subTitle="Say the picture names, then tap the pictures that begin with the same sound."
        />

        {/* =====================================
            QUESTION AUDIO
        ====================================== */}

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit7-page62-qA2"
        />

        {/* =====================================
            QUESTIONS
        ====================================== */}

        {data.map((q) => {
          const locked = isQuestionLocked(q.id);

          const wrong = results[q.id] === "wrong";

          return (
            <div
              key={q.id}
              className="question-row-Unit5_Page5_Q2"
              style={{
                margin: "5px",
              }}
            >
              {/* QUESTION NUMBER */}

              <span
                className="q-number"
                style={{
                  color: "#2c5287",

                  fontSize: "20px",

                  fontWeight: "700",
                }}
              >
                {q.id}
              </span>

              {/* LETTER */}

              <span
                style={{
                  color: "#2c5287",

                  fontSize: "20px",

                  fontWeight: "700",

                  marginLeft: "5px",
                }}
              >
                {q.letter}
              </span>

              {/* =====================================
                  IMAGES
              ====================================== */}

              <div className="images-row-Unit7_Page5_Q2">
                {q.images.map((img) => {
                  const isSelected =
                    answers[q.id]?.includes(img.value) ?? false;

                  const isCorrect = q.correct.includes(img.value);

                  /*
                      X يظهر فقط
                      على الاختيارات الغلط.
                    */

                  const isWrong = wrong && isSelected && !isCorrect;

                  return (
                    <div
                      key={img.id}
                      className={`
                          img-box-Unit7_Page5_Q2

                          ${isSelected ? "selected-Unit5_Page5_Q2" : ""}

                          ${isWrong ? "wrong" : ""}
                        `}
                      role="button"
                      tabIndex={locked ? -1 : 0}
                      aria-label={`Question ${q.id}, letter ${q.letter}. ${img.alt} ${
                        isSelected ? "Selected." : "Not selected."
                      }`}
                      aria-pressed={isSelected}
                      onClick={() => {
                        if (!locked) {
                          handleSelect(q.id, img.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (locked) {
                          return;
                        }

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          handleSelect(q.id, img.value);
                        }
                      }}
                      style={{
                        position: "relative",

                        cursor: locked ? "default" : "pointer",
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        style={{
                          height: "80px",

                          width: "80px",
                        }}
                      />

                      {/* WRONG X */}

                      {isWrong && (
                        <div
                          className="wrong-mark-Unit5_Page5_Q2"
                          aria-hidden="true"
                        >
                          ✕
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>

        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
