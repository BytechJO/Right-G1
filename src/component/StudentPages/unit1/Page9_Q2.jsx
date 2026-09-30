import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";

import "./Page9_Q2.css";

import goodAudio from "../../../assets/unit1/Page 9 - E/Good.mp3";
import fineAudio from "../../../assets/unit1/Page 9 - E/Fine.mp3";
import howAudio from "../../../assets/unit1/Page 9 - E/How.mp3";
import thankYouAudio from "../../../assets/unit1/Page 9 - E/thank you.mp3";
import areYouAudio from "../../../assets/unit1/Page 9 - E/are you.mp3";
import afternoonAudio from "../../../assets/unit1/Page 9 - E/afternoon.mp3";

import ExerciseHeader from "../../ExerciseHeader";

export default function Page9_Q2() {
  /* =====================================================
     MATCHING STATES
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [wrongWords, setWrongWords] = useState([]);

  const [firstDot, setFirstDot] = useState(null);

  const [previewLine, setPreviewLine] = useState(null);

  const [showAnswer, setShowAnswer] = useState(false);

  /* =====================================================
     PROGRESSIVE LOCK
  ===================================================== */

  const [lockedLeftWords, setLockedLeftWords] = useState([]);

  const [lockedRightWords, setLockedRightWords] = useState([]);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const isLeftLocked = (word) => lockedLeftWords.includes(word);

  const isRightLocked = (word) => lockedRightWords.includes(word);

  const containerRef = useRef(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingWord, setPlayingWord] = useState(null);

  const wordAudios = {
    Good: goodAudio,
    "Fine,": fineAudio,
    How: howAudio,
    "thank you.": thankYouAudio,
    "are you?": areYouAudio,
    "afternoon.": afternoonAudio,
  };

  const playWordAudio = (word) => {
    const sound = wordAudios[word];

    if (!sound || !audioRef.current) return;

    const audio = audioRef.current;

    audio.pause();

    audio.currentTime = 0;

    audio.src = sound;

    setPlayingWord(word);

    audio.play().catch(() => {
      setPlayingWord(null);
    });

    audio.onended = () => {
      setPlayingWord(null);
    };
  };

  /* =====================================================
     ACCESSIBILITY
  ===================================================== */

  const [announcement, setAnnouncement] = useState("");

  const wordRefs = useRef({});

  const leftWords = ["Good", "Fine,", "How"];

  const rightWords = ["thank you.", "are you?", "afternoon."];

  /* =====================================================
     ANSWERS
  ===================================================== */

  const correctMatches = [
    {
      word1: "Good",
      word2: "afternoon.",
    },
    {
      word1: "Fine,",
      word2: "thank you.",
    },
    {
      word1: "How",
      word2: "are you?",
    },
  ];

  /* =====================================================
     DRAWING
  ===================================================== */

  /*
    أدوات الرسم تتفعل بعد Check Answer
  */

  const [canDraw, setCanDraw] = useState(false);

  /*
    null = الرسم مش شغال
    pen = قلم
    eraser = ممحاة
  */

  const [activeTool, setActiveTool] = useState(null);

  const [selectedColor, setSelectedColor] = useState("#e53935");

  const [isDrawing, setIsDrawing] = useState(false);

  const [drawingStrokes, setDrawingStrokes] = useState([]);

  const [activeStroke, setActiveStroke] = useState(null);

  const activeStrokeRef = useRef(null);

  const [drawingHistory, setDrawingHistory] = useState([]);

  const drawingColors = [
    "#e53935",
    "#1e88e5",
    "#43a047",
    "#fb8c00",
    "#8e24aa",
    "#fdd835",
  ];

  const drawingActive =
    canDraw && (activeTool === "pen" || activeTool === "eraser");

  /* =====================================================
     VECTOR DRAWING
  ===================================================== */

  const getSvgPosition = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const pointsToPath = (points) => {
    if (!points.length) return "";

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} l 0.01 0`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let index = 1; index < points.length - 1; index++) {
      const point = points[index];

      const nextPoint = points[index + 1];

      const middleX = (point.x + nextPoint.x) / 2;

      const middleY = (point.y + nextPoint.y) / 2;

      path += ` Q ${point.x} ${point.y} ${middleX} ${middleY}`;
    }

    const lastPoint = points[points.length - 1];

    return `${path} L ${lastPoint.x} ${lastPoint.y}`;
  };

  const handlePointerDown = (e, word) => {
    if (!drawingActive) return;

    e.preventDefault();

    e.stopPropagation();

    e.currentTarget.setPointerCapture?.(e.pointerId);

    const pressure =
      e.pointerType === "pen" && e.pressure > 0 ? e.pressure : 0.5;

    const stroke = {
      id: `${Date.now()}-${e.pointerId}`,

      word,

      tool: activeTool,

      color: selectedColor,

      width: activeTool === "eraser" ? 28 : 7 + pressure * 4,

      points: [getSvgPosition(e)],
    };

    setDrawingHistory((prev) => [...prev, drawingStrokes]);

    activeStrokeRef.current = stroke;

    setActiveStroke(stroke);

    setIsDrawing(true);
  };

  const handlePointerMove = (e, word) => {
    if (!isDrawing || !drawingActive) return;

    if (activeStrokeRef.current?.word !== word) {
      return;
    }

    e.preventDefault();

    e.stopPropagation();

    const nextStroke = {
      ...activeStrokeRef.current,

      points: [...activeStrokeRef.current.points, getSvgPosition(e)],
    };

    activeStrokeRef.current = nextStroke;

    setActiveStroke(nextStroke);
  };

  const stopDrawing = (e) => {
    const completedStroke = activeStrokeRef.current;

    if (!isDrawing || !completedStroke) return;

    e?.preventDefault();

    e?.stopPropagation();

    e?.currentTarget?.releasePointerCapture?.(e.pointerId);

    setDrawingStrokes((prev) => [...prev, completedStroke]);

    activeStrokeRef.current = null;

    setActiveStroke(null);

    setIsDrawing(false);
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const handleUndoDrawing = () => {
    if (!canDraw || drawingHistory.length === 0) {
      return;
    }

    const previousStrokes = drawingHistory[drawingHistory.length - 1];

    setDrawingStrokes(previousStrokes);

    setDrawingHistory((prev) => prev.slice(0, -1));

    setAnnouncement("Last drawing action undone.");
  };

  /* =====================================================
     CLEAR DRAWING
  ===================================================== */

  const handleClearDrawing = () => {
    if (!canDraw) return;

    setDrawingHistory((prev) => [...prev, drawingStrokes]);

    setDrawingStrokes([]);

    setAnnouncement("Drawing cleared.");
  };

  const clearCanvasCompletely = () => {
    activeStrokeRef.current = null;

    setActiveStroke(null);

    setDrawingStrokes([]);
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const getAvailableRightWords = () =>
    rightWords.filter((word) => !isRightLocked(word));

  const getAvailableLeftWords = () =>
    leftWords.filter((word) => !isLeftLocked(word));

  const focusWord = (word) => {
    if (!word) return;

    requestAnimationFrame(() => {
      wordRefs.current[word]?.focus();
    });
  };

  /* =====================================================
     MATCH PREVIEW
  ===================================================== */

  const updatePreviewLine = (startPoint, endWord) => {
    const container = containerRef.current;

    const endDot = document.getElementById(`dot-${endWord}`);

    if (!startPoint || !container || !endDot) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const endDotRect = endDot.getBoundingClientRect();

    setPreviewLine({
      x1: startPoint.x,

      y1: startPoint.y,

      x2: endDotRect.left - containerRect.left + 8,

      y2: endDotRect.top - containerRect.top + 8,
    });
  };

  /* =====================================================
     MATCH - START
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer || checkCompleted) return;

    const word = e.currentTarget.dataset.letter;

    if (!word || !containerRef.current) {
      return;
    }

    /*
      إذا التوصيل صح واتقفل
      ما نسمح بتغييره.
    */

    if (isLeftLocked(word)) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const oldConnection = lines.find((line) => line.word === word);

    /*
      نفس البداية ما بصير إلها خطين.
      التوصيل الجديد يستبدل القديم.
    */

    setLines((prev) => prev.filter((line) => line.word !== word));

    /*
      لو عليها X نشيله فقط عنها
    */

    setWrongWords((prev) => prev.filter((item) => item !== word));

    setPreviewLine(null);

    setFirstDot({
      word,

      x: e.currentTarget.getBoundingClientRect().left - rect.left + 8,

      y: e.currentTarget.getBoundingClientRect().top - rect.top + 8,
    });

    if (oldConnection) {
      setAnnouncement(
        `${word} selected. Previous connection removed. Choose a word from the right side.`,
      );
    } else {
      setAnnouncement(`${word} selected. Choose a word from the right side.`);
    }
  };

  /* =====================================================
     MATCH - END
  ===================================================== */

  const handleEndDotClick = (e) => {
    if (showAnswer || checkCompleted) return;

    const image = e.currentTarget.dataset.image;

    if (!image) return;

    /*
      النهاية الصحيحة المقفلة
      ما تقبل توصيل جديد
    */

    if (isRightLocked(image)) {
      return;
    }

    if (!firstDot) {
      setAnnouncement(`${image}. Select a word from the left side first.`);

      return;
    }

    const selectedWord = firstDot.word;

    if (isLeftLocked(selectedWord)) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const previousEndConnection = lines.find((line) => line.image === image);

    const newLine = {
      x1: firstDot.x,

      y1: firstDot.y,

      x2: e.currentTarget.getBoundingClientRect().left - rect.left + 8,

      y2: e.currentTarget.getBoundingClientRect().top - rect.top + 8,

      word: selectedWord,

      image,
    };

    setLines((prev) => {
      /*
        ممنوع duplicate من البداية أو النهاية.
      */

      const filtered = prev.filter(
        (line) => line.word !== selectedWord && line.image !== image,
      );

      return [...filtered, newLine];
    });

    /*
      شيل X عن الكلمة اللي عدلناها.
      ولو الصورة كانت مأخوذة من كلمة غلط ثانية،
      شيل X عنها لأنها الآن بدون توصيل.
    */

    setWrongWords((prev) =>
      prev.filter(
        (word) => word !== selectedWord && word !== previousEndConnection?.word,
      ),
    );

    if (previousEndConnection) {
      setAnnouncement(
        `${selectedWord} connected to ${image}. Previous connection was replaced.`,
      );
    } else {
      setAnnouncement(`${selectedWord} connected to ${image}.`);
    }

    setFirstDot(null);

    setPreviewLine(null);
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleKeyboard = (e, word, side) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (side === "left" && isLeftLocked(word)) {
      return;
    }

    if (side === "right" && isRightLocked(word)) {
      return;
    }

    /*
      Enter / Space يعمل نفس click
    */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      playWordAudio(word);

      if (side === "left") {
        document.getElementById(`dot-${word}`)?.click();

        /*
          بعد اختيار اليسار
          روح لأول خيار يمين غير مقفول
        */

        const availableRight = getAvailableRightWords();

        if (availableRight.length > 0) {
          focusWord(availableRight[0]);
        }

        return;
      }

      if (!firstDot) {
        setAnnouncement("Select a word from the left side first.");

        return;
      }

      const selectedLeftWord = firstDot.word;

      document.getElementById(`dot-${word}`)?.click();

      /*
        بعد إتمام التوصيل
        ارجع لأول كلمة يسار غير مقفلة
        غير الكلمة الحالية إن أمكن
      */

      const availableLeft = getAvailableLeftWords().filter(
        (item) => item !== selectedLeftWord,
      );

      if (availableLeft.length > 0) {
        focusWord(availableLeft[0]);
      } else {
        /*
          إذا ما ظل غير الحالية
          رجع عليها
        */

        const stillAvailable = getAvailableLeftWords();

        if (stillAvailable.length > 0) {
          focusWord(stillAvailable[0]);
        }
      }

      return;
    }

    /*
      أثناء اختيار النهاية،
      Tab و Shift+Tab فقط بين اليمين غير المقفول.
    */

    if (e.key === "Tab" && side === "right" && firstDot) {
      e.preventDefault();

      const availableRight = getAvailableRightWords();

      if (availableRight.length === 0) {
        return;
      }

      const currentIndex = availableRight.indexOf(word);

      const direction = e.shiftKey ? -1 : 1;

      const nextIndex =
        currentIndex === -1
          ? 0
          : (currentIndex + direction + availableRight.length) %
            availableRight.length;

      focusWord(availableRight[nextIndex]);

      return;
    }

    /*
      Escape يلغي الاختيار الحالي.
    */

    if (e.key === "Escape" && side === "right" && firstDot) {
      e.preventDefault();

      const selectedLeftWord = firstDot.word;

      setFirstDot(null);

      setPreviewLine(null);

      setAnnouncement(
        `${selectedLeftWord} selection cancelled. Choose a word from the left side.`,
      );

      if (!isLeftLocked(selectedLeftWord)) {
        focusWord(selectedLeftWord);
      }
    }
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all pairs before checking.",
      );

      setAnnouncement("Please connect all pairs before checking.");

      return;
    }

    let correctCount = 0;

    const total = correctMatches.length;

    const wrong = [];

    const newlyLockedLeft = [];

    const newlyLockedRight = [];

    lines.forEach((line) => {
      const correctPair = correctMatches.find(
        (pair) => pair.word1 === line.word && pair.word2 === line.image,
      );

      if (correctPair) {
        correctCount++;

        newlyLockedLeft.push(line.word);

        newlyLockedRight.push(line.image);
      } else {
        wrong.push(line.word);
      }
    });

    /* =========================================
       LOCK ONLY CORRECT CONNECTIONS
    ========================================= */

    setLockedLeftWords((prev) =>
      Array.from(new Set([...prev, ...newlyLockedLeft])),
    );

    setLockedRightWords((prev) =>
      Array.from(new Set([...prev, ...newlyLockedRight])),
    );

    setWrongWords(wrong);

    /*
      نلغي أي selection شغال
    */

    setFirstDot(null);

    setPreviewLine(null);

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

    /* =========================================
       DRAWING
       نفس السلوك الموجود:
       بعد Check كامل تتفعل الأدوات
    ========================================= */

    setCanDraw(true);

    setActiveTool(null);

    /* =========================================
       ALL CORRECT
    ========================================= */

    if (correctCount === total) {
      setLockedLeftWords([...leftWords]);

      setLockedRightWords([...rightWords]);

      setCheckCompleted(true);

      setWrongWords([]);

      setAnnouncement(
        `Score ${correctCount} out of ${total}. All matches are correct. Coloring tools are now available.`,
      );

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =========================================
       WRONG / PARTIAL
    ========================================= */

    setAnnouncement(
      `Score ${correctCount} out of ${total}. Correct matches are locked. Fix the incorrect matches. Coloring tools are now available.`,
    );

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWERS
  ===================================================== */

  const showCorrectAnswers = () => {
    const rect = containerRef.current.getBoundingClientRect();

    const correctLines = correctMatches.map((pair) => {
      const startEl = document.querySelector(
        `.start-dot1[data-letter="${pair.word1}"]`,
      );

      const endEl = document.querySelector(
        `.end-dot1[data-image="${pair.word2}"]`,
      );

      return {
        x1: startEl.getBoundingClientRect().left - rect.left + 8,

        y1: startEl.getBoundingClientRect().top - rect.top + 8,

        x2: endEl.getBoundingClientRect().left - rect.left + 8,

        y2: endEl.getBoundingClientRect().top - rect.top + 8,

        word: pair.word1,

        image: pair.word2,
      };
    });

    setLines(correctLines);

    setWrongWords([]);

    setFirstDot(null);

    setPreviewLine(null);

    setLockedLeftWords([...leftWords]);

    setLockedRightWords([...rightWords]);

    setCheckCompleted(true);

    setShowAnswer(true);

    setAnnouncement("Correct answers shown.");
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setLines([]);

    setWrongWords([]);

    setFirstDot(null);

    setPreviewLine(null);

    setShowAnswer(false);

    setLockedLeftWords([]);

    setLockedRightWords([]);

    setCheckCompleted(false);

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    setPlayingWord(null);

    /* drawing reset */

    clearCanvasCompletely();

    setDrawingHistory([]);

    setCanDraw(false);

    setActiveTool(null);

    setIsDrawing(false);

    setAnnouncement("Activity reset.");
  };

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  /* =====================================================
     COLORABLE WORD
  ===================================================== */

  const renderColorableWord = (word) => {
    const safeWordId = word.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const clipId = `letter-clip-${safeWordId}`;

    const savedStrokes = drawingStrokes.filter(
      (stroke) => stroke.word === word,
    );

    const displayedStrokes =
      activeStroke?.word === word
        ? [...savedStrokes, activeStroke]
        : savedStrokes;

    return (
      <>
        <span className="coloring-word-placeholder" aria-hidden="true">
          {word}
        </span>

        <svg
          className={`letter-coloring-svg ${
            drawingActive ? "letter-coloring-svg-active" : ""
          }`}
          aria-hidden="true"
          style={{
            cursor:
              activeTool === "eraser"
                ? "cell"
                : activeTool === "pen"
                  ? "crosshair"
                  : "default",
          }}
          onClick={(e) => {
            if (canDraw) {
              e.preventDefault();

              e.stopPropagation();
            }
          }}
          onPointerDown={(e) => handlePointerDown(e, word)}
          onPointerMove={(e) => handlePointerMove(e, word)}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
        >
          <defs>
            <clipPath id={clipId}>
              <text
                x="6"
                y="50%"
                dominantBaseline="central"
                className="letter-coloring-text"
              >
                {word}
              </text>
            </clipPath>

            {displayedStrokes.map((stroke, index) => {
              if (stroke.tool !== "pen") {
                return null;
              }

              const laterErasers = displayedStrokes
                .slice(index + 1)
                .filter((item) => item.tool === "eraser");

              if (laterErasers.length === 0) {
                return null;
              }

              return (
                <mask
                  id={`${clipId}-erasers-${stroke.id}`}
                  key={`${clipId}-mask-${stroke.id}`}
                >
                  <rect width="100%" height="100%" fill="white" />

                  {laterErasers.map((eraser) => (
                    <path
                      key={eraser.id}
                      d={pointsToPath(eraser.points)}
                      fill="none"
                      stroke="black"
                      strokeWidth={eraser.width}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </mask>
              );
            })}
          </defs>

          <g clipPath={`url(#${clipId})`}>
            {displayedStrokes.map((stroke, index) => {
              if (stroke.tool !== "pen") {
                return null;
              }

              const hasLaterEraser = displayedStrokes
                .slice(index + 1)
                .some((item) => item.tool === "eraser");

              return (
                <path
                  key={stroke.id}
                  d={pointsToPath(stroke.points)}
                  fill="none"
                  stroke={stroke.color}
                  strokeWidth={stroke.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  mask={
                    hasLaterEraser
                      ? `url(#${clipId}-erasers-${stroke.id})`
                      : undefined
                  }
                />
              );
            })}
          </g>

          <text
            x="6"
            y="50%"
            dominantBaseline="central"
            className="letter-coloring-text letter-coloring-outline"
          >
            {word}
          </text>
        </svg>
      </>
    );
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div
      style={{
        display: "flex",

        padding: "30px",

        justifyContent: "center",
      }}
    >
      <div
        className="div-forall"
        style={{
          gap: "10px",
        }}
      >
        <ExerciseHeader
          sectionLetter="E"
          title="Match and color."
          subTitle="Match each phrase first, then click twice to use the coloring tool."
        />

        <audio
          ref={audioRef}
          style={{
            display: "none",
          }}
        />

        {/* =================================================
            SCREEN READER
        ================================================= */}

        <span className="sr-only">
          Match the words. Use Tab to move through the words on the left and
          press Enter or Space to select one. Focus then moves to the words on
          the right. Use Tab or Shift plus Tab to move only through the right
          choices, then press Enter or Space to connect. Press Escape to cancel
          and return to the left side. After checking your answers, coloring
          tools become available.
        </span>

        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        {/* =================================================
            DRAWING TOOLBAR
        ================================================= */}

        <div className="drawing-toolbar">
          <button
            type="button"
            disabled={!canDraw}
            aria-pressed={activeTool === "pen"}
            className={`drawing-tool ${
              activeTool === "pen" ? "drawing-tool-active" : ""
            }`}
            onClick={() => {
              setActiveTool((prev) => (prev === "pen" ? null : "pen"));

              setAnnouncement("Pen tool selected.");
            }}
          >
            ✏️ Pen
          </button>

          <button
            type="button"
            disabled={!canDraw}
            aria-pressed={activeTool === "eraser"}
            className={`drawing-tool ${
              activeTool === "eraser" ? "drawing-tool-active" : ""
            }`}
            onClick={() => {
              setActiveTool((prev) => (prev === "eraser" ? null : "eraser"));

              setAnnouncement("Eraser tool selected.");
            }}
          >
            🧽 Eraser
          </button>

          <button
            type="button"
            disabled={!canDraw || drawingHistory.length === 0}
            className="drawing-tool"
            onClick={handleUndoDrawing}
          >
            ↶ Undo
          </button>

          <button
            type="button"
            disabled={!canDraw}
            className="drawing-tool"
            onClick={handleClearDrawing}
          >
            🗑 Clear
          </button>

          <div className="drawing-colors" aria-label="Drawing colors">
            {drawingColors.map((color) => (
              <button
                key={color}
                type="button"
                disabled={!canDraw}
                aria-label={`Select drawing color ${color}`}
                aria-pressed={selectedColor === color}
                className={`drawing-color ${
                  selectedColor === color ? "drawing-color-selected" : ""
                }`}
                style={{
                  backgroundColor: color,
                }}
                onClick={() => {
                  setSelectedColor(color);

                  setActiveTool("pen");

                  setAnnouncement("Drawing color selected.");
                }}
              />
            ))}
          </div>
        </div>

        {/* =================================================
            MATCHING AREA
        ================================================= */}

        <div className="container3" ref={containerRef}>
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="word-section1">
            {leftWords.map((word) => {
              const isSelected = firstDot?.word === word;

              const isPlaying = playingWord === word;

              const connection = lines.find((line) => line.word === word);

              const wordLocked = isLeftLocked(word);

              return (
                <div
                  key={word}
                  style={{
                    position: "relative",

                    display: "flex",

                    flexDirection: "row",

                    alignItems: "center",

                    width: "100%",

                    justifyContent: "flex-end",
                  }}
                >
                  <h5
                    ref={(el) => {
                      wordRefs.current[word] = el;
                    }}
                    role="button"
                    tabIndex={
                      showAnswer || checkCompleted || wordLocked || firstDot
                        ? -1
                        : 0
                    }
                    aria-disabled={showAnswer || checkCompleted || wordLocked}
                    aria-pressed={isSelected}
                    aria-label={
                      wordLocked
                        ? `${word}. Correct match.`
                        : connection
                          ? `${word}. Connected to ${connection.image}.`
                          : `${word}. Not connected. Press Enter or Space to select.`
                    }
                    className={`H5 word-outline ${
                      showAnswer || checkCompleted || wordLocked
                        ? "disabled-word"
                        : ""
                    } ${isSelected ? "keyboard-selected" : ""} ${
                      isPlaying ? "audio-playing" : ""
                    } ${canDraw ? "coloring-word" : ""}`}
                    style={{
                      cursor: "pointer",

                      position: "relative",

                      textAlign: "start",

                      width: "100%",
                    }}
                    onClick={() => {
                      /*
                          الصوت يظل يشتغل
                          حتى لو التوصيل صح
                        */

                      playWordAudio(word);

                      if (showAnswer || checkCompleted || wordLocked) {
                        return;
                      }

                      document.getElementById(`dot-${word}`)?.click();
                    }}
                    onKeyDown={(e) => handleKeyboard(e, word, "left")}
                  >
                    {renderColorableWord(word)}
                  </h5>

                  <div
                    id={`dot-${word}`}
                    className="dot1 start-dot1"
                    data-letter={word}
                    onClick={handleStartDotClick}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  {wrongWords.includes(word) && (
                    <span className="error-mark" aria-hidden="true">
                      ✕
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="word-section2">
            {rightWords.map((word) => {
              const isPlaying = playingWord === word;

              const connection = lines.find((line) => line.image === word);

              const wordLocked = isRightLocked(word);

              return (
                <div
                  key={word}
                  style={{
                    position: "relative",

                    display: "flex",

                    flexDirection: "row",

                    alignItems: "center",

                    width: "100%",

                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    className="dot1 end-dot1"
                    id={`dot-${word}`}
                    data-image={word}
                    onClick={handleEndDotClick}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <h5
                    ref={(el) => {
                      wordRefs.current[word] = el;
                    }}
                    role="button"
                    tabIndex={
                      showAnswer || checkCompleted || wordLocked || !firstDot
                        ? -1
                        : 0
                    }
                    aria-disabled={showAnswer || checkCompleted || wordLocked}
                    aria-label={
                      wordLocked
                        ? `${word}. Correct match.`
                        : connection
                          ? `${word}. Connected from ${connection.word}.`
                          : `${word}. Not connected. Press Enter or Space to connect the selected word here.`
                    }
                    className={`H5 word-outline ${
                      showAnswer || checkCompleted || wordLocked
                        ? "disabled-word"
                        : ""
                    } ${isPlaying ? "audio-playing" : ""} ${
                      canDraw ? "coloring-word" : ""
                    }`}
                    style={{
                      cursor: "pointer",

                      position: "relative",
                    }}
                    onClick={() => {
                      playWordAudio(word);

                      if (showAnswer || checkCompleted || wordLocked) {
                        return;
                      }

                      document.getElementById(`dot-${word}`)?.click();
                    }}
                    onFocus={() => {
                      if (firstDot && !wordLocked) {
                        updatePreviewLine(firstDot, word);
                      }
                    }}
                    onKeyDown={(e) => handleKeyboard(e, word, "right")}
                  >
                    {renderColorableWord(word)}
                  </h5>
                </div>
              );
            })}
          </div>

          {/* =================================================
              MATCHING LINES
          ================================================= */}

          <svg className="lines-layer" aria-hidden="true">
            {lines.map((line, i) => (
              <line
                key={`${line.word}-${line.image}-${i}`}
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
                style={{
                  pointerEvents: "none",
                }}
              />
            )}
          </svg>
        </div>
      </div>

      {/* =================================================
          ACTION BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button
          type="button"
          onClick={handleReset}
          className="try-again-button"
          title="Start again"
        >
          Start Again ↻
        </button>

        <button
          type="button"
          onClick={showCorrectAnswers}
          className="show-answer-btn swal-continue"
          title="Show answer"
        >
          Show Answer
        </button>

        <button
          type="button"
          onClick={checkAnswers}
          className="check-button2"
          title="Check answer"
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
