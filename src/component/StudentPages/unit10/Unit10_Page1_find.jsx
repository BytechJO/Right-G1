import React, { useState } from "react";
import find_img from "../../../assets/unit10/imgs/G1_10 _Pg_82-83 copy.jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import Rabbit from "../../../assets/img_unit2/imgs/Rabbit.svg";
import MySVG from "../../../assets/unit10/imgs/U9P82Highlight.svg";
const Unit10_Page1_find = () => {
  const [clickedPoint, setClickedPoint] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
 const [showAnswer, setShowAnswer] = useState(false);
  // ✅ منطقة المطعم (بالنسب المئوية)
  const targetArea = {
    x1: 21.96,
    y1: 45.26,
    x2: 28.41,
    y2: 50.50,
  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(xPercent, yPercent);

    setClickedPoint({
      x: xPercent,
      y: yPercent,
      inside:
        xPercent >= targetArea.x1 &&
        xPercent <= targetArea.x2 &&
        yPercent >= targetArea.y1 &&
        yPercent <= targetArea.y2,
    });
  };

  const handleCheck = () => {
    if (!clickedPoint) {
      ValidationAlert.info(
        "Pay attention!",
        "Please click on the image first."
      );
      return;
    }

    if (clickedPoint.inside) {
      setCheckResult("success");
      ValidationAlert.success("Bravo!", "You clicked on the restaurant! 🏆");
    } else {
      setCheckResult("fail");
      ValidationAlert.error("Oops!", "This is not the restaurant. Try again!");
    }
  };
 const handleShowAnswer = () => {
    setShowAnswer(true);
    setClickedPoint(null); // نمسح النقطة اللي كبسها الطالب
    setCheckResult("success"); // اختيارية إذا بدك يظهر نجاح
  };

  const handleStartAgain = () => {
    setClickedPoint(null);
    setCheckResult(null);
     setShowAnswer(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <img src={Rabbit} style={{ height: "50px", width: "auto" }} />
          <h5 className="header-title-page8">
            I need your help. Can you help me find the cupcakes in the picture?
          </h5>
        </div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={find_img}
            alt="interactive"
            style={{
              width: "auto",
              height: "75vh",
              cursor: "pointer",
              display: "block",
            }}
            onClick={handleImageClick}
          />

          {/* ✅ الدائرة الحمراء في مكان الكبس */}
          {clickedPoint && (
            <div
              style={{
                position: "absolute",
                top: `${clickedPoint.y}%`,
                left: `${clickedPoint.x}%`,
                width: "3%",
                height: "3%",
                backgroundColor: "red",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            ></div>
          )}

          {/* ✅ تلوين المنطقة الصحيحة إذا الجواب صح */}
         
                   {/* ✅ تلوين المنطقة الصحيحة إذا الجواب صح */}
                   {(checkResult === "success" || showAnswer) && (
                     <img
                       src={MySVG}
                       alt="answer highlight"
                       style={{
                         position: "absolute",
                         top: `41%`,
                         left: `21%`,
                         height: `13%`,
                         pointerEvents: "none",
                       }}
                     />
                   )}
        </div>
      </div>
      <div className="action-buttons-container ">
        <button className="try-again-button" onClick={handleStartAgain}>
          Start Again ↻
        </button>
            <button className="show-answer-btn" onClick={handleShowAnswer}>
          Show Answer
        </button>
        <button className="check-button2" onClick={handleCheck}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit10_Page1_find;
