import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/unit3/imgs3/right1-unit3-page2.jpg";
import soundSong from "../../../assets/unit3/sound3/come and sing.mp3";
import sound1 from "../../../assets/unit3/sound3/Pg23_1.1_Bebo.mp3";
import sound2_2 from "../../../assets/unit3/sound3/Pg23_1.2_Lolo_Take 2.mp3";
import sound3 from "../../../assets/unit3/sound3/Pg23_2.1_Adult Lady.mp3";
import sound4 from "../../../assets/unit3/sound3/Pg23_2.2_Adult Lady.mp3";
import sound5 from "../../../assets/unit3/sound3/Pg23_2.3_Adult Lady.mp3";
import sound6 from "../../../assets/unit3/sound3/Pg23_2.4_Adult Lady.mp3";
import sound7 from "../../../assets/unit3/sound3/U3P23-listen and read along.mp3";
import img1 from "../../../assets/unit3/imgs3/Short a.svg";
import img2 from "../../../assets/unit3/imgs3/bat.svg";
import img3 from "../../../assets/unit3/imgs3/cap.svg";
import img4 from "../../../assets/unit3/imgs3/dad.svg";
import CD21_Pg23_Instruction1_AdultLady from "../../../assets/unit3/sound3/U3P23 listen read and repeat.mp3";
import repeat1 from "../../../assets/unit3/imgs3/listen and repeat 02.svg";
import repeat2 from "../../../assets/unit3/imgs3/listen and repeat 03.svg";
import read from "../../../assets/unit1/imgs/P1 listen and repeat 01.svg";
import Rabbit from "../../../assets/img_unit2/imgs/Rabbit.svg";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import sound2_4 from "../../../assets/unit3/sound3/U3P22VOC-04.mp3";
import sound2_5 from "../../../assets/unit3/sound3/U3P22VOC-05.mp3";
import sound2_6 from "../../../assets/unit3/sound3/U3P22VOC-06.mp3";

import "./Unit3_Page2.css";
const Unit3_Page2 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound3),
    new Audio(sound4),
    new Audio(sound5),
    new Audio(sound6),
  ];
  const imageSounds2 = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(sound1),
    new Audio(sound2_2),
  ];
  const captionsExample = [
    { start: 0, end: 3.06, text: "Page 23, come and sing." },
    { start: 3.1, end: 6.1, text: "I love school. We open our books." },
    { start: 6.13, end: 10.06, text: "We make a line. We do many things." },
    { start: 10.09, end: 13.3, text: " My teacher plays songs. We listen." },
  ];
  const captions = [
    { start: 0, end: 3.17, text: "Page 23. Listen, read, and repeat." },
    {
      start: 3.19,
      end: 4.29,
      text: "My favorite subject is science. ",
    },
    {
      start: 4.31,
      end: 7.03,
      text: "My favorite subject is art.",
    },
  ];
  const captions2 = [
    { start: 0, end: 3.18, text: "Page 23. Listen and read along." },
    { start: 3.2, end: 7.01, text: "Short A. Bat, cap, dad." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 23.2, y1: 18.5, sound: 1, isPrimary: true },

    // الصوت الأول – منطقة إضافية
    { x1: 8.4, y1: 5.6, x2: 32.8, y2:17.47, sound: 1, isPrimary: false },

    // الصوت الثاني – الأساسية
    { x1: 19.4, y1: 27.9, sound: 2, isPrimary: true },

    // الصوت الثاني – الإضافية
    { x1: 7.4, y1: 26.7, x2: 21.2, y2: 38.8, sound: 2, isPrimary: false },
    // الصوت الثاني – الأساسية
    { x1:20.0, y1: 41.1,  sound: 3, isPrimary: true },

    // الصوت الثاني – الإضافية
    { x1: 21.4, y1: 35.07, x2: 38.3, y2: 45.7, sound: 3, isPrimary: false },
  ];
  const sounds = {
    1: sound2_4,
    2: sound2_5,
    3: sound2_6,
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
      {/* <img src={page_2} /> */}
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
        className="headset-icon-CD-unit3-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <AudioWithCaption src={soundSong} captions={captionsExample} />,
              true
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
        className="headset-icon-CD-unit3-page2-2 hover:scale-110 transition"
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
                audioSrc={CD21_Pg23_Instruction1_AdultLady}
                checkpoints={[0, 4.9, 7.14]}
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
        className="click-icon-unit3-page2-1 hover:scale-110 transition"
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
                audioSrc={sound7}
                checkpoints={[0, 4.0, 5.1, 6.09, 7.03]}
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
            href={arrowBtn}
            className="svg-img"
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

export default Unit3_Page2;
