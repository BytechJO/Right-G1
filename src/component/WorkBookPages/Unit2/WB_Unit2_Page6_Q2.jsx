import React, { useState } from "react";
import "./WB_Unit2_Page6_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U2/U2P14EXEB01-01.svg";
import img2 from "../../../assets/U1 WB/U2/U2P14EXEB01-02.svg";
import img3 from "../../../assets/U1 WB/U2/U2P14EXEB01-03.svg";

import img4 from "../../../assets/U1 WB/U2/U2P14EXEB02-01.svg";
import img5 from "../../../assets/U1 WB/U2/U2P14EXEB02-02.svg";
import img6 from "../../../assets/U1 WB/U2/U2P14EXEB02-03.svg";

import img7 from "../../../assets/U1 WB/U2/U2P14EXEB03-01.svg";
import img8 from "../../../assets/U1 WB/U2/U2P14EXEB03-02.svg";
import img9 from "../../../assets/U1 WB/U2/U2P14EXEB03-03.svg";

import img10 from "../../../assets/U1 WB/U2/U2P14EXEB04-01.svg";
import img11 from "../../../assets/U1 WB/U2/U2P14EXEB04-02.svg";
import img12 from "../../../assets/U1 WB/U2/U2P14EXEB04-03.svg";

import sound1 from "../../../assets/U1 WB/U2/audio/cd3pg14-instruction1-adult-lady_VPBph8tW.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

// ======================================================
// DATA
// ======================================================

const data = [
  {
    id: 1,

    images: [
      {
        id: 1,
        src: img1,
        value: 1,
        alt: "A bat",
      },
      {
        id: 2,
        src: img2,
        value: 2,
        alt: "A bowl",
      },
      {
        id: 3,
        src: img3,
        value: 3,
        alt: "A purse",
      },
    ],

    // bat / bowl / purse
    // purse starts with a different sound
    correct: [3],
  },

  {
    id: 2,

    images: [
      {
        id: 1,
        src: img4,
        value: 1,
        alt: "A plate",
      },
      {
        id: 2,
        src: img5,
        value: 2,
        alt: "A basket",
      },
      {
        id: 3,
        src: img6,
        value: 3,
        alt: "A pen",
      },
    ],

    // plate / basket / pen
    // basket starts with a different sound
    correct: [2],
  },

  {
    id: 3,

    images: [
      {
        id: 1,
        src: img7,
        value: 1,
        alt: "A cat",
      },
      {
        id: 2,
        src: img8,
        value: 2,
        alt: "A balloon",
      },
      {
        id: 3,
        src: img9,
        value: 3,
        alt: "A ball",
      },
    ],

    // cat / balloon / ball
    // cat starts with a different sound
    correct: [1],
  },

  {
    id: 4,

    images: [
      {
        id: 1,
        src: img10,
        value: 1,
        alt: "Bread",
      },
      {
        id: 2,
        src: img11,
        value: 2,
        alt: "A pail",
      },
      {
        id: 3,
        src: img12,
        value: 3,
        alt: "Beans",
      },
    ],

    // bread / pail / beans
    // pail starts with a different sound
    correct: [2],
  },
];

export default function WB_Unit2_Page6_Q2() {
  const [answers, setAnswers] = useState({});

  // الأسئلة الغلط بعد Check
  const [wrongQuestions, setWrongQuestions] = useState([]);

  // الأسئلة الصح تتقفل لحالها
  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // true فقط لما الكل صح
  const [checkCompleted, setCheckCompleted] = useState(false);

  const stopAtSecond = 6.699;

  // ======================================================
  // HELPERS
  // ======================================================

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  // ======================================================
  // SELECT
  // ======================================================

  const handleSelect = (qId, value) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setAnswers((prev) => {
      const current = prev[qId]?.[0];

      // إذا كبس نفس الاختيار مرة ثانية
      // الغيه
      if (current === value) {
        return {
          ...prev,
          [qId]: [],
        };
      }

      // اختيار واحد فقط لكل سؤال
      return {
        ...prev,
        [qId]: [value],
      };
    });

    // شيل X فقط عن نفس السؤال
    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  // ======================================================
  // CHECK
  // ======================================================

  const handleCheck = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    // لازم الأربعة كلهم يكون إلهم اختيار
    const allAnswered = data.every(
      (q) => answers[q.id] && answers[q.id].length > 0,
    );

    if (!allAnswered) {
      ValidationAlert.info(
        "Oops!",
        "Please select one picture in each question.",
      );

      return;
    }

    let correctCount = 0;

    const correctTemp = [];
    const wrongTemp = [];

    data.forEach((q) => {
      const studentValue = answers[q.id]?.[0];

      const correctValue = q.correct[0];

      if (studentValue === correctValue) {
        correctCount++;

        correctTemp.push(q.id);
      } else {
        wrongTemp.push(q.id);
      }
    });

    // ====================================================
    // LOCK CORRECT ONLY
    // ====================================================

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...correctTemp])),
    );

    // ====================================================
    // WRONG ONLY
    // ====================================================

    setWrongQuestions(wrongTemp);

    const total = data.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;margin-top:8px">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    // ====================================================
    // ALL CORRECT
    // ====================================================

    if (correctCount === total) {
      setLockedQuestions(data.map((q) => q.id));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    // ====================================================
    // WRONG / PARTIAL
    // ====================================================

    if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  // ======================================================
  // RESET
  // ======================================================

  const handleReset = () => {
    setAnswers({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const handleShowAnswer = () => {
    const correctAnswers = {};

    data.forEach((q) => {
      correctAnswers[q.id] = [...q.correct];
    });

    setAnswers(correctAnswers);

    setWrongQuestions([]);

    setLockedQuestions(data.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ======================================================
  // CAPTIONS
  // ======================================================

  const captions = [
    {
      start: 0.099,
      end: 6.699,
      text: "Phonics exercise B. Listen and circle the picture with a different beginning sound.",
    },

    {
      start: 7.379,
      end: 11.399,
      text: "1, bat, bowl, purse.",
    },

    {
      start: 12.039,
      end: 15.859,
      text: "2, plate, basket, pen.",
    },

    {
      start: 16.359,
      end: 20.619,
      text: "3, cat, balloon, ball.",
    },

    {
      start: 21.399,
      end: 25.759,
      text: "4, bread, pail, beans.",
    },
  ];

  // ======================================================
  // RENDER
  // ======================================================

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
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title={
            <>
              Listen and circle the picture with a different
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                beginning sound
              </span>
              .
            </>
          }
          subTitle="Listen to each group and tap the picture with the different first sound."
        />

        {/* =================================================
            AUDIO PLAYER
        ================================================= */}

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          pageId="unit1-page14-q2-WB"
          stopAtSecond={stopAtSecond}
        />

        {/* =================================================
            QUESTIONS
        ================================================= */}

        <div className="content-container-wb-p6-q2">
          {data.map((q) => {
            const questionLocked = isQuestionLocked(q.id);

            const questionWrong = wrongQuestions.includes(q.id);

            return (
              <div
                key={q.id}
                className="question-row-Unit5_Page5_Q2"
                style={{
                  marginTop: "15px",
                }}
              >
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

                <div className="images-row-wb-unit2-p6-q2">
                  {q.images.map((img) => {
                    const isSelected = answers[q.id]?.includes(img.value);

                    const isCorrect = q.correct.includes(img.value);

                    const isWrong =
                      questionWrong && isSelected && !isCorrect && !showAnswer;

                    return (
                      <div
                        key={img.id}
                        className={`img-box-wb-unit2-p6-q2
                          ${isSelected ? "selected-Unit5_Page5_Q2" : ""}
                          ${isWrong ? "wrong" : ""}
                        `}
                        onClick={() => handleSelect(q.id, img.value)}
                        style={{
                          cursor:
                            questionLocked || showAnswer || checkCompleted
                              ? "default"
                              : "pointer",
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          style={{
                            height: "120px",
                            objectFit: "cover",
                          }}
                        />

                        {isWrong && (
                          <div className="wrong-mark-Unit5_Page5_Q2">✕</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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
