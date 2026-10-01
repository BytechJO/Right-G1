import React, { useState } from "react";
import find_img from "../../../assets/img_unit2/imgs/02-03 New copy.jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import MySVG from "../../../assets/img_unit2/imgs/U2P10 highlight.svg";
import SquirrelGif from "../../../assets/Squirrel_GIF/Squirrel_1164_1433px.gif";

/* =====================================================
   TARGET AREA - BOAT
===================================================== */

const targetArea = {
  x1: 18,
  y1: 69,
  x2: 24,
  y2: 74,
};

const Unit2_Page1_find = () => {
  const [clickedPoint, setClickedPoint] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [selectionMethod, setSelectionMethod] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  /* =====================================================
     SELECTION SOUND
  ===================================================== */

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

  /* =====================================================
     SELECT POINT
  ===================================================== */

  const selectPoint = (point, message, method) => {
    setClickedPoint(point);

    setCheckResult(null);

    setSelectionMethod(method);

    setAnnouncement(message);

    playSelectionTone();
  };

  /* =====================================================
     IMAGE CLICK
  ===================================================== */

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

      "A point in the party scene was selected. Use Check Answer to check it.",

      "pointer",
    );
  };

  /* =====================================================
     KEYBOARD / TARGET SELECTION
  ===================================================== */

  const handleTargetSelection = (e) => {
    if (showAnswer) return;

    /*
      detail === 0
      يعني الضغط تم عن طريق الكيبورد
      Enter أو Space
    */

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
            /*
              إذا اختارها بالكيبورد
              نحط النقطة بمنتصف منطقة الـboat
            */

            x: targetArea.x1 + (targetArea.x2 - targetArea.x1) / 2,

            y: targetArea.y1 + (targetArea.y2 - targetArea.y1) / 2,

            inside: true,
          };

    selectPoint(
      point,

      "Boat selected. Use Check Answer to check your answer.",

      method,
    );
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const handleCheck = () => {
    if (showAnswer) return;

    if (!clickedPoint) {
      ValidationAlert.info(
        "Pay Attention!",
        "Please select a spot in the image before checking.",
      );

      setAnnouncement("Please select a spot in the image before checking.");

      return;
    }

    if (clickedPoint.inside) {
      setCheckResult("success");

      setAnnouncement("Correct. You found the boat.");

      ValidationAlert.success("Bravo!", "You found the boat! 🏆");
    } else {
      setCheckResult("fail");

      setAnnouncement("That is not the boat. Try again.");

      ValidationAlert.error("Oops!", "This is not the boat. Try again!");
    }
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const handleStartAgain = () => {
    setClickedPoint(null);

    setCheckResult(null);

    setShowAnswer(false);

    setSelectionMethod(null);

    setAnnouncement("Activity reset. Find the boat in the party scene.");
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    setShowAnswer(true);

    setClickedPoint(null);

    setCheckResult(null);

    setSelectionMethod(null);

    setAnnouncement("The correct boat is highlighted.");
  };

  /* =====================================================
     STATES
  ===================================================== */

  const targetSelected = clickedPoint?.inside === true;

  const keyboardTargetSelected =
    targetSelected && selectionMethod === "keyboard";

  const showTargetHighlight =
    keyboardTargetSelected || checkResult === "success" || showAnswer;

  /* =====================================================
     TARGET SIZE
  ===================================================== */

  const targetWidth = targetArea.x2 - targetArea.x1;

  const targetHeight = targetArea.y2 - targetArea.y1;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div>
      <div
        style={{
          textAlign: "center",

          display: "flex",

          gap: "40px",

          flexDirection: "column",

          alignItems: "center",
        }}
      >
        {/* =================================================
            INSTRUCTIONS
        ================================================= */}

        <div
          id="unit2-page1-find-instructions"
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
            <h5
              className="header-title-page8"
              style={{
                margin: 0,
              }}
            >
              I need your help. Can you help me find the boat in the picture?
            </h5>

            <p className="sub-header">
              Look carefully around the party, then tap the boat.
            </p>
          </div>
        </div>

        {/* =================================================
            SCREEN READER ANNOUNCEMENT
        ================================================= */}

        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          style={{
            position: "relative",

            display: "inline-block",
          }}
        >
          <img
            src={find_img}
            alt="Birthday party scene with children, decorations, balloons, a cake table, gifts, and several objects around the room."
            draggable="false"
            onClick={handleImageClick}
            style={{
              width: "auto",

              height: "75vh",

              borderRadius: "8px",

              cursor: showAnswer ? "default" : "crosshair",

              display: "block",
            }}
          />

          {/* =================================================
              ACCESSIBLE BOAT TARGET
          ================================================= */}

          <button
            type="button"
            className="
              focus-visible:outline-4
              focus-visible:outline-blue-600
              focus-visible:outline-offset-4
            "
            aria-label="Select the boat"
            aria-describedby="unit2-page1-find-instructions"
            aria-pressed={targetSelected}
            disabled={showAnswer}
            onClick={handleTargetSelection}
            style={{
              position: "absolute",

              left: `${targetArea.x1}%`,

              top: `${targetArea.y1}%`,

              width: `${targetWidth}%`,

              height: `${targetHeight}%`,

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

          {/* =================================================
              RED CLICK POINT
          ================================================= */}

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

          {/* =================================================
              CORRECT ANSWER HIGHLIGHT

              حافظنا هون على نفس مكان الـSVG
              الموجود عندك بالسؤال الأصلي.
          ================================================= */}

          {showTargetHighlight && (
            <img
              src={MySVG}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",

                top: "67%",

                left: "18.5%",

                height: "7%",

                pointerEvents: "none",

                zIndex: 3,
              }}
            />
          )}
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

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

export default Unit2_Page1_find;
