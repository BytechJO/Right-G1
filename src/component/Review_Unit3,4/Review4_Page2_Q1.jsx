import React, { useState ,useEffect,useRef} from "react";
import ValidationAlert from "../Popup/ValidationAlert";
import "./Review4_Page2_Q1.css";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
import sound1 from "../../assets/unit4/sounds/U4P37EXEE.mp3";
import img1 from "../../assets/unit4/imgs/U4P37EEXEE-01-01.svg"
import img2 from "../../assets/unit4/imgs/U4P37EEXEE-01-02.svg"
import img3 from "../../assets/unit4/imgs/U4P37EEXEE-02-01.svg"
import img4 from "../../assets/unit4/imgs/U4P37EEXEE-02-02.svg"
import img5 from "../../assets/unit4/imgs/U4P37EEXEE-03-01.svg"
import img6 from "../../assets/unit4/imgs/U4P37EEXEE-03-02.svg"
const data = [
  {
    parts: [
      {
        before: "The ",
        middleImg: img1,
        blank: 1,
        after: "ork",
      },
      {
        before: " is on the ",
        middleImg: img2,
        blank: 2,
        after: "et.",
      },
    ],
    correct: ["f", "b"],
  },
  {
    parts: [
      {
        before: "The ",
        middleImg: img3,
        blank: 1,
        after: "ish",
      },
      {
        before: " is in the ",
        middleImg: img4,
        blank: 2,
        after: "an.",
      },
    ],
    correct: ["f", "v"],
  },
  {
    parts: [
      {
        before: "The ",
        middleImg: img5,
        blank: 1,
        after: "est",
      },
      {
        before: " is on my",
        middleImg: img6,
        blank: 2,
        after: "eet",
      },
    ],
    correct: ["v", "f"],
  },
];

const Review4_Page2_Q1 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill(""))
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const audioRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  // زر الكابشن
  const [isMuted, setIsMuted] = useState(false);
  const stopAtSecond = 8;
  const [paused, setPaused] = useState(false);
  const changeSpeed = (rate) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setActiveSpeed(rate);
  };
  const handleChange = (value, qIndex, blankIndex) => {
    const updated = [...answers];
    updated[qIndex][blankIndex] = value.toLowerCase();
    setAnswers(updated);
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
    // 1) افحص إذا في أي خانة فاضية
    const hasEmpty = answers.some((arr) =>
      arr.some((val) => val.trim() === "")
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    // 2) اجمع كل الأخطاء
    let wrong = [];
    let correctCount = 0;

    answers.forEach((arr, qIndex) => {
      arr.forEach((val, blankIndex) => {
        if (val.trim() === data[qIndex].correct[blankIndex]) {
          correctCount++; // صح
        } else {
          wrong.push(`${qIndex}-${blankIndex}`); // غلط
        }
      });
    });

    setWrongInputs(wrong);

    // 3) احسب العدد الكلي للحقول
    const totalInputs = data.reduce(
      (acc, item) => acc + item.correct.length,
      0
    );

    // 4) اختر اللون حسب السكور
    let color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
        ? "red"
        : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${totalInputs}
      </span>
    </div>
  `;

    // 5) طباعة النتيجة
    if (correctCount === totalInputs) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
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
    <div className="container-missing">
      <h3 className="header-title-page8">
        E Listen and write the missing letters.
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
      {data.map((item, qIndex) => (
        <div className="row-missing" key={qIndex}>
          <span className="num">{qIndex + 1}.</span>

          <div className="sentence-review4-p2-q1">
            {item.parts.map((p, blankIndex) => (
              <span
                key={blankIndex}
                className="sentence-part"
                style={{ display: "flex", alignItems: "center" }}
              >
                {p.before}

                {/* الصورة بين before و input */}
              

                <div className="input-wrapper">
                  <input
                    className="missing-input-review4-p2-q1"
                    maxLength="2"
                    value={answers[qIndex][blankIndex]}
                    onChange={(e) =>
                      handleChange(e.target.value, qIndex, blankIndex)
                    }
                  />
                  {wrongInputs.includes(`${qIndex}-${blankIndex}`) && (
                    <span className="wrong-icon">✕</span>
                  )}
                </div>

                {p.after}
                  <img src={p.middleImg} className="middle-img" alt="" />
              </span>
            ))}

            {/* <img src={item.img2} alt="" className="img-missing" /> */}
          </div>
        </div>
      ))}
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setAnswers(data.map((d) => Array(d.correct.length).fill("")));
            setWrongInputs([]);
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
          Check Answers ✓
        </button>
      </div>
    </div>
  );
};

export default Review4_Page2_Q1;
