import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit1_Page3_Q1 = () => {
  const data = [
    { scrambled: "morning Good !", answer: "Good morning!" },
    { scrambled: "you How are ?", answer: "How are you?" },
    { scrambled: "you Fine, thank .", answer: "Fine, thank you." },
    { scrambled: "evening Good !", answer: "Good evening!" },
    { scrambled: "I’m John. Hello!", answer: "Hello! I'm John." },
  ];

  const [inputs, setInputs] = useState(data.map(() => ""));
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrong, setWrong] = useState(data.map(() => false));

  const updateInput = (index, value) => {
    if (showAnswer) return;
    setInputs((prev) => prev.map((v, i) => (i === index ? value : v)));
    setWrong(data.map(() => false));
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    // تجاهل أول إنبوت (index === 0) عند التحقق من المدخلات الفارغة
    if (inputs.some((v) => v.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking."
      );
      return;
    }

    let correct = 0;

    const wrongStatus = inputs.map((v, i) => {
      const ok = v.trim().toLowerCase() === data[i].answer.toLowerCase();
      if (ok) correct++;
      return !ok;
    });

    setWrong(wrongStatus);

    const total = data.length; // لأننا حذفنا السؤال الأول من السكور

    let color = correct === total ? "green" : correct === 0 ? "red" : "orange";

    let msg = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correct} / ${total}
      </span>
    </div>
  `;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const reset = () => {
    setInputs(data.map(() => ""));
    setWrong(data.map(() => false));
    setShowAnswer(false);
  };

  return (
    <div className="page8-wrapper">
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
        <div className="page8-content">
          <header className="header-title-page8">
            <span className="ex-A">A</span>
            Unscramble and write.
          </header>
        </div>{" "}
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              margin: "10px 0",
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <div
              style={{ fontSize: "20px", marginBottom: "5px", width: "20%" }}
            >
              <span
                style={{
                  color: "#0d47a1",
                  fontWeight: "600",
                  marginRight: "10px",
                }}
              >
                {i + 1}
              </span>{" "}
              {item.scrambled}
            </div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <input
                className="input-text-field"
                style={{
                  width: "350px",
                  height: "35px",
                  fontWeight: "600",
                  fontSize: "20px",
                  borderBottom: "2px solid black",
                }}
                value={showAnswer ? item.answer : inputs[i]}
                onChange={(e) => updateInput(i, e.target.value)}
              />

              {wrong[i] && <div className="wrong-icon-wb-unit1-p3-q1">✕</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={() => setShowAnswer(true)}
        >
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit1_Page3_Q1;
