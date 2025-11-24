import React, { useState } from "react";
import page_6 from "../../assets/unit4/imgs/Right 1 Unit 04 Wonderful Shapes and Colors6.jpg";
import { FaHeadphones } from "react-icons/fa";
import { PiCursorClickBold } from "react-icons/pi";
import Popup from "../Popup/Popup";
import "./Unit4_Page6.css";
import song from "../../assets/unit4/sounds/U4P33Song.mp3";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import AudioWithCaption from "../AudioWithCaption";
import Unit4_Page6_Q2 from "./Unit4_Page6_Q2";
const Unit4_Page6 = ({ openPopup }) => {
  const captionsExample = [
    { start: 0, end: 4.24, text: "Page 27, exercise G. Let's sing! " },
    {
      start: 4.27,
      end: 13.09,
      text: "One, two, open your book. Three, four, close your book. ",
    },
    { start: 13.12, end: 16.0, text: " Five, six, take out your pencil." },
    {
      start: 16.04,
      end: 21.26,
      text: " Seven, eight, make a line. Nine, ten, listen, let's play.",
    },
  ];
  return (
    <div className="unit4-page-background" style={{ position: "relative" }}>
      <img src={page_6} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit4_Page6_Q2 />
            </>,
            false
          )
        }
        className="click-icon-unit4-page6-3  hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
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
              <AudioWithCaption src={song} captions={captionsExample} />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit4-page6-1 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="90" height="90" />
      </svg>
    </div>
  );
};

export default Unit4_Page6;
