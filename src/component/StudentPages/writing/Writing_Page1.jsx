import React from "react";
import "./Writing_Page1.css";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";

import page_1 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream13.jpg";
import Writing_Page1_EX from "./Writing_Page1_ex";
const Writing_Page1 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_1})` }}
    >
      <div
        className="click-icon-writing-page hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 60 60"
          style={{ overflow: "visible" }}
          onClick={() => openPopup("html", <Writing_Page1_EX />)}
        >
          <image href={arrowBtn} x="0" y="0" width="60" height="60" />
        </svg>
      </div>
    </div>
  );
};

export default Writing_Page1;
