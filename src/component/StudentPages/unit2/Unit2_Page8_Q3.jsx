import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/img_unit2/imgs/33.jpg";
import img2 from "../../../assets/img_unit2/imgs/34.jpg";
import img3 from "../../../assets/img_unit2/imgs/35.jpg";
import img4 from "../../../assets/img_unit2/imgs/36.jpg";
import img5 from "../../../assets/img_unit2/imgs/37.jpg";

import sound1 from "../../../assets/unit1/sounds/P17QF.mp3";

// ======================================================
// IMAGE AUDIO
// ======================================================

import dollAudio from "../../../assets/unit2/Page 17 - F/Doll.mp3";
import dogAudio from "../../../assets/unit2/Page 17 - F/Dog.mp3";
import tailAudio from "../../../assets/unit2/Page 17 - F/tail.mp3";
import tallAudio from "../../../assets/unit2/Page 17 - F/Tall.mp3";
import datesAudio from "../../../assets/unit2/Page 17 - F/dates.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

import "./Unit2_Page8_Q3.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// ======================================================
// IMAGE DATA
// ======================================================

const imageItems = [
  {
    id: "img1",
    src: img1,
    alt: "A doll.",
    audio: dollAudio,
    word: "doll",
  },
  {
    id: "img2",
    src: img2,
    alt: "A dog.",
    audio: dogAudio,
    word: "dog",
  },
  {
    id: "img3",
    src: img3,
    alt: "An animal showing its tail.",
    audio: tailAudio,
    word: "tail",
  },
  {
    id: "img4",
    src: img4,
    alt: "A tall person standing next to a shorter person.",
    audio: tallAudio,
    word: "tall",
  },
  {
    id: "img5",
    src: img5,
    alt: "A bunch of dates.",
    audio: datesAudio,
    word: "dates",
  },
];

// ======================================================
// MAIN
// ======================================================

const Unit2_Page8_Q3 = () => {
  const [lines, setLines] = useState([]);

  const containerRef = useRef(null);

  const [wrongImages, setWrongImages] = useState([]);

  const [firstDot, setFirstDot] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  // ======================================================
  // PROGRESSIVE LOCK
  // ======================================================

  const [lockedImages, setLockedImages] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  // ======================================================
  // IMAGE AUDIO
  // ======================================================

  const audioRef = useRef(null);

  const [playingImage, setPlayingImage] = useState(null);

  // ======================================================
  // QUESTION AUDIO STOP SIGNAL
  // ======================================================

  const [modelStopSignal, setModelStopSignal] = useState(0);

  const stopModelAudio = () => {
    setModelStopSignal((prev) => prev + 1);
  };

  // ======================================================
  // STOP IMAGE AUDIO
  // ما بنرجع الصوت للصفر
  // ======================================================

  const stopImageAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingImage(null);
  };

  // ======================================================
  // PLAY IMAGE AUDIO
  // ======================================================

  const playImageAudio = (item) => {
    if (!item?.audio) {
      return;
    }

    /*
      وقف QuestionAudioPlayer
      عن طريق forceStop
    */
    stopModelAudio();

    /*
      وقف أي صوت صورة سابق
    */
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingImage(item.id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingImage(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingImage(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingImage(null);
    };
  };

  // ======================================================
  // MAIN AUDIO
  // ======================================================

  const stopAtSecond = 7.3;

  // ======================================================
  // CORRECT MATCHES
  // ======================================================

  const correctMatches = [
    {
      word: "d",
      image: ["img1", "img2", "img5"],
    },
    {
      word: "t",
      image: ["img3", "img4"],
    },
  ];

  // ======================================================
  // CAPTIONS
  // ======================================================

  const captions = [
    {
      start: 0,
      end: 7.17,
      text: "Page 17, exercise F. Does it begin with a D or T? Listen and match.",
    },
    {
      start: 7.19,
      end: 9.16,
      text: "1-doll. ",
    },
    {
      start: 9.18,
      end: 11.11,
      text: "2-dog. ",
    },
    {
      start: 11.13,
      end: 13.09,
      text: "3-tail.",
    },
    {
      start: 13.11,
      end: 15.16,
      text: "4-tall.",
    },
    {
      start: 15.18,
      end: 17.22,
      text: "5-dates.",
    },
  ];

  // ======================================================
  // HELPERS
  // ======================================================

  const isImageLocked = (imageId) => lockedImages.includes(imageId);

  const isCorrectMatch = (imageId, word) => {
    return correctMatches.some(
      (pair) => pair.word === word && pair.image.includes(imageId),
    );
  };

  // ======================================================
  // START DOT
  // ======================================================

  const handleStartDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const imgId = e.currentTarget.dataset.image;

    if (isImageLocked(imgId)) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    /*
      إذا الصورة كانت موصولة غلط،
      نحذف خطها القديم حتى نقدر نعيد التوصيل.
    */

    setLines((prev) => prev.filter((line) => line.image !== imgId));

    /*
      شيل X فقط عن نفس الصورة.
    */

    setWrongImages((prev) => prev.filter((image) => image !== imgId));

    setSelectedImage(imgId);

    const dotRect = e.currentTarget.getBoundingClientRect();

    setFirstDot({
      image: imgId,

      x: dotRect.left - rect.left + 8,

      y: dotRect.top - rect.top + 8,
    });
  };

  // ======================================================
  // END DOT
  // ======================================================

  const handleEndDotClick = (e) => {
    if (showAnswer || checkCompleted || !firstDot) {
      return;
    }

    if (isImageLocked(firstDot.image)) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const word = e.currentTarget.dataset.word;

    const endRect = e.currentTarget.getBoundingClientRect();

    const currentImage = firstDot.image;

    const newLine = {
      x1: firstDot.x,

      y1: firstDot.y,

      x2: endRect.left - rect.left + 8,

      y2: endRect.top - rect.top + 8,

      word,

      image: currentImage,
    };

    /*
      كل صورة إلها خط واحد فقط.
    */

    setLines((prev) => {
      const filtered = prev.filter((line) => line.image !== currentImage);

      return [...filtered, newLine];
    });

    setSelectedWord(word);

    setWrongImages((prev) => prev.filter((image) => image !== currentImage));

    setFirstDot(null);

    window.setTimeout(() => {
      setSelectedImage(null);

      setSelectedWord(null);
    }, 300);
  };

  // ======================================================
  // CHECK ANSWERS
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const total = correctMatches.reduce(
      (acc, pair) => acc + pair.image.length,
      0,
    );

    if (lines.length < total) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );

      return;
    }

    const wrong = [];

    const correctImageIds = [];

    let correctCount = 0;

    lines.forEach((line) => {
      const correct = isCorrectMatch(line.image, line.word);

      if (correct) {
        correctCount++;

        correctImageIds.push(line.image);
      } else {
        wrong.push(line.image);
      }
    });

    // ======================================================
    // LOCK CORRECT IMAGES ONLY
    // ======================================================

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...correctImageIds])),
    );

    // ======================================================
    // WRONG X ONLY
    // ======================================================

    setWrongImages(wrong);

    setFirstDot(null);

    setSelectedImage(null);

    setSelectedWord(null);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;margin-top:10px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    // ======================================================
    // ALL CORRECT
    // ======================================================

    if (correctCount === total) {
      setLockedImages(imageItems.map((item) => item.id));

      setWrongImages([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const handleShowAnswer = () => {
    stopImageAudio();

    if (!containerRef.current) {
      return;
    }

    setShowAnswer(true);

    setCheckCompleted(true);

    setSelectedImage(null);

    setSelectedWord(null);

    setFirstDot(null);

    setWrongImages([]);

    setLockedImages(imageItems.map((item) => item.id));

    const rect = containerRef.current.getBoundingClientRect();

    const answerLines = [];

    correctMatches.forEach((pair) => {
      pair.image.forEach((imgId) => {
        const startDot = document.querySelector(
          `.start-dot2-unit2[data-image="${imgId}"]`,
        );

        const endDot = document.querySelector(
          `.end-dot2-unit2[data-word="${pair.word}"]`,
        );

        if (startDot && endDot) {
          const startRect = startDot.getBoundingClientRect();

          const endRect = endDot.getBoundingClientRect();

          answerLines.push({
            x1: startRect.left - rect.left + 8,

            y1: startRect.top - rect.top + 8,

            x2: endRect.left - rect.left + 8,

            y2: endRect.top - rect.top + 8,

            word: pair.word,

            image: imgId,
          });
        }
      });
    });

    setLines(answerLines);
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    stopImageAudio();

    stopModelAudio();

    setLines([]);

    setWrongImages([]);

    setShowAnswer(false);

    setLockedImages([]);

    setCheckCompleted(false);

    setFirstDot(null);

    setSelectedImage(null);

    setSelectedWord(null);
  };

  // ======================================================
  // QUESTION AUDIO INTERACTION
  // لما المستخدم يشغل QuestionAudioPlayer
  // وقف صوت الصورة فقط
  // ======================================================

  const handleModelInteract = () => {
    stopImageAudio();
  };

  // ======================================================
  // CLEANUP
  // ======================================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.onended = null;
        audioRef.current.onerror = null;

        audioRef.current = null;
      }
    };
  }, []);

  // ======================================================
  // RENDER IMAGE
  // ======================================================

  const renderImageItem = (item) => {
    const locked = isImageLocked(item.id);

    const isPlaying = playingImage === item.id;

    return (
      <div
        className="img-box2"
        key={item.id}
        style={{
          position: "relative",
        }}
      >
        {/* ========================================
            IMAGE
        ======================================== */}

        <img
          src={item.src}
          alt={item.alt}
          className={`clickable-img-unit2-p7-q2 ${
            selectedImage === item.id ? "selected-item" : ""
          }`}
          onClick={() => {
            /*
              الصوت يشتغل دائمًا
              حتى بعد Check أو Show Answer
            */

            playImageAudio(item);

            /*
              فقط التوصيل هو اللي يتوقف
              لو الصورة مقفلة
            */

            if (locked || showAnswer || checkCompleted) {
              return;
            }

            document.getElementById(`${item.id}-dot`)?.click();
          }}
          style={{
            cursor: "pointer",
          }}
        />

        {/* ========================================
            AUDIO ICON
            تظهر فقط أثناء تشغيل الصوت
        ======================================== */}

        {isPlaying && (
          <span
            aria-hidden="true"
            className="image-playing-icon-unit2-p8-q3"
            style={{
              position: "absolute",

              top: "5px",

              right: "5px",

              width: "30px",

              height: "30px",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              borderRadius: "50%",

              background: "rgba(255,255,255,0.9)",

              fontSize: "18px",

              zIndex: 5,

              pointerEvents: "none",
            }}
          >
            <FaVolumeUp />
          </span>
        )}

        {/* ========================================
            WRONG X
        ======================================== */}

        {wrongImages.includes(item.id) && (
          <span className="error-mark-img">✕</span>
        )}

        {/* ========================================
            START DOT
        ======================================== */}

        <div
          className="dot2-unit2 start-dot2-unit2"
          data-image={item.id}
          id={`${item.id}-dot`}
          onClick={handleStartDotClick}
        />
      </div>
    );
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
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="F"
          title={
            <>
              Does it begin with
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                d{" "}
              </span>
              or
              <span
                style={{
                  color: "red",
                }}
              >
                {" "}
                t{" "}
              </span>
              ? Listen and match.
            </>
          }
          subTitle="Listen to each picture name, then match it to d or t."
        />

        {/* ========================================
            MAIN AUDIO
        ======================================== */}

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          forceStop={modelStopSignal}
          onInteract={handleModelInteract}
          pageId="unit2-page17-3"
        />

        {/* ========================================
            MATCHING
        ======================================== */}

        <div className="match-wrapper2-review1-p2-q3" ref={containerRef}>
          {/* ======================================
              IMAGES
          ====================================== */}

          <div className="match-images-row2">
            {imageItems.map((item) => renderImageItem(item))}
          </div>

          {/* ======================================
              LETTERS
          ====================================== */}

          <div className="match-words-row2">
            {/* D */}

            <div className="word-box2">
              <h5
                onClick={() => {
                  if (showAnswer || checkCompleted) {
                    return;
                  }

                  document.getElementById("d-dot")?.click();
                }}
                id="d-char"
                style={{
                  border: "2px solid #2effeaff",

                  borderRadius: "8px",

                  background: "#b7fff8ff",

                  height: "30px",

                  width: "60px",

                  display: "flex",

                  justifyContent: "center",

                  marginTop: "10px",

                  alignItems: "center",

                  cursor: showAnswer || checkCompleted ? "default" : "pointer",
                }}
                className={`clickable-word-unit2-p7-q2 ${
                  selectedWord === "d" ? "selected-item" : ""
                } ${showAnswer || checkCompleted ? "disabled-hover" : ""}`}
              >
                d
              </h5>

              <div
                className="dot2-unit2 end-dot2-unit2"
                data-word="d"
                id="d-dot"
                onClick={handleEndDotClick}
              />
            </div>

            {/* T */}

            <div className="word-box2">
              <h5
                onClick={() => {
                  if (showAnswer || checkCompleted) {
                    return;
                  }

                  document.getElementById("t-dot")?.click();
                }}
                id="t-char"
                style={{
                  border: "2px solid green",

                  borderRadius: "8px",

                  background: "#92e992",

                  height: "30px",

                  width: "60px",

                  display: "flex",

                  justifyContent: "center",

                  marginTop: "10px",

                  cursor: showAnswer || checkCompleted ? "default" : "pointer",

                  alignItems: "center",
                }}
                className={`clickable-word-unit2-p7-q2 ${
                  selectedWord === "t" ? "selected-item" : ""
                } ${showAnswer || checkCompleted ? "disabled-hover" : ""}`}
              >
                t
              </h5>

              <div
                className="dot2-unit2 end-dot2-unit2"
                data-word="t"
                id="t-dot"
                onClick={handleEndDotClick}
              />
            </div>
          </div>

          {/* ======================================
              LINES
          ====================================== */}

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

        {/* ======================================
            BUTTONS
        ====================================== */}

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
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

export default Unit2_Page8_Q3;
