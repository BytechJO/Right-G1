import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/unit8/imgs/U8P70EXEB-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P70EXEB-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P70EXEB-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P70EXEB-04.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Review7_Page1_Q2.css";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import boredAudio from "../../../assets/unit8/sound/Page 70 - B/I'm bored..mp3";
import happyAudio from "../../../assets/unit8/sound/Page 70 - B/I'm happy..mp3";
import hungryAudio from "../../../assets/unit8/sound/Page 70 - B/I'm hungry..mp3";
import scaredAudio from "../../../assets/unit8/sound/Page 70 - B/I'm scared..mp3";

/* =====================================================
   DATA
===================================================== */

const IMAGES = [
  {
    id: "img1",
    src: img1,
    label: "1",
    alt: "A hungry boy thinking about a sandwich.",
  },

  {
    id: "img2",
    src: img2,
    label: "2",
    alt: "A girl looking scared because a spider is near her.",
  },

  {
    id: "img3",
    src: img3,
    label: "3",
    alt: "A boy sitting with a bored expression.",
  },

  {
    id: "img4",
    src: img4,
    label: "4",
    alt: "A happy girl smiling.",
  },
];

const WORDS = [
  {
    text: "I'm scared.",
    audio: scaredAudio,
  },

  {
    text: "I'm happy.",
    audio: happyAudio,
  },

  {
    text: "I'm bored.",
    audio: boredAudio,
  },

  {
    text: "I'm hungry.",
    audio: hungryAudio,
  },
];

const CORRECT_MATCHES = [
  {
    image: "img1",
    word: "I'm hungry.",
  },

  {
    image: "img2",
    word: "I'm scared.",
  },

  {
    image: "img3",
    word: "I'm bored.",
  },

  {
    image: "img4",
    word: "I'm happy.",
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

const Review7_Page1_Q2 = () => {
  /* =====================================================
     CONNECTIONS
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [svgLines, setSvgLines] = useState([]);

  /* =====================================================
     MOUSE SELECTION
  ===================================================== */

  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  /*
    {
      side: "image" | "word",
      id: ...
    }
  */

  /* =====================================================
     PROGRESSIVE CHECK
  ===================================================== */

  const [lockedImages, setLockedImages] = useState([]);

  const [wrongImages, setWrongImages] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     KEYBOARD MATCHING
  ===================================================== */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  const [keyboardOrigin, setKeyboardOrigin] = useState(null);

  const [focusedTarget, setFocusedTarget] = useState(null);

  const [previewLine, setPreviewLine] = useState(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  /* =====================================================
     REFS
  ===================================================== */

  const containerRef = useRef(null);

  const dotRefs = useRef({});

  const imageRefs = useRef({});

  const wordRefs = useRef({});

  /* =====================================================
     LOOKUPS
  ===================================================== */

  const imageToWord = Object.fromEntries(
    lines.map((line) => [line.image, line.word]),
  );

  const wordToImage = Object.fromEntries(
    lines.map((line) => [line.word, line.image]),
  );

  /* =====================================================
     HELPERS
  ===================================================== */

  const isImageLocked = (imageId) => lockedImages.includes(imageId);

  const getWordData = (text) => WORDS.find((item) => item.text === text);

  const isWordLocked = (word) => {
    const imageId = wordToImage[word];

    return imageId ? isImageLocked(imageId) : false;
  };

  const registerDot = (key, element) => {
    if (element) {
      dotRefs.current[key] = element;
    }
  };

  /* =====================================================
     AUDIO
  ===================================================== */

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

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  /* =====================================================
     AVAILABLE TARGETS

     connected wrong target remains available
     correct locked target is skipped
  ===================================================== */

  const getAvailableTargets = (origin) => {
    if (!origin) {
      return [];
    }

    /* =============================================
       IMAGE -> WORD
    ============================================= */

    if (origin.side === "image") {
      return WORDS.filter((item) => {
        const connectedImage = wordToImage[item.text];

        if (!connectedImage) {
          return true;
        }

        if (connectedImage === origin.id) {
          return true;
        }

        return !isImageLocked(connectedImage);
      }).map((item) => item.text);
    }

    /* =============================================
       WORD -> IMAGE
    ============================================= */

    return IMAGES.filter((item) => {
      if (!imageToWord[item.id]) {
        return true;
      }

      if (imageToWord[item.id] === origin.id) {
        return true;
      }

      return !isImageLocked(item.id);
    }).map((item) => item.id);
  };

  /* =====================================================
     COMMIT CONNECTION
  ===================================================== */

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

    const existingTargetImage = lines.find((line) => line.word === word)?.image;

    /*
      إذا الكلمة موصولة بصورة ثانية
      وصارت صح locked بعد Check
      ممنوع ناخذها منها.
    */

    if (
      existingTargetImage &&
      existingTargetImage !== imageId &&
      isImageLocked(existingTargetImage)
    ) {
      return;
    }

    /*
      ONE TO ONE:
      شيل توصيل الصورة القديم
      وشيل توصيل الكلمة القديم
      ثم حط الجديد.
    */

    setLines((prev) => [
      ...prev.filter((line) => line.image !== imageId && line.word !== word),

      {
        image: imageId,
        word,
      },
    ]);

    /*
      إذا displaced image كانت غلط
      شيل X عنها لأنها صارت بدون connection.
    */

    setWrongImages((prev) =>
      prev.filter((id) => id !== imageId && id !== existingTargetImage),
    );

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);
  };

  /* =====================================================
     MOUSE MATCH - BOTH SIDES
  ===================================================== */

  const handleEndpointClick = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "image" && isImageLocked(id)) {
      return;
    }

    if (side === "word" && isWordLocked(id)) {
      /*
        الكلمة الصح المقفولة:
        matching ممنوع،
        لكن الصوت بنشغله بمكان الـword click.
      */

      return;
    }

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);

    /* =============================================
       FIRST ENDPOINT
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
       COMPLETE CONNECTION
    ============================================= */

    const imageId = side === "image" ? id : selectedEndpoint.id;

    const word = side === "word" ? id : selectedEndpoint.id;

    commitConnection(imageId, word);
  };

  /* =====================================================
     START KEYBOARD MATCH
     FROM EITHER SIDE
  ===================================================== */

  const startKeyboardMatch = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "image" && isImageLocked(id)) {
      return;
    }

    if (side === "word" && isWordLocked(id)) {
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
     PREVIEW LINE
  ===================================================== */

  const updatePreviewLine = (targetSide, targetId) => {
    if (!keyboardMatching || !keyboardOrigin || !containerRef.current) {
      setPreviewLine(null);

      return;
    }

    const originKey =
      keyboardOrigin.side === "image"
        ? `img-${keyboardOrigin.id}`
        : `word-${keyboardOrigin.id}`;

    const targetKey =
      targetSide === "image" ? `img-${targetId}` : `word-${targetId}`;

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
     KEYBOARD ENDPOINT
  ===================================================== */

  const handleEndpointKeyDown = (e, side, id) => {
    /* =============================================
       NOT MATCHING YET
    ============================================= */

    if (!keyboardMatching) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        e.stopPropagation();

        /*
          word:
          audio + matching إذا مش locked
        */

        if (side === "word") {
          playAudio(id);

          if (!isWordLocked(id)) {
            startKeyboardMatch(side, id);
          }

          return;
        }

        startKeyboardMatch(side, id);
      }

      return;
    }

    /*
      matching active:
      نتحرك فقط بالطرف المقابل.
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

      if (side === "word") {
        playAudio(id);
      }

      const imageId = side === "image" ? id : keyboardOrigin.id;

      const word = side === "word" ? id : keyboardOrigin.id;

      const origin = keyboardOrigin;

      commitConnection(imageId, word);

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
     CHECK
  ===================================================== */

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
      if (isImageLocked(correct.image)) {
        correctCount++;

        return;
      }

      const userLine = lines.find((line) => line.image === correct.image);

      if (userLine?.word === correct.word) {
        correctCount++;

        newlyLocked.push(correct.image);
      } else {
        wrong.push(correct.image);
      }
    });

    /* =============================================
       LOCK CORRECT ONLY
    ============================================= */

    setLockedImages((prev) => [...new Set([...prev, ...newlyLocked])]);

    setWrongImages(wrong);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

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
      setLockedImages(IMAGES.map((item) => item.id));

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

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    setLines(
      CORRECT_MATCHES.map((item) => ({
        ...item,
      })),
    );

    setWrongImages([]);

    setLockedImages(IMAGES.map((item) => item.id));

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

  const reset = () => {
    stopAudio();

    setLines([]);

    setSvgLines([]);

    setWrongImages([]);

    setLockedImages([]);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  /* =====================================================
     SVG LINES
  ===================================================== */

  const recomputeLines = () => {
    if (!containerRef.current) {
      return;
    }

    const computed = lines
      .map((line) => {
        const imgEl = dotRefs.current[`img-${line.image}`];

        const wordEl = dotRefs.current[`word-${line.word}`];

        if (!imgEl || !wordEl) {
          return null;
        }

        const p1 = getCenter(imgEl, containerRef.current);

        const p2 = getCenter(wordEl, containerRef.current);

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

    if (keyboardMatching && keyboardOrigin && focusedTarget) {
      updatePreviewLine(
        keyboardOrigin.side === "image" ? "word" : "image",

        focusedTarget,
      );
    }
  };

  useEffect(() => {
    recomputeLines();
  }, [lines, lockedImages, wrongImages, keyboardMatching, focusedTarget]);

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
          gap: "50px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="B"
          title="Look, read, and match."
          subTitle="Match scared, happy, bored, and hungry to the correct pictures."
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
              const locked = isImageLocked(item.id);

              const connected = !!imageToWord[item.id];

              const selected =
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
                      "matched-img",

                      selected || keyboardSelected ? "selected-match-item" : "",

                      connected ? "connected-match-item" : "",

                      locked ? "disabled-hover" : "",
                    ]
                      .join(" ")
                      .trim()}
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
                    onFocus={() => {
                      if (keyboardMatching && keyboardOrigin?.side === "word") {
                        setFocusedTarget(item.id);

                        updatePreviewLine("image", item.id);
                      }
                    }}
                    onClick={() => handleEndpointClick("image", item.id)}
                    onKeyDown={(e) =>
                      handleEndpointKeyDown(e, "image", item.id)
                    }
                  />

                  {/* WRONG X */}

                  {wrong && (
                    <span
                      className="error-mark-img-unit7-p6-q2"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}

                  {/* DOT */}

                  <div
                    ref={(element) => registerDot(`img-${item.id}`, element)}
                    className={[
                      "dot22-unit7-p6-q2",

                      "start-dot22-unit7-p6-q2",

                      selected || keyboardSelected ? "dot-active" : "",

                      connected ? "dot-connected" : "",
                    ]
                      .join(" ")
                      .trim()}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{
                      cursor: locked ? "default" : "pointer",
                    }}
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
            {WORDS.map((item) => {
              const word = item.text;

              const connectedImage = wordToImage[word];

              const connected = !!connectedImage;

              const wordLocked = isWordLocked(word);

              const selected =
                selectedEndpoint?.side === "word" &&
                selectedEndpoint?.id === word;

              const keyboardSelected =
                keyboardOrigin?.side === "word" && keyboardOrigin?.id === word;

              const playing = playingWord === word;

              return (
                <div key={word} className="word-box2">
                  {/* DOT */}

                  <div
                    ref={(element) => registerDot(`word-${word}`, element)}
                    className={[
                      "dot22-unit7-p6-q2",

                      "end-dot22-unit7-p6-q2",

                      connected ? "dot-connected" : "",

                      selected || keyboardSelected ? "dot-active" : "",
                    ]
                      .join(" ")
                      .trim()}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => {
                      if (wordLocked) {
                        playAudio(word);

                        return;
                      }

                      handleEndpointClick("word", word);
                    }}
                  />

                  {/* WORD + AUDIO */}

                  <h5
                    ref={(element) => {
                      wordRefs.current[word] = element;
                    }}
                    role="button"
                    /*
                        مهم:
                        حتى correct locked
                        يضل Tab reachable للصوت.
                      */

                    tabIndex={0}
                    aria-label={
                      wordLocked
                        ? `${word}. Press Enter or Space to hear it.`
                        : keyboardMatching
                          ? `${word}. Press Enter or Space to connect it to the selected picture.`
                          : `${word}. Press Enter or Space to hear it and start matching.`
                    }
                    className={[
                      "h5-unit6-p5-q2",

                      connected ? "connected-match-item" : "",

                      selected || keyboardSelected ? "selected-match-item" : "",
                    ]
                      .join(" ")
                      .trim()}
                    style={{
                      cursor: "pointer",

                      position: "relative",
                    }}
                    onFocus={() => {
                      if (
                        keyboardMatching &&
                        keyboardOrigin?.side === "image"
                      ) {
                        setFocusedTarget(word);

                        updatePreviewLine("word", word);
                      }
                    }}
                    onClick={() => {
                      /*
                          الجملة دائمًا تشغل الصوت.
                        */

                      playAudio(word);

                      /*
                          correct locked:
                          audio only.
                        */

                      if (wordLocked) {
                        return;
                      }

                      handleEndpointClick("word", word);
                    }}
                    onKeyDown={(e) => handleEndpointKeyDown(e, "word", word)}
                  >
                    {word}

                    {playing && (
                      <FaVolumeUp
                        size={14}
                        aria-hidden="true"
                        className="audio-icon-review7-p1-q2"
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
            {/* PERMANENT */}

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

export default Review7_Page1_Q2;
