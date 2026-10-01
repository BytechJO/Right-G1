import React, { useEffect, useRef, useState } from "react";
import "./WB_Unit2_Page5_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import img1 from "../../../assets/U1 WB/U2/U2P13EXEJ-01.svg";
import img2 from "../../../assets/U1 WB/U2/U2P13EXEJ-02.svg";
import img3 from "../../../assets/U1 WB/U2/U2P13EXEJ-03.svg";
import img4 from "../../../assets/U1 WB/U2/U2P13EXEJ-04.svg";
import img5 from "../../../assets/U1 WB/U2/U2P13EXEJ-05.svg";
import img6 from "../../../assets/U1 WB/U2/U2P13EXEJ-06.svg";

/* =====================================================
   AUDIO
===================================================== */

import cakeAudio from "../../../assets/U1 WB/U2/page_13/Item_001_cake.mp3";
import jelloAudio from "../../../assets/U1 WB/U2/page_13/Item_002_jello.mp3";
import balloonsAudio from "../../../assets/U1 WB/U2/page_13/Item_003_balloons.mp3";
import cardAudio from "../../../assets/U1 WB/U2/page_13/Item_004_card.mp3";
import hatAudio from "../../../assets/U1 WB/U2/page_13/Item_005_hat.mp3";
import presentAudio from "../../../assets/U1 WB/U2/page_13/Item_006_present.mp3";

/* =====================================================
   GRID
===================================================== */

const grid = [
  ["a", "l", "c", "k", "c", "a", "r", "d"],
  ["b", "a", "l", "l", "o", "o", "n", "s"],
  ["e", "r", "j", "p", "s", "o", "t", "a"],
  ["p", "r", "e", "s", "e", "n", "t", "j"],
  ["o", "s", "l", "r", "c", "o", "p", "l"],
  ["e", "e", "l", "a", "h", "a", "t", "h"],
  ["s", "n", "o", "o", "l", "l", "k", "b"],
  ["e", "t", "p", "e", "a", "t", "h", "e"],
];

/* =====================================================
   WORDS
===================================================== */

const words = [
  {
    text: "cake",
    src: img1,
    alt: "Birthday cake",
    audio: cakeAudio,
    coords: [
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
    ],
  },

  {
    text: "jello",
    src: img2,
    alt: "Jello",
    audio: jelloAudio,
    coords: [
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
    ],
  },

  {
    text: "balloons",
    src: img3,
    alt: "Balloons",
    audio: balloonsAudio,
    coords: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [1, 7],
    ],
  },

  {
    text: "card",
    src: img4,
    alt: "Birthday card",
    audio: cardAudio,
    coords: [
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
    ],
  },

  {
    text: "present",
    src: img5,
    alt: "Birthday present",
    audio: presentAudio,
    coords: [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ],
  },

  {
    text: "hat",
    src: img6,
    alt: "Party hat",
    audio: hatAudio,
    coords: [
      [5, 4],
      [5, 5],
      [5, 6],
    ],
  },
];

/* =====================================================
   HELPERS
===================================================== */

const sameCoord = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};

const sameCoords = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((coord, index) => {
    return sameCoord(coord, b[index]);
  });
};

const reverseCoords = (coords) => {
  return [...coords].reverse();
};

/*
  يرجع كل الخلايا بين أول حرف وآخر حرف
  فقط إذا الاختيار:
  - أفقي
  - عمودي
  - قطري
*/
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

/* =====================================================
   COMPONENT
===================================================== */

export default function WB_Unit2_Page5_Q2() {
  /* =====================================================
     SELECTION
  ===================================================== */

  const [startCell, setStartCell] = useState(null);

  const [previewCells, setPreviewCells] = useState([]);

  const [foundWords, setFoundWords] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  /*
    true فقط لما:
    - كل الكلمات صحيحة
    - أو Show Answer
  */
  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     ACCESSIBILITY
  ===================================================== */

  const [announcement, setAnnouncement] = useState("");

  const [activeCell, setActiveCell] = useState([0, 0]);

  /* =====================================================
     POINTER DRAG
  ===================================================== */

  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =====================================================
     CELL REFS
  ===================================================== */

  const cellRefs = useRef({});

  /* =====================================================
     AUDIO FUNCTIONS
  ===================================================== */

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingWord(null);
  };

  const playWordAudio = (word) => {
    if (!word?.audio) return;

    stopAudio();

    const audio = new Audio(word.audio);

    audioRef.current = audio;

    setPlayingWord(word.text);

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
     CELL STATES
  ===================================================== */

  const isFoundCell = (r, c) => {
    return words.some(
      (word) =>
        foundWords.includes(word.text) &&
        word.coords.some(([wr, wc]) => wr === r && wc === c),
    );
  };

  const isPreviewCell = (r, c) => {
    return previewCells.some(([pr, pc]) => pr === r && pc === c);
  };

  /* =====================================================
     START SELECTION
  ===================================================== */

  const startSelection = (r, c) => {
    /*
      الكلمات الصحيحة محمية،
      بس باقي الشبكة تظل شغالة.
    */

    if (checkCompleted || showAnswer || isFoundCell(r, c)) {
      return;
    }

    setStartCell([r, c]);

    setPreviewCells([[r, c]]);

    setAnnouncement(
      `Selection started at letter ${grid[r][c]}. Move to the last letter and press Enter.`,
    );
  };

  /* =====================================================
     COMPLETE SELECTION
  ===================================================== */

  const completeSelection = (endR, endC) => {
    if (checkCompleted || showAnswer) {
      return;
    }

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
      /*
          ما نسمح بإضافة كلمة
          موجودة أصلاً.
        */

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

      /*
        إذا عليها X من Check سابق
        نشيله عنها.
      */

      setWrongWords((prev) => prev.filter((word) => word !== matchedWord.text));

      setAnnouncement(`${matchedWord.text} found.`);

      /*
        شغّل صوت الكلمة لما يلاقيها.
      */

      playWordAudio(matchedWord);
    } else {
      setAnnouncement("That is not one of the target words.");
    }

    setStartCell(null);
    setPreviewCells([]);
  };

  /* =====================================================
     CLICK
  ===================================================== */

  const handleCellClick = (r, c) => {
    if (checkCompleted || showAnswer) {
      return;
    }

    if (!startCell) {
      startSelection(r, c);
    } else {
      completeSelection(r, c);
    }
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleCellKeyDown = (e, r, c) => {
    if (checkCompleted || showAnswer) {
      return;
    }

    let nextR = r;
    let nextC = c;

    /* -------------------------
       RIGHT
    ------------------------- */

    if (e.key === "ArrowRight") {
      e.preventDefault();

      nextC = c === grid[r].length - 1 ? 0 : c + 1;
    }

    /* -------------------------
       LEFT
    ------------------------- */

    if (e.key === "ArrowLeft") {
      e.preventDefault();

      nextC = c === 0 ? grid[r].length - 1 : c - 1;
    }

    /* -------------------------
       DOWN
    ------------------------- */

    if (e.key === "ArrowDown") {
      e.preventDefault();

      nextR = r === grid.length - 1 ? 0 : r + 1;
    }

    /* -------------------------
       UP
    ------------------------- */

    if (e.key === "ArrowUp") {
      e.preventDefault();

      nextR = r === 0 ? grid.length - 1 : r - 1;
    }

    /* -------------------------
       MOVE FOCUS
    ------------------------- */

    if (nextR !== r || nextC !== c) {
      setActiveCell([nextR, nextC]);

      /*
        إذا في selection شغال
        نظهر preview.
      */

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

    /* -------------------------
       ENTER / SPACE
    ------------------------- */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      handleCellClick(r, c);

      return;
    }

    /* -------------------------
       ESCAPE
    ------------------------- */

    if (e.key === "Escape" && startCell) {
      e.preventDefault();

      setStartCell(null);

      setPreviewCells([]);

      setAnnouncement("Selection cancelled.");
    }
  };

  /* =====================================================
     POINTER DRAG
  ===================================================== */
  /* =====================================================
   POINTER DRAG
   Mouse + iPad + Apple Pencil
===================================================== */

  const pointerStartRef = useRef(null);
  const pointerCurrentRef = useRef(null);
  const pointerDraggingRef = useRef(false);

  const getCellFromPoint = (clientX, clientY) => {
    const el = document.elementFromPoint(clientX, clientY);

    if (!el) return null;

    const cell = el.closest?.("[data-wordsearch-cell='true']");

    if (!cell) return null;

    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);

    if (Number.isNaN(r) || Number.isNaN(c)) {
      return null;
    }

    return [r, c];
  };

  const handlePointerDown = (e, r, c) => {
    if (checkCompleted || showAnswer || isFoundCell(r, c)) {
      return;
    }

    e.preventDefault();

    pointerDraggingRef.current = true;

    pointerStartRef.current = [r, c];
    pointerCurrentRef.current = [r, c];

    setStartCell([r, c]);

    setPreviewCells([[r, c]]);
  };

  const handlePointerMove = (e) => {
    if (!pointerDraggingRef.current) return;

    const start = pointerStartRef.current;

    if (!start) return;

    const target = getCellFromPoint(e.clientX, e.clientY);

    if (!target) return;

    const [r, c] = target;

    pointerCurrentRef.current = [r, c];

    const path = getPath(start, [r, c]);

    if (path.length > 0) {
      setPreviewCells(path);
    }
  };

  const handlePointerEnter = (r, c) => {
    if (!pointerDraggingRef.current) return;

    const start = pointerStartRef.current;

    if (!start) return;

    pointerCurrentRef.current = [r, c];

    const path = getPath(start, [r, c]);

    if (path.length > 0) {
      setPreviewCells(path);
    }
  };

  const handlePointerUp = (e) => {
    if (!pointerDraggingRef.current) return;

    e.preventDefault();

    const start = pointerStartRef.current;

    if (!start) return;

    let end = getCellFromPoint(e.clientX, e.clientY);

    if (!end) {
      end = pointerCurrentRef.current || start;
    }

    pointerDraggingRef.current = false;

    pointerStartRef.current = null;
    pointerCurrentRef.current = null;

    /*
    نخلي startCell ثابت مؤقتًا
    لأن completeSelection يعتمد عليه
  */

    setStartCell(start);

    window.setTimeout(() => {
      completeSelection(end[0], end[1]);
    }, 0);
  };

  const cancelDrag = () => {
    pointerDraggingRef.current = false;

    pointerStartRef.current = null;
    pointerCurrentRef.current = null;

    setStartCell(null);
    setPreviewCells([]);
  };
  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (foundWords.length === 0) {
      ValidationAlert.info(
        "Oops!",
        "Please find at least one word before checking.",
      );

      return;
    }

    /*
      أي كلمة ما انوجدت
      نحط X جنبها.
    */

    const missingWords = words
      .map((word) => word.text)
      .filter((word) => !foundWords.includes(word));

    setWrongWords(missingWords);

    setStartCell(null);

    setPreviewCells([]);

    setIsDragging(false);

    dragStartRef.current = null;

    const total = words.length;

    const correct = foundWords.length;

    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div
        style="
          font-size:20px;
          text-align:center;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${correct} / ${total}
        </span>
      </div>
    `;

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (correct === total) {
      setWrongWords([]);

      setCheckCompleted(true);

      setAnnouncement("All words are correct.");

      ValidationAlert.success(msg);

      return;
    }

    /*
      مهم:
      هون ما بنقفل الشبكة.
      الطالب بقدر يكمل الكلمات
      الناقصة بعد Check.
    */

    if (correct === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }

    setAnnouncement(
      `Score ${correct} out of ${total}. Continue finding the missing words.`,
    );
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    setFoundWords(words.map((word) => word.text));

    setWrongWords([]);

    setStartCell(null);

    setPreviewCells([]);

    setIsDragging(false);

    dragStartRef.current = null;

    setShowAnswer(true);

    setCheckCompleted(true);

    setAnnouncement("All answers shown.");
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setFoundWords([]);

    setWrongWords([]);

    setStartCell(null);

    setPreviewCells([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setIsDragging(false);

    dragStartRef.current = null;

    setActiveCell([0, 0]);

    setAnnouncement("Activity reset.");

    requestAnimationFrame(() => {
      cellRefs.current["0-0"]?.focus();
    });
  };

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    const handleWindowPointerUp = () => {
      if (isDragging && dragStartRef.current) {
        setIsDragging(false);
      }
    };

    window.addEventListener("pointerup", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [isDragging]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="wordsearch-wrapper">
      {/* =================================================
          SCREEN READER STATUS
      ================================================= */}

      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="page8-wrapper">
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="J"
            title="Find the words."
            subTitle="Find cake, jello, balloons, card, present, and hat in the grid."
          />

          <div className="container-word-grid-wb-u2-p5-q2">
            {/* =============================================
                GRID
            ============================================= */}

            <div
              className="grid-wb-u1-p6-q2"
              role="grid"
              aria-label="Word search grid. Use arrow keys to move. Press Enter or Space on the first and last letter."
              onPointerLeave={() => {
                /*
                  ما نلغي selection بالكبس العادي،
                  فقط drag.
                */
                if (isDragging) {
                  cancelDrag();
                }
              }}
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

                    const isActive =
                      activeCell[0] === rIdx && activeCell[1] === cIdx;

                    return (
                      <div
                        key={cIdx}
                        ref={(node) => {
                          cellRefs.current[`${rIdx}-${cIdx}`] = node;
                        }}
                        role="gridcell"
                        data-wordsearch-cell="true"
                        data-row={rIdx}
                        data-col={cIdx}
                        tabIndex={
                          showAnswer || checkCompleted ? -1 : isActive ? 0 : -1
                        }
                        aria-label={`Row ${rIdx + 1}, column ${
                          cIdx + 1
                        }, letter ${cell}${
                          found ? ", found word" : preview ? ", selected" : ""
                        }`}
                        aria-selected={preview || found}
                        onFocus={() => setActiveCell([rIdx, cIdx])}
                        className={`
    cell-wb-u2-p5-q2
    ${preview ? "highlight" : ""}
    ${found ? "found" : ""}
    ${isStart ? "start-cell" : ""}
  `}
                        onClick={() => handleCellClick(rIdx, cIdx)}
                        onKeyDown={(e) => handleCellKeyDown(e, rIdx, cIdx)}
                        onPointerDown={(e) => handlePointerDown(e, rIdx, cIdx)}
                        onPointerMove={handlePointerMove}
                        onPointerEnter={() => handlePointerEnter(rIdx, cIdx)}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={cancelDrag}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* =============================================
                WORD LIST
            ============================================= */}

            <div className="word-btn-wb-u2-p5-q2">
              {words.map((word, index) => {
                const found = foundWords.includes(word.text);

                const playing = playingWord === word.text;

                return (
                  <div
                    key={word.text}
                    className="word-label-wrapper-wb-u2-p5-q2"
                  >
                    <button
                      type="button"
                      className={`word-label-wb-u2-p5-q2 ${
                        found ? "done" : ""
                      }`}
                      onClick={() => playWordAudio(word)}
                      aria-label={`Play ${word.text}`}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <p>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "rgb(44, 82, 135)",
                          }}
                        >
                          {index + 1}
                        </span>{" "}
                        {word.text}
                        {playing && (
                          <span
                            aria-hidden="true"
                            style={{
                              marginLeft: "8px",
                            }}
                          >
                            🔊
                          </span>
                        )}
                        {found && (
                          <span
                            aria-hidden="true"
                            style={{
                              marginLeft: "8px",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </p>

                      <img
                        src={word.src}
                        alt={word.alt}
                        style={{
                          height: "120px",
                          width: "auto",
                        }}
                      />
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
