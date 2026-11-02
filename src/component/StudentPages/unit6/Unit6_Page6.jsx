import page_6 from "../../../assets/unit6/imgs/Right 1 Unit 06 Can We Go to the Park6.jpg";
import "./Unit6_Page6.css";
import CD25_Pg27_Song_AdultLady from "../../../assets/unit6/sounds//U6P51Lets Sing.mp3";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import AudioWithCaption from "../../AudioWithCaption";

const Unit6_Page6 = ({ openPopup }) => {
  const captionsExample = [
    { start: 0, end: 4.11, text: "Page 51, exercise G. Let's sing." },
    {
      start: 4.15,
      end: 7.01,
      text: " I can swim. Yes, I can.",
    },
    {
      start: 7.05,
      end: 13.09,
      text: "I can climb. Yes, I can. I can do lots of things if I try.",
    },
    {
      start: 13.12,
      end: 21.17,
      text: "Let's go fly a kite. Let's go, you and I. Let's go, you and I.",
    },
  ];

  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_6})` }}
    >
       {/* Question 1 */}
      <div
        className="click-icon-unit6-page6-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() => openPopup("exercise", { startIndex: 61 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 61 });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
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
      {/* Question 2 */}
      <div
        className="click-icon-unit6-page6-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() => openPopup("exercise", { startIndex: 62 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 62 });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
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

      {/* Question 3 */}
      <div
        className="click-icon-unit6-page6-3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 2"
          onClick={() => openPopup("exercise", { startIndex: 63 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 63 });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
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
        className="headset-icon-CD-unit6-page6-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open Let's sing audio"
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
                <AudioWithCaption
                  src={CD25_Pg27_Song_AdultLady}
                  captions={captionsExample}
                  pageId="unit6-page51-song"
                />
              </div>,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

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
                    pageId="unit6-page51-song"
                  />
                </div>,
              );
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
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

export default Unit6_Page6;
