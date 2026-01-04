import React, { useState, useRef, useEffect } from "react";
import CD13_Pg14_Instruction1_AdultLady from "../../../assets/img_unit2/sounds-unit2/CD13.Pg14_Instruction1_Adult Lady.mp3";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page6_Q1.css";
import sound1 from "../../../assets/unit4/sounds/U4P37EXEF.mp3";
import bat from "../../../assets/U1 WB/U4/U4P26EXEA-01.svg";
import box from "../../../assets/U1 WB/U4/U4P26EXEA-02.svg";
import bucket from "../../../assets/U1 WB/U4/U4P26EXEA-03.svg";
import boat from "../../../assets/U1 WB/U4/U4P26EXEA-04.svg";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const WB_Unit4_Page6_Q1 = () => {
  const [answers, setAnswers] = useState([null, null, null]);
  const audioRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer
  const items = [
    { img: bat, correct: "f" },
    { img: box, correct: "f" },
    { img: bucket, correct: "v" },
    { img: boat, correct: "v" },
  ];
  const stopAtSecond = 9.02;
  const [paused, setPaused] = useState(false);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 9.02,
      text: "Page 37, Exercise F. What is the beginning sound or the word? Listen and circle. ",
    },
    {
      start: 9.04,
      end: 10.14,
      text: "Farm.",
    },
    { start: 10.16, end: 11.08, text: "Fever." },
    { start: 11.1, end: 12.19, text: "Valley." },
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
  useEffect(() => {
    const audio = audioRef.current;
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
      const audio = audioRef.current;
      audio.currentTime = 0; // ← يرجع للبداية
      setIsPlaying(false);
      setPaused(false);
      setActiveIndex(null);
      setShowContinue(true);
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
    if (activeIndex === -1 || activeIndex === null) return;

    const el = document.getElementById(`caption-${activeIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleSelect = (index, value) => {
    if (locked) return; // ⭐ NEW — منع التعديل بعد Show Answer
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // 🔥 يمنع بقاء الإكس بعد ما يغيّر الطالب جوابه
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — منع التعديل بعد Show Answer
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please answer all items first.");
      return;
    }

    const correctCount = answers.filter(
      (a, i) => a?.toLowerCase() === items[i].correct?.toLowerCase()
    ).length;

    const total = items.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;
    setLocked(true); // ⭐ NEW — قفل التعديل بعد Check
    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setTimeout(() => setShowResult(true), 200);
  };

  const resetAnswers = () => {
    setAnswers([null, null, null]);
    setShowResult(false);
    setLocked(false); // ⭐ NEW — إعادة فتح التعديل
  };

  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    const correctFilled = items.map((item) => item.correct);

    setAnswers(correctFilled); // ضع الإجابات الصحيحة
    setShowResult(true); // إظهار النتيجة
    setLocked(true); // قفل الخيارات
  };
  const togglePlay = () => {
    const audio = audioRef.current;

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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div  className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8">
         <span className="ex-A">A</span> Listen, look, and circle.
          </h5>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "30px 0px",
            width: "100%",
          }}
        >
          <div
            className="audio-popup-read"
            style={{
              width: "50%",
            }}
          >
            <div className="audio-inner player-ui">
              <audio
                ref={audioRef}
                src={sound1}
                onTimeUpdate={(e) => {
                  const time = e.target.currentTime;
                  setCurrent(time);
                  updateCaption(time);
                }}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
              ></audio>
              {/* Play / Pause */}
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
                    audioRef.current.currentTime = e.target.value;
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
              {/* الأزرار 3 أزرار بنفس السطر */}
              <div className="bottom-row">
                {/* فقاعة */}
                <div
                  className={`round-btn ${showCaption ? "active" : ""}`}
                  style={{ position: "relative" }}
                  onClick={() => setShowCaption(!showCaption)}
                >
                  <TbMessageCircle size={36} />
                  <div
                    className={`caption-inPopup ${showCaption ? "show" : ""}`}
                    style={{ top: "100%", left: "10%" }}
                  >
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
        <div
          className="imgFeild"
          style={{
            display: "flex",
            gap: "13px",
            flexDirection: "column",
          }}
        >
          <div className="fv-container-wb-unit4-p6-q1">
            {items.map((item, index) => (
              <div className="fv-item-wb-unit4-p6-q1" key={index}>
                <div
                  style={{
                    display: "flex",
                    gap: "13px",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      color: "darkblue",
                      fontWeight: "600",
                    }}
                  >
                    {index + 1}
                  </span>
                  <img src={item.img} className="fv-image-wb-unit4-p6-q1" />
                </div>
                <div className="fv-options-wb-unit4-p6-q1">
                  {/* B OPTION */}
                  <span
                    style={{ position: "relative" }}
                    className={`fv-option 
                    ${answers[index] === "f" ? "selected-review4-p2-q2" : ""}
                    ${
                      showResult &&
                      answers[index] === "f" &&
                      answers[index] !== item.correct
                        ? "wrong-answer"
                        : ""
                    }`}
                    onClick={() => handleSelect(index, "f")}
                  >
                    f
                    {showResult &&
                      answers[index] === "f" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x-fv">✕</span>
                      )}
                  </span>

                  {/* P OPTION */}
                  <span
                    style={{ position: "relative" }}
                    className={`fv-option 
                    ${answers[index] === "v" ? "selected-review4-p2-q2" : ""}
                    ${
                      showResult &&
                      answers[index] === "v" &&
                      answers[index] !== item.correct
                        ? "wrong-answer"
                        : ""
                    }`}
                    onClick={() => handleSelect(index, "v")}
                  >
                    v
                    {showResult &&
                      answers[index] === "v" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x-fv">✕</span>
                      )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit4_Page6_Q1;
