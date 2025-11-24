import React, { useState, useRef } from "react";
import page_4 from "../../assets/unit4/imgs/Right 1 Unit 04 Wonderful Shapes and Colors4.jpg";
import "./Unit4_Page4.css";
import { FaHeadphones } from "react-icons/fa";
import { PiCursorClickBold } from "react-icons/pi";
import CD30_Pg31_Grammar2_AdultLady from "../../assets/unit4/sounds/U4P31 Grammar.mp3";
import Pg31_2_1_AdultLady from "../../assets/unit4/sounds/Pg31_2.1_Adult Lady.mp3";
import Pg31_2_2_AdultLady from "../../assets/unit4/sounds/Pg31_2.2_Adult Lady.mp3";
import Pg31_2_3_AdultLady from "../../assets/unit4/sounds/Pg31_2.3_Adult Lady.mp3";
import Pg31_2_4_AdultLady from "../../assets/unit4/sounds/Pg31_2.4_Adult Lady.mp3";
import Pg31_2_5_AdultLady from "../../assets/unit4/sounds/Pg31_2.5_Adult Lady.mp3";
import Pg31_3_1_Tom from "../../assets/unit4/sounds/Pg31_3.1_Tom.mp3";
import Pg31_3_2_Hansel from "../../assets/unit4/sounds/Pg31_3.2_Hansel.mp3";
import Pg31_4_1_Helen from "../../assets/unit4/sounds/Pg31_4.1_Helen.mp3";
import Pg31_4_2_Stella from "../../assets/unit4/sounds/Pg31_4.2_Stella.mp3";
import Pg31_5_1_Sarah from "../../assets/unit4/sounds/Pg31_5.1_Sarah.mp3";
import Pg31_5_2_Jack from "../../assets/unit4/sounds/Pg31_5.2_Jack.mp3";
import video from "../../assets/unit4/sounds/p31.mp4";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
const Unit2_Page4 = ({ openPopup }) => {

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
    { x1: 8.3, y1: 10.5, x2: 29.5, y2: 14.0, sound: Pg31_2_1_AdultLady },
    { x1: 64.17, y1: 10.15, x2: 77.14, y2: 14.0, sound: Pg31_2_2_AdultLady },
    { x1:  8.3, y1: 14.2, x2: 29.5, y2: 17.4, sound: Pg31_2_3_AdultLady },
    { x1: 64.0, y1: 14.0, x2: 77.0, y2: 17.0, sound: Pg31_2_4_AdultLady },
    { x1: 80.19, y1: 14.0, x2: 92.5, y2: 17.0, sound: Pg31_2_5_AdultLady },
    { x1: 7.6, y1: 20.8, x2: 25.8, y2: 24, sound: Pg31_3_1_Tom },
    { x1: 16.49, y1: 52.8, x2: 41.6, y2: 56.18, sound: Pg31_3_2_Hansel },
    { x1: 54.8, y1: 20.98, x2: 76.2, y2: 24.5, sound: Pg31_4_1_Helen },
    { x1: 67.2, y1: 50.6, x2: 85.62, y2: 53.6, sound: Pg31_4_2_Stella },
    { x1: 6.36, y1: 64.5, x2: 42.7, y2: 67.6, sound: Pg31_5_1_Sarah },
    { x1: 45.12, y1: 72.93, x2: 56.59, y2: 76.19, sound: Pg31_5_2_Jack },
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
                src={CD30_Pg31_Grammar2_AdultLady}
                captions={captionsExample}
              />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit4-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit4-page4-1  hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit2_Page4;
