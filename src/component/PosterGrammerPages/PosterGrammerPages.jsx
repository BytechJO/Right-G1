import { useRef } from "react";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg";

export default function PosterViewer({ poster, openPopup }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">

      {/* 🔥 الصورة العريضة */}
      <img
        src={poster.img}
        alt="poster"
        className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-lg"
      />

      {/* 🔊 زر الصوت داخل popup */}
      {poster.audio && (
        <button
          className="hover:scale-110 transition"
          onClick={() =>
            openPopup(
              "audio",
              <div style={{ textAlign: "center", padding: "20px" }}>
                <audio controls autoPlay style={{ width: "250px" }}>
                  <source src={poster.audio} type="audio/mp3" />
                </audio>
              </div>
            )
          }
        >
          <img src={audioBtn} alt="audio" className="w-10 h-10" />
        </button>
      )}

    </div>
  );
}
