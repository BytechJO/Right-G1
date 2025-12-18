import React, { useState, useRef, useEffect } from "react";
import "./Review5_Page2_Q2.css";
import sound1 from "../../../assets/unit6/sounds/U6P53EXEE.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import ValidationAlert from "../../Popup/ValidationAlert";

// Example images imports. Replace with your actual paths.
import img1a from "../../../assets/unit6/imgs/U6P53EXEE01-01.svg";
import img1b from "../../../assets/unit6/imgs/U6P53EXEE01-02.svg";
import img1c from "../../../assets/unit6/imgs/U6P53EXEE01-03.svg";

import img2a from "../../../assets/unit6/imgs/U6P53EXEE02-01.svg";
import img2b from "../../../assets/unit6/imgs/U6P53EXEE02-02.svg";
import img2c from "../../../assets/unit6/imgs/U6P53EXEE02-03.svg";

import img3a from "../../../assets/unit6/imgs/U6P53EXEE03-01.svg";
import img3b from "../../../assets/unit6/imgs/U6P53EXEE03-02.svg";
import img3c from "../../../assets/unit6/imgs/U6P53EXEE03-03.svg";

import img4a from "../../../assets/unit6/imgs/U6P53EXEE04-01.svg";
import img4b from "../../../assets/unit6/imgs/U6P53EXEE04-02.svg";
import img4c from "../../../assets/unit6/imgs/U6P53EXEE04-03.svg";

const Review5_Page2_Q2 = () => {
  const groups = [
    { images: [img1a, img1b, img1c], different: 2 },
    { images: [img2a, img2b, img2c], different: 1 },
    { images: [img3a, img3b, img3c], different: 0 },
    { images: [img4a, img4b, img4c], different: 2 },
  ];
  const [showResult2, setShowResult2] = useState(false);
  const [selected, setSelected] = useState(Array(groups.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const audioRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 9;

  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 9.04,
      text: "Page 53, exercise E. Which picture begins with a different sound? Listen and write X.",
    },
    { start: 9.06, end: 13.14, text: "1. goose, gate, kiwi," },
    { start: 13.16, end: 17.17, text: "2. kick, goat, kite," },
    { start: 17.19, end: 22.06, text: "3. king, garlic, game,  " },
    { start: 22.08, end: 27.09, text: "4. kangaroo, key, grapes. " },
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
        clearInterval(interval);
      }
    }, 100);

    // عند انتهاء الأوديو يرجع يبطل أنيميشن + يظهر Continue
    const handleEnded = () => {
      const audio = audioRef.current;
      audio.currentTime = 0; // ← يرجع للبداية
      setActiveIndex(null);
      setPaused(false);
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
  const handleSelect = (groupIndex, imageIndex) => {
    if (locked) return; // 🔒 منع التعديل بعد Show Answer
    const updated = [...selected];
    updated[groupIndex] = imageIndex;
    setSelected(updated);
    setShowResult2(false);
  };
  const showAnswers = () => {
    const correctSelections = groups.map((g) => g.different);

    setSelected(correctSelections);
    setShowResult2(true);
    setLocked(true); // 🔒 قفل التعديل
  };

  const checkAnswers = () => {
    if (locked) return; // 🔒 منع التعديل بعد Show Answer
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
        padding: "30px",
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
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            className="audio-popup-read"
            style={{
              width: "50%",
              marginTop: "0px",
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

        <div className="exercise-row-review5-p2-q2">
          {groups.map((group, gIndex) => (
            <div className="ds-group-box-review5-p2-q2 " key={gIndex}>
              <span style={{ color: "darkblue", fontWeight: "700" }}>
                {gIndex + 1}
              </span>
              {group.images.map((img, iIndex) => {
                const isSelected = selected[gIndex] === iIndex;
                const isCorrect = group.different === iIndex;

                return (
                  <div
                    className="ds-image-wrapper-review5-p2-q2 "
                    key={iIndex}
                    onClick={() => !locked && handleSelect(gIndex, iIndex)}
                  >
                    <img src={img} className="ds-image-review5-p2-q2 " />

                    {/* Display X only when result is shown */}
                    {isSelected && <div className="ds-x">✕</div>}
                    {/* ❌ دائرة حمراء فيها X بيضاء للخطأ فقط عند النتيجة */}
                    {showResult2 && !locked && isSelected && !isCorrect && (
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
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review5_Page2_Q2;
