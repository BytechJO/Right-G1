import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import q1Img from "../../../assets/unit7/img/U7P63EXEF-01.svg";
import q2Img from "../../../assets/unit7/img/U7P63EXEF-02.svg";
// import q3Img from "../../../assets/unit7/img/U7P63EXEF-03.svg";
import "./WB_Unit10_Page2_Q1.css";

const WB_Unit10_Page2_Q1 = () => {
  const correctAnswers = {
    q2_question: "want ice cream",
    q2_answer: "I do",
    q3_question: "Do you want",
    q3_answer: "I don't",
  };

  const [answers, setAnswers] = useState({
    q2_question: "",
    q2_answer: "",
    q3_question: "",
    q3_answer: "",
  });

  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);

  const checkAnswers = () => {
    if (locked) return;

    const values = Object.values(answers);
    if (values.some((v) => v.trim() === "")) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let wrong = [];
    let score = 0;

    Object.keys(correctAnswers).forEach((key) => {
      if (
        answers[key].trim().toLowerCase() === correctAnswers[key].toLowerCase()
      ) {
        score++;
      } else {
        wrong.push(key);
      }
    });

    setWrongInputs(wrong);

    const total = Object.keys(correctAnswers).length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center">
        <b style="color:${color}">Score: ${score}/${total}</b>
      </div>
    `;

    score === total
      ? ValidationAlert.success(msg)
      : score === 0
      ? ValidationAlert.error(msg)
      : ValidationAlert.warning(msg);
  };

  const showAnswers = () => {
    setAnswers(correctAnswers);
    setWrongInputs([]);
    setLocked(true);
  };

  const resetAll = () => {
    setAnswers({
      q2_question: "",
      q2_answer: "",
      q3_question: "",
      q3_answer: "",
    });
    setWrongInputs([]);
    setLocked(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="exercise-wrapper-wb-unit10-p2-q1">
          <h5 className="header-title-page8">
            <span className="ex-A">C</span> Look, read, and
            write.
          </h5>

          {/* ========== ROW 1 (EXAMPLE) ========== */}
          <div className="conversation-row-wb-unit10-p2-q1">
            <span className="num-wb-unit10-p2-q1">1</span>

            {/* Question bubble */}
            <div className="bubble question-bubble-wb-unit10-p2-q1">
              Do you want chicken?
            </div>

        

            {/* Person */}
            <img
              src={q2Img}
              alt="girl"
              className="person-img-wb-unit10-p2-q1"
            />

            {/* Answer bubble */}
            <div className="bubble answer-bubble-wb-unit10-p2-q1">
              Yes, I do.
            </div>
          </div>

          {/* ========== ROW 2 ========== */}
          <div className="conversation-row-wb-unit10-p2-q1">
            <span className="num-wb-unit10-p2-q1">2</span>

            <div className="bubble question-bubble-wb-unit10-p2-q1">
              Do{" "}
              <input
                className="line-input-wb-unit10-p2-q1"
                value={answers.q2_question}
                disabled={locked}
                onChange={(e) =>
                  setAnswers({ ...answers, q2_question: e.target.value })
                }
              />
              ?
            </div>

        
            <img
              src={q2Img}
              alt="girl"
              className="person-img-wb-unit10-p2-q1"
            />

            <div className="bubble answer-bubble-wb-unit10-p2-q1">
              Yes,{" "}
              <input
                className="line-input-wb-unit10-p2-q1 small-wb-unit10-p2-q1"
                value={answers.q2_answer}
                disabled={locked}
                onChange={(e) =>
                  setAnswers({ ...answers, q2_answer: e.target.value })
                }
              />
              .
            </div>
          </div>

          {/* ========== ROW 3 ========== */}
          <div className="conversation-row-wb-unit10-p2-q1">
            <span className="num-wb-unit10-p2-q1">3</span>

            <div className="bubble question-bubble-wb-unit10-p2-q1">
              <input
                className="line-input-wb-unit10-p2-q1"
                value={answers.q3_question}
                disabled={locked}
                onChange={(e) =>
                  setAnswers({ ...answers, q3_question: e.target.value })
                }
              />{" "}
              bread?
            </div>


            <img src={q2Img} alt="boy" className="person-img-wb-unit10-p2-q1" />

            <div className="bubble answer-bubble-wb-unit10-p2-q1">
              No,{" "}
              <input
                className="line-input-wb-unit10-p2-q1 small-wb-unit10-p2-q1"
                value={answers.q3_answer}
                disabled={locked}
                onChange={(e) =>
                  setAnswers({ ...answers, q3_answer: e.target.value })
                }
              />
              .
            </div>
          </div>
        </div>
      </div>
      {/* ========== ACTION BUTTONS ========== */}
      <div className="action-buttons-container">
        <button onClick={resetAll} className="try-again-button">
          Start Again ↻
        </button>
        <button
          onClick={showAnswers}
          className="show-answer-btn"
        >
          Show Answer
        </button>
        <button
          onClick={checkAnswers}
          className="check-button2"
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit10_Page2_Q1;
