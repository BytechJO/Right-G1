import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit9_Page5_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import horseAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_001_horse.mp3";
import barnAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_002_barn.mp3";
import stableAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_003_stable.mp3";
import cowAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_004_cow.mp3";
import chickenAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_005_chicken.mp3";
import grassAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_006_grass.mp3";
import goatAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_007_goat.mp3";
import catAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_008_cat.mp3";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   GRID
===================================================== */

const grid = [
  ["c", "s", "t", "a", "b", "l", "e"],
  ["h", "e", "k", "g", "i", "h", "c"],
  ["i", "b", "l", "r", "a", "o", "o"],
  ["c", "a", "t", "a", "w", "r", "w"],
  ["k", "r", "a", "s", "a", "s", "c"],
  ["e", "n", "a", "s", "n", "e", "c"],
  ["n", "s", "g", "o", "a", "t", "a"],
];

/* =====================================================
   WORDS
===================================================== */

const words = [
  {
    text: "horse",
    audio: horseAudio,
    coords: [
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5],
    ],
  },

  {
    text: "barn",
    audio: barnAudio,
    coords: [
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
    ],
  },

  {
    text: "stable",
    audio: stableAudio,
    coords: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ],
  },

  {
    text: "cow",
    audio: cowAudio,
    coords: [
      [1, 6],
      [2, 6],
      [3, 6],
    ],
  },

  {
    text: "chicken",
    audio: chickenAudio,
    coords: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
    ],
  },

  {
    text: "grass",
    audio: grassAudio,
    coords: [
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
    ],
  },

  {
    text: "goat",
    audio: goatAudio,
    coords: [
      [6, 2],
      [6, 3],
      [6, 4],
      [6, 5],
    ],
  },

  {
    text: "cat",
    audio: catAudio,
    coords: [
      [3, 0],
      [3, 1],
      [3, 2],
    ],
  },
];

/* =====================================================
   HELPERS
===================================================== */

const sameCoord = (a, b) => a?.[0] === b?.[0] && a?.[1] === b?.[1];

const samePath = (path1, path2) => {
  if (!path1 || !path2 || path1.length !== path2.length) {
    return false;
  }

  const forward = path1.every((coord, index) => sameCoord(coord, path2[index]));

  if (forward) return true;

  const reversed = [...path2].reverse();

  return path1.every((coord, index) => sameCoord(coord, reversed[index]));
};

/* =====================================================
   BUILD STRAIGHT PATH

   horizontal
   vertical
   diagonal
===================================================== */

const buildPath = (start, end) => {
  if (!start || !end) {
    return [];
  }

  const [startRow, startCol] = start;

  const [endRow, endCol] = end;

  const rowDiff = endRow - startRow;

  const colDiff = endCol - startCol;

  const absRow = Math.abs(rowDiff);

  const absCol = Math.abs(colDiff);

  const isHorizontal = rowDiff === 0;

  const isVertical = colDiff === 0;

  const isDiagonal = absRow === absCol;

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return [];
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;

  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

  const steps = Math.max(absRow, absCol);

  const path = [];

  for (let index = 0; index <= steps; index++) {
    path.push([startRow + rowStep * index, startCol + colStep * index]);
  }

  return path;
};

/* =====================================================
   COMPONENT
===================================================== */

export default function WB_Unit9_Page5_Q1() {
  /* =====================================================
     FOUND / PREVIEW
  ===================================================== */

  const [foundWords, setFoundWords] = useState([]);

  const [previewPath, setPreviewPath] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  const [wrongTry, setWrongTry] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  const [locked, setLocked] = useState(false);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [activeCell, setActiveCell] = useState([0, 0]);

  const [keyboardStart, setKeyboardStart] = useState(null);

  const [keyboardSelecting, setKeyboardSelecting] = useState(false);

  /* =====================================================
     POINTER
  ===================================================== */

  const draggingRef = useRef(false);

  const dragStartRef = useRef(null);

  const previewPathRef = useRef([]);

  const activePointerIdRef = useRef(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =====================================================
     GRID REF
  ===================================================== */

  const gridRef = useRef(null);

  /* =====================================================
     AUDIO
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

  const playWordAudio = (wordText) => {
    const item = words.find((word) => word.text === wordText);

    if (!item?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingWord(wordText);

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

    audio.onerror = audio.onended;
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  /* =====================================================
     CELL STATE HELPERS
  ===================================================== */

  const isPreviewCell = (row, col) =>
    previewPath.some((coord) => coord[0] === row && coord[1] === col);

  const isFoundCell = (row, col) =>
    words.some(
      (word) =>
        foundWords.includes(word.text) &&
        word.coords.some((coord) => coord[0] === row && coord[1] === col),
    );

  /* =====================================================
     COMMIT PATH
  ===================================================== */

  const commitPath = (path) => {
    if (locked || showAnswer || !path?.length) {
      setPreviewPath([]);

      previewPathRef.current = [];

      return;
    }

    const matchedWord = words.find(
      (word) => !foundWords.includes(word.text) && samePath(path, word.coords),
    );

    if (matchedWord) {
      setFoundWords((previous) => {
        if (previous.includes(matchedWord.text)) {
          return previous;
        }

        return [...previous, matchedWord.text];
      });

      /*
        إذا كانت عليها X من Check سابق
        امسح X تبعتها فقط.
      */

      setWrongWords((previous) =>
        previous.filter((word) => word !== matchedWord.text),
      );

      /*
        Audio on successful find
      */

      playWordAudio(matchedWord.text);
    } else {
      setWrongTry(true);

      window.setTimeout(() => setWrongTry(false), 350);
    }

    setPreviewPath([]);

    previewPathRef.current = [];
  };

  /* =====================================================
     POINTER START
  ===================================================== */

  const handlePointerDown = (event, row, col) => {
    if (locked || showAnswer) {
      return;
    }

    event.preventDefault();

    draggingRef.current = true;

    activePointerIdRef.current = event.pointerId;

    dragStartRef.current = [row, col];

    const path = [[row, col]];

    previewPathRef.current = path;

    setPreviewPath(path);

    setActiveCell([row, col]);
  };

  /* =====================================================
     POINTER MOVE / UP
     document.elementFromPoint
  ===================================================== */

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!draggingRef.current) {
        return;
      }

      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      const element = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest("[data-grid-cell='true']");

      if (!element) {
        return;
      }

      const row = Number(element.dataset.row);

      const col = Number(element.dataset.col);

      const path = buildPath(dragStartRef.current, [row, col]);

      /*
        لو خرج عن horizontal/vertical/diagonal
        ما نغير الـpreview الحالي.
      */

      if (!path.length) {
        return;
      }

      previewPathRef.current = path;

      setPreviewPath(path);

      setActiveCell([row, col]);
    };

    const handlePointerUp = (event) => {
      if (!draggingRef.current) {
        return;
      }

      if (
        activePointerIdRef.current !== null &&
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      draggingRef.current = false;

      activePointerIdRef.current = null;

      const path = previewPathRef.current;

      dragStartRef.current = null;

      commitPath(path);
    };

    const handlePointerCancel = () => {
      draggingRef.current = false;

      activePointerIdRef.current = null;

      dragStartRef.current = null;

      previewPathRef.current = [];

      setPreviewPath([]);
    };

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", handlePointerUp);

    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerUp);

      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [foundWords, locked, showAnswer]);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleCellKeyDown = (event, row, col) => {
    if (locked || showAnswer) {
      return;
    }

    /* =============================================
       ENTER / SPACE
    ============================================= */

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      /*
        Start selection
      */

      if (!keyboardSelecting) {
        const start = [row, col];

        setKeyboardStart(start);

        setKeyboardSelecting(true);

        setPreviewPath([start]);

        previewPathRef.current = [start];

        return;
      }

      /*
        Commit selection
      */

      commitPath(previewPathRef.current);

      setKeyboardSelecting(false);

      setKeyboardStart(null);

      return;
    }

    /* =============================================
       ESCAPE
    ============================================= */

    if (event.key === "Escape") {
      if (keyboardSelecting) {
        event.preventDefault();

        setKeyboardSelecting(false);

        setKeyboardStart(null);

        setPreviewPath([]);

        previewPathRef.current = [];
      }

      return;
    }

    /* =============================================
       ARROWS
    ============================================= */

    const directions = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };

    if (!directions[event.key]) {
      return;
    }

    event.preventDefault();

    const [rowDirection, colDirection] = directions[event.key];

    const rowCount = grid.length;

    const colCount = grid[0].length;

    const nextRow = (row + rowDirection + rowCount) % rowCount;

    const nextCol = (col + colDirection + colCount) % colCount;

    setActiveCell([nextRow, nextCol]);

    requestAnimationFrame(() => {
      const nextElement = gridRef.current?.querySelector(
        `[data-row="${nextRow}"][data-col="${nextCol}"]`,
      );

      nextElement?.focus();
    });

    /*
      أثناء keyboard selection
      نحدث الـpreview.
    */

    if (keyboardSelecting && keyboardStart) {
      const path = buildPath(keyboardStart, [nextRow, nextCol]);

      if (path.length) {
        setPreviewPath(path);

        previewPathRef.current = path;
      }
    }
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || locked) {
      return;
    }

    const missing = words
      .map((word) => word.text)
      .filter((word) => !foundWords.includes(word));

    setWrongWords(missing);

    const correctCount = foundWords.length;

    const total = words.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setWrongWords([]);

      setLocked(true);

      ValidationAlert.success(msg);
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    setFoundWords(words.map((word) => word.text));

    setWrongWords([]);

    setPreviewPath([]);

    previewPathRef.current = [];

    setKeyboardSelecting(false);

    setKeyboardStart(null);

    setShowAnswer(true);

    setLocked(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setFoundWords([]);

    setPreviewPath([]);

    previewPathRef.current = [];

    setWrongTry(false);

    setWrongWords([]);

    setShowAnswer(false);

    setLocked(false);

    setKeyboardSelecting(false);

    setKeyboardStart(null);

    setActiveCell([0, 0]);

    draggingRef.current = false;

    dragStartRef.current = null;

    requestAnimationFrame(() => {
      gridRef.current?.querySelector(`[data-row="0"][data-col="0"]`)?.focus();
    });
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="wordsearch-wrapper">
      <div className="page8-wrapper">
        <div
          className="div-forall"
          style={{
            gap: "50px",
          }}
        >
          <ExerciseHeader
            sectionLetter="J"
            title="Find the words."
            subTitle="Find horse, barn, stable, cow, chicken, grass, goat, and cat in the grid."
          />
          <div className="container-word-grid-wb-u9-p5-q1">
            {/* =================================================
                GRID
            ================================================= */}

            <div
              ref={gridRef}
              role="grid"
              aria-label="Farm words word search. Use arrow keys to move. Press Enter or Space to start a word, move with the arrow keys, then press Enter or Space again to select it."
              className={`grid-wb-u1-p6-q2 ${wrongTry ? "shake" : ""} ${
                keyboardSelecting ? "keyboard-grid-selecting-wb-u9-p5-q1" : ""
              }`}
            >
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} role="row" className="row-wb-u1-p6-q2">
                  {row.map((cell, colIndex) => {
                    const active =
                      activeCell[0] === rowIndex && activeCell[1] === colIndex;

                    const preview = isPreviewCell(rowIndex, colIndex);

                    const found = isFoundCell(rowIndex, colIndex);

                    return (
                      <div
                        key={colIndex}
                        role="gridcell"
                        tabIndex={active && !locked && !showAnswer ? 0 : -1}
                        aria-label={`Row ${rowIndex + 1}, column ${
                          colIndex + 1
                        }, letter ${cell}`}
                        data-grid-cell="true"
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={`cell-wb-u9-p5-q1
                              ${preview ? "highlight" : ""}
                              ${found ? "found" : ""}
                              ${
                                active ? "active-keyboard-cell-wb-u9-p5-q1" : ""
                              }
                            `}
                        onFocus={() => setActiveCell([rowIndex, colIndex])}
                        onPointerDown={(event) =>
                          handlePointerDown(event, rowIndex, colIndex)
                        }
                        onKeyDown={(event) =>
                          handleCellKeyDown(event, rowIndex, colIndex)
                        }
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* =================================================
                WORD LIST + AUDIO
            ================================================= */}

            <div className="word-btn-wb-u9-p5-q1">
              {words.map((word) => {
                const found = foundWords.includes(word.text);

                const wrong = wrongWords.includes(word.text);

                const playing = playingWord === word.text;

                return (
                  <div
                    key={word.text}
                    className="word-label-wrapper-wb-u9-p5-q1"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${word.text}. Press Enter or Space to hear the word.`}
                      className={`word-label-wb-u1-p6-q2 ${
                        found ? "done" : ""
                      }`}
                      style={{
                        position: "relative",
                      }}
                      onClick={() => playWordAudio(word.text)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();

                          playWordAudio(word.text);
                        }
                      }}
                    >
                      {word.text}

                      {playing && (
                        <FaVolumeUp
                          aria-hidden="true"
                          className="audio-icon-wb-u9-p5-q1"
                        />
                      )}
                    </div>

                    {wrong && (
                      <span
                        className="wrong-x-circle-wb-u1-p6-q2"
                        aria-hidden="true"
                      >
                        ✕
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button className="show-answer-btn swal-continue" onClick={showAnswers}>
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
