import page_1 from "../../assets/unit9/imgs/Right G1- Class Book_00076.jpg";
import "./Unit9_Page1.css";
import Pg22_U3_Intro_AdultLady from "../../assets/unit5/sounds/U5P40-41.mp3";
import AudioWithCaption from "../AudioWithCaption";
import Unit9_Page1_find from "./Unit9_Page1_find";
import Unit9_Page1_Vocab from "./Unit9_Page1_Vocab";
import Unit9_Page1_Read from "./Unit9_Pag1_Read";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
const Unit9_Page1 = ({ openPopup }) => {
  const captionsExample = [
    { start: 0, end: 4.09, text: "Page 40, Unit 5: Welcome to My Class." },
    { start: 4.12, end: 7.26, text: "Page 40, Unit 5 Vocabulary: " },
    { start: 7.29, end: 10.13, text: "1.	Board." },
    { start: 10.17, end: 12.11, text: "2.	Map." },
    { start: 12.14, end: 14.21, text: "3.	Book." },
    { start: 14.24, end: 17.22, text: "4.	Globe. " },
    { start: 17.25, end: 20.02, text: "5.	Poster." },
    { start: 20.05, end: 22.17, text: "6.	trash bin." },
    { start: 22.20, end: 24.24, text: "7.	Desk." },
    { start: 24.27, end: 27.07, text: "8.	Chair." },
    { start: 27.10, end: 30.09, text: "Page 40. Listen and read along" },
    { start: 30.12, end: 34.24, text: "G, girl, green, garden. " },
    {
      start: 34.27,
      end: 49.80,
      text: "Page 41. The things on my desk. ",
    },
    {
      start: 49.83,
      end: 51.05,
      text: "Welcome to my class. This is my desk, this is my book, my eraser, and my pencil. My teacher's desk is there. There's a globe on it. I love my class. ",
    },
    {
      start: 51.08,
      end: 56.06,
      text: "Page 41. Listen, read, and repeat. ",
    },
    { start: 56.09, end: 57.29, text: "Do you like your class? " },
    { start: 57.32, end: 60.06, text: "I like my class. " },
    { start: 60.09, end: 64.16, text: "Page 41. Listen and read along. " },
    { start: 64.19, end: 68.18, text: "K, key, kite, kitchen..." },
  ];

  return (
    <div className="unit2-page-background">
      <img src={page_1} />
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
              <AudioWithCaption
                src={Pg22_U3_Intro_AdultLady}
                captions={captionsExample}
              />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit9-page1-1 hover:scale-110 transition"
      >
        <image href={audioBtn} x="0" y="0" width="90" height="90" />
      </svg>

      <svg
        width="30"
        height="30"
        viewBox="0 0 60 60"
        onClick={() =>
          openPopup(
            <>
              <Unit9_Page1_find />
            </>,
            false
          )
        }
        className="click-icon-unit9-page1-1  hover:scale-110 transition"
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
              <Unit9_Page1_Vocab />
            </>,
            false
          )
        }
        className="headset-icon-CD-unit9-page1-2 hover:scale-110 transition"
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
              <Unit9_Page1_Read />
            </>,
            false
          )
        }
        className="click-icon-unit9-page1-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit9_Page1;
