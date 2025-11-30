import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../assets/unit10/imgs/Right G1- Class Book_00083.jpg";
import soundSong from "../../assets/unit3/sound3/come and sing.mp3";
import sound1 from "../../assets/unit10/sound/Pg83_1.1_Bebo.mp3";
import sound2_2 from "../../assets/unit10/sound/Pg83_1.2_Lolo.mp3";
import sound3 from "../../assets/unit10/sound/Pg83_2.1_Adult Lady.mp3";
import sound4 from "../../assets/unit10/sound/Pg83_2.2_Adult Lady.mp3";
import sound5 from "../../assets/unit10/sound/Pg83_2.3_Adult Lady.mp3";
import sound6 from "../../assets/unit10/sound/Pg83_2.4_Adult Lady.mp3";
import sound7 from "../../assets/unit3/sound3/U3P23-listen and read along.mp3";
import img1 from "../../assets/unit3/imgs3/Short a.svg";
import img2 from "../../assets/unit3/imgs3/bat.svg";
import img3 from "../../assets/unit3/imgs3/cap.svg";
import img4 from "../../assets/unit3/imgs3/dad.svg";
import CD21_Pg23_Instruction1_AdultLady from "../../assets/unit3/sound3/U3P23 listen read and repeat.mp3";
import repeat1 from "../../assets/unit3/imgs3/listen and repeat 02.svg";
import repeat2 from "../../assets/unit3/imgs3/listen and repeat 03.svg";
import read from "../../assets/unit1/imgs/P1 listen and repeat 01.svg";
import Rabbit from "../../assets/img_unit2/imgs/Rabbit.svg";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import AudioWithCaption from "../AudioWithCaption";
import FourImagesWithAudio from "../FourImagesWithAudio";
import "./Unit10_Page2.css";
const Unit10_Page2 = ({ openPopup }) => {
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
    { start: 3.10, end: 6.10, text: "I love school. We open our books." },
    { start: 6.13, end: 10.06, text: "We make a line. We do many things." },
    { start: 10.09, end: 13.30, text: " My teacher plays songs. We listen." },
  ];

  return (
    <div className="unit6-page-background">
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
        className="headset-icon-CD-unit10-page2-1 hover:scale-110 transition"
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
              checkpoints={[0, 4.90, 7.14]}
              popupOpen={true}
              titleQ={`Listen, read, and repeat.`}
              audioArr={imageSounds2}
            />,
            false
          )
        }
        className="headset-icon-CD-unit10-page2-2 hover:scale-110 transition"
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
              checkpoints={[0, 4.0, 5.10, 6.09, 7.03]}
              popupOpen={true}
              titleQ={"Listen and read along."}
              audioArr={imageSounds}
            />,
            false
          )
        }
        className="click-icon-unit10-page2-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit10_Page2;
