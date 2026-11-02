import React, { useEffect, useRef, useState } from "react";
import img1 from "../../../assets/U1 WB/U3/SVG/U3P19EXEI01-01.svg";
import img2 from "../../../assets/U1 WB/U3/SVG/U3P19EXEI01-02.svg";
import img3 from "../../../assets/U1 WB/U3/SVG/U3P19EXEI02-01.svg";
import img4 from "../../../assets/U1 WB/U3/SVG/U3P19EXEI02-02.svg";
import img5 from "../../../assets/U1 WB/U3/SVG/U3P19EXEI03-01.svg";
import img6 from "../../../assets/U1 WB/U3/SVG/U3P19EXEI03-02.svg";
import img7 from "../../../assets/U1 WB/U3/SVG/U3P19EXEI04-01.svg";
import img8 from "../../../assets/U1 WB/U3/SVG/U3P19EXEI04-02.svg";
/* ================================
   AUDIO
================================ */

import Take_out_your_pencilAudio from "../../../assets/U1 WB/U3/page_16/Item_003_Take_out_your_pencil.mp3";
import QuietAudio from "../../../assets/U1 WB/U3/page_16/Item_004_Quiet!.mp3";
import Make_a_lineAudio from "../../../assets/U1 WB/U3/page_16/Item_002_Make_a_line.mp3";
import Open_your_bookAudio from "../../../assets/U1 WB/U3/page_16/Item_003_Open_your_book.mp3";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit3_Page5_Q1 = () => {
  const data = [
    {
      id: 1,
      word: "Make a line.",
      audio: Make_a_lineAudio,
      imgs: [
        {
          src: img1,
          answer: true,
          alt: "Students standing in a line.",
        },
        {
          src: img2,
          answer: false,
          alt: "A student opening a book with the teacher.",
        },
      ],
    },

    {
      id: 2,
      word: "Open your book.",
      audio: Open_your_bookAudio,
      imgs: [
        {
          src: img3,
          answer: true,
          alt: "A student opening his book at his desk.",
        },
        {
          src: img4,
          answer: false,
          alt: "A student with the teacher holding a book.",
        },
      ],
    },

    {
      id: 3,
      word: "Take out your pencil.",
      audio: Take_out_your_pencilAudio,
      imgs: [
        {
          src: img5,
          answer: true,
          alt: "A student taking out a pencil at his desk.",
        },
        {
          src: img6,
          answer: false,
          alt: "A teacher standing with students in the classroom.",
        },
      ],
    },

    {
      id: 4,
      word: "Quiet!",
      audio: QuietAudio,
      imgs: [
        {
          src: img7,
          answer: true,
          alt: "A teacher asking the class to be quiet.",
        },
        {
          src: img8,
          answer: false,
          alt: "A teacher standing with students in the classroom.",
        },
      ],
    },
  ];

  /* ================================
     STATE
  ================================ */

  const [selected, setSelected] = useState({});

  /*
    بعد Check:
    نخزن فقط الأسئلة الغلط
  */
  const [wrongQuestions, setWrongQuestions] = useState([]);

  /*
    الأسئلة الصح فقط
  */
  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswerState, setShowAnswerState] = useState(false);

  /*
    بعد النجاح النهائي فقط
  */
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [playingQuestion, setPlayingQuestion] = useState(null);

  const audioRef = useRef(null);

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  /* ================================
     AUDIO
  ================================ */

  const stopCurrentAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingQuestion(null);
  };

  const playQuestionAudio = (question) => {
    if (!question.audio) return;

    stopCurrentAudio();

    const audio = new Audio(question.audio);

    audioRef.current = audio;

    setPlayingQuestion(question.id);

    audio.play().catch(() => {
      setPlayingQuestion(null);
    });

    audio.onended = () => {
      setPlayingQuestion(null);

      audioRef.current = null;
    };
  };

  /* ================================
     SELECT IMAGE
  ================================ */

  const handleSelect = (qId, index) => {
    if (showAnswerState || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setSelected((prev) => ({
      ...prev,

      [qId]: index,
    }));

    /*
      إذا السؤال كان عليه X
      وشغّلنا اختيار جديد،
      شيل X تبعه فقط.
    */

    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  /* ================================
     SHOW ANSWER
  ================================ */

  const showCorrectAnswers = () => {
    const correctSelections = {};

    data.forEach((question) => {
      const correctIndex = question.imgs.findIndex(
        (img) => img.answer === true,
      );

      correctSelections[question.id] = correctIndex;
    });

    setSelected(correctSelections);

    setWrongQuestions([]);

    setLockedQuestions(data.map((question) => question.id));

    setShowAnswerState(true);

    setCheckCompleted(true);
  };

  /* ================================
     CHECK ANSWER
  ================================ */

  const checkAnswers = () => {
    if (showAnswerState || checkCompleted) {
      return;
    }

    const totalQuestions = data.length;

    /* لازم يجاوب الكل */

    for (const question of data) {
      if (selected[question.id] === undefined) {
        ValidationAlert.info(
          "Oops!",
          "Please answer all questions before checking.",
        );

        return;
      }
    }

    let correct = 0;

    const wrongIds = [];

    const correctIds = [];

    data.forEach((question) => {
      const chosenIndex = selected[question.id];

      const isCorrect = question.imgs[chosenIndex]?.answer === true;

      if (isCorrect) {
        correct++;

        correctIds.push(question.id);
      } else {
        wrongIds.push(question.id);
      }
    });

    /* =================================
       قفل الصح فقط
    ================================= */

    setLockedQuestions((prev) => Array.from(new Set([...prev, ...correctIds])));

    setWrongQuestions(wrongIds);

    const color =
      correct === totalQuestions ? "green" : correct === 0 ? "red" : "orange";

    const scoreMessage = `
      <div
        style="
          font-size:20px;
          margin-top:10px;
          text-align:center;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${correct} / ${totalQuestions}
        </span>
      </div>
    `;

    /* =============================
       ALL CORRECT
    ============================= */

    if (correct === totalQuestions) {
      setLockedQuestions(data.map((question) => question.id));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =============================
       WRONG / PARTIAL
    ============================= */

    if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* ================================
     RESET
  ================================ */

  const reset = () => {
    stopCurrentAudio();

    setSelected({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswerState(false);

    setCheckCompleted(false);
  };

  /* ================================
     CLEANUP
  ================================ */

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* ================================
     RENDER
  ================================ */

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
          gap: "30px ",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title={
            <>
              Read and write
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                ✓
              </span>
              .
            </>
          }
          subTitle="Read the command and tap the picture that shows it."
        />

        <div
          className="shorti1-container-wb-u1-q2"
          style={{
            rowGap: "30px",
            columnGap: "60px",
          }}
        >
          {data.map((question) => {
            const isPlaying = playingQuestion === question.id;

            const questionLocked = isQuestionLocked(question.id);

            const questionWrong = wrongQuestions.includes(question.id);

            return (
              <div key={question.id} className="question-box-wb-u1-q2">
                {/* ============================
                      QUESTION + AUDIO
                  ============================ */}

                <div
                  style={{
                    display: "flex",

                    gap: "20px",

                    alignItems: "center",

                    fontWeight: "600",

                    fontSize: "20px",
                  }}
                >
                  <span
                    style={{
                      color: "darkblue",

                      fontWeight: "700",

                      fontSize: "20px",
                    }}
                  >
                    {question.id}
                  </span>

                  <button
                    type="button"
                    onClick={() => playQuestionAudio(question)}
                    aria-label={`Play audio: ${question.word}`}
                    aria-pressed={isPlaying}
                    className="question-audio-wb-u1-q2"
                  >
                    {question.word}

                    {isPlaying && (
                      <span
                        aria-hidden="true"
                        className="playing-audio-wb-u1-q2"
                      >
                        🔊
                      </span>
                    )}
                  </button>
                </div>

                {/* ============================
                      IMAGE OPTIONS
                  ============================ */}

                <div className="shorti-container-wb-u1-q2">
                  {question.imgs.map((img, index) => {
                    const isSelected = selected[question.id] === index;

                    /*
                          X فقط على الاختيار الغلط
                          بعد Check
                        */

                    const isWrong =
                      questionWrong && isSelected && img.answer === false;

                    return (
                      <button
                        key={index}
                        type="button"
                        className={`img-box-wb-u1-q2 ${
                          isSelected && !showAnswerState
                            ? "selected-wb-u1-q2"
                            : ""
                        }`}
                        onClick={() => handleSelect(question.id, index)}
                        disabled={
                          showAnswerState || checkCompleted || questionLocked
                        }
                        aria-disabled={
                          showAnswerState || checkCompleted || questionLocked
                        }
                        aria-pressed={isSelected}
                        aria-label={`${img.alt}${
                          isSelected ? ". Selected." : ""
                        }${
                          questionLocked
                            ? " Correct answer. Question locked."
                            : ""
                        }`}
                        style={{
                          /*
                                ما بنغير شكل الصح لأخضر.
                                فقط نخليه غير قابل للتعديل.
                              */

                          cursor:
                            questionLocked || showAnswerState || checkCompleted
                              ? "default"
                              : "pointer",
                        }}
                      >
                        {/* =========================
                                WRONG X
                            ========================= */}

                        {isWrong && (
                          <span
                            className="wrong-x-circle-wb-u1-p3-q2"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}

                        <img src={img.src} alt={img.alt} />

                        {/* =========================
                                CHECK BOX
                            ========================= */}

                        <div className="check-box-wb-u1-q2" aria-hidden="true">
                          {isSelected ? "✓" : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================
          ACTION BUTTONS
      ================================ */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={showCorrectAnswers}
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

export default WB_Unit3_Page5_Q1;
