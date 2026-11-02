import React, { useState, useRef, useEffect } from "react";

import img1 from "../../../assets/unit6/imgs/U6P55EXEE-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P55EXEE-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P55EXEE-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P55EXEE-04.svg";
import img5 from "../../../assets/unit6/imgs/U6P55EXEE-05.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Review6_Page2_Q2.css";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import { FaVolumeUp } from "react-icons/fa";

/* =========================================================
   AUDIO
========================================================= */

import sitAudio from "../../../assets/unit6/sounds/Page 55 - E/sit.mp3";
import pinAudio from "../../../assets/unit6/sounds/Page 55 - E/pin.mp3";
import wigAudio from "../../../assets/unit6/sounds/Page 55 - E/wig.mp3";

/*
  الملف الموجود عندك اسمه big.mp3
  بينما الكلمة بالسؤال هي dig.
*/
import digAudio from "../../../assets/unit6/sounds/Page 55 - E/big.mp3";

import hillAudio from "../../../assets/unit6/sounds/Page 55 - E/hill.mp3";

/* =========================================================
   DATA
========================================================= */

const WORDS = [
  {
    word: "sit",
    audio: sitAudio,
  },
  {
    word: "pin",
    audio: pinAudio,
  },
  {
    word: "wig",
    audio: wigAudio,
  },
  {
    word: "dig",
    audio: digAudio,
  },
  {
    word: "hill",
    audio: hillAudio,
  },
];

const IMAGES = [
  {
    key: "img1",
    src: img1,
    alt: "A brown wig with shoulder-length hair.",
  },
  {
    key: "img2",
    src: img2,
    alt: "A boy sitting on a green chair.",
  },
  {
    key: "img3",
    src: img3,
    alt: "A boy digging in the ground with a shovel.",
  },
  {
    key: "img4",
    src: img4,
    alt: "A green push pin.",
  },
  {
    key: "img5",
    src: img5,
    alt: "A green hill surrounded by mountains.",
  },
];

const correctMatches = [
  {
    word: "sit",
    image: "img2",
  },
  {
    word: "pin",
    image: "img4",
  },
  {
    word: "wig",
    image: "img1",
  },
  {
    word: "dig",
    image: "img3",
  },
  {
    word: "hill",
    image: "img5",
  },
];

/* =========================================================
   GET CENTER
========================================================= */

const getCenter = (el, container) => {
  if (!el || !container) {
    return null;
  }

  const er = el.getBoundingClientRect();

  const cr = container.getBoundingClientRect();

  return {
    x: er.left - cr.left + er.width / 2,

    y: er.top - cr.top + er.height / 2,
  };
};

/* =========================================================
   MAIN
========================================================= */

const Review6_Page2_Q2 = () => {
  const containerRef = useRef(null);

  /* =====================================================
     CONNECTIONS
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  /* =====================================================
     PROGRESSIVE LOCKING
  ===================================================== */

  const [lockedWords, setLockedWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  /* =====================================================
     MATCHING SELECTION
  ===================================================== */

  const [firstPoint, setFirstPoint] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  /* =====================================================
     KEYBOARD MATCHING
  ===================================================== */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  const [previewLine, setPreviewLine] = useState(null);

  const wordRefs = useRef({});

  const imageRefs = useRef([]);

  /* =====================================================
     DOT REFS
  ===================================================== */

  const dotRefs = useRef({});

  const registerDot = (key, el) => {
    if (el) {
      dotRefs.current[key] = el;
    }
  };

  /* =====================================================
     FINAL STATES
  ===================================================== */

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

  const playWordAudio = (word, src) => {
    if (!src) {
      return;
    }

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

  const getWordAudio = (word) =>
    WORDS.find((item) => item.word === word)?.audio;

  /* =====================================================
     HELPERS
  ===================================================== */

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (image) => lockedImages.includes(image);

  const wordToImage = Object.fromEntries(
    lines.map((line) => [line.word, line.image]),
  );

  const imageToWord = Object.fromEntries(
    lines.map((line) => [line.image, line.word]),
  );

  const isCorrectMatch = (word, image) =>
    correctMatches.some((pair) => pair.word === word && pair.image === image);

  const getAvailableImageIndexes = () =>
    IMAGES.map((_, index) => index).filter(
      (index) => !isImageLocked(IMAGES[index].key),
    );

  /* =====================================================
     CLEAR CURRENT SELECTION
  ===================================================== */

  const clearMatchingSelection = () => {
    setFirstPoint(null);

    setSelectedWord(null);

    setSelectedImage(null);

    setKeyboardMatching(false);

    setPreviewLine(null);
  };

  /* =====================================================
     UPDATE KEYBOARD PREVIEW
  ===================================================== */

  const updatePreviewLine = (startPoint, imageKey) => {
    if (!startPoint || !containerRef.current) {
      return;
    }

    const imageDot = dotRefs.current[`image-${imageKey}`];

    if (!imageDot) {
      return;
    }

    const end = getCenter(imageDot, containerRef.current);

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
     COMMIT CONNECTION
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

    /*
      إذا الصورة كان عليها خط قديم غلط،
      نعرف مين الكلمة القديمة حتى نمسح X عنها.
    */

    const displacedLine = lines.find((line) => line.image === image);

    const newLine = {
      word,
      image,
    };

    /*
      ONE-TO-ONE:
      نشيل أي خط قديم للكلمة
      وأي خط قديم للصورة.
    */

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== image),

      newLine,
    ]);

    /*
      شيل X فقط من الوصلة
      اللي تم تعديلها.
    */

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== displacedLine?.word),
    );

    setSelectedWord(word);

    setSelectedImage(image);

    setFirstPoint(null);

    setKeyboardMatching(false);

    setPreviewLine(null);

    window.setTimeout(() => {
      setSelectedWord(null);

      setSelectedImage(null);
    }, 250);
  };

  /* =====================================================
     MOUSE START — WORD
  ===================================================== */

  const handleWordMatchClick = (word) => {
    setKeyboardMatching(false);

    setPreviewLine(null);

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    const wordDot = dotRefs.current[`word-${word}`];

    if (!wordDot || !containerRef.current) {
      return;
    }

    const pos = getCenter(wordDot, containerRef.current);

    if (!pos) {
      return;
    }

    /* =================================================
       FIRST POINT
    ================================================= */

    if (!firstPoint) {
      /*
        إذا عنده خط قديم غلط:
        نشيله أولًا حتى يقدر يعيد التوصيل.
      */

      setLines((prev) =>
        prev.filter((line) => line.word !== word || isWordLocked(line.word)),
      );

      setWrongWords((prev) => prev.filter((item) => item !== word));

      setFirstPoint({
        type: "word",

        word,

        x: pos.x,
        y: pos.y,
      });

      setSelectedWord(word);

      setSelectedImage(null);

      return;
    }

    /* =================================================
       IMAGE → WORD
    ================================================= */

    if (firstPoint.type === "image") {
      commitConnection(word, firstPoint.image);

      return;
    }

    /* =================================================
       WORD → WORD
       استبدال الاختيار
    ================================================= */

    setFirstPoint({
      type: "word",

      word,

      x: pos.x,
      y: pos.y,
    });

    setSelectedWord(word);

    setSelectedImage(null);
  };

  /* =====================================================
     MOUSE START — IMAGE
  ===================================================== */

  const handleImageMatchClick = (image) => {
    setKeyboardMatching(false);

    setPreviewLine(null);

    if (showAnswer || checkCompleted || isImageLocked(image)) {
      return;
    }

    const imageDot = dotRefs.current[`image-${image}`];

    if (!imageDot || !containerRef.current) {
      return;
    }

    const pos = getCenter(imageDot, containerRef.current);

    if (!pos) {
      return;
    }

    /* =================================================
       FIRST POINT
    ================================================= */

    if (!firstPoint) {
      /*
        إذا الصورة عليها خط قديم غلط،
        نشيله حتى تقدر تبدأ منها.
      */

      const oldLine = lines.find((line) => line.image === image);

      setLines((prev) =>
        prev.filter(
          (line) => line.image !== image || isImageLocked(line.image),
        ),
      );

      if (oldLine) {
        setWrongWords((prev) => prev.filter((item) => item !== oldLine.word));
      }

      setFirstPoint({
        type: "image",

        image,

        x: pos.x,
        y: pos.y,
      });

      setSelectedImage(image);

      setSelectedWord(null);

      return;
    }

    /* =================================================
       WORD → IMAGE
    ================================================= */

    if (firstPoint.type === "word") {
      commitConnection(firstPoint.word, image);

      return;
    }

    /* =================================================
       IMAGE → IMAGE
       استبدال الاختيار
    ================================================= */

    setFirstPoint({
      type: "image",

      image,

      x: pos.x,
      y: pos.y,
    });

    setSelectedImage(image);

    setSelectedWord(null);
  };

  /* =====================================================
     KEYBOARD START FROM WORD
  ===================================================== */

  const startKeyboardMatch = (word) => {
    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    const wordDot = dotRefs.current[`word-${word}`];

    if (!wordDot || !containerRef.current) {
      return;
    }

    const pos = getCenter(wordDot, containerRef.current);

    if (!pos) {
      return;
    }

    /*
      إذا عليه خط قديم غلط،
      نشيله قبل إعادة التوصيل.
    */

    setLines((prev) =>
      prev.filter((line) => line.word !== word || isWordLocked(line.word)),
    );

    setWrongWords((prev) => prev.filter((item) => item !== word));

    const startPoint = {
      type: "word",

      word,

      x: pos.x,
      y: pos.y,
    };

    setFirstPoint(startPoint);

    setSelectedWord(word);

    setSelectedImage(null);

    setKeyboardMatching(true);

    requestAnimationFrame(() => {
      const available = getAvailableImageIndexes();

      if (!available.length) {
        return;
      }

      const firstIndex = available[0];

      imageRefs.current[firstIndex]?.focus();

      updatePreviewLine(startPoint, IMAGES[firstIndex].key);
    });
  };

  /* =====================================================
     IMAGE KEYBOARD
  ===================================================== */

  const handleImageKeyboard = (e, index, image) => {
    if (!keyboardMatching || !firstPoint || firstPoint.type !== "word") {
      return;
    }

    if (showAnswer || checkCompleted || isImageLocked(image)) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();

      e.stopPropagation();

      const available = getAvailableImageIndexes();

      if (!available.length) {
        return;
      }

      const current = available.indexOf(index);

      let next;

      if (e.shiftKey) {
        next = current <= 0 ? available.length - 1 : current - 1;
      } else {
        next =
          current === -1 || current === available.length - 1 ? 0 : current + 1;
      }

      const target = available[next];

      imageRefs.current[target]?.focus();

      updatePreviewLine(firstPoint, IMAGES[target].key);

      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      const source = firstPoint.word;

      commitConnection(source, image);

      window.setTimeout(() => {
        const nextWord = WORDS.find(
          (item) =>
            item.word !== source &&
            !isWordLocked(item.word) &&
            !lines.some((line) => line.word === item.word),
        )?.word;

        if (nextWord) {
          wordRefs.current[nextWord]?.focus();
        } else {
          wordRefs.current[source]?.focus();
        }
      }, 0);

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      const source = firstPoint.word;

      clearMatchingSelection();

      requestAnimationFrame(() => {
        wordRefs.current[source]?.focus();
      });
    }
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswers = () => {
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
      const correct = isCorrectMatch(line.word, line.image);

      if (correct) {
        correctCount++;

        newlyLockedWords.push(line.word);

        newlyLockedImages.push(line.image);
      } else {
        wrong.push(line.word);
      }
    });

    /* =================================================
       PROGRESSIVE LOCKING
    ================================================= */

    setLockedWords((prev) =>
      Array.from(new Set([...prev, ...newlyLockedWords])),
    );

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newlyLockedImages])),
    );

    /* =================================================
       WRONG ONLY
    ================================================= */

    setWrongWords(wrong);

    clearMatchingSelection();

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

    /* =================================================
       ALL CORRECT
    ================================================= */

    if (correctCount === total) {
      setLockedWords(correctMatches.map((item) => item.word));

      setLockedImages(correctMatches.map((item) => item.image));

      setWrongWords([]);

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

  const showAnswers = () => {
    stopAudio();

    setLines(
      correctMatches.map((item) => ({
        ...item,
      })),
    );

    setWrongWords([]);

    setLockedWords(correctMatches.map((item) => item.word));

    setLockedImages(correctMatches.map((item) => item.image));

    setShowAnswer(true);

    setCheckCompleted(true);

    clearMatchingSelection();
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setLines([]);

    setWrongWords([]);

    setLockedWords([]);

    setLockedImages([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    clearMatchingSelection();
  };

  /* =====================================================
     SVG LINES
  ===================================================== */

  const [svgLines, setSvgLines] = useState([]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const computed = lines
      .map((line) => {
        const wordEl = dotRefs.current[`word-${line.word}`];

        const imageEl = dotRefs.current[`image-${line.image}`];

        if (!wordEl || !imageEl) {
          return null;
        }

        const p1 = getCenter(wordEl, containerRef.current);

        const p2 = getCenter(imageEl, containerRef.current);

        if (!p1 || !p2) {
          return null;
        }

        return {
          x1: p1.x,
          y1: p1.y,

          x2: p2.x,
          y2: p2.y,

          word: line.word,
          image: line.image,
        };
      })
      .filter(Boolean);

    setSvgLines(computed);
  }, [lines, wrongWords, lockedWords, lockedImages]);

  /* =====================================================
     RESIZE
  ===================================================== */

  useEffect(() => {
    const handler = () => {
      setLines((prev) => [...prev]);
    };

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

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
        <ExerciseHeaderReview
          sectionLetter="E"
          title="Read, look, and match."
          subTitle="Match sit, pin, wig, dig, and hill to the correct pictures."
        />

        <div
          className="match-wrapper2"
          ref={containerRef}
          style={{
            position: "relative",
          }}
        >
          {/* =================================================
              WORDS
          ================================================= */}

          <div className="match-words-row2">
            {WORDS.map((item, i) => {
              const word = item.word;

              const isSelected = selectedWord === word;

              const isConnected = !!wordToImage[word];

              const isWrong = wrongWords.includes(word);

              const wordLocked = isWordLocked(word);

              const isPlaying = playingWord === word;

              return (
                <div
                  key={word}
                  className="word-box2"
                  style={{
                    display: "flex",

                    gap: "10px",

                    flexDirection: "row",

                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "darkblue",

                      fontWeight: "700",
                    }}
                  >
                    {i + 1}{" "}
                  </span>

                  <div>
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <h5
                        ref={(el) => {
                          wordRefs.current[word] = el;
                        }}
                        className={[
                          "h5-review6-p2-q2",

                          isSelected ? "active-match-item" : "",

                          isConnected ? "connected-match-item" : "",

                          wordLocked || showAnswer ? "disabled-hover" : "",
                        ].join(" ")}
                        role="button"
                        /*
                            حتى لو صح ومقفول:
                            يضل بالـTab
                            عشان الصوت.
                          */

                        tabIndex={0}
                        aria-label={
                          wordLocked || showAnswer || checkCompleted
                            ? `Play audio: ${word}`
                            : `${word}. Press Enter or Space to hear the word and start matching.`
                        }
                        style={{
                          cursor: "pointer",

                          position: "relative",
                        }}
                        onClick={() => {
                          playWordAudio(word, item.audio);

                          if (!wordLocked && !showAnswer && !checkCompleted) {
                            handleWordMatchClick(word);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();

                            e.stopPropagation();

                            playWordAudio(word, item.audio);

                            if (!wordLocked && !showAnswer && !checkCompleted) {
                              startKeyboardMatch(word);
                            }
                          }
                        }}
                      >
                        {word}

                        {isPlaying && (
                          <FaVolumeUp
                            size={14}
                            aria-hidden="true"
                            style={{
                              position: "absolute",

                              right: "-20px",

                              top: "50%",

                              transform: "translateY(-50%)",
                            }}
                          />
                        )}
                      </h5>

                      {isWrong && (
                        <span
                          className="error-mark-img-unit6-p5-q2"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}
                    </div>

                    {/* DOT */}

                    <div
                      ref={(el) => registerDot(`word-${word}`, el)}
                      className={[
                        "dot22-unit6-q2 start-dot22-unit6-q2",

                        isSelected ? "dot-active" : "",

                        isConnected ? "dot-connected" : "",
                      ].join(" ")}
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => {
                        if (!wordLocked && !showAnswer && !checkCompleted) {
                          handleWordMatchClick(word);
                        }
                      }}
                      style={{
                        cursor:
                          wordLocked || showAnswer || checkCompleted
                            ? "default"
                            : "pointer",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              IMAGES
          ================================================= */}

          <div className="match-images-row2">
            {IMAGES.map((image, index) => {
              const imageKey = image.key;

              const connectedWord = imageToWord[imageKey];

              const isConnected = !!connectedWord;

              const imageLocked = isImageLocked(imageKey);

              const targetActive =
                keyboardMatching && firstPoint?.type === "word";

              return (
                <div key={imageKey} className="img-box2">
                  <img
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    src={image.src}
                    className={[
                      "clickable-img-unit2-p7-q2",

                      selectedImage === imageKey ? "selected-item" : "",

                      isConnected ? "connected-match-item" : "",

                      imageLocked || showAnswer ? "disabled-hover" : "",
                    ].join(" ")}
                    alt={image.alt}
                    role={targetActive && !imageLocked ? "button" : undefined}
                    tabIndex={
                      targetActive &&
                      !imageLocked &&
                      !showAnswer &&
                      !checkCompleted
                        ? 0
                        : -1
                    }
                    aria-label={
                      targetActive && !imageLocked
                        ? `${image.alt} Press Enter or Space to connect this picture.`
                        : image.alt
                    }
                    style={{
                      cursor:
                        imageLocked || showAnswer || checkCompleted
                          ? "default"
                          : "pointer",
                    }}
                    onClick={() => {
                      if (!imageLocked && !showAnswer && !checkCompleted) {
                        handleImageMatchClick(imageKey);
                      }
                    }}
                    onFocus={() => {
                      if (
                        keyboardMatching &&
                        firstPoint?.type === "word" &&
                        !imageLocked
                      ) {
                        updatePreviewLine(firstPoint, imageKey);
                      }
                    }}
                    onKeyDown={(e) => handleImageKeyboard(e, index, imageKey)}
                  />

                  {/* DOT */}

                  <div
                    ref={(el) => registerDot(`image-${imageKey}`, el)}
                    className={[
                      "dot22-unit6-q2 end-dot22-unit6-q2",

                      isConnected ? "dot-connected" : "",
                    ].join(" ")}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => {
                      if (!imageLocked && !showAnswer && !checkCompleted) {
                        handleImageMatchClick(imageKey);
                      }
                    }}
                    style={{
                      cursor:
                        imageLocked || showAnswer || checkCompleted
                          ? "default"
                          : "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              LINES
          ================================================= */}

          <svg
            className="lines-layer2"
            aria-hidden="true"
            style={{
              position: "absolute",

              top: 0,

              left: 0,

              width: "100%",

              height: "100%",

              pointerEvents: "none",

              overflow: "visible",
            }}
          >
            {svgLines.map((line, index) => (
              <line
                key={`${line.word}-${line.image}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}

            {/* =============================================
                KEYBOARD PREVIEW ONLY
            ============================================= */}

            {keyboardMatching && previewLine && (
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

        <button onClick={showAnswers} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review6_Page2_Q2;
