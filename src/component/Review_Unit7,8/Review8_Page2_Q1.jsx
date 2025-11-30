import React, { useState, useEffect, useRef } from "react";
import "./Review6_Page2_Q1.css";
import sound from "../../assets/unit6/sounds/CD50.Pg53_Instruction1_Adult Lady.mp3";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import ValidationAlert from "../Popup/ValidationAlert";

const data = [
  {
    id: 1,
    imgs: [
      { src: "/fish.png", answer: true }, // short i
      { src: "/kite.png", answer: false },
    ],
  },
  {
    id: 2,
    imgs: [
      { src: "/crib.png", answer: true }, // short i
      { src: "/city.png", answer: false },
    ],
  },
  {
    id: 3,
    imgs: [
      { src: "/five.png", answer: false },
      { src: "/lips.png", answer: true }, // short i
    ],
  },
  {
    id: 4,
    imgs: [
      { src: "/milk.png", answer: false }, // short i
      { src: "/fig.png", answer: true },
    ],
  },
];

const Review6_Page2_Q1 = () => {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const handleSelect = (qId, index) => {
    setSelected((prev) => ({ ...prev, [qId]: index }));
    setShowResult(false);
  };
  const mainAudioRef = useRef(null);
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 3.5;

  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
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

  const checkAnswers = () => {
    const totalQuestions = data.length;
    let correct = 0;

    // تأكد إنو جاوب كل الأسئلة
    for (let q of data) {
      if (selected[q.id] === undefined) {
        ValidationAlert.info("");
        return;
      }
    }

    // حساب عدد الإجابات الصحيحة
    data.forEach((q) => {
      const chosenIndex = selected[q.id];
      if (q.imgs[chosenIndex].answer === true) {
        correct++;
      }
    });
    const color =
      correct === totalQuestions ? "green" : correct === 0 ? "red" : "orange";
    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${correct} / ${totalQuestions}
      </span>
    </div>
  `;

    // النتيجة
    if (correct === totalQuestions) {
      ValidationAlert.success(scoreMessage);
    } else if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setShowResult(true);
  };

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
        <h5 className="header-title-page8">
          D Which picture has the{" "}
          <span style={{ color: "red" }}>the short i</span> sound? Listen and
          write <span style={{ color: "red" }}>✓</span> .
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
        <div className="shorti-container-review6-p2-q1 ">
          {data.map((question) => (
            <div key={question.id} className="question-box-review6-p2-q1 ">
              <span
                style={{
                  color: "darkblue",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                {question.id}
              </span>
              {question.imgs.map((img, index) => {
                return (
                  <div
                    key={index}
                    className={`img-box-review6-p2-q1  ${
                      selected[question.id] === index ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(question.id, index)}
                  >
                    
                    {showResult &&
                      selected[question.id] === index &&
                      img.answer === false && (
                        <span className="wrong-x-circle-review6-p2-q1">✕</span>
                      )}
                    <img src={img.src} alt="" />
                    <div className="check-box-review6-p2-q1 ">
                      {selected[question.id] === index ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setSelected({});
            setShowResult(false);
          }}
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
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review6_Page2_Q1;
