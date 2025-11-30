import React, { useState } from "react";
import page_2 from "../../assets/unit8/imgs/Right G1- Class Book_00073.jpg";
import { FaHeadphones } from "react-icons/fa";
import { PiCursorClickBold } from "react-icons/pi";
import Popup from "../Popup/Popup";
import "./Review8_Page2.css";
import song from "../../assets/unit4/sounds/Pg33_Song_Adult Lady.mp3";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import AudioWithCaption from "../AudioWithCaption";
// import Review6_Page2_Q2 from "./Review6_Page2_Q2";
// import Review6_Page2_Q3 from "./Review6_Page2_Q3";
// import Review6_Page2_Q1 from "./Review6_Page2_Q1";
const Review8_Page2 = ({ openPopup }) => {
  return (
    <div className="review6-page2-background" style={{ position: "relative" }}>
      <img src={page_2} />

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() => openPopup(<>{/* <Review6_Page2_Q1 /> */}</>, false)}
        className="click-icon-review6-page2-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() => openPopup(<>{/* <Review6_Page2_Q2 /> */}</>, false)}
        className="click-icon-review6-page2-3  hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 90 90"
        onClick={() => openPopup(<>{/* <Review6_Page2_Q3/> */}</>)}
        className="click-icon-review6-page2-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="90" height="90" />
      </svg>
    </div>
  );
};

export default Review8_Page2;
