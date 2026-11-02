import page_6 from "../../../assets/unit10/imgs/Right 1 Unit 10 We Want Ice Cream6.jpg";
import "./Unit10_Page6.css";

import CD25_Pg27_Song_AdultLady from "../../../assets/unit10/sound/Pg87_Song_Adult Lady.mp3";

import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";

import AudioWithCaption from "../../AudioWithCaption";

const Unit10_Page6 = ({ openPopup }) => {
  const captionsExample = [
    {
      start: 0.459,
      end: 3.679,
      text: "I want ice cream.",
    },
    {
      start: 4.239,
      end: 5.46,
      text: "Do I want milk?",
    },
    {
      start: 5.699,
      end: 7.599,
      text: "No, I don't.",
    },
    {
      start: 8.279,
      end: 9.979,
      text: "Do I want bread?",
    },
    {
      start: 10.239,
      end: 13.699,
      text: "Yes, I do.",
    },
    {
      start: 14.099,
      end: 15.759,
      text: "How about you?",
    },
  ];

  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_6})` }}
    >
      {/* =====================================================
          EXERCISE 1
      ===================================================== */}

      <div
        className="click-icon-unit10-page6-1 hover:scale-110 transition"
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
              startIndex: 113,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              openPopup("exercise", {
                startIndex: 113,
              });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
      {/* =====================================================
          EXERCISE 2
      ===================================================== */}

      <div
        className="click-icon-unit10-page6-2 hover:scale-110 transition"
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
              startIndex: 114,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              openPopup("exercise", {
                startIndex: 114,
              });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>

      {/* =====================================================
          EXERCISE 3
      ===================================================== */}

      <div
        className="click-icon-unit10-page6-3 hover:scale-110 transition"
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
              startIndex: 115,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              openPopup("exercise", {
                startIndex: 115,
              });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
        >
          <image
            className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>

      {/* =====================================================
          SONG AUDIO
      ===================================================== */}

      <div
        className="headset-icon-CD-unit10-page6-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Play page 87 song with captions"
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
                  pageId="unit10-page87-song"
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
                    pageId="unit10-page87-song"
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
            className="svg-img"
            href={audioBtn}
            x="0"
            y="0"
            width="90"
            height="90"
          />
        </svg>
      </div>
    </div>
  );
};

export default Unit10_Page6;
