import React, { useState, useRef, useEffect } from "react";
import "./WB_Unit10_Page6_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound1 from "../../../assets/unit6/sounds/U6P55EXED.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
const WB_Unit10_Page6_Q2 = () => {
  const sentences = [
    { word1: "pet", word2: "pit", word3: "jet", num: 1 },
    { word1: "tap", word2: "bet", word3: "set", num: 2 },
    { word1: "red", word2: "hot", word3: "nest", num: 3 },
    { word1: "met", word2: "run", word3: "wet", num: 4 },
    { word1: "web", word2: "fed", word3: "hip", num: 5 },
  ];

  const correct = {
    0: [0, 2],
    1: [1, 2],
    2: [0, 2],
    3: [0, 2],
    4: [0, 1],
  };

  const [circledWords, setCircledWords] = useState({});
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false); // ⭐ NEW — يمنع التعديل بعد Show Answer

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

  const handleWordClick = (sIndex, wIndex) => {
    if (locked) return;

    setCircledWords((prev) => {
      const current = prev[sIndex] || [];

      // إذا الكلمة مختارة → نشيلها
      if (current.includes(wIndex)) {
        return {
          ...prev,
          [sIndex]: current.filter((i) => i !== wIndex),
        };
      }

      // إذا مختار بالفعل خيارين → ما نسمح بالمزيد
      if (current.length >= 2) {
        return prev;
      }

      // غير هيك → نضيف الاختيار
      return {
        ...prev,
        [sIndex]: [...current, wIndex],
      };
    });

    setChecked(false);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ منع التغيير عند القفل
    if (Object.keys(circledWords).length < sentences.length) {
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

    setLocked(true); // ⭐ NEW — يمنع التعديل بعد Check Answer
  };

  const showAnswer = () => {
    const correctSelections = {};

    Object.keys(correct).forEach((sIndex) => {
      correctSelections[sIndex] = correct[sIndex]; // ضع الدوائر على الإجابات الصحيحة فقط
    });

    setCircledWords(correctSelections);
    setChecked(false); // إزالة الأخطاء
    setLocked(true); // قفل التعديل
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
        <div className="review3-p2-q2-content-container">
          <h5 className="header-title-page8">
            <span className="ex-A">B</span> Listen and circle the words with
            <span style={{ color: "red" }}>short e.</span>
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
          <div className="review3-p2-q2-sentence-container2">
            {sentences.map((sentence, sIndex) => (
              <div className="review3-p2-q2-sentence-row" key={sIndex}>
                <span className="review3-p2-q2-num">{sIndex + 1}</span>

                <div className="wb-unit10-p6-q2-word-box">
                  {[sentence.word1, sentence.word2, sentence.word3].map(
                    (word, wIndex) => {
                      const isCircled = circledWords[sIndex]?.includes(wIndex);
                      const isWrong =
                        checked &&
                        isCircled &&
                        !correct[sIndex]?.includes(wIndex);

                      return (
                        <span
                          key={wIndex}
                          className={`wb-unit10-p6-q2-word ${
                            isCircled ? "circled" : ""
                          }`}
                          onClick={() => handleWordClick(sIndex, wIndex)}
                        >
                          {word}
                          {isWrong && (
                            <span className="review3-p2-q2-wrong-x">✕</span>
                          )}
                        </span>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button
            onClick={() => {
              setCircledWords({});
              setChecked(false);
              setLocked(false); // ⭐ فتح التعديل من جديد
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ تمت إضافة زر Show Answer */}
          <button
            onClick={showAnswer}
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

export default WB_Unit10_Page6_Q2;
