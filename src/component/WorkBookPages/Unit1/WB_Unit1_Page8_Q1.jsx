import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page8_Q1.css";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import audio1 from "../../../assets/U1 WB/U1/Audio/RWBU1P8EXEA.mp3";
import img1 from "../../../assets/U1 WB/U1/SVG/U1P8EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U1/SVG/U1P8EXEA-02.svg";

const WB_Unit1_Page8_Q1 = () => {
  const audioRef = useRef(null);

  const questions = [
    {
      img: img1,
      type: "end", // الخيارات بنهاية الجملة
      parts: {
        before: "The food is in the ",
        after: ".",
      },
      options: ["dish", "deer"],
      correctIndex: 0,
    },
    {
      img: img2,
      type: "middle", // الخيارات داخل الجملة
      parts: {
        before: "The ",
        after: " is round.",
      },
      options: ["table", "tiger"],
      correctIndex: 0,
    },
  ];

  const stopAtSecond = 5.5;
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
      end: 6.0,
      text: "Phonics Exercise A. Listen, read, and circle the correct word. ",
    },
    {
      start: 6.02,
      end: 8.26,
      text: "1.	the food is in the dish.",
    },
    { start: 8.28, end: 11.15, text: "2.	the table is round." },
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

  const [answers, setAnswers] = useState(() => {
    const arr = Array(questions.length).fill(null);

    return arr;
  });

  const [showResult, setShowResult] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const selectOption = (qIndex, optIndex) => {
    if (showAnswer) return;
    const updated = [...answers];
    updated[qIndex] = optIndex;
    setAnswers(updated);
    setShowResult(false);
  };

  const checkAnswers = () => {
    if (showAnswer) return;
    if (answers.includes(null)) {
      return ValidationAlert.info("Oops!", "Please circle all the words!");
    }

    const total = questions.length ;
    let correct = 0;

    answers.forEach((ans, i) => {
    
      if (ans === questions[i].correctIndex) correct++;
    });

    let color = correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} / ${total}
        </span>
      </div>`;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setShowResult(true);
  };

  const reset = () => {
    setAnswers(() => {
      const arr = Array(questions.length).fill(null);
     
      return arr;
    });
    setShowResult(false);
    setShowAnswer(false);
  };

  const showCorrectAnswers = () => {
    const correct = questions.map((q) => q.correctIndex);
    setAnswers(correct);
    setShowAnswer(true);
    setShowResult(false);
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
    <div className="page8-wrapper"style={{padding:"30px"}}>
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "relative",
          width: "60%",
        }}
      >
        <div className="page8-content">
          <h3 className="header-title-page8">
            <span className="ex-A">A</span> Listen, read, and circle the correct
            word.
          </h3>
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
                src={audio1}
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

        <div className="container-wb-u1-p8-q1">
          {questions.map((q, i) => (
            <div key={i} className="question-box-wb-u1-p8-q1">
              <span
                className="num"
                style={{
                  color: "darkblue",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                {i + 1}
              </span>

              <img
                src={q.img}
                className="q-image-wb-u1-p8"
                alt="question"
                style={{ height: "100px", width: "auto" }}
              />

              <div className="sentence-options">
                {q.type === "end" && (
                  <>
                    <span
                      className="sentence-text"
                      style={{
                        color: "black",
                        fontSize: "20px",
                      }}
                    >
                      {q.parts.before}
                    </span>

                    {/* الخيارات في آخر الجملة */}
                    {q.options.map((word, optIndex) => {
                      const isSelected = answers[i] === optIndex;
                      const isCorrect = optIndex === q.correctIndex;

                      return (
                        <span
                          key={optIndex}
                          style={{
                            color: "black",
                            fontWeight: "700",
                            fontSize: "20px",
                          }}
                          className={`option-word-unit7-p5-q1 
                ${isSelected ? "selected3" : ""}
                ${showResult && isSelected && !isCorrect ? "wrong" : ""}
                ${showResult && isCorrect ? "correct" : ""}
            `}
            onClick={() => selectOption(i, optIndex)}   // ← ← الحل هنا
                        >
                          {word}
                          {optIndex === 0 ? "/" : ""}
                          {showResult && isSelected && !isCorrect && (
                            <span className="wrong-x-wb-u1-p5-q1">✕</span>
                          )}
                        </span>
                      );
                    })}

                    <span
                      className="sentence-text"
                      style={{
                        color: "black",
                        fontSize: "20px",
                      }}
                    >
                      {q.parts.after}
                    </span>
                  </>
                )}

                {/* النموذج الثاني: الكلمات داخل الجملة */}
                {q.type === "middle" && (
                  <>
                    <span
                      className="sentence-text"
                      style={{
                        color: "black",
                        fontSize: "20px",
                      }}
                    >
                      {q.parts.before}
                    </span>

                    {q.options.map((word, optIndex) => {
                      const isSelected = answers[i] === optIndex;
                      const isCorrect = optIndex === q.correctIndex;

                      return (
                        <span
                          key={optIndex}
                          style={{
                            color: "black",
                            fontWeight: "700",
                            fontSize: "20px",
                          }}
                          className={`option-word-unit7-p5-q1 
                ${isSelected ? "selected3" : ""}
                ${showResult && isSelected && !isCorrect ? "wrong" : ""}
                ${showResult && isCorrect ? "correct" : ""}
            `}
                          onClick={() => selectOption(i, optIndex)}
                        >
                          {word}
                          {optIndex === 0 ? "/" : ""}
                          {showResult && isSelected && !isCorrect && (
                            <span className="wrong-x-wb-u1-p5-q1">✕</span>
                          )}
                        </span>
                      );
                    })}

                    <span
                      className="sentence-text"
                      style={{
                        color: "black",
                        fontSize: "20px",
                      }}
                    >
                      {q.parts.after}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button
          className="show-answer-btn swal-continue"
          onClick={showCorrectAnswers}
        >
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit1_Page8_Q1;
