import React, { useEffect, useRef, useState } from "react";

import "./Unit8_Page6_Q2.css";

import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   IMAGES
===================================================== */

import boy from "../../../assets/unit8/sound/Page 69 - E/boy.jpg";

import boyTouchHisNose from "../../../assets/unit8/sound/Page 69 - E/boy_touch_his_nose.jpg";

import girlTouchHerKnee from "../../../assets/unit8/sound/Page 69 - E/girl_touch_her_knee.jpg";

import teacherTouchHerHead from "../../../assets/unit8/sound/Page 69 - E/teacher_touch_her_head.png";

/* =====================================================
   AUDIO
===================================================== */

import touchYourNoseAudio from "../../../assets/unit8/sound/Page 69 - E/Touch your nose..mp3";

/* =====================================================
   DATA
===================================================== */

const activityImages = [
  {
    id: 1,
    image: boyTouchHisNose,
    alt: "A boy touching his nose.",
  },

  {
    id: 2,
    image: teacherTouchHerHead,
    alt: "A teacher touching her head while students watch and copy the action.",
  },

  {
    id: 3,
    image: girlTouchHerKnee,
    alt: "A girl touching her knee while standing outdoors.",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

const Unit8_Page6_Q2 = () => {
  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

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

    setIsPlaying(false);
  };

  /* =====================================================
     PLAY AUDIO
  ===================================================== */

  const playAudio = () => {
    stopAudio();

    const audio = new Audio(touchYourNoseAudio);

    audioRef.current = audio;

    setIsPlaying(true);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsPlaying(false);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsPlaying(false);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsPlaying(false);
    };
  };

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleSentenceKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      playAudio();
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="unit8-page6-q2-wrapper">
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="E"
          title="Look, say, and act with a friend."
          subTitle="Listen, then practice the action with a friend."
        />

        <div className="unit8-page6-q2-content">
          {/* =================================================
              LEFT SPEAKER
          ================================================= */}

          <div className="unit8-page6-q2-speaker">
            <div
              role="button"
              tabIndex={0}
              aria-label="Touch your nose. Press Enter or Space to hear the sentence."
              className="unit8-page6-q2-bubble"
              onClick={playAudio}
              onKeyDown={handleSentenceKeyDown}
            >
              <span>Touch your nose.</span>

              {isPlaying && (
                <FaVolumeUp
                  size={14}
                  aria-hidden="true"
                  className="unit8-page6-q2-audio-icon"
                />
              )}
            </div>

            <img
              src={boy}
              alt="A boy giving an instruction."
              className="unit8-page6-q2-boy"
            />
          </div>

          {/* =================================================
              ACTIVITY IMAGES
          ================================================= */}

          <div className="unit8-page6-q2-images">
            {activityImages.map((item) => (
              <div key={item.id} className="unit8-page6-q2-image-box">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="unit8-page6-q2-activity-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unit8_Page6_Q2;
