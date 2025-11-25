import React, { useState } from "react";
import find_img from "../../assets/unit3/imgs3/G1_U3_Pg_22-23 copy.jpg";
import ValidationAlert from "../Popup/ValidationAlert";
import Rabbit from "../../assets/img_unit2/imgs/Rabbit.svg";
const Unit6_Page1_find = () => {
  const [clickedPoint, setClickedPoint] = useState(null);
  const [checkResult, setCheckResult] = useState(null);

  // ✅ منطقة المطعم (بالنسب المئوية)
  const targetArea = {
    x1: 42,
    y1: 14,
    x2: 48,
    y2: 40,
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

  const handleStartAgain = () => {
    setClickedPoint(null);
    setCheckResult(null);
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
      <div style={{ display: "flex" ,justifyContent: "center",width:"100%"}}>
        <img src={Rabbit} style={{ height: "50px", width: "auto" }} />
        <h5 className="header-title-page8">
          I need your help. Can you help me find the boy shutting the window in
          the picture?
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
        {checkResult === "success" && (
          <div
            style={{
              position: "absolute",
              top: `${targetArea.y1}%`,
              left: `${targetArea.x1}%`,
              width: `${targetArea.x2 - targetArea.x1}%`,
              height: `${targetArea.y2 - targetArea.y1}%`,
              backgroundColor: "rgba(0, 255, 0, 0.55)", // أخضر شفاف
              borderRadius: "8px",
              pointerEvents: "none",
            }}
          ></div>
        )}
      </div>
</div>
      <div
      className="action-buttons-container "

      >
        <button className="try-again-button" onClick={handleStartAgain}>
          Start Again ↻
        </button>
        <button className="check-button2" onClick={handleCheck}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit6_Page1_find;
