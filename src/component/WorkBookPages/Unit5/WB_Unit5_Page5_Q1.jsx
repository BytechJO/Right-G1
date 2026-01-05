import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import find_img from "../../../assets/U1 WB/U5/U5P31EXEI-01.svg";

/* ================= DATA ================= */

const items = [
  {
    key: "pen",
    label: "pen",
    area: { x1: 26.4395, y1: 48.9356, x2: 34.2037, y2: 53.5385 },
  },
  {
    key: "book",
    label: "book",
    area: { x1: 17.6300, y1: 33.6881, x2: 28.9778, y2: 37.7158 },
  },
  {
    key: "eraser",
    label: "eraser",
    area: {
      x1: 56.1526,
      y1: 50.0863,
      x2: 61.2292,
      y2: 54.9770,
    },
  },
  {
    key: "chair1",
    label: "chair",
    area: {
      x1: 72.8756,
      y1: 53.5385,
      x2: 82.2822,
      y2: 85.4718,
    },
  },
  {
    key: "chair2",
    label: "chair",
    area: {
      x1: 27.6340,
      y1: 56.7031,
      x2: 36.4434,
      y2: 88.3487,
    },
  },
  {
    key: "ruler",
    label: "ruler",
    area: { x1: 68.2469, y1: 44.3326, x2: 76.5180, y2: 54.5 },
  },
];

/* ================= COMPONENT ================= */

const WB_Unit5_Page5_Q1 = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [circles, setCircles] = useState({});
  const [checked, setChecked] = useState(false);

  /* ================= IMAGE CLICK ================= */

  const handleImageClick = (e) => {
    if (!selectedItem || checked) return;

    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
  console.log(`x: ${x.toFixed(4)}, y: ${y.toFixed(4)}`);
    setCircles((prev) => ({
      ...prev,
      [selectedItem]: { x, y },
    }));
  };

  /* ================= CHECK ANSWER ================= */

  const handleCheck = () => {
    if (checked) return;
    if (Object.keys(circles).length < items.length) {
      ValidationAlert.info("Pay attention!", "Please circle all the words.");
      return;
    }

    let score = 0;

    items.forEach((item) => {
      const p = circles[item.key];
      if (!p) return;

      if (
        p.x >= item.area.x1 &&
        p.x <= item.area.x2 &&
        p.y >= item.area.y1 &&
        p.y <= item.area.y2
      ) {
        score++;
      }
    });

    setChecked(true);

    const color =
      score === items.length ? "green" : score === 0 ? "red" : "orange";
    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${score} / ${items.length}
      </span>
    </div>
  `;
    if (score === items.length) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  /* ================= SHOW ANSWER ================= */

  const handleShowAnswer = () => {
    const correct = {};
    items.forEach((item) => {
      correct[item.key] = {
        x: (item.area.x1 + item.area.x2) / 2,
        y: (item.area.y1 + item.area.y2) / 2,
      };
    });

    setCircles(correct);
    setChecked(true);
  };

  /* ================= RESET ================= */

  const handleStartAgain = () => {
    setSelectedItem(null);
    setCircles({});
    setChecked(false);
  };

  /* ================= RENDER ================= */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">I</span> Read, look, and circle.
        </h5>

        {/* WORD BUTTONS */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedItem(item.key)}
              style={{
                padding: "6px 16px",
                borderRadius: "12px",
                background: "white",
                border:
                  selectedItem === item.key
                    ? "2px solid #007bff"
                    : "1px solid #999",
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* IMAGE */}
      <div style={{ position: "relative", marginTop: "20px" }}>
        <img
          src={find_img}
          alt="classroom"
          style={{
            height: "50vh",
            width: "auto",
            cursor: selectedItem ? "crosshair" : "default",
            display: "block",
          }}
          onClick={handleImageClick}
        />

        {/* DRAW CIRCLES */}
        {Object.entries(circles).map(([key, point]) => (
          <div
            key={key}
            style={{
              position: "absolute",
              top: `${point.y}%`,
              left: `${point.x}%`,
              width: "9%",
              height: "10%",
              border: "3px solid red",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleStartAgain}>
          Start Again ↻
        </button>

        <button className="show-answer-btn" onClick={handleShowAnswer}>
          Show Answer
        </button>

        <button className="check-button2" onClick={handleCheck}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit5_Page5_Q1;
