import page_6 from "../../assets/unit9/imgs/Right G1- Class Book_00081.jpg";
import "./Unit9_Page6.css";
// import Unit5_Page6_Q1 from "./Unit5_Page6_Q1";
// import Unit5_Page6_Q3 from "./Unit5_Page6_Q3";
import CD25_Pg27_Song_AdultLady from "../../assets/unit3/sound3/U3P27LetsSing.mp3";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import AudioWithCaption from "../AudioWithCaption";

const Unit9_Page6 = ({ openPopup }) => {
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
    <div className="unit2-page-background">
      <img src={page_6} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              {/* <Unit5_Page6_Q1 /> */}
            </>,
            false
          )
        }
        className="click-icon-unit9-page6-2 hover:scale-110 transition"
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
              {/* <Unit5_Page6_Q3 /> */}
            </>,
            false
          )
        }
        className="click-icon-unit9-page6-3  hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
      <svg
        width="30"
        height="30"
        viewBox="0 0 90 90"
        onClick={() =>
          openPopup(
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {/* <AudioWithCaption
                src={CD25_Pg27_Song_AdultLady}
                captions={captionsExample}
              /> */}
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit9-page6-1 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="90" height="90" />
      </svg>
    </div>
  );
};

export default Unit9_Page6;
