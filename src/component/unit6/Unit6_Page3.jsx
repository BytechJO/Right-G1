import React, { useState, useRef } from "react";
import page_3 from "../../assets/unit6/imgs/Right 1 Unit 06 Can We Go to the Park3.jpg";
import "./Unit6_Page3.css";
import CD22_pg24_Grammar1_AdultLady from "../../assets/unit3/sound3/U3P24RG1.mp3";
import sound1 from "../../assets/unit6/sounds/Pg48_1.1_Adult Lady.mp3";
import sound2 from "../../assets/unit6/sounds/Pg48_1.2_Adult Lady.mp3";
import sound3 from "../../assets/unit6/sounds/Pg48_1.3_Adult Lady.mp3";
import sound4 from "../../assets/unit6/sounds/Pg48_1.4_Adult Lady.mp3";
import sound5 from "../../assets/unit6/sounds/Pg48_2.1_Adult Lady.mp3";
import sound6 from "../../assets/unit6/sounds/Pg48_3.1_Adult Lady.mp3";
import sound7 from "../../assets/unit6/sounds/Pg48_4.1_Adult Lady.mp3";
import sound8 from "../../assets/unit6/sounds/Pg48_5.1_Jack.mp3";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import video from "../../assets/unit3/sound3/p24.mp4";
const Unit6_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 4.1, text: "Page 24, Exercise 1. Right Grammar." },
    { start: 4.13, end: 5.01, text: " Listen," },
    {
      start: 5.03,
      end: 6.02,
      text: "quiet,",
    },
    {
      start: 6.05,
      end: 7.22,
      text: "make a line.",
    },
    { start: 7.25, end: 9.02, text: "Listen," },
    { start: 9.06, end: 10.04, text: "quiet, " },
    { start: 10.07, end: 11.26, text: "make a line." },
  ];

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));

    checkAreaAndPlaySound(xPercent, yPercent);
  };
  const clickableAreas = [
    { x1: 8.00, y1: 11.0, x2: 24.0, y2: 14.30, sound: sound1 },
    { x1: 8.00, y1: 15.7, x2: 29.40, y2: 19.4, sound: sound2 },
    { x1: 62.7, y1: 10.66, x2: 85.22, y2: 14.3, sound: sound3 },
    { x1: 62.7, y1: 15.7, x2: 85.8, y2: 19.2, sound: sound4 },
    { x1: 9.07, y1: 28.2, x2: 32.3, y2: 32.0, sound: sound5 },
    { x1: 54.5, y1: 27.4, x2: 77.05, y2: 30.6, sound: sound6 },
    { x1: 7.5, y1: 64.4, x2: 31.0, y2: 67.8, sound: sound7},
    { x1: 60.8, y1: 65.1, x2: 74.6, y2: 68.6, sound: sound8 },
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
        src={page_3}
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
                src={CD22_pg24_Grammar1_AdultLady}
                captions={captionsExample}
              />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit6-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit6-page3-1 hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit6_Page3;
