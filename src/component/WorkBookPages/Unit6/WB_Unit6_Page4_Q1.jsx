import React, { useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U6/U6P36EXEG-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P36EXEG-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P36EXEG-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P36EXEG-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page4_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import canFlyKiteAudio from "../../../assets/U1 WB/U6/audio/page 36 - G/Item_001_Can_he_fly_a_kite.mp3";
import canFishAudio from "../../../assets/U1 WB/U6/audio/page 36 - G/Item_002_Can_he_fish.mp3";

import yesHeIsAudio from "../../../assets/U1 WB/U6/audio/page 36 - G/Item_003_Yes,_he_is.mp3";
import noHeIsntAudio from "../../../assets/U1 WB/U6/audio/page 36 - G/Item_004_No,_he_isn't.mp3";

import canItClimbTreeAudio from "../../../assets/U1 WB/U6/audio/page 36 - G/Item_006_Can_it_climb_a_tree.mp3";
import canHeSwimAudio from "../../../assets/U1 WB/U6/audio/page 36 - G/Item_007_Can_he_swim.mp3";

import yesItIsAudio from "../../../assets/U1 WB/U6/audio/page 36 - G/Item_008_Yes,_it_is.mp3";
import noItIsntAudio from "../../../assets/U1 WB/U6/audio/page 36 - G/Item_009_No,_it_isn't.mp3";

/* =====================================================
   DATA
===================================================== */

const questions = [
  {
    id: 1,

    image: img1,

    alt: "A boy standing outdoors and flying a kite.",

    text: "Can he fly a kite?",

    questionAudio: canFlyKiteAudio,

    items: [
      {
        text: "Yes, he is.",
        correct: false,
        audio: yesHeIsAudio,
      },

      {
        text: "No, he isn’t.",
        correct: true,
        audio: noHeIsntAudio,
      },
    ],
  },

  {
    id: 2,

    image: img2,

    alt: "A boy fishing from a small boat on the water.",

    text: "Can he fish?",

    questionAudio: canFishAudio,

    items: [
      {
        text: "Yes, he is.",
        correct: true,
        audio: yesHeIsAudio,
      },

      {
        text: "No, he isn’t.",
        correct: false,
        audio: noHeIsntAudio,
      },
    ],
  },

  {
    id: 3,

    image: img3,

    alt: "A dog standing beside a large tree.",

    text: "Can it climb a tree?",

    questionAudio: canItClimbTreeAudio,

    items: [
      {
        text: "Yes, it is.",
        correct: false,
        audio: yesItIsAudio,
      },

      {
        text: "No, it isn’t.",
        correct: true,
        audio: noItIsntAudio,
      },
    ],
  },

  {
    id: 4,

    image: img4,

    alt: "A boy swimming in an outdoor pool.",

    text: "Can he swim?",

    questionAudio: canHeSwimAudio,

    items: [
      {
        text: "Yes, he is.",
        correct: true,
        audio: yesHeIsAudio,
      },

      {
        text: "No, he isn’t.",
        correct: false,
        audio: noHeIsntAudio,
      },
    ],
  },
];

/* =====================================================
   MAIN
===================================================== */

const WB_Unit6_Page4_Q1 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState({});

  /* =================================================
     WRONG QUESTIONS
  ================================================= */

  const [wrongQuestions, setWrongQuestions] = useState([]);

  /* =================================================
     PROGRESSIVE LOCK
  ================================================= */

  const [lockedQuestions, setLockedQuestions] = useState([]);

  /* =================================================
     FINAL STATES
  ================================================= */

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  const isQuestionWrong = (qId) => wrongQuestions.includes(qId);

  /* =================================================
     SELECT
  ================================================= */

  const handleSelect = (qId, idx) => {
    if (showAnswerMode || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [qId]: idx,
    }));

    /*
      امسح X فقط عن نفس السؤال
      اللي المستخدم عدله.
    */

    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  /* =================================================
     OPTION ACTIVATE
     AUDIO + SELECT
  ================================================= */

  const activateOption = (question, idx) => {
    const item = question.items[idx];

    const audioKey = `option-${question.id}-${idx}`;

    playAudio(audioKey, item.audio);

    /*
      لو السؤال صح ومقفول:
      الصوت يشتغل بس الاختيار ما يتغير.
    */

    if (!showAnswerMode && !checkCompleted && !isQuestionLocked(question.id)) {
      handleSelect(question.id, idx);
    }
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    /* =============================================
       لازم كل سؤال يكون مجاوب
    ============================================= */

    const incomplete = questions.some((q) => answers[q.id] === undefined);

    if (incomplete) {
      ValidationAlert.info("Please answer all questions!");

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    questions.forEach((q) => {
      /*
        السؤال المقفول من Check سابق
        محسوب صح.
      */

      if (isQuestionLocked(q.id)) {
        correctCount++;

        return;
      }

      const chosenIndex = answers[q.id];

      const chosenItem = q.items[chosenIndex];

      if (chosenItem?.correct) {
        correctCount++;

        newlyLocked.push(q.id);
      } else {
        wrong.push(q.id);
      }
    });

    /* =============================================
       الصح فقط يقفل
    ============================================= */

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    /* =============================================
       الغلط فقط عليه X
    ============================================= */

    setWrongQuestions(wrong);

    const total = questions.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    /* =============================================
       ALL CORRECT
    ============================================= */

    if (correctCount === total) {
      setLockedQuestions(questions.map((q) => q.id));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =============================================
       PARTIAL
    ============================================= */

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    const correctAnswers = {};

    questions.forEach((q) => {
      const correctIndex = q.items.findIndex((item) => item.correct);

      correctAnswers[q.id] = correctIndex;
    });

    setAnswers(correctAnswers);

    setWrongQuestions([]);

    setLockedQuestions(questions.map((q) => q.id));

    setShowAnswerMode(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswerMode(false);

    setCheckCompleted(false);
  };

  /* =================================================
     RENDER
  ================================================= */

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
          marginBottom: "20px",
        }}
      >
        <ExerciseHeader
          sectionLetter="G"
          title={
            <>
              Read and write{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                ✓
              </span>
              .
            </>
          }
          subTitle="Look at the action and choose whether the subject can do it."
        />

        <div className="wb-unit6-p4-q1-grid w-full">
          {questions.map((q) => {
            const questionLocked = isQuestionLocked(q.id);

            const questionWrong = isQuestionWrong(q.id);

            const questionAudioKey = `question-${q.id}`;

            const questionPlaying = playingKey === questionAudioKey;

            return (
              <div key={q.id} className="wb-unit6-p4-q1-box">
                {/* =================================================
                    QUESTION + IMAGE
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: "row",
                    }}
                  >
                    <span
                      className="wb-unit6-p4-q1-text"
                      style={{
                        color: "#3054c7",
                        fontSize: "25px",
                        fontWeight: "700",
                      }}
                    >
                      {q.id}
                    </span>

                    {/* =============================================
                        QUESTION AUDIO
                    ============================================= */}

                    <span
                      className="wb-unit6-p4-q1-text wb-unit6-p4-q1-audio-text"
                      role="button"
                      tabIndex={0}
                      aria-label={`Play audio: ${q.text}`}
                      onClick={() =>
                        playAudio(questionAudioKey, q.questionAudio)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          e.stopPropagation();

                          playAudio(questionAudioKey, q.questionAudio);
                        }
                      }}
                    >
                      {q.text}

                      {questionPlaying && (
                        <FaVolumeUp
                          size={14}
                          aria-hidden="true"
                          className="audio-icon-wb-unit6-p4-q1"
                        />
                      )}
                    </span>
                  </div>

                  <img
                    src={q.image}
                    alt={q.alt}
                    className="wb-unit6-p4-q1-img"
                  />
                </div>

                {/* =================================================
                    OPTIONS
                ================================================= */}

                <div>
                  {q.items.map((item, idx) => {
                    const isSelected = answers[q.id] === idx;

                    const isWrong = questionWrong && isSelected;

                    const optionAudioKey = `option-${q.id}-${idx}`;

                    const optionPlaying = playingKey === optionAudioKey;

                    return (
                      <div key={idx} className="review3-p1-q3-row">
                        {/* =====================================
                              OPTION TEXT + AUDIO
                          ===================================== */}

                        <span
                          className="text-[18px] wb-unit6-p4-q1-option-text"
                          role="button"
                          tabIndex={0}
                          aria-label={`Play audio: ${item.text}`}
                          onClick={() => playAudio(optionAudioKey, item.audio)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              playAudio(optionAudioKey, item.audio);
                            }
                          }}
                        >
                          {item.text}

                          {optionPlaying && (
                            <FaVolumeUp
                              size={14}
                              aria-hidden="true"
                              className="audio-icon-option-wb-unit6-p4-q1"
                            />
                          )}
                        </span>

                        {/* =====================================
                              SELECT BOX
                          ===================================== */}

                        <div className="review3-p1-q3-input-box">
                          <input
                            type="text"
                            readOnly
                            role="button"
                            /*
                                حتى السؤال الصح المقفول:
                                الخيار يضل بالـTab للصوت والقراءة،
                                لكن الاختيار ما يتغير.
                              */

                            tabIndex={0}
                            aria-pressed={isSelected}
                            aria-label={
                              questionLocked || showAnswerMode || checkCompleted
                                ? `${item.text}. ${
                                    isSelected ? "Selected." : "Not selected."
                                  } Answer locked. Press Enter or Space to hear the option.`
                                : `${item.text}. ${
                                    isSelected ? "Selected." : "Not selected."
                                  } Press Enter or Space to select this answer.`
                            }
                            value={isSelected ? "✓" : ""}
                            /*
                                مهم:
                                ما في onFocus.
                              */

                            onClick={() => activateOption(q, idx)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                e.stopPropagation();

                                activateOption(q, idx);
                              }
                            }}
                            className="review3-p1-q3-input"
                            style={{
                              cursor:
                                questionLocked ||
                                showAnswerMode ||
                                checkCompleted
                                  ? "pointer"
                                  : "pointer",
                            }}
                          />

                          {/* =================================
                                WRONG X
                            ================================= */}

                          {isWrong && !showAnswerMode && (
                            <span
                              className="review3-p1-q3-x"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </div>
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
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit6_Page4_Q1;
