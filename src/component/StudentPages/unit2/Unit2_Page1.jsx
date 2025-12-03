import { useState, useRef } from "react";
import page_1 from "../../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday.jpg";
import "./Unit2_Page1.css";
import unit2_page1_CD8 from "../../../assets/img_unit2/sounds-unit2/CD8.Pg10_U2.Intro_Adult Lady.mp3";
import Unit2_Page1_find from "./Unit2_Page1_find";
import Unit2_Page1_Vocab from "./Unit2_Page1_Vocab";
import Unit2_Page1_Read from "./Unit2_Pag1_Read";
import AudioWithCaption from "../../AudioWithCaption";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import allUnit2 from "../../../assets/unit1/sounds/P10-11.mp3";
import sound1 from "../../../assets/unit1/sounds/pg4-vocabulary-1-goodbye.mp3";
import sound2 from "../../../assets/unit1/sounds/pg4-vocabulary-2-how are you.mp3";
import sound3 from "../../../assets/unit1/sounds/pg4-vocabulary-3-fine thank you.mp3";
import sound4 from "../../../assets/unit1/sounds/pg4-vocabulary-4-hello..mp3";
import sound5 from "../../../assets/unit1/sounds/pg4-vocabulary-5-good morning.mp3";

const Unit2_Page1 = ({ openPopup }) => {
  const [activeAreaIndex, setActiveAreaIndex] = useState(null);
  const [hoveredAreaIndex, setHoveredAreaIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const captionsExample = [
    { start: 0, end: 4.0, text: " Page 10, Unit 2, Stella's Birthday. " },
    { start: 4.05, end: 7.09, text: "Page 10, Unit 2, Vocabulary." },
    { start: 7.12, end: 9.19, text: " 1. Party Hat. " },
    { start: 9.22, end: 11.16, text: "2. Jello." },
    { start: 11.2, end: 14.0, text: "3. Cake. " },
    { start: 14.04, end: 16.23, text: "4. Happy Birthday." },
    { start: 16.26, end: 19.1, text: " 5. Balloons." },
    { start: 19.14, end: 21.17, text: " 6. Present. " },
    { start: 21.2, end: 24.04, text: "7.card" },
    { start: 24.08, end: 26.29, text: "Page 10. Listen and read along. " },
    { start: 26.33, end: 30.12, text: "B, bird, ball, boy " },
    { start: 30.16, end: 32.28, text: "Page 11. Birthday is fun" },
    {
      start: 32.32,
      end: 40.09,
      text: "Hi, everyone. Today is my birthday. I'm seven years old. My friends are here. It's fun. ",
    },
    { start: 40.12, end: 43.18, text: "Page 11. Listen, read & repeat. " },
    {
      start: 43.22,
      end: 46.26,
      text: "What's your name? My name is Lolo. ",
    },
    { start: 46.3, end: 50.14, text: "Page 11. Listen and read along. " },
    { start: 50.18, end: 53.25, text: "P, pencil, pink, pizza. " },
  ];

  const areas = [
    // الصوت الأول – المنطقة الأساسية
    { x1: 72.8, y1: 26.4, x2: 77.0, y2: 30.0, sound: 1, isPrimary: true },

    // // الصوت الأول – منطقة إضافية
    { x1: 69.5, y1: 25.8, x2: 75.9, y2:33.4, sound: 1, isPrimary: false },

    // // الصوت الثاني – الأساسية
    { x1: 62.9, y1: 56.1, x2: 67.2, y2: 59.3, sound: 2, isPrimary: true },

    // // الصوت الثاني – الإضافية
    { x1: 62.9, y1: 53.5, x2: 74.8, y2: 59.9, sound: 2, isPrimary: false },

    // // الصوت الثالث – الأساسية
    { x1: 60.77, y1: 47.6, x2: 64.9, y2: 50.9, sound: 3, isPrimary: true },

    // // الصوت الثالث – الإضافية
    { x1: 56.4, y1: 43.5, x2: 72.8, y2: 51.1, sound: 3, isPrimary: false },
    // // الصوت الرابع – الأساسية
    { x1: 87.6, y1: 11.3, x2: 92.1, y2: 14.4, sound: 4, isPrimary: true },

    // // الصوت الرابع – الإضافية
    { x1: 23.17, y1: 11.5, x2: 99.4, y2: 20.5, sound: 4, isPrimary: false },

    // // الصوت الخامس – الأساسية
    { x1: 13.04, y1: 23.7, x2: 17.3, y2: 26.7, sound: 5, isPrimary: true },

    // // الصوت الخامس – الإضافية
    { x1: 1.0, y1: 11.06, x2: 16.9, y2: 28.5, sound: 5, isPrimary: false },
  ];
  const sounds = {
    1: sound1,
    2: sound2,
    3: sound3,
    4: sound4,
    5: sound5,
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
    <div className="unit2-page-background" style={{ position: "relative" }}>
      <audio ref={audioRef} style={{ display: "none" }} />
      <img
        src={page_1}
        onClick={handleImageClick}
        style={{ display: "block" }}
      />
      {areas.map((area, index) => (
        <div
          key={index}
          className={`clickable-area ${
            area.isPrimary && activeAreaIndex === area.sound ? "highlight" : ""
          }`}
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
          }}
          onClick={() => {
            setActiveAreaIndex(area.sound);
            playSound(sounds[area.sound]);
          }}
        ></div>
      ))}
      <div
        className="headset-icon-CD-unit2-page1-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <AudioWithCaption src={allUnit2} captions={captionsExample} />
              </div>,
              true,
              false
            )
          }
          style={{ overflow: "visible" }}
        >
          <image href={audioBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>

      <div
        className="click-icon-unit2-page1-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              <>
                <Unit2_Page1_find />
              </>,
              false
            )
          }
          style={{ overflow: "visible" }}
        >
          <image href={arrowBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <div
        className="headset-icon-CD-unit2-page1-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              <>
                <Unit2_Page1_Vocab />
              </>,
              false
            )
          }
          style={{ overflow: "visible" }}
        >
          <image href={arrowBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
      <div
        className="click-icon-unit2-page1-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          onClick={() =>
            openPopup(
              <>
                <Unit2_Page1_Read />
              </>,
              false
            )
          }
          style={{ overflow: "visible" }}
        >
          <image href={arrowBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
    </div>
  );
};

export default Unit2_Page1;
