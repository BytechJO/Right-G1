import React, { useState } from "react";
import "./WB_Unit10_Page2_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit10Audio from "./useUnit10Audio";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import audio1 from "../../../assets/U1 WB/U10/audio/page58- D/Item_001_I_want_ice_cream.mp3";
import audio2 from "../../../assets/U1 WB/U10/audio/page58- D/Item_002_I_want_fruit.mp3";
import audio3 from "../../../assets/U1 WB/U10/audio/page58- D/Item_003_I_want_chicken.mp3";
import audio4 from "../../../assets/U1 WB/U10/audio/page58- D/Item_004_I_want_milk.mp3";
import mainImg from "../../../assets/U1 WB/U10/U10P58EXED.svg";
import img1 from "../../../assets/U1 WB/U10/U10P58EXED01-01.svg";
import img2 from "../../../assets/U1 WB/U10/U10P58EXED01-02.svg";
import img3 from "../../../assets/U1 WB/U10/U10P58EXED01-03.svg";
import img4 from "../../../assets/U1 WB/U10/U10P58EXED01-04.svg";
import img5 from "../../../assets/U1 WB/U10/U10P58EXED02-01.svg";
import img6 from "../../../assets/U1 WB/U10/U10P58EXED02-02.svg";
import img7 from "../../../assets/U1 WB/U10/U10P58EXED02-03.svg";
import img8 from "../../../assets/U1 WB/U10/U10P58EXED02-04.svg";
import img9 from "../../../assets/U1 WB/U10/U10P58EXED03-01.svg";
import img10 from "../../../assets/U1 WB/U10/U10P58EXED03-02.svg";
import img11 from "../../../assets/U1 WB/U10/U10P58EXED03-03.svg";
import img12 from "../../../assets/U1 WB/U10/U10P58EXED03-04.svg";
import img13 from "../../../assets/U1 WB/U10/U10P58EXED04-01.svg";
import img14 from "../../../assets/U1 WB/U10/U10P58EXED04-02.svg";
import img15 from "../../../assets/U1 WB/U10/U10P58EXED04-03.svg";
import img16 from "../../../assets/U1 WB/U10/U10P58EXED04-04.svg";
const data = [
  {
    id: 1,
    mainImg: img1,
    mainAlt: "A boy who wants ice cream.",
    audio: audio1,
    images: [
      { id: 1, src: img2, value: "kite", alt: "A glass of orange juice." },
      { id: 2, src: img3, value: "girl", alt: "A glass of ice cream." },
      { id: 3, src: img4, value: "key", alt: "A red apple." },
    ],
    correct: ["girl"],
  },
  {
    id: 2,
    mainImg: img5,
    mainAlt: "A woman who wants fruit.",
    audio: audio2,
    images: [
      { id: 1, src: img6, value: "grass", alt: "A glass of ice cream." },
      { id: 2, src: img7, value: "kitchen", alt: "A glass of orange juice." },
      { id: 3, src: img8, value: "fruit", alt: "A bowl of fruit." },
    ],
    correct: ["fruit"],
  },
  {
    id: 3,
    mainImg: img9,
    mainAlt: "A girl who wants chicken.",
    audio: audio3,
    images: [
      {
        id: 1,
        src: img10,
        value: "kitchen",
        alt: "A roast chicken on a plate.",
      },
      { id: 2, src: img11, value: "grass", alt: "A carton of milk." },
      { id: 3, src: img12, value: "garden", alt: "A can of food." },
    ],
    correct: ["kitchen"],
  },
  {
    id: 4,
    mainImg: img13,
    mainAlt: "A man who wants milk.",
    audio: audio4,
    images: [
      { id: 1, src: img14, value: "grass", alt: "A red apple." },
      {
        id: 2,
        src: img15,
        value: "kitchen",
        alt: "A roast chicken on a plate.",
      },
      { id: 3, src: img16, value: "milk", alt: "A carton of milk." },
    ],
    correct: ["milk"],
  },
];

const topSoundAreas = [
  { id: 1, left: "18%", top: "4%", width: "29%", height: "19%" },
  { id: 2, left: "77%", top: "4%", width: "20%", height: "19%" },
  { id: 3, left: "18%", top: "58%", width: "25%", height: "19%" },
  { id: 4, left: "77%", top: "58%", width: "20%", height: "19%" },
];

export default function WB_Unit10_Page2_Q2() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lockedIds, setLockedIds] = useState([]);
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();

  const handleSelect = (qId, value) => {
    if (showAnswer || lockedIds.includes(qId)) return;

    setAnswers((prev) => {
      const current = prev[qId]?.[0];

      if (current === value) {
        return { ...prev, [qId]: [] }; // إلغاء الاختيار
      }

      return { ...prev, [qId]: [value] }; // استبدال
    });
  };

  const handleCheck = () => {
    if (showAnswer) return; // 🔥 يمنع الضغط بعد إظهار الحل
    // فحص إذا الطالب مختار على الأقل إجابة من السؤال الأول
    if (!answers[data[0].id] || answers[data[0].id].length === 0) {
      ValidationAlert.info("Please select at least one picture in question 1.");
      return;
    }

    // فحص إذا الطالب مختار على الأقل إجابة من السؤال الثاني
    if (!answers[data[1].id] || answers[data[1].id].length === 0) {
      ValidationAlert.info("Please select at least one picture in question 2.");
      return;
    }

    let correctCount = 0;

    // نحسب total = مجموع كل الإجابات الصحيحة
    const total = data.reduce((sum, q) => sum + q.correct.length, 0);

    // حساب عدد الصح
    data.forEach((q) => {
      const studentAnswers = answers[q.id] || [];

      q.correct.forEach((correctValue) => {
        if (studentAnswers.includes(correctValue)) {
          correctCount++;
        }
      });
    });

    // اختيار اللون حسب النتيجة
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    // إظهار نوع النتيجة
    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setSubmitted(true);
    setLockedIds((previous) => [
      ...new Set([
        ...previous,
        ...data
          .filter((q) =>
            (answers[q.id] || []).some((value) => q.correct.includes(value)),
          )
          .map((q) => q.id),
      ]),
    ]);
  };
  const handleShowAnswer = () => {
    const correctAnswersObj = {};

    data.forEach((q) => {
      correctAnswersObj[q.id] = [...q.correct]; // نضع كل الإجابات الصحيحة
    });

    setAnswers(correctAnswersObj);
    setShowAnswer(true);
    setLockedIds(data.map((q) => q.id));
    stopAudio();
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowAnswer(false); // 🔥 إلغاء وضع Show Answer
    setLockedIds([]);
    stopAudio();
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
        style={
          {
            // gap: "30px",
          }
        }
      >
        <ExerciseHeader
          sectionLetter="D"
          title="Read, look, and circle."
          subTitle="Look at each person and tap the food shown in the thought bubble."
        />
        <div className="img-options-container-wb-unit10-p2-q2 w-full">
          <div className="img-container-wb-unit10-p2-q2">
            <div className="wb-unit10-p2-q2-top-audio-map">
              <img
                src={mainImg}
                alt="Four people saying which food they want."
                style={{ height: "160px", width: "auto" }}
              />
              {topSoundAreas.map((area) => {
                const question = data.find((item) => item.id === area.id);
                const audioKey = `top-sentence-${area.id}`;
                return (
                  <div
                    key={area.id}
                    className="wb-unit10-p2-q2-top-sound-area wb-unit10-audio-control"
                    style={{
                      left: area.left,
                      top: area.top,
                      width: area.width,
                      height: area.height,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play sentence ${area.id}`}
                    onClick={() => playAudio(audioKey, question.audio)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        playAudio(audioKey, question.audio);
                      }
                    }}
                  >
                    {activeAudioKey === audioKey && <Unit10PlayingAudioIcon />}
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            {data.map((q) => (
              <div key={q.id} className="question-row-wb-unit10-p2-q2">
                <div style={{ display: "flex" }}>
                  <span
                    className="q-number"
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {q.id}.
                  </span>
                  <img
                    src={q.mainImg}
                    alt={q.mainAlt}
                    style={{ height: "120px", width: "auto" }}
                  />
                </div>
                <div className="images-row-Unit5_Page5_Q2">
                  {q.images.map((img) => {
                    const isSelected = answers[q.id]?.includes(img.value);

                    const isWrong =
                      isSelected &&
                      !q.correct.includes(img.value) &&
                      !showAnswer;

                    return (
                      <div
                        key={img.id}
                        style={{ position: "relative" }}
                        className={`img-box-wb-unit10-p2-q2 
                    ${isSelected ? "selected-wb-unit10-p2-q2" : ""} 
                
                    ${isWrong ? "wrong" : ""}`}
                        onClick={() => handleSelect(q.id, img.value)}
                        role="button"
                        tabIndex={lockedIds.includes(q.id) ? -1 : 0}
                        aria-label={`Choose ${img.alt}`}
                        aria-pressed={isSelected}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleSelect(q.id, img.value);
                          }
                        }}
                      >
                        <img src={img.src} alt={img.alt} />
                        {/* علامة X تظهر فقط عند الغلط */}
                        {isWrong && submitted && (
                          <div className="wrong-mark-Unit5_Page5_Q2 ">✕</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>
        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
