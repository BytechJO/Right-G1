import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../assets/unit1/imgs/Page 01/01.jpg";
import page2_2 from "../../assets/unit1/imgs/Page 01/page4_vocab-removebg-preview-XE32rJsc.jpg";
import num1 from "../../assets/unit1/imgs/Page 01/Num1.svg";
import num2 from "../../assets/unit1/imgs/Page 01/Num2.svg";
import num3 from "../../assets/unit1/imgs/Page 01/Num3.svg";
import num4 from "../../assets/unit1/imgs/Page 01/Num4.svg";
import num5 from "../../assets/unit1/imgs/Page 01/Num5.svg";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import vocabulary from "../../assets/unit1/sounds/Pg4_Vocabulary_Adult Lady.mp3";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import "../../index.css"; // ✅ نضيف ملف CSS خارجي

const Page4_vocabulary = () => {
  const mainAudioRef = useRef(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  const stopAtSecond = 2.5;
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const [showCaption, setShowCaption] = useState(false);

  // 🎵 فترات الكلمات داخل الأوديو الرئيسي
  const wordTimings = [
    { start: 2.8, end: 5.0 }, // Goodbye
    { start: 5.1, end: 7.0 }, // How are you
    { start: 7.1, end: 10.5 }, // Fine thank you
    { start: 10.6, end: 12.1 }, // Hello
    { start: 12.2, end: 15.0 }, // Good morning
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
      setIsPlaying(false)
      setShowContinue(true);
      clearInterval(interval);
    }
  }, 100);

  // عند انتهاء الأوديو يرجع يبطل أنيميشن + يظهر Continue
  const handleEnded = () => {
    setActiveIndex(null);
    setPaused(true);
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

    return () => clearInterval(timer);
  }, []);

 const togglePlay = () => {
  const audio = mainAudioRef.current;

  if (!audio) return;

  if (audio.paused) {
    audio.play();
    setPaused(false);
    setIsPlaying(true)
  } else {
    audio.pause();
    setPaused(true);
    setIsPlaying(false)
  }
};

  const nums = [num1, num2, num3, num4, num5];

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          margin: "0px 20px",
          position: "relative",
          alignItems: "center",
        }}
      >
        <div className="audio-popup-vocab">
          <div className="audio-inner player-ui">
            <audio
              ref={mainAudioRef}
              src={vocabulary}
              onTimeUpdate={(e) => {
                const time = e.target.currentTime;
                setCurrent(time);

                // تشغيل لون الكلمات
                const idx = wordTimings.findIndex(
                  (t) => time >= t.start && time <= t.end
                );
                setActiveIndex(idx !== -1 ? idx : null);
              }}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
            ></audio>
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
                  mainAudioRef.current.currentTime = e.target.value;
                  updateCaption(Number(e.target.value));
                }}
                style={{
                  background: `linear-gradient(to right, #8247ffff ${
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
                onClick={() => setShowCaption(!showCaption)}
              >
                <TbMessageCircle size={36} />
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
          <div style={{ bottom: "2%", right: "0%" }}>
            <img
              src={page2_2}
              style={{
                height: "170px",
                width: "auto",
                position: "absolute",
                bottom: "0%",
                right: "0%",
                borderRadius: "5%",
              }}
            />
            <div
              className="vocab_container"
              style={{ bottom: "2%", right: "6%" }}
            >
              {[
                "Goodbye!",
                "How are you?",
                "Fine, thank you.",
                "Hello!",
                "Good morning!",
              ].map((text, i) => (
                <h6
                  key={i}
                  className={
                    activeIndex === i || clickedIndex === i ? "active" : ""
                  }
                  onClick={() => {
                    setClickedIndex(i);

                    // يرجع يشيل الانيميشن بعد 500ms (حسب زمن أنيميشنك)
                    setTimeout(() => setClickedIndex(null), 500);
                  }}
                >
                  {i + 1} {text}
                </h6>
              ))}
            </div>
          </div>

          {nums.map((num, i) => (
            <img
              key={i}
              src={num}
              className={`num-img ${
                activeIndex === i || clickedIndex === i ? "active" : ""
              }`}
              style={{
                height: "20px",
                width: "auto",
                position: "absolute",
                top: ["43%", "43%", "42%", "22%", "25%"][i],
                left: ["14%", "54%", "71%", "40%", "32%"][i],
              }}
            />
          ))}
          <div>
            <img
              src={backgroundImage}
              alt="interactive"
              style={{ height: "76vh" }}
            />
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default Page4_vocabulary;
