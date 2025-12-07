import { useRef } from "react";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg";
import "./FlashCardViewer.css";
import AudioWithCaption from "../AudioWithCaption";
export default function FlashCardViewer({ card, openPopup }) {
  const audioRef = useRef(null);

  return (
 <div className="flashcard-wrapper">
  <img
    src={card.img}
    alt="flash"
    className="w-[350px] h-auto rounded-xl shadow-lg"
  />

  {card.audio && (
    <div
      className="audio-btn-wrapper"
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
            <AudioWithCaption src={card.audio} />
          </div>
        )
      }
    >
      <svg width="22" height="22" viewBox="0 0 90 90">
        <image
          href={audioBtn}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </div>
  )}
</div>

  );
}
