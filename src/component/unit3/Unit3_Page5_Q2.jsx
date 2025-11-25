import "./Unit3_Page5_Q2.css";

import React, { useState, useEffect, useRef } from "react";
import CD24_Pg26_Instructions1_AdultLady from "../../assets/unit3/sound3/CD24.Pg26_Instructions1_Adult Lady.mp3";
import ValidationAlert from "../Popup/ValidationAlert";
import sound1 from "../../assets/unit1/sounds/P19QD.mp3";
import img1 from "../../assets/unit3/imgs3/P26exeA2-01.svg"
import img2 from "../../assets/unit3/imgs3/P26exeA2-02.svg"
import img3 from "../../assets/unit3/imgs3/P26exeA2-03.svg"
import img4 from "../../assets/unit3/imgs3/P26exeA2-04.svg"
import img5 from "../../assets/unit3/imgs3/P26exeA2-05.svg"
import img6 from "../../assets/unit3/imgs3/P26exeA2-06.svg"
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
const Unit3_Page5_Q2 = () => {
  const audioRef = useRef(null);
  const [answers, setAnswers] = useState([null, null, null, null]);
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
  const stopAtSecond = 4.5;
  const [paused, setPaused] = useState(false);
  const changeSpeed = (rate) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setActiveSpeed(rate);
  };

  const correctData = ["1", "2", "4"];
  const options = [
    { img: img1, num: "1" },
    { img: img2, num: "2" },
    { img: img3, num: "3" },
    { img: img4, num: "4" },
    { img: img5, num: "5" },
    { img: img6, num: "6" },
  ];

  // ✅ نسمح فقط باختيار إجابة واحدة
  const [selected, setSelected] = useState([]);
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
  const handleSelect = (index) => {
    setSelected((prev) => {
      if (prev.includes(index)) {
        // إذا الضغط على خيار مُختار → نشيله
        return prev.filter((i) => i !== index);
      } else {
        // إذا الضغط على خيار غير مُختار → نضيفه
        return [...prev, index];
      }
    });
  };

  const scoreMessage = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:green; font-weight:bold;">
         Score: 1 /1
      </span>
    </div>
  `;

  // ✅ الفحص فقط إذا الطالب اختار أو لا
  const checkAnswers = () => {
    if (selected.length === 0) {
      ValidationAlert.info("Oops!", "Please select at least one answer.");
      return;
    }

    // استخراج الأرقام المختارة
    const chosenNumbers = selected.map((index) => options[index].num);

    // نحدد للنتائج إذا الخيار صح أو غلط
    const evaluation = options.map((opt, index) => {
      if (selected.includes(index)) {
        return correctData.includes(opt.num) ? "correct" : "wrong";
      }
      return null; // خيار لم يتم اختياره
    });

    setShowResult(evaluation);
    setChecked(true);

    // حساب الإجابات الصحيحة
    const correctCount = chosenNumbers.filter((num) =>
      correctData.includes(num)
    ).length;

    // حساب السكور النهائي
    const totalCorrect = correctData.length;
    const score = `${correctCount} / ${totalCorrect}`;
    const color =
      correctCount === totalCorrect
        ? "green"
        : correctCount === 0
        ? "red"
        : "orange";
    const resultHTML = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:${color};
                   font-weight:bold;">
         Score: ${score}
      </span>
    </div>
  `;

    if (correctCount === totalCorrect) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  // 🔄 زر الريست
  const resetAnswers = () => {
    setShowResult([]);
    setChecked(false);
    setSelected([]);
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
        <div className="unit3-q1-wrapper">
          <h5 className="header-title-page8">
            <span style={{ color: "purple" }}>2</span> Does it have a{" "}
            <span style={{ color: "red" }}>short a</span> sound? Listen and
            circle.
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
            <source src={CD24_Pg26_Instructions1_AdultLady} type="audio/mp3" />
          </audio></div>
          <div className="unit3-q2-content">
            {/* الخيارات */}
            <div className="unit3-q2-options">
              {options.map((item, index) => (
                <div
                  key={item.num}
                  className={`unit3-q2-option-item ${
                    selected.includes(index) ? "active" : ""
                  }`}
                  onClick={() => handleSelect(index)}
                >
                  <div style={{ position: "relative" }}>
                    <span className="unit3-q2-number">{item.num}</span>
                    {checked && showResult[index] === "wrong" && (
                      <div className="wrong-x-unit3-q2">X</div>
                    )}
                  </div>

                  <img src={item.img} className="unit3-q2-option-img" alt="" />
                </div>
              ))}
            </div>
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

export default Unit3_Page5_Q2;
