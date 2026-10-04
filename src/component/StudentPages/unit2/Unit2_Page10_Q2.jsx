import React, { useRef, useState } from "react";

import boy from "../../../assets/img_unit2/imgs/boy 01.png";
import fotball from "../../../assets/img_unit2/imgs/Football.jpg";
import bird from "../../../assets/img_unit2/imgs/bird.jpg";
import pizza2 from "../../../assets/img_unit2/imgs/Pizza (2).jpg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page10_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* ======================================================
   WORD AUDIOS
====================================================== */

import ballAudio from "../../../assets/unit2/Page 19 - E/ball.mp3";
import pizzaAudio from "../../../assets/unit2/Page 19 - E/pizza.mp3";
import birdAudio from "../../../assets/unit2/Page 19 - E/bird.mp3";
import boyAudio from "../../../assets/unit2/Page 19 - E/boy.mp3";

/* ======================================================
   DATA
====================================================== */

const imageItems = [
  {
    id: "img1",
    img: bird,
    alt: "A bird",
    number: 1,
  },
  {
    id: "img2",
    img: boy,
    alt: "A boy",
    number: 2,
  },
  {
    id: "img3",
    img: pizza2,
    alt: "A pizza",
    number: 3,
  },
  {
    id: "img4",
    img: fotball,
    alt: "A ball",
    number: 4,
  },
];

const wordItems = [
  {
    word: "ball",
    label: "Ball",
    audio: ballAudio,
  },
  {
    word: "pizza",
    label: "pizza",
    audio: pizzaAudio,
  },
  {
    word: "bird",
    label: "bird",
    audio: birdAudio,
  },
  {
    word: "boy",
    label: "boy",
    audio: boyAudio,
  },
];

const correctMatches = [
  {
    word: "bird",
    image: "img1",
  },
  {
    word: "boy",
    image: "img2",
  },
  {
    word: "pizza",
    image: "img3",
  },
  {
    word: "ball",
    image: "img4",
  },
];

const Unit2_Page10_Q2 = () => {
  const [lines, setLines] = useState([]);

  const [previewLine, setPreviewLine] = useState(null);

  const containerRef = useRef(null);

  /* ======================================================
     SELECTION
  ====================================================== */

  const [firstDot, setFirstDot] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  /* ======================================================
     CHECK
  ====================================================== */

  const [wrongWords, setWrongWords] = useState([]);

  const [wrongImages, setWrongImages] = useState([]);

  const [lockedWords, setLockedWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* ======================================================
     KEYBOARD
  ====================================================== */

  const imageRefs = useRef({});
  const wordRefs = useRef([]);

  const [announcement, setAnnouncement] = useState("");

  /* ======================================================
     WORD AUDIO
  ====================================================== */

  const audioRef = useRef(null);

  const [activeAudioWord, setActiveAudioWord] = useState(null);

  const stopWordAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setActiveAudioWord(null);
  };

  const playWordAudio = (item) => {
    if (!item?.audio) return;

    stopWordAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setActiveAudioWord(item.word);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setActiveAudioWord(null);
    });

    audio.onended = () => {
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setActiveAudioWord(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setActiveAudioWord(null);
    };
  };

  /* ======================================================
     HELPERS
  ====================================================== */

  const isImageLocked = (image) => lockedImages.includes(image);

  const isWordLocked = (word) => lockedWords.includes(word);

  const isCorrectMatch = (word, image) => {
    return correctMatches.some(
      (pair) => pair.word === word && pair.image === image,
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

  const clearSelection = () => {
    setFirstDot(null);
    setPreviewLine(null);

    setSelectedImage(null);
    setSelectedWord(null);
  };

  /* ======================================================
     REMOVE OLD WRONG CONNECTIONS
  ====================================================== */

  const removeEditableConnection = ({ image, word }) => {
    setLines((prev) =>
      prev.filter((line) => {
        const lineLocked = isImageLocked(line.image) || isWordLocked(line.word);

        if (lineLocked) {
          return true;
        }

        if (image && line.image === image) {
          return false;
        }

        if (word && line.word === word) {
          return false;
        }

        return true;
      }),
    );
  };

  /* ======================================================
     AVAILABLE WORDS FOR KEYBOARD
  ====================================================== */

  const getAvailableWordIndexes = () =>
    wordItems
      .map((item, index) => ({
        item,
        index,
      }))
      .filter(({ item }) => !isWordLocked(item.word))
      .map(({ index }) => index);

  /* ======================================================
     PREVIEW LINE
  ====================================================== */

  const updatePreviewLine = (startPoint, word) => {
    if (!startPoint) return;

    const endDot = document.getElementById(`dot-${word}`);

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
  ====================================================== */

  const commitConnection = (image, word) => {
    if (
      !image ||
      !word ||
      showAnswer ||
      checkCompleted ||
      isImageLocked(image) ||
      isWordLocked(word)
    ) {
      return;
    }

    const imageDot = document.getElementById(`dot-${image}`);

    const wordDot = document.getElementById(`dot-${word}`);

    if (!imageDot || !wordDot) return;

    const start = getDotPosition(imageDot);

    const end = getDotPosition(wordDot);

    if (!start || !end) return;

    const previousImageLine = lines.find((line) => line.image === image);

    const previousWordLine = lines.find((line) => line.word === word);

    if (
      previousImageLine &&
      (isImageLocked(previousImageLine.image) ||
        isWordLocked(previousImageLine.word))
    ) {
      clearSelection();
      return;
    }

    if (
      previousWordLine &&
      (isImageLocked(previousWordLine.image) ||
        isWordLocked(previousWordLine.word))
    ) {
      clearSelection();
      return;
    }

    const newLine = {
      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,

      word,
      image,
    };

    /* كل image وكل word إلهم خط واحد فقط */

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== word && line.image !== image,
      );

      return [...filtered, newLine];
    });

    /* X ينشال فقط عن العناصر المتغيرة */

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== previousImageLine?.word),
    );

    setWrongImages((prev) =>
      prev.filter((item) => item !== image && item !== previousWordLine?.image),
    );

    setSelectedImage(image);
    setSelectedWord(word);

    setFirstDot(null);
    setPreviewLine(null);

    setAnnouncement(`${image} connected to ${word}.`);

    window.setTimeout(() => {
      setSelectedImage(null);
      setSelectedWord(null);
    }, 300);
  };

  /* ======================================================
     KEYBOARD START FROM IMAGE
  ====================================================== */

  const startKeyboardMatch = (image, dotId) => {
    if (showAnswer || checkCompleted || isImageLocked(image)) {
      return;
    }

    const dot = document.getElementById(dotId);

    if (!dot) return;

    const position = getDotPosition(dot);

    if (!position) return;

    const previousLine = lines.find(
      (line) => line.image === image && !isImageLocked(line.image),
    );

    removeEditableConnection({
      image,
    });

    setWrongImages((prev) => prev.filter((item) => item !== image));

    if (previousLine) {
      setWrongWords((prev) =>
        prev.filter((item) => item !== previousLine.word),
      );
    }

    const startPoint = {
      type: "image",
      image,

      x: position.x,
      y: position.y,
    };

    setFirstDot(startPoint);

    setSelectedImage(image);
    setSelectedWord(null);

    setAnnouncement(
      `${image} selected. Use Tab or Shift plus Tab to choose a word, then press Enter or Space.`,
    );

    requestAnimationFrame(() => {
      const available = getAvailableWordIndexes();

      if (!available.length) return;

      const firstIndex = available[0];

      wordRefs.current[firstIndex]?.focus();

      updatePreviewLine(startPoint, wordItems[firstIndex].word);
    });
  };

  /* ======================================================
     KEYBOARD WORD SIDE
  ====================================================== */

  const handleWordKeyboard = (e, index, item) => {
    if (!firstDot || firstDot.type !== "image") {
      return;
    }

    if (showAnswer || checkCompleted || isWordLocked(item.word)) {
      return;
    }

    /* TAB / SHIFT TAB */

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

    /* ENTER / SPACE */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      playWordAudio(item);

      const currentImage = firstDot.image;

      commitConnection(currentImage, item.word);

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

    /* ESCAPE */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const currentImage = firstDot.image;

      clearSelection();

      setAnnouncement(`${currentImage} selection cancelled.`);

      requestAnimationFrame(() => {
        if (!isImageLocked(currentImage)) {
          imageRefs.current[currentImage]?.focus();
        }
      });
    }
  };

  /* ======================================================
     MOUSE IMAGE DOT
  ====================================================== */

  const handleImageDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const image = e.currentTarget.dataset.image;

    if (!image || isImageLocked(image)) {
      return;
    }

    const position = getDotPosition(e.currentTarget);

    if (!position) return;

    /* no first dot */

    if (!firstDot) {
      removeEditableConnection({
        image,
      });

      setWrongImages((prev) => prev.filter((item) => item !== image));

      const previousLine = lines.find(
        (line) => line.image === image && !isImageLocked(line.image),
      );

      if (previousLine) {
        setWrongWords((prev) =>
          prev.filter((item) => item !== previousLine.word),
        );
      }

      setFirstDot({
        type: "image",
        image,

        x: position.x,
        y: position.y,
      });

      setSelectedImage(image);
      setSelectedWord(null);

      setPreviewLine(null);

      return;
    }

    /* image selected then another image */

    if (firstDot.type === "image") {
      removeEditableConnection({
        image,
      });

      setFirstDot({
        type: "image",
        image,

        x: position.x,
        y: position.y,
      });

      setSelectedImage(image);
      setSelectedWord(null);

      setPreviewLine(null);

      return;
    }

    /* word -> image */

    commitConnection(image, firstDot.word);
  };

  /* ======================================================
     MOUSE WORD DOT
  ====================================================== */

  const handleWordDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const word = e.currentTarget.dataset.word;

    if (!word || isWordLocked(word)) {
      return;
    }

    const position = getDotPosition(e.currentTarget);

    if (!position) return;

    /* no first dot */

    if (!firstDot) {
      removeEditableConnection({
        word,
      });

      setWrongWords((prev) => prev.filter((item) => item !== word));

      const previousLine = lines.find(
        (line) => line.word === word && !isWordLocked(line.word),
      );

      if (previousLine) {
        setWrongImages((prev) =>
          prev.filter((item) => item !== previousLine.image),
        );
      }

      setFirstDot({
        type: "word",
        word,

        x: position.x,
        y: position.y,
      });

      setSelectedWord(word);
      setSelectedImage(null);

      setPreviewLine(null);

      return;
    }

    /* word selected then another word */

    if (firstDot.type === "word") {
      removeEditableConnection({
        word,
      });

      setFirstDot({
        type: "word",
        word,

        x: position.x,
        y: position.y,
      });

      setSelectedWord(word);
      setSelectedImage(null);

      setPreviewLine(null);

      return;
    }

    /* image -> word */

    commitConnection(firstDot.image, word);
  };

  /* ======================================================
     IMAGE CLICK
  ====================================================== */

  const handleImageClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    document.getElementById(`dot-${imageId}`)?.click();
  };

  /* ======================================================
     WORD CLICK
  ====================================================== */

  const handleWordClick = (item) => {
    /* الصوت يشتغل دائمًا */

    playWordAudio(item);

    if (showAnswer || checkCompleted || isWordLocked(item.word)) {
      return;
    }

    document.getElementById(`dot-${item.word}`)?.click();
  };

  /* ======================================================
     CHECK
  ====================================================== */

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

    const wrongWordTemp = [];
    const wrongImageTemp = [];

    const correctWordTemp = [];
    const correctImageTemp = [];

    lines.forEach((line) => {
      const correct = isCorrectMatch(line.word, line.image);

      if (correct) {
        correctCount++;

        correctWordTemp.push(line.word);

        correctImageTemp.push(line.image);
      } else {
        wrongWordTemp.push(line.word);

        wrongImageTemp.push(line.image);
      }
    });

    setLockedWords((prev) =>
      Array.from(new Set([...prev, ...correctWordTemp])),
    );

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...correctImageTemp])),
    );

    setWrongWords(wrongWordTemp);

    setWrongImages(wrongImageTemp);

    clearSelection();

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

    if (correctCount === total) {
      setLockedWords(correctMatches.map((item) => item.word));

      setLockedImages(correctMatches.map((item) => item.image));

      setWrongWords([]);
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
    if (!containerRef.current) {
      return;
    }

    clearSelection();

    setWrongWords([]);
    setWrongImages([]);

    const finalLines = correctMatches.map((pair) => {
      const wordDot = document.querySelector(`[data-word="${pair.word}"]`);

      const imageDot = document.querySelector(`[data-image="${pair.image}"]`);

      const wordPosition = getDotPosition(wordDot);

      const imagePosition = getDotPosition(imageDot);

      return {
        x1: imagePosition?.x ?? 0,

        y1: imagePosition?.y ?? 0,

        x2: wordPosition?.x ?? 0,

        y2: wordPosition?.y ?? 0,

        word: pair.word,

        image: pair.image,
      };
    });

    setLines(finalLines);

    setLockedWords(correctMatches.map((item) => item.word));

    setLockedImages(correctMatches.map((item) => item.image));

    setShowAnswer(true);

    setCheckCompleted(true);

    setAnnouncement("Correct answers shown.");
  };

  /* ======================================================
     RESET
  ====================================================== */

  const reset = () => {
    stopWordAudio();

    setLines([]);

    setPreviewLine(null);

    setWrongWords([]);
    setWrongImages([]);

    setLockedWords([]);
    setLockedImages([]);

    setFirstDot(null);

    setShowAnswer(false);

    setCheckCompleted(false);

    setSelectedImage(null);
    setSelectedWord(null);

    setAnnouncement("Activity reset.");
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
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div
        className="div-forall"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title="Look, read, and match."
          subTitle="Read each word, then connect it to the correct picture."
        />

        <div className="container12-unit2-pg10-q2" ref={containerRef}>
          {imageItems.map((imageItem, index) => {
            const wordItem = wordItems[index];

            const imageLocked = isImageLocked(imageItem.id);

            const wordLocked = isWordLocked(wordItem.word);

            const wordIsPlaying = activeAudioWord === wordItem.word;

            return (
              <div className="matching-row2" key={imageItem.id}>
                {/* =================================================
                      IMAGE SIDE
                  ================================================= */}

                <div className="img-with-dot2">
                  <span className="span-num2">{imageItem.number}</span>

                  <img
                    ref={(el) => {
                      imageRefs.current[imageItem.id] = el;
                    }}
                    src={imageItem.img}
                    alt={imageItem.alt}
                    className={`matched-img2 ${
                      selectedImage === imageItem.id ? "selected-item" : ""
                    } ${imageLocked || showAnswer ? "disabled-hover" : ""}`}
                    role="button"
                    tabIndex={
                      imageLocked || showAnswer || checkCompleted || firstDot
                        ? -1
                        : 0
                    }
                    aria-label={
                      imageLocked
                        ? `${imageItem.alt}. Correct match.`
                        : `${imageItem.alt}. Press Enter or Space to select.`
                    }
                    onClick={() => handleImageClick(imageItem.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        if (imageLocked || showAnswer || checkCompleted) {
                          return;
                        }

                        startKeyboardMatch(imageItem.id, `dot-${imageItem.id}`);
                      }
                    }}
                    style={{
                      height: "auto",

                      width: "120px",

                      cursor:
                        imageLocked || showAnswer || checkCompleted
                          ? "default"
                          : "pointer",
                    }}
                  />

                

                  <div className="dot-wrapper2">
                    <div
                      className="dot2 start-dot2"
                      data-image={imageItem.id}
                      id={`dot-${imageItem.id}`}
                      onClick={handleImageDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* =================================================
                      WORD SIDE
                  ================================================= */}

                <div className="word-with-dot2">
                  <div className="dot-wrapper2">
                    <div
                      className="dot2 end-dot2"
                      data-word={wordItem.word}
                      id={`dot-${wordItem.word}`}
                      onClick={handleWordDotClick}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>

                  <span
                    ref={(el) => {
                      wordRefs.current[index] = el;
                    }}
                    className={`word-text2 ${
                      selectedWord === wordItem.word ? "selected-item" : ""
                    } ${wordLocked || showAnswer ? "disabled-hover" : ""}`}
                    role={firstDot?.type === "image" ? "button" : undefined}
                    tabIndex={
                      firstDot?.type === "image" &&
                      !wordLocked &&
                      !showAnswer &&
                      !checkCompleted
                        ? 0
                        : -1
                    }
                    aria-label={
                      wordLocked
                        ? `${wordItem.label}. Correct match.`
                        : firstDot?.type === "image"
                          ? `${wordItem.label}. Press Enter or Space to connect.`
                          : wordItem.label
                    }
                    onClick={() => handleWordClick(wordItem)}
                    onFocus={() => {
                      if (
                        !firstDot ||
                        firstDot.type !== "image" ||
                        wordLocked
                      ) {
                        return;
                      }

                      updatePreviewLine(firstDot, wordItem.word);
                    }}
                    onKeyDown={(e) => handleWordKeyboard(e, index, wordItem)}
                    style={{
                      cursor: "pointer",

                      position: "relative",

                      display: "inline-flex",

                      alignItems: "center",

                      gap: "8px",
                    }}
                  >
                    {wordItem.label}

                    {wordIsPlaying && (
                      <FaVolumeUp
                        aria-hidden="true"
                        size={18}
                        style={{
                          flexShrink: 0,

                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </span>

                  {wrongWords.includes(wordItem.word) && (
                    <span className="error-mark8-u2-p19-q2">✕</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* =================================================
              LINES
          ================================================= */}

          <svg className="lines-layer2" aria-hidden="true">
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
        <button onClick={reset} className="try-again-button">
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

export default Unit2_Page10_Q2;
