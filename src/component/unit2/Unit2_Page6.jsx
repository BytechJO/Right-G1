import React, { useState } from "react";
import page_6 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday6.jpg";
import song from "../../assets/img_unit2/sounds-unit2/Pg15.Sing_Adult Lady.mp3";
import "./Unit2_Page6.css";
import Unit2_Page6_Q1 from "./Unit2_Page6_Q1";
import Unit2_Page6_Q2 from "./Unit2_Page6_Q2";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg"
import arrowBtn from "../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../assets/unit1/imgs/Page 01/Right Video Button.svg";
import AudioWithCaption from "../AudioWithCaption";

const Unit2_Page6 = ({ openPopup }) => {
   const captionsExample = [
    { start: 0, end: 1, text: "Hello!" },
    { start: 1, end: 2.2, text: "My name is Tom." },
    { start: 2.2, end: 4, text: "I like apples." },
  ];
  return (
    <div className="unit2-page-background">
      <img src={page_6} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit2_Page6_Q1 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page6-1 hover:scale-110 transition"
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
        className="headset-icon-CD-unit2-page6-2 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="90" height="90" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit2_Page6_Q2 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page6-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit2_Page6;
