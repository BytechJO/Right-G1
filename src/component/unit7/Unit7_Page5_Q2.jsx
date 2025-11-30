import React, { useState, useRef, useEffect } from "react";
import "./Unit7_Page5_Q2.css";
import ValidationAlert from "../Popup/ValidationAlert";
import img1 from "../../assets/unit5/imgs/U5P44EXEA2-01.svg";
import img2 from "../../assets/unit5/imgs/U5P44EXEA2-02.svg";
import img3 from "../../assets/unit5/imgs/U5P44EXEA2-03.svg";
import img4 from "../../assets/unit5/imgs/U5P44EXEA2-04.svg";
import img5 from "../../assets/unit5/imgs/U5P44EXEA2-05.svg";
import img6 from "../../assets/unit5/imgs/U5P44EXEA2-06.svg";
import sound from "../../assets/unit6/sounds/CD50.Pg53_Instruction1_Adult Lady.mp3";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { IoMdSettings } from "react-icons/io";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
const data = [
  {
    id: 1,
    letter: "w",
    images: [
      { id: 1, src: img1, value: 1 },
      { id: 2, src: img2, value: 2 },
      { id: 3, src: img3, value: 3 },
      { id: 4, src: img2, value: 4 },
      { id: 5, src: img3, value: 5 },
    ],
    correct: [1, 3, 4],
  },
  {
    id: 2,
    letter: "h",
    images: [
      { id: 1, src: img4, value: 1 },
      { id: 2, src: img5, value: 2 },
      { id: 3, src: img6, value: 3 },
      { id: 4, src: img5, value: 4 },
      { id: 5, src: img6, value: 5 },
    ],
    correct: [2, 3, 4],
  },
];

export default function Unit7_Page5_Q2() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSelect = (qId, value) => {
    setAnswers((prev) => {
      const current = prev[qId] || [];

      // 1️⃣ إذا كانت الصورة مختارة → نشيلها (Toggle)
      if (current.includes(value)) {
        return { ...prev, [qId]: current.filter((v) => v !== value) };
      }

      // 2️⃣ إذا حاول يختار أكثر من 2 → نمنعه
      if (current.length >= 3) {
        return prev;
      }

      // 3️⃣ إضافة اختيار جديد
      return { ...prev, [qId]: [...current, value] };
    });
  };

  const handleCheck = () => {
    // فحص إذا الطالب مختار على الأقل إجابة من السؤال الأول
    if (!answers[data[0].id] || answers[data[0].id].length === 0) {
      ValidationAlert.info("Please select at least one picture in question 1.");
      return;
    }

    // فحص إذا الطالب مختار على الأقل إجابة من السؤال الثاني
    if (!answers[data[1].id] || answers[data[1].id].length === 0) {
      ValidationAlert.info("Please select at least one picture in question 2.");
      return;
    }

    let correctCount = 0;

    // نحسب total = مجموع كل الإجابات الصحيحة
    const total = data.reduce((sum, q) => sum + q.correct.length, 0);

    // حساب عدد الصح
    data.forEach((q) => {
      const studentAnswers = answers[q.id] || [];

      q.correct.forEach((correctValue) => {
        if (studentAnswers.includes(correctValue)) {
          correctCount++;
        }
      });
    });

    // اختيار اللون حسب النتيجة
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    // إظهار نوع النتيجة
    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="circle-wrapper-Unit5_Page5_Q2">
          <h5 className="header-title-page8">
            <span style={{ color: "purple" }}>2</span>Which pictures begin with
            the <span style={{ color: "red" }}>same sound </span>? Listen and
            circle
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
          {data.map((q) => (
            <div
              key={q.id}
              className="question-row-Unit5_Page5_Q2"
              style={{
                marginTop: "15px",
              }}
            >
              <span
                className="q-number"
                style={{
                  color: "#2c5287",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {q.id}
              </span>
              <span
                style={{
                  color: "#2c5287",
                  fontSize: "20px",
                  fontWeight: "700",
                  marginLeft: "5px",
                }}
              >
                {" "}
                {q.letter}
              </span>
              <div className="images-row-Unit7_Page5_Q2">
                {q.images.map((img) => {
                  const isSelected = answers[q.id]?.includes(img.value);
                  const isWrong =
                    submitted && isSelected && !q.correct.includes(img.value);

                  return (
                    <div
                      key={img.id}
                      className={`img-box-Unit5_Page5_Q2 
                    ${isSelected ? "selected-Unit5_Page5_Q2" : ""} 
                
                    ${isWrong ? "wrong" : ""}`}
                      onClick={() => handleSelect(q.id, img.value)}
                    >
                      <img src={img.src} alt="" />
                      {/* علامة X تظهر فقط عند الغلط */}
                      {isWrong && (
                        <div className="wrong-mark-Unit5_Page5_Q2 ">✕</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>
        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
