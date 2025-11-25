import React, { useState, useRef } from "react";
import page_3 from "../../assets/unit6/imgs/Right G1- Class Book_00048.jpg";
import "./Unit6_Page3.css";
import CD22_pg24_Grammar1_AdultLady from "../../assets/unit3/sound3/U3P24RG1.mp3";
import sound1 from "../../assets/unit3/sound3/Pg24_1.1_Adult Lady.mp3";
import sound2 from "../../assets/unit3/sound3/Pg24_1.2_Adult Lady.mp3";
import sound3 from "../../assets/unit3/sound3/Pg24_1.3_Adult Lady.mp3";
import sound4 from "../../assets/unit3/sound3/Pg24_2.1_Female Teacher.mp3";
import sound5 from "../../assets/unit3/sound3/Pg24_3.1_Female Teacher.mp3";
import sound6 from "../../assets/unit3/sound3/Pg24_4.1_Male Teacher.mp3";
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
    { x1: 13.0, y1: 9.8, x2: 24.0, y2: 13.9, sound: sound1 },
    { x1: 13.0, y1: 15.2, x2: 24.0, y2: 19.0, sound: sound2 },
    { x1: 71.2, y1: 12.5, x2: 85.22, y2: 16.7, sound: sound3 },
    { x1: 16.9, y1: 22.6, x2: 26.7, y2: 25.5, sound: sound4 },
    { x1: 58.0, y1: 22.8, x2: 68.5, y2: 26.0, sound: sound5 },
    { x1: 27.9, y1: 59.0, x2: 42.9, y2: 63.4, sound: sound6 },
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
