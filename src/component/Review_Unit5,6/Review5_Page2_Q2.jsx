import React, { useState, useRef, useEffect } from "react";
import "./Review5_Page2_Q2.css";
import sound from "../../assets/unit6/sounds/CD50.Pg53_Instruction1_Adult Lady.mp3";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import ValidationAlert from "../Popup/ValidationAlert";

// Example images imports. Replace with your actual paths.
import img1a from "../../assets/unit6/imgs/U6P53EXEE-01.svg";
// import img1b from "../../assets/unit4/imgs/gate.png";
// import img1c from "../../assets/unit4/imgs/kiwi.png";

// import img2a from "../../assets/unit4/imgs/soccer.png";
// import img2b from "../../assets/unit4/imgs/boy.png";
// import img2c from "../../assets/unit4/imgs/goat.png";

// import img3a from "../../assets/unit4/imgs/king.png";
// import img3b from "../../assets/unit4/imgs/key.png";
// import img3c from "../../assets/unit4/imgs/kite.png";

// import img4a from "../../assets/unit4/imgs/kangaroo.png";
// import img4b from "../../assets/unit4/imgs/keylock.png";
// import img4c from "../../assets/unit4/imgs/grapes.png";

const Review5_Page2_Q2 = () => {
  const groups = [
    { images: [img1a, "./img1b", "./img1c"], different: 2 },
    { images: ["./img2a", "./img2b", "./img2c"], different: 1 },
    { images: ["./img3a", "./img3b", "./img3c"], different: 0 },
    { images: ["./img4a", "./img4b", "./img4c"], different: 2 },
  ];
  const [showResult2, setShowResult2] = useState(false);
  const [selected, setSelected] = useState(Array(groups.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const mainAudioRef = useRef(null);
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
  const handleSelect = (groupIndex, imageIndex) => {
    const updated = [...selected];
    updated[groupIndex] = imageIndex;
    setSelected(updated);
    setShowResult2(false)
  };

  const checkAnswers = () => {
    if (selected.some((val) => val === null)) {
      ValidationAlert.info("Please choose a circle (f or v) for all items!");
      return;
    }
    let correctCount = 0;
    let wrongCount = 0;

    groups.forEach((group, index) => {
      if (selected[index] === null)
        return ValidationAlert.info(
          "Please choose a circle (f or v) for all items!"
        );

      if (selected[index] === group.different) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = groups.length; // 8 نقاط
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;
    // تحديد الرسالة حسب نوع الإجابات
    if (correctCount === groups.length) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setShowResult2(true);
  };

  const reset = () => {
    setSelected(Array(groups.length).fill(null));
    setShowResult(false);
    setShowResult2(false);
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
        <h3 className="header-title-page8">
          E Which picture begins with a
          <span className="ds-diff">different sound?</span> Listen and write{" "}
          <span style={{ color: "red" }}>✗</span>.
        </h3>
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
            <source src={sound} type="audio/mp3" />
          </audio>
        </div>
        <div className="exercise-row-review5-p2-q2">
          {groups.map((group, gIndex) => (
            <div className="ds-group-box-review5-p2-q2 " key={gIndex}>
              {group.images.map((img, iIndex) => {
                const isSelected = selected[gIndex] === iIndex;
                const isCorrect = group.different === iIndex;

                return (
                  <div
                    className="ds-image-wrapper-review5-p2-q2 "
                    key={iIndex}
                    onClick={() => handleSelect(gIndex, iIndex)}
                  >
                    <img src={img} className="ds-image-review5-p2-q2 " />

                    {/* Display X only when result is shown */}
                    {isSelected && <div className="ds-x">✕</div>}
                    {/* ❌ دائرة حمراء فيها X بيضاء للخطأ فقط عند النتيجة */}
                    {showResult2 && isSelected && !isCorrect && (
                      <span className="wrong-x-circle-review5-p2-q2">✕</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
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

export default Review5_Page2_Q2;
