import React, { useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U5/U5P27EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U5/U5P27EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U5/U5P27EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U5/U5P27EXEA-04.svg";

import deskAudio from "../../../assets/U1 WB/U5/audio/page_27_qA/Item_001_desk.mp3";
import bookAudio from "../../../assets/U1 WB/U5/audio/page_27_qA/Item_002_book.mp3";
import trashBinAudio from "../../../assets/U1 WB/U5/audio/page_27_qA/Item_003_trash_bin.mp3";
import mapAudio from "../../../assets/U1 WB/U5/audio/page_27_qA/Item_004_map.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit5_Page1_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const imageData = [
  {
    id: "img1",
    src: img1,
    alt: "A wooden school desk with a chair.",
    number: 1,
  },
  {
    id: "img2",
    src: img2,
    alt: "A colorful world map.",
    number: 2,
  },
  {
    id: "img3",
    src: img3,
    alt: "A blue trash bin with a recycling symbol.",
    number: 3,
  },
  {
    id: "img4",
    src: img4,
    alt: "A pink and blue book.",
    number: 4,
  },
];

const wordData = [
  {
    word: "map",
    audio: mapAudio,
  },
  {
    word: "desk",
    audio: deskAudio,
  },
  {
    word: "book",
    audio: bookAudio,
  },
  {
    word: "trash bin",
    audio: trashBinAudio,
  },
];

const correctMatches = [
  { word: "map", image: "img2" },
  { word: "desk", image: "img1" },
  { word: "book", image: "img4" },
  { word: "trash bin", image: "img3" },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit5_Page1_Q1 = () => {
  /* =================================================
     REFS
  ================================================= */

  const containerRef = useRef(null);

  const imageRefs = useRef({});
  const wordRefs = useRef({});

  const imageDotRefs = useRef({});
  const wordDotRefs = useRef({});

  const audioRef = useRef(null);

  /* =================================================
     CONNECTION STATE
  ================================================= */

  const [lines, setLines] = useState([]);

  const [firstPoint, setFirstPoint] = useState(null);

  const [previewLine, setPreviewLine] = useState(null);

  const [wrongImages, setWrongImages] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     VISUAL SELECTION
  ================================================= */

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  /* =================================================
     AUDIO
  ================================================= */

  const [playingWord, setPlayingWord] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingWord(null);
  };

  const playAudio = (word, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const isImageLocked = (imageId) => lockedImages.includes(imageId);

  const isWordLocked = (word) => {
    const pair = correctMatches.find((item) => item.word === word);

    return pair ? lockedImages.includes(pair.image) : false;
  };

  const getCenter = (el) => {
    if (!el || !containerRef.current) {
      return { x: 0, y: 0 };
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const rect = el.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,

      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  const getUnlockedWords = () =>
    wordData.map((item) => item.word).filter((word) => !isWordLocked(word));
  const focusNextUnlockedImage = (currentImageId) => {
    const availableImages = imageData
      .map((item) => item.id)
      .filter((id) => id !== currentImageId && !isImageLocked(id));

    if (!availableImages.length) return;

    window.setTimeout(() => {
      imageRefs.current[availableImages[0]]?.focus();
    }, 0);
  };
  /* =================================================
     CLEAR WRONG
  ================================================= */

  const clearWrongForImage = (imageId) => {
    setWrongImages((prev) => prev.filter((id) => id !== imageId));
  };

  /* =================================================
     COMMIT CONNECTION
  ================================================= */
  const commitConnection = ({ image, word }) => {
    if (
      showAnswer ||
      checkCompleted ||
      isImageLocked(image) ||
      isWordLocked(word)
    ) {
      return;
    }

    const start = getCenter(imageDotRefs.current[image]);

    const end = getCenter(wordDotRefs.current[word]);

    const newLine = {
      image,
      word,

      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,
    };

    setLines((prev) => [
      ...prev.filter((line) => line.image !== image && line.word !== word),

      newLine,
    ]);

    clearWrongForImage(image);

    const committedImage = image;

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedImage(null);

    setSelectedWord(null);

    focusNextUnlockedImage(committedImage);
  };

  /* =================================================
     START FROM IMAGE
  ================================================= */

  const startFromImage = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    const point = getCenter(imageDotRefs.current[imageId]);

    setFirstPoint({
      side: "image",
      image: imageId,

      x: point.x,
      y: point.y,
    });

    setSelectedImage(imageId);

    setSelectedWord(null);

    setPreviewLine(null);
  };

  /* =================================================
     IMAGE KEYBOARD
  ================================================= */

  const handleImageKeyboard = (e, imageId) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    startFromImage(imageId);

    /*
      بعد اختيار الصورة
      روح لأول كلمة غير مقفلة
    */

    window.setTimeout(() => {
      const available = getUnlockedWords();

      if (!available.length) {
        return;
      }

      wordRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     WORD FOCUS PREVIEW
  ================================================= */

  const handleWordFocus = (word) => {
    if (!firstPoint || firstPoint.side !== "image") {
      return;
    }

    const end = getCenter(wordDotRefs.current[word]);

    setPreviewLine({
      x1: firstPoint.x,
      y1: firstPoint.y,

      x2: end.x,
      y2: end.y,
    });
  };

  /* =================================================
     WORD KEYBOARD
  ================================================= */

  const handleWordKeyboard = (e, item) => {
    const { word, audio } = item;

    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape") {
      if (!firstPoint) return;

      e.preventDefault();
      e.stopPropagation();

      const originalImage = firstPoint.image;

      setFirstPoint(null);

      setPreviewLine(null);

      setSelectedImage(null);

      setSelectedWord(null);

      window.setTimeout(() => {
        imageRefs.current[originalImage]?.focus();
      }, 0);

      return;
    }

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (firstPoint?.side === "image" && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getUnlockedWords();

      if (!available.length) {
        return;
      }

      const current = available.indexOf(word);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = current <= 0 ? available.length - 1 : current - 1;
      } else {
        nextIndex =
          current === -1 || current === available.length - 1 ? 0 : current + 1;
      }

      const nextWord = available[nextIndex];

      wordRefs.current[nextWord]?.focus();

      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      الصوت
    */

    playAudio(word, audio);

    /*
      إذا في صورة مختارة
      كمّل التوصيل
    */

    if (firstPoint?.side === "image") {
      commitConnection({
        image: firstPoint.image,
        word,
      });

      return;
    }
  };

  /* =================================================
     MOUSE IMAGE CLICK
  ================================================= */

  const handleImageClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    /*
      لو البداية من كلمة
      كمل connection
    */

    if (firstPoint?.side === "word") {
      commitConnection({
        image: imageId,

        word: firstPoint.word,
      });

      return;
    }

    /*
      غير هيك
      ابدأ من الصورة
    */

    startFromImage(imageId);
  };

  /* =================================================
     MOUSE WORD CLICK
  ================================================= */

  const handleWordClick = (item) => {
    const { word, audio } = item;

    /*
      الصوت يشتغل دائمًا
    */

    playAudio(word, audio);

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    /*
      لو البداية من صورة
      كمّل connection
    */

    if (firstPoint?.side === "image") {
      commitConnection({
        image: firstPoint.image,

        word,
      });

      return;
    }

    /*
      Mouse reverse:
      ابدأ من الكلمة
    */

    const point = getCenter(wordDotRefs.current[word]);

    setFirstPoint({
      side: "word",
      word,

      x: point.x,
      y: point.y,
    });

    setSelectedWord(word);

    setSelectedImage(null);

    setPreviewLine(null);
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers2 = () => {
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

    let correctCount = 0;

    const wrong = [];

    const correctImages = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;

        correctImages.push(line.image);
      } else {
        wrong.push(line.image);
      }
    });

    /* =================================================
       CORRECT LOCK
    ================================================= */

    setLockedImages((prev) => Array.from(new Set([...prev, ...correctImages])));

    /* =================================================
       WRONG REMAIN EDITABLE
    ================================================= */

    setWrongImages(wrong);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedImage(null);

    setSelectedWord(null);

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

    if (correctCount === total) {
      setLockedImages(correctMatches.map((item) => item.image));

      setWrongImages([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

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

    const finalLines = correctMatches.map((pair) => {
      const start = getCenter(imageDotRefs.current[pair.image]);

      const end = getCenter(wordDotRefs.current[pair.word]);

      return {
        ...pair,

        x1: start.x,
        y1: start.y,

        x2: end.x,
        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongImages([]);

    setLockedImages(correctMatches.map((item) => item.image));

    setShowAnswer(true);

    setCheckCompleted(true);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedImage(null);

    setSelectedWord(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setLines([]);

    setWrongImages([]);

    setLockedImages([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedImage(null);

    setSelectedWord(null);
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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          title="Look, read, and match."
          subTitle="Connect each picture to map, desk, book, or trash bin."
        />

        <div className="match-wrapper2" ref={containerRef}>
          {/* =================================================
              IMAGES
          ================================================= */}

          <div
            className="match-images-row2"
            style={{
              marginTop: "30px",
            }}
          >
            {imageData.map((item) => {
              const locked = isImageLocked(item.id);

              const wrong = wrongImages.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="img-box2"
                  style={{
                    display: "flex",

                    gap: "10px",

                    flexDirection: "row",

                    alignItems: "flex-start",

                    position: "relative",
                  }}
                >
                  {/* =============================
                      NUMBER
                  ============================= */}

                  <span
                    style={{
                      color: "darkblue",

                      fontWeight: "700",
                    }}
                  >
                    {item.number}
                  </span>

                  {/* =============================
                      IMAGE
                  ============================= */}

                  <img
                    ref={(el) => {
                      imageRefs.current[item.id] = el;
                    }}
                    src={item.src}
                    alt={item.alt}
                    role="button"
                    tabIndex={locked || showAnswer || checkCompleted ? -1 : 0}
                    aria-label={`Picture ${item.number}. ${item.alt} Press Enter or Space to start matching.`}
                    className={`matched-img2 ${
                      selectedImage === item.id ? "selected-item" : ""
                    } ${locked || showAnswer ? "disabled-hover" : ""}`}
                    onClick={() => handleImageClick(item.id)}
                    onKeyDown={(e) => handleImageKeyboard(e, item.id)}
                    style={{
                      cursor:
                        locked || showAnswer || checkCompleted
                          ? "default"
                          : "pointer",
                    }}
                  />

                  {/* =============================
                      WRONG X
                  ============================= */}

                  {wrong && (
                    <span
                      className="error-mark-img-unit7-p6-q2"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}

                  {/* =============================
                      IMAGE DOT
                  ============================= */}

                  <div
                    ref={(el) => {
                      imageDotRefs.current[item.id] = el;
                    }}
                    className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                    data-image={item.id}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              WORDS
          ================================================= */}

          <div className="match-words-row2">
            {wordData.map((item) => {
              const locked = isWordLocked(item.word);

              const canKeyboardTarget =
                firstPoint?.side === "image" &&
                !locked &&
                !showAnswer &&
                !checkCompleted;

              const playing = playingWord === item.word;

              return (
                <div className="word-box2" key={item.word}>
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    {/* =============================
                        WORD
                    ============================= */}

                    <h5
                      ref={(el) => {
                        wordRefs.current[item.word] = el;
                      }}
                      role="button"
                      tabIndex={canKeyboardTarget ? 0 : -1}
                      aria-label={
                        canKeyboardTarget
                          ? `${item.word}. Press Enter or Space to connect this word.`
                          : `Audio for ${item.word}`
                      }
                      className={`h5-wb-unit5-p1-q1 ${
                        locked || showAnswer ? "disabled-word" : ""
                      } ${selectedWord === item.word ? "selected-item" : ""}`}
                      onFocus={() => handleWordFocus(item.word)}
                      onClick={() => handleWordClick(item)}
                      onKeyDown={(e) => handleWordKeyboard(e, item)}
                      style={{
                        position: "relative",

                        cursor: locked || showAnswer ? "default" : "pointer",
                      }}
                    >
                      {item.word}

                      {/* =============================
                          AUDIO ICON
                      ============================= */}

                      {playing && (
                        <FaVolumeUp
                          size={16}
                          aria-hidden="true"
                          className="audio-icon-wb-u5-p1-q1"
                        />
                      )}
                    </h5>

                    {/* =============================
                        WORD DOT
                    ============================= */}

                    <div
                      ref={(el) => {
                        wordDotRefs.current[item.word] = el;
                      }}
                      className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                      data-word={item.word}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              LINES
          ================================================= */}

          <svg className="lines-layer2">
            {lines.map((line, index) => (
              <line
                key={`${line.image}-${line.word}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}

            {/* =============================
                KEYBOARD PREVIEW
            ============================= */}

            {previewLine && (
              <line
                x1={previewLine.x1}
                y1={previewLine.y1}
                x2={previewLine.x2}
                y2={previewLine.y2}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
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
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={checkAnswers2} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit5_Page1_Q1;
