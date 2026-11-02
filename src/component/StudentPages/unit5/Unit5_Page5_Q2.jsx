import React, { useRef, useState } from "react";

import "./Unit5_Page5_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/unit5/imgs/U5P44EXEA2-01.svg";
import img2 from "../../../assets/unit5/imgs/U5P44EXEA2-02.svg";
import img3 from "../../../assets/unit5/imgs/U5P44EXEA2-03.svg";
import img4 from "../../../assets/unit5/imgs/U5P44EXEA2-04.svg";
import img5 from "../../../assets/unit5/imgs/U5P44EXEA2-05.svg";
import img6 from "../../../assets/unit5/imgs/U5P44EXEA2-06.svg";

import kiteAudio from "../../../assets/unit5/sounds/Page 44 - A 2/Kite.mp3";
import girlAudio from "../../../assets/unit5/sounds/Page 44 - A 2/Girl.mp3";
import keyAudio from "../../../assets/unit5/sounds/Page 44 - A 2/Key.mp3";

import glueAudio from "../../../assets/unit5/sounds/Page 44 - A 2/Glue.mp3";
import kitchenAudio from "../../../assets/unit5/sounds/Page 44 - A 2/Kitchen.mp3";
import gardenAudio from "../../../assets/unit5/sounds/Page 44 - A 2/Garden.mp3";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   DATA
===================================================== */

const data = [
  {
    id: 1,

    images: [
      {
        id: 1,
        src: img1,
        value: "kite",
        alt: "A colorful kite with a green tail.",
        audio: kiteAudio,
      },

      {
        id: 2,
        src: img2,
        value: "girl",
        alt: "A young girl with brown hair in pigtails.",
        audio: girlAudio,
      },

      {
        id: 3,
        src: img3,
        value: "key",
        alt: "A gray metal key.",
        audio: keyAudio,
      },
    ],

    correct: ["kite", "key"],
  },

  {
    id: 2,

    images: [
      {
        id: 1,
        src: img4,
        value: "glue",
        alt: "Green glue coming out of a tube.",
        audio: glueAudio,
      },

      {
        id: 2,
        src: img5,
        value: "kitchen",
        alt: "A kitchen with cabinets, a sink, and a stove.",
        audio: kitchenAudio,
      },

      {
        id: 3,
        src: img6,
        value: "garden",
        alt: "A garden with grass, flowers, trees, and a house.",
        audio: gardenAudio,
      },
    ],

    correct: ["glue", "garden"],
  },
];

/* =====================================================
   COMPONENT
===================================================== */

export default function Unit5_Page5_Q2() {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState({});

  const [wrongSelections, setWrongSelections] = useState([]);

  const [lockedSelections, setLockedSelections] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingValue, setPlayingValue] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingValue(null);
  };

  const playAudio = (value, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingValue(value);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingValue(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingValue(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingValue(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const selectionKey = (qId, value) => `${qId}-${value}`;

  const isLocked = (qId, value) =>
    lockedSelections.includes(selectionKey(qId, value));

  const isWrong = (qId, value) =>
    wrongSelections.includes(selectionKey(qId, value));

  /* =================================================
     SELECT
  ================================================= */

  const handleSelect = (qId, value) => {
    if (showAnswer || checkCompleted || isLocked(qId, value)) {
      return;
    }

    setAnswers((prev) => {
      const current = prev[qId] || [];

      /*
        إذا مختارة وهي غلط / غير مقفلة
        شيلها.
      */

      if (current.includes(value)) {
        return {
          ...prev,

          [qId]: current.filter((item) => item !== value),
        };
      }

      /*
        السؤال يسمح باختيار صورتين فقط
      */

      if (current.length >= 2) {
        return prev;
      }

      return {
        ...prev,

        [qId]: [...current, value],
      };
    });

    /*
      شيل X فقط عن نفس الخيار
    */

    setWrongSelections((prev) =>
      prev.filter((key) => key !== selectionKey(qId, value)),
    );
  };

  /* =================================================
     IMAGE ACTIVATION
  ================================================= */

  const activateImage = (qId, image) => {
    playAudio(image.value, image.audio);

    handleSelect(qId, image.value);
  };

  /* =================================================
     CHECK
  ================================================= */

  const handleCheck = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      لازم صورتين بكل سؤال
    */

    for (const question of data) {
      const selected = answers[question.id] || [];

      if (selected.length < 2) {
        ValidationAlert.info(
          `Please select two pictures in question ${question.id}.`,
        );

        return;
      }
    }

    let correctCount = 0;

    const wrong = [];

    const newlyLocked = [];

    data.forEach((question) => {
      const selected = answers[question.id] || [];

      selected.forEach((value) => {
        const key = selectionKey(question.id, value);

        if (question.correct.includes(value)) {
          correctCount++;

          newlyLocked.push(key);
        } else {
          wrong.push(key);
        }
      });
    });

    /*
      Progressive lock:
      الصح فقط يقفل
    */

    setLockedSelections((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    setWrongSelections(wrong);

    const total = data.reduce(
      (sum, question) => sum + question.correct.length,

      0,
    );

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      /*
        كل الصح موجود.
      */

      const allCorrectKeys = data.flatMap((question) =>
        question.correct.map((value) => selectionKey(question.id, value)),
      );

      setLockedSelections(allCorrectKeys);

      setWrongSelections([]);

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

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const handleShowAnswer = () => {
    stopAudio();

    const correctAnswersObj = {};

    const correctKeys = [];

    data.forEach((question) => {
      correctAnswersObj[question.id] = [...question.correct];

      question.correct.forEach((value) => {
        correctKeys.push(selectionKey(question.id, value));
      });
    });

    setAnswers(correctAnswersObj);

    setWrongSelections([]);

    setLockedSelections(correctKeys);

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const handleReset = () => {
    stopAudio();

    setAnswers({});

    setWrongSelections([]);

    setLockedSelections([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  /* =================================================
     RENDER
  ================================================= */

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
          gap: "50px",
        }}
      >
        <ExerciseHeader
          questionNumber="2"
          title="Which pictures begin with the same sound? Circle."
          subTitle="Say the picture names, then tap the pictures that begin with the same sound."
        />

        {data.map((question) => (
          <div key={question.id} className="question-row-Unit5_Page5_Q2">
            <span
              className="q-number"
              style={{
                color: "#2c5287",

                fontSize: "20px",

                fontWeight: "700",
              }}
            >
              {question.id}.
            </span>

            <div className="images-row-Unit5_Page5_Q2">
              {question.images.map((image) => {
                const selected = answers[question.id]?.includes(image.value);

                const wrong = isWrong(question.id, image.value);

                const locked = isLocked(question.id, image.value);

                const playing = playingValue === image.value;

                return (
                  <div
                    key={image.id}
                    role="button"
                    tabIndex={showAnswer || checkCompleted || locked ? -1 : 0}
                    aria-pressed={!!selected}
                    aria-label={`${image.value}${
                      selected ? ", selected" : ""
                    }. Press Enter or Space to play the word and ${
                      selected ? "remove the selection" : "select the picture"
                    }.`}
                    className={`
                        img-box-Unit5_Page5_Q2

                        ${selected ? "selected-Unit5_Page5_Q2" : ""}

                        ${wrong ? "wrong" : ""}

                        ${locked ? "locked-Unit5_Page5_Q2" : ""}
                      `}
                    style={{
                      position: "relative",

                      cursor:
                        showAnswer || checkCompleted || locked
                          ? "default"
                          : "pointer",

                      userSelect: "none",
                    }}
                    onClick={() => activateImage(question.id, image)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        e.stopPropagation();

                        activateImage(question.id, image);
                      }
                    }}
                  >
                    <img src={image.src} alt={image.alt} />

                    {/* =========================
                          AUDIO PLAYING ICON
                      ========================= */}

                    {playing && (
                      <FaVolumeUp
                        size={18}
                        aria-hidden="true"
                        className="audio-icon-Unit5_Page5_Q2"
                      />
                    )}

                    {/* =========================
                          WRONG
                      ========================= */}

                    {!showAnswer && wrong && (
                      <div
                        className="wrong-mark-Unit5_Page5_Q2-1"
                        aria-hidden="true"
                      >
                        ✕
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleReset}>
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={handleCheck} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
