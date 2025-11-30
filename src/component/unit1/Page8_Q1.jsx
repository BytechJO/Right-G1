import React, { useState, useRef, useEffect } from "react";
import CD6_Pg8_Instruction1_AdultLady from "../../assets/unit1/sounds/pg8-instruction1-all.mp3";
import Pg8_1_1_AdultLady from "../../assets/unit1/sounds/Pg8_1.1_Adult Lady.mp3";
import Pg8_1_2_AdultLady from "../../assets/unit1/sounds/Pg8_1.2_Adult Lady.mp3";
import Pg8_1_3_AdultLady from "../../assets/unit1/sounds/Pg8_1.3_Adult Lady.mp3";
import Pg8_1_4_AdultLady from "../../assets/unit1/sounds/Pg8_1.4_Adult Lady.mp3";
import deer from "../../assets/unit1/imgs/deer flip.svg";
import duck from "../../assets/unit1/imgs/duck.svg";
import taxi from "../../assets/unit1/imgs/taxi_1.svg";
import tiger from "../../assets/unit1/imgs/tiger.svg";
import ValidationAlert from "../Popup/ValidationAlert";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
const Page8_Q1 = () => {
  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const [showAnswer, setShowAnswer] = useState(false);

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
  const [activeSpeed, setActiveSpeed] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  // زر الكابشن
  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();

    const interval = setInterval(() => {
      if (audio.currentTime >= stopAtSecond) {
        audio.pause();
        setPaused(true);
        setShowContinue(true);
        clearInterval(interval);
      }
    }, 250);

    // ⚡⚡ هنا الإضافة الوحيدة
    const handleEnded = () => {
      audio.currentTime = 0; // يرجع لأول ثانية
      audio.pause(); // يوقف
      setPaused(true); // زر البلاي يصير Play
      setShowContinue(true); // يظهر زر Continue
      // setActiveIndex(null); // يشيل الأنيميشن عن الكلمات
    };

    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    // audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded); // 👈 الإضافة
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded); // 👈 تنظيف الإضافة
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000); // كل ثانية

    return () => clearInterval(timer);
  }, []);

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
    setWrongLetters(data.map(() => false)); // <-- ✅ يرجع بدون علامات غلط
    setWrongNumbers(data.map(() => false));
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

    if (audio.paused) {
      audio.play();
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
  };
  return (
    <div className="page8-wrapper">
      <div className="page8-content">
        <header className="header-title-page8">
          <span className="ex-A">A</span> 1 Listen and write the missing
          letters. Number the pictures.
        </header>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            margin: "30px 0px",
          }}
        >
          <div className="audio-popup-read">
            <div className="audio-inner player-ui">
              {/* Play / Pause */}
              <button
                className="audio-play-btn"
                style={{ height: "30px", width: "30px" }}
                onClick={togglePlay}
              >
                {paused ? <FaPlay size={22} /> : <FaPause size={22} />}
              </button>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max={audioRef.current?.duration || 0}
                value={audioRef.current?.currentTime || 0}
                className="audio-slider"
                onChange={(e) => {
                  if (!audioRef.current) return;
                  audioRef.current.currentTime = e.target.value;
                }}
              />

              {/* Current Time */}
              <span className="audio-time">
                {new Date((audioRef.current?.currentTime || 0) * 1000)
                  .toISOString()
                  .substring(14, 19)}
              </span>

              {/* Total Time */}
              <span className="audio-time">
                {new Date((audioRef.current?.duration || 0) * 1000)
                  .toISOString()
                  .substring(14, 19)}
              </span>

              {/* Mute */}
              <button
                className="mute-btn-outside"
                onClick={() => {
                  audioRef.current.muted = !audioRef.current.muted;
                  setIsMuted(!isMuted);
                }}
              >
                {audioRef.current?.muted ? (
                  <FaVolumeMute size={22} color="#1d4f7b" />
                ) : (
                  <FaVolumeUp size={22} color="#1d4f7b" />
                )}
              </button>
              <div className="settings-wrapper" ref={settingsRef}>
                <button
                  className={`settings-btn ${showSettings ? "active" : ""}`}
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <IoMdSettings size={22} color="#1d4f7b" />
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
            </div>
          </div>
          <audio ref={audioRef}>
            <source src={CD6_Pg8_Instruction1_AdultLady} type="audio/mp3" />
          </audio>
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
    !showAnswer && updateAnswer(dataIndex, "letter", e.target.value)
  }
  disabled={showAnswer}
                style={{
                  width: "40px",
                  textAlign: "center",
                  fontSize: "30px",
                  marginRight: "5px",
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
      
        <button className="swal-continue"
          onClick={() => {
            setShowAnswer(true);

            // عرض الإجابات الصحيحة
            setAnswers(
              data.map((item) => ({
                letter: item.missing,
                number: item.num,
              }))
            );

            // إخفاء علامات الخطأ
            setWrongLetters(data.map(() => false));
            setWrongNumbers(data.map(() => false));
          }}
          
        >
          Show Answer 👁️
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Page8_Q1;
