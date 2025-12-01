import React, { useState, useEffect, useRef } from "react";
import page_5 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday5.jpg";
import "./Unit2_Page5.css";
import Unit2_Page5_Q1 from "./Unit2_Page5_Q1";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg"
import arrowBtn from "../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../assets/unit1/imgs/Page 01/Right Video Button.svg";
import Unit2_Page5_Q2 from "./Unit2_Page5_Q2";
import Unit2_Page5_Q3 from "./Unit2_Page5_Q3";
import Unit2_Page5_Q4 from "./Unit2_Page5_Q4";
const Unit2_Page5 = ({ openPopup }) => {
  return (
    <div className="unit2-page-background">
      <img src={page_5} />

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit2_Page5_Q1 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page5-1 hover:scale-110 transition"
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
              <Unit2_Page5_Q2 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page5-2 hover:scale-110 transition"
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
              <Unit2_Page5_Q3 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page5-3 hover:scale-110 transition"
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
              <Unit2_Page5_Q4 />
            </>,
            false
          )
        }
        className="click-icon-unit2-page5-4 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit2_Page5;
