import React, { useState, useRef, useEffect } from "react";
import CD13_Pg14_Instruction1_AdultLady from "../../assets/img_unit2/sounds-unit2/CD13.Pg14_Instruction1_Adult Lady.mp3";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Review4_Page2_Q2.css";
import sound1 from "../../assets/unit4/sounds/U4P37EXEF.mp3";
import bat from "../../assets/unit4/imgs/U4P37EXEF-01.svg";
import box from "../../assets/unit4/imgs/U4P37EXEF-02.svg";
import bucket from "../../assets/unit4/imgs/U4P37EXEF-03.svg";
import boat from "../../assets/img_unit2/imgs/boat.jpg";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
const Review4_Page2_Q2 = () => {
  const [answers, setAnswers] = useState([null, null, null]);
  const audioRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  // زر الكابشن
  const [isMuted, setIsMuted] = useState(false);
  const stopAtSecond = 8;
  const [paused, setPaused] = useState(false);
  const changeSpeed = (rate) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setActiveSpeed(rate);
  };
  const items = [
    { img: bat, correct: "f" },
    { img: box, correct: "f" },
    { img: bucket, correct: "v" },
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
  const handleSelect = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // 🔥 يمنع بقاء الإكس بعد ما يغيّر الطالب جوابه
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please answer all items first.");
      return;
    }

    const correctCount = answers.filter(
      (a, i) => a?.toLowerCase() === items[i].correct?.toLowerCase()
    ).length;

    const total = items.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setTimeout(() => setShowResult(true), 200);
  };

  const resetAnswers = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8">
            F What is the <span style={{ color: "red" }}>beginning sound</span>
            of the word? Listen and circle.
          </h5>
        </div>
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
        <div
          className="imgFeild"
          style={{
            display: "flex",
            gap: "13px",
            flexDirection: "column",
          }}
        >
          <div className="fv-container">
            {items.map((item, index) => (
              <div className="fv-item" key={index}>
                <img src={item.img} className="fv-image" />
                <div className="fv-options">
                  {/* B OPTION */}
                  <span
                    style={{ position: "relative" }}
                    className={`fv-option 
                    ${answers[index] === "f" ? "selected" : ""}
                    ${
                      showResult &&
                      answers[index] === "f" &&
                      answers[index] !== item.correct
                        ? "wrong-answer"
                        : ""
                    }`}
                    onClick={() => handleSelect(index, "f")}
                  >
                    f
                    {showResult &&
                      answers[index] === "f" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x-fv">X</span>
                      )}
                  </span>

                  {/* P OPTION */}
                  <span
                    style={{ position: "relative" }}
                    className={`fv-option 
                    ${answers[index] === "v" ? "selected" : ""}
                    ${
                      showResult &&
                      answers[index] === "v" &&
                      answers[index] !== item.correct
                        ? "wrong-answer"
                        : ""
                    }`}
                    onClick={() => handleSelect(index, "v")}
                  >
                    v
                    {showResult &&
                      answers[index] === "v" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x-fv">X</span>
                      )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
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

export default Review4_Page2_Q2;
