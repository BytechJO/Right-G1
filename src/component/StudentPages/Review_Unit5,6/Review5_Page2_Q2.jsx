import React, { useState } from "react";
import "./Review5_Page2_Q2.css";

import sound1 from "../../../assets/unit6/sounds/U6P53EXEE.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";

import img1a from "../../../assets/unit6/imgs/U6P53EXEE01-01.svg";
import img1b from "../../../assets/unit6/imgs/U6P53EXEE01-02.svg";
import img1c from "../../../assets/unit6/imgs/U6P53EXEE01-03.svg";

import img2a from "../../../assets/unit6/imgs/U6P53EXEE02-01.svg";
import img2b from "../../../assets/unit6/imgs/U6P53EXEE02-02.svg";
import img2c from "../../../assets/unit6/imgs/U6P53EXEE02-03.svg";

import img3a from "../../../assets/unit6/imgs/U6P53EXEE03-01.svg";
import img3b from "../../../assets/unit6/imgs/U6P53EXEE03-02.svg";
import img3c from "../../../assets/unit6/imgs/U6P53EXEE03-03.svg";

import img4a from "../../../assets/unit6/imgs/U6P53EXEE04-01.svg";
import img4b from "../../../assets/unit6/imgs/U6P53EXEE04-02.svg";
import img4c from "../../../assets/unit6/imgs/U6P53EXEE04-03.svg";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DATA
===================================================== */

const groups = [
  {
    images: [
      {
        src: img1a,
        alt: "A white goose standing upright.",
        name: "goose",
      },
      {
        src: img1b,
        alt: "A large entrance gate.",
        name: "gate",
      },
      {
        src: img1c,
        alt: "A whole kiwi fruit and a sliced kiwi.",
        name: "kiwi",
      },
    ],

    // goose + gate = g
    // kiwi = k
    different: 2,
  },

  {
    images: [
      {
        src: img2a,
        alt: "A boy kicking a soccer ball.",
        name: "kick",
      },
      {
        src: img2b,
        alt: "A brown goat.",
        name: "goat",
      },
      {
        src: img2c,
        alt: "A colorful kite.",
        name: "kite",
      },
    ],

    // kick + kite = k
    // goat = g
    different: 1,
  },

  {
    images: [
      {
        src: img3a,
        alt: "A king wearing a crown.",
        name: "king",
      },
      {
        src: img3b,
        alt: "A bulb of garlic with peeled cloves.",
        name: "garlic",
      },
      {
        src: img3c,
        alt: "A colorful board game.",
        name: "game",
      },
    ],

    // garlic + game = g
    // king = k
    different: 0,
  },

  {
    images: [
      {
        src: img4a,
        alt: "A brown kangaroo.",
        name: "kangaroo",
      },
      {
        src: img4b,
        alt: "A metal key.",
        name: "key",
      },
      {
        src: img4c,
        alt: "A bunch of purple grapes.",
        name: "grapes",
      },
    ],

    // kangaroo + key = k
    // grapes = g
    different: 2,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Review5_Page2_Q2 = () => {
  const [selected, setSelected] = useState(Array(groups.length).fill(null));

  /*
    فقط الأسئلة الغلط بعد Check
  */
  const [wrongGroups, setWrongGroups] = useState([]);

  /*
    الأسئلة الصح فقط تقفل
  */
  const [lockedGroups, setLockedGroups] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const stopAtSecond = 9;

  /* =====================================================
     CAPTIONS
  ===================================================== */

  const captions = [
    {
      start: 0,
      end: 9.04,
      text: "Page 53, exercise E. Which picture begins with a different sound? Listen and write X.",
    },

    {
      start: 9.06,
      end: 13.14,
      text: "1. goose, gate, kiwi.",
    },

    {
      start: 13.16,
      end: 17.17,
      text: "2. kick, goat, kite.",
    },

    {
      start: 17.19,
      end: 22.06,
      text: "3. king, garlic, game.",
    },

    {
      start: 22.08,
      end: 27.09,
      text: "4. kangaroo, key, grapes.",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isGroupLocked = (groupIndex) => lockedGroups.includes(groupIndex);

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (groupIndex, imageIndex) => {
    if (showAnswer || checkCompleted || isGroupLocked(groupIndex)) {
      return;
    }

    setSelected((prev) => {
      const updated = [...prev];

      updated[groupIndex] = imageIndex;

      return updated;
    });

    /*
      امسح الغلط فقط من نفس السؤال
    */

    setWrongGroups((prev) => prev.filter((index) => index !== groupIndex));
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      لازم كل سؤال يكون مختار
    */

    if (selected.some((value) => value === null)) {
      ValidationAlert.info(
        "Oops!",
        "Please select one picture in each group before checking.",
      );

      return;
    }

    let correctCount = 0;

    const wrong = [];
    const correctNow = [];

    groups.forEach((group, index) => {
      const isCorrect = selected[index] === group.different;

      if (isCorrect) {
        correctCount++;

        correctNow.push(index);
      } else {
        wrong.push(index);
      }
    });

    /*
      progressive locking:
      الصح فقط يقفل
    */

    setLockedGroups((prev) => Array.from(new Set([...prev, ...correctNow])));

    /*
      الغلط يظل editable
    */

    setWrongGroups(wrong);

    const total = groups.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px; margin-top:10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedGroups(groups.map((_, index) => index));

      setWrongGroups([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    /*
      kiwi / goat / king / grapes
    */

    const correctSelections = groups.map((group) => group.different);

    setSelected(correctSelections);

    setWrongGroups([]);

    setLockedGroups(groups.map((_, index) => index));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setSelected(Array(groups.length).fill(null));

    setWrongGroups([]);

    setLockedGroups([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  /* =====================================================
     RENDER
  ===================================================== */

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
          justifyContent: "flex-start",
        }}
      >
        <ExerciseHeaderReview
          sectionLetter="E"
          title={
            <>
              Which picture begins with a{" "}
              <span style={{ color: "red" }}>different sound</span>? Listen and
              write <span style={{ color: "red" }}>✗</span>.
            </>
          }
          subTitle="Listen to the picture names, then tap the one with a different beginning sound."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="Review5_Page2_QE"
        />

        {/* =================================================
            GROUPS
        ================================================= */}

        <div className="exercise-row-review5-p2-q2">
          {groups.map((group, gIndex) => {
            const locked = isGroupLocked(gIndex);

            const groupWrong = wrongGroups.includes(gIndex);

            return (
              <div className="ds-group-box-review5-p2-q2" key={gIndex}>
                <span
                  style={{
                    color: "darkblue",
                    fontWeight: "700",
                  }}
                >
                  {gIndex + 1}
                </span>

                {group.images.map((image, iIndex) => {
                  const isSelected = selected[gIndex] === iIndex;

                  const isCorrect = group.different === iIndex;

                  const wrongSelected = groupWrong && isSelected && !isCorrect;

                  return (
                    <div
                      key={iIndex}
                      role="button"
                      /*
                          الصح المقفول ينشال من Tab.
                          الغلط يظل reachable.
                        */

                      tabIndex={locked ? -1 : 0}
                      aria-pressed={isSelected}
                      aria-label={`Select ${image.name} in group ${
                        gIndex + 1
                      } as the picture with a different beginning sound.`}
                      className={`ds-image-wrapper-review5-p2-q2 ${
                        isSelected ? "selected-review5-p2-q2" : ""
                      }`}
                      onClick={() => handleSelect(gIndex, iIndex)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          handleSelect(gIndex, iIndex);
                        }
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="ds-image-review5-p2-q2"
                      />

                      {/* =================================
                            STUDENT X
                        ================================= */}

                      {isSelected && (
                        <div className="ds-x" aria-hidden="true">
                          ✕
                        </div>
                      )}

                      {/* =================================
                            WRONG INDICATOR AFTER CHECK
                        ================================= */}

                      {wrongSelected && (
                        <span
                          className="wrong-x-circle-review5-p2-q2"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review5_Page2_Q2;
