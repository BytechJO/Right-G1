import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page8_Q3.css";
import sound1 from "../../../assets/U1 WB/U1/Audio/RWBU1P8EXEC.mp3";
import bat from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-01.svg";
import box from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-02.svg";
import bucket from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-03.svg";
import boat from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-04.svg";
import img5 from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-05.svg";
import img6 from "../../../assets/U1 WB/U1/SVG/U1P8EXEC-06.svg";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const WB_Unit1_Page8_Q3 = () => {
  const [answers, setAnswers] = useState([null, null, null, null]);
  const audioRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const stopAtSecond = 5.1;
  // إعدادات الصوت
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
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const items = [
    { img: bat, correct: "d" },
    { img: box, correct: "t" },
    { img: bucket, correct: "d" },
    { img: boat, correct: "d" },
    { img: img5, correct: "t" },
    { img: img6, correct: "t" },
  ];
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 5.16,
      text: "Phonics Exercise C. Listen, look, and circle. ",
    },
    {
      start: 5.18,
      end: 7.08,
      text: "1.	door. ",
    },
    { start: 7.1, end: 8.28, text: "2.	toy." },
    { start: 8.3, end: 11.24, text: "3.	doll." },
    { start: 11.26, end: 13.2, text: "4. desk." },
    { start: 13.22, end: 15.25, text: "5. train." },
    { start: 15.27, end: 17.25, text: "6. telephone." },
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
      setActiveIndex(null);
      setPaused(false);
      setShowContinue(true);
      setIsPlaying(false);
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
    if (showAnswer) return; // ❌ يمنع التغيير بعد Show Answer

    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (showAnswer) return; // ❌ يمنع التغيير بعد Show Answer
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

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setTimeout(() => setShowResult(true), 200);
  };
  const handleShowAnswer = () => {
    // تحديد الإجابات الصحيحة تلقائياً
    const correctAnswers = items.map((item) => item.correct);

    setAnswers(correctAnswers);
    setShowResult(true);
    setShowAnswer(true); // يمنع أي تعديل بعد هيك
  };

  const resetAnswers = () => {
    setAnswers([null, null, null, null]);
    setShowResult(false);
    setShowAnswer(false); // يمنع أي تعديل بعد هيك
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
        <div>
          <h5 className="header-title-page8">
            <span className="ex-A">C</span> Listen, look, and circle.
          </h5>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "5px 0px",
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
          <div className="dt-container-wb-u1-p8-q3 ">
            {items.map((item, index) => (
              <div className="dt-item-wb-u1-p8-q3" key={index}>
                <img src={item.img} className="dt-image-wb-u1-p8-q3" />
                <div className="dt-options-wb-u1-p8-q3">
                  {/* B OPTION */}
                  <span
                    className={`bp-option 
                    ${answers[index] === "d" ? "selected" : ""}
                    ${
                      showResult &&
                      answers[index] === "d" &&
                      answers[index] !== item.correct
                        ? "wrong-answer"
                        : ""
                    }`}
                    onClick={() => handleSelect(index, "d")}
                  >
                    d
                    {showResult &&
                      answers[index] === "d" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x-wb-u1-p8-q3">✕</span>
                      )}
                  </span>

                  {/* P OPTION */}
                  <span
                    className={`bp-option 
                    ${answers[index] === "t" ? "selected" : ""}
                    ${
                      showResult &&
                      answers[index] === "t" &&
                      answers[index] !== item.correct
                        ? "wrong-answer"
                        : ""
                    }`}
                    onClick={() => handleSelect(index, "t")}
                  >
                    t
                    {showResult &&
                      answers[index] === "t" &&
                      answers[index] !== item.correct && (
                        <span className="wrong-x-wb-u1-p8-q3">✕</span>
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
        <button onClick={handleShowAnswer} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit1_Page8_Q3;
