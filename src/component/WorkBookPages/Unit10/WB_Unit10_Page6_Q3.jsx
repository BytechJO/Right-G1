import React, { useState } from "react";
import "./WB_Unit10_Page6_Q3.css";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import useUnit10Audio from "./useUnit10Audio";
import fedAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_001_fed.mp3";
import wetAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_002_wet.mp3";
import jetAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_003_jet.mp3";
import netAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_004_net.mp3";
import henAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_005_hen.mp3";
import redAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_006_red.mp3";
import tenAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_007_ten.mp3";
import bedAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_008_bed.mp3";
import setAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_009_set.mp3";
import menAudio from "../../../assets/U1 WB/U10/audio/page62- C/Item_010_men.mp3";

const rows = [
  ["wet", "net", "ten", "set"],
  ["net", "ten", "hen", "men"],
  ["fed", "jet", "red", "bed"],
];
const correct = [2, 0, 1];
const audioByWord = {
  fed: fedAudio,
  wet: wetAudio,
  jet: jetAudio,
  net: netAudio,
  hen: henAudio,
  red: redAudio,
  ten: tenAudio,
  bed: bedAudio,
  set: setAudio,
  men: menAudio,
};

const WB_Unit10_Page6_Q3 = () => {
  const [answers, setAnswers] = useState({});
  const [wrongRows, setWrongRows] = useState(new Set());
  const [lockedRows, setLockedRows] = useState(new Set());
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();

  const choose = (rowIndex, wordIndex) => {
    playAudio(
      `word-${rowIndex}-${wordIndex}`,
      audioByWord[rows[rowIndex][wordIndex]],
    );
    if (lockedRows.has(rowIndex)) return;
    setAnswers((old) => ({ ...old, [rowIndex]: wordIndex }));
    setWrongRows((old) => {
      const next = new Set(old);
      next.delete(rowIndex);
      return next;
    });
  };

  const checkAnswers = () => {
    if (rows.length > 0 && lockedRows.size === rows.length) return;

    if (rows.some((_, index) => answers[index] === undefined)) {
      ValidationAlert.info("Please answer all the questions before checking.");
      return;
    }
    const nextWrong = new Set();
    const nextLocked = new Set(lockedRows);
    rows.forEach((_, index) =>
      answers[index] === correct[index]
        ? nextLocked.add(index)
        : nextWrong.add(index),
    );
    setLockedRows(nextLocked);
    setWrongRows(nextWrong);
    const score = rows.filter(
      (_, index) => answers[index] === correct[index],
    ).length;
    const message = `Score: ${score} / ${rows.length}`;
    if (score === rows.length) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  const showAnswer = () => {
    setAnswers(
      Object.fromEntries(correct.map((value, index) => [index, value])),
    );
    setWrongRows(new Set());
    setLockedRows(new Set(rows.map((_, index) => index)));
  };

  const reset = () => {
    stopAudio();
    setAnswers({});
    setWrongRows(new Set());
    setLockedRows(new Set());
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div className="div-forall" style={{ gap: "30px" }}>
        <ExerciseHeader
          sectionLetter="C"
          title="Read the words. Circle the word with a different sound."
          subTitle="Read each group aloud and tap the word with the different vowel sound."
        />
        <div className="review3-p2-q2-sentence-container2 w-full">
          {rows.map((words, rowIndex) => (
            <div className="review3-p2-q2-sentence-row" key={rowIndex}>
              <span className="review3-p2-q2-num">{rowIndex + 1}</span>
              <div className="wb-unit10-p6-q2-word-box">
                {words.map((word, wordIndex) => {
                  const selected = answers[rowIndex] === wordIndex;
                  return (
                    <span
                      key={`${word}-${wordIndex}`}
                      className={`wb-unit10-p6-q2-word wb-unit10-audio-control ${selected ? "circled" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Listen to and choose ${word}`}
                      onClick={() => choose(rowIndex, wordIndex)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          choose(rowIndex, wordIndex);
                        }
                      }}
                    >
                      {word}
                      <PlayingAudioIcon
                        active={
                          activeAudioKey === `word-${rowIndex}-${wordIndex}`
                        }
                      />
                      {wrongRows.has(rowIndex) && selected && (
                        <span className="review3-p2-q2-wrong-x">✕</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit10_Page6_Q3;
