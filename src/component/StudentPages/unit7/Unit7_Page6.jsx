import page_6 from "../../../assets/unit7/img/Right 1 Unit 07 What are Matter6.jpg";
import "./Unit7_Page6.css";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import song from "../../../assets/unit7/sound/U7P63EXEG.mp3";
import AudioWithCaption from "../../AudioWithCaption";

const Unit7_Page6 = ({ openPopup }) => {
  const captionsExample = [
    { start: 0, end: 4.19, text: " Page 63, exercise G. Let's sing. " },
    {
      start: 4.27,
      end: 6.77,
      text: "What's the matter? ",
    },
    { start: 6.8, end: 10.25, text: "What's the matter? " },
    {
      start: 10.3,
      end: 13.19,
      text: "Are you sad? ",
    },
    { start: 13.25, end: 16.35, text: "No, I'm not. " },
    {
      start: 16.4,
      end: 22.21,
      text: "I'm happy! I'm happy! ",
    },
    { start: 22.3, end: 25.87, text: "Are you happy? " },
    {
      start: 25.9,
      end: 29.21,
      text: "Be happy too.",
    },
  ];

  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_6})` }}
    >
      {/* Question 1 */}
      <div
        className="click-icon-unit7-page6-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() => openPopup("exercise", { startIndex: 80 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 80 });
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
        className="click-icon-unit7-page6-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() => openPopup("exercise", { startIndex: 81 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 81 });
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
        className="click-icon-unit7-page6-3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 2"
          onClick={() => openPopup("exercise", { startIndex: 82 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 82 });
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

      {/* Song */}
      <div
        className="headset-icon-CD-unit7-page6-1 hover:scale-110 transition"
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
                  src={song}
                  captions={captionsExample}
                  pageId="unit7-page63-song"
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
                    src={song}
                    captions={captionsExample}
                    pageId="unit7-page63-song"
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

export default Unit7_Page6;
