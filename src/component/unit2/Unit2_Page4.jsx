import React, { useState, useRef } from "react";
import page_4 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday4.jpg";
import "./Unit2_Page4.css";
import CD12_Pg13_Grammar2_AdultLady from "../../assets/img_unit2/sounds-unit2/U2 Right Grammar P13.mp3";
import Pg13_2_1_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg13.2.1_Adult Lady.mp3";
import Pg13_2_2_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg13.2.2_Adult Lady.mp3";
import Pg13_2_3_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg13.2.3_Adult Lady.mp3";
import Pg13_2_4_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg13.2.4_Adult Lady.mp3";
import Pg13_3_1_Hansel from "../../assets/img_unit2/sounds-unit2/Pg13.3.1_Hansel.mp3";
import Pg13_3_2_Harley from "../../assets/img_unit2/sounds-unit2/Pg13.3.2_Harley.mp3";
import Pg13_4_1_Hansel from "../../assets/img_unit2/sounds-unit2/Pg13.4.1_Hansel.mp3";
import Pg13_4_2_Harley from "../../assets/img_unit2/sounds-unit2/Pg13.4.2_Harley.mp3";
import Pg13_5_1_Tom from "../../assets/img_unit2/sounds-unit2/Pg13.5.1_Tom.mp3";
import Pg13_5_2_Sarah from "../../assets/img_unit2/sounds-unit2/Pg13.5.2_Sarah.mp3";
import Pg13_6_1_Helen from "../../assets/img_unit2/sounds-unit2/Pg13.6.1_Helen.mp3";
import Pg13_6_2_Sarah from "../../assets/img_unit2/sounds-unit2/Pg13.6.2_Sarah.mp3";
import video from "../../assets/img_unit2/sounds-unit2/p13.mp4";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg"
import arrowBtn from "../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../assets/unit1/imgs/Page 01/Right Video Button.svg";
import AudioWithCaption from "../AudioWithCaption";


const Unit2_Page4 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 4.07, text: " Page 13, exercise 2. Right Grammar. " },
    { start: 4.10, end: 5.12, text: " What is it? " },
    {start: 5.15, end: 6.15,text: "It’s a cake.",},
    {start: 6.19,end: 7.21,text: "What are these?",},
    { start: 7.25, end: 9.04, text: "These are presents. " },
    { start: 9.07, end: 11.29, text: "What is it? It's a birthday cake. " },
    { start: 11.32, end: 15.04, text: "What are these? These are presents." },
    { start: 15.07, end: 18.22, text: "Is it a train? Yes, it is. " },
    {
      start: 18.26,
      end: 21.24,
      text: "Is it a cake? No, it isn't.",
    },
  ];
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));

    checkAreaAndPlaySound(xPercent, yPercent);
  };
  const clickableAreas = [
    { x1: 6.53, y1: 10.4, x2: 23.43, y2: 14.2, sound: Pg13_2_1_AdultLady },
    { x1: 54.19, y1: 10.4, x2: 71.5, y2: 14.5, sound: Pg13_2_2_AdultLady },
    { x1: 6.53, y1: 15.27, x2: 30.7, y2: 19.4, sound: Pg13_2_3_AdultLady },
    { x1: 54.2, y1: 15.27, x2: 78.3, y2: 19.5, sound: Pg13_2_4_AdultLady },
    { x1: 6.7, y1: 32.3, x2: 21.8, y2: 36.2, sound: Pg13_3_1_Hansel },
    { x1: 23.3, y1: 25.5, x2: 39.8, y2: 30.7, sound: Pg13_3_2_Harley },
    { x1: 55.0, y1: 30.7, x2: 74.1, y2: 33.9, sound: Pg13_4_1_Hansel },
    { x1: 81.6, y1: 26.7, x2: 93.3, y2: 31.6, sound: Pg13_4_2_Harley },
    { x1: 9.2, y1: 59.18, x2: 23.7, y2: 62.8, sound: Pg13_5_1_Tom },
    { x1: 33.3, y1: 60.2, x2: 44.6, y2: 63.5, sound: Pg13_5_2_Sarah },
    { x1: 55.0, y1: 55.0, x2: 70.1, y2: 58.27, sound: Pg13_6_1_Helen },
    { x1: 77.1, y1: 60.69, x2: 91.4, y2: 63.7, sound: Pg13_6_2_Sarah },
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
    <div className="unit2-page-background">
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
                src={CD12_Pg13_Grammar2_AdultLady}
                captions={captionsExample}
              />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit2-page4-1 hover:scale-110 transition"
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
        className="pauseBtn-icon-CD-unit2-page4-1 hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit2_Page4;
