import React, { useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U2/U2P13EXEI-01.svg"; // February
import img2 from "../../../assets/U1 WB/U2/U2P13EXEI-02.svg"; // May
import img3 from "../../../assets/U1 WB/U2/U2P13EXEI-03.svg"; // October
import img4 from "../../../assets/U1 WB/U2/U2P13EXEI-04.svg"; // December

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

import "./WB_Unit2_Page5_Q1.css";

// ======================================================
// AUDIO
// عدلي فقط المسارات حسب ملفاتك
// ======================================================

import octoberAudio from "../../../assets/U1 WB/U2/page_13/Item_001_My_birthday_is_in_October.mp3";
import decemberAudio from "../../../assets/U1 WB/U2/page_13/Item_002_My_birthday_is_in_December.mp3";
import mayAudio from "../../../assets/U1 WB/U2/page_13/Item_003_My_birthday_is_in_May.mp3";
import februaryAudio from "../../../assets/U1 WB/U2/page_13/Item_004_My_birthday_is_in_February.mp3";


/* =====================================================
   LEFT SENTENCES
===================================================== */

const sentenceItems = [
  {
    word: "october",
    label: "My birthday is in October.",
    audio: octoberAudio,
    number: 1,
  },
  {
    word: "december",
    label: "My birthday is in December.",
    audio: decemberAudio,
    number: 2,
  },
  {
    word: "may",
    label: "My birthday is in May.",
    audio: mayAudio,
    number: 3,
  },
  {
    word: "february",
    label: "My birthday is in February.",
    audio: februaryAudio,
    number: 4,
  },
];

/* =====================================================
   RIGHT CALENDARS
===================================================== */

const imageItems = [
  {
    id: "img1",
    img: img1,
    alt: "February calendar",
  },
  {
    id: "img2",
    img: img2,
    alt: "May calendar",
  },
  {
    id: "img3",
    img: img3,
    alt: "October calendar",
  },
  {
    id: "img4",
    img: img4,
    alt: "December calendar",
  },
];

/* =====================================================
   CORRECT MATCHES
===================================================== */

const correctMatches = [
  {
    word: "october",
    image: "img3",
  },
  {
    word: "december",
    image: "img4",
  },
  {
    word: "may",
    image: "img2",
  },
  {
    word: "february",
    image: "img1",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit2_Page5_Q1 = () => {
  const containerRef = useRef(null);

  const [lines, setLines] = useState([]);

  /* =====================================================
     SELECTION
  ===================================================== */

  const [firstDot, setFirstDot] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  /* =====================================================
     CHECK STATES
  ===================================================== */

  const [wrongWords, setWrongWords] = useState([]);
  const [wrongImages, setWrongImages] = useState([]);

  const [lockedWords, setLockedWords] = useState([]);
  const [lockedImages, setLockedImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

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

  /* =====================================================
     HELPERS
  ===================================================== */

  const isWordLocked = (word) => {
    return lockedWords.includes(word);
  };

  const isImageLocked = (image) => {
    return lockedImages.includes(image);
  };

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

    setSelectedWord(null);
    setSelectedImage(null);
  };

  /* =====================================================
     REMOVE EDITABLE WRONG CONNECTION
  ===================================================== */

  const removeEditableConnection = ({ word, image }) => {
    setLines((prev) =>
      prev.filter((line) => {
        const lineLocked = isWordLocked(line.word) || isImageLocked(line.image);

        // الصحيح المقفول ما بنلمسه
        if (lineLocked) {
          return true;
        }

        if (word && line.word === word) {
          return false;
        }

        if (image && line.image === image) {
          return false;
        }

        return true;
      }),
    );
  };

  /* =====================================================
     WORD DOT CLICK
  ===================================================== */

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

    /* -----------------------------------------
       NO FIRST DOT
    ----------------------------------------- */

    if (!firstDot) {
      const oldLine = lines.find(
        (line) => line.word === word && !isWordLocked(line.word),
      );

      removeEditableConnection({
        word,
      });

      setWrongWords((prev) => prev.filter((item) => item !== word));

      if (oldLine) {
        setWrongImages((prev) => prev.filter((item) => item !== oldLine.image));
      }

      setFirstDot({
        type: "word",
        word,
        x: position.x,
        y: position.y,
      });

      setSelectedWord(word);
      setSelectedImage(null);

      return;
    }

    /* -----------------------------------------
       WORD → WORD
       فقط غيّر البداية
    ----------------------------------------- */

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

      return;
    }

    /* -----------------------------------------
       IMAGE → WORD
    ----------------------------------------- */

    const image = firstDot.image;

    if (isImageLocked(image)) {
      clearSelection();
      return;
    }

    const previousWordLine = lines.find((line) => line.word === word);

    const previousImageLine = lines.find((line) => line.image === image);

    if (
      previousWordLine &&
      (isWordLocked(previousWordLine.word) ||
        isImageLocked(previousWordLine.image))
    ) {
      clearSelection();
      return;
    }

    if (
      previousImageLine &&
      (isWordLocked(previousImageLine.word) ||
        isImageLocked(previousImageLine.image))
    ) {
      clearSelection();
      return;
    }

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,

      x2: position.x,
      y2: position.y,

      word,
      image,
    };

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== word && line.image !== image,
      );

      return [...filtered, newLine];
    });

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== previousImageLine?.word),
    );

    setWrongImages((prev) =>
      prev.filter((item) => item !== image && item !== previousWordLine?.image),
    );

    setSelectedWord(word);
    setSelectedImage(image);

    window.setTimeout(() => {
      clearSelection();
    }, 300);
  };

  /* =====================================================
     IMAGE DOT CLICK
  ===================================================== */

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

    /* -----------------------------------------
       NO FIRST DOT
    ----------------------------------------- */

    if (!firstDot) {
      const oldLine = lines.find(
        (line) => line.image === image && !isImageLocked(line.image),
      );

      removeEditableConnection({
        image,
      });

      setWrongImages((prev) => prev.filter((item) => item !== image));

      if (oldLine) {
        setWrongWords((prev) => prev.filter((item) => item !== oldLine.word));
      }

      setFirstDot({
        type: "image",
        image,
        x: position.x,
        y: position.y,
      });

      setSelectedImage(image);
      setSelectedWord(null);

      return;
    }

    /* -----------------------------------------
       IMAGE → IMAGE
       فقط غيّر البداية
    ----------------------------------------- */

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

      return;
    }

    /* -----------------------------------------
       WORD → IMAGE
    ----------------------------------------- */

    const word = firstDot.word;

    if (isWordLocked(word)) {
      clearSelection();
      return;
    }

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
      x1: firstDot.x,
      y1: firstDot.y,

      x2: position.x,
      y2: position.y,

      word,
      image,
    };

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== word && line.image !== image,
      );

      return [...filtered, newLine];
    });

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== previousImageLine?.word),
    );

    setWrongImages((prev) =>
      prev.filter((item) => item !== image && item !== previousWordLine?.image),
    );

    setSelectedWord(word);
    setSelectedImage(image);

    window.setTimeout(() => {
      clearSelection();
    }, 300);
  };

  /* =====================================================
     WORD CLICK
     AUDIO ALWAYS
  ===================================================== */

  const handleWordClick = (item) => {
    // الصوت دائمًا يشتغل
    playWordAudio(item);

    // بس التوصيل يتوقف إذا صح
    if (showAnswer || checkCompleted || isWordLocked(item.word)) {
      return;
    }

    document.getElementById(`dot-${item.word}`)?.click();
  };

  /* =====================================================
     IMAGE CLICK
  ===================================================== */

  const handleImageClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    document.getElementById(`dot-${imageId}`)?.click();
  };

  /* =====================================================
     CHECK
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

    /* =================================
       LOCK CORRECT ONLY
    ================================= */

    setLockedWords((prev) =>
      Array.from(new Set([...prev, ...correctWordTemp])),
    );

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...correctImageTemp])),
    );

    /* =================================
       WRONG MARKS
    ================================= */

    setWrongWords(wrongWordTemp);

    setWrongImages(wrongImageTemp);

    clearSelection();

    const total = correctMatches.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        margin-top:10px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
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

    clearSelection();

    setWrongWords([]);
    setWrongImages([]);

    const finalLines = correctMatches.map((pair) => {
      const wordDot = document.querySelector(`[data-word="${pair.word}"]`);

      const imageDot = document.querySelector(`[data-image="${pair.image}"]`);

      const wordPosition = getDotPosition(wordDot);

      const imagePosition = getDotPosition(imageDot);

      return {
        word: pair.word,
        image: pair.image,

        x1: wordPosition?.x ?? 0,

        y1: wordPosition?.y ?? 0,

        x2: imagePosition?.x ?? 0,

        y2: imagePosition?.y ?? 0,
      };
    });

    setLines(finalLines);

    setLockedWords(correctMatches.map((item) => item.word));

    setLockedImages(correctMatches.map((item) => item.image));

    setShowAnswer(true);
    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopWordAudio();

    setLines([]);

    setFirstDot(null);

    setSelectedWord(null);
    setSelectedImage(null);

    setWrongWords([]);
    setWrongImages([]);

    setLockedWords([]);
    setLockedImages([]);

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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="I"
          title="Read and match."
          subTitle="Read each month sentence, then connect it to the correct calendar."
        />

        <div className="container12-wb-u2-p5-q1" ref={containerRef}>
          {sentenceItems.map((sentenceItem, index) => {
            const imageItem = imageItems[index];

            const wordLocked = isWordLocked(sentenceItem.word);

            const imageLocked = isImageLocked(imageItem.id);

            const wordIsPlaying = activeAudioWord === sentenceItem.word;

            return (
              <div className="matching-row-wb-u2-p5-q1" key={sentenceItem.word}>
                {/* =========================
                      LEFT SENTENCE
                  ========================= */}

                <div className="sentence-side-wb-u2-p5-q1">
                  <span className="number-wb-u2-p5-q1">
                    {sentenceItem.number}
                  </span>

                  <div className="sentence-box-wrapper-wb-u2-p5-q1">
                    <span
                      className={`sentence-box-wb-u2-p5-q1 ${
                        selectedWord === sentenceItem.word
                          ? "selected-item-wb-u2-p5-q1"
                          : ""
                      }`}
                      onClick={() => handleWordClick(sentenceItem)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {sentenceItem.label}

                      {wordIsPlaying && (
                        <FaVolumeUp
                          aria-hidden="true"
                          size={17}
                          style={{
                            flexShrink: 0,
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </span>

                    {wrongWords.includes(sentenceItem.word) && (
                      <span className="error-mark-wb-u2-p5-q1">✕</span>
                    )}
                  </div>

                  <div className="dot-wrapper-wb-u2-p5-q1">
                    <div
                      className="dot-wb-u2-p5-q1"
                      id={`dot-${sentenceItem.word}`}
                      data-word={sentenceItem.word}
                      onClick={handleWordDotClick}
                    />
                  </div>
                </div>

                {/* =========================
                      RIGHT CALENDAR
                  ========================= */}

                <div className="calendar-side-wb-u2-p5-q1">
                  <div className="dot-wrapper-wb-u2-p5-q1">
                    <div
                      className="dot-wb-u2-p5-q1"
                      id={`dot-${imageItem.id}`}
                      data-image={imageItem.id}
                      onClick={handleImageDotClick}
                    />
                  </div>

                  <div
                    className={`calendar-wrapper-wb-u2-p5-q1 ${
                      selectedImage === imageItem.id
                        ? "selected-image-wb-u2-p5-q1"
                        : ""
                    }`}
                  >
                    <img
                      src={imageItem.img}
                      alt={imageItem.alt}
                      onClick={() => handleImageClick(imageItem.id)}
                      style={{
                        cursor:
                          imageLocked || showAnswer || checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                    />

                    {wrongImages.includes(imageItem.id) && (
                      <span className="image-error-wb-u2-p5-q1">✕</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* =========================
              LINES
          ========================= */}

          <svg className="lines-layer-wb-u2-p5-q1">
            {lines.map((line, index) => (
              <line
                key={`${line.word}-${line.image}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="2"
              />
            ))}
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

export default WB_Unit2_Page5_Q1;
