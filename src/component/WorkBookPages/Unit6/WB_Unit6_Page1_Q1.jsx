import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit6_Page1_Q1.css";

import table from "../../../assets/U1 WB/U6/U6P33EXEA-01.svg";
import dish from "../../../assets/U1 WB/U6/U6P33EXEA-02.svg";
import tiger from "../../../assets/U1 WB/U6/U6P33EXEA-03.svg";
import duck from "../../../assets/U1 WB/U6/U6P33EXEA-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import flyKiteAudio from "../../../assets/U1 WB/U6/audio/page 33 - A/Item_001_I_can_fly_a_kite.mp3";

import sailBoatAudio from "../../../assets/U1 WB/U6/audio/page 33 - A/Item_002_He_can't_sail_a_boat.mp3";

import climbTreeAudio from "../../../assets/U1 WB/U6/audio/page 33 - A/Item_003_It_can't_climb_a_tree.mp3";

import paintAudio1 from "../../../assets/U1 WB/U6/audio/page 33 - A/Item_004_He_can_paint_a.mp3";

import paintAudio2 from "../../../assets/U1 WB/U6/audio/page 33 - A/Item_005_picture.mp3";

/* =====================================================
   DATA
===================================================== */

const WORDS = [
  {
    id: 1,
    word: "I can fly a kite.",
    audio: [flyKiteAudio],
  },

  {
    id: 2,
    word: "He can’t sail a boat.",
    audio: [sailBoatAudio],
  },

  {
    id: 3,
    word: "It can’t climb a tree.",
    audio: [climbTreeAudio],
  },

  {
    id: 4,
    word: "He can paint a picture.",
    audio: [paintAudio1, paintAudio2],
  },
];

const IMAGES = [
  {
    key: "img1",
    src: table,
    alt: "A dog standing beside a large tree.",
  },

  {
    key: "img2",
    src: dish,
    alt: "A man painting a picture on an easel outdoors.",
  },

  {
    key: "img3",
    src: tiger,
    alt: "A man sitting in a sailboat on the water.",
  },

  {
    key: "img4",
    src: duck,
    alt: "A child flying a kite near some trees.",
  },
];

const correctMatches = [
  {
    word: "I can fly a kite.",
    image: "img4",
  },

  {
    word: "He can’t sail a boat.",
    image: "img3",
  },

  {
    word: "It can’t climb a tree.",
    image: "img1",
  },

  {
    word: "He can paint a picture.",
    image: "img2",
  },
];

/* =====================================================
   GET CENTER
===================================================== */

const getCenter = (el, container) => {
  if (!el || !container) {
    return null;
  }

  const elementRect = el.getBoundingClientRect();

  const containerRect = container.getBoundingClientRect();

  return {
    x: elementRect.left - containerRect.left + elementRect.width / 2,

    y: elementRect.top - containerRect.top + elementRect.height / 2,
  };
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit6_Page1_Q1 = () => {
  /* =================================================
     CONNECTIONS
  ================================================= */

  const [lines, setLines] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  /* =================================================
     PROGRESSIVE LOCKING
  ================================================= */

  const [lockedWords, setLockedWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  /* =================================================
     SELECTION
  ================================================= */

  const [firstPoint, setFirstPoint] = useState(null);

  const [selectedLeftWord, setSelectedLeftWord] = useState(null);

  const [selectedRightWord, setSelectedRightWord] = useState(null);

  /* =================================================
     FINAL STATES
  ================================================= */

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     REFS
  ================================================= */

  const containerRef = useRef(null);

  const dotRefs = useRef({});

  const wordRefs = useRef({});

  const imageRefs = useRef([]);

  const registerDot = (key, el) => {
    if (el) {
      dotRefs.current[key] = el;
    }
  };

  /* =================================================
     KEYBOARD MATCHING
  ================================================= */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  const [previewLine, setPreviewLine] = useState(null);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

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

  /* =================================================
     PLAY AUDIO SEQUENCE
  ================================================= */

  const playAudioSequence = (word, sources) => {
    if (!sources || !sources.length) {
      return;
    }

    stopAudio();

    setPlayingWord(word);

    let index = 0;

    const playNext = () => {
      if (index >= sources.length) {
        audioRef.current = null;

        setPlayingWord(null);

        return;
      }

      const audio = new Audio(sources[index]);

      audioRef.current = audio;

      audio.play().catch(() => {
        audioRef.current = null;

        setPlayingWord(null);
      });

      audio.onended = () => {
        index++;

        playNext();
      };

      audio.onerror = () => {
        audioRef.current = null;

        setPlayingWord(null);
      };
    };

    playNext();
  };

  /* =================================================
     HELPERS
  ================================================= */

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (image) => lockedImages.includes(image);

  const wordToImage = Object.fromEntries(
    lines.map((line) => [line.word, line.image]),
  );

  const imageToWord = Object.fromEntries(
    lines.map((line) => [line.image, line.word]),
  );

  const isCorrectMatch = (word, image) =>
    correctMatches.some((item) => item.word === word && item.image === image);

  const getAvailableImageIndexes = () =>
    IMAGES.map((_, index) => index).filter(
      (index) => !isImageLocked(IMAGES[index].key),
    );

  /* =================================================
     CLEAR SELECTION
  ================================================= */

  const clearSelection = () => {
    setFirstPoint(null);

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    setKeyboardMatching(false);

    setPreviewLine(null);
  };

  /* =================================================
     PREVIEW
  ================================================= */

  const updatePreviewLine = (startPoint, imageKey) => {
    if (!startPoint || !containerRef.current) {
      return;
    }

    const target = dotRefs.current[`image-${imageKey}`];

    if (!target) {
      return;
    }

    const end = getCenter(target, containerRef.current);

    if (!end) {
      return;
    }

    setPreviewLine({
      x1: startPoint.x,

      y1: startPoint.y,

      x2: end.x,

      y2: end.y,
    });
  };

  /* =================================================
     COMMIT CONNECTION
     ONE TO ONE
  ================================================= */

  const commitConnection = (word, image) => {
    if (
      !word ||
      !image ||
      showAnswer ||
      checkCompleted ||
      isWordLocked(word) ||
      isImageLocked(image)
    ) {
      return;
    }

    const displaced = lines.find((line) => line.image === image);

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== image),

      {
        word,
        image,
      },
    ]);

    /* شيل X بس عن العنصر المتغير */

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== displaced?.word),
    );

    setSelectedLeftWord(word);

    setSelectedRightWord(image);

    setFirstPoint(null);

    setKeyboardMatching(false);

    setPreviewLine(null);

    window.setTimeout(() => {
      setSelectedLeftWord(null);

      setSelectedRightWord(null);
    }, 250);
  };

  /* =================================================
     MOUSE WORD
  ================================================= */

  const handleWordClick = (word) => {
    setKeyboardMatching(false);

    setPreviewLine(null);

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    const dot = dotRefs.current[`word-${word}`];

    if (!dot || !containerRef.current) {
      return;
    }

    const pos = getCenter(dot, containerRef.current);

    if (!pos) {
      return;
    }

    /* ===============================================
       FIRST POINT
    =============================================== */

    if (!firstPoint) {
      /*
        إذا كان عليه خط غلط قديم
        بنشيله حتى يقدر يعيد التوصيل.
      */

      setLines((prev) =>
        prev.filter((line) => line.word !== word || isWordLocked(line.word)),
      );

      setWrongWords((prev) => prev.filter((item) => item !== word));

      setFirstPoint({
        type: "word",

        word,

        x: pos.x,

        y: pos.y,
      });

      setSelectedLeftWord(word);

      setSelectedRightWord(null);

      return;
    }

    /* ===============================================
       IMAGE → WORD
    =============================================== */

    if (firstPoint.type === "image") {
      commitConnection(word, firstPoint.image);

      return;
    }

    /* ===============================================
       WORD → WORD
       change source
    =============================================== */

    setFirstPoint({
      type: "word",

      word,

      x: pos.x,

      y: pos.y,
    });

    setSelectedLeftWord(word);

    setSelectedRightWord(null);
  };

  /* =================================================
     MOUSE IMAGE
  ================================================= */

  const handleImageClick = (imageKey) => {
    setKeyboardMatching(false);

    setPreviewLine(null);

    if (showAnswer || checkCompleted || isImageLocked(imageKey)) {
      return;
    }

    const dot = dotRefs.current[`image-${imageKey}`];

    if (!dot || !containerRef.current) {
      return;
    }

    const pos = getCenter(dot, containerRef.current);

    if (!pos) {
      return;
    }

    /* ===============================================
       FIRST POINT IMAGE
    =============================================== */

    if (!firstPoint) {
      const oldLine = lines.find((line) => line.image === imageKey);

      setLines((prev) =>
        prev.filter(
          (line) => line.image !== imageKey || isImageLocked(line.image),
        ),
      );

      if (oldLine) {
        setWrongWords((prev) => prev.filter((item) => item !== oldLine.word));
      }

      setFirstPoint({
        type: "image",

        image: imageKey,

        x: pos.x,

        y: pos.y,
      });

      setSelectedRightWord(imageKey);

      setSelectedLeftWord(null);

      return;
    }

    /* ===============================================
       WORD → IMAGE
    =============================================== */

    if (firstPoint.type === "word") {
      commitConnection(firstPoint.word, imageKey);

      return;
    }

    /* ===============================================
       IMAGE → IMAGE
    =============================================== */

    setFirstPoint({
      type: "image",

      image: imageKey,

      x: pos.x,

      y: pos.y,
    });

    setSelectedRightWord(imageKey);

    setSelectedLeftWord(null);
  };

  /* =================================================
     KEYBOARD START
  ================================================= */

  const startKeyboardMatch = (word) => {
    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    const dot = dotRefs.current[`word-${word}`];

    if (!dot || !containerRef.current) {
      return;
    }

    const pos = getCenter(dot, containerRef.current);

    if (!pos) {
      return;
    }

    /*
      لو عليه خط غلط قديم
      نشيله.
    */

    setLines((prev) =>
      prev.filter((line) => line.word !== word || isWordLocked(line.word)),
    );

    setWrongWords((prev) => prev.filter((item) => item !== word));

    const startPoint = {
      type: "word",

      word,

      x: pos.x,

      y: pos.y,
    };

    setFirstPoint(startPoint);

    setSelectedLeftWord(word);

    setSelectedRightWord(null);

    setKeyboardMatching(true);

    requestAnimationFrame(() => {
      const available = getAvailableImageIndexes();

      if (!available.length) {
        return;
      }

      const firstIndex = available[0];

      imageRefs.current[firstIndex]?.focus();

      updatePreviewLine(startPoint, IMAGES[firstIndex].key);
    });
  };

  /* =================================================
     KEYBOARD TARGET
  ================================================= */

  const handleImageKeyDown = (e, index, imageKey) => {
    if (!keyboardMatching || !firstPoint || firstPoint.type !== "word") {
      return;
    }

    if (showAnswer || checkCompleted || isImageLocked(imageKey)) {
      return;
    }

    /* ===============================================
       TAB / SHIFT TAB
    =============================================== */

    if (e.key === "Tab") {
      e.preventDefault();

      e.stopPropagation();

      const available = getAvailableImageIndexes();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(index);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const targetIndex = available[nextIndex];

      imageRefs.current[targetIndex]?.focus();

      updatePreviewLine(firstPoint, IMAGES[targetIndex].key);

      return;
    }

    /* ===============================================
       ENTER / SPACE
    =============================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      const sourceWord = firstPoint.word;

      commitConnection(sourceWord, imageKey);

      window.setTimeout(() => {
        const nextWord = WORDS.find(
          (item) => item.word !== sourceWord && !isWordLocked(item.word),
        )?.word;

        if (nextWord) {
          wordRefs.current[nextWord]?.focus();
        } else {
          wordRefs.current[sourceWord]?.focus();
        }
      }, 0);

      return;
    }

    /* ===============================================
       ESCAPE
    =============================================== */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      const sourceWord = firstPoint.word;

      clearSelection();

      requestAnimationFrame(() => {
        wordRefs.current[sourceWord]?.focus();
      });
    }
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

    const newlyLockedWords = [];

    const newlyLockedImages = [];

    lines.forEach((line) => {
      const correct = isCorrectMatch(line.word, line.image);

      if (correct) {
        correctCount++;

        newlyLockedWords.push(line.word);

        newlyLockedImages.push(line.image);
      } else {
        wrong.push(line.word);
      }
    });

    /* ===============================================
       PROGRESSIVE LOCK
    =============================================== */

    setLockedWords((prev) =>
      Array.from(new Set([...prev, ...newlyLockedWords])),
    );

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newlyLockedImages])),
    );

    setWrongWords(wrong);

    clearSelection();

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        margin-top:10px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedWords(correctMatches.map((item) => item.word));

      setLockedImages(correctMatches.map((item) => item.image));

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

  const showAnswers = () => {
    stopAudio();

    setLines(
      correctMatches.map((item) => ({
        ...item,
      })),
    );

    setWrongWords([]);

    setLockedWords(correctMatches.map((item) => item.word));

    setLockedImages(correctMatches.map((item) => item.image));

    setShowAnswer(true);

    setCheckCompleted(true);

    clearSelection();
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setLines([]);

    setWrongWords([]);

    setLockedWords([]);

    setLockedImages([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    clearSelection();
  };

  /* =================================================
     SVG LINES
  ================================================= */

  const [svgLines, setSvgLines] = useState([]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const computed = lines
      .map((line) => {
        const source = dotRefs.current[`word-${line.word}`];

        const target = dotRefs.current[`image-${line.image}`];

        if (!source || !target) {
          return null;
        }

        const p1 = getCenter(source, containerRef.current);

        const p2 = getCenter(target, containerRef.current);

        if (!p1 || !p2) {
          return null;
        }

        return {
          ...line,

          x1: p1.x,

          y1: p1.y,

          x2: p2.x,

          y2: p2.y,
        };
      })
      .filter(Boolean);

    setSvgLines(computed);
  }, [lines, wrongWords, lockedWords, lockedImages]);

  /* =================================================
     RESIZE
  ================================================= */

  useEffect(() => {
    const handleResize = () => {
      setLines((prev) => [...prev]);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          title="Read and match."
          subTitle="Read each ability sentence and connect it to the matching picture."
        />

        <div
          className="container12 w-full"
          ref={containerRef}
          style={{
            position: "relative",
          }}
        >
          {WORDS.map((sentence, index) => {
            const image = IMAGES[index];

            const wordLocked = isWordLocked(sentence.word);

            const imageLocked = isImageLocked(image.key);

            const isWrong = wrongWords.includes(sentence.word);

            const isPlaying = playingWord === sentence.word;

            const targetActive =
              keyboardMatching && firstPoint?.type === "word";

            return (
              <div className="matching-row2" key={sentence.word}>
                {/* ==========================================
                      LEFT SENTENCE
                  ========================================== */}

                <div className="word-with-dot2">
                  <span className="span-num2">{sentence.id}</span>

                  <span
                    ref={(el) => {
                      wordRefs.current[sentence.word] = el;
                    }}
                    className={`word-text2-wb-unit3-p5-q2 ${
                      selectedLeftWord === sentence.word ? "selected-item" : ""
                    }${wordLocked || showAnswer ? "disabled-word" : ""}`}
                    role="button"
                    /*
                        حتى بعد lock:
                        يضل بالـTab للصوت.
                      */

                    tabIndex={0}
                    aria-label={
                      wordLocked || showAnswer || checkCompleted
                        ? `Play audio: ${sentence.word}`
                        : `${sentence.word} Press Enter or Space to hear the sentence and start matching.`
                    }
                    onClick={() => {
                      playAudioSequence(sentence.word, sentence.audio);

                      if (!wordLocked && !showAnswer && !checkCompleted) {
                        handleWordClick(sentence.word);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        e.stopPropagation();

                        playAudioSequence(sentence.word, sentence.audio);

                        if (!wordLocked && !showAnswer && !checkCompleted) {
                          startKeyboardMatch(sentence.word);
                        }
                      }
                    }}
                    style={{
                      cursor: "pointer",

                      position: "relative",
                    }}
                  >
                    {sentence.word}

                    {isPlaying && (
                      <FaVolumeUp
                        size={15}
                        aria-hidden="true"
                        style={{
                          position: "absolute",

                          right: "-22px",

                          top: "0%",

                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </span>

                  {isWrong && (
                    <span
                      className="error-mark8-wb-unit2-p5-q1"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}

                  <div className="dot-wrapper2">
                    <div
                      ref={(el) => registerDot(`word-${sentence.word}`, el)}
                      className={`dot2 start-dot2 ${
                        selectedLeftWord === sentence.word ? "dot-active" : ""
                      }`}
                      data-word={sentence.word}
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => {
                        if (!wordLocked && !showAnswer && !checkCompleted) {
                          handleWordClick(sentence.word);
                        }
                      }}
                      style={{
                        cursor:
                          wordLocked || showAnswer || checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                    />
                  </div>
                </div>

                {/* ==========================================
                      RIGHT IMAGE
                  ========================================== */}

                <div className="img-with-dot2">
                  <div className="dot-wrapper2">
                    <div
                      ref={(el) => registerDot(`image-${image.key}`, el)}
                      className={`dot2 end-dot2 ${
                        selectedRightWord === image.key ? "dot-active" : ""
                      }`}
                      data-image={image.key}
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => {
                        if (!imageLocked && !showAnswer && !checkCompleted) {
                          handleImageClick(image.key);
                        }
                      }}
                      style={{
                        cursor:
                          imageLocked || showAnswer || checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      width: "150px",
                    }}
                  >
                    <img
                      ref={(el) => {
                        imageRefs.current[index] = el;
                      }}
                      src={image.src}
                      className={`matched-img2 ${
                        selectedRightWord === image.key ? "selected-item" : ""
                      } ${imageLocked || showAnswer ? "disabled-hover" : ""}`}
                      alt={image.alt}
                      role={targetActive && !imageLocked ? "button" : undefined}
                      tabIndex={
                        targetActive &&
                        !imageLocked &&
                        !showAnswer &&
                        !checkCompleted
                          ? 0
                          : -1
                      }
                      aria-label={
                        targetActive && !imageLocked
                          ? `${image.alt} Press Enter or Space to connect this picture.`
                          : image.alt
                      }
                      onClick={() => {
                        if (!imageLocked && !showAnswer && !checkCompleted) {
                          handleImageClick(image.key);
                        }
                      }}
                      onFocus={() => {
                        if (
                          keyboardMatching &&
                          firstPoint?.type === "word" &&
                          !imageLocked
                        ) {
                          updatePreviewLine(firstPoint, image.key);
                        }
                      }}
                      onKeyDown={(e) => handleImageKeyDown(e, index, image.key)}
                      style={{
                        cursor:
                          imageLocked || showAnswer || checkCompleted
                            ? "default"
                            : "pointer",

                        height: "100px",
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

          <svg
            className="lines-layer2"
            aria-hidden="true"
            style={{
              pointerEvents: "none",
            }}
          >
            {svgLines.map((line, index) => (
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

            {/* ===============================================
                KEYBOARD PREVIEW ONLY
            =============================================== */}

            {keyboardMatching && previewLine && (
              <line
                x1={previewLine.x1}
                y1={previewLine.y1}
                x2={previewLine.x2}
                y2={previewLine.y2}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
                strokeLinecap="round"
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
            onClick={showAnswers}
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

export default WB_Unit6_Page1_Q1;
