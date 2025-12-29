import { useState, useRef } from "react";
import page_1 from "../../../assets/unit8/imgs/Right 1 Unit 08 At the Soccer Match.jpg";
import "./Unit8_Page1.css";
import unit2_page1_CD8 from "../../../assets/img_unit2/sounds-unit2/CD8.Pg10_U2.Intro_Adult Lady.mp3";
import Unit8_Page1_find from "./Unit8_Page1_find";
import Unit8_Page1_Vocab from "./Unit8_Page1_Vocab";
import Unit8_Page1_Read from "./Unit8_Pag1_Read";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import allUnit2 from "../../../assets/unit8/sound/U8P64-65.mp3";
import sound1 from "../../../assets/unit8/sound/U8P64VOC01.mp3";
import sound2 from "../../../assets/unit8/sound/U8P64VOC02.mp3";
import sound3 from "../../../assets/unit8/sound/U8P64VOC03.mp3";
import sound4 from "../../../assets/unit8/sound/U8P64VOC04.mp3";
import sound5 from "../../../assets/unit8/sound/U8P64VOC05.mp3";
import sound6 from "../../../assets/unit8/sound/U8P64VOC06.mp3";

const Unit8_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 4.12, text: "Page 64, Unit 8: At The Soccer Game." },
    { start: 4.15, end: 7.27, text: "Page 64, Unit 8 Vocabulary." },
    { start: 7.3, end: 10.09, text: " 1.eye" },
    { start: 10.12, end: 12.06, text: "2.nose" },
    { start: 12.09, end: 14.19, text: "3.mouth" },
    { start: 14.22, end: 17.1, text: "4.head" },
    { start: 17.13, end: 19.6, text: " 5.knee" },
    { start: 19.63, end: 22.09, text: " 6.leg" },
    { start: 22.12, end: 24.17, text: "7.touch" },
    { start: 24.19, end: 27.07, text: "8.arm" },
    { start: 27.1, end: 29.25, text: "9.hand" },
    { start: 29.28, end: 33.21, text: " Page 64. Listen and read along. " },
    { start: 33.25, end: 37.26, text: "S-sun, sock, see." },
    { start: 37.29, end: 41.02, text: " Page 65. Come play." },
    {
      start: 41.05,
      end: 51.17,
      text: "Soccer is fun. I play soccer a lot. I use my legs, arms, eyes, feet, and head. Come play with me. ",
    },
    { start: 51.2, end: 55.03, text: "Page 65. Listen and read along. " },
    {
      start: 55.06,
      end: 57.12,
      text: "Can you touch your head? ",
    },
    {
      start: 57.15,
      end: 58.2,
      text: "Yes, I can.  ",
    },
    { start: 58.23, end: 63.11, text: "Page 65. Listen and read along. " },
    { start: 63.14, end: 67.23, text: " Z-zoo, zebra, zipper." },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 43.25, y1: 32.8, sound: 1, isPrimary: true },

    // // // الصوت الأول – منطقة إضافية
    { x1: 51.8, y1: 34.79, x2: 53.4, y2: 35.09, sound: 1, isPrimary: false },

    // // // الصوت الثاني – الأساسية
    { x1: 44.8, y1: 36.1, sound: 2, isPrimary: true },

    // // // الصوت الثاني – الإضافية
    { x1: 53.98, y1: 36.16, x2: 55.72, y2: 37.0, sound: 2, isPrimary: false },

    // // // الصوت الثالث – الأساسية
    { x1: 47.95, y1: 38.8, sound: 3, isPrimary: true },

    // // // الصوت الثالث – الإضافية
    { x1: 54.37, y1: 37.68, x2: 58.24, y2: 38, sound: 3, isPrimary: false },
    // // // الصوت الرابع – الأساسية
    { x1: 61.2, y1: 26.45, sound: 4, isPrimary: true },

    // // // الصوت الرابع – الإضافية
    { x1: 49.13, y1: 30.83, x2: 61.73, y2: 30.06, sound: 4, isPrimary: false },

    // // // الصوت الخامس – الأساسية
    { x1: 51.0, y1: 48.2, sound: 5, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 50.49, y1: 47.27, x2: 54.17, y2: 47.12, sound: 5, isPrimary: false },
    // // // الصوت الخامس – الأساسية
    { x1: 45.7, y1: 50.2, sound: 6, isPrimary: true },

    // // // الصوت الخامس – الإضافية
    { x1: 44.28, y1: 49.41, x2: 50.29, y2: 52.15, sound: 6, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
    5: sound5,
    6: sound6,
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
      style={{ backgroundImage: `url(${page_1})` }}
    >
      <audio ref={audioRef} style={{ display: "none" }} />
      {/* <img
        src={page_1}
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
        className="headset-icon-CD-unit8-page1-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "audio",
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <AudioWithCaption src={allUnit2} captions={captionsExample} />
              </div>
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
        className="click-icon-unit8-page1-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <>
                <Unit8_Page1_find />
              </>
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
      <div
        className="headset-icon-CD-unit8-page1-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <>
                <Unit8_Page1_Vocab />
              </>
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
      <div
        className="click-icon-unit8-page1-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              "html",
              <>
                <Unit8_Page1_Read />
              </>
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

export default Unit8_Page1;
