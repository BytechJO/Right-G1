import React, { useState, useEffect, useRef } from "react";
// import "./Review6_Page2_Q1.css";
import sound1 from "../../../assets/unit6/sounds/CD50.Pg53_Instruction1_Adult Lady.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/U1 WB/U2/U2P11EXEE-01.svg";
import img2 from "../../../assets/U1 WB/U2/U2P11EXEE-02.svg";
import img3 from "../../../assets/U1 WB/U2/U2P11EXEE-03.svg";
import img4  from "../../../assets/U1 WB/U2/U2P11EXEE-04.svg";
import img5 from "../../../assets/U1 WB/U2/U2P11EXEE-05.svg";
import img6 from "../../../assets/U1 WB/U2/U2P11EXEE-06.svg"
import img7 from "../../../assets/U1 WB/U2/U2P11EXEE-07.svg"

const data = [
  {
    id: 1,
    text: "jello",
    imgs: [
      { src: img1, answer: false }, // short i
      { src: img2, answer: true },
    ],
  },
  {
    id: 2,
    text: "present",
    imgs: [
      { src: img3, answer: false }, // short i
      { src: img4, answer: true },
    ],
  },
  {
    id: 3,
    text: "balloons",
    imgs: [
      { src: img5, answer: true },
      { src: img6, answer: false }, // short i
    ],
  },
  {
    id: 4,
    text: "card",
    imgs: [
      { src: img7, answer: false }, // short i
      { src: img1, answer: true },
    ],
  },
];

const WB_Unit2_Page3_Q1 = () => {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);


  const checkAnswers = () => {
    if (locked) return; // 🔒 منع التعديل بعد رؤية الحل

    const totalQuestions = data.length;
    let correct = 0;

    // تأكد إنو جاوب كل الأسئلة
    for (let q of data) {
      if (selected[q.id] === undefined) {
        ValidationAlert.info("");
        return;
      }
    }

    // حساب عدد الإجابات الصحيحة
    data.forEach((q) => {
      const chosenIndex = selected[q.id];
      if (q.imgs[chosenIndex].answer === true) {
        correct++;
      }
    });
    const color =
      correct === totalQuestions ? "green" : correct === 0 ? "red" : "orange";
    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${correct} / ${totalQuestions}
      </span>
    </div>
  `;

    // النتيجة
    if (correct === totalQuestions) {
      ValidationAlert.success(scoreMessage);
    } else if (correct === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setShowResult(true);
  };
  const handleSelect = (qId, index) => {
    if (locked) return; // 🔒 منع التعديل بعد رؤية الحل
    setSelected((prev) => ({ ...prev, [qId]: index }));
    setShowResult(false);
  };
  const showAnswers = () => {
    const correctSelection = {};

    data.forEach((q) => {
      const correctIndex = q.imgs.findIndex((img) => img.answer === true);
      correctSelection[q.id] = correctIndex;
    });

    setSelected(correctSelection); // عرض جميع الإجابات الصحيحة
    setShowResult(false); // إخفاء X لأنها ليست إجابات خاطئة
    setLocked(true); // 🔒 إيقاف التعديل
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
        <h5 className="header-title-page8">
         <span className="ex-A">E</span> Read and write<span style={{ color: "red" }}>✓</span> .
        </h5>

        <div className="shorti-container-review6-p2-q1 ">
          {data.map((question) => (
            <div key={question.id} className="question-box-review6-p2-q1 ">
              <span
                style={{
                  color: "darkblue",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                {question.id}
              </span>
              {question.imgs.map((img, index) => {
                return (
                  <div
                    key={index}
                    className={`img-box-wb-u2-p3-q1  ${
                      selected[question.id] === index
                        ? "selected-review6-p2-q1"
                        : ""
                    }`}
                    onClick={() => handleSelect(question.id, index)}
                  >
                    {showResult &&
                      !locked && // 🔒 لا تظهر X عند تفعيل Show Answer
                      selected[question.id] === index &&
                      img.answer === false && (
                        <span className="wrong-x-circle-review6-p2-q1">✕</span>
                      )}
                    <img src={img.src} alt="" style={{height:"150px",width:"auto"}} />
                    <div className="check-box-wb-u2-p3-q1  ">
                      {selected[question.id] === index ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          className="try-again-button"
          onClick={() => {
            setSelected({});
            setShowResult(false);
            setLocked(false);
          }}
        >
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

export default WB_Unit2_Page3_Q1;
