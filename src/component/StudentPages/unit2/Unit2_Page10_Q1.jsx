import React, { useState } from "react";
import "./Unit2_Page10_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound1 from "../../../assets/unit1/sounds/P19QD.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const Unit2_Page10_Q1 = () => {
  const [isShowMode, setIsShowMode] = useState(false);

  const stopAtSecond = 4.5;

  const sentences = [
    { word1: "ball", word2: "pencil", num: 1 },
    { word1: "boy", word2: "pencil", num: 2 },
    { word1: "pink", word2: "bird", num: 3 },
    { word1: "pizza", word2: "bird", num: 4 },
    { word1: "ball", word2: "pink", num: 5 },
    { word1: "ball", word2: "pizza", num: 6 },
  ];

  // ======================================================
  // CORRECT ANSWERS
  // ======================================================

  const correct = {
    0: [1], // pencil
    1: [0], // boy
    2: [1], // bird
    3: [0], // pizza
    4: [1], // pink
    5: [0], // ball
  };

  // ======================================================
  // STATE
  // ======================================================

  const [circledWords, setCircledWords] = useState({});

  // كل جملة صح بعد Check تتقفل لحالها
  const [lockedSentences, setLockedSentences] = useState([]);

  // الجمل الغلط فقط
  const [wrongSentences, setWrongSentences] = useState([]);

  // يصير true فقط لما الكل صح
  const [checkCompleted, setCheckCompleted] = useState(false);

  // ======================================================
  // HELPERS
  // ======================================================

  const isSentenceLocked = (sIndex) => lockedSentences.includes(sIndex);

  // ======================================================
  // WORD CLICK
  // ======================================================

  const handleWordClick = (sIndex, wIndex) => {
    if (isShowMode || checkCompleted || isSentenceLocked(sIndex)) {
      return;
    }

    setCircledWords((prev) => ({
      ...prev,

      // كل جملة اختيار واحد فقط
      [sIndex]: [wIndex],
    }));

    // شيل X فقط عن نفس الجملة اللي عدلها
    setWrongSentences((prev) => prev.filter((index) => index !== sIndex));
  };

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const handleShowAnswer = () => {
    const correctSelections = {};

    Object.keys(correct).forEach((key) => {
      correctSelections[key] = [...correct[key]];
    });

    setCircledWords(correctSelections);

    setWrongSentences([]);

    setLockedSentences(Object.keys(correct).map(Number));

    setIsShowMode(true);

    setCheckCompleted(true);
  };

  // ======================================================
  // CAPTIONS
  // ======================================================

  const captions = [
    {
      start: 0,
      end: 4.26,
      text: " Page 19, exercise D. Listen and circle. ",
    },
    {
      start: 4.28,
      end: 7.02,
      text: "1-pencil.",
    },
    {
      start: 7.04,
      end: 9.01,
      text: "2-boy.",
    },
    {
      start: 9.03,
      end: 10.21,
      text: "3-bird.",
    },
    {
      start: 10.23,
      end: 13.1,
      text: "4-pizza. ",
    },
    {
      start: 13.12,
      end: 14.29,
      text: "5-pink.",
    },
    {
      start: 14.31,
      end: 17.06,
      text: "6-ball.",
    },
  ];

  // ======================================================
  // CHECK ANSWERS
  // ======================================================

  const checkAnswers = () => {
    if (isShowMode || checkCompleted) {
      return;
    }

    // لازم كل الجمل يكون عليها اختيار
    const allAnswered = sentences.every(
      (_, sIndex) => circledWords[sIndex]?.length > 0,
    );

    if (!allAnswered) {
      ValidationAlert.info(
        "Oops!",
        "Please circle one word in each sentence before checking.",
      );

      return;
    }

    let studentCorrect = 0;

    const wrongTemp = [];
    const correctTemp = [];

    sentences.forEach((_, sIndex) => {
      const selected = circledWords[sIndex]?.[0];

      const correctIndex = correct[sIndex]?.[0];

      if (selected === correctIndex) {
        studentCorrect++;

        correctTemp.push(sIndex);
      } else {
        wrongTemp.push(sIndex);
      }
    });

    // ======================================================
    // LOCK CORRECT ONLY
    // ======================================================

    setLockedSentences((prev) =>
      Array.from(new Set([...prev, ...correctTemp])),
    );

    // ======================================================
    // WRONG ONLY
    // ======================================================

    setWrongSentences(wrongTemp);

    const totalCorrect = sentences.length;

    const color =
      studentCorrect === totalCorrect
        ? "green"
        : studentCorrect === 0
          ? "red"
          : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${studentCorrect} / ${totalCorrect}
        </span>
      </div>
    `;

    // ======================================================
    // ALL CORRECT
    // ======================================================

    if (studentCorrect === totalCorrect) {
      setLockedSentences(sentences.map((_, index) => index));

      setWrongSentences([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    // ======================================================
    // WRONG / PARTIAL
    // ======================================================

    if (studentCorrect === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ======================================================
  // RESET
  // ======================================================

  const resetAll = () => {
    setCircledWords({});

    setLockedSentences([]);

    setWrongSentences([]);

    setIsShowMode(false);

    setCheckCompleted(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

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
          sectionLetter="D"
          title="Listen and circle."
          subTitle="Press Play for each item, then tap the word you hear."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit2-page19-1"
        />

        <div className="content-container10">
          <div className="sentence-container2-unit2-pg10-q1">
            {sentences.map((sentence, sIndex) => {
              const sentenceLocked = isSentenceLocked(sIndex);

              return (
                <div key={sIndex} className="sentence-row">
                  <span className="num2">{sIndex + 1}</span>

                  {[sentence.word1, sentence.word2].map((word, wIndex) => {
                    const isCircled = circledWords[sIndex]?.includes(wIndex);

                    const isWrong =
                      wrongSentences.includes(sIndex) && isCircled;

                    return (
                      <span
                        key={wIndex}
                        onClick={() => handleWordClick(sIndex, wIndex)}
                        className={`word-text10 ${isCircled ? "circled2" : ""}`}
                        style={{
                          cursor:
                            sentenceLocked || isShowMode || checkCompleted
                              ? "default"
                              : "pointer",
                        }}
                      >
                        {word}

                        {isWrong && <span className="wrong-x10">✕</span>}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
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

export default Unit2_Page10_Q1;
