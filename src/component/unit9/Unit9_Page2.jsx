import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../assets/unit9/imgs/Right G1- Class Book_00077.jpg";
import soundSong from "../../assets/unit5/sounds/U5P41 Welcome to my class.mp3";
import sound1 from "../../assets/unit9/sound/Pg77_1.1_Bebo.mp3";
import sound2_2 from "../../assets/unit9/sound/Pg77_1.2_Lolo.mp3";
import sound3 from "../../assets/unit9/sound/Pg77_2.1_Adult Lady.mp3";
import sound4 from "../../assets/unit9/sound/Pg77_2.2_Adult Lady.mp3";
import sound5 from "../../assets/unit9/sound/Pg77_2.3_Adult Lady.mp3";
import sound6 from "../../assets/unit9/sound/Pg77_2.4_Adult Lady.mp3";
import sound7 from "../../assets/unit5/sounds/U5P41 Listen and read along.mp3";
import img1 from "../../assets/unit5/imgs/K.svg";
import img2 from "../../assets/unit5/imgs/Key.svg";
// import img3 from "../../assets/unit5/imgs/kite.svg";
import img4 from "../../assets/unit5/imgs/kitchen.svg";
import CD21_Pg23_Instruction1_AdultLady from "../../assets/unit5/sounds/U5P41 listen and repeat (1).mp3";
import repeat1 from "../../assets/unit5/imgs/listen and repeat 02.svg";
import repeat2 from "../../assets/unit5/imgs/listen and repeat 03.svg";
import read from "../../assets/unit1/imgs/P1 listen and repeat 01.svg";
import Rabbit from "../../assets/img_unit2/imgs/Rabbit.svg";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import AudioWithCaption from "../AudioWithCaption";
import FourImagesWithAudio from "../FourImagesWithAudio";
import "./Unit9_Page2.css";
const Unit9_Page2 = ({ openPopup }) => {
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
      end: 10.20,
      text: " this is my book, my eraser and my pencil.",
    },
    { start: 10.23, end: 13.15, text: " My teacher's desk is there." },
    {
      start: 13.18,
      end: 17.03,
      text: " There's a globe on it. I love my class.",
    },
  ];

  return (
    <div className="unit5-page-background">
      <img src={page_2} />

      <svg
        width="30"
        height="30"
        viewBox="0 0 90 90"
        onClick={() =>
          openPopup(
            <AudioWithCaption src={soundSong} captions={captionsExample} />,
            true
          )
        }
        className="headset-icon-CD-unit9-page2-1 hover:scale-110 transition"
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
              audioSrc={CD21_Pg23_Instruction1_AdultLady}
              checkpoints={[0, 4.6, 7.14]}
              popupOpen={true}
              titleQ={`Listen, read, and repeat.`}
              audioArr={imageSounds2}
            />,
            false
          )
        }
        className="headset-icon-CD-unit9-page2-2 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="90" height="90" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <FourImagesWithAudio
              images={[Rabbit, img1, img2, img3, img4]}
              audioSrc={sound7}
              checkpoints={[0, 4.05, 5.1, 6.05, 7.06]}
              popupOpen={true}
              titleQ={"Listen and read along."}
              audioArr={imageSounds}
            />,
            false
          )
        }
        className="click-icon-unit9-page2-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit9_Page2;
