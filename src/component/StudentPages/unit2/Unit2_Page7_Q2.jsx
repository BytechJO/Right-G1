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

  const [previewLine, setPreviewLine] = useState(null);

  const containerRef = useRef(null);

  /*
    firstDot ممكن يكون:
    {
      side: "image",
      image,
      x,
      y
    }

    أو:
    {
      side: "word",
      word,
      x,
      y
    }
  */
  const [firstDot, setFirstDot] = useState(null);

  const [wrongImages, setWrongImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [lockedImages, setLockedImages] = useState([]);

  const [lockedWords, setLockedWords] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  /* =====================================================
     KEYBOARD REFS
  ===================================================== */

  const imageRefs = useRef({});
  const wordRefs = useRef([]);

  const [announcement, setAnnouncement] = useState("");

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
     HELPERS
  ===================================================== */

  const isImageLocked = (imageId) => lockedImages.includes(imageId);

  const isWordLocked = (word) => lockedWords.includes(word);

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
     GET DOT POSITION
  ===================================================== */

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

  /* =====================================================
     PREVIEW LINE — KEYBOARD
  ===================================================== */

  const updatePreviewLine = (startPoint, word) => {
    if (!startPoint) {
      return;
    }

    const item = wordItems.find((item) => item.word === word);

    if (!item) {
      return;
    }

    const endDot = document.getElementById(item.id);

    if (!endDot) {
      return;
    }

    const end = getDotPosition(endDot);

    if (!end) {
      return;
    }

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,

      x2: end.x,
      y2: end.y,
    });
  };

  /* =====================================================
     AVAILABLE RIGHT WORDS — KEYBOARD
  ===================================================== */

  const getAvailableWordIndexes = () =>
    wordItems
      .map((item, index) => ({
        word: item.word,
        index,
      }))
      .filter(({ word }) => !isWordLocked(word))
      .map(({ index }) => index);

  /* =====================================================
     CLEAR CHANGED WRONG MARKS
  ===================================================== */

  const clearWrongForChangedConnections = (imageId, word) => {
    const previousWordConnection = lines.find((line) => line.word === word);

    setWrongImages((prev) =>
      prev.filter(
        (wrongImageId) =>
          wrongImageId !== imageId &&
          wrongImageId !== previousWordConnection?.image,
      ),
    );
  };

  /* =====================================================
     COMMIT CONNECTION
     مشترك للماوس والكيبورد
  ===================================================== */

  const commitConnection = (imageId, word) => {
    if (
      showAnswer ||
      checkCompleted ||
      !imageId ||
      !word ||
      isImageLocked(imageId) ||
      isWordLocked(word)
    ) {
      return;
    }

    const imageDot = document.getElementById(`${imageId}-dot`);

    const wordItem = wordItems.find((item) => item.word === word);

    if (!imageDot || !wordItem) {
      return;
    }

    const wordDot = document.getElementById(wordItem.id);

    if (!wordDot) {
      return;
    }

    const start = getDotPosition(imageDot);

    const end = getDotPosition(wordDot);

    if (!start || !end) {
      return;
    }

    const previousWordConnection = lines.find((line) => line.word === word);

    const newLine = {
      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,

      image: imageId,
      word,
    };

    /*
      كل image إلها خط واحد.
      كل word إلها خط واحد.
      الجديد يستبدل القديم.
    */

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.image !== imageId && line.word !== word,
      );

      return [...filtered, newLine];
    });

    /*
      شيل X فقط عن التوصيلات اللي تغيرت.
    */

    setWrongImages((prev) =>
      prev.filter(
        (wrongImageId) =>
          wrongImageId !== imageId &&
          wrongImageId !== previousWordConnection?.image,
      ),
    );

    setSelectedImage(imageId);

    setSelectedWord(word);

    setFirstDot(null);

    setPreviewLine(null);

    setAnnouncement(`${imageId} connected to ${word}.`);

    setTimeout(() => {
      setSelectedImage(null);
      setSelectedWord(null);
    }, 300);
  };

  /* =====================================================
     START KEYBOARD MATCH — IMAGE
  ===================================================== */

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
      إذا الصورة موصولة من قبل
      شيل خطها القديم عشان تتعدل.
    */

    setLines((prev) => prev.filter((line) => line.image !== imageId));

    setWrongImages((prev) => prev.filter((id) => id !== imageId));

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
      `${imageId} selected. Use Tab or Shift plus Tab to choose a sentence, then press Enter or Space.`,
    );

    requestAnimationFrame(() => {
      const available = getAvailableWordIndexes();

      if (!available.length) {
        return;
      }

      const firstIndex = available[0];

      const firstWord = wordRefs.current[firstIndex];

      if (firstWord) {
        firstWord.focus();

        updatePreviewLine(startPoint, wordItems[firstIndex].word);
      }
    });
  };

  /* =====================================================
     KEYBOARD WORD SIDE
  ===================================================== */

  const handleWordKeyboard = (e, index, item) => {
    if (!firstDot || firstDot.side !== "image") {
      return;
    }

    if (showAnswer || checkCompleted || isWordLocked(item.word)) {
      return;
    }

    /* =========================
       TAB BETWEEN WORDS
    ========================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableWordIndexes();

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

      const nextElement = wordRefs.current[nextIndex];

      if (nextElement) {
        nextElement.focus();

        updatePreviewLine(firstDot, wordItems[nextIndex].word);
      }

      return;
    }

    /* =========================
       ENTER / SPACE
    ========================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      /*
        الصوت الموجود أصلًا فقط.
      */

      playSentenceSound(item.sound, item.id);

      commitConnection(firstDot.image, item.word);

      return;
    }

    /* =========================
       ESCAPE
    ========================= */

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

  /* =====================================================
     MOUSE — IMAGE CLICK

     يدعم:
     1) الصورة أول
     2) الصورة ثاني بعد اختيار جملة
  ===================================================== */

  const handleImageMouseClick = (item) => {
    if (showAnswer || checkCompleted || isImageLocked(item.id)) {
      return;
    }

    /* =================================
       إذا الجملة مختارة أولًا
       الصورة تصير الطرف الثاني.
    ================================= */

    if (firstDot?.side === "word") {
      commitConnection(item.id, firstDot.word);

      return;
    }

    /* =================================
       الصورة تصير الطرف الأول.
    ================================= */

    const dot = document.getElementById(`${item.id}-dot`);

    if (!dot) {
      return;
    }

    const start = getDotPosition(dot);

    if (!start) {
      return;
    }

    /*
      إذا إلها خط سابق
      نشيله حتى نقدر نغير التوصيل.
    */

    setLines((prev) => prev.filter((line) => line.image !== item.id));

    setWrongImages((prev) => prev.filter((id) => id !== item.id));

    setSelectedImage(item.id);

    setSelectedWord(null);

    setFirstDot({
      side: "image",

      image: item.id,

      x: start.x,
      y: start.y,
    });

    /*
      الماوس ما بدنا له preview line.
    */

    setPreviewLine(null);
  };

  /* =====================================================
     MOUSE — WORD CLICK

     يدعم:
     1) الجملة أول
     2) الجملة ثاني بعد اختيار صورة
  ===================================================== */

  const handleWordMouseClick = (item) => {
    /*
      الصوت يظل مثل الموجود أصلًا.
    */

    playSentenceSound(item.sound, item.id);

    if (showAnswer || checkCompleted || isWordLocked(item.word)) {
      return;
    }

    /* =================================
       إذا الصورة مختارة أولًا:
       الجملة تصير الطرف الثاني.
    ================================= */

    if (firstDot?.side === "image") {
      commitConnection(firstDot.image, item.word);

      return;
    }

    /* =================================
       الجملة تصير الطرف الأول.
    ================================= */

    const dot = document.getElementById(item.id);

    if (!dot) {
      return;
    }

    const start = getDotPosition(dot);

    if (!start) {
      return;
    }

    /*
      إذا الجملة موصولة سابقًا
      شيل خطها القديم حتى تقدر تتغير.
    */

    setLines((prev) => prev.filter((line) => line.word !== item.word));

    /*
      إذا الجملة كانت موصولة بصورة غلط،
      شيل X عنها لأنها فقدت التوصيل.
    */

    const previousConnection = lines.find((line) => line.word === item.word);

    if (previousConnection) {
      setWrongImages((prev) =>
        prev.filter((imageId) => imageId !== previousConnection.image),
      );
    }

    setSelectedWord(item.word);

    setSelectedImage(null);

    setFirstDot({
      side: "word",

      word: item.word,

      x: start.x,
      y: start.y,
    });

    /*
      لا preview line للماوس.
    */

    setPreviewLine(null);
  };

  /* =====================================================
     START DOT — IMAGE
     بنخليه موجود لو في CSS/logic بيعتمد عليه
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const image = e.currentTarget.dataset.image || null;

    if (!image) {
      return;
    }

    const item = images.find((img) => img.id === image);

    if (!item) {
      return;
    }

    handleImageMouseClick(item);
  };

  /* =====================================================
     END DOT — WORD
  ===================================================== */

  const handleEndDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const word = e.currentTarget.dataset.word || null;

    if (!word) {
      return;
    }

    const item = wordItems.find((wordItem) => wordItem.word === word);

    if (!item) {
      return;
    }

    handleWordMouseClick(item);
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

    const wrong = [];

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

    setFirstDot(null);

    setPreviewLine(null);

    setSelectedImage(null);

    setSelectedWord(null);

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    if (!containerRef.current) {
      return;
    }

    const finalLines = correctMatches.map((line) => {
      const imageDot = document.getElementById(`${line.image}-dot`);

      const wordItem = wordItems.find((item) => item.word === line.word);

      const wordDot = wordItem ? document.getElementById(wordItem.id) : null;

      const start = getDotPosition(imageDot) || {
        x: 0,
        y: 0,
      };

      const end = getDotPosition(wordDot) || {
        x: 0,
        y: 0,
      };

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

    setPreviewLine(null);

    setShowAnswer(true);

    setCheckCompleted(true);

    setLockedImages(correctMatches.map((item) => item.image));

    setLockedWords(correctMatches.map((item) => item.word));

    setAnnouncement("Correct answers shown.");
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setLines([]);

    setPreviewLine(null);

    setWrongImages([]);

    setFirstDot(null);

    setShowAnswer(false);

    setLockedImages([]);

    setLockedWords([]);

    setCheckCompleted(false);

    setSelectedImage(null);

    setSelectedWord(null);

    setAnnouncement("Activity reset.");

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
      {/* SCREEN READER STATUS */}

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

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
                    ref={(el) => {
                      imageRefs.current[item.id] = el;
                    }}
                    src={item.src}
                    alt={item.alt}
                    className={`clickable-img-unit2-p7-q2 ${
                      selectedImage === item.id ? "selected-item" : ""
                    } ${showAnswer || isLocked ? "disabled-hover" : ""}`}
                    role="button"
                    tabIndex={
                      showAnswer || checkCompleted || isLocked || firstDot
                        ? -1
                        : 0
                    }
                    aria-disabled={showAnswer || checkCompleted || isLocked}
                    aria-label={
                      isLocked
                        ? `${item.alt}. Correct match.`
                        : `${item.alt}. Press Enter or Space to select.`
                    }
                    onClick={() => {
                      handleImageMouseClick(item);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        if (showAnswer || checkCompleted || isLocked) {
                          return;
                        }

                        startKeyboardMatch(item.id, `${item.id}-dot`);
                      }
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
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              SENTENCES
          ================================================= */}

          <div className="match-words-row2">
            {wordItems.map((item, index) => {
              const isLocked = lockedWords.includes(item.word);

              return (
                <div key={item.id} className="word-box2-unit2-p7-q2">
                  {/* END DOT */}

                  <div
                    className="dot22-unit2-q7 end-dot22-unit2-q7"
                    id={item.id}
                    data-word={item.word}
                    onClick={handleEndDotClick}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {/* SENTENCE */}

                  <h5
                    ref={(el) => {
                      wordRefs.current[index] = el;
                    }}
                    className={`clickable-word-unit2-p7-q2 ${
                      selectedWord === item.word ? "selected-item" : ""
                    } ${showAnswer || isLocked ? "disabled-hover" : ""}`}
                    role="button"
                    tabIndex={
                      showAnswer ||
                      checkCompleted ||
                      isLocked ||
                      !firstDot ||
                      firstDot.side !== "image"
                        ? -1
                        : 0
                    }
                    aria-disabled={showAnswer || checkCompleted || isLocked}
                    aria-label={
                      isLocked
                        ? `${item.word}. Correct match.`
                        : firstDot?.side === "image"
                          ? `${item.word}. Press Enter or Space to connect.`
                          : `${item.word}.`
                    }
                    onFocus={() => {
                      if (!firstDot || firstDot.side !== "image" || isLocked) {
                        return;
                      }

                      updatePreviewLine(firstDot, item.word);
                    }}
                    onKeyDown={(e) => handleWordKeyboard(e, index, item)}
                    onClick={() => {
                      handleWordMouseClick(item);
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
                        aria-hidden="true"
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
