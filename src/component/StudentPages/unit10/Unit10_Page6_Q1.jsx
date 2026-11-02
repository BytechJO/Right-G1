import React, { useEffect, useRef, useState } from "react";

import "./Unit10_Page6_Q1.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   IMAGES
===================================================== */

import boy from "../../../assets/unit10/sound/Page 87 - D/boy.png";
import girl from "../../../assets/unit10/sound/Page 87 - D/gril.jpg";

import iceCream from "../../../assets/unit10/sound/Page 87 - D/ice_cream.jpg";
import bread from "../../../assets/unit10/sound/Page 87 - D/bread.png";
import milk from "../../../assets/unit10/sound/Page 87 - D/milk.jpg";

/* =====================================================
   AUDIO
===================================================== */

import questionAudio from "../../../assets/unit10/sound/Page 87 - D/Do you want an apple.mp3";
import answerAudio from "../../../assets/unit10/sound/Page 87 - D/Yes I do..mp3";

import breadAudio from "../../../assets/unit10/sound/Page 87 - D/Bread.mp3";
import iceCreamAudio from "../../../assets/unit10/sound/Page 87 - D/ice cream.mp3";
import milkAudio from "../../../assets/unit10/sound/Page 87 - D/Milk.mp3";

/* =====================================================
   DATA
===================================================== */

const pictureItems = [
  {
    id: 1,
    image: iceCream,
    alt: "A glass of pink ice cream topped with a cherry.",
    text: "ice cream",
    audio: iceCreamAudio,
  },

  {
    id: 2,
    image: bread,
    alt: "A loaf and slice of bread on a plate.",
    text: "bread",
    audio: breadAudio,
  },

  {
    id: 3,
    image: milk,
    alt: "A carton of milk with a cow picture.",
    text: "milk",
    audio: milkAudio,
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Unit10_Page6_Q1 = () => {
  const audioRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);

  /* =====================================================
     STOP AUDIO
  ===================================================== */

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

  /* =====================================================
     PLAY AUDIO
  ===================================================== */

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

    audio.onerror = audio.onended;
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleKeyDown = (event, id, src) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      playAudio(id, src);
    }
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="unit10-page6-q1-wrapper">
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="D"
          title="Ask and answer."
          subTitle="Listen, then ask and answer about the food and drinks."
        />

        {/* =================================================
            DIALOGUE
        ================================================= */}

        <div className="unit10-page6-q1-dialogue">
          {/* QUESTION */}

          <div className="unit10-page6-q1-dialogue-item">
            <img
              src={boy}
              alt="A smiling boy asking a question."
              className="unit10-page6-q1-speaker-img"
            />

            <div
              role="button"
              tabIndex={0}
              aria-label="Play audio: Do you want an apple?"
              className="unit10-page6-q1-bubble"
              onClick={() => playAudio("question", questionAudio)}
              onKeyDown={(event) =>
                handleKeyDown(event, "question", questionAudio)
              }
            >
              Do you want an apple?
              {playingId === "question" && (
                <FaVolumeUp
                  aria-hidden="true"
                  className="unit10-page6-q1-audio-icon"
                />
              )}
            </div>
          </div>

          {/* ANSWER */}

          <div className="unit10-page6-q1-dialogue-item">
            <div
              role="button"
              tabIndex={0}
              aria-label="Play audio: Yes, I do."
              className="unit10-page6-q1-bubble"
              onClick={() => playAudio("answer", answerAudio)}
              onKeyDown={(event) => handleKeyDown(event, "answer", answerAudio)}
            >
              Yes, I do.
              {playingId === "answer" && (
                <FaVolumeUp
                  aria-hidden="true"
                  className="unit10-page6-q1-audio-icon"
                />
              )}
            </div>

            <img
              src={girl}
              alt="A girl thinking about an apple while answering yes."
              className="unit10-page6-q1-speaker-img"
            />
          </div>
        </div>

        {/* =================================================
            PICTURES
        ================================================= */}

        <div className="unit10-page6-q1-pictures">
          {pictureItems.map((item) => (
            <div key={item.id} className="unit10-page6-q1-picture-item">
              <span className="unit10-page6-q1-number">{item.id}</span>

              <div
                role="button"
                tabIndex={0}
                aria-label={`Play audio: ${item.text}`}
                className="unit10-page6-q1-picture-box"
                onClick={() => playAudio(`picture-${item.id}`, item.audio)}
                onKeyDown={(event) =>
                  handleKeyDown(event, `picture-${item.id}`, item.audio)
                }
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="unit10-page6-q1-picture-img"
                />

                {playingId === `picture-${item.id}` && (
                  <FaVolumeUp
                    aria-hidden="true"
                    className="unit10-page6-q1-picture-audio-icon"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Unit10_Page6_Q1;
