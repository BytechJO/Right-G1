import { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaRedo,
} from "react-icons/fa";
import { TbMessageCircle } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import "./AudioWithCaption.css";

const AudioWithCaption = ({
  src,
  captions,
  onCaptionChange,
  pageId,
  stopAtSecond = null,
}) => {
  const audioRef = useRef(null);
  const audioFinishedRef = useRef(false);
  const resumedFromStorageRef = useRef(false);
  const hasStartedPlaybackRef = useRef(false);

  const AUDIO_TIME_KEY = `audio-position-${pageId}`;
  const settingsRef = useRef(null);
  const captionRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  // تحديث الهايلايت حسب الوقت
  const updateCaption = (time) => {
    if (!captions || captions.length === 0) return;

    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end,
    );

    setActiveIndex(index);
    if (onCaptionChange) onCaptionChange(index);
  };

  // تشغيل/إيقاف
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (captions) setShowCaption(true);
    }
    setIsPlaying(!isPlaying);
  };

  // إغلاق settings عند الضغط خارج
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (activeIndex === -1) return;

    const activeElement = document.getElementById(`caption-${activeIndex}`);

    if (activeElement) {
      activeElement.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audioFinishedRef.current = false;
    hasStartedPlaybackRef.current = false;

    const storedTime = localStorage.getItem(AUDIO_TIME_KEY);
    const savedTime = Number(storedTime || 0);

    // نظّف أي قيمة صفر أو قيمة غير صالحة محفوظة من السلوك القديم.
    if (
      storedTime !== null &&
      (!Number.isFinite(savedTime) || savedTime <= 0)
    ) {
      localStorage.removeItem(AUDIO_TIME_KEY);
    }

    audio.pause();
    audio.src = src;

    const handleLoadedMetadata = () => {
      // إذا في وقت محفوظ
      if (savedTime > 0 && savedTime < audio.duration) {
        resumedFromStorageRef.current = true;

        audio.currentTime = savedTime;

        setCurrent(savedTime);
        updateCaption(savedTime);

        // ما يشتغل تلقائي
        setIsPlaying(false);

        return;
      }

      // أول مرة
      resumedFromStorageRef.current = false;

      audio.currentTime = 0;
      setCurrent(0);

      // كمان أول مرة ما يشتغل تلقائي
      setIsPlaying(false);
    };
    let interval;

    if (stopAtSecond !== null) {
      interval = setInterval(() => {
        // الوقفة التلقائية فقط إذا بدأ من الصفر
        if (
          !resumedFromStorageRef.current &&
          !audio.paused &&
          audio.currentTime >= stopAtSecond
        ) {
          audio.pause();

          if (
            hasStartedPlaybackRef.current &&
            audio.currentTime > 0
          ) {
            localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
          }

          setIsPlaying(false);

          clearInterval(interval);
        }
      }, 100);
    }

    const handleEnded = () => {
      audioFinishedRef.current = true;

      // إذا خلص كامل نمسح الحفظ
      localStorage.removeItem(AUDIO_TIME_KEY);

      audio.currentTime = 0;

      setCurrent(0);
      setIsPlaying(false);
      setActiveIndex(-1);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    audio.addEventListener("ended", handleEnded);

    return () => {
      // إذا تسكر الـ popup قبل ما يخلص
      if (
        !audioFinishedRef.current &&
        hasStartedPlaybackRef.current &&
        audio.currentTime > 0 &&
        audio.duration &&
        audio.currentTime < audio.duration
      ) {
        localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
      }

      audio.pause();

      if (interval) {
        clearInterval(interval);
      }

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);

      audio.removeEventListener("ended", handleEnded);
    };
  }, [src, AUDIO_TIME_KEY, stopAtSecond]);
  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    resumedFromStorageRef.current = false;
    audioFinishedRef.current = false;
    hasStartedPlaybackRef.current = false;

    localStorage.removeItem(AUDIO_TIME_KEY);

    setCurrent(0);
    setActiveIndex(-1);

    audio.play();
    setIsPlaying(true);
  };
  return (
    <div className="audio-popup">
      {/* مؤشر السرعة */}
      <div className="audio-inner player-ui">
        <audio
          ref={audioRef}
          src={src}
          onPlay={() => {
            hasStartedPlaybackRef.current = true;
          }}
          onTimeUpdate={(e) => {
            const time = e.target.currentTime;

            setCurrent(time);
            updateCaption(time);

            if (
              !audioFinishedRef.current &&
              hasStartedPlaybackRef.current &&
              time > 0
            ) {
              localStorage.setItem(AUDIO_TIME_KEY, String(time));
            }
          }}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
        />
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
            onFocus={(e) => {
              e.currentTarget.style.outline = "3px solid #2563eb";
              e.currentTarget.style.outlineOffset = "4px";
              e.currentTarget.style.borderRadius = "8px";
              e.currentTarget.style.boxShadow =
                "0 0 0 4px rgba(37, 99, 235, 0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label="Audio progress"
            title="Audio progress"
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
          {/* Caption */}
          {captions && captions.length > 0 ? (
            <div
              className={`round-btn ${showCaption ? "active" : ""}`}
              onClick={() => setShowCaption(!showCaption)}
              role="button"
              tabIndex={0}
              aria-label={showCaption ? "Hide captions" : "Show captions"}
              aria-expanded={showCaption}
              title={showCaption ? "Hide captions" : "Show captions"}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowCaption((prev) => !prev);
                }
              }}
            >
              <TbMessageCircle size={40} />
            </div>
          ) : (
            <div></div>
          )}

          {/* Play */}
          <div className="main-audio-controls">
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
              title="Restart audio"
            >
              <FaRedo size={22} />
            </button>
          </div>

          {/* Settings */}
          <div className="settings-wrapper" ref={settingsRef}>
            <button
              className={`round-btn ${showSettings ? "active" : ""}`}
              onClick={() => setShowSettings(!showSettings)}
              aria-label={
                showSettings ? "Close audio settings" : "Open audio settings"
              }
              aria-expanded={showSettings}
              title={showSettings ? "Close audio settings" : "Audio settings"}
            >
              <IoMdSettings size={40} />
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
        {/* الكابشن تحت الأزرار */}
        {captions && captions.length > 0 && showCaption && (
          <>
            <h3 style={{ fontSize: "20px", fontWeight: "500" }}>
              Text to speech :
            </h3>
            <div className="caption-box" ref={captionRef}>
              {captions.map((cap, i) => (
                <p
                  key={i}
                  id={`caption-${i}`}
                  className={i === activeIndex ? "active-caption" : ""}
                >
                  {cap.text}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioWithCaption;
