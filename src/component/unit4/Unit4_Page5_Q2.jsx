import React, { useState, useRef, useEffect } from "react";
import bat from "../../assets/unit4/imgs/U4P32ExeA2-01.svg";
import cap from "../../assets/unit4/imgs/U4P32ExeA2-02.svg";
import ant from "../../assets/unit4/imgs/U4P32ExeA2-03.svg";
import dad from "../../assets/unit4/imgs/U4P32ExeA2-04.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit4_Page5_Q2.css";
import sound from "../../assets/unit4/sounds/U4P32EXEA2.mp3";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
const Unit4_Page5_Q2 = () => {
  const correctAnswers = ["f", "v", "f", "v"];
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);

  const audioRef = useRef(null);

  const [showResult, setShowResult] = useState([]);
  const [checked, setChecked] = useState(false);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  // زر الكابشن
  const [isMuted, setIsMuted] = useState(false);
  const stopAtSecond = 11;
  const [paused, setPaused] = useState(false);
  const changeSpeed = (rate) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setActiveSpeed(rate);
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
  const handleChange = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value.toLowerCase();
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];
    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        tempScore++;
      } else {
        wrong.push(i); // خزن رقم السؤال الغلط بدل الكلمة
      }
    });
    setWrongInputs(wrong);

    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${tempScore} / ${total}
      </span>
    </div>
  `;

    if (tempScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (tempScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
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
      className="question-wrapper-unit3-page6-q1"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span style={{ color: "purple" }}>2</span>Does it begin with{" "}
          <span style={{ color: "red" }}>f</span> or{" "}
          <span style={{ color: "red" }}>v</span>? Listen and write.
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
            <source src={sound} type="audio/mp3" />
          </audio>
        </div>
        <div className="row-content10-unit3-page6-q1">
          <div className="row2-unit3-page6-q1">
            <div style={{ display: "flex", gap: "15px" }}>
              <span className="num-span">1</span>{" "}
              <img src={bat} alt="" className="q-img-unit3-page6-q1" />
            </div>
            <span style={{ position: "relative", display: "flex" }}>
              <div className="input-wrapper-unit3-page6-q1">
                <input
                  type="text"
                  className="q-input-unit3-page6-q1"
                  onChange={(e) => handleChange(e.target.value, 0)}
                  value={answers[0]}
                />
                {wrongInputs.includes(0) && (
                  <span className="error-mark-input">✕</span>
                )}
              </div>
            </span>
          </div>

          <div className="row2-unit3-page6-q1">
            <div style={{ display: "flex", gap: "15px" }}>
              <span className="num-span">2</span>{" "}
              <img src={cap} alt="" className="q-img-unit3-page6-q1" />
            </div>
            <span style={{ position: "relative", display: "flex" }}>
              <div className="input-wrapper-unit3-page6-q1">
                <input
                  type="text"
                  className="q-input-unit3-page6-q1"
                  onChange={(e) => handleChange(e.target.value, 1)}
                  value={answers[1]}
                />{" "}
                {wrongInputs.includes(1) && (
                  <span className="error-mark-input">✕</span>
                )}
              </div>
            </span>
          </div>

          <div className="row2-unit3-page6-q1">
            <div style={{ display: "flex", gap: "15px" }}>
              <span className="num-span">3</span>{" "}
              <img src={ant} alt="" className="q-img-unit3-page6-q1" />
            </div>
            <span style={{ position: "relative", display: "flex" }}>
              <div className="input-wrapper-unit3-page6-q1">
                <input
                  type="text"
                  className="q-input-unit3-page6-q1"
                  onChange={(e) => handleChange(e.target.value, 2)}
                  value={answers[2]}
                />{" "}
                {wrongInputs.includes(2) && (
                  <span className="error-mark-input">✕</span>
                )}
              </div>
            </span>
          </div>

          <div className="row2-unit3-page6-q1">
            <div style={{ display: "flex", gap: "15px" }}>
              <span className="num-span">4</span>{" "}
              <img src={dad} alt="" className="q-img-unit3-page6-q1" />
            </div>
            <span style={{ position: "relative", display: "flex" }}>
              <div className="input-wrapper-unit3-page6-q1">
                <input
                  type="text"
                  className="q-input-unit3-page6-q1"
                  onChange={(e) => handleChange(e.target.value, 3)}
                  value={answers[3]}
                />{" "}
                {wrongInputs.includes(3) && (
                  <span className="error-mark-input">✕</span>
                )}
              </div>
            </span>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
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
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit4_Page5_Q2;
