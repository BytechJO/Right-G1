import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit4_Page6_Q2.css";

import img1 from "../../../assets/U1 WB/U4/U4P26EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U4/U4P26EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U4/U4P26EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U4/U4P26EXEB-04.svg";
import img5 from "../../../assets/U1 WB/U4/U4P26EXEB-05.svg";
import img6 from "../../../assets/U1 WB/U4/U4P26EXEB-06.svg";

export default function WB_Unit4_Page6_Q2() {
  const correctWords = ["fish", "feet", "fork", "vet", "van", "vest"];

  const images = [img1, img2, img3, img4, img5, img6];

  const [columnD, setColumnD] = useState(["", "", ""]);
  const [columnT, setColumnT] = useState(["", "", ""]);
  const [wrong, setWrong] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleInputChange = (col, index, value) => {
    if (showAnswer) return;

    const cleaned = value.toLowerCase();

    if (col === "f") {
      const updated = [...columnD];
      updated[index] = cleaned;
      setColumnD(updated);
    } else {
      const updated = [...columnT];
      updated[index] = cleaned;
      setColumnT(updated);
    }

    setWrong((prev) => prev.filter((w) => w !== cleaned));
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    const allInputs = [...columnD, ...columnT];
    const hasEmpty = allInputs.some((w) => w.trim() === "");

    if (hasEmpty) {
      return ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking."
      );
    }

    let wrongWords = [];

    columnD.forEach((w) => {
      if (!correctWords.includes(w) || !w.startsWith("f")) wrongWords.push(w);
    });

    columnT.forEach((w) => {
      if (!correctWords.includes(w) || !w.startsWith("v")) wrongWords.push(w);
    });

    setWrong(wrongWords);

    const total = correctWords.length;
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
    setColumnD(correctWords.filter((w) => w.startsWith("f")));
    setColumnT(correctWords.filter((w) => w.startsWith("v")));
    setWrong([]);
    setShowAnswer(true);
  };

  const reset = () => {
    setColumnD(["", "", ""]);
    setColumnT(["", "", ""]);
    setWrong([]);
    setShowAnswer(false);
  };

  return (
    <div className="page8-wrapper" style={{ padding: "30px" }}>
      <div className="div-forall" style={{ width: "60%" }}>
        <h3 className="header-title-page8">
          <span className="ex-A">B</span>
          Look and write the words in the correct column.
        </h3>

        <div className="content-container-wb-unit4-p6-q2">
          {/* IMAGE BANK */}
          <div className="img-bank-wb-unit4-p6-q2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={correctWords[i]}
                style={{ height: "100px", width: "auto" }}
              />
            ))}
          </div>

          {/* TABLE */}
          <div className="table-div-wb-unit4-p6-q2">
            <table className="sorting-table-wb-u1-p8-q2">
              <thead>
                <tr>
                  <th>f</th>
                  <th>v</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2].map((row, i) => (
                  <tr key={i}>
                    <td style={{ position: "relative" }}>
                      <input
                        className="input-cell-wb-u1-p8-q2"
                        value={columnD[i]}
                        onChange={(e) =>
                          handleInputChange("f", i, e.target.value)
                        }
                        disabled={showAnswer}
                      />
                      {wrong.includes(columnD[i]) &&
                        columnD[i].trim() !== "" && (
                          <span className="wrong-x-circle-wb-u1-p8-q2">✕</span>
                        )}
                    </td>

                    <td style={{ position: "relative" }}>
                      <input
                        className="input-cell-wb-u1-p8-q2"
                        value={columnT[i]}
                        onChange={(e) =>
                          handleInputChange("v", i, e.target.value)
                        }
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
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button
          className="show-answer-btn swal-continue"
          onClick={showCorrectAnswers}
        >
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
