import React, { useRef, useState } from "react";
import img2 from "../../../assets/unit1/imgs/Read and match 01.png";
import img1 from "../../../assets/unit1/imgs/Read and match 02.png";

import "./Page8_Q3.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import helloSound from "../../../assets/unit1/Page 8 - B/Hello.mp3";
import goodbyeSound from "../../../assets/unit1/Page 8 - B/Goodbye!.mp3";
export default function Page8_Q3() {
  const [previewLine, setPreviewLine] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const sentenceRefs = useRef({});
  const imageRefs = useRef([]);

  const sentenceOrder = ["Hello! I’m John.", "Goodbye!"];
  const [lines, setLines] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [firstDot, setFirstDot] = useState(null);
  const containerRef = useRef(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [locked, setLocked] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const sentenceAudioRef = useRef(null);
  const updatePreviewLine = (startPoint, imageElement) => {
    if (!startPoint || !imageElement) return;

    const rect = containerRef.current.getBoundingClientRect();

    const imageDotId = imageElement.dataset.dotId;

    const dot = document.getElementById(imageDotId);

    if (!dot) return;

    const dotRect = dot.getBoundingClientRect();

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: dotRect.left - rect.left + 8,
      y2: dotRect.top - rect.top + 8,
    });
  };
  const startKeyboardMatch = (word, dotId) => {
    if (showAnswer || locked) return;

    const dot = document.getElementById(dotId);
    if (!dot) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();

    // إذا الجملة كانت موصولة من قبل، شيل التوصيل القديم
    setLines((prev) => prev.filter((line) => line.word !== word));

    setWrongWords((prev) => prev.filter((item) => item !== word));

    setSelectedWord(word);

    const startPoint = {
      word,
      x: dotRect.left - rect.left + 8,
      y: dotRect.top - rect.top + 8,
    };

    setFirstDot(startPoint);
    setAnnouncement(
      `${word} selected. Use Tab or Shift plus Tab to choose a picture, then press Enter or Space to connect.`,
    );

    // أول صورة مباشرة
    requestAnimationFrame(() => {
      const firstImage = imageRefs.current[0];

      if (firstImage) {
        firstImage.focus();

        updatePreviewLine(startPoint, firstImage);
      }
    }, 0);
  };
  const handleImageKeyboard = (e, imageIndex, imageId) => {
    if (!firstDot) return;

    // =========================
    // TAB فقط بين الصور
    // =========================
    if (e.key === "Tab") {
      e.preventDefault();

      let nextIndex;

      if (e.shiftKey) {
        nextIndex =
          imageIndex === 0 ? imageRefs.current.length - 1 : imageIndex - 1;
      } else {
        nextIndex =
          imageIndex === imageRefs.current.length - 1 ? 0 : imageIndex + 1;
      }

      const nextImage = imageRefs.current[nextIndex];

      if (nextImage) {
        nextImage.focus();

        updatePreviewLine(firstDot, nextImage);
      }

      return;
    }

    // =========================
    // ENTER = ثبت التوصيل
    // =========================
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      commitKeyboardMatch(imageId, true);

      return;
    }

    // Escape يلغي الاختيار ويرجع التركيز للجملة التي بدأ منها المستخدم.
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const currentWord = firstDot.word;

      setFirstDot(null);
      setPreviewLine(null);
      setSelectedWord(null);
      setSelectedImage(null);
      setAnnouncement(
        `${currentWord} selection cancelled. Choose a sentence from the left side.`,
      );

      requestAnimationFrame(() => {
        sentenceRefs.current[currentWord]?.focus();
      });
    }
  };
  const commitKeyboardMatch = (imageId, moveFocusToNextSentence = false) => {
    if (!firstDot) return;

    const dot = document.querySelector(`[data-image="${imageId}"]`);

    if (!dot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const dotRect = dot.getBoundingClientRect();

    const currentWord = firstDot.word;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,

      x2: dotRect.left - rect.left + 8,

      y2: dotRect.top - rect.top + 8,

      word: currentWord,
      image: imageId,
    };

    setLines((prev) => {
      const filtered = prev.filter(
        (line) => line.word !== currentWord && line.image !== imageId,
      );

      return [...filtered, newLine];
    });

    setSelectedImage(imageId);

    // خلصنا matching
    setFirstDot(null);
    setPreviewLine(null);
    if (!moveFocusToNextSentence) {
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedImage(null);
      }, 300);

      return;
    }

    setAnnouncement(
      `${currentWord} connected. Focus returned to the next sentence.`,
    );

    setTimeout(() => {
      setSelectedWord(null);
      setSelectedImage(null);

      // روح مباشرة للجملة التالية
      const currentIndex = sentenceOrder.indexOf(currentWord);

      const nextIndex =
        currentIndex === sentenceOrder.length - 1 ? 0 : currentIndex + 1;

      const nextWord = sentenceOrder[nextIndex];

      sentenceRefs.current[nextWord]?.focus();
    }, 100);
  };
  const playSentenceSound = (sound) => {
    if (!sound) return;

    if (sentenceAudioRef.current) {
      sentenceAudioRef.current.pause();
      sentenceAudioRef.current.currentTime = 0;
      sentenceAudioRef.current.src = sound;
      sentenceAudioRef.current.play();
    }
  };
  const correctMatches = [
    { word: "Hello! I’m John.", image: "img1" },
    { word: "Goodbye!", image: "img2" },
  ];

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return;

    const word = e.target.dataset.letter;

    const rect = containerRef.current.getBoundingClientRect();

    // إذا الجملة موصولة من قبل، احذف توصيلها القديم
    setLines((prev) => prev.filter((line) => line.word !== word));

    // امسح علامة الخطأ عنها لو كانت موجودة
    setWrongWords((prev) => prev.filter((item) => item !== word));

    setSelectedWord(word);

    setFirstDot({
      word,
      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  // ============================
  // 2️⃣ الضغط على النقطة الثانية (end-dot)
  // ============================
  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return;
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();
    const image = e.target.dataset.image;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,
      word: firstDot.word,
      image,
    };

    setLines((prev) => {
      // إذا نقطة الصورة موصولة من قبل، احذف التوصيل القديم
      const withoutOldConnection = prev.filter((line) => line.image !== image);

      // وحط التوصيل الجديد مكانه
      return [...withoutOldConnection, newLine];
    });
    setSelectedImage(image);

    setTimeout(() => {
      setSelectedWord(null);
      setSelectedImage(null);
    }, 300);

    setFirstDot(null);
  };
  // ============================
  // 3️⃣ Check Answers
  // ============================
  const checkAnswers = () => {
    if (showAnswer || locked) return;

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );
      return;
    }

    let wrong = [];
    let correctCount = 0;

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );
      if (isCorrect) correctCount++;
      else wrong.push(line.word);
    });

    setWrongWords(wrong);

    const total = correctMatches.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${correctCount} / ${total}
      </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
    setLocked(true);
  };

  return (
    <div className="matching-wrapper" style={{ padding: "30px" }}>
      <div className="div-forall">
        <h5 className="header-title-page8">
          <span className="ex-A">B</span>Read and match.
        </h5>
        <audio ref={sentenceAudioRef} style={{ display: "none" }} />

        <span className="sr-only">
          Read and match. Use Tab to move through the sentences on the left and
          press Enter or Space to select one. Focus then moves to the pictures.
          Use Tab or Shift plus Tab to move only through the pictures, then
          press Enter or Space to connect. Press Escape to cancel and return to
          the selected sentence.
        </span>

        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div
          key={resetKey}
          className="container-unit1-p8-exb w-full"
          ref={containerRef}
        >
          {/* Row 1 */}
          <div className="matching-row">
            <div className="word-with-dot">
              <span className="span-num">1</span>
              <div style={{ position: "relative" }}>
                {/* الكلمة تشغّل كليك على الدوت */}
                <span
                  ref={(el) => {
                    sentenceRefs.current["Hello! I’m John."] = el;
                  }}
                  className={`word-text ${
                    selectedWord === "Hello! I’m John." ? "selected-item" : ""
                  } ${locked || showAnswer ? "disabled-word" : ""}`}
                  role="button"
                  tabIndex={locked || showAnswer || firstDot ? -1 : 0}
                  aria-label="Hello! I'm John. Press Enter to start matching."
                  onClick={() => {
                    if (locked || showAnswer) return;

                    // الصوت زي ما كان
                    playSentenceSound(helloSound);

                    // الماوس يضل يعمل التوصيل بالطريقة الأصلية
                    document.getElementById("dot-hello").click();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      if (locked || showAnswer) return;

                      // الصوت
                      playSentenceSound(helloSound);

                      // يبدأ سيناريو الكيبورد الجديد
                      startKeyboardMatch("Hello! I’m John.", "dot-hello");
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "3px solid #2563eb";
                    e.currentTarget.style.outlineOffset = "4px";
                    e.currentTarget.style.borderRadius = "6px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                  style={{
                    cursor: "pointer",
                    width: "190px",
                  }}
                >
                  Hello! I’m John.
                </span>{" "}
                {wrongWords.includes("Hello! I’m John.") && (
                  <span className="error-mark">✕</span>
                )}
              </div>
              <div className="dot-wrapper">
                <div
                  id="dot-hello"
                  className="dot start-dot"
                  data-letter="Hello! I’m John."
                  onClick={handleStartDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                ></div>
              </div>
            </div>

            <div className="img-with-dot">
              <div className="dot-wrapper">
                <div
                  id="img2-dot"
                  className="dot end-dot"
                  data-image="img2"
                  onClick={handleEndDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                ></div>
              </div>

              {/* الصورة تشغّل كليك على الدوت */}
              <img
                ref={(el) => {
                  imageRefs.current[0] = el;
                }}
                data-dot-id="img2-dot"
                src={img2}
                className={`matched-img ${
                  selectedImage === "img2" ? "selected-item" : ""
                } ${locked || showAnswer ? "disabled-hover" : ""}`}
                alt="Matching picture 1"
                role="button"
                tabIndex={
                  locked || showAnswer || !firstDot ? -1 : 0
                }
                aria-label={
                  firstDot
                    ? `Picture 1. Press Enter to match with ${firstDot.word}.`
                    : "Matching picture 1"
                }
                onFocus={(e) => {
                  if (firstDot) {
                    e.currentTarget.style.outline = "3px solid #2563eb";

                    e.currentTarget.style.outlineOffset = "5px";

                    e.currentTarget.style.transform = "scale(1.05)";

                    updatePreviewLine(firstDot, e.currentTarget);
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";

                  e.currentTarget.style.transform = "scale(1)";
                }}
                onKeyDown={(e) => handleImageKeyboard(e, 0, "img2")}
                onClick={() => {
                  if (firstDot) {
                    commitKeyboardMatch("img2", false);
                  } else {
                    document.getElementById("img2-dot").click();
                  }
                }}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="matching-row">
            <div className="word-with-dot">
              <span className="span-num">2</span>
              <div style={{ position: "relative" }}>
                <span
                  ref={(el) => {
                    sentenceRefs.current["Goodbye!"] = el;
                  }}
                  className={`word-text ${
                    selectedWord === "Goodbye!" ? "selected-item" : ""
                  } ${locked || showAnswer ? "disabled-word" : ""}`}
                  role="button"
                  tabIndex={locked || showAnswer || firstDot ? -1 : 0}
                  aria-label="Goodbye. Press Enter to start matching."
                  onClick={() => {
                    if (locked || showAnswer) return;

                    // الصوت زي ما كان
                    playSentenceSound(goodbyeSound);

                    // الماوس يضل زي ما كان
                    document.getElementById("dot-goodbye").click();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      if (locked || showAnswer) return;

                      // الصوت
                      playSentenceSound(goodbyeSound);

                      // سيناريو الكيبورد
                      startKeyboardMatch("Goodbye!", "dot-goodbye");
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = "3px solid #2563eb";
                    e.currentTarget.style.outlineOffset = "4px";
                    e.currentTarget.style.borderRadius = "6px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = "none";
                  }}
                  style={{
                    cursor: "pointer",
                    width: "190px",
                  }}
                >
                  Goodbye!
                </span>{" "}
                {wrongWords.includes("Goodbye!") && (
                  <span className="error-mark">✕</span>
                )}
              </div>
              <div className="dot-wrapper">
                <div
                  id="dot-goodbye"
                  className="dot start-dot"
                  data-letter="Goodbye!"
                  onClick={handleStartDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                ></div>
              </div>
            </div>

            <div className="img-with-dot">
              <div className="dot-wrapper">
                <div
                  id="img1-dot"
                  className="dot end-dot"
                  data-image="img1"
                  onClick={handleEndDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                ></div>
              </div>

              <img
                ref={(el) => {
                  imageRefs.current[1] = el;
                }}
                data-dot-id="img1-dot"
                src={img1}
                className={`matched-img ${
                  selectedImage === "img1" ? "selected-item" : ""
                } ${locked || showAnswer ? "disabled-hover" : ""}`}
                alt="Matching picture 2"
                role="button"
                tabIndex={
                  locked || showAnswer || !firstDot ? -1 : 0
                }
                aria-label={
                  firstDot
                    ? `Picture 2. Press Enter to match with ${firstDot.word}.`
                    : "Matching picture 2"
                }
                onFocus={(e) => {
                  if (firstDot) {
                    e.currentTarget.style.outline = "3px solid #2563eb";

                    e.currentTarget.style.outlineOffset = "5px";

                    e.currentTarget.style.transform = "scale(1.05)";

                    updatePreviewLine(firstDot, e.currentTarget);
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";

                  e.currentTarget.style.transform = "scale(1)";
                }}
                onKeyDown={(e) => handleImageKeyboard(e, 1, "img1")}
                onClick={() => {
                  if (firstDot) {
                    commitKeyboardMatch("img1", false);
                  } else {
                    document.getElementById("img1-dot").click();
                  }
                }}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
              />
            </div>
          </div>

          {/* SVG lines */}
          <svg className="lines-layer" aria-hidden="true">
            {/* الخطوط المثبتة */}
            {lines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}

            {/* الخط اللي ماسكه المستخدم حاليًا */}
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

      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLines([]);
            setWrongWords([]);
            setFirstDot(null);
            setShowAnswer(false);
            setLocked(false);
            setSelectedWord(null);
            setSelectedImage(null);
            setPreviewLine(null);
            setAnnouncement("Activity reset.");
            setResetKey((k) => k + 1);
          }}
          className="try-again-button"
          title="Start again"
        >
          Start Again ↻
        </button>

        <button
          onClick={() => {
            const correctLines = [
              {
                word: "Hello! I’m John.",
                image: "img1",
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
              },
              { word: "Goodbye!", image: "img2", x1: 0, y1: 0, x2: 0, y2: 0 },
            ];

            const rect = containerRef.current.getBoundingClientRect();

            const getDotPosition = (selector) => {
              const el = document.querySelector(selector);
              if (!el) return { x: 0, y: 0 };
              const r = el.getBoundingClientRect();
              return {
                x: r.left - rect.left + 8,
                y: r.top - rect.top + 8,
              };
            };

            const finalLines = correctLines.map((line) => ({
              ...line,
              x1: getDotPosition(`[data-letter="${line.word}"]`).x,
              y1: getDotPosition(`[data-letter="${line.word}"]`).y,
              x2: getDotPosition(`[data-image="${line.image}"]`).x,
              y2: getDotPosition(`[data-image="${line.image}"]`).y,
            }));

            setLines(finalLines);
            setWrongWords([]);
            setSelectedWord(null);
            setSelectedImage(null);
            setFirstDot(null);
            setPreviewLine(null);
            setAnnouncement("Correct answers shown.");
            setShowAnswer(true);
            setLocked(false);
            setResetKey((k) => k + 1);
          }}
          className="show-answer-btn swal-continue"
          title="Show answer"
        >
          Show Answer
        </button>

        <button
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
