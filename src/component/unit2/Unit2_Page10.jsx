import React, { useState } from "react";
import page_10 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday10.jpg";
import { FaHeadphones } from "react-icons/fa";
import { PiCursorClickBold } from "react-icons/pi";
import CD17_Pg19_Instruction1_AdultLady from "../../assets/img_unit2/sounds-unit2/CD17.Pg19.Instruction1_Adult Lady.mp3";
import CD18_Pg19_Instruction1_AdultLady from "../../assets/img_unit2/sounds-unit2/CD18.Pg19.Instruction2_Adult Lady.mp3";
import Popup from "../Popup/Popup";
import "./Unit2_Page10.css";
import Unit2_Page10_Q1 from "./Unit2_Page10_Q1";
import Unit2_Page10_Q3 from "./Unit2_Page10_Q3";
import Unit2_Page10_Q2 from "./Unit2_Page10_Q2";
import Unit2_Page10_Q4 from "./Unit2_Page10_Q4";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg"
import arrowBtn from "../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../assets/unit1/imgs/Page 01/Right Video Button.svg";
import AudioWithCaption from "../AudioWithCaption";

const Unit2_Page10 = ({ openPopup }) => {
  return (
    <div className="unit2-page-background">
      <img src={page_10} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit2_Page10_Q1 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page10-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      {/* <span
        className="headset-icon-CD-unit2-page10-1 shadow-md hover:scale-110 transition"
        onClick={() => setActivePopup(2)}
      >
        <FaHeadphones size={12} color="rgba(255, 255, 255, 1)" />
      </span>
      <Popup
        isOpen={activePopup === 2}
        onClose={() => setActivePopup(null)}
        children={
          <div style={{display:"flex" ,justifyContent:"center",alignContent:"center" }}>
            <audio controls>
              <source src={CD17_Pg19_Instruction1_AdultLady} type="audio/mp3" />
            </audio>
          </div>
        }
      /> */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit2_Page10_Q2 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page10-2 hover:scale-110 transition"
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
              <Unit2_Page10_Q3 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page10-3 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      {/* <span
        className="headset-icon-CD-unit2-page10-2 shadow-md hover:scale-110 transition"
        onClick={() => setActivePopup(5)}
      >
        <FaHeadphones size={12} color="rgba(255, 255, 255, 1)" />
      </span>
      <Popup
        isOpen={activePopup === 5}
        isAudio={true}
        onClose={() => setActivePopup(null)}
        children={
          <div style={{display:"flex" ,justifyContent:"center",alignContent:"center" }}>
            <audio controls>
              <source src={CD18_Pg19_Instruction1_AdultLady} type="audio/mp3" />
            </audio>
          </div>
        }
      /> */}

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit2_Page10_Q4 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page10-4  hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit2_Page10;
