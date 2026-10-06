import React, { useRef, useState } from "react";

import "./Unit5_Page6_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   IMAGES
===================================================== */

import boyImg from "../../../assets/unit5/sounds/Page 45 - E/boy.png";
import girlImg from "../../../assets/unit5/sounds/Page 45 - E/girl.png";

import mapImg from "../../../assets/unit5/sounds/Page 45 - E/map.jpg";
import deskImg from "../../../assets/unit5/sounds/Page 45 - E/desk.jpg";
import bookImg from "../../../assets/unit5/sounds/Page 45 - E/book.png";
import globeImg from "../../../assets/unit5/sounds/Page 45 - E/globe.png";

/* =====================================================
   AUDIO
===================================================== */

import mapAudio from "../../../assets/unit5/sounds/Page 45 - E/Map.mp3";
import deskAudio from "../../../assets/unit5/sounds/Page 45 - E/Desk.mp3";
import bookAudio from "../../../assets/unit5/sounds/Page 45 - E/Book.mp3";
import globeAudio from "../../../assets/unit5/sounds/Page 45 - E/Globe.mp3";

import whatsThisAudio from "../../../assets/unit5/sounds/Page 45 - E/What's this.mp3";
import thisIsAAudio from "../../../assets/unit5/sounds/Page 45 - E/This is a.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    id: 1,
    word: "map",
    img: mapImg,
    audio: mapAudio,
    alt: "A colorful world map.",
  },

  {
    id: 2,
    word: "desk",
    img: deskImg,
    audio: deskAudio,
    alt: "A wooden school desk with a chair.",
  },

  {
    id: 3,
    word: "book",
    img: bookImg,
    audio: bookAudio,
    alt: "A green book.",
  },

  {
    id: 4,
    word: "globe",
    img: globeImg,
    audio: globeAudio,
    alt: "A globe on a stand.",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Unit5_Page6_Q2 = () => {
  const [selectedWord, setSelectedWord] = useState("");

  const [playingId, setPlayingId] = useState(null);

  const audioRef = useRef(null);

  /* =================================================
     AUDIO
  ================================================= */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingId(null);
  };

  const playAudio = (id, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingId(id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };
  };

  /* =================================================
     SELECT PICTURE
  ================================================= */

  const handlePictureSelect = (item) => {
    setSelectedWord(item.word);

    playAudio(`word-${item.word}`, item.audio);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setSelectedWord("");
  };

  /* =================================================
     KEYBOARD HELPER
  ================================================= */

  const handleKeyboard = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      callback();
    }
  };

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
        <ExerciseHeader sectionLetter="F" title="Ask and answer." subTitle="" />

        {/* =================================================
            DIALOGUE
        ================================================= */}

        <div className="dialogue-unit5-p6-q2">
          {/* BOY */}

          <div className="speaker-unit5-p6-q2">
            <img
              src={boyImg}
              alt="A boy asking a question."
              className="speaker-img-unit5-p6-q2"
            />

            <div
              role="button"
              tabIndex={0}
              aria-label="Play audio: What's this?"
              className="speech-bubble-unit5-p6-q2 audio-control-unit5-p6-q2"
              onClick={() => playAudio("whats-this", whatsThisAudio)}
              onKeyDown={(e) =>
                handleKeyboard(e, () => playAudio("whats-this", whatsThisAudio))
              }
            >
              What's this?
              {playingId === "whats-this" && (
                <FaVolumeUp
                  size={16}
                  aria-hidden="true"
                  className="audio-icon-unit5-p6-q2"
                />
              )}
            </div>
          </div>

          {/* GIRL */}

          <div className="speaker-unit5-p6-q2">
            <div className="answer-bubble-unit5-p6-q2">
              <div
                role="button"
                tabIndex={0}
                aria-label="Play audio: This is a"
                className="audio-control-unit5-p6-q2 this-is-a-unit5-p6-q2"
                onClick={() => playAudio("this-is-a", thisIsAAudio)}
                onKeyDown={(e) =>
                  handleKeyboard(e, () => playAudio("this-is-a", thisIsAAudio))
                }
              >
                This is a
                {playingId === "this-is-a" && (
                  <FaVolumeUp
                    size={16}
                    aria-hidden="true"
                    className="audio-icon-unit5-p6-q2"
                  />
                )}
              </div>

              {/* ANSWER */}

              <span
                className={`answer-word-unit5-p6-q2 ${
                  selectedWord ? "has-answer-unit5-p6-q2" : ""
                }`}
                aria-live="polite"
              >
                {selectedWord}
              </span>

              <span>.</span>
            </div>

            <img
              src={girlImg}
              alt="A girl answering the question."
              className="speaker-img-unit5-p6-q2"
            />
          </div>
        </div>

        {/* =================================================
            PICTURES
        ================================================= */}

        <div className="pictures-row-unit5-p6-q2">
          {items.map((item) => {
            const selected = selectedWord === item.word;

            const playing = playingId === `word-${item.word}`;

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                aria-label={`${item.word}. Press Enter or Space to select this picture and hear its name.`}
                className={`picture-option-unit5-p6-q2 ${
                  selected ? "selected-picture-unit5-p6-q2" : ""
                }`}
                onClick={() => handlePictureSelect(item)}
                onKeyDown={(e) =>
                  handleKeyboard(e, () => handlePictureSelect(item))
                }
              >
                <span className="picture-number-unit5-p6-q2">{item.id}</span>

                <div className="picture-img-wrapper-unit5-p6-q2">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="picture-img-unit5-p6-q2"
                  />

                  {playing && (
                    <FaVolumeUp
                      size={18}
                      aria-hidden="true"
                      className="picture-audio-icon-unit5-p6-q2"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          RESET ONLY
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>
      </div>
    </div>
  );
};

export default Unit5_Page6_Q2;
