import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page4_Q2.css";

// ======================================================
// AUDIO
// LEFT SIDE - scrambled
// ======================================================

import stellaScrambledSound from "../../../assets/U1 WB/U1/page_4_2/Item_001_Stella_I'm._Hello!.mp3";
import fineScrambledSound from "../../../assets/U1 WB/U1/page_4_2/Item_003_thank_Fine,_you.mp3";
import afternoonScrambledSound from "../../../assets/U1 WB/U1/page_4_2/Item_005_afternoon_Good!.mp3";
import howScrambledSound from "../../../assets/U1 WB/U1/page_4_2/Item_008_you_How_are.mp3";

// ======================================================
// AUDIO
// RIGHT SIDE - correct sentences
// ======================================================

import goodAfternoonSound from "../../../assets/U1 WB/U1/page_4_2/Item_002_Good_afternoon!.mp3";
import howAreYouSound from "../../../assets/U1 WB/U1/page_4_2/Item_004_How_are_you.mp3";
import helloStellaSound from "../../../assets/U1 WB/U1/page_4_2/Item_006_Hello!_I'm_Stella.mp3";
import fineThankYouSound from "../../../assets/U1 WB/U1/page_4_2/Item_007_Fine,_thank_you.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ======================================================
// DATA
// ======================================================

const leftWords = [
  {
    text: "Stella I’m. Hello!",
    audio: stellaScrambledSound,
  },
  {
    text: "thank Fine, you.",
    audio: fineScrambledSound,
  },
  {
    text: "afternoon Good !",
    audio: afternoonScrambledSound,
  },
  {
    text: "you How are ?",
    audio: howScrambledSound,
  },
];

const rightWords = [
  {
    text: "Good afternoon!",
    audio: goodAfternoonSound,
  },
  {
    text: "How are you?",
    audio: howAreYouSound,
  },
  {
    text: "Hello! I’m Stella.",
    audio: helloStellaSound,
  },
  {
    text: "Fine, thank you.",
    audio: fineThankYouSound,
  },
];

const correctMatches = [
  {
    word1: "Stella I’m. Hello!",
    word2: "Hello! I’m Stella.",
  },
  {
    word1: "thank Fine, you.",
    word2: "Fine, thank you.",
  },
  {
    word1: "afternoon Good !",
    word2: "Good afternoon!",
  },
  {
    word1: "you How are ?",
    word2: "How are you?",
  },
];

// ======================================================
// MAIN
// ======================================================

export default function WB_Unit1_Page4_Q2() {
  const [lines, setLines] = useState([]);

  const [previewLine, setPreviewLine] = useState(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [firstDot, setFirstDot] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const [locked, setLocked] = useState(false);

  const [selectedLeftWord, setSelectedLeftWord] = useState(null);

  const [selectedRightWord, setSelectedRightWord] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const [resetKey, setResetKey] = useState(0);

  const containerRef = useRef(null);

  // Keyboard refs
  const leftRefs = useRef({});
  const rightRefs = useRef([]);

  // Audio
  const audioRef = useRef(null);

  // ======================================================
  // AUDIO
  // ======================================================

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current = null;
  };

  const playAudio = (src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    audio.play().catch(() => {});

    audio.onended = () => {
      audioRef.current = null;
    };
  };

  const getLeftAudio = (word) =>
    leftWords.find((item) => item.text === word)?.audio;

  const getRightAudio = (word) =>
    rightWords.find((item) => item.text === word)?.audio;

  // ======================================================
  // GET DOT POSITION
  // ======================================================

  const getDotPosition = (element) => {
    if (!element || !containerRef.current) {
      return null;
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const rect = element.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,

      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  // ======================================================
  // PREVIEW LINE
  // ======================================================

  const updatePreviewLine = (startPoint, rightWord) => {
    if (!startPoint) return;

    const dot = document.querySelector(
      `.end-dot5[data-image="${CSS.escape(rightWord)}"]`,
    );

    if (!dot) return;

    const end = getDotPosition(dot);

    if (!end) return;

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: end.x,
      y2: end.y,
    });
  };

  // ======================================================
  // START KEYBOARD MATCH
  // ======================================================

  const startKeyboardMatch = (word, dotId) => {
    if (locked || showAnswer) return;

    const dot = document.getElementById(dotId);

    if (!dot) return;

    const start = getDotPosition(dot);

    if (!start) return;

    // إذا الكلمة كانت موصولة من قبل
    // شيل الخط القديم عشان يقدر يعدله
    setLines((prev) => prev.filter((line) => line.word !== word));

    setWrongWords((prev) => prev.filter((item) => item !== word));

    setSelectedLeftWord(word);

    const startPoint = {
      word,
      x: start.x,
      y: start.y,
    };

    setFirstDot(startPoint);

    setAnnouncement(
      `${word} selected. Use Tab or Shift plus Tab to choose a sentence on the right, then press Enter or Space.`,
    );

    // ينقل مباشرة لأول خيار باليمين
    requestAnimationFrame(() => {
      const firstRight = rightRefs.current[0];

      if (firstRight) {
        firstRight.focus();

        updatePreviewLine(startPoint, rightWords[0].text);
      }
    });
  };

  // ======================================================
  // KEYBOARD RIGHT SIDE
  // ======================================================

  const handleRightKeyboard = (e, index, word) => {
    if (!firstDot) return;

    // ==============================
    // TAB ONLY BETWEEN RIGHT OPTIONS
    // ==============================

    if (e.key === "Tab") {
      e.preventDefault();

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = index === 0 ? rightRefs.current.length - 1 : index - 1;
      } else {
        nextIndex = index === rightRefs.current.length - 1 ? 0 : index + 1;
      }

      const nextElement = rightRefs.current[nextIndex];

      if (nextElement) {
        nextElement.focus();

        updatePreviewLine(firstDot, rightWords[nextIndex].text);
      }

      return;
    }

    // ==============================
    // ENTER / SPACE = CONNECT
    // ==============================

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      // صوت الجهة اليمين
      playAudio(getRightAudio(word));

      commitKeyboardMatch(word, true);

      return;
    }

    // ==============================
    // ESCAPE
    // ==============================

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const currentWord = firstDot.word;

      setFirstDot(null);

      setPreviewLine(null);

      setSelectedLeftWord(null);

      setSelectedRightWord(null);

      setAnnouncement(`${currentWord} selection cancelled.`);

      requestAnimationFrame(() => {
        leftRefs.current[currentWord]?.focus();
      });
    }
  };

  // ======================================================
  // COMMIT KEYBOARD MATCH
  // ======================================================

  const commitKeyboardMatch = (rightWord, moveToNextLeft = false) => {
    if (!firstDot) return;

    const endDot = document.querySelector(
      `.end-dot5[data-image="${CSS.escape(rightWord)}"]`,
    );

    if (!endDot) return;

    const end = getDotPosition(endDot);

    if (!end) return;

    const currentWord = firstDot.word;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,

      x2: end.x,
      y2: end.y,

      word: currentWord,

      image: rightWord,
    };

    setLines((prev) => {
      // كل كلمة شمال لها خط واحد
      // وكل كلمة يمين لها خط واحد
      const filtered = prev.filter(
        (line) => line.word !== currentWord && line.image !== rightWord,
      );

      return [...filtered, newLine];
    });

    setSelectedRightWord(rightWord);

    setFirstDot(null);

    setPreviewLine(null);

    if (!moveToNextLeft) {
      window.setTimeout(() => {
        setSelectedLeftWord(null);

        setSelectedRightWord(null);
      }, 300);

      return;
    }

    setAnnouncement(`${currentWord} connected to ${rightWord}.`);

    window.setTimeout(() => {
      setSelectedLeftWord(null);

      setSelectedRightWord(null);

      // روح للكلمة التالية بالشمال
      const currentIndex = leftWords.findIndex(
        (item) => item.text === currentWord,
      );

      const nextIndex =
        currentIndex === leftWords.length - 1 ? 0 : currentIndex + 1;

      const nextWord = leftWords[nextIndex].text;

      leftRefs.current[nextWord]?.focus();
    }, 100);
  };

  // ======================================================
  // MOUSE START
  // ======================================================

  const handleStartDotClick = (e) => {
    if (locked || showAnswer) return;

    const word = e.target.dataset.letter;

    setSelectedLeftWord(word);

    // صوت الشمال
    playAudio(getLeftAudio(word));

    const start = getDotPosition(e.target);

    if (!start) return;

    // إذا كان موصول من قبل
    // شيله عشان يقدر يغيره
    setLines((prev) => prev.filter((line) => line.word !== word));

    setWrongWords((prev) => prev.filter((item) => item !== word));

    setFirstDot({
      word,
      x: start.x,
      y: start.y,
    });
  };

  // ======================================================
  // MOUSE END
  // ======================================================

  const handleEndDotClick = (e) => {
    if (locked || showAnswer) return;

    if (!firstDot) return;

    const word = e.target.dataset.image;

    // صوت اليمين
    playAudio(getRightAudio(word));

    const end = getDotPosition(e.target);

    if (!end) return;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,

      x2: end.x,
      y2: end.y,

      word: firstDot.word,

      image: word,
    };

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== firstDot.word && line.image !== word,
      );

      return [...filtered, newLine];
    });

    setSelectedRightWord(word);

    setTimeout(() => {
      setSelectedLeftWord(null);

      setSelectedRightWord(null);
    }, 300);

    setFirstDot(null);

    setPreviewLine(null);
  };

  // ======================================================
  // CHECK
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || locked) {
      return;
    }

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all pairs before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word1 === line.word && pair.word2 === line.image,
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.word);
      }
    });

    setWrongWords(wrong);

    setLocked(true);

    setFirstDot(null);

    setPreviewLine(null);

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px; margin-top:10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
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

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const showCorrectAnswers = () => {
    if (!containerRef.current) {
      return;
    }

    const finalLines = correctMatches.map((pair) => {
      const startEl = document.querySelector(
        `.start-dot5[data-letter="${CSS.escape(pair.word1)}"]`,
      );

      const endEl = document.querySelector(
        `.end-dot5[data-image="${CSS.escape(pair.word2)}"]`,
      );

      const start = getDotPosition(startEl);

      const end = getDotPosition(endEl);

      return {
        x1: start?.x ?? 0,
        y1: start?.y ?? 0,

        x2: end?.x ?? 0,
        y2: end?.y ?? 0,

        word: pair.word1,

        image: pair.word2,
      };
    });

    setLines(finalLines);

    setWrongWords([]);

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    setFirstDot(null);

    setPreviewLine(null);

    setShowAnswer(true);

    setLocked(true);

    setAnnouncement("Correct answers shown.");
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    stopAudio();

    setLines([]);

    setWrongWords([]);

    setFirstDot(null);

    setPreviewLine(null);

    setShowAnswer(false);

    setLocked(false);

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    setAnnouncement("Activity reset.");

    setResetKey((key) => key + 1);
  };

  // ======================================================
  // AUDIO CLEANUP
  // ======================================================

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // ======================================================
  // RENDER
  // ======================================================

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
      {/* Screen reader status */}

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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="D"
          title="Unscramble and match."
          subTitle="Put each sentence in order, then connect it to the correct reply."
        />
        <div key={resetKey} className="matching-wrapper2" ref={containerRef}>
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="column2 left-column">
            {leftWords.map((item, i) => {
              const word = item.text;

              return (
                <div className="word-row2" key={word}>
                  <span className="num2">{i + 1}</span>

                  <span
                    ref={(element) => {
                      leftRefs.current[word] = element;
                    }}
                    className={`word-text3 ${
                      selectedLeftWord === word ? "selected-item" : ""
                    } ${locked || showAnswer ? "disabled-hover" : ""}`}
                    role="button"
                    tabIndex={locked || showAnswer || firstDot ? -1 : 0}
                    aria-label={`${word}. Press Enter or Space to select and hear it.`}
                    onClick={() => {
                      if (locked || showAnswer) {
                        return;
                      }

                      playAudio(item.audio);

                      document.getElementById(`left-dot-${i}`)?.click();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        if (locked || showAnswer) {
                          return;
                        }

                        // صوت الشمال
                        playAudio(item.audio);

                        startKeyboardMatch(word, `left-dot-${i}`);
                      }
                    }}
                    style={{
                      cursor: "pointer",

                      width: "230px",
                    }}
                  >
                    {word}
                  </span>

                  <div
                    className="dot5 start-dot5"
                    data-letter={word}
                    id={`left-dot-${i}`}
                    onClick={handleStartDotClick}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {wrongWords.includes(word) && (
                    <span className="error-mark4-wb-u1-p4-q2">✕</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="column2 right-column">
            {rightWords.map((item, i) => {
              const word = item.text;

              return (
                <div className="word-row2" key={word}>
                  <div
                    className="dot5 end-dot5"
                    data-image={word}
                    id={`right-dot-${i}`}
                    onClick={handleEndDotClick}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <span
                    ref={(element) => {
                      rightRefs.current[i] = element;
                    }}
                    className={`word-text3 ${
                      selectedRightWord === word ? "selected-item" : ""
                    } ${locked || showAnswer ? "disabled-hover" : ""}`}
                    role="button"
                    // اليمين يدخل بالـTab
                    // فقط بعد اختيار كلمة من الشمال
                    tabIndex={locked || showAnswer || !firstDot ? -1 : 0}
                    aria-label={
                      firstDot
                        ? `${word}. Press Enter or Space to connect with ${firstDot.word}.`
                        : `${word}.`
                    }
                    onFocus={(e) => {
                      if (!firstDot) {
                        return;
                      }

                      e.currentTarget.style.outline = "3px solid #2563eb";

                      e.currentTarget.style.outlineOffset = "4px";

                      e.currentTarget.style.borderRadius = "6px";

                      updatePreviewLine(firstDot, word);
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = "none";
                    }}
                    onKeyDown={(e) => handleRightKeyboard(e, i, word)}
                    onClick={() => {
                      if (locked || showAnswer) {
                        return;
                      }

                      // شغّل الصوت دائمًا
                      playAudio(item.audio);

                      if (firstDot) {
                        commitKeyboardMatch(word, false);
                      } else {
                        document.getElementById(`right-dot-${i}`)?.click();
                      }
                    }}
                    style={{
                      cursor: "pointer",

                      width: "230px",
                    }}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>

          {/* =================================================
              LINES
          ================================================= */}

          <svg className="lines-layer5" aria-hidden="true">
            {/* Fixed lines */}

            {lines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}

            {/* Keyboard preview */}

            {previewLine && (
              <line
                x1={previewLine.x1}
                y1={previewLine.y1}
                x2={previewLine.x2}
                y2={previewLine.y2}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
                pointerEvents="none"
              />
            )}
          </svg>
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
          onClick={showCorrectAnswers}
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
}
