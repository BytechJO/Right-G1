import React, { useRef, useState } from "react";

import "./Unit6_Page6_Q1.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   IMAGES
===================================================== */

import greenBoy from "../../../assets/unit6/sounds/Page 51 - D/green_boy.png";
import girl from "../../../assets/unit6/sounds/Page 51 - D/gril.jpg";
import redBoy from "../../../assets/unit6/sounds/Page 51 - D/red_boy.jpg";

import kiteGirl from "../../../assets/unit6/sounds/Page 51 - D/kite_girl.png";
import boyRide from "../../../assets/unit6/sounds/Page 51 - D/boy_ride.png";
import musicBoy from "../../../assets/unit6/sounds/Page 51 - D/music_boy.png";

/* =====================================================
   AUDIO
===================================================== */

import questionAudio from "../../../assets/unit6/sounds/Page 51 - D/Can you sail a boat.mp3";
import yesAudio from "../../../assets/unit6/sounds/Page 51 - D/Yes, I can.mp3";
import noAudio from "../../../assets/unit6/sounds/Page 51 - D/No, I can't.mp3";

/* =====================================================
   DATA
===================================================== */

const dialogue = [
  {
    id: "question",
    text: "Can you sail a boat?",
    audio: questionAudio,
  },

  {
    id: "yes",
    text: "Yes, I can.",
    audio: yesAudio,
  },

  {
    id: "no",
    text: "No, I can’t.",
    audio: noAudio,
  },
];

const activityPictures = [
  {
    id: 1,
    image: kiteGirl,
    alt: "A girl flying a kite.",
  },

  {
    id: 2,
    image: boyRide,
    alt: "A boy riding a bicycle.",
  },

  {
    id: 3,
    image: musicBoy,
    alt: "A boy playing a musical instrument.",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Unit6_Page6_Q1 = () => {
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
    <div className="unit6-page6-q1-wrapper">
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="D"
          title="Ask and answer."
          subTitle="Use the pictures to ask and answer about what you can do."
        />

        {/* =================================================
            DIALOGUE
        ================================================= */}

        <div className="unit6-page6-q1-dialogue">
          {/* QUESTION */}

          <div className="unit6-page6-q1-dialogue-item">
            <img
              src={greenBoy}
              alt="A boy asking a question."
              className="unit6-page6-q1-speaker-img"
            />

            <div
              role="button"
              tabIndex={0}
              aria-label="Play audio: Can you sail a boat?"
              className="unit6-page6-q1-bubble"
              onClick={() => playAudio(dialogue[0].id, dialogue[0].audio)}
              onKeyDown={(e) => handleDialogueKeyDown(e, dialogue[0])}
            >
              Can you sail a boat?
              {playingId === dialogue[0].id && (
                <FaVolumeUp
                  size={15}
                  aria-hidden="true"
                  className="unit6-page6-q1-audio-icon"
                />
              )}
            </div>
          </div>

          {/* YES */}

          <div className="unit6-page6-q1-dialogue-item">
            <div
              role="button"
              tabIndex={0}
              aria-label="Play audio: Yes, I can."
              className="unit6-page6-q1-bubble"
              onClick={() => playAudio(dialogue[1].id, dialogue[1].audio)}
              onKeyDown={(e) => handleDialogueKeyDown(e, dialogue[1])}
            >
              Yes, I can.
              {playingId === dialogue[1].id && (
                <FaVolumeUp
                  size={15}
                  aria-hidden="true"
                  className="unit6-page6-q1-audio-icon"
                />
              )}
            </div>

            <img
              src={girl}
              alt="A girl answering yes."
              className="unit6-page6-q1-speaker-img"
            />
          </div>

          {/* NO */}

          <div className="unit6-page6-q1-dialogue-item">
            <div
              role="button"
              tabIndex={0}
              aria-label="Play audio: No, I can't."
              className="unit6-page6-q1-bubble"
              onClick={() => playAudio(dialogue[2].id, dialogue[2].audio)}
              onKeyDown={(e) => handleDialogueKeyDown(e, dialogue[2])}
            >
              No, I can’t.
              {playingId === dialogue[2].id && (
                <FaVolumeUp
                  size={15}
                  aria-hidden="true"
                  className="unit6-page6-q1-audio-icon"
                />
              )}
            </div>

            <img
              src={redBoy}
              alt="A boy answering no."
              className="unit6-page6-q1-speaker-img"
            />
          </div>
        </div>

        {/* =================================================
            ACTIVITY PICTURES
        ================================================= */}

        <div className="unit6-page6-q1-pictures">
          {activityPictures.map((item) => (
            <div key={item.id} className="unit6-page6-q1-picture-item">
              <span className="unit6-page6-q1-number">{item.id}</span>

              <img
                src={item.image}
                alt={item.alt}
                className="unit6-page6-q1-activity-img"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Unit6_Page6_Q1;
