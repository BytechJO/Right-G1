import page_1 from "../../assets/unit4/imgs/Right 1 Unit 04 Wonderful Shapes and Colors.jpg";
import "./Unit4_Page1.css";
import CD2_Pg38_Reading1_AdultLady from "../../assets/unit4/sounds/U4P28-29.mp3";
import Unit4_Page1_Vocab from "./Unit4_Page1_Vocab";
import Unit4_Page1_find from "./Unit4_Page1_find";
import AudioWithCaption from "../AudioWithCaption";

import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import Unit4_Page1_Read from "./Unit4_Pag1_Read";
const Unit4_Page1 = ({ openPopup }) => {
  const captionsExample = [
    {
      start: 0,
      end: 4.3,
      text: "Page 28, unit 4. Wonderful shapes and colors.",
    },
    { start: 4.35, end: 8.29, text: "Page 28, unit 4 vocabulary. " },
    { start: 8.33, end: 11.05, text: "1.	brown. " },
    { start: 11.09, end: 13.05, text: "2.	blue. " },
    { start: 13.09, end: 15.24, text: "3.	yellow. " },
    { start: 15.27, end: 18.13, text: "4.	square. " },
    { start: 18.17, end: 21.0, text: "5.	rectangle." },
    { start: 21.04, end: 23.11, text: "6.	triangle. " },
    { start: 23.14, end: 25.27, text: "7.	red. " },
    { start: 25.30, end: 26.29, text: "8.	circle. " },
    { start: 26.33, end: 31.23, text: "Page 28, listen and read along. " },  
    {
      start: 31.27,
      end: 36.02,
      text: "F, feet, fish, fork. ",
    },
    { start: 36.06, end: 39.06, text: "Page 29, my picture. " },
    {
      start: 39.09,
      end:57.13,
      text: "This is a house. The roof is a triangle. The door is a square. The windows are circles. The frame is a rectangle. It is green, blue, brown and yellow. I like my picture. ",
    },
    { start: 57.17, end: 61.21, text: "Page 29. Listen, read and repeat. " },
    { start: 61.24, end: 63.25, text: "Look at Stella's picture." },
    {
      start: 63.28,
      end: 65.24,
      text: "It looks nice.",
    },
    { start: 65.27, end: 69.23, text: "Page 29. Listen and read along. " },
    { start: 69.27, end: 74.06, text: "V, van, vet, vest." },
  ];

  return (
    <div className="unit4-page-background" style={{ position: "relative" }}>
      <img src={page_1} style={{ position: "relative" }} />
      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <AudioWithCaption
                src={CD2_Pg38_Reading1_AdultLady}
                captions={captionsExample}
              />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit4-page1-1 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="60" height="60" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit4_Page1_find />
            </>,
            false
          )
        }
        className="click-icon-unit4-page1-1  hover:scale-110 transition"
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
              <Unit4_Page1_Vocab />
            </>,
            false
          )
        }
        className="headset-icon-CD-unit4-page1-2 hover:scale-110 transition"
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
              <Unit4_Page1_Read />
            </>,
            false
          )
        }
        className="click-icon-unit4-page1-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit4_Page1;
