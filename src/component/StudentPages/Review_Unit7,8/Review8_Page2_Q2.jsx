import React, { useState, useEffect, useRef } from "react";
import "./Review8_Page2_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit8/imgs/U8P73EXEE-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P73EXEE-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P73EXEE-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P73EXEE-04.svg";
import img5 from "../../../assets/unit8/imgs/U8P73EXEE-05.svg";
import img6 from "../../../assets/unit8/imgs/U8P73EXEF-04.svg";
import sound1 from "../../../assets/unit8/sound/U8P73EXEE.mp3";

import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
// الصور + الحرف الصحيح
const shapesData = [
  { id: 1, img: img1, correct: "S" },
  { id: 2, img: img2, correct: "S" },
  { id: 3, img: img3, correct: "Z" },
  { id: 4, img: img4, correct: "S" },
  { id: 5, img: img5, correct: "Z" },
  { id: 6, img: img6, correct: "Z" },
];

// الصفوف (الحروف)
const options = ["S", "Z"];

const Review8_Page2_Q2 = () => {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);
  const audioRef = useRef(null);

  const stopAtSecond = 8.22;
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
      end: 8.22,
      text: " Page 73, Exercise E. What letter does it begin with?Listen and write check.",
    },
    {
      start: 8.25,
      end: 10.02,
      text: "Soup",
    },
    { start: 10.05, end: 11.05, text: "sack" },
    { start: 11.07, end: 12.16, text: "zoo" },
    { start: 12.18, end: 14.06, text: "spoon" },
    { start: 14.09, end: 15.09, text: "zebra" },
    { start: 15.12, end: 17.02, text: "zipper" },
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
  // اختيار خانة
  const handleSelect = (imgId, letter) => {
    if (locked) return;

    setAnswers((prev) => ({
      ...prev,
      [imgId]: letter,
    }));
    setChecked(false);
  };

  // Check Answer
  const checkAnswers = () => {
    if (locked) return;

    if (Object.keys(answers).length < shapesData.length) {
      ValidationAlert.info(
        "Oops!",
        "Please choose an answer for each picture."
      );
      return;
    }

    let score = 0;
    shapesData.forEach((item) => {
      if (answers[item.id] === item.correct) score++;
    });

    setChecked(true);
    setLocked(true);

    const total = shapesData.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  // Show Answer
  const showAnswer = () => {
    const correctSelections = {};
    shapesData.forEach((item) => {
      correctSelections[item.id] = item.correct;
    });

    setAnswers(correctSelections);
    setChecked(true);
    setLocked(true);
  };

  // Reset
  const reset = () => {
    setAnswers({});
    setChecked(false);
    setLocked(false);
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
        <div className="table-wrapper-review4-p1-q3">
          <h4 className="header-title-page8">
            E What letter does it begin with? Listen and write{" "}
            <span style={{ color: "red" }}>✓</span>.
          </h4>
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
          <table className="shapes-table-wrapper-review8-p2-q2">
            <thead>
              <tr>
                <th
                  className="transparent-border"
                  style={{ backgroundColor: "white" }}
                ></th>
                {shapesData.map((item) => (
                  <th key={item.id}>
                    <img
                      src={item.img}
                      alt=""
                      className="shape-img-wrapper-review4-p1-q3"
                      style={{
                        height: "100%",
                        width: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {options.map((letter) => (
                <tr key={letter}>
                  <td className="img-cell-wrapper-review8-p2-q2">
                    <strong style={{ fontSize: "25px" }}>{letter}</strong>
                  </td>

                  {shapesData.map((item) => {
                    const selected = answers[item.id] === letter;
                    const isCorrect =
                      checked && selected && item.correct === letter;
                    const isWrong =
                      checked && selected && item.correct !== letter;

                    return (
                      <td
                        key={item.id}
                        className={`cell-wrapper-review4-p1-q3 ${
                          selected ? "selected-review8-p2-q2" : ""
                        }`}
                        onClick={() => handleSelect(item.id, letter)}
                      >
                        {selected && (
                          <span className="correct-mark-review8-p2-q2">✓</span>
                        )}

                        {isWrong && (
                          <div className="wrong-badge-review8-p2-q2 ">✕</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review8_Page2_Q2;
