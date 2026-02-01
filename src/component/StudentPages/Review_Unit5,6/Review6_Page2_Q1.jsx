import React, { useState, useEffect, useRef } from "react";
import "./Review6_Page2_Q1.css";
import sound1 from "../../../assets/unit6/sounds/U6P55EXED.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/unit6/imgs/U6P55EXED-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P55EXED-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P55EXED-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P55EXED-04.svg";
const data = [
  {
    id: 1,
    src: img1,
    options: [
      { label: "Fish", answer: true },
      { label: "Kite", answer: false },
    ],
  },
  {
    id: 2,
    src: img2,
    options: [
      { label: "Crib", answer: true },
      { label: "Knight", answer: false },
    ],
  },
  {
    id: 3,
    src: img3,
    options: [
      { label: "Five", answer: false },
      { label: "Lips", answer: true },
    ],
  },
  {
    id: 4,
    src: img4,
    options: [
      { label: "Ice", answer: false },
      { label: "Figs", answer: true },
    ],
  },
];

const Review6_Page2_Q1 = () => {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);
  const audioRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 7.9;
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
      end: 8.1,
      text: "Page 55, exercise D, which picture has the short I sound? Listen and write check. ",
    },
    { start: 8.12, end: 11.17, text: " 1. Fish, kite.  " },
    { start: 11.19, end: 14.23, text: "2. Crib, knight. " },
    { start: 14.25, end: 18.03, text: "3. Five, lips. " },
    { start: 18.05, end: 21.2, text: "4. Ice, figs." },
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

  const checkAnswers = () => {
    if (locked) return; // 🔒 منع التعديل بعد رؤية الحل

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
      if (q.options[chosenIndex].answer === true) {
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
     setLocked(true);
  };
  const handleSelect = (qId, index) => {
    if (locked) return; // 🔒 منع التعديل بعد رؤية الحل
    setSelected((prev) => ({ ...prev, [qId]: index }));
    setShowResult(false);
  };
  const showAnswers = () => {
    const correctSelection = {};

    data.forEach((q) => {
      const correctIndex = q.options.findIndex((opt) => opt.answer === true);
      correctSelection[q.id] = correctIndex;
    });

    setSelected(correctSelection);
    setShowResult(false);
    setLocked(true);
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
          // gap: "30px",
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

              <div key={question.id} className="question-box2-review6-p2-q1">
              

                {/* الصورة الواحدة */}
                <img
                  src={question.src}
                  className="main-img-review6-p2-q1"
                  alt=""
                 
                />

                {/* الخيارات */}
                <div className="options-review6-p2-q1">
                  {question.options.map((opt, index) => (
                    <div
                      key={index}
                      className={`option-review6-p2-q1 ${
                        selected[question.id] === index
                          ? "selected-review6-p2-q1"
                          : ""
                      }`}
                      onClick={() => handleSelect(question.id, index)}
                    >
                      {/* X عند الغلط */}
                      {showResult &&
                     
                        selected[question.id] === index &&
                        opt.answer === false && (
                          <span className="wrong-x-circle-review6-p2-q1">
                            ✕
                          </span>
                        )}

                      <span className="check-box-review6-p2-q1">
                        {selected[question.id] === index ? "✓" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
            setLocked(false);
          }}
        >
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review6_Page2_Q1;
