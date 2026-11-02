import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./WB_Unit1_Page8_Q1.css";

import audio1 from "../../../assets/U1 WB/U1/Audio/RWBU1P8EXEA.mp3";

import item1Audio from "../../../assets/U1 WB/U1/page_8/Item_001_The_food_is_in_the_dish_deer.mp3";
import item2Audio from "../../../assets/U1 WB/U1/page_8/Item_002_The_table_tiger_is_round.mp3";

import img1 from "../../../assets/U1 WB/U1/SVG/U1P8EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U1/SVG/U1P8EXEA-02.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const questions = [
  {
    img: img1,

    alt: "A dish of food.",

    audio: item1Audio,

    transcript: "The food is in the dish.",

    parts: {
      before: "The food is in the ",
      after: ".",
    },

    options: ["dish", "deer"],

    correctIndex: 0,
  },

  {
    img: img2,

    alt: "A round table.",

    audio: item2Audio,

    transcript: "The table is round.",

    parts: {
      before: "The ",
      after: " is round.",
    },

    options: ["table", "tiger"],

    correctIndex: 0,
  },
];

const WB_Unit1_Page8_Q1 = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  /*
    الأسئلة الغلط بعد Check
  */
  const [wrongQuestions, setWrongQuestions] = useState([]);

  /*
    الأسئلة الصح المقفلة
  */
  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  /*
    بعد النجاح الكامل فقط
  */
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [playingQuestion, setPlayingQuestion] = useState(null);

  const audioRef = useRef(null);

  const isQuestionLocked = (qIndex) => lockedQuestions.includes(qIndex);

  // ===========================================
  // MAIN PLAYER
  // ===========================================

  const stopAtSecond = 5.5;

  const captions = [
    {
      start: 0,
      end: 5.7,
      text: "Phonics Exercise A. Listen, read, and circle the correct word.",
    },

    {
      start: 5.9,
      end: 8.7,
      text: "1. The food is in the dish.",
    },

    {
      start: 9.1,
      end: 11.15,
      text: "2. The table is round.",
    },
  ];

  // ===========================================
  // ITEM AUDIO
  // ===========================================

  const stopItemAudio = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingQuestion(null);
  };

  const playItemAudio = (index) => {
    const src = questions[index]?.audio;

    if (!src) {
      return;
    }

    /*
      يمنع overlapping
    */
    stopItemAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingQuestion(index);

    audio.play().catch(() => {
      setPlayingQuestion(null);
    });

    audio.onended = () => {
      audioRef.current = null;

      setPlayingQuestion(null);
    };
  };

  // ===========================================
  // SELECT OPTION
  // ===========================================

  const selectOption = (qIndex, optIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optIndex;

      return updated;
    });

    /*
      لو السؤال عليه X من Check سابق،
      أول ما المستخدم يعدله
      نشيل X عن هذا السؤال فقط.
    */

    setWrongQuestions((prev) => prev.filter((index) => index !== qIndex));
  };

  // ===========================================
  // CHECK
  // ===========================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all the words!");

      return;
    }

    const total = questions.length;

    let correct = 0;

    const correctIndexes = [];

    const wrongIndexes = [];

    answers.forEach((answer, index) => {
      const isCorrect = answer === questions[index].correctIndex;

      if (isCorrect) {
        correct++;

        correctIndexes.push(index);
      } else {
        wrongIndexes.push(index);
      }
    });

    // =========================================
    // LOCK ONLY CORRECT QUESTIONS
    // =========================================

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...correctIndexes])),
    );

    setWrongQuestions(wrongIndexes);

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    // =========================================
    // ALL CORRECT
    // =========================================

    if (correct === total) {
      setLockedQuestions(questions.map((_, index) => index));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    // =========================================
    // WRONG / PARTIAL
    // =========================================

    if (correct === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  // ===========================================
  // SHOW ANSWER
  // ===========================================

  const showCorrectAnswers = () => {
    stopItemAudio();

    setAnswers(questions.map((question) => question.correctIndex));

    setLockedQuestions(questions.map((_, index) => index));

    setWrongQuestions([]);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ===========================================
  // RESET
  // ===========================================

  const reset = () => {
    stopItemAudio();

    setAnswers(Array(questions.length).fill(null));

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  // ===========================================
  // CLEANUP
  // ===========================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div
      className="page8-wrapper"
      style={{
        padding: "30px",
      }}
    >
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="A"
          title="Listen, read, and circle the correct word."
          subTitle="Play the audio, look at the picture, and tap the correct word."
        />

        {/* ======================================
            MAIN AUDIO + CAPTIONS
        ====================================== */}

        <QuestionAudioPlayer
          src={audio1}
          captions={captions}
          pageId="unit1-page8-q1-WB"
          stopAtSecond={stopAtSecond}
        />

        {/* ======================================
            QUESTIONS
        ====================================== */}

        <div className="container-wb-u1-p8-q1">
          {questions.map((question, qIndex) => {
            const isPlaying = playingQuestion === qIndex;

            const questionLocked = isQuestionLocked(qIndex);

            const questionWrong = wrongQuestions.includes(qIndex);

            return (
              <div key={qIndex} className="question-box-wb-u1-p8-q1">
                {/* Number */}

                <span className="num-wb-u1-p8-q1">{qIndex + 1}</span>

                {/* Image */}

                <img
                  src={question.img}
                  className="q-image-wb-u1-p8"
                  alt={question.alt}
                />

                {/* =================================
                    ITEM AUDIO
                ================================= */}

                <button
                  type="button"
                  className={`item-audio-btn-wb-u1-p8 ${
                    isPlaying ? "playing" : ""
                  }`}
                  onClick={() => playItemAudio(qIndex)}
                  aria-label={`Play sentence ${
                    qIndex + 1
                  }: ${question.transcript}`}
                >
                  <span aria-hidden="true">🔊</span>

                  <span className="audio-btn-text-wb-u1-p8">
                    {isPlaying ? "Playing" : "Play"}
                  </span>
                </button>

                {/* =================================
                    SENTENCE
                ================================= */}

                <div className="sentence-options-wb-u1-p8">
                  <span className="sentence-text-wb-u1-p8">
                    {question.parts.before}
                  </span>

                  {/* Options */}

                  <div
                    className="options-inline-wb-u1-p8"
                    role="group"
                    aria-label={`Question ${qIndex + 1} answers`}
                  >
                    {question.options.map((word, optIndex) => {
                      const isSelected = answers[qIndex] === optIndex;

                      const isCorrect = optIndex === question.correctIndex;

                      /*
                          X فقط على الاختيار الغلط
                          بعد Check
                        */

                      const isWrong = questionWrong && isSelected && !isCorrect;

                      return (
                        <React.Fragment key={optIndex}>
                          <button
                            type="button"
                            className={`
                                option-word-wb-u1-p8
                                ${isSelected ? "selected" : ""}
                              `}
                            onClick={() => selectOption(qIndex, optIndex)}
                            disabled={
                              showAnswer || checkCompleted || questionLocked
                            }
                            aria-disabled={
                              showAnswer || checkCompleted || questionLocked
                            }
                            aria-pressed={isSelected}
                            aria-label={`${word}${
                              isSelected ? ", selected" : ""
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
                            {word}

                            {isWrong && (
                              <span
                                className="wrong-x-wb-u1-p8"
                                aria-hidden="true"
                              >
                                ✕
                              </span>
                            )}
                          </button>

                          {optIndex === 0 && (
                            <span
                              className="option-divider-wb-u1-p8"
                              aria-hidden="true"
                            >
                              /
                            </span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <span className="sentence-text-wb-u1-p8">
                    {question.parts.after}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================
          BUTTONS
      ====================================== */}

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

export default WB_Unit1_Page8_Q1;
