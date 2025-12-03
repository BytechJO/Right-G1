import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/img_unit2/imgs/02-03 New copy.jpg";
import page2_2 from "../../../assets/img_unit2/imgs/unit2 vocab-3CQVwmCm.jpg";
import vocabulary from "../../../assets/img_unit2/sounds-unit2/Pg10_Vocabulary_Adult Lady.mp3";
import "./Unit2_Page1.css";
import { CgPlayPauseO } from "react-icons/cg";
import num1 from "../../../assets/img_unit2/imgs/Num1.svg";
import num2 from "../../../assets/img_unit2/imgs/Num2.svg";
import num3 from "../../../assets/img_unit2/imgs/Num3.svg";
import num4 from "../../../assets/img_unit2/imgs/Num4.svg";
import num5 from "../../../assets/img_unit2/imgs/Num5.svg";
import num6 from "../../../assets/img_unit2/imgs/Num6.svg";
import num7 from "../../../assets/img_unit2/imgs/Num7.svg";
import { TbMessageCircle } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
const Unit2_Page1_Vocab = () => {
  const mainAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex2, setActiveIndex2] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  const stopAtSecond = 3.0;
  const [clickedIndex, setClickedIndex] = useState(null);
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

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
     { start: 0, end: 3.10, text: "Page 10, Unit 2, Vocabulary." },
    { start: 3.12, end: 5.15, text: " 1. Party Hat. " },
    { start: 5.17, end: 7.16, text: "2. Jello." },
    { start: 7.18, end: 9.27, text: "3. Cake. " },
    { start: 9.29, end: 12.20, text: "4. Happy Birthday." },
    { start: 12.22, end: 15.07, text: " 5. Balloons." },
    { start: 15.09, end: 17.13, text: " 6. Present. " },
    { start: 17.15, end: 19.26, text: "7.card" },
  ];
  // 🎵 فترات الكلمات داخل الأوديو الرئيسي
  const wordTimings = [
    { start: 3.2, end: 5.0 }, // party hat
    { start: 5.1, end: 7.2 }, // jellow
    { start: 7.3, end: 9.9 }, // cake
    { start: 9.92, end: 12.7 }, // Hello
    { start: 12.8, end: 15.2 }, // Good morning
    { start: 15.3, end: 17.0 },
    { start: 17.1, end: 19.3 },
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

  // ================================
  // ✔ Update Word highlight
  // ================================
  const updateWord = (time) => {
    const wordIndex = wordTimings.findIndex(
      (w) => time >= w.start && time <= w.end
    );
    setActiveIndex2(wordIndex);
  };
  // ================================
  // ✔ INITIAL PLAY & STOP AT SECOND
  // ================================
  useEffect(() => {
    const audio = mainAudioRef.current;
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
      audio.currentTime = 0;
      setActiveIndex(null);
      setActiveIndex2(null);
      setPaused(true);
      setShowContinue(true);
      setIsPlaying(false);
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
      setIsPlaying(true);
    } else {
      audio.pause();
      setPaused(true);
      setIsPlaying(false);
    }
  };
  // ================================
  // ✔ Play single word only
  // ================================
  const playSingleWord = (index) => {
    const audio = mainAudioRef.current;
    if (!audio) return;

    const { start, end } = wordTimings[index];

    audio.currentTime = start;
    audio.play();
    setIsPlaying(true);

    const stopInterval = setInterval(() => {
      if (audio.currentTime >= end) {
        audio.pause();
        clearInterval(stopInterval);
      }
    }, 40);
  };
  const nums = [num1, num2, num3, num4, num5, num6, num7];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ width: "40%" }}>
        <div className="audio-popup-vocab">
          <div className="audio-inner player-ui">
            <audio
              ref={mainAudioRef}
              src={vocabulary}
              onTimeUpdate={(e) => {
                const time = e.target.currentTime;
                setCurrent(time);
                updateCaption(time);
                updateWord(time); // 🔥 أهم خطوة
              }}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
            ></audio>

            {/* Time + Slider */}
            <div className="top-row">
              <span className="audio-time">
                {new Date(current * 1000).toISOString().substring(14, 19)}
              </span>

              <input
                type="range"
                min="0"
                max={duration}
                value={current}
                className="audio-slider"
                onChange={(e) => {
                  mainAudioRef.current.currentTime = e.target.value;
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

            {/* Buttons */}
            <div className="bottom-row">
              <div
                className={`round-btn ${showCaption ? "active" : ""}`}
                onClick={() => setShowCaption(!showCaption)}
              >
                <TbMessageCircle size={36} />
              </div>

              <button className="play-btn2" onClick={togglePlay}>
                {isPlaying ? <FaPause size={26} /> : <FaPlay size={26} />}
              </button>

              <div>
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
                        mainAudioRef.current.volume = e.target.value;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
     
        <div
          style={{
            position: "relative",
            marginTop: "5px",
            width: "fit-content",
          }}
        >
          <div className={`caption-inPopup ${showCaption ? "show" : ""}`}>
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
          {/* كلمة + صورة صغيرة */}
     
            <img
              src={page2_2}
              style={{
                height: "210px",
                width: "auto",
                position: "absolute",
                bottom: "0%",
                right: "0%",
                borderRadius: "5%",
              }}
            />

            {/* النصوص */}
            <div
              className="vocab_container"
              style={{ bottom: "1.4%", right: "4.5%" }}
            >
              {[
                "party hat",
                "jello",
                "cake",
                "happy birthday ",
                "balloons",
                "present",
                "card",
              ].map((text, i) => (
                <h6
                  key={i}
                  className={
                    (activeIndex2 === i && current >= 3.2) || clickedIndex === i
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setClickedIndex(i);

                    playSingleWord(i); // 🔥 تشغيل كلمة واحدة فقط

                    setTimeout(() => setClickedIndex(null), 500);
                  }}
                >
                  {i + 1} {text}
                </h6>
              ))}
            </div>
         

          {/* الأرقام */}
          {nums.map((num, i) => (
            <img
              key={i}
              src={num}
              id={`num-${i + 1}`}
              className={`num-img ${
                (activeIndex2 === i && current >= 3.2) || clickedIndex === i
                  ? "active"
                  : ""
              }`}
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
            style={{ height: "75vh" }}
          />
        </div>
      </div>
   
  );
};

export default Unit2_Page1_Vocab;
