import page24 from "../../assets/unit4/imgs/Right G1- Class Book_00038.jpg";
import React, { useState, useRef } from "react";
// import "./Unit2_Page11.css";
import sound1 from "../../assets/unit4/sounds/U4ReadingP38-39.mp3";
import sound2 from "../../assets/unit4/sounds/Pg38_1.1_Adult Lady.mp3";
import sound3 from "../../assets/unit4/sounds/Pg38_1.2_Adult Lady.mp3";
import sound4 from "../../assets/unit4/sounds/Pg38_1.3_Adult Lady.mp3";
import sound5 from "../../assets/unit4/sounds/Pg38_1.4_Adult Lady.mp3";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import video3 from "../../assets/unit4/sounds/STORY ( 2 ).mp4";
const Unit4_Reading_P1 = ({ openPopup }) => {
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 5.04, text: "Page 38 Reading. Hey, that's my pen! " },
    {
      start: 5.07,
      end: 16.03,
      text: "Harley has a pencil and wants to draw a picture. Tom finds an eraser. He asks if the eraser is Harley's. It's not, it's Kevin's. ",
    },
    {
      start: 16.07,
      end: 22.17,
      text: "Harley likes to draw nice pictures. Tom watches. What is Harley going to draw? ",
    },
    {
      start: 22.20,
      end: 27.11,
      text: "Harley starts to draw. Kevin watches. What is the picture? ",
    },
    {
      start: 27.14,
      end: 38.11,
      text: "Harley shows the picture to Kevin. Kevin doesn't know what it is. Harley tells him it is a red mountain, and it's in the shape of a triangle. ",
    },
    {
      start:38.14,
      end:45.17,
      text: "Now Tom finds a book. Is it Kevin's book? No, it's not Kevin's book. ",
    },
    {
      start: 45.20,
      end: 48.26,
      text: "Whose book is it? Is it the teacher's book? ",
    },
    {
      start: 48.29,
      end: 58.07,
      text: "Helen comes into the classroom. She asks the boys about her red book. Tom gives Helen her red book. She is so happy. ",
    },
    {
      start: 58.10,
      end: 65.11,
      text: "Now Tom wants to draw. Where's his pen? Oh no! Lolo has it.",
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
    { x1: 15.9, y1: 39.4, x2: 51.14, y2: 44.0, sound: sound2 },
    { x1: 56.0, y1: 39.1, x2: 93.9, y2: 44.0, sound: sound3 },
    { x1: 16.0, y1: 84.0, x2: 52.9, y2: 89.5, sound: sound4 },
    { x1: 56.0, y1: 84.5, x2: 93.7, y2: 90.9, sound: sound5 },
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
    <div className="page_2-background">
      <img
        src={page24}
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
              <AudioWithCaption src={sound1} captions={captionsExample} />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit2-page11-1 hover:scale-110 transition"
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
                <source src={video3} type="video/mp4" />
              </video>
            </div>
          )
        }
        className="pauseBtn-icon-CD-page21 hover:scale-110 transition"
      >
        <image href={pauseBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit4_Reading_P1;
