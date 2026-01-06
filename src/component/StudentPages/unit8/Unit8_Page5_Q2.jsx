import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/unit8/imgs/U8P68EXEA2-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P68EXEA2-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P68EXEA2-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P68EXEA2-04.svg";
// import img5 from "../../../assets/unit8/imgs/U8P68EXEA2-05.svg";
import sound1 from "../../../assets/unit8/sound/U8P68EXEA2.mp3";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit8_Page5_Q2.css";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
const Unit8_Page5_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const stopAtSecond = 12.08;
  const [wrongImages, setWrongImages] = useState([]);
    const [firstDot, setFirstDot] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    // ⭐⭐⭐ NEW: منع الرسم بعد Check Answer
    const [locked, setLocked] = useState(false);
  const audioRef = useRef(null);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const correctMatches = [
    { word: "s", image: ["img1", "img2", "img4"] },
    { word: "z", image: ["img3"] },
  ];
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 6.22,
      text: "Page 68. Right activities. Exercise A, number two.",
    },
    { start: 6.25, end: 12.15, text: "Does it begin with S or Z? Listen and match." },
    { start: 12.17, end: 14.23, text: "1-sandwich " },
    { start: 14.25, end: 17.00, text: "2-sponge" },
    { start: 17.03, end: 19.07, text: "3-zero" },
    { start: 19.10, end: 21.24, text: "4-soup" },
  ];

  // ================================
  // ✔ Update caption highlight
  // ================================
  const updateCaption = (time) => {
    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end
    );
    setActiveIndex(index);
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();

    const interval = setInterval(() => {
      if (audio.currentTime >= stopAtSecond) {
        audio.pause();
        setPaused(true);
        setIsPlaying(false);
        setShowContinue(true);
        clearInterval(interval);
      }
    }, 100);

    // عند انتهاء الأوديو يرجع يبطل أنيميشن + يظهر Continue
    const handleEnded = () => {
      const audio = audioRef.current;
      audio.currentTime = 0; // ← يرجع للبداية
      setActiveIndex(null);
      setPaused(false);
      setIsPlaying(false);
      setShowContinue(true);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(interval);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000); // كل ثانية
    if (activeIndex === -1 || activeIndex === null) return;

    const el = document.getElementById(`caption-${activeIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => clearInterval(timer);
  }, [activeIndex]);

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return; // ⭐ NEW: لا تسمح بالرسم عند القفل

    const rect = containerRef.current.getBoundingClientRect();
    const imgId = e.target.dataset.image;

    // ⭐⭐⭐ NEW: منع رسم أكثر من خط من نفس الصورة
    const alreadyUsed = lines.some((line) => line.image === imgId);
    if (alreadyUsed) return;
    // -----------------------------------------------------

    setFirstDot({
      image: imgId,
      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  // ============================
  // 2️⃣ الضغط على النقطة الثانية (end-dot)
  // ============================
  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return; // ⭐ NEW
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,

      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,

      word: e.target.dataset.word, // حرف d أو t
      image: firstDot.image, // الصورة المختارة
    };

    setLines((prev) => [...prev, newLine]);
    setFirstDot(null);
  };
  // ============================
  // 3️⃣ Check Answers
  // ============================
  const checkAnswers2 = () => {
    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking."
      );
      return;
    }

    let correctCount = 0;
    let wrong = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image.includes(line.image)
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.image); // ✅ خزّني اسم صورة الخطأ فقط
      }
    });

    setWrongImages(wrong); // ✅ حفظ الصور الغلط
    setLocked(true); // ⭐⭐⭐ NEW: أقفل الرسم بعد الضغط على Check Answer

    const total = 4;
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
  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setPaused(false);
      setIsPlaying(true);
    } else {
      audio.pause();
      setPaused(true);
      setIsPlaying(false);
    }
  };
  const handleShowAnswer = () => {
    // امنعي التعديل
    setShowAnswer(true);
    setLocked(true); // ⭐ NEW: ممنوع الرسم بعد Show Answer

    // امسحي الخطوط القديمة + الغلط
    setLines([]);
    setWrongImages([]);

    const rect = containerRef.current.getBoundingClientRect();

    // ارسم الخطوط الصحيحة
    let answerLines = [];

    correctMatches.forEach((pair) => {
      pair.image.forEach((imgId) => {
        // جيبي نقط البداية
        const startDot = document.querySelector(`[data-image="${imgId}"]`);
        const endDot = document.querySelector(`[data-word="${pair.word}"]`);

        if (startDot && endDot) {
          answerLines.push({
            x1: startDot.getBoundingClientRect().left - rect.left + 8,
            y1: startDot.getBoundingClientRect().top - rect.top + 8,
            x2: endDot.getBoundingClientRect().left - rect.left + 8,
            y2: endDot.getBoundingClientRect().top - rect.top + 8,
            word: pair.word,
            image: imgId,
          });
        }
      });
    });

    setLines(answerLines);
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
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="page7-q2-container2">
          <h5 className="header-title-page8">
            <span style={{ color: "purple" }}>2</span> Does it begin with{" "}
            <span style={{ color: "red" }}>s</span> or{" "}
            <span style={{ color: "red" }}>z</span>? Listen and match.
          </h5>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              className="audio-popup-read"
              style={{
                width: "50%",
                marginTop: "0px",
              }}
            >
              <div className="audio-inner player-ui">
                <audio
                  ref={audioRef}
                  src={sound1}
                  onTimeUpdate={(e) => {
                    const time = e.target.currentTime;
                    setCurrent(time);
                    updateCaption(time);
                  }}
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                ></audio>
                {/* Play / Pause */}
                {/* Play / Pause */}
                {/* الوقت - السلايدر - الوقت */}
                <div className="top-row">
                  <span className="audio-time">
                    {new Date(current * 1000).toISOString().substring(14, 19)}
                  </span>

                  <input
                    type="range"
                    className="audio-slider"
                    min="0"
                    max={duration}
                    value={current}
                    onChange={(e) => {
                      audioRef.current.currentTime = e.target.value;
                      updateCaption(Number(e.target.value));
                    }}
                    style={{
                      background: `linear-gradient(to right, #430f68 ${
                        (current / duration) * 100
                      }%, #d9d9d9ff ${(current / duration) * 100}%)`,
                    }}
                  />

                  <span className="audio-time">
                    {new Date(duration * 1000).toISOString().substring(14, 19)}
                  </span>
                </div>
                {/* الأزرار 3 أزرار بنفس السطر */}
                <div className="bottom-row">
                  {/* فقاعة */}
                  <div
                    className={`round-btn ${showCaption ? "active" : ""}`}
                    style={{ position: "relative" }}
                    onClick={() => setShowCaption(!showCaption)}
                  >
                    <TbMessageCircle size={36} />
                    <div
                      className={`caption-inPopup ${showCaption ? "show" : ""}`}
                      style={{ top: "100%", left: "10%" }}
                    >
                      {captions.map((cap, i) => (
                        <p
                          key={i}
                          id={`caption-${i}`}
                          className={`caption-inPopup-line2 ${
                            activeIndex === i ? "active" : ""
                          }`}
                        >
                          {cap.text}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Play */}
                  <button className="play-btn2" onClick={togglePlay}>
                    {isPlaying ? <FaPause size={26} /> : <FaPlay size={26} />}
                  </button>

                  {/* Settings */}
                  <div className="settings-wrapper" ref={settingsRef}>
                    <button
                      className={`round-btn ${showSettings ? "active" : ""}`}
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <IoMdSettings size={36} />
                    </button>

                    {showSettings && (
                      <div className="settings-popup">
                        <label>Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volume}
                          onChange={(e) => {
                            setVolume(e.target.value);
                            audioRef.current.volume = e.target.value;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>{" "}
              </div>
            </div>
          </div>

          <div className="match-wrapper2-unit8-p5-q2 " ref={containerRef}>
            {/* الصور */}
            <div className="match-images-row2">
              <div className="img-box2">
                <img
                  src={img1}
                  alt=""
                   className={`matched-img2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("img1-dot").click()}
                />
                {wrongImages.includes("img1") && (
                  <span className="error-mark-img">✕</span>
                )}

                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img1"
                  id="img1-dot"
                  onClick={handleStartDotClick}
                ></div>
              </div>

              <div className="img-box2">
                <img
                  src={img2}
                  alt="img"
                   className={`matched-img2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("img2-dot").click()}
                />
                {wrongImages.includes("img2") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img2"
                  id="img2-dot"
                  onClick={handleStartDotClick}
                ></div>
              </div>

              <div className="img-box2">
                <img
                  src={img3}
                  alt=""
                   className={`matched-img2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("img3-dot").click()}
                />{" "}
                {wrongImages.includes("img3") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img3"
                  id="img3-dot"
                  onClick={handleStartDotClick}
                ></div>
              </div>
              <div className="img-box2">
                <img
                  src={img4}
                  alt=""
                   className={`matched-img2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("img4-dot").click()}
                />{" "}
                {wrongImages.includes("img4") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img4"
                  id="img4-dot"
                  onClick={handleStartDotClick}
                ></div>
              </div>
            </div>

            {/* الجمل */}
            <div className="match-words-row2">
              <div className="word-box2">
                <h5
                  id="d-char"
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
                  }}
                  className={`clickable-word-unit2-p7-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("s-dot").click()}
                >
                  s
                </h5>
                <div
                  className="dot2-unit2 end-dot2-unit2"
                  data-word="s"
                  id="s-dot"
                  onClick={handleEndDotClick}
                ></div>
              </div>

              <div className="word-box2">
                <h5
                  id="t-char"
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
                  }}
                  className={`clickable-word-unit2-p7-q2 ${
                    locked || showAnswer ? "disabled-hover" : ""
                  }`}
                  onClick={() => document.getElementById("z-dot").click()}
                >
                  z
                </h5>
                <div
                  className="dot2-unit2 end-dot2-unit2"
                  data-word="z"
                  id="z-dot"
                  onClick={handleEndDotClick}
                ></div>
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
            </svg>
          </div>
        </div>
        <div className="action-buttons-container">
          <button
            onClick={() => {
              setLines([]);
              setWrongImages([]);
              setShowAnswer(false); // ← رجع التعديل
              setLocked(false); // ⭐⭐⭐ NEW: إعادة فتح الرسم
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>{" "}
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
