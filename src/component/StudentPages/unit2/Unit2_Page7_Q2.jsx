import React, { useState, useRef } from "react";

import img1 from "../../../assets/img_unit2/imgs/morning.jpg";
import img2 from "../../../assets/img_unit2/imgs/hey.jpg";
import img3 from "../../../assets/img_unit2/imgs/bey.jpg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page7_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   SENTENCE SOUNDS
===================================================== */

import helloSound from "../../../assets/unit2/Page 16 - B/Hello! I'm Hansel..mp3";
import morningSound from "../../../assets/unit2/Page 16 - B/Good morning!.mp3";
import goodbyeSound from "../../../assets/unit2/Page 16 - B/Goodbye!.mp3";

const Unit2_Page7_Q2 = () => {
  /* =====================================================
     STATES
  ===================================================== */

  const [lines, setLines] = useState([]);

  const containerRef = useRef(null);

  const [firstDot, setFirstDot] = useState(null);

  const [wrongImages, setWrongImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // الصور اللي توصيلها صح بعد Check
  const [lockedImages, setLockedImages] = useState([]);

  // الجمل اللي توصيلها صح بعد Check
  const [lockedWords, setLockedWords] = useState([]);

  // بعد النجاح النهائي
  const [checkCompleted, setCheckCompleted] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const sentenceAudioRef = useRef(null);

  const [activeSentenceAudio, setActiveSentenceAudio] = useState(null);

  /* =====================================================
     CORRECT MATCHES
  ===================================================== */

  const correctMatches = [
    {
      word: "Hello! I'm Hansel.",
      image: "img2",
    },
    {
      word: "Good morning!",
      image: "img1",
    },
    {
      word: "Goodbye!",
      image: "img3",
    },
  ];

  /* =====================================================
     IMAGES
  ===================================================== */

  const images = [
    {
      id: "img1",
      src: img1,
      alt: "Morning greeting",
    },
    {
      id: "img2",
      src: img2,
      alt: "Hello greeting",
    },
    {
      id: "img3",
      src: img3,
      alt: "Goodbye greeting",
    },
  ];

  /* =====================================================
     WORDS + SOUNDS
  ===================================================== */

  const wordItems = [
    {
      id: "dot-hello",
      word: "Hello! I'm Hansel.",
      num: 1,
      sound: helloSound,
    },
    {
      id: "dot-good",
      word: "Good morning!",
      num: 2,
      sound: morningSound,
    },
    {
      id: "dot-goodbye",
      word: "Goodbye!",
      num: 3,
      sound: goodbyeSound,
    },
  ];

  /* =====================================================
     PLAY SENTENCE SOUND
  ===================================================== */

  const playSentenceSound = (sound, id) => {
    if (!sentenceAudioRef.current) return;

    sentenceAudioRef.current.pause();

    sentenceAudioRef.current.currentTime = 0;

    sentenceAudioRef.current.src = sound;

    setActiveSentenceAudio(id);

    sentenceAudioRef.current.play().catch(() => {
      setActiveSentenceAudio(null);
    });

    sentenceAudioRef.current.onended = () => {
      setActiveSentenceAudio(null);
    };
  };

  /* =====================================================
     START DOT — IMAGE
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer) return;

    const image = e.currentTarget.dataset.image || null;

    if (!image) return;

    /* الصورة الصح المقفلة ممنوع تعديلها */

    if (lockedImages.includes(image)) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = e.currentTarget.getBoundingClientRect();

    setSelectedImage(image);

    setSelectedWord(null);

    setFirstDot({
      image,

      x: dotRect.left - rect.left + 7,

      y: dotRect.top - rect.top + 7,
    });

    /*
      إذا كانت هاي الصورة عليها خطأ سابق،
      أول ما نبدأ نعدلها نشيل علامة X
    */

    setWrongImages((prev) => prev.filter((id) => id !== image));
  };

  /* =====================================================
     END DOT — WORD
  ===================================================== */

  const handleEndDotClick = (e) => {
    if (showAnswer) return;

    if (!firstDot) return;

    const endWord = e.currentTarget.dataset.word || null;

    if (!endWord) return;

    /* الجملة الصح المقفلة ممنوع استبدالها */

    if (lockedWords.includes(endWord)) {
      return;
    }

    /* الصورة نفسها لو أصبحت locked لأي سبب */

    if (lockedImages.includes(firstDot.image)) {
      setFirstDot(null);
      setSelectedImage(null);

      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = e.currentTarget.getBoundingClientRect();

    const newLine = {
      x1: firstDot.x,

      y1: firstDot.y,

      x2: dotRect.left - rect.left + 7,

      y2: dotRect.top - rect.top + 7,

      word: endWord,

      image: firstDot.image,
    };

    /* =================================================
       IMPORTANT:
       كل image إلها line واحد
       وكل word إلها line واحد

       إذا image أو word موصولين من قبل،
       الخط الجديد يحل مكان القديم.
    ================================================= */

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.image !== firstDot.image && line.word !== endWord,
      );

      return [...filtered, newLine];
    });

    /*
      ممكن الجملة الجديدة كانت موصولة
      بصورة غلط ثانية وكان عليها X.

      نشيل X عن أي صورة فقدت توصيلها.
    */

    setWrongImages((prev) =>
      prev.filter((imageId) => {
        if (imageId === firstDot.image) {
          return false;
        }

        const oldLine = lines.find(
          (line) => line.image === imageId && line.word === endWord,
        );

        return !oldLine;
      }),
    );

    setSelectedWord(endWord);

    setTimeout(() => {
      setSelectedImage(null);

      setSelectedWord(null);
    }, 300);

    setFirstDot(null);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers2 = () => {
    /*
      بعد Show Answer أو نجاح نهائي،
      ما نعمل أي شيء
    */

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

    let wrong = [];

    let correctCount = 0;

    const newlyLockedImages = [];

    const newlyLockedWords = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;

        newlyLockedImages.push(line.image);

        newlyLockedWords.push(line.word);
      } else {
        wrong.push(line.image);
      }
    });

    /* =================================================
       LOCK CORRECT CONNECTIONS ONLY
    ================================================= */

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newlyLockedImages])),
    );

    setLockedWords((prev) =>
      Array.from(new Set([...prev, ...newlyLockedWords])),
    );

    /* =================================================
       WRONG ONLY
    ================================================= */

    setWrongImages(wrong);

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

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (correctCount === total) {
      setWrongImages([]);

      setLockedImages(correctMatches.map((item) => item.image));

      setLockedWords(correctMatches.map((item) => item.word));

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =================================================
       PARTIAL / WRONG
    ================================================= */

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
        x: r.left - rect.left + 7,

        y: r.top - rect.top + 7,
      };
    };

    const finalLines = correctMatches.map((line) => {
      const start = getDotPosition(`[data-image="${line.image}"]`);

      const end = getDotPosition(`[data-word="${line.word}"]`);

      return {
        ...line,

        x1: start.x,

        y1: start.y,

        x2: end.x,

        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongImages([]);

    setSelectedImage(null);

    setSelectedWord(null);

    setFirstDot(null);

    setShowAnswer(true);

    setCheckCompleted(true);

    setLockedImages(correctMatches.map((item) => item.image));

    setLockedWords(correctMatches.map((item) => item.word));
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setLines([]);

    setWrongImages([]);

    setFirstDot(null);

    setShowAnswer(false);

    setLockedImages([]);

    setLockedWords([]);

    setCheckCompleted(false);

    setSelectedImage(null);

    setSelectedWord(null);

    if (sentenceAudioRef.current) {
      sentenceAudioRef.current.pause();

      sentenceAudioRef.current.currentTime = 0;
    }

    setActiveSentenceAudio(null);
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
      {/* SENTENCE AUDIO */}

      <audio
        ref={sentenceAudioRef}
        style={{
          display: "none",
        }}
      />

      <div
        className="div-forall"
        style={{
          gap: "40px",
        }}
      >
        <ExerciseHeader
          sectionLetter="B"
          title="Read, look, and match."
          subTitle="Read each greeting, then connect it to the matching picture."
        />

        <div className="match-wrapper2" ref={containerRef}>
          {/* =================================================
              IMAGES
          ================================================= */}

          <div className="match-images-row2">
            {images.map((item) => {
              const isLocked = lockedImages.includes(item.id);

              return (
                <div key={item.id} className="img-box2">
                  {/* WRONG */}

                  {wrongImages.includes(item.id) && (
                    <span className="error-mark-img">✕</span>
                  )}

                  {/* IMAGE */}

                  <img
                    src={item.src}
                    alt={item.alt}
                    className={`clickable-img-unit2-p7-q2 ${
                      selectedImage === item.id ? "selected-item" : ""
                    } ${showAnswer || isLocked ? "disabled-hover" : ""}`}
                    onClick={() => {
                      if (showAnswer || isLocked) {
                        return;
                      }

                      document.getElementById(`${item.id}-dot`)?.click();
                    }}
                    style={{
                      cursor: showAnswer || isLocked ? "default" : "pointer",
                    }}
                  />

                  {/* START DOT */}

                  <div
                    className="dot22-unit2-q7 start-dot22-unit2-q7"
                    id={`${item.id}-dot`}
                    data-image={item.id}
                    onClick={handleStartDotClick}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              SENTENCES
          ================================================= */}

          <div className="match-words-row2">
            {wordItems.map((item) => {
              const isLocked = lockedWords.includes(item.word);

              return (
                <div key={item.id} className="word-box2-unit2-p7-q2">
                  {/* END DOT */}

                  <div
                    className="dot22-unit2-q7 end-dot22-unit2-q7"
                    id={item.id}
                    data-word={item.word}
                    onClick={handleEndDotClick}
                  />

                  {/* SENTENCE */}

                  <h5
                    className={`clickable-word-unit2-p7-q2 ${
                      selectedWord === item.word ? "selected-item" : ""
                    } ${showAnswer || isLocked ? "disabled-hover" : ""}`}
                    onClick={() => {
                      playSentenceSound(item.sound, item.id);

                      if (firstDot && !showAnswer && !isLocked) {
                        document.getElementById(item.id)?.click();
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      fontSize: "20px",
                      position: "relative",
                      width: "260px",
                      textAlign: "center",
                      paddingRight: "35px",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        color: "darkblue",
                        fontWeight: "700",
                      }}
                    >
                      {item.num}{" "}
                    </span>

                    {item.word}

                    {activeSentenceAudio === item.id && (
                      <FaVolumeUp
                        size={20}
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </h5>
                </div>
              );
            })}
          </div>

          {/* =================================================
              LINES
          ================================================= */}

          <svg className="lines-layer2">
            {lines.map((line, index) => (
              <line
                key={`${line.image}-${line.word}-${index}`}
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
  );
};

export default Unit2_Page7_Q2;
