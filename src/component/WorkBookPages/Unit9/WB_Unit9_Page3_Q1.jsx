import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U9/U9P53EXEF-01.svg";
import img2 from "../../../assets/U1 WB/U9/U9P53EXEF-02.svg";
import img3 from "../../../assets/U1 WB/U9/U9P53EXEF-03.svg";
import img4 from "../../../assets/U1 WB/U9/U9P53EXEF-04.svg";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import fiveHorsesAudio from "../../../assets/U1 WB/U9/audio/page53- F/Item_001_five_horses.mp3";
import oneCatAudio from "../../../assets/U1 WB/U9/audio/page53- F/Item_002_one_cat.mp3";
import tenHorsesAudio from "../../../assets/U1 WB/U9/audio/page53- F/Item_003_ten_horses.mp3";
import twoCatsAudio from "../../../assets/U1 WB/U9/audio/page53- F/Item_004_two_cats.mp3";
import sixCowsAudio from "../../../assets/U1 WB/U9/audio/page53- F/Item_005_six_cows.mp3";
import sixGoatsAudio from "../../../assets/U1 WB/U9/audio/page53- F/Item_006_six_goats.mp3";
import threeCowsAudio from "../../../assets/U1 WB/U9/audio/page53- F/Item_007_three_cows.mp3";
import sevenGoatsAudio from "../../../assets/U1 WB/U9/audio/page53- F/Item_008_seven_goats.mp3";
// import "./WB_Unit7_Page4_Q2.css"
const WB_Unit9_Page3_Q1 = () => {
  const [answers, setAnswers] = useState(Array(4).fill(null));
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [lockedQuestions, setLockedQuestions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const { activeAudioKey, playAudio } = useUnit9Audio();

  // 🔥 الداتا المطابقة للصورة
  const items = [
    {
      img: img1,
      text: "",
      options: ["one cat", "two cats"],
      correctIndex: 0,
    },
    {
      img: img2,
      text: "",
      options: ["five horses", "ten horses"],
      correctIndex: 0,
    },
    {
      img: img3,
      text: "",
      options: ["six cows", "three cows"],
      correctIndex: 1,
    },
    {
      img: img4,
      text: "",
      options: ["six goats", "seven goats"],
      correctIndex: 1,
    },
  ];
  const optionAudios = [
    [oneCatAudio, twoCatsAudio],
    [fiveHorsesAudio, tenHorsesAudio],
    [sixCowsAudio, threeCowsAudio],
    [sixGoatsAudio, sevenGoatsAudio],
  ];

  const handleSelect = (qIndex, optionIndex) => {
    if (showAnswer || lockedQuestions.includes(qIndex)) return;
    const newAns = [...answers];
    newAns[qIndex] = optionIndex;
    setAnswers(newAns);
    setWrongQuestions((current) => current.filter((index) => index !== qIndex));
  };

  const checkAnswers = () => {
    if (showAnswer || lockedQuestions.length === items.length) return;
    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");
      return;
    }

    let correctCount = answers.filter(
      (ans, i) => ans === items[i].correctIndex
    ).length;

    const total = items.length;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    const correctQuestions = answers
      .map((answer, index) => (answer === items[index].correctIndex ? index : null))
      .filter((index) => index !== null);
    setLockedQuestions(correctQuestions);
    setWrongQuestions(items.map((_, index) => index).filter((index) => !correctQuestions.includes(index)));
  };

  const reset = () => {
    setAnswers(Array(items.length).fill(null));
    setWrongQuestions([]);
    setLockedQuestions([]);
    setShowAnswer(false);
  };
  const showAnswers = () => {
    // كل سؤال → نضع correctIndex بدل null
    const filled = items.map((item) => item.correctIndex);

    setAnswers(filled);
    setWrongQuestions([]);
    setLockedQuestions(items.map((_, index) => index));
    setShowAnswer(true);
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
      <div   className="div-forall"
        style={{
          gap: "50px",
         
        }}
      >
        <div className="w-full">
          <ExerciseHeader sectionLetter="F" title="Look, read, and circle." subTitle="Count each animal group and tap the correct number phrase." />
        </div>
        <div className="container-wb-unit6-p6-q2 w-full">
          {items.map((q, i) => (
            <div
              key={i}
              className="question-box-wb-unit6-p6-q2 "
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "#2c5287",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  {i + 1}
                </span>
                <img
                  src={q.img}
                  alt={`${q.options[q.correctIndex]} on a farm`}
                  className="q3-image-review6-p1-q1"
                  style={{ height: "120px", width: "auto" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div className="options-row-wb-unit5-p6-q3">
                  {q.options.map((word, optIndex) => {
                    const isSelected = answers[i] === optIndex;
                    const isWrong = wrongQuestions.includes(i) && isSelected;

                    return (
                      <p
                        key={optIndex}
                        className={`
                    option-word-review6-p1-q1 wb-unit9-audio-control
                    ${isSelected ? "selected3" : ""}
                    ${isWrong ? "wrong" : ""}
                  `}
                        onClick={() => {
                          playAudio(`option-${i}-${optIndex}`, optionAudios[i][optIndex]);
                          handleSelect(i, optIndex);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Question ${i + 1}: ${word}`}
                        aria-pressed={isSelected}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            playAudio(`option-${i}-${optIndex}`, optionAudios[i][optIndex]);
                            handleSelect(i, optIndex);
                          }
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        {activeAudioKey === `option-${i}-${optIndex}` && <Unit9PlayingAudioIcon />}
                        {word}
                        {isWrong && (
                          <span className="wrong-x-review4-p2-q3">✕</span>
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit9_Page3_Q1;
