import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page1_Q2.css";

// 🔹 استبدلي الصور حسب مشروعك
import img1 from "../../../assets/U1 WB/U6/U6P33EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P33EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P33EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P33EXEB-04.svg";
import img5 from "../../../assets/U1 WB/U6/U6P33EXEB-05.svg";

/* ================= DATA ================= */

const columns = ["He", "She", "can", "can’t"];

const rows = [
  {
    id: 1,
    img: img1,
    subject: "He",
    ability: "can",
    text: "paint a picture.",
  },
  {
    id: 2,
    img:img2,
    subject: "He",
    ability: "can",
    text: "ride a bike.",
  },
  {
    id: 3,
    img: img3,
    subject: "He",
    ability: "can’t",
    text: "sail a boat.",
  },
  {
    id: 4,
    img: img4,
    subject: "He",
    ability: "can’t",
    text: "fly a kite.",
  },
  {
    id: 5,
    img: img5,
    subject: "He",
    ability: "can",
    text: "play the violin.",
  },
];

/* ================= COMPONENT ================= */

const WB_Unit6_Page1_Q2 = () => {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  /* ================= HANDLE SELECT ================= */

  const handleSelect = (rowId, type, value) => {
    if (locked ||checked) return;

    setAnswers((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [type]: value, // subject أو ability
      },
    }));
    setChecked(false);
  };

  /* ================= CHECK ANSWER ================= */

  const checkAnswer = () => {
     if (locked ||checked) return;
    if (Object.keys(answers).length < rows.length) {
      ValidationAlert.info("Please complete all rows.");
      return;
    }

    let score = 0;

    rows.forEach((row) => {
      const ans = answers[row.id];
      if (!ans) return;

      if (ans.subject === row.subject && ans.ability === row.ability) {
        score++;
      }
    });

    setChecked(true);
    setLocked(true);

    const color =
      score === rows.length ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
           Score: ${score} / ${rows.length}
        </span>
      </div>
    `;
    if (score === rows.length) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswer = () => {
    const correct = {};
    rows.forEach((row) => {
      correct[row.id] = {
        subject: row.subject,
        ability: row.ability,
      };
    });

    setAnswers(correct);
    setChecked(true);
    setLocked(true);
  };

  /* ================= RESET ================= */

  const reset = () => {
    setAnswers({});
    setChecked(false);
    setLocked(false);
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
      <div  className="div-forall"
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h4 className="header-title-page8">
          <span className="ex-A">B</span> Look and write{" "}
          <span style={{ color: "red" }}>✓</span>.
        </h4>

        <table className="grammar-table-wb-u6-p1-q2">
          <thead>
            <tr>
              <th></th>
              {columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const ans = answers[row.id] || {};
              return (
                <tr key={row.id}>
                  {/* Image */}
                  <td className="img-cell">
                    <span className="row-number">{row.id}</span>
                    <img src={row.img} alt="" />
                  </td>

                  {/* He / She */}
                  <td
                    onClick={() => handleSelect(row.id, "subject", "He")}
                    className={ans.subject === "He" ? "selected" : ""}
                  >
                    {ans.subject === "He" && (
                      <span className="correct-mark">✓</span>
                    )}
                    {checked &&
                      ans.subject === "He" &&
                      row.subject !== "He" && (
                        <span className="wrong-badge">✕</span>
                      )}
                  </td>

                  <td
                    onClick={() => handleSelect(row.id, "subject", "She")}
                    className={ans.subject === "She" ? "selected" : ""}
                  >
                    {ans.subject === "She" && (
                      <span className="correct-mark">✓</span>
                    )}
                    {checked &&
                      ans.subject === "She" &&
                      row.subject !== "She" && (
                        <span className="wrong-badge">✕</span>
                      )}
                  </td>

                  {/* can / can't */}
                  <td
                    onClick={() => handleSelect(row.id, "ability", "can")}
                    className={ans.ability === "can" ? "selected" : ""}
                  >
                    {ans.ability === "can" && (
                      <span className="correct-mark">✓</span>
                    )}
                    {checked &&
                      ans.ability === "can" &&
                      row.ability !== "can" && (
                        <span className="wrong-badge">✕</span>
                      )}
                  </td>

                  <td
                    onClick={() => handleSelect(row.id, "ability", "can’t")}
                    className={ans.ability === "can’t" ? "selected" : ""}
                  >
                    {ans.ability === "can’t" && (
                      <span className="correct-mark">✓</span>
                    )}
                    {checked &&
                      ans.ability === "can’t" &&
                      row.ability !== "can’t" && (
                        <span className="wrong-badge">✕</span>
                      )}
                  </td>

                  {/* Sentence */}
                  <td className="sentence-cell">{row.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswer}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit6_Page1_Q2;
