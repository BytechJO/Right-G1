import React, { useState, useRef } from "react";

import "./Unit2_Page8_Q1.css";

import table from "../../../assets/unit1/imgs/table2.jpg";
import dish from "../../../assets/unit1/imgs/dish3.jpg";
import tiger from "../../../assets/unit1/imgs/tiger.svg";
import duck from "../../../assets/unit1/imgs/duck.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import duckSound from "../../../assets/unit2/Page 17 - D/duck.mp3";
import tigerSound from "../../../assets/unit2/Page 17 - D/tiger.mp3";
import dishSound from "../../../assets/unit2/Page 17 - D/dish.mp3";
import tableSound from "../../../assets/unit2/Page 17 - D/table.mp3";

import { FaVolumeUp } from "react-icons/fa";
const Unit2_Page8_Q1 = () => {
  const [lines, setLines] = useState([]);

  const containerRef = useRef(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [firstDot, setFirstDot] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const [selectedWord, setSelectedWord] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  // الصح فقط بعد Check
  const [lockedWords, setLockedWords] = useState([]);
  const [lockedImages, setLockedImages] = useState([]);

  // بعد النجاح النهائي
  const [checkCompleted, setCheckCompleted] = useState(false);
  const audioRef = useRef(null);
  const [activeWordAudio, setActiveWordAudio] = useState(null);

  const wordSounds = {
    duck: duckSound,
    tiger: tigerSound,
    dish: dishSound,
    table: tableSound,
  };

  const playWordSound = (word) => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = wordSounds[word];

    setActiveWordAudio(word);

    audioRef.current.play();

    audioRef.current.onended = () => {
      setActiveWordAudio(null);
    };
  };
  const correctMatches = [
    { word: "duck", image: "img3" },
    { word: "tiger", image: "img4" },
    { word: "dish", image: "img2" },
    { word: "table", image: "img1" },
  ];

  /* =====================================================
     START DOT - WORD
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer) return;

    const word = e.currentTarget.dataset.word || null;

    if (!word) return;

    // الصح المقفول ما يتعدل
    if (lockedWords.includes(word)) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = e.currentTarget.getBoundingClientRect();

    setSelectedWord(word);
    setSelectedImage(null);

    setFirstDot({
      word,

      x: dotRect.left - rect.left + 8,

      y: dotRect.top - rect.top + 8,
    });

    // لو عليه X من Check سابق نشيله
    setWrongWords((prev) => prev.filter((item) => item !== word));
  };

  /* =====================================================
     END DOT - IMAGE
  ===================================================== */

  const handleEndDotClick = (e) => {
    if (showAnswer) return;

    if (!firstDot) return;

    const endImage = e.currentTarget.dataset.image || null;

    if (!endImage) return;

    // الصورة الصح المقفلة ما نستبدلها
    if (lockedImages.includes(endImage)) {
      return;
    }

    // الكلمة نفسها لو صارت locked
    if (lockedWords.includes(firstDot.word)) {
      setFirstDot(null);
      setSelectedWord(null);

      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = e.currentTarget.getBoundingClientRect();

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,

      x2: dotRect.left - rect.left + 8,

      y2: dotRect.top - rect.top + 8,

      word: firstDot.word,
      image: endImage,
    };

    /* =================================================
       مهم:
       كل كلمة خط واحد
       وكل صورة خط واحد

       الجديد يحل محل القديم
    ================================================= */

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== firstDot.word && line.image !== endImage,
      );

      return [...filtered, newLine];
    });

    /*
      لو الصورة كانت موصولة بكلمة غلط قديمة،
      نشيل X من الكلمة القديمة لأنها فقدت التوصيل.
    */

    setWrongWords((prev) => {
      const oldLineOnImage = lines.find((line) => line.image === endImage);

      let updated = prev.filter((word) => word !== firstDot.word);

      if (oldLineOnImage) {
        updated = updated.filter((word) => word !== oldLineOnImage.word);
      }

      return updated;
    });

    setSelectedWord(firstDot.word);
    setSelectedImage(endImage);

    setTimeout(() => {
      setSelectedWord(null);
      setSelectedImage(null);
    }, 300);

    setFirstDot(null);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers2 = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLockedWords = [];
    const newlyLockedImages = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;

        newlyLockedWords.push(line.word);
        newlyLockedImages.push(line.image);
      } else {
        wrong.push(line.word);
      }
    });

    /* =========================================
       الصح فقط ينقفل
    ========================================= */

    setLockedWords((prev) =>
      Array.from(new Set([...prev, ...newlyLockedWords])),
    );

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newlyLockedImages])),
    );

    setWrongWords(wrong);

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    /* =========================================
       ALL CORRECT
    ========================================= */

    if (correctCount === total) {
      setWrongWords([]);

      setLockedWords(correctMatches.map((item) => item.word));

      setLockedImages(correctMatches.map((item) => item.image));

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =========================================
       WRONG / PARTIAL
    ========================================= */

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    const rect = containerRef.current.getBoundingClientRect();

    const getDotPosition = (selector) => {
      const el = document.querySelector(selector);

      if (!el) {
        return {
          x: 0,
          y: 0,
        };
      }

      const r = el.getBoundingClientRect();

      return {
        x: r.left - rect.left + 8,

        y: r.top - rect.top + 8,
      };
    };

    const finalLines = correctMatches.map((line) => {
      const start = getDotPosition(`[data-word="${line.word}"]`);

      const end = getDotPosition(`[data-image="${line.image}"]`);

      return {
        ...line,

        x1: start.x,
        y1: start.y,

        x2: end.x,
        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongWords([]);

    setSelectedWord(null);
    setSelectedImage(null);

    setFirstDot(null);

    setShowAnswer(true);

    setCheckCompleted(true);

    setLockedWords(correctMatches.map((item) => item.word));

    setLockedImages(correctMatches.map((item) => item.image));
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setLines([]);

    setWrongWords([]);

    setFirstDot(null);

    setShowAnswer(false);

    setSelectedWord(null);

    setSelectedImage(null);

    setLockedWords([]);

    setLockedImages([]);

    setCheckCompleted(false);
  };

  /* =====================================================
     JSX
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
      <audio ref={audioRef} />
      <div
        className="div-forall"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="D"
          title="Read, look, and match."
          subTitle="Match duck, tiger, dish, and table to the correct pictures."
        />
        <div className="container12-review1-p17-exd" ref={containerRef}>
          {/* =================================================
      ROW 1 - DUCK
  ================================================= */}

          <div className="matching-row2">
            <div className="word-with-dot2">
              <span className="span-num2">1</span>

              <span
                className={`word-text2 ${
                  selectedWord === "duck" ? "selected-item" : ""
                } ${
                  lockedWords.includes("duck") || showAnswer
                    ? "disabled-hover"
                    : ""
                }`}
                onClick={() => {
                  // الصوت يشتغل دائمًا
                  playWordSound("duck");

                  // التوصيل فقط إذا مش locked
                  if (lockedWords.includes("duck") || showAnswer) {
                    return;
                  }

                  document.getElementById("dot-duck")?.click();
                }}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                duck
                {activeWordAudio === "duck" && (
                  <FaVolumeUp
                    size={18}
                    style={{
                      pointerEvents: "none",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>

              {wrongWords.includes("duck") && (
                <span className="error-mark8-u2-p19-q1" style={{ left: 0 }}>
                  ✕
                </span>
              )}

              <div className="dot-wrapper2">
                <div
                  className="dot2 start-dot2"
                  id="dot-duck"
                  data-word="duck"
                  onClick={handleStartDotClick}
                />
              </div>
            </div>

            <div className="img-with-dot2">
              <div className="dot-wrapper2">
                <div
                  className="dot2 end-dot2"
                  data-image="img1"
                  id="dot-img1"
                  onClick={handleEndDotClick}
                />
              </div>

              <div
                style={{
                  width: "150px",
                }}
              >
                <img
                  src={table}
                  alt="Table"
                  className={`matched-img2 ${
                    selectedImage === "img1" ? "selected-item" : ""
                  } ${
                    lockedImages.includes("img1") || showAnswer
                      ? "disabled-hover"
                      : ""
                  }`}
                  onClick={() => {
                    if (lockedImages.includes("img1") || showAnswer) {
                      return;
                    }

                    document.getElementById("dot-img1")?.click();
                  }}
                  style={{
                    cursor:
                      lockedImages.includes("img1") || showAnswer
                        ? "default"
                        : "pointer",

                    width: "110px",
                    height: "100px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* =================================================
      ROW 2 - TIGER
  ================================================= */}

          <div className="matching-row2">
            <div className="word-with-dot2">
              <span className="span-num2">2</span>

              <span
                className={`word-text2 ${
                  selectedWord === "tiger" ? "selected-item" : ""
                } ${
                  lockedWords.includes("tiger") || showAnswer
                    ? "disabled-hover"
                    : ""
                }`}
                onClick={() => {
                  playWordSound("tiger");

                  if (lockedWords.includes("tiger") || showAnswer) {
                    return;
                  }

                  document.getElementById("dot-tiger")?.click();
                }}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                tiger
                {activeWordAudio === "tiger" && (
                  <FaVolumeUp
                    size={18}
                    style={{
                      pointerEvents: "none",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>

              {wrongWords.includes("tiger") && (
                <span className="error-mark8-u2-p19-q1">✕</span>
              )}

              <div className="dot-wrapper2">
                <div
                  className="dot2 start-dot2"
                  id="dot-tiger"
                  data-word="tiger"
                  onClick={handleStartDotClick}
                />
              </div>
            </div>

            <div className="img-with-dot2">
              <div className="dot-wrapper2">
                <div
                  className="dot2 end-dot2"
                  data-image="img2"
                  id="dot-img2"
                  onClick={handleEndDotClick}
                />
              </div>

              <div
                style={{
                  width: "150px",
                }}
              >
                <img
                  src={dish}
                  alt="Dish"
                  className={`matched-img2 ${
                    selectedImage === "img2" ? "selected-item" : ""
                  } ${
                    lockedImages.includes("img2") || showAnswer
                      ? "disabled-hover"
                      : ""
                  }`}
                  onClick={() => {
                    if (lockedImages.includes("img2") || showAnswer) {
                      return;
                    }

                    document.getElementById("dot-img2")?.click();
                  }}
                  style={{
                    cursor:
                      lockedImages.includes("img2") || showAnswer
                        ? "default"
                        : "pointer",

                    width: "110px",
                    height: "110px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* =================================================
      ROW 3 - DISH
  ================================================= */}

          <div className="matching-row2">
            <div className="word-with-dot2">
              <span className="span-num2">3</span>

              <span
                className={`word-text2 ${
                  selectedWord === "dish" ? "selected-item" : ""
                } ${
                  lockedWords.includes("dish") || showAnswer
                    ? "disabled-hover"
                    : ""
                }`}
                onClick={() => {
                  playWordSound("dish");

                  if (lockedWords.includes("dish") || showAnswer) {
                    return;
                  }

                  document.getElementById("dot-dish")?.click();
                }}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                dish
                {activeWordAudio === "dish" && (
                  <FaVolumeUp
                    size={18}
                    style={{
                      pointerEvents: "none",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>

              {wrongWords.includes("dish") && (
                <span className="error-mark8-u2-p19-q1">✕</span>
              )}

              <div className="dot-wrapper2">
                <div
                  className="dot2 start-dot2"
                  id="dot-dish"
                  data-word="dish"
                  onClick={handleStartDotClick}
                />
              </div>
            </div>

            <div className="img-with-dot2">
              <div className="dot-wrapper2">
                <div
                  className="dot2 end-dot2"
                  data-image="img3"
                  id="dot-img3"
                  onClick={handleEndDotClick}
                />
              </div>

              <div
                style={{
                  width: "150px",
                }}
              >
                <img
                  src={duck}
                  alt="Duck"
                  className={`matched-img2 ${
                    selectedImage === "img3" ? "selected-item" : ""
                  } ${
                    lockedImages.includes("img3") || showAnswer
                      ? "disabled-hover"
                      : ""
                  }`}
                  onClick={() => {
                    if (lockedImages.includes("img3") || showAnswer) {
                      return;
                    }

                    document.getElementById("dot-img3")?.click();
                  }}
                  style={{
                    cursor:
                      lockedImages.includes("img3") || showAnswer
                        ? "default"
                        : "pointer",

                    width: "110px",
                    height: "100px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* =================================================
      ROW 4 - TABLE
  ================================================= */}

          <div className="matching-row2">
            <div className="word-with-dot2">
              <span className="span-num2">4</span>

              <span
                className={`word-text2 ${
                  selectedWord === "table" ? "selected-item" : ""
                } ${
                  lockedWords.includes("table") || showAnswer
                    ? "disabled-hover"
                    : ""
                }`}
                onClick={() => {
                  playWordSound("table");

                  if (lockedWords.includes("table") || showAnswer) {
                    return;
                  }

                  document.getElementById("dot-table")?.click();
                }}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                table
                {activeWordAudio === "table" && (
                  <FaVolumeUp
                    size={18}
                    style={{
                      pointerEvents: "none",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>

              {wrongWords.includes("table") && (
                <span className="error-mark8-u2-p19-q1">✕</span>
              )}

              <div className="dot-wrapper2">
                <div
                  className="dot2 start-dot2"
                  id="dot-table"
                  data-word="table"
                  onClick={handleStartDotClick}
                />
              </div>
            </div>

            <div className="img-with-dot2">
              <div className="dot-wrapper2">
                <div
                  className="dot2 end-dot2"
                  data-image="img4"
                  id="dot-img4"
                  onClick={handleEndDotClick}
                />
              </div>

              <div
                style={{
                  width: "150px",
                }}
              >
                <img
                  src={tiger}
                  alt="Tiger"
                  className={`matched-img2 ${
                    selectedImage === "img4" ? "selected-item" : ""
                  } ${
                    lockedImages.includes("img4") || showAnswer
                      ? "disabled-hover"
                      : ""
                  }`}
                  onClick={() => {
                    if (lockedImages.includes("img4") || showAnswer) {
                      return;
                    }

                    document.getElementById("dot-img4")?.click();
                  }}
                  style={{
                    cursor:
                      lockedImages.includes("img4") || showAnswer
                        ? "default"
                        : "pointer",

                    width: "110px",
                    height: "100px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* =================================================
      LINES
  ================================================= */}

          <svg className="lines-layer2">
            {lines.map((line, index) => (
              <line
                key={`${line.word}-${line.image}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}
          </svg>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button onClick={checkAnswers2} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit2_Page8_Q1;
