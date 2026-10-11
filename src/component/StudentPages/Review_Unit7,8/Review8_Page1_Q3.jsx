import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/unit8/imgs/U8P72EXEC-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P72EXEC-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P72EXEC-03.svg";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Review8_Page1_Q3.css";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import bendMyKneeAudio from "../../../assets/unit8/sound/Page 72 - C/Bend my knee..mp3";

import raiseYourHandAudio from "../../../assets/unit8/sound/Page 72 - C/Raise your hand..mp3";

import touchYourHeadAudio from "../../../assets/unit8/sound/Page 72 - C/Touch your head..mp3";

/* =====================================================
   DATA
===================================================== */

const WORDS = [
  {
    id: "Bend my knee.",
    text: "Bend my knee.",
    number: 1,
    audio: bendMyKneeAudio,
  },

  {
    id: "Touch your head.",
    text: "Touch your head.",
    number: 2,
    audio: touchYourHeadAudio,
  },

  {
    id: "Raise your hand.",
    text: "Raise your hand.",
    number: 3,
    audio: raiseYourHandAudio,
  },
];

const IMAGES = [
  {
    id: "img1",
    src: img1,
    alt: "A boy raising one hand.",
  },

  {
    id: "img2",
    src: img2,
    alt: "A girl bending one knee.",
  },

  {
    id: "img3",
    src: img3,
    alt: "A boy touching his head.",
  },
];

const CORRECT_MATCHES = [
  {
    word: "Bend my knee.",
    image: "img2",
  },

  {
    word: "Touch your head.",
    image: "img3",
  },

  {
    word: "Raise your hand.",
    image: "img1",
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

const Review8_Page1_Q3 = () => {
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
      side: "word" | "image",
      id: ...
    }
  */

  /* =====================================================
     PROGRESSIVE LOCK
  ===================================================== */

  const [lockedWords, setLockedWords] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

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

  const wordRefs = useRef({});

  const imageRefs = useRef({});

  /* =====================================================
     LOOKUPS
  ===================================================== */

  const wordToImage = Object.fromEntries(
    lines.map((line) => [line.word, line.image]),
  );

  const imageToWord = Object.fromEntries(
    lines.map((line) => [line.image, line.word]),
  );

  /* =====================================================
     HELPERS
  ===================================================== */

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (imageId) => {
    const word = imageToWord[imageId];

    return word ? isWordLocked(word) : false;
  };

  const getWordData = (word) => WORDS.find((item) => item.id === word);

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
       WORD -> IMAGE
    ============================================= */

    if (origin.side === "word") {
      return IMAGES.filter((item) => {
        const connectedWord = imageToWord[item.id];

        if (!connectedWord) {
          return true;
        }

        if (connectedWord === origin.id) {
          return true;
        }

        return !isWordLocked(connectedWord);
      }).map((item) => item.id);
    }

    /* =============================================
       IMAGE -> WORD
    ============================================= */

    return WORDS.filter((item) => {
      const connectedImage = wordToImage[item.id];

      if (!connectedImage) {
        return true;
      }

      if (connectedImage === origin.id) {
        return true;
      }

      return !isWordLocked(item.id);
    }).map((item) => item.id);
  };

  /* =====================================================
     COMMIT CONNECTION
  ===================================================== */

  const commitConnection = (word, imageId) => {
    if (
      !word ||
      !imageId ||
      showAnswer ||
      checkCompleted ||
      isWordLocked(word)
    ) {
      return;
    }

    const existingWordOnImage = lines.find(
      (line) => line.image === imageId,
    )?.word;

    /*
      target image مربوط بتوصيلة
      correct + locked
      => ممنوع نستبدلها
    */

    if (
      existingWordOnImage &&
      existingWordOnImage !== word &&
      isWordLocked(existingWordOnImage)
    ) {
      return;
    }

    /* =================================================
       ONE TO ONE

       نشيل:
       - خط قديم لنفس word
       - خط قديم لنفس image
    ================================================= */

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== imageId),

      {
        word,
        image: imageId,
      },
    ]);

    /*
      شيل X عن المصدر المعدل
      وعن المصدر القديم اللي انزاح.
    */

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== existingWordOnImage),
    );

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);
  };

  /* =====================================================
     MOUSE
     FROM BOTH SIDES
  ===================================================== */

  const handleEndpointClick = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "word" && isWordLocked(id)) {
      return;
    }

    if (side === "image" && isImageLocked(id)) {
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
       COMPLETE
    ============================================= */

    const word = side === "word" ? id : selectedEndpoint.id;

    const imageId = side === "image" ? id : selectedEndpoint.id;

    commitConnection(word, imageId);
  };

  /* =====================================================
     START KEYBOARD MATCH
     FROM BOTH SIDES
  ===================================================== */

  const startKeyboardMatch = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "word" && isWordLocked(id)) {
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
      if (side === "word") {
        imageRefs.current[available[0]]?.focus();
      } else {
        wordRefs.current[available[0]]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     UPDATE PREVIEW LINE
  ===================================================== */

  const updatePreviewLine = (targetSide, targetId) => {
    if (!keyboardMatching || !keyboardOrigin || !containerRef.current) {
      setPreviewLine(null);

      return;
    }

    const originKey =
      keyboardOrigin.side === "word"
        ? `word-${keyboardOrigin.id}`
        : `image-${keyboardOrigin.id}`;

    const targetKey =
      targetSide === "word" ? `word-${targetId}` : `image-${targetId}`;

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
       NOT MATCHING
    ============================================= */

    if (!keyboardMatching) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        e.stopPropagation();

        /*
          sentence:
          audio + start matching
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
      لما matching شغال،
      بنتعامل فقط مع الطرف المقابل.
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

      if (keyboardOrigin.side === "word") {
        imageRefs.current[next]?.focus();
      } else {
        wordRefs.current[next]?.focus();
      }

      return;
    }

    /* =============================================
       ENTER / SPACE COMMIT
    ============================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      if (side === "word") {
        playAudio(id);
      }

      const word = side === "word" ? id : keyboardOrigin.id;

      const imageId = side === "image" ? id : keyboardOrigin.id;

      const origin = keyboardOrigin;

      commitConnection(word, imageId);

      /*
        رجع focus للأصل.
      */

      window.setTimeout(() => {
        if (origin.side === "word") {
          wordRefs.current[origin.id]?.focus();
        } else {
          imageRefs.current[origin.id]?.focus();
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
        if (origin.side === "word") {
          wordRefs.current[origin.id]?.focus();
        } else {
          imageRefs.current[origin.id]?.focus();
        }
      }, 0);
    }
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers2 = () => {
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
      if (isWordLocked(correct.word)) {
        correctCount++;

        return;
      }

      const userLine = lines.find((line) => line.word === correct.word);

      if (userLine?.image === correct.image) {
        correctCount++;

        newlyLocked.push(correct.word);
      } else {
        wrong.push(correct.word);
      }
    });

    /* =============================================
       LOCK CORRECT ONLY
    ============================================= */

    setLockedWords((prev) => [...new Set([...prev, ...newlyLocked])]);

    setWrongWords(wrong);

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);

    const total = CORRECT_MATCHES.length;

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
      setLockedWords(WORDS.map((item) => item.id));

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
    setLines(
      CORRECT_MATCHES.map((item) => ({
        ...item,
      })),
    );

    setLockedWords(WORDS.map((item) => item.id));

    setWrongWords([]);

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

    setLockedWords([]);

    setWrongWords([]);

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
        keyboardOrigin.side === "word" ? "image" : "word",

        focusedTarget,
      );
    }
  };

  useEffect(() => {
    recomputeLines();
  }, [lines, lockedWords, wrongWords, keyboardMatching, focusedTarget]);

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
          gap: "30px",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="C"
          title="Read, look, and match."
          subTitle="Connect Bend my knee, Touch your head, and Raise your hand to the correct pictures."
        />

        {/* =================================================
            MATCH WRAPPER
        ================================================= */}

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
            {WORDS.map((item) => {
              const word = item.id;

              const connectedImage = wordToImage[word];

              const connected = !!connectedImage;

              const locked = isWordLocked(word);

              const selected =
                selectedEndpoint?.side === "word" &&
                selectedEndpoint?.id === word;

              const keyboardSelected =
                keyboardOrigin?.side === "word" && keyboardOrigin?.id === word;

              const wrong = wrongWords.includes(word);

              const playing = playingWord === word;

              return (
                <div key={word} className="word-box2">
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <h5
                      ref={(element) => {
                        wordRefs.current[word] = element;
                      }}
                      role="button"
                      /*
                          حتى لو correct + locked
                          تظل الجملة بالـTab للصوت.
                        */

                      tabIndex={0}
                      aria-label={
                        locked
                          ? `${word}. Press Enter or Space to hear it.`
                          : keyboardMatching
                            ? `${word}. Press Enter or Space to connect it.`
                            : `${word}. Press Enter or Space to hear it and start matching.`
                      }
                      className={[
                        "clickable-word-unit2-p7-q2",

                        selected || keyboardSelected
                          ? "selected-match-review8-p1-q3"
                          : "",

                        connected ? "connected-match-item" : "",
                      ]
                        .join(" ")
                        .trim()}
                      style={{
                        position: "relative",

                        cursor: locked ? "pointer" : "pointer",
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
                            الصوت دائمًا.
                          */

                        playAudio(word);

                        /*
                            correct locked => audio only.
                          */

                        if (locked) {
                          return;
                        }

                        handleEndpointClick("word", word);
                      }}
                      onKeyDown={(e) => handleEndpointKeyDown(e, "word", word)}
                    >
                      <span
                        style={{
                          color: "darkblue",

                          fontWeight: "700",
                        }}
                      >
                        {item.number}{" "}
                      </span>

                      {item.text}

                      {playing && (
                        <FaVolumeUp
                          size={14}
                          aria-hidden="true"
                          className="audio-icon-review8-p1-q3"
                        />
                      )}
                    </h5>

                    {/* WRONG X */}

                    {wrong && (
                      <span className="error-mark-img" aria-hidden="true">
                        ✕
                      </span>
                    )}
                  </div>

                  {/* DOT */}

                  <div
                    ref={(element) => registerDot(`word-${word}`, element)}
                    className={[
                      "dot22-unit6-q7",

                      "start-dot22-review8-p1-q3",

                      selected || keyboardSelected
                        ? "dot-active-review8-p1-q3"
                        : "",

                      connected ? "dot-connected" : "",
                    ]
                      .join(" ")
                      .trim()}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => {
                      if (locked) {
                        playAudio(word);

                        return;
                      }

                      handleEndpointClick("word", word);
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* =================================================
              IMAGES
          ================================================= */}

          <div className="match-images-row2">
            {IMAGES.map((item) => {
              const connectedWord = imageToWord[item.id];
              const connected = !!connectedWord;

              const locked = isImageLocked(item.id);

              const selected =
                selectedEndpoint?.side === "image" &&
                selectedEndpoint?.id === item.id;

              const keyboardSelected =
                keyboardOrigin?.side === "image" &&
                keyboardOrigin?.id === item.id;

              return (
                <div
                  key={item.id}
                  className="img-box2 image-match-wrapper-review8-p1-q3"
                  onClick={() => {
                    if (!locked) {
                      handleEndpointClick("image", item.id);
                    }
                  }}
                  style={{
                    cursor: locked ? "default" : "pointer",
                    position: "relative",
                  }}
                >
                  {/* DOT */}
                  <div
                    ref={(element) => registerDot(`image-${item.id}`, element)}
                    className={[
                      "dot22-unit6-q7",
                      "end-dot22-unit6-q7",

                      selected || keyboardSelected
                        ? "dot-active-review8-p1-q3"
                        : "",

                      connected ? "dot-connected" : "",
                    ]
                      .join(" ")
                      .trim()}
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (!locked) {
                        handleEndpointClick("image", item.id);
                      }
                    }}
                  />

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
                      "img-box2-unit6-p6-q3",

                      selected || keyboardSelected
                        ? "selected-match-review8-p1-q3"
                        : "",

                      connected ? "connected-match-item" : "",

                      locked ? "disabled-hover" : "",
                    ]
                      .join(" ")
                      .trim()}
                    style={{
                      cursor: locked ? "default" : "pointer",

                      // مهم
                      pointerEvents: "auto",

                      position: "relative",
                      zIndex: 2,
                    }}
                    onFocus={() => {
                      if (keyboardMatching && keyboardOrigin?.side === "word") {
                        setFocusedTarget(item.id);

                        updatePreviewLine("image", item.id);
                      }
                    }}
                    onClick={(e) => {
                      // عشان الـwrapper ما يناديها مرة ثانية
                      e.stopPropagation();

                      if (!locked) {
                        handleEndpointClick("image", item.id);
                      }
                    }}
                    onKeyDown={(e) =>
                      handleEndpointKeyDown(e, "image", item.id)
                    }
                  />
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

        <button onClick={checkAnswers2} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review8_Page1_Q3;
