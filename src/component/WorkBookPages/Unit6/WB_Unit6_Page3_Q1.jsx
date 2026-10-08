import React, { useRef, useState } from "react";
import "./WB_Unit6_Page3_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U6/U6P35EXEE-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P35EXEE-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P35EXEE-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P35EXEE-04.svg";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import sailBoatAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_001_sail_a_boat.mp3";
import paintPictureAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_002_paint_a_picture.mp3";
import swimAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_003_swim.mp3";
import climbTreeAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_004_climb_a_tree.mp3";

import noHeCantAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_005_No,_he_can't.mp3";
import yesHeCanAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_006_Yes,_he_can.mp3";

import sheAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_007_she.mp3";
import rideBikeAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_008_ride_a_bike.mp3";
import itAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_009_it.mp3";
import flyKiteAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_010_fly_a_kite.mp3";

import canAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_011_Can.mp3";
import heAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_012_he.mp3";

import noItCantAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_013_No,_it_can't.mp3";
import yesItCanAudio from "../../../assets/U1 WB/U6/audio/page 35 - E/Item_014_Yes,_it_can.mp3";

/* =====================================================
   AUDIO MAP
===================================================== */

const audioMap = {
  Can: canAudio,

  she: sheAudio,
  he: heAudio,
  it: itAudio,

  "sail a boat?": sailBoatAudio,
  "paint a picture?": paintPictureAudio,
  "swim?": swimAudio,
  "climb a tree?": climbTreeAudio,
  "ride a bike?": rideBikeAudio,
  "fly a kite?": flyKiteAudio,

  "Yes, he can.": yesHeCanAudio,
  "No, he can’t.": noHeCantAudio,

  "Yes, it can.": yesItCanAudio,
  "No, it can’t.": noItCantAudio,
};

/* =====================================================
   QUESTIONS
===================================================== */

const questions = [
  {
    id: 1,

    parts: [
      {
        type: "text",
        value: "Can",
      },

      {
        type: "blank",
        options: ["she", "he"],
      },

      {
        type: "blank",
        options: ["sail a boat?", "swim?"],
      },

      {
        type: "blank",
        options: ["Yes, he can.", "No, he can’t."],
      },

      {
        type: "text",
        value: ".",
      },
    ],

    correct: ["he", "swim?", "Yes, he can."],

    image: img1,

    alt: "A boy swimming in an outdoor pool.",
  },

  {
    id: 2,

    parts: [
      {
        type: "text",
        value: "Can",
      },

      {
        type: "blank",
        options: ["she", "he"],
      },

      {
        type: "blank",
        options: ["paint a picture?", "climb a tree?"],
      },

      {
        type: "blank",
        options: ["Yes, he can.", "No, he can’t."],
      },

      {
        type: "text",
        value: ".",
      },
    ],

    correct: ["he", "paint a picture?", "Yes, he can."],

    image: img2,

    alt: "A man painting a picture on an easel outdoors.",
  },

  {
    id: 3,

    parts: [
      {
        type: "text",
        value: "Can",
      },

      {
        type: "blank",
        options: ["she", "he"],
      },

      {
        type: "blank",
        options: ["ride a bike?", "fly a kite?"],
      },

      {
        type: "blank",
        options: ["Yes, he can.", "No, he can’t."],
      },

      {
        type: "text",
        value: ".",
      },
    ],

    correct: ["he", "fly a kite?", "No, he can’t."],

    image: img3,

    alt: "A boy standing outdoors with a kite.",
  },

  {
    id: 4,

    parts: [
      {
        type: "text",
        value: "Can",
      },

      {
        type: "blank",
        options: ["it", "he"],
      },

      {
        type: "blank",
        options: ["fly a kite?", "climb a tree?"],
      },

      {
        type: "blank",
        options: ["Yes, it can.", "No, it can’t."],
      },

      {
        type: "text",
        value: ".",
      },
    ],

    correct: ["it", "climb a tree?", "No, it can’t."],

    image: img4,

    alt: "A dog standing beside a large tree.",
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const WB_Unit6_Page3_Q1 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState(
    questions.map((q) => q.correct.map(() => null)),
  );

  /* =================================================
     WRONG BLANKS
  ================================================= */

  const [wrongBlanks, setWrongBlanks] = useState([]);

  /* =================================================
     LOCKED CORRECT BLANKS
  ================================================= */

  const [lockedBlanks, setLockedBlanks] = useState([]);

  /* =================================================
     QUESTIONS THAT ARE FULLY CORRECT
  ================================================= */

  const [completedQuestions, setCompletedQuestions] = useState([]);

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

  /*
    هذا لمنع sequence قديم من إنه يكمل
    إذا المستخدم شغل صوت ثاني.
  */

  const sequenceIdRef = useRef(0);

  /* =================================================
     STOP AUDIO
  ================================================= */

  const stopAudio = () => {
    sequenceIdRef.current += 1;

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  /* =================================================
     SINGLE AUDIO
  ================================================= */

  const playAudio = (key, src) => {
    if (!src) {
      return;
    }

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
     PLAY CORRECT AUDIO AS ONE GROUP
  ================================================= */

  const playAudioSequence = (key, sources) => {
    const validSources = sources.filter(Boolean);

    if (!validSources.length) {
      return;
    }

    stopAudio();

    const currentSequenceId = sequenceIdRef.current;

    setPlayingKey(key);

    let currentIndex = 0;

    const playNext = () => {
      /*
        صوت ثاني انشغل:
        وقف الـsequence القديم.
      */

      if (currentSequenceId !== sequenceIdRef.current) {
        return;
      }

      /*
        خلصنا كل الأصوات.
      */

      if (currentIndex >= validSources.length) {
        audioRef.current = null;

        setPlayingKey(null);

        return;
      }

      const audio = new Audio(validSources[currentIndex]);

      audioRef.current = audio;

      audio.play().catch(() => {
        if (currentSequenceId === sequenceIdRef.current) {
          audioRef.current = null;

          setPlayingKey(null);
        }
      });

      audio.onended = () => {
        if (currentSequenceId !== sequenceIdRef.current) {
          return;
        }

        currentIndex += 1;

        playNext();
      };

      audio.onerror = () => {
        if (currentSequenceId !== sequenceIdRef.current) {
          return;
        }

        audioRef.current = null;

        setPlayingKey(null);
      };
    };

    playNext();
  };

  /* =================================================
     HELPERS
  ================================================= */

  const blankKey = (qIndex, blankIndex) => {
    return `${qIndex}-${blankIndex}`;
  };

  const isBlankLocked = (qIndex, blankIndex) => {
    return lockedBlanks.includes(blankKey(qIndex, blankIndex));
  };

  const isBlankWrong = (qIndex, blankIndex) => {
    return wrongBlanks.includes(blankKey(qIndex, blankIndex));
  };

  const isQuestionCompleted = (qIndex) => {
    return completedQuestions.includes(qIndex);
  };

  /* =================================================
     SELECT
  ================================================= */

  const handleSelect = (qIndex, blankIndex, option) => {
    if (
      showAnswerMode ||
      checkCompleted ||
      isQuestionCompleted(qIndex) ||
      isBlankLocked(qIndex, blankIndex)
    ) {
      return;
    }

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = option;

      return updated;
    });

    /*
      إذا كان عليه X من Check سابق:
      امسحه فقط من نفس الـblank.
    */

    const currentKey = blankKey(qIndex, blankIndex);

    setWrongBlanks((prev) => prev.filter((item) => item !== currentKey));
  };

  /* =================================================
     OPTION AUDIO + SELECT
  ================================================= */

  const activateOption = (qIndex, blankIndex, option) => {
    const audioKey = `option-${qIndex}-${blankIndex}-${option}`;

    /*
      الصوت يشتغل سواء الخيار editable
      أو كان correct locked.
    */

    playAudio(audioKey, audioMap[option]);

    /*
      الاختيار نفسه يتغير فقط إذا مش locked.
    */

    if (
      !showAnswerMode &&
      !checkCompleted &&
      !isQuestionCompleted(qIndex) &&
      !isBlankLocked(qIndex, blankIndex)
    ) {
      handleSelect(qIndex, blankIndex, option);
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
       كل سؤال لسا مش كامل صح
       لازم تكون كل خياراته مختارة.
    ============================================= */

    const incomplete = questions.some((_, qIndex) => {
      if (isQuestionCompleted(qIndex)) {
        return false;
      }

      return answers[qIndex].some((answer) => answer === null);
    });

    if (incomplete) {
      ValidationAlert.info(
        "Pay attention!",
        "Please choose an answer for every blank before checking.",
      );

      return;
    }

    let correctCount = 0;

    const total = questions.reduce(
      (sum, question) => sum + question.correct.length,
      0,
    );

    const wrong = [];

    const newlyLocked = [];

    const newlyCompleted = [];

    questions.forEach((question, qIndex) => {
      /* =========================================
           سؤال كان كامل صح من Check سابق
        ========================================= */

      if (isQuestionCompleted(qIndex)) {
        correctCount += question.correct.length;

        return;
      }

      let wholeQuestionCorrect = true;

      question.correct.forEach((correctAnswer, blankIndex) => {
        const userAnswer = answers[qIndex][blankIndex];

        if (userAnswer === correctAnswer) {
          correctCount++;

          newlyLocked.push(blankKey(qIndex, blankIndex));
        } else {
          wholeQuestionCorrect = false;

          wrong.push(blankKey(qIndex, blankIndex));
        }
      });

      /*
          الثلاثة صح؟
          السؤال كامل بصير wrapper واحد للصوت.
        */

      if (wholeQuestionCorrect) {
        newlyCompleted.push(qIndex);
      }
    });

    /* =============================================
       PROGRESSIVE LOCKING
    ============================================= */

    setLockedBlanks((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /* =============================================
       QUESTIONS FULLY CORRECT
    ============================================= */

    setCompletedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyCompleted])),
    );

    /* =============================================
       WRONG ONLY
    ============================================= */

    setWrongBlanks(wrong);

    /* =============================================
       SCORE
    ============================================= */

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const message = `
      <div style="
        font-size:20px;
        text-align:center;
      ">
        <b style="color:${color}">
          Score: ${correctCount} / ${total}
        </b>
      </div>
    `;

    /* =============================================
       ALL CORRECT
    ============================================= */

    if (correctCount === total) {
      const allLocked = [];

      const allCompleted = [];

      questions.forEach((question, qIndex) => {
        allCompleted.push(qIndex);

        question.correct.forEach((_, blankIndex) => {
          allLocked.push(blankKey(qIndex, blankIndex));
        });
      });

      setLockedBlanks(allLocked);

      setCompletedQuestions(allCompleted);

      setWrongBlanks([]);

      setCheckCompleted(true);

      ValidationAlert.success(message);

      return;
    }

    /* =============================================
       PARTIAL
    ============================================= */

    if (correctCount === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setAnswers(questions.map((question) => [...question.correct]));

    const allLocked = [];

    const allCompleted = [];

    questions.forEach((question, qIndex) => {
      allCompleted.push(qIndex);

      question.correct.forEach((_, blankIndex) => {
        allLocked.push(blankKey(qIndex, blankIndex));
      });
    });

    setLockedBlanks(allLocked);

    setCompletedQuestions(allCompleted);

    setWrongBlanks([]);

    setShowAnswerMode(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers(questions.map((question) => question.correct.map(() => null)));

    setWrongBlanks([]);

    setLockedBlanks([]);

    setCompletedQuestions([]);

    setShowAnswerMode(false);

    setCheckCompleted(false);
  };

  /* =================================================
     RENDER PART

     completed = true:
     نفس الشكل ونفس كل الخيارات،
     بس ما في أي interaction داخلي.
  ================================================= */

  const renderPart = (part, qIndex, blankIndex, completed = false) => {
    /* =============================================
       STATIC TEXT
    ============================================= */

    if (part.type === "text") {
      const hasAudio = !!audioMap[part.value];

      /*
        إذا السؤال صار كامل صح:
        Can و "." يظلوا نفس الشكل فقط.
        الـwrapper الخارجي هو clickable.
      */

      if (completed) {
        return (
          <span className="sentence-text-review5-p2-q3">{part.value}</span>
        );
      }

      /*
        "." بدون صوت.
      */

      if (!hasAudio) {
        return (
          <span className="sentence-text-review5-p2-q3">{part.value}</span>
        );
      }

      /*
        Can قبل اكتمال السؤال.
      */

      const audioKey = `text-${qIndex}-${part.value}`;

      const isPlaying = playingKey === audioKey;

      return (
        <span
          className="sentence-text-review5-p2-q3"
          role="button"
          tabIndex={0}
          aria-label={`Play audio: ${part.value}`}
          onClick={() => playAudio(audioKey, audioMap[part.value])}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              e.stopPropagation();

              playAudio(audioKey, audioMap[part.value]);
            }
          }}
          style={{
            position: "relative",

            cursor: "pointer",
          }}
        >
          {part.value}

          {isPlaying && (
            <FaVolumeUp
              size={13}
              aria-hidden="true"
              style={{
                position: "absolute",

                right: "-18px",

                top: "50%",

                transform: "translateY(-50%)",

                pointerEvents: "none",
              }}
            />
          )}
        </span>
      );
    }

    /* =============================================
       OPTIONS
    ============================================= */

    const locked = isBlankLocked(qIndex, blankIndex);

    const blankWrong = isBlankWrong(qIndex, blankIndex);

    return (
      <span
        className={`blank-options-wb-unit6-b3-q1 ${
          blankIndex === 2 ? "third-blank" : ""
        }`}
      >
        {part.options.map((option, index) => {
          const isSelected = answers[qIndex][blankIndex] === option;

          const isWrong = blankWrong && isSelected;

          const audioKey = `option-${qIndex}-${blankIndex}-${option}`;

          const isPlaying = playingKey === audioKey;

          return (
            <div key={index} className="option-wrapper">
              <span
                className={`option-word-review5-p2-q3 ${
                  isSelected ? "selected2" : ""
                }`}
                /*
                    السؤال كامل صح؟
                    العنصر الداخلي ما عاد button.
                  */

                role={completed ? undefined : "button"}
                tabIndex={completed ? undefined : 0}
                aria-pressed={completed ? undefined : isSelected}
                aria-label={
                  completed
                    ? undefined
                    : locked
                      ? `Play audio: ${option}. Correct answer.`
                      : `${option}. ${
                          isSelected ? "Selected." : "Not selected."
                        } Press Enter or Space to hear and select this answer.`
                }
                onClick={
                  completed
                    ? undefined
                    : () => activateOption(qIndex, blankIndex, option)
                }
                onKeyDown={
                  completed
                    ? undefined
                    : (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          e.stopPropagation();

                          activateOption(qIndex, blankIndex, option);
                        }
                      }
                }
                style={{
                  position: "relative",

                  cursor: completed ? "inherit" : "pointer",
                }}
              >
                {option}

                {!completed && isPlaying && (
                  <FaVolumeUp
                    size={13}
                    aria-hidden="true"
                    style={{
                      position: "absolute",

                      right: "-18px",

                      top: "50%",

                      transform: "translateY(-50%)",

                      pointerEvents: "none",
                    }}
                  />
                )}
              </span>

              {/* =====================================
                    WRONG X
                ===================================== */}

              {!completed && isWrong && !showAnswerMode && (
                <div className="wrong-mark" aria-hidden="true">
                  ✕
                </div>
              )}
            </div>
          );
        })}
      </span>
    );
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div
      style={{
        display: "flex",

        flexDirection: "column",

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
          sectionLetter="E"
          title="Read, choose, and circle."
          subTitle="Use the picture to choose the subject, action, and correct answer."
        />

        <div
          style={{
            display: "grid",

            gridTemplateColumns: "1fr 1fr",

            rowGap: "35px",

            columnGap: "70px",
          }}
        >
          {questions.map((question, qIndex) => {
            let blankCounter = -1;

            const firstLine = [];

            const secondLine = [];

            /*
                نفس تقسيم الكود الأصلي حرفيًا.
              */

            question.parts.forEach((part) => {
              if (part.type === "blank") {
                blankCounter++;
              }

              if (blankCounter < 2) {
                firstLine.push({
                  part,
                  blankCounter,
                });
              } else {
                secondLine.push({
                  part,
                  blankCounter,
                });
              }
            });

            const completed = isQuestionCompleted(qIndex);

            /* =============================================
                 صوت السؤال الصح فقط

                 Can
                 + correct subject
                 + correct action
                 + correct answer
              ============================================= */

            const completedAudioKey = `completed-question-${qIndex}`;

            const completedAudios = [
              canAudio,

              audioMap[question.correct[0]],

              audioMap[question.correct[1]],

              audioMap[question.correct[2]],
            ];

            const completedPlaying = playingKey === completedAudioKey;

            return (
              <div key={question.id} className="question-row-wb-unit6-b3-q1">
                {/* =================================================
                      IMAGE
                  ================================================= */}

                <div
                  style={{
                    display: "flex",

                    gap: "20px",

                    alignItems: "flex-start",
                  }}
                >
                  <span className="header-title-page8">{question.id}</span>

                  <img
                    src={question.image}
                    alt={question.alt}
                    className="img-wb-unit6-p3-q1"
                  />
                </div>

                {/* =================================================
                      نفس المحتوى الأصلي دائمًا

                      إذا completed:
                      هاد الـdiv كله بصير button واحد.

                      إذا مش completed:
                      div عادي بدون role/tab/click.
                  ================================================= */}

                <div
                  className={
                    completed
                      ? "completed-answer-wrapper-wb-unit6-p3-q1"
                      : undefined
                  }
                  role={completed ? "button" : undefined}
                  tabIndex={completed ? 0 : undefined}
                  aria-label={
                    completed
                      ? `Play the correct audio for question ${question.id}`
                      : undefined
                  }
                  onClick={
                    completed
                      ? () =>
                          playAudioSequence(completedAudioKey, completedAudios)
                      : undefined
                  }
                  onKeyDown={
                    completed
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();

                            e.stopPropagation();

                            playAudioSequence(
                              completedAudioKey,
                              completedAudios,
                            );
                          }
                        }
                      : undefined
                  }
                  style={
                    completed
                      ? {
                          position: "relative",

                          cursor: "pointer",
                        }
                      : undefined
                  }
                >
                  {/* ==============================================
                        LINE 1
                    ============================================== */}

                  <div
                    className="first-line-wb-unit6-b3-q1"
                    style={{
                      display: "flex",

                      gap: "10px",

                      marginTop: "10px",
                    }}
                  >
                    {firstLine.map(({ part, blankCounter }, index) => (
                      <React.Fragment key={index}>
                        {renderPart(part, qIndex, blankCounter, completed)}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* ==============================================
                        LINE 2
                    ============================================== */}

                  <div
                    style={{
                      display: "flex",

                      gap: "10px",

                      marginTop: "10px",
                    }}
                  >
                    {secondLine.map(({ part, blankCounter }, index) => (
                      <React.Fragment key={index}>
                        {renderPart(part, qIndex, blankCounter, completed)}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* ==============================================
                        AUDIO ICON FOR FULL CORRECT QUESTION
                    ============================================== */}

                  {completed && completedPlaying && (
                    <FaVolumeUp
                      size={15}
                      aria-hidden="true"
                      style={{
                        position: "absolute",

                        right: "-25px",

                        top: "50%",

                        transform: "translateY(-50%)",

                        pointerEvents: "none",
                      }}
                    />
                  )}
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

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit6_Page3_Q1;
