import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/unit6/imgs/G1_U6_Pg_46-47 copy.jpg";
import page2_2 from "../../../assets/unit3/imgs3/vocabimg_unit3-ClZR6yN5.jpg";
import vocabulary from "../../../assets/unit3/sound3/Pg22_Vocabulary_Adult Lady.mp3";
import { CgPlayPauseO } from "react-icons/cg";
import num1 from "../../../assets/unit3/imgs3/Num1.svg";
import num2 from "../../../assets/unit3/imgs3/Num2.svg";
import num3 from "../../../assets/unit3/imgs3/Num3.svg";
import num4 from "../../../assets/unit3/imgs3/Num4.svg";
import num5 from "../../../assets/unit3/imgs3/Num5.svg";
import num6 from "../../../assets/unit3/imgs3/Num6.svg";
import num7 from "../../../assets/unit3/imgs3/Num7.svg";
import num8 from "../../../assets/unit5/imgs/Num8.svg";
import num9 from "../../../assets/unit6/imgs/Num9.svg";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import sound1 from "../../../assets/unit1/sounds/pg4-vocabulary-1-goodbye.mp3";
import sound2 from "../../../assets/unit1/sounds/pg4-vocabulary-2-how are you.mp3";
import sound3 from "../../../assets/unit1/sounds/pg4-vocabulary-3-fine thank you.mp3";
import sound4 from "../../../assets/unit1/sounds/pg4-vocabulary-4-hello..mp3";
import sound5 from "../../../assets/unit1/sounds/pg4-vocabulary-5-good morning.mp3";
import sound6 from "../../../assets/unit1/sounds/pg4-vocabulary-2-how are you.mp3";
import sound7 from "../../../assets/unit1/sounds/pg4-vocabulary-3-fine thank you.mp3";
import sound8 from "../../../assets/unit1/sounds/pg4-vocabulary-3-fine thank you.mp3";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { TbMessageCircle } from "react-icons/tb";
const Unit6_Page1_Vocab = () => {
  const audioRef = useRef(null);
  const stopAtSecond = 3.5;
  const mainAudioRef = useRef(null); // ✅ الأوديو الرئيسي
  const clickAudioRef = useRef(null); // ✅ صوت المناطق
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex2, setActiveIndex2] = useState(null);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [showCaption, setShowCaption] = useState(false);
  // 🎵 فترات الكلمات داخل الأوديو الرئيسي
  const wordTimings = [
    { start: 3.9, end: 6.2 }, // party hat
    { start: 6.3, end: 8.5 }, // jellow
    { start: 8.6, end: 11.5 }, // cake
    { start: 11.6, end: 14.6 }, // Hello
    { start: 14.7, end: 17.2 }, // Good morning
    { start: 17.3, end: 19.8 },
    { start: 19.9, end: 23.6 },
  ];

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 4.35, end: 8.29, text: "Page 28, unit 4 vocabulary. " },
    { start: 8.33, end: 11.05, text: "1.	brown. " },
    { start: 11.09, end: 13.05, text: "2.	blue. " },
    { start: 13.09, end: 15.24, text: "3.	yellow. " },
    { start: 15.27, end: 18.13, text: "4.	square. " },
    { start: 18.17, end: 21.0, text: "5.	rectangle." },
    { start: 21.04, end: 23.11, text: "6.	triangle. " },
    { start: 23.14, end: 25.27, text: "7.	red. " },
    { start: 25.3, end: 26.29, text: "8.	circle. " },
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
      setPaused(true);
      setShowContinue(true);
      setIsPlaying(false);
      setActiveIndex(null);
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
                const time = e.target.currentTime;
                setCurrent(time);
                updateCaption(time);
                updateWord(time); // 🔥 أهم خطوة
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
                  background: `linear-gradient(to right,  #430f68 ${
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

        <img
          src={page2_2}
          style={{
            height: "260px",
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
          style={{ bottom: "2%", right: "5.5%" }}
        >
          {[
            "fly a kite",
            "play the violin",
            "ride a bike",
            "ride a scooter",
            "feed the birds",
            "climb a tree",
            "fish",
            "paint a picture",
            "swim",
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

        {/* الأرقام */}
        {nums.map((num, i) => (
          <img
            key={i}
            src={num}
            id={`num-${i + 1}-unit4`}
            className={`num-img ${
              (activeIndex2 === i && current >= 2.8) || clickedIndex === i
                ? "active"
                : ""
            }`}
            style={{
              height: "20px",
              position: "absolute",
              top: ["43%", "43%", "42%", "22%", "25%"][i],
              left: ["14%", "54%", "71%", "40%", "32%"][i],
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

export default Unit6_Page1_Vocab;
