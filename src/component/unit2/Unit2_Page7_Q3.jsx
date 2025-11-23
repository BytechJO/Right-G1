import React, { useState } from "react";
import "./Unit2_Page7_Q3.css"; // ضيفي فيه الكود الي فوق
import ValidationAlert from "../Popup/ValidationAlert";
const Unit2_Page7_Q3 = () => {
  const sentences = [
    "hello, I'm John? this is Stella.",
    "how are you.",
    "fine. thank you!",
  ];
  const [checked, setChecked] = useState(false);
  const [circledWords, setCircledWords] = useState({});
  const correct = {
    0: [0, 5, 15], // جملة رقم 0، الأحرف التي يجب أن تُحاط بدائرة
    1: [0, 11], // جملة رقم 1، حرفين خاطئين
    2: [0, 4, 6, 15], // جملة رقم 2، الأحرف الخاطئة
  };
  const checkAnswers = (circledWords, correctAnswers) => {
    if (Object.keys(circledWords).length === 0) {
      ValidationAlert.info("Please circle at least one mistake.");
      return;
    }

    let totalCorrect = 0;
    let studentCorrect = 0;

    for (let sentence in correctAnswers) {
      totalCorrect += correctAnswers[sentence].length;
    }

    for (let sentence in circledWords) {
      circledWords[sentence].forEach((index) => {
        if (
          correctAnswers[sentence] &&
          correctAnswers[sentence].includes(index)
        ) {
          studentCorrect++;
        }
      });
    }

    setChecked(true); // 🔥 الآن نمنع التعديل ونظهر X للغلط

    const scoreMessage = `Score: ${studentCorrect} / ${totalCorrect}`;

    if (studentCorrect === totalCorrect)
      return ValidationAlert.success(scoreMessage);
    if (studentCorrect === 0) return ValidationAlert.error(scoreMessage);
    return ValidationAlert.warning(scoreMessage);
  };

  const handleWordClick = (sIndex, wIndex) => {
    setCircledWords((prev) => {
      const updated = { ...prev };

      // إذا ما كان في دوائر مسبقة للجملة → نعمل مصفوفة جديدة
      if (!updated[sIndex]) {
        updated[sIndex] = [wIndex];
      }
      // إذا الكلمة عليها دائرة → نشيلها
      else if (updated[sIndex].includes(wIndex)) {
        updated[sIndex] = updated[sIndex].filter((i) => i !== wIndex);
      }
      // إذا بدنا نضيف دائرة جديدة مع الإبقاء على الباقي
      else {
        updated[sIndex] = [...updated[sIndex], wIndex];
      }

      return updated;
    });
  };

  //   console.log(result.status); // "all-correct" | "all-wrong" | "partial"
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
        <div className="content-container1">
          <div className="header-container">
            <h5 className="header-title-page8">
              C Read and circle the mistakes.
            </h5>
          </div>
          <div className="sentence-container">
            {sentences.map((sentence, sIndex) => (
              <div
                key={sIndex}
                style={{ marginBottom: "14px", fontSize: "25px" ,fontWeight: "500"}}
              >
                <span style={{ color: "#2c5287", fontWeight: "700" }}>
                  {sIndex + 1}
                </span>{" "}
                {sentence.split("").map((char, wIndex) => {
                  const isCircled = circledWords[sIndex]?.includes(wIndex);
                  const isCorrect =
                    checked && correct[sIndex]?.includes(wIndex) && isCircled;
                  const isWrong =
                    checked && isCircled && !correct[sIndex]?.includes(wIndex);

                  return (
                    <span
                      key={wIndex}
                      onClick={() =>
                        !checked && handleWordClick(sIndex, wIndex)
                      } // 🔒 يمنع التعديل بعد الفحص
                      className={`char-container ${
                        isCircled ? "circled" : ""
                      } ${isCorrect ? "correct" : ""}`}
                    >
                      {char}
                      {isWrong && <span className="wrong-x-unit2-q3">×</span>}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          onClick={() => {
            setCircledWords({});
            setChecked(false);
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        <button
          className="check-button2"
          onClick={() => checkAnswers(circledWords, correct)}
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page7_Q3;
