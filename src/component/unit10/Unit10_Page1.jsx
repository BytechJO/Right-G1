import page_1 from "../../assets/unit10/imgs/Right G1- Class Book_00082.jpg";
import "./Unit10_Page1.css";
import Pg22_U3_Intro_AdultLady from "../../assets/unit6/sounds/CD3.Pg56_Reading1_Adult Lady.mp3";
import AudioWithCaption from "../AudioWithCaption";
import Unit10_Page1_find from "./Unit10_Page1_find";
import Unit10_Page1_Vocab from "./Unit10_Page1_Vocab";
import Unit10_Page1_Read from "./Unit10_Pag1_Read";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
const Unit10_Page1 = ({ openPopup }) => {
  const captionsExample = [
    { start: 0, end: 4.02, text: "Page 22, unit 3. Let's go to school. " },
    { start: 4.05, end: 7.11, text: "Page 22, unit 3 vocabulary. " },
    { start: 7.14, end: 9.24, text: "1.	numbers." },
    { start: 9.27, end: 12.16, text: "2.	close your book." },
    { start: 12.2, end: 15.12, text: "3.	open your book. " },
    { start: 15.15, end: 18.12, text: "4.	make a line. " },
    { start: 18.15, end: 21.06, text: "5.	listen. " },
    { start: 21.1, end: 23.25, text: "6.	quiet." },
    { start: 23.29, end: 27.16, text: "7.	take out your pencil. " },
    { start: 27.2, end: 31.15, text: "Page 22. Listen and read along." },
    { start: 31.19, end: 35.18, text: "Short A. Ant, pan, rat. " },
    { start: 35.21, end: 38.11, text: "Page 23, come and sing. " },
    {
      start: 38.15,
      end: 49.8,
      text: "I love school. We open our books. We make a line. We do many things. My teacher plays songs. We listen. ",
    },
    { start: 49.82, end: 53.01, text: "Page 23. Listen, read, and repeat. " },
    {
      start: 53.05,
      end: 56.26,
      text: "My favorite subject is science. ",
    },
    { start: 56.3, end: 59.18, text: "My favorite subject is art. " },
    { start: 59.21, end: 63.21, text: "Page 23. Listen and read along." },
    { start: 63.24, end: 67.26, text: "Short A. Bat, cap, dad." },
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
        className="headset-icon-CD-unit10-page1-1 hover:scale-110 transition"
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
              <Unit10_Page1_find />
            </>,
            false
          )
        }
        className="click-icon-unit10-page1-1  hover:scale-110 transition"
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
              <Unit10_Page1_Vocab />
            </>,
            false
          )
        }
        className="headset-icon-CD-unit10-page1-2 hover:scale-110 transition"
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
              <Unit10_Page1_Read />
            </>,
            false
          )
        }
        className="click-icon-unit10-page1-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit10_Page1;
