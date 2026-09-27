import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-01.svg";
import img2 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-02.svg";
import img3 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-03.svg";
import img4 from "../../../assets/U1 WB/U1/SVG/U1P4EXEC-04.svg";

// ================================
// AUDIO
// ================================

import helloStellaAudio from "../../../assets/U1 WB/U1/page_4/Item_001_Hello!_I'm_Stella.mp3";
import goodbyeAudio from "../../../assets/U1 WB/U1/page_4/Item_002_Goodbye!.mp3";
import goodAfternoonAudio from "../../../assets/U1 WB/U1/page_4/Item_003_Good_afternoon!.mp3";
import goodMorningAudio from "../../../assets/U1 WB/U1/page_4/Item_004_Good_morning!.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./WB_Unit1_Page3_Q2.css";

const WB_Unit1_Page3_Q2 = () => {
  const data = [
    {
      id: 1,
      word: "Goodbye!",
      audio: goodbyeAudio,
      imgs: [
        {
          src: img1,
          answer: true,
          alt: "A girl waving to two people standing at the doorway.",
        },
        {
          src: img2,
          answer: false,
          alt: "A person riding a bicycle outside during the day.",
        },
      ],
    },

    {
      id: 2,
      word: "Hello! I’m Stella.",
      audio: helloStellaAudio,
      imgs: [
        {
          src: img4,
          answer: true,
          alt: "Two girls standing outside and talking to each other.",
        },
        {
          src: img1,
          answer: false,
          alt: "A girl waving to two people standing at the doorway.",
        },
      ],
    },

    {
      id: 3,
      word: "Good afternoon!",
      audio: goodAfternoonAudio,
      imgs: [
        {
          src: img4,
          answer: false,
          alt: "Two girls standing outside and talking to each other.",
        },
        {
          src: img2,
          answer: true,
          alt: "A person riding a bicycle outside during the day.",
        },
      ],
    },

    {
      id: 4,
      word: "Good morning!",
      audio: goodMorningAudio,
      imgs: [
        {
          src: img3,
          answer: true,
          alt: "A girl sitting up in bed while a man stands beside her.",
        },
        {
          src: img4,
          answer: false,
          alt: "Two girls standing outside and talking to each other.",
        },
      ],
    },
  ];
  // ================================
  // STATE
  // ================================

  const [selected, setSelected] = useState({});

  const [showResult, setShowResult] = useState(false);

  const [showAnswerState, setShowAnswerState] = useState(false);

  const [playingQuestion, setPlayingQuestion] = useState(null);

  const audioRef = useRef(null);

  // ================================
  // AUDIO
  // ================================

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

  // ================================
  // SELECT IMAGE
  // ================================

  const handleSelect = (qId, index) => {
    if (showAnswerState || showResult) return;

    setSelected((prev) => ({
      ...prev,
      [qId]: index,
    }));
  };

  // ================================
  // SHOW ANSWER
  // ================================

  const showCorrectAnswers = () => {
    const correctSelections = {};

    data.forEach((question) => {
      const correctIndex = question.imgs.findIndex(
        (img) => img.answer === true,
      );

      correctSelections[question.id] = correctIndex;
    });

    setSelected(correctSelections);

    setShowResult(false);

    setShowAnswerState(true);
  };

  // ================================
  // CHECK ANSWER
  // ================================

  const checkAnswers = () => {
    if (showAnswerState) return;

    const totalQuestions = data.length;

    // لازم يجاوب كل الأسئلة
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

    data.forEach((question) => {
      const chosenIndex = selected[question.id];

      if (question.imgs[chosenIndex]?.answer === true) {
        correct++;
      }
    });

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

    if (correct === totalQuestions) {
      ValidationAlert.success(scoreMessage);
    } else if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    setShowResult(true);
  };

  // ================================
  // RESET
  // ================================

  const reset = () => {
    stopCurrentAudio();

    setSelected({});

    setShowResult(false);

    setShowAnswerState(false);
  };

  // ================================
  // CLEANUP
  // ================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ================================
  // RENDER
  // ================================

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
        <h5 className="header-title-page8">
          <span className="ex-A">B</span>
          Tap or click the correct box.
        </h5>

        <div
          className="shorti1-container-wb-u1-q2"
          style={{
            gap: "50px",
          }}
        >
          {data.map((question) => {
            const isPlaying = playingQuestion === question.id;

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

                    const isWrong =
                      showResult &&
                      !showAnswerState &&
                      isSelected &&
                      img.answer === false;

                    return (
                      <button
                        key={index}
                        type="button"
                        className={`img-box-wb-u1-q2 ${
                          isSelected && !showResult && !showAnswerState
                            ? "selected-wb-u1-q2"
                            : ""
                        }`}
                        onClick={() => handleSelect(question.id, index)}
                        disabled={showAnswerState || showResult}
                        aria-pressed={isSelected}
                        aria-label={`${img.alt}${
                          isSelected ? ". Selected." : ""
                        }`}
                      >
                        {/* غلط فقط */}

                        {isWrong && (
                          <span
                            className="wrong-x-circle-wb-u1-p3-q2"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        )}

                        <img src={img.src} alt={img.alt} />

                        {/* check box الأصلي */}

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

export default WB_Unit1_Page3_Q2;
