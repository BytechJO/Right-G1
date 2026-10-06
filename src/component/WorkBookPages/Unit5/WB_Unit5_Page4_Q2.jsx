import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/U1 WB/U5/U5P30EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U5/U5P30EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U5/U5P30EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U5/U5P30EXEH-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import posterAudio from "../../../assets/U1 WB/U5/audio/page_30_qH/Item_001_This_is_a_poster.mp3";

import bookAudio from "../../../assets/U1 WB/U5/audio/page_30_qH/Item_002_This_is_a_book.mp3";

import penAudio from "../../../assets/U1 WB/U5/audio/page_30_qH/Item_003_This_is_a_pen.mp3";

import globeAudio from "../../../assets/U1 WB/U5/audio/page_30_qH/Item_004_This_is_a_globe.mp3";

/* =====================================================
   DATA
===================================================== */

const sentenceData = [
  {
    id: "sentence-1",
    word: "This is a poster.",
    audio: posterAudio,
  },
  {
    id: "sentence-2",
    word: "This is a book.",
    audio: bookAudio,
  },
  {
    id: "sentence-3",
    word: "This is a pen.",
    audio: penAudio,
  },
  {
    id: "sentence-4",
    word: "This is a globe.",
    audio: globeAudio,
  },
];

const imageData = [
  {
    id: "img1",
    src: img1,
    alt: "An outline drawing of a pen.",
  },
  {
    id: "img2",
    src: img2,
    alt: "An outline drawing of a classroom poster with children.",
  },
  {
    id: "img3",
    src: img3,
    alt: "An outline drawing of a globe.",
  },
  {
    id: "img4",
    src: img4,
    alt: "An outline drawing of a book.",
  },
];

const correctMatches = [
  {
    word: "This is a poster.",
    image: "img2",
  },
  {
    word: "This is a book.",
    image: "img4",
  },
  {
    word: "This is a pen.",
    image: "img1",
  },
  {
    word: "This is a globe.",
    image: "img3",
  },
];

const COLORS = [
  {
    value: "red",
    label: "Red",
  },
  {
    value: "blue",
    label: "Blue",
  },
  {
    value: "yellow",
    label: "Yellow",
  },
  {
    value: "brown",
    label: "Brown",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit5_Page4_Q2 = () => {
  /* =================================================
     REFS
  ================================================= */

  const containerRef = useRef(null);

  const sentenceRefs = useRef({});
  const imageRefs = useRef({});

  const sentenceDotRefs = useRef({});
  const imageDotRefs = useRef({});

  const colorRefs = useRef({});

  const audioRef = useRef(null);

  /* =================================================
     SVG / COLOR STATE
  ================================================= */

  const [svgImages, setSvgImages] = useState({});

  const [imageColors, setImageColors] = useState({});

  const [activePalette, setActivePalette] = useState(null);

  /* =================================================
     MATCHING STATE
  ================================================= */

  const [lines, setLines] = useState([]);

  const [firstPoint, setFirstPoint] = useState(null);

  const [previewLine, setPreviewLine] = useState(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedWords, setLockedWords] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [selectedWord, setSelectedWord] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  /* =================================================
     AUDIO STATE
  ================================================= */

  const [playingWord, setPlayingWord] = useState(null);

  /* =================================================
     LOAD SVG FILES
  ================================================= */

  useEffect(() => {
    const loadSvgs = async () => {
      const files = {
        img1,
        img2,
        img3,
        img4,
      };

      const result = {};

      for (const key in files) {
        try {
          const text = await fetch(files[key]).then((response) =>
            response.text(),
          );

          /*
            نفس فكرتك الأصلية:
            نخلي الـSVG يعتمد currentColor
            حتى نقدر نلونه.
          */

          result[key] = text
            .replaceAll('fill="none"', 'fill="currentColor"')
            .replaceAll(/stroke="[^"]*"/g, 'stroke="currentColor"');
        } catch (error) {
          console.error(`Could not load ${key}`, error);
        }
      }

      setSvgImages(result);
    };

    loadSvgs();
  }, []);

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

  const playAudio = (word, src) => {
    if (!src) return;

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

  /* =================================================
     HELPERS
  ================================================= */

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (imageId) => {
    const pair = correctMatches.find((item) => item.image === imageId);

    return pair ? lockedWords.includes(pair.word) : false;
  };

  const getCenter = (element) => {
    if (!element || !containerRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    const rect = element.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,

      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  const getAvailableImages = () =>
    imageData
      .map((item) => item.id)
      .filter((imageId) => !isImageLocked(imageId));

  const getAvailableWords = () =>
    sentenceData.map((item) => item.word).filter((word) => !isWordLocked(word));

  const clearWrongWord = (word) => {
    setWrongWords((prev) => prev.filter((item) => item !== word));
  };

  /* =================================================
     COLOR PALETTE
  ================================================= */

  const openPalette = (imageId) => {
    setActivePalette(imageId);

    /*
      أهم نقطة:
      أول ما تنفتح بالكيبورد
      الفوكس يروح لأول لون.
    */

    window.setTimeout(() => {
      colorRefs.current[`${imageId}-0`]?.focus();
    }, 0);
  };

  const closePalette = (imageId, returnFocus = true) => {
    setActivePalette(null);

    if (returnFocus) {
      window.setTimeout(() => {
        imageRefs.current[imageId]?.focus();
      }, 0);
    }
  };

  const chooseColor = (imageId, color) => {
    setImageColors((prev) => ({
      ...prev,

      [imageId]: color,
    }));

    setActivePalette(null);

    window.setTimeout(() => {
      imageRefs.current[imageId]?.focus();
    }, 0);
  };

  /* =================================================
     FOCUS NEXT WORD
  ================================================= */

  const focusNextAvailableWord = (currentWord) => {
    const available = getAvailableWords().filter(
      (word) => word !== currentWord,
    );

    if (!available.length) {
      return;
    }

    window.setTimeout(() => {
      sentenceRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     COMMIT CONNECTION
  ================================================= */

  const commitConnection = ({ word, image, returnFocus = false }) => {
    if (
      showAnswer ||
      checkCompleted ||
      isWordLocked(word) ||
      isImageLocked(image)
    ) {
      return;
    }

    /*
      الخط دائمًا من DOT إلى DOT.
    */

    const start = getCenter(sentenceDotRefs.current[word]);

    const end = getCenter(imageDotRefs.current[image]);

    const newLine = {
      word,
      image,

      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,
    };

    /*
      one-to-one
    */

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== image),

      newLine,
    ]);

    clearWrongWord(word);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedWord(null);

    setSelectedImage(null);

    if (returnFocus) {
      focusNextAvailableWord(word);
    }
  };

  /* =================================================
     START FROM SENTENCE
  ================================================= */

  const startFromSentence = (item) => {
    const { word } = item;

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    const point = getCenter(sentenceDotRefs.current[word]);

    setFirstPoint({
      side: "word",
      word,
      x: point.x,
      y: point.y,
    });

    setSelectedWord(word);

    setSelectedImage(null);

    setPreviewLine(null);

    /*
    إذا كنت فاتح ألوان قبل
    سكرها لما تبدأ matching
  */

    setActivePalette(null);
  };
  /* =================================================
     START FROM IMAGE — MOUSE REVERSE
  ================================================= */

  const startFromImage = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    const point = getCenter(imageDotRefs.current[imageId]);

    setFirstPoint({
      side: "image",

      image: imageId,

      x: point.x,
      y: point.y,
    });

    setSelectedImage(imageId);

    setSelectedWord(null);

    setPreviewLine(null);
  };

  /* =================================================
     SENTENCE CLICK
     الجملة + الدوت نفس الوظيفة
  ================================================= */

  const handleSentenceClick = (item) => {
    const { word, audio } = item;

    /*
    الصوت دائمًا يشتغل
  */

    playAudio(word, audio);

    /*
    إذا مقفلة:
    صوت فقط
  */

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    /*
    إذا كنت بادئ من صورة
    كمل التوصيل
  */

    if (firstPoint?.side === "image") {
      commitConnection({
        word,
        image: firstPoint.image,
      });

      return;
    }

    /*
    اختيار الجملة كمصدر
  */

    startFromSentence(item);
  };

  /* =================================================
     SENTENCE KEYBOARD
  ================================================= */

  const handleSentenceKeyDown = (e, item) => {
    const { word, audio } = item;

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      الصوت دائمًا.
    */

    playAudio(word, audio);

    /*
      Locked = audio only
    */

    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    startFromSentence(item);

    /*
      بعد اختيار sentence:
      روح لأول صورة متاحة.
    */

    window.setTimeout(() => {
      const available = getAvailableImages();

      if (!available.length) {
        return;
      }

      imageRefs.current[available[0]]?.focus();
    }, 0);
  };

  /* =================================================
     IMAGE FOCUS PREVIEW
  ================================================= */

  const handleImageFocus = (imageId) => {
    if (!firstPoint || firstPoint.side !== "word") {
      return;
    }

    const end = getCenter(imageDotRefs.current[imageId]);

    setPreviewLine({
      x1: firstPoint.x,
      y1: firstPoint.y,

      x2: end.x,
      y2: end.y,
    });
  };

  /* =================================================
     IMAGE CLICK
  ================================================= */

  const handleImageClick = (imageId) => {
    /*
    =========================================
    1) إذا في جملة مختارة فوق
       الصورة تصير TARGET للتوصيل فقط
    =========================================
  */

    if (firstPoint?.side === "word") {
      if (showAnswer || checkCompleted || isImageLocked(imageId)) {
        return;
      }

      commitConnection({
        word: firstPoint.word,
        image: imageId,
      });

      return;
    }

    /*
    =========================================
    2) إذا البداية من صورة
       كمل منطق mouse reverse matching
    =========================================
  */

    if (firstPoint?.side === "image") {
      startFromImage(imageId);

      return;
    }

    /*
    =========================================
    3) ما في Matching شغال
       هون فقط نفتح التلوين
    =========================================
  */

    if (activePalette === imageId) {
      closePalette(imageId, false);
    } else {
      openPalette(imageId);
    }
  };
  /* =================================================
     IMAGE DOT CLICK

     الدوت هدف Matching فقط.
     ما بيفتح Palette.
  ================================================= */

  const handleImageDotClick = (imageId) => {
    if (showAnswer || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    if (firstPoint?.side === "word") {
      commitConnection({
        word: firstPoint.word,

        image: imageId,
      });

      return;
    }

    startFromImage(imageId);
  };

  /* =================================================
     IMAGE KEYBOARD
  ================================================= */

  const handleImageKeyDown = (e, imageId) => {
    /* =========================================
       ESCAPE FROM MATCHING
    ========================================= */

    if (e.key === "Escape" && firstPoint?.side === "word") {
      e.preventDefault();
      e.stopPropagation();

      const originalWord = firstPoint.word;

      setFirstPoint(null);

      setPreviewLine(null);

      setSelectedWord(null);

      setSelectedImage(null);

      window.setTimeout(() => {
        sentenceRefs.current[originalWord]?.focus();
      }, 0);

      return;
    }

    /* =========================================
       TAB BETWEEN TARGETS
    ========================================= */

    if (firstPoint?.side === "word" && e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableImages();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(imageId);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextImage = available[nextIndex];

      imageRefs.current[nextImage]?.focus();

      return;
    }

    /* =========================================
       ENTER / SPACE
    ========================================= */

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    /*
      Matching active:
      Enter يصل.
    */

    if (firstPoint?.side === "word") {
      commitConnection({
        word: firstPoint.word,

        image: imageId,

        returnFocus: true,
      });

      return;
    }

    /*
      لا يوجد matching:
      Enter/Space يفتح Palette
      ويروح لأول لون.
    */

    openPalette(imageId);
  };

  /* =================================================
     PALETTE KEYBOARD
  ================================================= */

  const handleColorKeyDown = (e, imageId, colorIndex) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      closePalette(imageId);

      return;
    }

    /*
      Arrow navigation داخل Palette
      زيادة accessibility.
    */

    if (
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowDown"
    ) {
      return;
    }

    e.preventDefault();

    const direction = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;

    const nextIndex = (colorIndex + direction + COLORS.length) % COLORS.length;

    colorRefs.current[`${imageId}-${nextIndex}`]?.focus();
  };

  /* =================================================
     CHECK ANSWERS
  ================================================= */

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

    const newlyLocked = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;

        newlyLocked.push(line.word);
      } else {
        wrong.push(line.word);
      }
    });

    /*
      Progressive locking
    */

    setLockedWords((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    setWrongWords(wrong);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedWord(null);

    setSelectedImage(null);

    setActivePalette(null);

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    const finalLines = correctMatches.map((pair) => {
      const start = getCenter(sentenceDotRefs.current[pair.word]);

      const end = getCenter(imageDotRefs.current[pair.image]);

      return {
        ...pair,

        x1: start.x,
        y1: start.y,

        x2: end.x,
        y2: end.y,
      };
    });

    setLines(finalLines);

    setWrongWords([]);

    setLockedWords(correctMatches.map((item) => item.word));

    setShowAnswer(true);

    setCheckCompleted(true);

    setFirstPoint(null);

    setPreviewLine(null);

    setSelectedWord(null);

    setSelectedImage(null);

    setActivePalette(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setLines([]);

    setWrongWords([]);

    setLockedWords([]);

    setFirstPoint(null);

    setPreviewLine(null);

    setShowAnswer(false);

    setCheckCompleted(false);

    setSelectedWord(null);

    setSelectedImage(null);

    setImageColors({});

    setActivePalette(null);
  };

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
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="H"
          title="Read, look, and match. Color."
          subTitle="Connect each sentence to the correct object, then color the object."
        />

        <div className="match-wrapper2 w-full" ref={containerRef}>
          {/* =================================================
              SENTENCES
          ================================================= */}

          <div className="match-words-row2">
            {sentenceData.map((item) => {
              const locked = isWordLocked(item.word);

              const wrong = wrongWords.includes(item.word);

              const playing = playingWord === item.word;

              return (
                <div className="word-box2" key={item.word}>
                  {/* =====================================
                        SENTENCE

                        تبقى Tab حتى بعد locked
                        عشان الصوت.
                    ===================================== */}

                  <h5
                    ref={(el) => {
                      sentenceRefs.current[item.word] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      locked || showAnswer || checkCompleted
                        ? `Play audio: ${item.word}`
                        : `${item.word} Press Enter or Space to start matching.`
                    }
                    className={`h5-wb-unit5-p4-q2 ${
                      selectedWord === item.word ? "selected-item" : ""
                    } ${locked || showAnswer ? "disabled-word" : ""}`}
                    onClick={() => handleSentenceClick(item)}
                    onKeyDown={(e) => handleSentenceKeyDown(e, item)}
                    style={{
                      position: "relative",

                      /*
                          حتى بعد locked
                          لسا في audio.
                        */
                      cursor: "pointer",

                      pointerEvents: "auto",
                    }}
                  >
                    {item.word}

                    {playing && (
                      <FaVolumeUp
                        size={16}
                        aria-hidden="true"
                        className="audio-icon-wb-u5-p4-q2"
                      />
                    )}

                    {wrong && (
                      <span className="error-mark-img" aria-hidden="true">
                        ✕
                      </span>
                    )}
                  </h5>

                  {/* =====================================
                        SENTENCE DOT

                        mouse clickable,
                        مش Tab target مستقل.
                    ===================================== */}

                  <div
                    ref={(el) => {
                      sentenceDotRefs.current[item.word] = el;
                    }}
                    className="dot22-unit6-q7 start-dot22-review8-p1-q3"
                    data-word={item.word}
                    onClick={() => handleSentenceClick(item)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              IMAGES
          ================================================= */}

          <div className="match-images-row2">
            {imageData.map((item) => {
              const locked = isImageLocked(item.id);

              /*
                  أثناء matching الصورة تدخل Tab.
                  خارج matching بتدخل Tab أيضًا
                  عشان coloring.
                */

              const imageTabIndex = 0;

              return (
                <div
                  className="img-box2"
                  key={item.id}
                  style={{
                    position: "relative",
                  }}
                >
                  {/* =====================================
                        COLORABLE SVG
                    ===================================== */}

                  {svgImages[item.id] && (
                    <div
                      ref={(el) => {
                        imageRefs.current[item.id] = el;
                      }}
                      className={`svg-wrapper img-box2-unit6-p6-q3 ${
                        selectedImage === item.id ? "selected-item" : ""
                      }`}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        firstPoint?.side === "word"
                          ? `${item.alt}. Click or press Enter to connect this picture.`
                          : `${item.alt}. Click or press Enter to choose a color.`
                      }
                      style={{
                        color: imageColors[item.id] || "#ffffff",

                        cursor: "pointer",
                      }}
                      onFocus={() => handleImageFocus(item.id)}
                      onClick={() => handleImageClick(item.id)}
                      onKeyDown={(e) => handleImageKeyDown(e, item.id)}
                    >
                      <div
                        role="img"
                        aria-label={item.alt}
                        dangerouslySetInnerHTML={{
                          __html: svgImages[item.id],
                        }}
                      />
                    </div>
                  )}

                  {/* =====================================
                        COLOR PALETTE
                    ===================================== */}

                  {activePalette === item.id && (
                    <div
                      className="color-palette-wb-unit5-p4-q2"
                      role="group"
                      aria-label={`Choose a color for ${item.alt}`}
                    >
                      {COLORS.map((color, colorIndex) => (
                        <button
                          key={color.value}
                          ref={(el) => {
                            colorRefs.current[`${item.id}-${colorIndex}`] = el;
                          }}
                          type="button"
                          className="color-circle"
                          style={{
                            backgroundColor: color.value,
                          }}
                          aria-label={color.label}
                          onClick={() => chooseColor(item.id, color.value)}
                          onKeyDown={(e) =>
                            handleColorKeyDown(e, item.id, colorIndex)
                          }
                        />
                      ))}
                    </div>
                  )}

                  {/* =====================================
                        IMAGE DOT

                        Mouse matching فقط.
                    ===================================== */}

                  <div
                    ref={(el) => {
                      imageDotRefs.current[item.id] = el;
                    }}
                    className="dot22-unit6-q7 end-dot22-unit6-q7"
                    data-image={item.id}
                    onClick={() => handleImageDotClick(item.id)}
                    role="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                  />
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

              {/* =============================================
                  KEYBOARD PREVIEW
              ============================================= */}

              {previewLine && (
                <line
                  x1={previewLine.x1}
                  y1={previewLine.y1}
                  x2={previewLine.x2}
                  y2={previewLine.y2}
                  stroke="red"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              )}
            </svg>
          </div>
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

export default WB_Unit5_Page4_Q2;
