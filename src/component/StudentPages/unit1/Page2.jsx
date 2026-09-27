import React, { useRef, useState, useEffect } from "react";
import page2 from "../../../assets/unit1/imgs/Pages/Right 1 Unit 01 Good Morning World 2_page-0002.jpg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";

// غيّر المسارات حسب مكان الأصوات عندك
import unit1Audio from "../../../assets/unit1/Page 2/Good Morning, World!.mp3";
import unit2Audio from "../../../assets/unit1/Page 2/Stella's birthday!.mp3";
import unit3Audio from "../../../assets/unit1/Page 2/Let's Go to School.mp3";
import unit4Audio from "../../../assets/unit1/Page 2/Wonderful Shapes and colors.mp3";
import unit5Audio from "../../../assets/unit1/Page 2/Welcome to my class.mp3";

const Page2 = ({ goToUnit }) => {
  const imgRef = useRef(null);
  const audioRef = useRef(null);

  const [playingUnit, setPlayingUnit] = useState(null);

  const clickableAreas = [
    {
      title: "Unit 1",
      startIndex: 4,
      audio: unit1Audio,
      top: "9.5%",
      left: "20%",
      width: "23%",
      height: "3%",
      arrowTop: "9.5%",
      arrowLeft: "44%",
    },
    {
      title: "Unit 2",
      startIndex: 10,
      audio: unit2Audio,

      top: "27.5%",
      left: "20%",
      width: "17%",
      height: "3%",

      arrowTop: "27.5%",
      arrowLeft: "38%",
    },
    {
      title: "Unit 3",
      startIndex: 22,
      audio: unit3Audio,

      top: "45%",
      left: "19%",
      width: "20%",
      height: "3%",

      arrowTop: "45%",
      arrowLeft: "39%",
    },
    {
      title: "Unit 4",
      startIndex: 28,
      audio: unit4Audio,

      top: "63%",
      left: "20%",
      width: "30%",
      height: "3%",

      arrowTop: "63%",
      arrowLeft: "51%",
    },
    {
      title: "Unit 5",
      startIndex: 40,
      audio: unit5Audio,

      top: "80.5%",
      left: "19%",
      width: "24%",
      height: "3%",

      arrowTop: "80.5%",
      arrowLeft: "43.5%",
    },
  ];

  const playUnitAudio = (area) => {
    // إذا في صوت شغال، وقفه أول
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(area.audio);

    audioRef.current = audio;
    setPlayingUnit(area.title);

    audio.play();

    audio.onended = () => {
      setPlayingUnit(null);
    };
  };

  const handleGoToUnit = (area) => {
    // وقف الصوت قبل الانتقال للوحدة
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingUnit(null);

    goToUnit(area.startIndex);
  };

  // لو طلع المستخدم من الصفحة، وقف الصوت
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div
      className="page1-img-wrapper"
      ref={imgRef}
      style={{
        backgroundImage: `url(${page2})`,
        position: "relative",
      }}
    >
      {clickableAreas.map((area, index) => (
        <React.Fragment key={index}>
          {/* =========================
              UNIT AUDIO AREA
          ========================== */}
          <button
            type="button"
            onClick={() => playUnitAudio(area)}
            aria-label={`Play ${area.title} audio`}
            aria-pressed={playingUnit === area.title}
            className={`absolute cursor-pointer transition-all duration-150
              ${
                playingUnit === area.title
                  ? "ring-4 ring-green-500"
                  : "hover:ring-2 hover:ring-blue-400"
              }
            `}
            style={{
              top: area.top,
              left: area.left,
              width: area.width,
              height: area.height,
              background: "transparent",
              border: "none",
              borderRadius: "8px",
            }}
          >
            {playingUnit === area.title && (
              <span
                style={{
                  position: "absolute",
                  top: "-25px",
                  left: "0",
                  background: "#16a34a",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                🔊 Playing
              </span>
            )}
          </button>

          {/* =========================
              NAVIGATION ARROW
          ========================== */}
          <button
            type="button"
            onClick={() => handleGoToUnit(area)}
            aria-label={`Go to ${area.title}`}
            className="
    absolute z-20
    flex items-center justify-center
    p-0
    bg-transparent
    border-0
    cursor-pointer
    transition-all duration-150
    hover:scale-110
    active:scale-95
    rounded-full
    focus:outline-none
  "
            style={{
              top: area.arrowTop,
              left: area.arrowLeft,

              width: "18px",
              height: "18px",
              minWidth: "18px",
              minHeight: "18px",
              maxWidth: "18px",
              maxHeight: "18px",

              padding: 0,
            }}
          >
            <img
              src={arrowBtn}
              alt=""
              className="w-full h-full object-contain pointer-events-none"
            />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Page2;
