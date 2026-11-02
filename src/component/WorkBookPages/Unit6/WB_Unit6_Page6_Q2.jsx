import React, { useRef, useState, useEffect } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U6/U6P38EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P38EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P38EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P38EXEB-04.svg";

import "./WB_Unit6_Page6_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import hillAudio from "../../../assets/U1 WB/U6/audio/page 38 - B/Item_001_hill.mp3";
import mittAudio from "../../../assets/U1 WB/U6/audio/page 38 - B/Item_002_mitt.mp3";
import digAudio from "../../../assets/U1 WB/U6/audio/page 38 - B/Item_003_dig.mp3";
import wigAudio from "../../../assets/U1 WB/U6/audio/page 38 - B/Item_004_wig.mp3";
import sitAudio from "../../../assets/U1 WB/U6/audio/page 38 - B/Item_005_sit.mp3";
import pinAudio from "../../../assets/U1 WB/U6/audio/page 38 - B/Item_006_pin.mp3";

const WB_Unit6_Page6_Q2 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const items = [
    {
      img: img1,
      alt: "A green hill with mountains in the background.",
      options: [
        {
          word: "hill",
          audio: hillAudio,
        },
        {
          word: "dig",
          audio: digAudio,
        },
      ],
      correctIndex: 0,
    },

    {
      img: img2,
      alt: "A brown wig with shoulder-length hair.",
      options: [
        {
          word: "mitt",
          audio: mittAudio,
        },
        {
          word: "wig",
          audio: wigAudio,
        },
      ],
      correctIndex: 1,
    },

    {
      img: img3,
      alt: "A boy sitting in a chair.",
      options: [
        {
          word: "sit",
          audio: sitAudio,
        },
        {
          word: "pin",
          audio: pinAudio,
        },
      ],
      correctIndex: 0,
    },

    {
      img: img4,
      alt: "A boy digging a hole in the ground with a shovel.",
      options: [
        {
          word: "dig",
          audio: digAudio,
        },
        {
          word: "sit",
          audio: sitAudio,
        },
      ],
      correctIndex: 0,
    },
  ];

  /* =====================================================
     STATE
  ===================================================== */

  const [answers, setAnswers] = useState(Array(items.length).fill(null));

  // null | correct | wrong
  const [results, setResults] = useState(Array(items.length).fill(null));

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     AUDIO STATE
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  /* =====================================================
     STOP AUDIO
  ===================================================== */

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

  /* =====================================================
     PLAY AUDIO
  ===================================================== */

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

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const isQuestionLocked = (index) => {
    return results[index] === "correct" || showAnswerMode;
  };

  const allCorrect = items.every(
    (item, index) =>
      answers[index] === item.correctIndex &&
      (results[index] === "correct" || showAnswerMode),
  );

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswerMode) return;

    // الصحيح المقفول ما بيتعدل
    if (results[qIndex] === "correct") return;

    setAnswers((prev) => {
      const updated = [...prev];

      updated[qIndex] = optionIndex;

      return updated;
    });

    /*
      إذا السؤال كان غلط من Check سابق،
      تعديل نفس السؤال يشيل الـ X عنه فقط.
    */

    setResults((prev) => {
      const updated = [...prev];

      if (updated[qIndex] === "wrong") {
        updated[qIndex] = null;
      }

      return updated;
    });
  };

  /* =====================================================
     OPTION AUDIO + SELECT
  ===================================================== */

  const activateOption = (qIndex, optionIndex) => {
    const option = items[qIndex].options[optionIndex];

    const audioKey = `option-${qIndex}-${optionIndex}`;

    /*
      الصوت يشتغل دائمًا عند تفعيل الكلمة.
    */

    playAudio(audioKey, option.audio);

    /*
      إذا السؤال الصحيح صار locked:
      بنشغل الصوت فقط،
      وما بنغير الاختيار.
    */

    if (showAnswerMode || results[qIndex] === "correct") {
      return;
    }

    handleSelect(qIndex, optionIndex);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    /*
      لما الكل صح:
      Check يظل ظاهر وطبيعي،
      لكن يصير no-op.
    */

    if (allCorrect || showAnswerMode) {
      return;
    }

    /*
      كل سؤال لسا مش correct locked
      لازم يكون فيه اختيار.
    */

    const hasEmpty = items.some(
      (_, index) => results[index] !== "correct" && answers[index] === null,
    );

    if (hasEmpty) {
      ValidationAlert.info("Oops!", "Please circle all words first.");

      return;
    }

    const updatedResults = [...results];

    let correctCount = 0;

    items.forEach((item, index) => {
      /*
        سؤال كان صحيح من Check سابق.
      */

      if (results[index] === "correct") {
        updatedResults[index] = "correct";

        correctCount += 1;

        return;
      }

      /*
        فحص السؤال الحالي.
      */

      if (answers[index] === item.correctIndex) {
        updatedResults[index] = "correct";

        correctCount += 1;
      } else {
        updatedResults[index] = "wrong";
      }
    });

    setResults(updatedResults);

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div
        style="
          font-size:20px;
          text-align:center;
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

  const showAnswers = () => {
    stopAudio();

    const filledAnswers = items.map((item) => item.correctIndex);

    const filledResults = items.map(() => "correct");

    setAnswers(filledAnswers);

    setResults(filledResults);

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setAnswers(Array(items.length).fill(null));

    setResults(Array(items.length).fill(null));

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
          gap: "60px",
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title="Look and circle."
          subTitle="Say each picture name, then tap the matching short-i word."
        />

        <div className="container-wb-unit6-p6-q2">
          {items.map((q, i) => {
            const questionLocked = isQuestionLocked(i);

            const questionWrong = results[i] === "wrong";

            return (
              <div
                key={i}
                className="question-box-wb-unit6-p6-q2"
                style={{
                  width: "100%",
                }}
              >
                {/* =====================================
                    IMAGE
                ====================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "50px",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {i + 1}
                  </span>

                  <img
                    src={q.img}
                    alt={q.alt}
                    className="q3-image-review6-p1-q1"
                    style={{
                      height: "120px",
                      width: "auto",
                    }}
                  />
                </div>

                {/* =====================================
                    OPTIONS
                ====================================== */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <div className="options-row-wb-unit5-p6-q3">
                    {q.options.map((option, optIndex) => {
                      const word = option.word;

                      const isSelected = answers[i] === optIndex;

                      const isCorrect = optIndex === q.correctIndex;

                      const showWrongX =
                        questionWrong && isSelected && !isCorrect;

                      const audioKey = `option-${i}-${optIndex}`;

                      const isPlaying = playingKey === audioKey;

                      /*
                          إذا السؤال locked:
                          فقط الاختيار الصحيح المختار
                          يظل بالـTab لتشغيل الصوت.
                        */

                      const canReplayLockedAudio =
                        questionLocked && isSelected && isCorrect;

                      return (
                        <div key={optIndex} className="option-wrapper">
                          <p
                            className={`
                                option-word-review6-p1-q1

                                ${isSelected ? "selected3" : ""}

                                ${
                                  results[i] === "correct" && isSelected
                                    ? "correct"
                                    : ""
                                }

                                ${
                                  questionWrong && isSelected && !isCorrect
                                    ? "wrong"
                                    : ""
                                }
                              `}
                            role="button"
                            tabIndex={
                              questionLocked
                                ? canReplayLockedAudio
                                  ? 0
                                  : -1
                                : 0
                            }
                            aria-pressed={isSelected}
                            aria-label={
                              canReplayLockedAudio
                                ? `${word}. Correct answer. Play audio.`
                                : `Question ${i + 1}: ${word}. ${
                                    isSelected ? "Selected." : "Not selected."
                                  } Press Enter or Space to hear and select this answer.`
                            }
                            onClick={() => {
                              /*
                                  لو السؤال locked،
                                  فقط الصحيح المختار
                                  يشتغل له الصوت.
                                */

                              if (questionLocked) {
                                if (canReplayLockedAudio) {
                                  playAudio(audioKey, option.audio);
                                }

                                return;
                              }

                              activateOption(i, optIndex);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();

                                e.stopPropagation();

                                /*
                                    correct locked:
                                    صوت فقط.
                                  */

                                if (questionLocked) {
                                  if (canReplayLockedAudio) {
                                    playAudio(audioKey, option.audio);
                                  }

                                  return;
                                }

                                /*
                                    editable:
                                    صوت + اختيار.
                                  */

                                activateOption(i, optIndex);
                              }
                            }}
                            style={{
                              display: "flex",

                              justifyContent: "center",

                              alignItems: "center",

                              position: "relative",

                              cursor:
                                questionLocked && !canReplayLockedAudio
                                  ? "default"
                                  : "pointer",
                            }}
                          >
                            {word}

                            {/* =====================================
                                  AUDIO ICON
                                  فقط أثناء التشغيل
                              ====================================== */}

                            {isPlaying && (
                              <FaVolumeUp
                                size={13}
                                aria-hidden="true"
                                style={{
                                  position: "absolute",
                                  top: "-8px",
                                  right: "-10px",
                                  pointerEvents: "none",
                                  zIndex: 2,
                                }}
                              />
                            )}

                            {/* =====================================
                                  WRONG X
                              ====================================== */}

                            {showWrongX && (
                              <span
                                className="wrong-x-review4-p2-q3"
                                aria-hidden="true"
                              >
                                ✕
                              </span>
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
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
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit6_Page6_Q2;
