import React, { useState } from "react";
import backgroundImage from "../../../assets/unit1/imgs/Page 01/01.jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import SquirrelGif from "../../../assets/Squirrel_GIF/Squirrel_1164_1433px.gif";
import MySVG from "../../../assets/unit1/imgs/U1P4 highlight 1.svg";

const targetArea = {
  left: 24,
  top: 8.5,
  width: 35,
  height: 34.5,
};

const Page4_Interactive1 = () => {
  const [clickedPoint, setClickedPoint] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectionMethod, setSelectionMethod] = useState(null);
  const [announcement, setAnnouncement] = useState("");

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
    oscillator.addEventListener("ended", () => audioContext.close());
  };

  const selectPoint = (point, message, method) => {
    setClickedPoint(point);
    setCheckResult(null);
    setSelectionMethod(method);
    setAnnouncement(message);
    playSelectionTone();
  };

  const handleImageClick = (e) => {
    if (showAnswer) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    selectPoint(
      {
        x,
        y,
        inside:
          x >= targetArea.left &&
          x <= targetArea.left + targetArea.width &&
          y >= targetArea.top &&
          y <= targetArea.top + targetArea.height,
      },
      "A point in the scene was selected. Use Check Answer to check it.",
      "pointer",
    );
  };

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
            x: targetArea.left + targetArea.width / 2,
            y: targetArea.top + targetArea.height / 2,
            inside: true,
          };

    selectPoint(
      point,
      "Restaurant selected. Use Check Answer to check your answer.",
      method,
    );
  };

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
      setAnnouncement("Correct. You found the restaurant.");
      ValidationAlert.success("Bravo!", "You found the restaurant! 🏆");
    } else {
      setCheckResult("fail");
      setAnnouncement("That is not the restaurant. Try again.");
      ValidationAlert.error("Oops!", "This is not the restaurant. Try again!");
    }
  };

  const handleStartAgain = () => {
    setClickedPoint(null);
    setCheckResult(null);
    setShowAnswer(false);
    setSelectionMethod(null);
    setAnnouncement("Activity reset. Find the restaurant in the scene.");
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setClickedPoint(null);
    setCheckResult(null);
    setSelectionMethod(null);
    setAnnouncement("The correct restaurant is highlighted.");
  };

  const targetSelected = clickedPoint?.inside === true;
  const keyboardTargetSelected =
    targetSelected && selectionMethod === "keyboard";
  const showTargetHighlight =
    keyboardTargetSelected || checkResult === "success" || showAnswer;

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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

            <p
              className="sub-header"
            >
              Scan the whole picture, then tap the restaurant.
            </p>
          </div>
        </div>
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={backgroundImage}
            alt="A schoolyard scene with children near a restaurant, a clothing shop, trees, and a parked car."
            onClick={handleImageClick}
            draggable="false"
            style={{
              width: "auto",
              height: "70vh",
              cursor: showAnswer ? "default" : "crosshair",
              borderRadius: "8px",
              display: "block",
            }}
          />

          <button
            type="button"
            className="focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-4"
            aria-label="Select the restaurant"
            aria-describedby="page4-instructions"
            aria-pressed={targetSelected}
            disabled={showAnswer}
            onClick={handleTargetSelection}
            style={{
              position: "absolute",
              left: `${targetArea.left}%`,
              top: `${targetArea.top}%`,
              width: `${targetArea.width}%`,
              height: `${targetArea.height}%`,
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

          {showTargetHighlight && (
            <img
              src={MySVG}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                top: `${targetArea.top}%`,
                left: `${targetArea.left}%`,
                width: `${targetArea.width}%`,
                height: `${targetArea.height}%`,
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          )}
        </div>
      </div>

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

export default Page4_Interactive1;
