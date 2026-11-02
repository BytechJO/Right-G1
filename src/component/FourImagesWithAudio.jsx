import React, { useState, useEffect, useRef } from "react";
import "./FourImagesWithAudio.css";
import { IoMdSettings } from "react-icons/io";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaRedo,
} from "react-icons/fa";
import SquirrelGif from "../assets/Squirrel_GIF/Squirrel_1164_1433px.gif";

import { TbMessageCircle } from "react-icons/tb";
const FourImagesWithAudio = ({
  images,
  audioSrc,
  checkpoints,
  popupOpen,
  titleQ,
  audioArr,
  captions,
  pageId,
  subHeader,
}) => {
  const audioRef = useRef(null);
  const audioFinishedRef = useRef(false);
  const resumedFromStorageRef = useRef(false);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  const AUDIO_TIME_KEY = pageId ? `audio-position-${pageId}` : null;
  const stopAtSecond = checkpoints[1] - 0.2;
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  // زر الكابشن
  const [playbackRate, setPlaybackRate] = useState(1);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(null);
  const [showCaption, setShowCaption] = useState(false);

  // ================================
  // ✔ Update caption highlight
  // ================================
  const updateCaption = (time) => {
    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end,
    );
    setActiveIndex2(index);
  };
  const playImageSound = (index) => {
    const sound = audioArr[index];
    const mainAudio = audioRef.current;

    if (!sound || !mainAudio) return;

    // 🔥 وقف الصوت الرئيسي
    mainAudio.pause();
    setIsPlaying(false);

    // ✅ 🔥 وقف كل أصوات الصور الثانية
    audioArr.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // 🔥 شغل صوت الصورة الحالية
    sound.currentTime = 0;
    sound.play();

    setClickedIndex(index);

    sound.onended = () => {
      setClickedIndex(null);
    };
  };

  const handleImageKeyDown = (e, index) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    playImageSound(index);
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audioFinishedRef.current = false;
    const savedTime = AUDIO_TIME_KEY
      ? Number(localStorage.getItem(AUDIO_TIME_KEY) || 0)
      : 0;
    // وقف أي تشغيل قديم
    audio.pause();
    audio.src = audioSrc;

    const handleLoadedMetadata = () => {
      // ================================
      // الحالة 2:
      // في وقت محفوظ → ارجع لنفس المكان
      // لكن لا تشغل الصوت تلقائي
      // ================================
      if (savedTime > 0 && savedTime < audio.duration) {
        resumedFromStorageRef.current = true;

        audio.currentTime = savedTime;

        setCurrent(savedTime);
        updateCaption(savedTime);

        setPaused(true);
        setIsPlaying(false);

        return;
      }

      // ================================
      // الحالة 1:
      // أول مرة / ما في حفظ
      // شغله تلقائي من البداية
      // ================================
      resumedFromStorageRef.current = false;

      audio.currentTime = 0;

      setCurrent(0);
      setPaused(false);
      setIsPlaying(true);

      audio.play().catch((err) => {
        console.log("Autoplay blocked:", err);
        setIsPlaying(false);
        setPaused(true);
      });
    };

    const interval = setInterval(() => {
      // الوقفة التلقائية الموجودة عندك
      if (
        !resumedFromStorageRef.current &&
        !audio.paused &&
        audio.currentTime >= stopAtSecond &&
        audio.currentTime < stopAtSecond + 0.3
      ) {
        audio.pause();

        // احفظ مكان الوقوف
        if (AUDIO_TIME_KEY) {
          localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
        }
        setPaused(true);
        setIsPlaying(false);
        setShowContinue(true);

        clearInterval(interval);
      }
    }, 100);

    const handleEnded = () => {
      // ================================
      // الحالة 3:
      // الصوت خلص كامل
      // امسح الحفظ حتى المرة القادمة
      // يبدأ من الصفر تلقائي
      // ================================
      audioFinishedRef.current = true;

      if (AUDIO_TIME_KEY) {
        localStorage.removeItem(AUDIO_TIME_KEY);
      }
      audio.currentTime = 0;

      setCurrent(0);
      setActiveIndex(null);
      setActiveIndex2(null);
      setPaused(true);
      setIsPlaying(false);
      setShowContinue(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      // ================================
      // إذا تسكر الـ popup قبل انتهاء الصوت
      // احفظ المكان الحالي
      // ================================
      if (
        AUDIO_TIME_KEY &&
        !audioFinishedRef.current &&
        audio.currentTime > 0 &&
        audio.duration &&
        audio.currentTime < audio.duration
      ) {
        localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
      }
      audio.pause();

      clearInterval(interval);

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);

      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioSrc, AUDIO_TIME_KEY]);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000); // كل ثانية

    return () => clearInterval(timer);
  }, []);
  const handleRestart = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audioArr.forEach((sound) => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });

    audio.pause();
    audio.currentTime = 0;
    resumedFromStorageRef.current = false;
    audioFinishedRef.current = false;
    if (AUDIO_TIME_KEY) {
      localStorage.removeItem(AUDIO_TIME_KEY);
    }
    setCurrent(0);
    setActiveIndex(null);
    setActiveIndex2(null);
    setClickedIndex(null);
    setPaused(false);
    setShowContinue(false);

    audio.play();
    setIsPlaying(true);
  };
  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      // إذا الصوت كان منتهي وبلّشنا تشغيل جديد
      if (audioFinishedRef.current) {
        audioFinishedRef.current = false;
        resumedFromStorageRef.current = false;
      }

      audio.play();
      setPaused(false);
      setIsPlaying(true);
    } else {
      audio.pause();

      // حفظ الوقت مباشرة لما نعمل Pause
      if (AUDIO_TIME_KEY && !audioFinishedRef.current) {
        localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
      }

      setPaused(true);
      setIsPlaying(false);
    }
  };
  return (
    <div className="four-wrapper">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "60%",
          alignItems: "flex-start",
          marginTop: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <img
            src={SquirrelGif}
            alt="An animated squirrel"
            style={{
              height: "100px",
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <h5
              className="header-title-page8"
              style={{
                fontSize: "25px",
                display: "flex",
                gap: "5px",
                alignItems: "center",
                margin: 0,
              }}
            >
              {titleQ}
            </h5>

            <p className="sub-header">{subHeader}</p>
          </div>
        </div>
      </div>
      <div
        className="audio-popup-read-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          margin: "0px 20px",
          position: "relative",
          width: "33%",
        }}
      >
        <div className="audio-popup-read">
          <div className="audio-inner player-ui">
            <audio
              ref={audioRef}
              src={audioSrc}
              onTimeUpdate={(e) => {
                const time = e.target.currentTime;

                setCurrent(time);

                // نحفظ آخر نقطة وصلها الصوت
                if (!audioFinishedRef.current) {
                  if (AUDIO_TIME_KEY) {
                    localStorage.setItem(AUDIO_TIME_KEY, String(time));
                  }
                }

                const idx = checkpoints.findIndex(
                  (cp) => time >= cp && time < cp + 0.8,
                );

                setActiveIndex(idx !== -1 ? idx : null);

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
                aria-label="Audio progress"
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
            <div className="bottom-row">
              {/* فقاعة */}
              <div className="caption-control" style={{ position: "relative" }}>
                <button
                  type="button"
                  className={`round-btn caption-toggle-btn ${
                    showCaption ? "active" : ""
                  }`}
                  onClick={() => setShowCaption(!showCaption)}
                  aria-label={showCaption ? "Hide captions" : "Show captions"}
                  aria-expanded={showCaption}
                  title={showCaption ? "Hide captions" : "Show captions"}
                  aria-controls={`caption-panel-${pageId}`}
                >
                  <TbMessageCircle size={36} aria-hidden="true" />
                </button>
                <div
                  id={`caption-panel-${pageId}`}
                  className={`caption-inPopup ${showCaption ? "show" : ""}`}
                  style={{ top: "100%", left: "10%" }}
                >
                  {captions.map((cap, i) => (
                    <p
                      key={i}
                      id={`caption-${i}`}
                      className={`caption-inPopup-line2 ${
                        activeIndex2 === i ? "active" : ""
                      }`}
                    >
                      {cap.text}
                    </p>
                  ))}
                </div>
              </div>

              {/* Play */}
              <div className="main-audio-controls">
                {/* Play / Pause */}
                <button
                  className="main-audio-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                  title={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>

                {/* Restart */}
                <button
                  className="main-audio-btn"
                  onClick={handleRestart}
                  aria-label="Restart audio"
                  title="Restart"
                >
                  <FaRedo size={22} />
                </button>
              </div>
              {/* Settings */}
              <div className="settings-wrapper" ref={settingsRef}>
                <button
                  className={`round-btn ${showSettings ? "active" : ""}`}
                  onClick={() => setShowSettings(!showSettings)}
                  title={
                    showSettings ? "Close audio settings" : "Audio settings"
                  }
                  aria-label="Audio settings"
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

                    <label style={{ marginRight: "10px", marginTop: "10px" }}>
                      Speed :
                    </label>
                    <select
                      value={playbackRate}
                      onChange={(e) => {
                        const rate = Number(e.target.value);
                        setPlaybackRate(rate);
                        audioRef.current.playbackRate = rate;
                      }}
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                )}
              </div>
            </div>{" "}
          </div>
        </div>
      </div>

      <div className="images-layout">
        {/* الصور الصغيرة الثلاث */}
        <div className="small-images">
          {images.length <= 3 ? (
            <>
              {images.slice(1).map((src, i) => {
                const globalIndex = i + 1; // index 2,3,4
                return (
                  <div
                    key={i}
                    className={`small-box1 ${
                      activeIndex === globalIndex ||
                      clickedIndex === globalIndex
                        ? "active"
                        : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Image ${i + 1}. Press Enter or Space to play its audio.`}
                    aria-pressed={clickedIndex === globalIndex}
                    onClick={() => playImageSound(globalIndex)}
                    onKeyDown={(e) => handleImageKeyDown(e, globalIndex)}
                  >
                    <img
                      src={src}
                      className="small-img1"
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {images.slice(1).map((src, i) => {
                const globalIndex = i + 1; // index 2,3,4
                return (
                  <div
                    key={i}
                    className={`small-box2 ${
                      activeIndex === globalIndex ||
                      clickedIndex === globalIndex
                        ? "active"
                        : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Image ${i + 1}. Press Enter or Space to play its audio.`}
                    aria-pressed={clickedIndex === globalIndex}
                    onClick={() => playImageSound(globalIndex)}
                    onKeyDown={(e) => handleImageKeyDown(e, globalIndex)}
                  >
                    <img
                      src={src}
                      className="small-img2"
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FourImagesWithAudio;
