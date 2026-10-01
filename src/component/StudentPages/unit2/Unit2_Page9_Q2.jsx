import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Unit2_Page9_Q2.css";

// ======================================================
// AUDIO
// LEFT SIDE - scrambled
// ======================================================

import ExerciseHeader from "../../ExerciseHeader";

// ======================================================
// DATA
// ======================================================

const leftWords = [
  {
    text: "Happy",
  },
  {
    text: "I'm seven",
  },
  {
    text: "How old",
  },
  {
    text: "Thank",
  },
];

const rightWords = [
  {
    text: "are you?",
  },
  {
    text: "you!",
  },
  {
    text: "birthday!",
  },
  {
    text: "years old.",
  },
];

const correctMatches = [
  {
    word1: "Happy",
    word2: "birthday!",
  },
  {
    word1: "I'm seven",
    word2: "years old.",
  },
  {
    word1: "How old",
    word2: "are you?",
  },
  {
    word1: "Thank",
    word2: "you!",
  },
];

// ======================================================
// MAIN
// ======================================================

export default function Unit2_Page9_Q2() {
  const [lines, setLines] = useState([]);

  const [previewLine, setPreviewLine] = useState(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [firstDot, setFirstDot] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  // ======================================================
  // PROGRESSIVE LOCK
  // ======================================================

  const [lockedLeftWords, setLockedLeftWords] = useState([]);

  const [lockedRightWords, setLockedRightWords] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const isLeftLocked = (word) => lockedLeftWords.includes(word);

  const isRightLocked = (word) => lockedRightWords.includes(word);

  const [selectedLeftWord, setSelectedLeftWord] = useState(null);

  const [selectedRightWord, setSelectedRightWord] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const [resetKey, setResetKey] = useState(0);

  const containerRef = useRef(null);

  // Keyboard refs
  const leftRefs = useRef({});

  const rightRefs = useRef([]);

  // Audio

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
  // AVAILABLE RIGHT OPTIONS
  // ======================================================

  const getAvailableRightIndexes = () =>
    rightWords
      .map((item, index) => ({
        word: item.text,
        index,
      }))
      .filter(({ word }) => !isRightLocked(word))
      .map(({ index }) => index);

  // ======================================================
  // START KEYBOARD MATCH
  // ======================================================

  const startKeyboardMatch = (word, dotId) => {
    if (showAnswer || checkCompleted || isLeftLocked(word)) {
      return;
    }

    const dot = document.getElementById(dotId);

    if (!dot) return;

    const start = getDotPosition(dot);

    if (!start) return;

    // إذا الكلمة كانت موصولة من قبل
    // شيل الخط القديم عشان يقدر يعدله
    setLines((prev) => prev.filter((line) => line.word !== word));

    // شيل X فقط عن نفس الكلمة
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

    // أول خيار يمين غير مقفول
    requestAnimationFrame(() => {
      const available = getAvailableRightIndexes();

      if (!available.length) return;

      const firstIndex = available[0];

      const firstRight = rightRefs.current[firstIndex];

      if (firstRight) {
        firstRight.focus();

        updatePreviewLine(startPoint, rightWords[firstIndex].text);
      }
    });
  };

  // ======================================================
  // KEYBOARD RIGHT SIDE
  // ======================================================

  const handleRightKeyboard = (e, index, word) => {
    if (!firstDot) return;

    if (showAnswer || checkCompleted || isRightLocked(word)) {
      return;
    }

    // ==============================
    // TAB ONLY BETWEEN UNLOCKED RIGHT OPTIONS
    // ==============================

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableRightIndexes();

      if (!available.length) return;

      const currentPosition = available.indexOf(index);

      let nextPosition;

      if (e.shiftKey) {
        nextPosition =
          currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
      } else {
        nextPosition =
          currentPosition === -1 || currentPosition === available.length - 1
            ? 0
            : currentPosition + 1;
      }

      const nextIndex = available[nextPosition];

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
        if (!isLeftLocked(currentWord)) {
          leftRefs.current[currentWord]?.focus();
        }
      });
    }
  };

  // ======================================================
  // COMMIT KEYBOARD MATCH
  // ======================================================

  const commitKeyboardMatch = (rightWord, moveToNextLeft = false) => {
    if (!firstDot) return;

    const currentWord = firstDot.word;

    if (
      showAnswer ||
      checkCompleted ||
      isLeftLocked(currentWord) ||
      isRightLocked(rightWord)
    ) {
      return;
    }

    const endDot = document.querySelector(
      `.end-dot5[data-image="${CSS.escape(rightWord)}"]`,
    );

    if (!endDot) return;

    const end = getDotPosition(endDot);

    if (!end) return;

    /*
      لو النهاية كانت مستخدمة بتوصيل غلط قديم،
      لازم نعرف صاحبها حتى نمسح X عنه عند الاستبدال.
    */
    const previousEndConnection = lines.find(
      (line) => line.image === rightWord,
    );

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

    /*
      شيل X عن التوصيل اللي عدلناه فقط.
    */

    setWrongWords((prev) =>
      prev.filter(
        (word) => word !== currentWord && word !== previousEndConnection?.word,
      ),
    );

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

      /*
        روح لأول كلمة شمال غير مقفلة.
      */

      const availableLeft = leftWords.filter(
        (item) => !isLeftLocked(item.text) && item.text !== currentWord,
      );

      if (availableLeft.length) {
        leftRefs.current[availableLeft[0].text]?.focus();

        return;
      }

      const fallback = leftWords.find((item) => !isLeftLocked(item.text));

      if (fallback) {
        leftRefs.current[fallback.text]?.focus();
      }
    }, 100);
  };

  // ======================================================
  // MOUSE START
  // ======================================================

  const handleStartDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const word = e.currentTarget.dataset.letter;

    if (!word || isLeftLocked(word)) return;

    setSelectedLeftWord(word);

    // صوت الشمال

    const start = getDotPosition(e.currentTarget);

    if (!start) return;

    // إذا كان موصول من قبل
    // شيله عشان يقدر يغيره
    setLines((prev) => prev.filter((line) => line.word !== word));

    // شيل X عن نفس التوصيل فقط
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
    if (showAnswer || checkCompleted || !firstDot) {
      return;
    }

    const word = e.currentTarget.dataset.image;

    if (!word || isRightLocked(word)) return;

    if (isLeftLocked(firstDot.word)) return;

    const end = getDotPosition(e.currentTarget);

    if (!end) return;

    const selectedWord = firstDot.word;

    const previousEndConnection = lines.find((line) => line.image === word);

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,

      x2: end.x,
      y2: end.y,

      word: selectedWord,
      image: word,
    };

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== selectedWord && line.image !== word,
      );

      return [...filtered, newLine];
    });

    /*
      X تنشال فقط عن العناصر المتغيرة.
    */

    setWrongWords((prev) =>
      prev.filter(
        (item) => item !== selectedWord && item !== previousEndConnection?.word,
      ),
    );

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
    /*
      بعد Show Answer أو النجاح النهائي:
      Check ما يعمل شيء.
    */

    if (showAnswer || checkCompleted) {
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

    const correctLeft = [];

    const correctRight = [];

    lines.forEach((line) => {
      const correctPair = correctMatches.find(
        (pair) => pair.word1 === line.word && pair.word2 === line.image,
      );

      if (correctPair) {
        correctCount++;

        correctLeft.push(line.word);

        correctRight.push(line.image);
      } else {
        wrong.push(line.word);
      }
    });

    // =========================================
    // LOCK ONLY CORRECT CONNECTIONS
    // =========================================

    setLockedLeftWords((prev) =>
      Array.from(new Set([...prev, ...correctLeft])),
    );

    setLockedRightWords((prev) =>
      Array.from(new Set([...prev, ...correctRight])),
    );

    setWrongWords(wrong);

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

    // =========================================
    // ALL CORRECT
    // =========================================

    if (correctCount === total) {
      setLockedLeftWords(leftWords.map((item) => item.text));

      setLockedRightWords(rightWords.map((item) => item.text));

      setWrongWords([]);

      setCheckCompleted(true);

      setAnnouncement("All matches are correct.");

      ValidationAlert.success(scoreMessage);

      return;
    }

    // =========================================
    // WRONG / PARTIAL
    // =========================================

    if (correctCount === 0) {
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

    setLockedLeftWords(leftWords.map((item) => item.text));

    setLockedRightWords(rightWords.map((item) => item.text));

    setCheckCompleted(true);

    setShowAnswer(true);

    setAnnouncement("Correct answers shown.");
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    setLines([]);

    setWrongWords([]);

    setFirstDot(null);

    setPreviewLine(null);

    setShowAnswer(false);

    setLockedLeftWords([]);

    setLockedRightWords([]);

    setCheckCompleted(false);

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    setAnnouncement("Activity reset.");

    setResetKey((key) => key + 1);
  };

  // ======================================================
  // AUDIO CLEANUP
  // ======================================================

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
          sectionLetter="B"
          title="Read and match."
          subTitle="Connect the words to make four complete birthday phrases."
        />

        <div key={resetKey} className="matching-wrapper2" ref={containerRef}>
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="column2 left-column">
            {leftWords.map((item, i) => {
              const word = item.text;

              const wordLocked = isLeftLocked(word);

              return (
                <div className="word-row2" key={word}>
                  <span className="num2">{i + 1}</span>

                  <span
                    ref={(element) => {
                      leftRefs.current[word] = element;
                    }}
                    className={`word-text3 ${
                      selectedLeftWord === word ? "selected-item" : ""
                    } ${wordLocked || showAnswer ? "disabled-hover" : ""}`}
                    role="button"
                    tabIndex={
                      wordLocked || showAnswer || checkCompleted || firstDot
                        ? -1
                        : 0
                    }
                    aria-disabled={wordLocked || showAnswer || checkCompleted}
                    aria-label={
                      wordLocked
                        ? `${word}. Correct match.`
                        : `${word}. Press Enter or Space to select it.`
                    }
                    onClick={() => {
                      /*
                        الصوت يظل ممكن يشتغل حتى لو
                        التوصيل صار صح.
                      */

                      if (wordLocked || showAnswer || checkCompleted) {
                        return;
                      }

                      document.getElementById(`left-dot-${i}`)?.click();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        if (wordLocked || showAnswer || checkCompleted) {
                          return;
                        }

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

              const wordLocked = isRightLocked(word);

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
                    } ${wordLocked || showAnswer ? "disabled-hover" : ""}`}
                    role="button"
                    tabIndex={
                      wordLocked || showAnswer || checkCompleted || !firstDot
                        ? -1
                        : 0
                    }
                    aria-disabled={wordLocked || showAnswer || checkCompleted}
                    aria-label={
                      wordLocked
                        ? `${word}. Correct match.`
                        : firstDot
                          ? `${word}. Press Enter or Space to connect with ${firstDot.word}.`
                          : `${word}.`
                    }
                    onFocus={(e) => {
                      if (!firstDot || wordLocked) {
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
                      /*
                        الصوت يظل شغال.
                      */

                      if (wordLocked || showAnswer || checkCompleted) {
                        return;
                      }

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
                key={`${line.word}-${line.image}-${i}`}
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
