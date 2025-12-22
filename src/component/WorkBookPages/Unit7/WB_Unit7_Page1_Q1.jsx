import React, { useState, useEffect, useRef } from "react";
// import "./Unit5_Page6_Q1.css";
import img1 from "../../../assets/unit6/imgs/U6P52EXEA-01.svg";
import img2 from "../../../assets/unit6/imgs/U6P52EXEA-02.svg";
import img3 from "../../../assets/unit6/imgs/U6P52EXEA-03.svg";
import img4 from "../../../assets/unit6/imgs/U6P52EXEA-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
const WB_Unit7_Page1_Q1 = () => {
  const [answers, setAnswers] = useState([]);
  const [wrongWords, setWrongWords] = useState([]); // ⭐ تم التعديل هون
  const [locked, setLocked] = useState(false);

  const correctMatches = [
    { input: "I am", num: "input1" },
    { input: "I am not", num: "input2" },
    { input: "you cold", num: "input3" },
    { input: "Yes, I am", num: "input4" },
    { input: "Are you scared", num: "input5" },
    { input: "Yes, I am", num: "input6" },
  
  ];

  const handleChange = (e) => {
    if (locked) return; // 🔒 يمنع التعديل بعد Show Answer
    const { id, value } = e.target;
    setAnswers((prev) => {
      const updated = [...prev];
      const existingIndex = updated.findIndex((ans) => ans.num === id);

      if (existingIndex !== -1) {
        updated[existingIndex] = { input: value, num: id };
      } else {
        updated.push({ input: value, num: id });
      }

      return updated;
    });
    setWrongWords([]);
  };
  const showAnswers = () => {
    const filled = correctMatches.map((item) => ({
      input: item.input,
      num: item.num,
    }));

    setAnswers(filled);
    setWrongWords([]);
    setLocked(true); // 🔒 قفل التعديل
  };

  const checkAnswers = () => {
    if (locked) return; // 🔒 يمنع التعديل بعد Show Answer

    // تأكد إنو الطالب وصل كل الأزواج

    let correctCount = 0;

    let wrong = []; // ⭐ تم التعديل هون
    // احسب كم وصلة صحيحة

    if (answers.length === 0) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    correctMatches.forEach((ans, i) => {
      if (
        ans.input.toLocaleLowerCase() === answers[i].input.toLocaleLowerCase()
      ) {
        correctCount++;
      } else {
        wrong.push(ans.num);
      }
    });

    setWrongWords(wrong);
    setLocked(true);
    console.log(correctCount);
    console.log(wrongWords);
    const total = correctMatches.length;
    // تحديد اللون حسب النتيجة
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    // رسالة النتيجة منسقة بالألوان
    const scoreMessage = `
        <div style="font-size: 20px; margin-top: 10px; text-align:center;">
          <span style="color:${color}; font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    // الحالات الثلاث

    if (total === correctCount) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
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
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <div className="unit2-page9-q1-container">
          <h4 className="header-title-page8">
            <span className="ex-A">A</span> Look and write.
          </h4>
          <div className="content-container-unit5-p6-q1">
            <div className="section-one-wb-unit6-p4-q2">
              <div className="img-container-wb-unit6-p4-q2">
                <span
                  style={{
                    color: "#2c5287",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  1
                </span>{" "}
                <img src={img1} className="img-unit5-p6-q1" />
              </div>
              <div className="content-input-unit5-p6-q1">
                <input
                  type="text"
                  value={"Are you bored?"}
                  readOnly
                  style={{
                    pointerEvents: "none",
                    borderBottom: "2px solid black",
                    width: "75%",
                    fontSize: "22px",
                  }}
                />

                <div style={{ position: "relative",display:"flex" }}>
                  <input
                    type="text"
                    value={"Yes"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "20%",
                      fontSize: "22px",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <input
                      type="text"
                      className="answer-input-wb-unit6-p4-q2"
                      value={
                        answers.find((a) => a.num === "input1")?.input || ""
                      }
                      id="input1"
                      style={{
                        fontSize: "22px",
                      }}
                      onChange={handleChange}
                      disabled={locked}
                    />
                    .
                    {wrongWords.includes(answers[0]?.num) && (
                      <span className="error-mark-input1">✕</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="section-two-wb-unit6-p4-q2">
              <div className="img-container-wb-unit6-p4-q2">
                <span
                  style={{
                    color: "#2c5287",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  2
                </span>{" "}
                <img src={img2} className="img-unit5-p6-q1" />
              </div>
              <div className="content-input-unit5-p6-q1">
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    value={"Are you cold?"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "80%",
                      fontSize: "22px",
                    }}
                  />
               
                </div>
                <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    value={"No,"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "20%",
                      fontSize: "22px",
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <input
                      type="text"
                      className="answer-input-wb-unit6-p4-q2"
                      value={
                        answers.find((a) => a.num === "input2")?.input || ""
                      }
                      id="input2"
                      style={{
                        fontSize: "22px",
                      }}
                      onChange={handleChange}
                      disabled={locked}
                    />
                    .
                    {wrongWords.includes(answers[1]?.num) && (
                      <span className="error-mark-input1">✕</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="section-three-wb-unit6-p4-q2">
              <div className="img-container-wb-unit6-p4-q2">
                <span
                  style={{
                    color: "#2c5287",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  3
                </span>{" "}
                <img src={img3} className="img-unit5-p6-q1" />
              </div>
              <div className="content-input-unit5-p6-q1">
                 
                <div style={{ position: "relative" }}>
                  <div style={{ position: "relative", display: "flex" }}>
                  <input
                    type="text"
                    value={"Are"}
                    readOnly
                    style={{
                      pointerEvents: "none",
                      borderBottom: "2px solid black",
                      width: "20%",
                      fontSize: "22px",
                    }}
                  />
                  <input
                    type="text"
                    className="answer-input-wb-unit6-p4-q2"
                    value={answers.find((a) => a.num === "input3")?.input || ""}
                    id="input3"
                    style={{
                      fontSize: "22px",
                    }}
                    onChange={handleChange}
                    disabled={locked}
                  />
                  {wrongWords.includes(answers[2]?.num) && (
                    <span className="error-mark-input1">✕</span>
                  )}
                  ?</div>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <input
                      type="text"
                      className="answer-input-wb-unit6-p4-q2"
                      value={
                        answers.find((a) => a.num === "input4")?.input || ""
                      }
                      style={{
                        fontSize: "22px",
                      }}
                      id="input4"
                      onChange={handleChange}
                      disabled={locked}
                    />
                    .
                    {wrongWords.includes(answers[3]?.num) && (
                      <span className="error-mark-input1">✕</span>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
            <div className="section-four-wb-unit6-p4-q2">
              <div className="img-container-wb-unit6-p4-q2">
                <span
                  style={{
                    color: "#2c5287",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  4
                </span>{" "}
                <img src={img4} className="img-unit5-p6-q1" />
              </div>
              <div className="content-input-unit5-p6-q1">
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <input
                    type="text"
                    className="answer-input-wb-unit6-p4-q2"
                    value={answers.find((a) => a.num === "input5")?.input || ""}
                    id="input5"
                    onChange={handleChange}
                    style={{
                      fontSize: "22px",
                    }}
                    disabled={locked}
                  />
                  ?
                  {wrongWords.includes(answers[4]?.num) && (
                    <span className="error-mark-input1">✕</span>
                  )}
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <input
                    type="text"
                    className="answer-input-wb-unit6-p4-q2"
                    value={answers.find((a) => a.num === "input6")?.input || ""}
                    id="input6"
                    onChange={handleChange}
                    style={{
                      fontSize: "22px",
                    }}
                    disabled={locked}
                  />
                  .
                  {wrongWords.includes(answers[5]?.num) && (
                    <span className="error-mark-input1">✕</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button
            onClick={() => {
              setAnswers([]);
              setWrongWords([]);
              setLocked(false); // ⬅ رجّع التعديل
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            className="show-answer-btn swal-continue"
            onClick={showAnswers}
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit7_Page1_Q1;
