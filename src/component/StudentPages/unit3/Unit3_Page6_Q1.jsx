import React, { useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import sound1 from "../../../assets/unit3/Page 27 - D/Listen!.mp3";
import sound2 from "../../../assets/unit3/Page 27 - D/Quiet!.mp3";
import sound3 from "../../../assets/unit3/Page 27 - D/Open your book.mp3";
import sound4 from "../../../assets/unit3/Page 27 - D/Take our your pencil..mp3";
import ExerciseHeader from "../../ExerciseHeader";

const Unit3_Page6_Q1 = () => {
  const audioRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const items = [
    {
      id: 1,
      number: "1",
      text: "Listen!",
      sound: sound1,
    },
    {
      id: 2,
      number: "2",
      text: "Quiet!",
      sound: sound2,
    },
    {
      id: 3,
      number: "3",
      text: "Open your book.",
      sound: sound3,
    },
    {
      id: 4,
      number: "4",
      text: "Take out your pencil.",
      sound: sound4,
    },
  ];

  const playSound = (item) => {
    if (!item.sound) return;

    // وقف أي صوت شغال
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(item.sound);

    audioRef.current = audio;

    setActiveId(item.id);

    audio.play().catch(() => {
      setActiveId(null);
    });

    audio.onended = () => {
      setActiveId(null);
    };

    audio.onerror = () => {
      setActiveId(null);
    };
  };

  const handleKeyDown = (e, item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      playSound(item);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div className="div-forall mb-10">
        <ExerciseHeader
          sectionLetter="D"
          title="Act out with a friend."
          subTitle="tap each card to hear it ."
        />

        {/* Sound boxes */}
        {/* Sound boxes */}
        <div
          className="
    flex
    flex-wrap
    items-center
    justify-center
    content-center
    gap-6
    min-h-[55vh]
  "
        >
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <div key={item.id} className="flex items-start gap-2">
                <span className="font-bold text-[#243b7b] text-lg pt-2">
                  {item.number}
                </span>

                <button
                  type="button"
                  onClick={() => playSound(item)}
                  onKeyDown={(e) => handleKeyDown(e, item)}
                  aria-label={`${item.text}. Press Enter or Space to play audio.`}
                  aria-pressed={isActive}
                  className={`
            relative
            min-w-[130px]
            px-5
            py-3
            rounded-xl
            border-2
            border-black
            font-medium
            text-lg
            transition-all
            duration-200
            flex
            items-center
            justify-center
            gap-2
            outline-none

            ${
              isActive
                ? "bg-yellow-300 scale-105 shadow-lg"
                : "bg-white hover:bg-gray-50"
            }

            focus-visible:ring-4
            focus-visible:ring-blue-400
            focus-visible:ring-offset-2
          `}
                >
                  <span>{item.text}</span>

                  {isActive && (
                    <FaVolumeUp
                      className="text-xl animate-pulse"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Unit3_Page6_Q1;
