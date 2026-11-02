import React, { useRef, useState } from "react";

import "./Unit7_Page6_Q1.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   IMAGES
===================================================== */

import purpleBoy from "../../../assets/unit7/sound/Page 63 - D/purple_boy.jpg";
import yellowBoy from "../../../assets/unit7/sound/Page 63 - D/yellow_boy.jpg";

import blueGirl from "../../../assets/unit7/sound/Page 63 - D/blue_girl.png";
import orangeGirl from "../../../assets/unit7/sound/Page 63 - D/orang_girl.jpg";

/* =====================================================
   AUDIO
===================================================== */

import questionAudio from "../../../assets/unit7/sound/Page 63 - D/What's the matter.mp3";
import answerAudio from "../../../assets/unit7/sound/Page 63 - D/I'm Sad.mp3";

/* =====================================================
   DATA
===================================================== */

const dialogue = [
  {
    id: "question",
    text: "What’s the matter?",
    audio: questionAudio,
  },

  {
    id: "answer",
    text: "I’m sad.",
    audio: answerAudio,
  },
];

const activityPictures = [
  {
    id: 1,
    image: blueGirl,
    alt: "A sad child.",
  },

  {
    id: 2,
    image: orangeGirl,
    alt: "A girl who feels sad.",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Unit7_Page6_Q1 = () => {
  const audioRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);

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
     KEYBOARD
  ================================================= */

  const handleDialogueKeyDown = (e, item) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();

    e.stopPropagation();

    playAudio(item.id, item.audio);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <div className="unit7-page6-q1-wrapper">
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="D"
          title="Ask and answer."
          subTitle="Listen and practice asking and answering."
        />

        {/* =================================================
            DIALOGUE
        ================================================= */}

        <div className="unit7-page6-q1-dialogue">
          {/* QUESTION */}

          <div className="unit7-page6-q1-dialogue-item">
            <img
              src={purpleBoy}
              alt="A boy asking a question."
              className="unit7-page6-q1-speaker-img"
            />

            <div
              role="button"
              tabIndex={0}
              aria-label="Play audio: What's the matter?"
              className="unit7-page6-q1-bubble"
              onClick={() => playAudio(dialogue[0].id, dialogue[0].audio)}
              onKeyDown={(e) => handleDialogueKeyDown(e, dialogue[0])}
            >
              What’s the matter?
              {playingId === dialogue[0].id && (
                <FaVolumeUp
                  size={15}
                  aria-hidden="true"
                  className="unit7-page6-q1-audio-icon"
                />
              )}
            </div>
          </div>

          {/* ANSWER */}

          <div className="unit7-page6-q1-dialogue-item">
            <div
              role="button"
              tabIndex={0}
              aria-label="Play audio: I'm sad."
              className="unit7-page6-q1-bubble"
              onClick={() => playAudio(dialogue[1].id, dialogue[1].audio)}
              onKeyDown={(e) => handleDialogueKeyDown(e, dialogue[1])}
            >
              I’m sad.
              {playingId === dialogue[1].id && (
                <FaVolumeUp
                  size={15}
                  aria-hidden="true"
                  className="unit7-page6-q1-audio-icon"
                />
              )}
            </div>

            <img
              src={yellowBoy}
              alt="A sad boy answering."
              className="unit7-page6-q1-speaker-img"
            />
          </div>
        </div>

        {/* =================================================
            ACTIVITY PICTURES
        ================================================= */}

        <div className="unit7-page6-q1-pictures">
          {activityPictures.map((item) => (
            <div key={item.id} className="unit7-page6-q1-picture-item">
              <span className="unit7-page6-q1-number">{item.id}</span>

              <img
                src={item.image}
                alt={item.alt}
                className="unit7-page6-q1-activity-img"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Unit7_Page6_Q1;
