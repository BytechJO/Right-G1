import page_5 from "../../../assets/unit3/imgs3/Right 1 Unit 03 Let's Go to School5.jpg";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg"
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../../assets/unit1/imgs/Page 01/Right Video Button.svg";
import "./Unit3_Page5.css";
import Unit3_Page5_Q1 from "./Unit3_Page5_Q1";
import Unit3_Page5_Q2 from "./Unit3_Page5_Q2";
import Unit3_Page5_Q3 from "./Unit3_Page5_Q3";
import Unit3_Page5_Q4 from "./Unit3_Page5_Q4";
const Unit3_Page5 = ({ openPopup }) => {
  return (
    <div className="unit2-page-background">
      <img src={page_5} />

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
           openPopup("exercise", { startIndex: 25 })
        }
        className="click-icon-unit3-page5-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
         openPopup("exercise", { startIndex: 26 })
        }
        className="click-icon-unit3-page5-2  hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup("exercise", { startIndex: 27 })
        }
        className="click-icon-unit3-page5-3 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup("exercise", { startIndex: 28 })
        }
        className="click-icon-unit3-page5-4 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit3_Page5;
