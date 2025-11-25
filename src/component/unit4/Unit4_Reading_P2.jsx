import React, {  useRef } from "react";
import page25 from "../../assets/unit4/imgs/Right G1- Class Book_00039.jpg";
// import "./Unit2_Page11.css";/
import { FaHeadphones } from "react-icons/fa";
import sound1 from "../../assets/unit4/sounds/Pg39_1.5_Adult Lady.mp3"
import sound2 from "../../assets/unit4/sounds/Pg39_1.6_Adult Lady.mp3"
import sound3 from "../../assets/unit4/sounds/Pg39_1.7_Adult Lady.mp3"
import sound4 from "../../assets/unit4/sounds/Pg39_1.8_Adult Lady.mp3"
const Unit4_Reading_P2 = () => {

  const audioRef = useRef(null);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    console.log("X%:", xPercent.toFixed(2), "Y%:", yPercent.toFixed(2));

    checkAreaAndPlaySound(xPercent, yPercent);
  };
  const clickableAreas = [
    { x1: 9.0, y1: 39.0, x2: 45.8, y2: 43.9, sound: sound1 },
    { x1: 49.0, y1: 39.2, x2: 85.4, y2: 43.1, sound: sound2 },
    { x1: 9.0, y1: 84.5, x2: 45.0, y2: 91.2, sound: sound3 },
    { x1: 49.0, y1: 84.5, x2: 86.5, y2: 91.0, sound: sound4 },
  ];

  const checkAreaAndPlaySound = (x, y) => {
    const area = clickableAreas.find(
      (a) => x >= a.x1 && x <= a.x2 && y >= a.y1 && y <= a.y2
    );

    console.log("Matched Area:", area);

    if (area) playSound(area.sound);
  };
  const playSound = (soundPath) => {
    console.log(soundPath);
    if (audioRef.current) {
      audioRef.current.src = soundPath;
      audioRef.current.play();
    }
  };
  return (
    <div className="page_2-background">
      <img
        src={page25}
        style={{ display: "block" }}
        onClick={handleImageClick}
      />

      {clickableAreas.map((area, index) => (
        <div
          key={index}
          className="clickable-area"
          style={{
            position: "absolute",
            left: `${area.x1}%`,
            top: `${area.y1}%`,
            width: `${area.x2 - area.x1}%`,
            height: `${area.y2 - area.y1}%`,
          }}
          onClick={() => playSound(area.sound)}
          onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
        ></div>
      ))}
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Unit4_Reading_P2;
