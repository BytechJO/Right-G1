import React, { useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U2/U2P12EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U2/U2P12EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U2/U2P12EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U2/U2P12EXEH-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit2_Page4_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

// ======================================================
// WORD AUDIOS
// بدلي المسارات حسب ملفاتك
// ======================================================

import presentAudio from "../../../assets/U1 WB/U2/page_12/Item_001_It's_a_present.mp3";
import cakeAudio from "../../../assets/U1 WB/U2/page_12/Item_002_It's_a_birthday_cake.mp3";
import birthdayAudio from "../../../assets/U1 WB/U2/page_12/Item_003_Happy_birthday!.mp3";
import jelloAudio from "../../../assets/U1 WB/U2/page_12/Item_004_It's_jello.mp3";

// ======================================================
// DATA
// ======================================================

const imageItems = [
  {
    id: "img1",
    img: img1,
    alt: "Children celebrating a birthday party",
    number: 1,
  },
  {
    id: "img2",
    img: img2,
    alt: "A bowl of jelly",
    number: 2,
  },
  {
    id: "img3",
    img: img3,
    alt: "A birthday present",
    number: 3,
  },
  {
    id: "img4",
    img: img4,
    alt: "A birthday cake",
    number: 4,
  },
];

const wordItems = [
  {
    word: "present",
    label: "It’s a present.",
    audio: presentAudio,
  },
  {
    word: "cake",
    label: "It’s a birthday cake.",
    audio: cakeAudio,
  },
  {
    word: "birthday",
    label: "Happy birthday!",
    audio: birthdayAudio,
  },
  {
    word: "jello",
    label: "It’s jello.",
    audio: jelloAudio,
  },
];

const correctMatches = [
  {
    word: "birthday",
    image: "img1",
  },
  {
    word: "jello",
    image: "img2",
  },
  {
    word: "present",
    image: "img3",
  },
  {
    word: "cake",
    image: "img4",
  },
];

// ======================================================
// MAIN
// ======================================================

const WB_Unit2_Page4_Q2 = () => {
  const [lines, setLines] = useState([]);

  const containerRef = useRef(null);

  // ======================================================
  // SELECTION
  // ======================================================

  const [firstDot, setFirstDot] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  // ======================================================
  // CHECK
  // ======================================================

  const [wrongWords, setWrongWords] = useState([]);

  const [wrongImages, setWrongImages] = useState([]);

  const [lockedWords, setLockedWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  // ======================================================
  // WORD AUDIO
  // ======================================================

  const audioRef = useRef(null);

  const [activeAudioWord, setActiveAudioWord] = useState(null);

  const stopWordAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      // لما نوقف صوت بسبب صوت ثاني
      // نرجعه للبداية
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setActiveAudioWord(null);
  };

  const playWordAudio = (item) => {
    if (!item?.audio) {
      return;
    }

    // وقف أي صوت سابق ورجعه للبداية
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

  // ======================================================
  // HELPERS
  // ======================================================

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

  // ======================================================
  // CLEAR SELECTION
  // ======================================================

  const clearSelection = () => {
    setFirstDot(null);

    setSelectedImage(null);

    setSelectedWord(null);
  };

  // ======================================================
  // REMOVE OLD WRONG CONNECTIONS
  // ======================================================

  const removeEditableConnection = ({ image, word }) => {
    setLines((prev) =>
      prev.filter((line) => {
        /*
          الخط الصحيح المقفول ما بنلمسه.
        */

        const lineLocked = isImageLocked(line.image) || isWordLocked(line.word);

        if (lineLocked) {
          return true;
        }

        /*
          إذا endpoint نفسه مستخدم بخط غلط قديم
          نحذف الخط عشان نعيد التوصيل.
        */

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

  // ======================================================
  // START / COMPLETE FROM IMAGE
  // ======================================================

  const handleImageDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const image = e.currentTarget.dataset.image;

    if (!image || isImageLocked(image)) {
      return;
    }

    const position = getDotPosition(e.currentTarget);

    if (!position) {
      return;
    }

    /*
      -----------------------------------
      NO FIRST DOT
      الصورة تصبح بداية التوصيل
      -----------------------------------
    */

    if (!firstDot) {
      removeEditableConnection({
        image,
      });

      setWrongImages((prev) => prev.filter((item) => item !== image));

      /*
        إذا الخط القديم المحذوف كان مربوط
        بكلمة غلط، شيل X عنها كمان.
      */

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

      return;
    }

    /*
      -----------------------------------
      ضغط صورة ثانية والصورة هي البداية
      فقط بدل الاختيار
      -----------------------------------
    */

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

    /*
      -----------------------------------
      البداية كانت WORD
      والنهاية الآن IMAGE
      -----------------------------------
    */

    const word = firstDot.word;

    if (isWordLocked(word)) {
      clearSelection();

      return;
    }

    /*
      إذا الصورة أو الكلمة مستخدمة بخط غلط
      نحذف الخط القديم.
    */

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

    setSelectedImage(image);

    setSelectedWord(word);

    window.setTimeout(() => {
      clearSelection();
    }, 300);
  };

  // ======================================================
  // START / COMPLETE FROM WORD
  // ======================================================

  const handleWordDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const word = e.currentTarget.dataset.word;

    if (!word || isWordLocked(word)) {
      return;
    }

    const position = getDotPosition(e.currentTarget);

    if (!position) {
      return;
    }

    /*
      -----------------------------------
      NO FIRST DOT
      الكلمة تصبح بداية التوصيل
      -----------------------------------
    */

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

      return;
    }

    /*
      -----------------------------------
      ضغط كلمة ثانية والكلمة هي البداية
      فقط بدل الاختيار
      -----------------------------------
    */

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

    /*
      -----------------------------------
      البداية IMAGE
      والنهاية WORD
      -----------------------------------
    */

    const image = firstDot.image;

    if (isImageLocked(image)) {
      clearSelection();

      return;
    }

    const previousWordLine = lines.find((line) => line.word === word);

    const previousImageLine = lines.find((line) => line.image === image);

    if (
      previousWordLine &&
      (isImageLocked(previousWordLine.image) ||
        isWordLocked(previousWordLine.word))
    ) {
      clearSelection();

      return;
    }

    if (
      previousImageLine &&
      (isImageLocked(previousImageLine.image) ||
        isWordLocked(previousImageLine.word))
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

    setSelectedImage(image);

    setSelectedWord(word);

    window.setTimeout(() => {
      clearSelection();
    }, 300);
  };

  // ======================================================
  // IMAGE CLICK
  // ======================================================

  const handleImageClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    document.getElementById(`dot-${imageId}`)?.click();
  };

  // ======================================================
  // WORD CLICK
  // الصوت دائمًا يشتغل
  // والتوصيل يشتغل فقط إذا مش مقفول
  // ======================================================

  const handleWordClick = (item) => {
    /*
      الصوت يشتغل حتى بعد Check
      وحتى لو الكلمة صح ومقفلة.
    */

    playWordAudio(item);

    /*
      التوصيل فقط يتوقف بعد القفل.
    */

    if (showAnswer || checkCompleted || isWordLocked(item.word)) {
      return;
    }

    document.getElementById(`dot-${item.word}`)?.click();
  };

  // ======================================================
  // CHECK
  // ======================================================

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

    // ======================================================
    // LOCK CORRECT ONLY
    // ======================================================

    setLockedWords((prev) =>
      Array.from(new Set([...prev, ...correctWordTemp])),
    );

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...correctImageTemp])),
    );

    // ======================================================
    // WRONG ONLY
    // ======================================================

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

    // ======================================================
    // ALL CORRECT
    // ======================================================

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

  // ======================================================
  // SHOW ANSWER
  // ======================================================

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
        /*
              نخلي الرسم من الصورة للكلمة
              لكن النتيجة نفسها.
            */

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
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    stopWordAudio();

    setLines([]);

    setWrongWords([]);

    setWrongImages([]);

    setLockedWords([]);

    setLockedImages([]);

    setFirstDot(null);

    setShowAnswer(false);

    setCheckCompleted(false);

    setSelectedImage(null);

    setSelectedWord(null);
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
          sectionLetter="H"
          title="Look, read, and match."
          subTitle="Connect each birthday picture to the sentence that describes it."
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
                    src={imageItem.img}
                    alt={imageItem.alt}
                    className={`matched-img2 ${
                      selectedImage === imageItem.id ? "selected-item" : ""
                    }`}
                    onClick={() => handleImageClick(imageItem.id)}
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
                    />
                  </div>

                  <span
                    className={`word-text ${
                      selectedWord === wordItem.word ? "selected-item" : ""
                    }`}
                    onClick={() => handleWordClick(wordItem)}
                    style={{
                      cursor: "pointer",

                      position: "relative",

                      display: "inline-flex",

                      alignItems: "center",

                      gap: "8px",
                    }}
                  >
                    {wordItem.label}

                    {/* =================================================
                          AUDIO ICON
                          تظهر فقط أثناء الصوت
                      ================================================= */}

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

export default WB_Unit2_Page4_Q2;
