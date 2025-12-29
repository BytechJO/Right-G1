import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/unit9/imgs/G1_U9 _Pg_76-77 copy.jpg";
import page2_2 from "../../../assets/unit3/imgs3/vocabimg_unit3-ClZR6yN5.jpg";
import vocabulary from "../../../assets/unit9/sound/Pg76_Vocabulary_Adult Lady.mp3";
import num1 from "../../../assets/unit3/imgs3/Num1.svg";
import num2 from "../../../assets/unit3/imgs3/Num2.svg";
import num3 from "../../../assets/unit3/imgs3/Num3.svg";
import num4 from "../../../assets/unit3/imgs3/Num4.svg";
import num5 from "../../../assets/unit3/imgs3/Num5.svg";
import num6 from "../../../assets/unit3/imgs3/Num6.svg";
import num7 from "../../../assets/unit3/imgs3/Num7.svg";
import num8 from "../../../assets/unit5/imgs/Num8.svg";
import { TbMessageCircle } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import sound1 from "../../../assets/unit1/sounds/pg4-vocabulary-1-goodbye.mp3";
import sound2 from "../../../assets/unit1/sounds/pg4-vocabulary-2-how are you.mp3";
import sound3 from "../../../assets/unit1/sounds/pg4-vocabulary-3-fine thank you.mp3";
import sound4 from "../../../assets/unit1/sounds/pg4-vocabulary-4-hello..mp3";
import sound5 from "../../../assets/unit1/sounds/pg4-vocabulary-5-good morning.mp3";
import sound6 from "../../../assets/unit1/sounds/pg4-vocabulary-2-how are you.mp3";
import sound7 from "../../../assets/unit1/sounds/pg4-vocabulary-3-fine thank you.mp3";
import sound8 from "../../../assets/unit1/sounds/pg4-vocabulary-3-fine thank you.mp3";

const Unit9_Page1_Vocab = () => {
  const audioRef = useRef(null);

  const mainAudioRef = useRef(null); // ✅ الأوديو الرئيسي
  const clickAudioRef = useRef(null); // ✅ صوت المناطق
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex2, setActiveIndex2] = useState(null);
  const stopAtSecond = 3.27;
  const [clickedIndex, setClickedIndex] = useState(null);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);

  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const [showCaption, setShowCaption] = useState(false);

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 3.27,
      text: "Page 76, Unit 9.Vocabulary.",
    },
    { start: 3.3, end: 5.27, text: "1. horse." },
    { start: 5.3, end: 8.07, text: "2. stable" },
    { start: 8.10, end: 10.19, text: "3. barn" },
    { start: 10.22, end: 13.05, text: "4. chicken" },
    { start: 13.07, end: 15.18, text: "5. goat" },
    { start: 15.21, end: 18.08, text: "6. cow" },
    { start: 18.12, end: 20.27, text: "7. grass" },
    { start: 20.3, end: 23.06, text: "8. cat" },
  ];

  // ================================
  // ✔ Word timings
  // ================================
  // 🎵 فترات الكلمات داخل الأوديو الرئيسي
  const wordTimings = [
    { start: 3.4, end: 5.27 },
    { start: 5.3, end: 8.07 },
    { start: 10.21, end: 10.19 },
    { start: 10.22, end: 13.05 },
    { start: 13.07, end: 15.18 },
    { start: 15.21, end: 18.08 },
    { start: 18.12, end: 20.27 },
    { start: 20.3, end: 23.06 },
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

    const handleEnded = () => {
      mainAudioRef.current.currentTime = 0;
      setIsPlaying(false);
      setPaused(true);
      setShowContinue(true);
      setActiveIndex(null);
      setActiveIndex2(null);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(interval);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // ================================
  // ✔ Play/Pause toggle
  // ================================
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

  const nums = [num1, num2, num3, num4, num5, num6, num7, num8];
  const wordAudios = [
    sound1,
    sound2,
    sound3,
    sound4,
    sound5,
    sound6,
    sound7,
    sound8,
  ];
  const playWordAudio = (index) => {
    // أوقفي الأوديو الرئيسي
    mainAudioRef.current.pause();

    // أوقفي أي كلمة شغالة
    wordRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    const audio = wordRefs.current[index].current;
    if (!audio) return;

    // تشغيل الصوت من البداية
    audio.currentTime = 0;
    audio.play();

    // 🔥 فعل الأنيميشن على طول فترة التشغيل
    setClickedIndex(index);

    // 🔥 عند انتهاء الصوت -> أطفئ الأنيميشن
    audio.onended = () => {
      setClickedIndex(null);
    };
  };
  const wordRefs = useRef(wordAudios.map(() => React.createRef()));
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* ============================
                AUDIO PLAYER
           ============================= */}
      <div
        className="audio-popup-vocab-container"
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
                const t = e.target.currentTime;
                setCurrent(t);
                updateCaption(t);
                updateWord(t); // 🔥 أهم خطوة
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
      {/* ============================
           IMAGE + WORDS
      ============================= */}

      <div
        style={{ position: "relative", marginTop: "5px", width: "fit-content" }}
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
              " horse",
              " stable",
              " barn",
              " chicken",
              " goat",
              " cow",
              " grass",
              " cat",
            ].map((text, i) => (
              <h6
                key={i}
                className={
                  (activeIndex2 === i && current >= 2.8) || clickedIndex === i
                    ? "active"
                    : ""
                }
                onClick={() => playWordAudio(i)}
              >
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
            id={`num-${i + 1}-unit9`}
            className={`num-img ${
              (activeIndex2 === i && current >= 2.8) || clickedIndex === i
                ? "active"
                : ""
            }`}
            style={{
              height: "20px",
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
      {wordAudios.map((src, i) => (
        <audio key={i} ref={wordRefs.current[i]} src={src} />
      ))}
    </div>
  );
};

export default Unit9_Page1_Vocab;
