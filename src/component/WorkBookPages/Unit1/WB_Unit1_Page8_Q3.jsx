import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page8_Q3.css";

import sound1 from "../../../assets/U1 WB/U1/Audio/RWBU1P8EXEC.mp3";

import bat from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-01.svg";
import box from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-02.svg";
import bucket from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-03.svg";
import boat from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-04.svg";
import img5 from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-05.svg";
import img6 from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-06.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const WB_Unit1_Page8_Q3 = () => {
  const items = [
    {
      img: bat,
      alt: "A door.",
      correct: "d",
    },
    {
      img: box,
      alt: "A toy.",
      correct: "t",
    },
    {
      img: bucket,
      alt: "A doll.",
      correct: "d",
    },
    {
      img: boat,
      alt: "A desk.",
      correct: "d",
    },
    {
      img: img5,
      alt: "A train.",
      correct: "t",
    },
    {
      img: img6,
      alt: "A telephone.",
      correct: "t",
    },
  ];

  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  // الأسئلة الغلط فقط
  const [wrongQuestions, setWrongQuestions] = useState([]);

  // الأسئلة الصح المقفلة
  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // بعد النجاح النهائي فقط
  const [checkCompleted, setCheckCompleted] = useState(false);

  const stopAtSecond = 5.1;

  const captions = [
    {
      start: 0,
      end: 4.8,
      text: "Phonics Exercise C. Listen, look, and circle.",
    },
    {
      start: 5.3,
      end: 6.9,
      text: "1. door.",
    },
    {
      start: 7.1,
      end: 8.8,
      text: "2. toy.",
    },
    {
      start: 9,
      end: 11.5,
      text: "3. doll.",
    },
    {
      start: 11.7,
      end: 13.7,
      text: "4. desk.",
    },
    {
      start: 13.8,
      end: 15.7,
      text: "5. train.",
    },
    {
      start: 15.8,
      end: 17.25,
      text: "6. telephone.",
    },
  ];

  const isQuestionLocked = (index) => lockedQuestions.includes(index);

  const handleSelect = (index, value) => {
    if (showAnswer || checkCompleted || isQuestionLocked(index)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });

    // إذا كان عليه X، نشيله فقط عن نفس السؤال
    setWrongQuestions((prev) => prev.filter((qIndex) => qIndex !== index));
  };

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) return;

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please answer all items first.");

      return;
    }

    let correctCount = 0;

    const correctIndexes = [];
    const wrongIndexes = [];

    answers.forEach((answer, index) => {
      const isCorrect =
        answer?.toLowerCase() === items[index].correct?.toLowerCase();

      if (isCorrect) {
        correctCount++;
        correctIndexes.push(index);
      } else {
        wrongIndexes.push(index);
      }
    });

    // قفل الصح فقط
    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...correctIndexes])),
    );

    // خلي X فقط على الغلط
    setWrongQuestions(wrongIndexes);

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedQuestions(items.map((_, index) => index));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const handleShowAnswer = () => {
    const correctAnswers = items.map((item) => item.correct);

    setAnswers(correctAnswers);

    setWrongQuestions([]);

    setLockedQuestions(items.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
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
        <ExerciseHeader
          sectionLetter="C"
          title="Listen, look, and circle."
          subTitle="Listen to each word, then drag d or t below the picture."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div
          className="imgFeild"
          style={{
            display: "flex",
            gap: "13px",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <div className="dt-container-wb-u1-p8-q3">
            {items.map((item, index) => {
              const selectedAnswer = answers[index];

              const questionLocked = isQuestionLocked(index);

              const questionWrong = wrongQuestions.includes(index);

              return (
                <div className="dt-item-wb-u1-p8-q3" key={index}>
                  <img
                    src={item.img}
                    className="dt-image-wb-u1-p8-q3"
                    alt={item.alt}
                  />

                  <div
                    className="dt-options-wb-u1-p8-q3"
                    role="group"
                    aria-label={`Question ${index + 1}. Choose D or T.`}
                  >
                    {/* D */}

                    <button
                      type="button"
                      className={`bp-option ${
                        selectedAnswer === "d" ? "selected" : ""
                      } ${
                        questionWrong &&
                        selectedAnswer === "d" &&
                        selectedAnswer !== item.correct
                          ? "wrong-answer"
                          : ""
                      }`}
                      onClick={() => handleSelect(index, "d")}
                      disabled={showAnswer || checkCompleted || questionLocked}
                      aria-disabled={
                        showAnswer || checkCompleted || questionLocked
                      }
                      aria-pressed={selectedAnswer === "d"}
                      aria-label={`D${
                        selectedAnswer === "d" ? ", selected" : ""
                      }${
                        questionLocked
                          ? ", correct answer, question locked"
                          : ""
                      }`}
                      style={{
                        cursor:
                          showAnswer || checkCompleted || questionLocked
                            ? "default"
                            : "pointer",
                      }}
                    >
                      D
                      {questionWrong &&
                        selectedAnswer === "d" &&
                        selectedAnswer !== item.correct && (
                          <span
                            className="wrong-x-wb-u1-p8-q3"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}
                    </button>

                    {/* T */}

                    <button
                      type="button"
                      className={`bp-option ${
                        selectedAnswer === "t" ? "selected" : ""
                      } ${
                        questionWrong &&
                        selectedAnswer === "t" &&
                        selectedAnswer !== item.correct
                          ? "wrong-answer"
                          : ""
                      }`}
                      onClick={() => handleSelect(index, "t")}
                      disabled={showAnswer || checkCompleted || questionLocked}
                      aria-disabled={
                        showAnswer || checkCompleted || questionLocked
                      }
                      aria-pressed={selectedAnswer === "t"}
                      aria-label={`T${
                        selectedAnswer === "t" ? ", selected" : ""
                      }${
                        questionLocked
                          ? ", correct answer, question locked"
                          : ""
                      }`}
                      style={{
                        cursor:
                          showAnswer || checkCompleted || questionLocked
                            ? "default"
                            : "pointer",
                      }}
                    >
                      T
                      {questionWrong &&
                        selectedAnswer === "t" &&
                        selectedAnswer !== item.correct && (
                          <span
                            className="wrong-x-wb-u1-p8-q3"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={handleShowAnswer} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit1_Page8_Q3;
