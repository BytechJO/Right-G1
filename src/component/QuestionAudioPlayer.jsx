import { useState, useEffect, useRef } from "react";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

export default function QuestionAudioPlayer({
  src,
  pageId,
  captions = [],
  stopAtSecond = null,
  forceStop,
  onInteract,
}) {
  const clickAudioRef = useRef(null);
  const audioRef = useRef(null);
  const audioFinishedRef = useRef(false);
  const resumedFromStorageRef = useRef(false);
  const AUDIO_TIME_KEY = pageId ? `audio-position-${pageId}` : null;
  const [paused, setPaused] = useState(false);
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
  const [playbackRate, setPlaybackRate] = useState(1);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const progress = duration ? (current / duration) * 100 : 0;
  const updateCaption = (time) => {
    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end,
    );
    setActiveIndex(index);
  };
  useEffect(() => {
    if (!forceStop) return;

    const audio = audioRef.current;

    if (audio) {
      audio.pause();

      setPaused(true);
      setIsPlaying(false);
    }
  }, [forceStop]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audioFinishedRef.current = false;

    const savedTime = AUDIO_TIME_KEY
      ? Number(localStorage.getItem(AUDIO_TIME_KEY) || 0)
      : 0;

    audio.pause();
    audio.src = src;

    const handleLoadedMetadata = () => {
      // ================================
      // إذا في وقت محفوظ
      // ارجع له بدون تشغيل تلقائي
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
      // أول مرة
      // يبدأ من الصفر ويشتغل تلقائي
      // ================================
      resumedFromStorageRef.current = false;

      audio.currentTime = 0;

      setCurrent(0);
      setPaused(false);
      setIsPlaying(true);

      audio.play().catch((err) => {
        console.log("Autoplay blocked:", err);
        setPaused(true);
        setIsPlaying(false);
      });
    };

    let interval;

    if (stopAtSecond !== null) {
      interval = setInterval(() => {
        // مهم:
        // الوقفة التلقائية فقط لو بدأ من الصفر
        if (
          !resumedFromStorageRef.current &&
          !audio.paused &&
          audio.currentTime >= stopAtSecond
        ) {
          audio.pause();

          if (AUDIO_TIME_KEY) {
            localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
          }
          setPaused(true);
          setIsPlaying(false);
          setShowContinue(true);

          clearInterval(interval);
        }
      }, 100);
    }

    const handleEnded = () => {
      // الصوت خلص كامل
      audioFinishedRef.current = true;

      // امسح الحفظ
      if (AUDIO_TIME_KEY) {
        localStorage.removeItem(AUDIO_TIME_KEY);
      }
      audio.currentTime = 0;

      setCurrent(0);
      setIsPlaying(false);
      setPaused(false);
      setActiveIndex(null);
      setShowContinue(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    audio.addEventListener("ended", handleEnded);

    return () => {
      // إذا تسكر الـ popup قبل النهاية
      // احفظ مكان الصوت
      if (
        !audioFinishedRef.current &&
        audio.currentTime > 0 &&
        audio.duration &&
        audio.currentTime < audio.duration
      ) {
        if (AUDIO_TIME_KEY) {
          localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
        }
      }

      audio.pause();

      if (interval) {
        clearInterval(interval);
      }

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);

      audio.removeEventListener("ended", handleEnded);
    };
  }, [src, AUDIO_TIME_KEY, stopAtSecond]);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000);

    if (activeIndex === -1 || activeIndex === null) return;

    const el = document.getElementById(`caption-${activeIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return () => clearInterval(timer);
  }, [activeIndex]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      // New playback after the audio has finished
      if (audioFinishedRef.current) {
        audioFinishedRef.current = false;
        resumedFromStorageRef.current = false;

        audio.currentTime = 0;

        setCurrent(0);
        setActiveIndex(null);
        setShowContinue(false);
      }

      try {
        await audio.play();

        setPaused(false);
        setIsPlaying(true);
      } catch (error) {
        setPaused(true);
        setIsPlaying(false);
        console.error("Audio playback failed:", error);
      }
    } else {
      audio.pause();

      // Save the current position immediately on Pause
      if (
        AUDIO_TIME_KEY &&
        !audioFinishedRef.current &&
        audio.currentTime > 0 &&
        Number.isFinite(audio.duration) &&
        audio.currentTime < audio.duration
      ) {
        localStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
      }

      setPaused(true);
      setIsPlaying(false);
    }
  };
  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    resumedFromStorageRef.current = false;
    audioFinishedRef.current = false;

    if (AUDIO_TIME_KEY) {
      localStorage.removeItem(AUDIO_TIME_KEY);
    }

    setCurrent(0);
    setActiveIndex(null);
    setPaused(false);
    setShowContinue(false);

    audio.play();

    setIsPlaying(true);
  };
  return (
    <div
      onPointerDown={() => {
        if (onInteract) {
          onInteract();
        }
      }}
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
            src={src}
            onTimeUpdate={(e) => {
              const audio = e.currentTarget;
              const time = audio.currentTime;

              setCurrent(time);
              updateCaption(time);

              if (
                AUDIO_TIME_KEY &&
                !audioFinishedRef.current &&
                time > 0 &&
                Number.isFinite(audio.duration) &&
                time < audio.duration
              ) {
                localStorage.setItem(AUDIO_TIME_KEY, String(time));
              }
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
            {/* فقاعة */}
            <div
              className={`round-btn ${showCaption ? "active" : ""}`}
              style={{ position: "relative" }}
              onClick={() => setShowCaption(!showCaption)}
              role="button"
              tabIndex={0}
              title={showCaption ? "Hide captions" : "Show captions"}
              aria-label={showCaption ? "Hide captions" : "Show captions"}
              aria-expanded={showCaption}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowCaption((prev) => !prev);
                }
              }}
            >
              <TbMessageCircle size={36} />

              <div
                className={`caption-inPopup ${showCaption ? "show" : ""}`}
                style={{ top: "100%", left: "10%" }}
                aria-hidden={!showCaption}
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
            <div className="main-audio-controls">
              {/* Play / Pause */}
              <button
                className="main-audio-btn"
                onClick={togglePlay}
                title={isPlaying ? "Pause audio" : "Play audio"}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
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
                title="Audio settings"
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
  );
}
