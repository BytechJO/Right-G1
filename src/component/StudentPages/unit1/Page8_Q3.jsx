import React, { useRef, useState } from "react";

import img2 from "../../../assets/unit1/imgs/Read and match 01.png";
import img1 from "../../../assets/unit1/imgs/Read and match 02.png";

import "./Page8_Q3.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import helloSound from "../../../assets/unit1/Page 8 - B/Hello.mp3";
import goodbyeSound from "../../../assets/unit1/Page 8 - B/Goodbye!.mp3";

import ExerciseHeader from "../../ExerciseHeader";

export default function Page8_Q3() {
  /* =====================================================
     STATES
  ===================================================== */

  const [previewLine, setPreviewLine] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const sentenceRefs = useRef({});
  const imageRefs = useRef([]);

  const sentenceOrder = ["Hello! I’m John.", "Goodbye!"];

  const imageOrder = ["img2", "img1"];

  const [lines, setLines] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  const [firstDot, setFirstDot] = useState(null);

  const containerRef = useRef(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const [resetKey, setResetKey] = useState(0);

  const [selectedWord, setSelectedWord] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const sentenceAudioRef = useRef(null);

  /* =====================================================
     NEW - PROGRESSIVE LOCK
  ===================================================== */

  const [lockedWords, setLockedWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (image) => lockedImages.includes(image);

  /* =====================================================
     CORRECT ANSWERS
  ===================================================== */

  const correctMatches = [
    {
      word: "Hello! I’m John.",
      image: "img1",
    },
    {
      word: "Goodbye!",
      image: "img2",
    },
  ];

  /* =====================================================
     PREVIEW LINE
  ===================================================== */

  const updatePreviewLine = (startPoint, imageElement) => {
    if (!startPoint || !imageElement) return;

    const rect = containerRef.current.getBoundingClientRect();

    const imageDotId = imageElement.dataset.dotId;

    const dot = document.getElementById(imageDotId);

    if (!dot) return;

    const dotRect = dot.getBoundingClientRect();

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,

      x2: dotRect.left - rect.left + 8,

      y2: dotRect.top - rect.top + 8,
    });
  };

  /* =====================================================
     START KEYBOARD MATCH
  ===================================================== */

  const startKeyboardMatch = (word, dotId) => {
    if (showAnswer || isWordLocked(word)) {
      return;
    }

    const dot = document.getElementById(dotId);

    if (!dot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = dot.getBoundingClientRect();

    /* =========================================
       إذا الكلمة كانت موصولة غلط من قبل
       نشيل خطها القديم فقط
    ========================================= */

    setLines((prev) => prev.filter((line) => line.word !== word));

    setWrongWords((prev) => prev.filter((item) => item !== word));

    setSelectedWord(word);

    const startPoint = {
      word,

      x: dotRect.left - rect.left + 8,

      y: dotRect.top - rect.top + 8,
    };

    setFirstDot(startPoint);

    setAnnouncement(
      `${word} selected. Use Tab or Shift plus Tab to choose a picture, then press Enter or Space to connect.`,
    );

    /* =========================================
       أول صورة غير مقفلة
    ========================================= */

    requestAnimationFrame(() => {
      const firstAvailableIndex = imageOrder.findIndex(
        (imageId) => !isImageLocked(imageId),
      );

      if (firstAvailableIndex === -1) {
        return;
      }

      const firstImage = imageRefs.current[firstAvailableIndex];

      if (firstImage) {
        firstImage.focus();

        updatePreviewLine(startPoint, firstImage);
      }
    });
  };

  /* =====================================================
     IMAGE KEYBOARD
  ===================================================== */

  const handleImageKeyboard = (e, imageIndex, imageId) => {
    if (!firstDot) return;

    if (isImageLocked(imageId)) {
      return;
    }

    /* =========================================
       TAB فقط بين الصور غير المقفلة
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const availableIndexes = imageOrder
        .map((id, index) => ({
          id,
          index,
        }))
        .filter(({ id }) => !isImageLocked(id))
        .map(({ index }) => index);

      if (availableIndexes.length === 0) {
        return;
      }

      const currentPosition = availableIndexes.indexOf(imageIndex);

      let nextPosition;

      if (e.shiftKey) {
        nextPosition =
          currentPosition <= 0
            ? availableIndexes.length - 1
            : currentPosition - 1;
      } else {
        nextPosition =
          currentPosition === -1 ||
          currentPosition === availableIndexes.length - 1
            ? 0
            : currentPosition + 1;
      }

      const nextIndex = availableIndexes[nextPosition];

      const nextImage = imageRefs.current[nextIndex];

      if (nextImage) {
        nextImage.focus();

        updatePreviewLine(firstDot, nextImage);
      }

      return;
    }

    /* =========================================
       ENTER / SPACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      commitKeyboardMatch(imageId, true);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      const currentWord = firstDot.word;

      setFirstDot(null);

      setPreviewLine(null);

      setSelectedWord(null);

      setSelectedImage(null);

      setAnnouncement(
        `${currentWord} selection cancelled. Choose a sentence from the left side.`,
      );

      requestAnimationFrame(() => {
        sentenceRefs.current[currentWord]?.focus();
      });
    }
  };

  /* =====================================================
     COMMIT KEYBOARD MATCH
  ===================================================== */

  const commitKeyboardMatch = (imageId, moveFocusToNextSentence = false) => {
    if (!firstDot) return;

    const currentWord = firstDot.word;

    if (isWordLocked(currentWord) || isImageLocked(imageId)) {
      return;
    }

    const dot = document.querySelector(`[data-image="${imageId}"]`);

    if (!dot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = dot.getBoundingClientRect();

    const oldLineOnImage = lines.find((line) => line.image === imageId);

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,

      x2: dotRect.left - rect.left + 8,

      y2: dotRect.top - rect.top + 8,

      word: currentWord,

      image: imageId,
    };

    /* =========================================
       كلمة واحدة = خط واحد
       صورة واحدة = خط واحد
    ========================================= */

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== currentWord && line.image !== imageId,
      );

      return [...filtered, newLine];
    });

    /* =========================================
       شيل X فقط عن العناصر المعدلة
    ========================================= */

    setWrongWords((prev) =>
      prev.filter(
        (word) => word !== currentWord && word !== oldLineOnImage?.word,
      ),
    );

    setSelectedImage(imageId);

    setFirstDot(null);

    setPreviewLine(null);

    if (!moveFocusToNextSentence) {
      setTimeout(() => {
        setSelectedWord(null);

        setSelectedImage(null);
      }, 300);

      return;
    }

    setAnnouncement(
      `${currentWord} connected. Focus returned to the next available sentence.`,
    );

    setTimeout(() => {
      setSelectedWord(null);

      setSelectedImage(null);

      const availableWords = sentenceOrder.filter(
        (word) => !isWordLocked(word) && word !== currentWord,
      );

      if (availableWords.length > 0) {
        sentenceRefs.current[availableWords[0]]?.focus();
      }
    }, 100);
  };

  /* =====================================================
     AUDIO
  ===================================================== */

  const playSentenceSound = (sound) => {
    if (!sound) return;

    if (sentenceAudioRef.current) {
      sentenceAudioRef.current.pause();

      sentenceAudioRef.current.currentTime = 0;

      sentenceAudioRef.current.src = sound;

      sentenceAudioRef.current.play();
    }
  };

  /* =====================================================
     MOUSE START DOT
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer) return;

    const word = e.currentTarget.dataset.letter;

    if (isWordLocked(word)) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    /* =========================================
       لو الكلمة موصولة غلط
       نشيل خطها القديم
    ========================================= */

    setLines((prev) => prev.filter((line) => line.word !== word));

    setWrongWords((prev) => prev.filter((item) => item !== word));

    setSelectedWord(word);

    const dotRect = e.currentTarget.getBoundingClientRect();

    setFirstDot({
      word,

      x: dotRect.left - rect.left + 8,

      y: dotRect.top - rect.top + 8,
    });
  };

  /* =====================================================
     MOUSE END DOT
  ===================================================== */

  const handleEndDotClick = (e) => {
    if (showAnswer || !firstDot) {
      return;
    }

    const image = e.currentTarget.dataset.image;

    if (isImageLocked(image) || isWordLocked(firstDot.word)) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = e.currentTarget.getBoundingClientRect();

    const oldLineOnImage = lines.find((line) => line.image === image);

    const newLine = {
      x1: firstDot.x,

      y1: firstDot.y,

      x2: dotRect.left - rect.left + 8,

      y2: dotRect.top - rect.top + 8,

      word: firstDot.word,

      image,
    };

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== firstDot.word && line.image !== image,
      );

      return [...filtered, newLine];
    });

    setWrongWords((prev) =>
      prev.filter(
        (word) => word !== firstDot.word && word !== oldLineOnImage?.word,
      ),
    );

    setSelectedImage(image);

    setTimeout(() => {
      setSelectedWord(null);

      setSelectedImage(null);
    }, 300);

    setFirstDot(null);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );

      return;
    }

    const wrong = [];

    const newLockedWords = [];

    const newLockedImages = [];

    let correctCount = 0;

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;

        newLockedWords.push(line.word);

        newLockedImages.push(line.image);
      } else {
        wrong.push(line.word);
      }
    });

    /* =========================================
       الصح فقط يتقفل
    ========================================= */

    setLockedWords((prev) => Array.from(new Set([...prev, ...newLockedWords])));

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newLockedImages])),
    );

    setWrongWords(wrong);

    setFirstDot(null);

    setPreviewLine(null);

    setSelectedWord(null);

    setSelectedImage(null);

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    /* =========================================
       ALL CORRECT
    ========================================= */

    if (correctCount === total) {
      setLockedWords(correctMatches.map((item) => item.word));

      setLockedImages(correctMatches.map((item) => item.image));

      setCheckCompleted(true);

      setAnnouncement("All matches are correct.");

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setLines([]);

    setWrongWords([]);

    setFirstDot(null);

    setShowAnswer(false);

    setLockedWords([]);

    setLockedImages([]);

    setCheckCompleted(false);

    setSelectedWord(null);

    setSelectedImage(null);

    setPreviewLine(null);

    setAnnouncement("Activity reset.");

    setResetKey((k) => k + 1);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const rect = containerRef.current.getBoundingClientRect();

    const getDotPosition = (selector) => {
      const el = document.querySelector(selector);

      if (!el) {
        return {
          x: 0,
          y: 0,
        };
      }

      const r = el.getBoundingClientRect();

      return {
        x: r.left - rect.left + 8,

        y: r.top - rect.top + 8,
      };
    };

    const finalLines = correctMatches.map((line) => {
      const start = getDotPosition(`[data-letter="${line.word}"]`);

      const end = getDotPosition(`[data-image="${line.image}"]`);

      return {
        ...line,

        x1: start.x,

        y1: start.y,

        x2: end.x,

        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongWords([]);

    setSelectedWord(null);

    setSelectedImage(null);

    setFirstDot(null);

    setPreviewLine(null);

    setLockedWords(correctMatches.map((item) => item.word));

    setLockedImages(correctMatches.map((item) => item.image));

    setCheckCompleted(true);

    setAnnouncement("Correct answers shown.");

    setShowAnswer(true);

    setResetKey((k) => k + 1);
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div
      className="matching-wrapper"
      style={{
        padding: "30px",
      }}
    >
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="B"
          title="Read and match."
          subTitle="Tap on and connect each greeting to the matching picture."
        />

        <audio
          ref={sentenceAudioRef}
          style={{
            display: "none",
          }}
        />

        {/* =================================================
            SCREEN READER INSTRUCTIONS
        ================================================= */}

        <span className="sr-only">
          Read and match. Use Tab to move through the sentences on the left and
          press Enter or Space to select one. Focus then moves to the pictures.
          Use Tab or Shift plus Tab to move only through the pictures, then
          press Enter or Space to connect. Press Escape to cancel and return to
          the selected sentence.
        </span>

        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        {/* =================================================
            ACTIVITY
        ================================================= */}

        <div
          key={resetKey}
          className="container-unit1-p8-exb w-full"
          ref={containerRef}
        >
          {/* =================================================
              ROW 1
          ================================================= */}

          <div className="matching-row">
            <div className="word-with-dot">
              <span className="span-num">1</span>

              <div
                style={{
                  position: "relative",
                }}
              >
                <span
                  ref={(el) => {
                    sentenceRefs.current["Hello! I’m John."] = el;
                  }}
                  className={`word-text ${
                    selectedWord === "Hello! I’m John." ? "selected-item" : ""
                  } ${
                    isWordLocked("Hello! I’m John.") || showAnswer
                      ? "disabled-word"
                      : ""
                  }`}
                  role="button"
                  tabIndex={
                    isWordLocked("Hello! I’m John.") || showAnswer || firstDot
                      ? -1
                      : 0
                  }
                  aria-disabled={isWordLocked("Hello! I’m John.") || showAnswer}
                  aria-label={
                    isWordLocked("Hello! I’m John.")
                      ? "Hello! I'm John. Correct match. Press Enter to play audio."
                      : "Hello! I'm John. Press Enter to start matching."
                  }
                  onClick={() => {
                    /* الصوت يظل شغال دائمًا */
                    playSentenceSound(helloSound);

                    if (isWordLocked("Hello! I’m John.") || showAnswer) {
                      return;
                    }

                    document.getElementById("dot-hello")?.click();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      /* الصوت يظل شغال */
                      playSentenceSound(helloSound);

                      if (isWordLocked("Hello! I’m John.") || showAnswer) {
                        return;
                      }

                      startKeyboardMatch("Hello! I’m John.", "dot-hello");
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "3px solid #2563eb";

                    e.currentTarget.style.outlineOffset = "4px";

                    e.currentTarget.style.borderRadius = "6px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                  style={{
                    cursor: "pointer",

                    width: "190px",
                  }}
                >
                  Hello! I’m John.
                </span>

                {wrongWords.includes("Hello! I’m John.") && (
                  <span className="error-mark">✕</span>
                )}
              </div>

              <div className="dot-wrapper">
                <div
                  id="dot-hello"
                  className="dot start-dot"
                  data-letter="Hello! I’m John."
                  onClick={handleStartDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* IMAGE 1 - img2 */}

            <div className="img-with-dot">
              <div className="dot-wrapper">
                <div
                  id="img2-dot"
                  className="dot end-dot"
                  data-image="img2"
                  onClick={handleEndDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>

              <img
                ref={(el) => {
                  imageRefs.current[0] = el;
                }}
                data-dot-id="img2-dot"
                src={img2}
                className={`matched-img ${
                  selectedImage === "img2" ? "selected-item" : ""
                } ${
                  isImageLocked("img2") || showAnswer ? "disabled-hover" : ""
                }`}
                alt="Matching picture 1"
                role="button"
                tabIndex={
                  showAnswer || isImageLocked("img2") || !firstDot ? -1 : 0
                }
                aria-disabled={isImageLocked("img2") || showAnswer}
                aria-label={
                  firstDot
                    ? `Picture 1. Press Enter to match with ${firstDot.word}.`
                    : "Matching picture 1"
                }
                onFocus={(e) => {
                  if (firstDot && !isImageLocked("img2")) {
                    e.currentTarget.style.outline = "3px solid #2563eb";

                    e.currentTarget.style.outlineOffset = "5px";

                    e.currentTarget.style.transform = "scale(1.05)";

                    updatePreviewLine(firstDot, e.currentTarget);
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";

                  e.currentTarget.style.transform = "scale(1)";
                }}
                onKeyDown={(e) => handleImageKeyboard(e, 0, "img2")}
                onClick={() => {
                  if (isImageLocked("img2") || showAnswer) {
                    return;
                  }

                  if (firstDot) {
                    commitKeyboardMatch("img2", false);
                  } else {
                    document.getElementById("img2-dot")?.click();
                  }
                }}
                style={{
                  cursor:
                    isImageLocked("img2") || showAnswer ? "default" : "pointer",

                  transition: "transform 0.15s ease",
                }}
              />
            </div>
          </div>

          {/* =================================================
              ROW 2
          ================================================= */}

          <div className="matching-row">
            <div className="word-with-dot">
              <span className="span-num">2</span>

              <div
                style={{
                  position: "relative",
                }}
              >
                <span
                  ref={(el) => {
                    sentenceRefs.current["Goodbye!"] = el;
                  }}
                  className={`word-text ${
                    selectedWord === "Goodbye!" ? "selected-item" : ""
                  } ${
                    isWordLocked("Goodbye!") || showAnswer
                      ? "disabled-word"
                      : ""
                  }`}
                  role="button"
                  tabIndex={
                    isWordLocked("Goodbye!") || showAnswer || firstDot ? -1 : 0
                  }
                  aria-disabled={isWordLocked("Goodbye!") || showAnswer}
                  aria-label={
                    isWordLocked("Goodbye!")
                      ? "Goodbye. Correct match. Press Enter to play audio."
                      : "Goodbye. Press Enter to start matching."
                  }
                  onClick={() => {
                    /* الصوت يظل شغال */
                    playSentenceSound(goodbyeSound);

                    if (isWordLocked("Goodbye!") || showAnswer) {
                      return;
                    }

                    document.getElementById("dot-goodbye")?.click();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      playSentenceSound(goodbyeSound);

                      if (isWordLocked("Goodbye!") || showAnswer) {
                        return;
                      }

                      startKeyboardMatch("Goodbye!", "dot-goodbye");
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "3px solid #2563eb";

                    e.currentTarget.style.outlineOffset = "4px";

                    e.currentTarget.style.borderRadius = "6px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                  style={{
                    cursor: "pointer",

                    width: "190px",
                  }}
                >
                  Goodbye!
                </span>

                {wrongWords.includes("Goodbye!") && (
                  <span className="error-mark">✕</span>
                )}
              </div>

              <div className="dot-wrapper">
                <div
                  id="dot-goodbye"
                  className="dot start-dot"
                  data-letter="Goodbye!"
                  onClick={handleStartDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* IMAGE 2 - img1 */}

            <div className="img-with-dot">
              <div className="dot-wrapper">
                <div
                  id="img1-dot"
                  className="dot end-dot"
                  data-image="img1"
                  onClick={handleEndDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>

              <img
                ref={(el) => {
                  imageRefs.current[1] = el;
                }}
                data-dot-id="img1-dot"
                src={img1}
                className={`matched-img ${
                  selectedImage === "img1" ? "selected-item" : ""
                } ${
                  isImageLocked("img1") || showAnswer ? "disabled-hover" : ""
                }`}
                alt="Matching picture 2"
                role="button"
                tabIndex={
                  showAnswer || isImageLocked("img1") || !firstDot ? -1 : 0
                }
                aria-disabled={isImageLocked("img1") || showAnswer}
                aria-label={
                  firstDot
                    ? `Picture 2. Press Enter to match with ${firstDot.word}.`
                    : "Matching picture 2"
                }
                onFocus={(e) => {
                  if (firstDot && !isImageLocked("img1")) {
                    e.currentTarget.style.outline = "3px solid #2563eb";

                    e.currentTarget.style.outlineOffset = "5px";

                    e.currentTarget.style.transform = "scale(1.05)";

                    updatePreviewLine(firstDot, e.currentTarget);
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";

                  e.currentTarget.style.transform = "scale(1)";
                }}
                onKeyDown={(e) => handleImageKeyboard(e, 1, "img1")}
                onClick={() => {
                  if (isImageLocked("img1") || showAnswer) {
                    return;
                  }

                  if (firstDot) {
                    commitKeyboardMatch("img1", false);
                  } else {
                    document.getElementById("img1-dot")?.click();
                  }
                }}
                style={{
                  cursor:
                    isImageLocked("img1") || showAnswer ? "default" : "pointer",

                  transition: "transform 0.15s ease",
                }}
              />
            </div>
          </div>

          {/* =================================================
              SVG LINES
          ================================================= */}

          <svg className="lines-layer" aria-hidden="true">
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

            {/* PREVIEW */}

            {previewLine && (
              <line
                x1={previewLine.x1}
                y1={previewLine.y1}
                x2={previewLine.x2}
                y2={previewLine.y2}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
                style={{
                  pointerEvents: "none",
                }}
              />
            )}
          </svg>
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button
          onClick={handleReset}
          className="try-again-button"
          title="Start again"
        >
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
          title="Show answer"
        >
          Show Answer
        </button>

        <button
          onClick={checkAnswers}
          className="check-button2"
          title="Check answer"
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
