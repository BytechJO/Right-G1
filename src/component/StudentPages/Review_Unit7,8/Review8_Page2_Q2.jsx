import React, { useRef, useState } from "react";

import "./Review8_Page2_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit8/imgs/U8P73EXEE-01.svg";
import img2 from "../../../assets/unit8/imgs/U8P73EXEE-02.svg";
import img3 from "../../../assets/unit8/imgs/U8P73EXEE-03.svg";
import img4 from "../../../assets/unit8/imgs/U8P73EXEE-04.svg";
import img5 from "../../../assets/unit8/imgs/U8P73EXEE-05.svg";
import img6 from "../../../assets/unit8/imgs/U8P73EXEF-04.svg";

import sound1 from "../../../assets/unit8/sound/U8P73EXEE.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DATA
===================================================== */

const shapesData = [
  {
    id: 1,
    img: img1,
    alt: "A bowl of soup with a spoon.",
    name: "soup",
    correct: "S",
  },

  {
    id: 2,
    img: img2,
    alt: "A brown sack tied at the top.",
    name: "sack",
    correct: "S",
  },

  {
    id: 3,
    img: img3,
    alt: "A zoo with animal enclosures and a zoo sign.",
    name: "zoo",
    correct: "Z",
  },

  {
    id: 4,
    img: img4,
    alt: "A metal spoon.",
    name: "spoon",
    correct: "S",
  },

  {
    id: 5,
    img: img5,
    alt: "A black-and-white zebra.",
    name: "zebra",
    correct: "Z",
  },

  {
    id: 6,
    img: img6,
    alt: "A close-up illustration of a zipper.",
    name: "zipper",
    correct: "Z",
  },
];

const options = ["S", "Z"];

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Review8_Page2_Q2 = () => {
  /* =====================================================
     ANSWERS
  ===================================================== */

  const [answers, setAnswers] = useState({});

  /*
    {
      1: "correct" | "wrong" | undefined,
      2: ...
    }
  */

  const [results, setResults] = useState({});

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     CELL REFS
     key example:
     "1-S"
     "1-Z"
     "2-S"
  ===================================================== */

  const cellRefs = useRef({});

  /* =====================================================
     AUDIO PLAYER
  ===================================================== */

  const stopAtSecond = 8.22;

  const captions = [
    {
      start: 0,
      end: 8.22,
      text: "Page 73, Exercise E. What letter does it begin with? Listen and write check.",
    },

    {
      start: 8.25,
      end: 10.02,
      text: "Soup",
    },

    {
      start: 10.05,
      end: 11.05,
      text: "sack",
    },

    {
      start: 11.07,
      end: 12.16,
      text: "zoo",
    },

    {
      start: 12.18,
      end: 14.06,
      text: "spoon",
    },

    {
      start: 14.09,
      end: 15.09,
      text: "zebra",
    },

    {
      start: 15.12,
      end: 17.02,
      text: "zipper",
    },
  ];

  /* =====================================================
     HELPERS
  ===================================================== */

  const isItemLocked = (id) => showAnswerMode || results[id] === "correct";

  const allCorrect = shapesData.every((item) => results[item.id] === "correct");

  /* =====================================================
     SELECT
  ===================================================== */

  const handleSelect = (imgId, letter) => {
    if (isItemLocked(imgId)) return;

    setAnswers((prev) => ({
      ...prev,
      [imgId]: letter,
    }));

    /*
      تعديل نفس الصورة:
      شيل wrong state عنها فقط
    */

    setResults((prev) => {
      const updated = { ...prev };

      if (updated[imgId] === "wrong") {
        delete updated[imgId];
      }

      return updated;
    });
  };

  /* =====================================================
     KEYBOARD TAB ORDER

     المطلوب:
     Picture 1:
     S
     ↓
     Z
     ↓
     Picture 2:
     S
     ↓
     Z
     ...
  ===================================================== */

  const moveCellFocus = (itemId, letter, backwards = false) => {
    const editableItems = shapesData.filter((item) => !isItemLocked(item.id));

    if (!editableItems.length) {
      return false;
    }

    const currentIndex = editableItems.findIndex((item) => item.id === itemId);

    if (currentIndex === -1) {
      return false;
    }

    /* =====================================================
     NORMAL TAB
  ===================================================== */

    if (!backwards) {
      // S → Z لنفس الصورة
      if (letter === "S") {
        const target = cellRefs.current[`${itemId}-Z`];

        if (target) {
          target.focus();
          return true;
        }

        return false;
      }

      // Z → S للصورة التالية
      if (letter === "Z") {
        /*
        إذا هاي آخر صورة editable:
        لا نتحكم بالـTab.
        خليه يطلع من الجدول طبيعي.
      */
        if (currentIndex === editableItems.length - 1) {
          return false;
        }

        const nextItem = editableItems[currentIndex + 1];

        const target = cellRefs.current[`${nextItem.id}-S`];

        if (target) {
          target.focus();
          return true;
        }

        return false;
      }
    }

    /* =====================================================
     SHIFT + TAB
  ===================================================== */

    if (backwards) {
      // Z → S لنفس الصورة
      if (letter === "Z") {
        const target = cellRefs.current[`${itemId}-S`];

        if (target) {
          target.focus();
          return true;
        }

        return false;
      }

      // S → Z للصورة السابقة
      if (letter === "S") {
        /*
        إذا هاي أول صورة editable:
        لا نتحكم بـ Shift + Tab.
        خليه يطلع من الجدول طبيعي للخلف.
      */
        if (currentIndex === 0) {
          return false;
        }

        const previousItem = editableItems[currentIndex - 1];

        const target = cellRefs.current[`${previousItem.id}-Z`];

        if (target) {
          target.focus();
          return true;
        }

        return false;
      }
    }

    return false;
  };
  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    /*
      بعد Show Answer
      أو إذا الكل صح:
      no-op
    */

    if (showAnswerMode || allCorrect) return;

    /* =================================================
       CHECK EMPTY
    ================================================= */

    const hasEmpty = shapesData.some(
      (item) => results[item.id] !== "correct" && !answers[item.id],
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please choose an answer for each picture.",
      );

      return;
    }

    /* =================================================
       RESULTS
    ================================================= */

    const nextResults = {
      ...results,
    };

    let score = 0;

    shapesData.forEach((item) => {
      /*
        إذا كانت صح من Check سابق:
        خليها correct ومقفولة
      */

      if (results[item.id] === "correct") {
        nextResults[item.id] = "correct";

        score++;

        return;
      }

      if (answers[item.id] === item.correct) {
        nextResults[item.id] = "correct";

        score++;
      } else {
        nextResults[item.id] = "wrong";
      }
    });

    setResults(nextResults);

    /* =================================================
       SCORE
    ================================================= */

    const total = shapesData.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      ValidationAlert.success(msg);
    } else if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswer = () => {
    const correctSelections = {};

    const correctResults = {};

    shapesData.forEach((item) => {
      correctSelections[item.id] = item.correct;

      correctResults[item.id] = "correct";
    });

    setAnswers(correctSelections);

    setResults(correctResults);

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setAnswers({});

    setResults({});

    setShowAnswerMode(false);
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
          gap: "30px",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <ExerciseHeaderReview
          sectionLetter="E"
          title={
            <>
              What letter does it begin with? Listen and write{" "}
              <span
                style={{
                  color: "red",
                }}
              >
                ✓
              </span>
              .
            </>
          }
          subTitle="Listen to each item, then tap the correct s or z answer."
        />

        {/* =================================================
            QUESTION AUDIO
        ================================================= */}

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="Review8_Page73_QE"
        />

        {/* =================================================
            TABLE
        ================================================= */}

        <table className="shapes-table-wrapper-review8-p2-q2 w-full">
          {/* =================================================
              IMAGE HEADER
          ================================================= */}

          <thead>
            <tr>
              <th
                className="transparent-border"
                style={{
                  backgroundColor: "white",
                }}
              />

              {shapesData.map((item) => (
                <th key={item.id}>
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="shape-img-wrapper-review4-p1-q3"
                    style={{
                      height: "100%",
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>

          {/* =================================================
              OPTIONS
          ================================================= */}

          <tbody>
            {options.map((letter) => (
              <tr key={letter}>
                {/* ROW LETTER */}

                <td className="img-cell-wrapper-review8-p2-q2">
                  <strong
                    style={{
                      fontSize: "25px",
                    }}
                  >
                    {letter}
                  </strong>
                </td>

                {/* =================================================
                    CELLS
                ================================================= */}

                {shapesData.map((item) => {
                  const selected = answers[item.id] === letter;

                  const itemLocked = isItemLocked(item.id);

                  const isWrong = results[item.id] === "wrong" && selected;

                  return (
                    <td
                      key={item.id}
                      /* =============================================
                         REF
                      ============================================== */

                      ref={(node) => {
                        if (node) {
                          cellRefs.current[`${item.id}-${letter}`] = node;
                        }
                      }}
                      /* =============================================
                         ACCESSIBILITY
                      ============================================== */

                      role="button"
                      tabIndex={itemLocked ? -1 : 0}
                      aria-disabled={itemLocked}
                      aria-pressed={selected}
                      aria-label={`${item.name}. Letter ${letter}${
                        selected ? ". Selected." : ""
                      }`}
                      /* =============================================
                         CLASS
                      ============================================== */

                      className={`
                        cell-wrapper-review4-p1-q3

                        ${selected ? "selected-review8-p2-q2" : ""}

                        ${isWrong ? "wrong-cell-review8-p2-q2" : ""}
                      `}
                      /* =============================================
                         MOUSE
                      ============================================== */

                      onClick={() => {
                        if (itemLocked) return;

                        handleSelect(item.id, letter);
                      }}
                      /* =============================================
                         KEYBOARD
                      ============================================== */

                      onKeyDown={(e) => {
                        if (itemLocked) return;

                        /* =========================================
                           TAB / SHIFT + TAB

                           مهم:
                           نمنع Browser default
                           ونمشي عمودي حسب الصورة.
                        ========================================== */

                        if (e.key === "Tab") {
                          const handled = moveCellFocus(
                            item.id,
                            letter,
                            e.shiftKey,
                          );

                          /*
    نمنع Tab الطبيعي فقط إذا إحنا
    نقلنا الـfocus داخل الجدول.
  */
                          if (handled) {
                            e.preventDefault();
                          }

                          return;
                        }
                        /* =========================================
                           ENTER / SPACE
                        ========================================== */

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          handleSelect(item.id, letter);
                        }
                      }}
                    >
                      {/* =================================================
                          SELECTED CHECK
                      ================================================= */}

                      {selected && (
                        <span
                          className="correct-mark-review8-p2-q2"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      )}

                      {/* =================================================
                          WRONG X
                      ================================================= */}

                      {isWrong && (
                        <div
                          className="wrong-badge-review8-p2-q2"
                          aria-hidden="true"
                        >
                          ✕
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button onClick={showAnswer} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review8_Page2_Q2;
