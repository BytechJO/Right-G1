import React, { useRef, useState } from "react";

import img1 from "../../../assets/unit6/imgs/U6P51EXEF-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P51EXEF-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P51EXEF-03.svg";

import climbAudio from "../../../assets/unit6/sounds/Page 51 - F/Can it climb a tree.mp3";
import flyAudio from "../../../assets/unit6/sounds/Page 51 - F/Can she fly a kite.mp3";
import rideAudio from "../../../assets/unit6/sounds/Page 51 - F/Can he ride a bike.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit6_Page6_Q3.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const WORDS = [
  {
    id: "climb",
    word: "Can it climb a tree? Yes, it can.",
    line1: "Can it climb a tree?",
    line2: "Yes, it can.",
    audio: climbAudio,
    number: 1,
  },
  {
    id: "fly",
    word: "Can she fly a kite? Yes, she can.",
    line1: "Can she fly a kite?",
    line2: "Yes, she can.",
    audio: flyAudio,
    number: 2,
  },
  {
    id: "ride",
    word: "Can he ride a bike? Yes, he can.",
    line1: "Can he ride a bike?",
    line2: "Yes, he can.",
    audio: rideAudio,
    number: 3,
  },
];

const IMAGES = [
  {
    id: "img1",
    src: img1,
    alt: "A girl flying a colorful kite outdoors.",
  },
  {
    id: "img2",
    src: img2,
    alt: "A boy riding a bicycle.",
  },
  {
    id: "img3",
    src: img3,
    alt: "An animal climbing a tree trunk.",
  },
];

const CORRECT_MATCHES = [
  {
    word: "Can it climb a tree? Yes, it can.",
    image: "img3",
  },
  {
    word: "Can she fly a kite? Yes, she can.",
    image: "img1",
  },
  {
    word: "Can he ride a bike? Yes, he can.",
    image: "img2",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Unit6_Page6_Q3 = () => {
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
     MATCH STATE
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
     KEYBOARD MODE
  ================================================= */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

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
    const pair = CORRECT_MATCHES.find((item) => item.image === imageId);

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
    IMAGES.map((item) => item.id).filter((imageId) => !isImageLocked(imageId));

  const getAvailableWords = () =>
    WORDS.map((item) => item.word).filter((word) => !isWordLocked(word));

  const clearWrongWord = (word) => {
    setWrongWords((prev) => prev.filter((item) => item !== word));
  };

  /* =================================================
     FOCUS NEXT SOURCE
  ================================================= */

  const focusNextAvailableWord = (currentWord) => {
    const available = getAvailableWords().filter(
      (word) => word !== currentWord,
    );

    if (!available.length) return;

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

    /* one-to-one */

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== image),
      newLine,
    ]);

    clearWrongWord(word);

    setFirstPoint(null);
    setPreviewLine(null);

    setSelectedWord(null);
    setSelectedImage(null);

    setKeyboardMatching(false);

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

    setKeyboardMatching(false);
  };

  /* =================================================
     WORD CLICK
     sentence + word dot = same action
  ================================================= */

  const handleWordClick = (item) => {
    const { word, audio } = item;

    /*
      audio always works
    */

    playAudio(word, audio);

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    /*
      mouse mode
    */

    setKeyboardMatching(false);
    setPreviewLine(null);

    /*
      if started from image:
      connect image -> word
    */

    if (firstPoint?.side === "image") {
      commitConnection({
        word,
        image: firstPoint.image,
      });

      return;
    }

    /*
      otherwise start from word
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

    playAudio(word, audio);

    /*
      locked correct:
      audio only
    */

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    setKeyboardMatching(true);

    startFromWord(item);

    window.setTimeout(() => {
      const available = getAvailableImages();

      if (!available.length) return;

      imageRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     IMAGE FOCUS
     PREVIEW ONLY WITH KEYBOARD
  ================================================= */

  const handleImageFocus = (imageId) => {
    if (!keyboardMatching || !firstPoint || firstPoint.side !== "word") {
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
     IMAGE / IMAGE DOT CLICK
     both do same matching action
  ================================================= */

  const handleImageClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    /*
      mouse mode
    */

    setKeyboardMatching(false);
    setPreviewLine(null);

    /*
      word selected above:
      connect immediately
    */

    if (firstPoint?.side === "word") {
      commitConnection({
        word: firstPoint.word,
        image: imageId,
      });

      return;
    }

    /*
      if nothing selected:
      start from image
    */

    if (!firstPoint) {
      startFromImage(imageId);
      return;
    }

    /*
      if another image was selected:
      switch source image
    */

    if (firstPoint?.side === "image") {
      startFromImage(imageId);
    }
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

      setKeyboardMatching(false);

      window.setTimeout(() => {
        wordRefs.current[originalWord]?.focus();
      }, 0);

      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (keyboardMatching && firstPoint?.side === "word" && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableImages();

      if (!available.length) return;

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

    if (!keyboardMatching || firstPoint?.side !== "word") {
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

    if (lines.length < CORRECT_MATCHES.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];
    const correct = [];

    lines.forEach((line) => {
      const isCorrect = CORRECT_MATCHES.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;

        correct.push(line.word);
      } else {
        wrong.push(line.word);
      }
    });

    /* progressive locking */

    setLockedWords((prev) => Array.from(new Set([...prev, ...correct])));

    setWrongWords(wrong);

    setFirstPoint(null);
    setPreviewLine(null);

    setSelectedWord(null);
    setSelectedImage(null);

    setKeyboardMatching(false);

    const total = CORRECT_MATCHES.length;

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
      setLockedWords(CORRECT_MATCHES.map((item) => item.word));

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
    const finalLines = CORRECT_MATCHES.map((pair) => {
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

    setLockedWords(CORRECT_MATCHES.map((item) => item.word));

    setShowAnswer(true);
    setCheckCompleted(true);

    setFirstPoint(null);
    setPreviewLine(null);

    setSelectedWord(null);
    setSelectedImage(null);

    setKeyboardMatching(false);
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

    setKeyboardMatching(false);
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
          gap: "30px",
          justifyContent: "flex-start",
        }}
      >
        <ExerciseHeader
          sectionLetter="F"
          title="Read, look, and match."
          subTitle="Read each Can you...? exchange, then connect it to the matching picture."
        />

        {/* =================================================
            MATCHING AREA
        ================================================= */}

        <div
          className="match-wrapper2"
          ref={containerRef}
          style={{
            position: "relative",
          }}
        >
          {/* =================================================
              WORDS
          ================================================= */}

          <div className="match-words-row2">
            {WORDS.map((item) => {
              const locked = isWordLocked(item.word);

              const wrong = wrongWords.includes(item.word);

              const playing = playingWord === item.word;

              return (
                <div className="word-box2" key={item.id}>
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    {/* =====================================
                        SENTENCE
                    ===================================== */}

                    <h5
                      ref={(el) => {
                        wordRefs.current[item.word] = el;
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        locked || showAnswer || checkCompleted
                          ? `Play audio: ${item.line1}`
                          : `${item.line1} ${item.line2}. Press Enter or Space to start matching.`
                      }
                      className={`clickable-word-unit2-p7-q2 text-[18px] ${
                        selectedWord === item.word ? "selected-item" : ""
                      } ${locked || showAnswer ? "disabled-hover" : ""}`}
                      onClick={() => handleWordClick(item)}
                      onKeyDown={(e) => handleWordKeyDown(e, item)}
                      style={{
                        position: "relative",
                        cursor: "pointer",
                        pointerEvents: "auto",
                      }}
                    >
                      <span
                        style={{
                          color: "darkblue",
                          fontWeight: "700",
                        }}
                      >
                        {item.number}
                      </span>{" "}
                      {item.line1}
                      <br />
                      {item.line2}
                      {playing && (
                        <FaVolumeUp
                          size={15}
                          aria-hidden="true"
                          className="audio-icon-unit6-p6-q3"
                        />
                      )}
                    </h5>

                    {wrong && (
                      <span className="error-mark-img" aria-hidden="true">
                        ✕
                      </span>
                    )}
                  </div>

                  {/* =====================================
                      WORD DOT
                      SAME ACTION AS SENTENCE
                  ===================================== */}

                  <div
                    ref={(el) => {
                      wordDotRefs.current[item.word] = el;
                    }}
                    className="dot22-unit6-q7 start-dot22-unit6-q7"
                    onClick={() => handleWordClick(item)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              IMAGES
          ================================================= */}

          <div className="match-images-row2">
            {IMAGES.map((item) => {
              const locked = isImageLocked(item.id);

              /*
                Tab target only during keyboard matching.
                Mouse still works anytime through onClick.
              */

              const targetActive =
                keyboardMatching &&
                firstPoint?.side === "word" &&
                !locked &&
                !showAnswer &&
                !checkCompleted;

              return (
                <div className="img-box2" key={item.id}>
                  {/* =====================================
                      IMAGE DOT
                      SAME ACTION AS IMAGE
                  ===================================== */}

                  <div
                    ref={(el) => {
                      imageDotRefs.current[item.id] = el;
                    }}
                    className="dot22-unit6-q7 end-dot22-unit6-q7"
                    onClick={() => handleImageClick(item.id)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                  />

                  {/* =====================================
                      IMAGE
                      SAME ACTION AS DOT
                  ===================================== */}

                  <img
                    ref={(el) => {
                      imageRefs.current[item.id] = el;
                    }}
                    src={item.src}
                    alt={item.alt}
                    role="button"
                    tabIndex={targetActive ? 0 : -1}
                    aria-label={`${item.alt} Press Enter or Space to connect this picture.`}
                    className={`img-box2-unit6-p6-q3 ${
                      selectedImage === item.id ? "selected-item" : ""
                    } ${locked || showAnswer ? "disabled-hover" : ""}`}
                    onFocus={() => handleImageFocus(item.id)}
                    onClick={() => handleImageClick(item.id)}
                    onKeyDown={(e) => handleImageKeyDown(e, item.id)}
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                  />
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

            {/* =============================================
                KEYBOARD PREVIEW ONLY
            ============================================= */}

            {keyboardMatching && previewLine && (
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

export default Unit6_Page6_Q3;
