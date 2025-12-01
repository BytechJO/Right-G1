import React, { useState, useRef } from "react";
import page_4 from "../../assets/unit3/imgs3/Right 1 Unit 03 Let's Go to School4.jpg";
import "./Unit3_Page4.css";
import CD23_pg25_Grammar2_AdultLady from "../../assets/unit3/sound3/U3P25RG2.mp3";
import sound1 from "../../assets/unit3/sound3/Pg25_2.1_Adult Lady.mp3";
import sound2 from "../../assets/unit3/sound3/Pg25_2.2_Adult Lady.mp3";
import sound3 from "../../assets/unit3/sound3/Pg25_2.3_Adult Lady.mp3";
import sound4 from "../../assets/unit3/sound3/Pg25_3.1_Female Teacher.mp3";
import sound5 from "../../assets/unit3/sound3/Pg25_4.1_Female Teacher.mp3";
import sound6 from "../../assets/unit3/sound3/Pg25_5.1_Female Teacher.mp3";
import video from "../../assets/unit3/sound3/p25.mp4";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../assets/unit1/imgs/Page 01/Right Video Button.svg";

const Unit3_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0, end: 4.13, text: "Page 25, Exercise 2: Right Grammar." },
    { start: 4.16, end: 5.21, text: "Open your book." },
    { start: 5.24, end: 7.02, text: "Close your book. " },
    { start: 7.05, end: 8.29, text: "Take out your pencil." },
    { start: 8.31, end: 10.11, text: "Open your book. " },
    { start: 10.14, end: 11.24, text: "Close your book." },
    { start: 11.27, end: 13.12, text: "Take out your pencil." },
  ];
  const clickableAreas = [
    { x1: 9.07, y1: 10.5, x2: 30.43, y2: 14.0, sound: sound1 },
    { x1: 9.07, y1: 15.4, x2: 30.43, y2: 18.7, sound: sound2 },
    { x1: 66.4, y1: 13.4, x2: 89.9, y2: 17.0, sound: sound3 },
    { x1: 11.11, y1: 22.9, x2: 30.4, y2: 26.4, sound: sound4 },
    { x1: 55.5, y1: 22.5, x2: 75.4, y2: 26.2, sound: sound5 },
    { x1: 30.4, y1: 60.0, x2: 55.6, y2: 63.5, sound: sound6 },
  ];
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
  const playSound = (soundPath) => {
    if (audioRef.current) {
      audioRef.current.src = soundPath;
      audioRef.current.play();
      setIsPlaying(true);
      setHoveredAreaIndex(null); // إزالة الهايلايت عند بدء الصوت

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setHoveredAreaIndex(null);
        setActiveAreaIndex(null); // مسح الهايلايت بعد انتهاء الصوت
      };
    }
  };

  return (
    <div className="unit3-page-background" style={{ position: "relative" }}>
      <img
        src={page_4}
        style={{ display: "block" }}
        onClick={handleImageClick}
      />
      {clickableAreas.map((area, index) => (
        <div
          key={index}
          className={`clickable-area ${
            hoveredAreaIndex === index || activeAreaIndex === index
              ? "highlight"
              : ""
          }`}
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
          }}
          onClick={() => {
            setActiveAreaIndex(index); // لتثبيت الهايلايت أثناء الصوت
            playSound(area.sound);
          }}
          onMouseEnter={() => {
            if (!isPlaying) setHoveredAreaIndex(index);
          }}
          onMouseLeave={() => {
            if (!isPlaying) setHoveredAreaIndex(null);
          }}
        ></div>
      ))}

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <AudioWithCaption
                src={CD23_pg25_Grammar2_AdultLady}
                captions={captionsExample}
              />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit3-page4-1 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <video
                style={{
                  height: "auto",
                  width: "85%",
                  borderRadius: "5%",
                }}
                controls
              >
                <source src={video} type="video/mp4" />
              </video>
            </div>
          )
        }
        className="pauseBtn-icon-CD-unit3-page4-1  hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit3_Page4;
