import React, { useRef, useState } from "react";

import table from "../../../assets/U1 WB/U5/U5P28EXEC-01.svg";
import dish from "../../../assets/U1 WB/U5/U5P28EXEC-02.svg";
import duck from "../../../assets/U1 WB/U5/U5P28EXEC-03.svg";

import deskAudio from "../../../assets/U1 WB/U5/audio/page_28_qC/Item_001_This_is_your_desk.mp3";
import chairAudio from "../../../assets/U1 WB/U5/audio/page_28_qC/Item_002_This_is_my_chair.mp3";
import bookAudio from "../../../assets/U1 WB/U5/audio/page_28_qC/Item_003_This_is_your_book.mp3";

import { FaVolumeUp } from "react-icons/fa";
import "./WB_Unit5_Page2_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

// import "./WB_Unit5_Page2_Q1.css";

/* =====================================================
   DATA
===================================================== */

const sentenceData = [
  {
    id: "sentence-1",
    number: 1,
    word: "This is your desk.",
    audio: deskAudio,
  },
  {
    id: "sentence-2",
    number: 2,
    word: "This is my chair.",
    audio: chairAudio,
  },
  {
    id: "sentence-3",
    number: 3,
    word: "This is your book.",
    audio: bookAudio,
  },
];

const imageData = [
  {
    id: "img1",
    src: table,
    alt: "A girl and a boy standing together and talking.",
  },
  {
    id: "img2",
    src: dish,
    alt: "A teacher pointing toward a student sitting at a school desk.",
  },
  {
    id: "img3",
    src: duck,
    alt: "A girl sitting on a wooden chair.",
  },
];

const correctMatches = [
  {
    word: "This is your desk.",
    image: "img2",
  },
  {
    word: "This is my chair.",
    image: "img3",
  },
  {
    word: "This is your book.",
    image: "img1",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit5_Page2_Q1 = () => {
  /* =================================================
     REFS
  ================================================= */

  const containerRef = useRef(null);

  const sentenceRefs = useRef({});
  const imageRefs = useRef({});

  const sentenceDotRefs = useRef({});
  const imageDotRefs = useRef({});

  const audioRef = useRef(null);

  /* =================================================
     STATES
  ================================================= */

  const [lines, setLines] = useState([]);

  const [firstPoint, setFirstPoint] = useState(null);

  const [previewLine, setPreviewLine] = useState(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedWords, setLockedWords] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [selectedWord, setSelectedWord] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

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

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (imageId) => {
    const pair = correctMatches.find((item) => item.image === imageId);

    return pair ? lockedWords.includes(pair.word) : false;
  };

  const getCenter = (el) => {
    if (!el || !containerRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const rect = el.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,

      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  const getAvailableImages = () =>
    imageData
      .map((item) => item.id)
      .filter((imageId) => !isImageLocked(imageId));

  const getAvailableWords = () =>
    sentenceData.map((item) => item.word).filter((word) => !isWordLocked(word));

  /* =================================================
     CLEAR WRONG
  ================================================= */

  const clearWrongForWord = (word) => {
    setWrongWords((prev) => prev.filter((item) => item !== word));
  };

  /* =================================================
     FOCUS NEXT SOURCE
  ================================================= */

  const focusNextAvailableWord = (currentWord) => {
    const available = getAvailableWords().filter(
      (word) => word !== currentWord,
    );

    if (!available.length) {
      return;
    }

    window.setTimeout(() => {
      sentenceRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     COMMIT CONNECTION
  ================================================= */

  const commitConnection = ({ word, image, returnFocus = false }) => {
    if (
      showAnswer ||
      checkCompleted ||
      isWordLocked(word) ||
      isImageLocked(image)
    ) {
      return;
    }

    /*
      الخط من DOT إلى DOT
    */

    const start = getCenter(sentenceDotRefs.current[word]);

    const end = getCenter(imageDotRefs.current[image]);

    const newLine = {
      word,
      image,

      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,
    };

    /*
      ONE TO ONE

      أي خط قديم لنفس الجملة
      أو لنفس الصورة ينشال.
    */

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== image),

      newLine,
    ]);

    clearWrongForWord(word);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedWord(null);

    setSelectedImage(null);

    /*
      بعد Keyboard connection
      رجع فوق لأول sentence متاحة
    */

    if (returnFocus) {
      focusNextAvailableWord(word);
    }
  };

  /* =================================================
     START FROM SENTENCE
  ================================================= */

  const startFromSentence = (item) => {
    const { word } = item;

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    const point = getCenter(sentenceDotRefs.current[word]);

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
     START FROM IMAGE - MOUSE
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
     SENTENCE MOUSE
     الجملة أو DOT = نفس التصرف
  ================================================= */

  const handleSentenceClick = (item) => {
    const { word, audio } = item;

    // الصوت دائمًا
    playAudio(word, audio);

    // إذا مقفلة: وقف هون
    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    if (firstPoint?.side === "image") {
      commitConnection({
        word,
        image: firstPoint.image,
      });

      return;
    }

    startFromSentence(item);
  };
  /* =================================================
     IMAGE MOUSE
     الصورة أو DOT = نفس التصرف
  ================================================= */

  const handleImageClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    /*
      إذا البداية من sentence
      كمل التوصيل
    */

    if (firstPoint?.side === "word") {
      commitConnection({
        word: firstPoint.word,

        image: imageId,
      });

      return;
    }

    /*
      Mouse reverse:
      ابدأ من الصورة
    */

    startFromImage(imageId);
  };

  /* =================================================
     SENTENCE KEYBOARD
  ================================================= */
  const handleSentenceKeyboard = (e, item) => {
    const { word, audio } = item;

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // الصوت يظل شغال دائمًا
    playAudio(word, audio);

    // إذا صح ومقفلة: صوت فقط
    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    // غير هيك يبدأ التوصيل
    startFromSentence(item);

    window.setTimeout(() => {
      const available = getAvailableImages();

      if (!available.length) return;

      imageRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     IMAGE FOCUS PREVIEW
  ================================================= */

  const handleImageFocus = (imageId) => {
    if (!firstPoint || firstPoint.side !== "word") {
      return;
    }

    const end = getCenter(imageDotRefs.current[imageId]);

    setPreviewLine({
      x1: firstPoint.x,
      y1: firstPoint.y,

      x2: end.x,
      y2: end.y,
    });
  };

  /* =================================================
     IMAGE KEYBOARD
  ================================================= */

  const handleImageKeyboard = (e, imageId) => {
    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape") {
      if (!firstPoint || firstPoint.side !== "word") {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const originalWord = firstPoint.word;

      setFirstPoint(null);

      setPreviewLine(null);

      setSelectedWord(null);

      setSelectedImage(null);

      window.setTimeout(() => {
        sentenceRefs.current[originalWord]?.focus();
      }, 0);

      return;
    }

    /* =================================================
       TAB / SHIFT TAB
       فقط بين الصور المتاحة
    ================================================= */

    if (firstPoint?.side === "word" && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableImages();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(imageId);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextImage = available[nextIndex];

      imageRefs.current[nextImage]?.focus();

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

    if (firstPoint?.side !== "word") {
      return;
    }

    commitConnection({
      word: firstPoint.word,

      image: imageId,

      returnFocus: true,
    });
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

    const newlyLocked = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;

        newlyLocked.push(line.word);
      } else {
        wrong.push(line.word);
      }
    });

    /*
      الصحيح فقط يقفل
    */

    setLockedWords((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      الغلط يظل editable
    */

    setWrongWords(wrong);

    setFirstPoint(null);

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

    if (correctCount === total) {
      setLockedWords(correctMatches.map((item) => item.word));

      setWrongWords([]);

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
      const start = getCenter(sentenceDotRefs.current[pair.word]);

      const end = getCenter(imageDotRefs.current[pair.image]);

      return {
        ...pair,

        x1: start.x,
        y1: start.y,

        x2: end.x,
        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongWords([]);

    setLockedWords(correctMatches.map((item) => item.word));

    setShowAnswer(true);

    setCheckCompleted(true);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedWord(null);

    setSelectedImage(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setLines([]);

    setWrongWords([]);

    setLockedWords([]);

    setFirstPoint(null);

    setPreviewLine(null);

    setShowAnswer(false);

    setCheckCompleted(false);

    setSelectedWord(null);

    setSelectedImage(null);
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
          gap: "50px",
        }}
      >
        <ExerciseHeader
          sectionLetter="C"
          title="Read, look, and match."
          subTitle="Read each sentence and connect it to the correct classroom picture."
        />

        <div className="container12 w-full" ref={containerRef}>
          {sentenceData.map((sentence, index) => {
            const image = imageData[index];

            const locked = isWordLocked(sentence.word);

            const targetLocked = isImageLocked(image.id);

            const wrong = wrongWords.includes(sentence.word);

            const playing = playingWord === sentence.word;

            /*
                الصور تدخل Tab فقط
                بعد اختيار sentence
              */

            const imageKeyboardActive =
              firstPoint?.side === "word" &&
              !targetLocked &&
              !showAnswer &&
              !checkCompleted;

            return (
              <div className="matching-row2" key={sentence.id}>
                {/* =================================================
                      LEFT - SENTENCE
                  ================================================= */}

                <div
                  className="word-with-dot2"
                  style={{
                    position: "relative",
                  }}
                >
                  <span className="span-num2">{sentence.number}</span>

                  {/* =========================
                        SENTENCE
                        Clickable + keyboard
                    ========================= */}

                  <span
                    ref={(el) => {
                      sentenceRefs.current[sentence.word] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      locked || showAnswer || checkCompleted
                        ? `Play audio: ${sentence.word}`
                        : `${sentence.word}. Press Enter or Space to start matching.`
                    }
                    className={`word-text2-wb-unit3-p5-q2 ${
                      selectedWord === sentence.word ? "selected-item" : ""
                    } ${locked || showAnswer ? "disabled-word" : ""}`}
                    onClick={() => handleSentenceClick(sentence)}
                    onKeyDown={(e) => handleSentenceKeyboard(e, sentence)}
                    style={{
                      position: "relative",

                      cursor: locked || showAnswer ? "default" : "pointer",
                    }}
                  >
                    {sentence.word}

                    {playing && (
                      <FaVolumeUp
                        size={16}
                        aria-hidden="true"
                        className="audio-icon-wb-u5-p2-q1"
                      />
                    )}
                  </span>

                  {wrong && (
                    <span
                      className="error-mark8-wb-unit2-p5-q1"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}

                  {/* =========================
                        LEFT DOT

                        مهم:
                        الدوت نفسه clickable
                        ونفس sentence behavior
                    ========================= */}

                  <div className="dot-wrapper2">
                    <div
                      ref={(el) => {
                        sentenceDotRefs.current[sentence.word] = el;
                      }}
                      className="dot2 start-dot2"
                      data-word={sentence.word}
                      onClick={() => handleSentenceClick(sentence)}
                      role="button"
                      tabIndex={-1}
                      aria-label={`Connect ${sentence.word}`}
                    />
                  </div>
                </div>

                {/* =================================================
                      RIGHT - IMAGE
                  ================================================= */}

                <div
                  className="img-with-dot2"
                  style={{
                    position: "relative",
                  }}
                >
                  {/* =========================
                        IMAGE DOT

                        الدوت نفسه clickable
                        ونفس image behavior
                    ========================= */}

                  <div className="dot-wrapper2">
                    <div
                      ref={(el) => {
                        imageDotRefs.current[image.id] = el;
                      }}
                      className="dot2 end-dot2"
                      data-image={image.id}
                      onClick={() => handleImageClick(image.id)}
                      role="button"
                      tabIndex={-1}
                      aria-label={`Connect to picture ${index + 1}`}
                    />
                  </div>

                  <div
                    style={{
                      width: "150px",
                    }}
                  >
                    {/* =========================
                          IMAGE

                          Click = نفس الدوت
                          Keyboard target = نفس الدوت
                      ========================= */}

                    <img
                      ref={(el) => {
                        imageRefs.current[image.id] = el;
                      }}
                      src={image.src}
                      alt={image.alt}
                      role="button"
                      tabIndex={imageKeyboardActive ? 0 : -1}
                      aria-label={`${image.alt} Press Enter or Space to connect to this picture.`}
                      className={`matched-img2 ${
                        selectedImage === image.id ? "selected-item" : ""
                      } ${targetLocked || showAnswer ? "disabled-hover" : ""}`}
                      onFocus={() => handleImageFocus(image.id)}
                      onClick={() => handleImageClick(image.id)}
                      onKeyDown={(e) => handleImageKeyboard(e, image.id)}
                      style={{
                        cursor:
                          targetLocked || showAnswer ? "default" : "pointer",

                        height: index === 0 ? "120px" : "110px",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* =================================================
              LINES
          ================================================= */}

          <svg className="lines-layer2">
            {lines.map((line, index) => (
              <line
                key={`${line.word}-${line.image}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}

            {/* =================================================
                KEYBOARD PREVIEW
            ================================================= */}

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
    </div>
  );
};

export default WB_Unit5_Page2_Q1;
