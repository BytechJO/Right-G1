import React, { useRef, useState } from "react";

import { FaVolumeUp } from "react-icons/fa";

import img1 from "../../../assets/U1 WB/U3/SVG/U3P17EXEF-01.svg";
import img2 from "../../../assets/U1 WB/U3/SVG/U3P17EXEF-02.svg";
import img3 from "../../../assets/U1 WB/U3/SVG/U3P17EXEF-03.svg";
import img4 from "../../../assets/U1 WB/U3/SVG/U3P17EXEF-04.svg";
import img5 from "../../../assets/U1 WB/U3/SVG/U3P17EXEF-05.svg";

import sound1 from "../../../assets/U1 WB/U3/page_18/Item_001_six_chairs.mp3";
import sound2 from "../../../assets/U1 WB/U3/page_18/Item_002_five_desks.mp3";
import sound3 from "../../../assets/U1 WB/U3/page_18/Item_003_two_balls.mp3";
import sound4 from "../../../assets/U1 WB/U3/page_18/Item_004_four_forks.mp3";
import sound5 from "../../../assets/U1 WB/U3/page_18/Item_005_nine_birds.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit3_Page3_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const wordItems = [
  {
    word: "six chairs",
    dotId: "climb-dot",
    audio: sound1,
  },
  {
    word: "five desks",
    dotId: "fly-dot",
    audio: sound2,
  },
  {
    word: "two balls",
    dotId: "ride-dot",
    audio: sound3,
  },
  {
    word: "four forks",
    dotId: "forks-dot",
    audio: sound4,
  },
  {
    word: "nine birds",
    dotId: "birds-dot",
    audio: sound5,
  },
];

const imageItems = [
  {
    key: "img1",
    src: img1,
    alt: "Two colorful balls.",
  },
  {
    key: "img2",
    src: img2,
    alt: "Nine birds.",
  },
  {
    key: "img3",
    src: img3,
    alt: "Six chairs.",
  },
  {
    key: "img4",
    src: img4,
    alt: "Five desks.",
  },
  {
    key: "img5",
    src: img5,
    alt: "Four forks.",
  },
];

const correctMatches = [
  {
    word: "six chairs",
    image: "img3",
  },
  {
    word: "five desks",
    image: "img4",
  },
  {
    word: "two balls",
    image: "img1",
  },
  {
    word: "four forks",
    image: "img5",
  },
  {
    word: "nine birds",
    image: "img2",
  },
];

/* =====================================================
   MAIN
===================================================== */

const WB_Unit3_Page3_Q2 = () => {
  /* =====================================================
     REFS
  ===================================================== */

  const containerRef = useRef(null);

  const wordDotRefs = useRef({});
  const imageDotRefs = useRef({});
  const wordButtonRefs = useRef({});

  const audioRef = useRef(null);

  /* =====================================================
     STATE
  ===================================================== */

  const [lines, setLines] = useState([]);

  /* Mouse selection */
  const [mouseSelection, setMouseSelection] = useState(null);

  /* Keyboard selection: فقط من الجملة */
  const [keyboardSelectedWord, setKeyboardSelectedWord] = useState(null);

  const [keyboardTargetImage, setKeyboardTargetImage] = useState(null);

  const [keyboardPreviewLine, setKeyboardPreviewLine] = useState(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedMatches, setLockedMatches] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* AUDIO */

  const [playingWord, setPlayingWord] = useState(null);

  /* SCREEN READER */

  const [keyboardMessage, setKeyboardMessage] = useState("");

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

  const playWordAudio = (word) => {
    const item = wordItems.find((item) => item.word === word);

    if (!item?.audio) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      setPlayingWord(null);
    });

    audio.onended = () => {
      setPlayingWord(null);
    };

    audio.onerror = () => {
      setPlayingWord(null);
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
     PREVIEW LINE - KEYBOARD ONLY
  ===================================================== */

  const updateKeyboardPreview = (word, image) => {
    const startEl = wordDotRefs.current[word];
    const endEl = imageDotRefs.current[image];

    if (!startEl || !endEl) {
      setKeyboardPreviewLine(null);
      return;
    }

    const start = getDotPosition(startEl);
    const end = getDotPosition(endEl);

    setKeyboardPreviewLine({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
    });

    setKeyboardTargetImage(image);
  };

  /* =====================================================
     CONNECT PAIR
     one-to-one + replace old connection
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

    setWrongWords((prev) =>
      prev.filter(
        (wrongWord) =>
          wrongWord !== word && !replacedWrongWords.includes(wrongWord),
      ),
    );

    /* Clear mouse */
    setMouseSelection(null);

    /* Clear keyboard */
    setKeyboardSelectedWord(null);
    setKeyboardTargetImage(null);
    setKeyboardPreviewLine(null);

    setKeyboardMessage(`${word} connected.`);

    if (keyboardMode) {
      requestAnimationFrame(() => {
        focusNextWord(word);
      });
    }
  };

  /* =====================================================
     MOUSE
     يسمح من:
     - الجملة
     - نقطة الجملة
     - الصورة
     - نقطة الصورة
     ومن أي جهة
  ===================================================== */

  const handleMouseSelect = (side, value) => {
    if (showAnswer || checkCompleted) return;

    const locked = side === "word" ? isWordLocked(value) : isImageLocked(value);

    if (locked) return;

    /* Mouse يلغي keyboard mode */

    setKeyboardSelectedWord(null);
    setKeyboardTargetImage(null);
    setKeyboardPreviewLine(null);

    /* أول عنصر */

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

    /* نفس الجهة = بدّل بداية التوصيل */

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

    /* الصوت عند Enter */
    playWordAudio(word);

    /* Mouse cancel */
    setMouseSelection(null);

    setKeyboardSelectedWord(word);

    const availableImages = getAvailableImages();

    if (!availableImages.length) {
      return;
    }

    const firstImage = availableImages[0];

    setKeyboardMessage(
      `${word} selected. Choose a picture and press Enter or Space.`,
    );

    requestAnimationFrame(() => {
      updateKeyboardPreview(word, firstImage);

      imageDotRefs.current[firstImage]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD IMAGE NAVIGATION
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
     IMAGE DOT KEYBOARD
     فقط target بالكيبورد
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

    /* TAB فقط بين نقاط الصور */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      moveKeyboardImage(image, e.shiftKey);

      return;
    }

    /* ENTER / SPACE = connect */

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

      setKeyboardMessage("Matching cancelled.");

      requestAnimationFrame(() => {
        wordButtonRefs.current[word]?.focus();
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
        wordButtonRefs.current[candidate]?.focus();
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

    /* lock only correct */

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

    setKeyboardMessage("Correct answers are displayed.");
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingWord(null);

    setLines([]);

    setWrongWords([]);

    setLockedMatches([]);

    setMouseSelection(null);

    setKeyboardSelectedWord(null);
    setKeyboardTargetImage(null);
    setKeyboardPreviewLine(null);

    setShowAnswer(false);
    setCheckCompleted(false);

    setKeyboardMessage("");
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
      {/* =================================================
          SCREEN READER
      ================================================= */}

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
        {keyboardMessage}
      </div>

      <div
        className="div-forall"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="F"
          title="Read, count, and match."
          subTitle="Count each group and connect it to the correct number phrase."
        />

        <div className="match-wrapper2" ref={containerRef}>
          {/* =================================================
              WORDS
          ================================================= */}

          <div className="match-words-row2">
            {wordItems.map((item) => {
              const locked = isWordLocked(item.word);

              const mouseSelected =
                mouseSelection?.side === "word" &&
                mouseSelection?.value === item.word;

              const keyboardSelected = keyboardSelectedWord === item.word;

              const isPlaying = playingWord === item.word;

              return (
                <div className="word-box2" key={item.word}>
                  {/* =========================================
                      WORD / AUDIO / KEYBOARD START
                  ========================================= */}

                  <h5
                    ref={(el) => {
                      wordButtonRefs.current[item.word] = el;
                    }}
                    className={`h5-wb-unit3-p3-q2 ${
                      mouseSelected || keyboardSelected ? "selected-item" : ""
                    } ${locked || showAnswer ? "disabled-word" : ""}`}
                    role="button"
                    tabIndex={locked || showAnswer || checkCompleted ? -1 : 0}
                    aria-disabled={locked || showAnswer || checkCompleted}
                    aria-pressed={keyboardSelected}
                    aria-label={
                      locked
                        ? `${item.word}. Correct match locked.`
                        : `${item.word}. Press Enter or Space to hear and start matching.`
                    }
                    onClick={() => {
                      if (locked || showAnswer || checkCompleted) {
                        return;
                      }

                      /*
                        Mouse:
                        صوت + بداية/تكملة التوصيل من الجملة
                      */
                      playWordAudio(item.word);

                      handleMouseSelect("word", item.word);
                    }}
                    onKeyDown={(e) => {
                      if (locked || showAnswer || checkCompleted) {
                        return;
                      }

                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();

                        /*
                          Keyboard:
                          صوت + يمسك العنصر
                        */
                        startKeyboardMatch(item.word);
                      }
                    }}
                  >
                    {item.word}

                    {isPlaying && (
                      <FaVolumeUp
                        aria-hidden="true"
                        style={{
                          marginLeft: "7px",
                          color: "#2563eb",
                          fontSize: "15px",
                        }}
                      />
                    )}

                    {wrongWords.includes(item.word) && (
                      <span className="error-mark-img">✕</span>
                    )}
                  </h5>

                  {/* =========================================
                      WORD DOT
                      Mouse فقط
                  ========================================= */}

                  <div
                    ref={(el) => {
                      wordDotRefs.current[item.word] = el;
                    }}
                    className="dot22-unit6-q7 start-dot22-review8-p1-q3"
                    data-word={item.word}
                    id={item.dotId}
                    aria-hidden="true"
                    onClick={() => {
                      if (locked || showAnswer || checkCompleted) {
                        return;
                      }

                      handleMouseSelect("word", item.word);
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
            {imageItems.map((item) => {
              const locked = isImageLocked(item.key);

              const mouseSelected =
                mouseSelection?.side === "image" &&
                mouseSelection?.value === item.key;

              const keyboardTarget =
                keyboardSelectedWord && keyboardTargetImage === item.key;

              return (
                <div className="img-box2" key={item.key}>
                  {/* =========================================
                      IMAGE
                      Mouse عادي
                  ========================================= */}

                  <img
                    src={item.src}
                    alt={item.alt}
                    className={`img-box2-unit6-p6-q3 ${
                      locked || showAnswer ? "disabled-hover" : ""
                    }`}
                    onClick={() => {
                      if (locked || showAnswer || checkCompleted) {
                        return;
                      }

                      handleMouseSelect("image", item.key);
                    }}
                  />

                  {/* =========================================
                      IMAGE DOT
                      Mouse + Keyboard target
                  ========================================= */}

                  <div
                    ref={(el) => {
                      imageDotRefs.current[item.key] = el;
                    }}
                    className={`dot22-unit6-q7 end-dot22-unit6-q7 ${
                      keyboardTarget ? "keyboard-preview-dot-wb-u3-p3-q2" : ""
                    } ${mouseSelected ? "selected-item" : ""}`}
                    data-image={item.key}
                    id={`${item.key}-dot`}
                    role={keyboardSelectedWord ? "button" : undefined}
                    tabIndex={
                      keyboardSelectedWord &&
                      !locked &&
                      !showAnswer &&
                      !checkCompleted
                        ? 0
                        : -1
                    }
                    aria-disabled={locked || showAnswer || checkCompleted}
                    aria-label={
                      keyboardSelectedWord
                        ? `${item.alt} Press Enter or Space to connect.`
                        : undefined
                    }
                    onClick={() => {
                      if (locked || showAnswer || checkCompleted) {
                        return;
                      }

                      /*
                        Mouse:
                        يبدأ أو يكمل التوصيل من الصورة
                      */
                      handleMouseSelect("image", item.key);
                    }}
                    onFocus={() => {
                      if (keyboardSelectedWord) {
                        updateKeyboardPreview(keyboardSelectedWord, item.key);
                      }
                    }}
                    onKeyDown={(e) => handleImageDotKeyDown(e, item.key)}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              REAL LINES
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

            {/* =============================================
                KEYBOARD PREVIEW ONLY
                خط متقطع
            ============================================= */}

            {keyboardSelectedWord && keyboardPreviewLine && (
              <line
                x1={keyboardPreviewLine.x1}
                y1={keyboardPreviewLine.y1}
                x2={keyboardPreviewLine.x2}
                y2={keyboardPreviewLine.y2}
                className="keyboard-preview-line-wb-u3-p3-q2"
              />
            )}
          </svg>
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={handleReset} className="try-again-button">
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

export default WB_Unit3_Page3_Q2;
