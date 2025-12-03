import React, { useState, useRef, useEffect } from "react";
import backgroundImage from "../../../assets/unit1/imgs/Page 01/01.jpg";
import page2_2 from "../../../assets/unit1/imgs/Page 01/page4_vocab-removebg-preview-XE32rJsc.jpg";
import num1 from "../../../assets/unit1/imgs/Page 01/Num1.svg";
import num2 from "../../../assets/unit1/imgs/Page 01/Num2.svg";
import num3 from "../../../assets/unit1/imgs/Page 01/Num3.svg";
import num4 from "../../../assets/unit1/imgs/Page 01/Num4.svg";
import num5 from "../../../assets/unit1/imgs/Page 01/Num5.svg";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import vocabulary from "../../../assets/unit1/sounds/Pg4_Vocabulary_Adult Lady.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import "../../../index.css";

const Page4_vocabulary = () => {
  const mainAudioRef = useRef(null);

  const [clickedIndex, setClickedIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex2, setActiveIndex2] = useState(null);
  const [showContinue, setShowContinue] = useState(false);

  const stopAtSecond = 2.5;

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
      end: 3.0,
      text: "Page 4, Unit 1. Good morning, world.Vocabulary.",
    },
    { start: 3.02, end: 5.1, text: "1. Goodbye." },
    { start: 5.13, end: 7.0, text: "2. How are you?" },
    { start: 7.03, end: 10.5, text: "3. Fine, thank you." },
    { start: 10.52, end: 12.1, text: "4. Hello." },
    { start: 12.12, end: 15.0, text: "5. Good morning." },
  ];

  // ================================
  // ✔ Word timings
  // ================================
  const wordTimings = [
    { start: 2.8, end: 5.0 }, // Goodbye
    { start: 5.1, end: 7.0 }, // How are you
    { start: 7.1, end: 10.5 }, // Fine thank you
    { start: 10.6, end: 12.1 }, // Hello
    { start: 12.2, end: 15.0 }, // Good morning
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

  const nums = [num1, num2, num3, num4, num5];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* ============================
           AUDIO PLAYER
      ============================= */}
      <div className="audio-popup-vocab-container"
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "0px 20px",
          position: "relative",
          alignItems:"center"
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
        {/* Image + Words */}
        <img
          src={page2_2}
          style={{
            height: "170px",
            position: "absolute",
            bottom: "0%",
            right: "0%",
            borderRadius: "5%",
          }}
        />

        <div className="vocab_container" style={{ bottom: "2%", right: "6%" }}>
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
                (activeIndex2 === i && current >= 2.8) || clickedIndex === i
                  ? "active"
                  : ""
              }
              onClick={() => {
                setClickedIndex(i);
                playSingleWord(i);
                setTimeout(() => setClickedIndex(null), 500);
              }}
            >
              {i + 1} {text}
            </h6>
          ))}
        </div>

        {/* Numbers */}
        {nums.map((num, i) => (
          <img
            key={i}
            src={num}
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

        {/* Background */}
        <img src={backgroundImage} style={{ height: "75vh" }} />
      </div>
    </div>
  );
};

export default Page4_vocabulary;
