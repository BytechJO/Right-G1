import React, { useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";

import find_img from "../../../assets/U1 WB/U5/U5P31EXEI-01.svg";

import highlightPen from "../../../assets/U1 WB/U5/Asset 21.svg";
import highlightBook from "../../../assets/U1 WB/U5/Asset 20.svg";
import highlightEraser from "../../../assets/U1 WB/U5/Asset 22.svg";
import highlightChair1 from "../../../assets/U1 WB/U5/Asset 17.svg";
import highlightChair2 from "../../../assets/U1 WB/U5/Asset 17.svg";
import highlightRuler from "../../../assets/U1 WB/U5/Asset 19.svg";

import ExerciseHeader from "../../ExerciseHeader";

/* =====================================================
   AUDIOS
===================================================== */

import bookAudio from "../../../assets/U1 WB/U5/audio/page_31_qI/book.mp3";
import chairAudio from "../../../assets/U1 WB/U5/audio/page_31_qI/chair.mp3";
import eraserAudio from "../../../assets/U1 WB/U5/audio/page_31_qI/eraser.mp3";
import penAudio from "../../../assets/U1 WB/U5/audio/page_31_qI/pen.mp3";
import rulerAudio from "../../../assets/U1 WB/U5/audio/page_31_qI/ruler.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    key: "pen",
    label: "pen",
    audio: penAudio,

    src: highlightPen,

    area: {
      x1: 8.4395,
      y1: 49.9356,
      x2: 40.7432,
      y2: 54.1393,
    },

    highlight: {
      x: 26.4395,
      y: 31.9356,
      w: 6.2037,
      h: 45.5385,
    },
  },

  {
    key: "book",
    label: "book",
    audio: bookAudio,

    src: highlightBook,

    area: {
      x1: 12.63,
      y1: 31.6881,
      x2: 29.6078,
      y2: 39.4039,
    },

    highlight: {
      x: 10.63,
      y: 31.6881,
      w: 28.9778,
      h: 7.7158,
    },
  },

  {
    key: "eraser",
    label: "eraser",
    audio: eraserAudio,

    src: highlightEraser,

    area: {
      x1: 58.1526,
      y1: 51.0863,
      x2: 62.3726,
      y2: 57.3063,
    },

    highlight: {
      x: 58.1526,
      y: 53.0863,
      w: 4.22,
      h: 4.22,
    },
  },

  {
    key: "chair1",
    label: "chair",
    audio: chairAudio,

    src: highlightChair1,

    area: {
      x1: 24,
      y1: 54.55,
      x2: 40.2822,
      y2: 97.4718,
    },

    highlight: {
      x: 17,
      y: 35.55,
      w: 23.8,
      h: 87.4718,
    },
  },

  {
    key: "chair2",
    label: "chair",
    audio: chairAudio,

    src: highlightChair2,

    area: {
      x1: 75,
      y1: 52.7031,
      x2: 85.8434,
      y2: 97.3487,
    },

    highlight: {
      x: 65.4,
      y: 32.7031,
      w: 24.4434,
      h: 88.3487,
    },
  },

  {
    key: "ruler",
    label: "ruler",
    audio: rulerAudio,

    src: highlightRuler,

    area: {
      x1: 68,
      y1: 43.3326,
      x2: 78.7649,
      y2: 54.5,
    },

    highlight: {
      x: 71,
      y: 46.3326,
      w: 6.518,
      h: 8.1674,
    },
  },
];

/* =====================================================
   HELPERS
===================================================== */

const isInsideArea = (point, area) => {
  if (!point) return false;

  return (
    point.x >= area.x1 &&
    point.x <= area.x2 &&
    point.y >= area.y1 &&
    point.y <= area.y2
  );
};

const getChairRegion = (point) => {
  if (!point) return null;

  const chair1 = items.find((item) => item.key === "chair1");

  const chair2 = items.find((item) => item.key === "chair2");

  if (isInsideArea(point, chair1.area)) {
    return "chair1";
  }

  if (isInsideArea(point, chair2.area)) {
    return "chair2";
  }

  return null;
};

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit5_Page5_Q1 = () => {
  const [selectedKey, setSelectedKey] = useState(null);

  /*
    clicks[key] = { x, y }

    نخزن مكان اختيار الطالب فقط.
    التصحيح يصير عند Check Answer.
  */

  const [clicks, setClicks] = useState({});

  /*
    results[key] =
      "correct"
      "wrong"
  */

  const [results, setResults] = useState({});

  const [showAnswer, setShowAnswer] = useState(false);

  const [playingKey, setPlayingKey] = useState(null);

  const optionRefs = useRef({});

  const audioRef = useRef(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }

    setPlayingKey(null);
  };

  const playItemAudio = (item) => {
    if (!item?.audio) return;

    /*
      نوقف أي صوت شغال قبل تشغيل الصوت الجديد.
    */

    stopAudio();

    const audio = new Audio(item.audio);

    audioRef.current = audio;

    setPlayingKey(item.key);

    audio.play().catch(() => {
      setPlayingKey(null);
    });

    audio.onended = () => {
      setPlayingKey(null);
    };

    audio.onerror = () => {
      setPlayingKey(null);
    };
  };

  /* =====================================================
     QUESTION COMPLETE
  ===================================================== */

  const allCorrect =
    items.length > 0 && items.every((item) => results[item.key] === "correct");

  /* =====================================================
     SELECT WORD
  ===================================================== */

  const handleWordClick = (item) => {
    /*
      العنصر الصحيح مقفل.
      Show Answer يقفل التعديل.
    */

    if (results[item.key] === "correct" || showAnswer) {
      return;
    }

    /*
      onClick يشتغل:
      Mouse
      Enter
      Space

      وبالتالي الصوت يشتغل في الثلاث حالات.
    */

    playItemAudio(item);

    /*
      إذا كان العنصر غلط من Check سابق،
      أول ما يختاره الطالب للتعديل
      نشيل wrong لهذا العنصر فقط.
    */

    if (results[item.key] === "wrong") {
      setResults((prev) => {
        const next = { ...prev };

        delete next[item.key];

        return next;
      });
    }

    setSelectedKey(item.key);
  };

  /* =====================================================
     SAVE POINT
  ===================================================== */

  const savePoint = (key, point) => {
    if (!key) return;

    if (results[key] === "correct" || showAnswer) {
      return;
    }

    setClicks((prev) => ({
      ...prev,

      [key]: point,
    }));

    /*
      إذا كان عليه wrong قديم
      وأعطاه جواب جديد،
      نشيل wrong لهذا العنصر فقط.
    */

    setResults((prev) => {
      if (prev[key] !== "wrong") {
        return prev;
      }

      const next = { ...prev };

      delete next[key];

      return next;
    });

    setSelectedKey(null);

    /*
      بعد اختيار المكان
      نرجع الفوكس لنفس الخيار.
    */

    requestAnimationFrame(() => {
      optionRefs.current[key]?.focus();
    });
  };

  /* =====================================================
     IMAGE CLICK - MOUSE
  ===================================================== */

  const handleImageClick = (e) => {
    if (!selectedKey || showAnswer) return;

    if (results[selectedKey] === "correct") {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;

    const y = ((e.clientY - rect.top) / rect.height) * 100;

    savePoint(selectedKey, {
      x,
      y,
    });
  };

  /* =====================================================
     KEYBOARD TARGET SELECTION
  ===================================================== */

  const handleKeyboardTarget = (e, targetItem) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();

    e.stopPropagation();

    if (!selectedKey || showAnswer) return;

    if (results[selectedKey] === "correct") {
      return;
    }

    const selectedItem = items.find((item) => item.key === selectedKey);

    if (!selectedItem) return;

    const selectedIsChair =
      selectedItem.key === "chair1" || selectedItem.key === "chair2";

    const targetIsChair =
      targetItem.key === "chair1" || targetItem.key === "chair2";

    /*
      Chair:
      أي chair option يقبل
      chair1 أو chair2.

      باقي العناصر:
      كل عنصر يقبل Target الخاص فيه فقط.
    */

    if (selectedIsChair ? !targetIsChair : targetItem.key !== selectedKey) {
      return;
    }

    const centerPoint = {
      x: (targetItem.area.x1 + targetItem.area.x2) / 2,

      y: (targetItem.area.y1 + targetItem.area.y2) / 2,
    };

    savePoint(selectedKey, centerPoint);
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const handleCheck = () => {
    /*
      لما يصير كل شيء صح:
      Check Answer يظل ظاهر
      لكنه no-op.
    */

    if (allCorrect || showAnswer) {
      return;
    }

    const unanswered = items.filter(
      (item) => results[item.key] !== "correct" && !clicks[item.key],
    );

    if (unanswered.length > 0) {
      ValidationAlert.info(
        "Pay attention!",
        "Please find all the objects first.",
      );

      return;
    }

    const newResults = {
      ...results,
    };

    /* =====================================================
       NORMAL ITEMS
    ===================================================== */

    items.forEach((item) => {
      /*
        الإجابة الصحيحة القديمة
        تبقى صحيحة ومقفلة.
      */

      if (results[item.key] === "correct") {
        newResults[item.key] = "correct";

        return;
      }

      /*
        Chairs إلهم تصحيح خاص تحت.
      */

      if (item.key === "chair1" || item.key === "chair2") {
        return;
      }

      const point = clicks[item.key];

      newResults[item.key] = isInsideArea(point, item.area)
        ? "correct"
        : "wrong";
    });

    /* =====================================================
       CHAIRS

       chair1 و chair2:
       أي واحد منهم ممكن يختار أي كرسي.

       لكن نفس الكرسي ما بنحسبه مرتين.
    ===================================================== */

    const chairKeys = ["chair1", "chair2"];

    const usedChairRegions = new Set();

    /*
      نحجز الكراسي اللي كانت صحيحة
      من Check سابق.
    */

    chairKeys.forEach((key) => {
      if (results[key] === "correct") {
        const region = getChairRegion(clicks[key]);

        if (region) {
          usedChairRegions.add(region);
        }
      }
    });

    chairKeys.forEach((key) => {
      /*
        الصحيح القديم يظل صحيح.
      */

      if (results[key] === "correct") {
        newResults[key] = "correct";

        return;
      }

      const point = clicks[key];

      const region = getChairRegion(point);

      /*
        الطالب ما اختار ولا واحد
        من الكرسيين.
      */

      if (!region) {
        newResults[key] = "wrong";

        return;
      }

      /*
        هذا الكرسي مستخدم أصلًا
        من Chair ثاني.
      */

      if (usedChairRegions.has(region)) {
        newResults[key] = "wrong";

        return;
      }

      usedChairRegions.add(region);

      newResults[key] = "correct";
    });

    setResults(newResults);

    setSelectedKey(null);

    const correctCount = Object.values(newResults).filter(
      (value) => value === "correct",
    ).length;

    const total = items.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;">
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    const allCorrectResults = {};

    items.forEach((item) => {
      allCorrectResults[item.key] = "correct";
    });

    const answerClicks = {};

    items.forEach((item) => {
      answerClicks[item.key] = {
        x: (item.area.x1 + item.area.x2) / 2,

        y: (item.area.y1 + item.area.y2) / 2,
      };
    });

    setResults(allCorrectResults);

    setClicks(answerClicks);

    setSelectedKey(null);

    setShowAnswer(true);
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const handleStartAgain = () => {
    stopAudio();

    setSelectedKey(null);

    setClicks({});

    setResults({});

    setShowAnswer(false);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      style={{
        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          gap: "20px",
        }}
      >
        <ExerciseHeader
          sectionLetter="I"
          title="Read, look, and circle."
          subTitle="Find and tap the pen, book, eraser, chairs, and ruler in the scene."
        />

        {/* =================================================
            WORD BANK
        ================================================= */}

        <div
          style={{
            display: "flex",

            width: "100%",

            gap: "10px",

            justifyContent: "center",

            flexWrap: "wrap",
          }}
        >
          {items.map((item) => {
            const result = results[item.key];

            const isSelected = selectedKey === item.key;

            const hasClick = !!clicks[item.key];

            const isCorrect = result === "correct";

            const isPlaying = playingKey === item.key;

            /* ===============================================
               BORDER
            =============================================== */

            let borderStyle;

            if (result === "correct") {
              borderStyle = "2px solid #28a745";
            } else if (result === "wrong") {
              borderStyle = "2px solid #dc3545";
            } else if (isSelected) {
              borderStyle = "2px solid #007bff";
            } else if (hasClick) {
              borderStyle = "2px dashed #007bff";
            } else {
              borderStyle = "1px solid #999";
            }

            /* ===============================================
               BACKGROUND
            =============================================== */

            let bgColor;

            if (result === "correct") {
              bgColor = "#d4edda";
            } else if (result === "wrong") {
              bgColor = "#f8d7da";
            } else if (hasClick) {
              bgColor = "#e8f0fe";
            } else {
              bgColor = "white";
            }

            return (
              <div
                key={item.key}
                style={{
                  position: "relative",

                  display: "inline-flex",
                }}
              >
                {/* ===========================================
                    OPTION
                =========================================== */}

                <button
                  ref={(el) => {
                    optionRefs.current[item.key] = el;
                  }}
                  type="button"
                  /*
                    الصحيح يتقفل
                    وينشال من Tab.
                  */

                  disabled={isCorrect || showAnswer}
                  tabIndex={isCorrect || showAnswer ? -1 : 0}
                  onClick={() => handleWordClick(item)}
                  aria-label={`${item.label}${
                    isPlaying ? ", audio playing" : ""
                  }`}
                  aria-pressed={isSelected}
                  style={{
                    padding: "6px 16px",

                    borderRadius: "12px",

                    background: bgColor,

                    border: borderStyle,

                    cursor: isCorrect || showAnswer ? "default" : "pointer",

                    fontWeight: isSelected ? "bold" : "normal",

                    transition: "all 0.2s",

                    opacity: 1,
                  }}
                >
                  {item.label}
                </button>

                {/* ===========================================
                    AUDIO ICON
                =========================================== */}

                {isPlaying && (
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

                      pointerEvents: "none",

                      zIndex: 5,
                    }}
                  >
                    <FaVolumeUp />
                  </span>
                )}

                {/* ===========================================
                    WRONG X
                =========================================== */}

                {result === "wrong" && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",

                      top: "-8px",

                      right: "-8px",

                      width: "20px",

                      height: "20px",

                      borderRadius: "50%",

                      background: "#dc3545",

                      color: "white",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      fontSize: "11px",

                      fontWeight: "bold",

                      pointerEvents: "none",

                      lineHeight: 1,

                      zIndex: 6,
                    }}
                  >
                    ✕
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          IMAGE
      ================================================= */}

      <div
        style={{
          position: "relative",

          marginTop: "20px",

          display: "inline-block",
        }}
      >
        <img
          src={find_img}
          alt="A classroom scene containing a pen, book, eraser, two chairs, and a ruler for the student to find."
          style={{
            height: "50vh",

            width: "auto",

            cursor: selectedKey && !showAnswer ? "crosshair" : "default",

            display: "block",
          }}
          onClick={handleImageClick}
          draggable="false"
        />

        {/* =================================================
            KEYBOARD TARGET AREAS
        ================================================= */}

        {selectedKey &&
          !showAnswer &&
          items.map((targetItem) => {
            const selectedItem = items.find((item) => item.key === selectedKey);

            if (!selectedItem) {
              return null;
            }

            const selectedIsChair =
              selectedItem.key === "chair1" || selectedItem.key === "chair2";

            const targetIsChair =
              targetItem.key === "chair1" || targetItem.key === "chair2";

            const isRelevantTarget = selectedIsChair
              ? targetIsChair
              : targetItem.key === selectedKey;

            if (!isRelevantTarget) {
              return null;
            }

            const width = targetItem.area.x2 - targetItem.area.x1;

            const height = targetItem.area.y2 - targetItem.area.y1;

            return (
              <button
                key={`target-${targetItem.key}`}
                type="button"
                aria-label={
                  selectedIsChair
                    ? "Select this chair"
                    : `Select ${selectedItem.label}`
                }
                onKeyDown={(e) => handleKeyboardTarget(e, targetItem)}
                style={{
                  position: "absolute",

                  left: `${targetItem.area.x1}%`,

                  top: `${targetItem.area.y1}%`,

                  width: `${width}%`,

                  height: `${height}%`,

                  minWidth: "48px",

                  minHeight: "48px",

                  padding: 0,

                  border: "4px solid transparent",

                  borderRadius: "10px",

                  background: "transparent",

                  /*
                    الماوس يمر للصورة.
                    المنطقة للكيبورد.
                  */

                  pointerEvents: "none",

                  zIndex: 2,
                }}
                className="
                  focus-visible:outline-4
                  focus-visible:outline-blue-600
                  focus-visible:outline-offset-4
                "
              />
            );
          })}

        {/* =================================================
            CLICK DOTS
        ================================================= */}

        {Object.entries(clicks).map(([key, point]) => {
          /*
              إذا الإجابة صارت صحيحة
              نخفي الدوت ويظهر الـ SVG.
            */

          if (results[key] === "correct") {
            return null;
          }

          return (
            <div
              key={key}
              aria-hidden="true"
              style={{
                position: "absolute",

                top: `${point.y}%`,

                left: `${point.x}%`,

                /*
                    نفس شكل الدوت
                    بالكومبوننت السابق.
                  */

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
          );
        })}

        {/* =================================================
            CORRECT HIGHLIGHTS
        ================================================= */}

        {items.map((item) =>
          results[item.key] === "correct" ? (
            <img
              key={item.key}
              src={item.src}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",

                top: `${item.highlight.y}%`,

                left: `${item.highlight.x}%`,

                width: `${item.highlight.w}%`,

                height: `${item.highlight.h}%`,

                pointerEvents: "none",

                objectFit: "fill",
              }}
            />
          ) : null,
        )}
      </div>

      {/* =================================================
          ACTION BUTTONS
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
          className="show-answer-btn swal-continue"
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

export default WB_Unit5_Page5_Q1;
