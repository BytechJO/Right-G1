import React, { useState, useRef, useEffect } from "react";
import "./Unit2_Page10_Q1.css";
import ValidationAlert from "../Popup/ValidationAlert";
import sound1 from "../../assets/unit1/sounds/P19QD.mp3";
import sound2 from "../../assets/img_unit2/sounds-unit2/Pg19_1.2_Adult Lady.mp3";
import sound3 from "../../assets/img_unit2/sounds-unit2/Pg19_1.3_Adult Lady.mp3";
import sound4 from "../../assets/img_unit2/sounds-unit2/Pg19_1.4_Adult Lady.mp3";
import sound5 from "../../assets/img_unit2/sounds-unit2/Pg19_1.5_Adult Lady.mp3";
import sound6 from "../../assets/img_unit2/sounds-unit2/Pg19_1.6_Adult Lady.mp3";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
const Unit2_Page10_Q1 = () => {
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
  const stopAtSecond = 4.5;
  const [paused, setPaused] = useState(false);
  const changeSpeed = (rate) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setActiveSpeed(rate);
  };

  const sentences = [
    { word1: "ball", word2: "pencil", num: 1 },
    { word1: "boy", word2: "pencil", num: 2 },
    { word1: "pink", word2: "bird", num: 3 },
    { word1: "pizza", word2: "bird", num: 4 },
    { word1: "ball", word2: "pink", num: 5 },
    { word1: "ball", word2: "pizza", num: 6 },
  ];

  const correct = {
    0: [0],
    1: [0],
    2: [1],
    3: [0],
    4: [1],
    5: [0],
  };

  const [circledWords, setCircledWords] = useState({});
  const [checked, setChecked] = useState(false);

  const handleWordClick = (sIndex, wIndex) => {
 

    setCircledWords((prev) => ({
      ...prev,
      [sIndex]: [wIndex], // 🟢 كل جملة لها اختيار واحد فقط
    }));
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
  const checkAnswers = () => {
    if (Object.keys(circledWords).length < 6) {
      ValidationAlert.info("Oops!", "Please circle at least one mistake.");
      return;
    }

    let totalCorrect = 0;
    let studentCorrect = 0;

    for (let sIndex in correct) totalCorrect += correct[sIndex].length;

    for (let sIndex in circledWords) {
      circledWords[sIndex].forEach((wIndex) => {
        if (correct[sIndex]?.includes(wIndex)) studentCorrect++;
      });
    }

    setChecked(true);

    const scoreMessage = `Score: ${studentCorrect} / ${totalCorrect}`;
    if (studentCorrect === totalCorrect) ValidationAlert.success(scoreMessage);
    else if (studentCorrect === 0) ValidationAlert.error(scoreMessage);
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
        <div className="content-container10">
          <h5 className="header-title-page8">D Listen and circle.</h5>

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

                      <label>Speed</label>
                      <div className="speed-buttons">
                        {[0.75, 1, 1.25, 1.5].map((rate) => (
                          <button
                            key={rate}
                            className={`speed-rate ${
                              activeSpeed === rate ? "active" : ""
                            }`}
                            onClick={() => changeSpeed(rate)}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <audio ref={audioRef}>
              <source src={sound1} type="audio/mp3" />
            </audio>
          </div>

          <div className="sentence-container2">
            {sentences.map((sentence, sIndex) => (
              <div key={sIndex} className="sentence-row">
                <span className="num2">{sIndex + 1}</span>
                {[sentence.word1, sentence.word2].map((word, wIndex) => {
                  const isCircled = circledWords[sIndex]?.includes(wIndex);
                  const isWrong =
                    checked && isCircled && !correct[sIndex]?.includes(wIndex);

                  return (
                    <span
                      key={wIndex}
                      onClick={() => handleWordClick(sIndex, wIndex)}
                      className={`word-text10 ${isCircled ? "circled2" : ""}`}
                    >
                      {word}
                      {isWrong && <span className="wrong-x10">X</span>}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button
            onClick={() => {
              setCircledWords({});
              setChecked(false);
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
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit2_Page10_Q1;
