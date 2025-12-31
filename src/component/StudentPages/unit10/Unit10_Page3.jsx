import React, { useState, useRef } from "react";
import page_3 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream3.jpg";
import "./Unit10_Page3.css";
import CD22_pg24_Grammar1_AdultLady from "../../../assets/unit5/sounds/U5P42Grammar.mp3";
import sound1 from "../../../assets/unit10/sound/Pg84_1.1_Adult Lady.mp3";
import sound2 from "../../../assets/unit10/sound/Pg84_1.2_Adult Lady.mp3";
import sound3 from "../../../assets/unit10/sound/Pg84_2.1_Jack .mp3";
import sound4 from "../../../assets/unit10/sound/Pg84_2.2_Modified Harley.mp3";
import sound5 from "../../../assets/unit10/sound/Pg84_3.1_Stella.mp3";
import sound6 from "../../../assets/unit10/sound/Pg84_3.2_Helen.mp3";
import sound7 from "../../../assets/unit10/sound/Pg84_4.1_Mom.mp3";
import sound8 from "../../../assets/unit10/sound/Pg84_4.2_Sarah.mp3";
// import sound9 from "../../../assets/unit9/sound/Pg78_4.1_Tom.mp3";
// import sound10 from "../../../assets/unit9/sound/Pg78_4.2_Helen.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import video from "../../../assets/unit5/sounds/p42.mp4";
const Unit10_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0, end: 4.12, text: "Page 42. Exercise one. Right Grammar. " },
    { start: 4.15, end: 5.28, text: "What's this? " },
    {
      start: 5.31,
      end: 7.22,
      text: "This is my book. ",
    },
    {
      start: 7.25,
      end: 9.19,
      text: "This is your book. ",
    },
    { start: 9.22, end: 11.05, text: "What's this? " },
    { start: 11.08, end: 12.29, text: "This is a desk." },
    { start: 12.32, end: 14.13, text: "What's this? " },
    { start: 14.18, end: 16.09, text: "This is a chair." },
    { start: 16.12, end: 18.01, text: "This is my book. " },
    { start: 18.04, end: 19.21, text: "This is your book." },
  ];

  const clickableAreas = [
    { x1: 7.78, y1: 13.41, x2: 30.62, y2: 17.2, sound: sound1 },
    { x1: 67.03, y1: 13.41, x2: 81.26, y2: 17.2, sound: sound2 },
    { x1: 11.45, y1: 28.81, x2: 35.58, y2: 32.1, sound: sound3 },
    { x1: 34.07, y1: 54.55, x2: 48.94, y2: 57.7, sound: sound4 },
    { x1: 56.26, y1: 26.10, x2: 80.4, y2: 29.32, sound: sound5 },
    { x1: 75.22, y1: 32.53, x2: 94.61, y2: 36.09, sound: sound6 },
    { x1: 35.79, y1: 60.97, x2: 59.71, y2: 64.55, sound: sound7 },
    { x1: 67.25, y1: 75.69, x2: 83.5, y2: 79, sound: sound8 },

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
    <div
      className="page1-img-wrapper"
      onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_3})` }}
    >
      {/* <img
        src={page_3}
        style={{ display: "block" }}
        onClick={handleImageClick}
      /> */}
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

      <div
        className="headset-icon-CD-unit10-page3-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <AudioWithCaption
                  src={CD22_pg24_Grammar1_AdultLady}
                  captions={captionsExample}
                />
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={audioBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>

      <div
        className="pauseBtn-icon-CD-unit10-page3-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "video",
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <video
                  autoPlay
                  controls
                  style={{
                    width: "auto",
                    height: "80%",
                    objectFit: "fill",
                    borderRadius: "20px",
                    display: "block",
                  }}
                >
                  <source src={video} type="video/mp4" />
                </video>
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            href={pauseBtn}
            className="svg-img"
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit10_Page3;
