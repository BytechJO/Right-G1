import React from "react";
import page from "../../../assets/U1 WB/U6/Right Int WB G1 U66.png";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import "./WB_Unit6_Page6.css";

const WB_Unit6_Page6 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page})` }}
    >
      {/* Question 1 */}
      <div
        className="wb-unit6-p6-q1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() => openPopup("exercise", { startIndex: 73 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 73 });
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
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>

      {/* Question 2 */}
      <div
        className="wb-unit6-p6-q2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 2"
          onClick={() => openPopup("exercise", { startIndex: 74 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 74 });
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
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>

      {/* Question 3 - currently disabled */}
      {/*
      <div
        className="wb-unit6-p6-q3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        ...
      </div>
      */}
    </div>
  );
};

export default WB_Unit6_Page6;
