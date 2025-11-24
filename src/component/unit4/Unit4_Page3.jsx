import React, { useState, useRef } from "react";
import page_3 from "../../assets/unit4/imgs/Right 1 Unit 04 Wonderful Shapes and Colors3.jpg";
import "./Unit4_Page3.css";
import CD29_Pg30_Grammar1_AdultLady from "../../assets/unit4/sounds/U4P31 Grammar.mp3";
import Pg12_1_1_AdultLady from "../../assets/unit4/sounds/Pg30_1.1_Adult Lady.mp3";
import Pg12_1_2_AdultLady from "../../assets/unit4/sounds/Pg30_1.2_Adult Lady.mp3";
import Pg12_1_3_AdultLady from "../../assets/unit4/sounds/Pg30_1.3_Adult Lady.mp3";
import Pg12_1_4_AdultLady from "../../assets/unit4/sounds/Pg30_2.1_Stella.mp3";
import Pg12_1_5_AdultLady from "../../assets/unit4/sounds/Pg30_2.2_John.mp3";
import Pg12_2_1_Harley from "../../assets/unit4/sounds/Pg30_3.1_Sarah.mp3";
import Pg12_2_2_Sarah from "../../assets/unit4/sounds/Pg30_3.2_Jack.mp3";
import Pg12_3_1_Helen_Take from "../../assets/unit4/sounds/Pg30_4.1_Harley.mp3";
import Pg12_3_2_Stella from "../../assets/unit4/sounds/Pg30_4.2_Hansel.mp3";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import video from "../../assets/unit4/sounds/p30.mp4";
const Unit4_Page3 = ({ openPopup }) => {
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

  const audioRef = useRef(null);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));

    checkAreaAndPlaySound(xPercent, yPercent);
  };
  const clickableAreas = [
    { x1: 8.5, y1: 11.7, x2: 30.0, y2: 15.5, sound: Pg12_1_1_AdultLady },
    { x1: 69.9, y1: 10.5, x2: 80.3, y2: 14.0, sound: Pg12_1_2_AdultLady },
    { x1: 69.9, y1: 14.5, x2:  91.9, y2: 17.6, sound: Pg12_1_3_AdultLady },
    { x1: 12.3, y1: 33.6, x2: 34.7, y2: 36.8, sound: Pg12_1_4_AdultLady },
    { x1:29.6, y1: 50.26, x2: 48.07, y2: 53.6, sound: Pg12_1_5_AdultLady },
    { x1: 66.01, y1: 24.03, x2: 93.7, y2: 27.07, sound: Pg12_2_1_Harley },
    { x1: 59.7, y1: 51.27, x2: 80.2, y2: 54.66, sound: Pg12_2_2_Sarah },
    { x1: 28.77, y1: 58.04, x2: 60.6, y2: 29.8, sound: Pg12_3_1_Helen_Take },
    { x1: 64.7, y1: 68.8, x2: 76.0, y2: 72.0, sound: Pg12_3_2_Stella },
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
    <div className="unit4-page-background" style={{ position: "relative" }}>
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
                src={CD29_Pg30_Grammar1_AdultLady}
                captions={captionsExample}
              />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit4-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit4-page3-1 hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit4_Page3;
