import React, { useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page1_Q2.css";

import img1 from "../../../assets/U1 WB/U6/U6P33EXEB-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P33EXEB-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P33EXEB-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P33EXEB-04.svg";
import img5 from "../../../assets/U1 WB/U6/U6P33EXEB-05.svg";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import sheAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_001_She.mp3";
import heAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_002_He.mp3";

import cantAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_003_can't.mp3";
import canAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_004_can.mp3";

import paintPictureAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_005_paint_a_picture.mp3";
import rideBikeAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_006_ride_a_bike.mp3";
import sailBoatAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_007_sail_a_boat.mp3";
import flyKiteAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_008_fly_a_kite.mp3";
import playViolinAudio from "../../../assets/U1 WB/U6/audio/page 33 - B/Item_009_play_the_violin.mp3";

/* =====================================================
   DATA
===================================================== */

const columns = ["He", "She", "can", "can’t"];

const rows = [
  {
    id: 1,

    img: img1,

    alt: "A man painting a picture on an easel outdoors.",

    subject: "He",

    ability: "can",

    text: "paint a picture.",

    audio: paintPictureAudio,
  },

  {
    id: 2,

    img: img2,

    alt: "A child riding a bicycle outdoors.",

    subject: "He",

    ability: "can",

    text: "ride a bike.",

    audio: rideBikeAudio,
  },

  {
    id: 3,

    img: img3,

    alt: "A man sitting in a sailboat on the water.",

    subject: "He",

    ability: "can’t",

    text: "sail a boat.",

    audio: sailBoatAudio,
  },

  {
    id: 4,

    img: img4,

    alt: "A boy standing outdoors with a kite.",

    subject: "He",

    ability: "can’t",

    text: "fly a kite.",

    audio: flyKiteAudio,
  },

  {
    id: 5,

    img: img5,

    alt: "A child playing a violin outdoors beside a tree.",

    subject: "He",

    ability: "can",

    text: "play the violin.",

    audio: playViolinAudio,
  },
];

/* =====================================================
   OPTION AUDIO
===================================================== */

const optionAudio = {
  He: heAudio,
  She: sheAudio,
  can: canAudio,
  "can’t": cantAudio,
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit6_Page1_Q2 = () => {
  /* =================================================
     ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState({});

  /* =================================================
     WRONG FIELDS
  ================================================= */

  const [wrongFields, setWrongFields] = useState([]);

  /* =================================================
     PROGRESSIVE LOCK
  ================================================= */

  const [lockedFields, setLockedFields] = useState([]);

  /* =================================================
     FINAL STATES
  ================================================= */

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) {
      return;
    }

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  /* =================================================
     HELPERS
  ================================================= */

  const fieldKey = (rowId, type) => `${rowId}-${type}`;

  const isFieldLocked = (rowId, type) =>
    lockedFields.includes(fieldKey(rowId, type));

  const isFieldWrong = (rowId, type) =>
    wrongFields.includes(fieldKey(rowId, type));

  /* =================================================
     SELECT
  ================================================= */

  const handleSelect = (rowId, type, value) => {
    if (showAnswerMode || checkCompleted || isFieldLocked(rowId, type)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,

      [rowId]: {
        ...prev[rowId],

        [type]: value,
      },
    }));

    /*
      امسح X بس عن نفس الخانة
      اللي المستخدم عدلها.
    */

    const key = fieldKey(rowId, type);

    setWrongFields((prev) => prev.filter((item) => item !== key));
  };

  /* =================================================
     OPTION ACTIVATE
     AUDIO + SELECT
  ================================================= */

  const activateOption = (rowId, type, value) => {
    const audioKey = `${rowId}-${type}-${value}`;

    playAudio(audioKey, optionAudio[value]);

    /*
      حتى لو locked:
      الصوت يضل شغال.

      بس الاختيار ما يتغير.
    */

    if (!showAnswerMode && !checkCompleted && !isFieldLocked(rowId, type)) {
      handleSelect(rowId, type, value);
    }
  };

  /* =================================================
     CHECK ANSWER
  ================================================= */

  const checkAnswer = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    /* =============================================
       ALL ROWS MUST HAVE SUBJECT + ABILITY
    ============================================= */

    const incomplete = rows.some((row) => {
      const ans = answers[row.id];

      return !ans?.subject || !ans?.ability;
    });

    if (incomplete) {
      ValidationAlert.info("Please complete all rows.");

      return;
    }

    const wrong = [];

    const newlyLocked = [];

    let correctRows = 0;

    rows.forEach((row) => {
      const ans = answers[row.id];

      const subjectCorrect = ans.subject === row.subject;

      const abilityCorrect = ans.ability === row.ability;

      /* =========================================
         SUBJECT
      ========================================= */

      if (subjectCorrect) {
        newlyLocked.push(fieldKey(row.id, "subject"));
      } else {
        wrong.push(fieldKey(row.id, "subject"));
      }

      /* =========================================
         ABILITY
      ========================================= */

      if (abilityCorrect) {
        newlyLocked.push(fieldKey(row.id, "ability"));
      } else {
        wrong.push(fieldKey(row.id, "ability"));
      }

      /* =========================================
         SCORE PER COMPLETE ROW
      ========================================= */

      if (subjectCorrect && abilityCorrect) {
        correctRows++;
      }
    });

    /* =============================================
       PROGRESSIVE LOCKING
    ============================================= */

    setLockedFields((prev) => Array.from(new Set([...prev, ...newlyLocked])));

    /* =============================================
       WRONG ONLY
    ============================================= */

    setWrongFields(wrong);

    const total = rows.length;

    const color =
      correctRows === total ? "green" : correctRows === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        margin-top:10px;
        text-align:center;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${correctRows} / ${total}
        </span>
      </div>
    `;

    /* =============================================
       ALL CORRECT
    ============================================= */

    if (correctRows === total) {
      const allLocked = [];

      rows.forEach((row) => {
        allLocked.push(fieldKey(row.id, "subject"));

        allLocked.push(fieldKey(row.id, "ability"));
      });

      setLockedFields(allLocked);

      setWrongFields([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    /* =============================================
       PARTIAL
    ============================================= */

    if (correctRows === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswer = () => {
    stopAudio();

    const correctAnswers = {};

    const allLocked = [];

    rows.forEach((row) => {
      correctAnswers[row.id] = {
        subject: row.subject,

        ability: row.ability,
      };

      allLocked.push(fieldKey(row.id, "subject"));

      allLocked.push(fieldKey(row.id, "ability"));
    });

    setAnswers(correctAnswers);

    setWrongFields([]);

    setLockedFields(allLocked);

    setShowAnswerMode(true);

    setCheckCompleted(true);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setAnswers({});

    setWrongFields([]);

    setLockedFields([]);

    setShowAnswerMode(false);

    setCheckCompleted(false);
  };

  /* =================================================
     RENDER OPTION
  ================================================= */

  const renderOptionCell = (row, type, value) => {
    const ans = answers[row.id] || {};

    const selected = ans[type] === value;

    const locked = isFieldLocked(row.id, type);

    const wrong = isFieldWrong(row.id, type) && selected;

    const audioKey = `${row.id}-${type}-${value}`;

    const isPlaying = playingKey === audioKey;

    return (
      <td
        role="button"
        /*
          حتى لو correct ومقفول:
          يضل بالـTab عشان الصوت.
        */

        tabIndex={0}
        aria-pressed={selected}
        aria-label={
          locked || showAnswerMode || checkCompleted
            ? `Play audio: ${value}. Answer locked.`
            : `${value}. ${
                selected ? "Selected." : "Not selected."
              } Press Enter or Space to hear and select this answer.`
        }
        onClick={() => activateOption(row.id, type, value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            e.stopPropagation();

            activateOption(row.id, type, value);
          }
        }}
        className={selected ? "selected" : ""}
        style={{
          position: "relative",

          cursor: "pointer",
        }}
      >
        {/* =====================================
            SELECTED CHECK
        ===================================== */}

        {selected && (
          <span className="correct-mark" aria-hidden="true">
            ✓
          </span>
        )}

        {/* =====================================
            WRONG X
        ===================================== */}

        {wrong && (
          <span className="wrong-badge" aria-hidden="true">
            ✕
          </span>
        )}

        {/* =====================================
            AUDIO ICON
        ===================================== */}

        {isPlaying && (
          <FaVolumeUp
            size={15}
            aria-hidden="true"
            className="audio-icon-wb-u6-p1-q2"
          />
        )}
      </td>
    );
  };

  /* =================================================
     RENDER
  ================================================= */

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
          sectionLetter="B"
          title={
            <>
              Look and write{" "}
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
          subTitle="For each picture, tap one word in each column to build the sentence."
        />

        <table className="grammar-table-wb-u6-p1-q2 w-full">
          <thead>
            <tr>
              <th></th>

              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}

              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const sentenceAudioKey = `sentence-${row.id}`;

              const sentencePlaying = playingKey === sentenceAudioKey;

              return (
                <tr key={row.id}>
                  {/* ===================================
                      IMAGE
                  =================================== */}

                  <td className="img-cell">
                    <span className="row-number">{row.id}</span>

                    <img src={row.img} alt={row.alt} />
                  </td>

                  {/* ===================================
                      HE
                  =================================== */}

                  {renderOptionCell(row, "subject", "He")}

                  {/* ===================================
                      SHE
                  =================================== */}

                  {renderOptionCell(row, "subject", "She")}

                  {/* ===================================
                      CAN
                  =================================== */}

                  {renderOptionCell(row, "ability", "can")}

                  {/* ===================================
                      CAN'T
                  =================================== */}

                  {renderOptionCell(row, "ability", "can’t")}

                  {/* ===================================
                      SENTENCE AUDIO
                  =================================== */}

                  <td
                    className="sentence-cell"
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio: ${row.text}`}
                    onClick={() => playAudio(sentenceAudioKey, row.audio)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        e.stopPropagation();

                        playAudio(sentenceAudioKey, row.audio);
                      }
                    }}
                    style={{
                      position: "relative",

                      cursor: "pointer",
                    }}
                  >
                    {row.text}

                    {sentencePlaying && (
                      <FaVolumeUp
                        size={15}
                        aria-hidden="true"
                        className="sentence-audio-icon-wb-u6-p1-q2"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
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

        <button className="check-button2" onClick={checkAnswer}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit6_Page1_Q2;
