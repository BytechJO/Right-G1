import "./Unit3_Page5_Q2.css";

import React, { useState, useEffect, useRef } from "react";
import CD24_Pg26_Instructions1_AdultLady from "../../../assets/unit3/sound3/CD24.Pg26_Instructions1_Adult Lady.mp3";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound1 from "../../../assets/unit3/sound3/U3P26EXEA2.mp3";
import img1 from "../../../assets/unit3/imgs3/P26exeA2-01.svg";
import img2 from "../../../assets/unit3/imgs3/P26exeA2-02.svg";
import img3 from "../../../assets/unit3/imgs3/P26exeA2-03.svg";
import img4 from "../../../assets/unit3/imgs3/P26exeA2-04.svg";
import img5 from "../../../assets/unit3/imgs3/P26exeA2-05.svg";
import img6 from "../../../assets/unit3/imgs3/P26exeA2-06.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";

const Unit3_Page5_Q2 = () => {
  const audioRef = useRef(null);
  const [answers, setAnswers] = useState([null, null, null, null]);
  const [showResult, setShowResult] = useState([]);
  const stopAtSecond = 10.90;
  const [checked, setChecked] = useState(false);
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
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  // ✅ نسمح فقط باختيار إجابة واحدة
  const [selected, setSelected] = useState([]);
  const correctData = ["1", "2", "4"];
  const options = [
    { img: img1, num: "1" },
    { img: img2, num: "2" },
    { img: img3, num: "3" },
    { img: img4, num: "4" },
    { img: img5, num: "5" },
    { img: img6, num: "6" },
  ];

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 11.08,
      text: "Page 26, Right Activities, Exercise A, Number 2. Does it have a short A sound? Listen and circle. ",
    },
    {
      start: 11.1,
      end: 13.08,
      text: "1. Mat.",
    },
    { start: 13.1, end: 15.12, text: "2. Can. " },
    { start: 15.14, end: 17.07, text: "3. Boat. " },
    { start: 17.09, end: 19.11, text: "4. Fan. " },
    { start: 19.13, end: 21.27, text: "5. Grapes." },
    { start: 21.29, end: 24.01, text: "6. Shoes." },
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

  const handleSelect = (index) => {
    setSelected((prev) => {
      if (prev.includes(index)) {
        // إذا الضغط على خيار مُختار → نشيله
        return prev.filter((i) => i !== index);
      }

      // منع اختيار أكثر من 3 خيارات
      if (prev.length >= 3) {
        return prev; // ما نضيف شي
      }
      // إذا الضغط على خيار غير مُختار → نضيفه

      return [...prev, index];
    });
    setShowResult([]);
  };

  // ✅ الفحص فقط إذا الطالب اختار أو لا
  const checkAnswers = () => {
    if (showAnswer) return;
    if (selected.length === 0) {
      ValidationAlert.info("Oops!", "Please select at least one answer.");
      return;
    }

    // استخراج الأرقام المختارة
    const chosenNumbers = selected.map((index) => options[index].num);

    // نحدد للنتائج إذا الخيار صح أو غلط
    const evaluation = options.map((opt, index) => {
      if (selected.includes(index)) {
        return correctData.includes(opt.num) ? "correct" : "wrong";
      }
      return null; // خيار لم يتم اختياره
    });

    setShowResult(evaluation);
    setChecked(true);

    // حساب الإجابات الصحيحة
    const correctCount = chosenNumbers.filter((num) =>
      correctData.includes(num)
    ).length;

    // حساب السكور النهائي
    const totalCorrect = correctData.length;
    const score = `${correctCount} / ${totalCorrect}`;
    const color =
      correctCount === totalCorrect
        ? "green"
        : correctCount === 0
        ? "red"
        : "orange";
    const resultHTML = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:${color};
                   font-weight:bold;">
         Score: ${score}
      </span>
    </div>
  `;

    if (correctCount === totalCorrect) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  // 🔄 زر الريست
  const resetAnswers = () => {
    setShowResult([]);
    setChecked(false);
    setSelected([]);
    setShowAnswer(false);
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
    setShowAnswer(true); // نعرض الإجابات الصحيحة
    setSelected(
      correctData.map((num) => options.findIndex((o) => o.num === num))
    );
    setChecked(false); // ما بدنا X
    setShowResult([]); // لا نتائج سابقة
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
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "relative",
          width: "60%",
        }}
      >
        <div className="unit3-q1-wrapper">
          <h5 className="header-title-page8">
            <span style={{ color: "purple" }}>2</span> Does it have a{" "}
            <span style={{ color: "red" }}>short a</span> sound? Listen and
            circle.
          </h5>
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
          <div className="unit3-q2-content">
            {/* الخيارات */}
            <div className="unit3-q2-options">
              {options.map((item, index) => (
                <div
                  key={item.num}
                  className={`unit3-q2-option-item 
                      ${selected.includes(index) ? "active" : ""}
                      ${
                        showAnswer && correctData.includes(item.num)
                          ? "correct-answer"
                          : ""
                      }
                      ${
                        checked && showResult[index] === "wrong"
                          ? "wrong-option"
                          : ""
                      }`}
                  onClick={() => {
                    if (!showAnswer) handleSelect(index); // إلغاء الضغط بعد Show Answer
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <span className="unit3-q2-number">{item.num}</span>
                    {checked &&
                      !showAnswer &&
                      showResult[index] === "wrong" && (
                        <div className="wrong-x-unit3-q2">✕</div>
                      )}
                  </div>

                  <img src={item.img} className="unit3-q2-option-img" alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={handleShowAnswer} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit3_Page5_Q2;
