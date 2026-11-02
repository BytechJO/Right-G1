import React, { useRef, useState } from "react";

import img1 from "../../../assets/unit6/imgs/U6P50EXEA2-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P50EXEA2-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P50EXEA2-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P50EXEA2-04.svg";

import hillAudio from "../../../assets/unit6/sounds/Page 50 - A 2/hill.mp3";
import mittAudio from "../../../assets/unit6/sounds/Page 50 - A 2/mitt.mp3";
import pinAudio from "../../../assets/unit6/sounds/Page 50 - A 2/pin.mp3";
import wigAudio from "../../../assets/unit6/sounds/Page 50 - A 2/wig.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page5_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const words = [
  {
    word: "hill",
    num: 1,
    audio: hillAudio,
  },
  {
    word: "pin",
    num: 2,
    audio: pinAudio,
  },
  {
    word: "mitt",
    num: 3,
    audio: mittAudio,
  },
  {
    word: "wig",
    num: 4,
    audio: wigAudio,
  },
];

const images = [
  {
    id: "img1",
    src: img1,
    alt: "A baseball mitt.",
  },
  {
    id: "img2",
    src: img2,
    alt: "A brown wig.",
  },
  {
    id: "img3",
    src: img3,
    alt: "A green push pin.",
  },
  {
    id: "img4",
    src: img4,
    alt: "A green hill with mountains in the background.",
  },
];

const correctMatches = [
  {
    word: "hill",
    image: "img4",
  },
  {
    word: "pin",
    image: "img3",
  },
  {
    word: "mitt",
    image: "img1",
  },
  {
    word: "wig",
    image: "img2",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Unit6_Page5_Q2 = () => {
  /* =================================================
     REFS
  ================================================= */

  const containerRef = useRef(null);

  const wordRefs = useRef({});
  const imageRefs = useRef({});

  const wordDotRefs = useRef({});
  const imageDotRefs = useRef({});

  const audioRef = useRef(null);

  /* =================================================
     MATCHING STATE
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
     AUDIO STATE
  ================================================= */

  const [playingWord, setPlayingWord] = useState(null);

  /* =================================================
     AUDIO
  ================================================= */

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

  const getCenter = (element) => {
    if (!element || !containerRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const rect = element.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,

      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  const getAvailableImages = () =>
    images.map((item) => item.id).filter((imageId) => !isImageLocked(imageId));

  const getAvailableWords = () =>
    words.map((item) => item.word).filter((word) => !isWordLocked(word));

  /* =================================================
     CLEAR WRONG
  ================================================= */

  const clearWrongForWord = (word) => {
    setWrongWords((prev) => prev.filter((item) => item !== word));
  };

  /* =================================================
     RETURN FOCUS TO TOP
  ================================================= */

  const focusNextAvailableWord = (currentWord) => {
    const available = getAvailableWords().filter(
      (word) => word !== currentWord,
    );

    if (!available.length) {
      return;
    }

    window.setTimeout(() => {
      wordRefs.current[available[0]]?.focus();
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
      IMPORTANT:
      line from dot → dot
    */

    const start = getCenter(wordDotRefs.current[word]);

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

    if (returnFocus) {
      focusNextAvailableWord(word);
    }
  };

  /* =================================================
     START FROM WORD
  ================================================= */

  const startFromWord = (item) => {
    const { word } = item;

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

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
     START FROM IMAGE - MOUSE REVERSE
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
     WORD CLICK
     word + dot = SAME ACTION
  ================================================= */

  const handleWordClick = (item) => {
    const { word, audio } = item;

    /*
      Audio always works
      even after correct/locked
    */

    playAudio(word, audio);

    /*
      Locked = audio only
    */

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    /*
      If mouse started from image
      complete connection
    */

    if (firstPoint?.side === "image") {
      commitConnection({
        word,
        image: firstPoint.image,
      });

      return;
    }

    /*
      Otherwise choose source word
    */

    startFromWord(item);
  };

  /* =================================================
     WORD KEYBOARD
  ================================================= */

  const handleWordKeyDown = (e, item) => {
    const { word, audio } = item;

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      Audio always
    */

    playAudio(word, audio);

    /*
      Correct/locked word:
      AUDIO ONLY
    */

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    startFromWord(item);

    /*
      Move focus to first unlocked image
    */

    window.setTimeout(() => {
      const available = getAvailableImages();

      if (!available.length) {
        return;
      }

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
     IMAGE CLICK
     image + dot = SAME ACTION
  ================================================= */

  const handleImageClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    /*
      Word already selected → connect now
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
      start from image
    */

    startFromImage(imageId);
  };

  /* =================================================
     IMAGE KEYBOARD
  ================================================= */

  const handleImageKeyDown = (e, imageId) => {
    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape" && firstPoint?.side === "word") {
      e.preventDefault();
      e.stopPropagation();

      const originalWord = firstPoint.word;

      setFirstPoint(null);

      setPreviewLine(null);

      setSelectedWord(null);

      setSelectedImage(null);

      window.setTimeout(() => {
        wordRefs.current[originalWord]?.focus();
      }, 0);

      return;
    }

    /* =========================================
       TAB / SHIFT TAB
       only unlocked images
    ========================================= */

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

    /* =========================================
       ENTER / SPACE
    ========================================= */

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
      Correct connections lock
    */

    setLockedWords((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /*
      Wrong remain editable
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
    const finalLines = correctMatches.map((pair) => {
      const start = getCenter(wordDotRefs.current[pair.word]);

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
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          justifyContent: "flex-start",
        }}
      >
        <ExerciseHeader
          questionNumber="2"
          title="Read, look, and match."
          subTitle="Match hill, pin, mitt, and wig to the correct pictures."
        />

        {/* =================================================
            MATCHING AREA
        ================================================= */}

        <div
          ref={containerRef}
          className="match-wrapper-unit6-p5-q2"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "150px",
            width: "100%",
          }}
        >
          {/* =================================================
              TOP ROW - WORDS
          ================================================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              paddingBottom: "8px",
            }}
          >
            {words.map((item) => {
              const locked = isWordLocked(item.word);

              const wrong = wrongWords.includes(item.word);

              const playing = playingWord === item.word;

              return (
                <div
                  key={item.word}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    gap: "6px",
                  }}
                >
                  {/* NUMBER */}

                  <span
                    style={{
                      color: "darkblue",
                      fontWeight: "700",
                      fontSize: "13px",
                    }}
                  >
                    {item.num}
                  </span>

                  {/* WORD */}

                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <h5
                      ref={(el) => {
                        wordRefs.current[item.word] = el;
                      }}
                      role="button"
                      /*
                        IMPORTANT:
                        always tabbable because
                        correct word can replay audio
                      */
                      tabIndex={0}
                      aria-label={
                        locked || showAnswer || checkCompleted
                          ? `Play audio: ${item.word}`
                          : `${item.word}. Press Enter or Space to start matching.`
                      }
                      className={`h5-unit6-p5-q2-1 ${
                        selectedWord === item.word ? "selected-item" : ""
                      } ${locked || showAnswer ? "disabled-hover" : ""}`}
                      onClick={() => handleWordClick(item)}
                      onKeyDown={(e) => handleWordKeyDown(e, item)}
                      style={{
                        margin: 0,
                        position: "relative",

                        /*
                          keep mouse audio
                          after locked
                        */
                        cursor: "pointer",

                        pointerEvents: "auto",
                      }}
                    >
                      {item.word}

                      {playing && (
                        <FaVolumeUp
                          size={15}
                          aria-hidden="true"
                          className="audio-icon-unit6-p5-q2"
                        />
                      )}
                    </h5>

                    {wrong && (
                      <span
                        className="error-mark-img-unit6-p5-q2"
                        aria-hidden="true"
                      >
                        ✕
                      </span>
                    )}
                  </div>

                  {/* WORD DOT */}

                  <div
                    ref={(el) => {
                      wordDotRefs.current[item.word] = el;
                    }}
                    className="dot22-unit6-q2 start-dot22-unit6-q2"
                    data-word={item.word}
                    /*
                      Dot does same as word
                      with mouse.
                    */
                    onClick={() => handleWordClick(item)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      cursor: locked ? "default" : "pointer",

                      outline:
                        selectedWord === item.word
                          ? "2px solid orange"
                          : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              SVG LINES
          ================================================= */}

          <svg
            className="lines-layer2"
            style={{
              position: "absolute",
              top: 0,
              left: 0,

              width: "100%",
              height: "100%",

              pointerEvents: "none",

              zIndex: 1,
            }}
          >
            {lines.map((line, index) => (
              <line
                key={`${line.word}-${line.image}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
                strokeLinecap="round"
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
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            )}
          </svg>

          {/* =================================================
              BOTTOM ROW - IMAGES
          ================================================= */}

          <div
            style={{
              display: "flex",

              justifyContent: "space-around",

              alignItems: "flex-start",

              paddingTop: "8px",
            }}
          >
            {images.map((item) => {
              const locked = isImageLocked(item.id);

              /*
                  Target becomes tabbable
                  only during keyboard matching.
                */

              const canKeyboardTarget =
                firstPoint?.side === "word" &&
                !locked &&
                !showAnswer &&
                !checkCompleted;

              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    gap: "6px",
                  }}
                >
                  {/* IMAGE DOT */}

                  <div
                    ref={(el) => {
                      imageDotRefs.current[item.id] = el;
                    }}
                    className="dot22-unit6-q2 end-dot22-unit6-q2"
                    data-image={item.id}
                    onClick={() => handleImageClick(item.id)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                  />

                  {/* IMAGE */}

                  <img
                    ref={(el) => {
                      imageRefs.current[item.id] = el;
                    }}
                    src={item.src}
                    alt={item.alt}
                    role="button"
                    tabIndex={canKeyboardTarget ? 0 : -1}
                    aria-label={`${item.alt} Press Enter or Space to connect this picture.`}
                    className={`matched-img2 ${
                      selectedImage === item.id ? "selected-item" : ""
                    } ${locked || showAnswer ? "disabled-hover" : ""}`}
                    onFocus={() => handleImageFocus(item.id)}
                    onClick={() => handleImageClick(item.id)}
                    onKeyDown={(e) => handleImageKeyDown(e, item.id)}
                    style={{
                      height: "100px",
                      width: "auto",

                      cursor: locked ? "default" : "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>
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

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page5_Q2;
