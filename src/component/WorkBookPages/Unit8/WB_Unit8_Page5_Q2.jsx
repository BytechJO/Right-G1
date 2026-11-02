import React, { useEffect, useRef, useState } from "react";
import "./WB_Unit8_Page5_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIOS
===================================================== */

import touchAudio from "../../../assets/U1 WB/U8/audio/page 49 - J/Item_001_touch.mp3";
import eyeAudio from "../../../assets/U1 WB/U8/audio/page 49 - J/Item_002_eye.mp3";
import noseAudio from "../../../assets/U1 WB/U8/audio/page 49 - J/Item_003_nose.mp3";
import mouthAudio from "../../../assets/U1 WB/U8/audio/page 49 - J/Item_004_mouth.mp3";
import headAudio from "../../../assets/U1 WB/U8/audio/page 49 - J/Item_005_head.mp3";
import armAudio from "../../../assets/U1 WB/U8/audio/page 49 - J/Item_006_arm.mp3";

/* =====================================================
   GRID
===================================================== */

const GRID = [
  ["h", "g", "h", "e", "a", "d"],
  ["m", "t", "o", "u", "c", "h"],
  ["o", "e", "y", "e", "n", "g"],
  ["u", "a", "r", "m", "o", "g"],
  ["t", "o", "d", "y", "s", "h"],
  ["h", "e", "e", "a", "e", "c"],
];

/* =====================================================
   WORDS
===================================================== */

const WORDS = [
  {
    text: "touch",
    audio: touchAudio,
    coords: [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ],
  },

  {
    text: "eye",
    audio: eyeAudio,
    coords: [
      [2, 1],
      [2, 2],
      [2, 3],
    ],
  },

  {
    text: "nose",
    audio: noseAudio,
    coords: [
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
    ],
  },

  {
    text: "mouth",
    audio: mouthAudio,
    coords: [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ],
  },

  {
    text: "head",
    audio: headAudio,
    coords: [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
    ],
  },

  {
    text: "arm",
    audio: armAudio,
    coords: [
      [3, 1],
      [3, 2],
      [3, 3],
    ],
  },
];

/* =====================================================
   HELPERS
===================================================== */

const sameCoord = ([r1, c1], [r2, c2]) => r1 === r2 && c1 === c2;

const coordInList = (coords, r, c) =>
  coords.some(([row, col]) => row === r && col === c);

/*
  يبني path مستقيم:
  horizontal / vertical / diagonal
*/
const buildPath = (start, end) => {
  if (!start || !end) return [];

  const [r1, c1] = start;
  const [r2, c2] = end;

  const dr = r2 - r1;
  const dc = c2 - c1;

  const absR = Math.abs(dr);
  const absC = Math.abs(dc);

  const isHorizontal = dr === 0;

  const isVertical = dc === 0;

  const isDiagonal = absR === absC;

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return [];
  }

  const rowStep = dr === 0 ? 0 : dr > 0 ? 1 : -1;

  const colStep = dc === 0 ? 0 : dc > 0 ? 1 : -1;

  const length = Math.max(absR, absC);

  const path = [];

  for (let i = 0; i <= length; i++) {
    path.push([r1 + rowStep * i, c1 + colStep * i]);
  }

  return path;
};

/*
  نفس الكلمة ممكن تنسحب من أولها لآخرها
  أو بالعكس.
*/
const pathsMatch = (path1, path2) => {
  if (path1.length !== path2.length) {
    return false;
  }

  const forward = path1.every((coord, index) => sameCoord(coord, path2[index]));

  if (forward) return true;

  const reversed = [...path2].reverse();

  return path1.every((coord, index) => sameCoord(coord, reversed[index]));
};

/* =====================================================
   COMPONENT
===================================================== */

export default function WB_Unit8_Page5_Q2() {
  /* =================================================
     FOUND WORDS
  ================================================= */

  const [foundWords, setFoundWords] = useState([]);

  /*
    كل selection صحيح محفوظ لحاله.
  */
  const [foundSelections, setFoundSelections] = useState([]);

  /* =================================================
     POINTER SELECTION
  ================================================= */

  const [pointerStart, setPointerStart] = useState(null);

  const [pointerPreview, setPointerPreview] = useState([]);

  const [isPointerSelecting, setIsPointerSelecting] = useState(false);

  /* =================================================
     KEYBOARD
  ================================================= */

  const [activeCell, setActiveCell] = useState([0, 0]);

  const [keyboardStart, setKeyboardStart] = useState(null);

  const [keyboardPreview, setKeyboardPreview] = useState([]);

  const cellRefs = useRef({});

  /* =================================================
     STATE
  ================================================= */

  const [wrongTry, setWrongTry] = useState(false);

  const [wrongWords, setWrongWords] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);
  const [completed, setCompleted] = useState(false);
  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =================================================
     AUDIO HELPERS
  ================================================= */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current = null;
    }

    setPlayingWord(null);
  };

  const playWordAudio = (word) => {
    const item = WORDS.find((w) => w.text === word);

    if (!item?.audio) return;

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingWord(word);

    audio.play().catch(() => {
      setPlayingWord(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingWord(null);
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  /* =================================================
     CHECK PATH
  ================================================= */

  const evaluatePath = (path) => {
    if (!path || path.length === 0) {
      return false;
    }

    const matchedWord = WORDS.find(
      (word) =>
        !foundWords.includes(word.text) && pathsMatch(path, word.coords),
    );

    if (!matchedWord) {
      setWrongTry(true);

      setTimeout(() => {
        setWrongTry(false);
      }, 350);

      return false;
    }

    setFoundWords((prev) => [...prev, matchedWord.text]);

    setFoundSelections((prev) => [...prev, matchedWord.coords]);

    setWrongWords((prev) => prev.filter((word) => word !== matchedWord.text));

    /*
      صوت فقط لما تنوجد الكلمة صح.
    */
    playWordAudio(matchedWord.text);

    return true;
  };

  /* =================================================
     POINTER START
  ================================================= */

  const handlePointerDown = (r, c) => {
    if (showAnswerMode) {
      return;
    }

    /*
      ما نبدأ من خلية موجودة
      بكلمة مكتشفة.
    */
    if (isFoundCell(r, c)) {
      return;
    }

    setPointerStart([r, c]);

    setPointerPreview([[r, c]]);

    setIsPointerSelecting(true);
  };

  /* =================================================
     POINTER ENTER
  ================================================= */

  const handlePointerEnter = (r, c) => {
    if (!isPointerSelecting || !pointerStart) {
      return;
    }

    const path = buildPath(pointerStart, [r, c]);

    setPointerPreview(path);
  };

  /* =================================================
     POINTER END
  ================================================= */

  const finishPointerSelection = () => {
    if (!isPointerSelecting) {
      return;
    }

    evaluatePath(pointerPreview);

    setPointerStart(null);
    setPointerPreview([]);
    setIsPointerSelecting(false);
  };

  /* =================================================
     ACTIVE CELL
  ================================================= */

  const focusCell = (r, c) => {
    setActiveCell([r, c]);

    requestAnimationFrame(() => {
      cellRefs.current[`${r}-${c}`]?.focus?.();
    });
  };

  /* =================================================
     KEYBOARD ARROWS
  ================================================= */

  const handleCellKeyDown = (e, r, c) => {
    if (showAnswerMode) {
      return;
    }

    const rowCount = GRID.length;

    const colCount = GRID[0].length;

    let nextR = r;
    let nextC = c;

    /* =============================
       ARROWS + WRAP
    ============================= */

    if (e.key === "ArrowUp") {
      e.preventDefault();

      nextR = (r - 1 + rowCount) % rowCount;

      focusCell(nextR, c);

      if (keyboardStart) {
        setKeyboardPreview(buildPath(keyboardStart, [nextR, c]));
      }

      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      nextR = (r + 1) % rowCount;

      focusCell(nextR, c);

      if (keyboardStart) {
        setKeyboardPreview(buildPath(keyboardStart, [nextR, c]));
      }

      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();

      nextC = (c - 1 + colCount) % colCount;

      focusCell(r, nextC);

      if (keyboardStart) {
        setKeyboardPreview(buildPath(keyboardStart, [r, nextC]));
      }

      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();

      nextC = (c + 1) % colCount;

      focusCell(r, nextC);

      if (keyboardStart) {
        setKeyboardPreview(buildPath(keyboardStart, [r, nextC]));
      }

      return;
    }

    /* =============================
       ESCAPE
    ============================= */

    if (e.key === "Escape") {
      e.preventDefault();

      setKeyboardStart(null);

      setKeyboardPreview([]);

      return;
    }

    /* =============================
       ENTER / SPACE
    ============================= */

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();

    /*
      أول مرة:
      set start
    */

    if (!keyboardStart) {
      if (isFoundCell(r, c)) {
        return;
      }

      setKeyboardStart([r, c]);

      setKeyboardPreview([[r, c]]);

      return;
    }

    /*
      ثاني مرة:
      finish selection
    */

    const path = buildPath(keyboardStart, [r, c]);

    evaluatePath(path);

    setKeyboardStart(null);
    setKeyboardPreview([]);
  };

  /* =================================================
     FOUND CELL
  ================================================= */

  function isFoundCell(r, c) {
    return foundSelections.some((selection) => coordInList(selection, r, c));
  }

  /* =================================================
     PREVIEW CELL
  ================================================= */

  const isPreviewCell = (r, c) => {
    return (
      coordInList(pointerPreview, r, c) || coordInList(keyboardPreview, r, c)
    );
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    setShowAnswerMode(true);
    setCompleted(true);

    setFoundWords(WORDS.map((word) => word.text));

    setFoundSelections(WORDS.map((word) => word.coords));

    setWrongWords([]);

    setPointerStart(null);
    setPointerPreview([]);

    setKeyboardStart(null);
    setKeyboardPreview([]);
  };

  /* =================================================
     CHECK ANSWERS
  ================================================= */

  const checkAnswers = () => {
    // إذا Show Answer أو التمرين خلص صح بالكامل
    if (showAnswerMode || completed) {
      return;
    }

    const total = WORDS.length;
    const score = foundWords.length;

    /* =====================================================
     ما جاوب ولا كلمة
  ===================================================== */

    if (score === 0) {
      ValidationAlert.info(
        "Please find at least one word before checking your answer.",
      );

      return;
    }

    /* =====================================================
     WRONG WORDS
  ===================================================== */

    const wrong = WORDS.map((word) => word.text).filter(
      (word) => !foundWords.includes(word),
    );

    setWrongWords(wrong);

    /* =====================================================
     RESULT
  ===================================================== */

    const color = score === total ? "green" : "orange";

    const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    /* =====================================================
     ALL CORRECT
  ===================================================== */

    if (score === total) {
      setCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    /* =====================================================
     PARTIALLY CORRECT
  ===================================================== */

    ValidationAlert.warning(msg);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setFoundWords([]);
    setFoundSelections([]);

    setWrongTry(false);
    setWrongWords([]);

    setShowAnswerMode(false);
    setCompleted(false);

    setPointerStart(null);
    setPointerPreview([]);

    setIsPointerSelecting(false);

    setKeyboardStart(null);
    setKeyboardPreview([]);

    setActiveCell([0, 0]);

    requestAnimationFrame(() => {
      cellRefs.current["0-0"]?.focus?.();
    });
  };
  return (
    <div
      className="wordsearch-wrapper"
      onPointerUp={finishPointerSelection}
      onPointerCancel={finishPointerSelection}
    >
      <div className="page8-wrapper">
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="J"
            title="Find the words."
            subTitle="Find touch, eye, nose, mouth, head, and arm in the grid."
          />

          <div className="container-word-grid-wb-u8-p5-q2">
            {/* =========================================
                GRID
            ========================================= */}

            <div
              className={`grid-wb-u1-p6-q2 ${wrongTry ? "shake" : ""}`}
              role="grid"
              aria-label="Word search grid. Use arrow keys to move. Press Enter or Space to choose a start cell and again to choose an end cell."
            >
              {GRID.map((row, rIdx) => (
                <div key={rIdx} className="row-wb-u1-p6-q2" role="row">
                  {row.map((cell, cIdx) => {
                    const found = isFoundCell(rIdx, cIdx);

                    const preview = isPreviewCell(rIdx, cIdx);

                    const active =
                      activeCell[0] === rIdx && activeCell[1] === cIdx;

                    return (
                      <div
                        key={cIdx}
                        ref={(el) => {
                          cellRefs.current[`${rIdx}-${cIdx}`] = el;
                        }}
                        role="gridcell"
                        tabIndex={active ? 0 : -1}
                        aria-label={`Row ${rIdx + 1}, column ${
                          cIdx + 1
                        }, letter ${cell}`}
                        aria-selected={found || preview}
                        className={`
                              cell-wb-u1-p6-q2

                              ${preview ? "highlight" : ""}

                              ${found ? "found" : ""}
                            `}
                        onFocus={() => setActiveCell([rIdx, cIdx])}
                        onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                        onPointerDown={() => handlePointerDown(rIdx, cIdx)}
                        onPointerEnter={() => handlePointerEnter(rIdx, cIdx)}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* =========================================
                WORD LIST
            ========================================= */}

            <div className="word-btn-wb-u7-p5-q2">
              {WORDS.map((word) => {
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
                      tabIndex={found ? 0 : -1}
                      aria-label={
                        found
                          ? `${word.text}. Found. Press Enter or Space to hear it again.`
                          : word.text
                      }
                      className={`word-label-wb-u1-p6-q2 ${
                        found ? "done" : ""
                      }`}
                      onClick={() => {
                        if (found) {
                          playWordAudio(word.text);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!found) {
                          return;
                        }

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          playWordAudio(word.text);
                        }
                      }}
                    >
                      {word.text}

                      {playing && (
                        <span
                          className="word-audio-playing-wb-u8-p5-q2"
                          aria-hidden="true"
                        >
                          🔊
                        </span>
                      )}
                    </div>

                    {wrong && (
                      <span className="wrong-x-circle-wb-u1-p6-q2">✕</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          BUTTONS
      ========================================= */}

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
