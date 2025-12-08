import React, { useState, useRef, useEffect } from "react";
import "./Unit2_Page10_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound1 from "../../../assets/unit1/sounds/P19QD.mp3";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";

const Unit2_Page10_Q1 = () => {
  const audioRef = useRef(null);
  const [isShowMode, setIsShowMode] = useState(false);
  const stopAtSecond = 4.5;
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
  const [activeIndex, setActiveIndex] = useState(null);
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
    if (isShowMode) return; // 🚫 ممنوع التغيير بعد show answer

    setCircledWords((prev) => ({
      ...prev,
      [sIndex]: [wIndex], // 🟢 كل جملة لها اختيار واحد فقط
    }));
    setChecked(false);
  };

  const handleShowAnswer = () => {
    let correctSelections = {};

    // نحدد الاختيارات الصحيحة فقط
    Object.keys(correct).forEach((key) => {
      correctSelections[key] = [...correct[key]]; // الدائرة على الصحيحة فقط
    });

    setCircledWords(correctSelections);
    setIsShowMode(true); // 🚫 يمنع التعديل
    setChecked(false);
  };
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0, end: 4.26, text: " Page 19, exercise D. Listen and circle. " },
    { start: 4.28, end: 7.02, text: "1-pencil." },
    { start: 7.04, end: 9.01, text: "2-boy." },
    { start: 9.03, end: 10.21, text: "3-bird." },
    { start: 10.23, end: 13.10, text: "4-pizza. " },
    { start: 13.12, end: 14.29, text: "5-pink." },
    { start: 14.31, end: 17.06, text: "6-ball." },
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
  const checkAnswers = () => {
    if (isShowMode) return;
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
        <div className="content-container10">
          <h5 className="header-title-page8">D Listen and circle.</h5>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
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
                      {isWrong && <span className="wrong-x10">✕</span>}
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
              setIsShowMode(false); // 🔄 رجوع لوضع اللعب
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>
          <button
            onClick={handleShowAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit2_Page10_Q1;
