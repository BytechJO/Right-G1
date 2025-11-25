import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../assets/unit5/imgs/P40-41.jpg";
import page2_2 from "../../assets/unit3/imgs3/vocabimg_unit3-ClZR6yN5.jpg";
import vocabulary from "../../assets/unit3/sound3/Pg22_Vocabulary_Adult Lady.mp3";
import { CgPlayPauseO } from "react-icons/cg";
import num1 from "../../assets/unit3/imgs3/Num1.svg";
import num2 from "../../assets/unit3/imgs3/Num2.svg";
import num3 from "../../assets/unit3/imgs3/Num3.svg";
import num4 from "../../assets/unit3/imgs3/Num4.svg";
import num5 from "../../assets/unit3/imgs3/Num5.svg";
import num6 from "../../assets/unit3/imgs3/Num6.svg";
import num7 from "../../assets/unit3/imgs3/Num7.svg";
import num8 from "../../assets/unit5/imgs/Num8.svg";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const Unit5_Page1_Vocab = () => {
  const audioRef = useRef(null);

  const mainAudioRef = useRef(null); // ✅ الأوديو الرئيسي
  const clickAudioRef = useRef(null); // ✅ صوت المناطق
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 3.5;

  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  // زر الكابشن
  const [isMuted, setIsMuted] = useState(false);

  const changeSpeed = (rate) => {
    if (!mainAudioRef.current) return;
    mainAudioRef.current.playbackRate = rate;
    setActiveSpeed(rate);
  };
  // 🎵 فترات الكلمات داخل الأوديو الرئيسي
  const wordTimings = [
    { start: 3.9, end: 6.2 }, // party hat
    { start: 6.3, end: 8.5 }, // jellow
    { start: 8.6, end: 11.5 }, // cake
    { start: 11.6, end: 14.6 }, // Hello
    { start: 14.7, end: 17.2 }, // Good morning
    { start: 17.3, end: 19.8 },
    { start: 19.9, end: 23.6 },
    { start: 23.7, end: 25.6 },
  ];
  useEffect(() => {
    const audio = mainAudioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();

    const interval = setInterval(() => {
      if (audio.currentTime >= stopAtSecond) {
        audio.pause();
        setPaused(true);
        setShowContinue(true); // 👈 خلي الكبسة تضل ظاهرة دائماً بعد ثانية 3
        clearInterval(interval);
      }
    }, 200);

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      const index = wordTimings.findIndex(
        (t) => current >= t.start && current <= t.end
      );
      setActiveIndex(index !== -1 ? index : null);
    };
    // ⚡⚡ هنا الإضافة الوحيدة
    const handleEnded = () => {
      audio.currentTime = 0; // يرجع لأول ثانية
      audio.pause(); // يوقف
      setPaused(true); // زر البلاي يصير Play
      setShowContinue(true); // يظهر زر Continue
      setActiveIndex(null); // يشيل الأنيميشن عن الكلمات
    };
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded); // 👈 الإضافة
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
      audio.removeEventListener("ended", handleEnded); // 👈 تنظيف الإضافة
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000); // كل ثانية

    return () => clearInterval(timer);
  }, []);
  const togglePlay = () => {
    const audio = mainAudioRef.current;

    if (audio.paused) {
      audio.play();
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
  };

  const nums = [num1, num2, num3, num4, num5, num6, num7, num8];

  return (
    <>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          margin: "0px 20px",
          position: "relative",
          left: "-10.5%",
          top: "-2%",
          alignItems: "center",
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
              {paused ? <FaPlay size={18} /> : <FaPause size={18} />}
            </button>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max={mainAudioRef.current?.duration || 0}
              value={mainAudioRef.current?.currentTime || 0}
              className="audio-slider"
              onChange={(e) => {
                if (!mainAudioRef.current) return;
                mainAudioRef.current.currentTime = e.target.value;
              }}
            />

            {/* Current Time */}
            <span className="audio-time">
              {new Date((mainAudioRef.current?.currentTime || 0) * 1000)
                .toISOString()
                .substring(14, 19)}
            </span>

            {/* Total Time */}
            <span className="audio-time">
              {new Date((mainAudioRef.current?.duration || 0) * 1000)
                .toISOString()
                .substring(14, 19)}
            </span>

            {/* Mute */}
            <button
              className="mute-btn-outside"
              onClick={() => {
                mainAudioRef.current.muted = !mainAudioRef.current.muted;
                setIsMuted(!isMuted);
              }}
            >
              {mainAudioRef.current?.muted ? (
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
                      mainAudioRef.current.volume = e.target.value;
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <audio ref={mainAudioRef}>
          <source src={vocabulary} type="audio/mp3" />
        </audio>
      </div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* كلمة + صورة صغيرة */}
          <div style={{ bottom: "0%", right: "0%" }}>
            <img
              src={page2_2}
              style={{
                height: "230px",
                width: "auto",
                position: "absolute",
                bottom: "0%",
                right: "0%",
                borderRadius: "8%",
              }}
            />

            {/* النصوص */}
            <div
              className="vocab_container"
              style={{ bottom: "2%", right: "8.5%" }}
            >
              {[
                "board",
                " map",
                " book",
                "globe",
                "poster",
                "trash bin",
                "desk",
                "chair",
              ].map((text, i) => (
                <h6 key={i} className={activeIndex === i ? "active" : ""}>
                  {i + 1} {text}
                </h6>
              ))}
            </div>
          </div>

          {/* الأرقام */}
          {nums.map((num, i) => (
            <img
              key={i}
              src={num}
              id={`num-${i + 1}-unit5`}
              className={`num-img ${activeIndex === i ? "active" : ""}`}
              style={{
                height: "20px",
                width: "auto",
                position: "absolute",
              }}
            />
          ))}
          {/* الصورة الرئيسية */}
          <img
            src={backgroundImage}
            alt="interactive"
            style={{ height: "76vh" }}
          />
        </div>
      </div>

      {showContinue && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="play-btn swal-continue"
            onClick={togglePlay}
            style={{ marginTop: "18px" }}
          >
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
        </div>
      )}
    </>
  );
};

export default Unit5_Page1_Vocab;
