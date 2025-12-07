import React, { useRef, useState, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page7_Q1.css";

export default function WB_Unit1_Page7_Q1() {
  // 🎨 ألوان الكلمات
  const colors = ["red", "blue", "green", "orange", "purple", "yellow"];
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [wordColors, setWordColors] = useState([
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
  ]);

  const handleWordClick = (index) => {
    setSelectedWordIndex(index);
  };

  const applyColor = (color) => {
    const newColors = [...wordColors];
    newColors[selectedWordIndex] = color;
    setWordColors(newColors);
    setSelectedWordIndex(null);
  };

  return (
    <div
      style={{
        display: "flex",
        // marginTop: "30px",
        justifyContent: "center",
      }}
    >
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "relative",
          width: "60%",
        }}
      >
        <h4 className="header-title-page8">
          <span className="ex-A">I</span>Read, color, and say.
        </h4>
        <span style={{ fontSize: "14px", color: "gray" }}>
          Hint: Double Click to Color Word
        </span>
        {selectedWordIndex !== null && (
          <div className="color-palette">
            {colors.map((c) => (
              <div
                key={c}
                className="color-circle"
                style={{ backgroundColor: c }}
                onClick={() => applyColor(c)}
              ></div>
            ))}
          </div>
        )}

        <div className="container3-wb-u1-p7-q1" >
          <div className="word-section1-wb-u1-p7-q1">
            {[
              "Good evening!",
              "Good morning!",
              "Good afternoon!",
              "Goodbye!",
              "How are you?",
            ].map((word, i) => (
              <div
            
              >
                <h5
                  key={i}
                  className={
                    wordColors[0] === "transparent"
                      ? "word-outline H5"
                      : "word-colored H5"
                  }
                  style={{
                    color: wordColors[i],
                    cursor: "pointer",
                    position: "relative",
                    textAlign: "start",
                    width: "100%",
                  }}
                
                  onDoubleClick={() => handleWordClick(i)} // فتح الباليت
                  onTouchEnd={() => handleWordClick(i)}
                >
                  {word}
                </h5>{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setWordColors([
              "transparent",
              "transparent",
              "transparent",
              "transparent",
              "transparent",
              "transparent",
            ]);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
      </div>
    </div>
  );
}
