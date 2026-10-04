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
import dishSound from "../../../assets/unit2/Page 17 - D/Dish.mp3";
import tableSound from "../../../assets/unit2/Page 17 - D/Table.mp3";

import { FaVolumeUp } from "react-icons/fa";

const Unit2_Page8_Q1 = () => {
  /* =====================================================
     STATES
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [previewLine, setPreviewLine] = useState(null);

  const containerRef = useRef(null);

  /*
    firstDot:

    WORD FIRST:
    {
      side: "word",
      word,
      x,
      y
    }

    IMAGE FIRST:
    {
      side: "image",
      image,
      x,
      y
    }
  */

  const [firstDot, setFirstDot] = useState(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [selectedWord, setSelectedWord] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  /* =====================================================
     PROGRESSIVE LOCK
  ===================================================== */

  const [lockedWords, setLockedWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     KEYBOARD REFS
  ===================================================== */

  const wordRefs = useRef({});

  const imageRefs = useRef([]);

  /* =====================================================
     AUDIO
  ===================================================== */

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

    audioRef.current.play().catch(() => {
      setActiveWordAudio(null);
    });

    audioRef.current.onended = () => {
      setActiveWordAudio(null);
    };
  };

  /* =====================================================
     DATA
  ===================================================== */

  const correctMatches = [
    {
      word: "duck",
      image: "img3",
    },

    {
      word: "tiger",
      image: "img4",
    },

    {
      word: "dish",
      image: "img2",
    },

    {
      word: "table",
      image: "img1",
    },
  ];

  const wordItems = [
    {
      word: "duck",
      num: 1,
      dotId: "dot-duck",
    },

    {
      word: "tiger",
      num: 2,
      dotId: "dot-tiger",
    },

    {
      word: "dish",
      num: 3,
      dotId: "dot-dish",
    },

    {
      word: "table",
      num: 4,
      dotId: "dot-table",
    },
  ];

  /*
    ترتيب الصور الظاهر بالصفحة.
  */

  const imageItems = [
    {
      id: "img1",
      src: table,
      alt: "Table",
      width: "110px",
      height: "100px",
    },

    {
      id: "img2",
      src: dish,
      alt: "Dish",
      width: "110px",
      height: "110px",
    },

    {
      id: "img3",
      src: duck,
      alt: "Duck",
      width: "110px",
      height: "100px",
    },

    {
      id: "img4",
      src: tiger,
      alt: "Tiger",
      width: "110px",
      height: "100px",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (image) => lockedImages.includes(image);

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
     GET AVAILABLE IMAGES
     FOR KEYBOARD
  ===================================================== */

  const getAvailableImageIndexes = () =>
    imageItems
      .map((item, index) => ({
        item,
        index,
      }))
      .filter(({ item }) => !isImageLocked(item.id))
      .map(({ index }) => index);

  /* =====================================================
     PREVIEW LINE
     KEYBOARD ONLY
  ===================================================== */

  const updatePreviewLine = (startPoint, imageId) => {
    if (!startPoint) return;

    const imageDot = document.getElementById(`dot-${imageId}`);

    if (!imageDot) return;

    const end = getDotPosition(imageDot);

    if (!end) return;

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,

      x2: end.x,
      y2: end.y,
    });
  };

  /* =====================================================
     COMMIT CONNECTION
     MOUSE + KEYBOARD
  ===================================================== */

  const commitConnection = (word, image) => {
    if (
      !word ||
      !image ||
      showAnswer ||
      checkCompleted ||
      isWordLocked(word) ||
      isImageLocked(image)
    ) {
      return;
    }

    const wordItem = wordItems.find((item) => item.word === word);

    if (!wordItem) {
      return;
    }

    const startDot = document.getElementById(wordItem.dotId);

    const endDot = document.getElementById(`dot-${image}`);

    if (!startDot || !endDot) {
      return;
    }

    const start = getDotPosition(startDot);

    const end = getDotPosition(endDot);

    if (!start || !end) {
      return;
    }

    /*
      إذا الصورة كانت مستخدمة من قبل
      اعرف الكلمة القديمة عشان نشيل X عنها.
    */

    const previousImageConnection = lines.find((line) => line.image === image);

    const newLine = {
      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,

      word,
      image,
    };

    /*
      كل word إلها خط واحد.
      كل image إلها خط واحد.

      الجديد يستبدل القديم.
    */

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== word && line.image !== image,
      );

      return [...filtered, newLine];
    });

    /*
      شيل X فقط عن التوصيلات
      اللي تغيرت.
    */

    setWrongWords((prev) =>
      prev.filter(
        (wrongWord) =>
          wrongWord !== word && wrongWord !== previousImageConnection?.word,
      ),
    );

    setSelectedWord(word);

    setSelectedImage(image);

    setFirstDot(null);

    setPreviewLine(null);

    setTimeout(() => {
      setSelectedWord(null);

      setSelectedImage(null);
    }, 300);
  };

  /* =====================================================
     KEYBOARD START
     WORD -> IMAGE
  ===================================================== */

  const startKeyboardMatch = (word, dotId) => {
    if (showAnswer || checkCompleted || isWordLocked(word)) {
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
      إذا الكلمة إلها توصيل سابق،
      شيله عشان تقدر تعدله.
    */

    setLines((prev) => prev.filter((line) => line.word !== word));

    /*
      شيل X عن نفس الكلمة.
    */

    setWrongWords((prev) => prev.filter((item) => item !== word));

    setSelectedWord(word);

    setSelectedImage(null);

    const startPoint = {
      side: "word",

      word,

      x: start.x,
      y: start.y,
    };

    setFirstDot(startPoint);

    /*
      روح لأول صورة غير مقفلة.
    */

    requestAnimationFrame(() => {
      const available = getAvailableImageIndexes();

      if (!available.length) {
        return;
      }

      const firstIndex = available[0];

      const firstImage = imageRefs.current[firstIndex];

      if (firstImage) {
        firstImage.focus();

        updatePreviewLine(startPoint, imageItems[firstIndex].id);
      }
    });
  };

  /* =====================================================
     KEYBOARD IMAGE SIDE
  ===================================================== */

  const handleImageKeyboard = (e, index, item) => {
    if (!firstDot || firstDot.side !== "word") {
      return;
    }

    if (showAnswer || checkCompleted || isImageLocked(item.id)) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB
       ONLY BETWEEN AVAILABLE IMAGES
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableImageIndexes();

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

      const nextElement = imageRefs.current[nextIndex];

      if (nextElement) {
        nextElement.focus();

        updatePreviewLine(firstDot, imageItems[nextIndex].id);
      }

      return;
    }

    /* =================================================
       ENTER / SPACE = CONNECT
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      const currentWord = firstDot.word;

      commitConnection(currentWord, item.id);

      /*
        بعد التوصيل رجع لأول كلمة
        غير مقفلة.
      */

      setTimeout(() => {
        const nextWord =
          wordItems.find(
            (wordItem) =>
              !isWordLocked(wordItem.word) && wordItem.word !== currentWord,
          ) || wordItems.find((wordItem) => !isWordLocked(wordItem.word));

        if (nextWord) {
          wordRefs.current[nextWord.word]?.focus();
        }
      }, 100);

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const currentWord = firstDot.word;

      setFirstDot(null);

      setPreviewLine(null);

      setSelectedWord(null);

      setSelectedImage(null);

      requestAnimationFrame(() => {
        if (!isWordLocked(currentWord)) {
          wordRefs.current[currentWord]?.focus();
        }
      });
    }
  };

  /* =====================================================
     MOUSE WORD

     WORD FIRST
     OR
     WORD SECOND AFTER IMAGE
  ===================================================== */

  const handleWordMouseClick = (word) => {
    /*
      الصوت الموجود أصلًا يشتغل.
    */

    playWordSound(word);

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    /* =================================================
       IMAGE WAS SELECTED FIRST
       WORD = SECOND SIDE
    ================================================= */

    if (firstDot?.side === "image") {
      commitConnection(word, firstDot.image);

      return;
    }

    /* =================================================
       WORD = FIRST SIDE
    ================================================= */

    const wordItem = wordItems.find((item) => item.word === word);

    if (!wordItem) {
      return;
    }

    const dot = document.getElementById(wordItem.dotId);

    if (!dot) {
      return;
    }

    const start = getDotPosition(dot);

    if (!start) {
      return;
    }

    /*
      إذا الكلمة موصولة من قبل،
      شيل خطها القديم.
    */

    setLines((prev) => prev.filter((line) => line.word !== word));

    /*
      شيل X عن نفس الكلمة.
    */

    setWrongWords((prev) => prev.filter((item) => item !== word));

    setSelectedWord(word);

    setSelectedImage(null);

    setFirstDot({
      side: "word",

      word,

      x: start.x,
      y: start.y,
    });

    /*
      Mouse:
      no preview line.
    */

    setPreviewLine(null);
  };

  /* =====================================================
     MOUSE IMAGE

     IMAGE FIRST
     OR
     IMAGE SECOND AFTER WORD
  ===================================================== */

  const handleImageMouseClick = (item) => {
    if (showAnswer || checkCompleted || isImageLocked(item.id)) {
      return;
    }

    /* =================================================
       WORD SELECTED FIRST
       IMAGE = SECOND SIDE
    ================================================= */

    if (firstDot?.side === "word") {
      commitConnection(firstDot.word, item.id);

      return;
    }

    /* =================================================
       IMAGE = FIRST SIDE
    ================================================= */

    const dot = document.getElementById(`dot-${item.id}`);

    if (!dot) {
      return;
    }

    const start = getDotPosition(dot);

    if (!start) {
      return;
    }

    /*
      إذا الصورة عليها خط سابق،
      نعرف الكلمة القديمة.
    */

    const previousConnection = lines.find((line) => line.image === item.id);

    /*
      شيل الخط القديم للصورة.
    */

    setLines((prev) => prev.filter((line) => line.image !== item.id));

    /*
      إذا كانت الصورة متصلة بكلمة غلط،
      شيل X عن الكلمة القديمة لأنها
      فقدت التوصيل.
    */

    if (previousConnection) {
      setWrongWords((prev) =>
        prev.filter((word) => word !== previousConnection.word),
      );
    }

    setSelectedImage(item.id);

    setSelectedWord(null);

    setFirstDot({
      side: "image",

      image: item.id,

      x: start.x,
      y: start.y,
    });

    setPreviewLine(null);
  };

  /* =====================================================
     DOT WORD
  ===================================================== */

  const handleStartDotClick = (e) => {
    const word = e.currentTarget.dataset.word || null;

    if (!word) {
      return;
    }

    handleWordMouseClick(word);
  };

  /* =====================================================
     DOT IMAGE
  ===================================================== */

  const handleEndDotClick = (e) => {
    const image = e.currentTarget.dataset.image || null;

    if (!image) {
      return;
    }

    const item = imageItems.find((imageItem) => imageItem.id === image);

    if (!item) {
      return;
    }

    handleImageMouseClick(item);
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

    /* =================================================
       LOCK CORRECT ONLY
    ================================================= */

    setLockedWords((prev) =>
      Array.from(new Set([...prev, ...newlyLockedWords])),
    );

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newlyLockedImages])),
    );

    /*
      X only wrong connections.
    */

    setWrongWords(wrong);

    setFirstDot(null);

    setPreviewLine(null);

    setSelectedWord(null);

    setSelectedImage(null);

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
      setWrongWords([]);

      setLockedWords(correctMatches.map((item) => item.word));

      setLockedImages(correctMatches.map((item) => item.image));

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =================================================
       WRONG / PARTIAL
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
    if (!containerRef.current) {
      return;
    }

    const finalLines = correctMatches.map((line) => {
      const wordItem = wordItems.find((item) => item.word === line.word);

      const startElement = wordItem
        ? document.getElementById(wordItem.dotId)
        : null;

      const endElement = document.getElementById(`dot-${line.image}`);

      const start = getDotPosition(startElement) || {
        x: 0,
        y: 0,
      };

      const end = getDotPosition(endElement) || {
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

    setWrongWords([]);

    setSelectedWord(null);

    setSelectedImage(null);

    setFirstDot(null);

    setPreviewLine(null);

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

    setPreviewLine(null);

    setWrongWords([]);

    setFirstDot(null);

    setShowAnswer(false);

    setSelectedWord(null);

    setSelectedImage(null);

    setLockedWords([]);

    setLockedImages([]);

    setCheckCompleted(false);

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    setActiveWordAudio(null);
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
      <audio
        ref={audioRef}
        style={{
          display: "none",
        }}
      />

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
          {wordItems.map((wordItem, index) => {
            const imageItem = imageItems[index];

            const wordLocked = isWordLocked(wordItem.word);

            const imageLocked = isImageLocked(imageItem.id);

            return (
              <div className="matching-row2" key={wordItem.word}>
                {/* =================================
                      WORD
                  ================================= */}

                <div className="word-with-dot2">
                  <span className="span-num2">{wordItem.num}</span>

                  <span
                    ref={(element) => {
                      wordRefs.current[wordItem.word] = element;
                    }}
                    className={`word-text2 ${
                      selectedWord === wordItem.word ? "selected-item" : ""
                    } ${wordLocked || showAnswer ? "disabled-hover" : ""}`}
                    role="button"
                    tabIndex={
                      wordLocked || showAnswer || checkCompleted || firstDot
                        ? -1
                        : 0
                    }
                    aria-label={
                      wordLocked
                        ? `${wordItem.word}. Correct match.`
                        : `${wordItem.word}. Press Enter or Space to select.`
                    }
                    onClick={() => {
                      handleWordMouseClick(wordItem.word);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        /*
                            Audio موجود أصلًا على الكلمة.
                          */

                        playWordSound(wordItem.word);

                        if (wordLocked || showAnswer || checkCompleted) {
                          return;
                        }

                        startKeyboardMatch(wordItem.word, wordItem.dotId);
                      }
                    }}
                    style={{
                      cursor: "pointer",

                      position: "relative",

                      display: "inline-flex",

                      alignItems: "center",

                      gap: "6px",
                    }}
                  >
                    {wordItem.word}

                    {activeWordAudio === wordItem.word && (
                      <FaVolumeUp
                        size={18}
                        aria-hidden="true"
                        style={{
                          pointerEvents: "none",

                          flexShrink: 0,
                        }}
                      />
                    )}
                  </span>

                  {/* WRONG */}

                  {wrongWords.includes(wordItem.word) && (
                    <span
                      className="error-mark8-u2-p19-q1"
                      style={
                        wordItem.word === "duck"
                          ? {
                              left: 0,
                            }
                          : undefined
                      }
                    >
                      ✕
                    </span>
                  )}

                  {/* WORD DOT */}

                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      id={wordItem.dotId}
                      data-word={wordItem.word}
                      onClick={handleStartDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* =================================
                      IMAGE
                  ================================= */}

                <div className="img-with-dot2">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      id={`dot-${imageItem.id}`}
                      data-image={imageItem.id}
                      onClick={handleEndDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    style={{
                      width: "150px",
                    }}
                  >
                    <img
                      ref={(element) => {
                        imageRefs.current[index] = element;
                      }}
                      src={imageItem.src}
                      alt={imageItem.alt}
                      className={`matched-img2 ${
                        selectedImage === imageItem.id ? "selected-item" : ""
                      } ${imageLocked || showAnswer ? "disabled-hover" : ""}`}
                      role="button"
                      tabIndex={
                        firstDot?.side === "word" &&
                        !imageLocked &&
                        !showAnswer &&
                        !checkCompleted
                          ? 0
                          : -1
                      }
                      aria-label={
                        imageLocked
                          ? `${imageItem.alt}. Correct match.`
                          : firstDot?.side === "word"
                            ? `${imageItem.alt}. Press Enter or Space to connect with ${firstDot.word}.`
                            : imageItem.alt
                      }
                      onFocus={() => {
                        if (
                          !firstDot ||
                          firstDot.side !== "word" ||
                          imageLocked
                        ) {
                          return;
                        }

                        updatePreviewLine(firstDot, imageItem.id);
                      }}
                      onKeyDown={(e) =>
                        handleImageKeyboard(e, index, imageItem)
                      }
                      onClick={() => {
                        handleImageMouseClick(imageItem);
                      }}
                      style={{
                        cursor:
                          imageLocked || showAnswer ? "default" : "pointer",

                        width: imageItem.width,

                        height: imageItem.height,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* =================================================
              LINES
          ================================================= */}

          <svg className="lines-layer2" aria-hidden="true">
            {/* FIXED LINES */}

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
