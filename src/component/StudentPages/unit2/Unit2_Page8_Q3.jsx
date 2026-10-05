import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/img_unit2/imgs/33.jpg";
import img2 from "../../../assets/img_unit2/imgs/34.jpg";
import img3 from "../../../assets/img_unit2/imgs/35.jpg";
import img4 from "../../../assets/img_unit2/imgs/36.jpg";
import img5 from "../../../assets/img_unit2/imgs/37.jpg";

import sound1 from "../../../assets/unit1/sounds/P17QF.mp3";

/* ======================================================
   IMAGE AUDIO
====================================================== */

import dollAudio from "../../../assets/unit2/Page 17 - F/Doll.mp3";
import dogAudio from "../../../assets/unit2/Page 17 - F/Dog.mp3";
import tailAudio from "../../../assets/unit2/Page 17 - F/tail.mp3";
import tallAudio from "../../../assets/unit2/Page 17 - F/Tall.mp3";
import datesAudio from "../../../assets/unit2/Page 17 - F/dates.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

import "./Unit2_Page8_Q3.css";


import { FaVolumeUp } from "react-icons/fa";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* ======================================================
   IMAGE DATA
====================================================== */

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

/* ======================================================
   LETTER DATA
====================================================== */

const letterItems = [
  {
    id: "d",
    label: "d",
    dotId: "d-dot",
  },
  {
    id: "t",
    label: "t",
    dotId: "t-dot",
  },
];

/* ======================================================
   MAIN
====================================================== */

const Unit2_Page8_Q3 = () => {
  const [lines, setLines] = useState([]);

  const [previewLine, setPreviewLine] = useState(null);

  const containerRef = useRef(null);

  /*
    firstDot ممكن يكون:

    من الصورة:
    {
      side: "image",
      image: "img1",
      x,
      y
    }

    أو من الحرف بالماوس:
    {
      side: "word",
      word: "d",
      x,
      y
    }
  */
  const [firstDot, setFirstDot] = useState(null);

  const [wrongImages, setWrongImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  /* ======================================================
     PROGRESSIVE LOCK
  ====================================================== */

  const [lockedImages, setLockedImages] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  /* ======================================================
     KEYBOARD REFS
  ====================================================== */

  const imageRefs = useRef({});
  const letterRefs = useRef([]);

  const [announcement, setAnnouncement] = useState("");

  /* ======================================================
     IMAGE AUDIO
  ====================================================== */

  const audioRef = useRef(null);

  const [playingImage, setPlayingImage] = useState(null);

  /* ======================================================
     QUESTION AUDIO STOP SIGNAL
  ====================================================== */

  const [modelStopSignal, setModelStopSignal] = useState(0);

  const stopModelAudio = () => {
    setModelStopSignal((prev) => prev + 1);
  };

  /* ======================================================
     STOP IMAGE AUDIO
     ما بنرجع الصوت للصفر
  ====================================================== */

  const stopImageAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingImage(null);
  };

  /* ======================================================
     PLAY IMAGE AUDIO
  ====================================================== */

  const playImageAudio = (item) => {
    if (!item?.audio) {
      return;
    }

    /*
      وقف QuestionAudioPlayer
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

  /* ======================================================
     MAIN AUDIO
  ====================================================== */

  const stopAtSecond = 7.3;

  /* ======================================================
     CORRECT MATCHES
  ====================================================== */

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

  /* ======================================================
     CAPTIONS
  ====================================================== */

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

  /* ======================================================
     HELPERS
  ====================================================== */

  const isImageLocked = (imageId) => lockedImages.includes(imageId);

  const isCorrectMatch = (imageId, word) => {
    return correctMatches.some(
      (pair) => pair.word === word && pair.image.includes(imageId),
    );
  };

  const getDotPosition = (element) => {
    if (!element || !containerRef.current) {
      return null;
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const rect = element.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,

      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  /* ======================================================
     AVAILABLE LETTERS
     هون d و t دايمًا متاحين
     لأن أكثر من صورة ممكن تتوصل لنفس الحرف
  ====================================================== */

  const getAvailableLetterIndexes = () => letterItems.map((_, index) => index);

  /* ======================================================
     KEYBOARD PREVIEW LINE
  ====================================================== */

  const updatePreviewLine = (startPoint, word) => {
    if (!startPoint) return;

    const endDot = document.getElementById(`${word}-dot`);

    if (!endDot) return;

    const end = getDotPosition(endDot);

    if (!end) return;

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: end.x,
      y2: end.y,
    });
  };

  /* ======================================================
     COMMIT CONNECTION
     IMPORTANT:
     - كل صورة إلها خط واحد
     - الحرف d/t ممكن يستقبل أكتر من خط
  ====================================================== */

  const commitConnection = (imageId, word) => {
    if (
      !imageId ||
      !word ||
      showAnswer ||
      checkCompleted ||
      isImageLocked(imageId)
    ) {
      return;
    }

    const startDot = document.getElementById(`${imageId}-dot`);

    const endDot = document.getElementById(`${word}-dot`);

    if (!startDot || !endDot) {
      return;
    }

    const start = getDotPosition(startDot);

    const end = getDotPosition(endDot);

    if (!start || !end) {
      return;
    }

    const newLine = {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      word,
      image: imageId,
    };

    /*
      مهم جدًا:
      نحذف خط الصورة الحالية فقط.

      لا نحذف حسب word
      لأن أكثر من صورة مسموح تتوصل على d أو t.
    */

    setLines((prev) => {
      const filtered = prev.filter((line) => line.image !== imageId);

      return [...filtered, newLine];
    });

    /*
      شيل X فقط عن الصورة
      اللي تم تعديلها.
    */

    setWrongImages((prev) => prev.filter((image) => image !== imageId));

    setSelectedImage(imageId);

    setSelectedWord(word);

    setFirstDot(null);

    setPreviewLine(null);

    setAnnouncement(`${imageId} connected to ${word}.`);

    window.setTimeout(() => {
      setSelectedImage(null);

      setSelectedWord(null);
    }, 300);
  };

  /* ======================================================
     KEYBOARD START
     IMAGE -> LETTER
  ====================================================== */

  const startKeyboardMatch = (imageId, dotId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    const dot = document.getElementById(dotId);

    if (!dot) {
      return;
    }

    const start = getDotPosition(dot);

    if (!start) {
      return;
    }

    /*
      إذا الصورة موصولة غلط من قبل،
      شيل خطها القديم فقط.
    */

    setLines((prev) => prev.filter((line) => line.image !== imageId));

    /*
      شيل X فقط عن نفس الصورة.
    */

    setWrongImages((prev) => prev.filter((image) => image !== imageId));

    setSelectedImage(imageId);

    setSelectedWord(null);

    const startPoint = {
      side: "image",
      image: imageId,
      x: start.x,
      y: start.y,
    };

    setFirstDot(startPoint);

    setAnnouncement(
      `${imageId} selected. Use Tab or Shift plus Tab to choose d or t, then press Enter or Space.`,
    );

    requestAnimationFrame(() => {
      const available = getAvailableLetterIndexes();

      if (!available.length) {
        return;
      }

      const firstIndex = available[0];

      const firstLetter = letterRefs.current[firstIndex];

      if (firstLetter) {
        firstLetter.focus();

        updatePreviewLine(startPoint, letterItems[firstIndex].id);
      }
    });
  };

  /* ======================================================
     KEYBOARD LETTER SIDE
  ====================================================== */

  const handleLetterKeyboard = (e, index, item) => {
    if (!firstDot || firstDot.side !== "image") {
      return;
    }

    if (showAnswer || checkCompleted) {
      return;
    }

    /* ==================================================
       TAB BETWEEN d / t
    ================================================== */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableLetterIndexes();

      if (!available.length) {
        return;
      }

      const currentPosition = available.indexOf(index);

      let nextPosition;

      if (e.shiftKey) {
        nextPosition =
          currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
      } else {
        nextPosition =
          currentPosition === -1 || currentPosition === available.length - 1
            ? 0
            : currentPosition + 1;
      }

      const nextIndex = available[nextPosition];

      const nextElement = letterRefs.current[nextIndex];

      if (nextElement) {
        nextElement.focus();

        updatePreviewLine(firstDot, letterItems[nextIndex].id);
      }

      return;
    }

    /* ==================================================
       ENTER / SPACE = CONNECT
    ================================================== */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      const currentImage = firstDot.image;

      commitConnection(currentImage, item.id);

      /*
        بعد التوصيل:
        رجع لأول صورة غير مقفلة.
      */

      window.setTimeout(() => {
        const nextImage =
          imageItems.find(
            (imageItem) =>
              !isImageLocked(imageItem.id) && imageItem.id !== currentImage,
          ) || imageItems.find((imageItem) => !isImageLocked(imageItem.id));

        if (nextImage) {
          imageRefs.current[nextImage.id]?.focus();
        }
      }, 100);

      return;
    }

    /* ==================================================
       ESCAPE
    ================================================== */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const currentImage = firstDot.image;

      setFirstDot(null);

      setPreviewLine(null);

      setSelectedImage(null);

      setSelectedWord(null);

      setAnnouncement(`${currentImage} selection cancelled.`);

      requestAnimationFrame(() => {
        if (!isImageLocked(currentImage)) {
          imageRefs.current[currentImage]?.focus();
        }
      });
    }
  };

  /* ======================================================
     MOUSE IMAGE
     - صورة أول
     - أو صورة ثاني بعد اختيار الحرف
  ====================================================== */

  const handleImageMouseClick = (item) => {
    /*
      الصوت الموجود أصلًا يظل شغال.
    */

    playImageAudio(item);

    if (showAnswer || checkCompleted || isImageLocked(item.id)) {
      return;
    }

    /* ==================================================
       LETTER WAS SELECTED FIRST
       IMAGE = SECOND SIDE
    ================================================== */

    if (firstDot?.side === "word") {
      commitConnection(item.id, firstDot.word);

      return;
    }

    /* ==================================================
       IMAGE = FIRST SIDE
    ================================================== */

    const dot = document.getElementById(`${item.id}-dot`);

    if (!dot) {
      return;
    }

    const start = getDotPosition(dot);

    if (!start) {
      return;
    }

    /*
      إذا الصورة موصولة غلط قبل،
      نحذف خطها فقط.
    */

    setLines((prev) => prev.filter((line) => line.image !== item.id));

    /*
      نشيل X فقط عن الصورة.
    */

    setWrongImages((prev) => prev.filter((image) => image !== item.id));

    setSelectedImage(item.id);

    setSelectedWord(null);

    setFirstDot({
      side: "image",
      image: item.id,
      x: start.x,
      y: start.y,
    });

    /*
      الماوس بدون preview line.
    */

    setPreviewLine(null);
  };

  /* ======================================================
     MOUSE LETTER
     - حرف ثاني بعد صورة
     - أو حرف أول ثم صورة
  ====================================================== */

  const handleLetterMouseClick = (word) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /* ==================================================
       IMAGE WAS SELECTED FIRST
    ================================================== */

    if (firstDot?.side === "image") {
      commitConnection(firstDot.image, word);

      return;
    }

    /* ==================================================
       LETTER = FIRST SIDE
    ================================================== */

    const dot = document.getElementById(`${word}-dot`);

    if (!dot) {
      return;
    }

    const start = getDotPosition(dot);

    if (!start) {
      return;
    }

    /*
      مهم:
      ما بنشيل أي خطوط للحرف،
      لأنه ممكن يكون عليه أكثر من صورة.
    */

    setSelectedWord(word);

    setSelectedImage(null);

    setFirstDot({
      side: "word",
      word,
      x: start.x,
      y: start.y,
    });

    setPreviewLine(null);
  };

  /* ======================================================
     DOT START - IMAGE
  ====================================================== */

  const handleStartDotClick = (e) => {
    const imgId = e.currentTarget.dataset.image;

    if (!imgId) {
      return;
    }

    const item = imageItems.find((imageItem) => imageItem.id === imgId);

    if (!item) {
      return;
    }

    handleImageMouseClick(item);
  };

  /* ======================================================
     DOT END - LETTER
  ====================================================== */

  const handleEndDotClick = (e) => {
    const word = e.currentTarget.dataset.word;

    if (!word) {
      return;
    }

    handleLetterMouseClick(word);
  };

  /* ======================================================
     CHECK ANSWERS
  ====================================================== */

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

    /* ======================================================
       LOCK CORRECT IMAGES ONLY
    ====================================================== */

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...correctImageIds])),
    );

    /* ======================================================
       WRONG X ONLY
    ====================================================== */

    setWrongImages(wrong);

    setFirstDot(null);

    setPreviewLine(null);

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

    /* ======================================================
       ALL CORRECT
    ====================================================== */

    if (correctCount === total) {
      setLockedImages(imageItems.map((item) => item.id));

      setWrongImages([]);

      setCheckCompleted(true);

      setAnnouncement("All matches are correct.");

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* ======================================================
     SHOW ANSWER
  ====================================================== */

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

    setPreviewLine(null);

    setWrongImages([]);

    setLockedImages(imageItems.map((item) => item.id));

    const answerLines = [];

    correctMatches.forEach((pair) => {
      pair.image.forEach((imgId) => {
        const startDot = document.getElementById(`${imgId}-dot`);

        const endDot = document.getElementById(`${pair.word}-dot`);

        const start = getDotPosition(startDot);

        const end = getDotPosition(endDot);

        if (start && end) {
          answerLines.push({
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
            word: pair.word,
            image: imgId,
          });
        }
      });
    });

    setLines(answerLines);

    setAnnouncement("Correct answers shown.");
  };

  /* ======================================================
     RESET
  ====================================================== */

  const reset = () => {
    stopImageAudio();

    stopModelAudio();

    setLines([]);

    setPreviewLine(null);

    setWrongImages([]);

    setShowAnswer(false);

    setLockedImages([]);

    setCheckCompleted(false);

    setFirstDot(null);

    setSelectedImage(null);

    setSelectedWord(null);

    setAnnouncement("Activity reset.");
  };

  /* ======================================================
     QUESTION AUDIO INTERACTION
  ====================================================== */

  const handleModelInteract = () => {
    stopImageAudio();
  };

  /* ======================================================
     CLEANUP
  ====================================================== */

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

  /* ======================================================
     RENDER IMAGE
  ====================================================== */

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
          ref={(el) => {
            imageRefs.current[item.id] = el;
          }}
          src={item.src}
          alt={item.alt}
          className={`clickable-img-unit2-p7-q2 ${
            selectedImage === item.id ? "selected-item" : ""
          } ${locked || showAnswer ? "disabled-hover" : ""}`}
          role="button"
          tabIndex={locked || showAnswer || checkCompleted || firstDot ? -1 : 0}
          aria-label={
            locked
              ? `${item.alt} Correct match.`
              : `${item.alt} Press Enter or Space to select and hear it.`
          }
          onClick={() => {
            handleImageMouseClick(item);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              /*
                الصوت الموجود أصلًا.
              */

              playImageAudio(item);

              if (locked || showAnswer || checkCompleted) {
                return;
              }

              startKeyboardMatch(item.id, `${item.id}-dot`);
            }
          }}
          style={{
            cursor: "pointer",
          }}
        />

        {/* ========================================
            AUDIO ICON
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
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    );
  };

  /* ======================================================
     RENDER
  ====================================================== */

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
      {/* SCREEN READER STATUS */}

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div className="div-forall">
        <ExerciseHeaderReview
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
                ref={(el) => {
                  letterRefs.current[0] = el;
                }}
                onClick={() => {
                  handleLetterMouseClick("d");
                }}
                onFocus={() => {
                  if (!firstDot || firstDot.side !== "image") {
                    return;
                  }

                  updatePreviewLine(firstDot, "d");
                }}
                onKeyDown={(e) => handleLetterKeyboard(e, 0, letterItems[0])}
                role={firstDot?.side === "image" ? "button" : undefined}
                tabIndex={
                  firstDot?.side === "image" && !showAnswer && !checkCompleted
                    ? 0
                    : -1
                }
                aria-label={
                  firstDot?.side === "image"
                    ? `d. Press Enter or Space to connect with ${firstDot.image}.`
                    : "d"
                }
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
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            {/* T */}

            <div className="word-box2">
              <h5
                ref={(el) => {
                  letterRefs.current[1] = el;
                }}
                onClick={() => {
                  handleLetterMouseClick("t");
                }}
                onFocus={() => {
                  if (!firstDot || firstDot.side !== "image") {
                    return;
                  }

                  updatePreviewLine(firstDot, "t");
                }}
                onKeyDown={(e) => handleLetterKeyboard(e, 1, letterItems[1])}
                role={firstDot?.side === "image" ? "button" : undefined}
                tabIndex={
                  firstDot?.side === "image" && !showAnswer && !checkCompleted
                    ? 0
                    : -1
                }
                aria-label={
                  firstDot?.side === "image"
                    ? `t. Press Enter or Space to connect with ${firstDot.image}.`
                    : "t"
                }
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
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ======================================
              LINES
          ====================================== */}

          <svg className="lines-layer2" aria-hidden="true">
            {/* FIXED LINES */}

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

            {/* KEYBOARD PREVIEW */}

            {previewLine && (
              <line
                x1={previewLine.x1}
                y1={previewLine.y1}
                x2={previewLine.x2}
                y2={previewLine.y2}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
                pointerEvents="none"
              />
            )}
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
