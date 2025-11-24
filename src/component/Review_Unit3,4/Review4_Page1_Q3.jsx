import React, { useState } from "react";
import "./Review4_Page1_Q3.css";
import ValidationAlert from "../Popup/ValidationAlert";
const shapesData = [
  { id: 1, shape: "circle", img: "/circle.png" },
  { id: 2, shape: "square", img: "/square.png" },
  { id: 3, shape: "triangle", img: "/triangle.png" },
  { id: 4, shape: "rectangle", img: "/rect.png" },
];

const options = ["triangle", "circle", "square", "rectangle"];

const Review4_Page1_Q3 = () => {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const handleSelect = (rowId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [rowId]: option,
    }));
  };

  const checkAnswers = () => {
    if (Object.keys(answers).length < shapesData.length) {
      ValidationAlert.info("Please choose an answer for each shape.");
      return;
    }
    let score = 0;

    // نحسب عدد الإجابات الصحيحة
    shapesData.forEach((row) => {
      if (answers[row.id] === row.shape) {
        score++;
      }
    });
    setChecked(true);
    // لتفعيل إظهار علامات الصح والغلط
    let color =
      score === shapesData.length ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${shapesData.length}
      </span>
    </div>
  `;

    // كلهم صح
    if (score === shapesData.length) {
      ValidationAlert.success(scoreMessage);
    }

    // كلهم غلط
    else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    }

    // نص بنص أو أي نتيجة أخرى
    else ValidationAlert.warning(scoreMessage);
  };

  const reset = () => {
    setAnswers({});
    setChecked(false);
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
        <div className="table-wrapper-review4-p1-q3">
          <h4 className="header-title-page8">
           C Look and write <span style={{ color: "red" }}>✓</span>.{" "}
          </h4>
          <table className="shapes-table-wrapper-review4-p1-q3">
            <thead>
              <tr>
                <th>What shape is it?</th>
                {options.map((opt, i) => (
                  <th key={i}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {shapesData.map((row) => (
                <tr key={row.id}>
                  <td className="img-cell-wrapper-review4-p1-q3">
                    <img
                      src={row.img}
                      alt=""
                      className="shape-img-wrapper-review4-p1-q3"
                      style={{ height: "50px", width: "auto" }}
                    />
                  </td>

                  {options.map((opt, index) => {
                    const selected = answers[row.id] === opt;
                    const isCorrect = checked && opt === row.shape && selected;
                    const isWrong = checked && opt !== row.shape && selected;

                    return (
                      <td
                        key={index}
                        className={`cell-wrapper-review4-p1-q3 ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => handleSelect(row.id, opt)}
                      >
                        {/* علامة ✓ مباشرة عند الاختيار */}
                        {selected && <span className="correct-mark">✓</span>}

                        {/* دائرة حمراء + X في الزاوية */}
                        {isWrong && <div className="wrong-badge">✕</div>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review4_Page1_Q3;
