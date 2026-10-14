import React from "react";
import "./Writing_Page1.css";

import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import page_1 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream13.jpg";

import Writing_Page1_EX from "./Writing_Page1_EX";

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
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open writing activity"
          onClick={() => openPopup("html", <Writing_Page1_EX />)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              openPopup("html", <Writing_Page1_EX />);
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
    </div>
  );
};

export default Writing_Page1;
