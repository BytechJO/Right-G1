import React, { useRef, useState } from "react";
import "./WB_Unit9_Page5_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import horseAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_001_horse.mp3";
import barnAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_002_barn.mp3";
import stableAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_003_stable.mp3";
import cowAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_004_cow.mp3";
import chickenAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_005_chicken.mp3";
import grassAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_006_grass.mp3";
import goatAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_007_goat.mp3";
import catAudio from "../../../assets/U1 WB/U9/audio/page55- j/Item_008_cat.mp3";

const grid = [
  ["c", "s", "t", "a", "b", "l", "e"],
  ["h", "e", "k", "g", "i", "h", "c"],
  ["i", "b", "l", "r", "a", "o", "o"],
  ["c", "a", "t", "a", "w", "r", "w"],
  ["k", "r", "a", "s", "a", "s", "c"],
  ["e", "n", "a", "s", "n", "e", "c"],
  ["n", "s", "g", "o", "a", "t", "a"],
];

const words = [
  { text: "horse", coords: [[1, 5], [2, 5], [3, 5], [4, 5], [5, 5]] },
  { text: "barn", coords: [[2, 1], [3, 1], [4, 1], [5, 1]] },
  { text: "stable", coords: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]] },
  { text: "cow", coords: [[1, 6], [2, 6], [3, 6]] },
  { text: "chicken", coords: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]] },
  { text: "grass", coords: [[1, 3], [2, 3], [3, 3], [4, 3], [5, 3]] },
  { text: "goat", coords: [[6, 2], [6, 3], [6, 4], [6, 5]] },
  { text: "cat", coords: [[3, 0], [3, 1], [3, 2]] },
];
const wordAudios = {
  horse: horseAudio,
  barn: barnAudio,
  stable: stableAudio,
  cow: cowAudio,
  chicken: chickenAudio,
  grass: grassAudio,
  goat: goatAudio,
  cat: catAudio,
};

const samePath = (first, second) => first.length === second.length && first.every(([row, column], index) => row === second[index][0] && column === second[index][1]);

const createPath = (start, end) => {
  if (!start || !end) return [];
  const rowDistance = end[0] - start[0];
  const columnDistance = end[1] - start[1];
  if (rowDistance !== 0 && columnDistance !== 0 && Math.abs(rowDistance) !== Math.abs(columnDistance)) return [start];
  const length = Math.max(Math.abs(rowDistance), Math.abs(columnDistance));
  const rowStep = Math.sign(rowDistance);
  const columnStep = Math.sign(columnDistance);
  return Array.from({ length: length + 1 }, (_, index) => [start[0] + rowStep * index, start[1] + columnStep * index]);
};

export default function WB_Unit9_Page5_Q1() {
  const [foundWords, setFoundWords] = useState([]);
  const [preview, setPreview] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeCell, setActiveCell] = useState([0, 0]);
  const [keyboardStart, setKeyboardStart] = useState(null);
  const pointerStart = useRef(null);
  const pointerActive = useRef(false);
  const previewRef = useRef([]);
  const cellRefs = useRef({});
  const { activeAudioKey, playAudio } = useUnit9Audio();

  const updatePreview = (path) => {
    previewRef.current = path;
    setPreview(path);
  };

  const foundPaths = words.filter((word) => foundWords.includes(word.text)).map((word) => word.coords);
  const cellInPaths = (row, column, paths) => paths.some((path) => path.some(([pathRow, pathColumn]) => pathRow === row && pathColumn === column));

  const commitPath = (path) => {
    const match = words.find((word) => samePath(path, word.coords) || samePath([...path].reverse(), word.coords));
    if (match) {
      if (!foundWords.includes(match.text)) playAudio(`word-${match.text}`, wordAudios[match.text]);
      setFoundWords((current) => current.includes(match.text) ? current : [...current, match.text]);
      setWrongWords((current) => current.filter((word) => word !== match.text));
    }
    updatePreview([]);
  };

  const cellFromPointer = (event) => {
    const element = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-grid-cell='true']");
    if (!element) return null;
    return [Number(element.dataset.row), Number(element.dataset.column)];
  };

  const handlePointerDown = (event, row, column) => {
    if (showAnswer || foundWords.length === words.length) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointerActive.current = true;
    pointerStart.current = [row, column];
    updatePreview([[row, column]]);
  };

  const handlePointerMove = (event) => {
    if (!pointerActive.current) return;
    const end = cellFromPointer(event);
    if (end) updatePreview(createPath(pointerStart.current, end));
  };

  const finishPointer = () => {
    if (!pointerActive.current) return;
    pointerActive.current = false;
    commitPath(previewRef.current);
    pointerStart.current = null;
  };

  const handleCellKeyDown = (event, row, column) => {
    const directions = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] };
    if (directions[event.key]) {
      event.preventDefault();
      const [rowDirection, columnDirection] = directions[event.key];
      const next = [(row + rowDirection + grid.length) % grid.length, (column + columnDirection + grid[0].length) % grid[0].length];
      setActiveCell(next);
      if (keyboardStart) updatePreview(createPath(keyboardStart, next));
      requestAnimationFrame(() => cellRefs.current[`${next[0]}-${next[1]}`]?.focus());
      return;
    }
    if (event.key === "Escape" && keyboardStart) {
      event.preventDefault();
      setKeyboardStart(null);
      updatePreview([]);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (showAnswer || foundWords.length === words.length) return;
      if (keyboardStart) {
        commitPath(preview);
        setKeyboardStart(null);
      } else {
        const start = [row, column];
        setKeyboardStart(start);
        updatePreview([start]);
      }
    }
  };

  const checkAnswers = () => {
    if (showAnswer || foundWords.length === words.length) return;
    const missing = words.map((word) => word.text).filter((word) => !foundWords.includes(word));
    setWrongWords(missing);
    const score = foundWords.length;
    const color = score === 0 ? "red" : "orange";
    const message = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${words.length}</span></div>`;
    if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  const showAnswers = () => {
    setFoundWords(words.map((word) => word.text));
    setWrongWords([]);
    updatePreview([]);
    setKeyboardStart(null);
    setShowAnswer(true);
  };

  const reset = () => {
    setFoundWords([]);
    setWrongWords([]);
    updatePreview([]);
    setKeyboardStart(null);
    setShowAnswer(false);
    setActiveCell([0, 0]);
    requestAnimationFrame(() => cellRefs.current["0-0"]?.focus());
  };

  return (
    <div className="wordsearch-wrapper">
      <div className="page8-wrapper">
        <div className="div-forall" style={{ gap: "50px" }}>
          <ExerciseHeader sectionLetter="J" title="Find the words." subTitle="Find horse, barn, stable, cow, chicken, grass, goat, and cat in the grid." />
          <div className="container-word-grid-wb-u9-p5-q1">
            <div className="grid-wb-u1-p6-q2" onPointerMove={handlePointerMove} onPointerUp={finishPointer} onPointerCancel={() => { pointerActive.current = false; pointerStart.current = null; updatePreview([]); }}>
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="row-wb-u1-p6-q2">
                  {row.map((cell, columnIndex) => {
                    const isFound = cellInPaths(rowIndex, columnIndex, foundPaths);
                    const isPreview = cellInPaths(rowIndex, columnIndex, [preview]);
                    return (
                      <div
                        key={columnIndex}
                        ref={(element) => { cellRefs.current[`${rowIndex}-${columnIndex}`] = element; }}
                        data-grid-cell="true"
                        data-row={rowIndex}
                        data-column={columnIndex}
                        role="button"
                        tabIndex={activeCell[0] === rowIndex && activeCell[1] === columnIndex ? 0 : -1}
                        aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}, letter ${cell}`}
                        className={`cell-wb-u9-p5-q1 ${isPreview ? "highlight" : ""} ${isFound ? "found" : ""}`}
                        onFocus={() => setActiveCell([rowIndex, columnIndex])}
                        onKeyDown={(event) => handleCellKeyDown(event, rowIndex, columnIndex)}
                        onPointerDown={(event) => handlePointerDown(event, rowIndex, columnIndex)}
                      >{cell}</div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="word-btn-wb-u9-p5-q1">
              {words.map((word) => (
                <div key={word.text} className="word-label-wrapper-wb-u9-p5-q1">
                  <div
                    className={`word-label-wb-u1-p6-q2 wb-unit9-audio-control ${foundWords.includes(word.text) ? "done" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play ${word.text}`}
                    onClick={() => playAudio(`word-${word.text}`, wordAudios[word.text])}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        playAudio(`word-${word.text}`, wordAudios[word.text]);
                      }
                    }}
                  >
                    {activeAudioKey === `word-${word.text}` && <Unit9PlayingAudioIcon />}
                    {word.text}
                  </div>
                  {wrongWords.includes(word.text) && <span className="wrong-x-circle-wb-u1-p6-q2">✕</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button type="button" className="try-again-button" onClick={reset}>Start Again ↻</button>
        <button type="button" className="show-answer-btn swal-continue" onClick={showAnswers}>Show Answer</button>
        <button type="button" className="check-button2" onClick={checkAnswers}>Check Answer ✓</button>
      </div>
    </div>
  );
}
