import React, { useState } from "react";
import page_8 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday8.jpg";
import { FaHeadphones } from "react-icons/fa";
import { PiCursorClickBold } from "react-icons/pi";
import "./Unit2_Page8.css";
import CD16_Pg17_Instruction1_AdultLady from "../../assets/img_unit2/sounds-unit2/CD16.Pg17.Instruction1_Adult Lady.mp3";
import Popup from "../Popup/Popup";
import Unit2_Page8_Q1 from "./Unit2_Page8_Q1";
import Unit2_Page8_Q3 from "./Unit2_Page8_Q3";
import Unit2_Page8_Q2 from "./Unit2_Page8_Q2";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg"
import arrowBtn from "../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../assets/unit1/imgs/Page 01/Right Video Button.svg";
import AudioWithCaption from "../AudioWithCaption";

const Unit2_Page8 = ({ openPopup }) => {
  const [activePopup, setActivePopup] = useState(null);
  return (
    <div className="unit2-page-background">
      <img src={page_8} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit2_Page8_Q1 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page8-1 hover:scale-110 transition"
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
              <Unit2_Page8_Q2 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page8-2 hover:scale-110 transition"
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
              <Unit2_Page8_Q3 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page8-3 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit2_Page8;
