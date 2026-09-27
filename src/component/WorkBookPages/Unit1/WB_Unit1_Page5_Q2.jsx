import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit1_Page5_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U1/SVG/U1P5EXEF.svg";

// ===============================================
// AUDIO
// عدل أسماء الملفات فقط إذا الاسم عندك مختلف حرفيًا
// ===============================================

import howAreYouAudio from "../../../assets/U1 WB/U1/page_5_2/Item_001_How_are_you.mp3";
import goodEveningAudio from "../../../assets/U1 WB/U1/page_5_2/Item_002_Good_Evening!.mp3";
import helloStellaAudio from "../../../assets/U1 WB/U1/page_5_2/Item_003_Hello!_I'm,_Stella.mp3";
import fineThankYouAudio from "../../../assets/U1 WB/U1/page_5_2/Item_004_fine,_thank_you.mp3";
import goodbyeAudio from "../../../assets/U1 WB/U1/page_5_2/Item_005_Goodbye.mp3";

// ===============================================
// DATA
// ===============================================

const sentences = [
  {
    text: "How are you .",
    audio: howAreYouAudio,
  },
  {
    text: "Good Evening!",
    audio: goodEveningAudio,
  },
  {
    text: "Hello! I’m, Stella?",
    audio: helloStellaAudio,
  },
  {
    text: "fine, thank you?",
    audio: fineThankYouAudio,
  },
  {
    text: "Goodbye?",
    audio: goodbyeAudio,
  },
];

// نفس الـindexes الأصلية تبعت الحروف
const correct = {
  0: [12],
  1: [5],
  2: [18],
  3: [0, 15],
  4: [7],
};

const WB_Unit1_Page5_Q2 = () => {
  const [checked, setChecked] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  const [circledWords, setCircledWords] = useState({});

  const [playingSentence, setPlayingSentence] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const audioRef = useRef(null);

  // ===============================================
  // AUDIO
  // ===============================================

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingSentence(null);
  };

  const playSentenceAudio = (sIndex) => {
    const src = sentences[sIndex]?.audio;

    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingSentence(sIndex);

    audio.play().catch(() => {
      setPlayingSentence(null);
    });

    audio.onended = () => {
      setPlayingSentence(null);

      audioRef.current = null;
    };
  };

  // ===============================================
  // SELECT / UNSELECT CHARACTER
  // ===============================================

  const handleCharClick = (sIndex, charIndex) => {
    if (showAnswer || checked) return;

    const char = sentences[sIndex].text[charIndex];

    if (char === " ") return;

    setCircledWords((prev) => {
      const updated = {
        ...prev,
      };

      const currentSentence = updated[sIndex] || [];

      if (currentSentence.includes(charIndex)) {
        updated[sIndex] = currentSentence.filter(
          (index) => index !== charIndex,
        );

        setAnnouncement(`${char} unselected.`);
      } else {
        updated[sIndex] = [...currentSentence, charIndex];

        setAnnouncement(`${char} selected as a mistake.`);
      }

      // إذا ما ضل ولا اختيار بالجملة
      if (updated[sIndex]?.length === 0) {
        delete updated[sIndex];
      }

      return updated;
    });
  };

  // ===============================================
  // CHECK
  // ===============================================

  const checkAnswers = () => {
    if (showAnswer || checked) return;

    const selectedCount = Object.values(circledWords).reduce(
      (total, arr) => total + arr.length,
      0,
    );

    if (selectedCount === 0) {
      ValidationAlert.info("Oops!", "Please circle at least one mistake.");

      return;
    }

    let totalCorrect = 0;

    let studentCorrect = 0;

    Object.keys(correct).forEach((sentenceIndex) => {
      totalCorrect += correct[sentenceIndex].length;
    });

    Object.keys(circledWords).forEach((sentenceIndex) => {
      circledWords[sentenceIndex].forEach((charIndex) => {
        if (correct[sentenceIndex]?.includes(charIndex)) {
          studentCorrect++;
        }
      });
    });

    setChecked(true);

    const color =
      studentCorrect === totalCorrect
        ? "green"
        : studentCorrect === 0
          ? "red"
          : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${studentCorrect} / ${totalCorrect}
        </span>
      </div>
    `;

    if (studentCorrect === totalCorrect) {
      ValidationAlert.success(scoreMessage);
    } else if (studentCorrect === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ===============================================
  // SHOW ANSWER
  // ===============================================

  const showCorrectAnswers = () => {
    stopAudio();

    const answerObj = {};

    Object.keys(correct).forEach((sIndex) => {
      answerObj[sIndex] = [...correct[sIndex]];
    });

    setCircledWords(answerObj);

    setShowAnswer(true);

    setChecked(false);

    setAnnouncement("Correct answers shown.");
  };

  // ===============================================
  // RESET
  // ===============================================

  const reset = () => {
    stopAudio();

    setCircledWords({});

    setChecked(false);

    setShowAnswer(false);

    setAnnouncement("Activity reset.");
  };

  // ===============================================
  // CLEANUP
  // ===============================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ===============================================
  // RENDER
  // ===============================================

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
      {/* screen reader feedback */}

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div
        className="div-forall"
        style={{
          gap: "60px",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">F</span>
          Tap or click the mistakes in the sentences.
        </h5>

        <div className="sentence-container-wb-u1-p5-q2">
          {/* ==========================================
              SENTENCES
          ========================================== */}

          <div className="sentences-list-wb-u1-p5-q2">
            {sentences.map((sentence, sIndex) => {
              const isPlaying = playingSentence === sIndex;

              return (
                <div key={sIndex} className="sentence-row-wb-u1-p5-q2">
                  {/* ==================================
                        NUMBER / AUDIO
                    ================================== */}

                  <button
                    type="button"
                    className="sentence-audio-wb-u1-p5-q2"
                    onClick={() => playSentenceAudio(sIndex)}
                    aria-label={`Play sentence ${sIndex + 1}: ${sentence.text}`}
                  >
                    <span className="sentence-number-wb-u1-p5-q2">
                      {sIndex + 1}
                    </span>

                    {isPlaying && (
                      <span
                        className="playing-sentence-wb-u1-p5-q2"
                        aria-hidden="true"
                      >
                        🔊
                      </span>
                    )}
                  </button>

                  {/* ==================================
                        CHARACTERS
                    ================================== */}

                  <div
                    className="sentence-text-wb-u1-p5-q2"
                    role="group"
                    aria-label={`Sentence ${sIndex + 1}`}
                  >
                    {sentence.text.split("").map((char, charIndex) => {
                      // spaces stay visual only
                      // not focusable
                      if (char === " ") {
                        return (
                          <span
                            key={charIndex}
                            className="space-char-wb-u1-p5-q2"
                            aria-hidden="true"
                          />
                        );
                      }

                      const isCircled =
                        circledWords[sIndex]?.includes(charIndex);

                      const isCorrect =
                        checked &&
                        isCircled &&
                        correct[sIndex]?.includes(charIndex);

                      const isWrong =
                        checked &&
                        !showAnswer &&
                        isCircled &&
                        !correct[sIndex]?.includes(charIndex);

                      return (
                        <span
                          key={charIndex}
                          role="button"
                          tabIndex={showAnswer || checked ? -1 : 0}
                          aria-pressed={isCircled}
                          aria-label={`Character ${char}. ${
                            isCircled
                              ? "Selected as a mistake."
                              : "Not selected."
                          }`}
                          onClick={() => handleCharClick(sIndex, charIndex)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              handleCharClick(sIndex, charIndex);
                            }
                          }}
                          className={`char-container-wb-u1-p5-q2 ${
                            isCircled ? "circled-wb-u1-p5-q2" : ""
                          } ${isCorrect ? "correct-char-wb-u1-p5-q2" : ""}`}
                        >
                          {char}

                          {isWrong && (
                            <span
                              className="wrong-x-unit2-q3"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==========================================
              IMAGE
          ========================================== */}

          <img
            src={img1}
            className="activity-image-wb-u1-p5-q2"
            alt="A girl and a boy greeting each other."
          />
        </div>
      </div>

      {/* ==============================================
          BUTTONS
      ============================================== */}

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
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

export default WB_Unit1_Page5_Q2;
