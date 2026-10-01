import React from "react";
import page from "../../../assets/U1 WB/U3/Pages/Right Int WB G1 U33.png";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import "./WB_Unit3_Page3.css";

const WB_Unit3_Page3 = ({ openPopup }) => {
  const handleKeyDown = (e, startIndex) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPopup("exercise", { startIndex });
    }
  };

  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page})` }}
    >
      <div
        className="wb-unit3-p3-q1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open workbook exercise 1"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 28,
            })
          }
          onKeyDown={(e) => handleKeyDown(e, 28)}
          style={{ overflow: "visible" }}
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

      <div
        className="wb-unit3-p3-q2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open workbook exercise 2"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 29,
            })
          }
          onKeyDown={(e) => handleKeyDown(e, 29)}
          style={{ overflow: "visible" }}
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
    </div>
  );
};

export default WB_Unit3_Page3;
