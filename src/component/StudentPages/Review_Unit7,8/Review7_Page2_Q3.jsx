import React, { useState, useRef, useEffect } from "react";
import CD13_Pg14_Instruction1_AdultLady from "../../../assets/img_unit2/sounds-unit2/CD13.Pg14_Instruction1_Adult Lady.mp3";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review7_Page2_Q3.css";
import sound1 from "../../../assets/unit8/sound/U8P71EXEF.mp3";
import bat from "../../../assets/unit8/imgs/U8P71EXEF-01.svg";
import box from "../../../assets/unit8/imgs/U8P71EXEF-02.svg";
import bucket from "../../../assets/unit8/imgs/U8P71EXEF-03.svg";
import boat from "../../../assets/unit8/imgs/U8P71EXEF-04.svg";
import img5 from "../../../assets/unit8/imgs/U8P71EXEF-05.svg";
import img6 from "../../../assets/unit8/imgs/U8P71EXEF-06.svg";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const Review7_Page2_Q3 = () => {
  const [answers, setAnswers] = useState([null, null, null, null]);
  const audioRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const stopAtSecond = 5.98;
  const [paused, setPaused] = useState(false);
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

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

  const items = [
    { img: bat, correct: "w" },
    { img: box, correct: "h" },
    { img: bucket, correct: "w" },
    { img: boat, correct: "h" },
    { img: img5, correct: "w" },
    { img: img6, correct: "h" },
  ];
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 6.06,
      text: "Page 71, exercise F. Listen and circle the beginning sound ",
    },
    {
      start: 6.09,
      end: 8.11,
      text: "1-watch",
    },
    { start: 8.14, end: 10.17, text: "2- house" },
    { start: 10.20, end: 12.15, text: "3-whale" },
    { start: 12.19, end: 14.14, text: "4-hanger" },
    { start: 14.18, end: 16.22, text: "5-water" },
    { start: 16.25, end: 18.20, text: "6-hare" },
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
    setAnswers(Array(items.length).fill(null));
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
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div>
          <h5 className="header-title-page8">
            F Listen and circle the{" "}
            <span style={{ color: "red" }}>beginning sound.</span>
          </h5>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
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
          <div className="wh-container-review7-p2-q3">
            {items.map((item, index) => (
              <div className="gk-item" key={index}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <span
                    className="q-number"
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {index + 1}
                  </span>
                  <img src={item.img} className="gk-image" />
                </div>

                <div className="gk-options">
                  {/* B OPTION */}
                  <span
                    className={`gk-option 
                    ${answers[index] === "h" ? "selected" : ""}
                    ${
                      showResult &&
                      answers[index] === "h" &&
                      answers[index] !== item.correct
                        ? "wrong-answer"
                        : ""
                    }`}
                    onClick={() => handleSelect(index, "h")}
                  >
                    h
                    {showResult &&
                      answers[index] === "h" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x">✕</span>
                      )}
                  </span>

                  {/* P OPTION */}
                  <span
                    className={`gk-option 
                    ${answers[index] === "w" ? "selected" : ""}
                    ${
                      showResult &&
                      answers[index] === "w" &&
                      answers[index] !== item.correct
                        ? "wrong-answer"
                        : ""
                    }`}
                    onClick={() => handleSelect(index, "w")}
                  >
                    w
                    {showResult &&
                      answers[index] === "w" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x">✕</span>
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

export default Review7_Page2_Q3;
