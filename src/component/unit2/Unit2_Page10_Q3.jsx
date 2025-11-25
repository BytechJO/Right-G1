import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Unit2_Page10_Q3.css";
import sound1 from "../../assets/unit1/sounds/P19QF.mp3";
import sound2 from "../../assets/img_unit2/sounds-unit2/Pg19_2.2_Adult Lady.mp3";
import ball from "../../assets/img_unit2/imgs/Football.jpg";
import bag from "../../assets/img_unit2/imgs/bag.jpg";
import pants from "../../assets/img_unit2/imgs/pants.jpg";
import panda from "../../assets/img_unit2/imgs/panda.jpg";
import paper from "../../assets/img_unit2/imgs/paper.jpg";
import baby from "../../assets/img_unit2/imgs/baby.jpg";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
const Unit2_Page10_Q3 = () => {
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
  const stopAtSecond = 4.2;
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
  const questions = [
    {
      id: 1,
      images: [ball, baby, bag],
      correct: "b",
      options: ["b", "p"],
    },
    {
      id: 2,
      images: [pants, paper, panda],
      correct: "p",
      options: ["b", "p"],
    },
  ];

  const [answers, setAnswers] = useState({});
  //   const [checked, setChecked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const handleSelect = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const checkAnswers = () => {
    // 🔸 تحقق إذا الطالب جاوب على الكل
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info("Oops!", "Please answer all items first.");
      return;
    }

    // 🔹 احسب عدد الإجابات الصح
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id]?.toLowerCase() === q.correct.toLowerCase()) {
        correctCount++;
      }
    });

    const total = questions.length;
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
        <div className="page10-q3-container">
          <h5 className="header-title-page8">F Listen and circle.</h5>

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

          <div className="questions-grid">
            {questions.map((q) => (
              <div key={q.id} className="question-box">
                <div className="question-number">{q.id}</div>

                <div className="images-row">
                  {q.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      className="question-img"
                    />
                  ))}
                </div>

                <div className="options-row">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    const isWrong =
                      showResult &&
                      isSelected &&
                      answers[q.id]?.toLowerCase() !== q.correct.toLowerCase();

                    return (
                      <span
                        key={opt}
                        className={`option-letter ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => handleSelect(q.id, opt)}
                      >
                        {opt}
                        {isWrong && <span className="wrong-x10-3">X</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setAnswers({});
            setShowResult(false);
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
  );
};

export default Unit2_Page10_Q3;
