import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page4_Q1.css"
const WB_Unit4_Page4_Q1 = () => {
  const [labels, setLabels] = useState({
    triangle: "",
    circle1: "",
    circle2: "",
    house: "",
    door: "", // 🆕
  });

  const [colors, setColors] = useState({
    triangle: "#ffffff",
    circle1: "#ffffff",
    circle2: "#ffffff",
    house: "#ffffff",
    door: "#ffffff", // 🆕
  });

  const [checked, setChecked] = useState(false);
  const [activeShape, setActiveShape] = useState(null);
  const [showPalette, setShowPalette] = useState(false);

  const colorPickerRef = useRef(null);
  const BASIC_COLORS = [
    "#ff0000",
    "#0000ff",
    "#ffff00",
    "#00aa00",
    "#ffa200ff",
  ];

  // 🎨 فتح الـ palette
  const openColorPicker = (shape) => {
    if (checked) return;
    setActiveShape(shape);
    setShowPalette(true);
  };

  const selectColor = (color) => {
    setColors({
      ...colors,
      [activeShape]: color,
    });
    setShowPalette(false);
  };

  const checkAnswer = () => {
    if (checked) return;
    // 1️⃣ تأكد إنو كل الانبوتات فيها داتا
    if (
      !labels.triangle ||
      !labels.circle1 ||
      !labels.circle2 ||
      !labels.house ||
      !labels.door
    ) {
      ValidationAlert.info("Please label all the shapes.");
      return;
    }

    let score = 0;
    const total = 5;

    // 2️⃣ حساب السكور
    if (labels.triangle.toLowerCase() === "triangle") score++;
    if (labels.circle1.toLowerCase() === "circle") score++;
    if (labels.circle2.toLowerCase() === "circle") score++;
    if (["square", "rectangle"].includes(labels.house.toLowerCase())) score++;
    if (["square", "rectangle"].includes(labels.door.toLowerCase())) score++;

    setChecked(true);

    // 3️⃣ رسالة النتيجة
    let color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    // 4️⃣ نوع الرسالة حسب السكور
    if (score === total) {
      ValidationAlert.success(msg);
    } else if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  const reset = () => {
    setLabels({
      triangle: "",
      circle1: "",
      circle2: "",
      house: "",
      door: "",
    });

    setColors({
      triangle: "#ffffff",
      circle1: "#ffffff",
      circle2: "#ffffff",
      house: "#ffffff",
      door: "#ffffff",
    });

    setChecked(false);
  };
  const showAnswers = () => {
    setLabels({
      triangle: "triangle",
      circle1: "circle",
      circle2: "circle",
      house: "square",
      door: "square",
    });

    setColors({
      triangle: "blue",
      circle1: "red",
      circle2: "red",
      house: "#ffff00",
      door: "green",
    });

    setChecked(true);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div  className="div-forall"
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">G</span> Look and label the shapes. Then color.
        </h5>
        <span style={{ fontSize: "14px", color: "gray" }}>
          Hint: Double Click to Color Word
        </span>
        <div
          style={{
            position: "relative",
            width: 400,
            height: 460,
            margin: "0 auto",
          }}
        >
          {/* SVG HOUSE */}
          <svg
            width="300"
            height="350"
            style={{
              transform: "scale(1.5)",
              transformOrigin: "top",
            }}
          >
            {/* Triangle */}
            <polygon
              points="150,20 50,120 250,120"
              fill={colors.triangle}
              stroke="black"
              onDoubleClick={() => openColorPicker("triangle")}
            />
            <foreignObject x="90" y="60" width="120" height="40">
              <input
                value={labels.triangle}
                disabled={checked}
                className="answer-input33-wb-unit4-p4-q1"
                onChange={(e) =>
                  setLabels({ ...labels, triangle: e.target.value })
                }
                style={{ width: "100%", textAlign: "center" }}
              />
            </foreignObject>

            {/* House body */}
            <rect
              x="50"
              y="120"
              width="200"
              height="180"
              fill={colors.house}
              stroke="black"
              onDoubleClick={() => openColorPicker("house")}
            />
            <foreignObject x="100" y="190" width="100" height="30">
              <input
                value={labels.house}
                disabled={checked}
                className="answer-input33-wb-unit4-p4-q1"
                onChange={(e) =>
                  setLabels({ ...labels, house: e.target.value })
                }
                style={{ width: "100%", textAlign: "center" }}
              />
            </foreignObject>

            {/* Circles */}
            <circle
              cx="100"
              cy="170"
              r="30"
              fill={colors.circle1}
              stroke="black"
              onDoubleClick={() => openColorPicker("circle1")}
            />
            <circle
              cx="200"
              cy="170"
              r="30"
              fill={colors.circle2}
              stroke="black"
              onDoubleClick={() => openColorPicker("circle2")}
            />

            <foreignObject x="75" y="160" width="50" height="30">
              <input
                value={labels.circle1}
                disabled={checked}
                className="answer-input33-wb-unit4-p4-q1"
                onChange={(e) =>
                  setLabels({ ...labels, circle1: e.target.value })
                }
                style={{ width: "100%", textAlign: "center" }}
              />
            </foreignObject>

            <foreignObject x="175" y="160" width="50" height="30">
              <input
                value={labels.circle2}
                disabled={checked}
                className="answer-input33-wb-unit4-p4-q1"
                onChange={(e) =>
                  setLabels({ ...labels, circle2: e.target.value })
                }
                style={{ width: "100%", textAlign: "center" }}
              />
            </foreignObject>
            {/* Door (Square / Rectangle) */}
            <rect
              x="110"
              y="230"
              width="70"
              height="70"
              fill={colors.door}
              stroke="black"
              onDoubleClick={() => openColorPicker("door")}
            />

            <foreignObject x="115" y="240" width="60" height="30">
              <input
                value={labels.door}
                disabled={checked}
                className="answer-input33-wb-unit4-p4-q1"
                onChange={(e) => setLabels({ ...labels, door: e.target.value })}
                style={{ width: "100%", textAlign: "center" }}
              />
            </foreignObject>
          </svg>

          {showPalette && (
            <div className="color-palette-wb-u1-p7-q1">
              {BASIC_COLORS.map((color) => (
                <div
                  key={color}
                  className="color-circle"
                  onClick={() => selectColor(color)}
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: color,
                    cursor: "pointer",
                    border: "1px solid #000",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons-container" style={{ marginTop: 20 }}>
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswer}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit4_Page4_Q1;
