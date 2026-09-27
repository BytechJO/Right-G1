import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit1_Page6_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";

// ========================================
// AUDIO
// ========================================

import goodbyeAudio from "../../../assets/U1 WB/U1/page_6/Item_001_goodbye.mp3";
import helloAudio from "../../../assets/U1 WB/U1/page_6/Item_002_hello.mp3";
import howAreYouAudio from "../../../assets/U1 WB/U1/page_6/Item_003_how_are_you.mp3";

// ========================================
// GRID
// ========================================

const grid = [
  ["y", "h", "d", "y", "w", "u", "h"],
  ["l", "o", "u", "r", "h", "o", "e"],
  ["d", "w", "o", "b", "h", "y", "l"],
  ["e", "a", "u", "e", "b", "e", "l"],
  ["e", "r", "b", "d", "o", "r", "o"],
  ["u", "e", "o", "r", "h", "a", "e"],
  ["i", "y", "o", "o", "b", "o", "w"],
  ["g", "o", "o", "d", "b", "y", "e"],
  ["o", "u", "l", "l", "e", "h", "h"],
];

// ========================================
// WORDS
// ========================================

const words = [
  {
    text: "goodbye",
    audio: goodbyeAudio,
    coords: [
      [7, 0],
      [7, 1],
      [7, 2],
      [7, 3],
      [7, 4],
      [7, 5],
      [7, 6],
    ],
  },

  {
    text: "hello",
    audio: helloAudio,
    coords: [
      [0, 6],
      [1, 6],
      [2, 6],
      [3, 6],
      [4, 6],
    ],
  },

  {
    text: "how are you",
    audio: howAreYouAudio,
    coords: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
      [7, 1],
      [8, 1],
    ],
  },
];

// ========================================
// HELPERS
// ========================================

const sameCoord = (a, b) => a[0] === b[0] && a[1] === b[1];

const sameCoords = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((coord, index) => sameCoord(coord, b[index]));
};

const reverseCoords = (coords) => [...coords].reverse();

const getPath = (start, end) => {
  const [r1, c1] = start;
  const [r2, c2] = end;

  const rowDiff = r2 - r1;
  const colDiff = c2 - c1;

  const isStraight =
    rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);

  if (!isStraight) {
    return [];
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;

  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

  const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1;

  return Array.from({ length }, (_, index) => [
    r1 + rowStep * index,
    c1 + colStep * index,
  ]);
};

// ========================================
// MAIN
// ========================================

export default function WB_Unit1_Page6_Q2() {
  const [startCell, setStartCell] = useState(null);

  const [previewCells, setPreviewCells] = useState([]);

  const [foundWords, setFoundWords] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [locked, setLocked] = useState(false);

  const [announcement, setAnnouncement] = useState("");

  const [playingWord, setPlayingWord] = useState(null);

  const [activeCell, setActiveCell] = useState([0, 0]);

  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef(null);

  const audioRef = useRef(null);

  const cellRefs = useRef({});

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingWord(null);
  };

  const playWordAudio = (word) => {
    if (!word.audio) return;

    stopAudio();

    const audio = new Audio(word.audio);

    audioRef.current = audio;

    setPlayingWord(word.text);

    audio.play().catch(() => {
      setPlayingWord(null);
    });

    audio.onended = () => {
      setPlayingWord(null);
      audioRef.current = null;
    };
  };

  // ========================================
  // CELL STATE
  // ========================================

  const isFoundCell = (r, c) => {
    return words.some(
      (word) =>
        foundWords.includes(word.text) &&
        word.coords.some(([wr, wc]) => wr === r && wc === c),
    );
  };

  const isPreviewCell = (r, c) =>
    previewCells.some(([pr, pc]) => pr === r && pc === c);

  // ========================================
  // START
  // ========================================

  const startSelection = (r, c) => {
    if (locked || showAnswer || isFoundCell(r, c)) {
      return;
    }

    setStartCell([r, c]);

    setPreviewCells([[r, c]]);

    setAnnouncement(
      `Selection started at letter ${grid[r][c]}. Move to the last letter and press Enter.`,
    );
  };

  // ========================================
  // COMPLETE
  // ========================================

  const completeSelection = (endR, endC) => {
    if (!startCell) {
      startSelection(endR, endC);

      return;
    }

    const path = getPath(startCell, [endR, endC]);

    if (path.length === 0) {
      setAnnouncement("That selection is not in a straight line.");

      setStartCell(null);
      setPreviewCells([]);

      return;
    }

    const matchedWord = words.find((word) => {
      if (foundWords.includes(word.text)) {
        return false;
      }

      return (
        sameCoords(path, word.coords) ||
        sameCoords(path, reverseCoords(word.coords))
      );
    });

    if (matchedWord) {
      setFoundWords((prev) => [...prev, matchedWord.text]);

      setWrongWords((prev) => prev.filter((word) => word !== matchedWord.text));

      setAnnouncement(`${matchedWord.text} found.`);

      playWordAudio(matchedWord);
    } else {
      setAnnouncement("That is not one of the target words.");
    }

    setStartCell(null);

    setPreviewCells([]);
  };

  // ========================================
  // CLICK
  // ========================================

  const handleCellClick = (r, c) => {
    if (locked || showAnswer) {
      return;
    }

    if (!startCell) {
      startSelection(r, c);
    } else {
      completeSelection(r, c);
    }
  };

  // ========================================
  // KEYBOARD
  // ========================================

  const handleCellKeyDown = (e, r, c) => {
    if (locked || showAnswer) {
      return;
    }

    let nextR = r;
    let nextC = c;

    // ==================================
    // ARROWS
    // ==================================

    if (e.key === "ArrowRight") {
      e.preventDefault();

      nextC = c === grid[r].length - 1 ? 0 : c + 1;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();

      nextC = c === 0 ? grid[r].length - 1 : c - 1;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      nextR = r === grid.length - 1 ? 0 : r + 1;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      nextR = r === 0 ? grid.length - 1 : r - 1;
    }

    // إذا تحركنا
    if (nextR !== r || nextC !== c) {
      setActiveCell([nextR, nextC]);

      // إذا في selection شغال
      // حدث preview line/cells
      if (startCell) {
        const path = getPath(startCell, [nextR, nextC]);

        if (path.length > 0) {
          setPreviewCells(path);
        }
      }

      requestAnimationFrame(() => {
        cellRefs.current[`${nextR}-${nextC}`]?.focus();
      });

      return;
    }

    // ==================================
    // ENTER / SPACE
    // ==================================

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      handleCellClick(r, c);

      return;
    }

    // ==================================
    // ESC
    // ==================================

    if (e.key === "Escape" && startCell) {
      e.preventDefault();

      setStartCell(null);

      setPreviewCells([]);

      setAnnouncement("Selection cancelled.");
    }
  };

  // ========================================
  // POINTER DRAG
  // ========================================

  const handlePointerDown = (r, c) => {
    if (locked || showAnswer) {
      return;
    }

    setIsDragging(true);

    dragStartRef.current = [r, c];

    setStartCell([r, c]);

    setPreviewCells([[r, c]]);
  };

  const handlePointerEnter = (r, c) => {
    if (!isDragging || !dragStartRef.current) {
      return;
    }

    const path = getPath(dragStartRef.current, [r, c]);

    if (path.length > 0) {
      setPreviewCells(path);
    }
  };

  const handlePointerUp = (r, c) => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    const start = dragStartRef.current;

    dragStartRef.current = null;

    if (!start) {
      return;
    }

    setStartCell(start);

    window.setTimeout(() => {
      completeSelection(r, c);
    }, 0);
  };

  // ========================================
  // CHECK
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || locked) {
      return;
    }

    if (foundWords.length === 0) {
      ValidationAlert.info(
        "Oops!",
        "Please find at least one word before checking.",
      );

      return;
    }

    const missingWords = words
      .map((word) => word.text)
      .filter((word) => !foundWords.includes(word));

    setWrongWords(missingWords);

    setLocked(true);

    setStartCell(null);

    setPreviewCells([]);

    const total = words.length;

    const correct = foundWords.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    if (correct === total) {
      ValidationAlert.success(msg);
    } else if (correct === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  // ========================================
  // SHOW ANSWER
  // ========================================

  const showAnswers = () => {
    stopAudio();

    setFoundWords(words.map((word) => word.text));

    setWrongWords([]);

    setStartCell(null);

    setPreviewCells([]);

    setShowAnswer(true);

    setLocked(true);

    setAnnouncement("All answers shown.");
  };

  // ========================================
  // RESET
  // ========================================

  const reset = () => {
    stopAudio();

    setFoundWords([]);

    setWrongWords([]);

    setStartCell(null);

    setPreviewCells([]);

    setShowAnswer(false);

    setLocked(false);

    setIsDragging(false);

    dragStartRef.current = null;

    setActiveCell([0, 0]);

    setAnnouncement("Activity reset.");
  };

  // ========================================
  // CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="wordsearch-wrapper">
      {/* Screen Reader */}

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="page8-wrapper">
        <div className="div-forall">
          <h3 className="header-title-page8">
            <span className="ex-A">H</span>
            Find the words.
          </h3>

          <div className="container-word-grid-wb-u1-p6-q2">
            {/* ==============================
                GRID
            ============================== */}

            <div
              className="grid-wb-u1-p6-q2"
              role="grid"
              aria-label="Word search grid. Use arrow keys to move. Press Enter or Space on the first and last letter."
            >
              {grid.map((row, rIdx) => (
                <div key={rIdx} className="row-wb-u1-p6-q2" role="row">
                  {row.map((cell, cIdx) => {
                    const preview = isPreviewCell(rIdx, cIdx);

                    const found = isFoundCell(rIdx, cIdx);

                    const isStart =
                      startCell &&
                      startCell[0] === rIdx &&
                      startCell[1] === cIdx;

                    const isActiveCell =
                      activeCell[0] === rIdx && activeCell[1] === cIdx;

                    return (
                      <div
                        key={cIdx}
                        ref={(node) => {
                          cellRefs.current[`${rIdx}-${cIdx}`] = node;
                        }}
                        role="gridcell"
                        tabIndex={locked ? -1 : isActiveCell ? 0 : -1}
                        aria-label={`Row ${rIdx + 1}, column ${
                          cIdx + 1
                        }, letter ${cell}${
                          found ? ", found word" : preview ? ", selected" : ""
                        }`}
                        aria-selected={preview || found}
                        onFocus={() => {
                          setActiveCell([rIdx, cIdx]);
                        }}
                        className={`
                              cell-wb-u1-p6-q2
                              ${preview ? "highlight" : ""}
                              ${found ? "found" : ""}
                              ${isStart ? "start-cell" : ""}
                            `}
                        onClick={() => handleCellClick(rIdx, cIdx)}
                        onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                        onPointerDown={() => handlePointerDown(rIdx, cIdx)}
                        onPointerEnter={() => handlePointerEnter(rIdx, cIdx)}
                        onPointerUp={() => handlePointerUp(rIdx, cIdx)}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ==============================
                WORD LIST
            ============================== */}

            <div className="word-btn-wb-u1-p6-q2">
              {words.map((word) => {
                const found = foundWords.includes(word.text);

                const playing = playingWord === word.text;

                return (
                  <div
                    key={word.text}
                    className="word-label-wrapper-wb-u1-p6-q2"
                  >
                    <button
                      type="button"
                      className={`word-label-wb-u1-p6-q2 ${
                        found ? "done" : ""
                      }`}
                      onClick={() => playWordAudio(word)}
                      aria-label={`Play ${word.text}`}
                    >
                      <span>{word.text}</span>

                      {playing && (
                        <span
                          className="playing-word-wb-u1-p6-q2"
                          aria-hidden="true"
                        >
                          🔊
                        </span>
                      )}

                      {found && (
                        <span
                          className="found-check-wb-u1-p6-q2"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      )}
                    </button>

                    {wrongWords.includes(word.text) && (
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

      {/* ==============================
          BUTTONS
      ============================== */}

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
