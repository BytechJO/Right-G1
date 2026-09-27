import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Page9_Q2.css";

import goodAudio from "../../../assets/unit1/Page 9 - E/Good.mp3";
import fineAudio from "../../../assets/unit1/Page 9 - E/Fine.mp3";
import howAudio from "../../../assets/unit1/Page 9 - E/How.mp3";
import thankYouAudio from "../../../assets/unit1/Page 9 - E/thank you.mp3";
import areYouAudio from "../../../assets/unit1/Page 9 - E/are you.mp3";
import afternoonAudio from "../../../assets/unit1/Page 9 - E/afternoon.mp3";

export default function Page9_Q2() {
  const [lines, setLines] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [firstDot, setFirstDot] = useState(null);
  const [previewLine, setPreviewLine] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [locked, setLocked] = useState(false);

  const containerRef = useRef(null);

  // =====================================================
  // AUDIO
  // =====================================================

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

  // =====================================================
  // ACCESSIBILITY
  // =====================================================

  const [announcement, setAnnouncement] = useState("");

  const wordRefs = useRef({});

  const leftWords = ["Good", "Fine,", "How"];
  const rightWords = ["thank you.", "are you?", "afternoon."];

  // =====================================================
  // ANSWERS
  // =====================================================

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

  // =====================================================
  // DRAWING
  // =====================================================

  const canvasRef = useRef(null);

  /*
    ما بتتفعل الأدوات إلا بعد Check Answer
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

  /*
    كل عنصر هون عبارة عن snapshot للـ canvas
    حتى Undo يرجع خطوة.
  */
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

  // =====================================================
  // CANVAS SIZE
  // =====================================================

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    /*
      نحفظ الرسم الحالي قبل تغيير حجم canvas.
    */
    const tempCanvas = document.createElement("canvas");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    const tempCtx = tempCanvas.getContext("2d");

    if (canvas.width && canvas.height) {
      tempCtx.drawImage(canvas, 0, 0);
    }

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    /*
      رجع الرسم بعد resize.
    */
    if (tempCanvas.width && tempCanvas.height) {
      ctx.drawImage(
        tempCanvas,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
        0,
        0,
        rect.width,
        rect.height,
      );
    }
  };

  useEffect(() => {
    resizeCanvas();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // =====================================================
  // DRAWING HISTORY
  // =====================================================

  const saveCanvasState = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const snapshot = canvas.toDataURL();

    setDrawingHistory((prev) => [...prev, snapshot]);
  };

  const restoreCanvasState = (snapshot) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    if (!snapshot) return;

    const image = new Image();

    image.onload = () => {
      ctx.save();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.drawImage(image, 0, 0, rect.width, rect.height);

      ctx.restore();
    };

    image.src = snapshot;
  };

  // =====================================================
  // POINTER POSITION
  // =====================================================

  const getCanvasPosition = (e) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // =====================================================
  // START DRAW
  // =====================================================

  const handlePointerDown = (e) => {
    if (!drawingActive) return;

    e.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    /*
      قبل ما نبدأ stroke جديد،
      خزّن الوضع الحالي للـ Undo.
    */
    saveCanvasState();

    canvas.setPointerCapture?.(e.pointerId);

    const ctx = canvas.getContext("2d");

    const { x, y } = getCanvasPosition(e);

    ctx.beginPath();

    ctx.moveTo(x, y);

    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";

      ctx.lineWidth = 28;
    } else {
      ctx.globalCompositeOperation = "source-over";

      ctx.strokeStyle = selectedColor;

      ctx.lineWidth = 9;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setIsDrawing(true);
  };

  // =====================================================
  // DRAW
  // =====================================================

  const handlePointerMove = (e) => {
    if (!isDrawing || !drawingActive) return;

    e.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const { x, y } = getCanvasPosition(e);

    ctx.lineTo(x, y);

    ctx.stroke();
  };

  // =====================================================
  // STOP DRAW
  // =====================================================

  const stopDrawing = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;

    if (canvas && e?.pointerId !== undefined) {
      canvas.releasePointerCapture?.(e.pointerId);
    }

    const ctx = canvas?.getContext("2d");

    if (ctx) {
      ctx.closePath();

      ctx.globalCompositeOperation = "source-over";
    }

    setIsDrawing(false);
  };

  // =====================================================
  // UNDO
  // =====================================================

  const handleUndoDrawing = () => {
    if (!canDraw) return;

    if (drawingHistory.length === 0) return;

    const lastSnapshot = drawingHistory[drawingHistory.length - 1];

    restoreCanvasState(lastSnapshot);

    setDrawingHistory((prev) => prev.slice(0, -1));

    setAnnouncement("Last drawing action undone.");
  };

  // =====================================================
  // CLEAR DRAWING
  // =====================================================

  const handleClearDrawing = () => {
    if (!canDraw) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    /*
      حتى Clear نفسه نقدر نعمله Undo.
    */
    saveCanvasState();

    const ctx = canvas.getContext("2d");

    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    setAnnouncement("Drawing cleared.");
  };

  // =====================================================
  // CLEAR WITHOUT HISTORY
  // تستخدم في Start Again
  // =====================================================

  const clearCanvasCompletely = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
  };

  // =====================================================
  // MATCH - START
  // =====================================================

  const updatePreviewLine = (startPoint, endWord) => {
    const container = containerRef.current;
    const endDot = document.getElementById(`dot-${endWord}`);

    if (!startPoint || !container || !endDot) return;

    const containerRect = container.getBoundingClientRect();
    const endDotRect = endDot.getBoundingClientRect();

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endDotRect.left - containerRect.left + 8,
      y2: endDotRect.top - containerRect.top + 8,
    });
  };

  const handleStartDotClick = (e) => {
    if (locked || showAnswer) return;

    const word = e.currentTarget.dataset.letter;

    if (!word || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const oldConnection = lines.find((line) => line.word === word);

    /*
      نفس البداية ما بصير إلها خطين.
      التوصيل الجديد يستبدل القديم.
    */
    setLines((prev) => prev.filter((line) => line.word !== word));

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

  // =====================================================
  // MATCH - END
  // =====================================================

  const handleEndDotClick = (e) => {
    if (locked || showAnswer) return;

    const image = e.currentTarget.dataset.image;

    if (!firstDot) {
      setAnnouncement(`${image}. Select a word from the left side first.`);

      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const selectedWord = firstDot.word;

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

  // =====================================================
  // KEYBOARD
  // =====================================================

  const focusWord = (word) => {
    requestAnimationFrame(() => {
      wordRefs.current[word]?.focus();
    });
  };

  const handleKeyboard = (e, word, side) => {
    if (locked || showAnswer) return;

    /*
      Enter أو Space يعمل نفس click.
    */
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      playWordAudio(word);

      if (side === "left") {
        document.getElementById(`dot-${word}`)?.click();

        /*
          بعد اختيار كلمة من اليسار، انقل التركيز لأول خيار في اليمين.
          تصبح خيارات اليسار خارج ترتيب Tab حتى يكتمل الاختيار.
        */
        focusWord(rightWords[0]);

        return;
      }

      if (!firstDot) {
        setAnnouncement("Select a word from the left side first.");
        return;
      }

      const selectedLeftWord = firstDot.word;
      const selectedLeftIndex = leftWords.indexOf(selectedLeftWord);
      const nextLeftWord =
        leftWords[(selectedLeftIndex + 1) % leftWords.length];

      document.getElementById(`dot-${word}`)?.click();

      /*
        بعد إتمام التوصيل، ارجع تلقائياً للخيار التالي في اليسار.
      */
      focusWord(nextLeftWord);

      return;
    }

    /*
      أثناء اختيار النهاية، احصر Tab و Shift+Tab داخل خيارات اليمين.
    */
    if (e.key === "Tab" && side === "right" && firstDot) {
      e.preventDefault();

      const currentIndex = rightWords.indexOf(word);
      const direction = e.shiftKey ? -1 : 1;
      const nextIndex =
        (currentIndex + direction + rightWords.length) % rightWords.length;

      focusWord(rightWords[nextIndex]);

      return;
    }

    /*
      Escape يمنع تكوين keyboard trap دائم، ويلغي الاختيار الحالي.
    */
    if (e.key === "Escape" && side === "right" && firstDot) {
      e.preventDefault();

      const selectedLeftWord = firstDot.word;

      setFirstDot(null);
      setPreviewLine(null);
      setAnnouncement(
        `${selectedLeftWord} selection cancelled. Choose a word from the left side.`,
      );

      focusWord(selectedLeftWord);
    }
  };

  // =====================================================
  // CHECK ANSWERS
  // =====================================================

  const checkAnswers = () => {
    if (showAnswer) return;

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

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word1 === line.word && pair.word2 === line.image,
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.word);
      }
    });

    setWrongWords(wrong);

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
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    /*
      ✅ بمجرد ما عمل Check كامل
      تتفعل أدوات الرسم.
    */
    setCanDraw(true);

    /*
      لكن ما نبدأ الرسم تلقائي.
      المستخدم لازم يختار Pen أو Eraser.
    */
    setActiveTool(null);

    setAnnouncement(
      `Score ${correctCount} out of ${total}. Coloring tools are now available.`,
    );

    /*
      نفس سلوك كودك الحالي.
    */
    setLocked(true);
  };

  // =====================================================
  // SHOW ANSWERS
  // =====================================================

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

    setShowAnswer(true);

    setAnnouncement("Correct answers shown.");
  };

  // =====================================================
  // RESET
  // =====================================================

  const handleReset = () => {
    setLines([]);

    setWrongWords([]);

    setFirstDot(null);
    setPreviewLine(null);

    setShowAnswer(false);

    setLocked(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingWord(null);

    /*
      reset drawing
    */
    clearCanvasCompletely();

    setDrawingHistory([]);

    setCanDraw(false);

    setActiveTool(null);

    setIsDrawing(false);

    setAnnouncement("Activity reset.");
  };

  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // =====================================================
  // JSX
  // =====================================================

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
        <h4 className="header-title-page8">
          <span className="ex-A">E</span>
          Match and color.
        </h4>

        <audio
          ref={audioRef}
          style={{
            display: "none",
          }}
        />

        {/* Screen Reader instructions */}

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

        {/* ======================================
            DRAWING TOOLBAR
        ======================================= */}

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

          {/* COLORS */}

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

        {/* ======================================
            MATCHING AREA
        ======================================= */}

        <div className="container3" ref={containerRef}>
          {/* LEFT */}

          <div className="word-section1">
            {leftWords.map((word) => {
              const isSelected = firstDot?.word === word;

              const isPlaying = playingWord === word;

              const connection = lines.find((line) => line.word === word);

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
                    tabIndex={locked || showAnswer || firstDot ? -1 : 0}
                    aria-pressed={isSelected}
                    aria-label={
                      connection
                        ? `${word}. Connected to ${connection.image}.`
                        : `${word}. Not connected. Press Enter or Space to select.`
                    }
                    className={`H5 word-outline ${
                      locked || showAnswer ? "disabled-word" : ""
                    } ${isSelected ? "keyboard-selected" : ""} ${
                      isPlaying ? "audio-playing" : ""
                    }`}
                    style={{
                      cursor: "pointer",

                      position: "relative",

                      textAlign: "start",

                      width: "100%",
                    }}
                    onClick={() => {
                      playWordAudio(word);

                      document.getElementById(`dot-${word}`)?.click();
                    }}
                    onKeyDown={(e) => handleKeyboard(e, word, "left")}
                  >
                    {word}
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

          {/* RIGHT */}

          <div className="word-section2">
            {rightWords.map((word) => {
              const isPlaying = playingWord === word;

              const connection = lines.find((line) => line.image === word);

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
                    tabIndex={locked || showAnswer || !firstDot ? -1 : 0}
                    aria-label={
                      connection
                        ? `${word}. Connected from ${connection.word}.`
                        : `${word}. Not connected. Press Enter or Space to connect the selected word here.`
                    }
                    className={`H5 word-outline ${
                      locked || showAnswer ? "disabled-word" : ""
                    } ${isPlaying ? "audio-playing" : ""}`}
                    style={{
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => {
                      playWordAudio(word);

                      document.getElementById(`dot-${word}`)?.click();
                    }}
                    onFocus={() => {
                      if (firstDot) {
                        updatePreviewLine(firstDot, word);
                      }
                    }}
                    onKeyDown={(e) => handleKeyboard(e, word, "right")}
                  >
                    {word}
                  </h5>
                </div>
              );
            })}
          </div>

          {/* MATCHING LINES */}

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
                style={{ pointerEvents: "none" }}
              />
            )}
          </svg>

          {/* ==================================
              DRAWING CANVAS
          ================================== */}

          <canvas
            ref={canvasRef}
            className={`drawing-canvas ${
              drawingActive ? "drawing-canvas-active" : ""
            }`}
            aria-label="Coloring canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            style={{
              pointerEvents: drawingActive ? "auto" : "none",

              cursor:
                activeTool === "eraser"
                  ? "cell"
                  : activeTool === "pen"
                    ? "crosshair"
                    : "default",
            }}
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}

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
