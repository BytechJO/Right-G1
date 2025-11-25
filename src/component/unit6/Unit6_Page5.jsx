import page_5 from "../../assets/unit6/imgs/Right G1- Class Book_00050.jpg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import "./Unit6_Page5.css";
import Unit6_Page5_Q1 from "./Unit6_Page5_Q1";
import Unit6_Page5_Q2 from "./Unit6_Page5_Q2";
import CD24_Pg26_Instructions1_AdultLady from "../../assets/unit3/sound3/CD24.Pg26_Instructions1_Adult Lady.mp3";
import Unit5_Page5_Q3 from "./Unit6_Page5_Q3";
import Unit5_Page5_Q4 from "./Unit6_Page5_Q4";
const Unit6_Page5 = ({ openPopup }) => {
  return (
    <div className="unit5-page-background">
      <img src={page_5} />

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              {/* <Unit6_Page5_Q1 /> */}
            </>,
            false
          )
        }
        className="click-icon-unit5-page5-1 hover:scale-110 transition"
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
              {/* <Unit6_Page5_Q2 /> */}
            </>,
            false
          )
        }
        className="click-icon-unit5-page5-2  hover:scale-110 transition"
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
              {/* <Unit5_Page5_Q3 /> */}
            </>,
            false
          )
        }
        className="click-icon-unit5-page5-3 hover:scale-110 transition"
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
              {/* <Unit5_Page5_Q4 /> */}
            </>,
            false
          )
        }
        className="click-icon-unit5-page5-4 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit6_Page5;
