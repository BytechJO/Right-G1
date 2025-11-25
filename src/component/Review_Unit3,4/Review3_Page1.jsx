
import page_1 from "../../assets/unit4/imgs/Right 1 Unit 04 Wonderful Shapes and Colors7.jpg";
import "./Review3_Page1.css";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import Review3_Page1_Q1 from "./Review3_Page1_Q1";
import Review3_Page1_Q2 from "./Review3_Page1_Q2";
import Review3_Page1_Q3 from "./Review3_Page1_Q3";

const Review3_Page1 = ({ openPopup }) => {
  const captionsExample = [
    { start: 0, end: 4.24, text: "Page 27, exercise G. Let's sing! " },
    {
      start: 4.27,
      end: 13.09,
      text: "One, two, open your book. Three, four, close your book. ",
    },
    { start: 13.12, end: 16.0, text: " Five, six, take out your pencil." },
    {
      start: 16.04,
      end: 21.26,
      text: " Seven, eight, make a line. Nine, ten, listen, let's play.",
    },
  ];
  return (
    <div className="review3-page1-background" style={{ position: "relative" }}>
      <img src={page_1} />

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Review3_Page1_Q1 />
            </>,
            false
          )
        }
        className="click-icon-review3-page1-2 hover:scale-110 transition"
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
              <Review3_Page1_Q2 />
            </>,
            false
          )
        }
        className="click-icon-review3-page1-3  hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 90 90"
        onClick={() =>
          openPopup(
            <>
              <Review3_Page1_Q3 />
            </>,
            false
          )
        }
        className="click-icon-review3-page1-1 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="90" height="90" />
      </svg>
    </div>
  );
};

export default Review3_Page1;
