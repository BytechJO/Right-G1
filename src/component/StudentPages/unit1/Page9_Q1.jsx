import React, { useRef, useState } from "react";
import conversation from "../../../assets/unit1/imgs/Ask and answer.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import helloImSound from "../../../assets/unit1/Page 9 - D/helloIm.mp3";
import howAreYouSound from "../../../assets/unit1/Page 9 - D/How are you.mp3";
import helloSound from "../../../assets/unit1/Page 9 - D/Hello.mp3";
import fineThankYouSound from "../../../assets/unit1/Page 9 - D/fineThankYou.mp3";
import ExerciseHeader from "../../ExerciseHeader";
const Page9_Q1 = () => {
  const audioRef = useRef(null);
  const [playingArea, setPlayingArea] = useState(null);
  const playAudio = (area, index) => {
    if (!area.sound || !audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = area.sound;

    setPlayingArea(index);

    audioRef.current.play();

    audioRef.current.onended = () => {
      setPlayingArea(null);
    };
  };
  // ✅ الإحداثيات كلها نسب مئوية (نسبة من الصورة)
  const clickableAreas = [
    { x: 14, y: 7.5, w: 27.8, h: 10 }, // غيّري هاي الأرقام حسب ما بدك
  ];

  const [inputs, setInputs] = useState(Array(clickableAreas.length).fill(""));

  const handleInputChange = (value, index) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
  };

  const handleCheck = () => {
    if (inputs.some((value) => value.trim() === "")) {
      ValidationAlert.info();
      return;
    }
    let scoreMessage = ``;
    ValidationAlert.success(scoreMessage);
  };

  const handleReset = () => {
    setInputs(Array(clickableAreas.length).fill(""));
  };
  const audioAreas = [
    {
      x: 1,
      y: 7,
      w: 13,
      h: 12,
      sound: helloImSound,
      label: "Hello, I'm",
    },
    {
      x: 77,
      y: 7,
      w: 12,
      h: 12,
      sound: helloSound,
      label: "Hello.",
    },
    {
      x: 1,
      y: 51,
      w: 20,
      h: 12,
      sound: howAreYouSound,
      label: "How are you?",
    },
    {
      x: 77,
      y: 51,
      w: 22,
      h: 12,
      sound: fineThankYouSound,
      label: "Fine, thank you.",
    },
  ];
  return (
    <div
      className="page8-wrapper"
      style={{
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          gap: "120px",
        }}
      >
        <ExerciseHeader
          sectionLetter="D"
          title="Ask and answer."
          subTitle="Type your name in the blank, then read the complete dialogue aloud."
        />
        <audio ref={audioRef} style={{ display: "none" }} />
        {/* ✅ الصورة هي المرجع */}
        <div
          className="content-container-unit1-p9-q1"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "900px",
            aspectRatio: "3 / 1", // نسبة الصورة
          }}
        >
          <img
            src={conversation}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          {audioAreas.map((area, index) => (
            <button
              key={index}
              type="button"
              onClick={() => playAudio(area, index)}
              aria-label={`Play ${area.label} audio`}
              aria-pressed={playingArea === index}
              style={{
                position: "absolute",
                top: `${area.y}%`,
                left: `${area.x}%`,
                width: `${area.w}%`,
                height: `${area.h}%`,
                cursor: "pointer",
                zIndex: 2,
                background: "transparent",
                border:
                  playingArea === index
                    ? "3px solid #16a34a"
                    : "2px solid transparent",
                borderRadius: "8px",
                padding: 0,
              }}
            >
              {playingArea === index && (
                <span
                  style={{
                    position: "absolute",
                    top: "-28px",
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
          ))}
          {clickableAreas.map((area, index) => (
            <input
              key={index}
              value={inputs[index]}
              onChange={(e) => handleInputChange(e.target.value, index)}
              style={{
                position: "absolute",
                top: `${area.y}%`,
                left: `${area.x}%`,
                width: `${area.w}%`,
                height: `${area.h}%`,
                fontSize: "1.3vw",
                borderBottom: "2px solid black",
                // borderRadius:"8px"
              }}
            />
          ))}
        </div>
      </div>
      {/* Buttons */}
      <div className="action-buttons-container">
        <button
          onClick={handleReset}
          className="try-again-button"
          title="Start again"
        >
          Start Again ↻
        </button>
        {/* 
        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button> */}
      </div>
    </div>
  );
};

export default Page9_Q1;
