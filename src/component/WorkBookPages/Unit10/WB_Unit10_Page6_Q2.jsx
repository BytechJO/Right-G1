import React, { useState } from "react";
import "./WB_Unit10_Page6_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound1 from "../../../assets/U1 WB/U10/audio/cd14pg62-instruction1-adult-lady_lR3Ssqcr.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit10Audio from "./useUnit10Audio";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import petAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_003_pet.mp3";
import pitAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_006_pit.mp3";
import jetAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_011_jet.mp3";
import tapAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_004_tap.mp3";
import betAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_007_bet.mp3";
import setAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_013_set.mp3";
import redAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_001_red.mp3";
import hotAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_008_hot.mp3";
import nestAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_014_nest.mp3";
import metAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_005_met.mp3";
import runAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_010_run.mp3";
import wetAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_015_wet.mp3";
import webAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_002_web.mp3";
import fedAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_009_fed.mp3";
import hipAudio from "../../../assets/U1 WB/U10/audio/page62- B/Item_012_hip.mp3";
const WB_Unit10_Page6_Q2 = () => {
  const sentences = [
    { word1: "pet", word2: "pit", word3: "jet", num: 1 },
    { word1: "tap", word2: "bet", word3: "set", num: 2 },
    { word1: "red", word2: "hot", word3: "nest", num: 3 },
    { word1: "met", word2: "run", word3: "wet", num: 4 },
    { word1: "web", word2: "fed", word3: "hip", num: 5 },
  ];

  const correct = {
    0: [0, 2],
    1: [1, 2],
    2: [0, 2],
    3: [0, 2],
    4: [0, 1],
  };

  const [circledWords, setCircledWords] = useState({});
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false); // ⭐ NEW — يمنع التعديل
  const [lockedGroups, setLockedGroups] = useState([]);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();
  const wordAudio = {
    pet: petAudio,
    pit: pitAudio,
    jet: jetAudio,
    tap: tapAudio,
    bet: betAudio,
    set: setAudio,
    red: redAudio,
    hot: hotAudio,
    nest: nestAudio,
    met: metAudio,
    run: runAudio,
    wet: wetAudio,
    web: webAudio,
    fed: fedAudio,
    hip: hipAudio,
  };

  const stopAtSecond = 5.56;

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.1,
      end: 5.56,
      text: "Phonics exercise B. Listen and circle the words with short e.",
    },
    {
      start: 6.2,
      end: 9.8,
      text: "1, pet, pit, jet.",
    },
    {
      start: 10.32,
      end: 14.64,
      text: "2, tap, bet, set.",
    },
    {
      start: 15.32,
      end: 20.16,
      text: "3, red, hot, nest.",
    },
    {
      start: 20.88,
      end: 25.48,
      text: "4, met, run, wet.",
    },
    {
      start: 26.12,
      end: 30.62,
      text: "5, web, fed, hip.",
    },
  ];

  const handleWordClick = (sIndex, wIndex, word) => {
    playAudio(`word-${sIndex}-${wIndex}`, wordAudio[word]);
    if (locked || lockedGroups.includes(sIndex)) return;

    setCircledWords((prev) => {
      const current = prev[sIndex] || [];

      // إذا الكلمة مختارة → نشيلها
      if (current.includes(wIndex)) {
        return {
          ...prev,
          [sIndex]: current.filter((i) => i !== wIndex),
        };
      }

      // إذا مختار بالفعل خيارين → ما نسمح بالمزيد
      if (current.length >= 2) {
        return prev;
      }

      // غير هيك → نضيف الاختيار
      return {
        ...prev,
        [sIndex]: [...current, wIndex],
      };
    });

    setChecked(false);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ منع التغيير عند القفل
    if (Object.keys(circledWords).length < sentences.length) {
      ValidationAlert.info("Oops!", "Please circle at least one mistake.");
      return;
    }

    let totalCorrect = 0;
    let studentCorrect = 0;

    for (let sIndex in correct) totalCorrect += correct[sIndex].length;

    for (let sIndex in circledWords) {
      circledWords[sIndex].forEach((wIndex) => {
        if (correct[sIndex]?.includes(wIndex)) studentCorrect++;
      });
    }

    setChecked(true);
    const correctGroups = sentences
      .map((_, index) => {
        const chosen = [...(circledWords[index] || [])].sort().join(",");
        return chosen === [...correct[index]].sort().join(",") ? index : null;
      })
      .filter((value) => value !== null);
    setLockedGroups((previous) => [
      ...new Set([...previous, ...correctGroups]),
    ]);

    const scoreMessage = `Score: ${studentCorrect} / ${totalCorrect}`;
    if (studentCorrect === totalCorrect) ValidationAlert.success(scoreMessage);
    else if (studentCorrect === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    if (correctGroups.length === sentences.length) setLocked(true);
  };

  const showAnswer = () => {
    const correctSelections = {};

    Object.keys(correct).forEach((sIndex) => {
      correctSelections[sIndex] = correct[sIndex]; // ضع الدوائر على الإجابات الصحيحة فقط
    });

    setCircledWords(correctSelections);
    setChecked(false); // إزالة الأخطاء
    setLocked(true); // قفل التعديل
    setLockedGroups(sentences.map((_, index) => index));
    stopAudio();
  };

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
          title="Listen and circle the words with short e."
          subTitle="Listen to each group and tap the word with the short-e sound."
        />
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="wb-unit10-page6-q2"
        />
        <div
          className="review3-p2-q2-sentence-container2"
          style={{ margin: "50px 0px" }}
        >
          {sentences.map((sentence, sIndex) => (
            <div className="review3-p2-q2-sentence-row" key={sIndex}>
              <span className="review3-p2-q2-num">{sIndex + 1}</span>

              <div className="wb-unit10-p6-q2-word-box">
                {[sentence.word1, sentence.word2, sentence.word3].map(
                  (word, wIndex) => {
                    const isCircled = circledWords[sIndex]?.includes(wIndex);
                    const isWrong =
                      checked &&
                      isCircled &&
                      !correct[sIndex]?.includes(wIndex);

                    return (
                      <span
                        key={wIndex}
                        className={`wb-unit10-p6-q2-word ${
                          isCircled ? "circled" : ""
                        }`}
                        onClick={() => handleWordClick(sIndex, wIndex, word)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${isCircled ? "Selected. " : ""}${word}. Play audio and select.`}
                        aria-pressed={isCircled}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleWordClick(sIndex, wIndex, word);
                          }
                        }}
                      >
                        {activeAudioKey === `word-${sIndex}-${wIndex}` && (
                          <Unit10PlayingAudioIcon />
                        )}
                        {word}
                        {isWrong && (
                          <span className="review3-p2-q2-wrong-x">✕</span>
                        )}
                      </span>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons-container">
          <button
            onClick={() => {
              setCircledWords({});
              setChecked(false);
              setLocked(false); // ⭐ فتح التعديل من جديد
              setLockedGroups([]);
              stopAudio();
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ تمت إضافة زر Show Answer */}
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

export default WB_Unit10_Page6_Q2;
