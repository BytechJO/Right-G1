import React, { useState, useRef, useEffect } from "react";
import "./Unit7_Page5_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit7/img/U7P62EXEA2-01.svg";
import img2 from "../../../assets/unit7/img/U7P62EXEA2-02.svg";
import img3 from "../../../assets/unit7/img/U7P62EXEA2-03.svg";
import img4 from "../../../assets/unit7/img/U7P62EXEA2-04.svg";
import img5 from "../../../assets/unit7/img/U7P62EXEA2-05.svg";
import img6 from "../../../assets/unit7/img/U7P62EXEA2-06.svg";
import img7 from "../../../assets/unit7/img/U7P62EXEA2-07.svg";
import img8 from "../../../assets/unit7/img/U7P62EXEA2-08.svg";
import img9 from "../../../assets/unit7/img/U7P62EXEA2-09.svg";
import img10 from "../../../assets/unit7/img/U7P62EXEA2-10.svg";
import sound1 from "../../../assets/unit7/sound/U7P62EXEA2.mp3";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const data = [
  {
    id: 1,
    letter: "w",
    images: [
      { id: 1, src: img1, value: 1 },
      { id: 2, src: img2, value: 2 },
      { id: 3, src: img3, value: 3 },
      { id: 4, src: img4, value: 4 },
      { id: 5, src: img5, value: 5 },
    ],
    correct: [1, 3, 4],
  },
  {
    id: 2,
    letter: "h",
    images: [
      { id: 1, src: img6, value: 1 },
      { id: 2, src: img7, value: 2 },
      { id: 3, src: img8, value: 3 },
      { id: 4, src: img9, value: 4 },
      { id: 5, src: img10, value: 5 },
    ],
    correct: [2, 3, 4],
  },
];

export default function Unit7_Page5_Q2() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW

  // ---------------------- AUDIO SETUP (unchanged) -----------------------
  // إعدادات الصوت
  const audioRef = useRef(null);
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 3.5;
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);

  // -----------------------------------------------------------------------

  const handleSelect = (qId, value) => {
    if (showAnswer) return; // ❌ ممنوع تعديل الإجابات بعد Show Answer

    setAnswers((prev) => {
      const current = prev[qId] || [];

      // Unselect if selected before
      if (current.includes(value)) {
        return { ...prev, [qId]: current.filter((v) => v !== value) };
      }

      // Max selections = 3
      if (current.length >= 3) return prev;

      return { ...prev, [qId]: [...current, value] };
    });
  };

  const handleCheck = () => {
    if (showAnswer) return;
    if (!answers[data[0].id] || answers[data[0].id].length === 0) {
      ValidationAlert.info("Please select at least one picture in question 1.");
      return;
    }
    if (!answers[data[1].id] || answers[data[1].id].length === 0) {
      ValidationAlert.info("Please select at least one picture in question 2.");
      return;
    }

    let correctCount = 0;
    const total = data.reduce((sum, q) => sum + q.correct.length, 0);

    data.forEach((q) => {
      const studentAnswers = answers[q.id] || [];
      q.correct.forEach((correctValue) => {
        if (studentAnswers.includes(correctValue)) {
          correctCount++;
        }
      });
    });

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = ` 
      <div style="font-size:20px;text-align:center;margin-top:8px">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowAnswer(false); // ⭐ NEW
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};

    data.forEach((q) => {
      correctAnswers[q.id] = q.correct; // أعطيه الإجابات الصحيحة لكل سؤال
    });

    setAnswers(correctAnswers);
    setShowAnswer(true);
    setSubmitted(true);
  };

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 5.44,
      text: "Page 62, Right activities. Exercise A, number two.",
    },
    {
      start: 5.55,
      end: 10.82,
      text: " Which pictures begin with the same sound? Listen and circle. ",
    },
    {
      start: 10.9,
      end: 20.32,
      text: "One, W. Watermelon, burger, whale, wagon, hand.",
    },
    {
      start: 20.4,
      end: 29.58,
      text: "  Two, H. Watch, house, hat, hammer, web.",
    },
  ];

  /**
   * 
   *  Two, H. 

Watch, house, hat, hammer, web.

   */
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
        <h5 className="header-title-page8">
          <span style={{ color: "purple" }}>2</span>
          Which pictures begin with the{" "}
          <span style={{ color: "red" }}>same sound</span>? Listen and circle
        </h5>

        {/* AUDIO PLAYER — unchanged */}
        {/* -------------------------------------------------- */}
        {/* ... audio code remains as-is ... */}
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
        {/* -------------------------------------------------- */}

        {data.map((q) => (
          <div
            key={q.id}
            className="question-row-Unit5_Page5_Q2"
            style={{ marginTop: "15px" }}
          >
            <span
              className="q-number"
              style={{ color: "#2c5287", fontSize: "20px", fontWeight: "700" }}
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
              {q.letter}
            </span>

            <div className="images-row-Unit7_Page5_Q2">
              {q.images.map((img) => {
                const isSelected = answers[q.id]?.includes(img.value);
                const isWrong =
                  submitted &&
                  isSelected &&
                  !q.correct.includes(img.value) &&
                  !showAnswer;

                return (
                  <div
                    key={img.id}
                    className={`img-box-Unit7_Page5_Q2 
                      ${isSelected ? "selected-Unit5_Page5_Q2" : ""} 
                      ${isWrong ? "wrong" : ""}`}
                    onClick={() => handleSelect(q.id, img.value)}
                  >
                    <img src={img.src} alt="" />

                    {isWrong && (
                      <div className="wrong-mark-Unit5_Page5_Q2">✕</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>

        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
