import page_6 from "../../../assets/unit3/imgs3/right1-unit3-page6.jpg";
import "./Unit3_Page6.css";
import CD25_Pg27_Song_AdultLady from "../../../assets/unit3/sound3/U3P27LetsSing.mp3";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit3_Page6 = ({ openPopup }) => {
  const captionsExample = [
    { start: 0, end: 4.24, text: "Page 27, exercise G. Let's sing! " },
    {
      start: 4.27,
      end: 13.09,
      text: "One, two, open your book. Three, four, close your book. ",
    },
    {
      start: 13.12,
      end: 16.0,
      text: " Five, six, take out your pencil.",
    },
    {
      start: 16.04,
      end: 21.26,
      text: " Seven, eight, make a line. Nine, ten, listen, let's play.",
    },
  ];

  const handleExerciseKeyDown = (e, startIndex) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPopup("exercise", { startIndex });
    }
  };

  const openSongAudio = () => {
    openPopup(
      "audio",
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <AudioWithCaption
          src={CD25_Pg27_Song_AdultLady}
          captions={captionsExample}
          pageId="unit3-page27-song"
        />
      </div>,
    );
  };

  return (
    <div
      className="page1-img-wrapper"
      style={{
        backgroundImage: `url(${page_6})`,
      }}
    >
      <div
        className="click-icon-unit3-page6-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 29,
            })
          }
          onKeyDown={(e) => handleExerciseKeyDown(e, 30)}
          style={{ overflow: "visible" }}
        >
          <image
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            className="svg-img"
          />
        </svg>
      </div>
      {/* Exercise 1 */}
      <div
        className="click-icon-unit3-page6-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 30,
            })
          }
          onKeyDown={(e) => handleExerciseKeyDown(e, 29)}
          style={{ overflow: "visible" }}
        >
          <image
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            className="svg-img"
          />
        </svg>
      </div>

      {/* Exercise 2 */}
      <div
        className="click-icon-unit3-page6-3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 2"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 31,
            })
          }
          onKeyDown={(e) => handleExerciseKeyDown(e, 30)}
          style={{ overflow: "visible" }}
        >
          <image
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            className="svg-img"
          />
        </svg>
      </div>

      {/* Song Audio */}
      <div
        className="headset-icon-CD-unit3-page6-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open Let's sing audio"
          onClick={openSongAudio}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openSongAudio();
            }
          }}
          style={{ overflow: "visible" }}
        >
          <image
            href={audioBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            className="svg-img"
          />
        </svg>
      </div>
    </div>
  );
};

export default Unit3_Page6;
