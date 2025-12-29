import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/unit8/imgs/Right 1 Unit 08 At the Soccer Match2.jpg";
import img1 from "../../../assets/unit8/imgs/Z.svg";
import img2 from "../../../assets/unit8/imgs/zoo.svg";
import img3 from "../../../assets/unit8/imgs/zebra.svg";
import img4 from "../../../assets/unit8/imgs/zipper.svg";
import Rabbit from "../../../assets/img_unit2/imgs/Rabbit.svg";
import soundListen from "../../../assets/unit8/sound/U8P65ListenandReadalong01.mp3";
import Pg11_1_1_Bebo from "../../../assets/unit8/sound/Pg65_1.1_Bebo.mp3";
import Pg11_1_1_Stella from "../../../assets/unit8/sound/U8P65ComePlay.mp3";
import Pg11_1_2_Lolo_Take from "../../../assets/unit8/sound/Pg65_1.2_Lolo.mp3";
import repeat1 from "../../../assets/unit8/imgs/listen and repeat 02.svg";
import repeat2 from "../../../assets/unit8/imgs/listen and repeat 03.svg";
import Pg11_2_1_AdultLady from "../../../assets/unit8/sound/Pg65_2.1_Adult Lady.mp3";
import Pg11_2_2_AdultLady from "../../../assets/unit8/sound/Pg65_2.2_Adult Lady.mp3";
import Pg11_2_3_AdultLady from "../../../assets/unit8/sound/Pg65_2.3_Adult Lady.mp3";
import Pg11_2_4_AdultLady from "../../../assets/unit8/sound/Pg65_2.4_Adult Lady.mp3";
import longsound from "../../../assets/unit8/sound/U8P65ListenandReadalong02.mp3";
import read from "../../../assets/unit1/imgs/P1 listen and repeat 01.svg";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound7 from "../../../assets/unit8/sound/U8P64VOC07.mp3";
import sound8 from "../../../assets/unit8/sound/U8P64VOC08.mp3";
import sound9 from "../../../assets/unit8/sound/U8P64VOC09.mp3";

import "./Unit8_Page2.css";
const Unit8_Page2 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(Pg11_2_1_AdultLady),
    new Audio(Pg11_2_2_AdultLady),
    new Audio(Pg11_2_3_AdultLady),
    new Audio(Pg11_2_4_AdultLady),
  ];
  const imageSounds2 = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(Pg11_1_1_Bebo),
    new Audio(Pg11_1_2_Lolo_Take),
  ];
  const captionsExample = [
    { start: 0, end: 3.18, text: "Page 65. Come play." },
    { start: 3.21, end: 7.11, text: "Soccer is fun. I play soccer a lot." },
    { start: 7.13, end: 12.11, text: "I use my legs, arms, eyes, feet, and head." },
    { start: 12.15, end: 13.28, text: " Come play with me. " },
  ];

  const captions = [
    { start: 0, end: 3.20, text: "Page 65. Listen and read along." },
    {
      start: 3.23,
      end: 5.22,
      text: "Can you touch your head?",
    },
    {
      start: 5.25,
      end: 7.18,
      text: "Yes, I can. ",
    },
  ];


  const captions2 = [
    { start: 0, end: 4.08, text: "Page 65. Listen and read along. " },
    { start: 4.12, end: 8.23, text:  "Z-zoo, zebra, zipper." },
  ];

 
  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 13.2, y1: 43.9, sound: 1, isPrimary: true },

    // // // // الصوت الأول – منطقة إضافية
    { x1: 21.19, y1: 48.04, x2: 25.9, y2: 50.78, sound: 1, isPrimary: false },

    // // // // الصوت الثاني – الأساسية
    { x1: 35.2, y1: 45.2, sound: 2, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 32.94, y1: 47.58, x2: 48.3, y2: 50.7, sound: 2, isPrimary: false },
    //     // // // الصوت الثاني – الأساسية
    { x1: 11.5, y1: 54.5, sound: 3, isPrimary: true },

    // // // // الصوت الثاني – الإضافية
    { x1: 9.48, y1: 57.63, x2: 48.3, y2: 59.7, sound: 3, isPrimary: false },
  ];
  const sounds = {
    1: sound7,
    2: sound8,
    3: sound9,
  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));
  };
  const playSound = (path) => {
    if (audioRef.current) {
      audioRef.current.src = path;
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
    <div
      className="page1-img-wrapper"
      onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_2})` }}
    >
      <audio ref={audioRef} style={{ display: "none" }} />
      {/* <img
        src={page_2}
        onClick={handleImageClick}
        style={{ display: "block" }}
      /> */}
      {areas.map((area, index) => {
        const isActive = activeAreaIndex === area.sound;

        // ============================
        // 1️⃣ المنطقة الأساسية → دائرة تظهر فقط عندما تكون Active
        // ============================
        if (area.isPrimary) {
          return (
            <div
              key={index}
              className={`circle-area ${isActive ? "active" : ""}`}
              style={{
                left: `${area.x1}%`,
                top: `${area.y1}%`,
              }}
              onClick={() => {
                setActiveAreaIndex(area.sound);
                playSound(sounds[area.sound]);
              }}
            ></div>
          );
        }

        // ============================
        // 2️⃣ المناطق الفرعية → مربعات داكنة مخفية ولازم
        //    عند الضغط عليها → تفعّل الدائرة الأساسية
        // ============================
        return (
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
            onClick={() => {
              setActiveAreaIndex(area.sound); // 👈 يفعل الدائرة فوق الرقم
              playSound(sounds[area.sound]);
            }}
          ></div>
        );
      })}

      <div
        className="headset-icon-CD-unit8-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <AudioWithCaption
                src={Pg11_1_1_Stella}
                captions={captionsExample}
              />
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={audioBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <div
        className="headset-icon-CD-unit8-page2-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <FourImagesWithAudio
                images={[read, repeat1, repeat2]}
                audioSrc={soundListen}
                checkpoints={[0, 3.5, 5.5]}
                popupOpen={true}
                titleQ={`Listen, read, and repeat.`}
                audioArr={imageSounds2}
                captions={captions}
              />
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={audioBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      <div
        className="click-icon-unit8-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <FourImagesWithAudio
                images={[Rabbit, img1, img2, img3, img4]}
                audioSrc={longsound}
                checkpoints={[0, 4.03, 5.15, 6.06, 7.19]}
                popupOpen={true}
                titleQ={"Listen and read along."}
                audioArr={imageSounds}
                captions={captions2}
              />
            )
          }
          style={{ overflow: "visible" }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
    </div>
  );
};

export default Unit8_Page2;
