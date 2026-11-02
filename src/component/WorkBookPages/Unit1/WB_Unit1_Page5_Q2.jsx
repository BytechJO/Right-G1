import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit1_Page5_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U1/SVG/U1P5EXEF.svg";

// ===============================================
// AUDIO
// ===============================================

import howAreYouAudio from "../../../assets/U1 WB/U1/page_5_2/Item_001_How_are_you.mp3";
import goodEveningAudio from "../../../assets/U1 WB/U1/page_5_2/Item_002_Good_Evening!.mp3";
import helloStellaAudio from "../../../assets/U1 WB/U1/page_5_2/Item_003_Hello!_I'm,_Stella.mp3";
import fineThankYouAudio from "../../../assets/U1 WB/U1/page_5_2/Item_004_fine,_thank_you.mp3";
import goodbyeAudio from "../../../assets/U1 WB/U1/page_5_2/Item_005_Goodbye.mp3";

import ExerciseHeader from "../../ExerciseHeader";

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

// نفس الـ indexes الأصلية تبعت الحروف
const correct = {
  0: [12],
  1: [5],
  2: [18],
  3: [0, 15],
  4: [7],
};

const WB_Unit1_Page5_Q2 = () => {
  // ===============================================
  // STATE
  // ===============================================

  const [showAnswer, setShowAnswer] = useState(false);

  const [circledWords, setCircledWords] = useState({});

  /*
    الأحرف الصح اللي اتأكدنا منها بالـ Check.
    الشكل:
    {
      0: [12],
      3: [0]
    }
  */
  const [lockedChars, setLockedChars] = useState({});

  /*
    الاختيارات الغلط اللي لازم يظهر عليها X.
  */
  const [wrongChars, setWrongChars] = useState({});

  /*
    بعد النجاح النهائي فقط.
  */
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [playingSentence, setPlayingSentence] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const audioRef = useRef(null);

  // ===============================================
  // HELPERS
  // ===============================================

  const isCharLocked = (sIndex, charIndex) =>
    lockedChars[sIndex]?.includes(charIndex);

  const isCharWrong = (sIndex, charIndex) =>
    wrongChars[sIndex]?.includes(charIndex);

  const getTotalCorrect = () =>
    Object.values(correct).reduce(
      (total, indexes) => total + indexes.length,
      0,
    );

  const getAllSelected = (obj) =>
    Object.entries(obj).flatMap(([sentenceIndex, indexes]) =>
      indexes.map((charIndex) => ({
        sentenceIndex: Number(sentenceIndex),
        charIndex,
      })),
    );

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
    if (showAnswer || checkCompleted || isCharLocked(sIndex, charIndex)) {
      return;
    }

    const char = sentences[sIndex].text[charIndex];

    if (char === " ") return;

    setCircledWords((prev) => {
      const updated = {
        ...prev,
      };

      const currentSentence = [...(updated[sIndex] || [])];

      if (currentSentence.includes(charIndex)) {
        updated[sIndex] = currentSentence.filter(
          (index) => index !== charIndex,
        );

        setAnnouncement(`${char} unselected.`);
      } else {
        updated[sIndex] = [...currentSentence, charIndex];

        setAnnouncement(`${char} selected as a mistake.`);
      }

      if (updated[sIndex]?.length === 0) {
        delete updated[sIndex];
      }

      return updated;
    });

    /*
      إذا كان هذا الحرف عليه X من Check سابق،
      أول ما المستخدم يعدله نشيل X عنه فقط.
    */

    setWrongChars((prev) => {
      if (!prev[sIndex]?.includes(charIndex)) {
        return prev;
      }

      const updated = {
        ...prev,
      };

      updated[sIndex] = updated[sIndex].filter((index) => index !== charIndex);

      if (updated[sIndex].length === 0) {
        delete updated[sIndex];
      }

      return updated;
    });
  };

  // ===============================================
  // CHECK
  // ===============================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const selectedCount = Object.values(circledWords).reduce(
      (total, arr) => total + arr.length,
      0,
    );

    if (selectedCount === 0) {
      ValidationAlert.info("Oops!", "Please circle at least one mistake.");

      return;
    }

    const totalCorrect = getTotalCorrect();

    let studentCorrect = 0;

    let wrongSelectedCount = 0;

    const newlyLocked = {};

    const newWrongChars = {};

    /*
      نفحص كل شيء اختاره المستخدم.
    */

    Object.keys(circledWords).forEach((sentenceIndexKey) => {
      const sentenceIndex = Number(sentenceIndexKey);

      circledWords[sentenceIndex].forEach((charIndex) => {
        const isCorrectSelection = correct[sentenceIndex]?.includes(charIndex);

        if (isCorrectSelection) {
          studentCorrect++;

          if (!newlyLocked[sentenceIndex]) {
            newlyLocked[sentenceIndex] = [];
          }

          newlyLocked[sentenceIndex].push(charIndex);
        } else {
          wrongSelectedCount++;

          if (!newWrongChars[sentenceIndex]) {
            newWrongChars[sentenceIndex] = [];
          }

          newWrongChars[sentenceIndex].push(charIndex);
        }
      });
    });

    // ===============================================
    // LOCK ONLY CORRECT SELECTED CHARACTERS
    // ===============================================

    setLockedChars((prev) => {
      const updated = {
        ...prev,
      };

      Object.keys(newlyLocked).forEach((sentenceIndexKey) => {
        const sentenceIndex = Number(sentenceIndexKey);

        updated[sentenceIndex] = Array.from(
          new Set([
            ...(updated[sentenceIndex] || []),
            ...newlyLocked[sentenceIndex],
          ]),
        );
      });

      return updated;
    });

    /*
      X فقط على الاختيارات الغلط الحالية.
    */

    setWrongChars(newWrongChars);

    // ===============================================
    // FINAL SUCCESS CHECK
    // ===============================================

    /*
      النجاح النهائي يحتاج:
      1. كل الأخطاء الصح تم اختيارها.
      2. ما في أي اختيار غلط.
    */

    const allCorrectMistakesSelected = studentCorrect === totalCorrect;

    const noWrongSelections = wrongSelectedCount === 0;

    const fullyCorrect = allCorrectMistakesSelected && noWrongSelections;

    const color = fullyCorrect
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

    if (fullyCorrect) {
      /*
        قفل كل الإجابات الصحيحة.
      */

      const allLocked = {};

      Object.keys(correct).forEach((sentenceIndex) => {
        allLocked[sentenceIndex] = [...correct[sentenceIndex]];
      });

      setLockedChars(allLocked);

      setWrongChars({});

      setCheckCompleted(true);

      setAnnouncement("All mistakes are correctly selected.");

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (studentCorrect === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    setAnnouncement(
      `Score ${studentCorrect} out of ${totalCorrect}. Correct selections are locked. Fix the incorrect selections and find any remaining mistakes.`,
    );
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

    setLockedChars(answerObj);

    setWrongChars({});

    setShowAnswer(true);

    setCheckCompleted(true);

    setAnnouncement("Correct answers shown.");
  };

  // ===============================================
  // RESET
  // ===============================================

  const reset = () => {
    stopAudio();

    setCircledWords({});

    setLockedChars({});

    setWrongChars({});

    setCheckCompleted(false);

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
        <ExerciseHeader
          sectionLetter="F"
          title="Read and circle the mistakes."
          subTitle="Check capital letters and end marks, then tap every mistake."
        />

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
                      /*
                        المسافات visual فقط.
                      */

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

                      const charLocked = isCharLocked(sIndex, charIndex);

                      const charWrong = isCharWrong(sIndex, charIndex);

                      return (
                        <span
                          key={charIndex}
                          role="button"
                          tabIndex={
                            showAnswer || checkCompleted || charLocked ? -1 : 0
                          }
                          aria-disabled={
                            showAnswer || checkCompleted || charLocked
                          }
                          aria-pressed={isCircled}
                          aria-label={`Character ${char}. ${
                            charLocked
                              ? "Correct mistake. Locked."
                              : isCircled
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
                          } ${charLocked ? "correct-char-wb-u1-p5-q2" : ""}`}
                          style={{
                            cursor:
                              charLocked || showAnswer || checkCompleted
                                ? "default"
                                : "pointer",
                          }}
                        >
                          {char}

                          {charWrong && (
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
