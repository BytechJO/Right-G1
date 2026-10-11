import React, { useRef, useState } from "react";

import img1 from "../../../assets/unit8/imgs/U8P69EXEF-02.svg";
import img2 from "../../../assets/unit8/imgs/U8P69EXEF-01.svg";

import "./Unit8_Page6_Q3.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import touchYourArmSound from "../../../assets/unit8/sound/Page 69 - F/Touch your arm..mp3";
import openYourEyeSound from "../../../assets/unit8/sound/Page 69 - F/Open your eye..mp3";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const MATCHING_DATA = [
  {
    id: 1,

    sentence: "Touch your arm.",

    imageId: "img1",

    image: img1,

    imageAlt:
      "An illustrated human arm and hand, matching the instruction Touch your arm.",

    audio: touchYourArmSound,

    sentenceDotId: "dot-touch-arm",

    imageDotId: "img1-dot",
  },

  {
    id: 2,

    sentence: "Open your eye.",

    imageId: "img2",

    image: img2,

    imageAlt:
      "An illustrated open eye, matching the instruction Open your eye.",

    audio: openYourEyeSound,

    sentenceDotId: "dot-open-eye",

    imageDotId: "img2-dot",
  },
];

const sentenceOrder = MATCHING_DATA.map((item) => item.sentence);

const imageOrder = MATCHING_DATA.map((item) => item.imageId);

const correctMatches = MATCHING_DATA.map((item) => ({
  word: item.sentence,
  image: item.imageId,
}));

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Unit8_Page6_Q3() {
  /* =====================================================
     STATES
  ===================================================== */

  const [previewLine, setPreviewLine] = useState(null);

  const [announcement, setAnnouncement] = useState("");

  const sentenceRefs = useRef({});
  const imageRefs = useRef([]);

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
     PROGRESSIVE LOCK
  ===================================================== */

  const [lockedWords, setLockedWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (image) => lockedImages.includes(image);

  /* =====================================================
     GET ITEM
  ===================================================== */

  const getSentenceItem = (sentence) =>
    MATCHING_DATA.find((item) => item.sentence === sentence);

  const getImageItem = (imageId) =>
    MATCHING_DATA.find((item) => item.imageId === imageId);

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
     PREVIEW LINE
  ===================================================== */

  const updatePreviewLine = (startPoint, imageElement) => {
    if (!startPoint || !imageElement || !containerRef.current) {
      return;
    }

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

    if (!dot || !containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = dot.getBoundingClientRect();

    /*
      إذا الجملة كانت موصولة غلط من قبل:
      شيل خطها القديم فقط.
    */

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

    /*
      أول صورة غير مقفلة.
    */

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
       TAB / SHIFT + TAB
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

    if (!dot || !containerRef.current) {
      return;
    }

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

    /*
      كلمة واحدة = line واحدة.
      صورة واحدة = line واحدة.
    */

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== currentWord && line.image !== imageId,
      );

      return [...filtered, newLine];
    });

    /*
      شيل X فقط عن العناصر المعدلة.
    */

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
     MOUSE START DOT
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer) return;

    const word = e.currentTarget.dataset.letter;

    if (isWordLocked(word)) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    /*
      لو الجملة موصولة غلط:
      نشيل line القديمة تبعتها.
    */

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

    if (!containerRef.current) {
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

    setPreviewLine(null);
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

    /*
      الصح فقط يقفل.
    */

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
    if (!containerRef.current) {
      return;
    }

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
          sectionLetter="F"
          title="Read and match."
          subTitle="Read each instruction and match it to the correct body-part picture."
        />

        {/* =================================================
            HIDDEN AUDIO
        ================================================= */}

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
          Read and match. Use Tab to move through the instructions on the left
          and press Enter or Space to select one. Focus then moves to the
          pictures. Use Tab or Shift plus Tab to move only through the available
          pictures, then press Enter or Space to connect. Press Escape to cancel
          and return to the selected instruction.
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
          {MATCHING_DATA.map((item, index) => {
            const wordLocked = isWordLocked(item.sentence);

            const imageLocked = isImageLocked(item.imageId);

            const wordSelected = selectedWord === item.sentence;

            const imageSelected = selectedImage === item.imageId;

            return (
              <div className="matching-row" key={item.id}>
                {/* =================================================
                      SENTENCE / SOURCE
                  ================================================= */}

                <div className="word-with-dot">
                  <span className="span-num">{item.id}</span>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <span
                      ref={(el) => {
                        sentenceRefs.current[item.sentence] = el;
                      }}
                      className={`
                          word-text

                          ${wordSelected ? "selected-item" : ""}

                          ${wordLocked || showAnswer ? "disabled-word" : ""}
                        `}
                      role="button"
                      tabIndex={showAnswer || firstDot ? -1 : 0}
                      aria-disabled={wordLocked || showAnswer}
                      aria-label={
                        wordLocked
                          ? `${item.sentence} Correct match. Press Enter or Space to play audio.`
                          : `${item.sentence} Press Enter or Space to play audio and start matching.`
                      }
                      onClick={() => {
                        /*
                            الصوت يظل شغال حتى بعد القفل
                          */

                        playSentenceSound(item.audio);

                        if (wordLocked || showAnswer) {
                          return;
                        }

                        document.getElementById(item.sentenceDotId)?.click();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          /*
                              الصوت يظل شغال.
                            */

                          playSentenceSound(item.audio);

                          if (wordLocked || showAnswer) {
                            return;
                          }

                          startKeyboardMatch(item.sentence, item.sentenceDotId);
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
                      {item.sentence}
                    </span>

                    {wrongWords.includes(item.sentence) && (
                      <span className="error-mark" aria-hidden="true">
                        ✕
                      </span>
                    )}
                  </div>

                  {/* SOURCE DOT */}

                  <div className="dot-wrapper">
                    <div
                      id={item.sentenceDotId}
                      className="dot start-dot"
                      data-letter={item.sentence}
                      onClick={handleStartDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* =================================================
                      IMAGE / TARGET
                  ================================================= */}

                <div className="img-with-dot">
                  <div className="dot-wrapper">
                    <div
                      id={item.imageDotId}
                      className="dot end-dot"
                      data-image={item.imageId}
                      onClick={handleEndDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>

                  <img
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    data-dot-id={item.imageDotId}
                    src={item.image}
                    className={`
                        matched-img

                        ${imageSelected ? "selected-item" : ""}

                        ${imageLocked || showAnswer ? "disabled-hover" : ""}
                      `}
                    alt={item.imageAlt}
                    role="button"
                    tabIndex={showAnswer || imageLocked || !firstDot ? -1 : 0}
                    aria-disabled={imageLocked || showAnswer}
                    aria-label={
                      firstDot
                        ? `${item.imageAlt} Press Enter or Space to match with ${firstDot.word}.`
                        : item.imageAlt
                    }
                    onFocus={(e) => {
                      if (firstDot && !imageLocked) {
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
                    onKeyDown={(e) =>
                      handleImageKeyboard(e, index, item.imageId)
                    }
                    onClick={() => {
                      if (imageLocked || showAnswer) {
                        return;
                      }

                      /*
                          إذا في sentence selected:
                          اربط مباشرة بالصورة.

                          وإذا mouse interaction من الدوت،
                          image dot يشتغل برضه.
                        */

                      if (firstDot) {
                        commitKeyboardMatch(item.imageId, false);
                      } else {
                        document.getElementById(item.imageDotId)?.click();
                      }
                    }}
                    style={{
                      cursor: imageLocked || showAnswer ? "default" : "pointer",

                      transition: "transform 0.15s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* =================================================
              SVG LINES
          ================================================= */}

          <svg
            className="lines-layer"
            aria-hidden="true"
            style={{
              pointerEvents: "none",
            }}
          >
            {/* PERMANENT LINES */}

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

            {/* KEYBOARD PREVIEW */}

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
