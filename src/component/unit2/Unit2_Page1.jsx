import page_1 from "../../assets/img_unit2/imgs/Right 1 Unit 02 Stell Birthday.jpg";
import "./Unit2_Page1.css";
import unit2_page1_CD8 from "../../assets/img_unit2/sounds-unit2/CD8.Pg10_U2.Intro_Adult Lady.mp3";
import Unit2_Page1_find from "./Unit2_Page1_find";
import Unit2_Page1_Vocab from "./Unit2_Page1_Vocab";
import Unit2_Page1_Read from "./Unit2_Pag1_Read";
import AudioWithCaption from "../AudioWithCaption";
import audioBtn from "../../assets/unit1/imgs/Right Audio Button 2.svg";
import arrowBtn from "../../assets/unit1/imgs/Right Arrow Button ....-01.svg";
import allUnit2 from "../../assets/unit1/sounds";
const Unit2_Page1 = ({ openPopup }) => {
  const captionsExample = [
    { start: 0, end: 4.25, text: " Page 10, Unit 2, Stella's Birthday. " },
    { start: 4.3, end: 6.0, text: "Page 10, Unit 2, Vocabulary." },
    { start: 6.01, end: 8.16, text: " 1. Party Hat. " },
    { start: 8.2, end: 10.26, text: "2. Jello." },
    { start: 10.3, end: 13.28, text: "3. Cake. " },
    { start: 13.33, end: 16.08, text: "4. Happy Birthday." },
    { start: 16.12, end: 18.25, text: " 5. Balloons." },
    { start: 18.3, end: 21.12, text: " 6. Present. " },
    { start: 21.15, end: 25.05, text: "7. Hi, everyone. " },
    {
      start: 25.1,
      end: 26.05,
      text: "Today is my birthday. I'm seven years old. My friends are here. It's fun. ",
    },
    {
      start: 26.1,
      end: 36.21,
      text: "What's your name? My name is Lolo. ",
    },
    { start: 36.27, end: 40.17, text: "Page 11. Listen and read along. " },
    { start: 40.2, end: 42.05, text: "P, pencil, pink, pizza. " },
  ];

  /**
   
 

 










  
   */
  return (
    <div className="unit2-page-background">
      <img src={page_1} />

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
              <AudioWithCaption src={allUnit2} captions={captionsExample} />
            </div>,
            true
          )
        }
        className="headset-icon-CD-unit2-page1-1 hover:scale-110 transition"
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
              <Unit2_Page1_find />
            </>,
            false
          )
        }
        className="click-icon-unit2-page1-1 hover:scale-110 transition"
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
              <Unit2_Page1_Vocab />
            </>,
            false
          )
        }
        className="headset-icon-CD-unit2-page1-2 hover:scale-110 transition"
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
              <Unit2_Page1_Read />
            </>,
            false
          )
        }
        className="click-icon-unit2-page1-2 hover:scale-110 transition"
      >
        <image href={arrowBtn} x="0" y="0" width="60" height="60" />
      </svg>
    </div>
  );
};

export default Unit2_Page1;
