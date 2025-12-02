import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday2.jpg";
import img1 from "../../assets/img_unit2/imgs/p.svg";
import img2 from "../../assets/img_unit2/imgs/pencil.svg";
import img3 from "../../assets/img_unit2/imgs/pink.svg";
import img4 from "../../assets/img_unit2/imgs/pizza.svg";
import Rabbit from "../../assets/img_unit2/imgs/Rabbit.svg";
import soundListen from "../../assets/img_unit2/sounds-unit2/cd10pg11-instruction1-adult-lady_inMDacHf.mp3";
import Pg11_1_1_Bebo from "../../assets/img_unit2/sounds-unit2/Pg11_1.1_Bebo.mp3";
import Pg11_1_1_Stella from "../../assets/img_unit2/sounds-unit2/mix_09s (audio-joiner.com).mp3";
import Pg11_1_2_Lolo_Take from "../../assets/img_unit2/sounds-unit2/Pg11_1.2_Lolo_Take 2.mp3";
import repeat1 from "../../assets/img_unit2/imgs/listen and repeat 02.svg";
import repeat2 from "../../assets/img_unit2/imgs/listen and repeat 03.svg";
import Pg11_2_1_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg11_2.1_Adult Lady.mp3";
import Pg11_2_2_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg11_2.2_Adult Lady.mp3";
import Pg11_2_3_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg11_2.3_Adult Lady.mp3";
import Pg11_2_4_AdultLady from "../../assets/img_unit2/sounds-unit2/Pg11_2.4_Adult Lady.mp3";
import longsound from "../../assets/img_unit2/sounds-unit2/pg11-instruction2-adult-lady_9RiKbUV1.mp3";
import read from "../../assets/unit1/imgs/P1 listen and repeat 01.svg";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../assets/unit1/imgs/Page 01/Arrow.svg";
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
    { start: 5.24, end: 7.2, text: " I'm seven years old." },
    { start: 7.24, end: 9.0, text: "  My friends are here. It's fun." },
  ];

  return (
    <div className="unit2-page-background">
      <img src={page_2} />
      <div
        className="headset-icon-CD-unit2-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
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
          style={{ overflow: "visible" }}
        >
          <image href={audioBtn} x="0" y="0" width="90" height="90" />
        </svg>
      </div>
        <div
          className="headset-icon-CD-unit2-page2-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
        onClick={() =>
          openPopup(
            <FourImagesWithAudio
              images={[read, repeat1, repeat2]}
              audioSrc={soundListen}
              checkpoints={[0, 3.7, 5.3]}
              popupOpen={true}
              titleQ={`Listen, read, and repeat.`}
              audioArr={imageSounds2}
            />,
            false
          )
        }
       style={{ overflow: "visible" }}
      >
        <image href={audioBtn} x="0" y="0" width="90" height="90" />
      </svg>
      </div>
        <div
        className="click-icon-unit2-page2-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
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
             style={{ overflow: "visible" }}
      >
        <image href={arrowBtn} x="0" y="0" width="90" height="90" />
      </svg>
      </div>
    </div>
  );
};

export default Unit2_Page2;
