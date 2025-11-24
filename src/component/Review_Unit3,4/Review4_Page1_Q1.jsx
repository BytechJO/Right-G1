import React, { useState } from "react";
import conversation from "../../assets/unit4/imgs/U4P36EXEA-01.svg";
import conversation2 from "../../assets/unit4/imgs/U4P36EXEA-02.svg";

import ValidationAlert from "../Popup/ValidationAlert";

const Review4_Page1_Q1 = () => {
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

  return (
    <div
      style={{
        display: "flex",
        marginTop: "30px",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "relative",
          width: "60%",
        }}
      >
        <h5 className="header-title-page8" id="ex-d">
          <span className="ex-A">D</span> Ask and answer.
        </h5>

        {/* ✅ الصورة هي المرجع */}
        <div
          style={{
            position: "relative",
            width: "100%",
            marginTop: "30px",
            maxWidth: "900px",
            aspectRatio: "3 / 1", // نسبة الصورة
          }}
        >
          <img
            src={conversation}
            // style={{
            //   position: "absolute",
            //   inset: 0,
            //   width: "100%",
            //   height: "100%",
            //   objectFit: "contain",
            // }}
          />
     <img
            src={conversation2}
            // style={{
            //   position: "absolute",
            //   inset: 0,
            //   width: "100%",
            //   height: "100%",
            //   objectFit: "contain",
            // }}
          />
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
                border: "2px solid black",
                borderRadius: "8px",
              }}
            />
          ))}
        </div>
      </div>
      {/* Buttons */}
      <div className="action-buttons-container">
        <button onClick={handleReset} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review4_Page1_Q1;
