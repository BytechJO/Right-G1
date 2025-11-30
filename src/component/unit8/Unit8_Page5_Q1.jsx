import React, { useState } from "react";
import "./Unit8_Page5_Q1.css";
import ValidationAlert from "../Popup/ValidationAlert";
// import img1 from "../../assets/zipper.png";
// import img2 from "../../assets/sock.png";
// import img3 from "../../assets/zoo.png";
// import img4 from "../../assets/zebra.png";

const data = [
  {
    img: "./img1.gpg",
    scrambled: "perpzi",
    answer: "zipp",
    pattern: "er",
  },
  { img: "./img2.gpg", scrambled: "ksoc", answer: "so", pattern: "ck" },
  { img: "./img3.gpg", scrambled: "ozo", answer: "z", pattern: "oo" },
  { img: "./img4.gpg", scrambled: "beazr", answer: "ze", pattern: "bra" },
];

const Unit8_Page5_Q1 = () => {
  const [inputs, setInputs] = useState(Array(data.length).fill(""));
  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false)
  );

  const checkAnswers = () => {
    if (inputs.some((val) => val.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please fill in all the answers before checking."
      );
      return;
    }

    let correctCount = 0;
    const wrongFlags = [];

    data.forEach((item, index) => {
      if (inputs[index].toLowerCase() === item.answer) {
        correctCount++;
        wrongFlags[index] = false; // صح
      } else {
        wrongFlags[index] = true; // غلط
      }
    });

    setWrongInputs(wrongFlags);

    const total = data.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  const handleChange = (value, index) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    setWrongInputs(Array(data.length).fill(false));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="unscramble-container">
          <h3 className="header-title-page8">
            <span className="letter-of-Q">A</span>{" "}
            <span style={{ color: "purple" }}>1</span> Look, unscramble, and
            write.
          </h3>

          <div className="unscramble-row">
            {data.map((item, index) => (
              <div className="unscramble-box" key={index}>
                <div className="img-box">
                  <img src={item.img} alt="" />
                </div>

                <p className="scrambled-word">{item.scrambled}</p>

                <div className="input-row">
                  <span className="num">{index + 1}</span>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={inputs[index]}
                      onChange={(e) => handleChange(e.target.value, index)}
                      className="text-input"
                    />
                    {/* إظهار الإكس إذا كانت الإجابة خاطئة */}
                    {wrongInputs[index] && <div className="error-icon">✕</div>}
                  </div>
                  <span className="pattern">{item.pattern}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setWrongInputs(Array(data.length).fill(false));
            setInputs(Array(data.length).fill(""));
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit8_Page5_Q1;
