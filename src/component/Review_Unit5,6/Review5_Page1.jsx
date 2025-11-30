import page_1 from "../../assets/unit6/imgs/Right 1 Unit 06 Can We Go to the Park7.jpg";
import "./Review5_Page1.css";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import Review5_Page1_Q1 from "./Review5_Page1_Q1";
import Review5_Page1_Q2 from "./Review5_Page1_Q2";
import Review5_Page1_Q3 from "./Review5_Page1_Q3";

const Review5_Page1 = ({ openPopup }) => {
  return (
    <div className="review5-page1-background" style={{ position: "relative" }}>
      <img src={page_1} />

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
         <Review5_Page1_Q1/>
            </>,
            false
          )
        }
        className="click-icon-review5-page1-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() => openPopup(<>
        <Review5_Page1_Q2 />
        </>, false)}
        className="click-icon-review5-page1-3  hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 90 90"
        onClick={() => openPopup(<>
        <Review5_Page1_Q3 />
        </>, false)}
        className="click-icon-review5-page1-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="90" height="90" />
      </svg>
    </div>
  );
};

export default Review5_Page1;
