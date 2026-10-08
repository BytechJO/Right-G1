import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/unit7/img/U7P63EXEE-01.svg";
import img2 from "../../../assets/unit7/img/U7P63EXEE-02.svg";
import img3 from "../../../assets/unit7/img/U7P63EXEE-03.svg";
import img4 from "../../../assets/unit7/img/U7P63EXEE-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Unit7_Page6_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import boredAudio from "../../../assets/unit7/sound/Page 63 - E/I'm bored..mp3";
import coldAudio from "../../../assets/unit7/sound/Page 63 - E/I'm cold..mp3";
import hungryAudio from "../../../assets/unit7/sound/Page 63 - E/I'm hungry..mp3";
import scaredAudio from "../../../assets/unit7/sound/Page 63 - E/I'm scared..mp3";

/* =====================================================
   DATA
===================================================== */

const IMAGES = [
  {
    id: "img1",
    src: img1,
    label: "1",
    alt: "A boy shivering and holding his arms because he feels cold.",
  },

  {
    id: "img2",
    src: img2,
    label: "2",
    alt: "A hungry boy thinking about food.",
  },

  {
    id: "img3",
    src: img3,
    label: "3",
    alt: "A boy sitting with a tired expression because he feels bored.",
  },

  {
    id: "img4",
    src: img4,
    label: "4",
    alt: "A frightened boy standing near an animal enclosure.",
  },
];

const WORDS = [
  {
    text: "I'm bored.",
    audio: boredAudio,
  },

  {
    text: "I'm cold.",
    audio: coldAudio,
  },

  {
    text: "I'm scared.",
    audio: scaredAudio,
  },

  {
    text: "I'm hungry.",
    audio: hungryAudio,
  },
];

const CORRECT_MATCHES = [
  {
    image: "img1",
    word: "I'm cold.",
  },

  {
    image: "img2",
    word: "I'm hungry.",
  },

  {
    image: "img3",
    word: "I'm bored.",
  },

  {
    image: "img4",
    word: "I'm scared.",
  },
];

/* =====================================================
   GET CENTER
===================================================== */

const getCenter = (element, container) => {
  if (!element || !container) {
    return null;
  }

  const elementRect = element.getBoundingClientRect();

  const containerRect = container.getBoundingClientRect();

  return {
    x: elementRect.left - containerRect.left + elementRect.width / 2,

    y: elementRect.top - containerRect.top + elementRect.height / 2,
  };
};

/* =====================================================
   COMPONENT
===================================================== */

const Unit7_Page6_Q2 = () => {
  /* =================================================
     CONNECTIONS
  ================================================= */

  const [lines, setLines] = useState([]);

  /* =================================================
     MOUSE SELECTION
  ================================================= */

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedWord, setSelectedWord] = useState(null);

  /* =================================================
     CHECK
  ================================================= */

  const [lockedImages, setLockedImages] = useState([]);

  const [wrongImages, setWrongImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     KEYBOARD MATCHING
  ================================================= */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  const [keyboardSource, setKeyboardSource] = useState(null);

  const [focusedWord, setFocusedWord] = useState(null);

  /* =================================================
     PREVIEW LINE
  ================================================= */

  const [previewLine, setPreviewLine] = useState(null);

  /* =================================================
     SVG LINES
  ================================================= */

  const [svgLines, setSvgLines] = useState([]);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =================================================
     REFS
  ================================================= */

  const containerRef = useRef(null);

  const dotRefs = useRef({});

  const imageRefs = useRef({});

  const wordRefs = useRef({});

  /* =================================================
     LOOKUPS
  ================================================= */

  const imageToWord = Object.fromEntries(
    lines.map((line) => [line.image, line.word]),
  );

  const wordToImage = Object.fromEntries(
    lines.map((line) => [line.word, line.image]),
  );

  /* =================================================
     HELPERS
  ================================================= */

  const isImageLocked = (imageId) => lockedImages.includes(imageId);

  const getWordData = (text) => WORDS.find((item) => item.text === text);

  const getAvailableWords = () => {
    return WORDS.filter((item) => {
      const connectedImage = wordToImage[item.text];

      // مش موصولة => متاحة
      if (!connectedImage) {
        return true;
      }

      // موصولة بنفس الـsource الحالي => متاحة
      if (connectedImage === keyboardSource) {
        return true;
      }

      // موصولة بصورة ثانية لكن لسا مش correct/locked
      // => مسموح نستبدلها
      if (!isImageLocked(connectedImage)) {
        return true;
      }

      // فقط إذا التوصيل الموجود Correct + Locked
      // ما بنسمح نستبدله
      return false;
    }).map((item) => item.text);
  };
  /* =================================================
     AUDIO
  ================================================= */

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

  const playAudio = (word) => {
    const item = getWordData(word);

    if (!item?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(item.audio);

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

  /* =================================================
     REGISTER DOT
  ================================================= */

  const registerDot = (key, element) => {
    if (element) {
      dotRefs.current[key] = element;
    }
  };

  /* =================================================
     COMMIT CONNECTION
  ================================================= */

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

    /* =================================================
     CHECK TARGET CURRENT CONNECTION
  ================================================= */

    const currentTargetImage = lines.find((line) => line.word === word)?.image;

    /*
    إذا الكلمة موصولة بصورة ثانية
    والصورة الثانية Correct + Locked
    ممنوع نستبدلها.
  */

    if (
      currentTargetImage &&
      currentTargetImage !== imageId &&
      isImageLocked(currentTargetImage)
    ) {
      return;
    }

    /* =================================================
     ONE TO ONE REPLACEMENT

     بنشيل:
     - أي توصيل قديم لنفس الصورة
     - أي توصيل قديم لنفس الكلمة

     وبنحط الجديد مكانه
  ================================================= */

    setLines((prev) => [
      ...prev.filter((line) => line.image !== imageId && line.word !== word),

      {
        image: imageId,
        word,
      },
    ]);

    /*
    إذا الكلمة كانت موصولة بصورة ثانية غلط،
    نشيل X عنها لأنه توصيلها القديم انشال.
  */

    if (currentTargetImage && currentTargetImage !== imageId) {
      setWrongImages((prev) =>
        prev.filter((id) => id !== currentTargetImage && id !== imageId),
      );
    } else {
      setWrongImages((prev) => prev.filter((id) => id !== imageId));
    }

    setSelectedImage(null);
    setSelectedWord(null);
  };

  /* =================================================
     MOUSE IMAGE
  ================================================= */

  const handleImageClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    /* Mouse mode */

    setKeyboardMatching(false);

    setKeyboardSource(null);

    setFocusedWord(null);

    setPreviewLine(null);

    /* target-first */

    if (selectedWord) {
      commitConnection(imageId, selectedWord);

      return;
    }

    /*
      لو الصورة موصولة غلط/قابلة للتعديل:
      نشيل connection القديم ونبدأ منها.
    */

    if (imageToWord[imageId]) {
      setLines((prev) => prev.filter((line) => line.image !== imageId));

      setWrongImages((prev) => prev.filter((id) => id !== imageId));
    }

    setSelectedImage((prev) => (prev === imageId ? null : imageId));

    setSelectedWord(null);
  };

  /* =================================================
     MOUSE WORD
  ================================================= */

  const handleWordMouse = (word) => {
    /* الصوت دائمًا شغال */

    playAudio(word);

    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardMatching(false);

    setKeyboardSource(null);

    setFocusedWord(null);

    setPreviewLine(null);

    const connectedImage = wordToImage[word];

    /*
      إذا target مربوط بصورة صحيحة locked:
      ما نغير matching.
      الصوت فقط.
    */

    if (connectedImage && isImageLocked(connectedImage)) {
      return;
    }

    /* source already selected */

    if (selectedImage) {
      commitConnection(selectedImage, word);

      return;
    }

    /*
      target-first mouse
    */

    if (connectedImage) {
      setLines((prev) => prev.filter((line) => line.word !== word));

      setWrongImages((prev) => prev.filter((id) => id !== connectedImage));
    }

    setSelectedWord((prev) => (prev === word ? null : word));

    setSelectedImage(null);
  };

  /* =================================================
     KEYBOARD START FROM IMAGE
  ================================================= */

  const startKeyboardMatch = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    /*
      لو عليه connection قديم غلط
      نشيله قبل إعادة التوصيل.
    */

    if (imageToWord[imageId]) {
      setLines((prev) => prev.filter((line) => line.image !== imageId));
    }

    setWrongImages((prev) => prev.filter((id) => id !== imageId));

    setSelectedImage(null);

    setSelectedWord(null);

    setKeyboardMatching(true);

    setKeyboardSource(imageId);

    setFocusedWord(null);

    window.setTimeout(() => {
      const available = getAvailableWords();

      if (!available.length) {
        return;
      }

      wordRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     KEYBOARD IMAGE
  ================================================= */

  const handleImageKeyDown = (e, imageId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      startKeyboardMatch(imageId);
    }
  };

  /* =================================================
     KEYBOARD WORD
  ================================================= */

  const handleWordKeyDown = (e, word) => {
    /* =============================================
         إذا مش matching:
         Enter / Space = AUDIO ONLY
      ============================================= */

    if (!keyboardMatching) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        e.stopPropagation();

        playAudio(word);
      }

      return;
    }

    /* =============================================
         TAB / SHIFT TAB
      ============================================= */

    if (e.key === "Tab") {
      e.preventDefault();

      e.stopPropagation();

      const available = getAvailableWords();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(word);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextWord = available[nextIndex];

      wordRefs.current[nextWord]?.focus();

      return;
    }

    /* =============================================
         ENTER / SPACE COMMIT
      ============================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      /*
          صوت target +
          تثبيت connection
        */

      playAudio(word);

      const imageId = keyboardSource;

      commitConnection(imageId, word);

      setKeyboardMatching(false);

      setKeyboardSource(null);

      setFocusedWord(null);

      setPreviewLine(null);

      /*
          ارجع لأول source متاح
        */

      window.setTimeout(() => {
        const nextImage = IMAGES.find(
          (image) => !isImageLocked(image.id) && image.id !== imageId,
        );

        if (nextImage) {
          imageRefs.current[nextImage.id]?.focus();
        }
      }, 0);

      return;
    }

    /* =============================================
         ESCAPE
      ============================================= */

    if (e.key === "Escape") {
      e.preventDefault();

      e.stopPropagation();

      const imageId = keyboardSource;

      setKeyboardMatching(false);

      setKeyboardSource(null);

      setFocusedWord(null);

      setPreviewLine(null);

      window.setTimeout(() => {
        imageRefs.current[imageId]?.focus();
      }, 0);
    }
  };

  /* =================================================
     PREVIEW LINE
  ================================================= */

  const updatePreviewLine = (word) => {
    if (!keyboardMatching || !keyboardSource || !containerRef.current) {
      setPreviewLine(null);

      return;
    }

    const startEl = dotRefs.current[`img-${keyboardSource}`];

    const endEl = dotRefs.current[`word-${word}`];

    if (!startEl || !endEl) {
      return;
    }

    const p1 = getCenter(startEl, containerRef.current);

    const p2 = getCenter(endEl, containerRef.current);

    if (!p1 || !p2) {
      return;
    }

    setPreviewLine({
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
    });
  };

  /* =================================================
     WORD FOCUS
  ================================================= */

  const handleWordFocus = (word) => {
    setFocusedWord(word);

    if (keyboardMatching) {
      updatePreviewLine(word);
    }
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (lines.length < CORRECT_MATCHES.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    CORRECT_MATCHES.forEach((correct) => {
      /*
            previously locked
          */

      if (isImageLocked(correct.image)) {
        correctCount++;

        return;
      }

      const line = lines.find((item) => item.image === correct.image);

      if (line && line.word === correct.word) {
        correctCount++;

        newlyLocked.push(correct.image);
      } else {
        wrong.push(correct.image);
      }
    });

    setLockedImages((prev) => [...new Set([...prev, ...newlyLocked])]);

    setWrongImages(wrong);

    setSelectedImage(null);

    setSelectedWord(null);

    setKeyboardMatching(false);

    setKeyboardSource(null);

    setPreviewLine(null);

    const total = CORRECT_MATCHES.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
        <div style="font-size:20px;margin-top:10px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (correctCount === total) {
      setLockedImages(CORRECT_MATCHES.map((item) => item.image));

      setWrongImages([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    setLines(
      CORRECT_MATCHES.map((item) => ({
        ...item,
      })),
    );

    setWrongImages([]);

    setLockedImages(CORRECT_MATCHES.map((item) => item.image));

    setSelectedImage(null);

    setSelectedWord(null);

    setKeyboardMatching(false);

    setKeyboardSource(null);

    setFocusedWord(null);

    setPreviewLine(null);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setLines([]);

    setSelectedImage(null);

    setSelectedWord(null);

    setLockedImages([]);

    setWrongImages([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setKeyboardMatching(false);

    setKeyboardSource(null);

    setFocusedWord(null);

    setPreviewLine(null);
  };

  /* =================================================
     SVG LINES
  ================================================= */

  const recomputeLines = () => {
    if (!containerRef.current) {
      return;
    }

    const computed = lines
      .map((line) => {
        const imageEl = dotRefs.current[`img-${line.image}`];

        const wordEl = dotRefs.current[`word-${line.word}`];

        if (!imageEl || !wordEl) {
          return null;
        }

        const p1 = getCenter(imageEl, containerRef.current);

        const p2 = getCenter(wordEl, containerRef.current);

        if (!p1 || !p2) {
          return null;
        }

        return {
          x1: p1.x,
          y1: p1.y,

          x2: p2.x,
          y2: p2.y,
        };
      })
      .filter(Boolean);

    setSvgLines(computed);

    if (keyboardMatching && focusedWord) {
      updatePreviewLine(focusedWord);
    }
  };

  useEffect(() => {
    recomputeLines();
  }, [lines, wrongImages, lockedImages, keyboardMatching, focusedWord]);

  useEffect(() => {
    const handleResize = () => {
      recomputeLines();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      stopAudio();
    };
  }, []);

  /* =================================================
     RENDER
  ================================================= */

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
          gap: "60px",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title="Look, read, and match."
          subTitle="Read each feeling sentence, then connect it to the correct picture."
        />

        {/* =================================================
            MATCH AREA
        ================================================= */}

        <div
          className="match-wrapper2"
          ref={containerRef}
          style={{
            position: "relative",
          }}
        >
          {/* =================================================
              IMAGES
          ================================================= */}

          <div className="match-images-row2">
            {IMAGES.map((item) => {
              const isSelected = selectedImage === item.id;

              const isConnected = !!imageToWord[item.id];

              const isWrong = wrongImages.includes(item.id);

              const locked = isImageLocked(item.id);

              return (
                <div
                  key={item.id}
                  className="img-box2"
                  style={{
                    display: "flex",

                    gap: "10px",

                    flexDirection: "row",

                    alignItems: "center",

                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      color: "darkblue",

                      fontWeight: "700",
                    }}
                  >
                    {item.label}
                  </span>

                  {/* =====================================
                        IMAGE = KEYBOARD SOURCE
                    ===================================== */}

                  <img
                    ref={(el) => {
                      imageRefs.current[item.id] = el;
                    }}
                    src={item.src}
                    alt={item.alt}
                    role="button"
                    tabIndex={locked || showAnswer || checkCompleted ? -1 : 0}
                    aria-label={`Picture ${item.label}. ${item.alt} Press Enter or Space to start matching.`}
                    className={[
                      "matched-img2",

                      isSelected ? "selected-match-item" : "",

                      isConnected ? "connected-match-item" : "",

                      locked ? "disabled-hover" : "",
                    ]
                      .join(" ")
                      .trim()}
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                    onClick={() => handleImageClick(item.id)}
                    onKeyDown={(e) => handleImageKeyDown(e, item.id)}
                  />

                  {/* WRONG */}

                  {isWrong && (
                    <span
                      className="error-mark-img-unit7-p6-q2"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}

                  {/* DOT */}

                  <div
                    ref={(el) => registerDot(`img-${item.id}`, el)}
                    className={[
                      "dot22-unit7-p6-q2",

                      "start-dot22-unit7-p6-q2",

                      isSelected ? "dot-active" : "",

                      isConnected ? "dot-connected" : "",
                    ]
                      .join(" ")
                      .trim()}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                    onClick={() => handleImageClick(item.id)}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              WORDS + AUDIO
          ================================================= */}

          <div className="match-words-row2">
            {WORDS.map((item) => {
              const word = item.text;

              const connectedImage = wordToImage[word];

              const connectedLocked = connectedImage
                ? isImageLocked(connectedImage)
                : false;

              const isConnected = !!connectedImage;

              const isSelected = selectedWord === word;

              const playing = playingWord === word;

              /*
                  IMPORTANT:
                  حتى لو connected + locked
                  النص يضل Tab reachable
                  عشان الصوت.
                */

              return (
                <div key={word} className="word-box2">
                  {/* DOT */}

                  <div
                    ref={(el) => registerDot(`word-${word}`, el)}
                    className={[
                      "dot22-unit7-p6-q2",

                      "end-dot22-unit7-p6-q2",

                      isConnected ? "dot-connected" : "",

                      isSelected ? "dot-active" : "",
                    ]
                      .join(" ")
                      .trim()}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => {
                      if (!connectedLocked) {
                        handleWordMouse(word);
                      } else {
                        playAudio(word);
                      }
                    }}
                  />

                  {/* =====================================
                        WORD + AUDIO
                    ===================================== */}

                  <h5
                    ref={(el) => {
                      wordRefs.current[word] = el;
                    }}
                    role="button"
                    /*
                        دائماً 0 للصوت.
                        أثناء keyboard matching
                        targets كمان reachable.
                      */

                    tabIndex={0}
                    aria-label={
                      keyboardMatching
                        ? `${word}. Press Enter or Space to connect this sentence to the selected picture.`
                        : `${word}. Press Enter or Space to hear it.`
                    }
                    aria-pressed={playing}
                    className={[
                      "h5-unit6-p5-q2",

                      isConnected ? "connected-match-item" : "",

                      isSelected ? "selected-match-item" : "",
                    ]
                      .join(" ")
                      .trim()}
                    style={{
                      cursor: "pointer",

                      position: "relative",
                    }}
                    onFocus={() => handleWordFocus(word)}
                    onClick={() => handleWordMouse(word)}
                    onKeyDown={(e) => handleWordKeyDown(e, word)}
                  >
                    {word}

                    {playing && (
                      <FaVolumeUp
                        size={14}
                        aria-hidden="true"
                        className="audio-icon-unit7-p6-q2"
                      />
                    )}
                  </h5>
                </div>
              );
            })}
          </div>

          {/* =================================================
              SVG LINES
          ================================================= */}

          <svg
            className="lines-layer2"
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
            {/* PERMANENT LINES */}

            {svgLines.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}

            {/* KEYBOARD PREVIEW ONLY */}

            {keyboardMatching && previewLine && (
              <line
                x1={previewLine.x1}
                y1={previewLine.y1}
                x2={previewLine.x2}
                y2={previewLine.y2}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
                strokeLinecap="round"
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

export default Unit7_Page6_Q2;
