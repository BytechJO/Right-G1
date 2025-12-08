import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page10_Q3.css";
import sound1 from "../../../assets/unit1/sounds/P19QF.mp3";
import ball from "../../../assets/img_unit2/imgs/Football.jpg";
import bag from "../../../assets/img_unit2/imgs/bag.jpg";
import pants from "../../../assets/img_unit2/imgs/pants.jpg";
import panda from "../../../assets/img_unit2/imgs/panda.jpg";
import paper from "../../../assets/img_unit2/imgs/paper.jpg";
import baby from "../../../assets/img_unit2/imgs/baby.jpg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
const Unit2_Page10_Q3 = () => {
  const audioRef = useRef(null);
  const stopAtSecond = 4.2;
  const [showAnswer, setShowAnswer] = useState(false);

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

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0, end: 4.19, text: "Page 19, Exercise f. Listen and circle." },
    { start: 4.21, end: 9.01, text: "1-ball, baby, bag. " },
    { start: 9.03, end: 14.03, text: "2-pants, paper, panda- " },
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
  const questions = [
    {
      id: 1,
      images: [ball, baby, bag],
      correct: "b",
      options: ["b", "p"],
    },
    {
      id: 2,
      images: [pants, paper, panda],
      correct: "p",
      options: ["b", "p"],
    },
  ];

  const [answers, setAnswers] = useState({});
  //   const [checked, setChecked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const handleSelect = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (showAnswer) return;
    // 🔸 تحقق إذا الطالب جاوب على الكل
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info("Oops!", "Please answer all items first.");
      return;
    }

    // 🔹 احسب عدد الإجابات الصح
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id]?.toLowerCase() === q.correct.toLowerCase()) {
        correctCount++;
      }
    });

    const total = questions.length;
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
  const handleShowAnswer = () => {
    let correctObj = {};
    questions.forEach((q) => {
      correctObj[q.id] = q.correct; // نعبّي الإجابات الصحيحة مباشرة
    });

    setAnswers(correctObj);
    setShowAnswer(true);
    setShowResult(false);
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
        <div className="page10-q3-container">
          <h5 className="header-title-page8">F Listen and circle.</h5>

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

          <div className="questions-grid">
            {questions.map((q) => (
              <div key={q.id} className="question-box">
                <div className="question-number">{q.id}</div>

                <div className="images-row">
                  {q.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      className="question-img-unit2-p10-q3"
                    />
                  ))}
                </div>

                <div className="options-row">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    const isWrong =
                      showResult &&
                      isSelected &&
                      answers[q.id]?.toLowerCase() !== q.correct.toLowerCase();
                    const isCorrectShow = showAnswer;

                    return (
                      <span
                        key={opt}
                        className={`option-letter  ${
                          isSelected ? "selected3" : ""
                        } ${isCorrectShow ? "correct-answer" : ""}`}
                        onClick={() => !showAnswer && handleSelect(q.id, opt)}
                      >
                        {opt}
                        {isWrong && <span className="wrong-x10-3">✕</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setAnswers({});
            setShowResult(false);
            setShowAnswer(false);
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
  );
};

export default Unit2_Page10_Q3;
