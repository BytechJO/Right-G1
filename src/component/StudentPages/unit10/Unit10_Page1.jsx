import page_1 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream.jpg";
import "./Unit10_Page1.css";
import { useState, useRef } from "react";
import Pg22_U3_Intro_AdultLady from "../../../assets/unit5/sounds/U5P40-41.mp3";
import AudioWithCaption from "../../AudioWithCaption";
import Unit10_Page1_find from "./Unit10_Page1_find";
import Unit10_Page1_Vocab from "./Unit10_Page1_Vocab";
import Unit10_Page1_Read from "./Unit10_Pag1_Read";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import sound1 from "../../../assets/img_unit2/sounds-unit2/U2-01.mp3";
import sound2 from "../../../assets/img_unit2/sounds-unit2/U2-02.mp3";
import sound3 from "../../../assets/img_unit2/sounds-unit2/U2-03.mp3";
import sound4 from "../../../assets/img_unit2/sounds-unit2/U2-04.mp3";
import sound5 from "../../../assets/img_unit2/sounds-unit2/U2-03.mp3";
import sound6 from "../../../assets/img_unit2/sounds-unit2/U2-02.mp3";
import sound7 from "../../../assets/img_unit2/sounds-unit2/U2-03.mp3";
import sound8 from "../../../assets/img_unit2/sounds-unit2/U2-04.mp3";
import sound10 from "../../../assets/img_unit2/sounds-unit2/U2-03.mp3";
const Unit10_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 4.09, text: "Page 40, Unit 5: Welcome to My Class." },
    { start: 4.12, end: 7.26, text: "Page 40, Unit 5 Vocabulary: " },
    { start: 7.29, end: 10.13, text: "1.	Board." },
    { start: 10.17, end: 12.11, text: "2.	Map." },
    { start: 12.14, end: 14.21, text: "3.	Book." },
    { start: 14.24, end: 17.22, text: "4.	Globe. " },
    { start: 17.25, end: 20.02, text: "5.	Poster." },
    { start: 20.05, end: 22.17, text: "6.	trash bin." },
    { start: 22.2, end: 24.24, text: "7.	Desk." },
    { start: 24.27, end: 27.07, text: "8.	Chair." },
    { start: 27.1, end: 30.09, text: "Page 40. Listen and read along" },
    { start: 30.12, end: 34.24, text: "G, girl, green, garden. " },
    {
      start: 34.27,
      end: 49.8,
      text: "Page 41. The things on my desk. ",
    },
    {
      start: 49.83,
      end: 51.05,
      text: "Welcome to my class. This is my desk, this is my book, my eraser, and my pencil. My teacher's desk is there. There's a globe on it. I love my class. ",
    },
    {
      start: 51.08,
      end: 56.06,
      text: "Page 41. Listen, read, and repeat. ",
    },
    { start: 56.09, end: 57.29, text: "Do you like your class? " },
    { start: 57.32, end: 60.06, text: "I like my class. " },
    { start: 60.09, end: 64.16, text: "Page 41. Listen and read along. " },
    { start: 64.19, end: 68.18, text: "K, key, kite, kitchen..." },
  ];
  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 45.6, y1: 48.3, sound: 1, isPrimary: true },

    // الصوت الأول – منطقة إضافية
    { x1: 45.70, y1: 50.98, x2: 49.58, y2: 57.07, sound: 1, isPrimary: false },

    // // الصوت الثاني – الأساسية
    { x1: 76.0, y1: 34.89, sound: 2, isPrimary: true },

    // // // // // الصوت الثاني – الإضافية
    { x1: 66.82, y1: 35.75, x2: 82.12, y2: 37.78, sound: 2, isPrimary: false },

    // // // // // الصوت الثالث – الأساسية
    { x1: 39.3, y1: 35.7, sound: 3, isPrimary: true },

    // // // // // الصوت الثالث – الإضافية
    { x1: 35.79, y1: 37.10, x2: 51.31, y2: 40.83, sound: 3, isPrimary: false },
    // // // // // الصوت الرابع – الأساسية
    { x1: 69.9, y1: 46.9, sound: 4, isPrimary: true },

    // // // // الصوت الرابع – الإضافية
    { x1: 62.08, y1: 48.78, x2: 74.58, y2: 50.98, sound: 4, isPrimary: false },

    // // // // // الصوت الخامس – الأساسية
    { x1: 38.4, y1: 27.6, sound: 5, isPrimary: true },

    // // // // الصوت الخامس – الإضافية
    { x1: 36.22, y1: 31.69, x2: 39.89, y2: 32.37, sound: 5, isPrimary: false },
    // // // // // الصوت السادس  – الأساسية
    { x1: 26.3, y1: 30.57, sound: 6, isPrimary: true },

    // // // // الصوت السادس – الإضافية
    { x1: 29.54, y1: 28.64, x2: 34.93, y2: 34.06, sound: 6, isPrimary: false },
    // // // // // الصوت السابع  – الأساسية
    { x1: 38.8, y1: 22, sound: 7, isPrimary: true },

    // // // // الصوت السابع – الإضافية
    { x1: 40.75, y1: 20.35, x2: 52.17, y2: 26.10, sound: 7, isPrimary: false },
    // // // // // الصوت الثامن – الأساسية
    { x1: 83, y1: 42.4, sound: 8, isPrimary: true },

    // // // // الصوت الثامن – الإضافية
    { x1: 82.76, y1: 31.35, x2: 94.40, y2: 59.95, sound: 8, isPrimary: false },
    // // // // // الصوت التاسع – الأساسية
    { x1: 86, y1: 22.6, sound: 9, isPrimary: true },

    // // // // الصوت التاسع – الإضافية
    // { x1: 42.9, y1: 34.57, x2: 52.6, y2: 45.23, sound: 9, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
    5: sound5,
    6: sound6,
    7: sound7,
    8: sound8,
    9: sound10,
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
      {/* <img src={page_1} /> */}

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
        className="headset-icon-CD-unit10-page1-1 hover:scale-110 transition"
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
                <AudioWithCaption
                  src={Pg22_U3_Intro_AdultLady}
                  captions={captionsExample}
                />
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
        className="click-icon-unit10-page1-1  hover:scale-110 transition"
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
                <Unit10_Page1_find />
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
        className="headset-icon-CD-unit10-page1-2 hover:scale-110 transition"
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
                <Unit10_Page1_Vocab />
              </>,
              false
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
        className="click-icon-unit10-page1-2 hover:scale-110 transition"
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
                <Unit10_Page1_Read />
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

export default Unit10_Page1;
