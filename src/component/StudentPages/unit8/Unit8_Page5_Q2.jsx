import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/unit8/imgs/U8P68EXEA2-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P68EXEA2-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P68EXEA2-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P68EXEA2-04.svg";

import sound1 from "../../../assets/unit8/sound/U8P68EXEA2.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Unit8_Page5_Q2.css";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   DATA
===================================================== */

const IMAGES = [
  {
    id: "img1",
    src: img1,
    alt: "A sandwich.",
    correct: "s",
  },

  {
    id: "img2",
    src: img2,
    alt: "A sponge.",
    correct: "s",
  },

  {
    id: "img3",
    src: img3,
    alt: "The number zero.",
    correct: "z",
  },

  {
    id: "img4",
    src: img4,
    alt: "A bowl of soup.",
    correct: "s",
  },
];

const WORDS = ["s", "z"];

/* =====================================================
   CORRECT MATCHES

   many-to-one:
   s => img1 + img2 + img4
   z => img3
===================================================== */

const CORRECT_MATCHES = [
  {
    image: "img1",
    word: "s",
  },

  {
    image: "img2",
    word: "s",
  },

  {
    image: "img3",
    word: "z",
  },

  {
    image: "img4",
    word: "s",
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

const Unit8_Page5_Q2 = () => {
  /* =====================================================
     AUDIO PLAYER
  ===================================================== */

  const stopAtSecond = 12.08;

  const captions = [
    {
      start: 0,
      end: 6.22,
      text: "Page 68. Right activities. Exercise A, number two.",
    },

    {
      start: 6.25,
      end: 12.15,
      text: "Does it begin with S or Z? Listen and match.",
    },

    {
      start: 12.17,
      end: 14.23,
      text: "1-sandwich ",
    },

    {
      start: 14.25,
      end: 17.0,
      text: "2-sponge",
    },

    {
      start: 17.03,
      end: 19.07,
      text: "3-zero",
    },

    {
      start: 19.1,
      end: 21.24,
      text: "4-soup",
    },
  ];

  /* =====================================================
     LINES
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [svgLines, setSvgLines] = useState([]);

  /* =====================================================
     SELECTED ENDPOINT - MOUSE
  ===================================================== */

  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  /*
    {
      side: "image" | "word",
      id: "img1" | "s"
    }
  */

  /* =====================================================
     KEYBOARD MATCHING
  ===================================================== */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  const [keyboardOrigin, setKeyboardOrigin] = useState(null);

  const [focusedTarget, setFocusedTarget] = useState(null);

  const [previewLine, setPreviewLine] = useState(null);

  /* =====================================================
     CHECK
  ===================================================== */

  const [lockedImages, setLockedImages] = useState([]);

  const [wrongImages, setWrongImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     REFS
  ===================================================== */

  const containerRef = useRef(null);

  const dotRefs = useRef({});

  const imageRefs = useRef({});

  const wordRefs = useRef({});

  /* =====================================================
     HELPERS
  ===================================================== */

  const isImageLocked = (imageId) => lockedImages.includes(imageId);

  const getLineByImage = (imageId) =>
    lines.find((line) => line.image === imageId);

  const getLinesByWord = (word) => lines.filter((line) => line.word === word);

  const registerDot = (key, element) => {
    if (element) {
      dotRefs.current[key] = element;
    }
  };

  /* =====================================================
     AVAILABLE TARGETS

     بما إنه many-to-one:
     - image -> كل الكلمات s/z
     - word -> كل الصور الغير locked
  ===================================================== */

  const getAvailableTargets = (origin) => {
    if (!origin) {
      return [];
    }

    /* =============================================
       IMAGE -> WORD
    ============================================= */

    if (origin.side === "image") {
      return WORDS;
    }

    /* =============================================
       WORD -> IMAGE
    ============================================= */

    return IMAGES.filter((item) => !isImageLocked(item.id)).map(
      (item) => item.id,
    );
  };

  /* =====================================================
     COMMIT MATCH
  ===================================================== */

  const commitMatch = (imageId, word) => {
    if (
      !imageId ||
      !word ||
      showAnswer ||
      checkCompleted ||
      isImageLocked(imageId)
    ) {
      return;
    }

    /*
      MANY TO ONE:
      نشيل فقط التوصيلة القديمة لنفس الصورة.
      ما بنشيل أي خطوط ثانية من نفس s أو z.
    */

    setLines((prev) => [
      ...prev.filter((line) => line.image !== imageId),

      {
        image: imageId,
        word,
      },
    ]);

    /*
      تعديل نفس الصورة
      يشيل X عنها فقط.
    */

    setWrongImages((prev) => prev.filter((id) => id !== imageId));

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);
  };

  /* =====================================================
     MOUSE CLICK - BOTH DIRECTIONS
  ===================================================== */

  const handleEndpointClick = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "image" && isImageLocked(id)) {
      return;
    }

    /* Mouse mode */

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);

    /* =============================================
       NOTHING SELECTED
    ============================================= */

    if (!selectedEndpoint) {
      setSelectedEndpoint({
        side,
        id,
      });

      return;
    }

    /* =============================================
       SAME SIDE
       => change selected endpoint
    ============================================= */

    if (selectedEndpoint.side === side) {
      if (selectedEndpoint.id === id) {
        setSelectedEndpoint(null);
      } else {
        setSelectedEndpoint({
          side,
          id,
        });
      }

      return;
    }

    /* =============================================
       COMPLETE
    ============================================= */

    const imageId = side === "image" ? id : selectedEndpoint.id;

    const word = side === "word" ? id : selectedEndpoint.id;

    commitMatch(imageId, word);
  };

  /* =====================================================
     START KEYBOARD MATCH
     BOTH DIRECTIONS
  ===================================================== */

  const startKeyboardMatch = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "image" && isImageLocked(id)) {
      return;
    }

    const origin = {
      side,
      id,
    };

    setSelectedEndpoint(null);

    setKeyboardMatching(true);

    setKeyboardOrigin(origin);

    setFocusedTarget(null);

    setPreviewLine(null);

    const available = getAvailableTargets(origin);

    if (!available.length) {
      return;
    }

    window.setTimeout(() => {
      if (side === "image") {
        wordRefs.current[available[0]]?.focus();
      } else {
        imageRefs.current[available[0]]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     UPDATE PREVIEW
  ===================================================== */

  const updatePreviewLine = (targetSide, targetId) => {
    if (!keyboardMatching || !keyboardOrigin || !containerRef.current) {
      setPreviewLine(null);

      return;
    }

    const originKey =
      keyboardOrigin.side === "image"
        ? `image-${keyboardOrigin.id}`
        : `word-${keyboardOrigin.id}`;

    const targetKey =
      targetSide === "image" ? `image-${targetId}` : `word-${targetId}`;

    const originElement = dotRefs.current[originKey];

    const targetElement = dotRefs.current[targetKey];

    const p1 = getCenter(originElement, containerRef.current);

    const p2 = getCenter(targetElement, containerRef.current);

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

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleEndpointKeyDown = (e, side, id) => {
    /* =============================================
       NOT MATCHING YET
    ============================================= */

    if (!keyboardMatching) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        e.stopPropagation();

        startKeyboardMatch(side, id);
      }

      return;
    }

    /*
      العنصر الحالي لازم يكون بالطرف المقابل
      مش نفس side تبع origin.
    */

    if (keyboardOrigin?.side === side) {
      return;
    }

    /* =============================================
       TAB / SHIFT TAB
    ============================================= */

    if (e.key === "Tab") {
      e.preventDefault();

      e.stopPropagation();

      const available = getAvailableTargets(keyboardOrigin);

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(id);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const next = available[nextIndex];

      if (keyboardOrigin.side === "image") {
        wordRefs.current[next]?.focus();
      } else {
        imageRefs.current[next]?.focus();
      }

      return;
    }

    /* =============================================
       ENTER / SPACE = COMMIT
    ============================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      const imageId = side === "image" ? id : keyboardOrigin.id;

      const word = side === "word" ? id : keyboardOrigin.id;

      const origin = keyboardOrigin;

      commitMatch(imageId, word);

      /*
        رجع focus للأصل.
      */

      window.setTimeout(() => {
        if (origin.side === "image") {
          imageRefs.current[origin.id]?.focus();
        } else {
          wordRefs.current[origin.id]?.focus();
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

      const origin = keyboardOrigin;

      setKeyboardMatching(false);

      setKeyboardOrigin(null);

      setFocusedTarget(null);

      setPreviewLine(null);

      window.setTimeout(() => {
        if (origin.side === "image") {
          imageRefs.current[origin.id]?.focus();
        } else {
          wordRefs.current[origin.id]?.focus();
        }
      }, 0);
    }
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers2 = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (lines.length < IMAGES.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    IMAGES.forEach((item) => {
      if (isImageLocked(item.id)) {
        correctCount++;

        return;
      }

      const line = getLineByImage(item.id);

      if (line?.word === item.correct) {
        correctCount++;

        newlyLocked.push(item.id);
      } else {
        wrong.push(item.id);
      }
    });

    /* =============================================
       PROGRESSIVE LOCK
    ============================================= */

    setLockedImages((prev) => [...new Set([...prev, ...newlyLocked])]);

    setWrongImages(wrong);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);

    const total = IMAGES.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div
        style="
          font-size:20px;
          margin-top:10px;
          text-align:center;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedImages(IMAGES.map((item) => item.id));

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
    setLines(
      CORRECT_MATCHES.map((item) => ({
        ...item,
      })),
    );

    setLockedImages(IMAGES.map((item) => item.id));

    setWrongImages([]);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setLines([]);

    setSvgLines([]);

    setLockedImages([]);

    setWrongImages([]);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  /* =====================================================
     COMPUTE SVG LINES
  ===================================================== */

  const recomputeLines = () => {
    if (!containerRef.current) {
      return;
    }

    const computed = lines
      .map((line) => {
        const imageDot = dotRefs.current[`image-${line.image}`];

        const wordDot = dotRefs.current[`word-${line.word}`];

        const p1 = getCenter(imageDot, containerRef.current);

        const p2 = getCenter(wordDot, containerRef.current);

        if (!p1 || !p2) {
          return null;
        }

        return {
          ...line,

          x1: p1.x,
          y1: p1.y,

          x2: p2.x,
          y2: p2.y,
        };
      })
      .filter(Boolean);

    setSvgLines(computed);
  };

  useEffect(() => {
    recomputeLines();
  }, [lines, lockedImages, wrongImages]);

  useEffect(() => {
    const handleResize = () => {
      recomputeLines();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
          gap: "15px",
        }}
      >
        <ExerciseHeader
          questionNumber="2"
          title={
            <>
              Does it begin with{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                s
              </span>{" "}
              or{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                z
              </span>
              ? Listen and match.
            </>
          }
          subTitle="Listen to each picture name, then match it to s or z."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit8-page68-qA2"
        />

        {/* =================================================
            MATCH AREA
        ================================================= */}

        <div
          className="match-wrapper2-unit8-p5-q2 w-full"
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
              const locked = isImageLocked(item.id);

              const mouseSelected =
                selectedEndpoint?.side === "image" &&
                selectedEndpoint?.id === item.id;

              const keyboardSelected =
                keyboardOrigin?.side === "image" &&
                keyboardOrigin?.id === item.id;

              const wrong = wrongImages.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="img-box2"
                  style={{
                    position: "relative",
                  }}
                >
                  <img
                    ref={(element) => {
                      imageRefs.current[item.id] = element;
                    }}
                    src={item.src}
                    alt={item.alt}
                    role="button"
                    tabIndex={locked || showAnswer || checkCompleted ? -1 : 0}
                    aria-label={`${item.alt} Press Enter or Space to start matching.`}
                    className={[
                      "matched-img2",

                      mouseSelected || keyboardSelected ? "selected-item" : "",

                      locked ? "disabled-hover" : "",
                    ]
                      .join(" ")
                      .trim()}
                    onClick={() => handleEndpointClick("image", item.id)}
                    onFocus={() => {
                      if (keyboardMatching && keyboardOrigin?.side === "word") {
                        setFocusedTarget(item.id);

                        updatePreviewLine("image", item.id);
                      }
                    }}
                    onKeyDown={(e) =>
                      handleEndpointKeyDown(e, "image", item.id)
                    }
                  />

                  {/* WRONG X */}

                  {wrong && (
                    <span className="error-mark-img" aria-hidden="true">
                      ✕
                    </span>
                  )}

                  {/* DOT */}

                  <div
                    ref={(element) => registerDot(`image-${item.id}`, element)}
                    className={[
                      "dot2-unit2",
                      "start-dot2-unit2",

                      mouseSelected || keyboardSelected
                        ? "dot-active-unit8-p5-q2"
                        : "",
                    ]
                      .join(" ")
                      .trim()}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => {
                      if (!locked) {
                        handleEndpointClick("image", item.id);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              WORDS
          ================================================= */}

          <div className="match-words-row2">
            {WORDS.map((word) => {
              const mouseSelected =
                selectedEndpoint?.side === "word" &&
                selectedEndpoint?.id === word;

              const keyboardSelected =
                keyboardOrigin?.side === "word" && keyboardOrigin?.id === word;

              return (
                <div key={word} className="word-box2">
                  <h5
                    ref={(element) => {
                      wordRefs.current[word] = element;
                    }}
                    role="button"
                    tabIndex={showAnswer || checkCompleted ? -1 : 0}
                    aria-label={`Letter ${word}. Press Enter or Space to start matching.`}
                    className={[
                      "clickable-word-unit2-p7-q2",

                      mouseSelected || keyboardSelected
                        ? "selected-letter-unit8-p5-q2"
                        : "",
                    ]
                      .join(" ")
                      .trim()}
                    onClick={() => handleEndpointClick("word", word)}
                    onFocus={() => {
                      if (
                        keyboardMatching &&
                        keyboardOrigin?.side === "image"
                      ) {
                        setFocusedTarget(word);

                        updatePreviewLine("word", word);
                      }
                    }}
                    onKeyDown={(e) => handleEndpointKeyDown(e, "word", word)}
                    style={{
                      border: "2px solid red",

                      borderRadius: "8px",

                      background: "#ffb4b4ff",

                      height: "30px",

                      width: "60px",

                      display: "flex",

                      justifyContent: "center",

                      marginTop: "10px",

                      alignItems: "center",

                      cursor: "pointer",
                    }}
                  >
                    {word}
                  </h5>

                  <div
                    ref={(element) => registerDot(`word-${word}`, element)}
                    className={[
                      "dot2-unit2",
                      "end-dot2-unit2",

                      mouseSelected || keyboardSelected
                        ? "dot-active-unit8-p5-q2"
                        : "",
                    ]
                      .join(" ")
                      .trim()}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => handleEndpointClick("word", word)}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              SVG
          ================================================= */}

          <svg
            className="lines-layer2"
            style={{
              pointerEvents: "none",
            }}
          >
            {/* PERMANENT LINES */}

            {svgLines.map((line, index) => (
              <line
                key={`${line.image}-${line.word}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}

            {/* KEYBOARD PREVIEW */}

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

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
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

export default Unit8_Page5_Q2;
