import React, { useState, useEffect, useRef } from "react";
import "./WB_Unit2_Page2_Q1.css";
import table from "../../../assets/unit4/imgs/U4P34EXEB-03.svg";
import dish from "../../../assets/unit4/imgs/U4P34EXEB-02.svg";
import tiger from "../../../assets/unit4/imgs/U4P34EXEB-03.svg";
import duck from "../../../assets/unit4/imgs/U4P34EXEB-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit2_Page2_Q1 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [userInputs, setUserInputs] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });

  const correctSentences = {
    1: "Happy birthday",
    2: "It's a party hat",
    3: "How old are you",
    4: "I'm seven years old",
  };

  const checkAnswers = () => {
    if (showAnswer || locked) return;

    if (!userInputs[2] || !userInputs[3] || !userInputs[4]) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    let sentenceCorrect = 0;
    // let lineCorrect = 0;

    let wrongInputsTemp = [];

    Object.keys(correctSentences).forEach((key) => {
      if (key === "1") return;

      const userAnswer = userInputs[key].trim().toLowerCase();
      const correctAnswer = correctSentences[key];

      if (userAnswer === correctAnswer) sentenceCorrect++;
      else wrongInputsTemp.push(key);
    });

    setWrongInputs(wrongInputsTemp);

    const totalScore = 4;
    const userScore = sentenceCorrect;

    setLocked(true);

    let color =
      userScore === totalScore ? "green" : userScore === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${userScore} / ${totalScore}
      </span>
    </div>
  `;

    if (userScore === totalScore) ValidationAlert.success(scoreMessage);
    else if (userScore === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
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
        <div className="page8-q1-container">
          <h5 className="header-title-page8">
            {" "}
            <span className="ex-A">C</span> Unscramble and write.
          </h5>

          <div className="container12" ref={containerRef}>
            {/* الصف الأول */}
            <div className="matching-row2">
              <div style={{ display: "flex" ,width:"100%",justifyContent:"space-between"}}>
                {" "}
                <div className="img-with-dot2">
                  {" "}
                  <span className="span-num2">1</span>
                  <img
                    src={table}
                    className="matched-img2"
                    alt=""
                    style={{
                      cursor: "pointer",
                      height: "100px",
                      width: "auto",
                    }}
                  />
                </div>
                <div className="word-with-dot2-wb-u2-p2-q1">
                  <span
                    className="word-text2-review3-p1-q2"
                    style={{ cursor: "pointer" }}
                  >
                    birthday Happy !
                  </span>
                  <input
                      className="unscramble-input"
                    type="text"
                    value={userInputs[1]}
                    onChange={(e) =>
                      setUserInputs((prev) => ({ ...prev, 1: e.target.value }))
                    }
                  
                  />
                  {wrongInputs.includes("2") && (
                    <span className="input-error-x">✕</span>
                  )}
                </div>
              </div>
            </div>
            {/* الصف الثاني */}
            <div className="matching-row2">
              <div style={{ display: "flex" ,width:"100%",justifyContent:"space-between"}}>
                {" "}
                <div className="img-with-dot2">
                  {" "}
                  <span className="span-num2">2</span>
                  <img
                    src={dish}
                    className="matched-img2"
                    alt=""
                    style={{
                      cursor: "pointer",
                      height: "100px",
                      width: "auto",
                    }}
                  />
                </div>
                <div className="word-with-dot2-wb-u2-p2-q1">
                  <span
                    className="word-text2-review3-p1-q2"
                    style={{ cursor: "pointer" }}
                  >
                    a hat party It’s .
                  </span>{" "}
                  <input
                    className="unscramble-input"
                    type="text"
                    value={userInputs[2]}
                    onChange={(e) => {
                      setUserInputs((prev) => ({ ...prev, 2: e.target.value }));
                      setWrongInputs([]);
                    }}
                  />
                  {wrongInputs.includes("2") && (
                    <span className="input-error-x">✕</span>
                  )}
                </div>
              </div>
            </div>
            {/* الصف الثالث */}
            <div className="matching-row2">
              <div style={{ display: "flex" ,width:"100%",justifyContent:"space-between"}}>
                <div className="img-with-dot2">
                  <span className="span-num2">3</span>
                  <img
                    src={duck}
                    className="matched-img2"
                    alt=""
                    style={{
                      cursor: "pointer",
                      height: "100px",
                      width: "auto",
                    }}
                  />
                </div>

                <div className="word-with-dot2-wb-u2-p2-q1">
                  <span
                    className="word-text2-review3-p1-q2"
                    style={{ cursor: "pointer" }}
                  >
                    are How you old ?
                  </span>
                  <input
                    className="unscramble-input"
                    type="text"
                    value={userInputs[3]}
                    onChange={(e) => {
                      setUserInputs((prev) => ({
                        ...prev,
                        3: e.target.value,
                      }));
                      setWrongInputs([]);
                    }}
                  />
                  {wrongInputs.includes("3") && (
                    <span className="input-error-x">✕</span>
                  )}
                </div>
              </div>
            </div>{" "}
            {/* الصف الرابع */}
            <div className="matching-row2">
              <div style={{ display: "flex" ,width:"100%",justifyContent:"space-between"}}>
                {" "}
                <div className="img-with-dot2">
                  <span className="span-num2">4</span>
                  <img
                    src={tiger}
                    className="matched-img2"
                    alt=""
                    style={{
                      cursor: "pointer",
                      height: "100px",
                      width: "auto",
                    }}
                  />
                </div>
                <div className="word-with-dot2-wb-u2-p2-q1">
                  <span
                    className="word-text2-review3-p1-q2"
                    style={{ cursor: "pointer" }}
                  >
                    seven I’m old years .
                  </span>

                  <input
                    className="unscramble-input"
                    type="text"
                    value={userInputs[4]}
                    onChange={(e) => {
                      setUserInputs((prev) => ({
                        ...prev,
                        4: e.target.value,
                      }));
                      setWrongInputs([]);
                    }}
                  />
                  {wrongInputs.includes("4") && (
                    <span className="input-error-x">✕</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setLines([]);
            setUserInputs({
              1: "",
              2: "",
              3: "",
              4: "",
            });
            setWrongWords([]);
            setWrongInputs([]);
            setShowAnswer(false);
            setLocked(false);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>

        <button
          onClick={() => {
            // 2️⃣ تعبئة جميع الإجابات الصحيحة في inputs
            setUserInputs({
              1: correctSentences["1"],
              2: correctSentences["2"],
              3: correctSentences["3"],
              4: correctSentences["4"],
            });

            // 3️⃣ منع التعديل على كل شيء (قفل inputs + منع الرسم)
            setLocked(true);
            setShowAnswer(true);
            setWrongWords([]);
            setWrongInputs([]);
          }}
          className="show-answer-btn swal-continue"
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

export default WB_Unit2_Page2_Q1;
