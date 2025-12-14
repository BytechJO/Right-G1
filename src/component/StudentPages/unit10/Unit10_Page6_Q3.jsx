import React, { useState } from "react";
// import milk from "../../../assets/unit10/imgs/milk.svg";
// import bread from "../../../assets/unit10/imgs/bread.svg";
// import apple from "../../../assets/unit10/imgs/apple.svg";
// import iceCream from "../../../assets/unit10/imgs/icecream.svg";
// import chicken from "../../../assets/unit10/imgs/chicken.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit10_Page6_Q3.css";

const Unit10_Page6_Q3 = () => {
  const items = [
    { img: "./milk", value: "milk" },
    { img: "./bread", value: "bread" },
    { img: "./apple", value: "apple" },
    { img: "./iceCream", value: "ice cream" },
    { img: "./chicken", value: "chicken" },
  ];

  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const normalize = (str) => str.toLowerCase().replace(/[-_]/g, " ").trim();

  const checkAnswer = () => {
    if (answer.trim() === "") {
      ValidationAlert.info("Please write an answer!");
      return;
    }

    const normalizedAnswer = normalize(answer);
    const validAnswers = items.map((item) => normalize(item.value));

    setChecked(true);

    let score = 0;

    if (validAnswers.includes(normalizedAnswer)) {
      score = 1;
    }

    const color = score === 1 ? "green" : "red";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / 1
        </span>
      </div>
    `;

    if (score === 1) {
      ValidationAlert.success(msg);
    } else {
      ValidationAlert.error(msg);
    }
  };

  const reset = () => {
    setAnswer("");
    setChecked(false);
    setSelectedImage(null);
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
          <span className="ex-A">F</span> What do you want? Circle and write.
        </h5>

        {/* الصور */}
        <div className="images-row-unit10-page6-q3">
          {items.map((item, i) => (
            <div
              key={i}
              className={`image-box-unit10-page6-q3 ${
                selectedImage === item.value ? "selected-unit10-page6-q3" : ""
              }`}
              onClick={() => {
                if (checked) return;
                setSelectedImage(item.value); // بس circle
              }}
            >
              <img
                src={item.img}
                alt={item.value}
                style={{ height: "100px", width: "auto" }}
              />
            </div>
          ))}
        </div>

        {/* الجملة */}
        <div
          className="sentence-wrapper-unit10-page6-q3"
          style={{ position: "relative" }}
        >
          <span>I want</span>

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="write-input-unit10-page6-q3"
            disabled={checked}
          />

          {checked && <div className="wrong-mark-unit10-p6-q3">✕</div>}
          <span>.</span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={checkAnswer} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit10_Page6_Q3;
