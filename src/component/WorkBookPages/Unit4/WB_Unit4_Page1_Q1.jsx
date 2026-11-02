import React, { useRef, useState } from "react";

import boy from "../../../assets/U1 WB/U4/U4P21EXEA-01.svg";
import bird from "../../../assets/U1 WB/U4/U4P21EXEA-02.svg";
import pizza2 from "../../../assets/U1 WB/U4/U4P21EXEA-03.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

import "./WB_Unit4_Page1_Q1.css";

/* =====================================================
   AUDIO
===================================================== */

import circleAudio from "../../../assets/U1 WB/U4/audio/page_21_qa/Item_001_It's_a_circle.mp3";
import squareAudio from "../../../assets/U1 WB/U4/audio/page_21_qa/Item_002_It's_a_square.mp3";
import whatShapeAudio from "../../../assets/U1 WB/U4/audio/page_21_qa/Item_003_What_shape_is_it.mp3";
import triangleAudio from "../../../assets/U1 WB/U4/audio/page_21_qa/Item_004_It's_a_triangle.mp3";

/* =====================================================
   DATA
===================================================== */

const rows = [
  {
    image: "img1",

    src: bird,

    alt: "A child standing behind a large triangle.",

    question: "What shape is it?",

    questionAudio: whatShapeAudio,

    word: "It’s a circle.",

    wordAudio: circleAudio,

    imageDotId: "dot-img1",

    wordDotId: "dot-circle",
  },

  {
    image: "img2",

    src: boy,

    alt: "A child standing behind a large circle.",

    question: "What shape is it?",

    questionAudio: whatShapeAudio,

    word: "It’s a square.",

    wordAudio: squareAudio,

    imageDotId: "dot-img2",

    wordDotId: "dot-square",
  },

  {
    image: "img3",

    src: pizza2,

    alt: "A child holding a large square.",

    question: "What shape is it?",

    questionAudio: whatShapeAudio,

    word: "It’s a triangle.",

    wordAudio: triangleAudio,

    imageDotId: "dot-img3",

    wordDotId: "dot-triangle",
  },
];

const correctMatches = [
  {
    word: "It’s a circle.",
    image: "img1",
  },

  {
    word: "It’s a square.",
    image: "img3",
  },

  {
    word: "It’s a triangle.",
    image: "img2",
  },
];

/* =====================================================
   MAIN
===================================================== */

const WB_Unit4_Page1_Q1 = () => {
  /* =====================================================
     STATE
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [previewLine, setPreviewLine] = useState(null);

  const [firstDot, setFirstDot] = useState(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [lockedWords, setLockedWords] = useState([]);

  const [selectedLeftWord, setSelectedLeftWord] = useState(null);

  const [selectedRightWord, setSelectedRightWord] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     REFS
  ===================================================== */

  const containerRef = useRef(null);

  /*
    هسا الـref على جملة اليسار
    مش على الصورة
  */

  const sourceRefs = useRef({});

  const wordRefs = useRef({});

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const isImageLocked = (image) => lockedImages.includes(image);

  const isWordLocked = (word) => lockedWords.includes(word);

  const isCorrectMatch = (image, word) =>
    correctMatches.some((pair) => pair.image === image && pair.word === word);

  const getElementCenter = (element) => {
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

  const clearSelection = () => {
    setFirstDot(null);

    setPreviewLine(null);

    setSelectedLeftWord(null);

    setSelectedRightWord(null);
  };

  const getAvailableWordIndexes = () =>
    rows
      .map((row, index) => ({
        index,
        word: row.word,
      }))
      .filter(({ word }) => !isWordLocked(word))
      .map(({ index }) => index);

  /* =====================================================
     CONNECTION
     ONE TO ONE
  ===================================================== */

  const commitConnection = (image, word) => {
    if (
      !image ||
      !word ||
      showAnswer ||
      checkCompleted ||
      isImageLocked(image) ||
      isWordLocked(word)
    ) {
      return;
    }

    const imageRow = rows.find((row) => row.image === image);

    const wordRow = rows.find((row) => row.word === word);

    if (!imageRow || !wordRow) {
      return;
    }

    const imageDot = document.getElementById(imageRow.imageDotId);

    const wordDot = document.getElementById(wordRow.wordDotId);

    const start = getElementCenter(imageDot);

    const end = getElementCenter(wordDot);

    if (!start || !end) {
      return;
    }

    const displacedLine = lines.find((line) => line.word === word);

    const newLine = {
      x1: start.x,

      y1: start.y,

      x2: end.x,

      y2: end.y,

      image,

      word,
    };

    /*
      ONE TO ONE
    */

    setLines((prev) => [
      ...prev.filter((line) => line.image !== image && line.word !== word),

      newLine,
    ]);

    /*
      شيل X فقط عن التوصيل المتغير
    */

    setWrongWords((prev) =>
      prev.filter(
        (wrongWord) => wrongWord !== word && wrongWord !== displacedLine?.word,
      ),
    );

    setSelectedLeftWord(image);

    setSelectedRightWord(word);

    setFirstDot(null);

    setPreviewLine(null);

    window.setTimeout(() => {
      setSelectedLeftWord(null);

      setSelectedRightWord(null);
    }, 250);
  };

  /* =====================================================
     KEYBOARD START
     المصدر = جملة What shape is it?
  ===================================================== */

  const startKeyboardMatch = (image) => {
    if (showAnswer || checkCompleted || isImageLocked(image)) {
      return;
    }

    const row = rows.find((item) => item.image === image);

    if (!row) return;

    const startDot = document.getElementById(row.imageDotId);

    const start = getElementCenter(startDot);

    if (!start) return;

    /*
      لو في خط غلط قديم
      من نفس المصدر شيله
    */

    const oldLine = lines.find((line) => line.image === image);

    setLines((prev) =>
      prev.filter((line) => line.image !== image || isImageLocked(line.image)),
    );

    if (oldLine) {
      setWrongWords((prev) => prev.filter((word) => word !== oldLine.word));
    }

    const startPoint = {
      type: "image",

      image,

      x: start.x,

      y: start.y,
    };

    setFirstDot(startPoint);

    setSelectedLeftWord(image);

    setSelectedRightWord(null);

    requestAnimationFrame(() => {
      const available = getAvailableWordIndexes();

      if (!available.length) {
        return;
      }

      const firstIndex = available[0];

      const firstWord = rows[firstIndex].word;

      wordRefs.current[firstWord]?.focus();

      updatePreviewLine(startPoint, firstWord);
    });
  };

  /* =====================================================
     SOURCE ACTION
     جملة اليسار:
     صوت + توصيل
  ===================================================== */

  const handleSourceAction = (image, audio) => {
    playAudio(`question-${image}`, audio);

    startKeyboardMatch(image);
  };

  /* =====================================================
     PREVIEW
  ===================================================== */

  const updatePreviewLine = (startPoint, word) => {
    if (!startPoint) return;

    const row = rows.find((item) => item.word === word);

    if (!row) return;

    const endDot = document.getElementById(row.wordDotId);

    const end = getElementCenter(endDot);

    if (!end) return;

    setPreviewLine({
      x1: startPoint.x,

      y1: startPoint.y,

      x2: end.x,

      y2: end.y,
    });
  };

  /* =====================================================
     TARGET KEYBOARD
  ===================================================== */

  const handleWordKeyboard = (e, rowIndex, word, audio) => {
    if (
      !firstDot ||
      firstDot.type !== "image" ||
      isWordLocked(word) ||
      showAnswer ||
      checkCompleted
    ) {
      return;
    }

    /* =========================
       TAB / SHIFT TAB
    ========================= */

    if (e.key === "Tab") {
      e.preventDefault();

      e.stopPropagation();

      const available = getAvailableWordIndexes();

      if (!available.length) {
        return;
      }

      const currentPosition = available.indexOf(rowIndex);

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

      const nextWord = rows[nextIndex].word;

      wordRefs.current[nextWord]?.focus();

      updatePreviewLine(firstDot, nextWord);

      return;
    }

    /* =========================
       ENTER / SPACE
       صوت + تثبيت
    ========================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      playAudio(`answer-${word}`, audio);

      const sourceImage = firstDot.image;

      commitConnection(sourceImage, word);

      window.setTimeout(() => {
        const nextImage = rows.find(
          (row) => !isImageLocked(row.image) && row.image !== sourceImage,
        )?.image;

        if (nextImage) {
          sourceRefs.current[nextImage]?.focus();
        }
      }, 0);

      return;
    }

    /* =========================
       ESCAPE
    ========================= */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      const sourceImage = firstDot.image;

      clearSelection();

      requestAnimationFrame(() => {
        sourceRefs.current[sourceImage]?.focus();
      });
    }
  };

  /* =====================================================
     MOUSE MATCHING
     من الجهتين
  ===================================================== */

  const handleDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const image = e.currentTarget.dataset.image || null;

    const word = e.currentTarget.dataset.word || null;

    if (image && isImageLocked(image)) {
      return;
    }

    if (word && isWordLocked(word)) {
      return;
    }

    const point = getElementCenter(e.currentTarget);

    if (!point) return;

    /* =========================
       FIRST CLICK
    ========================= */

    if (!firstDot) {
      setLines((prev) =>
        prev.filter((line) => {
          if (image && line.image === image && !isImageLocked(image)) {
            return false;
          }

          if (word && line.word === word && !isWordLocked(word)) {
            return false;
          }

          return true;
        }),
      );

      if (image) {
        const oldLine = lines.find((line) => line.image === image);

        if (oldLine) {
          setWrongWords((prev) =>
            prev.filter((wrongWord) => wrongWord !== oldLine.word),
          );
        }
      }

      if (word) {
        setWrongWords((prev) => prev.filter((wrongWord) => wrongWord !== word));
      }

      setFirstDot({
        type: image ? "image" : "word",

        image,

        word,

        x: point.x,

        y: point.y,
      });

      setSelectedLeftWord(image);

      setSelectedRightWord(word);

      return;
    }

    /* =========================
       IMAGE -> WORD
    ========================= */

    if (firstDot.type === "image" && word) {
      commitConnection(firstDot.image, word);

      return;
    }

    /* =========================
       WORD -> IMAGE
    ========================= */

    if (firstDot.type === "word" && image) {
      commitConnection(image, firstDot.word);

      return;
    }

    /* =========================
       SAME SIDE
    ========================= */

    setFirstDot({
      type: image ? "image" : "word",

      image,

      word,

      x: point.x,

      y: point.y,
    });

    setSelectedLeftWord(image);

    setSelectedRightWord(word);
  };

  /* =====================================================
     SOURCE MOUSE CLICK
     على الجملة - مش الصورة
  ===================================================== */

  const handleSourceMouseClick = (row) => {
    if (showAnswer || checkCompleted || isImageLocked(row.image)) {
      return;
    }

    playAudio(`question-${row.image}`, row.questionAudio);

    document.getElementById(row.imageDotId)?.click();
  };

  /* =====================================================
     TARGET MOUSE CLICK
     على الجملة
  ===================================================== */

  const handleTargetMouseClick = (row) => {
    /*
      الصوت يشتغل حتى لو العنصر صح ومقفول
    */

    playAudio(`answer-${row.word}`, row.wordAudio);

    if (showAnswer || checkCompleted || isWordLocked(row.word)) {
      return;
    }

    document.getElementById(row.wordDotId)?.click();
  };

  /* =====================================================
     CHECK
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

    let correctCount = 0;

    const wrong = [];

    const newLockedImages = [];

    const newLockedWords = [];

    lines.forEach((line) => {
      const correct = isCorrectMatch(line.image, line.word);

      if (correct) {
        correctCount++;

        newLockedImages.push(line.image);

        newLockedWords.push(line.word);
      } else {
        wrong.push(line.word);
      }
    });

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newLockedImages])),
    );

    setLockedWords((prev) => Array.from(new Set([...prev, ...newLockedWords])));

    setWrongWords(wrong);

    clearSelection();

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
      setLockedImages(correctMatches.map((pair) => pair.image));

      setLockedWords(correctMatches.map((pair) => pair.word));

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

  const showCorrectAnswers = () => {
    const finalLines = correctMatches
      .map((pair) => {
        const imageRow = rows.find((row) => row.image === pair.image);

        const wordRow = rows.find((row) => row.word === pair.word);

        const start = getElementCenter(
          document.getElementById(imageRow?.imageDotId),
        );

        const end = getElementCenter(
          document.getElementById(wordRow?.wordDotId),
        );

        if (!start || !end) {
          return null;
        }

        return {
          x1: start.x,

          y1: start.y,

          x2: end.x,

          y2: end.y,

          image: pair.image,

          word: pair.word,
        };
      })
      .filter(Boolean);

    setLines(finalLines);

    setWrongWords([]);

    setLockedImages(correctMatches.map((pair) => pair.image));

    setLockedWords(correctMatches.map((pair) => pair.word));

    setShowAnswer(true);

    setCheckCompleted(true);

    clearSelection();
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setLines([]);

    setPreviewLine(null);

    setFirstDot(null);

    setWrongWords([]);

    setLockedImages([]);

    setLockedWords([]);

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    setShowAnswer(false);

    setCheckCompleted(false);
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
      <div
        className="div-forall"
        style={{
          gap: "50px",
        }}
      >
        <ExerciseHeader
          sectionLetter="A"
          title="Look, read, and match."
          subTitle="Read each question and connect the picture to the correct shape sentence."
        />

        <div className="container12 w-full" ref={containerRef}>
          {rows.map((row, index) => {
            const imageLocked = isImageLocked(row.image);

            const wordLocked = isWordLocked(row.word);

            const keyboardMatchingActive = firstDot?.type === "image";

            const questionPlaying = playingKey === `question-${row.image}`;

            const answerPlaying = playingKey === `answer-${row.word}`;

            return (
              <div className="matching-row2" key={row.image}>
                {/* =================================================
                      LEFT
                  ================================================= */}

                <div className="img-with-dot2-wb-unit4-p1-q1">
                  <span className="span-num2">{index + 1}</span>

                  {/* ===============================================
                        IMAGE
                        فقط عرض + ALT
                        مش clickable
                    =============================================== */}

                  <img
                    src={row.src}
                    className="matched-img2"
                    alt={row.alt}
                    style={{
                      height: "auto",

                      width: "120px",
                    }}
                  />

                  {/* ===============================================
                        QUESTION SENTENCE
                        هي اللي clickable
                    =============================================== */}

                  <span
                    ref={(el) => {
                      sourceRefs.current[row.image] = el;
                    }}
                    role="button"
                    tabIndex={
                      imageLocked || showAnswer || checkCompleted || firstDot
                        ? -1
                        : 0
                    }
                    aria-label={`${row.question}. Press Enter or Space to hear the question and start matching.`}
                    className={`word-text2-wb-unit4-p1-q1 source-sentence-wb-unit4-p1-q1 ${
                      selectedLeftWord === row.image ? "selected-item" : ""
                    } ${imageLocked || showAnswer ? "disabled-word" : ""}`}
                    onClick={() => handleSourceMouseClick(row)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        e.stopPropagation();

                        handleSourceAction(row.image, row.questionAudio);
                      }
                    }}
                    style={{
                      cursor:
                        imageLocked || showAnswer || checkCompleted
                          ? "default"
                          : "pointer",

                      width: "350px",

                      position: "relative",
                    }}
                  >
                    {row.question}

                    {questionPlaying && (
                      <FaVolumeUp
                        size={16}
                        aria-hidden="true"
                        className="matching-audio-icon-wb-unit4-p1-q1"
                      />
                    )}
                  </span>

                  {/* ===============================================
                        WRONG X
                    =============================================== */}

                  {wrongWords.includes(
                    lines.find((line) => line.image === row.image)?.word,
                  ) && <span className="error-mark8-wb-unit4-p1-q1">✕</span>}

                  {/* ===============================================
                        DOT
                    =============================================== */}

                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      data-image={row.image}
                      id={row.imageDotId}
                      onClick={handleDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* =================================================
                      RIGHT
                  ================================================= */}

                <div className="word-with-dot2">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      data-word={row.word}
                      id={row.wordDotId}
                      onClick={handleDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>

                  {/* ===============================================
                        ANSWER SENTENCE
                        صوت + توصيل
                    =============================================== */}

                  <span
                    ref={(el) => {
                      wordRefs.current[row.word] = el;
                    }}
                    className={`word-text2-wb-unit4-p1-q1 target-sentence-wb-unit4-p1-q1 ${
                      selectedRightWord === row.word ? "selected-item" : ""
                    } ${wordLocked || showAnswer ? "disabled-word" : ""}`}
                    role="button"
                    tabIndex={
                      keyboardMatchingActive &&
                      !wordLocked &&
                      !showAnswer &&
                      !checkCompleted
                        ? 0
                        : wordLocked || showAnswer || checkCompleted
                          ? 0
                          : -1
                    }
                    aria-label={
                      keyboardMatchingActive
                        ? `${row.word}. Press Enter or Space to hear and connect.`
                        : `${row.word}. Press Enter or Space to hear the sentence.`
                    }
                    onClick={() => handleTargetMouseClick(row)}
                    onFocus={() => {
                      if (firstDot?.type === "image" && !wordLocked) {
                        updatePreviewLine(firstDot, row.word);
                      }
                    }}
                    onKeyDown={(e) => {
                      /*
                          إذا في matching active:
                          الصوت + commit
                        */

                      if (
                        firstDot?.type === "image" &&
                        !wordLocked &&
                        !showAnswer &&
                        !checkCompleted
                      ) {
                        handleWordKeyboard(e, index, row.word, row.wordAudio);

                        return;
                      }

                      /*
                          إذا ما في matching:
                          الصوت فقط
                        */

                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        e.stopPropagation();

                        playAudio(`answer-${row.word}`, row.wordAudio);
                      }
                    }}
                    style={{
                      cursor: "pointer",

                      width: "140px",

                      position: "relative",
                    }}
                  >
                    {row.word}

                    {answerPlaying && (
                      <FaVolumeUp
                        size={16}
                        aria-hidden="true"
                        className="matching-audio-icon-wb-unit4-p1-q1"
                      />
                    )}
                  </span>
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
                key={`${line.image}-${line.word}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}

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
};

export default WB_Unit4_Page1_Q1;
