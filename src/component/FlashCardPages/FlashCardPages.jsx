import { useRef } from "react";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg";
export default function FlashCardViewer({ card, openPopup }) {
  const audioRef = useRef(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={card.img}
        alt="flash"
        className="w-[350px] h-auto rounded-xl shadow-lg"
      />

      {card.audio && (
         <div
          className="headset-icon-CD-page4-1 hover:scale-110 transition"
          style={{ overflow: "visible" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 90 90"
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
                 
                </div>
              )
            }
            style={{ overflow: "visible" }}
          >
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

      <audio ref={audioRef} src={card.audio} />
    </div>
  );
}
