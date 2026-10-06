import React, { useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "./Popup/ValidationAlert";
import SquirrelGif from "../assets/Squirrel_GIF/Squirrel_1164_1433px.gif";

const FindQuestion = ({
  title,
  subtitle,

  image,
  imageAlt,

  targetName,
  targetArea,

  answerHighlight,

  targetAudio,

  imageHeight = "75vh",

  highlightTop,
  highlightLeft,
  highlightWidth,
  highlightHeight,

  targetAriaLabel,

  pointerSelectedMessage,
  keyboardSelectedMessage,

  correctAnnouncement,
  correctAlertMessage,

  wrongAnnouncement,
  wrongAlertMessage,

  resetAnnouncement,
  showAnswerAnnouncement,
}) => {
  const [clickedPoint, setClickedPoint] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [selectionMethod, setSelectionMethod] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const [playingTarget, setPlayingTarget] = useState(false);

  const audioRef = useRef(null);

  /* =====================================================
     TARGET AUDIO
  ===================================================== */

  const playTargetAudio = () => {
    /*
      الصوت مسموح فقط بعد:
      - Check Answer + correct
      أو
      - Show Answer
    */
    if (!targetAudio || (checkResult !== "success" && !showAnswer)) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(targetAudio);

    audioRef.current = audio;

    setPlayingTarget(true);

    audio.play();

    audio.onended = () => {
      setPlayingTarget(false);
    };

    audio.onerror = () => {
      setPlayingTarget(false);
    };
  };

  /* =====================================================
     STOP TARGET AUDIO
  ===================================================== */

  const stopTargetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingTarget(false);
  };

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
     MOUSE / TOUCH ONLY
  ===================================================== */

  const handleImageClick = (e) => {
    if (showAnswer) return;

    /*
      إذا الإجابة صارت صحيحة:
      منطقة الهدف نفسها بتصير مسؤولة عن الصوت.
      باقي الصورة ما بنعمل عليها اختيار جديد.
    */
    if (checkResult === "success") return;

    const rect = e.currentTarget.getBoundingClientRect();

    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;

    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    const inside =
      xPercent >= targetArea.x1 &&
      xPercent <= targetArea.x2 &&
      yPercent >= targetArea.y1 &&
      yPercent <= targetArea.y2;

    /*
      بالماوس:
      لا نظهر الـ Target Area.
      فقط نخزن مكان النقطة.
    */
    selectPoint(
      {
        x: xPercent,
        y: yPercent,
        inside,
      },

      pointerSelectedMessage,

      "pointer",
    );
  };

  /* =====================================================
     KEYBOARD TARGET
  ===================================================== */

  const handleTargetSelection = (e) => {
    /*
      بعد الإجابة الصحيحة أو Show Answer:
      هذا الـ target يتحول إلى Audio Replay Target.
    */
    if (checkResult === "success" || showAnswer) {
      playTargetAudio();
      return;
    }

    /*
      قبل التصحيح:
      نسمح فقط بتفعيل الـ target بالكيبورد.

      mouse clicks لازم تمر للصورة نفسها
      وليس للـ button.
    */
    const method = e.detail === 0 ? "keyboard" : "pointer";

    if (method !== "keyboard") return;

    const point = {
      x: targetArea.x1 + (targetArea.x2 - targetArea.x1) / 2,

      y: targetArea.y1 + (targetArea.y2 - targetArea.y1) / 2,

      inside: true,
    };

    selectPoint(
      point,

      keyboardSelectedMessage,

      "keyboard",
    );
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const handleCheck = () => {
    if (showAnswer) return;

    /*
      بعد النجاح النهائي:
      Check Answer no-op.
    */
    if (checkResult === "success") return;

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

      setAnnouncement(correctAnnouncement);

      ValidationAlert.success("Bravo!", correctAlertMessage);

      /*
        مهم:
        لا نشغل targetAudio هون.
        الصوت يصير متاح فقط بعد التصحيح الصحيح.
      */
    } else {
      setCheckResult("fail");

      setAnnouncement(wrongAnnouncement);

      ValidationAlert.error("Oops!", wrongAlertMessage);
    }
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const handleStartAgain = () => {
    stopTargetAudio();

    setClickedPoint(null);

    setCheckResult(null);

    setShowAnswer(false);

    setSelectionMethod(null);

    setAnnouncement(resetAnnouncement);
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopTargetAudio();

    setShowAnswer(true);

    setClickedPoint(null);

    setCheckResult(null);

    setSelectionMethod(null);

    setAnnouncement(showAnswerAnnouncement);
  };

  /* =====================================================
     STATES
  ===================================================== */

  const targetSelected = clickedPoint?.inside === true;

  /*
    Target border قبل Check يظهر فقط
    إذا الاختيار تم بالكيبورد.
  */
  const keyboardTargetSelected =
    targetSelected && selectionMethod === "keyboard";

  const isCorrect = checkResult === "success" || showAnswer;

  /*
    قبل التصحيح:
    Border فقط للكيبورد.

    بعد التصحيح الصحيح:
    Border أخضر.
  */
  const showBorder = keyboardTargetSelected || isCorrect;

  const showTargetHighlight = checkResult === "success" || showAnswer;

  const audioEnabled = checkResult === "success" || showAnswer;

  const targetWidth = targetArea.x2 - targetArea.x1;

  const targetHeight = targetArea.y2 - targetArea.y1;

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {/* =================================================
            INSTRUCTIONS
        ================================================= */}

        <div
          id="find-question-instructions"
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
              {title}
            </h5>

            <p className="sub-header">{subtitle}</p>
          </div>
        </div>

        {/* =================================================
            SCREEN READER STATUS
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
            src={image}
            alt={imageAlt}
            draggable="false"
            style={{
              width: "auto",
              height: imageHeight,

              cursor: showAnswer ? "default" : "crosshair",

              borderRadius: "8px",

              display: "block",
            }}
            onClick={handleImageClick}
          />

          {/* =================================================
              ACCESSIBLE TARGET AREA

              قبل النجاح:
              - keyboard focus موجود
              - الماوس يمر من خلاله للصورة

              بعد النجاح:
              - يصير clickable بالماوس
              - Enter / Space يشغل الصوت
          ================================================= */}

          <button
            type="button"
            className="
              focus-visible:outline-4
              focus-visible:outline-blue-600
              focus-visible:outline-offset-4
            "
            aria-label={
              audioEnabled ? `Play audio for ${targetName}` : targetAriaLabel
            }
            aria-describedby="find-question-instructions"
            aria-pressed={targetSelected}
            onClick={handleTargetSelection}
            style={{
              position: "absolute",

              left: `${targetArea.x1}%`,

              top: `${targetArea.y1}%`,

              width: `${targetWidth}%`,

              height: `${targetHeight}%`,

              minWidth: "48px",
              minHeight: "48px",

              zIndex: 2,

              padding: 0,

              /*
                مهم:
                قبل التصحيح الماوس ما بمسك الـ target.
                الضغط يروح للصورة كاملة.

                بعد الصح بصير clickable.
              */
              pointerEvents: audioEnabled ? "auto" : "none",

              border: showBorder
                ? `4px dashed ${isCorrect ? "#16a34a" : "#2c5287"}`
                : "4px dashed transparent",

              borderRadius: "12px",

              background: isCorrect
                ? "rgba(34, 197, 94, 0.25)"
                : keyboardTargetSelected
                  ? "rgba(44, 82, 135, 0.15)"
                  : "transparent",

              cursor: audioEnabled ? "pointer" : "default",

              touchAction: "manipulation",
            }}
          >
            {/* =================================================
                TARGET NAME
            ================================================= */}

            {isCorrect && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "-14px",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  padding: "2px 10px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#fff",
                  background: "#16a34a",
                }}
              >
                ✓ {targetName}
              </span>
            )}

            {/* =================================================
                AUDIO ICON
            ================================================= */}

            {playingTarget && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",

                  top: "-10px",

                  right: "-10px",

                  width: "24px",

                  height: "24px",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  background: "#fff",

                  borderRadius: "50%",

                  fontSize: "13px",

                  boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                }}
              >
                <FaVolumeUp />
              </span>
            )}
          </button>

          {/* =================================================
              RED CLICK POINT

              بالماوس دائماً نظهر مكان ضغطه
              بدون إظهار Target Area قبل Check.
          ================================================= */}

          {clickedPoint &&
            selectionMethod === "pointer" &&
            checkResult !== "success" && (
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
          ================================================= */}

          {showTargetHighlight && (
            <img
              src={answerHighlight}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",

                top: highlightTop,

                left: highlightLeft,

                width: highlightWidth,

                height: highlightHeight,

                pointerEvents: "none",
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

export default FindQuestion;
