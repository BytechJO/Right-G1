import React, { useState } from "react";
import conversation from "../../assets/unit4/imgs/U4P36EXEA-01.svg";
import conversation2 from "../../assets/unit4/imgs/U4P36EXEA-02.svg";

import ValidationAlert from "../Popup/ValidationAlert";

const Review4_Page1_Q1 = () => {
  // ✅ الإحداثيات كلها نسب مئوية (نسبة من الصورة)
  const clickableAreas = [
    { x: 73, y: 10.5, w: 24.8, h: 11 },
    { x: 72, y: 52.5, w: 25.8, h: 11 },
    { x: 44, y: 52.5, w: 16.8, h: 11 }, // غيّري هاي الأرقام حسب ما بدك
  ];
  const correctAnswers = ["blue", "red", "is this"];
  const [inputs, setInputs] = useState(Array(clickableAreas.length).fill(""));

  const handleInputChange = (value, index) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
  };

  const handleCheck = () => {
    // 1️⃣ فحص الحقول الفارغة
    if (inputs.some((value) => value.trim() === "")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    // 2️⃣ مقارنة الإجابات
    const results = inputs.map((value, index) => {
      return value
        .trim()
        .toLowerCase()
        .includes(correctAnswers[index].toLowerCase());
    });

    const correctCount = results.filter((r) => r === true).length;
    const wrongCount = results.length - correctCount;

    let color =
      correctCount === results.length
        ? "green"
        : correctCount === 0
        ? "red"
        : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score:${correctCount}/${results.length}
      </span>
    </div>
  `;
    // 4️⃣ الحالات المختلفة
    if (correctCount === results.length) {
      ValidationAlert.success(scoreMessage);
    } else if (wrongCount === results.length) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    console.log(inputs);
    console.log(correctAnswers);
    console.log(results);
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
          A Look, read, and write.
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
            style={{
              inset: 0,
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
          />
          <img
            src={conversation2}
            style={{
              inset: 0,
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
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
