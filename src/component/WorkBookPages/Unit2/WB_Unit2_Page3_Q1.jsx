import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U2/U2P11EXEE-01.svg";
import img2 from "../../../assets/U1 WB/U2/U2P11EXEE-02.svg";
import img3 from "../../../assets/U1 WB/U2/U2P11EXEE-03.svg";
import img4 from "../../../assets/U1 WB/U2/U2P11EXEE-04.svg";
import img6 from "../../../assets/U1 WB/U2/U2P11EXEE-06.svg";
import img7 from "../../../assets/U1 WB/U2/U2P11EXEE-07.svg";

/* ================================
   AUDIO
================================ */

import presentAudio from "../../../assets/U1 WB/U2/page_11/Item_002_present.mp3";
import jelloAudio from "../../../assets/U1 WB/U2/page_11/Item_001_jello.mp3";
import balloonsAudio from "../../../assets/U1 WB/U2/page_11/Item_004_balloons.mp3";
import cardAudio from "../../../assets/U1 WB/U2/page_11/Item_003_card.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import ExerciseHeader from "../../ExerciseHeader";

const WB_Unit2_Page3_Q1 = () => {
  const data = [
    {
      id: 1,
      word: "jello",
      audio: jelloAudio,
      imgs: [
        {
          src: img1,
          answer: false,
          alt: "A girl waving to two people standing at the doorway.",
        },
        {
          src: img2,
          answer: true,
          alt: "A person riding a bicycle outside during the day.",
        },
      ],
    },

    {
      id: 2,
      word: "present",
      audio: presentAudio,
      imgs: [
        {
          src: img3,
          answer: false,
          alt: "Two girls standing outside and talking to each other.",
        },
        {
          src: img4,
          answer: true,
          alt: "A girl waving to two people standing at the doorway.",
        },
      ],
    },

    {
      id: 3,
      word: "balloons",
      audio: balloonsAudio,
      imgs: [
        {
          src: img3,
          answer: true,
          alt: "Two girls standing outside and talking to each other.",
        },
        {
          src: img6,
          answer: false,
          alt: "A person riding a bicycle outside during the day.",
        },
      ],
    },

    {
      id: 4,
      word: "card",
      audio: cardAudio,
      imgs: [
        {
          src: img7,
          answer: false,
          alt: "A girl sitting up in bed while a man stands beside her.",
        },
        {
          src: img1,
          answer: true,
          alt: "Two girls standing outside and talking to each other.",
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
          subTitle="Read the word and tap the picture that names it."
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

export default WB_Unit2_Page3_Q1;
