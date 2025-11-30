import React, { useState, useRef, useEffect } from "react";
import img1 from "../../assets/img_unit2/imgs/33.jpg";
import img2 from "../../assets/img_unit2/imgs/34.jpg";
import img3 from "../../assets/img_unit2/imgs/35.jpg";
import img4 from "../../assets/img_unit2/imgs/36.jpg";
import img5 from "../../assets/img_unit2/imgs/37.jpg";
import sound1 from "../../assets/unit1/sounds/P17QF.mp3";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit8_Page5_Q2.css";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
const Unit8_Page5_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongImages, setWrongImages] = useState([]);
  const audioRef = useRef(null);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  // زر الكابشن
  const [isMuted, setIsMuted] = useState(false);
  const stopAtSecond = 7.3;
  const [paused, setPaused] = useState(false);

  const correctMatches = [
    { word: "s", image: ["img1", "img2", "img4"] },
    { word: "z", image: ["img3"] },
  ];
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();

    const interval = setInterval(() => {
      if (audio.currentTime >= stopAtSecond) {
        audio.pause();
        setPaused(true);
        setShowContinue(true);
        clearInterval(interval);
      }
    }, 250);

    // ⚡⚡ هنا الإضافة الوحيدة
    const handleEnded = () => {
      audio.currentTime = 0; // يرجع لأول ثانية
      audio.pause(); // يوقف
      setPaused(true); // زر البلاي يصير Play
      setShowContinue(true); // يظهر زر Continue
      // setActiveIndex(null); // يشيل الأنيميشن عن الكلمات
    };

    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    // audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded); // 👈 الإضافة
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded); // 👈 تنظيف الإضافة
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000); // كل ثانية

    return () => clearInterval(timer);
  }, []);

  const handleDotDown2 = (e) => {
    startPoint = e.target;

    const rect = containerRef.current.getBoundingClientRect();
    const x = startPoint.getBoundingClientRect().left - rect.left + 8;
    const y = startPoint.getBoundingClientRect().top - rect.top + 8;

    setLines((prev) => [...prev, { x1: x, y1: y, x2: x, y2: y }]);

    window.addEventListener("mousemove", followMouse2);
    window.addEventListener("mouseup", stopDrawingLine2);
  };

  const followMouse2 = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    setLines((prev) => [
      ...prev.slice(0, -1),
      {
        x1: startPoint.getBoundingClientRect().left - rect.left + 8,
        y1: startPoint.getBoundingClientRect().top - rect.top + 8,
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top,
      },
    ]);
  };

  const stopDrawingLine2 = (e) => {
    window.removeEventListener("mousemove", followMouse2);
    window.removeEventListener("mouseup", stopDrawingLine2);

    const endDot = document.elementFromPoint(e.clientX, e.clientY);

    // ✅ تصحيح اسم الكلاس
    if (!endDot || !endDot.classList.contains("end-dot2-unit2")) {
      setLines((prev) => prev.slice(0, -1));
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const newLine = {
      x1: startPoint.getBoundingClientRect().left - rect.left + 8,
      y1: startPoint.getBoundingClientRect().top - rect.top + 8,
      x2: endDot.getBoundingClientRect().left - rect.left + 8,
      y2: endDot.getBoundingClientRect().top - rect.top + 8,

      // ✅ تصحيح تخزين البيانات
      image: startPoint.dataset.image,
      word: endDot.dataset.word,
    };

    setLines((prev) => [...prev.slice(0, -1), newLine]);
  };
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

    if (audio.paused) {
      audio.play();
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
              justifyContent: "flex-start",
            }}
          >
            <div className="audio-popup-vocab">
              <div className="audio-inner-vocab">
                {/* Play / Pause */}
                <button
                  className="audio-play-btn"
                  style={{ height: "30px", width: "30px" }}
                  onClick={togglePlay}
                >
                  {paused ? <FaPlay size={22} /> : <FaPause size={22} />}
                </button>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max={audioRef.current?.duration || 0}
                  value={audioRef.current?.currentTime || 0}
                  className="audio-slider"
                  onChange={(e) => {
                    if (!audioRef.current) return;
                    audioRef.current.currentTime = e.target.value;
                  }}
                />

                {/* Current Time */}
                <span className="audio-time">
                  {new Date((audioRef.current?.currentTime || 0) * 1000)
                    .toISOString()
                    .substring(14, 19)}
                </span>

                {/* Total Time */}
                <span className="audio-time">
                  {new Date((audioRef.current?.duration || 0) * 1000)
                    .toISOString()
                    .substring(14, 19)}
                </span>

                {/* Mute */}
                <button
                  className="mute-btn-outside"
                  onClick={() => {
                    audioRef.current.muted = !audioRef.current.muted;
                    setIsMuted(!isMuted);
                  }}
                >
                  {audioRef.current?.muted ? (
                    <FaVolumeMute size={22} color="#1d4f7b" />
                  ) : (
                    <FaVolumeUp size={22} color="#1d4f7b" />
                  )}
                </button>
                <div className="settings-wrapper" ref={settingsRef}>
                  <button
                    className={`settings-btn ${showSettings ? "active" : ""}`}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <IoMdSettings size={22} color="#1d4f7b" />
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
              </div>
            </div>
            <audio ref={audioRef}>
              <source src={sound1} type="audio/mp3" />
            </audio>
          </div>

          <div className="match-wrapper2" ref={containerRef}>
            {/* الصور */}
            <div className="match-images-row2">
              <div className="img-box2">
                <img src={img1} alt="" />
                {wrongImages.includes("img1") && (
                  <span className="error-mark-img">✕</span>
                )}

                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img1"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>

              <div className="img-box2">
                <img src={img2} alt="img" />
                {wrongImages.includes("img2") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img2"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>

              <div className="img-box2">
                <img src={img3} alt="" />{" "}
                {wrongImages.includes("img3") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img3"
                  onMouseDown={handleDotDown2}
                ></div>
              </div>
              <div className="img-box2">
                <img src={img4} alt="" />{" "}
                {wrongImages.includes("img4") && (
                  <span className="error-mark-img">✕</span>
                )}
                <div
                  className="dot2-unit2 start-dot2-unit2"
                  data-image="img4"
                  onMouseDown={handleDotDown2}
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
                    alignItems:"center"
                  }}
                >
                  s
                </h5>
                <div className="dot2-unit2 end-dot2-unit2" data-word="s"></div>
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
                    marginTop: "10px", alignItems:"center"
                  }}
                >
                  z
                </h5>
                <div className="dot2-unit2 end-dot2-unit2" data-word="z"></div>
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
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>
          {showContinue && (
            <button className="play-btn swal-continue" onClick={togglePlay}>
              {paused ? (
                <>
                  Continue
                  <svg width="20" height="20" viewBox="0 0 30 30">
                    <image href={pauseBtn} x="0" y="0" width="30" height="30" />
                  </svg>
                </>
              ) : (
                <>
                  Pause
                  <CgPlayPauseO size={20} style={{ color: "red" }} />
                </>
              )}
            </button>
          )}
          <button onClick={checkAnswers2} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit8_Page5_Q2;
