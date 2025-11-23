import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday2.jpg";
import img1 from "../../assets/img_unit2/imgs/p.svg";
import img2 from "../../assets/img_unit2/imgs/pencil.svg";
import img3 from "../../assets/img_unit2/imgs/pink.svg";
import img4 from "../../assets/img_unit2/imgs/pizza.svg";
import Rabbit from "../../assets/img_unit2/imgs/Rabbit.svg";
import soundListen from "../../assets/img_unit2/sounds-unit2/CD10.Pg11_Instruction1_Adult Lady.mp3";
import Pg11_1_1_Bebo from "../../assets/img_unit2/sounds-unit2/Pg11_1.1_Bebo.mp3";
import Pg11_1_1_Stella from "../../assets/img_unit2/sounds-unit2/mix_09s (audio-joiner.com).mp3";
import Pg11_1_2_Lolo_Take from "../../assets/img_unit2/sounds-unit2/Pg11_1.2_Lolo_Take 2.mp3";
import repeat1 from "../../assets/img_unit2/imgs/listen and repeat 02.svg";
import repeat2 from "../../assets/img_unit2/imgs/listen and repeat 03.svg";
import Pg11_2_1_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg11_2.1_Adult Lady.mp3";
import Pg11_2_2_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg11_2.2_Adult Lady.mp3";
import Pg11_2_3_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg11_2.3_Adult Lady.mp3";
import Pg11_2_4_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg11_2.4_Adult Lady.mp3";
import longsound from "../../assets/unit1/sounds/pg5-instruction2-adult-lady_B2grO9RW.mp3";
import read from "../../assets/unit1/imgs/P1 listen and repeat 01.svg";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import AudioWithCaption from "../AudioWithCaption";
import FourImagesWithAudio from "../FourImagesWithAudio";
import "./Unit2_Page2.css";
const Unit2_Page2 = ({ openPopup }) => {
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
    { start: 0, end: 2.0, text: "Page11. Birthdays Are Fun" },
    { start: 2.05, end: 5.2, text: "Hi, everyone. Today is my birthday." },
    { start: 5.24, end:7.2, text: " I'm seven years old." },
    { start: 7.24, end: 9.0, text: "  My friends are here. It's fun." },
  ];

  return (
    <div className="unit2-page-background">
      <img src={page_2} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 90 90"
        onClick={() =>
          openPopup(
            <AudioWithCaption
              src={Pg11_1_1_Stella}
              captions={captionsExample}
            />,
            true
          )
        }
        className="headset-icon-CD-unit2-page2-1 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="90" height="90" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 90 90"
        onClick={() =>
          openPopup(
            <FourImagesWithAudio
              images={[read, repeat1, repeat2]}
              audioSrc={soundListen}
              checkpoints={[0, 4, 5.9]}
              popupOpen={true}
              titleQ={`Listen, read, and repeat.`}
              audioArr={imageSounds2}
            />,
            false
          )
        }
        className="headset-icon-CD-unit2-page2-2 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="90" height="90" />
      </svg>
      {/* <span className="headset-icon-CD-unit2-page2-2 shadow-md hover:scale-110 transition">
        <FaHeadphones
          size={12}
          color="rgba(255, 255, 255, 1)"
          onClick={() => setActivePopup(2)}
        />
      </span>
      <Popup
        isOpen={activePopup === 2}
        onClose={() => setActivePopup(null)}
        children={
          <>
            <audio ref={introRef} autoPlay style={{ display: "none" }}>
              <source src={soundListen} type="audio/mp3" />
            </audio>

            <img
              src={Lolo_bebo}
              style={{ height: "auto" }}
              onClick={(e) => {
                handleImageClick(e,clickableAreas2);
              }}
            />
            <audio ref={audioRef} style={{ display: "none" }} />

            {clickableAreas2.map((area, index) => (
              <div
                key={index}
                className="clickable-area"
                style={{
                  left: `${area.x1}%`,
                  top: `${area.y1}%`,
                  width: `${area.x2 - area.x1}%`,
                  height: `${area.y2 - area.y1}%`,
                }}
                onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                onClick={() => playSound(area.sound)}
              ></div>
            ))}
          </>
        }
      /> */}

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <FourImagesWithAudio
              images={[Rabbit, img1, img2, img3, img4]}
              audioSrc={longsound}
              checkpoints={[0, 3.4, 4, 4.9, 6]}
              popupOpen={true}
              titleQ={"Listen and read along."}
              audioArr={imageSounds}
            />,
            false
          )
        }
        className="click-icon-unit2-page2-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit2_Page2;
