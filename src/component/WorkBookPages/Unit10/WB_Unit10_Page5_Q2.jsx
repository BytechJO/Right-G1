import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit10_Page5_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/U1 WB/U10/U10P61EXEJ-01.svg";
import img2 from "../../../assets/U1 WB/U10/U10P61EXEJ-02.svg";
import img3 from "../../../assets/U1 WB/U10/U10P61EXEJ-03.svg";
import img4 from "../../../assets/U1 WB/U10/U10P61EXEJ-04.svg";
import img5 from "../../../assets/U1 WB/U10/U10P61EXEJ-05.svg";
import img6 from "../../../assets/U1 WB/U10/U10P61EXEJ-06.svg";

import milkAudio from "../../../assets/U1 WB/U10/audio/page61- J/Item_001_milk.mp3";
import appleAudio from "../../../assets/U1 WB/U10/audio/page61- J/Item_002_apple.mp3";
import chickenAudio from "../../../assets/U1 WB/U10/audio/page61- J/Item_003_chicken.mp3";
import breadAudio from "../../../assets/U1 WB/U10/audio/page61- J/Item_004_bread.mp3";
import iceCreamAudio from "../../../assets/U1 WB/U10/audio/page61- J/Item_005_ice_cream.mp3";
import fruitAudio from "../../../assets/U1 WB/U10/audio/page61- J/Item_006_fruit.mp3";

import { FaVolumeUp } from "react-icons/fa";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   GRID
===================================================== */

const grid = [
  ["m", "e", "l", "h", "m", "e", "d", "s", "k"],
  ["a", "p", "p", "l", "e", "i", "b", "p", "i"],
  ["e", "k", "a", "h", "s", "m", "i", "l", "k"],
  ["i", "c", "e", "c", "r", "e", "a", "m", "k"],
  ["c", "l", "s", "b", "r", "e", "a", "d", "f"],
  ["e", "i", "p", "a", "r", "b", "m", "h", "r"],
  ["c", "h", "i", "c", "k", "e", "n", "h", "u"],
  ["i", "p", "c", "c", "c", "d", "a", "c", "i"],
  ["h", "a", "a", "h", "e", "l", "a", "d", "t"],
];

/* =====================================================
   WORDS
===================================================== */

const words = [
  {
    text: "milk",
    src: img1,
    alt: "A carton of milk.",
    audio: milkAudio,
    coords: [
      [2, 5],
      [2, 6],
      [2, 7],
      [2, 8],
    ],
  },

  {
    text: "apple",
    src: img2,
    alt: "A red apple.",
    audio: appleAudio,
    coords: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
  },

  {
    text: "chicken",
    src: img3,
    alt: "A chicken.",
    audio: chickenAudio,
    coords: [
      [6, 0],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
      [6, 5],
      [6, 6],
    ],
  },

  {
    text: "bread",
    src: img4,
    alt: "A loaf of bread.",
    audio: breadAudio,
    coords: [
      [4, 3],
      [4, 4],
      [4, 5],
      [4, 6],
      [4, 7],
    ],
  },

  {
    text: "fruit",
    src: img5,
    alt: "A group of fruit.",
    audio: fruitAudio,
    coords: [
      [4, 8],
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ],
  },

  {
    text: "ice cream",
    src: img6,
    alt: "Ice cream.",
    audio: iceCreamAudio,
    coords: [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
      [3, 7],
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

export default function WB_Unit10_Page5_Q2() {
  const [foundWords, setFoundWords] = useState([]);

  const [previewPath, setPreviewPath] = useState([]);

  const [wrongTry, setWrongTry] = useState(false);

  const [wrongWords, setWrongWords] = useState([]);

  const [locked, setLocked] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  /* =====================================================
     KEYBOARD STATE
  ===================================================== */

  const [activeCell, setActiveCell] = useState([0, 0]);

  const [keyboardStart, setKeyboardStart] = useState(null);

  const [keyboardSelecting, setKeyboardSelecting] = useState(false);

  /* =====================================================
     POINTER STATE
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
     CELL HELPERS
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

      /* clear only this word's X */

      setWrongWords((previous) =>
        previous.filter((word) => word !== matchedWord.text),
      );

      playWordAudio(matchedWord.text);
    } else {
      setWrongTry(true);

      window.setTimeout(() => setWrongTry(false), 350);
    }

    setPreviewPath([]);

    previewPathRef.current = [];
  };

  /* =====================================================
     POINTER DOWN
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

    /* ENTER / SPACE */

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!keyboardSelecting) {
        const start = [row, col];

        setKeyboardStart(start);

        setKeyboardSelecting(true);

        setPreviewPath([start]);

        previewPathRef.current = [start];

        return;
      }

      commitPath(previewPathRef.current);

      setKeyboardSelecting(false);

      setKeyboardStart(null);

      return;
    }

    /* ESCAPE */

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

    /* ARROWS */

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
      gridRef.current
        ?.querySelector(`[data-row="${nextRow}"][data-col="${nextCol}"]`)
        ?.focus();
    });

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
        <div style={{gap:"10px"}} className="div-forall">
          <ExerciseHeader
            sectionLetter="J"
            title="Look and find the words."
            subTitle="Find milk, apple, chicken, bread, fruit, and ice cream in the grid."
          />
          <div className="container-word-grid-wb-unit10-p5-q2">
            {/* GRID */}

            <div
              ref={gridRef}
              role="grid"
              aria-label="Food word search. Use arrow keys to move. Press Enter or Space to start selecting a word, move with the arrow keys, then press Enter or Space again to confirm."
              className={`grid-wb-u1-p6-q2 ${wrongTry ? "shake" : ""} ${
                keyboardSelecting ? "keyboard-grid-selecting-wb-u10-p5-q2" : ""
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
                        className={`cell-wb-unit10-p5-q2
                              ${preview ? "highlight" : ""}
                              ${found ? "found" : ""}
                              ${
                                active
                                  ? "active-keyboard-cell-wb-u10-p5-q2"
                                  : ""
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

            {/* WORD LIST */}

            <div className="word-btn-wb-unit10-p5-q2">
              {words.map((word) => {
                const found = foundWords.includes(word.text);

                const wrong = wrongWords.includes(word.text);

                const playing = playingWord === word.text;

                return (
                  <div
                    key={word.text}
                    className={`word-label-wb-u10-p5-q2 ${found ? "done" : ""}`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${word.text}. Press Enter or Space to hear the word.`}
                      className="word-audio-control-wb-u10-p5-q2"
                      onClick={() => playWordAudio(word.text)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();

                          playWordAudio(word.text);
                        }
                      }}
                    >
                      <img
                        src={word.src}
                        alt={word.alt}
                        style={{
                          height: "100px",
                          width: "100px",
                        }}
                      />

                      <p>{word.text}</p>

                      {playing && (
                        <FaVolumeUp
                          aria-hidden="true"
                          className="audio-icon-wb-u10-p5-q2"
                        />
                      )}
                    </div>

                    {wrong && (
                      <span
                        className="wrong-x-circle-wb-unit10-p5-q2"
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

      {/* BUTTONS */}

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
