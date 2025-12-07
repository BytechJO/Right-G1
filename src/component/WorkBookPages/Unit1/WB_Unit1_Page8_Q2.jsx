import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page8_Q2.css";

export default function WB_Unit1_Page8_Q2() {
  const correctWords = ["table", "dish", "duck", "tiger", "taxi", "deer"];

  const [columnD, setColumnD] = useState(["dish", "", ""]);
  const [columnT, setColumnT] = useState(["", "", ""]);
  const [wrong, setWrong] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleInputChange = (col, index, value) => {
    if (showAnswer) return;

    const cleaned = value.toLowerCase();

    if (col === "d") {
      const updated = [...columnD];
      updated[index] = cleaned;
      setColumnD(updated);
    } else {
      const updated = [...columnT];
      updated[index] = cleaned;
      setColumnT(updated);
    }

    // إزالة العلامات القديمة
    setWrong((prev) => prev.filter((w) => w !== cleaned));
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    // 1️⃣ تأكد من عدم وجود خانات فارغة (عدا index 0)
    const allInputs = [...columnD.slice(1), ...columnT];
    const hasEmpty = allInputs.some((w) => w.trim() === "");

    if (hasEmpty) {
      return ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking."
      );
    }

    // 2️⃣ فحص الإجابات
    let wrongWords = [];

    // عمود D (لكن بدون أول خانة)
    columnD.slice(1).forEach((w) => {
      if (!correctWords.includes(w) || !w.startsWith("d")) wrongWords.push(w);
    });

    // عمود T
    columnT.forEach((w) => {
      if (!correctWords.includes(w) || !w.startsWith("t")) wrongWords.push(w);
    });

    setWrong(wrongWords);

    const total = correctWords.length - 1; // حذف أول كلمة من السكور
    const correctCount = total - wrongWords.length;

    const color =
      correctCount === total
        ? "green"
        : correctCount === 0
        ? "red"
        : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const showCorrectAnswers = () => {
    setColumnD(correctWords.filter((w) => w.startsWith("d")));
    setColumnT(correctWords.filter((w) => w.startsWith("t")));
    setWrong([]);
    setShowAnswer(true);
  };

  const reset = () => {
    setColumnD(["dish", "", ""]);
    setColumnT(["", "", ""]);
    setWrong([]);
    setShowAnswer(false);
  };

  return (
    <div className="page8-wrapper">
      <div className="div-forall" style={{ width: "60%" }}>
        <h3 className="header-title-page8">
          <span className="ex-A">B</span>
          Read and write the words in the correct column.
        </h3>

        <div className="word-bank-wb-u1-p8-q2">
          {correctWords.map((w, i) => (
            <span key={i} className="word-box-wb-u1-p8-q2">
              {w}
            </span>
          ))}
        </div>

        <div className="table-div-wb-u1-p8-q2">
          <table className="sorting-table-wb-u1-p8-q2">
            <thead>
              <tr>
                <th>d</th>
                <th>t</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((row, i) => (
                <tr key={i}>
                  <td style={{ position: "relative" }}>
                    <input
                      className="input-cell-wb-u1-p8-q2"
                      value={columnD[i]}
                      onChange={(e) => handleInputChange("d", i, e.target.value)}
                      disabled={i === 0 || showAnswer}
                    />

                    {i !== 0 &&
                      wrong.includes(columnD[i]) &&
                      columnD[i].trim() !== "" && (
                        <span className="wrong-x-circle-wb-u1-p8-q2">✕</span>
                      )}
                  </td>

                  <td style={{ position: "relative" }}>
                    <input
                      className="input-cell-wb-u1-p8-q2"
                      value={columnT[i]}
                      onChange={(e) => handleInputChange("t", i, e.target.value)}
                      disabled={showAnswer}
                    />

                    {wrong.includes(columnT[i]) &&
                      columnT[i].trim() !== "" && (
                        <span className="wrong-x-circle-wb-u1-p8-q2">✕</span>
                      )}
                  </td>
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

        <button className="show-answer-btn swal-continue" onClick={showCorrectAnswers}>
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
