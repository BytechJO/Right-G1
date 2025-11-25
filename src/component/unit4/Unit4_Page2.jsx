import React, { useState, useEffect, useRef } from "react";
import page_2 from "../../assets/unit4/imgs/Right 1 Unit 04 Wonderful Shapes and Colors2.jpg";
import { FaHeadphones } from "react-icons/fa";
import { PiCursorClickBold } from "react-icons/pi";
import Popup from "../Popup/Popup";
import soundMyPicture from "../../assets/unit4/sounds/U4P29 My Picture.mp3";
import soundListen from "../../assets/unit4/sounds/U4P29 listen read repeat.mp3";
import Pg29_1_1_Bebo from "../../assets/unit4/sounds/Pg29_1.1_Bebo.mp3";
import Pg29_1_1_Tom from "../../assets/unit4/sounds/Pg29_1.1_Tom.mp3";
import Pg29_1_2_Lolo from "../../assets/unit4/sounds/Pg29_1.2_Lolo.mp3";
import Pg29_2_1_AdultLady from "../../assets/unit4/sounds/Pg29_2.1_Adult Lady.mp3";
import Pg29_2_2_AdultLady from "../../assets/unit4/sounds/Pg29_2.2_Adult Lady.mp3";
import Pg29_2_3_AdultLady from "../../assets/unit4/sounds/Pg29_2.3_Adult Lady.mp3";
import Pg29_2_4_AdultLady from "../../assets/unit4/sounds/Pg29_2.4_Adult Lady.mp3";
import img1 from "../../assets/unit4/imgs/V.svg";
import img2 from "../../assets/unit4/imgs/van.svg";
import img3 from "../../assets/unit4/imgs/vet.svg";
import img4 from "../../assets/unit4/imgs/vest.svg";
import CD28Pg29_Instruction1_AdultLady from "../../assets/unit4/sounds/U4P29 Listen and read along.mp3";
import repeat1 from "../../assets/unit4/imgs/listen and repeat 02.svg";
import repeat2 from "../../assets/unit4/imgs/listen and repeat 03.svg";
import read from "../../assets/unit1/imgs/P1 listen and repeat 01.svg";
import Rabbit from "../../assets/img_unit2/imgs/Rabbit.svg";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import AudioWithCaption from "../AudioWithCaption";
import FourImagesWithAudio from "../FourImagesWithAudio";
import "./Unit4_Page2.css";
const Unit4_Page2 = ({ openPopup }) => {
  const [activePopup, setActivePopup] = useState(null);
  const activeData = [
    {
      page: "1",
      title: "Birthdays Are Fun",
      sound: soundMyPicture,
      imgSrc: "",
    },
    {
      page: "2",
      title: "Lesiten, Read and repeat",
      sound: soundListen,
      imgSrc: "Lolo_bebo",
    },
    {
      page: "3",
      title: "Lestine and read along",
      sound: CD28Pg29_Instruction1_AdultLady,
      imgSrc: "readImg",
    },
  ];
  // أصوات الصور
  const imageSounds = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(Pg29_2_1_AdultLady),
    new Audio(Pg29_2_2_AdultLady),
    new Audio(Pg29_2_3_AdultLady),
    new Audio(Pg29_2_4_AdultLady),
  ];
  const imageSounds2 = [
    null, // الصورة الأولى الكبيرة (إن ما بدك صوت إلها)
    new Audio(Pg29_1_1_Bebo),
    new Audio(Pg29_1_2_Lolo),
  ];
  const captionsExample = [
    { start: 0, end: 3.10, text: "Page 29, my picture. " },
    {
      start: 3.13,
      end: 7.13,
      text: "This is a house. The roof is a triangle.",
    },
    {
      start: 7.17,
      end: 12.25,
      text: " The door is a square. The windows are circles.",
    },
    { start: 12.28, end: 15.12, text: " The frame is a rectangle." },
    { start: 15.15, end: 19.15, text: " It is green, blue, brown and yellow." },
    { start: 19.18, end: 21.17, text: "I like my picture. " },
  ];

  return (
    <div className="unit4-page-background" style={{ position: "relative" }}>
      <img src={page_2} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 90 90"
        onClick={() =>
          openPopup(
            <AudioWithCaption
              src={soundMyPicture}
              captions={captionsExample}
            />,
            true
          )
        }
        className="headset-icon-CD-unit4-page2-1 hover:scale-110 transition"
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
              checkpoints={[0, 4.6, 6.21]}
              popupOpen={true}
              titleQ={`Listen, read, and repeat.`}
              audioArr={imageSounds2}
            />,
            false
          )
        }
        className="headset-icon-CD-unit4-page2-2 hover:scale-110 transition"
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
              images={[Rabbit, img1, img2, img3, img4]}
              audioSrc={CD28Pg29_Instruction1_AdultLady}
              checkpoints={[0, 4.05, 5.1, 6.13, 7.03]}
              popupOpen={true}
              titleQ={"Listen and read along."}
              audioArr={imageSounds}
            />,
            false
          )
        }
        className="click-icon-unit4-page2-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="90" height="90" />
      </svg>
    </div>
  );
};

export default Unit4_Page2;
