import React, { useState } from "react";
import "./Review7_Page1_Q1.css";
import ValidationAlert from "../Popup/ValidationAlert";

const crosswordStructure = [
  // Row 1 (10 columns)
  ["B", "B", "B", "B", "B", "B", "B", "B", "B", "1"],

  // Row 2 (10 columns)
  ["B", "B", "2", "W", "W", "W", "W", "B", "B", "W"],

  // Row 3 (10 columns)
  ["B", "B", "W", "B", "B", "B", "B", "B", "B", "W"],

  // Row 4 (10 columns)
  ["B", "B", "W", "B", "3", "W", "W", "W", "W", "W"],

  // Row 5 (5 columns)
  ["B", "B", "W", "B", "W"],

  // Row 6 (5 columns)
  ["4", "W", "W", "W", "W"],

  // Row 7 (3 columns)
  ["B", "B", "W"],
];

const solution = [
  { num: 1, direction: "Down", answer: "cold" },
  { num: 2, direction: "Down", answer: "hungry" },
  { num: 3, direction: "Down", answer: "sad" },
  { num: 2, direction: "Across", answer: "happy" },
  { num: 3, direction: "Across", answer: "scared" },
  { num: 4, direction: "Across", answer: "bored" },
];
export default function Review7_Page1_Q1() {
  const [userGrid, setUserGrid] = useState(
    crosswordStructure.map((row) =>
      row.map((cell) => (cell === "W" || /[1-9]/.test(cell) ? "" : null))
    )
  );
  const findCellPosition = (num) => {
    for (let r = 0; r < crosswordStructure.length; r++) {
      for (let c = 0; c < crosswordStructure[r].length; c++) {
        if (crosswordStructure[r][c] === String(num)) {
          return { r, c };
        }
      }
    }
    return null;
  };
  const readWord = (startR, startC, direction, length) => {
    let word = "";

    for (let i = 0; i < length; i++) {
      const r = direction === "Down" ? startR + i : startR;
      const c = direction === "Across" ? startC + i : startC;

      if (!userGrid[r] || !userGrid[r][c]) return null;
      word += userGrid[r][c];
    }

    return word;
  };

  const checkAnswers = () => {
  let totalInputCells = 0;
  let correctFilledCells = 0;
  let hasEmptyCell = false;

  // 1) حساب الخانات الفعلية القابلة للكتابة
  for (let r = 0; r < crosswordStructure.length; r++) {
    for (let c = 0; c < crosswordStructure[r].length; c++) {
      const cell = crosswordStructure[r][c];

      if (cell === "W" || /[1-9]/.test(cell)) {
        totalInputCells++;

        const userValue = userGrid[r][c];

        if (!userValue || userValue.trim() === "") {
          hasEmptyCell = true;
        }
      }
    }
  }

  // 2) لو في خانة فاضية → alert فقط
  if (hasEmptyCell) {
    return ValidationAlert.info(
      `<div style="font-size:20px; text-align:center;">Please fill all cells before checking.</div>`
    );
  }

  // 3) تصحيح كل حرف داخل الكلمات
  solution.forEach((item) => {
    const { num, direction, answer } = item;
    const start = findCellPosition(num);

    if (start) {
      for (let i = 0; i < answer.length; i++) {
        const r = direction === "Down" ? start.r + i : start.r;
        const c = direction === "Across" ? start.c + i : start.c;

        if (userGrid[r] && userGrid[r][c] === answer[i]) {
          correctFilledCells++;
        }
      }
    }
  });

  // 4) اختيار لون الرسالة
  let color =
    correctFilledCells === totalInputCells
      ? "green"
      : correctFilledCells === 0
      ? "red"
      : "orange";

  let scoreMessage = `
    <div style="font-size: 20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctFilledCells} / ${totalInputCells}
      </span>
    </div>
  `;

  // 5) عرض نتيجة التصحيح
  if (correctFilledCells === totalInputCells) {
    ValidationAlert.success(scoreMessage);
  } else if (correctFilledCells === 0) {
    ValidationAlert.error(scoreMessage);
  } else {
    ValidationAlert.warning(scoreMessage);
  }
};


  const handleChange = (r, c, value) => {
    const letter = value.slice(-1).toLowerCase();
    const updated = [...userGrid];
    updated[r][c] = letter;
    setUserGrid(updated);
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
        <div className="crossword-container">
          <h3 className="header-title-page8">
            A Look and complete the puzzle.
          </h3>

          <div className="crossword-grid">
            {crosswordStructure.map((row, r) => (
              <div key={r} className="row-review7-p1-q1">
                {row.map((cell, c) => {
                  const isBlock = cell === "B";
                  const isNumber = /[1-9]/.test(cell);

                  return (
                    <div
                      key={r + "-" + c}
                      className={`cell2 ${isBlock ? "block" : "white"}`}
                    >
                      {/* الخانات التي فيها رقم → رقم + input */}
                      {isNumber && (
                        <>
                          <span className="number">{cell}</span>
                          <input
                            maxLength={1}
                            value={userGrid[r][c] || ""}
                            onChange={(e) => handleChange(r, c, e.target.value)}
                            className="letter22"
                          />
                        </>
                      )}

                      {/* الخانات البيضاء العادية */}
                      {!isBlock && !isNumber && (
                        <input
                          maxLength={1}
                          value={userGrid[r][c] || ""}
                          onChange={(e) => handleChange(r, c, e.target.value)}
                          className="letter22"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setUserGrid(
              crosswordStructure.map((row) =>
                row.map((cell) =>
                  cell === "W" || /[1-9]/.test(cell) ? "" : null
                )
              )
            );
          }}
        >
          Start Again ↻
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
