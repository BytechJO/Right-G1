import React, { useRef, useState } from "react";
import "./WB_Unit3_Page5_Q2.css";

import table from "../../../assets/U1 WB/U3/SVG/U3P19EXEJ-01.svg";
import dish from "../../../assets/U1 WB/U3/SVG/U3P19EXEJ-02.svg";
import tiger from "../../../assets/U1 WB/U3/SVG/U3P19EXEJ-03.svg";
import duck from "../../../assets/U1 WB/U3/SVG/U3P19EXEJ-04.svg";

import quietAudio from "../../../assets/U1 WB/U3/page_19/Item_001_Quiet!.mp3";
import openBookAudio from "../../../assets/U1 WB/U3/page_19/Item_002_Open_your_book.mp3";
import closeBookAudio from "../../../assets/U1 WB/U3/page_19/Item_003_Close_your_book.mp3";
import takePencilAudio from "../../../assets/U1 WB/U3/page_19/Item_004_Take_out_your_pencil.mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const wordItems = [
  {
    word: "Quiet!",
    number: 1,
    audio: quietAudio,
  },
  {
    word: "Open your book.",
    number: 2,
    audio: openBookAudio,
  },
  {
    word: "Close your book.",
    number: 3,
    audio: closeBookAudio,
  },
  {
    word: "Take out your pencil.",
    number: 4,
    audio: takePencilAudio,
  },
];

const imageItems = [
  {
    key: "img1",
    src: table,
    alt: "A boy taking out a pencil from his pencil case.",
  },
  {
    key: "img2",
    src: dish,
    alt: "A teacher asking students to be quiet.",
  },
  {
    key: "img3",
    src: duck,
    alt: "A boy opening his book at his desk.",
  },
  {
    key: "img4",
    src: tiger,
    alt: "A boy closing his book at his desk.",
  },
];

const correctMatches = [
  {
    word: "Quiet!",
    image: "img2",
  },
  {
    word: "Open your book.",
    image: "img3",
  },
  {
    word: "Close your book.",
    image: "img4",
  },
  {
    word: "Take out your pencil.",
    image: "img1",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit3_Page5_Q2 = () => {
  /* =====================================================
     REFS
  ===================================================== */

  const containerRef = useRef(null);

  const wordDotRefs = useRef({});
  const imageDotRefs = useRef({});
  const wordRefs = useRef({});

  const audioRef = useRef(null);

  /* =====================================================
     STATE
  ===================================================== */

  const [lines, setLines] = useState([]);

  /* Mouse selection */
  const [mouseSelection, setMouseSelection] = useState(null);

  /* Keyboard */
  const [keyboardSelectedWord, setKeyboardSelectedWord] = useState(null);
  const [keyboardTargetImage, setKeyboardTargetImage] = useState(null);
  const [keyboardPreviewLine, setKeyboardPreviewLine] = useState(null);

  /* Check */
  const [wrongWords, setWrongWords] = useState([]);
  const [lockedMatches, setLockedMatches] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);

  /* Audio */
  const [playingWord, setPlayingWord] = useState(null);

  /* Accessibility */
  const [announcement, setAnnouncement] = useState("");

  /* =====================================================
     HELPERS
  ===================================================== */

  const isWordLocked = (word) =>
    lockedMatches.some((match) => match.word === word);

  const isImageLocked = (image) =>
    lockedMatches.some((match) => match.image === image);

  const getAvailableImages = () =>
    imageItems.map((item) => item.key).filter((image) => !isImageLocked(image));

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingWord(null);
  };

  const playWordAudio = (word) => {
    const item = wordItems.find((item) => item.word === word);

    if (!item?.audio) return;

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      setPlayingWord(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    });

    audio.onended = () => {
      setPlayingWord(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };

    audio.onerror = () => {
      setPlayingWord(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  };

  /* =====================================================
     DOT POSITION
  ===================================================== */

  const getDotPosition = (element) => {
    if (!element || !containerRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const dotRect = element.getBoundingClientRect();

    return {
      x: dotRect.left - containerRect.left + dotRect.width / 2,

      y: dotRect.top - containerRect.top + dotRect.height / 2,
    };
  };

  /* =====================================================
     KEYBOARD PREVIEW
  ===================================================== */

  const updateKeyboardPreview = (word, image) => {
    const wordElement = wordDotRefs.current[word];
    const imageElement = imageDotRefs.current[image];

    if (!wordElement || !imageElement) {
      setKeyboardPreviewLine(null);
      return;
    }

    const start = getDotPosition(wordElement);
    const end = getDotPosition(imageElement);

    setKeyboardPreviewLine({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
    });

    setKeyboardTargetImage(image);
  };

  /* =====================================================
     CONNECT
     one-to-one + replace old
  ===================================================== */

  const connectPair = (word, image, keyboardMode = false) => {
    if (
      showAnswer ||
      checkCompleted ||
      isWordLocked(word) ||
      isImageLocked(image)
    ) {
      return;
    }

    const wordElement = wordDotRefs.current[word];
    const imageElement = imageDotRefs.current[image];

    if (!wordElement || !imageElement) return;

    const start = getDotPosition(wordElement);
    const end = getDotPosition(imageElement);

    const replacedLines = lines.filter(
      (line) => line.word === word || line.image === image,
    );

    const replacedWrongWords = replacedLines.map((line) => line.word);

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== word && line.image !== image,
      );

      return [
        ...filtered,
        {
          word,
          image,
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
        },
      ];
    });

    /* شيل X عن التوصيل اللي تم تعديله */

    setWrongWords((prev) =>
      prev.filter(
        (wrongWord) =>
          wrongWord !== word && !replacedWrongWords.includes(wrongWord),
      ),
    );

    setMouseSelection(null);

    setKeyboardSelectedWord(null);
    setKeyboardTargetImage(null);
    setKeyboardPreviewLine(null);

    setAnnouncement(`${word} connected.`);

    if (keyboardMode) {
      requestAnimationFrame(() => {
        focusNextWord(word);
      });
    }
  };

  /* =====================================================
     MOUSE
     يبدأ من أي جهة
  ===================================================== */

  const handleMouseSelect = (side, value) => {
    if (showAnswer || checkCompleted) return;

    const locked = side === "word" ? isWordLocked(value) : isImageLocked(value);

    if (locked) return;

    /* Mouse يلغي keyboard mode */

    setKeyboardSelectedWord(null);
    setKeyboardTargetImage(null);
    setKeyboardPreviewLine(null);

    if (!mouseSelection) {
      setMouseSelection({
        side,
        value,
      });

      return;
    }

    /* نفس العنصر = cancel */

    if (mouseSelection.side === side && mouseSelection.value === value) {
      setMouseSelection(null);
      return;
    }

    /* نفس الجهة = بدّل البداية */

    if (mouseSelection.side === side) {
      setMouseSelection({
        side,
        value,
      });

      return;
    }

    const word = side === "word" ? value : mouseSelection.value;

    const image = side === "image" ? value : mouseSelection.value;

    connectPair(word, image, false);
  };

  /* =====================================================
     KEYBOARD START
     فقط من الجملة
  ===================================================== */

  const startKeyboardMatch = (word) => {
    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    /* Enter يشغل الصوت + يمسك الجملة */

    playWordAudio(word);

    setMouseSelection(null);

    setKeyboardSelectedWord(word);

    const availableImages = getAvailableImages();

    if (!availableImages.length) return;

    const firstImage = availableImages[0];

    setAnnouncement(
      `${word} selected. Choose a picture and press Enter or Space.`,
    );

    requestAnimationFrame(() => {
      updateKeyboardPreview(word, firstImage);

      imageDotRefs.current[firstImage]?.focus();
    });
  };

  /* =====================================================
     TAB BETWEEN IMAGE TARGETS
  ===================================================== */

  const moveKeyboardImage = (currentImage, backwards = false) => {
    if (!keyboardSelectedWord) return;

    const availableImages = getAvailableImages();

    if (!availableImages.length) return;

    const currentIndex = availableImages.indexOf(currentImage);

    let nextIndex;

    if (backwards) {
      nextIndex =
        currentIndex <= 0 ? availableImages.length - 1 : currentIndex - 1;
    } else {
      nextIndex =
        currentIndex === -1 || currentIndex === availableImages.length - 1
          ? 0
          : currentIndex + 1;
    }

    const nextImage = availableImages[nextIndex];

    updateKeyboardPreview(keyboardSelectedWord, nextImage);

    imageDotRefs.current[nextImage]?.focus();
  };

  /* =====================================================
     IMAGE TARGET KEYBOARD
  ===================================================== */

  const handleImageDotKeyDown = (e, image) => {
    if (
      showAnswer ||
      checkCompleted ||
      isImageLocked(image) ||
      !keyboardSelectedWord
    ) {
      return;
    }

    /* TAB */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      moveKeyboardImage(image, e.shiftKey);

      return;
    }

    /* ENTER / SPACE */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      const word = keyboardSelectedWord;

      connectPair(word, image, true);

      return;
    }

    /* ESCAPE */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const word = keyboardSelectedWord;

      setKeyboardSelectedWord(null);
      setKeyboardTargetImage(null);
      setKeyboardPreviewLine(null);

      setAnnouncement("Matching cancelled.");

      requestAnimationFrame(() => {
        wordRefs.current[word]?.focus();
      });
    }
  };

  /* =====================================================
     FOCUS NEXT WORD
  ===================================================== */

  const focusNextWord = (currentWord) => {
    const values = wordItems.map((item) => item.word);

    const start = values.indexOf(currentWord);

    for (let step = 1; step <= values.length; step++) {
      const candidate = values[(start + step) % values.length];

      if (!isWordLocked(candidate)) {
        wordRefs.current[candidate]?.focus();
        return;
      }
    }
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers2 = () => {
    if (showAnswer || checkCompleted) return;

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

        newlyLocked.push({
          word: line.word,
          image: line.image,
        });
      } else {
        wrong.push(line.word);
      }
    });

    /* اقفل الصح فقط */

    setLockedMatches((prev) => {
      const combined = [...prev, ...newlyLocked];

      return combined.filter(
        (item, index, array) =>
          array.findIndex(
            (other) => other.word === item.word && other.image === item.image,
          ) === index,
      );
    });

    setWrongWords(wrong);

    setMouseSelection(null);

    setKeyboardSelectedWord(null);
    setKeyboardTargetImage(null);
    setKeyboardPreviewLine(null);

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedMatches(correctMatches);

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const finalLines = correctMatches.map((match) => {
      const start = getDotPosition(wordDotRefs.current[match.word]);

      const end = getDotPosition(imageDotRefs.current[match.image]);

      return {
        ...match,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongWords([]);

    setLockedMatches(correctMatches);

    setShowAnswer(true);
    setCheckCompleted(true);

    setMouseSelection(null);

    setKeyboardSelectedWord(null);
    setKeyboardTargetImage(null);
    setKeyboardPreviewLine(null);

    setAnnouncement("Correct answers are displayed.");
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    stopAudio();

    setLines([]);

    setWrongWords([]);

    setLockedMatches([]);

    setMouseSelection(null);

    setKeyboardSelectedWord(null);
    setKeyboardTargetImage(null);
    setKeyboardPreviewLine(null);

    setShowAnswer(false);
    setCheckCompleted(false);

    setAnnouncement("");
  };

  /* =====================================================
     RENDER
  ===================================================== */

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
      {/* Screen Reader */}

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
          border: 0,
        }}
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
          sectionLetter="J"
          title="Read, look, and match."
          subTitle="Connect each classroom command to its matching picture."
        />
        <div className="container12 w-full" ref={containerRef}>
          {/* =================================================
              WORDS + IMAGES
          ================================================= */}

          {wordItems.map((wordItem, index) => {
            const imageItem = imageItems[index];

            const wordLocked = isWordLocked(wordItem.word);
            const imageLocked = isImageLocked(imageItem.key);

            const wordMouseSelected =
              mouseSelection?.side === "word" &&
              mouseSelection?.value === wordItem.word;

            const imageMouseSelected =
              mouseSelection?.side === "image" &&
              mouseSelection?.value === imageItem.key;

            const keyboardWordSelected = keyboardSelectedWord === wordItem.word;

            const keyboardImageTarget =
              keyboardSelectedWord && keyboardTargetImage === imageItem.key;

            const playing = playingWord === wordItem.word;

            return (
              <div key={wordItem.word} className="matching-row2" style={{ marginBottom: "0px" }}>
                {/* =========================================
                    WORD SIDE
                ========================================= */}

                <div className="word-with-dot2">
                  <span className="span-num2">{wordItem.number}</span>

                  <span
                    ref={(el) => {
                      wordRefs.current[wordItem.word] = el;
                    }}
                    className={`word-text2-wb-unit3-p5-q2 ${
                      wordMouseSelected || keyboardWordSelected
                        ? "selected-item"
                        : ""
                    } ${wordLocked || showAnswer ? "disabled-word" : ""}`}
                    role="button"
                    tabIndex={
                      wordLocked || showAnswer || checkCompleted ? -1 : 0
                    }
                    aria-disabled={wordLocked || showAnswer || checkCompleted}
                    aria-pressed={keyboardWordSelected}
                    aria-label={`${wordItem.word}. Press Enter or Space to hear and start matching.`}
                    onClick={() => {
                      if (wordLocked || showAnswer || checkCompleted) {
                        return;
                      }

                      /* Mouse:
                         صوت + توصيل
                      */

                      playWordAudio(wordItem.word);

                      handleMouseSelect("word", wordItem.word);
                    }}
                    onKeyDown={(e) => {
                      if (wordLocked || showAnswer || checkCompleted) {
                        return;
                      }

                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();

                        startKeyboardMatch(wordItem.word);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {wordItem.word}

                    {playing && (
                      <FaVolumeUp
                        aria-hidden="true"
                        style={{
                          marginLeft: "7px",
                          color: "#2563eb",
                          fontSize: "15px",
                        }}
                      />
                    )}
                  </span>

                  {wrongWords.includes(wordItem.word) && (
                    <span className="error-mark8-wb-unit2-p5-q1">✕</span>
                  )}

                  <div className="dot-wrapper2">
                    <div
                      ref={(el) => {
                        wordDotRefs.current[wordItem.word] = el;
                      }}
                      className="dot2 start-dot2"
                      data-word={wordItem.word}
                      /* Mouse only */
                      aria-hidden="true"
                      onClick={() => {
                        if (wordLocked || showAnswer || checkCompleted) {
                          return;
                        }

                        handleMouseSelect("word", wordItem.word);
                      }}
                    />
                  </div>
                </div>

                {/* =========================================
                    IMAGE SIDE
                ========================================= */}

                <div className="img-with-dot2">
                  <div className="dot-wrapper2">
                    <div
                      ref={(el) => {
                        imageDotRefs.current[imageItem.key] = el;
                      }}
                      className={`dot2 end-dot2 ${
                        keyboardImageTarget
                          ? "keyboard-preview-dot-wb-u3-p5-q2"
                          : ""
                      } ${imageMouseSelected ? "selected-item" : ""}`}
                      data-image={imageItem.key}
                      role={keyboardSelectedWord ? "button" : undefined}
                      tabIndex={
                        keyboardSelectedWord &&
                        !imageLocked &&
                        !showAnswer &&
                        !checkCompleted
                          ? 0
                          : -1
                      }
                      aria-label={
                        keyboardSelectedWord
                          ? `${imageItem.alt}. Press Enter or Space to connect.`
                          : undefined
                      }
                      onClick={() => {
                        if (imageLocked || showAnswer || checkCompleted) {
                          return;
                        }

                        handleMouseSelect("image", imageItem.key);
                      }}
                      onFocus={() => {
                        if (keyboardSelectedWord) {
                          updateKeyboardPreview(
                            keyboardSelectedWord,
                            imageItem.key,
                          );
                        }
                      }}
                      onKeyDown={(e) => handleImageDotKeyDown(e, imageItem.key)}
                    />
                  </div>

                  <div
                    style={{
                      width: "150px",
                    }}
                  >
                    <img
                      src={imageItem.src}
                      alt={imageItem.alt}
                      className={`matched-img2 ${
                        imageLocked || showAnswer ? "disabled-hover" : ""
                      }`}
                      onClick={() => {
                        if (imageLocked || showAnswer || checkCompleted) {
                          return;
                        }

                        handleMouseSelect("image", imageItem.key);
                      }}
                      style={{
                        cursor: "pointer",
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

          <svg className="lines-layer2" aria-hidden="true">
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

            {/* Keyboard preview dashed line */}

            {keyboardSelectedWord && keyboardPreviewLine && (
              <line
                x1={keyboardPreviewLine.x1}
                y1={keyboardPreviewLine.y1}
                x2={keyboardPreviewLine.x2}
                y2={keyboardPreviewLine.y2}
                className="keyboard-preview-line-wb-u3-p5-q2"
              />
            )}
          </svg>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={handleReset}>
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={handleShowAnswer}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers2}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit3_Page5_Q2;
