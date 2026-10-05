import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page5_Q3.css";

import img from "../../../assets/unit4/imgs/U4P32ExeB.svg";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import redAudio from "../../../assets/unit4/Page 32 - B/it's a red.mp3";
import blueAudio from "../../../assets/unit4/Page 32 - B/it's a blue.mp3";
import brownAudio from "../../../assets/unit4/Page 32 - B/it's a brown.mp3";

import circleAudio from "../../../assets/unit4/Page 32 - B/circle.mp3";
import squareAudio from "../../../assets/unit4/Page 32 - B/square.mp3";
import triangleAudio from "../../../assets/unit4/Page 32 - B/triangle.mp3";

/* =====================================================
   DATA
===================================================== */

const leftItems = [
  {
    word: "It’s a red",
    audio: redAudio,
  },
  {
    word: "It’s a blue",
    audio: blueAudio,
  },
  {
    word: "It’s a brown",
    audio: brownAudio,
  },
];

const rightItems = [
  {
    word: "circle.",
    audio: circleAudio,
  },
  {
    word: "square.",
    audio: squareAudio,
  },
  {
    word: "triangle.",
    audio: triangleAudio,
  },
];

const correctMatches = [
  {
    word1: "It’s a red",
    word2: "square.",
  },
  {
    word1: "It’s a blue",
    word2: "triangle.",
  },
  {
    word1: "It’s a brown",
    word2: "circle.",
  },
];

export default function Unit4_Page5_Q3() {
  /* =====================================================
     STATE
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  const [firstDot, setFirstDot] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [selectedLeftWord, setSelectedLeftWord] = useState(null);

  const [selectedRightWord, setSelectedRightWord] = useState(null);

  const [lockedLeftWords, setLockedLeftWords] = useState([]);

  const [lockedRightWords, setLockedRightWords] = useState([]);

  const [previewLine, setPreviewLine] = useState(null);

  /* =====================================================
     REFS
  ===================================================== */

  const containerRef = useRef(null);

  const leftRefs = useRef({});

  const rightRefs = useRef([]);

  /* =====================================================
     AUDIO STATE
  ===================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =====================================================
     WORD ARRAYS
  ===================================================== */

  const leftWords = leftItems.map((item) => item.word);

  const rightWords = rightItems.map((item) => item.word);

  /* =====================================================
     AUDIO FUNCTIONS
  ===================================================== */

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
      audio.currentTime = 0;

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

  /* =====================================================
     HELPERS
  ===================================================== */

  const isLeftLocked = (word) => {
    return lockedLeftWords.includes(word);
  };

  const isRightLocked = (word) => {
    return lockedRightWords.includes(word);
  };

  const isCorrectMatch = (word1, word2) => {
    return correctMatches.some(
      (pair) => pair.word1 === word1 && pair.word2 === word2,
    );
  };

  const getDotPosition = (element) => {
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

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    setPreviewLine(null);
  };

  const getAvailableRightIndexes = () => {
    return rightWords
      .map((word, index) => ({
        word,
        index,
      }))
      .filter(({ word }) => !isRightLocked(word))
      .map(({ index }) => index);
  };

  /* =====================================================
     REMOVE EDITABLE CONNECTION
  ===================================================== */

  const removeEditableConnection = ({ left, right }) => {
    setLines((prev) =>
      prev.filter((line) => {
        const lineLocked = isLeftLocked(line.word) || isRightLocked(line.image);

        /*
          الخط الصح المقفول ما بنشيله
        */
        if (lineLocked) {
          return true;
        }

        if (left && line.word === left) {
          return false;
        }

        if (right && line.image === right) {
          return false;
        }

        return true;
      }),
    );
  };

  /* =====================================================
     PREVIEW LINE
  ===================================================== */

  const updatePreviewLine = (startPoint, rightWord) => {
    if (!startPoint) return;

    const rightDot = document.getElementById(`dot-${rightWord}`);

    if (!rightDot) return;

    const rightPosition = getDotPosition(rightDot);

    if (!rightPosition) return;

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,

      x2: rightPosition.x,
      y2: rightPosition.y,
    });
  };

  /* =====================================================
     COMMIT CONNECTION
  ===================================================== */

  const commitConnection = (leftWord, rightWord) => {
    if (
      !leftWord ||
      !rightWord ||
      showAnswer ||
      checkCompleted ||
      isLeftLocked(leftWord) ||
      isRightLocked(rightWord)
    ) {
      return;
    }

    const leftDot = document.getElementById(`dot-${leftWord}`);

    const rightDot = document.getElementById(`dot-${rightWord}`);

    if (!leftDot || !rightDot) {
      return;
    }

    const leftPosition = getDotPosition(leftDot);

    const rightPosition = getDotPosition(rightDot);

    if (!leftPosition || !rightPosition) {
      return;
    }

    /*
      لو الهدف اليمين كان موصول قبل
      نحتاج نعرف مين اليسار القديم
      عشان نشيل X عنه كمان.
    */

    const previousRightLine = lines.find((line) => line.image === rightWord);

    const newLine = {
      x1: leftPosition.x,

      y1: leftPosition.y,

      x2: rightPosition.x,

      y2: rightPosition.y,

      word: leftWord,

      image: rightWord,
    };

    /*
      ONE TO ONE

      - خط واحد لكل يسار
      - خط واحد لكل يمين
      - الجديد يستبدل القديم
    */

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== leftWord && line.image !== rightWord,
      );

      return [...filtered, newLine];
    });

    /*
      شيل X فقط عن الوصلات
      اللي تغيرت
    */

    setWrongWords((prev) =>
      prev.filter(
        (word) => word !== leftWord && word !== previousRightLine?.word,
      ),
    );

    setSelectedLeftWord(leftWord);

    setSelectedRightWord(rightWord);

    setFirstDot(null);

    setPreviewLine(null);

    window.setTimeout(() => {
      setSelectedLeftWord(null);

      setSelectedRightWord(null);
    }, 300);
  };

  /* =====================================================
     KEYBOARD START FROM LEFT
  ===================================================== */

  const startKeyboardMatch = (leftWord) => {
    if (showAnswer || checkCompleted || isLeftLocked(leftWord)) {
      return;
    }

    const leftDot = document.getElementById(`dot-${leftWord}`);

    if (!leftDot) return;

    const position = getDotPosition(leftDot);

    if (!position) return;

    /*
      إذا كان عنده خط غلط سابق
      نشيله حتى يقدر يعيد التوصيل.
    */

    removeEditableConnection({
      left: leftWord,
    });

    /*
      شيل X فقط عن هذا العنصر
    */

    setWrongWords((prev) => prev.filter((word) => word !== leftWord));

    const startPoint = {
      type: "left",

      word: leftWord,

      x: position.x,

      y: position.y,
    };

    setFirstDot(startPoint);

    setSelectedLeftWord(leftWord);

    setSelectedRightWord(null);

    setPreviewLine(null);

    /*
      انقل التركيز لأول خيار يمين
    */

    requestAnimationFrame(() => {
      const available = getAvailableRightIndexes();

      if (!available.length) {
        return;
      }

      const firstIndex = available[0];

      rightRefs.current[firstIndex]?.focus();

      updatePreviewLine(startPoint, rightWords[firstIndex]);
    });
  };

  /* =====================================================
     KEYBOARD RIGHT SIDE
  ===================================================== */

  const handleRightKeyboard = (e, index, rightWord, audio) => {
    if (!firstDot || firstDot.type !== "left") {
      return;
    }

    if (showAnswer || checkCompleted || isRightLocked(rightWord)) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();

      e.stopPropagation();

      const available = getAvailableRightIndexes();

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

      rightRefs.current[targetIndex]?.focus();

      updatePreviewLine(firstDot, rightWords[targetIndex]);

      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      /*
        شغل صوت الخيار اليمين
      */

      playAudio(rightWord, audio);

      const leftWord = firstDot.word;

      /*
        ثبت التوصيل
      */

      commitConnection(leftWord, rightWord);

      /*
        رجع للجهة اليسار
      */

      window.setTimeout(() => {
        const nextLeft =
          leftWords.find((word) => !isLeftLocked(word) && word !== leftWord) ||
          leftWords.find((word) => !isLeftLocked(word));

        if (nextLeft) {
          leftRefs.current[nextLeft]?.focus();
        }
      }, 100);

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      const leftWord = firstDot.word;

      clearSelection();

      requestAnimationFrame(() => {
        leftRefs.current[leftWord]?.focus();
      });
    }
  };

  /* =====================================================
     MOUSE LEFT
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const word = e.currentTarget.dataset.letter;

    if (!word || isLeftLocked(word)) {
      return;
    }

    const position = getDotPosition(e.currentTarget);

    if (!position) {
      return;
    }

    /* =================================================
       NOTHING SELECTED
    ================================================= */

    if (!firstDot) {
      removeEditableConnection({
        left: word,
      });

      setWrongWords((prev) => prev.filter((item) => item !== word));

      setFirstDot({
        type: "left",

        word,

        x: position.x,

        y: position.y,
      });

      setSelectedLeftWord(word);

      setSelectedRightWord(null);

      setPreviewLine(null);

      return;
    }

    /* =================================================
       LEFT -> ANOTHER LEFT
    ================================================= */

    if (firstDot.type === "left") {
      removeEditableConnection({
        left: word,
      });

      setWrongWords((prev) => prev.filter((item) => item !== word));

      setFirstDot({
        type: "left",

        word,

        x: position.x,

        y: position.y,
      });

      setSelectedLeftWord(word);

      setSelectedRightWord(null);

      setPreviewLine(null);

      return;
    }

    /* =================================================
       RIGHT -> LEFT
    ================================================= */

    commitConnection(word, firstDot.word);
  };

  /* =====================================================
     MOUSE RIGHT
  ===================================================== */

  const handleEndDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const word = e.currentTarget.dataset.image;

    if (!word || isRightLocked(word)) {
      return;
    }

    const position = getDotPosition(e.currentTarget);

    if (!position) {
      return;
    }

    /* =================================================
       NOTHING SELECTED
    ================================================= */

    if (!firstDot) {
      removeEditableConnection({
        right: word,
      });

      setFirstDot({
        type: "right",

        word,

        x: position.x,

        y: position.y,
      });

      setSelectedRightWord(word);

      setSelectedLeftWord(null);

      setPreviewLine(null);

      return;
    }

    /* =================================================
       RIGHT -> ANOTHER RIGHT
    ================================================= */

    if (firstDot.type === "right") {
      removeEditableConnection({
        right: word,
      });

      setFirstDot({
        type: "right",

        word,

        x: position.x,

        y: position.y,
      });

      setSelectedRightWord(word);

      setSelectedLeftWord(null);

      setPreviewLine(null);

      return;
    }

    /* =================================================
       LEFT -> RIGHT
    ================================================= */

    commitConnection(firstDot.word, word);
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      لازم الثلاثة يكونوا موصولين
    */

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all pairs before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const correctLeft = [];

    const correctRight = [];

    lines.forEach((line) => {
      const correct = isCorrectMatch(line.word, line.image);

      if (correct) {
        correctCount++;

        correctLeft.push(line.word);

        correctRight.push(line.image);
      } else {
        wrong.push(line.word);
      }
    });

    /* =================================================
       LOCK CORRECT LEFT
    ================================================= */

    setLockedLeftWords((prev) =>
      Array.from(new Set([...prev, ...correctLeft])),
    );

    /* =================================================
       LOCK CORRECT RIGHT
    ================================================= */

    setLockedRightWords((prev) =>
      Array.from(new Set([...prev, ...correctRight])),
    );

    /*
      الغلط فقط عليه X
    */

    setWrongWords(wrong);

    clearSelection();

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div
        style="
          font-size:20px;
          margin-top:10px;
          text-align:center;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (correctCount === total) {
      setLockedLeftWords(correctMatches.map((item) => item.word1));

      setLockedRightWords(correctMatches.map((item) => item.word2));

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
    stopAudio();

    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const correctLines = correctMatches
      .map((pair) => {
        const startEl = document.querySelector(
          `.start-dot5[data-letter="${pair.word1}"]`,
        );

        const endEl = document.querySelector(
          `.end-dot5[data-image="${pair.word2}"]`,
        );

        if (!startEl || !endEl) {
          return null;
        }

        const startRect = startEl.getBoundingClientRect();

        const endRect = endEl.getBoundingClientRect();

        return {
          x1: startRect.left - rect.left + startRect.width / 2,

          y1: startRect.top - rect.top + startRect.height / 2,

          x2: endRect.left - rect.left + endRect.width / 2,

          y2: endRect.top - rect.top + endRect.height / 2,

          word: pair.word1,

          image: pair.word2,
        };
      })
      .filter(Boolean);

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    setFirstDot(null);

    setPreviewLine(null);

    setLines(correctLines);

    setWrongWords([]);

    setLockedLeftWords(correctMatches.map((item) => item.word1));

    setLockedRightWords(correctMatches.map((item) => item.word2));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setSelectedLeftWord(null);

    setSelectedRightWord(null);

    setLines([]);

    setWrongWords([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setLockedLeftWords([]);

    setLockedRightWords([]);

    setFirstDot(null);

    setPreviewLine(null);
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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title="Read, look, and match."
          subTitle="Read the color and shape words, then connect each one to the correct picture"
        />

        <div className="matching-wrapper2-unit4-p5-q3" ref={containerRef}>
          {/* =================================================
              IMAGE
          ================================================= */}

          <img
            src={img}
            className="img-unit4-p5-q3"
            alt="A matching exercise showing a red square, a blue triangle, and a brown circle."
          />

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* =================================================
                LEFT
            ================================================= */}

            <div className="column2-unit4-p5-q3 left-column">
              {leftItems.map((item, index) => {
                const word = item.word;

                const locked = isLeftLocked(word);

                const isPlaying = playingWord === word;

                return (
                  <div className="word-row2" key={word}>
                    <span className="num2">{index + 1}</span>

                    <span
                      ref={(el) => {
                        leftRefs.current[word] = el;
                      }}
                      className={`word-text3 ${
                        selectedLeftWord === word ? "selected-item" : ""
                      } ${locked || showAnswer ? "disabled-hover" : ""}`}
                      role="button"
                      tabIndex={
                        locked || showAnswer || checkCompleted || firstDot
                          ? -1
                          : 0
                      }
                      aria-label={
                        locked
                          ? `${word}. Correct match.`
                          : `${word}. Press Enter or Space to play audio and select for matching.`
                      }
                      onClick={() => {
                        if (locked || showAnswer || checkCompleted) {
                          /*
                              حتى لو مقفول:
                              نخلي الصوت يشتغل بالماوس
                            */
                          playAudio(word, item.audio);

                          return;
                        }

                        playAudio(word, item.audio);

                        document.getElementById(`dot-${word}`)?.click();
                      }}
                      onKeyDown={(e) => {
                        if (locked || showAnswer || checkCompleted) {
                          return;
                        }

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          e.stopPropagation();

                          /*
                              SOUND
                            */

                          playAudio(word, item.audio);

                          /*
                              START MATCH
                            */

                          startKeyboardMatch(word);
                        }
                      }}
                      style={{
                        width: "160px",

                        cursor:
                          locked || showAnswer || checkCompleted
                            ? "default"
                            : "pointer",

                        position: "relative",

                        display: "inline-flex",

                        alignItems: "center",

                        gap: "8px",
                      }}
                    >
                      {word}

                      {/* AUDIO ICON */}

                      {isPlaying && (
                        <FaVolumeUp
                          size={17}
                          aria-hidden="true"
                          style={{
                            position: "absolute",

                            top: "-8px",

                            right: "-8px",

                            background: "white",

                            borderRadius: "50%",

                            padding: "2px",

                            pointerEvents: "none",

                            zIndex: 10,
                          }}
                        />
                      )}
                    </span>

                    <div
                      className="dot5 start-dot5"
                      data-letter={word}
                      id={`dot-${word}`}
                      onClick={handleStartDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />

                    {wrongWords.includes(word) && (
                      <span className="error-mark4-unit4-p5-q3">✕</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="column2-unit4-p5-q3 right-column">
              {rightItems.map((item, index) => {
                const word = item.word;

                const locked = isRightLocked(word);

                const isPlaying = playingWord === word;

                const keyboardActive = firstDot?.type === "left";

                return (
                  <div className="word-row2" key={word}>
                    <div
                      className="dot5 end-dot5"
                      data-image={word}
                      id={`dot-${word}`}
                      onClick={handleEndDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />

                    <span
                      ref={(el) => {
                        rightRefs.current[index] = el;
                      }}
                      className={`word-text3 ${
                        selectedRightWord === word ? "selected-item" : ""
                      } ${locked || showAnswer ? "disabled-hover" : ""}`}
                      role={keyboardActive ? "button" : undefined}
                      tabIndex={
                        keyboardActive &&
                        !locked &&
                        !showAnswer &&
                        !checkCompleted
                          ? 0
                          : -1
                      }
                      aria-label={
                        locked
                          ? `${word}. Correct match.`
                          : keyboardActive
                            ? `${word}. Press Enter or Space to play audio and connect.`
                            : word
                      }
                      onClick={() => {
                        /*
                            PLAY AUDIO
                          */

                        playAudio(word, item.audio);

                        if (showAnswer || checkCompleted || locked) {
                          return;
                        }

                        /*
                            MOUSE CONNECT
                          */

                        document.getElementById(`dot-${word}`)?.click();
                      }}
                      onFocus={() => {
                        if (
                          firstDot?.type === "left" &&
                          !locked &&
                          !showAnswer &&
                          !checkCompleted
                        ) {
                          updatePreviewLine(firstDot, word);
                        }
                      }}
                      onKeyDown={(e) =>
                        handleRightKeyboard(e, index, word, item.audio)
                      }
                      style={{
                        cursor:
                          locked || showAnswer || checkCompleted
                            ? "default"
                            : "pointer",

                        position: "relative",

                        display: "inline-flex",

                        alignItems: "center",

                        gap: "8px",
                      }}
                    >
                      {word}

                      {/* AUDIO ICON */}

                      {isPlaying && (
                        <FaVolumeUp
                          size={17}
                          aria-hidden="true"
                          style={{
                            position: "absolute",

                            top: "-8px",

                            right: "-8px",

                            background: "white",

                            borderRadius: "50%",

                            padding: "2px",

                            pointerEvents: "none",

                            zIndex: 10,
                          }}
                        />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              LINES
          ================================================= */}

          <svg className="lines-layer5" aria-hidden="true">
            {/* PERMANENT LINES */}

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
}
