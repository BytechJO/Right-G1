import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { TbMessageCircle } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import "./AudioWithCaption.css";

const AudioWithCaption = ({ src, captions, onCaptionChange }) => {
  const audioRef = useRef(null);
  const settingsRef = useRef(null);
  const captionRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const [showCaption, setShowCaption] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [speedIndicator, setSpeedIndicator] = useState("");
  const [activeSpeed, setActiveSpeed] = useState(1); // السرعة المختارة

  // تحديث الهايلايت حسب الوقت
  const updateCaption = (time) => {
    if (!captions) return;

    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end
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

  // ميوت
  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // تغيير السرعة
  const changeSpeed = (rate) => {
    setActiveSpeed(rate);
    setPlaybackRate(rate);
    audioRef.current.playbackRate = rate;

    setSpeedIndicator(rate + "x");
    setTimeout(() => setSpeedIndicator(""), 1000);
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

  const container = captionRef.current;
  const activeElement = document.getElementById(`caption-${activeIndex}`);

  if (container && activeElement) {
    container.scrollTo({
      top: activeElement.offsetTop - 40,
      behavior: "smooth",
    });
  }
}, [activeIndex]);


  return (
    <div className="audio-popup">
      {/* مؤشر السرعة */}
      {speedIndicator && (
        <div className="speed-indicator">Speed: {speedIndicator}</div>
      )}

      <div className="audio-inner">
        {/* التشغيل */}
        <button className="audio-play-btn" onClick={togglePlay}>
          {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
        </button>

        {/* السلايدر */}
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
        />

        <span className="audio-time">
          {new Date(current * 1000).toISOString().substring(14, 19)}
        </span>

        <span className="audio-time">
          {new Date(duration * 1000).toISOString().substring(14, 19)}
        </span>

        {/* ميوت */}
        <button className="mute-btn-outside" onClick={toggleMute}>
          {isMuted ? (
            <FaVolumeMute size={22} color="#1d4f7b" />
          ) : (
            <FaVolumeUp size={22} color="#1d4f7b" />
          )}
        </button>

        {/* زر الفقاعة */}
        <div className="bubble-wrapper">
          <div
            className={`audio-bubble-btn ${showCaption ? "active" : ""}`}
            onClick={() => setShowCaption(!showCaption)}
          >
            <TbMessageCircle size={22} color="#1d4f7b" />
          </div>

          {showCaption && (
            <div className="caption-popup" ref={captionRef}>
              {captions.map((cap, index) => (
                <span
                  key={index}
                  id={`caption-${index}`}
                  className={`caption-word ${
                    activeIndex === index ? "highlight" : ""
                  }`}
                >
                  {cap.text + " "}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* زر الإعدادات */}
        <div className="settings-wrapper" ref={settingsRef}>
          <button
            className={`settings-btn ${showSettings ? "active" : ""}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <IoMdSettings size={22} color="#1d4f7b" />
          </button>

          {showSettings && (
            <div className="settings-popup">
              {/* الصوت */}
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

      {/* عنصر الصوت */}
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onTimeUpdate={() => {
          const time = audioRef.current.currentTime;
          setCurrent(time);
          updateCaption(time);
        }}
        onEnded={() => {
          setIsPlaying(false);
          audioRef.current.currentTime = 0;
          setCurrent(0);
        }}
      />
    </div>
  );
};

export default AudioWithCaption;
