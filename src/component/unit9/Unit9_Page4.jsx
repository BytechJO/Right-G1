import React, { useState, useRef } from "react";
import page_4 from "../../assets/unit9/imgs/Right G1- Class Book_00079.jpg";
import "./Unit9_Page4.css";
import CD23_pg25_Grammar2_AdultLady from "../../assets/unit5/sounds/U5P43Grammar.mp3";
import sound1 from "../../assets/unit9/sound/Pg79_2.1_Adult Lady.mp3";
import sound2 from "../../assets/unit9/sound/Pg79_2.2_Adult Lady.mp3";
import sound3 from "../../assets/unit9/sound/Pg79_2.3_Adult Lady.mp3";
import sound4 from "../../assets/unit9/sound/Pg79_2.4_Adult Lady.mp3";
import sound5 from "../../assets/unit9/sound/Pg79_2.5_Adult Lady.mp3";
import sound6 from "../../assets/unit9/sound/Pg79_2.6_Adult Lady.mp3";
import sound7 from "../../assets/unit9/sound/Pg79_3.1_John .mp3";
import sound8 from "../../assets/unit9/sound/Pg79_3.2_Hansel.mp3";
import sound9 from "../../assets/unit9/sound/Pg79_4.1_Adult Lady.mp3";
import sound10 from "../../assets/unit9/sound/Pg79_5.1_Adult Lady.mp3";
import video from "../../assets/unit5/sounds/P43.mp4";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";

const Unit9_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 5.04, text: "Page 43. Exercise 2: Right Grammar. " },
    { start: 5.07, end: 6.20, text: "Is this a ruler? " },
    { start: 6.23, end: 8.04, text: "Yes, it is. " },
    { start: 8.07, end: 10.07, text: "Is this your pen? " },
    { start: 10.10, end: 12.12, text: "No, it isn't. " },
    { start: 12.15, end: 14.04, text: "Is this a ruler? " },
    { start: 14.07, end: 15.29, text: "Yes, it is. " },
     { start: 15.32, end: 18.15, text: "Is this a book? " },
    { start:18.18, end: 21.12, text: "No, it isn't. It's an eraser. " },
    { start: 21.15, end: 23.15, text: "Is this your pen? " },
    { start: 23.18, end: 25.05, text: "Yes, it is. " },
  ];
 
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));

    checkAreaAndPlaySound(xPercent, yPercent);
  };
  const clickableAreas = [
    { x1: 8.35, y1: 12.15, x2: 26.10, y2: 15, sound: sound1 },
    { x1: 71.56, y1: 11.81, x2: 82.9, y2: 14.7, sound: sound2 },
    { x1: 8.35, y1: 15.7, x2: 28.9, y2: 18.5, sound: sound3 },
    { x1: 72.00, y1: 15.53, x2: 84.7, y2: 18.7, sound: sound4 },
    { x1: 6.62, y1: 31.27, x2: 23.9, y2: 26.2, sound: sound5 },
    { x1: 30.65, y1: 28.7, x2: 42.99, y2: 31.9, sound: sound6 },
        { x1: 64.2, y1: 30.09, x2: 81.5, y2: 26.4, sound: sound7 },
    { x1: 66.15, y1:56.15, x2: 83.69, y2: 61.2, sound: sound8 },
    { x1: 39.09, y1: 63.59, x2: 59.6, y2: 66.9, sound: sound9 },
    { x1: 39.09, y1: 91.5, x2: 50.6, y2: 63.5, sound: sound10 },
  ];

  const checkAreaAndPlaySound = (x, y) => {
    const area = clickableAreas.find(
      (a) => x >= a.x1 && x <= a.x2 && y >= a.y1 && y <= a.y2
    );

    console.log("Matched Area:", area);

    if (area) playSound(area.sound);
  };
  const playSound = (soundPath) => {
    console.log(soundPath);
    if (audioRef.current) {
      audioRef.current.src = soundPath;
      audioRef.current.play();
    }
  };

  return (
    <div className="unit5-page-background" style={{ position: "relative" }}>
      <img
        src={page_4}
        style={{ display: "block" }}
        onClick={handleImageClick}
      />
      {clickableAreas.map((area, index) => (
        <div
          key={index}
          className="clickable-area"
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
          }}
          onClick={() => playSound(area.sound)}
          onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
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
        className="headset-icon-CD-unit9-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit9-page4-1  hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit9_Page4;
