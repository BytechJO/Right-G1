import "./Unit3_Page5_Q2.css";

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound1 from "../../../assets/unit3/sound3/U3P26EXEA2.mp3";
import img1 from "../../../assets/unit3/imgs3/P26exeA2-01.svg";
import img2 from "../../../assets/unit3/imgs3/P26exeA2-02.svg";
import img3 from "../../../assets/unit3/imgs3/P26exeA2-03.svg";
import img4 from "../../../assets/unit3/imgs3/P26exeA2-04.svg";
import img5 from "../../../assets/unit3/imgs3/P26exeA2-05.svg";
import img6 from "../../../assets/unit3/imgs3/P26exeA2-06.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const Unit3_Page5_Q2 = () => {
  const stopAtSecond = 10.9;

  // الخيارات المختارة حاليًا
  const [selected, setSelected] = useState([]);

  // نتيجة آخر Check لكل خيار
  const [showResult, setShowResult] = useState([]);

  // الخيارات الصحيحة التي تم التأكد منها وأصبحت مقفلة
  const [lockedCorrect, setLockedCorrect] = useState([]);

  // Show Answer
  const [showAnswer, setShowAnswer] = useState(false);

  // السؤال انتهى بالكامل
  const [completed, setCompleted] = useState(false);

  const correctData = ["1", "2", "4"];

  const options = [
    {
      img: img1,
      num: "1",
      name: "Mat",
      alt: "A mat.",
    },
    {
      img: img2,
      num: "2",
      name: "Can",
      alt: "A can.",
    },
    {
      img: img3,
      num: "3",
      name: "Boat",
      alt: "A boat.",
    },
    {
      img: img4,
      num: "4",
      name: "Fan",
      alt: "A fan.",
    },
    {
      img: img5,
      num: "5",
      name: "Grapes",
      alt: "A bunch of grapes.",
    },
    {
      img: img6,
      num: "6",
      name: "Shoes",
      alt: "A pair of shoes.",
    },
  ];

  const captions = [
    {
      start: 0,
      end: 11.08,
      text: "Page 26, Right Activities, Exercise A, Number 2. Does it have a short A sound? Listen and circle.",
    },
    {
      start: 11.1,
      end: 13.08,
      text: "1. Mat.",
    },
    {
      start: 13.1,
      end: 15.12,
      text: "2. Can.",
    },
    {
      start: 15.14,
      end: 17.07,
      text: "3. Boat.",
    },
    {
      start: 17.09,
      end: 19.11,
      text: "4. Fan.",
    },
    {
      start: 19.13,
      end: 21.27,
      text: "5. Grapes.",
    },
    {
      start: 21.29,
      end: 24.01,
      text: "6. Shoes.",
    },
  ];

  // =====================================================
  // SELECT
  // =====================================================
  const handleSelect = (index) => {
    if (showAnswer || completed) return;

    // إذا كانت الإجابة صح ومقفلة لا نسمح بتعديلها
    if (lockedCorrect.includes(index)) return;

    setSelected((prev) => {
      // إذا الخيار مختار → نشيله
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }

      // الحد الأقصى 3 اختيارات
      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, index];
    });

    // إذا عدّل الطالب هذا الخيار نمسح نتيجة الخطأ عنه
    setShowResult((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  // =====================================================
  // KEYBOARD ACCESSIBILITY
  // =====================================================
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(index);
    }
  };

  // =====================================================
  // CHECK ANSWER
  // =====================================================
  const checkAnswers = () => {
    if (showAnswer || completed) return;

    if (selected.length === 0) {
      ValidationAlert.info("Oops!", "Please select at least one answer.");
      return;
    }

    const evaluation = options.map((opt, index) => {
      if (!selected.includes(index)) {
        return null;
      }

      return correctData.includes(opt.num) ? "correct" : "wrong";
    });

    setShowResult(evaluation);

    // كل الخيارات الصحيحة المختارة في هذه المحاولة
    const newCorrectIndexes = selected.filter((index) =>
      correctData.includes(options[index].num),
    );

    // نجمعها مع الخيارات الصحيحة المقفلة سابقًا
    const allLockedCorrect = [
      ...new Set([...lockedCorrect, ...newCorrectIndexes]),
    ];

    setLockedCorrect(allLockedCorrect);

    // الأرقام الصحيحة التي أصبحت مؤكدة
    const lockedCorrectNumbers = allLockedCorrect.map(
      (index) => options[index].num,
    );

    const correctCount = correctData.filter((num) =>
      lockedCorrectNumbers.includes(num),
    ).length;

    const totalCorrect = correctData.length;

    const score = `${correctCount} / ${totalCorrect}`;

    const color =
      correctCount === totalCorrect
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const resultHTML = `
      <div
        style="
          font-size: 20px;
          text-align: center;
          margin-top: 8px;
        "
      >
        <span
          style="
            color: ${color};
            font-weight: bold;
          "
        >
          Score: ${score}
        </span>
      </div>
    `;

    // كل الإجابات أصبحت صحيحة
    if (correctCount === totalCorrect) {
      setCompleted(true);

      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  // =====================================================
  // START AGAIN
  // =====================================================
  const resetAnswers = () => {
    setSelected([]);
    setShowResult([]);
    setLockedCorrect([]);
    setShowAnswer(false);
    setCompleted(false);
  };

  // =====================================================
  // SHOW ANSWER
  // =====================================================
  const handleShowAnswer = () => {
    const correctIndexes = correctData.map((num) =>
      options.findIndex((option) => option.num === num),
    );

    setShowAnswer(true);
    setSelected(correctIndexes);
    setLockedCorrect(correctIndexes);
    setShowResult([]);
    setCompleted(true);
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
      <div className="div-forall">
        <ExerciseHeader
          questionNumber="2"
          title={
            <>
              Does it have a
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                short a{" "}
              </span>
              ? Listen and circle.
            </>
          }
          subTitle="Say each picture name, then tap every word with the short-a sound."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit3-page26-exeA2"
        />

        <div className="unit3-q2-content">
          <div className="unit3-q2-options">
            {options.map((item, index) => {
              const isSelected = selected.includes(index);

              const isLocked = lockedCorrect.includes(index);

              const isWrong = showResult[index] === "wrong";

              const disabled = showAnswer || completed || isLocked;

              return (
                <div
                  key={item.num}
                  className={`
                    unit3-q2-option-item

                    ${isSelected ? "active" : ""}

                    ${isLocked ? "locked-correct" : ""}

                    ${
                      showAnswer && correctData.includes(item.num)
                        ? "correct-answer"
                        : ""
                    }

                    ${isWrong ? "wrong-option" : ""}
                  `}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-label={`Option ${item.num}, ${item.name}`}
                  aria-pressed={isSelected}
                  aria-disabled={disabled}
                  onClick={() => handleSelect(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <span className="unit3-q2-number">{item.num}</span>

                    {isWrong && !showAnswer && !completed && (
                      <div className="wrong-x-unit3-q2" aria-hidden="true">
                        ✕
                      </div>
                    )}
                  </div>

                  <img
                    src={item.img}
                    className="unit3-q2-option-img"
                    alt={item.alt}
                  />
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

export default Unit3_Page5_Q2;
