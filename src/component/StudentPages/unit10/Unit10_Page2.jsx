import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream2.jpg";
import soundSong from "../../../assets/unit5/sounds/U5P41 Welcome to my class.mp3";
import sound1 from "../../../assets/unit10/sound/Pg83_1.1_Bebo.mp3";
import sound2_2 from "../../../assets/unit10/sound/Pg83_1.2_Lolo.mp3";
import sound3 from "../../../assets/unit10/sound/Pg83_2.1_Adult Lady.mp3";
import sound4 from "../../../assets/unit10/sound/Pg83_2.2_Adult Lady.mp3";
import sound5 from "../../../assets/unit10/sound/Pg83_2.3_Adult Lady.mp3";
import sound6 from "../../../assets/unit10/sound/Pg83_2.4_Adult Lady.mp3";
import sound7 from "../../../assets/unit5/sounds/U5P41 Listen and read along.mp3";
import img1 from "../../../assets/unit10/imgs/short e.svg";
import img2 from "../../../assets/unit10/imgs/ten.svg";
import img3 from "../../../assets/unit10/imgs/net.svg";
import img4 from "../../../assets/unit10/imgs/jet.svg";
import CD21_Pg23_Instruction1_AdultLady from "../../../assets/unit5/sounds/U5P41 listen and repeat (1).mp3";
import repeat1 from "../../../assets/unit10/imgs/listen and repeat 02.svg";
import repeat2 from "../../../assets/unit10/imgs/listen and repeat 03.svg";
import read from "../../../assets/unit1/imgs/P1 listen and repeat 01.svg";
import Rabbit from "../../../assets/img_unit2/imgs/Rabbit.svg";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";
import FourImagesWithAudio from "../../FourImagesWithAudio";
import "./Unit10_Page2.css";
import sound9 from "../../../assets/img_unit2/sounds-unit2/U2-06.mp3";


const Unit10_Page2 = ({ openPopup }) => {
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
    { start: 0, end: 3.23, text: "Page 41. The things on my desk." },
    { start: 3.26, end: 7.02, text: "Welcome to my class. This is my desk," },
    {
      start: 7.05,
      end: 10.2,
      text: " this is my book, my eraser and my pencil.",
    },
    { start: 10.23, end: 13.15, text: " My teacher's desk is there." },
    {
      start: 13.18,
      end: 17.03,
      text: " There's a globe on it. I love my class.",
    },
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
    { x1: 11.15, y1: 46.2, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 2.89, y1: 34.73, x2: 11.72, y2: 70.10, sound: 1, isPrimary: false },

  ];
  const sounds = {
    1: sound9,

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
      {/* <img src={page_2} /> */}
        <audio ref={audioRef} style={{ display: "none" }} />
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
        className="headset-icon-CD-unit10-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <AudioWithCaption src={soundSong} captions={captionsExample} />
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
        className="headset-icon-CD-unit10-page2-2 hover:scale-110 transition"
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
                checkpoints={[0, 4.6, 7.14]}
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
        className="click-icon-unit10-page2-1 hover:scale-110 transition"
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
                checkpoints={[0, 4.05, 5.1, 6.05, 7.06]}
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

export default Unit10_Page2;
