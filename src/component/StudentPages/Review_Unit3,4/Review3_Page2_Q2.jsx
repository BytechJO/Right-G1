import React, { useRef, useState } from "react";
import "./Review3_Page2_Q2.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import { FaVolumeUp } from "react-icons/fa";

import gapAudio from "../../../assets/unit4/Page 35 - E/gap.mp3";
import patAudio from "../../../assets/unit4/Page 35 - E/pat.mp3";
import ranAudio from "../../../assets/unit4/Page 35 - E/ran.mp3";
import satAudio from "../../../assets/unit4/Page 35 - E/sat.mp3";
import tapAudio from "../../../assets/unit4/Page 35 - E/tap.mp3";

const Review3_Page2_Q2 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const sentences = [
    {
      word1: "hot",
      word2: "sun",
      word3: "sat",
      num: 1,
    },
    {
      word1: "lip",
      word2: "tap",
      word3: "top",
      num: 2,
    },
    {
      word1: "pat",
      word2: "run",
      word3: "pot",
      num: 3,
    },
    {
      word1: "mop",
      word2: "jet",
      word3: "gap",
      num: 4,
    },
    {
      word1: "ran",
      word2: "sit",
      word3: "hut",
      num: 5,
    },
  ];

  const correct = {
    0: [2],
    1: [1],
    2: [0],
    3: [2],
    4: [0],
  };

  /* =====================================================
     AUDIO MAP
     فقط الكلمات الصحيحة إلها أصوات
  ===================================================== */

  const audioMap = {
    sat: satAudio,
    tap: tapAudio,
    pat: patAudio,
    gap: gapAudio,
    ran: ranAudio,
  };

  /* =====================================================
     STATE
  ===================================================== */

  const [circledWords, setCircledWords] = useState({});

  const [wrongRows, setWrongRows] = useState([]);

  /*
    الصفوف اللي إجابتهم صح بعد Check
  */
  const [lockedRows, setLockedRows] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

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
    const src = audioMap[word];

    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingWord(word);

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
     HELPERS
  ===================================================== */

  const isRowLocked = (sIndex) => lockedRows.includes(sIndex);

  const isCorrectSelection = (sIndex, wIndex) =>
    correct[sIndex]?.includes(wIndex);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleWordSelect = (sIndex, wIndex) => {
    if (showAnswer || checkCompleted || isRowLocked(sIndex)) {
      return;
    }

    setCircledWords((prev) => ({
      ...prev,
      [sIndex]: [wIndex],
    }));

    /*
      لو كان الصف عليه X:
      ينشال فقط من نفس الصف
    */

    setWrongRows((prev) => prev.filter((rowIndex) => rowIndex !== sIndex));
  };

  /* =====================================================
     WORD CLICK / KEYBOARD
  ===================================================== */

  const handleWordAction = (sIndex, wIndex, word) => {
    const rowLocked = isRowLocked(sIndex);

    const correctWord = isCorrectSelection(sIndex, wIndex);

    /*
      بعد Check وإذا هاي الكلمة صح:
      الفعل يصير تشغيل صوت.
    */

    if (rowLocked && correctWord) {
      playWordAudio(word);

      return;
    }

    /*
      قبل ما تنقفل:
      اختيار عادي فقط، بدون صوت.
    */

    handleWordSelect(sIndex, wIndex);
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      لازم كل صف يكون فيه اختيار
    */

    const hasEmpty = sentences.some(
      (_, sIndex) => !circledWords[sIndex] || circledWords[sIndex].length === 0,
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please choose one word in each row before checking.",
      );

      return;
    }

    let studentCorrect = 0;

    const newWrongRows = [];

    const newlyLockedRows = [];

    sentences.forEach((_, sIndex) => {
      const selected = circledWords[sIndex]?.[0];

      const correctSelection = correct[sIndex]?.includes(selected);

      if (correctSelection) {
        studentCorrect++;

        newlyLockedRows.push(sIndex);
      } else {
        newWrongRows.push(sIndex);
      }
    });

    /*
      الصح فقط ينقفل
    */

    setLockedRows((prev) => Array.from(new Set([...prev, ...newlyLockedRows])));

    /*
      الغلط فقط يظهر عليه X
    */

    setWrongRows(newWrongRows);

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

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (studentCorrect === totalCorrect) {
      setLockedRows(sentences.map((_, index) => index));

      setWrongRows([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (studentCorrect === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    const correctSelections = {};

    Object.keys(correct).forEach((sIndex) => {
      correctSelections[sIndex] = correct[sIndex];
    });

    setCircledWords(correctSelections);

    setWrongRows([]);

    setLockedRows(sentences.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setCircledWords({});

    setWrongRows([]);

    setLockedRows([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  /* =====================================================
     RENDER
  ===================================================== */

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
          gap: "90px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="E"
          title={
            <>
              Circle the{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                short a{" "}
              </span>
              words.
            </>
          }
          subTitle={
            <>
              Read each column and tap every word with the{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                short-a
              </span>{" "}
              sound.
            </>
          }
        />

        <div className="review3-p2-q2-sentence-container2">
          {sentences.map((sentence, sIndex) => {
            const rowLocked = isRowLocked(sIndex);

            return (
              <div className="review3-p2-q2-sentence-row" key={sIndex}>
                <span className="review3-p2-q2-num">{sIndex + 1}</span>

                <div className="review3-p2-q2-word-box">
                  {[sentence.word1, sentence.word2, sentence.word3].map(
                    (word, wIndex) => {
                      const isCircled = circledWords[sIndex]?.includes(wIndex);

                      const correctWord = isCorrectSelection(sIndex, wIndex);

                      /*
                          X فقط على الكلمة
                          المختارة الغلط
                        */

                      const isWrong =
                        wrongRows.includes(sIndex) && isCircled && !correctWord;

                      /*
                          الصوت يتفعّل فقط
                          إذا الصف صار صح
                          بعد Check
                        */

                      const audioEnabled = rowLocked && correctWord;

                      const isPlaying = playingWord === word;

                      return (
                        <span
                          key={wIndex}
                          className={`review3-p2-q2-word ${
                            isCircled ? "circled" : ""
                          } ${
                            audioEnabled ? "audio-enabled-review3-p2-q2" : ""
                          }`}
                          role="button"
                          /*
                              قبل Check:
                              كل الكلمات بالـTab.

                              بعد Check:
                              الصف الصح:
                              فقط الكلمة الصح تظل بالـTab
                              عشان تشغيل الصوت.

                              الصف الغلط:
                              كل الكلمات تظل بالـTab للتعديل.
                            */

                          tabIndex={
                            showAnswer
                              ? -1
                              : rowLocked
                                ? correctWord
                                  ? 0
                                  : -1
                                : 0
                          }
                          aria-label={
                            audioEnabled
                              ? `${word}. Correct. Press Enter or Space to play the audio.`
                              : `${word}${
                                  isCircled ? ", selected" : ""
                                }. Press Enter or Space to select.`
                          }
                          aria-pressed={isCircled}
                          onClick={() => handleWordAction(sIndex, wIndex, word)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();

                              e.stopPropagation();

                              handleWordAction(sIndex, wIndex, word);
                            }
                          }}
                          style={{
                            position: "relative",

                            cursor: "pointer",
                          }}
                        >
                          {word}

                          {/* =================================
                                AUDIO ICON
                            ================================= */}

                          {audioEnabled && isPlaying && (
                            <FaVolumeUp
                              size={16}
                              aria-hidden="true"
                              className="audio-icon-review3-p2-q2"
                            />
                          )}

                          {/* =================================
                                WRONG X
                            ================================= */}

                          {isWrong && (
                            <span
                              className="review3-p2-q2-wrong-x"
                              aria-hidden="true"
                            >
                              ✕
                            </span>
                          )}
                        </span>
                      );
                    },
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
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

export default Review3_Page2_Q2;
