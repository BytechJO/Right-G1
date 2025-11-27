import React, { useState, useRef } from "react";
import page_4 from "../../assets/unit6/imgs/Right 1 Unit 06 Can We Go to the Park4.jpg";
import "./Unit6_Page4.css";
import CD23_pg25_Grammar2_AdultLady from "../../assets/unit3/sound3/U3P25RG2.mp3";
import sound1 from "../../assets/unit6/sounds/Pg49_2.1_Adult Lady.mp3";
import sound2 from "../../assets/unit6/sounds/Pg49_2.2_Adult Lady.mp3";
import sound3 from "../../assets/unit6/sounds/Pg49_2.3_Adult Lady.mp3";
import sound4 from "../../assets/unit6/sounds/Pg49_2.4_Adult Lady.mp3";
import sound5 from "../../assets/unit6/sounds/Pg49_3.1_Harley.mp3";
import sound6 from "../../assets/unit6/sounds/Pg49_3.2_Helen_Take 3.mp3";
import sound7 from "../../assets/unit6/sounds/Pg49_4.1_Stella.mp3";
import sound8 from "../../assets/unit6/sounds/Pg49_4.2_Harley.mp3";
import video from "../../assets/unit3/sound3/p25.mp4";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";

const Unit6_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 4.13, text: "Page 25, Exercise 2: Right Grammar." },
    { start: 4.16, end: 5.21, text: "Open your book." },
    { start: 5.24, end: 7.02, text: "Close your book. " },
    { start: 7.05, end: 8.29, text: "Take out your pencil." },
    { start: 8.31, end: 10.11, text: "Open your book. " },
    { start: 10.14, end: 11.24, text: "Close your book." },
    { start: 11.27, end: 13.12, text: "Take out your pencil." },
  ];

 
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));

    checkAreaAndPlaySound(xPercent, yPercent);
  };
  const clickableAreas = [
    { x1: 8.10, y1: 10.5, x2: 36.43, y2: 14.1, sound: sound1 },
    { x1: 8.10, y1: 15.4, x2: 31.43, y2: 19.1, sound: sound2 },
    { x1: 69.6, y1: 11.0, x2: 82.1, y2: 14.10, sound: sound3 },
    { x1: 69.6, y1: 16.2, x2: 84.5, y2: 19.4, sound: sound4 },
    { x1: 8.75, y1: 26.2, x2: 39.06, y2: 29.6, sound: sound5 },
    { x1: 51.8, y1: 26.9, x2: 64.8, y2: 30.12, sound: sound6 },
      { x1: 63.74, y1: 63.6, x2: 87.5, y2: 67.1, sound: sound7 },
    { x1: 78.4, y1: 82.9, x2: 93.6, y2: 63.5, sound: sound8 },
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
    <div className="unit6-page-background" style={{ position: "relative" }}>
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
        className="headset-icon-CD-unit6-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit6-page4-1  hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit6_Page4;
