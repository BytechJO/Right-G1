import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page5_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import redAudio from "../../../assets/U1 WB/U4/audio/page_23_q_j/Item_001_red.mp3";
import blueAudio from "../../../assets/U1 WB/U4/audio/page_23_q_j/Item_002_blue.mp3";
import triangleAudio from "../../../assets/U1 WB/U4/audio/page_23_q_j/Item_003_triangle.mp3";
import circleAudio from "../../../assets/U1 WB/U4/audio/page_23_q_j/Item_004_circle.mp3";
import squareAudio from "../../../assets/U1 WB/U4/audio/page_23_q_j/Item_005_square.mp3";

/* =====================================================
   GRID
===================================================== */

const grid = [
  ["b", "t", "e", "r", "i", "s", "u", "t"],
  ["s", "q", "u", "a", "r", "e", "b", "r"],
  ["u", "i", "c", "i", "l", "g", "w", "i"],
  ["b", "l", "u", "e", "u", "b", "r", "a"],
  ["e", "n", "n", "b", "n", "t", "r", "n"],
  ["c", "i", "r", "c", "l", "e", "u", "g"],
  ["s", "l", "b", "e", "a", "e", "r", "l"],
  ["i", "e", "l", "c", "d", "i", "c", "e"],
];

/* =====================================================
   WORDS
===================================================== */

const words = [
  {
    text: "red",
    audio: redAudio,
    coords: [
      [5, 2],
      [6, 3],
      [7, 4],
    ],
  },

  {
    text: "blue",
    audio: blueAudio,
    coords: [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
  },

  {
    text: "triangle",
    audio: triangleAudio,
    coords: [
      [0, 7],
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [7, 7],
    ],
  },

  {
    text: "circle",
    audio: circleAudio,
    coords: [
      [5, 0],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [5, 5],
    ],
  },

  {
    text: "square",
    audio: squareAudio,
    coords: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ],
  },
];

/* =====================================================
   HELPERS
===================================================== */

const sameCoord = ([r1, c1], [r2, c2]) => r1 === r2 && c1 === c2;

const samePath = (a, b) => {
  if (a.length !== b.length) return false;

  const normal = a.every((coord, index) => sameCoord(coord, b[index]));

  if (normal) return true;

  const reversed = [...b].reverse();

  return a.every((coord, index) => sameCoord(coord, reversed[index]));
};

/*
  بنبني مسار مستقيم:
  horizontal / vertical / diagonal
*/

const buildPath = (start, end) => {
  if (!start || !end) return [];

  const [r1, c1] = start;
  const [r2, c2] = end;

  const rowDiff = r2 - r1;
  const colDiff = c2 - c1;

  const absRow = Math.abs(rowDiff);
  const absCol = Math.abs(colDiff);

  const isHorizontal = rowDiff === 0;
  const isVertical = colDiff === 0;
  const isDiagonal = absRow === absCol;

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return [start];
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;

  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

  const length = Math.max(absRow, absCol);

  const path = [];

  for (let i = 0; i <= length; i++) {
    path.push([r1 + rowStep * i, c1 + colStep * i]);
  }

  return path;
};

/* =====================================================
   COMPONENT
===================================================== */

export default function WB_Unit4_Page5_Q2() {
  /* =================================================
     FOUND / CHECK
  ================================================= */

  const [foundWords, setFoundWords] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [allSelections, setAllSelections] = useState([]);

  /* =================================================
     SELECTION
  ================================================= */

  const [selectionStart, setSelectionStart] = useState(null);

  const [previewSelection, setPreviewSelection] = useState([]);

  const [isPointerSelecting, setIsPointerSelecting] = useState(false);

  /* =================================================
     KEYBOARD
  ================================================= */

  const [activeCell, setActiveCell] = useState([0, 0]);

  const [keyboardStart, setKeyboardStart] = useState(null);

  const cellRefs = useRef({});

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

  const playWordAudio = (word) => {
    if (!word?.audio) return;

    stopAudio();

    const audio = new Audio(word.audio);

    audioRef.current = audio;

    setPlayingWord(word.text);

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

  const cellKey = (r, c) => `${r}-${c}`;

  const isPreviewCell = (r, c) =>
    previewSelection.some(([pr, pc]) => pr === r && pc === c);

  const isFoundCell = (r, c) =>
    words.some(
      (word) =>
        foundWords.includes(word.text) &&
        word.coords.some(([wr, wc]) => wr === r && wc === c),
    );

  const isShowAnswerCell = (r, c) =>
    allSelections.some((selection) =>
      selection.some(([sr, sc]) => sr === r && sc === c),
    );

  const isHighlighted = (r, c) =>
    isPreviewCell(r, c) || isFoundCell(r, c) || isShowAnswerCell(r, c);

  /* =================================================
     CHECK A SELECTED PATH
  ================================================= */

  const finishSelection = (path) => {
    if (showAnswer || checkCompleted || !path?.length) {
      return;
    }

    const matchedWord = words.find(
      (word) => !foundWords.includes(word.text) && samePath(path, word.coords),
    );

    if (matchedWord) {
      setFoundWords((prev) => [...prev, matchedWord.text]);

      /*
        لو كان عليه X من Check سابق
        شيله فقط عنه
      */

      setWrongWords((prev) => prev.filter((word) => word !== matchedWord.text));

      playWordAudio(matchedWord);
    }

    setSelectionStart(null);
    setPreviewSelection([]);

    setKeyboardStart(null);
  };

  /* =================================================
     POINTER / MOUSE / TOUCH / PEN
  ================================================= */

  /* =====================================================
   POINTER / MOUSE / TOUCH / PEN
===================================================== */

  const handlePointerDown = (e, r, c) => {
    if (showAnswer || checkCompleted) return;

    /*
    إذا الخلية من كلمة موجودة صح، لكن بنفس الوقت
    داخلة بكلمة ثانية لسا مش موجودة، خليها قابلة للاستخدام.
  */
    const neededByUnfoundWord = words.some(
      (word) =>
        !foundWords.includes(word.text) &&
        word.coords.some(([wr, wc]) => wr === r && wc === c),
    );

    if (isFoundCell(r, c) && !neededByUnfoundWord) {
      return;
    }

    e.preventDefault();

    /*
    مهم:
    ما بنستخدم setPointerCapture هون
    لأنه كان مانع السحب من الانتقال بين الخلايا.
  */

    setIsPointerSelecting(true);

    setSelectionStart([r, c]);

    setPreviewSelection([[r, c]]);
  };

  /* =====================================================
   POINTER MOVE
===================================================== */

  const handlePointerMove = (e) => {
    if (
      !isPointerSelecting ||
      !selectionStart ||
      showAnswer ||
      checkCompleted
    ) {
      return;
    }

    e.preventDefault();

    /*
    نجيب الخلية الموجودة فعليًا تحت المؤشر.
    هاي بتشتغل للماوس واللمس والقلم.
  */
    const element = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest("[data-grid-cell='true']");

    if (!element) return;

    const r = Number(element.dataset.row);
    const c = Number(element.dataset.col);

    if (Number.isNaN(r) || Number.isNaN(c)) {
      return;
    }

    const path = buildPath(selectionStart, [r, c]);

    setPreviewSelection(path);
  };

  /* =====================================================
   POINTER UP
===================================================== */

  const handlePointerUp = (e) => {
    if (!isPointerSelecting || !selectionStart) {
      return;
    }

    e.preventDefault();

    const element = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest("[data-grid-cell='true']");

    let endCoord = selectionStart;

    if (element) {
      const r = Number(element.dataset.row);
      const c = Number(element.dataset.col);

      if (!Number.isNaN(r) && !Number.isNaN(c)) {
        endCoord = [r, c];
      }
    }

    const path = buildPath(selectionStart, endCoord);

    setIsPointerSelecting(false);

    finishSelection(path);
  };

  /* =====================================================
   POINTER CANCEL
===================================================== */

  const handlePointerCancel = () => {
    setIsPointerSelecting(false);

    setSelectionStart(null);

    setPreviewSelection([]);
  };
  /* =================================================
     KEYBOARD MOVE
  ================================================= */

  const moveKeyboardCell = (r, c, key) => {
    let nextR = r;
    let nextC = c;

    if (key === "ArrowLeft") {
      nextC = c === 0 ? grid[0].length - 1 : c - 1;
    }

    if (key === "ArrowRight") {
      nextC = c === grid[0].length - 1 ? 0 : c + 1;
    }

    if (key === "ArrowUp") {
      nextR = r === 0 ? grid.length - 1 : r - 1;
    }

    if (key === "ArrowDown") {
      nextR = r === grid.length - 1 ? 0 : r + 1;
    }

    setActiveCell([nextR, nextC]);

    /*
      إذا بلشنا تحديد:
      preview يتغير مع الأسهم
    */

    if (keyboardStart) {
      setPreviewSelection(buildPath(keyboardStart, [nextR, nextC]));
    }

    requestAnimationFrame(() => {
      cellRefs.current[cellKey(nextR, nextC)]?.focus();
    });
  };

  /* =================================================
     KEYBOARD CELL
  ================================================= */

  const handleCellKeyDown = (e, r, c) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const arrows = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    if (arrows.includes(e.key)) {
      e.preventDefault();

      moveKeyboardCell(r, c, e.key);

      return;
    }

    /* =========================================
       ENTER / SPACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      /*
        أول Enter:
        بداية الكلمة
      */

      if (!keyboardStart) {
        if (isFoundCell(r, c)) {
          return;
        }

        setKeyboardStart([r, c]);

        setSelectionStart([r, c]);

        setPreviewSelection([[r, c]]);

        return;
      }

      /*
        ثاني Enter:
        نهاية الكلمة
      */

      const path = buildPath(keyboardStart, [r, c]);

      finishSelection(path);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      if (keyboardStart) {
        e.preventDefault();
        e.stopPropagation();

        setKeyboardStart(null);

        setSelectionStart(null);

        setPreviewSelection([]);
      }
    }
  };

  /* =================================================
     CHECK ANSWER
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const missing = words
      .map((word) => word.text)
      .filter((word) => !foundWords.includes(word));

    setWrongWords(missing);

    const total = words.length;

    const score = foundWords.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    /*
      مهم:
      لو مش كلهم صح
      ما نقفل الشبكة.
    */

    if (score === total) {
      setWrongWords([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setFoundWords(words.map((word) => word.text));

    setWrongWords([]);

    setAllSelections(words.map((word) => word.coords));

    setSelectionStart(null);

    setPreviewSelection([]);

    setKeyboardStart(null);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setFoundWords([]);

    setWrongWords([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setAllSelections([]);

    setSelectionStart(null);

    setPreviewSelection([]);

    setKeyboardStart(null);

    setIsPointerSelecting(false);

    setActiveCell([0, 0]);

    requestAnimationFrame(() => {
      cellRefs.current["0-0"]?.focus();
    });
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <div className="wordsearch-wrapper">
      <div className="page8-wrapper">
        <div
          className="div-forall"
          style={{
            gap: "20px",
          }}
        >
          <ExerciseHeader
            sectionLetter="J"
            title="Find the words."
            subTitle="Find red, blue, triangle, circle, and square in the grid."
          />

          {/* =================================================
              WORD BANK + AUDIO
          ================================================= */}

          <div className="word-bank-wb-u4-p5-q1 w-full">
            {words.map((word) => {
              const isPlaying = playingWord === word.text;

              const isFound = foundWords.includes(word.text);

              const isWrong = wrongWords.includes(word.text);

              return (
                <span
                  key={word.text}
                  role="button"
                  tabIndex={0}
                  aria-label={`${
                    isFound ? `${word.text}, found.` : word.text
                  } Press Enter or Space to play audio.`}
                  onClick={() => playWordAudio(word)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();

                      playWordAudio(word);
                    }
                  }}
                  className={`
          word-box-wb-u1-p8-q2
          word-audio-wb-u4-p5-q2
          ${isFound ? "word-found-wb-u4-p5-q2" : ""}
        `}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <span>{word.text}</span>

                  {/* صوت */}
                  {isPlaying && (
                    <FaVolumeUp
                      size={15}
                      aria-hidden="true"
                      className="word-audio-icon-wb-u4-p5-q2"
                    />
                  )}

                  {/* صح */}
                  {isFound && (
                    <span className="word-check-wb-u4-p5-q2" aria-hidden="true">
                      ✓
                    </span>
                  )}

                  {/* غلط */}
                  {isWrong && (
                    <span
                      className="wrong-x-circle-wb-u4-p5-q1"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          {/* =================================================
              GRID
          ================================================= */}

          <div className="container-word-grid-wb-u2-p5-q2">
            <div
              className="grid-wb-u1-p6-q2"
              role="grid"
              aria-label="Word search grid"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              style={{
                touchAction: "none",
              }}
            >
              {grid.map((row, rIdx) => (
                <div key={rIdx} className="row-wb-u1-p6-q2" role="row">
                  {row.map((cell, cIdx) => {
                    const isActive =
                      activeCell[0] === rIdx && activeCell[1] === cIdx;

                    const found = isFoundCell(rIdx, cIdx);

                    const highlighted = isHighlighted(rIdx, cIdx);

                    return (
                      <div
                        key={cIdx}
                        ref={(el) => {
                          cellRefs.current[cellKey(rIdx, cIdx)] = el;
                        }}
                        role="gridcell"
                        data-grid-cell="true"
                        data-row={rIdx}
                        data-col={cIdx}
                        tabIndex={isActive ? 0 : -1}
                        aria-label={`Row ${rIdx + 1}, column ${
                          cIdx + 1
                        }, letter ${cell}${
                          found ? ", part of a found word" : ""
                        }`}
                        aria-selected={highlighted}
                        className={`cell-wb-u2-p5-q2
    ${highlighted ? "highlight" : ""}
    ${found ? "found" : ""}
    ${isPreviewCell(rIdx, cIdx) ? "grid-preview-wb-u4-p5-q2" : ""}
  `}
                        onFocus={() => {
                          setActiveCell([rIdx, cIdx]);

                          if (keyboardStart) {
                            setPreviewSelection(
                              buildPath(keyboardStart, [rIdx, cIdx]),
                            );
                          }
                        }}
                        onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                        onPointerDown={(e) => handlePointerDown(e, rIdx, cIdx)}
                        style={{
                          touchAction: "none",
                          userSelect: "none",
                        }}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              ))}
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
