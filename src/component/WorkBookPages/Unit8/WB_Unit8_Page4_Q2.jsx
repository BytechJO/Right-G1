import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import "./WB_Unit8_Page4_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import img1 from "../../../assets/U1 WB/U8/U8P48EXEH01-01.svg";
import img2 from "../../../assets/U1 WB/U8/U8P48EXEH01-02.svg";

import img3 from "../../../assets/U1 WB/U8/U8P48EXEH02-01.svg";
import img4 from "../../../assets/U1 WB/U8/U8P48EXEH02-02.svg";

import img5 from "../../../assets/U1 WB/U8/U8P48EXEH03-01.svg";
import img6 from "../../../assets/U1 WB/U8/U8P48EXEH03-02.svg";

import img7 from "../../../assets/U1 WB/U8/U8P48EXEH04-01.svg";
import img8 from "../../../assets/U1 WB/U8/U8P48EXEH04-02.svg";

/* =====================================================
   AUDIOS
===================================================== */

import noseAudio from "../../../assets/U1 WB/U8/audio/page 48 - H/Item_001_Touch_your_nose.mp3";
import eyeAudio from "../../../assets/U1 WB/U8/audio/page 48 - H/Item_002_Touch_your_eye.mp3";
import legAudio from "../../../assets/U1 WB/U8/audio/page 48 - H/Item_003_Touch_your_leg.mp3";
import armAudio from "../../../assets/U1 WB/U8/audio/page 48 - H/Item_004_Touch_your_arm.mp3";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    id: 1,

    text: "Touch your nose.",

    audio: noseAudio,

    images: [
      {
        id: 1,
        src: img1,
        value: "nose",
        alt: "A nose.",
      },

      {
        id: 2,
        src: img2,
        value: "eye",
        alt: "An eye.",
      },
    ],

    correct: "nose",
  },

  {
    id: 2,

    text: "Touch your eye.",

    audio: eyeAudio,

    images: [
      {
        id: 1,
        src: img3,
        value: "nose",
        alt: "A nose.",
      },

      {
        id: 2,
        src: img4,
        value: "eye",
        alt: "An eye.",
      },
    ],

    correct: "eye",
  },

  {
    id: 3,

    text: "Touch your leg.",

    audio: legAudio,

    images: [
      {
        id: 1,
        src: img5,
        value: "arm",
        alt: "An arm and hand.",
      },

      {
        id: 2,
        src: img6,
        value: "leg",
        alt: "A bent leg and foot.",
      },
    ],

    correct: "leg",
  },

  {
    id: 4,

    text: "Touch your arm.",

    audio: armAudio,

    images: [
      {
        id: 1,
        src: img7,
        value: "arm",
        alt: "An arm and hand.",
      },

      {
        id: 2,
        src: img8,
        value: "feet",
        alt: "Two legs and feet.",
      },
    ],

    correct: "arm",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

export default function WB_Unit8_Page4_Q2() {
  /* =====================================================
     ANSWERS

     {
       1: "nose",
       2: "eye"
       ...
     }
  ===================================================== */

  const [answers, setAnswers] = useState({});

  /*
    null | correct | wrong
  */

  const [results, setResults] = useState(Array(data.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingQuestionId, setPlayingQuestionId] = useState(null);

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionCorrect = (qIndex) => results[qIndex] === "correct";

  const isQuestionLocked = (qIndex) =>
    showAnswerMode || isQuestionCorrect(qIndex);

  const allCorrect = results.every((result) => result === "correct");

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingQuestionId(null);
  };

  const playAudio = (qId, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingQuestionId(qId);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestionId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestionId(null);
    };

    audio.onerror = audio.onended;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, value) => {
    const question = data[qIndex];

    /*
    السؤال الصح مقفل:
    ممنوع تغيير الاختيار.
  */
    if (isQuestionLocked(qIndex)) {
      return;
    }

    /*
    Select فقط
    بدون أي صوت.
  */
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));

    /*
    إذا كان السؤال Wrong من Check سابق،
    بمجرد التعديل نشيل حالة الخطأ لهذا السؤال فقط.
  */
    setResults((prev) => {
      const copy = [...prev];

      if (copy[qIndex] === "wrong") {
        copy[qIndex] = null;
      }

      return copy;
    });
  };

  /* =====================================================
     IMAGE KEYBOARD
  ===================================================== */

  const handleImageKeyDown = (e, qIndex, value) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
    Keyboard select فقط
    بدون صوت.
  */
    handleSelect(qIndex, value);
  };

  /* =====================================================
     QUESTION AUDIO KEYBOARD
  ===================================================== */

  const handleSentenceKeyDown = (e, question) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();

    playAudio(question.id, question.audio);
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const handleCheck = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    /* =================================================
       REQUIRE ANSWERS
    ================================================= */

    for (let qIndex = 0; qIndex < data.length; qIndex++) {
      if (isQuestionCorrect(qIndex)) {
        continue;
      }

      const question = data[qIndex];

      if (!answers[question.id]) {
        ValidationAlert.info(
          `Please select a picture in question ${qIndex + 1}.`,
        );

        return;
      }
    }

    /* =================================================
       VALIDATE
    ================================================= */

    const nextResults = [...results];

    let correctCount = 0;

    data.forEach((question, qIndex) => {
      /*
          Keep already-correct locked.
        */

      if (isQuestionCorrect(qIndex)) {
        nextResults[qIndex] = "correct";

        correctCount++;

        return;
      }

      const studentAnswer = answers[question.id];

      if (studentAnswer === question.correct) {
        nextResults[qIndex] = "correct";

        correctCount++;
      } else {
        nextResults[qIndex] = "wrong";
      }
    });

    setResults(nextResults);

    /*
      NO AUTO AUDIO
    */

    const total = data.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
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
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const correctAnswersObj = {};

    data.forEach((question) => {
      correctAnswersObj[question.id] = question.correct;
    });

    setAnswers(correctAnswersObj);

    setResults(Array(data.length).fill("correct"));

    setShowAnswerMode(true);

    stopAudio();
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    stopAudio();

    setAnswers({});

    setResults(Array(data.length).fill(null));

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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="H"
          title="Look, read, and circle."
          subTitle="Read the command and tap the correct body-part picture."
        />

        <div className="content-container-wb-unit8-p4-q1">
          {data.map((question, qIndex) => {
            const selectedValue = answers[question.id];

            const correct = isQuestionCorrect(qIndex) || showAnswerMode;

            const locked = isQuestionLocked(qIndex);

            const wrong = results[qIndex] === "wrong";

            return (
              <div key={question.id} className="question-row-wb-unit8-p4-q2">
                {/* =================================================
                      QUESTION + AUDIO
                  ================================================= */}

                <div className="img-container-wb-unit8-p4-q2">
                  <span className="q-number">{question.id}.</span>

                  <p
                    role="button"
                    tabIndex={0}
                    aria-label={`${question.text} Press Enter or Space to hear the sentence.`}
                    className="sentence-audio-wb-u8-p4-q2"
                    onClick={() => playAudio(question.id, question.audio)}
                    onKeyDown={(e) => handleSentenceKeyDown(e, question)}
                  >
                    {question.text}

                    {playingQuestionId === question.id && (
                      <FaVolumeUp
                        className="question-audio-icon-wb-u8-p4-q2"
                        aria-hidden="true"
                      />
                    )}
                  </p>
                </div>

                {/* =================================================
                      OPTIONS
                  ================================================= */}

                <div className="images-row-Unit5_Page5_Q2">
                  {question.images.map((image) => {
                    const isSelected = selectedValue === image.value;
                    const showWrongMark = wrong && isSelected;
                    return (
                      <div
                        key={image.id}
                        role="button"
                        tabIndex={locked ? -1 : 0}
                        aria-pressed={isSelected}
                        aria-label={`${image.alt} ${
                          isSelected ? "Selected." : "Not selected."
                        } ${
                          locked
                            ? "Correct answer."
                            : "Press Enter or Space to select."
                        }`}
                        className={`
    img-box-Unit5_Page5_Q2

    ${isSelected ? "selected-Unit5_Page5_Q2" : ""}

    ${showWrongMark ? "wrong" : ""}
  `}
                        onClick={() => handleSelect(qIndex, image.value)}
                        onKeyDown={(e) =>
                          handleImageKeyDown(e, qIndex, image.value)
                        }
                      >
                        <img src={image.src} alt={image.alt} />

                        {!showAnswerMode && showWrongMark && (
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
      </div>

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
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
