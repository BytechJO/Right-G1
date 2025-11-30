import React, { useState, useRef } from "react";
import page_3 from "../../assets/unit9/imgs/Right G1- Class Book_00078.jpg";
import "./Unit9_Page3.css";
import CD22_pg24_Grammar1_AdultLady from "../../assets/unit5/sounds/U5P42Grammar.mp3";
import sound1 from "../../assets/unit9/sound/Pg78_1.1_Adult Lady.mp3";
import sound2 from "../../assets/unit9/sound/Pg78_1.2_Adult Lady.mp3";
import sound3 from "../../assets/unit9/sound/Pg78_1.3_Adult Lady.mp3";
import sound4 from "../../assets/unit9/sound/Pg78_1.4_Adult Lady.mp3";
import sound5 from "../../assets/unit9/sound/Pg78_2.1_Harley.mp3";
import sound6 from "../../assets/unit9/sound/Pg78_2.2_Hansel.mp3";
import sound7 from "../../assets/unit9/sound/Pg78_3.1_Stella.mp3";
import sound8 from "../../assets/unit9/sound/Pg78_3.2_Sarah.mp3";
import sound9 from "../../assets/unit9/sound/Pg78_4.1_Tom.mp3";
import sound10 from "../../assets/unit9/sound/Pg78_4.2_Helen.mp3";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import video from "../../assets/unit5/sounds/p42.mp4";
const Unit9_Page3 = ({ openPopup }) => {
  const audioRef = useRef(null);
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

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));

    checkAreaAndPlaySound(xPercent, yPercent);
  };
  const clickableAreas = [
    { x1: 10.7, y1: 12.99, x2: 26.3, y2: 16.5, sound: sound1 },
    { x1: 67.23, y1: 11.47, x2: 86.5, y2: 14.7, sound: sound2 },
    { x1: 67.23, y1: 15.2, x2: 86.7, y2: 18.4, sound: sound3 },
    { x1: 6.8, y1: 29.9, x2: 23.5, y2: 32.7, sound: sound4 },
    { x1: 30.43, y1: 33.8, x2: 47.7, y2: 37.19, sound: sound5 },
    { x1: 53.38, y1: 30.08, x2: 70.7, y2: 33.4, sound: sound6 },
    { x1: 76.33, y1: 31.1, x2: 93.86, y2: 34.62, sound: sound7 },
    { x1: 9.0, y1: 64.61, x2: 27.8, y2: 26.0, sound: sound8 },
    { x1: 54.68, y1: 65.45, x2: 75.46, y2: 68.46, sound: sound9 },
        { x1: 54.68, y1: 65.45, x2: 75.46, y2: 68.46, sound: sound10 },
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
        className="headset-icon-CD-unit9-page3-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit9-page3-1 hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit9_Page3;
