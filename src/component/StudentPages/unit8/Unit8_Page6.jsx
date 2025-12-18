import page_6 from "../../../assets/unit8/imgs/Right 1 Unit 08 At the Soccer Match6.jpg";
import "./Unit8_Page6.css";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import song from "../../../assets/unit8/sound/CD65.Pg69_Song_Adult Lady.mp3"
import AudioWithCaption from "../../AudioWithCaption";
const Unit8_Page6 = ({ openPopup }) => {
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
    <div
      className="page1-img-wrapper"
      // onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_6})` }}
    >
      {/* <img src={page_6} /> */}

      <div
        className="click-icon-unit8-page6-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 60 60"
          style={{ overflow: "visible" }}
          onClick={() => openPopup("exercise", { startIndex: 83 })}
        >
          <image href={arrowBtn} x="0" y="0" width="60" height="60" />
        </svg>
      </div>

      <div
        className="click-icon-unit8-page6-3  hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 60 60"
          style={{ overflow: "visible" }}
          onClick={() => openPopup("exercise", { startIndex: 84 })}
        >
          <image href={arrowBtn} x="0" y="0" width="60" height="60" />
        </svg>
      </div>

      <div
        className="headset-icon-CD-unit8-page6-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 60 60"
          onClick={() =>
            openPopup(
              "audio",
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <AudioWithCaption src={song} captions={captionsExample} />
              </div>
            )
          }
          style={{ overflow: "visible" }}
        >
          <image href={audioBtn} x="0" y="0" width="60" height="60" />
        </svg>
      </div>
    </div>
  );
};

export default Unit8_Page6;
