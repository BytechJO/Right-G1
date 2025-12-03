import React, { useState, useRef, useEffect } from "react";
import CD6_Pg8_Instruction1_AdultLady from "../../../assets/unit1/sounds/pg8-instruction1-all.mp3";
import Pg8_1_1_AdultLady from "../../../assets/unit1/sounds/Pg8_1.1_Adult Lady.mp3";
import Pg8_1_2_AdultLady from "../../../assets/unit1/sounds/Pg8_1.2_Adult Lady.mp3";
import Pg8_1_3_AdultLady from "../../../assets/unit1/sounds/Pg8_1.3_Adult Lady.mp3";
import Pg8_1_4_AdultLady from "../../../assets/unit1/sounds/Pg8_1.4_Adult Lady.mp3";
import deer from "../../../assets/unit1/imgs/deer flip.svg";
import duck from "../../../assets/unit1/imgs/duck.svg";
import taxi from "../../../assets/unit1/imgs/taxi_1.svg";
import tiger from "../../../assets/unit1/imgs/tiger.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const Page8_Q1 = () => {
  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAutoAnswer, setIsAutoAnswer] = useState(false);
  const data = [
    {
      word: "deer",
      missing: "d",
      sound: Pg8_1_4_AdultLady,
      src: deer,
      num: "4",
    },
    {
      word: "duck",
      missing: "d",
      sound: Pg8_1_3_AdultLady,
      src: duck,
      num: "3",
    },
    {
      word: "tiger",
      missing: "t",
      sound: Pg8_1_1_AdultLady,
      src: tiger,
      num: "1",
    },
    {
      word: "taxi",
      missing: "t",
      sound: Pg8_1_2_AdultLady,
      src: taxi,
      num: "2",
    },
  ];

  const displayOrder = [2, 3, 1, 0]; // ترتيب الكلمات

  const [answers, setAnswers] = useState(
    data.map(() => ({ letter: "", number: "" }))
  );
  const [wrongLetters, setWrongLetters] = useState(data.map(() => false));
  const [wrongNumbers, setWrongNumbers] = useState(data.map(() => false));

  const stopAtSecond = 9;
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
   
    { start: 0, end: 4.23, text: "Page 8. Right Activities. Exercise A, number 1. " },
    {
      start: 4.25,
      end: 8.28,
      text: "Listen and write the missing letters. Number the pictures.  ",
    },
    { start: 8.30, end: 11.05, text: "1-tiger." },
    { start: 11.07, end: 13.12, text: "2-taxi." },
    { start: 13.14, end: 15.14, text: "3-duck." },
    { start: 15.16, end: 17.13, text: "4-deer." },
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

  const updateAnswer = (index, field, value) => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === index ? { ...a, [field]: value.toLowerCase() } : a
      )
    );
    setWrongLetters(data.map(() => false));
    setWrongNumbers(data.map(() => false));
  };

  const playSound = (src) => {
    if (!clickAudioRef.current) return;
    clickAudioRef.current.src = src;
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play();
  };

  const reset = () => {
    setAnswers(data.map(() => ({ letter: "", number: "" })));
    setWrongLetters(data.map(() => false));
    setWrongNumbers(data.map(() => false));
    setShowAnswer(false);
    setIsAutoAnswer(false); // ← رجع اللون للأسود
  };

  const checkAnswers = () => {
    if (answers.some((a) => a.letter === "" || a.number === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking."
      );
      return;
    }

    let correctLetters = 0;
    let correctNumbers = 0;

    answers.forEach((a, i) => {
      if (a.letter === data[i].missing) correctLetters++;
      if (a.number === data[i].num) correctNumbers++;
    });

    let totalPoints = data.length * 2;
    let score = correctLetters + correctNumbers;

    const letterWrongs = answers.map((a, i) => a.letter !== data[i].missing);
    const numberWrongs = answers.map((a, i) => a.number !== data[i].num);

    setWrongLetters(letterWrongs);
    setWrongNumbers(numberWrongs);

    let color =
      score === totalPoints ? "green" : score === 0 ? "red" : "orange";

    let scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">Score: ${score} / ${totalPoints}</span>
      </div>
    `;

    if (score === totalPoints) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
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
    <div className="page8-wrapper">
      <div className="page8-content">
        <header className="header-title-page8">
          <span className="ex-A">A</span> <span className="number-of-q">1</span>{" "}
          Listen and write the missing letters. Number the pictures.
        </header>
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
                src={CD6_Pg8_Instruction1_AdultLady}
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
        <audio ref={clickAudioRef} style={{ display: "none" }} />

        {/* ✅ الكلمات */}
        <div
          className="div-input"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
            // marginLeft:"40px",
            width: "100%",
          }}
        >
          {displayOrder.map((dataIndex, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-end",
                position: "relative",
              }}
            >
              <span className="number-of-q">{index + 1}</span>
              <input
                type="text"
                maxLength="1"
                className="char-input"
                value={answers[dataIndex].letter}
                onChange={(e) =>
                  !showAnswer &&
                  updateAnswer(dataIndex, "letter", e.target.value)
                }
                disabled={showAnswer}
                style={{
                  width: "40px",
                  textAlign: "center",
                  fontSize: "30px",
                  marginRight: "5px",
                  color: isAutoAnswer ? "red" : "black", // ← هون
                }}
              />

              <span
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                }}
              >
                {data[dataIndex].word.slice(1)}
              </span>
              {wrongLetters[dataIndex] && (
                <div
                  style={{
                    position: "absolute",
                    left: "56%",
                    top: "19%",
                    transform: "translateY(-50%)",
                    width: "25px",
                    height: "25px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    border: "2px solid white",
                  }}
                >
                  X
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ✅ الصور */}
        <div
          className="exercise-image-div"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: "20px",
          }}
        >
          {data.map((item, index) => (
            <img
              key={index}
              src={item.src}
              className="exercise-image"
              onClick={() => playSound(item.sound)}
            />
          ))}
        </div>

        {/* ✅ مربعات الأرقام + علامة الخطأ */}
        <div className="exercise-container">
          {data.map((item, index) => (
            <div
              key={index}
              className="exercise-item"
              style={{ position: "relative" }}
            >
              <input
                type="text"
                maxLength="1"
                className="missing-input"
                value={answers[index].number}
                onChange={(e) =>
                  !showAnswer && updateAnswer(index, "number", e.target.value)
                }
                disabled={showAnswer}
                style={{
                  color: isAutoAnswer ? "red" : "black", // ← نفس الشي هون
                }}
              />

              {wrongNumbers[index] && (
                <div
                  style={{
                    position: "absolute",
                    right: "-17px",
                    top: "5%",
                    transform: "translateY(-50%)",
                    width: "25px",
                    height: "25px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    border: "2px solid white",
                  }}
                >
                  X
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={() => {
            setShowAnswer(true);
            setIsAutoAnswer(true); // ← الإجابات تظهر باللون الأحمر

            setAnswers(
              data.map((item) => ({
                letter: item.missing,
                number: item.num,
              }))
            );

            setWrongLetters(data.map(() => false));
            setWrongNumbers(data.map(() => false));
          }}
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

export default Page8_Q1;
