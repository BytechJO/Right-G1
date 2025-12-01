import React, { useState } from "react";
import page_7 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday7.jpg";
import { FaHeadphones } from "react-icons/fa";
import { PiCursorClickBold } from "react-icons/pi";
import Popup from "../Popup/Popup";
import "./Unit2_Page7.css";
import Unit2_Page7_Q2 from "./Unit2_Page7_Q2";
import Unit2_Page7_Q1 from "./Unit2_Page7_Q1";
import Unit2_Page7_Q3 from "./Unit2_Page7_Q3";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg"
import arrowBtn from "../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../assets/unit1/imgs/Page 01/Right Video Button.svg";
import AudioWithCaption from "../AudioWithCaption";

const Unit2_Page7 = ({ openPopup }) => {
  const [activePopup, setActivePopup] = useState(null);
  return (
    <div className="unit2-page-background">
      <img src={page_7} />

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit2_Page7_Q1 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page7-1 hover:scale-110 transition"
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
              <Unit2_Page7_Q2 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page7-2 hover:scale-110 transition"
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
              <Unit2_Page7_Q3 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page7-3 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit2_Page7;
