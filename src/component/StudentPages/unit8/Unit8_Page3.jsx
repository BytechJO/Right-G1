import React, { useState, useRef } from "react";
import page_3 from "../../../assets/unit8/imgs/Right 1 Unit 08 At the Soccer Match3.jpg";
import "./Unit8_Page3.css";
import CD11_Pg12_Grammar1_AdultLady from "../../../assets/img_unit2/sounds-unit2/U2 Right Grammar P12.mp3";
import Pg12_1_1_AdultLady from "../../../assets/unit8/sound/Pg66_1.1_Adult Lady.mp3";
import Pg12_1_2_AdultLady from "../../../assets/unit8/sound/Pg66_1.2_Adult Lady.mp3";
import Pg12_1_3_AdultLady from "../../../assets/unit8/sound/Pg66_1.3_Adult Lady.mp3";
import Pg12_1_4_AdultLady from "../../../assets/unit8/sound/Pg66_2.1_Female Teacher.mp3";
import Pg12_1_5_AdultLady from "../../../assets/unit8/sound/Pg66_3.1_Modified Tom.mp3";
import Pg12_2_1_Harley from "../../../assets/unit8/sound/Pg66_4.1_Female Teacher.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import video from "../../../assets/img_unit2/sounds-unit2/p12 1920.mp4";
const Unit8_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const captionsExample = [
    { start: 0, end: 3.22, text: "Page 12, Exercise 1. Right Grammar." },
    { start: 3.25, end: 7.11, text: " How old are you? I'm seven years old." },
    {
      start: 7.15,
      end: 11.02,
      text: " When is your birthday? My birthday is in August.",
    },
    {
      start: 11.06,
      end: 13.11,
      text: "It is on Tuesday. ",
    },
    { start: 13.15, end: 14.22, text: "How old are you, Sara? " },
    { start: 14.26, end: 16.05, text: "I'm three years old. " },
    { start: 16.09, end: 17.24, text: "When is your birthday party, Stella? " },
    { start: 17.27, end: 19.16, text: "It is on Tuesday. " },
    {
      start: 19.2,
      end: 22.1,
      text: "Happy birthday! This is for you, Stella. ",
    },
    { start: 22.14, end: 23.1, text: "Thank you.  " },
    { start: 23.14, end: 25.05, text: "You're welcome. Open it." },
  ];

  const clickableAreas = [
    { x1: 6.5, y1: 10.0, x2: 30.0, y2: 13.6, sound: Pg12_1_1_AdultLady },
    { x1: 6.5, y1: 13.6, x2: 30.0, y2: 17.2, sound: Pg12_1_2_AdultLady },
    { x1: 6.5, y1: 17.2, x2:  30.0, y2: 20.8, sound: Pg12_1_3_AdultLady },
    { x1: 5.50, y1: 24.12, x2: 26.25, y2: 27.63, sound: Pg12_1_4_AdultLady },
    { x1: 54.75, y1: 24.73, x2: 76.86, y2: 27.93, sound: Pg12_1_5_AdultLady },
    { x1: 33.42, y1: 62.35, x2: 53.60, y2: 65.86, sound: Pg12_2_1_Harley },
   
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
    <div className="page1-img-wrapper"
          onClick={handleImageClick}
          style={{ backgroundImage: `url(${page_3})` }}>
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
        className="headset-icon-CD-unit8-page3-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
             "audio", <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <AudioWithCaption
                  src={CD11_Pg12_Grammar1_AdultLady}
                  captions={captionsExample}
                />
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={audioBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <div
        className="pauseBtn-icon-CD-unit8-page3-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
             "video", <div
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
                  }}
                >
                  <source src={video} type="video/mp4" />
                </video>
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image className="svg-img" href={pauseBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit8_Page3;
