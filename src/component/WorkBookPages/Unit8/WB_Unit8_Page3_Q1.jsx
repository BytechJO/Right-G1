import React, { useEffect, useRef, useState } from "react";

import "./WB_Unit8_Page3_Q1.css";

import img1 from "../../../assets/U1 WB/U8/U8P47EXEE.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import armAudio from "../../../assets/U1 WB/U8/audio/page 47 - E/Item_001_arm.mp3";

import noseAudio from "../../../assets/U1 WB/U8/audio/page 47 - E/Item_002_nose.mp3";

import headAudio from "../../../assets/U1 WB/U8/audio/page 47 - E/Item_003_head.mp3";

import legAudio from "../../../assets/U1 WB/U8/audio/page 47 - E/Item_004_leg.mp3";

import eyeAudio from "../../../assets/U1 WB/U8/audio/page 47 - E/Item_005_eye.mp3";

/* =====================================================
   WORD DATA
===================================================== */

const WORDS = [
  {
    id: "arm",
    text: "arm",
    audio: armAudio,
  },

  {
    id: "nose",
    text: "nose",
    audio: noseAudio,
  },

  {
    id: "head",
    text: "head",
    audio: headAudio,
  },

  {
    id: "leg",
    text: "leg",
    audio: legAudio,
  },

  {
    id: "eye",
    text: "eye",
    audio: eyeAudio,
  },
];

/* =====================================================
   TARGET DATA

   img1 = head
   img2 = eye
   img3 = nose
   img4 = arm
   img5 = leg
===================================================== */

const TARGETS = [
  {
    id: "img1",
    ariaLabel: "Head matching point on the boy.",
  },

  {
    id: "img2",
    ariaLabel: "Eye matching point on the boy.",
  },

  {
    id: "img3",
    ariaLabel: "Nose matching point on the boy.",
  },

  {
    id: "img4",
    ariaLabel: "Arm matching point on the boy.",
  },

  {
    id: "img5",
    ariaLabel: "Leg matching point on the boy.",
  },
];

/* =====================================================
   CORRECT MATCHES
===================================================== */

const CORRECT_MATCHES = [
  {
    word: "arm",
    image: "img4",
  },

  {
    word: "nose",
    image: "img3",
  },

  {
    word: "head",
    image: "img1",
  },

  {
    word: "leg",
    image: "img5",
  },

  {
    word: "eye",
    image: "img2",
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

const WB_Unit8_Page3_Q1 = () => {
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
      id: "arm" | "img1"
    }
  */

  /* =====================================================
     PROGRESSIVE CHECK
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

  const imageTargetRefs = useRef({});

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

  const isTargetLocked = (imageId) => {
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

     Wrong connected target = available
     Correct locked target = skipped
  ===================================================== */

  const getAvailableTargets = (origin) => {
    if (!origin) {
      return [];
    }

    /* =============================================
       WORD -> IMAGE
    ============================================= */

    if (origin.side === "word") {
      return TARGETS.filter((target) => {
        const connectedWord = imageToWord[target.id];

        if (!connectedWord) {
          return true;
        }

        if (connectedWord === origin.id) {
          return true;
        }

        /*
            موصولة غلط ولسا مش locked
            => مسموح نستبدلها.
          */

        return !isWordLocked(connectedWord);
      }).map((target) => target.id);
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

      /*
          الكلمة موصولة غلط
          => مسموح ناخذها.
        */

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

    const existingWordOnTarget = lines.find(
      (line) => line.image === imageId,
    )?.word;

    /* =============================================
       CORRECT LOCKED TARGET
       ممنوع نستبدله
    ============================================= */

    if (
      existingWordOnTarget &&
      existingWordOnTarget !== word &&
      isWordLocked(existingWordOnTarget)
    ) {
      return;
    }

    /* =============================================
       ONE TO ONE

       شيل:
       - توصيل الكلمة القديم
       - توصيل النقطة القديم

       وحط الجديد.
    ============================================= */

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== imageId),

      {
        word,
        image: imageId,
      },
    ]);

    /* =============================================
       CLEAR WRONG X
    ============================================= */

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== existingWordOnTarget),
    );

    setSelectedEndpoint(null);

    setKeyboardMatching(false);

    setKeyboardOrigin(null);

    setFocusedTarget(null);

    setPreviewLine(null);
  };

  /* =====================================================
     MOUSE MATCH
     BOTH SIDES
  ===================================================== */

  const handleEndpointClick = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "word" && isWordLocked(id)) {
      return;
    }

    if (side === "image" && isTargetLocked(id)) {
      return;
    }

    /* =============================================
       MOUSE MODE
    ============================================= */

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
       change selection
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
       COMPLETE MATCH
    ============================================= */

    const word = side === "word" ? id : selectedEndpoint.id;

    const imageId = side === "image" ? id : selectedEndpoint.id;

    commitConnection(word, imageId);
  };

  /* =====================================================
     START KEYBOARD MATCH
  ===================================================== */

  const startKeyboardMatch = (side, id) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "word" && isWordLocked(id)) {
      return;
    }

    if (side === "image" && isTargetLocked(id)) {
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
        imageTargetRefs.current[available[0]]?.focus();
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
       NO ACTIVE MATCH
    ============================================= */

    if (!keyboardMatching) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        e.stopPropagation();

        /* =========================================
           WORD = AUDIO + MATCH
        ========================================= */

        if (side === "word") {
          playAudio(id);

          /*
            Correct locked:
            audio only.
          */

          if (!isWordLocked(id)) {
            startKeyboardMatch(side, id);
          }

          return;
        }

        /* =========================================
           IMAGE TARGET
        ========================================= */

        startKeyboardMatch(side, id);
      }

      return;
    }

    /*
      أثناء matching:
      الطرف المقابل فقط.
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
        imageTargetRefs.current[next]?.focus();
      } else {
        wordRefs.current[next]?.focus();
      }

      return;
    }

    /* =============================================
       ENTER / SPACE
       COMMIT
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

      /* =========================================
         RETURN FOCUS TO ORIGIN
      ========================================= */

      window.setTimeout(() => {
        if (origin.side === "word") {
          wordRefs.current[origin.id]?.focus();
        } else {
          imageTargetRefs.current[origin.id]?.focus();
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
          imageTargetRefs.current[origin.id]?.focus();
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

    /* =============================================
       REQUIRE ALL MATCHES
    ============================================= */

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
          Correct from previous Check.
        */

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

    /* =============================================
       WRONG REMAIN EDITABLE
    ============================================= */

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

    /* =============================================
       ALL CORRECT
    ============================================= */

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
     START AGAIN
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
     RECOMPUTE SVG LINES
  ===================================================== */

  const recomputeLines = () => {
    if (!containerRef.current) {
      return;
    }

    const computed = lines
      .map((line) => {
        const wordElement = dotRefs.current[`word-${line.word}`];

        const imageElement = dotRefs.current[`image-${line.image}`];

        if (!wordElement || !imageElement) {
          return null;
        }

        const p1 = getCenter(wordElement, containerRef.current);

        const p2 = getCenter(imageElement, containerRef.current);

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
     RENDER TARGET
  ===================================================== */

  const renderTarget = (imageId, domId, ariaLabel) => {
    const selected =
      selectedEndpoint?.side === "image" && selectedEndpoint?.id === imageId;

    const keyboardSelected =
      keyboardOrigin?.side === "image" && keyboardOrigin?.id === imageId;

    const connected = !!imageToWord[imageId];

    const locked = isTargetLocked(imageId);

    return (
      <div className="img-with-dot2">
        <div className="dot-wrapper2">
          <div
            ref={(element) => {
              registerDot(`image-${imageId}`, element);

              imageTargetRefs.current[imageId] = element;
            }}
            id={domId}
            role="button"
            tabIndex={locked || showAnswer || checkCompleted ? -1 : 0}
            aria-label={
              locked
                ? `${ariaLabel} Correct match.`
                : `${ariaLabel} Press Enter or Space to start matching.`
            }
            className={[
              "dot2",

              "end-dot2",

              selected || keyboardSelected ? "dot-active-wb-unit8-p3-q1" : "",

              connected ? "dot-connected" : "",
            ]
              .join(" ")
              .trim()}
            data-image={imageId}
            onFocus={() => {
              if (keyboardMatching && keyboardOrigin?.side === "word") {
                setFocusedTarget(imageId);

                updatePreviewLine("image", imageId);
              }
            }}
            onClick={() => {
              if (!locked) {
                handleEndpointClick("image", imageId);
              }
            }}
            onKeyDown={(e) => handleEndpointKeyDown(e, "image", imageId)}
          />
        </div>
      </div>
    );
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
      <div
        className="div-forall"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title="Look and match."
          subTitle="Connect each word to the correct body part."
        />

        {/* =================================================
            MATCH AREA
        ================================================= */}

        <div
          className="img-dot-container-wb-unit8-p3-q1 w-full"
          ref={containerRef}
          style={{
            position: "relative",

            display: "flex",

            gap: "40px",
          }}
        >
          {/* =================================================
              WORDS
          ================================================= */}

          <div
            className="container12-wb-unit8-p3-q1"
            style={{
              margin: "0px",
            }}
          >
            {WORDS.map((item) => {
              const word = item.id;

              const connected = !!wordToImage[word];

              const locked = isWordLocked(word);

              const selected =
                selectedEndpoint?.side === "word" &&
                selectedEndpoint?.id === word;

              const keyboardSelected =
                keyboardOrigin?.side === "word" && keyboardOrigin?.id === word;

              const wrong = wrongWords.includes(word);

              const playing = playingWord === word;

              return (
                <div key={word} className="matching-row2">
                  <div className="word-with-dot2-wb-unit8-p3-q1">
                    {/* =============================================
                          WORD
                      ============================================= */}

                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <span
                        ref={(element) => {
                          wordRefs.current[word] = element;
                        }}
                        role="button"
                        /*
                            مهم:
                            correct locked word
                            يضل بالـTab للصوت.
                          */

                        tabIndex={0}
                        aria-label={
                          locked
                            ? `${word}. Press Enter or Space to hear the word.`
                            : keyboardMatching
                              ? `${word}. Press Enter or Space to connect it.`
                              : `${word}. Press Enter or Space to hear it and start matching.`
                        }
                        className={[
                          "word-text2-wb-unit8-p3-q1",

                          selected || keyboardSelected
                            ? "selected-item-wb-unit8-p3-q1"
                            : "",

                          connected ? "connected-match-item" : "",
                        ]
                          .join(" ")
                          .trim()}
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
                          /* AUDIO ALWAYS */

                          playAudio(word);

                          /*
                              Correct locked:
                              audio only.
                            */

                          if (locked) {
                            return;
                          }

                          handleEndpointClick("word", word);
                        }}
                        onKeyDown={(e) =>
                          handleEndpointKeyDown(e, "word", word)
                        }
                      >
                        {item.text}

                        {playing && (
                          <FaVolumeUp
                            size={14}
                            aria-hidden="true"
                            className="audio-icon-wb-unit8-p3-q1"
                          />
                        )}
                      </span>

                      {/* =============================================
                            WRONG X
                        ============================================= */}

                      {wrong && (
                        <span
                          className="error-mark8-wb-unit8-p3-q1"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}
                    </div>

                    {/* =============================================
                          WORD DOT
                      ============================================= */}

                    <div className="dot-wrapper2">
                      <div
                        ref={(element) => registerDot(`word-${word}`, element)}
                        className={[
                          "dot2",

                          "start-dot2",

                          selected || keyboardSelected
                            ? "dot-active-wb-unit8-p3-q1"
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
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              BODY IMAGE
          ================================================= */}

          <div className="body-image-wrapper-wb-unit8-p3-q1">
            <img
              src={img1}
              alt="A boy standing and wearing a red scarf, with matching points on his head, eye, nose, arm, and leg."
              className="body-image-wb-unit8-p3-q1"
            />

            {/* =============================================
                HEAD
                img1
            ============================================= */}

            {renderTarget(
              "img1",
              "dot-img1-wb-unit8-p3-q1",
              "Head matching point on the boy.",
            )}

            {/* =============================================
                EYE
                img2
            ============================================= */}

            {renderTarget(
              "img2",
              "dot-img2-wb-unit8-p3-q1",
              "Eye matching point on the boy.",
            )}

            {/* =============================================
                NOSE
                img3
            ============================================= */}

            {renderTarget(
              "img3",
              "dot-img3-wb-unit8-p3-q1",
              "Nose matching point on the boy.",
            )}

            {/* =============================================
                ARM
                img4
            ============================================= */}

            {renderTarget(
              "img4",
              "dot-img4-wb-unit8-p3-q1",
              "Arm matching point on the boy.",
            )}

            {/* =============================================
                LEG
                img5
            ============================================= */}

            {renderTarget(
              "img5",
              "dot-img5-wb-unit8-p3-q1",
              "Leg matching point on the boy.",
            )}
          </div>

          {/* =================================================
              SVG
          ================================================= */}

          <svg className="lines-layer2">
            {/* PERMANENT LINES */}

            {svgLines.map((line, index) => (
              <line
                key={`${line.word}-${line.image}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth={3}
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
                strokeWidth={3}
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
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            onClick={showAnswers}
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

export default WB_Unit8_Page3_Q1;
