import React, { useState, useRef, useEffect } from "react";
import page_1 from "../../assets/unit4/imgs/Right 1 Unit 04 Wonderful Shapes and Colors.jpg";
import "./Unit4_Page1.css";
import { FaHeadphones } from "react-icons/fa";
import { PiCursorClickBold } from "react-icons/pi";
import CD2_Pg38_Reading1_AdultLady from "../../assets/unit4/sounds/U4P28-29.mp3";
import Popup from "../Popup/Popup";
import Unit4_Page1_Vocab from "./Unit4_Page1_Vocab";
import Unit4_Page1_find from "./Unit4_Page1_find";
import AudioWithCaption from "../AudioWithCaption";

import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import Unit4_Page1_Read from "./Unit4_Pag1_Read";
const Unit4_Page1 = ({ openPopup }) => {
  const [activePopup, setActivePopup] = useState(null);
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

  return (
    <div className="unit4-page-background" style={{ position: "relative" }}>
      <img src={page_1} style={{ position: "relative" }} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <AudioWithCaption
                src={CD2_Pg38_Reading1_AdultLady}
                captions={captionsExample}
              />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit4-page1-1 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit4_Page1_find />
            </>,
            false
          )
        }
        className="click-icon-unit4-page1-1  hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit4_Page1_Vocab />
            </>,
            false
          )
        }
        className="headset-icon-CD-unit4-page1-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() => openPopup(<>
        <Unit4_Page1_Read/>
        </>, false)}
        className="click-icon-unit4-page1-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit4_Page1;
