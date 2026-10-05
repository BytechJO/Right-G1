import React, { useState } from "react";
import find_img from "../../../assets/unit4/imgs/G1_U4_Pg_28-29 copy.jpg";
import Rabbit from "../../../assets/img_unit2/imgs/Rabbit.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import MySVG from "../../../assets/unit4/imgs/U4P28 highlight.svg";
import SquirrelGif from "../../../assets/Squirrel_GIF/Squirrel_1164_1433px.gif";

const Unit4_Page1_find = () => {
  const [clickedPoint, setClickedPoint] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectionMethod, setSelectionMethod] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  // نفس الداتا الأصلية بدون تغيير
  const targetArea = {
    x1: 53,
    y1: 7,
    x2: 75,
    y2: 27,
  };
  const playSelectionTone = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(560, audioContext.currentTime);

    gain.gain.setValueAtTime(0.12, audioContext.currentTime);

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.14,
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.14);

    oscillator.addEventListener("ended", () => {
      audioContext.close();
    });
  };

  const selectPoint = (point, message, method) => {
    setClickedPoint(point);
    setCheckResult(null);
    setSelectionMethod(method);
    setAnnouncement(message);

    playSelectionTone();
  };

  // ==========================================
  // اختيار نقطة بالماوس
  // ==========================================
  const handleImageClick = (e) => {
    if (showAnswer) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;

    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    selectPoint(
      {
        x: xPercent,
        y: yPercent,
        inside:
          xPercent >= targetArea.x1 &&
          xPercent <= targetArea.x2 &&
          yPercent >= targetArea.y1 &&
          yPercent <= targetArea.y2,
      },
      "A point in the picture was selected. Use Check Answer to check it.",
      "pointer",
    );
  };

  // ==========================================
  // اختيار المنطقة الصحيحة بالكيبورد
  // ==========================================
  const handleTargetSelection = (e) => {
    if (showAnswer) return;

    const method = e.detail === 0 ? "keyboard" : "pointer";

    const containerRect = e.currentTarget.parentElement.getBoundingClientRect();

    const point =
      method === "pointer"
        ? {
            x: ((e.clientX - containerRect.left) / containerRect.width) * 100,

            y: ((e.clientY - containerRect.top) / containerRect.height) * 100,

            inside: true,
          }
        : {
            x: (targetArea.x1 + targetArea.x2) / 2,
            y: (targetArea.y1 + targetArea.y2) / 2,
            inside: true,
          };

    selectPoint(
      point,
      "Sea selected. Use Check Answer to check your answer.",
      method,
    );
  };

  // ==========================================
  // Check Answer
  // ==========================================
  const handleCheck = () => {
    if (showAnswer) return;

    if (!clickedPoint) {
      ValidationAlert.info(
        "Pay attention!",
        "Please click on the image first.",
      );

      setAnnouncement("Please select a spot in the image before checking.");

      return;
    }

    if (clickedPoint.inside) {
      setCheckResult("success");

      setAnnouncement("Correct. You found the sea.");

      ValidationAlert.success("Bravo!", "You clicked on the sea! 🏆");
    } else {
      setCheckResult("fail");

      setAnnouncement("That is not the sea. Try again.");

      ValidationAlert.error("Oops!", "This is not the sea. Try again!");
    }
  };

  // ==========================================
  // Start Again
  // ==========================================
  const handleStartAgain = () => {
    setClickedPoint(null);
    setCheckResult(null);
    setShowAnswer(false);
    setSelectionMethod(null);

    setAnnouncement("Activity reset. Find the sea in the picture.");
  };

  // ==========================================
  // Show Answer
  // ==========================================
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setClickedPoint(null);
    setCheckResult(null);
    setSelectionMethod(null);

    setAnnouncement("The correct sea area is highlighted.");
  };

  const targetSelected = clickedPoint?.inside === true;

  const keyboardTargetSelected =
    targetSelected && selectionMethod === "keyboard";

  const showTargetHighlight =
    keyboardTargetSelected || checkResult === "success" || showAnswer;

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <div
          id="page4-instructions"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "10px",
            width: "100%",
          }}
        >
          <img
            src={SquirrelGif}
            alt="An animated squirrel asking for help"
            style={{
              height: "100px",
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <h5 className="header-title-page8" style={{ margin: 0 }}>
              I need your help. Can you help me find the restaurant in the
              picture?
            </h5>

            <p className="sub-header">
              Scan the whole picture, then tap the restaurant.
            </p>
          </div>
        </div>

        {/* Screen reader announcement */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        {/* Image */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src={find_img}
            alt="An illustrated scene containing the sea and other objects to explore."
            onClick={handleImageClick}
            draggable="false"
            style={{
              width: "auto",
              height: "75vh",
              borderRadius: "8px",
              cursor: showAnswer ? "default" : "crosshair",
              display: "block",
            }}
          />

          {/* المنطقة الصحيحة القابلة للـ Tab */}
          <button
            type="button"
            className="focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-4"
            aria-label="Select the sea"
            aria-describedby="unit4-find-sea-instructions"
            aria-pressed={targetSelected}
            disabled={showAnswer}
            onClick={handleTargetSelection}
            style={{
              position: "absolute",

              left: `${targetArea.x1}%`,
              top: `${targetArea.y1}%`,

              width: `${targetArea.x2 - targetArea.x1}%`,
              height: `${targetArea.y2 - targetArea.y1}%`,

              zIndex: 2,

              padding: 0,

              border: keyboardTargetSelected
                ? "4px solid #16a34a"
                : "4px solid transparent",

              borderRadius: "12px",

              background: keyboardTargetSelected
                ? "rgba(34, 197, 94, 0.2)"
                : "transparent",

              boxShadow: "none",

              cursor: showAnswer ? "default" : "crosshair",
            }}
          />

          {/* النقطة الحمراء عند اختيار بالماوس */}
          {clickedPoint && selectionMethod === "pointer" && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",

                top: `${clickedPoint.y}%`,
                left: `${clickedPoint.x}%`,

                width: "3%",
                aspectRatio: "1",

                backgroundColor: "red",

                border: "3px solid white",

                borderRadius: "50%",

                transform: "translate(-50%, -50%)",

                pointerEvents: "none",

                zIndex: 4,
              }}
            />
          )}

          {/* Highlight المنطقة الصحيحة */}
          {showTargetHighlight && (
            <img
              src={MySVG}
              alt=""
              aria-hidden="true"
              className="highlight-svg-unit4"
              style={{
                position: "absolute",

                left: `${targetArea.x1}%`,
                top: `${targetArea.y1}%`,

                width: `${targetArea.x2 - targetArea.x1}%`,
                height: `${targetArea.y2 - targetArea.y1}%`,

                pointerEvents: "none",

                zIndex: 3,
              }}
            />
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="action-buttons-container">
        <button
          type="button"
          className="try-again-button"
          onClick={handleStartAgain}
        >
          Start Again ↻
        </button>

        <button
          type="button"
          className="show-answer-btn"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>

        <button type="button" className="check-button2" onClick={handleCheck}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit4_Page1_find;
