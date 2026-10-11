import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit7_Page5_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import sadAudio from "../../../assets/U1 WB/U7/audio/page 43- J/Item_001_sad.mp3";
import boredAudio from "../../../assets/U1 WB/U7/audio/page 43- J/Item_002_bored.mp3";
import happyAudio from "../../../assets/U1 WB/U7/audio/page 43- J/Item_003_happy.mp3";
import hungryAudio from "../../../assets/U1 WB/U7/audio/page 43- J/Item_004_hungry.mp3";
import coldAudio from "../../../assets/U1 WB/U7/audio/page 43- J/Item_005_cold.mp3";
import scaredAudio from "../../../assets/U1 WB/U7/audio/page 43- J/Item_006_scared.mp3";

/* =====================================================
   GRID
===================================================== */

const grid = [
  ["s", "c", "a", "r", "e", "d", "a"],
  ["e", "s", "p", "d", "s", "a", "d"],
  ["h", "c", "o", "l", "d", "c", "h"],
  ["h", "a", "p", "p", "y", "a", "y"],
  ["h", "u", "n", "g", "r", "y", "s"],
  ["b", "o", "r", "e", "d", "d", "a"],
  ["b", "d", "u", "c", "p", "d", "c"],
];

/* =====================================================
   WORD DATA
===================================================== */

const words = [
  {
    text: "sad",
    audio: sadAudio,
    coords: [
      [1, 4],
      [1, 5],
      [1, 6],
    ],
  },

  {
    text: "bored",
    audio: boredAudio,
    coords: [
      [5, 0],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
    ],
  },

  {
    text: "happy",
    audio: happyAudio,
    coords: [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
    ],
  },

  {
    text: "hungry",
    audio: hungryAudio,
    coords: [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
    ],
  },

  {
    text: "cold",
    audio: coldAudio,
    coords: [
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
    ],
  },

  {
    text: "scared",
    audio: scaredAudio,
    coords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
    ],
  },
];

/* =====================================================
   HELPERS
===================================================== */

const sameCoord = (a, b) => a?.[0] === b?.[0] && a?.[1] === b?.[1];

const samePath = (a, b) => {
  if (!a || !b || a.length !== b.length) {
    return false;
  }

  const forward = a.every((coord, index) => sameCoord(coord, b[index]));

  if (forward) {
    return true;
  }

  const reversed = [...b].reverse();

  return a.every((coord, index) => sameCoord(coord, reversed[index]));
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

  const [r1, c1] = start;

  const [r2, c2] = end;

  const rowDiff = r2 - r1;

  const colDiff = c2 - c1;

  const isHorizontal = rowDiff === 0;

  const isVertical = colDiff === 0;

  const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff);

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return [];
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;

  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

  const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1;

  return Array.from(
    {
      length,
    },
    (_, index) => [r1 + rowStep * index, c1 + colStep * index],
  );
};

/* =====================================================
   COMPONENT
===================================================== */

export default function WB_Unit7_Page5_Q2() {
  /* =====================================================
     FOUND WORDS
  ===================================================== */

  const [foundWords, setFoundWords] = useState([]);

  /* =====================================================
     FOUND PATHS
  ===================================================== */

  const [foundPaths, setFoundPaths] = useState([]);

  /* =====================================================
     CURRENT PREVIEW
  ===================================================== */

  const [previewPath, setPreviewPath] = useState([]);

  /* =====================================================
     WRONG WORDS AFTER CHECK
  ===================================================== */

  const [wrongWords, setWrongWords] = useState([]);

  const [wrongTry, setWrongTry] = useState(false);

  /* =====================================================
     FINAL STATES
  ===================================================== */

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const [activeCell, setActiveCell] = useState([0, 0]);

  const [keyboardStart, setKeyboardStart] = useState(null);

  /* =====================================================
     POINTER

     Mouse + Touch + Apple Pencil
  ===================================================== */

  const pointerSelectionRef = useRef(null);

  /*
    {
      start: [r,c],
      current: [r,c],
      pointerId
    }
  */

  const cellRefs = useRef({});

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =====================================================
     STOP AUDIO
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

  /* =====================================================
     PLAY AUDIO
  ===================================================== */

  const playWordAudio = (wordText) => {
    const word = words.find((item) => item.text === wordText);

    if (!word?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(word.audio);

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

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };
  };

  /* =====================================================
     CLEANUP AUDIO
  ===================================================== */

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  /* =====================================================
     CHECK IF CELL IS IN PATH
  ===================================================== */

  const pathContains = (path, r, c) =>
    path.some(([row, col]) => row === r && col === c);

  /* =====================================================
     FOUND CELL
  ===================================================== */

  const isFoundCell = (r, c) =>
    foundPaths.some((path) => pathContains(path, r, c));

  /* =====================================================
     PREVIEW CELL
  ===================================================== */

  const isPreviewCell = (r, c) => pathContains(previewPath, r, c);

  /* =====================================================
     FIND WORD FROM PATH
  ===================================================== */

  const getWordFromPath = (path) =>
    words.find((word) => samePath(path, word.coords));

  /* =====================================================
     COMMIT SELECTION
  ===================================================== */

  const commitSelection = (path) => {
    if (showAnswer || checkCompleted || !path.length) {
      setPreviewPath([]);

      return;
    }

    const matchedWord = getWordFromPath(path);

    /* =============================================
         WRONG SELECTION
      ============================================= */

    if (!matchedWord) {
      setWrongTry(true);

      setPreviewPath([]);

      window.setTimeout(() => {
        setWrongTry(false);
      }, 400);

      return;
    }

    /* =============================================
         ALREADY FOUND
      ============================================= */

    if (foundWords.includes(matchedWord.text)) {
      setPreviewPath([]);

      playWordAudio(matchedWord.text);

      return;
    }

    /* =============================================
         NEW CORRECT WORD
      ============================================= */

    setFoundWords((prev) => [...prev, matchedWord.text]);

    setFoundPaths((prev) => [...prev, [...matchedWord.coords]]);

    /*
        إذا كانت الكلمة عليها X من Check سابق
        شيله عنها فقط.
      */

    setWrongWords((prev) => prev.filter((text) => text !== matchedWord.text));

    setPreviewPath([]);

    /* =============================================
         PLAY AUDIO ON SUCCESS
      ============================================= */

    playWordAudio(matchedWord.text);
  };

  /* =====================================================
     GET CELL FROM POINTER POSITION
  ===================================================== */

  const getCellFromPoint = (clientX, clientY) => {
    const element = document.elementFromPoint(clientX, clientY);

    const cell = element?.closest?.("[data-grid-cell='true']");

    if (!cell) {
      return null;
    }

    const row = Number(cell.dataset.row);

    const col = Number(cell.dataset.col);

    if (Number.isNaN(row) || Number.isNaN(col)) {
      return null;
    }

    return [row, col];
  };

  /* =====================================================
     POINTER DOWN

     Mouse + Touch + Pencil
  ===================================================== */

  const handlePointerDown = (e, r, c) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    e.preventDefault();

    setKeyboardStart(null);

    setActiveCell([r, c]);

    pointerSelectionRef.current = {
      start: [r, c],

      current: [r, c],

      pointerId: e.pointerId,
    };

    setPreviewPath([[r, c]]);
  };

  /* =====================================================
     POINTER MOVE
  ===================================================== */

  useEffect(() => {
    const handlePointerMove = (e) => {
      const current = pointerSelectionRef.current;

      if (!current) {
        return;
      }

      const cell = getCellFromPoint(e.clientX, e.clientY);

      if (!cell) {
        return;
      }

      current.current = cell;

      const path = buildPath(current.start, cell);

      setPreviewPath(path);
    };

    const handlePointerUp = (e) => {
      const current = pointerSelectionRef.current;

      if (!current) {
        return;
      }

      const cell = getCellFromPoint(e.clientX, e.clientY);

      const end = cell || current.current;

      const path = buildPath(current.start, end);

      pointerSelectionRef.current = null;

      commitSelection(path);
    };

    const handlePointerCancel = () => {
      pointerSelectionRef.current = null;

      setPreviewPath([]);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });

    window.addEventListener("pointerup", handlePointerUp);

    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerUp);

      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [foundWords, showAnswer, checkCompleted]);

  /* =====================================================
     FOCUS CELL
  ===================================================== */

  const focusCell = (r, c) => {
    setActiveCell([r, c]);

    window.setTimeout(() => {
      cellRefs.current[`${r}-${c}`]?.focus();
    }, 0);
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleCellKeyDown = (e, r, c) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /* =============================================
         ENTER / SPACE
      ============================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      /*
          Start selection
        */

      if (!keyboardStart) {
        setKeyboardStart([r, c]);

        setPreviewPath([[r, c]]);

        return;
      }

      /*
          Commit selection
        */

      const path = buildPath(keyboardStart, [r, c]);

      setKeyboardStart(null);

      commitSelection(path);

      return;
    }

    /* =============================================
         ESCAPE
      ============================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      setKeyboardStart(null);

      setPreviewPath([]);

      return;
    }

    /* =============================================
         ARROWS
      ============================================= */

    const isArrow =
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight";

    if (!isArrow) {
      return;
    }

    e.preventDefault();

    const rowCount = grid.length;

    const colCount = grid[0].length;

    let nextRow = r;

    let nextCol = c;

    /* =============================================
         WRAP
      ============================================= */

    if (e.key === "ArrowUp") {
      nextRow = (r - 1 + rowCount) % rowCount;
    }

    if (e.key === "ArrowDown") {
      nextRow = (r + 1) % rowCount;
    }

    if (e.key === "ArrowLeft") {
      nextCol = (c - 1 + colCount) % colCount;
    }

    if (e.key === "ArrowRight") {
      nextCol = (c + 1) % colCount;
    }

    setActiveCell([nextRow, nextCol]);

    /*
        إذا keyboard selection شغال:
        حدث الـpreview.
      */

    if (keyboardStart) {
      const path = buildPath(keyboardStart, [nextRow, nextCol]);

      setPreviewPath(path);
    }

    focusCell(nextRow, nextCol);
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const missing = words
      .map((word) => word.text)
      .filter((text) => !foundWords.includes(text));

    setWrongWords(missing);

    const score = foundWords.length;

    const total = words.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
        <div style="
          font-size:20px;
          text-align:center;
        ">
          <span style="
            color:${color};
            font-weight:bold;
          ">
            Score: ${score} / ${total}
          </span>
        </div>
      `;

    if (score === total) {
      setCheckCompleted(true);

      setWrongWords([]);

      ValidationAlert.success(msg);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }

    /*
        مهم:
        ما بنقفل النشاط.
        الطالب يضل يكمل الكلمات الناقصة.
      */
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    setFoundWords(words.map((word) => word.text));

    setFoundPaths(words.map((word) => [...word.coords]));

    setPreviewPath([]);

    setWrongWords([]);

    setKeyboardStart(null);

    pointerSelectionRef.current = null;

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setFoundWords([]);

    setFoundPaths([]);

    setPreviewPath([]);

    setWrongWords([]);

    setWrongTry(false);

    setShowAnswer(false);

    setCheckCompleted(false);

    setKeyboardStart(null);

    setActiveCell([0, 0]);

    pointerSelectionRef.current = null;

    window.setTimeout(() => {
      cellRefs.current["0-0"]?.focus();
    }, 0);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="wordsearch-wrapper">
      <div className="page8-wrapper">
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="J"
            title="Look and complete the puzzle."
            subTitle="Find sad, bored, happy, hungry, cold, and scared in the grid."
          />

          <div className="container-word-grid-wb-u7-p5-q2">
            {/* =================================================
                GRID
            ================================================= */}

            <div
              className={`grid-wb-u1-p6-q2 ${wrongTry ? "shake" : ""}`}
              role="grid"
              aria-label="Word search puzzle. Use Tab to enter the grid, arrow keys to move, and Enter or Space to start and finish a word."
              style={{
                touchAction: "none",
              }}
            >
              {grid.map((row, rIdx) => (
                <div key={rIdx} className="row-wb-u1-p6-q2" role="row">
                  {row.map((cell, cIdx) => {
                    const active =
                      activeCell[0] === rIdx && activeCell[1] === cIdx;

                    const preview = isPreviewCell(rIdx, cIdx);

                    const found = isFoundCell(rIdx, cIdx);

                    return (
                      <div
                        key={cIdx}
                        ref={(element) => {
                          cellRefs.current[`${rIdx}-${cIdx}`] = element;
                        }}
                        data-grid-cell="true"
                        data-row={rIdx}
                        data-col={cIdx}
                        role="gridcell"
                        tabIndex={active ? 0 : -1}
                        aria-selected={preview || found}
                        aria-label={`Row ${rIdx + 1}, column ${
                          cIdx + 1
                        }, letter ${cell}.`}
                        className={[
                          "cell-wb-u1-p6-q2",

                          preview ? "grid-preview-wb-u7-p5-q2" : "",

                          found ? "found" : "",
                        ]
                          .join(" ")
                          .trim()}
                        onFocus={() => setActiveCell([rIdx, cIdx])}
                        onPointerDown={(e) => handlePointerDown(e, rIdx, cIdx)}
                        onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
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

            <div className="word-btn-wb-u7-p5-q2">
              {words.map((word) => {
                const found = foundWords.includes(word.text);

                const wrong = wrongWords.includes(word.text);

                const playing = playingWord === word.text;

                return (
                  <div
                    key={word.text}
                    className="word-label-wrapper-wb-u1-p6-q2"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`${word.text}. Press Enter or Space to hear the word.`}
                      className={`word-label-wb-u1-p6-q2 ${
                        found ? "done" : ""
                      }`}
                      onClick={() => playWordAudio(word.text)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          playWordAudio(word.text);
                        }
                      }}
                      style={{
                        position: "relative",
                      }}
                    >
                      {word.text}

                      {playing && (
                        <FaVolumeUp
                          size={14}
                          aria-hidden="true"
                          className="grid-word-audio-icon-wb-u7-p5-q2"
                        />
                      )}
                    </div>

                    {/* WRONG X */}

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
