import React, { useEffect, useState, useRef } from "react";
import img1 from "../../../assets/unit9/imgs/U9P80EXEA1-01.svg";
import img2 from "../../../assets/unit9/imgs/U9P80EXEA1-02.svg";
import img3 from "../../../assets/unit9/imgs/U9P80EXEA1-03.svg";
import img4 from "../../../assets/unit9/imgs/U9P80EXEA1-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit9_Page5_Q1.css";
import ExerciseHeader from "../../ExerciseHeader";
import milkAudio from "../../../assets/unit9/sound/Page 80 - A 1/milk.mp3";
import momAudio from "../../../assets/unit9/sound/Page 80 - A 1/mom.mp3";
import nightAudio from "../../../assets/unit9/sound/Page 80 - A 1/night.mp3";
import nurseAudio from "../../../assets/unit9/sound/Page 80 - A 1/nurse.mp3";
import { FaVolumeUp } from "react-icons/fa";

const Unit9_Page5_Q1 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const [wrongImages, setWrongImages] = useState([]);
  // ⭐⭐ NEW: قفل الرسم بعد Check Answer
  const [locked, setLocked] = useState(false); //  ← إضافة جديدة
  const [firstDot, setFirstDot] = useState(null);
  const [previewPoint, setPreviewPoint] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lockedImages, setLockedImages] = useState([]);
  const audioRef = useRef(null);
  const [playingWord, setPlayingWord] = useState(null);
  const wordRefs = useRef({});
  const imageRefs = useRef({});
  const keyboardMatchRef = useRef(false);
  const correctMatches = [
    { word: "night", image: "img3" },
    { word: "nurse", image: "img1" },
    { word: "mom", image: "img4" },
    { word: "milk", image: "img2" },
  ];
  const wordAudios = {
    night: nightAudio,
    nurse: nurseAudio,
    mom: momAudio,
    milk: milkAudio,
  };
  const imageAlts = {
    img1: "A nurse.",
    img2: "A glass of milk.",
    img3: "A night scene.",
    img4: "A mother.",
  };

  const stopWordAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingWord(null);
  };

  const playWordAudio = (word) => {
    stopWordAudio();
    const audio = new Audio(wordAudios[word]);
    audioRef.current = audio;
    setPlayingWord(word);
    audio.play().catch(() => {
      if (audioRef.current === audio) audioRef.current = null;
      setPlayingWord(null);
    });
    audio.onended = () => {
      if (audioRef.current === audio) audioRef.current = null;
      setPlayingWord(null);
    };
    audio.onerror = audio.onended;
  };

  useEffect(
    () => () => {
      if (audioRef.current) audioRef.current.pause();
    },
    [],
  );

  const isWordLocked = (word) =>
    lines.some(
      (line) => line.word === word && lockedImages.includes(line.image),
    );

  const imageOrder = ["img1", "img2", "img3", "img4"];
  const wordOrder = ["night", "nurse", "mom", "milk"];

  const pointFor = (element) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    return {
      x: elementRect.left - containerRect.left + elementRect.width / 2,
      y: elementRect.top - containerRect.top + elementRect.height / 2,
    };
  };

  const commitMatch = (image, word, imageElement, wordElement) => {
    const keyboardCommit = keyboardMatchRef.current;
    const originSide = firstDot?.image ? "image" : "word";
    const originKey = firstDot?.image || firstDot?.word;
    const imagePoint = pointFor(imageElement);
    const wordPoint = pointFor(wordElement);
    const displacedImages = lines
      .filter(
        (line) =>
          !lockedImages.includes(line.image) &&
          (line.image === image || line.word === word),
      )
      .map((line) => line.image);

    setLines((previous) => {
      const preserved = previous.filter(
        (line) =>
          lockedImages.includes(line.image) ||
          (line.image !== image && line.word !== word),
      );
      return [
        ...preserved,
        {
          image,
          word,
          x1: imagePoint.x,
          y1: imagePoint.y,
          x2: wordPoint.x,
          y2: wordPoint.y,
        },
      ];
    });
    setWrongImages((previous) =>
      previous.filter(
        (item) => item !== image && !displacedImages.includes(item),
      ),
    );
    setFirstDot(null);
    setPreviewPoint(null);
    if (keyboardCommit && originKey) {
      const order = originSide === "image" ? imageOrder : wordOrder;
      const refs =
        originSide === "image" ? imageRefs.current : wordRefs.current;
      const currentIndex = order.indexOf(originKey);
      const orderedNext = [
        ...order.slice(currentIndex + 1),
        ...order.slice(0, currentIndex),
      ];
      const nextKey = orderedNext.find((key) =>
        originSide === "image"
          ? !lockedImages.includes(key)
          : !isWordLocked(key),
      );
      requestAnimationFrame(() => refs[nextKey]?.focus());
    }
  };

  const cancelMatch = () => {
    const origin = firstDot?.image
      ? imageRefs.current[firstDot.image]
      : wordRefs.current[firstDot?.word];
    setFirstDot(null);
    setPreviewPoint(null);
    requestAnimationFrame(() => origin?.focus());
  };

  const availableTargetKeys = (side) =>
    side === "image"
      ? imageOrder.filter((image) => !lockedImages.includes(image))
      : wordOrder.filter((word) => !isWordLocked(word));

  const moveTargetFocus = (side, currentKey, backwards) => {
    const keys = availableTargetKeys(side);
    if (!keys.length) return;
    const position = keys.indexOf(currentKey);
    const nextPosition = backwards
      ? (position <= 0 ? keys.length : position) - 1
      : (position + 1) % keys.length;
    const refs = side === "image" ? imageRefs.current : wordRefs.current;
    requestAnimationFrame(() => refs[keys[nextPosition]]?.focus());
  };

  const handleEndpointFocus = (side, key) => {
    if (!firstDot?.keyboard) return;
    const isOppositeSide =
      (firstDot?.image && side === "word") ||
      (firstDot?.word && side === "image");
    if (!isOppositeSide) return;
    const element = containerRef.current?.querySelector(
      side === "image" ? `[data-image="${key}"]` : `[data-word="${key}"]`,
    );
    if (element) setPreviewPoint(pointFor(element));
  };

  const handleEndpointKeyDown = (event, side, key, activate) => {
    if (event.key === "Escape" && firstDot) {
      event.preventDefault();
      cancelMatch();
      return;
    }
    const isTarget =
      (firstDot?.image && side === "word") ||
      (firstDot?.word && side === "image");
    if (event.key === "Tab" && isTarget) {
      event.preventDefault();
      moveTargetFocus(side, key, event.shiftKey);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      keyboardMatchRef.current = true;
      activate();
      keyboardMatchRef.current = false;
    }
  };

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return;

    const image = e.target.dataset.image || null;
    if (!image || lockedImages.includes(image)) return;

    if (firstDot?.word) {
      commitMatch(
        image,
        firstDot.word,
        e.target,
        containerRef.current.querySelector(
          `[data-word="${firstDot.word}"]`,
        ),
      );
      return;
    }

    setFirstDot({
      image,
      keyboard: keyboardMatchRef.current,
      ...pointFor(e.target),
    });
    setPreviewPoint(null);
    const firstAvailableWord = correctMatches.find(
      (match) => !isWordLocked(match.word),
    )?.word;
    if (firstAvailableWord) {
      requestAnimationFrame(() => wordRefs.current[firstAvailableWord]?.focus());
    }
  };

  // ============================
  // 2️⃣ الضغط على النقطة الثانية (end-dot)
  // ============================
  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return;
    const endWord = e.target.dataset.word || null;
    if (!endWord || isWordLocked(endWord)) return;

    if (firstDot?.image) {
      commitMatch(
        firstDot.image,
        endWord,
        containerRef.current.querySelector(
          `[data-image="${firstDot.image}"]`,
        ),
        e.target,
      );
      return;
    }

    setFirstDot({
      word: endWord,
      keyboard: keyboardMatchRef.current,
      ...pointFor(e.target),
    });
    setPreviewPoint(null);
    const firstAvailableImage = imageOrder.find(
      (image) => !lockedImages.includes(image),
    );
    if (firstAvailableImage) {
      requestAnimationFrame(() =>
        imageRefs.current[firstAvailableImage]?.focus(),
      );
    }
  };
  const checkAnswers2 = () => {
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل بعد القفل

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );
      return;
    }

    let correctCount = 0;
    let wrong = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.image); // ✅ خزّني اسم صورة الخطأ فقط
      }
    });

    const correctImages = lines
      .filter((line) =>
        correctMatches.some(
          (pair) => pair.word === line.word && pair.image === line.image,
        ),
      )
      .map((line) => line.image);
    setWrongImages(wrong);
    setLockedImages((previous) => [
      ...new Set([...previous, ...correctImages]),
    ]);
    if (correctCount === correctMatches.length) setLocked(true);
    setFirstDot(null);
    setPreviewPoint(null);

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
  };

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
        <ExerciseHeader
          sectionLetter="A"
          questionNumber="1"
          title="Look, read, and match."
          subTitle="Match night, nurse, mom, and milk to the correct pictures."
        />

        <div className="match-wrapper2" ref={containerRef}>
          {/* الجمل */}

          {/* الصور */}
          <div className="match-images-row2">
            <div
              className="img-box2"
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              <span style={{ color: "darkblue", fontWeight: "700" }}>1 </span>
              <img
                ref={(node) => {
                  imageRefs.current.img1 = node;
                }}
                src={img1}
                className={`clickable-img-unit2-p7-q2 ${
                  lockedImages.includes("img1") || showAnswer ? "disabled-hover" : ""
                } ${firstDot?.image === "img1" ? "selected-match" : ""}`}
                alt={imageAlts.img1}
                role="button"
                tabIndex={lockedImages.includes("img1") || showAnswer ? -1 : 0}
                aria-label="Select picture 1, a nurse"
                onFocus={() => handleEndpointFocus("image", "img1")}
                onClick={() => document.getElementById("img1-dot").click()}
                onKeyDown={(e) =>
                  handleEndpointKeyDown(e, "image", "img1", () =>
                    document.getElementById("img1-dot").click(),
                  )
                }
              />
              {wrongImages.includes("img1") && (
                <span className="error-mark-img-unit7-p6-q2" aria-hidden="true">✕</span>
              )}
              <div
                className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                data-image="img1"
                id="img1-dot"
                onClick={handleStartDotClick}
                tabIndex={-1}
                aria-hidden="true"
              ></div>
            </div>

            <div
              className="img-box2"
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              <span style={{ color: "darkblue", fontWeight: "700" }}>2 </span>
              <img
                ref={(node) => {
                  imageRefs.current.img2 = node;
                }}
                src={img2}
                className={`clickable-img-unit2-p7-q2 ${
                  lockedImages.includes("img2") || showAnswer ? "disabled-hover" : ""
                } ${firstDot?.image === "img2" ? "selected-match" : ""}`}
                alt={imageAlts.img2}
                role="button"
                tabIndex={lockedImages.includes("img2") || showAnswer ? -1 : 0}
                aria-label="Select picture 2, milk"
                onFocus={() => handleEndpointFocus("image", "img2")}
                onClick={() => document.getElementById("img2-dot").click()}
                onKeyDown={(e) =>
                  handleEndpointKeyDown(e, "image", "img2", () =>
                    document.getElementById("img2-dot").click(),
                  )
                }
              />{" "}
              {wrongImages.includes("img2") && (
                <span className="error-mark-img-unit7-p6-q2" aria-hidden="true">✕</span>
              )}
              <div
                className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                data-image="img2"
                id="img2-dot"
                onClick={handleStartDotClick}
                tabIndex={-1}
                aria-hidden="true"
              ></div>
            </div>

            <div
              className="img-box2"
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              <span style={{ color: "darkblue", fontWeight: "700" }}>3 </span>
              <img
                ref={(node) => {
                  imageRefs.current.img3 = node;
                }}
                className={`clickable-img-unit2-p7-q2 ${
                  lockedImages.includes("img3") || showAnswer ? "disabled-hover" : ""
                } ${firstDot?.image === "img3" ? "selected-match" : ""}`}
                src={img3}
                alt={imageAlts.img3}
                role="button"
                tabIndex={lockedImages.includes("img3") || showAnswer ? -1 : 0}
                aria-label="Select picture 3, night"
                onFocus={() => handleEndpointFocus("image", "img3")}
                onClick={() => document.getElementById("img3-dot").click()}
                onKeyDown={(e) =>
                  handleEndpointKeyDown(e, "image", "img3", () =>
                    document.getElementById("img3-dot").click(),
                  )
                }
              />{" "}
              {wrongImages.includes("img3") && (
                <span className="error-mark-img-unit7-p6-q2" aria-hidden="true">✕</span>
              )}
              <div
                className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                data-image="img3"
                id="img3-dot"
                onClick={handleStartDotClick}
                tabIndex={-1}
                aria-hidden="true"
              ></div>
            </div>
            <div
              className="img-box2"
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              <span style={{ color: "darkblue", fontWeight: "700" }}>4 </span>
              <img
                ref={(node) => {
                  imageRefs.current.img4 = node;
                }}
                src={img4}
                className={`clickable-img-unit2-p7-q2 ${
                  lockedImages.includes("img4") || showAnswer ? "disabled-hover" : ""
                } ${firstDot?.image === "img4" ? "selected-match" : ""}`}
                alt={imageAlts.img4}
                role="button"
                tabIndex={lockedImages.includes("img4") || showAnswer ? -1 : 0}
                aria-label="Select picture 4, a mother"
                onFocus={() => handleEndpointFocus("image", "img4")}
                onClick={() => document.getElementById("img4-dot").click()}
                onKeyDown={(e) =>
                  handleEndpointKeyDown(e, "image", "img4", () =>
                    document.getElementById("img4-dot").click(),
                  )
                }
              />{" "}
              {wrongImages.includes("img4") && (
                <span className="error-mark-img-unit7-p6-q2" aria-hidden="true">✕</span>
              )}
              <div
                className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2"
                data-image="img4"
                id="img4-dot"
                onClick={handleStartDotClick}
                tabIndex={-1}
                aria-hidden="true"
              ></div>
            </div>
          </div>
          <div className="match-words-row2">
            <div
              className="word-box2"
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h5
                  ref={(node) => {
                    wordRefs.current.night = node;
                  }}
                  className={`h5-unit6-p5-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  } ${firstDot?.word === "night" ? "selected-match" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Night. Press Enter or Space to hear and select."
                  aria-pressed={firstDot?.word === "night"}
                  style={{ position: "relative" }}
                  onFocus={() => handleEndpointFocus("word", "night")}
                  onClick={() => {
                    playWordAudio("night");
                    if (!isWordLocked("night") && !showAnswer) {
                      document.getElementById("bored-dot").click();
                    }
                  }}
                  onKeyDown={(e) =>
                    handleEndpointKeyDown(e, "word", "night", () => {
                      playWordAudio("night");
                      if (!isWordLocked("night") && !showAnswer) {
                        document.getElementById("bored-dot").click();
                      }
                    })
                  }
                >
                  night
                  {playingWord === "night" && (
                    <FaVolumeUp
                      aria-hidden="true"
                      style={{ position: "absolute", top: 4, right: 4, pointerEvents: "none", zIndex: 5 }}
                    />
                  )}
                </h5>
                <div
                  className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                  data-word="night"
                  id="bored-dot"
                  onClick={handleEndDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                ></div>
              </div>
            </div>

            <div className="word-box2">
              <div>
                <h5
                  ref={(node) => {
                    wordRefs.current.nurse = node;
                  }}
                  className={`h5-unit6-p5-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  } ${firstDot?.word === "nurse" ? "selected-match" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Nurse. Press Enter or Space to hear and select."
                  aria-pressed={firstDot?.word === "nurse"}
                  style={{ position: "relative" }}
                  onFocus={() => handleEndpointFocus("word", "nurse")}
                  onClick={() => {
                    playWordAudio("nurse");
                    if (!isWordLocked("nurse") && !showAnswer) {
                      document.getElementById("cold-dot").click();
                    }
                  }}
                  onKeyDown={(e) =>
                    handleEndpointKeyDown(e, "word", "nurse", () => {
                      playWordAudio("nurse");
                      if (!isWordLocked("nurse") && !showAnswer) {
                        document.getElementById("cold-dot").click();
                      }
                    })
                  }
                >
                  nurse
                  {playingWord === "nurse" && (
                    <FaVolumeUp
                      aria-hidden="true"
                      style={{ position: "absolute", top: 4, right: 4, pointerEvents: "none", zIndex: 5 }}
                    />
                  )}
                </h5>
                <div
                  className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                  data-word="nurse"
                  id="cold-dot"
                  onClick={handleEndDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                ></div>
              </div>
            </div>

            <div className="word-box2">
              {" "}
              <div>
                <h5
                  ref={(node) => {
                    wordRefs.current.mom = node;
                  }}
                  className={`h5-unit6-p5-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  } ${firstDot?.word === "mom" ? "selected-match" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Mom. Press Enter or Space to hear and select."
                  aria-pressed={firstDot?.word === "mom"}
                  style={{ position: "relative" }}
                  onFocus={() => handleEndpointFocus("word", "mom")}
                  onClick={() => {
                    playWordAudio("mom");
                    if (!isWordLocked("mom") && !showAnswer) {
                      document.getElementById("scared-dot").click();
                    }
                  }}
                  onKeyDown={(e) =>
                    handleEndpointKeyDown(e, "word", "mom", () => {
                      playWordAudio("mom");
                      if (!isWordLocked("mom") && !showAnswer) {
                        document.getElementById("scared-dot").click();
                      }
                    })
                  }
                >
                  mom
                  {playingWord === "mom" && (
                    <FaVolumeUp
                      aria-hidden="true"
                      style={{ position: "absolute", top: 4, right: 4, pointerEvents: "none", zIndex: 5 }}
                    />
                  )}
                </h5>
                <div
                  className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                  data-word="mom"
                  id="scared-dot"
                  onClick={handleEndDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                ></div>
              </div>
            </div>
            <div className="word-box2">
              <div>
                <h5
                  ref={(node) => {
                    wordRefs.current.milk = node;
                  }}
                  className={`h5-unit6-p5-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  } ${firstDot?.word === "milk" ? "selected-match" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Milk. Press Enter or Space to hear and select."
                  aria-pressed={firstDot?.word === "milk"}
                  style={{ position: "relative" }}
                  onFocus={() => handleEndpointFocus("word", "milk")}
                  onClick={() => {
                    playWordAudio("milk");
                    if (!isWordLocked("milk") && !showAnswer) {
                      document.getElementById("hungry-dot").click();
                    }
                  }}
                  onKeyDown={(e) =>
                    handleEndpointKeyDown(e, "word", "milk", () => {
                      playWordAudio("milk");
                      if (!isWordLocked("milk") && !showAnswer) {
                        document.getElementById("hungry-dot").click();
                      }
                    })
                  }
                >
                  milk
                  {playingWord === "milk" && (
                    <FaVolumeUp
                      aria-hidden="true"
                      style={{ position: "absolute", top: 4, right: 4, pointerEvents: "none", zIndex: 5 }}
                    />
                  )}
                </h5>
                <div
                  className="dot22-unit7-p6-q2 end-dot22-unit7-p6-q2"
                  data-word="milk"
                  id="hungry-dot"
                  onClick={handleEndDotClick}
                  tabIndex={-1}
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </div>
          {/* الخطوط */}
          <svg className="lines-layer2">
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}
            {firstDot && previewPoint && (
              <line
                x1={firstDot.x}
                y1={firstDot.y}
                x2={previewPoint.x}
                y2={previewPoint.y}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            )}
          </svg>
        </div>
      </div>

      <div className="action-buttons-container">
        <button
          onClick={() => {
            stopWordAudio();
            setLines([]);
            setWrongImages([]);
            setShowAnswer(false);
            setLocked(false); // ⭐⭐ NEW: السماح بالرسم مجدداً
            setLockedImages([]);
            setFirstDot(null);
            setPreviewPoint(null);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        <button
          onClick={() => {
            stopWordAudio();
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

            const finalLines = correctMatches.map((line) => ({
              ...line,
              x1: getDotPosition(`[data-word="${line.word}"]`).x,
              y1: getDotPosition(`[data-word="${line.word}"]`).y,
              x2: getDotPosition(`[data-image="${line.image}"]`).x,
              y2: getDotPosition(`[data-image="${line.image}"]`).y,
            }));

            setLines(finalLines);
            setWrongImages([]);
            setShowAnswer(true);
            setLocked(true); // ⭐⭐ NEW: منع الرسم أثناء Show Answer
            setLockedImages(correctMatches.map((match) => match.image));
            setFirstDot(null);
            setPreviewPoint(null);
          }}
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

export default Unit9_Page5_Q1;
